/*! Sources of Inspiration in Art | מקורות השראה באמנות. Original code and content (c) 2026 Hagit Avidan | חגית אבידן. All rights reserved | כל הזכויות שמורות. Works and materials by others belong to their owners | יצירות וחומרים של אחרים שייכים לבעליהם. See NOTICE.txt */
Studio.register('refs', {
strings: {
he: { refs: 'השראה', refsView: 'צפייה בהשראה', refsTitle: 'מקורות ההשראה', refsClose: 'חזרה ליצירה', refsAll: 'כל התמונות',
refsPrev: 'התמונה הקודמת', refsNext: 'התמונה הבאה', refsCount: 'תמונה {n} מתוך {total}', refsOpen: 'הגדלת התמונה: {what}' },
en: { refs: 'Inspiration', refsView: 'View inspiration', refsTitle: 'Sources of inspiration', refsClose: 'Back to my artwork', refsAll: 'All the images',
refsPrev: 'Previous image', refsNext: 'Next image', refsCount: 'Image {n} of {total}', refsOpen: 'Enlarge image: {what}' }
},
init: function (S) {
'use strict';
function eyeButton(onOpen) {
var b = document.createElement('button');
b.type = 'button'; b.className = 'refsbtn'; b.id = 'refs'; b.setAttribute('aria-label', S.T.refsView); b.title = S.T.refsView;
b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
'<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>';
b.addEventListener('click', onOpen);
b.addEventListener('contextmenu', function (e) { e.preventDefault(); Studio.shell.toast(S.T.refsView); });
return b;
}
var lesson = S.activity.content && S.activity.content.inspiration;
if (lesson && window.Inspiration) {
var ob = eyeButton(function () { S.closePanels(); window.Inspiration.open({ lesson: lesson, lang: S.lang, base: '../', from: ob, close: S.T.refsClose }); });
document.querySelector('.top').insertBefore(ob, S.$('moreWrap'));
return;
}
var list = (S.activity.content && S.activity.content.refs) || [];
if (!list.length) return;
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function alt(r) { return (r.alt && (r.alt[S.lang] || r.alt.he)) || ''; }
function fill(t, o) { return t.replace(/\{(\w+)\}/g, function (m, k) { return o[k]; }); }
var rtl = S.lang === 'he';
var CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
var PREV = CHEV + '<path d="M9 5l7 7-7 7"/></svg>', NEXT = CHEV + '<path d="M15 5l-7 7 7 7"/></svg>';
var d = document.createElement('dialog');
d.className = 'refs'; d.id = 'refsDialog'; d.setAttribute('aria-label', S.T.refsTitle);
d.innerHTML = '<h2 class="refs-h">' + esc(S.T.refsTitle) + '</h2>' +
'<ul class="refs-grid">' + list.map(function (r, i) {
return '<li><button type="button" class="refs-thumb" data-i="' + i + '" aria-label="' + esc(fill(S.T.refsOpen, { what: alt(r) })) + '"><img src="' + esc(r.src) + '" alt=""></button></li>';
}).join('') + '</ul>' +
'<figure class="refs-one" hidden><img alt=""><figcaption></figcaption></figure>' +
'<div class="refs-nav" hidden><button type="button" class="refs-step" data-step="-1" aria-label="' + esc(S.T.refsPrev) + '">' + PREV + '</button>' +
'<span class="refs-count" aria-live="polite"></span>' +
'<button type="button" class="refs-step" data-step="1" aria-label="' + esc(S.T.refsNext) + '">' + NEXT + '</button></div>' +
'<div class="refs-row"><button type="button" class="btn refs-all" hidden>' + esc(S.T.refsAll) + '</button>' +
'<button type="button" class="btn primary refs-close">' + esc(S.T.refsClose) + '</button></div>';
document.body.appendChild(d);
var grid = d.querySelector('.refs-grid'), one = d.querySelector('.refs-one'), img = one.querySelector('img'), cap = one.querySelector('figcaption'),
nav = d.querySelector('.refs-nav'), all = d.querySelector('.refs-all'), at = 0;
function showAll() {
grid.hidden = false; one.hidden = true; nav.hidden = true; all.hidden = true;
d.classList.remove('is-one');
var t = d.querySelector('.refs-thumb[data-i="' + at + '"]'); if (t && d.open) t.focus();
}
function show(i) {
at = (i % list.length + list.length) % list.length;
var r = list[at];
img.src = r.src; img.alt = alt(r); cap.textContent = alt(r);
d.querySelector('.refs-count').innerHTML = '<span aria-hidden="true">' + (at + 1) + '/' + list.length + '</span><span class="sr">' + esc(fill(S.T.refsCount, { n: at + 1, total: list.length })) + '</span>';
grid.hidden = true; one.hidden = false; nav.hidden = list.length < 2; all.hidden = false;
d.classList.add('is-one');
}
grid.addEventListener('click', function (e) {
var b = e.target.closest('.refs-thumb');
if (b) { show(+b.getAttribute('data-i')); all.focus(); }
});
d.querySelectorAll('.refs-step').forEach(function (b) { b.addEventListener('click', function () { show(at + +b.getAttribute('data-step')); }); });
d.addEventListener('keydown', function (e) {
if (one.hidden || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
e.preventDefault(); show(at + ((e.key === 'ArrowRight') !== rtl ? 1 : -1));
});
var x0 = null;
img.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
img.addEventListener('pointerup', function (e) {
if (x0 === null) return; var dx = e.clientX - x0; x0 = null;
if (Math.abs(dx) > 40) show(at + ((dx < 0) !== rtl ? 1 : -1));
});
img.addEventListener('dragstart', function (e) { e.preventDefault(); });
all.addEventListener('click', showAll);
d.querySelector('.refs-close').addEventListener('click', function () { d.close(); });
d.addEventListener('click', function (e) {
if (e.target !== d) return;
var r = d.getBoundingClientRect();
if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
});
var open = eyeButton(function () { S.closePanels(); showAll(); d.showModal(); d.querySelector('.refs-thumb').focus(); });
var top = document.querySelector('.top');
top.insertBefore(open, S.$('moreWrap'));
}
});
