const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const tmp = 'C:\\Users\\eli6-admin\\AppData\\Local\\Temp\\opencode';
  const pages = ['/', '/chi-sono.html', '/cos-e-lo-zefir.html', '/gusti.html', '/galleria.html', '/contatti.html'];
  const langs = ['it', 'ru', 'en'];

  const errors = [];
  const summary = [];

  for (const lang of langs) {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, locale: lang === 'it' ? 'it-IT' : lang === 'ru' ? 'ru-RU' : 'en-US' });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`[${lang}] JS: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`[${lang}] console: ${m.text()}`); });
    page.on('response', r => { if (r.status() >= 400) errors.push(`[${lang}] HTTP ${r.status()} ${r.url()}`); });

    await page.goto('https://zefiro-di-oksi.pages.dev/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(l => { localStorage.setItem('zefiro-lang', l); if (window.I18N) window.I18N.setLang(l); }, lang);

    for (const p of pages) {
      const r = await page.goto('https://zefiro-di-oksi.pages.dev' + p, { waitUntil: 'networkidle' });
      const info = await page.evaluate(() => ({
        htmlLang: document.documentElement.lang,
        navHome: document.querySelector('.bottom-nav a[aria-current="page"] span')?.textContent,
        activeLang: document.querySelector('.lang-btn.is-active')?.getAttribute('data-lang-switch'),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
      }));
      summary.push({ lang, page: p, status: r ? r.status() : 0, ...info });
    }

    const name = `live-${lang}-home.png`;
    await page.goto('https://zefiro-di-oksi.pages.dev/', { waitUntil: 'networkidle' });
    await page.screenshot({ path: `${tmp}\\${name}`, fullPage: false });
    await ctx.close();
  }

  await browser.close();

  console.log('=== Test live su Cloudflare Pages ===');
  console.log(`Pagine testate: ${summary.length}`);
  console.log(`Errori: ${errors.length}`);
  if (errors.length) {
    console.log('ERRORI:');
    errors.forEach(e => console.log(' -', e));
  } else {
    console.log('Nessun errore. Tutto funziona.');
  }
  console.log('\nSample (prime 6 entries):');
  summary.slice(0, 6).forEach(s => console.log(' ', JSON.stringify(s)));
})();
