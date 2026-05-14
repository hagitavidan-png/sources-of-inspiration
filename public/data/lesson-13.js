/* ============================================================
   LESSON 13 – דרמת האור הביתי
   לעריכה: שנה כל שדה בחופשיות.
   ============================================================ */

const LESSON_13 = {
  id: 'lesson-13',
  num: '13',
  unit: 'יחידה 5 – עולם הבית',
  unitEn: 'Unit 5 – The Home World',
  unitColor: '#4A90E2',
  heroImage: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1400&q=80',

  titleHe: 'דרמת האור הביתי',
  titleEn: 'Home Light Drama',

  metaIcon1: 'fa-solid fa-book-open',
  meta1He: 'שיעור 13',
  meta1En: 'Lesson 13',
  metaIcon2: 'fa-solid fa-clock',
  meta2He: '30 דקות',
  meta2En: '30 minutes',
  metaIcon3: 'fa-solid fa-candle-holder',
  meta3He: 'ציור לאור נרות',
  meta3En: 'Painting by candlelight',

  introTitle: { he: 'רמברנדט הגיע אליך הביתה', en: 'Rembrandt Came to Your Home' },
  introText: { he: 'רמברנדט לא גילה אור חדש – הוא גילה שמה שחשוב הוא לא אוֹר אלא חושך. הוא ציר בשיטת "כיארוסקורו" – ניגוד קיצוני בין אור לצל. הסוד: כמה שפחות אור, כמה שיותר דרמה. כל נר יחיד, כל חלון בלילה, כל מנורה מעל שולחן – אלה הם ה"מצלמות" שרמברנדט היה משתמש בהן אם חי היום.', en: 'Rembrandt didn\'t discover a new light — he discovered that what matters isn\'t light, but darkness. He painted in "chiaroscuro" — extreme contrast between light and shadow. The secret: the less light, the more drama. Every single candle, every nighttime window, every lamp above a table — these are the "cameras" Rembrandt would have used if he lived today.' },

  artistsSectionTitle: { he: 'אמני האור הדרמטי', en: 'Artists of Dramatic Light' },

  artists: [
    {
      avatar: '🕯️',
      nameHe: 'רמברנדט ון ריין (1606–1669)',
      nameEn: 'Rembrandt van Rijn (1606–1669)',
      styleHe: 'ברוק הולנדי · כיארוסקורו',
      styleEn: 'Dutch Baroque · Chiaroscuro',
      bioHe: 'רמברנדט ציר מאות דיוקנאות עצמיים – יותר מכל אמן בהיסטוריה. הוא ציר את עצמו בכל גיל, ברגעי שמחה ועצב. האור שלו תמיד: מקור אחד, חזק, מהצד. "כשהאור פוגש בצל – שם נמצאת הנשמה."',
      bioEn: 'Rembrandt painted hundreds of self-portraits — more than any artist in history. He painted himself at every age, in moments of joy and sadness. His light always: one source, strong, from the side. "Where light meets shadow — that\'s where the soul lives."',
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg/800px-Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg', altHe: 'רמברנדט – דיוקן עצמי', altEn: 'Rembrandt – Self-Portrait', captionHe: 'Self-Portrait, 1659', captionEn: 'Self-Portrait, 1659' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/The_Night_Watch_by_Rembrandt.jpg/1280px-The_Night_Watch_by_Rembrandt.jpg', altHe: 'רמברנדט – משמר הלילה', altEn: 'Rembrandt – The Night Watch', captionHe: 'The Night Watch, 1642', captionEn: 'The Night Watch, 1642' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Rembrandt_-_The_Anatomy_Lesson_of_Dr_Nicolaes_Tulp.jpg/1280px-Rembrandt_-_The_Anatomy_Lesson_of_Dr_Nicolaes_Tulp.jpg', altHe: 'רמברנדט – שיעור אנטומיה', altEn: 'Rembrandt – Anatomy Lesson', captionHe: 'The Anatomy Lesson, 1632', captionEn: 'The Anatomy Lesson, 1632' }
      ]
    },
    {
      avatar: '🕯️',
      nameHe: 'ז\'ורז\' דה לה טור (1593–1652)',
      nameEn: 'Georges de La Tour (1593–1652)',
      styleHe: 'ברוק צרפתי · אור נרות',
      styleEn: 'French Baroque · Candlelight',
      bioHe: 'דה לה טור התמחה בציורי לילה לאור נרות. הוא הלך צעד אחד מעבר לרמברנדט – הנר עצמו נמצא בציור. הדמויות מוארות מלמטה, יוצרות צללים דרמטיים. "אני מצייר את הסוד שחי בחשכה."',
      bioEn: 'De La Tour specialized in nighttime paintings by candlelight. He went one step beyond Rembrandt — the candle itself is in the painting. The figures are lit from below, creating dramatic shadows. "I paint the secret that lives in darkness."',
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Georges_de_La_Tour_-_The_Penitent_Magdalene_-_WGA12337.jpg/800px-Georges_de_La_Tour_-_The_Penitent_Magdalene_-_WGA12337.jpg', altHe: 'דה לה טור – מגדלנה חוזרת בתשובה', altEn: 'De La Tour – Penitent Magdalene', captionHe: 'Penitent Magdalene, ~1640', captionEn: 'Penitent Magdalene, ~1640' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Georges_de_la_Tour_031.jpg/800px-Georges_de_la_Tour_031.jpg', altHe: 'דה לה טור – הנגר', altEn: 'De La Tour – The Carpenter', captionHe: 'The Carpenter, ~1645', captionEn: 'The Carpenter, ~1645' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Georges_de_La_Tour_-_The_Cheat_with_the_Ace_of_Diamonds_-_WGA12340.jpg/1280px-Georges_de_La_Tour_-_The_Cheat_with_the_Ace_of_Diamonds_-_WGA12340.jpg', altHe: 'דה לה טור – הרמאי', altEn: 'De La Tour – The Cheat', captionHe: 'The Cheat with the Ace of Diamonds, ~1635', captionEn: 'The Cheat with the Ace of Diamonds, ~1635' }
      ]
    }
  ],

  techniquesSectionTitle: { he: '4 שלבים לדרמת אור', en: '4 Steps for Light Drama' },
  techniques: [
    { icon: '🌑', titleHe: 'כבי הכל', titleEn: 'Turn Off Everything', descHe: 'הכבי כל מקורות האור חוץ מאחד. גלי את הדרמה הנסתרת.', descEn: 'Turn off all light sources except one. Discover the hidden drama.' },
    { icon: '📐', titleHe: 'זווית האור', titleEn: 'Angle of Light', descHe: 'אור מלמעלה = דרמה. מלמטה = מפחיד. מהצד = אמנותי.', descEn: 'Light from above = drama. From below = scary. From the side = artistic.' },
    { icon: '⬛', titleHe: 'ערכי ערפל', titleEn: 'Shadow Values', descHe: 'צבעי את הצל ב-3 ערכים: כמעט שחור, אפור כהה, אפור בינוני.', descEn: 'Paint shadow in 3 values: near black, dark gray, mid gray.' },
    { icon: '✨', titleHe: 'נקודת אור', titleEn: 'Light Point', descHe: 'השאירי נקודה לבנה קטנה – הי\'לייט. היא מחיה את כל הציור.', descEn: 'Leave a small white spot — highlight. It brings the whole painting to life.' }
  ],

  exerciseTitle: { he: 'תרגיל: ציור לאור נרות', en: 'Exercise: Painting by Candlelight' },
  exerciseSeconds: 1800,
  exerciseTimerLabel: { he: '30 דקות', en: '30 minutes' },
  exerciseChecklist: [
    { he: 'הכבי את כל האורות. הדלקי נר אחד (או השתמשי בנר LED).', en: 'Turn off all lights. Light one candle (or use an LED candle).' },
    { he: 'הציבי חפץ אחד ליד הנר. ציירי רק את מה שהנר מאיר.', en: 'Place one object next to the candle. Paint only what the candle illuminates.' },
    { he: 'ציירי את הצל הגדול שנוצר – הוא חלק חשוב לא פחות מהאור.', en: 'Paint the large shadow that forms — it is no less important than the light.' },
    { he: 'השוי לציורי רמברנדט: מה דומה? מה שונה? מה תרצי לנסות שוב?', en: 'Compare to Rembrandt\'s paintings: what\'s similar? Different? What would you try again?' }
  ],

  quote: { he: '"האור לא מגיע מבחוץ – הוא מגיע מתוך."', en: '"Light doesn\'t come from outside — it comes from within."' },
  quoteAuthor: '— רמברנדט ון ריין',

  reflectionQ: { he: 'מה גיליתי בחשיכה שלא ראיתי באור?', en: 'What did I discover in the darkness that I couldn\'t see in the light?' },
  reflectionPlaceholder: { he: 'תארי את חוויית הציור לאור נרות...', en: 'Describe your experience painting by candlelight...' },

  prevLesson: { file: 'lesson-12.html', titleHe: 'חפצים, שולחנות וחלונות', titleEn: 'Objects, Tables & Windows' },
  nextLesson: { file: 'lesson-14.html', titleHe: 'ללמוד מאמנים', titleEn: 'Learning from Artists' }
};
