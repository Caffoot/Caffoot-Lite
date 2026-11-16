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
  " db.execute('INSERT INTO account_permission_overrides(account_id,section,level) VALUES(?,?,?)',(user,'Devices','read'))",
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
 const report={};

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
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:width===390?844:950});
  for(const theme of ['light','dark']){
   await page.evaluate(theme=>caffootSetTheme(theme),theme);
   const choiceStyles=await verifyDeviceChoiceStyles(theme);
   const name=`staff-assignment-${width}-${theme}`;
   await capture(name);report[name].choiceStyles=choiceStyles;
  }
 }

 await page.locator('#equipment-assignment-form [type="submit"]').click();
 await page.locator('#equipment-assignment-form').waitFor({state:'hidden'});
 await page.getByRole('heading',{name:'Assigned Equipment',exact:true}).waitFor();
 await page.locator('.equipment-staff [data-equipment-action="view-device"]').first().waitFor();
 assert.equal(await page.locator('.staff-live .two-col').innerHTML(),profileBefore);
 assert.equal(await page.locator('.equipment-staff [data-equipment-action="view-device"]').count(),2);
 assert.equal(await page.locator('.staff-history-list tr').first().locator('td').count(),2);
 async function verifyDeviceChoiceStyles(theme){
  const selected=page.locator('#equipment-device-choices label:has(input:checked)').first();
  const idle=page.locator('#equipment-device-choices label').filter({hasText:'Reception-PC · Desktop'});
  const checkbox=idle.locator('input');
  const palette=await page.evaluate(()=>{
   const style=getComputedStyle(document.documentElement),result={};
   for(const key of ['theme-text','theme-hover','theme-warning-bg','theme-warning-text']){
    const hex=style.getPropertyValue('--'+key).trim().replace('#','');
    result[key]=hex?`rgb(${[0,2,4].map(start=>parseInt(hex.slice(start,start+2),16)).join(', ')})`:null;
   }
   return result;
  });
  const styleOf=element=>element.evaluate(label=>{
   const input=label.querySelector('input'),style=getComputedStyle(label),focus=getComputedStyle(input);
   return {color:style.color,background:style.backgroundColor,checked:input.checked,disabled:input.disabled,
    outlineWidth:focus.outlineWidth,outlineStyle:focus.outlineStyle,outlineOffset:focus.outlineOffset};
  });
  await page.mouse.move(0,0);
  const idleStyle=await styleOf(idle),selectedStyle=await styleOf(selected);
  assert.equal(idleStyle.color,theme==='dark'?palette['theme-text']:'rgb(49, 81, 107)');
  assert.equal(selectedStyle.color,theme==='dark'?palette['theme-warning-text']:'rgb(151, 82, 23)');
  assert.equal(selectedStyle.background,theme==='dark'?palette['theme-warning-bg']:'rgb(255, 242, 232)');
  await idle.hover();
  const hovered=await styleOf(idle);
  assert.equal(hovered.background,theme==='dark'?palette['theme-hover']:'rgb(238, 244, 250)');
  assert.equal(hovered.color,theme==='dark'?palette['theme-text']:'rgb(49, 81, 107)');
  await selected.hover();
  const selectedHover=await styleOf(selected);
  assert.equal(selectedHover.color,selectedStyle.color);
  assert.equal(selectedHover.background,selectedStyle.background);
  await page.mouse.move(0,0);
  await checkbox.focus();
  await page.keyboard.press('Space');
  assert.equal(await checkbox.isChecked(),true,'Keyboard selection must remain functional');
  const toggled=await styleOf(idle);
  assert.equal(toggled.color,selectedStyle.color);
  assert.equal(toggled.background,selectedStyle.background);
  await page.keyboard.press('Space');
  assert.equal(await checkbox.isChecked(),false);
  const focused=await styleOf(idle);
  assert.equal(focused.color,idleStyle.color);
  assert.equal(focused.outlineWidth,toggled.outlineWidth);
  assert.equal(focused.outlineStyle,toggled.outlineStyle);
  assert.equal(focused.outlineOffset,toggled.outlineOffset);
  assert.notEqual(focused.outlineStyle,'none');
  assert.ok(parseFloat(focused.outlineWidth)>0,'Keyboard focus must remain visible');
  try{
   // Exercise the existing native disabled state without changing eligibility.
   await checkbox.evaluate(input=>{input.disabled=true;});
   await idle.click({force:true});
   assert.equal(await checkbox.isDisabled(),true);
   assert.equal(await checkbox.isChecked(),false,'Disabled input must not toggle');
   await page.mouse.move(0,0);
   const disabled=await styleOf(idle);
   assert.equal(disabled.color,'rgb(49, 81, 107)','The dark contrast rule must not override disabled labels');
   return {idle:idleStyle,selected:selectedStyle,hovered,selectedHover,toggled,focused,disabled};
  }finally{
   await checkbox.evaluate(input=>{input.disabled=false;input.blur();});
   await page.mouse.move(0,0);
  }
 }
 async function capture(name,currentPage=page){
  await currentPage.waitForFunction(()=>{
   const equipment=document.querySelector('[data-equipment-staff]');
   return !equipment||!equipment.textContent.includes('Loading assigned equipment');
  });
  if(name.startsWith('staff-')&&!name.startsWith('staff-assignment-')){
   const positions=await currentPage.locator('.staff-live').evaluate(root=>{
    const action=root.querySelector('[data-staff-action="staff-status"]');
    const equipment=root.querySelector('[data-equipment-staff]');
    const profile=root.querySelector('.two-col');
    const login=[...root.querySelectorAll('.card')].find(card=>card.querySelector('h3')?.textContent==='Caffoot Login');
    return {hasAction:!!action,actionBottom:action?.getBoundingClientRect().bottom,
     actionTop:action?.getBoundingClientRect().top,equipmentTop:equipment.getBoundingClientRect().top,
     profileBottom:(login||profile).getBoundingClientRect().bottom,
     actionBeforeEquipment:action?!!(action.compareDocumentPosition(equipment)&Node.DOCUMENT_POSITION_FOLLOWING):null};
   });
   if(name.includes('restricted'))assert.equal(positions.hasAction,false);
   else{
    assert.equal(positions.actionBeforeEquipment,true,'Staff status action must precede equipment');
    assert.ok(positions.actionTop>=positions.profileBottom,'Status action must follow profile/login content');
    assert.ok(positions.actionBottom<=positions.equipmentTop,'Status action must sit above equipment');
   }
   const notice=await currentPage.locator('.staff-assignment-top + .staff-assignment-tip').evaluateAll(items=>items.map(item=>{
    const heading=item.previousElementSibling,card=item.parentElement;
    return {text:item.textContent,left:item.getBoundingClientRect().left,
     headingLeft:heading.querySelector('h3').getBoundingClientRect().left,
     rightInset:card.getBoundingClientRect().right-item.getBoundingClientRect().right,
     headingRightInset:parseFloat(getComputedStyle(heading).paddingRight)+parseFloat(getComputedStyle(card).borderRightWidth)};
   }));
   for(const item of notice){
    assert.equal(item.text,'Inactive Staff Member — outstanding assignments are retained. New assignments are unavailable.');
    assert.ok(Math.abs(item.left-item.headingLeft)<1,'Inactive notice must align with its heading');
    assert.ok(Math.abs(item.rightInset-item.headingRightInset)<1,'Inactive notice must retain the matching right inset');
   }
   report[name]={positions,notice};
  }
  if(name.startsWith('device-')){
   const visible=await currentPage.locator('#device-details-tab-assigned').evaluate(e=>{
    const tab=e.getBoundingClientRect(),strip=e.parentElement.getBoundingClientRect();
    return tab.left>=strip.left-1&&tab.right<=strip.right+1;
   });assert.ok(visible,'Selected Assigned To tab must remain visible after resizing');
  }
  const fullPage=!(await currentPage.locator('#modal-container').isVisible());
  await currentPage.screenshot({path:path.join(output,name+'.png'),fullPage});
  const metrics=await currentPage.evaluate(()=>({width:innerWidth,documentWidth:document.documentElement.scrollWidth,
   theme:document.documentElement.className,focused:document.activeElement?.tagName}));
  assert.ok(metrics.documentWidth<=metrics.width+1,JSON.stringify(metrics));report[name]={...report[name],...metrics,fullPage};
 }
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:width===390?844:950});
  for(const theme of ['light','dark']){await page.evaluate(theme=>caffootSetTheme(theme),theme);await capture(`staff-${width}-${theme}`);}
 }
 // Confirm actual status operations retain equipment, history and the linked login.
 const assignmentsBefore=await (await context.request.get(address+'/api/equipment/assignments?staffId='+person.id)).json();
 const accountBefore=(await (await context.request.get(address+'/api/users')).json()).users.find(user=>user.id===person.accountId);
 const restricted=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:950}});
 await restricted.addCookies([{name:readerInfo.cookie,value:readerInfo.token,url:address,secure:true,httpOnly:true,sameSite:'Strict'}]);
 const restrictedPage=await restricted.newPage();restrictedPage.on('pageerror',e=>errors.push(e.message));
 async function restrictedStaff(active){
  if(restrictedPage.url()===address+'/inventory#staff')await restrictedPage.reload();
  else await restrictedPage.goto(address+'/inventory#staff');
  await restrictedPage.locator('#app[aria-busy="false"]').waitFor();
  await restrictedPage.locator(`[data-staff-action="staff-details"][data-id="${person.id}"]`).click();
  await restrictedPage.locator('.equipment-staff [data-equipment-action="view-device"]').first().waitFor();
  assert.equal(await restrictedPage.locator('[data-staff-action="staff-status"],[data-staff-action="staff-edit"],[data-staff-action="manage-login"],[data-equipment-action="assign-staff"]').count(),0);
  assert.equal(await restrictedPage.locator('.staff-live').getByRole('heading',{name:'Caffoot Login',exact:true}).count(),0);
  assert.equal(await restrictedPage.locator('.staff-live .section-heading .badge').textContent(),active?'Active':'Inactive');
  for(const width of [1440,390]){
   await restrictedPage.setViewportSize({width,height:width===390?844:950});
   for(const theme of ['light','dark']){
    await restrictedPage.evaluate(theme=>caffootSetTheme(theme),theme);
    await capture(`staff-restricted-${active?'active':'inactive'}-${width}-${theme}`,restrictedPage);
   }
  }
 }
 await restrictedStaff(true);
 // Cancel preserves the Staff status and the existing confirmation wording.
 page.once('dialog',dialog=>{assert.match(dialog.message(),/^Mark Inactive Alex Morgan\?/);void dialog.dismiss();});
 await page.locator('[data-staff-action="staff-status"]').click();
 assert.equal((await (await context.request.get(address+'/api/staff-members/'+person.id)).json()).staffMember.active,true);
 page.once('dialog',dialog=>{assert.match(dialog.message(),/^Mark Inactive Alex Morgan\?/);void dialog.accept();});
 await page.locator('[data-staff-action="staff-status"]').click();
 await page.locator('[data-staff-action="staff-status"]').filter({hasText:'Reactivate'}).waitFor();
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:width===390?844:950});
  for(const theme of ['light','dark']){await page.evaluate(theme=>caffootSetTheme(theme),theme);await capture(`staff-inactive-${width}-${theme}`);}
 }
 assert.equal(await page.locator('[data-equipment-action="assign-staff"]').count(),0);
 assert.deepEqual(await (await context.request.get(address+'/api/equipment/assignments?staffId='+person.id)).json(),assignmentsBefore);
 await restrictedStaff(false);
 page.once('dialog',dialog=>{assert.match(dialog.message(),/^Reactivate Alex Morgan\?/);void dialog.accept();});
 await page.locator('[data-staff-action="staff-status"]').click();
 await page.locator('[data-staff-action="staff-status"]').filter({hasText:'Mark Inactive'}).waitFor();
 await page.locator('[data-equipment-action="assign-staff"]').waitFor();
 assert.deepEqual(await (await context.request.get(address+'/api/equipment/assignments?staffId='+person.id)).json(),assignmentsBefore);
 assert.deepEqual((await (await context.request.get(address+'/api/users')).json()).users.find(user=>user.id===person.accountId),accountBefore);
 const readerSession=await (await restricted.request.get(address+'/api/session')).json();
 assert.equal(readerSession.mfa_enrolled,true);
 assert.equal((await restricted.request.post(address+'/api/staff-members/'+person.id,{headers:{Origin:address,'X-CSRF-Token':readerSession.csrf_token},data:{active:false}})).status(),403);
 await restricted.close();
 // Existing Edit and Manage Login controls still open their original views.
 await page.setViewportSize({width:1440,height:950});
 await page.evaluate(()=>caffootSetTheme('light'));
 await page.locator('[data-staff-action="staff-edit"]').click();
 await page.locator('#staff-record-form').waitFor();
 assert.equal(await page.locator('#preview-firstName').inputValue(),'Alex');
 await page.locator('#staff-record-form [data-staff-action="staff-back"]').click();
 await page.locator(`[data-staff-action="staff-details"][data-id="${person.id}"]`).click();
 await page.locator('[data-staff-action="manage-login"]').click();
 await page.locator('[data-next-user-permission][data-section="Devices"]').waitFor();
 await page.locator('[data-action="users-close-editor"]').first().click();
 console.log('Staff status, restricted views, editing and Manage Login preservation passed');
 await page.locator('#sidebar [data-tab="staff"]').click();
 const detailsLink=page.locator(`[data-staff-action="staff-details"][data-id="${person.id}"]`);
 if(await detailsLink.count())await detailsLink.click();
 await page.getByRole('heading',{name:'Staff Details',exact:true}).waitFor();
 await page.locator('.equipment-staff [data-equipment-action="view-device"]').first().click();
 await page.locator('#device-details-tab-assigned').click();
 await page.locator('#device-details-panel-assigned').getByText('Alex Morgan',{exact:true}).first().waitFor();
 assert.equal(await page.locator('.device-review-footer button').count()>=4,true);
 assert.equal(await page.locator('#device-details-panel-assigned').getByRole('button',{name:/Return/}).count(),0);
 assert.equal(await page.locator('#device-details-panel-assigned').getByRole('button',{name:'Reassign Device',exact:true}).count(),1);
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
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:width===390?844:950});
  for(const theme of ['light','dark']){await page.evaluate(theme=>caffootSetTheme(theme),theme);await capture(`assignment-${width}-${theme}`);}
 }
 await page.keyboard.press('Tab');
 assert.ok(await page.locator('#modal-content').evaluate(e=>e.contains(document.activeElement)));
 await page.locator('#equipment-assignment-form [type="submit"]').click();
 await page.locator('#device-details-panel-assigned').getByText('Production',{exact:true}).first().waitFor();
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:width===390?844:950});
  for(const theme of ['light','dark']){await page.evaluate(theme=>caffootSetTheme(theme),theme);await capture(`device-shared-${width}-${theme}`);}
 }

 await page.locator('.device-review-footer [data-action="close-modal"]').click();
 // The employee gets both safe sections while inventory remains inaccessible.
 const employee=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:390,height:844}});
 const employeeLogin=await employee.request.post(address+'/api/login',{headers:{Origin:address},data:{username:'alex.morgan',password:'Fictional-Pass-2026!'}});
 assert.equal(employeeLogin.status(),200,await employeeLogin.text());
 const employeePage=await employee.newPage();employeePage.on('pageerror',e=>errors.push(e.message));
 const inventoryRequests=[];employeePage.on('request',r=>{if(r.url().endsWith('/api/inventory/state'))inventoryRequests.push(r.url());});
 await employeePage.goto(address+'/account');
 await employeePage.locator('#app[aria-busy="false"]').waitFor();
 await employeePage.locator('.account-screen').waitFor();
 for(const width of [1440,390]){
  await employeePage.setViewportSize({width,height:width===390?844:950});
  for(const theme of ['light','dark']){
   await employeePage.evaluate(theme=>caffootSetTheme(theme),theme);
   await capture(`my-account-${width}-${theme}`,employeePage);
  }
 }
 await employeePage.locator('.account-screen .subnav [data-section="security"]').click();
 await employeePage.locator('#next-account-mfa-start').waitFor();
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
   await capture(`personal-${width}-${theme}`,employeePage);
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
 console.log('PASS: Staff status placement/confirmation/reactivation, administrator and restricted views, unchanged assignments/login, canonical allocation/history, private personal/shared sections, My Account, 1440/390px light/dark and modal keyboard containment.');
}
(async()=>{try{await test();}finally{if(browser)await browser.close();if(server){server.kill('SIGTERM');if(server.exitCode===null)await new Promise(r=>server.once('exit',r));}}})().catch(e=>{console.error(e);process.exitCode=1});
