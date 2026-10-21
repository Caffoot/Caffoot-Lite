'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = fs.readFileSync(__dirname + '/caffoot-lite.html', 'utf8');
for (const token of [
  'function phase130ObsoleteDeviceFields(',
  'conversionSnapshot = {type:existingDevice.type',
  'existingDevice.previousTypeDetails =',
  'Previous Device Type Details',
  'Preserve History &amp; Save',
  'const historical = [];',
  'activeFields.has(x.key)',
  "if(document.getElementById('phase130-restore-dialog')){phase130ResolveRestore(false);return;}",
  'phase130ConfirmRestore(description)',
  "case 'phase130-restore-cancel': phase130ResolveRestore(false)",
  "case 'phase130-restore-accept': phase130ResolveRestore(true)",
  'Number.isInteger(index)',
  'const nextHistory = entries.slice();',
  'if (!saveState()) {',
  'appState = JSON.parse(before);'
]) assert.ok(source.includes(token), 'Missing device type history contract: ' + token);
console.log('PASS: device type history and restore source contracts, including retained snapshots and save rollback.');
