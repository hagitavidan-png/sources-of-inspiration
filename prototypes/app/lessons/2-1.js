/* Lesson 2.1 in the Lesson Player, the new flow (18 screens): which screens, and where each takes its content from.
   Screens 1–7 take it from the lesson itself (section, block: src; only: which of its rows; compare: the two works);
   title, reveal and text are the player's own words for a screen, where the lesson's are not the ones to show
   (reveal: shown only after "Continue" is pressed once). From screen 9 the learner works on paper or in the Studio;
   from screen 11 the two ways differ (paper / studio: the words and actions of each). Studio screens open the one
   artwork of the lesson run in a Studio activity (studio/activities.js), and come back to the screen named in back.
   rows: the player's own words for one row of the lesson's content ({ <kind>: { he?, en? } }), where the lesson's
   words are not the ones to show in that language (otherwise the lesson's own). The flow is in the languages listed
   in langs; in another language the lesson stays on the site. media.asset names the image a screen needs; while no
   image is approved for it, the screen shows a placeholder in its place (ASSETS below maps an asset to an image of
   the site's images/editorial/ once there is one). */
window.APP_LESSONS = window.APP_LESSONS || {};
window.APP_LESSONS['2-1'] = {
  data: '../../data/lesson-pages/lesson-2-1-learner.js',
  adapter: 'guide',
  unit: 'unit02',
  langs: ['he', 'en'],
  artworkActivity: '2-1-continue',   // the Studio activity "My artworks" opens an artwork of this lesson in (never its last one)
  assets: {},
  /* the words of the flow's actions */
  actions: {
    tryRepeat: { he: 'לנסות חזרה', en: 'Try repeating it' },
    backToDrawing: { he: 'לחזור לציור', en: 'Back to the drawing' },
    develop: { he: 'להמשיך לפתח', en: 'Develop it further' },
    keepCreating: { he: 'להמשיך ליצור', en: 'Keep creating' },
    doneForNow: { he: 'סיימתי לעכשיו', en: "I'm done for now" },
    anotherTime: { he: 'להמשיך בפעם אחרת', en: 'Come back to it later' }
  },
  screens: [
    /* 1 */ { src: [['explore', 0]], media: { asset: '2-1-opening' }, title: { he: 'דפוסים בטבע ובאמנות', en: 'Patterns in Nature & Art' },
              rows: { why: { he: 'דפוסים נמצאים בכל מקום: בקליפת העץ, בעורקי העלה, באריח שמתחת לרגליים. בשיעור הזה תתבוננו מקרוב איך דפוסים בנויים, ואחר כך תתחילו יצירה משלכם.',
                             en: "Patterns are everywhere: in the bark of a tree, the veins of a leaf, the tiles under your feet. In this lesson you'll look closely at how patterns work, and then start an artwork of your own." } } },
    /* 2 */ { src: [['explore', 1]], media: { asset: '2-1-find-pattern' } },
    /* 3 */ { src: [['explore', 2]], only: ['do'], media: { asset: '2-1-unit' }, title: { he: 'מה חוזר?', en: 'What repeats?' },
              reveal: { he: 'זה החלק שחוזר. אפשר לקרוא לו יחידה.', en: 'This is the part that repeats. We can call it a unit.' } },
    /* 4 */ { src: [['explore', 3]], only: ['do'], media: { asset: '2-1-law' }, title: { he: 'איך זה חוזר?', en: 'How does it repeat?' },
              rows: { 'do': { en: 'Ask yourself how the unit repeats.' } },
              reveal: { he: 'הדרך שבה היחידה חוזרת היא החוק של הדפוס.', en: "The way the unit repeats is the pattern's rule." } },
    /* 5 */ { src: [['sources', 0], ['sources', 1], ['sources', 2]] },
    /* 6 */ { src: [['sources', 3], ['sources', 4], ['sources', 5]], gap: 'protoKusama' },
    /* 7 */ { compare: [['sources', 1], ['sources', 4]], title: { he: 'תסתכלו על שתיהן. מה אתם מגלים?', en: 'Look at both of them. What do you notice?' },
              text: { he: ['אין כאן תשובה נכונה אחת.'], en: ["There's no one right answer here."] } },
    /* 8 */ { title: { he: 'מה מכל מה שראיתם תפס אתכם?', en: "Out of everything you've seen, what caught your attention?" },
              text: { he: ['זה יכול להיות פרט, צורה, צבע, חזרה, משהו מהטבע, תנועה, סדר, צפיפות — או משהו אחר שזה הזכיר לכם.',
                           'קחו משהו שתפס אתכם כנקודת התחלה.',
                           'אפשר להשתמש בו, לשנות אותו, לפרק אותו —<br>או להתחיל ממשהו אחר שהוא הזכיר לכם.'],
                      en: ['It could be a detail, a shape, a colour, repetition, something from nature, movement, order, density — or something else it reminded you of.',
                           'Take something that caught your attention as your starting point.',
                           'You can use it, change it, take it apart —<br>or start from something else it reminded you of.'] } },
    /* 9 */ { step: 'medium', title: { he: 'עכשיו מתחילים ליצור.', en: "Now it's time to create." }, text: { he: ['איפה תרצו ליצור?'], en: ['Where would you like to create?'] },
              choices: { paper: { he: 'על נייר', en: 'On paper' }, studio: { he: 'Studio', en: 'Studio' } } },
    /* 10 */ { step: 'begin', text: { he: ['התחילו ליצור מתוך נקודת ההתחלה שבחרתם.'], en: ['Begin creating from the starting point you chose.'] },
              studio: { activity: '2-1-begin' } },
    /* 11 */ { step: 'repeat',
              studio: { text: { he: ['מה יקרה כשהיצירה שלך תחזור?'], en: ['What will happen when your artwork repeats?'] }, activity: '2-1-repeat', back: 12 },
              paper: { text: { he: ['הסתכלו על מה שכבר יצרתם.<br>בחרו משהו מתוכו שמעניין אתכם וחזרו עליו במקום נוסף בדף.', 'הוא לא חייב לחזור בדיוק אותו דבר.<br>אפשר לשנות אותו תוך כדי.'],
                               en: ["Look at what you've already made.<br>Choose something in it that interests you, and repeat it somewhere else on the page.", "It doesn't have to come back exactly the same.<br>You can change it as you go."] } } },
    /* 12 */ { step: 'look', text: { he: ['תסתכלו רגע.<br>מה קרה ליצירה כשהיא התחילה לחזור?'], en: ['Take a moment to look.<br>What happened to your artwork when it started to repeat?'] },
              studio: { activity: '2-1-source' } },
    /* 13 */ { step: 'change', text: { he: ['עכשיו נסו לשנות רק דבר אחד.'], en: ['Now try changing just one thing.'] },
              studio: { choices: { size: { he: 'גודל', en: 'Size' }, rotation: { he: 'כיוון', en: 'Direction' }, spacing: { he: 'מרווח', en: 'Spacing' } } },
              paper: { choices: { size: { he: 'גודל', en: 'Size' }, rotation: { he: 'כיוון', en: 'Direction' }, spacing: { he: 'המרחק בין הדברים', en: 'Space between things' } } } },
    /* 14 */ { step: 'try',
              studio: { text: { he: ['נסו כמה אפשרויות.<br>שנו, ציירו, מחקו והסתכלו מה קורה.'], en: ['Try out a few possibilities.<br>Change things, draw, erase, and see what happens.'] }, activity: '2-1-change-' },
              paper: { text: { he: ['נסו עוד כמה אפשרויות.<br>אפשר לשנות, להוסיף, לכסות, לצייר מעל — ולהסתכל מה קורה.'], en: ['Try a few more possibilities.<br>You can change, add, cover, draw on top — and see what happens.'] } } },
    /* 15 */ { step: 'choose', studio: { text: { he: ['איזו אפשרות מעניינת אתכם להמשיך?', 'בחרו את האפשרות שתרצו להמשיך לפתח.'],
                                                en: ['Which possibility are you most interested in exploring further?', "Choose the one you'd like to develop further."] } } },
    /* 16 */ { step: 'free', text: { he: ['מה הייתם רוצים לעשות איתה עכשיו?'], en: ['What would you like to do with it now?'] }, studio: { activity: '2-1-continue' } },
    /* 17 */ { step: 'see', title: { he: 'תסתכלו על היצירה שלכם עכשיו.', en: 'Look at your artwork now.' },
              text: { he: ['האם עדיין אפשר לראות מאיפה היא התחילה?', 'מה השתנה בדרך שלא תכננתם מראש?'], en: ['Can you still see where it started?', "What changed along the way that you didn't plan?"] } },
    /* 18 */ { step: 'end', title: { he: 'דפוס הוא חוק שאפשר לראות.', en: 'A pattern is a rule you can see.' },
              text: { he: ['אפשר להתחיל מחוק — ואז לשנות אותו, לצייר עליו ולתת ליצירה להמשיך למקום אחר.'], en: ['You can start from a rule — then change it, draw over it, and let the artwork go somewhere else.'] },
              studio: { activity: '2-1-continue' } }
  ]
};
