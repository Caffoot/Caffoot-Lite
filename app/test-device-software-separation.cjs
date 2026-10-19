const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, 'caffoot-lite.html'), 'utf8');
for (const token of [
  "function phase120IsSoftwareField(key)",
  "key === 'windowsLicence'",
  "key !== 'os'",
  "phase120StarterServerServices",
  "serverService_File",
  "serverService_Hypervisor",
  "Manage Server Services",
  "key !== 'windowsLicence'",
  "phase120PlatformVersions = Object.freeze({",
  "'Windows Server':['2025','2022','2019'",
  "phase120IsWindowsPlatform(name)",
  "id=\"phase120-windows-licence\"",
  "id=\"phase120-version-select\"",
  "phase19BFormValues.windowsLicence = licence.value",
  "phase19BSoftwareFields().includes(key)",
  "phase19BServerFunctionFields().includes(key)",
  "phase19BRenderFields(currentType,phase19BFormValues,'hardware')",
  "phase19BRenderFields(type, phase19BFormValues, 'services')",
  "phase19BRenderFields(type, phase19BFormValues, 'installed')",
  "id = 'phase120-server-services-section'",
  "id = 'phase120-installed-software-section'",
  "servicesSection.insertBefore(servicesManager",
  "installedSection.insertBefore(softwareManager",
  "Manage Installed Software",
  "serviceFields.innerHTML=phase19BRenderFields(type,phase19BFormValues,'services')",
  "installedFields.innerHTML=phase19BRenderFields(type,phase19BFormValues,'installed')",
  "phase19BReadFields();"
]) assert.ok(source.includes(token), 'Missing software separation contract: ' + token);
console.log('PASS: software and server-role fields separated; existing keys and managers retained.');
