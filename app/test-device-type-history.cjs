'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = fs.readFileSync(__dirname + '/caffoot-lite.html', 'utf8');

// Existing inventories may contain earlier device types. Keep their snapshots
// visible without permitting them to overwrite a device's current identity.
for (const token of [
  'Previous Device Type Details',
  'Device identity cannot be changed. Create a new device instead.',
  'type !== originalDevice.type',
  'isVirtualServer !== (originalDevice.isVirtual === true',
  'const historicalSnapshots = Array.isArray(d.previousTypeDetails)',
  'Object.entries(snapshot.details||{})',
  'selectDeviceDetailsTab',
  'Legacy device-type configurations remain visible as read-only history.'
]) assert.ok(source.includes(token), 'Missing read-only device history contract: ' + token);
for (const token of [
  'data-action="phase130-restore"',
  'phase130RestoreHistory(',
  'phase130ConfirmRestore(',
  'phase130ResolveRestore(',
  "case 'phase130-restore-accept':",
  "case 'phase130-restore-cancel':"
]) assert.ok(!source.includes(token), 'Unexpected historical restoration pathway: ' + token);
console.log('PASS: immutable device identity, visible legacy snapshots and read-only device history source contracts.');
