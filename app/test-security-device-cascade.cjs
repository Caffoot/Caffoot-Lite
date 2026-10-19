'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, 'caffoot-lite.html'), 'utf8');
const begin = html.indexOf('function phase11DeviceTopBlock(subnet)');
const end = html.indexOf('function handleDeviceSubnetChange()', begin);
assert(begin >= 0 && end > begin, 'Device cascade source boundaries missing');
const escapeBegin = html.indexOf('function escapeHtml(value)');
const escapeEnd = html.indexOf('function inlineJsArg(value)', escapeBegin);
assert(escapeBegin >= 0 && escapeEnd > escapeBegin, 'Production HTML escaping function missing');
const hostile = '"><img src=x onerror=alert(1)>';
const block = {value:'__unassigned__'};
const vlan = {value:'', innerHTML:''};
const subnet = {value:'',innerHTML:'',dataset:{initialSubnet:''}};
const elements = {'dev-block':block,'dev-vlan':vlan,'dev-subnet':subnet};
const ctx = vm.createContext({
  appState:{subnets:[{id:hostile,name:hostile,cidr:'192.168.40.0/24',vlan:hostile,kind:'network'}]},
  document:{getElementById(id){return elements[id] || null;}},
  handleDeviceSubnetChange(){}
});
vm.runInContext(html.slice(escapeBegin,escapeEnd) + '\n' + html.slice(begin,end),ctx);
ctx.phase11DeviceCascade('initial');
assert(vlan.innerHTML.includes('&lt;img'), 'Hostile VLAN value must remain visible as escaped text');
assert(!vlan.innerHTML.includes('<img'), 'Hostile VLAN must not create markup');
vlan.value = hostile;
ctx.phase11DeviceCascade('subnet');
assert(subnet.innerHTML.includes('&lt;img'), 'Hostile subnet name and ID must be escaped');
assert(!subnet.innerHTML.includes('<img'), 'Hostile subnet must not create markup');
assert(!/<(?:img|svg|script)\b/i.test(vlan.innerHTML + subnet.innerHTML), 'Injected executable element leaked into markup');
console.log('PASS: device VLAN/subnet cascade escapes hostile imported identifiers and names.');
