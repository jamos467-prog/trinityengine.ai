const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class El{
 constructor(tag='DIV',attrs={}){this.tagName=tag;this.attrs=attrs;this.dataset={};this.children=[];this.listeners={};this.value='';this.textContent='';for(const[k,v]of Object.entries(attrs))if(k.startsWith('data-'))this.dataset[k.slice(5)]=v;}
 setAttribute(k,v){this.attrs[k]=String(v);}addEventListener(k,f){this.listeners[k]=f;}append(e){this.children.push(e);}prepend(e){this.children.unshift(e);e.remove=()=>this.children.splice(this.children.indexOf(e),1);}replaceChildren(){this.children=[];}focus(){this.focused=true;}click(){this.listeners.click?.();}querySelectorAll(s){return this.children.filter(x=>s==='[data-task]'&&x.dataset.task!==undefined);}get lastElementChild(){return this.children.at(-1);}
}
const ids=Object.fromEntries(['architecture-panel','weave-events','runes','rune-description','reset-preview'].map(id=>[id,new El()]));
const tabs=['tree','governance','cockpit','observe'].map(view=>new El('BUTTON',{'data-view':view}));
const panel=ids['architecture-panel'];let dynamic=[];
Object.defineProperty(panel,'innerHTML',{set(value){for(const e of dynamic)if(e.attrs.id)delete ids[e.attrs.id];dynamic=[];this.children=[];for(const m of value.matchAll(/<(button|textarea|g|p)\b([^>]*)>/g)){const attrs={};for(const a of m[2].matchAll(/([\w-]+)="([^"]*)"/g))attrs[a[1]]=a[2];const e=new El(m[1].toUpperCase(),attrs);dynamic.push(e);this.children.push(e);if(attrs.id)ids[attrs.id]=e;}this.markup=value;}});
const document={getElementById:id=>ids[id]||null,createElement:tag=>new El(tag.toUpperCase()),querySelectorAll:sel=>sel==='[data-view]'?tabs:sel==='[data-mode]'?ids.runes.children:[]};
vm.runInNewContext(fs.readFileSync('architecture.js','utf8'),{document});
assert.equal(ids.runes.children.length,7);ids.runes.children[3].click();assert.match(ids['rune-description'].textContent,/ENGINEER/);
tabs[1].click();ids['stage-note'].click();assert.match(ids['stage-status'].textContent,/Enter a note/);ids['evidence-note'].value='<script>unsafe</script>';ids['stage-note'].click();assert.match(ids['stage-status'].textContent,/Write-lock remains active/);
tabs[2].click();assert.match(panel.markup,/Sample data · no runtime connected/);panel.querySelectorAll('[data-task]')[1].click();assert.match(ids['sample-task-detail'].textContent,/queued/);panel.querySelectorAll('[data-task]').filter(e=>e.tagName==='G')[2].listeners.keydown({key:'Enter',preventDefault(){}});assert.match(ids['sample-task-detail'].textContent,/complete/);
tabs[3].click();assert.match(panel.markup,/Not computed/);assert.match(panel.markup,/No telemetry source/);
tabs[0].listeners.keydown({key:'ArrowRight',preventDefault(){}});assert.equal(tabs[1].attrs['aria-selected'],'true');assert.equal(tabs[1].focused,true);
ids['reset-preview'].click();assert.match(ids['rune-description'].textContent,/AUTO/);assert.equal(ids['weave-events'].children.length,1);assert.equal(tabs[0].attrs['aria-selected'],'true');
console.log('PASS: rune selection, blank-note validation, staging lock, sample radar selection, keyboard task selection, tab navigation, reset.');
