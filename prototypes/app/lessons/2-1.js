/* Lesson 2.1 in the Lesson Player: which screens, of which kind, and where each takes its content from in the
   lesson itself (section, block). No lesson text is written here.
   media.asset names the image a screen needs; while no image is approved for it, the screen shows a placeholder
   in its place (ASSETS below maps an asset to an image of the site's images/editorial/ once there is one). */
window.APP_LESSONS = window.APP_LESSONS || {};
window.APP_LESSONS['2-1'] = {
  data: '../../data/lesson-pages/lesson-2-1-learner.js',
  adapter: 'guide',
  unit: 'unit02',
  studio: { href: 'studio/index.html?activity=pattern-2-1-app', key: 'studio-v2:2.1-app:pattern-2-1-app' },
  assets: {},
  screens: [
    /* 1 */ { type: 'content', src: [['explore', 0]], media: { asset: '2-1-opening' } },
    /* 2 */ { type: 'action', src: [['explore', 1]], media: { asset: '2-1-find-pattern' } },
    /* 3 */ { type: 'action', src: [['explore', 2]], media: { asset: '2-1-unit' } },
    /* 4 */ { type: 'action', src: [['explore', 3]], media: { asset: '2-1-law' } },
    /* 5 */ { type: 'content', src: [['sources', 0], ['sources', 1], ['sources', 2]] },
    /* 6 */ { type: 'content', src: [['sources', 3], ['sources', 4], ['sources', 5]], gap: 'protoKusama' },
    /* 7 */ { type: 'comparison', src: [['look', 0]], compare: [['sources', 1], ['sources', 4]] },
    /* 8 */ { type: 'content', src: [['idea', 0]] },
    /* 9 */ { type: 'creation', step: 'choose' },
    /* 10 */ { type: 'creation', step: 'make', src: [['create', 0]], studioGap: 'protoS3' },
    /* 11 */ { type: 'creation', step: 'change', src: [['create', 1]], studioGap: 'protoS1' },
    /* 12 */ { type: 'comparison', step: 'check', src: [['end', 0]], studioGap: 'protoS2' },
    /* 13 */ { type: 'reflection', src: [['end', 1], ['end', 2], ['end', 3]] }
  ]
};
