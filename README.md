# Jun Market Watcher

A personal market cockpit, structured like [mooboard.xyz](https://mooboard.xyz) (minus
its Calendar/Heatmap tabs): **Home / Equity / Crypto / Biopharma / K-Beauty / Portfolio**.

Static site, no backend, no build step — `index.html` + a handful of `.js`/`.css` files,
deployed as-is to GitHub Pages.

## Tab status

| Tab | Status | Data source |
|---|---|---|
| Home | live | summarizes the tabs below |
| Crypto | live | [CoinGecko](https://www.coingecko.com/en/api) public API (CORS-open, no proxy needed) |
| K-Beauty | live | Jun's own Google Sheet — see below |
| Equity | coming next | blocked on a stock-quote proxy decision (see below) |
| Biopharma | coming next | same blocker as Equity |
| Portfolio | coming next | needs live pricing for whatever's held; same blocker for equity holdings |

### Why Equity/Biopharma/Portfolio aren't live yet

They need real-time-ish stock quotes. Yahoo Finance has the data but sends no
`Access-Control-Allow-Origin` header, so a static site's browser can't call it directly
(confirmed by hand — see `STATUS.md`). The old `mooboard-clone` project works around this
with a Python proxy (`server.py`), but running that continuously would defeat the
"recurring without me" goal — it needs an always-on machine.

The likely fix is a small serverless proxy (e.g. a Cloudflare Worker) sitting between this
static site and Yahoo Finance — free tier, no maintenance, keeps everything else static.
Not yet built; **do not silently add this or any other new external service** — ask first.

### K-Beauty tab

Ported from [`../mooboard-clone`](../mooboard-clone)'s `kbeauty.js` (same 5 sub-tabs:
Charting SKUs / Rank movement / Silicon2 brand ranking / Universe / Unmapped), with its
Python CSV-reshaping (`server.py`) replaced by client-side `sheet-data.js` so it runs
without a backend.

- **Data source:** a Google Sheet (`beauty_personal_care_top100_live`) kept fresh by an
  **Apps Script time trigger inside the sheet itself** — not by this repo, not by any CI
  here. That's the "recurring without me" part for this tab: the sheet updates on its own
  schedule inside Google's infrastructure, and this site just reads whatever's currently
  in it on every page load, via the sheet's own CSV export
  (`docs.google.com/.../export?format=csv&gid=...`, which serves
  `Access-Control-Allow-Origin: *`).
- Why not scrape Amazon ourselves from GitHub Actions? We tried (see
  [`../crawl_amazon_beauty_bestsellers`](../crawl_amazon_beauty_bestsellers)) — Amazon
  now blocks GitHub-hosted runner IPs even on bestseller list pages, not just product
  pages. See `STATUS.md`.
- **Silicon2 brand ranking** sub-tab sources from Silicon2 (실리콘투, `257720.KQ`) IR
  materials — a 44-company brand→listed-company read-through in `silicon2-data.js`,
  copied verbatim from `mooboard-clone`.
- Update the brand-matching list in `KBEAUTY_BRAND_UNIVERSE` (`config.js`) — add a name
  and any aliases that show up in Amazon product titles.

### Crypto tab

Top 40 coins by market cap from CoinGecko's free public API, client-side, no key needed.
Rate-limited on their end — if it fails to load, wait a bit and reload.

## Local dev

```bash
python3 -m http.server 8935
```

then open `http://localhost:8935/`. Any static file server works — there's nothing to
build.

## Deploy

GitHub Pages, `Settings → Pages → Deploy from a branch → main / (root)`. Live at
https://choidot1201.github.io/jun_market_watcher/
