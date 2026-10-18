'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(__dirname+'/caffoot-lite.html','utf8');
const code=html.slice(html.indexOf('function caffootCompareVersions('),html.indexOf('function phase16ACheckSafety('));
async function run(response, offline=false) {
 const status={textContent:''};let calls=0;
 const context=vm.createContext({BigInt,AbortController,setTimeout,clearTimeout,CAFFOOT_LITE_VERSION:'1.0.0-rc.1',document:{getElementById:()=>status},navigator:{onLine:!offline},fetch:async(url,options)=>{calls++;assert.equal(url,'https://api.github.com/repos/caffoot/Caffoot-Lite/releases/latest');assert.equal(options.credentials,'omit');if(response instanceof Error)throw response;return response;}});
 vm.runInContext(code,context);
 await context.caffootCheckUpdates();return {context,status,calls};
}
(async()=>{
 const {context}=await run({status:404});
 for(const [a,b,n] of [['1.0.0','1.0.0-rc.1',1],['v1.0.0','1.0.0',0],['V1.1.0','v1.1.0',0],['V1.1.0','v1.0.0',1],['1.0.0-rc.10','1.0.0-rc.2',1],['1.0.0-beta','1.0.0-rc.1',-1],['1.0.0-1','1.0.0-a',-1],['1.0.0-a','1.0.0-a.1',-1],['1.0.0+build','1.0.0',0],['2.0.0','1.99.0',1]])assert.equal(context.caffootCompareVersions(a,b),n);
 assert.throws(()=>context.caffootCompareVersions('bad','1.0.0'));
 assert.throws(()=>context.caffootCompareVersions('1.0.0-01','1.0.0'));
 assert.equal((await run(null,true)).calls,0);
 assert.match((await run({status:404})).status.textContent,/private/);
 assert.match((await run(new Error('network'))).status.textContent,/Could not check/);
 assert.match((await run({ok:false,status:403})).status.textContent,/Could not check/);
 for(const tag of ['1.0.0','<img src=x onerror=alert(1)>']) {
 const r=await run({ok:true,json:async()=>({draft:false,prerelease:false,tag_name:tag})});
 assert.match(r.status.textContent,tag==='1.0.0'?/newer release/:/Could not check/);
 }
 assert.match((await run({ok:true,json:async()=>({draft:false,prerelease:false,tag_name:'0.9.0'})})).status.textContent,/No newer/);
 console.log('PASS: release versions, offline, private repository, network errors and hostile metadata.');
})().catch(e=>{console.error(e);process.exitCode=1;});
