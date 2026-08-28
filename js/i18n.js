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
      'meta.home.desc': 'Zefiro di Oksi: fiori di zefir fatti a mano, con amore, gusto dopo gusto.',
      'meta.about.title': 'Chi sono — Zefiro di Oksi',
      'meta.about.desc': 'Oksana, in arte Oksi, racconta come è nato Zefiro di Oksi.',
      'meta.zefir.title': 'Cos\'è lo zefir — Zefiro di Oksi',
      'meta.zefir.desc': 'Cos\'è la fioristica di zefir: un dolce sofficissimo fatto a mano.',
      'meta.flavors.title': 'Gusti — Zefiro di Oksi',
      'meta.flavors.desc': 'I gusti dei fiori di zefir fatti a mano.',
      'meta.gallery.title': 'Galleria — Zefiro di Oksi',
      'meta.gallery.desc': 'Alcuni dei miei mini bouquet di fiori di zefir.',
      'meta.contact.title': 'Contatti — Zefiro di Oksi',
      'meta.contact.desc': 'Se ami i fiori, puoi scrivermi.',

      'lang.it.label': 'Italiano',
      'lang.ru.label': 'Russo',
      'lang.en.label': 'Inglese',

      'nav.home': 'Home',
      'nav.about': 'Chi sono',
      'nav.zefir': 'Cos\'è lo zefir',
      'nav.flavors': 'Gusti',
      'nav.gallery': 'Galleria',
      'nav.contact': 'Contatti',

      'home.welcome': 'Benvenuta, benvenuto. Questo è il mio piccolo mondo dolce.',
      'home.tagline': 'Fiori di zefir fatti a mano, con amore, gusto dopo gusto.',
      'home.scroll': 'scorri',

      'about.title': 'Chi sono',
      'about.body': 'Mi chiamo Oksana, ma per gli amici sono semplicemente Oksi, ed è per questo che il mio piccolo mondo dolce si chiama Zefiro di Oksi. Da sempre amo il mondo della pasticceria: ho iniziato da bambina, guardando mia nonna, che era chef in un ristorante rinomato, e da allora non ho più smesso. Negli anni ho preparato torte, glasse a specchio, cheesecake e dolci al cioccolato, ma di recente ho scoperto una nuova passione: la fioristica di zefir, un dolce sofficissimo che non ha nulla a che vedere con il marshmallow. Sto ancora imparando, frequento una scuola dedicata e il diploma arriverà tra qualche mese, ma sono già felice di mostrarvi le mie prime piccole composizioni. Ogni fiore nasce da purea di frutta fatta in casa, completamente a mano, con albumina e agar-agar, un\'alternativa sicura e naturale alla gelatina, adatta anche a chi è vegetariano: niente conservanti, lattosio o glutine. I gusti sono già tanti: mela, mela-lampone, ribes nero, pesca, un mirtillo selvatico un po\' aspro, e presto arriveranno pera, melone e mango, la mia collezione cresce insieme a me. In ogni cestino amo unire fiori di gusti diversi, così ogni composizione è anche una piccola sorpresa da scoprire.',
      'about.family': 'Voglio ringraziare con tutto il cuore la mia famiglia, che mi sostiene sempre nei miei progetti creativi, con il cuore e con le mani, ogni giorno.',

      'zefir.title': 'Cos\'è lo zefir',
      'zefir.info': 'Cos\'è la fioristica di zefir? Il zefir è un dolce sofficissimo originario dell\'Europa dell\'Est, fatto con purea di frutta fatta in casa, albumina e agar-agar (adatto anche ai vegetariani), non gelatina: non è un marshmallow. Con questa nuvola commestibile nascono petali e fiori, uniti a mano, uno per uno, con amore, in piccoli bouquet dolci da ammirare e poi gustare. Niente conservanti, lattosio o glutine: solo ingredienti naturali. Si conserva 10-14 giorni in un luogo fresco e asciutto; con il tempo diventa solo leggermente più corposo, senza perdere bontà.',
      'zefir.romantic': 'Ho sempre amato i fiori. Non ho mai incontrato una persona a cui non piacessero: portano leggerezza, portano un sorriso, dicono cose che a volte le parole non riescono a dire. A casa mia i fiori non mancano mai, nemmeno in inverno. Un giorno ho pensato: e se un fiore, oltre a essere bello, potesse anche essere gustato? Da questa idea è nato il zefir fiorito: una nuvola commestibile che si trasforma, petalo dopo petalo, in un piccolo bouquet. Creare un fiore di zefir non basta saperlo cucinare: bisogna anche avere occhio da artista, per scegliere colori che si parlino tra loro, e mano da fiorista, per dare armonia a ogni composizione. Tre arti in una, per regalare qualcosa di dolce agli occhi e al cuore, prima ancora che al palato.',
      'zefir.gift': 'Un bouquet di zefir è il piccolo gesto che parla da solo: per un compleanno, per una proposta, per chi ama i fiori, per chi ama i dolci, per chi ama entrambi. Per dire grazie, per dire ti penso, per dire semplicemente "per te". Non serve un\'occasione: a volte il pensiero più bello è quello che arriva senza motivo.',
      'zefir.gift_title': 'Perché un bouquet di zefir è un pensiero speciale',
      'zefir.conservation.title': 'Come si conserva',
      'zefir.conservation.body': 'I fiori di zefir si conservano 10-14 giorni in un luogo fresco e asciutto. Con il tempo diventano solo leggermente più corposi, senza perdere bontà.',
      'zefir.conservation.tip1': 'Tienili lontano dalla luce diretta del sole.',
      'zefir.conservation.tip2': 'Evita ambienti umidi: la cucina dopo aver cucinato non è l\'ideale.',
      'zefir.conservation.tip3': 'Non riporli in frigorifero: lo zefir è più felice fuori.',
      'zefir.conservation.tip4': 'Se devi regalarli, avvolgili in carta leggera, senza plastica.',

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

      'contact.title': 'Un piccolo pensiero',
      'contact.body': 'Questo è il mio hobby, nato per condividere qualcosa di bello con chi mi sta vicino. Se anche tu ami i fiori — quelli veri o quelli da gustare — e vuoi saperne di più, puoi scrivermi.',
      'contact.email': 'zefirodioksi@proton.me',
      'contact.note': 'Nessun negozio, nessun carrello: solo gesti fatti a mano, nel mio tempo libero.',

      'footer.tagline': 'un hobby fatto a mano, con cura',
      'footer.disclaimer': 'Sito amatoriale, non un e-commerce',
    },

    ru: {
      'site.title': 'Зефиро ди Окси — цветы из зефира ручной работы',
      'site.tagline': 'цветы из зефира ручной работы',

      'meta.home.title': 'Зефиро ди Окси — цветы из зефира ручной работы',
      'meta.home.desc': 'Зефиро ди Окси: цветы из зефира, сделанные вручную, с любовью, вкус за вкусом.',
      'meta.about.title': 'Обо мне — Зефиро ди Окси',
      'meta.about.desc': 'Оксана, она же Окси, рассказывает, как родился проект Зефиро ди Окси.',
      'meta.zefir.title': 'Что такое зефир — Зефиро ди Окси',
      'meta.zefir.desc': 'Что такое зефирная флористика: нежнейший десерт ручной работы.',
      'meta.flavors.title': 'Вкусы — Зефиро ди Окси',
      'meta.flavors.desc': 'Вкусы цветов из зефира ручной работы.',
      'meta.gallery.title': 'Галерея — Зефиро ди Окси',
      'meta.gallery.desc': 'Несколько моих мини-букетов из зефира.',
      'meta.contact.title': 'Контакты — Зефиро ди Окси',
      'meta.contact.desc': 'Если вы любите цветы, вы можете мне написать.',

      'lang.it.label': 'Итальянский',
      'lang.ru.label': 'Русский',
      'lang.en.label': 'Английский',

      'nav.home': 'Главная',
      'nav.about': 'Обо мне',
      'nav.zefir': 'Что такое зефир',
      'nav.flavors': 'Вкусы',
      'nav.gallery': 'Галерея',
      'nav.contact': 'Контакты',

      'home.welcome': 'Добро пожаловать. Это мой маленький сладкий мир.',
      'home.tagline': 'Цветы из зефира, сделанные вручную, с любовью, вкус за вкусом.',
      'home.scroll': 'прокрутить',

      'about.title': 'Обо мне',
      'about.body': 'Меня зовут Оксана, но для друзей я просто Окси — именно поэтому мой маленький сладкий мир называется «Зефиро ди Окси». Я всегда любила мир кондитерского дела: начала ещё ребёнком, наблюдая за бабушкой, которая была шеф-поваром в известном ресторане, — и с тех пор не останавливалась. За эти годы я готовила торты, зеркальную глазурь, чизкейки и шоколадные десерты, но недавно открыла для себя новое увлечение — зефирную флористику, нежнейший десерт, который не имеет ничего общего с маршмэллоу. Я всё ещё учусь, посещаю specialized школу, и диплом будет через несколько месяцев, но мне уже приятно показать вам мои первые небольшие композиции. Каждый цветок рождается из домашнего пюре из фруктов, полностью вручную, с альбумином и агар-агаром — безопасной и натуральной альтернативой желатину, которая подходит и вегетарианцам: без консервантов, лактозы и глютена. Вкусов уже много: яблоко, яблоко-малина, чёрная смородина, персик, чуть кисловая дикая черника, а скоро появятся груша, дыня и манго — моя коллекция растёт вместе со мной. В каждой корзинке я люблю сочетать цветы разных вкусов, так что каждая композиция становится маленьким сюрпризом, который предстоит открыть.',
      'about.family': 'Хочу от всего сердца поблагодарить мою семью, которая всегда поддерживает меня в моих творческих начинаниях — и морально, и физически, каждый день.',

      'zefir.title': 'Что такое зефир',
      'zefir.info': 'Что такое зефирная флористика? Зефир — это нежнейший десерт родом из Восточной Европы, приготовленный из домашнего фруктового пюре, альбумина и агар-агара (подходит и вегетарианцам), а не желатина: это не маршмэллоу. Из этого съедобного облака рождаются лепестки и цветы, собранные вручную, один за другим, с любовью, в маленькие сладкие букеты — ими можно любоваться, а потом наслаждаться ими на вкус. Без консервантов, лактозы и глютена: только натуральные ингредиенты. Хранится 10–14 дней в прохладном и сухом месте; со временем становится лишь чуть плотнее, не теряя вкуса.',
      'zefir.romantic': 'Я всегда любила цветы. Мне не встречался человек, которому бы они не нравились: они приносят лёгкость, приносят улыбку, говорят то, что порой словами сказать не получается. У меня дома цветы есть всегда, даже зимой. Однажды я подумала: а что если цветок, помимо того что красив, можно ещё и съесть? Так родился цветочный зефир: съедобное облачко, которое превращается, лепесток за лепестком, в маленький букет. Чтобы создать цветок из зефира, мало уметь его готовить — нужен ещё взгляд художника, чтобы подобрать цвета, которые говорят друг с другом, и рука флориста, чтобы каждая композиция была гармоничной. Три ремесла в одном, чтобы подарить что-то сладенькое и глазам, и сердцу — раньше, чем нёбу.',
      'zefir.gift': 'Букет из зефира — это маленький жест, который говорит сам за себя: на день рождения, для предложения, для тех, кто любит цветы, для тех, кто любит сладости, для тех, кто любит и то, и другое. Сказать «спасибо», сказать «я думаю о тебе», просто сказать «для тебя». Повод не нужен: иногда самые красивые мысли приходят без причины.',
      'zefir.gift_title': 'Почему букет из зефира — особенный подарок',
      'zefir.conservation.title': 'Как хранить',
      'zefir.conservation.body': 'Цветы из зефира хранятся 10–14 дней в прохладном и сухом месте. Со временем они становятся лишь чуть плотнее, не теряя вкуса.',
      'zefir.conservation.tip1': 'Держите их подальше от прямых солнечных лучей.',
      'zefir.conservation.tip2': 'Избегайте влажных мест: кухня после готовки — не лучшее место.',
      'zefir.conservation.tip3': 'Не убирайте их в холодильник: зефир счастливее вне его.',
      'zefir.conservation.tip4': 'Если хотите подарить — оберните в тонкую бумагу, без пластика.',

      'flavors.title': 'Вкусы',
      'flavors.intro': 'Каждый букет рождается из того, что есть у меня дома в данный момент: пюре, которые я готовлю, фрукты, которые я выбираю с заботой. Я не принимаю заказов на конкретные вкусы — мне нравится, когда каждая композиция становится маленьким сюрпризом. Моя коллекция растёт вместе со мной, вкус за вкусом. Пока я научилась хорошо работать с этими вкусами:',
      'flavors.mela': 'Яблоко',
      'flavors.mela.desc': 'Сладкое, нежное, обволакивающее: первый цветок, который я научилась делать.',
      'flavors.mela_lampone': 'Яблоко и малина',
      'flavors.mela_lampone.desc': 'Мягкость яблока встречается с живой ноткой малины.',
      'flavors.ribes': 'Чёрная смородина',
      'flavors.ribes.desc': 'Насыщенный, глубокий, тёмного цвета: для тех, кто любит решительные вкусы.',
      'flavors.pesca': 'Персик',
      'flavors.pesca.desc': 'Мягкий и ароматный, пахнет концом лета.',
      'flavors.mirtillo': 'Дикая черника',
      'flavors.mirtillo.desc': 'Чуть кисловатая, как в лесу: любимая теми, кто ищет характер.',
      'flavors.soon': 'Скоро: груша, дыня, манго. Я ещё изучаю их пюре, но они появятся.',
      'flavors.surprise': 'В каждой корзинке я люблю сочетать цветы разных вкусов, так что каждая композиция становится маленьким сюрпризом, который предстоит открыть.',

      'gallery.title': 'Галерея',
      'gallery.intro': 'Несколько моих композиций. Каждая фотография — повод рассказать о цветке.',
      'gallery.cap.placeholder': 'фото скоро',
      'gallery.cap.bouquet': 'Мини-букет',
      'gallery.cap.mela': 'Мини-букет — яблоко',
      'gallery.cap.mela_lampone': 'Мини-букет — яблоко и малина',
      'gallery.cap.ribes': 'Мини-букет — чёрная смородина',
      'gallery.cap.pesca': 'Мини-букет — персик',
      'gallery.cap.mirtillo': 'Мини-букет — дикая черника',
      'gallery.cap.pera': 'Мини-букет — груша',
      'gallery.cap.default': 'Мини-букет',

      'contact.title': 'Маленькая мысль',
      'contact.body': 'Это моё хобби, рождённое, чтобы делиться чем-то красивым с теми, кто рядом. Если и вы любите цветы — настоящие или те, что можно съесть — и хотите узнать больше, вы можете мне написать.',
      'contact.email': 'zefirodioksi@proton.me',
      'contact.note': 'Никакого магазина, никакой корзины: только жесты, сделанные вручную, в свободное время.',

      'footer.tagline': 'хобби, сделанное вручную, с заботой',
      'footer.disclaimer': 'Любительский сайт, не интернет-магазин',
    },

    en: {
      'site.title': 'Zefiro di Oksi — handmade zefir flowers',
      'site.tagline': 'handmade zefir flowers',

      'meta.home.title': 'Zefiro di Oksi — handmade zefir flowers',
      'meta.home.desc': 'Zefiro di Oksi: handmade zefir flowers, with love, flavor after flavor.',
      'meta.about.title': 'About me — Zefiro di Oksi',
      'meta.about.desc': 'Oksana, known as Oksi, tells the story behind Zefiro di Oksi.',
      'meta.zefir.title': 'What is zefir — Zefiro di Oksi',
      'meta.zefir.desc': 'What is zefir floristry: a cloud-like sweet, made by hand.',
      'meta.flavors.title': 'Flavors — Zefiro di Oksi',
      'meta.flavors.desc': 'The flavors of handmade zefir flowers.',
      'meta.gallery.title': 'Gallery — Zefiro di Oksi',
      'meta.gallery.desc': 'A few of my mini zefir bouquets.',
      'meta.contact.title': 'Contact — Zefiro di Oksi',
      'meta.contact.desc': 'If you love flowers, you can write to me.',

      'lang.it.label': 'Italian',
      'lang.ru.label': 'Russian',
      'lang.en.label': 'English',

      'nav.home': 'Home',
      'nav.about': 'About me',
      'nav.zefir': 'What is zefir',
      'nav.flavors': 'Flavors',
      'nav.gallery': 'Gallery',
      'nav.contact': 'Contact',

      'home.welcome': 'Welcome. This is my little sweet world.',
      'home.tagline': 'Handmade zefir flowers, with love, flavor after flavor.',
      'home.scroll': 'scroll',

      'about.title': 'About me',
      'about.body': 'My name is Oksana, but to my friends I am simply Oksi — that is why my little sweet world is called Zefiro di Oksi. I have always loved the world of pastry: I started as a child, watching my grandmother, who was a chef in a renowned restaurant, and I have never stopped since. Over the years I have made cakes, mirror glazes, cheesecakes and chocolate desserts, but recently I discovered a new passion: zefir floristry, a cloud-like sweet that has nothing to do with marshmallows. I am still learning, I attend a dedicated school and my diploma will come in a few months, but I am already happy to show you my first little compositions. Every flower is born from homemade fruit purée, completely by hand, with egg white and agar-agar — a safe and natural alternative to gelatine, also suitable for vegetarians: no preservatives, no lactose, no gluten. There are already many flavors: apple, apple-raspberry, blackcurrant, peach, a slightly tart wild blueberry, and soon pear, melon and mango will arrive, my collection growing along with me. In every little basket I like to combine flowers of different flavors, so that each composition is also a small surprise to discover.',
      'about.family': 'I want to thank with all my heart my family, who always supports me in my creative projects — with heart and with hands, every day.',

      'zefir.title': 'What is zefir',
      'zefir.info': 'What is zefir floristry? Zefir is a cloud-like sweet that originated in Eastern Europe, made from homemade fruit purée, egg white and agar-agar (also suitable for vegetarians), not gelatine: it is not a marshmallow. From this edible cloud come petals and flowers, assembled by hand, one by one, with love, into small sweet bouquets to admire and then taste. No preservatives, no lactose, no gluten: only natural ingredients. It keeps for 10–14 days in a cool, dry place; with time it becomes only slightly denser, without losing its flavor.',
      'zefir.romantic': 'I have always loved flowers. I have never met a person who did not like them: they bring lightness, they bring a smile, they say things that sometimes words cannot say. In my home flowers are never missing, even in winter. One day I thought: what if a flower, besides being beautiful, could also be tasted? From that idea came flowered zefir: an edible cloud that turns, petal after petal, into a small bouquet. To create a zefir flower it is not enough to know how to cook it: you also need the eye of an artist, to choose colors that speak to each other, and the hand of a florist, to give harmony to every composition. Three arts in one, to give something sweet to the eyes and to the heart, before even to the palate.',
      'zefir.gift': 'A zefir bouquet is the small gesture that speaks for itself: for a birthday, for a proposal, for those who love flowers, for those who love sweets, for those who love both. To say thank you, to say I am thinking of you, to simply say "for you". No occasion is needed: sometimes the most beautiful thought is the one that arrives for no reason.',
      'zefir.gift_title': 'Why a zefir bouquet is a special thought',
      'zefir.conservation.title': 'How to store',
      'zefir.conservation.body': 'Zefir flowers keep for 10–14 days in a cool, dry place. With time they only become slightly denser, without losing their flavor.',
      'zefir.conservation.tip1': 'Keep them away from direct sunlight.',
      'zefir.conservation.tip2': 'Avoid humid places: a kitchen right after cooking is not ideal.',
      'zefir.conservation.tip3': 'Do not store them in the fridge: zefir is happier outside it.',
      'zefir.conservation.tip4': 'If you want to gift them, wrap them in light paper, without plastic.',

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

      'contact.title': 'A small thought',
      'contact.body': 'This is my hobby, born to share something beautiful with those close to me. If you too love flowers — real ones or those to taste — and want to know more, you can write to me.',
      'contact.email': 'zefirodioksi@proton.me',
      'contact.note': 'No shop, no cart: only gestures made by hand, in my free time.',

      'footer.tagline': 'a hobby made by hand, with care',
      'footer.disclaimer': 'Amateur site, not an e-commerce',
    },
  };

  /* =========================================================
     Logica di gestione lingua
     ========================================================= */

  const SUPPORTED = ['it', 'ru', 'en'];
  const STORAGE_KEY = 'zefiro-lang';

  function detectInitial() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.includes(saved)) return saved;
    } catch (_) {}
    const nav = (navigator.language || navigator.userLanguage || 'it').toLowerCase();
    if (nav.startsWith('ru')) return 'ru';
    if (nav.startsWith('en')) return 'en';
    return 'it';
  }

  let current = detectInitial();

  function get(key) {
    const dict = DICT[current] || DICT.it;
    return (key in dict) ? dict[key] : (DICT.it[key] || key);
  }

  function t(key) { return get(key); }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    current = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
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
  global.I18N = {
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
