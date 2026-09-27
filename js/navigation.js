/* Shared location-aware navigation for pages and lesson screens. */
(() => {
  'use strict';
  const script = document.currentScript;
  const base = new URL('../', script.src);
  const data = window.ART_NAVIGATION;
  if (!data) return;
  const path = decodeURIComponent(location.pathname.slice(base.pathname.length)) || 'index.html';
  const t = (he, en) => document.documentElement.lang === 'en' ? en : he;
  const text = title => title[document.documentElement.lang === 'en' ? 'en' : 'he'];
  const url = p => new URL(p, base).href;
  const match = [...data.units, ...data.legacy].find(u => u.lessons.some(l => l.path === path));
  const isPreview = ['lesson.html', 'public/lesson.html'].includes(path);
  const fixedUnit = match || (path === 'lessons/personal-experience.html' ? data.units[1] : null);
  const currentLesson = match?.lessons.find(l => l.path === path);
  function inAdditionalLessons() {
    if (path !== 'course.html') return false;
    const section = document.getElementById('additional-lessons');
    const rect = section?.getBoundingClientRect();
    return !!rect && rect.top <= Math.max(220, innerHeight / 2) && rect.bottom > 100;
  }
  function unitNow() {
    if (fixedUnit) return fixedUnit;
    if (path !== 'course.html') return null;
    if (inAdditionalLessons()) {
      const group = document.querySelector('.additional-lesson-group[open]');
      return data.legacy.find(u => 'additional-' + u.id === group?.id) || null;
    }
    return [...data.units].reverse().find(u => {
      const el = document.getElementById(u.id);
      return el && el.getBoundingClientRect().top <= 220;
    }) || data.units.find(u => '#' + u.id === location.hash) || null;
  }
  const launcher = document.createElement('button');
  launcher.id = 'art-navigation-button';
  launcher.type = 'button';
  launcher.setAttribute('aria-haspopup', 'dialog');
  launcher.setAttribute('aria-controls', 'art-navigation-dialog');
  const dialog = document.createElement('dialog');
  dialog.id = 'art-navigation-dialog';
  dialog.setAttribute('aria-labelledby', 'art-navigation-title');
  const header = document.createElement('header');
  const title = document.createElement('h2'); title.id = 'art-navigation-title';
  const close = document.createElement('button'); close.type = 'button'; close.textContent = '×';
  header.append(title, close);
  const content = document.createElement('div'); content.className = 'art-navigation-content';
  dialog.append(header, content);
  const dock = document.createElement('div');
  dock.id = 'art-navigation-dock';
  dock.append(launcher);
  document.body.append(dock, dialog);
  function link(label, target, current = false) {
    const a = document.createElement('a'); a.textContent = label; a.href = url(target);
    if (current) a.setAttribute('aria-current', 'page');
    a.addEventListener('click', () => dialog.close());
    return a;
  }
  function showUnit(unit) {
    const section = document.createElement('section');
    const heading = document.createElement('h3');
    heading.textContent = (unit.id.startsWith('legacy') ? t('תפריט השיעורים: ', 'Lesson menu: ') : t('תפריט היחידה: ', 'Unit menu: ')) + text(unit.title);
    section.append(heading);
    if (unit.lessons.length) {
      const list = document.createElement('ol');
      unit.lessons.forEach(lesson => {
        const li = document.createElement('li');
        li.append(link(text(lesson.title), lesson.path, lesson.path === path)); list.append(li);
      });
      section.append(list);
    } else {
      section.append(link(t('לפרטי היחידה בתכנית הלימודים', 'View this unit in the curriculum'), 'course.html#' + unit.id));
    }
    return section;
  }
  function render() {
    const unit = unitNow();
    launcher.textContent = t('☰ ניווט', '☰ Navigate');
    launcher.setAttribute('aria-label', t('פתיחת תפריט ניווט', 'Open navigation menu'));
    title.textContent = t('איפה נמצאים?', 'Where am I?');
    close.setAttribute('aria-label', t('סגירת התפריט', 'Close navigation'));
    dialog.dir = document.documentElement.dir || 'rtl';
    content.replaceChildren();
    const locationText = document.createElement('p'); locationText.className = 'art-current-location';
    const pages = {
      'index.html': t('דף הבית', 'Home'), 'course.html': inAdditionalLessons() ? t('שיעורים נוספים', 'Additional lessons') : t('תכנית הלימודים', 'Curriculum'),
      'teachers.html': t('למורים ולבתי ספר', 'Teachers and schools'),
      'download.html': t('הורדות', 'Downloads'), 'offline-download.html': t('הורדה לשימוש ללא אינטרנט', 'Offline downloads')
    };
    locationText.textContent = [t('אתם כאן: ', 'You are here: '), unit ? text(unit.title) + ' / ' : '', currentLesson ? text(currentLesson.title) : isPreview ? t('שיעור לדוגמה', 'Preview lesson') : pages[path] || t('עמוד היחידה', 'Unit overview')].join('');
    content.append(locationText);
    const routes = document.createElement('nav'); routes.setAttribute('aria-label', t('מעבר בין דפי האתר', 'Site navigation'));
    if (unit && !unit.id.startsWith('legacy')) routes.append(link(t('חזרה לעמוד היחידה', 'Back to the unit'), 'course.html#' + unit.id));
    if (unit?.id.startsWith('legacy')) routes.append(link(t('חזרה לתפריט השיעורים', 'Back to lesson menu'), 'course.html#additional-' + unit.id));
    routes.append(link(t('כל יחידות הלימוד', 'All course units'), 'course.html', path === 'course.html'));
    routes.append(link(t('שיעורים נוספים', 'Additional lessons'), 'course.html#additional-lessons'));
    routes.append(link(t('שיעור לדוגמה', 'Sample lesson'), 'lesson.html', isPreview));
    routes.append(link(t('דף הבית', 'Home'), 'index.html', path === 'index.html'));
    if (document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1) {
      const back = document.createElement('button'); back.type = 'button';
      back.textContent = t('חזרה לעמוד הקודם', 'Back to the previous page');
      back.addEventListener('click', () => history.back()); routes.append(back);
    }
    content.append(routes);
    if (unit) content.append(showUnit(unit));
    const all = document.createElement('details');
    const summary = document.createElement('summary'); summary.textContent = t('מעבר ליחידה אחרת', 'Go to another unit'); all.append(summary);
    data.units.forEach(u => all.append(link(text(u.title), 'course.html#' + u.id)));
    content.append(all);
    const parentLink = document.querySelector('#hud-back, .lesson-back');
    if (parentLink) {
      const hasUnitPage = unit && !unit.id.startsWith('legacy');
      const additionalGroup = unit?.id.startsWith('legacy');
      parentLink.href = url(hasUnitPage ? 'course.html#' + unit.id : additionalGroup ? 'course.html#additional-' + unit.id : 'course.html');
      const parentLabel = parentLink.querySelector('span') || parentLink;
      parentLabel.textContent = hasUnitPage ? t('חזרה ליחידה', 'Back to unit') : additionalGroup ? t('חזרה לתפריט השיעורים', 'Back to lesson menu') : t('לתכנית הלימודים', 'Curriculum');
    }
    if (unit && !unit.id.startsWith('legacy')) {
      document.querySelectorAll('#stage a[href]').forEach(a => {
        const target = new URL(a.href);
        if (target.pathname === new URL('course.html', base).pathname && !target.hash) a.href = url('course.html#' + unit.id);
      });
    }
    const backButton = document.getElementById('back-btn');
    if (backButton) { backButton.setAttribute('aria-label', t('למסך הקודם בשיעור', 'Previous lesson screen')); backButton.title = backButton.getAttribute('aria-label'); }
  }
  launcher.addEventListener('click', () => { render(); dialog.showModal(); launcher.setAttribute('aria-expanded', 'true'); });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { launcher.setAttribute('aria-expanded', 'false'); launcher.focus(); });
  new MutationObserver(render).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
  render();
  // Hash links must land below both sticky course navigation bars.
  function revealUnit() {
    if (path !== 'course.html' || !/^#unit0[0-6]$/.test(location.hash)) return;
    const index = data.units.findIndex(u => '#' + u.id === location.hash);
    const tab = document.querySelectorAll('.unit-tab')[index];
    if (tab && typeof window.scrollToUnit === 'function') window.scrollToUnit(location.hash.slice(1), tab);
  }
  window.addEventListener('hashchange', revealUnit);
  window.addEventListener('load', revealUnit);
})();
