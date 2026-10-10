'use strict';
// Run: node app/check-offline.cjs
// Dependency audit only: it does not modify the application or user data.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const html = fs.readFileSync(path.join(__dirname, 'caffoot-lite.html'), 'utf8');
const resources = [...html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)=["'](https?:\/\/[^"']+)["'][^>]*>/gi)]
  .map(match => match[1]);
const unique = [...new Set(resources)];
console.log('Caffoot Lite external runtime dependencies:');
for (const url of unique) console.log(' - ' + url);
console.log('External resource count: ' + unique.length);
assert.match(html, /<title>Caffoot Lite/);
assert.match(html, /caffoot_state/, 'New Caffoot storage key missing');
if (unique.length) {
  console.error('NOT OFFLINE READY: Bundle or replace these resources before release.');
  process.exitCode = 1;
} else {
  console.log('No remote script or stylesheet references found. Browser regression testing is still required.');
}
