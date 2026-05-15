/* ============================================================
   LESSON 05 – מרקמים, עונות ופרטים זעירים
   ============================================================ */

const LESSON_05 = {
  id: 'lesson-05',
  num: '05',
  unit: 'יחידה 2 – העולם הטבעי',
  unitEn: 'Unit 2 – The Natural World',
  unitColor: '#4CAF7D',
  heroImage: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1400&q=80',

  titleHe: 'מרקמים, עונות ופרטים זעירים',
  titleEn: 'Textures, Seasons & Tiny Details',

  metaIcon1: 'fa-solid fa-book-open', meta1He: 'שיעור 05', meta1En: 'Lesson 05',
  metaIcon2: 'fa-solid fa-clock',     meta2He: '25 דקות', meta2En: '25 minutes',
  metaIcon3: 'fa-solid fa-feather',   meta3He: 'קו שמרגיש', meta3En: 'The Line that Feels',

  introTitle: { he: 'העולם מתחת לאצבעות', en: 'The World Under Our Fingertips' },
  introText: { he: 'דורר ציר ארנב בשנת 1502 – לא ציור גדול, לא מחווה דרמטית, אלא תצפית מדוקדקת על בעל חיים קטן. כל שערה, כל צל, כל מרקט של הפרווה. הפרט הזעיר הוא עולם שלם. כשאנחנו מאטים ומסתכלים קרוב, אנחנו מגלים שכל עלה, כל קליפה, כל מרקט של אדמה – הם יצירות אמנות בפני עצמן. השיעור: קרבה = השראה.', en: 'Dürer painted a young hare in 1502 — not a grand painting, not a dramatic gesture, but a careful observation of a small animal. Every hair, every shadow, every texture of the fur. The tiny detail is a whole world. When we slow down and look closely, we discover that every leaf, every shell, every soil texture — are works of art in themselves. The lesson: closeness = inspiration.' },

  artistsSectionTitle: { he: 'אמנים שציירו מרקמים', en: 'Artists Who Painted Textures' },
  artists: [
    {
      avatar: '🐇',
      nameHe: 'אלברכט דורר (1471–1528)',
      nameEn: 'Albrecht Dürer (1471–1528)',
      styleHe: 'רנסנס גרמני · תצפית מרקמים',
      styleEn: 'German Renaissance · Texture Observation',
      bioHe: 'דורר ציר ארנב בשנת 1502 — לא ציור גדול, אלא תצפית מדוקדקת על בעל חיים קטן. כל שערה, כל צל, כל מרקט של פרווה. פרט אחד שלם ומדויק. "הטבע מלא ביופי נסתר — האמן הוא זה שחושף אותו."',
      bioEn: 'Dürer painted a hare in 1502 — not a grand painting, but a careful observation of a small animal. Every hair, every shadow, every texture of fur. One complete and precise detail. "Nature is full of hidden beauty — the artist is the one who reveals it."',
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Albrecht_D%C3%BCrer_-_Young_Hare%2C_1502_-_Google_Art_Project.jpg/900px-Albrecht_D%C3%BCrer_-_Young_Hare%2C_1502_-_Google_Art_Project.jpg', altHe: 'דורר – ארנב צעיר', altEn: 'Dürer – Young Hare', captionHe: 'Young Hare, 1502 — מרקט שיער', captionEn: 'Young Hare, 1502 — Hair Texture' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Albrecht_D%C3%BCrer_-_Wing_of_a_Blue_Roller_-_Google_Art_Project.jpg/800px-Albrecht_D%C3%BCrer_-_Wing_of_a_Blue_Roller_-_Google_Art_Project.jpg', altHe: 'דורר – כנף', altEn: 'Dürer – Wing', captionHe: 'Wing of a Roller, 1512 — נוצות', captionEn: 'Wing of a Roller, 1512 — Feathers' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Albrecht_D%C3%BCrer_-_Large_Piece_of_Turf_-_Google_Art_Project.jpg/800px-Albrecht_D%C3%BCrer_-_Large_Piece_of_Turf_-_Google_Art_Project.jpg', altHe: 'דורר – דשא', altEn: 'Dürer – Large Piece of Turf', captionHe: 'Large Piece of Turf, 1503', captionEn: 'Large Piece of Turf, 1503' }
      ]
    },
    {
      avatar: '🌾',
      nameHe: 'ווינסנט ון גוך (1853–1890)',
      nameEn: 'Vincent van Gogh (1853–1890)',
      styleHe: 'פוסט-אימפרסיוניזם · מרקט ואנרגיה',
      styleEn: 'Post-Impressionism · Texture & Energy',
      bioHe: 'ון גוך ציר את "ליל הכוכבים" עם מכחולים עבים ועוצמתיים — כל משיחה גלויה וחיה. המרקט של ציורו הוא חלק מהמסר. הוא ציר דשא, עלים, חיטה — תמיד עם אנרגיה ותנועה.',
      bioEn: 'Van Gogh painted "Starry Night" with thick, powerful brushstrokes — every stroke visible and alive. The texture of his paintings is part of the message. He painted grass, leaves, wheat — always with energy and movement.',
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg', altHe: 'ון גוך – ליל כוכבים', altEn: 'Van Gogh – Starry Night', captionHe: 'The Starry Night, 1889 — מרקט מכחול', captionEn: 'The Starry Night, 1889 — Brushstroke Texture' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Vase_with_Fifteen_Sunflowers_F458.jpg/800px-Vase_with_Fifteen_Sunflowers_F458.jpg', altHe: 'ון גוך – חמניות', altEn: 'Van Gogh – Sunflowers', captionHe: 'Sunflowers, 1888', captionEn: 'Sunflowers, 1888' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Paul_C%C3%A9zanne_-_Mont_Sainte-Victoire_-_Google_Art_Project.jpg/1280px-Paul_C%C3%A9zanne_-_Mont_Sainte-Victoire_-_Google_Art_Project.jpg', altHe: 'סזאן – הר', altEn: 'Cézanne – Mountain', captionHe: 'סזאן — Mont Sainte-Victoire, ~1887', captionEn: 'Cézanne — Mont Sainte-Victoire, ~1887' }
      ]
    }
  ],

  techniquesSectionTitle: { he: '4 עונות = 4 פלטות צבע', en: '4 Seasons = 4 Color Palettes' },
  techniques: [
    { icon: '🌸', titleHe: 'אביב – לידה ורעננות', titleEn: 'Spring – Birth & Freshness', descHe: 'ירוקים צעירים, ורדרד, לבן. קווים עדינים ורכים. הכל עדיין לא גמור.', descEn: 'Young greens, pink, white. Delicate soft lines. Nothing is finished yet.' },
    { icon: '☀️', titleHe: 'קיץ – שפע ועוצמה', titleEn: 'Summer – Abundance & Power', descHe: 'ירוקים כהים, צהובים, כחול עמוק. קווים חזקים. מלא ועמוס.', descEn: 'Dark greens, yellows, deep blue. Strong lines. Full and dense.' },
    { icon: '🍂', titleHe: 'סתיו – שינוי ושחרור', titleEn: 'Autumn – Change & Release', descHe: 'כתומים, אדומים, חומים. קווי נפילה. יופי של שינוי.', descEn: 'Oranges, reds, browns. Falling lines. The beauty of change.' },
    { icon: '❄️', titleHe: 'חורף – שתיקה ועומק', titleEn: 'Winter – Silence & Depth', descHe: 'לבן, אפור, כחול קר. קווים חסכוניים. הצורה בלי הקישוט.', descEn: 'White, gray, cold blue. Sparse lines. Form without ornamentation.' }
  ],

  exerciseTitle: { he: 'תרגיל: 5 מרקמים מהחצר', en: 'Exercise: 5 Textures from the Yard' },
  exerciseSeconds: 1500,
  exerciseTimerLabel: { he: '25 דקות', en: '25 minutes' },
  exerciseChecklist: [
    { he: 'צאי לחצר / גינה / רחוב. מצאי 5 משטחים שונים.', en: 'Go to the yard / garden / street. Find 5 different surfaces.' },
    { he: 'גרדי / ציירי כל מרקט בקטע קטן של 5×5 ס"מ.', en: 'Scratch / paint each texture in a small 5×5 cm section.' },
    { he: 'לכל מרקט – נסי ליצור אותו גם עם צבע, גם בעיפרון.', en: 'For each texture — try creating it both with color and with pencil.' },
    { he: 'כתבי ליד כל מרקט: עונה אחת שהוא מזכיר לך.', en: 'Write next to each texture: one season it reminds you of.' }
  ],

  quote: { he: '"הטבע הוא לא רק מה שנראה לעין – הוא גם מה שנחוש בנשמה."', en: '"Nature is not only what is visible to the eye — it is also what is felt by the soul."' },
  quoteAuthor: '— אלברכט דורר',

  reflectionQ: { he: 'מה מרקט גילית שלא ידעת קיים?', en: 'What texture did you discover that you didn\'t know existed?' },
  reflectionPlaceholder: { he: 'תאר/י מרקט אחד שהפתיע אותך...', en: 'Describe one texture that surprised you...' },

  prevLesson: { file: 'lesson-04.html', titleHe: 'אור, אווירה ומים', titleEn: 'Light, Atmosphere & Water' },
  nextLesson: { file: 'lesson-06.html', titleHe: 'פלטות צבע מהטבע', titleEn: 'Color Palettes from Nature' }
};
