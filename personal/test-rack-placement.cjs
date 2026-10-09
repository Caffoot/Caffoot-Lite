'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, 'caffoot-personal.html'), 'utf8');
function extract(name, next) {
  const start = html.indexOf('function ' + name + '(');
  const end = html.indexOf('function ' + next + '(', start + 1);
  assert(start >= 0 && end > start, 'Cannot extract ' + name);
  return html.slice(start, end);
}
const state = {
  racks: [{id:'r1',heightU:12}],
  devices: [{id:'d1',rackId:'r1',face:'front',rackUStart:3,rackUEnd:4}],
  rackAccessories: [{id:'a1',rackId:'r1',face:'front',startU:7,heightU:2}]
};
const ctx = vm.createContext({appState:state});
vm.runInContext(extract('validateRackPlacement','showToast'), ctx);
const place = (id,face,start,end) => ctx.validateRackPlacement(id,'r1',face,start,end);
assert.match(place('d2','front',4,5), /overlap/i, 'Same-face device collision must fail');
assert.equal(place('d2','rear',4,5), null, 'Opposite face may use same U');
assert.match(place('d2','front',8,9), /accessory/i, 'Accessory collision must fail');
assert.match(place('d2','front',12,13), /between U1/i, 'Rack boundary must be enforced');
assert.equal(place('d1','front',3,4), null, 'Moving device must ignore its own previous position');
assert.equal(place('d2','front',9,10), null, 'Free positions must be allowed');
vm.runInContext(extract('phase13CAccessoryError','phase13COpenAccessory'), ctx);
const accessory = (id,face,start,height) => ctx.phase13CAccessoryError({id,rackId:'r1',face,startU:start,heightU:height},id);
assert.match(accessory('a2','front',4,1), /device/i, 'Accessory cannot overlap device');
assert.match(accessory('a2','front',8,1), /accessory/i, 'Accessory cannot overlap accessory');
assert.equal(accessory('a2','rear',8,1), null, 'Rear accessory may share front U');
assert.match(accessory('a2','front',12,2), /fit within/i, 'Accessory must fit rack');
assert.equal(accessory('a1','front',7,2), null, 'Editing accessory may retain own U');
console.log('PASS: executable rack device/accessory collision and boundary tests.');
