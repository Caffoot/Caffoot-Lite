// Exercise the additive Users interface against disposable HTTPS/SQLite data.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {spawn,spawnSync}=require('node:child_process');
const browserEngine=process.env.CAFFOOT_ROLES_ENGINE||'chromium';
assert.ok(['chromium','firefox','webkit'].includes(browserEngine));
const engine=require('playwright')[browserEngine];
const root=path.resolve(__dirname,'..');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-roles-ui-'));
const out=process.env.CAFFOOT_ROLES_OUTPUT||path.join(tmp,'evidence');fs.mkdirSync(out,{recursive:true});
const address='https://127.0.0.1:8080';
let browser,server;
const errors=[],checks=[];
function python(code,args=[]){
 const result=spawnSync('python3',['-c',code,...args],{cwd:root,encoding:'utf8'});
 if(result.status!==0)throw Error(result.stderr);return result.stdout.trim();
}
function code(secret){return python('from backend.mfa import code_at;import sys,time;print(code_at(sys.argv[1],time.time()))',[secret]);}
async function catalogue(context){const r=await context.request.get(address+'/api/users');assert.equal(r.status(),200);return r.json();}
async function confirmedAction(context,action){
 const session=await (await context.request.get(address+'/api/session')).json();
 const options={headers:{Origin:address,'X-CSRF-Token':session.csrf_token},data:{action}};
 const preview=await context.request.post(address+'/api/users/roles/preview',options);assert.equal(preview.status(),200,await preview.text());
 const result=await context.request.post(address+'/api/users/roles/confirm',{...options,data:{action,proof:(await preview.json()).proof}});assert.equal(result.status(),200,await result.text());
}
async function checked(page,label){checks.push(label);console.log(label);}
async function screenshot(page,label,includeFeedback=false){
 if(!includeFeedback)await page.waitForFunction(()=>!document.getElementById('toast')||document.getElementById('toast').classList.contains('opacity-0'));
 await page.screenshot({path:path.join(out,label+'.png'),fullPage:true});
}
async function audit(page,label,selector){
 if(!process.env.CAFFOOT_AXE_SOURCE)return;
 await page.addScriptTag({path:process.env.CAFFOOT_AXE_SOURCE});
 const results=await page.evaluate(selector=>axe.run(selector,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}),selector);
 // Native select arrow images can stop axe reading an otherwise solid background.
 // Record the actual text/background colours for manual-review cases as well.
 results.manualContrastChecks=await page.evaluate(incomplete=>{
  const rgb=value=>(value.match(/[\d.]+/g)||[]).map(Number);
  const luminance=colour=>colour.slice(0,3).map(value=>{value/=255;return value<=0.04045?value/12.92:((value+0.055)/1.055)**2.4;}).reduce((total,value,index)=>total+value*[0.2126,0.7152,0.0722][index],0);
  return incomplete.filter(rule=>rule.id==='color-contrast').flatMap(rule=>rule.nodes.map(node=>{
   const element=document.querySelector(node.target[0]);let background=element;
   while(background&&rgb(getComputedStyle(background).backgroundColor)[3]===0)background=background.parentElement;
   const style=getComputedStyle(element),foreground=style.color,backdrop=getComputedStyle(background).backgroundColor;
   const first=luminance(rgb(foreground)),second=luminance(rgb(backdrop));
   return {selector:node.target[0],foreground,background:backdrop,backgroundImage:style.backgroundImage,ratio:(Math.max(first,second)+0.05)/(Math.min(first,second)+0.05),reviewReason:node.any.map(check=>check.message)};
  }));
 },results.incomplete);
 assert.ok(results.manualContrastChecks.every(check=>check.ratio>=4.5),JSON.stringify(results.manualContrastChecks));
 fs.writeFileSync(path.join(out,'accessibility-'+label+'.json'),JSON.stringify(results,null,2));
 assert.deepEqual(results.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})),[]);
}
async function confirm(page){
 const button=page.locator('[data-role-command="confirm"]');await button.click();await button.waitFor({state:'detached'});
}
(async()=>{
 try{
  const seed=spawnSync('python3',['tests/visual_fixtures.py',tmp],{cwd:root,encoding:'utf8'});assert.equal(seed.status,0,seed.stderr);
  const creds=JSON.parse(fs.readFileSync(path.join(tmp,'test-credentials.json')));
  const log=fs.openSync(path.join(tmp,'server.log'),'w');
  server=spawn('python3',['-m','backend.server'],{cwd:root,stdio:['ignore',log,log],env:{...process.env,CAFFOOT_DB_PATH:path.join(tmp,'inventory.sqlite3'),CAFFOOT_TLS_DIR:path.join(tmp,'tls'),CAFFOOT_WEB_ADDRESS:address,CAFFOOT_SERVER_ADDRESS:'127.0.0.1',CAFFOOT_HOST:'127.0.0.1'}});
  browser=await engine.launch({headless:true,...(browserEngine==='chromium'?{executablePath:process.env.CAFFOOT_CHROMIUM_PATH||undefined,args:['--no-sandbox']}:{})});
  const context=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:950}});
  for(let i=0;i<60;i++){try{if((await context.request.get(address+'/health')).ok())break}catch{}await new Promise(r=>setTimeout(r,100));}
  const login=await context.request.post(address+'/api/login',{headers:{Origin:address},data:{username:creds.username,password:creds.password,mfa_code:code(creds.secret)}});assert.equal(login.status(),200);
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  await page.goto(address+'/inventory#users');await page.locator('#app[aria-busy="false"]').waitFor();
  assert.deepEqual(await page.locator('.section-page-header .tabs button').allTextContents(),['Overview','User List','Add User','Manage Roles']);
  assert.equal(await page.locator('.users-live .cards4 .stat').count(),4);
  assert.equal(await page.locator('.users-live .two-col>.card').count(),2);
  await screenshot(page,'overview-1440');
  await page.locator('[data-action="select-users-section"][data-tab="add"]').click();
  await page.locator('#new-user-username').fill('colleague');await page.locator('#new-user-password').fill('Test-Colleague-2026!');
  await page.locator('#new-user-password-confirm').fill('Different!');
  await page.locator('#next-user-create-form [type="submit"]').click();
  assert.equal((await catalogue(context)).users.length,1);
  await page.locator('#new-user-password-confirm').fill('Test-Colleague-2026!');
  await page.locator('#user-first-name').fill('Test');
  await screenshot(page,'add-1440');
  await page.locator('#next-user-create-form [type="submit"]').click();
  await page.locator('#users-live-list').waitFor();
  let data=await catalogue(context),worker=data.users.find(user=>user.username==='colleague');
  assert.equal(worker.profile.firstName,'Test');assert.equal(worker.accessDetails.roles.length,1);assert.deepEqual(worker.permissions,{});
  await checked(page,'Add User confirms passwords and creates only protected Staff Member with the existing profile');
  await page.locator('[data-action="select-users-section"][data-tab="roles"]').click();
  await page.locator('[data-role-command="create"]').click();
  await page.locator('#role-name').fill('Inventory Readers');await page.locator('#role-grant-Devices').selectOption('read');
  await page.locator('[form="role-definition-form"]').click();
  await page.locator('[data-role-command="confirm"]').waitFor();
  assert.equal((await catalogue(context)).roles.length,1);
  await screenshot(page,'create-preview-1440');await audit(page,'role-preview','[data-role-layer]');await confirm(page);
  data=await catalogue(context);let role=data.roles.find(role=>role.name==='Inventory Readers');assert.ok(role);assert.equal(role.accountCount,0);
  await checked(page,'Role create uses preview then confirmation and leaves the new role unassigned');
  await page.locator('[data-action="select-users-section"][data-tab="list"]').click();
  await page.locator('[data-action="users-open-editor"][data-user-id="'+worker.id+'"]').click();
  assert.equal(await page.locator('#user-first-name').inputValue(),'Test');assert.ok(await page.locator('#user-first-name').isEditable());
  await page.locator('#user-first-name').fill('Updated');await page.locator('#next-user-profile-form [type="submit"]').click();
  await page.waitForFunction(()=>document.querySelector('#user-first-name')?.value==='Updated'&&!document.querySelector('#next-user-profile-form [type="submit"]').disabled);
  await audit(page,'user-additions',{include:['.role-memberships','.role-permission-summary']});
  const member=page.locator('[data-role-membership="'+role.id+'"]');await member.click();
  await page.locator('[data-role-command="confirm"]').waitFor();
  assert.equal((await catalogue(context)).users.find(user=>user.id===worker.id).accessDetails.roles.length,1);
  await page.locator('[data-role-layer] [data-role-command="close"]').first().click();
  assert.ok(!await member.isChecked());assert.ok(await member.evaluate(e=>e===document.activeElement));
  await member.click();await confirm(page);
  data=await catalogue(context);worker=data.users.find(user=>user.id===worker.id);assert.equal(worker.permissions.Devices,'read');assert.ok(worker.accessDetails.mfaPending);
  await checked(page,'Membership cancellation saves nothing; confirmation uses live inheritance and pending MFA');
  // Give the same role to a second real test account to check shared impact.
  const adminSession=await (await context.request.get(address+'/api/session')).json();
  const secondAccount=await context.request.post(address+'/api/users/create',{headers:{Origin:address,'X-CSRF-Token':adminSession.csrf_token},data:{username:'second-colleague',password:'Second-Colleague-2026!'}});assert.equal(secondAccount.status(),200);
  const secondId=(await catalogue(context)).users.find(user=>user.username==='second-colleague').id;
  await confirmedAction(context,{type:'membership.assign',roleId:role.id,userId:secondId});

  await page.locator('[data-action="users-close-editor"]').first().click();
  await page.locator('[data-action="select-users-section"][data-tab="roles"]').click();
  await page.locator('[data-role-command="create"]').click();await page.locator('#role-name').fill('Device Editors');await page.locator('#role-grant-Devices').selectOption('edit');await page.locator('[form="role-definition-form"]').click();await confirm(page);
  const additionalRole=(await catalogue(context)).roles.find(role=>role.name==='Device Editors');
  await screenshot(page,'notification-feedback-1440',true);await screenshot(page,'roles-list-1440');
  await page.locator('[data-action="select-users-section"][data-tab="list"]').click();await page.locator('[data-action="users-open-editor"][data-user-id="'+worker.id+'"]').click();
  await page.locator('[data-role-membership="'+additionalRole.id+'"]').click();await confirm(page);
  let multiple=(await catalogue(context)).users.find(user=>user.id===worker.id);
  assert.equal(multiple.accessDetails.roles.length,3);assert.equal(multiple.accessDetails.sections.Devices.inherited,'edit');
  await screenshot(page,'multiple-roles-1440');
  await page.locator('[data-role-membership="'+additionalRole.id+'"]').click();await confirm(page);
  multiple=(await catalogue(context)).users.find(user=>user.id===worker.id);assert.equal(multiple.accessDetails.sections.Devices.inherited,'read');
  await page.locator('[data-action="users-close-editor"]').first().click();await page.locator('[data-action="select-users-section"][data-tab="roles"]').click();await page.locator('[data-role-command="edit"][data-role-id="'+additionalRole.id+'"]').click();await page.locator('[data-role-command="delete"]').click();await confirm(page);
  await page.locator('[data-action="select-users-section"][data-tab="list"]').click();await page.locator('[data-action="users-open-editor"][data-user-id="'+worker.id+'"]').click();
  await checked(page,'Multiple role assignments display the server-provided highest inherited grant and retain the other role when one is removed');
  const select=page.locator('#live-user-permission-Devices');assert.equal(await select.inputValue(),'');
  await select.selectOption('deny');await page.locator('[data-role-command="confirm"]').waitFor();
  // Change the real role in another request while the displayed proof is pending.
  await confirmedAction(context,{type:'role.update',roleId:role.id,name:'Renamed Readers',enabled:true,grants:{Devices:'read',IPAM:'read'}});
  await page.locator('[data-role-command="confirm"]').click();
  await page.locator('[data-role-feedback]').filter({hasText:'Nothing was saved'}).waitFor();
  assert.equal((await catalogue(context)).users.find(user=>user.id===worker.id).accessDetails.sections.Devices.override,null);
  assert.ok((await page.locator('[data-role-impact]').innerText()).includes('Renamed Readers'));
  await screenshot(page,'stale-preview-1440');await page.setViewportSize({width:390,height:844});await screenshot(page,'stale-preview-390');await page.setViewportSize({width:1440,height:950});await confirm(page);
  assert.equal((await catalogue(context)).users.find(user=>user.id===worker.id).accessDetails.sections.Devices.override,'deny');
  await select.selectOption('');await confirm(page);
  await checked(page,'Stale real-backend confirmation saves nothing and requires explicit renewed confirmation; Inherit removes an override');
  // Exercise the full retained account controls, without changing the last administrator.
  await page.locator('[data-next-user-operation="active"]').click();
  await page.waitForFunction(()=>document.querySelector('[data-next-user-operation="active"]')?.textContent==='Enable');
  await page.locator('[data-next-user-operation="active"]').click();
  await page.waitForFunction(()=>document.querySelector('[data-next-user-operation="active"]')?.textContent==='Disable');
  assert.ok(await page.locator('[data-next-user-operation="admin"]').isEnabled());assert.ok(await page.locator('[data-next-user-operation="delete"]').isEnabled());
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:950});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Document overflow at '+width);
   assert.ok(await page.locator('#user-first-name').isEditable());
   assert.equal(await page.locator('.users-management-modal .modal').evaluate(e=>Math.round(e.getBoundingClientRect().width)),Math.min(710,width-20));
   await page.locator('.users-management-modal .modal').evaluate(element=>{element.scrollTop=0;element.querySelector('.modal-body').scrollTop=0;});
   await screenshot(page,'manage-'+width);
   await page.locator('[data-next-user-operation="delete"]').scrollIntoViewIfNeeded();await screenshot(page,'account-controls-'+width);
  }
  const close=page.locator('[data-action="users-close-editor"]').first();await close.focus();await page.keyboard.press('Shift+Tab');
  assert.equal(await page.evaluate(()=>document.activeElement.textContent.trim()),'Done');
  await page.keyboard.press('Escape');
  await checked(page,'Retained editable profile and account controls work; desktop/mobile fit and modal keyboard containment checked');
  await page.locator('[data-action="select-users-section"][data-tab="roles"]').click();
  await page.locator('[data-role-command="edit"][data-role-id="'+role.id+'"]').click();
  await page.locator('#role-name').fill('Readers Disabled');await page.locator('[name="enabled"]').uncheck();
  const sharedPreview=page.waitForResponse(response=>response.url().endsWith('/api/users/roles/preview'));
  await page.locator('[form="role-definition-form"]').click();
  const sharedImpact=await (await sharedPreview).json();delete sharedImpact.proof;
  assert.equal(sharedImpact.accountCount,2);assert.equal(sharedImpact.users.length,2);
  fs.writeFileSync(path.join(out,'shared-role-impact.json'),JSON.stringify(sharedImpact,null,2));
  await screenshot(page,'shared-role-preview-1440');await confirm(page);
  data=await catalogue(context);assert.equal(data.roles.find(r=>r.id===role.id).enabled,false);
  await page.locator('[data-role-command="edit"][data-role-id="'+role.id+'"]').click();
  await page.locator('[name="enabled"]').check();await page.locator('[form="role-definition-form"]').click();await confirm(page);
  await checked(page,'Role rename, disable and re-enable retain assignments and show server-computed impact for two assigned accounts');
  const workerContext=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:390,height:844}});
  const signIn=await workerContext.newPage();signIn.on('pageerror',error=>errors.push(error.message));
  await signIn.goto(address+'/setup');await signIn.locator('#username').fill('colleague');await signIn.locator('#password').fill('Test-Colleague-2026!');await signIn.locator('#submit').click();
  await signIn.locator('#enrolment:not([hidden])').waitFor();
  const secret=(await signIn.locator('#secret').textContent()).trim();assert.ok(secret.length>=16);
  assert.equal((await workerContext.request.get(address+'/api/session')).status(),401);
  assert.equal((await workerContext.request.get(address+'/inventory')).status(),401);
  await screenshot(signIn,'required-enrolment-390');await signIn.setViewportSize({width:1440,height:950});await screenshot(signIn,'required-enrolment-1440');await signIn.setViewportSize({width:390,height:844});await audit(signIn,'required-enrolment','#enrolment');await signIn.locator('#code').fill(code(secret));await signIn.locator('#submit').click();
  await signIn.getByText('MFA enrolled. Sign in again with your password and authenticator code.').waitFor();
  assert.equal(await signIn.locator('#secret').textContent(),'');assert.equal(await signIn.locator('#password').inputValue(),'');assert.equal(await signIn.locator('#code').inputValue(),'');
  assert.equal((await workerContext.request.get(address+'/api/session')).status(),401);
  await signIn.locator('#password').fill('Test-Colleague-2026!');await signIn.locator('#submit').click();await signIn.locator('#code-field:not([hidden])').waitFor();await signIn.locator('#code').fill(code(secret));
  await signIn.waitForURL('**/inventory');await signIn.locator('#app[aria-busy="false"]').waitFor();
  await checked(page,'Mandatory pre-login enrolment uses ordinary-account routes, grants no session, clears secrets and requires fresh MFA sign-in');
  await signIn.goto(address+'/account');await signIn.locator('#app[aria-busy="false"]').waitFor();
  await signIn.locator('.account-screen .subnav [data-section="security"]').click();
  assert.equal(await signIn.locator('.optional-mfa-removal').count(),0);
  const requiredSession=await (await workerContext.request.get(address+'/api/session')).json();assert.equal(requiredSession.mfa_removal_eligible,false);
  assert.equal((await workerContext.request.post(address+'/api/account/mfa/remove',{headers:{Origin:address,'X-CSRF-Token':requiredSession.csrf_token},data:{password:'Test-Colleague-2026!',code:code(secret)}})).status(),403);
  await workerContext.close();
  await page.locator('[data-action="select-users-section"][data-tab="list"]').click();await page.locator('[data-action="users-open-editor"][data-user-id="'+worker.id+'"]').click();
  await page.locator('[data-next-user-operation="admin"]').click();await page.waitForFunction(()=>document.querySelector('[data-next-user-operation="admin"]')?.textContent==='Remove admin');
  assert.ok((await catalogue(context)).users.find(user=>user.id===worker.id).isAdmin);
  await page.locator('[data-next-user-operation="admin"]').click();await page.waitForFunction(()=>document.querySelector('[data-next-user-operation="admin"]')?.textContent==='Make admin');
  assert.equal((await catalogue(context)).users.find(user=>user.id===worker.id).isAdmin,false);
  await page.locator('[data-action="users-close-editor"]').first().click();await page.locator('[data-action="select-users-section"][data-tab="roles"]').click();
  await checked(page,'Retained independent Administrator promotion and demotion work after confirmed MFA without replacing role controls');

  await page.locator('[data-role-command="edit"][data-role-id="'+role.id+'"]').click();await page.locator('[data-role-command="delete"]').click();await confirm(page);
  assert.ok(!(await catalogue(context)).roles.some(r=>r.id===role.id));
  await checked(page,'Role deletion uses reviewed impact and leaves accounts intact');
  await page.locator('[data-action="select-users-section"][data-tab="list"]').click();await page.locator('[data-action="users-open-editor"][data-user-id="'+secondId+'"]').click();
  page.once('dialog',dialog=>dialog.accept());await page.locator('[data-next-user-operation="delete"]').click();
  await page.waitForFunction(()=>!document.querySelector('.users-management-modal'));
  assert.deepEqual((await catalogue(context)).users.map(user=>user.username),['owner','colleague']);
  await page.locator('[data-action="select-users-section"][data-tab="roles"]').click();
  await checked(page,'Retained Delete User confirmation removes only the selected test account');

  const staffContext=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:390,height:844}});
  const staff=await staffContext.newPage();const staffRequests=[];staff.on('request',request=>staffRequests.push(new URL(request.url()).pathname));staff.on('pageerror',error=>errors.push(error.message));
  await staff.goto(address+'/setup');await staff.locator('#username').fill('colleague');await staff.locator('#password').fill('Test-Colleague-2026!');await staff.locator('#submit').click();await staff.locator('#code-field:not([hidden])').waitFor();await staff.locator('#code').fill(code(secret));
  await staff.waitForURL('**/account');await staff.locator('#app[aria-busy="false"]').waitFor();
  assert.ok(!staffRequests.includes('/api/inventory/state'),'Staff account shell must not request inventory data');
  const accountSession=await (await staffContext.request.get(address+'/api/session')).json();assert.equal(accountSession.mfa_removal_eligible,true);
  for(const resource of ['/inventory','/inventory?rack-print=same-tab','/api/inventory/state','/api/users','/api/settings/email'])assert.equal((await staffContext.request.get(address+resource)).status(),403,resource);
  const anonymous=await browser.newContext({ignoreHTTPSErrors:true});
  for(const resource of ['/account','/interface/application.js','/api/account/profile'])assert.equal((await anonymous.request.get(address+resource)).status(),401,resource);await anonymous.close();
  assert.equal((await staffContext.request.post(address+'/api/users/profile',{headers:{Origin:address,'X-CSRF-Token':accountSession.csrf_token},data:{userId:1,profile:{firstName:'Forbidden'}}})).status(),403);
  await staff.evaluate(()=>switchTab('devices'));assert.equal(await staff.locator('.account-screen').count(),1);
  await staff.locator('.account-screen .subnav [data-section="security"]').click();
  await staff.locator('.optional-mfa-removal summary').click();
  await staff.locator('#account-mfa-removal-form [name="password"]').fill('Wrong-Password!');await staff.locator('#account-mfa-removal-form [name="code"]').fill(code(secret));await staff.locator('#account-mfa-removal-form [type="submit"]').click();
  await staff.locator('[data-mfa-removal-feedback]').filter({hasText:'forbidden'}).waitFor();assert.equal((await staffContext.request.get(address+'/api/session')).status(),200);
  await screenshot(staff,'optional-removal-390');await audit(staff,'optional-removal','.optional-mfa-removal');
  await staff.setViewportSize({width:1440,height:950});await screenshot(staff,'optional-removal-1440');
  await staff.evaluate(()=>caffootSetTheme('dark'));await staff.locator('.optional-mfa-removal summary').click();await screenshot(staff,'optional-removal-dark-1440');await audit(staff,'optional-removal-dark','.optional-mfa-removal');
  await staff.evaluate(()=>caffootSetTheme('light'));await staff.locator('.optional-mfa-removal summary').click();await staff.setViewportSize({width:390,height:844});
  const otherStaff=await browser.newContext({ignoreHTTPSErrors:true});assert.equal((await otherStaff.request.post(address+'/api/login',{headers:{Origin:address},data:{username:'colleague',password:'Test-Colleague-2026!',mfa_code:code(secret)}})).status(),200);
  await staff.locator('#account-mfa-removal-form [name="password"]').fill('Test-Colleague-2026!');await staff.locator('#account-mfa-removal-form [name="code"]').fill(code(secret));await staff.locator('#account-mfa-removal-form [type="submit"]').click();
  await staff.waitForURL('**/setup');await staff.getByText('MFA removed. All sessions have ended. Sign in again.').waitFor();
  assert.equal((await staffContext.request.get(address+'/api/session')).status(),401);assert.equal((await otherStaff.request.get(address+'/api/session')).status(),401);await otherStaff.close();
  await staff.locator('#username').fill('colleague');await staff.locator('#password').fill('Test-Colleague-2026!');await staff.locator('#submit').click();await staff.waitForURL('**/account');await staff.locator('#app[aria-busy="false"]').waitFor();
  await staff.locator('.account-screen .subnav [data-section="security"]').click();assert.ok(await staff.locator('#next-account-mfa-start').isVisible());
  await screenshot(staff,'staff-my-account-390');await staffContext.close();
  await checked(page,'Approved /account shell permits only own-account functionality; unauthenticated access and Staff inventory/admin/other-user access are denied; optional removal verifies proofs and ends all sessions');
  if(process.env.CAFFOOT_AXE_SOURCE){
   await page.locator('[data-role-command="create"]').click();
   await audit(page,'role-editor','[data-role-layer]');
   await screenshot(page,'role-editor-1440');
   await page.setViewportSize({width:390,height:844});await screenshot(page,'role-editor-390');
   await page.evaluate(()=>{localStorage.setItem('caffoot_theme_preference','dark');caffootApplyTheme();});await screenshot(page,'role-editor-dark-390');await audit(page,'role-editor-dark','[data-role-layer]');
   await page.evaluate(()=>{localStorage.setItem('caffoot_theme_preference','light');caffootApplyTheme();});
   await checked(page,'New role editor, preview, permission additions, required enrolment and optional removal pass targeted axe WCAG 2 A/AA and 2.1 AA checks, including dark-theme additions');
  }
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({checks,errors},null,2));
 }finally{
  if(browser)await browser.close();if(server){server.kill('SIGTERM');await new Promise(resolve=>server.once('exit',resolve));}
 }
})().catch(error=>{console.error(error);process.exitCode=1});
