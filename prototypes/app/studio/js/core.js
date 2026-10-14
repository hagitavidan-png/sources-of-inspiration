/*! Sources of Inspiration in Art | מקורות השראה באמנות. Original code and content (c) 2026 Hagit Avidan | חגית אבידן. All rights reserved | כל הזכויות שמורות. Works and materials by others belong to their owners | יצירות וחומרים של אחרים שייכים לבעליהם. See NOTICE.txt */
window.Studio = (function () {
'use strict';
var LOGICAL_W = 1000;
var TEXT = {
he: { back: 'חזרה לשיעור', title: 'היצירה שלי', undo: 'בטל', redo: 'בצע שוב', clear: 'נקה', save: 'שמור', cancel: 'ביטול',
exit: 'צא', clearQ: 'לנקות את כל היצירה?', unsaved: 'יש שינויים שלא נשמרו.', saved: 'היצירה נשמרה',
saveFailed: 'השמירה נכשלה', opened: 'העבודה השמורה נפתחה', canvas: 'משטח הציור', backGallery: 'חזרה ליצירות שלי', works: 'היצירות שלי',
autoSaved: 'נשמר', kept: 'נשמר', restart: 'להתחיל מחדש', restartQ: 'לנקות את הדף ולהתחיל מחדש?', restartCancel: 'לבטל' },
en: { back: 'Back to the lesson', title: 'My artwork', undo: 'Undo', redo: 'Redo', clear: 'Clear', save: 'Save', cancel: 'Cancel',
exit: 'Leave', clearQ: 'Clear the whole artwork?', unsaved: 'There are unsaved changes.', saved: 'Artwork saved',
saveFailed: 'Could not save', opened: 'Your saved work is open', canvas: 'Drawing area', backGallery: 'Back to my artworks', works: 'My artworks',
autoSaved: 'Saved', kept: 'Kept', restart: 'Start over', restartQ: 'Clear the page and start over?', restartCancel: 'Cancel' }
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
var Q = new URLSearchParams(location.search);
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
function fit() {
var r = stage.getBoundingClientRect();
var availW = r.width - (parseFloat(getComputedStyle(stage).paddingLeft) * 2 || 0), availH = r.height - 4;
scale = Math.max(0.01, Math.min(availW / doc.w, availH / doc.h));
var cw = Math.floor(doc.w * scale), ch = Math.floor(doc.h * scale), dpr = window.devicePixelRatio || 1;
canvas.style.width = cw + 'px'; canvas.style.height = ch + 'px';
canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
base.style.width = canvas.style.width; base.style.height = canvas.style.height;
var c = canvas.getBoundingClientRect();
var left = c.left + c.width / 2 - cw / 2, top = c.top + c.height / 2 - ch / 2;
base.style.left = (left - r.left - stage.clientLeft) + 'px'; base.style.top = (top - r.top - stage.clientTop) + 'px';
base.width = canvas.width; base.height = canvas.height;
bctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
redraw();
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
items.forEach(function (it) { if (it.update) it.update($(it.id)); });
watchers.forEach(function (fn) { fn(); });
}
var activeId = null, handler = null;
function pt(e) {
var r = canvas.getBoundingClientRect();
return [Math.round((e.clientX - r.left) / scale * 10) / 10, Math.round((e.clientY - r.top) / scale * 10) / 10];
}
function onDown(e) {
if (activeId !== null) return;
if (e.pointerType === 'mouse' && e.button !== 0) return;
Studio.shell.closePanels();
handler = pointers[state.tool];
if (!handler) return;
activeId = e.pointerId;
try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
app.classList.add('drawing');
handler.down(e);
e.preventDefault();
}
function onMove(e) {
if (e.pointerId !== activeId || !handler) return;
var list = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
handler.move(list.length ? list : [e]);
e.preventDefault();
}
function onUp(e) {
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
doc.w = LOGICAL_W; doc.h = Math.round(LOGICAL_W * aspect(activity.canvas.aspect));
app = $('app'); stage = $('stage'); canvas = $('canvas'); ctx = canvas.getContext('2d');
base = document.createElement('canvas'); base.id = 'base'; base.setAttribute('aria-hidden', 'true');
stage.insertBefore(base, canvas); bctx = base.getContext('2d');
canvas.setAttribute('aria-label', T.canvas);
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
canvas: activity.canvas, params: activity.params || {}, content: activity.content || {} })));
var api = {
T: T, lang: LANG, state: state, doc: doc, $: $, stage: stage, activity: info,
ctx: function () { return ctx; }, scale: function () { return scale; }, pt: pt,
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
closePanels: function () { Studio.shell.closePanels(); },
togglePanel: function (panel, btn) { Studio.shell.togglePanel(panel, btn); }
};
tools.forEach(function (t) { caps[t].init(api); });
if (!state.tool) tools.some(function (t) { return (state.tool = caps[t].tool || null); });
items.sort(function (a, b) { return a.order - b.order; });
Studio.shell.build({ T: T, items: items, undo: undo, redo: redo, clearAll: clearAll, hasDrawing: hasDrawing,
save: save, dirty: dirty, back: function () { return BACK; }, auto: autosaves(), flush: flush,
clear: activity.clear !== false || !!activity.restart, point: point,
keep: autosaves() && activity.keep && activity.keep.label && activity.keep.label[LANG] || null,
next: autosaves() && activity.next && activity.next.label && activity.next.label[LANG] || null,
source: !!activity.source, prompt: activity.prompt && activity.prompt[LANG] || null,
works: autosaves() && activity.works && /^\d+$/.test(Q.get('at') || '') ? '../index.html#/gallery/' + activity.works + '/' + Q.get('at') : null });
tools.forEach(function (t) { if (caps[t].ready) caps[t].ready(); });
fit();
updateUi();
if (reopened && !autosaves()) Studio.shell.toast(T.opened);
var rt;
window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(fit, 80); });
if (window.ResizeObserver) {
var sw = 0, sh = 0;
new ResizeObserver(function (e) {
var b = e[0].contentRect; if (Math.round(b.width) === sw && Math.round(b.height) === sh) return;
sw = Math.round(b.width); sh = Math.round(b.height); clearTimeout(rt); rt = setTimeout(fit, 30);
}).observe(stage);
}
window.__studio = { doc: doc, state: state, dirty: dirty, key: KEY, art: ART, lang: LANG, activity: activity, back: BACK, tools: tools,
flush: flush, point: point, auto: autosaves(), split: split, scale: function () { return scale; } };
}
return { register: register, boot: boot, safeBack: safeBack, point: point };
})();
