/* ============================================================
   LESSON 04 – אור, אווירה ומים
   ============================================================ */

const LESSON_04 = {
  id: 'lesson-04',
  num: '04',
  unit: 'יחידה 2 – העולם הטבעי',
  unitEn: 'Unit 2 – The Natural World',
  unitColor: '#4CAF7D',
  heroImage: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1400&q=80',

  titleHe: 'אור, אווירה ומים',
  titleEn: 'Light, Atmosphere & Water',

  metaIcon1: 'fa-solid fa-book-open', meta1He: 'שיעור 04', meta1En: 'Lesson 04',
  metaIcon2: 'fa-solid fa-clock',     meta2He: 'יום שלם', meta2En: 'Full day',
  metaIcon3: 'fa-solid fa-sun',       meta3He: 'שעות הזהב', meta3En: 'Golden Hours',

  introTitle: { he: 'האימפרסיוניסטים ורדיפת האור', en: 'The Impressionists and the Chase for Light' },
  introText: { he: 'קלוד מונה ציב סדרות של לוחות ציור בחוץ – כי הבין שאור משתנה מדקה לדקה. הוא לא ציר חפצים; הוא ציר את מה שהאור עושה לחפצים. אורות ישירים, צללים כחלחלים, שעות זריחה ושקיעה – כולם מציעים פלטות שונות לחלוטין. לצאת לצייר בשעות שונות = לגלות עולמות שונים.', en: 'Claude Monet set up series of canvases outside — because he understood that light changes minute by minute. He didn\'t paint objects; he painted what light does to objects. Direct lights, bluish shadows, sunrise and sunset hours — all offer completely different palettes. Going out to paint at different hours = discovering different worlds.' },

  artistsSectionTitle: { he: 'אמנים שציידו אור', en: 'Artists Who Hunted Light' },
  artists: [
    {
      avatar: '💧',
      nameHe: 'קלוד מונה (1840–1926)',
      nameEn: 'Claude Monet (1840–1926)',
      styleHe: 'אימפרסיוניזם · אור ומים',
      styleEn: 'Impressionism · Light & Water',
      bioHe: 'מונה בנה בגינתו בז\'יוורני אגם עם גשר יפני – ואז ציר אותו מאות פעמים. לא את הגשר – את האור על המים. בשנותיו האחרונות, עם ראייה לקויה, ציר סדרת חבצלות מים שהפכה לאחת הסדרות המפורסמות באמנות העולם.',
      bioEn: 'Monet built a pond with a Japanese bridge in his Giverny garden — then painted it hundreds of times. Not the bridge — the light on the water. In his later years, with poor eyesight, he painted the Water Lilies series that became one of the most famous series in world art.',
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg/1280px-Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg', altHe: 'מונה – חבצלות מים', altEn: 'Monet – Water Lilies', captionHe: 'Water Lilies, 1906', captionEn: 'Water Lilies, 1906' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Claude_Monet_-_Impression%2C_Sunrise.jpg/1280px-Claude_Monet_-_Impression%2C_Sunrise.jpg', altHe: 'מונה – רושם, זריחה', altEn: 'Monet – Impression, Sunrise', captionHe: 'Impression, Sunrise, 1872', captionEn: 'Impression, Sunrise, 1872' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Claude_Monet_-_Haystacks%2C_end_of_summer.jpg/1280px-Claude_Monet_-_Haystacks%2C_end_of_summer.jpg', altHe: 'מונה – ערמות שחת', altEn: 'Monet – Haystacks', captionHe: 'Haystacks, End of Summer, 1891', captionEn: 'Haystacks, End of Summer, 1891' }
      ]
    },
    {
      avatar: '🌅',
      nameHe: 'ג\'וזף מלורד וויליאם טרנר (1775–1851)',
      nameEn: 'J.M.W. Turner (1775–1851)',
      styleHe: 'רומנטיקה בריטית · אור ואטמוספרה',
      styleEn: 'British Romanticism · Light & Atmosphere',
      bioHe: 'טרנר היה המאסטר של אטמוספרה. הוא קשר את עצמו לתורן ספינה בסערה כדי לצייר את האנרגיה של הים. ציוריו הם כמעט אבסטרקטיים – אך תמיד עם עוצמת האור.',
      bioEn: 'Turner was the master of atmosphere. He tied himself to a ship\'s mast in a storm to paint the energy of the sea. His paintings are almost abstract — but always with the power of light.',
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Joseph_Mallord_William_Turner_-_Snow_Storm_-_Steam-Boat_off_a_Harbour%27s_Mouth.jpg/1280px-Joseph_Mallord_William_Turner_-_Snow_Storm_-_Steam-Boat_off_a_Harbour%27s_Mouth.jpg', altHe: 'טרנר – סופת שלג', altEn: 'Turner – Snow Storm', captionHe: 'Snow Storm: Steam-Boat off a Harbour\'s Mouth, 1842', captionEn: 'Snow Storm: Steam-Boat, 1842' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Fighting_Temeraire_J_M_W_Turner.jpg/1280px-Fighting_Temeraire_J_M_W_Turner.jpg', altHe: 'טרנר – הטמרר', altEn: 'Turner – The Fighting Temeraire', captionHe: 'The Fighting Temeraire, 1839', captionEn: 'The Fighting Temeraire, 1839' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Turner_-_Rain%2C_Steam_and_Speed_-_National_Gallery_file.jpg/1280px-Turner_-_Rain%2C_Steam_and_Speed_-_National_Gallery_file.jpg', altHe: 'טרנר – גשם, קיטור ומהירות', altEn: 'Turner – Rain, Steam and Speed', captionHe: 'Rain, Steam and Speed, 1844', captionEn: 'Rain, Steam and Speed, 1844' }
      ]
    }
  ],

  techniquesSectionTitle: { he: '4 סוגי אור לציור', en: '4 Types of Light for Painting' },
  techniques: [
    { icon: '🌅', titleHe: 'אור זריחה – זהב ורוד', titleEn: 'Sunrise Light – Gold & Pink', descHe: 'האור הרך ביותר. צללים ארוכים. הכל זוהר. הזמן הטוב ביותר לצייר ריאליסטי.', descEn: 'The softest light. Long shadows. Everything glows. The best time for realistic painting.' },
    { icon: '☀️', titleHe: 'אור צהריים – חריף וחזק', titleEn: 'Midday Light – Sharp & Strong', descHe: 'ניגודים חזקים. צללים קצרים. מצוין לדרמה ולאקספרסיוניזם.', descEn: 'Strong contrasts. Short shadows. Excellent for drama and expressionism.' },
    { icon: '🌇', titleHe: 'אור שקיעה – כתום ועמוק', titleEn: 'Sunset Light – Orange & Deep', descHe: 'הזמן הקסום. כתום, מגנטה, סגול. כל מה שנוגע ביום הולך לישון בצבעים חמים.', descEn: 'The magical time. Orange, magenta, purple. Everything touched by daylight goes to sleep in warm colors.' },
    { icon: '🌫️', titleHe: 'אור עכור – אפור ואחיד', titleEn: 'Overcast Light – Gray & Even', descHe: 'ללא ניגודים. כל הצבעים רכים. מצוין לפורטרטים ולנושאים עדינים.', descEn: 'No contrasts. All colors are soft. Excellent for portraits and delicate subjects.' }
  ],

  exerciseTitle: { he: 'תרגיל: 4 שעות × 4 אורות', en: 'Exercise: 4 Hours × 4 Lights' },
  exerciseSeconds: 2700,
  exerciseTimerLabel: { he: '45 דקות', en: '45 minutes' },
  exerciseChecklist: [
    { he: 'צאי בוקר מוקדם (שעה אחרי זריחה). ציירי את אותה הנוף.', en: 'Go out early morning (one hour after sunrise). Paint the same landscape.' },
    { he: 'חזרי לאותו מקום בצהריים. ציירי שוב – שימי לב לשינוי הצללים.', en: 'Return to the same spot at noon. Paint again — notice the change in shadows.' },
    { he: 'בסיום היום (שעה לפני שקיעה) – ציירי פעם שלישית.', en: 'At end of day (one hour before sunset) — paint a third time.' },
    { he: 'השווי את 3 הציורים: מה השתנה בפלטה? בצללים? בתחושה?', en: 'Compare the 3 paintings: what changed in the palette? The shadows? The feeling?' }
  ],

  quote: { he: '"הצבע הוא מה שהאור עושה לחפצים. הצורה היא מה שהצל עושה לאור."', en: '"Color is what light does to objects. Form is what shadow does to light."' },
  quoteAuthor: '— קלוד מונה',

  reflectionQ: { he: 'איזה שעה ביום אתה הכי אוהב לצייר בה ולמה?', en: 'What time of day do you love most to paint and why?' },
  reflectionPlaceholder: { he: 'כתבי על השעה המועדפת שלך...', en: 'Write about your favorite time...' },

  prevLesson: { file: 'lesson-03.html', titleHe: 'מעבדת האמן: פרידה קאלו', titleEn: 'Artist Lab: Frida Kahlo' },
  nextLesson: { file: 'lesson-05.html', titleHe: 'מרקמים, עונות ופרטים זעירים', titleEn: 'Textures, Seasons & Tiny Details' }
};
