/* ============================================================
   UNIT 2 – העולם הטבעי
   הוספת שיעור: הוסף אובייקט חדש ל-lessons[] עם כל השדות
   ============================================================ */

const UNIT_2 = {
  id: 'unit-2',
  num: 'יחידה 2',
  numEn: 'Unit 2',
  icon: 'fa-solid fa-leaf',
  color: '#4CAF7D',          /* Unit 2 – Green */
  titleHe: 'העולם הטבעי',
  titleEn: 'The Natural World',
  subtitleHe: 'אור, מרקם, צבע ופגומות יפות',
  subtitleEn: 'Light, texture, color & beautiful imperfections',
  style: 'unit-card',

  lessons: [
    {
      id: 'lesson-04',
      num: '04',
      file: 'lessons/lesson-04.html',
      titleHe: 'אור, אווירה ומים',
      titleEn: 'Light, Atmosphere & Water',
      metaHe: 'שעות הזהב | יום שלם',
      metaEn: 'Golden Hours | Full day',
    },
    {
      id: 'lesson-05',
      num: '05',
      file: 'lessons/lesson-05.html',
      titleHe: 'מרקמים, עונות ופרטים זעירים',
      titleEn: 'Textures, Seasons & Tiny Details',
      metaHe: 'קו שמרגיש | 25 דק\'',
      metaEn: 'The Line that Feels | 25 min',
    },
    {
      id: 'lesson-06',
      num: '06',
      file: 'lessons/lesson-06.html',
      titleHe: 'פלטות צבע מהטבע',
      titleEn: 'Color Palettes from Nature',
      metaHe: '15 צבעים מהחוץ | 45 דק\'',
      metaEn: '15 Colors from Outside | 45 min',
    },
    {
      id: 'lesson-07',
      num: '07',
      file: 'lessons/lesson-07.html',
      titleHe: 'וואבי-סאבי: יופי הפגמים',
      titleEn: 'Wabi-Sabi: Beauty of Imperfection',
      metaHe: 'הציור הנכשל | 30 דק\'',
      metaEn: 'The Failed Painting | 30 min',
    }
    /* ── הוספת שיעור חדש ──────────────────────────────────────
    ,{
      id: 'lesson-07b',
      num: '07B',
      file: 'lessons/lesson-07b.html',
      titleHe: 'שם השיעור',
      titleEn: 'Lesson Title',
      metaHe: 'נושא | xx דק\'',
      metaEn: 'Topic | xx min',
    }
    ──────────────────────────────────────────────────────────── */
  ]
};
