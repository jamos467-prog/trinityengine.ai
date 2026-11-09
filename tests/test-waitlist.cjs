const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
async function run({valid=true,ok=true,success=true,throws=false}){
 let calls=0,posted,handler;
 const messages=[];const input={value:valid?'review@example.com':'invalid',checkValidity:()=>valid,addEventListener(){}};
 const button={textContent:'Join Waitlist',disabled:false,addEventListener(event,fn){if(event==='click')handler=fn;}};
 const form={querySelector(s){if(s==='form')return null;if(s==='.cta-input')return input;if(s.includes('button')||s.includes('btn-'))return button;if(s==='.form-message')return null;return null;},appendChild(e){messages.push(e);}};
 const document={querySelectorAll:()=>[],querySelector:s=>s==='.cta-form'?form:s==='.navbar'?{style:{}}:null,createElement:()=>({style:{},setAttribute(){}})};
 const window={addEventListener(){},innerHeight:800};
 const fetch=async(url,args)=>{calls++;posted={url,args};if(throws)throw Error('connection');return {ok,json:async()=>({success,message:success?'Joined':'Rejected'})};};
 vm.runInNewContext(fs.readFileSync('script.js','utf8'),{document,window,fetch,IntersectionObserver:class{observe(){}},setTimeout(){},console:{error(){}}});
 await handler({preventDefault(){}});return {calls,posted,input,button,messages};
}
(async()=>{
 let r=await run({valid:false});assert.equal(r.calls,0);assert.match(r.messages[0].textContent,/valid email/);
 r=await run({});assert.equal(r.posted.url,'/api/waitlist');assert.equal(JSON.parse(r.posted.args.body).email,'review@example.com');assert.equal(r.input.value,'');assert.equal(r.button.disabled,false);
 r=await run({ok:false});assert.equal(r.messages[0].className,'form-message error');assert.equal(r.input.value,'review@example.com');assert.equal(r.button.disabled,false);
 r=await run({throws:true});assert.match(r.messages[0].textContent,/Unable to connect/);assert.equal(r.button.textContent,'Join Waitlist');assert.equal(r.button.disabled,false);
 console.log('PASS: invalid email blocked; waitlist POST contract; success, HTTP error and network recovery. No external signup submitted.');
})();
