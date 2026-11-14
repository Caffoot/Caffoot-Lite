// Focused Stage 2 interface acceptance using fictional SQLite data and pinned designs.
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),http=require('node:http');
const {spawn,spawnSync}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),temporary=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-pi-corrections-'));
const database=path.join(temporary,'inventory.sqlite3'),address='https://127.0.0.1:8080';
const output=process.env.CAFFOOT_VISUAL_OUTPUT||path.join(root,'work','pi-corrections-browser');fs.mkdirSync(output,{recursive:true});
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
 state.update(devices=[dict(id='mounted',name='Mounted Switch',type='Switch',mountType='Rack Mounted',rackId='rack',rackUStart=2,rackUEnd=2,rackUHeight=1,face='rear',location='Original Rack Name',primaryIp='10.0.0.10'),dict(id='shelf',name='Shelf Printer',type='Printer',mountType='Tabletop / Shelf Mounted',rackId='rack',rackShelfAccessoryId='shelf-a',rackUStart=None,rackUEnd=None,rackUHeight=None,face=None,location='Original Shelf Location',primaryIp=''),dict(id='inside',name='Basic Inside',type='Printer',mountType='Tabletop / Shelf Mounted',location='Office',primaryIp='10.0.0.20',primaryIpMode='basic'),dict(id='inside-second',name='Basic Choice',type='Printer',mountType='Tabletop / Shelf Mounted',location='Office',primaryIp='10.0.0.21',primaryIpMode='basic'),dict(id='outside',name='Basic Outside',type='Printer',mountType='Tabletop / Shelf Mounted',location='Office',primaryIp='192.0.2.10',primaryIpMode='basic'),dict(id='blank',name='No IP',type='Printer',mountType='Tabletop / Shelf Mounted',location='Office',primaryIp='')],subnets=[dict(id='lan',name='Office LAN',kind='network',purpose='LAN',cidr='10.0.0.0/24',gateway='10.0.0.1')],racks=[dict(id='rack',name='Network Rack',location='Rack Room',heightU=12),dict(id='rack-b',name='Second Rack',location='Second Rack Room',heightU=12)],rackAccessories=[dict(id='shelf-a',type='shelf',rackId='rack',name='Printer Shelf',face='front',startU=4,heightU=1),dict(id='shelf-b',type='shelf',rackId='rack-b',name='Second Shelf',face='front',startU=5,heightU=1)],ipAllocations={'10.0.0.10':dict(status='Assigned',deviceId='mounted',hostname='Mounted Switch',notes='Keep'),'10.0.0.20':dict(status='Available',hostname='',notes='Preserve address note')},deviceLocations=['Unknown','Office','Original Rack Name','Original Shelf Location'])
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
(async()=>{try{
 const engine=process.env.CAFFOOT_PI_ENGINE||'chromium';
 const launcher=require('playwright')[engine];
 browser=await launcher.launch({headless:true,...(engine==='chromium'&&(process.env.CAFFOOT_CHROMIUM_PATH||fs.existsSync('/usr/bin/chromium'))?{executablePath:process.env.CAFFOOT_CHROMIUM_PATH||'/usr/bin/chromium'}:{})});
 const context=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:950}});
 await context.addCookies([{name:identity.cookie,value:identity.owner,url:address,secure:true,httpOnly:true,sameSite:'Strict'}]);
 const page=await context.newPage();page.setDefaultTimeout(12000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(let i=0;i<40;i++){try{if((await context.request.get(address+'/health')).ok())break;}catch{}await new Promise(r=>setTimeout(r,100));}
 const load=async()=>{await page.goto(address+'/inventory');await page.locator('#app[aria-busy="false"]').waitFor();};
 const toggle=async(feature,enabled)=>{const r=await context.request.post(address+'/api/settings/features',{headers:{Origin:address,'X-CSRF-Token':identity.csrf},data:{feature,enabled,confirmDisable:true}});assert.equal(r.status(),200,await r.text());};
 const dashboard=async(tab='overview')=>{await page.evaluate(tab=>{closeModal(true);switchTab('dashboard');activeDashboardTab=tab;renderContent();},tab);};
 const initial=snapshot();
 for(let bits=1;bits<8;bits++){
  for(const [index,key] of ['devices','ipam','racks'].entries())await toggle(key,!!(bits&(1<<index)));
  await load();
  for(const tab of ['overview','insights','activity']){
   await dashboard(tab);
   const root=page.locator('#dashboard-panel-'+tab),text=await root.innerText();
   assert.doesNotMatch(text,/missing rack|missing device|missing.*shelf|out of sync|no subnet|not linked correctly/i,'False Dashboard diagnosis: '+bits+' '+tab);
   for(const [index,title] of ['Recent Devices','Subnet Utilisation','Rack Details'].entries())if(!(bits&(1<<index)))assert.equal(await root.getByRole('heading',{name:title,exact:true}).count(),0);
   if(!(bits&2))assert.doesNotMatch(text,/No subnets configured|0 configured|IP Address Utilisation|Network Allocation Overview/);
   if(!(bits&4))assert.doesNotMatch(text,/No (network )?racks configured|Rack Capacity/);
   if(!(bits&1))assert.doesNotMatch(text,/No devices configured|mounted devices|Rack Capacity/);
  }
 }
 for(const key of ['devices','ipam','racks'])await toggle(key,true);
 await load();await dashboard();
 const genuine=await page.evaluate(()=>{const a=appState.ipAllocations['10.0.0.10'];delete appState.ipAllocations['10.0.0.10'];const html=renderDashboardHTML();appState.ipAllocations['10.0.0.10']=a;return html;});
 assert.match(genuine,/IPAM is out of sync/);assert.match(genuine,/has no subnet|is not linked correctly/);
 for(const name of ['editor','ipam','both','racks']){
  const c=await browser.newContext({ignoreHTTPSErrors:true});await c.addCookies([{name:identity.cookie,value:identity[name],url:address,secure:true,httpOnly:true,sameSite:'Strict'}]);
  const p=await c.newPage();await p.goto(address+'/inventory');await p.locator('#app[aria-busy="false"]').waitFor();
  await p.evaluate(()=>switchTab('dashboard'));
  const text=await p.locator('#main-content').innerText();assert.doesNotMatch(text,/missing rack|missing device|missing.*shelf|out of sync|not linked correctly/i);
  if(['racks','ipam'].includes(name))assert.doesNotMatch(text,/Mounted Switch|Shelf Printer|mounted devices|Recent Devices|Device Status|Rack Capacity/);
  if(name==='editor')assert.doesNotMatch(text,/No subnets configured|No racks configured|Subnet Utilisation|Rack Capacity/);
  await c.close();
 }
 // Opening, tab changes and unrelated edits must not apply a new Location.
 await page.evaluate(()=>{switchTab('devices');openDeviceModal('mounted');});await page.locator('#device-editor-form').waitFor();
 assert.equal(await page.locator('#dev-location').inputValue(),'Original Rack Name');
 await page.locator('#dev-rack-id').selectOption('rack-b',{force:true});assert.equal(await page.locator('#dev-location').inputValue(),'Second Rack Room');
 await page.locator('#dev-location').selectOption('Office',{force:true});
 await page.locator('#dev-rack-id').selectOption('rack',{force:true});assert.equal(await page.locator('#dev-location').inputValue(),'Office');
 await page.evaluate(()=>closeModal(true));
 await page.evaluate(()=>openDeviceModal('shelf'));await page.locator('#device-editor-form').waitFor();
 assert.equal(await page.locator('#dev-location').inputValue(),'Original Shelf Location');
 await page.locator('#dev-rack-shelf').selectOption('shelf-a',{force:true});assert.equal(await page.locator('#dev-location').inputValue(),'Rack Room');
 await page.locator('#dev-shelf-rack').selectOption('rack-b',{force:true});await page.locator('#dev-rack-shelf').selectOption('shelf-b',{force:true});
 assert.equal(await page.locator('#dev-location').inputValue(),'Second Rack Room');
 await page.evaluate(()=>closeModal(true));assert.deepEqual(snapshot(),initial,'Selection/Cancel mutated saved inventory or grants');
 // Real native-invalid submission: Start U, correct tab, inline feedback and visible toast.
 await page.evaluate(()=>openDeviceModal('mounted'));await page.locator('#device-editor-form').waitFor();
 await page.locator('#dev-rack-u').selectOption('',{force:true});
 await page.locator('button[form="device-editor-form"][type="submit"]').click();
 await page.waitForFunction(()=>document.getElementById('toast').dataset.notificationType==='error'&&!document.getElementById('toast').classList.contains('opacity-0'));
 assert.equal(await page.locator('#dev-rack-u').getAttribute('aria-invalid'),'true');
 assert.ok(await page.locator('[data-device-editor-feedback]').isVisible());
 assert.equal(await page.locator('#device-editor-form').evaluate(form=>form.contains(document.activeElement)),true);
 const validationMessage=await page.locator('[data-device-editor-feedback]').innerText();assert.match(validationMessage,/Start U/i);
 await page.waitForTimeout(350);
 const paint=await page.evaluate(()=>{const toast=document.getElementById('toast'),r=toast.getBoundingClientRect();const x=Math.min(innerWidth-1,r.right-8),y=Math.min(innerHeight-1,r.bottom-8);return {visible:r.top>=0&&r.bottom<=innerHeight,above:document.elementFromPoint(x,y)?.closest('#toast')===toast};});
 // The toast is intentionally pointer-transparent; use paint order with pointer events temporarily enabled.
 const above=await page.evaluate(()=>{const t=document.getElementById('toast');const old=t.style.pointerEvents;t.style.pointerEvents='auto';const r=t.getBoundingClientRect(),top=document.elementFromPoint(r.right-8,r.bottom-8)?.closest('#toast')===t;t.style.pointerEvents=old;return top;});
 assert.ok(paint.visible&&above,'Error notification paints behind the editor');
 assert.deepEqual(snapshot(),initial,'Invalid submission changed saved inventory');
 const pictures=[];
 for(const width of [1440,390])for(const theme of ['light','dark']){
  await page.setViewportSize({width,height:width===390?844:950});
  await page.evaluate(theme=>document.documentElement.classList.toggle('dark',theme==='dark'),theme);
  await page.evaluate(()=>showDeviceEditorFeedback('Rack start U must be a whole number.','dev-rack-u'));await page.waitForTimeout(350);
  const name='validation-'+theme+'-'+width+'.png';await page.screenshot({path:path.join(output,name)});pictures.push(name);
 }
 await page.evaluate(()=>closeModal(true));
 await toggle('racks',false);await toggle('ipam',false);await load();
 await page.evaluate(()=>{switchTab('devices');openDeviceDetailView('shelf');});
 assert.match(await page.locator('#modal-content').innerText(),/Rack information is not available with your current access/);
 assert.doesNotMatch(await page.locator('#modal-content').innerText(),/Recorded shelf unavailable|Printer Shelf|Shelf U4|Network Rack/);
 await page.screenshot({path:path.join(output,'hidden-shelf.png')});pictures.push('hidden-shelf.png');
 await page.evaluate(()=>{closeModal(true);openDeviceModal('shelf');});await page.locator('#device-editor-form').waitFor();
 assert.equal(await page.locator('#dev-location').inputValue(),'Original Shelf Location');assert.ok(await page.locator('#dev-location').isDisabled());
 await page.evaluate(()=>closeModal(true));
 for(const width of [1440,390])for(const theme of ['light','dark']){
  await page.setViewportSize({width,height:width===390?844:950});await page.evaluate(theme=>document.documentElement.classList.toggle('dark',theme==='dark'),theme);
  for(const tab of ['overview','insights','activity']){await dashboard(tab);const name='dashboard-'+tab+'-'+theme+'-'+width+'.png';await page.screenshot({path:path.join(output,name),fullPage:true});pictures.push(name);}
 }
 for(const key of ['devices','ipam','racks'])await toggle(key,true);
 await load();
 const missing=await page.evaluate(()=>{const old=appState.rackAccessories;appState.rackAccessories=[];const text=getRackShelfLocation(appState.devices.find(d=>d.id==='shelf'));appState.rackAccessories=old;return text;});assert.match(missing,/Recorded shelf unavailable/);
 // Exercise existing native and application validation across actual form contexts.
 const contextsChecked=[];
 const invalid=async(selector)=>{
  await page.locator(selector).waitFor();
  await page.evaluate(selector=>{document.getElementById('toast').classList.add('opacity-0');document.querySelector(selector).requestSubmit();},selector);
  await page.waitForFunction(()=>!document.getElementById('toast').classList.contains('opacity-0')&&document.getElementById('toast').dataset.notificationType==='error');
  assert.ok((await page.locator('#toast-message').innerText()).length>0);
  assert.ok(await page.locator(selector+' [aria-invalid="true"]').count());
  contextsChecked.push(selector);
 };
 await page.evaluate(()=>{switchTab('ipam');openSubnetModal();});await invalid('form[data-form-action="subnet"]');await page.evaluate(()=>closeModal(true));
 await page.evaluate(()=>{switchTab('racks');openRackModal();});await invalid('form[data-form-action="rack"]');await page.evaluate(()=>closeModal(true));
 await page.evaluate(()=>{switchTab('devices');openDeviceModal('mounted');});await page.locator('#device-editor-form').waitFor();
 await page.locator('[data-action="create-rack-from-device"]').click({force:true});await invalid('form[data-form-action="rack"]');
 await page.locator('[data-action="close-modal"]').last().click();await page.locator('#device-editor-form').waitFor();assert.equal(await page.locator('#dev-location').inputValue(),'Original Rack Name');await page.evaluate(()=>closeModal(true));
 await page.evaluate(()=>switchTab('users'));await page.locator('[data-action="select-users-section"][data-tab="add"]').click();await invalid('#next-user-create-form');
 await page.locator('[data-action="select-users-section"][data-tab="roles"]').click();await page.locator('[data-role-command="create"]').click();await invalid('#role-definition-form');
 await page.locator('[data-role-layer] [data-role-command="close"]').click();
 await page.evaluate(()=>switchTab('settings'));await page.locator('.settings-screen [data-tab="email"]').click();await invalid('#smtp-settings-form');
 // User password mismatch is an application-level validation error, not a native constraint.
 await page.evaluate(()=>switchTab('users'));await page.locator('[data-action="select-users-section"][data-tab="add"]').click();
 await page.locator('#new-user-username').fill('unsaved-colleague');await page.locator('#new-user-password').fill('Fictional-Password-2026!');await page.locator('#new-user-password-confirm').fill('Different-Password-2026!');
 await page.locator('#next-user-create-form [type="submit"]').click();await page.waitForFunction(()=>document.getElementById('toast-message').textContent==='The initial passwords do not match.');
 assert.deepEqual(snapshot(),initial);assert.deepEqual(errors,[]);

 fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({engine,pictures,validationMessage,contextsChecked,pageErrors:errors},null,2));
 console.log('PASS: feature/read matrix and genuine warnings; mounted/shelf/manual Location; hidden shelf; native validation/focus/paint; no saved-data changes.');
 }finally{if(browser)await browser.close();server.kill();reference.close();fs.closeSync(log);fs.rmSync(temporary,{recursive:true,force:true});}})().catch(e=>{console.error(e);process.exitCode=1});
