/* ============================================================
   UNIT 4 – העולם האורבני
   הוספת שיעור: הוסף אובייקט חדש ל-lessons[] עם כל השדות
   ============================================================ */

const UNIT_4 = {
  id: 'unit-4',
  num: 'יחידה 4',
  numEn: 'Unit 4',
  icon: 'fa-solid fa-city',
  color: '#C9A96E',          /* Unit 4 – Gold */
  titleHe: 'העולם האורבני',
  titleEn: 'The Urban World',
  subtitleHe: 'אנשים, פנים וגיאומטריה עירונית',
  subtitleEn: 'People, faces & urban geometry',
  style: 'unit-card',

  lessons: [
    {
      id: 'lesson-10',
      num: '10',
      file: 'lessons/lesson-10.html',
      titleHe: 'אנשים, פנים וגיאומטריה עירונית',
      titleEn: 'People, Faces & Urban Geometry',
      metaHe: '10 סקיצות רחוב | 20–30 דק\'',
      metaEn: '10 Street Sketches | 20–30 min',
    },
    {
      id: 'lesson-11',
      num: '11',
      file: 'lessons/lesson-11.html',
      titleHe: 'מעבדת האמן: אדוארד הופר',
      titleEn: 'Artist Lab: Edward Hopper',
      metaHe: 'אור דרמטי | 40 דק\'',
      metaEn: 'Dramatic Light | 40 min',
    }
    /* ── הוספת שיעור חדש ──────────────────────────────────────
    ,{
      id: 'lesson-11b',
      num: '11B',
      file: 'lessons/lesson-11b.html',
      titleHe: 'שם השיעור',
      titleEn: 'Lesson Title',
      metaHe: 'נושא | xx דק\'',
      metaEn: 'Topic | xx min',
    }
    ──────────────────────────────────────────────────────────── */
  ]
};
