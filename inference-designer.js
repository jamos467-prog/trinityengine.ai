(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const ids = ['local-runtime','local-model','worker-provider','worker-model','file-scope','eng-provider','eng-model','synth-provider','synth-model','prime-provider','prime-model','scenario-route','total-calls','engine-calls','task-objective'];
  let currentCall = 0;
  const clamp = (value,min,max) => Math.max(min,Math.min(max,Number.isFinite(Number(value)) ? Math.trunc(Number(value)) : min));
  function state() {
    const result = Object.fromEntries(ids.map(id => [id,$(id).value]));
    result['total-calls'] = clamp(result['total-calls'],1,12);
    result['engine-calls'] = clamp(result['engine-calls'],0,result['total-calls']);
    return result;
  }
  const {consultationIndices,contracts,describeCall}=window.InferenceDesignerModel;
  function render() {
    const s = state(), total=s['total-calls'], count=s['engine-calls'];
    $('total-calls').value=String(total);$('engine-calls').max=String(total);$('engine-calls').value=String(count);
    currentCall=Math.min(currentCall,total-1);
    const consultations=consultationIndices(total,count);
    $('local-summary').textContent=`${s['local-runtime']} · ${s['local-model'].trim() || 'model not set'}`;
    $('local-runtime-label').textContent=s['local-runtime'];
    $('worker-provider-label').textContent=s['worker-provider'];
    $('worker-model-label').textContent=s['worker-model'].trim() || 'Model not set';
    $('file-scope-note').textContent=s['file-scope']==='none' ? 'No file access is included in this design. Raven can work with the context provided in the conversation.' : s['file-scope']==='scoped-cloud' ? 'A cloud connector requires its own credentials and scoped authorization in OpenClaw. A returned plan does not grant access.' : 'File access stays in OpenClaw, scoped to selected paths. A plan does not grant write permission.';
    $('walkthrough-title').textContent=`${total === 5 ? 'Five' : total} calls. ${count === 2 ? 'Two' : count} consultation${count===1?'':'s'}.`;
    $('mix-ratio').textContent=`${count} / ${total}`;
    $('mix-description').textContent=`${total-count} worker-only turn${total-count===1?'':'s'} · ${count} Trinity consultation${count===1?'':'s'}`;
    $('trace-position').textContent=`Call ${currentCall+1} of ${total}`;
    const ledger=$('call-list'); ledger.replaceChildren();
    for(let i=0;i<total;i++) {
      const call=describeCall(i,total,consultations,s);
      const button=document.createElement('button');button.type='button';button.className='call-button'+(call.consultation?' consult':'');button.setAttribute('aria-pressed',String(i===currentCall));button.setAttribute('aria-label',`Call ${i+1}: ${call.title}`);
      const number=document.createElement('span');number.className='call-number';number.textContent=String(i+1).padStart(2,'0');
      const label=document.createElement('span');label.textContent=call.title;
      const small=document.createElement('small');small.textContent=call.consultation?'Structured request + returned plan':'Worker inference';label.append(small);
      const badge=document.createElement('span');badge.className='call-badge';badge.textContent=call.consultation?'TRINITY':'RAVEN';
      button.append(number,label,badge);button.addEventListener('click',()=>{currentCall=i;render();$('call-list').children[i].focus();});ledger.append(button);
    }
    const call=describeCall(currentCall,total,consultations,s);
    document.querySelectorAll('[data-node]').forEach(node=>node.classList.toggle('is-active',node.dataset.node===(s['scenario-route']==='agent'?'agent':'local')||(node.dataset.node==='trinity'&&call.consultation)));
    document.querySelector('.routing-spine').classList.toggle('is-consulting',call.consultation);
    $('call-tag').textContent=`CALL ${String(currentCall+1).padStart(2,'0')} / ${call.consultation?'WARDEN HAND CONSULTATION':'WORKER INFERENCE'}`;
    $('call-tag').style.color=call.consultation?'var(--violet)':'var(--teal)';
    $('call-title').textContent=call.title;$('call-description').textContent=call.description;
    $('call-path').replaceChildren(...call.path.map(label=>{const li=document.createElement('li');li.textContent=label;return li;}));
    $('return-label').textContent=call.consultation?'STRUCTURED GUIDANCE RETURNS TO RAVEN':'RAVEN HANDLES THIS TURN';
    $('return-description').textContent=call.consultation?'A plan, evidence references, unresolved questions and candidate actions return through Warden Hand. Raven can operationalize permitted steps; execution and file writes require their own authorization.':'The worker handles the immediate exchange using available context. The design reserves wider planning and review for the selected Trinity turns.';
    $('previous-call').disabled=currentCall===0;$('next-call').disabled=currentCall===total-1;
    const payloads=contracts(s);$('request-json').textContent=JSON.stringify(payloads.request,null,2);$('response-json').textContent=JSON.stringify(payloads.response,null,2);
  }
  function preset(name) {
    const common={'local-runtime':'Ollama','local-model':'your-local-model','worker-provider':'DeepSeek','worker-model':'deepseek-chat','file-scope':'scoped-local','eng-provider':'OpenAI-compatible API','eng-model':'eng-model','synth-provider':'Anthropic API via adapter','synth-model':'synth-model','prime-provider':'OpenAI-compatible API','prime-model':'prime-model','scenario-route':'agent','total-calls':'5','engine-calls':'2'};
    if(name==='local')Object.assign(common,{'eng-provider':'Local model via adapter','synth-provider':'Local model via adapter','prime-provider':'Local model via adapter','scenario-route':'local','file-scope':'none'});
    if(name==='ensemble')Object.assign(common,{'eng-provider':'DeepSeek','synth-provider':'Anthropic API via adapter','prime-provider':'OpenAI-compatible API','total-calls':'8','engine-calls':'3'});
    for(const [id,value] of Object.entries(common))$(id).value=value;
    document.querySelectorAll('[data-preset]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.preset===name)));
    currentCall=0;render();
  }
  ids.forEach(id=>$(id).addEventListener('input',()=>{document.querySelectorAll('[data-preset]').forEach(button=>button.setAttribute('aria-pressed','false'));render();}));
  document.querySelectorAll('[data-preset]').forEach(button=>button.addEventListener('click',()=>preset(button.dataset.preset)));
  $('previous-call').addEventListener('click',()=>{currentCall=Math.max(0,currentCall-1);render();});
  $('next-call').addEventListener('click',()=>{currentCall=Math.min(state()['total-calls']-1,currentCall+1);render();});
  $('reset-trace').addEventListener('click',()=>{currentCall=0;render();});
  $('export-design').addEventListener('click',()=>{
    const s=state(), payloads=contracts(s);
    const design={kind:'illustrative-inference-design',version:1,live_configuration:false,setup:s,trace:{raven_calls:s['total-calls'],trinity_consultations:s['engine-calls'],consultation_call_numbers:[...consultationIndices(s['total-calls'],s['engine-calls'])].map(i=>i+1)},contracts:payloads};
    const url=URL.createObjectURL(new Blob([JSON.stringify(design,null,2)],{type:'application/json'}));
    const link=document.createElement('a');link.href=url;link.download='trinity-inference-design.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    $('export-status').textContent='Design exported. This JSON is a planning sketch, not a runtime configuration or authorization.';
  });
  render();
})();
