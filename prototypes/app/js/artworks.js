/*! Sources of Inspiration in Art | מקורות השראה באמנות. Original code and content (c) 2026 Hagit Avidan | חגית אבידן. All rights reserved | כל הזכויות שמורות. Works and materials by others belong to their owners | יצירות וחומרים של אחרים שייכים לבעליהם. See NOTICE.txt */
window.Artworks = (function () {
'use strict';
var DB = 'sources-app', VERSION = 2, STORES = ['artworks', 'attempts', 'meta'];
var STATE = ['canvas', 'ops', 'settings', 'preview'];
var last = 0;
function now() { var t = Date.now(); if (t <= last) t = last + 1; last = t; return new Date(t).toISOString(); }
function clone(v) { return v === undefined ? v : JSON.parse(JSON.stringify(v)); }
function newId() {
if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12);
}
function req(r) { return new Promise(function (ok, no) { r.onsuccess = function () { ok(r.result); }; r.onerror = function () { no(r.error); }; }); }
function done(tx) { return new Promise(function (ok, no) { tx.oncomplete = function () { ok(); }; tx.onerror = tx.onabort = function () { no(tx.error); }; }); }
function open() {
return new Promise(function (ok, no) {
if (!window.indexedDB) return no(new Error('no IndexedDB'));
var r = indexedDB.open(DB, VERSION);
r.onupgradeneeded = function () {
var d = r.result;
if (!d.objectStoreNames.contains('artworks')) d.createObjectStore('artworks', { keyPath: 'id' });
if (!d.objectStoreNames.contains('attempts')) d.createObjectStore('attempts', { keyPath: 'id' }).createIndex('lesson', 'lesson');
if (!d.objectStoreNames.contains('meta')) d.createObjectStore('meta', { keyPath: 'k' });
if (!d.objectStoreNames.contains('runs')) d.createObjectStore('runs', { keyPath: 'id' }).createIndex('lesson', 'lesson');
};
r.onsuccess = function () { ok(r.result); };
r.onerror = function () { no(r.error); };
r.onblocked = function () { no(new Error('blocked')); };
});
}
var memory = { artworks: {}, attempts: {}, meta: {}, runs: {} };
var db = null;
function store(name, mode) { return db.transaction(name, mode || 'readonly').objectStore(name); }
function get(name, id) {
if (!db) return Promise.resolve(clone(memory[name][id]) || null);
return req(store(name).get(id)).then(function (v) { return v || null; });
}
function all(name) {
if (!db) return Promise.resolve(Object.keys(memory[name]).map(function (k) { return clone(memory[name][k]); }));
return req(store(name).getAll());
}
function put(name, v) {
if (!db) { memory[name][v.id] = clone(v); return Promise.resolve(v); }
var tx = db.transaction(name, 'readwrite'); tx.objectStore(name).put(v);
return done(tx).then(function () { return v; });
}
var LEGACY = [{
lesson: '2-1', state: 'app-proto:lesson:2-1',
v1: { key: 'studio-v2:2.1-app:pattern-2-1-app', entry: 'pattern-2-1-app' },
v2: { key: 'studio-v2:2.1-app:pattern-2-1-app-v2', entry: 'pattern-2-1-app-v2-' }
}];
function readLS(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
function legacyWork(d, entry) {
if (!d || d.v !== 2 || !d.canvas || !Array.isArray(d.ops) || !d.ops.length) return null;
var w = JSON.parse(JSON.stringify(d));
w.id = newId(); w.activity = Object.assign({}, d.activity, { entry: entry });
w.createdAt = w.updatedAt = w.savedAt = d.savedAt || now();
return w;
}
function legacyOf(L) {
var st = readLS(L.state) || {}, d1 = readLS(L.v1.key), d2 = readLS(L.v2.key);
var w1 = legacyWork(d1, L.v1.entry), w2 = null;
if (d2 && !(st.v2seed && d2.savedAt === st.v2seed)) {
var kind = (d2.settings && d2.settings.repeat && d2.settings.repeat.vary && d2.settings.repeat.vary.kind) || st.change;
if (kind) w2 = legacyWork(d2, L.v2.entry + kind);
}
var keys = ['medium', 'change', 'checks', 'reflection', 'done'].filter(function (k) { return st[k] != null; });
if (!w1 && !w2 && !keys.length) return null;
var a = { id: newId(), lesson: L.lesson, createdAt: (w1 && w1.createdAt) || now(), updatedAt: now() };
keys.forEach(function (k) { a[k] = st[k]; });
if (w1) a.v1 = w1.id;
if (w2) a.v2 = w2.id;
return { attempt: a, works: [w1, w2].filter(Boolean) };
}
function migrate() {
return LEGACY.reduce(function (p, L) {
return p.then(function () {
var flag = 'legacy:' + L.lesson, m = legacyOf(L);
if (!db) {
if (memory.meta[flag]) return;
memory.meta[flag] = { k: flag, at: now() };
if (m) { m.works.forEach(function (w) { memory.artworks[w.id] = w; }); memory.attempts[m.attempt.id] = m.attempt; }
return;
}
var tx = db.transaction(STORES, 'readwrite');
tx.objectStore('meta').get(flag).onsuccess = function (e) {
if (e.target.result) return;
tx.objectStore('meta').put({ k: flag, at: now(), copied: m ? m.works.length : 0 });
if (m) { m.works.forEach(function (w) { tx.objectStore('artworks').put(w); }); tx.objectStore('attempts').put(m.attempt); }
};
return done(tx);
});
}, Promise.resolve());
}
var STASH = 'app-proto:unsaved:';
function stash(w) { try { localStorage.setItem(STASH + w.id, JSON.stringify({ at: Date.now(), w: w })); return true; } catch (e) { return false; } }
function unstash(id) { try { localStorage.removeItem(STASH + id); } catch (e) {} }
function recover() {
var keys = [];
try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf(STASH) === 0) keys.push(k); } } catch (e) { return; }
return keys.reduce(function (p, k) {
return p.then(function () {
var st = null, id = k.slice(STASH.length);
try { st = JSON.parse(localStorage.getItem(k)); } catch (e) {}
if (!st || !st.w || st.w.id !== id) return unstash(id);
return get('artworks', id).then(function (old) {
if (old && (old.medium === 'paper' || Date.parse(old.updatedAt) > st.at)) return;
return save(st.w);
}).then(function () { unstash(id); });
});
}, Promise.resolve());
}
var ready = open().then(function (d) { db = d; }, function (e) { console.warn('Artworks: kept in memory only (' + (e && e.message) + ')'); })
.then(migrate).catch(function (e) { console.warn('Artworks: the earlier saves were not copied (' + (e && e.message) + ')'); })
.then(recover).catch(function (e) { console.warn('Artworks: a work left unwritten was not written in (' + (e && e.message) + ')'); });
function after(fn) { return function () { var a = arguments; return ready.then(function () { return fn.apply(null, a); }); }; }
function byDate(a, b) { return a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0; }
function stateOf(w) { var s = {}; STATE.forEach(function (k) { if (w[k] !== undefined) s[k] = clone(w[k]); }); return s; }
function empty(w) { return !(w.ops && w.ops.length) && !w.preview; }
function newArtwork(f) {
var t = now();
return Object.assign({}, f, { id: (f && f.id) || newId(), medium: (f && f.medium) || 'digital', points: [], createdAt: t, updatedAt: t });
}
function save(w) {
return get('artworks', w.id).then(function (old) {
var t = now(), rec = Object.assign({}, w);
rec.createdAt = (old && old.createdAt) || w.createdAt || t;
rec.updatedAt = rec.savedAt = t;
rec.medium = w.medium || (old && old.medium) || 'digital';
if (w.lesson === undefined && old && old.lesson !== undefined) rec.lesson = old.lesson;
rec.points = (old && old.points) || w.points || [];
return put('artworks', rec);
});
}
function addPoint(id, kind) {
return get('artworks', id).then(function (w) {
if (!w) return null;
var p = { id: newId(), kind: kind || 'kept', createdAt: now(), state: stateOf(w) };
w.points = (w.points || []).concat([p]); w.updatedAt = now();
return put('artworks', w).then(function () { return p; });
});
}
function restorePoint(id, pointId) {
return get('artworks', id).then(function (w) {
var p = w && (w.points || []).filter(function (x) { return x.id === pointId; })[0];
if (!p) return null;
STATE.forEach(function (k) { delete w[k]; });
Object.assign(w, clone(p.state));
w.updatedAt = w.savedAt = now();
return put('artworks', w);
});
}
function newRun(lesson) { try { sessionStorage.removeItem('run:' + lesson); } catch (e) {} var t = now(); return put('runs', { id: newId(), lesson: lesson, artwork: null, createdAt: t, updatedAt: t }); }
function putRun(r) { r.createdAt = r.createdAt || now(); r.updatedAt = now(); return put('runs', r); }
function artworkFor(runId, medium) {
function decide(r, w) {
if (!r) return { r: null, w: null };
if (r.artwork && w) {
if (medium && w.medium !== medium && empty(w)) { w.medium = medium; w.updatedAt = now(); return { r: null, w: w, write: [w] }; }
return { r: null, w: w, write: [] };
}
var a = newArtwork({ medium: medium, lesson: r.lesson });
r.artwork = a.id; r.updatedAt = now();
return { r: r, w: a, write: [a] };
}
if (!db) {
var r = clone(memory.runs[runId]), d = decide(r, r && r.artwork ? clone(memory.artworks[r.artwork]) : null);
if (d.r) memory.runs[runId] = clone(d.r);
(d.write || []).forEach(function (w) { memory.artworks[w.id] = clone(w); });
return Promise.resolve(d.w);
}
var tx = db.transaction(['runs', 'artworks'], 'readwrite'), out = null;
tx.objectStore('runs').get(runId).onsuccess = function (e) {
var r = e.target.result;
function then(w) {
var d = decide(r, w); out = d.w;
if (d.r) tx.objectStore('runs').put(d.r);
(d.write || []).forEach(function (x) { tx.objectStore('artworks').put(x); });
}
if (r && r.artwork) tx.objectStore('artworks').get(r.artwork).onsuccess = function (e2) { then(e2.target.result || null); };
else then(null);
};
return done(tx).then(function () { return out; });
}
return {
ready: ready,
newId: newId,
get: after(function (id) { return id ? get('artworks', id) : Promise.resolve(null); }),
list: after(function () { return all('artworks'); }),
create: after(function (f) { return put('artworks', newArtwork(f || {})); }),
put: after(save),
stash: stash,
unstash: unstash,
addPoint: after(addPoint),
restorePoint: after(restorePoint),
newRun: after(newRun),
currentRun: after(function (lesson) {
return all('runs').then(function (l) { return l.filter(function (r) { return r.lesson === lesson; }).sort(byDate).pop() || null; });
}),
runs: after(function (lesson) {
return all('runs').then(function (l) { return l.filter(function (r) { return !lesson || r.lesson === lesson; }).sort(byDate); });
}),
putRun: after(putRun),
artworkFor: after(artworkFor),
attempts: after(function (lesson) {
return all('attempts').then(function (l) { return l.filter(function (a) { return !lesson || a.lesson === lesson; }).sort(byDate); });
}),
current: after(function (lesson) {
return all('attempts').then(function (l) { return l.filter(function (a) { return a.lesson === lesson; }).sort(byDate).pop() || null; });
}),
putAttempt: after(function (a) { a.createdAt = a.createdAt || now(); a.updatedAt = now(); return put('attempts', a); }),
newAttempt: after(function (lesson) { return put('attempts', { id: newId(), lesson: lesson, createdAt: now(), updatedAt: now() }); })
};
})();
