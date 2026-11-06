// Exercise approved corrections against the runner's temporary HTTPS/SQLite inventory.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
module.exports=async({page,context,out})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('https://127.0.0.1:8080/inventory');await page.locator('#app[aria-busy="false"]').waitFor();await page.bringToFront();
 const state=()=>page.evaluate(async()=>await(await fetch('/api/inventory/state',{cache:'no-store'})).json());
 const initial=await state(),device=initial.devices.find(d=>d.name==='Reception-PC'),rack=initial.racks[0];
 const close=async()=>{await page.evaluate(()=>closeModal(true));await page.locator('#modal-container').waitFor({state:'hidden'});};
 const openSoftware=async()=>{await page.evaluate(id=>openDeviceModal(id),device.id);await page.locator('#device-editor-form').waitFor();await page.getByRole('tab',{name:'Software & Firmware',exact:true}).click();};
 // Both built-in and custom platform choices must still save and reload.
 for(const [platform,version] of [['Windows','11'],['Fictional OS','2026-test']]){
  await openSoftware();
  await page.locator('#platform-select').selectOption(platform==='Windows'?platform:'__custom__');
  if(platform!=='Windows'){await page.locator('#platform-name').fill(platform);await page.locator('#platform-name').dispatchEvent('change');}
  await page.locator('#version-select').selectOption(platform==='Windows'?version:'__custom__');
  if(platform!=='Windows')await page.locator('#platform-version').fill(version);
  await page.getByRole('button',{name:'Save Device',exact:true}).click();
  await page.waitForFunction(async({id,platform,version})=>{const s=await(await fetch('/api/inventory/state',{cache:'no-store'})).json();const d=s.devices.find(d=>d.id===id);return d.typeDetails.softwarePlatform===platform&&d.typeDetails.softwareVersion===version;},{id:device.id,platform,version});
  await page.reload();await page.locator('#app[aria-busy="false"]').waitFor();await openSoftware();
  assert.equal(await page.locator('#platform-name').inputValue(),platform);assert.equal(await page.locator('#platform-version').inputValue(),version);await close();
 }
 console.log('Built-in/custom platform persistence passed');
 // Follow the real Create Subnet action and return without changing the device draft.
 await page.evaluate(()=>{switchTab('devices');openDeviceModal();});await page.locator('#dev-type').selectOption('Desktop');await page.locator('#dev-name').fill('Unsaved Subnet Return');
 await page.getByRole('tab',{name:'Networking',exact:true}).click();
 await page.locator('[data-action="create-subnet-from-device"]').click();await page.locator('[data-action="cancel-subnet-modal"]').last().waitFor();
 await page.locator('[data-action="cancel-subnet-modal"]').last().click();await page.locator('#device-editor-form').waitFor();assert.equal(await page.locator('#dev-name').inputValue(),'Unsaved Subnet Return');await close();
 console.log('Subnet draft return passed');
 // Increase text size inside the shared editor without changing application styles.
 await openSoftware();
 for(const width of [1440,768,390]){
  await page.setViewportSize({width,height:950});
  const style=await page.addStyleTag({content:'#software-platform .device-review-field > label{font-size:18px;line-height:1.4}'});
  const fields=await page.locator('#software-platform').evaluate(root=>[...root.querySelectorAll('#platform-select,#version-select')].map(e=>{const label=e.closest('.device-review-field').querySelector('label');const control=e.classList.contains('caffoot-search-native')?e.nextElementSibling.querySelector('button'):e;return {top:control.getBoundingClientRect().top,labelBottom:label.getBoundingClientRect().bottom};}));
  if(width>700)assert.ok(Math.abs(fields[0].top-fields[1].top)<1);assert.ok(fields.every(x=>x.top>=x.labelBottom));await style.evaluate(e=>e.remove());
 }
 await close();await page.setViewportSize({width:1440,height:950});
 // The fixture's existing imported rack has no dimensions. Ordinary Edit must not supply them.
 await page.evaluate(id=>{switchTab('racks');selectedRackId=id;v13RackSection='inventory';v13RackDetailOpen=true;openRackModal(id);},rack.id);
 assert.equal(await page.locator('#rack-width').inputValue(),'');assert.equal(await page.locator('#rack-depth').inputValue(),'');
 await page.locator('#rack-name').fill('Recorded Identity Only');await page.locator('form[data-form-action="rack"] button[type="submit"]').click();await page.locator('#modal-container').waitFor({state:'hidden'});
 let saved=(await state()).racks.find(r=>r.id===rack.id);assert.equal(saved.widthMm,undefined);assert.equal(saved.depthMm,undefined);
 await page.evaluate(id=>openRackModal(id,true),rack.id);await page.locator('#rack-width').fill('0');await page.locator('#rack-depth').fill('1000');
 await page.locator('form[data-form-action="rack"]').evaluate(form=>form.requestSubmit());assert.equal(await page.locator('#rack-correction-dialog').count(),0);assert.equal((await state()).racks.find(r=>r.id===rack.id).widthMm,undefined);
 await page.locator('#rack-width').fill('750');await page.locator('form[data-form-action="rack"] button[type="submit"]').click();await page.locator('#rack-correction-dialog').waitFor();
 await page.locator('[data-action="rack-correction-cancel"]').click();assert.equal((await state()).racks.find(r=>r.id===rack.id).widthMm,undefined);
 await page.locator('form[data-form-action="rack"] button[type="submit"]').click();await page.locator('[data-action="rack-correction-accept"]').click();await page.locator('#modal-container').waitFor({state:'hidden'});
 await page.reload();await page.locator('#app[aria-busy="false"]').waitFor();saved=(await state()).racks.find(r=>r.id===rack.id);assert.equal(saved.widthMm,750);assert.equal(saved.depthMm,1000);
 // Review and cancel a published-format import: the notice is truthful and no values change.
 const source={devices:[],racks:[{id:'missing',name:'Missing Dimensions',heightU:12},{id:'legacy',name:'Legacy Dimensions',heightU:12,width:700,depth:'900mm'}],subnets:[],vlans:[],ipAllocations:{},caffootBackup:{format:'caffoot-inventory',schemaVersion:1,app:'Caffoot Lite',appVersion:'1.3.3',exportedAt:'2026-11-06T00:00:00Z'}};
 const beforeImport=await state();await page.evaluate(()=>switchTab('settings'));await page.locator('.approved-settings .subnav [data-tab="data"]').click();
 const chooser=page.waitForEvent('filechooser');await page.locator('[data-action="next-import-pick"]').click();await(await chooser).setFiles({name:'fictional-v133.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(source))});
 await page.getByText('Missing rack dimensions remain unrecorded.',{exact:false}).waitFor();await page.locator('[data-next-import-action="cancel"]').click();
 const afterImport=await state();for(const key of ['devices','subnets','racks','rackAccessories','ipAllocations','changeHistory'])assert.deepEqual(afterImport[key],beforeImport[key]);
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'actions.json'),JSON.stringify({builtinAndCustomPlatformSaveReload:true,subnetDraftReturn:true,enlargedLabels:[1440,768,390],ordinaryEditDoesNotInventDimensions:true,invalidDimensionRejected:true,correctionCancelPreservedData:true,explicitDimensionsPersist:true,importNoticeAndCancel:true,errors},null,2));
 console.log('Issue #306 functional actions passed');
};
