# STATUS

## What's running now

- Deployed static site: https://choidot1201.github.io/jun_market_watcher/
  (repo `choidot1201/jun_market_watcher`, public, GitHub Pages from `main` / root).
- Full nav shell, 2026-09-17: **Home / Equity / Crypto / Biopharma / K-Beauty / Portfolio**,
  matching mooboard.xyz's tab set minus Commodities/Heatmap/Calendar (per user request).
- **Crypto** and **K-Beauty** are live and verified (local + deployed, both themes, no
  console errors). **Equity, Biopharma, Portfolio** are "coming next" placeholders —
  blocked on a stock-quote data-source decision, see below.
- K-Beauty tab reads the `beauty_personal_care_top100_live` Google Sheet
  (`1XQoI7SSuFKbuRAeD23uQIfJu3FBXEv__6rvm68Zfo80`) client-side. Kept fresh by an **Apps
  Script trigger inside the sheet itself** (confirmed by Jun, not inspected directly —
  no edit access from this session). Last observed sheet update: 2026-09-15 05:24 KST.
  This site does not control, monitor, or alert on that trigger.
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
- Nobody is monitoring the K-beauty sheet's Apps Script trigger for silent failure. If it
  stops updating, this site keeps rendering stale data with no warning banner.

## Related projects in this data neighborhood

- `../amazon_beauty_dashboard` — separate, older dashboard reading the *same* live
  K-beauty sheet as this project, different UI. Not merged; both still live.
- `../mooboard-clone` — original server-proxied version of this K-beauty tab, plus its
  own broader multi-asset dashboard (Equity/Biopharma/Coverage/Portfolio via
  `server.py`'s Yahoo proxy). This project intentionally does not include its `Coverage`
  tab (dropped per user's explicit tab list) and re-implements Equity/Biopharma from
  scratch once the quote-source decision above is made, rather than reusing `server.py`.
- `../crawl_amazon_beauty_bestsellers` — retired, confirmed dead 2026-08-25. GitHub
  Actions runs failed with `crawled: 0, blocked` on all 5 regions (Amazon blocks
  GH-hosted runner IPs on list pages, not just `/dp/` detail pages). Irrelevant to this
  project — K-beauty data comes from the separate, still-live Apps-Script-fed sheet.

## Next actions

1. Decide the Equity/Biopharma/Portfolio quote-source question above with the user, then
   build those three tabs.
2. Optional: add a "data may be stale" banner on the K-Beauty tab if `bankedAt` is more
   than N hours old, since nothing here currently detects a dead Apps Script trigger.
3. Optional: crypto holdings could power a first cut of Portfolio today (CoinGecko has no
   CORS problem) even before equity quotes are solved.
