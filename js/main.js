/* =========================================================
   Zefiro di Oksi - script principale (revisione v3)
   Con i18n.js attivo, qui resta ben poco:
   - lingua iniziale: i18n si auto-inizializza al caricamento
   - lingua switcher: delega click su [data-lang-switch] a I18N.setLang
   - persistenza in localStorage: gestita da i18n.js
   ========================================================= */

(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    // Switch lingua: intercetta i click sui bottoni bandierina
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-lang-switch]');
      if (!btn) return;
      e.preventDefault();
      const lang = btn.getAttribute('data-lang-switch');
      if (lang && window.I18N) {
        window.I18N.setLang(lang);
        // Aggiorna anche il <title> meta per coerenza
        const t = window.I18N.t('site.title');
        if (t) document.title = t;
      }
    });

    // Quando i18n cambia lingua, ri-applica data-i18n su tutta la pagina
    document.addEventListener('zefiro:langchange', function () {
      if (window.I18N) window.I18N.applyAll();
    });
  });
})();
