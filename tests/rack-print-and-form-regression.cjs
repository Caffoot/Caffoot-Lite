const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
module.exports=async({page,context,out})=>{
 const results=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('https://127.0.0.1:8080/inventory');await page.locator('#app[aria-busy="false"]').waitFor();await page.bringToFront();
 await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
 const initial=await page.evaluate(async()=>await(await fetch('/api/inventory/state')).json());
 const id=await page.evaluate(()=>appState.devices.find(d=>d.name==='Reception-PC').id);
 async function close(){await page.evaluate(()=>closeModal(true));await page.locator('#modal-container').waitFor({state:'hidden'});}
 for(const width of [1440,1024,768,390])for(const theme of ['light','dark'])for(const mode of ['add','edit','duplicate']){
  await page.setViewportSize({width,height:width===390?844:950});
  await page.evaluate(({theme,mode,id})=>{caffootSetTheme(theme);switchTab('devices');if(mode==='duplicate')duplicateDevice(id);else openDeviceModal(mode==='edit'?id:null);},{theme,mode,id});
  await page.locator('#device-editor-form').waitFor();
  if(mode==='add'){await page.locator('#dev-type').selectOption('Desktop');await page.locator('#dev-location').selectOption('Office');}
  await page.locator('#modal-content [role="tab"]').filter({hasText:'Software & Firmware'}).click();
  const software=await page.locator('#software-platform').evaluate(root=>{
   const rect=e=>{const r=e.getBoundingClientRect();return {top:r.top,left:r.left,width:r.width,height:r.height,bottom:r.bottom};};
   return {columns:getComputedStyle(root.querySelector('.device-review-form-grid')).gridTemplateColumns,fields:['platform-select','version-select'].map(id=>{let select=root.querySelector('#'+id),field=select.closest('.device-review-field'),label=field.querySelector('label'),shown=select.classList.contains('caffoot-search-native')?select.nextElementSibling.querySelector('button'):select;const s=getComputedStyle(label);return {id,label:label.textContent,...rect(label),lineHeight:s.lineHeight,fontSize:s.fontSize,control:rect(shown),options:[...select.options].map(o=>o.value)};})};
  });
  if(width>700)assert.ok(Math.abs(software.fields[0].control.top-software.fields[1].control.top)<1,'Platform dropdowns must align');
  for(const field of software.fields)assert.ok(field.height>=17,'Full labels must remain readable');
  if(mode==='add'&&theme==='light'&&[1024,390].includes(width))await page.screenshot({path:path.join(out,'software-'+width+'.png')});
  await page.locator('#modal-content [role="tab"]').filter({hasText:'Networking',exact:true}).click();
  const networking=await page.locator('[data-action="create-subnet-from-device"]').evaluate(button=>{const hint=button.previousElementSibling,a=hint.getBoundingClientRect(),b=button.getBoundingClientRect();return {gap:b.top-a.bottom,hintClass:hint.className,buttonClass:button.className,buttonMargin:getComputedStyle(button).marginTop};});
  if(mode==='add'&&theme==='light'&&width===1024)await page.screenshot({path:path.join(out,'networking-1024.png')});
  assert.equal(networking.gap,15);
  results.push({width,theme,mode,software,networking});await close();
  console.log('Measured',width,theme,mode);
 }

 await page.setViewportSize({width:1440,height:950});
 const dimensionCases=await page.evaluate(()=>{
  const rack=appState.racks[0],original=JSON.stringify(rack),rows=[];
  switchTab('racks');selectedRackId=rack.id;v13RackSection='inventory';v13RackDetailOpen=true;activeRackTab='settings';
  for(const values of [{},{widthMm:750,depthMm:1000},{width:700,depth:'900mm'},{widthMm:null,width:'800 mm',depth:' 900mm '},{widthMm:'',width:700,depthMm:'invalid',depth:900}]){
   for(const key of ['widthMm','depthMm','width','depth'])delete rack[key];Object.assign(rack,values);renderContent();
   const details=[...document.querySelectorAll('.rack-editor-field')].map(e=>e.textContent.trim());
   openRackModal(rack.id);
   const inputs=['rack-width','rack-depth'].map(id=>({value:document.getElementById(id).value,disabled:document.getElementById(id).disabled}));
   closeModal(true);openRackModal(rack.id,true);
   const correction=['rack-width','rack-depth'].map(id=>({value:document.getElementById(id).value,disabled:document.getElementById(id).disabled}));closeModal(true);
   rows.push({values,details,inputs,correction,unchanged:JSON.stringify(rack)===JSON.stringify({...JSON.parse(original),...values})});
  }
  appState.racks[0]=JSON.parse(original);openRackModal();
  const defaults=['rack-width','rack-depth'].map(id=>document.getElementById(id).value);closeModal(true);renderContent();
  return {rows,defaults};
 });
 assert.deepEqual(dimensionCases.defaults,['600','600']);
 for(const [i,expected] of [['0',['','']],['1',['750','1000']],['2',['700','900']],['3',['800','900']],['4',['','']]]){
  const row=dimensionCases.rows[i];assert.deepEqual(row.inputs.map(x=>x.value),expected);assert.ok(row.inputs.every(x=>x.disabled));
  assert.deepEqual(row.correction.map(x=>x.value),expected);assert.ok(row.correction.every(x=>!x.disabled));
  for(const text of expected.map(x=>x?x+' mm':'Not Recorded'))assert.ok(row.details.some(d=>d.includes(text)),text);
 }
 await context.addInitScript(()=>{window.print=()=>{window.printCalls=(window.printCalls||0)+1;};});
 const originalPrint=await page.evaluate(()=>{
  const original=window.open;let html='',calls=0;
  window.open=()=>({document:{open(){},write(s){html=s;},close(){}},focus(){},print(){calls++;}});
  try{printRackElevation(appState.racks[0].id);}finally{window.open=original;}
  return {html,calls};
 });
 assert.equal(originalPrint.calls,1);
 await page.evaluate(()=>history.replaceState(null,'','?rack-print=same-tab'));
 const tabs=context.pages().length;
 for(let i=0;i<2;i++){
  await page.evaluate(()=>printRackElevation(appState.racks[0].id));
  await page.waitForFunction(()=>document.getElementById('rack-print-frame')?.contentWindow.printCalls===1);
  assert.equal(await page.locator('#rack-print-frame').count(),1);
  assert.equal(context.pages().length,tabs);
 }
 const frame=page.frames().find(f=>f.url()==='about:srcdoc');
 const frameHtml=await page.locator('#rack-print-frame').getAttribute('srcdoc');
 const withoutDate=html=>html.replace(/Printed [^<]+/,'Printed DATE');assert.equal(withoutDate(frameHtml),withoutDate(originalPrint.html));
 const standalone=await context.newPage();await standalone.setViewportSize({width:800,height:1100});await standalone.setContent(originalPrint.html);
 await standalone.emulateMedia({media:'print'});await page.emulateMedia({media:'print'});
 const measure=()=>({font:getComputedStyle(document.body).font,margin:getComputedStyle(document.body).margin,sections:[...document.querySelectorAll('section')].map(e=>({heading:e.querySelector('h2').textContent,height:e.getBoundingClientRect().height,rows:e.querySelectorAll('tr').length,tableWidth:e.querySelector('table').getBoundingClientRect().width})),toolbar:getComputedStyle(document.querySelector('.print-actions')).display});
 const baseline=await standalone.evaluate(measure),trial=await frame.evaluate(measure);assert.deepEqual(trial,baseline);
 for(const format of ['A4','Letter'])await standalone.pdf({path:path.join(out,'rack-print-'+format+'.pdf'),format,printBackground:true});
 await standalone.close();await page.emulateMedia({media:'screen'});
 await page.evaluate(()=>{document.getElementById('rack-print-frame').contentWindow.dispatchEvent(new Event('afterprint'));switchTab('devices');history.replaceState(null,'','/inventory');});
 assert.equal(await page.locator('#rack-print-frame').count(),0);
 const final=await page.evaluate(async()=>await(await fetch('/api/inventory/state')).json());
 for(const key of ['devices','subnets','racks','rackAccessories','ipAllocations','changeHistory'])assert.deepEqual(final[key],initial[key]);
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'regression.json'),JSON.stringify({results,dimensionCases,print:{defaultCalls:originalPrint.calls,identicalHtml:true,baseline,trial,nativeDialogTested:false,SafariTested:false},errors},null,2));
 console.log('Issue #306: 24 form cases, dimensions, unchanged print document and isolated trial passed');
};
