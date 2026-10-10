'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, 'caffoot-lite.html'), 'utf8');
const guardStart = html.indexOf('function phase16CRejectUnsafeKeys(');
const guardEnd = html.indexOf('function phase11DownloadSnapshot(', guardStart);
assert(guardStart >= 0 && guardEnd > guardStart, 'Backup key guard and shape validator must exist');
const guardCode = html.slice(guardStart,guardEnd);
const checkStart = html.indexOf('function phase16CCheckBackup(');
const checkEnd = html.indexOf('function importData(',checkStart);
assert(checkStart >= 0 && checkEnd > checkStart, 'Backup validation pipeline must exist');
const context = vm.createContext({
  appState:{devices:[],subnets:[],racks:[],vlans:[],ipAllocations:{}},
  normaliseState:raw=>raw,
  validateApplicationState:()=>[]
});
vm.runInContext(guardCode+'\n'+html.slice(checkStart,checkEnd),context);
const valid = '{"devices":[],"subnets":[],"racks":[],"vlans":[],"ipAllocations":{}}';
assert.equal(context.phase16CCheckBackup(JSON.parse(valid)).devices.length,0,'ordinary backup must pass');
const payloads = [
  '{"__proto__":{"polluted":true},"devices":[],"subnets":[],"racks":[],"vlans":[],"ipAllocations":{}}',
  '{"devices":[{"id":"a","constructor":{"prototype":{"polluted":true}}}],"subnets":[],"racks":[],"vlans":[],"ipAllocations":{}}',
  '{"devices":[],"subnets":[],"racks":[],"vlans":[],"ipAllocations":{"192.168.1.2":{"prototype":{"polluted":true}}}}',
  '{"devices":[],"subnets":[],"racks":[],"vlans":[],"ipAllocations":{},"nested":[{"__proto__":{"polluted":true}}]}'
];
for (const json of payloads) {
  assert.throws(()=>context.phase16CCheckBackup(JSON.parse(json)),/prohibited object property/,'dangerous nested property must be rejected');
}
assert.equal({}.polluted,undefined,'host Object.prototype must not be polluted');
assert.throws(()=>context.phase16CCheckBackup(JSON.parse('{"devices":{},"subnets":[],"racks":[],"vlans":[],"ipAllocations":{}}')),/valid devices array/,'wrong collection type must be rejected');
const tooMany = JSON.parse(valid);
tooMany.devices = Array.from({length:50001},()=>({}));
assert.throws(()=>context.phase16CCheckBackup(tooMany),/too many devices/,'excessive collection must be rejected');
assert.throws(()=>context.phase16CReadJson('{invalid'),/not valid JSON/,'malformed JSON must be rejected');
assert.equal(context.phase16CCheckBackup(JSON.parse(valid)).devices.length,0,'valid backups must still work after rejected payloads');
console.log('PASS: hostile JSON property names, malformed data and oversized collections rejected.');
