/* =========================================================
   Zefiro di Oksi - admin main
   Entry point + router delle sezioni + auth UI + export/import
   ========================================================= */

(function (global) {
  'use strict';

  const S = window.AdminStorage;
  const A = window.AdminAnalytics;
  const E = window.AdminEditor;
  const T = window.I18N ? window.I18N.t : (k) => k;
  const toast = E.toast;

  /* Stato */
  let currentSection = 'analytics';
  let currentPeriod = '30d';
  let liveTimer = null;

  /* ---------- boot ---------- */
  function boot() {
    if (!S.isAuthed()) {
      showLogin();
      return;
    }
    showDashboard();
  }

  /* ---------- LOGIN ---------- */
  function showLogin() {
    document.getElementById('adm-login').hidden = false;
    document.getElementById('adm-shell').hidden = true;
    const form = document.getElementById('adm-login-form');
    form.onsubmit = async (e) => {
      e.preventDefault();
      const pw = document.getElementById('adm-pw').value;
      const err = document.getElementById('adm-err');
      err.textContent = '';
      const r = await S.login(pw);
      if (r.ok) {
        err.textContent = '';
        showDashboard();
      } else {
        err.textContent = r.error;
      }
    };
    setTimeout(() => document.getElementById('adm-pw').focus(), 100);
  }

  /* ---------- DASHBOARD ---------- */
  function showDashboard() {
    document.getElementById('adm-login').hidden = true;
    document.getElementById('adm-shell').hidden = false;
    setupSidebar();
    switchSection('analytics');
    if (liveTimer) clearInterval(liveTimer);
    liveTimer = setInterval(() => {
      if (currentSection === 'analytics') renderSection();
    }, 5000);
  }

  function setupSidebar() {
    const links = document.querySelectorAll('.adm-side-link');
    links.forEach(a => {
      a.onclick = (e) => {
        e.preventDefault();
        const sec = a.dataset.section;
        switchSection(sec);
      };
    });

    document.getElementById('adm-logout').onclick = () => {
      if (!confirm('Uscire dall\'area admin?')) return;
      S.logout();
      location.reload();
    };
  }

  function switchSection(sec) {
    currentSection = sec;
    document.querySelectorAll('.adm-side-link').forEach(a => {
      a.classList.toggle('is-active', a.dataset.section === sec);
    });
    renderSection();
  }

  function renderSection() {
    const main = document.getElementById('adm-main');
    if (currentSection === 'analytics') {
      main.innerHTML = '<div id="adm-section-analytics">' + A.render(currentPeriod) + '</div>';
      bindPeriodToggle();
    } else if (currentSection === 'content') {
      main.innerHTML = '<div id="adm-section-content">' + E.renderContent() + E.renderGallery() + '</div>';
      E.bindContent();
      E.bindGallery();
    } else if (currentSection === 'settings') {
      main.innerHTML = '<div id="adm-section-settings">' + renderSettings() + '</div>';
      bindSettings();
    } else if (currentSection === 'help') {
      main.innerHTML = '<div id="adm-section-help">' + renderHelp() + '</div>';
    }
    /* Aggiorna label di sezione attiva */
    const title = document.getElementById('adm-section-title');
    const labels = {
      analytics: 'Analytics',
      content: 'Contenuti & Galleria',
      settings: 'Impostazioni',
      help: 'Aiuto'
    };
    if (title) title.textContent = labels[currentSection] || '';
  }

  function bindPeriodToggle() {
    document.querySelectorAll('.adm-tab[data-period]').forEach(btn => {
      btn.onclick = () => {
        currentPeriod = btn.dataset.period;
        renderSection();
      };
    });
  }

  /* ---------- SETTINGS ---------- */
  function renderSettings() {
    const days = S.getSessionDays();
    return `
      <div class="adm-card">
        <h3>Sicurezza</h3>
        <form id="adm-pw-form" class="adm-form">
          <fieldset class="adm-fieldset">
            <legend>Cambia password</legend>
            <label class="adm-field">
              <span class="adm-field-label">Password attuale</span>
              <input type="password" name="current" required autocomplete="current-password" />
            </label>
            <label class="adm-field">
              <span class="adm-field-label">Nuova password (min 6 caratteri)</span>
              <input type="password" name="new" required minlength="6" autocomplete="new-password" />
            </label>
            <label class="adm-field">
              <span class="adm-field-label">Conferma nuova password</span>
              <input type="password" name="confirm" required minlength="6" autocomplete="new-password" />
            </label>
          </fieldset>
          <div class="adm-form-actions">
            <button type="submit" class="adm-btn primary" id="adm-pw-change">Cambia password</button>
          </div>
        </form>
        <p class="adm-note">Se dimentichi la password, i dati analytics salvati restano ma non potrai piu' accedere all'admin. Conservala in un posto sicuro.</p>
      </div>

      <div class="adm-card">
        <h3>Sessione</h3>
        <label class="adm-field">
          <span class="adm-field-label">Login ricordami per (giorni)</span>
          <select id="adm-session-days">
            <option value="1" ${days === 1 ? 'selected' : ''}>1 giorno</option>
            <option value="7" ${days === 7 ? 'selected' : ''}>7 giorni</option>
            <option value="30" ${days === 30 ? 'selected' : ''}>30 giorni (default)</option>
            <option value="90" ${days === 90 ? 'selected' : ''}>90 giorni</option>
            <option value="365" ${days === 365 ? 'selected' : ''}>1 anno</option>
            <option value="999999" ${days === 999999 ? 'selected' : ''}>Mai (finche' non faccio logout)</option>
          </select>
        </label>
      </div>

      <div class="adm-card">
        <h3>Backup e ripristino</h3>
        <p class="adm-card-sub">Esporta tutto (analytics + contenuti + galleria + configurazione) come file JSON.</p>
        <div class="adm-form-actions">
          <button type="button" class="adm-btn primary" id="adm-export">Esporta tutto (JSON)</button>
          <button type="button" class="adm-btn ghost" id="adm-import">Importa da backup</button>
          <input type="file" id="adm-import-file" accept="application/json" hidden />
        </div>
        <p class="adm-note">L'export contiene l'hash della password attuale. Se cambi password e poi importi un backup vecchio, l'hash verra' ripristinato.</p>
      </div>

      <div class="adm-card danger-zone">
        <h3>Zona pericolosa</h3>
        <div class="adm-form-actions">
          <button type="button" class="adm-btn danger" id="adm-clear-analytics">Cancella solo analytics</button>
          <button type="button" class="adm-btn danger" id="adm-nuke">Cancella TUTTO</button>
        </div>
        <p class="adm-note">"Cancella TUTTO" elimina autenticazione, contenuti, galleria e analytics. Dovrai reimpostare la password al prossimo accesso.</p>
      </div>
    `;
  }

  function bindSettings() {
    /* Cambia password */
    const pwForm = document.getElementById('adm-pw-form');
    if (pwForm) {
      pwForm.onsubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(pwForm);
        const cur = fd.get('current');
        const nu = fd.get('new');
        const cf = fd.get('confirm');
        if (nu !== cf) { toast('Le password non coincidono.', 'err'); return; }
        const r = await S.changePassword(cur, nu);
        if (r.ok) {
          toast('Password cambiata.', 'ok');
          pwForm.reset();
        } else {
          toast(r.error, 'err');
        }
      };
    }

    /* Durata sessione */
    const sel = document.getElementById('adm-session-days');
    if (sel) {
      sel.onchange = () => {
        const v = parseInt(sel.value, 10);
        S.setSessionDays(v);
        toast('Sessione ora dura ' + (v === 999999 ? 'per sempre' : v + ' giorni'), 'ok');
      };
    }

    /* Export / Import */
    const exportBtn = document.getElementById('adm-export');
    if (exportBtn) exportBtn.onclick = () => doExport();
    const importBtn = document.getElementById('adm-import');
    const importFile = document.getElementById('adm-import-file');
    if (importBtn) importBtn.onclick = () => importFile.click();
    if (importFile) importFile.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          const r = S.importAll(data);
          if (r.ok) { toast('Backup ripristinato. Ricarico...', 'ok'); setTimeout(() => location.reload(), 800); }
          else toast(r.error, 'err');
        } catch (e) { toast('File non valido: ' + e.message, 'err'); }
      };
      reader.readAsText(file);
    };

    /* Cancella analytics */
    const clearAna = document.getElementById('adm-clear-analytics');
    if (clearAna) clearAna.onclick = () => {
      if (!confirm('Cancellare TUTTI i dati analytics?')) return;
      S.clearAnalytics();
      toast('Analytics cancellate.', 'ok');
      renderSection();
    };

    /* Nuke */
    const nuke = document.getElementById('adm-nuke');
    if (nuke) nuke.onclick = () => {
      if (!confirm('Cancellare TUTTO? Auth + contenuti + galleria + analytics. Operazione irreversibile.')) return;
      if (!confirm('Sei sicuro al 100%?')) return;
      S.nukeEverything();
      location.reload();
    };
  }

  function doExport() {
    const data = S.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zefiro-admin-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
    toast('Backup scaricato.', 'ok');
  }

  /* ---------- HELP ---------- */
  function renderHelp() {
    return `
      <div class="adm-card">
        <h3>Cos'e questa admin</h3>
        <p>Area privata per gestire le statistiche del sito e i contenuti senza dover modificare il codice. Tutti i dati sono salvati solo nel browser di questo dispositivo (localStorage).</p>
        <p><b>Importante:</b> se apri admin da un altro browser o dispositivo non troverai i dati analytics, perche' sono locali.</p>
      </div>
      <div class="adm-card">
        <h3>Sezioni</h3>
        <ul>
          <li><b>Analytics</b> - statistiche delle visite: sessioni, lingue, browser, pagine viste, errori JS, click, monitor live.</li>
          <li><b>Contenuti & Galleria</b> - modifica testi (home, contatti, box supporto, card famiglia) e gestione galleria (upload, riordino, cambio categoria).</li>
          <li><b>Impostazioni</b> - cambia password, durata sessione, backup/ripristino JSON, cancellazione dati.</li>
        </ul>
      </div>
      <div class="adm-card">
        <h3>Come funziona la password</h3>
        <p>L'hash SHA-256 della password e' salvato in localStorage. Quando fai login, il browser confronta l'hash di cio' che scrivi con quello salvato. La password vera non viene mai inviata a nessun server (perche' non c'e' un server!).</p>
        <p>Per generare un nuovo hash da riga di comando: <code>node scripts/hash-pw.js 'nuova-password'</code>.</p>
      </div>
      <div class="adm-card">
        <h3>Privacy</h3>
        <p>Nessun cookie di tracciamento, nessuna chiamata esterna. Le statistiche sono raccolte lato client per gentilezza dell'utente che accetta di essere visitato.</p>
      </div>
    `;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window);
