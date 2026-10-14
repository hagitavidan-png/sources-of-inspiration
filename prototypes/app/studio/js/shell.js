/*! Sources of Inspiration in Art | מקורות השראה באמנות. Original code and content (c) 2026 Hagit Avidan | חגית אבידן. All rights reserved | כל הזכויות שמורות. Works and materials by others belong to their owners | יצירות וחומרים של אחרים שייכים לבעליהם. See NOTICE.txt */
Studio.shell = (function () {
'use strict';
var $ = function (id) { return document.getElementById(id); };
var S;
var panels = [];
var ICON = {
undo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 010 12h-3"/></svg>',
redo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 14l5-5-5-5"/><path d="M20 9H10a6 6 0 000 12h3"/></svg>'
};
function button(id, icon, label) {
var b = document.createElement('button');
b.className = 'tool'; b.id = id; b.type = 'button';
b.innerHTML = icon + '<span data-t="' + label + '"></span>';
return b;
}
function build(s) {
S = s;
var nav = $('tools');
var u = button('undo', ICON.undo, 'undo'); u.disabled = true; u.addEventListener('click', S.undo); nav.appendChild(u);
var r = button('redo', ICON.redo, 'redo'); r.disabled = true; r.addEventListener('click', S.redo); nav.appendChild(r);
if (S.items.length) { var g = document.createElement('i'); g.className = 'gap'; g.setAttribute('aria-hidden', 'true'); nav.appendChild(g); }
S.items.forEach(function (it) {
var b = button(it.id, it.icon, it.label);
if (it.panel) { b.setAttribute('aria-haspopup', 'true'); b.setAttribute('aria-expanded', 'false'); panels.push([it.panel, it.id]); }
if (it.pressed) b.setAttribute('aria-pressed', 'false');
b.addEventListener('click', it.onClick);
nav.appendChild(b);
});
if (S.prompt) { var pr = document.createElement('p'); pr.className = 'prompt'; pr.textContent = S.prompt; $('stage').parentNode.insertBefore(pr, $('stage')); }
document.querySelectorAll('[data-t]').forEach(function (el) { el.textContent = S.T[el.getAttribute('data-t')]; });
document.addEventListener('pointerdown', function (e) {
if (!e.target.closest('.panel') && !panels.some(function (p) { return e.target.closest('#' + p[1]); })) closePanels();
});
$('clear').addEventListener('click', function () {
if (!S.hasDrawing()) return;
ask('confirmClear').then(function (v) { if (v === 'clear') S.clearAll(); });
});
$('save').addEventListener('click', S.save);
if (!S.clear) $('clear').hidden = true;
if (S.next) {
var next = document.createElement('button');
next.className = 'btn primary'; next.id = 'next'; next.type = 'button'; next.textContent = S.next;
$('save').parentNode.appendChild(next);
next.addEventListener('click', function () { S.flush().then(function () { if (!S.dirty()) leave(); }); });
if (S.source) $('back').style.visibility = 'hidden';
}
if (S.works) {
var works = document.createElement('a');
works.className = 'works'; works.href = S.works; works.setAttribute('aria-label', S.T.works); works.title = S.T.works;
works.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M4 18l5-5 4 4 3-3 4 4"/></svg>';
document.querySelector('.top').appendChild(works);
works.addEventListener('click', function (e) {
e.preventDefault();
S.flush().then(function () { if (!S.dirty()) { allowUnload = true; location.href = S.works; } });
});
}
if (S.keep) {
var keep = document.createElement('button'), busy = false;
keep.className = 'btn primary'; keep.id = 'keep'; keep.type = 'button'; keep.textContent = S.keep;
$('save').parentNode.appendChild(keep);
keep.addEventListener('click', function () {
if (busy) return;
busy = true; keep.disabled = true; keeping = true;
S.point('kept').then(function (p) { keeping = false; saveState(''); if (p) toast(S.T.kept); }, function () { keeping = false; saveState('error'); })
.then(function () { busy = false; keep.disabled = false; });
});
}
if (S.auto) {
$('save').hidden = true;
$('back').addEventListener('click', function () {
S.flush().then(function () { if (!S.dirty()) leave(); });
});
document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') S.flush(true); });
window.addEventListener('pagehide', function () { S.flush(true); });
return;
}
$('back').addEventListener('click', function () {
if (!S.dirty()) return leave();
ask('confirmExit').then(function (v) {
if (v === 'exit') leave();
else if (v === 'save') Promise.resolve(S.save()).then(function (ok) { if (ok) setTimeout(leave, 450); });
});
});
window.addEventListener('beforeunload', function (e) {
if (S.dirty() && !allowUnload) { e.preventDefault(); e.returnValue = ''; }
});
}
var allowUnload = false;
function leave() { allowUnload = true; location.href = S.back(); }
function closePanels() {
panels.forEach(function (p) {
var el = $(p[0]); if (el) el.hidden = true;
var b = $(p[1]); if (b) b.setAttribute('aria-expanded', 'false');
});
}
function togglePanel(panelId, btnId) {
var open = $(panelId).hidden;
closePanels();
if (open) { $(panelId).hidden = false; $(btnId).setAttribute('aria-expanded', 'true'); }
}
function ask(id) {
var d = $(id);
return new Promise(function (resolve) {
function done(v) { d.querySelectorAll('button').forEach(function (b) { b.onclick = null; }); d.onclose = null; if (d.open) d.close(); resolve(v); }
d.querySelectorAll('button').forEach(function (b) { b.onclick = function () { done(b.value); }; });
d.onclose = function () { done('cancel'); };
d.showModal();
var first = d.querySelector('button[value=cancel]'); if (first) first.focus();
});
}
var keeping = false;
function saveState(st) {
var el = $('saveState');
if (!el || !S) return;
if (keeping && st !== 'error') st = '';
el.setAttribute('data-state', st);
el.textContent = st === 'saved' ? S.T.autoSaved : st === 'error' ? S.T.saveFailed : '';
}
var tt;
function toast(msg) {
var el = $('toast'); el.textContent = msg; el.classList.add('on');
clearTimeout(tt); tt = setTimeout(function () { el.classList.remove('on'); }, 1800);
}
return { build: build, closePanels: closePanels, togglePanel: togglePanel, toast: toast, saveState: saveState };
})();
