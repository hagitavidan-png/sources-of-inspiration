/*! Sources of Inspiration in Art | מקורות השראה באמנות. Original code and content (c) 2026 Hagit Avidan | חגית אבידן. All rights reserved | כל הזכויות שמורות. Works and materials by others belong to their owners | יצירות וחומרים של אחרים שייכים לבעליהם. See NOTICE.txt */
window.INSPIRATION = window.INSPIRATION || {};
(function () {
var P = 'images/2-2/';
function C(file) { return 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(file.replace(/ /g, '_')); }
var PD = { he: 'נחלת הכלל', en: 'Public domain' };
var HAECKEL = { he: 'הקל היה מדען ואמן. הוא רשם יצורים זעירים כפי שנראו דרך מיקרוסקופ, וגילה בהם צורות מדויקות ומפתיעות.',
en: 'Haeckel was a scientist and an artist. He drew tiny creatures as he saw them through a microscope, and found precise, surprising forms in them.' };
function hk(id, size, he, en, file) {
return { img: P + id + '.jpg', size: size, artist: { he: 'ארנסט הקל', en: 'Ernst Haeckel' }, work: { he: he + ', 1904', en: en + ', 1904' },
alt: { he: 'ארנסט הקל, ' + he + ', 1904', en: 'Ernst Haeckel, ' + en + ', 1904' }, text: HAECKEL, credit: { who: 'Ernst Haeckel', licence: PD, href: C(file) } };
}
function bl(id, size, he, en, file) {
return { img: P + id + '.jpg', size: size, artist: { he: 'קרל בלוספלדט', en: 'Karl Blossfeldt' }, work: { he: he + ', 1928', en: en + ', 1928' },
alt: { he: 'קרל בלוספלדט, ' + he + ', 1928', en: 'Karl Blossfeldt, ' + en + ', 1928' }, credit: { who: 'Getty Open Content', licence: PD, href: C(file) } };
}
window.INSPIRATION['2-2-close'] = {
sections: [
{ id: 'nature', title: { he: 'עולמות קטנים בטבע', en: 'Small worlds in nature' }, items: [
{ img: P + 'n3.jpg', size: [960, 640], alt: { he: 'חזזית כתומה על בטון', en: 'Orange lichen on concrete' },
credit: { who: 'Pseudopanax', licence: { he: 'נחלת הכלל', en: 'Public domain' }, href: C('Orange lichen (Xanthoria parietina) on concrete.jpg') } },
{ img: P + 'n6.jpg', size: [960, 636], alt: { he: 'דליה מקרוב', en: 'A dahlia, close up' },
credit: { who: 'Konatom1', licence: 'CC0', href: C('DSC 2800.jpg') } },
{ img: P + 'n4.jpg', size: [960, 703], alt: { he: 'בועה קפואה וגבישי קרח', en: 'A frozen bubble with ice crystals' },
credit: { who: 'Aaron Burden', licence: 'CC0', href: C('Frozen snowflake bubble (Unsplash).jpg') } },
{ img: P + 'n9.jpg', size: [960, 739], alt: { he: 'דבורת בנייה, מלמעלה', en: 'A mason bee, from above' },
credit: { who: 'USGS Bee Inventory and Monitoring Lab', licence: { he: 'נחלת הכלל', en: 'Public domain' }, href: C('Osmia trevoris, F, back - Park Co., Wyoming - 2015-11-20-23.38 - USGS Bee Inventory and Monitoring Laboratory.jpg') } },
{ img: P + 'n11.jpg', size: [960, 720], alt: { he: 'צבע מתקלף', en: 'Peeling paint' },
credit: { who: 'Georges Grondin', licence: { he: 'נחלת הכלל', en: 'Public domain' }, href: C('Painted conrete.jpg') } },
{ img: P + 'n5.jpg', size: [960, 769], alt: { he: 'ראש זרעים של שן הארי', en: 'A dandelion seed head' },
credit: { who: 'Jebulon', licence: 'CC0', href: C('Taraxacum obovatum seedhead.jpg') } },
{ img: P + 'n12.jpg', size: [960, 720], alt: { he: 'אדוות בחול', en: 'Sand ripples' },
credit: { who: 'NOAA Photo Library', licence: { he: 'נחלת הכלל', en: 'Public domain' }, href: C('Line6809 (27662155890).jpg') } },
{ img: P + 'n7.jpg', size: [960, 639], alt: { he: 'קקטוס חבית, קוצים ופרחים', en: 'A barrel cactus, thorns and flowers' },
credit: { who: 'Gentry George, U.S. Fish and Wildlife Service', licence: { he: 'נחלת הכלל', en: 'Public domain' }, href: C('Close up of a flowering barrel cactus with its thorns.jpg') } },
{ img: P + 'n8.jpg', size: [960, 840], alt: { he: 'מאובן של שפירית', en: 'A dragonfly fossil' },
credit: { who: 'National Park Service', licence: { he: 'נחלת הכלל', en: 'Public domain' }, href: C('Zacallites cockerelli FOBU.jpg') } },
{ img: P + 'n10.jpg', size: [960, 1577], alt: { he: 'בצל סגול חתוך', en: 'A red onion, cut' },
credit: { who: 'Amada44', licence: { he: 'נחלת הכלל', en: 'Public domain' }, href: C('Red onion cut.jpg') } },
{ img: P + 'n1.jpg', size: [960, 720], alt: { he: 'ברוקולי רומנסקו', en: 'Romanesco' },
credit: { who: 'Benoît Prieur', licence: 'CC0', href: C('Chou romanesco - Boucheries André (Rillieux-la-Pape) - 1.jpg') } },
{ img: P + 'n2.jpg', size: [960, 1440], alt: { he: 'אלוורה ספירלי, מלמעלה', en: 'Spiral aloe, from above' },
credit: { who: 'Pseudopanax', licence: { he: 'נחלת הכלל', en: 'Public domain' }, href: C('Spiral aloe spirals from top.jpg') } }
] },
{ id: 'artists', title: { he: 'אמנים', en: 'Artists' }, items: [
hk('h1', [960, 1352], 'דיאטומאה', 'Diatomea', 'Haeckel Diatomea.jpg'),
hk('h2', [960, 1345], 'דסמידיאה', 'Desmidiea', 'Haeckel Desmidiea.jpg'),
hk('h3', [960, 1361], 'ספומלריה', 'Spumellaria', 'Haeckel Spumellaria.jpg'),
bl('b4', [960, 1245], 'אקנתוס רך', 'Acanthus mollis', 'Karl Blossfeldt. Acanthus mollis, 1928.jpg'),
bl('b1', [960, 1222], 'דלעת', 'Cucurbita (pumpkin)', 'Karl Blossfeldt. Cucurbita, 1928.jpg')
],
links: [
{ name: { he: 'ג׳ורג׳יה אוקיף', en: "Georgia O'Keeffe" }, work: { he: 'פרח לבן, 1932', en: 'Jimson Weed/White Flower No. 1, 1932' },
text: { he: 'אוקיף ציירה פרחים מקרוב כל כך, עד שהפרטים הקטנים הפכו לצורות גדולות ומפתיעות.', en: "O'Keeffe painted flowers so close up that their small details became large, surprising shapes." },
href: 'https://crystalbridges.org/artworks/2014-35', site: { he: 'Crystal Bridges Museum of American Art', en: 'Crystal Bridges Museum of American Art' } }
] }
]
};
})();
