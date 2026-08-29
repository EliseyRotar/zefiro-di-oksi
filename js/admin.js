/* =========================================================
   Zefiro di Oksi - admin
   Autenticazione: password singola, hash SHA-256 confrontato lato client.
   La password NON e' mai nel codice in chiaro: solo l'hash.
   Di default la password e' 'zefiro2026' (hash pre-calcolato sotto).
   L'utente puo' cambiarla dopo il login; il nuovo hash viene salvato
   in localStorage con namespace separato.
   ========================================================= */

(function () {
  'use strict';

  const NS_AUTH = 'zefiro-admin-auth';
  const NS_ANALYTICS = 'zefiro-analytics';

  // SHA-256 di 'zefiro2026' (calcolato con crypto.subtle).
  // Per rigenerare un hash: esegui 'node scripts/hash-pw.js <password>'.
  const DEFAULT_HASH = '02edb747f2956f24954b67d6b7b0542d9b69ca20ec3ba96ca6475f953d431869';

  async function sha256Hex(text) {
    const buf = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', buf);
    return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function getStoredHash() {
    try {
      const h = localStorage.getItem(NS_AUTH + ':hash');
      return h || DEFAULT_HASH;
    } catch (_) { return DEFAULT_HASH; }
  }
  function setStoredHash(h) {
    try { localStorage.setItem(NS_AUTH + ':hash', h); } catch (_) {}
  }

  function isAuthed() {
    try { return sessionStorage.getItem(NS_AUTH + ':authed') === '1'; }
    catch (_) { return false; }
  }
  function setAuthed(v) {
    try {
      if (v) sessionStorage.setItem(NS_AUTH + ':authed', '1');
      else sessionStorage.removeItem(NS_AUTH + ':authed');
    } catch (_) {}
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function fmtTs(ts) {
    const d = new Date(ts);
    return d.toLocaleString();
  }
  function fmtAgo(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return s + 's fa';
    if (s < 3600) return Math.floor(s / 60) + 'm fa';
    if (s < 86400) return Math.floor(s / 3600) + 'h fa';
    return Math.floor(s / 86400) + 'g fa';
  }
  function relTime(ts) {
    const diff = ts - Date.now();
    const s = Math.abs(diff) / 1000;
    if (s < 60) return 'adesso';
    if (s < 3600) return Math.floor(s / 60) + ' min';
    if (s < 86400) return Math.floor(s / 3600) + ' ore';
    return Math.floor(s / 86400) + ' giorni';
  }

  function loadJSON(key) {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); }
    catch (_) { return []; }
  }

  function renderStats() {
    const sessions = loadJSON(NS_ANALYTICS + ':sessions');
    const events = loadJSON(NS_ANALYTICS + ':events');
    const now = Date.now();
    const last24h = sessions.filter(s => (now - s.startTs) < 86400000);
    const last7d = sessions.filter(s => (now - s.startTs) < 7 * 86400000);
    const langs = {};
    const devices = { mobile: 0, desktop: 0 };
    const browsers = {};
    sessions.forEach(s => {
      langs[s.lang] = (langs[s.lang] || 0) + 1;
      if (s.device && s.device.isMobile) devices.mobile++; else devices.desktop++;
      const b = (s.device && s.device.browser) || 'unknown';
      browsers[b] = (browsers[b] || 0) + 1;
    });
    const pageviews = {};
    events.filter(e => e.type === 'pageview').forEach(e => {
      const p = e.path || '?';
      pageviews[p] = (pageviews[p] || 0) + 1;
    });
    const langSwitch = events.filter(e => e.type === 'lang_switch').length;
    const navClicks = events.filter(e => e.type === 'nav_click').length;
    const errors = events.filter(e => e.type === 'js_error' || e.type === 'promise_rejection');
    const outbound = events.filter(e => e.type === 'outbound_click');

    return `
      <section class="adm-card">
        <h2>Riepilogo</h2>
        <div class="adm-grid">
          <div class="adm-stat"><div class="adm-stat-num">${sessions.length}</div><div class="adm-stat-lbl">sessioni totali</div></div>
          <div class="adm-stat"><div class="adm-stat-num">${last24h.length}</div><div class="adm-stat-lbl">ultime 24h</div></div>
          <div class="adm-stat"><div class="adm-stat-num">${last7d.length}</div><div class="adm-stat-lbl">ultimi 7 giorni</div></div>
          <div class="adm-stat"><div class="adm-stat-num">${Object.values(pageviews).reduce((a, b) => a + b, 0)}</div><div class="adm-stat-lbl">pageview totali</div></div>
          <div class="adm-stat"><div class="adm-stat-num">${langSwitch}</div><div class="adm-stat-lbl">cambi lingua</div></div>
          <div class="adm-stat"><div class="adm-stat-num">${navClicks}</div><div class="adm-stat-lbl">click link interni</div></div>
        </div>
      </section>

      <section class="adm-card">
        <h2>Lingue del browser</h2>
        <table class="adm-table">
          <tr><th>Lingua</th><th>Sessioni</th><th>%</th></tr>
          ${Object.entries(langs).sort((a, b) => b[1] - a[1]).map(([l, n]) =>
            `<tr><td>${escapeHtml(l)}</td><td>${n}</td><td>${Math.round(n / sessions.length * 100)}%</td></tr>`
          ).join('') || '<tr><td colspan="3">Nessun dato ancora</td></tr>'}
        </table>
      </section>

      <section class="adm-card">
        <h2>Dispositivi</h2>
        <table class="adm-table">
          <tr><th>Tipo</th><th>Sessioni</th></tr>
          <tr><td>Mobile</td><td>${devices.mobile}</td></tr>
          <tr><td>Desktop</td><td>${devices.desktop}</td></tr>
        </table>
        <h3 style="margin-top:14px;font-size:0.95rem">Browser</h3>
        <table class="adm-table">
          <tr><th>Browser</th><th>Sessioni</th></tr>
          ${Object.entries(browsers).sort((a, b) => b[1] - a[1]).map(([b, n]) =>
            `<tr><td>${escapeHtml(b)}</td><td>${n}</td></tr>`
          ).join('') || '<tr><td colspan="2">Nessun dato ancora</td></tr>'}
        </table>
      </section>

      <section class="adm-card">
        <h2>Pagine viste</h2>
        <table class="adm-table">
          <tr><th>Pagina</th><th>Visite</th></tr>
          ${Object.entries(pageviews).sort((a, b) => b[1] - a[1]).map(([p, n]) =>
            `<tr><td>${escapeHtml(p)}</td><td>${n}</td></tr>`
          ).join('') || '<tr><td colspan="2">Nessun dato ancora</td></tr>'}
        </table>
      </section>

      <section class="adm-card">
        <h2>Sessioni recenti (ultime 20)</h2>
        <table class="adm-table">
          <tr><th>Quando</th><th>Lingua</th><th>Dispositivo</th><th>Percorso iniziale</th><th>Pageviews</th></tr>
          ${sessions.slice(-20).reverse().map(s => `
            <tr>
              <td title="${fmtTs(s.startTs)}">${fmtAgo(s.startTs)}</td>
              <td>${escapeHtml(s.lang || '?')}</td>
              <td>${escapeHtml((s.device && s.device.isMobile) ? 'mobile' : 'desktop')} · ${escapeHtml((s.device && s.device.browser) || '?')}</td>
              <td>${escapeHtml(s.path || '?')}</td>
              <td>${s.pageviews || 1}</td>
            </tr>
          `).join('') || '<tr><td colspan="5">Nessun dato ancora</td></tr>'}
        </table>
      </section>

      <section class="adm-card">
        <h2>Errori JS (${errors.length})</h2>
        ${errors.length === 0 ? '<p class="adm-empty">Nessun errore registrato</p>' : `
          <table class="adm-table">
            <tr><th>Quando</th><th>Tipo</th><th>Messaggio</th></tr>
            ${errors.slice(-15).reverse().map(e => `
              <tr>
                <td>${fmtAgo(e.ts)}</td>
                <td>${escapeHtml(e.type)}</td>
                <td>${escapeHtml((e.message || e.reason || '').slice(0, 100))}</td>
              </tr>
            `).join('')}
          </table>
        `}
      </section>

      <section class="adm-card">
        <h2>Click su link interni (ultimi 15)</h2>
        <table class="adm-table">
          <tr><th>Quando</th><th>Destinazione</th></tr>
          ${events.filter(e => e.type === 'nav_click').slice(-15).reverse().map(e => `
            <tr><td>${fmtAgo(e.ts)}</td><td>${escapeHtml(e.href)}</td></tr>
          `).join('') || '<tr><td colspan="2">Nessun click ancora</td></tr>'}
        </table>
      </section>

      <section class="adm-card">
        <h2>Click in uscita (mail/link esterni)</h2>
        <table class="adm-table">
          <tr><th>Quando</th><th>URL</th></tr>
          ${outbound.slice(-15).reverse().map(e => `
            <tr><td>${fmtAgo(e.ts)}</td><td>${escapeHtml(e.href)}</td></tr>
          `).join('') || '<tr><td colspan="2">Nessun click ancora</td></tr>'}
        </table>
      </section>
    `;
  }

  function showLogin() {
    document.getElementById('adm-login').hidden = false;
    document.getElementById('adm-panel').hidden = true;
  }
  function showPanel() {
    document.getElementById('adm-login').hidden = true;
    document.getElementById('adm-panel').hidden = false;
    document.getElementById('adm-panel').innerHTML = renderStats();
  }

  async function doLogin() {
    const pw = document.getElementById('adm-pw').value;
    const err = document.getElementById('adm-err');
    err.textContent = '';
    if (!pw) { err.textContent = 'Inserisci la password.'; return; }
    const h = await sha256Hex(pw);
    const stored = getStoredHash();
    if (h === stored) {
      setAuthed(true);
      showPanel();
    } else {
      err.textContent = 'Password sbagliata.';
    }
  }

  async function changePassword() {
    const cur = prompt('Password attuale:');
    if (!cur) return;
    const curHash = await sha256Hex(cur);
    if (curHash !== getStoredHash()) { alert('Password attuale sbagliata.'); return; }
    const nuovo = prompt('Nuova password (almeno 6 caratteri):');
    if (!nuovo || nuovo.length < 6) { alert('Troppo corta.'); return; }
    const nuovo2 = prompt('Conferma nuova password:');
    if (nuovo !== nuovo2) { alert('Non coincidono.'); return; }
    const nuovoHash = await sha256Hex(nuovo);
    setStoredHash(nuovoHash);
    alert('Password cambiata. Conservala in un posto sicuro: se la perdi, i dati analytics restano ma non puoi piu\' accedere a questa pagina.');
  }

  function logout() {
    setAuthed(false);
    showLogin();
    document.getElementById('adm-pw').value = '';
  }

  function exportData() {
    const data = {
      sessions: loadJSON(NS_ANALYTICS + ':sessions'),
      events: loadJSON(NS_ANALYTICS + ':events'),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zefiro-analytics-' + Date.now() + '.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearData() {
    if (!confirm('Cancellare TUTTI i dati analytics? Operazione irreversibile.')) return;
    localStorage.removeItem(NS_ANALYTICS + ':sessions');
    localStorage.removeItem(NS_ANALYTICS + ':events');
    localStorage.removeItem(NS_ANALYTICS + ':lastSeen');
    showPanel();
  }

  // === BOOT ===
  document.addEventListener('DOMContentLoaded', function () {
    if (isAuthed()) {
      showPanel();
    } else {
      showLogin();
    }
    const btn = document.getElementById('adm-btn');
    if (btn) btn.addEventListener('click', doLogin);
    const pwInput = document.getElementById('adm-pw');
    if (pwInput) pwInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') doLogin(); });
    const logoutBtn = document.getElementById('adm-logout');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    const exportBtn = document.getElementById('adm-export');
    if (exportBtn) exportBtn.addEventListener('click', exportData);
    const changePwBtn = document.getElementById('adm-change-pw');
    if (changePwBtn) changePwBtn.addEventListener('click', changePassword);
    const clearBtn = document.getElementById('adm-clear');
    if (clearBtn) clearBtn.addEventListener('click', clearData);

    // Auto-refresh ogni 10s mentre il pannello e' aperto
    setInterval(function () {
      if (isAuthed() && !document.getElementById('adm-panel').hidden) {
        document.getElementById('adm-panel').innerHTML = renderStats();
      }
    }, 10000);
  });

  // Esponi l'hash attuale in console (per debug): aprire la console e scrivere
  // _zefiroAdmin.hash() per vedere l'hash della password corrente.
  // Per generare un nuovo hash: _zefiroAdmin.sha256('nuova_password')
  window._zefiroAdmin = {
    sha256: sha256Hex,
    hash: () => getStoredHash(),
  };
})();
