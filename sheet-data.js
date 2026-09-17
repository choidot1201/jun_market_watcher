// Client-side reader for Jun's own Amazon Top-100 Google Sheet.
//
// The sheet is filled by an Apps Script trigger running inside Google's own
// infrastructure — Amazon now blocks GitHub Actions' and most cloud IP
// ranges even on list pages (see STATUS.md), so scraping from a static
// site's CI/host is not viable. Reading the sheet's own CSV export straight
// from the browser sidesteps that entirely: no backend, no proxy, and the
// export endpoint sends `Access-Control-Allow-Origin: *` so it works from
// any origin, GitHub Pages included.
//
// This mirrors the Python reshaping logic that used to live in
// mooboard-clone/server.py's kbeauty section — same GIDs, same column
// layout, same brand matching — just ported to run client-side instead of
// behind a Flask-style proxy.

const KBEAUTY_SHEET_ID = '1XQoI7SSuFKbuRAeD23uQIfJu3FBXEv__6rvm68Zfo80';
const KBEAUTY_SHEET_EDIT_URL = `https://docs.google.com/spreadsheets/d/${KBEAUTY_SHEET_ID}/edit`;

const KBEAUTY_TOP100_GIDS = {
  US: '536693645',
  UK: '1989361983',
  FR: '145558734',
  ES: '569071856',
  DE: '1323444649',
};
const KBEAUTY_CATALOG_GID = '1685424322';
const KBEAUTY_RANK_CHANGES_GID = '226764932';
const KBEAUTY_RANK_HISTORY_GID = '1304898329';

function kbeautyCsvUrl(gid) {
  return `https://docs.google.com/spreadsheets/d/${KBEAUTY_SHEET_ID}/export?format=csv&gid=${gid}`;
}

// Minimal RFC4180 CSV parser: handles quoted fields, embedded commas,
// escaped quotes (""), and both \n and \r\n line endings.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field); field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      rows.push(row); row = [];
    } else {
      field += c;
    }
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function rowsToObjects(rows) {
  const [header, ...data] = rows;
  return data
    .filter((r) => r.some((v) => v !== ''))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]])));
}

function safeFloat(v) { const n = parseFloat(v); return Number.isFinite(n) ? n : null; }
function safeInt(v) { const n = parseInt(v, 10); return Number.isFinite(n) ? n : null; }

function matchBrand(title) {
  if (!title) return null;
  const t = title.toLowerCase();
  for (const brand of KBEAUTY_BRAND_UNIVERSE) {
    for (const alias of brand.aliases) {
      if (t.includes(alias)) return brand.name;
    }
  }
  return null;
}

async function fetchSheetCsv(gid) {
  const res = await fetch(kbeautyCsvUrl(gid));
  if (!res.ok) throw new Error(`sheet fetch failed: HTTP ${res.status}`);
  return res.text();
}

// Top-100 tabs: 3 metadata rows ("<timestamp>,region=XX,auto", "fetched",
// "<source url>"), then a real header row, then data.
function parseTop100(csvText) {
  const rows = parseCsv(csvText);
  const bankedAt = (rows[0] || [])[0] || null;
  const objects = rowsToObjects(rows.slice(3));
  const list = objects.filter((r) => r.asin).map((r) => ({
    rank: safeInt(r.rank),
    asin: r.asin,
    title: r.title,
    rating: safeFloat(r.rating),
    ratingsCount: safeInt(r.ratings_count),
    price: safeFloat(r.price_usd),
    url: r.url,
    brand: matchBrand(r.title),
  }));
  return { bankedAt, rows: list };
}

// Catalog / rank-changes tabs: 1 metadata row, then header, then data.
function parseCatalog(csvText) {
  const rows = parseCsv(csvText);
  const bankedAt = (rows[0] || [])[0] || null;
  const objects = rowsToObjects(rows.slice(1));
  const list = objects.filter((r) => r.asin).map((r) => {
    const regionRanks = {
      us: safeInt(r.us_rank), uk: safeInt(r.uk_rank),
      de: safeInt(r.de_rank), fr: safeInt(r.fr_rank), es: safeInt(r.es_rank),
    };
    const present = Object.values(regionRanks).filter((v) => v != null);
    return {
      asin: r.asin,
      title: r.title,
      rating: safeFloat(r.rating),
      ratingsCount: safeInt(r.ratings_count),
      price: safeFloat(r.price_usd),
      regionRanks,
      regionsCount: safeInt(r.regions_count) ?? present.length,
      avgRank: present.length ? Math.round((present.reduce((a, b) => a + b, 0) / present.length) * 10) / 10 : null,
      bestRank: present.length ? Math.min(...present) : null,
      brand: matchBrand(r.title),
    };
  });
  return { bankedAt, rows: list };
}

function parseRankChanges(csvText) {
  const rows = parseCsv(csvText);
  const bankedAt = (rows[0] || [])[0] || null;
  const objects = rowsToObjects(rows.slice(1));
  const list = objects.filter((r) => r.asin).map((r) => ({
    date: r.date,
    region: r.region,
    asin: r.asin,
    title: r.title,
    rank: safeInt(r.rank),
    price: safeFloat(r.price_usd),
    changeType: r.change_type,
    prevRank: safeInt(r.prev_rank),
    delta: safeInt(r.delta),
    brand: matchBrand(r.title),
  }));
  return { bankedAt, rows: list };
}

// Rank-history tab has no header row at all:
// date,region,asin,rank,price,currency,rating,ratings_count,title
function parseRankHistory(csvText) {
  const rows = parseCsv(csvText);
  return rows.filter((c) => c.length >= 9 && c[2]).map((c) => ({
    date: c[0], region: c[1], asin: c[2],
    rank: safeInt(c[3]), price: safeFloat(c[4]),
    currency: c[5], rating: safeFloat(c[6]),
    ratingsCount: safeInt(c[7]), title: c[8],
  }));
}

function buildBrandRanking(catalog) {
  const stats = new Map();
  for (const row of catalog) {
    if (!row.brand) continue;
    const s = stats.get(row.brand) || { brand: row.brand, skuCount: 0, avgRankSum: 0, avgRankN: 0, bestRank: null, regions: new Set() };
    s.skuCount += 1;
    if (row.avgRank != null) { s.avgRankSum += row.avgRank; s.avgRankN += 1; }
    if (row.bestRank != null) s.bestRank = s.bestRank == null ? row.bestRank : Math.min(s.bestRank, row.bestRank);
    for (const [region, rank] of Object.entries(row.regionRanks)) if (rank != null) s.regions.add(region);
    stats.set(row.brand, s);
  }
  const out = [...stats.values()].map((s) => ({
    brand: s.brand,
    skuCount: s.skuCount,
    avgRank: s.avgRankN ? Math.round((s.avgRankSum / s.avgRankN) * 10) / 10 : null,
    bestRank: s.bestRank,
    regionsCovered: [...s.regions].sort(),
  }));
  out.sort((a, b) => (a.avgRank ?? 999) - (b.avgRank ?? 999));
  return out;
}

// In-memory cache for the lifetime of the page — every tab switch re-reads
// the same fetch rather than hitting the sheet again.
let _kbeautyDatasetPromise = null;

async function getKbeautyDataset(force = false) {
  if (force) _kbeautyDatasetPromise = null;
  if (!_kbeautyDatasetPromise) {
    _kbeautyDatasetPromise = (async () => {
      const catalogCsv = await fetchSheetCsv(KBEAUTY_CATALOG_GID);
      const rankChangesCsv = await fetchSheetCsv(KBEAUTY_RANK_CHANGES_GID);
      const { bankedAt, rows: catalog } = parseCatalog(catalogCsv);
      const { rows: rankChanges } = parseRankChanges(rankChangesCsv);
      const unmapped = catalog.filter((r) => !r.brand).sort((a, b) => (a.avgRank ?? 999) - (b.avgRank ?? 999)).slice(0, 60);
      return {
        fetchedAt: Date.now() / 1000,
        bankedAt,
        catalog,
        rankChanges,
        brandRanking: buildBrandRanking(catalog),
        unmapped,
      };
    })();
  }
  return _kbeautyDatasetPromise;
}

async function getKbeautyTop100(region) {
  const gid = KBEAUTY_TOP100_GIDS[region];
  if (!gid) throw new Error(`unknown region: ${region}`);
  return parseTop100(await fetchSheetCsv(gid));
}

async function getKbeautyHistory(asin) {
  const rows = parseRankHistory(await fetchSheetCsv(KBEAUTY_RANK_HISTORY_GID));
  return rows.filter((r) => r.asin === asin).sort((a, b) => (a.date + a.region).localeCompare(b.date + b.region));
}
