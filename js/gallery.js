/* =========================================================
   Zefiro di Oksi - galleria UI
   - Render griglia filtrata
   - Lightbox accessibile (keyboard + swipe)
   - 2 filtri (Tutte / Zefir) come richiesto
   - Sistema tagli correlati: "vedi l'interno" / "torna alla torta intera"
   - Descrizione rimossa (non serve)
   ========================================================= */

(function (global) {
  'use strict';

  const grid    = document.getElementById('gallery-grid');
  const empty   = document.getElementById('gallery-empty');
  const countEl = document.getElementById('gallery-count');
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lightbox-img');
  const lbSlice = document.getElementById('lightbox-slice');
  const lbCount = document.getElementById('lightbox-counter');
  const lbClose = document.getElementById('lightbox-close');
  const lbPrev  = document.getElementById('lightbox-prev');
  const lbNext  = document.getElementById('lightbox-next');
  const filtersHost = document.querySelector('.gallery-filters');

  let currentFilter = 'zefir';
  let currentList = [];      // lista di items visibili (filtrata)
  let currentIndex = 0;      // indice in currentList
  let currentItem = null;     // item aperto nel lightbox (= currentList[currentIndex])
  let lastFocus = null;

  /* ---------- helpers ---------- */

  function t(key, vars) {
    const s = (window.I18N && window.I18N.t(key)) || key;
    if (!vars) return s;
    return s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  }

  function getLang() { return (window.I18N && window.I18N.getLang()) || 'it'; }

  /* ---------- filtri ---------- */

  function renderFilters() {
    filtersHost.innerHTML = '';
    const list = (window.GALLERY && window.GALLERY.FILTERS) || [
      { id: 'zefir', labelKey: 'gallery.filter.zefir' },
      { id: 'myworks', labelKey: 'gallery.filter.myworks' },
    ];
    list.forEach((f, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'filter-btn' + (f.id === currentFilter ? ' is-active' : '');
      b.dataset.filter = f.id;
      b.setAttribute('aria-pressed', f.id === currentFilter ? 'true' : 'false');
      b.textContent = t(f.labelKey);
      b.addEventListener('click', () => applyFilter(f.id));
      filtersHost.appendChild(b);
    });
  }

  /* ---------- render griglia ---------- */

  function render() {
    currentList = (window.GALLERY.visibleItems
      ? window.GALLERY.visibleItems(currentFilter)
      : (window.GALLERY.getByCategory(currentFilter) || []));
    grid.innerHTML = '';

    if (!currentList.length) {
      empty.hidden = false;
      countEl.textContent = '';
      return;
    }
    empty.hidden = true;
    countEl.textContent = t('gallery.filter.count', { n: String(currentList.length) });

    const frag = document.createDocumentFragment();
    currentList.forEach((it, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gallery-item';
      btn.setAttribute('role', 'listitem');
      btn.dataset.idx = String(idx);
      btn.dataset.file = it.file;
      btn.setAttribute('aria-label', it.alt);

      const img = document.createElement('img');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.src = 'images/' + it.file;
      img.alt = it.alt;
      img.className = 'gallery-thumb';

      btn.appendChild(img);
      btn.addEventListener('click', () => openAt(idx));
      frag.appendChild(btn);
    });
    grid.appendChild(frag);
  }

  function applyFilter(cat) {
    currentFilter = cat;
    renderFilters();
    render();
  }

  /* ---------- lightbox ---------- */

  function openAt(idx) {
    if (!currentList.length) return;
    currentIndex = ((idx % currentList.length) + currentList.length) % currentList.length;
    currentItem = currentList[currentIndex];
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
    currentItem = currentList[currentIndex];
    if (!currentItem) return;
    lbImg.src = 'images/' + currentItem.file;
    lbImg.alt = currentItem.alt;

    // bottone taglio correlato
    const BY = window.GALLERY.BY_FILE || {};
    if (currentItem.slice) {
      const sliceItem = BY[currentItem.slice];
      if (sliceItem) {
        lbSlice.hidden = false;
        lbSlice.textContent = t('gallery.see_inside');
        lbSlice.dataset.mode = 'open-slice';
        lbSlice.dataset.sliceFile = currentItem.slice;
      } else {
        lbSlice.hidden = true;
      }
    } else if (currentItem.hidden) {
      // siamo su una foto-slice, offri "torna alla torta intera"
      const parent = findParent(currentItem.file);
      if (parent) {
        lbSlice.hidden = false;
        lbSlice.textContent = t('gallery.see_outside');
        lbSlice.dataset.mode = 'open-parent';
        lbSlice.dataset.parentFile = parent.file;
      } else {
        lbSlice.hidden = true;
      }
    } else {
      lbSlice.hidden = true;
    }

    lbCount.textContent = t('gallery.counter', {
      current: String(currentIndex + 1),
      total: String(currentList.length)
    });
    lbPrev.setAttribute('aria-label', t('gallery.prev'));
    lbNext.setAttribute('aria-label', t('gallery.next'));
    lbClose.setAttribute('aria-label', t('gallery.close'));
  }

  function findParent(sliceFile) {
    const ITEMS = window.GALLERY.ITEMS || [];
    return ITEMS.find(it => it.slice === sliceFile) || null;
  }

  function step(delta) {
    if (!currentList.length) return;
    currentIndex = (currentIndex + delta + currentList.length) % currentList.length;
    showLightbox();
  }

  lbSlice.addEventListener('click', () => {
    const mode = lbSlice.dataset.mode;
    if (mode === 'open-slice') {
      // naviga alla slice (anche se e' hidden nella galleria, la mostriamo solo qui)
      const sliceFile = lbSlice.dataset.sliceFile;
      const BY = window.GALLERY.BY_FILE || {};
      const sliceItem = BY[sliceFile];
      if (!sliceItem) return;
      currentItem = sliceItem;
      // mostra: niente cambio di currentList (navighiamo dentro la stessa galleria),
      // ma l'index lo gestiamo separatamente via findByFile
      const idx = currentList.findIndex(it => it.file === sliceFile);
      if (idx >= 0) {
        currentIndex = idx;
      } else {
        // slice non in currentList (perche' hidden): la mostriamo come "extra"
        // Creiamo un riferimento temporaneo aggiungendolo alla lista
        currentList.push(sliceItem);
        currentIndex = currentList.length - 1;
      }
      showLightbox();
    } else if (mode === 'open-parent') {
      const parentFile = lbSlice.dataset.parentFile;
      const idx = currentList.findIndex(it => it.file === parentFile);
      if (idx >= 0) {
        currentIndex = idx;
        currentItem = currentList[idx];
        showLightbox();
      }
    }
  });

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
      const focusables = [lbClose, lbPrev, lbNext, lbSlice].filter(el => el && !el.hidden);
      const i = focusables.indexOf(document.activeElement);
      if (focusables.length === 0) return;
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
    if (lb.getAttribute('aria-hidden') === 'false') showLightbox();
    countEl.textContent = currentList.length
      ? t('gallery.filter.count', { n: String(currentList.length) })
      : '';
    renderFilters();
  });

  /* ---------- init ---------- */

  function init() {
    renderFilters();
    render();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Espone render per gallery-live.js per ri-renderizzare dopo
     upload o override dall'admin. */
  if (window.GALLERY) window.GALLERY.renderAll = init;
})(window);
