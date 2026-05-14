/* ================================================================
   7 DIAMONDS – LESSON PAGE DYNAMIC BUILDER  v2.0
   ================================================================
   מנגנון הטעינה:
   כל lesson-XX.html טוען:
     1. <script src="../data/lesson-XX.js">  ← מגדיר LESSON_XX
     2. <script src="../js/main.js">          ← פונקציות כלליות
     3. <script src="../js/lesson-builder.js"> ← בונה את הדף

   כדי ליצור שיעור חדש:
     1. צור data/lesson-15.js עם הגדרת LESSON_15
     2. צור lessons/lesson-15.html (העתק lesson-01.html ושנה מספרים)
     3. עדכן data/unit-X.js – הוסף רשומה ל-lessons[]
================================================================ */

(function() {
  'use strict';

  /* ── מצא את נתוני השיעור ─────────────────────────────── */
  function getLessonData() {
    // שיטה 1: חפש משתנה LESSON_XX גלובלי
    const keys = Object.keys(window).filter(k => /^LESSON_\d+$/.test(k));
    if (keys.length > 0) return window[keys[0]];

    // שיטה 2: ?lesson=01 ב-URL (עבור lesson-template.html)
    const num = new URLSearchParams(location.search).get('lesson');
    if (num) return window['LESSON_' + String(num).padStart(2, '0')] || null;

    return null;
  }

  /* ── בנה את הדף ──────────────────────────────────────── */
  function buildPage(d) {
    const content = document.getElementById('lesson-content');
    if (!content) return;

    if (!d) {
      content.innerHTML = '<p style="text-align:center;padding:60px 20px;color:#c75b7a;font-size:1.1rem;">שגיאה: נתוני שיעור לא נמצאו.</p>';
      return;
    }

    const lang = localStorage.getItem('7d-lang') || 'he';
    const L = (he, en) => lang === 'en' ? (en || he || '') : (he || '');
    const safeAttr = (s) => (s || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

    /* ── כותרת הדף ── */
    document.title = `שיעור ${d.num} – ${d.titleHe || ''} | 7 Diamonds`;

    /* ── צבע יחידה ── */
    document.documentElement.style.setProperty('--unit-color', d.unitColor || '#c9a84c');

    /* ── HERO ── */
    const heroBg = document.getElementById('lesson-hero-bg');
    if (heroBg && d.heroImage) heroBg.style.backgroundImage = `url('${d.heroImage}')`;

    const unitBadge = document.getElementById('lesson-unit-badge');
    if (unitBadge) {
      unitBadge.dataset.he = d.unit || '';
      unitBadge.dataset.en = d.unitEn || '';
      unitBadge.textContent = L(d.unit, d.unitEn);
    }

    const titleEl = document.getElementById('lesson-title');
    if (titleEl) {
      titleEl.dataset.he = d.titleHe || '';
      titleEl.dataset.en = d.titleEn || '';
      titleEl.textContent = L(d.titleHe, d.titleEn);
    }

    const metaEl = document.getElementById('lesson-hero-meta');
    if (metaEl) {
      metaEl.innerHTML = `
        <span><i class="${d.metaIcon1 || 'fa-solid fa-book-open'}"></i>
          <span data-he="${safeAttr(d.meta1He)}" data-en="${safeAttr(d.meta1En)}">${L(d.meta1He, d.meta1En)}</span></span>
        <span><i class="${d.metaIcon2 || 'fa-solid fa-clock'}"></i>
          <span data-he="${safeAttr(d.meta2He)}" data-en="${safeAttr(d.meta2En)}">${L(d.meta2He, d.meta2En)}</span></span>
        <span><i class="${d.metaIcon3 || 'fa-solid fa-pen-nib'}"></i>
          <span data-he="${safeAttr(d.meta3He)}" data-en="${safeAttr(d.meta3En)}">${L(d.meta3He, d.meta3En)}</span></span>`;
    }

    /* ── MAIN CONTENT HTML ── */
    let html = '';

    /* בנר סיום */
    html += `<div class="lesson-complete-banner">
      <i class="fa-solid fa-circle-check"></i>
      <p><strong>כל הכבוד!</strong> ${d.isLastLesson ? 'קראת את השיעור עד הסוף — את סיימת את הקורס!' : 'קראת את השיעור עד הסוף.'}</p>
    </div>`;

    /* פסקת פתיחה */
    if (d.introTitle || d.introText) {
      const iTitle = d.introTitle || {};
      const iText  = d.introText  || {};
      html += `
        <h2 class="lesson-section-title fade-in">
          <span class="lesson-section-icon"><i class="fa-solid fa-lightbulb"></i></span>
          <span data-he="${safeAttr(iTitle.he)}" data-en="${safeAttr(iTitle.en)}">${L(iTitle.he, iTitle.en)}</span>
        </h2>
        <div class="lesson-inspiration-block fade-in">
          <p data-he="${safeAttr(iText.he)}" data-en="${safeAttr(iText.en)}">${L(iText.he, iText.en)}</p>
        </div>`;
    }

    /* גלריית אמנים */
    if (d.artists && d.artists.length > 0) {
      const st = d.artistsSectionTitle || {};
      html += `
        <h2 class="lesson-section-title fade-in">
          <span class="lesson-section-icon"><i class="fa-solid fa-images"></i></span>
          <span data-he="${safeAttr(st.he)}" data-en="${safeAttr(st.en)}">${L(st.he, st.en)}</span>
        </h2>
        <div class="artist-cards-grid fade-in">`;

      d.artists.forEach(a => {
        html += `
          <div class="artist-card-full">
            <div class="artist-card-inner">
              <div class="artist-card-header">
                <div class="artist-avatar">${a.avatar || '🎨'}</div>
                <div>
                  <div class="artist-name" data-he="${safeAttr(a.nameHe)}" data-en="${safeAttr(a.nameEn)}">${L(a.nameHe, a.nameEn)}</div>
                  <div class="artist-style" data-he="${safeAttr(a.styleHe)}" data-en="${safeAttr(a.styleEn)}">${L(a.styleHe, a.styleEn)}</div>
                </div>
              </div>
              <p class="artist-bio" data-he="${safeAttr(a.bioHe)}" data-en="${safeAttr(a.bioEn)}">${L(a.bioHe, a.bioEn)}</p>
            </div>
            <div class="artist-gallery">
              ${(a.images || []).map(img => `
                <div class="gallery-item">
                  <img src="${img.url}" alt="${safeAttr(L(img.altHe, img.altEn))}" loading="lazy" />
                  <div class="gallery-caption" data-he="${safeAttr(img.captionHe)}" data-en="${safeAttr(img.captionEn)}">${L(img.captionHe, img.captionEn)}</div>
                </div>`).join('')}
            </div>
          </div>`;
      });
      html += `</div>`;
    }

    /* טכניקות */
    if (d.techniques && d.techniques.length > 0) {
      const st = d.techniquesSectionTitle || {};
      html += `
        <h2 class="lesson-section-title fade-in">
          <span class="lesson-section-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></span>
          <span data-he="${safeAttr(st.he)}" data-en="${safeAttr(st.en)}">${L(st.he, st.en)}</span>
        </h2>
        <div class="techniques-grid fade-in">
          ${d.techniques.map(tech => `
            <div class="technique-card">
              <div class="technique-icon">${tech.icon || '✨'}</div>
              <div class="technique-title" data-he="${safeAttr(tech.titleHe)}" data-en="${safeAttr(tech.titleEn)}">${L(tech.titleHe, tech.titleEn)}</div>
              <div class="technique-desc" data-he="${safeAttr(tech.descHe)}" data-en="${safeAttr(tech.descEn)}">${L(tech.descHe, tech.descEn)}</div>
            </div>`).join('')}
        </div>`;
    }

    /* תרגיל */
    if (d.exerciseTitle) {
      const eTitle = d.exerciseTitle || {};
      const tLabel = d.exerciseTimerLabel || {};
      const secs = d.exerciseSeconds;

      html += `<div class="exercise-block fade-in">
        <div class="exercise-header">
          <div class="lesson-section-icon"><i class="fa-solid fa-pencil"></i></div>
          <div class="exercise-title" data-he="${safeAttr(eTitle.he)}" data-en="${safeAttr(eTitle.en)}">${L(eTitle.he, eTitle.en)}</div>
        </div>`;

      if (secs) {
        const mm = String(Math.floor(secs / 60)).padStart(2, '0');
        const ss = String(secs % 60).padStart(2, '0');
        html += `
        <div class="exercise-timer-wrap">
          <div class="exercise-timer-display">
            <div class="timer-badge"><i class="fa-solid fa-stopwatch"></i> ${L(tLabel.he, tLabel.en)}</div>
            <div class="timer-clock" data-seconds="${secs}">${mm}:${ss}</div>
          </div>
          <div class="timer-buttons">
            <button class="timer-btn timer-start" data-he="התחל שיעור" data-en="Start Lesson">התחל שיעור</button>
            <button class="timer-btn timer-reset" data-he="אפס" data-en="Reset">אפס</button>
          </div>
          <div class="timer-progress" style="margin-top:12px"><div class="timer-progress-fill"></div></div>
        </div>`;
      }

      if (d.exerciseChecklist && d.exerciseChecklist.length > 0) {
        html += `<div class="exercise-checklist">
          ${d.exerciseChecklist.map(item => `
            <div class="checklist-item">
              <div class="checklist-checkbox"></div>
              <div class="checklist-text" data-he="${safeAttr(item.he)}" data-en="${safeAttr(item.en)}">${L(item.he, item.en)}</div>
            </div>`).join('')}
        </div>`;
      }
      html += `</div>`;
    }

    /* בלוק חגיגת סיום */
    if (d.isLastLesson && d.completionTitle) {
      const ct = d.completionTitle || {};
      const cx = d.completionText  || {};
      html += `
        <div class="course-completion-block fade-in">
          <div class="completion-icon">🎉</div>
          <h2 data-he="${safeAttr(ct.he)}" data-en="${safeAttr(ct.en)}">${L(ct.he, ct.en)}</h2>
          <p>${L(cx.he, cx.en)}</p>
          <div class="completion-links">
            ${(d.completionLinks || []).map(link => `
              <a href="${link.href}" target="_blank" class="completion-link">
                <i class="${link.icon}"></i>
                <span data-he="${safeAttr(link.labelHe)}" data-en="${safeAttr(link.labelEn)}">${L(link.labelHe, link.labelEn)}</span>
              </a>`).join('')}
          </div>
        </div>`;
    }

    /* ציטוט */
    if (d.quote) {
      const q = d.quote;
      html += `
        <div class="lesson-quote fade-in">
          <p class="lesson-quote-text" data-he="${safeAttr(q.he)}" data-en="${safeAttr(q.en)}">${L(q.he, q.en)}</p>
          <p class="lesson-quote-author">${d.quoteAuthor || ''}</p>
        </div>`;
    }

    /* רפלקציה */
    if (d.reflectionQ) {
      const rq = d.reflectionQ || {};
      const rp = d.reflectionPlaceholder || {};
      html += `
        <div class="reflection-block fade-in">
          <h3><i class="fa-solid fa-feather-pointed"></i>
            <span data-he="${safeAttr(rq.he)}" data-en="${safeAttr(rq.en)}">${L(rq.he, rq.en)}</span>
          </h3>
          <textarea class="reflection-textarea" placeholder="${safeAttr(L(rp.he, rp.en))}"></textarea>
          <button class="reflection-save" data-he="שמור" data-en="Save">שמור</button>
          <p class="reflection-saved">✓ נשמר</p>
        </div>`;
    }

    /* ניווט */
    const prev = d.prevLesson;
    const next = d.nextLesson;
    html += `<div class="lesson-nav-footer fade-in">`;
    if (prev) {
      html += `<a href="${prev.file}" class="lesson-nav-btn"><i class="fa-solid fa-arrow-right"></i><span data-he="שיעור קודם" data-en="Previous">${L('שיעור קודם', 'Previous')}</span></a>`;
    }
    html += `<a href="../index.html#lessons" class="lesson-nav-btn"><i class="fa-solid fa-grid-2"></i><span data-he="כל השיעורים" data-en="All Lessons">${L('כל השיעורים', 'All Lessons')}</span></a>`;
    if (next) {
      html += `<a href="${next.file}" class="lesson-nav-btn primary"><span data-he="שיעור הבא: ${safeAttr(next.titleHe)}" data-en="Next: ${safeAttr(next.titleEn||next.titleHe)}">${L(`שיעור הבא: ${next.titleHe}`, `Next: ${next.titleEn || next.titleHe}`)}</span><i class="fa-solid fa-arrow-left"></i></a>`;
    } else if (d.isLastLesson) {
      html += `<a href="../index.html" class="lesson-nav-btn primary"><span data-he="חזרה לדף הבית" data-en="Back to Home">${L('חזרה לדף הבית', 'Back to Home')}</span><i class="fa-solid fa-house"></i></a>`;
    }
    html += `</div>`;

    /* ── הכנס לדף ── */
    content.innerHTML = html;

    /* ── Fade-in observer ── */
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
      }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
      content.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
    } else {
      content.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    }

    /* ── Lightbox ו-Checklist ── */
    if (typeof window.initLightbox  === 'function') window.initLightbox();
    if (typeof window.initChecklist === 'function') window.initChecklist();

    /* ── Timer (אתחול מחדש על אלמנטים דינמיים) ── */
    initTimer();

    /* ── Reflection (localStorage) ── */
    initReflection(d.id);

    /* ── עדכן שפה לאלמנטים החדשים ── */
    if (typeof window.applyCurrentLang === 'function') window.applyCurrentLang();
  }

  /* ── Timer ─────────────────────────────────────────────── */
  function initTimer() {
    const timerClock = document.querySelector('.timer-clock');
    if (!timerClock) return;

    let totalSeconds = parseInt(timerClock.dataset.seconds || '600', 10);
    let remaining    = totalSeconds;
    let interval     = null;
    let running      = false;

    const startBtn = document.querySelector('.timer-start');
    const resetBtn = document.querySelector('.timer-reset');
    const progFill = document.querySelector('.timer-progress-fill');

    function updateDisplay() {
      const m = String(Math.floor(remaining / 60)).padStart(2, '0');
      const s = String(remaining % 60).padStart(2, '0');
      timerClock.textContent = `${m}:${s}`;
      if (progFill) {
        const pct = ((totalSeconds - remaining) / totalSeconds) * 100;
        progFill.style.width = pct + '%';
        progFill.style.background = pct < 60 ? 'var(--gold)' : pct < 90 ? '#e07b39' : '#c75b7a';
      }
    }

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (running) {
          clearInterval(interval);
          running = false;
          startBtn.textContent = localStorage.getItem('7d-lang') === 'en' ? 'Continue' : 'המשך';
        } else {
          if (remaining <= 0) remaining = totalSeconds;
          interval = setInterval(() => {
            remaining--;
            updateDisplay();
            if (remaining <= 0) { clearInterval(interval); running = false; startBtn.textContent = '✓'; }
          }, 1000);
          running = true;
          startBtn.textContent = localStorage.getItem('7d-lang') === 'en' ? 'Pause' : 'הפסק';
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        clearInterval(interval);
        running = false;
        remaining = totalSeconds;
        updateDisplay();
        if (startBtn) startBtn.textContent = localStorage.getItem('7d-lang') === 'en' ? 'Start Lesson' : 'התחל שיעור';
      });
    }

    updateDisplay();
  }

  /* ── Reflection ─────────────────────────────────────────── */
  function initReflection(lessonId) {
    const textarea = document.querySelector('.reflection-textarea');
    const saveBtn  = document.querySelector('.reflection-save');
    const savedMsg = document.querySelector('.reflection-saved');
    if (!textarea) return;

    const key = '7d-reflection-' + (lessonId || location.pathname.split('/').pop().replace('.html', ''));
    const saved = localStorage.getItem(key);
    if (saved) textarea.value = saved;

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        localStorage.setItem(key, textarea.value);
        if (savedMsg) {
          savedMsg.style.display = 'block';
          setTimeout(() => savedMsg.style.display = 'none', 2500);
        }
      });
    }
  }

  /* ── הרץ ─────────────────────────────────────────────────── */
  function run() {
    const d = getLessonData();
    buildPage(d);
  }

  // ממתין ל-DOMContentLoaded אם צריך, אחרת רץ ישיר
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    // DOM מוכן – אבל main.js אולי עדיין לא סיים DOMContentLoaded שלו
    // נשתמש ב-setTimeout כדי לתת ל-main.js להסתיים ולחשוף initLightbox
    setTimeout(run, 0);
  }

})();
