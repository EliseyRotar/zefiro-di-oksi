/* =========================================================
   Zefiro di Oksi - animazioni JS
   Reveal progressivo degli elementi con classe .reveal al load
   della pagina. Usa IntersectionObserver se disponibile,
   fallback a setTimeout per browser vecchi.
   Rispetta prefers-reduced-motion.
   ========================================================= */

(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function prefersReducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (_) { return false; }
  }

  ready(function () {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (prefersReducedMotion()) {
      els.forEach(el => { el.classList.add('is-visible'); el.style.opacity = '1'; el.style.transform = 'none'; });
      return;
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      els.forEach(el => io.observe(el));
    } else {
      // Fallback: mostra subito tutto
      els.forEach(el => el.classList.add('is-visible'));
    }
  });
})();
