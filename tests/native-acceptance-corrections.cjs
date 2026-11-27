// Focused checks of the five approved corrections against disposable HTTPS/SQLite data.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn,spawnSync}=require('node:child_process'),{createHash}=require('node:crypto');
const {openStaffAccount}=require('./staff-account-workflow.cjs');
const engine=process.env.CAFFOOT_CORRECTIONS_ENGINE||'chromium';
const root=path.resolve(__dirname,'..'),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-corrections-'));
const output=process.env.CAFFOOT_CORRECTIONS_OUTPUT||path.join(tmp,'evidence');fs.mkdirSync(output,{recursive:true});
const port=process.env.CAFFOOT_CORRECTIONS_PORT||'8117',address='https://127.0.0.1:'+port;
const database=path.join(tmp,'inventory.sqlite3');let browser,server;
const report={engine,checks:[],captures:[],errors:[]};
function py(code,args=[]){const r=spawnSync('python3',['-c',code,...args],{cwd:root,encoding:'utf8'});assert.equal(r.status,0,r.stderr);return r.stdout.trim();}
function checked(message){report.checks.push(message);console.log(message);}
async function main(){
 const seed=spawnSync('python3',['tests/visual_fixtures.py',tmp],{cwd:root,encoding:'utf8'});assert.equal(seed.status,0,seed.stderr);
 const credentials=JSON.parse(fs.readFileSync(path.join(tmp,'test-credentials.json')));
 // Preserve historical optional-feature identifiers and an explicitly recorded friendly name.
 py(`import sqlite3,json,sys
with sqlite3.connect(sys.argv[1]) as db:
 db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='it_assets'")
 for feature in ('it_assets','equipment_lifecycle','suppliers'):
  event=dict(at='2026-11-26T09:00:00Z',actor='Fictional Administrator',outcome='Succeeded',reason='Optional feature setting changed',changes=[dict(kind='Settings',action='Updated',label=feature,fields=['Enabled'],before=dict(enabled=False),after=dict(enabled=True))])
  db.execute('INSERT INTO inventory_change_history(record_json) VALUES(?)',(json.dumps(event),))
 event['changes'][0]['recordSubject']=dict(kind='Settings',id='feature:suppliers',name='Recorded Supplier Feature Name')
 db.execute('INSERT INTO inventory_change_history(record_json) VALUES(?)',(json.dumps(event),))`,[database]);
 const original=py('import sqlite3,json,sys;db=sqlite3.connect(sys.argv[1]);print(json.dumps(db.execute("SELECT id,record_json FROM inventory_change_history ORDER BY id").fetchall()))',[database]);
 const log=fs.openSync(path.join(tmp,'server.log'),'w');
 server=spawn('python3',['-c','import backend.server as s;import sys;s.PORT=int(sys.argv[1]);s.main()',port],{cwd:root,stdio:['ignore',log,log],env:{...process.env,CAFFOOT_DB_PATH:database,CAFFOOT_TLS_DIR:path.join(tmp,'tls'),CAFFOOT_WEB_ADDRESS:address,CAFFOOT_SERVER_ADDRESS:'127.0.0.1',CAFFOOT_HOST:'127.0.0.1'}});
 browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.CAFFOOT_CHROMIUM_PATH||undefined,args:['--no-sandbox']}:{})});
 report.browser=await browser.version();report.sourceRevision=spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).stdout.trim();
 report.sourceHashes=Object.fromEntries(['interface/application.js','interface/staff-directory.js','interface/equipment.js','interface/stock-intake.js','interface/screens/users.html','interface/styles/components.css'].map(file=>[file,createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')]));
 const context=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:1000},locale:'en-GB'});
 for(let i=0;i<60;i++){try{if((await context.request.get(address+'/health',{timeout:750})).ok())break;}catch{}await new Promise(r=>setTimeout(r,150));}
 const code=py('from backend.mfa import code_at;import sys,time;print(code_at(sys.argv[1],time.time()))',[credentials.secret]);
 const login=await context.request.post(address+'/api/login',{headers:{Origin:address},data:{username:credentials.username,password:credentials.password,mfa_code:code}});assert.equal(login.status(),200,await login.text());
 const session=await (await context.request.get(address+'/api/session')).json(),headers={Origin:address,'X-CSRF-Token':session.csrf_token};
 const get=async route=>{const r=await context.request.get(address+route);assert.equal(r.status(),200,await r.text());return r.json();};
 const save=async(route,data)=>{const r=await context.request.post(address+route,{headers,data});assert.equal(r.status(),200,await r.text());return r.json();};
 const department=(await save('/api/departments',{name:'Fictional Operations'})).department;
 const other=(await save('/api/departments',{name:'Fictional Facilities'})).department;
 const person=(await save('/api/staff-members',{firstName:'Morgan',lastName:'Reed',email:'morgan@example.test',departmentId:department.id,login:{username:'morgan.reed',password:'Fictional-Password-2026!'}})).staffMember;
 const deviceId='correction-printer';await save('/api/devices/create',{record:{id:deviceId,name:'Fictional Shared Printer',type:'Printer',status:'Active',primaryIp:'',typeDetails:{},mountType:'Desktop'}});
 await save('/api/devices/create',{record:{id:'correction-laptop',name:'Fictional Personal Laptop',type:'Laptop',status:'Active',primaryIp:'',typeDetails:{},mountType:'Desktop'}});
 await save('/api/equipment/assignments',{recipientKind:'staff',recipientId:person.id,devices:[{id:'correction-laptop',revision:0}]});
 const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
 await page.goto(address+'/inventory#staff');await page.locator('#app[aria-busy="false"]').waitFor();
 if(process.env.CAFFOOT_CORRECTIONS_ONLY_DEPARTMENT!=='1'){
 await openStaffAccount(page,'morgan.reed');
 const modal=page.locator('[data-staff-account-modal]');
 assert.deepEqual(await modal.getByRole('tab').allTextContents(),['Personal Details','Roles','Permissions','Account Controls']);
 await page.locator('#user-display-name').fill('Unsaved Morgan');
 for(const tab of ['roles','permissions','controls','personal'])await modal.locator('[data-account-tab="'+tab+'"]').click();
 assert.equal(await page.locator('#user-display-name').inputValue(),'Unsaved Morgan');
 const additionalRole=(await get('/api/users')).roles.find(role=>role.roleKey==='it_staff');
 await modal.locator('[data-account-tab="roles"]').click();
 await modal.locator('[data-role-membership="'+additionalRole.id+'"]').click();
 await page.locator('[data-role-layer] [data-role-command="close"]').first().click();
 assert.equal((await get('/api/users')).users.find(u=>u.id===person.accountId).accessDetails.roles.length,1);
 for(let i=0;i<2;i++){
  await modal.locator('[data-role-membership="'+additionalRole.id+'"]').click();
  await page.locator('[data-role-command="confirm"]').click();
  await page.locator('[data-role-layer]').waitFor({state:'detached'});
 }
 await modal.locator('[data-account-tab="personal"]').click();
 assert.equal(await page.locator('#user-display-name').inputValue(),'Unsaved Morgan');
 // An immediate account change must not replace personal details which have not been saved.
 await modal.locator('[data-account-tab="controls"]').click();
 await modal.locator('[data-next-user-operation="active"]').click();
 await page.waitForFunction(()=>document.querySelector('[data-next-user-operation="active"]')?.textContent==='Enable Login');
 assert.equal(await modal.locator('[data-account-tab="controls"]').getAttribute('aria-selected'),'true');
 await modal.locator('[data-next-user-operation="active"]').click();
 await page.waitForFunction(()=>document.querySelector('[data-next-user-operation="active"]')?.textContent==='Disable Login');
 await modal.locator('[data-account-tab="personal"]').click();
 assert.equal(await page.locator('#user-display-name').inputValue(),'Unsaved Morgan');
 assert.equal((await get('/api/users')).users.find(u=>u.id===person.accountId).profile.displayName,'');
 await page.locator('#next-user-profile-form [type="submit"]').click();
 await page.waitForFunction(()=>!document.querySelector('#next-user-profile-form [type="submit"]').disabled);
 assert.equal((await get('/api/users')).users.find(u=>u.id===person.accountId).profile.displayName,'Unsaved Morgan');
 await page.waitForFunction(()=>document.getElementById('toast').classList.contains('opacity-0'));
 checked('Four ordered tabs retain unsaved fields through tab and immediate account changes; Save Personal Details still saves explicitly');
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:width===390?844:1000});
  for(const theme of ['light','dark']){
   await page.evaluate(theme=>caffootSetTheme(theme),theme);
   for(const tab of ['personal','roles','permissions','controls']){
    const button=modal.locator('[data-account-tab="'+tab+'"]');await button.click();
    const geometry=await modal.evaluate(root=>{
     const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom,right:r.right};};
     const scroll=root.querySelector('.users-modal-scroll');scroll.scrollTop=scroll.scrollHeight;
     return {viewport:{width:innerWidth,height:innerHeight},dialog:rect(root.querySelector('[role="dialog"]')),head:rect(root.querySelector('.modal-head')),tabs:rect(root.querySelector('[role="tablist"]')),footer:rect(root.querySelector('.account-management-footer')),done:rect(root.querySelector('.account-management-footer button')),overflow:document.documentElement.scrollWidth>innerWidth};
    });
    assert.ok(!geometry.overflow,JSON.stringify(geometry));
    assert.ok(geometry.done.y>=0&&geometry.done.bottom<=geometry.viewport.height,JSON.stringify(geometry));
    assert.ok(geometry.head.y>=0&&geometry.head.bottom<=geometry.tabs.y+1,JSON.stringify(geometry));
    assert.ok(geometry.footer.bottom<=geometry.viewport.height,JSON.stringify(geometry));
    if(width===1440){assert.equal(Math.round(geometry.dialog.width),980);if(tab==='personal'){
     const alignment=await modal.evaluate(root=>['#user-display-name','#user-email'].map(id=>root.querySelector(id).getBoundingClientRect().y));assert.ok(Math.abs(alignment[0]-alignment[1])<1,JSON.stringify(alignment));
    }}
    await modal.locator('.users-modal-scroll').evaluate(e=>e.scrollTop=0);
    const name=`permissions-${tab}-${width}-${theme}.png`;
    await page.screenshot({path:path.join(output,name),fullPage:false});report.captures.push({file:name,geometry});
   }
  }
 }
 await page.setViewportSize({width:390,height:600});
 await modal.locator('[data-account-tab="personal"]').click();
 await page.locator('#account-tab-personal').press('End');assert.equal(await page.locator('#account-tab-controls').getAttribute('aria-selected'),'true');
 await page.locator('#account-tab-controls').press('Home');assert.equal(await page.locator('#account-tab-personal').getAttribute('aria-selected'),'true');
 await modal.locator('.account-management-footer button').click();
 checked('All four tabs fit desktop and narrow screens in both themes, with aligned inputs, fixed controls and keyboard tab navigation');
 await page.setViewportSize({width:1440,height:1000});await page.evaluate(()=>caffootSetTheme('light'));
 await page.evaluate(()=>switchTab('audit'));
 await page.getByRole('heading',{name:'Audit Trail',exact:true}).waitFor();
 for(const label of ['IT Assets','Equipment Lifecycle','Suppliers','Recorded Supplier Feature Name'])assert.ok(await page.locator('tr[data-audit-index]').filter({hasText:label}).count(),label);
 const supplierRow=page.locator('tr[data-audit-index]').filter({hasText:'Recorded Supplier Feature Name'}).first();await supplierRow.getByRole('button',{name:'View Details'}).click();
 const technical=page.locator('#audit-detail-body details');
 assert.equal(await technical.evaluate(el=>el.open),false);
 await technical.locator('summary').click();
 assert.match(await technical.innerText(),/suppliers/);
 await page.locator('[data-action="audit-close-detail"]').first().click();
 const downloadPromise=page.waitForEvent('download');await page.locator('[data-action="export-audit"]').click();const download=await downloadPromise;
 const exported=JSON.parse(fs.readFileSync(await download.path(),'utf8'));
 for(const [,raw] of JSON.parse(original))assert.ok(exported.events.some(event=>JSON.stringify(event)===JSON.stringify(JSON.parse(raw))));
 const preserved=py('import sqlite3,json,sys;db=sqlite3.connect(sys.argv[1]);ids=json.loads(sys.argv[2]);print(json.dumps([db.execute("SELECT id,record_json FROM inventory_change_history WHERE id=?",(i,)).fetchone() for i in ids]))',[database,JSON.stringify(JSON.parse(original).map(([id])=>id))]);assert.equal(preserved,original);
 checked('Friendly optional-feature audit labels prefer recorded names; original records, event details and JSON export stay intact');
 }
 // Open a Department and perform real mutations through the shared application handlers.
 await page.evaluate(()=>switchTab('departments'));
 await page.locator('[data-staff-action="department-details"][data-id="'+department.id+'"]').click();
 await page.locator('#department-tab-equipment').click();
 await page.getByText('No Current Shared Equipment',{exact:true}).waitFor();
 // Hold an old response until after the assignment's newer refresh has completed.
 let releaseOld,oldReady;const oldStarted=new Promise(resolve=>oldReady=resolve),oldHeld=new Promise(resolve=>releaseOld=resolve);let held=false;
 const assignmentRoute='**/api/equipment/assignments?departmentId='+department.id;
 await page.route(assignmentRoute,async route=>{if(held){await route.continue();return;}held=true;const response=await route.fetch();oldReady();await oldHeld;await route.fulfill({response});});
 const oldLoad=page.evaluate(()=>window.caffootStaffDirectory.equipmentChanged());oldLoad.catch(()=>{});await oldStarted;
 await page.evaluate(id=>openDeviceDetailView(id),deviceId);await page.locator('#device-details-tab-assigned').click();
 await page.locator('[data-equipment-action="assign-device"]').click();
 await page.locator('#equipment-recipient-kind').selectOption('department');
 await page.locator('[data-department-choice][value="'+department.id+'"]').check();
 await page.locator('#equipment-assignment-form [type="submit"]').click();
 await page.locator('#equipment-assignment-form').waitFor({state:'detached'});
 // Device Details is restored by the existing assignment workflow; close it to inspect Department data.
 await page.evaluate(()=>closeModal(true));
 await page.locator('#department-tab-equipment').click();
 await page.locator('#department-panel-equipment').getByText('Fictional Shared Printer',{exact:true}).first().waitFor();
 releaseOld();await oldLoad;await page.unroute(assignmentRoute);
 assert.ok(await page.locator('#department-panel-equipment').getByText('Fictional Shared Printer',{exact:true}).count());
 await page.locator('#department-tab-history').click();await page.locator('#department-panel-history').getByText('Device Assigned',{exact:true}).waitFor();
 // Change shared Departments through the same Device workflow.
 await page.evaluate(id=>openDeviceDetailView(id),deviceId);await page.locator('#device-details-tab-assigned').click();
 await page.locator('[data-equipment-action="manage-departments"]').click();
 await page.locator('[data-department-choice][value="'+other.id+'"]').check();
 await page.locator('[data-department-choice][value="'+department.id+'"]').uncheck();
 await page.locator('#equipment-assignment-form [type="submit"]').click();await page.locator('#equipment-assignment-form').waitFor({state:'detached'});
 await page.evaluate(()=>closeModal(true));await page.locator('#department-tab-equipment').click();await page.getByText('No Current Shared Equipment',{exact:true}).waitFor();
 // Return from the other Department; the original Department history remains retained.
 await page.locator('[data-staff-action="department-back"]').click();await page.locator('[data-staff-action="department-details"][data-id="'+other.id+'"]').click();
 await page.locator('#department-tab-equipment').click();await page.locator('#department-panel-equipment').getByText('Fictional Shared Printer',{exact:true}).first().waitFor();
 await page.evaluate(id=>openDeviceDetailView(id),deviceId);await page.locator('#device-details-tab-assigned').click();
 await page.locator('[data-equipment-action="return-device-stock"]').click();
 await page.locator('#stock-return-form').waitFor();await page.locator('#stock-return-form [type="submit"]').click();
 await page.locator('#stock-return-form').waitFor({state:'detached'});
 await page.evaluate(()=>{closeModal(true);switchTab('departments');});await page.locator('#department-tab-equipment').click();await page.getByText('No Current Shared Equipment',{exact:true}).waitFor();
 await page.locator('#department-tab-history').click();await page.locator('#department-panel-history').getByText('Device Returned',{exact:true}).first().waitFor();
 await page.evaluate(()=>switchTab('staff'));
 await page.locator('[data-staff-action="staff-details"][data-id="'+person.id+'"]').click();
 await page.locator('.equipment-staff').getByText('Fictional Personal Laptop',{exact:true}).waitFor();
 await page.locator('[data-equipment-action="view-device"][data-id="correction-laptop"]').click();
 await page.locator('#device-details-tab-assigned').click();
 await page.locator('#device-details-panel-assigned .assignment-main').getByText('Morgan Reed',{exact:true}).waitFor();
 await page.evaluate(()=>closeModal(true));
 const employee=await browser.newContext({ignoreHTTPSErrors:true});
 const employeeLogin=await employee.request.post(address+'/api/login',{headers:{Origin:address},data:{username:'morgan.reed',password:'Fictional-Password-2026!'}});assert.equal(employeeLogin.status(),200,await employeeLogin.text());
 const employeePage=await employee.newPage();await employeePage.goto(address+'/account');
 await employeePage.locator('#app[aria-busy="false"]').waitFor();
 await employeePage.getByRole('button',{name:'Open My Equipment',exact:true}).click();
 await employeePage.locator('[data-personal-equipment]').getByText('Fictional Personal Laptop',{exact:true}).waitFor();
 assert.equal(await employeePage.getByText('Fictional Shared Printer',{exact:true}).count(),0);
 await employee.close();
 checked('Related Staff, Device and My Equipment views retain the authorised personal assignment and reflect the returned shared Device');
 checked('Department equipment and history update after assignment, shared Department reassignment and return; delayed older responses cannot replace newer data');
 assert.deepEqual(report.errors,[]);fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(report,null,2));console.log('Evidence: '+output);
}
main().catch(error=>{console.error(error);console.error('Fixture: '+tmp);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();if(server)server.kill('SIGKILL');});
