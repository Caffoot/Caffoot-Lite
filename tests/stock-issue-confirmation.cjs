// The circulation harness supplies a real signed-in browser and isolated HTTPS/SQLite server.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');

module.exports=async function verifyIssueConfirmation({page,owner,session,technician,technicianSession,reader,staff,address,post,stock,issueForm,output,errors}){
 const endpoint=address+'/api/it-assets/issue',screens=[],checks=[];
 let requests=0;
 const count=request=>{if(request.url()===endpoint&&request.method()==='POST')requests++;};
 page.on('request',count);
 async function receive(model,individual=false,stockItemId=null,serialNumber='',assetTag=''){
  return (await post(owner,session,'/api/it-assets/receive',{
   operationId:crypto.randomUUID(),...(stockItemId?{stockItemId,configurationKey:(await stock()).items.find(item=>item.id===stockItemId).configurationKey}:{item:{category:'Monitor',trackingMode:individual?'individual':'quantity',manufacturer:'Fictional Equipment',model,sharedSpecifications:{}}}),
   quantity:individual?1:12,receivedOn:'2026-11-16',readyQuantity:individual?1:12,checks:{itemsChecked:true,conditionChecked:true},supplier:'Fictional Supplier',notes:'Confirmation regression fixture',...(individual?{serialNumber,assetTag}:{})
  })).stockItemId;
 }
 const quantityItem=await receive('Confirmation Display'),individualItem=await receive('Confirmation Units',true,null,'CONF-SERIAL-01','CONF-ASSET-01');
 await receive('Confirmation Units',true,individualItem,'CONF-SERIAL-02','CONF-ASSET-02');
 await receive('Confirmation Units',true,individualItem);
 const units=(await stock()).items.find(item=>item.id===individualItem).units;
 const anonymous=units.find(unit=>!unit.serialNumber&&!unit.assetTag);
 const before=await stock();
 await page.reload();await page.locator('#stock-tab-issue').waitFor();
 const form=page.locator('#stock-issue-form'),confirmation=page.locator('#stock-issue-confirmation');
 const back=()=>page.getByRole('button',{name:'Back To Edit',exact:true}).click();
 async function review(){await page.getByRole('button',{name:'Issue Equipment',exact:true}).click();await confirmation.waitFor();}
 async function snapshot(){return form.evaluate(form=>[...new FormData(form)]);}
 async function result(status=200){const response=page.waitForResponse(response=>response.url()===endpoint&&response.request().method()==='POST');await page.getByRole('button',{name:'Confirm Issue',exact:true}).click();const saved=await response;assert.equal(saved.status(),status,await saved.text());return saved;}
 async function settled(){await page.waitForFunction(()=>document.getElementById('stock-tab-inventory')?.getAttribute('aria-selected')==='true');}
 async function capture(name){
  if(process.env.CAFFOOT_CIRCULATION_CAPTURE!=='1'&&process.env.CAFFOOT_ISSUE_CONFIRMATION_CAPTURE!=='1')return;
  for(const [width,height] of [[1440,1050],[390,844]])for(const theme of ['light','dark']){
   await page.setViewportSize({width,height});await page.evaluate(theme=>caffootSetTheme(theme),theme);await confirmation.waitFor();
   await page.waitForFunction(()=>!document.getElementById('toast')||Number(getComputedStyle(document.getElementById('toast')).opacity)===0);
   await page.evaluate(()=>scrollTo(0,0));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Confirmation must fit the viewport');
   assert.ok(await confirmation.locator('.info-row b').evaluateAll(values=>values.every(value=>value.scrollWidth<=value.clientWidth+1&&value.getBoundingClientRect().right<=innerWidth)),'Equipment identities must remain fully readable');
   const filename=name+'-'+theme+'-'+width+'.png';await page.screenshot({path:path.join(output,filename),fullPage:true});screens.push(filename);
  }
  await page.setViewportSize({width:1440,height:1050});await page.evaluate(()=>caffootSetTheme('light'));
 }
 await issueForm(page,quantityItem,'staff','confirmation-recipient',4);
 await page.locator('#caffoot-uk-stock-issuedOn').fill('15/11/2026');await page.locator('#stock-issueNote').fill('Keep this entered note & date.');
 await page.locator('#stock-issueQuantity').fill('13');assert.ok(await form.locator('[type="submit"]').isDisabled());
 await page.locator('#stock-issueQuantity').fill('1.5');await form.evaluate(form=>form.requestSubmit());assert.equal(await confirmation.count(),0);assert.equal(requests,0);
 await page.locator('#stock-issueQuantity').fill('4');const entered=await snapshot();
 await review();assert.match(await confirmation.innerText(),/Fictional Equipment Confirmation Display/);assert.match(await confirmation.innerText(),/Fictional Confirmation Recipient/);assert.match(await confirmation.innerText(),/Quantity\s+4/);
 await form.locator(':scope > .stock-form-actions [type="submit"]').evaluate(button=>button.click());
 assert.equal(await page.locator('#stock-issueItem').isVisible(),false);
 assert.equal(await page.evaluate(()=>document.activeElement.id),'stock-issue-confirmation-title');
 assert.deepEqual(await stock(),before,'Opening confirmation must not record stock');assert.equal(requests,0);
 const actions=confirmation.locator('.stock-form-actions');assert.deepEqual(await actions.locator('button').allTextContents(),['Back To Edit','Confirm Issue']);
 assert.equal(await actions.getByRole('button',{name:'Confirm Issue'}).evaluate(button=>getComputedStyle(button).backgroundColor),'rgb(237, 133, 50)');
 await capture('quantity-confirmation');await back();assert.deepEqual(await snapshot(),entered);
 await page.evaluate(()=>caffootSetTheme('dark'));assert.deepEqual(await snapshot(),entered);
 await review();await back();await page.locator('#stock-issueQuantity').fill('3');await review();assert.match(await confirmation.innerText(),/Quantity\s+3/);
 checks.push('Invalid quantities blocked; confirmation makes no writes; Back To Edit and theme changes preserve all values');

 // Hold the real request so rapid clicks and another submit happen before its response.
 let release,started;const gate=new Promise(resolve=>release=resolve),arrived=new Promise(resolve=>started=resolve);
 await page.route(endpoint,async route=>{started();await gate;await route.continue();});
 const saved=page.waitForResponse(response=>response.url()===endpoint&&response.request().method()==='POST');
 await page.getByRole('button',{name:'Confirm Issue',exact:true}).evaluate(button=>{button.click();button.click();button.form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));});
 await arrived;assert.equal(requests,1);assert.ok(await page.getByRole('button',{name:'Confirm Issue',exact:true}).isDisabled());assert.ok(await page.getByRole('button',{name:'Back To Edit',exact:true}).isDisabled());
 await page.evaluate(()=>caffootSetTheme('light'));assert.ok(await page.getByRole('button',{name:'Confirm Issue',exact:true}).isDisabled());
 release();assert.equal((await saved).status(),200);await settled();await page.unroute(endpoint);
 assert.equal((await stock()).items.find(item=>item.id===quantityItem).balances.readyToIssue,9);
 checks.push('Rapid duplicate submits and theme redraw while saving record exactly one issue');

 await issueForm(page,individualItem,'department','confirmation-department',1);
 for(const choice of await page.locator('#stock-issue-unit-choices input').all())await choice.uncheck();
 const identified=units.find(unit=>unit.serialNumber==='CONF-SERIAL-02');
 for(const id of [identified.id,anonymous.id])await page.locator('[name="issueUnitIds"][value="'+id+'"]').check();
 const selected=await snapshot();await review();const text=await confirmation.innerText();
 assert.match(text,/Fictional Confirmation Department/);assert.match(text,/Quantity\s+2/);assert.match(text,/CONF-SERIAL-02/);assert.match(text,/CONF-ASSET-02/);assert.ok(text.includes(anonymous.id));assert.ok(!text.includes('CONF-SERIAL-01'));
 await capture('individual-confirmation');await back();assert.deepEqual(await snapshot(),selected);await review();await result();await settled();
 const individualIssues=(await stock()).issues.filter(issue=>units.some(unit=>unit.id===issue.stockUnitId));
 assert.deepEqual(individualIssues.map(issue=>issue.stockUnitId).sort(),[identified.id,anonymous.id].sort());
 checks.push('Selected individual identities, serial/asset tags, anonymous identity and actual Department name match saved units');

 await issueForm(page,quantityItem,'staff','confirmation-recipient',2);await page.locator('#stock-issueNote').fill('Retain after a rejected save');const rejectedDraft=await snapshot();await review();
 await page.route(endpoint,route=>route.continue({postData:JSON.stringify({...route.request().postDataJSON(),quantity:999})}));
 const stockBeforeInvalid=await stock();await result(400);
 await confirmation.locator('[data-stock-feedback]').getByText('Quantity To Issue exceeds this item’s Ready To Issue balance',{exact:true}).waitFor();
 assert.deepEqual(await stock(),stockBeforeInvalid);assert.deepEqual(await snapshot(),rejectedDraft);await page.unroute(endpoint);
 checks.push('Invalid submitted quantity is rejected by the server despite a valid confirmation');
 await page.route(endpoint,route=>route.fulfill({status:500,contentType:'application/json',body:JSON.stringify({error:'The issue could not be saved. Please try again.'})}));
 const stockBeforeFailure=await stock();await result(500);await confirmation.locator('[data-stock-feedback]').getByText('The issue could not be saved. Please try again.',{exact:true}).waitFor();
 assert.deepEqual(await stock(),stockBeforeFailure);assert.deepEqual(await snapshot(),rejectedDraft);assert.ok(!await page.getByText('Equipment issued.',{exact:true}).count());
 await page.unroute(endpoint);await back();await page.locator('#stock-issueQuantity').fill('1');await review();await result();await settled();
 checks.push('Rejected save retains entered values, reports failure and allows an edited retry');

 await issueForm(page,quantityItem,'staff','confirmation-recipient',2);const staleDraft=await snapshot();await review();
 const current=(await stock()).items.find(item=>item.id===quantityItem);
 await post(owner,session,'/api/it-assets/issue',{operationId:crypto.randomUUID(),stockItemId:current.id,version:current.version,quantity:1,recipientKind:'department',recipientId:'confirmation-department',issuedOn:'2026-11-16',note:'Concurrent operator'});
 const stockBeforeStale=await stock();await result(409);await confirmation.locator('[data-stock-feedback]').getByText('Stock changed. Reload the selected item before issuing equipment.',{exact:true}).waitFor();
 assert.deepEqual(await stock(),stockBeforeStale);assert.deepEqual(await snapshot(),staleDraft);await back();assert.deepEqual(await snapshot(),staleDraft);
 checks.push('Concurrent stock change is rejected by the existing version check without changing stock or losing values');

 // Simulate a lost response after the server commits, then retry the same operation.
 await page.reload();await page.locator('#stock-tab-issue').waitFor();await issueForm(page,quantityItem,'staff','confirmation-recipient',1);await review();
 let committedPayload;
 await page.route(endpoint,async route=>{committedPayload=route.request().postDataJSON();const committed=await route.fetch();assert.equal(committed.status(),200);await route.abort('failed');});
 const lost=page.waitForEvent('requestfailed',request=>request.url()===endpoint);await page.getByRole('button',{name:'Confirm Issue',exact:true}).click();await lost;
 await page.waitForFunction(()=>!document.querySelector('#stock-issue-confirmation [type="submit"]').disabled);
 const afterLost=await stock();await page.unroute(endpoint);await result();await settled();assert.deepEqual(await stock(),afterLost);
 const replay=await technician.request.post(endpoint,{headers:{Origin:address,'X-CSRF-Token':technicianSession.csrf_token},data:committedPayload});assert.equal(replay.status(),200);
 checks.push('Lost response retries reuse the existing operation identifier and do not issue twice');

 for(const context of [reader,staff]){const access=await (await context.request.get(address+'/api/session')).json();const denied=await context.request.post(endpoint,{headers:{Origin:address,'X-CSRF-Token':access.csrf_token},data:committedPayload});assert.equal(denied.status(),403);}
 const noCsrf=await technician.request.post(endpoint,{headers:{Origin:address},data:committedPayload});assert.equal(noCsrf.status(),403);
 await post(owner,session,'/api/settings/features',{feature:'it_assets',enabled:false,confirmDisable:true});
 const disabled=await technician.request.post(endpoint,{headers:{Origin:address,'X-CSRF-Token':technicianSession.csrf_token},data:committedPayload});assert.equal(disabled.status(),403);
 await post(owner,session,'/api/settings/features',{feature:'it_assets',enabled:true});
 checks.push('Read-only/no stock access, missing CSRF and feature-off requests remain forbidden');
 assert.deepEqual(errors,[]);page.off('request',count);
 fs.writeFileSync(path.join(output,'issue-confirmation-results.json'),JSON.stringify({checks,screenshots:screens,pageErrors:errors},null,2)+'\n');
 console.log('PASS: '+checks.length+' focused Issue Equipment confirmation regression groups; '+screens.length+' genuine screenshots; no page errors.');
 await page.reload();await page.locator('#stock-tab-issue').waitFor();
};
