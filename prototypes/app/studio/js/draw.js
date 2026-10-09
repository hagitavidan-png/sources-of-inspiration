/* Tool: draw. Brush, three line widths and an eraser, with finger, stylus, mouse or trackpad.
   Adds the operation { t:'stroke', tool:'brush'|'eraser', color, w, pts:[x,y,…] } (artwork units).
   Live repeat (js/repeat.js): a line of the unit has u:1; while Repeat is on, its points are kept in the unit's own
   place (S.liveStart → map) and the line is shown in every repeat as it is drawn (S.pend), not piece by piece. */
Studio.register('draw', {
  tool: 'brush',   // the tool that is on when this capability comes first in the activity
  strings: {
    /* lineWidth, not size: the line width has its own word (Repeat's size is another thing; the tools share one table) */
    he: { brush: 'מכחול', lineWidth: 'עובי קו', eraser: 'מחק', thin: 'דק', medium: 'בינוני', thick: 'עבה', sizes: 'עובי' },
    en: { brush: 'Brush', lineWidth: 'Line width', eraser: 'Eraser', thin: 'Thin', medium: 'Medium', thick: 'Thick', sizes: 'Line width' }
  },
  init: function (S) {
    'use strict';
    var SIZES = [{ id: 'thin', px: 3 }, { id: 'medium', px: 8 }, { id: 'thick', px: 18 }];   // on-screen pixels when drawn
    var ERASER_FACTOR = 2.5;
    var INK = '#2b2a28';   // the line colour when the activity has no colour tool
    var st = S.state;
    st.size = 1;
    if (!st.color) st.color = INK;

    function styleFor(op, c) {
      c.globalCompositeOperation = op.tool === 'eraser' ? 'destination-out' : 'source-over';
      c.strokeStyle = c.fillStyle = op.color;
      c.lineWidth = op.w; c.lineCap = 'round'; c.lineJoin = 'round';
    }
    /* smooth line through the points: curves through the midpoints */
    function drawStroke(op, c) {
      var p = op.pts, n = p.length / 2;
      styleFor(op, c);
      if (n === 1) { c.beginPath(); c.arc(p[0], p[1], op.w / 2, 0, Math.PI * 2); c.fill(); return; }
      c.beginPath(); c.moveTo(p[0], p[1]);
      for (var i = 1; i < n - 1; i++) {
        var mx = (p[i * 2] + p[i * 2 + 2]) / 2, my = (p[i * 2 + 1] + p[i * 2 + 3]) / 2;
        c.quadraticCurveTo(p[i * 2], p[i * 2 + 1], mx, my);
      }
      c.lineTo(p[(n - 1) * 2], p[(n - 1) * 2 + 1]);
      c.stroke();
    }
    S.renderer('stroke', drawStroke);
    /* app prototype only: params.draw.view shows the lines and offers no drawing (lesson 2.1, version 2) */
    if (((S.activity.params || {}).draw || {}).view) { this.tool = null; return; }

    /* while drawing: only the newest piece, so the line follows the hand without delay */
    function drawTail(op) {
      var ctx = S.ctx(), p = op.pts, n = p.length / 2;
      styleFor(op, ctx);
      if (n < 2) { ctx.beginPath(); ctx.arc(p[0], p[1], op.w / 2, 0, Math.PI * 2); ctx.fill(); return; }
      ctx.beginPath();
      if (n === 2) { ctx.moveTo(p[0], p[1]); ctx.lineTo((p[0] + p[2]) / 2, (p[1] + p[3]) / 2); }
      else {
        var a = n - 3, b = n - 2, c2 = n - 1;
        ctx.moveTo((p[a * 2] + p[b * 2]) / 2, (p[a * 2 + 1] + p[b * 2 + 1]) / 2);
        ctx.quadraticCurveTo(p[b * 2], p[b * 2 + 1], (p[b * 2] + p[c2 * 2]) / 2, (p[b * 2 + 1] + p[c2 * 2 + 1]) / 2);
      }
      ctx.stroke();
    }
    var cur = null, map = null, last = null;   // map: live repeat, where the points go; last: the last point on screen
    var stroke = {
      down: function (e) {
        var px = SIZES[st.size].px * (st.tool === 'eraser' ? ERASER_FACTOR : 1), p = S.pt(e), lv = S.liveStart(p);
        map = lv && lv.map; last = p;
        cur = { t: 'stroke', tool: st.tool, color: st.color, w: Math.round(px / S.scale() * 100) / 100, pts: map ? map(p) : p };
        if (lv) cur.u = 1;
        if (map) S.pend(cur); else drawTail(cur);
      },
      move: function (events) {
        if (!cur) return;
        var min = 0.6 / S.scale(), more = false;   // ignore movements under 0.6 screen pixels
        events.forEach(function (ev) {
          var q = S.pt(ev);
          if (Math.abs(q[0] - last[0]) + Math.abs(q[1] - last[1]) < min) return;
          last = q;
          if (map) { q = map(q); more = true; }
          cur.pts.push(q[0], q[1]);
          if (!map) drawTail(cur);
        });
        if (more) S.pend(cur);
      },
      up: function () {
        if (!cur) return;
        var p = cur.pts;
        if (p.length >= 4) p.push(p[p.length - 2], p[p.length - 1]);   // finish the last curve
        if (map) S.pend(null);
        S.commit(cur); cur = null; map = null;
        S.redraw();
      }
    };
    S.pointer('brush', stroke);
    S.pointer('eraser', stroke);

    /* toolbar: brush, size, eraser (the colour tool, if the activity has it, sits between brush and size) */
    S.item({ id: 'brush', order: 10, label: 'brush', pressed: true,
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16.5 3.5l4 4L8 20H4v-4z"/><path d="M14 6l4 4"/></svg>',
      onClick: function () { st.tool = 'brush'; S.closePanels(); S.updateUi(); },
      update: function (b) { b.setAttribute('aria-pressed', String(st.tool === 'brush')); } });
    S.item({ id: 'size', order: 30, label: 'lineWidth', panel: 'sizePanel',
      icon: '<span class="size-dot" aria-hidden="true"><i id="sizeDot"></i></span>',
      onClick: function () { S.togglePanel('sizePanel', 'size'); },
      update: function () { var d = [8, 13, 20][st.size], dot = S.$('sizeDot'); dot.style.width = dot.style.height = d + 'px'; } });
    S.item({ id: 'eraser', order: 40, label: 'eraser', pressed: true,
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.5 20H20"/><path d="M4.6 15.4l9.9-9.9a2 2 0 012.8 0l2.2 2.2a2 2 0 010 2.8L11 19H8.2a2 2 0 01-1.4-.6l-2.2-2.2a2 2 0 010-2.8z"/><path d="M9.5 10.5l5 5"/></svg>',
      onClick: function () { st.tool = 'eraser'; S.closePanels(); S.updateUi(); },
      update: function (b) { b.setAttribute('aria-pressed', String(st.tool === 'eraser')); } });

    /* the size panel */
    var sp = document.createElement('div');
    sp.className = 'panel'; sp.id = 'sizePanel'; sp.hidden = true; sp.setAttribute('role', 'group'); sp.setAttribute('aria-label', S.T.sizes);
    SIZES.forEach(function (s, k) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'sz';
      var d = Math.max(4, s.px);
      b.innerHTML = '<i style="width:' + d + 'px;height:' + d + 'px"></i><span>' + S.T[s.id] + '</span>';
      b.addEventListener('click', function () { st.size = k; mark(); S.closePanels(); S.updateUi(); });
      sp.appendChild(b);
    });
    function mark() { sp.querySelectorAll('.sz').forEach(function (b, k) { b.setAttribute('aria-pressed', String(k === st.size)); }); }
    mark();
    S.stage.appendChild(sp);
  }
});
