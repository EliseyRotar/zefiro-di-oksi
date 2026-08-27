# Zefiro di Oksi

> *Fiori di zefir fatti a mano, con amore, gusto dopo gusto.*

Un piccolo progetto di fioristica di zefir — un dolce sofficissimo, fatto con
pura frutta, albumina e agar-agar, modellato a mano in piccoli bouquet da
ammirare e poi gustare. Non un marshmallow.

Questo repository contiene il sito vetrina del progetto: sette pagine statiche
in italiano, pensate per essere raggiunte principalmente tramite QR code
stampato su un'etichetta e scansionate da smartphone.

---

## Il progetto

Zefiro di Oksi è un hobby, non un business. Oksana — Oksi per gli amici —
scopre la fioristica di zefir frequentando una scuola dedicata, e comincia a
mettere in pratica ciò che impara creando piccole composizioni per chi le vuole
assaggiare.

Ogni fiore nasce da purea di frutta fatta in casa, con albumina e agar-agar
al posto della gelatina: niente conservanti, lattosio o glutine, adatto anche a
chi è vegetariano. I gusti spaziano dalla mela al ribes nero, dalla pesca a un
mirtillo selvatico un po' aspro, con pera, melone e mango in arrivo.

In ogni cestino i fiori sono di gusti diversi, così ogni composizione è anche
una piccola sorpresa da scoprire prima di assaggiarla.

---

## Il sito

Sette pagine, una lingua, zero tracciamenti, zero pubblicità.

| Pagina              | Cosa contiene                                                 |
| ------------------- | ------------------------------------------------------------- |
| `index.html`        | Home: logo, tagline, invito a scoprire il progetto            |
| `chi-sono.html`     | Chi è Oksi, come è nato il progetto, cosa c'è dentro ogni fiore |
| `cos-e-lo-zefir.html` | Box informativo sullo zefir e sulla fioristica                |
| `gusti.html`        | I gusti disponibili + una sezione "In arrivo"                |
| `galleria.html`     | Griglia di foto dei mini bouquet                              |
| `conservazione.html` | Come si conservano i fiori di zefir + qualche consiglio       |
| `contatti.html`     | Un solo invito caldo con un bottone `mailto:`                 |

### Caratteristiche

- **Mobile-first**: progettato per essere aperto da uno smartphone dopo una
  scansione QR. Pulsanti grandi, testo leggibile senza zoom, niente menu
  nascosti.
- **Tipografia calda**: serif elegante per i titoli (`Cormorant Garamond`),
  sans morbido per il testo (`Nunito`). Niente font "freddi" o geometrici.
- **Palette artigianale**: rosa cipria, beige, crema, marrone tenue. Nessun
  gradiente viola/blu standard.
- **Tocchi fatti a mano**: bordi leggermente arrotondati, bordi tratteggiati,
  piccoli dettagli floreali, texture carta leggera sullo sfondo.
- **Accessibile**: HTML semantico, target touch ≥ 44 px, contrasto elevato,
  navigazione tramite tastiera, supporto `prefers-reduced-motion`.
- **Veloce**: niente framework, niente build, una sola richiesta CSS, una
  sola richiesta JS, font caricati da Google Fonts.

### Cosa sostituire prima di pubblicare

1. **Le foto dei bouquet** in `images/` — i file `bouquet-1.svg … bouquet-6.svg`
   sono segnaposto ("foto in arrivo"). Sostituiscili con foto reali,
   mantenendo gli stessi nomi di file (rinominandoli in `.jpg` o `.png`),
   poi aggiorna l'attributo `src` nelle pagine `index.html` e `galleria.html`.
2. **L'indirizzo email** in `contatti.html` — al posto di
   `zefirodioksi@proton.me` metti l'indirizzo reale (anche nel testo visibile).
3. *(Opzionale)* **Il favicon** — l'attuale è una rosa stilizzata disegnata a
   mano. Se vuoi un'estratta del tuo logo, sostituisci `images/favicon.svg`.

### Stack

HTML, CSS e JavaScript vanilla. Nessuna dipendenza, nessun build, nessun
framework. Il sito gira ovunque: si apre con un doppio click su `index.html`,
si carica in 5 secondi su qualsiasi hosting statico.

```
Zefiro_di_Oksi/
├── index.html
├── chi-sono.html
├── cos-e-lo-zefir.html
├── gusti.html
├── galleria.html
├── conservazione.html
├── contatti.html
├── css/
│   └── style.css
├── js/
│   └── main.js
└── images/
    ├── favicon.svg
    ├── logo-pulito.png      logo grande, usato in home/chi-sono/contatti
    ├── logo-header.png      logo piccolo, usato nell'header
    └── bouquet-1.svg … bouquet-6.svg   placeholder da sostituire con foto
```

---

## Licenza

Il codice del sito è rilasciato con licenza MIT. Il marchio "Zefiro di Oksi",
il logo e le foto dei fiori sono di proprietà di Oksana.

## Deploy

Il sito è servito da [Cloudflare Pages](https://pages.cloudflare.com/) con
deploy automatico: ogni `git push` sul branch `main` del repository GitHub
innesca un nuovo build in circa un minuto.

URL di produzione: <https://zefiro-di-oksi.pages.dev>.
