/* ═══════════════════════════════════════════════════════════
   Site contents drawer
   Builds the list of units and lessons from window.ART_NAVIGATION
   (js/navigation-data.js), so there is one source of truth.
   Usage: <script src="js/site-drawer.js" data-base=""></script>
   data-base is the path prefix back to the site root
   ("" from the root, "../" from /lessons/).
   ═══════════════════════════════════════════════════════════ */
(function () {
  var script = document.currentScript;
  var BASE = (script && script.getAttribute('data-base')) || '';

  /* each unit has its own page: units/unit-00.html … units/unit-06.html */
  function unitPage(id) { return 'units/unit-' + id.replace('unit', '') + '.html'; }

  var UI = {
    he: { open: 'תוכן', title: 'תוכן האתר', close: 'סגירה', soon: 'בפיתוח' },
    en: { open: 'Contents', title: 'Contents', close: 'Close', soon: 'In development' }
  };

  function lang() { return document.documentElement.lang === 'he' ? 'he' : 'en'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var btn, scrim, drawer, lastFocus;

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
      var href = BASE + unitPage(u.id);
      html += '<div class="ed-unit"><h3><span>' + num + '</span><a href="' + href + '">' + esc(u.title[L]) + '</a></h3>';
      if (u.lessons && u.lessons.length) {
        html += '<ol>';
        u.lessons.forEach(function (l) {
          html += '<li><a href="' + BASE + l.path + '">' + esc(l.title[L]) + '</a></li>';
        });
        html += '</ol>';
      } else {
        html += '<p class="soon">' + t.soon + '</p>';
      }
      html += '</div>';
    });
    drawer.querySelector('nav').innerHTML = html;
  }

  function open() {
    lastFocus = document.activeElement;
    document.body.classList.add('ed-open');
    btn.setAttribute('aria-expanded', 'true');
    setTimeout(function () { drawer.querySelector('.x').focus(); }, 50);
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
    drawer.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('ed-open')) close();
    });
    document.querySelectorAll('[data-open-contents]').forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); open(); });
    });

    build();
    /* rebuild when the site language changes */
    if (typeof window.setLang === 'function') {
      var orig = window.setLang;
      window.setLang = function (l) { orig(l); build(); };
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
