// Exercise the existing Device form for optional/basic addresses without IPAM rights.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {spawn,spawnSync}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-optional-ip-'));
const database=path.join(temporary,'inventory.sqlite3');
const address='https://127.0.0.1:8080';
const seed=spawnSync('python3',['-c',`
import json,sqlite3,sys,time
from backend.schema import initialise_database
from backend.accounts import bootstrap_first_admin,confirm_admin_mfa
from backend.permissions import create_user
from backend.mfa import code_at
from backend.sessions import login_session
from backend.request_auth import csrf_for_session
from backend.http_security import COOKIE_NAME
with sqlite3.connect(sys.argv[1]) as db:
 initialise_database(db)
 db.execute("UPDATE organisation_features SET enabled=1 WHERE feature IN ('devices','ipam','racks')");db.commit()
 owner,secret=bootstrap_first_admin(db,'owner','Fictional-Test-Password')
 confirm_admin_mfa(db,owner,code_at(secret,time.time()),timestamp=time.time())
 token=login_session(db,'owner','Fictional-Test-Password',mfa_code=code_at(secret,time.time()))
 user=create_user(db,owner,'devices-editor','Fictional-Test-Password')
 db.execute("UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?",(secret,user))
 db.execute("INSERT INTO account_permission_overrides VALUES(?,'Devices','edit')",(user,));db.commit()
 editor=login_session(db,'devices-editor','Fictional-Test-Password',mfa_code=code_at(secret,time.time()))
 print(json.dumps(dict(cookie=COOKIE_NAME,token=token,csrf=csrf_for_session(token),editor=editor)))
`,database],{cwd:root,encoding:'utf8'});
assert.equal(seed.status,0,seed.stderr);
const identity=JSON.parse(seed.stdout);
const log=fs.openSync(path.join(temporary,'server.log'),'a');
const server=spawn('python3',['-m','backend.server'],{cwd:root,stdio:['ignore',log,log],env:{...process.env,CAFFOOT_DB_PATH:database,CAFFOOT_TLS_DIR:path.join(temporary,'tls'),CAFFOOT_WEB_ADDRESS:address,CAFFOOT_SERVER_ADDRESS:'127.0.0.1',CAFFOOT_PORT:'8080',CAFFOOT_HOST:'127.0.0.1'}});
let browser;
(async()=>{
 try{
  browser=await chromium.launch({headless:true,executablePath:process.env.CAFFOOT_CHROMIUM_PATH||'/usr/bin/chromium'});
  const owner=await browser.newContext({ignoreHTTPSErrors:true});
  await owner.addCookies([{name:identity.cookie,value:identity.token,url:address,secure:true,httpOnly:true,sameSite:'Strict'}]);
  let ready=false;
  for(let attempt=0;attempt<40;attempt++){
   try{ready=(await owner.request.get(address+'/health')).ok();if(ready)break;}catch{}
   await new Promise(resolve=>setTimeout(resolve,100));
  }
  assert.ok(ready,'Local HTTPS service did not start');
  const editor=await browser.newContext({ignoreHTTPSErrors:true});
  await editor.addCookies([{name:identity.cookie,value:identity.editor,url:address,secure:true,httpOnly:true,sameSite:'Strict'}]);
  const errors=[];
  const toggle=async enabled=>{
   const response=await owner.request.post(address+'/api/settings/features',{headers:{Origin:address,'X-CSRF-Token':identity.csrf},data:{feature:'ipam',enabled,confirmDisable:true}});
   assert.equal(response.status(),200,await response.text());
  };
  const open=async()=>{
   const page=await editor.newPage();page.on('pageerror',error=>errors.push(error.message));page.setDefaultTimeout(12000);
   await page.goto(address+'/inventory');
   await page.waitForFunction(()=>document.getElementById('app')?.getAttribute('aria-busy')==='false');
   return page;
  };
  const create=async(name,ip)=>{
   const page=await open();
   await page.evaluate(()=>openDeviceModal());
   await page.locator('#dev-name').fill(name);
   await page.locator('#dev-type').selectOption('Printer',{force:true});
   await page.locator('#dev-location').selectOption('Unknown',{force:true});
   const mount=await page.locator('#dev-mount-type option').evaluateAll(options=>options.find(option=>option.value&&option.value!=='Rack Mounted'&&!option.disabled)?.value);
   await page.locator('#dev-mount-type').selectOption(mount,{force:true});
   await page.getByRole('tab',{name:'Networking',exact:true}).click();
   assert.equal(await page.locator('#dev-ip').getAttribute('required'),null);
   if(ip)await page.locator('#dev-ip').fill(ip);
   await page.locator('button[type="submit"][form="device-editor-form"]').click();
   await page.waitForFunction(name=>appState.devices.some(device=>device.name===name),name);
   await page.waitForFunction(()=>document.getElementById('modal-container').classList.contains('hidden'));
   const response=await editor.request.get(address+'/api/inventory/state');
   const state=await response.json();const record=state.devices.find(device=>device.name===name);
   assert.ok(record,'Device saved in SQLite');
   await page.close();return record;
  };
  await toggle(true);assert.equal((await create('Offline IPAM On','')).primaryIp,'');
  await toggle(false);assert.equal((await create('Offline IPAM Off','')).primaryIp,'');
  const basic=await create('Basic Printer','192.0.2.10');assert.equal(basic.primaryIpMode,'basic');
  await toggle(true);
  const page=await open();await page.evaluate(id=>openDeviceModal(id),basic.id);
  await page.locator('#dev-name').waitFor();
  await page.getByRole('tab',{name:'Networking',exact:true}).click();
  await page.locator('#dev-ip').fill('192.0.2.2');
  await page.locator('button[type="submit"][form="device-editor-form"]').click();
  await page.waitForFunction(()=>document.getElementById('modal-container').classList.contains('hidden'));
  const state=await(await editor.request.get(address+'/api/inventory/state')).json();
  const saved=state.devices.find(device=>device.id===basic.id);
  assert.equal(saved.primaryIp,'192.0.2.2');assert.equal(saved.primaryIpMode,'basic');
  const authoritative=await(await owner.request.get(address+'/api/inventory/state')).json();
  assert.deepEqual(authoritative.ipAllocations,{});assert.deepEqual(authoritative.subnets,[]);
  const subnet=await owner.request.post(address+'/api/ipam/subnets/save',{headers:{Origin:address,'X-CSRF-Token':identity.csrf},data:{changes:[{collection:'subnets',id:'network',record:{id:'network',name:'LAN',kind:'network',purpose:'LAN',cidr:'192.0.2.0/24',gateway:'192.0.2.1'}}]}});
  assert.equal(subnet.status(),200,await subnet.text());
  const overview=await owner.newPage();await overview.goto(address+'/inventory');
  await overview.waitForFunction(()=>document.getElementById('app')?.getAttribute('aria-busy')==='false');
  const summary=await overview.evaluate(()=>calculateSubnetUtilisationSummary(appState.subnets[0]));
  assert.equal(summary.assigned,0);assert.equal(summary.next,'192.0.2.3');
  assert.deepEqual(await overview.evaluate(()=>planDeviceIpAllocationIntegrityRepairs().fixes),[]);
  assert.equal(await page.getByText('Link to IPAM',{exact:true}).count(),0);
  assert.deepEqual(errors,[]);
  console.log('PASS: Devices-only editor created no-IP Devices with IPAM on/off, created basic IPv4 without subnet, edited it after enabling IPAM, and created no allocation.');
 }finally{
  if(browser)await browser.close();server.kill();fs.closeSync(log);fs.rmSync(temporary,{recursive:true,force:true});
 }
})().catch(error=>{console.error(error);process.exitCode=1;});
