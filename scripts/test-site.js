const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:8765';
const TMP = 'C:\\Users\\eli6-admin\\AppData\\Local\\Temp\\opencode';
const PAGES = ['/', '/chi-sono.html', '/cos-e-lo-zefir.html', '/gusti.html', '/galleria.html', '/contatti.html', '/404.html'];

(async () => {
  fs.mkdirSync(TMP, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const summary = [];

  for (const lang of ['it', 'ru', 'en']) {
    const ctx = await browser.newContext({
      viewport: { width: 375, height: 812 },
      locale: lang === 'it' ? 'it-IT' : lang === 'ru' ? 'ru-RU' : 'en-US',
    });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`[${lang}/mobile] JS: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`[${lang}/mobile] console: ${m.text()}`); });
    page.on('response', r => { if (r.status() >= 400) errors.push(`[${lang}/mobile] HTTP ${r.status()} ${r.url()}`); });

    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(l => { localStorage.setItem('zefiro-lang', l); if (window.I18N) window.I18N.setLang(l); }, lang);

    for (const p of PAGES) {
      const r = await page.goto(BASE + p, { waitUntil: 'networkidle' });
      const info = await page.evaluate(() => ({
        htmlLang: document.documentElement.lang,
        navActive: document.querySelector('.bottom-nav a[aria-current="page"] span')?.textContent,
        activeLang: document.querySelector('.lang-btn.is-active')?.getAttribute('data-lang-switch'),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        favicon: document.querySelector('link[rel="icon"]')?.getAttribute('href'),
        hasPetals: document.querySelectorAll('.petals .petal').length,
        hasReveal: document.querySelectorAll('.reveal').length,
        footerPos: (() => {
          const f = document.querySelector('.site-footer');
          if (!f) return null;
          const r = f.getBoundingClientRect();
          const vp = window.innerHeight;
          return { bottomFromVp: vp - r.bottom, height: Math.round(r.height) };
        })()
      }));
      summary.push({ lang, page: p, status: r ? r.status() : 0, ...info });
    }

    const name = `v4-mobile-${lang}-home.png`;
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(TMP, name), fullPage: false });

    await page.goto(BASE + '/404.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(TMP, `v4-mobile-${lang}-404.png`), fullPage: false });

    await ctx.close();
  }

  // Desktop: una passata per verificare layout 2 colonne home + sticky footer
  const ctxD = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const pageD = await ctxD.newPage();
  pageD.on('pageerror', e => errors.push(`[desktop] JS: ${e.message}`));
  await pageD.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await pageD.evaluate(() => localStorage.setItem('zefiro-lang', 'it'));
  await pageD.goto(BASE + '/', { waitUntil: 'networkidle' });
  await pageD.waitForTimeout(800);
  await pageD.screenshot({ path: path.join(TMP, 'v4-desktop-it-home.png'), fullPage: false });

  // Test sticky footer su pagina corta (chi-sono che ha molto testo vs index che ha poco)
  await pageD.goto(BASE + '/', { waitUntil: 'networkidle' });
  const footerTest = await pageD.evaluate(() => {
    const f = document.querySelector('.site-footer').getBoundingClientRect();
    const nav = document.querySelector('.bottom-nav').getBoundingClientRect();
    const vp = window.innerHeight;
    return { footerBottom: f.bottom, navTop: nav.top, vp, footerAboveNav: f.bottom <= nav.top };
  });
  console.log('Sticky footer test (desktop):', JSON.stringify(footerTest));
  await ctxD.close();

  await browser.close();

  console.log(`\n=== Test v4 ===`);
  console.log(`Pagine x lingue: ${summary.length}`);
  console.log(`Errori: ${errors.length}`);
  if (errors.length) errors.forEach(e => console.log(' -', e));
  else console.log('Nessun errore.');
  console.log('\nSample summary (prime 5):');
  summary.slice(0, 5).forEach(s => console.log(' ', JSON.stringify(s)));
})();
