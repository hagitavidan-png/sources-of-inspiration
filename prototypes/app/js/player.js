/* The Lesson Player: one screen, one idea, one action. It shows any lesson whose screens are listed in
   window.APP_LESSONS (lessons/<id>.js: where each screen's content is in the lesson, the player's own words for it),
   through that lesson format's adapter.
   One lesson run, one artwork (js/artworks.js): the run keeps where the learner is in the lesson and what they chose
   (screen, medium, the thing to change, the possibility chosen); the artwork keeps the work. Paper or Studio is
   chosen on screen 9, and the artwork made then (on paper: an artwork with no Studio state). Every Studio screen
   opens that same artwork (?art=) in its Studio activity and comes back to its screen (?back=); the Studio saves the
   work by itself. A new run (a new artwork) starts the lesson again; the earlier ones and their works stay.
   Development points: 'before-repeat' (made by the Studio when Repeat enters, never offered as a choice) and 'kept'
   (the learner's "keep this", screen 14); screen 15 offers the kept ones, only when there are two or more. */
window.Player = (function () {
  'use strict';
  var I = window.I18N;
  var IMG = '../../images/editorial/';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var W = window.Artworks;
  /* the lesson's current run; before the learner has one, a new one (stored once something is kept in it) */
  function runOf(id) { return W.currentRun(id).then(function (r) { return r || { id: W.newId(), lesson: id, artwork: null }; }); }

  /* ── the parts of the lesson's content (texts come from the lesson; they may hold <b> and <br>) ── */
  function core(b) {
    return (b.big ? '<h3 class="pl-big">' + I.tx(b.big) + '</h3>' : '') +
      (b.sub ? '<p class="pl-sub">' + I.tx(b.sub) + '</p>' : '') +
      (b.body ? '<p>' + I.tx(b.body) + '</p>' : '') +
      (b.lines ? '<ul class="pl-lines">' + (b.lines[I.lang()] || []).map(function (v) { return '<li>' + v + '</li>'; }).join('') + '</ul>' : '') +
      (b.list ? '<ol class="pl-steps">' + (b.list[I.lang()] || []).map(function (v) { return '<li>' + v + '</li>'; }).join('') + '</ol>' : '') +
      (b.ask ? '<p class="pl-ask">' + I.tx(b.ask) + '</p>' : '');
  }
  function parts(list) {
    return list.map(function (p) {
      if (p.block) return core(p.block);
      if (p.list) return '<ul class="pl-lines">' + (p.list[I.lang()] || []).map(function (v) { return '<li>' + v + '</li>'; }).join('') + '</ul>';
      if (p.text) return '<p>' + I.tx(p.text) + '</p>';
      return '';
    }).join('');
  }
  /* a row of the lesson: "do" leads the screen; why, materials and check are quieter. The names of the lesson's
     structure stay in its data; the learner does not see them unless they add meaning (UNLABELLED: shown without) */
  var UNLABELLED = ['why', 'check'];
  function row(r) {
    if (r.k === 'do') return '<div class="pl-do">' + parts(r.parts) + '</div>';
    return '<section class="pl-row pl-row-' + esc(r.k) + '">' + (UNLABELLED.indexOf(r.k) < 0 ? '<h4>' + esc(I.ui(r.k)) + '</h4>' : '') + parts(r.parts) + '</section>';
  }
  function proto(text) {
    return '<aside class="pl-proto" role="note"><b>' + esc(I.ui('proto')) + '</b><span>' + esc(text) + '</span></aside>';
  }
  /* an image or the music the screen needs: the approved one, or a placeholder in the same place (audio: L.audio) */
  var NOTE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>';
  function media(m, L) {
    if (!m) return '';
    if (m.audio) {
      var file = L.audio && L.audio[m.audio];
      if (file) return '<figure class="pl-audio"><audio controls preload="none" src="' + esc(file) + '"></audio></figure>';
      return '<figure class="pl-audio pl-placeholder" data-audio="' + esc(m.audio) + '">' + NOTE + '<figcaption>' + esc(I.ui('protoAudio')) + '</figcaption></figure>';
    }
    var img = L.assets && L.assets[m.asset];
    if (img) return '<figure class="pl-media"><img src="' + IMG + esc(img) + '.jpg" alt=""></figure>';
    return '<figure class="pl-media pl-placeholder" data-asset="' + esc(m.asset) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M4 18l5-5 3 3 3-3 5 5"/></svg>' +
      '<figcaption>' + esc(I.ui('protoImage')) + '</figcaption></figure>';
  }
  /* an artwork of the lesson: its image, or, with no right to show it, the lesson's link to the museum */
  function work(w, small) {
    var cap = '<figcaption><b>' + esc(I.tx(w.artist)) + '</b> · ' + esc(I.tx(w.workTitle)) + '</figcaption>';
    var alt = w.alt && typeof w.alt === 'object' ? I.tx(w.alt) : w.alt;
    if (w.img) return '<figure class="pl-work' + (small ? ' small' : '') + '"><img src="' + IMG + esc(w.img) + '.jpg" alt="' + esc(alt || '') + '">' + cap + '</figure>';
    /* no image and nothing to link to yet: a placeholder where the image will be, the artist and title under it */
    if (!w.link) return '<figure class="pl-work pl-linkcard' + (small ? ' small' : '') + '"><div class="pl-linkcard-box pl-placeholder">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M4 18l5-5 3 3 3-3 5 5"/></svg>' +
      '<span>' + esc(I.ui('protoImage')) + '</span></div>' + cap + '</figure>';
    return '<figure class="pl-work pl-linkcard' + (small ? ' small' : '') + '"><div class="pl-linkcard-box">' +
      (w.link ? '<a href="' + esc(w.link.href) + '" target="_blank" rel="noopener">' + esc(I.tx(w.link.label)) + '</a>' : '') + '</div>' + cap + '</figure>';
  }
  function works(b, small) {
    return (b.works || []).map(function (w) {
      return work(w, small) + (small ? '' : (w.note ? '<p class="pl-note">' + esc(I.tx(w.note)) + '</p>' : '') +
        (w.link && w.img ? '<p class="pl-ext"><a href="' + esc(w.link.href) + '" target="_blank" rel="noopener">' + esc(I.tx(w.link.label)) + '</a></p>' : ''));
    }).join('');
  }

  /* the work of an artwork, if the Studio made any (its preview and operations) */
  function made(w) { return w && w.ops && w.ops.length ? w : null; }
  function hasRepeat(w) { return !!(w && (w.ops || []).some(function (o) { return o.t === 'repeat'; })); }
  function kept(w) { return ((w && w.points) || []).filter(function (p) { return p.kind === 'kept'; }); }
  function figure(img, label) {
    return '<figure class="pl-version"><img src="' + img + '" alt="">' + (label ? '<figcaption>' + esc(label) + '</figcaption>' : '') + '</figure>';
  }
  function lines(t) { return ((t && t[I.lang()]) || []).map(function (v) { return '<p class="pl-text">' + v + '</p>'; }).join(''); }

  /* ── one screen ── */
  /* a screen: the run and its artwork first (the store answers later), then the screen; a newer screen asked for
     meanwhile wins */
  var asked = 0, revealed = {};
  function render(root, id, n, nav) {
    var my = ++asked;
    runOf(id).then(function (run) { return Promise.all([run, run.artwork ? W.get(run.artwork) : null]); })
      .then(function (r) { if (my === asked) show(root, id, n, nav, r[0], r[1]); });
  }
  function show(root, id, n, nav, run, art) {
    var L = window.APP_LESSONS[id], A = window.AppAdapters[L.adapter](window.LESSON_PAGE), count = L.screens.length;
    var s = L.screens[n - 1], studio = run.medium === 'studio';
    var side = (studio ? s.studio : s.paper) || {};   // from screen 11, the words and actions of the learner's way
    var ACT = function (k) { return I.tx(L.actions[k]); };
    function keep() { return W.putRun(run); }
    function go(k) { return keep().then(function () { nav.go(k); }); }
    /* the Studio on the run's artwork, back to screen `back` */
    function openStudio(activity, back, more) {
      (run.artwork ? Promise.resolve() : W.artworkFor(run.id, 'digital').then(function (w) { run.artwork = w.id; })).then(function () {
        var href = 'studio/index.html?activity=' + encodeURIComponent(activity) + '&art=' + encodeURIComponent(run.artwork) +
          '&back=' + encodeURIComponent('../index.html#/lesson/' + id + '/play/' + (back || n)) + (more || '');
        return keep().then(function () { nav.studio(href); });
      });
    }
    var few = !studio || kept(art).length < 2;   // screen 15 only with two or more kept possibilities (never on paper)
    var free = L.screens.map(function (x) { return x.step; }).indexOf('free') + 1;   // the screen of free making (2.1: 16)
    if (s.step === 'choose' && few) return nav.go(n + 1);

    var blocks = (s.src || []).map(A.block);
    var title = '';
    blocks.forEach(function (b) { if (!title) title = A.title(b); });
    if (s.title && s.title[I.lang()]) title = s.title[I.lang()];
    var rows = [];
    var own = s.rows || {};   // the player's own words for a row, in this language (else the lesson's)
    blocks.forEach(function (b) { if (b.kind !== 'close') A.rows(b).forEach(function (r) {
      if (s.only && s.only.indexOf(r.k) < 0) return;
      rows.push(own[r.k] && own[r.k][I.lang()] != null ? { k: r.k, parts: [{ text: own[r.k] }] } : r);
    }); });
    var body = (s.media ? media(s.media, L) : '') +
      (s.compare ? '<div class="pl-pair">' + s.compare.map(function (r) { return works(A.block(r), true); }).join('') + '</div>'
                 : blocks.filter(function (b) { return b.works; }).map(function (b) { return works(b, false); }).join('')) +
      (s.gap ? proto(I.ui(s.gap)) : '') +
      rows.filter(function (r) { return r.k === 'do'; }).map(row).join('') +
      rows.filter(function (r) { return r.k !== 'do'; }).map(row).join('') +
      lines(side.text || s.text);
    var action = { label: I.ui('continue'), go: function () { go(n + 1); } }, extra = null;
    var work = studio && made(art), preview = work ? '<figure class="pl-studio-work"><img src="' + work.preview + '" alt=""></figure>' : '';

    /* 3, 4: what the learner sees first; the word for it only once "Continue" is pressed */
    if (s.reveal) {
      var shown = revealed[id + ':' + n];
      if (shown) body += '<p class="pl-reveal">' + esc(I.tx(s.reveal)) + '</p>';
      else action.go = function () { revealed[id + ':' + n] = true; show(root, id, n, nav, run, art); };
    }
    /* 9: paper or Studio; once the work has begun, that way stays (another way is a new artwork) */
    if (s.step === 'medium') {
      var locked = !!(run.begun || made(art));
      body += '<div class="pl-choices">' + ['paper', 'studio'].map(function (m) {
        return '<button type="button" class="pl-choice" data-medium="' + m + '" aria-pressed="' + (run.medium === m) + '"' + (locked && run.medium !== m ? ' disabled' : '') + '>' +
          (m === 'paper' ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9 13l6-6"/></svg>'
                         : '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8"/><path d="M8 13l3-3 2 2 3-3"/></svg>') +
          '<span>' + esc(I.tx(s.choices[m])) + '</span></button>';
      }).join('') + '</div>';
      action = run.medium ? action : null;
    }
    /* 10: the work begins (Studio: the drawing tools only) */
    if (s.step === 'begin') {
      var begun = function () { run.begun = true; go(n + 1); };
      action = { label: I.ui('continue'), go: begun };
      if (studio) {
        body += preview;
        if (work) extra = { label: I.ui('reopen'), go: function () { openStudio(s.studio.activity); } };
        else action = { label: I.ui('openStudio'), go: function () { openStudio(s.studio.activity); } };
      }
    }
    /* 11: Repeat enters the work (Studio: once, on the work there is; then screen 12) */
    if (s.step === 'repeat' && studio) {
      body += preview;
      if (!hasRepeat(art)) action = { label: ACT('tryRepeat'), off: !work, go: function () { if (work) openStudio(side.activity, side.back); } };
    }
    /* 12: look; back to the drawing (the source, then "see it repeat again" back here), or develop it */
    if (s.step === 'look' && studio) {
      body += preview;
      action = { label: ACT('develop'), go: function () { go(n + 1); } };
      extra = { label: ACT('backToDrawing'), go: function () { openStudio(side.activity, n); } };
    }
    /* 13: one thing to change */
    if (s.step === 'change') {
      var long = Object.keys(side.choices).some(function (c) { return I.tx(side.choices[c]).length > 8; });   // a long name: one under another
      body += '<div class="pl-changes' + (long ? ' pl-stack' : '') + '" role="group"><div>' + Object.keys(side.choices).map(function (c) {
        return '<button type="button" class="pl-change" data-change="' + c + '" aria-pressed="' + (run.change === c) + '">' + esc(I.tx(side.choices[c])) + '</button>';
      }).join('') + '</div></div>';
      action.off = !run.change;
    }
    /* 14: try possibilities (Studio: that one setting, drawing, "keep this") */
    if (s.step === 'try') {
      action.go = function () { go(few ? n + 2 : n + 1); };   // past the choice (15 in 2.1) when there is none to make
      if (studio) {
        body += preview;
        var openTry = function () { run.tried = true; openStudio(side.activity + run.change); };
        if (run.tried) extra = { label: I.ui('reopen'), go: openTry };
        else action = { label: I.ui('openStudio'), go: openTry };
      }
    }
    /* 15: which kept possibility to go on with (two or more); it becomes the work, the others stay */
    if (s.step === 'choose') {
      body += '<div class="pl-options">' + kept(art).map(function (p) {
        return '<button type="button" class="pl-option" data-point="' + esc(p.id) + '" aria-pressed="' + (run.chosen === p.id) + '"><img src="' + p.state.preview + '" alt=""></button>';
      }).join('') + '</div>';
      action = { label: I.ui('continue'), off: !run.chosen, go: function () {
        if (!run.chosen) return;
        W.restorePoint(run.artwork, run.chosen).then(function () { go(n + 1); });
      } };
    }
    /* 16: free (Studio: all the tools, the setting of screen 13 first) */
    if (s.step === 'free' && studio) {
      body += preview;
      var openFree = function () { run.free = true; openStudio(side.activity, n, '&control=' + encodeURIComponent(run.change || 'size')); };
      if (run.free) extra = { label: ACT('keepCreating'), go: openFree };
      else action = { label: ACT('keepCreating'), go: openFree };
    }
    if (s.step === 'free' && !studio) action.label = ACT('doneForNow');   // paper: time to make; the learner says when it is enough for now
    /* back to the artwork (3.1 screen 13): the Studio opens on it, and comes back to the free screen after it */
    if (s.step === 'return' && studio) {
      body += preview;
      action = { label: ACT('keepCreating'), go: function () { run.free = true; openStudio(side.activity, side.back); } };
    }
    if (s.step === 'see') body += preview;
    /* the end (2.1: 18): go on making, or another time (the work stays as it is, open) */
    if (s.step === 'end') {
      action = { label: ACT('anotherTime'), go: function () { run.done = true; keep().then(nav.finish); } };
      extra = { label: ACT('keepCreating'), go: function () {
        if (studio) openStudio(s.studio.activity, n, '&control=' + encodeURIComponent(run.change || 'size')); else go(free);
      } };
    }
    if (s.step === 'repeat' && studio && hasRepeat(art)) action = { label: I.ui('continue'), go: function () { go(n + 1); } };

    root.innerHTML =
      '<header class="pl-top">' +
        '<button type="button" class="pl-back" aria-label="' + esc(I.ui('back')) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>' +
        '<div class="pl-id"><span>' + esc(I.ui('lesson')) + ' ' + esc(A.lesson.number) + '</span> · ' + esc(I.tx(A.lesson.title)) + '</div>' +
        '<span class="pl-count" aria-label="' + n + '/' + count + '">' + n + '/' + count + '</span>' +
        '<div class="pl-progress" aria-hidden="true"><i style="width:' + (n / count * 100).toFixed(2) + '%"></i></div>' +
      '</header>' +
      '<main class="pl-main' + (s.step ? ' pl-step-' + s.step : '') + '" data-screen="' + n + '" tabindex="-1"><div class="pl-inner">' +
        (title ? '<h2 class="pl-title">' + esc(title) + '</h2>' : '') + body + '</div></main>' +
      '<footer class="pl-foot">' + (extra ? '<button type="button" class="pl-secondary">' + esc(extra.label) + '</button>' : '') +
        (action ? '<button type="button" class="pl-primary"' + (action.off ? ' disabled' : '') + '>' + esc(action.label) + '</button>' : '') + '</footer>';
    root.className = 'app player';

    root.querySelector('.pl-back').addEventListener('click', function () {
      if (n === 1) return nav.exit();
      var prev = L.screens[n - 2];
      go(prev && prev.step === 'choose' && few ? n - 2 : n - 1);   // a choice skipped on the way is skipped on the way back
    });
    if (action) root.querySelector('.pl-primary').addEventListener('click', function () { if (!action.off) action.go(); });
    if (extra) root.querySelector('.pl-secondary').addEventListener('click', extra.go);
    root.querySelectorAll('.pl-choice').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.disabled) return;
        run.medium = b.getAttribute('data-medium');
        keep().then(function () { return W.artworkFor(run.id, run.medium === 'studio' ? 'digital' : 'paper'); })
          .then(function (w) { run.artwork = w.id; return keep(); }).then(function () { nav.go(n + 1); });
      });
    });
    root.querySelectorAll('.pl-change').forEach(function (b) {
      b.addEventListener('click', function () { run.change = b.getAttribute('data-change'); keep().then(function () { show(root, id, n, nav, run, art); }); });
    });
    root.querySelectorAll('.pl-option').forEach(function (b) {
      b.addEventListener('click', function () { run.chosen = b.getAttribute('data-point'); keep().then(function () { show(root, id, n, nav, run, art); }); });
    });
    run.screen = n; keep();
    root.querySelector('.pl-main').focus({ preventScroll: true });
  }
  return { render: render, run: runOf, made: made };
})();
