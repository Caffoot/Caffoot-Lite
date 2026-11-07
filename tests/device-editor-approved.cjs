// Exercise the approved Device editor amendments with isolated, fictional records.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {spawnSync}=require('node:child_process');
const address='https://127.0.0.1:8080';
module.exports=async function verifyDeviceEditor({page,reference,sourceBase,context,out}){
 page.setDefaultTimeout(15000);reference.setDefaultTimeout(15000);
 const evidence=path.join(out,'device-editor');fs.mkdirSync(evidence,{recursive:true});
 const checks=[],measurements=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 const check=label=>{checks.push(label);console.log('PASS: '+label);};
 const capture=async name=>{await page.bringToFront();await page.screenshot({path:path.join(evidence,'feedback-'+name+'.png')});};
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
 assert.equal(await page.locator('#device-form-physical-purpose + #host-platform-fields').count(),1);assert.equal(await page.locator('#dev-create-location-panel').isVisible(),false);
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
 await page.locator('#hypervisor-selection-dialog [data-action=confirm]').click();assert.match(await page.locator('#hypervisor-selection-dialog [data-device-editor-feedback]').innerText(),/every virtual machine/);await capture('guest-decision');
 await page.locator('#hypervisor-selection-dialog [data-action=cancel]').click();await close();
 check('Guest product-change confirmation, atomic propagation and hosting-disable Cancel safety');
 await open();await tab('notes');await page.locator('.device-review-footer [type=submit]').click();await page.waitForFunction(()=>document.activeElement.id==='dev-name');
 assert.match(await feedback().innerText(),/Device Name/i);assert(await feedback().isVisible());assert.equal(await page.locator('#device-form-tab-general').getAttribute('aria-selected'),'true');await capture('required-name');await close();
 await open('duplicate');await page.locator('#dev-name').fill('Hypervisor-01');await tab('networking');await page.locator('#dev-ip').fill('10.0.10.210');await page.locator('.device-review-footer [type=submit]').click();
 await page.waitForFunction(()=>document.activeElement.id==='dev-name');assert.match(await feedback().innerText(),/already exists/);await capture('duplicate-name');await close();
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
 for(const type of types){await page.locator('#dev-type').selectOption(type);assert.equal(await page.locator('#host-platform-fields').isVisible(),type==='Server - Physical');assert.equal(await page.locator('#dev-create-location-panel').isVisible(),false);await tab('software');
  const actual=await page.locator('[data-review-choice-list=software] input').evaluateAll(xs=>xs.map(x=>x.dataset.deviceDetailField));
  const expected=await page.evaluate(type=>getDeviceSoftwareSuggestions(type,deviceDetailFormValues).map(x=>x.key),type);assert.deepEqual(actual,expected);await tab('general');}
 await close();await open();await page.locator('#dev-deployment').selectOption('virtual');
 const purposes=await page.locator('#dev-vm-purpose option').evaluateAll(xs=>xs.map(x=>x.value));
 for(const purpose of purposes){await page.locator('#dev-vm-purpose').selectOption(purpose);assert.equal(await page.locator('.device-physical-mounting').isVisible(),false);await tab('software');const keys=await page.locator('[data-review-choice-list=software] input').evaluateAll(xs=>xs.map(x=>x.dataset.deviceDetailField));const expected=await page.evaluate(purpose=>getDeviceSoftwareSuggestions(purpose,deviceDetailFormValues).map(x=>x.key),purpose);assert.deepEqual(keys,expected);await tab('general');}
 await close();check(types.length+' physical types and '+purposes.length+' VM purposes retain applicable software and field restrictions');
 // Create a new host and guest through the real editor, including visible failure paths.
 await open();await page.locator('#dev-name').fill('Fictional approved host');await page.locator('#dev-type').selectOption('Server - Physical');await page.locator('#dev-location').selectOption('Unknown');await page.locator('#dev-mount-type').selectOption('Tower / Floor Standing');await page.locator('#device-hosting-enabled').check();
 await tab('networking');await page.locator('#dev-block').selectOption('__unassigned__');await page.locator('#dev-vlan').selectOption('10');await page.locator('#dev-subnet').selectOption('net-0');await page.locator('#dev-ip').fill('10.0.10.210');await page.locator('.device-review-footer [type=submit]').click();await page.waitForFunction(()=>document.activeElement.id==='host-platform-select');assert.match(await feedback().innerText(),/product/i);await capture('missing-product');
 await page.locator('#host-platform-select').selectOption('__custom__');await page.locator('#host-platform').fill('Fictional Custom Hypervisor');await page.locator('#host-version-select').selectOption('__custom__');await page.locator('#host-version').fill('Preserved custom version');await save();await load();
 const newHost=(await state()).devices.find(d=>d.name==='Fictional approved host');assert.equal(newHost.typeDetails.hypervisorVersion,'Preserved custom version');
 await open();await page.locator('#dev-deployment').selectOption('virtual');await page.locator('#dev-name').fill('Fictional approved guest');await tab('networking');await page.locator('#dev-block').selectOption('__unassigned__');await page.locator('#dev-vlan').selectOption('10');await page.locator('#dev-subnet').selectOption('net-0');await page.locator('#dev-ip').fill('10.0.10.211');await page.locator('.device-review-footer [type=submit]').click();await page.waitForFunction(()=>document.activeElement.id==='dev-virtual-host');assert.match(await feedback().innerText(),/host/i);await capture('missing-host');
 await page.locator('#dev-virtual-host').selectOption(newHost.id);await page.locator('#dev-vmVcpu').fill('-1');await tab('notes');await page.locator('.device-review-footer [type=submit]').click();await page.waitForFunction(()=>document.activeElement.id==='dev-vmVcpu');assert(await feedback().isVisible());await capture('invalid-allocation');
 for(const [key,value]of Object.entries({vmVcpu:'2',vmRamGb:'4',vmDiskGb:'60',vmNicCount:'1'}))await page.locator('#dev-'+key).fill(value);await save();await load();const newGuest=(await state()).devices.find(d=>d.name==='Fictional approved guest');assert.equal(newGuest.virtualHostId,newHost.id);assert.equal(newGuest.virtualPlatform,'Fictional Custom Hypervisor');assert.equal(newGuest.location,newHost.location);
 check('New host/custom version and VM creation, missing product/host and invalid allocation feedback');
 await open('edit','Fictional approved guest');await tab('notes');await page.locator('#dev-notes').fill('This failed save must remain a draft.');for(const [status,message]of [[500,'Fictional save failure'],[403,'Device editing permission was removed.'],[409,'Device edit reservation is no longer active.']]){await context.route('**/api/devices/edit/save',r=>r.fulfill({status,contentType:'application/json',body:JSON.stringify({error:message})}));await page.locator('.device-review-footer [type=submit]').click();await page.waitForFunction(message=>document.querySelector('[data-device-editor-feedback]')?.textContent===message,message);assert.equal(await page.locator('#dev-notes').inputValue(),'This failed save must remain a draft.');assert.notEqual((await state()).devices.find(d=>d.id===newGuest.id).notes,'This failed save must remain a draft.');await capture('save-'+status);await context.unroute('**/api/devices/edit/save');}await close();
 check('Simulated server/permission/reservation failures remain visible and preserve the draft without changing SQLite');
 assert(await page.evaluate(()=>isDeviceEditorHypervisorProduct({key:'catalogSoftware_vmware_esxi',label:'Renamed product'})));assert(!await page.evaluate(()=>isDeviceEditorHypervisorProduct('VMware Tools')));assert(!await page.evaluate(()=>isDeviceEditorHypervisorProduct('Hyper-V Integration Services')));
 check('Stable product keys remain filtered while valid guest tools remain available');
 await open('edit','App-VM-01');await page.locator('#device-form-tab-general').focus();await page.keyboard.press('End');assert.equal(await page.locator('#device-form-tab-notes').getAttribute('aria-selected'),'true');await page.keyboard.press('Home');assert.equal(await page.locator('#device-form-tab-general').getAttribute('aria-selected'),'true');await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#device-form-tab-software').getAttribute('aria-selected'),'true');await close();
 check('Keyboard tab navigation skips the hidden VM Hardware tab and selects/focuses the destination');
 fs.writeFileSync(path.join(evidence,'functional.json'),JSON.stringify({checks,errors},null,2));
 }
 if(process.env.CAFFOOT_EDITOR_FUNCTIONAL_ONLY==='1')return;
 // Compare complete scroll sequences, keeping the source untouched. Owner amendments and real controls are recorded separately.
 if(process.env.CAFFOOT_EDITOR_TEXT_ONLY!=='1')for(const [width,height]of [[1440,950],[1366,600],[390,844],[320,568]])for(const theme of ['light','dark'])for(const mode of ['add','edit','duplicate'])for(const kind of ['physical','virtual']){
  await page.setViewportSize({width,height});await reference.setViewportSize({width,height});await page.evaluate(theme=>document.documentElement.classList.toggle('dark',theme==='dark'),theme);
  await reference.goto(sourceBase+'/devices-details-forms-batch-04.html');await reference.evaluate(theme=>document.documentElement.classList.toggle('dark',theme==='dark'),theme);
  console.log('Compare '+[width,theme,mode,kind].join(' '));await page.bringToFront();await open(mode,kind==='physical'?'Hypervisor-01':'App-VM-01');assert.equal(await page.locator('#dev-create-location-panel').isVisible(),false);if(mode==='add'){if(kind==='physical')await page.locator('#dev-type').selectOption('Server - Physical');else await page.locator('#dev-deployment').selectOption('virtual');}
  await reference.evaluate(({mode,kind})=>{openDeviceEditor(mode,mode==='add'?null:kind==='physical'?'Hypervisor-01':'App-VM-01');if(mode==='add'){const e=DR('device-review-body').querySelector('#review-deployment');if(kind==='virtual'){e.value='virtual';e.dispatchEvent(new Event('change',{bubbles:true}));}else{const t=DR('device-review-body').querySelector('#review-type');t.value='Server - Physical';t.dispatchEvent(new Event('change',{bubbles:true}));}}},{mode,kind});
  for(const key of ['general',...(kind==='physical'?['hardware']:[]),'software','networking','notes']){
   await page.bringToFront();await tab(key);await reference.bringToFront();await reference.locator('#device-review-tabs [data-review-tab="'+key+'"]').click();
   const live=await page.evaluate(dimensions),source=await reference.evaluate(dimensions);assert(live.horizontalOverflow<=1,JSON.stringify({width,theme,mode,kind,key,overflow:live.horizontalOverflow}));assert(live.footer.y+live.footer.height<=height+1);assert(live.body.height>0);if(key==='notes')assert(live.notes.height>=125,'Notes retains the source minimum and scrolls at short heights');
   assert(Math.abs(live.dialog.width-source.dialog.width)<1);assert(Math.abs(live.dialog.height-source.dialog.height)<1);
   const row={width,height,theme,mode,kind,tab:key,live,source};measurements.push(row);
   // Retain representative full sequences; every state still records all fields and geometry.
   if(process.env.CAFFOOT_EDITOR_FULL_CAPTURES==='1'||(mode==='edit'&&((width===1366&&theme==='light')||(width===390&&theme==='dark')))||(mode!=='edit'&&width===390&&theme==='light'&&key==='general')){for(const fraction of [0,.5,1])for(const [target,label]of [[page,'live'],[reference,'source']]){await target.bringToFront();await target.locator('.device-review-body').evaluate((el,f)=>el.scrollTop=(el.scrollHeight-el.clientHeight)*f,fraction);await target.screenshot({path:path.join(evidence,`${mode}-${kind}-${key}-${width}-${theme}-${fraction}-${label}.png`)});}}
  }
  await close();
 }
 if(process.env.CAFFOOT_EDITOR_TEXT_ONLY!=='1')for(const width of [1440,390])for(const theme of ['light','dark'])for(const kind of ['location','manufacturer','model','software','services']){
  await page.setViewportSize({width,height:950});await reference.setViewportSize({width,height:950});await page.bringToFront();await open('edit');await page.evaluate(theme=>document.documentElement.classList.toggle('dark',theme==='dark'),theme);await reference.goto(sourceBase+'/devices-details-forms-batch-04.html');await reference.evaluate(theme=>{document.documentElement.classList.toggle('dark',theme==='dark');openDeviceEditor('edit','Hypervisor-01');},theme);
  const key=kind==='location'?'general':['manufacturer','model'].includes(kind)?'hardware':'software';await tab(key);if(kind==='location')await page.getByRole('button',{name:'+ Add Location',exact:true}).click();else await page.locator('[data-action="device-inline-quick-open"][data-kind="'+kind+'"]').click();
  await reference.bringToFront();await reference.locator('#device-review-tabs [data-review-tab="'+key+'"]').click();await reference.locator('#device-review-body [data-review-quick-open="'+kind+'"]').click();
  const live=await page.evaluate(dimensions),source=await reference.evaluate(dimensions);assert(live.horizontalOverflow<=1);measurements.push({width,height:950,theme,expanded:kind,live,source});
  for(const [target,label]of [[page,'live'],[reference,'source']]){await target.bringToFront();await target.screenshot({path:path.join(evidence,'inline-'+kind+'-'+width+'-'+theme+'-'+label+'.png')});}await close();
 }
 await page.setViewportSize({width:390,height:844});await open('edit');await page.addStyleTag({content:'.device-editor-dialog{font-size:200%}.device-editor-dialog input,.device-editor-dialog select,.device-editor-dialog textarea,.device-editor-dialog button{font-size:inherit}'});for(const key of ['general','software','notes']){await tab(key);const live=await page.evaluate(dimensions);measurements.push({width:390,height:844,textScale:200,tab:key,live});assert(live.horizontalOverflow<=1);assert(live.footer.y+live.footer.height<=845);assert(await page.locator('.device-review-footer .btn').evaluateAll(buttons=>buttons.every(button=>{const b=button.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(button);return [...range.getClientRects()].every(r=>r.left>=b.left-2&&r.right<=b.right+2&&r.top>=b.top-2&&r.bottom<=b.bottom+2);})), 'Enlarged footer text must fit within each button');await page.bringToFront();await page.screenshot({path:path.join(evidence,'enlarged-'+key+'.png')});}await close();
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
