/* =============================================
   7 DIAMONDS – SHARED LESSON SCRIPT
   ============================================= */
document.addEventListener('DOMContentLoaded', function () {

  /* ── Unit color from body data attribute ── */
  var body = document.body;
  var unitColor = body.getAttribute('data-unit-color') || '#8b5e52';
  document.documentElement.style.setProperty('--u-color', unitColor);

  /* ── Language ── */
  var html = document.documentElement;
  var langBtn = document.getElementById('lang-toggle');
  var currentLang = localStorage.getItem('7d-lang') || 'he';

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem('7d-lang', lang);
    if (lang === 'en') {
      html.setAttribute('lang', 'en'); html.setAttribute('dir', 'ltr');
      body.classList.add('lang-en'); body.classList.remove('lang-he');
      if (langBtn) langBtn.textContent = 'עב';
    } else {
      html.setAttribute('lang', 'he'); html.setAttribute('dir', 'rtl');
      body.classList.remove('lang-en'); body.classList.add('lang-he');
      if (langBtn) langBtn.textContent = 'EN';
    }
    document.querySelectorAll('[data-he],[data-en]').forEach(function (el) {
      var v = el.getAttribute('data-' + lang);
      if (v !== null && el.children.length === 0) el.textContent = v;
    });
  }
  applyLang(currentLang);
  if (langBtn) langBtn.addEventListener('click', function () { applyLang(currentLang === 'he' ? 'en' : 'he'); });

  /* ── Hamburger ── */
  var hbg = document.getElementById('hamburger');
  var mMenu = document.getElementById('mobile-menu');
  if (hbg) {
    hbg.addEventListener('click', function () {
      var o = mMenu ? mMenu.classList.toggle('open') : false;
      hbg.classList.toggle('open', o);
      hbg.setAttribute('aria-expanded', String(o));
    });
  }

  /* ── Header scroll + progress ── */
  var header = document.getElementById('site-header');
  var fill   = document.getElementById('progress-fill');
  var scrollTop = document.getElementById('scroll-top');

  window.addEventListener('scroll', function () {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
    if (scrollTop) scrollTop.classList.toggle('show', window.scrollY > 300);
    if (fill) {
      var h = document.documentElement;
      var pct = (window.scrollY / (h.scrollHeight - h.clientHeight)) * 100;
      fill.style.width = Math.min(100, pct) + '%';
    }
  }, { passive: true });

  /* ── Fade-in ── */
  var fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.06 });
    fadeEls.forEach(function (el) { io.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── Quotes Carousel (if present) ── */
  var track    = document.getElementById('quotesTrack');
  var dotsWrap = document.getElementById('carouselDots');
  if (track && dotsWrap) {
    var slides  = track.querySelectorAll('.quote-slide');
    var current = 0;
    if (slides.length > 1) {
      slides.forEach(function (_, i) {
        var d = document.createElement('button');
        d.className = 'dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'ציטוט ' + (i + 1));
        d.onclick = function () { goTo(i); };
        dotsWrap.appendChild(d);
      });
      function goTo(n) {
        current = n;
        var dir = document.documentElement.getAttribute('dir') === 'rtl' ? '' : '-';
        track.style.transform = 'translateX(' + dir + n * 100 + '%)';
        dotsWrap.querySelectorAll('.dot').forEach(function (d, i) { d.classList.toggle('active', i === n); });
      }
      setInterval(function () { goTo((current + 1) % slides.length); }, 4500);
    }
  }

});
