(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.InferenceDesignerModel=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
  function consultationIndices(total, count) {
    // Evenly distributed sample routing; the default produces calls 2 and 4.
    return new Set(Array.from({length:count},(_,i) => Math.floor((i+0.5)*total/count)));
  }
  function contracts(s) {
    const agent = s['scenario-route'] === 'agent';
    const source = agent ? 'raven-discord' : 'raven-local';
    const scope = agent ? s['file-scope'] : 'none';
    const objective = s['task-objective'].trim() || 'Define the task objective.';
    const request = {
      example:true, contract:'illustrative-planning-request/v1', source, role:agent?'Huginn':'Muninn', cortex_access:{requested:'none',remote_bridge:'proposed; not enabled by this design'},
      via:['Warden Hand','Trinity Engine'],
      task:{objective,evidence_refs:['source-reference-to-be-supplied']},
      planning:{ENG:{provider:s['eng-provider'],model:s['eng-model']},SYNTH:{provider:s['synth-provider'],model:s['synth-model']},PRIME:{provider:s['prime-provider'],model:s['prime-model'],when:'arbitration is required'}},
      constraints:{file_scope:scope,external_actions:'require separate authorization',model_output_is_permission:false},
      requested_output:['plan','evidence_refs','uncertainties','candidate_actions']
    };
    const candidateActions = scope === 'none' ? [
      {id:'review-provided-context',kind:'text_analysis',via:source},
      {id:'draft-plan',kind:'text_response',via:source}
    ] : [
      {id:'inspect-evidence',kind:'read',via:'OpenClaw',scope,authorization:'check scope before access'},
      {id:'draft-corrections',kind:'prepare_artifact',via:'OpenClaw',scope,authorization:'separate approval before any write'}
    ];
    const response = {
      example:true, contract:'illustrative-planning-response/v1', return_to:source, via:['Warden Hand'],
      plan:[{step:1,goal:'Identify the evidence and task constraints'},{step:2,goal:'Separate supported claims from unresolved assumptions'},{step:3,goal:'Prepare reviewable candidate corrections'}],
      evidence_refs:['source-reference-to-be-supplied'],uncertainties:['Source contents have not been supplied or checked'],
      candidate_actions:candidateActions,
      execution:{actor:agent?'Raven via OpenClaw':'Local Raven (text only)',permission_granted:false,governed_write:'not authorized by this plan'}
    };
    return {request,response};
  }
  function describeCall(index,total,consultations,s) {
    const consultation = consultations.has(index);
    const agent = s['scenario-route'] === 'agent';
    const raven = agent ? 'Huginn' : 'Muninn';
    const worker = agent ? s['worker-provider'] : s['local-runtime'];
    const last = index === total-1;
    let title, description;
    if (consultation) {
      const prior = [...consultations].filter(i => i < index).length;
      title = prior === 0 ? 'Ask Trinity for a plan' : 'Return for review';
      description = prior === 0 ? `${raven} packages the objective, evidence references and constraints. Warden Hand checks the proposed handoff before Trinity contributes structured planning.` : `${raven} returns intermediate findings and open questions through Warden Hand. Trinity can revise the plan or review a divergence before work continues.`;
    } else {
      title = index === 0 ? 'Frame the task' : last ? 'Prepare the result' : 'Work within the plan';
      description = `${raven} uses ${worker || 'the selected worker'} for this turn. ${index === 0 ? 'It gathers the supplied objective and context.' : 'It works with the context and any structured guidance already returned.'} No Trinity consultation is scheduled for this turn.`;
    }
    return {consultation,title,description,path:consultation?[raven,'Warden Hand','Trinity','Warden Hand',raven]:(agent?['Discord','Raven / OpenClaw',worker||'Worker model','Raven']:['Local chat','Local Raven',worker||'Local model','Local Raven'])};
  }

return Object.freeze({consultationIndices,contracts,describeCall});
});
