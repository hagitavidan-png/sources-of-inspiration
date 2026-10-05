/* The Lesson Player: one screen, one idea, one action. It shows any lesson whose screens are listed in
   window.APP_LESSONS (kind of screen + where its content is in the lesson), through that lesson format's adapter.
   Kinds of screen: content, action, creation, comparison, reflection.
   What the learner does in the lesson (paper or Studio, the checklist, the reflection) is kept on this device:
   localStorage "app-proto:lesson:<id>", so it is still there after a visit to the Studio.
   With the Studio the work has two versions, each the Studio's own save (L.studio[0], L.studio[1]): version 1 is made
   on screen 10; version 2 (one law changed) on screen 11 starts as a copy of version 1 and is saved apart from it.
   On screen 11 the learner first chooses the one thing to change (size, direction or spacing: state "change"); the
   Studio opens version 2 with only that one thing to change. Once version 2 is saved, the choice is kept as it is. */
window.Player = (function () {
  'use strict';
  var I = window.I18N;
  var IMG = '../../images/editorial/';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function keyOf(id) { return 'app-proto:lesson:' + id; }
  function load(id) { try { return JSON.parse(localStorage.getItem(keyOf(id))) || {}; } catch (e) { return {}; } }
  function save(id, st) { try { localStorage.setItem(keyOf(id), JSON.stringify(st)); } catch (e) {} }

  /* ── the parts of the lesson's content (texts come from the lesson; they may hold <b> and <br>) ── */
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
  /* a row of the lesson: "do" leads the screen; why, materials and check are quieter, each with its label */
  function row(r) {
    if (r.k === 'do') return '<div class="pl-do">' + parts(r.parts) + '</div>';
    return '<section class="pl-row pl-row-' + esc(r.k) + '"><h4>' + esc(I.ui(r.k)) + '</h4>' + parts(r.parts) + '</section>';
  }
  function proto(text) {
    return '<aside class="pl-proto" role="note"><b>' + esc(I.ui('proto')) + '</b><span>' + esc(text) + '</span></aside>';
  }
  /* an image the screen needs: the approved image, or a placeholder in the same place */
  function media(m, L) {
    if (!m) return '';
    var img = L.assets && L.assets[m.asset];
    if (img) return '<figure class="pl-media"><img src="' + IMG + esc(img) + '.jpg" alt=""></figure>';
    return '<figure class="pl-media pl-placeholder" data-asset="' + esc(m.asset) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M4 18l5-5 3 3 3-3 5 5"/></svg>' +
      '<figcaption>' + esc(I.ui('protoImage')) + '</figcaption></figure>';
  }
  /* an artwork of the lesson: its image, or, with no right to show it, the lesson's link to the museum */
  function work(w, small) {
    var cap = '<figcaption><b>' + esc(I.tx(w.artist)) + '</b> · ' + esc(I.tx(w.workTitle)) + '</figcaption>';
    if (w.img) return '<figure class="pl-work' + (small ? ' small' : '') + '"><img src="' + IMG + esc(w.img) + '.jpg" alt="' + esc(w.alt || '') + '">' + cap + '</figure>';
    return '<figure class="pl-work pl-linkcard' + (small ? ' small' : '') + '"><div class="pl-linkcard-box">' +
      (w.link ? '<a href="' + esc(w.link.href) + '" target="_blank" rel="noopener">' + esc(I.tx(w.link.label)) + '</a>' : '') + '</div>' + cap + '</figure>';
  }
  function works(b, small) {
    return (b.works || []).map(function (w) {
      return work(w, small) + (small ? '' : (w.note ? '<p class="pl-note">' + esc(I.tx(w.note)) + '</p>' : '') +
        (w.link && w.img ? '<p class="pl-ext"><a href="' + esc(w.link.href) + '" target="_blank" rel="noopener">' + esc(I.tx(w.link.label)) + '</a></p>' : ''));
    }).join('');
  }

  /* a work saved by the Studio (its preview and operations), or null */
  function studioSave(key) { try { var d = JSON.parse(localStorage.getItem(key)); return d && d.ops && d.ops.length ? d : null; } catch (e) { return null; } }
  /* version 2 opens on the work of version 1: until the learner saves version 2, it is (again) a copy of version 1 */
  function openVersion2(id, L, nav, change) {
    var st = load(id), raw = null, cur = studioSave(L.studio[1].key);
    try { raw = localStorage.getItem(L.studio[0].key); } catch (e) {}
    if (raw && (!cur || cur.savedAt === st.v2seed)) {
      try { localStorage.setItem(L.studio[1].key, raw); st.v2seed = JSON.parse(raw).savedAt; save(id, st); } catch (e) {}
    }
    nav.studio(L.studio[1].href[change]);
  }
  var CHANGES = ['size', 'direction', 'spacing'];
  function figure(img, label) {
    return '<figure class="pl-version"><img src="' + img + '" alt="">' + (label ? '<figcaption>' + esc(label) + '</figcaption>' : '') + '</figure>';
  }

  /* ── one screen ── */
  function render(root, id, n, nav) {
    var L = window.APP_LESSONS[id], A = window.AppAdapters[L.adapter](window.LESSON_PAGE), count = L.screens.length;
    var s = L.screens[n - 1], st = load(id), medium = st.medium || null;
    var blocks = (s.src || []).map(A.block);
    var title = '', body = '', action = { label: I.ui('continue'), go: function () { nav.go(n + 1); } }, extra = '';
    blocks.forEach(function (b) { if (!title) title = A.title(b); });
    var allRows = [], closing = '';
    blocks.forEach(function (b) {
      if (b.kind === 'close') closing = '<div class="pl-close">' + core(b) + '</div>';
      else A.rows(b).forEach(function (r) { allRows.push(r); });
    });
    var v1 = studioSave(L.studio[0].key), v2 = studioSave(L.studio[1].key);
    if (v2 && st.v2seed && v2.savedAt === st.v2seed) v2 = null;   // still the copy of version 1: not saved as version 2 yet
    var studioWork = v1;

    if (s.type === 'creation' && s.step === 'choose') {
      title = I.ui('how');
      body = '<div class="pl-choices">' +
        '<button type="button" class="pl-choice" data-medium="paper" aria-pressed="' + (medium === 'paper') + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9 13l6-6"/></svg><span>' + esc(I.ui('paper')) + '</span></button>' +
        '<button type="button" class="pl-choice" data-medium="studio" aria-pressed="' + (medium === 'studio') + '"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8"/><path d="M8 13l3-3 2 2 3-3"/></svg><span>' + esc(I.ui('studio')) + '</span></button></div>';
      action = null;
    } else {
      var media0 = s.media ? media(s.media, L) : '';
      var art = blocks.filter(function (b) { return b.works; }).map(function (b) { return works(b, false); }).join('');
      if (s.compare) art = '<div class="pl-pair">' + s.compare.map(function (r) { return works(A.block(r), true); }).join('') + '</div>';
      var doRows = allRows.filter(function (r) { return r.k === 'do'; }).map(row).join('');
      var otherRows = allRows.filter(function (r) { return r.k !== 'do' && r.k !== 'checklist'; }).map(row).join('');
      var studioPart = '';
      if (medium === 'studio' && s.step === 'make') studioPart = (studioWork ? '<figure class="pl-studio-work"><img src="' + studioWork.preview + '" alt=""></figure>' : '') + proto(I.ui(s.studioGap));
      /* screen 11: change one thing only. The choice of the thing, then the Studio; once version 2 is saved, the
         choice stays (version 2 is never reset by changing it) */
      if (medium === 'studio' && s.step === 'change') {
        var locked = !!v2;
        studioPart = (v2 ? '<figure class="pl-studio-work"><img src="' + v2.preview + '" alt=""></figure>' : '') +
          '<section class="pl-changes" role="group" aria-label="' + esc(I.ui('changeOne')) + '"><h3>' + esc(I.ui('changeOne')) + '</h3><div>' +
          CHANGES.map(function (c) {
            return '<button type="button" class="pl-change" data-change="' + c + '" aria-pressed="' + (st.change === c) + '"' + (locked ? ' disabled' : '') + '>' + esc(I.ui(c)) + '</button>';
          }).join('') + '</div></section>';
      }
      /* comparison: version 1 | version 2, from the Studio's own saves; never the same version twice */
      if (medium === 'studio' && s.step === 'check' && v1) studioPart = '<div class="pl-pair pl-versions">' + figure(v1.preview, I.ui('v1')) +
        (v2 ? figure(v2.preview, I.ui('v2') + (st.change ? ' · ' + I.ui(st.change) : '')) : '<figure class="pl-version pl-version-missing"><div><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 9v6M9 12h6"/></svg><span>' + esc(I.ui('v2missing')) + '</span></div><figcaption>' + esc(I.ui('v2')) + '</figcaption></figure>') + '</div>';
      var check = '';
      allRows.filter(function (r) { return r.k === 'checklist'; }).forEach(function (r) {
        var items = [];
        r.parts.forEach(function (p) { if (p.list) items = items.concat(p.list[I.lang()] || []); });
        var on = st.checks || {};
        check += '<section class="pl-row pl-checklist"><h4>' + esc(I.ui('checklist')) + '</h4><div class="pl-checks">' + items.map(function (v, k) {
          return '<button type="button" class="pl-check" data-check="' + k + '" aria-pressed="' + !!on[k] + '"><i aria-hidden="true"></i><span>' + v + '</span></button>';
        }).join('') + '</div></section>';
      });
      var reflect = '';
      if (s.type === 'reflection') {
        blocks.forEach(function (b) { (b.guide || []).forEach(function (r) { r.parts.forEach(function (p) {
          if (p.block && p.block.prompt) reflect = '<textarea class="pl-reflect" rows="4" placeholder="' + esc(I.tx(p.block.prompt)) + '">' + esc(st.reflection || '') + '</textarea>';
        }); }); });
        action = { label: I.ui('done'), go: function () { var x = load(id); x.done = true; save(id, x); nav.finish(); } };
      }
      if (s.type === 'creation' && medium === 'paper') action = { label: I.ui('done'), go: function () { nav.go(n + 1); } };
      if (s.type === 'creation' && s.step === 'make' && medium === 'studio') {
        if (studioWork) extra = '<button type="button" class="pl-secondary" data-studio="0">' + esc(I.ui('studio')) + '</button>';
        else action = { label: I.ui('studio'), go: function () { nav.studio(L.studio[0].href); } };
      }
      /* screen 11: open the work again in the Studio, as version 2 */
      if (s.type === 'creation' && s.step === 'change' && medium === 'studio') {
        if (v2) extra = '<button type="button" class="pl-secondary" data-studio="1">' + esc(I.ui('reopen')) + '</button>';
        else action = { label: I.ui('openStudio'), off: !st.change, go: function () { if (st.change) openVersion2(id, L, nav, st.change); } };
      }
      body = media0 + art + (s.gap ? proto(I.ui(s.gap)) : '') + doRows + studioPart + reflect + otherRows + check + closing;
    }

    root.innerHTML =
      '<header class="pl-top">' +
        '<button type="button" class="pl-back" aria-label="' + esc(I.ui('back')) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>' +
        '<div class="pl-id"><span>' + esc(I.ui('lesson')) + ' ' + esc(A.lesson.number) + '</span> · ' + esc(I.tx(A.lesson.title)) + '</div>' +
        '<span class="pl-count" aria-label="' + n + '/' + count + '">' + n + '/' + count + '</span>' +
        '<div class="pl-progress" aria-hidden="true"><i style="width:' + (n / count * 100).toFixed(2) + '%"></i></div>' +
      '</header>' +
      '<main class="pl-main pl-' + s.type + '" data-screen="' + n + '" tabindex="-1"><div class="pl-inner">' +
        (title ? '<h2 class="pl-title">' + esc(title) + '</h2>' : '') + body + '</div></main>' +
      '<footer class="pl-foot">' + extra + (action ? '<button type="button" class="pl-primary"' + (action.off ? ' disabled' : '') + '>' + esc(action.label) + '</button>' : '') + '</footer>';
    root.className = 'app player';

    root.querySelector('.pl-back').addEventListener('click', function () { if (n > 1) nav.go(n - 1); else nav.exit(); });
    if (action) root.querySelector('.pl-primary').addEventListener('click', action.go);
    var sb = root.querySelector('[data-studio]');
    if (sb) sb.addEventListener('click', function () { if (sb.getAttribute('data-studio') === '1') openVersion2(id, L, nav, load(id).change); else nav.studio(L.studio[0].href); });
    root.querySelectorAll('.pl-change').forEach(function (b) {
      b.addEventListener('click', function () { var x = load(id); x.change = b.getAttribute('data-change'); save(id, x); nav.go(n); });
    });
    root.querySelectorAll('.pl-choice').forEach(function (b) {
      b.addEventListener('click', function () { var x = load(id); x.medium = b.getAttribute('data-medium'); save(id, x); nav.go(n + 1); });
    });
    root.querySelectorAll('.pl-check').forEach(function (b) {
      b.addEventListener('click', function () {
        var x = load(id); x.checks = x.checks || {}; var k = b.getAttribute('data-check');
        x.checks[k] = !x.checks[k]; save(id, x); b.setAttribute('aria-pressed', String(!!x.checks[k]));
      });
    });
    var ta = root.querySelector('.pl-reflect');
    if (ta) ta.addEventListener('input', function () { var x = load(id); x.reflection = ta.value; save(id, x); });
    var x = load(id); x.screen = n; save(id, x);
    root.querySelector('.pl-main').focus({ preventScroll: true });
  }
  return { render: render, state: load };
})();
