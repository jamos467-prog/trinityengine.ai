/* Manual capture gallery and deep-link-aware progressive disclosure. No autoplay. */
(()=>{'use strict';
 const root=document.getElementById('interface');if(!root)return;
 const tabs=[...root.querySelectorAll('[data-gallery-category]')],slides=[...root.querySelectorAll('[data-gallery-group]')],panels=[...root.querySelectorAll('[role="tabpanel"]')],thumbs=root.querySelector('.gallery-thumbnails'),status=document.getElementById('gallery-position');
 let current=slides.find(x=>x.id==='workspace-yggdrasil')||slides[0];
 const title=slide=>slide.querySelector('h3,h2')?.textContent.trim()||slide.getAttribute('aria-label');
 function choose(slide,history=false){
  current=slide;const group=slide.dataset.galleryGroup,groupSlides=slides.filter(x=>x.dataset.galleryGroup===group);
  tabs.forEach(t=>{const active=t.dataset.galleryCategory===group;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;});
  panels.forEach(p=>p.hidden=p.id!==`gallery-panel-${group}`);slides.forEach(s=>s.hidden=s!==slide);
  thumbs.replaceChildren();groupSlides.forEach(s=>{const b=document.createElement('button'),img=s.querySelector('img'),label=document.createElement('span');b.type='button';b.setAttribute('aria-pressed',String(s===slide));b.setAttribute('aria-controls',s.id);b.setAttribute('aria-label',`Show ${title(s)}`);if(img){const t=document.createElement('img');t.src=img.getAttribute('src');t.alt='';t.loading='lazy';t.width=132;t.height=65;b.append(t);}label.textContent=title(s);b.append(label);b.addEventListener('click',()=>choose(s,true));thumbs.append(b);});
  status.textContent=`${groupSlides.indexOf(slide)+1} of ${groupSlides.length} · ${tabs.find(t=>t.dataset.galleryCategory===group).textContent}`;
  if(history)window.history.pushState(null,'',`#${slide.id}`);
 }
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>{const group=tab.dataset.galleryCategory;choose(group==='operations'?slides.find(s=>s.id==='instrumentation'):slides.find(s=>s.dataset.galleryGroup===group),true);});tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();tabs[next].focus();tabs[next].click();}});});
 function step(direction){const groupSlides=slides.filter(s=>s.dataset.galleryGroup===current.dataset.galleryGroup),index=groupSlides.indexOf(current);choose(groupSlides[(index+direction+groupSlides.length)%groupSlides.length],true);}
 root.querySelector('[data-gallery-prev]').addEventListener('click',()=>step(-1));root.querySelector('[data-gallery-next]').addEventListener('click',()=>step(1));
 const dialog=document.getElementById('capture-dialog'),image=document.getElementById('capture-dialog-image');let trigger;
 root.querySelectorAll('.capture-enlarge').forEach(button=>button.addEventListener('click',()=>{const slide=button.closest('[data-gallery-group]'),src=slide.querySelector('.capture-image>img');trigger=button;image.src=src.src;image.alt=src.alt;document.getElementById('capture-dialog-title').textContent=title(slide);document.getElementById('capture-dialog-description').textContent=slide.querySelector('.capture-caption>p')?.textContent||'';dialog.showModal();dialog.querySelector('button').focus();}));
 dialog.querySelector('.capture-dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>trigger?.focus());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 function reveal(scroll=true){let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}if(!id)return;let target=document.getElementById(id);if(!target)return;
  if(target.dataset.galleryAlias)target=document.getElementById(target.dataset.galleryAlias)||target;
  const slide=target.closest('[data-gallery-group]');if(slide)choose(slide);
  for(let parent=target.parentElement;parent;parent=parent.parentElement)if(parent.tagName==='DETAILS')parent.open=true;
  // A fragment identifying a disclosure itself should reveal its explanation.
  if(target.tagName==='DETAILS')target.open=true;
  if(scroll)requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'instant'}));
 }
 // Capture-phase handling replaces the legacy smooth-scroll handler for this page only.
 document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const url=new URL(a.href,location.href);if(url.origin!==location.origin||url.pathname!==location.pathname||!url.hash)return;if(!document.getElementById(decodeURIComponent(url.hash.slice(1))))return;e.preventDefault();e.stopImmediatePropagation();window.history.pushState(null,'',url.hash);reveal();document.querySelector('.nav-links')?.classList.remove('is-open');const toggle=document.querySelector('.nav-toggle');if(toggle){toggle.setAttribute('aria-expanded','false');toggle.textContent='Menu';}},true);
 window.addEventListener('hashchange',()=>reveal());window.addEventListener('popstate',()=>reveal());choose(current);reveal();window.addEventListener('load',()=>reveal());
})();
