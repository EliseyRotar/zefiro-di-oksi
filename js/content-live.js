/* =========================================================
   Zefiro di Oksi - content live update
   Carica da localStorage i content overrides impostati dall'admin
   e applica runtime via data-content="<section>.<key>".
   Ascolta l'evento 'zefiro:contentchange' per aggiornamenti live.
   ========================================================= */

(function () {
  'use strict';

  const STORAGE_KEY = 'zefiro:auth:content:';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function loadOverrides() {
    const all = {};
    ['home', 'contact', 'support', 'about'].forEach(section => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY + section);
        if (raw) all[section] = JSON.parse(raw);
      } catch (_) {}
    });
    return all;
  }

  function applyOverrides(overrides) {
    if (!overrides || !Object.keys(overrides).length) return;
    document.querySelectorAll('[data-content]').forEach(el => {
      const path = el.dataset.content;
      const [section, key] = path.split('.');
      if (overrides[section] && overrides[section][key] != null) {
        if (el.tagName === 'A' && el.hasAttribute('data-content-href')) {
          el.setAttribute('href', overrides[section][key]);
        } else {
          el.textContent = overrides[section][key];
          /* Se il campo support.note e' vuoto, nascondi il paragrafo */
          if (path === 'support.note' && overrides[section][key] === '') {
            el.hidden = true;
          }
        }
      }
    });
  }

  function injectDataContentAttrs() {
    /* Aggiunge data-content="<section>.<key>" agli elementi giusti
       cosi' applyOverrides puo' trovarli. Solo se non esistono gia'. */
    const set = (selector, attr) => {
      document.querySelectorAll(selector).forEach(el => {
        if (!el.dataset.content) el.setAttribute('data-content', attr);
      });
    };
    /* home.tagline: tagline nella home */
    const tagline = document.querySelector('.hero-tagline');
    if (tagline && !tagline.dataset.content) tagline.dataset.content = 'home.tagline';

    /* contact.email + contact.subject: gestiti a parte sotto */
    const emailLink = document.querySelector('.contact-email[href^="mailto:"]');
    if (emailLink && !emailLink.dataset.content) emailLink.dataset.content = 'contact.email';

    /* support.title, support.body, support.note */
    const supportTitle = document.querySelector('.support-title');
    if (supportTitle && !supportTitle.dataset.content) supportTitle.dataset.content = 'support.title';
    const supportBody = document.querySelector('.support-body');
    if (supportBody && !supportBody.dataset.content) supportBody.dataset.content = 'support.body';
    const supportNote = document.querySelector('.support-note');
    if (supportNote && !supportNote.dataset.content) supportNote.dataset.content = 'support.note';

    /* about.family.title + about.family.body */
    const familyTitle = document.querySelector('.about-family-title');
    if (familyTitle && !familyTitle.dataset.content) familyTitle.dataset.content = 'about.familyTitle';
    const familyBody = document.querySelector('.about-family-body');
    if (familyBody && !familyBody.dataset.content) familyBody.dataset.content = 'about.familyBody';
  }

  ready(() => {
    injectDataContentAttrs();
    applyOverrides(loadOverrides());

    /* Quando l'admin cambia contenuti, aggiorna in tempo reale */
    document.addEventListener('zefiro:contentchange', function (e) {
      applyOverrides(e.detail || loadOverrides());
    });
  });
})();
