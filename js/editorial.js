/*! Sources of Inspiration in Art | מקורות השראה באמנות. Original code and content (c) 2026 Hagit Avidan | חגית אבידן. All rights reserved | כל הזכויות שמורות. Works and materials by others belong to their owners | יצירות וחומרים של אחרים שייכים לבעליהם. See NOTICE.txt */
(function () {
var top = document.getElementById('top');
if (top) {
var onScroll = function () { top.classList.toggle('scrolled', window.scrollY > 8); };
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
}
var els = document.querySelectorAll('.rv,.rv-img');
if (!('IntersectionObserver' in window)) {
els.forEach(function (e) { e.classList.add('in'); });
return;
}
var io = new IntersectionObserver(function (entries) {
entries.forEach(function (e) {
if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
});
}, { rootMargin: '0px 0px -10% 0px' });
els.forEach(function (e) { io.observe(e); });
})();
