// Caffoot Lite Next: published browser controls exercised against HTTPS/SQLite.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {spawn,spawnSync}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-next-ui-'));
const address='https://127.0.0.1:8080';
const password='Test-Administrator-Password-2026!';
const logfile=path.join(tmp,'backend.log');
let server,browser;
const temporaryAssetLink=path.join(root,'assets');
const linkCreated=!fs.existsSync(temporaryAssetLink);
if(linkCreated)fs.symlinkSync(path.join(root,'..','assets'),temporaryAssetLink,'dir');
function mfaCode(secret){
  const p=spawnSync('python3',['-c',
    'from backend.mfa import code_at; import sys,time; print(code_at(sys.argv[1],time.time()))',secret],
    {cwd:root,encoding:'utf8'});
  if(p.status!==0)throw Error(p.stderr);
  return p.stdout.trim();
}
async function state(page){
  return page.evaluate(async()=>{
    const r=await fetch('/api/inventory/state',{cache:'no-store'});
    if(!r.ok)throw Error('SQLite inventory unavailable: '+r.status);
    return r.json();
  });
}
async function persisted(page,test,label){
  for(let i=0;i<45;i++){
    const value=await state(page);
    if(test(value))return value;
    await page.waitForTimeout(200);
  }
  throw Error(label+' not saved centrally; toast: '+await page.locator('#toast-message').textContent());
}
async function modal(page,name){
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));
  await page.evaluate(name=>{
    if(typeof window[name]!=='function')throw Error('Missing published modal '+name);
    window[name]();
  },name);
}
async function run(){
  const log=fs.openSync(logfile,'w');
  server=spawn('python3',['-m','backend.server'],{
    cwd:root,stdio:['ignore',log,log],
    env:{...process.env,CAFFOOT_DB_PATH:path.join(tmp,'inventory.sqlite3'),
      CAFFOOT_TLS_DIR:path.join(tmp,'tls'),CAFFOOT_WEB_ADDRESS:address,
      CAFFOOT_SERVER_ADDRESS:'127.0.0.1',CAFFOOT_PORT:'8080',CAFFOOT_HOST:'127.0.0.1'}
  });
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:950}});
  const page=await context.newPage();
  page.setDefaultTimeout(12000);
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  let online=false;
  for(let i=0;i<60;i++){
    if(server.exitCode!==null)throw Error('Server exited: '+fs.readFileSync(logfile,'utf8'));
    try{const r=await context.request.get(address+'/health',{timeout:1000});if(r.ok()){online=true;break}}
    catch(_){}
    await page.waitForTimeout(250);
  }
  assert.ok(online,'HTTPS server failed to start');
  console.log('HTTPS and SQLite startup passed');
  await page.goto(address+'/setup');
  await page.waitForFunction(()=>document.querySelector('#intro')?.textContent.includes('Create the first administrator'));
  await page.locator('#username').fill('owner');
  await page.locator('#password').fill(password);
  await page.locator('#submit').click();
  await page.locator('#enrolment:not([hidden])').waitFor();
  const secret=(await page.locator('#secret').textContent()).trim();
  assert.ok(secret.length>=16,'MFA enrolment secret missing');
  await page.locator('#code').fill(mfaCode(secret));
  await page.locator('#submit').click();
  await page.getByText('MFA enrolled. Sign in to continue.').waitFor();
  await page.locator('#code').fill(mfaCode(secret));
  await page.locator('#submit').click();
  await page.locator('#signed-in:not([hidden])').waitFor();
  console.log('First administrator, MFA and sign-in passed');
  await page.goto(address+'/inventory');
  await page.getByRole('button',{name:'Refresh inventory'}).waitFor();
  assert.equal((await state(page)).sections.Devices,true);
  console.log('Authenticated central inventory rendered');

  await modal(page,'openSubnetModal');
  await page.locator('#sub-cidr').fill('10.64.20.0/24');
  await page.locator('#sub-name').fill('Browser Network');
  await page.locator('#sub-vlan').fill('17');
  await page.locator('#sub-gw').fill('10.64.20.1');
  await page.locator('form[data-form-action="subnet"] button[type="submit"]').click();
  const sub=await persisted(page,s=>s.subnets.some(x=>x.name==='Browser Network'),'Subnet');
  assert.equal(sub.vlans.length,1);
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));
  console.log('Subnet and linked VLAN form passed');

  await modal(page,'openRackModal');
  await page.locator('#rack-name').fill('Browser Rack');
  await page.locator('form[data-form-action="rack"] button[type="submit"]').click();
  await persisted(page,s=>s.racks.some(x=>x.name==='Browser Rack'),'Rack');
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));
  console.log('Rack form passed');

  await modal(page,'openManageLocationsModal');
  await page.locator('#device-catalogue-new-entry-input').fill('Office');
  await page.locator('[data-action="add-device-type-or-location"][data-kind="location"]').click();
  await persisted(page,s=>s.settings.deviceLocations?.includes('Office'),'Location');
  await page.waitForFunction(()=>document.getElementById('toast-message')?.textContent.includes('Location added successfully.'));
  await page.evaluate(()=>closeModal(true));
  console.log('Managed location add passed');

  await modal(page,'openDeviceModal');
  await page.locator('#dev-name').fill('browser-device');
  await page.locator('#dev-type').selectOption('Desktop');
  await page.locator('#dev-mount-type').selectOption('Tabletop / Shelf Mounted');
  await page.locator('#dev-location').selectOption('Office');
  await page.getByRole('tab',{name:'Networking'}).click();
  await page.locator('#dev-block').selectOption('__unassigned__');
  await page.locator('#dev-vlan').selectOption('17');
  const options=await page.locator('#dev-subnet option').evaluateAll(nodes=>nodes.map(x=>({id:x.value,label:x.textContent})));
  const selected=options.find(x=>x.label.includes('10.64.20.0/24'));
  assert.ok(selected,'Subnet cascade failed to show published network');
  await page.locator('#dev-subnet').selectOption(selected.id);
  await page.locator('#dev-ip').fill('10.64.20.10');
  await page.locator('form[data-device-form="true"] button[type="submit"]').click();
  const saved=await persisted(page,s=>s.devices.some(d=>d.name==='browser-device'),'Device');
  const device=saved.devices.find(d=>d.name==='browser-device');
  assert.equal(saved.ipAllocations['10.64.20.10'].deviceId,device.id);
  console.log('Device form and primary IPAM allocation passed');

  await modal(page,'openManageLocationsModal');
  await page.locator('[data-action="rename-device-catalogue-entry"][data-kind="location"][data-name="Office"]').click();
  await page.locator('#device-catalogue-rename-value').fill('Workshop');
  await page.locator('[data-action="save-rename"][data-kind="location"]').click();
  await persisted(page,s=>s.devices.some(d=>d.id===device.id&&d.location==='Workshop'),'Location rename');
  await page.reload();
  await page.getByRole('button',{name:'Refresh inventory'}).waitFor();
  assert.equal((await state(page)).devices.find(d=>d.id===device.id).location,'Workshop');
  await modal(page,'openManageLocationsModal');
  await page.locator('[data-action="delete-device-type-or-location"][data-kind="location"][data-name="Workshop"]').click();
  await page.locator('[data-action="confirm-delete"]').click();
  await persisted(page,s=>s.devices.some(d=>d.id===device.id&&d.location==='Unknown'),'Location delete');
  await page.waitForFunction(()=>document.getElementById('toast-message')?.textContent.includes('deleted.'));
  await page.evaluate(()=>closeModal(true));
  console.log('Dependent location rename/delete and reload passed');

  // Approved acceptance: new accounts initially lack inventory access.
  await page.evaluate(()=>switchTab('users'));
  await page.locator('#next-user-create-form input[name="username"]').fill('editor');
  await page.locator('#next-user-create-form input[name="password"]').fill(password+'-Editor');
  await page.locator('#next-user-create-form button[type="submit"]').click();
  await page.waitForFunction(()=>[...document.querySelectorAll('#main-content h3')]
    .some(h=>h.textContent.trim()==='editor'));
  const editorId=await page.evaluate(async()=>{
    const r=await fetch('/api/users',{cache:'no-store'});
    if(!r.ok)throw Error('Unable to read users');
    return (await r.json()).users.find(user=>user.username==='editor')?.id;
  });
  assert.ok(Number.isInteger(editorId),'User not saved to SQLite');
  const second=await browser.newContext({
    ignoreHTTPSErrors:true,viewport:{width:1440,height:950}
  });
  const editor=await second.newPage();
  editor.setDefaultTimeout(12000);
  await editor.goto(address+'/setup');
  await editor.locator('#username').fill('editor');
  await editor.locator('#password').fill(password+'-Editor');
  await editor.locator('#submit').click();
  await editor.locator('#signed-in:not([hidden])').waitFor();
  assert.equal((await second.request.get(address+'/inventory')).status(),403,
    'Newly created user must have no access');
  await editor.locator('#mfa-panel:not([hidden])').waitFor();
  await editor.locator('#mfa-password').fill(password+'-Editor');
  await editor.locator('#start-mfa button[type="submit"]').click();
  await editor.locator('#confirm-mfa:not([hidden])').waitFor();
  const editorSecret=(await editor.locator('#user-mfa-secret').textContent()).trim();
  assert.ok(editorSecret.length>=16,'Editor MFA secret missing');
  await editor.locator('#user-mfa-code').fill(mfaCode(editorSecret));
  await editor.locator('#confirm-mfa button[type="submit"]').click();
  await editor.waitForFunction(()=>document.querySelector('#signed-in')?.hidden===true);

  await page.locator('[data-next-user-permission][data-user-id="'+editorId+'"][data-section="Devices"]').selectOption('edit');
  await page.waitForFunction(async id=>{
    const r=await fetch('/api/users',{cache:'no-store'});
    return r.ok && (await r.json()).users.find(user=>user.id===id)?.permissions.Devices==='edit';
  },editorId);
  await editor.locator('#username').fill('editor');
  await editor.locator('#password').fill(password+'-Editor');
  await editor.locator('#code').fill(mfaCode(editorSecret));
  await editor.locator('#submit').click();
  await editor.locator('#signed-in:not([hidden])').waitFor();
  await editor.goto(address+'/inventory');
  await editor.getByRole('button',{name:'Refresh inventory'}).waitFor();
  assert.ok((await state(editor)).devices.some(d=>d.id===device.id),
    'Second authenticated browser must see the shared device');
  assert.ok(await editor.locator('#next-users-nav').evaluate(el=>el.classList.contains('hidden')),
    'Users management must be administrator-only');
  console.log('User creation, initially no access, editor MFA, permissions and shared viewing passed');

  // Simple exclusive reservation across two simultaneous browsers.
  const ownerStarted=page.waitForResponse(res=>res.url().endsWith('/api/devices/edit/start'));
  await page.evaluate(id=>openDeviceModal(id),device.id);
  assert.equal((await ownerStarted).status(),200);
  await page.locator('#dev-name').waitFor();
  const competing=editor.waitForResponse(res=>res.url().endsWith('/api/devices/edit/start'));
  await editor.evaluate(id=>openDeviceModal(id),device.id);
  assert.notEqual((await competing).status(),200,
    'A second user must not reserve the same device');
  assert.ok((await state(editor)).devices.some(d=>d.id===device.id),
    'A competing edit must not prevent inventory viewing');

  const ownerCancelled=page.waitForResponse(res=>res.url().endsWith('/api/devices/edit/cancel'));
  await page.evaluate(()=>closeModal(true));
  assert.equal((await ownerCancelled).status(),200);
  const editorStarted=editor.waitForResponse(res=>res.url().endsWith('/api/devices/edit/start'));
  await editor.evaluate(id=>openDeviceModal(id),device.id);
  assert.equal((await editorStarted).status(),200,
    'The device must be editable after the first user cancels');
  await editor.locator('#dev-name').waitFor();
  const editorCancelled=editor.waitForResponse(res=>res.url().endsWith('/api/devices/edit/cancel'));
  await editor.evaluate(()=>closeModal(true));
  assert.equal((await editorCancelled).status(),200);
  await second.close();
  console.log('Two-user exclusive device edit reservations passed');

  await page.evaluate(()=>switchTab('settings'));
  await page.locator('[data-action="clear-inventory-data"]').waitFor();
  page.once('dialog',d=>d.accept());
  await page.locator('[data-action="clear-inventory-data"]').click();
  await persisted(page,s=>!s.devices.length&&!s.subnets.length&&!s.racks.length,'Clean Start');
  await page.reload();
  const clean=await state(page);
  assert.equal(clean.devices.length,0);
  assert.deepEqual(clean.settings.deviceLocations,['Unknown']);
  assert.equal(clean.changeHistory.at(-1).reason,'Clean inventory reset');
  console.log('Confirmed Clean Start persisted with central Change History');

  // Generate the backup with the unchanged published v1.3.3 exporter itself.
  const published=await context.newPage();
  await published.goto('file://'+path.resolve(root,'..','app','caffoot-lite.html'));
  const v133={
    subnets:[{id:'legacy-subnet',name:'Office',cidr:'10.0.0.0/24',
              gateway:'10.0.0.1',vlan:20}],
    vlans:[{id:'legacy-vlan',name:'Office',vlanId:20}],
    racks:[],rackAccessories:[],
    devices:[{id:'legacy-device',name:'legacy-pc',type:'Desktop',
              mountType:'Desktop',location:'Office',primaryIp:'10.0.0.10',
              assetTag:'ASSET-204',notes:'Preserve this published device note'}],
    ipAllocations:{'10.0.0.10':{status:'Assigned',deviceId:'legacy-device',
                                 notes:'Preserve this IPAM note'}},
    deviceTypes:['Desktop','Unknown'],deviceLocations:['Unknown','Office'],
    historicalSetting:{keep:[1,2,3]}
  };
  const exported=await published.evaluate(source=>{
    if(typeof createInventoryBackup!=='function')
      throw Error('Published v1.3.3 backup exporter is unavailable');
    return createInventoryBackup(source);
  },v133);
  await published.close();
  assert.equal(exported.caffootBackup.appVersion,'1.3.3');
  const file={name:'caffoot_lite_backup_v1.3.3.json',
    mimeType:'application/json',buffer:Buffer.from(JSON.stringify(exported))};
  await page.evaluate(()=>switchTab('settings'));
  async function chooseBackup(){
    assert.equal(await page.locator('[data-action="next-import-pick"]').isEnabled(),true,
      'Authorised import button must remain usable');
    const chooser=page.waitForEvent('filechooser');
    await page.locator('[data-action="next-import-pick"]').click();
    await (await chooser).setFiles(file);
    await page.getByRole('heading',{name:'Import Inventory from v1.3.3'}).waitFor();
    await page.getByText('Review the complete inventory replacement',{exact:false}).waitFor();
  }
  await chooseBackup();
  // Cancel must not mutate central inventory.
  const cancelledImport=page.waitForResponse(res=>res.url().endsWith('/api/import/cancel'));
  await page.locator('[data-next-import-action="cancel"]').click();
  assert.equal((await cancelledImport).status(),200);
  assert.equal((await state(page)).devices.length,0);
  await chooseBackup();
  const confirmation=page.locator('#next-import-replace-approval');
  await confirmation.check();
  await page.locator('[data-next-import-action="confirm"]').click();
  const imported=await persisted(page,s=>s.devices.some(d=>d.id==='legacy-device'),'v1.3.3 import');
  const legacy=imported.devices.find(d=>d.id==='legacy-device');
  assert.equal(legacy.assetTag,'ASSET-204');
  assert.equal(legacy.notes,'Preserve this published device note');
  assert.equal(imported.ipAllocations['10.0.0.10'].notes,'Preserve this IPAM note');
  assert.deepEqual(imported.settings.historicalSetting,{keep:[1,2,3]});
  assert.equal(imported.subnets[0].id,'legacy-subnet');
  const accountNames=await page.evaluate(async()=>{
    const response=await fetch('/api/users',{cache:'no-store'});
    if(!response.ok)throw Error('Users cannot be read after import');
    return (await response.json()).users.map(x=>x.username);
  });
  assert.ok(accountNames.includes('owner')&&accountNames.includes('editor'),
    'Import must preserve users and their account settings');
  await page.reload();
  assert.equal((await state(page)).devices[0].id,'legacy-device');
  console.log('Published v1.3.3 export, cancelled review, confirmed one-way import, history fields and account retention passed');
  assert.deepEqual(errors,[],'Browser JavaScript errors');
}
run().then(async()=>{
  console.log('PASS: Caffoot Next focused Chromium compatibility');
  await browser?.close();server?.kill('SIGTERM');
  fs.rmSync(tmp,{recursive:true,force:true});
  if(linkCreated)fs.rmSync(temporaryAssetLink);
}).catch(async e=>{
  console.error('FAIL: '+(e.stack||e));
  if(fs.existsSync(logfile))console.error('Server log:\n'+fs.readFileSync(logfile,'utf8').slice(-13000));
  await browser?.close().catch(()=>{});
  server?.kill('SIGTERM');
  if(linkCreated)fs.rmSync(temporaryAssetLink,{force:true});
  process.exitCode=1;
});
