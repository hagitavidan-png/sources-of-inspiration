/* ============================================================
   LESSON 12 – חפצים, שולחנות וחלונות
   לעריכה: שנה כל שדה בחופשיות.
   ============================================================ */

const LESSON_12 = {
  id: 'lesson-12',
  num: '12',
  unit: 'יחידה 5 – עולם הבית',
  unitEn: 'Unit 5 – The Home World',
  unitColor: '#4A90E2',
  heroImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=80',

  titleHe: 'חפצים, שולחנות וחלונות',
  titleEn: 'Objects, Tables & Windows',

  metaIcon1: 'fa-solid fa-book-open',
  meta1He: 'שיעור 12',
  meta1En: 'Lesson 12',
  metaIcon2: 'fa-solid fa-clock',
  meta2He: '45 דקות',
  meta2En: '45 minutes',
  metaIcon3: 'fa-solid fa-apple-whole',
  meta3He: 'טבע דומם',
  meta3En: 'Still Life',

  introTitle: { he: 'הבית כמוזיאון אישי', en: 'The Home as Personal Museum' },
  introText: { he: 'ורמיר ציר חדרים פשוטים – אישה ליד חלון, עגיל פנינה, כוס חלב. הוא הפך שגרה לקסם. כל חפץ בבית שלך עם סיפור: ספל הקפה של הבוקר, הספר שקראת, הפרחים שהתייבשו. ורמיר לא חיפש נושאים מיוחדים – הוא מצא את הנושאים בתוך ביתו. הסוד: להסתכל על הרגיל כאילו הוא נדיר.', en: 'Vermeer painted simple rooms — a woman by a window, a pearl earring, a cup of milk. He turned the ordinary into magic. Every object in your home has a story: the morning coffee cup, the book you read, the dried flowers. Vermeer didn\'t search for special subjects — he found them inside his home. The secret: looking at the ordinary as if it\'s rare.' },

  artistsSectionTitle: { he: 'אמנים שמצאו השראה בבית', en: 'Artists Who Found Inspiration at Home' },

  artists: [
    {
      avatar: '🪟',
      nameHe: 'יוהנס ורמיר (1632–1675)',
      nameEn: 'Johannes Vermeer (1632–1675)',
      styleHe: 'ברוק הולנדי · טבע דומם',
      styleEn: 'Dutch Baroque · Still Life',
      bioHe: 'ורמיר ציר פחות מ-40 ציורים ידועים – כולם של חיים פשוטים. אור דרך חלון, אישה קוראת מכתב, שולחן עם פירות. כל ציור לקח לו שנים. "האיכות שווה יותר מהכמות."',
      bioEn: 'Vermeer painted fewer than 40 known paintings — all of simple life. Light through a window, a woman reading a letter, a table with fruit. Each painting took him years. "Quality is worth more than quantity."',
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg', altHe: 'ורמיר – נערה עם עגיל פנינה', altEn: 'Vermeer – Girl with Pearl Earring', captionHe: 'Girl with a Pearl Earring, 1665', captionEn: 'Girl with a Pearl Earring, 1665' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Johannes_Vermeer_-_Woman_Reading_a_Letter_-_WGA24659.jpg/800px-Johannes_Vermeer_-_Woman_Reading_a_Letter_-_WGA24659.jpg', altHe: 'ורמיר – אישה קוראת מכתב', altEn: 'Vermeer – Woman Reading a Letter', captionHe: 'Woman Reading a Letter, ~1663', captionEn: 'Woman Reading a Letter, ~1663' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Johannes_Vermeer_-_The_Milkmaid_-_Google_Art_Project.jpg/800px-Johannes_Vermeer_-_The_Milkmaid_-_Google_Art_Project.jpg', altHe: 'ורמיר – המוזגת', altEn: 'Vermeer – The Milkmaid', captionHe: 'The Milkmaid, ~1657–58', captionEn: 'The Milkmaid, ~1657–58' }
      ]
    },
    {
      avatar: '🍎',
      nameHe: 'פול סזאן (1839–1906)',
      nameEn: 'Paul Cézanne (1839–1906)',
      styleHe: 'פוסט-אימפרסיוניזם · טבע דומם',
      styleEn: 'Post-Impressionism · Still Life',
      bioHe: 'סזאן ציר תפוחים יותר מ-200 פעמים. "אני רוצה לכבוש פריז עם תפוח." הוא ראה בכל תפוח בעיה גאומטרית שצריך לפתור – איך לתרגם עצם תלת-ממדי לדו-ממד שיישמר לעד.',
      bioEn: 'Cézanne painted apples more than 200 times. "I want to astonish Paris with an apple." He saw each apple as a geometric problem to solve — how to translate a three-dimensional object into two dimensions that would last forever.',
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Paul_C%C3%A9zanne_-_Curtain%2C_Jug_and_Fruit_Bowl.jpg/1280px-Paul_C%C3%A9zanne_-_Curtain%2C_Jug_and_Fruit_Bowl.jpg', altHe: 'סזאן – וילון, קנקן ופירות', altEn: 'Cézanne – Curtain, Jug & Fruit Bowl', captionHe: 'Curtain, Jug and Fruit Bowl, ~1893–94', captionEn: 'Curtain, Jug and Fruit Bowl, ~1893–94' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Paul_C%C3%A9zanne_-_Card_Players.jpg/1280px-Paul_C%C3%A9zanne_-_Card_Players.jpg', altHe: 'סזאן – שחקני קלפים', altEn: 'Cézanne – Card Players', captionHe: 'The Card Players, 1894–95', captionEn: 'The Card Players, 1894–95' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Paul_C%C3%A9zanne_-_Mont_Sainte-Victoire_-_Google_Art_Project.jpg/1280px-Paul_C%C3%A9zanne_-_Mont_Sainte-Victoire_-_Google_Art_Project.jpg', altHe: 'סזאן – הר סנט-ויקטואר', altEn: 'Cézanne – Mont Sainte-Victoire', captionHe: 'Mont Sainte-Victoire, ~1887', captionEn: 'Mont Sainte-Victoire, ~1887' }
      ]
    }
  ],

  techniquesSectionTitle: { he: '4 נושאי טבע דומם קלאסיים', en: '4 Classic Still Life Subjects' },
  techniques: [
    { icon: '🍊', titleHe: 'פירות', titleEn: 'Fruits', descHe: 'צבעים עזים, צורות פשוטות, אתגר גאומטרי. נשמרים טוב לציור.', descEn: 'Vivid colors, simple shapes, geometric challenge. Hold well for painting.' },
    { icon: '🫖', titleHe: 'כלי מטבח', titleEn: 'Kitchen Objects', descHe: 'השתקפויות, בליטות, מרקמים – כלי מטבח הם עולם בפני עצמם.', descEn: 'Reflections, curves, textures — kitchen objects are a world of their own.' },
    { icon: '📚', titleHe: 'ספרים ומכתבים', titleEn: 'Books & Letters', descHe: 'קצוות, נייר, צבעים – ספרים ישנים מרגשים כמו שמן על קנבס.', descEn: 'Edges, paper, colors — old books are as exciting as oil on canvas.' },
    { icon: '🕯️', titleHe: 'נרות ופרחים', titleEn: 'Candles & Flowers', descHe: 'אור רך, פגיעות, יופי חולף. הכי קלאסי בציור מהמאה ה-17.', descEn: 'Soft light, fragility, fleeting beauty. Most classic in 17th-century painting.' }
  ],

  exerciseTitle: { he: 'תרגיל: שולחן חיים', en: 'Exercise: Life Table' },
  exerciseSeconds: 2700,
  exerciseTimerLabel: { he: '45 דקות', en: '45 minutes' },
  exerciseChecklist: [
    { he: 'בחרי 3–5 חפצים מהבית שמרגישים "שלך". סדרי אותם על שולחן.', en: 'Choose 3–5 objects from home that feel like "yours." Arrange them on a table.' },
    { he: 'צלמי תמונה, ואז ציירי – לא מהצילום, מהחפצים עצמם.', en: 'Take a photo, then paint — not from the photo, from the objects themselves.' },
    { he: 'שני אתגרים: קו בלבד ראשון, ציור מלא שני. הי מה ההבדל.', en: 'Two challenges: line-only first, full color second. See the difference.' },
    { he: 'כתבי כיתוב קצר ליד הציור – מה המשמעות של החפצים לך.', en: 'Write a short caption next to the painting — what these objects mean to you.' }
  ],

  quote: { he: '"אני רוצה לכבוש פריז עם תפוח."', en: '"I want to astonish Paris with an apple."' },
  quoteAuthor: '— פול סזאן',

  reflectionQ: { he: 'איזה חפץ בבית שלך הכי מספר את הסיפור שלך?', en: 'Which object in your home best tells your story?' },
  reflectionPlaceholder: { he: 'תארי חפץ אחד שמיוחד לך ולמה...', en: 'Describe one object that is special to you and why...' },

  prevLesson: { file: 'lesson-11.html', titleHe: 'מעבדת האמן: הופר', titleEn: 'Artist Lab: Hopper' },
  nextLesson: { file: 'lesson-13.html', titleHe: 'דרמת האור הביתי', titleEn: 'Home Light Drama' }
};
