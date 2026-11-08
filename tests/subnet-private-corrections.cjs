// Exercise the owner's new refinements without repeating the original implementation.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
module.exports = async function verifySubnetPrivateCorrections({page, context, folder}) {
 const checks = [], measurements = [];
 const check = text => { checks.push(text); console.log('PASS: '+text); };
 const close = () => page.evaluate(() => closeModal(true));
 const saved = () => page.waitForFunction(() => document.getElementById('modal-container').classList.contains('hidden'));
 const open = async () => {
  await page.evaluate(() => { activeIpamTab='overview'; switchTab('ipam'); });
  await page.locator('#main-content [data-action=open-multiple-subnets]:visible').first().click();
 };
 const fill = async (start, count) => {
  await page.locator('#subnet-batch-start').fill(start);
  await page.locator('#subnet-batch-count').fill(String(count));
  await page.locator('#subnet-batch-convention').selectOption('First usable IP');
 };
 await page.setViewportSize({width:1440,height:950});
 await page.evaluate(() => { document.documentElement.classList.remove('dark'); switchTab('ipam'); openSubnetModal(); });
 await page.locator('#sub-cidr').fill('10.120.0.0/24');
 const existingName=await page.evaluate(()=>appState.subnets.find(s=>!s.kind||s.kind==='network').name);
 await page.locator('#sub-name').fill('  '+existingName.toUpperCase()+'  ');
 await page.locator('#sub-purpose').selectOption('VPN');
 await page.locator('#sub-gw').fill('');
 await page.locator('#modal-content [type=submit]').click();
 assert.match(await page.locator('#sub-name-error').innerText(), /unique subnet name/);
 assert.equal(await page.locator('#sub-name').getAttribute('aria-invalid'), 'true');
 assert(await page.locator('#modal-content [data-form-error]').isVisible());
 await close();
 check('Single duplicate names are rejected beside Name without changing historical inventory');

 await open();
 assert.equal(await page.locator('.ipam-optional-planning').getAttribute('open'), null);
 const order = await page.locator('#subnet-batch-generator > .ipam-modal-body > .ipam-form-grid input, #subnet-batch-generator > .ipam-modal-body > .ipam-form-grid select').evaluateAll(xs=>xs.map(x=>x.id));
 assert.deepEqual(order.slice(0,4), ['subnet-batch-start','subnet-batch-prefix','subnet-batch-count','subnet-batch-convention']);
 await fill('10.128.10.0',3);
 await page.locator('#subnet-batch-spacing').selectOption('tenth');
 await page.locator('#subnet-batch-generator [type=submit]').click();
 assert.deepEqual(await page.locator('[data-subnet-row] > th').allTextContents(), ['10.128.10.0/24','10.128.20.0/24','10.128.30.0/24']);
 await page.locator('#subnet-batch-back').click();
 await page.locator('#subnet-batch-spacing').selectOption('custom');
 await page.locator('#subnet-batch-generator [type=submit]').click();
 await page.locator('#subnet-row-0-cidr').fill('10.128.61.0/24');
 assert.equal(await page.locator('#subnet-row-0-gateway').inputValue(), '10.128.61.1');
 await page.locator('#subnet-row-0-gateway').fill('10.128.61.200');
 await page.locator('#subnet-row-1-cidr').fill('10.128.61.0/24');
 assert.equal(await page.locator('#subnet-row-1-cidr').getAttribute('aria-invalid'),'true');
 await page.locator('#subnet-row-1-cidr').fill('10.128.63.0/24');
 await page.locator('#subnet-row-2-cidr').fill('10.128.65.0/24');
 for(let i=0;i<3;i++){
  await page.locator('#subnet-row-'+i+'-name').fill('Fictional custom correction '+i);
  await page.locator('#subnet-row-'+i+'-purpose').selectOption('LAN');
 }
 await page.locator('#subnet-row-1-name').fill(' FICTIONAL CUSTOM CORRECTION 0 ');
 assert.match(await page.locator('[data-subnet-row="1"] [data-subnet-error]').innerText(), /unique subnet name/);assert.equal(await page.locator('#subnet-row-1-name').getAttribute('aria-invalid'),'true');
 await page.locator('#subnet-row-1-name').fill('Fictional custom correction 1');
 await page.locator('#subnet-row-2-cidr').fill('10.128.65.1/24');
 await page.locator('#subnet-batch-back').click();
 await page.locator('#subnet-batch-convention').selectOption('Last usable IP');
 await page.locator('#subnet-batch-generator [type=submit]').click();
 assert.equal(await page.locator('#subnet-row-0-cidr').inputValue(),'10.128.61.0/24');
 assert.equal(await page.locator('#subnet-row-0-gateway').inputValue(),'10.128.61.200');
 assert.equal(await page.locator('#subnet-row-1-gateway').inputValue(),'10.128.63.254');
 assert.equal(await page.locator('#subnet-row-2-cidr').inputValue(),'10.128.65.1/24');
 assert.equal(await page.locator('#subnet-row-2-cidr').getAttribute('aria-invalid'),'true');
 await page.locator('#subnet-row-2-cidr').fill('10.128.65.0/24');
 await page.locator('#subnet-batch-preview [type=submit]').click();
 await saved();
 const state = await (await context.request.get('https://127.0.0.1:8080/api/inventory/state')).json();
 assert(state.subnets.some(s=>s.cidr==='10.128.65.0/24'));
 check('Every 10th uses subnet-sized strides; Custom validates CIDRs/names and saves retained manual gateways atomically');

 await open();await fill('10.129.60.0',6);
 await page.locator('.ipam-optional-planning summary').click();
 await page.locator('#subnet-batch-organisation').selectOption('new');
 await page.locator('#subnet-batch-parent-name').fill('Fictional mismatch');
 await page.locator('#subnet-batch-parent-cidr').fill('10.129.1.0/24');
 await page.locator('#subnet-batch-generator [type=submit]').click();
 assert.match(await page.locator('#subnet-batch-parent-cidr-error').innerText(),/strictly inside.*10.129.1.0\/24/);
 assert(!/sub_[a-z0-9]/i.test(await page.locator('#subnet-batch-generator [data-form-error]').innerText()));
 assert(await page.locator('#subnet-batch-generator [data-form-error]').isVisible());
 await page.screenshot({path:path.join(folder,'parent-error.png'),animations:'disabled'});
 await close();check('Containing-block errors stay visible beside the input and explain the range without internal IDs');

 // Record actual select treatment across every main page, plus modal variants.
 const audit = async label => {
  const rows = await page.locator('select:not(.caffoot-search-native):visible').evaluateAll(xs=>xs.map(el=>{
   const s=getComputedStyle(el),r=el.getBoundingClientRect();
   return {id:el.id,label:el.labels?.[0]?.textContent.trim().slice(0,70),height:r.height,width:r.width,appearance:s.appearance,padding:s.padding,backgroundImage:s.backgroundImage,fontSize:s.fontSize,paddingTop:s.paddingTop,paddingBottom:s.paddingBottom,disabled:el.disabled,multiple:el.multiple,size:el.size};
  }));
  for(const row of rows.filter(x=>!x.multiple&&!x.size)){
   assert.equal(row.appearance,'none',label+': '+row.id);
   assert.match(row.backgroundImage,/svg/,label+': '+row.id);
   assert(row.height>=parseFloat(row.fontSize)+parseFloat(row.paddingTop)+parseFloat(row.paddingBottom),label+': clipped '+row.id);
  }
  measurements.push({label,rows});
 };
 for(const tab of ['dashboard','devices','ipam','racks','users','settings','account','audit']){
  await page.evaluate(tab=>switchTab(tab),tab);await audit(tab);
 }
 await page.evaluate(()=>{switchTab('racks');openRackModal();});await audit('Rack modal');await close();
 await page.evaluate(()=>switchTab('users'));await page.locator('[data-action=users-add-nav]').click();await audit('User editor');
 await page.evaluate(()=>{activeSettingsTab='email';switchTab('settings');});await page.waitForFunction(()=>!smtpLoading);await audit('Email settings');
 await page.evaluate(()=>{activeIpamTab='addresses';switchTab('ipam');});await audit('Active Subnet and address filters');
 await page.evaluate(()=>{switchTab('devices');openDeviceModal();});
 await page.locator('#dev-type').selectOption('Router');await page.locator('#device-form-tab-networking').click();
 const ipOrder=await page.locator('#device-form-panel-networking input,#device-form-panel-networking select').evaluateAll(xs=>xs.map(x=>x.id));
 assert(ipOrder.indexOf('dev-ip-available')<ipOrder.indexOf('dev-ip'));await audit('Device Networking');await close();
 for(const [width,height]of [[1440,950],[1366,600],[390,844],[320,568]])for(const theme of ['light','dark']){
  await page.setViewportSize({width,height});await page.evaluate(theme=>document.documentElement.classList.toggle('dark',theme==='dark'),theme);
  await open();await fill('10.130.0.0',1);await audit('Gateway Convention '+width+' '+theme);
  const geometry=await page.locator('#subnet-batch-convention').evaluate(el=>{const a=el.getBoundingClientRect(),b=document.getElementById('subnet-batch-start').getBoundingClientRect();return {height:a.height,inputHeight:b.height,top:a.top,left:a.left,countTop:document.getElementById('subnet-batch-count').getBoundingClientRect().top,countLeft:document.getElementById('subnet-batch-count').getBoundingClientRect().left,overflow:document.getElementById('modal-content').scrollWidth-document.getElementById('modal-content').clientWidth};});
  const footer=await page.locator('#subnet-batch-generator .ipam-modal-actions').boundingBox();assert(footer.y+footer.height<=height+1);
  assert.equal(geometry.height,geometry.inputHeight);if(geometry.left!==geometry.countLeft)assert(Math.abs(geometry.top-geometry.countTop)<1);assert(geometry.overflow<=1);measurements.push({width,height,theme,geometry});
  await page.screenshot({path:path.join(folder,`generator-${width}-${theme}.png`),animations:'disabled'});
  await page.locator('#subnet-batch-generator [type=submit]').click();await page.locator('#subnet-batch-back').click();assert.equal(await page.locator('#subnet-batch-convention').inputValue(),'First usable IP');await close();
 }
 check('Whole-app selects keep native semantics with consistent chrome; Gateway Convention matches adjacent fields before/after Back at four widths and both themes');
 fs.writeFileSync(path.join(folder,'private-corrections.json'),JSON.stringify({checks,measurements,nativeSafariTested:false},null,2));
};
