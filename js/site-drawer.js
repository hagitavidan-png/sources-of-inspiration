/* ═══════════════════════════════════════════════════════════
   Site contents drawer
   Builds the units and lessons from window.ART_NAVIGATION
   (js/navigation-data.js), so there is one source of truth.

   Units are an accordion: all closed, except the unit you are in.
   The page you are on is marked (lesson pages: window.LESSON_PAGE.path;
   unit pages: <body data-unit="unit01">), and the drawer scrolls to it.

   Usage: <script src="js/site-drawer.js" data-base=""></script>
   data-base is the path prefix back to the site root
   ("" from the root, "../" from a sub folder).
   ═══════════════════════════════════════════════════════════ */
(function () {
  var script = document.currentScript;
  var BASE = (script && script.getAttribute('data-base')) || '';

  /* lessons that already have a page in the new lesson template (data/lesson-pages/index.js) */
  var LESSON_PAGES = window.LESSON_PAGES_INDEX || {};
  /* each unit has its own page: units/unit-00.html … units/unit-06.html */
  function unitPage(id) { return 'units/unit-' + id.replace('unit', '') + '.html'; }

  var UI = {
    he: { open: 'תוכן', title: 'תוכן האתר', close: 'סגירה', soon: 'בפיתוח', unitPage: 'עמוד היחידה', here: 'את כאן', hereUnit: 'את כאן' },
    en: { open: 'Contents', title: 'Contents', close: 'Close', soon: 'In development', unitPage: 'Unit page', here: 'You are here', hereUnit: 'You are here' }
  };

  function lang() { return document.documentElement.lang === 'he' ? 'he' : 'en'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* where am I? */
  var here = { unit: null, lesson: null };
  (function locate() {
    var nav = window.ART_NAVIGATION;
    var lp = window.LESSON_PAGE && window.LESSON_PAGE.path;
    if (lp && nav) {
      nav.units.forEach(function (u) {
        (u.lessons || []).forEach(function (l) { if (l.path === lp) { here.unit = u.id; here.lesson = lp; } });
      });
    }
    if (!here.unit && document.body) here.unit = document.body.getAttribute('data-unit') || null;
  })();

  var btn, scrim, drawer, lastFocus;
  var openUnits = {};
  if (here.unit) openUnits[here.unit] = true;

  function build() {
    var L = lang(), t = UI[L], nav = window.ART_NAVIGATION;
    btn.querySelector('span').textContent = t.open;
    btn.setAttribute('aria-label', t.title);
    drawer.setAttribute('aria-label', t.title);
    drawer.querySelector('header b').textContent = t.title;
    drawer.querySelector('.x').setAttribute('aria-label', t.close);
    if (!nav || !nav.units) return;
    var html = '';
    nav.units.forEach(function (u) {
      var num = u.id.replace('unit', '');
      var n = parseInt(num, 10);
      var isHere = u.id === here.unit;
      var isOpen = !!openUnits[u.id];
      var pid = 'ed-acc-' + u.id;
      html += '<div class="ed-unit' + (isHere ? ' is-here' : '') + '">' +
        '<h3><button type="button" class="ed-acc" aria-expanded="' + isOpen + '" aria-controls="' + pid + '" data-unit="' + u.id + '">' +
        '<span class="ed-acc-n">' + num + '</span><span class="ed-acc-t">' + esc(u.title[L]) + '</span>' +
        '<svg class="ed-acc-i" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4.5l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>' +
        '</button></h3>' +
        '<div class="ed-panel" id="' + pid + '"' + (isOpen ? '' : ' hidden') + '>';
      var onUnitPage = isHere && !here.lesson;
      html += '<a class="ed-unit-link' + (onUnitPage ? ' is-current' : '') + '" href="' + BASE + unitPage(u.id) + '"' + (onUnitPage ? ' aria-current="page"' : '') + '>' +
        esc(t.unitPage) + (onUnitPage ? ' <span class="ed-now">' + esc(t.hereUnit) + '</span>' : '') + '</a>';
      if (u.lessons && u.lessons.length) {
        html += '<ol>';
        u.lessons.forEach(function (l, k) {
          var cur = l.path === here.lesson;
          html += '<li><a href="' + BASE + (LESSON_PAGES[l.path] || l.path) + '"' + (cur ? ' class="is-current" aria-current="page"' : '') + '>' +
            '<span class="ed-ln">' + n + '.' + (k + 1) + '</span>' +
            '<span class="ed-lt">' + esc(((window.LESSON_TITLES || {})[l.path] || l.title)[L]) + (cur ? '<span class="ed-now">' + esc(t.here) + '</span>' : '') + '</span>' +
            '</a></li>';
        });
        html += '</ol>';
      } else {
        html += '<p class="soon">' + t.soon + '</p>';
      }
      html += '</div></div>';
    });
    drawer.querySelector('nav').innerHTML = html;
  }

  function toggle(b) {
    var id = b.getAttribute('data-unit');
    var panel = document.getElementById(b.getAttribute('aria-controls'));
    var on = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', on ? 'true' : 'false');
    if (on) panel.removeAttribute('hidden'); else panel.setAttribute('hidden', '');
    openUnits[id] = on;
  }

  /* bring the current lesson (or unit) into view inside the drawer */
  function revealCurrent() {
    var nav = drawer.querySelector('nav');
    var el = nav.querySelector('.is-current') || nav.querySelector('.is-here .ed-acc');
    if (!el) return;
    var nr = nav.getBoundingClientRect(), er = el.getBoundingClientRect();
    if (er.top < nr.top || er.bottom > nr.bottom) {
      nav.scrollTop += (er.top - nr.top) - (nav.clientHeight - er.height) / 2;
    }
  }

  function open() {
    lastFocus = document.activeElement;
    document.body.classList.add('ed-open');
    btn.setAttribute('aria-expanded', 'true');
    revealCurrent();
    setTimeout(function () { drawer.querySelector('.x').focus(); revealCurrent(); }, 60);
  }
  function close() {
    document.body.classList.remove('ed-open');
    btn.setAttribute('aria-expanded', 'false');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function init() {
    btn = document.createElement('button');
    btn.className = 'ed-toc-btn';
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'ed-drawer');
    btn.innerHTML = '<svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true"><path d="M0 1h16M0 6h16M0 11h10" stroke="currentColor" stroke-width="1.6"/></svg><span></span>';
    scrim = document.createElement('div');
    scrim.className = 'ed-scrim';
    drawer = document.createElement('aside');
    drawer.className = 'ed-drawer';
    drawer.id = 'ed-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.innerHTML = '<header><b></b><button class="x" type="button">×</button></header><nav></nav>';
    document.body.appendChild(btn);
    document.body.appendChild(scrim);
    document.body.appendChild(drawer);

    btn.addEventListener('click', open);
    scrim.addEventListener('click', close);
    drawer.querySelector('.x').addEventListener('click', close);
    drawer.addEventListener('click', function (e) {
      var acc = e.target.closest('.ed-acc');
      if (acc) { toggle(acc); return; }
      if (e.target.closest('a')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('ed-open')) close();
    });
    document.querySelectorAll('[data-open-contents]').forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); open(); });
    });

    /* on small screens the button steps aside while the previous / next links are in view */
    var pager = document.querySelector('.unit-nav');
    if (pager && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { btn.classList.toggle('is-tucked', e.isIntersecting); });
      }).observe(pager);
    }

    build();
    /* rebuild when the site language changes (open units are kept) */
    if (typeof window.setLang === 'function') {
      var orig = window.setLang;
      window.setLang = function (l) { orig(l); build(); };
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
