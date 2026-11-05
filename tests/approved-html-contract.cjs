// Caffoot Lite approved HTML interface contract.
//
// Run with: node tests/approved-html-contract.cjs
//
// This is deliberately a strict, *additional* acceptance check for the complete
// v2.1 interface integration. It is not a substitute for browser or permission
// tests, and it is not wired into the release build until the full batch is
// ready. It reports missing approved markup instead of accepting a CSS-only
// approximation that happens to pass functional tests.

'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const approvedCommit = 'c26db4a56bbc30f95b56201e81a7a76d13c6037b';
const sourceFiles = [
  'dashboard-draft-02.html',
  'my-account-draft-06.html',
  'settings-data-draft-02.html',
  'devices-overview-draft-03.html',
  'devices-inventory-draft-02.html',
  'devices-details-forms-batch-04.html',
  'devices-management-batch-02.html',
  'ipam-draft-01.html',
  'racks-draft-04.html',
  'users-permissions-draft-02.html',
  'sign-in-first-run-draft-03.html',
  'audit-trail-draft-01.html'
];

const readApproved = filename => execFileSync(
  'git',
  ['show', `${approvedCommit}:future-design/approved/${filename}`],
  { cwd: root, encoding: 'utf8', maxBuffer: 1024 * 1024 * 4 }
);

const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const screenFiles = fs.readdirSync(path.join(root, 'interface/screens')).filter(name => name.endsWith('.html'));
const screenMarkup = screenFiles.map(name => read('interface/screens/' + name)).join('\n');
const templates = new Map([...screenMarkup.matchAll(/<!-- interface-template:([^ ]+) -->([\s\S]*?)<!-- \/interface-template -->/g)].map(match => [match[1], match[2]]));
const application = read('interface/application.js');
const liveStyles = fs.readdirSync(path.join(root, 'interface/styles')).filter(name => name.endsWith('.css')).map(name => read('interface/styles/' + name)).join('\n');
const liveInventory = read('inventory.html') + application + screenMarkup + liveStyles;
const liveSetup = read('setup.html') + read('interface/sign-in.js');

const missing = [];
for (const filename of sourceFiles) {
  const html = readApproved(filename);
  assert.match(html, /<!doctype html>/i, `${filename} must be a complete approved HTML document`);
  assert.match(html, /<style\b/i, `${filename} must contain the approved CSS`);
  console.log(`Found approved design: ${filename}`);
}

// Both entry screens and their modules must retain the working integration,
// rather than replacing the app with the standalone sample-data previews.
for (const [name, html, checks] of [
  ['inventory.html', liveInventory, [
    /function\s+renderDevicesHTML\s*\(/,
    /function\s+renderIpamHTML\s*\(/,
    /function\s+renderRacksHTML\s*\(/,
    /function\s+renderDashboardHTML\s*\(/,
    /function\s+renderAuditHTML\s*\(/,
    /\/api\/devices\/edit\/save/,
    /\/api\/inventory\/state/
  ]],
  ['setup.html', liveSetup, [
    /\/api\/login/,
    /\/api\/setup/,
    /\/api\/setup\/mfa/
  ]]
]) {
  for (const pattern of checks) {
    if (!pattern.test(html)) missing.push(`${name}: working integration ${pattern} was removed`);
  }
}

// Do not call an old nested sidebar 'the approved menu'. Approved navigation
// has seven primary sections with in-page tabs for the relevant sub-sections.
const approvedDevices = readApproved('devices-overview-draft-03.html');
const approvedAccount = readApproved('my-account-draft-06.html');
if (!/class="subnav device-tabs"/.test(approvedDevices)) {
  missing.push('Approved source is missing the expected in-page Device tabs');
}
if (!/class="header-account"/.test(approvedAccount)) {
  missing.push('Approved source is missing the top-right My Account control');
}
if (/id="devices-sidebar-actions"/.test(liveInventory)) {
  missing.push('inventory.html still contains the former nested Devices sidebar; the approved Devices navigation has not been integrated');
}
if (/id="ipam-sidebar-actions"/.test(liveInventory)) {
  missing.push('inventory.html still contains the former nested IPAM sidebar; the approved IPAM navigation has not been integrated');
}
if (/id="racks-sidebar-actions"/.test(liveInventory)) {
  missing.push('inventory.html still contains the former nested Racks sidebar; the approved Racks navigation has not been integrated');
}
if (!/class="subnav device-tabs"/.test(liveInventory)) {
  missing.push('inventory.html is missing the approved in-page Devices tab structure');
}

// Each approved standalone design includes a recognisable page component.
// Check its markup in the screen modules as well as the styles.
// These markers do not replace comparison of the rendered screens.
const requiredMarkup = [
  ['Dashboard', liveInventory, /class="[^"]*db-grid[^"]*"/],
  ['My Account', liveInventory, /class="[^"]*account-grid[^"]*"/],
  ['Settings & Data', liveInventory, /class="[^"]*settings-grid[^"]*"/],
  ['Devices Overview', liveInventory, /class="[^"]*intelligence-metric[^"]*"/],
  ['Device Inventory', liveInventory, /class="[^"]*device-toolbar[^"]*"/],
  ['Device Details and Forms', liveInventory, /class="[^"]*device-review-dialog[^"]*"/],
  ['Devices Catalogues', liveInventory, /class="[^"]*catalog-card[^"]*"/],
  ['IPAM', liveInventory, /class="[^"]*ipam-stats[^"]*"/],
  ['Network Racks', liveInventory, /class="[^"]*rack-directory[^"]*"/],
  ['Users & Permissions', liveInventory, /class="[^"]*userrow[^"]*"/],
  ['Sign In and First Run', liveSetup, /class="[^"]*welcome-list[^"]*"/],
  ['Audit Trail', liveInventory, /class="[^"]*audit-pane[^"]*"/]
];
for (const [area, html, pattern] of requiredMarkup) {
  if (!pattern.test(html)) {
    missing.push(`${area}: approved page structure has not been integrated`);
  }
}

// IPAM Draft 01 modal source contract.
// Compare pinned CSS declarations and the templates called by each live editor.
// Dialogs retain the authenticated modal container around the approved markup.
const approvedIpam = readApproved('ipam-draft-01.html');
const modalSelectors = [
  '.ipam-modal', '.ipam-modal-head', '.ipam-modal-head h2',
  '.ipam-modal-body', '.ipam-modal-close', '.ipam-form-grid',
  '.ipam-form-grid .wide', '.ipam-field', '.ipam-field small',
  '.ipam-modal-actions', '.ipam-modal-actions .danger-action',
  '.ipam-modal-explain', '.ipam-modal-explain.warn',
  '.ipam-modal-note', '.ipam-hint', '.ipam-hidden'
];
function cssDeclaration(css, selector) {
  const marker = selector + '{';
  const start = css.indexOf(marker);
  if (start < 0) return null;
  const end = css.indexOf('}', start + marker.length);
  return end < 0 ? null : css.slice(start + marker.length, end);
}
for (const selector of modalSelectors) {
  const liveSelector = selector;
  const approvedRule = cssDeclaration(approvedIpam, selector);
  const liveRule = cssDeclaration(liveInventory, liveSelector);
  if (!approvedRule || approvedRule !== liveRule) {
    missing.push('IPAM Draft 01: source CSS differs for ' + selector);
  }
}
const ipamModalSegments = [
  ['subnet', 'function openSubnetModal(', 'function openSubnetModalByVlanId(',
    ['sub-kind', 'sub-cidr', 'sub-name', 'sub-vlan', 'sub-gw', 'sub-parent', 'sub-desc']],
  ['bulk', 'function openBulkIpModal(', 'function approvedBulkConfirm(',
    ['bulk-start', 'bulk-end', 'bulk-status', 'bulk-hostname', 'bulk-notes']],
  ['address', 'function openIpModal(', 'async function handleIpSubmit(',
    ['ip-status', 'ip-hostname', 'ip-notes']]
];
for (const [area, begin, end, fields] of ipamModalSegments) {
  const start = liveInventory.indexOf(begin);
  const stop = start < 0 ? -1 : liveInventory.indexOf(end, start + begin.length);
  const segment = stop > start ? liveInventory.slice(start, stop) : '';
  const html = segment + [...segment.matchAll(/renderInterfaceTemplate\("([^"\n]+)"/g)].map(match => templates.get(match[1]) || '').join('\n');
  for (const structure of ['ipam-modal-head', 'ipam-modal-body', 'ipam-form-grid', 'ipam-modal-actions']) {
    if (!html.includes(structure)) missing.push('IPAM ' + area + ': missing approved ' + structure);
  }
  for (const field of fields) {
    if (!html.includes('id="' + field + '"')) {
      missing.push('IPAM ' + area + ': original field missing: ' + field);
    }
  }
}
if (!liveInventory.includes('function openApprovedIpamModal(markup)') ||
    !liveInventory.includes("classList.add('approved-ipam-modal')")) {
  missing.push('IPAM: the live modal must use the approved source shell');
}
if (!/@media\(max-width:720px\)\{(?:[^{}]*\{[^{}]*\})*\.ipam-modal-body\{padding:17px\}/.test(liveStyles) ||
    !/@media\(max-width:720px\)\{(?:[^{}]*\{[^{}]*\})*\.ipam-form-grid\{grid-template-columns:1fr\}/.test(liveStyles)) {
  missing.push('IPAM: approved mobile modal stacking is missing');
}
if (!liveInventory.includes('planBulkSubnetAddressAssignment(subnet,request.start,request.end,request.status,request.hostname,request.notes)') ||
    !liveInventory.includes("parseIpv4AddressToNumber(document.getElementById('bulk-start')?.value.trim())")) {
  missing.push('IPAM: the approved address-range UI must preserve validated bulk re-planning');
}

// This is a static source-fidelity check only. Run real-browser saves, role
// restrictions and desktop/mobile visual comparisons before acceptance.

if (missing.length) {
  console.error('\nApproved interface integration is NOT complete:');
  for (const item of missing) console.error(`- ${item}`);
  process.exitCode = 1;
} else {
  console.log('Approved HTML sources and core integration contract checked.');
}
