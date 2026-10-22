/*! Sources of Inspiration in Art | מקורות השראה באמנות. Original code and content (c) 2026 Hagit Avidan | חגית אבידן. All rights reserved | כל הזכויות שמורות. Works and materials by others belong to their owners | יצירות וחומרים של אחרים שייכים לבעליהם. See NOTICE.txt */
window.Closeup = (function () {
'use strict';
var I = window.I18N;
var STR = {
he: { far: 'רחוק', close: 'קרוב', zoom: 'קרוב או רחוק', closer: 'להתקרב', farther: 'להתרחק', enlarge: 'להגדיל', backPic: 'חזרה לתמונה',
surprise: 'הפתיעו אותי', keep: 'שמרו את הפרט שבחרתם', saved: 'השראה שמורה', savedN: 'שמרתם {n} פרטים', savedOne: 'שמרתם פרט אחד', other: 'תמונה אחרת', source: 'מקור וזכויות', empty: 'שמרו פרט מעניין, והוא יחכה לכם כאן.',
detailN: 'פרט {n}', removeDetail: 'הסרת פרט {n}', goDetail: 'חזרה לפרט {n}', photos: 'התמונות', photo: 'התמונה: {what}',
frame: 'מבט מקרוב. גררו כדי להזיז, או הקישו על מקום בתמונה', detail: 'הפרט בהגדלה', justSaved: 'נשמר', already: 'הפרט הזה כבר שמור. הזיזו את המסגרת או שנו את הקרבה כדי לשמור פרט אחר.', full: 'אפשר לשמור עד {n} פרטים. אפשר להסיר פרט שמור.' },
en: { far: 'Far', close: 'Close', zoom: 'Closer or farther', closer: 'Closer', farther: 'Farther', enlarge: 'Enlarge', backPic: 'Back to the picture',
surprise: 'Surprise me', keep: 'Save the detail you chose', saved: 'Saved inspiration', savedN: 'You saved {n} details', savedOne: 'You saved 1 detail', other: 'Another photo', source: 'Source and rights', empty: 'Save a detail that interests you, and it will wait for you here.',
detailN: 'Detail {n}', removeDetail: 'Remove detail {n}', goDetail: 'Back to detail {n}', photos: 'Photographs', photo: 'The photograph: {what}',
frame: 'A closer look. Drag to move it, or tap a place in the picture', detail: 'The detail, enlarged', justSaved: 'Saved', already: 'This detail is already saved. Move the frame or change the zoom to save a different one.', full: 'You can save up to {n} details. You can remove a saved one.' }
};
function T(k, o) { var t = (STR[I.lang()] || STR.en)[k] || k; return o ? t.replace(/\{(\w+)\}/g, function (m, x) { return o[x]; }) : t; }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
var Crop = window.Crop, fw = Crop.fw, fh = Crop.fh, clampFrame = Crop.clamp, same = Crop.sameDetail, draw = Crop.draw, load = Crop.load;
function mount(el, o) {
var zoom = o.zoom || [2, 8], max = o.max || 24, worlds = o.worlds, frames = o.frames || {}, entry = o.entry, e, f, image = null, big = null;
var view, frame, range, live, list, keepBtn, status, say = 0;
function url(path) { return o.src(path); }
function alt(en) { return I.tx(en.alt); }
function build(start) {
e = entry.size;
f = clampFrame(e, start || frames[entry.id] || { cx: 0.5, cy: 0.5, z: 3 }, zoom); frames[entry.id] = f;
var strip = o.gallery.map(function (g) {
return '<li><button type="button" class="cu-pic" data-id="' + g.id + '" aria-pressed="' + (g.id === entry.id) + '" aria-label="' + esc(T('photo', { what: alt(g) })) + '">' +
'<img src="' + esc(url(g.img)) + '" alt="" loading="lazy" draggable="false"></button></li>';
}).join('');
el.innerHTML =
'<div class="cu-main' + (e[0] / e[1] < 0.9 ? ' cu-tall' : '') + '"><div class="cu-view" dir="ltr" style="aspect-ratio:' + e[0] + '/' + e[1] + ';width:min(100%,calc(var(--cu-h) * ' + (e[0] / e[1]).toFixed(4) + '))">' +
'<img class="cu-img" src="' + esc(url(entry.img)) + '" alt="' + esc(T('photo', { what: alt(entry) })) + '" draggable="false">' +
'<div class="cu-frame" tabindex="0" role="slider" aria-label="' + esc(T('frame')) + '" aria-valuemin="' + zoom[0] + '" aria-valuemax="' + zoom[1] + '"></div></div>' +
'<div class="cu-row cu-ctl">' +
'<div class="cu-zoomrow"><span class="cu-end">' + esc(T('far')) + '</span>' +
'<button type="button" class="cu-step" data-z="-1" aria-label="' + esc(T('farther')) + '">−</button>' +
'<input class="cu-zoom" type="range" min="' + zoom[0] + '" max="' + zoom[1] + '" step="0.05" aria-label="' + esc(T('zoom')) + '">' +
'<button type="button" class="cu-step" data-z="1" aria-label="' + esc(T('closer')) + '">+</button>' +
'<span class="cu-end">' + esc(T('close')) + '</span></div>' +
'<div class="cu-keeprow"><button type="button" class="cu-peek cu-enlarge" aria-label="' + esc(T('enlarge')) + '"><canvas class="cu-live" aria-hidden="true"></canvas></button>' +
'<button type="button" class="cu-btn cu-keep"></button></div></div></div>' +
'<section class="cu-saved" aria-label="' + esc(T('saved')) + '"><h3 class="cu-saved-h"><span class="cu-n"></span><span class="cu-status" role="status"></span></h3>' +
'<ul class="cu-worlds"></ul><p class="cu-empty">' + esc(T('empty')) + '</p></section>' +
'<div class="cu-more"><p class="cu-more-h"><span>' + esc(T('other')) + '</span><button type="button" class="cu-link cu-surprise">' + esc(T('surprise')) + '</button></p>' +
'<ul class="cu-pics" aria-label="' + esc(T('photos')) + '">' + strip + '</ul></div>';
view = el.querySelector('.cu-view'); frame = el.querySelector('.cu-frame'); range = el.querySelector('.cu-zoom');
live = el.querySelector('.cu-live'); list = el.querySelector('.cu-worlds'); keepBtn = el.querySelector('.cu-keep'); status = el.querySelector('.cu-status');
image = null;
load(url(entry.hi)).then(function (im) { image = im; paint(); });
bind(); thumbs(); paint();
var on = el.querySelector('.cu-pic[aria-pressed=true]');
if (on) { var s = on.parentNode.parentNode; s.scrollLeft = on.parentNode.offsetLeft - (s.clientWidth - on.offsetWidth) / 2; }
}
function put(next, animate) {
f = clampFrame(e, next, zoom); frames[entry.id] = f;
frame.classList.toggle('cu-glide', !!animate);
paint(); if (o.onFrame) o.onFrame(f);
}
function paint() {
var w = fw(e, f.z), h = fh(e, f.z);
frame.style.left = ((f.cx - w / 2) * 100) + '%'; frame.style.top = ((f.cy - h / 2) * 100) + '%';
frame.style.width = (w * 100) + '%'; frame.style.height = (h * 100) + '%';
frame.setAttribute('aria-valuenow', f.z.toFixed(1)); frame.setAttribute('aria-valuetext', '×' + f.z.toFixed(1));
range.value = f.z;
if (image) { draw(live, image, f, Math.max(120, Math.min(520, Math.round(live.clientWidth || 120)))); if (big) draw(big.canvas, image, f, big.px); }
var full = worlds.length >= max;
keepBtn.textContent = T('keep'); keepBtn.disabled = full; keepBtn.title = full ? T('full', { n: max }) : '';
el.querySelector('.cu-n').textContent = worlds.length === 1 ? T('savedOne') : worlds.length ? T('savedN', { n: worlds.length }) : '';
list.querySelectorAll('.cu-w').forEach(function (b, i) { b.classList.toggle('on', same(worlds[i], Object.assign({ src: entry.id }, f))); });
}
function thumbs() {
list.innerHTML = worlds.map(function (w, i) {
return '<li><button type="button" class="cu-w" aria-label="' + esc(T('goDetail', { n: i + 1 })) + '"><canvas aria-hidden="true"></canvas></button>' +
'<button type="button" class="cu-x" aria-label="' + esc(T('removeDetail', { n: i + 1 })) + '">×</button></li>';
}).join('');
el.querySelector('.cu-empty').hidden = worlds.length > 0;
list.hidden = !worlds.length;
list.querySelectorAll('li').forEach(function (li, i) {
var w = worlds[i];
load(url(w.hi)).then(function (im) { draw(li.querySelector('canvas'), im, w, 64); });
li.querySelector('.cu-w').addEventListener('click', function () {
if (w.src !== entry.id) { entry = o.gallery.filter(function (g) { return g.id === w.src; })[0] || entry; if (o.onSource) o.onSource(entry.id); build(Crop.frameOf(w)); }
else put(Crop.frameOf(w), true);
if (o.onFrame) o.onFrame(f);
});
li.querySelector('.cu-x').addEventListener('click', function () { worlds.splice(i, 1); changed(); thumbs(); paint(); });
});
}
function changed() { if (o.onWorlds) o.onWorlds(worlds); }
function note(t) { status.textContent = t; clearTimeout(say); say = setTimeout(function () { status.textContent = ''; }, t === T('already') ? 4200 : 1800); }
function bind() {
el.querySelectorAll('.cu-pic').forEach(function (b) {
b.addEventListener('click', function () {
var g = o.gallery.filter(function (x) { return x.id === b.getAttribute('data-id'); })[0];
if (!g || g === entry) return;
entry = g; if (o.onSource) o.onSource(g.id); build(); if (o.onFrame) o.onFrame(f);
});
});
var drag = null;
function at(ev) { var r = view.getBoundingClientRect(); return { x: (ev.clientX - r.left) / r.width, y: (ev.clientY - r.top) / r.height }; }
view.addEventListener('pointerdown', function (ev) {
if (ev.button > 0) return;
var p = at(ev), w = fw(e, f.z), h = fh(e, f.z), inside = Math.abs(p.x - f.cx) <= w / 2 && Math.abs(p.y - f.cy) <= h / 2;
drag = inside ? { dx: p.x - f.cx, dy: p.y - f.cy } : { dx: 0, dy: 0 };
view.setPointerCapture(ev.pointerId); put({ cx: p.x - drag.dx, cy: p.y - drag.dy, z: f.z }, !inside); frame.focus({ preventScroll: true });
});
view.addEventListener('pointermove', function (ev) { if (!drag) return; var p = at(ev); put({ cx: p.x - drag.dx, cy: p.y - drag.dy, z: f.z }); });
function up() { drag = null; }
view.addEventListener('pointerup', up); view.addEventListener('pointercancel', up);
frame.addEventListener('keydown', function (ev) {
var d = ev.shiftKey ? 0.08 : 0.02, m = { ArrowLeft: [-d, 0], ArrowRight: [d, 0], ArrowUp: [0, -d], ArrowDown: [0, d] }[ev.key];
if (m) { ev.preventDefault(); put({ cx: f.cx + m[0], cy: f.cy + m[1], z: f.z }); }
else if (ev.key === '+' || ev.key === '=') { ev.preventDefault(); put({ cx: f.cx, cy: f.cy, z: f.z + 0.5 }); }
else if (ev.key === '-') { ev.preventDefault(); put({ cx: f.cx, cy: f.cy, z: f.z - 0.5 }); }
});
range.addEventListener('input', function () { put({ cx: f.cx, cy: f.cy, z: +range.value }); });
el.querySelectorAll('.cu-ctl .cu-step').forEach(function (b) { b.addEventListener('click', function () { put({ cx: f.cx, cy: f.cy, z: f.z + 0.75 * +b.getAttribute('data-z') }, true); }); });
el.querySelector('.cu-surprise').addEventListener('click', function () {
var z = 3 + Math.random() * 4, w = fw(e, z), h = fh(e, z);
put({ cx: w / 2 + Math.random() * (1 - w), cy: h / 2 + Math.random() * (1 - h), z: z }, true);
});
keepBtn.addEventListener('click', function () {
var d = { src: entry.id, img: entry.img, hi: entry.hi, cx: f.cx, cy: f.cy, z: f.z };
if (worlds.length >= max) return note(T('full', { n: max }));
if (worlds.some(function (w) { return same(w, d); })) return note(T('already'));
worlds.push(d); changed(); thumbs(); paint(); note(T('justSaved'));
list.scrollLeft = list.scrollWidth;
});
el.querySelector('.cu-enlarge').addEventListener('click', enlarge);
}
var opener = null;
function onKey(ev) { if (ev.key === 'Escape' && big) { ev.stopPropagation(); close(); } }
function close() {
if (!big) return; document.removeEventListener('keydown', onKey, true); big.box.remove(); big = null;
if (opener) opener.focus({ preventScroll: true });
}
function enlarge() {
opener = document.activeElement;
var box = document.createElement('div');
box.className = 'cu-big'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', T('detail'));
box.innerHTML = '<div class="cu-big-stage"><canvas></canvas></div><div class="cu-big-bar">' +
'<button type="button" class="cu-step" data-z="-1" aria-label="' + esc(T('farther')) + '">−</button>' +
'<button type="button" class="pl-primary cu-back">' + esc(T('backPic')) + '</button>' +
'<button type="button" class="cu-step" data-z="1" aria-label="' + esc(T('closer')) + '">+</button></div>';
document.body.appendChild(box);
var stage = box.querySelector('.cu-big-stage'), canvas = box.querySelector('canvas');
var px = Math.max(160, Math.floor(Math.min(stage.clientWidth, stage.clientHeight)));
canvas.style.width = canvas.style.height = px + 'px';
big = { box: box, canvas: canvas, px: px };
var g = null;
canvas.addEventListener('pointerdown', function (ev) { g = { x: ev.clientX, y: ev.clientY }; canvas.setPointerCapture(ev.pointerId); });
canvas.addEventListener('pointermove', function (ev) {
if (!g) return;
var dx = (ev.clientX - g.x) / px, dy = (ev.clientY - g.y) / px; g = { x: ev.clientX, y: ev.clientY };
put({ cx: f.cx - dx * fw(e, f.z), cy: f.cy - dy * fh(e, f.z), z: f.z });
});
canvas.addEventListener('pointerup', function () { g = null; }); canvas.addEventListener('pointercancel', function () { g = null; });
box.querySelectorAll('.cu-step').forEach(function (b) { b.addEventListener('click', function () { put({ cx: f.cx, cy: f.cy, z: f.z + 0.75 * +b.getAttribute('data-z') }); }); });
box.querySelector('.cu-back').addEventListener('click', close);
document.addEventListener('keydown', onKey, true);
if (image) draw(canvas, image, f, px);
box.querySelector('.cu-back').focus({ preventScroll: true });
}
build();
return { frame: function () { return f; }, entry: function () { return entry; }, close: close };
}
return { mount: mount, draw: draw, load: load, clamp: clampFrame, same: same, T: T, esc: esc, STR: STR };
})();
window.PlayerKinds = window.PlayerKinds || {};
(function () {
'use strict';
var C = window.Closeup, Crop = window.Crop, I = window.I18N, esc = C.esc, T = C.T;
function opts(x) { return x.L.closeup; }
function scr(x, kind) { var k = x.L.screens.findIndex(function (s) { return s.kind === kind || s.step === kind; }); return k < 0 ? 1 : k + 1; }
function entryOf(x, id) { return opts(x).gallery.filter(function (g) { return g.id === id; })[0]; }
function src(path) { return window.Player.src(path); }
function state(x) {
var c = x.run.close = x.run.close || {};
c.worlds = c.worlds || []; c.areas = c.areas || []; c.frames = c.frames || {};
if (!c.src || !entryOf(x, c.src)) c.src = opts(x).gallery[0].id;
c.img = entryOf(x, c.src).img;
return Crop.normalize(c);
}
function detailOf(x, c, f) { var e = entryOf(x, f.src || c.src); return { src: e.id, img: e.img, hi: e.hi, cx: f.cx, cy: f.cy, z: f.z }; }
function current(c) { return c.areas.length ? c.areas[c.areas.length - 1] : (c.choice && c.worlds[c.pick]) || null; }
function pushArea(x, c, f) { if (f && !(c.areas.length && Crop.sameDetail(c.areas[c.areas.length - 1], detailOf(x, c, f)))) c.areas.push(detailOf(x, c, f)); }
function fig(inner, cls) { return '<figure class="cu-fig' + (cls ? ' ' + cls : '') + '">' + inner + '</figure>'; }
function credit(c) { return c ? '<small class="pl-credit"><a href="' + esc(c.href) + '" target="_blank" rel="noopener noreferrer">' + esc(c.who) + ' · ' + esc(c.licence) + '</a></small>' : ''; }
function paintDetail(x, canvas, d, maxPx) {
return C.load(src(d.hi)).then(function (im) {
var px = Math.min(canvas.parentNode.clientWidth || maxPx, maxPx); Crop.draw(canvas, im, d, px); canvas.style.width = canvas.style.height = px + 'px';
});
}
function pickerHtml(c, pressed) {
return '<ul class="cu-worlds cu-pickers" aria-label="' + esc(T('saved')) + '">' + c.worlds.map(function (w, i) {
return '<li><button type="button" class="cu-w" aria-pressed="' + (i === pressed) + '" aria-label="' + esc(T('detailN', { n: i + 1 })) + '"><canvas aria-hidden="true"></canvas><span>' + (i + 1) + '</span></button></li>';
}).join('') + '</ul>';
}
function pickerMount(x, root, c, pick) {
root.querySelectorAll('.cu-pickers .cu-w').forEach(function (b, i) {
var w = c.worlds[i];
C.load(src(w.hi)).then(function (im) { Crop.draw(b.querySelector('canvas'), im, w, 64); });
b.addEventListener('click', function () {
c.pick = i; c.choice = Object.assign({}, w); root.querySelectorAll('.cu-pickers .cu-w').forEach(function (o, j) { o.setAttribute('aria-pressed', j === i); }); x.keep(); pick(i);
});
});
}
PlayerKinds.shrink = function (x) {
var o = x.s.shrink || opts(x).shrink, e = o.hi ? o : entryOf(x, o.src), r = (e.size[0] / e.size[1]).toFixed(4), he = I.lang() === 'he';
var OUT = he ? 'להתרחק' : 'Move back', IN = he ? 'להתקרב שוב' : 'Move closer again';
return {
html: fig('<div class="cu-shrink cu-tap" style="aspect-ratio:' + e.size[0] + '/' + e.size[1] + ';width:min(100%,calc(var(--cu-h) * ' + r + '))"><img src="' + esc(src(e.hi)) + '" alt="' + esc(I.tx(e.alt)) + '" style="--cu-s:' + (o.from || 5) + ';--cu-at:' + (o.at || '50% 50%') + '"></div>') +
'<p class="cu-act"><button type="button" class="cu-btn cu-moveback" aria-pressed="false">' + esc(OUT) + '</button></p>',
mount: function (root) {
var q = root.querySelector('.pl-q'), box = root.querySelector('.cu-shrink'), b = root.querySelector('.cu-moveback');
if (q) { q.hidden = true; q.classList.add('cu-quiet'); }
function toggle() {
var whole = box.classList.toggle('cu-whole'); b.textContent = whole ? IN : OUT; b.setAttribute('aria-pressed', whole);
if (whole && q) q.hidden = false;
}
b.addEventListener('click', toggle); box.addEventListener('click', toggle);
}
};
};
function okeeffeParts(x) {
var o = opts(x).okeeffe, he = I.lang() === 'he';
var S = he ? { go: 'להתקרב כמו אוקיף', back: 'להתרחק', cap: 'צילום של פרח דטורה. זה לא הציור של אוקיף.', link: 'פתחו את היצירה באתר Crystal Bridges', alt: 'פרח דטורה לבן, מלפנים' }
: { go: 'Get close like O\'Keeffe', back: 'Move back', cap: 'A photograph of a datura flower, not O\'Keeffe\'s painting.', link: 'Open the work on the Crystal Bridges website', alt: 'A white datura flower, face on' };
return {
html: fig('<div class="cu-shrink cu-datura" style="aspect-ratio:1/1;width:min(100%,var(--cu-h))"><img src="' + esc(o.img) + '.jpg" alt="' + esc(S.alt) + '" style="--cu-s:2.6">' +
'</div><p class="cu-act cu-act-under"><button type="button" class="cu-btn cu-moveback" aria-pressed="false">' + esc(S.go) + '</button></p>' +
'<figcaption>' + esc(S.cap) + '</figcaption>'),
source: credit(o.credit) + '<a class="cu-museum" href="' + esc(o.href) + '" target="_blank" rel="noopener noreferrer">' + esc(S.link) + ' ↗</a>',
mount: function (root) {
var b = root.querySelector('.cu-moveback'), box = root.querySelector('.cu-datura');
function toggle() { var on = box.classList.toggle('cu-zoomed'); b.setAttribute('aria-pressed', on); b.textContent = on ? S.back : S.go; }
b.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
box.addEventListener('click', toggle);
}
};
}
PlayerKinds.artists = function (x) {
var A = x.L.artists, he = I.lang() === 'he', works = [];
A.forEach(function (a) {
if (a.special === 'okeeffe') { works.push({ a: a, special: 'okeeffe', size: [1, 1], img: opts(x).okeeffe.img, alt: { he: 'פרח דטורה לבן, מלפנים', en: 'A white datura flower, face on' }, workTitle: a.work }); return; }
x.L.boards[a.board].forEach(function (it) { works.push({ a: a, it: it, size: it.size, img: it.img, alt: it.alt, workTitle: it.workTitle, credit: it.credit }); });
});
var ok = okeeffeParts(x);
function info(w) {
var a = w.a, src = w.special ? ok.source : (w.credit ? credit(w.credit) : '');
return '<div class="ar-info"><p class="ar-who"><b>' + esc(I.tx(a.name)) + '</b> · <bdi class="ar-work">' + esc(I.tx(w.workTitle)) + '</bdi> <span>· ' + esc(I.tx(a.way)) + '</span></p>' +
a.text[I.lang()].map(function (t) { return '<p class="ar-bg">' + t + '</p>'; }).join('') + '<p class="ar-q">' + esc(I.tx(a.ask)) + '</p>' +
(src ? '<details class="ar-src"><summary>' + esc(T('source')) + '</summary><p>' + src + '</p></details>' : '') + '</div>';
}
var items = works.map(function (w) {
if (w.special) return { win: ok.html, alt: I.tx(w.a.name), caption: info(w), note: true };
return { src: src(w.img), alt: I.tx(w.alt), ratio: (w.size[0] / w.size[1]).toFixed(4), caption: info(w), note: true };
});
return {
html: '<ul class="ar-grid ar-one">' + works.map(function (w, i) {
return '<li><button type="button" class="ar-img" data-i="' + i + '" data-artist="' + w.a.id + '" style="--r:' + (w.size[0] / w.size[1]).toFixed(4) + '" aria-label="' + esc(I.tx(w.a.name) + ': ' + I.tx(w.alt)) + '">' +
'<img src="' + esc(src(w.img)) + '" alt=""></button><p class="ar-under" aria-hidden="true"><span class="ar-chip">' + esc(I.tx(w.a.name)) + '</span>' + (w.special ? '<span class="ar-photo">' + esc(he ? 'צילום להמחשה' : 'Illustrative photo') + '</span>' : '') + '</p></li>';
}).join('') + '</ul><p class="ar-note">' + esc(he ? 'התמונה של הפרח היא צילום להמחשה, לא ציור מקורי של ג\'ורג\'יה אוקיף.' : 'The flower picture is an illustrative photograph, not an original painting by Georgia O\'Keeffe.') + '</p>' +
'<p class="pl-text pl-q ar-ask">' + esc(I.tx(x.s.compareAsk)) + '</p>',
mount: function (root) {
root.querySelectorAll('.ar-img').forEach(function (b) {
b.addEventListener('click', function () {
window.Viewer.open({ list: items, at: +b.getAttribute('data-i'), from: b, big: true, onShow: function (k) { if (works[k].special) ok.mount(document.querySelector('dialog.ga-view .ga-view-win')); } });
});
});
}
};
};
PlayerKinds.carousel = function (x) {
var list = x.L.boards[x.s.board], at = 0, he = I.lang() === 'he';
var PREV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>', NEXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
return {
html: '<section class="cu-car" aria-roledescription="carousel" aria-label="' + esc(I.ui('images')) + '">' +
'<div class="cu-car-stage">' + list.map(function (it, i) {
return '<button type="button" class="cu-car-img" data-i="' + i + '" style="--r:' + (it.size[0] / it.size[1]).toFixed(4) + '"' + (i ? ' hidden' : '') + ' aria-label="' + esc(I.ui('enlarge', { what: I.tx(it.alt) })) + '">' +
'<img src="' + esc(src(it.img)) + '" alt="' + esc(I.tx(it.alt)) + '" draggable="false"></button>';
}).join('') + '</div>' +
'<div class="cu-car-nav"><button type="button" class="pl-gal-btn cu-car-prev" aria-label="' + esc(I.ui('galleryPrev')) + '">' + PREV + '</button>' +
'<span class="cu-car-count" aria-live="polite"></span>' +
'<button type="button" class="pl-gal-btn cu-car-next" aria-label="' + esc(I.ui('galleryNext')) + '">' + NEXT + '</button></div></section>',
mount: function (root) {
var box = root.querySelector('.cu-car'), imgs = box.querySelectorAll('.cu-car-img'), count = box.querySelector('.cu-car-count');
function show(k) {
at = (k + list.length) % list.length;
imgs.forEach(function (b, i) { b.hidden = i !== at; });
count.innerHTML = '<span aria-hidden="true">' + (at + 1) + '/' + list.length + '</span><span class="pl-sr">' + esc(I.ui('galleryCount', { n: at + 1, total: list.length })) + '</span>';
}
box.querySelector('.cu-car-prev').addEventListener('click', function () { show(at - 1); });
box.querySelector('.cu-car-next').addEventListener('click', function () { show(at + 1); });
box.addEventListener('keydown', function (e) {
if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
e.preventDefault(); show(at + (((e.key === 'ArrowRight') !== he) ? 1 : -1));
});
var x0 = null, y0 = 0, moved = false;
box.querySelector('.cu-car-stage').addEventListener('pointerdown', function (e) { x0 = e.clientX; y0 = e.clientY; moved = false; });
box.querySelector('.cu-car-stage').addEventListener('pointerup', function (e) {
if (x0 === null) return; var dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { moved = true; show(at + (((dx < 0) !== he) ? 1 : -1)); }
});
imgs.forEach(function (b, i) {
b.addEventListener('click', function (e) {
if (moved) { moved = false; e.preventDefault(); return; }
window.Viewer.open({ list: list.map(function (it) { return { src: src(it.img), alt: I.tx(it.alt), ratio: (it.size[0] / it.size[1]).toFixed(4) }; }), at: i, from: b, big: true });
});
});
show(0);
}
};
};
PlayerKinds.stays = function (x) {
var e = entryOf(x, opts(x).stays.src), he = I.lang() === 'he';
var L3 = he ? ['שלם', 'מוגדל', 'חתוך'] : ['Whole', 'Enlarged', 'Cropped'], cap = I.tx(opts(x).stays.caption);
var scales = [1, 1.9, 4.2];
return {
html: fig('<ul class="cu-stack" style="--r:' + (e.size[0] / e.size[1]).toFixed(4) + '">' + scales.map(function (sc, i) {
return '<li><div class="cu-panel"><img src="' + esc(src(e.hi)) + '" alt="' + (i === 0 ? esc(I.tx(e.alt)) : '') + '" style="--cu-s:' + sc + '"></div><span class="cu-lab">' + esc(L3[i]) + '</span></li>';
}).join('') + '</ul><figcaption>' + esc(cap) + credit(e.credit) + '</figcaption>')
};
};
PlayerKinds.source = function (x) {
var c = state(x), chosen = !!c.chosen, g = opts(x).gallery;
var act = { label: I.ui('continue'), off: !chosen, go: function () { x.go(x.n + 1); } };
return {
html: '<ul class="cu-pick" role="group" aria-label="' + esc(I.tx(x.s.title)) + '">' + g.map(function (e) {
return '<li><button type="button" class="cu-pickbtn" data-id="' + e.id + '" aria-pressed="' + (chosen && c.src === e.id) + '" style="--r:' + (e.size[0] / e.size[1]).toFixed(4) + '">' +
'<img src="' + esc(src(e.img)) + '" alt="' + esc(I.tx(e.alt)) + '" loading="lazy"></button></li>';
}).join('') + '</ul>',
action: act,
mount: function (root) {
var go = root.querySelector('.pl-primary');
root.querySelectorAll('.cu-pickbtn').forEach(function (b) {
b.addEventListener('click', function () {
c.src = b.getAttribute('data-id'); c.chosen = true;
root.querySelectorAll('.cu-pickbtn').forEach(function (o) { o.setAttribute('aria-pressed', o === b); });
act.off = false; go.disabled = false; x.keep();
});
});
}
};
};
PlayerKinds.discover = function (x) {
var c = state(x), back = !!c.began, he = I.lang() === 'he', t = 0, mounted = null, root0 = null;
function frameNow() { return c.frames[c.src] || null; }
function late() { if (mounted && root0 && root0.isConnected) x.keep(); }
return {
inline: true,
html: '<div class="cu" data-cu></div>',
action: back ? { label: he ? 'חזרה לציור' : 'Back to my drawing', go: function () {
var f = frameNow(); pushArea(x, c, f);
c.pick = Math.max(0, c.worlds.findIndex(function (w) { return Crop.sameDetail(w, detailOf(x, c, f)); })); x.go(scr(x, 'detailPaper')); } }
: { label: I.ui('continue'), go: function () { x.go(x.n + 1); } },
mount: function (root) {
root0 = root.querySelector('[data-cu]'); var last = c.areas[c.areas.length - 1];
if (back && last && entryOf(x, last.src)) { c.src = last.src; c.frames[c.src] = c.frames[c.src] || Crop.frameOf(last); }
mounted = C.mount(root.querySelector('[data-cu]'), {
gallery: opts(x).gallery, entry: entryOf(x, c.src), src: src, zoom: opts(x).zoom, max: opts(x).worlds, frames: c.frames, worlds: c.worlds,
onSource: function (id) { c.src = id; c.img = entryOf(x, id).img; clearTimeout(t); t = setTimeout(late, 250); },
onFrame: function () { clearTimeout(t); t = setTimeout(late, 350); },
onWorlds: function () { x.keep(); }
});
if (!frameNow()) c.frames[c.src] = mounted.frame();
}
};
};
var W7 = {
he: { enlarge: 'הגדלת פרט {n}', more: 'חזרה למבט מקרוב', none: 'עדיין לא שמרתם תקריבים. אפשר לחזור ל\'מבט מקרוב\' ולבחור פרטים שמסקרנים אתכם.' },
en: { enlarge: 'Enlarge detail {n}', more: 'Back to A Closer Look', none: 'You haven\'t saved any close-ups yet. You can go back to \'A Closer Look\' and choose details that intrigue you.' }
};
function chosenAt(c) {
var i = c.choice ? c.worlds.findIndex(function (w) { return Crop.sameDetail(w, c.choice); }) : -1;
if (i < 0) delete c.choice; else c.pick = i;
return i;
}
PlayerKinds.world = function (x) {
var c = state(x), he = I.lang() === 'he', S = W7[he ? 'he' : 'en'], n = c.worlds.length, after = (x.s.after && x.s.after[I.lang()]) || [];
var back = function () { x.go(scr(x, 'discover')); };
return {
html: n ? '<ul class="cu-picks cu-picks-' + Math.min(n, 3) + '" aria-label="' + esc(T('saved')) + '">' + c.worlds.map(function (w, i) {
return '<li class="cu-pick"><button type="button" class="cu-pickimg" aria-label="' + esc(S.enlarge.replace('{n}', i + 1)) + '"><canvas aria-hidden="true"></canvas></button></li>';
}).join('') + '</ul>' + after.map(function (t) { return '<p class="pl-text cu-after">' + t + '</p>'; }).join('')
: '<p class="cu-empty cu-none">' + esc(S.none) + '</p>',
action: { label: I.ui('continue'), go: function () { x.go(x.n + 1); } },
extra: { label: S.more, go: back },
mount: function (root) {
root.querySelectorAll('.cu-pick').forEach(function (li, i) {
var w = c.worlds[i], btn = li.querySelector('.cu-pickimg');
C.load(src(w.hi)).then(function (im) { Crop.draw(li.querySelector('canvas'), im, w, 360); });
btn.addEventListener('click', function () {
C.load(src(w.hi)).then(function (im) {
var cv = document.createElement('canvas'); Crop.draw(cv, im, w, 900);
window.Viewer.open({ src: cv.toDataURL('image/jpeg', 0.9), alt: T('detailN', { n: i + 1 }), ratio: '1', caption: '', from: btn, big: true });
});
});
});
}
};
};
PlayerKinds.detailPaper = function (x) {
var c = state(x), he = I.lang() === 'he';
c.began = true;
if (x.studio) return { html: '' };
if (!c.worlds.length) { var f0 = current(c); if (f0) c.worlds.push(f0); }
var at = chosenAt(c);
if (at < 0 && current(c)) at = c.worlds.findIndex(function (w) { return Crop.sameDetail(w, current(c)); });
c.pick = at;
var S = he ? { h: 'מקור ההשראה שלי', detail: 'פרט שמור מ\'מבט מקרוב\'', own: 'צילום משלי, שצילמתי מחוץ לאפליקציה' }
: { h: 'My source of inspiration', detail: 'A saved detail from \'A Closer Look\'', own: 'My own photograph, taken outside the app' };
return {
html: '<div class="cu-insp" role="radiogroup" aria-label="' + esc(S.h) + '">' + ['detail', 'own'].map(function (k) {
return '<button type="button" role="radio" class="cu-inspbtn" data-insp="' + k + '" aria-checked="' + (c.inspiration === k) + '">' + esc(S[k]) + '</button>';
}).join('') + '</div>' +
'<div class="cu-world cu-detailbox"' + (c.inspiration === 'detail' ? '' : ' hidden') + '><button type="button" class="cu-bigbtn" aria-label="' + esc(T('enlarge')) + '"><canvas class="cu-bigdetail" aria-hidden="true"></canvas></button>' +
(c.worlds.length > 1 || (c.worlds.length && c.pick < 0) ? pickerHtml(c, c.pick) : '') + '</div>',
extra: { label: he ? 'לבחור אזור אחר' : 'Choose another area', go: function () { x.go(scr(x, 'discover')); } },
mount: function (root) {
var big = root.querySelector('.cu-bigdetail'), btn = root.querySelector('.cu-bigbtn'), box = root.querySelector('.cu-detailbox'), other = root.querySelector('.pl-foot .pl-secondary');
function show() { btn.hidden = !c.worlds[c.pick]; if (btn.hidden) return; pushArea(x, c, c.worlds[c.pick]); return paintDetail(x, big, c.worlds[c.pick], 420); }
function choose(k, first) {
c.inspiration = k; box.hidden = k !== 'detail'; if (other) other.hidden = k === 'own';
root.querySelectorAll('.cu-inspbtn').forEach(function (b) { b.setAttribute('aria-checked', b.getAttribute('data-insp') === k); });
if (k === 'detail') show(); if (!first) x.keep();
}
pickerMount(x, root, c, show);
root.querySelectorAll('.cu-inspbtn').forEach(function (b) { b.addEventListener('click', function () { choose(b.getAttribute('data-insp')); }); });
if (c.inspiration) choose(c.inspiration, true); else if (other) other.hidden = false;
btn.addEventListener('click', function () {
var d = c.worlds[c.pick];
C.load(src(d.hi)).then(function (im) {
var cv = document.createElement('canvas'); Crop.draw(cv, im, d, 900);
window.Viewer.open({ src: cv.toDataURL('image/jpeg', 0.9), alt: T('detailN', { n: c.pick + 1 }), ratio: '1', caption: '', from: btn, big: true });
});
});
}
};
};
PlayerKinds.stop = function (x) {
var he = I.lang() === 'he', work = x.studio && x.made(x.art);
var Q = he ? 'מה משתנה כשבוחרים אזור אחר? האם הוא מעורר בכם רעיון חדש?' : 'What changes when you choose a different area? Does it spark a new idea?';
return {
html: (work ? '<figure class="pl-studio-work"><img src="' + work.preview + '" alt=""></figure>' : '') + '<p class="pl-text pl-q">' + esc(Q) + '</p>',
action: { label: he ? 'להשוות ולסיים' : 'Compare and finish', go: function () { x.go(x.n + 1); } },
extra: { label: he ? 'להמשיך לצייר' : 'Keep drawing', go: function () { x.go(scr(x, 'detailPaper')); } },
later: { label: he ? 'לבחור אזור אחר' : 'Choose another area', go: function () { x.go(scr(x, 'discover')); } }
};
};
PlayerKinds.compare = function (x) {
var c = state(x), he = I.lang() === 'he';
if (!x.studio && c.inspiration !== 'detail') {
if (c.inspiration !== 'own') return { html: '' };
var own = he ? 'יצרתם בהשראת צילום משלכם' : 'You created this inspired by your own photograph';
return { html: '<p class="cu-label cu-own">' + esc(own) + '</p>' };
}
var cur = current(c), areas = c.areas.length ? c.areas : (cur ? [cur] : []);
if (!cur) return { html: '' };
var e = entryOf(x, (cur && cur.src) || c.src), W = e.size[0], H = e.size[1];
var marks = areas.filter(function (a) { return a.src === e.id; }).map(function (a, i) {
var w = Math.min(W, H) / a.z, last = a === areas[areas.length - 1];
return '<rect x="' + (a.cx * W - w / 2).toFixed(1) + '" y="' + (a.cy * H - w / 2).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + w.toFixed(1) + '" class="' + (last ? 'cu-mark cu-last' : 'cu-mark') + '"/>' +
'<text x="' + (a.cx * W - w / 2 + 8).toFixed(1) + '" y="' + (a.cy * H - w / 2 + 8 + H / 24).toFixed(1) + '" class="cu-num" style="font-size:' + (H / 20).toFixed(1) + 'px">' + (i + 1) + '</text>';
}).join('');
var srcL = he ? 'מקור ההשראה' : 'Your source', mine = he ? 'הציור שלכם' : 'Your drawing', det = he ? 'הפרט שבחרתם' : 'The detail you chose';
return {
html: fig('<div class="cu-cmp" style="aspect-ratio:' + W + '/' + H + ';width:min(100%,calc(var(--cu-h) * ' + (W / H).toFixed(4) + '))"><img src="' + esc(src(e.img)) + '" alt="' + esc(I.tx(e.alt)) + '">' +
'<svg viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true">' + marks + '</svg></div><figcaption>' + esc(srcL) + credit(e.credit) + '</figcaption>') +
(x.studio ? '<p class="cu-label">' + esc(mine) + '</p>' : '<div class="cu-world"><canvas class="cu-bigdetail" aria-hidden="true"></canvas></div><p class="cu-label">' + esc(det) + '</p>'),
mount: function (root) {
var big = root.querySelector('.cu-bigdetail');
if (big && cur) paintDetail(x, big, cur, 360);
}
};
};
})();
