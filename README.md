# الان (alan)

A working PWA prototype of **الان**, an inventory and sales app for shops that sell on several channels at once: in-store, Instagram, Telegram, a website, Digikala and Snapp Shop. Persian, right to left, mobile first.

Change a price or stock count once and send it to every channel. Record sales, see reports, and keep each variant's price and stock per channel.

## Run it

It's plain HTML, CSS and JavaScript: no build step and no dependencies.

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

On a desktop browser the app shows inside a phone frame, with a controller panel beside it for jumping to any screen or state. On a phone it runs full screen.

**Demo login:** any number starting with `09`, then the code **۴۸۲۹۱۵** (482915). Or tap «دیدن نسخه نمونه» to skip sign-in.

## Install as an app

Host the folder over HTTPS, for example with GitHub Pages (Settings → Pages → deploy from `main`, root folder). Browsers then offer "Add to Home Screen", and the service worker (`sw.js`) caches the app so it opens offline.

## What works

- **Sign-in:** phone number check, OTP with a wrong-code state, shop details, channel connections, free trial
- **Home:** today's sales, orders, net profit and average order; 7-day chart; pending sends; quick actions; low stock; recent sales
- **Products:** search, category tabs, sort and filter, merged or per-variant view
- **Product detail:** collapsing photo, per-variant tabs, SKU and barcode, warehouse stock, price and stock per channel with a separate price or sellable stock per variant, best-selling variants, and a send button that only appears when something changed
- **Add product** in 3 steps, with auto-generated variants and SKUs
- **Record sale:** catalog, variant picker, cart, success screen, cancel
- **Sync:** send to channels with per-channel progress (Snapp Shop fails until reconnected), pull from channels with differences to resolve, version history and restore
- **Reports:** period filter, chart, channel share, best sellers, sales list
- **Also:** pricing rules, channels, team, plans, notifications, barcode scan (simulated), AI assistant (simulated), settings
- **Demo states** (Settings, or the controller panel): offline, subscription ending, empty store, restart sign-in, reset demo data

Everything is stored in the browser's `localStorage`. Channel connections, payment, scanning and the assistant are simulated with demo data.

## Files

| File | What it holds |
|---|---|
| `index.html` | Entry page, manifest and icons |
| `styles.css` | Design tokens (Instagram neutrals, lapis accent `#3E49F5`), layout and animations |
| `core.js` | Icons, helpers, navigation stack, sheets, toasts, tab bar |
| `data.js` | Demo store, channels, pricing rules, sync and per-variant channel logic |
| `screens-a.js` | Home, products, product detail, variants and SKU, add product, send and pull, scanner, stock, assistant, notifications |
| `screens-b.js` | Reports, sales, record sale, cart, profile, channels, pricing rules, history, plans, team, settings |
| `ctl.js` | Desktop controller panel beside the phone |
| `ob.js` | Sign-in flow and app start |
| `sw.js`, `manifest.webmanifest` | Offline cache and install details |

The Figma design lives in the alan.ir file, page "📱 Hi-Fi".
