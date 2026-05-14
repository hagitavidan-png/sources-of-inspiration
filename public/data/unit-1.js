/* ============================================================
   UNIT 1 – העולם הפנימי
   הוספת שיעור: הוסף אובייקט חדש ל-lessons[] עם כל השדות
   ============================================================ */

const UNIT_1 = {
  id: 'unit-1',
  num: 'יחידה 1',
  numEn: 'Unit 1',
  icon: 'fa-solid fa-heart-pulse',
  color: '#E04D4D',          /* Unit 1 – Red */
  titleHe: 'העולם הפנימי',
  titleEn: 'The Inner World',
  subtitleHe: 'רגש, זהות וסמלים אישיים',
  subtitleEn: 'Emotion, identity & personal symbols',
  style: 'unit-card',

  lessons: [
    {
      id: 'lesson-02',
      num: '02',
      file: 'lessons/lesson-02.html',
      titleHe: 'רגש כמקור – מהבטן אל הקנבס',
      titleEn: 'Emotion as Source – From Gut to Canvas',
      metaHe: 'מפת הרגשות | 20 דק\'',
      metaEn: 'Emotion Map | 20 min',
    },
    {
      id: 'lesson-03',
      num: '03',
      file: 'lessons/lesson-03.html',
      titleHe: 'מעבדת האמן: פרידה קאלו',
      titleEn: 'Artist Lab: Frida Kahlo',
      metaHe: 'הסמל האישי שלך | 30–45 דק\'',
      metaEn: 'Your Personal Symbol | 30–45 min',
    }
    /* ── הוספת שיעור חדש ──────────────────────────────────────
    ,{
      id: 'lesson-03b',
      num: '03B',
      file: 'lessons/lesson-03b.html',
      titleHe: 'שם השיעור',
      titleEn: 'Lesson Title',
      metaHe: 'נושא | xx דק\'',
      metaEn: 'Topic | xx min',
    }
    ──────────────────────────────────────────────────────────── */
  ]
};
