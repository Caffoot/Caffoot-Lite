// v1.2.0 location/rack separation contract. Run: node test-location-mounting-contract.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, 'caffoot-lite.html'), 'utf8');
assert.match(source, /devices: phase120SeparateLegacyRackLocation\(raw\.devices\)/, 'Legacy devices normalized on load/import');
assert.match(source, /deviceLocations: \['Unknown'\]/, 'Racked no longer default location');
assert.doesNotMatch(source, /location\.value\s*=\s*'Racked'/, 'Mounting must not force location');
assert.doesNotMatch(source, /location\.disabled\s*=\s*true/, 'Mounting must not disable location');
assert.doesNotMatch(source, /device\.location\s*=\s*'Racked'/, 'Rack moves must not overwrite location');
assert.doesNotMatch(source, /device\.mountType\s*!==\s*'Rack Mounted'\s*\|\|\s*device\.location\s*!==\s*'Racked'/, 'Rack validation must not require sentinel');
assert.match(source, /if \(!location \|\| location === 'Racked'\)/, 'Save rejects obsolete location sentinel');
console.log('PASS: location/rack separation source contract.');
