/*! clinic-leak-calculator · MIT · Ganesh Datta · https://ganeshdatta.me */
(function (root) {
  // Assumptions: 40% of unanswered enquiries would have booked; half of no-shows can be rebooked with reminders.
  var BOOK_RATE = 0.4;
  var REBOOK_RATE = 0.5;
  var DEFAULTS = { enq: 200, miss: 25, pv: 120, appts: 400, ns: 15, vv: 18 };

  function leak(v) {
    var missed = v.enq * v.miss / 100 * BOOK_RATE * v.pv;
    var noshow = v.appts * v.ns / 100 * REBOOK_RATE * v.vv;
    return { missed: Math.round(missed), noshow: Math.round(noshow), total: Math.round(missed + noshow) };
  }

  var api = { leak: leak, DEFAULTS: DEFAULTS, BOOK_RATE: BOOK_RATE, REBOOK_RATE: REBOOK_RATE };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.ClinicLeak = api;
  if (typeof HTMLElement === "undefined" || !root.customElements || customElements.get("clinic-leak-calculator")) return;

  var FIELDS = [
    ["enq", "Enquiries a month", 0, null],
    ["miss", "% not answered within an hour", 0, 100],
    ["pv", "Value of a new patient ($)", 0, null],
    ["appts", "Appointments a month", 0, null],
    ["ns", "% no-shows", 0, 100],
    ["vv", "Value of a visit ($)", 0, null]
  ];

  var CSS = ":host{--leak-bg:#10120e;--leak-text:#efe8dc;--leak-muted:#a39c90;--leak-line:rgba(239,232,220,.14);--leak-accent:#d6ff4a;" +
    "display:block;font-family:Outfit,'Segoe UI',system-ui,sans-serif;color:var(--leak-text);background:var(--leak-bg);border:1px solid var(--leak-line);border-radius:14px;padding:20px;max-width:640px}" +
    "h3{margin:0 0 4px;font-size:1.25rem}p{margin:0;color:var(--leak-muted);font-size:.9rem}" +
    ".grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin:16px 0}" +
    "label{display:grid;gap:6px;font-size:.85rem;color:var(--leak-muted)}" +
    "input{font:inherit;color:var(--leak-text);background:transparent;border:1px solid var(--leak-line);border-radius:8px;padding:10px;min-height:44px;box-sizing:border-box}" +
    "input:focus-visible{outline:2px solid var(--leak-accent);outline-offset:1px}" +
    "output{display:block;padding:14px;border:1px solid var(--leak-line);border-radius:10px;color:var(--leak-text)}" +
    "strong{color:var(--leak-accent)}a{color:var(--leak-muted);font-size:.8rem}.credit{margin-top:10px}";

  var fmt = function (n) { return "$" + n.toLocaleString("en-US"); };

  class ClinicLeakCalculator extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      var shadow = this.attachShadow({ mode: "open" });
      var self = this;
      var inputs = FIELDS.map(function (f) {
        var value = self.getAttribute(f[0]) || DEFAULTS[f[0]];
        return "<label>" + f[1] + "<input type=\"number\" name=\"" + f[0] + "\" value=\"" + Number(value) + "\" min=\"" + f[2] + "\"" + (f[3] ? " max=\"" + f[3] + "\"" : "") + "></label>";
      }).join("");
      var credit = this.hasAttribute("no-credit") ? "" :
        "<p class=\"credit\"><a href=\"https://ganeshdatta.me\" target=\"_blank\" rel=\"noopener\">Calculator by Ganesh Datta</a></p>";
      shadow.innerHTML = "<style>" + CSS + "</style>" +
        "<h3>Your monthly leak, in dollars</h3>" +
        "<p>Assumes " + BOOK_RATE * 100 + "% of missed enquiries would have booked and " + REBOOK_RATE * 100 + "% of no-shows can be rebooked with reminders.</p>" +
        "<form class=\"grid\">" + inputs + "</form><output aria-live=\"polite\"></output>" + credit;
      var form = shadow.querySelector("form");
      var out = shadow.querySelector("output");
      var render = function () {
        var v = {};
        FIELDS.forEach(function (f) { v[f[0]] = Math.max(0, Number(form.elements[f[0]].value) || 0); });
        var r = leak(v);
        out.innerHTML = "<strong>About " + fmt(r.total) + " a month.</strong> " + fmt(r.missed) +
          " from enquiries nobody answered in time, " + fmt(r.noshow) + " from no-shows nobody rebooked.";
        self.dispatchEvent(new CustomEvent("leak-change", { detail: r, bubbles: true }));
      };
      form.addEventListener("input", render);
      render();
    }
  }
  customElements.define("clinic-leak-calculator", ClinicLeakCalculator);
})(typeof window !== "undefined" ? window : globalThis);
