'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'caffoot-lite.html'),'utf8');
const start=html.indexOf('function renderDashboardHTML()');
const end=html.indexOf('function getCategoryIcon(type)',start);
assert(start>=0&&end>start,'Production dashboard renderer must exist');
const renderer=html.slice(start,end);
const checks=[
  ['recent device name','escapeHtml(device.name)'],
  ['recent device type',"escapeHtml(device.type || 'Device')"],
  ['recent device IP',"escapeHtml(device.primaryIp || 'No primary IP')"],
  ['rack name','escapeHtml(rack.name)'],
  ['rack selection ID','data-id="${escapeHtml(rack.id)}"'],
  ['subnet name','escapeHtml(subnet.name)'],
  ['subnet CIDR','escapeHtml(subnet.cidr)'],
  ['subnet VLAN','escapeHtml(subnet.vlan)'],
  ['device type category','escapeHtml(type)'],
  ['chart type name','escapeHtml(name)'],
  ['activity reason',"escapeHtml(entry.reason || 'Inventory saved')"],
  ['activity change label',"escapeHtml(change.label || '')"],
  ['alert text','escapeHtml(alert.text)'],
  ['alert action device ID',"data-device-id=\"${escapeHtml(String(alert.deviceId || ''))}\""],
  ['alert action rack ID',"data-rack-id=\"${escapeHtml(String(alert.rackId || ''))}\""],
  ['data integrity error','escapeHtml(error)']
];
for(const [label,pattern] of checks)
  assert(renderer.includes(pattern),'Missing dashboard output-encoding guard: '+label);
const a=html.indexOf('function escapeHtml(value)');
const b=html.indexOf('function inlineJsArg(value)',a);
assert(a>=0&&b>a,'Production HTML encoder must exist');
const ctx=vm.createContext({});
vm.runInContext(html.slice(a,b),ctx);
for(const payload of [
  '<img src=x onerror=alert(1)>',
  '<svg onload=alert(1)>',
  '</button><script>alert(1)</script>',
  '" onfocus="alert(1)',
  "' onclick='alert(1)",
  '&lt;script&gt;alert(1)&lt;/script&gt;'
]){
  const encoded=ctx.escapeHtml(payload);
  assert(!/[<>"']/.test(encoded),'HTML encoder must escape markup and quotes');
  assert(!encoded.includes(payload),'Dashboard hostile payload must not remain raw');
}
console.log('PASS: dashboard inventory, activity, alert and integrity output-encoding guards.');
