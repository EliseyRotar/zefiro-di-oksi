/* =========================================================
   Zefiro di Oksi - gallery live update
   Applica override (category, hidden, order) impostati dall'admin.
   Se l'admin ha caricato foto nuove (custom base64), le aggiunge.
   Ascolta l'evento 'zefiro:gallerychange' per aggiornamenti live.
   ========================================================= */

(function () {
  'use strict';

  const NS = 'zefiro:auth';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function lsGet(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v == null ? fallback : JSON.parse(v);
    } catch (_) { return fallback; }
  }

  function applyOverrides() {
    const grid = document.getElementById('gallery-grid');
    if (!grid || !global.GALLERY) return;

    const overrides = lsGet(NS + ':gallery-overrides', {});
    const custom = lsGet(NS + ':gallery-custom', []);

    /* Applica override (cat, hidden, order) agli items esistenti */
    global.GALLERY.ITEMS.forEach(it => {
      const ov = overrides[it.file];
      if (ov) {
        if (ov.cat != null) it.cat = ov.cat;
        if (ov.hidden != null) it.hidden = ov.hidden;
        if (ov.order != null) it.order = ov.order;
      }
    });

    /* Aggiungi le custom alla fine */
    custom.forEach((c, i) => {
      global.GALLERY.ITEMS.push({
        file: c.id + '.jpg',
        custom: true,
        id: c.id,
        dataUrl: c.dataUrl,
        alt: c.alt || c.name,
        cat: c.cat || 'varie',
        hidden: !!c.hidden,
        order: 1000 + i,
      });
    });

    /* Re-render la griglia */
    if (global.GALLERY.renderAll) global.GALLERY.renderAll();
  }

  ready(applyOverrides);
  document.addEventListener('zefiro:gallerychange', applyOverrides);
})(window);
