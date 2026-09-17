# Jun Market Watcher — K-Beauty

A static, single-purpose clone of [mooboard.xyz/kbeauty](https://mooboard.xyz/kbeauty)'s
structure (minus the calendar/heatmap): tracks K-beauty brand/SKU rank movement on
Amazon Beauty Top 100 across five regions (US/UK/FR/ES/DE).

## How it works

- **No backend, no build step.** `index.html` + a handful of `.js`/`.css` files, deployed
  as-is to GitHub Pages.
- **Data source:** a Google Sheet (`beauty_personal_care_top100_live`) that Jun already
  runs, kept fresh by an **Apps Script time trigger inside the sheet itself** — not by
  this repo, not by any CI here. That's the "recurring without me" part: the sheet
  updates on its own schedule inside Google's infrastructure, and this site just reads
  whatever is currently in it on every page load.
- `sheet-data.js` fetches the sheet's own CSV export directly from the browser
  (`docs.google.com/.../export?format=csv&gid=...`, which serves
  `Access-Control-Allow-Origin: *`) and reshapes it client-side — no server, no proxy.
- Why not scrape Amazon ourselves from GitHub Actions? We tried (see
  [`../crawl_amazon_beauty_bestsellers`](../crawl_amazon_beauty_bestsellers)) — Amazon
  now blocks GitHub-hosted runner IPs even on list pages. See `STATUS.md`.

## Pages

- **Charting SKUs** — "brands moving" sidebar + per-SKU rank tracks (climb/fall)
- **Rank movement** — flat table of every rank change, all regions
- **Silicon2 brand ranking** — Top-10-by-year brand table sourced from Silicon2
  (실리콘투, `257720.KQ`) IR materials, with a brand→listed-company read-through
  (`silicon2-data.js`)
- **Universe** — every SKU currently tracked, cross-referenced by ASIN across regions
- **Unmapped** — SKUs ranking in the Top 100s that don't match any brand in the
  K-beauty universe (`config.js`'s `KBEAUTY_BRAND_UNIVERSE`)

## Local dev

```bash
python3 -m http.server 8935
```

then open `http://localhost:8935/`. Any static file server works — there's nothing to
build.

## Updating the brand universe

Edit `KBEAUTY_BRAND_UNIVERSE` in [`config.js`](config.js) — add a brand's name and any
aliases that show up in Amazon product titles. Ticker is optional; the Silicon2 tab
resolves parent companies independently via `silicon2-data.js`.

## Deploy

Static site → GitHub Pages, `Settings → Pages → Deploy from a branch → main / (root)`.
