// Genera l'hash SHA-256 di una password (per il file admin.js)
// Esegui: node scripts/hash-pw.js zefiro2026
const crypto = require('crypto');
const pw = process.argv[2];
if (!pw) { console.error('Uso: node scripts/hash-pw.js <password>'); process.exit(1); }
const hash = crypto.createHash('sha256').update(pw).digest('hex');
console.log(hash);
