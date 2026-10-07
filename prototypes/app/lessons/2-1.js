/* Lesson 2.1 in the Lesson Player, the new flow (18 screens): which screens, and where each takes its content from.
   Screens 1–7 take it from the lesson itself (section, block: src; only: which of its rows; compare: the two works);
   title, reveal and text are the player's own words for a screen, where the lesson's are not the ones to show
   (reveal: shown only after "Continue" is pressed once). From screen 9 the learner works on paper or in the Studio;
   from screen 11 the two ways differ (paper / studio: the words and actions of each). Studio screens open the one
   artwork of the lesson run in a Studio activity (studio/activities.js), and come back to the screen named in back.
   The new flow is in Hebrew only until its English is approved (langs): in another language the lesson stays on the
   site. media.asset names the image a screen needs; while no image is approved for it, the screen shows a
   placeholder in its place (ASSETS below maps an asset to an image of the site's images/editorial/ once there is one). */
window.APP_LESSONS = window.APP_LESSONS || {};
window.APP_LESSONS['2-1'] = {
  data: '../../data/lesson-pages/lesson-2-1-learner.js',
  adapter: 'guide',
  unit: 'unit02',
  langs: ['he'],
  assets: {},
  /* the words of the flow's actions */
  actions: {
    tryRepeat: { he: 'לנסות חזרה' },
    backToDrawing: { he: 'לחזור לציור' },
    develop: { he: 'להמשיך לפתח' },
    keepCreating: { he: 'להמשיך ליצור' },
    doneForNow: { he: 'סיימתי לעכשיו' },
    anotherTime: { he: 'להמשיך בפעם אחרת' }
  },
  screens: [
    /* 1 */ { src: [['explore', 0]], media: { asset: '2-1-opening' }, title: { he: 'דפוסים בטבע ובאמנות' } },
    /* 2 */ { src: [['explore', 1]], media: { asset: '2-1-find-pattern' } },
    /* 3 */ { src: [['explore', 2]], only: ['do'], media: { asset: '2-1-unit' }, title: { he: 'מה חוזר?' },
              reveal: { he: 'זה החלק שחוזר. אפשר לקרוא לו יחידה.' } },
    /* 4 */ { src: [['explore', 3]], only: ['do'], media: { asset: '2-1-law' }, title: { he: 'איך זה חוזר?' },
              reveal: { he: 'הדרך שבה היחידה חוזרת היא החוק של הדפוס.' } },
    /* 5 */ { src: [['sources', 0], ['sources', 1], ['sources', 2]] },
    /* 6 */ { src: [['sources', 3], ['sources', 4], ['sources', 5]], gap: 'protoKusama' },
    /* 7 */ { compare: [['sources', 1], ['sources', 4]], title: { he: 'תסתכלו על שתיהן. מה אתם מגלים?' },
              text: { he: ['אין כאן תשובה נכונה אחת.'] } },
    /* 8 */ { title: { he: 'מה מכל מה שראיתם תפס אתכם?' },
              text: { he: ['זה יכול להיות פרט, צורה, צבע, חזרה, משהו מהטבע, תנועה, סדר, צפיפות — או משהו אחר שזה הזכיר לכם.',
                           'קחו משהו שתפס אתכם כנקודת התחלה.',
                           'אפשר להשתמש בו, לשנות אותו, לפרק אותו —<br>או להתחיל ממשהו אחר שהוא הזכיר לכם.'] } },
    /* 9 */ { step: 'medium', title: { he: 'עכשיו מתחילים ליצור.' }, text: { he: ['איפה תרצו ליצור?'] },
              choices: { paper: { he: 'על נייר' }, studio: { he: 'Studio' } } },
    /* 10 */ { step: 'begin', text: { he: ['התחילו ליצור מתוך נקודת ההתחלה שבחרתם.'] },
              studio: { activity: '2-1-begin' } },
    /* 11 */ { step: 'repeat',
              studio: { text: { he: ['מה יקרה כשהיצירה שלך תחזור?'] }, activity: '2-1-repeat', back: 12 },
              paper: { text: { he: ['הסתכלו על מה שכבר יצרתם.<br>בחרו משהו מתוכו שמעניין אתכם וחזרו עליו במקום נוסף בדף.', 'הוא לא חייב לחזור בדיוק אותו דבר.<br>אפשר לשנות אותו תוך כדי.'] } } },
    /* 12 */ { step: 'look', text: { he: ['תסתכלו רגע.<br>מה קרה ליצירה כשהיא התחילה לחזור?'] },
              studio: { activity: '2-1-source' } },
    /* 13 */ { step: 'change', text: { he: ['עכשיו נסו לשנות רק דבר אחד.'] },
              studio: { choices: { size: { he: 'גודל' }, rotation: { he: 'כיוון' }, spacing: { he: 'מרווח' } } },
              paper: { choices: { size: { he: 'גודל' }, rotation: { he: 'כיוון' }, spacing: { he: 'המרחק בין הדברים' } } } },
    /* 14 */ { step: 'try',
              studio: { text: { he: ['נסו כמה אפשרויות.<br>שנו, ציירו, מחקו והסתכלו מה קורה.'] }, activity: '2-1-change-' },
              paper: { text: { he: ['נסו עוד כמה אפשרויות.<br>אפשר לשנות, להוסיף, לכסות, לצייר מעל — ולהסתכל מה קורה.'] } } },
    /* 15 */ { step: 'choose', studio: { text: { he: ['איזו אפשרות מעניינת אתכם להמשיך?', 'בחרו את האפשרות שתרצו להמשיך לפתח.'] } } },
    /* 16 */ { step: 'free', text: { he: ['מה הייתם רוצים לעשות איתה עכשיו?'] }, studio: { activity: '2-1-continue' } },
    /* 17 */ { step: 'see', title: { he: 'תסתכלו על היצירה שלכם עכשיו.' },
              text: { he: ['האם עדיין אפשר לראות מאיפה היא התחילה?', 'מה השתנה בדרך שלא תכננתם מראש?'] } },
    /* 18 */ { step: 'end', title: { he: 'דפוס הוא חוק שאפשר לראות.' },
              text: { he: ['אפשר להתחיל מחוק — ואז לשנות אותו, לצייר עליו ולתת ליצירה להמשיך למקום אחר.'] },
              studio: { activity: '2-1-continue' } }
  ]
};
