# Clinic leak calculator

How much revenue a clinic loses each month to two quiet leaks: enquiries nobody answered within an hour, and no-shows nobody rebooked. One file, no dependencies, and you can drop it on any website.

**Try it:** [ganeshdatta96.github.io/clinic-leak-calculator](https://ganeshdatta96.github.io/clinic-leak-calculator/)

Built by [Ganesh Datta](https://ganeshdatta.me). It's the same calculator as the one on the homepage of ganeshdatta.me.

## Embed it

```html
<script src="https://ganeshdatta96.github.io/clinic-leak-calculator/leak.js" defer></script>
<clinic-leak-calculator></clinic-leak-calculator>
```

Set your own starting numbers with attributes:

```html
<clinic-leak-calculator enq="350" miss="30" pv="180" appts="600" ns="12" vv="95"></clinic-leak-calculator>
```

| Attribute | Meaning | Default |
| --- | --- | --- |
| `enq` | Enquiries a month | 200 |
| `miss` | % not answered within an hour | 25 |
| `pv` | Value of a new patient ($) | 120 |
| `appts` | Appointments a month | 400 |
| `ns` | % no-shows | 15 |
| `vv` | Value of a visit ($) | 18 |
| `no-credit` | Hides the "Calculator by Ganesh Datta" link | off |

Match your brand with CSS custom properties: `--leak-bg`, `--leak-text`, `--leak-muted`, `--leak-line` and `--leak-accent`.

```css
clinic-leak-calculator { --leak-bg: #fff; --leak-text: #111; --leak-accent: #0a7d55; }
```

The element fires a `leak-change` event with `{ missed, noshow, total }` whenever the numbers change, so you can pass the result into your own form or analytics.

## The math

```
missed enquiries = enquiries × % unanswered × 40% would have booked × value of a new patient
no-shows         = appointments × % no-shows × 50% rebookable × value of a visit
```

The 40% and 50% are deliberate, conservative assumptions, shown to the user in the widget. Change `BOOK_RATE` and `REBOOK_RATE` in `leak.js` if your data says otherwise. It's an estimate to start a conversation, not a forecast.

## Use the math in code

```js
const { leak } = require("./leak.js");
leak({ enq: 200, miss: 25, pv: 120, appts: 400, ns: 15, vv: 18 });
// { missed: 2400, noshow: 540, total: 2940 }
```

## Check

```bash
node test.js
```

## License

MIT
