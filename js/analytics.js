/* =========================================================
   Zefiro di Oksi - analytics client-side
   Registra in localStorage:
   - sessioni di visita (data, ora, lingua, referrer, viewport)
   - pageview per ogni pagina
   - errori JS intercettati
   - click sui link interni (per capire cosa interessa)
   NESSUNA chiamata esterna: tutto resta nel browser del visitatore.
   Per accedere ai dati: admin.html con password.
   ========================================================= */

(function () {
  'use strict';

  const NS = 'zefiro-analytics';
  const MAX_EVENTS = 500;        // limite: teniamo solo gli ultimi 500 eventi
  const MAX_SESSIONS = 200;
  const SESSION_TTL_MS = 30 * 60 * 1000;  // 30 minuti

  // ============== STORAGE HELPERS ==============
  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(NS + ':' + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(NS + ':' + key, JSON.stringify(value)); }
    catch (_) {}
  }

  // ============== EVENTI ==============
  function pushEvent(event) {
    const events = load('events', []);
    events.push(Object.assign({ ts: Date.now() }, event));
    while (events.length > MAX_EVENTS) events.shift();
    save('events', events);
  }

  function getSessionId() {
    let sid = sessionStorage.getItem(NS + ':sid');
    if (!sid) {
      sid = 's_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      sessionStorage.setItem(NS + ':sid', sid);
    }
    return sid;
  }

  function isNewSession() {
    const last = load('lastSeen', 0);
    return (Date.now() - last) > SESSION_TTL_MS;
  }

  function detectLang() {
    return (navigator.language || 'unknown').slice(0, 5);
  }

  function deviceInfo() {
    const ua = navigator.userAgent || '';
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);
    const browser = (ua.match(/(Firefox|Chrome|Safari|Edge|Opera)\/[\d.]+/) || ['unknown'])[0];
    const os = (ua.match(/(Windows|Mac|Linux|Android|iOS|iPhone OS)/) || ['unknown'])[0];
    return { isMobile, browser, os, viewport: { w: window.innerWidth, h: window.innerHeight }, lang: detectLang() };
  }

  // ============== SESSION START ==============
  if (isNewSession()) {
    const sessions = load('sessions', []);
    sessions.push({
      sid: getSessionId(),
      startTs: Date.now(),
      lang: detectLang(),
      device: deviceInfo(),
      referrer: document.referrer || '(direct)',
      path: location.pathname,
      pageviews: 1
    });
    while (sessions.length > MAX_SESSIONS) sessions.shift();
    save('sessions', sessions);
    save('lastSeen', Date.now());
    pushEvent({ type: 'session_start', path: location.pathname });
  } else {
    save('lastSeen', Date.now());
    // Aggiorna pageviews della sessione corrente
    const sessions = load('sessions', []);
    const sid = getSessionId();
    const cur = sessions.find(s => s.sid === sid);
    if (cur) { cur.pageviews = (cur.pageviews || 0) + 1; cur.lastPath = location.pathname; cur.lastTs = Date.now(); save('sessions', sessions); }
  }

  // ============== PAGEVIEW ==============
  pushEvent({ type: 'pageview', path: location.pathname, lang: detectLang() });

  // ============== ERRORI JS ==============
  window.addEventListener('error', function (e) {
    pushEvent({ type: 'js_error', message: e.message, file: e.filename, line: e.lineno });
  });
  window.addEventListener('unhandledrejection', function (e) {
    pushEvent({ type: 'promise_rejection', reason: String(e.reason) });
  });

  // ============== CLICK SU LINK INTERNI ==============
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (href.startsWith('http') || href.startsWith('//')) {
      pushEvent({ type: 'outbound_click', href: href });
    } else if (href && !href.startsWith('#') && !href.startsWith('mailto:')) {
      pushEvent({ type: 'nav_click', href: href });
    }
  });

  // ============== LANGUAGE SWITCH ==============
  document.addEventListener('click', function (e) {
    const b = e.target.closest('[data-lang-switch]');
    if (!b) return;
    pushEvent({ type: 'lang_switch', lang: b.getAttribute('data-lang-switch') });
  });
})();
