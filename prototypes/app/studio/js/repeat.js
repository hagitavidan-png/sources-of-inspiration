/*! Sources of Inspiration in Art | מקורות השראה באמנות. Original code and content (c) 2026 Hagit Avidan | חגית אבידן. All rights reserved | כל הזכויות שמורות. Works and materials by others belong to their owners | יצירות וחומרים של אחרים שייכים לבעליהם. See NOTICE.txt */
Studio.register('repeat', {
strings: {
he: { repeat: 'חזרה', grid: 'רשת', offset: 'מדורג', repeats: 'סוג החזרה',
size: 'גודל', direction: 'כיוון', spacing: 'מרווח', smaller: 'קטן יותר', larger: 'גדול יותר', closer: 'צפוף יותר', apart: 'מרווח יותר', turnLeft: 'סיבוב נגד כיוון השעון', turnRight: 'סיבוב עם כיוון השעון',
repeatOn: 'חזרתיות פעילה', repeatOff: 'חזרתיות כבויה', unitDraw: 'חזרה לציור היחידה', unitBack: 'לראות שוב בחזרה', seeIt: 'ממשיכים ליצירת דפוס' },
en: { repeat: 'Repeat', grid: 'Grid', offset: 'Offset', repeats: 'Kind of repeat',
size: 'Size', direction: 'Direction', spacing: 'Spacing', smaller: 'Smaller', larger: 'Larger', closer: 'Closer', apart: 'Further apart', turnLeft: 'Turn anticlockwise', turnRight: 'Turn clockwise',
repeatOn: 'Repeat on', repeatOff: 'Repeat off', unitDraw: 'Back to drawing the unit', unitBack: 'See it repeated again', seeIt: 'Continue to create a pattern' }
},
init: function (S) {
'use strict';
var KINDS = ['grid', 'offset'];
var ICON = {
grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="4" width="7" height="7" rx="1"/><rect x="13.5" y="4" width="7" height="7" rx="1"/><rect x="3.5" y="14" width="7" height="7" rx="1"/><rect x="13.5" y="14" width="7" height="7" rx="1"/></svg>',
offset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="4" width="7" height="7" rx="1"/><rect x="13.5" y="4" width="7" height="7" rx="1"/><rect x="8.5" y="14" width="7" height="7" rx="1"/></svg>'
};
var cfg = (S.activity.params || {}).repeat || {};
var modes = (Array.isArray(cfg.modes) ? cfg.modes : []).filter(function (m) { return KINDS.indexOf(m) >= 0; });
var step = typeof cfg.step === 'number' ? [cfg.step, cfg.step] : cfg.step;
if (!modes.length || !Array.isArray(step) || !(step[0] >= 40 && step[1] >= 40)) {
console.warn('Studio: the repeat tool needs params.repeat.modes ("grid", "offset") and params.repeat.step (40 or more) in the activity');
return;
}
var develop = !!cfg.asStep, livemode = develop && !!cfg.live;
var saved = S.doc.settings.repeat;
var st = { mode: develop ? 'grid' : saved && modes.indexOf(saved.mode) >= 0 ? saved.mode : modes[0] };
var VARY = { size: { min: 0.5, max: 1.5, step: 0.05, none: 1 }, direction: { min: -180, max: 180, step: 15, none: 0 }, spacing: { min: 0.6, max: 1.6, step: 0.05, none: 1 } };
var vary = !develop && VARY[cfg.vary] ? cfg.vary : null;
if (vary) {
var v0 = saved && saved.vary && saved.vary.kind === vary && typeof saved.vary.value === 'number' ? saved.vary.value : VARY[vary].none;
st.vary = { kind: vary, value: Math.min(VARY[vary].max, Math.max(VARY[vary].min, v0)) };
}
if (!develop) S.doc.settings.repeat = st;
var NAME = { size: 'size', direction: 'rotation', spacing: 'spacing' }, live = null;
function clamp(kind, v) { return Math.min(VARY[kind].max, Math.max(VARY[kind].min, v)); }
function amount(kind) {
if (develop) {
if (live && live.k === NAME[kind]) return live.v;
var sp = S.split(), v = VARY[kind].none, r = sp.marker && sp.marker.rep;
if (r && typeof r[NAME[kind]] === 'number') v = clamp(kind, r[NAME[kind]]);
sp.after.forEach(function (op) { if (op.t === 'rset' && op.k === NAME[kind] && typeof op.v === 'number') v = clamp(kind, op.v); });
return v;
}
return st.vary && st.vary.kind === kind ? st.vary.value : VARY[kind].none;
}
function offsets() {
var gap = amount('spacing'), sx = step[0] * gap, sy = step[1] * gap, nx = Math.ceil(S.doc.w / sx) + 1, ny = Math.ceil(S.doc.h / sy) + 1, out = [];
for (var j = -ny; j <= ny; j++) {
var shift = st.mode === 'offset' && Math.abs(j) % 2 ? sx / 2 : 0;
for (var i = -nx; i <= nx; i++) out.push([i * sx + shift, j * sy]);
}
return out;
}
var unit = document.createElement('canvas'), big = document.createElement('canvas');
S.present(function (c, paint, info) {
if (develop && info && cfg.unit && info.screen) return unitOnly(c, info);
if (develop && info && isLive(info.marker)) return liveRender(c, info);
var m = c.getTransform(), W = c.canvas.width, H = c.canvas.height;
if (amount('size') !== 1) return sized(c, paint, m, W, H);
if (unit.width !== W || unit.height !== H) { unit.width = W; unit.height = H; }
var u = unit.getContext('2d');
u.setTransform(1, 0, 0, 1, 0, 0); u.clearRect(0, 0, W, H); u.setTransform(m);
paint(u);
c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over';
var k = 1, turn = amount('direction') * Math.PI / 180;
if (turn === 0) {
offsets().forEach(function (d) {
var x = Math.round(d[0] * m.a), y = Math.round(d[1] * m.d);
if (x < W && y < H && x > -W && y > -H) c.drawImage(unit, x, y);
});
} else {
var b = box(), cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2;
var sx = Math.floor(b[0] * m.a), sy = Math.floor(b[1] * m.d), sw = Math.ceil(b[2] * m.a) - sx, sh = Math.ceil(b[3] * m.d) - sy;
if (sw > 0 && sh > 0) offsets().forEach(function (d) {
var px = (d[0] + cx) * m.a, py = (d[1] + cy) * m.d;
if (px < -W || py < -H || px > 2 * W || py > 2 * H) return;
c.setTransform(1, 0, 0, 1, px, py); c.rotate(turn); c.scale(k, k);
c.drawImage(unit, sx, sy, sw, sh, sx - cx * m.a, sy - cy * m.d, sw, sh);
});
}
c.restore();
}, develop);
function sized(c, paint, m, W, H) {
var k = amount('size'), b = box(), cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2;
if (big.width !== 2 * W || big.height !== 2 * H) { big.width = 2 * W; big.height = 2 * H; }
var g = big.getContext('2d');
g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, big.width, big.height);
g.setTransform(m.a, 0, 0, m.d, W / 2, H / 2); g.translate(cx, cy); g.scale(k, k); g.translate(-cx, -cy);
var lines = visible().filter(function (op) { return typeof op.w === 'number'; }), widths = lines.map(function (op) { return op.w; });
try { lines.forEach(function (op) { op.w = op.w / k; }); paint(g); }
finally { lines.forEach(function (op, i) { op.w = widths[i]; }); }
c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over';
offsets().forEach(function (d) {
var x = Math.round(d[0] * m.a), y = Math.round(d[1] * m.d);
if (x < W && y < H && x > -W && y > -H) c.drawImage(big, x - W / 2, y - H / 2);
});
c.restore();
}
function visible() {
if (develop) return S.split().source;
var ops = S.doc.ops, from = 0;
for (var i = ops.length - 1; i >= 0; i--) if (ops[i].t === 'clear') { from = i + 1; break; }
return ops.slice(from);
}
function box() {
var b = [Infinity, Infinity, -Infinity, -Infinity];
visible().forEach(function (op) {
var p = op.pts || [], r = (op.w || 0) / 2 + 1;
for (var j = 0; j + 1 < p.length; j += 2) { b[0] = Math.min(b[0], p[j] - r); b[1] = Math.min(b[1], p[j + 1] - r); b[2] = Math.max(b[2], p[j] + r); b[3] = Math.max(b[3], p[j + 1] + r); }
});
return isFinite(b[0]) ? [Math.max(0, b[0]), Math.max(0, b[1]), Math.min(S.doc.w, b[2]), Math.min(S.doc.h, b[3])] : [0, 0, 0, 0];
}
function isLive(mk) { return !!mk && (mk.live === 1 || (mk.t === 'clear' && !!mk.rep)); }
function r1(v) { return Math.round(v * 10) / 10; }
function centreOf(mk) {
var c = mk && (mk.t === 'clear' ? mk.rep && mk.rep.c : mk.c);
if (Array.isArray(c) && c.length === 2) return c;
if (mk && mk.t === 'clear') return [S.doc.w / 2, S.doc.h / 2];
var b = box(); return [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2];
}
function scaledBox(ops, k, ctr) {
var b = [Infinity, Infinity, -Infinity, -Infinity];
ops.forEach(function (op) {
var p = op.pts || [], r = (op.w || 0) / 2 + 1;
for (var j = 0; j + 1 < p.length; j += 2) {
var x = ctr[0] + k * (p[j] - ctr[0]), y = ctr[1] + k * (p[j + 1] - ctr[1]);
if (x - r < b[0]) b[0] = x - r; if (y - r < b[1]) b[1] = y - r; if (x + r > b[2]) b[2] = x + r; if (y + r > b[3]) b[3] = y + r;
}
});
return isFinite(b[0]) ? b : null;
}
function paintScaled(g, ops, k) {
var ws = ops.map(function (op) { return op.w; });
try { if (k !== 1) ops.forEach(function (op) { if (typeof op.w === 'number') op.w = op.w / k; }); S.paintOps(ops, g); }
finally { ops.forEach(function (op, i) { if (typeof ws[i] === 'number') op.w = ws[i]; }); }
}
var images = {}, frame = document.createElement('canvas'), turned = document.createElement('canvas');
function same(a, b) { if (a.length > b.length) return false; for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false; return true; }
function unitImage(m, k, ctr, ops, b) {
var key = [m.a, m.d, m.e, m.f].join(':'), u = images[key];
var x0 = Math.floor(m.a * b[0] + m.e), y0 = Math.floor(m.d * b[1] + m.f), x1 = Math.ceil(m.a * b[2] + m.e), y1 = Math.ceil(m.d * b[3] + m.f);
var again = !u || u.k !== k || u.cx !== ctr[0] || u.cy !== ctr[1] || !same(u.ops, ops) ||
x0 < u.ox || y0 < u.oy || x1 > u.ox + u.cv.width || y1 > u.oy + u.cv.height;
if (again) {
if (!u) {
Object.keys(images).slice(3).forEach(function (k2) { delete images[k2]; });
u = images[key] = { cv: document.createElement('canvas') };
}
var M = Math.round(60 * m.a);
u.ox = x0 - M; u.oy = y0 - M;
u.cv.width = Math.max(1, Math.min(4096, x1 - x0 + 2 * M)); u.cv.height = Math.max(1, Math.min(4096, y1 - y0 + 2 * M));
u.k = k; u.cx = ctr[0]; u.cy = ctr[1]; u.ops = [];
}
var add = ops.slice(u.ops.length);
if (add.length) { place(u.cv.getContext('2d'), m, k, ctr, u); paintScaled(u.cv.getContext('2d'), add, k); }
u.ops = ops.slice();
return u;
}
function place(g, m, k, ctr, u) { g.setTransform(m.a * k, 0, 0, m.d * k, m.a * ctr[0] * (1 - k) + m.e - u.ox, m.d * ctr[1] * (1 - k) + m.f - u.oy); }
function unitOnly(c, info) { S.paintOps(info.unit, c); if (info.pending) S.paintOps([info.pending], c); }
function liveRender(c, info) {
if (S.doc.settings.repeatOff) return unitOnly(c, info);
var m = c.getTransform(), W = c.canvas.width, H = c.canvas.height, ctr = centreOf(info.marker);
var k = amount('size'), turn = amount('direction') * Math.PI / 180, gap = amount('spacing'), sx = step[0] * gap, sy = step[1] * gap;
var b = scaledBox(info.pending ? info.unit.concat([info.pending]) : info.unit, k, ctr);
if (!b) return;
var u = unitImage(m, k, ctr, info.unit, b), img = u.cv;
if (info.pending) {
if (frame.width !== img.width || frame.height !== img.height) { frame.width = img.width; frame.height = img.height; }
var f = frame.getContext('2d');
f.setTransform(1, 0, 0, 1, 0, 0); f.clearRect(0, 0, frame.width, frame.height); f.drawImage(img, 0, 0);
place(f, m, k, ctr, u); paintScaled(f, [info.pending], k);
img = frame;
}
var iw = img.width, ih = img.height, i, j, i0, i1, j0, j1, shift;
c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over';
if (turn === 0) {
i0 = Math.floor(-(u.ox + iw) / (m.a * sx)) - 1; i1 = Math.ceil((W - u.ox) / (m.a * sx)) + 1;
j0 = Math.floor(-(u.oy + ih) / (m.d * sy)) - 1; j1 = Math.ceil((H - u.oy) / (m.d * sy)) + 1;
for (j = j0; j <= j1; j++) {
shift = st.mode === 'offset' && Math.abs(j) % 2 ? sx / 2 : 0;
for (i = i0; i <= i1; i++) {
var x = u.ox + Math.round(m.a * (i * sx + shift)), y = u.oy + Math.round(m.d * j * sy);
if (x < W && y < H && x + iw > 0 && y + ih > 0) c.drawImage(img, x, y);
}
}
} else {
var px0 = m.a * ctr[0] + m.e - u.ox, py0 = m.d * ctr[1] + m.f - u.oy;
var r = Math.max(Math.hypot(px0, py0), Math.hypot(iw - px0, py0), Math.hypot(px0, ih - py0), Math.hypot(iw - px0, ih - py0));
var side = Math.min(8192, Math.ceil(2 * r) + 2), half = side / 2;
if (turned.width !== side || turned.height !== side) { turned.width = side; turned.height = side; }
var t = turned.getContext('2d');
t.setTransform(1, 0, 0, 1, 0, 0); t.clearRect(0, 0, side, side);
t.setTransform(1, 0, 0, 1, half, half); t.rotate(turn); t.drawImage(img, -px0, -py0);
i0 = Math.floor(((-r - m.e) / m.a - ctr[0]) / sx) - 1; i1 = Math.ceil(((W + r - m.e) / m.a - ctr[0]) / sx) + 1;
j0 = Math.floor(((-r - m.f) / m.d - ctr[1]) / sy) - 1; j1 = Math.ceil(((H + r - m.f) / m.d - ctr[1]) / sy) + 1;
for (j = j0; j <= j1; j++) {
shift = st.mode === 'offset' && Math.abs(j) % 2 ? sx / 2 : 0;
for (i = i0; i <= i1; i++) {
var px = m.a * (i * sx + shift + ctr[0]) + m.e, py = m.d * (j * sy + ctr[1]) + m.f;
if (px < -r || py < -r || px > W + r || py > H + r) continue;
c.drawImage(turned, Math.round(px - half), Math.round(py - half));
}
}
}
c.restore();
}
if (livemode) S.live(function (p) {
var mk = S.split().marker;
if (!isLive(mk)) return null;
if (S.doc.settings.repeatOff || cfg.unit) return { map: null };
var k = amount('size'), turn = amount('direction') * Math.PI / 180, gap = amount('spacing'), ctr = centreOf(mk);
var sx = step[0] * gap, sy = step[1] * gap, j = Math.round((p[1] - ctr[1]) / sy);
var shift = st.mode === 'offset' && Math.abs(j) % 2 ? sx / 2 : 0, i = Math.round((p[0] - ctr[0] - shift) / sx);
var dx = i * sx + shift, dy = j * sy, cs = Math.cos(-turn), sn = Math.sin(-turn);
return { map: function (q) {
var x = (q[0] - dx - ctr[0]) / k, y = (q[1] - dy - ctr[1]) / k;
return [r1(ctr[0] + x * cs - y * sn), r1(ctr[1] + x * sn + y * cs)];
} };
});
if (livemode) S.clearWith(function () {
var mk = S.split().marker;
if (!mk) return null;
var c = centreOf(mk);
return { rep: { c: [r1(c[0]), r1(c[1])], size: amount('size'), rotation: amount('direction'), spacing: amount('spacing') } };
});
if (develop) {
var entering = false;
function drawing(ops) { return ops.some(function (op) { return op.t !== 'repeat' && op.t !== 'rset' && !(op.t === 'stroke' && op.tool === 'eraser'); }); }
function enter() {
var sp = S.split();
if (entering || sp.marker || !drawing(sp.source)) return Promise.resolve(false);
entering = true;
function go() {
entering = false;
if (S.split().marker) return false;
var op = { t: 'repeat', mode: 'grid' };
if (livemode) {
var b = box(); op.live = 1; op.c = [r1((b[0] + b[2]) / 2), r1((b[1] + b[3]) / 2)];
delete S.doc.settings.repeatOff;
}
S.commit(op); S.redraw();
return true;
}
return S.point('before-repeat', true).then(go, go);
}
var KIND = { size: 'size', rotation: 'direction', spacing: 'spacing' };
var list = (Array.isArray(cfg.controls) ? cfg.controls : cfg.control ? [cfg.control] : []).filter(function (k) { return KIND[k]; });
var asked = new URLSearchParams(location.search).get('control');
var first = list.indexOf(asked) >= 0 ? asked : list.indexOf(cfg.control) >= 0 ? cfg.control : list[0];
var ctl = first ? KIND[first] : null, input = null, out = null, bar = null;
var ENDS = { size: ['smaller', 'larger'], direction: ['turnLeft', 'turnRight'], spacing: ['closer', 'apart'] };
function showValue() { if (out) out.textContent = ctl === 'direction' ? Math.round(amount(ctl)) + '°' : ''; }
function show(kind) {
ctl = kind;
var V = VARY[kind], lo = bar.querySelector('.lo'), hi = bar.querySelector('.hi'), turn = kind === 'direction';
input.min = V.min; input.max = V.max; input.step = V.step; input.value = amount(kind);
input.setAttribute('aria-label', S.T[kind]); bar.setAttribute('aria-label', S.T[kind]);
lo.textContent = turn ? '↺' : S.T[ENDS[kind][0]]; hi.textContent = turn ? '↻' : S.T[ENDS[kind][1]];
[lo, hi].forEach(function (e) { if (turn) e.setAttribute('aria-hidden', 'true'); else e.removeAttribute('aria-hidden'); });
out.hidden = !turn;
var name = bar.querySelector('b'); if (name) name.textContent = S.T[kind];
bar.querySelectorAll('[role=tab]').forEach(function (t) { t.setAttribute('aria-selected', String(KIND[t.getAttribute('data-k')] === kind)); });
showValue();
}
if (cfg.together && list.length) {
bar = document.createElement('div');
bar.className = 'vary vary-all'; bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', S.T.repeat);
bar.innerHTML = list.map(function (k) {
var kind = KIND[k], turn = kind === 'direction', h = turn ? ' aria-hidden="true"' : '';
return '<div class="vary-line"><b>' + S.T[kind] + '</b><span class="lo"' + h + '>' + (turn ? '↺' : S.T[ENDS[kind][0]]) + '</span>' +
'<input type="range" data-kind="' + kind + '" aria-label="' + S.T[kind] + '"><span class="hi"' + h + '>' + (turn ? '↻' : S.T[ENDS[kind][1]]) + '</span>' +
(turn ? '<output></output>' : '') + '</div>';
}).join('');
S.$('tools').parentNode.insertBefore(bar, S.$('tools'));
var inputs = [].slice.call(bar.querySelectorAll('input'));
var head = null, sw = null, unitBtn = null, top = document.querySelector('.top');
if (livemode && top) {
head = sw = document.createElement('button');
sw.type = 'button'; sw.className = 'rp-switch'; sw.setAttribute('role', 'switch'); sw.hidden = true;
sw.innerHTML = '<i aria-hidden="true"></i><span></span>';
top.insertBefore(sw, top.querySelector('.title'));
sw.addEventListener('click', function () {
if (!S.split().marker) {
if (cfg.offer) enter().then(function (did) {
if (!did) return;
S.stage.classList.add('rp-reveal');
setTimeout(function () { S.stage.classList.remove('rp-reveal'); }, 1400);
});
return;
}
turn();
});
unitBtn = document.createElement('button');
unitBtn.type = 'button'; unitBtn.className = 'menu-item rp-unit'; unitBtn.hidden = true;
S.$('menu').appendChild(unitBtn);
unitBtn.addEventListener('click', function () { if (isLive(S.split().marker)) turn(); });
}
function turn() {
if (S.doc.settings.repeatOff) delete S.doc.settings.repeatOff; else S.doc.settings.repeatOff = true;
S.changed(); S.redraw();
}
var sync = function () {
inputs.forEach(function (i) { var k = i.getAttribute('data-kind'); if (!live || live.k !== NAME[k]) i.value = amount(k); });
var o = bar.querySelector('output'); if (o) o.textContent = Math.round(amount('direction')) + '°';
if (!head) return;
var sp = S.split(), offer = !!cfg.offer && !sp.marker && drawing(sp.source);
var on = !!sp.marker && !S.doc.settings.repeatOff, shown = isLive(sp.marker) || (offer && !cfg.seeIt), off = shown && !on;
var seeOffer = !!cfg.offer && !sp.marker;
head.hidden = !(shown || seeOffer); top.classList.toggle('has-switch', shown);
sw.classList.toggle('rp-offer', seeOffer && !shown); sw.disabled = seeOffer && !shown && !drawing(sp.source);
sw.setAttribute('aria-checked', String(on)); sw.querySelector('span').textContent = on ? S.T.repeatOn : S.T.repeatOff;
inputs.forEach(function (i) { i.disabled = off; });
bar.classList.toggle('off', off);
if (unitBtn) {
unitBtn.hidden = !isLive(sp.marker);
unitBtn.textContent = on ? S.T.unitDraw : S.T.unitBack;
}
};
inputs.forEach(function (i) {
var kind = i.getAttribute('data-kind'), V = VARY[kind];
i.min = V.min; i.max = V.max; i.step = V.step; i.value = amount(kind);
i.addEventListener('input', function () { live = { k: NAME[kind], v: clamp(kind, +i.value) }; sync(); S.redraw(); });
i.addEventListener('change', function () {
var v = clamp(kind, +i.value); live = null;
if (S.split().marker && v !== amount(kind)) S.commit({ t: 'rset', k: NAME[kind], v: v });
S.redraw();
});
});
S.watch(function () { bar.hidden = !S.split().marker; sync(); });
}
if (cfg.seeIt) {
var after = S.activity.promptAfter && (S.activity.promptAfter[S.lang] || S.activity.promptAfter.he), before = '', txt = null;
var see = document.createElement('button');
see.type = 'button'; see.className = 'btn rp-see'; see.textContent = S.T.seeIt;
see.addEventListener('click', function () {
enter().then(function (did) {
if (!did) return;
S.stage.classList.add('rp-reveal');
setTimeout(function () { S.stage.classList.remove('rp-reveal'); }, 1400);
});
});
var seeSync = function () {
var sp = S.split();
see.hidden = !!sp.marker; see.disabled = !sp.marker && !drawing(sp.source);
if (txt) txt.textContent = sp.marker && after ? after : before;
};
S.watch(seeSync);
Promise.resolve().then(function () {
var pr = document.querySelector('.prompt');
if (pr) { before = pr.textContent; txt = document.createElement('span'); txt.className = 'prompt-text'; pr.textContent = ''; pr.appendChild(txt); pr.appendChild(see); }
seeSync();
});
}
if (ctl && !bar) {
bar = document.createElement('div');
bar.className = 'vary'; bar.setAttribute('role', 'group');
bar.innerHTML = (list.length > 1
? '<div class="vary-tabs" role="tablist">' + list.map(function (k) { return '<button type="button" role="tab" data-k="' + k + '">' + S.T[KIND[k]] + '</button>'; }).join('') + '</div>'
: '<b></b>') +
'<div class="vary-row"><span class="lo"></span><input type="range" id="vary"><span class="hi"></span></div><output id="varyOut"></output>';
S.$('tools').parentNode.insertBefore(bar, S.$('tools'));
input = bar.querySelector('input'); out = bar.querySelector('output');
bar.querySelectorAll('[role=tab]').forEach(function (t) {
t.addEventListener('click', function () { if (!live) show(KIND[t.getAttribute('data-k')]); });
});
show(ctl);
input.addEventListener('input', function () { live = { k: NAME[ctl], v: clamp(ctl, +input.value) }; showValue(); S.redraw(); });
input.addEventListener('change', function () {
var v = clamp(ctl, +input.value); live = null;
if (S.split().marker && v !== amount(ctl)) S.commit({ t: 'rset', k: NAME[ctl], v: v });
S.redraw();
});
S.watch(function () {
bar.hidden = !S.split().marker;
if (!live) input.value = amount(ctl);
showValue();
});
}
this.ready = function () {
var clear = S.$('clear'); if (clear && !S.restart) clear.hidden = true;
if (bar) { bar.hidden = !S.split().marker; if (!cfg.together) show(ctl); }
if (!cfg.enter) return;
function reveal() { S.stage.classList.add('rp-reveal'); setTimeout(function () { S.stage.classList.remove('rp-reveal'); }, 1400); }
if (cfg.reveal && livemode && isLive(S.split().marker) && S.doc.settings.repeatOff) {
setTimeout(function () {
if (!S.doc.settings.repeatOff || !isLive(S.split().marker)) return;
delete S.doc.settings.repeatOff; S.changed(); S.redraw(); reveal();
}, 900);
return;
}
if (!cfg.reveal || S.split().marker || !drawing(S.split().source)) return enter();
setTimeout(function () {
enter().then(function (did) { if (did) reveal(); });
}, 900);
};
return;
}
if (vary) {
var V = VARY[vary], ends = { size: ['smaller', 'larger'], direction: ['turnLeft', 'turnRight'], spacing: ['closer', 'apart'] }[vary];
var bar = document.createElement('div');
bar.className = 'vary'; bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', S.T[vary]);
bar.innerHTML = '<b>' + S.T[vary] + '</b><div class="vary-row">' +
(vary === 'direction' ? '<span aria-hidden="true">↺</span>' : '<span>' + S.T[ends[0]] + '</span>') +
'<input type="range" id="vary" min="' + V.min + '" max="' + V.max + '" step="' + V.step + '" value="' + st.vary.value + '" aria-label="' + S.T[vary] + '">' +
(vary === 'direction' ? '<span aria-hidden="true">↻</span>' : '<span>' + S.T[ends[1]] + '</span>') + '</div>' +
(vary === 'direction' ? '<output id="varyOut"></output>' : '');
var tools = S.$('tools');
tools.parentNode.insertBefore(bar, tools);
var input = bar.querySelector('input'), out = bar.querySelector('output');
function show() { if (out) out.textContent = Math.round(st.vary.value) + '°'; }
input.addEventListener('input', function () { st.vary.value = +input.value; show(); S.changed(); S.redraw(); });
show();
var clear = S.$('clear'); if (clear) clear.hidden = true;
this.ready = function () { ['undo', 'redo'].forEach(function (b) { var e = S.$(b); if (e) e.hidden = true; }); };
return;
}
if (modes.length < 2) return;
S.item({ id: 'repeat', order: 50, label: 'repeat', panel: 'repeatPanel', icon: '<span id="repeatIcon"></span>',
onClick: function () { S.togglePanel('repeatPanel', 'repeat'); },
update: function () { var i = S.$('repeatIcon'); if (i.getAttribute('data-m') !== st.mode) { i.innerHTML = ICON[st.mode]; i.setAttribute('data-m', st.mode); } } });
var rp = document.createElement('div');
rp.className = 'panel'; rp.id = 'repeatPanel'; rp.hidden = true; rp.setAttribute('role', 'group'); rp.setAttribute('aria-label', S.T.repeats);
modes.forEach(function (m) {
var b = document.createElement('button');
b.type = 'button'; b.className = 'sz'; b.dataset.mode = m;
b.innerHTML = ICON[m] + '<span>' + S.T[m] + '</span>';
b.addEventListener('click', function () { pick(m); S.closePanels(); });
rp.appendChild(b);
});
S.stage.appendChild(rp);
function mark() { rp.querySelectorAll('.sz').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.mode === st.mode)); }); }
function pick(m) {
if (m === st.mode) return;
st.mode = m; mark(); S.changed(); S.redraw();
}
mark();
}
});
