/* ============================================================
   LESSON 09 – מעבדת האמן: קנדינסקי
   לעריכה: שנה כל שדה בחופשיות.
   ============================================================ */

const LESSON_09 = {
  id: 'lesson-09',
  num: '09',
  unit: 'יחידה 3 – מעבדת האמן',
  unitEn: 'Unit 3 – Artist Lab',
  unitColor: '#7B61FF',
  heroImage: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=1400&q=80',

  titleHe: 'מעבדת האמן: קנדינסקי',
  titleEn: 'Artist Lab: Kandinsky',

  metaIcon1: 'fa-solid fa-book-open',
  meta1He: 'שיעור 09',
  meta1En: 'Lesson 09',
  metaIcon2: 'fa-solid fa-clock',
  meta2He: '18 דקות תרגיל',
  meta2En: '18 min exercise',
  metaIcon3: 'fa-solid fa-music',
  meta3He: '3 סגנונות מוזיקה',
  meta3En: '3 music styles',

  introTitle: { he: 'שפת הצבע הפנימית', en: 'The Inner Language of Color' },
  introText: { he: 'קנדינסקי לא ציר מה שראה עיניו – הוא ציר מה ששמעו אוזניו ומה שהרגישה נשמתו. לכל צבע הייתה לו משמעות: צהוב הוא אנרגיה וטירוף, כחול הוא שקט ורוחניות, אדום הוא עוצמה ותשוקה. כשהוא ישב לצייר – לא היה לו נושא. הייתה לו רגשה, וממנה צמח הציור.', en: 'Kandinsky didn\'t paint what his eyes saw — he painted what his ears heard and what his soul felt. Every color held meaning: yellow is energy and madness, blue is calm and spirituality, red is power and passion. When he sat to paint — he had no subject. He had a feeling, and from it grew the painting.' },

  artistsSectionTitle: { he: 'קנדינסקי ורוטקו – שני עולמות של צבע', en: 'Kandinsky & Rothko – Two Worlds of Color' },

  artists: [
    {
      avatar: '🎨',
      nameHe: 'וסילי קנדינסקי (1866–1944)',
      nameEn: 'Vassily Kandinsky (1866–1944)',
      styleHe: 'אבסטרקט · תיאוריית הצבע',
      styleEn: 'Abstract · Color Theory',
      bioHe: 'קנדינסקי כתב את הספר "על הרוחניות באמנות" שבו פיתח תיאוריה שלמה של משמעויות הצבע. הוא האמין שאמנות חייבת לפנות לנשמה, לא לעיניים. כל אחת מ"קומפוזיציות" שלו היא כמו סימפוניה ויזואלית.',
      bioEn: 'Kandinsky wrote "Concerning the Spiritual in Art," developing a complete theory of color meanings. He believed art must speak to the soul, not the eyes. Each of his "Compositions" is like a visual symphony.',
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Vassily_Kandinsky%2C_1913_-_Composition_7.jpg/1280px-Vassily_Kandinsky%2C_1913_-_Composition_7.jpg', altHe: 'קנדינסקי – קומפוזיציה 7', altEn: 'Kandinsky – Composition 7', captionHe: 'Composition VII, 1913', captionEn: 'Composition VII, 1913' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Vassily_Kandinsky%2C_1923_-_Composition_8%2C_huile_sur_toile%2C_140_cm_X_201_cm%2C_Mus%C3%A9e_Guggenheim%2C_New_York.jpg/1280px-Vassily_Kandinsky%2C_1923_-_Composition_8%2C_huile_sur_toile%2C_140_cm_X_201_cm%2C_Mus%C3%A9e_Guggenheim%2C_New_York.jpg', altHe: 'קנדינסקי – קומפוזיציה 8', altEn: 'Kandinsky – Composition 8', captionHe: 'Composition VIII, 1923', captionEn: 'Composition VIII, 1923' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Vassily_Kandinsky%2C_1910_-_Improvisation_3.jpg/1280px-Vassily_Kandinsky%2C_1910_-_Improvisation_3.jpg', altHe: 'קנדינסקי – אימפרוביזציה 3', altEn: 'Kandinsky – Improvisation 3', captionHe: 'Improvisation 3, 1910', captionEn: 'Improvisation 3, 1910' }
      ]
    },
    {
      avatar: '🟥',
      nameHe: 'מארק רוטקו (1903–1970)',
      nameEn: 'Mark Rothko (1903–1970)',
      styleHe: 'אקספרסיוניזם אבסטרקטי · רגש טהור',
      styleEn: 'Abstract Expressionism · Pure Emotion',
      bioHe: 'רוטקו ציר ריבועי צבע גדולים – ורצה שהצופה יבכה מולם. "אם אתה מתרגש מהיחסים בין הצבעים, את מבין את ציוריי." הציורים שלו הם חדרים של רגש שניתן להיכנס אליהם.',
      bioEn: 'Rothko painted large rectangles of color — and wanted viewers to cry before them. "If you are moved only by the relationships between colors, you understand my paintings." His paintings are rooms of emotion you can enter.',
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Mark_Rothko_-_No._14%2C_1960_%281960%29.jpg/800px-Mark_Rothko_-_No._14%2C_1960_%281960%29.jpg', altHe: 'רוטקו – מס. 14', altEn: 'Rothko – No. 14', captionHe: 'No. 14, 1960', captionEn: 'No. 14, 1960' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Red%2C_Orange%2C_Tan%2C_and_Purple_by_Mark_Rothko.jpg/800px-Red%2C_Orange%2C_Tan%2C_and_Purple_by_Mark_Rothko.jpg', altHe: 'רוטקו – אדום וכתום', altEn: 'Rothko – Red and Orange', captionHe: 'Red, Orange, Tan & Purple, 1954', captionEn: 'Red, Orange, Tan & Purple, 1954' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Rothko_Chapel_2.jpg/800px-Rothko_Chapel_2.jpg', altHe: 'קפלת רוטקו', altEn: 'Rothko Chapel', captionHe: 'Rothko Chapel, Houston, 1971', captionEn: 'Rothko Chapel, Houston, 1971' }
      ]
    }
  ],

  techniquesSectionTitle: { he: 'משמעות הצבעים לפי קנדינסקי', en: 'Color Meanings According to Kandinsky' },
  techniques: [
    { icon: '🟡', titleHe: 'צהוב – אנרגיה', titleEn: 'Yellow – Energy', descHe: 'פעיל, חמים, מתפרץ. כמו חצוצרה. מוביל לתנועה.', descEn: 'Active, warm, explosive. Like a trumpet. Leads to movement.' },
    { icon: '🔵', titleHe: 'כחול – שקט', titleEn: 'Blue – Calm', descHe: 'עמוק, רוחני, מרגיע. כמו פלוטה. מוביל לפנימיות.', descEn: 'Deep, spiritual, calming. Like a flute. Leads to inner self.' },
    { icon: '🔴', titleHe: 'אדום – עוצמה', titleEn: 'Red – Power', descHe: 'חזק, חי, נוכח. כמו תוף. מוביל לפעולה.', descEn: 'Strong, alive, present. Like a drum. Leads to action.' },
    { icon: '🟢', titleHe: 'ירוק – שיווי משקל', titleEn: 'Green – Balance', descHe: 'יציב, שלוו, ניטרלי. כמו כינור. מוביל לאיזון.', descEn: 'Stable, peaceful, neutral. Like a violin. Leads to balance.' }
  ],

  exerciseTitle: { he: 'תרגיל: 3 ציורים ל-3 שירים', en: 'Exercise: 3 Paintings for 3 Songs' },
  exerciseSeconds: 1080,
  exerciseTimerLabel: { he: '18 דקות', en: '18 minutes' },
  exerciseChecklist: [
    { he: 'הכינו 3 דפים קטנים. בחרי 3 שירים שונים לגמרי.', en: 'Prepare 3 small pages. Choose 3 very different songs.' },
    { he: 'לכל שיר – ציירי רק עם הצבעים שקנדינסקי ייחס לאנרגיה שלו.', en: 'For each song — paint only with the colors Kandinsky associated with its energy.' },
    { he: 'אל תצייר "נושא" – רק צורות, קווים, טקסטורות שמרגישות נכון.', en: 'Don\'t paint a "subject" — only shapes, lines, textures that feel right.' },
    { he: 'בסוף – השווי את 3 הציורים. מה השתנה? מה נשאר?', en: 'At the end — compare the 3 paintings. What changed? What stayed?' }
  ],

  quote: { he: '"הצבע הוא אמצעי להשפעה ישירה על הנשמה."', en: '"Color is the means of direct influence on the soul."' },
  quoteAuthor: '— וסילי קנדינסקי',

  reflectionQ: { he: 'איזה צבע מרגיש לך כמו "שלך"?', en: 'Which color feels like "yours"?' },
  reflectionPlaceholder: { he: 'תארי את הקשר שלך לצבע אחד...', en: 'Describe your relationship with one color...' },

  prevLesson: { file: 'lesson-08.html', titleHe: 'כשאמנות פוגשת מוזיקה', titleEn: 'When Art Meets Music' },
  nextLesson: { file: 'lesson-10.html', titleHe: 'עיר, אנשים וגאומטריה', titleEn: 'City, People & Geometry' }
};
