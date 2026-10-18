'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, 'caffoot-lite.html'), 'utf8');
const start = html.indexOf('function renderIpamHTML()');
const end = html.indexOf('function changeSubnet(id)', start);
assert(start >= 0 && end > start, 'IPAM production renderer must exist');
const renderer = html.slice(start,end);
const requiredEscapes = [
  ['IPAM allocation hostname', "escapeHtml(alloc.hostname || 'Assigned IP')"],
  ['reserved device name', 'escapeHtml(reservedDevice.name)'],
  ['VLAN name text', '${escapeHtml(v.name)}'],
  ['VLAN description text', "escapeHtml(v.description || 'No description')"],
  ['VLAN name displayed in text content', '<h5 class="font-bold text-sm text-slate-900 dark:text-white mt-2">${escapeHtml(v.name)}</h5>'],
  ['VLAN edit action uses stable escaped record ID', 'data-action="open-subnet-by-vlan" data-id="${escapeHtml(v.id)}"'],
  ['VLAN ID action attribute', 'data-id="${escapeHtml(v.id)}"'],
  ['subnet ID selection attribute', 'value="${escapeHtml(s.id)}"'],
  ['subnet name in selection', 'escapeHtml(s.name)'],
  ['subnet name in overview', 'escapeHtml(subnet.name)'],
  ['subnet description in overview', "escapeHtml(subnet.description || 'No description')"],
  ['IPAM search field attribute', 'value="${escapeHtml(ipamAddressSearch)}"'],
  ['IPAM address action attribute', 'data-ip="${escapeHtml(ip)}"']
];
for (const [label,pattern] of requiredEscapes)
  assert(renderer.includes(pattern),'Missing output encoding for '+label);
const escapeStart = html.indexOf('function escapeHtml(value)');
const escapeEnd = html.indexOf('function inlineJsArg(value)',escapeStart);
assert(escapeStart>=0 && escapeEnd>escapeStart,'Shared HTML encoder must exist');
const vm = require('node:vm');
const ctx = vm.createContext({});
vm.runInContext(html.slice(escapeStart,escapeEnd),ctx);
for (const input of [
  '<img src=x onerror=alert(1)>',
  '<svg onload=alert(1)>',
  '</option><script>alert(1)</script>',
  '" autofocus onfocus="alert(1)',
  "' onclick='alert(1)",
  '&lt;script&gt;alert(1)&lt;/script&gt;'
]) {
  const escaped = ctx.escapeHtml(input);
  assert(!/[<>"']/.test(escaped),'HTML encoder must escape markup and quotes');
  assert(!escaped.includes(input),'Hostile input must not remain raw');
}
console.log('PASS: IPAM/subnet output-encoding contracts and hostile text escaping.');
