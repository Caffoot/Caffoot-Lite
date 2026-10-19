// Source-contract regression for the v1.2.0 offline platform catalogue.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, 'caffoot-lite.html'), 'utf8');
for (const fragment of [
  'const phase120PlatformCatalog = Object.freeze({',
  "network: ['FortiOS','PAN-OS','pfSense','OPNsense'",
  "nas: ['Synology DSM','QNAP QTS'",
  "if (normalized === 'wireless lan controller') return 'controller';",
  "if (normalized === 'layer 3 switch') return 'switch';",
  'id="phase120-platform-select"',
  'Custom / Other...',
  'phase120WireSoftwarePlatform();',
  'min-w-[220px]',
  'phase120RenderSoftwarePlatform(type, phase19BFormValues)',
  'phase120CaptureSoftwarePlatform();',
  'phase19BFormValues.softwarePlatform = name.value',
  'phase19BFormValues.softwareVersion = version.value'
]) assert.ok(html.includes(fragment), 'Missing platform contract: ' + fragment);
console.log('PASS: offline platform suggestions, type mappings, and persistence wiring.');
