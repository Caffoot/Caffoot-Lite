'use strict';
// Conservative release privacy gate. This checks tracked paths and intended ZIP inputs;
// it does not replace a full Git history/secret audit or manual artifact inspection.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const tracked = spawnSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' });
if (tracked.error || tracked.status !== 0) {
  throw new Error('Git tracked-file inventory unavailable; run from a Git checkout (not a release ZIP).');
}
const names = tracked.stdout.split('\0').filter(Boolean).map(x => x.replace(/\\/g, '/'));
const prohibited = [
  /(^|\/)\.env(?:\.|$)/i, /(^|\/)id_(?:rsa|ed25519)(?:\.|$)/i,
  /\.(?:pem|p12|pfx|key)$/i, /(^|\/)(?:private|secrets?)(?:\/|\.)/i,
  /(?:dummy.*generator|generated.*inventory|test.*inventory|caffoot-test-.*\.json)/i,
  /\.(?:zip|bak|tmp)$/i
];
const exceptions = new Set(['app/fixtures/lite-schema-v1.example.json', 'app/fixtures/lite-legacy.example.json']);
const bad = names.filter(n => !exceptions.has(n) && prohibited.some(re => re.test(n)));
assert.deepEqual(bad, [], 'Potentially sensitive or generated tracked files: ' + bad.join(', '));
const fixtures = [...exceptions];
for (const name of fixtures) {
  assert(names.includes(name), 'Reviewed compatibility fixture missing: ' + name);
  const value = JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
  assert(Array.isArray(value.devices) && value.devices.length === 2, 'Unexpected fixture device count: ' + name);
  assert(value.devices.every(d => /^Example (server|desktop)$/.test(d.name)), 'Non-example device in fixture: ' + name);
  assert(value.subnets.every(s => s.cidr === '192.168.40.0/24'), 'Unexpected fixture subnet: ' + name);
}
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
assert(pkg.private === true, 'Build package must remain private');
console.log('PASS: tracked file path privacy gate, explicit fictional fixtures, and private build package.');
console.log('NOTE: Git history, secrets in file contents, and final ZIP/HTML still require separate review.');
