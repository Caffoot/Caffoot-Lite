// Focused feature navigation and essential administration against local HTTPS/SQLite.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {spawn,spawnSync}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-features-'));
const database=path.join(temporary,'inventory.sqlite3');
const address='https://127.0.0.1:8080';
const seed=spawnSync('python3',['-c',`
import json,sqlite3,sys,time
from backend.schema import initialise_database
from backend.accounts import bootstrap_first_admin,confirm_admin_mfa
from backend.mfa import code_at
from backend.sessions import login_session
from backend.request_auth import csrf_for_session
from backend.http_security import COOKIE_NAME
with sqlite3.connect(sys.argv[1]) as db:
 initialise_database(db)
 owner,secret=bootstrap_first_admin(db,'owner','Fictional-Test-Password')
 timestamp=time.time()
 confirm_admin_mfa(db,owner,code_at(secret,timestamp),timestamp=timestamp)
 token=login_session(db,'owner','Fictional-Test-Password',mfa_code=code_at(secret,time.time()))
 print(json.dumps(dict(cookie=COOKIE_NAME,token=token,csrf=csrf_for_session(token))))
`,database],{cwd:root,encoding:'utf8'});
assert.equal(seed.status,0,seed.stderr);
const identity=JSON.parse(seed.stdout);
const log=fs.openSync(path.join(temporary,'server.log'),'a');
const server=spawn('python3',['-m','backend.server'],{cwd:root,stdio:['ignore',log,log],env:{...process.env,CAFFOOT_DB_PATH:database,CAFFOOT_TLS_DIR:path.join(temporary,'tls'),CAFFOOT_WEB_ADDRESS:address,CAFFOOT_SERVER_ADDRESS:'127.0.0.1',CAFFOOT_PORT:'8080',CAFFOOT_HOST:'127.0.0.1'}});
let browser;
(async()=>{
 try{
  browser=await chromium.launch({headless:true,executablePath:process.env.CAFFOOT_CHROMIUM_PATH||'/usr/bin/chromium'});
  const context=await browser.newContext({ignoreHTTPSErrors:true});
  await context.addCookies([{name:identity.cookie,value:identity.token,url:address,secure:true,httpOnly:true,sameSite:'Strict'}]);
  let ready=false;
  for(let attempt=0;attempt<40;attempt++){
   try{ready=(await context.request.get(address+'/health')).ok();if(ready)break;}catch{}
   await new Promise(resolve=>setTimeout(resolve,100));
  }
  assert.ok(ready,'Local HTTPS service did not start: '+fs.readFileSync(path.join(temporary,'server.log'),'utf8'));
  const errors=[];
  for(let combination=0;combination<8;combination++){
   for(const [index,feature] of ['devices','ipam','racks'].entries()){
    const response=await context.request.post(address+'/api/settings/features',{headers:{Origin:address,'X-CSRF-Token':identity.csrf},data:{feature,enabled:!!(combination&(1<<index)),confirmDisable:true}});
    assert.equal(response.status(),200,await response.text());
   }
   const page=await context.newPage();
   page.on('pageerror',error=>errors.push(error.message));
   await page.goto(address+'/inventory');
   await page.waitForFunction(()=>document.getElementById('app')?.getAttribute('aria-busy')==='false');
   for(const [index,tab] of ['devices','ipam','racks'].entries()){
    assert.equal(await page.locator('#sidebar [data-tab="'+tab+'"]').isVisible(),!!(combination&(1<<index)),tab+' combination '+combination);
   }
   if(combination===0){
    assert.equal(await page.evaluate(()=>currentTab),'settings');
    await page.locator('#next-users-nav').click();
    await page.waitForFunction(()=>currentTab==='users');
    await page.locator('#next-settings-nav').click();
    await page.waitForFunction(()=>currentTab==='settings');
    await page.locator('[data-action="tab-account"]').first().click();
    await page.waitForFunction(()=>currentTab==='account');
    await page.goto(address+'/inventory#devices');
    await page.waitForFunction(()=>document.getElementById('app')?.getAttribute('aria-busy')==='false');
    assert.notEqual(await page.evaluate(()=>currentTab),'devices');
   }
   const state=await (await context.request.get(address+'/api/inventory/state')).json();
   for(const [index,key] of ['devices','subnets','racks'].entries())assert.equal(key in state,!!(combination&(1<<index)));
   await page.close();
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: eight feature combinations, hidden navigation, all-off Settings/Users/My Account and denied deep link; no page errors.');
 }finally{
  if(browser)await browser.close();
  server.kill();fs.closeSync(log);fs.rmSync(temporary,{recursive:true,force:true});
 }
})().catch(error=>{console.error(error);process.exitCode=1;});
