/*! Sources of Inspiration in Art | מקורות השראה באמנות. Original code and content (c) 2026 Hagit Avidan | חגית אבידן. All rights reserved | כל הזכויות שמורות. Works and materials by others belong to their owners | יצירות וחומרים של אחרים שייכים לבעליהם. See NOTICE.txt */
Studio.register('fill', {
tool: 'fill',
strings: {
he: { fill: 'מילוי' },
en: { fill: 'Fill' }
},
init: function (S) {
'use strict';
var LINE = { color: '#2b2a28', width: 4 };
var st = S.state;
if (!st.color) st.color = '#2b2a28';
var regions = ((S.activity.content || {}).regions || []).filter(function (r) { return r && typeof r.id === 'string' && typeof r.d === 'string'; });
if (!regions.length) { console.warn('Studio: the fill tool needs content.regions ([{ id, d }]) in the activity'); return; }
var byId = {};
regions.forEach(function (r) { byId[r.id] = new Path2D(r.d); });
var probe = document.createElement('canvas').getContext('2d');
function outline(c, path) {
c.globalCompositeOperation = 'source-over';
c.strokeStyle = LINE.color; c.lineWidth = LINE.width; c.lineJoin = 'round';
c.stroke(path);
}
S.base(function (c) { regions.forEach(function (r) { outline(c, byId[r.id]); }); });
S.renderer('fill', function (op, c) {
var path = byId[op.region];
if (!path) return;
c.globalCompositeOperation = 'source-over';
c.fillStyle = op.color; c.fill(path, 'evenodd');
outline(c, path);
});
function regionAt(p) {
for (var i = regions.length - 1; i >= 0; i--) if (probe.isPointInPath(byId[regions[i].id], p[0], p[1], 'evenodd')) return regions[i].id;
return null;
}
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
