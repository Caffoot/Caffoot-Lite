// Focused Stage 2 interface acceptance using fictional SQLite data and pinned designs.
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),http=require('node:http');
const {spawn,spawnSync}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),temporary=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-feature-ui-'));
const database=path.join(temporary,'inventory.sqlite3'),address='https://127.0.0.1:8080';
const output=process.env.CAFFOOT_VISUAL_OUTPUT||path.join(root,'work','batch4-browser');fs.mkdirSync(output,{recursive:true});
const python=(code,args=[])=>{
 const result=spawnSync('python3',['-c',code,...args],{cwd:root,encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);return result.stdout.trim();
};
const identity=JSON.parse(python(`
import json,sqlite3,sys,time,copy
from backend.schema import initialise_database
from backend.accounts import bootstrap_first_admin,confirm_admin_mfa
from backend.permissions import create_user
from backend.mfa import code_at
from backend.sessions import login_session
from backend.request_auth import csrf_for_session
from backend.http_security import COOKIE_NAME
from backend.inventory import stage_inventory
from backend.normalisation_pipeline import PUBLISHED_DEFAULTS
with sqlite3.connect(sys.argv[1]) as db:
 initialise_database(db)
 db.execute("UPDATE organisation_features SET enabled=1 WHERE feature IN ('devices','ipam','racks')");db.commit()
 owner,secret=bootstrap_first_admin(db,'owner','Fictional-Test-Password')
 confirm_admin_mfa(db,owner,code_at(secret,time.time()),timestamp=time.time())
 token=login_session(db,'owner','Fictional-Test-Password',mfa_code=code_at(secret,time.time()))
 result=dict(cookie=COOKIE_NAME,owner=token,csrf=csrf_for_session(token))
 for name,grants in [('editor',{'Devices':'edit'}),('ipam',{'IPAM':'read'}),('both',{'Devices':'read','IPAM':'read'}),('racks',{'Racks':'read'})]:
  user=create_user(db,owner,name,'Fictional-Test-Password')
  db.execute('UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?',(secret,user))
  db.executemany('INSERT INTO account_permission_overrides VALUES(?,?,?)',[(user,key,value) for key,value in grants.items()]);db.commit()
  result[name]=login_session(db,name,'Fictional-Test-Password',mfa_code=code_at(secret,time.time()))
 state=copy.deepcopy(PUBLISHED_DEFAULTS)
 state.update(devices=[dict(id='mounted',name='Mounted Switch',type='Switch',mountType='Rack Mounted',rackId='rack',rackUStart=2,rackUEnd=2,rackUHeight=1,face='rear',location='Original Rack Name',primaryIp='10.0.0.10'),dict(id='shelf',name='Shelf Printer',type='Printer',mountType='Tabletop / Shelf Mounted',rackId='rack',rackShelfAccessoryId='shelf-a',rackUStart=None,rackUEnd=None,rackUHeight=None,face=None,location='Original Shelf Location',primaryIp=''),dict(id='inside',name='Basic Inside',type='Printer',mountType='Tabletop / Shelf Mounted',location='Office',primaryIp='10.0.0.20',primaryIpMode='basic'),dict(id='inside-second',name='Basic Choice',type='Printer',mountType='Tabletop / Shelf Mounted',location='Office',primaryIp='10.0.0.21',primaryIpMode='basic'),dict(id='outside',name='Basic Outside',type='Printer',mountType='Tabletop / Shelf Mounted',location='Office',primaryIp='192.0.2.10',primaryIpMode='basic'),dict(id='blank',name='No IP',type='Printer',mountType='Tabletop / Shelf Mounted',location='Office',primaryIp='')],subnets=[dict(id='lan',name='Office LAN',kind='network',purpose='LAN',cidr='10.0.0.0/24',gateway='10.0.0.1')],racks=[dict(id='rack',name='Network Rack',heightU=12)],rackAccessories=[dict(id='shelf-a',type='shelf',rackId='rack',name='Printer Shelf',face='front',startU=4,heightU=1)],ipAllocations={'10.0.0.10':dict(status='Assigned',deviceId='mounted',hostname='Mounted Switch',notes='Keep'),'10.0.0.20':dict(status='Available',hostname='',notes='Preserve address note')},deviceLocations=['Unknown','Office','Original Rack Name','Original Shelf Location'])
 stage_inventory(db,state)
 print(json.dumps(result))
`,[database]));
const snapshot=()=>JSON.parse(python(`
import json,sqlite3,sys
with sqlite3.connect(sys.argv[1]) as db:
 print(json.dumps({table:db.execute('SELECT * FROM '+table+' ORDER BY rowid').fetchall() for table in ['inventory_devices','inventory_racks','inventory_rack_accessories','inventory_ip_allocations','role_grants','account_permission_overrides']}))
`,[database]));
const records=()=>Object.fromEntries(snapshot().inventory_devices.map(row=>[row[0],JSON.parse(row[2])]));
const log=fs.openSync(path.join(temporary,'server.log'),'a');
const server=spawn('python3',['-m','backend.server'],{cwd:root,stdio:['ignore',log,log],env:{...process.env,CAFFOOT_DB_PATH:database,CAFFOOT_TLS_DIR:path.join(temporary,'tls'),CAFFOOT_WEB_ADDRESS:address,CAFFOOT_SERVER_ADDRESS:'127.0.0.1',CAFFOOT_HOST:'127.0.0.1'}});
const revision='c26db4a56bbc30f95b56201e81a7a76d13c6037b';
const sources=['settings-data-draft-02','ipam-draft-01','devices-details-forms-batch-04'];
const originals=Object.fromEntries(sources.map(name=>{
 const result=spawnSync('git',['show',revision+':future-design/approved/'+name+'.html'],{cwd:root,encoding:'utf8',maxBuffer:2*1024*1024});assert.equal(result.status,0,result.stderr);return[name,result.stdout];
}));
const reference=http.createServer((request,response)=>{
 const name=path.basename(request.url).replace(/\.html$/,'');
 if(!(name in originals)){response.writeHead(404);return response.end();}
 response.writeHead(200,{'Content-Type':'text/html'});response.end(originals[name]);
});
let browser;
const errors=[],metrics=[],screens=[];
(async()=>{
 try{
  await new Promise(resolve=>reference.listen(0,'127.0.0.1',resolve));
  browser=await chromium.launch({headless:true,executablePath:process.env.CAFFOOT_CHROMIUM_PATH||'/usr/bin/chromium'});
  const contexts={};
  for(const name of ['owner','editor','ipam','both','racks']){
   const context=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:950}});
   await context.addCookies([{name:identity.cookie,value:identity[name],url:address,secure:true,httpOnly:true,sameSite:'Strict'}]);
   await context.route('https://raw.githubusercontent.com/**',route=>route.fulfill({contentType:'image/png',body:fs.readFileSync(path.join(root,'assets/caffoot-logo-256.png'))}));
   await context.route(/https:\/\/(fonts\.googleapis|fonts\.gstatic|cdnjs\.cloudflare)\.com\//,route=>route.abort());
   contexts[name]=context;
  }
  for(let attempt=0;attempt<40;attempt++){
   try{if((await contexts.owner.request.get(address+'/health')).ok())break;}catch{}
   await new Promise(resolve=>setTimeout(resolve,100));
  }
  const open=async(name='owner',hash='')=>{
   const page=await contexts[name].newPage();page.setDefaultTimeout(12000);page.on('pageerror',error=>errors.push(error.message));
   await page.goto(address+'/inventory'+hash);await page.locator('#app[aria-busy="false"]').waitFor();return page;
  };
  const owner=await open('owner','#settings');
  const featurePanel=async()=>{
   await owner.evaluate(()=>switchTab('settings'));
   await owner.locator('.settings-screen [data-tab="features"]').click();
   await owner.locator('[data-optional-feature="devices"]').waitFor({state:'attached'});
  };
  let featurePosts=0;
  owner.on('request',request=>{if(request.method()==='POST'&&request.url().endsWith('/api/settings/features'))featurePosts++;});
  const toggle=async(feature,enabled,confirm=true)=>{
   await featurePanel();
   const control=owner.locator('[data-optional-feature="'+feature+'"]');
   const previous=await control.isChecked();if(previous===enabled)return;
   let confirmationShown=false;
   if(!enabled)owner.once('dialog',dialog=>{confirmationShown=true;return confirm?dialog.accept():dialog.dismiss();});
   const request=confirm?owner.waitForResponse(response=>response.url().endsWith('/api/settings/features')&&response.request().method()==='POST'):null;
   await control.click({force:true});
   if(!enabled)assert.ok(confirmationShown,'Every disable must ask for confirmation');
   if(!confirm){assert.equal(await control.isChecked(),previous);return;}
   assert.equal((await request).status(),200);
   await owner.waitForFunction(({feature,enabled})=>{
    const card=document.querySelector('[data-feature-card="'+feature+'"]'),input=card?.querySelector('input');
    return input&&!input.disabled&&input.checked===enabled&&card.querySelector('[data-feature-status]').textContent===(enabled?'Enabled':'Disabled');
   },{feature,enabled});
  };
  await featurePanel();
  assert.deepEqual(await owner.locator('.settings-screen .subnav [role="tab"]').allTextContents(),[' Data & Backups',' Email Settings',' System Maintenance',' Optional Features']);
  for(const feature of ['suppliers','equipment_lifecycle']){
   assert.ok(await owner.locator('[data-optional-feature="'+feature+'"]').isDisabled());
   assert.match(await owner.locator('[data-feature-card="'+feature+'"] [data-feature-status]').textContent(),/Coming in Stage 4/);
  }
  const beforeCancel=snapshot(),postCount=featurePosts;
  await toggle('racks',false,false);assert.equal(featurePosts,postCount);assert.deepEqual(snapshot(),beforeCancel);
  await toggle('racks',false);
  assert.deepEqual(snapshot(),beforeCancel,'Feature change must preserve inventory and grants');
  const editor=await open('editor','#devices');
  const placementFields=['mountType','rackId','rackUStart','rackUEnd','rackUHeight','face','rackShelfAccessoryId','location'];
  for(const id of ['mounted','shelf']){
   const before=records()[id];
   await editor.evaluate(id=>openDeviceModal(id),id);await editor.locator('#device-editor-form').waitFor();
   assert.equal(await editor.locator('#device-form-mounting-options').isVisible(),false);
   assert.ok(await editor.locator('#dev-location').isDisabled());
   await editor.locator('#dev-name').fill(before.name+' Edited');
   const request=editor.waitForRequest(request=>request.url().endsWith('/api/devices/edit/save')&&request.method()==='POST');
   await editor.locator('button[form="device-editor-form"][type="submit"]').click();
   const payload=(await request).postDataJSON();
   for(const key of placementFields)assert.equal(key in payload.record,false,'Hidden field was resubmitted: '+key);
   await editor.waitForFunction(()=>document.getElementById('modal-container').classList.contains('hidden'));
   const saved=records()[id];for(const key of placementFields)assert.deepEqual(saved[key],before[key],key);
  }
  await editor.evaluate(()=>openDeviceModal());await editor.locator('#device-editor-form').waitFor();
  for(const type of ['Printer','Switch','UPS','Desktop']){
   await editor.locator('#dev-type').selectOption(type,{force:true});
   const options=await editor.locator('#dev-mount-type option').evaluateAll(options=>options.filter(option=>option.value).map(option=>option.value));
   assert.ok(options.length);assert.equal(options.includes('Rack Mounted'),false);
   const recognised=await editor.evaluate(type=>getRecognisedDeviceMountTypes(type),type);
   assert.ok(options.every(option=>recognised.includes(option)));
   assert.equal(await editor.locator('.device-editor-shelf-placement').isVisible(),false);
  }
  await editor.evaluate(()=>closeModal(true));
  await toggle('devices',false);await toggle('ipam',false);
  await owner.locator('#next-users-nav').click();await owner.waitForFunction(()=>currentTab==='users');
  await owner.locator('#next-settings-nav').click();await owner.waitForFunction(()=>currentTab==='settings');
  await featurePanel();await toggle('devices',true);await toggle('ipam',true);
  const ipam=await open('ipam','#ipam');
  assert.equal(await ipam.getByText('Basic IPs Outside Subnets',{exact:true}).count(),0);
  const both=await open('both','#ipam');
  assert.equal(await both.locator('.ipam-stat').filter({hasText:'Basic IPs Outside Subnets'}).locator('strong').textContent(),'1');
  await both.evaluate(()=>openDeviceDetailView('inside'));await both.locator('#device-details-tab-network').click();
  assert.equal(await both.locator('[data-action="open-device-ipam-link"]').count(),0);
  assert.equal((await contexts.racks.request.get(address+'/api/inventory/state')).status(),403,'Racks-off account must have no inventory');
  await owner.evaluate(()=>switchTab('devices'));
  const showNetwork=async id=>{await owner.evaluate(id=>openDeviceDetailView(id),id);await owner.locator('#device-details-tab-network').click();};
  await showNetwork('outside');await owner.locator('[data-action="open-device-ipam-link"]').click();
  await owner.locator('#device-ipam-link-form').waitFor();
  assert.match(await owner.locator('#device-ipam-link-feedback').textContent(),/No suitable existing subnet/);
  assert.ok(await owner.locator('button[form="device-ipam-link-form"]').isDisabled());
  const noCandidate=snapshot();await owner.locator('button[data-action="cancel-device-ipam-link"]').last().click();assert.deepEqual(snapshot(),noCandidate);
  await owner.evaluate(()=>closeModal(true));await showNetwork('inside');
  await owner.locator('[data-action="open-device-ipam-link"]').click();await owner.locator('#device-ipam-link-subnet').selectOption('lan');
  const cancelled=snapshot();await owner.locator('button[data-action="cancel-device-ipam-link"]').last().click();assert.deepEqual(snapshot(),cancelled);
  await owner.locator('[data-action="open-device-ipam-link"]').click();await owner.locator('#device-ipam-link-subnet').selectOption('lan');
  python("import sqlite3,sys\nwith sqlite3.connect(sys.argv[1]) as db:db.execute(\"UPDATE inventory_devices SET revision=revision+1 WHERE id='inside'\")",[database]);
  await owner.locator('button[form="device-ipam-link-form"]').click();
  await owner.locator('#device-ipam-link-feedback').filter({hasText:'revision changed'}).waitFor();
  assert.equal(records().inside.primaryIpMode,'basic');
  await owner.locator('button[data-action="cancel-device-ipam-link"]').last().click();
  await owner.locator('[data-action="open-device-ipam-link"]').click();await owner.locator('#device-ipam-link-subnet').selectOption('lan');
  await owner.locator('button[form="device-ipam-link-form"]').click();await owner.locator('.device-details-dialog').waitFor();
  assert.equal(records().inside.primaryIpMode,undefined);
  const allocation=snapshot().inventory_ip_allocations.find(row=>row[0]==='10.0.0.20');
  assert.equal(JSON.parse(allocation[1]).notes,'Preserve address note');assert.equal(JSON.parse(allocation[1]).deviceId,'inside');
  console.log('PASS: switches/cancel/all-off essentials, Rack/shelf omission preservation, type choices, permission-safe count, no-subnet/cancel/stale/success linking.');
  // Compare only the three approved additions with the pinned current v2.1 sources.
  for(const [width,height] of [[1440,950],[390,844]]){
   await owner.setViewportSize({width,height});
   const ref=await contexts.owner.newPage();await ref.setViewportSize({width,height});
   for(const [name,file,tab] of [['settings','settings-data-draft-02','settings'],['ipam','ipam-draft-01','ipam'],['network','devices-details-forms-batch-04','devices']]){
    await ref.goto('http://127.0.0.1:'+reference.address().port+'/'+file+'.html');
    if(name==='network')await ref.evaluate(()=>openDeviceDetails('Hypervisor-01','network'));
    if(name==='settings')metrics.push({width,theme:'light',area:'approved-settings',geometry:await ref.evaluate(()=>{const main=document.querySelector('main.main'),nav=document.querySelector('.subnav'),card=document.querySelector('.card-padded');return {mainWidth:main.getBoundingClientRect().width,navGap:getComputedStyle(nav).gap,cardRadius:getComputedStyle(card).borderRadius,cardPadding:getComputedStyle(card).padding};})});
    const filename='approved-'+name+'-'+width+'.png';await ref.screenshot({path:path.join(output,filename),fullPage:true});screens.push(filename);
   }
   await ref.close();
   for(const theme of ['light','dark']){
    await owner.evaluate(theme=>{closeModal(true);caffootSetTheme(theme);},theme);
    await featurePanel();
    await owner.locator('[data-feature-card="devices"]').waitFor();
    const capture=async name=>{
     await owner.screenshot({path:path.join(output,name+'-'+theme+'-'+width+'.png'),fullPage:!(name.startsWith('link-')||name.startsWith('device-network')||name.startsWith('racks-off-'))});screens.push(name+'-'+theme+'-'+width+'.png');
     assert.ok(await owner.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal document overflow: '+name);
    };
    await capture('optional-features');
    const panel=owner.locator('.settings-screen');
    metrics.push({width,theme,area:'settings',geometry:await panel.evaluate(node=>{const main=node.querySelector('main'),nav=node.querySelector('.subnav'),card=node.querySelector('[data-feature-card]');return {mainWidth:main.getBoundingClientRect().width,navGap:getComputedStyle(nav).gap,cardRadius:getComputedStyle(card).borderRadius,cardPadding:getComputedStyle(card).padding};})});
    await owner.evaluate(()=>switchTab('ipam'));await capture('ipam-overview');
    await owner.evaluate(()=>switchTab('devices'));await showNetwork('outside');await capture('device-network');
    await owner.locator('[data-action="open-device-ipam-link"]').click();await owner.locator('#device-ipam-link-form').waitFor();await capture('link-no-subnet');
    assert.equal(await owner.locator('#modal-content').getAttribute('aria-labelledby'),'caffoot-modal-heading');
    await owner.keyboard.press('Tab');assert.ok(await owner.locator('#modal-content').evaluate(node=>node.contains(document.activeElement)));
    await owner.locator('button[data-action="cancel-device-ipam-link"]').last().click();await owner.evaluate(()=>closeModal(true));
    await showNetwork('inside-second');await owner.locator('[data-action="open-device-ipam-link"]').click();
    await owner.locator('#device-ipam-link-subnet').selectOption('lan');await capture('link-existing-subnet');
    await owner.locator('button[data-action="cancel-device-ipam-link"]').last().click();await owner.evaluate(()=>closeModal(true));
    await owner.evaluate(()=>openDeviceModal('mounted'));await owner.locator('#device-editor-form').waitFor();await capture('racks-off-device');
    await owner.evaluate(()=>closeModal(true));
    await owner.evaluate(()=>openDeviceModal());await owner.locator('#device-editor-form').waitFor();
    await owner.locator('#dev-type').selectOption('Switch',{force:true});
    await owner.locator('#device-form-mounting-options').scrollIntoViewIfNeeded();await capture('racks-off-new-device');
    await owner.evaluate(()=>closeModal(true));
   }
  }
  await toggle('racks',true);
  await owner.evaluate(()=>{switchTab('devices');openDeviceModal('mounted');});await owner.locator('#device-editor-form').waitFor();
  assert.ok(await owner.locator('#device-form-mounting-options').isVisible());
  assert.equal(await owner.locator('#dev-mount-type').inputValue(),'Rack Mounted');
  assert.equal(await owner.locator('#dev-rack-id').isDisabled(),false);
  await owner.evaluate(()=>closeModal(true));
  const rackPage=await open('racks','#racks');
  assert.equal((await contexts.racks.request.get(address+'/api/inventory/state')).status(),200);
  assert.equal(await rackPage.getByText('Mounted Switch Edited',{exact:true}).count(),0);
  await toggle('racks',false);
  python("import sqlite3,sys\nwith sqlite3.connect(sys.argv[1]) as db:\n db.execute('DELETE FROM device_edit_reservations')\n db.execute('DELETE FROM inventory_devices')",[database]);
  await toggle('devices',false);await toggle('devices',true);
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(output,'measurements.json'),JSON.stringify({revision,screens,metrics,pageErrors:errors},null,2));
  console.log('PASS: '+screens.length+' desktop/mobile light/dark and pinned-source screenshots; no page errors or checked document overflow.');
 }catch(error){
  fs.writeFileSync(path.join(output,'failure.txt'),String(error)+'\n'+fs.readFileSync(path.join(temporary,'server.log'),'utf8'));
  throw error;
 }finally{
  if(browser)await browser.close();server.kill();await new Promise(resolve=>reference.close(resolve));fs.closeSync(log);fs.rmSync(temporary,{recursive:true,force:true});
 }
})().catch(error=>{console.error(error);process.exitCode=1;});
