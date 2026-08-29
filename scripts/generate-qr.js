// Genera il QR code SVG di Zefiro di Oksi con palette del brand
// e overlay di una rosa classica vista dall'alto al centro
// (livello di error correction H = 30%).

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const URL = 'https://zefiro-di-oksi.pages.dev';
const OUT = path.join(__dirname, '..', 'images', 'qr-zefiro-di-oksi.svg');

// Palette brand (vedi css/style.css :root)
const DARK    = '#4a3a36';   // marrone caldo (testo)
const LIGHT   = '#fbf3ec';   // beige chiaro (sfondo sito)
const ACCENT  = '#e8b4c4';   // rosa cipria
const ACCENT_DARK = '#c98ea1'; // rosa cipria piu' carico
const ACCENT_LIGHT = '#f3d2dd'; // rosa cipria chiaro
const FRAME   = '#f6e8d8';   // beige cornice
const STROKE  = '#ecd9c2';   // bordo cornice
const LEAF    = '#94a87e';   // verde foglia
const LEAF_DARK = '#7a8c5b'; // verde stelo

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

  // Rosa classica vista dall'alto al centro.
  // 3 anelli concentrici di petali + bocciolo centrale.
  const flowerSize = QR_SIZE * 0.26;   // 26% del QR: la rosa e' il "soggetto"
  const flowerOffset = (TOTAL - flowerSize) / 2;
  const cx = flowerSize / 2;
  const cy = flowerSize / 2;
  // Scala per le unita' interne del disegno (raggio base ~30 unita')
  const u = flowerSize / 64;

  const rose = `<g transform="translate(${flowerOffset.toFixed(2)} ${flowerOffset.toFixed(2)})">
    <!-- disco chiaro di sfondo per staccare la rosa dal QR -->
    <circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${(flowerSize/2 - 1).toFixed(2)}"
            fill="${LIGHT}" stroke="${ACCENT_DARK}" stroke-width="${(2*u).toFixed(2)}"/>

    <g transform="translate(${cx.toFixed(2)} ${cy.toFixed(2)}) scale(${u.toFixed(4)})">
      <!-- ANELLO ESTERNO: 6 petali rotondi, molto schiacciati (rosa vista dall'alto) -->
      <g fill="${ACCENT}" stroke="${ACCENT_DARK}" stroke-width="0.5" stroke-linejoin="round">
        ${(() => {
          let out = '';
          for (let i = 0; i < 6; i++) {
            const rot = i * 60;
            // petalo ovale largo e schiacciato (ellisse orizzontale)
            out += `<ellipse cx="0" cy="-20" rx="14" ry="11" transform="rotate(${rot})"/>`;
          }
          return out;
        })()}
      </g>

      <!-- ANELLO INTERMEDIO: 5 petali piu' scuri, intercalati (offset 30 gradi) -->
      <g fill="${ACCENT_DARK}" stroke="${ACCENT_DARK}" stroke-width="0.5" stroke-linejoin="round">
        ${(() => {
          let out = '';
          for (let i = 0; i < 5; i++) {
            const rot = i * 72 + 30;
            out += `<ellipse cx="0" cy="-13" rx="10" ry="8" transform="rotate(${rot})"/>`;
          }
          return out;
        })()}
      </g>

      <!-- ANELLO INTERNO: 4 petali piccoli chiari, intercalati ancora (offset 45) -->
      <g fill="${ACCENT_LIGHT}" stroke="${ACCENT_DARK}" stroke-width="0.4" stroke-linejoin="round">
        ${(() => {
          let out = '';
          for (let i = 0; i < 4; i++) {
            const rot = i * 90 + 45;
            out += `<ellipse cx="0" cy="-7" rx="6" ry="5" transform="rotate(${rot})"/>`;
          }
          return out;
        })()}
      </g>

      <!-- BOCCIOLO CENTRALE: piccolo cerchio + cuoricino stilizzato -->
      <circle cx="0" cy="0" r="4" fill="${ACCENT_DARK}"/>
      <path d="M -1.4,-1.4 C -1.4,-2.2 -0.5,-2.6 0,-2 C 0.5,-2.6 1.4,-2.2 1.4,-1.4 C 1.4,-0.4 0,0.6 0,0.6 C 0,0.6 -1.4,-0.4 -1.4,-1.4 Z"
            fill="${ACCENT_LIGHT}" stroke="none"/>

      <!-- FOGLIOLINE sotto la rosa, sporgenti dal disco di sfondo -->
      <g transform="translate(-20 20) rotate(-30)">
        <path d="M 0,0 C -3,-2 -6,0 -8,4 C -10,8 -8,11 -4,11 C 0,11 4,9 6,5 C 8,1 5,-2 0,0 Z"
              fill="${LEAF}" stroke="${LEAF_DARK}" stroke-width="0.4"/>
        <line x1="-6" y1="6" x2="2" y2="2" stroke="${LEAF_DARK}" stroke-width="0.4"/>
      </g>
      <g transform="translate(20 20) rotate(30)">
        <path d="M 0,0 C 3,-2 6,0 8,4 C 10,8 8,11 4,11 C 0,11 -4,9 -6,5 C -8,1 -5,-2 0,0 Z"
              fill="${LEAF}" stroke="${LEAF_DARK}" stroke-width="0.4"/>
        <line x1="6" y1="6" x2="-2" y2="2" stroke="${LEAF_DARK}" stroke-width="0.4"/>
      </g>
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

  <!-- rosa classica al centro -->
  ${rose}

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
