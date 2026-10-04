/* Tool: repeat. The learner draws one unit; the studio shows it repeated across the artwork at once.
   The activity says what is allowed, in params.repeat:
     modes   which kinds of repeat the learner may choose, in order: "grid" and/or "offset" (the first is the start)
     step    the distance between repeats, in artwork units (the artwork is 1000 wide): a number, or [across, down]
   grid     copies in rows and columns at the same distance
   offset   the same, with every second row moved across by half the distance
   The repeats are only how the learner layer is shown: the operations stay the learner's own strokes, one per
   line, and undo, redo and saving work on them. The chosen kind is saved with the work (settings.repeat). */
Studio.register('repeat', {
  strings: {
    he: { repeat: 'חזרה', grid: 'רשת', offset: 'מדורג', repeats: 'סוג החזרה' },
    en: { repeat: 'Repeat', grid: 'Grid', offset: 'Offset', repeats: 'Kind of repeat' }
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
    S.doc.settings.repeat = st;

    /* where the copies go, in artwork units: (0,0) is the learner's own drawing; enough copies around it
       to cover the artwork wherever the unit was drawn. The canvas cuts what falls outside. */
    function offsets() {
      var sx = step[0], sy = step[1], nx = Math.ceil(S.doc.w / sx) + 1, ny = Math.ceil(S.doc.h / sy) + 1, out = [];
      for (var j = -ny; j <= ny; j++) {
        var shift = st.mode === 'offset' && Math.abs(j) % 2 ? sx / 2 : 0;
        for (var i = -nx; i <= nx; i++) out.push([i * sx + shift, j * sy]);
      }
      return out;
    }
    /* the learner's drawing is painted once, then placed at every repeat: the same size and direction everywhere */
    var unit = document.createElement('canvas');
    S.present(function (c, paint) {
      var m = c.getTransform(), W = c.canvas.width, H = c.canvas.height;
      if (unit.width !== W || unit.height !== H) { unit.width = W; unit.height = H; }
      var u = unit.getContext('2d');
      u.setTransform(1, 0, 0, 1, 0, 0); u.clearRect(0, 0, W, H); u.setTransform(m);
      paint(u);
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over';
      offsets().forEach(function (d) {
        var x = Math.round(d[0] * m.a), y = Math.round(d[1] * m.d);
        if (x < W && y < H && x > -W && y > -H) c.drawImage(unit, x, y);
      });
      c.restore();
    });

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
