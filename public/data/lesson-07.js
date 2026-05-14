/* ============================================================
   LESSON 07 – וואבי-סאבי: יופי הפגמים
   ============================================================ */

const LESSON_07 = {
  id: 'lesson-07',
  num: '07',
  unit: 'יחידה 2 – העולם הטבעי',
  unitEn: 'Unit 2 – The Natural World',
  unitColor: '#4CAF7D',
  heroImage: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1400&q=80',

  titleHe: 'וואבי-סאבי: יופי הפגמים',
  titleEn: 'Wabi-Sabi: Beauty of Imperfection',

  metaIcon1: 'fa-solid fa-book-open', meta1He: 'שיעור 07', meta1En: 'Lesson 07',
  metaIcon2: 'fa-solid fa-clock',     meta2He: '30 דקות', meta2En: '30 minutes',
  metaIcon3: 'fa-solid fa-leaf',      meta3He: 'הציור הנכשל', meta3En: 'The Failed Painting',

  introTitle: { he: 'יפן לימדה אותנו: הפגם הוא היופי', en: 'Japan Taught Us: The Flaw is the Beauty' },
  introText: { he: 'וואבי-סאבי היא פילוסופיה יפנית שמוצאת יופי בדברים שאינם שלמים, שחולפים, ושאינם גמורים. קערה עם סדק שמכוסה בזהב (קינטסוגי) שווה יותר מקערה שלמה. הציור שנראה "לא גמור" לפעמים יפה יותר מזה ה"מושלם". הפגם מספר סיפור. הפגם הוא עדות לחיים.', en: 'Wabi-Sabi is a Japanese philosophy that finds beauty in things that are imperfect, transient, and incomplete. A bowl with a crack covered in gold (Kintsugi) is worth more than a whole bowl. A painting that looks "unfinished" is sometimes more beautiful than the "perfect" one. The flaw tells a story. The flaw is evidence of life.' },

  artistsSectionTitle: { he: 'אמנים שאהבו פגמים', en: 'Artists Who Loved Imperfections' },
  artists: [
    {
      avatar: '🌸',
      nameHe: 'ווינסנט ון גוך (1853–1890)',
      nameEn: 'Vincent van Gogh (1853–1890)',
      styleHe: 'פוסט-אימפרסיוניזם · מכחול חי',
      styleEn: 'Post-Impressionism · Living Brushstroke',
      bioHe: 'ון גוך לא הסתיר את המכחולים שלו – להיפך. הם גלויים, עזים, לפעמים "לא מסיימים". הציורים שלו "נכשלו" לפי כל הקנונים האקדמיים – ובכל זאת הם מהיפים בעולם.',
      bioEn: 'Van Gogh didn\'t hide his brushstrokes — on the contrary. They\'re visible, bold, sometimes "unfinished." His paintings "failed" by all academic canons — and yet they are among the most beautiful in the world.',
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg', altHe: 'ון גוך – ליל הכוכבים', altEn: 'Van Gogh – Starry Night', captionHe: 'The Starry Night, 1889 – מכחולים גלויים', captionEn: 'The Starry Night, 1889 – Visible Brushstrokes' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Vincent_van_Gogh_-_Wheat_Field_with_Crows.jpg/1280px-Vincent_van_Gogh_-_Wheat_Field_with_Crows.jpg', altHe: 'ון גוך – שדה חיטה עם עורבים', altEn: 'Van Gogh – Wheat Field with Crows', captionHe: 'Wheat Field with Crows, 1890', captionEn: 'Wheat Field with Crows, 1890' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Vincent_van_Gogh_-_Sunflowers_-_VGM_F458.jpg/800px-Vincent_van_Gogh_-_Sunflowers_-_VGM_F458.jpg', altHe: 'ון גוך – חמניות מפורסמות', altEn: 'Van Gogh – Famous Sunflowers', captionHe: 'Sunflowers, 1889 – פגמים כחלק מהיצירה', captionEn: 'Sunflowers, 1889 – Flaws as Part of the Work' }
      ]
    },
    {
      avatar: '🐾',
      nameHe: 'אלברכט דורר (1471–1528)',
      nameEn: 'Albrecht Dürer (1471–1528)',
      styleHe: 'רנסנס גרמני · שלמות ופגם',
      styleEn: 'German Renaissance · Perfection & Flaw',
      bioHe: 'דורר ציר חיות עם דייקנות מדהימה – אך תמיד נשאר שמץ של "חיים". הארנב שלו אינו מושלם – הוא חי. ההבדל בין ציור "נכון" לציור "חי" הוא לפעמים הפגם.',
      bioEn: 'Dürer painted animals with amazing precision — but always kept a hint of "life." His hare isn\'t perfect — it\'s alive. The difference between a "correct" painting and a "living" painting is sometimes the flaw.',
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Albrecht_D%C3%BCrer_-_Young_Hare%2C_1502_-_Google_Art_Project.jpg/900px-Albrecht_D%C3%BCrer_-_Young_Hare%2C_1502_-_Google_Art_Project.jpg', altHe: 'דורר – ארנב צעיר', altEn: 'Dürer – Young Hare', captionHe: 'Young Hare, 1502', captionEn: 'Young Hare, 1502' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Albrecht_D%C3%BCrer_-_Wing_of_a_Blue_Roller_-_Google_Art_Project.jpg/800px-Albrecht_D%C3%BCrer_-_Wing_of_a_Blue_Roller_-_Google_Art_Project.jpg', altHe: 'דורר – כנף', altEn: 'Dürer – Wing', captionHe: 'Wing of a Blue Roller, 1512', captionEn: 'Wing of a Blue Roller, 1512' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Albrecht_D%C3%BCrer_-_Large_Piece_of_Turf_-_Google_Art_Project.jpg/800px-Albrecht_D%C3%BCrer_-_Large_Piece_of_Turf_-_Google_Art_Project.jpg', altHe: 'דורר – דשא', altEn: 'Dürer – Turf', captionHe: 'Large Piece of Turf, 1503', captionEn: 'Large Piece of Turf, 1503' }
      ]
    }
  ],

  techniquesSectionTitle: { he: '4 עקרונות וואבי-סאבי לציור', en: '4 Wabi-Sabi Principles for Painting' },
  techniques: [
    { icon: '🌿', titleHe: 'אי-שלמות כעוצמה', titleEn: 'Imperfection as Strength', descHe: 'ציור שנראה "לא גמור" הוא לפעמים יותר מרגש מזה ה"מושלם".', descEn: 'A painting that looks "unfinished" is sometimes more moving than the "perfect" one.' },
    { icon: '⏳', titleHe: 'חלוף הזמן', titleEn: 'Passing of Time', descHe: 'צבעים שדוהים, נייר שמצהיב – אלה לא כשלונות, אלה עדויות לחיים.', descEn: 'Colors that fade, paper that yellows — these aren\'t failures, they\'re evidence of life.' },
    { icon: '🪨', titleHe: 'פשטות', titleEn: 'Simplicity', descHe: 'פחות הוא יותר. לפעמים קו אחד אמיתי שווה יותר מציור מורכב.', descEn: 'Less is more. Sometimes one true line is worth more than a complex painting.' },
    { icon: '🍃', titleHe: 'קבלה', titleEn: 'Acceptance', descHe: 'לקבל שהציור לא יצא כמו שתכננת – וזה בסדר. ייתכן שיצא טוב יותר.', descEn: 'Accept that the painting didn\'t turn out as planned — and that\'s okay. It may have turned out better.' }
  ],

  exerciseTitle: { he: 'תרגיל: הציור שהתקלקל', en: 'Exercise: The Ruined Painting' },
  exerciseSeconds: 1800,
  exerciseTimerLabel: { he: '30 דקות', en: '30 minutes' },
  exerciseChecklist: [
    { he: 'קחי ציור ישן שלא אהבת – או כיסי נייר בשכבת צבע בלי מחשבה.', en: 'Take an old painting you didn\'t like — or cover paper with a layer of paint without thinking.' },
    { he: 'מצאי בו צורה, קו, פרט – ועצרי עליו.', en: 'Find in it a shape, line, detail — and focus on it.' },
    { he: 'הוסיפי לציור "הקלקול" – לא לתקן אלא להמשיך.', en: 'Add to the "ruined" painting — not to fix it but to continue.' },
    { he: 'כתבי למטה: "הפגם הוא: ___. הוא יפה כי ___."', en: 'Write at the bottom: "The flaw is: ___. It\'s beautiful because ___."' }
  ],

  quote: { he: '"האמנות מעולם לא מסיימת, רק נזנחת."', en: '"Art is never finished, only abandoned."' },
  quoteAuthor: '— לאונרדו דה וינצ\'י',

  reflectionQ: { he: 'מה הפגם בציור שלך שאתה הכי אוהב?', en: 'What flaw in your painting do you love the most?' },
  reflectionPlaceholder: { he: 'תאר/י את הפגם ואיך הוא הפך לחלק מהיצירה...', en: 'Describe the flaw and how it became part of the work...' },

  prevLesson: { file: 'lesson-06.html', titleHe: 'פלטות צבע מהטבע', titleEn: 'Color Palettes from Nature' },
  nextLesson: { file: 'lesson-08.html', titleHe: 'כשאמנות פוגשת מוזיקה', titleEn: 'When Art Meets Music' }
};
