// Real HTTPS/SQLite Staff screen and owner-reviewed layout smoke test.
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn,spawnSync}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-staff-interface-'));
const output=process.env.CAFFOOT_STAFF_OUTPUT||path.join(tmp,'screenshots');
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
 await page.goto(address+'/inventory#staff');
 await page.locator('#app[aria-busy="false"]').waitFor();
 await page.locator('.staff-live .preview-staff-directory').waitFor();
 assert.ok(await page.locator('#sidebar [data-nav-group="it"]').isVisible());
 assert.ok(await page.locator('#sidebar [data-nav-group="staff"]').isVisible());
 await page.locator('#sidebar [data-action="toggle-nav-group"][data-group="staff"]').click();
 assert.equal(await page.locator('#nav-group-staff').isHidden(),true);
 await page.locator('#sidebar [data-action="toggle-nav-group"][data-group="staff"]').click();
 await page.screenshot({path:path.join(output,'staff-directory-light-desktop.png'),fullPage:true});
 await page.locator('#sidebar [data-tab="departments"]').click();
 await page.locator('[data-staff-action="department-add"]').click();
 await page.locator('#staff-department-name').fill('Production');
 await page.locator('#staff-department-form [type="submit"]').click();
 await page.locator('#staff-department-form').waitFor({state:'detached'});
 const depts=(await (await context.request.get(address+'/api/departments')).json()).departments;
 const dept=depts.find(d=>d.name==='Production');
 assert.ok(dept&&dept.canDelete);
 await page.locator('#sidebar [data-tab="staff"]').click();
 await page.locator('[data-staff-action="staff-add"]').click();
 assert.ok(await page.locator('.staff-main-grid .staff-login-card').isVisible());
 assert.equal(await page.locator('#staff-create-login').isChecked(),false);
 await page.locator('#preview-firstName').fill('Jordan');
 await page.locator('#preview-lastName').fill('Rivers');
 await page.locator('#preview-departmentId').selectOption(dept.id);
 await page.screenshot({path:path.join(output,'staff-add-light-desktop.png'),fullPage:true});
 await page.locator('#staff-record-form [type="submit"]').click();
 await page.getByRole('heading',{name:'Staff Details'}).waitFor();
 const people=(await (await context.request.get(address+'/api/staff-members')).json()).staffMembers;
 const person=people.find(p=>p.firstName==='Jordan'&&p.lastName==='Rivers');
 assert.ok(person);
 assert.equal(person.departmentId,dept.id);
 assert.equal(person.accountId,null);
 const session=await (await context.request.get(address+'/api/session')).json();
 const staffPath='/api/staff-members/'+person.id;
 async function saveCurrentStaff(data){
  const current=(await (await context.request.get(address+staffPath)).json()).staffMember;
  const response=await context.request.post(address+staffPath,{headers:{Origin:address,'X-CSRF-Token':session.csrf_token},data:{...data,revision:current.revision}});
  assert.equal(response.status(),200,await response.text());
  return (await response.json()).staffMember;
 }
 const otherEditor=await context.newPage();
 otherEditor.on('pageerror',e=>errors.push(e.message));
 await otherEditor.goto(address+'/inventory#staff');
 await otherEditor.locator('[data-staff-id="'+person.id+'"] [data-staff-action="staff-edit"]').click();
 const initialRevision=await otherEditor.locator('#staff-record-form').getAttribute('data-revision');
 await page.locator('[data-staff-action="staff-edit"]').click();
 await page.locator('#preview-active').selectOption('false');
 await page.locator('#preview-departmentId').selectOption('');
 await page.locator('#preview-jobTitle').fill('Current Engineer');
 await page.locator('#staff-record-form [type="submit"]').click();
 await page.getByRole('heading',{name:'Staff Details'}).waitFor();
 assert.equal((await (await context.request.get(address+'/api/staff-members/'+person.id)).json()).staffMember.active,false);
 await otherEditor.locator('#preview-location').fill('Unsaved location');
 await otherEditor.locator('#staff-create-login').check();
 await otherEditor.locator('#preview-username').fill('unsaved-login');
 await otherEditor.locator('#preview-password').fill('Unsaved-Test-Password-2026!');
 await otherEditor.locator('#preview-confirmPassword').fill('Unsaved-Test-Password-2026!');
 const preservedLayout=await otherEditor.locator('.staff-details-card,.staff-login-card,.staff-actions').evaluateAll(elements=>elements.map(e=>{const r=e.getBoundingClientRect();return [r.x+scrollX,r.y+scrollY,r.width,r.height];}));
 const beforeConflict=py('import sqlite3,sys,json;db=sqlite3.connect(sys.argv[1]);print(json.dumps(list(db.iterdump())))',[path.join(tmp,'inventory.sqlite3')]);
 let responsePromise=otherEditor.waitForResponse(r=>r.url()===address+staffPath&&r.request().method()==='POST');
 await otherEditor.locator('#staff-record-form [type="submit"]').click();
 assert.equal((await responsePromise).status(),409);
 await otherEditor.locator('#preview-form-feedback [data-staff-action="staff-refresh"]').waitFor();
 assert.match(await otherEditor.locator('#preview-form-feedback').innerText(),/changed elsewhere.*unsaved details have been kept/s);
 assert.equal(await otherEditor.locator('#preview-location').inputValue(),'Unsaved location');
 assert.equal(await otherEditor.locator('#preview-password').inputValue(),'Unsaved-Test-Password-2026!');
 assert.equal(await otherEditor.locator('#staff-record-form').getAttribute('data-revision'),initialRevision);
 assert.deepEqual(await otherEditor.locator('.staff-details-card,.staff-login-card,.staff-actions').evaluateAll(elements=>elements.map(e=>{const r=e.getBoundingClientRect();return [r.x+scrollX,r.y+scrollY,r.width,r.height];})),preservedLayout);
 assert.equal(py('import sqlite3,sys,json;db=sqlite3.connect(sys.argv[1]);print(json.dumps(list(db.iterdump())))',[path.join(tmp,'inventory.sqlite3')]),beforeConflict);
 await otherEditor.screenshot({path:path.join(output,'staff-conflict-light-desktop.png'),fullPage:true});
 await otherEditor.setViewportSize({width:390,height:844});
 await otherEditor.evaluate(()=>caffootSetTheme('dark'));
 await otherEditor.screenshot({path:path.join(output,'staff-conflict-dark-mobile.png'),fullPage:true});
 otherEditor.once('dialog',dialog=>dialog.dismiss());
 await otherEditor.locator('[data-staff-action="staff-refresh"]').click();
 assert.equal(await otherEditor.locator('#preview-location').inputValue(),'Unsaved location');
 await otherEditor.route('**'+staffPath,route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Current details could not be loaded.'})}));
 otherEditor.once('dialog',dialog=>dialog.accept());
 await otherEditor.locator('[data-staff-action="staff-refresh"]').click();
 await otherEditor.getByText('Current details could not be loaded.',{exact:true}).waitFor();
 assert.equal(await otherEditor.locator('#preview-location').inputValue(),'Unsaved location');
 assert.equal(await otherEditor.locator('#preview-password').inputValue(),'Unsaved-Test-Password-2026!');
 await otherEditor.unroute('**'+staffPath);
 otherEditor.once('dialog',dialog=>dialog.accept());
 await otherEditor.locator('[data-staff-action="staff-refresh"]').click();
 await otherEditor.waitForFunction(()=>document.querySelector('#preview-jobTitle')?.value==='Current Engineer');
 assert.equal(await otherEditor.locator('#preview-active').inputValue(),'false');
 assert.equal(await otherEditor.locator('#preview-departmentId').inputValue(),'');
 assert.equal(await otherEditor.locator('#preview-location').inputValue(),'');
 assert.equal(await otherEditor.locator('#staff-create-login').isChecked(),false);
 assert.notEqual(await otherEditor.locator('#staff-record-form').getAttribute('data-revision'),initialRevision);
 await otherEditor.locator('#preview-departmentId').selectOption(dept.id);
 await otherEditor.locator('#preview-location').fill('Reviewed location');
 await otherEditor.locator('#staff-record-form [type="submit"]').click();
 await otherEditor.getByRole('heading',{name:'Staff Details'}).waitFor();
 await otherEditor.close();
 await page.evaluate(()=>caffootSetTheme('light'));
 for(const action of ['Reactivate','Mark Inactive']){
  await saveCurrentStaff({telephone:action==='Reactivate'?'+44 123':'+44 456'});
  responsePromise=page.waitForResponse(r=>r.url()===address+staffPath&&r.request().method()==='POST');
  page.once('dialog',dialog=>dialog.accept());
  await page.getByRole('button',{name:action,exact:true}).click();
  assert.equal((await responsePromise).status(),409);
  await page.locator('[data-staff-action="staff-refresh"]').waitFor();
  assert.match(await page.locator('[data-staff-action="staff-status"]').locator('..').innerText(),/changed elsewhere/);
  if(action==='Reactivate')await page.screenshot({path:path.join(output,'staff-status-conflict-light-desktop.png'),fullPage:true});
  await page.locator('[data-staff-action="staff-refresh"]').click();
  await page.locator('[data-staff-action="staff-refresh"]').waitFor({state:'detached'});
  responsePromise=page.waitForResponse(r=>r.url()===address+staffPath&&r.request().method()==='POST');
  page.once('dialog',dialog=>dialog.accept());
  await page.getByRole('button',{name:action,exact:true}).click();
  assert.equal((await responsePromise).status(),200);
  await page.waitForFunction(label=>document.querySelector('[data-staff-action="staff-status"]')?.textContent===label,action==='Reactivate'?'Mark Inactive':'Reactivate');
 }
 await page.locator('[data-staff-action="staff-back"]').click();
 await page.locator('#staff-directory-search').fill('Production');
 assert.ok(await page.locator('[data-staff-id="'+person.id+'"]').isVisible());
 await page.locator('#staff-directory-search').fill('');
 await page.locator('[data-staff-action="staff-add"]').click();
 await page.locator('#preview-firstName').fill('Taylor');
 await page.locator('#preview-lastName').fill('Cole');
 await page.locator('#staff-create-login').check();
 await page.locator('#preview-username').fill('taylor.cole');
 await page.locator('#preview-password').fill('Fictional-Pass-2026!');
 await page.locator('#preview-confirmPassword').fill('Fictional-Pass-2026!');
 await page.locator('#staff-record-form [type="submit"]').click();
 await page.getByRole('heading',{name:'Staff Details'}).waitFor();
 assert.ok(await page.getByText('taylor.cole').count()>0);
 await page.screenshot({path:path.join(output,'staff-details-light-desktop.png'),fullPage:true});
 await page.locator('[data-staff-action="staff-edit"]').click();
 assert.equal(await page.locator('.staff-main-grid').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length),2);
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:path.join(output,'staff-edit-light-mobile.png'),fullPage:true});
 await page.evaluate(()=>caffootSetTheme('dark'));
 await page.screenshot({path:path.join(output,'staff-edit-dark-mobile.png'),fullPage:true});
 await page.locator('#sidebar [data-tab="users"]').click();
 await page.locator('.section-page-header [data-action="select-users-section"][data-tab="list"]').click();
 await page.locator('[data-action="users-open-editor"]').last().click();
 for(const section of ['Staff Members','Departments','IT Assets'])
  assert.equal(await page.locator('[data-next-user-permission][data-section="'+section+'"]').count(),1);
 const readOnly=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:390,height:844}});
 await readOnly.addCookies([{name:readerInfo.cookie,value:readerInfo.token,url:address,secure:true,httpOnly:true,sameSite:'Strict'}]);
 const limitedPage=await readOnly.newPage();
 limitedPage.on('pageerror',e=>errors.push(e.message));
 const inventoryReads=[];
 limitedPage.on('request',request=>{if(request.url().endsWith('/api/inventory/state'))inventoryReads.push(request.url());});
 await limitedPage.goto(address+'/inventory#staff');
 await limitedPage.locator('#app[aria-busy="false"]').waitFor();
 await limitedPage.locator('.staff-live .preview-staff-directory').waitFor();
 assert.equal(inventoryReads.length,0,'Staff-only accounts must never load inventory');
 assert.ok(await limitedPage.locator('#sidebar [data-tab="devices"]').isHidden());
 assert.ok(await limitedPage.locator('#sidebar [data-tab="departments"]').isHidden());
 assert.equal(await limitedPage.locator('[data-staff-action="staff-add"]').count(),0);
 assert.equal((await readOnly.request.get(address+'/api/inventory/state')).status(),403);
 assert.equal((await readOnly.request.get(address+'/api/departments')).status(),403);
 await limitedPage.screenshot({path:path.join(output,'staff-reader-mobile.png'),fullPage:true});
 await readOnly.close();
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({passed:true,screenshots:fs.readdirSync(output).filter(name=>name.endsWith('.png')).length,errors},null,2));
 console.log('PASS: Staff stale form/status conflicts, retained edits, deliberate refresh, approved layout, live CRUD, optional login and permissions.');
}
(async()=>{
 try{await test();}
 finally{
  if(browser)await browser.close();
  if(server){server.kill('SIGTERM');if(server.exitCode===null)await new Promise(r=>server.once('exit',r));}
 }
})().catch(e=>{console.error(e);process.exitCode=1});
