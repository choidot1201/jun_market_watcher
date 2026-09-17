(() => {
  'use strict';

  const $ = (sel) => document.querySelector(sel);
  const VIEW_NAMES = ['home', 'equity', 'crypto', 'biopharma', 'kbeauty', 'portfolio'];
  const views = {}; // view name -> { activate }

  // ---------- theme ----------
  function applyThemeButton() {
    const theme = document.documentElement.dataset.theme;
    $('#theme-toggle').textContent = theme === 'light' ? '☾' : '☀';
    $('#theme-toggle').title = theme === 'light' ? 'Switch to dark' : 'Switch to light';
  }
  $('#theme-toggle').addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = cur;
    try { localStorage.setItem('jmw.theme', cur); } catch (e) {}
    applyThemeButton();
  });
  applyThemeButton();

  // ---------- clock ----------
  function tick() {
    $('#clock').textContent = new Date().toLocaleTimeString('en-GB', { hour12: false, timeZone: 'Asia/Seoul' });
  }
  tick();
  setInterval(tick, 1000);

  // ---------- nav ----------
  function showView(name) {
    VIEW_NAMES.forEach((v) => { $(`#view-${v}`).hidden = v !== name; });
    document.querySelectorAll('.nav-item').forEach((b) => b.classList.toggle('nav-active', b.dataset.view === name));
    if (views[name] && views[name].activate) views[name].activate();
  }
  $('#main-nav').addEventListener('click', (e) => {
    const btn = e.target.closest('.nav-item');
    if (btn) showView(btn.dataset.view);
  });
  $('#logo-home-btn').addEventListener('click', () => showView('home'));

  // ---------- coming-soon placeholder (Equity / Biopharma / Portfolio) ----------
  function comingSoon(title, body) {
    return `<div class="coming-soon">
      <h2 class="coming-soon-title">${title}</h2>
      <p class="coming-soon-body">${body}</p>
    </div>`;
  }
  $('#view-equity').innerHTML = comingSoon(
    'Equity — coming next',
    'Needs a live stock-quote source. Yahoo Finance has the data but blocks direct browser requests (no CORS header), so this waits on a small serverless proxy decision before it can run as a static site.'
  );
  $('#view-biopharma').innerHTML = comingSoon(
    'Biopharma — coming next',
    'Same equity-quote dependency as the Equity tab — Korea biopharma coverage watchlist, once a CORS-safe quote source is wired up.'
  );
  $('#view-portfolio').innerHTML = comingSoon(
    'Portfolio — coming next',
    'Holdings P&L needs live pricing for whatever you hold. Crypto holdings could work today via CoinGecko; equity holdings wait on the same quote-source decision as the Equity tab.'
  );

  // ---------- K-beauty (already live) ----------
  // No JS to activate: it's an embedded iframe of Jun's own Amazon ranking
  // tracker (see index.html) — a separately deployed, separately maintained
  // site, so this tab is just a window onto it.
  views.kbeauty = { activate() {} };

  // ---------- Crypto (already live) ----------
  views.crypto = createCryptoView($('#view-crypto'));

  // ---------- Home ----------
  const homeEl = $('#view-home');
  homeEl.classList.add('home-wrap');
  homeEl.innerHTML = `
    <div>
      <div class="home-section-title">Live today</div>
      <div class="home-cards">
        <button class="home-card" data-goto="crypto">
          <div class="home-card-name">Crypto</div>
          <div class="home-card-price">Top 40 by market cap</div>
          <div class="home-card-chg faint">CoinGecko · live</div>
        </button>
        <button class="home-card" data-goto="kbeauty">
          <div class="home-card-name">K-Beauty</div>
          <div class="home-card-price">Amazon Top 100 · 5 regions</div>
          <div class="home-card-chg faint">Jun's Amazon ranking tracker</div>
        </button>
      </div>
    </div>
    <div>
      <div class="home-section-title">Coming next</div>
      <div class="home-cards">
        <button class="home-card home-card-pending" data-goto="equity"><div class="home-card-name">Equity</div><div class="faint">needs quote proxy</div></button>
        <button class="home-card home-card-pending" data-goto="biopharma"><div class="home-card-name">Biopharma</div><div class="faint">needs quote proxy</div></button>
        <button class="home-card home-card-pending" data-goto="portfolio"><div class="home-card-name">Portfolio</div><div class="faint">needs quote proxy</div></button>
      </div>
    </div>
  `;
  homeEl.querySelectorAll('[data-goto]').forEach((btn) => btn.addEventListener('click', () => showView(btn.dataset.goto)));

  views.home = { activate() {} };

  showView('home');
})();
