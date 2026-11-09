const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const handlers={},linkHandlers=[];let open=false,focused=false;
const button={attrs:{'aria-expanded':'false'},addEventListener:(event,fn)=>handlers.click=fn,setAttribute(k,v){this.attrs[k]=v;},getAttribute(k){return this.attrs[k];},focus(){focused=true;}};
const links={classList:{toggle:(cls,value)=>open=value},querySelectorAll:()=>[0,1,2].map(()=>({addEventListener:(event,fn)=>linkHandlers.push(fn)}))};
const document={querySelector:s=>s==='.nav-toggle'?button:links,addEventListener:(event,fn)=>handlers[event]=fn};
const window={matchMedia:()=>({addEventListener:(event,fn)=>handlers.resize=fn})};
vm.runInNewContext(fs.readFileSync('navigation.js','utf8'),{document,window});
handlers.click();assert.equal(open,true);assert.equal(button.attrs['aria-expanded'],'true');handlers.keydown({key:'Escape'});assert.equal(open,false);assert.equal(focused,true);handlers.click();linkHandlers[0]();assert.equal(open,false);handlers.click();handlers.resize();assert.equal(open,false);
console.log('PASS: menu open/close, Escape focus return, link dismissal and breakpoint reset.');
