document.addEventListener('DOMContentLoaded', () => {
 const box=document.getElementById('image-lightbox');if(!box)return;
 const image=document.getElementById('lightbox-image'),caption=document.getElementById('lightbox-caption'),close=box.querySelector('.lightbox-close');let previous;
 function open(card,trigger){previous=trigger;const source=card.querySelector('img');image.src=source.src;image.alt=source.alt;caption.textContent=`${card.querySelector('.ui-card-title').textContent} — ${card.querySelector('.ui-card-description').textContent} ${card.dataset.mediaKind==='illustration'?'Concept illustration; not an app screenshot.':card.dataset.mediaKind==='concept'?'Proposed visual update; edited from a system screenshot.':card.dataset.mediaKind==='screenshot'?'Actual system screenshot.':'Interface diagram; fresh capture pending.'}`;box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';close.focus();}
 function shut(){box.setAttribute('aria-hidden','true');document.body.style.overflow='';image.removeAttribute('src');previous?.focus();}
 document.querySelectorAll('.ui-card-zoom').forEach(button=>button.addEventListener('click',()=>open(button.closest('.ui-card'),button)));
 close.addEventListener('click',shut);box.addEventListener('click',e=>{if(e.target===box)shut();});
 document.addEventListener('keydown',e=>{if(box.getAttribute('aria-hidden')==='false'){if(e.key==='Escape')shut();if(e.key==='Tab'){e.preventDefault();close.focus();}}});
});

document.addEventListener('DOMContentLoaded',()=>{
 const controls=[...document.querySelectorAll('[data-manifold-view]')];
 function selectView(id){controls.forEach(button=>{const active=button.dataset.manifoldView===id;button.setAttribute('aria-pressed',String(active));document.getElementById(button.dataset.manifoldView).hidden=!active;});}
 controls.forEach(button=>button.addEventListener('click',()=>selectView(button.dataset.manifoldView)));
 function revealHash(){const id=location.hash.slice(1);if(controls.some(b=>b.dataset.manifoldView===id))selectView(id);}
 window.addEventListener('hashchange',revealHash);revealHash();
});
