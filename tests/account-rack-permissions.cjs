// Check own-role presentation and existing rack permissions against real HTTPS/SQLite.
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn,spawnSync}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-account-racks-'));
const out=process.env.CAFFOOT_CORRECTIONS_OUTPUT||path.join(tmp,'evidence');
fs.mkdirSync(out,{recursive:true});
const address='https://127.0.0.1:8080',password='Fictional-Correction-Password!';
let server,browser;
function python(source,args=[]){
 const result=spawnSync('python3',['-c',source,...args],{cwd:root,encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);return result.stdout.trim();
}
const secret='JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP';
async function run(){
 const fixture=spawnSync('python3',['tests/visual_fixtures.py',tmp],{cwd:root,encoding:'utf8'});
 assert.equal(fixture.status,0,fixture.stderr);
 const mountedDeviceId=python(`import sqlite3,sys
from backend.permissions import create_user
from backend.inventory import reconstruct_inventory,stage_inventory
db=sqlite3.connect(sys.argv[1]);db.execute('PRAGMA foreign_keys=ON')
disabled=db.execute("INSERT INTO roles(role_key,name,enabled) VALUES('display_disabled','Disabled <Support>',0)").lastrowid
db.execute("INSERT INTO role_grants VALUES(?,'Racks','edit')",(disabled,));db.execute('INSERT INTO account_roles VALUES(1,?)',(disabled,));db.commit()
for name,racks,devices in [('rack-reader','read',None),('mixed-reader','read','edit'),('rack-editor','edit','edit'),('staff-display',None,None)]:
 user=create_user(db,1,name,sys.argv[2])
 db.execute('INSERT INTO account_roles VALUES(?,?)',(user,disabled))
 if racks:
  role=db.execute('INSERT INTO roles(role_key,name) VALUES(?,?)',(name.replace('-','_'),name.title())).lastrowid
  db.execute('INSERT INTO account_roles VALUES(?,?)',(user,role));db.execute("INSERT INTO role_grants VALUES(?,'Racks',?)",(role,racks))
  if devices:db.execute("INSERT INTO role_grants VALUES(?,'Devices',?)",(role,devices))
  db.execute('UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?',(sys.argv[3],user))
 db.commit()
state=reconstruct_inventory(db)
state['rackAccessories']=[{'id':'display-patch','name':'Visible Patch Panel','rackId':'rack-0','type':'patch','face':'front','startU':1,'heightU':1,'portCount':24}, {'id':'display-vertical','name':'Visible Vertical PDU','rackId':'rack-0','type':'pdu_vertical','face':'front','side':'left','startU':1,'heightU':5}]
stage_inventory(db,state);db.commit()
print(next(device['id'] for device in state['devices'] if device.get('rackId')=='rack-0'))
`,[path.join(tmp,'inventory.sqlite3'),password,secret]);
 const log=fs.openSync(path.join(tmp,'server.log'),'w');
 server=spawn('python3',['-m','backend.server'],{cwd:root,stdio:['ignore',log,log],env:{...process.env,CAFFOOT_DB_PATH:path.join(tmp,'inventory.sqlite3'),CAFFOOT_TLS_DIR:path.join(tmp,'tls'),CAFFOOT_WEB_ADDRESS:address,CAFFOOT_SERVER_ADDRESS:'127.0.0.1',CAFFOOT_HOST:'127.0.0.1',CAFFOOT_PORT:'8080'}});
 browser=await chromium.launch({headless:true,executablePath:process.env.CAFFOOT_CHROMIUM_PATH||undefined,args:['--no-sandbox']});
 const contexts=[];
 async function login(username,credentials={password,secret}){
  const context=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:1000}});contexts.push(context);
  const mfa=credentials.secret?python('from backend.mfa import code_at;import sys,time;print(code_at(sys.argv[1],time.time()))',[credentials.secret]):undefined;
  const response=await context.request.post(address+'/api/login',{headers:{Origin:address},data:{username,password:credentials.password,mfa_code:mfa}});
  assert.equal(response.status(),200,await response.text());return context;
 }
 const probe=await browser.newContext({ignoreHTTPSErrors:true});
 for(let attempt=0;attempt<60;attempt++){
  try{if((await probe.request.get(address+'/health')).ok())break;}catch{}
  await new Promise(resolve=>setTimeout(resolve,100));
 }
 await probe.close();
 for(const name of ['staff-display','rack-reader','owner']){
  const credentials=name==='owner'?JSON.parse(fs.readFileSync(path.join(tmp,'test-credentials.json'))):{password,secret:name==='staff-display'?null:secret};
  const context=await login(name,credentials),page=await context.newPage();
  await page.goto(address+'/account');await page.locator('#app[aria-busy="false"]').waitFor();
  const roles=page.locator('[aria-label="Assigned Roles"]').first();
  assert.match(await roles.innerText(),/Staff Member/);assert.match(await roles.innerText(),/Disabled <Support> \(Disabled\)/);
  if(name==='rack-reader')assert.match(await roles.innerText(),/Rack-Reader/);
  assert.equal(await page.locator('[aria-label="Assigned Roles"] img').count(),0,'Role names must be escaped');
  assert.equal(await page.locator('[aria-label="Administrator Status"]').count(),name==='owner'?2:0);
  await page.evaluate(()=>{activeAccountSection='security';renderContent();});
  assert.match(await page.locator('[aria-label="Assigned Roles"]').first().innerText(),/Staff Member/);
  if(name==='staff-display'){
   const session=await (await context.request.get(address+'/api/session')).json();
   assert.equal(session.can_enter_inventory,false);assert.equal(session.mfa_enrolled,false);
   assert.equal((await context.request.get(address+'/api/inventory/state')).status(),403);
   await page.setViewportSize({width:390,height:844});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.screenshot({path:path.join(out,'account-staff-390.png'),fullPage:true});
  }
  if(name==='owner')await page.screenshot({path:path.join(out,'account-admin-1440.png'),fullPage:true});
  await context.close();
 }
 console.log('PASS: My Account shows Staff Member, additional/disabled roles and separate Administrator status; Staff security unchanged');
 for(const name of ['rack-reader','mixed-reader','rack-editor']){
  const context=await login(name),page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  const session=await (await context.request.get(address+'/api/session')).json();
  const before=await (await context.request.get(address+'/api/inventory/state')).json();
  assert.equal(before.racks.length,3);assert.equal(before.rackAccessories.length,2);
  await page.goto(address+'/inventory');await page.locator('#app[aria-busy="false"]').waitFor();
  await page.evaluate(()=>{switchTab('racks');v13RackSection='inventory';v13RackDetailOpen=true;selectedRackId='rack-0';activeRackTab='view';activeRackFace='front';renderContent();});
  await page.locator('.rack-elevation').waitFor();
  const visibleDevices=(before.devices||[]).filter(device=>device.rackId==='rack-0'&&(device.face||'front')==='front');
  assert.equal(await page.locator('.rack-elevation [data-rack-device]').count(),visibleDevices.length,
    'Mounted-device visibility must follow existing Devices permission');
  assert.equal(Object.hasOwn(before,'devices'),name!=='rack-reader');
  assert.equal(await page.locator('.rack-elevation [data-rack-accessory="display-patch"]').count(),1);
  assert.equal(await page.locator('.rack-elevation [data-vertical-accessory="display-vertical"]').count(),1);
  const editing=name==='rack-editor';
  const actions='[data-action="unassign-device"],[data-action="assign-device"],[data-action="edit-rack-accessory"],[data-action="delete-rack-accessory"],[data-action="place-rack-item"],[data-action="add-vertical-rack-accessory"],[data-action="mount-rack-accessory"],[data-action="edit-rack"],[data-action="delete-rack"],[data-action="correct-rack-specifications"]';
  assert.equal((await page.locator('.rack-elevation').locator(actions).filter({visible:true}).count())>0,editing);
  assert.equal((await page.locator('.rack-elevation [draggable="true"]').count())>0,editing);
  if(!editing){
   assert.ok(await page.locator('.rack-elevation span.rack-empty-state').count()>0,'Empty U positions retain their height');
   assert.equal(await page.locator('.rack-elevation button[data-vertical-accessory]').count(),0);
  }
  const request={headers:{Origin:address,'X-CSRF-Token':session.csrf_token}};
  const rack=before.racks.find(record=>record.id==='rack-0');
  const save=await context.request.post(address+'/api/inventory/record/save',{...request,data:{collection:'racks',id:rack.id,record:{...rack,name:rack.name+' Checked'}}});
  assert.equal(save.status(),editing?200:403,await save.text());
  if(editing)assert.equal((await context.request.post(address+'/api/inventory/record/save',{...request,data:{collection:'racks',id:rack.id,record:rack}})).status(),200);
  else{
   assert.equal((await context.request.post(address+'/api/inventory/record/delete',{...request,data:{collection:'rackAccessories',id:'display-patch'}})).status(),403);
   const after=await (await context.request.get(address+'/api/inventory/state')).json();
   assert.deepEqual(after.racks,before.racks);assert.deepEqual(after.rackAccessories,before.rackAccessories);assert.deepEqual(after.devices,before.devices);
  }
  const placement=await context.request.post(address+'/api/devices/edit/start',{...request,data:{deviceId:mountedDeviceId,section:'Racks'}});
  assert.equal(placement.status(),editing?200:403,await placement.text());
  if(editing)assert.equal((await context.request.post(address+'/api/devices/edit/cancel',{...request,data:{deviceId:mountedDeviceId,section:'Racks'}})).status(),200);
  await page.locator('.rack-elev-top [data-action="rack-face-rear"]').click();
  await page.waitForFunction(()=>document.querySelector('.rack-elev-top [data-action="rack-face-rear"]')?.getAttribute('aria-pressed')==='true');
  await page.locator('.rack-elev-top [data-action="rack-face-front"]').click();
  await page.waitForFunction(()=>document.querySelector('.rack-elev-top [data-action="rack-face-front"]')?.getAttribute('aria-pressed')==='true');
  assert.equal(await page.locator('.rack-elevation [data-vertical-accessory="display-vertical"]').count(),1);
  for(const tab of ['equipment','settings']){
   await page.evaluate(tab=>{activeRackTab=tab;renderContent();},tab);
   assert.equal((await page.locator('#main-content').locator(actions).filter({visible:true}).count())>0,editing,
     tab+' modifying controls follow Racks Edit');
  }
  await page.evaluate(()=>{activeRackTab='view';renderContent();});
  await page.screenshot({path:path.join(out,name+'-1440.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);
  await context.close();console.log('PASS: '+name+' existing inventory visibility, controls and actual save/delete/placement permission boundaries');
 }
}
run().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{
 if(browser)await browser.close();if(server){server.kill('SIGTERM');await new Promise(resolve=>server.once('exit',resolve));}
});
