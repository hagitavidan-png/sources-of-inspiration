/*! Sources of Inspiration in Art | מקורות השראה באמנות. Original code and content (c) 2026 Hagit Avidan | חגית אבידן. All rights reserved | כל הזכויות שמורות. Works and materials by others belong to their owners | יצירות וחומרים של אחרים שייכים לבעליהם. See NOTICE.txt */
window.AppAdapters = window.AppAdapters || {};
window.AppAdapters.guide = function (D) {
'use strict';
var I = window.I18N;
function block(ref) {
var b = D.sections[ref[0]] && D.sections[ref[0]].blocks[ref[1]];
if (!b) throw new Error('lesson ' + D.number + ': no block ' + ref.join('/'));
return b;
}
function title(b) { return b.label ? I.tx(b.label).replace(/^\s*\d+\.\s*/, '') : ''; }
function rows(b) {
var out = [];
(b.guide || []).forEach(function (r) { out.push({ k: r.k || 'row', parts: r.parts || [] }); });
return out;
}
return {
lesson: { number: D.number, title: D.title, unit: D.unit, unitNum: D.unitNum, time: D.time },
block: block, title: title, rows: rows
};
};
