(() => {
'use strict';
const dialog=document.getElementById('trust-verifier');
const payload=document.getElementById('trust-payload');
const result=document.getElementById('trust-verification-result');
document.getElementById('open-trust-verifier').addEventListener('click',()=>dialog.showModal());
payload.addEventListener('input',()=>{result.textContent='Input changed. No cryptographic verification performed.';});
document.getElementById('check-trust-payload').addEventListener('click',()=>{
  try {
    const value=JSON.parse(payload.value);
    if(!value || typeof value!=='object' || Array.isArray(value)) throw new Error('object');
    const missing=['response','signed_payload','signature','key_id'].filter(key=>!Object.hasOwn(value,key));
    result.textContent=missing.length ? 'Incomplete prototype envelope. Missing: '+missing.join(', ')+'. Not cryptographically verified.' : 'Expected prototype fields found. Signature, hashes, tier and identity remain UNVERIFIED: no trusted production key or canonical envelope specification is configured.';
  } catch {result.textContent='Enter a JSON object. No cryptographic verification performed.';}
});
})();