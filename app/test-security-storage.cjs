'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, 'caffoot-lite.html'), 'utf8');
function extract(start, end) {
  const a = html.indexOf(start), b = html.indexOf(end, a);
  assert(a >= 0 && b > a, 'Expected production source: ' + start);
  return html.slice(a, b);
}
const loader = extract('function loadStoredState()', 'let appState = loadStoredState();');
const guard = extract('function rejectUnsafeBackupKeys(', 'function validateBackupStructure(');
function run(json) {
  const store = new Map([['caffoot_state', json]]);
  const context = vm.createContext({
    STORAGE_KEY: 'caffoot_state',
    localStorage: { getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value) },
    cloneDefaultData: () => ({devices:[],subnets:[],racks:[],ipAllocations:{}, defaultState:true}),
    isPlainObject: value => value !== null && typeof value === 'object' && !Array.isArray(value),
    normaliseState: value => value,
    console: {error: () => {}}
  });
  vm.runInContext('let storageRecoveryFailure = null;\n' + loader + '\n' + guard + '\n' +
    'globalThis.testResult = loadStoredState(); globalThis.testRecovery = storageRecoveryFailure;', context);
  return {result:context.testResult, recovery:context.testRecovery, stored:store.get('caffoot_state')};
}
const valid = '{"devices":[{"id":"legacy","name":"Legacy"}],"subnets":[],"racks":[],"ipAllocations":{}}';
const ok = run(valid);
assert.equal(ok.result.devices[0].id, 'legacy');
assert.equal(ok.recovery, null);
assert.equal(ok.stored, valid);
for (const malicious of [
  '{"__proto__":{"polluted":true},"devices":[],"subnets":[],"racks":[],"ipAllocations":{}}',
  '{"devices":[{"id":"x","constructor":{"prototype":{"polluted":true}}}],"subnets":[],"racks":[],"ipAllocations":{}}',
  '{"devices":[],"subnets":[],"racks":[],"ipAllocations":{},"extra":[{"prototype":{"polluted":true}}]}'
]) {
  const blocked = run(malicious);
  assert.equal(blocked.result.defaultState, true, 'unsafe stored inventory must not activate');
  assert.match(blocked.recovery.reason, /prohibited object property/);
  assert.equal(blocked.recovery.raw, malicious, 'original must be retained for recovery');
  assert.equal(blocked.stored, malicious, 'stored bytes must remain unchanged');
}
assert.equal({}.polluted, undefined);
console.log('PASS: stored inventory rejects unsafe keys and preserves original recovery data.');
