/* ============================================================
   LESSON 08 – כשאמנות פוגשת מוזיקה
   לעריכה: שנה כל שדה בחופשיות.
   להוספת אמן נוסף: הוסף אובייקט ל-artists[].
   ============================================================ */

const LESSON_08 = {
  id: 'lesson-08',
  num: '08',
  unit: 'יחידה 3 – מוזיקה ואבסטרקט',
  unitEn: 'Unit 3 – Music & Abstract',
  unitColor: '#7B61FF',
  heroImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1400&q=80',

  titleHe: 'כשאמנות פוגשת אמנות',
  titleEn: 'When Art Meets Art',

  metaIcon1: 'fa-solid fa-book-open',
  meta1He: 'שיעור 08',
  meta1En: 'Lesson 08',
  metaIcon2: 'fa-solid fa-clock',
  meta2He: '20 דקות תרגיל',
  meta2En: '20 min exercise',
  metaIcon3: 'fa-solid fa-music',
  meta3He: 'ציור בזמן אמת',
  meta3En: 'Real-time painting',

  introTitle: { he: 'מוזיקה כמברשת', en: 'Music as a Brush' },
  introText: { he: 'קנדינסקי היה הראשון שקרא לציוריו "קומפוזיציות" – כמו במוזיקה. הוא האמין שכל צבע הוא צליל, כל קו הוא מנגינה. כשהמוזיקה נכנסת לסטודיו – משהו משתחרר. המוח עוצר לחשוב ומתחיל להרגיש. יד מתחילה לזוז בלי לשאול "האם זה נראה טוב?".', en: 'Kandinsky was the first to call his paintings "Compositions" — like music. He believed every color is a sound, every line a melody. When music enters the studio — something is released. The mind stops thinking and starts feeling. The hand begins to move without asking "does this look good?".' },

  artistsSectionTitle: { he: 'אמנים שציירו למוזיקה', en: 'Artists Who Painted to Music' },

  artists: [
    {
      avatar: '🎵',
      nameHe: 'וסילי קנדינסקי (1866–1944)',
      nameEn: 'Vassily Kandinsky (1866–1944)',
      styleHe: 'אבסטרקט · צבע כצליל',
      styleEn: 'Abstract · Color as Sound',
      bioHe: 'קנדינסקי הלך לקונצרט של וגנר בגיל 30 וראה צבעים בזמן שהאזין למוזיקה. מאותו רגע – ניסה לתרגם את הקשר בין צליל לצבע לציור. "הצבע הוא מקש הפסנתר, העין היא הפטיש, הנשמה היא פסנתר בעל מיתרים רבים."',
      bioEn: 'Kandinsky went to a Wagner concert at age 30 and saw colors while listening to the music. From that moment — he tried to translate the connection between sound and color into painting. "Color is the keyboard, the eyes are the hammers, the soul is the piano with many strings."',
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Vassily_Kandinsky%2C_1913_-_Composition_7.jpg/1280px-Vassily_Kandinsky%2C_1913_-_Composition_7.jpg', altHe: 'קנדינסקי – קומפוזיציה 7', altEn: 'Kandinsky – Composition 7', captionHe: 'Composition VII, 1913', captionEn: 'Composition VII, 1913' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Vassily_Kandinsky%2C_1910_-_Improvisation_3.jpg/1280px-Vassily_Kandinsky%2C_1910_-_Improvisation_3.jpg', altHe: 'קנדינסקי – אימפרוביזציה', altEn: 'Kandinsky – Improvisation', captionHe: 'Improvisation 3, 1910', captionEn: 'Improvisation 3, 1910' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Vassily_Kandinsky%2C_1923_-_Composition_8%2C_huile_sur_toile%2C_140_cm_X_201_cm%2C_Mus%C3%A9e_Guggenheim%2C_New_York.jpg/1280px-Vassily_Kandinsky%2C_1923_-_Composition_8%2C_huile_sur_toile%2C_140_cm_X_201_cm%2C_Mus%C3%A9e_Guggenheim%2C_New_York.jpg', altHe: 'קנדינסקי – קומפוזיציה 8', altEn: 'Kandinsky – Composition 8', captionHe: 'Composition VIII, 1923', captionEn: 'Composition VIII, 1923' }
      ]
    },
    {
      avatar: '😱',
      nameHe: 'אדוארד מונק (1863–1944)',
      nameEn: 'Edvard Munch (1863–1944)',
      styleHe: 'אקספרסיוניזם · רגש חזותי',
      styleEn: 'Expressionism · Visual Emotion',
      bioHe: 'מונק כתב: "שמעתי את הצעקה האינסופית העוברת בטבע." ציוריו הם כמו מוזיקה ויזואלית – גלים של צבע שנושאים רגש. הוא ציר צלילים שלא ניתן לשמוע, רק להרגיש.',
      bioEn: 'Munch wrote: "I heard the infinite scream passing through nature." His paintings are like visual music — waves of color carrying emotion. He painted sounds that cannot be heard, only felt.',
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/800px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg', altHe: 'מונק – הצעקה', altEn: 'Munch – The Scream', captionHe: 'The Scream, 1893', captionEn: 'The Scream, 1893' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Edvard_Munch_-_Anxiety_-_Google_Art_Project.jpg/800px-Edvard_Munch_-_Anxiety_-_Google_Art_Project.jpg', altHe: 'מונק – חרדה', altEn: 'Munch – Anxiety', captionHe: 'Anxiety, 1894', captionEn: 'Anxiety, 1894' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/The_Dance_of_Life_-_Edvard_Munch_-_Google_Cultural_Institute.jpg/1280px-The_Dance_of_Life_-_Edvard_Munch_-_Google_Cultural_Institute.jpg', altHe: 'מונק – ריקוד החיים', altEn: 'Munch – Dance of Life', captionHe: 'Dance of Life, 1900', captionEn: 'Dance of Life, 1900' }
      ]
    }
  ],

  techniquesSectionTitle: { he: '4 ז\'אנרים – 4 אנרגיות לציור', en: '4 Genres – 4 Painting Energies' },
  techniques: [
    { icon: '🎻', titleHe: 'קלאסי', titleEn: 'Classical', descHe: 'מוזיקה קלאסית = קווים ארוכים ורחבים, צבעים עשירים ועמוקים.', descEn: 'Classical music = long, wide strokes, rich and deep colors.' },
    { icon: '🎷', titleHe: 'ג\'אז', titleEn: 'Jazz', descHe: 'ג\'אז = אקראי, ספונטני, מרתק. צבעים חמים ולא מתוכננים.', descEn: 'Jazz = random, spontaneous, exciting. Warm and unplanned colors.' },
    { icon: '🎸', titleHe: 'רוק', titleEn: 'Rock', descHe: 'רוק = קווים חדים, ניגודים חזקים, אנרגיה גבוהה.', descEn: 'Rock = sharp lines, strong contrasts, high energy.' },
    { icon: '🌊', titleHe: 'אמביאנט', titleEn: 'Ambient', descHe: 'אמביאנט = מעברים רכים, צבעים קרים, אטמוספרה.', descEn: 'Ambient = soft transitions, cool colors, atmosphere.' }
  ],

  exerciseTitle: { he: 'תרגיל: ציור למוזיקה', en: 'Exercise: Painting to Music' },
  exerciseSeconds: 1200,
  exerciseTimerLabel: { he: '20 דקות', en: '20 minutes' },
  exerciseChecklist: [
    { he: 'בחרי שיר – כל ז\'אנר שמרגיש נכון כרגע.', en: 'Choose a song — any genre that feels right now.' },
    { he: 'פתחי דף ריק. אל תחשבי על נושא – רק תתחילי להזיז את היד.', en: 'Open a blank page. Don\'t think about subject — just start moving your hand.' },
    { he: 'תני לצליל לקבוע: קצב = מהירות, עוצמה = לחץ, גובה = כיוון.', en: 'Let the sound decide: rhythm = speed, intensity = pressure, pitch = direction.' },
    { he: 'אחרי השיר – עצרי ותסתכלי: מה יצא? מה מפתיע אותך?', en: 'After the song — stop and look: what came out? What surprises you?' }
  ],

  quote: { he: '"הצבע הוא מקש הפסנתר, העין היא הפטיש, הנשמה היא פסנתר."', en: '"Color is the keyboard, the eyes are the hammers, the soul is the piano."' },
  quoteAuthor: '— וסילי קנדינסקי',

  reflectionQ: { he: 'איזה ז\'אנר מוזיקה מוביל את ידך הכי טבעית?', en: 'Which music genre guides your hand most naturally?' },
  reflectionPlaceholder: { he: 'תארי מה קרה כשציירת למוזיקה...', en: 'Describe what happened when you painted to music...' },

  prevLesson: { file: 'lesson-07.html', titleHe: 'וואבי-סאבי', titleEn: 'Wabi-Sabi' },
  nextLesson: { file: 'lesson-09.html', titleHe: 'מעבדת האמן: קנדינסקי', titleEn: 'Artist Lab: Kandinsky' }
};
