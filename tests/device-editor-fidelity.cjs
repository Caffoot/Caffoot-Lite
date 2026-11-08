// Compare the live editor with pinned cards while exercising real fictional host/guest saves.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
module.exports=async({page,reference,sourceBase,context,out,fixtureDirectory})=>{
 const address='https://127.0.0.1:8080',matrix=[],errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(address+'/inventory');await page.locator('#app[aria-busy="false"]').waitFor();await page.bringToFront();
 await reference.goto(sourceBase+'/devices-details-forms-batch-04.html');
 const state=async()=>await(await context.request.get(address+'/api/inventory/state')).json();
 const snapshot=await state();
 const collect=()=>{
  const form=document.querySelector('#device-editor-form')||document.querySelector('#device-review-form');
  const visible=el=>!!el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden';
  const panel=[...form.querySelectorAll('[role="tabpanel"],.device-review-form-panel')].find(el=>!el.hidden&&visible(el));
  const fields=[...panel.querySelectorAll('input,select,textarea')].filter(el=>el.type!=='hidden'&&visible(el)).map(el=>{
   const trigger=el.matches('.caffoot-search-native')?el.nextElementSibling?.querySelector('.caffoot-search-trigger'):null;
   const shown=trigger||el,r=shown.getBoundingClientRect();
   return {id:el.id||el.dataset.deviceDetailField||'',label:el.labels?.[0]?.textContent.replace(/\s+/g,' ').trim()||el.getAttribute('aria-label')||'',type:el.type,card:el.closest('.device-review-panel')?.querySelector('h3')?.textContent.trim(),width:r.width,height:r.height,required:el.required,disabled:el.disabled,searchable:!!trigger};
  });
  return {footerActions:[...document.querySelectorAll('.device-review-footer button')].map(el=>el.textContent.trim()),closeText:document.querySelector('.device-review-close').textContent.trim(),dialogWidth:document.querySelector('.device-review-dialog').getBoundingClientRect().width,dialogHeight:document.querySelector('.device-review-dialog').getBoundingClientRect().height,cards:[...panel.querySelectorAll('.device-review-panel')].filter(visible).map(el=>({title:el.querySelector('h3')?.textContent.trim(),subtitle:el.querySelector(':scope>p')?.textContent.trim(),padding:getComputedStyle(el).padding})),fields,buttons:[...panel.querySelectorAll('button')].filter(visible).map(el=>el.textContent.replace(/\s+/g,' ').trim()),bodyScroll:form.closest('.device-review-body').scrollTop,overflow:document.documentElement.scrollWidth>innerWidth};
 };
 if(process.env.CAFFOOT_DEVICE_EDITOR_INLINE_ONLY==='1'){
  const inline=[];
  for(const width of [1440,390])for(const dark of [false,true])for(const [kind,tab]of [['location','general'],['manufacturer','hardware'],['model','hardware'],['software','software'],['services','software']]){
   await page.setViewportSize({width,height:844});await reference.setViewportSize({width,height:844});
   await page.bringToFront();await page.evaluate(dark=>{caffootSetTheme(dark?'dark':'light');openDeviceModal();},dark);await page.locator('#dev-type').selectOption('Server - Physical');
   await page.locator('#device-form-tab-'+tab).click();
   if(kind==='location')await page.getByRole('button',{name:'+ Add Location',exact:true}).click();
   else await page.locator('[data-action="device-inline-quick-open"][data-kind="'+kind+'"]').click();
   await reference.bringToFront();await reference.evaluate(()=>openDeviceEditor('add'));await reference.locator('[data-review-tab="'+tab+'"]').click();await reference.locator('[data-review-quick-open="'+kind+'"]').click();
   const measure=el=>({title:el.querySelector('h4').textContent,inputs:[...el.querySelectorAll('input[type="text"]')].map(input=>({label:input.labels[0].textContent,height:input.getBoundingClientRect().height,maxLength:input.maxLength})),buttons:[...el.querySelectorAll('button')].map(button=>button.textContent.trim())});
   const live=await page.locator(kind==='location'?'#dev-create-location-panel':'[data-review-create="'+kind+'"]').evaluate(measure);
   const source=await reference.locator('[data-review-create="'+kind+'"]').evaluate(measure);
   assert.deepEqual(live,source,kind+' inline source controls at '+width);
   inline.push({kind,tab,width,dark,live,source,status:'matched'});await page.evaluate(()=>closeModal(true));
  }
  assert.deepEqual(await state(),snapshot,'Inline visual checks do not save inventory');
  fs.writeFileSync(path.join(out,'inline-editor-results.json'),JSON.stringify(inline,null,2));console.log('Inline Device editor: 20 expanded comparisons matched, including the approved 100-character software/service limit.');return;
 }
 const cases=[['add-physical','add','Server - Physical','Hypervisor-01'],['edit-physical','edit',null,'Hypervisor-01'],['duplicate-physical','duplicate',null,'Hypervisor-01'],['add-vm','add','virtual','App-VM-01'],['edit-vm','edit',null,'App-VM-01'],['duplicate-vm','duplicate',null,'App-VM-01'],['desktop','add','Desktop',''],['switch','add','Switch',''],['router','add','Router',''],['firewall','add','Firewall',''],['nas','add','NAS','']];
 for(const [width,height] of (process.env.CAFFOOT_DEVICE_EDITOR_FUNCTIONS_ONLY==='1'?[]:[[1440,950],[390,844]]))for(const dark of [false,true]){
  await page.setViewportSize({width,height});await reference.setViewportSize({width,height});
  await page.evaluate(dark=>{caffootSetTheme(dark?'dark':'light');switchTab('devices');},dark);
  await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
  // The source supplies layout/type behaviour; the live shared theme supplies its existing dark palette.
  await reference.evaluate(dark=>document.documentElement.classList.toggle('dark',dark),dark);
  for(const [name,mode,type,deviceName] of cases){
   await page.bringToFront();await page.evaluate(({mode,deviceName})=>{const d=appState.devices.find(d=>d.name===deviceName);if(mode==='duplicate')duplicateDevice(d.id);else openDeviceModal(mode==='edit'?d.id:null);},{mode,deviceName});
   await page.locator('#device-editor-form').waitFor();
   if(type==='virtual')await page.locator('#dev-deployment').selectOption('virtual');
   else if(type)await page.locator('#dev-type').selectOption(type);
   await reference.evaluate(({mode,type,deviceName})=>{
    openDeviceEditor(mode,deviceName);
    if(type==='virtual'){DR('review-deployment').value='virtual';DR('review-deployment').dispatchEvent(new Event('change',{bubbles:true}));}
    else if(type){DR('review-type').value=type;DR('review-type').dispatchEvent(new Event('change',{bubbles:true}));}
   },{mode,type,deviceName});
   for(const tab of ['general','hardware','software','networking','notes']){
    if(name.includes('vm')&&tab==='hardware'){assert.ok(await page.locator('#device-form-tab-hardware').isHidden());continue;}
    await page.bringToFront();await page.locator('#device-form-tab-'+tab).click();await reference.bringToFront();await reference.locator('[data-review-tab="'+tab+'"]').click();
    const live=await page.evaluate(collect),approved=await reference.evaluate(collect);
    assert.deepEqual(live.footerActions,approved.footerActions,name+' source footer');
    assert.equal(live.closeText,approved.closeText);
    assert.ok(Math.abs(live.dialogWidth-approved.dialogWidth)<=1&&Math.abs(live.dialogHeight-approved.dialogHeight)<=1,name+' source dialog bounds');
    assert.equal(live.overflow,false,name+' '+tab+' '+width);
    assert.equal(live.bodyScroll,0,'Each editor tab starts at the top, as in the source');
    assert.deepEqual(live.cards.map(c=>c.title),approved.cards.map(c=>c.title),name+' '+tab+' source card order');
    if(tab==='software'){
     const host=live.fields.find(f=>f.id==='device-hosting-enabled');
     if(host){assert.equal(host.width,17);assert.equal(host.height,17);assert.equal(host.card,'▣Virtualisation / Hypervisor');}
     for(const search of live.fields.filter(f=>f.id.startsWith('review-search-')))assert.equal(search.height,38);
     assert.ok(live.cards.some(c=>c.title==='▣Installed Software'));
     if(name==='edit-physical')assert.ok(live.cards.some(c=>c.title==='▣Operating System / Platform'));
    }
    for(const card of live.cards)assert.equal(card.padding,width===390?'16px':'20px');
    matrix.push({name,mode,tab,width,dark,live,approved});
    if(['edit-physical','edit-vm'].includes(name)&&(width===1440&&!dark||width===390&&dark)){
     await page.bringToFront();await page.locator('.device-review-dialog').screenshot({path:path.join(out,`${name}-${tab}-${width}-${dark?'dark':'light'}-live.png`)});
     await reference.bringToFront();await reference.locator('.device-review-dialog').screenshot({path:path.join(out,`${name}-${tab}-${width}-${dark?'dark':'light'}-source.png`)});
    }
   }
   await page.evaluate(()=>closeModal(true));
  }
 }
 fs.writeFileSync(path.join(out,'device-editor-matrix.json'),JSON.stringify(matrix,null,2));
 assert.deepEqual(await state(),snapshot,'Visual comparison does not save or change inventory');
 // The actual opt-in route must load and reload through authentication, not history.replaceState.
 await page.goto(address+'/inventory?rack-print=same-tab');await page.locator('#app[aria-busy="false"]').waitFor();await page.reload();await page.locator('#app[aria-busy="false"]').waitFor();
 assert.equal(new URL(page.url()).search,'?rack-print=same-tab');
 await page.goto(address+'/inventory');await page.locator('#app[aria-busy="false"]').waitFor();await page.setViewportSize({width:1440,height:950});
 // A copied physical record with known OS data but no hosting flag stays ineligible.
 await page.evaluate(()=>{
  const original=appState.devices.find(d=>d.name==='Hypervisor-01');
  appState.devices.push({...original,id:'fictional-unflagged-copy-source',name:'Fictional unflagged source',os:'Proxmox VE',serverService_Hypervisor:false,typeDetails:{}});
  duplicateDevice('fictional-unflagged-copy-source');
 });
 await page.locator('#device-editor-form').waitFor();await page.locator('#device-form-tab-software').click();
 assert.equal(await page.locator('#device-hosting-enabled').isChecked(),false,'A duplicate does not invent hosting eligibility');
 assert.equal(await page.locator('#platform-name').inputValue(),'Proxmox VE','Known legacy OS data remains visible in the editor');
 await page.evaluate(()=>{closeModal(true);appState.devices=appState.devices.filter(d=>d.id!=='fictional-unflagged-copy-source');});
 // Record Proxmox as OS/software first: neither selection grants host eligibility.
 await page.evaluate(()=>openDeviceModal());await page.locator('#dev-type').selectOption('Server - Physical');await page.locator('#dev-name').fill('Fictional Proxmox Host');await page.locator('#dev-location').selectOption('Server Room');await page.locator('#dev-mount-type').selectOption('Tower / Floor Standing');
 await page.locator('#device-form-tab-software').click();await page.locator('#platform-select').selectOption('Proxmox VE');
 assert.equal(await page.locator('#device-hosting-enabled').isChecked(),false);
 const proxmox=page.locator('[data-device-detail-field="catalogSoftware_proxmox_ve"]');if(await proxmox.count())await proxmox.check();
 assert.equal(await page.locator('#device-hosting-enabled').isChecked(),false);
 await page.locator('#device-hosting-enabled').check();await page.locator('#host-platform-select').selectOption('Proxmox VE');await page.locator('#host-version').fill('8.4');
 assert.equal(await page.locator('[data-device-detail-field="serverService_Hypervisor"]').isChecked(),true);
 await page.locator('#device-form-tab-networking').click();await page.locator('#dev-block').selectOption('__unassigned__');await page.locator('#dev-vlan').selectOption('10');await page.locator('#dev-subnet').selectOption('net-0');await page.locator('#dev-ip').fill('10.0.10.210');
 await page.locator('#modal-content button[type="submit"]').click();await page.waitForFunction(async()=>{const s=await(await fetch('/api/inventory/state')).json();return s.devices.some(d=>d.name==='Fictional Proxmox Host');});await page.locator('#device-editor-form').waitFor({state:'hidden'});
 const host=(await state()).devices.find(d=>d.name==='Fictional Proxmox Host');assert.equal(host.typeDetails.serverService_Hypervisor,true);assert.equal(host.typeDetails.hypervisorProduct,'Proxmox VE');
 await page.evaluate(()=>openDeviceModal());await page.locator('#dev-deployment').selectOption('virtual');await page.locator('#dev-name').fill('Fictional Guest');await page.locator('#dev-virtual-host').selectOption(host.id);await page.locator('#dev-vmVcpu').fill('4');await page.locator('#dev-vmRamGb').fill('8');
 assert.ok(await page.locator('#device-form-tab-hardware').isHidden());
 await page.locator('#device-form-tab-networking').click();await page.locator('#dev-block').selectOption('__unassigned__');await page.locator('#dev-vlan').selectOption('10');await page.locator('#dev-subnet').selectOption('net-0');await page.locator('#dev-ip').fill('10.0.10.211');await page.locator('#modal-content button[type="submit"]').click();
 await page.waitForFunction(async()=>{const s=await(await fetch('/api/inventory/state')).json();return s.devices.some(d=>d.name==='Fictional Guest');});await page.locator('#device-editor-form').waitFor({state:'hidden'});
 const guest=(await state()).devices.find(d=>d.name==='Fictional Guest');assert.equal(guest.virtualHostId,host.id);assert.equal(guest.isVirtual,true);assert.equal(guest.mountType,'Not Applicable');
 await page.evaluate(id=>openDeviceModal(id),guest.id);await page.locator('#dev-vmVcpu').fill('6');await page.locator('#modal-content button[type="submit"]').click();await page.waitForFunction(async id=>{const s=await(await fetch('/api/inventory/state')).json();return Number(s.devices.find(d=>d.id===id).typeDetails.vmVcpu)===6;},guest.id);await page.locator('#device-editor-form').waitFor({state:'hidden'});
 await page.evaluate(id=>duplicateDevice(id),guest.id);assert.equal(await page.locator('#dev-name').inputValue(),'');assert.equal(await page.locator('#dev-ip').inputValue(),'');assert.equal(await page.locator('#dev-virtual-host').inputValue(),host.id);
 await page.locator('#dev-name').fill('Fictional Guest Copy');await page.locator('#device-form-tab-networking').click();await page.locator('#dev-ip').fill('10.0.10.212');await page.locator('#modal-content button[type="submit"]').click();await page.waitForFunction(async()=>{const s=await(await fetch('/api/inventory/state')).json();return s.devices.some(d=>d.name==='Fictional Guest Copy');});await page.locator('#device-editor-form').waitFor({state:'hidden'});
 const saved=await state();assert.equal(saved.devices.find(d=>d.id===guest.id).virtualHostId,host.id);assert.equal(saved.devices.find(d=>d.name==='Fictional Guest Copy').virtualHostId,host.id);
 await page.reload();await page.locator('#app[aria-busy="false"]').waitFor();assert.equal((await state()).devices.find(d=>d.id===guest.id).virtualHostId,host.id);
 // Simulate an imported incomplete guest only inside this runner's disposable database.
 const legacy=snapshot.devices.find(d=>d.name==='App-VM-01');
 const seeded=spawnSync('python3',['-c',"import json,sqlite3,sys; c=sqlite3.connect(sys.argv[1]); d=json.loads(c.execute('SELECT record_json FROM inventory_devices WHERE id=?',(sys.argv[2],)).fetchone()[0]); d['virtualHostId']='fictional-missing-hypervisor'; d['virtualPlatform']='Legacy platform'; d.setdefault('typeDetails',{})['historicalFixtureValue']='retained'; c.execute('UPDATE inventory_devices SET record_json=? WHERE id=?',(json.dumps(d),sys.argv[2])); c.commit()",path.join(fixtureDirectory,'inventory.sqlite3'),legacy.id],{encoding:'utf8'});
 assert.equal(seeded.status,0,seeded.stderr);
 await page.reload();await page.locator('#app[aria-busy="false"]').waitFor();await page.evaluate(id=>openDeviceModal(id),legacy.id);await page.locator('#device-editor-form').waitFor();
 assert.equal(await page.locator('#dev-virtual-host').inputValue(),'fictional-missing-hypervisor','Retain an imported missing-host identity in the existing host selector');
 assert.equal(await page.locator('#dev-vmVcpu').inputValue(),'','Unknown resources stay blank');
 await page.locator('#device-form-tab-notes').click();await page.locator('#dev-notes').fill('Fictional incomplete guest edit');await page.locator('#modal-content button[type="submit"]').click();
 await page.waitForFunction(async id=>{const s=await(await fetch('/api/inventory/state')).json();return s.devices.find(d=>d.id===id)?.notes==='Fictional incomplete guest edit';},legacy.id);await page.locator('#device-editor-form').waitFor({state:'hidden'});
 const retained=(await state()).devices.find(d=>d.id===legacy.id);assert.equal(retained.virtualHostId,'fictional-missing-hypervisor');assert.equal(retained.virtualPlatform,'Legacy platform');assert.equal(retained.typeDetails.historicalFixtureValue,'retained');
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'device-editor-matrix.json'),JSON.stringify(matrix,null,2));fs.writeFileSync(path.join(out,'device-workflows.json'),JSON.stringify({comparisons:matrix.length,host:host.name,vmCreateEditDuplicateReload:true,unflaggedDuplicateRemainsIneligible:true,legacyPlatformShown:true,legacyIncompleteGuestPreserved:true,explicitHostEligibility:true,scriptErrors:errors},null,2));
 console.log('Device editor fidelity:',matrix.length,'comparisons; physical Proxmox host and VM create/edit/duplicate/reload passed.');
};
