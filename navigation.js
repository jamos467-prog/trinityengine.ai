(() => {
 const button=document.querySelector('.nav-toggle'),links=document.querySelector('.nav-links');if(!button||!links)return;
 function toggle(open){links.classList.toggle('is-open',open);button.setAttribute('aria-expanded',String(open));button.textContent=open?'Close menu':'Menu';}
 button.addEventListener('click',()=>toggle(button.getAttribute('aria-expanded')!=='true'));
 links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggle(false)));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&button.getAttribute('aria-expanded')==='true'){toggle(false);button.focus();}});
 const breakpoint=window.matchMedia('(min-width:1101px)');breakpoint.addEventListener('change',()=>toggle(false));
})();
