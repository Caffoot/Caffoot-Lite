'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, 'caffoot-lite.html'), 'utf8');
const start = html.indexOf('function renderRacksHTML()');
const end = html.indexOf('function changeRack(id)', start);
assert(start >= 0 && end > start, 'Production rack renderer must exist');
const renderer = html.slice(start,end);
const checks = [
  ['rack name heading', '${escapeHtml(currentRack.name)}'],
  ['rack location', "escapeHtml(currentRack.location||'Not set')"],
  ['rack selector label', '${escapeHtml(r.name)}'],
  ['rack selector ID', 'value="${escapeHtml(r.id)}"'],
  ['rack edit ID', 'data-id="${escapeHtml(currentRack.id)}"'],
  ['rack drop ID', 'data-rack-drop-id="${escapeHtml(currentRack.id)}"'],
  ['device label', '${escapeHtml(dev.name)}'],
  ['device type in tooltip', '${escapeHtml(dev.type)}'],
  ['device IP in tooltip', "escapeHtml(dev.primaryIp||'No IP')"],
  ['device drag ID', 'data-rack-device="${escapeHtml(dev.id)}"'],
  ['device action ID', 'data-id="${escapeHtml(dev.id)}"'],
  ['device name in equipment table', '${escapeHtml(d.name)}'],
  ['accessory name', 'escapeHtml(a.name||kind.label)'],
  ['accessory drag ID', 'data-rack-accessory="${escapeHtml(a.id)}"'],
  ['accessory action ID', 'data-id="${escapeHtml(a.id)}"'],
  ['accessory name in equipment list', "escapeHtml(a.name||phase13CAccessoryTypes[a.type]?.label||'Accessory')"]
];
for (const [label,pattern] of checks)
  assert(renderer.includes(pattern), 'Missing rack output-encoding guard: '+label);
const encoderStart=html.indexOf('function escapeHtml(value)');
const encoderEnd=html.indexOf('function inlineJsArg(value)',encoderStart);
assert(encoderStart>=0&&encoderEnd>encoderStart,'Production encoder must exist');
const vm=require('node:vm');
const ctx=vm.createContext({});
vm.runInContext(html.slice(encoderStart,encoderEnd),ctx);
for (const value of [
  '<img src=x onerror=alert(1)>',
  '<svg onload=alert(1)>',
  '</button><script>alert(1)</script>',
  '" onfocus="alert(1)',
  "' onclick='alert(1)",
  '&lt;svg onload=alert(1)&gt;'
]) {
  const escaped=ctx.escapeHtml(value);
  assert(!/[<>"']/.test(escaped),'Rack text encoder must escape markup and quotes');
  assert(!escaped.includes(value),'Hostile rack input must not remain raw');
}
console.log('PASS: rack names, device labels, accessories and action attributes have output-encoding guards.');
