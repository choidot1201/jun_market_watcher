# STATUS

## What's running now

- Deployed static site: https://choidot1201.github.io/jun_market_watcher/
  (repo `choidot1201/jun_market_watcher`, public, GitHub Pages from `main` / root).
- Full nav shell, 2026-09-17: **Home / Equity / Crypto / Biopharma / K-Beauty / Portfolio**,
  matching mooboard.xyz's tab set minus Commodities/Heatmap/Calendar (per user request).
- **Crypto** and **K-Beauty** are live and verified (local + deployed, both themes, no
  console errors). **Equity, Biopharma, Portfolio** are "coming next" placeholders —
  blocked on a stock-quote data-source decision, see below.
- **K-Beauty tab, revised 2026-09-17 (same day, second pass):** now a plain `<iframe>`
  embedding `https://choidot1201.github.io/Amazon-Ranking-dashboard/` — per explicit user
  request to show that exact site's format rather than the 5-sub-tab tracker built
  earlier that day. That earlier build (`kbeauty.js` + `sheet-data.js` + `config.js` +
  `silicon2-data.js`, reading the `beauty_personal_care_top100_live` Google Sheet
  client-side) has been deleted from this repo — still exists in `../mooboard-clone` if
  ever needed again. This tab now has zero data logic of its own; freshness is entirely
  `Amazon-Ranking-dashboard`'s concern, not this repo's.
- Crypto tab reads CoinGecko's public `coins/markets` endpoint client-side, no key, no
  proxy (CoinGecko sends `Access-Control-Allow-Origin: *`).

## Blocked / needs owner decision

- **Equity/Biopharma/Portfolio need a stock-quote source that works from a static site.**
  Confirmed by hand: Yahoo Finance's chart API sends no CORS header, so browsers block
  direct requests from `choidot1201.github.io`. `stooq.com`'s CSV export is the same —
  no CORS header either. `mooboard-clone`'s `server.py` works around this with a Python
  proxy, but keeping that running continuously defeats the "recurring without me" goal.
  Options not yet decided with the user:
  1. Small serverless proxy (e.g. Cloudflare Worker) in front of Yahoo Finance — free
     tier, no maintenance, keeps this site static. **New external service — ask before
     adopting**, per global rule.
  2. A different quote API that already supports browser CORS (not yet researched for
     Korean tickers specifically — most free options are US-only or require a paid key).
  3. Run `server.py` on an always-on host (not "recurring without me" in the serverless
     sense, but simpler if the user's fine with a small VPS or an always-on Mac).
- The embedded `Amazon-Ranking-dashboard` still ultimately depends on the same
  Apps-Script-fed Google Sheet as before — nobody is monitoring that trigger for silent
  failure, but that's now entirely that other repo's concern, not this one's.

## Related projects in this data neighborhood

- `../amazon_beauty_dashboard` (deployed as `choidot1201.github.io/Amazon-Ranking-dashboard`)
  — the site now embedded directly in this project's K-Beauty tab via `<iframe>`. Any
  future change to that dashboard shows up here automatically; no code to keep in sync.
- `../mooboard-clone` — has its own broader multi-asset dashboard
  (Equity/Biopharma/Coverage/Portfolio via `server.py`'s Yahoo proxy) and its own,
  different K-beauty sub-tab tracker (not used here anymore). This project intentionally
  does not include a `Coverage` tab (dropped per user's explicit tab list) and will
  re-implement Equity/Biopharma from scratch once the quote-source decision below is
  made, rather than reusing `server.py`.
- `../crawl_amazon_beauty_bestsellers` — retired, confirmed dead 2026-08-25. GitHub
  Actions runs failed with `crawled: 0, blocked` on all 5 regions (Amazon blocks
  GH-hosted runner IPs on list pages, not just `/dp/` detail pages). Irrelevant here.

## Next actions

1. Decide the Equity/Biopharma/Portfolio quote-source question above with the user, then
   build those three tabs.
2. Optional: crypto holdings could power a first cut of Portfolio today (CoinGecko has no
   CORS problem) even before equity quotes are solved.
