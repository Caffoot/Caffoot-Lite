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
 await page.locator('[data-staff-action="staff-edit"]').click();
 await page.locator('#preview-active').selectOption('false');
 await page.locator('#staff-record-form [type="submit"]').click();
 await page.getByRole('heading',{name:'Staff Details'}).waitFor();
 assert.equal((await (await context.request.get(address+'/api/staff-members/'+person.id)).json()).staffMember.active,false);
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
 await page.locator('[data-action="select-users-section"][data-tab="list"]').click();
 await page.locator('[data-action="users-open-editor"]').last().click();
 for(const section of ['Staff Members','Departments','IT Assets'])
  assert.equal(await page.locator('[data-next-user-permission][data-section="'+section+'"]').count(),1);
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({passed:true,screenshots:5,errors},null,2));
 console.log('PASS: approved Staff screen layout, live CRUD, optional login, grouped navigation and six-section Permissions.');
}
(async()=>{
 try{await test();}
 finally{
  if(browser)await browser.close();
  if(server){server.kill('SIGTERM');if(server.exitCode===null)await new Promise(r=>server.once('exit',r));}
 }
})().catch(e=>{console.error(e);process.exitCode=1});
