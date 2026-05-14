/* ============================================================
   LESSON 01 – מה זו השראה?
   לעריכה: שנה כל שדה בחופשיות.
   להוספת אמן נוסף: הוסף אובייקט ל-artists[].
   להוספת טכניקה: הוסף אובייקט ל-techniques[].
   ============================================================ */

const LESSON_01 = {
  id: 'lesson-01',
  num: '01',
  unit: 'יחידת פתיחה – הצתת הניצוץ',
  unitEn: 'Intro Unit – Igniting the Spark',
  unitColor: '#7c6fa0',
  heroImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1400&q=80',

  titleHe: 'מה זו השראה?',
  titleEn: 'What is Inspiration?',

  metaIcon1: 'fa-solid fa-book-open',
  meta1He: 'שיעור 01',
  meta1En: 'Lesson 01',
  metaIcon2: 'fa-solid fa-clock',
  meta2He: '10 דקות תרגיל',
  meta2En: '10 min exercise',
  metaIcon3: 'fa-solid fa-pen-nib',
  meta3He: 'יומן ויזואלי יומי',
  meta3En: 'Daily Visual Journal',

  /* ── פסקת פתיחה ── */
  introTitle: { he: 'הניצוץ שמוביל לציור', en: 'The Spark that Leads to Painting' },
  introText: { he: 'פול סזאן ציר את הר סנט-ויקטואר מעל 80 פעמים. הוא לא ביקש השראה – הוא יצר אותה. כשהוא יצא לצייר כל בוקר, ההרגל הזה עצמו הפך למקור ההשראה שלו. השראה אינה מתנה שמגיעה פתאום – היא הרגל, תרגיל, ומחויבות לראות את העולם בעיניים פקוחות.', en: 'Paul Cézanne painted Mont Sainte-Victoire over 80 times. He didn\'t wait for inspiration — he created it. By going out to paint every morning, that very habit became his source of inspiration. Inspiration is not a sudden gift — it\'s a habit, a practice, and a commitment to seeing the world with open eyes.' },

  /* ── אמנים ── */
  artistsSectionTitle: { he: 'אמנים שמצאו השראה בשגרה', en: 'Artists Who Found Inspiration in the Everyday' },

  artists: [
    {
      avatar: '🏔️',
      nameHe: 'פול סזאן (1839–1906)',
      nameEn: 'Paul Cézanne (1839–1906)',
      styleHe: 'פוסט-אימפרסיוניזם · תצפית עמוקה',
      styleEn: 'Post-Impressionism · Deep Observation',
      bioHe: 'סזאן האמין שציור הוא דרך לראות את העולם מחדש. הוא ציר את אותו הר עשרות פעמים – לא מתוך שגרה, אלא מתוך סקרנות אינסופית. "הניצוץ הוא בעיניים – לא בעיפרון."',
      bioEn: 'Cézanne believed painting was a way to see the world anew. He painted the same mountain dozens of times — not out of routine, but out of infinite curiosity. "The spark is in the eyes — not the pencil."',
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Paul_C%C3%A9zanne_-_Mont_Sainte-Victoire_-_Google_Art_Project.jpg/1280px-Paul_C%C3%A9zanne_-_Mont_Sainte-Victoire_-_Google_Art_Project.jpg', altHe: 'סזאן – הר סנט-ויקטואר', altEn: 'Cézanne – Mont Sainte-Victoire', captionHe: 'Mont Sainte-Victoire, ~1887', captionEn: 'Mont Sainte-Victoire, ~1887' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Paul_C%C3%A9zanne_-_Card_Players.jpg/1280px-Paul_C%C3%A9zanne_-_Card_Players.jpg', altHe: 'סזאן – שחקני קלפים', altEn: 'Cézanne – Card Players', captionHe: 'The Card Players, 1894–95', captionEn: 'The Card Players, 1894–95' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Paul_Cezanne-_The_Large_Bathers.jpg/1280px-Paul_Cezanne-_The_Large_Bathers.jpg', altHe: 'סזאן – המתרחצות הגדולות', altEn: 'Cézanne – The Large Bathers', captionHe: 'The Large Bathers, 1906', captionEn: 'The Large Bathers, 1906' }
      ]
    },
    {
      avatar: '🌟',
      nameHe: 'ווינסנט ון גוך (1853–1890)',
      nameEn: 'Vincent van Gogh (1853–1890)',
      styleHe: 'פוסט-אימפרסיוניזם · ביטוי רגשי',
      styleEn: 'Post-Impressionism · Emotional Expression',
      bioHe: 'ון גוך כתב לאחיו תיאו אלפי מכתבים בהם תיאר כל מה שראה וחש. ההשראה שלו הגיעה מהשגרה היומית – השמש, הכוכבים, הפנים של אנשים פשוטים.',
      bioEn: 'Van Gogh wrote thousands of letters to his brother Theo, describing everything he saw and felt. His inspiration came from daily life — the sun, the stars, the faces of ordinary people.',
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg', altHe: 'ון גוך – ליל הכוכבים', altEn: 'Van Gogh – The Starry Night', captionHe: 'The Starry Night, 1889', captionEn: 'The Starry Night, 1889' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Vase_with_Fifteen_Sunflowers_F458.jpg/800px-Vase_with_Fifteen_Sunflowers_F458.jpg', altHe: 'ון גוך – חמניות', altEn: 'Van Gogh – Sunflowers', captionHe: 'Sunflowers, 1888', captionEn: 'Sunflowers, 1888' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg/800px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg', altHe: 'ון גוך – דיוקן עצמי', altEn: 'Van Gogh – Self-Portrait', captionHe: 'Self-Portrait, 1889', captionEn: 'Self-Portrait, 1889' }
      ]
    }
  ],

  /* ── טכניקות ── */
  techniquesSectionTitle: { he: '4 מקורות השראה עיקריים', en: '4 Main Sources of Inspiration' },
  techniques: [
    { icon: '👁️', titleHe: 'תצפית', titleEn: 'Observation', descHe: 'להסתכל על דברים מוכרים כאילו הם חדשים. לשאול: מה ייחודי כאן?', descEn: 'Looking at familiar things as if they\'re new. Asking: what\'s unique here?' },
    { icon: '💗', titleHe: 'רגש', titleEn: 'Emotion', descHe: 'לתת לרגש להוביל את הקו. לא לשאול "מה לצייר" אלא "מה אני מרגישה?"', descEn: 'Letting emotion lead the line. Not "what to paint" but "what am I feeling?"' },
    { icon: '📚', titleHe: 'לימוד', titleEn: 'Learning', descHe: 'לחקור אמנים שאוהבים. להבין "למה" הם עשו מה שעשו – לא רק "מה".',  descEn: 'Exploring artists you love. Understanding the "why" behind what they did — not just the "what".' },
    { icon: '🔁', titleHe: 'הרגל', titleEn: 'Habit', descHe: '5 דקות ביום שוות יותר מ-5 שעות ביחד. ההרגל יוצר את ההשראה.', descEn: '5 minutes a day is worth more than 5 hours at once. The habit creates the inspiration.' }
  ],

  /* ── תרגיל ── */
  exerciseTitle: { he: 'תרגיל: 10 דברים שמרגשים אותי', en: 'Exercise: 10 Things That Excite Me' },
  exerciseSeconds: 600,
  exerciseTimerLabel: { he: '10 דקות', en: '10 minutes' },
  exerciseChecklist: [
    { he: 'פתחי מחברת ריקה – היא תהיה היומן הויזואלי שלך.', en: 'Open a blank notebook — this will be your visual journal.' },
    { he: 'כתבי 10 דברים שמרגשים אותך: מקומות, זיכרונות, צבעים, רגשות.', en: 'Write 10 things that excite you: places, memories, colors, emotions.' },
    { he: 'ציירי ליד כל אחד – ולו רק קו, צורה, מרקם.', en: 'Draw next to each one — even just a line, shape, or texture.' },
    { he: 'סמני את 3 הדברים שמרגשים אותך הכי הרבה.', en: 'Mark the 3 things that excite you the most.' }
  ],

  /* ── ציטוט ── */
  quote: { he: '"ההשראה קיימת, אבל היא צריכה למצוא אותך בעבודה."', en: '"Inspiration exists, but it has to find you working."' },
  quoteAuthor: '— פבלו פיקאסו',

  /* ── רפלקציה ── */
  reflectionQ: { he: 'מה הדבר שהכי מרגש אותך לצייר?', en: 'What excites you most to paint?' },
  reflectionPlaceholder: { he: 'כתבי כאן חופשי...', en: 'Write freely here...' },

  /* ── ניווט ── */
  prevLesson: null,
  nextLesson: { file: 'lesson-02.html', titleHe: 'רגש כמקור', titleEn: 'Emotion as Source' }
};
