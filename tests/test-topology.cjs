const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
class Element{
 constructor(){this.children=[];this.attrs={};this.listeners={};this.dataset={};this.checked=true;this.textContent='';}
 setAttribute(k,v){this.attrs[k]=String(v);if(k==='data-node')this.dataset.node=String(v);}
 append(e){this.children.push(e);}replaceChildren(){this.children=[];}
 addEventListener(k,f){this.listeners[k]=f;}click(){this.listeners.click?.();}
 querySelectorAll(selector){let result=[];for(const c of this.children){if(selector==='[data-node]'&&c.dataset.node!==undefined)result.push(c);result.push(...c.querySelectorAll(selector));}return result;}
}
const ids=Object.fromEntries(['topology','topology-detail','topology-edges','topology-reset'].map(k=>[k,new Element()]));
const buttons=['graph','depth'].map(v=>{const e=new Element();e.dataset.topology=v;return e;});
const document={getElementById:k=>ids[k],createElementNS:()=>new Element(),createElement:()=>new Element(),querySelectorAll:()=>buttons,querySelector:()=>buttons[0]};
vm.runInNewContext(fs.readFileSync('topology.js','utf8'),{document});
assert.equal(ids.topology.querySelectorAll('[data-node]').length,23);
let raven=ids.topology.querySelectorAll('[data-node]')[2];raven.click();assert.match(ids['topology-detail'].children[0].textContent,/Raven/);assert.equal(raven.attrs['aria-pressed'],'true');
buttons[1].click();assert.equal(buttons[1].attrs['aria-pressed'],'true');assert.equal(ids.topology.children.filter(e=>e.attrs.points).length,7);
ids['topology-edges'].checked=false;ids['topology-edges'].listeners.change();assert.equal(ids.topology.children.find(e=>e.attrs.class==='topology-lines').attrs.visibility,'hidden');
ids.topology.querySelectorAll('[data-node]')[5].listeners.keydown({key:'Enter',preventDefault(){}});assert.match(ids['topology-detail'].children[0].textContent,/ENG/);
ids['topology-reset'].click();assert.equal(buttons[0].attrs['aria-pressed'],'true');assert.equal(ids['topology-edges'].checked,true);assert.match(ids['topology-detail'].children[0].textContent,/Trinity/);
console.log('PASS: 23 nodes, node inspection, layout switch, edge toggle, keyboard selection and reset.');
