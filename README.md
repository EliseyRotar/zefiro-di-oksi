# Zefiro di Oksi

> *Fiori di zefir fatti a mano, con amore, gusto dopo gusto.*

Un piccolo progetto di fioristica di zefir — un dolce sofficissimo, fatto con
pura frutta, albumina e agar-agar, modellato a mano in piccoli bouquet da
ammirare e poi gustare. Non un marshmallow.

Questo repository contiene il sito vetrina del progetto: sette pagine statiche
in italiano (più russo e inglese), pensate per essere raggiunte principalmente
tramite QR code stampato su un'etichetta e scansionate da smartphone.

---

## Il progetto

Zefiro di Oksi è un hobby, non un business. Oksana — Oksi per gli amici —
scopre la fioristica di zefir frequentando una scuola dedicata, e comincia
a mettere in pratica ciò che impara creando piccole composizioni per chi le vuole
assaggiare.

Ogni fiore nasce da purea di frutta fatta in casa, con albumina e agar-agar
al posto della gelatina: niente conservanti, lattosio o glutine, adatto anche a
chi è vegetariano. I gusti spaziano dalla mela al ribes nero, dalla pesca a un
mirtillo selvatico un po' aspro, con pera, melone e mango in arrivo.

In ogni cestino i fiori sono di gusti diversi, così ogni composizione è anche
una piccola sorpresa da scoprire.

---

## Il sito

Cinque pagine pubbliche + una pagina admin protetta, multilingua IT/RU/EN.

### Pagine pubbliche

| Pagina                | Cosa contiene                                                                 |
| --------------------- | ----------------------------------------------------------------------------- |
| `index.html`          | Home con foto reale di Oksi, logo, tagline, petali animati                    |
| `chi-sono.html`       | Chi è Oksi, come è nato il progetto, bio completa                            |
| `cos-e-lo-zefir.html` | 3 sezioni: cos'è lo zefir, romantic block, idea regalo + box Conservazione   |
| `galleria.html`       | Griglia filtrabile di 60+ foto delle creazioni, lightbox accessibile         |
| `contatti.html`       | Solo testo + mailto cliccabile, niente CTA aggressive                         |
| `404.html`            | Pagina non trovata multilingua (servita da Cloudflare Pages)                 |

### Admin

| Pagina       | Accesso                  | Cosa fa                                      |
| ------------ | ------------------------ | -------------------------------------------- |
| `admin.html` | Password (default `zefiro2026`) | Dashboard analytics con sessioni, lingue, browser, pageview, errori JS |

### Caratteristiche

- **Multilingua** IT/RU/EN: rilevamento automatico della lingua del browser
  (con fallback inglese per lingue non in lista), persistenza in localStorage,
  switch a 3 bandierine sempre visibile
- **Mobile-first**: progettato per essere aperto da uno smartphone dopo una
  scansione QR. Bottoni grandi (60×60 px), testo leggibile senza zoom
- **Tipografia calda**: serif elegante per i titoli (`Cormorant Garamond`),
  sans morbido per il testo (`Nunito`)
- **Palette artigianale**: rosa polveroso, pesca morbido, beige crema
- **Bottom navigation** fissa: 6 voci con icone SVG + label, sempre visibile
- **Header sticky** in alto + **footer sticky** in fondo (anche su pagine corte)
- **Animazioni home**: petali rosa che cadono in loop lento + reveal progressivo
  al load (rispetta `prefers-reduced-motion`)
- **Analytics privacy-first**: tutto client-side in localStorage, niente cookie,
  niente server, niente GDPR
- **404 personalizzata** multilingua

### Stack

HTML, CSS e JavaScript vanilla. Nessuna dipendenza, nessun build, nessun
framework. Il sito gira ovunque: si apre con un doppio click su `index.html`,
si carica in pochi secondi su Cloudflare Pages.

```
Zefiro_di_Oksi/
├── index.html, chi-sono.html, cos-e-lo-zefir.html,
│   galleria.html, contatti.html, 404.html, admin.html
├── css/
│   └── style.css
├── js/
│   ├── i18n.js          dizionario IT/RU/EN + auto-detect + localStorage
│   ├── main.js          click handler per lo switch lingua
│   ├── animations.js    reveal progressivo con IntersectionObserver
│   ├── gallery-data.js  catalogo immagini galleria (categoria + descrizioni IT/RU/EN)
│   ├── gallery.js       render galleria + lightbox accessibile
│   ├── analytics.js     raccolta dati in localStorage (no server)
│   └── admin.js         dashboard analytics + autenticazione SHA-256
├── images/
│   ├── favicon-rose.png  (350x350, crop quadrato della rosa)
│   ├── logo-pulito.png   (logo grande)
│   ├── logo-header.png   (logo piccolo per header)
│   ├── rose.png          (la rosa usata anche nell'overlay QR)
│   ├── bouquet-1.svg … bouquet-6.svg   (placeholder foto)
│   ├── qr-zefiro-di-oksi*  (codice QR brandizzato)
│   └── flags/  (it.svg, ru.svg, en.svg)
├── scripts/   (utility di sviluppo: test, hash, QR generator)
├── _redirects   (config Cloudflare Pages)
└── .env         (credenziali locali, MAI committato)
```

---

## Cosa sostituire prima di pubblicare

1. **Foto dei bouquet**: `bouquet-1.svg … bouquet-6.svg` → foto reali
   (rinominare in `.jpg` mantenendo il nome, aggiornare `src` in `galleria.html`)
2. **Email reale**: in `js/i18n.js`, chiavi `'contact.email'` per tutte e 3
   le lingue (sostituire `zefirodioksi@proton.me`)
3. **Immagine home "mano che tiene un bouquet"**: in `index.html`, sostituire
   il blocco `.hero-image-placeholder` (con `data-i18n-attr="data-label"`)
   con `<img src="images/home-bouquet.jpg" alt="...">`
4. *(Opzionale)* **Password admin di default**: `zefiro2026` → cambia dalla
   dashboard dopo il primo login
5. *(Opzionale)* **Dominio custom** (`zefirodioksi.it`): vedi Cloudflare Pages

### Come testare lo switch lingua

1. Apri il sito in incognito (localStorage vuoto): si vede in IT di default
2. Cambia lingua del browser in russo o inglese → la lingua segue
3. Clicca le bandierine in alto a destra → scelta salvata in localStorage
4. Per testare da zero: `localStorage.clear()` in DevTools e ricarica

---

## Sviluppo locale

```bash
npm install                                  # installa dipendenze (Playwright, qrcode)
node scripts/local-server.js                 # server statico su :8765
node scripts/test-site.js                    # testa tutte le pagine x 3 lingue x 2 viewport
node scripts/test-i18n.js                    # test interattività bandierine
node scripts/test-detect.js                  # test rilevamento lingua browser
node scripts/test-qr.js                      # test decodifica QR
```

---

## Deploy

Live su **Cloudflare Pages**: <https://zefiro-di-oksi.pages.dev>

Auto-deploy: ogni `git push` su `main` triggera un nuovo build (~1 minuto).
Configurazione: progetto Git-connected a `EliseyRotar/zefiro-di-oksi`, build
command vuoto, build output directory `/`.

---

## Licenza

Il codice del sito è rilasciato con licenza MIT. Il marchio "Zefiro di Oksi",
il logo, la rosa e le foto dei fiori sono di proprietà di Oksana.
