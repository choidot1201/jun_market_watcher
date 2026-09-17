// K-beauty SKU rank tracker — the 5 sub-tabs from mooboard.xyz/kbeauty
// (Charting SKUs / Rank movement / Silicon2 brand ranking / Universe /
// Unmapped), backed by Jun's own Google Sheet of Amazon Top-100 snapshots
// across US/UK/FR/ES/DE. Calendar/heatmap from the original site are
// intentionally not reproduced here.
//
// Data comes straight from sheet-data.js's client-side CSV reader — no
// backend, so this runs unmodified as a static GitHub Pages site.

const KBEAUTY_REGIONS = ['US', 'UK', 'FR', 'ES', 'DE'];
const KBEAUTY_REGION_COLORS = { US: '#f0b90b', UK: '#4c9aff', FR: '#f0555f', ES: '#a855f7', DE: '#3fce8f' };

function createKbeautyTracker(containerEl) {
  const state = { sub: 'charting' };

  containerEl.innerHTML = `
    <div class="kbeauty-subnav">
      <button class="kbeauty-tab active" data-sub="charting">Charting SKUs</button>
      <button class="kbeauty-tab" data-sub="movement">Rank movement</button>
      <button class="kbeauty-tab" data-sub="brand">Silicon2 brand ranking</button>
      <button class="kbeauty-tab" data-sub="universe">Universe</button>
      <button class="kbeauty-tab" data-sub="unmapped">Unmapped</button>
      <span class="kbeauty-meta" id="kbeauty-meta">Loading…</span>
    </div>
    <div class="kbeauty-content" id="kbeauty-content"></div>
  `;

  const contentEl = containerEl.querySelector('#kbeauty-content');
  const metaEl = containerEl.querySelector('#kbeauty-meta');

  containerEl.querySelector('.kbeauty-subnav').addEventListener('click', (e) => {
    const btn = e.target.closest('.kbeauty-tab');
    if (!btn) return;
    containerEl.querySelectorAll('.kbeauty-tab').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    state.sub = btn.dataset.sub;
    render();
  });

  function brandTag(brand) {
    return brand ? `<span class="kb-brand-tag">${brand}</span>` : '<span class="faint">—</span>';
  }
  function rankCell(v) { return v == null ? '<span class="faint">—</span>' : v; }
  function fmtUsd(v) { return v == null ? '—' : `$${v.toFixed(2)}`; }

  function setupResizer(resizerEl, panelEl) {
    if (!resizerEl || !panelEl) return;
    resizerEl.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = panelEl.getBoundingClientRect().width;
      function onMove(ev) {
        const w = Math.max(180, Math.min(560, startWidth + (ev.clientX - startX)));
        panelEl.style.flexBasis = `${w}px`;
      }
      function onUp() { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  // ---------- Silicon2 brand-to-company resolver (mirrors mooboard.xyz's own logic) ----------
  function resolveSilicon2Brand(brandName) {
    if (!brandName) return null;
    const norm = brandName.trim().toLowerCase();
    for (const company of SILICON2_COMPANIES) {
      for (const b of company.brands || []) {
        const names = [b.brand, b.brandKo, ...(b.aliases || [])].filter(Boolean).map((x) => x.toLowerCase());
        if (names.includes(norm)) return { company, ownership: b };
      }
    }
    return null;
  }
  function resolveExpression(company) {
    if (company.confidence === 'unresolved') return 'unresolved';
    if (!company.listed) {
      const status = (company.ipoStatus || '').toLowerCase();
      if (status.includes('filed') || status.includes('preparing') || status.includes('announced')) return 'ipo_pending';
      return 'none_private';
    }
    return 'direct';
  }
  const SILICON2_OVERRIDE_KEY = 'jmw.silicon2overrides';
  function loadSilicon2Overrides() {
    try { return JSON.parse(localStorage.getItem(SILICON2_OVERRIDE_KEY)) || { periods: [], rankings: {} }; }
    catch (e) { return { periods: [], rankings: {} }; }
  }
  function saveSilicon2Overrides(o) {
    try { localStorage.setItem(SILICON2_OVERRIDE_KEY, JSON.stringify(o)); } catch (e) {}
  }

  // ---------- Charting SKUs ("Brands moving" — matches mooboard.xyz's own layout) ----------
  function renderTrack(prevRank, rank) {
    const W = 120, H = 16;
    const pos = (r) => 3 + (Math.max(1, Math.min(100, r)) - 1) / 99 * (W - 6);
    const xNew = pos(rank);
    const color = prevRank == null ? 'var(--accent-3)' : rank < prevRank ? 'var(--up)' : rank > prevRank ? 'var(--down)' : 'var(--text-faint)';
    let inner = `<line x1="3" y1="${H / 2}" x2="${W - 3}" y2="${H / 2}" stroke="var(--border)" stroke-width="1" />`;
    if (prevRank != null) {
      const xOld = pos(prevRank);
      inner += `<line x1="${xOld}" y1="${H / 2}" x2="${xNew}" y2="${H / 2}" stroke="${color}" stroke-width="1.5" />`;
      inner += `<circle cx="${xOld}" cy="${H / 2}" r="3" fill="var(--panel)" stroke="${color}" stroke-width="1.5" />`;
    }
    inner += `<rect x="${xNew - 1.5}" y="${H / 2 - 5}" width="3" height="10" fill="${color}" rx="1" />`;
    return `<svg width="${W}" height="${H}" class="kb-track">${inner}</svg>`;
  }

  async function renderCharting() {
    contentEl.innerHTML = `
      <div class="kb-moving">
        <aside class="kb-moving-sidebar" id="kb-moving-sidebar">
          <div class="kb-picker-header">
            <span class="kb-picker-title">Brands moving</span>
          </div>
          <div class="kb-sku-list" id="kb-brand-move-list"><div class="faint" style="padding:10px">Loading…</div></div>
        </aside>
        <div class="kb-resizer" id="kb-moving-resizer"></div>
        <div class="kb-moving-main">
          <header class="kb-moving-header">
            <div class="kb-moving-title-row">
              <h2 class="kb-chart-title" id="kb-moving-title">Rank movement</h2>
              <span class="kb-moving-window" id="kb-moving-window"></span>
            </div>
            <p class="kb-caption" id="kb-moving-parent"></p>
            <p class="kb-caption">Each row is one SKU on a <b>#1 → #100</b> track. Sorted by size of move. <span id="kb-moving-stats"></span></p>
            <p class="kb-caption kb-moving-legend">
              <span><span class="kb-legend-dot"></span>where it was</span>
              <span><span class="kb-legend-bar"></span>where it is now</span>
              <span>· climbing moves leftward, toward #1</span>
            </p>
            <div class="kb-moving-pills" id="kb-moving-pills"></div>
          </header>
          <div class="kb-sku-list" id="kb-moving-rows"></div>
        </div>
      </div>`;

    setupResizer(contentEl.querySelector('#kb-moving-resizer'), contentEl.querySelector('#kb-moving-sidebar'));

    const allRows = (await getKbeautyDataset()).rankChanges.filter((r) => r.brand);
    let selectedBrand = null;
    let selectedRegion = 'ALL';
    let hideFlat = true;

    const byBrand = new Map();
    allRows.forEach((r) => {
      const s = byBrand.get(r.brand) || { brand: r.brand, up: 0, down: 0, entries: 0, momentum: 0, rows: [] };
      s.rows.push(r);
      if (r.changeType === 'NEW' || r.prevRank == null) { s.entries += 1; s.momentum += 12; }
      else if (r.delta > 0) { s.up += 1; s.momentum += r.delta; }
      else if (r.delta < 0) { s.down += 1; s.momentum += Math.abs(r.delta); }
      byBrand.set(r.brand, s);
    });
    const brandList = [...byBrand.values()].sort((a, b) => b.momentum - a.momentum || b.rows.length - a.rows.length);

    function drawSidebar() {
      const listEl = contentEl.querySelector('#kb-brand-move-list');
      const totalMoves = allRows.length;
      listEl.innerHTML = `
        <button type="button" class="kb-brand-move-row ${!selectedBrand ? 'active' : ''}" data-brand="">
          <span class="kb-brand-move-name">All brands</span><span class="num kb-brand-move-count">${totalMoves}</span>
        </button>
        ${brandList.map((s) => {
          const res = resolveSilicon2Brand(s.brand);
          return `
          <button type="button" class="kb-brand-move-row ${selectedBrand === s.brand ? 'active' : ''}" data-brand="${s.brand}">
            <span class="kb-brand-move-main">
              <span class="kb-brand-move-name">${s.brand}</span>
              <span class="kb-brand-move-parent">${res ? res.company.nameEn : 'parent not verified'}</span>
              <span class="kb-brand-move-badges">
                ${res && res.company.listed ? `<span class="num kb-accent2">${res.company.ticker}</span>` : ''}
                ${s.up ? `<span class="kb-move-up">▲${s.up}</span>` : ''}
                ${s.down ? `<span class="kb-move-down">▼${s.down}</span>` : ''}
                ${s.entries ? `<span class="kb-move-new">+${s.entries}</span>` : ''}
              </span>
            </span>
            <span class="num kb-brand-move-count">${s.rows.length}</span>
          </button>`;
        }).join('')}`;
      listEl.querySelectorAll('.kb-brand-move-row').forEach((btn) => {
        btn.addEventListener('click', () => { selectedBrand = btn.dataset.brand || null; drawSidebar(); drawMain(); });
      });
    }

    function drawMain() {
      const rowsForBrand = selectedBrand ? allRows.filter((r) => r.brand === selectedBrand) : allRows;
      const regions = KBEAUTY_REGIONS; // always offer all 5 — not just whichever region the sheet last logged changes for
      contentEl.querySelector('#kb-moving-title').textContent = selectedBrand ? `${selectedBrand} · rank movement` : 'Rank movement';
      const res = selectedBrand ? resolveSilicon2Brand(selectedBrand) : null;
      contentEl.querySelector('#kb-moving-parent').innerHTML = res
        ? `${res.company.nameEn}${res.company.listed ? ` <span class="num kb-accent2">${res.company.ticker}</span>` : ''}`
        : (selectedBrand ? 'parent not verified' : '');
      contentEl.querySelector('#kb-moving-window').textContent = rowsForBrand[0] ? rowsForBrand[0].date : '';

      contentEl.querySelector('#kb-moving-pills').innerHTML = ['ALL', ...regions].map((r) =>
        `<button type="button" class="kb-pill ${r === selectedRegion ? 'active' : ''}" data-region="${r}">${r}</button>`
      ).join('') + `<button type="button" class="kb-pill kb-hide-flat ${hideFlat ? 'active' : ''}" id="kb-hide-flat">Hide flat</button>`;
      contentEl.querySelector('#kb-moving-pills').querySelectorAll('.kb-pill[data-region]').forEach((b) =>
        b.addEventListener('click', () => { selectedRegion = b.dataset.region; drawMain(); }));
      contentEl.querySelector('#kb-hide-flat').addEventListener('click', () => { hideFlat = !hideFlat; drawMain(); });

      let filtered = rowsForBrand;
      if (selectedRegion !== 'ALL') filtered = filtered.filter((r) => r.region === selectedRegion);
      if (hideFlat) filtered = filtered.filter((r) => r.delta !== 0);
      const sizeOf = (r) => (r.changeType === 'NEW' ? 1000 : Math.abs(r.delta ?? 0));
      filtered = [...filtered].sort((a, b) => sizeOf(b) - sizeOf(a) || (a.rank ?? 999) - (b.rank ?? 999));

      const up = filtered.filter((r) => r.delta > 0).length;
      const down = filtered.filter((r) => r.delta < 0).length;
      const news = filtered.filter((r) => r.changeType === 'NEW').length;
      contentEl.querySelector('#kb-moving-stats').innerHTML = `<span class="kb-move-up">${up} climbing</span> · <span class="kb-move-down">${down} falling</span> · <span class="kb-move-new">${news} new</span>`;

      contentEl.querySelector('#kb-moving-rows').innerHTML = filtered.length ? filtered.map((r) => `
        <div class="kb-move-row">
          <span class="kb-region-chip" style="border-color:${KBEAUTY_REGION_COLORS[r.region]}">${r.region}</span>
          ${renderTrack(r.prevRank, r.rank)}
          <span class="num kb-move-ranklabel">${r.prevRank != null ? `#${r.prevRank}→` : ''}#${r.rank}</span>
          <span class="kb-title-cell kb-move-title" title="${(r.title || '').replace(/"/g, '&quot;')}">${r.title || r.asin}</span>
          ${!selectedBrand ? `<span class="kb-brand-tag">${r.brand}</span>` : ''}
        </div>`).join('') : '<div class="portfolio-empty">No moves for this filter.</div>';
    }

    drawSidebar();
    drawMain();
  }

  // ---------- Rank movement ----------
  async function renderMovement() {
    contentEl.innerHTML = `<div class="kb-table-wrap"><table class="data-table"><thead><tr>
      <th>Region</th><th>Title</th><th>Brand</th><th>Rank</th><th>Prev</th><th>Δ</th><th>Type</th><th>Price</th>
    </tr></thead><tbody id="kb-movement-body"><tr><td colspan="8" class="portfolio-empty">Loading…</td></tr></tbody></table></div>`;
    const rows = (await getKbeautyDataset()).rankChanges.slice();
    rows.sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));
    contentEl.querySelector('#kb-movement-body').innerHTML = rows.map((r) => {
      const deltaCls = r.delta > 0 ? 'pnl-up' : r.delta < 0 ? 'pnl-down' : '';
      const typeCls = r.changeType === 'NEW' ? 'kb-type-new' : r.changeType === 'UP' ? 'kb-type-up' : r.changeType === 'DOWN' ? 'kb-type-down' : '';
      return `<tr>
        <td>${r.region}</td>
        <td class="kb-title-cell" title="${(r.title || '').replace(/"/g, '&quot;')}">${r.title || r.asin}</td>
        <td>${brandTag(r.brand)}</td>
        <td class="num">${rankCell(r.rank)}</td>
        <td class="num faint">${rankCell(r.prevRank)}</td>
        <td class="num ${deltaCls}">${r.delta != null ? (r.delta > 0 ? '+' : '') + r.delta : '—'}</td>
        <td><span class="kb-type ${typeCls}">${r.changeType || '—'}</span></td>
        <td class="num">${fmtUsd(r.price)}</td>
      </tr>`;
    }).join('');
  }

  // ---------- Silicon2 brand ranking (from mooboard.xyz's own d5 component —
  // Top-10-brands-by-Silicon2-distribution-scale, straight from their IR decks, not
  // derived from the Amazon sheet at all) ----------
  let silicon2View = 'brand';

  function silicon2Data() {
    const overrides = loadSilicon2Overrides();
    const periods = [...SILICON2_PERIODS, ...overrides.periods.filter((p) => !SILICON2_PERIODS.includes(p))];
    const rankings = { ...SILICON2_RANKINGS, ...overrides.rankings };
    return { periods, rankings };
  }

  function computePeriodRows(periods, rankings) {
    return periods.map((period, pi) => {
      const brands = rankings[period] || [];
      const prevList = pi > 0 ? rankings[periods[pi - 1]] : null;
      const seenBefore = new Set(periods.slice(0, pi).flatMap((p) => rankings[p] || []));
      const rows = brands.map((brand, i) => {
        const rank = i + 1;
        const prevIdx = prevList ? prevList.indexOf(brand) : -1;
        const prevRank = prevIdx >= 0 ? prevIdx + 1 : null;
        const delta = prevRank == null ? null : prevRank - rank;
        let move;
        if (prevRank == null) move = seenBefore.has(brand) ? 'reentry' : 'new';
        else move = delta === 0 ? 'flat' : delta > 0 ? 'up' : 'down';
        return { brand, rank, prevRank, delta, move };
      });
      return { period, rows };
    });
  }

  function computeCompanyRollup(periods, periodRows) {
    const byKey = new Map();
    const allBrands = [...new Set(periods.flatMap((p) => (silicon2Data().rankings[p] || [])))];
    for (const brand of allBrands) {
      const res = resolveSilicon2Brand(brand);
      const key = res ? res.company.id : '__unmapped';
      const entry = byKey.get(key) || {
        key, name: res ? res.company.nameEn : 'Parent not established',
        company: res ? res.company : null, brands: new Set(),
      };
      entry.brands.add(brand);
      byKey.set(key, entry);
    }
    const out = [...byKey.values()].map((entry) => {
      const perPeriod = periodRows.map(({ period, rows }) => ({
        period, ranks: rows.filter((r) => entry.brands.has(r.brand)).map((r) => r.rank).sort((a, b) => a - b),
      }));
      const latest = perPeriod[perPeriod.length - 1].ranks;
      return { ...entry, perPeriod, latestSlots: latest.length, best: latest[0] ?? 99 };
    });
    out.sort((a, b) => b.latestSlots - a.latestSlots || a.best - b.best);
    return out;
  }

  async function renderBrand() {
    const { periods, rankings } = silicon2Data();
    const periodRows = computePeriodRows(periods, rankings);
    const allBrands = [...new Set(periods.flatMap((p) => rankings[p] || []))];
    const unresolvedCount = allBrands.filter((b) => !resolveSilicon2Brand(b)).length;
    const companyRows = computeCompanyRollup(periods, periodRows);

    contentEl.innerHTML = `
      <header class="kb-s2-header">
        <div class="kb-s2-title-row">
          <h2 class="kb-chart-title">Top 10 Brands by Year</h2>
          <span class="kb-s2-source">Source · ${SILICON2_NAME} ${SILICON2_TICKER} IR</span>
        </div>
        <p class="kb-caption">Ranked by <b class="kb-emph">Silicon2 distribution scale</b> — not an Amazon rank and not market share. ${allBrands.length} brands · ${periods[0]}→${periods[periods.length - 1]}. Movement is derived from the ranks themselves, so an arrow can never disagree with the table it describes.</p>
        ${unresolvedCount > 0 ? `<p class="kb-caption kb-emph">${unresolvedCount} of ${allBrands.length} brands have no established parent yet — shown as "parent not verified", never guessed.</p>` : ''}
        <div class="kb-s2-toolbar">
          <button type="button" class="kb-s2-toggle-btn ${silicon2View === 'brand' ? 'active' : ''}" data-view="brand">By brand</button>
          <button type="button" class="kb-s2-toggle-btn ${silicon2View === 'company' ? 'active' : ''}" data-view="company">By company · ${companyRows.length}</button>
          <button type="button" class="kb-s2-add-btn" id="kb-s2-add-toggle">+ Add period (from IR deck)</button>
        </div>
        <form class="kb-s2-add-form" id="kb-s2-add-form" hidden>
          <input class="kb-filter" id="kb-s2-period-label" placeholder="Period label, e.g. 3Q2026" required />
          <div class="kb-s2-add-grid">
            ${Array.from({ length: 10 }, (_, i) => `<input class="kb-filter" data-rank="${i + 1}" placeholder="#${i + 1} brand" />`).join('')}
          </div>
          <div class="kb-s2-add-actions">
            <button type="submit" class="kb-s2-toggle-btn active">Save period</button>
            <span class="kb-caption">Saved only in this browser — paste next quarter's Top 10 from the Silicon2 IR deck.</span>
          </div>
        </form>
      </header>
      <div class="kb-s2-body" id="kb-s2-body"></div>
    `;

    contentEl.querySelectorAll('.kb-s2-toggle-btn[data-view]').forEach((btn) =>
      btn.addEventListener('click', () => { silicon2View = btn.dataset.view; renderBrand(); }));

    const addToggle = contentEl.querySelector('#kb-s2-add-toggle');
    const addForm = contentEl.querySelector('#kb-s2-add-form');
    addToggle.addEventListener('click', () => { addForm.hidden = !addForm.hidden; });
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const label = contentEl.querySelector('#kb-s2-period-label').value.trim();
      const brands = [...addForm.querySelectorAll('[data-rank]')].map((i) => i.value.trim());
      if (!label || brands.some((b) => !b)) return;
      const overrides = loadSilicon2Overrides();
      overrides.periods = [...overrides.periods.filter((p) => p !== label), label];
      overrides.rankings = { ...overrides.rankings, [label]: brands };
      saveSilicon2Overrides(overrides);
      renderBrand();
    });

    const bodyEl = contentEl.querySelector('#kb-s2-body');
    if (silicon2View === 'brand') {
      bodyEl.innerHTML = `<table class="kb-s2-table"><thead><tr><th>#</th>${periods.map((p) => `<th>${p}</th>`).join('')}</tr></thead>
        <tbody>${Array.from({ length: 10 }, (_, i) => {
          const rank = i + 1;
          return `<tr><td class="num kb-s2-rank">${rank}</td>${periodRows.map(({ rows }) => {
            const cell = rows[i];
            if (!cell) return '<td></td>';
            const res = resolveSilicon2Brand(cell.brand);
            const glyph = SILICON2_MOVE_GLYPHS[cell.move];
            const expr = res ? SILICON2_EXPRESSION_LABELS[resolveExpression(res.company)] : null;
            return `<td class="kb-s2-cell">
              <div class="kb-s2-cell-top"><span class="kb-s2-brand">${cell.brand}</span><span class="num kb-s2-glyph ${glyph.cls}">${glyph.glyph}${cell.delta ? Math.abs(cell.delta) : ''}</span></div>
              <div class="kb-s2-cell-sub">${res ? `<span class="faint">${res.company.nameEn}</span> ${res.company.listed ? `<span class="num kb-accent2">${res.company.ticker}</span>` : `<span class="kb-expr-badge ${expr.cls}">${expr.label}</span>`}` : '<span class="kb-emph">parent not verified</span>'}</div>
            </td>`;
          }).join('')}</tr>`;
        }).join('')}</tbody></table>`;
    } else {
      bodyEl.innerHTML = `<ul class="kb-s2-company-list">${companyRows.map((c) => `
        <li class="kb-s2-company-row">
          <div class="kb-s2-company-head">
            <span class="num kb-s2-slots">${c.latestSlots}</span><span class="kb-s2-of10">of top 10</span>
            <span class="kb-s2-company-name">${c.name}</span>
            ${c.company && c.company.listed ? `<span class="num kb-accent2">${c.company.ticker}</span>` : ''}
            ${c.company ? `<span class="kb-expr-badge ${SILICON2_EXPRESSION_LABELS[resolveExpression(c.company)].cls}">${SILICON2_EXPRESSION_LABELS[resolveExpression(c.company)].label}</span>` : ''}
          </div>
          ${c.company && !c.company.listed && (c.company.readThrough || []).length ? `<div class="kb-s2-readthrough">${c.company.readThrough.map((rt) => {
            const parent = SILICON2_COMPANIES.find((p) => p.id === rt.companyId);
            if (!parent || !parent.ticker) return '';
            const relText = rt.relation === 'equity_stake' ? `equity stake ${rt.stakePct}%${rt.consolidated === false ? ' · equity-method (net income only, not revenue)' : ''}` : rt.relation === 'odm' ? 'manufactures for it (manufacturing margin)' : 'distributes it (distribution margin)';
            return `<p class="kb-caption">via ${parent.nameEn} <span class="num kb-accent2">${parent.ticker}</span> — ${relText}${!rt.disclosed ? ' · reported, not disclosed' : ''}</p>`;
          }).join('')}</div>` : ''}
          <div class="kb-s2-period-grid">${c.perPeriod.map(({ period, ranks }) => `
            <div class="kb-s2-period-cell">
              <div class="kb-s2-period-label">${period}</div>
              <div class="num kb-s2-period-count">${ranks.length || '<span class="faint">—</span>'}</div>
              <div class="num kb-s2-period-ranks">${ranks.length ? ranks.map((r) => `#${r}`).join(' ') : ''}</div>
            </div>`).join('')}</div>
          <div class="kb-s2-brand-trail">${[...c.brands].sort().map((b) => `<span>${b} <span class="num faint">${periods.map((p) => { const idx = (rankings[p] || []).indexOf(b); return idx >= 0 ? idx + 1 : '·'; }).join('→')}</span></span>`).join('')}</div>
        </li>`).join('')}</ul>`;
    }
  }

  // ---------- Universe ----------
  async function renderUniverse() {
    contentEl.innerHTML = `
      <div class="kb-caption" id="kb-universe-caption">Every SKU currently tracked across all 5 regions, cross-referenced by ASIN. Region columns show each SKU's rank there when present.</div>
      <input class="kb-filter" id="kb-universe-filter" placeholder="Filter by title or brand…" />
      <div class="kb-table-wrap"><table class="data-table"><thead><tr>
        <th>Title</th><th>Brand</th><th>US</th><th>UK</th><th>FR</th><th>ES</th><th>DE</th><th>Regions</th>
      </tr></thead><tbody id="kb-universe-body"><tr><td colspan="8" class="portfolio-empty">Loading…</td></tr></tbody></table></div>`;
    const rows = (await getKbeautyDataset()).catalog.slice().sort((a, b) => (a.avgRank ?? 999) - (b.avgRank ?? 999));
    contentEl.querySelector('#kb-universe-caption').textContent =
      `Every SKU currently tracked across all 5 regions, cross-referenced by ASIN (${rows.length} total). Region columns show each SKU's rank there when present.`;
    function draw(filtered) {
      contentEl.querySelector('#kb-universe-body').innerHTML = filtered.map((r) => `
        <tr>
          <td class="kb-title-cell" title="${(r.title || '').replace(/"/g, '&quot;')}">${r.title || r.asin}</td>
          <td>${brandTag(r.brand)}</td>
          <td class="num">${rankCell(r.regionRanks.us)}</td>
          <td class="num">${rankCell(r.regionRanks.uk)}</td>
          <td class="num">${rankCell(r.regionRanks.fr)}</td>
          <td class="num">${rankCell(r.regionRanks.es)}</td>
          <td class="num">${rankCell(r.regionRanks.de)}</td>
          <td class="num">${r.regionsCount}</td>
        </tr>`).join('');
    }
    draw(rows);
    contentEl.querySelector('#kb-universe-filter').addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      draw(!q ? rows : rows.filter((r) => (r.title || '').toLowerCase().includes(q) || (r.brand || '').toLowerCase().includes(q)));
    });
  }

  // ---------- Unmapped ----------
  async function renderUnmapped() {
    contentEl.innerHTML = `
      <div class="kb-caption">SKUs ranking in the Top 100s that don't match any brand in our K-beauty universe — mostly non-Korean beauty competitors dominating the general "beauty" category. Capped to 60 rows.</div>
      <div class="kb-table-wrap"><table class="data-table"><thead><tr>
        <th>Title</th><th>Best rank</th><th>Regions</th><th>Price</th>
      </tr></thead><tbody id="kb-unmapped-body"><tr><td colspan="4" class="portfolio-empty">Loading…</td></tr></tbody></table></div>`;
    const rows = (await getKbeautyDataset()).unmapped;
    contentEl.querySelector('#kb-unmapped-body').innerHTML = rows.length ? rows.map((r) => `
      <tr>
        <td class="kb-title-cell" title="${(r.title || '').replace(/"/g, '&quot;')}">${r.title || r.asin}</td>
        <td class="num">${rankCell(r.bestRank)}</td>
        <td class="num">${r.regionsCount}</td>
        <td class="num">${fmtUsd(r.price)}</td>
      </tr>`).join('') : '<tr><td colspan="4" class="portfolio-empty">Nothing unmapped right now.</td></tr>';
  }

  async function render() {
    try {
      if (state.sub === 'charting') await renderCharting();
      else if (state.sub === 'movement') await renderMovement();
      else if (state.sub === 'brand') await renderBrand();
      else if (state.sub === 'universe') await renderUniverse();
      else if (state.sub === 'unmapped') await renderUnmapped();
    } catch (e) {
      contentEl.innerHTML = `<div class="kb-caption" style="color:var(--down)">Could not load data from the sheet (${e.message}). Check the sheet is still shared as "Anyone with the link".</div>`;
    }
  }

  async function refreshMeta() {
    try {
      const data = await getKbeautyDataset();
      metaEl.textContent = data.bankedAt
        ? `Amazon Top 100 · 5 regions · banked ${data.bankedAt}`
        : 'Amazon Top 100 · 5 regions';
    } catch (e) {
      metaEl.textContent = 'Could not reach the sheet';
    }
  }

  let initialized = false;
  return {
    activate() {
      if (!initialized) { initialized = true; refreshMeta(); render(); }
    },
  };
}
