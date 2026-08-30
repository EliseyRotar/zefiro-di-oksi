const fs = require('fs');
const path = require('path');
const root = 'C:/Users/eli6-admin/Documents/Zefiro_di_Oksi';
const files = ['cos-e-lo-zefir.html', 'chi-sono.html', 'contatti.html', 'galleria.html', 'gusti.html', '404.html', 'admin.html', 'conservazione.html', 'README.md'];

for (const f of files) {
  const p = path.join(root, f);
  let b = fs.readFileSync(p);
  // Rimuovi BOM UTF-8 se presente
  if (b[0] === 0xEF && b[1] === 0xBB && b[2] === 0xBF) {
    b = b.subarray(3);
  }
  // Doppio encoding: decodifica UTF-8, ottieni stringa mojibake.
  // La stringa mojibake e' il risultato di interpretare Latin-1 come UTF-8.
  // Per recuperare: prendi i BYTE della stringa UTF-8, interpretali come Latin-1
  // (cioe' ogni byte 0xC3 0x90 diventa il singolo carattere U+00D0 Latin-1),
  // e poi quei caratteri Latin-1 (= caratteri Cyrillic veri) li codifichi di nuovo in UTF-8.
  const step1 = b.toString('utf8');
  const buf = Buffer.from(step1, 'latin1');
  const step2 = buf.toString('utf8');
  fs.writeFileSync(p, step2);
  // Verifica
  const check = fs.readFileSync(p, 'utf8');
  const hasRu = check.includes('Русский');
  const hasEm = check.includes('—');
  const hasAp = check.includes("Cos'è");
  const hasMojibake = check.includes('Ð') || check.includes('â€');
  console.log(`${f}: Русский=${hasRu}, em-dash=${hasEm}, Cos'è=${hasAp}, mojibake=${hasMojibake}`);
}
