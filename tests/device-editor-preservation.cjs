// Verify the five approved compatibility placements and catalogue-name round trips.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
module.exports=async({page,reference,sourceBase,context,out})=>{
 page.setDefaultTimeout(15000);reference.setDefaultTimeout(15000);
 const address='https://127.0.0.1:8080',results=[],errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 const state=async()=>await(await context.request.get(address+'/api/inventory/state')).json();
 await page.goto(address+'/inventory');await page.locator('#app[aria-busy="false"]').waitFor();
 await reference.goto(sourceBase+'/devices-details-forms-batch-04.html');
 const original=await state(),host=original.devices.find(d=>d.name==='Hypervisor-01');
 const open=async()=>{await page.bringToFront();await page.evaluate(id=>openDeviceModal(id),host.id);await page.locator('#device-editor-form').waitFor();};
 if(process.env.CAFFOOT_PRESERVATION_FUNCTIONS_ONLY==='1')results.push(...JSON.parse(fs.readFileSync(path.join(out,'preservation-measurements.json'))));
 for(const width of (process.env.CAFFOOT_PRESERVATION_FUNCTIONS_ONLY==='1'?[]:[1440,1280,390,320]))for(const dark of [false,true]){
  await page.setViewportSize({width,height:950});await reference.setViewportSize({width,height:950});
  await page.evaluate(dark=>caffootSetTheme(dark?'dark':'light'),dark);await open();
  await reference.evaluate(()=>openDeviceEditor('edit','Hypervisor-01'));
  for(const tab of ['general','hardware','software','networking','notes']){
   console.log('Preservation comparison',width,dark,tab);await page.bringToFront();await page.locator('#device-form-tab-'+tab).click();await reference.bringToFront();await reference.locator('[data-review-tab="'+tab+'"]').click();
   const source=await reference.locator('.device-review-form-panel:not([hidden]) .device-review-panel').first().evaluate(el=>({padding:getComputedStyle(el).padding,inputHeight:[...el.querySelectorAll('input:not([type=checkbox]),select')].find(input=>input.getClientRects().length)?.getBoundingClientRect().height??null}));
   const live=await page.locator('#device-editor-form').evaluate((form,tab)=>{
    const panel=form.querySelector('[role="tabpanel"]:not([hidden])');
    const visible=el=>!!el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden';
    const fields=[...panel.querySelectorAll('.device-review-field input,.device-review-field select')].filter(el=>visible(el)&&!['hidden','checkbox','search'].includes(el.type)).map(el=>{
     const trigger=el.matches('.caffoot-search-native')?el.nextElementSibling.querySelector('.caffoot-search-trigger'):el;
     return {id:el.id,height:trigger.getBoundingClientRect().height,label:el.labels?.[0]?.textContent.trim()||el.getAttribute('aria-label')||''};
    });
    return {tab,cards:[...panel.querySelectorAll('.device-review-panel')].map(el=>({title:el.querySelector('h3')?.textContent.trim(),padding:getComputedStyle(el).padding})),fields,overflow:document.documentElement.scrollWidth-innerWidth,extraHardwareCard:!!form.querySelector('#details-section.form-section-card'),footer:[...document.querySelectorAll('.device-review-footer button')].map(button=>({text:button.textContent.trim(),x:button.getBoundingClientRect().x,y:button.getBoundingClientRect().y,width:button.getBoundingClientRect().width,height:button.getBoundingClientRect().height}))};
   },tab);
   assert.equal(live.overflow,0,'No page overflow at '+width);assert.equal(live.extraHardwareCard,false);
   for(const card of live.cards)assert.equal(card.padding,source.padding);
   for(const field of live.fields){assert.equal(field.height,source.inputHeight,field.id+' source sizing');assert.ok(field.label,field.id+' accessible label');}
   if(tab==='hardware'){
    assert.ok(await page.locator('#device-detail-fields-panel').locator('[data-device-detail-field]').count()>0);
    assert.ok(await page.locator('#device-form-panel-hardware [data-action="hardware-catalog-manage"]').count()===1);
   }
   if(tab==='software')for(const id of ['manage-installed-software-button','manage-server-services-button']){
    assert.ok(await page.locator('#'+id).evaluate(el=>el.classList.contains('device-review-smallbtn')&&!!el.closest('.device-review-panel')));
   }
   if(tab==='networking'){
    assert.ok(await page.locator('#dev-vlan').evaluate(el=>el.closest('.device-review-panel').querySelector('h3').textContent.includes('Network Identity')));
    assert.ok(await page.locator('[data-action="create-subnet-from-device"]').evaluate(el=>el.closest('.device-review-panel').querySelector('h3').textContent.includes('Subnet Guidance')));
   }
   if(tab==='notes'){
    assert.deepEqual(await page.locator('.notes-toolbar button').allTextContents(),['Bold','Italic','Bullets','Heading','Numbers','Code','Link','Preview']);
    for(const kind of ['number','code','link'])assert.ok(await page.locator('[data-notes-format="'+kind+'"]').evaluate(el=>!!el.closest('.device-review-note-toolbar')));
   }
   assert.equal(live.footer.length,2);for(const button of live.footer){assert.ok(button.width>0&&button.height>0);assert.ok(button.x>=0&&button.x+button.width<=width+1);}
   results.push({width,dark,source,live});
   if((width===1440&&!dark||width===390&&dark)&&['hardware','software','networking','notes'].includes(tab)){await page.bringToFront();await page.locator('.device-review-footer button').last().waitFor({state:'visible'});await page.locator('.device-review-dialog').screenshot({path:path.join(out,`preserved-${tab}-${width}-${dark?'dark':'light'}.png`)});}
  }
  await page.evaluate(()=>closeModal(true));
 }
 fs.writeFileSync(path.join(out,'preservation-measurements.json'),JSON.stringify(results,null,2));
 await page.waitForFunction(async()=>Object.keys((await(await fetch('/api/inventory/state')).json()).deviceEditors||{}).length===0);
 assert.deepEqual(await state(),original,'Measurement does not change inventory');
 if(process.env.CAFFOOT_PRESERVATION_LAYOUT_ONLY==='1'){console.log('40 source/placement cases including footer bounds passed.');return;}
 // Create 100-character names inline, retain selections, then edit through the catalogue forms.
 await open();await page.locator('#device-form-tab-software').click();
 const created=[];
 for(const kind of ['software','services']){
  await page.locator('[data-action="device-inline-quick-open"][data-kind="'+kind+'"]').click();
  const input=page.locator('[data-review-new-name="'+kind+'"]'),panel=page.locator('[data-review-create="'+kind+'"]');
  assert.equal(await input.getAttribute('maxlength'),'100');
  await input.evaluate(el=>{el.value='X'.repeat(101);});await panel.locator('[data-action="device-inline-quick-save"]').click();
  assert.match(await panel.locator('[data-review-create-error]').textContent(),/100/);
  const name=(kind==='software'?'Software ':'Service ').padEnd(100,'N');await input.fill(name);
  await panel.locator('[data-action="device-inline-quick-save"]').click();
  const setting=kind==='software'?'installedSoftware':'serverFunctions';
  await page.waitForFunction(async({setting,name})=>(await(await fetch('/api/inventory/state')).json()).settings[setting]?.some(x=>x.label===name),{setting,name});
  const item=(await state()).settings[setting].find(x=>x.label===name);created.push({kind,setting,key:item.key,name});
  assert.ok(await page.locator('[data-device-detail-field="'+item.key+'"]').isChecked());
 }
 await page.locator('#device-form-tab-hardware').click();await page.locator('#device-detail-processor').fill('Fictional preserved processor');
 await page.locator('#device-form-tab-software').click();await page.locator('#platform-select').selectOption('__custom__');await page.locator('#platform-name').fill('Fictional custom OS');
 await page.locator('#version-select').selectOption('__custom__');await page.locator('#platform-version').fill('Fictional custom version');
 await page.locator('#device-form-tab-notes').click();
 for(const kind of ['number','code','link']){await page.locator('#dev-notes').fill('fictional');await page.locator('#dev-notes').evaluate(el=>el.select());await page.locator('[data-notes-format="'+kind+'"]').focus();await page.keyboard.press('Enter');assert.notEqual(await page.locator('#dev-notes').inputValue(),'fictional');}
 await page.locator('#dev-notes').fill('Fictional preserved notes');await page.locator('#notes-toggle').click();assert.match(await page.locator('#notes-preview').textContent(),/Fictional preserved notes/);await page.locator('#notes-toggle').click();
 await page.locator('#modal-content button[type="submit"]').click();await page.locator('#device-editor-form').waitFor({state:'hidden'});
 await page.reload();await page.locator('#app[aria-busy="false"]').waitFor();
 const saved=(await state()).devices.find(d=>d.id===host.id);
 for(const item of created)assert.equal(saved.typeDetails[item.key],true);
 assert.equal(saved.typeDetails.processor,'Fictional preserved processor');assert.equal(saved.typeDetails.softwarePlatform,'Fictional custom OS');assert.equal(saved.typeDetails.softwareVersion,'Fictional custom version');assert.equal(saved.notes,'Fictional preserved notes');
 for(const item of created){
  await page.evaluate(()=>switchTab('devices'));
  await page.evaluate(({kind,key})=>kind==='software'?openSoftwareCatalogueEditor(key):openServerServiceEditor(key),item);
  const input=page.locator(item.kind==='software'?'#software-custom-name':'#server-service-name-input');
  assert.equal(await input.inputValue(),item.name);assert.equal(await input.getAttribute('maxlength'),'100');
  await input.evaluate(el=>{el.value='X'.repeat(101);});
  await page.locator('[data-action="'+(item.kind==='software'?'software-custom-save':'server-catalog-save')+'"]').click();
  assert.equal((await state()).settings[item.setting].find(x=>x.key===item.key).label,item.name);
  const edited=item.name.slice(0,99)+'E';await input.fill(edited);
  await page.locator('[data-action="'+(item.kind==='software'?'software-custom-save':'server-catalog-save')+'"]').click();
  await page.waitForFunction(async({setting,key,edited})=>(await(await fetch('/api/inventory/state')).json()).settings[setting]?.find(x=>x.key===key)?.label===edited,{...item,edited});
  await page.locator('#modal-container').waitFor({state:'hidden'});
  item.edited=edited;
 }
 // The standalone catalogue Add and retained manager Add/rename paths use the same boundary.
 for(const kind of ['software','services']){
  const software=kind==='software',setting=software?'installedSoftware':'serverFunctions';
  await page.evaluate(software=>software?openSoftwareCatalogueEditor():openServerServiceEditor(),software);
  const input=page.locator(software?'#software-custom-name':'#server-service-name-input');
  const label=(kind+' standalone ').padEnd(100,'A');await input.fill(label);
  if(software)await page.locator('input[name="software-custom-type"][value="Server - Physical"]').check();
  await page.locator('[data-action="'+(software?'software-custom-save':'server-catalog-save')+'"]').click();
  await page.waitForFunction(async({setting,label})=>(await(await fetch('/api/inventory/state')).json()).settings[setting]?.some(x=>x.label===label),{setting,label});
  await page.locator('#modal-container').waitFor({state:'hidden'});
  await page.evaluate(software=>software?openConfiguredSoftwareCatalogueManager():openServerServiceManager(),software);
  const managerInput=page.locator(software?'#software-name':'#server-service-manager-name-input');
  assert.equal(await managerInput.getAttribute('maxlength'),'100');
  const managed=(kind+' manager ').padEnd(100,'M');await managerInput.fill(managed);
  await page.locator('[data-action="'+(software?'add-software':'add-service')+'"]').click();
  await page.waitForFunction(async({setting,managed})=>(await(await fetch('/api/inventory/state')).json()).settings[setting]?.some(x=>x.label===managed),{setting,managed});
  await page.waitForFunction(id=>document.getElementById(id)?.value==='',software?'software-name':'server-service-manager-name-input');
  const item=(await state()).settings[setting].find(x=>x.label===managed),renameAction=software?'rename-software':'rename-service';
  page.once('dialog',dialog=>dialog.accept('X'.repeat(101)));
  await page.locator('[data-action="'+renameAction+'"][data-name="'+item.key+'"]').click();
  assert.equal((await state()).settings[setting].find(x=>x.key===item.key).label,managed);
  const renamed=managed.slice(0,99)+'R';page.once('dialog',dialog=>dialog.accept(renamed));
  await page.locator('[data-action="'+renameAction+'"][data-name="'+item.key+'"]').click();
  await page.waitForFunction(async({setting,key,renamed})=>(await(await fetch('/api/inventory/state')).json()).settings[setting]?.find(x=>x.key===key)?.label===renamed,{setting,key:item.key,renamed});
  await page.waitForFunction(({key,renamed})=>[...document.querySelectorAll('[data-name="'+key+'"]')].some(button=>button.getAttribute('aria-label')==='Rename '+renamed),{key:item.key,renamed});
  await page.evaluate(()=>closeModal(true));
 }
 await page.reload();await page.locator('#app[aria-busy="false"]').waitFor();await open();await page.locator('#device-form-tab-software').click();
 for(const item of created){assert.ok(await page.locator('[data-device-detail-field="'+item.key+'"]').isChecked());assert.equal((await state()).settings[item.setting].find(x=>x.key===item.key).label,item.edited);}
 await page.evaluate(()=>closeModal(true));
 await page.waitForFunction(async()=>Object.keys((await(await fetch('/api/inventory/state')).json()).deviceEditors||{}).length===0);
 await page.evaluate(id=>duplicateDevice(id),host.id);await page.locator('#device-form-tab-hardware').click();
 assert.equal(await page.locator('#device-detail-processor').inputValue(),'Fictional preserved processor');
 await page.locator('#device-form-tab-software').click();assert.equal(await page.locator('#platform-name').inputValue(),'Fictional custom OS');
 for(const item of created)assert.ok(await page.locator('[data-device-detail-field="'+item.key+'"]').isChecked());
 await page.evaluate(()=>closeModal(true));
 for(const type of ['Switch','Desktop','Server - Physical']){
  await page.evaluate(()=>openDeviceModal());await page.locator('#dev-type').selectOption(type);await page.locator('#device-form-tab-software').click();
  assert.equal(await page.locator('#manage-installed-software-button').isVisible(),type!=='Switch','Manager visibility retains the existing type restriction');
  assert.equal(await page.locator('#server-services-section').isVisible(),type==='Server - Physical');
  await page.evaluate(()=>closeModal(true));
 }
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'preservation-results.json'),JSON.stringify({cases:results,inlineCreateCatalogueEditSaveReload:true,standaloneAddAndManagerAddRename:true,duplicatePreservesFields:true,typeSpecificManagerVisibility:true,notesKeyboardTools:true,limit100:true,invalid101Rejected:true,hardwareCustomPlatformNotesAndAssignmentsRetained:true,scriptErrors:errors},null,2));
 console.log('Approved preservation: 40 responsive/theme/tab comparisons and real 100-character inline/catalogue/device round trips passed.');
};
