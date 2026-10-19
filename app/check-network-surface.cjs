'use strict';
// Static network-surface regression guard for the production standalone HTML.
// This is not a substitute for runtime network capture or security review.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, 'caffoot-lite.html'), 'utf8');
const count = re => [...html.matchAll(re)].length;
assert.equal(count(/\bfetch\s*\(/g), 1, 'Unexpected fetch call added');
assert.match(html, /fetch\('https:\/\/api\.github\.com\/repos\/caffoot\/Caffoot-Lite\/releases\/latest'\s*,\s*\{[^}]*credentials:\s*'omit'/, 'Update check must use expected GitHub URL without credentials');
for (const [label, re] of [
  ['XMLHttpRequest', /\bXMLHttpRequest\b/g],
  ['WebSocket', /\bWebSocket\b/g],
  ['EventSource', /\bEventSource\b/g],
  ['sendBeacon', /\bsendBeacon\b/g],
  ['eval', /\beval\s*\(/g],
  ['new Function', /\bnew\s+Function\s*\(/g],
  ['dynamic script URL', /document\.createElement\s*\(\s*['"]script['"]\s*\)/g]
]) assert.equal(count(re), 0, 'Unexpected network or code execution surface: ' + label);
console.log('PASS: known outbound network API surface unchanged; only explicit GitHub release check found.');
console.log('NOTE: Review browser traffic and all dynamic HTML sinks separately.');
