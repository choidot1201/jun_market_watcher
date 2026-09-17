# STATUS

## What's running now

- Static site (`index.html` + `config.js`/`sheet-data.js`/`kbeauty.js`/`silicon2-data.js`)
  reading live from the `beauty_personal_care_top100_live` Google Sheet
  (`1XQoI7SSuFKbuRAeD23uQIfJu3FBXEv__6rvm68Zfo80`), client-side, no backend.
- Verified locally 2026-09-17 against the live sheet: all 5 tabs (Charting SKUs, Rank
  movement, Silicon2 brand ranking, Universe, Unmapped) render real data, no console
  errors.
- **Data freshness depends entirely on an Apps Script trigger inside that Google Sheet**
  (confirmed by Jun, not inspected directly here — no edit access from this session).
  Last observed sheet update: 2026-09-15 05:24 KST. This site does not control, monitor,
  or alert on that trigger.
- Not yet deployed / pushed to GitHub. Sitting locally at
  `~/Desktop/Coding/jun_market_watcher`.

## Blocked / needs owner action

- No GitHub repo created yet for this project. Needs a decision: new repo under
  `choidot1201`, or reuse/retire `Amazon-Ranking-dashboard`?
- Nobody is monitoring the Apps Script trigger for silent failure. If the sheet stops
  updating, this site will keep rendering stale data with no warning banner.

## Related, now superseded by this project

- `../amazon_beauty_dashboard` — earlier dashboard reading a *different* set of sheet
  tabs from the same account; this project's K-beauty tab structure (5 sub-tabs) was
  ported from `../mooboard-clone/kbeauty.js` + `server.py` instead, then converted from
  server-proxied to client-side-fetched so it can run on GitHub Pages.
- `../crawl_amazon_beauty_bestsellers` — dead since 2026-08-25. GitHub Actions runs were
  failing with `crawled: 0, blocked` on all 5 regions (Amazon now blocks GH-hosted
  runner IPs on list pages, not just `/dp/` detail pages as its old STATUS.md assumed),
  and the git-commit step itself broke on an empty `artifacts/snapshots` path. Not
  fixed — this project's data comes from the separate, currently-working Apps
  Script–fed sheet instead.

## Next actions

1. Decide on a GitHub repo + Pages deploy (see protocol in
   `AI agent_Jchoi/A2-memory` — static site → GitHub Pages).
2. Optional: add a "data may be stale" banner if `bankedAt` from the sheet is more than
   N hours old, since nothing here currently detects a dead Apps Script trigger.
