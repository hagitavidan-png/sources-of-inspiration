/* Activities: each one says which tools the studio shows (the learner never sees the word "capability").
   tools      the studio's tools for this activity: "draw", "color", "repeat", "fill", "arrange".
              The studio places their buttons in a fixed order (V1's: brush, colour, size, eraser)
   canvas     the aspect ratio of the artwork, the same on every screen and in any orientation
   back       where "Back to the lesson" goes (a path inside this site); ?back= can override it
   params     settings for a tool, under its name (repeat: see js/repeat.js)
   content    what the activity provides to work on (fill: the areas, see js/fill.js; arrange: the elements, js/arrange.js)
   title      optional; the default is "My artwork" */
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
