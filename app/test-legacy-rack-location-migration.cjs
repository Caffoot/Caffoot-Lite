// Focused migration-unit tests. Run: node test-legacy-rack-location-migration.cjs
// Extracts the actual browser function body without executing the full UI.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, 'caffoot-lite.html'), 'utf8');
const start = source.indexOf('        function phase120SeparateLegacyRackLocation(devices) {');
const end = source.indexOf('\n        function normaliseState(raw)', start);
assert.ok(start >= 0 && end > start, 'Migration function is present');
const code = source.slice(start, end);
const migrate = new Function('isPlainObject', code + '\nreturn phase120SeparateLegacyRackLocation;')(
  x => x !== null && typeof x === 'object' && !Array.isArray(x)
);
const original = [
  {id:'a', location:'Racked', mountType:'Rack Mounted', rackId:'rack-1', face:'front', rackUStart:12, rackUEnd:13},
  {id:'b', location:'London Office', mountType:'Rack Mounted', rackId:'rack-2', rackUStart:3},
  {id:'c', location:'Racked', mountType:'Desktop'},
  {id:'d', location:'Unknown', mountType:'Desktop'}
];
const snapshot = JSON.stringify(original);
const result = migrate(original);
assert.equal(result[0].location, 'Unknown');
assert.equal(result[0].rackId, 'rack-1');
assert.equal(result[0].rackUStart, 12);
assert.equal(result[0].rackUEnd, 13);
assert.equal(result[1].location, 'London Office');
assert.equal(result[2].location, 'Racked'); // inconsistent non-rack legacy data: no silent repair
assert.equal(result[3].location, 'Unknown');
assert.equal(JSON.stringify(original), snapshot, 'Source records must not mutate');
assert.deepEqual(migrate(result), result, 'Migration must be idempotent');
assert.throws(() => migrate({}), /array/);
assert.throws(() => migrate([null]), /Invalid device/);
console.log('PASS: legacy rack migration preserves placement, locations, source data and idempotence.');
