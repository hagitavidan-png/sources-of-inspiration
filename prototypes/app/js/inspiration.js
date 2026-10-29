/*! Sources of Inspiration in Art | מקורות השראה באמנות. Original code and content (c) 2026 Hagit Avidan | חגית אבידן. All rights reserved | כל הזכויות שמורות. Works and materials by others belong to their owners | יצירות וחומרים של אחרים שייכים לבעליהם. See NOTICE.txt */
window.Inspiration = (function () {
'use strict';
var STR = {
he: { title: 'השראה', close: 'חזרה', sections: 'חלקי הגלריה', pick: 'בחרו מה לגלות', all: 'כל התמונות', prev: 'התמונה הקודמת', next: 'התמונה הבאה',
count: 'תמונה {n} מתוך {total}', open: 'הגדלת התמונה: {what}', newTab: '(נפתח בלשונית חדשה)', source: 'מקור', rights: 'מקור וזכויות' },
en: { title: 'Inspiration', close: 'Back', sections: 'Gallery sections', pick: 'Choose what to explore', all: 'All the images', prev: 'Previous image', next: 'Next image',
count: 'Image {n} of {total}', open: 'Enlarge image: {what}', newTab: '(opens in a new tab)', source: 'Source', rights: 'Source and rights' }
};
var CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
var EXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v6H4V6h6"/></svg>';
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function fill(t, o) { return t.replace(/\{(\w+)\}/g, function (m, k) { return o[k]; }); }
var CSS = '' +
'.insp{--i-bg:var(--bg,#f7f4ee);--i-ink:var(--ink,#1d1d1b);--i-soft:var(--soft,#5b5852);--i-card:var(--card,#fff);--i-rule:var(--rule,#dcd6cb);--i-accent:var(--accent,#1d1d1b);' +
'width:min(100vw,1500px);max-width:100vw;height:100dvh;max-height:100dvh;margin:auto;padding:0;border:0;background:var(--i-bg);color:var(--i-ink);font:inherit;overflow:hidden}' +
'.insp::backdrop{background:rgba(20,18,15,.55)}' +
'.insp-wrap{display:grid;grid-template-rows:auto auto 1fr;height:100%}' +
'.insp-top{display:flex;align-items:center;gap:12px;padding:10px max(16px,env(safe-area-inset-left,0px)) 6px;padding-inline-end:max(16px,env(safe-area-inset-right,0px))}' +
'.insp-top h2{margin:0;font-size:clamp(1.15rem,1rem + .8vw,1.8rem);flex:1}' +
'.insp-btn{font:inherit;font-weight:600;border-radius:999px;border:1px solid var(--i-ink);background:var(--i-ink);color:var(--i-bg);padding:8px 18px;min-height:44px;cursor:pointer}.insp-x{margin-inline-end:8px;font-size:.95em}' +
'.insp-btn.quiet{background:transparent;color:var(--i-ink)}' +
'.insp-note summary:focus-visible,.insp-btn:focus-visible,.insp-pickbtn:focus-visible,.insp-opt:focus-visible,.insp-tile:focus-visible,.insp-card a:focus-visible,.insp-step:focus-visible,.insp-src a:focus-visible{outline:3px solid var(--i-accent);outline-offset:2px}' +
'.insp-pick{position:relative;z-index:2;padding:2px max(16px,env(safe-area-inset-left,0px)) 10px;padding-inline-end:max(16px,env(safe-area-inset-right,0px));border-bottom:1px solid var(--i-rule)}' +
'.insp-pickbtn{display:inline-flex;align-items:center;gap:10px;font:inherit;font-weight:600;border:1px solid var(--i-ink);background:var(--i-card);color:var(--i-ink);border-radius:999px;padding:8px 16px;min-height:44px;cursor:pointer}' +
'.insp-pickbtn svg{width:18px;height:18px;transition:transform .2s}.insp-pickbtn[aria-expanded=true] svg{transform:rotate(180deg)}' +
'.insp-menu{position:absolute;inset-inline-start:max(16px,env(safe-area-inset-left,0px));top:calc(100% - 6px);margin:0;padding:6px;list-style:none;min-width:min(280px,calc(100vw - 32px));background:var(--i-card);border:1px solid var(--i-rule);border-radius:14px;box-shadow:0 10px 30px rgba(20,18,15,.18)}' +
'.insp-menu[hidden]{display:none}' +
'.insp-opt{display:flex;align-items:center;width:100%;min-height:48px;padding:8px 14px;border:0;border-radius:10px;background:none;color:var(--i-ink);font:inherit;text-align:start;cursor:pointer}' +
'.insp-opt:hover{background:var(--i-bg)}.insp-opt[aria-current=true]{font-weight:700}' +
'.insp-sec h3:focus{outline:none}' +
'.insp-body{overflow-y:auto;padding:0 max(16px,env(safe-area-inset-left,0px)) 28px;padding-inline-end:max(16px,env(safe-area-inset-right,0px))}' +
'.insp-sec{padding:6px 0 18px}.insp-sec h3{margin:8px 0 10px;font-size:clamp(1.05rem,.95rem + .6vw,1.5rem)}' +
'.insp-intro{margin:-4px 0 12px;color:var(--i-soft);max-width:70ch}' +
'.insp-text{margin:6px 0 0;font-weight:400}' +
'.insp-note{margin-top:12px;font-size:.86rem;color:var(--i-soft)}.insp-note summary{display:inline-block;cursor:pointer;min-height:32px;padding:4px 2px;text-decoration:underline;text-underline-offset:3px}.insp-note p{margin:4px 0 0;max-width:70ch}' +
'.insp-grid{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 14px;align-items:start}' +
'@media (min-width:700px){.insp-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:22px 20px}}' +
'@media (min-width:1200px){.insp-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:26px 24px}}' +
'.insp-grid li{min-width:0}' +
'.insp-tile{display:flex;flex-direction:column;gap:6px;width:100%;padding:0;border:0;background:none;color:inherit;font:inherit;text-align:start;cursor:pointer}' +
'.insp-tile span.f{display:block;width:100%}' +
'.insp-tile img{display:block;width:100%;height:auto}' +
'.insp-tile small{font-size:.86rem;line-height:1.3;color:var(--i-soft)}.insp-tile small b{display:block;color:var(--i-ink)}' +
'.insp-cards{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:12px}' +
'.insp-card{background:var(--i-card);border:1px solid var(--i-rule);border-radius:12px;padding:14px 16px;display:flex;flex-direction:column;gap:6px}' +
'.insp-card b{font-size:1.08rem}.insp-card .w{color:var(--i-soft)}.insp-card p{margin:0}.insp-card .q{font-weight:600}' +
'.insp-card a{display:inline-flex;align-items:center;gap:6px;margin-top:4px;color:var(--i-ink);font-weight:600}.insp-card a svg{width:16px;height:16px}' +
'.insp-go{display:flex;flex-direction:column;gap:6px;margin-top:4px}.insp-go a{margin:0;min-height:44px;padding:6px 12px;border:1.5px solid var(--i-rule);border-radius:10px;justify-content:space-between}' +
'.insp-go a span{display:flex;flex-direction:column}.insp-go small{font-weight:400;font-size:.82rem;color:var(--i-soft)}' +
'.insp-one{position:absolute;inset:0;z-index:3;background:var(--i-bg);display:grid;grid-template-rows:auto 1fr auto auto;padding:10px max(16px,env(safe-area-inset-left,0px)) 14px}' +
'.insp-one[hidden]{display:none}' +
'.insp-one figure{margin:0;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}' +
'.insp-one img{max-width:100%;max-height:calc(100dvh - 230px);object-fit:contain;display:block}' +
'.insp-cap{text-align:center;max-width:70ch}.insp-cap b{display:block}.insp-src{font-size:.86rem;color:var(--i-soft)}.insp-src a{color:inherit}' +
'.insp-nav{display:flex;align-items:center;justify-content:center;gap:14px;padding:6px 0}' +
'.insp-step{width:48px;height:48px;border-radius:50%;border:1px solid var(--i-rule);background:var(--i-card);color:var(--i-ink);display:grid;place-items:center;cursor:pointer}' +
'.insp-step svg{width:22px;height:22px}[dir=ltr] .insp-step svg{transform:scaleX(-1)}' +
'.insp-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}';
function style() {
if (document.getElementById('insp-css')) return;
var s = document.createElement('style'); s.id = 'insp-css'; s.textContent = CSS; document.head.appendChild(s);
}
function open(o) {
var data = (window.INSPIRATION || {})[o.lesson];
if (!data) return null;
style();
var lang = o.lang === 'en' ? 'en' : 'he', T = STR[lang], rtl = lang === 'he', base = o.base || '';
function tx(v) { return v == null ? '' : typeof v === 'string' ? v : (v[lang] || v.he || ''); }
function url(p) { return /^(https?:)?\/\//.test(p) ? p : base + p; }
var flat = [];
var d = document.createElement('dialog');
d.className = 'insp'; d.setAttribute('dir', rtl ? 'rtl' : 'ltr'); d.setAttribute('lang', lang); d.setAttribute('aria-label', T.title);
d.innerHTML = '<div class="insp-wrap">' +
'<div class="insp-top"><h2>' + esc(T.title) + '</h2><button type="button" class="insp-btn insp-close">' + (o.x ? '<span class="insp-x" aria-hidden="true">✕</span>' : '') + esc(o.close || T.close) + '</button></div>' +
'<nav class="insp-pick" aria-label="' + esc(T.sections) + '"><button type="button" class="insp-pickbtn" aria-expanded="false" aria-controls="insp-menu">' + esc(T.pick) +
CHEV + '<path d="M6 9l6 6 6-6"/></svg></button><ul class="insp-menu" id="insp-menu" hidden>' + data.sections.map(function (s) {
return '<li><button type="button" class="insp-opt" data-sec="' + esc(s.id) + '">' + esc(tx(s.title)) + '</button></li>';
}).join('') + '</ul></nav>' +
'<div class="insp-body">' + data.sections.map(function (s) {
var h = '<section class="insp-sec" id="insp-' + esc(s.id) + '" data-sec="' + esc(s.id) + '"><h3 tabindex="-1">' + esc(tx(s.title)) + '</h3>' + (s.intro ? '<p class="insp-intro">' + esc(tx(s.intro)) + '</p>' : '');
if (s.items) h += '<ul class="insp-grid">' + s.items.map(function (it) {
var i = flat.push({ it: it, sec: s.id }) - 1, name = it.artist ? '<b>' + esc(tx(it.artist)) + '</b><bdi>' + esc(tx(it.work)) + '</bdi>' : esc(tx(it.alt));
return '<li><button type="button" class="insp-tile" data-i="' + i + '" aria-label="' + esc(fill(T.open, { what: tx(it.alt) })) + '"><span class="f"><img src="' + esc(url(it.img)) + '" alt="" loading="lazy"' +
(it.size ? ' width="' + it.size[0] + '" height="' + it.size[1] + '"' : '') + '></span><small aria-hidden="true">' + name + '</small></button></li>';
}).join('') + '</ul>';
if (s.links) h += '<ul class="insp-cards">' + s.links.map(function (l) {
return '<li class="insp-card"><b>' + esc(tx(l.name)) + '</b><span class="w"><bdi>' + esc(tx(l.work)) + '</bdi></span><p>' + esc(tx(l.text)) + '</p>' +
(l.ask ? '<p class="q">' + esc(tx(l.ask)) + '</p>' : '') +
(l.go ? '<span class="insp-go">' + l.go.map(function (g) {
return '<a href="' + esc(g.href) + '" target="_blank" rel="noopener noreferrer"><span>' + esc(tx(g.label)) + '<small>' + esc(tx(g.site)) + '</small></span>' + EXT + '<span class="insp-sr"> ' + esc(T.newTab) + '</span></a>';
}).join('') + '</span>' :
'<a href="' + esc(l.href) + '" target="_blank" rel="noopener noreferrer">' + esc(tx(l.site)) + EXT + '<span class="insp-sr"> ' + esc(T.newTab) + '</span></a>') + '</li>';
}).join('') + '</ul>';
if (s.note) h += '<details class="insp-note"><summary>' + esc(T.rights) + '</summary><p>' + esc(tx(s.note)) + '</p></details>';
return h + '</section>';
}).join('') + '</div></div>' +
'<div class="insp-one" hidden role="group"><div class="insp-top" style="padding:0 0 6px"><span style="flex:1"></span><button type="button" class="insp-btn quiet insp-all">' + esc(T.all) + '</button></div>' +
'<figure><img alt=""><figcaption class="insp-cap"></figcaption></figure>' +
'<div class="insp-nav"><button type="button" class="insp-step" data-step="-1" aria-label="' + esc(T.prev) + '">' + CHEV + '<path d="M9 5l7 7-7 7"/></svg></button>' +
'<span class="insp-count" aria-live="polite"></span>' +
'<button type="button" class="insp-step" data-step="1" aria-label="' + esc(T.next) + '">' + CHEV + '<path d="M15 5l-7 7 7 7"/></svg></button></div></div>';
document.body.appendChild(d);
var body = d.querySelector('.insp-body'), one = d.querySelector('.insp-one'), big = one.querySelector('img'), cap = one.querySelector('.insp-cap'), at = -1;
function mark(id) { d.querySelectorAll('.insp-opt').forEach(function (c) { c.setAttribute('aria-current', String(c.getAttribute('data-sec') === id)); }); }
var jumped = 0;
function goSec(id, smooth) {
var el = d.querySelector('#insp-' + id); if (!el) return;
var top = el.offsetTop - body.offsetTop, still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
jumped = Date.now() + (smooth ? 900 : 0);
if (smooth && !still && body.scrollTo) body.scrollTo({ top: top, behavior: 'smooth' }); else body.scrollTop = top;
mark(id);
}
var pick = d.querySelector('.insp-pickbtn'), menu = d.querySelector('.insp-menu'), opts = [].slice.call(d.querySelectorAll('.insp-opt'));
function menuOpen(on, focus) {
menu.hidden = !on; pick.setAttribute('aria-expanded', String(on));
if (on) { var c = opts.filter(function (b) { return b.getAttribute('aria-current') === 'true'; })[0] || opts[0]; if (focus) c.focus(); }
}
pick.addEventListener('click', function () { menuOpen(menu.hidden, true); });
pick.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); menuOpen(true, true); } });
opts.forEach(function (b, i) {
b.addEventListener('click', function () {
var id = b.getAttribute('data-sec');
menuOpen(false); goSec(id, true);
d.querySelector('#insp-' + id + ' h3').focus({ preventScroll: true });
});
b.addEventListener('keydown', function (e) {
if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); opts[(i + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length].focus(); }
else if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); opts[e.key === 'Home' ? 0 : opts.length - 1].focus(); }
else if (e.key === 'Tab') menuOpen(false);
});
});
var swallow = false;
d.addEventListener('pointerdown', function (e) { if (!menu.hidden && !e.target.closest('.insp-pick')) { menuOpen(false); swallow = true; setTimeout(function () { swallow = false; }, 700); } });
d.addEventListener('click', function (e) { if (swallow) { swallow = false; e.preventDefault(); e.stopPropagation(); } }, true);
function inSec(i) { var s = flat[i].sec; return flat.map(function (f, j) { return f.sec === s ? j : -1; }).filter(function (j) { return j >= 0; }); }
function out(href, inner) { return '<a href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' + inner + '<span class="insp-sr"> ' + esc(T.newTab) + '</span></a>'; }
function show(i) {
var list = inSec(i), k = list.indexOf(i), it = flat[i].it, c = it.credit;
at = i; big.src = url(it.img); big.alt = tx(it.alt);
cap.innerHTML = (it.artist ? '<b>' + esc(tx(it.artist)) + '</b><bdi>' + esc(tx(it.work)) + '</bdi>' : esc(tx(it.alt))) +
(it.text ? '<p class="insp-text">' + esc(tx(it.text)) + '</p>' : '') +
(c ? '<div class="insp-src">' + esc(T.source) + ': ' + out(c.href, '<bdi>' + esc(c.who) + '</bdi>') + ' · ' +
(c.licenceHref ? out(c.licenceHref, esc(tx(c.licence))) : esc(tx(c.licence))) + (c.changes ? ' · ' + esc(tx(c.changes)) : '') + '</div>' : '');
d.querySelector('.insp-count').innerHTML = '<span aria-hidden="true">' + (k + 1) + '/' + list.length + '</span><span class="insp-sr">' + esc(fill(T.count, { n: k + 1, total: list.length })) + '</span>';
d.querySelector('.insp-nav').hidden = list.length < 2;
one.hidden = false; one.setAttribute('aria-label', tx(it.alt));
}
function step(dlt) { var list = inSec(at), k = list.indexOf(at); show(list[((k + dlt) % list.length + list.length) % list.length]); }
function grid() { var b = d.querySelector('.insp-tile[data-i="' + at + '"]'); one.hidden = true; big.removeAttribute('src'); if (b) b.focus(); at = -1; }
function close() { d.close(); }
d.querySelectorAll('.insp-tile').forEach(function (b) { b.addEventListener('click', function () { show(+b.getAttribute('data-i')); d.querySelector('.insp-all').focus(); }); });
d.querySelectorAll('.insp-step').forEach(function (b) { b.addEventListener('click', function () { step(+b.getAttribute('data-step')); }); });
d.querySelector('.insp-all').addEventListener('click', grid);
d.querySelector('.insp-close').addEventListener('click', close);
d.addEventListener('keydown', function (e) {
if (at >= 0 && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { e.preventDefault(); step((e.key === 'ArrowRight') !== rtl ? 1 : -1); }
});
d.addEventListener('cancel', function (e) {
if (!menu.hidden) { e.preventDefault(); menuOpen(false); pick.focus(); }
else if (at >= 0) { e.preventDefault(); grid(); }
});
var x0 = null;
big.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
big.addEventListener('pointerup', function (e) { if (x0 === null) return; var dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 40) step((dx < 0) !== rtl ? 1 : -1); });
big.addEventListener('dragstart', function (e) { e.preventDefault(); });
var later = 0;
function spy() {
var cur = null; d.querySelectorAll('.insp-sec').forEach(function (s) { if (s.offsetTop - body.offsetTop <= body.scrollTop + 40) cur = s.getAttribute('data-sec'); });
if (cur) mark(cur);
}
body.addEventListener('scroll', function () {
var wait = jumped + 500 - Date.now();
clearTimeout(later); if (wait > 0) later = setTimeout(spy, wait); else spy();
}, { passive: true });
d.addEventListener('close', function () {
d.remove();
if (o.from && o.from.focus) o.from.focus({ preventScroll: true });
if (o.onClose) o.onClose();
});
d.showModal();
var secs = d.querySelectorAll('.insp-sec'), last = secs[secs.length - 1];
if (last) last.style.minHeight = Math.max(0, body.clientHeight - 8) + 'px';
if (o.section) goSec(o.section); else mark(data.sections[0].id);
(o.section ? d.querySelector('#insp-' + o.section + ' h3') || pick : d.querySelector('.insp-close')).focus({ preventScroll: true });
return d;
}
return { open: open };
})();
