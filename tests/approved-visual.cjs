// Capture the pinned originals and live screens using only isolated demonstration data.
const fs=require('fs'),path=require('path'),http=require('http'),{spawn,spawnSync}=require('child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=process.env.CAFFOOT_VISUAL_OUTPUT||path.join(root,'work','acceptance');
const tmp=fs.mkdtempSync(path.join(require('os').tmpdir(),'caffoot-visual-'));
const approved=path.join(tmp,'approved');fs.mkdirSync(approved);
const revision='c26db4a56bbc30f95b56201e81a7a76d13c6037b';
for(const source of JSON.parse(fs.readFileSync(path.join(root,'interface/design-sources.json')))){
 fs.writeFileSync(path.join(approved,path.basename(source.source)),spawnSync('git',['show',revision+':'+source.source],{cwd:root,maxBuffer:2*1024*1024}).stdout);
}
const seed=spawnSync('python3',[path.join(root,'tests/visual_fixtures.py'),tmp],{cwd:root,encoding:'utf8'});
if(seed.status!==0)throw Error(seed.stderr);
fs.mkdirSync(out,{recursive:true});
const creds=JSON.parse(fs.readFileSync(path.join(tmp,'test-credentials.json')));
const address='https://127.0.0.1:8080';
const server=spawn('python3',['-m','backend.server'],{cwd:root,env:{...process.env,PYTHONDONTWRITEBYTECODE:'1',CAFFOOT_DB_PATH:path.join(tmp,'inventory.sqlite3'),CAFFOOT_TLS_DIR:path.join(tmp,'tls'),CAFFOOT_WEB_ADDRESS:address,CAFFOOT_SERVER_ADDRESS:'127.0.0.1',CAFFOOT_HOST:'127.0.0.1'},stdio:'ignore'});
const reference=http.createServer((req,res)=>{
 const name=path.basename(req.url.split('?')[0]);
 if(!/^[a-z0-9-]+\.html$/.test(name)){res.writeHead(404);return res.end();}
 const filename=path.join(approved,name);
 if(!fs.existsSync(filename)){res.writeHead(404);return res.end();}
 res.writeHead(200,{'Content-Type':'text/html'});res.end(fs.readFileSync(filename));
});
let browser;
const items=[
 ['dashboard','dashboard-draft-02','dashboard',null],
 ['my-account','my-account-draft-06','account',null],
 ['settings','settings-data-draft-02','settings',null],
 ['devices-overview','devices-overview-draft-03','devices','overview'],
 ['device-inventory','devices-inventory-draft-02','devices','inventory'],
 ['device-details','devices-details-forms-batch-04','devices','details'],
 ['device-management','devices-management-batch-02','devices','manufacturers'],
 ['ipam','ipam-draft-01','ipam',null],
 ['racks','racks-draft-04','racks',null],
 ['users','users-permissions-draft-02','users',null],
 ['sign-in','sign-in-first-run-draft-03',null,null],
 ['audit-trail','audit-trail-draft-01','audit',null]
];
items.push(['rack-overview','racks-draft-04','racks',null,{kind:'rack-overview'}]);
for(const value of ['insights','activity'])items.push(['dashboard-'+value,'dashboard-draft-02','dashboard',null,{kind:'page-tab',live:'[data-action="dashboard-tab"][data-dashboard-tab="'+value+'"]',reference:'.subnav [data-tab="'+value+'"]'}]);
for(const value of ['security','help','about'])items.push(['account-'+value,'my-account-draft-06','account',null,{kind:'page-tab',live:'.approved-account .subnav [data-tab="'+value+'"]',reference:'.subnav [data-tab="'+value+'"]'}]);
for(const value of ['email','maintenance'])items.push(['settings-'+value,'settings-data-draft-02','settings',null,{kind:'page-tab',live:'.approved-settings .subnav [data-tab="'+value+'"]',reference:'.subnav [data-tab="'+value+'"]'}]);
for(const value of ['hardware','os','software','quality'])items.push(['devices-insight-'+value,'devices-overview-draft-03','devices','overview',{kind:'insight',value}]);
for(const value of ['types','locations','models','software','services'])items.push(['catalogue-'+value,'devices-management-batch-02','devices',value]);
for(const value of ['General','Hardware','Software & Firmware','Networking','Notes'])items.push(['device-editor-'+value.toLowerCase().replace(/[^a-z]+/g,'-'),'devices-details-forms-batch-04','devices','overview',{kind:'editor',value}]);
for(const [name,device] of [['device-editor-edit-general','Hypervisor-01'],['device-editor-virtual-general','App-VM-01']])items.push([name,'devices-details-forms-batch-04','devices','overview',{kind:'editor-existing',device}]);
for(const value of ['addresses','manage'])items.push(['ipam-'+value,'ipam-draft-01','ipam',null,{kind:'page-tab',live:'.ipam-tab[data-view="'+value+'"]',reference:'.ipam-tab[data-view="'+value+'"]'}]);
for(const value of ['equipment','settings'])items.push(['rack-'+value,'racks-draft-04','racks',null,{kind:'rack-tab',value}]);
for(const value of ['list','add'])items.push(['users-'+value,'users-permissions-draft-02','users',null,{kind:'page-tab',live:'.approved-page-header .tabs [data-tab="'+value+'"]',reference:'.tabs [data-tab="'+value+'"]'}]);
for(const value of ['hardware','network','software','location','virtual-machines'])items.push(['details-'+value,'devices-details-forms-batch-04','devices','details',{kind:'details-tab',value}]);
for(const value of ['ip','subnet','bulk'])items.push(['dialog-ipam-'+value,'ipam-draft-01','ipam',null,{kind:'ipam-dialog',value}]);
for(const value of ['add','edit','correct','device','accessory','vertical'])items.push(['dialog-rack-'+value,'racks-draft-04','racks',null,{kind:'rack-dialog',value}]);
items.push(['user-workspace','users-permissions-draft-02','users',null,{kind:'user-workspace'}]);
for(const value of ['types','locations','manufacturers','models','software','services'])items.push(['dialog-catalogue-'+value,'devices-management-batch-02','devices',value,{kind:'catalogue-dialog',value}]);
for(const value of ['assets','coverage'])items.push(['audit-'+value,'audit-trail-draft-01','audit',null,{kind:'page-tab',live:'.audit-tab[data-tab="'+value+'"]',reference:'.audit-tab[data-tab="'+value+'"]'}]);
const selectedItems=process.env.CAFFOOT_VISUAL_FILTER?items.filter(item=>new RegExp(process.env.CAFFOOT_VISUAL_FILTER).test(item[0])):items;
async function main(){
 await new Promise(resolve=>reference.listen(0,'127.0.0.1',resolve));
 browser=await chromium.launch({headless:true,executablePath:process.env.CAFFOOT_CHROMIUM_PATH||undefined,args:['--no-sandbox']});
 const context=await browser.newContext({ignoreHTTPSErrors:true});
 await context.route('https://raw.githubusercontent.com/**',r=>r.fulfill({contentType:'image/png',body:fs.readFileSync(root+'/assets/caffoot-logo-256.png')}));
 await context.route(/https:\/\/(fonts\.googleapis|fonts\.gstatic|cdnjs\.cloudflare)\.com\//,r=>r.abort());
 for(let i=0;i<40;i++){
  try{if((await context.request.get(address+'/health')).ok())break;}catch{}
  await new Promise(resolve=>setTimeout(resolve,100));
 }
 const code=spawnSync('python3',['-c','from backend.mfa import code_at;import sys,time;print(code_at(sys.argv[1],time.time()))',creds.secret],{cwd:root,encoding:'utf8'}).stdout.trim();
 const login=await context.request.post(address+'/api/login',{headers:{Origin:address},data:{username:creds.username,password:creds.password,mfa_code:code}});
 if(!login.ok())throw Error('Visual test login failed');
 const page=await context.newPage(),ref=await context.newPage(),results=[];
 for(const [name,file,tab,section,extra] of selectedItems){
  for(const [width,height]of [[1440,950],[390,844]]){
   await page.setViewportSize({width,height});await ref.setViewportSize({width,height});
   await ref.goto('http://127.0.0.1:'+reference.address().port+'/'+file+'.html');
   if(tab){
    await page.goto(address+'/inventory');await page.locator('#app[aria-busy="false"]').waitFor();
    await page.evaluate(tab=>switchTab(tab),tab);
    if(tab==='devices'&&section!=='details')await page.locator('[data-action="approved-device-section"][data-tab="'+section+'"]').click();
    if(section==='details'){
     await page.evaluate(()=>openDeviceDetailView(appState.devices[0].id));
     await ref.evaluate(()=>openDeviceDetails('Hypervisor-01'));
    }
    if(file==='devices-management-batch-02')await ref.evaluate(section=>switchDeviceTab(section),section);
    if(tab==='racks')await page.evaluate(()=>{selectedRackId=appState.racks[0].id;v13RackSection='inventory';v13RackDetailOpen=true;renderContent();});
    if(extra?.kind==='rack-overview'){
     await page.evaluate(()=>{v13RackSection='overview';renderContent();});
     await ref.locator('.racks-tabs [data-section-tab="overview"]').click();
    }
    if(extra?.kind==='page-tab'){
     await page.locator(extra.live).click();await ref.locator(extra.reference).click();
    }
    if(extra?.kind==='insight'){
     await page.locator('[data-action="device-intelligence-tab"][data-tab="'+extra.value+'"]').click();
     await ref.evaluate(value=>switchInsight(value),extra.value);
    }
    if(extra?.kind==='editor'){
     await page.evaluate(()=>openDeviceModal());
     await page.locator('#dev-type').selectOption('Server - Physical');
     await page.locator('#dev-location').selectOption('Server Room');
     await page.locator('#dev-mount-type').selectOption('Rack Mounted');
     await page.locator('#dev-rack-id').selectOption('rack-0');
     await ref.evaluate(()=>openDeviceEditor('add'));
     await page.locator('#modal-content [role="tab"]').filter({hasText:extra.value}).first().click();
     await ref.locator('#device-review-tabs [role="tab"]').filter({hasText:extra.value}).first().click();
    }
    if(extra?.kind==='editor-existing'){
     await page.evaluate(name=>openDeviceModal(appState.devices.find(device=>device.name===name).id),extra.device);
     await ref.evaluate(name=>openDeviceEditor('edit',name),extra.device);
     await page.locator('#device-editor-form').waitFor();
     for(const selector of ['#dev-deployment','#dev-type',...(extra.device==='App-VM-01'?['#dev-vm-purpose']:[])]){
      const field=page.locator(selector);
      if(!await field.isVisible()||!await field.isDisabled())throw Error('Existing classification must be visible and locked: '+selector);
     }

    }
    if(extra?.kind==='rack-tab'){
     await page.locator('[data-action="select-rack-tab"][data-tab="'+extra.value+'"]').click();
     await ref.locator('[data-rack-tab="'+extra.value+'"]').click();
    }
    if(extra?.kind==='details-tab'){
     await page.locator('#device-details-tab-'+extra.value).click();
     await ref.evaluate(value=>openDeviceDetails('Hypervisor-01',value),extra.value);
    }
    if(extra?.kind==='ipam-dialog'){
     if(extra.value==='ip'){await page.evaluate(()=>openIpModal('10.0.10.21'));await ref.evaluate(()=>openIp('10.0.10.21'));}
     if(extra.value==='subnet'){await page.evaluate(()=>openSubnetModal());await ref.evaluate(()=>openSubnet());}
     if(extra.value==='bulk'){await page.evaluate(()=>openBulkIpModal(appState.subnets[0].id));await ref.evaluate(()=>bulkEdit());}
    }
    if(extra?.kind==='rack-dialog'){
     if(['add','edit','correct'].includes(extra.value)){
      await page.evaluate(value=>openRackModal(value==='add'?null:appState.racks[0].id,value==='correct'),extra.value);
      await ref.evaluate(value=>openRackForm(value),extra.value);
     }else if(extra.value==='vertical'){
      await page.evaluate(()=>{selectedRackAccessoryType='pdu_vertical';openRackAccessoryEditor(appState.racks[0].id,1);});
      await ref.evaluate(()=>openVerticalAccessoryForm(1));
     }else{
      await page.evaluate(value=>openRackSlotPlacementDialog(appState.racks[0].id,20,value),extra.value);
      await ref.evaluate(value=>openRackItemForm(20,'',value),extra.value);
     }
    }
    if(extra?.kind==='catalogue-dialog'){
     await page.evaluate(value=>{
      if(value==='types'||value==='locations')openDeviceCatalogueManager(value==='types'?'type':'location');
      if(value==='manufacturers')openHardwareManufacturerManager();
      if(value==='models')openHardwareModelManager();
      if(value==='software')openSoftwareCatalogueEditor();
      if(value==='services')openServerServiceEditor();
     },extra.value);
     await ref.evaluate(value=>showCatalogModal(value),extra.value);
    }
    if(extra?.kind==='user-workspace'){
     await page.locator('.approved-page-header .tabs [data-tab="list"]').click();
     await page.locator('[data-action="users-open-editor"]').first().click();
     await ref.evaluate(()=>{setTab('list');openModal(initialUsers[0]);});
    }
   }else{
    const anonymous=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width,height}});
    const signin=await anonymous.newPage();await signin.goto(address+'/setup');await signin.locator('#form:not([hidden])').waitFor();
    await signin.screenshot({path:out+'/'+name+'-'+width+'-live.png',fullPage:true});await anonymous.close();
   }
   await page.waitForTimeout(180);await ref.waitForTimeout(100);
   const measure=async p=>p.evaluate(()=>{
    const selectors=['.racks-tabs','.racks-hub-bar','.racks-grid','.sidebar','.topbar','.header h1','.main','.device-review-dialog','.db-summary','.account-grid','.device-filters','.intelligence-metrics','.ipam-stats','.racks-grid','.cards4','.catalog-header','.catalog-kpis','.catalog-card','.catalog-card-top','.catalog-toolbar','.catalog-record','.modal-layer .modal','.modal-head','.modal-body','.profile-modal-grid','.profile-modal-grid .field','.profile-modal-grid label','.profile-modal-grid .input','.access-grid','.device-review-overlay','.device-review-head','.device-review-body','.device-review-footer','.device-review-panel','.device-review-form-grid','.device-review-field select','.device-review-field textarea'];
    const result={overflow:document.documentElement.scrollWidth>innerWidth};
    const renderedControl=element=>element?.classList.contains('caffoot-search-native')
      ? element.nextElementSibling?.querySelector('.caffoot-search-trigger') : element;

    for(const selector of selectors){const e=[...document.querySelectorAll(selector)].map(renderedControl).find(element=>element&&element.getBoundingClientRect().height>0&&getComputedStyle(element).opacity!=='0');if(e){const s=getComputedStyle(e),r=e.getBoundingClientRect();result[selector]={x:Math.round(r.x),y:Math.round(r.y),width:Math.round(r.width),height:Math.round(r.height),fontSize:s.fontSize,columns:s.gridTemplateColumns,padding:s.padding,margin:s.margin,gap:s.gap,borderRadius:s.borderRadius,borderColor:s.borderColor,fontWeight:s.fontWeight,lineHeight:s.lineHeight,boxSizing:s.boxSizing};}}
    const identity={};
    for(const key of ['name','deployment','type','vm-purpose','location','status']){
     const element=renderedControl(document.getElementById('dev-'+key)||document.getElementById('review-'+key)||
      (key==='deployment'?document.getElementById('review-fixed-deployment'):null));
     if(element&&element.getBoundingClientRect().height>0){const r=element.getBoundingClientRect();identity[key]={x:Math.round(r.x),y:Math.round(r.y),width:Math.round(r.width),height:Math.round(r.height)};}
    }
    if(Object.keys(identity).length)result.identity=identity;
    return result;
   });
   if(tab)await page.screenshot({path:out+'/'+name+'-'+width+'-live.png',fullPage:true});
   await ref.screenshot({path:out+'/'+name+'-'+width+'-approved.png',fullPage:true});
   results.push({screen:name,width,live:tab?await measure(page):null,approved:await measure(ref),status:'captured; visual review pending'});
   if(extra?.kind==='editor-existing'){
    await page.getByRole('button',{name:'Back to Details',exact:true}).click();
    await page.locator('.device-details-dialog .device-review-head h2').filter({hasText:extra.device}).waitFor();
    await page.waitForFunction(async()=>{
     const state=await (await fetch('/api/inventory/state',{cache:'no-store'})).json();
     return Object.keys(state.deviceEditors||{}).length===0;
    });
   }

  }
  console.log('Captured',name);
 }
 let combined=results;
 if(process.env.CAFFOOT_VISUAL_FILTER && fs.existsSync(out+'/visual-measurements.json')){
  const previous=JSON.parse(fs.readFileSync(out+'/visual-measurements.json'));
  combined=previous.filter(old=>!results.some(current=>current.screen===old.screen&&current.width===old.width)).concat(results);
 }
 fs.writeFileSync(out+'/visual-measurements.json',JSON.stringify(combined,null,2));
 fs.writeFileSync(out+'/comparisons.html','<!doctype html><meta charset="utf-8"><title>Caffoot Lite v2.1 comparisons</title><style>body{font:14px system-ui;margin:20px;background:#eef2f6}section{margin:20px 0}div{display:grid;grid-template-columns:1fr 1fr;gap:16px}img{width:100%;border:1px solid #ccc}h2{margin-top:30px}</style><h1>Approved and Live Interface Comparisons</h1><p>Left: pinned approved HTML. Right: live application with test data. Captured at desktop and mobile widths. Different data and conditional permissions are expected; capture alone is not a fidelity pass.</p>'+items.map(([name])=>[1440,390].map(w=>`<section><h2>${name} — ${w}px</h2><div><a href="${name}-${w}-approved.png"><img src="${name}-${w}-approved.png" alt="Approved ${name}"></a><a href="${name}-${w}-live.png"><img src="${name}-${w}-live.png" alt="Live ${name}"></a></div></section>`).join('')).join(''));
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{await browser?.close();reference.close();server.kill('SIGTERM');fs.rmSync(tmp,{recursive:true,force:true});});
