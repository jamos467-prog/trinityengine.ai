const assert=require('node:assert/strict');
const {consultationIndices,contracts,describeCall}=require('../inference-designer-model.js');
const base={'scenario-route':'agent','file-scope':'scoped-local','task-objective':'Review supplied evidence','eng-provider':'analysis-provider','eng-model':'analysis-model','synth-provider':'synthesis-provider','synth-model':'synthesis-model','prime-provider':'review-provider','prime-model':'review-model','worker-provider':'worker-provider','local-runtime':'Ollama'};
assert.deepEqual([...consultationIndices(5,2)],[1,3]);
for(let total=1;total<=12;total++)for(let count=0;count<=total;count++){
 const indices=consultationIndices(total,count);assert.equal(indices.size,count);
 for(const index of indices)assert.ok(index>=0&&index<total&&Number.isInteger(index));
}
const indices=consultationIndices(5,2);
assert.equal(Array.from({length:5},(_,i)=>describeCall(i,5,indices,base)).filter(c=>c.consultation).length,2);
assert.deepEqual(describeCall(1,5,indices,base).path,['Huginn','Warden Hand','Trinity','Warden Hand','Huginn']);
assert.ok(!describeCall(0,5,indices,base).path.includes('Trinity'));
const agent=contracts(base);assert.equal(agent.request.planning.ENG.model,'analysis-model');assert.equal(agent.request.planning.SYNTH.provider,'synthesis-provider');assert.equal(agent.response.execution.permission_granted,false);
assert.equal(agent.response.example,true);assert.ok(agent.response.candidate_actions.every(action=>action.via==='OpenClaw'&&action.authorization));
const isolated=contracts({...base,'file-scope':'none'});assert.ok(isolated.response.candidate_actions.every(action=>action.kind!=='read'&&action.kind!=='write'));
const local=contracts({...base,'scenario-route':'local'});assert.equal(local.request.constraints.file_scope,'none');assert.equal(local.response.execution.actor,'Local Raven (text only)');assert.ok(local.response.candidate_actions.every(action=>action.via!=='OpenClaw'));
const literal=contracts({...base,'task-objective':'<b>Literal task text</b>'});assert.equal(literal.request.task.objective,'<b>Literal task text</b>');
assert.equal(agent.request.constraints.model_output_is_permission,false);assert.equal(agent.response.execution.governed_write,'not authorized by this plan');
console.log('PASS: 2-of-5 default; every valid 0–12 consultation allocation; worker/engine routes; per-shard configuration; scoped actions; no-file and local boundaries; literal task text; no authorization granted.');
