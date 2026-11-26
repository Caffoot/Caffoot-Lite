// Exercise real stock circulation, protected equipment views and canonical Device history.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn,spawnSync}=require('node:child_process'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),temporary=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-circulation-'));
const output=process.env.CAFFOOT_CIRCULATION_OUTPUT||path.join(temporary,'evidence'),capture=process.env.CAFFOOT_CIRCULATION_CAPTURE==='1';
fs.mkdirSync(output,{recursive:true});
const database=path.join(temporary,'inventory.sqlite3'),address='https://127.0.0.1:8108';
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
  ' db.execute("INSERT INTO staff_members(id,first_name) VALUES(\'confirmation-recipient\',\'Fictional Confirmation Recipient\')")',
  ' db.execute("INSERT INTO departments(id,name) VALUES(\'confirmation-department\',\'Fictional Confirmation Department\')")',
  ' db.commit();print(json.dumps(result))'
 ].join('\n'),[database,credentials.secret]));
 const log=fs.openSync(path.join(temporary,'server.log'),'w');
 server=spawn('python3',['-c','import backend.server as server;server.PORT=8108;server.main()'],{cwd:root,stdio:['ignore',log,log],env:{...process.env,PYTHONDONTWRITEBYTECODE:'1',CAFFOOT_DB_PATH:database,CAFFOOT_TLS_DIR:path.join(temporary,'tls'),CAFFOOT_WEB_ADDRESS:address,CAFFOOT_SERVER_ADDRESS:'127.0.0.1',CAFFOOT_HOST:'127.0.0.1'}});
 browser=await chromium.launch({headless:true,executablePath:process.env.CAFFOOT_CHROMIUM_PATH||undefined});
 const owner=await browser.newContext({ignoreHTTPSErrors:true,locale:'en-GB',viewport:{width:1440,height:1050}});
 for(let attempt=0;attempt<60;attempt++){try{if((await owner.request.get(address+'/health',{timeout:750})).ok())break;}catch{}await new Promise(resolve=>setTimeout(resolve,150));}
 const code=()=>python('import sys,time;from backend.mfa import code_at;print(code_at(sys.argv[1],time.time()))',[credentials.secret]);
 async function login(context,username,password){const response=await context.request.post(address+'/api/login',{headers:{Origin:address},data:{username,password,mfa_code:code()}});assert.equal(response.status(),200,await response.text());return (await context.request.get(address+'/api/session')).json();}
 const session=await login(owner,credentials.username,credentials.password);
 async function post(context,session,route,data){const response=await context.request.post(address+route,{headers:{Origin:address,'X-CSRF-Token':session.csrf_token},data});assert.equal(response.status(),200,await response.text());return response.json();}
 async function stock(context=owner){const response=await context.request.get(address+'/api/it-assets/stock');assert.equal(response.status(),200,await response.text());return response.json();}
 await post(owner,session,'/api/settings/features',{feature:'it_assets',enabled:true});
 async function receive(category,model,quantity,individual=false){return (await post(owner,session,'/api/it-assets/receive',{operationId:crypto.randomUUID(),item:{category,trackingMode:individual?'individual':'quantity',manufacturer:'Fictional Equipment',model,sharedSpecifications:{}},quantity,receivedOn:'2026-11-15',readyQuantity:quantity,checks:{itemsChecked:true,conditionChecked:true},supplier:'Fictional Reseller',notes:'Fictional browser test receipt',...(individual?{serialNumber:'',assetTag:'LAB-MON-01'}:{})})).stockItemId;}
 const mouse=await receive('Mouse','Mouse',10),dock=await receive('Docking Station','Dock',8),monitor=await receive('Monitor','Monitor',1,true);
 const unit=(await stock()).items.find(item=>item.id===monitor).units[0].id;
 for(const [id,type,kind,recipient] of [['circulation-laptop','Laptop','staff',employee.staff],['circulation-desktop','Desktop','department','circulation-department']]){
  await post(owner,session,'/api/devices/create',{record:{id,name:'Fictional '+type,type,status:'Active',primaryIp:'',typeDetails:{},mountType:'Desktop',notes:'PRIVATE DEVICE NOTES'}});
  await post(owner,session,'/api/equipment/assignments',{recipientKind:kind,recipientId:recipient,devices:[{id,revision:0}]});
 }
 const technician=await browser.newContext({ignoreHTTPSErrors:true,locale:'en-GB',viewport:{width:1440,height:1050}});
 const reader=await browser.newContext({ignoreHTTPSErrors:true,locale:'en-GB',viewport:{width:1440,height:1050}});
 const staff=await browser.newContext({ignoreHTTPSErrors:true,locale:'en-GB',viewport:{width:1440,height:1050}});
 const technicianSession=await login(technician,'circulation-technician','Fictional-Account-Password-2026!');
 await login(reader,'circulation-reader','Fictional-Account-Password-2026!');await login(staff,'circulation-employee','Fictional-Account-Password-2026!');
 const errors=[],screens=[];page=await technician.newPage();page.on('pageerror',failure=>errors.push(String(failure)));
 await page.goto(address+'/inventory#it-assets');await page.locator('#stock-tab-issue').waitFor();
 async function tab(target,selected){await target.locator('[data-stock-action="tab"][data-tab="'+selected+'"]').click();}
 async function save(target,form,route){if(route==='issue'){await target.getByRole('button',{name:'Issue Equipment',exact:true}).click();await target.locator('#stock-issue-confirmation').waitFor();}const pending=target.waitForResponse(response=>response.url()===address+'/api/it-assets/'+route&&response.request().method()==='POST');await target.locator('#'+form+' [type="submit"]:visible').click();const response=await pending;assert.equal(response.status(),200,await response.text());await target.waitForFunction(()=>document.getElementById('stock-tab-inventory')?.getAttribute('aria-selected')==='true');return response.json();}
 async function captures(name,target,setup){if(!capture)return;for(const [width,height] of [[1440,1050],[390,844]])for(const theme of ['light','dark']){await target.setViewportSize({width,height});await target.evaluate(theme=>caffootSetTheme(theme),theme);await setup();await target.waitForFunction(()=>!document.getElementById('toast')||Number(getComputedStyle(document.getElementById('toast')).opacity)===0);await target.evaluate(()=>scrollTo(0,0));assert.ok(await target.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal page overflow');const filename=name+'-'+theme+'-'+width+'.png';await target.screenshot({path:path.join(output,filename),fullPage:true});screens.push(filename);}await target.setViewportSize({width:1440,height:1050});await target.evaluate(()=>caffootSetTheme('light'));await setup();}
 async function issueForm(target,item,kind,recipient,quantity){await tab(target,'issue');await target.locator('#stock-issueItem').selectOption(item);await target.locator('#stock-recipientKind').selectOption(kind);await target.locator('#stock-recipientId option[value="'+recipient+'"]').waitFor({state:'attached'});await target.locator('#stock-recipientId').selectOption(recipient);const choices=target.locator('#stock-issue-unit-choices input');if(await choices.count())await choices.first().check();else await target.locator('#stock-issueQuantity').fill(String(quantity));}
 await require('./stock-issue-confirmation.cjs')({page,owner,session,technician,technicianSession,reader,staff,address,post,stock,issueForm,output,errors});
 if(process.env.CAFFOOT_ISSUE_CONFIRMATION_ONLY==='1')return;
 const retained=fingerprint(),receiptFacts=python('import sqlite3,sys,json;db=sqlite3.connect(sys.argv[1]);print(json.dumps(db.execute("SELECT * FROM it_asset_stock_movements WHERE kind=\'received\' ORDER BY id").fetchall()))',[database]);
 const originalAssignments=JSON.parse(python('import sqlite3,sys,json;db=sqlite3.connect(sys.argv[1]);print(json.dumps(db.execute("SELECT id,device_id,staff_id,department_id,recipient_label,assigned_at,actor_id,actor_label FROM device_assignments ORDER BY id").fetchall()))',[database]));
 await issueForm(page,mouse,'staff',employee.staff,8);
 await page.locator('#stock-issueQuantity').fill('11');assert.ok(await page.locator('#stock-issue-form [type="submit"]').isDisabled());
 await page.locator('#stock-issueQuantity').fill('8');
 await captures('issue-equipment',page,()=>issueForm(page,mouse,'staff',employee.staff,8));
 await save(page,'stock-issue-form','issue');
 assert.equal((await stock(technician)).items.find(item=>item.id===mouse).balances.readyToIssue,2);
 assert.equal((await technician.request.get(address+'/api/staff-members')).status(),403);
 assert.equal((await technician.request.get(address+'/api/inventory/devices')).status(),403);
 const narrow=await (await technician.request.get(address+'/api/it-assets/recipients?query=Fictional')).json();assert.ok(narrow.recipients.every(item=>Object.keys(item).sort().join(',')==='id,kind,label'));
 await issueForm(page,dock,'department','circulation-department',3);await save(page,'stock-issue-form','issue');
 await issueForm(page,monitor,'staff','other-recipient',1);await save(page,'stock-issue-form','issue');
 const personal=await (await staff.request.get(address+'/api/my-equipment')).json();assert.equal(personal.assignedToMe.find(item=>item.equipmentKind==='IT Asset').quantity,8);assert.equal(personal.sharedWithMyDepartment.find(item=>item.equipmentKind==='IT Asset').quantity,3);assert.ok(!JSON.stringify(personal).includes('PRIVATE'));assert.equal((await staff.request.get(address+'/api/it-assets/stock')).status(),403);
 let data=await stock(technician),mouseIssue=data.issues.find(issue=>issue.stockItemId===mouse),dockIssue=data.issues.find(issue=>issue.stockItemId===dock),monitorIssue=data.issues.find(issue=>issue.stockUnitId===unit);
 async function mixedReturn(){await tab(page,'return');await page.locator('#stock-returnSource').selectOption('stock:'+mouseIssue.id);await page.locator('#stock-quantityReturned').fill('5');await page.locator('#stock-readyReturnQuantity').fill('3');await page.locator('#stock-writeOffReturnQuantity').fill('2');await page.locator('#stock-return-form [name="cleanedWorking"]').check();await page.locator('#stock-writeOffReason').fill('Two broken buttons');}
 await mixedReturn();assert.equal(await page.locator('#stock-returnSource').inputValue(),'stock:'+mouseIssue.id);assert.equal(await page.locator('#stock-readyReturnQuantity').inputValue(),'3');await captures('mixed-return',page,mixedReturn);await mixedReturn();assert.ok(await page.locator('#stock-return-form [data-stock-wipe]').isHidden());await save(page,'stock-return-form','return');
 data=await stock(technician);const returnedMouse=data.items.find(item=>item.id===mouse);assert.equal(returnedMouse.balances.physicallyHeld,5);assert.equal(returnedMouse.balances.readyToIssue,5);assert.equal(returnedMouse.stateBalances.writtenOff,2);assert.equal(data.issues.find(issue=>issue.id===mouseIssue.id).outstanding,3);
 await tab(page,'return');await page.locator('#stock-returnSource').selectOption('stock:'+dockIssue.id);await page.locator('#stock-quantityReturned').fill('2');await save(page,'stock-return-form','return');
 async function dockPreparation(){await tab(page,'inventory');await page.locator('[data-stock-action="details"][data-id="'+dock+'"]').last().click();await page.locator('#stock-preparation-form').waitFor();await page.locator('#stock-prepareQuantity').fill('1');await page.locator('#stock-preparation-form [name="cleanedWorking"]').check();}
 await captures('stock-preparation',page,dockPreparation);await dockPreparation();await save(page,'stock-preparation-form','preparation');
 data=await stock(technician);assert.equal(data.items.find(item=>item.id===dock).stateBalances.awaitingPreparation,1);assert.equal(data.items.find(item=>item.id===dock).balances.physicallyHeld,7);
 async function monitorWriteOff(){await tab(page,'writeoff');await page.locator('#stock-writeOffTarget').selectOption('issue:'+monitorIssue.id);await page.locator('#stock-writeOffReason').fill('Display damaged beyond use');}
 await captures('issued-asset-writeoff',page,monitorWriteOff);await monitorWriteOff();await save(page,'stock-writeoff-form','write-off');
 data=await stock(technician);assert.equal(data.items.find(item=>item.id===monitor).units[0].id,unit);assert.equal(data.items.find(item=>item.id===monitor).stateBalances.writtenOff,1);assert.equal(data.movements.filter(event=>event.kind==='returned'&&event.name==='Monitor').length,0);
 const ownerPage=await owner.newPage();ownerPage.on('pageerror',failure=>errors.push(String(failure)));await ownerPage.goto(address+'/inventory#staff');await ownerPage.locator('[data-staff-action="staff-details"][data-id="'+employee.staff+'"]').click();await ownerPage.locator('[data-equipment-action="view-device"][data-id="circulation-laptop"]').click();await ownerPage.locator('#device-details-tab-assigned').click();await ownerPage.locator('[data-equipment-action="return-device-stock"]').click();await ownerPage.locator('#stock-return-form').waitFor();
 const laptopSource=(await stock()).deviceAssignments.find(issue=>issue.deviceId==='circulation-laptop');
 async function laptopReturn(){await tab(ownerPage,'return');await ownerPage.locator('#stock-returnSource').selectOption('device:'+laptopSource.id);}
 await captures('device-return',ownerPage,laptopReturn);await laptopReturn();await save(ownerPage,'stock-return-form','return');
 const laptop=(await stock()).registeredDevices.find(device=>device.deviceId==='circulation-laptop');assert.equal(laptop.states.awaiting_preparation,1);assert.equal(laptop.states.ready||0,0);
 async function laptopPreparation(){await tab(ownerPage,'inventory');await ownerPage.locator('[data-stock-action="registered-details"][data-id="'+laptop.stockUnitId+'"]').last().click();await ownerPage.locator('#stock-preparation-form').waitFor();await ownerPage.locator('#stock-preparation-form [name="cleanedWorking"]').check();}
 await captures('device-preparation',ownerPage,laptopPreparation);await laptopPreparation();
 const prepareActions=ownerPage.locator('#stock-preparation-form .stock-form-actions');
 assert.deepEqual((await prepareActions.locator('button').allTextContents()).map(value=>value.trim()),['Cancel','Mark Ready To Issue']);
 assert.equal(await prepareActions.locator('[type="submit"]').getAttribute('class'),'btn btn-primary');
 assert.equal(await prepareActions.locator('[type="submit"]').evaluate(button=>getComputedStyle(button).backgroundColor),'rgb(237, 133, 50)','Preparation action must use Caffoot orange');
 assert.equal(await prepareActions.evaluate(node=>getComputedStyle(node).justifyContent),'flex-end');
 await prepareActions.locator('[data-stock-action="cancel-stock"]').click();
 await ownerPage.locator('#discard-dialog').waitFor();
 await ownerPage.locator('#discard-dialog [data-action="keep-editing"]').click();
 assert.equal(await ownerPage.locator('#stock-preparation-form [name="cleanedWorking"]').isChecked(),true);
 await prepareActions.locator('[data-stock-action="cancel-stock"]').click();
 await ownerPage.locator('#discard-dialog [data-action="discard-device-form-changes"]').click();
 assert.equal(await ownerPage.locator('#stock-preparation-form').count(),0,'Cancelling preparation returns to Stock Inventory');
 await laptopPreparation();assert.equal(await ownerPage.locator('#stock-preparation-form').evaluate(form=>form.checkValidity()),false);await ownerPage.locator('#stock-preparation-form [name="dataPreparationConfirmed"]').check();await save(ownerPage,'stock-preparation-form','preparation');
 assert.equal((await stock()).registeredDevices.find(device=>device.deviceId==='circulation-laptop').states.ready,1);
 async function laptopWriteOff(){await tab(ownerPage,'writeoff');await ownerPage.locator('#stock-writeOffTarget').selectOption('device:circulation-laptop');await ownerPage.locator('#stock-writeOffReason').fill('Damaged after inspection');}
 await captures('held-device-writeoff',ownerPage,laptopWriteOff);await laptopWriteOff();await save(ownerPage,'stock-writeoff-form','write-off');
 async function desktopWriteOff(){await tab(ownerPage,'writeoff');await ownerPage.locator('#stock-writeOffTarget').selectOption('device:circulation-desktop');await ownerPage.locator('#stock-writeOffReason').fill('Device beyond use while assigned');}
 await captures('issued-device-writeoff',ownerPage,desktopWriteOff);await desktopWriteOff();await save(ownerPage,'stock-writeoff-form','write-off');
 data=await stock();assert.equal(data.movements.filter(event=>event.deviceId==='circulation-desktop'&&event.kind==='returned').length,0);assert.equal(data.registeredDevices.find(device=>device.deviceId==='circulation-desktop').states.written_off,1);
 assert.ok(!(await stock(technician)).registeredDevices.length);assert.ok(!(await stock(technician)).movements.some(event=>event.deviceId));
 const readerPage=await reader.newPage();readerPage.on('pageerror',failure=>errors.push(String(failure)));await readerPage.goto(address+'/inventory#it-assets');await readerPage.locator('#stock-tab-inventory').waitFor();assert.equal(await readerPage.locator('#stock-tab-issue,#stock-tab-return,#stock-tab-writeoff').count(),0);
 await captures('stock-inventory',ownerPage,()=>tab(ownerPage,'inventory'));await captures('movement-history',ownerPage,()=>tab(ownerPage,'movements'));
 const staffPage=await staff.newPage();staffPage.on('pageerror',failure=>errors.push(String(failure)));
 async function employeeEquipment(){
  await staffPage.goto(address+'/account');
  await staffPage.getByRole('button',{name:'My Equipment',exact:true}).click();
  await staffPage.locator('[data-personal-equipment]').locator('b').filter({hasText:'Mouse'}).first().waitFor();
 }
 await employeeEquipment();assert.match(await staffPage.locator('[data-personal-equipment]').innerText(),/Quantity: 3/);assert.match(await staffPage.locator('[data-shared-equipment]').innerText(),/Quantity: 1/);assert.ok(!(await staffPage.locator('#main-content').innerText()).includes('PRIVATE'));assert.equal(await staffPage.locator('[data-stock-action]').count(),0);
 await captures('my-equipment',staffPage,employeeEquipment);
 async function staffEquipment(){await ownerPage.locator('[data-action="tab-staff"]').click();if(!await ownerPage.locator('.equipment-staff[data-equipment-staff="'+employee.staff+'"]').count()){const back=ownerPage.locator('[data-staff-action="staff-back"]');if(await back.count())await back.click();await ownerPage.locator('[data-staff-action="staff-details"][data-id="'+employee.staff+'"]').click();}await ownerPage.locator('.equipment-staff').getByText('IT Asset · Quantity: 3',{exact:true}).waitFor();}
 await captures('staff-equipment',ownerPage,staffEquipment);await staffEquipment();await ownerPage.locator('[data-equipment-action="issue-stock-staff"]').click();await ownerPage.locator('#stock-recipientId').waitFor();await ownerPage.waitForFunction(id=>document.getElementById('stock-recipientId')?.value===id,employee.staff);
 async function departmentEquipment(){await ownerPage.locator('[data-action="tab-departments"]').click();const detail=ownerPage.locator('[data-staff-action="department-details"][data-id="circulation-department"]');if(await detail.count())await detail.click();await ownerPage.locator('[data-staff-action="department-tab"][data-tab="equipment"]').click();await ownerPage.locator('#department-panel-equipment').getByText('IT Asset · Quantity: 1',{exact:true}).waitFor();}
 await departmentEquipment();assert.match(await ownerPage.locator('#department-panel-equipment').innerText(),/Device Written Off/);await captures('department-equipment',ownerPage,departmentEquipment);await departmentEquipment();assert.ok(!(await ownerPage.locator('#department-panel-equipment').innerText()).includes('Mouse'));await ownerPage.locator('[data-staff-action="department-issue-stock"]').click();await ownerPage.waitForFunction(()=>document.getElementById('stock-recipientId')?.value==='circulation-department');assert.equal(await ownerPage.locator('#stock-recipientKind').inputValue(),'department');
 const stockBeforeOff=python('import sqlite3,sys,json,hashlib;db=sqlite3.connect(sys.argv[1]);print(hashlib.sha256(json.dumps({t:db.execute("SELECT * FROM "+t+" ORDER BY 1").fetchall() for t in ["it_asset_stock_items","it_asset_stock_units","it_asset_stock_movements","it_asset_stock_entries"]},sort_keys=True).encode()).hexdigest())',[database]);
 await post(owner,session,'/api/settings/features',{feature:'it_assets',enabled:false,confirmDisable:true});assert.equal((await technician.request.get(address+'/api/it-assets/history')).status(),403);const hidden=await (await staff.request.get(address+'/api/my-equipment')).json();assert.ok(!hidden.assignedToMe.some(item=>item.equipmentKind==='IT Asset'));assert.ok(!hidden.sharedWithMyDepartment.some(item=>item.equipmentKind==='IT Asset'));
 await post(owner,session,'/api/settings/features',{feature:'it_assets',enabled:true});
 assert.equal(stockBeforeOff,python('import sqlite3,sys,json,hashlib;db=sqlite3.connect(sys.argv[1]);print(hashlib.sha256(json.dumps({t:db.execute("SELECT * FROM "+t+" ORDER BY 1").fetchall() for t in ["it_asset_stock_items","it_asset_stock_units","it_asset_stock_movements","it_asset_stock_entries"]},sort_keys=True).encode()).hexdigest())',[database]));
 assert.equal(fingerprint(),retained);assert.equal(python('import sqlite3,sys,json;db=sqlite3.connect(sys.argv[1]);print(json.dumps(db.execute("SELECT * FROM it_asset_stock_movements WHERE kind=\'received\' ORDER BY id").fetchall()))',[database]),receiptFacts);
 const retainedAssignments=JSON.parse(python('import sqlite3,sys,json;db=sqlite3.connect(sys.argv[1]);print(json.dumps(db.execute("SELECT id,device_id,staff_id,department_id,recipient_label,assigned_at,actor_id,actor_label FROM device_assignments ORDER BY id").fetchall()))',[database]));assert.deepEqual(retainedAssignments,originalAssignments);
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(output,'browser-results.json'),JSON.stringify({baseline:'7f91f5d42feb3916cfab060abd5ca4b1558a92ba',source:spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).stdout.trim(),screenshots:screens,pageErrors:errors,checks:['Selected Item Ready Limit','Restricted Recipients','Staff And Department Issues','Partial Mixed Return','Later Preparation','Applicable Wipe Checks','Issued And Held Write Off','Canonical Device Closure','Employee Safe Quantities','Independent Permissions','Feature Off Preserves Records','Original Receipts And Security Retained']},null,2)+'\n');
 console.log('PASS: stock issue, mixed/partial return, preparation, write-off, canonical closure, safe projections and feature-off preservation.');console.log('PASS: '+screens.length+' genuine captures; no page errors or checked page overflow.');
}
main().catch(async failure=>{fs.writeFileSync(path.join(output,'failure.txt'),String(failure)+'\n'+(fs.existsSync(path.join(temporary,'server.log'))?fs.readFileSync(path.join(temporary,'server.log'),'utf8'):''));if(page)await page.screenshot({path:path.join(output,'failure.png'),fullPage:true}).catch(()=>{});console.error(failure);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();if(server){server.kill('SIGTERM');await new Promise(resolve=>server.once('exit',resolve));}});
