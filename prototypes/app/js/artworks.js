/* The learner's artworks and lesson attempts, on this device (IndexedDB "sources-app"). The one place that knows
   where they are kept: the Studio and the Lesson Player only call this API, so it can later be joined to an account
   and the cloud without changing them.
   artwork   a work saved by the Studio: { id, v, activity: { id, lesson, entry }, lang, canvas, ops, settings?,
             preview, createdAt, updatedAt, savedAt }. activity.entry is the Studio activity that reopens it.
   attempt   one time through a lesson: { id, lesson, createdAt, updatedAt, medium?, change?, checks?, reflection?,
             done?, v1?, v2? }; v1 and v2 are the ids of its two artworks (lesson 2.1: version 1 and version 2).
             A lesson's current attempt is its newest; a new attempt never removes an older one.
   Before this store, the prototype kept one Studio work per activity in localStorage. Those are copied in once
   (migrate below); the old keys stay as they are. */
window.Artworks = (function () {
  'use strict';
  var DB = 'sources-app', STORES = ['artworks', 'attempts', 'meta'];

  function now() { return new Date().toISOString(); }
  function newId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12);
  }
  function req(r) { return new Promise(function (ok, no) { r.onsuccess = function () { ok(r.result); }; r.onerror = function () { no(r.error); }; }); }
  function done(tx) { return new Promise(function (ok, no) { tx.oncomplete = function () { ok(); }; tx.onerror = tx.onabort = function () { no(tx.error); }; }); }

  /* the database; without IndexedDB (or when it fails to open) the works are kept in memory for this page only */
  function open() {
    return new Promise(function (ok, no) {
      if (!window.indexedDB) return no(new Error('no IndexedDB'));
      var r = indexedDB.open(DB, 1);
      r.onupgradeneeded = function () {
        var d = r.result;
        if (!d.objectStoreNames.contains('artworks')) d.createObjectStore('artworks', { keyPath: 'id' });
        if (!d.objectStoreNames.contains('attempts')) d.createObjectStore('attempts', { keyPath: 'id' }).createIndex('lesson', 'lesson');
        if (!d.objectStoreNames.contains('meta')) d.createObjectStore('meta', { keyPath: 'k' });
      };
      r.onsuccess = function () { ok(r.result); };
      r.onerror = function () { no(r.error); };
      r.onblocked = function () { no(new Error('blocked')); };
    });
  }
  var memory = { artworks: {}, attempts: {}, meta: {} };
  var db = null;
  function store(name, mode) { return db.transaction(name, mode || 'readonly').objectStore(name); }
  function get(name, id) {
    if (!db) return Promise.resolve(memory[name][id] || null);
    return req(store(name).get(id)).then(function (v) { return v || null; });
  }
  function all(name) {
    if (!db) return Promise.resolve(Object.keys(memory[name]).map(function (k) { return memory[name][k]; }));
    return req(store(name).getAll());
  }
  function put(name, v) {
    if (!db) { memory[name][v.id] = JSON.parse(JSON.stringify(v)); return Promise.resolve(v); }
    var tx = db.transaction(name, 'readwrite'); tx.objectStore(name).put(v);
    return done(tx).then(function () { return v; });
  }

  /* ── the prototype's earlier saves (localStorage), copied in once ── */
  var LEGACY = [{
    lesson: '2-1', state: 'app-proto:lesson:2-1',
    v1: { key: 'studio-v2:2.1-app:pattern-2-1-app', entry: 'pattern-2-1-app' },
    v2: { key: 'studio-v2:2.1-app:pattern-2-1-app-v2', entry: 'pattern-2-1-app-v2-' }   // + the kind of change
  }];
  function readLS(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function legacyWork(d, entry) {
    if (!d || d.v !== 2 || !d.canvas || !Array.isArray(d.ops) || !d.ops.length) return null;
    var w = JSON.parse(JSON.stringify(d));
    w.id = newId(); w.activity = Object.assign({}, d.activity, { entry: entry });
    w.createdAt = w.updatedAt = w.savedAt = d.savedAt || now();
    return w;
  }
  /* what one lesson's earlier saves become: an attempt (its state) with its version 1 and, if it was really saved,
     its version 2. A version 2 still the copy of version 1 (savedAt = v2seed) was never saved: it is not a work. */
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
  /* once per lesson: the check ("done?") and the writing are one transaction, so two pages at once copy it once */
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

  var ready = open().then(function (d) { db = d; }, function (e) { console.warn('Artworks: kept in memory only (' + (e && e.message) + ')'); })
    .then(migrate).catch(function (e) { console.warn('Artworks: the earlier saves were not copied (' + (e && e.message) + ')'); });

  function after(fn) { return function () { var a = arguments; return ready.then(function () { return fn.apply(null, a); }); }; }
  function byDate(a, b) { return a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0; }

  return {
    ready: ready,
    newId: newId,
    /* artworks */
    get: after(function (id) { return id ? get('artworks', id) : Promise.resolve(null); }),
    list: after(function () { return all('artworks'); }),
    /* save an artwork: a new id is a new work; the same id updates it (it keeps its createdAt) */
    put: after(function (w) {
      var t = now();
      return get('artworks', w.id).then(function (old) {
        w.createdAt = (old && old.createdAt) || w.createdAt || t;
        w.updatedAt = w.savedAt = t;
        return put('artworks', w);
      });
    }),
    /* lesson attempts */
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
