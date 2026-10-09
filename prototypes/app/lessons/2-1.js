/* Lesson 2.1 in the Lesson Player, rebuilt (13 screens): see → something catches the eye → look closer → begin an
   artwork → create → Repeat appears → Size, Direction and Spacing together → notice what emerged → develop it.
   The lesson's details (number, title, unit, time) come from the site's lesson (data, through the "guide" adapter);
   the words, images and artworks of each screen are here: title and text the player's words; gallery: one of the
   lesson's galleries (one large image at a time, previous / next); focus: the image of a gallery looked at last,
   large; pair: two galleries' last ones side by side; thumbs: small images to look again; more: links to artists to
   discover outside the lesson (a new tab).
   One artwork through the lesson. Screen 8 chooses paper or the Studio (and, for the Studio, opens it at once); from
   screen 9 the two ways differ (paper / studio). A "studio" screen is the Studio itself: arriving at it opens the
   artwork there, and the Studio comes back to the screen after it (going back, it is passed over).
   Studio activities (studio/activities.js): 2-1-begin (drawing only), 2-1-play (Repeat appears, then Size, Direction
   and Spacing together), 2-1-develop (the same, no new Repeat), 2-1-free (the same, for "Keep creating" and My
   artworks). The earlier activities of 2.1 stay for works made with them. */
window.APP_LESSONS = window.APP_LESSONS || {};
window.APP_LESSONS['2-1'] = {
  data: '../../data/lesson-pages/lesson-2-1-learner.js',
  adapter: 'guide',
  unit: 'unit02',
  langs: ['he', 'en'],
  artworkActivity: '2-1-free',   // the Studio activity "My artworks" opens an artwork of this lesson in (never its last one)
  wordsFirst: true,              // a screen with images: its words (its question) first, then the images (js/player.js)
  /* the three galleries (one large image at a time; js/player.js): an image of the site (images/editorial/<name>) or
     of the app (images/2-1/<name>), with img null a placeholder where an image not cleared for use will be.
     Where each image comes from and its licence: images/2-1/SOURCES.md. Artists whose works may not be shown here
     (Kusama, Delaunay) are links on screen 6 (more) */
  galleries: {
    nature: [
      { img: 'images/2-1/nature-leaf-veins', size: [1600, 900], alt: { he: 'עורקים של עלה ירוק, מקרוב', en: 'The veins of a green leaf, close up' } },
      { img: 'images/2-1/nature-oak-bark', size: [1200, 1600], alt: { he: 'קליפה של עץ אלון', en: 'The bark of an oak tree' } },
      { img: 'images/2-1/nature-sunflower', size: [1600, 1200], alt: { he: 'מרכז של פרח חמנייה', en: 'The centre of a sunflower' } },
      { img: 'images/2-1/nature-shell', size: [1315, 1600], alt: { he: 'צדף מסולסל על החול', en: 'A spiral shell on the sand' } },
      { img: 'images/2-1/nature-feather', size: [1600, 1200], alt: { he: 'נוצה של ברווז, מקרוב', en: 'A duck feather, close up' } },
      { img: 'blossfeldt-adiantum-pedatum-1928', size: [1241, 1600], artist: { he: 'קרל בלוספלדט', en: 'Karl Blossfeldt' }, workTitle: { he: 'Adiantum pedatum, 1928', en: 'Adiantum pedatum, 1928' },
        alt: { he: 'קרל בלוספלדט, Adiantum pedatum, 1928', en: 'Karl Blossfeldt, Adiantum pedatum, 1928' } }
    ],
    morris: [
      { img: 'morris-strawberry-thief-aic', size: [794, 1800], artist: { he: 'ויליאם מוריס', en: 'William Morris' }, workTitle: { he: 'גנב התותים, 1883', en: 'Strawberry Thief, 1883' },
        alt: { he: 'ויליאם מוריס, גנב התותים, 1883', en: 'William Morris, Strawberry Thief, 1883' } },
      { img: 'images/2-1/morris-willow-bough-1887', size: [1237, 1600], artist: { he: 'ויליאם מוריס', en: 'William Morris' }, workTitle: { he: 'Willow Bough, 1887', en: 'Willow Bough, 1887' },
        alt: { he: 'ויליאם מוריס, Willow Bough, 1887', en: 'William Morris, Willow Bough, 1887' } },
      { img: 'images/2-1/morris-acanthus-velveteen-1876', size: [970, 1468], artist: { he: 'ויליאם מוריס', en: 'William Morris' }, workTitle: { he: 'Acanthus, 1876', en: 'Acanthus, 1876' },
        alt: { he: 'ויליאם מוריס, Acanthus, 1876', en: 'William Morris, Acanthus, 1876' } },
      { img: 'images/2-1/morris-trellis-1862', size: [1273, 1600], artist: { he: 'ויליאם מוריס', en: 'William Morris' }, workTitle: { he: 'Trellis, 1862', en: 'Trellis, 1862' },
        alt: { he: 'ויליאם מוריס, Trellis, 1862', en: 'William Morris, Trellis, 1862' } },
      { img: 'images/2-1/morris-pimpernel-1876', size: [936, 1600], artist: { he: 'ויליאם מוריס', en: 'William Morris' }, workTitle: { he: 'Pimpernel, 1876', en: 'Pimpernel, 1876' },
        alt: { he: 'ויליאם מוריס, Pimpernel, 1876', en: 'William Morris, Pimpernel, 1876' } },
      { img: 'images/2-1/morris-african-marigold-1876', size: [1600, 799], artist: { he: 'ויליאם מוריס', en: 'William Morris' }, workTitle: { he: 'African Marigold, 1876', en: 'African Marigold, 1876' },
        alt: { he: 'ויליאם מוריס, African Marigold, 1876', en: 'William Morris, African Marigold, 1876' } }
    ],
    /* Sophie Taeuber-Arp (1889–1943): a rule (a grid, rows, columns) and where it changes (size, direction, spacing,
       colour). credit: the photographer and licence each photograph asks to be named with */
    taeuber: [
      { img: 'images/2-1/taeuber-circle-picture-1933', size: [1600, 975], artist: { he: 'סופי טויבר-ארפ', en: 'Sophie Taeuber-Arp' }, workTitle: { he: 'Circle Picture, 1933', en: 'Circle Picture, 1933' },
        alt: { he: 'סופי טויבר-ארפ, Circle Picture, 1933', en: 'Sophie Taeuber-Arp, Circle Picture, 1933' },
        credit: { who: 'Paradise Chronicle', licence: 'CC BY-SA 4.0', href: 'https://commons.wikimedia.org/wiki/File:Kreisbild,_1933_Sophie_Taeuber-Arp.jpg' } },
      { img: 'images/2-1/taeuber-cercles-a-bras-1930', size: [1280, 1462], artist: { he: 'סופי טויבר-ארפ', en: 'Sophie Taeuber-Arp' }, workTitle: { he: 'Composition à cercles-à-bras et rectangles, 1930', en: 'Composition à cercles-à-bras et rectangles, 1930' },
        alt: { he: 'סופי טויבר-ארפ, Composition à cercles-à-bras et rectangles, 1930', en: 'Sophie Taeuber-Arp, Composition à cercles-à-bras et rectangles, 1930' },
        credit: { who: 'Sailko', licence: 'CC BY 3.0', href: 'https://commons.wikimedia.org/wiki/File:Sophie_taeuber-arp,_composizione_con_cerchi_a_mano_e_rettangoli,_1930.JPG' } },
      { img: 'images/2-1/taeuber-animated-circle-picture-1935', size: [1600, 1234], artist: { he: 'סופי טויבר-ארפ', en: 'Sophie Taeuber-Arp' }, workTitle: { he: 'Animated Circle Picture, 1935', en: 'Animated Circle Picture, 1935' },
        alt: { he: 'סופי טויבר-ארפ, Animated Circle Picture, 1935', en: 'Sophie Taeuber-Arp, Animated Circle Picture, 1935' },
        credit: { who: 'Paradise Chronicle', licence: 'CC BY-SA 4.0', href: 'https://commons.wikimedia.org/wiki/File:Bewegtes_Kreisbild_1935,_Sophie_Taeuber-Arp.jpg' } },
      { img: 'images/2-1/taeuber-bewegtes-kreisbild-1934', size: [1600, 1133], artist: { he: 'סופי טויבר-ארפ', en: 'Sophie Taeuber-Arp' }, workTitle: { he: 'Bewegtes Kreisbild, 1934', en: 'Bewegtes Kreisbild, 1934' },
        alt: { he: 'סופי טויבר-ארפ, Bewegtes Kreisbild, 1934', en: 'Sophie Taeuber-Arp, Bewegtes Kreisbild, 1934' },
        credit: { who: 'Paradise Chronicle', licence: 'CC BY-SA 4.0', href: 'https://commons.wikimedia.org/wiki/File:Animated_circle_figure_(1934)-_Sophie_Taeuber-Arp.jpg' } },
      { img: 'images/2-1/taeuber-douze-espaces-1939', size: [1600, 1105], artist: { he: 'סופי טויבר-ארפ', en: 'Sophie Taeuber-Arp' }, workTitle: { he: 'Douze Espaces à plans, bandes angulaires et pavés de cercles, 1939', en: 'Douze Espaces à plans, bandes angulaires et pavés de cercles, 1939' },
        alt: { he: 'סופי טויבר-ארפ, Douze Espaces à plans, bandes angulaires et pavés de cercles, 1939', en: 'Sophie Taeuber-Arp, Douze Espaces à plans, bandes angulaires et pavés de cercles, 1939' },
        credit: { who: 'Paradise Chronicle', licence: 'CC BY-SA 4.0', href: 'https://commons.wikimedia.org/wiki/File:Zw%C3%B6lf_R%C3%A4ume_mit_Fl%C3%A4chen,_eckigen_B%C3%A4ndern_und_mit_Kreisen_gepflastert_(1939)_Sophie_Taeuber-Arp_(Kunsthaus_Z%C3%BCrich).jpg' } },
      { img: 'images/2-1/taeuber-tapisserie-dada-1916', size: [1242, 1253], artist: { he: 'סופי טויבר-ארפ', en: 'Sophie Taeuber-Arp' }, workTitle: { he: "Tapisserie Dada, Composition à triangles, rectangles et parties d'anneaux, 1916", en: "Tapisserie Dada, Composition à triangles, rectangles et parties d'anneaux, 1916" },
        alt: { he: "סופי טויבר-ארפ, Tapisserie Dada, Composition à triangles, rectangles et parties d'anneaux, 1916", en: "Sophie Taeuber-Arp, Tapisserie Dada, Composition à triangles, rectangles et parties d'anneaux, 1916" },
        credit: { who: 'Sailko', licence: null, href: 'https://commons.wikimedia.org/wiki/File:Sophie_taeuber-arp,_tappezzeria_dada,_composizione_con_triangoli,_rettangoli_e_parti_di_anelli,_1920.JPG' } }
    ]
  },
  actions: {
    seeWhat: { he: 'לראות מה קורה', en: 'See what happens' },
    keepCreating: { he: 'להמשיך ליצור', en: 'Keep creating' },
    doneForNow: { he: 'סיימתי לעכשיו', en: "I'm done for now" },
    anotherTime: { he: 'להמשיך בפעם אחרת', en: 'Come back to it later' }
  },
  screens: [
    /* 1 */ { title: { he: 'מה אתם מגלים שחוזר כאן?', en: 'What do you notice repeating here?' },
              gallery: 'nature' },
    /* 2 */ { focus: 'nature',   // the image of screen 1 looked at last, large
              text: { he: ['מה בדיוק חוזר?<br>האם הוא חוזר תמיד באותה צורה?'], en: ['What exactly repeats?<br>Does it always repeat in exactly the same way?'] } },
    /* 3 */ { text: { he: ['החלק שחוזר נקרא יחידה.<br>הדרך שבה הוא חוזר יוצרת את הדפוס.'], en: ['The part that repeats is called a unit.<br>The way it repeats creates the pattern.'] } },
    /* 4 */ { gallery: 'morris',
              text: { he: ['מה חוזר כאן?<br>ומה קורה לחלק כשהוא חוזר שוב ושוב?'], en: ['What repeats here?<br>What happens to the part when it repeats again and again?'] } },
    /* 5 */ { gallery: 'taeuber', text: { he: ['איזו חוקיות אתם מגלים?<br>ואיפה היא משתנה?'], en: ['What rule can you find?<br>And where does it change?'] } },
    /* 6 */ { pair: ['morris', 'taeuber'],   // the Morris and the Taeuber-Arp looked at last
              text: { he: ['אותה צורה יכולה ליצור דפוסים שונים.', 'מה משתנה כשמשנים את הגודל, הכיוון או המרווח?'],
                      en: ['The same shape can create different patterns.', 'What changes when you change the size, the direction or the spacing?'] },
              /* more artists to look at, on their own or a museum's site (a new tab; none of their images is copied here) */
              more: [{ name: { he: 'יאיוי קוסמה', en: 'Yayoi Kusama' }, site: { he: 'האתר הרשמי של האמנית', en: 'Official artist website' }, href: 'https://yayoi-kusama.jp/gallery/' },
                     { name: { he: 'סוניה דלונה', en: 'Sonia Delaunay' }, site: { he: 'יצירות באוסף MoMA', en: 'MoMA collection' }, href: 'https://www.moma.org/collection/artists/1480' }] },
    /* 7 */ { title: { he: 'מה מסקרן אתכם?', en: 'What are you curious about?' },
              thumbs: { all: ['nature'], seen: ['morris', 'taeuber'] },
              text: { he: ['הסתכלו שוב על התמונות והיצירות.<br>איזו צורה, תנועה או חזרתיות הייתם רוצים לקחת כנקודת מוצא לציור שלכם?'],
                      en: ['Look again at the images and the artworks.<br>Which shape, movement or repetition would you like to take as the starting point for your drawing?'] } },
    /* 8 */ { step: 'medium', title: { he: 'עכשיו מתחילים ליצור.', en: "Now it's time to create." }, text: { he: ['איפה תרצו ליצור?'], en: ['Where would you like to create?'] },
              choices: { paper: { he: 'על נייר', en: 'On paper' }, studio: { he: 'Studio', en: 'Studio' } },
              studio: { activity: '2-1-begin', back: 9 } },
    /* 9 */ { step: 'ask', title: { he: 'ומה יקרה אם מה שיצרתם יתחיל לחזור?', en: "What will happen if what you've created begins to repeat?" },
              paper: { text: { he: ['הסתכלו על מה שכבר יצרתם.<br>בחרו משהו מתוכו שמעניין אתכם וחזרו עליו במקום נוסף בדף.', 'הוא לא חייב לחזור בדיוק אותו דבר.<br>אפשר לשנות אותו תוך כדי.'],
                               en: ["Look at what you've already made.<br>Choose something in it that interests you, and repeat it somewhere else on the page.", "It doesn't have to come back exactly the same.<br>You can change it as you go."] } } },
    /* 10 */ { step: 'studio', studio: { activity: '2-1-play', back: 11 },
              paper: { text: { he: ['נסו עוד כמה אפשרויות.<br>אפשר לשנות, להוסיף, לכסות, לצייר מעל — ולהסתכל מה קורה.', '<span class="pl-quiet">גודל · כיוון · המרחק בין הדברים</span>'],
                               en: ['Try a few more possibilities.<br>You can change, add, cover, draw on top — and see what happens.', '<span class="pl-quiet">Size · Direction · Space between things</span>'] } } },
    /* 11 */ { step: 'notice', text: { he: ['תסתכלו על מה שנוצר.', 'מה מעניין אתכם עכשיו יותר —<br>הדבר שממנו התחלתם,<br>או משהו חדש שקרה בדרך?', 'תמשיכו מהמקום שמעניין אתכם.'],
                                    en: ['Look at what has emerged.', 'What interests you more now —<br>the thing you started from,<br>or something new that happened along the way?', 'Continue from the part that interests you.'] } },
    /* 12 */ { step: 'studio', studio: { activity: '2-1-develop', back: 13 }, paper: { action: 'doneForNow' } },
    /* 13 */ { step: 'end', text: { he: ['מאיפה היצירה שלכם התחילה?<br>ומה קרה בה שלא תכננתם מראש?', 'דפוס התחיל את התהליך —<br>אבל היצירה לא הייתה חייבת להישאר דפוס.'],
                                 en: ["Where did your artwork begin?<br>What happened in it that you didn't plan in advance?", "Pattern began the process —<br>but the artwork didn't have to remain a pattern."] },
              studio: { activity: '2-1-free' } }
  ]
};
