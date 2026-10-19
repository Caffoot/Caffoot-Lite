const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, 'caffoot-lite.html'), 'utf8');
for (const token of [
  "function phase120IsSoftwareField(key)",
  "key === 'os' || key === 'windowsLicence'",
  "phase19BSoftwareFields().includes(key)",
  "phase19BServerFunctionFields().includes(key)",
  "phase19BRenderFields(currentType,phase19BFormValues,'hardware')",
  "phase19BRenderFields(type, phase19BFormValues, 'software')",
  "id = 'phase120-software-details'",
  "softwareSection.insertBefore(managers",
  "softwareFields.innerHTML=phase19BRenderFields(type,phase19BFormValues,'software')",
  "phase19BReadFields();"
]) assert.ok(source.includes(token), 'Missing software separation contract: ' + token);
console.log('PASS: software and server-role fields separated; existing keys and managers retained.');
