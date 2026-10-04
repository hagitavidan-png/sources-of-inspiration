/* Tool: fill. The learner taps an area of a composition the activity provides, and it takes the current colour.
   The activity gives the areas in content.regions: [{ id, d }], d an SVG path in artwork units (the artwork is
   1000 wide), filled even-odd, so an area can have a hole where another area sits inside it.
   The composition's lines are on the base layer; each fill is one operation { t:'fill', region, color } on the
   learner's layer, and draws its area's line again over the colour, so the lines stay visible. */
Studio.register('fill', {
  tool: 'fill',
  strings: {
    he: { fill: 'מילוי' },
    en: { fill: 'Fill' }
  },
  init: function (S) {
    'use strict';
    var LINE = { color: '#2b2a28', width: 4 };   // the composition's lines, in artwork units
    var st = S.state;
    if (!st.color) st.color = '#2b2a28';

    var regions = ((S.activity.content || {}).regions || []).filter(function (r) { return r && typeof r.id === 'string' && typeof r.d === 'string'; });
    if (!regions.length) { console.warn('Studio: the fill tool needs content.regions ([{ id, d }]) in the activity'); return; }
    var byId = {};
    regions.forEach(function (r) { byId[r.id] = new Path2D(r.d); });
    var probe = document.createElement('canvas').getContext('2d');   // to find the area under a point (artwork units)

    function outline(c, path) {
      c.globalCompositeOperation = 'source-over';
      c.strokeStyle = LINE.color; c.lineWidth = LINE.width; c.lineJoin = 'round';
      c.stroke(path);
    }
    S.base(function (c) { regions.forEach(function (r) { outline(c, byId[r.id]); }); });
    S.renderer('fill', function (op, c) {
      var path = byId[op.region];
      if (!path) return;   // an area this activity no longer has
      c.globalCompositeOperation = 'source-over';
      c.fillStyle = op.color; c.fill(path, 'evenodd');
      outline(c, path);
    });

    /* the area under a point: the last one listed wins, as it is drawn on top */
    function regionAt(p) {
      for (var i = regions.length - 1; i >= 0; i--) if (probe.isPointInPath(byId[regions[i].id], p[0], p[1], 'evenodd')) return regions[i].id;
      return null;
    }
    /* a tap: the area where the finger went down and came up; a slide to another area fills nothing */
    var downAt = null;
    S.pointer('fill', {
      down: function (e) { downAt = regionAt(S.pt(e)); },
      move: function () {},
      up: function (e) {
        var id = downAt; downAt = null;
        if (!id || regionAt(S.pt(e)) !== id) return;
        S.commit({ t: 'fill', region: id, color: st.color });
        S.redraw();
      }
    });

    S.item({ id: 'fill', order: 25, label: 'fill', pressed: true,
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 11l7-7 8 8-7 7a2 2 0 01-2.8 0L5 13.8a2 2 0 010-2.8z"/><path d="M5 12h15"/><path d="M20.5 16.5s1.5 1.9 1.5 3a1.5 1.5 0 01-3 0c0-1.1 1.5-3 1.5-3z"/></svg>',
      onClick: function () { st.tool = 'fill'; S.closePanels(); S.updateUi(); },
      update: function (b) { b.setAttribute('aria-pressed', String(st.tool === 'fill')); } });
  }
});
