'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = fs.readFileSync(__dirname + '/caffoot-lite.html', 'utf8');
for (const token of [
  'Previous Device Type Details',
  'Device identity cannot be changed. Create a new device instead.',
  'type !== originalDevice.type',
  'isVirtualServer !== (originalDevice.isVirtual === true',
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
console.log('PASS: immutable device identity and legacy type history restore source contracts, including save rollback.');
