/* =========================================================
   Zefiro di Oksi - SEO / Schema.org / Hreflang / Manifest
   Iniettati dinamicamente in tutte le pagine per:
   - Canonical URL (evita contenuti duplicati)
   - Hreflang IT/RU/EN (multilingua)
   - Schema.org JSON-LD (Person, WebSite, BreadcrumbList, ImageGallery)
   - Web App Manifest per installabilita' PWA
   - Theme color per la barra indirizzi del browser
   ========================================================= */

(function () {
  'use strict';

  const BASE_URL = 'https://zefiro-di-oksi.pages.dev';
  const SITE_NAME = 'Zefiro di Oksi';
  const SITE_DESC = {
    it: 'Fiori di zefir fatti a mano, con cura. Torte, decorazioni e piccoli bouquet di zefir artigianali di Oksi.',
    ru: 'Цветы из зефира ручной работы, с заботой. Торты, украшения и маленькие букеты зефира от Окси.',
    en: 'Handmade zefir flowers, with care. Cakes, decorations and small zefir bouquets by Oksi.',
  };

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function setMeta(name, content, attr) {
    if (!content) return;
    const a = attr || 'content';
    let el = document.querySelector('meta[' + name + ']');
    if (!el) {
      el = document.createElement('meta');
      document.head.appendChild(el);
    }
    el.setAttribute(name, a);
    el.setAttribute('content', content);
  }
  function setLink(rel, href, attrs) {
    if (!href) return;
    let el = document.querySelector('link[rel="' + rel + '"]');
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
    if (attrs) for (const k in attrs) el.setAttribute(k, attrs[k]);
  }
  function removeMeta(name) {
    const el = document.querySelector('meta[' + name + ']');
    if (el) el.remove();
  }

  /* Cosa siamo in base alla URL */
  function pickPage() {
    const p = window.location.pathname;
    if (/\/chi-sono\.html$/.test(p))  return 'about';
    if (/\/cos-e-lo-zefir\.html$/.test(p)) return 'zefir';
    if (/\/galleria\.html$/.test(p))  return 'gallery';
    if (/\/contatti\.html$/.test(p)) return 'contact';
    if (/\/404\.html$/.test(p))      return '404';
    return 'home';
  }

  function buildJsonLd() {
    const T = (window.I18N && window.I18N.t) || function (k) { return k; };
    const page = pickPage();
    const url = window.location.href.split('?')[0].split('#')[0];
    const lang = (window.I18N && window.I18N.getLang()) || 'it';
    const desc = SITE_DESC[lang] || SITE_DESC.it;

    /* Schema.org: WebSite (presente in tutte le pagine, aiuta Google
       a capire che il sito e' multilingua) */
    const webSite = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': BASE_URL + '/#website',
      url: BASE_URL + '/',
      name: SITE_NAME,
      description: desc,
      inLanguage: ['it', 'ru', 'en'],
      potentialAction: {
        '@type': 'SearchAction',
        target: BASE_URL + '/galleria.html?search={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    };

    /* Schema.org: Person per chi-sono */
    let person = null;
    if (page === 'about' || page === 'home') {
      person = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': BASE_URL + '/#person',
        name: 'Oksana Rotar',
        alternateName: 'Oksi',
        description: T('about.body').slice(0, 300),
        url: BASE_URL + '/chi-sono.html',
        knowsLanguage: ['it', 'ru', 'en'],
        knowsAbout: ['pastry', 'zefir floristry', 'cake decoration'],
        workLocation: {
          '@type': 'Place',
          name: 'Italia'
        }
      };
    }

    /* Schema.org: ImageGallery per galleria */
    let gallery = null;
    if (page === 'gallery') {
      const items = (window.GALLERY && window.GALLERY.ITEMS) || [];
      gallery = {
        '@context': 'https://schema.org',
        '@type': 'ImageGallery',
        '@id': BASE_URL + '/galleria.html#gallery',
        name: T('gallery.title'),
        description: T('gallery.intro'),
        image: items.filter(it => !it.hidden).slice(0, 20).map(it => ({
          '@type': 'ImageObject',
          url: BASE_URL + '/images/' + it.file,
          name: it.alt
        }))
      };
    }

    /* BreadcrumbList per ogni pagina */
    const crumbs = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: BASE_URL + '/'
        }
      ]
    };
    const pageNames = {
      about: 'Chi sono', zefir: "Cos'è lo zefir",
      gallery: 'Galleria', contact: 'Contatti', '404': '404'
    };
    if (pageNames[page]) {
      crumbs.itemListElement.push({
        '@type': 'ListItem',
        position: 2,
        name: pageNames[page],
        item: url
      });
    }

    /* Combina tutto in un array @graph */
    const graph = [webSite, crumbs];
    if (person) graph.push(person);
    if (gallery) graph.push(gallery);

    return { '@context': 'https://schema.org', '@graph': graph };
  }

  function inject() {
    const T = (window.I18N && window.I18N.t) || function (k) { return k; };
    const page = pickPage();
    const url = window.location.href.split('?')[0].split('#')[0];
    const lang = (window.I18N && window.I18N.getLang()) || 'it';
    const desc = SITE_DESC[lang] || SITE_DESC.it;

    /* Theme color per la barra indirizzi mobile */
    setMeta('name', 'theme-color', '#b8969e');

    /* Web App Manifest */
    setLink('manifest', BASE_URL + '/manifest.json');

    /* apple-touch-icon fallback (gia' presente in HTML, ma assicuriamoci) */
    setLink('apple-touch-icon', BASE_URL + '/images/favicon-rose.png');

    /* Canonical URL (solo IT: stessa pagina, senza ?lang=) */
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    /* Hreflang per SEO multilingua
       (Google li usa per servire la versione giusta in base alla lingua utente) */
    removeMeta('http-equiv="content-language"');
    [['it', url],
     ['ru', url + '?lang=ru'],
     ['en', url + '?lang=en'],
     ['x-default', url]].forEach(([l, u]) => {
      let link = document.querySelector('link[rel="alternate"][hreflang="' + l + '"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', l);
        document.head.appendChild(link);
      }
      link.setAttribute('href', u);
    });

    /* JSON-LD Schema.org */
    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(buildJsonLd(), null, 2);
  }

  ready(inject);
  /* Aggiorna quando cambia la lingua */
  document.addEventListener('zefiro:langchange', inject);
})();
