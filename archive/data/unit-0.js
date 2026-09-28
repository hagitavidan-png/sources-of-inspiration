/* ============================================================
   UNIT 0 – יחידת פתיחה: הצתת הניצוץ
   הוספת שיעור: הוסף אובייקט חדש ל-lessons[] עם כל השדות
   ============================================================ */

const UNIT_0 = {
  id: 'unit-0',
  num: 'יחידת פתיחה',
  numEn: 'Intro Unit',
  icon: 'fa-solid fa-fire-flame-curved',
  color: '#7c6fa0',          /* --u0 */
  titleHe: 'הצתת הניצוץ',
  titleEn: 'Igniting the Spark',
  subtitleHe: 'מהי השראה? כיצד מגלים את הניצוץ הפנימי שמוביל לציור אמיתי',
  subtitleEn: 'What is inspiration? How to discover the inner spark that leads to real painting',
  style: 'unit-intro',       /* 'unit-intro' = רצועת פתיחה רחבה | 'unit-card' = כרטיס רגיל */

  lessons: [
    {
      id: 'lesson-01',
      num: '01',
      file: 'lessons/lesson-01.html',
      titleHe: 'מה זו השראה?',
      titleEn: 'What is Inspiration?',
      metaHe: 'יומן ויזואלי יומי | 10 דק\'',
      metaEn: 'Daily Visual Journal | 10 min',
    }
    /* ── הוספת שיעור חדש ──────────────────────────────────────
    ,{
      id: 'lesson-01b',
      num: '01B',
      file: 'lessons/lesson-01b.html',
      titleHe: 'שם השיעור',
      titleEn: 'Lesson Title',
      metaHe: 'נושא | xx דק\'',
      metaEn: 'Topic | xx min',
    }
    ──────────────────────────────────────────────────────────── */
  ]
};
