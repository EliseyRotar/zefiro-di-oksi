/* =========================================================
   Zefiro di Oksi - animazioni JS
   Reveal progressivo al load, staggered, IntersectionObserver,
   rispetta prefers-reduced-motion.
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

  /* Reveal staggered per elementi con classe .reveal e data-delay */
  function setupReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (prefersReducedMotion()) {
      els.forEach(el => {
        el.classList.add('is-visible');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const d = parseInt(el.dataset.delay || '0', 10);
            setTimeout(() => {
              el.classList.add('is-visible');
            }, d * 120);
            io.unobserve(el);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      els.forEach(el => io.observe(el));
    } else {
      els.forEach(el => el.classList.add('is-visible'));
    }
  }

  /* Fade-in della top navbar con piccolo slide-down al primo load */
  function setupBottomNavEntrance() {
    const nav = document.querySelector('.bottom-nav');
    if (!nav) return;
    if (prefersReducedMotion()) {
      nav.style.opacity = '1';
      nav.style.transform = 'none';
      return;
    }
    nav.classList.add('will-animate');
    setTimeout(() => {
      nav.classList.add('entered');
    }, 220);
  }

  /* Hover lift per le gallery-item via CSS (.gallery-item:hover gia' presente);
     qui aggiungiamo solo tap feedback su mobile */
  function setupMobileTap() {
    if (!('ontouchstart' in window)) return;
    document.querySelectorAll('.gallery-item, .filter-btn').forEach(el => {
      el.addEventListener('touchstart', () => el.classList.add('is-touched'), { passive: true });
      el.addEventListener('touchend', () => {
        setTimeout(() => el.classList.remove('is-touched'), 200);
      });
    });
  }

  ready(function () {
    setupReveal();
    setupBottomNavEntrance();
    setupMobileTap();
  });
})();
