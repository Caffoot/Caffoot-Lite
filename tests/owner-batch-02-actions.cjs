// Focused rendered actions for the approved Batch 02; uses isolated visual fixtures.
const assert=require('node:assert/strict'),path=require('node:path');
module.exports=async({page,measure,results,out,width,theme})=>{
 const go=async tab=>page.evaluate(tab=>{closeModal(true);switchTab(tab);},tab);
 async function capture(name,modal=false){
  await page.waitForTimeout(50);
  const values=await measure(page);assert.equal(values.overflow,false,name+' page overflow');assert.equal(values.dark,theme==='dark',name+' theme');
  const inline=page.locator('#main-content .modal[role="dialog"]:visible').first();
  const inlineVisible=await inline.count();modal=modal||!!inlineVisible;
  if(modal){const r=await (inlineVisible?inline:page.locator('#modal-content')).evaluate(e=>{if(getComputedStyle(e).display==='contents')e=e.firstElementChild;const r=e.getBoundingClientRect();return {y:r.y,bottom:r.bottom};});assert.ok(r.y>=-1&&r.bottom<=page.viewportSize().height+1,name+' dialog within viewport');}
  results.push({screen:name,width,theme,...values});await page.screenshot({path:path.join(out,name+'-'+theme+'-'+width+'.png'),fullPage:!modal});
 }

 async function navigation(){
  await go('dashboard');
  for(const collapsed of [false,true]){
   if(await page.locator('#sidebar').evaluate(e=>e.classList.contains('collapsed'))!==collapsed)
    await page.locator('[data-action="toggle-approved-sidebar"]').click();
   let reference,hoverReference,selectedReference;
   for(const tab of ['dashboard','devices','ipam','racks','audit','users','account','settings']){
    await go(tab);
    const other=page.locator('#sidebar .nav-item:not(.current)').first();await other.hover();
    const colours=async locator=>locator.evaluate(e=>({background:getComputedStyle(e).backgroundColor,color:getComputedStyle(e).color,icon:getComputedStyle(e.querySelector('svg')).color}));
    const hover=await colours(other);
    if(!hoverReference)hoverReference=hover;
    assert.deepEqual(hover,hoverReference,tab+' shared hover treatment');
    const selected=page.locator('#sidebar .nav-item.current');
    let selectedColours=null;
    if(tab==='account')assert.equal(await selected.count(),0,'Account remains a header destination');
    else{
     assert.equal(await selected.getAttribute('data-tab'),tab,'Selected menu follows destination');
     selectedColours=await colours(selected);
     if(!selectedReference)selectedReference=selectedColours;
     assert.deepEqual(selectedColours,selectedReference,tab+' shared selected treatment');
    }
    const values=await measure(page);
    const geometry=values.nav.map(({label,x,y,width,height,padding,icon})=>({label,x,y,width,height,padding,icon}));
    if(!reference)reference=geometry;
    assert.deepEqual(geometry,reference,tab+' shared '+(collapsed?'collapsed':'expanded')+' geometry');
    results.push({screen:'sidebar-'+(collapsed?'collapsed':'expanded')+'-'+tab,width,theme,hover,selectedColours,...values});
   }
  }
  await page.locator('[data-action="toggle-approved-sidebar"]').click();
  await page.locator('#sidebar [data-tab="dashboard"]').click();await page.waitForFunction(()=>currentTab==='dashboard');
 }
 async function supplementary(){
  await go('devices');await page.evaluate(()=>openDeviceDetailView(appState.devices[0].id));
  for(const tab of ['hardware','network','software','location','virtual-machines']){
   await page.locator('#device-details-tab-'+tab).click();await capture('device-details-'+tab,true);
  }
  await page.evaluate(()=>closeModal(true));
  await go('audit');await page.evaluate(()=>{auditHistory=[{at:'2026-11-05T12:00:00Z',actor:'owner',outcome:'Succeeded',reason:'Visual fixture: device renamed',changes:[{kind:'Device',action:'Updated',label:'Hypervisor-01',fields:['name'],before:{name:'Previous Hypervisor'},after:{name:'Hypervisor-01'}}],omitted:0}];activeAuditTab='activity';renderContent();});
  await page.locator('[data-action="audit-view-detail"]').first().click();await capture('audit-event-detail');
  await page.locator('[data-action="audit-close-detail"]').click();
  await go('users');await page.locator('.approved-page-header .tabs [data-tab="list"]').click();
  await page.locator('[data-action="users-open-editor"]').first().click();await capture('user-workspace');
  await page.locator('[data-action="users-close-editor"]').first().click();
  await go('settings');await page.locator('.approved-settings .subnav [data-tab="maintenance"]').click();
  const before=await page.evaluate(()=>JSON.stringify({devices:appState.devices,racks:appState.racks,subnets:appState.subnets}));
  page.once('dialog',dialog=>dialog.dismiss());await page.locator('[data-action="clear-inventory-data"]').click();
  assert.equal(await page.evaluate(()=>JSON.stringify({devices:appState.devices,racks:appState.racks,subnets:appState.subnets})),before,'Dismissing the protected reset prompt preserves data');
  return;
 }
 if(['supplementary','theme-states'].includes(process.env.CAFFOOT_BATCH02_ACTION_FOCUS)){
  if(process.env.CAFFOOT_BATCH02_ACTION_FOCUS==='theme-states'){
   await go('devices');
   for(const section of ['types','locations','manufacturers','models','software','services']){
    await page.evaluate(section=>{activeDeviceDetailsTab=section;renderContent();
     if(section==='types'||section==='locations')openDeviceCatalogueManager(section==='types'?'type':'location');
     if(section==='manufacturers')openHardwareManufacturerManager();
     if(section==='models')openHardwareModelManager();
     if(section==='software')openSoftwareCatalogueEditor();
     if(section==='services')openServerServiceEditor();
    },section);await capture('catalogue-dialog-'+section,true);await page.evaluate(()=>closeModal(true));
   }
   await go('settings');await page.locator('.approved-settings .subnav [data-tab="maintenance"]').click();await capture('settings-maintenance');
  }
  await supplementary();return;
 }
 if(process.env.CAFFOOT_BATCH02_ACTION_FOCUS==='navigation'){
  await navigation();return;
 }
 if(process.env.CAFFOOT_BATCH02_ACTION_FOCUS==='presentation'){
  await go('racks');
  for(const section of ['overview','inventory','accessories']){
   await page.locator('[data-action="approved-rack-section"][data-section-tab="'+section+'"]').click();await capture('racks-'+section);
  }
  await go('settings');await page.locator('.approved-settings .subnav [data-tab="maintenance"]').click();await capture('settings-maintenance');
  await navigation();return;
 }
 if(process.env.CAFFOOT_BATCH02_ACTION_FOCUS!=='theme-photo'){
 const reference=results.find(r=>r.screen==='dashboard'&&r.theme===theme&&r.width===width);
 const navMetrics=n=>n.map(({label,x,y,width,height,gap,padding,font,lineHeight,icon})=>({label,x,y,width,height,gap,padding,font,lineHeight,icon}));
 for(const r of results.filter(r=>r.width===width&&r.theme===theme&&r.nav.length))assert.deepEqual(navMetrics(r.nav),navMetrics(reference.nav),r.screen+' shared sidebar geometry');
 await go('dashboard');
 for(const tab of ['insights','activity','overview']){
  await page.locator('[data-action="dashboard-tab"][data-dashboard-tab="'+tab+'"]').click();await capture('dashboard-'+tab);
 }
 for(const empty of [false,true]){
  const backup=await page.evaluate(empty=>{const backup=JSON.stringify({devices:appState.devices,subnets:appState.subnets,ipAllocations:appState.ipAllocations});if(empty){appState.devices=[];appState.subnets=[];appState.ipAllocations=[];renderContent();}return backup;},empty);
  const values=await measure(page),{action,stats}=values.allocation;
  if(empty)assert.deepEqual(values.allocation.counts,[0,0,0],'Empty allocation counts');
  assert.ok(action.y>=stats.y+stats.height+17,'Allocation action has an independent 18px gap below all stats');
  await capture('allocation-'+(empty?'empty':'populated'));
  const button=page.getByRole('button',{name:'View IP Allocations',exact:true});
  if(empty){await button.focus();await page.keyboard.press('Enter');}else await button.click();
  await page.waitForFunction(()=>currentTab==='ipam');
  await page.evaluate(backup=>{Object.assign(appState,JSON.parse(backup));switchTab('dashboard');},backup);
 }
 for(const [tab,selector,values] of [
  ['account','.approved-account .subnav [data-tab="VALUE"]',['security','help','about']],
  ['settings','.approved-settings .subnav [data-tab="VALUE"]',['email','maintenance']],
  ['ipam','.ipam-tab[data-view="VALUE"]',['addresses','manage']],
  ['audit','.audit-tab[data-tab="VALUE"]',['assets','coverage']],
  ['users','.approved-page-header .tabs [data-tab="VALUE"]',['list','add']]
 ]){
  await go(tab);
  for(const value of values){await page.locator(selector.replace('VALUE',value)).click();await capture(tab+'-'+value);}
 }
 await go('audit');await page.locator('.audit-tab[data-tab="coverage"]').click();
 assert.equal(await page.locator('.audit-warn').textContent(),'Your security matters. Audit records track changes without storing passwords, authentication codes or other sensitive credentials.');
 await go('devices');
 for(const section of ['types','locations','manufacturers','models','software','services']){
  await page.evaluate(section=>{activeDeviceDetailsTab=section;renderContent();},section);await capture('catalogue-'+section);
  await page.evaluate(section=>{
   if(section==='types'||section==='locations')openDeviceCatalogueManager(section==='types'?'type':'location');
   if(section==='manufacturers')openHardwareManufacturerManager();
   if(section==='models')openHardwareModelManager();
   if(section==='software')openSoftwareCatalogueEditor();
   if(section==='services')openServerServiceEditor();
  },section);await capture('catalogue-dialog-'+section,true);await page.evaluate(()=>closeModal(true));
 }
 await page.evaluate(()=>{activeDeviceDetailsTab='overview';renderContent();});
 for(const tab of ['hardware','os','software','quality']){await page.locator('[data-action="device-intelligence-tab"][data-tab="'+tab+'"]').click();await capture('intelligence-'+tab);}
 }
 await go('devices');await page.evaluate(()=>{activeDeviceDetailsTab='overview';renderContent();openDeviceModal();});
 for(const tab of ['General','Hardware','Software & Firmware','Networking','Notes']){
  await page.locator('#modal-content [role="tab"]').filter({hasText:tab}).first().click();await capture('editor-'+tab.toLowerCase().replace(/[^a-z]+/g,'-'),true);
 }
 await page.locator('#modal-content [role="tab"]').filter({hasText:'General'}).first().click();
 const trigger=page.locator('#dev-type + .caffoot-select-host .caffoot-search-trigger');
 await trigger.click();await page.locator('.caffoot-search-popup:visible').waitFor();await capture('searchable-menu',true);
 await page.keyboard.press('Escape');assert.equal(await trigger.getAttribute('aria-expanded'),'false');
 await page.evaluate(()=>caffootSetTheme('system'));
 for(const scheme of ['light','dark','light']){
  await page.emulateMedia({colorScheme:scheme});
  await page.waitForFunction(expected=>document.documentElement.classList.contains('dark')===expected,scheme==='dark',{timeout:4000});
  assert.equal(await page.locator('html').evaluate(e=>e.classList.contains('dark')),scheme==='dark');
  assert.deepEqual(await page.locator('#dev-type').evaluate(e=>{const a=getComputedStyle(e),b=getComputedStyle(e.nextElementSibling.querySelector('button'));return [b.color,b.backgroundColor,b.borderColor];}),await page.locator('#dev-type').evaluate(e=>{const s=getComputedStyle(e);return [s.color,s.backgroundColor,s.borderColor];}),'Open searchable select follows System both ways');
 }
 await page.evaluate(theme=>{closeModal(true);caffootSetTheme(theme);},theme);
 await page.reload();await page.locator('#app[aria-busy="false"]').waitFor();assert.equal(await page.locator('html').evaluate(e=>e.classList.contains('dark')),theme==='dark','Theme survives reload');
 await go('devices');const devices=await page.evaluate(()=>JSON.stringify(appState.devices));
 await page.evaluate(()=>{activeDeviceDetailsTab='inventory';appState.devices=[];renderContent();});await capture('inventory-empty');
 await page.evaluate(devices=>{appState.devices=JSON.parse(devices);renderContent();},devices);
 await page.evaluate(()=>openDeviceDetailView(appState.devices[0].id));await capture('device-details',true);await page.evaluate(()=>closeModal(true));
 await go('ipam');
 for(const [name,fn,args] of [['subnet','openSubnetModal',[]],['ip','openIpModal',['10.0.10.21']],['bulk','openBulkIpModal',['net-0']]]){
  await page.evaluate(({fn,args})=>window[fn](...args),{fn,args});await capture('ipam-dialog-'+name,true);await page.evaluate(()=>closeModal(true));
 }
 await go('racks');
 for(const section of ['inventory','accessories']){await page.locator('[data-action="approved-rack-section"][data-section-tab="'+section+'"]').click();await capture('racks-'+section);}
 await page.evaluate(()=>{v13RackSection='inventory';selectedRackId=appState.racks[0].id;v13RackDetailOpen=true;renderContent();});await capture('rack-elevation');
 await page.evaluate(()=>openRackModal());await capture('rack-dialog',true);await page.evaluate(()=>closeModal(true));
 await go('users');await page.locator('.approved-page-header .tabs [data-tab="list"]').click();await page.locator('[data-action="users-open-editor"]').first().click();await capture('user-workspace');
 assert.ok(await page.locator('.users-management-modal input:disabled').count()>0,'Own account protections remain disabled');
 await page.locator('[data-action="users-close-editor"]').first().click();
 // A portrait fixture is generated in memory, uploaded only to the isolated account.
 await go('account');
 const button=page.locator('.header-account'),before=await button.boundingBox();
 const image=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=40;c.height=120;const x=c.getContext('2d');x.fillStyle='#ed8532';x.fillRect(0,0,40,120);x.fillStyle='#142b43';x.fillRect(0,0,40,30);return c.toDataURL('image/png').split(',')[1];});
 await page.locator('#account-photo-input').setInputFiles({name:'portrait.png',mimeType:'image/png',buffer:Buffer.from(image,'base64')});
 await page.locator('#header-account-initial img').waitFor();
 const photo=await page.locator('#header-account-initial img').evaluate(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e),p=getComputedStyle(e.closest('.header-account-photo'));return {width:r.width,height:r.height,fit:s.objectFit,position:s.objectPosition,radius:p.borderRadius,overflow:p.overflow};});
 assert.deepEqual(photo,{width:32,height:32,fit:'cover',position:'50% 50%',radius:'50%',overflow:'hidden'});
 assert.deepEqual(await button.boundingBox(),before,'Photo preserves account button geometry');
 const alternate=width===1440?390:1440;
 await page.setViewportSize({width:alternate,height:alternate===1440?950:844});
 assert.deepEqual(await page.locator('#header-account-initial img').evaluate(e=>({width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,naturalWidth:e.naturalWidth,naturalHeight:e.naturalHeight})),{width:32,height:32,naturalWidth:40,naturalHeight:120},'Portrait remains square when resized');
 await page.setViewportSize({width,height:width===1440?950:844});
 await page.locator('.topbar').screenshot({path:path.join(out,'portrait-header-'+theme+'-'+width+'.png')});
 await page.reload();await page.locator('#app[aria-busy="false"]').waitFor();await page.locator('#header-account-initial img').waitFor();
 await button.click();assert.equal(await page.evaluate(()=>currentTab),'account');
 await page.locator('[data-action="account-photo-remove"]').click();await page.waitForFunction(()=>!document.querySelector('#header-account-initial img'));
 await page.reload();await page.locator('#app[aria-busy="false"]').waitFor();assert.equal(await page.locator('#header-account-initial img').count(),0,'Removal survives reload');
 await page.locator('.topbar').screenshot({path:path.join(out,'placeholder-header-'+theme+'-'+width+'.png')});
 await navigation();
};
