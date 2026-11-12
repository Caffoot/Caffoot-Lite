// Exercise configurable IT Staff through the existing approved role dialogs.
const assert=require('node:assert/strict');
module.exports=async({page,context,catalogue,confirmedAction,confirm,screenshot,checked})=>{
 const address='https://127.0.0.1:8080';
 const session=await (await context.request.get(address+'/api/session')).json();
 const headers={Origin:address,'X-CSRF-Token':session.csrf_token};
 let data=await catalogue(context),role=data.roles.find(role=>role.roleKey==='it_staff');
 assert.ok(role.isBuiltin&&role.enabled);assert.equal(role.accountCount,0);
 assert.deepEqual(role.grants,{Devices:'edit',IPAM:'edit',Racks:'edit'});
 const accounts={};
 for(const name of ['dave','tim']){
  const response=await context.request.post(address+'/api/users/create',{headers,data:{username:name,password:'Fictional-IT-Staff-Password!'}});
  assert.equal(response.status(),200,await response.text());
  const user=(await catalogue(context)).users.find(user=>user.username===name);accounts[name]=user.id;
  assert.equal(user.accessDetails.roles.length,1);assert.equal(user.accessDetails.roles[0].roleKey,'staff_member');
 }
 async function manageUser(name){
  // Reload after fixture API writes; navigating to the same hash keeps cached users.
  await page.reload({waitUntil:'networkidle'});await page.locator('.users-live').waitFor();
  await page.locator('.section-page-header [data-action="select-users-section"][data-tab="list"]').click();
  await page.locator('#users-live-list').waitFor();
  assert.equal(await page.locator('[data-action="users-open-editor"][data-user-id="'+accounts[name]+'"]').count(),1,
    JSON.stringify({name,id:accounts[name],rows:await page.locator('[data-users-row]').evaluateAll(rows=>rows.map(row=>({id:row.dataset.id,name:row.querySelector('.username')?.textContent,button:row.querySelector('button')?.outerHTML})))}));
  await page.locator('[data-action="users-open-editor"][data-user-id="'+accounts[name]+'"]').click();
 }
 for(const name of ['dave','tim']){
  await manageUser(name);
  assert.equal(await page.locator('[data-role-membership="1"]').isDisabled(),true);
  await page.locator('[data-role-membership="'+role.id+'"]').click();await page.locator('[data-role-command="confirm"]').waitFor();await confirm(page);
 }
 for(const section of ['Devices','Racks'])await confirmedAction(context,{type:'override.set',userId:accounts.dave,section,level:'read'});
 data=await catalogue(context);
 const dave=data.users.find(user=>user.id===accounts.dave),tim=data.users.find(user=>user.id===accounts.tim);
 assert.deepEqual(dave.permissions,{Devices:'read',IPAM:'edit',Racks:'read'});assert.deepEqual(tim.permissions,role.grants);
 assert.ok(dave.accessDetails.mfaPending&&tim.accessDetails.mfaPending);
 const login=await context.request.post(address+'/api/login',{headers:{Origin:address},data:{username:'tim',password:'Fictional-IT-Staff-Password!'}});
 assert.equal(login.status(),200);assert.equal((await login.json()).status,'mfa enrolment required');
 // A setup-required response must not replace the administrator's existing session.
 assert.equal((await (await context.request.get(address+'/api/session')).json()).username,session.username);
 await manageUser('dave');
 const modal=page.locator('.users-management-modal');
 assert.match(await modal.innerText(),/Individual overrides take precedence/);
 assert.equal(await modal.locator('.access-grid').evaluate(element=>element.children.length),3,'The three existing permission cards retain their layout');
 await screenshot(page,'it-staff-dave-1440');
 await page.setViewportSize({width:390,height:844});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await screenshot(page,'it-staff-dave-390');
 await page.setViewportSize({width:1440,height:950});
 await page.locator('[data-action="users-close-editor"]').first().click();
 async function editor(){
  await page.locator('[data-action="select-users-section"][data-tab="roles"]').click();
  await page.locator('[data-role-command="edit"][data-role-id="'+role.id+'"]').click();
  assert.equal(await page.locator('#role-name').getAttribute('readonly'),'');
  assert.equal(await page.locator('[data-role-command="delete"]').count(),0);
 }
 await editor();await page.locator('#role-grant-Devices').selectOption('read');await page.locator('#role-grant-Racks').selectOption('');
 await screenshot(page,'it-staff-editor-1440');
 await page.locator('[form="role-definition-form"]').click();await page.locator('[data-role-command="confirm"]').waitFor();await confirm(page);
 data=await catalogue(context);assert.deepEqual(data.users.find(user=>user.id===accounts.tim).permissions,{Devices:'read',IPAM:'edit'});
 assert.deepEqual(data.users.find(user=>user.id===accounts.dave).permissions,{Devices:'read',IPAM:'edit',Racks:'read'});
 await editor();await page.locator('#role-definition-form [name="enabled"]').uncheck();
 await page.locator('[form="role-definition-form"]').click();await page.locator('[data-role-command="confirm"]').waitFor();await confirm(page);
 data=await catalogue(context);assert.equal(data.roles.find(item=>item.id===role.id).enabled,false);
 assert.deepEqual(data.users.find(user=>user.id===accounts.tim).permissions,{});
 assert.ok(data.users.find(user=>user.id===accounts.tim).accessDetails.roles.some(item=>item.id===role.id&&!item.enabled));
 await editor();await page.locator('#role-definition-form [name="enabled"]').check();
 for(const section of ['Devices','IPAM','Racks'])await page.locator('#role-grant-'+section).selectOption('');
 await page.locator('[form="role-definition-form"]').click();await page.locator('[data-role-command="confirm"]').waitFor();await confirm(page);
 assert.equal((await catalogue(context)).users.find(user=>user.id===accounts.tim).accessDetails.mfaMandatory,true);
 for(const action of [{type:'role.delete',roleId:role.id},{type:'role.update',roleId:role.id,name:'Renamed',enabled:true,grants:{}}]){
  assert.equal((await context.request.post(address+'/api/users/roles/preview',{headers,data:{action}})).status(),400);
 }
 await manageUser('tim');await page.locator('[data-role-membership="'+role.id+'"]').click();await page.locator('[data-role-command="confirm"]').waitFor();await confirm(page);
 assert.ok(!(await catalogue(context)).users.find(user=>user.id===accounts.tim).accessDetails.roles.some(item=>item.id===role.id));
 await confirmedAction(context,{type:'role.update',roleId:role.id,name:'IT Staff',enabled:true,grants:{Devices:'edit',IPAM:'edit',Racks:'edit'}});
 await page.reload({waitUntil:'networkidle'});await page.locator('.users-live').waitFor();await page.locator('[data-action="select-users-section"][data-tab="roles"]').click();
 await checked(page,'IT Staff defaults, manual membership, protected identity, editable grants/status, retained overrides, mandatory MFA and unchanged Manage User cards passed');
};
