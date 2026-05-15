/* ============================================================
   LESSON 11 – מעבדת האמן: אדוארד הופר
   לעריכה: שנה כל שדה בחופשיות.
   ============================================================ */

const LESSON_11 = {
  id: 'lesson-11',
  num: '11',
  unit: 'יחידה 4 – מעבדת האמן',
  unitEn: 'Unit 4 – Artist Lab',
  unitColor: '#C9A96E',
  heroImage: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=1400&q=80',

  titleHe: 'מעבדת האמן: אדוארד הופר',
  titleEn: 'Artist Lab: Edward Hopper',

  metaIcon1: 'fa-solid fa-book-open',
  meta1He: 'שיעור 11',
  meta1En: 'Lesson 11',
  metaIcon2: 'fa-solid fa-clock',
  meta2He: '40 דקות תרגיל',
  meta2En: '40 min exercise',
  metaIcon3: 'fa-solid fa-lamp-desk',
  meta3He: 'ציור לאור יחיד',
  meta3En: 'Painting in single light',

  introTitle: { he: 'הבדידות שמאירה', en: 'The Loneliness that Illuminates' },
  introText: { he: 'הופר לא ציר "נוף אמריקאי" – הוא ציר את הנפש האמריקאית. תחנות דלק בלילה, מלון ריק, אישה ליד חלון. תמיד: אור אחד, דמות אחת, שאלה אחת שלא נשאלת. "אני לא ציר את מה שראיתי – ציירתי את מה שלא אמרתי." הסוד שלו: פחות = יותר. ריקנות היא נוכחות.', en: 'Hopper didn\'t paint the "American landscape" — he painted the American soul. Gas stations at night, empty hotel rooms, a woman by a window. Always: one light, one figure, one unasked question. "I didn\'t paint what I saw — I painted what I didn\'t say." His secret: less = more. Emptiness is presence.' },

  artistsSectionTitle: { he: 'אדוארד הופר – אמן הבדידות', en: 'Edward Hopper – The Artist of Solitude' },

  artists: [
    {
      avatar: '🌃',
      nameHe: 'אדוארד הופר (1882–1967)',
      nameEn: 'Edward Hopper (1882–1967)',
      styleHe: 'ריאליזם אמריקאי · בדידות ואור',
      styleEn: 'American Realism · Solitude & Light',
      bioHe: 'הופר עבד לאט ובמחשבה. ציור אחד יכול לקחת לו חודשים. הוא ישב שעות בקפה, במלון, ברחוב – מסתכל. אשתו ג\'וסף הייתה המודל הראשי שלו לכל הדמויות הנשיות. "הציור שלי הוא הדרך הביטוי הישיר ביותר שמצאתי לעצמי."',
      bioEn: 'Hopper worked slowly and thoughtfully. One painting could take him months. He sat for hours in cafes, hotels, streets — observing. His wife Josephine was his primary model for all female figures. "My painting is the most direct expression of myself I\'ve found."',
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Nighthawks_by_Edward_Hopper_1942.jpg/1280px-Nighthawks_by_Edward_Hopper_1942.jpg', altHe: 'הופר – ניטהוקס', altEn: 'Hopper – Nighthawks', captionHe: 'Nighthawks, 1942', captionEn: 'Nighthawks, 1942' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Edward_Hopper_-_House_by_the_Railroad_%281925%29.jpg/800px-Edward_Hopper_-_House_by_the_Railroad_%281925%29.jpg', altHe: 'הופר – בית ליד מסילה', altEn: 'Hopper – House by Railroad', captionHe: 'House by the Railroad, 1925', captionEn: 'House by the Railroad, 1925' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Edward_Hopper_-_Automat%2C_1927.jpg/800px-Edward_Hopper_-_Automat%2C_1927.jpg', altHe: 'הופר – אוטומט', altEn: 'Hopper – Automat', captionHe: 'Automat, 1927', captionEn: 'Automat, 1927' }
      ]
    }
  ],

  techniquesSectionTitle: { he: '4 כלי הופר שניתן לאמץ', en: '4 Hopper Tools You Can Adopt' },
  techniques: [
    { icon: '💡', titleHe: 'מקור אור יחיד', titleEn: 'Single Light Source', descHe: 'גדרי את הסצנה לאור אחד חזק. שאר הפינות – בצל עמוק.', descEn: 'Limit the scene to one strong light. Rest of the corners — deep shadow.' },
    { icon: '🪟', titleHe: 'חלון כמסגרת', titleEn: 'Window as Frame', descHe: 'חלון = ציור בתוך ציור. מה מחוצה? מה פנים? ניגוד חושך/אור.', descEn: 'Window = painting within a painting. What\'s outside? Inside? Dark/light contrast.' },
    { icon: '🚶', titleHe: 'דמות אחת', titleEn: 'One Figure', descHe: 'אל תעמיסי על הציור. דמות אחת אמיתית = סיפור שלם.', descEn: 'Don\'t overload the painting. One real figure = a complete story.' },
    { icon: '🔲', titleHe: 'ריקנות כנוכחות', titleEn: 'Emptiness as Presence', descHe: 'שאירי מקום ריק במכוון. הריק הוא חלק מהסיפור.', descEn: 'Leave empty space intentionally. The void is part of the story.' }
  ],

  exerciseTitle: { he: 'תרגיל: ציור לאור אחד', en: 'Exercise: Painting in One Light' },
  exerciseSeconds: 2400,
  exerciseTimerLabel: { he: '40 דקות', en: '40 minutes' },
  exerciseChecklist: [
    { he: 'חכי עד הדמדומים או הכבי כל האורות חוץ מנורה אחת.', en: 'Wait for dusk or turn off all lights except one lamp.' },
    { he: 'הציבי מולך חפץ אחד, כוס, ספר, נר – תחת האור היחיד.', en: 'Place one object before you, a cup, book, candle — under the single light.' },
    { he: 'ציירי רק את מה שהאור מגע בו. כל השאר – צל אחיד.', en: 'Paint only what the light touches. Everything else — uniform shadow.' },
    { he: 'שאלי: מה הסיפור של הדמות/חפץ הזה? כתבי משפט אחד.', en: 'Ask: what\'s the story of this figure/object? Write one sentence.' }
  ],

  quote: { he: '"אם תוכל לאמר זאת במילים, לא היה צורך לצייר אותו."', en: '"If you could say it in words, there would be no reason to paint it."' },
  quoteAuthor: '— אדוארד הופר',

  reflectionQ: { he: 'מה הבדידות שאת מצייר/ת בסטודיו שלך?', en: 'What loneliness do you paint in your studio?' },
  reflectionPlaceholder: { he: 'תארי רגע של בדידות יפה שחווית...', en: 'Describe a moment of beautiful solitude you experienced...' },

  prevLesson: { file: 'lesson-10.html', titleHe: 'אנשים, פנים וגאומטריה', titleEn: 'People, Faces & Geometry' },
  nextLesson: { file: 'lesson-12.html', titleHe: 'חפצים, שולחנות וחלונות', titleEn: 'Objects, Tables & Windows' }
};
