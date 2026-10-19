// v1.2.0 location/rack separation: executable legacy-coupling inventory.
// Run with: node test-location-mounting-contract.cjs
// This is a baseline guard, NOT a passing test of the new behaviour.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, 'caffoot-lite.html'), 'utf8');
const coupling = [
  ['default location sentinel', /deviceLocations:\s*\['Racked',\s*'Unknown'\]/],
  ['forced location in mounting UI', /location\.value\s*=\s*'Racked'/],
  ['disabled location in mounting UI', /location\.disabled\s*=\s*true/],
  ['rack validation requires sentinel', /device\.location\s*!==\s*'Racked'/],
  ['save validation requires sentinel', /location\s*!==\s*'Racked'/],
  ['rack movement overwrites location', /device\.location\s*=\s*'Racked'/],
  ['rack unassignment overwrites location', /device\.location\s*=\s*'Unknown'/],
  ['rack list formats location sentinel', /d\.location\s*===\s*'Racked'/]
];
for (const [name, pattern] of coupling) {
  assert.match(source, pattern, 'Expected baseline legacy coupling: ' + name);
  console.log('BASELINE CONFIRMED: ' + name);
}
console.log('Baseline complete: these assertions document existing coupling, not migration correctness.');
