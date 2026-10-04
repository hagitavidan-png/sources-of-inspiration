/* The app prototype: Home → Units → Unit → Lesson → Lesson Player, one screen at a time, by the address's #route.
   Units, lessons and what is open come from the site (js/site-nav.js: ART_NAVIGATION, SITE_STATUS); a unit's
   description and cover from content/units/unit-NN.json. A lesson opens in the player when it is listed in
   window.APP_LESSONS; any other open lesson stays on the site. */
(function () {
  'use strict';
  var I = window.I18N, NAV = window.ART_NAVIGATION || { units: [] }, STATUS = window.SITE_STATUS || { units: [], lessons: [] };
  var root = document.getElementById('app');
  var SITE = '../../';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }
  function unitNum(u) { return u.id.replace('unit', ''); }
  function lessonId(path) { return (path.match(/lesson-(\d+)-(\d+)\.html$/) || []).slice(1).join('-'); }
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
      '<a class="sh-primary" href="#/units">' + esc(I.ui('units')) + '</a></div>');
  }

  function unitStatus(u) {
    if (STATUS.units.indexOf(u.id) < 0) return I.ui('soon');
    var open = u.lessons.filter(function (l) { return STATUS.lessons.indexOf(l.path) >= 0; }).length;
    return open === 1 ? I.ui('oneOpen', { n: u.lessons.length - 1 }) : I.ui('soon');
  }
  function units() {
    frame(esc(I.ui('units')), '#/home', '<ol class="sh-list">' + NAV.units.map(function (u) {
      var open = STATUS.units.indexOf(u.id) >= 0, inApp = u.lessons.some(function (l) { return window.APP_LESSONS[lessonId(l.path)]; });
      var href = !open ? null : inApp ? '#/unit/' + unitNum(u) : SITE + 'units/unit-' + unitNum(u) + '.html';
      var inner = '<span class="sh-n">' + unitNum(u) + '</span><span class="sh-t">' + esc(I.tx(u.title)) + '<small>' + esc(unitStatus(u)) + '</small></span>';
      return '<li>' + (href ? '<a class="sh-item" href="' + href + '">' + inner + '</a>' : '<span class="sh-item off">' + inner + '</span>') + '</li>';
    }).join('') + '</ol>');
  }

  function unit(num) {
    var u = NAV.units.filter(function (x) { return unitNum(x) === num; })[0];
    if (!u) return go('#/units');
    var list = '<ol class="sh-list">' + u.lessons.map(function (l, k) {
      var id = lessonId(l.path), open = STATUS.lessons.indexOf(l.path) >= 0;
      var href = open ? (window.APP_LESSONS[id] ? '#/lesson/' + id : SITE + 'lesson-pages/' + l.path.split('/').pop()) : null;
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
    else if (h[0] === 'unit' && h[1]) unit(h[1]);
    else if (h[0] === 'lesson' && h[1] && h[2] === 'play') play(h[1], +h[3]);
    else if (h[0] === 'lesson' && h[1]) lessonIntro(h[1]);
    else home();
  }
  window.addEventListener('hashchange', route);
  route();
})();
