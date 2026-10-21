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
  'activeFields.has(x.key)'
]) assert.ok(source.includes(token), 'Missing device type history contract: ' + token);
console.log('PASS: device type conversion archives incompatible fields and separates active details.');
