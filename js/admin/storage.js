/* =========================================================
   Zefiro di Oksi - admin storage layer
   Namespace e helper per:
   - Auth (hash password + token persistente con scadenza)
   - Analytics (lettura/scrittura eventi)
   - Contenuti (testi modificabili dall'admin, salvati in localStorage)
   - Galleria (riordino + upload + cambio categoria)
   - Configurazione (durata sessione, lingua UI)
   - Backup / restore JSON
   ========================================================= */

(function (global) {
  'use strict';

  const NS = 'zefiro';
  const AUTH_KEY = NS + ':auth';
  const ANALYTICS_SESSION_KEY = 'zefiro-analytics:sessions';
  const ANALYTICS_EVENTS_KEY = 'zefiro-analytics:events';

  const CONTENT_DEFAULTS = {
    home: {
      tagline: 'Fiori di zefir fatti a mano, con amore.',
    },
    contact: {
      email: 'zefirodioksi@proton.me',
      subject: 'Un saluto da Zefiro di Oksi',
    },
    support: {
      title: 'Un piccolo gesto, se ti va',
      body: 'Questo hobby è nato per dare un po\' di bellezza a chi mi è vicino. Se ti fa piacere sostenermi — anche solo con un piccolo contributo, come un\'offerta in chiesa — sarò davvero felice. Posso ricambiare con un piccolo bouquet di fiori di zefir fatto a mano per te o per chi vuoi tu. Scrivimi e ne parliamo.',
      note: 'Nessun obbligo, nessuna pressione. Solo se ti fa piacere.',
    },
    about: {
      familyTitle: 'Grazie di cuore',
      familyBody: 'Grazie alla mia famiglia, che ogni giorno mi sostiene nei miei progetti creativi: col cuore, con le mani e con infinita pazienza. Senza di voi tutto questo non esisterebbe.',
    },
  };

  /* ---------- low-level helpers ---------- */
  function lsGet(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v == null ? fallback : JSON.parse(v);
    } catch (_) { return fallback; }
  }
  function lsSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('[admin/storage] localStorage quota exceeded?', e);
      return false;
    }
  }
  function lsDel(key) {
    try { localStorage.removeItem(key); return true; } catch (_) { return false; }
  }

  /* ---------- SHA-256 ---------- */
  async function sha256Hex(text) {
    const buf = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', buf);
    return [...new Uint8Array(digest)]
      .map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /* ---------- AUTH ---------- */
  // Default hash di 'zefiro2026'
  const DEFAULT_HASH = '02edb747f2956f24954b67d6b7b0542d9b69ca20ec3ba96ca6475f953d431869';

  function getStoredHash() {
    const h = lsGet(AUTH_KEY + ':hash', null);
    return h || DEFAULT_HASH;
  }
  function setStoredHash(h) { return lsSet(AUTH_KEY + ':hash', h); }

  function getSessionDays() {
    return lsGet(AUTH_KEY + ':days', 30);
  }
  function setSessionDays(d) { return lsSet(AUTH_KEY + ':days', d); }

  function getToken() {
    return lsGet(AUTH_KEY + ':token', null);
  }
  function setToken(token, expiresAt) {
    lsSet(AUTH_KEY + ':token', token);
    lsSet(AUTH_KEY + ':expires', expiresAt);
  }
  function clearToken() {
    lsDel(AUTH_KEY + ':token');
    lsDel(AUTH_KEY + ':expires');
  }

  function isAuthed() {
    const token = getToken();
    const exp = lsGet(AUTH_KEY + ':expires', 0);
    if (!token || !exp) return false;
    if (Date.now() > exp) {
      clearToken();
      return false;
    }
    return true;
  }

  async function login(password) {
    const h = await sha256Hex(password);
    if (h === getStoredHash()) {
      const days = getSessionDays();
      const exp = days > 0 ? Date.now() + days * 86400 * 1000 : Date.now() + 365 * 86400 * 1000 * 100; // "mai" ~ 100 anni
      const token = 'tok_' + Date.now() + '_' + Math.random().toString(36).slice(2, 14);
      setToken(token, exp);
      return { ok: true, expiresAt: exp };
    }
    return { ok: false, error: 'Password sbagliata' };
  }

  function logout() {
    clearToken();
  }

  async function changePassword(currentPw, newPw) {
    if (newPw.length < 6) return { ok: false, error: 'Nuova password troppo corta (min 6 caratteri)' };
    const curHash = await sha256Hex(currentPw);
    if (curHash !== getStoredHash()) return { ok: false, error: 'Password attuale sbagliata' };
    const newHash = await sha256Hex(newPw);
    setStoredHash(newHash);
    return { ok: true };
  }

  /* ---------- ANALYTICS (read-only) ---------- */
  function getSessions() { return lsGet(ANALYTICS_SESSION_KEY, []); }
  function getEvents() { return lsGet(ANALYTICS_EVENTS_KEY, []); }

  function clearAnalytics() {
    lsDel(ANALYTICS_SESSION_KEY);
    lsDel(ANALYTICS_EVENTS_KEY);
    lsDel('zefiro-analytics:lastSeen');
  }

  /* ---------- CONTENT (read/write) ---------- */
  function getContent(section) {
    const stored = lsGet(AUTH_KEY + ':content:' + section, null);
    if (stored) return Object.assign({}, CONTENT_DEFAULTS[section] || {}, stored);
    return CONTENT_DEFAULTS[section] || {};
  }
  function setContent(section, data) {
    return lsSet(AUTH_KEY + ':content:' + section, data);
  }
  function getAllContent() {
    return {
      home: getContent('home'),
      contact: getContent('contact'),
      support: getContent('support'),
      about: getContent('about'),
    };
  }

  /* ---------- GALLERY (read/write + upload) ---------- */
  // Salvataggio foto come base64 in localStorage.
  // Limite ~5MB per foto (restando nei 5-10MB di quota del browser).
  const PHOTO_MAX_BYTES = 4 * 1024 * 1024; // 4 MB

  function getGalleryOverrides() {
    // Override: { [filename]: { hidden, order, cat, deleted } }
    return lsGet(AUTH_KEY + ':gallery-overrides', {});
  }
  function setGalleryOverrides(map) {
    return lsSet(AUTH_KEY + ':gallery-overrides', map);
  }

  function getCustomPhotos() {
    // Foto nuove caricate dall'admin, salvate come base64
    return lsGet(AUTH_KEY + ':gallery-custom', []);
  }
  function setCustomPhotos(arr) {
    return lsSet(AUTH_KEY + ':gallery-custom', arr);
  }
  function addCustomPhoto(photo) {
    const list = getCustomPhotos();
    list.push(photo);
    return setCustomPhotos(list);
  }
  function removeCustomPhoto(id) {
    const list = getCustomPhotos().filter(p => p.id !== id);
    return setCustomPhotos(list);
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      if (file.size > PHOTO_MAX_BYTES) {
        reject(new Error('File troppo grande (max ' + (PHOTO_MAX_BYTES / 1024 / 1024) + ' MB)'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function compressImage(dataUrl, maxW, quality) {
    // Ridimensiona e comprimi JPEG via canvas per risparmiare spazio
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL('image/jpeg', quality || 0.82));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  /* ---------- BACKUP ---------- */
  function exportAll() {
    return {
      exportedAt: new Date().toISOString(),
      version: 1,
      hash: getStoredHash(),
      sessionDays: getSessionDays(),
      content: getAllContent(),
      galleryOverrides: getGalleryOverrides(),
      customPhotos: getCustomPhotos(),
      analytics: {
        sessions: getSessions(),
        events: getEvents(),
      },
    };
  }

  function importAll(data) {
    if (!data || typeof data !== 'object') return { ok: false, error: 'File non valido' };
    try {
      if (data.hash) setStoredHash(data.hash);
      if (data.sessionDays) setSessionDays(data.sessionDays);
      if (data.content) {
        for (const k of Object.keys(data.content)) {
          setContent(k, data.content[k]);
        }
      }
      if (data.galleryOverrides) setGalleryOverrides(data.galleryOverrides);
      if (data.customPhotos) setCustomPhotos(data.customPhotos);
      // non ripristinare analytics automaticamente: meglio dare la scelta all'utente
      return { ok: true };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  }

  function nukeEverything() {
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('zefiro:') || k.startsWith('zefiro-')) localStorage.removeItem(k);
    });
  }

  /* ---------- exports ---------- */
  global.AdminStorage = {
    sha256Hex,
    /* auth */
    login, logout, isAuthed, getStoredHash, setStoredHash,
    getSessionDays, setSessionDays, changePassword,
    /* analytics */
    getSessions, getEvents, clearAnalytics,
    /* content */
    getContent, setContent, getAllContent, CONTENT_DEFAULTS,
    /* gallery */
    getGalleryOverrides, setGalleryOverrides,
    getCustomPhotos, addCustomPhoto, removeCustomPhoto,
    fileToBase64, compressImage, PHOTO_MAX_BYTES,
    /* backup */
    exportAll, importAll, nukeEverything,
  };
})(window);
