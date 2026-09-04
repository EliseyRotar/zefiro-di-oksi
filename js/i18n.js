/* =========================================================
   Zefiro di Oksi - internazionalizzazione
   Gestisce IT / RU / EN con persistenza in localStorage,
   rilevamento automatico dalla lingua del browser,
   e helper per applicare le traduzioni al DOM.
   ========================================================= */

(function (global) {
  'use strict';

  /* Dizionario completo.
     Struttura: { it: {chiave: valore}, ru: {...}, en: {...} }
     Tutti i testi visibili del sito passano da qui. */
  const DICT = {
    it: {
      'site.title': 'Zefiro di Oksi — fiori di zefir fatti a mano',
      'site.tagline': 'fiori di zefir fatti a mano',

      'meta.home.title': 'Zefiro di Oksi — fiori di zefir fatti a mano',
      'meta.home.desc': 'Zefiro di Oksi: fiori di zefir fatti a mano, con amore.',
      'meta.about.title': 'Chi sono — Zefiro di Oksi',
      'meta.about.desc': 'Oksana, in arte Oksi, racconta come è nato Zefiro di Oksi.',
      'meta.zefir.title': 'Cos\'è lo zefir — Zefiro di Oksi',
      'meta.zefir.desc': 'Cos\'è la fioristica di zefir: un dolce sofficissimo fatto a mano.',
      'meta.gallery.title': 'Galleria — Zefiro di Oksi',
      'meta.gallery.desc': 'Le creazioni dolciarie di Oksi: torte, dolci, decorazioni e fiori di zefir.',
      'meta.contact.title': 'Contatti — Zefiro di Oksi',
      'meta.contact.desc': 'Se ami i fiori, puoi scrivermi.',
      'meta.404.title': 'Pagina non trovata — Zefiro di Oksi',
      'meta.404.desc': 'La pagina che cercavi non esiste o è stata spostata.',
      'error.title': 'Questa pagina non c\'è',
      'error.text': 'Forse il link è vecchio, o hai scritto l\'indirizzo a mano. Non ti preoccupare: torna alla home e ripartiamo da lì.',
      'error.cta_home': 'Torna alla home',
      'error.cta_contact': 'Scrivimi',

      'lang.it.label': 'Italiano',
      'lang.ru.label': 'Russo',
      'lang.en.label': 'Inglese',

      'nav.home': 'Home',
      'nav.about': 'Chi sono',
      'nav.zefir': 'Cos\'è lo zefir',
      'nav.gallery': 'Galleria',
      'nav.contact': 'Contatti',

      'home.welcome': 'Benvenuta, benvenuto. Questo è il mio piccolo mondo dolce.',
      'home.tagline': 'Fiori di zefir fatti a mano, con amore.',
      'home.scroll': 'scorri',
      'home.image_alt': 'Foto di Oksi che tiene in mano un bouquet di zefir (in arrivo)',

      'about.title': 'Chi sono',
      'about.body': 'Sono Oksana, ma per gli amici sono semplicemente Oksi, ed è proprio per questo che il mio piccolo mondo dolce si chiama «Zefiro di Oksi». Ho sempre amato il mondo della pasticceria: ho iniziato da bambina, osservando mia nonna, che era chef in un ristorante rinomato, e da allora non ho mai smesso di imparare. Ho preparato torte, pasticcini, biscotti, crostate, croissant, profumate brioches francesi, cheesecake e dolci al cioccolato, ho imparato la glassa a specchio e molto altro ancora. Di recente ho scoperto una nuova passione: la fioristica di zefir, un dolce delicatissimo che non ha nulla a che vedere con il marshmallow. Sto ancora imparando, frequento un corso di fioristica di zefir, e il diploma arriverà tra qualche mese. Ma sono già felice di mostrarvi le mie prime piccole composizioni. Ogni fiore nasce da purea di frutta fatta in casa, senza conservanti, lattosio o glutine, con albumina e agar-agar, un\'alternativa naturale alla gelatina adatta anche ai vegetariani. Ho già provato a lavorare con diversi gusti: mela, lampone, ribes nero, pesca, banana, mirtillo di bosco. Presto arriveranno pera, ciliegia, melone e mango: la mia collezione cresce insieme a me. In ogni composizione amo unire fiori di gusti diversi, così ogni bouquet diventa una piccola sorpresa da scoprire.',
      'about.family.title': 'Grazie di cuore',
      'about.family.body': 'Grazie alla mia famiglia, che ogni giorno mi sostiene nei miei progetti creativi: col cuore, con le mani e con infinita pazienza. Senza di voi tutto questo non esisterebbe.',

      'zefir.title': 'Cos\'è lo zefir',
      'zefir.info': 'Cos\'è la fioristica di zefir? Lo zefir è un dolce delicatissimo originario dell\'Europa dell\'Est. Ha preso il suo nome in onore di Zefiro, l\'antico dio greco del leggero vento d\'occidente, proprio per la sua consistenza leggera e ariosa. Da questa nuvola commestibile nascono petali e fiori. Raccolti a mano, uno per uno, con amore, in piccoli bouquet dolci, da ammirare e poi da gustare.',
      'zefir.romantic': 'Ho sempre amato i fiori. E non ho mai incontrato una persona a cui non piacessero. I fiori portano leggerezza, un sorriso, buon umore, dicono cose che a volte le parole non riescono a dire. A casa mia ci sono sempre, anche in inverno. E un giorno, sfogliando siti di cucina alla ricerca di novità, ho scoperto la fioristica di zefir: un fiore che, oltre a essere bello, si può anche gustare. Per crearlo dallo zefir non basta essere pasticceri, serve anche uno sguardo da artista, per scegliere colori che dialogano tra loro, e una mano da fiorista, perché ogni composizione sia armoniosa. Tre arti in una, per regalare qualcosa di piacevole agli occhi e all\'anima.',
      'zefir.gift': 'Un bouquet di zefir è un piccolo gesto adatto a ogni occasione: un regalo di compleanno, una proposta di matrimonio, o semplicemente un incontro. Per dire "grazie", per dire "sto pensando a te", per dire semplicemente "per te". Non serve un motivo, quando si vuole regalare un po\' di gioia.',
      'zefir.gift_title': 'Perché un bouquet di zefir è un regalo speciale',
      'zefir.conservation.title': 'Conservazione',
      'zefir.conservation.body': 'I fiori di zefir si conservano 10-14 giorni in un luogo fresco e asciutto. Con il tempo diventano solo leggermente più corposi, ma non perdono il loro gusto.',
      'zefir.conservation.tip1': '',
      'zefir.conservation.tip2': '',
      'zefir.conservation.tip3': '',

      'flavors.title': 'Gusti',
      'flavors.intro': 'Ogni bouquet nasce da ciò che ho in casa in quel momento: le puree che preparo, i frutti che scelgo con cura. Non accetto richieste su gusti specifici — preferisco che ogni composizione sia una piccola sorpresa. La mia collezione cresce insieme a me, gusto dopo gusto. Per ora ho imparato a lavorare bene con questi sapori:',
      'flavors.mela': 'Mela',
      'flavors.mela.desc': 'Dolce, delicata, avvolgente: il primo fiore che ho imparato a fare.',
      'flavors.mela_lampone': 'Mela e lampone',
      'flavors.mela_lampone.desc': 'La morbidezza della mela incontra la nota vivace del lampone.',
      'flavors.ribes': 'Ribes nero',
      'flavors.ribes.desc': 'Intenso, profondo, dal colore scuro: per chi ama i sapori decisi.',
      'flavors.pesca': 'Pesca',
      'flavors.pesca.desc': 'Soffice e profumata, sa di fine estate in un boccone.',
      'flavors.mirtillo': 'Mirtillo selvatico',
      'flavors.mirtillo.desc': 'Un po\' aspro, come si trova nel bosco: il preferito di chi cerca carattere.',
      'flavors.soon': 'Prossimamente: pera, melone, mango. Sto ancora studiando le loro puree, ma arriveranno.',
      'flavors.surprise': 'In ogni cestino amo unire fiori di gusti diversi, così ogni composizione è anche una piccola sorpresa da scoprire.',

      'gallery.title': 'Galleria',
      'gallery.intro': 'Alcune delle mie composizioni. Ogni foto è un\'occasione per raccontare un fiore.',
      'gallery.cap.placeholder': 'foto in arrivo',
      'gallery.cap.bouquet': 'Mini bouquet',
      'gallery.cap.mela': 'Mini bouquet — mela',
      'gallery.cap.mela_lampone': 'Mini bouquet — mela e lampone',
      'gallery.cap.ribes': 'Mini bouquet — ribes nero',
      'gallery.cap.pesca': 'Mini bouquet — pesca',
      'gallery.cap.mirtillo': 'Mini bouquet — mirtillo selvatico',
      'gallery.cap.pera': 'Mini bouquet — pera',
      'gallery.cap.default': 'Mini bouquet',

      'gallery.filter.all': 'Tutte',
      'gallery.filter.myworks': 'Alcuni dei miei lavori',
      'gallery.filter.zefir': 'Zefir',
      'gallery.filter.torte': 'Torte',
      'gallery.filter.occasioni': 'Occasioni',
      'gallery.filter.varie': 'Varie',
      'gallery.filter.count': '{n} foto',
      'gallery.empty': 'Nessuna foto in questa categoria.',
      'gallery.close': 'Chiudi',
      'gallery.prev': 'Foto precedente',
      'gallery.next': 'Foto successiva',
      'gallery.counter': '{current} di {total}',
      'gallery.see_inside': 'Vedi l\'interno',
      'gallery.see_outside': 'Torna alla torta intera',

      'contact.title': 'Per l\'anima',
      'contact.body': 'Questo è il mio hobby, nato dal desiderio di regalare un po\' di bellezza a chi mi è caro e a chi mi sta sempre vicino. Se anche voi, come me, siete affascinati dai fiori, che siano bouquet veri o le loro delicate copie commestibili, e volete saperne di più, sarò felice di scambiare due parole. zefirodioksi@proton.me',
      'contact.email': 'zefirodioksi@proton.me',
      'contact.note': 'Qui non c\'è un negozio né alcuna attività commerciale, solo ciò che creo con le mie mani, per il cuore e nel tempo libero.',
      'contact.credit': 'Sito creato da <a href="https://github.com/EliseyRotar" target="_blank" rel="noopener noreferrer">Elisey Rotar</a> · studente di Informatica @ Dalmine Marconi',

      'footer.tagline': 'fiori di zefir fatti a mano, con cura',
      'footer.disclaimer': 'Sito amatoriale, non un e-commerce',
      'footer.credit.label': 'Sito creato da',
      'footer.credit.name': 'Elisey Rotar',
      'footer.credit.role': 'studente di Informatica @ Dalmine Marconi',
      'support.title': 'P.S.',
      'support.body': 'Se avete voglia di sostenermi in questo mio percorso, ogni piccolo contributo sarà gradito. Grazie di cuore.',
      'support.note': '',
    },

    ru: {
      'site.title': 'Зефиро ди Окси — цветы из зефира ручной работы',
      'site.tagline': 'цветы из зефира ручной работы',

      'meta.home.title': 'Зефиро ди Окси — цветы из зефира ручной работы',
      'meta.home.desc': 'Зефиро ди Окси: маленькие букеты из зефира, сделанные вручную, с любовью.',
      'meta.about.title': 'Обо мне — Зефиро ди Окси',
      'meta.about.desc': 'Оксана, которую друзья зовут просто Окси, рассказывает, как родился проект «Зефиро ди Окси».',
      'meta.zefir.title': 'Что такое зефир — Зефиро ди Окси',
      'meta.zefir.desc': 'Зефирная флористика: воздушный десерт, из которого рождаются маленькие цветы.',
      'meta.gallery.title': 'Галерея — Зефиро ди Окси',
      'meta.gallery.desc': 'Сладкие творения Окси: торты, десерты, украшения и цветы из зефира.',
      'meta.contact.title': 'Контакты — Зефиро ди Окси',
      'meta.contact.desc': 'Если вам близки цветы — напишите мне.',
      'meta.404.title': 'Страница не найдена — Зефиро ди Окси',
      'meta.404.desc': 'Страницы, которую вы искали, здесь нет.',
      'error.title': 'Такой страницы нет',
      'error.text': 'Возможно, ссылка устарела или адрес набран вручную. Не переживайте: вернитесь на главную, и начнём сначала.',
      'error.cta_home': 'На главную',
      'error.cta_contact': 'Написать мне',

      'lang.it.label': 'итальянский',
      'lang.ru.label': 'русский',
      'lang.en.label': 'английский',

      'nav.home': 'Главная',
      'nav.about': 'Обо мне',
      'nav.zefir': 'Что такое зефир',
      'nav.gallery': 'Галерея',
      'nav.contact': 'Контакты',

      'home.welcome': 'Добро пожаловать. Это мой маленький сладкий мир.',
      'home.tagline': 'Цветы из зефира — ручная работа, с любовью.',
      'home.scroll': 'дальше',
      'home.image_alt': 'Фото Окси с букетом из зефира в руках (скоро будет)',

      'about.title': 'Обо мне',
      'about.body': 'Я - Оксана, но для друзей просто Окси — именно поэтому мой маленький сладкий мир называется «Зефиро ди Окси». Я всегда любила кондитерский мир: начала ещё ребёнком, наблюдая за бабушкой, которая была шеф-поваром в известном ресторане, — и с тех пор не переставала учиться. Я готовила торты, пироженные, печенье, кростаты, круассаны, ароматные французские булочки, чизкейки и шоколадные десерты, освоила зеркальную глазурь и многое другое. А недавно открыла для себя новое увлечение — зефирную флористику: нежнейший десерт, который не имеет ничего общего с маршмэллоу. Я ещё учусь, посещаю курсы зефирной флористики, дипломная работа будет через несколько месяцев. Но мне уже приятно показать вам мои первые небольшие композиции. Каждый цветок рождается из домашнего фруктового пюре без консервантов, лактозы и глютена, с альбумином и агар-агаром — натуральной альтернативой желатину, которая подходит и вегетарианцам. Пробовала уже работать с несколькими вкусами: яблоко, малина, чёрная смородина, персик, банан, лесная клюква. В ближайшее время появятся груша, вишня, дыня и манго — моя коллекция растёт вместе со мной. В каждой композиции я люблю сочетать цветы разных вкусов, так что каждый букет становится маленьким сюрпризом, который предстоит открыть.',
      'about.family.title': 'Спасибо от всего сердца.',
      'about.family.body': 'Благодарю мою семью, которая каждый день поддерживает меня в моих творческих проектах.',

      'zefir.title': 'Что такое зефир',
      'zefir.info': 'Что такое зефирная флористика? Зефир - это нежнейший десерт родом из Восточной Европы. Он получил своё название в честь древнегреческого бога лёгкого западного ветра Зефира — всё из-за его лёгкой и воздушной текстуры. Из этого съедобного облака рождаются лепестки и цветы. Собранные вручную, один за другим, с любовью, в маленькие сладкие букеты — ими можно любоваться, а потом наслаждаться вкусом.',
      'zefir.romantic': 'Я всегда любила цветы. И мне не встречался человек, которому бы они не нравились. Цветы приносят лёгкость, улыбку, хорошее настроение, говорят то, что порой словами сказать не получается. Они всегда есть у меня дома, даже зимой. И однажды, листая кулинарные сайты с новинками, познакомилась с зефирной флористикой: цветок, помимо того, что красив, можно ещё и скушать. Чтобы создать его из зефира, мало быть кулинаром — нужен ещё взгляд художника, чтобы подобрать цвета, которые говорят друг с другом, рука флориста, чтобы каждая композиция была гармоничной. Три ремесла в одном, чтобы подарить что-то приятное и глазам, и душе.',
      'zefir.gift': 'Букет из зефира — это маленький жест, который может пригодиться для любого случая: подарок на день рождения, предложение руки и сердца, просто для встречи. Сказать «спасибо», сказать «я думаю о тебе», просто сказать «для тебя». Повод не нужен, когда ты хочешь подарить радость.',
      'zefir.gift_title': 'Почему букет из зефира — особенный подарок',
      'zefir.conservation.title': 'Хранение',
      'zefir.conservation.body': 'Цветы из зефира хранятся 10–14 дней в прохладном и сухом месте. Со временем они становятся лишь чуть плотнее, но не теряют вкуса.',
      'zefir.conservation.tip1': '',
      'zefir.conservation.tip2': '',
      'zefir.conservation.tip3': '',

      'flavors.title': 'Вкусы',
      'flavors.intro': 'Каждый букет рождается из того, что есть у меня дома в данный момент: пюре, которое я приготовила, фрукты, которые я выбрала с заботой. Я не беру заказов на конкретные вкусы — мне нравится, когда каждая композиция становится маленьким сюрпризом. Моя коллекция растёт вместе со мной, вкус за вкусом. Пока я хорошо освоила вот эти вкусы:',
      'flavors.mela': 'Яблоко',
      'flavors.mela.desc': 'Нежное, мягкое, обволакивающее — первый цветок, который я научилась делать.',
      'flavors.mela_lampone': 'Яблоко и малина',
      'flavors.mela_lampone.desc': 'Мягкость яблока встречается с живой ноткой малины.',
      'flavors.ribes': 'Чёрная смородина',
      'flavors.ribes.desc': 'Насыщенный, глубокий, тёмного цвета — для тех, кто любит решительные вкусы.',
      'flavors.pesca': 'Персик',
      'flavors.pesca.desc': 'Мягкий и ароматный, пахнет концом лета.',
      'flavors.mirtillo': 'Лесная черника',
      'flavors.mirtillo.desc': 'Чуть терпкая, как в лесу, — для тех, кто ищет характер.',
      'flavors.soon': 'Скоро будут: груша, дыня, манго. Я ещё изучаю их пюре, но они появятся.',
      'flavors.surprise': 'В каждой корзинке я люблю сочетать цветы разных вкусов — так каждая композиция становится маленьким сюрпризом, который предстоит открыть.',

      'gallery.title': 'Галерея',
      'gallery.intro': 'Несколько моих композиций. Каждая фотография — повод рассказать историю одного цветка.',
      'gallery.cap.placeholder': 'фото скоро',
      'gallery.cap.bouquet': 'Маленький букет',
      'gallery.cap.mela': 'Маленький букет — яблоко',
      'gallery.cap.mela_lampone': 'Маленький букет — яблоко и малина',
      'gallery.cap.ribes': 'Маленький букет — чёрная смородина',
      'gallery.cap.pesca': 'Маленький букет — персик',
      'gallery.cap.mirtillo': 'Маленький букет — лесная черника',
      'gallery.cap.pera': 'Маленький букет — груша',
      'gallery.cap.default': 'Маленький букет',

      'gallery.filter.all': 'Все',
      'gallery.filter.myworks': 'Некоторые из моих работ',
      'gallery.filter.zefir': 'Зефир',
      'gallery.filter.torte': 'Торты',
      'gallery.filter.occasioni': 'Поводы',
      'gallery.filter.varie': 'Разное',
      'gallery.filter.count': '{n} фото',
      'gallery.empty': 'В этой категории пока нет фото.',
      'gallery.close': 'Закрыть',
      'gallery.prev': 'Предыдущее фото',
      'gallery.next': 'Следующее фото',
      'gallery.counter': '{current} из {total}',
      'gallery.see_inside': 'Показать внутри',
      'gallery.see_outside': 'Вернуться к торту целиком',

      'contact.title': 'Для души',
      'contact.body': 'Это моё хобби, которое родилось из желания дарить красоту тем, кто мне дорог и кто всегда рядом. Если вы, как и я, восхищаетесь цветами, будь то живые букеты или их нежные съедобные копии, и хотите узнать больше — буду рада общению. zefirodioksi@proton.me',
      'contact.email': 'zefirodioksi@proton.me',
      'contact.note': 'Здесь нет магазина или коммерции, только то, что я создаю своими руками для души и в свободное время.',
      'contact.credit': 'Сайт создан <a href="https://github.com/EliseyRotar" target="_blank" rel="noopener noreferrer">Элисей Ротар</a> · студент Информатики в Дальмине, лицей Маркони',

      'footer.tagline': 'нежные цветы из зефира, ручная работа',
      'footer.disclaimer': 'Любительский сайт, не интернет-магазин',
      'footer.credit.label': 'Сайт сделал',
      'footer.credit.name': 'Elisey Rotar',
      'footer.credit.role': 'студент информатики в Дальмине Маркони',
      'support.title': 'P.S.',
      'support.body': 'Если у вас есть желание поддержать меня в моих начинаниях, буду рада любому участию. Спасибо.',
      'support.note': '',
    },

    en: {
      'site.title': 'Zefiro di Oksi — handmade zefir flowers',
      'site.tagline': 'handmade zefir flowers',

      'meta.home.title': 'Zefiro di Oksi — handmade zefir flowers',
      'meta.home.desc': 'Zefiro di Oksi: handmade zefir flowers, made with love.',
      'meta.about.title': 'About me — Zefiro di Oksi',
      'meta.about.desc': 'Oksana, known as Oksi, tells the story behind Zefiro di Oksi.',
      'meta.zefir.title': 'What is zefir — Zefiro di Oksi',
      'meta.zefir.desc': 'What is zefir floristry: a cloud-like sweet, made by hand.',
      'meta.gallery.title': 'Gallery — Zefiro di Oksi',
      'meta.gallery.desc': 'Oksi\'s sweet creations: cakes, desserts, decorations and zefir flowers.',
      'meta.contact.title': 'Contact — Zefiro di Oksi',
      'meta.contact.desc': 'If you love flowers, you can write to me.',
      'meta.404.title': 'Page not found — Zefiro di Oksi',
      'meta.404.desc': 'The page you are looking for does not exist or has been moved.',
      'error.title': 'This page does not exist',
      'error.text': 'Maybe the link is old, or the address was typed by hand. Do not worry: go back to the home and we will start over from there.',
      'error.cta_home': 'Back to home',
      'error.cta_contact': 'Write to me',

      'lang.it.label': 'Italian',
      'lang.ru.label': 'Russian',
      'lang.en.label': 'English',

      'nav.home': 'Home',
      'nav.about': 'About me',
      'nav.zefir': 'What is zefir',
      'nav.gallery': 'Gallery',
      'nav.contact': 'Contact',

      'home.welcome': 'Welcome. This is my little sweet world.',
      'home.tagline': 'Handmade zefir flowers, with love.',
      'home.scroll': 'scroll',
      'home.image_alt': 'Photo of Oksi holding a zefir bouquet (coming soon)',

      'about.title': 'About me',
      'about.body': 'I\'m Oksana, but to friends I\'m simply Oksi, which is exactly why my little sweet world is called "Zefiro di Oksi." I\'ve always loved the world of pastry-making: I started as a child, watching my grandmother, who was a chef at a well-known restaurant, and I\'ve never stopped learning since. I\'ve made cakes, pastries, cookies, tarts, croissants, fragrant French brioches, cheesecakes and chocolate desserts, and learned mirror glaze techniques and much more. Recently I discovered a new passion: zephyr floristry, a delicate dessert that has nothing to do with marshmallow. I\'m still learning, taking a zephyr floristry course, and my diploma is a few months away. But I\'m already happy to show you my first small arrangements. Every flower is made from homemade fruit purée, free of preservatives, lactose and gluten, with albumin and agar-agar, a natural alternative to gelatin that\'s also suitable for vegetarians. I\'ve already worked with several flavors: apple, raspberry, blackcurrant, peach, banana, wild cranberry. Pear, cherry, melon and mango are coming soon, my collection keeps growing along with me. In every arrangement I love combining flowers of different flavors, so every bouquet becomes a little surprise waiting to be discovered.',
      'about.family.title': 'With all my heart.',
      'about.family.body': 'I thank my family, who support me every day in my creative projects.',

      'zefir.title': 'What is zefir',
      'zefir.info': 'What is zephyr floristry? Zephyr is a delicate dessert originating from Eastern Europe. It got its name in honor of Zephyrus, the ancient Greek god of the gentle west wind, because of its light and airy texture. From this edible cloud, petals and flowers are born. Gathered by hand, one by one, with love, into small sweet bouquets, to be admired and then savored.',
      'zefir.romantic': 'I\'ve always loved flowers. And I\'ve never met a person who didn\'t like them. Flowers bring lightness, a smile, a good mood, they say what words sometimes can\'t. I always have them at home, even in winter. And one day, browsing cooking sites for new ideas, I discovered zephyr floristry: a flower that, besides being beautiful, can also be eaten. To create one out of zephyr, being a pastry maker isn\'t enough, you also need an artist\'s eye, to choose colors that speak to one another, and a florist\'s hand, so that every arrangement is harmonious. Three crafts in one, to give something pleasant to both the eyes and the soul.',
      'zefir.gift': 'A zephyr bouquet is a small gesture that fits any occasion: a birthday gift, a marriage proposal, or just a meeting. To say "thank you," to say "I\'m thinking of you," or simply to say "for you." No reason is needed when you want to give a little joy.',
      'zefir.gift_title': 'Why a zephyr bouquet is a special gift',
      'zefir.conservation.title': 'Storage',
      'zefir.conservation.body': 'Zephyr flowers keep for 10-14 days in a cool, dry place. Over time they become only slightly denser, but don\'t lose their flavor.',
      'zefir.conservation.tip1': '',
      'zefir.conservation.tip2': '',
      'zefir.conservation.tip3': '',

      'flavors.title': 'Flavors',
      'flavors.intro': 'Every bouquet is born from what I have at home in that moment: the purées I prepare, the fruits I choose with care. I do not accept requests for specific flavors — I prefer each composition to be a small surprise. My collection grows along with me, flavor after flavor. For now I have learned to work well with these flavors:',
      'flavors.mela': 'Apple',
      'flavors.mela.desc': 'Sweet, delicate, enveloping: the first flower I learned to make.',
      'flavors.mela_lampone': 'Apple and raspberry',
      'flavors.mela_lampone.desc': 'The softness of apple meets the lively note of raspberry.',
      'flavors.ribes': 'Blackcurrant',
      'flavors.ribes.desc': 'Intense, deep, dark in color: for those who love decisive flavors.',
      'flavors.pesca': 'Peach',
      'flavors.pesca.desc': 'Soft and fragrant, it tastes like late summer.',
      'flavors.mirtillo': 'Wild blueberry',
      'flavors.mirtillo.desc': 'A little tart, as it is in the woods: the favorite of those who seek character.',
      'flavors.soon': 'Coming soon: pear, melon, mango. I am still studying their purées, but they will arrive.',
      'flavors.surprise': 'In every little basket I like to combine flowers of different flavors, so that each composition is also a small surprise to discover.',

      'gallery.title': 'Gallery',
      'gallery.intro': 'A few of my compositions. Each photo is a chance to tell a flower.',
      'gallery.cap.placeholder': 'photo coming',
      'gallery.cap.bouquet': 'Mini bouquet',
      'gallery.cap.mela': 'Mini bouquet — apple',
      'gallery.cap.mela_lampone': 'Mini bouquet — apple and raspberry',
      'gallery.cap.ribes': 'Mini bouquet — blackcurrant',
      'gallery.cap.pesca': 'Mini bouquet — peach',
      'gallery.cap.mirtillo': 'Mini bouquet — wild blueberry',
      'gallery.cap.pera': 'Mini bouquet — pear',
      'gallery.cap.default': 'Mini bouquet',

      'gallery.filter.all': 'All',
      'gallery.filter.myworks': 'Some of my works',
      'gallery.filter.zefir': 'Zefir',
      'gallery.filter.torte': 'Cakes',
      'gallery.filter.occasioni': 'Occasions',
      'gallery.filter.varie': 'Other',
      'gallery.filter.count': '{n} photos',
      'gallery.empty': 'No photos in this category yet.',
      'gallery.close': 'Close',
      'gallery.prev': 'Previous photo',
      'gallery.next': 'Next photo',
      'gallery.counter': '{current} of {total}',
      'gallery.see_inside': 'See inside',
      'gallery.see_outside': 'Back to the whole cake',

      'contact.title': 'For the soul',
      'contact.body': 'This is my hobby, born from a wish to give a little beauty to the people I care about and who are always close to me. If you, like me, are drawn to flowers, whether real bouquets or their delicate edible copies, and would like to know more, I\'d be happy to chat. zefirodioksi@proton.me',
      'contact.email': 'zefirodioksi@proton.me',
      'contact.note': 'There\'s no shop or business here, just what I create by hand, for the soul and in my free time.',
      'contact.credit': 'Site created by <a href="https://github.com/EliseyRotar" target="_blank" rel="noopener noreferrer">Elisey Rotar</a> · Computer Science student @ Dalmine Marconi',

      'footer.tagline': 'handmade zefir flowers, with care',
      'footer.disclaimer': 'Amateur site, not an e-commerce',
      'footer.credit.label': 'Site by',
      'footer.credit.name': 'Elisey Rotar',
      'footer.credit.role': 'computer science student @ Dalmine Marconi',
      'support.title': 'P.S.',
      'support.body': 'If you would like to support me on this journey, I would be grateful for any kind of contribution. Thank you.',
      'support.note': '',
    },
  };

  /* =========================================================
     Logica di gestione lingua
     - Persistenza per il dispositivo: localStorage + cookie
       (cookie fallback per ambienti che cancellano localStorage
       come Safari ITP o navigazione in incognito stretta)
     - Auto-detect dalla lingua del browser (navigator.languages)
     - Mappa it/ru/en con fallback "en" per qualsiasi altra lingua
     - La lingua auto-rilevata viene salvata al primo caricamento,
       cosi' le visite successive partono sempre con quella lingua
       anche se l'utente non ha cliccato nessuna bandierina.
     ========================================================= */

  const SUPPORTED = ['it', 'ru', 'en'];
  const STORAGE_KEY = 'zefiro-lang';
  const COOKIE_KEY = 'zefiro_lang';
  const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 anno

  /* Cookie helpers (no dipendenze) */
  function readCookie(name) {
    try {
      const m = document.cookie.match(
        new RegExp('(?:^|; )' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)')
      );
      return m ? decodeURIComponent(m[1]) : null;
    } catch (_) { return null; }
  }
  function writeCookie(name, value, maxAgeSec) {
    try {
      document.cookie =
        name + '=' + encodeURIComponent(value) +
        '; path=/; max-age=' + maxAgeSec +
        '; SameSite=Lax';
    } catch (_) {}
  }

  /* Estrai la lingua base (es. "it-IT" -> "it") da un tag BCP 47.
     Usa Intl.Locale se disponibile, fallback a parsing manuale. */
  function baseLang(tag) {
    if (!tag) return '';
    try {
      if (typeof Intl !== 'undefined' && Intl.Locale) {
        return new Intl.Locale(String(tag)).language.toLowerCase();
      }
    } catch (_) {}
    return String(tag).toLowerCase().split(/[-_]/)[0];
  }

  /* Restituisce la prima lingua tra i preferiti del browser che sia
     nelle 3 supportate. Se nessuna matcha -> 'en'. */
  function pickFromBrowser() {
    let prefs = [];
    try {
      if (Array.isArray(navigator.languages) && navigator.languages.length) {
        prefs = navigator.languages;
      } else if (navigator.language) {
        prefs = [navigator.language];
      } else if (navigator.userLanguage) {
        prefs = [navigator.userLanguage];
      }
    } catch (_) {}
    for (const raw of prefs) {
      const lang = baseLang(raw);
      if (SUPPORTED.includes(lang)) return lang;
    }
    return 'en';
  }

  function detectInitial() {
    /* 1) localStorage ha la priorita' (esplicito utente) */
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.includes(saved)) return saved;
    } catch (_) {}

    /* 2) cookie come fallback aggiuntivo */
    const fromCookie = readCookie(COOKIE_KEY);
    if (fromCookie && SUPPORTED.includes(fromCookie)) {
      /* Ripristina anche in localStorage per coerenza */
      try { localStorage.setItem(STORAGE_KEY, fromCookie); } catch (_) {}
      return fromCookie;
    }

    /* 3) auto-detect dal browser */
    const detected = pickFromBrowser();
    /* Salva subito la lingua rilevata cosi' l'utente non deve
       cliccare la bandierina al primo accesso. */
    try { localStorage.setItem(STORAGE_KEY, detected); } catch (_) {}
    writeCookie(COOKIE_KEY, detected, COOKIE_MAX_AGE);
    return detected;
  }

  let current = detectInitial();
  /* Assicurati che anche il cookie sia sincronizzato al boot. */
  writeCookie(COOKIE_KEY, current, COOKIE_MAX_AGE);

  function get(key) {
    const dict = DICT[current] || DICT.it;
    return (key in dict) ? dict[key] : (DICT.it[key] || key);
  }

  function t(key) { return get(key); }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    current = lang;
    /* Salva sia in localStorage che come cookie, in modo che la
       scelta dell'utente resti persistente anche in incognito
       stretta o dopo pulizia del localStorage. */
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
    writeCookie(COOKIE_KEY, lang, COOKIE_MAX_AGE);
    applyAll();
    document.dispatchEvent(new CustomEvent('zefiro:langchange', { detail: { lang } }));
  }

  function getLang() { return current; }

  function applyAll(root) {
    const scope = root || document;

    // data-i18n -> testo semplice
    scope.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const attr = el.getAttribute('data-i18n-attr'); // opzionale: imposta attributo invece di textContent
      const value = get(key);
      if (attr) {
        el.setAttribute(attr, value);
      } else {
        if (el.tagName === 'TITLE') {
          document.title = value;
        } else {
          el.textContent = value;
          /* Se la traduzione e' vuota, nascondi l'elemento (utile per
             support.note che ora e' stringa vuota) */
          if (value === '' && el.hasAttribute('data-content')) {
            el.hidden = true;
          }
        }
      }
    });

    // data-i18n-html -> innerHTML (per il corsivo dentro i testi)
    scope.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      el.innerHTML = get(key);
    });

    // href delle bandierine: attiva/disattiva
    scope.querySelectorAll('[data-lang-switch]').forEach(btn => {
      const lang = btn.getAttribute('data-lang-switch');
      btn.classList.toggle('is-active', lang === current);
      btn.setAttribute('aria-pressed', lang === current ? 'true' : 'false');
    });

    // <html lang="...">
    document.documentElement.setAttribute('lang', current);

    // Nav attiva (gia' gestita in HTML con aria-current, qui niente da fare)
  }

  /* API pubblica */
  window.I18N = {
    t,
    get,
    setLang,
    getLang,
    applyAll,
    SUPPORTED,
    DICT,
  };

  /* Applica automaticamente al DOMContentLoaded */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => applyAll());
  } else {
    applyAll();
  }

})(window);
