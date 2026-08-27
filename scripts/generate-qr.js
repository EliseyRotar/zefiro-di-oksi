// Genera il QR code SVG di Zefiro di Oksi con palette del brand
// e overlay del fiorellino centrale (livello di error correction H = 30%)

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const URL = 'https://zefiro-di-oksi.pages.dev';
const OUT = path.join(__dirname, '..', 'images', 'qr-zefiro-di-oksi.svg');

// Palette brand (vedi css/style.css :root)
const DARK   = '#4a3a36';   // marrone caldo (testo)
const LIGHT  = '#fbf3ec';   // beige chiaro (sfondo sito)
const ACCENT = '#e8b4c4';   // rosa cipria
const FRAME  = '#f6e8d8';   // beige cornice
const STROKE = '#ecd9c2';   // bordo cornice

(async () => {
  // Genera il QR come stringa SVG con palette brand
  const svgString = await QRCode.toString(URL, {
    type: 'svg',
    errorCorrectionLevel: 'H',  // 30%: tollera overlay centrale
    margin: 2,                  // quiet zone (moduli bianchi attorno)
    color: {
      dark:  DARK,
      light: LIGHT,
    },
    width: 512,                 // pixel: alta risoluzione per stampa
  });

  // Leggo l'SVG generato per estrarre i moduli e wrappare con cornice + logo
  // QRCode.toString produce un <svg><path d="..."/></svg>: uso un pattern piu'
  // strutturato con <rect> per ogni modulo, cosi' posso controllare meglio.
  const data = QRCode.create(URL, { errorCorrectionLevel: 'H' });
  const size = data.modules.size;
  const dataModules = data.modules.data;

  // Costruisco l'SVG completo a mano:
  // - viewBox quadrato che include la cornice
  // - rettangolo di sfondo beige chiaro
  // - rettangolo di sfondo cornice beige (un po' piu' scuro)
  // - tanti piccoli rettangoli marroni per i moduli dark del QR
  // - overlay: fiorellino SVG al centro (copre alcuni moduli, ma il livello H li tollera)
  // - testo "Zefiro di Oksi" sotto il QR

  const FRAME_PAD = 28;   // padding attorno al QR
  const LABEL_H   = 56;   // spazio per il nome sotto
  const TOTAL     = 512;
  const QR_SIZE   = TOTAL - (FRAME_PAD * 2);
  const cellSize  = QR_SIZE / size;
  const qrOffset  = FRAME_PAD;

  let cells = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (dataModules[r * size + c]) {
        // modulo dark (marrone)
        const x = qrOffset + c * cellSize;
        const y = qrOffset + r * cellSize;
        cells += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${cellSize.toFixed(2)}" height="${cellSize.toFixed(2)}" />`;
      }
    }
  }

  // Fiorellino centrale: riuso il favicon.svg del sito, scalato e centrato
  const flowerSize = QR_SIZE * 0.22;  // 22% del QR: piccolo ma visibile
  const flowerOffset = (TOTAL - flowerSize) / 2;
  const flower = `<g transform="translate(${flowerOffset.toFixed(2)} ${flowerOffset.toFixed(2)})">
    <!-- disco bianco di sfondo per staccare il fiore dal QR -->
    <circle cx="${(flowerSize/2).toFixed(2)}" cy="${(flowerSize/2).toFixed(2)}" r="${(flowerSize/2).toFixed(2)}" fill="${LIGHT}" stroke="${ACCENT}" stroke-width="2"/>
    <g transform="translate(${(flowerSize/2).toFixed(2)} ${(flowerSize/2).toFixed(2)}) scale(${(flowerSize/64).toFixed(4)})">
      <g fill="${ACCENT}" stroke="#c98ea1" stroke-width="0.6">
        <path d="M0,-12 C-7,-14 -14,-9 -14,-2 C-14,6 -7,12 0,12 C7,12 14,6 14,-2 C14,-9 7,-14 0,-12 Z"/>
        <path d="M0,-8 C-4,-9 -8,-6 -8,-2 C-8,3 -4,7 0,7 C4,7 8,3 8,-2 C8,-6 4,-9 0,-8 Z" fill="#f3d2dd"/>
        <path d="M0,-4 C-2,-5 -4,-3 -4,-1 C-4,2 -2,4 0,4 C2,4 4,2 4,-1 C4,-3 2,-5 0,-4 Z" fill="${LIGHT}"/>
      </g>
      <line x1="0" y1="12" x2="0" y2="32" stroke="#7a8c5b" stroke-width="1.5"/>
      <path d="M0,20 C-6,18 -8,22 -6,26 C-2,24 0,22 0,20 Z" fill="#94a87e" stroke="#7a8c5b" stroke-width="0.5"/>
    </g>
  </g>`;

  const finalSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TOTAL} ${TOTAL + LABEL_H}" width="${TOTAL}" height="${TOTAL + LABEL_H}" role="img" aria-label="QR code del sito Zefiro di Oksi">
  <title>Zefiro di Oksi - QR code</title>
  <desc>QR code che porta a ${URL}. Scansiona con la fotocamera del telefono per aprire il sito.</desc>

  <!-- sfondo esterno beige chiaro -->
  <rect width="100%" height="100%" fill="${LIGHT}"/>

  <!-- cornice arrotondata beige -->
  <rect x="6" y="6" width="${TOTAL-12}" height="${TOTAL-12}" rx="22" ry="22"
        fill="${FRAME}" stroke="${STROKE}" stroke-width="2"/>

  <!-- QR modules (marrone caldo su beige chiaro) -->
  <g fill="${DARK}">${cells}</g>

  <!-- fiorellino centrale -->
  ${flower}

  <!-- nome brand sotto -->
  <g font-family="'Cormorant Garamond', Georgia, serif" text-anchor="middle">
    <text x="${TOTAL/2}" y="${TOTAL + 32}" font-size="26" font-weight="600" fill="${DARK}" letter-spacing="0.5">Zefiro di Oksi</text>
    <text x="${TOTAL/2}" y="${TOTAL + 50}" font-size="11" font-style="italic" fill="#7a6157" letter-spacing="1.5">fiori di zefir fatti a mano</text>
  </g>
</svg>
`;

  fs.writeFileSync(OUT, finalSvg, 'utf8');
  console.log(`OK: ${OUT}`);
  console.log(`QR ${size}x${size} moduli, livello H, URL: ${URL}`);
})().catch(e => { console.error(e); process.exit(1); });
