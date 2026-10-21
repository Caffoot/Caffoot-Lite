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
// v1.2.0 physical-server mounting and backwards-compatibility regression checks.
const allowedMounts = source.match(/function phase19BAllowedMounts\(type\)\s*\{([\s\S]*?)\n\s*\}/)?.[1] || '';
const suggestedMounts = source.match(/function phase120SuggestedMounts\(type\)\s*\{([\s\S]*?)\n\s*\}/)?.[1] || '';
assert.match(allowedMounts, /'Floor Standing'/, 'Historical Floor Standing mounting remains supported');
assert.match(allowedMounts, /'Tower \/ Floor Standing'/, 'Tower mounting passes validation');
assert.match(suggestedMounts, /normalized==='server'\|\|normalized==='server - physical'\|\|normalized==='physical server'/, 'Physical server types use dedicated mounting suggestions');
assert.match(suggestedMounts, /\['Rack Mounted','Tower \/ Floor Standing','Tabletop \/ Shelf Mounted','Unknown'\]/, 'Physical servers offer tower mounting');
assert.match(allowedMounts, /'Shelf Mounted'/, 'Legacy Shelf Mounted selections remain valid');
assert.doesNotMatch(suggestedMounts, /,'Shelf Mounted'/, 'Duplicate Shelf Mounted suggestion is removed');
assert.match(source, /if \(mountType === 'Rack Mounted'\)\s*\{/, 'Rack-specific save requirements remain conditional');
console.log('PASS: location/rack separation and tower-server mounting source contracts.');
