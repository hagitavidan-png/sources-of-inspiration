/*! Sources of Inspiration in Art | מקורות השראה באמנות. Original code and content (c) 2026 Hagit Avidan | חגית אבידן. All rights reserved | כל הזכויות שמורות. Works and materials by others belong to their owners | יצירות וחומרים של אחרים שייכים לבעליהם. See NOTICE.txt */
(function () {
try {
var s = localStorage.getItem('sourcesTheme');
if (s === 'light') document.body.classList.remove('dark');
else document.body.classList.add('dark');
} catch (e) {
document.body.classList.add('dark');
}
})();
function _savedSiteLanguage() {
try {
var saved = localStorage.getItem('sourcesLang');
return saved === 'he' || saved === 'en' ? saved : 'en';
} catch (e) { return 'en'; }
}
(function () {
try {
document.body.classList.add('lang-loading');
var l = _savedSiteLanguage();
document.documentElement.lang = l;
document.documentElement.dir = l === 'he' ? 'rtl' : 'ltr';
var style = document.createElement('style');
style.id = 'lang-loading-style';
style.textContent = 'body.lang-loading{visibility:hidden!important}';
document.head.appendChild(style);
} catch (e) {
document.body.classList.remove('lang-loading');
}
})();
function toggleTheme() {
var isDark = document.body.classList.toggle('dark');
try { localStorage.setItem('sourcesTheme', isDark ? 'dark' : 'light'); } catch (e) {}
_syncThemeBtn();
}
function _syncThemeBtn() {
var isDark = document.body.classList.contains('dark');
var btn = document.getElementById('theme-toggle');
if (btn) btn.textContent = isDark ? '☀️' : '🌙';
}
document.addEventListener('DOMContentLoaded', _syncThemeBtn);
var currentLang = _savedSiteLanguage();
function setLang(l) {
currentLang = l;
try { localStorage.setItem('sourcesLang', l); } catch (e) {}
document.documentElement.lang = l;
document.documentElement.dir = l === 'he' ? 'rtl' : 'ltr';
['btn-en', 'mob-btn-en'].forEach(function (id) {
var el = document.getElementById(id);
if (!el) return;
el.classList.toggle('active', l === 'en');
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
document.querySelectorAll('[data-en],[data-he]').forEach(function (el) {
var val = el.getAttribute('data-' + l);
if (val !== null) el.innerHTML = val;
});
}
document.addEventListener('DOMContentLoaded', function () {
setLang(currentLang);
_syncThemeBtn();
document.body.classList.remove('lang-loading');
});
