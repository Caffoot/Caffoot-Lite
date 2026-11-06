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
   const source=await reference.locator('.device-review-form-panel:not([hidden]) .device-review-panel').first().evaluate(el=>({padding:getComputedStyle(el).padding,inputHeight:42}));
   const live=await page.locator('#device-editor-form').evaluate((form,tab)=>{
    const panel=form.querySelector('[role="tabpanel"]:not([hidden])');
    const visible=el=>!!el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden';
    const fields=[...panel.querySelectorAll('.device-review-field input,.device-review-field select')].filter(el=>visible(el)&&!['hidden','checkbox','search'].includes(el.type)).map(el=>{
     const trigger=el.matches('.caffoot-search-native')?el.nextElementSibling.querySelector('.caffoot-search-trigger'):el;
     return {id:el.id,height:trigger.getBoundingClientRect().height,label:el.labels?.[0]?.textContent.trim()||el.getAttribute('aria-label')||''};
    });
    return {tab,cards:[...panel.querySelectorAll('.device-review-panel')].map(el=>({title:el.querySelector('h3')?.textContent.trim(),padding:getComputedStyle(el).padding})),fields,overflow:document.documentElement.scrollWidth-innerWidth,extraHardwareCard:!!form.querySelector('#details-section.form-section-card')};
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
   results.push({width,dark,source,live});
   if((width===1440&&!dark||width===390&&dark)&&['hardware','software','networking','notes'].includes(tab))await page.locator('.device-review-dialog').screenshot({path:path.join(out,`preserved-${tab}-${width}-${dark?'dark':'light'}.png`)});
  }
  await page.evaluate(()=>closeModal(true));
 }
 fs.writeFileSync(path.join(out,'preservation-measurements.json'),JSON.stringify(results,null,2));
 await page.waitForFunction(async()=>Object.keys((await(await fetch('/api/inventory/state')).json()).deviceEditors||{}).length===0);
 assert.deepEqual(await state(),original,'Measurement does not change inventory');
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
 for(const kind of ['number','code','link']){await page.locator('#dev-notes').fill('fictional');await page.locator('#dev-notes').evaluate(el=>el.select());await page.locator('[data-notes-format="'+kind+'"]').click();assert.notEqual(await page.locator('#dev-notes').inputValue(),'fictional');}
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
  item.edited=edited;
 }
 await page.reload();await page.locator('#app[aria-busy="false"]').waitFor();await open();await page.locator('#device-form-tab-software').click();
 for(const item of created){assert.ok(await page.locator('[data-device-detail-field="'+item.key+'"]').isChecked());assert.equal((await state()).settings[item.setting].find(x=>x.key===item.key).label,item.edited);}
 await page.evaluate(()=>closeModal(true));assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'preservation-results.json'),JSON.stringify({cases:results,inlineCreateCatalogueEditSaveReload:true,limit100:true,invalid101Rejected:true,hardwareCustomPlatformNotesAndAssignmentsRetained:true,scriptErrors:errors},null,2));
 console.log('Approved preservation: 40 responsive/theme/tab comparisons and real 100-character inline/catalogue/device round trips passed.');
};
