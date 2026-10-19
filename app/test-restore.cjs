'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, 'caffoot-lite.html'), 'utf8');
const start = html.indexOf('function importData(event)');
const end = html.indexOf("document.addEventListener('submit'", start);
assert(start >= 0 && end > start, 'Restore handler must be available');
const helperStart = html.indexOf('function phase16CShowImportError(');
assert(helperStart >= 0 && helperStart < start, 'Persistent import error helper must exist');
const code = html.slice(helperStart, end);
async function scenario(mode) {
  const original = {devices:[{id:'original'}],racks:[],subnets:[],ipAllocations:{}};
  const replacement = {devices:[{id:'replacement'}],racks:[],subnets:[],ipAllocations:{}};
  const key = 'caffoot_state', safety = 'safety_test';
  const store = new Map([[key,JSON.stringify(original)]]);
  const messages = [];
  let ctx;
  class FakeReader {
    readAsText(file) {
      this.result = file.contents;
      this.onload();
    }
  }
  const storage = {
    getItem(k) {return store.has(k) ? store.get(k) : null;},
    setItem(k,v) {
      if(mode === 'snapshot-fails' && k === safety) throw Error('Snapshot blocked');
      if((mode === 'save-fails' || mode === 'rollback-fails') && k === key && JSON.parse(v).devices[0]?.id === 'replacement') throw Error('Write blocked');
      if(mode === 'rollback-fails' && k === key && JSON.parse(v).devices[0]?.id === 'original') throw Error('Rollback blocked');
      store.set(k,String(v));
    },
    removeItem(k) {store.delete(k);}
  };
  ctx = vm.createContext({
    appState:original, localStorage:storage, STORAGE_KEY:key, SAFETY_SNAPSHOT_KEY:safety,
    nextAuditReason:'',auditBaseline:JSON.stringify(original),
    phase17AStorageRecovery:null,phase17ARecoveryBanner:()=>{ctx.bannerShown=true;},
    selectedSubnetId:'',selectedRackId:'',
    FileReader:FakeReader,
    phase16CReadJson:JSON.parse,
    phase16CRejectUnsafeKeys:()=>{},
    phase11ValidateBackupShape:()=>{},
    phase20ValidateBackupVersion:()=>{},
    phase20MigrateBackup:v=>v,
    phase19BIsAccessPoint:()=>false,
    phase16CCheckBackup:v => {
      if(!v || !Array.isArray(v.devices)) throw Error('Invalid inventory');
      return v;
    },
    normaliseState:v=>v,
    confirm:()=>true,
    saveState:()=>{
      try {storage.setItem(key,JSON.stringify(ctx.appState));return true;}
      catch{return false;}
    },
    renderContent:()=>{},
    openModal:html=>messages.push({m:html,t:'persistent-error'}),
    escapeHtml:value=>String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'),
    showToast:(m,t)=>messages.push({m,t}),
    console:{error:()=>{}}
  });
  vm.runInContext(code,ctx);
  const input={files:[{name:'backup.json',size:100,contents:JSON.stringify(replacement)}],value:'selected'};
  ctx.importData({target:input});
  await new Promise(resolve => setImmediate(resolve));
  return {ctx,store,messages,input,original,replacement,key,safety};
}
async function main() {
for(const mode of ['snapshot-fails','save-fails','rollback-fails']){
  const v=await scenario(mode);
  assert.equal(v.ctx.appState.devices[0].id,'original',mode+' must retain original in memory');
  assert.equal(JSON.parse(v.store.get(v.key)).devices[0].id,'original',mode+' must retain original in storage');
  assert(v.messages.some(m=>m.t==='persistent-error'),mode+' must report failure in a persistent dialog');
  assert.equal(v.input.value,'',mode+' must clear file input');
}
const blocked=await scenario('rollback-fails');
assert(blocked.ctx.phase17AStorageRecovery, 'Failed rollback must activate recovery mode');
assert.equal(blocked.ctx.phase17AStorageRecovery.raw,JSON.stringify(blocked.original), 'Recovery mode must retain original snapshot');
assert.equal(blocked.ctx.bannerShown,true, 'Recovery banner must be displayed');
assert.equal(blocked.store.get(blocked.safety),JSON.stringify(blocked.original), 'Safety snapshot must survive failed rollback');
const ok=await scenario('success');
assert.equal(ok.ctx.appState.devices[0].id,'replacement','Successful restore must activate backup');
assert.equal(JSON.parse(ok.store.get(ok.key)).devices[0].id,'replacement','Successful restore must persist backup');
assert.equal(JSON.parse(ok.store.get(ok.safety)).devices[0].id,'original','Successful restore must preserve original safety snapshot');
console.log('PASS: executable restore success, failed safety snapshot and failed storage-write and failed rollback tests.');

}
main().catch(error => { console.error(error); process.exitCode = 1; });
