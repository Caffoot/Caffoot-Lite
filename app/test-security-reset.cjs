'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, 'caffoot-lite.html'), 'utf8');
const start = html.indexOf('function phase16AClearSystem()');
const end = html.indexOf('function exportData()', start);
assert(start >= 0 && end > start, 'Clean-start handler must exist');
const code = html.slice(start, end);
function scenario(mode) {
    const original = { devices:[{id:'original'}], racks:[], subnets:[], ipAllocations:{} };
    const clean = { devices:[], racks:[], subnets:[], ipAllocations:{} };
    const originalText = JSON.stringify(original);
    const safetyText = JSON.stringify({devices:[{id:'prior-snapshot'}]});
    const key = 'caffoot_state', safetyKey = 'safety-test';
    const store = new Map([[key,originalText],[safetyKey,safetyText]]);
    const messages = [];
    let bannerCount = 0;
    const storage = {
        getItem(k) { return store.has(k) ? store.get(k) : null; },
        setItem(k,v) {
            if (k === key && v === originalText && mode === 'silent-inventory-rollback') return;
            if (k === safetyKey && v === safetyText && mode === 'silent-snapshot-rollback') return;
            store.set(k,String(v));
        },
        removeItem(k) { store.delete(k); }
    };
    const ctx = vm.createContext({
        appState:original, phase17AStorageRecovery:null,
        localStorage:storage, STORAGE_KEY:key, SAFETY_SNAPSHOT_KEY:safetyKey,
        nextAuditReason:'', selectedSubnetId:'old', selectedRackId:'old',
        cloneDefaultData:()=>clean,
        phase16CCheckBackup:x=>x,
        saveState:()=>{
            // Simulate a failure after the inventory has already been replaced on disk.
            store.set(key,JSON.stringify(clean));
            return false;
        },
        renderContent:()=>{}, showToast:(m,t)=>messages.push({m,t}),
        phase17ARecoveryBanner:()=>{bannerCount++;},
        window:{confirm:()=>true}, console:{error:()=>{}}
    });
    vm.runInContext(code,ctx);
    ctx.phase16AClearSystem();
    return {ctx,store,messages,bannerCount,original,originalText,safetyText,key,safetyKey};
}
const ok = scenario('normal');
assert.equal(ok.ctx.appState,ok.original,'failed reset must retain original in-memory inventory');
assert.equal(ok.store.get(ok.key),ok.originalText,'successful rollback must restore inventory');
assert.equal(ok.store.get(ok.safetyKey),ok.safetyText,'successful rollback must restore previous safety snapshot');
assert.equal(ok.ctx.phase17AStorageRecovery,null,'verified rollback must not enter recovery mode');
for(const mode of ['silent-inventory-rollback','silent-snapshot-rollback']) {
    const result = scenario(mode);
    assert.equal(result.ctx.appState,result.original,mode+' must retain original in memory');
    assert(result.ctx.phase17AStorageRecovery,mode+' must activate recovery mode');
    assert.equal(result.bannerCount,1,mode+' must display recovery banner');
    assert.equal(result.ctx.phase17AStorageRecovery.raw,result.originalText,mode+' must preserve original recovery data');
    assert(result.messages.some(x=>x.t==='error'),mode+' must report failure');
}
console.log('PASS: clean-start rollback verification detects silently failed inventory and snapshot writes.');
