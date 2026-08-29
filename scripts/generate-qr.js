// Genera il QR code SVG di Zefiro di Oksi con palette del brand
// e overlay della rosa del logo (rose.png) al centro
// (livello di error correction H = 30%).

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const URL = 'https://zefiro-di-oksi.pages.dev';
const OUT = path.join(__dirname, '..', 'images', 'qr-zefiro-di-oksi.svg');
const ROSE_PATH = path.join(__dirname, '..', 'images', 'rose.png');

// Palette brand (vedi css/style.css :root)
const DARK    = '#4a3a36';   // marrone caldo (testo)
const LIGHT   = '#fbf3ec';   // beige chiaro (sfondo sito)
const FRAME   = '#f6e8d8';   // beige cornice
const STROKE  = '#ecd9c2';   // bordo cornice

(async () => {
  // Genera il QR come stringa SVG con palette brand
  const svgString = await QRCode.toString(URL, {
    type: 'svg',
    errorCorrectionLevel: 'H',  // 30%: tollera overlay centrale
    margin: 2,
    color: {
      dark:  DARK,
      light: LIGHT,
    },
    width: 512,
  });

  // Estrai i moduli per ridisegnare l'SVG con piu' controllo
  const data = QRCode.create(URL, { errorCorrectionLevel: 'H' });
  const size = data.modules.size;
  const dataModules = data.modules.data;

  // Costanti layout
  const FRAME_PAD = 28;
  const LABEL_H   = 56;
  const TOTAL     = 512;
  const QR_SIZE   = TOTAL - (FRAME_PAD * 2);
  const cellSize  = QR_SIZE / size;
  const qrOffset  = FRAME_PAD;

  let cells = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (dataModules[r * size + c]) {
        const x = qrOffset + c * cellSize;
        const y = qrOffset + r * cellSize;
        cells += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${cellSize.toFixed(2)}" height="${cellSize.toFixed(2)}" />`;
      }
    }
  }

  // Rosa del logo: 711x351 px (rapporto ~2:1).
  // La facciamo larga per riempire il bouquet orizzontalmente.
  // Il disco di sfondo e' un cerchio che contiene la parte "petali"
  // (non lo stelo, che sporge in basso).
  const roseImg = fs.readFileSync(ROSE_PATH);
  const roseBase64 = roseImg.toString('base64');

  // Dimensioni della rosa nel QR:
  // - larghezza: 60% del QR (piu' larga possibile, dato che e' stesa orizzontalmente)
  // - altezza: derivata dal rapporto originale
  const roseW = QR_SIZE * 0.60;
  const roseH = roseW * (351 / 711);
  // Posizione: centrata rispetto al QR. La offset Y la sposta leggermente
  // in alto cosi' il centro visivo (i petali) coincide con il centro del QR,
  // mentre lo stelo scende verso il basso
  const roseX = (TOTAL - roseW) / 2;
  const roseY = (TOTAL - roseH) / 2 - QR_SIZE * 0.04;

  // Disco di sfondo: cerchio che contiene la parte "petali" della rosa.
  // La rosa e' larga roseW; il bouquet (parte alta) occupa circa meta' larghezza.
  // Il cerchio di sfondo copre il bouquet senza sconfinare nello stelo.
  const discR = roseW * 0.30;  // raggio disco
  const discCx = TOTAL / 2;
  const discCy = TOTAL / 2 - QR_SIZE * 0.06;  // spostato in alto per allinearsi al bouquet
  const discStrokeW = 2.5;

  const roseSvg = `
    <!-- disco chiaro di sfondo per staccare la rosa dal QR -->
    <circle cx="${discCx}" cy="${discCy}" r="${discR}"
            fill="${LIGHT}" stroke="${DARK}" stroke-width="${discStrokeW}"/>

    <!-- rosa embeddata (PNG con trasparenza) -->
    <image href="rose.png" xlink:href="rose.png"
           x="${roseX.toFixed(2)}" y="${roseY.toFixed(2)}"
           width="${roseW.toFixed(2)}" height="${roseH.toFixed(2)}"
           preserveAspectRatio="xMidYMid meet"/>
  `;

  const finalSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${TOTAL} ${TOTAL + LABEL_H}" width="${TOTAL}" height="${TOTAL + LABEL_H}" role="img" aria-label="QR code del sito Zefiro di Oksi">
  <title>Zefiro di Oksi - QR code</title>
  <desc>QR code che porta a ${URL}. Scansiona con la fotocamera del telefono per aprire il sito.</desc>

  <!-- sfondo esterno beige chiaro -->
  <rect width="100%" height="100%" fill="${LIGHT}"/>

  <!-- cornice arrotondata beige -->
  <rect x="6" y="6" width="${TOTAL-12}" height="${TOTAL-12}" rx="22" ry="22"
        fill="${FRAME}" stroke="${STROKE}" stroke-width="2"/>

  <!-- QR modules (marrone caldo su beige chiaro) -->
  <g fill="${DARK}">${cells}</g>

  <!-- rosa del logo al centro -->
  ${roseSvg}

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
  console.log(`Rosa embeddata: ${roseW.toFixed(0)}x${roseH.toFixed(0)} px (60% larghezza QR)`);
})().catch(e => { console.error(e); process.exit(1); });
