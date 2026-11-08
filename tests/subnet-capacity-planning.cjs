// Check approved planning guidance and independent-network containment together.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
module.exports=async function verifySubnetCapacityPlanning({page,context,folder}){
 const checks=[],measurements=[];
 const check=text=>{checks.push(text);console.log('PASS: '+text);};
 const close=()=>page.evaluate(()=>closeModal(true));
 const saved=()=>page.waitForFunction(()=>document.getElementById('modal-container').classList.contains('hidden'));
 const settle=()=>page.locator('#modal-content').evaluate(async el=>{await new Promise(requestAnimationFrame);await Promise.all(el.getAnimations().map(animation=>animation.finished.catch(()=>{})));});
 const state=async()=> (await context.request.get('https://127.0.0.1:8080/api/inventory/state')).json();
 const session=await(await context.request.get('https://127.0.0.1:8080/api/session')).json();
 const headers={Origin:'https://127.0.0.1:8080','X-CSRF-Token':session.csrf_token};
 const api=changes=>context.request.post('https://127.0.0.1:8080/api/ipam/subnets/save',{headers,data:{changes}});
 const open=async()=>{await page.evaluate(()=>{activeIpamTab='overview';switchTab('ipam');});await page.locator('#main-content [data-action=open-multiple-subnets]:visible').first().click();await page.locator('#subnet-batch-generator').waitFor({state:'visible'});await settle();};
 const planning=()=>page.locator('.ipam-optional-planning summary').click();
 await page.setViewportSize({width:1440,height:950});await open();
 assert.equal(await page.locator('.ipam-optional-planning').getAttribute('open'),null);
 await page.screenshot({path:path.join(folder,'default-planning.png'),animations:'disabled'});
 assert(await page.locator('.ipam-optional-planning').evaluate(el=>!!(el.compareDocumentPosition(document.querySelector('#subnet-batch-generator > .ipam-modal-body > .ipam-form-grid'))&Node.DOCUMENT_POSITION_FOLLOWING)));
 const calculations=await page.evaluate(()=>[
  calculateSubnetCapacity('172.16.0.0/12',24,50),
  calculateSubnetCapacity('10.160.0.0/16',24,27,'tenth'),
  calculateSubnetCapacity('10.160.0.0/24',24,3),
  calculateSubnetCapacity('10.160.0.0/30',30,2),
  calculateSubnetCapacity('10.160.1.1/16',24,1),
  calculateSubnetCapacity('0.0.0.0/0',23,50),
  calculateSubnetCapacity('10.160.0.0/24',24,1),
  calculateSubnetCapacity('10.160.0.0/16',24,0)
 ]);
 assert.equal(calculations[0].capacity,4096);assert.equal(calculations[0].suggestedPrefix,23);
 assert.equal(calculations[1].spacedCapacity,26);assert.equal(calculations[1].fits,false);assert.equal(calculations[1].suggestedPrefix,25);
 assert.equal(calculations[2].suggestedPrefix,26);assert.equal(calculations[3].suggestedPrefix,undefined);
 assert.equal(calculations[4],null);assert.equal(calculations[5].capacity,8388608);
 assert.equal(calculations[6].capacity,1);assert.equal(calculations[6].fits,false);assert.equal(calculations[6].suggestedPrefix,25);
 assert.equal(calculations[7].fits,false);
 await planning();await page.locator('#subnet-batch-organisation').selectOption('new');
 await page.locator('#subnet-batch-parent-name').fill('Fictional capacity range');
 await page.locator('#subnet-batch-parent-cidr').fill('172.16.0.0/12');
 await page.locator('#subnet-batch-count').fill('50');
 assert.match(await page.locator('#subnet-batch-capacity').innerText(),/4,096/);
 assert.equal(await page.locator('#subnet-batch-prefix').inputValue(),'24');
 await page.locator('#subnet-batch-parent-cidr').fill('10.160.0.0/24');
 await page.locator('#subnet-batch-count').fill('3');
 await page.locator('#subnet-batch-start').fill('10.160.0.0');
 await page.locator('#subnet-batch-convention').selectOption('First usable IP');
 assert.match(await page.locator('#subnet-batch-capacity').innerText(),/\/26/);
 assert.equal(await page.locator('#subnet-batch-prefix').inputValue(),'24');
 await page.locator('#subnet-batch-generator [type=submit]').click();
 assert(await page.locator('#subnet-batch-parent-cidr-error').isVisible());
 await page.locator('#subnet-batch-prefix').selectOption('26');
 await page.locator('#subnet-batch-generator [type=submit]').click();
 assert.equal(await page.locator('[data-subnet-row]').count(),3);await close();
 check('Planning is first and optional; capacity and spacing-aware prefix suggestions never change the selected prefix');

 const independent={id:'capacity-independent',kind:'network',name:'Fictional independent capacity subnet',cidr:'10.160.10.0/24',purpose:'LAN',gateway:'10.160.10.1',custom:{history:'kept'}};
 assert.equal((await api([{collection:'subnets',id:independent.id,record:independent}])).status(),200);
 await page.reload();await page.locator('#app[aria-busy=false]').waitFor();await open();await planning();
 await page.locator('#subnet-batch-organisation').selectOption('new');
 await page.locator('#subnet-batch-parent-name').fill('Fictional containment block');
 await page.locator('#subnet-batch-parent-cidr').fill('10.160.0.0/16');
 await page.locator('#subnet-batch-start').fill('10.160.60.0');await page.locator('#subnet-batch-count').fill('6');
 await page.locator('#subnet-batch-convention').selectOption('First usable IP');
 await page.locator('#subnet-batch-generator [type=submit]').click();
 for(let i=0;i<6;i++){await page.locator('#subnet-row-'+i+'-name').fill('Fictional capacity child '+i);await page.locator('#subnet-row-'+i+'-purpose').selectOption('LAN');}
 await page.locator('#subnet-batch-preview [type=submit]').click();await saved();
 const snapshot=await state(),parent=snapshot.subnets.find(s=>s.name==='Fictional containment block');assert(parent);
 assert.deepEqual(snapshot.subnets.find(s=>s.id===independent.id),independent);
 assert.equal(snapshot.subnets.filter(s=>s.parentId===parent.id).length,6);
 const roundTrip=await page.evaluate(()=>validateAndNormaliseBackupForImport(createInventoryBackup()));
 assert.deepEqual(roundTrip.subnets,snapshot.subnets);
 await page.evaluate(()=>{switchTab('devices');openDeviceModal();});await page.locator('#dev-type').selectOption('Router');await page.locator('#device-form-tab-networking').click();
 await page.locator('#dev-block').selectOption(parent.id);
 assert.equal(await page.locator('#dev-subnet option[value="'+independent.id+'"]').count(),0);
 assert.equal(await page.locator('#dev-subnet option').count(),7);
 await page.locator('#dev-block').selectOption('__unassigned__');assert.equal(await page.locator('#dev-subnet option[value="'+independent.id+'"]').count(),1);
 assert.equal(await page.evaluate(()=>getSubnetForIp('10.160.10.2').id),independent.id);await close();
 check('A new block and six children save around an independent network without adoption; explicit filters and backup/import preserve it');

 const conflict={id:'capacity-conflict',name:'Fictional conflicting child',kind:'network',cidr:independent.cidr,purpose:'LAN',gateway:independent.gateway,parentId:parent.id};
 assert.equal((await api([{collection:'subnets',id:conflict.id,record:conflict}])).status(),400);
 const nested={id:'capacity-small-block',name:'Fictional small block',kind:'container',cidr:'10.160.10.0/23',parentId:parent.id};
 assert.equal((await api([{collection:'subnets',id:nested.id,record:nested}])).status(),200);
 const deleted=await context.request.post('https://127.0.0.1:8080/api/ipam/subnets/delete',{headers,data:{subnetId:nested.id,expectedDevices:[],expectedIps:[]}});
 assert.equal(deleted.status(),200);assert.deepEqual((await state()).subnets,snapshot.subnets);
 const linked=await context.request.post('https://127.0.0.1:8080/api/ipam/subnets/delete',{headers,data:{subnetId:parent.id,expectedDevices:[],expectedIps:[]}});
 assert.equal(linked.status(),400);assert.deepEqual((await state()).subnets,snapshot.subnets);
 check('Real network overlaps and linked-child deletion stay blocked; deleting an empty organisational block leaves independent inventory untouched');

 for(const [width,height]of [[1440,950],[1366,600],[390,844],[320,568]])for(const theme of ['light','dark']){
  await page.setViewportSize({width,height});await page.evaluate(theme=>document.documentElement.classList.toggle('dark',theme==='dark'),theme);await open();await planning();
  await page.locator('#subnet-batch-organisation').selectOption('existing');await page.locator('#subnet-batch-existing').selectOption(parent.id);
  await page.locator('#subnet-batch-start').fill('10.160.100.0');await page.locator('#subnet-batch-count').fill('10');await page.locator('#subnet-batch-convention').selectOption('Last usable IP');
  const measure=async()=>page.locator('#modal-content').evaluate(el=>{const r=el.getBoundingClientRect(),footer=el.querySelector('footer').getBoundingClientRect(),select=el.querySelector('#subnet-batch-convention'),input=el.querySelector('#subnet-batch-start');return {right:r.right,bottom:r.bottom,overflow:el.scrollWidth-el.clientWidth,footerBottom:footer.bottom,selectHeight:select.getBoundingClientRect().height,inputHeight:input.getBoundingClientRect().height,appearance:getComputedStyle(select).appearance};});
  await page.locator('#subnet-batch-convention').focus();await settle();const before=await measure();assert(before.right<=width+1&&before.bottom<=height+1&&before.footerBottom<=height+1&&before.overflow<=1);assert.equal(before.selectHeight,before.inputHeight);assert.equal(before.appearance,'none');
  await page.screenshot({path:path.join(folder,`capacity-${width}-${theme}.png`),animations:'disabled'});
  await page.locator('#subnet-batch-generator [type=submit]').click();await page.locator('#subnet-batch-back').click();await settle();const after=await measure();assert.equal(after.selectHeight,before.selectHeight);assert.equal(after.appearance,'none');assert.equal(await page.locator('#subnet-batch-prefix').inputValue(),'24');assert(after.footerBottom<=height+1);
  measurements.push({width,height,theme,before,after});await close();
 }
 check('Reordered planning and guidance retain fixed actions and accepted select treatment before/after Back across four widths and both themes');
 fs.writeFileSync(path.join(folder,'capacity-planning.json'),JSON.stringify({checks,calculations,measurements,nativeSafariTested:false},null,2));
};
