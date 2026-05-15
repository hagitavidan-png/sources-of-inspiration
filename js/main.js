/* ================================================================
   7 DIAMONDS – MAIN JS  v3.0
   Language toggle | Hamburger | Scroll effects | Fade-in
   Lesson: Timer | Checklist | Advanced Lightbox | Progress bar | Reflection
   + Dynamic unit/lesson builder from data/unit-X.js files
   ================================================================ */

/* ── UNITS REGISTRY ──────────────────────────────────────────────
   כדי להוסיף יחידה חדשה:
   1. צור data/unit-7.js עם הגדרת UNIT_7
   2. הוסף <script src="data/unit-7.js"> ב-index.html
   3. הוסף UNIT_7 לרשימה כאן
──────────────────────────────────────────────────────────────── */
const ALL_UNITS = [
  typeof UNIT_0 !== 'undefined' ? UNIT_0 : null,
  typeof UNIT_1 !== 'undefined' ? UNIT_1 : null,
  typeof UNIT_2 !== 'undefined' ? UNIT_2 : null,
  typeof UNIT_3 !== 'undefined' ? UNIT_3 : null,
  typeof UNIT_4 !== 'undefined' ? UNIT_4 : null,
  typeof UNIT_5 !== 'undefined' ? UNIT_5 : null,
  typeof UNIT_6 !== 'undefined' ? UNIT_6 : null,
  /* הוסף כאן: typeof UNIT_7 !== 'undefined' ? UNIT_7 : null, */
].filter(Boolean);

/* ── BUILD LESSONS SECTION ───────────────────────────────────── */
function buildLessonsSection() {
  const container = document.getElementById('units-container');
  if (!container || ALL_UNITS.length === 0) return;

  // ─ חשב סטטיסטיקות ─
  const totalLessons = ALL_UNITS.reduce((sum, u) => sum + u.lessons.length, 0);
  const totalUnits   = ALL_UNITS.filter(u => u.style === 'unit-card').length;

  // ─ עדכן stat-bar ─
  const elL = document.getElementById('stat-lessons');
  const elU = document.getElementById('stat-units');
  const elE = document.getElementById('stat-exercises');
  if (elL) elL.textContent = totalLessons;
  if (elU) elU.textContent = totalUnits;
  if (elE) elE.textContent = totalLessons + '+';

  // ─ עדכן כותרת ─
  const heading = document.getElementById('lessons-heading');
  if (heading) {
    heading.dataset.he = `${totalLessons} שיעורים | ${totalUnits} יחידות`;
    heading.dataset.en = `${totalLessons} Lessons | ${totalUnits} Units`;
    heading.textContent = heading.dataset.he;
  }

  let html = '';

  ALL_UNITS.forEach(unit => {
    if (unit.style === 'unit-intro') {
      // ── רצועת פתיחה ──
      html += `
      <div class="unit-intro fade-in">
        <div class="unit-intro-icon"><i class="${unit.icon}"></i></div>
        <div class="unit-intro-content">
          <div class="unit-num" data-he="${unit.num}" data-en="${unit.numEn}">${unit.num}</div>
          <h3 data-he="${unit.titleHe}" data-en="${unit.titleEn}">${unit.titleHe}</h3>
          <p data-he="${unit.subtitleHe}" data-en="${unit.subtitleEn}">${unit.subtitleHe}</p>
          <div class="unit-intro-lessons">
            ${unit.lessons.map(l => `
              <a href="${l.file}" class="lesson-pill">
                <span class="lesson-pill-num">${l.num}</span>
                <span data-he="${l.titleHe}" data-en="${l.titleEn}">${l.titleHe}</span>
              </a>`).join('')}
          </div>
        </div>
      </div>`;
    }
  });

  // ── כרטיסי יחידות ──
  const cardUnits = ALL_UNITS.filter(u => u.style === 'unit-card');
  if (cardUnits.length > 0) {
    html += '<div class="units-grid">';
    cardUnits.forEach(unit => {
      html += `
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
          <div class="unit-lessons-list">
            ${unit.lessons.map(l => `
              <a href="${l.file}" class="unit-lesson-item">
                <div class="lesson-num-badge" style="background:${unit.color}">${l.num}</div>
                <div class="lesson-item-text">
                  <div class="lesson-item-title" data-he="${l.titleHe}" data-en="${l.titleEn}">${l.titleHe}</div>
                  <div class="lesson-item-meta" data-he="${l.metaHe}" data-en="${l.metaEn}">${l.metaHe}</div>
                </div>
                <span class="lesson-start-btn" style="background:${unit.color}" data-he="התחל שיעור" data-en="Start Lesson">התחל שיעור</span>
              </a>`).join('')}
          </div>
        </div>
      </div>`;
    });
    html += '</div><!-- /units-grid -->';
  }

  container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {

  /* ── BUILD UNITS/LESSONS ── */
  buildLessonsSection();

  /* ── LANGUAGE TOGGLE ── */
  const langBtn = document.getElementById('lang-toggle');
  let currentLang = localStorage.getItem('7d-lang') || 'he';
  applyLang(currentLang);

  // חשוף גלובלית כדי ש-lesson-builder.js יוכל לקרוא לה
  window.applyCurrentLang = () => applyLang(currentLang);

  if (langBtn) {
    langBtn.addEventListener('click', () => {
      currentLang = currentLang === 'he' ? 'en' : 'he';
      localStorage.setItem('7d-lang', currentLang);
      applyLang(currentLang);
    });
  }

  function applyLang(lang) {
    document.documentElement.lang = lang;
    document.body.classList.toggle('lang-he', lang === 'he');
    document.body.classList.toggle('lang-en', lang === 'en');
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    if (langBtn) langBtn.textContent = lang === 'he' ? 'EN' : 'עב';

    document.querySelectorAll('[data-he][data-en]').forEach(el => {
      el.textContent = el.dataset[lang] || el.textContent;
    });
  }

  /* ── HAMBURGER MENU ── */
  const hamburger = document.getElementById('hamburger');
  const mainNav   = document.getElementById('main-nav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mainNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', hamburger.classList.contains('open'));
    });

    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mainNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── HEADER SCROLL SHADOW ── */
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ── ACTIVE NAV ON SCROLL (home page) ── */
  const navLinks = document.querySelectorAll('#main-nav .nav-link[href^="#"]');
  if (navLinks.length > 0) {
    const sections = [...navLinks].map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY + 90;
      sections.forEach((sec, i) => {
        if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
          navLinks.forEach(l => l.classList.remove('active'));
          navLinks[i].classList.add('active');
        }
      });
    }, { passive: true });
  }

  /* ── FADE-IN OBSERVER (staggered) ── */
  const fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => obs.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ================================================================
     LESSON PAGE FEATURES
     ================================================================ */

  /* ── READING PROGRESS BAR ── */
  const progressFill = document.querySelector('.lesson-progress-fill');
  if (progressFill) {
    window.addEventListener('scroll', () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct  = docH > 0 ? (window.scrollY / docH) * 100 : 0;
      progressFill.style.width = pct + '%';

      // show complete banner when >90% read
      if (pct > 90) {
        const banner = document.querySelector('.lesson-complete-banner');
        if (banner) banner.classList.add('show');
      }
    }, { passive: true });
  }

  /* ── INTERACTIVE TIMER ── */
  const timerClock = document.querySelector('.timer-clock');
  if (timerClock) {
    let totalSeconds = parseInt(timerClock.dataset.seconds || '600', 10);
    let remaining    = totalSeconds;
    let interval     = null;
    let running      = false;

    const startBtn   = document.querySelector('.timer-start');
    const resetBtn   = document.querySelector('.timer-reset');
    const progFill   = document.querySelector('.timer-progress-fill');

    function updateDisplay() {
      const m = Math.floor(remaining / 60).toString().padStart(2, '0');
      const s = (remaining % 60).toString().padStart(2, '0');
      timerClock.textContent = `${m}:${s}`;
      if (progFill) {
        const pct = ((totalSeconds - remaining) / totalSeconds) * 100;
        progFill.style.width = pct + '%';
      }
    }

    function tick() {
      if (remaining > 0) {
        remaining--;
        updateDisplay();
      } else {
        clearInterval(interval);
        running = false;
        if (startBtn) startBtn.textContent = currentLang === 'he' ? 'הסתיים! ✓' : 'Done! ✓';
        timerClock.style.color = '#7ec87e';
        // pulse effect on finish
        timerClock.style.animation = 'pulseGold 1s 3';
      }
    }

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (!running) {
          running = true;
          interval = setInterval(tick, 1000);
          startBtn.textContent = currentLang === 'he' ? 'עצור' : 'Pause';
        } else {
          running = false;
          clearInterval(interval);
          startBtn.textContent = currentLang === 'he' ? 'המשך' : 'Resume';
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        clearInterval(interval);
        running = false;
        remaining = totalSeconds;
        updateDisplay();
        timerClock.style.color = '';
        timerClock.style.animation = '';
        if (startBtn) startBtn.textContent = currentLang === 'he' ? 'התחל שיעור' : 'Start Lesson';
      });
    }

    updateDisplay();
  }

  /* ── CHECKLIST (interactive exercise steps) ── */
  document.querySelectorAll('.checklist-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('done');
      const check = item.querySelector('.checklist-checkbox');
      if (check) {
        check.innerHTML = item.classList.contains('done')
          ? '<i class="fa-solid fa-check" style="font-size:.7rem;color:#2c2c2c"></i>'
          : '';
      }
    });
  });

  /* ================================================================
     ADVANCED LIGHTBOX with prev/next navigation
     ================================================================ */

  // Expose initLightbox globally so dynamic lesson builder can call it
  window.initLightbox = function() {
    const allGalleryItems = [...document.querySelectorAll('.gallery-item')];

    let lightbox = document.getElementById('lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.className = 'lightbox-overlay';
      lightbox.id = 'lightbox';
      document.body.appendChild(lightbox);
    }

    if (!lightbox || allGalleryItems.length === 0) return;

    // Inject rich lightbox HTML
    lightbox.innerHTML = `
      <button class="lightbox-close" id="lightbox-close" aria-label="סגור">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <button class="lightbox-arrow lightbox-prev hidden" id="lightbox-prev" aria-label="קודם">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
      <div class="lightbox-inner">
        <img class="lightbox-img" id="lightbox-img" src="" alt="" />
        <p class="lightbox-caption" id="lightbox-caption"></p>
      </div>
      <button class="lightbox-arrow lightbox-next hidden" id="lightbox-next" aria-label="הבא">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <div class="lightbox-counter" id="lightbox-counter"></div>
    `;

    const lbImg     = document.getElementById('lightbox-img');
    const lbCaption = document.getElementById('lightbox-caption');
    const lbClose   = document.getElementById('lightbox-close');
    const lbPrev    = document.getElementById('lightbox-prev');
    const lbNext    = document.getElementById('lightbox-next');
    const lbCounter = document.getElementById('lightbox-counter');

    let currentIndex = 0;

    function openLightbox(index) {
      currentIndex = index;
      showImage(currentIndex);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function showImage(index) {
      const item = allGalleryItems[index];
      const img  = item.querySelector('img');
      const cap  = item.querySelector('.gallery-caption');

      if (img && lbImg) {
        lbImg.style.opacity = '0';
        setTimeout(() => {
          let src = img.src;
          if (src.includes('unsplash.com')) src = src.replace(/w=\d+/, 'w=1400');
          if (src.includes('wikipedia.org')) src = src.replace(/\/\d+px-/, '/1280px-');
          lbImg.src = src;
          lbImg.alt = img.alt;
          lbImg.style.opacity = '1';
        }, 150);
      }
      if (cap && lbCaption) lbCaption.textContent = cap.textContent;
      if (lbCounter) lbCounter.textContent = `${index + 1} / ${allGalleryItems.length}`;
      if (lbPrev) lbPrev.classList.toggle('hidden', index === 0);
      if (lbNext) lbNext.classList.toggle('hidden', index === allGalleryItems.length - 1);
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    allGalleryItems.forEach((item, i) => {
      // remove old listener before re-attaching (clone trick)
      const clone = item.cloneNode(true);
      item.parentNode.replaceChild(clone, item);
      allGalleryItems[i] = clone;

      clone.addEventListener('click', () => openLightbox(i));
      clone.setAttribute('role', 'button');
      clone.setAttribute('tabindex', '0');
      clone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
      });
    });

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev)  lbPrev.addEventListener('click', () => { if (currentIndex > 0) showImage(--currentIndex); });
    if (lbNext)  lbNext.addEventListener('click', () => { if (currentIndex < allGalleryItems.length - 1) showImage(++currentIndex); });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight' && currentIndex > 0)                          showImage(--currentIndex);
      if (e.key === 'ArrowLeft'  && currentIndex < allGalleryItems.length - 1) showImage(++currentIndex);
    });
  };

  // Also init checklist for dynamically built pages
  window.initChecklist = function() {
    document.querySelectorAll('.checklist-item').forEach(item => {
      const clone = item.cloneNode(true);
      item.parentNode.replaceChild(clone, item);
      clone.addEventListener('click', () => {
        clone.classList.toggle('done');
        const check = clone.querySelector('.checklist-checkbox');
        if (check) {
          check.innerHTML = clone.classList.contains('done')
            ? '<i class="fa-solid fa-check" style="font-size:.7rem;color:#2c2c2c"></i>'
            : '';
        }
      });
    });
  };

  // Run lightbox on static pages (non-dynamic)
  if (document.querySelectorAll('.gallery-item').length > 0) {
    window.initLightbox();
  }

  /* ── REFLECTION SAVE (localStorage) ── */
  const reflTextarea = document.querySelector('.reflection-textarea');
  const reflSaveBtn  = document.querySelector('.reflection-save');
  const reflSavedMsg = document.querySelector('.reflection-saved');

  if (reflTextarea) {
    const lessonKey = 'reflection-' + (window.location.pathname.split('/').pop() || 'home');
    const saved = localStorage.getItem(lessonKey);
    if (saved) reflTextarea.value = saved;

    if (reflSaveBtn) {
      reflSaveBtn.addEventListener('click', () => {
        localStorage.setItem(lessonKey, reflTextarea.value);
        if (reflSavedMsg) {
          reflSavedMsg.classList.add('show');
          setTimeout(() => reflSavedMsg.classList.remove('show'), 2500);
        }
      });
    }
  }

  /* ── LESSON COMPLETE MARK (localStorage) ── */
  const completeBtn = document.querySelector('.mark-complete-btn');
  if (completeBtn) {
    const lessonId = window.location.pathname.split('/').pop().replace('.html', '');
    const done = localStorage.getItem('done-' + lessonId);
    if (done) {
      completeBtn.textContent = '✓ הושלם';
      completeBtn.style.background = '#4a9c6d';
    }

    completeBtn.addEventListener('click', () => {
      localStorage.setItem('done-' + lessonId, '1');
      completeBtn.textContent = '✓ הושלם';
      completeBtn.style.background = '#4a9c6d';
    });
  }

  /* ── SMOOTH SCROLL for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
