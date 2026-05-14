/**
 * app-init.js — Shared initialisation for Sources of Inspiration
 *
 * Responsibilities:
 *   1. Flash-free dark-mode bootstrap  (runs immediately on <script> parse)
 *   2. Flash-free language bootstrap   (runs immediately on <script> parse)
 *   3. toggleTheme()  — called by the ☀️/🌙 button in every page
 *   4. Language bootstrap  (currentLang, setLang, RTL/dir, data-en/data-he swap)
 *
 * Rules:
 *   - No DOM queries that require the full document to be loaded go here
 *     (those stay at the bottom of each page's own <script>).
 *   - Everything that MUST run before first paint goes at the TOP of this file.
 *   - Everything else is exposed as globals so each page can call it.
 */

/* ─────────────────────────────────────────────────────────────────────────────
   1.  DARK MODE — flash prevention
   Runs immediately when the browser parses this <script> tag.
   `<body class="dark">` is the HTML default; we only REMOVE it for explicit
   'light' saves. Any other state (null, missing, LS-blocked) → stays dark.
────────────────────────────────────────────────────────────────────────────── */
(function () {
  try {
    var s = localStorage.getItem('sourcesTheme');
    if (s === 'light') document.body.classList.remove('dark');
    else               document.body.classList.add('dark');
  } catch (e) {
    document.body.classList.add('dark');
  }
})();

/* ─────────────────────────────────────────────────────────────────────────────
   2.  LANGUAGE FLASH PREVENTION
   Runs immediately on <script> parse — before any HTML is rendered.
   Steps:
     a. Hide body instantly (visibility:hidden) so English default never shows.
     b. Read saved lang from localStorage (default: 'he').
     c. Set <html lang> and dir immediately so layout is correct from first paint.
     d. Add CSS rule for lang-loading to the document.
   The body is revealed only after setLang() completes on DOMContentLoaded.
   Default language is HEBREW (not English) when localStorage is empty.
────────────────────────────────────────────────────────────────────────────── */
(function () {
  try {
    /* Hide body immediately — no flash of wrong language */
    document.body.classList.add('lang-loading');

    /* Read saved lang; default is English */
    var l = localStorage.getItem('sourcesLang') || 'en';

    /* Set html attributes immediately — before any paint */
    document.documentElement.lang = l;
    document.documentElement.dir  = l === 'he' ? 'rtl' : 'ltr';

    /* Inject the hiding rule once into <head> so it applies globally */
    var style = document.createElement('style');
    style.id  = 'lang-loading-style';
    style.textContent = 'body.lang-loading{visibility:hidden!important}';
    document.head.appendChild(style);
  } catch (e) {
    /* If anything fails, ensure body is still visible */
    document.body.classList.remove('lang-loading');
  }
})();


/* ─────────────────────────────────────────────────────────────────────────────
   2.  THEME TOGGLE
   Called by onclick="toggleTheme()" on the ☀️/🌙 button in every page.
   Updates localStorage, the body class, and the button text.
────────────────────────────────────────────────────────────────────────────── */
function toggleTheme() {
  var isDark = document.body.classList.toggle('dark');
  try { localStorage.setItem('sourcesTheme', isDark ? 'dark' : 'light'); } catch (e) {}
  _syncThemeBtn();
}

/** Update the toggle button icon to match the current state. */
function _syncThemeBtn() {
  var isDark = document.body.classList.contains('dark');
  var btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = isDark ? '☀️' : '🌙';
}

/* Sync the toggle icon once the DOM element is ready.
   Each page calls _syncThemeBtn() after its own <script> block executes,
   but we also call it here so pages that load fast get it immediately. */
document.addEventListener('DOMContentLoaded', _syncThemeBtn);


/* ─────────────────────────────────────────────────────────────────────────────
   3.  LANGUAGE SYSTEM
   currentLang  — module-level variable; pages read/write it via setLang().
   setLang(l)   — sets lang/dir on <html>, highlights active button,
                  swaps every [data-en] / [data-he] element's innerHTML.
────────────────────────────────────────────────────────────────────────────── */

/** Reads saved language; defaults to English. */
var currentLang = (function () {
  try { return localStorage.getItem('sourcesLang') || 'en'; } catch (e) { return 'en'; }
})();

/**
 * Set the site language.
 * @param {string} l  'en' or 'he'
 */
function setLang(l) {
  currentLang = l;
  try { localStorage.setItem('sourcesLang', l); } catch (e) {}

  /* HTML dir + lang attribute */
  document.documentElement.lang = l;
  document.documentElement.dir  = l === 'he' ? 'rtl' : 'ltr';

  /* ── Active-state: CSS classes only — NO inline styles ──
     CSS handles all colors including dark-mode. JS only toggles .active. */
  ['btn-en', 'mob-btn-en'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('active', l === 'en');
    /* clear any old inline styles that may have been set by previous versions */
    el.style.removeProperty('background');
    el.style.removeProperty('border-color');
    el.style.removeProperty('color');
  });

  ['btn-he', 'mob-btn-he'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('active', l === 'he');
    el.style.removeProperty('background');
    el.style.removeProperty('border-color');
    el.style.removeProperty('color');
  });

  /* NOTE: flex-direction for RTL lang-toggle is handled by CSS [dir=rtl] rules.
     Setting it here via inline style caused the inactive button to be pushed
     off-screen in Hebrew mode. CSS handles this correctly without JS override. */

  /* ── Swap data-en / data-he content across the whole document ── */
  document.querySelectorAll('[data-en],[data-he]').forEach(function (el) {
    var val = el.getAttribute('data-' + l);
    if (val !== null) el.innerHTML = val;
  });
}

/* Apply the saved (or default) language immediately so the first render
   shows the correct text without a flash.
   After setLang() completes, remove lang-loading to reveal the page. */
document.addEventListener('DOMContentLoaded', function () {
  setLang(currentLang);
  _syncThemeBtn();
  /* Reveal body — language is now applied, no flash possible */
  document.body.classList.remove('lang-loading');
});
