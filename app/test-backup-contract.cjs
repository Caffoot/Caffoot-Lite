'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync(__dirname+'/caffoot-lite.html','utf8');
const slice=(start,end)=>{const a=html.indexOf(start),b=html.indexOf(end,a);assert(a>=0&&b>a);return html.slice(a,b);};
const mountCode=slice('const deviceTypeDetailGroups =','function renderDeviceMountOptions('); const repairCode=slice('function planLegacyComputerMountingCorrections(','function validateAndNormaliseBackupForImport(');
const context=vm.createContext({appState:{devices:[],subnets:[],vlans:[],racks:[],ipAllocations:{}},getDeviceById:id=>context.appState.devices.find(d=>d.id===id)});
vm.runInContext(mountCode+'\n'+repairCode+'\n'+slice('const defaultData =','// Caffoot Lite v1 uses its own browser storage namespace.')+'\nfunction ipBelongsToSubnet(ip,cidr){return isUsableHostAddressInSubnet(ip,cidr);}\n'+slice('const CAFFOOT_BACKUP_FORMAT =','function exportData()')+'\n'+slice('function rejectUnsafeBackupKeys(','function downloadPreRestoreSafetySnapshot(')+'\n'+slice('function validateAndNormaliseBackupForImport(','function importData('),context);
const read=name=>JSON.parse(fs.readFileSync(__dirname+'/fixtures/'+name,'utf8'));
const raw=read('lite-schema-v1.example.json'),original=JSON.stringify(raw),before=JSON.stringify(context.appState);
const candidate=context.validateAndNormaliseBackupForImport(raw);
assert.equal(JSON.stringify(raw),original,'Validation must not mutate the input backup');
assert.equal(JSON.stringify(context.appState),before,'Preview must not replace active inventory');
assert.equal(candidate.devices.length,2);assert.equal(candidate.rackAccessories.length,1);assert.equal(candidate.ipAllocations['192.168.40.20'].reservedForDeviceId,'example-server');
assert.equal(candidate.devices[0].typeDetails.legacyExampleFlag,true);
const roundtrip=context.validateAndNormaliseBackupForImport(JSON.parse(JSON.stringify(context.createInventoryBackup(candidate))));
// Location Area is now independent of rack assignment: legacy 'Racked' is a
// sentinel, not a real room. Compare migrated devices, not the old sentinel.
assert.equal(candidate.devices[0].location,'Unknown','legacy rack location must migrate');
assert.equal(candidate.devices[0].rackId,raw.devices[0].rackId,'rack assignment must survive migration');
assert.equal(candidate.devices[0].rackUStart,raw.devices[0].rackUStart,'rack U position must survive migration');
assert.equal(candidate.devices[1].location,raw.devices[1].location,'real room must survive migration');
for(const key of Object.keys(raw).filter(k=>!['caffootBackup','deviceTypes','devices','deviceLocations'].includes(k)))
  assert.equal(JSON.stringify(roundtrip[key]),JSON.stringify(raw[key]),key+' must survive export/import');
assert.equal(JSON.stringify(roundtrip.devices),JSON.stringify(candidate.devices),'migrated devices must survive export/import');
assert.equal(JSON.stringify(roundtrip.deviceLocations),JSON.stringify(candidate.deviceLocations),'migrated location options must survive export/import');
assert(!roundtrip.deviceLocations.includes('Racked'),'legacy sentinel must not remain a managed location');
// Migration may append newly supported built-in device types, but must preserve every original type and its order.
assert.deepEqual(Array.from(roundtrip.deviceTypes.slice(0,raw.deviceTypes.length)),raw.deviceTypes,'original device types must survive export/import in order');
assert(roundtrip.deviceTypes.includes('Layer 3 Switch'),'migration must retain the new Layer 3 Switch type');
assert.equal(new Set(roundtrip.deviceTypes).size,roundtrip.deviceTypes.length,'device types must not be duplicated');
// #164: New virtual hardware and host assignment must survive the existing backup contract.
const vmBackup=JSON.parse(JSON.stringify(candidate));
vmBackup.devices.push({id:'fixture-164-vm-backup',name:'VM backup fixture',type:'Server - Virtual',
  status:'Active',isVirtual:true,virtualHostId:'example-server',
  typeDetails:{vmVcpu:4,vmRamGb:16,vmDiskGb:120,vmNicCount:2}});
const vmRoundtrip=context.validateAndNormaliseBackupForImport(JSON.parse(JSON.stringify(context.createInventoryBackup(vmBackup))));
const restoredVm=vmRoundtrip.devices.find(d=>d.id==='fixture-164-vm-backup');
assert.ok(restoredVm,'VM must survive backup export/import');
assert.equal(restoredVm.type,'Server - Virtual');
assert.equal(restoredVm.isVirtual,true);
assert.equal(restoredVm.virtualHostId,'example-server');
for(const [field,value] of Object.entries({vmVcpu:4,vmRamGb:16,vmDiskGb:120,vmNicCount:2}))
  assert.equal(String(restoredVm.typeDetails[field]),String(value),field+' must survive VM backup round trip');
const legacy=read('lite-legacy.example.json'),legacyBytes=JSON.stringify(legacy);
const migrated=context.validateAndNormaliseBackupForImport(legacy);
assert.equal(migrated.devices[1].location,'Unknown');assert(migrated.deviceTypes.includes('Server - Physical'));assert.equal(JSON.stringify(legacy),legacyBytes);
const drift=read('lite-schema-v1.example.json');drift.ipAllocations['192.168.40.10'].hostname='Old name';drift.ipAllocations['192.168.40.10'].notes='Old notes';
const repaired=context.validateAndNormaliseBackupForImport(drift);assert.equal(repaired.ipAllocations['192.168.40.10'].hostname,'Example server');assert.equal(drift.ipAllocations['192.168.40.10'].hostname,'Old name');
for(const modify of [x=>x.caffootBackup.schemaVersion=2,x=>x.caffootBackup.schemaVersion='1',x=>x.caffootBackup.exportedAt='invalid',x=>x.devices[1].primaryIp=x.devices[0].primaryIp]){
 const bad=read('lite-schema-v1.example.json');modify(bad);assert.throws(()=>context.validateAndNormaliseBackupForImport(bad));assert.equal(JSON.stringify(context.appState),before);
}
const extended=read('lite-schema-v1.example.json');extended.futureOptionalExample={value:'preserved'};assert.equal(context.validateAndNormaliseBackupForImport(extended).futureOptionalExample.value,'preserved');
console.log('PASS: populated schema-v1 and legacy fixtures, detached migration, primary IP repair, roundtrip preservation and rejection without active changes.');
