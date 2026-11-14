// Real HTTPS/SQLite Staff screen and owner-reviewed layout smoke test.
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn,spawnSync}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-equipment-interface-'));
const output=process.env.CAFFOOT_EQUIPMENT_OUTPUT||path.join(tmp,'screenshots');
fs.mkdirSync(output,{recursive:true});
const address='https://127.0.0.1:8080';
let browser,server;
function py(code,args=[]){
 const p=spawnSync('python3',['-c',code,...args],{cwd:root,encoding:'utf8'});
 assert.equal(p.status,0,p.stderr);return p.stdout.trim();
}
async function test(){
 const seed=spawnSync('python3',['tests/visual_fixtures.py',tmp],{cwd:root,encoding:'utf8'});
 assert.equal(seed.status,0,seed.stderr);
 const creds=JSON.parse(fs.readFileSync(path.join(tmp,'test-credentials.json')));
 const readerInfo=JSON.parse(py([
  'import json,sqlite3,sys,time',
  'from backend.permissions import create_user',
  'from backend.mfa import code_at',
  'from backend.sessions import login_session',
  'from backend.http_security import COOKIE_NAME',
  'with sqlite3.connect(sys.argv[1]) as db:',
  ' db.execute("PRAGMA foreign_keys=ON")',
  ' user=create_user(db,1,"staff-reader","Reader-Only-Test-Password-2026!")',
  ' db.execute("UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?",(sys.argv[2],user))',
  " db.execute('INSERT INTO account_permission_overrides(account_id,section,level) VALUES(?,?,?)',(user,'Staff Members','read'))",
  ' db.commit()',
  ' token=login_session(db,"staff-reader","Reader-Only-Test-Password-2026!",mfa_code=code_at(sys.argv[2],time.time()))',
  ' print(json.dumps({"cookie":COOKIE_NAME,"token":token}))'
 ].join('\n'),[path.join(tmp,'inventory.sqlite3'),creds.secret]));
 const log=fs.openSync(path.join(tmp,'server.log'),'w');
 server=spawn('python3',['-m','backend.server'],{cwd:root,stdio:['ignore',log,log],env:{
  ...process.env,CAFFOOT_DB_PATH:path.join(tmp,'inventory.sqlite3'),
  CAFFOOT_TLS_DIR:path.join(tmp,'tls'),CAFFOOT_WEB_ADDRESS:address,
  CAFFOOT_SERVER_ADDRESS:'127.0.0.1',CAFFOOT_HOST:'127.0.0.1'
 }});
 browser=await chromium.launch({headless:true,executablePath:process.env.CAFFOOT_CHROMIUM_PATH||undefined});
 const context=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:950}});
 for(let i=0;i<60;i++){
  try{if((await context.request.get(address+'/health',{timeout:1000})).ok())break;}catch{}
  await new Promise(resolve=>setTimeout(resolve,150));
 }
 const code=py('from backend.mfa import code_at;import sys,time;print(code_at(sys.argv[1],time.time()))',[creds.secret]);
 const login=await context.request.post(address+'/api/login',{headers:{Origin:address},data:{
  username:creds.username,password:creds.password,mfa_code:code
 }});
 assert.equal(login.status(),200,await login.text());
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));

 const session=await (await context.request.get(address+'/api/session')).json();
 const headers={Origin:address,'X-CSRF-Token':session.csrf_token};
 async function save(route,data){const r=await context.request.post(address+route,{headers,data});assert.equal(r.status(),200,await r.text());return r.json();}
 const dept=(await save('/api/departments',{name:'Production'})).department;
 const person=(await save('/api/staff-members',{firstName:'Alex',lastName:'Morgan',departmentId:dept.id,
  login:{username:'alex.morgan',password:'Fictional-Pass-2026!'}})).staffMember;
 // Seed ordinary canonical records for the types demonstrated in the approved references.
 for(const [index,type] of ['Desktop','Laptop','Printer'].entries()){
  const record={id:'assignment-device-'+index,name:'Equipment '+type,type,status:'Active',primaryIp:'',typeDetails:{},mountType:'Desktop'};
  await save('/api/devices/create',{record});
 }
 const available=(await (await context.request.get(address+'/api/equipment/available-devices')).json()).devices;
 assert.ok(available.length>=3,JSON.stringify(available));
 await page.goto(address+'/inventory#staff');
 await page.locator('#app[aria-busy="false"]').waitFor();
 await page.locator(`[data-staff-action="staff-details"][data-id="${person.id}"]`).click();
 await page.getByRole('heading',{name:'Assigned Equipment',exact:true}).waitFor();
 const profileBefore=await page.locator('.staff-live .two-col').innerHTML();
 await page.locator('[data-equipment-action="assign-staff"]').click();
 for(const device of available.slice(0,2))await page.locator(`[data-equipment-device="${device.id}"]`).check();
 await page.locator('#equipment-assignment-form [type="submit"]').click();
 await page.locator('#equipment-assignment-form').waitFor({state:'hidden'});
 await page.getByRole('heading',{name:'Assigned Equipment',exact:true}).waitFor();
 await page.locator('.equipment-staff [data-equipment-action="view-device"]').first().waitFor();
 assert.equal(await page.locator('.staff-live .two-col').innerHTML(),profileBefore);
 assert.equal(await page.locator('.equipment-staff [data-equipment-action="view-device"]').count(),2);
 assert.equal(await page.locator('.staff-history-list tr').first().locator('td').count(),2);
 const report={};
 async function capture(name){
  if(name.startsWith('device-')){
   const visible=await page.locator('#device-details-tab-assigned').evaluate(e=>{
    const tab=e.getBoundingClientRect(),strip=e.parentElement.getBoundingClientRect();
    return tab.left>=strip.left-1&&tab.right<=strip.right+1;
   });assert.ok(visible,'Selected Assigned To tab must remain visible after resizing');
  }
  await page.screenshot({path:path.join(output,name+'.png'),fullPage:true});
  const metrics=await page.evaluate(()=>({width:innerWidth,documentWidth:document.documentElement.scrollWidth,
   theme:document.documentElement.className,focused:document.activeElement?.tagName}));
  assert.ok(metrics.documentWidth<=metrics.width+1,JSON.stringify(metrics));report[name]=metrics;
 }
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:width===390?844:950});
  for(const theme of ['light','dark']){await page.evaluate(theme=>caffootSetTheme(theme),theme);await capture(`staff-${width}-${theme}`);}
 }
 await page.setViewportSize({width:1440,height:950});
 await page.evaluate(()=>caffootSetTheme('light'));
 await page.locator('.equipment-staff [data-equipment-action="view-device"]').first().click();
 await page.locator('#device-details-tab-assigned').click();
 await page.locator('#device-details-panel-assigned').getByText('Alex Morgan',{exact:true}).first().waitFor();
 assert.equal(await page.locator('.device-review-footer button').count()>=4,true);
 assert.equal(await page.locator('#device-details-panel-assigned').getByRole('button',{name:/Return|Reassign/}).count(),0);
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:width===390?844:950});
  for(const theme of ['light','dark']){await page.evaluate(theme=>caffootSetTheme(theme),theme);await capture(`device-${width}-${theme}`);}
 }
 await page.locator('.device-review-footer [data-action="close-modal"]').click();
 // Allocate the shared item from the original Device dialog, with the same API.
 await page.setViewportSize({width:1440,height:950});
 await page.evaluate(()=>caffootSetTheme('light'));
 await page.locator('#sidebar [data-tab="devices"]').click();
 await page.locator('[data-action="select-device-section"][data-tab="inventory"]').click();
 await page.locator(`[data-action="view-device"][data-id="${available[2].id}"]`).first().click();
 await page.locator('#device-details-tab-assigned').click();
 await page.locator('[data-equipment-action="assign-device"]').click();
 await page.locator('#equipment-recipient-kind').selectOption('department');
 await page.locator('#equipment-recipient option[value="'+dept.id+'"]').waitFor({state:'attached'});
 await page.locator('#equipment-recipient').selectOption(dept.id);
 await page.setViewportSize({width:390,height:844});
 await capture('assignment-390-light');
 await page.evaluate(()=>caffootSetTheme('dark'));
 await capture('assignment-390-dark');
 await page.evaluate(()=>caffootSetTheme('light'));
 await page.keyboard.press('Tab');
 assert.ok(await page.locator('#modal-content').evaluate(e=>e.contains(document.activeElement)));
 await page.locator('#equipment-assignment-form [type="submit"]').click();
 await page.locator('#device-details-panel-assigned').getByText('Production',{exact:true}).first().waitFor();
 await page.locator('.device-review-footer [data-action="close-modal"]').click();
 // The employee gets both safe sections while inventory remains inaccessible.
 const employee=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:390,height:844}});
 const employeeLogin=await employee.request.post(address+'/api/login',{headers:{Origin:address},data:{username:'alex.morgan',password:'Fictional-Pass-2026!'}});
 assert.equal(employeeLogin.status(),200,await employeeLogin.text());
 const employeePage=await employee.newPage();employeePage.on('pageerror',e=>errors.push(e.message));
 const inventoryRequests=[];employeePage.on('request',r=>{if(r.url().endsWith('/api/inventory/state'))inventoryRequests.push(r.url());});
 await employeePage.goto(address+'/account');
 await employeePage.locator('#app[aria-busy="false"]').waitFor();
 await employeePage.locator('#sidebar [data-tab="equipment"]').click();
 await employeePage.locator('[data-personal-equipment] .info-row').first().waitFor();
 assert.equal(await employeePage.locator('[data-personal-equipment] .info-row').count(),2);
 assert.equal(await employeePage.locator('[data-shared-equipment] .info-row').count(),1);
 assert.equal(inventoryRequests.length,0);
 assert.equal((await employee.request.get(address+'/api/inventory/state')).status(),403);
 for(const width of [1440,390]){
  await employeePage.setViewportSize({width,height:width===390?844:950});
  for(const theme of ['light','dark']){
   await employeePage.evaluate(theme=>caffootSetTheme(theme),theme);
   await employeePage.screenshot({path:path.join(output,`personal-${width}-${theme}.png`),fullPage:true});
   assert.ok(await employeePage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  }
 }
 // A current Department move removes shared visibility on the next request.
 await save('/api/staff-members/'+person.id,{departmentId:null,active:false});
 await employeePage.locator('#sidebar [data-tab="equipment"]').click();
 await employeePage.getByText('No shared equipment is currently available for your Department.').waitFor();
 assert.equal(await employeePage.locator('[data-personal-equipment] .info-row').count(),2);
 await employee.close();
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({passed:true,errors,measurements:report},null,2));
 console.log('PASS: canonical Staff multi-allocation, Device Department allocation, shared history, private employee sections, membership refresh, light/dark desktop/mobile, modal keyboard containment.');
}
(async()=>{try{await test();}finally{if(browser)await browser.close();if(server){server.kill('SIGTERM');if(server.exitCode===null)await new Promise(r=>server.once('exit',r));}}})().catch(e=>{console.error(e);process.exitCode=1});
