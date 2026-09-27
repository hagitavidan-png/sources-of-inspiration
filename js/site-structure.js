/* Navigation-only presentation: keep the original descriptions and lesson content. */
(() => {
  const units=window.ART_NAVIGATION?.units||[];
  const grid=document.querySelector('#units .units-grid');
  if(grid){
    const first=units[0];
    if(first){
      const card=document.createElement('div');card.className='unit-card unit-foundations';
      const header=document.createElement('div');header.className='unit-card-header';
      const number=document.createElement('div');number.className='unit-card-num';number.dataset.he='יחידה 00';number.dataset.en='Unit 00';
      const title=document.createElement('div');title.className='unit-card-title';title.dataset.he=first.title.he;title.dataset.en=first.title.en;
      header.append(number,title);card.append(header);card.dataset.unitTarget='course.html#'+first.id;grid.prepend(card);
    }
    grid.querySelectorAll('.unit-card').forEach(card=>{
      const target=card.dataset.unitTarget||card.getAttribute('onclick')?.match(/course\.html#unit\d+/)?.[0];
      const header=card.querySelector('.unit-card-header');if(!target||!header)return;
      card.removeAttribute('onclick');
      const link=document.createElement('a');link.href=target;link.className='unit-overview-link';header.before(link);link.append(header);
      const body=card.querySelector('.unit-card-body');
      if(body){const details=document.createElement('details');details.className='unit-overview-details';const summary=document.createElement('summary');summary.dataset.he='מידע נוסף';summary.dataset.en='More information';details.append(summary,body);card.append(details);}
    });
    document.body.classList.add('compact-unit-overview');
  }
  const overview=document.querySelector('.lesson-hero .hero-cta-group');
  if(location.pathname.endsWith('/lessons/personal-experience.html')){
    const container=overview||document.querySelector('.lesson-hero .container');
    if(container){const a=document.createElement('a');a.href='../course.html#unit01';a.className='canonical-unit-link';a.dataset.he='לשיעורי היחידה בתכנית הלימודים';a.dataset.en='View unit lessons in the curriculum';container.prepend(a);}
  }
  function render(){const lang=document.documentElement.lang==='he'?'he':'en';document.querySelectorAll('.unit-foundations [data-he],.unit-overview-details > summary,.canonical-unit-link').forEach(e=>e.textContent=e.dataset[lang]);}
  new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});render();
})();
