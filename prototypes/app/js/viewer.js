/* One viewer for a picture, large: an earlier artwork in My artworks; a work or an image of a lesson (2.1 screens 6
   and 7). The whole picture at its own proportions (ratio, if known before it loads), its caption under it if it has
   one, and "Close". Escape, a tap outside it and the phone's Back close it too; then the focus goes back to what opened
   it, and the page is where it was. Only to look at: it changes nothing.
   Viewer.open({ src, alt, ratio?, caption? (HTML), from (the element that opened it) }) */
window.Viewer = (function () {
  'use strict';
  var I = window.I18N, dlg = null, opener = null, ours = false;

  function make() {
    if (dlg) return dlg;
    dlg = document.createElement('dialog');
    dlg.className = 'ga-view';
    dlg.innerHTML = '<img alt=""><div class="ga-view-cap"></div><button type="button" class="ga-close"></button>';
    document.body.appendChild(dlg);
    dlg.querySelector('.ga-close').addEventListener('click', function () { dlg.close(); });
    /* a tap on the backdrop (outside the dialog's box) */
    dlg.addEventListener('click', function (e) {
      if (e.target !== dlg) return;
      var r = dlg.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dlg.close();
    });
    dlg.addEventListener('close', function () {
      if (ours) { ours = false; history.back(); }   // the history step the viewer added (for the phone's Back)
      if (opener && opener.isConnected) opener.focus({ preventScroll: true });
      opener = null;
    });
    window.addEventListener('popstate', function () { if (dlg.open) { ours = false; dlg.close(); } });
    return dlg;
  }

  function open(o) {
    var d = make(), img = d.querySelector('img'), cap = d.querySelector('.ga-view-cap');
    img.src = o.src; img.alt = o.alt || '';
    if (o.ratio) img.style.setProperty('--r', o.ratio); else img.style.removeProperty('--r');
    cap.innerHTML = o.caption || ''; cap.hidden = !o.caption;
    d.classList.toggle('has-cap', !!o.caption);
    d.setAttribute('aria-label', o.alt || '');
    d.querySelector('.ga-close').textContent = I.ui('close');
    opener = o.from || document.activeElement;
    d.showModal(); d.querySelector('.ga-close').focus();
    history.pushState({ viewer: true }, ''); ours = true;   // the same address: Back closes the picture, not the page
  }

  return { open: open };
})();
