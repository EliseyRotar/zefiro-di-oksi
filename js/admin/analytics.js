/* =========================================================
   Zefiro di Oksi - admin analytics dashboard
   Renderizza sezione analytics (grafici SVG inline, tabelle, monitor live).
   ========================================================= */

(function (global) {
  'use strict';

  const S = global.AdminStorage;
  const T = global.I18N ? global.I18N.t : (k) => k;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function fmtNum(n) {
    if (n == null) return '0';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return String(n);
  }
  function fmtDate(ts) {
    const d = new Date(ts);
    return d.toLocaleString();
  }
  function fmtAgo(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return s + 's';
    if (s < 3600) return Math.floor(s / 60) + 'm';
    if (s < 86400) return Math.floor(s / 3600) + 'h';
    return Math.floor(s / 86400) + 'g';
  }
  function startOfDay(ts) {
    const d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  function pct(num, den) {
    if (!den) return '0%';
    return Math.round(num / den * 100) + '%';
  }

  function filterByPeriod(events, sessions, period) {
    const now = Date.now();
    let since = 0;
    if (period === 'today') since = startOfDay(now);
    else if (period === '7d') since = now - 7 * 86400000;
    else if (period === '30d') since = now - 30 * 86400000;
    const sInPeriod = sessions.filter(s => s.startTs >= since);
    const eInPeriod = events.filter(e => e.ts >= since);
    return { sessions: sInPeriod, events: eInPeriod, since };
  }

  /* Aggrega statistiche generali */
  function generalStats(sessions, events) {
    const pageviews = events.filter(e => e.type === 'pageview').length;
    const langSwitches = events.filter(e => e.type === 'lang_switch').length;
    const navClicks = events.filter(e => e.type === 'nav_click').length;
    const errors = events.filter(e => e.type === 'js_error' || e.type === 'promise_rejection').length;
    const outbound = events.filter(e => e.type === 'outbound_click').length;

    /* Visitori unici approssimati per SID (potrebbe sovrastimare se
       l'utente cancella sessionStorage, ma e' ok per hobby) */
    const uniqSids = new Set(sessions.map(s => s.sid));
    const visitori = uniqSids.size;

    /* Bounce: sessioni con 1 solo pageview */
    const bounce = sessions.filter(s => (s.pageviews || 1) <= 1).length;
    const bounceRate = sessions.length ? pct(bounce, sessions.length) : '0%';

    /* Durata media sessione (approssimata) */
    let durTot = 0, durCount = 0;
    sessions.forEach(s => {
      if (s.lastTs && s.lastTs > s.startTs) {
        durTot += (s.lastTs - s.startTs);
        durCount++;
      }
    });
    const avgMs = durCount ? Math.round(durTot / durCount) : 0;
    const avgSec = Math.round(avgMs / 1000);

    return {
      sessions: sessions.length,
      visitori,
      pageviews,
      langSwitches,
      navClicks,
      errors,
      outbound,
      bounceRate,
      avgDurationSec: avgSec,
    };
  }

  /* Aggrega pagine */
  function topPages(events) {
    const map = {};
    events.filter(e => e.type === 'pageview').forEach(e => {
      const p = e.path || '?';
      map[p] = (map[p] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }

  /* Lingue del browser */
  function topLangs(sessions) {
    const map = {}, unique = {};
    sessions.forEach(s => {
      map[s.lang || '?'] = (map[s.lang || '?'] || 0) + 1;
      unique[s.sid] = s.lang || '?';
    });
    const arr = Object.entries(map).sort((a, b) => b[1] - a[1]);
    /* Conta visitatori unici per lingua */
    const uniqueByLang = {};
    Object.values(unique).forEach(l => {
      uniqueByLang[l] = (uniqueByLang[l] || 0) + 1;
    });
    const uniq = Object.entries(uniqueByLang).sort((a, b) => b[1] - a[1]);
    return { sessions: arr, unique: uniq };
  }

  function topDevices(sessions) {
    const mobile = sessions.filter(s => s.device && s.device.isMobile).length;
    const desktop = sessions.length - mobile;
    const browsers = {}, oses = {}, viewports = { mobile: 0, tablet: 0, desktop: 0 };
    sessions.forEach(s => {
      const b = (s.device && s.device.browser) || 'unknown';
      browsers[b] = (browsers[b] || 0) + 1;
      const o = (s.device && s.device.os) || 'unknown';
      oses[o] = (oses[o] || 0) + 1;
      if (s.device && s.device.viewport) {
        const w = s.device.viewport.w || 0;
        if (w < 768) viewports.mobile++;
        else if (w < 1024) viewports.tablet++;
        else viewports.desktop++;
      }
    });
    return {
      mobile, desktop,
      browsers: Object.entries(browsers).sort((a, b) => b[1] - a[1]),
      oses: Object.entries(oses).sort((a, b) => b[1] - a[1]),
      viewports,
    };
  }

  function topReferrers(sessions) {
    const map = {}, direct = sessions.filter(s => !s.referrer || s.referrer === '(direct)').length;
    sessions.forEach(s => {
      if (s.referrer && s.referrer !== '(direct)') {
        try {
          const host = new URL(s.referrer).host;
          map[host] = (map[host] || 0) + 1;
        } catch (_) {
          map[s.referrer] = (map[s.referrer] || 0) + 1;
        }
      }
    });
    const arr = Object.entries(map).sort((a, b) => b[1] - a[1]);
    return { direct, referrers: arr };
  }

  /* Heatmap oraria (24 ore) per le pageview */
  function hourlyHeatmap(events) {
    const hours = new Array(24).fill(0);
    events.filter(e => e.type === 'pageview').forEach(e => {
      hours[new Date(e.ts).getHours()]++;
    });
    return hours;
  }

  /* SVG sparkline per serie di dati */
  function svgSparkline(values, w, h, color) {
    if (!values || values.length < 2) return '<svg width="' + w + '" height="' + h + '"></svg>';
    const max = Math.max(...values, 1);
    const step = w / (values.length - 1);
    const pts = values.map((v, i) => {
      const x = i * step;
      const y = h - (v / max) * h * 0.9 - 2;
      return x.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');
    return '<svg width="' + w + '" height="' + h + '" class="adm-spark">' +
      '<polyline points="' + pts + '" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
  }

  /* Bar chart orizzontale */
  function barRow(label, value, max, color) {
    const pctVal = max ? (value / max * 100) : 0;
    return '<div class="adm-bar-row">' +
      '<span class="adm-bar-label">' + esc(label) + '</span>' +
      '<span class="adm-bar-track"><span class="adm-bar-fill" style="width:' + pctVal + '%;background:' + color + '"></span></span>' +
      '<span class="adm-bar-value">' + esc(value) + '</span>' +
      '</div>';
  }

  /* Heatmap oraria SVG */
  function svgHourlyHeatmap(values) {
    const max = Math.max(...values, 1);
    const w = 480, h = 5 + 24 * 9;
    let cells = '';
    for (let h2 = 0; h2 < 24; h2++) {
      const v = values[h2] || 0;
      const opacity = v === 0 ? 0.06 : 0.2 + (v / max) * 0.8;
      cells += '<rect x="0" y="' + (5 + h2 * 9) + '" width="' + w + '" height="7" rx="2" fill="#4f46e5" fill-opacity="' + opacity.toFixed(2) + '"/>';
      cells += '<text x="0" y="' + (5 + h2 * 9 + 12) + '" font-size="9" fill="#6b7280">' + String(h2).padStart(2, '0') + 'h</text>';
      cells += '<text x="' + (w - 30) + '" y="' + (5 + h2 * 9 + 12) + '" font-size="9" fill="#374151" text-anchor="end">' + v + '</text>';
    }
    return '<svg viewBox="0 0 ' + (w + 40) + ' ' + h + '" class="adm-heatmap">' + cells + '</svg>';
  }

  /* Time series per ultimi N giorni */
  function dailySeries(sessions, events, days) {
    const now = Date.now();
    const daysArr = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      d.setHours(0, 0, 0, 0);
      daysArr.push({
        start: d.getTime(),
        end: d.getTime() + 86400000,
        label: d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
        sessions: 0,
        pageviews: 0,
      });
    }
    sessions.forEach(s => {
      const slot = daysArr.find(d => s.startTs >= d.start && s.startTs < d.end);
      if (slot) slot.sessions++;
    });
    events.filter(e => e.type === 'pageview').forEach(e => {
      const slot = daysArr.find(d => e.ts >= d.start && e.ts < d.end);
      if (slot) slot.pageviews++;
    });
    return daysArr;
  }

  /* --------- render sezione analytics --------- */
  function render(period) {
    period = period || '30d';
    const sessions = S.getSessions();
    const events = S.getEvents();
    const filt = filterByPeriod(events, sessions, period);
    const ps = filt.sessions;
    const es = filt.events;
    const days = period === 'today' ? 1 : period === '7d' ? 7 : period === '30d' ? 30 : 60;

    const stats = generalStats(ps, es);
    const pages = topPages(es);
    const langs = topLangs(ps);
    const devices = topDevices(ps);
    const refs = topReferrers(ps);
    const heat = hourlyHeatmap(es);
    const series = dailySeries(ps, es, days);

    const allSessions = S.getSessions();
    const liveSessions = allSessions.filter(s => (Date.now() - (s.lastTs || s.startTs)) < 5 * 60 * 1000);
    const livePageviews = S.getEvents().filter(e => e.type === 'pageview' && (Date.now() - e.ts) < 5 * 60 * 1000).length;

    return `
      <div class="adm-toolbar">
        <div class="adm-period-toggle" role="tablist" aria-label="Periodo">
          <button type="button" class="adm-tab ${period === 'today' ? 'is-active' : ''}" data-period="today">Oggi</button>
          <button type="button" class="adm-tab ${period === '7d' ? 'is-active' : ''}" data-period="7d">7gg</button>
          <button type="button" class="adm-tab ${period === '30d' ? 'is-active' : ''}" data-period="30d">30gg</button>
          <button type="button" class="adm-tab ${period === 'all' ? 'is-active' : ''}" data-period="all">Tutto</button>
        </div>
        <div class="adm-live-indicator">
          <span class="adm-live-dot"></span>
          <span><b>${liveSessions.length}</b> attive · <b>${livePageviews}</b> pageview (ultimi 5 min)</span>
        </div>
      </div>

      <div class="adm-kpi-grid">
        <div class="adm-kpi">
          <div class="adm-kpi-label">Sessioni</div>
          <div class="adm-kpi-value">${fmtNum(stats.sessions)}</div>
          <div class="adm-kpi-sub">${fmtNum(stats.visitori)} visitatori unici</div>
        </div>
        <div class="adm-kpi">
          <div class="adm-kpi-label">Pageview</div>
          <div class="adm-kpi-value">${fmtNum(stats.pageviews)}</div>
          <div class="adm-kpi-sub">${stats.sessions ? (stats.pageviews / stats.sessions).toFixed(1) : 0} per sessione</div>
        </div>
        <div class="adm-kpi">
          <div class="adm-kpi-label">Bounce rate</div>
          <div class="adm-kpi-value">${stats.bounceRate}</div>
          <div class="adm-kpi-sub">sessioni con 1 sola pagina</div>
        </div>
        <div class="adm-kpi">
          <div class="adm-kpi-label">Durata media</div>
          <div class="adm-kpi-value">${stats.avgDurationSec}s</div>
          <div class="adm-kpi-sub">tempo in sessione</div>
        </div>
        <div class="adm-kpi">
          <div class="adm-kpi-label">Cambi lingua</div>
          <div class="adm-kpi-value">${fmtNum(stats.langSwitches)}</div>
          <div class="adm-kpi-sub">utenti che esplorano</div>
        </div>
        <div class="adm-kpi">
          <div class="adm-kpi-label">Errori JS</div>
          <div class="adm-kpi-value" style="color:${stats.errors ? '#dc2626' : '#374151'}">${fmtNum(stats.errors)}</div>
          <div class="adm-kpi-sub">${stats.errors ? 'controlla il log' : 'tutto ok'}</div>
        </div>
      </div>

      <div class="adm-row">
        <div class="adm-card adm-card-wide">
          <h3>Andamento pageview · ultimi ${days} giorni</h3>
          <div class="adm-spark-wrap">
            ${svgSparkline(series.map(d => d.pageviews), 800, 60, '#4f46e5')}
            <div class="adm-spark-axis">
              ${series.map((d, i) => i % Math.ceil(days / 6) === 0 ? `<span>${esc(d.label)}</span>` : '').join('')}
            </div>
          </div>
          <div class="adm-chart-legend">sessioni (linea verde) e pageview (linea indaco) negli ultimi ${days} giorni</div>
          ${svgSparkline(series.map(d => d.sessions), 800, 60, '#10b981')}
        </div>

        <div class="adm-card">
          <h3>Heatmap oraria</h3>
          <p class="adm-card-sub">Quando gli utenti visitano il sito (ora locale)</p>
          ${svgHourlyHeatmap(heat)}
        </div>
      </div>

      <div class="adm-row">
        <div class="adm-card">
          <h3>Pagine piu viste</h3>
          ${pages.length ? pages.slice(0, 8).map(([p, n], i) => barRow(p, n, pages[0][1], '#4f46e5')).join('') : '<p class="adm-empty">Nessuna pageview ancora</p>'}
        </div>

        <div class="adm-card">
          <h3>Lingue del browser</h3>
          <p class="adm-card-sub">Lingua del browser del visitatore</p>
          ${langs.sessions.length ? langs.sessions.map(([l, n]) => barRow(l || '?', n, langs.sessions[0][1], '#8b5cf6')).join('') : '<p class="adm-empty">Nessun dato</p>'}
        </div>

        <div class="adm-card">
          <h3>Dispositivi</h3>
          <p class="adm-card-sub">Mobile vs desktop</p>
          ${barRow('Mobile', devices.mobile, devices.mobile + devices.desktop, '#4f46e5')}
          ${barRow('Desktop', devices.desktop, devices.mobile + devices.desktop, '#10b981')}
          <h4 style="margin-top:14px;font-size:0.85rem;color:#6b7280">Browser</h4>
          ${devices.browsers.slice(0, 6).map(([b, n]) => barRow(b, n, devices.browsers[0][1], '#06b6d4')).join('') || '<p class="adm-empty">Nessun dato</p>'}
          <h4 style="margin-top:14px;font-size:0.85rem;color:#6b7280">Viewport</h4>
          ${barRow('Mobile (<768)', devices.viewports.mobile, devices.mobile + devices.desktop, '#f59e0b')}
          ${barRow('Tablet (768-1023)', devices.viewports.tablet, devices.mobile + devices.desktop, '#f59e0b')}
          ${barRow('Desktop (>=1024)', devices.viewports.desktop, devices.mobile + devices.desktop, '#f59e0b')}
        </div>
      </div>

      <div class="adm-row">
        <div class="adm-card">
          <h3>Referrer (da dove arrivano)</h3>
          ${barRow('Diretto (digitato)', refs.direct, refs.direct + refs.referrers.reduce((a, [_, n]) => a + n, 0), '#6b7280')}
          ${refs.referrers.slice(0, 8).map(([r, n]) => barRow(r, n, refs.direct + refs.referrers.reduce((a, [_, n]) => a + n, 0), '#3b82f6')).join('') || '<p class="adm-empty">Nessun referrer</p>'}
        </div>

        <div class="adm-card">
          <h3>Sessioni recenti (ultime 20)</h3>
          <table class="adm-table">
            <tr><th>Quando</th><th>Lingua</th><th>Browser</th><th>Percorso</th><th>Pagine</th></tr>
            ${ps.slice(-20).reverse().map(s => `
              <tr>
                <td title="${esc(fmtDate(s.startTs))}">${esc(fmtAgo(s.startTs))} fa</td>
                <td>${esc(s.lang || '?')}</td>
                <td>${esc((s.device && s.device.isMobile) ? '📱' : '🖥️')} ${esc((s.device && s.device.browser) || '?').slice(0, 24)}</td>
                <td>${esc(s.path || '?')}</td>
                <td>${s.pageviews || 1}</td>
              </tr>`).join('') || '<tr><td colspan="5" class="adm-empty">Nessun dato</td></tr>'}
          </table>
        </div>
      </div>

      <div class="adm-row">
        <div class="adm-card">
          <h3>Errori JS (${stats.errors})</h3>
          ${stats.errors === 0 ? '<p class="adm-empty">Nessun errore</p>' : `
            <table class="adm-table">
              <tr><th>Quando</th><th>Tipo</th><th>Messaggio</th></tr>
              ${es.filter(e => e.type === 'js_error' || e.type === 'promise_rejection').slice(-15).reverse().map(e => `
                <tr>
                  <td>${esc(fmtAgo(e.ts))} fa</td>
                  <td>${esc(e.type)}</td>
                  <td class="adm-err-cell">${esc((e.message || e.reason || '').slice(0, 120))}</td>
                </tr>`).join('')}
            </table>`}
        </div>

        <div class="adm-card">
          <h3>Click link interni + outbound (ultimi 15 ciascuno)</h3>
          <h4 style="margin-top:0;font-size:0.85rem;color:#6b7280">Interni</h4>
          ${es.filter(e => e.type === 'nav_click').slice(-15).reverse().map(e =>
            '<div class="adm-click-row"><span class="adm-click-time">' + esc(fmtAgo(e.ts)) + '</span><code>' + esc(e.href) + '</code></div>'
          ).join('') || '<p class="adm-empty">Nessun click</p>'}
          <h4 style="font-size:0.85rem;color:#6b7280">Outbound</h4>
          ${es.filter(e => e.type === 'outbound_click').slice(-15).reverse().map(e =>
            '<div class="adm-click-row"><span class="adm-click-time">' + esc(fmtAgo(e.ts)) + '</span><code>' + esc(e.href) + '</code></div>'
          ).join('') || '<p class="adm-empty">Nessun click</p>'}
        </div>
      </div>
    `;
  }

  global.AdminAnalytics = { render };
})(window);
