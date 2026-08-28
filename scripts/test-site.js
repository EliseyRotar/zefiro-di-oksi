// Test completo del sito v3: tutte le pagine nelle 3 lingue, mobile + desktop.
// Salva screenshot in /tmp per ispezione manuale.

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:8765';
const TMP = 'C:\\Users\\eli6-admin\\AppData\\Local\\Temp\\opencode';
const PAGES = ['/', '/chi-sono.html', '/cos-e-lo-zefir.html', '/gusti.html', '/galleria.html', '/contatti.html'];

async function run() {
  fs.mkdirSync(TMP, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const summary = [];

  // Test mobile 375 + desktop 1280, in IT e EN (RU verificato a campione)
  const viewports = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'desktop', width: 1280, height: 800 },
  ];
  const langs = ['it', 'ru', 'en'];

  for (const vp of viewports) {
    for (const lang of langs) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        locale: lang === 'it' ? 'it-IT' : lang === 'ru' ? 'ru-RU' : 'en-US',
      });
      const page = await context.newPage();

      page.on('pageerror', e => errors.push(`[${vp.name}/${lang}] JS: ${e.message}`));
      page.on('console', m => { if (m.type() === 'error') errors.push(`[${vp.name}/${lang}] console: ${m.text()}`); });
      page.on('response', r => { if (r.status() >= 400) errors.push(`[${vp.name}/${lang}] HTTP ${r.status()} ${r.url()}`); });

      // Prima pagina: imposta lingua esplicita via localStorage
      await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
      await page.evaluate((l) => localStorage.setItem('zefiro-lang', l), lang);
      await page.evaluate((l) => { if (window.I18N) window.I18N.setLang(l); }, lang);

      for (const p of PAGES) {
        const url = BASE + p;
        const resp = await page.goto(url, { waitUntil: 'networkidle' });
        const status = resp ? resp.status() : 0;

        const info = await page.evaluate(() => {
          const active = document.querySelector('.lang-btn.is-active')?.getAttribute('data-lang-switch');
          const title = document.title;
          const navActive = document.querySelector('.bottom-nav a[aria-current="page"] span')?.textContent?.trim();
          const heroWelcome = document.querySelector('.hero-welcome')?.textContent?.trim();
          const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;
          const bottomNavVisible = !!document.querySelector('.bottom-nav');
          const navH = document.querySelector('.bottom-nav')?.getBoundingClientRect().height;
          return { active, title, navActive, heroWelcome, overflow, bottomNavVisible, navH };
        });

        const slug = p === '/' ? 'home' : p.replace(/\//g, '').replace('.html', '');
        const fname = `v3-${vp.name}-${lang}-${slug}.png`;
        await page.screenshot({ path: path.join(TMP, fname), fullPage: true });

        summary.push({ vp: vp.name, lang, page: p, status, ...info });
      }
      await context.close();
    }
  }

  await browser.close();

  // Scrivi summary su file
  fs.writeFileSync(path.join(TMP, 'v3-summary.json'), JSON.stringify({ summary, errors }, null, 2));
  console.log(`Test completato. ${summary.length} pagine visitate.`);
  if (errors.length) {
    console.log('ERRORI:');
    errors.forEach(e => console.log(' -', e));
  } else {
    console.log('Nessun errore.');
  }
}

run().catch(e => { console.error(e); process.exit(1); });
