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

  /* the lesson's galleries (L.galleries: { <name>: [item] }): one large image at a time, previous / next and a small
     counter. An item: { img, size, alt, artist?, workTitle?, credit? }; img an image of the site
     (images/editorial/<img>.jpg) or of the app (a path, '<dir>/<img>.jpg'), or null: a placeholder in its place (an
     image not cleared for use yet); size [width, height]: the image is shown whole, at its own proportions, its place
     kept before it loads; credit { who, licence?, href }: the photographer (and licence) a photograph is to be named
     with, a small line under the caption, linked to the photograph's page. The
     image of a gallery the learner is at is kept in the run (run.seen), so later screens show the image looked at last
     (a placeholder passed over): focus (it, large), pair (two galleries' side by side), thumbs (small, to look at again) */
  var PIC = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M4 18l5-5 3 3 3-3 5 5"/></svg>';
  var PREV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>', NEXT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  function src(img) { return img.indexOf('/') >= 0 ? esc(img) + '.jpg' : IMG + esc(img) + '.jpg'; }
  function seenOf(run, L, g) { var n = L.galleries[g].length, i = (run.seen && run.seen[g]) | 0; return ((i % n) + n) % n; }
  /* the image of a gallery looked at last, for the later screens: a placeholder is passed over (the one before it) */
  function lastShown(run, L, g) {
    var items = L.galleries[g], n = items.length, i = seenOf(run, L, g);
    for (var k = 0; k < n && !items[(i - k + n) % n].img; k++);
    return items[(i - k + n) % n];
  }
  var EXT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v6H4V6h6"/></svg>';
  function outLink(href, inner) { return '<a href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' + inner + '<span class="pl-sr"> ' + esc(I.ui('newTab')) + '</span></a>'; }
  /* the caption: the artist, then the work's title and year, smaller, then the credit. short: a long title is cut at a
     word, with its year (the full title stays for screen readers and as the element's title) */
  var SHORT = 28;
  function shortTitle(t) {
    var m = /^(.*), (\d{4})$/.exec(t), name = m ? m[1] : t, year = m ? ', ' + m[2] : '';
    if (name.length <= SHORT) return t;
    var cut = name.slice(0, SHORT), sp = cut.lastIndexOf(' ');
    return (sp > 10 ? cut.slice(0, sp) : cut).replace(/[,;:]$/, '') + '…' + year;
  }
  function caption(it, short) { return '<figcaption>' + captionText(it, short) + '</figcaption>'; }
  function captionText(it, short) {
    var c = it.credit, t = it.workTitle ? I.tx(it.workTitle) : '', v = short ? shortTitle(t) : t;
    return (it.artist ? '<b class="pl-cap-artist">' + esc(I.tx(it.artist)) + '</b>' +
        (v === t ? '<span class="pl-cap-work"><bdi>' + esc(t) + '</bdi></span>'
                 : '<span class="pl-cap-work" title="' + esc(t) + '"><bdi aria-hidden="true">' + esc(v) + '</bdi><span class="pl-sr">' + esc(t) + '</span></span>') : '') +
      (c ? '<small class="pl-credit">' + outLink(c.href, esc(I.ui('photoBy', { who: '' })) + '<bdi>' + esc(c.who) + (c.licence ? ' · <span class="pl-licence">' + esc(c.licence) + '</span>' : '') + '</bdi>') + '</small>' : '');
  }
  /* the image at its own proportions (--r, from size): never cropped, as large as the space allows */
  function ratio(it) { return it.size ? (it.size[0] / it.size[1]).toFixed(4) : '1.3333'; }
  function imgTag(it, alt) {
    return '<img src="' + src(it.img) + '" alt="' + esc(alt) + '" style="--r:' + ratio(it) + '"' + (it.size ? ' width="' + it.size[0] + '" height="' + it.size[1] + '"' : '') + '>';
  }
  function picture(it, cls) {
    return it.img ? '<div class="' + cls + '">' + imgTag(it, I.tx(it.alt)) + '</div>'
      : '<div class="' + cls + ' pl-placeholder" role="img" aria-label="' + esc(I.ui('protoImage') + (it.artist ? ' ' + I.tx(it.artist) + ', ' + I.tx(it.workTitle) : '')) + '">' + PIC + '<span aria-hidden="true">' + esc(I.ui('protoImage')) + '</span></div>';
  }
  function counterOf(i, n) { return '<span aria-hidden="true">' + (i + 1) + '/' + n + '</span><span class="pl-sr">' + esc(I.ui('galleryCount', { n: i + 1, total: n })) + '</span>'; }
  /* a gallery's image, whole, in its frame; it can be looked at large (js/viewer.js) */
  function galPicture(it) { return it.img ? '<div class="pl-gal-frame">' + zoomable(it, 'pl-gal-zoom', true) + '</div>' : picture(it, 'pl-gal-frame'); }
  function gallery(L, run, g) {
    var items = L.galleries[g], i = seenOf(run, L, g);
    return '<section class="pl-gallery" data-gallery="' + esc(g) + '" aria-label="' + esc(I.ui('images')) + '">' +
      '<figure class="pl-gal-fig">' + galPicture(items[i]) + caption(items[i]) + '</figure>' +
      '<div class="pl-gal-nav"><button type="button" class="pl-gal-btn" data-step="-1" aria-label="' + esc(I.ui('galleryPrev')) + '">' + PREV + '</button>' +
      '<span class="pl-gal-count" aria-live="polite">' + counterOf(i, items.length) + '</span>' +
      '<button type="button" class="pl-gal-btn" data-step="1" aria-label="' + esc(I.ui('galleryNext')) + '">' + NEXT + '</button></div></section>';
  }
  function focusOn(L, run, g) { var it = lastShown(run, L, g); return '<figure class="pl-gal-fig pl-focus">' + galPicture(it) + caption(it) + '</figure>'; }
  /* an image to look at large (js/viewer.js): a button around it, named for what it shows; only to look at, it changes
     nothing. zooms: this screen's items, by number */
  var zooms = [], ZOOM = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4h5v5"/><path d="M20 4l-6 6"/><path d="M9 20H4v-5"/><path d="M4 20l6-6"/></svg>';
  function zoomable(it, cls, badge) {
    if (!it.img) return picture(it, cls);
    return '<button type="button" class="pl-zoom ' + cls + '" style="--r:' + ratio(it) + '" data-zoom="' + (zooms.push(it) - 1) + '" aria-label="' + esc(I.ui('enlarge', { what: I.tx(it.alt) })) + '">' +
      imgTag(it, '') + (badge ? '<span class="pl-zoom-badge">' + ZOOM + '</span>' : '') + '</button>';
  }
  function pair(L, run, gs) {
    return '<div class="pl-duo">' + gs.map(function (g) { var it = lastShown(run, L, g); return '<figure class="pl-duo-fig">' + zoomable(it, 'pl-duo-img', true) + caption(it, true) + '</figure>'; }).join('') + '</div>';
  }
  function thumbs(L, run, t) {
    var list = [];
    (t.all || []).forEach(function (g) { list = list.concat(L.galleries[g]); });
    (t.seen || []).forEach(function (g) { list.push(lastShown(run, L, g)); });
    return '<ul class="pl-thumbs">' + list.map(function (it) {
      return '<li>' + (it.img ? zoomable(it, 'pl-thumb') : '<span class="pl-thumb pl-placeholder" aria-hidden="true">' + PIC + '</span>') + '</li>';
    }).join('') + '</ul>';
  }

  /* "Want to discover more?": a few artists to look at outside the lesson, on their own or a museum's site (a new tab;
     no image of theirs is copied here). An item: { name, site (what the page is), href } */
  function more(list) {
    return '<section class="pl-more" aria-label="' + esc(I.ui('exploreMore')) + '"><h3>' + esc(I.ui('exploreMore')) + '</h3><ul>' + list.map(function (m) {
      return '<li>' + outLink(m.href, '<b>' + esc(I.tx(m.name)) + '</b><span class="pl-more-site">' + esc(I.tx(m.site)) + '</span>' + EXT) + '</li>';
    }).join('') + '</ul></section>';
  }

  /* the work of an artwork, if the Studio made any (its preview and operations) */
  function made(w) { return w && w.ops && w.ops.length ? w : null; }
  function hasRepeat(w) { return !!(w && (w.ops || []).some(function (o) { return o.t === 'repeat'; })); }
  function kept(w) { return ((w && w.points) || []).filter(function (p) { return p.kind === 'kept'; }); }
  function figure(img, label) {
    return '<figure class="pl-version"><img src="' + img + '" alt="">' + (label ? '<figcaption>' + esc(label) + '</figcaption>' : '') + '</figure>';
  }
  /* a screen's words, a paragraph each; a guidance for the looking (the whole line <span class="pl-hint">) is quieter */
  function lines(t) { return ((t && t[I.lang()]) || []).map(function (v) { return '<p class="pl-text' + (/^<span class="pl-hint">/.test(v) ? ' pl-hint' : '') + '">' + v + '</p>'; }).join(''); }

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
    zooms = [];
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
          '&back=' + encodeURIComponent('../index.html#/lesson/' + id + '/play/' + (back || n)) + (L.works ? '&at=' + n : '') + (more || '');
        return keep().then(function () { nav.studio(href); });
      });
    }
    var few = !studio || kept(art).length < 2;   // screen 15 only with two or more kept possibilities (never on paper)
    var free = 0;   // the last screen of free making (3.1: 14; the Studio's own screen in 2.1: 12)
    L.screens.forEach(function (x, i) { if (x.step === 'free' || x.step === 'studio') free = i + 1; });
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
    /* L.wordsFirst (2.1): on a screen with images the screen's words come first, the images after them, so its question
       is never under the images, cut off by the bottom of a small screen */
    var images = s.gallery || s.focus || s.pair || s.thumbs, first = L.wordsFirst && images ? lines(side.text || s.text) : '';
    var body = first + (s.gallery ? gallery(L, run, s.gallery) : '') + (s.focus ? focusOn(L, run, s.focus) : '') +
      (s.pair ? pair(L, run, s.pair) : '') + (s.thumbs ? thumbs(L, run, s.thumbs) : '') +
      (s.media ? media(s.media, L) : '') +
      (s.compare ? '<div class="pl-pair">' + s.compare.map(function (r) { return works(A.block(r), true); }).join('') + '</div>'
                 : blocks.filter(function (b) { return b.works; }).map(function (b) { return works(b, false); }).join('')) +
      (s.gap ? proto(I.ui(s.gap)) : '') +
      rows.filter(function (r) { return r.k === 'do'; }).map(row).join('') +
      rows.filter(function (r) { return r.k !== 'do'; }).map(row).join('') +
      (first ? '' : lines(side.text || s.text)) + (s.more ? more(s.more) : '');
    var action = { label: I.ui('continue'), go: function () { go(n + 1); } }, extra = null, later = null;
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
      if (studio && s.studio && made(art)) extra = { label: I.ui('reopen'), go: function () { openStudio(s.studio.activity, s.studio.back); } };
    }
    /* the question before Repeat (2.1 screen 9): Studio, once there is a drawing; paper, its own words */
    if (s.step === 'ask') {
      if (studio) { body += preview; action = { label: ACT('seeWhat'), off: !work, go: function () { if (work) go(n + 1); } }; }
      else action.go = function () { run.begun = true; go(n + 1); };
    }
    /* the Studio's own screen (2.1: 10, 12): arriving, the artwork opens there; on paper, the paper's words */
    if (s.step === 'studio' && studio) {
      run.screen = n;
      root.innerHTML = '<main class="pl-main pl-step-studio" data-screen="' + n + '"></main>';
      openStudio(side.activity, side.back);
      return;
    }
    if (s.step === 'studio' && !studio && side.action) action.label = ACT(side.action);
    /* looking at what emerged (2.1: 11): then straight back to the making */
    if (s.step === 'notice' && studio) { body += preview; action = { label: ACT('keepCreating'), go: function () { go(n + 1); } }; }
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
      /* L.works (2.1): My artworks is the main way out; "another time" stays, quieter */
      if (L.works) { later = action; action = { label: I.ui('gallery'), go: function () { run.done = true; keep().then(function () { nav.works(n); }); } }; }
    }
    if (s.step === 'repeat' && studio && hasRepeat(art)) action = { label: I.ui('continue'), go: function () { go(n + 1); } };

    root.innerHTML =
      '<header class="pl-top">' +
        '<button type="button" class="pl-back" aria-label="' + esc(I.ui('back')) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>' +
        '<div class="pl-id"><span>' + esc(I.ui('lesson')) + ' ' + esc(A.lesson.number) + '</span> · ' + esc(I.tx(A.lesson.title)) + '</div>' +
        (L.works ? '<a class="pl-works" href="' + nav.worksHref(n) + '" aria-label="' + esc(I.ui('gallery')) + '" title="' + esc(I.ui('gallery')) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M4 18l5-5 4 4 3-3 4 4"/></svg></a>' : '') +
        '<span class="pl-count" aria-label="' + n + '/' + count + '">' + n + '/' + count + '</span>' +
        '<div class="pl-progress" aria-hidden="true"><i style="width:' + (n / count * 100).toFixed(2) + '%"></i></div>' +
      '</header>' +
      '<main class="pl-main' + (s.step ? ' pl-step-' + s.step : '') + '" data-screen="' + n + '" tabindex="-1"><div class="pl-inner">' +
        (title ? '<h2 class="pl-title">' + esc(title) + '</h2>' : '') + body + '</div></main>' +
      '<footer class="pl-foot">' + (extra ? '<button type="button" class="pl-secondary">' + esc(extra.label) + '</button>' : '') +
        (later ? '<button type="button" class="pl-secondary pl-later">' + esc(later.label) + '</button>' : '') +
        (action ? '<button type="button" class="pl-primary"' + (action.off ? ' disabled' : '') + '>' + esc(action.label) + '</button>' : '') + '</footer>';
    root.className = 'app player';

    root.querySelector('.pl-back').addEventListener('click', function () {
      if (n === 1) return nav.exit();
      var prev = L.screens[n - 2];
      go(prev && ((prev.step === 'choose' && few) || (prev.step === 'studio' && studio)) ? n - 2 : n - 1);   // a choice skipped on the way, or the Studio's own screen, is passed over going back
    });
    if (action) root.querySelector('.pl-primary').addEventListener('click', function () { if (!action.off) action.go(); });
    if (extra) root.querySelector('.pl-secondary').addEventListener('click', extra.go);
    if (later) root.querySelector('.pl-later').addEventListener('click', later.go);
    root.querySelectorAll('.pl-choice').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.disabled) return;
        run.medium = b.getAttribute('data-medium');
        keep().then(function () { return W.artworkFor(run.id, run.medium === 'studio' ? 'digital' : 'paper'); })
          .then(function (w) { run.artwork = w.id; return keep(); }).then(function () {
            if (run.medium === 'studio' && s.studio && s.studio.activity) openStudio(s.studio.activity, s.studio.back);   // 2.1: begin at once
            else nav.go(n + 1);
          });
      });
    });
    /* a gallery: previous / next (buttons, arrow keys, a swipe); only its image and counter change */
    var swiped = 0;
    function zoomOn(b) {
      b.addEventListener('click', function () {
        if (Date.now() - swiped < 500) return;
        var it = zooms[+b.getAttribute('data-zoom')];
        window.Viewer.open({ src: b.querySelector('img').getAttribute('src'), alt: I.tx(it.alt), ratio: ratio(it), caption: it.artist ? captionText(it) : '', from: b });
      });
    }
    root.querySelectorAll('.pl-gallery').forEach(function (box) {
      var g = box.getAttribute('data-gallery'), items = L.galleries[g], rtl = I.dir() === 'rtl';
      function preload(i) { var it = items[((i % items.length) + items.length) % items.length]; if (it.img) new Image().src = src(it.img); }
      function move(d) {
        run.seen = run.seen || {};
        var i = ((seenOf(run, L, g) + d) % items.length + items.length) % items.length;
        run.seen[g] = i;
        box.querySelector('.pl-gal-fig').innerHTML = galPicture(items[i]) + caption(items[i]);
        box.querySelector('.pl-gal-count').innerHTML = counterOf(i, items.length);
        box.querySelectorAll('.pl-zoom').forEach(zoomOn);
        box.querySelectorAll('.pl-gal-fig img').forEach(function (im) { if (!im.complete) im.addEventListener('load', cue); });
        preload(i + d); keep(); cue();
      }
      box.querySelectorAll('.pl-gal-btn').forEach(function (b) { b.addEventListener('click', function () { move(+b.getAttribute('data-step')); }); });
      box.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault(); move((e.key === 'ArrowRight') !== rtl ? 1 : -1);
      });
      var x0 = null, fig = box.querySelector('.pl-gal-fig');
      fig.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
      fig.addEventListener('pointerup', function (e) {
        if (x0 === null) return; var dx = e.clientX - x0; x0 = null;
        if (Math.abs(dx) > 40) { swiped = Date.now(); move((dx < 0) !== rtl ? 1 : -1); }   // towards the next one: left in LTR, right in RTL
      });
      preload(seenOf(run, L, g) + 1); preload(seenOf(run, L, g) - 1);
    });
    /* an image, large: the whole image, its caption; closing comes back here, where it was (a swipe is not a tap) */
    root.querySelectorAll('.pl-zoom').forEach(zoomOn);
    /* the bottom of the screen: when the words or images go on below it, a soft edge over "Continue" says so */
    var main = root.querySelector('.pl-main'), foot = root.querySelector('.pl-foot');
    function cue() { if (foot && main) foot.classList.toggle('pl-lift', main.scrollHeight - main.scrollTop - main.clientHeight > 6); }
    if (main) {
      main.addEventListener('scroll', cue, { passive: true });
      main.querySelectorAll('img').forEach(function (im) { if (!im.complete) im.addEventListener('load', cue); });
      if (window.ResizeObserver) new ResizeObserver(cue).observe(main);
      cue();
    }
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
