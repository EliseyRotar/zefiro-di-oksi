/* =========================================================
   Zefiro di Oksi - galleria
   Elenco immagini + categorie + descrizioni brevi per lightbox.
   Le descrizioni sono localizzate in IT / RU / EN.
   ========================================================= */

(function (global) {
  'use strict';

  /* Formato di ogni voce:
     { file: 'gallery-XX-...jpg', cat: 'zefir'|'torte'|'occasioni'|'varie',
       alt: 'testo alt italiano (breve, per accessibilita)',
       desc: { it, ru, en } }
  */
  const ITEMS = [
    { file: 'gallery-02-occasioni-torta-compleanno-nera-happy-birthday.jpg', cat: 'occasioni',
      alt: 'Torta rettangolare nera con scritta Happy Birthday oro',
      desc: {
        it: 'Torta rettangolare al cioccolato con scritta "Happy Birthday" in oro, in lavorazione per un compleanno.',
        ru: 'Прямоугольный шоколадный торт с золотой надписью "Happy Birthday" — готовится для дня рождения.',
        en: 'A rectangular chocolate cake with the words "Happy Birthday" in gold, being prepared for a birthday.'
      } },
    { file: 'gallery-03-occasioni-compleanno-18-cheesecake-zefir.jpg', cat: 'occasioni',
      alt: 'Cheesecake 18 candeline con bouquet di zefir',
      desc: {
        it: 'Cheesecake ai frutti con 18 candeline oro e un bouquet di zefir rosa, bianco e panna in scatola.',
        ru: 'Чизкейк с золотыми свечами-«18» и букетом зефирных цветов (розовые, белые, кремовые) в подарочной коробке.',
        en: 'A fruit cheesecake with gold "18" candles and a zefir bouquet of pink, white and cream, in a gift box.'
      } },
    { file: 'gallery-04-zefir-bouquet-rose-ranuncoli-peonie-scatola.jpg', cat: 'zefir',
      alt: 'Bouquet di zefir in scatola con rose e peonie',
      desc: {
        it: 'Bouquet di zefir in scatola regalo: rose crema, rosa e lilla, ranuncoli gialli e piccole peonie crema.',
        ru: 'Букет из зефира в подарочной коробке: кремовые, розовые и сиреневые розы, жёлтые ранункулюсы и маленькие кремовые пионы.',
        en: 'A zefir bouquet in a gift box: cream, pink and lilac roses, yellow ranunculi and small cream peonies.'
      } },
    { file: 'gallery-05-zefir-scatola-peonia-ranuncoli-orsetto-marzapane.jpg', cat: 'zefir',
      alt: 'Scatola di zefir con peonia, ranuncoli e orsetto',
      desc: {
        it: 'Scatola di zefir con peonia rosa cipria, ranuncoli gialli e un piccolo orsetto di marzapane.',
        ru: 'Коробка зефира с пыльно-розовым пионом, жёлтыми ранункулюсами и маленьким мишкой из марципана.',
        en: 'A zefir box with a dusty pink peony, yellow ranunculi and a tiny marzipan bear.'
      } },
    { file: 'gallery-06-occasioni-torta-viola-specchio-peonia-zefir-compleanno.jpg', cat: 'occasioni',
      alt: 'Torta viola specchio con peonia di zefir Happy Birthday',
      desc: {
        it: 'Torta specchio viola con grande peonia gialla di zefir, scritta "Happy Birthday" oro e foglia dorata.',
        ru: 'Зеркальный фиолетовый торт с большим жёлтым зефирным пионом, золотой надписью "Happy Birthday" и золотым листом.',
        en: 'A purple mirror-glaze cake with a large yellow zefir peony, "Happy Birthday" in gold, and a golden leaf.'
      } },
    { file: 'gallery-07-occasioni-torta-cioccolato-40-buon-compleanno-zefir.jpg', cat: 'occasioni',
      alt: 'Torta cioccolato 40 con peonie di zefir e bassotto',
      desc: {
        it: 'Torta al cioccolato con glassa specchio, bouquet di peonie di zefir pesca e rosa, bassotto di marzapane e scritta "Buon 40° Compleanno".',
        ru: 'Шоколадный торт с зеркальной глазурью, букетом зефирных пионов (персиковые и розовые), таксой из марципана и надписью "Buon 40° Compleanno".',
        en: 'A chocolate mirror-glaze cake with peach and pink zefir peonies, a marzipan dachshund and "Happy 40th Birthday".'
      } },
    { file: 'gallery-08-torte-cioccolato-glassa-specchio-peonie-zefir.jpg', cat: 'torte',
      alt: 'Torta cioccolato con peonie di zefir',
      desc: {
        it: 'Torta al cioccolato con glassa specchio e peonie di zefir nei toni del pesca e del rosa.',
        ru: 'Шоколадный торт с зеркальной глазурью и зефирными пионами в персиково-розовых тонах.',
        en: 'A chocolate mirror-glaze cake with peach and pink zefir peonies on top.'
      } },
    { file: 'gallery-09-varie-cucciolo-mops-marzapane.jpg', cat: 'varie',
      alt: 'Cucciolo di carlino di marzapane',
      desc: {
        it: 'Un cucciolo di carlino di marzapane, modellato a mano per decorare una torta.',
        ru: 'Щенок мопса из марципана, вылепленный вручную для украшения торта.',
        en: 'A marzipan pug puppy, hand-shaped to decorate a cake.'
      } },
    { file: 'gallery-10-torte-viola-specchio-foglia-oro-macaron.jpg', cat: 'torte',
      alt: 'Torta viola specchio con foglia oro e macaron',
      desc: {
        it: 'Torta con glassa specchio viola, foglia d\'oro e un piccolo macaron di decorazione.',
        ru: 'Торт с фиолетовой зеркальной глазурью, золотым листом и маленьким макарон.',
        en: 'A cake with purple mirror glaze, a gold leaf and a small macaron on top.'
      } },
    { file: 'gallery-11-torte-fetta-mousse-frutti-bosco-specchio-viola.jpg', cat: 'torte',
      alt: 'Fetta di torta mousse ai frutti di bosco',
      desc: {
        it: 'Fetta di torta mousse ai frutti di bosco: pan di Spagna, confettura e glassa specchio viola.',
        ru: 'Кусочек муссового торта с ягодами: бисквит, конфитюр и фиолетовая зеркальная глазурь.',
        en: 'A slice of berry mousse cake: sponge, jam and purple mirror glaze.'
      } },
    { file: 'gallery-12-occasioni-torta-cuore-rossa-specchio-60-anniversario.jpg', cat: 'occasioni',
      alt: 'Torta cuore rossa con 60 oro e bottiglia di spumante',
      desc: {
        it: 'Torta a cuore con glassa specchio rossa, "60" in oro, roselline di zefir e una piccola bottiglia di spumante.',
        ru: 'Торт-сердце с красной зеркальной глазурью, золотым "60", зефирными розочками и бутылочкой игристого.',
        en: 'A heart-shaped cake with red mirror glaze, gold "60", tiny zefir roses and a little sparkling wine bottle.'
      } },
    { file: 'gallery-13-torte-fetta-mousse-rossa-doppio-strato.jpg', cat: 'torte',
      alt: 'Fetta di mousse rossa a doppio strato',
      desc: {
        it: 'Fetta di mousse rossa a doppio strato di pan di Spagna, con glassa specchio.',
        ru: 'Кусочек красного мусса с двойным слоем бисквита и зеркальной глазурью.',
        en: 'A red mousse slice with a double sponge layer and mirror glaze.'
      } },
    { file: 'gallery-14-occasioni-torta-cuore-rossa-specchio-foglia-oro.jpg', cat: 'occasioni',
      alt: 'Torta cuore rossa con foglia oro',
      desc: {
        it: 'Torta a cuore con glassa specchio rossa, foglia d\'oro e piccoli fiorellini dorati.',
        ru: 'Торт-сердце с красной зеркальной глазурью, золотым листом и маленькими золотыми цветочками.',
        en: 'A heart-shaped cake with red mirror glaze, gold leaf and tiny golden flowers.'
      } },
    { file: 'gallery-15-varie-crostata-intreccio-cuoricini-frutta.jpg', cat: 'varie',
      alt: 'Crostata a intreccio con cuoricini e frutta',
      desc: {
        it: 'Crostata a intreccio con cuoricini di pasta frolla rossi e confettura di fragola, albicocche e mirtilli.',
        ru: 'Плетёная кростата с красными сердечками из песочного теста и конфитюром из клубники, абрикосов и черники.',
        en: 'A lattice tart with little red pastry hearts and strawberry, apricot and blueberry jam.'
      } },
    { file: 'gallery-16-occasioni-biscotti-natale-assortiti-vassoio.jpg', cat: 'occasioni',
      alt: 'Vassoio di biscotti natalizi assortiti',
      desc: {
        it: 'Vassoio di biscotti natalizi: stelle, ghirlande, candy cane, pupazzi di neve, renne e alberelli glassati.',
        ru: 'Поднос рождественского печенья: звёзды, венки, леденцы, снеговички, олени и расписные ёлочки.',
        en: 'A tray of Christmas cookies: stars, wreaths, candy canes, snowmen, reindeer and decorated trees.'
      } },
    { file: 'gallery-17-occasioni-biscotti-natale-vassoio-vista-alternativa.jpg', cat: 'occasioni',
      alt: 'Vassoio biscotti natalizi vista alternativa',
      desc: {
        it: 'Altra angolazione dello stesso vassoio di biscotti natalizi: occhi di bue, stelle, alberelli, candy cane e omini di pan di zenzero.',
        ru: 'Другой ракурс того же подноса: печенье с повидлом, звёзды, ёлочки, леденцы и пряничные человечки.',
        en: 'Another view of the same Christmas tray: jam cookies, stars, trees, candy canes and gingerbread people.'
      } },
    { file: 'gallery-18-occasioni-biscotti-halloween-dita-strega.jpg', cat: 'occasioni',
      alt: 'Biscotti dita di strega di Halloween',
      desc: {
        it: 'Biscotti "dita di strega" di Halloween, con mandorle al posto delle unghie e confettura di fragole per il "sangue".',
        ru: 'Печенье "пальцы ведьмы" на Хэллоуин: с миндалём вместо ногтей и клубничным конфитюром вместо крови.',
        en: 'Halloween "witch finger" cookies with almond nails and strawberry jam "blood".'
      } },
    { file: 'gallery-19-occasioni-torta-bianca-viva-la-banda-rose-zefir.jpg', cat: 'occasioni',
      alt: 'Torta bianca Viva la banda con rose di zefir',
      desc: {
        it: 'Torta rettangolare bianca con rose di zefir rosa e corallo, scritta "Viva la banda!" e una chiave di violino dorata.',
        ru: 'Прямоугольный белый торт с розовыми и коралловыми зефирными розами, надписью "Viva la banda!" и золотым скрипичным ключом.',
        en: 'A white rectangular cake with pink and coral zefir roses, "Viva la banda!" and a golden treble clef.'
      } },
    { file: 'gallery-20-torte-fetta-carrot-cake-strati-rosa-zefir.jpg', cat: 'torte',
      alt: 'Fetta carrot cake con rosa di zefir',
      desc: {
        it: 'Fetta di carrot cake a strati con crema al formaggio, decorata con una rosa di zefir.',
        ru: 'Кусочек морковного торта со слоями крем-чиза, украшенный зефирной розой.',
        en: 'A layered carrot cake slice with cream cheese frosting, topped with a zefir rose.'
      } },
    { file: 'gallery-21-occasioni-torta-60-gianni-panna-farfalle-oro.jpg', cat: 'occasioni',
      alt: 'Torta 60 Gianni con panna e farfalle oro',
      desc: {
        it: 'Torta rettangolare per il 60° di Gianni: panna, rose di panna, candeline "60" oro, scritta "Tanti auguri Giannì" e farfalle dorate.',
        ru: 'Прямоугольный торт на 60-летие Джанни: сливки, розочки из сливок, золотые свечи "60", надпись "Tanti auguri Giannì" и золотые бабочки.',
        en: 'A rectangular cake for Gianni\'s 60th: whipped cream, cream roses, gold "60" candles, "Happy Birthday Giannì" and golden butterflies.'
      } },
    { file: 'gallery-22-occasioni-torta-turchese-specchio-50-mare-conchiglie.jpg', cat: 'occasioni',
      alt: 'Torta turchese 50 a tema mare',
      desc: {
        it: 'Torta specchio turchese per un 50° compleanno a tema mare, decorata con conchiglie e topper "Tanti Auguri".',
        ru: 'Бирюзовый зеркальный торт на 50-летие в морской теме: ракушки и топпер "Tanti Auguri".',
        en: 'A turquoise mirror-glaze cake for a 50th birthday in a sea theme, decorated with shells and a "Tanti Auguri" topper.'
      } },
    { file: 'gallery-23-torte-fetta-interna-mousse-lampone-turchese.jpg', cat: 'torte',
      alt: 'Fetta interna della torta turchese',
      desc: {
        it: 'Fetta interna della torta turchese: mousse bianca, pan di Spagna, mousse al lampone e ribes, glassa specchio turchese.',
        ru: 'Кусочек того же торта: белый мусс, бисквит, малиново-смородиновый мусс и бирюзовая зеркальная глазурь.',
        en: 'An inside slice of the turquoise cake: white mousse, sponge, raspberry and blackcurrant mousse, turquoise mirror glaze.'
      } },
    { file: 'gallery-24-occasioni-torta-cioccolato-auguri-ynga-calle-zefir.jpg', cat: 'occasioni',
      alt: 'Torta cioccolato auguri Ynga con calle',
      desc: {
        it: 'Torta al cioccolato con calle bianche di zefir, orchidee vere, lavanda e scritta "Auguri Ynga".',
        ru: 'Шоколадный торт с белыми зефирными каллами, живыми орхидеями, лавандой и надписью "Auguri Ynga".',
        en: 'A chocolate cake with white zefir calla lilies, real orchids, lavender and "Auguri Ynga".'
      } },
    { file: 'gallery-25-torte-naked-cioccolato-strati-panna-farfalle.jpg', cat: 'torte',
      alt: 'Torta naked al cioccolato',
      desc: {
        it: 'Torta "naked" al cioccolato a strati, con panna, cioccolatini dorati e farfalle di cioccolato.',
        ru: 'Шоколадный "голый" торт со слоями: сливки, золотые конфеты и шоколадные бабочки.',
        en: 'A layered "naked" chocolate cake with whipped cream, golden truffles and chocolate butterflies.'
      } },
    { file: 'gallery-26-varie-torta-mele-classica-lamelle-zucchero.jpg', cat: 'varie',
      alt: 'Torta di mele classica',
      desc: {
        it: 'Torta di mele classica con lamelle di mela disposte a fiore e una spolverata di zucchero a velo.',
        ru: 'Классический яблочный пирог с яблочными дольками-лепестками и щепоткой сахарной пудры.',
        en: 'A classic apple cake with apple slices arranged like flower petals and a dusting of powdered sugar.'
      } },
    { file: 'gallery-27-occasioni-sfoglia-albero-natale-palline.jpg', cat: 'occasioni',
      alt: 'Albero di Natale di pasta sfoglia',
      desc: {
        it: 'Un albero di Natale di pasta sfoglia con palline colorate di glassa: semplice e festoso.',
        ru: 'Ёлочка из слоёного теста с цветными шариками из глазури — просто и по-праздничному.',
        en: 'A Christmas tree made of puff pastry with colorful icing baubles: simple and festive.'
      } },
    { file: 'gallery-28-varie-crinkle-limone-zucchero-cannella.jpg', cat: 'varie',
      alt: 'Biscotti crinkle al limone',
      desc: {
        it: 'Biscotti "crinkle" al limone con zucchero a velo, profumati con cannella e anice stellato.',
        ru: 'Лимонное печенье "crinkle" в сахарной пудре, ароматизированное корицей и бадьяном.',
        en: 'Lemon "crinkle" cookies in powdered sugar, scented with cinnamon and star anise.'
      } },
    { file: 'gallery-29-occasioni-torta-cioccolato-auguri-bab-fragole-oro.jpg', cat: 'occasioni',
      alt: 'Torta auguri BAB fragole dorate',
      desc: {
        it: 'Torta al cioccolato con glassa specchio, fragole dorate, lamponi, mirtilli e scritta "auguri BAB".',
        ru: 'Шоколадный торт с зеркальной глазурью, золочёной клубникой, малиной, черникой и надписью "auguri BAB".',
        en: 'A chocolate mirror-glaze cake with gold-dipped strawberries, raspberries, blueberries and "auguri BAB".'
      } },
    { file: 'gallery-30-varie-muffin-mirtilli-freschi-teglia.jpg', cat: 'varie',
      alt: 'Muffin ai mirtilli freschi',
      desc: {
        it: 'Muffin ai mirtilli freschi appena sfornati, ancora nella teglia.',
        ru: 'Свежевыпеченные маффины со свежей черникой, ещё в форме.',
        en: 'Freshly baked blueberry muffins, still in the tin.'
      } },
    { file: 'gallery-31-occasioni-cheesecake-18-orchidee-zefir-cioccolato.jpg', cat: 'occasioni',
      alt: 'Cheesecake 18 con orchidee di zefir',
      desc: {
        it: 'Cheesecake al cioccolato per un 18° compleanno, decorata con orchidee rosa di zefir dai riflessi dorati e scritta "Hauuu cembe".',
        ru: 'Шоколадный чизкейк на 18-летие: розовые зефирные орхидеи с золотым отливом и надпись "Hauuu cembe".',
        en: 'A chocolate cheesecake for an 18th birthday, with pink zefir orchids dusted in gold and "Hauuu cembe".'
      } },
    { file: 'gallery-32-occasioni-torta-natale-bianca-rami-bacche.jpg', cat: 'occasioni',
      alt: 'Torta di Natale bianca con rami',
      desc: {
        it: 'Torta di Natale con glassa bianca, rami di icing, cocco, bacche rosse e una piccola pigna verde.',
        ru: 'Рождественский торт с белой глазурью, "веточками" из айсинга, кокосом, красными ягодами и маленькой зелёной шишкой.',
        en: 'A Christmas cake with white glaze, icing "branches", coconut, red berries and a little green pine cone.'
      } },
    { file: 'gallery-33-occasioni-charlotte-75-savoiardi-ciuffetti-colorati.jpg', cat: 'occasioni',
      alt: 'Charlotte 75 savoiardi colorati',
      desc: {
        it: 'Charlotte per un 75° anniversario: savoiardi, crema chantilly a ciuffetti lilla, verde e giallo, "75" oro e fiocco dorato.',
        ru: 'Шарлотка на 75-летие: савоярди, взбитые сливки сиреневым, зелёным и жёлтым, золотое "75" и золотой бант.',
        en: 'A charlotte for a 75th anniversary: sponge fingers, lilac/green/yellow chantilly rosettes, gold "75" and a golden bow.'
      } },
    { file: 'gallery-34-varie-crostata-albicocche-fiorellini-frolla.jpg', cat: 'varie',
      alt: 'Crostata di albicocche con fiorellini',
      desc: {
        it: 'Crostata di albicocche decorata con piccoli fiorellini di pasta frolla.',
        ru: 'Абрикосовая кростата, украшенная маленькими цветочками из песочного теста.',
        en: 'An apricot tart decorated with little shortbread flowers.'
      } },
    { file: 'gallery-35-occasioni-torta-turchese-vista-alto-conchiglie-oro.jpg', cat: 'occasioni',
      alt: 'Torta turchese vista dall\'alto',
      desc: {
        it: 'Vista dall\'alto della stessa torta turchese 50°: righe blu scuro e conchiglie dorate.',
        ru: 'Вид сверху того же бирюзового торта: тёмно-синие полосы и золотые ракушки.',
        en: 'A top-down view of the same 50th birthday turquoise cake: dark blue lines and golden shells.'
      } },
    { file: 'gallery-36-occasioni-torta-corallo-buon-16-antonio-zefir.jpg', cat: 'occasioni',
      alt: 'Torta corallo 16 Antonio',
      desc: {
        it: 'Torta specchio corallo per il 16° di Antonio: conchiglia, stella marina, "16" e fiorellini di zefir.',
        ru: 'Коралловый зеркальный торт на 16-летие Антонио: ракушка, морская звезда, "16" и зефирные цветочки.',
        en: 'A coral mirror-glaze cake for Antonio\'s 16th: a shell, a starfish, "16" and little zefir flowers.'
      } },
    { file: 'gallery-37-torte-rotolo-meringata-mandorle-frutti-bosco.jpg', cat: 'torte',
      alt: 'Rotolo meringato con frutti di bosco',
      desc: {
        it: 'Rotolo meringato con lamelle di mandorle, more, lamponi, mirtilli, ribes e una colata di cioccolato.',
        ru: 'Меренговый рулет с миндальными лепестками, ежевикой, малиной, черникой, смородиной и шоколадным соусом.',
        en: 'A meringue roll with almond flakes, blackberries, raspberries, blueberries, currants and a chocolate drizzle.'
      } },
    { file: 'gallery-38-occasioni-torta-pasqua-glassa-uova-coniglietto.jpg', cat: 'occasioni',
      alt: 'Torta di Pasqua con uova',
      desc: {
        it: 'Torta di Pasqua tradizionale con glassa bianca, codette, nido con uova di cioccolato e un coniglietto pasquale.',
        ru: 'Пасхальный торт: белая глазурь, посыпка, гнездо с шоколадными яйцами и пасхальный зайчик.',
        en: 'A traditional Easter cake with white glaze, sprinkles, a nest of chocolate eggs and a little Easter bunny.'
      } },
    { file: 'gallery-39-occasioni-torta-rossa-specchio-55-yubiley-farfalle.jpg', cat: 'occasioni',
      alt: 'Torta rossa С юбилеем 55',
      desc: {
        it: 'Torta con glassa specchio rossa per un 55° anniversario: scritta in russo "С юбилеем!", "55" oro e tre farfalle di carta.',
        ru: 'Торт с красной зеркальной глазурью на 55-летие: надпись по-русски "С юбилеем!", золотое "55" и три бумажные бабочки.',
        en: 'A red mirror-glaze cake for a 55th anniversary: "С юбилеем!" in Russian, gold "55" and three paper butterflies.'
      } },
    { file: 'gallery-40-torte-fetta-interna-yubiley-confettura-albicocche.jpg', cat: 'torte',
      alt: 'Fetta interna della torta yubiley',
      desc: {
        it: 'Fetta interna della torta "С юбилеем": pan di Spagna, confettura di albicocche e mango, glassa specchio rossa.',
        ru: 'Кусочек торта "С юбилеем": бисквит, абрикосово-манговый конфитюр и красная зеркальная глазурь.',
        en: 'An inside slice of the "С юбилеем" cake: sponge, apricot-mango jam and red mirror glaze.'
      } },
    { file: 'gallery-41-occasioni-tronchetto-natale-olaf-alberello-noci.jpg', cat: 'occasioni',
      alt: 'Tronchetto di Natale con Olaf',
      desc: {
        it: 'Tronchetto di Natale al cioccolato con Olaf di Frozen, alberello, ghirlanda, palline colorate, noci e scaglie di cioccolato.',
        ru: 'Рождественское полено из шоколада с Олафом из "Холодного сердца", ёлочкой, венком, шариками, орехами и шоколадной стружкой.',
        en: 'A chocolate yule log with Olaf from Frozen, a little tree, a wreath, colorful baubles, nuts and chocolate shavings.'
      } },
    { file: 'gallery-42-occasioni-torta-blu-tanti-auguri-gianni-mirtilli-zefir.jpg', cat: 'occasioni',
      alt: 'Torta blu auguri Gianni',
      desc: {
        it: 'Torta con glassa specchio blu "Tanti auguri Gianni", more dorate, mirtilli e fiorellini di zefir.',
        ru: 'Торт с синей зеркальной глазурью "Tanti auguri Gianni", золочёной ежевикой, черникой и зефирными цветочками.',
        en: 'A blue mirror-glaze cake "Tanti auguri Gianni" with gold-dipped blackberries, blueberries and little zefir flowers.'
      } },
    { file: 'gallery-43-occasioni-torta-gialla-mango-auguri-frutti-bosco.jpg', cat: 'occasioni',
      alt: 'Torta gialla auguri',
      desc: {
        it: 'Torta con glassa specchio giallo mango, fragole, more, mirtilli, ciliegie e scritta "Auguri a te".',
        ru: 'Торт с жёлтой манговой зеркальной глазурью, клубникой, ежевикой, черникой, вишней и надписью "Auguri a te".',
        en: 'A mango-yellow mirror-glaze cake with strawberries, blackberries, blueberries, cherries and "Auguri a te".'
      } },
    { file: 'gallery-44-torte-fetta-interna-mango-lampone-strati.jpg', cat: 'torte',
      alt: 'Fetta interna della torta mango',
      desc: {
        it: 'Fetta interna della torta gialla: pan di Spagna, mousse bianca, gelée di lampone e fragola, mousse al mango e glassa specchio.',
        ru: 'Кусочек жёлтого торта: бисквит, белый мусс, малиново-клубничное желе, манговый мусс и зеркальная глазурь.',
        en: 'An inside slice of the yellow cake: sponge, white mousse, raspberry-strawberry gelée, mango mousse and mirror glaze.'
      } },
    { file: 'gallery-45-occasioni-cheesecake-triplo-cioccolato-shar-pei-marzapane.jpg', cat: 'occasioni',
      alt: 'Cheesecake cioccolato Shar Pei',
      desc: {
        it: 'Cheesecake al triplo cioccolato con cucciolo di Shar Pei di marzapane, bouquet di petunie rosa e lettere oro "CIAO DA AUGURI PAOLA & FAMILY".',
        ru: 'Чизкейк из трёх видов шоколада со щенком шарпея из марципана, букетом розовых петуний и золотыми буквами "CIAO DA AUGURI PAOLA & FAMILY".',
        en: 'A triple-chocolate cheesecake with a marzipan Shar Pei puppy, a bouquet of pink petunias and gold letters "CIAO DA AUGURI PAOLA & FAMILY".'
      } },
    { file: 'gallery-46-varie-brioche-mele-uvetta-girella.jpg', cat: 'varie',
      alt: 'Brioche mele e uvetta',
      desc: {
        it: 'Una brioche alle mele e uvetta, arrotolata a girella per una colazione profumata.',
        ru: 'Бриошь с яблоками и изюмом, свёрнутая рулетом — ароматный завтрак.',
        en: 'A brioche with apple and raisins, rolled into a swirl for a fragrant breakfast.'
      } },
    { file: 'gallery-47-occasioni-torta-65-tulipani-zefir-mughetti-bottiglia.jpg', cat: 'occasioni',
      alt: 'Torta 65 tulipani zefir',
      desc: {
        it: 'Torta di compleanno per un 65° con tulipani di zefir rosa, gialli e arancio, mughetti bianchi, bottiglia di vino di marzapane e "65" di zefir verde.',
        ru: 'Торт на 65-летие: зефирные тюльпаны (розовые, жёлтые, оранжевые), белые ландыши, бутылка вина из марципана и зефирное "65".',
        en: 'A 65th birthday cake with pink, yellow and orange zefir tulips, white lilies of the valley, a marzipan wine bottle and green zefir "65".'
      } },
    { file: 'gallery-48-occasioni-kulich-pasqua-russo-uccellini-marzapane.jpg', cat: 'occasioni',
      alt: 'Kulich di Pasqua russo',
      desc: {
        it: 'Kulich tradizionale di Pasqua con glassa bianca, due uccellini di marzapane, casetta e nido, tra uova dipinte.',
        ru: 'Традиционный пасхальный кулич с белой глазурью, двумя марципановыми птичками, домиком и гнездом, среди расписных яиц.',
        en: 'A traditional kulich with white glaze, two marzipan birds, a little house and a nest, surrounded by painted eggs.'
      } },
    { file: 'gallery-49-occasioni-kulich-pasqua-uvetta-noci.jpg', cat: 'occasioni',
      alt: 'Kulich di Pasqua con uvetta e noci',
      desc: {
        it: 'Kulich di Pasqua russo tradizionale con uvette e noci, glassa bianca all\'interno.',
        ru: 'Традиционный пасхальный кулич с изюмом и орехами, белой глазурью сверху.',
        en: 'A traditional Russian kulich with raisins and walnuts, topped with white glaze.'
      } },
    { file: 'gallery-50-occasioni-pane-pasqua-corolla-uova-dipinte.jpg', cat: 'occasioni',
      alt: 'Pane di Pasqua a corolla',
      desc: {
        it: 'Pane di Pasqua intrecciato a corolla, con uova dipinte e una spolverata di zucchero a velo.',
        ru: 'Плетёный пасхальный хлеб-венок с расписными яйцами и щепоткой сахарной пудры.',
        en: 'A braided Easter wreath bread with painted eggs and a dusting of powdered sugar.'
      } },
    { file: 'gallery-51-varie-focaccia-alta-rettangolare.jpg', cat: 'varie',
      alt: 'Focaccia alta rettangolare',
      desc: {
        it: 'Una focaccia alta, rettangolare, dorata e croccante: semplice e profumata.',
        ru: 'Высокий прямоугольный фокачча: золотистый, хрустящий, простой и ароматный.',
        en: 'A tall rectangular focaccia: golden, crusty, simple and fragrant.'
      } },
    { file: 'gallery-52-zefir-bouquet-tulipani-arancio-pesca.jpg', cat: 'zefir',
      alt: 'Bouquet di tulipani di zefir',
      desc: {
        it: 'Bouquet di zefir: tulipani arancioni e pesca con foglie verdi e pistilli gialli.',
        ru: 'Зефирный букет: оранжевые и персиковые тюльпаны с зелёными листьями и жёлтыми тычинками.',
        en: 'A zefir bouquet of orange and peach tulips with green leaves and yellow stamens.'
      } },
    { file: 'gallery-53-torte-arancio-specchio-foglia-zefir.jpg', cat: 'torte',
      alt: 'Torta arancio specchio',
      desc: {
        it: 'Torta con glassa specchio arancio e una foglia di zefir bianca come decorazione.',
        ru: 'Торт с оранжевой зеркальной глазурью и белым зефирным листом.',
        en: 'A cake with orange mirror glaze and a white zefir leaf on top.'
      } },
    { file: 'gallery-54-varie-crostata-albicocche-cuoricini-frolla.jpg', cat: 'varie',
      alt: 'Crostata albicocche cuoricini',
      desc: {
        it: 'Crostata di albicocche con cuoricini di pasta frolla sul bordo.',
        ru: 'Абрикосовая кростата с сердечками из песочного теста по краю.',
        en: 'An apricot tart with little pastry hearts along the edge.'
      } },
    { file: 'gallery-55-torte-raffaello-bianca-cocco-mandorle.jpg', cat: 'torte',
      alt: 'Torta Raffaello bianca',
      desc: {
        it: 'Torta in stile Raffaello, bianca, con cocco, mandorle a lamelle e tartufi al cocco.',
        ru: 'Торт в стиле Raffaello: белый, с кокосом, миндальными лепестками и кокосовыми трюфелями.',
        en: 'A Raffaello-style white cake with coconut, sliced almonds and coconut truffles.'
      } },
    { file: 'gallery-56-torte-alveare-api-zefir-margherite-noci.jpg', cat: 'torte',
      alt: 'Torta alveare con api di zefir',
      desc: {
        it: 'Torta "alveare" con cioccolato bianco a nido d\'ape, api e margherite di zefir, noci.',
        ru: 'Торт "улей": белый шоколад в виде сот, зефирные пчёлы и маргаритки, орехи.',
        en: 'A "beehive" cake with white chocolate honeycomb, zefir bees and daisies, and walnuts.'
      } },
    { file: 'gallery-57-occasioni-torta-natale-noci-alberelli-cioccolato.jpg', cat: 'occasioni',
      alt: 'Torta Natale alberelli cioccolato',
      desc: {
        it: 'Torta di Natale decorata con noci, panna e cinque alberelli di cioccolato.',
        ru: 'Рождественский торт, украшенный орехами, сливками и пятью шоколадными ёлочками.',
        en: 'A Christmas cake decorated with walnuts, whipped cream and five little chocolate trees.'
      } },
    { file: 'gallery-58-occasioni-tronchetto-natale-buon-natale-funghi-marzapane.jpg', cat: 'occasioni',
      alt: 'Tronchetto Buon Natale funghi marzapane',
      desc: {
        it: 'Tronchetto di Natale yule log con scritta "Buon Natale", funghi di marzapane, agrifoglio e bacche rosse.',
        ru: 'Рождественское полено "Buon Natale" с марципановыми грибами, остролистом и красными ягодами.',
        en: 'A Christmas yule log with "Buon Natale", marzipan mushrooms, holly and red berries.'
      } },
    { file: 'gallery-59-occasioni-torta-cioccolato-auguri-franco-18-rosa-bianca.jpg', cat: 'occasioni',
      alt: 'Torta auguri Franco 18',
      desc: {
        it: 'Torta al cioccolato "Auguri Franco 18", decorata con una grande rosa bianca di cioccolato bianco.',
        ru: 'Шоколадный торт "Auguri Franco 18", украшенный большой белой розой из белого шоколада.',
        en: 'A chocolate cake "Auguri Franco 18" with a large white rose made of white chocolate.'
      } },
    { file: 'gallery-60-varie-torta-mele-forno-spirale.jpg', cat: 'varie',
      alt: 'Torta di mele in forno',
      desc: {
        it: 'Torta di mele in cottura, con lamelle di mela disposte a spirale dorata.',
        ru: 'Яблочный пирог в духовке: яблочные дольки выложены золотистой спиралью.',
        en: 'An apple cake in the oven, with apple slices arranged in a golden spiral.'
      } },
    { file: 'gallery-61-torte-cheesecake-fragole-glassa-rossa.jpg', cat: 'torte',
      alt: 'Cheesecake fragole glassa rossa',
      desc: {
        it: 'Cheesecake alle fragole: mousse bianca, glassa specchio rossa e fragole fresche attorno e in cima.',
        ru: 'Клубничный чизкейк: белый мусс, красная зеркальная глазурь, свежая клубника по бокам и сверху.',
        en: 'A strawberry cheesecake: white mousse, red mirror glaze, fresh strawberries around and on top.'
      } },
    { file: 'gallery-62-occasioni-kulich-pasqua-spirale-zucchero-uova-colorate.jpg', cat: 'occasioni',
      alt: 'Kulich Pasqua spirale uova',
      desc: {
        it: 'Kulich di Pasqua con glassa a spirale di zucchero a velo, contornato da uova colorate blu, gialle, verdi e rosse.',
        ru: 'Пасхальный кулич со спиралью из сахарной пудры, в окружении разноцветных яиц (синие, жёлтые, зелёные, красные).',
        en: 'A Paschal kulich with a powdered-sugar spiral, surrounded by colored eggs (blue, yellow, green, red).'
      } },
    { file: 'gallery-63-occasioni-panettone-kulich-dettaglio-interno-uvetta.jpg', cat: 'occasioni',
      alt: 'Dettaglio interno panettone',
      desc: {
        it: 'Dettaglio interno di un panettone o kulich: soffice, alveolato, pieno di uvette.',
        ru: 'Кусочек в разрезе панеттоне или кулича: мягкий, пористый, с изюмом.',
        en: 'An inside view of a panettone or kulich: soft, airy and full of raisins.'
      } },
    { file: 'gallery-64-occasioni-torta-numero-14-crema-bianca.jpg', cat: 'occasioni',
      alt: 'Torta a forma di numero 14',
      desc: {
        it: 'Torta a forma di numero "14", a strati di pan di Spagna con ciuffetti di crema bianca.',
        ru: 'Торт в форме цифры "14": слои бисквита с шапочками из белого крема.',
        en: 'A "14"-shaped cake with sponge layers and little white cream rosettes.'
      } },
  ];

  /* Categorie (i18n) */
  const CATEGORIES = ['zefir', 'torte', 'occasioni', 'varie'];

  global.GALLERY = {
    ITEMS,
    CATEGORIES,
    getByCategory(cat) {
      if (!cat || cat === 'all') return ITEMS.slice();
      return ITEMS.filter(it => it.cat === cat);
    },
  };
})(window);
