// Exercise the real stock interface and protected APIs with isolated fictional data.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn,spawnSync}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),temporary=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-associated-equipment-'));
const output=process.env.CAFFOOT_ASSOCIATION_OUTPUT||path.join(temporary,'evidence');
fs.mkdirSync(output,{recursive:true});
const database=path.join(temporary,'inventory.sqlite3'),address='https://127.0.0.1:8104';
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
  'target=sqlite3.connect(sys.argv[1]);f.db.backup(target);target.close()',
  'print(json.dumps(dict(item=item,existing=existing["id"],cookieName=COOKIE_NAME)))'
 ].join('\n'),[database]));
 log=fs.openSync(path.join(temporary,'server.log'),'w');
 server=spawn('python3',['-c','import backend.server as server; server.PORT=8104; server.main()'],{
  cwd:root,stdio:['ignore',log,log],env:{...process.env,PYTHONDONTWRITEBYTECODE:'1',CAFFOOT_DB_PATH:database,
  CAFFOOT_TLS_DIR:path.join(temporary,'tls'),CAFFOOT_WEB_ADDRESS:address,CAFFOOT_SERVER_ADDRESS:'127.0.0.1',CAFFOOT_HOST:'127.0.0.1',CAFFOOT_PORT:'8104'}});
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
  if(process.env.CAFFOOT_ASSOCIATION_CAPTURE!=='1')return;
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


 async function read(route){const response=await owner.request.get(address+route);assert.equal(response.status(),200,await response.text());return response.json();}
 async function openDevice(){
  await page.locator('#sidebar [data-action="tab-devices"]').click();
  await page.getByRole('tab',{name:'Device Inventory',exact:true}).click();
  await page.locator('[data-action="view-device"][data-id="canonical"]').first().click();
  await page.locator('#device-details-panel-assigned').getByText('Fictional Staff',{exact:true}).first().waitFor({state:'attached'});
 }
 await page.goto(address+'/inventory');await openDevice();
 await page.locator('#device-details-tab-assigned').click();
 const assignedBefore=await page.locator('#device-details-panel-assigned').evaluate(host=>{const copy=host.cloneNode(true);copy.querySelector('[data-equipment-action="reassign-device"]')?.remove();return copy.innerHTML;});
 await page.locator('#device-details-tab-associated').click();
 await page.getByText('No currently associated equipment.',{exact:true}).waitFor();
 assert.ok((await page.locator('#device-details-panel-associated').textContent()).includes('Historic Keyboard'));
 await page.locator('[data-equipment-action="add-associated"]').click();
 await page.locator('#stock-issue-form').waitFor();
 assert.equal(await page.locator('#stock-recipientId').count(),0,'Association holder must not be freely selectable');
 await page.locator('#stock-issueItem').selectOption(identity.item);
 await page.locator('#stock-issueQuantity').fill('100');
 assert.equal(await page.locator('#stock-issue-form [type="submit"]').isDisabled(),true);
 await page.locator('#stock-issueQuantity').fill('3');
 await captureChangedScreen('add-equipment-ready','#stock-issue-form');
 const before=await read('/api/it-assets/stock/'+identity.item);
 const saved=page.waitForResponse(response=>response.url().endsWith('/api/equipment/issue-and-associate')&&response.request().method()==='POST');
 await page.locator('#stock-issue-form [type="submit"]').click();assert.equal((await saved).status(),200);
 await page.locator('#device-details-panel-associated [data-equipment-action="add-associated"]').waitFor();
 assert.equal((await read('/api/it-assets/stock/'+identity.item)).item.balances.physicallyHeld,before.item.balances.physicallyHeld-3);
 await page.locator('[data-equipment-action="add-associated"]').click();
 await page.locator('#stock-associationMethod').selectOption('existing');
 await page.locator('#stock-existingIssue').selectOption(String(identity.existing));
 const optionLabels=await page.locator('#stock-existingIssue option').allTextContents();
 assert.equal(optionLabels.length,1,'Wrong-holder, returned and already linked issues are excluded');
 await captureChangedScreen('add-equipment-existing','#stock-issue-form');
 const issuedBefore=await read('/api/it-assets/stock/'+identity.item);
 const linked=page.waitForResponse(response=>response.url().endsWith('/api/equipment/associations')&&response.request().method()==='POST');
 await page.locator('#stock-issue-form [type="submit"]').click();assert.equal((await linked).status(),200);
 await page.locator('#device-details-panel-associated [data-equipment-action="add-associated"]').waitFor();
 assert.deepEqual((await read('/api/it-assets/stock/'+identity.item)).item.balances,issuedBefore.item.balances);
 const associated=await read('/api/equipment/associations?deviceId=canonical');
 assert.equal(associated.current.length,2);assert.equal(associated.history.length,3);
 await captureChangedScreen('associated-equipment','#device-details-panel-associated');
 await page.locator('#device-details-tab-assigned').click();
 assert.equal(await page.locator('#device-details-panel-assigned').evaluate(host=>{const copy=host.cloneNode(true);copy.querySelector('[data-equipment-action="reassign-device"]')?.remove();return copy.innerHTML;}),assignedBefore,'Other Assigned To controls and history remain unchanged');
 assert.equal(await page.locator('[data-equipment-action="reassign-device"]').count(),0,'Outstanding accessories block reassignment');
 const reader=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:390,height:1050}});
 await reader.addCookies([{name:identity.cookieName,value:'a'.repeat(64),url:address,httpOnly:true,secure:true,sameSite:'Strict'}]);
 const readerPage=await reader.newPage();await readerPage.goto(address+'/inventory');
 await readerPage.locator('#sidebar [data-action="tab-devices"]').click();
 await readerPage.getByRole('tab',{name:'Device Inventory',exact:true}).click();
 await readerPage.locator('[data-action="view-device"][data-id="canonical"]').first().click();
 await readerPage.locator('#device-details-tab-associated').click();
 await readerPage.getByText('2 Current Associations',{exact:true}).waitFor();
 assert.equal(await readerPage.locator('[data-equipment-action="add-associated"]').count(),0);
 assert.equal(await readerPage.locator('#device-details-panel-associated [data-equipment-action="return-stock"]').count(),0);
 for(const feature of ['it_assets','devices']){
  python('import sqlite3,sys;db=sqlite3.connect(sys.argv[1]);db.execute("UPDATE organisation_features SET enabled=0 WHERE feature=?",(sys.argv[2],));db.commit()',[database,feature]);
  assert.equal((await owner.request.get(address+'/api/equipment/associations?deviceId=canonical')).status(),403);
  if(feature==='it_assets'){
   await page.reload();await openDevice();
   assert.equal(await page.locator('#device-details-tab-associated').count(),0);
   assert.ok(!(await page.locator('#modal-content').textContent()).includes('Historic Keyboard'));
  }
  python('import sqlite3,sys;db=sqlite3.connect(sys.argv[1]);db.execute("UPDATE organisation_features SET enabled=1 WHERE feature=?",(sys.argv[2],));db.commit()',[database,feature]);
 }
 await page.reload();await openDevice();await page.locator('#device-details-tab-associated').click();
 await page.locator('[data-equipment-action="writeoff-associated"][data-id="'+identity.existing+'"]').click();
 await page.locator('#stock-writeoff-form').waitFor();
 assert.equal(await page.locator('#stock-writeOffQuantity').getAttribute('readonly'),null);
 await page.locator('#stock-writeOffQuantity').fill('1');await page.locator('#stock-writeOffReason').fill('One mouse missing');
 await captureChangedScreen('missing-issued-quantity','#stock-writeoff-form');
 const beforeMissing=await read('/api/it-assets/stock/'+identity.item);
 const missing=page.waitForResponse(response=>response.url().endsWith('/api/it-assets/write-off')&&response.request().method()==='POST');
 await page.locator('#stock-writeoff-form [type="submit"]').click();assert.equal((await missing).status(),200);
 const afterMissing=await read('/api/it-assets/stock/'+identity.item);
 assert.deepEqual(afterMissing.item.balances,beforeMissing.item.balances,'Missing equipment never enters held or Ready stock');
 const originalIssue=(await read('/api/it-assets/issues')).issues.find(issue=>issue.id===identity.existing);
 assert.equal(originalIssue.quantity,2);assert.equal(originalIssue.outstanding,1);
 await reader.close();assert.deepEqual(errors,[]);
 const sourceFiles=['interface/application.js','interface/equipment.js','interface/stock-intake.js','interface/screens/devices.html','interface/styles/equipment.css','interface/styles/stock.css','backend/equipment_associations.py','backend/stock_circulation.py','backend/device_stock.py','backend/device_assignments.py'];
 const crypto=require('node:crypto');
 const sourceHashes=Object.fromEntries(sourceFiles.map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')]));
 fs.writeFileSync(path.join(output,'browser-results.json'),JSON.stringify({checks:['Separate Device Tab','Assigned To Preserved','Explicit Links Only','Issue And Associate','Selected Item Availability','Associate Existing Without Deduction','Exact Recipient Choices','Read Only','Feature-Off Privacy','Desktop/Mobile Light/Dark','No Page Errors','Missing Issued Quantity Without Return'],pageErrors:errors,screenshots:screens,sourceParent:spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).stdout.trim(),sourceHashes},null,2));
 console.log('PASS: Associated Equipment, both Add Equipment routes, permissions/privacy and missing quantity write-off; captures: '+screens.length);
}

main().catch(async failure=>{
 fs.writeFileSync(path.join(output,'failure.txt'),String(failure)+'\n'+(fs.existsSync(path.join(temporary,'server.log'))?fs.readFileSync(path.join(temporary,'server.log'),'utf8'):''));
 if(page)await page.screenshot({path:path.join(output,'failure.png'),fullPage:true}).catch(()=>{});
 console.error(failure);process.exitCode=1;
}).finally(async()=>{if(browser)await browser.close();if(server)server.kill();if(log!==undefined)fs.closeSync(log);fs.rmSync(temporary,{recursive:true,force:true});});
