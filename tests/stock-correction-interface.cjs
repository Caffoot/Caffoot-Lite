// Exercise real historical corrections in the real authenticated application.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn,spawnSync}=require('node:child_process'),{chromium}=require('playwright'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..'),temporary=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-corrections-'));
const output=process.env.CAFFOOT_CORRECTION_OUTPUT||path.join(temporary,'evidence'),capture=process.env.CAFFOOT_CORRECTION_CAPTURE==='1';
const returnCapture=capture||process.env.CAFFOOT_RETURN_CORRECTION_CAPTURE==='1';
fs.mkdirSync(output,{recursive:true});
const database=path.join(temporary,'inventory.sqlite3'),address='https://127.0.0.1:8116';
let browser,server,page;
function python(code,args=[]){const result=spawnSync('python3',['-c',code,...args],{cwd:root,encoding:'utf8',env:{...process.env,PYTHONDONTWRITEBYTECODE:'1',PYTHONPATH:'tests:.'}});assert.equal(result.status,0,result.stderr);return result.stdout.trim();}
function fingerprint(){return python('import sqlite3,sys,json,hashlib;db=sqlite3.connect(sys.argv[1]);print(hashlib.sha256(json.dumps({t:db.execute("SELECT * FROM "+t+" ORDER BY 1").fetchall() for t in ["accounts","roles","role_grants","account_roles","account_permission_overrides","inventory_devices","inventory_subnets","inventory_vlans","inventory_racks","inventory_rack_accessories","inventory_ip_allocations"]},sort_keys=True).encode()).hexdigest())',[database]);}
async function main(){
 const seeded=spawnSync('python3',['tests/visual_fixtures.py',temporary],{cwd:root,encoding:'utf8'});assert.equal(seeded.status,0,seeded.stderr);
 const credentials=JSON.parse(fs.readFileSync(path.join(temporary,'test-credentials.json')));
 const employee=JSON.parse(python([
  'import sqlite3,sys,json',
  'from backend.permissions import create_user',
  'with sqlite3.connect(sys.argv[1]) as db:',
  ' db.execute("PRAGMA foreign_keys=ON")',
  ' db.execute("INSERT INTO departments(id,name) VALUES(\'circulation-department\',\'Fictional Workshop\')")',
  ' db.commit();result={}',
  ' for name,grant in [("circulation-technician","edit"),("circulation-reader","read"),("circulation-employee",None)]:',
  '  identity=create_user(db,1,name,"Fictional-Account-Password-2026!")',
  '  db.execute("UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?",(sys.argv[2],identity))',
  '  if grant:db.execute("INSERT INTO account_permission_overrides VALUES(?,?,?)",(identity,"IT Assets",grant))',
  '  else:',
  '   db.execute("UPDATE staff_members SET first_name=\'Fictional\',last_name=\'Employee\',department_id=\'circulation-department\',email=\'private@example.invalid\',telephone=\'PRIVATE TELEPHONE\' WHERE account_id=?",(identity,))',
  '   result=dict(account=identity,staff=db.execute("SELECT id FROM staff_members WHERE account_id=?",(identity,)).fetchone()[0])',
  '  db.commit()',
  ' db.execute("INSERT INTO staff_members(id,first_name) VALUES(\'other-recipient\',\'Other Fictional Recipient\')")',
  ' db.commit();print(json.dumps(result))'
 ].join('\n'),[database,credentials.secret]));
 const log=fs.openSync(path.join(temporary,'server.log'),'w');
 server=spawn('python3',['-c','import backend.server as server;server.PORT=8116;server.main()'],{cwd:root,stdio:['ignore',log,log],env:{...process.env,PYTHONDONTWRITEBYTECODE:'1',CAFFOOT_DB_PATH:database,CAFFOOT_TLS_DIR:path.join(temporary,'tls'),CAFFOOT_WEB_ADDRESS:address,CAFFOOT_SERVER_ADDRESS:'127.0.0.1',CAFFOOT_HOST:'127.0.0.1'}});
 browser=await chromium.launch({headless:true,executablePath:process.env.CAFFOOT_CHROMIUM_PATH||undefined});
 const owner=await browser.newContext({ignoreHTTPSErrors:true,locale:'en-GB',viewport:{width:1440,height:1050}});
 for(let attempt=0;attempt<60;attempt++){try{if((await owner.request.get(address+'/health',{timeout:750})).ok())break;}catch{}await new Promise(resolve=>setTimeout(resolve,150));}
 const code=()=>python('import sys,time;from backend.mfa import code_at;print(code_at(sys.argv[1],time.time()))',[credentials.secret]);
 async function login(context,username,password){const response=await context.request.post(address+'/api/login',{headers:{Origin:address},data:{username,password,mfa_code:code()}});assert.equal(response.status(),200,await response.text());return (await context.request.get(address+'/api/session')).json();}
 const session=await login(owner,credentials.username,credentials.password);
 async function post(context,session,route,data){const response=await context.request.post(address+route,{headers:{Origin:address,'X-CSRF-Token':session.csrf_token},data});assert.equal(response.status(),200,await response.text());return response.json();}
 async function stock(context=owner){const response=await context.request.get(address+'/api/it-assets/stock');assert.equal(response.status(),200,await response.text());return response.json();}
 await post(owner,session,'/api/settings/features',{feature:'it_assets',enabled:true});
 const receipt=await post(owner,session,'/api/it-assets/receive',{operationId:crypto.randomUUID(),item:{category:'Mouse',trackingMode:'quantity',manufacturer:'Logitech',model:'M185 Mouse',sharedSpecifications:{}},quantity:20,receivedOn:'2026-11-15',readyQuantity:10,checks:{itemsChecked:true,conditionChecked:true},supplier:'Fictional Purchasing Supplier',notes:'Delivery quantity and receipt checks'});
 let data=await stock(),item=data.items.find(item=>item.id===receipt.stockItemId);
 const issued=await post(owner,session,'/api/it-assets/issue',{operationId:crypto.randomUUID(),stockItemId:item.id,version:item.version,quantity:8,recipientKind:'staff',recipientId:employee.staff,issuedOn:'2026-11-15',note:'Original allocation'});
 data=await stock();let issue=data.issues.find(issue=>issue.stockItemId===item.id);
 await post(owner,session,'/api/it-assets/return',{operationId:crypto.randomUUID(),issueEntryId:issue.id,version:issue.version,quantityReturned:5,readyQuantity:3,writeOffQuantity:1,returnedOn:'2026-11-16',checks:{cleanedWorking:true,dataPreparationConfirmed:false},writeOffReason:'Broken button',note:'Partial return'});
 data=await stock();
 const original=data.movements.find(movement=>movement.id===receipt.receiptId),originalIssue=data.movements.find(movement=>movement.id===issued.movementId);
 const retained=fingerprint();
 const originalFacts=python('import sqlite3,sys,json;db=sqlite3.connect(sys.argv[1]);print(json.dumps({t:db.execute("SELECT * FROM "+t+" ORDER BY 1").fetchall() for t in ["it_asset_stock_movements","it_asset_stock_entries"]},sort_keys=True))',[database]);
 const errors=[],screens=[];
 page=await owner.newPage();page.on('pageerror',failure=>errors.push(String(failure)));
 await page.goto(address+'/inventory#it-assets');await page.locator('#stock-tab-movements').waitFor();
 async function movementTab(target=page){await target.locator('[data-stock-action="tab"][data-tab="movements"]').click();await target.locator('[data-movement-entry="'+original.entryId+'"]').waitFor();}
 async function select(entry=original.entryId){await page.locator('[data-stock-action="correct-movement"][data-id="'+entry+'"]').click();await page.locator('#stock-correction-form').waitFor();}
 async function propose(quantity,reason='Delivery note confirms the corrected quantity.'){
  await page.locator('#stock-correctedQuantity').fill(String(quantity));await page.locator('#stock-correctionReason').fill(reason);
  await page.waitForFunction(()=>{const form=document.getElementById('stock-correction-form');if(!form?.dataset.previewCompleted)return false;const body=JSON.parse(form.dataset.previewCompleted);return body.correctedQuantity===Number(form.elements.correctedQuantity.value)&&body.reason===form.elements.correctionReason.value;});
 }
 async function captureState(name,target=page,selector=null,enabled=capture){
  if(!enabled)return;
  for(const [width,height] of [[1440,1050],[390,844]])for(const theme of ['light','dark']){
   await target.setViewportSize({width,height});await target.evaluate(theme=>caffootSetTheme(theme),theme);
   await target.mouse.move(1,1);
   await target.waitForFunction(()=>!document.getElementById('toast')||Number(getComputedStyle(document.getElementById('toast')).opacity)===0);
   await target.evaluate(()=>scrollTo(0,0));
   if(width===390&&['movement-history','read-only-history'].includes(name))await target.locator('#stock-panel .table-scroll').last().evaluate(node=>node.scrollLeft=node.scrollWidth);
   assert.ok(await target.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal page overflow in '+name);
   const filename=name+'-'+theme+'-'+width+'.png';
   if(selector)await target.locator(selector).screenshot({path:path.join(output,filename)});else await target.screenshot({path:path.join(output,filename),fullPage:true});
   screens.push(filename);
  }
  await target.setViewportSize({width:1440,height:1050});await target.evaluate(()=>caffootSetTheme('light'));
 }
 await movementTab();await captureState('movement-history');await select();
 assert.match(await page.locator('#stock-correction-details').innerText(),/Original Recorded Quantity/);
 assert.match(await page.locator('#stock-correction-details').innerText(),/Fictional Purchasing Supplier/);
 await captureState('selected-original-details',page,'#stock-correction-details');
 const form=page.locator('#stock-correction-form');
 assert.equal(await form.locator('[type="submit"]').isDisabled(),true);
 assert.deepEqual((await form.locator('.stock-form-actions button').allTextContents()).map(value=>value.trim()),['Cancel','Save Correction']);
 await page.mouse.move(1,1);
 assert.equal(await form.locator('[type="submit"]').evaluate(button=>getComputedStyle(button).backgroundColor),'rgb(237, 133, 50)');
 assert.equal(await form.locator('.stock-form-actions').evaluate(node=>getComputedStyle(node).justifyContent),'flex-end');
 await propose(18,'');assert.equal(await form.locator('[type="submit"]').isDisabled(),true);assert.match(await page.locator('#stock-correction-validation').innerText(),/Reason For Correction/);
 await propose(8);assert.equal(await form.locator('[type="submit"]').isDisabled(),true);assert.match(await page.locator('#stock-correction-validation').innerText(),/impossible stock balance/);
 await captureState('blocked-correction',page,'#stock-correction-details');
 await propose(18);assert.equal(await form.locator('[type="submit"]').isEnabled(),true);
 assert.match(await page.locator('#stock-correction-impact').innerText(),/Physically Held\s+16\s+14/);
 assert.match(await page.locator('#stock-correction-impact').innerText(),/Ready To Issue\s+5\s+5/);
 await captureState('complete-correction-form',page,'#stock-correction-form');await captureState('valid-stock-impact',page,'#stock-correction-details');
 assert.equal(python('import sqlite3,sys,json;db=sqlite3.connect(sys.argv[1]);print(json.dumps({t:db.execute("SELECT * FROM "+t+" ORDER BY 1").fetchall() for t in ["it_asset_stock_movements","it_asset_stock_entries"]},sort_keys=True))',[database]),originalFacts,'Preview must not persist stock changes');
 await form.locator('[data-stock-action="cancel-correction"]').click();await page.locator('#discard-dialog').waitFor();
 await page.locator('#discard-dialog [data-action="keep-editing"]').click();assert.equal(await page.locator('#stock-correctedQuantity').inputValue(),'18');
 await page.keyboard.press('Escape');await page.locator('#discard-dialog').waitFor();await page.keyboard.press('Escape');assert.equal(await page.locator('#discard-dialog').count(),0);
 await page.keyboard.press('Escape');await page.locator('#discard-dialog [data-action="discard-device-form-changes"]').click();assert.equal(await form.count(),0);
 await select();await propose(18);await page.locator('#stock-tab-inventory').click();await page.locator('#discard-dialog').waitFor();await page.locator('#discard-dialog [data-action="keep-editing"]').click();
 await page.locator('.header-account').click();await page.locator('#discard-dialog').waitFor();await page.locator('#discard-dialog [data-action="keep-editing"]').click();assert.equal(await page.locator('#stock-correctedQuantity').inputValue(),'18');
 const saving=page.waitForResponse(response=>response.url()===address+'/api/it-assets/corrections'&&response.request().method()==='POST');
 await form.locator('[type="submit"]').click();const response=await saving;assert.equal(response.status(),200,await response.text());
 await page.waitForFunction(()=>document.getElementById('stock-correction-details')?.textContent.includes('20 → 18'));
 await captureState('saved-correction-history',page,'#stock-correction-details');
 data=await stock();assert.equal(data.items.find(row=>row.id===item.id).balances.physicallyHeld,14);
 assert.equal(data.movements.find(row=>row.entryId===original.entryId).quantity,20);assert.equal(data.movements.find(row=>row.entryId===original.entryId).effectiveQuantity,18);
 await form.locator('[data-stock-action="cancel-correction"]').click();assert.equal(await form.count(),0);
 await select(originalIssue.entryId);await propose(7,'Allocation record confirms seven issued.');
 assert.match(await page.locator('#stock-correction-impact').innerText(),/Original Issue Outstanding\s+3\s+2/);
 await form.locator('[data-stock-action="cancel-correction"]').click();await page.locator('#discard-dialog [data-action="discard-device-form-changes"]').click();
 await select();await propose(17);
 const openContext=await (await owner.request.get(address+'/api/it-assets/corrections/'+original.entryId)).json();
 await post(owner,session,'/api/it-assets/corrections',{operationId:crypto.randomUUID(),entryId:original.entryId,version:openContext.version,correctedQuantity:19,reason:'Another technician confirmed the delivery.'});
 const stale=page.waitForResponse(response=>response.url()===address+'/api/it-assets/corrections'&&response.request().method()==='POST');await form.locator('[type="submit"]').click();assert.equal((await stale).status(),409);await form.locator('[data-stock-feedback]').getByText(/history changed/).waitFor();
 assert.equal(await form.locator('[type="submit"]').isDisabled(),true);assert.match(await page.locator('#stock-correction-validation').innerText(),/Correction Blocked/);
 await form.locator('[data-stock-action="cancel-correction"]').click();await page.locator('#discard-dialog [data-action="discard-device-form-changes"]').click();
 await page.locator('#stock-tab-return').click();
 const returnForm=page.locator('#stock-return-form'),returnAction=returnForm.locator('[data-stock-action="correct-return-movement"]');
 await returnForm.locator('[name="returnSource"]').selectOption('stock:'+originalIssue.entryId);
 await returnForm.locator('[name="quantityReturned"]').fill('3');
 await returnForm.locator('[name="readyReturnQuantity"]').fill('1');
 await returnForm.locator('[name="writeOffReturnQuantity"]').fill('1');
 await returnForm.locator('[name="cleanedWorking"]').check();
 await returnForm.locator('[name="writeOffReason"]').fill('One damaged mouse');
 await returnForm.locator('[name="returnNote"]').fill('Keep these entered return details.');
 const returnValues=await returnForm.evaluate(form=>Object.fromEntries(new FormData(form)));
 const staleIssue=(await stock()).issues.find(row=>row.id===originalIssue.entryId);
 await captureState('return-original-issue',page,null,returnCapture);
 // A failed context request leaves the live return form and its entries intact.
 await page.route('**/api/it-assets/corrections/'+originalIssue.entryId,route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Correction context temporarily unavailable.'})}),{times:1});
 await returnAction.click();await returnForm.locator('[data-stock-feedback]').getByText(/temporarily unavailable/).waitFor();
 assert.deepEqual(await returnForm.evaluate(form=>Object.fromEntries(new FormData(form))),returnValues);
 await returnAction.click();await form.waitFor();
 assert.match(await page.locator('#stock-correction-details').innerText(),new RegExp('Entry '+originalIssue.entryId+'\\b'));
 assert.match(await page.locator('#stock-correction-details').innerText(),/Original Recorded Quantity\s+8/);
 await form.locator('[data-stock-action="cancel-correction"]').click();await returnForm.waitFor();
 assert.deepEqual(await returnForm.evaluate(form=>Object.fromEntries(new FormData(form))),returnValues);
 await returnAction.click();await form.waitFor();await propose(4,'Check the original allocation.');
 assert.equal(await form.locator('[type="submit"]').isDisabled(),true);
 await page.keyboard.press('Escape');await page.locator('#discard-dialog [data-action="keep-editing"]').click();
 assert.equal(await page.locator('#stock-correctedQuantity').inputValue(),'4');
 await page.keyboard.press('Escape');await page.locator('#discard-dialog [data-action="discard-device-form-changes"]').click();await returnForm.waitFor();
 assert.deepEqual(await returnForm.evaluate(form=>Object.fromEntries(new FormData(form))),returnValues);
 await returnAction.click();await form.waitFor();
 // Leaving a pristine correction still protects the suspended, edited return form.
 await page.locator('#stock-tab-inventory').click();await page.locator('#discard-dialog [data-action="keep-editing"]').click();await form.waitFor();
 await page.locator('.header-account').click();await page.locator('#discard-dialog [data-action="keep-editing"]').click();await form.waitFor();
 await propose(7,'Allocation record confirms seven issued.');
 const unloadBlocked=await page.evaluate(()=>{const event=new Event('beforeunload',{cancelable:true});window.dispatchEvent(event);return event.defaultPrevented;});assert.equal(unloadBlocked,true);
 await page.locator('#stock-tab-inventory').click();await page.locator('#discard-dialog [data-action="discard-device-form-changes"]').click();
 await page.locator('#discard-dialog [data-action="keep-editing"]').click();await form.waitFor();
 assert.equal(await page.locator('#stock-correctedQuantity').inputValue(),'7');
 await captureState('return-correction-impact',page,'#stock-correction-details',returnCapture);
 // A concurrent correction invalidates the save without losing either form's entries.
 const concurrent=await (await owner.request.get(address+'/api/it-assets/corrections/'+original.entryId)).json();
 await post(owner,session,'/api/it-assets/corrections',{operationId:crypto.randomUUID(),entryId:original.entryId,version:concurrent.version,correctedQuantity:20,reason:'Final receipt count verified.'});
 const rejected=page.waitForResponse(response=>response.url()===address+'/api/it-assets/corrections'&&response.request().method()==='POST');
 await form.locator('[type="submit"]').click();assert.equal((await rejected).status(),409);
 await form.locator('[data-stock-feedback]').getByText(/history changed/).waitFor();
 assert.equal(await page.locator('#stock-correctedQuantity').inputValue(),'7');
 await form.locator('[data-stock-action="cancel-correction"]').click();await page.locator('#discard-dialog [data-action="discard-device-form-changes"]').click();await returnForm.waitFor();
 assert.deepEqual(await returnForm.evaluate(form=>Object.fromEntries(new FormData(form))),returnValues);
 await returnAction.click();await form.waitFor();await propose(7,'Allocation record confirms seven issued.');
 // The save is real; only the subsequent refresh is made unavailable for this check.
 await page.route('**/api/it-assets/stock',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Stock refresh temporarily unavailable.'})}),{times:1});
 await form.locator('[type="submit"]').click();await returnForm.waitFor();
 await page.locator('#stock-return-refresh').getByText(/Reload Stock/).waitFor();
 assert.equal(await returnForm.locator('[type="submit"]').isDisabled(),true);
 assert.equal(await returnAction.isVisible(),false);
 const blockedReturns=[];const recordReturnRequest=request=>{if(request.url()===address+'/api/it-assets/return')blockedReturns.push(request.postDataJSON());};page.on('request',recordReturnRequest);
 await returnForm.evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
 await returnForm.locator('[data-stock-feedback]').getByText(/Reload Stock/).waitFor();assert.deepEqual(blockedReturns,[]);page.off('request',recordReturnRequest);
 await page.locator('[data-stock-action="reload"]').click();
 await page.locator('#stock-return-refresh').getByText(/Quantities and versions have been refreshed/).waitFor();
 assert.equal(await returnForm.locator('[data-stock-feedback]').innerText(),'');
 const refreshedIssue=(await stock()).issues.find(row=>row.id===originalIssue.entryId);
 assert.notEqual(refreshedIssue.version,staleIssue.version);assert.equal(refreshedIssue.outstanding,2);
 assert.deepEqual(await returnForm.evaluate(form=>Object.fromEntries(new FormData(form))),returnValues);
 assert.equal(await returnForm.locator('[name="quantityReturned"]').getAttribute('max'),'2');
 assert.equal(await returnForm.locator('[type="submit"]').isDisabled(),true);
 await captureState('return-refreshed-quantity',page,null,returnCapture);
 assert.deepEqual(await returnForm.evaluate(form=>Object.fromEntries(new FormData(form))),returnValues);
 await returnForm.locator('[name="quantityReturned"]').fill('2');
 const returning=page.waitForResponse(response=>response.url()===address+'/api/it-assets/return'&&response.request().method()==='POST');
 await returnForm.locator('[type="submit"]').click();const recordedReturn=await returning;
 assert.equal(recordedReturn.status(),200,await recordedReturn.text());
 assert.equal(recordedReturn.request().postDataJSON().issueEntryId,originalIssue.entryId);
 assert.equal(recordedReturn.request().postDataJSON().version,refreshedIssue.version);
 assert.equal(recordedReturn.request().postDataJSON().quantityReturned,2);
 await page.locator('#stock-tab-inventory[aria-selected="true"]').waitFor();
 // Retain the original selection even when another eligible issue also exists.
 async function issueMore(quantity){
  const current=(await stock()).items.find(row=>row.id===item.id);
  const result=await post(owner,session,'/api/it-assets/issue',{operationId:crypto.randomUUID(),stockItemId:item.id,version:current.version,quantity,recipientKind:'staff',recipientId:employee.staff,issuedOn:'2026-11-16',note:'Return correction eligibility fixture'});
  return (await stock()).movements.find(row=>row.id===result.movementId).entryId;
 }
 const becomingIneligible=await issueMore(3),otherEligible=await issueMore(1);
 const partialIssue=(await stock()).issues.find(row=>row.id===becomingIneligible);
 await post(owner,session,'/api/it-assets/return',{operationId:crypto.randomUUID(),issueEntryId:partialIssue.id,version:partialIssue.version,quantityReturned:2,readyQuantity:0,writeOffQuantity:0,returnedOn:'2026-11-16',checks:{cleanedWorking:false,dataPreparationConfirmed:false},writeOffReason:'',note:'Two actually returned'});
 await page.reload();await page.locator('#stock-tab-return').waitFor();await page.locator('#stock-tab-return').click();await returnForm.waitFor();
 await returnForm.locator('[name="returnSource"]').selectOption('stock:'+becomingIneligible);
 await returnForm.locator('[name="quantityReturned"]').fill('3');
 await returnForm.locator('[name="returnNote"]').fill('Keep this note when eligibility changes.');
 await returnAction.click();await form.waitFor();await propose(2,'Only two units were actually issued.');
 await form.locator('[type="submit"]').click();await returnForm.waitFor();
 await page.locator('#stock-return-refresh').getByText(/no longer eligible/).waitFor();
 assert.equal(await returnForm.locator('[name="returnSource"]').inputValue(),'');
 assert.equal(await returnForm.locator('[name="quantityReturned"]').inputValue(),'3');
 assert.equal(await returnForm.locator('[name="returnNote"]').inputValue(),'Keep this note when eligibility changes.');
 assert.equal(await returnForm.locator('[type="submit"]').isDisabled(),true);
 await captureState('return-original-ineligible',page,null,returnCapture);
 await returnForm.locator('[name="returnSource"]').selectOption('stock:'+otherEligible);
 assert.equal(await returnForm.locator('[name="quantityReturned"]').inputValue(),'1');
 assert.equal(await returnForm.locator('[type="submit"]').isEnabled(),true);
 await page.keyboard.press('Escape');assert.equal(await returnForm.locator('[name="returnNote"]').inputValue(),'Keep this note when eligibility changes.');
 await returnForm.locator('[data-stock-action="cancel-stock"]').click();await page.locator('#discard-dialog [data-action="keep-editing"]').click();await returnForm.waitFor();
 await page.locator('#stock-tab-movements').click();await page.locator('#discard-dialog [data-action="keep-editing"]').click();await returnForm.waitFor();
 await page.locator('#stock-tab-movements').click();await page.locator('#discard-dialog [data-action="discard-device-form-changes"]').click();
 const reader=await browser.newContext({ignoreHTTPSErrors:true,locale:'en-GB',viewport:{width:1440,height:1050}});
 const readerSession=await login(reader,'circulation-reader','Fictional-Account-Password-2026!');
 const readerPage=await reader.newPage();readerPage.on('pageerror',failure=>errors.push(String(failure)));await readerPage.goto(address+'/inventory#it-assets');await readerPage.locator('#stock-tab-inventory').waitFor();await movementTab(readerPage);
 assert.equal(await readerPage.locator('[data-stock-action="correct-movement"]').count(),0);assert.equal(await readerPage.locator('[data-stock-action="correct-return-movement"]').count(),0);assert.match(await readerPage.locator('#stock-panel').innerText(),/20\s+Effective: 20/);
 assert.equal((await reader.request.get(address+'/api/it-assets/corrections/'+original.entryId)).status(),403);
 assert.equal((await reader.request.post(address+'/api/it-assets/corrections/preview',{headers:{Origin:address,'X-CSRF-Token':readerSession.csrf_token},data:{entryId:original.entryId,version:openContext.version,correctedQuantity:17,reason:'Read only'}})).status(),403);
 await captureState('read-only-history',readerPage);
 const employeeContext=await browser.newContext({ignoreHTTPSErrors:true});await login(employeeContext,'circulation-employee','Fictional-Account-Password-2026!');assert.equal((await employeeContext.request.get(address+'/api/it-assets/history')).status(),403);assert.equal((await employeeContext.request.get(address+'/api/it-assets/corrections/'+originalIssue.entryId)).status(),403);
 const technician=await browser.newContext({ignoreHTTPSErrors:true});await login(technician,'circulation-technician','Fictional-Account-Password-2026!');
 const technicianPage=await technician.newPage();technicianPage.on('pageerror',failure=>errors.push(String(failure)));await technicianPage.goto(address+'/inventory#it-assets');await technicianPage.locator('#stock-tab-return').waitFor();await technicianPage.locator('#stock-tab-return').click();
 await technicianPage.locator('#stock-returnSource').selectOption('stock:'+otherEligible);await technicianPage.locator('[data-stock-action="correct-return-movement"]').click();await technicianPage.locator('#stock-correction-form').waitFor();
 assert.match(await technicianPage.locator('#stock-correction-details').innerText(),new RegExp('Entry '+otherEligible+'\\b'));
 await post(owner,session,'/api/settings/features',{feature:'it_assets',enabled:false,confirmDisable:true});assert.equal((await owner.request.get(address+'/api/it-assets/corrections/'+original.entryId)).status(),403);
 await post(owner,session,'/api/settings/features',{feature:'it_assets',enabled:true});
 assert.equal(fingerprint(),retained);assert.deepEqual(errors,[]);
 const sourceFiles=['backend/stock_corrections.py','backend/server.py','backend/stock_circulation.py','interface/stock-intake.js','interface/application.js','interface/styles/stock.css'];
 const sourceHashes=Object.fromEntries(sourceFiles.map(name=>[name,createHash('sha256').update(fs.readFileSync(path.join(root,name))).digest('hex')]));
 fs.writeFileSync(path.join(output,'browser-results.json'),JSON.stringify({baseline:'53b04328c4f895bfc1f72f0416c43a519b2e8b42',source:spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).stdout.trim(),sourceHashes,screenshots:screens,pageErrors:errors,checks:['Original And Effective Quantity','Server Preview Has No Writes','Blocked Chronological Replay','Mandatory Reason','Bottom Orange Save And Secondary Cancel','Cancel Keep Editing','Escape And Discard','Tab Unsaved Changes','Saved Before And After History','Partial Issue Balance','Stale Submission','Read Only History','No Access And Feature Off']},null,2)+'\n');
 console.log('PASS: correction preview, immutable save, history, partial issues, stale forms, Cancel/Escape, permissions and feature gates.');console.log('PASS: Return Equipment targets its original issue, retains drafts, refreshes versions, blocks failed refreshes and invalid quantities, requires fresh eligible selection, protects navigation and permits stock-only editors.');console.log('PASS: '+screens.length+' genuine application captures; no page errors or checked page overflow.');
}
main().catch(async failure=>{fs.writeFileSync(path.join(output,'failure.txt'),String(failure)+'\n'+(fs.existsSync(path.join(temporary,'server.log'))?fs.readFileSync(path.join(temporary,'server.log'),'utf8'):''));if(page)await page.screenshot({path:path.join(output,'failure.png'),fullPage:true}).catch(()=>{});console.error(failure);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();if(server){server.kill('SIGTERM');await new Promise(resolve=>server.once('exit',resolve));}});
