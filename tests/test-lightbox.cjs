const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const handlers={},closeHandlers={};let focus='',overflow='';const img={src:'',alt:'',removeAttribute(k){delete this[k];}};const caption={};
const close={addEventListener:(event,fn)=>closeHandlers[event]=fn,focus(){focus='close';}};
const box={attrs:{'aria-hidden':'true'},querySelector:()=>close,addEventListener:(event,fn)=>handlers.box=fn,setAttribute(k,v){this.attrs[k]=v;},getAttribute(k){return this.attrs[k];}};
const card={dataset:{},querySelector:s=>s==='img'?{src:'diagram.svg',alt:'Interface diagram'}:s==='.ui-card-title'?{textContent:'Cockpit'}:{textContent:'Mission Control'}};
const trigger={addEventListener:(event,fn)=>handlers.open=fn,closest:()=>card,focus(){focus='trigger';}};
const document={body:{style:{}},getElementById:id=>id==='image-lightbox'?box:id==='lightbox-image'?img:caption,querySelectorAll:s=>s==='.ui-card-zoom'?[trigger]:[],addEventListener:(event,fn)=>{(handlers[event]??=[]).push(fn);}};
vm.runInNewContext(fs.readFileSync('assets/ui-showcase.js','utf8'),{document,window:{addEventListener(){}},location:{hash:''}});handlers.DOMContentLoaded.forEach(fn=>fn());handlers.open();assert.equal(box.attrs['aria-hidden'],'false');assert.equal(focus,'close');assert.equal(img.src,'diagram.svg');assert.match(caption.textContent,/fresh capture pending/);handlers.keydown[0]({key:'Tab',preventDefault(){}});assert.equal(focus,'close');handlers.keydown[0]({key:'Escape'});assert.equal(box.attrs['aria-hidden'],'true');assert.equal(focus,'trigger');assert.equal(document.body.style.overflow,'');
console.log('PASS: accessible lightbox open, caption, focus containment, Escape and focus restoration.');
