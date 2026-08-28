const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await ctx.newPage();

  // Test 1: lingua iniziale
  await page.goto('http://localhost:8765/', { waitUntil: 'networkidle' });
  const initialLang = await page.evaluate(() => window.I18N.getLang());

  // Test 2: click su RU
  await page.click('.lang-btn[data-lang-switch="ru"]');
  await page.waitForTimeout(200);
  const afterRu = await page.evaluate(() => ({
    lang: window.I18N.getLang(),
    ls: localStorage.getItem('zefiro-lang'),
    title: document.title,
    navHome: document.querySelector('.bottom-nav a[aria-current="page"] span')?.textContent,
    welcome: document.querySelector('.hero-welcome')?.textContent?.slice(0, 50)
  }));

  // Test 3: click su EN
  await page.click('.lang-btn[data-lang-switch="en"]');
  await page.waitForTimeout(200);
  const afterEn = await page.evaluate(() => ({
    lang: window.I18N.getLang(),
    ls: localStorage.getItem('zefiro-lang'),
    title: document.title,
    navHome: document.querySelector('.bottom-nav a[aria-current="page"] span')?.textContent,
    welcome: document.querySelector('.hero-welcome')?.textContent?.slice(0, 50)
  }));

  // Test 4: mailto su contatti
  await page.goto('http://localhost:8765/contatti.html', { waitUntil: 'networkidle' });
  const mailto = await page.locator('.contact-email').getAttribute('href');

  // Test 5: persistenza su nuova pagina
  await page.goto('http://localhost:8765/chi-sono.html', { waitUntil: 'networkidle' });
  const persisted = await page.evaluate(() => ({
    lang: window.I18N.getLang(),
    title: document.title,
    familyText: document.querySelector('[data-i18n="about.family"]')?.textContent?.slice(0, 50)
  }));

  // Test 6: reset localStorage e ricarica -> deve andare a IT (default)
  await page.evaluate(() => localStorage.clear());
  await page.goto('http://localhost:8765/', { waitUntil: 'networkidle' });
  const afterClear = await page.evaluate(() => window.I18N.getLang());

  console.log('=== Test interattivita i18n ===');
  console.log('1. Lingua iniziale (vuoto):', initialLang);
  console.log('2. Dopo click RU:', JSON.stringify(afterRu, null, 2));
  console.log('3. Dopo click EN:', JSON.stringify(afterEn, null, 2));
  console.log('4. Mailto:', mailto);
  console.log('5. Persistenza su chi-sono:', JSON.stringify(persisted, null, 2));
  console.log('6. Dopo localStorage.clear():', afterClear);

  await browser.close();
})();
