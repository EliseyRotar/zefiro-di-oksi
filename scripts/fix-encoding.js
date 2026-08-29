// Fix definitivo encoding bug: i file committati in passato sono stati
// salvati male (alcuni Latin-1 puro, altri doppiamente corrotti da
// successiva re-codifica). Questo script identifica TUTTI i casi e li
// corregge, leggendo il file dal commit e scrivendolo come UTF-8 pulito.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FILES = [
  'index.html', 'chi-sono.html', 'cos-e-lo-zefir.html',
  'gusti.html', 'galleria.html', 'contatti.html',
  'conservazione.html', '404.html', 'admin.html',
  'js/i18n.js', 'js/main.js', 'js/admin.js', 'js/analytics.js', 'js/animations.js',
  'css/style.css'
];

// Mappa completa: sequenza di byte UTF-8 (letta come carattere) → carattere Unicode corretto
// Le sequenze sono stringhe JavaScript che rappresentano i caratteri sbagliati
const REVERSE_MAP = {
  // Doppia codifica di Latin-1-via-UTF-8: Ã©, Ã¨, Ã¹ etc.
  // Questi sono caratteri 0xC3 0xA0-0xBF visti come testo, da ri-mappare
  'Ã ': 'à', 'Ã¡': 'á', 'Ã¢': 'â', 'Ã£': 'ã', 'Ã¤': 'ä', 'Ã¥': 'å',
  'Ã¦': 'æ', 'Ã§': 'ç', 'Ã¨': 'è', 'Ã©': 'é', 'Ãª': 'ê', 'Ã«': 'ë',
  'Ã¬': 'ì', 'Ã­': 'í', 'Ã®': 'î', 'Ã¯': 'ï', 'Ã°': 'ð', 'Ã±': 'ñ',
  'Ã²': 'ò', 'Ã³': 'ó', 'Ã´': 'ô', 'Ãµ': 'õ', 'Ã¶': 'ö', 'Ã·': '÷',
  'Ã¸': 'ø', 'Ã¹': 'ù', 'Ãº': 'ú', 'Ã»': 'û', 'Ã¼': 'ü', 'Ã½': 'ý',
  'Ã¾': 'þ', 'Ã¿': 'ÿ',

  // 0xC2 0xA0..0xBF → Latin-1 0xA0..0xBF
  'Â ': ' ', 'Â¡': '¡', 'Â¢': '¢', 'Â£': '£', 'Â¤': '¤', 'Â¥': '¥',
  'Â¦': '¦', 'Â§': '§', 'Â¨': '¨', 'Â©': '©', 'Âª': 'ª', 'Â«': '«',
  'Â¬': '¬', 'Â­': '­', 'Â®': '®', 'Â¯': '¯', 'Â°': '°', 'Â±': '±',
  'Â²': '²', 'Â³': '³', 'Â´': '´', 'Âµ': 'µ', 'Â¶': '¶', 'Â·': '·',
  'Â¸': '¸', 'Â¹': '¹', 'Âº': 'º', 'Â»': '»', 'Â¼': '¼', 'Â½': '½',
  'Â¾': '¾', 'Â¿': '¿',

  // Em-dash ricodificato male: â€" → —
  'â€"': '—',
  // En-dash: â€" → – (anche se raro)
  'â€"': '–',
  // Left double quote: â€œ → "
  'â€œ': '“',
  // Right double quote: â€ → "
  'â€\u009d': '”',
  // Apostrophe curvi: â€™ → ' (e varianti)
  "â€™": '’',
  'â€˜': '‘',
  // Emoji ricodificati: gli emoji sono 4 byte UTF-8
  // 🌸 (U+1F338) = F0 9F 8C B8 → letto Latin-1 → "ðŸŒ¸"
  'ðŸŒ¸': '🌸',
  // Aggiungi altri comuni
  'â€"': '—',
  'â€™': '’',
  'â€œ': '“',
  'â€\x9d': '”',
};

for (const f of FILES) {
  const filePath = path.join(__dirname, '..', f);

  // Leggo il file da HEAD (versione committata)
  let headContent;
  try {
    headContent = execSync(`git show HEAD:${f}`, { cwd: path.join(__dirname, '..'), encoding: 'utf8' });
  } catch (e) {
    console.log(`SKIP (no HEAD): ${f}`);
    continue;
  }

  // Applico il reverse map
  let fixed = headContent;
  for (const [bad, good] of Object.entries(REVERSE_MAP)) {
    fixed = fixed.split(bad).join(good);
  }

  // Se il file è cambiato, scrivilo
  if (fixed !== headContent) {
    fs.writeFileSync(filePath, fixed, 'utf8');
    console.log(`FIXED: ${f}`);
  } else {
    console.log(`OK: ${f}`);
  }
}
