const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });

  // Simula utente italiano
  const ctxIt = await browser.newContext({ viewport: { width: 375, height: 812 }, locale: 'it-IT' });
  const pIt = await ctxIt.newPage();
  await pIt.goto('http://localhost:8765/', { waitUntil: 'networkidle' });
  const langIt = await pIt.evaluate(() => window.I18N.getLang());
  await ctxIt.close();

  // Simula utente russo
  const ctxRu = await browser.newContext({ viewport: { width: 375, height: 812 }, locale: 'ru-RU' });
  const pRu = await ctxRu.newPage();
  await pRu.goto('http://localhost:8765/', { waitUntil: 'networkidle' });
  const langRu = await pRu.evaluate(() => window.I18N.getLang());
  await ctxRu.close();

  // Simula utente francese (non tra le supportate -> IT di default)
  const ctxFr = await browser.newContext({ viewport: { width: 375, height: 812 }, locale: 'fr-FR' });
  const pFr = await ctxFr.newPage();
  await pFr.goto('http://localhost:8765/', { waitUntil: 'networkidle' });
  const langFr = await pFr.evaluate(() => window.I18N.getLang());
  await ctxFr.close();

  console.log('=== Rilevamento automatico lingua browser ===');
  console.log('it-IT ->', langIt, '(atteso: it)');
  console.log('ru-RU ->', langRu, '(atteso: ru)');
  console.log('fr-FR ->', langFr, '(atteso: it fallback)');

  await browser.close();
})();
