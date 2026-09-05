/* =========================================================
   Zefiro di Oksi - galleria
   Elenco immagini + categorie + tagli correlati per lightbox.
   ========================================================= */

(function (global) {
  'use strict';

  /* Formato di ogni voce:
     { file: 'gallery-XX-...jpg',
       cat: 'zefir'|'torte'|'occasioni'|'varie',
       alt: 'testo alt italiano (breve, per accessibilita)',
       order: 12.5                  // opzionale: numero per riordinare la
                                     // visualizzazione (default = posizione
                                     // nell'array). Usato per evitare adiacenze
                                     // di colore (es. torte cuore rosso).
       slice: 'gallery-YY-...jpg'   // opzionale: filename del taglio interno
                                     // correlato (mostra pulsante "vedi interno"
                                     // nel lightbox)
       hidden: true                 // opzionale: foto "solo taglio" o "solo
                                     // vista alternativa" che non va mostrata
                                     // nella galleria, ma solo come slice correlata
     }
  */
  const ITEMS = [
    { file: 'gallery-02-occasioni-torta-compleanno-nera-happy-birthday.jpg', cat: 'occasioni',
      alt: 'Torta rettangolare nera con scritta Happy Birthday oro',
      order: 99 },
    { file: 'gallery-03-occasioni-compleanno-18-cheesecake-zefir.jpg', cat: 'zefir',
      alt: 'Cheesecake 18 candeline con bouquet di zefir',
      order: 1 },
    { file: 'gallery-04-zefir-bouquet-rose-ranuncoli-peonie-scatola.jpg', cat: 'zefir',
      alt: 'Bouquet di zefir in scatola con rose e peonie',
      order: 5 },
    { file: 'gallery-05-zefir-scatola-peonia-ranuncoli-orsetto-marzapane.jpg', cat: 'zefir',
      alt: 'Scatola di zefir con peonia, ranuncoli e orsetto',
      order: 2 },
    { file: 'gallery-06-occasioni-torta-viola-specchio-peonia-zefir-compleanno.jpg', cat: 'zefir',
      alt: 'Torta viola specchio con peonia di zefir Happy Birthday',
      order: 3 },
    { file: 'gallery-07-occasioni-torta-cioccolato-40-buon-compleanno-zefir.jpg', cat: 'zefir',
      alt: 'Torta cioccolato 40 con peonie di zefir e bassotto',
      order: 6 },
    { file: 'gallery-08-torte-cioccolato-glassa-specchio-peonie-zefir.jpg', cat: 'zefir',
      alt: 'Torta cioccolato con peonie di zefir',
      order: 7 },
    { file: 'gallery-09-varie-cucciolo-mops-marzapane.jpg', cat: 'zefir',
      alt: 'Cucciolo di carlino di zefir' },
    { file: 'gallery-65-zefir-scatola-rose-rosa-pesca-cuoricino.jpg', cat: 'zefir',
      alt: 'Scatola di rose di zefir rosa, crema e pesca con cuoricino',
      order: 8 },
    { file: 'gallery-10-torte-viola-specchio-foglia-oro-macaron.jpg', cat: 'torte',
      alt: 'Torta viola specchio con foglia oro e macaron',
      order: 21,
      slice: 'gallery-11-torte-fetta-mousse-frutti-bosco-specchio-viola.jpg' },
    { file: 'gallery-11-torte-fetta-mousse-frutti-bosco-specchio-viola.jpg', cat: 'torte',
      alt: 'Fetta di torta mousse ai frutti di bosco',
      hidden: true },
    { file: 'gallery-12-occasioni-torta-cuore-rossa-specchio-60-anniversario.jpg', cat: 'occasioni',
      alt: 'Torta cuore rossa con 60 oro e bottiglia di spumante',
      order: 12,
      slice: 'gallery-13-torte-fetta-mousse-rossa-doppio-strato.jpg' },
    { file: 'gallery-13-torte-fetta-mousse-rossa-doppio-strato.jpg', cat: 'torte',
      alt: 'Fetta di mousse rossa a doppio strato',
      hidden: true },
    { file: 'gallery-14-occasioni-torta-cuore-rossa-specchio-foglia-oro.jpg', cat: 'occasioni',
      alt: 'Torta cuore rossa con foglia oro',
      order: 14 },
    { file: 'gallery-15-varie-crostata-intreccio-cuoricini-frutta.jpg', cat: 'varie',
      alt: 'Crostata a intreccio con cuoricini e frutta',
      order: 13.5 },
    { file: 'gallery-16-occasioni-biscotti-natale-assortiti-vassoio.jpg', cat: 'occasioni',
      alt: 'Vassoio di biscotti natalizi assortiti',
      order: 20 },
    { file: 'gallery-17-occasioni-biscotti-natale-vassoio-vista-alternativa.jpg', cat: 'occasioni',
      alt: 'Vassoio biscotti natalizi vista alternativa' },
    { file: 'gallery-18-occasioni-biscotti-halloween-dita-strega.jpg', cat: 'occasioni',
      alt: 'Biscotti dita di strega di Halloween' },
    { file: 'gallery-19-occasioni-torta-bianca-viva-la-banda-rose-zefir.jpg', cat: 'occasioni',
      alt: 'Torta bianca Viva la banda con rose di zefir' },
    { file: 'gallery-20-torte-fetta-carrot-cake-strati-rosa-zefir.jpg', cat: 'torte',
      alt: 'Fetta carrot cake con rosa di zefir' },
    { file: 'gallery-21-occasioni-torta-60-gianni-panna-farfalle-oro.jpg', cat: 'occasioni',
      alt: 'Torta 60 Gianni con panna e farfalle oro' },
    { file: 'gallery-22-occasioni-torta-turchese-specchio-50-mare-conchiglie.jpg', cat: 'occasioni',
      alt: 'Torta turchese 50 a tema mare',
      slice: 'gallery-23-torte-fetta-interna-mousse-lampone-turchese.jpg' },
    { file: 'gallery-23-torte-fetta-interna-mousse-lampone-turchese.jpg', cat: 'torte',
      alt: 'Fetta interna della torta turchese',
      hidden: true },
    { file: 'gallery-24-occasioni-torta-cioccolato-auguri-ynga-calle-zefir.jpg', cat: 'occasioni',
      alt: 'Torta cioccolato auguri Ynga con calle' },
    { file: 'gallery-25-torte-naked-cioccolato-strati-panna-farfalle.jpg', cat: 'torte',
      alt: 'Torta naked al cioccolato' },
    { file: 'gallery-26-varie-torta-mele-classica-lamelle-zucchero.jpg', cat: 'varie',
      alt: 'Torta di mele classica' },
    { file: 'gallery-27-occasioni-sfoglia-albero-natale-palline.jpg', cat: 'occasioni',
      alt: 'Albero di Natale di pasta sfoglia' },
    { file: 'gallery-28-varie-crinkle-limone-zucchero-cannella.jpg', cat: 'varie',
      alt: 'Biscotti crinkle al limone' },
    { file: 'gallery-29-occasioni-torta-cioccolato-auguri-bab-fragole-oro.jpg', cat: 'occasioni',
      alt: 'Torta auguri BAB fragole dorate' },
    { file: 'gallery-30-varie-muffin-mirtilli-freschi-teglia.jpg', cat: 'varie',
      alt: 'Muffin ai mirtilli freschi' },
    { file: 'gallery-31-occasioni-cheesecake-18-orchidee-zefir-cioccolato.jpg', cat: 'occasioni',
      alt: 'Cheesecake 18 con orchidee di zefir' },
    { file: 'gallery-32-occasioni-torta-natale-bianca-rami-bacche.jpg', cat: 'occasioni',
      alt: 'Torta di Natale bianca con rami' },
    { file: 'gallery-33-occasioni-charlotte-75-savoiardi-ciuffetti-colorati.jpg', cat: 'occasioni',
      alt: 'Charlotte 75 savoiardi colorati' },
    { file: 'gallery-34-varie-crostata-albicocche-fiorellini-frolla.jpg', cat: 'varie',
      alt: 'Crostata di albicocche con fiorellini' },
    { file: 'gallery-35-occasioni-torta-turchese-vista-alto-conchiglie-oro.jpg', cat: 'occasioni',
      alt: 'Torta turchese vista dall\'alto',
      hidden: true },
    { file: 'gallery-36-occasioni-torta-corallo-buon-16-antonio-zefir.jpg', cat: 'occasioni',
      alt: 'Torta corallo 16 Antonio' },
    { file: 'gallery-36b-occasioni-torta-corallo-buon-16-antonio-zefir-dup.jpg', cat: 'occasioni',
      alt: 'Duplicato della torta corallo 16 Antonio',
      hidden: true },
    { file: 'gallery-37-torte-rotolo-meringata-mandorle-frutti-bosco.jpg', cat: 'torte',
      alt: 'Rotolo meringato con frutti di bosco' },
    { file: 'gallery-38-occasioni-torta-pasqua-glassa-uova-coniglietto.jpg', cat: 'occasioni',
      alt: 'Torta di Pasqua con uova' },
    { file: 'gallery-39-occasioni-torta-rossa-specchio-55-yubiley-farfalle.jpg', cat: 'occasioni',
      alt: 'Torta rossa С юбилеем 55',
      slice: 'gallery-40-torte-fetta-interna-yubiley-confettura-albicocche.jpg' },
    { file: 'gallery-40-torte-fetta-interna-yubiley-confettura-albicocche.jpg', cat: 'torte',
      alt: 'Fetta interna della torta yubiley',
      hidden: true },
    { file: 'gallery-41-occasioni-tronchetto-natale-olaf-alberello-noci.jpg', cat: 'occasioni',
      alt: 'Tronchetto di Natale con Olaf' },
    { file: 'gallery-42-occasioni-torta-blu-tanti-auguri-gianni-mirtilli-zefir.jpg', cat: 'occasioni',
      alt: 'Torta blu auguri Gianni' },
    { file: 'gallery-43-occasioni-torta-gialla-mango-auguri-frutti-bosco.jpg', cat: 'occasioni',
      alt: 'Torta gialla auguri',
      slice: 'gallery-44-torte-fetta-interna-mango-lampone-strati.jpg' },
    { file: 'gallery-44-torte-fetta-interna-mango-lampone-strati.jpg', cat: 'torte',
      alt: 'Fetta interna della torta mango',
      hidden: true },
    { file: 'gallery-45-occasioni-cheesecake-triplo-cioccolato-shar-pei-marzapane.jpg', cat: 'occasioni',
      alt: 'Cheesecake cioccolato Shar Pei' },
    { file: 'gallery-46-varie-brioche-mele-uvetta-girella.jpg', cat: 'varie',
      alt: 'Brioche mele e uvetta' },
    { file: 'gallery-47-occasioni-torta-65-tulipani-zefir-mughetti-bottiglia.jpg', cat: 'occasioni',
      alt: 'Torta 65 tulipani zefir' },
    { file: 'gallery-48-occasioni-kulich-pasqua-russo-uccellini-marzapane.jpg', cat: 'occasioni',
      alt: 'Kulich di Pasqua russo' },
    { file: 'gallery-49-occasioni-kulich-pasqua-uvetta-noci.jpg', cat: 'occasioni',
      alt: 'Kulich di Pasqua con uvetta e noci' },
    { file: 'gallery-50-occasioni-pane-pasqua-corolla-uova-dipinte.jpg', cat: 'occasioni',
      alt: 'Pane di Pasqua a corolla' },
    { file: 'gallery-51-varie-focaccia-alta-rettangolare.jpg', cat: 'varie',
      alt: 'Focaccia alta rettangolare' },
    { file: 'gallery-52-zefir-bouquet-tulipani-arancio-pesca.jpg', cat: 'varie',
      alt: 'Tulipani fatti con la crema',
      hidden: true },
    { file: 'gallery-52b-zefir-bouquet-tulipani-arancio-pesca-dup.jpg', cat: 'varie',
      alt: 'Duplicato dei tulipani fatti con la crema',
      hidden: true },
    { file: 'gallery-53-torte-arancio-specchio-foglia-zefir.jpg', cat: 'torte',
      alt: 'Torta arancio specchio' },
    { file: 'gallery-54-varie-crostata-albicocche-cuoricini-frolla.jpg', cat: 'varie',
      alt: 'Crostata albicocche cuoricini' },
    { file: 'gallery-55-torte-raffaello-bianca-cocco-mandorle.jpg', cat: 'torte',
      alt: 'Torta Raffaello bianca' },
    { file: 'gallery-56-torte-alveare-api-zefir-margherite-noci.jpg', cat: 'torte',
      alt: 'Torta alveare con api di zefir' },
    { file: 'gallery-57-occasioni-torta-natale-noci-alberelli-cioccolato.jpg', cat: 'occasioni',
      alt: 'Torta Natale alberelli cioccolato' },
    { file: 'gallery-58-occasioni-tronchetto-natale-buon-natale-funghi-marzapane.jpg', cat: 'occasioni',
      alt: 'Tronchetto Buon Natale funghi marzapane' },
    { file: 'gallery-59-occasioni-torta-cioccolato-auguri-franco-18-rosa-bianca.jpg', cat: 'occasioni',
      alt: 'Torta auguri Franco 18' },
    { file: 'gallery-60-varie-torta-mele-forno-spirale.jpg', cat: 'varie',
      alt: 'Torta di mele in forno' },
    { file: 'gallery-61-torte-cheesecake-fragole-glassa-rossa.jpg', cat: 'torte',
      alt: 'Cheesecake fragole glassa rossa' },
    { file: 'gallery-62-occasioni-kulich-pasqua-spirale-zucchero-uova-colorate.jpg', cat: 'occasioni',
      alt: 'Kulich Pasqua spirale uova' },
    { file: 'gallery-63-occasioni-panettone-kulich-dettaglio-interno-uvetta.jpg', cat: 'occasioni',
      alt: 'Dettaglio interno panettone' },
    { file: 'gallery-64-occasioni-torta-numero-14-crema-bianca.jpg', cat: 'occasioni',
      alt: 'Torta a forma di numero 14' },
  ];

  /* Filtri attivi: "Zefir" (default) + "I miei lavori" (tutto tranne zefir) */
  const FILTERS = [
    { id: 'zefir',   labelKey: 'gallery.filter.zefir' },
    { id: 'myworks', labelKey: 'gallery.filter.myworks' },
  ];

  function visibleItems(cat) {
    let pool;
    if (cat === 'myworks') {
      pool = ITEMS.filter(it => it.cat !== 'zefir');
    } else if (cat === 'all') {
      pool = ITEMS;
    } else {
      pool = ITEMS.filter(it => it.cat === cat);
    }
    pool = pool.filter(it => !it.hidden);
    /* Ordina per il campo `order` (default = posizione originale).
       Permette di riordinare la visualizzazione senza rinominare i file. */
    return pool.map((it, idx) => ({ it, idx })).sort((a, b) => {
      const oa = (a.it.order !== undefined) ? a.it.order : a.idx;
      const ob = (b.it.order !== undefined) ? b.it.order : b.idx;
      return oa - ob;
    }).map(x => x.it);
  }

  /* Lookup per filename (serve al lightbox per trovare la slice correlata) */
  const BY_FILE = {};
  ITEMS.forEach(it => { BY_FILE[it.file] = it; });

  window.GALLERY = {
    ITEMS,
    FILTERS,
    visibleItems,
    BY_FILE,
    getByCategory(cat) { return visibleItems(cat); },
    renderAll: null, /* impostato da js/gallery.js se serve */
  };
})(window);
