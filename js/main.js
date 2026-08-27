/* =========================================================
   Zefiro di Oksi - script principale
   Gestione del menu mobile (apri/chiudi) e del tasto Esc.
   Pensato per essere semplice e robusto anche su vecchi
   browser Android (no dipendenze).
   ========================================================= */

(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var toggle = document.querySelector('.nav-toggle');
    var list   = document.querySelector('.nav-list');
    if (!toggle || !list) return;

    function setOpen(open) {
      list.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
    }

    // Stato iniziale coerente con l'HTML
    setOpen(false);

    toggle.addEventListener('click', function () {
      var isOpen = list.classList.contains('is-open');
      setOpen(!isOpen);
    });

    // Chiudi con Esc
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && list.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Chiudi quando si clicca fuori (solo mobile)
    document.addEventListener('click', function (e) {
      if (!list.classList.contains('is-open')) return;
      if (e.target === toggle || toggle.contains(e.target)) return;
      if (list.contains(e.target)) return;
      setOpen(false);
    });

    // Su viewport >= 720px il menu è sempre aperto via CSS:
    // se l'utente ridimensiona, assicuriamoci che lo stato resti coerente.
    var mq = window.matchMedia('(min-width: 720px)');
    function sync(e) {
      if (e.matches) setOpen(false); // CSS forza la visibilità
    }
    if (mq.addEventListener) mq.addEventListener('change', sync);
    else if (mq.addListener) mq.addListener(sync);
  });
})();
