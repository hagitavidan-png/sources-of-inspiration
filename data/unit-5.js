/* ============================================================
   UNIT 5 – העולם הביתי
   הוספת שיעור: הוסף אובייקט חדש ל-lessons[] עם כל השדות
   ============================================================ */

const UNIT_5 = {
  id: 'unit-5',
  num: 'יחידה 5',
  numEn: 'Unit 5',
  icon: 'fa-solid fa-house-chimney',
  color: '#4A90E2',          /* Unit 5 – Blue */
  titleHe: 'העולם הביתי',
  titleEn: 'The Home World',
  subtitleHe: 'חפצים, חלונות ואור ביתי',
  subtitleEn: 'Objects, windows & home light',
  style: 'unit-card',

  lessons: [
    {
      id: 'lesson-12',
      num: '12',
      file: 'lessons/lesson-12.html',
      titleHe: 'חפצים, שולחנות וחלונות',
      titleEn: 'Objects, Tables & Windows',
      metaHe: 'אור מהצד | 45 דק\'',
      metaEn: 'Side Light | 45 min',
    },
    {
      id: 'lesson-13',
      num: '13',
      file: 'lessons/lesson-13.html',
      titleHe: 'דרמת האור הביתי',
      titleEn: 'Drama of Home Light',
      metaHe: 'נר בחושך | 30 דק\'',
      metaEn: 'Candle in Darkness | 30 min',
    }
    /* ── הוספת שיעור חדש ──────────────────────────────────────
    ,{
      id: 'lesson-13b',
      num: '13B',
      file: 'lessons/lesson-13b.html',
      titleHe: 'שם השיעור',
      titleEn: 'Lesson Title',
      metaHe: 'נושא | xx דק\'',
      metaEn: 'Topic | xx min',
    }
    ──────────────────────────────────────────────────────────── */
  ]
};
