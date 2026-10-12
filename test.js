const assert = require("node:assert");
const { leak, DEFAULTS } = require("./leak.js");

assert.deepStrictEqual(leak(DEFAULTS), { missed: 2400, noshow: 540, total: 2940 });
assert.deepStrictEqual(leak({ enq: 0, miss: 0, pv: 0, appts: 0, ns: 0, vv: 0 }), { missed: 0, noshow: 0, total: 0 });
assert.strictEqual(leak({ ...DEFAULTS, miss: 100, ns: 0 }).total, 200 * 0.4 * 120);
console.log("ok");
