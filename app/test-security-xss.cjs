'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, 'caffoot-lite.html'), 'utf8');
function extract(from,to) {
  const start=html.indexOf(from), end=html.indexOf(to,start);
  assert(start>=0 && end>start,'Expected production function boundaries: '+from);
  return html.slice(start,end);
}
const escapeSource=extract('function escapeHtml(value)','function renderContent()');
const viewSource=extract('function phase14CViewDevice(deviceId)','function phase14CGoToRack(');
const payloads=[
  '<img src=x onerror=alert(1)>',
  '<svg onload=alert(1)>',
  '</p><script>alert(1)</script><p>',
  '" autofocus onfocus="alert(1)',
  "' onclick='alert(1)",
  '&lt;script&gt;alert(1)&lt;/script&gt;'
];
for (const payload of payloads) {
  const device={
    id:payload,name:payload,type:payload,location:payload,status:payload,
    manufacturer:payload,model:payload,serialNumber:payload,notes:payload,
    primaryIp:'',mountType:'Desktop'
  };
  let rendered='';
  const context=vm.createContext({
    appState:{devices:[device],racks:[]},
    getSubnetForIp:()=>null,
    phase120SoftwareOptions:()=>[],
    phase19BSoftware:()=>[],
    phase120AvailableServerServices:()=>[],
    phase19BServerFunctions:()=>[],
    phase19CDetailRows:()=>'', phase19BFieldsFor:()=>[],
    phase19BTypeGroups:{}, phase19CDetailLabel:key=>key,
    openModal:value=>{rendered=value;},
    showToast:()=>{throw Error('Device unexpectedly not found');}
  });
  vm.runInContext(escapeSource+'\n'+viewSource,context);
  const encoded=context.escapeHtml(payload);
  assert(!encoded.includes('<') && !encoded.includes('>'),'Angle brackets must be escaped');
  assert(!encoded.includes('"') && !encoded.includes("'"),'Quotes must be escaped');
  context.phase14CViewDevice(payload);
  assert(rendered.includes(encoded),'Payload must be visible as escaped text');
  assert(!rendered.includes(payload),'Raw payload must never reach device details HTML');
  assert(!/<(?:script|svg|img)\b/i.test(rendered),'No injected executable elements');
  assert(!/<[^>]*\s(?:onerror|onload|onfocus)\s*=\s*["']/i.test(rendered),'No quoted event-handler attributes in rendered tags');
  assert(rendered.includes('data-id="'+encoded+'"'),'Injected device ID must be attribute-escaped');
}
console.log('PASS: production device detail renderer escapes hostile HTML and attribute payloads.');
