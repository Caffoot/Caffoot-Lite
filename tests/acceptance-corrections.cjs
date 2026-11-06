// Exercise timeline buttons against real saved fictional events and the existing details dialog.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
module.exports=async({page,context,out})=>{
 const address='https://127.0.0.1:8080',results=[];
 await page.goto(address+'/inventory');await page.locator('#app[aria-busy="false"]').waitFor();await page.bringToFront();
 await page.evaluate(async()=>{
  const session=await(await fetch('/api/session')).json(),device={...appState.devices.find(d=>d.name==='Hypervisor-01')};
  const post=async(path,payload)=>{const response=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':session.csrf_token},body:JSON.stringify(payload)});const result=await response.json();if(!response.ok)throw Error('Fictional Audit fixture save failed');return result;};
  for(let index=0;index<12;index++){
   const reservation=await post('/api/devices/edit/start',{deviceId:device.id,section:'Devices'});
   device.notes='Fictional audit note '+index;
   await post('/api/devices/edit/save',{deviceId:device.id,revision:reservation.revision,section:'Devices',record:device});
  }
 });
 await page.reload();await page.locator('#app[aria-busy="false"]').waitFor();
 for(const width of [1440,1280,390,320])for(const dark of [false,true]){
  await page.setViewportSize({width,height:844});await page.evaluate(dark=>{caffootSetTheme(dark?'dark':'light');switchTab('audit');},dark);
  await page.locator('.audit-tab[data-tab="assets"]').click();await page.locator('.asset-item').filter({hasText:'Hypervisor-01'}).click();
  const buttons=page.locator('.timeline-list [data-action="audit-view-detail"]');assert.ok(await buttons.count()>=12);
  const first=buttons.first();assert.ok((await first.getAttribute('class')).split(' ').includes('audit-row-button'));
  const style=await first.evaluate(el=>{const s=getComputedStyle(el);return {radius:s.borderRadius,padding:s.padding,background:s.backgroundColor,border:s.borderStyle,font:s.fontSize};});
  assert.notEqual(style.radius,'0px');assert.notEqual(style.border,'outset');
  await first.focus();await page.keyboard.press('Enter');await page.locator('#audit-detail-layer:not([hidden])').waitFor();
  assert.match(await page.locator('#audit-detail-lead').textContent(),/Hypervisor-01/);assert.ok(await page.locator('#audit-detail-body').getByText('owner',{exact:true}).isVisible());
  await page.locator('[data-action="audit-close-detail"]').click();assert.ok(await first.evaluate(el=>el===document.activeElement));
  await buttons.last().click();await page.locator('#audit-detail-layer:not([hidden])').waitFor();assert.match(await page.locator('#audit-detail-lead').textContent(),/Hypervisor-01/);await page.locator('[data-action="audit-close-detail"]').click();
  const overflow=await page.evaluate(()=>{
   const styled=document.documentElement.scrollWidth-innerWidth;
   const buttons=[...document.querySelectorAll('.timeline-list .audit-row-button')];
   buttons.forEach(el=>el.classList.remove('audit-row-button'));
   const unstyled=document.documentElement.scrollWidth-innerWidth;
   buttons.forEach(el=>el.classList.add('audit-row-button'));
   return {styled,unstyled};
  });
  assert.equal(overflow.styled,overflow.unstyled,'Timeline styling must not introduce document overflow');
  assert.ok(await first.evaluate(el=>el.getBoundingClientRect().right<=el.closest('.timeline-entry').getBoundingClientRect().right+1));
  if(width===1440||width===390)await page.screenshot({path:path.join(out,`audit-history-${width}-${dark?'dark':'light'}.png`),fullPage:true});
  results.push({width,dark,overflow,events:await buttons.count(),style,keyboardAndClick:true,focusReturn:true});
 }
 fs.writeFileSync(path.join(out,'audit-button-results.json'),JSON.stringify(results,null,2));
 console.log('Audit timeline: eight layout/theme cases, twelve saved events, keyboard/click/details/focus passed.');
};
