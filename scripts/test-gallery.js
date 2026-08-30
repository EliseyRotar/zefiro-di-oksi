const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await ctx.newPage();

  const errors = [];
  page.on('pageerror', e => errors.push('JS: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('response', r => { if (r.status() >= 400 && !r.url().endsWith('.map')) errors.push('HTTP ' + r.status() + ' ' + r.url()); });

  const out = {};

  // 1. Home
  await page.goto('http://localhost:8765/', { waitUntil: 'networkidle' });
  out.home = await page.evaluate(() => ({
    title: document.title,
    photoExists: !!document.querySelector('.hero-image-placeholder img'),
    photoSrc: document.querySelector('.hero-image-placeholder img')?.getAttribute('src'),
  }));

  // 2. Galleria - render + filtri
  await page.goto('http://localhost:8765/galleria.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  out.gallery = await page.evaluate(() => ({
    items: document.querySelectorAll('.gallery-item').length,
    activeFilter: document.querySelector('.filter-btn.is-active')?.dataset.filter,
    countText: document.getElementById('gallery-count')?.textContent,
  }));

  // Click filtro zefir
  await page.click('.filter-btn[data-filter="zefir"]');
  await page.waitForTimeout(200);
  out.galleryZefir = await page.evaluate(() => ({
    items: document.querySelectorAll('.gallery-item').length,
    badges: [...document.querySelectorAll('.gallery-cat-badge')].map(b => b.textContent),
  }));

  // Click filtro torte
  await page.click('.filter-btn[data-filter="torte"]');
  await page.waitForTimeout(200);
  out.galleryTorte = await page.evaluate(() => ({
    items: document.querySelectorAll('.gallery-item').length,
  }));

  // Torna a tutte + apri lightbox
  await page.click('.filter-btn[data-filter="all"]');
  await page.waitForTimeout(200);
  await page.click('.gallery-item');
  await page.waitForTimeout(200);
  out.lightbox = await page.evaluate(() => ({
    visible: document.getElementById('lightbox').getAttribute('aria-hidden') === 'false',
    imgSrc: document.getElementById('lightbox-img').getAttribute('src'),
    desc: document.getElementById('lightbox-desc').textContent.slice(0, 80),
  }));

  // Chiudi lightbox
  await page.keyboard.press('Escape');
  await page.waitForTimeout(100);
  out.lightboxClosed = await page.evaluate(() => document.getElementById('lightbox').getAttribute('aria-hidden') === 'true');

  // 3. cos-e-lo-zefir
  await page.goto('http://localhost:8765/cos-e-lo-zefir.html', { waitUntil: 'networkidle' });
  out.zefir = await page.evaluate(() => ({
    title: document.title,
    h1: document.querySelector('h1')?.textContent,
    infoText: document.querySelector('[data-i18n="zefir.info"]')?.textContent.slice(0, 60),
    hasGusti: !!document.querySelector('a[href="gusti.html"]'),
  }));

  // 4. Switch lingua RU + chi-sono
  await page.goto('http://localhost:8765/', { waitUntil: 'networkidle' });
  await page.click('.lang-btn[data-lang-switch="ru"]');
  await page.waitForTimeout(200);
  await page.goto('http://localhost:8765/chi-sono.html', { waitUntil: 'networkidle' });
  out.aboutRu = await page.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent,
    bodyStart: document.querySelector('[data-i18n="about.body"]')?.textContent.slice(0, 60),
  }));

  console.log(JSON.stringify({ out, errors }, null, 2));
  await browser.close();
})();
