// Exercise configurable IT Staff through the existing approved role dialogs.
const assert=require('node:assert/strict');
module.exports=async({page,context,catalogue,confirmedAction,confirm,screenshot,checked})=>{
 const address='https://127.0.0.1:8080';
 const session=await (await context.request.get(address+'/api/session')).json();
 const headers={Origin:address,'X-CSRF-Token':session.csrf_token};
 let data=await catalogue(context),role=data.roles.find(role=>role.roleKey==='it_staff');
 assert.ok(role.isBuiltin&&role.enabled);assert.equal(role.accountCount,0);
 assert.deepEqual(role.grants,{Devices:'edit',IPAM:'edit',Racks:'edit','IT Assets':'edit'});
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
 assert.deepEqual(dave.permissions,{Devices:'read',IPAM:'edit',Racks:'read','IT Assets':'edit'});assert.deepEqual(tim.permissions,role.grants);
 assert.ok(dave.accessDetails.mfaPending&&tim.accessDetails.mfaPending);
 const login=await context.request.post(address+'/api/login',{headers:{Origin:address},data:{username:'tim',password:'Fictional-IT-Staff-Password!'}});
 assert.equal(login.status(),200);assert.equal((await login.json()).status,'mfa enrolment required');
 // A setup-required response must not replace the administrator's existing session.
 assert.equal((await (await context.request.get(address+'/api/session')).json()).username,session.username);
 await manageUser('dave');
 const modal=page.locator('.users-management-modal');
 assert.match(await modal.innerText(),/Individual overrides take precedence/);
 assert.deepEqual(await modal.locator('.access-grid [data-next-user-permission]').evaluateAll(selects=>selects.map(item=>item.dataset.section)),['Devices','IPAM','Racks','Staff Members','Departments','IT Assets','Suppliers','Service Desk']);
 assert.equal(await modal.getByLabel('Service Desk',{exact:true}).inputValue(),'');
 await modal.getByLabel('Service Desk',{exact:true}).scrollIntoViewIfNeeded();
 await screenshot(page,'it-staff-dave-1440');
 await page.setViewportSize({width:390,height:844});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await modal.getByLabel('Service Desk',{exact:true}).scrollIntoViewIfNeeded();
 await screenshot(page,'it-staff-dave-390');
 await page.setViewportSize({width:1440,height:950});
 await page.locator('[data-action="users-close-editor"]').first().click();
 async function editor(){
  await page.locator('[data-action="select-users-section"][data-tab="roles"]').click();
  await page.locator('[data-role-command="edit"][data-role-id="'+role.id+'"]').click();
  assert.equal(await page.locator('#role-name').getAttribute('readonly'),'');
  assert.equal(await page.locator('[data-role-command="delete"]').count(),0);
 }
 await editor();
 const serviceDeskGrant=page.locator('#role-definition-form').getByLabel('Service Desk',{exact:true});
 assert.equal(await serviceDeskGrant.inputValue(),'');
 await serviceDeskGrant.selectOption('read');
 await page.locator('#role-grant-Devices').selectOption('read');await page.locator('#role-grant-Racks').selectOption('');
 await screenshot(page,'it-staff-editor-1440');
 await page.locator('[form="role-definition-form"]').click();await page.locator('[data-role-command="confirm"]').waitFor();await confirm(page);
 data=await catalogue(context);assert.deepEqual(data.users.find(user=>user.id===accounts.tim).permissions,{Devices:'read',IPAM:'edit','IT Assets':'edit','Service Desk':'read'});
 assert.deepEqual(data.users.find(user=>user.id===accounts.dave).permissions,{Devices:'read',IPAM:'edit',Racks:'read','IT Assets':'edit','Service Desk':'read'});
 await editor();await page.locator('#role-definition-form [name="enabled"]').uncheck();
 await page.locator('[form="role-definition-form"]').click();await page.locator('[data-role-command="confirm"]').waitFor();await confirm(page);
 data=await catalogue(context);assert.equal(data.roles.find(item=>item.id===role.id).enabled,false);
 assert.deepEqual(data.users.find(user=>user.id===accounts.tim).permissions,{});
 assert.ok(data.users.find(user=>user.id===accounts.tim).accessDetails.roles.some(item=>item.id===role.id&&!item.enabled));
 await editor();await page.locator('#role-definition-form [name="enabled"]').check();
 for(const section of ['Devices','IPAM','Racks','IT Assets','Service Desk'])await page.locator('#role-definition-form select[name="'+section+'"]').selectOption('');
 await page.locator('[form="role-definition-form"]').click();await page.locator('[data-role-command="confirm"]').waitFor();await confirm(page);
 assert.equal((await catalogue(context)).users.find(user=>user.id===accounts.tim).accessDetails.mfaMandatory,true);
 for(const action of [{type:'role.delete',roleId:role.id},{type:'role.update',roleId:role.id,name:'Renamed',enabled:true,grants:{}}]){
  assert.equal((await context.request.post(address+'/api/users/roles/preview',{headers,data:{action}})).status(),400);
 }
 await manageUser('tim');await page.locator('[data-role-membership="'+role.id+'"]').click();await page.locator('[data-role-command="confirm"]').waitFor();await confirm(page);
 assert.ok(!(await catalogue(context)).users.find(user=>user.id===accounts.tim).accessDetails.roles.some(item=>item.id===role.id));
 await confirmedAction(context,{type:'role.update',roleId:role.id,name:'IT Staff',enabled:true,grants:{Devices:'edit',IPAM:'edit',Racks:'edit','IT Assets':'edit'}});
 await page.reload({waitUntil:'networkidle'});await page.locator('.users-live').waitFor();await page.locator('[data-action="select-users-section"][data-tab="roles"]').click();
 await checked(page,'IT Staff defaults, deliberate Service Desk grants, retained overrides and mandatory MFA passed');

 await page.locator('#sidebar [data-action="tab-settings"]').click();
 await page.locator('.settings-screen .subnav [data-tab="maintenance"]').click();
 const cleanStart=page.getByRole('button',{name:'Review Clear System'});
 assert.equal(await cleanStart.isEnabled(),true);
 await screenshot(page,'clean-start-1440');
 const confirmation=new Promise(resolve=>page.once('dialog',async dialog=>{
  const message=dialog.message();
  await dialog.dismiss();
  resolve(message);
 }));
 await cleanStart.click();
 const resetWarning=await confirmation;
 assert.match(resetWarning,/All operational records will be removed/);
 assert.match(resetWarning,/All Service Desk tickets, conversations, attachments and ticket history will be removed/);
 assert.match(resetWarning,/User accounts, sign-in safeguards and central Change History will be kept/);
 assert.match(resetWarning,/Database backup and restoration are handled by your Docker or volume backup application/);
 await page.setViewportSize({width:390,height:844});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await screenshot(page,'clean-start-390');
 await checked(page,'Clean Start discloses ticket and attachment removal in the existing confirmation');

 await page.evaluate(()=>{
  localStorage.setItem('caffoot_theme_preference','dark');
  caffootApplyTheme();
 });
 await page.locator('html.dark').waitFor();
 await screenshot(page,'clean-start-dark-390');
 await page.setViewportSize({width:1440,height:950});
 await screenshot(page,'clean-start-dark-1440');

 await page.goto(address+'/inventory#users');
 await manageUser('dave');
 await modal.getByLabel('Service Desk',{exact:true}).scrollIntoViewIfNeeded();
 await screenshot(page,'it-staff-dave-dark-1440');
 await page.setViewportSize({width:390,height:844});
 await modal.getByLabel('Service Desk',{exact:true}).scrollIntoViewIfNeeded();
 await screenshot(page,'it-staff-dave-dark-390');

 await page.setViewportSize({width:1440,height:950});
 await page.locator('[data-action="users-close-editor"]').first().click();
 await page.evaluate(()=>{
  localStorage.setItem('caffoot_theme_preference','light');
  caffootApplyTheme();
 });
 const inventory=await context.request.get(address+'/api/inventory/state');
 assert.equal(inventory.status(),200);
 const device=(await inventory.json()).devices.find(device=>device.type==='Desktop');
 assert.ok(device,'The Device Tickets check needs a fixture desktop');
 const ticketResponse=await context.request.post(address+'/api/service-desk/it/tickets',{headers,data:{
  equipmentKind:'device',equipmentId:device.id,categoryId:5,subject:'Shared drive will not connect',
  description:'The shared drive disconnects during the morning sign-in.'
 }});
 assert.equal(ticketResponse.status(),201,await ticketResponse.text());

 await page.locator('#sidebar [data-action="tab-devices"]').click();
 await page.locator('[data-action="select-device-section"][data-tab="inventory"]').click();
 await page.locator('[data-action="view-device"][data-id="'+device.id+'"]').first().click();
 const details=page.locator('.device-details-dialog');
 await details.waitFor();
 const tickets=details.getByRole('tab',{name:'Tickets',exact:true});
 assert.deepEqual((await details.getByRole('tab').allTextContents()).slice(0,6),
  ['Overview','Hardware','Network','Software','Location','Assigned To']);
 assert.equal(await details.getByRole('tab',{name:'Overview',exact:true}).getAttribute('aria-selected'),'true');
 assert.equal(await details.locator('#device-details-panel-overview .service-desk-equipment').count(),0);
 await tickets.focus();
 await tickets.press('Enter');
 const panel=details.getByRole('tabpanel',{name:'Tickets',exact:true});
 const linkedTicket=panel.getByRole('button',{name:/Shared drive will not connect/});
 await linkedTicket.waitFor();
 await screenshot(page,'device-tickets-1440');
 await page.setViewportSize({width:390,height:844});
 await page.evaluate(()=>{localStorage.setItem('caffoot_theme_preference','dark');caffootApplyTheme();});
 await screenshot(page,'device-tickets-dark-390');
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await linkedTicket.click();
 await page.locator('.service-desk-dialog').getByRole('heading',{name:'Ticket Information'}).waitFor();
 await page.keyboard.press('Escape');
 await linkedTicket.waitFor();
 assert.equal(await tickets.getAttribute('aria-selected'),'true');
 assert.ok(await tickets.evaluate(tab=>document.activeElement===tab));
 await page.keyboard.press('Escape');
 await page.setViewportSize({width:1440,height:950});
 await page.evaluate(()=>{localStorage.setItem('caffoot_theme_preference','light');caffootApplyTheme();});
 await checked(page,'Device Details opens linked tickets on the dedicated tab and restores that tab on return');
 await page.locator('#sidebar [data-action="tab-users"]').click();
 await page.locator('[data-action="select-users-section"][data-tab="roles"]').click();
};
