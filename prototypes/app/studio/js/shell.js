/* Interactive Art Studio V2: the shell around the artwork.
   Top bar, the toolbar (undo and redo, then the activity's tools), panels, the two questions
   ("Clear?" and "Unsaved changes"), the short message, and leaving without losing work.
   An artwork that saves itself (S.auto, app prototype ?art=): no "Save" and no "Unsaved changes" question; a small
   "Saved" beside the title once it is written, and leaving or hiding the page writes what is left first. */
Studio.shell = (function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var S;   // what the core hands over in build()
  var panels = [];   // [panel id, button id]

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
      if (it.panel) { b.setAttribute('aria-haspopup', 'true'); b.setAttribute('aria-expanded', 'false'); panels.push([it.panel, it.id]); }
      if (it.pressed) b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', it.onClick);
      nav.appendChild(b);
    });

    /* every text in the current language */
    document.querySelectorAll('[data-t]').forEach(function (el) { el.textContent = S.T[el.getAttribute('data-t')]; });

    document.addEventListener('pointerdown', function (e) {
      if (!e.target.closest('.panel') && !panels.some(function (p) { return e.target.closest('#' + p[1]); })) closePanels();
    });

    $('clear').addEventListener('click', function () {
      if (!S.hasDrawing()) return;
      ask('confirmClear').then(function (v) { if (v === 'clear') S.clearAll(); });
    });
    $('save').addEventListener('click', S.save);

    if (S.auto) {
      $('save').hidden = true;
      /* "Back" writes what is left, then leaves; while it cannot be written ("Could not save"), the learner stays, every
         time: the next change or "Back" tries again */
      $('back').addEventListener('click', function () {
        S.flush().then(function () { if (!S.dirty()) leave(); });
      });
      document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') S.flush(true); });
      window.addEventListener('pagehide', function () { S.flush(true); });
      return;
    }

    /* leaving: never lose work by accident */
    $('back').addEventListener('click', function () {
      if (!S.dirty()) return leave();
      ask('confirmExit').then(function (v) {
        if (v === 'exit') leave();
        else if (v === 'save') Promise.resolve(S.save()).then(function (ok) { if (ok) setTimeout(leave, 450); });   // saved first, then away
      });
    });
    window.addEventListener('beforeunload', function (e) {
      if (S.dirty() && !allowUnload) { e.preventDefault(); e.returnValue = ''; }
    });
  }

  var allowUnload = false;
  function leave() { allowUnload = true; location.href = S.back(); }

  function closePanels() {
    panels.forEach(function (p) {
      var el = $(p[0]); if (el) el.hidden = true;
      var b = $(p[1]); if (b) b.setAttribute('aria-expanded', 'false');
    });
  }
  function togglePanel(panelId, btnId) {
    var open = $(panelId).hidden;
    closePanels();
    if (open) { $(panelId).hidden = false; $(btnId).setAttribute('aria-expanded', 'true'); }
  }

  /* a question: resolves with the value of the button pressed (Esc = cancel) */
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

  /* the artwork that saves itself: "Saved" once written; nothing while a change waits or is being written; the
     failure said plainly */
  function saveState(st) {
    var el = $('saveState');
    if (!el || !S) return;
    el.setAttribute('data-state', st);
    el.textContent = st === 'saved' ? S.T.autoSaved : st === 'error' ? S.T.saveFailed : '';
  }

  var tt;
  function toast(msg) {
    var el = $('toast'); el.textContent = msg; el.classList.add('on');
    clearTimeout(tt); tt = setTimeout(function () { el.classList.remove('on'); }, 1800);
  }

  return { build: build, closePanels: closePanels, togglePanel: togglePanel, toast: toast, saveState: saveState };
})();
