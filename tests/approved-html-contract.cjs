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

const liveInventory = fs.readFileSync(path.join(root, 'inventory.html'), 'utf8');
const liveSetup = fs.readFileSync(path.join(root, 'setup.html'), 'utf8');

const missing = [];
for (const filename of sourceFiles) {
  const html = readApproved(filename);
  assert.match(html, /<!doctype html>/i, `${filename} must be a complete approved HTML document`);
  assert.match(html, /<style\b/i, `${filename} must contain the approved CSS`);
  console.log(`Found approved design: ${filename}`);
}

// Both HTML screens must retain their working Caffoot Lite integration,
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

if (missing.length) {
  console.error('\nApproved interface integration is NOT complete:');
  for (const item of missing) console.error(`- ${item}`);
  process.exitCode = 1;
} else {
  console.log('Approved HTML sources and core integration contract checked.');
}
