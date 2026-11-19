// Exercise the real stock interface and protected APIs with isolated fictional data.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn,spawnSync}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),temporary=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-stock-intake-'));
const output=process.env.CAFFOOT_STOCK_OUTPUT||path.join(temporary,'evidence');
fs.mkdirSync(output,{recursive:true});
const database=path.join(temporary,'inventory.sqlite3'),address='https://127.0.0.1:8097';
let browser,server,log,page;
function python(code,args=[]){
 const result=spawnSync('python3',['-c',code,...args],{cwd:root,encoding:'utf8',env:{...process.env,PYTHONDONTWRITEBYTECODE:'1',PYTHONPATH:'tests:.'}});
 assert.equal(result.status,0,result.stderr);return result.stdout.trim();
}
function retained(){
 return python([
  'import sqlite3,sys,json,hashlib',
  'db=sqlite3.connect(sys.argv[1])',
  'tables=["accounts","roles","role_grants","account_roles","account_permission_overrides","staff_members","departments","device_assignments","inventory_devices","inventory_subnets","inventory_vlans","inventory_racks","inventory_rack_accessories","inventory_ip_allocations"]',
  'print(hashlib.sha256(json.dumps({t:db.execute("SELECT * FROM "+t+" ORDER BY 1").fetchall() for t in tables},sort_keys=True).encode()).hexdigest())'
 ].join('\n'),[database]);
}
async function main(){
 const identity=JSON.parse(python([
  'import sqlite3,json,sys,time',
  'from backend.schema import initialise_database',
  'from backend.accounts import bootstrap_first_admin,confirm_admin_mfa',
  'from backend.permissions import create_user',
  'from backend.mfa import code_at',
  'with sqlite3.connect(sys.argv[1]) as db:',
  ' db.execute("PRAGMA foreign_keys=ON");initialise_database(db)',
  ' owner,secret=bootstrap_first_admin(db,"owner","Fictional-Owner-Password-2026!")',
  ' confirm_admin_mfa(db,owner,code_at(secret,time.time()))',
  ' for name,grant in [("stock-reader","read"),("stock-editor","edit")]:',
  '  user=create_user(db,owner,name,"Fictional-Stock-Password-2026!")',
  '  db.execute("UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?",(secret,user))',
  '  db.execute("INSERT INTO account_permission_overrides VALUES(?,?,?)",(user,"IT Assets",grant));db.commit()',
  ' db.execute("INSERT INTO departments(id,name) VALUES(\'retained-department\',\'Retained Department\')")',
  ' db.execute("INSERT INTO staff_members(id,first_name,department_id) VALUES(\'retained-person\',\'Retained Staff\',\'retained-department\')")',
  ' db.execute("INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES(\'retained-device\',\'Retained Laptop\',\'{\\"type\\":\\"Laptop\\"}\',0)")',
  ' db.execute("INSERT INTO device_assignments(device_id,staff_id,recipient_label,assigned_at,actor_id,actor_label) VALUES(\'retained-device\',\'retained-person\',\'Retained Staff\',\'2026-11-15\',?,\'owner\')",(owner,))',
  ' db.commit();print(json.dumps(dict(secret=secret)))'
 ].join('\n'),[database]));
 const before=retained();
 log=fs.openSync(path.join(temporary,'server.log'),'w');
 server=spawn('python3',['-c','import backend.server as server; server.PORT=8097; server.main()'],{
  cwd:root,stdio:['ignore',log,log],env:{...process.env,PYTHONDONTWRITEBYTECODE:'1',CAFFOOT_DB_PATH:database,
  CAFFOOT_TLS_DIR:path.join(temporary,'tls'),CAFFOOT_WEB_ADDRESS:address,CAFFOOT_SERVER_ADDRESS:'127.0.0.1',CAFFOOT_HOST:'127.0.0.1',CAFFOOT_PORT:'8097'}});
 browser=await chromium.launch({headless:true,executablePath:process.env.CAFFOOT_CHROMIUM_PATH||undefined});
 const owner=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:1050}});
 for(let attempt=0;attempt<60;attempt++){
  try{if((await owner.request.get(address+'/health',{timeout:750})).ok())break;}catch{}
  if(server.exitCode!==null)throw Error(fs.readFileSync(path.join(temporary,'server.log'),'utf8'));
  await new Promise(resolve=>setTimeout(resolve,150));
 }
 const code=()=>python('from backend.mfa import code_at;import sys,time;print(code_at(sys.argv[1],time.time()))',[identity.secret]);
 async function login(context,username,password){
  const response=await context.request.post(address+'/api/login',{headers:{Origin:address},data:{username,password,mfa_code:code()}});
  assert.equal(response.status(),200,await response.text());
  return (await context.request.get(address+'/api/session')).json();
 }
 const session=await login(owner,'owner','Fictional-Owner-Password-2026!');
 page=await owner.newPage();const errors=[],screens=[];
 page.on('pageerror',failure=>errors.push(String(failure)));
 async function settings(){
  if(page.url()==='about:blank')await page.goto(address+'/inventory');
  await page.locator('[data-action="tab-settings"]').click();
  await page.locator('[data-action="select-settings-tab"][data-tab="features"]').click();
  await page.locator('#optional-feature-it-assets').waitFor();
 }
 async function stockTab(name){
  await page.locator('[data-stock-action="tab"][data-tab="'+name+'"]').click();
 }
 async function save(form,route){
  const response=page.waitForResponse(response=>response.url()===address+'/api/it-assets/'+route&&response.request().method()==='POST');
  await page.locator('#'+form+' [type="submit"]').click();
  const result=await response;assert.equal(result.status(),200,await result.text());
  const data=await result.json();
  if(route==='receive')await page.waitForFunction(()=>document.querySelector('#stock-tab-history')?.getAttribute('aria-selected')==='true');
  else await page.locator('#stock-readiness-form').waitFor();
  return {data,payload:result.request().postDataJSON()};
 }
 async function current(id){
  const response=await owner.request.get(address+'/api/it-assets/stock/'+id);
  assert.equal(response.status(),200,await response.text());return response.json();
 }
 async function details(id){
  await stockTab('inventory');
  await page.locator('[data-stock-action="details"][data-id="'+id+'"]').last().click();
  await page.locator('#stock-readiness-form').waitFor();
 }
 async function newComputer(memory,quantity,supplier){
  await stockTab('receive');
  await page.locator('[data-stock-action="mode-new"]').click();
  await page.locator('#stock-manufacturer').fill('Fictional Computers');
  await page.locator('#stock-model').fill('Workstation');
  await page.locator('#stock-processor').fill('Fictional CPU');
  await page.locator('#stock-memory').fill(String(memory));
  await page.locator('#stock-storage').fill('512');
  await page.locator('#stock-storageMedium').selectOption('NVMe SSD');
  await page.locator('#stock-quantity').fill(String(quantity));
  await page.locator('#stock-supplier').fill(supplier);
 }
 await settings();
 assert.equal(await page.locator('[data-tab="it-assets"][data-action]').isVisible(),false);
 assert.match(await page.locator('[data-feature-card="it_assets"] .description').textContent(),/Receive, issue and return equipment/);
 const enabled=page.waitForResponse(r=>r.url().endsWith('/api/settings/features')&&r.request().method()==='POST');
 await page.locator('#optional-feature-it-assets').check({force:true});assert.equal((await enabled).status(),200);
 await page.locator('[data-action="tab-it-assets"]').waitFor({state:'visible'});
 await page.locator('[data-action="tab-it-assets"]').click();
 // The approved IT Assets Overview is the default; select the existing receipt workflow.
 await stockTab('receive');
 await page.locator('#stock-receipt-form').waitFor();
 // All full-page stock workflows use the approved right-aligned Cancel / orange primary footer.
 for(const [tabName,formId,submitText] of [
   ['receive','stock-receipt-form','Record Receipt'],
   ['issue','stock-issue-form','Issue Equipment'],
   ['return','stock-return-form','Record Return'],
   ['writeoff','stock-writeoff-form','Record Write Off'],
   ['reissue','stock-reissue-form','Reissue Existing Device']
 ]){
   // On fresh installations Devices is disabled until explicitly enabled.
   if(tabName==='reissue'&&await page.locator('#stock-tab-reissue').count()===0)continue;
   if(tabName!=='receive')await stockTab(tabName);
   const form=page.locator('#'+formId);
   await form.waitFor();
   const footer=form.locator(':scope > .stock-form-actions');
   assert.deepEqual((await footer.locator('button').allTextContents()).map(value=>value.trim()),['Cancel',submitText]);
   assert.equal(await footer.locator('[type="submit"]').getAttribute('class'),'btn btn-primary');
   for(const theme of ['light','dark']){
    await page.evaluate(theme=>caffootSetTheme(theme),theme);
    assert.equal(await footer.locator('[type="submit"]').evaluate(button=>getComputedStyle(button).backgroundColor),'rgb(237, 133, 50)',formId+' primary action must be orange in '+theme);
    assert.equal(await footer.locator('[type="submit"]').evaluate(button=>getComputedStyle(button).color),'rgb(255, 255, 255)',formId+' primary action must have white text in '+theme);
   }
   await page.evaluate(()=>caffootSetTheme('light'));
   assert.equal(await footer.evaluate(node=>getComputedStyle(node).justifyContent),'flex-end');
   assert.equal(await form.locator('button[type="reset"]').count(),0);
   await footer.locator('[data-stock-action="cancel-stock"]').click();
   assert.equal(await page.locator('#discard-dialog').count(),0,'Unchanged '+tabName+' cancels immediately');
   assert.equal(await page.locator('#stock-tab-inventory').getAttribute('aria-selected'),'true');
 }
 await stockTab('receive');
 const receiptGaps=await page.locator('#stock-receipt-form').evaluate(form=>{
  const choice=form.querySelector('.preview-details-actions[role="group"]');
  const newFields=form.querySelector('#stock-new-fields');
  const initialFields=newFields.querySelector(':scope > .staff-fields');
  const specifications=form.querySelector('#stock-computer-fields');
  return {choice:newFields.getBoundingClientRect().top-choice.getBoundingClientRect().bottom,
    specifications:specifications.getBoundingClientRect().top-initialFields.getBoundingClientRect().bottom};
 });
 assert.ok(receiptGaps.choice>=18,'Receive Stock mode buttons need clear spacing before fields: '+JSON.stringify(receiptGaps));
 assert.ok(receiptGaps.specifications>=18,'Shared Computer Specifications needs subsection spacing: '+JSON.stringify(receiptGaps));
 await stockTab('return');
 const returnGaps=await page.locator('#stock-return-form').evaluate(form=>({
  originalIssue:form.querySelector('.staff-fields').getBoundingClientRect().top-form.querySelector('#stock-original-issue').getBoundingClientRect().bottom,
  returnNoteMargin:parseFloat(getComputedStyle(form.querySelector('.stock-card-stack>.card>.preview-form-field:last-child')).marginTop)
 }));
 assert.ok(returnGaps.originalIssue>=16,'Original issue and return fields need separation: '+JSON.stringify(returnGaps));
 assert.ok(returnGaps.returnNoteMargin>=16,'Return notes need section spacing: '+JSON.stringify(returnGaps));
 await stockTab('receive');
 // An invalid visible date must also remain a protected unsaved edit on Cancel.
 const invalidReceiptDate=page.locator('#caffoot-uk-stock-receivedOn');
 await invalidReceiptDate.fill('31/02/2026');
 assert.equal(await page.locator('#stock-receivedOn').inputValue(),'');
 assert.equal(await invalidReceiptDate.getAttribute('aria-invalid'),'true');
 await page.locator('#stock-receipt-form [data-stock-action="cancel-stock"]').click();
 await page.locator('#discard-dialog').waitFor();
 await page.locator('#discard-dialog [data-action="discard-device-form-changes"]').click();
 assert.equal(await page.locator('#stock-tab-inventory').getAttribute('aria-selected'),'true');
 await stockTab('receive');
 await page.locator('#stock-supplier').fill('Discard this unsaved delivery');
 await page.locator('#stock-receipt-form [data-stock-action="cancel-stock"]').click();
 await page.locator('#discard-dialog').waitFor();
 await page.locator('#discard-dialog [data-action="keep-editing"]').click();
 assert.equal(await page.locator('#stock-supplier').inputValue(),'Discard this unsaved delivery');
 await page.locator('#stock-receipt-form [data-stock-action="cancel-stock"]').click();
 await page.locator('#discard-dialog [data-action="discard-device-form-changes"]').click();
 assert.equal(await page.locator('#stock-tab-inventory').getAttribute('aria-selected'),'true');
 await stockTab('receive');
 await newComputer(16,10,'Fictional Supplier A');
 await page.locator('#caffoot-uk-stock-receivedOn').waitFor();
 assert.match(await page.locator('#stock-receivedOn').inputValue(),/^\d{4}-\d{2}-\d{2}$/);
 assert.match(await page.locator('#caffoot-uk-stock-receivedOn').inputValue(),/^\d{2}\/\d{2}\/\d{4}$/);
 await page.locator('#caffoot-uk-stock-receivedOn').fill('13/11/2026');
 await page.locator('#caffoot-uk-stock-receivedOn').waitFor();
 assert.equal(await page.locator('#caffoot-uk-stock-receivedOn').inputValue(),'13/11/2026');
 await page.locator('#caffoot-uk-stock-receivedOn').fill('14/11/2026');
 assert.equal(await page.locator('#stock-receivedOn').inputValue(),'2026-11-14');
 await page.locator('#caffoot-uk-stock-receivedOn').fill('13/11/2026');
 await page.locator('#stock-notes').fill('First fictional delivery');
 await page.locator('[name="itemsChecked"]').check();
 await page.locator('[name="conditionChecked"]').check();
 await page.locator('#stock-readyQuantity').fill('4');
 assert.equal(await page.locator('[data-stock-summary="awaiting"]').textContent(),'6');
 const first=await save('stock-receipt-form','receive'),computer=first.data.stockItemId;
 const replay=await owner.request.post(address+'/api/it-assets/receive',{headers:{Origin:address,'X-CSRF-Token':session.csrf_token},data:first.payload});
 assert.equal(replay.status(),200);assert.deepEqual(await replay.json(),first.data);
 let item=await current(computer);assert.deepEqual(item.item.balances,{physicallyHeld:10,readyToIssue:4,awaitingChecks:6});
 await stockTab('receive');await page.locator('[data-stock-action="mode-existing"]').click();
 await page.locator('#stock-existing').selectOption(computer);
 await page.locator('#stock-quantity').fill('5');
 await page.locator('#caffoot-uk-stock-receivedOn').fill('14/11/2026');
 await page.locator('#stock-supplier').fill('Fictional Supplier B');
 await page.locator('[name="itemsChecked"]').check();await page.locator('[name="conditionChecked"]').check();
 await page.locator('#stock-readyQuantity').fill('2');
 const second=await save('stock-receipt-form','receive');
 assert.equal(second.data.stockItemId,computer);
 item=await current(computer);assert.deepEqual(item.item.balances,{physicallyHeld:15,readyToIssue:6,awaitingChecks:9});
 assert.deepEqual(item.receipts.map(row=>[row.supplier,row.quantity,row.ready]),[['Fictional Supplier B',5,2],['Fictional Supplier A',10,4]]);
 await newComputer(8,2,'Fictional Supplier C');
 const variant=(await save('stock-receipt-form','receive')).data.stockItemId;assert.notEqual(variant,computer);
 await stockTab('receive');await page.locator('[data-stock-action="mode-new"]').click();
 await page.locator('#stock-category').selectOption('Monitor');
 await page.locator('#stock-trackingMode').selectOption('individual');
 const individualGap=await page.locator('#stock-receipt-form').evaluate(form=>form.querySelector('#stock-individual-fields').getBoundingClientRect().top-form.querySelector('#stock-new-fields').getBoundingClientRect().bottom);
 assert.ok(individualGap>=18,'Individual Equipment heading needs the same subsection spacing: '+individualGap);
 assert.equal(await page.locator('#stock-computer-fields').isVisible(),false);
 assert.equal(await page.locator('#stock-quantity').inputValue(),'1');
 await page.locator('#stock-manufacturer').fill('Fictional Displays');await page.locator('#stock-model').fill('Screen 27');
 await page.locator('#stock-assetTag').fill('LAB-001');
 const monitor=(await save('stock-receipt-form','receive')).data.stockItemId;
 await stockTab('receive');await page.locator('[data-stock-action="mode-existing"]').click();
 await page.locator('#stock-existing').selectOption(monitor);
 await page.locator('#stock-serialNumber').fill('Fictional Serial 002');
 await save('stock-receipt-form','receive');
 assert.equal((await current(monitor)).item.units.length,2);
 await details(computer);
 const readinessActions=page.locator('#stock-readiness-form .stock-form-actions');
 assert.deepEqual((await readinessActions.locator('button').allTextContents()).map(value=>value.trim()),['Cancel','Save Readiness Change']);
 assert.equal(await readinessActions.locator('[type="submit"]').getAttribute('class'),'btn btn-primary');
 assert.equal(await readinessActions.locator('[type="submit"]').evaluate(button=>getComputedStyle(button).backgroundColor),'rgb(237, 133, 50)');
 await page.locator('#stock-reason').fill('Not saved');
 await readinessActions.locator('[data-stock-action="cancel-readiness"]').click();
 await page.locator('#discard-dialog').waitFor();
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('#discard-dialog').count(),0,'Escape in discard confirmation keeps editing');
 assert.equal(await page.locator('#stock-reason').inputValue(),'Not saved');
 await readinessActions.locator('[data-stock-action="cancel-readiness"]').click();
 await page.locator('#discard-dialog [data-action="discard-device-form-changes"]').click();
 assert.equal(await page.locator('#stock-tab-inventory').getAttribute('aria-selected'),'true');
 assert.equal(await page.locator('#stock-readiness-form').count(),0,'Cancelled readiness closes stock details');
 await details(computer);await page.locator('#stock-readyQuantity').fill('10');
 await page.locator('[name="itemsChecked"]').check();await page.locator('[name="conditionChecked"]').check();
 await save('stock-readiness-form','readiness');
 item=await current(computer);assert.deepEqual(item.item.balances,{physicallyHeld:15,readyToIssue:10,awaitingChecks:5});
 await details(computer);await page.locator('#stock-readyQuantity').fill('3');
 assert.equal(await page.locator('#stock-reason').getAttribute('required'),'');
 await page.locator('#stock-reason').fill('Recheck packaging');
 await save('stock-readiness-form','readiness');
 item=await current(computer);assert.deepEqual(item.item.balances,{physicallyHeld:15,readyToIssue:3,awaitingChecks:12});
 assert.equal(item.receipts.length,2);
 await details(computer);await page.locator('#stock-minimumStockLevel').fill('0');
 await save('stock-readiness-form','readiness');assert.equal((await current(computer)).item.minimumStockLevel,0);
 await details(monitor);
 const unit=(await current(monitor)).item.units.find(unit=>unit.assetTag==='LAB-001');
 await page.locator('[name="readyUnitIds"][value="'+unit.id+'"]').check();
 await page.locator('[name="itemsChecked"]').check();await page.locator('[name="conditionChecked"]').check();
 await save('stock-readiness-form','readiness');
 assert.equal((await current(monitor)).item.units.find(value=>value.id===unit.id).ready,true);
 const reader=await browser.newContext({ignoreHTTPSErrors:true});
 const readerSession=await login(reader,'stock-reader','Fictional-Stock-Password-2026!');
 const readerPage=await reader.newPage();await readerPage.goto(address+'/inventory#it-assets');
 await readerPage.locator('#stock-tab-inventory').waitFor();
 // Overview is the approved landing tab, including for read-only stock users.
 await readerPage.locator('[data-stock-action="tab"][data-tab="inventory"]').click();
 await readerPage.locator('[data-stock-action="details"][data-id="'+computer+'"]').last().click();
 await readerPage.locator('#stock-item-details').waitFor();
 assert.equal(await readerPage.locator('#stock-readiness-form').count(),0);
 assert.equal(await readerPage.locator('#stock-tab-receive').count(),0);
 for(const endpoint of ['/api/staff-members','/api/departments','/api/inventory/devices','/api/settings/features']){
  assert.equal((await reader.request.get(address+endpoint)).status(),403);
 }
 assert.equal((await reader.request.post(address+'/api/it-assets/receive',{headers:{Origin:address,'X-CSRF-Token':readerSession.csrf_token},data:first.payload})).status(),403);
 const editor=await browser.newContext({ignoreHTTPSErrors:true});
 const editorSession=await login(editor,'stock-editor','Fictional-Stock-Password-2026!');
 const editorPage=await editor.newPage();await editorPage.goto(address+'/inventory#it-assets');
 // Explicitly enter Receive Stock rather than assuming the former default tab.
 await editorPage.locator('[data-stock-action="tab"][data-tab="receive"]').click();
 await editorPage.locator('#stock-receipt-form').waitFor();
 const latest=await current(computer),extra={operationId:require('node:crypto').randomUUID(),stockItemId:computer,
  configurationKey:latest.item.configurationKey,quantity:1,receivedOn:'2026-11-15',supplier:'Fictional Supplier D',
  checks:{itemsChecked:false,conditionChecked:false},readyQuantity:0};
 const posted=await editor.request.post(address+'/api/it-assets/receive',{headers:{Origin:address,'X-CSRF-Token':editorSession.csrf_token},data:extra});
 assert.equal(posted.status(),200,await posted.text());
 assert.equal((await current(computer)).receipts[0].actor,'stock-editor');
 const preservedStock=python('import sqlite3,sys,json,hashlib;db=sqlite3.connect(sys.argv[1]);print(hashlib.sha256(json.dumps({t:db.execute("SELECT * FROM "+t+" ORDER BY 1").fetchall() for t in ["it_asset_stock_items","it_asset_stock_units","it_asset_stock_movements","it_asset_stock_entries"]},sort_keys=True).encode()).hexdigest())',[database]);
 await settings();page.once('dialog',dialog=>dialog.accept());
 const disabled=page.waitForResponse(r=>r.url().endsWith('/api/settings/features')&&r.request().method()==='POST');
 await page.locator('#optional-feature-it-assets').uncheck({force:true});assert.equal((await disabled).status(),200);
 await page.waitForFunction(()=>document.querySelector('[data-action="tab-it-assets"]')?.hidden===true);
 assert.equal((await owner.request.get(address+'/api/it-assets/stock/'+computer)).status(),403);
 await readerPage.goto(address+'/account');assert.equal(await readerPage.locator('[data-action="tab-it-assets"]').isVisible(),false);
 const reenabling=page.waitForResponse(r=>r.url().endsWith('/api/settings/features')&&r.request().method()==='POST');
 await page.locator('#optional-feature-it-assets').check();assert.equal((await reenabling).status(),200);
 await page.locator('[data-action="tab-it-assets"]').waitFor({state:'visible'});
 await page.locator('[data-action="tab-it-assets"]').click();
 await stockTab('receive');await page.locator('#stock-receipt-form').waitFor();
 const afterStock=python('import sqlite3,sys,json,hashlib;db=sqlite3.connect(sys.argv[1]);print(hashlib.sha256(json.dumps({t:db.execute("SELECT * FROM "+t+" ORDER BY 1").fetchall() for t in ["it_asset_stock_items","it_asset_stock_units","it_asset_stock_movements","it_asset_stock_entries"]},sort_keys=True).encode()).hexdigest())',[database]);
 assert.equal(afterStock,preservedStock);assert.equal(retained(),before);
 for(const [width,height] of [[1440,1050],[390,844]]){
  await page.setViewportSize({width,height});
  for(const theme of ['light','dark']){
   await page.evaluate(theme=>caffootSetTheme(theme),theme);
   for(const view of ['receive','receive-new','inventory','details','individual','history']){
    if(view==='receive-new'){
     await stockTab('receive');
     await page.locator('[data-stock-action="mode-new"]').click();
     await page.locator('#stock-category').selectOption('Desktop');
     await page.locator('#stock-trackingMode').selectOption('quantity');
    }else if(view==='details')await details(computer);
    else if(view==='individual')await details(monitor);
    else await stockTab(view);
    await page.waitForFunction(()=>!document.getElementById('toast')||Number(getComputedStyle(document.getElementById('toast')).opacity)===0);
    await page.evaluate(()=>window.scrollTo(0,0));
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal page overflow');
    const filename='stock-'+view+'-'+theme+'-'+width+'.png';
    await page.screenshot({path:path.join(output,filename),fullPage:true});screens.push(filename);
   }
  }
 }
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(output,'browser-results.json'),JSON.stringify({baseline:'774dee3ecaaf1d50ba94dbf55891aa4b79b853c5',
  source:spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).stdout.trim(),screenshots:screens,pageErrors:errors,
  checks:['Partial Readiness At Receipt','Multiple Suppliers And Dates','Separate Specifications','Optional Individual Identifiers',
   'Later Checks And Reasoned Reversal','Nullable Minimum And Zero','Retry Idempotence','Independent Read/Edit',
   'Feature Off Preserves And Hides Stock','Existing Data And Security Preserved','Responsive Light/Dark']},null,2)+'\n');
 console.log('PASS: complete receipt/inventory/readiness/history flows, independent access, retry and feature-off preservation.');
 console.log('PASS: '+screens.length+' real desktop/mobile light/dark captures; zero page errors and checked page overflow.');
 await reader.close();await editor.close();
}
main().catch(async failure=>{
 fs.writeFileSync(path.join(output,'failure.txt'),String(failure)+'\n'+(fs.existsSync(path.join(temporary,'server.log'))?fs.readFileSync(path.join(temporary,'server.log'),'utf8'):''));
 if(page)await page.screenshot({path:path.join(output,'failure.png'),fullPage:true}).catch(()=>{});
 console.error(failure);process.exitCode=1;
}).finally(async()=>{if(browser)await browser.close();if(server)server.kill();if(log!==undefined)fs.closeSync(log);fs.rmSync(temporary,{recursive:true,force:true});});
