/*! Sources of Inspiration in Art | מקורות השראה באמנות. Original code and content (c) 2026 Hagit Avidan | חגית אבידן. All rights reserved | כל הזכויות שמורות. Works and materials by others belong to their owners | יצירות וחומרים של אחרים שייכים לבעליהם. See NOTICE.txt */
window.Crop = (function () {
'use strict';
function fw(e, z) { return Math.min(e[0], e[1]) / z / e[0]; }
function fh(e, z) { return Math.min(e[0], e[1]) / z / e[1]; }
function clamp(e, f, zoom) {
var z = Math.max(zoom[0], Math.min(zoom[1], +f.z || zoom[0])), w = fw(e, z), h = fh(e, z);
return { cx: Math.max(w / 2, Math.min(1 - w / 2, isNaN(+f.cx) ? 0.5 : +f.cx)), cy: Math.max(h / 2, Math.min(1 - h / 2, isNaN(+f.cy) ? 0.5 : +f.cy)), z: z };
}
function same(a, b) { return !!a && !!b && Math.abs(a.cx - b.cx) < 0.005 && Math.abs(a.cy - b.cy) < 0.005 && Math.abs(a.z - b.z) < 0.05; }
function draw(canvas, im, f, px) {
var dpr = Math.min(2, window.devicePixelRatio || 1), n = Math.round(px * dpr);
if (canvas.width !== n || canvas.height !== n) { canvas.width = n; canvas.height = n; }
var nw = im.naturalWidth || im.width, nh = im.naturalHeight || im.height, sd = Math.min(nw, nh) / f.z;
var sx = Math.max(0, Math.min(nw - sd, f.cx * nw - sd / 2)), sy = Math.max(0, Math.min(nh - sd, f.cy * nh - sd / 2));
var c = canvas.getContext('2d'); c.imageSmoothingQuality = 'high';
c.drawImage(im, sx, sy, sd, sd, 0, 0, n, n);
}
var cache = {};
function load(url) {
if (!cache[url]) cache[url] = new Promise(function (ok, no) { var im = new Image(); im.onload = function () { ok(im); }; im.onerror = no; im.src = url; });
return cache[url];
}
function normalize(c) {
if (!c) return c;
function hi(img) { return img ? img.replace(/images\/2-2\/(?!hi\/)/, 'images/2-2/hi/') : img; }
['worlds', 'areas'].forEach(function (k) {
c[k] = (c[k] || []).map(function (w) { if (!w.src) w.src = c.src; if (!w.img) w.img = c.img; if (!w.hi) w.hi = hi(w.img); return w; });
});
return c;
}
function frameOf(w) { return { cx: w.cx, cy: w.cy, z: w.z }; }
function sameDetail(a, b) { return !!a && !!b && a.src === b.src && same(a, b); }
return { fw: fw, fh: fh, clamp: clamp, same: same, sameDetail: sameDetail, frameOf: frameOf, normalize: normalize, draw: draw, load: load };
})();
