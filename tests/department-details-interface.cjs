// Exercise the real Department screen, independent access and canonical records.
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn,spawnSync}=require('node:child_process');
const {createHash}=require('node:crypto');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),base='ff7a088bbe8e24322c84106e417ab1b03f3dfe70';
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-department-details-'));
const output=process.env.CAFFOOT_DEPARTMENT_OUTPUT||path.join(tmp,'screenshots');
fs.mkdirSync(output,{recursive:true});
const address='https://127.0.0.1:8080';
let browser,server;
function py(code,args=[]){
 const result=spawnSync('python3',['-c',code,...args],{cwd:root,encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);return result.stdout.trim();
}
async function main(){
 const seed=spawnSync('python3',['tests/visual_fixtures.py',tmp],{cwd:root,encoding:'utf8'});
 assert.equal(seed.status,0,seed.stderr);
 const credentials=JSON.parse(fs.readFileSync(path.join(tmp,'test-credentials.json')));
 const log=fs.openSync(path.join(tmp,'server.log'),'w');
 server=spawn('python3',['-m','backend.server'],{cwd:root,stdio:['ignore',log,log],env:{...process.env,
  CAFFOOT_DB_PATH:path.join(tmp,'inventory.sqlite3'),CAFFOOT_TLS_DIR:path.join(tmp,'tls'),
  CAFFOOT_WEB_ADDRESS:address,CAFFOOT_SERVER_ADDRESS:'127.0.0.1',CAFFOOT_HOST:'127.0.0.1'}});
 browser=await chromium.launch({headless:true,executablePath:process.env.CAFFOOT_CHROMIUM_PATH||undefined});
 const context=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:1050}});
 for(let i=0;i<60;i++){
  try{if((await context.request.get(address+'/health',{timeout:1000})).ok())break;}catch{}
  await new Promise(resolve=>setTimeout(resolve,150));
 }
 const code=py('from backend.mfa import code_at;import sys,time;print(code_at(sys.argv[1],time.time()))',[credentials.secret]);
 const login=await context.request.post(address+'/api/login',{headers:{Origin:address},data:{username:credentials.username,password:credentials.password,mfa_code:code}});
 assert.equal(login.status(),200,await login.text());
 const session=await (await context.request.get(address+'/api/session')).json();
 async function save(route,data){const response=await context.request.post(address+route,{headers:{Origin:address,'X-CSRF-Token':session.csrf_token},data});assert.equal(response.status(),200,await response.text());return response.json();}
 const department=(await save('/api/departments',{name:'Accounts'})).department;
 const other=(await save('/api/departments',{name:'Facilities'})).department;
 const people=[];
 for(const [firstName,lastName,jobTitle] of [['Morgan','Reed','Accounts Assistant'],['Alex','Taylor','Finance Officer'],['Jamie','Ellis','Accounts Manager']])people.push((await save('/api/staff-members',{firstName,lastName,jobTitle,departmentId:department.id})).staffMember);
 await save('/api/staff-members/'+people[2].id,{active:false});
 for(const [id,name,type] of [['shared-printer','Accounts Printer','Printer'],['personal-laptop','Personal Laptop','Laptop'],['other-printer','Facilities Printer','Printer']]){
  await save('/api/devices/create',{record:{id,name,type,status:'Active',primaryIp:'',typeDetails:{},mountType:'Desktop'}});
 }
 for(const [recipientKind,recipientId,id] of [['department',department.id,'shared-printer'],['staff',people[0].id,'personal-laptop'],['department',other.id,'other-printer']])await save('/api/equipment/assignments',{recipientKind,recipientId,devices:[{id,revision:0}]});
 const readerInfo=JSON.parse(py([
  'import json,sqlite3,sys,time',
  'from backend.permissions import create_user',
  'from backend.sessions import login_session',
  'from backend.mfa import code_at',
  'from backend.http_security import COOKIE_NAME',
  'result={}',
  'with sqlite3.connect(sys.argv[1]) as db:',
  ' db.execute("PRAGMA foreign_keys=ON")',
  ' db.execute("INSERT INTO departments(id,name) VALUES(?,?)",("legacy-empty","Unlinked Department"))',
  // Extra unrelated Staff ensure counts are not truncated at the first API page.
  ' for i in range(105):db.execute("INSERT INTO staff_members(first_name,last_name) VALUES(?,?)",("Fictional", "Person %03d"%i))',
  ' db.commit()',
  ' for name,sections in [("department-only",["Departments"]),("department-staff",["Departments","Staff Members"]),("department-devices",["Departments","Devices"])]:',
  '  actor=create_user(db,1,name,"Fictional-Reader-Password-2026!")',
  '  db.execute("UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?",(sys.argv[2],actor))',
  '  for section in sections:db.execute("INSERT INTO account_permission_overrides VALUES(?,?,?)",(actor,section,"read"))',
  '  db.commit()',
  '  token=login_session(db,name,"Fictional-Reader-Password-2026!",mfa_code=code_at(sys.argv[2],time.time()))',
  '  result[name]={"cookie":COOKIE_NAME,"token":token}',
  ' print(json.dumps(result))'
 ].join('\n'),[path.join(tmp,'inventory.sqlite3'),credentials.secret]));
 function snapshot(){return py('import sqlite3,json,sys;db=sqlite3.connect(sys.argv[1]);print(json.dumps({t:db.execute("SELECT * FROM "+t+" ORDER BY 1").fetchall() for t in ["departments","staff_members","device_assignments","inventory_devices","inventory_change_history","schema_migrations"]}))',[path.join(tmp,'inventory.sqlite3')]);}
 const before=snapshot(),page=await context.newPage(),errors=[],requests=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('request',request=>{if(request.url().includes('/api/'))requests.push(request.url());});
 await page.goto(address+'/inventory#departments');await page.locator('#app[aria-busy="false"]').waitFor();
 await page.locator('[data-staff-action="department-details"]').first().waitFor();
 const columns=await page.locator('.staff-live .list-header span').allTextContents();
 assert.deepEqual(columns,['Department','Status','Membership','Availability','Manage']);
 assert.ok(await page.locator('[data-staff-action="department-add"]').isVisible());
 const open=async(id=department.id)=>{
  await page.locator('#sidebar [data-tab="departments"]').click();
  if(await page.locator('[data-staff-action="department-back"]').count())await page.locator('[data-staff-action="department-back"]').click();
  await page.locator(`[data-staff-action="department-details"][data-id="${id}"]`).click();
  await page.locator('.department-details').waitFor();
 };
 await open();
 assert.deepEqual(await page.getByRole('tablist',{name:'Department Details'}).getByRole('tab').allTextContents(),['Overview','Staff Members','Equipment','History']);
 assert.deepEqual(await page.locator('.department-metrics .statnum').allTextContents(),['3','1','Active']);
 assert.ok(requests.some(url=>url.includes('/api/staff-members?limit=100&offset=100')));
 assert.equal(await page.locator('[data-staff-action="department-edit"]').count(),1);
 const sourceHashes=Object.fromEntries(['interface/application.js','interface/staff-directory.js','interface/styles/staff.css','interface/styles/shared.css','interface/styles/users.css','interface/styles/device-details.css'].map(file=>[file,createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')]));
 const report={base,sourceHashes,browser:await browser.version(),sourceRevision:spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).stdout.trim(),captures:{}};
 async function capture(target,name){
  await target.evaluate(()=>window.scrollTo(0,0));await target.waitForTimeout(250);
  const geometry=await target.evaluate(()=>({viewport:innerWidth,width:document.documentElement.scrollWidth}));
  assert.ok(geometry.width<=geometry.viewport,JSON.stringify({name,...geometry}));
  if(name.startsWith('directory-')){
   const overlaps=await target.locator('.staff-live .userrow').evaluateAll(rows=>rows.filter(row=>{
    const title=row.querySelector('.username').getBoundingClientRect(),actions=row.querySelector('.actions').getBoundingClientRect();
    return title.right>actions.left&&title.bottom>actions.top&&title.top<actions.bottom;
   }).length);
   assert.equal(overlaps,0,'Department names must fit beside the existing action column');
  }
  await target.screenshot({path:path.join(output,name+'.png'),fullPage:true});report.captures[name]=geometry;
 }
 await page.locator('[data-staff-action="department-back"]').click();
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:width===390?844:1050});
  for(const theme of ['light','dark']){await page.evaluate(theme=>caffootSetTheme(theme),theme);await capture(page,`directory-${width}-${theme}`);}
 }
 await open();
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:width===390?844:1050});
  for(const theme of ['light','dark']){
   await page.evaluate(theme=>caffootSetTheme(theme),theme);
   for(const [tab,label] of [['overview','Overview'],['staff','Staff Members'],['equipment','Equipment'],['history','History']]){
    await page.getByRole('tab',{name:label,exact:true}).click();
    assert.equal(await page.getByRole('tab',{name:label,exact:true}).getAttribute('aria-selected'),'true');
    assert.ok(await page.locator('#department-panel-'+tab).isVisible());
    await capture(page,`${tab}-${width}-${theme}`);
   }
  }
 }
 await page.setViewportSize({width:1440,height:1050});
 await page.getByRole('tab',{name:'Overview',exact:true}).click();
 await page.keyboard.press('End');assert.equal(await page.getByRole('tab',{name:'History',exact:true}).getAttribute('aria-selected'),'true');
 await page.keyboard.press('Home');assert.equal(await page.getByRole('tab',{name:'Overview',exact:true}).getAttribute('aria-selected'),'true');
 await page.keyboard.press('ArrowRight');assert.equal(await page.getByRole('tab',{name:'Staff Members',exact:true}).getAttribute('aria-selected'),'true');
 await page.locator(`[data-staff-action="staff-details"][data-id="${people[0].id}"]`).click();
 await page.getByRole('heading',{name:'Staff Details',exact:true}).waitFor();
 assert.equal(await page.locator('.staff-live .section-heading h2').textContent(),'Morgan Reed');
 await open();await page.getByRole('tab',{name:'Equipment',exact:true}).click();
 const equipment=page.locator('#department-panel-equipment');
 assert.ok((await equipment.innerText()).includes('Accounts Printer'));
 assert.ok(!(await equipment.innerText()).includes('Personal Laptop'));
 assert.ok(!(await equipment.innerText()).includes('Facilities Printer'));
 assert.equal(await equipment.locator('.small-table').first().locator('tbody tr').count(),1);
 const assignment=(await (await context.request.get(address+'/api/equipment/assignments?departmentId='+department.id)).json()).history[0];
 assert.ok((await equipment.innerText()).includes(new Date(assignment.assignedAt).toLocaleDateString('en-GB')));
 await equipment.getByRole('button',{name:'View Device',exact:true}).click();
 await page.getByRole('heading',{name:'Accounts Printer',exact:true}).waitFor();
 await page.keyboard.press('Escape');
 await page.getByRole('tab',{name:'History',exact:true}).click();
 assert.ok((await page.locator('#department-panel-history').innerText()).includes('Department Created'));
 assert.ok((await page.locator('#department-panel-history').innerText()).includes('Accounts Printer'));
 assert.ok(!(await page.locator('#department-panel-history').innerText()).includes('Facilities Printer'));
 assert.ok(!(await page.locator('.department-details').innerText()).includes('Simulated Permissions'));
 // Unlinked legacy records have no invented creation event.
 await open('legacy-empty');
 for(const [tab,label] of [['staff','Staff Members'],['equipment','Equipment'],['history','History']]){
  await page.getByRole('tab',{name:label,exact:true}).click();
  assert.equal(await page.locator('#department-panel-'+tab+' tbody tr').count(),0);
  await capture(page,'empty-'+tab);
 }
 for(const [name,info] of Object.entries(readerInfo)){
  const limited=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:390,height:844}});
  await limited.addCookies([{name:info.cookie,value:info.token,url:address,secure:true,httpOnly:true}]);
  const reader=await limited.newPage(),calls=[];
  reader.on('request',request=>calls.push(request.url()));reader.on('pageerror',error=>errors.push(error.message));
  await reader.goto(address+'/inventory#departments');await reader.locator('#app[aria-busy="false"]').waitFor();
  await reader.locator(`[data-staff-action="department-details"][data-id="${department.id}"]`).click();
  await reader.locator('.department-details').waitFor();
  assert.equal(await reader.locator('[data-staff-action="department-edit"]').count(),0);
  const expected=name==='department-staff'?['3','Not Available','Active']:name==='department-devices'?['Not Available','1','Active']:['Not Available','Not Available','Active'];
  assert.deepEqual(await reader.locator('.department-metrics .statnum').allTextContents(),expected);
  if(name!=='department-staff')assert.ok(!calls.some(url=>url.includes('/api/staff-members')));
  if(name!=='department-devices')assert.ok(!calls.some(url=>url.includes('/api/equipment/assignments')||url.includes('/api/inventory/devices')));
  assert.ok(!(await reader.locator('.department-details').innerText()).includes('Morgan Reed')||name==='department-staff');
  await reader.evaluate(()=>caffootSetTheme('dark'));await capture(reader,name+'-390-dark');
  if(name==='department-only'){
   await reader.getByRole('tab',{name:'History',exact:true}).click();
   assert.ok((await reader.locator('#department-panel-history').innerText()).includes('No Recorded Activity Available'));
  }
  await limited.close();
 }
 assert.equal(snapshot(),before,'Read-only views must preserve existing records and history');
 // Safe deletion remains limited to an unused Department.
 await open('legacy-empty');await page.locator('[data-staff-action="department-edit"]').click();
 assert.ok(await page.locator('[data-staff-action="department-delete"]').isVisible());
 page.once('dialog',dialog=>dialog.accept());await page.locator('[data-staff-action="department-delete"]').click();
 await page.getByRole('heading',{name:'Departments',exact:true}).waitFor();
 assert.equal(await page.locator('[data-staff-action="department-details"][data-id="legacy-empty"]').count(),0);
 // Existing management still operates on the same Department and retains assignments.
 await open();await page.locator('[data-staff-action="department-edit"]').click();
 assert.equal(await page.locator('[data-staff-action="department-delete"]').count(),0);
 await page.locator('#staff-department-name').fill('Accounts Team');
 await page.locator('#staff-department-form [type="submit"]').click();
 await page.getByRole('heading',{name:'Accounts Team',exact:true}).waitFor();
 await page.locator('[data-staff-action="department-edit"]').click();
 page.once('dialog',dialog=>dialog.accept());await page.locator('[data-staff-action="department-toggle"]').click();
 await page.locator('.department-status .badge').filter({hasText:'Archived'}).waitFor();
 await page.getByRole('tab',{name:'Equipment',exact:true}).click();
 assert.ok((await page.locator('#department-panel-equipment').innerText()).includes('Accounts Printer'));
 await page.setViewportSize({width:390,height:844});await capture(page,'archived-equipment-390-dark');
 await page.locator('[data-staff-action="department-edit"]').click();
 assert.equal(await page.locator('[data-staff-action="department-toggle"]').textContent(),'Reactivate');
 page.once('dialog',dialog=>dialog.accept());await page.locator('[data-staff-action="department-toggle"]').click();
 await page.locator('.department-status .badge').filter({hasText:'Active'}).waitFor();
 const afterAssignment=(await (await context.request.get(address+'/api/equipment/assignments?departmentId='+department.id)).json()).history[0];
 assert.deepEqual(afterAssignment,assignment,'Management must retain canonical assignment history');
 // Feature-off and permission revocation are checked by the existing servers.
 py('import sqlite3,sys;db=sqlite3.connect(sys.argv[1]);db.execute("UPDATE organisation_features SET enabled=0 WHERE feature=\'devices\'");db.commit()',[path.join(tmp,'inventory.sqlite3')]);
 await page.reload();await page.locator('#app[aria-busy="false"]').waitFor();await open();
 assert.deepEqual(await page.locator('.department-metrics .statnum').allTextContents(),['3','Not Available','Active']);
 await page.getByRole('tab',{name:'Equipment',exact:true}).click();
 assert.equal(await page.locator('#department-panel-equipment tbody tr').count(),0);
 await capture(page,'devices-disabled-390-dark');
 assert.deepEqual(errors,[]);
 report.checks=['Four tabs and keyboard navigation','Paginated Staff counts and existing Staff Details','Canonical Department-only equipment and genuine history','Independent read-only access and private states','Desktop/mobile light/dark with no document overflow','Read-only data preservation','Existing manage/archive/reactivate controls','Devices feature-off'];
 fs.writeFileSync(path.join(output,'checks.json'),JSON.stringify(report,null,2)+'\n');
 console.log('Department Details browser checks passed; '+Object.keys(report.captures).length+' genuine captures; no page errors.');
}
main().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();if(server)server.kill('SIGTERM');});
