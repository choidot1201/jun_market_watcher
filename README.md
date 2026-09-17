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
| K-Beauty | live | embeds [Jun's Amazon ranking tracker](https://choidot1201.github.io/Amazon-Ranking-dashboard/) — see below |
| Equity | coming next | blocked on a stock-quote proxy decision (see below) |
| Biopharma | coming next | same blocker as Equity |
| Portfolio | coming next | needs live pricing for whatever's held; same blocker for equity holdings |

### K-Beauty tab

An `<iframe>` embedding `https://choidot1201.github.io/Amazon-Ranking-dashboard/`
(repo `choidot1201/Amazon-Ranking-dashboard`) directly — Jun's own separately-maintained
Amazon Beauty Top-100 rank tracker (region tabs, K-beauty-only toggle, movers, brand
matrix + entry-trend chart). This tab has no code of its own beyond the `<iframe>`; any
change to that dashboard shows up here automatically on next load.

An earlier version of this tab (2026-09-17, same day) built its own 5-sub-tab tracker
(Charting SKUs / Rank movement / Silicon2 brand ranking / Universe / Unmapped, ported
from `../mooboard-clone`). Replaced per user request to show the exact
Amazon-Ranking-dashboard format instead — that code (`kbeauty.js`, `sheet-data.js`,
`config.js`, `silicon2-data.js`) has been removed from this repo; it still exists in
`../mooboard-clone` if needed again.

### Why Equity/Biopharma/Portfolio aren't live yet

They need real-time-ish stock quotes. Yahoo Finance has the data but sends no
`Access-Control-Allow-Origin` header, so a static site's browser can't call it directly
(confirmed by hand — see `STATUS.md`). The old `mooboard-clone` project works around this
with a Python proxy (`server.py`), but running that continuously would defeat the
"recurring without me" goal — it needs an always-on machine.

The likely fix is a small serverless proxy (e.g. a Cloudflare Worker) sitting between this
static site and Yahoo Finance — free tier, no maintenance, keeps everything else static.
Not yet built; **do not silently add this or any other new external service** — ask first.

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
