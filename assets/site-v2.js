/* Shared page behaviour: native disclosure reveal, legacy fragment migration and explicit email signup. */
(()=>{'use strict';
 const isHome=document.body.dataset.sitePage==='index.html';let mapping=window.TRINITY_LEGACY_FRAGMENTS;
 async function reveal(){let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}if(!id)return;let target=document.getElementById(id);
  if(!target&&isHome){try{mapping=mapping||await fetch('assets/legacy-fragments.json').then(r=>{if(!r.ok)throw Error('map');return r.json();});if(mapping[id]){location.replace(mapping[id]);return;}}catch{}return;}
  if(!target)return;if(target.tagName==='DIALOG'&&target.hidden)target=document.getElementById('cryptographic-trust')||target;
  for(let p=target.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;if(target.tagName==='DETAILS')target.open=true;
  if(!target.hidden)requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'instant'}));
 }
 document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a||e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;const u=new URL(a.href,location.href);if(u.origin!==location.origin||u.pathname!==location.pathname||!u.hash)return;let id;try{id=decodeURIComponent(u.hash.slice(1));}catch{return;}if(!document.getElementById(id))return;
  // The gallery's controller owns selection and history where present.
  if(document.querySelector('[data-gallery-category]'))return;e.preventDefault();history.pushState(null,'',u.hash);reveal();},true);
 window.addEventListener('hashchange',reveal);window.addEventListener('popstate',reveal);window.addEventListener('load',reveal);reveal();
 const form=document.getElementById('early-access-form');if(form)form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const email=form.querySelector('[name="email"]').value.trim();const body=`Please send me Trinity Engine early access announcements.\n\nMy email address: ${email}`;location.href='mailto:v12trinityengine@gmail.com?subject='+encodeURIComponent('Trinity Engine early access')+'&body='+encodeURIComponent(body);document.getElementById('signup-status').textContent='Email draft prepared. Send it from your mail app to request early access announcements. This website has not registered or stored your address.';});
})();
