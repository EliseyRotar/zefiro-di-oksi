/* =========================================================
   Zefiro di Oksi - nav-hint.js
   Gestisce il banner "usa le icone in basso" + freccia animata.

   Comportamento:
   - Al boot, se localStorage 'zefiro:navHintDismissed' != '1',
     mostra il banner (solo in home) + la freccia (su tutte le pagine).
   - Click sul bottone X → nasconde banner e freccia, salva dismissed=1.
   - Click su QUALSIASI link della bottom-nav → nasconde banner e freccia
     automaticamente (l'utente ha capito come si naviga).
   - L'admin può resettare lo stato (vedi admin/storage.js: resetNavHint).
   ========================================================= */

(function () {
  'use strict';

  const DISMISSED_KEY = 'zefiro:navHintDismissed';
  const ARROW_ID = 'nav-hint-arrow';

  function isDismissed() {
    try { return localStorage.getItem(DISMISSED_KEY) === '1'; }
    catch (_) { return false; }
  }
  function setDismissed() {
    try { localStorage.setItem(DISMISSED_KEY, '1'); } catch (_) {}
  }
  function clearDismissed() {
    try { localStorage.removeItem(DISMISSED_KEY); } catch (_) {}
  }

  // Espone helper per admin
  window.ZefiroNavHint = { clearDismissed };

  // ============ Freccia animata (iniettata su tutte le pagine) ============
  function ensureArrow() {
    if (document.getElementById(ARROW_ID)) return;
    const div = document.createElement('div');
    div.id = ARROW_ID;
    div.className = 'nav-hint-arrow';
    div.setAttribute('aria-hidden', 'true');
    div.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4 V20 M5 13 L12 20 L19 13"/></svg>';
    document.body.appendChild(div);
  }

  function showArrow() {
    ensureArrow();
    const a = document.getElementById(ARROW_ID);
    if (a) a.hidden = false;
  }
  function hideArrow() {
    const a = document.getElementById(ARROW_ID);
    if (a) a.hidden = true;
  }

  // ============ Banner (solo in home) ============
  function hideBanner() {
    const b = document.getElementById('nav-hint');
    if (b) b.hidden = true;
  }
  function showBanner() {
    const b = document.getElementById('nav-hint');
    if (b) {
      b.hidden = false;
      // Aggiorna label aria localizzata
      const t = window.I18N && window.I18N.t;
      if (t) {
        const aria = t('navhint.aria');
        if (aria) b.setAttribute('aria-label', aria);
        const closeLabel = t('navhint.close');
        const closeBtn = b.querySelector('[data-nav-hint-close]');
        if (closeBtn && closeLabel) closeBtn.setAttribute('aria-label', closeLabel);
      }
    }
  }

  function dismissEverything() {
    hideBanner();
    hideArrow();
    setDismissed();
  }

  // ============ Bind close button ============
  document.addEventListener('click', function (e) {
    const closeBtn = e.target.closest('[data-nav-hint-close]');
    if (closeBtn) {
      e.preventDefault();
      dismissEverything();
      return;
    }
    // Click su qualsiasi link della bottom-nav
    const navLink = e.target.closest('.bottom-nav a');
    if (navLink) {
      dismissEverything();
    }
  });

  // ============ Re-localize banner on language change ============
  function localizeBanner() {
    const banner = document.getElementById('nav-hint');
    if (!banner) return;
    const T = window.I18N && window.I18N.t;
    if (!T) return;
    const aria = T('navhint.aria');
    if (aria) banner.setAttribute('aria-label', aria);
    const closeLabel = T('navhint.close');
    const closeBtn = banner.querySelector('[data-nav-hint-close]');
    if (closeBtn && closeLabel) closeBtn.setAttribute('aria-label', closeLabel);
  }
  document.addEventListener('zefiro:langchange', localizeBanner);

  // ============ Boot ============
  function init() {
    if (isDismissed()) {
      hideBanner();
      hideArrow();
      return;
    }
    // Mostra banner solo se l'elemento esiste (cioè siamo in home)
    const banner = document.getElementById('nav-hint');
    if (banner) showBanner();
    // Mostra sempre la freccia (anche sulle altre pagine aiuta)
    showArrow();
  }

  // Aspetta che i18n sia pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
