/* Lesson 3.1 in the Lesson Player: Kandinsky and synesthesia (16 screens). The lesson has no page of its own on the
   site yet, so its content is here (page: the lesson's details and the artworks, read through the "guide" adapter like
   a lesson of the site); title and text are the player's words for each screen.
   One artwork through the whole lesson: begun with the music (5), looked at when it ends (6), returned to after
   Prokofiev and Kandinsky (13), developed (14). Paper or Studio is chosen on screen 4 and stays (as in 2.1); the
   Studio is drawing only (3-1-draw), with no Repeat.
   nav: where the lesson sits in the units of the app (the site's navigation, js/site-nav.js, does not list it yet).
   media.audio / media.asset: the music or image a screen needs; while none is approved (audio, assets), the screen
   shows a placeholder in its place. A missing artwork image shows a placeholder with the artist, title and year. */
window.APP_LESSONS = window.APP_LESSONS || {};
window.APP_LESSONS['3-1'] = {
  adapter: 'guide',
  unit: 'unit03',
  nav: { unit: 'unit03', path: 'lessons/lesson-3-1.html', title: { he: 'קנדינסקי וסינאסתזיה', en: 'Kandinsky and Synesthesia' } },
  langs: ['he', 'en'],
  artworkActivity: '3-1-draw',   // the Studio activity "My artworks" opens an artwork of this lesson in
  assets: {},
  audio: {},                     // e.g. '3-1-listen': '<file>' once a recording is approved
  page: {
    number: '3.1', unitNum: '03',
    title: { he: 'קנדינסקי וסינאסתזיה', en: 'Kandinsky and Synesthesia' },
    unit: { he: 'מוזיקה וריתמוס כמקור השראה', en: 'Music and Rhythm as a Source of Inspiration' },
    time: null,
    sections: { works: { blocks: [
      /* 0 */ { works: [{ artist: { he: 'וסילי קנדינסקי', en: 'Wassily Kandinsky' }, workTitle: { he: 'Impression III (Concert), 1911', en: 'Impression III (Concert), 1911' }, img: null }] },
      /* 1 */ { works: [{ artist: { he: 'וסילי קנדינסקי', en: 'Wassily Kandinsky' }, workTitle: { he: 'Improvisation 28, 1912', en: 'Improvisation 28, 1912' }, img: null }] },
      /* 2 */ { works: [{ artist: { he: 'וסילי קנדינסקי', en: 'Wassily Kandinsky' }, workTitle: { he: 'צהוב־אדום־כחול, 1925', en: 'Yellow-Red-Blue, 1925' }, img: 'kandinsky-yellow-red-blue',
                         alt: { he: 'וסילי קנדינסקי, צהוב־אדום־כחול, 1925', en: 'Wassily Kandinsky, Yellow-Red-Blue, 1925' } }] }
    ] } }
  },
  actions: {
    keepCreating: { he: 'להמשיך ליצור', en: 'Keep creating' },
    doneForNow: { he: 'סיימתי לעכשיו', en: "I'm done for now" },
    anotherTime: { he: 'להמשיך בפעם אחרת', en: 'Come back to it later' }
  },
  screens: [
    /* 1 */ { title: { he: 'איך מציירים צליל?', en: 'How do you draw a sound?' },
              text: { he: ['בשיעור הזה נתחיל ממוזיקה.<br>לא צריך לדעת מראש מה לצייר.'],
                      en: ["In this lesson, we'll begin with music.<br>You don't need to know what you're going to draw yet."] } },
    /* 2 */ { media: { audio: '3-1-listen' },
              text: { he: ['הקשיבו.<br>אל תציירו עדיין.<br>פשוט שימו לב למה שתופס אתכם.'],
                      en: ["Listen.<br>Don't draw yet.<br>Just notice what catches your attention."] } },
    /* 3 */ { title: { he: 'מה תפס אתכם במוזיקה?', en: 'What caught your attention in the music?' },
              text: { he: ['אולי צליל, קצב, תנועה, שינוי, תחושה —<br>או משהו אחר שהמוזיקה הזכירה לכם.'],
                      en: ['Maybe a sound, a rhythm, a movement, a change, a feeling —<br>or something else the music made you think of.'] } },
    /* 4 */ { step: 'medium',
              text: { he: ['קחו משהו שתפס אתכם כנקודת התחלה.<br>אתם לא צריכים לצייר את מה ששמעתם.<br>תנו לזה להתחיל משהו משלכם.'],
                      en: ["Take something that caught your attention as a starting point.<br>You don't need to draw what you heard.<br>Let it begin something of your own."] },
              choices: { paper: { he: 'על נייר', en: 'On paper' }, studio: { he: 'Studio', en: 'Studio' } } },
    /* 5 */ { step: 'begin', media: { audio: '3-1-create' }, text: { he: ['התחילו ליצור.'], en: ['Begin creating.'] },
              studio: { activity: '3-1-draw' } },
    /* 6 */ { step: 'see', title: { he: 'המוזיקה נגמרה. אבל היצירה לא חייבת להיעצר.', en: "The music has ended. But the artwork doesn't have to stop." },
              text: { he: ['תסתכלו על מה שנוצר.', 'מה ביצירה שלכם מעניין אתכם עכשיו?'], en: ['Look at what has emerged.', 'What interests you in your artwork now?'] } },
    /* 7 */ { title: { he: 'סרגיי פרוקופייב · פטר והזאב', en: 'Sergei Prokofiev · Peter and the Wolf' },
              text: { he: ['ב"פטר והזאב" פרוקופייב השתמש בכלים ובנושאים מוזיקליים שונים כדי לתת לדמויות אופי שונה.',
                           'לדוגמה:<br>פטר — כלי קשת<br>הציפור — חליל<br>הברווז — אבוב',
                           'כולכם שמעתם את אותה מוזיקה.<br>האם נוצרו לכם אותן יצירות?'],
                      en: ['In Peter and the Wolf, Prokofiev used different instruments and musical themes to give the characters different qualities.',
                           'For example:<br>Peter — strings<br>The bird — flute<br>The duck — oboe',
                           'You all heard the same music.<br>Did you all make the same artwork?'] } },
    /* 8 */ { text: { he: ['אותה מוזיקה יכולה לפתוח אצל כל אחד משהו אחר.', 'מקור השראה לא אומר לנו מה ליצור.<br>הוא יכול להיות המקום שממנו היצירה מתחילה.'],
                      en: ['The same music can open something different for each person.', "A source of inspiration doesn't tell us what to create.<br>It can be the place where an artwork begins."] } },
    /* 9 */ { src: [['works', 0]],
              text: { he: ['תסתכלו על הציור.', 'איפה אתם מרגישים בו תנועה?<br>מה מושך את העין שלכם?'],
                      en: ['Look at the painting.', 'Where do you sense movement?<br>What draws your eye?'] } },
    /* 10 */ { text: { he: ['קנדינסקי יצר את Impression III (Concert) בעקבות קונצרט של ארנולד שנברג שבו נכח ב-1911.', 'גם כאן המוזיקה הייתה נקודת התחלה.<br>הציור לא היה צריך להפוך לתמונה של הקונצרט.'],
                       en: ["Kandinsky created Impression III (Concert) after attending a concert of Arnold Schoenberg's music in 1911.", "Here too, music was a starting point.<br>The painting didn't have to become a picture of the concert."] } },
    /* 11 */ { compare: [['works', 1], ['works', 2]],
              text: { he: ['מה יכולים קו, צבע וצורה לעשות גם בלי לצייר דבר כפי שהוא נראה במציאות?', '<span class="pl-quiet">קו · צבע · צורה · תנועה · מרחב · צפיפות</span>'],
                      en: ['What can line, colour and form do without depicting something as it appears in reality?', '<span class="pl-quiet">Line · Colour · Form · Movement · Space · Density</span>'] } },
    /* 12 */ { text: { he: ['אצל אנשים מסוימים, גירוי בחוש אחד יכול לעורר באופן אוטומטי חוויה בחוש אחר.', 'למשל, צליל עשוי לעורר חוויה של צבע.', 'לתופעה הזאת קוראים סינאסתזיה.', 'לא צריך לחוות סינאסתזיה כדי שמוזיקה תעורר בכם משהו.'],
                       en: ['For some people, stimulation of one sense can automatically trigger an experience in another sense.', 'For example, a sound may trigger an experience of colour.', 'This is called synesthesia.', "You don't need to experience synesthesia for music to evoke something in you."] } },
    /* 13 */ { step: 'return', text: { he: ['עכשיו חזרו ליצירה שלכם.', 'אחרי מה שראיתם —<br>מה אתם רוצים שיקרה בה עכשיו?'], en: ['Now return to your artwork.', "After what you've seen —<br>what would you like to happen in it now?"] },
              studio: { activity: '3-1-draw', back: 14 } },
    /* 14 */ { step: 'free', studio: { activity: '3-1-draw' } },
    /* 15 */ { step: 'see', title: { he: 'תסתכלו על היצירה שלכם עכשיו.', en: 'Look at your artwork now.' },
              text: { he: ['מאיפה היא התחילה?', 'ומה קרה בה בדרך שלא תכננתם מראש?'], en: ['Where did it begin?', "What happened along the way that you didn't plan?"] } },
    /* 16 */ { step: 'end', text: { he: ['המוזיקה הייתה נקודת ההתחלה.<br>משם היצירה מצאה את הדרך שלה.'], en: ['The music was the starting point.<br>From there, the artwork found its own way.'] },
              studio: { activity: '3-1-draw' } }
  ]
};
