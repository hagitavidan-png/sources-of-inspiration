/*! Sources of Inspiration in Art | מקורות השראה באמנות. Original code and content (c) 2026 Hagit Avidan | חגית אבידן. All rights reserved | כל הזכויות שמורות. Works and materials by others belong to their owners | יצירות וחומרים של אחרים שייכים לבעליהם. See NOTICE.txt */
window.APP_LESSONS = window.APP_LESSONS || {};
(function () {
var P = 'images/2-2/';
function C(file) { return 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(file.replace(/ /g, '_')); }
function nat(id, size, he, en, who, licence, file) {
return { id: id, img: P + id, hi: P + 'hi/' + id, size: size, alt: { he: he, en: en }, credit: { who: who, licence: licence, href: C(file) } };
}
function pick(ids) { return ids.map(function (id) { return NATURE.filter(function (n) { return n.id === id; })[0]; }); }
var NATURE = [
nat('n1', [960, 720], 'ברוקולי רומנסקו', 'Romanesco', 'Benoît Prieur', 'CC0', 'Chou romanesco - Boucheries André (Rillieux-la-Pape) - 1.jpg'),
nat('n2', [960, 1440], 'אלוורה ספירלי, מלמעלה', 'Spiral aloe, from above', 'Pseudopanax', 'Public domain', 'Spiral aloe spirals from top.jpg'),
nat('n3', [960, 640], 'חזזית כתומה על בטון', 'Orange lichen on concrete', 'Pseudopanax', 'Public domain', 'Orange lichen (Xanthoria parietina) on concrete.jpg'),
nat('n4', [960, 703], 'בועה קפואה וגבישי קרח', 'A frozen bubble with ice crystals', 'Aaron Burden', 'CC0', 'Frozen snowflake bubble (Unsplash).jpg'),
nat('n5', [960, 769], 'ראש זרעים של שן הארי', 'A dandelion seed head', 'Jebulon', 'CC0', 'Taraxacum obovatum seedhead.jpg'),
nat('n6', [960, 636], 'דליה מקרוב', 'A dahlia, close up', 'Konatom1', 'CC0', 'DSC 2800.jpg'),
nat('n7', [960, 639], 'קקטוס חבית, קוצים ופרחים', 'A barrel cactus, thorns and flowers', 'Gentry George, U.S. Fish and Wildlife Service', 'Public domain', 'Close up of a flowering barrel cactus with its thorns.jpg'),
nat('n8', [960, 840], 'מאובן של שפירית', 'A dragonfly fossil', 'National Park Service', 'Public domain', 'Zacallites cockerelli FOBU.jpg'),
nat('n9', [960, 739], 'דבורת בנייה, מלמעלה', 'A mason bee, from above', 'USGS Bee Inventory and Monitoring Lab', 'Public domain', 'Osmia trevoris, F, back - Park Co., Wyoming - 2015-11-20-23.38 - USGS Bee Inventory and Monitoring Laboratory.jpg'),
nat('n10', [960, 1577], 'בצל סגול חתוך', 'A red onion, cut', 'Amada44', 'Public domain', 'Red onion cut.jpg'),
nat('n11', [960, 720], 'צבע מתקלף', 'Peeling paint', 'Georges Grondin', 'Public domain', 'Painted conrete.jpg'),
nat('n12', [960, 720], 'אדוות בחול', 'Sand ripples', 'NOAA Photo Library', 'Public domain', 'Line6809 (27662155890).jpg')
];
var ORDER = ['n6', 'n3', 'n4', 'n11', 'n7', 'n9', 'n5', 'n8', 'n2', 'n1'], FIRST = 6, RETIRED = ['n10', 'n12'];
var GALLERY = pick(ORDER), OUT = pick(RETIRED);
function art(id, size, artist, work, alt, who, licence, file) {
return { img: P + id, size: size, artist: artist, workTitle: work, alt: alt, credit: { who: who, licence: licence, href: C(file) } };
}
window.APP_LESSONS['2-2-close'] = {
adapter: 'guide',
unit: 'unit02',
nav: { unit: 'unit02', path: 'lessons/lesson-2-3.html', title: { he: 'מקרוב מאוד', en: 'Up Close' } },
langs: ['he', 'en'],
artworkActivity: '2-2-close-draw',
wordsFirst: true,
boardCaptions: true,
bigViewer: true,
boardColumns: true,
bareImages: true,
works: true,
retry: 3,
paperScreen: 7,
intro: {
info: { he: 'כ־50 דקות · {n} שלבים', en: 'About 50 minutes · {n} steps' },
subtitle: { he: 'צורות, קווים ומרקמים שמתגלים מקרוב', en: 'Forms, lines and textures revealed up close' },
question: { he: 'מה מתגלה כשמסתכלים ממש מקרוב, ומה אפשר ליצור מתוך מה שגילינו?', en: 'What can we discover by looking really closely, and what can we create from what we find?' },
start: { he: 'מתחילים את השיעור', en: 'Start the lesson' },
resume: { he: 'ממשיכים מהמקום שעצרתי', en: 'Continue where I left off' }
},
page: {
number: '2.2', unitNum: '02',
title: { he: 'מקרוב מאוד', en: 'Up Close' },
unit: { he: 'מבט החוצה', en: 'Looking Outward' },
time: null,
sections: {}
},
closeup: {
personalPhoto: false,
gallery: GALLERY,
first: FIRST,
retired: OUT,
zoom: [2, 8],
worlds: 3,
shrink: { list: [{ src: 'n8', from: 5, at: '68% 24%' },
{ src: 'n3', from: 5, at: '70% 70%' },
{ src: 'n4', from: 5, at: '56% 36%' }] },
pair: {
blossfeldt: { img: P + 'b4', size: [960, 1245], name: { he: 'קרל בלוספלדט', en: 'Karl Blossfeldt' }, way: { he: 'צילום', en: 'Photography' },
work: { he: 'אקנתוס רך, 1928', en: 'Acanthus mollis, 1928' }, alt: { he: 'קרל בלוספלדט, אקנתוס רך, 1928', en: 'Karl Blossfeldt, Acanthus mollis, 1928' },
guess: { he: 'מה זה נראה לכם?', en: 'What does this look like to you?' },
text: { he: 'בלוספלדט צילם צמחים מקרוב, ובצילומיו חלקים קטנים של צמחים נראים כמו פסלים או מבנים.', en: 'Blossfeldt photographed plants up close, and in his photographs small parts of plants look like sculptures or buildings.' },
credit: { who: 'Getty Open Content', licence: 'Public domain', href: C('Karl Blossfeldt. Acanthus mollis, 1928.jpg') } },
okeeffe: { name: { he: 'ג׳ורג׳יה אוקיף', en: "Georgia O'Keeffe" }, way: { he: 'ציור', en: 'Painting' }, work: { he: 'פרח לבן, 1932', en: 'Jimson Weed/White Flower No. 1, 1932' },
text: { he: 'אוקיף ציירה פרחים מקרוב כל כך, עד שהפרטים הקטנים הפכו לצורות גדולות ומפתיעות.', en: "O'Keeffe painted flowers so close up that their small details became large, surprising shapes." } }
},
stays: { src: 'n6', caption: { he: 'אותו פרח, שלוש דרכי הסתכלות', en: 'The same flower, three ways of looking' } },
okeeffe: { img: P + 'd1', size: [960, 960], href: 'https://crystalbridges.org/artworks/2014-35',
credit: { who: 'Dlarsen', licence: 'Public domain', href: C('Datura wrightii flower2.jpg') } }
},
artists: [
{ id: 'blossfeldt', name: { he: 'קרל בלוספלדט', en: 'Karl Blossfeldt' }, way: { he: 'צילום', en: 'Photography' }, board: 'blossfeldt',
text: { he: ['קרל בלוספלדט צילם צמחים מקרוב וחשף פרטים וצורות שקשה להבחין בהם במבט רגיל. בצילומיו, חלקים קטנים של צמחים נראים לעיתים כמו פסלים או מבנים.',
'כשמסתכלים מקרוב, צורות מוכרות יכולות להיראות כמו משהו אחר לגמרי.'],
en: ['Karl Blossfeldt photographed plants up close and revealed details and shapes that are hard to see at a glance. In his photographs, small parts of plants sometimes look like sculptures or buildings.',
'When you look closely, familiar shapes can look like something completely different.'] },
ask: { he: 'מה אתם מגלים בתמונה?', en: 'What do you discover in the picture?' } },
{ id: 'okeeffe', name: { he: 'ג׳ורג׳יה אוקיף', en: "Georgia O'Keeffe" }, way: { he: 'ציור', en: 'Painting' }, special: 'okeeffe',
work: { he: 'פרח לבן, 1932', en: 'Jimson Weed/White Flower No. 1, 1932' },
text: { he: ['אוקיף ציירה פרחים מקרוב כל כך, עד שהפרטים הקטנים הפכו לצורות גדולות ומפתיעות.'],
en: ["O'Keeffe painted flowers so close up that their small details became large, surprising shapes."] },
ask: { he: 'מה אתם מגלים כשמתקרבים לפרח?', en: 'What do you discover when you get close to the flower?' } },
{ id: 'haeckel', name: { he: 'ארנסט הקל', en: 'Ernst Haeckel' }, way: { he: 'רישום', en: 'Drawing' }, board: 'haeckel',
text: { he: ['הקל היה מדען ואמן. הוא רשם יצורים זעירים כפי שנראו דרך מיקרוסקופ, וגילה בהם צורות מדויקות ומפתיעות.'],
en: ['Haeckel was a scientist and an artist. He drew tiny creatures as he saw them through a microscope, and found precise, surprising forms in them.'] },
ask: { he: 'מה מתגלה כשמתקרבים יותר ממה שהעין רואה?', en: 'What do you discover when you get closer than the eye can see?' } }
],
layout: 6,
screenMaps: (function () {
var to6 = { 1: 1, 2: 2, 3: 4, 4: 5, 5: 7, 6: 8 };
var before = { old: { 1: 1, 2: 2, 3: 2, 4: 2, 5: 2, 6: 3, 7: 3, 8: 3, 9: 4, 10: 4, 11: 5, 12: 6, 13: 6 },
2: { 1: 1, 2: 2, 3: 2, 4: 3, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 6, 11: 6 },
3: { 1: 1, 2: 2, 3: 2, 4: 3, 5: 3, 6: 4, 7: 5, 8: 6 },
4: { 1: 1, 2: 2, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6 } };
var maps = { 5: to6 };
Object.keys(before).forEach(function (k) { maps[k] = {}; Object.keys(before[k]).forEach(function (n) { maps[k][n] = to6[before[k][n]]; }); });
return maps;
})(),
studioReturn: { from: 6, 3: 4, 6: 8 },
boards: {
small: pick(['n3', 'n4', 'n6', 'n7']).map(function (n) { return { img: n.img, size: n.size, alt: n.alt, credit: n.credit }; }),
blossfeldt: [
art('b1', [960, 1222], { he: 'קרל בלוספלדט', en: 'Karl Blossfeldt' }, { he: 'דלעת, 1928', en: 'Cucurbita (pumpkin), 1928' },
{ he: 'קרל בלוספלדט, דלעת, 1928', en: 'Karl Blossfeldt, Cucurbita, 1928' }, 'Getty Open Content', 'Public domain', 'Karl Blossfeldt. Cucurbita, 1928.jpg'),
art('b4', [960, 1245], { he: 'קרל בלוספלדט', en: 'Karl Blossfeldt' }, { he: 'אקנתוס רך, 1928', en: 'Acanthus mollis, 1928' },
{ he: 'קרל בלוספלדט, אקנתוס רך, 1928', en: 'Karl Blossfeldt, Acanthus mollis, 1928' }, 'Getty Open Content', 'Public domain', 'Karl Blossfeldt. Acanthus mollis, 1928.jpg')
],
haeckel: [
art('h1', [960, 1352], { he: 'ארנסט הקל', en: 'Ernst Haeckel' }, { he: 'דיאטומאה, 1904', en: 'Diatomea, 1904' },
{ he: 'ארנסט הקל, דיאטומאה, 1904', en: 'Ernst Haeckel, Diatomea, 1904' }, 'Ernst Haeckel', 'Public domain', 'Haeckel Diatomea.jpg'),
art('h2', [960, 1345], { he: 'ארנסט הקל', en: 'Ernst Haeckel' }, { he: 'דסמידיאה, 1904', en: 'Desmidiea, 1904' },
{ he: 'ארנסט הקל, דסמידיאה, 1904', en: 'Ernst Haeckel, Desmidiea, 1904' }, 'Ernst Haeckel', 'Public domain', 'Haeckel Desmidiea.jpg'),
art('h3', [960, 1361], { he: 'ארנסט הקל', en: 'Ernst Haeckel' }, { he: 'ספומלריה, 1904', en: 'Spumellaria, 1904' },
{ he: 'ארנסט הקל, ספומלריה, 1904', en: 'Ernst Haeckel, Spumellaria, 1904' }, 'Ernst Haeckel', 'Public domain', 'Haeckel Spumellaria.jpg')
]
},
actions: {
anotherTime: { he: 'להמשיך בפעם אחרת', en: 'Come back to it later' },
keepCreating: { he: 'להמשיך ליצור', en: 'Keep creating' },
doneForNow: { he: 'לעצור ולהסתכל', en: 'Stop and look' },
finishedCreating: { he: 'סיימתי ליצור', en: "I've finished creating" },
toStudio: { he: 'ממשיכים לסטודיו', en: 'Continue to Studio' }
},
screens: [
{ kind: 'shrink', title: { he: 'מה מסתתר בפרטים הקטנים?', en: 'What might be hiding in the smallest details?' },
ask: { he: 'מה גיליתם כשהתקרבתם?', en: 'What did you discover as you moved closer?' } },
{ kind: 'pair', title: { he: 'שתי דרכים להתקרב', en: 'Two Ways to Get Close' },
question: { he: 'במה בחרו האמנים להתמקד, ואיך הבחירה הזאת משנה את מה שאנחנו רואים?', en: 'What did the artists choose to focus on, and how does that choice change what we see?' },
inspire: { label: { he: 'רוצים לגלות עוד? ארנסט הקל ←', en: 'Want to discover more? Ernst Haeckel →' }, section: 'artists' } },
{ kind: 'gallery', title: { he: 'מה מסקרן אתכם?', en: 'What catches your eye?' } },
{ kind: 'discover', needSave: true, title: { he: 'התבוננו מקרוב', en: 'Look closely' },
hint: { he: 'התקרבו וגלו פרטים שמסקרנים אתכם.', en: 'Zoom in and discover details that make you curious.' } },
{ kind: 'world', choose: true, title: { he: 'מהפרט ליצירה', en: 'From Detail to Artwork' },
after: { he: ['<b>עכשיו צרו משהו חדש מהפרט שבחרתם.</b>', 'אפשר להגדיל, לשנות, לפרק, להוסיף ולהמציא.'],
en: ['<b>Now create something new from the detail you chose.</b>', 'You can enlarge it, change it, break it apart, add to it, or invent something new.'] } },
{ kind: 'how', step: 'medium', switchable: true, title: { he: 'איך תרצו ליצור?', en: 'How would you like to create?' },
choices: { paper: { he: 'על נייר', en: 'On paper' }, studio: { he: 'בסטודיו', en: 'In the Studio' } },
studio: { activity: '2-2-close-draw', back: 'end' } },
{ step: 'studio', kind: 'detailPaper', studio: { activity: '2-2-close-draw', back: 'end' },
paper: { title: { he: 'יוצרים על נייר', en: 'Creating on paper' },
stages: { he: ['התבוננו בפרט שבחרתם. אילו צורות, קווים ומרקמים אתם מגלים?',
'התחילו לצייר מתוך משהו שמסקרן אתכם בפרט.',
'שנו, הוסיפו והמציאו. לאן הציור שלכם יכול להתפתח?'],
en: ['Look at the detail you chose. What shapes, lines and textures do you discover?',
'Start drawing from something in the detail that makes you curious.',
'Change, add and invent. Where could your drawing go from here?'] },
text: { he: ['<span class="pl-hint">הכינו דף ובחרו חומר שנעים לכם לעבוד איתו: עיפרון, טוש, פחם או עיפרון צבעוני.</span>'],
en: ['<span class="pl-hint">Prepare a sheet of paper and choose a material you enjoy working with: pencil, marker, charcoal or coloured pencil.</span>'] },
inspire: { label: { he: 'השראה', en: 'Inspiration' } } } },
{ step: 'end', work: true, kind: 'compare', anotherArea: true, keepMain: true, detailOnly: true, studio: { activity: '2-2-close-draw' },
title: { he: 'מקור ההשראה והציור שלכם', en: 'Your source and your drawing' },
ask: { he: 'מה נשאר מהפרט, ומה השתנה?', en: 'What remained from the detail, and what changed?' },
text: { he: ['התחלתם מפרט קטן, ויצרתם ממנו משהו משלכם.'], en: ['You started with a small detail and created something of your own.'] },
paperLine: { he: 'הניחו את הציור שלכם ליד המסך.', en: 'Place your drawing next to the screen.' } }
]
};
})();
