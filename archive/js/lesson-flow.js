/* Shared renderer for a guided lesson; never modifies original lesson data. */
(() => {
  const data = window.UNIFIED_LESSON;
  if (!data) return;
  const lang = () => document.documentElement.lang === 'he' ? 'he' : 'en';
  const t = value => typeof value === 'string' ? value : value?.[lang()] || '';
  const ui = (he,en) => lang() === 'he' ? he : en;
  const state = {stage:0, emotions:[], colours:{}, checks:{}, notes:{}, extensions:{}};
  const stage = document.getElementById('flow-stage');
  const list = document.getElementById('stage-list');
  const select = document.getElementById('stage-select');
  const previous = document.getElementById('flow-prev');
  const next = document.getElementById('flow-next');
  const finish = document.getElementById('flow-finish');
  function element(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }
  function paragraph(parent, text, className='stage-copy') { parent.append(element('p',className,t(text))); }
  function artworks(parent, items) {
    if (!items?.length) return;
    const gallery=element('div','flow-gallery');
    items.forEach(art=>{
      const figure=element('figure','flow-art');
      const link=element('a','flow-art-link');link.href=art.src;link.target='_blank';link.rel='noopener';link.setAttribute('aria-label',ui('הגדלת היצירה: ','Enlarge artwork: ')+t(art.alt));
      const img=document.createElement('img');img.src=art.src;img.alt=t(art.alt);img.loading='lazy';img.decoding='async';
      img.addEventListener('error',()=>{img.hidden=true;figure.classList.add('image-unavailable');link.append(element('span','flow-image-error',ui('התמונה לא נטענה. פתיחת מקור התמונה','Image did not load. Open image source')));});
      link.append(img);const caption=element('figcaption','',t(art.caption));
      if(art.sourceHref){const source=element('a','flow-art-source',ui('ליצירה באתר המוזיאון','View artwork at the museum'));source.href=art.sourceHref;source.target='_blank';source.rel='noopener';caption.append(source);}
      figure.append(link,caption);gallery.append(figure);
    });parent.append(gallery);
  }
  function quote(parent, item) {
    if (!item) return;
    const block=element('blockquote','flow-quote');paragraph(block,item.text,'');block.append(element('cite','',t(item.author)));parent.append(block);
  }
  function palette(editable) {
    const grid = element('div','emotion-palette');
    state.emotions.forEach(id => {
      const emotion = data.emotions.find(e=>e.id===id);
      const row = element(editable?'label':'div','palette-item');
      if (editable) {
        const input = document.createElement('input'); input.type='color'; input.value=state.colours[id]||'#e1c16a';
        input.setAttribute('aria-label',ui('צבע עבור ','Colour for ')+t(emotion.label));
        input.addEventListener('input',()=>state.colours[id]=input.value);
        row.append(input);
      } else {
        const dot=element('span','palette-dot'); dot.style.background=state.colours[id]||'#e1c16a'; dot.setAttribute('aria-hidden','true'); row.append(dot);
      }
      row.append(element('span','',t(emotion.label))); grid.append(row);
    });
    return grid;
  }
  function emotionActivity() {
    const options=element('div','emotion-options'); options.setAttribute('role','group'); options.setAttribute('aria-label',ui('בחירת רגשות','Choose emotions'));
    const status=element('p','selection-status'); status.setAttribute('role','status');
    const holder=element('div','palette-holder');
    function update() {
      options.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(state.emotions.includes(button.dataset.emotion))));
      status.textContent=ui('נבחרו '+state.emotions.length+' מתוך 4 רגשות',state.emotions.length+' of 4 emotions selected');
      holder.replaceChildren(palette(true));
    }
    data.emotions.forEach(emotion=>{
      const button=element('button','emotion-option',t(emotion.label)); button.type='button'; button.dataset.emotion=emotion.id;
      button.addEventListener('click',()=>{
        if(state.emotions.includes(emotion.id))state.emotions=state.emotions.filter(id=>id!==emotion.id);
        else if(state.emotions.length<4)state.emotions.push(emotion.id);
        else {status.textContent=ui('אפשר לבחור עד ארבעה רגשות. לחצו על רגש נבחר כדי להחליף אותו.','Choose up to four emotions. Select a chosen emotion again to replace it.');return;}
        update();
      }); options.append(button);
    });
    stage.append(options,status,holder); update();
  }
  function render() {
    const current=data.stages[state.stage];
    document.title=t(data.title)+' | '+ui('טיוטת שיעור','Lesson preview');
    document.getElementById('flow-lesson-name').textContent=t(data.title);
    document.querySelectorAll('.flow-language button').forEach(button=>button.setAttribute('aria-pressed',String(button.id==='btn-'+lang())));
    document.getElementById('stage-count').textContent=ui('שלב '+(state.stage+1)+' מתוך '+data.stages.length,'Stage '+(state.stage+1)+' of '+data.stages.length);
    const progress=document.getElementById('flow-progress'); progress.max=data.stages.length; progress.value=state.stage+1; progress.setAttribute('aria-label',ui('התקדמות השיעור','Lesson progress'));
    list.replaceChildren(); select.replaceChildren();
    data.stages.forEach((item,index)=>{
      const li=element('li'); const button=element('button','flow-step');button.type='button';button.append(element('span','',index+1),element('span','',t(item.label)));
      if(index===state.stage)button.setAttribute('aria-current','step');button.addEventListener('click',()=>go(index));li.append(button);list.append(li);
      const option=element('option','',(index+1)+'. '+t(item.label));option.value=index;option.selected=index===state.stage;select.append(option);
    });
    stage.replaceChildren(); stage.append(element('p','stage-label',t(current.label)));
    const heading=element('h1','',t(current.heading));heading.id='stage-title';heading.tabIndex=-1;stage.append(heading);
    if(current.artwork){
      const figure=element('figure','flow-art');const img=document.createElement('img');img.src=current.artwork.src;img.alt=t(current.artwork.alt);img.decoding='async';
      figure.append(img,element('figcaption','',t(current.artwork.caption)));stage.append(figure);
    }
    (current.paragraphs||[]).forEach(p=>paragraph(stage,p));
    artworks(stage,current.artworks);
    (current.sections||[]).forEach(section=>{
      const block=element('section','flow-section');
      if(section.heading)block.append(element('h2','',t(section.heading)));
      (section.paragraphs||[]).forEach(p=>paragraph(block,p));
      artworks(block,section.artworks);
      if(section.list?.length){const ul=element('ul','flow-prompts');section.list.forEach(p=>ul.append(element('li','',t(p))));block.append(ul);}
      quote(block,section.quote);stage.append(block);
    });
    quote(stage,current.quote);
    if(current.id==='opening'){
      const meta=element('dl','flow-meta');
      [[ui('זמן השיעור','Lesson time'),data.time],[ui('מה להכין','What to prepare'),data.materials]].forEach(([label,value])=>{const row=element('div');row.append(element('dt','',label),element('dd','',t(value)));meta.append(row);});stage.append(meta);
    }
    if(current.interaction==='emotion')emotionActivity();
    if(current.interaction!=='emotion'&&['create','reflect'].includes(current.id)&&state.emotions.length)stage.append(palette(false));
    if(current.checklist?.length){
      const checklist=element('div','flow-checklist');
      current.checklist.forEach((text,index)=>{const id=current.id+'-'+index;const label=element('label');const input=document.createElement('input');input.type='checkbox';input.checked=!!state.checks[id];input.addEventListener('change',()=>state.checks[id]=input.checked);label.append(input,element('span','',t(text)));checklist.append(label);});stage.append(checklist);
    }
    if(current.interaction==='reflection'){
      (current.prompts||[]).forEach((prompt,index)=>{const id=current.id+'-'+index;const label=element('label','flow-note');label.append(element('span','',t(prompt)));const textarea=document.createElement('textarea');textarea.value=state.notes[id]||'';textarea.addEventListener('input',()=>state.notes[id]=textarea.value);label.append(textarea);stage.append(label);});
    } else if(current.prompts?.length){const ul=element('ul','flow-prompts');current.prompts.forEach(p=>ul.append(element('li','',t(p))));stage.append(ul);}
    (current.extensions||[]).forEach((extension,index)=>{
      const id=current.id+'-'+index;const details=element('details','flow-extension');details.open=!!state.extensions[id];details.addEventListener('toggle',()=>state.extensions[id]=details.open);
      details.append(element('summary','',t(extension.title)));const body=element('div');
      (extension.paragraphs||[]).forEach(p=>paragraph(body,p,''));
      if(extension.list?.length){const ul=element('ul');extension.list.forEach(p=>ul.append(element('li','',t(p))));body.append(ul);}
      (extension.links||[]).forEach(link=>{const a=element('a','',t(link.label));a.href=link.href;body.append(a);});details.append(body);stage.append(details);
    });
    previous.textContent=ui('הקודם','Previous');previous.disabled=state.stage===0;
    next.textContent=state.stage===0?ui('מתחילים','Start lesson'):ui('המשך','Continue');
    next.hidden=state.stage===data.stages.length-1; finish.hidden=!next.hidden;
    const sources=document.getElementById('flow-source-links');sources.replaceChildren();(data.sources||[]).forEach(link=>{const a=element('a','',t(link.label));a.href=link.href;sources.append(a);});
  }
  function fromHash(){const index=data.stages.findIndex(s=>'#'+s.id===location.hash);return index<0?0:index;}
  function go(index){
    state.stage=Math.max(0,Math.min(data.stages.length-1,index));history.replaceState(null,'','#'+data.stages[state.stage].id);render();
    document.querySelector('.flow-context').open=false;window.scrollTo({top:0,behavior:'instant'});document.getElementById('stage-title').focus({preventScroll:true});
  }
  select.addEventListener('change',()=>go(Number(select.value)));previous.addEventListener('click',()=>go(state.stage-1));next.addEventListener('click',()=>go(state.stage+1));
  window.addEventListener('hashchange',()=>{state.stage=fromHash();render();});
  document.addEventListener('click',event=>{const menu=document.querySelector('.flow-context');if(!menu.contains(event.target))menu.open=false;});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')document.querySelector('.flow-context').open=false;});
  new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});state.stage=fromHash();render();
})();
