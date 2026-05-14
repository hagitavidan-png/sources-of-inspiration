/* ============================================================
   LESSON 14 – ללמוד מאמנים: שאל למה, לא מה
   לעריכה: שנה כל שדה בחופשיות.
   זהו שיעור הסיום – כולל בלוק חגיגת סיום.
   ============================================================ */

const LESSON_14 = {
  id: 'lesson-14',
  num: '14',
  unit: 'יחידה 6 – פרוטוקול הסטודיו',
  unitEn: 'Unit 6 – Studio Protocol',
  unitColor: '#c9a84c',  /* Unit 6 – Studio (gold, unchanged) */
  heroImage: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1400&q=80',

  titleHe: 'ללמוד מאמנים — שאל למה, לא מה',
  titleEn: 'Learning from Artists — Ask Why, Not What',

  metaIcon1: 'fa-solid fa-book-open',
  meta1He: 'שיעור 14',
  meta1En: 'Lesson 14',
  metaIcon2: 'fa-solid fa-infinity',
  meta2He: 'ללא הגבלת זמן',
  meta2En: 'No time limit',
  metaIcon3: 'fa-solid fa-graduation-cap',
  meta3He: 'סיום הקורס',
  meta3En: 'Course Completion',

  introTitle: { he: 'למה, לא מה', en: 'Why, Not What' },
  introText: { he: 'כשמסתכלים על ציור של אמן גדול, רוב האנשים שואלים: "מה הוא ציר?" — ומנסים לחקות את הנושא. אבל השאלה הנכונה היא: <strong>למה הוא ציר ככה?</strong> למה מונה בחר דווקא את הפלטה הזו? למה פרידה בחרה דווקא את הסמל הזה? למה הופר הושיב את הדמות דווקא שם? כשמבינים את ה"למה" — לומדים את דרך החשיבה של האמן ויכולים ליישם אותה על הנושאים שלנו.', en: 'When looking at a great artist\'s painting, most people ask: "What did he paint?" — and try to copy the subject. But the right question is: <strong>Why did he paint it that way?</strong> Why did Monet choose exactly that palette? Why did Frida choose exactly that symbol? Why did Hopper seat the figure exactly there? When you understand the "why" — you learn the artist\'s way of thinking and can apply it to your own subjects.' },

  artistsSectionTitle: { he: 'אולם התהילה — האמנים שלמדנו מהם', en: 'Hall of Fame — Artists We Learned From' },

  artists: [
    {
      avatar: '🌻',
      nameHe: 'ווינסנט ון גוך (1853–1890)',
      nameEn: 'Vincent van Gogh (1853–1890)',
      styleHe: 'פוסט-אימפרסיוניזם · ביטוי אישי עז',
      styleEn: 'Post-Impressionism · Intense Personal Expression',
      bioHe: 'ון גוך כתב אלפי מכתבים ותיעד כל מה שראה וחש. 900 ציורים ב-10 שנים. כל מכחול כמו פסיק מוזיקלי. השאלה שלו: "למה צבע?" — לא לתאר מציאות, אלא לבטא אמת פנימית.',
      bioEn: 'Van Gogh wrote thousands of letters and documented everything he saw and felt. 900 paintings in 10 years. Each brushstroke like a musical comma. His question: "Why color?" — not to describe reality, but to express inner truth.',
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg', altHe: 'ון גוך – ליל כוכבים', altEn: 'Van Gogh – The Starry Night', captionHe: 'The Starry Night, 1889', captionEn: 'The Starry Night, 1889' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Vase_with_Fifteen_Sunflowers_F458.jpg/800px-Vase_with_Fifteen_Sunflowers_F458.jpg', altHe: 'ון גוך – חמניות', altEn: 'Van Gogh – Sunflowers', captionHe: 'Sunflowers, 1888', captionEn: 'Sunflowers, 1888' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg/800px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg', altHe: 'ון גוך – דיוקן עצמי', altEn: 'Van Gogh – Self-Portrait', captionHe: 'Self-Portrait, 1889', captionEn: 'Self-Portrait, 1889' }
      ]
    },
    {
      avatar: '🌸',
      nameHe: 'קלוד מונה (1840–1926)',
      nameEn: 'Claude Monet (1840–1926)',
      styleHe: 'אימפרסיוניזם · אור ורגע',
      styleEn: 'Impressionism · Light & Moment',
      bioHe: 'מונה לא ציר עצמים — הוא ציר אור שנוחת על עצמים. 250 ציורי חבצלות מים. 30 ציורי ערמות שחת. השאלה שלו: "מה האור עושה לדברים ברגע הזה בדיוק?"',
      bioEn: 'Monet didn\'t paint objects — he painted light landing on objects. 250 water lily paintings. 30 haystack paintings. His question: "What does light do to things at exactly this moment?"',
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg/1280px-Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg', altHe: 'מונה – חבצלות מים', altEn: 'Monet – Water Lilies', captionHe: 'Water Lilies, 1906', captionEn: 'Water Lilies, 1906' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Claude_Monet_-_Haystacks%2C_end_of_summer.jpg/1280px-Claude_Monet_-_Haystacks%2C_end_of_summer.jpg', altHe: 'מונה – ערמות שחת', altEn: 'Monet – Haystacks', captionHe: 'Haystacks, End of Summer, 1891', captionEn: 'Haystacks, End of Summer, 1891' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Claude_Monet_-_Impression%2C_Sunrise.jpg/1280px-Claude_Monet_-_Impression%2C_Sunrise.jpg', altHe: 'מונה – רושם, זריחה', altEn: 'Monet – Impression Sunrise', captionHe: 'Impression, Sunrise, 1872', captionEn: 'Impression, Sunrise, 1872' }
      ]
    }
  ],

  techniquesSectionTitle: { he: '5 הכלים לשמירת ההשראה לכל החיים', en: '5 Tools for Lifelong Inspiration' },
  techniques: [
    { icon: '📓', titleHe: 'יומן ויזואלי יומי', titleEn: 'Daily Visual Journal', descHe: '5 דקות ביום — רשמי משהו אחד שראית. אחרי חודש: 30 רעיונות.', descEn: '5 minutes a day — note one thing you saw. After a month: 30 ideas.' },
    { icon: '✂️', titleHe: 'קולאז\' השראה', titleEn: 'Inspiration Collage', descHe: 'גיזרי תמונות בלי לחשוב למה. אחרי שבועיים — ראי מה חוזר.', descEn: 'Cut images without thinking why. After two weeks — see what repeats.' },
    { icon: '🚶', titleHe: 'הליכת השראה', titleEn: 'Inspiration Walk', descHe: '20 דקות. עיניים פקוחות. מה עוצר אותך? לא לצלם — לזכור.', descEn: '20 minutes. Eyes open. What stops you? Don\'t photograph — remember.' },
    { icon: '⚡', titleHe: 'ציור מהיר בוקרי', titleEn: 'Morning Quick Sketch', descHe: '5 דקות, כל בוקר, בלי מחשבה. אחרי שבוע — ראי מה חוזר.', descEn: '5 minutes, every morning, without thinking. After a week — see what repeats.' }
  ],

  exerciseTitle: { he: 'המשימה הסופית: הצהרת הציירת שלך', en: 'Final Mission: Your Painter\'s Declaration' },
  exerciseSeconds: null, /* אין טיימר לשיעור הסיום */
  exerciseTimerLabel: null,
  exerciseChecklist: [
    { he: 'כתבי 5 משפטים: "אני מצייר/ת כי...", "הצבע שהכי מדבר אלי הוא...", "מקור ההשראה הכי חזק שלי הוא..."', en: 'Write 5 sentences: "I paint because...", "The color that speaks to me most is...", "My strongest source of inspiration is..."' },
    { he: 'בחרי את המשפט הכי חזק מבין החמישה.', en: 'Choose the strongest sentence among the five.' },
    { he: 'כתבי אותו בצורה יפה — או הדביקי אותו על ציור — ושמרי במקום גלוי.', en: 'Write it beautifully — or paste it on a painting — and keep it in a visible place.' },
    { he: 'אם רוצה — שתפי ברשתות, עם חברות, בכיתה.', en: 'If you\'d like — share on social media, with friends, in class.' }
  ],

  /* בלוק חגיגת סיום – ייחודי לשיעור 14 */
  isLastLesson: true,
  completionTitle: { he: 'סיימת את הקורס!', en: 'You Finished the Course!' },
  completionText: { he: '14 שיעורים. 6 יחידות. אינסוף השראה.<br>הניצוץ הוצת — עכשיו רק את יכולה לשמור על האש.', en: '14 lessons. 6 units. Infinite inspiration.<br>The spark has been lit — now only you can keep the flame.' },
  completionLinks: [
    { href: 'https://youtube.com/@hagitavidanart', icon: 'fa-brands fa-youtube', labelHe: 'YouTube — סרטוני ציור', labelEn: 'YouTube — Painting Videos' },
    { href: 'https://www.instagram.com/hagitavidanart', icon: 'fa-brands fa-instagram', labelHe: 'Instagram — השראה יומית', labelEn: 'Instagram — Daily Inspiration' },
    { href: 'https://bio.site/hagitavidan', icon: 'fa-solid fa-link', labelHe: 'Bio.site — כל הקישורים', labelEn: 'Bio.site — All Links' }
  ],

  quote: { he: '"ללמוד לצייר הוא ללמוד לראות — לראות שהעולם יפה יותר ממה שחשבנו."', en: '"Learning to paint is learning to see — to see that the world is more beautiful than we thought."' },
  quoteAuthor: '— חגית אבידן',

  reflectionQ: { he: 'מה אקח מהקורס הזה לציור הבא שלי?', en: 'What will I take from this course to my next painting?' },
  reflectionPlaceholder: { he: 'כתבי את ההצהרה שלך כאן...', en: 'Write your declaration here...' },

  prevLesson: { file: 'lesson-13.html', titleHe: 'דרמת האור הביתי', titleEn: 'Home Light Drama' },
  nextLesson: null /* שיעור אחרון – אין "הבא" */
};
