/* Tool: repeat. The learner draws one unit; the studio shows it repeated across the artwork at once.
   The activity says what is allowed, in params.repeat:
     modes   which kinds of repeat the learner may choose, in order: "grid" and/or "offset" (the first is the start)
     step    the distance between repeats, in artwork units (the artwork is 1000 wide): a number, or [across, down]
   grid     copies in rows and columns at the same distance
   offset   the same, with every second row moved across by half the distance
   The repeats are only how the learner layer is shown: the operations stay the learner's own strokes, one per
   line, and undo, redo and saving work on them. The chosen kind is saved with the work (settings.repeat).
   App prototype only (prototypes/app/studio/): params.repeat.vary ("size", "direction" or "spacing") is lesson 2.1's
   "change one thing only". The studio then changes that one thing of the whole pattern and nothing else: one small
   control for it, no kind of repeat to choose, no clearing and no undo. Size (the lines keep their width) and direction turn or scale every repeat of the
   unit around the unit's own centre; spacing changes the distance between the repeats. The lines are not touched;
   the change is saved with the work (settings.repeat.vary = { kind, value }). */
Studio.register('repeat', {
  strings: {
    he: { repeat: 'חזרה', grid: 'רשת', offset: 'מדורג', repeats: 'סוג החזרה',
          size: 'גודל', direction: 'כיוון', spacing: 'מרווח', smaller: 'קטן יותר', larger: 'גדול יותר', closer: 'צפוף יותר', apart: 'מרווח יותר', turnLeft: 'סיבוב נגד כיוון השעון', turnRight: 'סיבוב עם כיוון השעון' },
    en: { repeat: 'Repeat', grid: 'Grid', offset: 'Offset', repeats: 'Kind of repeat',
          size: 'Size', direction: 'Rotation', spacing: 'Spacing', smaller: 'Smaller', larger: 'Larger', closer: 'Closer', apart: 'Further apart', turnLeft: 'Turn anticlockwise', turnRight: 'Turn clockwise' }
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
    var saved = S.doc.settings.repeat;
    var st = { mode: saved && modes.indexOf(saved.mode) >= 0 ? saved.mode : modes[0] };
    /* lesson 2.1, "change one thing only": the one thing, its range, and its value when nothing is changed */
    var VARY = { size: { min: 0.5, max: 1.5, step: 0.05, none: 1 }, direction: { min: -180, max: 180, step: 15, none: 0 }, spacing: { min: 0.6, max: 1.6, step: 0.05, none: 1 } };
    var vary = VARY[cfg.vary] ? cfg.vary : null;
    if (vary) {
      var v0 = saved && saved.vary && saved.vary.kind === vary && typeof saved.vary.value === 'number' ? saved.vary.value : VARY[vary].none;
      st.vary = { kind: vary, value: Math.min(VARY[vary].max, Math.max(VARY[vary].min, v0)) };
    }
    S.doc.settings.repeat = st;
    function amount(kind) { return st.vary && st.vary.kind === kind ? st.vary.value : VARY[kind].none; }

    /* where the copies go, in artwork units: (0,0) is the learner's own drawing; enough copies around it
       to cover the artwork wherever the unit was drawn. The canvas cuts what falls outside. */
    function offsets() {
      var gap = amount('spacing'), sx = step[0] * gap, sy = step[1] * gap, nx = Math.ceil(S.doc.w / sx) + 1, ny = Math.ceil(S.doc.h / sy) + 1, out = [];
      for (var j = -ny; j <= ny; j++) {
        var shift = st.mode === 'offset' && Math.abs(j) % 2 ? sx / 2 : 0;
        for (var i = -nx; i <= nx; i++) out.push([i * sx + shift, j * sy]);
      }
      return out;
    }
    /* the learner's drawing is painted once, then placed at every repeat: the same size and direction everywhere */
    var unit = document.createElement('canvas'), big = document.createElement('canvas');
    S.present(function (c, paint) {
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
        /* every repeat of the unit (its drawn area, b) turned around the unit's own centre */
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
    });
    /* size: the unit's shape grows or shrinks around its own centre and its lines keep their width. The unit is
       painted once, scaled, with each line drawn at its width divided by the scale (only while painting: the lines
       themselves are not changed), on a sheet with room around it, then placed at every repeat */
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
      var ops = S.doc.ops, from = 0;
      for (var i = ops.length - 1; i >= 0; i--) if (ops[i].t === 'clear') { from = i + 1; break; }
      return ops.slice(from);
    }
    /* the area the learner's lines take (artwork units), from their points and widths */
    function box() {
      var ops = S.doc.ops, from = 0, b = [Infinity, Infinity, -Infinity, -Infinity];
      for (var i = ops.length - 1; i >= 0; i--) if (ops[i].t === 'clear') { from = i + 1; break; }
      ops.slice(from).forEach(function (op) {
        var p = op.pts || [], r = (op.w || 0) / 2 + 1;
        for (var j = 0; j + 1 < p.length; j += 2) { b[0] = Math.min(b[0], p[j] - r); b[1] = Math.min(b[1], p[j + 1] - r); b[2] = Math.max(b[2], p[j] + r); b[3] = Math.max(b[3], p[j + 1] + r); }
      });
      return isFinite(b[0]) ? [Math.max(0, b[0]), Math.max(0, b[1]), Math.min(S.doc.w, b[2]), Math.min(S.doc.h, b[3])] : [0, 0, 0, 0];
    }

    /* "change one thing only": one control for the one thing; the kind of repeat and "clear" are not offered */
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
      /* undo would take away one of version 1's lines: with the toolbar built, undo and redo are not offered either */
      this.ready = function () { ['undo', 'redo'].forEach(function (b) { var e = S.$(b); if (e) e.hidden = true; }); };
      return;
    }

    if (modes.length < 2) return;   // nothing to choose
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
    /* choosing another kind changes how the drawing is shown, not the drawing: no step in the history */
    function pick(m) {
      if (m === st.mode) return;
      st.mode = m; mark(); S.changed(); S.redraw();
    }
    mark();
  }
});
