/* =========================================================
   Zefiro di Oksi - Open Graph / Twitter Card meta tags
   Iniettati dinamicamente in tutte le pagine per il preview
   della condivisione (WhatsApp, Facebook, Twitter, Telegram,
   LinkedIn, ecc.) e per le anteprime dei browser.
   - og:image punta a images/photo-homepage.jpg (foto di Oksi)
   - Tutti i testi sono localizzati in IT/RU/EN via i18n
   ========================================================= */

(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  /* Determina la chiave i18n del titolo/descrizione in base alla pagina */
  function pickMeta() {
    const path = window.location.pathname;
    let titleKey = 'meta.home.title';
    let descKey = 'meta.home.desc';
    if (/\/chi-sono\.html$/.test(path)) {
      titleKey = 'meta.about.title'; descKey = 'meta.about.desc';
    } else if (/\/cos-e-lo-zefir\.html$/.test(path)) {
      titleKey = 'meta.zefir.title'; descKey = 'meta.zefir.desc';
    } else if (/\/galleria\.html$/.test(path)) {
      titleKey = 'meta.gallery.title'; descKey = 'meta.gallery.desc';
    } else if (/\/contatti\.html$/.test(path)) {
      titleKey = 'meta.contact.title'; descKey = 'meta.contact.desc';
    }
    return { titleKey, descKey };
  }

  function setMeta(prefix, key, content) {
    if (!content) return;
    const fullKey = prefix + ':' + key; // es: 'property:og:image'
    let el = document.querySelector('meta[' + prefix + '="' + key + '"]');
    if (!el) {
      el = document.createElement('meta');
      document.head.appendChild(el);
    }
    el.setAttribute(prefix, key);
    el.setAttribute('content', content);
  }

  function inject() {
    const T = (window.I18N && window.I18N.t) || function (k) { return k; };
    const { titleKey, descKey } = pickMeta();

    const title = T(titleKey);
    const desc  = T(descKey);
    const url   = window.location.href;
    const ogImg = new URL('images/photo-homepage.jpg', window.location.href).toString();

    /* Open Graph */
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:image', ogImg);
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '1500');
    setMeta('property', 'og:image:alt', T('home.image_alt'));
    setMeta('property', 'og:locale', 'it_IT');
    setMeta('property', 'og:site_name', 'Zefiro di Oksi');

    /* Twitter Card */
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', ogImg);
    setMeta('name', 'twitter:image:alt', T('home.image_alt'));
  }

  ready(inject);

  /* Quando cambia lingua, aggiorna anche i meta */
  document.addEventListener('zefiro:langchange', inject);
})();
