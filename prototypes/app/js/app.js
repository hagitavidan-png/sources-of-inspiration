/* The app prototype: Home → Units → Unit → Lesson → Lesson Player, one screen at a time, by the address's #route.
   Units, lessons and what is open come from the site (js/site-nav.js: ART_NAVIGATION, SITE_STATUS); a unit's
   description and cover from content/units/unit-NN.json. A lesson opens in the player when it is listed in
   window.APP_LESSONS; any other open lesson stays on the site.
   My artworks (#/gallery): the learner's artworks (js/artworks.js), one card each; see gallery() below. */
(function () {
  'use strict';
  var I = window.I18N, NAV = window.ART_NAVIGATION || { units: [] }, STATUS = window.SITE_STATUS || { units: [], lessons: [] };
  var root = document.getElementById('app');
  var SITE = '../../';
  /* a lesson the app plays that the site's navigation does not list yet (lessons/<id>.js nav): in its unit, open, in
     the app only (js/site-nav.js is generated for the whole site and stays as it is) */
  Object.keys(window.APP_LESSONS || {}).forEach(function (id) {
    var n = window.APP_LESSONS[id].nav, u = n && NAV.units.filter(function (x) { return x.id === n.unit; })[0];
    if (!u || u.lessons.some(function (l) { return l.path === n.path; })) return;
    u.lessons.push({ path: n.path, title: n.title });
    if (STATUS.units.indexOf(u.id) < 0) STATUS.units.push(u.id);
    if (STATUS.lessons.indexOf(n.path) < 0) STATUS.lessons.push(n.path);
  });

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }
  function unitNum(u) { return u.id.replace('unit', ''); }
  function lessonId(path) { return (path.match(/lesson-(\d+)-(\d+)\.html$/) || []).slice(1).join('-'); }
  /* a lesson the app plays, in the current language (lessons/<id>.js langs: the languages its flow has) */
  function inApp(id) { var L = window.APP_LESSONS[id]; return !!L && (!L.langs || L.langs.indexOf(I.lang()) >= 0); }
  var BACK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';

  /* the frame of the screens outside the player: back, a title, the language */
  function frame(title, back, body) {
    root.className = 'app shell';
    root.innerHTML = '<header class="sh-top">' +
      (back ? '<a class="pl-back" href="' + back + '" aria-label="' + esc(I.ui('back')) + '">' + BACK + '</a>' : '<span class="sh-gap"></span>') +
      '<h1 class="sh-title">' + title + '</h1>' +
      '<div class="sh-lang">' + I.offered.map(function (l) { return '<button type="button" data-lang="' + l + '" aria-pressed="' + (I.lang() === l) + '">' + I.name[l] + '</button>'; }).join('') + '</div>' +
      '</header><main class="sh-main" tabindex="-1">' + body + '</main>';
    root.querySelectorAll('[data-lang]').forEach(function (b) { b.addEventListener('click', function () { I.set(b.getAttribute('data-lang')); route(); }); });
    root.querySelector('.sh-main').focus({ preventScroll: true });
  }

  function home() {
    frame('', null, '<div class="sh-home"><p class="sh-brand">' + esc(I.ui('site')) + '</p>' +
      '<a class="sh-primary" href="#/units">' + esc(I.ui('units')) + '</a>' +
      '<a class="sh-secondary" href="#/gallery">' + esc(I.ui('gallery')) + '</a></div>');
  }

  function unitStatus(u) {
    if (STATUS.units.indexOf(u.id) < 0) return I.ui('soon');
    var open = u.lessons.filter(function (l) { return STATUS.lessons.indexOf(l.path) >= 0; }).length;
    if (open === 1 && u.lessons.length === 1) return I.ui('oneOpenOnly');
    return open === 1 ? I.ui('oneOpen', { n: u.lessons.length - 1 }) : I.ui('soon');
  }
  function units() {
    frame(esc(I.ui('units')), '#/home', '<ol class="sh-list">' + NAV.units.map(function (u) {
      var open = STATUS.units.indexOf(u.id) >= 0, played = u.lessons.some(function (l) { return window.APP_LESSONS[lessonId(l.path)]; });   // the unit stays in the app in every language
      var href = !open ? null : played ? '#/unit/' + unitNum(u) : SITE + 'units/unit-' + unitNum(u) + '.html';
      var inner = '<span class="sh-n">' + unitNum(u) + '</span><span class="sh-t">' + esc(I.tx(u.title)) + '<small>' + esc(unitStatus(u)) + '</small></span>';
      return '<li>' + (href ? '<a class="sh-item" href="' + href + '">' + inner + '</a>' : '<span class="sh-item off">' + inner + '</span>') + '</li>';
    }).join('') + '</ol>');
  }

  function unit(num) {
    var u = NAV.units.filter(function (x) { return unitNum(x) === num; })[0];
    if (!u) return go('#/units');
    var list = '<ol class="sh-list">' + u.lessons.map(function (l, k) {
      var id = lessonId(l.path), open = STATUS.lessons.indexOf(l.path) >= 0;
      var href = open ? (inApp(id) ? '#/lesson/' + id : SITE + 'lesson-pages/' + l.path.split('/').pop()) : null;
      var inner = '<span class="sh-n">' + (+num) + '.' + (k + 1) + '</span><span class="sh-t">' + esc(I.tx(l.title)) + (open ? '' : '<small>' + esc(I.ui('soon')) + '</small>') + '</span>';
      return '<li>' + (href ? '<a class="sh-item" href="' + href + '">' + inner + '</a>' : '<span class="sh-item off">' + inner + '</span>') + '</li>';
    }).join('') + '</ol>';
    frame(esc(I.ui('unit')) + ' ' + num, '#/units', '<div class="sh-unit"><figure class="sh-cover" hidden></figure><h2 class="sh-h">' + esc(I.tx(u.title)) + '</h2><p class="sh-desc"></p></div>' + list);
    /* the unit's description and cover, from the unit's own file */
    fetch(SITE + 'content/units/unit-' + num + '.json').then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (!j || !root.querySelector('.sh-unit')) return;
      root.querySelector('.sh-desc').innerHTML = I.tx(j.desc);
      if (j.cover && (j.cover.wide || j.cover.img)) {
        var f = root.querySelector('.sh-cover');
        f.innerHTML = '<img src="' + SITE + 'images/editorial/' + esc(j.cover.wide || j.cover.img) + '.jpg" alt="" style="object-position:' + esc(j.cover.pos || '50% 50%') + '">' + (j.cover.cap ? '<figcaption>' + esc(I.tx(j.cover.cap)) + '</figcaption>' : '');
        f.hidden = false;
      }
    }).catch(function () {});
  }

  /* a lesson's content, loaded once */
  var loaded = {};
  function withLesson(id, then) {
    var L = window.APP_LESSONS[id];
    if (!L) return go('#/units');
    if (!inApp(id)) return go('#/unit/' + L.unit.replace('unit', ''));   // not in this language: the unit, which links to the site
    if (L.page) loaded[id] = L.page;   // a lesson whose content is in its own file (lessons/<id>.js page)
    if (loaded[id]) { window.LESSON_PAGE = loaded[id]; return then(L); }
    var s = document.createElement('script');
    s.src = L.data;
    s.onload = function () { loaded[id] = window.LESSON_PAGE; then(L); };
    document.body.appendChild(s);
  }

  function lessonIntro(id) {
    withLesson(id, function (L) {
      var A = window.AppAdapters[L.adapter](window.LESSON_PAGE), d = A.lesson;
      frame(esc(I.ui('lesson')) + ' ' + esc(d.number), '#/unit/' + d.unitNum, '<div class="sh-lesson">' +
        '<p class="sh-kicker">' + esc(I.ui('unit')) + ' ' + esc(d.unitNum) + ' · ' + esc(I.tx(d.unit)) + '</p>' +
        '<h2 class="sh-h big">' + esc(I.tx(d.title)) + '</h2>' +
        '<p class="sh-time">' + esc(I.tx(d.time)) + '</p>' +
        '<a class="sh-primary" href="#/lesson/' + id + '/play/1">' + esc(I.ui('continue')) + '</a></div>');
      /* "Continue": where the learner was; a new artwork (a new run), once the current one has begun: the earlier
         run and its artwork stay */
      window.Player.run(id).then(function (r) {
        var box = root.querySelector('.sh-lesson');
        if (!box) return;
        if (r.screen) box.querySelector('.sh-primary').setAttribute('href', '#/lesson/' + id + '/play/' + r.screen);
        if (!(r.medium || r.begun || r.done)) return;
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'sh-secondary'; b.textContent = I.ui('newArtwork');
        b.addEventListener('click', function () { b.disabled = true; window.Artworks.newRun(id).then(function () { go('#/lesson/' + id + '/play/1'); }); });
        box.appendChild(b);
      });
    });
  }

  /* the lesson of an artwork, as the site names it: "2.1" and its title (in the current language) */
  function lessonOf(id) {
    var r = null;
    NAV.units.forEach(function (u) { u.lessons.forEach(function (l, k) { if (lessonId(l.path) === id) r = { num: (+unitNum(u)) + '.' + (k + 1), title: I.tx(l.title) }; }); });
    return r;
  }
  var LOCALE = { he: 'he-IL', en: 'en-GB' };
  function day(iso) { try { return new Date(iso).toLocaleDateString(LOCALE[I.lang()] || I.lang(), { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return ''; } }

  /* My artworks: one card per artwork, the one worked on last first (updatedAt). Only read: nothing is written here.
     - an artwork of a lesson run (js/artworks.js runs) is the learner's: digital once something is made in it (its
       operations and picture), paper always (nothing tells whether the page has been worked on);
     - the earlier prototype's works (copied in once; two works of one attempt) are one card, to look at only: its
       later work's picture, the attempt's lesson. Neither the attempt nor its two works are named to the learner.
     An artwork of a run is never taken as an earlier work. "Continue developing" opens the same artwork in the
     lesson's artworkActivity (lessons/<id>.js), never in the activity it was last saved in; paper never opens the
     Studio. */
  function cardsOf(works, runs, attempts) {
    var byId = {}, inRun = {}, used = {}, cards = [];
    works.forEach(function (w) { byId[w.id] = w; });
    runs.forEach(function (r) { if (r.artwork) inRun[r.artwork] = true; });
    attempts.forEach(function (a) {
      var pair = [a.v1, a.v2].filter(function (id) { return id && byId[id] && !inRun[id] && !used[id]; });
      pair.forEach(function (id) { used[id] = true; });
      var shown = pair.map(function (id) { return byId[id]; }).filter(function (w) { return w.preview; });
      if (!shown.length) return;
      cards.push({ kind: 'earlier', w: shown[shown.length - 1], lesson: a.lesson,
        at: shown.reduce(function (m, w) { return w.updatedAt > m ? w.updatedAt : m; }, ''), created: shown[0].createdAt });
    });
    works.forEach(function (w) {
      if (used[w.id]) return;
      var made = !!(w.ops && w.ops.length && w.preview);
      if (inRun[w.id] && w.medium === 'paper') cards.push({ kind: 'paper', w: w, lesson: w.lesson });
      else if (inRun[w.id] && made) cards.push({ kind: 'digital', w: w, lesson: w.lesson });
      else if (!inRun[w.id] && w.medium !== 'paper' && w.preview) cards.push({ kind: 'earlier', w: w, lesson: w.lesson });
    });
    cards.forEach(function (c) { c.at = c.at || c.w.updatedAt || ''; c.created = c.created || c.w.createdAt || ''; });
    return cards.sort(function (a, b) { return a.at !== b.at ? (a.at < b.at ? 1 : -1) : a.created < b.created ? 1 : a.created > b.created ? -1 : 0; });
  }
  var PAPER = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9 13l6-6"/></svg>';
  function gallery() {
    frame(esc(I.ui('gallery')), '#/home', '<div class="ga"></div>');
    var W = window.Artworks;
    Promise.all([W.list(), W.runs(), W.attempts()]).then(function (r) {
      var box = root.querySelector('.ga');
      if (!box) return;
      var cards = cardsOf(r[0], r[1], r[2]);
      if (!cards.length) {
        box.innerHTML = '<div class="ga-empty"><p>' + esc(I.ui('artworksEmpty')) + '</p><a class="sh-primary" href="#/units">' + esc(I.ui('artworksStart')) + '</a></div>';
        return;
      }
      var back = encodeURIComponent('../index.html#/gallery');
      box.innerHTML = '<ol class="ga-list">' + cards.map(function (c, i) {
        var w = c.w, L = c.lesson && lessonOf(c.lesson), line = L ? I.ui('lesson') + ' ' + L.num + ' · ' + L.title : '';
        var alt = line ? I.ui('artworkAlt', { lesson: line }) : I.ui('artworkAlt', { lesson: '' }).replace(/\s*·\s*$/, '');
        var ids = [], head = '', action = '', act = c.kind === 'digital' && c.lesson && window.APP_LESSONS[c.lesson] && window.APP_LESSONS[c.lesson].artworkActivity;
        if (c.kind === 'paper') { head += '<p class="ga-kind" id="ga-k' + i + '">' + esc(I.ui('onPaper')) + '</p>'; ids.push('ga-k' + i); }
        if (line) { head += '<h2 class="ga-h" id="ga-h' + i + '">' + esc(line) + '</h2>'; ids.push('ga-h' + i); }
        head += '<p class="ga-date" id="ga-d' + i + '">' + esc(I.ui('lastWorked', { date: day(c.at) })) + '</p>';
        if (!ids.length) ids.push('ga-d' + i);
        var about = ids.concat(ids.indexOf('ga-d' + i) < 0 ? ['ga-d' + i] : []).join(' ');
        if (act) action = '<a class="ga-action main" href="studio/index.html?activity=' + encodeURIComponent(act) + '&amp;art=' + encodeURIComponent(w.id) + '&amp;ctx=gallery&amp;back=' + back + '" aria-describedby="' + about + '">' + esc(I.ui('continueDeveloping')) + '</a>';
        if (c.kind === 'paper' && c.lesson && window.APP_LESSONS[c.lesson]) action = '<a class="ga-action" href="#/lesson/' + esc(c.lesson) + '" aria-describedby="' + about + '">' + esc(I.ui('backToLesson')) + '</a>';
        if (c.kind === 'earlier') action = '<button type="button" class="ga-action" data-view="' + i + '" aria-describedby="' + about + '">' + esc(I.ui('viewArtwork')) + '</button>';
        var pic = c.kind === 'paper' ? '<div class="ga-pic ga-blank">' + PAPER + '</div>' : '<figure class="ga-pic"><img src="' + w.preview + '" alt="' + esc(alt) + '"></figure>';
        return '<li><article class="ga-card ga-' + c.kind + '" aria-labelledby="' + ids.join(' ') + '">' + pic + '<div class="ga-text">' + head + '</div>' + action + '</article></li>';
      }).join('') + '</ol>';
      /* an earlier work: its picture, large; only to look at (js/viewer.js) */
      box.querySelectorAll('[data-view]').forEach(function (b) {
        b.addEventListener('click', function () {
          var img = b.closest('.ga-card').querySelector('.ga-pic img');
          window.Viewer.open({ src: img.src, alt: img.alt, ratio: img.naturalWidth && img.naturalHeight ? (img.naturalWidth / img.naturalHeight).toFixed(4) : null, from: b });
        });
      });
    });
  }

  function play(id, n) {
    withLesson(id, function (L) {
      n = Math.max(1, Math.min(L.screens.length, n | 0 || 1));
      window.Player.render(root, id, n, {
        go: function (k) { go('#/lesson/' + id + '/play/' + k); },
        exit: function () { go('#/lesson/' + id); },
        finish: function () { go('#/unit/' + window.AppAdapters[L.adapter](window.LESSON_PAGE).lesson.unitNum); },
        studio: function (href) { location.href = href; }
      });
    });
  }

  function route() {
    var h = location.hash.replace(/^#\/?/, '').split('/');
    if (h[0] === 'units') units();
    else if (h[0] === 'gallery') gallery();
    else if (h[0] === 'unit' && h[1]) unit(h[1]);
    else if (h[0] === 'lesson' && h[1] && h[2] === 'play') play(h[1], +h[3]);
    else if (h[0] === 'lesson' && h[1]) lessonIntro(h[1]);
    else home();
  }
  window.addEventListener('hashchange', route);
  route();
})();
