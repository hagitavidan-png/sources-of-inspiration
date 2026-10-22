/*! Sources of Inspiration in Art | מקורות השראה באמנות. Original code and content (c) 2026 Hagit Avidan | חגית אבידן. All rights reserved | כל הזכויות שמורות. Works and materials by others belong to their owners | יצירות וחומרים של אחרים שייכים לבעליהם. See NOTICE.txt */
window.PlayerKinds = window.PlayerKinds || {};
(function (PlayerKinds) {
'use strict';
var I = window.I18N;
function esc(s) { return window.Player.esc(s); }
function src(p) { return window.Player.src(p); }
function frame(o, inner) {
var r = (o.size[0] / o.size[1]).toFixed(4);
return '<div class="k21-pic" style="aspect-ratio:' + o.size[0] + '/' + o.size[1] + ';width:min(100%,calc(var(--k21-h) * ' + r + '))">' +
'<img src="' + esc(src(o.img)) + '" alt="' + esc(I.tx(o.alt)) + '" width="' + o.size[0] + '" height="' + o.size[1] + '">' + (inner || '') + '</div>';
}
PlayerKinds.units = function (x) {
var o = x.s.units, w = ((o.r || 0.12) * 100).toFixed(2), hr = ((o.r || 0.12) * o.size[0] / o.size[1] * 100).toFixed(2);
var pc = function (v) { return (v * 100).toFixed(2) + '%'; };
var boxes = (o.boxes || []).map(function (b, i) {
return '<span class="k21-box" style="left:' + pc(b[0]) + ';top:' + pc(b[1]) + ';width:' + pc(b[2] - b[0]) + ';height:' + pc(b[3] - b[1]) + ';--i:' + i + '" aria-hidden="true"></span>';
}).join('');
var rings = (o.at || []).map(function (p, i) {
return '<span class="k21-ring' + (i ? '' : ' k21-unit') + '" style="left:' + (p[0] * 100).toFixed(2) + '%;top:' + (p[1] * 100).toFixed(2) + '%;width:' + w + '%;height:' + hr + '%;--i:' + i + '" aria-hidden="true"></span>';
}).join('');
var n = (o.boxes || []).length, step = n && o.step ? '<div class="k21-step"><button type="button" class="k21-next">' + esc(I.tx(o.step.first)) + '</button>' +
'<span class="k21-dots" aria-hidden="true">' + o.boxes.map(function () { return '<i></i>'; }).join('') + '</span><span class="k21-said" aria-live="polite"></span></div>' : '';
var d = o.detail, u = (o.at || [])[0], below = '', reveal = '';
if (d && u) {
var k = (o.r || 0.12) * (d.span || 1.5), ar = (d.size[1] / d.size[0]).toFixed(4);
var side = u[0] > 0.5 ? 'right:calc(' + pc(1 - u[0]) + ' + var(--k21-d) / 2 + 16px);left:0' : 'left:calc(' + pc(u[0]) + ' + var(--k21-d) / 2 + 16px);right:0';
reveal = '<button type="button" class="k21-reveal" aria-expanded="false" aria-controls="k21-detail" aria-label="' + esc(I.tx(d.open)) + '" title="' + esc(I.tx(d.open)) + '" ' +
'style="left:' + pc(u[0]) + ';top:' + pc(u[1]) + ';width:' + w + '%;height:' + hr + '%"></button>';
below = '<div class="k21-detail" id="k21-detail" style="width:min(100%,calc(var(--k21-h) * ' + (o.size[0] / o.size[1]).toFixed(4) + '))">' +
'<span class="k21-dstem" style="left:' + pc(u[0]) + '" aria-hidden="true"></span>' +
'<span class="k21-unitzoom" role="img" aria-label="' + esc(I.tx(d.alt)) + '" style="left:' + pc(u[0]) + ';background-image:url(' + esc(src(d.img)) + ');' +
'--bw:calc(var(--k21-d) / ' + k.toFixed(4) + ');background-size:var(--bw) auto;' +
'background-position:calc(var(--k21-d) / 2 - var(--bw) * ' + u[0] + ') calc(var(--k21-d) / 2 - var(--bw) * ' + ar + ' * ' + u[1] + ')"></span>' +
'<p class="k21-ask" style="' + side + '">' + esc(I.tx(d.caption)) + '</p></div>';
}
return { html: '<figure class="k21-fig">' + frame(o, rings + reveal + boxes) + below + step + (o.artist ? '<figcaption class="k21-cap"><b>' + esc(I.tx(o.artist)) + '</b> · <bdi>' + esc(I.tx(o.work)) + '</bdi></figcaption>' : '') + '</figure>',
mount: step || reveal ? function (root) { if (step) groups(root, o, n); if (reveal) unit(root); } : undefined };
};
function unit(root) {
var fig = root.querySelector('.k21-fig'), btn = root.querySelector('.k21-reveal'), box = root.querySelector('.k21-detail');
btn.addEventListener('click', function () {
var open = !fig.classList.contains('k21-open');
fig.classList.toggle('k21-open', open); fig.classList.add('k21-found');
btn.setAttribute('aria-expanded', String(open));
if (open) setTimeout(function () { box.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }, 460);
});
}
function groups(root, o, n) {
var at = 0, btn = root.querySelector('.k21-next'), pic = root.querySelector('.k21-pic'),
boxes = root.querySelectorAll('.k21-box'), dots = root.querySelectorAll('.k21-dots i'), said = root.querySelector('.k21-said');
function set(k) {
at = k;
boxes.forEach(function (b, i) { b.classList.toggle('on', i === k - 1); });
dots.forEach(function (d, i) { d.classList.toggle('on', i === k - 1); });
btn.textContent = I.tx(k === 0 ? o.step.first : k < n ? o.step.next : o.step.whole);
said.textContent = k && o.names ? I.tx(o.names[k - 1]) : '';
pic.dataset.group = k;
}
function advance() { set((at + 1) % (n + 1)); }
btn.addEventListener('click', advance);
pic.classList.add('k21-tap');
pic.addEventListener('click', advance);
set(0);
}
PlayerKinds.artwork = function (x) {
var o = x.s.artwork;
return { html: '<figure class="k21-fig">' + frame(o) + '<figcaption class="k21-cap"><b>' + esc(I.tx(o.artist)) + '</b> · <bdi>' + esc(I.tx(o.work)) + '</bdi></figcaption></figure>' };
};
})(window.PlayerKinds);
