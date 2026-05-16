/**
 * course-progression.js
 * ─────────────────────
 * Single source of truth for the entire course structure.
 * Injected into every lesson. Reads the current page URL,
 * determines position, and renders the correct next-step button
 * on the lesson's ending screen (.close-btns).
 *
 * NO manual per-lesson configuration needed.
 * Add new lessons by editing COURSE_MAP only.
 */

(function () {
  'use strict';

  // ── COURSE MAP ─────────────────────────────────────────────────────────────
  // Each unit lists its lessons IN ORDER.
  // Only include units/lessons that are LIVE (linked from course.html).
  // "unit00" is the preview unit — treated as standalone, no next-unit logic.
  const COURSE_MAP = [
    {
      id: 'unit00',
      name_he: 'שיעור היכרות',
      name_en: 'Preview Lesson',
      lessons: [
        'personal-experience.html'
      ]
    },
    {
      id: 'unit01',
      name_he: 'יחידה 1 — מקורות ההשראה',
      name_en: 'Unit 1 — Sources of Inspiration',
      lessons: [
        'lesson-1-1.html',
        'emotion-drawing.html',
        'visual-journal.html',
        'memory-drawing.html',
        'journal-artwork.html',
        'frida-kahlo.html',
        'unit-summary.html'
      ]
    },
    {
      id: 'unit02',
      name_he: 'יחידה 2',
      name_en: 'Unit 2',
      lessons: [
        'lesson-2-1.html',
        'lesson-2-2.html',
        'lesson-2-3.html',
        'lesson-2-4.html'
      ]
    }
    // Add future units here:
    // { id: 'unit03', name_he: 'יחידה 3', name_en: 'Unit 3', lessons: [...] }
  ];

  // ── HELPERS ────────────────────────────────────────────────────────────────

  /** Return the filename of the current page, e.g. "lesson-1-1.html" */
  function currentFile() {
    const parts = window.location.pathname.split('/');
    return parts[parts.length - 1] || '';
  }

  /** Find {unitIndex, lessonIndex} for a given filename, or null */
  function findPosition(filename) {
    for (let u = 0; u < COURSE_MAP.length; u++) {
      const li = COURSE_MAP[u].lessons.indexOf(filename);
      if (li !== -1) return { u, li };
    }
    return null;
  }

  /** Get current language: 'he' or 'en' */
  function getLang() {
    return (
      document.documentElement.lang ||
      document.body.classList.contains('rtl') ? 'he' : 'en'
    ) === 'he' ? 'he' : 'en';
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────

  function render() {
    const file = currentFile();
    const pos  = findPosition(file);
    if (!pos) return; // lesson not in map — nothing to inject

    const { u, li } = pos;
    const unit    = COURSE_MAP[u];
    const isLastLesson = li === unit.lessons.length - 1;
    const isLastUnit   = u  === COURSE_MAP.length - 1;

    // Find the .close-btns or .complete-btns container (handles both lesson types)
    const container = document.querySelector('.close-btns, .complete-btns');
    if (!container) return;

    // Don't inject twice
    if (container.querySelector('.prog-next-btn')) return;

    const lang = getLang();
    const isHe = lang === 'he';

    let btn = null;

    if (!isLastLesson) {
      // ── Case 1: regular lesson → next lesson ─────────────────────────────
      const nextFile = unit.lessons[li + 1];
      const nextUrl  = nextFile; // same directory

      btn = document.createElement('a');
      btn.className = 'btn-outline prog-next-btn';
      btn.href = nextUrl;
      btn.innerHTML = isHe
        ? '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg> לשיעור הבא'
        : 'Next Lesson <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    } else if (!isLastUnit) {
      // ── Case 2: last lesson in unit → next unit ──────────────────────────
      const nextUnit = COURSE_MAP[u + 1];
      const nextUrl  = nextUnit.lessons[0];

      // Completion message
      const msg = document.createElement('p');
      msg.className = 'prog-unit-complete';
      msg.textContent = isHe ? 'סיימתם את היחידה' : 'You completed this unit.';
      container.parentNode.insertBefore(msg, container);

      btn = document.createElement('a');
      btn.className = 'btn-outline prog-next-btn prog-next-unit';
      btn.href = nextUrl;
      btn.innerHTML = isHe
        ? '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg> מעבר ליחידה הבאה'
        : 'Next Unit <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    } else {
      // ── Case 3: final lesson of entire course ────────────────────────────
      const msg = document.createElement('p');
      msg.className = 'prog-unit-complete prog-course-complete';
      msg.textContent = isHe ? 'סיימתם את הקורס' : 'You completed the course.';
      container.parentNode.insertBefore(msg, container);
      // No next button — only the existing "back to course" remains
    }

    if (btn) {
      // Append after existing button(s)
      container.appendChild(btn);
    }
  }

  // ── STYLES ─────────────────────────────────────────────────────────────────

  function injectStyles() {
    if (document.getElementById('prog-styles')) return;
    const style = document.createElement('style');
    style.id = 'prog-styles';
    style.textContent = `
      /* Progression: next-lesson / next-unit button */
      .prog-next-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 26px;
        border-radius: 50px;
        border: 1.5px solid rgba(255,255,255,.22);
        color: rgba(255,255,255,.82);
        background: transparent;
        font-size: .82rem;
        font-weight: 600;
        letter-spacing: .01em;
        text-decoration: none;
        transition: border-color .2s, color .2s;
        cursor: pointer;
      }
      .prog-next-btn:hover {
        border-color: rgba(255,255,255,.5);
        color: #fff;
      }
      .prog-next-unit {
        border-color: var(--gold, #c9a96e);
        color: var(--gold, #c9a96e);
      }
      .prog-next-unit:hover {
        border-color: var(--gold, #c9a96e);
        color: #fff;
        background: rgba(201,169,110,.12);
      }

      /* Completion message */
      .prog-unit-complete {
        font-size: .78rem;
        color: rgba(255,255,255,.45);
        text-align: center;
        margin-bottom: 4px;
        letter-spacing: .02em;
      }
      .prog-course-complete {
        font-size: .88rem;
        color: var(--gold, #c9a96e);
        font-weight: 600;
      }

      /* RTL support */
      html[lang="he"] .prog-next-btn,
      body.rtl .prog-next-btn {
        flex-direction: row-reverse;
      }
      html[lang="he"] .prog-unit-complete,
      body.rtl .prog-unit-complete {
        text-align: right;
      }
    `;
    document.head.appendChild(style);
  }

  // ── INIT ───────────────────────────────────────────────────────────────────

  function init() {
    injectStyles();
    render();
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
