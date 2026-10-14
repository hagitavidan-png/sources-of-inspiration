/*! Sources of Inspiration in Art | מקורות השראה באמנות. Original code and content (c) 2026 Hagit Avidan | חגית אבידן. All rights reserved | כל הזכויות שמורות. Works and materials by others belong to their owners | יצירות וחומרים של אחרים שייכים לבעליהם. See NOTICE.txt */
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
dlg.addEventListener('click', function (e) {
if (e.target !== dlg) return;
var r = dlg.getBoundingClientRect();
if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dlg.close();
});
dlg.addEventListener('close', function () {
if (ours) { ours = false; history.back(); }
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
history.pushState({ viewer: true }, ''); ours = true;
}
return { open: open };
})();
