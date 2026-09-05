/* =========================================================
   Zefiro di Oksi - nav-hint.js
   Banner "usa i quadrati colorati in alto" + freccia animata.

   Comportamento:
   - Banner creato runtime da JS (presente su TUTTE le pagine pubbliche).
   - Freccia animata che punta in ALTO verso la navbar.
   - Mostra/nasconde in base a localStorage 'zefiro:navHintDismissed'.
   - Click X → nasconde + salva dismissed=1.
   - Click su QUALSIASI link della navbar → dismiss automatico.
   - Admin può resettare (vedi admin: resetNavHint).
   - Si re-localizza su evento 'zefiro:langchange'.
   ========================================================= */

(function () {
  'use strict';

  const DISMISSED_KEY = 'zefiro:navHintDismissed';
  const ARROW_ID = 'nav-hint-arrow';
  const BANNER_ID = 'nav-hint';

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

  window.ZefiroNavHint = { clearDismissed, isDismissed };

  // ============ Build banner HTML ============
  function ensureBanner() {
    let b = document.getElementById(BANNER_ID);
    if (b) return b;
    b = document.createElement('div');
    b.id = BANNER_ID;
    b.className = 'nav-hint';
    b.setAttribute('role', 'region');
    b.innerHTML = `
      <span class="nav-hint-emoji" aria-hidden="true">&#x1F446;</span>
      <span class="nav-hint-text" data-i18n="navhint.body"></span>
      <button type="button" class="nav-hint-close" data-nav-hint-close aria-label="">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg>
      </button>
    `;
    // Inserisci banner + freccia subito DOPO la navbar (in alto)
    const nav = document.querySelector('.bottom-nav');
    if (nav && nav.nextSibling) {
      nav.parentNode.insertBefore(b, nav.nextSibling);
    } else {
      document.body.appendChild(b);
    }
    return b;
  }

  function ensureArrow() {
    let a = document.getElementById(ARROW_ID);
    if (a) return a;
    a = document.createElement('div');
    a.id = ARROW_ID;
    a.className = 'nav-hint-arrow';
    a.setAttribute('aria-hidden', 'true');
    a.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20 V4 M5 11 L12 4 L19 11"/></svg>';
    const banner = document.getElementById(BANNER_ID);
    if (banner && banner.parentNode) {
      banner.parentNode.insertBefore(a, banner);
    } else {
      document.body.appendChild(a);
    }
    return a;
  }

  function hideBanner() { const b = document.getElementById(BANNER_ID); if (b) b.hidden = true; }
  function hideArrow()  { const a = document.getElementById(ARROW_ID); if (a) a.hidden = true; }

  function showBanner() {
    const b = ensureBanner();
    b.hidden = false;
    localizeBanner();
  }
  function showArrow() {
    const a = ensureArrow();
    a.hidden = false;
  }

  function localizeBanner() {
    const T = window.I18N && window.I18N.t;
    if (!T) return;
    const banner = document.getElementById(BANNER_ID);
    if (!banner) return;
    const aria = T('navhint.aria');
    if (aria) banner.setAttribute('aria-label', aria);
    const closeLabel = T('navhint.close');
    const closeBtn = banner.querySelector('[data-nav-hint-close]');
    if (closeBtn && closeLabel) closeBtn.setAttribute('aria-label', closeLabel);
    const bodyEl = banner.querySelector('[data-i18n="navhint.body"]');
    if (bodyEl) bodyEl.textContent = T('navhint.body');
  }

  function dismissEverything() {
    hideBanner();
    hideArrow();
    setDismissed();
    document.body.classList.remove('nav-hint-active');
  }

  // ============ Bind handlers ============
  document.addEventListener('click', function (e) {
    const closeBtn = e.target.closest('[data-nav-hint-close]');
    if (closeBtn) {
      e.preventDefault();
      e.stopPropagation();
      dismissEverything();
      return;
    }
    const navLink = e.target.closest('.bottom-nav a');
    if (navLink) {
      dismissEverything();
    }
  });

  document.addEventListener('zefiro:langchange', function () {
    if (!isDismissed()) localizeBanner();
  });

  // ============ Boot ============
  function init() {
    if (isDismissed()) {
      hideBanner();
      hideArrow();
      return;
    }
    showBanner();
    showArrow();
    document.body.classList.add('nav-hint-active');
    // Localize after i18n has run
    if (window.I18N) localizeBanner();
    else setTimeout(function () { if (window.I18N) localizeBanner(); }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
