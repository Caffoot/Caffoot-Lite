// Narrow Milestone 01 correction regression, using the existing disposable HTTPS fixture.
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn,spawnSync}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-correction-batch2-'));
const output=process.env.CAFFOOT_BATCH2_OUTPUT;
const baseline=process.env.CAFFOOT_BATCH2_BASELINE==='1';
const address='https://127.0.0.1:8080';
let browser,server;
function py(code,args=[]){
 const p=spawnSync('python3',['-c',code,...args],{cwd:root,encoding:'utf8'});
 assert.equal(p.status,0,p.stderr);return p.stdout.trim();
}
async function main(){
 const seed=spawnSync('python3',['tests/visual_fixtures.py',tmp],{cwd:root,encoding:'utf8'});
 assert.equal(seed.status,0,seed.stderr);
 const db=path.join(tmp,'inventory.sqlite3');
 const credentials=JSON.parse(fs.readFileSync(path.join(tmp,'test-credentials.json')));
 const fixture=JSON.parse(py([
  'import json,sqlite3,sys',
  'from backend.permissions import create_user',
  'with sqlite3.connect(sys.argv[1]) as db:',
  ' db.execute("UPDATE organisation_features SET enabled=1")',
  ' db.commit()',
  ' reader=create_user(db,1,"batch2-reader","Fictional-Reader-Password-2026!")',
  ' db.execute("UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?",(sys.argv[2],reader))',
  " db.execute(\"INSERT INTO account_permission_overrides VALUES(?,'Devices','read')\",(reader,))",
  ' db.commit()',
  ' print(json.dumps(dict(db.execute("SELECT name,id FROM inventory_devices"))))'
 ].join('\n'),[db,credentials.secret]));
 assert.ok(fixture['App-VM-01']&&fixture['Reception-PC']);
 const log=fs.openSync(path.join(tmp,'server.log'),'w');
 server=spawn('python3',['-m','backend.server'],{cwd:root,stdio:['ignore',log,log],env:{
  ...process.env,CAFFOOT_DB_PATH:db,CAFFOOT_TLS_DIR:path.join(tmp,'tls'),
  CAFFOOT_WEB_ADDRESS:address,CAFFOOT_SERVER_ADDRESS:'127.0.0.1',CAFFOOT_HOST:'127.0.0.1'
 }});
 browser=await chromium.launch({headless:true,executablePath:process.env.CAFFOOT_CHROMIUM_PATH||undefined});
 const context=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:600}});
 let ready=false;
 for(let i=0;i<60;i++){
  try{ready=(await context.request.get(address+'/health',{timeout:1000})).ok();if(ready)break;}catch{}
  await new Promise(resolve=>setTimeout(resolve,150));
 }
 assert.ok(ready,'Disposable HTTPS server did not start');
 async function login(ctx,username,password){
  const code=py('from backend.mfa import code_at;import sys,time;print(code_at(sys.argv[1],time.time()))',[credentials.secret]);
  const result=await ctx.request.post(address+'/api/login',{headers:{Origin:address},data:{username,password,mfa_code:code}});
  assert.equal(result.status(),200,await result.text());
  return (await ctx.request.get(address+'/api/session')).json();
 }
 const session=await login(context,credentials.username,credentials.password);
 const headers={Origin:address,'X-CSRF-Token':session.csrf_token};
 async function read(route){const res=await context.request.get(address+route);assert.equal(res.status(),200,await res.text());return res.json();}
 async function post(route,data){const res=await context.request.post(address+route,{headers,data});assert.equal(res.status(),200,await res.text());return res.json();}
 const page=await context.newPage(),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto(address+'/inventory#it-assets');
 await page.locator('#app[aria-busy="false"]').waitFor();
 await page.locator('#stock-overview').waitFor();
 async function waitForNavigation(p){
  await p.locator('#app[aria-busy="false"] #sidebar:not([data-session-permissions-pending]):not([data-inventory-permissions-pending])').waitFor();
 }
 async function expand(p){
  await waitForNavigation(p);
  for(const group of ['it','staff','purchasing']){
   const button=p.locator('#sidebar [data-action="toggle-nav-group"][data-group="'+group+'"]');
   if(await button.isVisible()&&await button.getAttribute('aria-expanded')!=='true')await button.click();
  }
 }
 async function metrics(p){
  return p.locator('#sidebar').evaluate(sidebar=>{
   const bounds=sidebar.getBoundingClientRect(),style=getComputedStyle(sidebar);
   const collapse=sidebar.querySelector('[data-action="toggle-sidebar"]').getBoundingClientRect();
   const settings=sidebar.querySelector('#next-settings-nav').getBoundingClientRect();
   return {overflow:style.overflowY,height:sidebar.clientHeight,scrollHeight:sidebar.scrollHeight,
    top:bounds.top,bottom:bounds.bottom,scrollTop:sidebar.scrollTop,collapseTop:collapse.top,
    collapseBottom:collapse.bottom,settingsTop:settings.top,settingsBottom:settings.bottom,windowY:scrollY,
    viewportHeight:innerHeight,position:style.position};
  });
 }
 async function capture(name,p=page){
  if(!output)return;
  fs.mkdirSync(output,{recursive:true});
  await p.screenshot({path:path.join(output,name+'.png'),animations:'disabled'});
 }
 async function checkScroll(p,requireOverflow=true,requireSettings=true){
  await waitForNavigation(p);
  const sidebar=p.locator('#sidebar');
  if(requireSettings)await sidebar.locator('#next-settings-nav').waitFor();
  await sidebar.evaluate(e=>e.scrollTop=0);
  const before=await metrics(p);
  assert.equal(before.overflow,'auto',JSON.stringify(before));
  assert.equal(before.position,'sticky');
  assert.ok(before.bottom<=before.viewportHeight+1,JSON.stringify(before));
  if(!requireOverflow&&before.scrollHeight<=before.height)return;
  assert.ok(before.scrollHeight>before.height,JSON.stringify(before));
  await p.mouse.move(80,Math.min(350,before.viewportHeight-30));
  await p.mouse.wheel(0,2000);
  await p.waitForFunction(()=>document.getElementById('sidebar').scrollTop>0);
  const after=await metrics(p);
  assert.equal(after.windowY,before.windowY,'Sidebar wheel must not move the main page');
  assert.ok(after.collapseTop>=after.top-1&&after.collapseBottom<=after.bottom+1,JSON.stringify(after));
  if(requireSettings)assert.ok(after.settingsTop>=after.top-1&&after.settingsBottom<=after.bottom+1,JSON.stringify(after));
  const collapse=sidebar.locator('[data-action="toggle-sidebar"]');
  // Each theme/route must test a fresh focus transition, not refocus the same element.
  await collapse.evaluate(e=>e.blur());
  await sidebar.evaluate(e=>e.scrollTop=0);
  await collapse.focus();
  assert.equal(await collapse.evaluate(e=>document.activeElement===e),true);
  const keyboard=await metrics(p);
  assert.ok(keyboard.collapseBottom<=keyboard.bottom+1&&keyboard.collapseTop>=keyboard.top-1,JSON.stringify(keyboard));
  console.log('Sidebar reachability',JSON.stringify({before,after,keyboard}));
 }
 async function openInventory(){
  await page.locator('#sidebar [data-tab="devices"]').click();
  await page.getByRole('tab',{name:'Device Inventory',exact:true}).click();
  await page.locator('[data-action="view-device"][data-id="'+fixture['Reception-PC']+'"]').first().waitFor();
  await expand(page);
 }
 async function checkLeftCompanyDetails(id,physical){
  await page.locator('#sidebar [data-tab="staff"]').click();
  await page.locator('[data-staff-id="'+id+'"] [data-staff-action="staff-details"]').click();
  const card=page.locator('[data-equipment-staff="'+id+'"] [aria-label="Current Equipment Assignments"]');
  const wording=card.getByText('This staff member has left the company. Outstanding assignments are retained. New assignments are unavailable.',{exact:true});
  await wording.waitFor();
  assert.equal(await card.locator('[data-equipment-action="assign-staff"],[data-equipment-action="issue-stock-staff"]').count(),0);
  assert.ok(await card.getByText('Reception-PC',{exact:true}).isVisible());
  if(process.env.CAFFOOT_FOLLOWUP_WORDING==='1'){
   await wording.scrollIntoViewIfNeeded();
   await capture('staff-details-left-company');
  }
 }
 if(process.env.CAFFOOT_FOLLOWUP_WORDING==='1'){
  await page.setViewportSize({width:1440,height:1050});
  await page.evaluate(()=>caffootSetTheme('light'));
  const person=(await post('/api/staff-members',{firstName:'Alex',lastName:'Morgan'})).staffMember;
  const physical=fixture['Reception-PC'],route='/api/equipment/assignments?deviceId='+encodeURIComponent(physical);
  const before=await read(route);
  await post('/api/equipment/assignments',{recipientKind:'staff',recipientId:person.id,devices:[{id:physical,revision:before.revision}]});
  const assigned=await read(route),saved=await read('/api/staff-members/'+person.id);
  await post('/api/staff-members/'+person.id,{active:false,revision:saved.staffMember.revision});
  await page.reload();await page.locator('#app[aria-busy="false"]').waitFor();
  await checkLeftCompanyDetails(person.id,physical);
  assert.deepEqual(await read(route),assigned);
  assert.deepEqual(errors,[]);
  console.log('Staff Details wording, retained assignment and unavailable new assignment actions verified.');
  return;
 }
 await expand(page);
 if(baseline){
  await page.locator('#sidebar').evaluate(e=>e.scrollTop=0);
  const stock=await metrics(page);
  await openInventory();
  await page.locator('#sidebar').evaluate(e=>e.scrollTop=0);
  const devices=await metrics(page);
  console.log('Baseline matched viewport:',JSON.stringify({stock,devices}));
  assert.equal(stock.overflow,'auto');
  assert.notEqual(devices.overflow,'auto');
  assert.ok(devices.collapseBottom>devices.viewportHeight,'Baseline clipping must reproduce');
  return;
 }
 // The two reported routes, with identical short desktop viewport and expanded groups.
 for(const [route,label] of [['it-assets','it-assets-overview'],['devices','device-inventory']]){
  if(route==='devices')await openInventory();
  for(const theme of ['light','dark']){
   await page.evaluate(theme=>caffootSetTheme(theme),theme);
   await checkScroll(page);
   await capture('sidebar-'+label+'-'+theme);
  }
 }
 // Check only shared sidebar reachability, not unrelated page workflows.
 for(const tab of ['dashboard','ipam','racks','staff','departments','users','purchasing','suppliers','audit','settings','service-desk','equipment']){
  await waitForNavigation(page);
  const nav=page.locator('#sidebar [data-tab="'+tab+'"]');
  if(!await nav.isVisible())continue;
  await nav.click();
  await page.locator('#sidebar [data-tab="'+tab+'"][aria-current="page"]').waitFor();
  await waitForNavigation(page);
  await expand(page);
  console.log('Checking sidebar on route:',tab);
  await checkScroll(page);
 }
 const toggle=page.locator('#sidebar [data-action="toggle-sidebar"]');
 await toggle.click();
 assert.equal(await toggle.getAttribute('aria-expanded'),'false');
 await toggle.click();
 assert.equal(await toggle.getAttribute('aria-expanded'),'true');
 await checkScroll(page);
 // A restricted Devices reader must retain only their permitted navigation.
 const restricted=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:600}});
 await login(restricted,'batch2-reader','Fictional-Reader-Password-2026!');
 const reader=await restricted.newPage();
 reader.on('pageerror',error=>errors.push(error.message));
 await reader.goto(address+'/inventory#devices');
 await waitForNavigation(reader);
 assert.equal(await reader.locator('#sidebar [data-tab="devices"]').isVisible(),true);
 for(const tab of ['it-assets','suppliers','users','settings','staff','departments']){
  assert.equal(await reader.locator('#sidebar [data-tab="'+tab+'"]').isVisible(),false,tab);
 }
 await checkScroll(reader,false,false);
 await restricted.close();
 await page.setViewportSize({width:1440,height:950});
 await page.evaluate(()=>caffootSetTheme('light'));
 // Current and historical assignment projections remain intact.
 const person=(await post('/api/staff-members',{firstName:'Alex',lastName:'Morgan'})).staffMember;
 const vm=fixture['App-VM-01'],physical=fixture['Reception-PC'];
 const projection=id=>read('/api/equipment/assignments?deviceId='+encodeURIComponent(id));
 const before=await projection(vm);
 assert.match(before.dependency,/Virtual machines cannot be physically allocated/);
 for(const field of ['current','history','departmentChanges','stockHistory'])assert.equal((before[field]||[]).length,0,field);
 const rejected=await context.request.post(address+'/api/equipment/assignments',{headers,data:{
  recipientKind:'staff',recipientId:person.id,devices:[{id:vm,revision:before.revision}]
 }});
 assert.ok(!rejected.ok(),'Server must reject physical VM allocation');
 assert.match((await rejected.json()).error,/Virtual machines cannot be physically allocated/);
 assert.deepEqual(await projection(vm),before);
 const physicalBefore=await projection(physical);
 await post('/api/equipment/assignments',{recipientKind:'staff',recipientId:person.id,devices:[{id:physical,revision:physicalBefore.revision}]});
 await page.reload();await page.locator('#app[aria-busy="false"]').waitFor();
 await openInventory();
 async function details(id){
  await page.locator('[data-action="view-device"][data-id="'+id+'"]').first().click();
  await page.locator('.device-details-dialog').waitFor();
 }
 await details(vm);
 assert.equal(await page.locator('#device-details-tab-assigned,#device-details-panel-assigned').count(),0);
 for(const key of ['overview','network','software','location','associated','tickets']){
  const tab=page.locator('#device-details-tab-'+key);
  assert.equal(await tab.count(),1,key);
  await tab.click();
  assert.equal(await tab.getAttribute('aria-selected'),'true');
 }
 await page.locator('#device-details-tab-overview').click();
 await page.evaluate(()=>selectDeviceDetailsTab('assigned'));
 assert.equal(await page.locator('#device-details-tab-overview').getAttribute('aria-selected'),'true');
 for(const theme of ['light','dark']){
  await page.evaluate(theme=>caffootSetTheme(theme),theme);
  await capture('virtual-device-'+theme);
 }
 await page.locator('.device-review-head [data-action="close-modal"]').click();
 await details(physical);
 await page.locator('#device-details-tab-assigned').click();
 await page.locator('#device-details-panel-assigned').getByText('Alex Morgan',{exact:true}).first().waitFor();
 const assigned=await projection(physical);
 assert.equal(assigned.current.length,1);
 assert.equal(assigned.history.length,1);
 await capture('physical-device-assigned');
 await page.locator('.device-review-head [data-action="close-modal"]').click();
 // Edit wording follows both saved and unsaved status without changing persistence.
 await page.locator('#sidebar [data-tab="staff"]').click();
 const edit=page.locator('[data-staff-id="'+person.id+'"] [data-staff-action="staff-edit"]');
 await edit.click();
 const status=page.locator('#preview-active');
 const guidance=page.locator('#staff-equipment-access-guidance');
 const active='Equipment can be assigned to eligible staff members. Access to tickets is governed by the linked account and its permissions. Use Return Equipment to record physical returns.';
 const inactive='Existing equipment assignments are retained for tracking and return. New equipment assignments are unavailable while this staff member is marked as Left Company. Use Return Equipment to record physical returns.';
 assert.equal(await guidance.textContent(),active);
 for(const theme of ['light','dark']){
  await page.evaluate(theme=>caffootSetTheme(theme),theme);
  await capture('staff-active-'+theme);
 }
 await status.selectOption('false');
 assert.equal(await guidance.textContent(),inactive);
 await status.selectOption('true');
 assert.equal(await guidance.textContent(),active);
 await status.selectOption('false');
 await page.locator('#staff-record-form [data-staff-action="staff-back"]').click();
 const saved=await read('/api/staff-members/'+person.id);
 assert.equal(saved.staffMember.active,true);
 assert.deepEqual(await projection(physical),assigned);
 await post('/api/staff-members/'+person.id,{active:false,revision:saved.staffMember.revision});
 await page.reload();await page.locator('#app[aria-busy="false"]').waitFor();
 await page.locator('#sidebar [data-tab="staff"]').click();
 await edit.click();
 assert.equal(await status.inputValue(),'false');
 assert.equal(await guidance.textContent(),inactive);
 for(const theme of ['light','dark']){
  await page.evaluate(theme=>caffootSetTheme(theme),theme);
  await capture('staff-left-company-'+theme);
 }
 assert.deepEqual(await projection(physical),assigned);
 await checkLeftCompanyDetails(person.id,physical);
 assert.deepEqual(errors,[]);
 console.log('Focused Batch 2 correction regression passed.');
}
main().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();if(server){server.kill();await new Promise(resolve=>server.once('exit',resolve));}});
