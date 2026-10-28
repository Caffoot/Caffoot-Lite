const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, 'caffoot-lite.html'), 'utf8');
for (const token of [
  "function isSoftwareDetailField(key)",
  "key === 'windowsLicence'",
  "key !== 'os'",
  "builtInServerServiceSuggestions",
  "serverService_File",
  "serverService_Hypervisor",
  "Manage Server Services",
  "key !== 'windowsLicence'",
  "platformVersionOptionsByName = Object.freeze({",
  "'Windows Server':['2025','2022','2019'",
  "isWindowsPlatform(name)",
  "id=\"device-form-windows-licence\"",
  "id=\"version-select\"",
  "deviceDetailFormValues.windowsLicence = licence.value",
  "getAvailableSoftwareCatalogueEntries().some(x=>x.key===key)",
  "getAvailableServerServiceFieldKeys().includes(key)",
  "renderDeviceDetailFields(currentType,deviceDetailFormValues,'hardware')",
  "renderDeviceDetailFields(type, deviceDetailFormValues, 'services')",
  "renderDeviceDetailFields(type, deviceDetailFormValues, 'installed')",
  "id = 'server-services-section'",
  "id = 'device-form-installed-software-section'",
  "servicesSection.insertBefore(servicesManager",
  "installedSection.insertBefore(softwareManager",
  "Manage Installed Software",
  "serviceFields.innerHTML=renderDeviceDetailFields(type,deviceDetailFormValues,'services')",
  "installedFields.innerHTML=renderDeviceDetailFields(type,deviceDetailFormValues,'installed')",
  "captureDeviceDetailFieldValues();"
]) assert.ok(source.includes(token), 'Missing software separation contract: ' + token);
console.log('PASS: software and server-role fields separated; existing keys and managers retained.');
