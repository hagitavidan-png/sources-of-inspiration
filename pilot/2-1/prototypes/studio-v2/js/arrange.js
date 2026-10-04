/* Tool: arrange. The learner moves elements the activity provides, and brings one to the front.
   The activity gives the elements in content.elements, back to front:
     [{ id, x, y, w, h, d, color }]   x, y: where it starts (top-left, artwork units; the artwork is 1000 wide),
                                      w, h: its size, d: its shape (an SVG path inside w × h), color: its colour
   The elements are drawn on the base layer, where they are now: the activity's start, changed by the learner's
   operations { t:'move', id, x, y } and { t:'front', id } since the last "clear". The operations are the history;
   the elements themselves are never in it. Choosing an element is not an operation. Drawing (draw) stays on the
   learner's layer, above the elements. */
Studio.register('arrange', {
  tool: 'arrange',
  strings: {
    he: { arrange: 'סידור', front: 'הבא קדימה', arrangeHint: 'גרור אלמנט כדי לשנות את מיקומו.' },
    en: { arrange: 'Arrange', front: 'Bring to front', arrangeHint: 'Drag an element to change where it is.' }
  },
  init: function (S) {
    'use strict';
    var st = S.state;
    var list = ((S.activity.content || {}).elements || []).filter(function (e) {
      return e && typeof e.id === 'string' && typeof e.d === 'string' && e.w > 0 && e.h > 0 && typeof e.x === 'number' && typeof e.y === 'number';
    });
    if (!list.length) {
      console.warn('Studio: the arrange tool needs content.elements ([{ id, x, y, w, h, d, color }]) in the activity');
      this.tool = null;   // nothing to arrange: do not start on this tool, the next capability's tool comes first
      return;
    }
    var EL = {}, PATH = {};
    list.forEach(function (e) { EL[e.id] = e; PATH[e.id] = new Path2D(e.d); });
    var probe = document.createElement('canvas').getContext('2d');
    var selected = null;   // the element chosen (not history)
    var drag = null;       // { id, dx, dy, x, y, x0, y0 } while one is being dragged

    /* where every element is now, and in which order (back to front) */
    function now() {
      var ops = S.doc.ops, from = 0, pos = {}, order = list.map(function (e) { return e.id; });
      for (var i = ops.length - 1; i >= 0; i--) if (ops[i].t === 'clear') { from = i + 1; break; }
      list.forEach(function (e) { pos[e.id] = { x: e.x, y: e.y }; });
      for (var j = from; j < ops.length; j++) {
        var op = ops[j];
        if (!EL[op.id]) continue;   // an element this activity no longer has
        if (op.t === 'move') pos[op.id] = { x: op.x, y: op.y };
        else if (op.t === 'front') { order.splice(order.indexOf(op.id), 1); order.push(op.id); }
      }
      if (drag) pos[drag.id] = { x: drag.x, y: drag.y };
      return { pos: pos, order: order };
    }

    /* the elements on the base layer; on the screen, a thin dashed frame around the one chosen */
    S.base(function (c) {
      var n = now();
      n.order.forEach(function (id) {
        var e = EL[id], p = n.pos[id];
        c.save(); c.translate(p.x, p.y); c.fillStyle = e.color || '#2b2a28'; c.fill(PATH[id]); c.restore();
      });
      if (selected && c.canvas === S.$('base')) {
        var e = EL[selected], p = n.pos[selected], k = 1 / S.scale(), pad = 6 * k;
        c.save(); c.setLineDash([4 * k, 4 * k]); c.lineWidth = 1.5 * k; c.strokeStyle = '#5b5852';
        c.strokeRect(p.x - pad, p.y - pad, e.w + pad * 2, e.h + pad * 2); c.restore();
      }
    });

    /* the element under a point: its shape, the front one first; failing that, its box, made at least
       44 screen pixels each way so the small ones are easy to take with a finger */
    function elementAt(pt) {
      var n = now(), ids = n.order.slice().reverse(), i, e, p;
      for (i = 0; i < ids.length; i++) { e = EL[ids[i]]; p = n.pos[ids[i]]; if (probe.isPointInPath(PATH[ids[i]], pt[0] - p.x, pt[1] - p.y)) return ids[i]; }
      var min = 44 / S.scale();
      for (i = 0; i < ids.length; i++) {
        e = EL[ids[i]]; p = n.pos[ids[i]];
        var ex = Math.max(0, (min - e.w) / 2), ey = Math.max(0, (min - e.h) / 2);
        if (pt[0] >= p.x - ex && pt[0] <= p.x + e.w + ex && pt[1] >= p.y - ey && pt[1] <= p.y + e.h + ey) return ids[i];
      }
      return null;
    }
    /* an element stays whole inside the artwork */
    function clamp(id, x, y) {
      var e = EL[id];
      return [Math.round(Math.min(Math.max(x, 0), S.doc.w - e.w)), Math.round(Math.min(Math.max(y, 0), S.doc.h - e.h))];
    }
    function choose(id) { if (selected !== id) { selected = id; S.updateUi(); } }

    S.pointer('arrange', {
      down: function (e) {
        var pt = S.pt(e), id = elementAt(pt);
        choose(id);
        if (id) { var p = now().pos[id]; drag = { id: id, dx: pt[0] - p.x, dy: pt[1] - p.y, x: p.x, y: p.y, x0: p.x, y0: p.y }; }
        S.redraw();
      },
      move: function (events) {
        if (!drag) return;
        var pt = S.pt(events[events.length - 1]), q = clamp(drag.id, pt[0] - drag.dx, pt[1] - drag.dy);
        if (q[0] === drag.x && q[1] === drag.y) return;
        drag.x = q[0]; drag.y = q[1];
        S.redraw();
      },
      up: function (e) {
        var d = drag; drag = null;
        if (!d) return;
        /* a move that really changed the place is one operation; a tap, or a cancelled touch, is none */
        if (e.type !== 'pointercancel' && (d.x !== d.x0 || d.y !== d.y0)) S.commit({ t: 'move', id: d.id, x: d.x, y: d.y });
        S.redraw();
      }
    });

    /* the toolbar: one tool. Tapping it again, when it is on, opens a small panel: the hint and "Bring to front" */
    S.item({ id: 'arrange', order: 5, label: 'arrange', pressed: true, panel: 'arrangePanel',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v18M3 12h18"/><path d="M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3"/></svg>',
      onClick: function () {
        if (st.tool !== 'arrange') { st.tool = 'arrange'; S.closePanels(); S.updateUi(); }
        else S.togglePanel('arrangePanel', 'arrange');
      },
      update: function (b) {
        b.setAttribute('aria-pressed', String(st.tool === 'arrange'));
        if (st.tool !== 'arrange' && selected) { selected = null; S.redraw(); }   // drawing: no element is chosen
        var n = now();
        front.disabled = !selected || n.order[n.order.length - 1] === selected;   // nothing to bring, or already in front
      } });
    var ap = document.createElement('div');
    ap.className = 'panel'; ap.id = 'arrangePanel'; ap.hidden = true; ap.setAttribute('role', 'group'); ap.setAttribute('aria-label', S.T.arrange);
    ap.innerHTML = '<p class="hint">' + S.T.arrangeHint + '</p>';
    var front = document.createElement('button');
    front.type = 'button'; front.className = 'sz'; front.id = 'front';
    front.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="9" width="11" height="11" rx="1.5"/><rect x="10" y="4" width="11" height="11" rx="1.5" fill="currentColor"/></svg><span>' + S.T.front + '</span>';
    front.addEventListener('click', function () {
      if (!front.disabled) { S.commit({ t: 'front', id: selected }); S.redraw(); }
      S.closePanels();
    });
    ap.appendChild(front);
    S.stage.appendChild(ap);
  }
});
