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
  var SITE = '../../../';   // pilot 2.1: the site's own pages are on the live site, outside pilot/2-1/
  /* design pilot: lessons marked variant 'v2' get the stronger lesson layout (css: .lp-v2) */
  var V2 = D.variant === 'v2';
  var PAGES = window.LESSON_PAGES_INDEX || {};
  /* a unit's new name (preview only): the lesson header and the contents drawer on this page use it */
  ((window.ART_NAVIGATION || {}).units || []).forEach(function (u) {
    var nt = (window.UNIT_TITLES || {})[u.id];
    if (nt) u.title = nt;
  });

  var SECTIONS = [
    /* shown only when a lesson has it (the teacher version of the 2.1 pilot) */
    ['prep', 'לפני השיעור', 'Before the lesson'],
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
    return '<figure class="lp-ed-work lp-ed-r' + (k % 3) + (w.img ? '' : ' no-img') + (w.noArtist ? ' in-artist' : '') + (w.link && !w.img ? ' lp-window' : '') + (w.stage ? ' lp-window-stage' : '') + ' rv">' +
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
      return '<figure class="lp-sheet-pg lp-sheet-pg' + k + '">' + t(v, 'figcaption') + '<i class="lp-mark"></i></figure>';
    }).join('') + '</div>';
  }
  /* two patches of colour meeting: touching, overlapping, blending (1.1) */
  function meet(list) {
    if (!list || !list.length) return '';
    var M = {
      touch: '<circle class="a" cx="15" cy="15" r="11"/><circle class="b" cx="37" cy="15" r="11"/>',
      overlap: '<circle class="a" cx="19" cy="15" r="11"/><circle class="b" cx="33" cy="15" r="11"/>',
      blend: '<defs><linearGradient id="lp-blend"><stop offset=".15" class="s1"/><stop offset=".85" class="s2"/></linearGradient></defs><ellipse cx="26" cy="15" rx="23" ry="11" fill="url(#lp-blend)"/>'
    };
    return '<div class="lp-meet" aria-hidden="true">' + list.map(function (k) {
      return '<svg viewBox="0 0 52 30">' + (M[k] || '') + '</svg>';
    }).join('') + '</div>';
  }
  /* pattern sketches (2.1): one unit isolated in a viewfinder; the same row with one rule changed */
  function sketch(kind, b_labels, b_cap) {
    var U = function (x, y, r, s) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + (4.2 * (s || 1)) + '" ry="' + (2.2 * (s || 1)) + '" transform="rotate(' + (r || -30) + ' ' + x + ' ' + y + ')"/>'; };
    if (kind === 'finder') {
      var g = '';
      for (var r = 0; r < 4; r++) for (var c = 0; c < 7; c++) g += U(12 + c * 16 + (r % 2) * 8, 10 + r * 13);
      /* corner marks around one unit */
      var fx = 44, fy = 17, w = 24, h = 18, k = 5;
      var fr = '<path class="fr" d="M' + fx + ' ' + (fy + k) + 'V' + fy + 'H' + (fx + k) + 'M' + (fx + w - k) + ' ' + fy + 'H' + (fx + w) + 'V' + (fy + k) +
        'M' + (fx + w) + ' ' + (fy + h - k) + 'V' + (fy + h) + 'H' + (fx + w - k) + 'M' + (fx + k) + ' ' + (fy + h) + 'H' + fx + 'V' + (fy + h - k) + '"/>';
      return '<div class="lp-sketch lp-sketch-finder" aria-hidden="true"><svg viewBox="0 0 124 56"><g class="u">' + g + '</g>' + fr + '</svg></div>';
    }
    if (kind === 'vary') {
      var row = function (f) { var o = ''; for (var i = 0; i < 4; i++) o += f(i); return o; };
      var a = row(function (i) { return U(10 + i * 14, 14, -30, 0.7 + i * 0.28); });
      var b = row(function (i) { return U(10 + i * 14, 14, -30 + i * 40); });
      var c = row(function (i) { return U(6 + i * (6 + i * 5), 14); });
      return '<div class="lp-sketch lp-sketch-vary" aria-hidden="true">' + [a, b, c].map(function (x) {
        return '<svg viewBox="0 0 64 28"><rect x=".5" y=".5" width="63" height="27"/><g class="u">' + x + '</g></svg>';
      }).join('') + '</div>';
    }
    if (kind === 'horizon' || kind === 'tube') {
      /* a wide view: the horizon line decides how much is sky and how much is land; a tiny person gives the scale */
      var wide = function (hy, extra) {
        return '<svg viewBox="0 0 96 48"><rect class="sky" x="0" y="0" width="96" height="' + hy + '"/>' +
          '<path class="hz" d="M0 ' + hy + 'H96"/><path class="pp" d="M62 ' + (hy + 6) + 'v-3.4"/><circle class="pp" cx="62" cy="' + (hy + 1.8) + '" r=".9"/>' +
          (extra || '') + '<rect class="fr" x=".5" y=".5" width="95" height="47"/></svg>';
      };
      if (kind === 'horizon') {
        var lab = items(b_labels);
        return '<figure class="lp-sketch lp-sketch-hz" aria-hidden="true"><div>' + [wide(34), wide(14)].map(function (x, k) {
          return '<span>' + x + (lab[k] ? t(lab[k], 'b') : '') + '</span>';
        }).join('') + '</div>' + t(b_cap, 'figcaption') + '</figure>';
      }
      /* the same view, and the small circle seen through a rolled paper tube */
      return '<div class="lp-sketch lp-sketch-hz lp-sketch-tube" aria-hidden="true"><div><span>' + wide(28, '<circle class="tb" cx="62" cy="28" r="9"/>') + '</span>' +
        '<span><svg viewBox="0 0 48 48"><clipPath id="lp-tube"><circle cx="24" cy="24" r="22"/></clipPath><g clip-path="url(#lp-tube)">' +
        '<rect class="sky" x="0" y="0" width="48" height="24"/><path class="hz" d="M0 24H48"/><path class="pp" d="M24 36v-9"/><circle class="pp" cx="24" cy="25" r="2.2"/></g>' +
        '<circle class="fr" cx="24" cy="24" r="22"/></svg></span></div></div>';
    }
    if (kind === 'twolight') {
      /* the same round object, lit from one side and then from the other: the shadow changes sides */
      var ball = function (k, from) {
        var lx = from === 'r' ? 40 : 24;
        return '<svg viewBox="0 0 64 48"><defs><radialGradient id="lp-tl-' + k + '" cx="' + (from === 'r' ? '.68' : '.32') + '" cy=".35" r=".75">' +
          '<stop offset="0" class="s1"/><stop offset="1" class="s2"/></radialGradient></defs>' +
          '<ellipse class="cast" cx="' + (from === 'r' ? 20 : 44) + '" cy="39" rx="16" ry="3.4"/>' +
          '<circle cx="32" cy="26" r="13" fill="url(#lp-tl-' + k + ')"/>' +
          '<path class="ray" d="M' + (from === 'r' ? '58 6L' + (lx + 8) + ' 14' : '6 6L' + (lx - 8) + ' 14') + '"/>' +
          '<rect class="fr" x=".5" y=".5" width="63" height="47"/></svg>';
      };
      return '<div class="lp-sketch lp-sketch-light" aria-hidden="true">' + ball(0, 'r') + ball(1, 'l') + '</div>';
    }
    if (kind === 'moments' || kind === 'overlap') {
      /* one dot moving along a path: the path so far is a fine line, the rest is only suggested */
      var path = function (d, done) { return '<path class="pt" d="' + d + '"/>' + (done ? '<path class="pd" d="' + done + '"/>' : ''); };
      if (kind === 'moments') {
        /* three moments of the same movement, a frame for each */
        return '<div class="lp-sketch lp-sketch-mv" aria-hidden="true">' + [
          ['M10 36Q14.4 30 18.8 26.4', 18.8, 26.4], ['M10 36Q21 21 32 21', 32, 21], ['M10 36Q27.6 12 45.2 26.4', 45.2, 26.4]
        ].map(function (f) {
          return '<svg viewBox="0 0 64 48">' + path('M10 36Q32 6 54 36', f[0]) + '<circle class="dt" cx="' + f[1] + '" cy="' + f[2] + '" r="3.6"/>' +
            '<rect class="fr" x=".5" y=".5" width="63" height="47"/></svg>';
        }).join('') + '</div>';
      }
      /* the moments overlap in one frame */
      var dots = '';
      [[33.6, 22.9, .22], [40.8, 20.7, .38], [48, 20, .55], [55.2, 20.7, .75], [62.4, 22.9, 1]].forEach(function (d) {
        dots += '<circle class="dt" cx="' + d[0] + '" cy="' + d[1] + '" r="5.4" opacity="' + d[2] + '"/>';
      });
      return '<div class="lp-sketch lp-sketch-mv lp-sketch-ov" aria-hidden="true"><svg viewBox="0 0 96 48">' +
        path('M12 38Q48 2 84 38', 'M12 38Q37.2 12.8 62.4 22.9') + dots + '<rect class="fr" x=".5" y=".5" width="95" height="47"/></svg></div>';
    }
    if (kind === 'tilt') {
      /* paint running down a tilted sheet: thicker where it starts, thinning out, on past the edge */
      return '<div class="lp-sketch lp-sketch-tilt" aria-hidden="true"><svg viewBox="0 -3 96 75">' +
        '<rect class="fr" x="16" y="6" width="64" height="48" transform="rotate(-14 48 30)"/>' +
        '<path class="pd" d="M38.5 14.1L38.6 15.9L38.7 17.6L38.8 19.3L38.8 20.9L38.8 22.5L38.7 24.1L38.7 25.6L38.7 27.1L38.7 28.5L38.8 30.0L38.9 31.4L39.0 32.8L39.2 34.2L39.5 35.5L39.9 36.9L40.4 38.2L40.9 39.5L41.3 40.6L41.7 41.7L42.0 42.7L42.3 43.6L42.6 44.5L42.8 45.5L43.0 46.4L43.2 47.4L43.3 48.5L43.4 49.6L43.4 50.8L43.4 52.1L43.4 53.6L43.4 55.2L43.3 57.0L43.7 57.0L43.8 55.2L43.8 53.6L43.9 52.1L43.9 50.8L43.9 49.6L43.9 48.4L43.8 47.3L43.7 46.3L43.6 45.3L43.4 44.4L43.2 43.4L43.0 42.4L42.7 41.3L42.4 40.2L42.0 39.1L41.6 37.8L41.3 36.5L41.0 35.2L40.8 33.9L40.7 32.6L40.7 31.3L40.7 30.0L40.7 28.6L40.8 27.2L40.9 25.7L41.0 24.2L41.1 22.6L41.3 21.0L41.4 19.4L41.4 17.6L41.5 15.8L41.5 13.9A1.48 1.48 0 0 0 38.5 14.1Z"/>' +
        '<path class="pt" d="M43.5 57.5C43.2 62 42.9 66 42.6 70"/></svg></div>';
    }
    if (kind === 'crop') {
      /* the same leaf: whole and small, whole and enlarged, cropped by the frame */
      var leaf = function (cx, cy, k) {
        return '<g transform="translate(' + cx + ' ' + cy + ') scale(' + k + ') rotate(-35)">' +
          '<path class="lf" d="M0 -20C9 -12 10 6 0 20C-10 6 -9 -12 0 -20Z"/><path class="vn" d="M0 -18V18M0 -8L5 -12M0 -8L-5 -12M0 0L6 -4M0 0L-6 -4M0 8L5 4M0 8L-5 4"/></g>';
      };
      var frames = [leaf(32, 24, 0.45), leaf(32, 24, 1.05), leaf(26, 34, 2.6)];
      var lab = items(b_labels);
      return '<figure class="lp-sketch lp-sketch-crop" aria-hidden="true"><div>' + frames.map(function (f, k) {
        return '<span><svg viewBox="0 0 64 48"><defs><clipPath id="lp-crop-' + k + '"><rect x="0" y="0" width="64" height="48"/></clipPath></defs>' +
          '<g clip-path="url(#lp-crop-' + k + ')">' + f + '</g><rect class="fr" x=".5" y=".5" width="63" height="47"/></svg>' + (lab[k] ? t(lab[k], 'b') : '') + '</span>';
      }).join('') + '</div>' + t(b_cap, 'figcaption') + '</figure>';
    }
    return '';
  }
  /* the unit's work laid out in order, like a small exhibition (1.9) */
  function wall(list) {
    if (!list || !list.length) return '';
    /* two rows: one line on wide screens, two hanging lines on phones */
    var half = Math.ceil(list.length / 2);
    function pc(n, k) {
      return '<span class="lp-wall-pc lp-wall-' + k + (k === list.length - 1 ? ' is-last' : '') + '"><i dir="ltr">' + esc(n) + '</i></span>';
    }
    return '<div class="lp-wall" aria-hidden="true">' +
      '<div class="lp-wall-row">' + list.slice(0, half).map(function (n, k) { return pc(n, k); }).join('') + '</div>' +
      '<div class="lp-wall-row">' + list.slice(half).map(function (n, k) { return pc(n, k + half); }).join('') + '</div></div>';
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

  /* labelled rows (2.1 pilot): a row is a known key or its own label, then text, lists and shared core blocks */
  var GUIDE = {
    goal: ['מטרה', 'Goal'], instruction: ['הנחיה', 'Instruction'], question: ['שאלה', 'Question'], show: ['להציג', 'Show'],
    options: ['האפשרויות', 'Options'], look: ['מה לחפש', 'What to look for'], stuck: ['אם תלמיד נתקע', 'If a student gets stuck'],
    questions: ['שאלות לתלמידים', 'Questions for students'], outcome: ['תוצר צפוי', 'Expected outcome'],
    reflection: ['רפלקציה', 'Reflection'], discussion: ['דיון', 'Discussion'], time: ['זמן', 'Time'],
    materials: ['חומרים', 'Materials'], prep: ['הכנה', 'Preparation'], concepts: ['מושגים', 'Concepts'],
    'do': ['מה עושים', 'What to do'], why: ['הסבר', 'Explanation'], check: ['בדיקה עצמית', 'Self-check'], checklist: ['רשימה לבדיקה', 'Checklist']
  };
  function guide(rows) {
    if (!rows || !rows.length) return '';
    return '<dl class="lp-guide">' + rows.map(function (r) {
      var lab = r.k ? tt((GUIDE[r.k] || [r.k, r.k])[0], (GUIDE[r.k] || [r.k, r.k])[1]) : t(r.label);
      return '<div class="lp-guide-row"><dt>' + lab + '</dt><dd>' + (r.parts || []).map(function (p) {
        if (p.block) return block(p.block);
        if (p.list) return '<ul class="lp-guide-list">' + items(p.list).map(function (v) { return t(v, 'li'); }).join('') + '</ul>';
        if (p.link) return '<p class="lp-guide-link"><a class="ed-cta" href="' + esc(p.link.href) + '">' + t(p.link.label) + ' <span class="arr" aria-hidden="true" data-he="←" data-en="→">' + (L === 'he' ? '←' : '→') + '</span></a></p>';
        return t(p.text, 'p');
      }).join('') + '</dd></div>';
    }).join('') + '</dl>';
  }

  function block(b) {
    var quote = b.quote ? '<blockquote class="lp-quote">' + t(b.quote, 'p') + t(b.attr, 'cite') + '</blockquote>' : '';
    return '<div class="lp-block rv' + (b.kind ? ' lp-kind-' + b.kind : '') + '"' + (b.core ? ' data-core="' + esc(b.core) + '"' : '') + '>' +
      t(b.label, 'p', 'lp-label') +
      quote +
      t(b.big, 'h3', 'lp-big') +
      t(b.poem, 'p', 'lp-poem') +
      t(b.sub, 'p', 'lp-sub') +
      t(b.body, 'p', 'lp-sub') +
      guide(b.guide) +
      wall(b.wall) +
      (b.works && b.works.length ? works(b.works) : '') +
      lines(b.lines) +
      lenses(b.lenses, b.lensLabel) +
      t(b.ask, 'p', 'lp-ask') +
      meet(b.meet) +
      sketch(b.sketch, b.sketchLabels, b.sketchCap) +
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
      /* a station can open without its generic title (1.9) */
      var bare = D.noTitle && D.noTitle.indexOf(key) >= 0;
      return '<section class="lp-sec lp-station' + lay + (bare ? ' lp-bare' : '') + '" id="' + key + '" data-sec>' +
        '<header class="lp-sec-head rv"><span class="lp-station-n" aria-hidden="true">0' + n + '</span>' + (bare ? '' : tt(he, en, 'h2', 'ed-display')) + '</header>' +
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
    /* phones: the main way into the contents: "☰ Contents · Unit 1 · Lesson 8 of 9 ⌄", the whole bar opens the drawer */
    html += '<a class="lp-where" href="#ed-drawer" data-open-contents aria-expanded="false">' +
      '<span class="lp-where-in">' +
      '<svg class="lp-where-menu" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1.5 3.5h11M1.5 7h11M1.5 10.5h11" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>' +
      tt('תוכן', 'Contents', 'b', 'lp-where-lab') + '<span class="lp-where-dot" aria-hidden="true">·</span>' +
      tt('יחידה ' + unitN + ' · שיעור ' + posInUnit + ' מתוך ' + unitCount, 'Unit ' + unitN + ' · Lesson ' + posInUnit + ' of ' + unitCount, 'span', 'lp-where-loc') +
      '</span>' +
      '<svg class="lp-where-chev" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4.5l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg></a>';
  }
  html += '<section class="lp-head ed-wrap">' +
    '<nav class="crumb rv" aria-label="' + (L === 'he' ? 'מיקום באתר' : 'Breadcrumb') + '">' +
    '<a href="' + SITE + 'index.html">' + tt('מקורות השראה', 'Sources of Inspiration') + '</a> <span aria-hidden="true">/</span> ' +
    '<a href="' + SITE + 'units/unit-' + D.unitNum + '.html">' + t({ he: 'יחידה ' + unitN + ': ' + unitTitle.he, en: 'Unit ' + unitN + ': ' + unitTitle.en }) + '</a> <span aria-hidden="true">/</span> ' +
    '<span aria-current="page">' + tt('שיעור ' + D.number, 'Lesson ' + D.number) + '</span></nav>' +
    (V2
      /* pilot: the lesson opens like a small title page */
      ? '<div class="lp-gate rv">' +
        '<p class="lp-gate-kicker">' + tt('יחידה ' + D.unitNum + ' · שיעור ' + D.number, 'Unit ' + D.unitNum + ' · Lesson ' + D.number) +
        /* a version of the lesson (2.1 pilot): its name, next to the lesson number */
        (D.modeLabel ? '<span class="dot" aria-hidden="true"> · </span>' + t(D.modeLabel, 'span', 'lp-mode') : '') + '</p>' +
        t(D.title, 'h1', 'ed-display lp-gate-title') +
        t(D.subtitle, 'p', 'lp-gate-sub') +
        t(unitTitle, 'p', 'lp-gate-unit') +
        '<p class="lp-meta">' + t(D.time) + (D.slides ? ' <span class="dot">·</span> <a class="ed-link" href="' + BASE + D.slides + '">' + tt('הצגה בכיתה, מסך אחרי מסך', 'Present in class, screen by screen') + '</a>' : '') +
        (D.other ? ' <span class="dot">·</span> <a class="ed-link lp-other" href="' + esc(D.other.href) + '">' + t(D.other.label) + '</a>' : '') + '</p>' +
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
    var blocks = (d.blocks || []).slice();
    var createSteps = S.create && ((S.create.steps && S.create.steps.length) || (S.create.lead && S.create.lead.length));
    var hasMaterials = key === 'create' && D.materials && createSteps;
    if (key !== 'explore' && !blocks.length && !(d.works && d.works.length) && !(d.steps && d.steps.length) && !hasMaterials) return;
    n++;
    var inner = '';
    /* a station without its title opens straight with its first screen (1.9) */
    var bareOpen = key === 'explore' && D.noTitle && D.noTitle.indexOf(key) >= 0 && blocks.length;
    if (bareOpen) inner += block(blocks.shift());
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
    rail += '<li><a href="#' + key + '"><span>0' + n + '</span>' + (D.noTitle && D.noTitle.indexOf(key) >= 0 ? '' : tt(s[1], s[2])) + '</a></li>';
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
    (i < 0 ? '' : link(flat[i - 1], 'prev') + link(flat[i + 1], 'next')) + '</nav>';   /* a lesson that is not in the navigation (4.1): no prev / next */

  root.innerHTML = html;
  if (V2) root.classList.add('lp-v2');

  /* the location bar shows whether the contents are open (the chevron turns) */
  var where = root.querySelector('.lp-where');
  if (where && 'MutationObserver' in window) {
    new MutationObserver(function () {
      where.setAttribute('aria-expanded', document.body.classList.contains('ed-open') ? 'true' : 'false');
    }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

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

  /* arriving at a part of the lesson by its address (#create, from the Studio): the browser's own jump is smooth and
     the images above load lazily, so it would stop short. The jump is made instant, the images above load now, and the
     page goes to the part once the page and those images are loaded */
  var arrive = location.hash && document.getElementById(location.hash.slice(1));
  if (arrive && arrive.hasAttribute('data-sec')) {
    var html = document.documentElement, was = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    var above = [].filter.call(root.querySelectorAll('img'), function (im) { return im.compareDocumentPosition(arrive) & Node.DOCUMENT_POSITION_FOLLOWING; });
    above.forEach(function (im) { im.loading = 'eager'; });
    var loaded = document.readyState === 'complete' ? 0 : new Promise(function (ok) { window.addEventListener('load', ok); });   // the page's other scripts have run
    Promise.all([loaded].concat(above.map(function (im) {
      return im.complete ? 0 : new Promise(function (ok) { im.addEventListener('load', ok); im.addEventListener('error', ok); });
    }))).then(function () {
      arrive.scrollIntoView({ block: 'start' });
      requestAnimationFrame(function () { html.style.scrollBehavior = was; });
    });
  }
})();
