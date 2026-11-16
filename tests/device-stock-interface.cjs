// Exercise the real stock interface and protected APIs with isolated fictional data.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn,spawnSync}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),temporary=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-device-stock-'));
const output=process.env.CAFFOOT_DEVICE_STOCK_OUTPUT||path.join(temporary,'evidence');
fs.mkdirSync(output,{recursive:true});
const database=path.join(temporary,'inventory.sqlite3'),address='https://127.0.0.1:8101';
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
  ' db.execute("UPDATE inventory_devices SET record_json=? WHERE id=\'retained-device\'",(json.dumps(dict(id=\'retained-device\',name=\'Retained Laptop\',type=\'Laptop\',status=\'Active\',mountType=\'Desktop\',location=\'Unknown\',primaryIp=\'\')),))',
  ' db.execute("UPDATE organisation_features SET enabled=1 WHERE feature IN (\'devices\',\'it_assets\')")',
  ' db.commit();print(json.dumps(dict(secret=secret)))'
 ].join('\n'),[database]));
 log=fs.openSync(path.join(temporary,'server.log'),'w');
 server=spawn('python3',['-c','import backend.server as server; server.PORT=8101; server.main()'],{
  cwd:root,stdio:['ignore',log,log],env:{...process.env,PYTHONDONTWRITEBYTECODE:'1',CAFFOOT_DB_PATH:database,
  CAFFOOT_TLS_DIR:path.join(temporary,'tls'),CAFFOOT_WEB_ADDRESS:address,CAFFOOT_SERVER_ADDRESS:'127.0.0.1',CAFFOOT_HOST:'127.0.0.1',CAFFOOT_PORT:'8101'}});
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
 page=await owner.newPage();const errors=[],screens=[];page.setDefaultTimeout(10000);
 page.on('pageerror',failure=>errors.push(String(failure)));

 async function post(route,data){const response=await owner.request.post(address+route,{headers:{Origin:address,'X-CSRF-Token':session.csrf_token},data});assert.equal(response.status(),200,await response.text());return response.json();}
 const receipt=await post('/api/it-assets/receive',{operationId:crypto.randomUUID(),quantity:10,readyQuantity:10,receivedOn:'2026-11-16',supplier:'Fictional Supplier',notes:'',checks:{itemsChecked:true,conditionChecked:true},item:{category:'Desktop',trackingMode:'quantity',manufacturer:'Dell',model:'OptiPlex',sharedSpecifications:{processor:'Fictional CPU',memory:16,memoryUnit:'GB',storage:512,storageUnit:'GB',storageMedium:'NVMe SSD'}}});
 const item=async()=> (await (await owner.request.get(address+'/api/it-assets/stock/'+receipt.stockItemId)).json()).item;
 await page.goto(address+'/inventory');
 await page.locator('[data-action="tab-devices"]').click();
 await page.locator('[data-action="open-device-modal"]').first().click();
 await page.locator('#device-get-from-stock').click();
 await page.locator('#device-stock-source option[value="'+receipt.stockItemId+'"]').waitFor({state:'attached'});
 await page.locator('#device-stock-source').selectOption(receipt.stockItemId);
 assert.equal(await page.locator('#dev-name').inputValue(),'');
 assert.equal(await page.locator('#dev-serial').inputValue(),'');
 assert.equal(await page.locator('#dev-type').inputValue(),'Desktop');
 assert.equal(await page.locator('#dev-manufacturer').inputValue(),'Dell');
 assert.equal(await page.locator('#dev-model').inputValue(),'OptiPlex');
 assert.equal(await page.locator('#dev-ip').inputValue(),'');
 assert.equal((await item()).quantityStateBalances.ready,10);
 await page.locator('#dev-name').fill('Fictional Stock Computer');
 await page.locator('#dev-location').selectOption('Unknown');
 await page.locator('#device-form-tab-hardware').click();
 assert.equal(await page.locator('[data-device-detail-field="memory"]').inputValue(),'16');
 assert.equal(await page.locator('[data-device-detail-field="processor"]').inputValue(),'Fictional CPU');
 await page.locator('#device-form-tab-general').click();
 const responsePromise=page.waitForResponse(r=>r.url().endsWith('/api/it-assets/register-device')&&r.request().method()==='POST');
 await page.locator('.device-review-footer [type="submit"]').click();
 const response=await responsePromise;assert.equal(response.status(),200,await response.text());
 await page.locator('[data-device-form="true"]').waitFor({state:'hidden'});
 assert.equal((await item()).quantityStateBalances.ready,9);
 assert.equal((await item()).balances.physicallyHeld,10);
 await page.locator('[data-action="tab-it-assets"]').click();
 await page.locator('[data-stock-action="tab"][data-tab="inventory"]').click();
 await page.locator('[data-stock-action="details"][data-id="'+receipt.stockItemId+'"]').last().click();
 await page.locator('[data-stock-action="register-device"]').click();
 await page.locator('#device-stock-feedback').filter({hasText:'From Stock:'}).waitFor();
 assert.equal(await page.locator('#dev-name').inputValue(),'');
 assert.equal((await item()).quantityStateBalances.ready,9);
 await page.locator('.device-review-close').click();
 assert.equal((await item()).quantityStateBalances.ready,9);
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(output,'browser-results.json'),JSON.stringify({checks:['Existing Add Device Form','Shared Prefill Only','Atomic Accounting','Stock Entry Point','Cancellation Has No Writes'],pageErrors:errors},null,2));
 console.log('PASS: existing Add Device and stock entry routes, shared prefill, atomic registration and cancellation.');
}
main().catch(async failure=>{
 fs.writeFileSync(path.join(output,'failure.txt'),String(failure)+'\n'+(fs.existsSync(path.join(temporary,'server.log'))?fs.readFileSync(path.join(temporary,'server.log'),'utf8'):''));
 if(page)await page.screenshot({path:path.join(output,'failure.png'),fullPage:true}).catch(()=>{});
 console.error(failure);process.exitCode=1;
}).finally(async()=>{if(browser)await browser.close();if(server)server.kill();if(log!==undefined)fs.closeSync(log);fs.rmSync(temporary,{recursive:true,force:true});});
