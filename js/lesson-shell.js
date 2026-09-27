/* Shared lesson entry and controls. Existing lesson screens stay intact. */
(function () {
  'use strict';
  function init() {
    const file = location.pathname.split('/').pop();
    const data = (window.ART_LESSON_INTROS || {})[file];
    if (!data) return;
    const article = document.documentElement.dataset.reading === 'article';
    const body = document.body;
    body.classList.add('lesson-shell', 'lesson-intro-open');
    let hud = document.getElementById('hud');
    let bar = document.getElementById('nav-bar');
    if (article) {
      hud = document.createElement('header'); hud.id = 'hud';
      hud.innerHTML = '<a id="hud-back"><span></span></a><span id="hud-step"></span><div id="hud-lang"><button type="button" class="lang-btn" data-language="en">EN</button><button type="button" class="lang-btn" data-language="he">עברית</button></div>';
      body.prepend(hud);
      const unit = [...(window.ART_NAVIGATION?.units || []), ...(window.ART_NAVIGATION?.legacy || [])].find(u=>u.lessons.some(l=>l.path.endsWith('/'+file)));
      hud.querySelector('a').href = '../course.html'+(unit ? '#'+(unit.id.startsWith('legacy')?'additional-':'')+unit.id : '');
      hud.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>{
        if(document.documentElement.lang!==b.dataset.language) document.getElementById('lang-toggle').click();
      }));
      bar = document.createElement('div'); bar.id='nav-bar'; body.append(bar);
    }
    const full = document.getElementById('fs-btn') || document.getElementById('cls-btn');
    if (full) {hud.append(full); full.classList.add('shell-fullscreen');}
    const intro = document.createElement('section');
    intro.id='lesson-intro'; intro.setAttribute('aria-labelledby','intro-title');
    intro.innerHTML='<div class="intro-inner"><p class="intro-unit"></p><h1 id="intro-title" tabindex="-1"></h1><p class="intro-description"></p><dl class="intro-details"><div><dt class="intro-time-label"></dt><dd class="intro-time"></dd></div><div><dt class="intro-materials-label"></dt><dd class="intro-materials"></dd></div></dl></div>';
    body.append(intro);
    const start=document.createElement('button');start.id='intro-start';start.type='button';bar.append(start);
    const counter=document.getElementById('hud-step');
    const originalCounter=counter?.textContent;
    let open=true;
    function language(){return document.documentElement.lang==='he'?'he':'en';}
    function render(){
      const l=language(),he=l==='he';
      intro.dir=he?'rtl':'ltr';
      const texts={'.intro-unit':data.unit[l]+(data.number?' · '+(he?'שיעור ':'Lesson ')+data.number:''),'#intro-title':data.title[l],'.intro-description':data.description[l],'.intro-time-label':he?'זמן':'Time','.intro-time':data.time[l],'.intro-materials-label':he?'מה להכין':'What to prepare','.intro-materials':data.materials[l]};
      Object.entries(texts).forEach(([selector,value])=>intro.querySelector(selector).textContent=value);
      start.textContent=he?'מתחילים':'Start lesson';
      if(open&&counter)counter.textContent=he?'פתיחה':'Introduction';
      if(full)full.setAttribute('aria-label',he?'מסך מלא':'Full screen');
      if(article){hud.querySelector('#hud-back span').textContent=hud.querySelector('a').hash.startsWith('#additional-')?(he?'חזרה לתפריט השיעורים':'Back to lesson menu'):(he?'לתכנית הלימודים':'Curriculum');hud.querySelectorAll('[data-language]').forEach(b=>{b.classList.toggle('active',b.dataset.language===l);b.setAttribute('aria-pressed',String(b.dataset.language===l));});}
      else hud.querySelectorAll('.lang-btn').forEach(b=>b.setAttribute('aria-pressed',String(b.classList.contains('active'))));
      normalizeNext();
    }
    function normalizeNext(){
      const next=document.getElementById('next-btn');if(!next)return;
      const screens=[...document.querySelectorAll('#stage > .screen')];
      const last=screens.length&&screens[screens.length-1].classList.contains('active');
      if(last){next.removeAttribute('data-shell-label');next.removeAttribute('aria-label');}
      else {const label=language()==='he'?'המשך':'Continue';next.dataset.shellLabel=label;next.setAttribute('aria-label',label);}
    }
    start.addEventListener('click',()=>{
      open=false;body.classList.remove('lesson-intro-open');intro.hidden=true;start.hidden=true;
      if(counter)counter.textContent=originalCounter||'';
      if(article){bar.hidden=true;const main=document.querySelector('.lesson-body');main.setAttribute('tabindex','-1');main.focus({preventScroll:true});window.scrollTo(0,0);}
      else {const heading=document.querySelector('.screen.active h1,.screen.active h2,.screen.active .big');if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}}
    });
    // Arrow shortcuts belong to the lesson only after its introduction.
    document.addEventListener('keydown',e=>{if(open&&['ArrowLeft','ArrowRight',' '].includes(e.key)&&!e.target.closest('button,a,input,textarea')){e.preventDefault();e.stopImmediatePropagation();}},true);
    new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    const stage=document.getElementById('stage');if(stage)new MutationObserver(normalizeNext).observe(stage,{subtree:true,attributes:true,attributeFilter:['class']});
    render();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
