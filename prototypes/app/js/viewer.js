/*! Sources of Inspiration in Art | מקורות השראה באמנות. Original code and content (c) 2026 Hagit Avidan | חגית אבידן. All rights reserved | כל הזכויות שמורות. Works and materials by others belong to their owners | יצירות וחומרים של אחרים שייכים לבעליהם. See NOTICE.txt */
window.Viewer = (function () {
'use strict';
var I = window.I18N, dlg = null, opener = null, ours = false, list = [], at = 0, grid = null, onshow = null;
var PREV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>', NEXT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
function make() {
if (dlg) return dlg;
dlg = document.createElement('dialog');
dlg.className = 'ga-view';
dlg.innerHTML = '<img alt=""><div class="ga-view-win" hidden></div><div class="ga-view-cap"></div>' +
'<div class="ga-view-nav" hidden><button type="button" class="pl-gal-btn ga-prev">' + PREV + '</button><span class="pl-gal-count ga-view-count" aria-live="polite"></span>' +
'<button type="button" class="pl-gal-btn ga-next">' + NEXT + '</button></div>' +
'<h2 class="ga-view-h" hidden></h2><ul class="ga-view-grid" hidden></ul>' +
'<div class="ga-view-acts"><button type="button" class="ga-all" hidden></button><button type="button" class="ga-close"></button></div>' +
'<button type="button" class="ga-x" hidden>×</button>';
document.body.appendChild(dlg);
dlg.querySelector('.ga-close').addEventListener('click', function () { dlg.close(); });
dlg.querySelector('.ga-x').addEventListener('click', function () { dlg.close(); });
dlg.querySelector('.ga-all').addEventListener('click', function () { all(); });
dlg.querySelector('.ga-view-grid').addEventListener('click', function (e) {
var b = e.target.closest('[data-at]');
if (b) { at = +b.getAttribute('data-at'); one(); dlg.querySelector('.ga-all').focus(); }
});
dlg.querySelector('.ga-prev').addEventListener('click', function () { step(-1); });
dlg.querySelector('.ga-next').addEventListener('click', function () { step(1); });
dlg.addEventListener('keydown', function (e) {
if (list.length < 2 || dlg.classList.contains('is-grid') || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
e.preventDefault(); step((e.key === 'ArrowRight') !== (I.dir() === 'rtl') ? 1 : -1);
});
var x0 = null, img = dlg.querySelector('img');
img.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
img.addEventListener('pointerup', function (e) {
if (x0 === null || list.length < 2) return; var dx = e.clientX - x0; x0 = null;
if (Math.abs(dx) > 40) step((dx < 0) !== (I.dir() === 'rtl') ? 1 : -1);
});
dlg.addEventListener('click', function (e) {
if (e.target !== dlg) return;
var r = dlg.getBoundingClientRect();
if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dlg.close();
});
dlg.addEventListener('close', function () {
if (ours) { ours = false; history.back(); }
if (opener && opener.isConnected) opener.focus({ preventScroll: true });
opener = null;
});
window.addEventListener('popstate', function () { if (dlg.open) { ours = false; dlg.close(); } });
return dlg;
}
function show(o) {
var d = dlg, img = d.querySelector('img'), win = d.querySelector('.ga-view-win'), cap = d.querySelector('.ga-view-cap');
img.hidden = !o.src; win.hidden = !!o.src;
if (o.src) {
img.src = o.src; img.alt = o.alt || '';
if (o.ratio) img.style.setProperty('--r', o.ratio); else img.style.removeProperty('--r');
win.innerHTML = '';
} else { img.removeAttribute('src'); win.innerHTML = o.win || ''; }
cap.innerHTML = o.caption || ''; cap.hidden = !o.caption;
d.classList.toggle('has-cap', !!o.caption);
d.classList.toggle('has-note', !!o.note);
d.setAttribute('aria-label', o.alt || '');
var nav = d.querySelector('.ga-view-nav');
nav.hidden = list.length < 2;
if (list.length > 1) {
d.querySelector('.ga-view-count').innerHTML = '<span aria-hidden="true">' + (at + 1) + '/' + list.length + '</span><span class="pl-sr">' + I.ui('galleryCount', { n: at + 1, total: list.length }) + '</span>';
d.querySelector('.ga-prev').setAttribute('aria-label', I.ui('galleryPrev'));
d.querySelector('.ga-next').setAttribute('aria-label', I.ui('galleryNext'));
}
if (onshow) onshow(at);
}
function step(k) { at = ((at + k) % list.length + list.length) % list.length; show(list[at]); }
function parts(g) {
var d = dlg;
d.classList.toggle('is-grid', g);
if (g) { d.classList.remove('has-cap'); d.classList.remove('has-note'); }
d.querySelector('.ga-view-h').hidden = !g || !grid.title;
d.querySelector('.ga-view-grid').hidden = !g;
d.querySelector('.ga-all').hidden = g || !grid;
if (g) ['img', '.ga-view-win', '.ga-view-cap', '.ga-view-nav'].forEach(function (s) { d.querySelector(s).hidden = true; });
}
function all() {
parts(true);
dlg.setAttribute('aria-label', grid.title || '');
var t = dlg.querySelector('[data-at="' + at + '"]'); if (t) t.focus();
}
function one() { parts(false); show(list[at]); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function open(o) {
var d = make();
list = o.list || [o]; at = Math.max(0, Math.min(list.length - 1, o.at | 0)); grid = o.grid || null; onshow = o.onShow || null;
d.querySelector('.ga-close').textContent = I.ui('close');
d.classList.toggle('ga-view-big', !!o.big); var x = d.querySelector('.ga-x'); x.hidden = !o.big; x.setAttribute('aria-label', I.ui('close'));
d.querySelector('.ga-all').textContent = I.ui('allImages');
d.querySelector('.ga-view-h').textContent = grid && grid.title || '';
d.querySelector('.ga-view-grid').innerHTML = grid ? list.map(function (it, i) {
return '<li><button type="button" class="ga-cell" data-at="' + i + '" aria-label="' + esc(I.ui('enlarge', { what: it.alt })) + '"><img src="' + esc(it.src) + '" alt=""></button></li>';
}).join('') : '';
if (grid) all(); else one();
opener = o.from || document.activeElement;
d.showModal(); (grid ? d.querySelector('.ga-cell') || d.querySelector('.ga-close') : d.querySelector('.ga-close')).focus();
history.pushState({ viewer: true }, ''); ours = true;
}
return { open: open };
})();
