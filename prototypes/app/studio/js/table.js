/*! Sources of Inspiration in Art | מקורות השראה באמנות. Original code and content (c) 2026 Hagit Avidan | חגית אבידן. All rights reserved | כל הזכויות שמורות. Works and materials by others belong to their owners | יצירות וחומרים של אחרים שייכים לבעליהם. See NOTICE.txt */
Studio.register('table', {
strings: {
he: { help_table: 'שולחן האור: הפרט מתחת לדף',  table: 'שולחן אור', tableFloat: 'תמונת השראה', tableFloatShort: 'תמונת השראה', tableNone: 'ללא תמונה', tableMode: 'איך להציג את הפרט',
tableOpacity: 'נראות התמונה', tableHideFloat: 'להסתיר את תמונת ההשראה', tableFloatName: 'תמונת ההשראה. אפשר לגרור אותה לכל מקום' },
en: { help_table: 'Light table: the detail under the page',  table: 'Light table', tableFloat: 'Reference image', tableFloatShort: 'Reference', tableNone: 'No reference', tableMode: 'How to show the detail',
tableOpacity: 'Image visibility', tableHideFloat: 'Hide the reference image', tableFloatName: 'The reference image. Drag it anywhere' }
},
tool: null,
init: function (S) {
'use strict';
if (!window.Crop) return;
var doc = S.doc, images = {}, SIZE = { min: 25, max: 200 };
var ICON = {
table: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 15l5-4 4 3 3-2 6 4"/><circle cx="9" cy="9.5" r="1.4"/></svg>',
float: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="11" y="11" width="8" height="8" rx="1.5" fill="currentColor" stroke="none" opacity=".3"/><rect x="11" y="11" width="8" height="8" rx="1.5"/></svg>',
none: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M4 20L20 4"/></svg>',
eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>',
chev: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
};
var NAME = { table: S.T.table, float: S.T.tableFloat, none: S.T.tableNone };
var SHORT = { table: S.T.table, float: S.T.tableFloatShort, none: S.T.tableNone };
function cfg() { return doc.settings.table || null; }
function has() { var t = cfg(); return !!(t && t.w); }
function mode() { var t = cfg(); if (!t || !t.w) return 'none'; return t.mode || (t.on ? 'table' : 'none'); }
function url(w) { return '../' + w.hi + '.jpg'; }
function image(w) {
var k = url(w);
if (!(k in images)) {
images[k] = null;
window.Crop.load(k).then(function (im) { images[k] = im; S.redraw(); paintFloat(true); }, function () { delete images[k]; });
}
return images[k];
}
function fit(c) {
if (!(c.s > 0)) c.s = Math.min(doc.w, doc.h) * 0.9;
c.s = Math.max(doc.w * SIZE.min / 100, Math.min(doc.w * SIZE.max / 100, c.s));
if (!isFinite(c.x)) c.x = (doc.w - c.s) / 2;
if (!isFinite(c.y)) c.y = (doc.h - c.s) / 2;
if (!(c.o >= 0 && c.o <= 1)) c.o = 0.5;
return c;
}
S.base(function (c) {
var t = cfg();
if (mode() !== 'table' || !(t.o > 0) || c.canvas !== S.$('base')) return;
var im = image(t.w);
if (!im) return;
var nw = im.naturalWidth || im.width, nh = im.naturalHeight || im.height, sd = Math.min(nw, nh) / t.w.z;
var sx = Math.max(0, Math.min(nw - sd, t.w.cx * nw - sd / 2)), sy = Math.max(0, Math.min(nh - sd, t.w.cy * nh - sd / 2));
c.save();
c.globalAlpha = t.o;
c.imageSmoothingQuality = 'high';
c.drawImage(im, sx, sy, sd, sd, t.x, t.y, t.s, t.s);
c.restore();
});
var box = document.createElement('div');
box.className = 'refmodes'; box.id = 'refModes'; box.hidden = true;
box.innerHTML =
'<div class="refmode-wrap">' +
'<button type="button" class="refmode" id="refMode" aria-haspopup="menu" aria-expanded="false" aria-controls="refMenu" title="' + S.T.tableMode + '">' +
'<span class="refmode-i"></span><span class="refmode-t"></span>' + ICON.chev + '</button>' +
'<div class="refmenu" id="refMenu" role="menu" aria-label="' + S.T.tableMode + '" hidden>' +
['table', 'float', 'none'].map(function (m) {
return '<button type="button" role="menuitemradio" aria-checked="false" data-mode="' + m + '">' + ICON[m] + '<span>' + NAME[m] + '</span></button>';
}).join('') +
'</div>' +
'</div>' +
'<label class="refvis" id="refVis">' + ICON.eye + '<span class="refvis-t">' + S.T.tableOpacity + '</span>' +
'<input type="range" id="tableOpacity" min="0" max="100" step="1" aria-label="' + S.T.tableOpacity + '"></label>';
S.stage.parentNode.appendChild(box);
var modeBtn = box.querySelector('#refMode'), menu = box.querySelector('#refMenu'), vis = box.querySelector('#refVis'), slider = box.querySelector('#tableOpacity');
var lamp = null, lampList = null, lampVis = null, lampSlider = null;
if (S.floatbar) {
lamp = document.createElement('div');
lamp.className = 'panel lamp-panel'; lamp.id = 'lampPanel'; lamp.hidden = true; lamp.setAttribute('role', 'group'); lamp.setAttribute('aria-label', S.T.tableMode);
lamp.innerHTML = '<div class="lamp-list" role="menu">' + ['table', 'float', 'none'].map(function (m) {
return '<button type="button" role="menuitemradio" aria-checked="false" data-mode="' + m + '">' + ICON[m] + '<span>' + NAME[m] + '</span></button>';
}).join('') + '</div>' +
'<label class="refvis lamp-vis" id="lampVis">' + ICON.eye + '<span class="refvis-t">' + S.T.tableOpacity + '</span>' +
'<input type="range" id="lampOpacity" min="0" max="100" step="1" aria-label="' + S.T.tableOpacity + '"></label>';
S.stage.appendChild(lamp);
lampList = lamp.querySelector('.lamp-list'); lampVis = lamp.querySelector('#lampVis'); lampSlider = lamp.querySelector('#lampOpacity');
lampList.addEventListener('click', function (e) { var b = e.target.closest('[data-mode]'); if (!b) return; setMode(b.getAttribute('data-mode')); S.closePanels(); });
lampSlider.addEventListener('input', function (e) { var t = cfg(); if (!t) return; t.o = Math.max(0, Math.min(1, +e.target.value / 100)); slider.value = e.target.value; S.changed(); S.redraw(); });
S.item({ id: 'table', order: 90, label: 'table', panel: 'lampPanel',
icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3h6l3 8H6z"/><path d="M12 11v7"/><path d="M8 21h8"/><path d="M12 18l-3 3"/><path d="M12 18l3 3"/></svg>',
onClick: function () { if (!has()) return; S.togglePanel('lampPanel', 'table'); } });
}
function menuOpen(on) {
menu.hidden = !on; modeBtn.setAttribute('aria-expanded', String(on));
if (on) { S.closePanels(); var cur = menu.querySelector('[aria-checked=true]') || menu.firstElementChild; if (cur) cur.focus(); }
}
modeBtn.addEventListener('click', function () { menuOpen(menu.hidden); });
menu.addEventListener('click', function (e) {
var b = e.target.closest('[data-mode]'); if (!b) return;
menuOpen(false); setMode(b.getAttribute('data-mode')); modeBtn.focus();
});
document.addEventListener('pointerdown', function (e) { if (!menu.hidden && !e.target.closest('.refmode-wrap')) menuOpen(false); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { menuOpen(false); modeBtn.focus(); } });
slider.addEventListener('input', function (e) {
var t = cfg(); if (!t) return;
t.o = Math.max(0, Math.min(1, +e.target.value / 100)); if (lampSlider) lampSlider.value = e.target.value; S.changed(); S.redraw();
});
var fl = document.createElement('div');
fl.className = 'reffloat'; fl.id = 'refFloat'; fl.hidden = true; fl.setAttribute('role', 'img'); fl.setAttribute('aria-label', S.T.tableFloatName); fl.tabIndex = 0;
fl.innerHTML = '<canvas aria-hidden="true"></canvas><button type="button" class="reffloat-x" id="refFloatHide" aria-label="' + S.T.tableHideFloat + '" title="' + S.T.tableHideFloat + '"><span class="x-dot">' + ICON.x + '</span></button>';
S.stage.appendChild(fl);
var flc = fl.querySelector('canvas'), painted = null;
function floatSize() { return Math.min(innerWidth, innerHeight) < 400 ? 100 : 112; }
function paintFloat(force) {
var t = cfg(); if (!t || !t.w || fl.hidden) return;
var n = floatSize(), key = url(t.w) + '@' + n;
if (painted === key && !force) return;
var im = image(t.w); if (!im) return;
painted = key; window.Crop.draw(flc, im, t.w, n);
}
var MARGIN = 14;
function roomOf() { var r = S.stage.getBoundingClientRect(), n = floatSize(); return { w: Math.max(0, r.width - n - MARGIN * 2), h: Math.max(0, r.height - n - MARGIN * 2), n: n }; }
function place() {
var t = cfg(); if (fl.hidden || !t) return;
var o = roomOf(), rtl = document.documentElement.dir === 'rtl';
var fx = isFinite(t.fx) ? t.fx : (rtl ? 0 : 1), fy = isFinite(t.fy) ? t.fy : 1;
fx = Math.max(0, Math.min(1, fx)); fy = Math.max(0, Math.min(1, fy));
fl.style.width = fl.style.height = o.n + 'px';
fl.style.left = Math.round(MARGIN + fx * o.w) + 'px'; fl.style.top = Math.round(MARGIN + fy * o.h) + 'px';
}
var drag = null;
fl.addEventListener('pointerdown', function (e) {
if (e.target.closest('.reffloat-x') || drag) return;
e.preventDefault(); e.stopPropagation();
var r = fl.getBoundingClientRect(), s = S.stage.getBoundingClientRect();
drag = { id: e.pointerId, dx: e.clientX - r.left, dy: e.clientY - r.top, sx: s.left, sy: s.top, moved: false };
try { fl.setPointerCapture(e.pointerId); } catch (err) {}
fl.classList.add('dragging');
});
fl.addEventListener('pointermove', function (e) {
if (!drag || e.pointerId !== drag.id) return;
var o = roomOf(), x = e.clientX - drag.sx - drag.dx, y = e.clientY - drag.sy - drag.dy;
x = Math.max(MARGIN, Math.min(MARGIN + o.w, x)); y = Math.max(MARGIN, Math.min(MARGIN + o.h, y));
fl.style.left = Math.round(x) + 'px'; fl.style.top = Math.round(y) + 'px'; drag.moved = true;
});
function dragEnd(e) {
if (!drag || e.pointerId !== drag.id) return;
var o = roomOf(), t = cfg();
if (drag.moved && t) {
t.fx = o.w ? (parseFloat(fl.style.left) - MARGIN) / o.w : 0; t.fy = o.h ? (parseFloat(fl.style.top) - MARGIN) / o.h : 0;
S.changed();
}
drag = null; fl.classList.remove('dragging');
}
fl.addEventListener('pointerup', dragEnd); fl.addEventListener('pointercancel', dragEnd);
fl.addEventListener('contextmenu', function (e) { e.preventDefault(); });
fl.querySelector('.reffloat-x').addEventListener('pointerdown', function (e) { e.stopPropagation(); });
fl.querySelector('.reffloat-x').addEventListener('click', function () { setMode('none'); modeBtn.focus(); });
if (window.ResizeObserver) new ResizeObserver(function () { place(); paintFloat(); }).observe(S.stage);
window.addEventListener('resize', function () { place(); paintFloat(); });
function setMode(m, quiet) {
var t = cfg(); if (!t || !t.w) return;
if (['table', 'float', 'none'].indexOf(m) < 0) m = 'none';
var was = t.mode;
t.mode = m; t.on = m === 'table';
update(); S.redraw();
if (!quiet || was !== m) S.changed();
}
function update() {
var t = cfg(), ok = has(), m = mode();
box.hidden = !ok;
if (!ok) { fl.hidden = true; return; }
modeBtn.querySelector('.refmode-i').innerHTML = ICON[m];
modeBtn.querySelector('.refmode-t').textContent = SHORT[m];
modeBtn.setAttribute('data-mode', m);
[].forEach.call(menu.querySelectorAll('[data-mode]'), function (b) { b.setAttribute('aria-checked', String(b.getAttribute('data-mode') === m)); });
vis.hidden = m !== 'table';
slider.value = Math.round(t.o * 100);
if (lamp) {
[].forEach.call(lampList.querySelectorAll('[data-mode]'), function (b) { b.setAttribute('aria-checked', String(b.getAttribute('data-mode') === m)); });
lampVis.hidden = m !== 'table'; lampSlider.value = Math.round(t.o * 100);
var tb = S.$('table'); if (tb) tb.setAttribute('aria-pressed', String(m === 'table'));
}
fl.hidden = m !== 'float';
if (m === 'float') { place(); paintFloat(); }
}
S.table = {
use: function (w, m) {
if (!w) return;
var same = doc.settings.table && doc.settings.table.w && window.Crop.sameDetail(doc.settings.table.w, w);
var t = fit(same ? doc.settings.table : { o: 0.5 });
t.w = { src: w.src, img: w.img, hi: w.hi, cx: w.cx, cy: w.cy, z: w.z };
doc.settings.table = t;
if (!same) painted = null;
image(t.w);
setMode(m || t.mode || (t.on === false ? 'none' : 'table'), same);
},
has: has,
mode: mode,
setMode: setMode,
refresh: function () { update(); }
};
if (has()) { fit(cfg()); image(cfg().w); }
update();
}
});
