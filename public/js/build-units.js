/* ================================================================
   7 DIAMONDS – BUILD-UNITS.JS
   בונה את סעיף השיעורים דינמית מקבצי data/unit-X.js
   ─────────────────────────────────────────────────────────────
   כדי להוסיף שיעור חדש  → ערוך data/unit-X.js בלבד
   כדי להוסיף יחידה חדשה → צור data/unit-7.js + הוסף UNIT_7 למערך ALL_UNITS
   ================================================================ */

/* ── 1. רשימת כל היחידות לפי סדר ─────────────────────────── */
const ALL_UNITS = [
  UNIT_0,   // data/unit-0.js  – יחידת פתיחה
  UNIT_1,   // data/unit-1.js  – העולם הפנימי
  UNIT_2,   // data/unit-2.js  – העולם הטבעי
  UNIT_3,   // data/unit-3.js  – מוזיקה ואבסטרקט
  UNIT_4,   // data/unit-4.js  – העולם האורבני
  UNIT_5,   // data/unit-5.js  – העולם הביתי
  UNIT_6,   // data/unit-6.js  – פרוטוקול הסטודיו

  /* ── הוספת יחידה חדשה:
     1. צור data/unit-7.js עם const UNIT_7 = { ... }
     2. הוסף <script src="data/unit-7.js"></script> ב-index.html
     3. הוסף UNIT_7 כאן:
  UNIT_7,
  ──────────────────────────────────────────────────────────── */
];

/* ── 2. עדכן כותרת ראשית בהתאם למספר השיעורים ─────────────── */
function updateHeading() {
  const totalLessons = ALL_UNITS.reduce((sum, u) => sum + u.lessons.length, 0);
  const totalUnits   = ALL_UNITS.filter(u => u.style !== 'unit-intro').length;
  const heading = document.getElementById('lessons-heading');
  if (heading) {
    heading.textContent        = `${totalLessons} שיעורים | ${totalUnits} יחידות`;
    heading.dataset.he         = `${totalLessons} שיעורים | ${totalUnits} יחידות`;
    heading.dataset.en         = `${totalLessons} Lessons | ${totalUnits} Units`;
  }

  /* עדכן גם את ה-stats */
  const statNums = document.querySelectorAll('.stat-num');
  if (statNums[0]) {
    statNums[0].textContent = totalLessons;
  }
  if (statNums[1]) {
    statNums[1].textContent = totalUnits;
  }
  if (statNums[2]) {
    statNums[2].textContent = `${totalLessons}+`;
  }
}

/* ── 3. HTML builders ──────────────────────────────────────── */

/** בנה שורת שיעור בתוך כרטיס יחידה */
function buildLessonItem(lesson, color) {
  return `
    <a href="${lesson.file}" class="unit-lesson-item">
      <div class="lesson-num-badge" style="background:${color}">${lesson.num}</div>
      <div class="lesson-item-text">
        <div class="lesson-item-title"
             data-he="${lesson.titleHe}"
             data-en="${lesson.titleEn}">${lesson.titleHe}</div>
        <div class="lesson-item-meta"
             data-he="${lesson.metaHe}"
             data-en="${lesson.metaEn}">${lesson.metaHe}</div>
      </div>
      <i class="fa-solid fa-chevron-left lesson-arrow"></i>
    </a>`;
}

/** בנה רצועת פתיחה (unit-intro) */
function buildUnitIntro(unit) {
  const pills = unit.lessons.map(l => `
    <a href="${l.file}" class="lesson-pill">
      <span class="lesson-pill-num">${l.num}</span>
      <span data-he="${l.titleHe}" data-en="${l.titleEn}">${l.titleHe}</span>
    </a>`).join('');

  return `
  <div class="unit-intro fade-in">
    <div class="unit-intro-icon"><i class="${unit.icon}"></i></div>
    <div class="unit-intro-content">
      <div class="unit-num" data-he="${unit.num}" data-en="${unit.numEn}">${unit.num}</div>
      <h3 data-he="${unit.titleHe}" data-en="${unit.titleEn}">${unit.titleHe}</h3>
      <p data-he="${unit.subtitleHe}" data-en="${unit.subtitleEn}">${unit.subtitleHe}</p>
      <div class="unit-intro-lessons">${pills}</div>
    </div>
  </div>`;
}

/** בנה כרטיס יחידה רגיל */
function buildUnitCard(unit) {
  const items = unit.lessons.map(l => buildLessonItem(l, unit.color)).join('');

  return `
  <div class="unit-card fade-in" style="--unit-color:${unit.color}">
    <div class="unit-card-header">
      <div>
        <div class="unit-num" data-he="${unit.num}" data-en="${unit.numEn}">${unit.num}</div>
        <div class="unit-icon"><i class="${unit.icon}"></i></div>
        <div class="unit-title" data-he="${unit.titleHe}" data-en="${unit.titleEn}">${unit.titleHe}</div>
        <div class="unit-subtitle" data-he="${unit.subtitleHe}" data-en="${unit.subtitleEn}">${unit.subtitleHe}</div>
      </div>
    </div>
    <div class="unit-card-body">
      <div class="unit-lessons-list">${items}</div>
    </div>
  </div>`;
}

/* ── 4. הרכבת ה-DOM ────────────────────────────────────────── */
function buildUnitsDOM() {
  const container = document.getElementById('units-container');
  if (!container) return;

  /* מפריד: יחידת פתיחה לפני הגריד */
  const introUnits = ALL_UNITS.filter(u => u.style === 'unit-intro');
  const cardUnits  = ALL_UNITS.filter(u => u.style === 'unit-card');

  let html = '';

  introUnits.forEach(u => {
    html += buildUnitIntro(u);
  });

  if (cardUnits.length > 0) {
    html += '<div class="units-grid">';
    cardUnits.forEach(u => {
      html += buildUnitCard(u);
    });
    html += '</div>';
  }

  container.innerHTML = html;
  updateHeading();
}

/* ── 5. הפעלה ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', buildUnitsDOM);
