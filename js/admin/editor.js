/* =========================================================
   Zefiro di Oksi - admin content + gallery editor
   Modifica testi (home/contact/support/about) e galleria
   (upload immagini, riordino, cambio categoria, eliminazione).
   Le modifiche sono salvate in localStorage e applicate a runtime
   via custom eventi (zefiro:contentchange, zefiro:gallerychange)
   che le pagine pubbliche ascoltano.
   ========================================================= */

(function (global) {
  'use strict';

  const S = global.AdminStorage;
  const T = global.I18N ? global.I18N.t : (k) => k;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  /* --------- EDITOR CONTENUTI --------- */
  function renderContent() {
    const c = S.getAllContent();
    const fields = [
      { section: 'home',     key: 'tagline',      label: 'Tagline home',          type: 'text',     maxlength: 120 },
      { section: 'contact',  key: 'email',        label: 'Email contatti',        type: 'email',    maxlength: 80 },
      { section: 'contact',  key: 'subject',      label: 'Oggetto email precompilato', type: 'text', maxlength: 80 },
      { section: 'support',  key: 'title',        label: 'Box supporto - titolo', type: 'text',     maxlength: 80 },
      { section: 'support',  key: 'body',         label: 'Box supporto - testo',  type: 'textarea', rows: 8 },
      { section: 'support',  key: 'note',         label: 'Box supporto - nota finale', type: 'text', maxlength: 120 },
      { section: 'about',    key: 'familyTitle',  label: 'Card famiglia - titolo', type: 'text',    maxlength: 60 },
      { section: 'about',    key: 'familyBody',   label: 'Card famiglia - testo',  type: 'textarea', rows: 4 },
    ];

    const grouped = {};
    fields.forEach(f => {
      grouped[f.section] = grouped[f.section] || [];
      grouped[f.section].push(f);
    });

    const sectionNames = {
      home: 'Home', contact: 'Contatti', support: 'Box supporto (donazione)', about: 'Chi sono - card famiglia'
    };

    let html = '<form id="adm-content-form" class="adm-form">';
    for (const section of Object.keys(grouped)) {
      html += '<fieldset class="adm-fieldset"><legend>' + esc(sectionNames[section] || section) + '</legend>';
      for (const f of grouped[section]) {
        const val = (c[section] && c[section][f.key]) || '';
        html += '<label class="adm-field">';
        html += '<span class="adm-field-label">' + esc(f.label) + '</span>';
        if (f.type === 'textarea') {
          html += '<textarea name="' + esc(section + '.' + f.key) + '" rows="' + (f.rows || 4) + '"' + (f.maxlength ? ' maxlength="' + f.maxlength + '"' : '') + '>' + esc(val) + '</textarea>';
        } else {
          html += '<input type="' + f.type + '" name="' + esc(section + '.' + f.key) + '" value="' + esc(val) + '"' + (f.maxlength ? ' maxlength="' + f.maxlength + '"' : '') + ' />';
        }
        html += '</label>';
      }
      html += '</fieldset>';
    }
    html += '<div class="adm-form-actions">';
    html += '<button type="button" class="adm-btn primary" id="adm-content-save">Salva modifiche</button>';
    html += '<button type="button" class="adm-btn ghost" id="adm-content-reset">Ripristina default</button>';
    html += '<button type="button" class="adm-btn ghost" id="adm-content-apply">Applica al sito</button>';
    html += '</div>';
    html += '<p class="adm-note">Le modifiche sono salvate localmente e applicate al sito live. Non servono commit / push.</p>';
    html += '</form>';
    return html;
  }

  function bindContent() {
    const form = document.getElementById('adm-content-form');
    if (!form) return;
    const save = document.getElementById('adm-content-save');
    const reset = document.getElementById('adm-content-reset');
    const apply = document.getElementById('adm-content-apply');

    function readForm() {
      const data = {};
      form.querySelectorAll('input[name], textarea[name]').forEach(el => {
        const [section, key] = el.name.split('.');
        data[section] = data[section] || {};
        data[section][key] = el.value;
      });
      return data;
    }

    save.addEventListener('click', () => {
      const data = readForm();
      let ok = true;
      for (const section of Object.keys(data)) {
        if (!S.setContent(section, data[section])) ok = false;
      }
      toast(ok ? 'Modifiche salvate.' : 'Errore nel salvataggio (localStorage pieno?)', ok ? 'ok' : 'err');
    });

    reset.addEventListener('click', () => {
      if (!confirm('Ripristinare i testi originali? Sovrascrive le tue personalizzazioni.')) return;
      ['home', 'contact', 'support', 'about'].forEach(s => S.setContent(s, {}));
      toast('Default ripristinati. Ricarico...', 'ok');
      setTimeout(() => location.reload(), 600);
    });

    apply.addEventListener('click', () => {
      const data = readForm();
      // Salva + applica al sito
      for (const section of Object.keys(data)) {
        S.setContent(section, data[section]);
      }
      document.dispatchEvent(new CustomEvent('zefiro:contentchange', { detail: data }));
      toast('Applicate al sito live (in questa sessione).', 'ok');
    });
  }

  /* --------- EDITOR GALLERIA --------- */
  const CATS = [
    { id: 'zefir',     label: 'Zefir' },
    { id: 'torte',     label: 'Torte' },
    { id: 'occasioni', label: 'Occasioni' },
    { id: 'varie',     label: 'Varie' },
    { id: 'hidden',    label: 'Nascosta (non in galleria)' },
  ];

  function renderGallery() {
    /* Combina foto originali (da gallery-data.js) + custom (da localStorage) */
    const baseItems = (global.GALLERY && global.GALLERY.ITEMS) || [];
    const overrides = S.getGalleryOverrides();
    const custom = S.getCustomPhotos();

    /* Applica override a baseItems */
    const items = baseItems.map(it => {
      const ov = overrides[it.file] || {};
      return Object.assign({}, it, ov);
    });
    /* Aggiungi le custom con order alto */
    custom.forEach((c, i) => {
      items.push({
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

    /* Ordina per order poi per indice */
    items.sort((a, b) => {
      const oa = (a.order !== undefined) ? a.order : 999;
      const ob = (b.order !== undefined) ? b.order : 999;
      return oa - ob;
    });

    /* Card upload */
    const uploadHtml = `
      <div class="adm-card">
        <h3>Aggiungi foto</h3>
        <p class="adm-card-sub">Trascina qui le immagini o clicca per selezionare. Max 4MB ciascuna. Vengono compresse a 1600px JPEG.</p>
        <div class="adm-upload-zone" id="adm-upload-zone">
          <input type="file" id="adm-upload-input" accept="image/*" multiple hidden />
          <p class="adm-upload-hint">Trascina foto qui o <button type="button" class="adm-link" id="adm-upload-pick">scegli file</button></p>
          <p class="adm-upload-status" id="adm-upload-status"></p>
        </div>
      </div>
    `;

    /* Griglia gestione */
    const galleryHtml = `
      <div class="adm-card">
        <h3>Galleria (${items.length} foto)</h3>
        <p class="adm-card-sub">Trascina le righe per riordinare. Cambia categoria o nascondi una foto. Le modifiche sono salvate localmente.</p>
        <table class="adm-table adm-table-gallery">
          <thead>
            <tr>
              <th></th>
              <th>Anteprima</th>
              <th>File</th>
              <th>Categoria</th>
              <th>Visibilita</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="adm-gallery-tbody">
            ${items.map((it, i) => `
              <tr data-file="${esc(it.file)}" data-custom="${it.custom ? '1' : '0'}" data-id="${esc(it.id || '')}" draggable="true">
                <td class="adm-drag-handle">::</td>
                <td><img src="${it.custom ? it.dataUrl : 'images/' + it.file}" alt="${esc(it.alt)}" class="adm-thumb" /></td>
                <td><code>${esc(it.file)}</code></td>
                <td>
                  <select data-action="cat">
                    ${CATS.map(c => `<option value="${c.id}" ${c.id === (it.cat || (it.hidden ? 'hidden' : 'varie')) ? 'selected' : ''}>${esc(c.label)}</option>`).join('')}
                  </select>
                </td>
                <td>
                  <label><input type="checkbox" data-action="hidden" ${it.hidden ? 'checked' : ''}/> nascosta</label>
                </td>
                <td>
                  ${it.custom ? '<button type="button" class="adm-btn danger small" data-action="delete">Elimina</button>' : '<span class="adm-empty">originale</span>'}
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
        <div class="adm-form-actions">
          <button type="button" class="adm-btn primary" id="adm-gallery-save">Salva modifiche galleria</button>
          <button type="button" class="adm-btn ghost" id="adm-gallery-apply">Applica al sito</button>
          <button type="button" class="adm-btn ghost" id="adm-gallery-reset">Reset tutto</button>
        </div>
      </div>
    `;

    return uploadHtml + galleryHtml;
  }

  /* Drag & drop per riordino */
  let dragSrc = null;
  function bindGalleryDnD() {
    const tbody = document.getElementById('adm-gallery-tbody');
    if (!tbody) return;
    tbody.querySelectorAll('tr').forEach(row => {
      row.addEventListener('dragstart', e => {
        dragSrc = row;
        row.classList.add('adm-dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      row.addEventListener('dragend', () => {
        row.classList.remove('adm-dragging');
        tbody.querySelectorAll('tr').forEach(r => r.classList.remove('adm-drag-over'));
      });
      row.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        row.classList.add('adm-drag-over');
      });
      row.addEventListener('dragleave', () => row.classList.remove('adm-drag-over'));
      row.addEventListener('drop', e => {
        e.preventDefault();
        if (dragSrc && dragSrc !== row) {
          const all = [...tbody.querySelectorAll('tr')];
          const srcIdx = all.indexOf(dragSrc);
          const dstIdx = all.indexOf(row);
          if (srcIdx < dstIdx) row.after(dragSrc);
          else row.before(dragSrc);
        }
      });
    });
  }

  function readGalleryForm() {
    const rows = document.querySelectorAll('#adm-gallery-tbody tr');
    const overrides = {};
    const orderByFile = {};
    rows.forEach((row, i) => {
      const file = row.dataset.file;
      const select = row.querySelector('select[data-action="cat"]');
      const checkbox = row.querySelector('input[data-action="hidden"]');
      const cat = select ? select.value : 'varie';
      const hidden = checkbox ? checkbox.checked : false;
      const isCustom = row.dataset.custom === '1';
      const realCat = (cat === 'hidden') ? (row.querySelector('select[data-action="cat"]')?.dataset.lastCat || 'varie') : cat;
      // hidden = true se cat === 'hidden' o checkbox.checked
      const finalHidden = hidden || cat === 'hidden';
      const finalCat = finalHidden ? (row.dataset.lastRealCat || 'varie') : cat;
      if (isCustom) {
        // le custom hanno id, non file
        const id = row.dataset.id;
        const custom = S.getCustomPhotos();
        const idx = custom.findIndex(c => c.id === id);
        if (idx >= 0) {
          custom[idx].cat = finalCat;
          custom[idx].hidden = finalHidden;
          orderByFile[id + '.jpg'] = 1000 + i;
        }
        S.setCustomPhotos(custom);
      } else {
        overrides[file] = { cat: finalCat, hidden: finalHidden };
        orderByFile[file] = i;
      }
    });
    /* Merge con override esistenti per non perdere order di file non in pagina */
    const existing = S.getGalleryOverrides();
    const merged = Object.assign({}, existing, overrides);
    /* Applica order anche per file non visualizzati */
    Object.keys(orderByFile).forEach(f => { merged[f] = merged[f] || {}; merged[f].order = orderByFile[f]; });
    return merged;
  }

  function bindGallery() {
    const zone = document.getElementById('adm-upload-zone');
    const input = document.getElementById('adm-upload-input');
    const pick = document.getElementById('adm-upload-pick');
    const status = document.getElementById('adm-upload-status');
    if (pick) pick.addEventListener('click', () => input.click());

    if (input) {
      input.addEventListener('change', async () => {
        await uploadFiles(input.files);
        input.value = '';
      });
    }
    if (zone) {
      zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('adm-drag-over'); });
      zone.addEventListener('dragleave', () => zone.classList.remove('adm-drag-over'));
      zone.addEventListener('drop', async e => {
        e.preventDefault();
        zone.classList.remove('adm-drag-over');
        if (e.dataTransfer.files && e.dataTransfer.files.length) {
          await uploadFiles(e.dataTransfer.files);
        }
      });
    }

    const save = document.getElementById('adm-gallery-save');
    const apply = document.getElementById('adm-gallery-apply');
    const reset = document.getElementById('adm-gallery-reset');

    if (save) save.addEventListener('click', () => {
      const map = readGalleryForm();
      S.setGalleryOverrides(map);
      toast('Modifiche galleria salvate.', 'ok');
    });
    if (apply) apply.addEventListener('click', () => {
      const map = readGalleryForm();
      S.setGalleryOverrides(map);
      document.dispatchEvent(new CustomEvent('zefiro:gallerychange', { detail: map }));
      toast('Applicate al sito live.', 'ok');
    });
    if (reset) reset.addEventListener('click', () => {
      if (!confirm('Eliminare TUTTE le personalizzazioni galleria e foto caricate?')) return;
      S.setGalleryOverrides({});
      S.setCustomPhotos([]);
      toast('Reset fatto. Ricarico...', 'ok');
      setTimeout(() => location.reload(), 600);
    });

    /* Delete custom photo */
    document.querySelectorAll('button[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tr = btn.closest('tr');
        const id = tr.dataset.id;
        if (!confirm('Eliminare questa foto dalla galleria?')) return;
        S.removeCustomPhoto(id);
        tr.remove();
        toast('Foto rimossa.', 'ok');
      });
    });

    bindGalleryDnD();
  }

  async function uploadFiles(files) {
    const status = document.getElementById('adm-upload-status');
    if (!files || !files.length) return;
    let okCount = 0;
    let failCount = 0;
    for (const file of files) {
      try {
        if (!file.type.startsWith('image/')) throw new Error('Non e\' un\'immagine');
        if (status) status.textContent = 'Carico ' + file.name + '...';
        let dataUrl = await S.fileToBase64(file);
        if (file.size > 500 * 1024) {
          dataUrl = await S.compressImage(dataUrl, 1600, 0.82);
        }
        const id = 'c_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
        S.addCustomPhoto({
          id: id,
          name: file.name,
          dataUrl: dataUrl,
          alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
          cat: 'varie',
          hidden: false,
          addedAt: Date.now(),
        });
        okCount++;
      } catch (e) {
        console.error(e);
        failCount++;
      }
    }
    if (status) {
      status.textContent = (okCount ? okCount + ' aggiunte. ' : '') + (failCount ? failCount + ' fallite.' : '');
      setTimeout(() => { status.textContent = ''; }, 3000);
    }
    /* Re-render la sezione galleria */
    const section = document.getElementById('adm-section-content');
    if (section) {
      section.innerHTML = render();
      bindContent();
      bindGallery();
    }
  }

  /* --------- toast helper --------- */
  function toast(msg, type) {
    const el = document.createElement('div');
    el.className = 'adm-toast adm-toast-' + (type || 'ok');
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.classList.add('is-visible'), 10);
    setTimeout(() => {
      el.classList.remove('is-visible');
      setTimeout(() => el.remove(), 300);
    }, 2500);
  }

  /* Esporta toast anche per altri moduli */
  global.AdminToast = toast;

  global.AdminEditor = {
    renderContent, bindContent,
    renderGallery, bindGallery,
    toast,
  };
})(window);
