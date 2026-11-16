// Exercise the real stock interface and protected APIs with isolated fictional data.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn,spawnSync}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),temporary=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-device-storage-'));
const output=process.env.CAFFOOT_STORAGE_OUTPUT||path.join(temporary,'evidence');
fs.mkdirSync(output,{recursive:true});
const database=path.join(temporary,'inventory.sqlite3'),address='https://127.0.0.1:8102';
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
 server=spawn('python3',['-c','import backend.server as server; server.PORT=8102; server.main()'],{
  cwd:root,stdio:['ignore',log,log],env:{...process.env,PYTHONDONTWRITEBYTECODE:'1',CAFFOOT_DB_PATH:database,
  CAFFOOT_TLS_DIR:path.join(temporary,'tls'),CAFFOOT_WEB_ADDRESS:address,CAFFOOT_SERVER_ADDRESS:'127.0.0.1',CAFFOOT_HOST:'127.0.0.1',CAFFOOT_PORT:'8102'}});
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
 async function captureChangedScreen(name,selector){
  if(process.env.CAFFOOT_DEVICE_CAPTURE!=='1')return;
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


 async function post(route,data){const response=await owner.request.post(address+route,{headers:{Origin:address,'X-CSRF-Token':session.csrf_token},data});assert.equal(response.status(),200,await response.text());return response.json();}

 await post('/api/devices/create',{record:{id:'fictional-server',name:'Fictional Storage Server',type:'Server - Physical',status:'Maintenance',mountType:'Desktop',face:'front',rackId:'',rackUStart:null,rackUEnd:null,rackUHeight:null,location:'Unknown',primaryIp:'',manufacturer:'Dell',model:'PowerEdge',serialNumber:'',typeDetails:{raid:'Legacy RAID Choice',storage:'12',storageUnit:'TB',driveCount:'8',storageType:'Legacy Storage Medium'}}});
 await page.goto(address+'/inventory');
 await page.locator('#sidebar [data-action="tab-devices"]').click();
 async function open(id){await page.evaluate(id=>openDeviceModal(id),id);await page.locator('#device-editor-form').waitFor({state:'visible'});}
 async function close(){await page.evaluate(()=>closeModal(true));await page.locator('#device-editor-form').waitFor({state:'hidden'});}
 async function save(){const saved=page.waitForResponse(r=>r.url().endsWith('/api/devices/edit/save')&&r.request().method()==='POST');await page.locator('.device-review-footer [type="submit"]').click();const response=await saved;assert.equal(response.status(),200,await response.text());await page.locator('#device-editor-form').waitFor({state:'hidden'});}
 async function record(){return (await (await owner.request.get(address+'/api/inventory/state')).json()).devices.find(device=>device.id==='fictional-server');}
 await open('fictional-server');await page.locator('#device-form-tab-hardware').click();
 assert.equal(await page.locator('[data-device-detail-field="storageType"]').inputValue(),'Legacy Storage Medium');
 assert.equal(await page.locator('[data-device-detail-field="raid"]').inputValue(),'Legacy RAID Choice');
 await page.locator('[data-device-detail-field="storageType"]').selectOption('NVMe SSD');
 await page.locator('[data-server-boot-enabled]').check();
 await page.locator('[data-server-storage-field="boot-driveType"]').selectOption('SATA SSD');
 await page.locator('[data-server-storage-field="boot-driveCount"]').fill('2');
 await page.locator('[data-server-storage-field="boot-capacity"]').fill('500');
 await page.locator('[data-server-storage-field="boot-unit"]').selectOption('GB');
 await page.locator('[data-server-storage-field="boot-configuration"]').selectOption('Mirror');
 await captureChangedScreen('server-independent-boot','#server-storage-controls');
 await save();
 let device=await record();assert.equal(device.typeDetails.bootStorage.source,'independent');assert.equal(device.typeDetails.raid,'Legacy RAID Choice');assert.equal(device.typeDetails.storage,'12');assert.equal(device.status,'Maintenance');
 await open('fictional-server');await page.locator('#device-form-tab-hardware').click();
 await page.locator('[data-action="server-storage-action"][data-operation="add-pool"]').click();
 await page.locator('[data-server-storage-field^="pool-"]').fill('Fictional Boot Pool');
 await page.locator('[data-server-storage-field$="-layout"]').selectOption('Mirror');
 await page.locator('[data-server-storage-field^="vdev-"][data-server-storage-field$="-driveCount"]').fill('2');
 await page.locator('[data-server-storage-field^="vdev-"][data-server-storage-field$="-capacity"]').fill('500');
 await page.locator('[data-server-storage-field^="vdev-"][data-server-storage-field$="-unit"]').selectOption('GB');
 await page.locator('[data-server-storage-field^="vdev-"][data-server-storage-field$="-driveType"]').selectOption('SATA SSD');
 await page.locator('[data-server-storage-field="boot-source"]').selectOption('pool');
 await page.locator('[data-server-storage-field="boot-poolId"]').selectOption({label:'Fictional Boot Pool'});
 await captureChangedScreen('server-zfs-boot-pool','[data-server-storage-field="boot-poolId"]');
 await captureChangedScreen('server-zfs-vdev','[data-server-storage-field$="-layout"]');
 await save();device=await record();
 assert.deepEqual(Object.keys(device.typeDetails.bootStorage).sort(),['poolId','source']);
 assert.equal(device.typeDetails.zfsPools.length,1);assert.equal(device.typeDetails.zfsPools[0].vdevs.length,1);
 assert.equal(device.typeDetails.storage,'12');assert.equal(device.typeDetails.raid,'Legacy RAID Choice');
 await page.evaluate(()=>openDeviceDetailView('fictional-server'));
 assert.match(await page.locator('.device-details-dialog').textContent(),/Fictional Boot Pool/);
 await captureChangedScreen('server-storage-details','.device-details-dialog');
 await page.evaluate(()=>closeModal(true));
 await open(null);await page.locator('#dev-type').selectOption('Laptop');await page.locator('#device-form-tab-hardware').click();
 assert.equal(await page.locator('[data-device-detail-field="storageType"]').count(),1);assert.equal(await page.locator('#server-storage-controls').count(),0);await captureChangedScreen('laptop-storage-type','[data-device-detail-field="storageType"]');await close();
 const expected={UPS:['APC (Schneider Electric)','Eaton','Vertiv','CyberPower','Riello UPS','Socomec','Ubiquiti'],PDU:['APC (Schneider Electric)','Eaton','Vertiv','CyberPower','Raritan','Server Technology','ATEN','Ubiquiti']};
 for(const type of ['UPS','PDU']){
  await open(null);await page.locator('#dev-type').selectOption(type);
  const makers=await page.locator('#dev-manufacturer-select option').allTextContents();
  for(const manufacturer of expected[type])assert.ok(makers.includes(manufacturer),type+' '+manufacturer);
  assert.equal(makers.filter(maker=>maker==='Ubiquiti').length,1);
  await close();
 }
 const custom=[{id:'fictional-ups-maker',type:'UPS',manufacturer:'Fictional Custom UPS',model:'Fictional Model'}];
 const preferences={'maker:ubiquiti':{label:'Ubiquiti',hidden:true}};
 await post('/api/inventory/settings/save',{key:'hardwareCatalogue',value:custom});
 await post('/api/inventory/settings/save',{key:'hardwareSeedPreferences',value:preferences});
 await page.reload();await page.locator('#sidebar [data-action="tab-devices"]').click();await open(null);await page.locator('#dev-type').selectOption('UPS');
 const customMakers=await page.locator('#dev-manufacturer-select option').allTextContents();
 assert.ok(customMakers.includes('Fictional Custom UPS'));assert.ok(!customMakers.includes('Ubiquiti'));
 await close();
 const preserved=await (await owner.request.get(address+'/api/inventory/state')).json();
 assert.deepEqual(preserved.settings.hardwareCatalogue,custom);assert.deepEqual(preserved.settings.hardwareSeedPreferences,preferences);
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(output,'browser-results.json'),JSON.stringify({checks:['Legacy Storage Type','Conventional RAID Preserved','Ordinary Boot Storage Without ZFS','Pool VDEV Persistence','Existing Boot Pool Link Without Duplicate Drives','Laptop Applicability','UPS/PDU Ubiquiti Suggestions'],pageErrors:errors,screenshots:screens,source:spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).stdout.trim()},null,2));
 console.log('PASS: Storage Type, ordinary boot, ZFS/VDEV link, legacy fields and UPS/PDU suggestions.');
}
main().catch(async failure=>{
 fs.writeFileSync(path.join(output,'failure.txt'),String(failure)+'\n'+(fs.existsSync(path.join(temporary,'server.log'))?fs.readFileSync(path.join(temporary,'server.log'),'utf8'):''));
 if(page)await page.screenshot({path:path.join(output,'failure.png'),fullPage:true}).catch(()=>{});
 console.error(failure);process.exitCode=1;
}).finally(async()=>{if(browser)await browser.close();if(server)server.kill();if(log!==undefined)fs.closeSync(log);fs.rmSync(temporary,{recursive:true,force:true});});
