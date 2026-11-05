// Owner-approved exceptions and live actions, using the existing isolated visual runner.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
module.exports=async function verifyOwnerAcceptanceBatch({page,reference,sourceBase,context,out}){
 const results=[],measurements=[],errors=[];page.on('pageerror',error=>errors.push(error.message));
 const address=new URL(page.url()==='about:blank'?'https://127.0.0.1:8080':page.url()).origin;
 await page.goto(address+'/inventory');await page.locator('#app[aria-busy="false"]').waitFor();
 const go=async tab=>page.evaluate(tab=>switchTab(tab),tab);
 async function dismiss(){
  await page.locator('#modal-content .app-modal-close').first().click();
  if(await page.locator('#discard-dialog').isVisible())await page.locator('[data-action="discard-device-form-changes"]').click();
  await page.locator('#modal-container').waitFor({state:'hidden'});
 }
 async function height(selector){
  const el=page.locator(selector).first();await el.waitFor();
  const value=await el.evaluate(e=>{if(e.classList.contains('caffoot-search-native'))e=e.nextElementSibling.querySelector('.caffoot-search-trigger');return {height:e.getBoundingClientRect().height,font:getComputedStyle(e).fontFamily,padding:getComputedStyle(e).padding,border:getComputedStyle(e).borderColor};});
  assert.equal(Math.round(value.height),42,'Approved-derived single-line height: '+selector);measurements.push({selector,width:page.viewportSize().width,...value});return value;
 }
 async function capture(name,file,prepare){
  await reference.goto(sourceBase+'/'+file+'.html');
  if(prepare)await prepare(reference);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No document overflow: '+name);
  const modal=page.locator('#modal-content:visible,.users-management-modal .modal').first();
  let modalBounds=null;
  if(await modal.count()){
   modalBounds=await modal.evaluate(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,viewportHeight:innerHeight};});
   assert.ok(modalBounds.y>=-1&&modalBounds.y+modalBounds.height<=modalBounds.viewportHeight+1,'Modal must stay within the actual viewport: '+name);
  }
  await page.screenshot({path:path.join(out,name+'-live.png'),fullPage:!modalBounds});
  await reference.screenshot({path:path.join(out,name+'-approved.png'),fullPage:!modalBounds});
  results.push({scenario:name,modalBounds,status:'functional/layout assertions passed; owner-approved exceptions apply'});
  console.log('Checked',name);
 }
 const editorReference=ref=>ref.evaluate(()=>openDeviceEditor('add'));
 for(const width of [1440,390].filter(width=>!process.env.CAFFOOT_OWNER_WIDTH||width===Number(process.env.CAFFOOT_OWNER_WIDTH))){
  await page.setViewportSize({width,height:width===1440?950:844});await reference.setViewportSize({width,height:width===1440?950:844});
  await go('racks');await page.locator('[data-action="approved-rack-section"][data-section-tab="overview"]').click();
  const rackGap=await page.evaluate(()=>Math.round(document.querySelector('.racks-hub-bar').getBoundingClientRect().top-document.querySelector('.racks-tabs').getBoundingClientRect().bottom));
  assert.equal(rackGap,21,'Rack Overview must use the single pinned 21px inset');
  await capture('02-rack-overview-'+width,'racks-draft-04',ref=>ref.locator('.racks-tabs [data-section-tab="overview"]').click());
  results.at(-1).tabToHeading=rackGap;

  for(const entry of ['header','empty']){
   await go('devices');await page.evaluate(()=>{activeDeviceDetailsTab='inventory';appState.devices=[];renderContent();});
   const button=page.locator(entry==='header'?'.device-header-actions [data-action="open-device-modal"]':'.device-empty [data-action="open-device-modal"]');
   assert.equal(await button.evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(237, 133, 50)','Both Add Device actions must be orange');
   if(entry==='empty')await capture('03-empty-inventory-'+width,'devices-inventory-draft-02',ref=>ref.evaluate(()=>{devices.splice(0);filterDevices();}));
   await button.click();await page.locator('.device-review-head h2').getByText('Add New Device',{exact:true}).waitFor();
   assert.equal(await page.locator('#modal-content .device-review-head .app-modal-close').textContent(),'Close ×');
   await dismiss();
  }

  // Exercise both empty and populated rack selectors without changing another installation.
  for(const empty of [true,false]){
   await page.evaluate(empty=>{if(empty)appState.racks=[];openDeviceModal();},empty);
   await page.locator('#dev-type').selectOption('Server - Physical');await page.locator('#dev-name').fill('rack-return-'+width);
   await page.locator('#dev-location').selectOption('Server Room');await page.locator('#dev-mount-type').selectOption('Rack Mounted');
   const create=page.locator('[data-action="create-rack-from-device"]');await create.scrollIntoViewIfNeeded();
   assert.ok(await create.evaluate(button=>{const help=button.parentElement.previousElementSibling;return help.classList.contains('device-review-hint')&&help.getBoundingClientRect().bottom<=button.getBoundingClientRect().top;}),'Rack guidance must occupy its own row');
   assert.ok(await create.evaluate(button=>{
    const hint=button.closest('#device-form-mounting-options').querySelector(':scope > .device-review-hint');
    return hint.getBoundingClientRect().top-button.getBoundingClientRect().bottom>=14;
   }),'Rack action and final placement hint must keep the pinned 15px separation');
   await capture('04-rack-action-'+(empty?'empty-':'populated-')+width,'devices-details-forms-batch-04',editorReference);
   await create.focus();assert.ok(await create.evaluate(e=>document.activeElement===e));
   if(empty){
    await create.press('Enter');await page.locator('#rack-name').waitFor();await page.locator('#rack-name').fill('Acceptance Rack '+width);
    await page.locator('form[data-form-action="rack"] button[type="submit"]').click();
    await page.locator('#dev-name').waitFor();
    assert.equal(await page.locator('#dev-name').inputValue(),'rack-return-'+width,'Rack creation must preserve the device draft');
    assert.ok(await page.locator('#dev-rack-id').evaluate(e=>[...e.options].some(o=>o.textContent==='Acceptance Rack '+innerWidth)),'New rack must be selectable on return');
    assert.equal(await page.locator('#dev-rack-id').evaluate(e=>e.selectedOptions[0]?.textContent),'Acceptance Rack '+width,'Created rack must be selected on return');
   }
   await dismiss();await go('devices');
  }

  await page.evaluate(()=>openDeviceModal());await page.locator('#dev-type').selectOption('Server - Physical');
  await page.locator('#dev-name').fill('acceptance-controls-'+width);await page.locator('#dev-location').selectOption('Server Room');
  const unmounted=await page.locator('#dev-mount-type').evaluate(e=>[...e.options].find(o=>o.value&&o.value!=='Rack Mounted')?.value);assert.ok(unmounted);await page.locator('#dev-mount-type').selectOption(unmounted);

  const typeTrigger=page.locator('#dev-type + .caffoot-select-host .caffoot-search-trigger');await height('#dev-name');await height('#dev-deployment');await height('#dev-type + .caffoot-select-host button');
  await typeTrigger.click();const popup=page.locator('.caffoot-search-popup:visible');
  await popup.locator('input').fill('Server');assert.ok(await popup.locator('[role="option"]').count()>0);
  assert.equal(await popup.locator('[role="option"]').first().evaluate(e=>getComputedStyle(e).borderTopWidth),'0px','Popup options must be unboxed');
  await capture('05-type-search-'+width,'devices-details-forms-batch-04',editorReference);
  await popup.locator('input').press('Escape');assert.equal(await page.locator('.caffoot-search-popup:visible').count(),0);assert.ok(await typeTrigger.evaluate(e=>document.activeElement===e));assert.ok(await page.locator('#dev-name').isVisible(),'Escape must keep the editor open');
  await typeTrigger.click();await popup.locator('input').fill('Server');await popup.locator('input').press('ArrowDown');await page.locator('.caffoot-search-popup:visible [role="option"]:focus').press('Enter');
  assert.ok((await page.locator('#dev-type').inputValue()).includes('Server'));
  await page.getByRole('tab',{name:'Hardware',exact:true}).click();const maker=page.locator('#dev-manufacturer-select + .caffoot-select-host .caffoot-search-trigger');await maker.click();await popup.locator('input').fill('Dell');assert.ok(await popup.locator('[role="option"]').count()>0);
  await capture('05-manufacturer-search-'+width,'devices-details-forms-batch-04',async ref=>{await editorReference(ref);await ref.locator('#device-review-tabs [role="tab"]').filter({hasText:'Hardware'}).first().click();});
  await popup.locator('[role="option"]').first().click();assert.equal(await page.locator('#dev-manufacturer').inputValue(),'Dell');
  await maker.click();await page.locator('.device-review-body').evaluate(e=>{e.scrollTop+=120;});await page.waitForFunction(()=>!document.querySelector('.caffoot-search-popup:not([hidden])'));
  await page.getByRole('tab',{name:'Software & Firmware',exact:true}).click();await height('#platform-select');await height('#version-select');
  await page.locator('#platform-select').selectOption('__custom__');await page.locator('#platform-name').fill('Acceptance platform');await height('#platform-name');
  await page.locator('#version-select').selectOption('__custom__');await page.locator('#platform-version').fill('Acceptance version');await height('#platform-version');
  await capture('05-platform-controls-'+width,'devices-details-forms-batch-04',async ref=>{await editorReference(ref);await ref.locator('#device-review-tabs [role="tab"]').filter({hasText:'Software & Firmware'}).first().click();});
  await page.getByRole('tab',{name:'Networking',exact:true}).click();await page.locator('#dev-block').selectOption('__unassigned__');await page.locator('#dev-vlan').selectOption('10');await page.locator('#dev-subnet').selectOption('net-0');
  const ip=await height('#dev-ip'),available=await height('#dev-ip-available');assert.equal(ip.font,available.font,'Available-IP typography must match its related control');
  const next=await page.locator('#dev-ip-available').evaluate(e=>[...e.options].find(o=>o.value)?.value);assert.ok(next);await page.locator('#dev-ip-available').selectOption(next);assert.equal(await page.locator('#dev-ip').inputValue(),next);
  await capture('05-network-controls-'+width,'devices-details-forms-batch-04',async ref=>{await editorReference(ref);await ref.locator('#device-review-tabs [role="tab"]').filter({hasText:'Networking'}).first().click();});
  await page.locator('#modal-content .app-modal-close').first().click();await page.locator('#discard-dialog').waitFor();await page.locator('[data-action="keep-editing"]').click();assert.ok(await page.locator('#dev-ip').isVisible());
  await page.locator('button[type="submit"][form="device-editor-form"]').click();await page.locator('#modal-container').waitFor({state:'hidden'});
  await page.waitForFunction(async width=>{
   const state=await (await fetch('/api/inventory/state',{cache:'no-store'})).json(),device=state.devices.find(d=>d.name==='acceptance-controls-'+width);
   return device?.typeDetails?.softwarePlatform==='Acceptance platform'&&device?.typeDetails?.softwareVersion==='Acceptance version'&&!!device.primaryIp;
  },width);
  console.log('Checked custom platform/version and available-IP persistence at',width);

  await go('ipam');await page.evaluate(()=>openSubnetModal());
  for(const selector of ['#sub-kind','#sub-parent','#sub-cidr','#sub-gw','#sub-name','#sub-vlan','#sub-desc'])await height(selector);
  if(width===1440){
   const alignment=await page.evaluate(()=>['sub-name','sub-vlan'].map(id=>document.getElementById(id).getBoundingClientRect().top));
   assert.equal(alignment[0],alignment[1],'Network Name and VLAN inputs must align in their shared row');
  }
  await capture('07-subnet-controls-'+width,'ipam-draft-01',ref=>ref.evaluate(()=>openSubnet()));await dismiss();
  for(const [kind,method,args] of [
   ['types','openDeviceCatalogueManager',['type']],['locations','openDeviceCatalogueManager',['location']],
   ['manufacturers','openHardwareManufacturerManager',[]],['models','openHardwareModelManager',[]],
   ['software','openSoftwareCatalogueEditor',[]],['services','openServerServiceEditor',[]],
   ['rack','openRackModal',[]],['bulk-ip','openBulkIpModal',['net-0']],['ip-address','openIpModal',['10.0.10.21']]
  ]){
   await page.evaluate(({method,args})=>window[method](...args),{method,args});
   const close=page.locator('#modal-content .app-modal-close').first();await close.waitFor();
   assert.equal(await close.textContent(),'Close ×','Labelled header: '+kind);
   assert.ok(await close.evaluate(e=>{const r=e.getBoundingClientRect();return r.x>=0&&r.right<=innerWidth;}),'Header label must fit: '+kind);
   await close.focus();await close.press('Enter');await page.locator('#modal-container').waitFor({state:'hidden'});
  }
  console.log('Checked modal header coverage at',width);


  await go('users');await page.locator('.approved-page-header [data-tab="list"]').click();const own=page.locator('[data-action="users-open-editor"]').first();await own.click();
  const workspace=page.locator('.users-management-modal .modal');assert.equal(await workspace.evaluate(e=>Math.round(e.getBoundingClientRect().width)),Math.min(710,width-20));
  assert.equal(await workspace.locator('[data-next-user-operation]:disabled').count(),3);assert.equal(await workspace.locator('.profile-modal-grid input:disabled').count(),4);
  for(const selector of ['#user-firstName','[data-next-user-permission][data-section="Devices"]','[data-next-user-permission][data-section="IPAM"]','[data-next-user-permission][data-section="Racks"]'])await height(selector);
  if(width===1440){
   const rows=await workspace.locator('[data-next-user-permission]').evaluateAll(nodes=>nodes.map(e=>e.getBoundingClientRect().top));
   assert.ok(rows.every(y=>y===rows[0]),'Workspace permission selectors must align in their shared row');
  }
  await capture('09-protected-workspace-'+width,'users-permissions-draft-02',ref=>ref.evaluate(()=>{setTab('list');openModal(initialUsers[0]);}));
  await workspace.locator('.app-modal-close').click();assert.ok(await own.evaluate(e=>document.activeElement===e),'Header Close must return focus to Manage');
  await page.locator('.approved-page-header [data-tab="add"]').click();const username='acceptance-viewer-'+width,password='Isolated-Acceptance-Viewer-2026!';
  await page.locator('#next-user-create-form [name="username"]').fill(username);await page.locator('#next-user-create-form [name="password"]').fill(password);await page.locator('#next-user-create-form button[type="submit"]').click();
  await page.waitForFunction(name=>[...document.querySelectorAll('#main-content h3')].some(e=>e.textContent===name),username);
  const userId=await page.evaluate(async name=>(await (await fetch('/api/users')).json()).users.find(u=>u.username===name).id,username);
  await page.locator('[data-action="users-open-editor"][data-user-id="'+userId+'"]').click();assert.equal(await workspace.locator('.profile-modal-grid input:disabled').count(),0);
  await page.locator('#user-displayName').fill('Acceptance Viewer');await page.locator('#next-user-profile-form button[type="submit"]').click();
  await page.waitForFunction(async id=>(await (await fetch('/api/users')).json()).users.find(u=>u.id===id).profile.displayName==='Acceptance Viewer',userId);
  await page.locator('[data-next-user-permission][data-section="Devices"]').selectOption('read');
  await page.waitForFunction(async id=>(await (await fetch('/api/users')).json()).users.find(u=>u.id===id).permissions.Devices==='read',userId);
  await capture('09-manageable-workspace-'+width,'users-permissions-draft-02',ref=>ref.evaluate(()=>{setTab('list');openModal(initialUsers[1]);}));
  await page.keyboard.press('Escape');assert.ok(await page.locator('[data-action="users-open-editor"][data-user-id="'+userId+'"]').evaluate(e=>document.activeElement===e));
  const viewer=await context.browser().newContext({ignoreHTTPSErrors:true,viewport:{width,height:844}});
  assert.ok((await viewer.request.post(address+'/api/login',{headers:{Origin:address},data:{username,password}})).ok());
  const viewerPage=await viewer.newPage();await viewerPage.goto(address+'/inventory');await viewerPage.locator('#app[aria-busy="false"]').waitFor();await viewerPage.evaluate(()=>{switchTab('devices');activeDeviceDetailsTab='inventory';appState.devices=[];renderContent();});
  await viewerPage.waitForFunction(()=>[...document.querySelectorAll('[data-action="open-device-modal"]')].every(e=>e.disabled||e.hidden));
  await viewerPage.evaluate(()=>openDeviceModal());assert.equal(await viewerPage.locator('#device-editor-form').count(),0,'Read-only users must not open the editor');
  const session=await (await viewer.request.get(address+'/api/session')).json();const denied=await viewer.request.post(address+'/api/devices/create',{headers:{Origin:address,'X-CSRF-Token':session.csrf_token},data:{record:{name:'must-not-save'}}});assert.equal(denied.status(),403,'Server must reject read-only device creation');await viewer.close();

  await go('settings');await page.locator('.approved-settings [data-tab="maintenance"]').click();
  await page.locator('.settings-maintenance-grid > .card').first().locator('.card-copy').evaluate(e=>{e.textContent+=' '+e.textContent.repeat(5);});
  const cards=await page.locator('.settings-maintenance-grid > .card').evaluateAll(nodes=>nodes.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,height:r.height};}));
  if(width===1440){assert.equal(cards[0].y,cards[1].y);assert.equal(cards[0].height,cards[1].height);assert.equal(cards[2].y,cards[3].y);assert.equal(cards[2].height,cards[3].height);}else for(let i=1;i<cards.length;i++)assert.ok(cards[i].y>=cards[i-1].y+cards[i-1].height);
  assert.ok(await page.locator('[data-action="clear-inventory-data"]').count());assert.ok(await page.getByText('Before considering this operation, make and verify a database backup.',{exact:false}).count());
  await capture('10-maintenance-rows-'+width,'settings-data-draft-02',ref=>ref.locator('.subnav [data-tab="maintenance"]').click());results.at(-1).cards=cards;
  await go('audit');await page.locator('.audit-tab[data-tab="coverage"]').click();
  // Audit names the Recording Coverage tab "coverage" in the live layout.
  assert.equal(await page.locator('.coverage-footnote,.approved-audit > .foot').count(),0);
  assert.ok(await page.getByText('V2.1 · PRIVATE ACCEPTANCE',{exact:true}).count());assert.ok(await page.locator('.audit-warn').count());
  await page.locator('.audit-tab[data-tab="activity"]').click();
  await page.locator('[data-action="audit-view-detail"]').first().click();
  const auditClose=page.locator('[data-action="audit-close-detail"]');await auditClose.waitFor();
  assert.equal(await auditClose.textContent(),'Close ×');await auditClose.press('Enter');

  console.log('PASS: Owner Acceptance Batch 01 layout/actions at',width);
 }
 assert.deepEqual(errors,[],'Owner-batch browser errors');
 fs.writeFileSync(path.join(out,'owner-batch-results.json'),JSON.stringify({screens:results,controlMeasurements:measurements,viewports:[1440,390],approvedRevision:'c26db4a56bbc30f95b56201e81a7a76d13c6037b',approvalCommit:'5053c687102f45ea4960ee7c3c08f2cb7728bf82'},null,2));
};
