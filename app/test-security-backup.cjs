'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, 'caffoot-lite.html'), 'utf8');
const versionStart = html.indexOf('const CAFFOOT_BACKUP_FORMAT =');
const versionEnd = html.indexOf('function exportData()', versionStart);
assert(versionStart >= 0 && versionEnd > versionStart);
const versionCode = html.slice(versionStart,versionEnd);
const guardStart = html.indexOf('function rejectUnsafeBackupKeys(');
const guardEnd = html.indexOf('function downloadPreRestoreSafetySnapshot(', guardStart);
assert(guardStart >= 0 && guardEnd > guardStart, 'Backup key guard and shape validator must exist');
const guardCode = html.slice(guardStart,guardEnd);
const checkStart = html.indexOf('function validateAndNormaliseBackupForImport(');
const checkEnd = html.indexOf('function importData(',checkStart);
assert(checkStart >= 0 && checkEnd > checkStart, 'Backup validation pipeline must exist');
const mountsStart = html.indexOf('const deviceTypeDetailGroups =');
const mountsEnd = html.indexOf('function renderDeviceMountOptions(', mountsStart);
const repairStart = html.indexOf('function planLegacyComputerMountingCorrections(');
const repairEnd = html.indexOf('function validateAndNormaliseBackupForImport(', repairStart);
assert(mountsStart >= 0 && mountsEnd > mountsStart && repairStart >= 0 && repairEnd > repairStart,
  'Mount compatibility rules and legacy repair helpers must exist');
const mountCode = html.slice(mountsStart, mountsEnd);
const repairCode = html.slice(repairStart, repairEnd);
const context = vm.createContext({
  appState:{devices:[],subnets:[],racks:[],vlans:[],ipAllocations:{}},
  normaliseState:raw=>raw,
  validateApplicationState:()=>[]
});
vm.runInContext(mountCode+'\n'+repairCode+'\n'+versionCode+'\n'+guardCode+'\n'+html.slice(checkStart,checkEnd),context);
const valid = '{"devices":[],"subnets":[],"racks":[],"vlans":[],"ipAllocations":{}}';
assert.equal(context.validateAndNormaliseBackupForImport(JSON.parse(valid)).devices.length,0,'ordinary backup must pass');
const versioned = JSON.parse(JSON.stringify(context.createInventoryBackup({devices:[],subnets:[],racks:[],vlans:[],ipAllocations:{}})));
assert.equal(versioned.caffootBackup.schemaVersion,1);
assert.equal(context.validateAndNormaliseBackupForImport(versioned).devices.length,0);
const future = JSON.parse(JSON.stringify(versioned));
future.caffootBackup.schemaVersion = 2;
assert.throws(()=>context.validateAndNormaliseBackupForImport(future),/newer inventory schema/);
const malformed = JSON.parse(JSON.stringify(versioned));
malformed.caffootBackup.schemaVersion = '1';
assert.throws(()=>context.validateAndNormaliseBackupForImport(malformed),/metadata is invalid/);
const payloads = [
  '{"__proto__":{"polluted":true},"devices":[],"subnets":[],"racks":[],"vlans":[],"ipAllocations":{}}',
  '{"devices":[{"id":"a","constructor":{"prototype":{"polluted":true}}}],"subnets":[],"racks":[],"vlans":[],"ipAllocations":{}}',
  '{"devices":[],"subnets":[],"racks":[],"vlans":[],"ipAllocations":{"192.168.1.2":{"prototype":{"polluted":true}}}}',
  '{"devices":[],"subnets":[],"racks":[],"vlans":[],"ipAllocations":{},"nested":[{"__proto__":{"polluted":true}}]}'
];
for (const json of payloads) {
  assert.throws(()=>context.validateAndNormaliseBackupForImport(JSON.parse(json)),/prohibited object property/,'dangerous nested property must be rejected');
}
assert.equal({}.polluted,undefined,'host Object.prototype must not be polluted');
assert.throws(()=>context.validateAndNormaliseBackupForImport(JSON.parse('{"devices":{},"subnets":[],"racks":[],"vlans":[],"ipAllocations":{}}')),/valid devices array/,'wrong collection type must be rejected');
const tooMany = JSON.parse(valid);
tooMany.devices = Array.from({length:50001},()=>({}));
assert.throws(()=>context.validateAndNormaliseBackupForImport(tooMany),/too many devices/,'excessive collection must be rejected');
const malformedEntries = JSON.parse(valid);
malformedEntries.devices = [null];
assert.throws(()=>context.validateAndNormaliseBackupForImport(malformedEntries),/invalid entries in devices/,'null device entries must be rejected');
const arrayAllocations = JSON.parse(valid);
arrayAllocations.ipAllocations = [];
assert.throws(()=>context.validateAndNormaliseBackupForImport(arrayAllocations),/valid IP allocation table/,'array-shaped IP allocation tables must be rejected');
const tooManyAllocations = JSON.parse(valid);
tooManyAllocations.ipAllocations = Object.fromEntries(Array.from({length:100001},(_,i)=>['ip-'+i,{}]));
assert.throws(()=>context.validateAndNormaliseBackupForImport(tooManyAllocations),/too many IP allocations/,'excessive IP allocations must be rejected');
const nestedArrayPayload = JSON.parse(valid);
nestedArrayPayload.devices = [{id:'safe',metadata:[{nested:[JSON.parse('{"__proto__":{"polluted":true}}')]}]}];
assert.throws(()=>context.validateAndNormaliseBackupForImport(nestedArrayPayload),/prohibited object property/,'dangerous keys inside nested arrays must be rejected');
assert.equal(context.appState.devices.length,0,'failed checks must not replace active inventory');
assert.throws(()=>context.parseBackupJsonWithHelpfulError('{invalid'),/not valid JSON/,'malformed JSON must be rejected');
assert.equal(context.validateAndNormaliseBackupForImport(JSON.parse(valid)).devices.length,0,'valid backups must still work after rejected payloads');
console.log('PASS: hostile JSON property names, malformed data and oversized collections rejected.');
