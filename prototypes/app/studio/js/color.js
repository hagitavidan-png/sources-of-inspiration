/*! Sources of Inspiration in Art | מקורות השראה באמנות. Original code and content (c) 2026 Hagit Avidan | חגית אבידן. All rights reserved | כל הזכויות שמורות. Works and materials by others belong to their owners | יצירות וחומרים של אחרים שייכים לבעליהם. See NOTICE.txt */
Studio.register('color', {
strings: {
he: { color: 'צבע', custom: 'צבע נוסף', colors: 'צבעים', cpGrid: 'רשת', cpSpectrum: 'ספקטרום', cpSliders: 'מחוונים',
cpRed: 'אדום', cpGreen: 'ירוק', cpBlue: 'כחול', cpNow: 'הצבע הנוכחי', cpNew: 'הצבע החדש', cpOk: 'בחירה', cpCancel: 'ביטול' },
en: { color: 'Colour', custom: 'Another colour', colors: 'Colours', cpGrid: 'Grid', cpSpectrum: 'Spectrum', cpSliders: 'Sliders',
cpRed: 'Red', cpGreen: 'Green', cpBlue: 'Blue', cpNow: 'Current colour', cpNew: 'New colour', cpOk: 'Choose', cpCancel: 'Cancel' }
},
init: function (S) {
'use strict';
var COLORS = ['#2b2a28', '#c8423b', '#e08a2e', '#e9c33f', '#5d8a4f', '#2f6fa8', '#6b4f9a'];
var st = S.state;
st.color = COLORS[0];
if (!S.has('draw') && !S.has('fill')) console.warn('Studio: the colour tool needs the draw or fill tool in the same activity');
S.item({ id: 'color', order: 20, label: 'color', panel: 'colorPanel',
icon: '<span class="color-wheel" aria-hidden="true"><i id="colorDot"></i></span>',
onClick: function () { S.togglePanel('colorPanel', 'color'); },
update: function () { S.$('colorDot').style.background = st.color; } });
var cp = document.createElement('div');
cp.className = 'panel'; cp.id = 'colorPanel'; cp.hidden = true; cp.setAttribute('role', 'group'); cp.setAttribute('aria-label', S.T.colors);
COLORS.forEach(function (c) {
var b = document.createElement('button');
b.type = 'button'; b.className = 'sw'; b.style.background = c; b.setAttribute('aria-label', c); b.dataset.c = c;
b.addEventListener('click', function () { pick(c); S.closePanels(); });
cp.appendChild(b);
});
var custom = document.createElement('label');
custom.className = 'sw custom'; custom.title = S.T.custom;
custom.innerHTML = '<input type="color" aria-label="' + S.T.custom + '" value="#8a9a7b">';
custom.querySelector('input').addEventListener('input', function (e) { pick(e.target.value); });
custom.querySelector('input').addEventListener('change', function (e) { pick(e.target.value); });
cp.appendChild(custom);
var ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
if (!ios) {
custom.querySelector('input').tabIndex = -1; custom.querySelector('input').style.pointerEvents = 'none';
custom.setAttribute('role', 'button'); custom.tabIndex = 0; custom.setAttribute('aria-label', S.T.custom);
var openOwn = function (e) { e.preventDefault(); picker(); };
custom.addEventListener('click', openOwn);
custom.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') openOwn(e); });
}
S.stage.appendChild(cp);
function pick(c) {
st.color = c;
if (S.has('draw')) st.tool = 'brush';
cp.querySelectorAll('.sw').forEach(function (b) { if (b.dataset.c) b.setAttribute('aria-pressed', String(b.dataset.c === c)); });
S.updateUi();
}
this.ready = function () { pick(st.color); };
var dlg = null, cur = '#000000', tab = 'grid';
function hex(r, g, b) { return '#' + [r, g, b].map(function (v) { return ('0' + Math.round(Math.max(0, Math.min(255, v))).toString(16)).slice(-2); }).join(''); }
function rgb(h) { var n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function hsl(h, s, l) {
var a = s * Math.min(l, 1 - l), f = function (n) { var k = (n + h / 30) % 12; return 255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))); };
return hex(f(0), f(8), f(4));
}
function at(x, y) { return y < 0.5 ? hsl(x * 360, 1, 1 - y) : hsl(x * 360, 1, 0.5 - (y - 0.5)); }
function picker() {
S.closePanels();
if (!dlg) build();
cur = st.color; show(cur); setTab(tab); dlg.showModal();
var b = dlg.querySelector('.cpk-tab[aria-selected=true]'); if (b) b.focus();
}
function build() {
dlg = document.createElement('dialog'); dlg.className = 'cpk'; dlg.setAttribute('aria-label', S.T.custom);
var greys = [], cells = [];
for (var i = 0; i < 12; i++) greys.push(hex(255 - i * 255 / 11, 255 - i * 255 / 11, 255 - i * 255 / 11));
var L = [0.88, 0.78, 0.66, 0.55, 0.45, 0.35, 0.26, 0.18];
L.forEach(function (l) { for (var h = 0; h < 12; h++) cells.push(hsl(h * 30, l > 0.8 ? 0.9 : 0.85, l)); });
var sw = function (c) { return '<button type="button" class="cpk-cell" data-c="' + c + '" style="background:' + c + '" aria-label="' + c + '"></button>'; };
var slider = function (k, i) { return '<label class="cpk-sl"><span>' + S.T[k] + '</span><input type="range" min="0" max="255" step="1" data-i="' + i + '"><output></output></label>'; };
dlg.innerHTML = '<h2 class="cpk-h">' + S.T.custom + '</h2>' +
'<div class="cpk-tabs" role="tablist">' + ['grid', 'spectrum', 'sliders'].map(function (t) {
return '<button type="button" class="cpk-tab" role="tab" data-t="' + t + '" aria-selected="false">' + S.T['cp' + t[0].toUpperCase() + t.slice(1)] + '</button>'; }).join('') + '</div>' +
'<div class="cpk-pane" data-t="grid"><div class="cpk-grid">' + greys.concat(cells).map(sw).join('') + '</div></div>' +
'<div class="cpk-pane" data-t="spectrum"><div class="cpk-spec"><canvas></canvas><i class="cpk-ring" hidden></i></div></div>' +
'<div class="cpk-pane" data-t="sliders">' + slider('cpRed', 0) + slider('cpGreen', 1) + slider('cpBlue', 2) + '</div>' +
'<div class="cpk-foot"><span class="cpk-pair"><i class="cpk-old" title="' + S.T.cpNow + '"></i><i class="cpk-new" title="' + S.T.cpNew + '"></i></span>' +
'<button type="button" class="btn cpk-cancel">' + S.T.cpCancel + '</button><button type="button" class="btn primary cpk-ok">' + S.T.cpOk + '</button></div>';
document.body.appendChild(dlg);
dlg.querySelectorAll('.cpk-tab').forEach(function (b) { b.addEventListener('click', function () { setTab(b.dataset.t); }); });
dlg.querySelectorAll('.cpk-cell').forEach(function (b) { b.addEventListener('click', function () { show(b.dataset.c); }); });
dlg.querySelectorAll('.cpk-sl input').forEach(function (r) { r.addEventListener('input', function () {
var v = [].map.call(dlg.querySelectorAll('.cpk-sl input'), function (x) { return +x.value; }); show(hex(v[0], v[1], v[2]), true); }); });
var spec = dlg.querySelector('.cpk-spec'), ring = dlg.querySelector('.cpk-ring'), down = false;
function fromSpec(e) {
var r = spec.getBoundingClientRect(), x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), y = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
ring.hidden = false; ring.style.left = (x * 100) + '%'; ring.style.top = (y * 100) + '%'; show(at(x, y), false, true);
}
spec.addEventListener('pointerdown', function (e) { down = true; spec.setPointerCapture(e.pointerId); fromSpec(e); });
spec.addEventListener('pointermove', function (e) { if (down) fromSpec(e); });
spec.addEventListener('pointerup', function () { down = false; }); spec.addEventListener('pointercancel', function () { down = false; });
dlg.querySelector('.cpk-cancel').addEventListener('click', function () { dlg.close(); });
dlg.querySelector('.cpk-ok').addEventListener('click', function () { pick(dlg.dataset.c); dlg.close(); });
dlg.addEventListener('click', function (e) {
if (e.target !== dlg) return; var r = dlg.getBoundingClientRect();
if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dlg.close();
});
}
function paintSpec() {
var c = dlg.querySelector('.cpk-spec canvas'), w = c.clientWidth, h = c.clientHeight; if (!w || !h) return;
var d = Math.min(2, window.devicePixelRatio || 1); c.width = Math.round(w * d); c.height = Math.round(h * d);
var g = c.getContext('2d'), x, y, hue = g.createLinearGradient(0, 0, c.width, 0);
for (x = 0; x <= 12; x++) hue.addColorStop(x / 12, hsl(x * 30, 1, 0.5));
g.fillStyle = hue; g.fillRect(0, 0, c.width, c.height);
y = g.createLinearGradient(0, 0, 0, c.height);
y.addColorStop(0, '#ffffff'); y.addColorStop(0.5, 'rgba(255,255,255,0)'); y.addColorStop(0.5, 'rgba(0,0,0,0)'); y.addColorStop(1, '#000000');
g.fillStyle = y; g.fillRect(0, 0, c.width, c.height);
}
function setTab(t) {
tab = t;
dlg.querySelectorAll('.cpk-tab').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.t === t)); });
dlg.querySelectorAll('.cpk-pane').forEach(function (p) { p.hidden = p.dataset.t !== t; });
if (t === 'spectrum') requestAnimationFrame(paintSpec);
}
function show(c, fromSliders, fromSpec) {
dlg.dataset.c = c;
dlg.querySelector('.cpk-old').style.background = cur; dlg.querySelector('.cpk-new').style.background = c;
dlg.querySelectorAll('.cpk-cell').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.c === c)); });
if (!fromSpec) dlg.querySelector('.cpk-ring').hidden = true;
var v = rgb(c);
dlg.querySelectorAll('.cpk-sl').forEach(function (l, i) {
var r = l.querySelector('input'); if (!fromSliders) r.value = v[i]; l.querySelector('output').textContent = v[i];
var a = v.slice(), b = v.slice(); a[i] = 0; b[i] = 255; r.style.background = 'linear-gradient(to right,' + hex(a[0], a[1], a[2]) + ',' + hex(b[0], b[1], b[2]) + ')';
});
}
}
});
