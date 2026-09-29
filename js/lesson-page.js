/* ═══════════════════════════════════════════════════════════
   Lesson page template
   Renders window.LESSON_PAGE (data/lesson-pages/*.js) into the
   shared editorial lesson layout. Sections without content are skipped.
   Needs: js/app-init.js (language), js/navigation-data.js (prev / next).
   ═══════════════════════════════════════════════════════════ */
(function () {
  var D = window.LESSON_PAGE;
  var root = document.getElementById('lesson');
  if (!D || !root) return;

  var BASE = '../';
  /* lessons that already have a page in this template */
  var PAGES = { 'lessons/lesson-2-1.html': 'lesson-pages/lesson-2-1.html' };

  var SECTIONS = [
    ['explore', 'מה אנחנו חוקרים?', 'What are we exploring?'],
    ['sources', 'מקורות השראה ורקע על האמנים', 'Sources of inspiration and the artists'],
    ['look', 'מסתכלים', 'Looking'],
    ['idea', 'מהרעיון ליצירה', 'From idea to artwork'],
    ['create', 'יוצרים', 'Making'],
    ['end', 'סיום: התבוננות בעבודה', 'Closing: looking at the work']
  ];

  var L = document.documentElement.lang === 'he' ? 'he' : 'en';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  /* bilingual element; values may contain simple inline HTML (<br>, <em>) */
  function t(v, tag, cls) {
    if (!v) return '';
    tag = tag || 'span';
    return '<' + tag + (cls ? ' class="' + cls + '"' : '') + ' data-he="' + esc(v.he) + '" data-en="' + esc(v.en) + '">' + (v[L] || '') + '</' + tag + '>';
  }
  function tt(he, en, tag, cls) { return t({ he: he, en: en }, tag, cls); }

  function chips(list) {
    if (!list) return '';
    var out = '<div class="lp-chips">';
    for (var i = 0; i < list.he.length; i++) {
      out += '<button type="button" class="lp-chip" aria-pressed="false">' + t({ he: list.he[i], en: list.en[i] }) + '</button>';
    }
    return out + '</div>';
  }

  function block(b) {
    return '<div class="lp-block rv">' +
      t(b.label, 'p', 'lp-label') +
      t(b.big, 'h3', 'lp-big') +
      t(b.sub, 'p', 'lp-sub') +
      chips(b.chips) +
      t(b.note, 'p', 'ed-note lp-note') +
      t(b.work, 'p', 'lp-ref') +
      '</div>';
  }

  function work(w) {
    var img = w.img
      ? '<div class="lp-work-img"><img src="' + BASE + 'images/editorial/' + w.img + '.jpg" alt="' + esc(w.alt || '') + '" loading="lazy"></div>'
      : '';
    return '<figure class="lp-work rv' + (w.img ? '' : ' text-only') + '">' + img +
      '<figcaption>' + t(w.artist, 'b') + t(w.title, 'span', 'lp-work-title') + '</figcaption>' +
      t(w.note, 'p', 'lp-work-note') + '</figure>';
  }

  function section(key, he, en, body, n) {
    return '<section class="lp-sec" id="' + key + '" data-sec>' +
      '<header class="lp-sec-head rv"><span class="lp-sec-n">0' + n + '</span>' + tt(he, en, 'h2', 'ed-display') + '</header>' +
      body + '</section>';
  }

  /* ── head ── */
  var html = '';
  html += '<section class="lp-head ed-wrap">' +
    '<p class="crumb rv"><a href="' + BASE + 'units/unit-' + D.unitNum + '.html">' + t(D.unit) + '</a> <span>/</span> ' + tt('שיעור ' + D.number, 'Lesson ' + D.number) + '</p>' +
    '<div class="lp-title-row rv"><span class="ed-num lp-num">' + D.number + '</span>' +
    '<div>' + t(D.title, 'h1', 'ed-display lp-title') +
    '<p class="lp-meta">' + t(D.time) + (D.slides ? ' <span class="dot">·</span> <a class="ed-link" href="' + BASE + D.slides + '">' + tt('הצגה בכיתה, מסך אחרי מסך', 'Present in class, screen by screen') + '</a>' : '') + '</p>' +
    '</div></div>';
  if (D.hero) {
    html += '<figure class="lp-hero"><div class="lp-hero-img rv-img"><img src="' + BASE + 'images/editorial/' + D.hero.img + '.jpg" alt="" style="object-position:' + (D.hero.pos || '50% 50%') + '" fetchpriority="high"></div>' +
      t(D.hero.cap, 'figcaption') + '</figure>';
  }
  html += '</section>';

  /* ── body: rail + sections ── */
  var S = D.sections || {};
  var body = '', rail = '', n = 0;
  SECTIONS.forEach(function (s) {
    var key = s[0], d = S[key];
    if (key === 'create' && !d && !D.materials) return;
    if (key !== 'create' && !d) return;
    n++;
    var inner = '';
    if (key === 'explore') {
      inner += t(D.intro, 'p', 'lp-lead rv');
      (d.blocks || []).forEach(function (b) { inner += block(b); });
    } else if (key === 'sources') {
      inner += '<div class="lp-works">' + d.works.map(work).join('') + '</div>';
    } else if (key === 'create') {
      if (d && d.steps && d.steps.length) {
        inner += '<div class="lp-sub-sec">' + tt('מתחילים', 'Getting started', 'h3', 'lp-sub-title rv') +
          '<ol class="lp-steps">' + d.steps.map(function (b) { return '<li>' + block(b) + '</li>'; }).join('') + '</ol></div>';
      }
      if (D.materials) {
        inner += '<div class="lp-sub-sec lp-materials rv">' + tt('חומרים', 'Materials', 'h3', 'lp-sub-title') + t(D.materials, 'p') + '</div>';
      }
    } else {
      (d.blocks || []).forEach(function (b) { inner += block(b); });
    }
    body += section(key, s[1], s[2], inner, n);
    rail += '<li><a href="#' + key + '"><span>0' + n + '</span>' + tt(s[1], s[2]) + '</a></li>';
  });

  html += '<div class="lp-body ed-wrap"><nav class="lp-rail" aria-label="' + (L === 'he' ? 'חלקי השיעור' : 'Lesson sections') + '"><ol>' + rail + '</ol></nav><div class="lp-main">' + body + '</div></div>';

  /* ── prev / next lesson (course order from js/navigation-data.js) ── */
  var flat = [];
  ((window.ART_NAVIGATION || {}).units || []).forEach(function (u) { (u.lessons || []).forEach(function (l) { flat.push(l); }); });
  var i = -1;
  flat.forEach(function (l, k) { if (l.path === D.path) i = k; });
  function link(l, dir) {
    if (!l) return '<span></span>';
    var href = BASE + (PAGES[l.path] || l.path);
    var lab = dir === 'prev' ? { he: '→ השיעור הקודם', en: '← Previous lesson' } : { he: 'השיעור הבא ←', en: 'Next lesson →' };
    return '<a class="un un-' + dir + '" href="' + href + '">' + t(lab, 'span', 'un-lab') + t(l.title, 'span', 'un-t') + '</a>';
  }
  html += '<nav class="unit-nav lp-nav ed-wrap" aria-label="' + (L === 'he' ? 'ניווט בין שיעורים' : 'Lesson navigation') + '">' +
    link(flat[i - 1], 'prev') + link(flat[i + 1], 'next') + '</nav>';

  root.innerHTML = html;

  /* chips: simple toggle, nothing is stored */
  root.querySelectorAll('.lp-chip').forEach(function (c) {
    c.addEventListener('click', function () {
      var on = c.getAttribute('aria-pressed') !== 'true';
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  });

  /* rail: mark the section in view */
  if ('IntersectionObserver' in window) {
    var links = {};
    root.querySelectorAll('.lp-rail a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].classList.toggle('on', k === e.target.id); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    root.querySelectorAll('[data-sec]').forEach(function (s) { io.observe(s); });
  }
})();
