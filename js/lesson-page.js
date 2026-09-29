/* ═══════════════════════════════════════════════════════════
   Lesson page template
   Renders window.LESSON_PAGE (data/lesson-pages/*.js) into the
   shared editorial lesson layout. Sections without content are skipped.
   Needs: js/app-init.js (language), js/navigation-data.js (prev / next),
   data/lesson-pages/index.js (which lessons already have a page).
   ═══════════════════════════════════════════════════════════ */
(function () {
  var D = window.LESSON_PAGE;
  var root = document.getElementById('lesson');
  if (!D || !root) return;

  var BASE = '../';
  /* design pilot: lessons marked variant 'v2' get the stronger lesson layout (css: .lp-v2) */
  var V2 = D.variant === 'v2';
  var PAGES = window.LESSON_PAGES_INDEX || {};

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
    if (!v || (!v.he && !v.en)) return '';
    tag = tag || 'span';
    return '<' + tag + (cls ? ' class="' + cls + '"' : '') + ' data-he="' + esc(v.he) + '" data-en="' + esc(v.en) + '">' + (v[L] || '') + '</' + tag + '>';
  }
  function tt(he, en, tag, cls) { return t({ he: he, en: en }, tag, cls); }
  function items(list) {
    var out = [];
    if (!list) return out;
    for (var i = 0; i < list.he.length; i++) out.push({ he: list.he[i], en: (list.en || [])[i] });
    return out;
  }

  function chips(list) {
    var a = items(list);
    if (!a.length) return '';
    return '<div class="lp-chips">' + a.map(function (v) {
      return '<button type="button" class="lp-chip" aria-pressed="false">' + t(v) + '</button>';
    }).join('') + '</div>';
  }
  /* small sketches of ways two images can be connected (1.6) */
  var REL = {
    line: '<circle cx="7" cy="10" r="4"/><circle cx="37" cy="10" r="4"/><path d="M11 10h22"/>',
    shared: '<circle class="f" cx="7" cy="10" r="4"/><circle class="f" cx="37" cy="10" r="4"/>',
    near: '<circle cx="18" cy="10" r="4"/><circle cx="26.5" cy="10" r="4"/>',
    curve: '<circle cx="5" cy="14" r="3.5"/><circle cx="39" cy="6" r="3.5"/><path d="M8 13C18 22 24 -2 36 7"/>'
  };
  function steps(list, rel) {
    var a = items(list);
    if (!a.length) return '';
    if (!rel) return '<ol class="lp-list">' + a.map(function (v) { return t(v, 'li'); }).join('') + '</ol>';
    return '<ol class="lp-list lp-rel">' + a.map(function (v, k) {
      var icon = rel && REL[rel[k]] ? '<svg viewBox="0 0 44 20" aria-hidden="true">' + REL[rel[k]] + '</svg>' : '';
      return '<li>' + icon + t(v) + '</li>';
    }).join('') + '</ol>';
  }
  function lines(list) {
    var a = items(list);
    if (!a.length) return '';
    return '<ul class="lp-lines">' + a.map(function (v) { return t(v, 'li'); }).join('') + '</ul>';
  }
  function prompt(v) {
    if (!v) return '';
    return '<label class="lp-prompt"><span class="sr" data-he="מקום לכתיבה" data-en="Space to write">' + (L === 'he' ? 'מקום לכתיבה' : 'Space to write') + '</span>' +
      '<textarea rows="3" data-ph-he="' + esc(v.he) + '" data-ph-en="' + esc(v.en) + '" placeholder="' + esc(v[L]) + '"></textarea></label>';
  }

  /* pilot: artworks as a magazine sequence; images keep their full proportions (no crop) */
  function edWork(w, k) {
    /* a work without a usable image is shown by its title only, set as part of the page */
    /* a work shown by name with a link to its museum: an intentional "window", not a missing image */
    return '<figure class="lp-ed-work lp-ed-r' + (k % 3) + (w.img ? '' : ' no-img') + (w.noArtist ? ' in-artist' : '') + (w.link && !w.img ? ' lp-window' : '') + ' rv">' +
      (w.img ? '<div class="lp-ed-img"><img src="' + BASE + 'images/editorial/' + w.img + '.jpg" alt="' + esc(w.alt || '') + '" loading="lazy"></div>' : '') +
      '<figcaption>' + (w.noArtist ? '' : t(w.artist, 'b', 'lp-ed-artist')) + t(w.workTitle, 'span', 'lp-ed-title') +
      t(w.title, 'p', 'lp-ed-text') + t(w.note, 'p', 'lp-ed-text') +
      /* a link to the work at its museum, when the image cannot be shown here */
      (w.link ? '<a class="lp-ext" href="' + esc(w.link.href) + '" target="_blank" rel="noopener">' + t(w.link.label) + '</a>' : '') +
      '</figcaption></figure>';
  }
  function works(list) {
    return V2 ? '<div class="lp-ed-works">' + list.map(edWork).join('') + '</div>'
              : '<div class="lp-works">' + list.map(work).join('') + '</div>';
  }

  /* composition sketches: small rectangles with one shape placed in different ways (1.3) */
  function frames(list) {
    if (!list || !list.length) return '';
    var SH = {
      empty: '',
      center: '<circle cx="40" cy="28" r="9"/>',
      corner: '<circle cx="12" cy="12" r="7"/>',
      edge: '<circle cx="80" cy="28" r="9"/>',
      huge: '<circle cx="40" cy="28" r="24"/>',
      tiny: '<circle cx="40" cy="28" r="2.4"/>',
      pair: '<circle cx="33" cy="28" r="9"/><circle cx="51" cy="28" r="9"/>'
    };
    return '<div class="lp-frames" aria-hidden="true">' + list.map(function (f) {
      return '<svg viewBox="0 0 80 56"><rect x=".75" y=".75" width="78.5" height="54.5"/>' +
        '<g>' + (SH[f] || '') + '</g></svg>';
    }).join('') + '</div>';
  }

  function work(w) {
    var img = w.img
      ? '<div class="lp-work-img"><img src="' + BASE + 'images/editorial/' + w.img + '.jpg" alt="' + esc(w.alt || '') + '" loading="lazy"></div>'
      : '';
    return '<figure class="lp-work rv' + (w.img ? '' : ' text-only') + '">' + img +
      '<figcaption>' + t(w.artist, 'b') + t(w.title, 'span', 'lp-work-title') + '</figcaption>' +
      t(w.note, 'p', 'lp-work-note') + '</figure>';
  }

  /* the three experiment sheets laid side by side, each with one marked place (1.8) */
  function sheets(list) {
    var a = items(list);
    if (!a.length) return '';
    return '<div class="lp-sheets" aria-hidden="true">' + a.map(function (v, k) {
      return '<figure class="lp-sheet-pg lp-sheet-pg' + k + '"><span class="lp-sheet-n">0' + (k + 1) + '</span><i class="lp-mark"></i>' + t(v, 'figcaption') + '</figure>';
    }).join('') + '</div>';
  }
  /* the unit's work laid out in order, like a small exhibition (1.9) */
  function wall(list) {
    if (!list || !list.length) return '';
    return '<div class="lp-wall" aria-hidden="true">' + list.map(function (n, k) {
      return '<span class="lp-wall-pc lp-wall-' + k + (k === list.length - 1 ? ' is-last' : '') + '"><i dir="ltr">' + esc(n) + '</i></span>';
    }).join('') + '</div>';
  }
  /* lenses to look through: words set in a line, not buttons */
  function lenses(list, label) {
    var a = items(list);
    if (!a.length) return '';
    return '<p class="lp-lenses">' + t(label, 'span', 'lp-lenses-lab') + a.map(function (v) { return t(v, 'span', 'lp-lens'); }).join('') + '</p>';
  }
  function prompts(list) {
    if (!list || !list.length) return '';
    return '<div class="lp-diptych">' + list.map(prompt).join('') + '</div>';
  }

  function block(b) {
    var quote = b.quote ? '<blockquote class="lp-quote">' + t(b.quote, 'p') + t(b.attr, 'cite') + '</blockquote>' : '';
    return '<div class="lp-block rv' + (b.kind ? ' lp-kind-' + b.kind : '') + '">' +
      t(b.label, 'p', 'lp-label') +
      quote +
      t(b.big, 'h3', 'lp-big') +
      t(b.poem, 'p', 'lp-poem') +
      t(b.sub, 'p', 'lp-sub') +
      t(b.body, 'p', 'lp-sub') +
      wall(b.wall) +
      (b.works && b.works.length ? works(b.works) : '') +
      lines(b.lines) +
      lenses(b.lenses, b.lensLabel) +
      t(b.ask, 'p', 'lp-ask') +
      sheets(b.sheets) +
      prompts(b.prompts) +
      frames(b.frames) +
      steps(b.list, b.rel) +
      chips(b.chips) +
      prompt(b.prompt) +
      t(b.note, 'p', 'ed-note lp-note') +
      t(b.work, 'p', 'lp-ref') +
      '</div>';
  }

  function section(key, he, en, body, n) {
    if (V2) {
      /* pilot: a large, quiet station number marks each part of the lesson */
      var lay = D.layout && D.layout[key] ? ' lp-layout-' + D.layout[key] : '';
      return '<section class="lp-sec lp-station' + lay + '" id="' + key + '" data-sec>' +
        '<header class="lp-sec-head rv"><span class="lp-station-n" aria-hidden="true">0' + n + '</span>' + tt(he, en, 'h2', 'ed-display') + '</header>' +
        body + '</section>';
    }
    return '<section class="lp-sec" id="' + key + '" data-sec>' +
      '<header class="lp-sec-head rv"><span class="lp-sec-n">0' + n + '</span>' + tt(he, en, 'h2', 'ed-display') + '</header>' +
      body + '</section>';
  }

  /* ── where am I: unit, position in the unit (js/navigation-data.js) ── */
  var navUnit = null, posInUnit = 0, unitCount = 0;
  ((window.ART_NAVIGATION || {}).units || []).forEach(function (u) {
    (u.lessons || []).forEach(function (l, k) {
      if (l.path === D.path) { navUnit = u; posInUnit = k + 1; unitCount = u.lessons.length; }
    });
  });
  var unitN = parseInt(D.unitNum, 10);
  var unitTitle = navUnit ? navUnit.title : D.unit;

  /* ── head ── */
  var html = '';
  /* compact location for small screens; tapping it opens the contents drawer */
  if (posInUnit) {
    html += '<a class="lp-where" href="#ed-drawer" data-open-contents>' +
      tt('יחידה ' + unitN + ' · שיעור ' + posInUnit + ' מתוך ' + unitCount, 'Unit ' + unitN + ' · Lesson ' + posInUnit + ' of ' + unitCount) +
      '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4.5l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg></a>';
  }
  html += '<section class="lp-head ed-wrap">' +
    '<nav class="crumb rv" aria-label="' + (L === 'he' ? 'מיקום באתר' : 'Breadcrumb') + '">' +
    '<a href="' + BASE + 'home-preview.html">' + tt('מקורות השראה', 'Sources of Inspiration') + '</a> <span aria-hidden="true">/</span> ' +
    '<a href="' + BASE + 'units/unit-' + D.unitNum + '.html">' + t({ he: 'יחידה ' + unitN + ': ' + unitTitle.he, en: 'Unit ' + unitN + ': ' + unitTitle.en }) + '</a> <span aria-hidden="true">/</span> ' +
    '<span aria-current="page">' + tt('שיעור ' + D.number, 'Lesson ' + D.number) + '</span></nav>' +
    (V2
      /* pilot: the lesson opens like a small title page */
      ? '<div class="lp-gate rv">' +
        '<p class="lp-gate-kicker">' + tt('יחידה ' + D.unitNum + ' · שיעור ' + D.number, 'Unit ' + D.unitNum + ' · Lesson ' + D.number) + '</p>' +
        t(D.title, 'h1', 'ed-display lp-gate-title') +
        t(D.subtitle, 'p', 'lp-gate-sub') +
        t(unitTitle, 'p', 'lp-gate-unit') +
        '<p class="lp-meta">' + t(D.time) + (D.slides ? ' <span class="dot">·</span> <a class="ed-link" href="' + BASE + D.slides + '">' + tt('הצגה בכיתה, מסך אחרי מסך', 'Present in class, screen by screen') + '</a>' : '') + '</p>' +
        '</div>'
      : '<div class="lp-title-row rv"><span class="ed-num lp-num">' + D.number + '</span>' +
        '<div>' + t(D.title, 'h1', 'ed-display lp-title') +
        '<p class="lp-meta">' + t(D.time) + (D.slides ? ' <span class="dot">·</span> <a class="ed-link" href="' + BASE + D.slides + '">' + tt('הצגה בכיתה, מסך אחרי מסך', 'Present in class, screen by screen') + '</a>' : '') + '</p>' +
        '</div></div>');
  if (D.hero) {
    html += '<figure class="lp-hero"><div class="lp-hero-img rv-img"><img src="' + BASE + 'images/editorial/' + D.hero.img + '.jpg" alt="" style="object-position:' + (D.hero.pos || '50% 50%') + '" fetchpriority="high"></div>' +
      t(D.hero.cap, 'figcaption') + '</figure>';
  }
  html += '</section>';

  /* ── body: rail + sections ── */
  var S = D.sections || {};
  var body = '', rail = '', n = 0;
  SECTIONS.forEach(function (s) {
    var key = s[0], d = S[key] || {};
    var blocks = d.blocks || [];
    var createSteps = S.create && ((S.create.steps && S.create.steps.length) || (S.create.lead && S.create.lead.length));
    var hasMaterials = key === 'create' && D.materials && createSteps;
    if (key !== 'explore' && !blocks.length && !(d.works && d.works.length) && !(d.steps && d.steps.length) && !hasMaterials) return;
    n++;
    var inner = '';
    if (key === 'explore') {
      inner += t(D.intro, 'p', 'lp-lead rv');
      /* no making steps in this lesson: the materials go at the start */
      if (D.materials && !createSteps) inner += '<p class="lp-mat-line rv">' + tt('חומרים', 'Materials', 'b') + ' ' + t(D.materials) + '</p>';
    }
    if (d.works && d.works.length) inner += works(d.works);
    if (D.layout && D.layout[key] === 'desk' && D.desk) {
      /* earlier work laid out on the table: blank pages marked with their lesson number */
      inner += '<div class="lp-desk rv" aria-hidden="true">' + D.desk.map(function (n, k) {
        return '<span class="lp-desk-page lp-desk-' + k + '"><i dir="ltr">' + esc(n) + '</i></span>';
      }).join('') + '</div>';
    }
    blocks.forEach(function (b) { inner += block(b); });
    if (key === 'create' && D.layout && /^lab/.test(D.layout.create)) {
      /* lab: an opening, the materials, parallel experiment sheets, and the lesson's closing */
      (d.lead || []).forEach(function (b) { inner += block(b); });
      if (D.materials) inner += '<div class="lp-sub-sec lp-materials rv">' + tt('חומרים', 'Materials', 'h3', 'lp-sub-title') + t(D.materials, 'p') + '</div>';
      inner += '<ol class="lp-lab">' + (d.steps || []).map(function (b, k) { return '<li class="lp-sheet lp-sheet-' + k + '">' + block(b) + '</li>'; }).join('') + '</ol>';
      /* what happens after the experiments (compare, choose, develop) */
      if (d.after && d.after.length) inner += '<div class="lp-after">' + d.after.map(block).join('') + '</div>';
      (d.outro || []).forEach(function (b) { inner += '<div class="lp-closing">' + block(b) + '</div>'; });
    } else if (key === 'create') {
      if (d.steps && d.steps.length) {
        inner += '<div class="lp-sub-sec">' + tt('מתחילים', 'Getting started', 'h3', 'lp-sub-title rv') +
          '<ol class="lp-steps">' + d.steps.map(function (b) { return '<li>' + block(b) + '</li>'; }).join('') + '</ol></div>';
      }
      if (D.materials && createSteps) {
        inner += '<div class="lp-sub-sec lp-materials rv">' + tt('חומרים', 'Materials', 'h3', 'lp-sub-title') + t(D.materials, 'p') + '</div>';
      }
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
    var title = (window.LESSON_TITLES || {})[l.path] || l.title;
    return '<a class="un un-' + dir + '" href="' + href + '">' + t(lab, 'span', 'un-lab') + t(title, 'span', 'un-t') + '</a>';
  }
  html += '<nav class="unit-nav lp-nav ed-wrap" aria-label="' + (L === 'he' ? 'ניווט בין שיעורים' : 'Lesson navigation') + '">' +
    link(flat[i - 1], 'prev') + link(flat[i + 1], 'next') + '</nav>';

  root.innerHTML = html;
  if (V2) root.classList.add('lp-v2');

  /* chips: simple toggle, nothing is stored */
  root.querySelectorAll('.lp-chip').forEach(function (c) {
    c.addEventListener('click', function () {
      c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
    });
  });

  /* writing prompts: placeholder follows the language */
  if (typeof window.setLang === 'function') {
    var orig = window.setLang;
    window.setLang = function (l) {
      orig(l);
      root.querySelectorAll('textarea[data-ph-he]').forEach(function (ta) { ta.placeholder = ta.getAttribute('data-ph-' + (l === 'he' ? 'he' : 'en')); });
      root.querySelectorAll('.lp-rail nav, .lp-rail').forEach(function (r) { r.setAttribute('aria-label', l === 'he' ? 'חלקי השיעור' : 'Lesson sections'); });
    };
  }

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
