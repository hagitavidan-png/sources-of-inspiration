/* Progressive unit menus: original course and lesson content stays in the DOM. */
(function () {
  const units = [...document.querySelectorAll('.unit-section')];
  if (!units.length) return;
  const he = () => document.documentElement.lang === 'he';
  const items = [];
  let demoLink;
  function labels() {
    if(demoLink)demoLink.textContent=he()?'שיעור לדוגמה: רגש, צבע וציור מופשט':'Sample lesson: Emotion, Colour and Abstract Painting';
    items.forEach(({button,panel}) => {button.textContent = panel.hidden ? (he()?'לשיעורי היחידה':'View unit lessons') : (he()?'סגירת רשימת השיעורים':'Close lesson list');});
    document.querySelectorAll('.unit-extra-details > summary').forEach(s=>{s.textContent=he()?'פרטי היחידה':'Unit details';});
    document.querySelectorAll('.lesson-details-toggle').forEach(b=>{b.textContent=he()?'פרטי השיעור':'Lesson details';});
  }
  function openUnit(id, updateAddress=false) {
    items.forEach(({unit,button,panel})=>{
      const open=unit.id===id;
      panel.hidden=!open;button.setAttribute('aria-expanded',String(open));unit.classList.toggle('unit-menu-open',open);
    });
    labels();
    if(updateAddress)history.replaceState(null,'',location.pathname+location.search+(id?'#'+id:''));
  }
  units.forEach(unit=>{
    const container=unit.querySelector(':scope > .container');
    const header=container.querySelector(':scope > .unit-header');
    const panel=document.createElement('div');panel.className='unit-lessons-panel';panel.id=unit.id+'-lessons';panel.hidden=true;
    [...container.children].filter(e=>e!==header).forEach(e=>panel.append(e));
    const button=document.createElement('button');button.type='button';button.className='unit-menu-toggle';button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls',panel.id);
    const approach=panel.querySelector(':scope > .approach-bar');
    if(approach){const details=document.createElement('details');details.className='unit-extra-details';const summary=document.createElement('summary');details.append(summary,approach);panel.append(details);}
    if(unit.id==='unit01'){demoLink=document.createElement('a');demoLink.href='lesson.html';demoLink.className='unit-demo-link';panel.prepend(demoLink);}
    container.append(button,panel);items.push({unit,button,panel});
    button.addEventListener('click',()=>{
      const opening=panel.hidden;openUnit(opening?unit.id:null,true);
      if(opening)window.scrollToUnit(unit.id,document.querySelectorAll('.unit-tab')[units.indexOf(unit)]);
    });
    panel.querySelectorAll('.lesson-row').forEach((row,index)=>{
      const head=row.querySelector('.lr-head');
      const detail=row.querySelector('.lr-expand');
      if(!head||!detail)return;
      detail.id=unit.id+'-lesson-details-'+index;
      const toggle=document.createElement('button');toggle.type='button';toggle.className='lesson-details-toggle';toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls',detail.id);
      function expand(){
        const opening=!row.classList.contains('open');
        panel.querySelectorAll('.lesson-row.open').forEach(r=>{r.classList.remove('open');r.querySelector('.lesson-details-toggle')?.setAttribute('aria-expanded','false');});
        row.classList.toggle('open',opening);toggle.setAttribute('aria-expanded',String(opening));
      }
      toggle.addEventListener('click',e=>{e.stopPropagation();expand();});
      (row.querySelector('.lr-right')||head).append(toggle);
      const title=row.querySelector('.lr-title');const link=row.querySelector('a.lr-action,a.lx-cta');
      if(title&&link){
        const a=document.createElement('a');a.className='lesson-title-link';a.href=link.getAttribute('href');
        title.before(a);a.append(title);a.addEventListener('click',e=>e.stopPropagation());
      }
      row.removeAttribute('onclick');
      head.addEventListener('click',e=>{if(e.target.closest('a,button'))return;if(link)location.href=link.href;else expand();});
    });
  });
  const previousScroll=window.scrollToUnit;
  window.scrollToUnit=function(id,tab){openUnit(id);if(typeof previousScroll==='function')previousScroll(id,tab||document.querySelectorAll('.unit-tab')[units.findIndex(u=>u.id===id)]);};
  function restore(){openUnit(/^#unit0[0-6]$/.test(location.hash)?location.hash.slice(1):null);}
  document.body.classList.add('unit-menus');
  new MutationObserver(labels).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  window.addEventListener('hashchange',restore);window.addEventListener('pageshow',restore);
  restore();labels();
})();
