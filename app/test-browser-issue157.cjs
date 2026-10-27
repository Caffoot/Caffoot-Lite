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
