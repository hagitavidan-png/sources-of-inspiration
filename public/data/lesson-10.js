/* ============================================================
   LESSON 10 – אנשים, פנים וגאומטריה עירונית
   לעריכה: שנה כל שדה בחופשיות.
   ============================================================ */

const LESSON_10 = {
  id: 'lesson-10',
  num: '10',
  unit: 'יחידה 4 – העיר והאדם',
  unitEn: 'Unit 4 – The City & People',
  unitColor: '#C9A96E',
  heroImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1400&q=80',

  titleHe: 'אנשים, פנים וגאומטריה עירונית',
  titleEn: 'People, Faces & Urban Geometry',

  metaIcon1: 'fa-solid fa-book-open',
  meta1He: 'שיעור 10',
  meta1En: 'Lesson 10',
  metaIcon2: 'fa-solid fa-clock',
  meta2He: '20–30 דקות',
  meta2En: '20–30 min',
  metaIcon3: 'fa-solid fa-city',
  meta3He: '10 סקיצות עירוניות',
  meta3En: '10 urban sketches',

  introTitle: { he: 'העיר כסטודיו פתוח', en: 'The City as Open Studio' },
  introText: { he: 'קאיבוט ציר פריז מהחלון שלו – לא ציור רומנטי, אלא תצפית קרה ומדויקת על אנשים שהולכים, גשרים, קווים אנכיים. העיר מלאה בגאומטריה שמחכה להתגלות. כל פינת רחוב היא מסגרת, כל חלון הוא ציור, כל הולך רגל הוא דמות. הסוד: אל תצייר "פריז" – ציירי את מה שעינייך רואות עכשיו.', en: 'Caillebotte painted Paris from his window — not a romantic painting, but a cold and precise observation of people walking, bridges, vertical lines. The city is full of geometry waiting to be discovered. Every street corner is a frame, every window a painting, every pedestrian a figure. The secret: don\'t paint "Paris" — paint what your eyes see right now.' },

  artistsSectionTitle: { he: 'אמנים שציירו את העיר', en: 'Artists Who Painted the City' },

  artists: [
    {
      avatar: '🏙️',
      nameHe: 'גוסטב קאיבוט (1848–1894)',
      nameEn: 'Gustave Caillebotte (1848–1894)',
      styleHe: 'אימפרסיוניזם · אורבניזם',
      styleEn: 'Impressionism · Urbanism',
      bioHe: 'קאיבוט ציר פריז מנקודת מבט מדויקת ועכשווית. הוא שילב פרספקטיבה אדריכלית עם אנשים אנונימיים. "רחוב פריז ביום גשום" (1877) הוא מופת של קומפוזיציה עירונית – קווים, מטריות, מדרכות.',
      bioEn: 'Caillebotte painted Paris from a precise and contemporary perspective. He combined architectural perspective with anonymous people. "Paris Street; Rainy Day" (1877) is a masterpiece of urban composition — lines, umbrellas, sidewalks.',
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Gustave_Caillebotte_-_Rue_de_Paris%2C_temps_de_pluie_-_Google_Art_Project.jpg/1280px-Gustave_Caillebotte_-_Rue_de_Paris%2C_temps_de_pluie_-_Google_Art_Project.jpg', altHe: 'קאיבוט – רחוב בגשם', altEn: 'Caillebotte – Rainy Day', captionHe: 'Paris Street; Rainy Day, 1877', captionEn: 'Paris Street; Rainy Day, 1877' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Gustave_Caillebotte_-_Le_Pont_de_l%27Europe_-_Google_Art_Project.jpg/1280px-Gustave_Caillebotte_-_Le_Pont_de_l%27Europe_-_Google_Art_Project.jpg', altHe: 'קאיבוט – גשר אירופה', altEn: 'Caillebotte – Pont de l\'Europe', captionHe: 'Le Pont de l\'Europe, 1876', captionEn: 'Le Pont de l\'Europe, 1876' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Gustave_Caillebotte_-_The_Floor_Scrapers_-_Google_Art_Project.jpg/1280px-Gustave_Caillebotte_-_The_Floor_Scrapers_-_Google_Art_Project.jpg', altHe: 'קאיבוט – מגרדי הרצפה', altEn: 'Caillebotte – Floor Scrapers', captionHe: 'The Floor Scrapers, 1875', captionEn: 'The Floor Scrapers, 1875' }
      ]
    },
    {
      avatar: '🎭',
      nameHe: 'אדגר דגא (1834–1917)',
      nameEn: 'Edgar Degas (1834–1917)',
      styleHe: 'אימפרסיוניזם · תנועה ודמויות',
      styleEn: 'Impressionism · Movement & Figures',
      bioHe: 'דגא ציר רקדניות, מרוצי סוסים, בתי קפה – תמיד מנקודת מבט בלתי צפויה. הוא היה מלאכותי ב"לכידת רגע" – כמו צלם שהקפיא תנועה. "אמנות אינה מה שאתה רואה, אלא מה שאתה גורם לאחרים לראות."',
      bioEn: 'Degas painted dancers, horse races, cafes — always from an unexpected viewpoint. He was masterful at "capturing the moment" — like a photographer freezing motion. "Art is not what you see, but what you make others see."',
      images: [
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Edgar_Degas_-_The_Dance_Class_-_Google_Art_Project.jpg/1280px-Edgar_Degas_-_The_Dance_Class_-_Google_Art_Project.jpg', altHe: 'דגא – שיעור הריקוד', altEn: 'Degas – The Dance Class', captionHe: 'The Dance Class, 1874', captionEn: 'The Dance Class, 1874' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Edgar_Degas_-_The_Bellelli_Family_-_Google_Art_Project.jpg/1280px-Edgar_Degas_-_The_Bellelli_Family_-_Google_Art_Project.jpg', altHe: 'דגא – משפחת בלל', altEn: 'Degas – Bellelli Family', captionHe: 'The Bellelli Family, 1858–67', captionEn: 'The Bellelli Family, 1858–67' },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Edgar_Germain_Hilaire_Degas_012.jpg/800px-Edgar_Germain_Hilaire_Degas_012.jpg', altHe: 'דגא – רקדניות', altEn: 'Degas – Dancers', captionHe: 'Dancers, Blue, ~1895', captionEn: 'Dancers, Blue, ~1895' }
      ]
    }
  ],

  techniquesSectionTitle: { he: '4 קווי גאומטריה עירוניים', en: '4 Lines of Urban Geometry' },
  techniques: [
    { icon: '⬆️', titleHe: 'קווים אנכיים', titleEn: 'Vertical Lines', descHe: 'בניינים, עמודים, דמויות – יוצרים תחושת גובה ועוצמה.', descEn: 'Buildings, columns, figures — create a sense of height and power.' },
    { icon: '➡️', titleHe: 'קו אופק', titleEn: 'Horizon Line', descHe: 'נמוך = שמיים גדולים. גבוה = קרקע גדולה. הכל תלוי בבחירה.', descEn: 'Low = big sky. High = big ground. Everything depends on the choice.' },
    { icon: '↗️', titleHe: 'קווים באלכסון', titleEn: 'Diagonal Lines', descHe: 'גשרים, מדרגות, פרספקטיבה – מוסיפים תנועה ועומק.', descEn: 'Bridges, stairs, perspective — add movement and depth.' },
    { icon: '⭕', titleHe: 'עיגולים ופתחים', titleEn: 'Circles & Openings', descHe: 'חלונות, קשתות, שערים – מסגרות בתוך המסגרת.', descEn: 'Windows, arches, gates — frames within the frame.' }
  ],

  exerciseTitle: { he: 'תרגיל: 10 סקיצות עירוניות', en: 'Exercise: 10 Urban Sketches' },
  exerciseSeconds: 1500,
  exerciseTimerLabel: { he: '25 דקות', en: '25 minutes' },
  exerciseChecklist: [
    { he: 'שבי ליד חלון או צאי לרחוב. מצאי נקודה אחת שעומדת מולך.', en: 'Sit by a window or go outside. Find one spot facing you.' },
    { he: 'ציירי 10 סקיצות קטנות – כל אחת 2-3 דקות. אל תמחקי.', en: 'Draw 10 small sketches — 2–3 minutes each. Don\'t erase.' },
    { he: 'בכל סקיצה – שני דברים שונים: קווים בלבד, אחר כך רק צבעים.', en: 'In each sketch — two different things: lines only, then only colors.' },
    { he: 'בחרי את הסקיצה שהכי מרגשת אותך – ולמה?', en: 'Choose the sketch that excites you most — and why?' }
  ],

  quote: { he: '"אמנות אינה מה שאתה רואה, אלא מה שאתה גורם לאחרים לראות."', en: '"Art is not what you see, but what you make others see."' },
  quoteAuthor: '— אדגר דגא',

  reflectionQ: { he: 'מה גיליתי בעיר שלי שלא ראיתי קודם?', en: 'What did I discover in my city that I hadn\'t seen before?' },
  reflectionPlaceholder: { he: 'תארי פינה אחת בעיר שלך...', en: 'Describe one corner of your city...' },

  prevLesson: { file: 'lesson-09.html', titleHe: 'מעבדת האמן: קנדינסקי', titleEn: 'Artist Lab: Kandinsky' },
  nextLesson: { file: 'lesson-11.html', titleHe: 'מעבדת האמן: הופר', titleEn: 'Artist Lab: Hopper' }
};
