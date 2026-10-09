'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, 'caffoot-personal.html'), 'utf8');
const start = html.indexOf('const defaultData = {');
const end = html.indexOf('const STATE_VERSION', start);
assert(start >= 0 && end > start, 'starter inventory block must exist');
const source = html.slice(start, end);
const defaults = vm.runInNewContext(source.replace(/^const defaultData = /, '(').replace(/;\s*$/, ')'));
for (const name of ['devices','subnets','vlans','racks','rackAccessories']) {
  assert.equal(defaults[name].length, 0, name + ' must start empty');
}
assert.equal(Object.keys(defaults.ipAllocations).length, 0, 'IP allocations must start empty');
for (const type of ['Server - Physical','Server - Virtual','Access Point']) {
  assert(defaults.deviceTypes.includes(type), 'missing device type ' + type);
}
for (const type of ['Server','AP','Access point']) {
  assert(!defaults.deviceTypes.includes(type), 'obsolete default device type ' + type);
}
assert(!html.includes('data-tab="diagnostics"'), 'diagnostics must not appear in navigation');
assert(!html.includes('function diagnosticTests()'), 'obsolete diagnostic tests must be removed');
assert(!html.includes('function renderDiagnosticsHTML()'), 'obsolete diagnostics view must be removed');
assert(!html.includes("case 'run-diagnostics':"), 'obsolete diagnostics handler must be removed');
assert(/personalSafeStorageGet\(SAFETY_SNAPSHOT_KEY\)\?'':'disabled'\)\)\s*\+\s*panel\('Danger zone/.test(html), 'Danger zone must be concatenated into Data Management HTML');
assert(html.includes("case 'phase16a-clear-system': phase16AClearSystem();"), 'Clear system action must be wired');
assert(html.includes('function phase16AClearSystem()'), 'Clear system handler must exist');
assert(html.includes('localStorage.setItem(SAFETY_SNAPSHOT_KEY, snapshot)'), 'Clear system must create recovery snapshot');
assert(html.includes('const candidate = phase16CCheckBackup(cloneDefaultData())'), 'Clear system must validate clean starter data');
assert(html.includes('function suggestSubnetGateway()'), 'Automatic gateway suggestion must remain');
assert(html.includes("event.target.id === 'sub-cidr'"), 'CIDR input must trigger automatic gateway suggestion');
assert(html.includes("event.target.id === 'sub-gw'"), 'Manual gateway edits must be preserved');
assert(html.includes('id="sub-gw-hint"'), 'Gateway suggestion must be visible in Add Subnet');
assert(html.includes('function subnetCidrFeedback(value)'), 'CIDR validation feedback helper must remain');
assert(html.includes('Not a /'), 'Misaligned network boundary must be explained');
assert(html.includes('Did you mean '), 'Network boundary error must suggest correct CIDR');
assert(html.includes('aria-invalid'), 'Invalid CIDR must be announced accessibly');
assert(html.includes('Caffoot Lite supports subnet sizes /23 through /30.'), 'Unsupported prefix must be explained');
assert(html.includes("if (!subnet) suggestSubnetGateway();"), 'New subnet modal must initialize gateway suggestion');
assert(html.includes("form.dataset.subnetId"), 'Existing subnet gateways must not be automatically replaced');
assert(html.includes('function phase11CPlan('), 'IPAM repair planner must remain');
assert(html.includes('...phase19BSoftwareFields()'), 'computer software options must be rendered');
assert(html.includes('...phase19BServerFunctionFields()'), 'server feature options must be rendered');
assert(html.includes("if(!phase11BCommitDelete(before,'Subnet')) { selectedSubnetId=previousSelection; renderContent(); }"), 'failed subnet deletion must restore selected subnet');
assert(html.includes("if(!phase11BCommitDelete(before,'Rack')) { selectedRackId=previousSelection; renderContent(); }"), 'failed rack deletion must restore selected rack');
assert(html.includes('function phase11CApplyRepair('), 'IPAM repair commit must remain');
assert(!html.includes("case 'tab-diagnostics':"), 'diagnostics action must be removed');
assert(html.includes('data-action="phase19b-manage-functions"'), 'server options manager must be accessible');
assert(html.includes('data-device-panel="manage"'), 'Devices management workspace must remain');
assert(html.includes('>Manage server options</button>'), 'server options manager must be in Devices');
assert(html.includes('>Manage software options</button>'), 'software options manager must be in Devices');
assert(!html.includes("button('phase19b-manage-functions','Manage Server Options'"), 'server options manager must not appear in Settings maintenance');
assert(html.includes('data-action="phase19b-manage-software"'), 'software options manager must be accessible');
assert(html.includes("localStorage.getItem('netmini_state')"), 'saved-data compatibility key must remain');
assert(html.includes('function phase17ARecoveryBanner()'), 'recovery banner must remain');
assert(html.includes('Caffoot Lite recovery mode'), 'recovery banner must use Lite branding');
assert(html.includes("panel('About Caffoot Lite'"), 'About panel must remain');
assert(!html.includes("panel('Application version'"), 'redundant application version panel must stay removed');
assert(html.includes('Reset to empty inventory'), 'recovery reset must describe empty inventory');
assert(!html.includes('Reset to sample inventory'), 'obsolete sample inventory label must be removed');
assert(html.includes('function personalSafeStorageGet(key)'), 'safe optional storage helper must remain');
assert(html.includes("html { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; }"), 'native typography stack must remain');
assert(!html.includes('font-family: Inter,'), 'unbundled Inter must not be preferred');
const restoreStart = html.indexOf('function importData(event)');
const restoreEnd = html.indexOf("document.addEventListener('submit'", restoreStart);
assert(restoreStart >= 0 && restoreEnd > restoreStart, 'backup restore handler must exist');
const restoreCode = html.slice(restoreStart, restoreEnd);
assert(restoreCode.includes('const original = appState;'), 'restore must capture original inventory for rollback');
assert(restoreCode.indexOf('const original = appState;') < restoreCode.indexOf('JSON.stringify(original)'), 'original inventory must be captured before snapshot fallback');
assert(restoreCode.includes('appState = original;'), 'restore failure must revert in-memory inventory');
assert(restoreCode.includes('Rollback verification failed'), 'failed persistence rollback must be verified');
assert(restoreCode.includes('Safety snapshot verification failed'), 'pre-restore safety snapshot must be verified');

assert(html.includes('rack?.heightU ?? rack?.height ?? rack?.size ?? rack?.totalU ?? 0'), 'duplicate placement must respect rack heightU');
assert(!html.includes('rack?.height || rack?.size || rack?.totalU || 48'), 'duplicate placement must not assume a 48U rack');

const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
assert(scripts.length > 0, 'inline application scripts missing');
for (const [index, script] of scripts.entries()) new vm.Script(script[1], { filename: 'source-script-' + index + '.js' });

/*
 * Execute the real production IPAM helpers in an isolated VM. No browser
 * storage or user inventory is accessed by these fixtures.
 */
const helperStart = html.indexOf('function getDeviceById(');
const helperEnd = html.indexOf('function validateRackPlacement(', helperStart);
assert(helperStart >= 0 && helperEnd > helperStart, 'device/IPAM helpers must exist');
const ipamContext = {
  appState: {
    subnets: [{ id: 'test-subnet', cidr: '192.168.40.0/24' }],
    devices: [],
    ipAllocations: {}
  },
  ipBelongsToSubnet(ip, cidr) {
    const [network, prefix] = cidr.split('/');
    assert.equal(prefix, '24');
    return ip.split('.').slice(0, 3).join('.') === network.split('.').slice(0, 3).join('.');
  }
};
vm.createContext(ipamContext);
vm.runInContext(html.slice(helperStart, helperEnd), ipamContext);
const { appState: state } = ipamContext;
const a = { id: 'test-a', name: 'server-a', notes: 'Original notes', primaryIp: '', ipReserved: false };
const b = { id: 'test-b', name: 'server-b', notes: '', primaryIp: '', ipReserved: false };
state.devices.push(a, b);
ipamContext.setDevicePrimaryIp(a, '192.168.40.10');
assert.equal(state.ipAllocations['192.168.40.10'].deviceId, a.id, 'new device must own allocation');
a.name = 'renamed-server';
a.notes = 'Updated notes';
ipamContext.syncDeviceIpamRecord(a);
assert.equal(state.ipAllocations['192.168.40.10'].hostname, 'renamed-server', 'rename sync');
assert.equal(state.ipAllocations['192.168.40.10'].notes, 'Updated notes', 'notes sync');
ipamContext.setDevicePrimaryIp(a, '192.168.40.11');
assert.equal(state.ipAllocations['192.168.40.10'], undefined, 'old IP must be released');
assert.equal(state.ipAllocations['192.168.40.11'].deviceId, a.id, 'new IP must be owned');
assert.throws(() => ipamContext.setDevicePrimaryIp(b, '192.168.40.11'), /already assigned/, 'duplicate IP blocked');
assert.throws(() => ipamContext.setDevicePrimaryIp(b, '10.10.10.5'), /not in a configured subnet/, 'outside subnet blocked');
assert.equal(b.primaryIp, '', 'rejected changes must not mutate device');
state.ipAllocations['192.168.40.12'] = { status: 'Reserved', deviceId: '', hostname: 'held' };
assert.throws(() => ipamContext.setDevicePrimaryIp(b, '192.168.40.12'), /already reserved/, 'reserved IP blocked');
state.ipAllocations['192.168.40.13'] = { status: 'Assigned', deviceId: 'unknown-owner' };
assert.throws(() => ipamContext.setDevicePrimaryIp(b, '192.168.40.13'), /linked to another device/, 'orphaned ownership blocked');
a.ipReserved = true;
ipamContext.syncDeviceIpamRecord(a);
assert.equal(state.ipAllocations['192.168.40.11'].status, 'Reserved', 'reservation flag sync');
ipamContext.setDevicePrimaryIp(a, '');
assert.equal(state.ipAllocations['192.168.40.11'], undefined, 'clearing primary IP releases allocation');
console.log('Device/IPAM runtime fixtures passed.');

const rackValidatorStart = html.indexOf('function validateRackPlacement(');
const rackValidatorEnd = html.indexOf('function showToast(', rackValidatorStart);
assert(rackValidatorStart >= 0 && rackValidatorEnd > rackValidatorStart, 'rack placement validator must exist');
const rackContext = {
  appState: {
    racks: [{ id: 'rack-a', heightU: 12 }],
    devices: [],
    rackAccessories: [{ rackId: 'rack-a', face: 'front', startU: '3', heightU: '2' }]
  }
};
vm.createContext(rackContext);
vm.runInContext(html.slice(rackValidatorStart, rackValidatorEnd), rackContext);
assert.match(rackContext.validateRackPlacement('new-device', 'rack-a', 'front', 4, 4), /overlaps a rack accessory/, 'string-valued accessory U range must block collisions');
assert.equal(rackContext.validateRackPlacement('new-device', 'rack-a', 'front', 5, 5), null, 'next free U must remain available');
assert.equal(rackContext.validateRackPlacement('new-device', 'rack-a', 'rear', 4, 4), null, 'opposite rack face remains available');
console.log('Rack accessory placement fixtures passed.');



const deleteStart = html.indexOf('function deleteDevice(');
const deleteEnd = html.indexOf('// Phase 16B:', deleteStart);
const commitStart = html.indexOf('function phase11BCommitDelete(');
const commitEnd = html.indexOf('function deleteSubnet(', commitStart);
assert(deleteStart >= 0 && deleteEnd > deleteStart, 'device deletion function must exist');
assert(commitStart >= 0 && commitEnd > commitStart, 'transactional deletion helper must exist');
let allowSave = true;
let renderCount = 0;
let lastToast = '';
const deletionContext = {
  appState: {
    devices: [{ id: 'dev-1', name: 'device-one', primaryIp: '192.168.40.20', rackId: 'rack-1' },
              { id: 'dev-2', name: 'device-two', primaryIp: '192.168.40.21' }],
    ipAllocations: {
      '192.168.40.20': { deviceId: 'dev-1', status: 'Assigned' },
      '192.168.40.21': { deviceId: 'dev-2', status: 'Assigned', reservedForDeviceId: 'dev-1' },
      '192.168.40.22': { status: 'Reserved', reservedForDeviceId: 'dev-1' }
    }
  },
  confirm: () => true,
  saveState: () => allowSave,
  renderContent: () => { renderCount++; },
  showToast: msg => { lastToast = msg; }
};
vm.createContext(deletionContext);
vm.runInContext(html.slice(commitStart, commitEnd) + '\n' + html.slice(deleteStart, deleteEnd), deletionContext);
deletionContext.getDeviceById = id => deletionContext.appState.devices.find(d => d.id === id);
const initialDeletionState = JSON.stringify(deletionContext.appState);
deletionContext.deleteDevice('dev-1');
assert.equal(deletionContext.appState.devices.length, 1, 'deleted device removed');
assert.equal(deletionContext.appState.ipAllocations['192.168.40.20'], undefined, 'owned allocation removed');
assert.equal(deletionContext.appState.ipAllocations['192.168.40.21'].deviceId, 'dev-2', 'other device allocation preserved');
assert.equal(deletionContext.appState.ipAllocations['192.168.40.21'].reservedForDeviceId, '', 'reservation reference cleared');
assert.equal(deletionContext.appState.ipAllocations['192.168.40.22'].reservedForDeviceId, '', 'unowned reservation reference cleared');
assert(renderCount > 0, 'successful deletion re-renders');
deletionContext.appState = JSON.parse(initialDeletionState);
allowSave = false;
deletionContext.deleteDevice('dev-1');
assert.equal(JSON.stringify(deletionContext.appState), initialDeletionState, 'failed deletion restores complete original state');
assert.match(lastToast, /not deleted/, 'failed deletion reports error');
console.log('Device deletion and rollback fixtures passed.');

const shapeStart = html.indexOf('function phase11ValidateBackupShape(');
const shapeEnd = html.indexOf('function phase11DownloadSnapshot(', shapeStart);
const jsonStart = html.indexOf('function phase16CReadJson(');
const jsonEnd = html.indexOf('function importData(', jsonStart);
assert(shapeStart >= 0 && shapeEnd > shapeStart, 'backup shape validator exists');
assert(jsonStart >= 0 && jsonEnd > jsonStart, 'JSON reader exists');
const backupContext = {};
vm.createContext(backupContext);
vm.runInContext(html.slice(shapeStart, shapeEnd) + '\n' + html.slice(jsonStart, jsonEnd), backupContext);
const validBackup = { devices: [], subnets: [], racks: [], vlans: [], ipAllocations: {} };
assert.equal(backupContext.phase11ValidateBackupShape(validBackup), true, 'empty backup is structurally valid');
assert.equal(backupContext.phase11ValidateBackupShape(backupContext.phase16CReadJson(JSON.stringify(validBackup))), true, 'exported JSON can be read');
assert.throws(() => backupContext.phase16CReadJson('{broken'), /not valid JSON/, 'invalid JSON rejected');
assert.throws(() => backupContext.phase11ValidateBackupShape([]), /JSON object/, 'array root rejected');
assert.throws(() => backupContext.phase11ValidateBackupShape({ ...validBackup, devices: null }), /devices array/, 'missing devices rejected');
assert.throws(() => backupContext.phase11ValidateBackupShape({ ...validBackup, ipAllocations: [] }), /IP allocation table/, 'invalid allocation table rejected');
assert.throws(() => backupContext.phase11ValidateBackupShape({ ...validBackup, racks: [null] }), /invalid entries/, 'invalid rack rejected');
assert.throws(() => backupContext.phase11ValidateBackupShape({ ...validBackup, devices: Array(50001).fill({}) }), /too many devices/, 'oversized device list rejected');
assert(html.includes('caffoot_lite_backup_'), 'backup filename uses Caffoot branding');
assert(html.includes('caffoot_lite_pre_restore_safety_snapshot.json'), 'recovery filename uses Caffoot branding');
assert(html.includes('legacy NetMini JSON backup'), 'legacy backup compatibility is described');
console.log('Backup JSON validation fixtures passed.');



console.log('Personal source regression checks passed (' + scripts.length + ' inline scripts parsed).');


const ipPickerSource = fs.readFileSync(path.join(__dirname, 'caffoot-personal.html'), 'utf8');
assert(ipPickerSource.includes('id="dev-ip-available"'), 'Device form must expose a Safari-compatible IP dropdown');
assert(ipPickerSource.includes("case 'device-ip-select':"), 'Device IP dropdown must be handled on change');
assert(ipPickerSource.includes('if (available.length < 50) available.push(ip)'), 'IP dropdown must cap rendered choices');
assert(ipPickerSource.includes('if (ip === subnet.gateway) continue;'), 'IP dropdown must exclude gateway');

assert(html.includes("case 'phase16a-check-safety': phase16ACheckSafety(); break;"), 'Inventory safety check must be wired');
assert(html.includes('function phase16ACheckSafety()'), 'Inventory safety check must remain');
assert(html.includes('const issues = validateApplicationState();'), 'Inventory safety check must validate integrity');
assert(html.includes('The saved inventory differs from the currently displayed inventory.'), 'Safety check must compare saved inventory');
assert(html.includes("panel('Inventory safety check'"), 'Safety check must appear in Data Management');
