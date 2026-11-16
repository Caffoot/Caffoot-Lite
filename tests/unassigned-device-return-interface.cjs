// Confirm a real unassigned Device return through the existing screens and controls.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn,spawnSync}=require('node:child_process'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),temporary=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-unassigned-return-'));
const output=process.env.CAFFOOT_UNASSIGNED_RETURN_OUTPUT||path.join(temporary,'evidence'),capture=process.env.CAFFOOT_UNASSIGNED_RETURN_CAPTURE==='1';
fs.mkdirSync(output,{recursive:true});
const database=path.join(temporary,'inventory.sqlite3'),address='https://127.0.0.1:8110';
let browser,server,page;
function python(code,args=[]){const result=spawnSync('python3',['-c',code,...args],{cwd:root,encoding:'utf8',env:{...process.env,PYTHONDONTWRITEBYTECODE:'1',PYTHONPATH:'tests:.'}});assert.equal(result.status,0,result.stderr);return result.stdout.trim();}
function snapshot(){return python('import sqlite3,sys,json;db=sqlite3.connect(sys.argv[1]);print(json.dumps({t:db.execute("SELECT * FROM "+t+" ORDER BY 1").fetchall() for t in ["inventory_devices","inventory_subnets","inventory_vlans","inventory_racks","inventory_rack_accessories","inventory_ip_allocations","accounts","roles","role_grants","account_roles","account_permission_overrides","device_assignments"]},sort_keys=True))',[database]);}
async function main(){
 const seeded=spawnSync('python3',['tests/visual_fixtures.py',temporary],{cwd:root,encoding:'utf8'});assert.equal(seeded.status,0,seeded.stderr);
 const credentials=JSON.parse(fs.readFileSync(path.join(temporary,'test-credentials.json')));
 python('import sqlite3,sys;from backend.permissions import create_user;db=sqlite3.connect(sys.argv[1]);identity=create_user(db,1,"return-devices-only","Fictional-Return-Password-2026!");db.execute("UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?",(sys.argv[2],identity));db.execute("INSERT INTO account_permission_overrides VALUES(?,?,?)",(identity,"Devices","edit"));db.commit()',[database,credentials.secret]);
 const log=fs.openSync(path.join(temporary,'server.log'),'w');
 server=spawn('python3',['-c','import backend.server as server;server.PORT=8110;server.main()'],{cwd:root,stdio:['ignore',log,log],env:{...process.env,PYTHONDONTWRITEBYTECODE:'1',CAFFOOT_DB_PATH:database,CAFFOOT_TLS_DIR:path.join(temporary,'tls'),CAFFOOT_WEB_ADDRESS:address,CAFFOOT_SERVER_ADDRESS:'127.0.0.1',CAFFOOT_HOST:'127.0.0.1'}});
 browser=await chromium.launch({headless:true,executablePath:process.env.CAFFOOT_CHROMIUM_PATH||undefined});
 const owner=await browser.newContext({ignoreHTTPSErrors:true,locale:'en-GB',viewport:{width:1440,height:1050}});
 for(let attempt=0;attempt<60;attempt++){try{if((await owner.request.get(address+'/health',{timeout:750})).ok())break;}catch{}await new Promise(resolve=>setTimeout(resolve,150));}
 const code=()=>python('import sys,time;from backend.mfa import code_at;print(code_at(sys.argv[1],time.time()))',[credentials.secret]);
 async function login(context,username,password){const response=await context.request.post(address+'/api/login',{headers:{Origin:address},data:{username,password,mfa_code:code()}});assert.equal(response.status(),200,await response.text());return (await context.request.get(address+'/api/session')).json();}
 const session=await login(owner,credentials.username,credentials.password);
 async function post(route,data){const response=await owner.request.post(address+route,{headers:{Origin:address,'X-CSRF-Token':session.csrf_token},data});return response;}
 async function stock(){const response=await owner.request.get(address+'/api/it-assets/stock');assert.equal(response.status(),200,await response.text());return response.json();}
 assert.equal((await post('/api/settings/features',{feature:'it_assets',enabled:true})).status(),200);
 const directRecord={id:'direct-return-device',name:'Fictional Direct Device',type:'Laptop',status:'Active',primaryIp:'',typeDetails:{},mountType:'Desktop',notes:'PRIVATE DIRECT DEVICE NOTE'};
 assert.equal((await post('/api/devices/create',{record:directRecord})).status(),200);
 const original=snapshot(),serverId='visual-device-0';
 const initial=await stock(),selected=initial.deviceChoices.find(item=>item.deviceId===serverId);
 assert.equal(selected.category,'Server - Physical');assert.equal(selected.canReturnUnassigned,true);
 assert.equal(initial.registeredDevices.length,0);assert.equal(initial.movements.length,0);
 assert.ok(initial.deviceChoices.find(item=>item.deviceId===directRecord.id).canReturnUnassigned);
 const errors=[],screens=[];page=await owner.newPage();page.on('pageerror',failure=>errors.push(String(failure)));
 let submitted;page.on('request',request=>{if(request.url()===address+'/api/it-assets/return'&&request.method()==='POST')submitted=request.postDataJSON();});
 async function deviceDetails(target,id){
  const close=target.locator('.device-review-footer [data-action="close-modal"]');if(await close.isVisible())await close.click();
  await target.locator('#sidebar [data-tab="devices"]').click();
  await target.locator('[data-action="select-device-section"][data-tab="inventory"]').click();
  await target.locator('[data-action="view-device"][data-id="'+id+'"]').first().click();
  await target.locator('#device-details-tab-assigned').click();
  await target.locator('#device-details-panel-assigned .assignment-main strong').waitFor();
 }
 async function captures(name,setup){if(!capture)return;for(const [width,height] of [[1440,1050],[390,844]])for(const theme of ['light','dark']){
  await page.setViewportSize({width,height});await page.evaluate(theme=>caffootSetTheme(theme),theme);await setup();
  await page.waitForFunction(()=>!document.getElementById('toast')||Number(getComputedStyle(document.getElementById('toast')).opacity)===0);
  await page.evaluate(()=>scrollTo(0,0));assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal document overflow');
  const filename=name+'-'+theme+'-'+width+'.png';await page.screenshot({path:path.join(output,filename),fullPage:true});screens.push(filename);
 }await page.setViewportSize({width:1440,height:1050});await page.evaluate(()=>caffootSetTheme('light'));await setup();}
 await page.goto(address+'/inventory');
 const unassignedDetails=()=>deviceDetails(page,serverId);
 await unassignedDetails();assert.equal(await page.locator('#device-details-panel-assigned .assignment-main strong').innerText(),'Unassigned');
 await page.locator('[data-equipment-action="return-device-stock"]').waitFor();await captures('device-details-unassigned',unassignedDetails);
 async function returnForm(){
  await deviceDetails(page,serverId);await page.locator('[data-equipment-action="return-device-stock"]').click();
  await page.locator('#stock-return-form').waitFor();await page.waitForFunction(()=>document.getElementById('stock-returnSource')?.value==='unassigned-device:visual-device-0');
 }
 await returnForm();
 assert.equal(await page.locator('#stock-returnSource').isDisabled(),true);assert.equal(await page.locator('#stock-returnSource option').count(),1);
 assert.equal(await page.locator('#stock-quantityReturned').inputValue(),'1');assert.equal(await page.locator('#stock-quantityReturned').getAttribute('readonly'),'');
 assert.equal(await page.locator('#stock-readyReturnQuantity').isDisabled(),true);assert.equal(await page.locator('#stock-writeOffReturnQuantity').isDisabled(),true);
 assert.equal(await page.locator('#stock-return-form [name="cleanedWorking"]').isDisabled(),true);
 assert.match(await page.locator('#stock-physical-return-confirmation').innerText(),/physically returned to stock/);
 assert.ok(!(await page.locator('#stock-original-issue').innerText()).includes('Outstanding'));
 assert.ok(await page.locator('#stock-return-form [type="submit"]').isEnabled());
 assert.equal((await stock()).registeredDevices.length,0);assert.equal(submitted,undefined,'Opening a form cannot affirm physical return');
 await captures('return-unassigned-device',returnForm);await returnForm();
 const responsePromise=page.waitForResponse(response=>response.url()===address+'/api/it-assets/return'&&response.request().method()==='POST');
 await page.locator('#stock-return-form [type="submit"]').click();const response=await responsePromise;assert.equal(response.status(),200,await response.text());
 await page.waitForFunction(()=>document.getElementById('stock-tab-inventory')?.getAttribute('aria-selected')==='true');
 assert.equal(submitted.deviceId,serverId);assert.equal(submitted.physicalReturnConfirmed,true);assert.equal(submitted.quantityReturned,1);assert.equal(submitted.readyQuantity,0);
 assert.equal('issueEntryId' in submitted,false);assert.equal('deviceAssignmentId' in submitted,false);
 const result=await stock(),held=result.registeredDevices.find(item=>item.deviceId===serverId);
 assert.deepEqual(held.states,{awaiting_preparation:1});assert.equal(result.receipts.length,0);assert.equal(result.issues.length,0);assert.equal(result.movements.length,1);
 assert.equal(result.movements[0].physicalReturnConfirmed,true);assert.equal(result.movements[0].recipientLabel,null);
 assert.equal(snapshot(),original,'Actual Device, network, Rack, account, role and assignment records must remain identical');
 assert.equal((await post('/api/it-assets/return',{...submitted,operationId:crypto.randomUUID()})).status(),409);
 async function returnedDetails(){await deviceDetails(page,serverId);await page.locator('#device-details-panel-assigned').getByText('Equipment Returned',{exact:false}).waitFor();}
 await returnedDetails();assert.equal(await page.locator('[data-equipment-action="return-device-stock"]').count(),0);await captures('device-details-return-recorded',returnedDetails);
 async function movementHistory(){const close=page.locator('.device-review-footer [data-action="close-modal"]');if(await close.isVisible())await close.click();await page.locator('#sidebar [data-tab="it-assets"]').click();await page.locator('[data-stock-action="tab"][data-tab="movements"]').click();await page.locator('#main-content summary').filter({hasText:'Movement Details'}).first().click();}
 await movementHistory();assert.match(await page.locator('#main-content').innerText(),/Physical Return Confirmed/);await captures('physical-return-provenance',movementHistory);
 const devicesOnly=await browser.newContext({ignoreHTTPSErrors:true,locale:'en-GB'});const restricted=await login(devicesOnly,'return-devices-only','Fictional-Return-Password-2026!');
 assert.equal((await devicesOnly.request.post(address+'/api/it-assets/return',{headers:{Origin:address,'X-CSRF-Token':restricted.csrf_token},data:submitted})).status(),403);
 assert.equal((await post('/api/settings/features',{feature:'it_assets',enabled:false,confirmDisable:true})).status(),200);
 await page.reload();await deviceDetails(page,directRecord.id);assert.equal(await page.locator('[data-equipment-action="return-device-stock"]').count(),0);assert.equal(await page.locator('[data-equipment-action="assign-device"]').count(),1);
 assert.equal((await owner.request.get(address+'/api/it-assets/stock')).status(),403);
 assert.equal(snapshot(),original,'Feature-off must preserve the Device, security and assignment records');assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(output,'browser-results.json'),JSON.stringify({baseline:'f4ac367984b68f81eb9566d7d8d057b6a26bc5fb',source:spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).stdout.trim(),screenshots:screens,pageErrors:errors,checks:['Existing Device Details Entry','Preselected Single Canonical Device','No Automatic Physical Confirmation','Explicit Record Return Provenance','Awaiting Preparation Only','Duplicate Rejection','Original Configuration And Security Retained','Immutable History Without Invented Holder','Device Only Feature Off Preserved']},null,2)+'\n');
 console.log('PASS: explicit unassigned canonical Device return, provenance, preparation state, duplicate rejection and unchanged Devices-only operation.');console.log('PASS: '+screens.length+' genuine captures; no page errors or document overflow.');
}
main().catch(async failure=>{fs.writeFileSync(path.join(output,'failure.txt'),String(failure)+'\n'+(fs.existsSync(path.join(temporary,'server.log'))?fs.readFileSync(path.join(temporary,'server.log'),'utf8'):''));if(page)await page.screenshot({path:path.join(output,'failure.png'),fullPage:true}).catch(()=>{});console.error(failure);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();if(server){server.kill('SIGTERM');await new Promise(resolve=>server.once('exit',resolve));}});
