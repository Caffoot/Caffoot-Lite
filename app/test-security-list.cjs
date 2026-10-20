'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html=fs.readFileSync(path.join(__dirname,'caffoot-lite.html'),'utf8');
function extract(start,end) {
  const a=html.indexOf(start),b=html.indexOf(end,a);
  assert(a>=0&&b>a,'Production function not found: '+start);
  return html.slice(a,b);
}
const code=extract('function escapeHtml(value)','function renderContent()')+'\n'+
  extract('function renderDevicesHTML()','// --- PHASE 18D: MANAGED TYPES & LOCATIONS ---');
const payloads=[
  '<img src=x onerror=alert(1)>',
  '<svg onload=alert(1)>',
  '</button><script>alert(1)</script>',
  '" autofocus onfocus="alert(1)',
  "' onclick='alert(1)",
  '&lt;img src=x onerror=alert(1)&gt;'
];
for (const payload of payloads) {
  const device={
    id:payload,name:payload,type:payload,location:payload,status:'Active',
    manufacturer:payload,model:payload,serialNumber:payload,notes:payload,
    primaryIp:'',mountType:'Desktop'
  };
  const ctx=vm.createContext({
    appState:{devices:[device],racks:[]},
    phase14DeviceTab:'inventory',deviceIntelligenceTab:'overview',deviceOsFilter:'',deviceServiceFilter:'',deviceMissingFilter:'',deviceHardwareFilter:null,deviceSearchTerm:'',deviceAssignmentFilter:'',deviceTypeFilter:'',
    deviceStatusFilter:'',deviceLocationFilter:'',deviceMountFilter:'',deviceSort:'name-asc',
    getVisibleDevices:()=>[device],
    getUniqueDeviceTypes:()=>[payload],
    getUniqueDeviceLocations:()=>[payload]
  });
  vm.runInContext(code,ctx);
  const result=ctx.renderDevicesHTML();
  const escaped=ctx.escapeHtml(payload);
  assert(result.includes(escaped),'Escaped value must appear in inventory');
  assert(!result.includes(payload),'Raw malicious value must not appear in inventory');
  assert(!/<(?:script|svg|img)\b/i.test(result),'Injected executable elements must not appear');
  assert(result.includes('data-id="'+escaped+'"'),'Device action IDs must be escaped');
  assert(result.includes('aria-label="Actions for '+escaped+'"'),'Action labels must be escaped');
  assert(result.includes('value="'+escaped+'"'),'Filter options must be escaped');
}
console.log('PASS: device inventory, action attributes and filter options escape hostile text.');
