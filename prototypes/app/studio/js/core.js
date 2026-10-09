/* Interactive Art Studio V2: the core.
   It knows the artwork (a list of operations), the history, how to paint it, where the pointer goes,
   the canvas size and saving. It does not know any tool: tools (js/draw.js, js/color.js, …) register
   themselves and add their buttons, panels, operations and pointer handling.
   Two layers, the same size and place: the base layer (#base, below: what the activity provides, painted by
   the tools that show it) and the learner layer (#canvas, on top: the learner's operations). The eraser
   works on the learner layer only. A tool may show the learner layer in its own way (S.present: Repeat
   shows it repeated); the operations stay the learner's own, one per action.
   Repeat as a step in the artwork's development (S.present(fn, true)): an operation { t:'repeat' } in the history.
   What comes before it (after the last clear) is the source; fn shows that source repeated; what comes after it
   is painted once, in order, over the repeated composition on the same layer, so a line after it appears once
   and an eraser after it erases only where it goes. { t:'rset' } operations after it are Repeat's own settings
   (they paint nothing). Without a { t:'repeat' } operation the learner layer is painted as it is.
   activity.source (app prototype, lesson 2.1 "back to the drawing"): only the source is worked on. Repeat and what
   came after it are set aside (tail) while the Studio is open, and put back after the source in every save and
   preview: the artwork stays whole, repeated, with the source as the learner changed it. */
window.Studio = (function () {
  'use strict';

  var LOGICAL_W = 1000;   // the artwork's width in its own units; the height follows the activity's aspect ratio

  /* texts of the studio itself; each tool adds its own */
  var TEXT = {
    he: { back: 'חזרה לשיעור', title: 'היצירה שלי', undo: 'בטל', redo: 'בצע שוב', clear: 'נקה', save: 'שמור', cancel: 'ביטול',
          exit: 'צא', clearQ: 'לנקות את כל היצירה?', unsaved: 'יש שינויים שלא נשמרו.', saved: 'היצירה נשמרה',
          saveFailed: 'השמירה נכשלה', opened: 'העבודה השמורה נפתחה', canvas: 'משטח הציור', backGallery: 'חזרה ליצירות שלי',
          autoSaved: 'נשמר', kept: 'נשמר' },
    en: { back: 'Back to the lesson', title: 'My artwork', undo: 'Undo', redo: 'Redo', clear: 'Clear', save: 'Save', cancel: 'Cancel',
          exit: 'Leave', clearQ: 'Clear the whole artwork?', unsaved: 'There are unsaved changes.', saved: 'Artwork saved',
          saveFailed: 'Could not save', opened: 'Your saved work is open', canvas: 'Drawing area', backGallery: 'Back to my artworks',
          autoSaved: 'Saved', kept: 'Kept' }
  };

  var caps = {};          // registered tools: id → { strings, init(api) }
  var renderers = {};     // operation type → function (op, context)
  var basePainters = [];  // functions (context) that paint the base layer
  var presenter = null;   // function (context, paint) that shows the learner layer, or null: as it is
  var asStep = false;     // the presenter shows only the source before a { t:'repeat' } operation, and only once there is one
  var watchers = [];      // the tools' functions called when the history changes (undo, redo, a new step)
  var pointers = {};      // active tool id → { down(e), move(events), up(e) }
  var items = [];         // toolbar buttons from the activity's tools

  var Q = new URLSearchParams(location.search);
  var $ = function (id) { return document.getElementById(id); };
  var app, stage, canvas, ctx, base, bctx;
  var activity, LANG, T, KEY, BACK;
  /* app prototype: ?art=<id> the artwork this is (js/artworks.js: saved there by itself, under its own id; a new id
     is a new work), ?from=<id> the artwork a new one starts from (lesson 2.1: version 2 from version 1). Without
     ?art= the Studio saves one work per activity in localStorage (KEY) when the learner saves, as before */
  var ID = /^[A-Za-z0-9-]{1,64}$/;
  var ART = ID.test(Q.get('art') || '') ? Q.get('art') : null, FROM = ID.test(Q.get('from') || '') ? Q.get('from') : null;
  var ENTRY, created = null;
  var paper = false;      // ?art= is a paper artwork: the Studio does not write into it
  var tools = [];         // the activity's tools that are available
  var doc = { w: LOGICAL_W, h: 750, ops: [], settings: {} };   // ops: { t:'clear' } or the tools' own operations;
                                                                // settings: the tools' choices for the whole work (not history)
  var redoStack = [];
  var tail = [];          // activity.source: Repeat and what came after it, set aside while the source is worked on
  var version = 0, savedVersion = 0;
  var scale = 1;          // css px per artwork unit
  var state = { tool: null };

  function register(id, def) { caps[id] = def; }
  function freeze(o) {
    if (o && typeof o === 'object') { Object.keys(o).forEach(function (k) { freeze(o[k]); }); Object.freeze(o); }
    return o;
  }

  /* ── where "Back to the lesson" may go: only a relative path inside this site ── */
  function safeBack(v) {
    if (typeof v !== 'string') return null;
    v = v.trim();
    if (!v || /[\u0000-\u001f\\]/.test(v)) return null;
    if (/^[a-z][a-z0-9+.\-]*:/i.test(v)) return null;        // javascript:, http:, data: …
    if (/^\/\//.test(v)) return null;                          // //other.site
    try {
      var u = new URL(v, location.href);
      if (u.origin !== location.origin) return null;
    } catch (e) { return null; }
    return v;
  }

  /* ── the artwork ── */
  function aspect(a) {
    var m = /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/.exec(String(a || ''));
    return m && +m[1] > 0 && +m[2] > 0 ? +m[2] / +m[1] : 3 / 4;   // height / width; default 4:3
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
  /* the visible operations around the (last) { t:'repeat' }: the source before it, the operations after it */
  function split() {
    var ops = visibleOps(), at = -1;
    for (var i = ops.length - 1; i >= 0; i--) if (ops[i].t === 'repeat') { at = i; break; }
    return at < 0 ? { source: ops, marker: null, after: [] } : { source: ops.slice(0, at), marker: ops[at], after: ops.slice(at + 1) };
  }
  function paintLearner(c) {
    if (!presenter) return paint(c);
    if (!asStep) return presenter(c, paint);
    var sp = split();
    if (!sp.marker) return paintOps(sp.source, c);
    presenter(c, function (x) { paintOps(sp.source, x); });
    paintOps(sp.after, c);
  }
  function paintBase(c) {
    basePainters.forEach(function (fn) { c.save(); fn(c); c.restore(); });
  }
  function wipe(c, el) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, el.width, el.height); c.restore(); }
  function redraw() {
    wipe(bctx, base); paintBase(bctx);
    wipe(ctx, canvas); paintLearner(ctx);
  }
  /* the canvas keeps the activity's proportions and fills as much of the stage as they allow */
  function fit() {
    var r = stage.getBoundingClientRect();
    var availW = r.width - (parseFloat(getComputedStyle(stage).paddingLeft) * 2 || 0), availH = r.height - 4;
    scale = Math.max(0.01, Math.min(availW / doc.w, availH / doc.h));
    var cw = Math.floor(doc.w * scale), ch = Math.floor(doc.h * scale), dpr = window.devicePixelRatio || 1;
    canvas.style.width = cw + 'px'; canvas.style.height = ch + 'px';
    canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
    /* the base layer lies exactly under the learner layer */
    base.style.width = canvas.style.width; base.style.height = canvas.style.height;
    var c = canvas.getBoundingClientRect();   // exact, also at half pixels (offsetLeft rounds)
    /* from its centre: Repeat's reveal scales the canvas for a moment (around its centre), the paper stays as it is */
    var left = c.left + c.width / 2 - cw / 2, top = c.top + c.height / 2 - ch / 2;
    base.style.left = (left - r.left - stage.clientLeft) + 'px'; base.style.top = (top - r.top - stage.clientTop) + 'px';
    base.width = canvas.width; base.height = canvas.height;
    bctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
    redraw();
  }

  /* ── history ── */
  function commit(op) { doc.ops.push(op); redoStack = []; changed(); }
  function changed() { version++; updateUi(); schedule(); }
  function undo() { if (!doc.ops.length) return; redoStack.push(doc.ops.pop()); changed(); redraw(); }
  function redo() { if (!redoStack.length) return; doc.ops.push(redoStack.pop()); changed(); redraw(); }
  function clearAll() { commit({ t: 'clear' }); redraw(); }
  function hasDrawing() { return visibleOps().length > 0; }
  function dirty() { return version !== savedVersion; }

  function updateUi() {
    $('undo').disabled = !doc.ops.length;
    $('redo').disabled = !redoStack.length;
    $('clear').disabled = !hasDrawing();
    items.forEach(function (it) { if (it.update) it.update($(it.id)); });
    watchers.forEach(function (fn) { fn(); });
  }

  /* ── pointer: finger, stylus, mouse or trackpad; one stroke at a time; the active tool decides what it does ── */
  var activeId = null, handler = null;
  function pt(e) {
    var r = canvas.getBoundingClientRect();
    return [Math.round((e.clientX - r.left) / scale * 10) / 10, Math.round((e.clientY - r.top) / scale * 10) / 10];
  }
  function onDown(e) {
    if (activeId !== null) return;                       // a resting hand does not draw over a stroke
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

  /* ── save: the operations (to reopen the work), a small preview, the activity and lesson ── */
  function preview() {
    var W = 480, k = W / doc.w, H = Math.round(doc.h * k);
    var c = document.createElement('canvas'); c.width = W; c.height = H;
    var x = c.getContext('2d');
    var ink = document.createElement('canvas'); ink.width = W; ink.height = H;
    var y = ink.getContext('2d'); y.setTransform(k, 0, 0, k, 0, 0);
    var own = doc.ops;   // the whole artwork, also while only its source is worked on
    if (tail.length) doc.ops = own.concat(tail);
    try { paintLearner(y); } finally { doc.ops = own; }
    x.fillStyle = '#fffdf9'; x.fillRect(0, 0, W, H);
    x.save(); x.setTransform(k, 0, 0, k, 0, 0); paintBase(x); x.restore();
    x.drawImage(ink, 0, 0);
    return c.toDataURL('image/png');
  }
  function record() {
    var data = { v: 2, activity: { id: activity.id, lesson: activity.lesson }, lang: LANG, back: BACK,
                 savedAt: new Date().toISOString(), canvas: { aspect: activity.canvas.aspect, w: doc.w, h: doc.h },
                 ops: visibleOps().concat(tail), preview: preview() };
    if (Object.keys(doc.settings).length) data.settings = doc.settings;
    return data;
  }
  /* ── an artwork of the store (?art=) saves itself: a moment after the last change (AUTO_MS, so a drawing in
     progress is not written at every line), and at once when the page is left or hidden. One write at a time, in
     order. This saves the artwork's current state; it never keeps a development point (point() does, when asked).
     Leaving or hiding the page (away): the state not written yet goes first to Artworks.stash, which survives the
     page going away, then is written as usual; once a write of the latest state ends, the stash is removed ── */
  var AUTO_MS = 1000, timer = null, chain = Promise.resolve(true);
  function autosaves() { return !!ART && !paper; }
  function schedule() {
    if (!autosaves()) return;
    clearTimeout(timer); timer = setTimeout(flush, AUTO_MS);
    Studio.shell.saveState('pending');
  }
  /* write now what is not written yet: a promise of true once it is. away: the page is being left or hidden */
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
  /* keep the current state as a development point of the artwork (only when asked: never while drawing or saving).
     once: if a point of the same kind already has exactly this state, that point is the answer and none is added */
  function point(kind, once) {
    if (!autosaves()) return Promise.resolve(null);
    return flush().then(function () {
      if (dirty()) throw new Error('not written');   // the work on screen is not written: no point of an older state
      if (!once) return window.Artworks.addPoint(ART, kind);
      return window.Artworks.get(ART).then(function (w) {
        var now = w && JSON.stringify([w.canvas, w.ops, w.settings]);
        var same = w && (w.points || []).filter(function (p) { return p.kind === kind && JSON.stringify([p.state.canvas, p.state.ops, p.state.settings]) === now; })[0];
        return same || window.Artworks.addPoint(ART, kind);
      });
    });
  }
  /* saving: true once saved (for an artwork of the store, a promise of it) */
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
  /* reopen a saved work into the document: true when there is something in it */
  function apply(data) {
    if (!data || data.v !== 2 || !data.canvas || !Array.isArray(data.ops)) return false;
    doc.w = data.canvas.w; doc.h = data.canvas.h; doc.ops = data.ops;   // the work keeps the proportions it was made in
    if (data.settings && typeof data.settings === 'object') doc.settings = data.settings;   // each tool checks its own
    return data.ops.length > 0;
  }
  function load() {
    var raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) {}
    if (!raw) return false;
    try { return apply(JSON.parse(raw)); } catch (e) { return false; }
  }
  /* the artwork ?art= (or, while it is not saved yet, the one ?from= it starts from) */
  function loadArt() {
    var A = window.Artworks;
    return A.get(ART).then(function (w) {
      if (w && w.medium === 'paper') { paper = true; return null; }   // not a Studio work: nothing to open, nothing written
      if (w) { created = w.createdAt; return w; }
      return FROM ? A.get(FROM) : null;
    }).then(function (w) {
      if (!w) return false;
      try { return apply(JSON.parse(JSON.stringify(w))); } catch (e) { return false; }
    }, function () { return false; });
  }

  /* ── start ── */
  function boot() {
    var list = window.STUDIO_ACTIVITIES || {};
    var id = Q.get('activity') || 'drawing';
    if (!list[id]) { console.warn('Studio: no activity "' + id + '", using "drawing"'); id = 'drawing'; }
    activity = Object.assign({ canvas: {} }, list[id]);
    activity.canvas = Object.assign({ aspect: '4:3' }, activity.canvas);   // an activity without a ratio gets 4:3

    LANG = Q.get('lang') || (function () { try { return localStorage.getItem('sourcesLang'); } catch (e) { return null; } })() || 'he';
    if (!TEXT[LANG]) LANG = 'he';
    tools = (activity.tools || []).filter(function (t) {
      if (!caps[t]) console.warn('Studio: tool "' + t + '" is not available');
      return !!caps[t];
    });
    T = Object.assign({}, TEXT[LANG]);
    tools.forEach(function (t) { Object.assign(T, (caps[t].strings || {})[LANG]); });
    if (activity.title && activity.title[LANG]) T.title = activity.title[LANG];
    document.documentElement.lang = LANG;
    document.documentElement.dir = LANG === 'he' ? 'rtl' : 'ltr';

    BACK = safeBack(Q.get('back')) || safeBack(activity.back) || '../../index.html';
    if (Q.get('ctx') === 'gallery') T.back = T.backGallery;   // opened from the app's "My artworks"
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
    if (activity.source) {   // the source only: Repeat and what follows it set aside (see above)
      for (var at = doc.ops.length - 1; at >= 0 && doc.ops[at].t !== 'repeat'; at--) {}
      if (at >= 0) { tail = doc.ops.slice(at); doc.ops = doc.ops.slice(0, at); }
    }
    /* what the tools may read about the activity; read-only */
    var info = freeze(JSON.parse(JSON.stringify({ id: activity.id, lesson: activity.lesson, tools: activity.tools || [],
      canvas: activity.canvas, params: activity.params || {}, content: activity.content || {} })));
    var api = {
      T: T, lang: LANG, state: state, doc: doc, $: $, stage: stage, activity: info,
      ctx: function () { return ctx; }, scale: function () { return scale; }, pt: pt,
      commit: commit, redraw: redraw, updateUi: updateUi,
      has: function (t) { return tools.indexOf(t) >= 0; },
      renderer: function (type, fn) { renderers[type] = fn; },
      base: function (fn) { basePainters.push(fn); },   // paint on the base layer (artwork units)
      present: function (fn, step) { presenter = fn; asStep = !!step; },   // show the learner layer through fn(context, paint);
                                                        // step: only the source, once a { t:'repeat' } is in the history
      split: split,                                     // { source, marker, after } around the { t:'repeat' } operation
      watch: function (fn) { watchers.push(fn); },      // fn() whenever the history changes
      changed: changed,                                 // a setting changed: unsaved, but not a step in the history
      point: point,                                     // keep the current state as a development point (?art= only)
      pointer: function (toolId, h) { pointers[toolId] = h; },
      item: function (it) { items.push(it); },
      closePanels: function () { Studio.shell.closePanels(); },
      togglePanel: function (panel, btn) { Studio.shell.togglePanel(panel, btn); }
    };
    tools.forEach(function (t) { caps[t].init(api); });
    /* the first tool on: the main tool of the first capability the activity asks for that has one */
    if (!state.tool) tools.some(function (t) { return (state.tool = caps[t].tool || null); });
    items.sort(function (a, b) { return a.order - b.order; });

    Studio.shell.build({ T: T, items: items, undo: undo, redo: redo, clearAll: clearAll, hasDrawing: hasDrawing,
                         save: save, dirty: dirty, back: function () { return BACK; }, auto: autosaves(), flush: flush,
                         clear: activity.clear !== false, point: point,
                         keep: autosaves() && activity.keep && activity.keep.label && activity.keep.label[LANG] || null,
                         next: autosaves() && activity.next && activity.next.label && activity.next.label[LANG] || null,
                         source: !!activity.source, prompt: activity.prompt && activity.prompt[LANG] || null });
    tools.forEach(function (t) { if (caps[t].ready) caps[t].ready(); });
    fit();
    updateUi();
    if (reopened && !autosaves()) Studio.shell.toast(T.opened);   // an artwork that saves itself just opens, without a word about it
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(fit, 80); });
    /* the stage also changes without a resize (Repeat's controls appearing under it): fit again */
    if (window.ResizeObserver) {
      var sw = 0, sh = 0;
      new ResizeObserver(function (e) {
        var b = e[0].contentRect; if (Math.round(b.width) === sw && Math.round(b.height) === sh) return;
        sw = Math.round(b.width); sh = Math.round(b.height); clearTimeout(rt); rt = setTimeout(fit, 30);
      }).observe(stage);
    }

    /* for the prototype tests only: a read-only view of the state */
    window.__studio = { doc: doc, state: state, dirty: dirty, key: KEY, art: ART, lang: LANG, activity: activity, back: BACK, tools: tools,
                        flush: flush, point: point, auto: autosaves() };
  }

  return { register: register, boot: boot, safeBack: safeBack, point: point };
})();
