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
    phase120BuiltinManufacturerEditor(maker);
    document.getElementById('phase120-builtin-maker-name').value='Dell test label';
    phase120BuiltinManufacturerSave(maker);
    checks.makerRename=phase120EffectiveHardwareSeed()[type]['Dell test label']?.includes(model)===true;
    const key=JSON.stringify([type,maker,model]);
    phase120BuiltInModelEditor(key);
    document.getElementById('phase120-builtin-model-name').value='Latitude test label';
    phase120BuiltInModelSave(key);
    checks.modelRename=phase120EffectiveHardwareSeed()[type]['Dell test label']?.includes('Latitude test label')===true;
    const backup=phase20CreateBackup();
    const restored=phase20MigrateBackup(JSON.parse(JSON.stringify(backup)));
    checks.backupRoundTrip=JSON.stringify(restored.hardwareSeedPreferences)===JSON.stringify(appState.hardwareSeedPreferences);
    const legacy=JSON.parse(original);
    delete legacy.hardwareSeedPreferences;
    checks.legacyBackup=!!phase20MigrateBackup(legacy);
    appState.devices=[{id:'issue157-fixture',name:'Assigned fixture',type,manufacturer:'Dell test label',model:'Latitude test label'}];
    phase120BuiltinManufacturerEditor(maker);
    document.getElementById('phase120-builtin-maker-hidden').checked=true;
    phase120BuiltinManufacturerSave(maker);
    checks.assignedMakerBlocked=phase120HardwarePreferences()['maker:dell'].hidden!==true;
    phase120BuiltInModelEditor(key);
    document.getElementById('phase120-builtin-model-hidden').checked=true;
    phase120BuiltInModelSave(key);
    checks.assignedModelBlocked=phase120HardwarePreferences()['model:'+key].hidden!==true;
    // Built-in software and server service keys must survive rename, archive and restore.
    const software=phase120SoftwareSuggestions[0];
    const softwareKey=phase120BuiltinSoftwareKey(software.name);
    phase120SoftwareEdit(softwareKey);
    document.getElementById('software-custom-name').value='Issue 157 software label';
    phase120SoftwareSaveCustom(softwareKey);
    checks.softwareRename=phase120SoftwareOptions().some(x=>x.key===softwareKey&&x.label==='Issue 157 software label');
    appState.devices=[{id:'issue157-software-fixture',name:'Software fixture',type:'Server - Physical',typeDetails:{[softwareKey]:true}}];
    phase120SoftwareArchive(softwareKey);
    checks.assignedSoftwareBlocked=phase120SoftwareOptions().some(x=>x.key===softwareKey);
    appState.devices=[];
    phase120SoftwareArchive(softwareKey);
    checks.softwareArchive=!phase120SoftwareOptions().some(x=>x.key===softwareKey);
    phase120SoftwareRestore(softwareKey);
    checks.softwareRestore=phase120SoftwareOptions().some(x=>x.key===softwareKey);
    const service=phase120StarterServerServices[0];
    phase120ServerServiceEditor(service.key);
    document.getElementById('phase120-service-name').value='Issue 157 service label';
    phase120SaveServerService(service.key);
    checks.serviceRename=phase120AvailableServerServices().some(x=>x.key===service.key&&x.label==='Issue 157 service label');
    appState.devices=[{id:'issue157-service-fixture',name:'Service fixture',type:'Server - Physical',typeDetails:{[service.key]:true}}];
    phase120ArchiveServerService(service.key);
    checks.assignedServiceBlocked=phase120AvailableServerServices().some(x=>x.key===service.key);
    appState.devices=[];
    phase120ArchiveServerService(service.key);
    checks.serviceArchive=!phase120AvailableServerServices().some(x=>x.key===service.key);
    phase120RestoreServerService(service.key);
    checks.serviceRestore=phase120AvailableServerServices().some(x=>x.key===service.key);
    appState.devices=[];
    phase120BuiltinManufacturerEditor(maker);
    document.getElementById('phase120-builtin-maker-hidden').checked=true;
    phase120BuiltinManufacturerSave(maker);
    checks.makerHide=!Object.keys(phase120EffectiveHardwareSeed()[type]).includes('Dell test label');
    phase120BuiltinManufacturerEditor(maker);
    document.getElementById('phase120-builtin-maker-hidden').checked=false;
    phase120BuiltinManufacturerSave(maker);
    checks.makerRestore=Object.keys(phase120EffectiveHardwareSeed()[type]).includes('Dell test label');
    phase120BuiltInModelEditor(key);
    document.getElementById('phase120-builtin-model-hidden').checked=true;
    phase120BuiltInModelSave(key);
    checks.modelHide=!phase120EffectiveHardwareSeed()[type]['Dell test label'].includes('Latitude test label');
    phase120BuiltInModelEditor(key);
    document.getElementById('phase120-builtin-model-hidden').checked=false;
    phase120BuiltInModelSave(key);
    checks.modelRestore=phase120EffectiveHardwareSeed()[type]['Dell test label'].includes('Latitude test label');
   }finally{const prior=JSON.parse(original);Object.keys(appState).forEach(k=>delete appState[k]);Object.assign(appState,prior);}
   return checks;
  });
  for(const [name,passed] of Object.entries(result))assert.equal(passed,true,'#157 focused check: '+name);
  console.log('PASS #157 built-in manufacturer/model preferences, assignment guards and backup migration: '+Object.keys(result).join(', '));
 }finally{await context.close();await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
