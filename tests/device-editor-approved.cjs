// Exercise the approved Device editor amendments with isolated, fictional records.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {spawnSync}=require('node:child_process');
const address='https://127.0.0.1:8080';
module.exports=async function verifyDeviceEditor({page,reference,sourceBase,context,out}){
 page.setDefaultTimeout(15000);reference.setDefaultTimeout(15000);
 const evidence=path.join(out,'device-editor');fs.mkdirSync(evidence,{recursive:true});
 const checks=[],measurements=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 const check=label=>{checks.push(label);console.log('PASS: '+label);};
 const tab=async key=>page.locator('#device-form-tab-'+key).click();
 const state=async()=> (await context.request.get(address+'/api/inventory/state')).json();
 const load=async()=>{await page.goto(address+'/inventory');await page.locator('#app[aria-busy="false"]').waitFor();await page.bringToFront();};
 const close=async()=>{await page.evaluate(()=>closeModal(true));await page.waitForFunction(()=>document.getElementById('modal-container').classList.contains('hidden'));await page.waitForFunction(async()=>Object.keys((await(await fetch('/api/inventory/state')).json()).deviceEditors||{}).length===0);};
 const open=async(mode='add',name='Hypervisor-01')=>{await page.evaluate(({mode,name})=>{const d=appState.devices.find(d=>d.name===name);if(mode==='add')openDeviceModal();else if(mode==='edit')openDeviceModal(d.id);else duplicateDevice(d.id);},{mode,name});await page.locator('#device-editor-form').waitFor({state:'visible'});};
 const save=async()=>{await page.locator('.device-editor-dialog .device-review-footer [type=submit]').click();await page.waitForFunction(()=>document.getElementById('modal-container').classList.contains('hidden'));};
 const feedback=()=>page.locator('.device-editor-dialog > [data-device-editor-feedback]');
 const dimensions=()=>{
  const d=document.querySelector('.device-editor-dialog')||document.getElementById('device-review-dialog'),body=d.querySelector('.device-review-body');
  const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};};
  const visible=e=>!!e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden';
  return {dialog:rect(d),header:rect(d.querySelector('.device-review-head')),footer:rect(d.querySelector('.device-review-footer')),body:{...rect(body),scrollHeight:body.scrollHeight,clientHeight:body.clientHeight},cards:[...d.querySelectorAll('.device-review-body .device-review-panel')].filter(visible).map(e=>({title:e.querySelector('h3')?.textContent.trim(),...rect(e)})),fields:[...body.querySelectorAll('input,select,textarea')].filter(e=>visible(e)&&e.type!=='hidden').map(e=>({id:e.id,...rect(e)})),horizontalOverflow:d.scrollWidth-d.clientWidth,notes:d.querySelector('#dev-notes')&&visible(d.querySelector('#dev-notes'))?rect(d.querySelector('#dev-notes')):null};
 };
 await load();const original=await state();
 if(process.env.CAFFOOT_EDITOR_VISUAL_ONLY!=='1'){
 await open();await page.locator('#dev-type').selectOption('Server - Physical');
 assert.equal(await page.locator('#device-form-physical-purpose + #host-platform-fields').count(),1);
 await tab('software');const os=await page.locator('#platform-select option').evaluateAll(xs=>xs.map(x=>x.value));
 assert(!os.includes('VMware ESXi')&&!os.includes('Proxmox VE'));
 assert.equal(await page.locator('[data-review-choice-list=software]').getByText('VMware ESXi',{exact:true}).count(),0);
 assert.equal(await page.locator('[data-device-detail-field=serverService_Hypervisor]').count(),0);
 await page.locator('#platform-select').selectOption('Ubuntu Server');await tab('general');
 await page.locator('#device-hosting-enabled').check();await page.locator('#host-platform-select').selectOption('Proxmox VE');
 await page.locator('#host-version-select').selectOption('__custom__');await page.locator('#host-version').fill('Fictional version');
 await tab('software');assert.equal(await page.locator('#software-platform').isVisible(),false);
 await tab('general');await page.locator('#device-hosting-enabled').uncheck();await tab('software');
 assert.equal(await page.locator('#platform-name').inputValue(),'Ubuntu Server');await close();
 check('One General hosting path, ordinary product filtering and toggle preservation');
 // The full existing browser suite exercises transactions; these tests inspect the restored UI bindings too.
 await open('edit');await tab('software');assert.equal(await page.locator('#software-platform').isVisible(),false);
 await tab('general');assert.equal(await page.locator('#host-platform-select').inputValue(),'VMware ESXi');
 await page.locator('#device-hosting-enabled').uncheck();await tab('software');
 assert.equal(await page.locator('[data-retained-hypervisor-os]').count(),1);
 assert.equal(await page.locator('[data-retained-hypervisor-software]').count(),1);
 await tab('general');await page.locator('#device-hosting-enabled').check();await save();await load();
 let saved=(await state()).devices.find(d=>d.name==='Hypervisor-01');
 for(const [key,value]of Object.entries(original.devices.find(d=>d.name==='Hypervisor-01').typeDetails))assert.deepEqual(saved.typeDetails[key],value,'Preserve '+key);
 check('Save/reload retains hidden legacy OS, software assignments, custom data and host metadata');
 await open('edit');await page.locator('#host-platform-select').selectOption('Proxmox VE');
 await page.locator('.device-review-footer [type=submit]').click();await page.locator('#platform-dialog').waitFor();
 await page.locator('#platform-dialog [data-action=cancel]').click();assert.equal((await state()).devices.find(d=>d.name==='Hypervisor-01').typeDetails.hypervisorProduct,'VMware ESXi');
 await page.locator('.device-review-footer [type=submit]').click();await page.locator('#platform-dialog [data-action=confirm]').click();await page.waitForFunction(()=>document.getElementById('modal-container').classList.contains('hidden'));
 saved=await state();assert.equal(saved.devices.find(d=>d.name==='App-VM-01').virtualPlatform,'Proxmox VE');
 await load();await open('edit');await page.locator('#device-hosting-enabled').uncheck();await page.locator('.device-review-footer [type=submit]').click();await page.locator('#hypervisor-selection-dialog').waitFor();
 await page.locator('#hypervisor-selection-dialog [data-action=confirm]').click();assert.match(await page.locator('#hypervisor-selection-dialog [data-device-editor-feedback]').innerText(),/every virtual machine/);
 await page.locator('#hypervisor-selection-dialog [data-action=cancel]').click();await close();
 check('Guest product-change confirmation, atomic propagation and hosting-disable Cancel safety');
 await open();await tab('notes');await page.locator('.device-review-footer [type=submit]').click();await page.waitForFunction(()=>document.activeElement.id==='dev-name');
 assert.match(await feedback().innerText(),/Device Name/i);assert(await feedback().isVisible());assert.equal(await page.locator('#device-form-tab-general').getAttribute('aria-selected'),'true');await close();
 await open('duplicate');await page.locator('#dev-name').fill('Hypervisor-01');await tab('networking');await page.locator('#dev-ip').fill('10.0.10.210');await page.locator('.device-review-footer [type=submit]').click();
 await page.waitForFunction(()=>document.activeElement.id==='dev-name');assert.match(await feedback().innerText(),/already exists/);await close();
 check('Native and business errors reveal the first correct tab/field above the footer');
 await open('edit','App-VM-01');assert.equal(await page.locator('#device-form-physical-purpose').isVisible(),false);assert.equal(await page.locator('#device-form-tab-hardware').isVisible(),false);assert.equal(await page.locator('.device-physical-mounting').isVisible(),false);assert.equal(await page.locator('#host-platform-fields').isVisible(),false);
 for(const [key,value]of Object.entries({vmVcpu:'4',vmRamGb:'8',vmDiskGb:'100',vmNicCount:'2'}))assert.equal(await page.locator('#dev-'+key).inputValue(),value);
 await page.locator('#dev-vmVcpu').fill('6');await save();await load();assert.equal(String((await state()).devices.find(d=>d.name==='App-VM-01').typeDetails.vmVcpu),'6');
 check('VM General controls hide physical fields and preserve host/resources through save/reload');
 await open('duplicate','App-VM-01');assert.equal(await page.locator('#dev-name').inputValue(),'');await tab('networking');assert.equal(await page.locator('#dev-ip').inputValue(),'');await tab('general');assert.equal(await page.locator('#dev-vmVcpu').inputValue(),'6');await close();
 check('Duplicate clears identity/IP while preserving VM allocations and host');
 await open('edit','App-VM-01');await tab('notes');
 assert.deepEqual(await page.locator('.device-review-note-toolbar button').allTextContents(),['Bold','Italic','Bullets','Heading','Numbers','Code','Link','Preview']);
 for(const [label,expected]of [['Bold','**sample**'],['Italic','*sample*'],['Bullets','- sample'],['Heading','## sample'],['Numbers','1. sample'],['Code','`sample`']]){
  await page.locator('#dev-notes').fill('sample');await page.locator('#dev-notes').selectText();await page.locator('.device-review-note-toolbar').getByRole('button',{name:label,exact:true}).click();assert.equal(await page.locator('#dev-notes').inputValue(),expected);
 }
 await page.locator('#dev-notes').fill('sample');await page.locator('#dev-notes').selectText();await page.locator('.device-review-note-toolbar').getByRole('button',{name:'Link',exact:true}).click();assert.match(await page.locator('#dev-notes').inputValue(),/sample.*https:\/\/example.com/);
 const note='**Saved fictional note**\n<script>alert("fictional")</script>\n'+('Long note\n'.repeat(150));await page.locator('#dev-notes').fill(note);await page.locator('#notes-toggle').click();assert.equal(await page.locator('#notes-preview script').count(),0);assert(await page.locator('#notes-preview').isVisible());await page.locator('#notes-toggle').click();await save();await load();assert.equal((await state()).devices.find(d=>d.name==='App-VM-01').notes,note.trim());
 check('All eight Notes actions, safe preview, long text and save/reload');
 // Every offered physical type and VM purpose must retain its existing catalogue restrictions.
 await open();const types=await page.locator('#dev-type option').evaluateAll(xs=>xs.map(x=>x.value).filter(x=>x&&x!=='Server - Virtual'));
 for(const type of types){await page.locator('#dev-type').selectOption(type);assert.equal(await page.locator('#host-platform-fields').isVisible(),type==='Server - Physical');await tab('software');
  const actual=await page.locator('[data-review-choice-list=software] input').evaluateAll(xs=>xs.map(x=>x.dataset.deviceDetailField));
  const expected=await page.evaluate(type=>getAvailableSoftwareCatalogueEntries().filter(x=>getSoftwareFieldsForDeviceType(type).includes(x.key)&&!isDeviceEditorHypervisorProduct(x)).map(x=>x.key),type);assert.deepEqual(actual,expected);await tab('general');}
 await close();await open();await page.locator('#dev-deployment').selectOption('virtual');
 const purposes=await page.locator('#dev-vm-purpose option').evaluateAll(xs=>xs.map(x=>x.value));
 for(const purpose of purposes){await page.locator('#dev-vm-purpose').selectOption(purpose);assert.equal(await page.locator('.device-physical-mounting').isVisible(),false);await tab('software');const keys=await page.locator('[data-review-choice-list=software] input').evaluateAll(xs=>xs.map(x=>x.dataset.deviceDetailField));const expected=await page.evaluate(purpose=>getAvailableSoftwareCatalogueEntries().filter(x=>getSoftwareFieldsForDeviceType(purpose).includes(x.key)&&!isDeviceEditorHypervisorProduct(x)).map(x=>x.key),purpose);assert.deepEqual(keys,expected);await tab('general');}
 await close();check(types.length+' physical types and '+purposes.length+' VM purposes retain applicable software and field restrictions');
 fs.writeFileSync(path.join(evidence,'functional.json'),JSON.stringify({checks,errors},null,2));
 }
 // Compare complete scroll sequences, keeping the source untouched. Owner amendments and real controls are recorded separately.
 for(const [width,height]of [[1440,950],[1366,600],[390,844],[320,568]])for(const theme of ['light','dark'])for(const mode of ['add','edit','duplicate'])for(const kind of ['physical','virtual']){
  await page.setViewportSize({width,height});await reference.setViewportSize({width,height});await page.evaluate(theme=>document.documentElement.classList.toggle('dark',theme==='dark'),theme);
  await reference.goto(sourceBase+'/devices-details-forms-batch-04.html');await reference.evaluate(theme=>document.documentElement.classList.toggle('dark',theme==='dark'),theme);
  await open(mode,kind==='physical'?'Hypervisor-01':'App-VM-01');if(mode==='add'){if(kind==='physical')await page.locator('#dev-type').selectOption('Server - Physical');else await page.locator('#dev-deployment').selectOption('virtual');}
  await reference.evaluate(({mode,kind})=>{openDeviceEditor(mode,mode==='add'?null:kind==='physical'?'Hypervisor-01':'App-VM-01');if(mode==='add'){const e=DR('device-review-body').querySelector('#review-deployment');if(kind==='virtual'){e.value='virtual';e.dispatchEvent(new Event('change',{bubbles:true}));}else{const t=DR('device-review-body').querySelector('#review-type');t.value='Server - Physical';t.dispatchEvent(new Event('change',{bubbles:true}));}}},{mode,kind});
  for(const key of ['general',...(kind==='physical'?['hardware']:[]),'software','networking','notes']){
   await tab(key);await reference.locator('#device-review-tabs [data-review-tab="'+key+'"]').click();
   const live=await page.evaluate(dimensions),source=await reference.evaluate(dimensions);assert(live.horizontalOverflow<=1,JSON.stringify({width,theme,mode,kind,key,overflow:live.horizontalOverflow}));assert(live.footer.y+live.footer.height<=height+1);assert(live.body.height>0);
   assert(Math.abs(live.dialog.width-source.dialog.width)<1);assert(Math.abs(live.dialog.height-source.dialog.height)<1);
   const row={width,height,theme,mode,kind,tab:key,live,source};measurements.push(row);
   // Retain representative full sequences; every state still records all fields and geometry.
   if(mode==='edit'&&((width===1366&&theme==='light')||(width===390&&theme==='dark'))){for(const fraction of [0,.5,1])for(const [target,label]of [[page,'live'],[reference,'source']]){await target.bringToFront();await target.locator('.device-review-body').evaluate((el,f)=>el.scrollTop=(el.scrollHeight-el.clientHeight)*f,fraction);await target.screenshot({path:path.join(evidence,`${kind}-${key}-${width}-${theme}-${fraction}-${label}.png`)});}}
  }
  await close();
 }
 await page.setViewportSize({width:390,height:844});await open('edit');await page.addStyleTag({content:'.device-editor-dialog{font-size:200%}.device-editor-dialog input,.device-editor-dialog select,.device-editor-dialog textarea,.device-editor-dialog button{font-size:inherit}'});for(const key of ['general','software','notes']){await tab(key);const live=await page.evaluate(dimensions);measurements.push({width:390,height:844,textScale:200,tab:key,live});assert(live.horizontalOverflow<=1);assert(live.footer.y+live.footer.height<=845);await page.bringToFront();await page.screenshot({path:path.join(evidence,'enlarged-'+key+'.png')});}await close();
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(evidence,'measurements.json'),JSON.stringify(measurements,null,2));fs.writeFileSync(path.join(evidence,'functional.json'),JSON.stringify({checks,errors,visualStates:measurements.length},null,2));
 console.log('Device editor checks complete: '+measurements.length+' rendered states; source comparisons and scroll sequences recorded.');
};
module.exports.seed=function seedDeviceEditor(directory){
 const r=spawnSync('python3',['-c',`import sqlite3,json,sys
with sqlite3.connect(sys.argv[1]) as db:
 for row in db.execute('SELECT id,record_json FROM inventory_devices').fetchall():
  d=json.loads(row[1])
  if d['name']=='Hypervisor-01':d['typeDetails']={'serverService_Hypervisor':True,'hypervisorProduct':'VMware ESXi','hypervisorVersion':'8.0','softwarePlatform':'VMware ESXi','softwareVersion':'8.0','catalogSoftware_vmware_esxi':True,'fictionalLegacy':{'retained':True}}
  if d['name']=='App-VM-01':d['typeDetails']={'softwarePlatform':'Ubuntu Server','softwareVersion':'24.04 LTS','vmVcpu':4,'vmRamGb':8,'vmDiskGb':100,'vmNicCount':2};d['virtualPlatform']='VMware ESXi'
  db.execute('UPDATE inventory_devices SET record_json=? WHERE id=?',(json.dumps(d),row[0]))
`,path.join(directory,'inventory.sqlite3')],{encoding:'utf8'});if(r.status)throw Error(r.stderr);
};
