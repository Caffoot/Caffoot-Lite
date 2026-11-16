// Exercise approved direct handover through the real interface with fictional data.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn,spawnSync}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),temporary=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-device-handover-'));
const output=process.env.CAFFOOT_HANDOVER_OUTPUT||path.join(temporary,'evidence');
fs.mkdirSync(output,{recursive:true});
const database=path.join(temporary,'inventory.sqlite3'),address='https://127.0.0.1:8105';
let browser,server,log,page;
function python(code,args=[]){
 const result=spawnSync('python3',['-c',code,...args],{cwd:root,encoding:'utf8',env:{...process.env,PYTHONDONTWRITEBYTECODE:'1',PYTHONPATH:'tests:.'}});
 assert.equal(result.status,0,result.stderr);return result.stdout.trim();
}
async function main(){
 const identity=JSON.parse(python([
  'import json,sys,sqlite3',
  'from test_stock_circulation import StockCirculationTests,return_payload',
  'from backend.stock_circulation import stock_issue_records,return_stock',
  'from backend.equipment_associations import add_associated_equipment',
  'from backend.http_security import COOKIE_NAME',
  'f=StockCirculationTests();f.setUp();a=f.legacy_device()',
  'record=dict(id="canonical",name="Fictional Laptop",type="Laptop",status="Active",mountType="Desktop",location="Unknown",primaryIp="",notes="PRIVATE DEVICE NOTES")',
  'f.db.execute("UPDATE inventory_devices SET record_json=? WHERE id=?",(json.dumps(record),"canonical"));f.db.commit()',
  'item=f.receipt();f.issue(item,quantity=2);existing=stock_issue_records(f.db)[0]',
  'f.issue(item,quantity=1,recipientId="other")',
  'old=f.receipt(quantity=1,model="Historic Keyboard",category="Keyboard");f.issue(old);history=stock_issue_records(f.db)[0]',
  'add_associated_equipment(f.db,1,f.token,dict(operationId="historical-association-0001",deviceId="canonical",deviceRevision=0,deviceAssignmentId=a["id"],issueEntryId=history["id"],version=history["version"]))',
  'return_stock(f.db,1,f.token,return_payload(history))',
  'f.db.execute("INSERT INTO account_permission_overrides VALUES(2,?,?)",("Devices","read"));f.db.commit()',
  'from backend.permissions import create_user',
  'from backend.sessions import _digest',
  'from backend.role_policy import assign_staff_member',
  'from backend.device_stock import register_stock_device,reissue_stock_device',
  'from test_device_stock import registration_payload',
  'from test_device_reissue import reissue_payload',
  'add_associated_equipment(f.db,1,f.token,dict(operationId="outstanding-association-0001",deviceId="canonical",deviceRevision=0,deviceAssignmentId=a["id"],issueEntryId=existing["id"],version=existing["version"]))',
  'computers=f.receipt(quantity=1,model="Handover Desktop Batch",category="Desktop")',
  'computer=register_stock_device(f.db,1,f.token,registration_payload(f.db,computers))',
  'reissue_stock_device(f.db,1,f.token,reissue_payload(f.db,computer["deviceId"]))',
  'f.db.execute("INSERT INTO accounts(id,username,password_hash,mfa_secret,mfa_confirmed) VALUES(3,?,?,?,1)",("Fictional Device Editor","fixture hash","fixture secret"))',
  'assign_staff_member(f.db,3)',
  'f.db.execute("INSERT INTO account_permission_overrides VALUES(3,?,?)",("Devices","edit"))',
  'f.db.execute("INSERT INTO account_sessions VALUES(?,3,9999999999,1)",(_digest("c"*64),));f.db.commit()',
  'target=sqlite3.connect(sys.argv[1]);f.db.backup(target);target.close()',
  'print(json.dumps(dict(item=item,existing=existing["id"],cookieName=COOKIE_NAME,computer=computer)))'
 ].join('\n'),[database]));
 log=fs.openSync(path.join(temporary,'server.log'),'w');
 server=spawn('python3',['-c','import backend.server as server; server.PORT=8105; server.main()'],{
  cwd:root,stdio:['ignore',log,log],env:{...process.env,PYTHONDONTWRITEBYTECODE:'1',CAFFOOT_DB_PATH:database,
  CAFFOOT_TLS_DIR:path.join(temporary,'tls'),CAFFOOT_WEB_ADDRESS:address,CAFFOOT_SERVER_ADDRESS:'127.0.0.1',CAFFOOT_HOST:'127.0.0.1',CAFFOOT_PORT:'8105'}});
 browser=await chromium.launch({headless:true,executablePath:process.env.CAFFOOT_CHROMIUM_PATH||undefined});
 const owner=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:1050}});
 for(let attempt=0;attempt<60;attempt++){
  try{if((await owner.request.get(address+'/health',{timeout:750})).ok())break;}catch{}
  if(server.exitCode!==null)throw Error(fs.readFileSync(path.join(temporary,'server.log'),'utf8'));
  await new Promise(resolve=>setTimeout(resolve,150));
 }
 await owner.addCookies([{name:identity.cookieName,value:'b'.repeat(64),url:address,httpOnly:true,secure:true,sameSite:'Strict'}]);
 const session=await (await owner.request.get(address+'/api/session')).json();
 page=await owner.newPage();const errors=[],screens=[];page.setDefaultTimeout(10000);
 page.on('pageerror',failure=>errors.push(String(failure)));
 async function captureChangedScreen(name,selector){
  if(process.env.CAFFOOT_HANDOVER_CAPTURE!=='1')return;
  await page.waitForFunction(()=>!document.getElementById('toast')||getComputedStyle(document.getElementById('toast')).opacity==='0');
  for(const width of [1440,390])for(const theme of ['light','dark']){
   await page.setViewportSize({width,height:1050});
   await page.evaluate(theme=>{localStorage.setItem('caffoot_theme_preference',theme);caffootApplyTheme();},theme);
   assert.equal(await page.evaluate(()=>document.documentElement.classList.contains('dark')),theme==='dark');
   await page.locator(selector).scrollIntoViewIfNeeded();
   const file=name+'-'+(width===1440?'desktop':'mobile')+'-'+theme+'.png';
   await page.screenshot({path:path.join(output,file),fullPage:true});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Page overflow at '+file);
   screens.push(file);
  }
  await page.setViewportSize({width:1440,height:1050});await page.evaluate(()=>{localStorage.setItem('caffoot_theme_preference','light');caffootApplyTheme();});
 }


 async function captureHandoverFooter(name){
  if(process.env.CAFFOOT_HANDOVER_CAPTURE!=='1')return;
  for(const width of [1440,390])for(const theme of ['light','dark']){
   await page.setViewportSize({width,height:1050});
   await page.evaluate(theme=>{localStorage.setItem('caffoot_theme_preference',theme);caffootApplyTheme();},theme);
   const footer=page.locator('#stock-reissue-form > .assignment-modal-actions');
   await footer.scrollIntoViewIfNeeded();
   assert.equal(await footer.evaluate(node=>getComputedStyle(node).justifyContent),'flex-end');
   const file=name+'-'+(width===1440?'desktop':'mobile')+'-'+theme+'.png';
   await page.screenshot({path:path.join(output,file),fullPage:false});
   screens.push(file);
  }
  await page.setViewportSize({width:1440,height:1050});
  await page.evaluate(()=>{localStorage.setItem('caffoot_theme_preference','light');caffootApplyTheme();});
 }
 const ownerPage=page;
 async function read(route,context=owner){const response=await context.request.get(address+route);assert.equal(response.status(),200,await response.text());return response.json();}
 async function post(route,data){const response=await owner.request.post(address+route,{headers:{Origin:address,'X-CSRF-Token':session.csrf_token},data});assert.equal(response.status(),200,await response.text());return response.json();}
 function stockSnapshot(){return python('import sqlite3,sys,json;db=sqlite3.connect(sys.argv[1]);print(json.dumps({t:db.execute("SELECT * FROM "+t+" ORDER BY 1").fetchall() for t in ("it_asset_stock_items","it_asset_stock_units","it_asset_stock_movements","it_asset_stock_entries")}))',[database]);}
 function inventorySnapshot(){return python('import sqlite3,sys,json;db=sqlite3.connect(sys.argv[1]);print(json.dumps(db.execute("SELECT * FROM inventory_devices ORDER BY id").fetchall()))',[database]);}
 function feature(enabled){python('import sqlite3,sys;db=sqlite3.connect(sys.argv[1]);db.execute("UPDATE organisation_features SET enabled=? WHERE feature=\'it_assets\'",(int(sys.argv[2]),));db.commit()',[database,String(Number(enabled))]);}
 async function openDevice(id){
  await page.locator('#sidebar [data-action="tab-devices"]').click();
  await page.getByRole('tab',{name:'Device Inventory',exact:true}).click();
  await page.locator('[data-action="view-device"][data-id="'+id+'"]').first().click();
  await page.locator('#device-details-tab-assigned').click();
  await page.locator('#device-details-panel-assigned .assignment-main strong').waitFor();
 }
 async function chooseRecipient(kind,id){
  await page.locator('#stock-recipientKind').selectOption(kind);
  await page.locator('#stock-recipientId option[value="'+id+'"]').waitFor({state:'attached'});
  await page.locator('#stock-recipientId').selectOption(id);
 }
 async function confirmChecks(){
  await page.locator('#stock-reissue-form [name="cleanedWorking"]').check();
  assert.equal(await page.getByRole('button',{name:'Confirm Ready And Reassign',exact:true}).isDisabled(),true);
  await page.locator('#stock-reissue-form [name="dataPreparationConfirmed"]').check();
  assert.equal(await page.getByRole('button',{name:'Confirm Ready And Reassign',exact:true}).isEnabled(),true);
 }
 async function saveHandover(){
  const saved=page.waitForResponse(response=>response.url().endsWith('/api/equipment/reassign')&&response.request().method()==='POST');
  await page.getByRole('button',{name:'Confirm Ready And Reassign',exact:true}).click();
  const response=await saved;assert.equal(response.status(),200,await response.text());return response.json();
 }
 await page.goto(address+'/inventory');await openDevice('canonical');
 assert.equal(await page.locator('[data-equipment-action="reassign-device"]').count(),0,'Unresolved accessories prevent a handover');
 let issue=(await read('/api/it-assets/issues')).issues.find(issue=>issue.id===identity.existing);
 const today=new Date().toISOString().slice(0,10),uuid=()=>require('node:crypto').randomUUID();
 await post('/api/it-assets/write-off',{operationId:uuid(),issueEntryId:issue.id,version:issue.version,quantity:1,fromState:'issued',writtenOffOn:today,reason:'One mouse missing',note:''});
 issue=(await read('/api/it-assets/issues')).issues.find(issue=>issue.id===identity.existing);
 await post('/api/it-assets/return',{operationId:uuid(),issueEntryId:issue.id,version:issue.version,quantityReturned:1,readyQuantity:0,writeOffQuantity:0,returnedOn:today,checks:{cleanedWorking:false,dataPreparationConfirmed:false},writeOffReason:'',note:'One accessory actually returned'});
 feature(false);
 const editor=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:1050}});
 await editor.addCookies([{name:identity.cookieName,value:'c'.repeat(64),url:address,httpOnly:true,secure:true,sameSite:'Strict'}]);
 page=await editor.newPage();page.on('pageerror',failure=>errors.push(String(failure)));await page.goto(address+'/inventory');await openDevice('canonical');
 assert.equal(await page.locator('#device-details-tab-associated').count(),0);
 assert.equal(await page.locator('#sidebar [data-action="tab-it-assets"]').isVisible(),false);
 const stockBefore=stockSnapshot(),inventoryBefore=inventorySnapshot();
 await page.locator('[data-equipment-action="reassign-device"]').click();
 await page.locator('#stock-reissue-form[data-direct-handover]').waitFor();
 assert.equal((await page.locator('label[for="stock-recipientKind"]').textContent()).trim(),'Recipient Type');
 assert.equal((await page.locator('label[for="stock-recipientId"]').textContent()).trim(),'Find A Recipient');
 assert.equal(await page.locator('#stock-recipientSearch').count(),0,'Direct handover must show only its two dropdowns');
 assert.equal(await page.locator('#stock-reissue-form').getByText('New Recipient',{exact:true}).count(),0);
 await page.locator('#stock-recipientKind').selectOption('department');
 await page.locator('#stock-recipientId option[value="department"]').waitFor({state:'attached'});
 assert.equal(await page.locator('#stock-recipientId option[value="other"]').count(),0,'Department list must not show staff');
 await page.locator('#stock-recipientKind').selectOption('staff');
 await page.locator('#stock-recipientId option[value="other"]').waitFor({state:'attached'});
 assert.equal(await page.locator('#stock-recipientId option[value="department"]').count(),0,'Staff list must not show departments');
 const actions=page.locator('#stock-reissue-form > .assignment-modal-actions');
 assert.deepEqual((await actions.locator('button').allTextContents()).map(value=>value.trim()),['Cancel','Confirm Ready And Reassign']);
 const confirmAction=actions.locator('button[type="submit"]');
 assert.equal(await confirmAction.getAttribute('class'),'btn btn-primary','Handover confirmation must use the standard Caffoot orange action style');
 assert.equal(await page.locator('.assignment-modal-head [data-stock-action="cancel-handover"]').count(),0);
 assert.equal(await page.locator('#stock-reissue-form button[type="reset"]').count(),0,'Handover offers Cancel, not a redundant Reset');
 assert.equal(await page.locator('#stock-recipientKind').inputValue(),'staff');
 assert.equal(await page.locator('#stock-handoverDevice').inputValue(),'Fictional Laptop');
 assert.equal(await page.locator('#stock-handoverDevice').getAttribute('readonly'),'');
 assert.equal(await page.locator('#stock-reissue-form [name="cleanedWorking"]').isChecked(),false);
 assert.equal(await page.locator('#stock-reissue-form [name="dataPreparationConfirmed"]').isChecked(),false);
 await captureChangedScreen('direct-handover-checks-required','#stock-reissue-form');
 await captureHandoverFooter('direct-handover-footer-checks-required');
 // Unmodified Cancel returns directly, without a discard prompt.
 await page.locator('[data-stock-action="cancel-handover"]').click();
 await page.locator('#device-details-panel-assigned .assignment-main strong').getByText('Fictional Staff',{exact:true}).waitFor();
 assert.equal(await page.locator('#discard-dialog').count(),0,'Unchanged Cancel needs no warning');
 assert.equal(stockSnapshot(),stockBefore);assert.equal(inventorySnapshot(),inventoryBefore);
 await page.locator('[data-equipment-action="reassign-device"]').click();
 await page.locator('#stock-reissue-form[data-direct-handover]').waitFor();
 await chooseRecipient('staff','other');await confirmChecks();
 await page.locator('#stock-issueNote').fill('Preparing to transfer to another holder');
 await page.locator('[data-stock-action="cancel-handover"]').click();
 await page.locator('#discard-dialog').waitFor();
 assert.equal(await page.locator('#stock-recipientId').inputValue(),'other','Cancel must not clear the recipient before confirmation');
 assert.equal(await page.locator('#stock-reissue-form [name="cleanedWorking"]').isChecked(),true);
 assert.equal(await page.locator('#stock-issueNote').inputValue(),'Preparing to transfer to another holder');
 await page.locator('#discard-dialog [data-action="keep-editing"]').click();
 assert.equal(await page.locator('#discard-dialog').count(),0,'Keep Editing dismisses confirmation');
 assert.equal(await page.locator('#stock-recipientId').inputValue(),'other','Keep Editing preserves the chosen recipient');
 assert.equal(await page.locator('#stock-reissue-form [name="dataPreparationConfirmed"]').isChecked(),true);
 assert.equal(await page.locator('#stock-issueNote').inputValue(),'Preparing to transfer to another holder');
 await page.locator('[data-stock-action="cancel-handover"]').click();
 await page.locator('#discard-dialog [data-action="discard-device-form-changes"]').click();
 await page.locator('#device-details-panel-assigned .assignment-main strong').getByText('Fictional Staff',{exact:true}).waitFor();
 assert.equal(await page.locator('#discard-dialog').count(),0);
 assert.equal(stockSnapshot(),stockBefore,'Discard Changes must not mutate stock');
 assert.equal(inventorySnapshot(),inventoryBefore,'Discard Changes must not mutate the Device');
 // A single changed field must also be detected, even without a recipient selection.
 await page.locator('[data-equipment-action="reassign-device"]').click();
 await page.locator('#stock-reissue-form[data-direct-handover]').waitFor();
 await page.locator('#stock-issueNote').fill('Unsaved note only');
 await page.locator('[data-stock-action="cancel-handover"]').click();
 await page.locator('#discard-dialog').waitFor();
 await page.locator('#discard-dialog [data-action="discard-device-form-changes"]').click();
 await page.locator('#device-details-panel-assigned .assignment-main strong').getByText('Fictional Staff',{exact:true}).waitFor();
 assert.equal(stockSnapshot(),stockBefore);assert.equal(inventorySnapshot(),inventoryBefore);
 await page.locator('[data-equipment-action="reassign-device"]').click();
 await chooseRecipient('staff','other');await confirmChecks();
 await captureChangedScreen('direct-handover-devices-only','#stock-reissue-form');
 await saveHandover();
 await page.locator('#device-details-panel-assigned .assignment-main strong').getByText('Other Staff',{exact:true}).waitFor();
 assert.equal(stockSnapshot(),stockBefore,'A Devices-only handover writes no stock fact');assert.equal(inventorySnapshot(),inventoryBefore);
 await captureChangedScreen('assigned-after-direct-handover','#device-details-panel-assigned');
 const personal=await browser.newContext({ignoreHTTPSErrors:true});
 await personal.addCookies([{name:identity.cookieName,value:'a'.repeat(64),url:address,httpOnly:true,secure:true,sameSite:'Strict'}]);
 const equipment=await read('/api/my-equipment',personal);
 assert.ok(equipment.assignedToMe.every(item=>item.id!=='canonical'));
 assert.ok(!JSON.stringify(equipment).includes('PRIVATE'));
 feature(true);page=ownerPage;await page.reload();await openDevice(identity.computer.deviceId);
 const beforeRegistered=await read('/api/it-assets/stock/'+identity.computer.stockItemId);
 await page.locator('[data-equipment-action="reassign-device"]').click();
 await chooseRecipient('department','department');await confirmChecks();
 await captureChangedScreen('direct-handover-registered','#stock-reissue-form');
 await captureHandoverFooter('direct-handover-footer-registered');
 await saveHandover();
 await page.locator('#device-details-panel-assigned .assignment-main strong').getByText('Fictional Department',{exact:true}).waitFor();
 const afterRegistered=await read('/api/it-assets/stock/'+identity.computer.stockItemId);
 assert.deepEqual(afterRegistered.item.balances,beforeRegistered.item.balances,'Registered custody changes never increase held or Ready');
 assert.equal(inventorySnapshot(),inventoryBefore);
 const issues=(await read('/api/it-assets/issues')).issues.filter(issue=>issue.stockUnitId===identity.computer.stockUnitId);
 assert.deepEqual(issues.map(issue=>issue.outstanding),[1,0]);assert.equal(issues[0].departmentId,'department');
 // Escape from a direct handover must clear context even when Cancel was never clicked.
 await page.locator('[data-equipment-action="reassign-device"]').click();
 await page.locator('#stock-reissue-form[data-direct-handover]').waitFor();
 await page.keyboard.press('Escape');
 await page.locator('#modal-container.hidden').waitFor({state:'attached'});
 assert.equal(await page.locator('#stock-reissue-form').count(),0,'Closed direct handover must leave no duplicate reissue form in the page');
 await page.locator('#sidebar [data-action="tab-it-assets"]').click();
 await page.getByRole('tab',{name:'Reissue Existing Device',exact:true}).click();
 await page.locator('#stock-reissue-form:not([data-direct-handover])').waitFor();
 assert.equal(await page.locator('#stock-reissue-form').count(),1,'Only the actual stock reissue form remains');
 assert.equal(await page.locator('#stock-reissueDevice').count(),1,'Escape must clear prior Device handover context');
 await page.getByRole('tab',{name:'Movement History',exact:true}).click();
 await page.getByRole('cell',{name:'Reassigned',exact:true}).waitFor();
 await captureChangedScreen('stock-custody-history','#stock-panel');
 await personal.close();await editor.close();assert.deepEqual(errors,[]);
 const sourceFiles=['interface/application.js','interface/equipment.js','interface/stock-intake.js','interface/screens/devices.html','interface/styles/equipment.css','interface/styles/stock.css','interface/styles/staff.css','backend/device_handovers.py','backend/handover_schema.py','backend/device_assignments.py','backend/stock_circulation.py','backend/device_stock.py','backend/assignment_closure.py','backend/stock_schema.py','backend/schema.py','backend/server.py'];
 const crypto=require('node:crypto'),sourceHashes=Object.fromEntries(sourceFiles.map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')]));
 fs.writeFileSync(path.join(output,'browser-results.json'),JSON.stringify({checks:['Approved Assigned To Entry Point','Outstanding Accessories Block','Actual Partial Return And Missing Write Off','Devices-only Editor With Assets Off','Unchecked Preparation Defaults','Explicit Ready Confirmation','Cancellation Preserves Old Holder','Atomic Direct Reassignment','No Legacy Stock Facts','No Registered Held Or Ready Increase','One Canonical Device Identity','Registered Former And New Custody','Employee-safe Equipment','Single Reassignment Movement','Desktop/Mobile Light/Dark','No Page Errors'],pageErrors:errors,screenshots:screens,sourceParent:spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).stdout.trim(),sourceHashes},null,2));
 console.log('PASS: approved direct handover, Devices-only and registered custody, checks, cancellation, privacy and '+screens.length+' genuine captures.');
}

main().catch(async failure=>{
 fs.writeFileSync(path.join(output,'failure.txt'),String(failure)+'\n'+(fs.existsSync(path.join(temporary,'server.log'))?fs.readFileSync(path.join(temporary,'server.log'),'utf8'):''));
 if(page)await page.screenshot({path:path.join(output,'failure.png'),fullPage:true}).catch(()=>{});
 console.error(failure);process.exitCode=1;
}).finally(async()=>{if(browser)await browser.close();if(server)server.kill();if(log!==undefined)fs.closeSync(log);fs.rmSync(temporary,{recursive:true,force:true});});
