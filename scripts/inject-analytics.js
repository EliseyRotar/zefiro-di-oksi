const fs = require('fs');
const path = require('path');

const PAGES = ['index.html', 'chi-sono.html', 'cos-e-lo-zefir.html', 'gusti.html', 'galleria.html', 'contatti.html', '404.html'];
const INSERT = '  <script src="js/analytics.js"></script>\n  <script src="js/main.js">';
const MATCH  = '  <script src="js/main.js">';

for (const p of PAGES) {
  const file = path.join(__dirname, '..', p);
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('js/analytics.js')) {
    console.log('Already has analytics: ' + p);
    continue;
  }
  if (!content.includes(MATCH)) {
    console.log('SKIP (no main.js found): ' + p);
    continue;
  }
  const newContent = content.replace(MATCH, INSERT);
  fs.writeFileSync(file, newContent, 'utf8');
  console.log('Updated: ' + p);
}
