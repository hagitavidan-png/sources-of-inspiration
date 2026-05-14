/* ============================================================
   LESSON 02 – רגש כמקור – מהבטן אל הקנבס
   לעריכה: שנה כל שדה בחופשיות.
   ============================================================ */

const LESSON_02 = {
  id: 'lesson-02',
  num: '02',
  unit: 'יחידה 1 – העולם הפנימי',
  unitEn: 'Unit 1 – The Inner World',
  unitColor: '#E04D4D',
  heroImage: 'https://images.unsplash.com/photo-1499336315816-097655dcfbda?w=1400&q=80',

  titleHe: 'רגש כמקור – מהבטן אל הקנבס',
  titleEn: 'Emotion as Source – From Gut to Canvas',

  metaIcon1: 'fa-solid fa-book-open', meta1He: 'שיעור 02', meta1En: 'Lesson 02',
  metaIcon2: 'fa-solid fa-clock',     meta2He: '20 דקות תרגיל', meta2En: '20 min exercise',
  metaIcon3: 'fa-solid fa-heart',     meta3He: 'מפת הרגשות', meta3En: 'Emotion Map',

  introTitle: { he: 'כשהרגש מוביל את המכחול', en: 'When Emotion Leads the Brush' },
  introText: { he: 'אדוארד מונק ציר את "הצעקה" אחרי שחווה חרדת פאניקה בזמן שמש שקיעה. הרגש הפך לצורה, הצורה לצבע, והצבע לאחת היצירות המפורסמות בהיסטוריה. הרגש הוא לא מכשול לציור – הוא הדלק שלו. כשאנחנו מצייר מתוך רגש אמיתי, הצופה מרגיש את זה.', en: 'Edvard Munch painted "The Scream" after experiencing a panic attack during a sunset. The emotion became form, form became color, and color became one of history\'s most famous works. Emotion is not an obstacle to painting — it\'s the fuel. When we paint from genuine emotion, the viewer feels it.' },

  artistsSectionTitle: { he: 'אמנים שציירו מרגש', en: 'Artists Who Painted from Emotion' },
  artists: [
    {
      avatar: '😱',
      nameHe: 'אדוארד מונק (1863–1944)',
      nameEn: 'Edvard Munch (1863–1944)',
      styleHe: 'אקספרסיוניזם · ביטוי רגשי',
      styleEn: 'Expressionism · Emotional Expression',
      bioHe: 'מונק גדל עם אובדן, מחלה וחרדה – וכל אלה הפכו לנושאים המרכזיים בציוריו. "הצעקה" נולדה מחוויה אישית עמוקה. הוא לא הסתיר את הכאב – הוא הפך אותו לאמנות.',
      bioEn: 'Munch grew up with loss, illness and anxiety — and all of these became central themes in his paintings. "The Scream" was born from a deep personal experience. He didn\'t hide the pain — he turned it into art.',
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/800px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg', altHe: 'מונק – הצעקה', altEn: 'Munch – The Scream', captionHe: 'The Scream, 1893', captionEn: 'The Scream, 1893' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Munch_The_Dance_of_Life.jpg/1024px-Munch_The_Dance_of_Life.jpg', altHe: 'מונק – ריקוד החיים', altEn: 'Munch – The Dance of Life', captionHe: 'The Dance of Life, 1899–1900', captionEn: 'The Dance of Life, 1899–1900' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Munch_Melancholy_1894-95.jpg/960px-Munch_Melancholy_1894-95.jpg', altHe: 'מונק – מלנכוליה', altEn: 'Munch – Melancholy', captionHe: 'Melancholy, 1894', captionEn: 'Melancholy, 1894' }
      ]
    },
    {
      avatar: '🟥',
      nameHe: 'מארק רות\'קו (1903–1970)',
      nameEn: 'Mark Rothko (1903–1970)',
      styleHe: 'אקספרסיוניזם אבסטרקטי · שדות צבע',
      styleEn: 'Abstract Expressionism · Color Fields',
      bioHe: 'רות\'קו האמין שציוריו – מלבנים גדולים של צבע – יכולים לגרום לבכי. הוא שאף שהצופה ירגיש את הרגש הרגשי שהשקיע בציור. "אם אתה זזת מהציור, חמשה המשפטים שקראת עליו – אינם שווים כלום."',
      bioEn: 'Rothko believed his paintings — large rectangles of color — could make people cry. He aimed for the viewer to feel the emotional depth he invested in the work. "If you are only moved by color relationships, you are missing the point."',
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Rothko_No_61.jpg/800px-Rothko_No_61.jpg', altHe: 'רות\'קו – מספר 61', altEn: 'Rothko – No. 61', captionHe: 'No. 61 (Rust and Blue), 1953', captionEn: 'No. 61 (Rust and Blue), 1953' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/No._3-No._13.jpg/800px-No._3-No._13.jpg', altHe: 'רות\'קו – שדות צבע', altEn: 'Rothko – Color Fields', captionHe: 'No. 3/No. 13, 1949', captionEn: 'No. 3/No. 13, 1949' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Mark_Rothko_-_Untitled_-_1953.jpg/800px-Mark_Rothko_-_Untitled_-_1953.jpg', altHe: 'רות\'קו – ללא כותרת', altEn: 'Rothko – Untitled', captionHe: 'Untitled, 1953', captionEn: 'Untitled, 1953' }
      ]
    }
  ],

  techniquesSectionTitle: { he: '4 צבעים רגשיים', en: '4 Emotional Colors' },
  techniques: [
    { icon: '❤️', titleHe: 'אדום – עוצמה ותשוקה', titleEn: 'Red – Power & Passion', descHe: 'אנרגיה, כעס, אהבה, דחיפות. מושך את העין ומעורר תגובה.', descEn: 'Energy, anger, love, urgency. Draws the eye and provokes a response.' },
    { icon: '💙', titleHe: 'כחול – שקט ועצב', titleEn: 'Blue – Calm & Sadness', descHe: 'שלווה, עומק, געגוע, בדידות. צבע של פנימיות וחשיבה.', descEn: 'Serenity, depth, longing, solitude. A color of inwardness and reflection.' },
    { icon: '💛', titleHe: 'צהוב – שמחה ואנרגיה', titleEn: 'Yellow – Joy & Energy', descHe: 'אור, חום, אופטימיות. ון גוך אהב צהוב כביטוי לחיוניות.', descEn: 'Light, warmth, optimism. Van Gogh loved yellow as an expression of vitality.' },
    { icon: '🖤', titleHe: 'שחור – כוח ועומק', titleEn: 'Black – Power & Depth', descHe: 'לא רק חושך – גם אלגנטיות, מסתורין, ועוצמה שקטה.', descEn: 'Not just darkness — also elegance, mystery, and quiet power.' }
  ],

  exerciseTitle: { he: 'תרגיל: מפת הרגשות שלי', en: 'Exercise: My Emotion Map' },
  exerciseSeconds: 1200,
  exerciseTimerLabel: { he: '20 דקות', en: '20 minutes' },
  exerciseChecklist: [
    { he: 'בחרי רגש אחד שחזק בך עכשיו (שמחה, עצב, תסכול, התרגשות).', en: 'Choose one emotion that\'s strong in you right now (joy, sadness, frustration, excitement).' },
    { he: 'בחרי 2-3 צבעים שמייצגים את הרגש הזה עבורך.', en: 'Choose 2-3 colors that represent that emotion for you.' },
    { he: 'ציירי באופן חופשי – קווים, צורות, מרקמים – ללא נושא ספציפי.', en: 'Paint freely — lines, shapes, textures — without a specific subject.' },
    { he: 'בסוף – כתבי מילה אחת שמתארת את מה שיצרת.', en: 'At the end — write one word that describes what you created.' },
    { he: 'השווי לרגש שבחרת: האם הם תואמים?', en: 'Compare to the emotion you chose: do they match?' },
    { he: 'תלי את הציור במקום גלוי ליום אחד.', en: 'Hang the painting somewhere visible for one day.' }
  ],

  quote: { he: '"אני לא מצייר דברים. אני מצייר את ההבדלים ביניהם."', en: '"I don\'t paint things. I paint the differences between things."' },
  quoteAuthor: '— אנרי מאטיס',

  reflectionQ: { he: 'איזה רגש הכי קשה לך לבטא בציור?', en: 'Which emotion is hardest for you to express in painting?' },
  reflectionPlaceholder: { he: 'מחשבות חופשיות...', en: 'Free thoughts...' },

  prevLesson: { file: 'lesson-01.html', titleHe: 'מה זו השראה?', titleEn: 'What is Inspiration?' },
  nextLesson: { file: 'lesson-03.html', titleHe: 'מעבדת האמן: פרידה קאלו', titleEn: 'Artist Lab: Frida Kahlo' }
};
