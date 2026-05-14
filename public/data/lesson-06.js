/* ============================================================
   LESSON 06 – פלטות צבע מהטבע
   ============================================================ */

const LESSON_06 = {
  id: 'lesson-06',
  num: '06',
  unit: 'יחידה 2 – העולם הטבעי',
  unitEn: 'Unit 2 – The Natural World',
  unitColor: '#4CAF7D',
  heroImage: 'https://images.unsplash.com/photo-1490750967868-88df5691cc60?w=1400&q=80',

  titleHe: 'פלטות צבע מהטבע',
  titleEn: 'Color Palettes from Nature',

  metaIcon1: 'fa-solid fa-book-open', meta1He: 'שיעור 06', meta1En: 'Lesson 06',
  metaIcon2: 'fa-solid fa-clock',     meta2He: '45 דקות', meta2En: '45 minutes',
  metaIcon3: 'fa-solid fa-palette',   meta3He: '15 צבעים מהחוץ', meta3En: '15 Colors from Outside',

  introTitle: { he: 'הטבע הוא פלטת הצבעים הכי מושלמת', en: 'Nature is the Most Perfect Color Palette' },
  introText: { he: 'לפני שהיו חנויות צבע, האמנים הכינו את הצבעים שלהם מהטבע: ממינרלים, מצמחים, מביצי עוף, מעצמות שרופות. הצבע הכחול הכי יקר בתולדות האמנות (אולטרה-מארין) הוצא מאבן חצי-יקרה. כשאת יוצאת לטבע, את לא רק מחפשת השראה – את מוצאת פלטת צבעים מוכנה שאף בית ספר לאמנות לא יוכל לשפר.', en: 'Before there were paint stores, artists made their colors from nature: from minerals, plants, egg whites, burnt bones. The most expensive blue in art history (ultramarine) was extracted from a semi-precious stone. When you go out into nature, you\'re not just looking for inspiration — you find a ready palette that no art school can improve upon.' },

  artistsSectionTitle: { he: 'אמנים שבנו פלטות מהטבע', en: 'Artists Who Built Palettes from Nature' },
  artists: [
    {
      avatar: '🌾',
      nameHe: 'קלוד מונה (1840–1926)',
      nameEn: 'Claude Monet (1840–1926)',
      styleHe: 'אימפרסיוניזם · פלטות עונתיות',
      styleEn: 'Impressionism · Seasonal Palettes',
      bioHe: 'מונה ציר את אותה ערמת שחת 30 פעמים — בשמש, בגשם, בשלג, בדמדומים. כל ציור — פלטת צבעים אחרת. הטבע לא השתנה, האור השתנה. לומדים: אותו מקום, פלטות אינסופיות.',
      bioEn: 'Monet painted the same haystack 30 times — in sun, rain, snow, twilight. Each painting — a different color palette. The nature didn\'t change, the light changed. Lesson: same place, infinite palettes.',
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Claude_Monet_-_Haystacks%2C_end_of_summer.jpg/1280px-Claude_Monet_-_Haystacks%2C_end_of_summer.jpg', altHe: 'מונה – ערמת שחת', altEn: 'Monet – Haystacks', captionHe: 'Haystacks, End of Summer, 1891', captionEn: 'Haystacks, End of Summer, 1891' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg/1280px-Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg', altHe: 'מונה – חבצלות', altEn: 'Monet – Water Lilies', captionHe: 'Water Lilies, 1906', captionEn: 'Water Lilies, 1906' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Claude_Monet_-_Impression%2C_Sunrise.jpg/1280px-Claude_Monet_-_Impression%2C_Sunrise.jpg', altHe: 'מונה – זריחה', altEn: 'Monet – Sunrise', captionHe: 'Impression, Sunrise, 1872', captionEn: 'Impression, Sunrise, 1872' }
      ]
    }
  ],

  techniquesSectionTitle: { he: 'כיצד בונים פלטה מהטבע', en: 'How to Build a Palette from Nature' },
  techniques: [
    { icon: '👀', titleHe: 'תצפית ראשונה', titleEn: 'First Observation', descHe: 'עצרי ותסתכלי. מה הצבע הדומיננטי? מה הצבע הנדיר?', descEn: 'Stop and look. What\'s the dominant color? What\'s the rare color?' },
    { icon: '📸', titleHe: 'צילום כעזר', titleEn: 'Photography as Aid', descHe: 'צלמי את מה שמרגש אותך. חזרי הביתה וחלצי ממנו 5 צבעים.', descEn: 'Photograph what excites you. Come home and extract 5 colors from it.' },
    { icon: '🎨', titleHe: 'ערבוב בשטח', titleEn: 'Mixing in the Field', descHe: 'נסי לערבב צבעים בשטח עד שתגיעי לצבע המדויק שרואה עינך.', descEn: 'Try mixing colors in the field until you reach the exact color your eye sees.' },
    { icon: '📖', titleHe: 'ספר פלטות אישי', titleEn: 'Personal Palette Book', descHe: 'שמרי דגימות צבע בספר נפרד. לכל מקום – פלטה אחת.', descEn: 'Keep color samples in a separate book. For each place — one palette.' }
  ],

  exerciseTitle: { he: 'תרגיל: 15 צבעים מהחוץ', en: 'Exercise: 15 Colors from Outside' },
  exerciseSeconds: 2700,
  exerciseTimerLabel: { he: '45 דקות', en: '45 minutes' },
  exerciseChecklist: [
    { he: 'קחי צבעים ואת ספר השרטוטים. צאי לטבע – גינה, פארק, חצר.', en: 'Take colors and your sketchbook. Go to nature — garden, park, yard.' },
    { he: 'ערבבי צבעים עד שתגיעי ל-15 גוון שאת רואה סביבך.', en: 'Mix colors until you reach 15 shades you see around you.' },
    { he: 'צבעי ריבועים קטנים ורשמי ליד כל אחד מה "זה" (עלה, שמיים, אדמה).', en: 'Paint small squares and note next to each what it "is" (leaf, sky, soil).' },
    { he: 'בחרי 3 הצבעים האהובים. אלה יהיו הפלטה של הציור הבא שלך.', en: 'Choose your 3 favorite colors. These will be the palette for your next painting.' }
  ],

  quote: { he: '"הצבע הוא המקום שבו המוח שלנו פוגש את היקום."', en: '"Color is the place where our brain meets the universe."' },
  quoteAuthor: '— פול סזאן',

  reflectionQ: { he: 'מה הפלטה שגילית?', en: 'What palette did you discover?' },
  reflectionPlaceholder: { he: 'אילו 3 צבעים בחרת? מה הם מרגישים?', en: 'What 3 colors did you choose? What do they feel like?' },

  prevLesson: { file: 'lesson-05.html', titleHe: 'מרקמים, עונות ופרטים זעירים', titleEn: 'Textures, Seasons & Tiny Details' },
  nextLesson: { file: 'lesson-07.html', titleHe: 'וואבי-סאבי: יופי הפגמים', titleEn: 'Wabi-Sabi: Beauty of Imperfection' }
};
