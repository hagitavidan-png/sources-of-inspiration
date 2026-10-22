/*! Sources of Inspiration in Art | מקורות השראה באמנות. Original code and content (c) 2026 Hagit Avidan | חגית אבידן. All rights reserved | כל הזכויות שמורות. Works and materials by others belong to their owners | יצירות וחומרים של אחרים שייכים לבעליהם. See NOTICE.txt */
window.APP_LESSONS = window.APP_LESSONS || {};
(function () {
var MORRIS = { who: 'Cooper Hewitt, Smithsonian Design Museum', licence: { he: 'נחלת הכלל', en: 'Public domain' },
note: { he: 'ויליאם מוריס, גנב התותים, עוצב ב־1883, הודפס בערך ב־1934 (Morris & Co.)', en: 'William Morris, Strawberry Thief, designed 1883, printed c. 1934 (Morris & Co.)' },
href: 'https://commons.wikimedia.org/wiki/File:Textile,_Strawberry_Thief,_designed_1883,_printed_ca._1934_(CH_18340065).jpg' };
var TAEUBER = { img: 'images/2-1/taeuber-composition-1930.jpg', size: [1920, 2349], artist: { he: 'סופי טאובר־ארפ', en: 'Sophie Taeuber-Arp' }, work: { he: 'קומפוזיציה, 1930', en: 'Composition, 1930' },
alt: { he: 'סופי טאובר־ארפ, קומפוזיציה, 1930: עיגולים וריבועים חוזרים בגדלים ובצבעים שונים על רקע אפור', en: 'Sophie Taeuber-Arp, Composition, 1930: circles and squares repeating in different sizes and colours on a grey ground' } };
var TAEUBER_SRC = { who: 'Muzeum Sztuki, Łódź', licence: { he: 'נחלת הכלל', en: 'Public domain' }, href: 'https://commons.wikimedia.org/wiki/File:Sophie_Taeuber-Arp_(1889%E2%80%931943),_Composition,_1930.png' };
var Q3 = { he: 'מה קורה כשהחזרה לא נשארת בדיוק אותו הדבר?', en: "What happens when repetition doesn't stay exactly the same?" };
var Q4 = { he: 'איפה אתם מזהים חזרה ביצירה, ואיפה משהו משתנה?', en: 'Where do you notice repetition in the artwork, and where does something change?' };
var MORRIS_ALT = { he: 'ויליאם מוריס, גנב התותים: ציפורים, תותים ופרחים שחוזרים על רקע כחול כהה', en: 'William Morris, Strawberry Thief: birds, strawberries and flowers repeating on a dark blue ground' };
window.APP_LESSONS['2-1'] = {
data: '../../data/lesson-pages/lesson-2-1-learner.js',
adapter: 'guide',
unit: 'unit02',
langs: ['he', 'en'],
artworkActivity: '2-1-free',
wordsFirst: true,
works: true,
directStart: true,
wide: true,
layout: 3, screenMaps: { old: { 1: 1, 2: 1, 3: 2, 4: 1, 5: 3, 6: 3, 7: 5, 8: 5, 9: 5, 10: 5, 11: 5, 12: 5, 13: 7 },
2: { 1: 1, 2: 2, 3: 3, 4: 5, 5: 6, 6: 7 } },
intro: {
subtitle: { he: 'מסע של התבוננות, גילוי ויצירה', en: 'A journey of looking, discovering and creating' },
info: { he: '{n} שלבים', en: '{n} steps' },
start: { he: 'מתחילים את השיעור', en: 'Start the lesson' },
resume: { he: 'ממשיכים מהמקום שעצרתי', en: 'Continue where I left off' }
},
actions: {
keepCreating: { he: 'להמשיך ליצור', en: 'Keep creating' },
doneForNow: { he: 'סיימתי לעכשיו', en: "I'm done for now" },
anotherTime: { he: 'להמשיך בפעם אחרת', en: 'Come back to it later' },
finishedCreating: { he: 'סיימתי ליצור', en: "I've finished creating" },
toStudio: { he: 'ממשיכים לסטודיו', en: 'Continue to Studio' }
},
screens: [
{ kind: 'shrink', shrink: { hi: 'images/2-1/morris-strawberry-thief-ch-hi.jpg', size: [3200, 2165], alt: MORRIS_ALT, from: 3.4, at: '61.2% 65.3%' },
ask: { he: 'מה גיליתם כשהתמונה התרחקה?', en: 'What did you discover when the image zoomed out?' }, source: MORRIS },
{ kind: 'units', text: { he: ['צורה שחוזרת היא יחידה.<br>הדרך שבה היא חוזרת יוצרת דפוס.'], en: ['A repeating shape is a unit.<br>The way it repeats creates a pattern.'] },
units: { img: 'images/2-1/morris-strawberry-thief-ch.jpg', size: [1600, 1083], alt: MORRIS_ALT, r: 0.13,
at: [[0.612, 0.653], [0.775, 0.659], [0.363, 0.647], [0.208, 0.647], [0.163, 0.296], [0.408, 0.296], [0.554, 0.302], [0.821, 0.296]],
detail: { img: 'images/2-1/morris-strawberry-thief-ch-hi.jpg', size: [3200, 2165], span: 1.5,
alt: { he: 'תקריב של היחידה: ציפור ותותים', en: 'Close-up of the unit: a bird with strawberries' },
caption: { he: 'יחידה אחת שחוזרת ויוצרת דפוס', en: 'One unit repeated to create a pattern' },
open: { he: 'הצגת היחידה מקרוב', en: 'Show the unit up close' } } },
source: MORRIS },
{ kind: 'artwork', ask: Q3, askWith: Q4,
artwork: TAEUBER, source: TAEUBER_SRC },
{ kind: 'units', text: { he: ['אצל טאובר־ארפ הצורות חוזרות, אבל לא תמיד באותו אופן. השינויים בגודל, בכיוון ובמיקום יוצרים קצב ותנועה.'],
en: ["In Taeuber-Arp's work, shapes repeat, but not always in the same way. Changes in size, direction and position create rhythm and movement."] },
ask: Q4, askWith: Q3,
units: Object.assign({ boxes: [[0.39, 0.065, 0.605, 0.925], [0.705, 0.21, 0.78, 0.635], [0.07, 0.065, 0.24, 0.825]],
names: [{ he: 'העיגולים הגדולים במרכז', en: 'The large circles in the centre' }, { he: 'העיגולים הקטנים מימין', en: 'The smaller circles on the right' },
{ he: 'הריבועים משמאל', en: 'The squares on the left' }],
step: { first: { he: 'להדגיש קבוצה', en: 'Highlight a group' }, next: { he: 'הקבוצה הבאה', en: 'Next group' }, whole: { he: 'לראות את כל היצירה', en: 'See the whole work' } } }, TAEUBER),
source: TAEUBER_SRC,
askFirst: true,
inspireFoot: { label: { he: 'רוצים לגלות עוד אמנים?', en: 'Want to discover more artists?' }, section: 'artists' } },
{ step: 'medium', switchable: true, title: { he: 'עכשיו תורכם ליצור', en: "Now it's your turn to create" },
text: { he: ['בחרו צורה, קו או תנועה שמעניינים אתכם. אפשר להתחיל מיד, או לגלות עוד רעיונות.'], en: ['Choose a shape, line or movement that interests you. You can begin right away or explore more ideas.'] },
choices: { paper: { he: 'על נייר', en: 'On paper' }, studio: { he: 'בסטודיו', en: 'In the Studio' } },
studio: { activity: '2-1-create', back: 7 },
inspire: { label: { he: 'לגלות עוד השראה', en: 'Explore more inspiration' } } },
{ step: 'studio', studio: { activity: '2-1-create', back: 7 },
paper: { title: { he: 'יוצרים על נייר', en: 'Creating on paper' },
stages: { he: ['ציירו צורה, קו או תנועה שמעניינים אתכם.',
'נסו לחזור על מה שציירתם. מה קורה כשהצורה מופיעה שוב ושוב?',
'עכשיו נסו לשנות משהו: גודל, כיוון, מרחק או צבע. אפשר גם לחפוף צורות, לכסות ולצייר מעל. לא חייבים לשמור על דפוס מסודר.'],
en: ['Draw a shape, line or movement that interests you.',
'Try repeating what you drew. What happens when the shape appears again and again?',
"Now try changing something: size, direction, spacing or colour. You can also overlap shapes, cover parts and draw over them. Your pattern doesn't have to stay regular."] },
text: { he: ['<span class="pl-hint">הכינו דף ובחרו חומר שנעים לכם לעבוד איתו: עיפרון, טוש, פחם או עיפרון צבעוני.</span>'],
en: ['<span class="pl-hint">Prepare a sheet of paper and choose a material you enjoy working with: pencil, marker, charcoal or coloured pencil.</span>'] },
inspire: { label: { he: 'השראה', en: 'Inspiration' } } } },
{ step: 'end', work: true, text: { he: ['מה התחיל כחזרה, ומה קרה בדרך שלא תכננתם?'], en: ["What began as repetition, and what happened along the way that you didn't plan?"] },
studio: { activity: '2-1-free' },
more: [{ name: { he: 'מ"ק אשר', en: 'M. C. Escher' }, site: { he: 'האתר הרשמי של מ"ק אשר', en: 'Official M. C. Escher website' }, href: 'https://mcescher.com/gallery/symmetry/' },
{ name: { he: 'יאיוי קוסמה', en: 'Yayoi Kusama' }, site: { he: 'National Gallery of Art', en: 'National Gallery of Art' }, href: 'https://www.nga.gov/artworks/124183-infinity-nets-yellow' },
{ name: { he: 'סוניה דלונה', en: 'Sonia Delaunay' }, site: { he: 'The Metropolitan Museum of Art', en: 'The Metropolitan Museum of Art' }, href: 'https://www.metmuseum.org/art/collection/search/485826' },
{ name: { he: 'ברידג\'ט ריילי', en: 'Bridget Riley' }, site: { he: 'Yale Center for British Art', en: 'Yale Center for British Art' }, href: 'https://bridget-riley.publications.britishart.yale.edu/catalogue/1/' }] }
]
};
})();
