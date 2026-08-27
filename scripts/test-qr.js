// Test di scansione: verifica che il QR custom si decodifichi correttamente
// anche con l'overlay floreale al centro.

const jsQR = require('jsqr');
const { PNG } = require('pngjs');
const fs = require('fs');
const path = require('path');

const FILES = [
  path.join(__dirname, '..', 'images', 'qr-zefiro-di-oksi-512.png'),
  path.join(__dirname, '..', 'images', 'qr-zefiro-di-oksi-2048.png'),
];

const EXPECTED = 'https://zefiro-di-oksi.pages.dev';

for (const file of FILES) {
  const buf = fs.readFileSync(file);
  const png = PNG.sync.read(buf);
  const result = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);

  const name = path.basename(file);
  if (result) {
    const ok = result.data === EXPECTED;
    console.log(`[${ok ? 'OK' : 'FAIL'}] ${name} (${png.width}x${png.height}) -> "${result.data}"`);
    if (!ok) process.exit(1);
  } else {
    console.log(`[FAIL] ${name} (${png.width}x${png.height}) -> QR non decodificato`);
    process.exit(1);
  }
}

console.log('\nTutti i QR sono leggibili e puntano all\'URL corretto.');
