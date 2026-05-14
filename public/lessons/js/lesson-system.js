/**
 * lesson-system.js
 * ─────────────────────────────────────────────────────────
 * GLOBAL LESSON TEMPLATE SYSTEM
 * Shared across all lessons. Load BEFORE each lesson's
 * inline <script>. All lessons automatically inherit:
 *
 *  1. Pagination dots — RTL-aware direction
 *  2. Button label system — unified per language
 *  3. Instruction block renderer — reusable component
 *  4. Action cue renderer — reusable component
 *  5. Language switch helpers
 * ─────────────────────────────────────────────────────────
 */

/* ═══════════════════════════════════════════════════════
   1. GLOBAL BUTTON LABEL SYSTEM
   ─────────────────────────────────────────────────────
   Lessons define btn arrays using semantic KEYS.
   This system maps keys → display labels per language.

   Semantic keys (use in lesson btn arrays):
     'continue'  → forward navigation
     'choose'    → selection step
     'begin'     → first screen
     'finish'    → final screen
     'drawing'   → during active drawing
     'placing'   → during placement step
     ''          → hidden (no button)

   Lessons can also pass a raw string to override.
═══════════════════════════════════════════════════════ */
const LESSON_BTN_LABELS = {
  en: {
    begin:    'Begin →',
    continue: 'Continue →',
    choose:   'Choose →',
    finish:   'Finish',
    drawing:  'I\'m drawing →',
    placing:  'I\'m placing →',
    '':       ''
  },
  he: {
    begin:    '← התחל',
    continue: '← המשך',
    choose:   '← בחר',
    finish:   '← סיום',
    drawing:  '← המשך',
    placing:  '← המשך',
    '':       ''
  }
};

/**
 * resolveBtn(key, lang)
 * Returns the display label for a semantic button key.
 * If key is not a semantic key, returns it as-is (raw override).
 */
function resolveBtn(key, lang) {
  if (key === '' || key === null || key === undefined) return '';
  const map = LESSON_BTN_LABELS[lang] || LESSON_BTN_LABELS.en;
  return map[key] !== undefined ? map[key] : key;
}


/* ═══════════════════════════════════════════════════════
   2. PAGINATION DOTS SYSTEM
   ─────────────────────────────────────────────────────
   RTL-aware. Automatically reads body.rtl class.
   Call buildDots(total, onClickFn) after setLang().
   Call refreshDots(cur, total) on every navigation.
═══════════════════════════════════════════════════════ */

/**
 * LS_buildDots(total, onClickFn)
 * Creates dot elements inside #progress.
 * Must be called AFTER language/RTL class is set.
 */
function LS_buildDots(total, onClickFn) {
  const wrap = document.getElementById('progress');
  if (!wrap) return;
  wrap.innerHTML = '';
  const isRTL = document.body.classList.contains('rtl');

  for (let i = 0; i < total; i++) {
    const d = document.createElement('div');
    d.className = 'pdot' + (i === 0 ? ' now' : '');
    d.onclick = () => onClickFn(i);
    wrap.appendChild(d);
  }

  // RTL: reverse flex so dot 0 is on the right
  wrap.style.flexDirection = isRTL ? 'row-reverse' : 'row';
}

/**
 * LS_refreshDots(cur)
 * Updates the active dot.
 */
function LS_refreshDots(cur) {
  document.querySelectorAll('.pdot').forEach((d, i) => {
    d.classList.toggle('now', i === cur);
  });
}


/* ═══════════════════════════════════════════════════════
   3. INSTRUCTION BLOCK RENDERER
   ─────────────────────────────────────────────────────
   Renders a list of instruction lines into an .instr-box
   element. Automatically applies RTL text alignment.

   Usage in lesson HTML:
     <div class="instr-box" id="s6-instr"></div>

   Usage in JS:
     renderInstrBlock('s6-instr', T[lang].s[6].i);
═══════════════════════════════════════════════════════ */

/**
 * renderInstrBlock(containerId, lines)
 * lines: array of strings
 */
function renderInstrBlock(containerId, lines) {
  const el = document.getElementById(containerId);
  if (!el || !lines || !lines.length) return;
  const isRTL = document.body.classList.contains('rtl');
  el.innerHTML = '<ul>' + lines.map(l =>
    `<li style="text-align:${isRTL ? 'right' : 'left'}">${l}</li>`
  ).join('') + '</ul>';
}


/* ═══════════════════════════════════════════════════════
   4. ACTION CUE SYSTEM
   ─────────────────────────────────────────────────────
   Small, soft cues added below instruction blocks.
   Standard cues are predefined in both languages.
   Lessons reference cue keys; display is automatic.

   Cue keys:
     'one-minute'   → "Work for one minute" / "עבדו דקה"
     'fill-30'      → "Fill ~30% of the page" / "מלאו כ-30%"
     'no-lift'      → "Don't lift your hand" / "אל תרימו את היד"
     'keep-going'   → "Keep going" / "המשיכו"
     'no-judge'     → "Don't judge" / "אל תשפטו"
═══════════════════════════════════════════════════════ */
const ACTION_CUES = {
  en: {
    'one-minute': 'Work for one minute.',
    'fill-30':    'Fill about 30% of the page.',
    'no-lift':    'Don\'t lift your hand.',
    'keep-going': 'Keep going.',
    'no-judge':   'Don\'t judge — just look.'
  },
  he: {
    'one-minute': 'עבדו במשך דקה.',
    'fill-30':    'מלאו כ-30% מהדף.',
    'no-lift':    'אל תרימו את היד.',
    'keep-going': 'המשיכו.',
    'no-judge':   'אל תשפטו — פשוט תסתכלו.'
  }
};

/**
 * renderActionCues(containerId, cueKeys, lang)
 * Appends cue lines below an instruction block.
 * cueKeys: array of cue key strings
 */
function renderActionCues(containerId, cueKeys, lang) {
  const el = document.getElementById(containerId);
  if (!el || !cueKeys || !cueKeys.length) return;
  const map = ACTION_CUES[lang] || ACTION_CUES.en;
  const isRTL = lang === 'he';
  const div = document.createElement('div');
  div.className = 'action-cues';
  div.style.textAlign = isRTL ? 'right' : 'left';
  div.innerHTML = cueKeys
    .map(k => map[k] ? `<span class="action-cue">${map[k]}</span>` : '')
    .join('');
  // Remove existing cues before re-rendering
  const existing = el.querySelector('.action-cues');
  if (existing) existing.remove();
  el.appendChild(div);
}


/* ═══════════════════════════════════════════════════════
   5. LANGUAGE APPLICATION HELPER
   ─────────────────────────────────────────────────────
   applyLessonStrings(T, he, screenConfigs)
   Call this from each lesson's applyStrings().
   screenConfigs: optional per-screen extra rendering.
═══════════════════════════════════════════════════════ */

/**
 * updateLessonBtn(btn, btnArray, cur, goldFrom, he)
 * Updates the next button using semantic key resolution.
 */
function updateLessonBtn(btnEl, btnArray, cur, goldFrom, he) {
  if (!btnEl || !btnArray) return;
  const lang = he ? 'he' : 'en';
  const raw = btnArray[cur];
  if (raw === '' || raw === null || raw === undefined) {
    btnEl.style.display = 'none';
    return;
  }
  btnEl.style.display = '';
  btnEl.textContent = resolveBtn(raw, lang);
  if (goldFrom !== undefined) {
    btnEl.classList.toggle('gold-btn', cur >= goldFrom);
  }
}


/* ═══════════════════════════════════════════════════════
   6. STANDARD LESSON SCREEN TYPES
   ─────────────────────────────────────────────────────
   Pre-defined bilingual text for shared screen patterns.
   Lessons reference these by type key in their T object.
═══════════════════════════════════════════════════════ */
const SCREEN_TEMPLATES = {
  /* Lines selection screen instruction */
  lines_instruction: {
    en: 'Draw lines across the page for one minute. Don\'t stop. Let your hand lead.<br><small>Change direction, speed, and pressure as you move.</small>',
    he: 'ציירו קווים על הדף במשך דקה. אל תעצרו. תנו ליד להוביל.<br><small>שנו כיוון, קצב ולחץ תוך כדי תנועה.</small>'
  },
  /* Color layer screen instructions */
  color_guidance: {
    en: [
      'Let the color move along the lines — not fill them.',
      'Work in layers — build the color gradually.',
      'There is no right or wrong — only movement.'
    ],
    he: [
      'תנו לצבע לנוע על הקווים — לא למלא אותם.',
      'הוסיפו בהדרגה. שכבה על שכבה.',
      'אין נכון או לא נכון — רק תנועה.'
    ]
  }
};

/**
 * getScreenTemplate(key, lang)
 * Returns the template text for a given screen pattern.
 */
function getScreenTemplate(key, lang) {
  const tmpl = SCREEN_TEMPLATES[key];
  if (!tmpl) return null;
  return tmpl[lang] || tmpl.en;
}


/* ═══════════════════════════════════════════════════════
   8. FINISH LESSON NAVIGATION
   ─────────────────────────────────────────────────────
   finishLesson()
   Reads data-lesson-type from <html> element:
     "regular"  → navigate to ../course.html (unit lesson list)
     "summary"  → navigate to ../../index.html (main units list)
   Falls back to ../course.html if attribute is missing.
═══════════════════════════════════════════════════════ */

/**
 * finishLesson()
 * Call this when the student clicks the Finish / סיום button
 * on the final screen. Navigates based on lesson type.
 */
function finishLesson() {
  const lessonType = document.documentElement.dataset.lessonType || 'regular';
  if (lessonType === 'summary') {
    window.location.href = '../../index.html';
  } else {
    window.location.href = '../course.html';
  }
}


/* ═══════════════════════════════════════════════════════
   7. AUTO-INJECT SHARED CSS
   ─────────────────────────────────────────────────────
   Injects minimal CSS for action-cue component so
   every lesson gets it automatically.
═══════════════════════════════════════════════════════ */
(function injectLessonSystemCSS() {
  if (document.getElementById('lesson-system-css')) return;
  const style = document.createElement('style');
  style.id = 'lesson-system-css';
  style.textContent = `
    /* Action cues — subtle time/action anchors */
    .action-cues {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }
    .action-cue {
      font-size: .72rem;
      color: rgba(245,243,239,.45);
      background: rgba(255,255,255,.04);
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 20px;
      padding: 4px 12px;
      letter-spacing: .03em;
    }
    /* RTL: flip action cues row */
    body.rtl .action-cues { flex-direction: row-reverse; }
  `;
  document.head.appendChild(style);
})();
