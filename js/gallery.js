/* =========================================================
   Zefiro di Oksi - galleria UI
   - Render griglia filtrata
   - Lightbox accessibile (keyboard + swipe)
   - Filtri per categoria
   - Lazy-loading immagini
   ========================================================= */

(function (global) {
  'use strict';

  const grid    = document.getElementById('gallery-grid');
  const empty   = document.getElementById('gallery-empty');
  const countEl = document.getElementById('gallery-count');
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lightbox-img');
  const lbDesc  = document.getElementById('lightbox-desc');
  const lbCount = document.getElementById('lightbox-counter');
  const lbClose = document.getElementById('lightbox-close');
  const lbPrev  = document.getElementById('lightbox-prev');
  const lbNext  = document.getElementById('lightbox-next');
  const filters = Array.from(document.querySelectorAll('.filter-btn'));

  let currentFilter = 'all';
  let currentList = [];
  let currentIndex = 0;
  let lastFocus = null;

  /* ---------- helpers ---------- */

  function t(key, vars) {
    const s = (global.I18N && global.I18N.t(key)) || key;
    if (!vars) return s;
    return s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  }

  function getLang() { return (global.I18N && global.I18N.getLang()) || 'it'; }

  function descFor(item) {
    const lang = getLang();
    const d = item.desc || {};
    return d[lang] || d.it || '';
  }

  /* ---------- render griglia ---------- */

  function render() {
    const list = global.GALLERY.getByCategory(currentFilter);
    currentList = list;
    grid.innerHTML = '';

    if (!list.length) {
      empty.hidden = false;
      countEl.textContent = '';
      return;
    }
    empty.hidden = true;
    countEl.textContent = t('gallery.filter.count', { n: String(list.length) });

    const frag = document.createDocumentFragment();
    list.forEach((it, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gallery-item';
      btn.setAttribute('role', 'listitem');
      btn.dataset.idx = String(idx);
      btn.setAttribute('aria-label', it.alt);

      const img = document.createElement('img');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.src = 'images/' + it.file;
      img.alt = it.alt;
      img.className = 'gallery-thumb';

      const cat = document.createElement('span');
      cat.className = 'gallery-cat-badge gallery-cat-' + it.cat;
      cat.textContent = t('gallery.filter.' + it.cat);
      cat.setAttribute('aria-hidden', 'true');

      btn.appendChild(img);
      btn.appendChild(cat);
      btn.addEventListener('click', () => openAt(idx));
      frag.appendChild(btn);
    });
    grid.appendChild(frag);
  }

  function applyFilter(cat) {
    currentFilter = cat;
    filters.forEach(b => {
      const on = b.dataset.filter === cat;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    render();
  }

  filters.forEach(b => {
    b.addEventListener('click', () => applyFilter(b.dataset.filter));
  });

  /* ---------- lightbox ---------- */

  function openAt(idx) {
    if (!currentList.length) return;
    currentIndex = (idx + currentList.length) % currentList.length;
    lastFocus = document.activeElement;
    showLightbox();
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    lbClose.focus();
  }

  function closeLightbox() {
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  function showLightbox() {
    const it = currentList[currentIndex];
    if (!it) return;
    lbImg.src = 'images/' + it.file;
    lbImg.alt = it.alt;
    lbDesc.textContent = descFor(it);
    lbCount.textContent = t('gallery.counter', {
      current: String(currentIndex + 1),
      total: String(currentList.length)
    });
    lbPrev.setAttribute('aria-label', t('gallery.prev'));
    lbNext.setAttribute('aria-label', t('gallery.next'));
    lbClose.setAttribute('aria-label', t('gallery.close'));
  }

  function step(delta) {
    if (!currentList.length) return;
    currentIndex = (currentIndex + delta + currentList.length) % currentList.length;
    showLightbox();
  }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => step(-1));
  lbNext.addEventListener('click', () => step(+1));

  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (lb.getAttribute('aria-hidden') === 'true') return;
    if (e.key === 'Escape') { closeLightbox(); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { step(-1); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { step(+1); e.preventDefault(); }
    else if (e.key === 'Tab') {
      // intrappola focus dentro lightbox
      const focusables = [lbClose, lbPrev, lbNext];
      const i = focusables.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { focusables[focusables.length - 1].focus(); e.preventDefault(); }
      else if (!e.shiftKey && i === focusables.length - 1) { focusables[0].focus(); e.preventDefault(); }
    }
  });

  // Swipe base su touch
  let touchX = null;
  lb.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (touchX == null) return;
    const dx = (e.changedTouches[0].clientX - touchX);
    if (Math.abs(dx) > 40) step(dx > 0 ? -1 : +1);
    touchX = null;
  });

  /* ---------- lingua ---------- */

  document.addEventListener('zefiro:langchange', () => {
    // aggiorna testi UI senza ricreare la griglia
    if (lb.getAttribute('aria-hidden') === 'false') showLightbox();
    countEl.textContent = currentList.length
      ? t('gallery.filter.count', { n: String(currentList.length) })
      : '';
    filters.forEach(b => { b.textContent = t('gallery.filter.' + b.dataset.filter); });
    document.querySelectorAll('.gallery-cat-badge').forEach(el => {
      const it = currentList[Number(el.parentElement.dataset.idx)];
      if (it) el.textContent = t('gallery.filter.' + it.cat);
    });
  });

  /* ---------- init ---------- */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})(window);
