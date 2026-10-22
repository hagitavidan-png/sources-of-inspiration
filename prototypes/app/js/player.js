/*! Sources of Inspiration in Art | מקורות השראה באמנות. Original code and content (c) 2026 Hagit Avidan | חגית אבידן. All rights reserved | כל הזכויות שמורות. Works and materials by others belong to their owners | יצירות וחומרים של אחרים שייכים לבעליהם. See NOTICE.txt */
window.Player = (function () {
'use strict';
var I = window.I18N;
var IMG = '../../images/editorial/';
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
var W = window.Artworks;
function pin(lesson, runId) { try { sessionStorage.setItem('run:' + lesson, runId); } catch (e) {} }
function pinned(id) { try { return sessionStorage.getItem('run:' + id); } catch (e) { return null; } }
function runOf(id) {
var p = pinned(id);
return (p ? W.runs(id).then(function (l) { return l.filter(function (r) { return r.id === p; })[0] || null; }) : Promise.resolve(null))
.then(function (r) { return r || W.currentRun(id); })
.then(function (r) { return r || { id: W.newId(), lesson: id, artwork: null }; })
.then(function (r) {
var L = window.APP_LESSONS[id];
if (L && L.layout && r.layout !== L.layout) {
var map = L.screenMaps ? L.screenMaps[r.layout === undefined ? 'old' : r.layout] : (r.layout === undefined ? L.screenMap : null);
if (r.screen && map) r.screen = map[r.screen] || r.screen;
r.layout = L.layout;
}
return r;
});
}
function core(b) {
return (b.big ? '<h3 class="pl-big">' + I.tx(b.big) + '</h3>' : '') +
(b.sub ? '<p class="pl-sub">' + I.tx(b.sub) + '</p>' : '') +
(b.body ? '<p>' + I.tx(b.body) + '</p>' : '') +
(b.lines ? '<ul class="pl-lines">' + (b.lines[I.lang()] || []).map(function (v) { return '<li>' + v + '</li>'; }).join('') + '</ul>' : '') +
(b.list ? '<ol class="pl-steps">' + (b.list[I.lang()] || []).map(function (v) { return '<li>' + v + '</li>'; }).join('') + '</ol>' : '') +
(b.ask ? '<p class="pl-ask">' + I.tx(b.ask) + '</p>' : '');
}
function parts(list) {
return list.map(function (p) {
if (p.block) return core(p.block);
if (p.list) return '<ul class="pl-lines">' + (p.list[I.lang()] || []).map(function (v) { return '<li>' + v + '</li>'; }).join('') + '</ul>';
if (p.text) return '<p>' + I.tx(p.text) + '</p>';
return '';
}).join('');
}
var UNLABELLED = ['why', 'check'];
function row(r) {
if (r.k === 'do') return '<div class="pl-do">' + parts(r.parts) + '</div>';
return '<section class="pl-row pl-row-' + esc(r.k) + '">' + (UNLABELLED.indexOf(r.k) < 0 ? '<h4>' + esc(I.ui(r.k)) + '</h4>' : '') + parts(r.parts) + '</section>';
}
function proto(text) {
return '<aside class="pl-proto" role="note"><b>' + esc(I.ui('proto')) + '</b><span>' + esc(text) + '</span></aside>';
}
var NOTE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>';
function media(m, L) {
if (!m) return '';
if (m.audio) {
var file = L.audio && L.audio[m.audio];
if (file) return '<figure class="pl-audio"><audio controls preload="none" src="' + esc(file) + '"></audio></figure>';
return '<figure class="pl-audio pl-placeholder" data-audio="' + esc(m.audio) + '">' + NOTE + '<figcaption>' + esc(I.ui('protoAudio')) + '</figcaption></figure>';
}
var img = L.assets && L.assets[m.asset];
if (img) return '<figure class="pl-media"><img src="' + IMG + esc(img) + '.jpg" alt=""></figure>';
return '<figure class="pl-media pl-placeholder" data-asset="' + esc(m.asset) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M4 18l5-5 3 3 3-3 5 5"/></svg>' +
'<figcaption>' + esc(I.ui('protoImage')) + '</figcaption></figure>';
}
function work(w, small) {
var cap = '<figcaption><b>' + esc(I.tx(w.artist)) + '</b> · ' + esc(I.tx(w.workTitle)) + '</figcaption>';
var alt = w.alt && typeof w.alt === 'object' ? I.tx(w.alt) : w.alt;
if (w.img) return '<figure class="pl-work' + (small ? ' small' : '') + '"><img src="' + IMG + esc(w.img) + '.jpg" alt="' + esc(alt || '') + '">' + cap + '</figure>';
if (!w.link) return '<figure class="pl-work pl-linkcard' + (small ? ' small' : '') + '"><div class="pl-linkcard-box pl-placeholder">' +
'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M4 18l5-5 3 3 3-3 5 5"/></svg>' +
'<span>' + esc(I.ui('protoImage')) + '</span></div>' + cap + '</figure>';
return '<figure class="pl-work pl-linkcard' + (small ? ' small' : '') + '"><div class="pl-linkcard-box">' +
(w.link ? '<a href="' + esc(w.link.href) + '" target="_blank" rel="noopener">' + esc(I.tx(w.link.label)) + '</a>' : '') + '</div>' + cap + '</figure>';
}
function works(b, small) {
return (b.works || []).map(function (w) {
return work(w, small) + (small ? '' : (w.note ? '<p class="pl-note">' + esc(I.tx(w.note)) + '</p>' : '') +
(w.link && w.img ? '<p class="pl-ext"><a href="' + esc(w.link.href) + '" target="_blank" rel="noopener">' + esc(I.tx(w.link.label)) + '</a></p>' : ''));
}).join('');
}
var PIC = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M4 18l5-5 3 3 3-3 5 5"/></svg>';
var PREV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>', NEXT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
function src(img) { var ext = /\.(png|jpe?g|webp)$/i.test(img) ? '' : '.jpg';
return img.indexOf('/') >= 0 ? esc(img) + ext : IMG + esc(img) + ext; }
function seenOf(run, L, g) { var n = L.galleries[g].length, i = (run.seen && run.seen[g]) | 0; return ((i % n) + n) % n; }
function picked(run, L, g) { var i = run.seen && run.seen[g], it = i == null ? null : L.galleries[g][i]; return it && it.img ? it : null; }
var EXT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v6H4V6h6"/></svg>';
function outLink(href, inner) { return '<a href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' + inner + '<span class="pl-sr"> ' + esc(I.ui('newTab')) + '</span></a>'; }
var SHORT = 28;
function shortTitle(t) {
var m = /^(.*), (\d{4})$/.exec(t), name = m ? m[1] : t, year = m ? ', ' + m[2] : '';
if (name.length <= SHORT) return t;
var cut = name.slice(0, SHORT), sp = cut.lastIndexOf(' ');
return (sp > 10 ? cut.slice(0, sp) : cut).replace(/[,;:]$/, '') + '…' + year;
}
function caption(it, short) { return '<figcaption>' + captionText(it, short) + '</figcaption>'; }
function captionText(it, short) {
var c = it.credit, t = it.workTitle ? I.tx(it.workTitle) : '', v = short ? shortTitle(t) : t;
return (it.artist ? '<b class="pl-cap-artist">' + esc(I.tx(it.artist)) + '</b>' +
(v === t ? '<span class="pl-cap-work"><bdi>' + esc(t) + '</bdi></span>'
: '<span class="pl-cap-work" title="' + esc(t) + '"><bdi aria-hidden="true">' + esc(v) + '</bdi><span class="pl-sr">' + esc(t) + '</span></span>') : '') +
(c ? '<small class="pl-credit">' + outLink(c.href, esc(I.ui('photoBy', { who: '' })) + '<bdi>' + esc(c.who) + (c.licence ? ' · <span class="pl-licence">' + esc(c.licence) + '</span>' : '') + '</bdi>') + '</small>' : '');
}
function ratio(it) { return it.size ? (it.size[0] / it.size[1]).toFixed(4) : '1.3333'; }
function imgTag(it, alt) {
return '<img src="' + src(it.img) + '" alt="' + esc(alt) + '" style="--r:' + ratio(it) + '"' + (it.size ? ' width="' + it.size[0] + '" height="' + it.size[1] + '"' : '') + '>';
}
function picture(it, cls) {
return it.img ? '<div class="' + cls + '">' + imgTag(it, I.tx(it.alt)) + '</div>'
: '<div class="' + cls + ' pl-placeholder" role="img" aria-label="' + esc(I.ui('protoImage') + (it.artist ? ' ' + I.tx(it.artist) + ', ' + I.tx(it.workTitle) : '')) + '">' + PIC + '<span aria-hidden="true">' + esc(I.ui('protoImage')) + '</span></div>';
}
function counterOf(i, n) { return '<span aria-hidden="true">' + (i + 1) + '/' + n + '</span><span class="pl-sr">' + esc(I.ui('galleryCount', { n: i + 1, total: n })) + '</span>'; }
function galPicture(it) { return it.img ? '<div class="pl-gal-frame">' + zoomable(it, 'pl-gal-zoom', true) + '</div>' : picture(it, 'pl-gal-frame'); }
function gallery(L, run, g) {
var items = L.galleries[g], i = seenOf(run, L, g);
return '<section class="pl-gallery" data-gallery="' + esc(g) + '" aria-label="' + esc(I.ui('images')) + '">' +
'<figure class="pl-gal-fig">' + galPicture(items[i]) + caption(items[i]) + '</figure>' +
'<div class="pl-gal-nav"><button type="button" class="pl-gal-btn" data-step="-1" aria-label="' + esc(I.ui('galleryPrev')) + '">' + PREV + '</button>' +
'<span class="pl-gal-count" aria-live="polite">' + counterOf(i, items.length) + '</span>' +
'<button type="button" class="pl-gal-btn" data-step="1" aria-label="' + esc(I.ui('galleryNext')) + '">' + NEXT + '</button></div></section>';
}
function focusOn(L, run, g, line) {
var it = picked(run, L, g);
return it ? '<figure class="pl-gal-fig pl-focus">' + galPicture(it) + caption(it) + '</figure>' : pickLine(line) + pickFrom(L, g, false);
}
function pickLine(line) { return line ? '<p class="pl-text pl-q pl-pick-line">' + esc(I.tx(line)) + '</p>' : ''; }
function pickFrom(L, g, named) {
var items = L.galleries[g], who = named && items[0].artist ? I.tx(items[0].artist) : '';
return '<section class="pl-pick" data-pick-gallery="' + esc(g) + '" role="group" aria-label="' + esc(who || I.ui('images')) + '">' +
(who ? '<b class="pl-pick-who" aria-hidden="true">' + esc(who) + '</b>' : '') + '<ul class="pl-thumbs">' + items.map(function (it, i) {
return it.img ? '<li><button type="button" class="pl-thumb pl-pick-btn" data-pick="' + i + '" style="--r:' + ratio(it) + '" aria-label="' + esc(I.ui('pick', { what: I.tx(it.alt) })) + '">' + imgTag(it, '') + '</button></li>' : '';
}).join('') + '</ul></section>';
}
var zooms = [], ZOOM = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4h5v5"/><path d="M20 4l-6 6"/><path d="M9 20H4v-5"/><path d="M4 20l6-6"/></svg>';
function zoomable(it, cls, badge) {
if (!it.img) return picture(it, cls);
return '<button type="button" class="pl-zoom ' + cls + '" style="--r:' + ratio(it) + '" data-zoom="' + (zooms.push(it) - 1) + '" aria-label="' + esc(I.ui('enlarge', { what: I.tx(it.alt) })) + '">' +
imgTag(it, '') + (badge ? '<span class="pl-zoom-badge">' + ZOOM + '</span>' : '') + '</button>';
}
function pair(L, run, gs, line) {
var missing = gs.filter(function (g) { return !picked(run, L, g); });
if (missing.length) return pickLine(line) + missing.map(function (g) { return pickFrom(L, g, true); }).join('');
return '<div class="pl-duo">' + gs.map(function (g) { var it = picked(run, L, g); return '<figure class="pl-duo-fig">' + zoomable(it, 'pl-duo-img', true) + caption(it, true) + '</figure>'; }).join('') + '</div>';
}
function thumbs(L, run, t) {
var list = [];
(t.all || []).forEach(function (g) { list = list.concat(L.galleries[g]); });
(t.seen || []).forEach(function (g) { var it = picked(run, L, g); if (it) list.push(it); });
return '<ul class="pl-thumbs">' + list.map(function (it) {
return '<li>' + (it.img ? zoomable(it, 'pl-thumb') : '<span class="pl-thumb pl-placeholder" aria-hidden="true">' + PIC + '</span>') + '</li>';
}).join('') + '</ul>';
}
function more(m) {
var list = Array.isArray(m) ? m : m.links || [], h = m.title ? I.tx(m.title) : I.ui('exploreMore');
return '<section class="pl-more" aria-label="' + esc(h) + '"><h3>' + esc(h) + '</h3>' +
(m.intro ? '<p class="pl-more-intro">' + I.tx(m.intro) + '</p>' : '') +
(list.length ? '<ul>' + list.map(function (x) {
return '<li>' + outLink(x.href, '<span class="pl-more-text"><b>' + esc(I.tx(x.name)) + '</b><span class="pl-more-site">' + esc(I.tx(x.site)) + '</span></span>' + EXT) + '</li>';
}).join('') + '</ul>' : '<p class="pl-more-none pl-placeholder">' + esc(I.ui('protoLinks')) + '</p>') + '</section>';
}
function source(c) {
return '<details class="pl-source"><summary>' + esc(I.ui('sourceRights')) + '</summary><p>' + (c.note ? esc(I.tx(c.note)) + '. ' : '') +
outLink(c.href, '<bdi>' + esc(c.who) + '</bdi>') + ' · ' + esc(I.tx(c.licence)) + '</p></details>';
}
var INSP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="13" height="11" rx="1.5"/><path d="M8 19h12a1 1 0 001-1V9"/><path d="M5 14l3-3 2.5 2.5L13 11l3 3"/></svg>';
function inspireBtn(b) { return '<p class="pl-inspire-row"><button type="button" class="pl-inspire"' + (b.section ? ' data-section="' + esc(b.section) + '"' : '') + '>' + INSP + '<span>' + esc(I.tx(b.label)) + '</span></button></p>'; }
function inspire(id, section, from) { if (window.Inspiration) window.Inspiration.open({ lesson: id, lang: I.lang(), base: '', section: section || null, from: from }); }
function boardItems(L, g) { return (L.boards && L.boards[g]) || L.galleries[g]; }
function boardViews(items) {
var out = [];
items.forEach(function (it) {
if (it.set) it.set.forEach(function (s) { out.push({ it: Object.assign({ artist: it.artist, note: it.note }, s) }); });
else out.push({ it: it });
});
return out;
}
var WIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>';
function viewCaption(it) {
return (it.artist ? captionText(it) : it.label ? '<p class="pl-view-label">' + esc(I.tx(it.label)) + '</p>' : '') + (it.note ? '<div class="pl-view-note">' + (it.note[I.lang()] || []).map(function (v) { return '<p>' + v + '</p>'; }).join('') + '</div>' : '');
}
function board(L, g) {
var k = 0;
function under(it, inner) { return L.boardCaptions && it.artist && it.img ? '<figure class="pl-tile-fig">' + inner + caption(it, true) + '</figure>' : inner; }
function cell(it) {
var n = k++;
if (it.win) return '<button type="button" class="pl-win" data-view="' + n + '" aria-label="' + esc(I.ui('artworkWindow') + ': ' + I.tx(it.artist) + ', ' + I.tx(it.workTitle)) + '">' + WIN +
'<b>' + esc(I.tx(it.artist)) + '</b><span><bdi>' + esc(I.tx(it.workTitle)) + '</bdi></span><small>' + esc(I.ui('artworkWindow')) + '</small></button>';
if (!it.img) return '<div class="pl-board-ph pl-placeholder" role="img" aria-label="' + esc(I.ui('protoImage') + ' ' + I.tx(it.alt)) + '">' + PIC + '</div>';
return '<button type="button" class="pl-zoom pl-board-img" style="--r:' + ratio(it) + '" data-view="' + n + '" aria-label="' + esc(I.ui('enlarge', { what: I.tx(it.alt) })) + '">' + imgTag(it, '') +
(L.bareImages ? '' : '<span class="pl-zoom-badge">' + ZOOM + '</span>') + '</button>';
}
return '<section class="pl-board' + (L.boardColumns ? ' pl-board-cols' : '') + '" data-board="' + esc(g) + '" aria-label="' + esc(I.ui('images')) + '"><ul>' + boardItems(L, g).map(function (it) {
if (!it.set) return '<li class="pl-tile' + (it.win ? ' pl-tile-win' : '') + (it.wide ? ' pl-tile-wide' : '') + '"' + (it.img ? ' style="--r:' + ratio(it) + '"' : '') + '>' + under(it, cell(it)) + '</li>';
var none = !it.set.some(function (s) { return s.img; });
function labelled(s, inner) {
return s.label ? '<div class="pl-set-cell"' + (s.img ? ' style="--r:' + ratio(s) + '"' : '') + '>' + inner + '<span class="pl-set-label" aria-hidden="true">' + esc(I.tx(s.label)) + '</span></div>' : inner;
}
return '<li class="pl-tile pl-tile-set">' + (none ? '<div class="pl-set pl-set-ph" role="img" aria-label="' + esc(I.ui('protoImage') + ' ' + I.tx(it.alt) +
it.set.filter(function (s) { return s.label; }).map(function (s) { return ', ' + I.tx(s.label); }).join('')) + '">' +
it.set.map(function (s) { k++; return labelled(s, '<div class="pl-board-ph pl-placeholder">' + PIC + '</div>'); }).join('') + '</div>' +
'<p class="pl-ph-cap" aria-hidden="true">' + esc(I.tx(it.alt)) + ' · ' + esc(I.ui('protoImage')) + '</p>'
: '<div class="pl-set">' + it.set.map(function (s) { return labelled(s, cell(Object.assign({ artist: it.artist, note: it.note }, s))); }).join('') + '</div>') + '</li>';
}).join('') + '</ul></section>';
}
function boardOpen(L, g, n, from, onShow) {
var views = boardViews(boardItems(L, g)).map(function (v, i) { return { i: i, it: v.it }; }).filter(function (v) { return v.it.img || v.it.win; }), at = 0;
var list = views.map(function (v, j) {
var it = v.it; if (v.i === n) at = j;
if (it.win) return { win: '<p class="pl-win-big">' + WIN + '<b>' + esc(I.tx(it.artist)) + '</b><span><bdi>' + esc(I.tx(it.workTitle)) + '</bdi></span></p>' +
'<p class="pl-win-why">' + esc(I.ui('artworkWindowWhy')) + '</p><p>' + outLink(it.win.href, esc(I.tx(it.win.label)) + EXT) + '</p>',
alt: I.tx(it.artist) + ', ' + I.tx(it.workTitle), caption: it.note ? viewCaption({ note: it.note }) : '' };
return { src: src(it.img), alt: I.tx(it.alt), ratio: ratio(it), caption: viewCaption(it), note: !!it.note };
});
window.Viewer.open({ list: list, at: at, from: from, big: !!L.bigViewer, onShow: onShow ? function (j) { onShow(views[j].i); } : null });
}
var REFS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="13" height="11" rx="1.5"/><path d="M8 19h12a1 1 0 001-1V9"/><path d="M5 14l3-3 2.5 2.5L13 11l3 3"/></svg>';
function refsOpen(L, boards, from) {
var list = [];
boards.forEach(function (g) {
boardViews(L.boards[g]).forEach(function (v) {
var it = v.it;
if (it.img) list.push({ src: src(it.img), alt: I.tx(it.alt), ratio: ratio(it), caption: it.artist ? captionText(it) : '' });
});
});
window.Viewer.open({ list: list, grid: { title: I.ui('inspirationTitle') }, from: from });
}
function made(w) { return w && w.ops && w.ops.length ? w : null; }
function hasRepeat(w) { return !!(w && (w.ops || []).some(function (o) { return o.t === 'repeat'; })); }
function kept(w) { return ((w && w.points) || []).filter(function (p) { return p.kind === 'kept'; }); }
function figure(img, label) {
return '<figure class="pl-version"><img src="' + img + '" alt="">' + (label ? '<figcaption>' + esc(label) + '</figcaption>' : '') + '</figure>';
}
function lines(t) { return ((t && t[I.lang()]) || []).map(function (v) { return '<p class="pl-text' + (/^<span class="pl-hint">/.test(v) ? ' pl-hint' : '') + '">' + v + '</p>'; }).join(''); }
var asked = 0, revealed = {}, picking = false;
var choosing = null;
function render(root, id, n, nav) {
var my = ++asked;
runOf(id).then(function (run) {
if (nav.medium && run.medium !== nav.medium) { run.medium = nav.medium; W.putRun(run); }
if (nav.medium && history.replaceState) history.replaceState(null, '', '#/lesson/' + id + '/play/' + n);
return Promise.all([run, run.artwork ? W.get(run.artwork) : null]);
})
.then(function (r) { if (my === asked) show(root, id, n, nav, r[0], r[1]); });
}
function show(root, id, n, nav, run, art) {
zooms = [];
var L = window.APP_LESSONS[id], A = window.AppAdapters[L.adapter](window.LESSON_PAGE), count = L.screens.length;
var s = L.screens[n - 1], studio = run.medium === 'studio';
var side = (studio ? s.studio : s.paper) || {};
var ACT = function (k) { return I.tx(L.actions[k]); };
function keep() { return W.putRun(run); }
function go(k) { return keep().then(function () { nav.go(k); }); }
function openStudio(activity, back, more) {
(run.artwork ? Promise.resolve() : W.artworkFor(run.id, 'digital').then(function (w) { run.artwork = w.id; })).then(function () {
var href = 'studio/index.html#activity=' + encodeURIComponent(activity) + '&art=' + encodeURIComponent(run.artwork) +
'&back=' + encodeURIComponent('../index.html#/lesson/' + id + '/play/' + (back || n)) + (L.works ? '&at=' + n : '') + (more || '');
return keep().then(function () { nav.studio(href); });
});
}
var few = !studio || kept(art).length < 2;
var free = 0;
L.screens.forEach(function (x, i) { if (x.step === 'free' || x.step === 'studio') free = i + 1; });
if (s.step === 'choose' && few) return nav.go(n + 1);
var blocks = (s.src || []).map(A.block);
var title = '';
blocks.forEach(function (b) { if (!title) title = A.title(b); });
if (s.title && s.title[I.lang()]) title = s.title[I.lang()];
if (s.step === 'studio' && !studio && side.title) title = I.tx(side.title);
var rows = [];
var own = s.rows || {};
blocks.forEach(function (b) { if (b.kind !== 'close') A.rows(b).forEach(function (r) {
if (s.only && s.only.indexOf(r.k) < 0) return;
rows.push(own[r.k] && own[r.k][I.lang()] != null ? { k: r.k, parts: [{ text: own[r.k] }] } : r);
}); });
var askHtml = function () {
if (!s.ask) return '';
var q = '<p class="pl-text pl-q">' + I.tx(s.ask) + '</p>';
return s.askWith ? '<div class="pl-qbox">' + q + '<p class="pl-text pl-q pl-qsize" aria-hidden="true">' + I.tx(s.askWith) + '</p></div>' : q;
};
var words = function (part) {
var steps = side.steps || s.steps, st = steps && steps[I.lang()];
if (part === 'ask') return askHtml();
return (st ? '<ol class="pl-steps pl-do-steps">' + st.map(function (v) { return '<li>' + v + '</li>'; }).join('') + '</ol>' : '') +
lines(side.text || s.text) + (part === 'text' ? '' : askHtml());
};
var kd = s.kind && window.PlayerKinds && window.PlayerKinds[s.kind] ? window.PlayerKinds[s.kind]({
L: L, id: id, n: n, s: s, side: side, run: run, art: art, studio: studio, nav: nav, root: root, keep: keep, go: go, openStudio: openStudio,
again: function () { show(root, id, n, nav, run, art); }, ACT: ACT, made: made
}) : null;
var images = s.gallery || s.focus || s.pair || s.thumbs || s.board || (kd && kd.html), split = !!(L.wordsFirst && images && s.askFirst);
var first = L.wordsFirst && images ? words(split ? 'ask' : null) : '';
var moreHtml = s.more ? more(s.more) : '';
var body = first + (kd ? kd.html : '') + (s.board && !kd ? board(L, s.board) : '') + (s.gallery ? gallery(L, run, s.gallery) : '') + (s.focus ? focusOn(L, run, s.focus, s.pick) : '') +
(s.pair ? pair(L, run, s.pair, s.pick) : '') + (s.thumbs ? thumbs(L, run, s.thumbs) : '') +
(s.media ? media(s.media, L) : '') +
(s.compare ? '<div class="pl-pair">' + s.compare.map(function (r) { return works(A.block(r), true); }).join('') + '</div>'
: blocks.filter(function (b) { return b.works; }).map(function (b) { return works(b, false); }).join('')) +
(s.gap ? proto(I.ui(s.gap)) : '') +
rows.filter(function (r) { return r.k === 'do'; }).map(row).join('') +
rows.filter(function (r) { return r.k !== 'do'; }).map(row).join('') +
(split ? words('text') : first ? '' : words()) + (s.source ? source(s.source) : '') + moreHtml;
var action = { label: I.ui('continue'), go: function () { go(n + 1); } }, extra = null, later = null, again = null;
if ((s.focus && !picked(run, L, s.focus)) || (s.pair && s.pair.some(function (g) { return !picked(run, L, g); }))) action.off = true;
var work = studio && made(art), preview = work ? '<figure class="pl-studio-work"><img src="' + work.preview + '" alt=""></figure>' : '';
if (s.reveal) {
var shown = revealed[id + ':' + n];
if (shown) body += '<p class="pl-reveal">' + esc(I.tx(s.reveal)) + '</p>';
else action.go = function () { revealed[id + ':' + n] = true; show(root, id, n, nav, run, art); };
}
if (s.step === 'medium') {
var again = choosing === id + ':' + n; choosing = null;
var paperWork = !studio && run.medium === 'paper' && side.first;
if (paperWork && !again) {
title = I.tx(side.title); body = lines(side.first);
action = { label: ACT('toPattern'), go: function () { run.begun = true; go(n + 1); } };
extra = { label: ACT('toChoice'), go: function () { choosing = id + ':' + n; show(root, id, n, nav, run, art); } };
} else {
var locked = !s.switchable && !!(run.begun || made(art));
body += '<div class="pl-choices">' + ['paper', 'studio'].map(function (m) {
return '<button type="button" class="pl-choice" data-medium="' + m + '" aria-pressed="' + (run.medium === m) + '"' + (locked && run.medium !== m ? ' disabled' : '') + '>' +
(m === 'paper' ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9 13l6-6"/></svg>'
: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8"/><path d="M8 13l3-3 2 2 3-3"/></svg>') +
'<span>' + esc(I.tx(s.choices[m])) + '</span></button>';
}).join('') + '</div>';
action = run.medium ? action : null;
if (paperWork) action.go = function () { show(root, id, n, nav, run, art); };
if (studio && s.studio && made(art)) extra = { label: I.ui('reopen'), go: function () { openStudio(s.studio.activity, s.studio.back); } };
}
}
if (s.step === 'ask') {
if (studio) { body += preview; action = { label: ACT('seeWhat'), off: !work, go: function () { if (work) go(n + 1); } }; }
else action.go = function () { run.begun = true; go(n + 1); };
}
if (s.step === 'studio' && studio) {
run.screen = n;
root.innerHTML = '<main class="pl-main pl-step-studio" data-screen="' + n + '"></main>';
openStudio(side.activity, side.back);
return;
}
if (s.step === 'studio' && !studio && side.stages) {
body = '<ol class="pl-stages pl-stages-all">' + (side.stages[I.lang()] || []).map(function (v) { return '<li>' + v + '</li>'; }).join('') + '</ol>' + body;
action = { label: ACT('finishedCreating'), go: function () { run.begun = true; go(n + 1); } };
if (s.studio && s.studio.activity) extra = { label: ACT('toStudio'), button: true, go: function () {
run.medium = 'studio';
keep().then(function () { return W.artworkFor(run.id, 'digital'); })
.then(function (w) { run.artwork = w.id; openStudio(s.studio.activity, s.studio.back); });
} };
}
if (side.inspire && !(s.step === 'studio' && studio)) body += inspireBtn(side.inspire);
if (s.step === 'studio' && !studio && side.action) action.label = ACT(side.action);
if (s.step === 'studio' && !studio && side.refs) body += '<button type="button" class="pl-refs">' + REFS + '<span>' + esc(I.ui('inspiration')) + '</span></button>';
if (s.step === 'notice' && studio) { body += preview; action = { label: ACT('keepCreating'), go: function () { go(n + 1); } }; }
if (s.step === 'begin') {
var begun = function () { run.begun = true; go(n + 1); };
action = { label: I.ui('continue'), go: begun };
if (studio) {
body += preview;
if (work) extra = { label: I.ui('reopen'), go: function () { openStudio(s.studio.activity); } };
else action = { label: I.ui('openStudio'), go: function () { openStudio(s.studio.activity); } };
}
}
if (s.step === 'repeat' && studio) {
body += preview;
if (!hasRepeat(art)) action = { label: ACT('tryRepeat'), off: !work, go: function () { if (work) openStudio(side.activity, side.back); } };
}
if (s.step === 'look' && studio) {
body += preview;
action = { label: ACT('develop'), go: function () { go(n + 1); } };
extra = { label: ACT('backToDrawing'), go: function () { openStudio(side.activity, n); } };
}
if (s.step === 'change') {
var long = Object.keys(side.choices).some(function (c) { return I.tx(side.choices[c]).length > 8; });
body += '<div class="pl-changes' + (long ? ' pl-stack' : '') + '" role="group"><div>' + Object.keys(side.choices).map(function (c) {
return '<button type="button" class="pl-change" data-change="' + c + '" aria-pressed="' + (run.change === c) + '">' + esc(I.tx(side.choices[c])) + '</button>';
}).join('') + '</div></div>';
action.off = !run.change;
}
if (s.step === 'try') {
action.go = function () { go(few ? n + 2 : n + 1); };
if (studio) {
body += preview;
var openTry = function () { run.tried = true; openStudio(side.activity + run.change); };
if (run.tried) extra = { label: I.ui('reopen'), go: openTry };
else action = { label: I.ui('openStudio'), go: openTry };
}
}
if (s.step === 'choose') {
body += '<div class="pl-options">' + kept(art).map(function (p) {
return '<button type="button" class="pl-option" data-point="' + esc(p.id) + '" aria-pressed="' + (run.chosen === p.id) + '"><img src="' + p.state.preview + '" alt=""></button>';
}).join('') + '</div>';
action = { label: I.ui('continue'), off: !run.chosen, go: function () {
if (!run.chosen) return;
W.restorePoint(run.artwork, run.chosen).then(function () { go(n + 1); });
} };
}
if (s.step === 'free' && studio) {
body += preview;
var openFree = function () { run.free = true; openStudio(side.activity, n, '&control=' + encodeURIComponent(run.change || 'size')); };
if (run.free) extra = { label: ACT('keepCreating'), go: openFree };
else action = { label: ACT('keepCreating'), go: openFree };
}
if (s.step === 'free' && !studio) action.label = ACT('doneForNow');
if (s.step === 'return' && studio) {
body += preview;
action = { label: ACT('keepCreating'), go: function () { run.free = true; openStudio(side.activity, side.back); } };
}
if (s.step === 'see' || (s.step === 'end' && s.work)) body = moreHtml ? body.replace(moreHtml, preview + moreHtml) : body + preview;
if (s.step === 'end') {
action = { label: ACT('anotherTime'), go: function () { run.done = true; keep().then(nav.finish); } };
extra = { label: ACT('keepCreating'), go: function () {
if (studio) openStudio(s.studio.activity, n, '&control=' + encodeURIComponent(run.change || 'size')); else go(free);
} };
if (L.works) { later = action; action = { label: I.ui('gallery'), go: function () { run.done = true; keep().then(function () { nav.works(n); }); } }; }
if (L.retry) again = { label: I.ui('newAttempt'), go: function () { run.done = true; keep().then(function () { return W.newRun(id); }).then(function () { nav.go(L.retry); }); } };
}
if (s.step === 'repeat' && studio && hasRepeat(art)) action = { label: I.ui('continue'), go: function () { go(n + 1); } };
if (s.inspire) body += inspireBtn(s.inspire);
if (s.inspireFoot) extra = { label: I.tx(s.inspireFoot.label), go: function () { inspire(id, s.inspireFoot.section, root.querySelector('.pl-secondary')); } };
if (kd && kd.action !== undefined) action = kd.action;
if (kd && kd.extra !== undefined) extra = kd.extra;
if (kd && kd.later !== undefined) later = kd.later;
root.innerHTML =
'<header class="pl-top">' +
'<button type="button" class="pl-back" aria-label="' + esc(I.ui('back')) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>' +
'<div class="pl-id"><span>' + esc(I.ui('lesson')) + ' ' + esc(A.lesson.number) + '</span> · ' + esc(I.tx(A.lesson.title)) + '</div>' +
(L.works ? '<a class="pl-works" href="' + nav.worksHref(n) + '" aria-label="' + esc(I.ui('gallery')) + '" title="' + esc(I.ui('gallery')) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M4 18l5-5 4 4 3-3 4 4"/></svg></a>' : '') +
'<span class="pl-count" aria-label="' + n + '/' + count + '">' + n + '/' + count + '</span>' +
'<div class="pl-progress" aria-hidden="true"><i style="width:' + (n / count * 100).toFixed(2) + '%"></i></div>' +
'</header>' +
'<main class="pl-main' + (s.step ? ' pl-step-' + s.step : '') + '" data-screen="' + n + '" tabindex="-1"><div class="pl-inner">' +
(title ? '<h2 class="pl-title">' + esc(title) + '</h2>' : '') + body + '@@INLINE@@</div></main>' +
'<footer class="pl-foot' + (s.step === 'end' ? ' pl-foot-end' : '') + '">' + (extra ? '<button type="button" class="pl-secondary' + (extra.button ? ' pl-alt' : '') + '">' + esc(extra.label) + '</button>' : '') +
(later ? '<button type="button" class="pl-secondary pl-later">' + esc(later.label) + '</button>' : '') +
(again ? '<button type="button" class="pl-secondary pl-again">' + esc(again.label) + '</button>' : '') +
(action ? '<button type="button" class="pl-primary"' + (action.off ? ' disabled' : '') + '>' + esc(action.label) + '</button>' : '') + '</footer>';
var html = root.innerHTML;
if (kd && kd.inline) {
var m = html.match(/<footer class="pl-foot[^>]*>[\s\S]*<\/footer>$/);
if (m) root.innerHTML = html.replace(m[0], '').replace('@@INLINE@@', m[0].replace('class="pl-foot', 'class="pl-foot pl-foot-inline'));
} else root.innerHTML = html.replace('@@INLINE@@', '');
root.className = 'app player' + (kd && kd.inline ? ' pl-inline' : '') + (L.wide ? ' pl-wide' : '');
root.querySelector('.pl-back').addEventListener('click', function () {
if (n === 1) return nav.exit();
var prev = L.screens[n - 2];
go(prev && ((prev.step === 'choose' && few) || (prev.step === 'studio' && studio)) ? n - 2 : n - 1);
});
if (action) root.querySelector('.pl-primary').addEventListener('click', function () { if (!action.off) action.go(); });
if (extra) root.querySelector('.pl-secondary').addEventListener('click', extra.go);
if (later) root.querySelector('.pl-later').addEventListener('click', later.go);
if (again) root.querySelector('.pl-again').addEventListener('click', again.go);
root.querySelectorAll('.pl-choice').forEach(function (b) {
b.addEventListener('click', function () {
if (b.disabled) return;
run.medium = b.getAttribute('data-medium');
keep().then(function () { return W.artworkFor(run.id, run.medium === 'studio' ? 'digital' : 'paper'); })
.then(function (w) { run.artwork = w.id; return keep(); }).then(function () {
if (run.medium === 'studio' && s.studio && s.studio.activity) openStudio(s.studio.activity, s.studio.back);
else if (s.paper && s.paper.first) show(root, id, n, nav, run, art);
else nav.go(n + 1);
});
});
});
var swiped = 0;
function zoomOn(b) {
b.addEventListener('click', function () {
if (Date.now() - swiped < 500) return;
var it = zooms[+b.getAttribute('data-zoom')];
window.Viewer.open({ src: b.querySelector('img').getAttribute('src'), alt: I.tx(it.alt), ratio: ratio(it), caption: it.artist ? captionText(it) : '', from: b });
});
}
root.querySelectorAll('.pl-gallery').forEach(function (box) {
var g = box.getAttribute('data-gallery'), items = L.galleries[g], rtl = I.dir() === 'rtl';
function preload(i) { var it = items[((i % items.length) + items.length) % items.length]; if (it.img) new Image().src = src(it.img); }
function move(d) {
run.seen = run.seen || {};
var i = ((seenOf(run, L, g) + d) % items.length + items.length) % items.length;
run.seen[g] = i;
box.querySelector('.pl-gal-fig').innerHTML = galPicture(items[i]) + caption(items[i]);
box.querySelector('.pl-gal-count').innerHTML = counterOf(i, items.length);
box.querySelectorAll('.pl-zoom').forEach(zoomOn);
box.querySelectorAll('.pl-gal-fig img').forEach(function (im) { if (!im.complete) im.addEventListener('load', cue); });
preload(i + d); keep(); cue();
}
box.querySelectorAll('.pl-gal-btn').forEach(function (b) { b.addEventListener('click', function () { move(+b.getAttribute('data-step')); }); });
box.addEventListener('keydown', function (e) {
if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
e.preventDefault(); move((e.key === 'ArrowRight') !== rtl ? 1 : -1);
});
var x0 = null, fig = box.querySelector('.pl-gal-fig');
fig.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
fig.addEventListener('pointerup', function (e) {
if (x0 === null) return; var dx = e.clientX - x0; x0 = null;
if (Math.abs(dx) > 40) { swiped = Date.now(); move((dx < 0) !== rtl ? 1 : -1); }
});
preload(seenOf(run, L, g) + 1); preload(seenOf(run, L, g) - 1);
});
root.querySelectorAll('.pl-zoom:not([data-view]):not(.pl-thumb)').forEach(zoomOn);
root.querySelectorAll('.pl-thumbs').forEach(function (ul) {
var bs = [].slice.call(ul.querySelectorAll('.pl-zoom')), list = bs.map(function (b) {
var it = zooms[+b.getAttribute('data-zoom')];
return { src: src(it.img), alt: I.tx(it.alt), ratio: ratio(it), caption: it.artist ? captionText(it) : '' };
});
bs.forEach(function (b, j) { b.addEventListener('click', function () { window.Viewer.open({ list: list, at: j, from: b }); }); });
});
root.querySelectorAll('.pl-inspire').forEach(function (b) { b.addEventListener('click', function () { inspire(id, b.getAttribute('data-section'), b); }); });
root.querySelectorAll('.pl-refs').forEach(function (b) { b.addEventListener('click', function () { refsOpen(L, side.refs, b); }); });
root.querySelectorAll('.pl-board').forEach(function (box) {
var g = box.getAttribute('data-board'), mine = L.galleries && L.galleries[g] ? function (i) { run.seen = run.seen || {}; run.seen[g] = i; keep(); } : null;
box.querySelectorAll('[data-view]').forEach(function (b) {
b.addEventListener('click', function () { boardOpen(L, g, +b.getAttribute('data-view'), b, mine); });
});
});
root.querySelectorAll('.pl-pick').forEach(function (box) {
var g = box.getAttribute('data-pick-gallery');
box.querySelectorAll('[data-pick]').forEach(function (b) {
b.addEventListener('click', function () {
run.seen = run.seen || {}; run.seen[g] = +b.getAttribute('data-pick'); picking = true;
keep().then(function () { show(root, id, n, nav, run, art); });
});
});
});
var main = root.querySelector('.pl-main'), foot = root.querySelector('.pl-foot');
function sparse() { if (!main) return; var inner = main.firstElementChild; main.classList.remove('pl-sparse'); var low = inner && inner.offsetHeight < main.clientHeight * 0.5; main.classList.toggle('pl-sparse', !!low); }
function cue() { sparse(); if (foot && main) foot.classList.toggle('pl-lift', main.scrollHeight - main.scrollTop - main.clientHeight > 6); }
if (main) {
main.addEventListener('scroll', cue, { passive: true });
main.querySelectorAll('img').forEach(function (im) { if (!im.complete) im.addEventListener('load', cue); });
if (window.ResizeObserver) new ResizeObserver(cue).observe(main);
cue();
}
root.querySelectorAll('.pl-change').forEach(function (b) {
b.addEventListener('click', function () { run.change = b.getAttribute('data-change'); keep().then(function () { show(root, id, n, nav, run, art); }); });
});
root.querySelectorAll('.pl-option').forEach(function (b) {
b.addEventListener('click', function () { run.chosen = b.getAttribute('data-point'); keep().then(function () { show(root, id, n, nav, run, art); }); });
});
run.screen = n; keep();
if (kd && kd.mount) kd.mount(root);
root.querySelector('.pl-main').focus({ preventScroll: true });
if (picking) { picking = false; var f = root.querySelector('.pl-pick-btn') || root.querySelector('.pl-focus .pl-zoom, .pl-duo .pl-zoom'); if (f) f.focus(); }
}
return { render: render, run: runOf, made: made, src: src, esc: esc, pin: pin };
})();
