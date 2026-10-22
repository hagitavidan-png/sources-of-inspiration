/*! Sources of Inspiration in Art | מקורות השראה באמנות. Original code and content (c) 2026 Hagit Avidan | חגית אבידן. All rights reserved | כל הזכויות שמורות. Works and materials by others belong to their owners | יצירות וחומרים של אחרים שייכים לבעליהם. See NOTICE.txt */
window.Studio = (function () {
'use strict';
var LOGICAL_W = 1000;
var TEXT = {
he: { back: 'חזרה לשיעור', title: 'היצירה שלי', undo: 'בטל', redo: 'בצע שוב', clear: 'נקה', save: 'שמור', cancel: 'ביטול',
exit: 'צא', clearQ: 'לנקות את כל היצירה?', unsaved: 'יש שינויים שלא נשמרו.', saved: 'היצירה נשמרה',
saveFailed: 'השמירה נכשלה', opened: 'העבודה השמורה נפתחה', canvas: 'משטח הציור', backGallery: 'חזרה ליצירות שלי', works: 'היצירות שלי',
autoSaved: 'נשמר', kept: 'נשמר', doneSaved: 'היצירה נשמרה', restart: 'להתחיל מחדש', restartQ: 'לנקות את הדף ולהתחיל מחדש?', newQ: 'רוצים להתחיל ציור חדש? הציור הנוכחי יישמר בגלריה ותוכלו לחזור אליו בכל זמן.', newYes: 'ציור חדש', newNo: 'ביטול', restartCancel: 'לבטל',
expand: 'הגדלה', expandLong: 'הגדלת אזור הציור', showAll: 'הצגת הכול', showAllLong: 'הצגת כל הכפתורים',
more: 'עוד', whole: 'כל הדף', wholeLong: 'הצגת כל הדף', fill: 'מילוי המסך', fillLong: 'הדף ממלא את המסך',
moveHint: 'אפשר להזיז את הדף בשתי אצבעות',
saveNow: 'שמירת הציור', savedNow: 'הציור נשמר', saveNowFailed: 'השמירה נכשלה. הציור עדיין פתוח – נסו שוב.',
varyToggle: 'הגדרות דפוס', panelOpen: 'הצגת כל הכלים וההגדרות', panelClose: 'סרגל כלים מצומצם' },
en: { back: 'Back to the lesson', title: 'My artwork', undo: 'Undo', redo: 'Redo', clear: 'Clear', save: 'Save', cancel: 'Cancel',
exit: 'Leave', clearQ: 'Clear the whole artwork?', unsaved: 'There are unsaved changes.', saved: 'Artwork saved',
saveFailed: 'Could not save', opened: 'Your saved work is open', canvas: 'Drawing area', backGallery: 'Back to my artworks', works: 'My artworks',
autoSaved: 'Saved', kept: 'Kept', doneSaved: 'Your artwork is saved', restart: 'Start over', restartQ: 'Clear the page and start over?', newQ: "Start a new drawing? Your current artwork will stay in My Artworks, so you can return to it anytime.", newYes: 'New drawing', newNo: 'Cancel', restartCancel: 'Cancel',
expand: 'Expand', expandLong: 'Make the drawing space bigger', showAll: 'Show all', showAllLong: 'Show all the buttons',
more: 'More', whole: 'Whole page', wholeLong: 'Show the whole page', fill: 'Fill the screen', fillLong: 'Let the page fill the screen',
moveHint: 'Move the page with two fingers',
saveNow: 'Save artwork', savedNow: 'Artwork saved', saveNowFailed: "Couldn't save. Your drawing is still open – try again.",
varyToggle: 'Pattern settings', panelOpen: 'Show all tools and settings', panelClose: 'Compact toolbar' }
};
var caps = {};
var renderers = {};
var basePainters = [];
var presenter = null;
var asStep = false;
var watchers = [];
var clearers = [];
var liveFn = null;
var pending = null, raf = 0;
var pointers = {};
var items = [];
var Q = (function () {
var q = new URLSearchParams(location.search);
function add(s) { new URLSearchParams(s).forEach(function (v, k) { if (!q.has(k)) q.set(k, v); }); }
add(location.hash.replace(/^#/, ''));
if (!q.has('activity')) { try { add(sessionStorage.getItem('studio-open') || ''); } catch (e) {} }
return q;
})();
var $ = function (id) { return document.getElementById(id); };
var app, stage, canvas, ctx, base, bctx;
var activity, LANG, T, KEY, BACK;
var ID = /^[A-Za-z0-9-]{1,64}$/;
var ART = ID.test(Q.get('art') || '') ? Q.get('art') : null, FROM = ID.test(Q.get('from') || '') ? Q.get('from') : null;
var ENTRY, created = null;
var paper = false;
var tools = [];
var doc = { w: LOGICAL_W, h: 750, ops: [], settings: {} };
var redoStack = [];
var tail = [];
var version = 0, savedVersion = 0;
var scale = 1;
var view = { z: 1, x: 0, y: 0, fill: false, cover: 1 };
var ZMAX = 3, MAXPX = 8e6, MAXSIDE = 4096;
var SHEET = '#fffdf9';
var state = { tool: null };
function register(id, def) { caps[id] = def; }
function freeze(o) {
if (o && typeof o === 'object') { Object.keys(o).forEach(function (k) { freeze(o[k]); }); Object.freeze(o); }
return o;
}
function safeBack(v) {
if (typeof v !== 'string') return null;
v = v.trim();
if (!v || /[\u0000-\u001f\\]/.test(v)) return null;
if (/^[a-z][a-z0-9+.\-]*:/i.test(v)) return null;
if (/^\/\//.test(v)) return null;
try {
var u = new URL(v, location.href);
if (u.origin !== location.origin) return null;
} catch (e) { return null; }
return v;
}
function aspect(a) {
var m = /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/.exec(String(a || ''));
return m && +m[1] > 0 && +m[2] > 0 ? +m[2] / +m[1] : 3 / 4;
}
function visibleOps() {
var from = 0;
for (var i = doc.ops.length - 1; i >= 0; i--) if (doc.ops[i].t === 'clear') { from = i + 1; break; }
return doc.ops.slice(from);
}
function paintOps(ops, c) {
ops.forEach(function (op) { var r = renderers[op.t]; if (r) r(op, c); });
c.globalCompositeOperation = 'source-over';
}
function paint(c) { paintOps(visibleOps(), c); }
function lastClear() {
for (var i = doc.ops.length - 1; i >= 0; i--) if (doc.ops[i].t === 'clear') return doc.ops[i];
return null;
}
function split() {
var ops = visibleOps(), at = -1;
for (var i = ops.length - 1; i >= 0; i--) if (ops[i].t === 'repeat') { at = i; break; }
if (at >= 0) return { source: ops.slice(0, at), marker: ops[at], after: ops.slice(at + 1) };
var lc = lastClear();
return lc && lc.rep ? { source: [], marker: lc, after: ops } : { source: ops, marker: null, after: [] };
}
function unitOf(op) { return op.u === 1; }
function paintLearner(c) {
if (!presenter) return paint(c);
if (!asStep) return presenter(c, paint);
var sp = split();
if (!sp.marker) return paintOps(sp.source, c);
var unit = sp.source.concat(sp.after.filter(unitOf)), over = sp.after.filter(function (op) { return !unitOf(op); });
presenter(c, function (x) { paintOps(unit, x); }, { unit: unit, marker: sp.marker, pending: c === ctx && pending && pending.u ? pending : null, screen: c === ctx });
paintOps(over, c);
}
function pend(op) {
pending = op;
if (!op) { if (raf) cancelAnimationFrame(raf); raf = 0; return; }
if (!raf) raf = requestAnimationFrame(function () { raf = 0; wipe(ctx, canvas); paintLearner(ctx); });
}
function paintBase(c) {
basePainters.forEach(function (fn) { c.save(); fn(c); c.restore(); });
}
function wipe(c, el) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, el.width, el.height); c.restore(); }
function redraw() {
wipe(bctx, base); paintBase(bctx);
wipe(ctx, canvas); paintLearner(ctx);
}
function layout() {
var root = document.documentElement, was = root.classList.contains('side');
stage.style.setProperty('--page-h', String(doc.h / doc.w));
if (!(innerWidth >= 640 && innerWidth > innerHeight)) { root.classList.remove('side'); return; }
var app = stage.parentNode, compact = root.classList.contains('compact'), expanded = root.classList.contains('expanded');
if (compact && !expanded && innerHeight > 520 && root.classList.contains('panel-closed')) app.style.setProperty('--side', '64px');
else if (innerHeight <= 520 || (expanded && !compact) || (compact && matchMedia('(min-width:1500px) and (orientation:landscape)').matches)) app.style.removeProperty('--side');
else if (expanded) app.style.setProperty('--side', Math.round(Math.max(176, Math.min(240, innerWidth - (innerHeight - 4) * doc.w / doc.h - 6))) + 'px');
else app.style.setProperty('--side', Math.round(Math.max(176, Math.min(300, innerWidth - (innerHeight - 20) * doc.w / doc.h - 17))) + 'px');
function room(side) {
root.classList.toggle('side', side);
var r = stage.getBoundingClientRect(), cs = getComputedStyle(stage);
return Math.min((r.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) / doc.w, (r.height - 4) / doc.h);
}
var under = room(false), beside = room(true);
root.classList.toggle('side', beside > under * 1.04);
if (root.classList.contains('side') !== was) Studio.shell.closePanels(true);
}
function room() {
var r = stage.getBoundingClientRect(), cs = getComputedStyle(stage), root = document.documentElement;
var pl = parseFloat(cs.paddingLeft) || 0;
return { r: r, W: r.width, H: r.height, aw: r.width - pl * 2, ah: r.height - 4, pl: pl, pt: parseFloat(cs.paddingTop) || 0,
centre: root.classList.contains('side') || root.classList.contains('expanded') };
}
function place(b, z, x, y) {
var pw = Math.floor(doc.w * scale * z), ph = Math.floor(doc.h * scale * z);
function clamp(v, lo) { return Math.min(0, Math.max(lo, v)); }
return { pw: pw, ph: ph,
x: pw <= b.aw ? b.pl + (b.aw - pw) / 2 : clamp(x, b.W - pw),
y: ph <= b.ah ? (b.centre ? (b.H - ph) / 2 : b.pt) : clamp(y, b.H - ph) };
}
function cover(b) {
var t = $('tray'), extra = t && !document.documentElement.classList.contains('side') ? t.getBoundingClientRect().height : 0;
return Math.min(ZMAX, Math.max(b.aw / (doc.w * scale), (b.H + extra) / (doc.h * scale)));
}
function fit() {
var b = room();
scale = Math.max(0.01, Math.min(b.aw / doc.w, b.ah / doc.h));
view.cover = cover(b);
if (view.fill) view.z = view.cover > 1.04 ? view.cover : 1;
var q = place(b, view.z, view.x, view.y), cw = q.pw, ch = q.ph, dpr = window.devicePixelRatio || 1;
view.x = q.x; view.y = q.y;
var k = dpr;
if (view.z > 1) {
var most = Math.min(Math.sqrt(MAXPX / (cw * ch)), MAXSIDE / Math.max(cw, ch));
k = Math.min(dpr, Math.max(most, dpr / view.z));
}
[canvas, base].forEach(function (el) {
el.style.width = cw + 'px'; el.style.height = ch + 'px';
el.style.left = q.x + 'px'; el.style.top = q.y + 'px';
el.width = Math.round(cw * k); el.height = Math.round(ch * k);
});
var u = view.z > 1 ? canvas.width / doc.w : dpr * scale;
ctx.setTransform(u, 0, 0, u, 0, 0);
bctx.setTransform(u, 0, 0, u, 0, 0);
redraw();
if (Studio.shell.view) Studio.shell.view({ z: view.z, fill: view.fill, cover: view.cover });
}
function setView(mode) {
var b = room();
scale = Math.max(0.01, Math.min(b.aw / doc.w, b.ah / doc.h));
var z = cover(b);
if (mode === 'fill' && z > 1.04) {
view.z = z; view.fill = true;
view.x = (b.W - Math.floor(doc.w * scale * z)) / 2; view.y = 0;
} else { view.z = 1; view.fill = false; }
fit();
return view.z > 1;
}
function zoomAt(z, ax, ay) {
z = Math.min(ZMAX, Math.max(1, z));
var f = z / view.z;
view.x = ax - (ax - view.x) * f; view.y = ay - (ay - view.y) * f; view.z = z < 1.01 ? 1 : z; view.fill = false;
fit();
}
var touches = {}, gesture = null, downAt = 0, from = null, went = 0, YOUNG_MS = 300, YOUNG_PX = 12;
function young() { return performance.now() - downAt < YOUNG_MS || went < YOUNG_PX; }
function pair() {
var k = Object.keys(touches), a = touches[k[0]], c = touches[k[1]];
return { c: [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2], d: Math.max(1, Math.hypot(a[0] - c[0], a[1] - c[1])) };
}
function cancelStroke() {
var h = handler; activeId = null; handler = null; app.classList.remove('drawing');
if (!h) return;
if (h.cancel) h.cancel(); else h.up({ type: 'pointercancel', clientX: NaN, clientY: NaN });
}
function startGesture() {
var p = pair(), b = room();
gesture = { c0: p.c, d0: p.d, z0: view.z, x0: view.x, y0: view.y, b: b, z: view.z, x: view.x, y: view.y };
Studio.shell.closePanels(true);
}
function moveGesture() {
var g = gesture, p = pair(), r = g.b.r;
var z = Math.min(ZMAX, Math.max(1, g.z0 * p.d / g.d0)), f = z / g.z0;
var x = (p.c[0] - r.left) - (g.c0[0] - r.left - g.x0) * f, y = (p.c[1] - r.top) - (g.c0[1] - r.top - g.y0) * f;
var q = place(g.b, z, x, y), s = q.pw / Math.floor(doc.w * scale * g.z0);
g.z = z; g.x = q.x; g.y = q.y;
var t = 'translate(' + (q.x - g.x0) + 'px,' + (q.y - g.y0) + 'px) scale(' + s + ')';
[canvas, base].forEach(function (el) { el.style.transformOrigin = '0 0'; el.style.transform = t; });
}
function endGesture() {
var g = gesture; gesture = null;
[canvas, base].forEach(function (el) { el.style.transform = ''; el.style.transformOrigin = ''; });
view.z = g.z < 1.01 ? 1 : g.z; view.x = g.x; view.y = g.y; view.fill = false;
fit();
}
var wheelRaf = 0, wheelTo = null;
function onWheel(e) {
if (gesture || activeId !== null) return;
var r = stage.getBoundingClientRect(), ax = e.clientX - r.left, ay = e.clientY - r.top;
var unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? r.height : 1, dx = e.deltaX * unit, dy = e.deltaY * unit;
if (e.ctrlKey || e.metaKey) {
wheelTo = { z: Math.min(ZMAX, Math.max(1, (wheelTo ? wheelTo.z : view.z) * Math.exp(-dy * 0.01))), ax: ax, ay: ay };
} else {
if (view.z <= 1) return;
if (e.shiftKey && !dx) { dx = dy; dy = 0; }
view.x -= dx; view.y -= dy;
}
e.preventDefault();
if (!wheelRaf) wheelRaf = requestAnimationFrame(function () {
wheelRaf = 0;
if (wheelTo) { var w = wheelTo; wheelTo = null; zoomAt(w.z, w.ax, w.ay); } else fit();
});
}
function commit(op) { doc.ops.push(op); redoStack = []; changed(); }
function changed() { version++; updateUi(); schedule(); }
function canUndo() { return doc.ops.length > (doc.ops[0] && doc.ops[0].t === 'clear' && doc.ops[0].rep ? 1 : 0); }
function undo() { if (!canUndo()) return; redoStack.push(doc.ops.pop()); changed(); redraw(); }
function redo() { if (!redoStack.length) return; doc.ops.push(redoStack.pop()); changed(); redraw(); }
function clearAll() {
var op = { t: 'clear' };
clearers.forEach(function (fn) { var x = fn(); if (x) Object.assign(op, x); });
commit(op); redraw();
}
function hasDrawing() { return visibleOps().length > 0; }
function dirty() { return version !== savedVersion; }
function updateUi() {
$('undo').disabled = !canUndo();
$('redo').disabled = !redoStack.length;
$('clear').disabled = !hasDrawing();
if ($('restartTool')) $('restartTool').disabled = !hasDrawing();
items.forEach(function (it) { if (it.update) it.update($(it.id)); });
watchers.forEach(function (fn) { fn(); });
}
var activeId = null, handler = null;
function pt(e) {
var r = canvas.getBoundingClientRect();
var k = scale * view.z;
return [Math.round((e.clientX - r.left) / k * 10) / 10, Math.round((e.clientY - r.top) / k * 10) / 10];
}
function onDown(e) {
if (e.pointerType === 'touch') {
touches[e.pointerId] = [e.clientX, e.clientY];
try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
if (gesture) return e.preventDefault();
if (Object.keys(touches).length === 2 && (activeId === null || young())) {
if (activeId !== null) cancelStroke();
startGesture(); e.preventDefault(); return;
}
}
if (activeId !== null) return;
if (e.pointerType === 'mouse' && e.button !== 0) return;
Studio.shell.closePanels(true);
handler = pointers[state.tool];
if (!handler) return;
activeId = e.pointerId; downAt = performance.now(); from = [e.clientX, e.clientY]; went = 0;
try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
app.classList.add('drawing');
handler.down(e);
e.preventDefault();
}
function onMove(e) {
if (touches[e.pointerId]) touches[e.pointerId] = [e.clientX, e.clientY];
if (gesture) { if (touches[e.pointerId]) { moveGesture(); e.preventDefault(); } return; }
if (e.pointerId !== activeId || !handler) return;
if (from) went = Math.max(went, Math.abs(e.clientX - from[0]) + Math.abs(e.clientY - from[1]));
var list = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
handler.move(list.length ? list : [e]);
e.preventDefault();
}
function onUp(e) {
var finger = !!touches[e.pointerId];
delete touches[e.pointerId];
if (finger && gesture) return endGesture();
if (e.pointerId !== activeId) return;
activeId = null; app.classList.remove('drawing');
var h = handler; handler = null;
if (h) h.up(e);
}
function preview() {
var W = 480, k = W / doc.w, H = Math.round(doc.h * k);
var c = document.createElement('canvas'); c.width = W; c.height = H;
var x = c.getContext('2d');
var ink = document.createElement('canvas'); ink.width = W; ink.height = H;
var y = ink.getContext('2d'); y.setTransform(k, 0, 0, k, 0, 0);
var own = doc.ops;
if (tail.length) doc.ops = own.concat(tail);
try { paintLearner(y); } finally { doc.ops = own; }
x.fillStyle = '#fffdf9'; x.fillRect(0, 0, W, H);
x.save(); x.setTransform(k, 0, 0, k, 0, 0); paintBase(x); x.restore();
x.drawImage(ink, 0, 0);
return c.toDataURL('image/png');
}
function startOps() { var lc = lastClear(); return lc && lc.rep ? [lc] : []; }
function record() {
var data = { v: 2, activity: { id: activity.id, lesson: activity.lesson }, lang: LANG, back: BACK,
savedAt: new Date().toISOString(), canvas: { aspect: activity.canvas.aspect, w: doc.w, h: doc.h },
ops: startOps().concat(visibleOps(), tail), preview: preview() };
if (Object.keys(doc.settings).length) data.settings = doc.settings;
return data;
}
var AUTO_MS = 1000, timer = null, chain = Promise.resolve(true);
function autosaves() { return !!ART && !paper; }
function schedule() {
if (!autosaves()) return;
clearTimeout(timer); timer = setTimeout(flush, AUTO_MS);
Studio.shell.saveState('pending');
}
function flush(away) {
clearTimeout(timer); timer = null;
if (!autosaves() || !dirty()) return chain;
var at = version, data;
try { data = record(); } catch (e) { Studio.shell.saveState('error'); return Promise.resolve(false); }
data.id = ART; data.activity.entry = ENTRY;
if (created) data.createdAt = created;
if (away) window.Artworks.stash(data);
Studio.shell.saveState('saving');
chain = chain.then(function () {
return window.Artworks.put(data).then(function (w) {
created = w.createdAt; if (at > savedVersion) savedVersion = at;
if (at === version) window.Artworks.unstash(ART);
Studio.shell.saveState(dirty() ? 'pending' : 'saved');
return true;
}, function () { Studio.shell.saveState('error'); return false; });
});
return chain;
}
function point(kind, once) {
if (!autosaves()) return Promise.resolve(null);
return flush().then(function () {
if (dirty()) throw new Error('not written');
if (!once) return window.Artworks.addPoint(ART, kind);
return window.Artworks.get(ART).then(function (w) {
var now = w && JSON.stringify([w.canvas, w.ops, w.settings]);
var same = w && (w.points || []).filter(function (p) { return p.kind === kind && JSON.stringify([p.state.canvas, p.state.ops, p.state.settings]) === now; })[0];
return same || window.Artworks.addPoint(ART, kind);
});
});
}
function startNew() {
var A = window.Artworks, lesson = null;
return flush().then(function () {
if (dirty()) throw new Error('not written');
return A.get(ART);
}).then(function (w) {
lesson = (w && w.lesson) || activity.works || null;
return lesson ? A.runs(lesson) : [];
}).then(function (runs) {
var mine = runs.filter(function (r) { return r.artwork === ART; }).pop() || null;
var op = { t: 'clear' }; clearers.forEach(function (fn) { var x = fn(); if (x) Object.assign(op, x); });
var id = A.newId();
var rec = { id: id, medium: 'digital', lesson: lesson, v: 2, activity: { id: activity.id, lesson: activity.lesson, entry: ENTRY }, lang: LANG, back: BACK,
canvas: { aspect: activity.canvas.aspect, w: doc.w, h: doc.h }, ops: op.rep ? [op] : [] };
if (Object.keys(doc.settings).length) rec.settings = JSON.parse(JSON.stringify(doc.settings));
var run = mine ? JSON.parse(JSON.stringify(mine)) : { lesson: lesson, medium: 'studio' };
run.id = A.newId(); run.artwork = id; delete run.createdAt; delete run.updatedAt; delete run.done;
return A.put(rec).then(function () { return lesson ? A.putRun(run) : null; }).then(function () {
try { if (lesson) sessionStorage.setItem('run:' + lesson, run.id); } catch (e) {}
var q = new URLSearchParams(Q.toString()); q.set('art', id); q['delete']('from');
try { if (sessionStorage.getItem('studio-open')) sessionStorage.setItem('studio-open', q.toString()); } catch (e) {}
Studio.shell.reopen(location.pathname + '#' + q.toString());
return id;
});
});
}
function save() {
if (ART) return flush().then(function () { return !dirty(); });
var data;
try { data = record(); } catch (e) { Studio.shell.toast(T.saveFailed); return false; }
try {
localStorage.setItem(KEY, JSON.stringify(data));
savedVersion = version;
Studio.shell.toast(T.saved);
return true;
} catch (e) {
Studio.shell.toast(T.saveFailed);
return false;
}
}
function apply(data) {
if (!data || data.v !== 2 || !data.canvas || !Array.isArray(data.ops)) return false;
doc.w = data.canvas.w; doc.h = data.canvas.h; doc.ops = data.ops;
if (data.settings && typeof data.settings === 'object') doc.settings = data.settings;
return data.ops.length > 0;
}
function load() {
var raw = null;
try { raw = localStorage.getItem(KEY); } catch (e) {}
if (!raw) return false;
try { return apply(JSON.parse(raw)); } catch (e) { return false; }
}
function loadArt() {
var A = window.Artworks;
return A.get(ART).then(function (w) {
if (w && w.medium === 'paper') { paper = true; return null; }
if (w) { created = w.createdAt; return w; }
return FROM ? A.get(FROM) : null;
}).then(function (w) {
if (!w) return false;
try { return apply(JSON.parse(JSON.stringify(w))); } catch (e) { return false; }
}, function () { return false; });
}
function fitPortrait() {
var cv = activity.canvas, ch = document.querySelector('div.chrome');
if (!cv.portrait || doc.ops.length || !(innerHeight > innerWidth) || !ch) return;
var w = Math.max(1, stage.getBoundingClientRect().width - 4), free = innerHeight - ch.getBoundingClientRect().bottom - 20;
var r = Math.max(aspect(cv.portrait), Math.floor(Math.min(1.6, (w * doc.h / doc.w + free) / w) * 20) / 20);
if (Math.abs(r - doc.h / doc.w) < .01) return;
cv.aspect = '20:' + Math.round(r * 20); doc.h = Math.round(LOGICAL_W * r);
layout(); fit();
}
function boot() {
var list = window.STUDIO_ACTIVITIES || {};
var id = Q.get('activity') || 'drawing';
if (!list[id]) { console.warn('Studio: no activity "' + id + '", using "drawing"'); id = 'drawing'; }
activity = Object.assign({ canvas: {} }, list[id]);
activity.canvas = Object.assign({ aspect: '4:3' }, activity.canvas);
LANG = Q.get('lang') || (function () { try { return localStorage.getItem('sourcesLang'); } catch (e) { return null; } })() || 'he';
if (!TEXT[LANG]) LANG = 'he';
tools = (activity.tools || []).filter(function (t) {
if (!caps[t]) console.warn('Studio: tool "' + t + '" is not available');
return !!caps[t];
});
T = Object.assign({}, TEXT[LANG]);
tools.forEach(function (t) { Object.assign(T, (caps[t].strings || {})[LANG]); });
if (activity.title && activity.title[LANG]) T.title = activity.title[LANG];
if (activity.restart) { T.clear = T.restart; T.clearQ = T.restartQ; T.cancel = T.restartCancel; }
document.documentElement.lang = LANG;
document.documentElement.dir = LANG === 'he' ? 'rtl' : 'ltr';
if (activity.compact) document.documentElement.classList.add('compact');
BACK = safeBack(Q.get('back')) || safeBack(activity.back) || '../../index.html';
if (Q.get('ctx') === 'gallery') T.back = T.backGallery;
ENTRY = id;
KEY = 'studio-v2:' + activity.lesson + ':' + activity.id;
if (activity.canvas.portrait && innerHeight > innerWidth) activity.canvas.aspect = activity.canvas.portrait;
else if (activity.canvas.landscape && innerWidth > innerHeight && innerHeight > 520 && window.matchMedia && matchMedia('(any-pointer: coarse)').matches) activity.canvas.aspect = activity.canvas.landscape;
doc.w = LOGICAL_W; doc.h = Math.round(LOGICAL_W * aspect(activity.canvas.aspect));
app = $('app'); stage = $('stage'); canvas = $('canvas'); ctx = canvas.getContext('2d');
base = document.createElement('canvas'); base.id = 'base'; base.setAttribute('aria-hidden', 'true');
stage.insertBefore(base, canvas); bctx = base.getContext('2d');
canvas.setAttribute('aria-label', T.canvas);
canvas.addEventListener('touchmove', function (e) { if (e.cancelable) e.preventDefault(); }, { passive: false });
canvas.addEventListener('pointerdown', onDown);
canvas.addEventListener('pointermove', onMove);
canvas.addEventListener('pointerup', onUp);
canvas.addEventListener('pointercancel', onUp);
canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });
if (!window.Artworks) ART = null;
if (ART) loadArt().then(start); else start(load());
}
function start(reopened) {
if (activity.source) {
for (var at = doc.ops.length - 1; at >= 0 && doc.ops[at].t !== 'repeat'; at--) {}
if (at >= 0) { tail = doc.ops.slice(at); doc.ops = doc.ops.slice(0, at); }
}
var info = freeze(JSON.parse(JSON.stringify({ id: activity.id, lesson: activity.lesson, tools: activity.tools || [],
canvas: activity.canvas, params: activity.params || {}, content: activity.content || {},
promptAfter: activity.promptAfter || null })));
var api = {
T: T, lang: LANG, state: state, doc: doc, $: $, stage: stage, activity: info,
art: ART,
leaveTo: function (href) { return flush().then(function () { if (!dirty()) Studio.shell.leaveTo(href); }); },
ctx: function () { return ctx; }, scale: function () { return scale; }, pt: pt,
sheet: SHEET,
commit: commit, redraw: redraw, updateUi: updateUi, paintOps: paintOps,
restart: !!activity.restart,
clearWith: function (fn) { clearers.push(fn); },
live: function (fn) { liveFn = fn; },
liveStart: function (p) { return liveFn ? liveFn(p) : null; },
pend: pend,
has: function (t) { return tools.indexOf(t) >= 0; },
renderer: function (type, fn) { renderers[type] = fn; },
base: function (fn) { basePainters.push(fn); },
present: function (fn, step) { presenter = fn; asStep = !!step; },
split: split,
watch: function (fn) { watchers.push(fn); },
changed: changed,
point: point,
pointer: function (toolId, h) { pointers[toolId] = h; },
item: function (it) { items.push(it); },
closePanels: function (keep) { Studio.shell.closePanels(keep); },
togglePanel: function (panel, btn) { Studio.shell.togglePanel(panel, btn); }
};
tools.forEach(function (t) { caps[t].init(api); });
if (!state.tool) tools.some(function (t) { return (state.tool = caps[t].tool || null); });
items.sort(function (a, b) { return a.order - b.order; });
Studio.shell.build({ T: T, items: items, undo: undo, redo: redo, clearAll: clearAll, hasDrawing: hasDrawing,
save: save, dirty: dirty, startNew: autosaves() ? startNew : null, back: function () { return BACK; }, auto: autosaves(), flush: flush, layout: layout, setView: setView,
clear: activity.clear !== false || !!activity.restart, point: point,
keep: autosaves() && activity.keep && activity.keep.label && activity.keep.label[LANG] || null,
next: autosaves() && activity.next && activity.next.label && activity.next.label[LANG] || null,
source: !!activity.source, prompt: activity.prompt && activity.prompt[LANG] || null,
paper: autosaves() && activity.paper && safeBack(activity.paper.href) ? { href: safeBack(activity.paper.href), label: activity.paper.label[LANG] || activity.paper.label.he } : null,
works: !autosaves() || !activity.works ? null : /^\d+$/.test(Q.get('at') || '') ? '../index.html#/gallery/' + activity.works + '/' + Q.get('at') :
Q.get('ctx') === 'gallery' ? BACK : null });
tools.forEach(function (t) { if (caps[t].ready) caps[t].ready(); });
layout();
fit();
updateUi();
requestAnimationFrame(function () { requestAnimationFrame(fitPortrait); });
if (reopened && !autosaves()) Studio.shell.toast(T.opened);
var rt;
function refit() { clearTimeout(rt); rt = setTimeout(function () { if (window.scrollX || window.scrollY) window.scrollTo(0, 0); layout(); if (view.fill) setView('fill'); else fit(); }, 80); }
window.addEventListener('resize', refit);
if (window.visualViewport) window.visualViewport.addEventListener('resize', refit);
window.addEventListener('orientationchange', refit);
window.addEventListener('pageshow', refit);
setTimeout(refit, 500);
stage.addEventListener('wheel', onWheel, { passive: false });
if (window.ResizeObserver) {
var sw = 0, sh = 0;
new ResizeObserver(function (e) {
var b = e[0].contentRect; if (Math.round(b.width) === sw && Math.round(b.height) === sh) return;
sw = Math.round(b.width); sh = Math.round(b.height); clearTimeout(rt); rt = setTimeout(fit, 30);
}).observe(stage);
}
window.__studio = { doc: doc, state: state, dirty: dirty, key: KEY, art: ART, lang: LANG, activity: activity, back: BACK, tools: tools,
flush: flush, point: point, auto: autosaves(), split: split, scale: function () { return scale; },
view: function () { return { z: view.z, x: view.x, y: view.y, fill: view.fill, cover: view.cover }; } };
}
return { register: register, boot: boot, safeBack: safeBack, point: point };
})();
