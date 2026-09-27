/* Access to existing lessons, retaining their original groups and order. */
(() => {
  const groups = window.ART_NAVIGATION?.legacy || [];
  const main = document.querySelector('main');
  if (!main || !groups.length) return;
  const lang = () => document.documentElement.lang === 'he' ? 'he' : 'en';
  const title = {he:'שיעורים נוספים', en:'Additional lessons'};
  const section = document.createElement('section');
  section.id = 'additional-lessons'; section.className = 'additional-lessons container';
  const menu = document.createElement('details'); menu.className = 'additional-lessons-menu';
  const summary = document.createElement('summary');
  const label = document.createElement('span');
  const count = document.createElement('span'); count.className = 'additional-lessons-count';
  count.textContent = groups.reduce((n, group) => n + group.lessons.length, 0);
  summary.append(label, count); menu.append(summary); section.append(menu); main.append(section);
  const entries = groups.map(group => {
    const details = document.createElement('details'); details.className = 'additional-lesson-group';
    details.id = 'additional-' + group.id; details.name = 'additional-lesson-groups';
    const heading = document.createElement('summary');
    const list = document.createElement('ul');
    const links = group.lessons.map(lesson => {
      const item = document.createElement('li');
      const link = document.createElement('a'); link.href = lesson.path;
      item.append(link); list.append(item);
      return {link, lesson};
    });
    details.append(heading, list); menu.append(details);
    details.addEventListener('toggle', () => {
      if (!details.open) return;
      entries.forEach(entry => { if (entry.details !== details) entry.details.open = false; });
    });
    return {details, heading, group, links};
  });
  const jump = document.createElement('a'); jump.className = 'additional-lessons-jump'; jump.href = '#additional-lessons';
  document.querySelector('.course-hero .container')?.append(jump);
  menu.addEventListener('toggle', () => {
    if (menu.open) window.dispatchEvent(new CustomEvent('course-menu-open', {detail:'additional'}));
  });
  window.addEventListener('course-menu-open', event => { if (event.detail === 'units') menu.open = false; });
  function render() {
    label.textContent = title[lang()]; jump.textContent = title[lang()];
    section.setAttribute('aria-label', title[lang()]);
    entries.forEach(({heading, group, links}) => {
      heading.textContent = group.title[lang()];
      links.forEach(({link, lesson}) => link.textContent = lesson.title[lang()]);
    });
  }
  function reveal(target = location.hash.slice(1)) {
    if (target !== section.id && !entries.some(e => e.details.id === target)) {
      if (!target || /^unit0[0-6]$/.test(target)) menu.open = false;
      return;
    }
    menu.open = true;
    const selected = entries.find(e => e.details.id === target);
    if (selected) entries.forEach(e => e.details.open = e === selected);
    const element = selected?.details || section;
    requestAnimationFrame(() => {
      const navHeight = document.getElementById('nav')?.getBoundingClientRect().height || 0;
      const tabsHeight = document.getElementById('unit-tabs')?.getBoundingClientRect().height || 0;
      window.scrollTo({top:element.getBoundingClientRect().top + scrollY - navHeight - tabsHeight - 16, behavior:'instant'});
    });
  }
  // Same-page menu links reopen the list even if the current hash is unchanged.
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || link.origin !== location.origin || link.pathname !== location.pathname) return;
    reveal(link.hash.slice(1));
  });
  new MutationObserver(render).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
  window.addEventListener('hashchange', () => reveal());
  window.addEventListener('load', () => reveal());
  window.addEventListener('pageshow', () => reveal());
  render(); reveal();
})();
