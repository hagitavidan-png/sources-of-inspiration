/*! Sources of Inspiration in Art | מקורות השראה באמנות. Original code and content (c) 2026 Hagit Avidan | חגית אבידן. All rights reserved | כל הזכויות שמורות. Works and materials by others belong to their owners | יצירות וחומרים של אחרים שייכים לבעליהם. See NOTICE.txt */
window.STUDIO_ACTIVITIES = {
drawing: {
id: 'drawing',
lesson: 'prototype',
tools: ['draw', 'color'],
canvas: { aspect: '4:5' },
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
'pattern-2-1': {
id: 'pattern-2-1',
lesson: '2.1',
tools: ['draw', 'repeat'],
canvas: { aspect: '4:3' },
params: { repeat: { modes: ['grid', 'offset'], step: 250 } },
back: '../../lesson-pages/lesson-2-1-learner.html#create'
},
'pattern-2-1-app': {
id: 'pattern-2-1-app',
lesson: '2.1-app',
tools: ['draw', 'repeat'],
canvas: { aspect: '4:3' },
params: { repeat: { modes: ['grid', 'offset'], step: 250 } },
back: '../index.html#/lesson/2-1/play/10'
},
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
var ALL = ['size', 'rotation', 'spacing'];
lesson21('2-1-begin', { live: true, unit: true }, { restart: true,
prompt: { he: 'ציירו את היחידה הראשונה שלכם. אפשר להתנסות, לשנות ולהתחיל מחדש.', en: 'Draw your first unit. You can experiment, change things and start over.' },
next: { label: { he: 'ממשיכים ליצירת דפוס', en: 'Next: make a pattern' } } });
lesson21('2-1-play', { enter: true, reveal: true, controls: ALL, together: true, live: true }, { restart: true,
prompt: { he: 'מה יקרה אם תשנו רק דבר אחד? ומה יקרה אם תשנו כמה דברים יחד?', en: 'What happens if you change just one thing? And what if you change several things together?' },
next: { label: { he: 'לגלות מה נוצר', en: 'Discover what emerged' } } });
lesson21('2-1-develop', { controls: ALL, together: true, live: true }, { restart: true, next: { label: { he: 'סיימתי לעכשיו', en: "I'm done for now" } } });
lesson21('2-1-free', { controls: ALL, together: true, live: true, offer: true }, { restart: true });
lesson21('2-1-create', { offer: true, seeIt: true, controls: ALL, together: true, live: true }, { restart: true,
prompt: { he: 'ציירו יחידה באופן חופשי', en: 'Draw a unit freely' },
promptAfter: { he: 'מה יקרה אם תשנו רק דבר אחד? ומה יקרה אם תשנו כמה דברים יחד?', en: 'What happens if you change just one thing? And what if you change several things together?' },
next: { label: { he: 'סיימתי לעכשיו', en: "I'm done for now" } }, content: { inspiration: '2-1' } });
['2-1-create', '2-1-free'].forEach(function (id) { A[id].canvas = { aspect: '4:3', portrait: '4:5' }; });
A['2-1-create'].paper = { href: '../index.html#/lesson/2-1/play/6/paper', label: { he: 'יוצרים על נייר', en: 'Creating on paper' } };
A['2-1-create'].tools.push('refs');
A['2-1-free'].tools.push('refs'); A['2-1-free'].content = { inspiration: '2-1' };
['2-1-begin', '2-1-play', '2-1-develop', '2-1-free', '2-1-create'].forEach(function (id) { A[id].compact = true; });
A['2-1-play'].works = A['2-1-develop'].works = A['2-1-create'].works = '2-1';
A['2-1-free'].next = { label: { he: 'סיימתי לעכשיו', en: "I'm done for now" } };
A['2-1-free'].works = '2-1';
})(window.STUDIO_ACTIVITIES);
window.STUDIO_ACTIVITIES['3-1-draw'] = { id: '3-1-draw', lesson: '3.1-app', tools: ['draw', 'color'], canvas: { aspect: '4:3' },
clear: false, back: '../index.html#/lesson/3-1' };
