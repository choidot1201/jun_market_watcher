// Crypto tab — top coins by market cap, live from CoinGecko's public API.
// CoinGecko sends Access-Control-Allow-Origin: * on its public endpoints, so
// (unlike Yahoo Finance) this needs no proxy and runs as a plain static page.

const CRYPTO_VS_CURRENCY = 'usd';
const CRYPTO_PER_PAGE = 40;
const CRYPTO_API = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${CRYPTO_VS_CURRENCY}&order=market_cap_desc&per_page=${CRYPTO_PER_PAGE}&page=1&sparkline=true&price_change_percentage=24h`;

function fmtUsdPrice(v) {
  if (v == null) return '—';
  if (v >= 1) return `$${v.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
  return `$${v.toPrecision(3)}`;
}
function fmtCompactUsd(v) {
  if (v == null) return '—';
  return `$${Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(v)}`;
}
function fmtPct(v) {
  if (v == null) return '—';
  const cls = v > 0 ? 'pnl-up' : v < 0 ? 'pnl-down' : '';
  return `<span class="num ${cls}">${v > 0 ? '+' : ''}${v.toFixed(2)}%</span>`;
}

function sparklinePath(prices, w, h) {
  if (!prices || prices.length < 2) return '';
  const min = Math.min(...prices), max = Math.max(...prices);
  const range = max - min || 1;
  const step = w / (prices.length - 1);
  return prices.map((p, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${(h - ((p - min) / range) * h).toFixed(1)}`).join(' ');
}

function createCryptoView(containerEl) {
  containerEl.innerHTML = `
    <div class="crypto-toolbar">
      <input class="kb-filter" id="crypto-filter" placeholder="Filter by name or symbol…" />
      <span class="kbeauty-meta" id="crypto-meta">Loading…</span>
    </div>
    <div class="kb-table-wrap">
      <table class="data-table crypto-table">
        <thead><tr>
          <th>#</th><th>Coin</th><th>Price</th><th>24h</th><th>Market cap</th><th>Volume (24h)</th><th>7d</th>
        </tr></thead>
        <tbody id="crypto-body"><tr><td colspan="7" class="portfolio-empty">Loading…</td></tr></tbody>
      </table>
    </div>
  `;

  let coins = [];

  function draw(filtered) {
    const body = containerEl.querySelector('#crypto-body');
    if (!filtered.length) { body.innerHTML = '<tr><td colspan="7" class="portfolio-empty">No matches.</td></tr>'; return; }
    body.innerHTML = filtered.map((c) => {
      const spark = c.sparkline_in_7d && c.sparkline_in_7d.price;
      const path = spark ? sparklinePath(spark, 100, 28) : '';
      const sparkColor = spark && spark[spark.length - 1] >= spark[0] ? 'var(--up)' : 'var(--down)';
      return `<tr>
        <td class="num faint">${c.market_cap_rank ?? '—'}</td>
        <td class="crypto-name-cell">
          <img class="crypto-icon" src="${c.image}" alt="" width="18" height="18" loading="lazy" />
          <span class="crypto-name">${c.name}</span>
          <span class="num faint crypto-symbol">${(c.symbol || '').toUpperCase()}</span>
        </td>
        <td class="num">${fmtUsdPrice(c.current_price)}</td>
        <td>${fmtPct(c.price_change_percentage_24h)}</td>
        <td class="num faint">${fmtCompactUsd(c.market_cap)}</td>
        <td class="num faint">${fmtCompactUsd(c.total_volume)}</td>
        <td>${path ? `<svg width="100" height="28" class="crypto-spark"><path d="${path}" fill="none" stroke="${sparkColor}" stroke-width="1.5" /></svg>` : '<span class="faint">—</span>'}</td>
      </tr>`;
    }).join('');
  }

  async function load() {
    const metaEl = containerEl.querySelector('#crypto-meta');
    try {
      const res = await fetch(CRYPTO_API);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      coins = await res.json();
      draw(coins);
      metaEl.textContent = `Top ${coins.length} by market cap · updated ${new Date().toLocaleTimeString()}`;
    } catch (e) {
      metaEl.textContent = 'Could not reach CoinGecko';
      containerEl.querySelector('#crypto-body').innerHTML = `<tr><td colspan="7" class="portfolio-empty">Could not load crypto prices (${e.message}). CoinGecko's free API is rate-limited — try again shortly.</td></tr>`;
    }
  }

  containerEl.querySelector('#crypto-filter').addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    draw(!q ? coins : coins.filter((c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)));
  });

  let initialized = false;
  return {
    activate() { if (!initialized) { initialized = true; load(); } },
  };
}
