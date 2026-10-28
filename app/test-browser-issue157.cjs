'use strict';
const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');

// #157: disposable offline inventory, exercising the application's actual catalogue functions.
(async()=>{
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext();
 const page=await context.newPage();
 await page.route(/^https?:/i,route=>route.abort('blockedbyclient'));
 try{
  await page.goto(pathToFileURL(path.join(__dirname,'dist','Caffoot-Lite.html')).href);
  const result=await page.evaluate(()=>{
   const original=JSON.stringify(appState);
   const checks={};
   try{
    appState.devices=[];
    appState.hardwareSeedPreferences={};
    appState.installedSoftware=[];
    appState.serverFunctions=[];
    const maker='Dell',type='Laptop',model='Latitude 5450';
    openBuiltInManufacturerEditor(maker);
    document.getElementById('built-in-manufacturer-name').value='Dell test label';
    saveBuiltInManufacturerOverride(maker);
    checks.makerRename=getVisibleBuiltInHardwareSuggestions()[type]['Dell test label']?.includes(model)===true;
    const key=JSON.stringify([type,maker,model]);
    openBuiltInHardwareModelEditor(key);
    document.getElementById('built-in-model-name').value='Latitude test label';
    saveBuiltInHardwareModelOverride(key);
    checks.modelRename=getVisibleBuiltInHardwareSuggestions()[type]['Dell test label']?.includes('Latitude test label')===true;
    const backup=createInventoryBackup();
    const restored=normaliseImportedBackupAndPlanLegacyMountRepairs(JSON.parse(JSON.stringify(backup)));
    checks.backupRoundTrip=JSON.stringify(restored.hardwareSeedPreferences)===JSON.stringify(appState.hardwareSeedPreferences);
    const legacy=JSON.parse(original);
    delete legacy.hardwareSeedPreferences;
    checks.legacyBackup=!!normaliseImportedBackupAndPlanLegacyMountRepairs(legacy);
    appState.devices=[{id:'issue157-fixture',name:'Assigned fixture',type,manufacturer:'Dell test label',model:'Latitude test label'}];
    openBuiltInManufacturerEditor(maker);
    document.getElementById('built-in-manufacturer-hidden').checked=true;
    saveBuiltInManufacturerOverride(maker);
    checks.assignedMakerBlocked=getHardwareSeedPreferences()['maker:dell'].hidden!==true;
    openBuiltInHardwareModelEditor(key);
    document.getElementById('built-in-model-hidden').checked=true;
    saveBuiltInHardwareModelOverride(key);
    checks.assignedModelBlocked=getHardwareSeedPreferences()['model:'+key].hidden!==true;
    // Built-in software and server service keys must survive rename, archive and restore.
    const software=builtInSoftwareSuggestions[0];
    const softwareKey=createBuiltInSoftwareCatalogueKey(software.name);
    openSoftwareCatalogueEditor(softwareKey);
    document.getElementById('software-custom-name').value='Issue 157 software label';
    saveCustomSoftwareEntry(softwareKey);
    checks.softwareRename=getAvailableSoftwareCatalogueEntries().some(x=>x.key===softwareKey&&x.label==='Issue 157 software label');
    appState.devices=[{id:'issue157-software-fixture',name:'Software fixture',type:'Server - Physical',typeDetails:{[softwareKey]:true}}];
    archiveSoftwareCatalogueEntry(softwareKey);
    checks.assignedSoftwareBlocked=getAvailableSoftwareCatalogueEntries().some(x=>x.key===softwareKey);
    appState.devices=[];
    archiveSoftwareCatalogueEntry(softwareKey);
    checks.softwareArchive=!getAvailableSoftwareCatalogueEntries().some(x=>x.key===softwareKey);
    restoreArchivedSoftwareEntry(softwareKey);
    checks.softwareRestore=getAvailableSoftwareCatalogueEntries().some(x=>x.key===softwareKey);
    const service=builtInServerServiceSuggestions[0];
    openServerServiceEditor(service.key);
    document.getElementById('server-service-name-input').value='Issue 157 service label';
    saveServerServiceEntry(service.key);
    checks.serviceRename=getAvailableServerServiceCatalogueEntries().some(x=>x.key===service.key&&x.label==='Issue 157 service label');
    appState.devices=[{id:'issue157-service-fixture',name:'Service fixture',type:'Server - Physical',typeDetails:{[service.key]:true}}];
    archiveServerService(service.key);
    checks.assignedServiceBlocked=getAvailableServerServiceCatalogueEntries().some(x=>x.key===service.key);
    appState.devices=[];
    archiveServerService(service.key);
    checks.serviceArchive=!getAvailableServerServiceCatalogueEntries().some(x=>x.key===service.key);
    restoreArchivedServerService(service.key);
    checks.serviceRestore=getAvailableServerServiceCatalogueEntries().some(x=>x.key===service.key);
    appState.devices=[];
    openBuiltInManufacturerEditor(maker);
    document.getElementById('built-in-manufacturer-hidden').checked=true;
    saveBuiltInManufacturerOverride(maker);
    checks.makerHide=!Object.keys(getVisibleBuiltInHardwareSuggestions()[type]).includes('Dell test label');
    openBuiltInManufacturerEditor(maker);
    document.getElementById('built-in-manufacturer-hidden').checked=false;
    saveBuiltInManufacturerOverride(maker);
    checks.makerRestore=Object.keys(getVisibleBuiltInHardwareSuggestions()[type]).includes('Dell test label');
    openBuiltInHardwareModelEditor(key);
    document.getElementById('built-in-model-hidden').checked=true;
    saveBuiltInHardwareModelOverride(key);
    checks.modelHide=!getVisibleBuiltInHardwareSuggestions()[type]['Dell test label'].includes('Latitude test label');
    openBuiltInHardwareModelEditor(key);
    document.getElementById('built-in-model-hidden').checked=false;
    saveBuiltInHardwareModelOverride(key);
    checks.modelRestore=getVisibleBuiltInHardwareSuggestions()[type]['Dell test label'].includes('Latitude test label');
   }finally{const prior=JSON.parse(original);Object.keys(appState).forEach(k=>delete appState[k]);Object.assign(appState,prior);}
   return checks;
  });
  for(const [name,passed] of Object.entries(result))assert.equal(passed,true,'#157 focused check: '+name);
  console.log('PASS #157 built-in manufacturer/model preferences, assignment guards and backup migration: '+Object.keys(result).join(', '));
 }finally{await context.close();await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
