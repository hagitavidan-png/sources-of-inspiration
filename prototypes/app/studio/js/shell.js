/*! Sources of Inspiration in Art | מקורות השראה באמנות. Original code and content (c) 2026 Hagit Avidan | חגית אבידן. All rights reserved | כל הזכויות שמורות. Works and materials by others belong to their owners | יצירות וחומרים של אחרים שייכים לבעליהם. See NOTICE.txt */
Studio.shell = (function () {
'use strict';
var $ = function (id) { return document.getElementById(id); };
var S;
var panels = [];
var ICON = {
undo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 010 12h-3"/></svg>',
redo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 14l5-5-5-5"/><path d="M20 9H10a6 6 0 000 12h3"/></svg>'
};
function button(id, icon, label) {
var b = document.createElement('button');
b.className = 'tool'; b.id = id; b.type = 'button';
b.innerHTML = icon + '<span data-t="' + label + '"></span>';
return b;
}
function build(s) {
S = s;
var nav = $('tools');
var u = button('undo', ICON.undo, 'undo'); u.disabled = true; u.addEventListener('click', S.undo); nav.appendChild(u);
var r = button('redo', ICON.redo, 'redo'); r.disabled = true; r.addEventListener('click', S.redo); nav.appendChild(r);
if (S.items.length) { var g = document.createElement('i'); g.className = 'gap'; g.setAttribute('aria-hidden', 'true'); nav.appendChild(g); }
S.items.forEach(function (it) {
var b = button(it.id, it.icon, it.label);
if (it.panel) { b.setAttribute('aria-haspopup', 'true'); b.setAttribute('aria-expanded', 'false'); panels.push([it.panel, it.id, !!it.stay]); }
if (it.pressed) b.setAttribute('aria-pressed', 'false');
b.addEventListener('click', it.onClick);
nav.appendChild(b);
});
var vt = button('varyToggle', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></svg>', 'varyToggle');
vt.classList.add('vary-toggle'); vt.setAttribute('aria-expanded', 'false');
vt.addEventListener('click', function () {
var open = document.documentElement.classList.toggle('vary-open');
vt.setAttribute('aria-expanded', String(open));
});
vt.setAttribute('aria-label', S.T.varyToggle); vt.title = S.T.varyToggle; vt.querySelector('span').textContent = S.T.varyToggle;
if (S.clear) {
var g2 = document.createElement('i'); g2.className = 'gap gap-rs'; g2.setAttribute('aria-hidden', 'true'); nav.appendChild(g2);
var rs = button('restartTool', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5"/><path d="M9.5 13.5a3 3 0 1 0 1-2.2"/><path d="M9.3 9.8l.2 1.7 1.7-.2"/></svg>', 'clear');
rs.classList.add('restart-tool'); rs.disabled = true;
rs.addEventListener('click', function () { $('clear').click(); });
nav.appendChild(rs);
$('clear').hidden = true;
}
var tray = document.createElement('div');
tray.className = 'tray'; tray.id = 'tray';
nav.parentNode.insertBefore(tray, nav);
[].slice.call($('stage').querySelectorAll('.panel')).forEach(function (p) { tray.appendChild(p); });
if (S.prompt) { var pr = document.createElement('p'); pr.className = 'prompt'; pr.textContent = S.prompt; $('stage').parentNode.insertBefore(pr, $('stage')); }
document.querySelectorAll('[data-t]').forEach(function (el) { el.textContent = S.T[el.getAttribute('data-t')]; });
nav.querySelectorAll('.tool > span[data-t]').forEach(function (sp) { sp.parentNode.setAttribute('aria-label', sp.textContent); sp.parentNode.title = sp.textContent; });
var more = $('more'), menu = $('menu'), top = document.querySelector('.top');
more.setAttribute('aria-label', S.T.more); more.title = S.T.more;
function menuOpen(on) {
menu.hidden = !on; more.setAttribute('aria-expanded', String(on));
if (on) { onScreen(); var f = [].filter.call(menu.children, shown).filter(function (b) { return !b.disabled; })[0]; if (f) f.focus(); }
}
function onScreen() {
menu.style.transform = '';
var r = menu.getBoundingClientRect(), m = 6, dx = Math.max(0, m - r.left) - Math.max(0, r.right - (innerWidth - m));
if (dx) menu.style.transform = 'translateX(' + dx + 'px)';
}
more.addEventListener('click', function () { closePanels(); menuOpen(menu.hidden); });
menu.addEventListener('click', function (e) { if (e.target.closest('.menu-item')) menuOpen(false); });
document.addEventListener('pointerdown', function (e) { if (!menu.hidden && !e.target.closest('#moreWrap')) menuOpen(false); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { menuOpen(false); more.focus(); } });
function shown(el) { return !el.hidden && getComputedStyle(el).display !== 'none'; }
function syncMore() {
var none = ![].some.call(menu.children, shown);
if ($('moreWrap').hidden !== none) $('moreWrap').hidden = none;
}
document.addEventListener('pointerdown', function (e) {
if (!e.target.closest('.panel') && !panels.some(function (p) { return e.target.closest('#' + p[1]); })) closePanels(true);
});
$('clear').addEventListener('click', function () {
if (!S.hasDrawing()) return;
if (S.startNew) return ask('confirmNew').then(function (v) { if (v === 'new') S.startNew().catch(function () { saveState('error'); toast(S.T.saveFailed, 2600); }); });
ask('confirmClear').then(function (v) { if (v === 'clear') S.clearAll(); });
});
$('save').addEventListener('click', S.save);
if (!S.clear) $('clear').hidden = true;
$('save').classList.add('main');
if (S.next) {
var next = document.createElement('button');
next.className = 'btn primary main'; next.id = 'next'; next.type = 'button'; next.textContent = S.next;
$('save').parentNode.appendChild(next);
next.addEventListener('click', function () {
if (next.disabled) return;
next.disabled = true;
S.flush().then(function (ok) {
if (ok !== false && !S.dirty()) { toast(S.T.doneSaved, 1500); setTimeout(leave, 700); return; }
next.disabled = false; saveState('error'); toast(S.T.saveFailed, 2600);
}, function () { next.disabled = false; saveState('error'); toast(S.T.saveFailed, 2600); });
});
if (S.source) $('back').style.visibility = 'hidden';
}
if (S.works) {
var works = document.createElement('a');
works.className = 'works'; works.href = S.works; works.setAttribute('aria-label', S.T.works); works.title = S.T.works;
works.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M4 18l5-5 4 4 3-3 4 4"/></svg>';
top.insertBefore(works, $('moreWrap'));
var worksItem = document.createElement('a');
worksItem.className = 'menu-item menu-works'; worksItem.href = S.works; worksItem.textContent = S.T.works;
menu.appendChild(worksItem);
[works, worksItem].forEach(function (a) {
a.addEventListener('click', function (e) {
e.preventDefault();
S.flush().then(function () { if (!S.dirty()) { allowUnload = true; location.href = S.works; } });
});
});
}
if (S.paper) {
var paperItem = document.createElement('a');
paperItem.className = 'menu-item menu-paper'; paperItem.href = S.paper.href;
paperItem.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9 13l6-6"/></svg><span></span>';
paperItem.querySelector('span').textContent = S.paper.label;
menu.insertBefore(paperItem, menu.firstChild);
paperItem.addEventListener('click', function (e) {
e.preventDefault();
S.flush().then(function () { if (!S.dirty()) { allowUnload = true; location.href = S.paper.href; } });
});
}
var fv = document.createElement('button');
fv.type = 'button'; fv.id = 'fitView'; fv.className = 'fitview'; fv.hidden = true;
fv.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="4" width="14" height="16" rx="1.5"/><path d="M9 9h6M9 13h6"/></svg><span></span>';
top.insertBefore(fv, $('moreWrap'));
fv.addEventListener('click', function () { S.setView(vw.z > 1.01 ? 'fit' : 'fill'); });
var fs = document.createElement('button');
fs.type = 'button'; fs.id = 'saveNow'; fs.className = 'fsave';
fs.setAttribute('aria-label', S.T.saveNow); fs.title = S.T.saveNow;
fs.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h11l3 3v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M8 4v5h7V4"/><rect x="8" y="13" width="8" height="5" rx=".5"/></svg>';
top.insertBefore(fs, fv);
fs.addEventListener('click', function () {
if (fs.disabled) return;
fs.disabled = true;
Promise.resolve(S.auto ? S.flush().then(function () { return !S.dirty(); }) : S.save()).then(function (ok) { return ok; }, function () { return false; })
.then(function (ok) { fs.disabled = false; toast(ok ? S.T.savedNow : S.T.saveNowFailed, ok ? 1800 : 3600); });
});
var ex = document.createElement('button');
ex.type = 'button'; ex.id = 'expand'; ex.className = 'expand'; ex.setAttribute('aria-pressed', 'false');
ex.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
'<g class="ex-on"><path d="M4 9V4h5"/><path d="M20 9V4h-5"/><path d="M4 15v5h5"/><path d="M20 15v5h-5"/></g>' +
'<g class="ex-off"><path d="M9 4v5H4"/><path d="M15 4v5h5"/><path d="M9 20v-5H4"/><path d="M15 20v-5h5"/></g></svg><span></span>';
top.insertBefore(ex, $('save'));
var hinted = false;
function expand(on, first) {
document.documentElement.classList.toggle('expanded', on);
document.documentElement.classList.remove('vary-open'); vt.setAttribute('aria-expanded', 'false');
if (on && !vt.parentNode && document.querySelector('.app > div.chrome > .vary')) $('tools').insertBefore(vt, $('restartTool') ? $('restartTool').previousElementSibling : null);
ex.setAttribute('aria-pressed', String(on));
ex.querySelector('span').textContent = on ? S.T.showAll : S.T.expand;
ex.setAttribute('aria-label', on ? S.T.showAllLong : S.T.expandLong); ex.title = on ? S.T.showAllLong : S.T.expandLong;
fitBar();
if (first) return;
if (S.layout) S.layout();
var larger = S.setView('fit');
if (on && larger && !hinted && window.matchMedia && matchMedia('(pointer: coarse)').matches) { hinted = true; toast(S.T.moveHint, 2600); }
}
ex.addEventListener('click', function () { expand(!document.documentElement.classList.contains('expanded')); });
document.addEventListener('keydown', function (e) {
if (e.key === 'Escape' && document.documentElement.classList.contains('expanded') && !document.querySelector('dialog[open]') && menu.hidden) expand(false);
});
var fitting = 0;
function fitBar() {
top.classList.remove('t1', 't2', 't3', 't4', 't5', 't6');
syncMore();
var steps = ['t1', 't2', 't3', 't4', 't5', 't6'];
for (var i = 0; i < steps.length && over(); i++) { top.classList.add(steps[i]); syncMore(); }
}
function over() {
var m = top.querySelector('.main:not([hidden])');
if (m && m.offsetParent !== null) {
var rg = document.createRange(); rg.selectNodeContents(m);
var tops = {}; [].forEach.call(rg.getClientRects(), function (q) { tops[Math.round(q.top)] = 1; });
if (Object.keys(tops).length > 2) return true;
}
var r = top.getBoundingClientRect(), cs = getComputedStyle(top);
var lo = r.left + parseFloat(cs.paddingLeft) - 1, hi = r.right - parseFloat(cs.paddingRight) + 1;
return [].some.call(top.children, function (el) {
if (el.offsetParent === null || getComputedStyle(el).position === 'absolute') return false;
var q = el.getBoundingClientRect(); return q.width > 0 && (q.left < lo || q.right > hi);
});
}
function refit() { syncMore(); if (!fitting) fitting = requestAnimationFrame(function () { fitting = 0; fitBar(); }); }
window.addEventListener('resize', refit);
if (window.MutationObserver) new MutationObserver(refit).observe(top, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['hidden'] });
expand(false, true);
if (S.keep) {
var keep = document.createElement('button'), busy = false;
keep.className = 'btn primary main'; keep.id = 'keep'; keep.type = 'button'; keep.textContent = S.keep;
$('save').parentNode.appendChild(keep);
keep.addEventListener('click', function () {
if (busy) return;
busy = true; keep.disabled = true; keeping = true;
S.point('kept').then(function (p) { keeping = false; saveState(''); if (p) toast(S.T.kept); }, function () { keeping = false; saveState('error'); })
.then(function () { busy = false; keep.disabled = false; });
});
}
syncMore(); refit();
if (S.auto) {
$('save').hidden = true;
$('back').addEventListener('click', function () {
S.flush().then(function () { if (!S.dirty()) leave(); });
});
document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') S.flush(true); });
window.addEventListener('pagehide', function () { S.flush(true); });
return;
}
$('back').addEventListener('click', function () {
if (!S.dirty()) return leave();
ask('confirmExit').then(function (v) {
if (v === 'exit') leave();
else if (v === 'save') Promise.resolve(S.save()).then(function (ok) { if (ok) setTimeout(leave, 450); });
});
});
window.addEventListener('beforeunload', function (e) {
if (S.dirty() && !allowUnload) { e.preventDefault(); e.returnValue = ''; }
});
}
var allowUnload = false;
function leave() { allowUnload = true; location.href = S.back(); }
function closePanels(keep) {
panels.forEach(function (p) {
if (keep && p[2]) return;
var el = $(p[0]); if (el) el.hidden = true;
var b = $(p[1]); if (b) b.setAttribute('aria-expanded', 'false');
});
}
function togglePanel(panelId, btnId) {
var open = $(panelId).hidden;
closePanels();
if (open) { $(panelId).hidden = false; $(btnId).setAttribute('aria-expanded', 'true'); }
}
function ask(id) {
var d = $(id);
return new Promise(function (resolve) {
function done(v) { d.querySelectorAll('button').forEach(function (b) { b.onclick = null; }); d.onclose = null; if (d.open) d.close(); resolve(v); }
d.querySelectorAll('button').forEach(function (b) { b.onclick = function () { done(b.value); }; });
d.onclose = function () { done('cancel'); };
d.showModal();
var first = d.querySelector('button[value=cancel]'); if (first) first.focus();
});
}
var keeping = false;
function saveState(st) {
var el = $('saveState');
if (!el || !S) return;
if (keeping && st !== 'error') st = '';
el.setAttribute('data-state', st);
el.textContent = st === 'saved' ? S.T.autoSaved : st === 'error' ? S.T.saveFailed : '';
}
var tt;
function toast(msg, ms) {
var el = $('toast'); el.textContent = msg; el.classList.add('on');
clearTimeout(tt); tt = setTimeout(function () { el.classList.remove('on'); }, ms || 1800);
}
var vw = { z: 1, cover: 1 };
function view(v) {
vw = v;
var fv = $('fitView'); if (!fv || !S) return;
var expanded = document.documentElement.classList.contains('expanded'), zoomed = v.z > 1.01;
var off = expanded ? !(zoomed || v.cover > 1.04) : !zoomed;
if (fv.hidden !== off) fv.hidden = off;
var t = zoomed ? 'whole' : 'fill';
if (fv.querySelector('span').textContent !== S.T[t]) fv.querySelector('span').textContent = S.T[t];
fv.setAttribute('aria-label', S.T[t + 'Long']); fv.title = S.T[t + 'Long'];
}
function leaveTo(href) { allowUnload = true; location.href = href; }
function reopen(href) { allowUnload = true; history.replaceState(null, '', href); location.reload(); }
return { build: build, closePanels: closePanels, togglePanel: togglePanel, toast: toast, saveState: saveState, view: view, leaveTo: leaveTo, reopen: reopen };
})();
