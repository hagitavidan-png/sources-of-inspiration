/* ============================================================
   LESSON 03 – מעבדת האמן: פרידה קאלו
   ============================================================ */

const LESSON_03 = {
  id: 'lesson-03',
  num: '03',
  unit: 'יחידה 1 – העולם הפנימי',
  unitEn: 'Unit 1 – The Inner World',
  unitColor: '#E04D4D',
  heroImage: 'https://images.unsplash.com/photo-1534131707746-25d604851a1f?w=1400&q=80',

  titleHe: 'מעבדת האמן: פרידה קאלו',
  titleEn: 'Artist Lab: Frida Kahlo',

  metaIcon1: 'fa-solid fa-book-open', meta1He: 'שיעור 03', meta1En: 'Lesson 03',
  metaIcon2: 'fa-solid fa-clock',     meta2He: '30–45 דקות', meta2En: '30–45 min',
  metaIcon3: 'fa-solid fa-star',      meta3He: 'הסמל האישי שלך', meta3En: 'Your Personal Symbol',

  introTitle: { he: 'מי הייתה פרידה קאלו?', en: 'Who Was Frida Kahlo?' },
  introText: { he: 'פרידה קאלו חוותה תאונת אוטובוס קשה בגיל 18. בזמן ההחלמה הארוכה, שכובה במיטה, היא התחילה לצייר. הציור לא היה בריחה מהמציאות – הוא היה המציאות. כל ציור שלה הוא תיעוד נפשי, הצהרה עצמית, ומניפסט של כוח. היא המציאה ציור שאמר: "אני קיימת. אני כואבת. אני יפה."', en: 'Frida Kahlo experienced a severe bus accident at age 18. During the long recovery, lying in bed, she started painting. Painting wasn\'t an escape from reality — it was reality. Each of her paintings is a psychological document, a self-declaration, and a manifesto of strength. She invented a painting that said: "I exist. I suffer. I am beautiful."' },

  artistsSectionTitle: { he: 'עולמה הויזואלי של פרידה', en: 'Frida\'s Visual World' },
  artists: [
    {
      avatar: '🌺',
      nameHe: 'פרידה קאלו (1907–1954)',
      nameEn: 'Frida Kahlo (1907–1954)',
      styleHe: 'ריאליזם קסום מקסיקני · סמליות אישית',
      styleEn: 'Mexican Magic Realism · Personal Symbolism',
      bioHe: 'פרידה ציירה בעיקר דיוקנאות עצמיים – לא מתוך נרקיסיזם אלא מתוך צורך לחקור את הזהות שלה. היא שילבה סמלים מקסיקניים, אלמנטים מהטבע, ותמונות כאב ושמחה. "אני מצייר את המציאות שלי."',
      bioEn: 'Frida mainly painted self-portraits — not out of narcissism but out of a need to explore her identity. She combined Mexican symbols, elements from nature, and images of pain and joy. "I paint my own reality."',
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg/800px-Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg', altHe: 'פרידה קאלו – תצלום', altEn: 'Frida Kahlo – photo', captionHe: 'פרידה קאלו, ~1932', captionEn: 'Frida Kahlo, ~1932' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Frida_Kahlo_%28self_portrait%29.jpg/800px-Frida_Kahlo_%28self_portrait%29.jpg', altHe: 'פרידה – דיוקן עצמי', altEn: 'Frida – Self-Portrait', captionHe: 'Self-Portrait, 1940', captionEn: 'Self-Portrait, 1940' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Frida_Kahlo_%281932%29_-_Detroit_Industry_Murals_%28detail%29.jpg/960px-Frida_Kahlo_%281932%29_-_Detroit_Industry_Murals_%28detail%29.jpg', altHe: 'פרידה – פרט מפרסקו', altEn: 'Frida – detail from fresco', captionHe: 'Detroit Industry (detail), 1932', captionEn: 'Detroit Industry (detail), 1932' }
      ]
    }
  ],

  techniquesSectionTitle: { he: '5 שיעורים שלמדנו מפרידה', en: '5 Lessons We Learned from Frida' },
  techniques: [
    { icon: '🪞', titleHe: 'הכאב כמקור כוח', titleEn: 'Pain as Source of Strength', descHe: 'פרידה לא הסתירה את כאבה – היא הפכה אותו לאמנות. הפגיעות היא עוצמה.', descEn: 'Frida didn\'t hide her pain — she turned it into art. Vulnerability is strength.' },
    { icon: '🌸', titleHe: 'זהות כנושא', titleEn: 'Identity as Subject', descHe: 'מי אני? מאיפה אני? מה מייחד אותי? אלו שאלות לגיטימיות לציור.', descEn: 'Who am I? Where do I come from? What makes me unique? These are legitimate questions for painting.' },
    { icon: '🦋', titleHe: 'סמלים אישיים', titleEn: 'Personal Symbols', descHe: 'לכל אמן יש שפת סמלים ייחודית. פרחים, חיות, חפצים – כל אלה יכולים להיות שפה.', descEn: 'Every artist has a unique symbolic language. Flowers, animals, objects — all can be a language.' },
    { icon: '🎨', titleHe: 'צבעים תרבותיים', titleEn: 'Cultural Colors', descHe: 'פרידה השתמשה בצבעים מקסיקניים עזים – ירוק, אדום, כחול. צבע הוא תרבות.', descEn: 'Frida used vivid Mexican colors — green, red, blue. Color is culture.' },
    { icon: '✍️', titleHe: 'הציור כיומן', titleEn: 'Painting as Journal', descHe: 'הציור לא חייב להיות לציבור. הוא יכול להיות אישי לחלוטין כמו יומן.', descEn: 'Painting doesn\'t have to be for the public. It can be entirely personal, like a diary.' }
  ],

  exerciseTitle: { he: 'תרגיל: הסמל האישי שלי', en: 'Exercise: My Personal Symbol' },
  exerciseSeconds: 2100,
  exerciseTimerLabel: { he: '35 דקות', en: '35 minutes' },
  exerciseChecklist: [
    { he: 'רשמי 5 דברים שמאפיינים אותך: תחביבים, מקומות, זיכרונות.', en: 'Write 5 things that characterize you: hobbies, places, memories.' },
    { he: 'בחרי אחד שמרגיש הכי "אמיתי" – ואז ציירי אותו.', en: 'Choose one that feels most "real" — then paint it.' },
    { he: 'הוסיפי סביבו 3 אלמנטים נוספים שקשורים אליו.', en: 'Add 3 more elements around it that are related.' },
    { he: 'בחרי פלטת צבעים שמרגישה "כמוך".', en: 'Choose a color palette that feels "like you".' },
    { he: 'האם יצרת סמל אישי? כתבי לו שם.', en: 'Have you created a personal symbol? Give it a name.' }
  ],

  quote: { he: '"אני מצייר את המציאות שלי. הדבר היחיד שאני יודעת הוא שאני מצייר כי אני צריכה לעשות זאת."', en: '"I paint my own reality. The only thing I know is that I paint because I need to."' },
  quoteAuthor: '— פרידה קאלו',

  reflectionQ: { he: 'מה הסמל האישי שלך שחזר בדמיונך?', en: 'What personal symbol appeared in your imagination?' },
  reflectionPlaceholder: { he: 'תארי את הסמל שלך...', en: 'Describe your symbol...' },

  prevLesson: { file: 'lesson-02.html', titleHe: 'רגש כמקור', titleEn: 'Emotion as Source' },
  nextLesson: { file: 'lesson-04.html', titleHe: 'אור, אווירה ומים', titleEn: 'Light, Atmosphere & Water' }
};
