// Progressive enhancement: all catalogue cards remain visible without JavaScript.
(() => {
 const group=document.querySelector('.instrument-filters');
 if(!group) return;
 const cards=[...document.querySelectorAll('.instrument-card')];
 const buttons=[...group.querySelectorAll('[data-instrument-filter]')];
 const status=document.getElementById('instrument-count');
 buttons.forEach(button=>button.addEventListener('click',()=>{
  const owner=button.dataset.instrumentFilter;
  buttons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  let shown=0;
  cards.forEach(card=>{card.hidden=owner!=='all'&&!card.dataset.instrumentOwner.split(' ').includes(owner);if(!card.hidden)shown++;});
  status.textContent=shown+' instruments · '+(owner==='all'?'All owners':owner==='cortex'?'Cortex':'Raven');
 }));
 group.hidden=false;
})();
