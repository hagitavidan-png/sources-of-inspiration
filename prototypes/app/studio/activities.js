/* Activities: each one says which tools the studio shows (the learner never sees the word "capability").
   tools      the studio's tools for this activity: "draw", "color", "repeat", "fill", "arrange".
              The studio places their buttons in a fixed order (V1's: brush, colour, size, eraser)
   canvas     the aspect ratio of the artwork, the same on every screen and in any orientation
   back       where "Back to the lesson" goes (a path inside this site); ?back= can override it
   params     settings for a tool, under its name (repeat: see js/repeat.js)
   content    what the activity provides to work on (fill: the areas, see js/fill.js; arrange: the elements, js/arrange.js)
   title      optional; the default is "My artwork"
   clear      false: no "Clear" (app prototype)
   restart    app prototype: "Start over" in the place of "Clear" (its own words and question; with Repeat in the work,
              Repeat stays: js/core.js, js/repeat.js)
   keep       app prototype, an artwork that saves itself (?art=): one button that keeps the work as it is now as a
              development point ('kept'); keep.label is its label in each language (none in a language: no button) */
window.STUDIO_ACTIVITIES = {
  drawing: {
    id: 'drawing',
    lesson: 'prototype',
    tools: ['draw', 'color'],
    canvas: { aspect: '4:5' },   /* portrait: the most drawing area on phones and tablets held upright */
    back: '../../lesson-pages/lesson-2-1-learner.html'
  },
  pattern: {
    id: 'pattern',
    lesson: 'prototype',
    tools: ['draw', 'repeat'],
    canvas: { aspect: '4:3' },
    params: { repeat: { modes: ['grid', 'offset'], step: 250 } },
    back: '../../lesson-pages/lesson-2-1-learner.html'
  },
  /* lesson 2.1, step 9 of the independent learner version: the same as pattern, back to the lesson's "create" part */
  'pattern-2-1': {
    id: 'pattern-2-1',
    lesson: '2.1',
    tools: ['draw', 'repeat'],
    canvas: { aspect: '4:3' },
    params: { repeat: { modes: ['grid', 'offset'], step: 250 } },
    back: '../../lesson-pages/lesson-2-1-learner.html#create'
  },
  /* the app prototype (prototypes/app/): lesson 2.1, screen 10; back to that screen of the Lesson Player */
  'pattern-2-1-app': {
    id: 'pattern-2-1-app',
    lesson: '2.1-app',
    tools: ['draw', 'repeat'],
    canvas: { aspect: '4:3' },
    params: { repeat: { modes: ['grid', 'offset'], step: 250 } },
    back: '../index.html#/lesson/2-1/play/10'
  },
  /* the same work, version 2 (screen 11, change one thing only): one entry per thing that may change, all with the
     same id, so all save version 2 under one key and version 1 stays as it was. Only the repeat: no drawing, no
     kind of repeat, no clearing (draw shows the lines only); the Lesson Player starts it from a copy of version 1 */
  'pattern-2-1-app-v2-size': {
    id: 'pattern-2-1-app-v2', lesson: '2.1-app', tools: ['draw', 'repeat'], canvas: { aspect: '4:3' },
    params: { draw: { view: true }, repeat: { modes: ['grid', 'offset'], step: 250, vary: 'size' } },
    back: '../index.html#/lesson/2-1/play/11'
  },
  'pattern-2-1-app-v2-direction': {
    id: 'pattern-2-1-app-v2', lesson: '2.1-app', tools: ['draw', 'repeat'], canvas: { aspect: '4:3' },
    params: { draw: { view: true }, repeat: { modes: ['grid', 'offset'], step: 250, vary: 'direction' } },
    back: '../index.html#/lesson/2-1/play/11'
  },
  'pattern-2-1-app-v2-spacing': {
    id: 'pattern-2-1-app-v2', lesson: '2.1-app', tools: ['draw', 'repeat'], canvas: { aspect: '4:3' },
    params: { draw: { view: true }, repeat: { modes: ['grid', 'offset'], step: 250, vary: 'spacing' } },
    back: '../index.html#/lesson/2-1/play/11'
  },

  color: {
    id: 'color',
    lesson: 'prototype',
    tools: ['color', 'fill'],
    canvas: { aspect: '4:3' },
    /* an abstract composition of seven areas (artwork 1000 × 750): a large field with a circle inside it,
       two areas under it divided on a slant, and three areas of different heights on the right */
    content: {
      regions: [
        { id: 'field', d: 'M0 0H620V430H0Z M490 230A130 130 0 1 0 230 230A130 130 0 1 0 490 230Z' },
        { id: 'circle', d: 'M490 230A130 130 0 1 0 230 230A130 130 0 1 0 490 230Z' },
        { id: 'low-left', d: 'M0 430H380L260 750H0Z' },
        { id: 'low-right', d: 'M380 430H620V750H260Z' },
        { id: 'top-right', d: 'M620 0H1000V260H620Z' },
        { id: 'right', d: 'M620 260H1000V600H620Z' },
        { id: 'strip', d: 'M620 600H1000V750H620Z' }
      ]
    },
    back: '../../lesson-pages/lesson-2-1-learner.html'
  },
  composition: {
    id: 'composition',
    lesson: 'prototype',
    tools: ['arrange', 'draw'],
    canvas: { aspect: '4:3' },
    /* five abstract elements (artwork 1000 × 750), back to front: one large, two medium, two small */
    content: {
      elements: [
        { id: 'mass', x: 300, y: 220, w: 380, h: 300, color: '#e08a2e', d: 'M40 150C20 60 120 0 210 20C300 40 380 80 370 170C360 260 270 300 180 290C90 280 60 240 40 150Z' },
        { id: 'column', x: 200, y: 160, w: 110, h: 300, color: '#2b2a28', d: 'M0 0H110V300H0Z' },
        { id: 'disc', x: 560, y: 110, w: 200, h: 200, color: '#2f6fa8', d: 'M200 100A100 100 0 1 0 0 100A100 100 0 1 0 200 100Z' },
        { id: 'bar', x: 620, y: 570, w: 200, h: 36, color: '#5d8a4f', d: 'M0 0H200V36H0Z' },
        { id: 'dot', x: 840, y: 190, w: 60, h: 60, color: '#c8423b', d: 'M60 30A30 30 0 1 0 0 30A30 30 0 1 0 60 30Z' }
      ]
    },
    back: '../../lesson-pages/lesson-2-1-learner.html'
  }
};

/* the app prototype's lesson 2.1, the new flow: one artwork through the lesson, opened in the Studio again and again
   (?art=; the Lesson Player says where "Back" goes, ?back=). Only configuration: the tools are the same everywhere.
     2-1-begin            screen 10: the work begins; drawing, colour, line width, eraser, undo, redo; no Repeat
     2-1-repeat           screen 11: Repeat enters the work (a 'before-repeat' point first), in a grid; no control yet
     2-1-change-<kind>    screen 14: one Repeat setting to change (size, rotation or spacing), drawing as before,
                          and "keep this possibility"
     2-1-source           screen 12, "back to the drawing": the source only (Repeat and what followed set aside and
                          kept), drawing as on screen 10; "see it repeat again" goes back to the lesson
     2-1-continue         screen 16: all three settings, one at a time (tabs); the first shown: ?control=
   None has "Clear"; none can let Repeat enter a second time. The labels are in the flow's languages (lessons/2-1.js
   langs): a label missing in a language leaves its button out */
(function (A) {
  var KEEP = { label: { he: 'את זה אני רוצה לשמור', en: 'I want to keep this one' } };
  function lesson21(id, repeat, more) {
    var a = { id: id, lesson: '2.1-app', tools: repeat ? ['draw', 'color', 'repeat'] : ['draw', 'color'], canvas: { aspect: '4:3' },
              clear: false, back: '../index.html#/lesson/2-1' };
    if (repeat) a.params = { repeat: Object.assign({ modes: ['grid'], step: 250, asStep: true }, repeat) };
    A[id] = Object.assign(a, more || {});
  }
  lesson21('2-1-begin', null);
  lesson21('2-1-repeat', { enter: true });
  ['size', 'rotation', 'spacing'].forEach(function (k) { lesson21('2-1-change-' + k, { control: k }, { keep: KEEP }); });
  lesson21('2-1-source', {}, { source: true, next: { label: { he: 'לראות שוב בחזרה', en: 'See it repeated again' } } });
  lesson21('2-1-continue', { controls: ['size', 'rotation', 'spacing'] });
  /* 2.1 rebuilt: Repeat appears by itself (a moment after the Studio opens), then Size, Direction and Spacing all at
     once, with the drawing tools; then the same without a new Repeat; "Keep creating" and My artworks the same.
     Live repeat (live): once Repeat entered, every new line repeats as it is drawn, and Repeat can be switched off and
     on. "Start over" (restart) on every screen of the rebuilt flow, the first one (2-1-begin) too */
  var ALL = ['size', 'rotation', 'spacing'];
  A['2-1-begin'].restart = true;
  /* the first drawing's way on: the work written, then the lesson's next screen (9: the question, and the learner's own
     "See what happens" before Repeat appears); never Repeat itself. "Start over" stays the quieter button */
  A['2-1-begin'].next = { label: { he: 'ממשיכים ליצירת דפוס', en: 'Next: make a pattern' } };
  lesson21('2-1-play', { enter: true, reveal: true, controls: ALL, together: true, live: true }, { restart: true,
    prompt: { he: 'מה יקרה אם תשנו רק דבר אחד? ומה יקרה אם תשנו כמה דברים יחד?', en: 'What happens if you change just one thing? And what if you change several things together?' },
    next: { label: { he: 'לגלות מה נוצר', en: 'Discover what emerged' } } });
  lesson21('2-1-develop', { controls: ALL, together: true, live: true }, { restart: true, next: { label: { he: 'סיימתי לעכשיו', en: "I'm done for now" } } });
  lesson21('2-1-free', { controls: ALL, together: true, live: true, offer: true }, { restart: true });   // offer: Repeat by the switch (js/repeat.js)
  /* compact (studio.css): the work the centre of the screen, the controls as small as a finger allows; works: My
     artworks in the top bar of the lesson's Studio screens (10, 12), back to the same screen */
  ['2-1-begin', '2-1-play', '2-1-develop', '2-1-free'].forEach(function (id) { A[id].compact = true; });
  A['2-1-play'].works = A['2-1-develop'].works = '2-1';
})(window.STUDIO_ACTIVITIES);

/* the app prototype's lesson 3.1: one artwork, drawn from the music and developed after it; drawing, colour, line
   width, eraser, undo, redo (no Repeat, no Clear) on every screen it opens from (5, 13, 14, 16) and from My artworks */
window.STUDIO_ACTIVITIES['3-1-draw'] = { id: '3-1-draw', lesson: '3.1-app', tools: ['draw', 'color'], canvas: { aspect: '4:3' },
  clear: false, back: '../index.html#/lesson/3-1' };
