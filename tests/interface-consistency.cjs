// Check the agreed navigation spacing, icons and keyboard access using isolated data.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');

module.exports=async({page,context,out})=>{
 const extrasOnly=process.env.CAFFOOT_INTERFACE_CONSISTENCY_EXTRAS==='1';
 const results=[],errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto('https://127.0.0.1:8080/inventory');
 await page.locator('#app[aria-busy="false"]').waitFor();
 await page.bringToFront();
 await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}'});
 const initial=await page.evaluate(async()=>await(await fetch('/api/inventory/state')).json());
 const icons={
  devices:{overview:'i-grid',inventory:'i-box',types:'i-box',locations:'i-network',manufacturers:'i-box',models:'i-box',software:'i-tool',services:'i-network'},
  ipam:{overview:'i-grid',addresses:'i-network',manage:'i-settings'},
  racks:{overview:'i-grid',inventory:'i-rack',accessories:'i-tool'},
  users:{overview:'i-grid',list:'i-users',add:'i-user'},
  audit:{activity:'i-history',assets:'i-box',coverage:'i-shield'},
  'rack-overview':{capacity:'i-rack',equipment:'i-box',locations:'i-network'},
  'rack-details':{view:'i-rack',equipment:'i-box',settings:'i-settings'}
 };
 const scenarios=[
  ...['overview','insights','activity'].map(value=>({screen:'dashboard',value})),
  ...Object.entries(icons).filter(([screen])=>!screen.startsWith('rack-')).flatMap(([screen,values])=>Object.keys(values).map(value=>({screen,value}))),
  ...['data','email','maintenance'].map(value=>({screen:'settings',value})),
  ...['overview','security','help','about'].map(value=>({screen:'account',value})),
  ...Object.keys(icons['rack-overview']).map(value=>({screen:'racks',group:'overview',value})),
  ...Object.keys(icons['rack-details']).map(value=>({screen:'racks',group:'details',value}))
 ];
 async function selectScreen(item,theme){
  await page.evaluate(({screen,value,group,theme})=>{
   caffootSetTheme(theme);switchTab(screen);
   if(screen==='dashboard')activeDashboardTab=value;
   if(screen==='devices'){activeDeviceDetailsTab=value;deviceIntelligenceTab='overview';}
   if(screen==='ipam')activeIpamTab=value;
   if(screen==='users')activeUsersTab=value;
   if(screen==='audit')activeAuditTab=value;
   if(screen==='settings')activeSettingsTab=value;
   if(screen==='account')activeAccountSection=value;
   if(screen==='racks'){
    v13RackSection=group==='details'?'inventory':group==='overview'?'overview':value;
    v13RackDetailOpen=group==='details';v13RackOverviewTab=group==='overview'?value:'capacity';
    activeRackTab=group==='details'?value:'view';selectedRackId=appState.racks[0]?.id||'';
   }
   renderContent();window.scrollTo(0,0);
  },{...item,theme});
  if(item.screen==='settings'&&item.value==='email')await page.waitForFunction(()=>smtpLoaded&&!smtpLoading);
  await page.evaluate(()=>new Promise(requestAnimationFrame));
 }
 async function measure(item){return page.evaluate(({screen,value,group})=>{
  const root=document.getElementById('main-content'),visible=e=>e&&e.getBoundingClientRect().height>0;
  const first=selector=>[...root.querySelectorAll(selector)].find(visible);
  const tabs=first({dashboard:'.dashboard-tabs',devices:'.approved-page-header .device-tabs',ipam:'.ipam-tabs',racks:'.racks-tabs',users:'.approved-page-header .tabs',settings:'.subnav',account:'.subnav',audit:'.audit-tabs'}[screen]);
  const entry=screen==='racks'&&group==='details'?first('.approved-page-body > *'):first({dashboard:'.dashboard-tab-panel.active > *',devices:'.approved-page-body > *',ipam:'.approved-page-body > .ipam-panel.active > *',racks:'.approved-page-body .racks-panel.active > *',users:'.users-live > .section.active > *',settings:'.account-panel.active > *',account:'.account-panel.active > *',audit:'.audit-stats'}[screen]);
  const audit=root.querySelector('.approved-audit');
  const navigation=[tabs,...root.querySelectorAll('.rack-subtabs')].map(strip=>({
   class:strip.className,
   buttons:[...strip.querySelectorAll(':scope > button')].map(button=>{
    const svg=button.querySelector('svg'),use=svg?.querySelector('use'),style=svg?getComputedStyle(svg):null;
    return {key:button.dataset.tab||button.dataset.view||button.dataset.sectionTab,label:button.textContent.trim(),icon:use?.getAttribute('href'),decorative:svg?.getAttribute('aria-hidden')==='true'&&svg?.getAttribute('focusable')==='false',symbolExists:!!document.querySelector(use?.getAttribute('href')||'symbol-not-present'),width:style?.width,height:style?.height,gap:getComputedStyle(button).gap};
   })
  }));
  const secondary=screen==='racks'&&v13RackSection==='overview'?first('.rack-subtabs'):null;
  const heading=screen==='racks'&&v13RackSection==='overview'?first('.racks-hub-bar'):null;
  const metrics=screen==='racks'&&v13RackSection==='overview'?first('#rack-overview-stats'):null;
  return {screen,value,group,entrance:entry.getBoundingClientRect().top-tabs.getBoundingClientRect().bottom,overflow:document.documentElement.scrollWidth>innerWidth,navigation,
   audit:audit?{order:[...audit.querySelector('main').children].filter(visible).map(e=>e.className),totals:[...audit.querySelectorAll('.audit-stat .value')].map(e=>e.textContent),paneGap:first('.audit-pane:not([hidden]) > *').getBoundingClientRect().top-audit.querySelector('.audit-stats').getBoundingClientRect().bottom,notice:audit.querySelector('.audit-overview-note').textContent,security:audit.querySelector('.audit-warn').textContent}:null,
   rack:secondary?{headingGap:secondary.getBoundingClientRect().top-heading.getBoundingClientRect().bottom,stripHeight:secondary.getBoundingClientRect().height,metricsGap:metrics.getBoundingClientRect().top-secondary.getBoundingClientRect().bottom}:null};
 },item);}
 for(const width of extrasOnly?[]:[2560,1440,1024,390])for(const theme of ['light','dark']){
  await page.setViewportSize({width,height:width===2560?1440:width===1440?950:width===1024?768:844});
  let auditTotals;
  for(const item of scenarios){
   await selectScreen(item,theme);const result=await measure(item);
   assert.ok(Math.abs(result.entrance-16)<.1,JSON.stringify({width,theme,...result}));
   assert.equal(result.overflow,false,'No document overflow in '+item.screen+' '+item.value);
   const expected=icons[item.screen];
   if(expected)assert.deepEqual(result.navigation[0].buttons.map(button=>[button.key,button.icon]),Object.entries(expected).map(([key,icon])=>[key,'#'+icon]));
   if(item.screen==='racks'){
    const secondary=item.group==='details'?'rack-details':item.group==='overview'||item.value==='overview'?'rack-overview':null;
    if(secondary)assert.deepEqual(result.navigation[1].buttons.map(button=>[button.key,button.icon]),Object.entries(icons[secondary]).map(([key,icon])=>[key,'#'+icon]));
   }
   for(const navigation of result.navigation)for(const button of navigation.buttons){
    if(!button.icon)continue;
    assert.equal(button.symbolExists,true);
    if(expected){assert.equal(button.width,'18px');assert.equal(button.height,'18px');assert.equal(button.decorative,true);assert.equal(button.gap,'8px');}
   }
   if(result.audit){
    assert.ok(result.audit.order.indexOf('audit-tabs')<result.audit.order.indexOf('audit-stats'));
    assert.equal(result.audit.totals.length,4);if(auditTotals)assert.deepEqual(result.audit.totals,auditTotals);auditTotals=result.audit.totals;
    assert.equal(result.audit.paneGap,20);
    assert.match(result.audit.notice,/View changes you have permission to see/);
    assert.match(result.audit.security,/without storing passwords, authentication codes or other sensitive credentials/);
   }
   if(result.rack){assert.equal(result.rack.headingGap,width===390?14:17);assert.equal(result.rack.stripHeight,55);assert.equal(result.rack.metricsGap,19);}
   results.push({width,theme,...result});
   if(['dashboard','ipam','audit','racks'].includes(item.screen)&&['overview','activity'].includes(item.value)&&!item.group&&[1440,390].includes(width))await page.screenshot({path:path.join(out,item.screen+'-'+theme+'-'+width+'.png'),fullPage:false});
  }
  console.log('Navigation layout checked',width,theme);
 }
 const keyboard=[];
 const controls=Object.entries(icons).flatMap(([name,values])=>Object.keys(values).map(value=>({screen:name.startsWith('rack-')?'racks':name,group:name==='rack-overview'?'overview':name==='rack-details'?'details':undefined,value})));
 for(const width of extrasOnly?[]:[1440,390])for(const theme of ['light','dark']){
  await page.setViewportSize({width,height:width===390?844:950});
  for(const item of controls)for(const key of ['Enter','Space']){
   await selectScreen({...item,value:item.group==='details'?'view':item.group==='overview'?'capacity':item.screen==='audit'?'activity':'overview'},theme);
   const selector=item.group==='overview'?'[data-action="v13-overview-tab"][data-tab="'+item.value+'"]':item.group==='details'?'[data-action="select-rack-tab"][data-tab="'+item.value+'"]':{devices:'[data-action="approved-device-section"][data-tab="',ipam:'[data-action="approved-ipam-section"][data-view="',racks:'[data-action="approved-rack-section"][data-section-tab="',users:'[data-action="approved-users-section"][data-tab="',audit:'[data-action="audit-section"][data-tab="'}[item.screen]+item.value+'"]';
   const button=page.locator(selector).first();
   const scroll=await page.evaluate(()=>({x:scrollX,y:scrollY}));await button.focus();
   const focused=await button.evaluate(button=>{const b=button.getBoundingClientRect(),s=button.parentElement.getBoundingClientRect();return {label:button.textContent.trim(),focused:document.activeElement===button,visible:b.left>=s.left-1&&b.right<=s.right+1,x:scrollX,y:scrollY};});
   assert.equal(focused.focused,true);assert.equal(focused.visible,true,'Complete focused label: '+JSON.stringify(item));
   assert.equal(focused.x,scroll.x);assert.equal(focused.y,scroll.y);
   const response=item.group?page.waitForResponse(r=>r.url().endsWith('/api/inventory/state')&&r.request().method()==='GET'):null;
   await page.keyboard.press(key);if(response)await response;
   await page.waitForFunction(({screen,group,value})=>({devices:activeDeviceDetailsTab,ipam:activeIpamTab,users:activeUsersTab,audit:activeAuditTab,racks:group==='overview'?v13RackOverviewTab:group==='details'?activeRackTab:v13RackSection}[screen]===value),item);
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   keyboard.push({...item,width,theme,key,...focused});
  }
  console.log('Navigation keyboard checked',width,theme);
 }
 // Existing button semantics still provide ordinary forward and backward keyboard focus.
 await selectScreen({screen:'devices',value:'overview'},'light');
 await page.locator('.device-tabs > button').first().focus();await page.keyboard.press('Tab');
 assert.equal(await page.evaluate(()=>document.activeElement?.dataset.tab),'inventory');
 await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement?.dataset.tab),'overview');
 // Audit export must retain the exact permission-filtered records provided by the server.
 await selectScreen({screen:'audit',value:'activity'},'light');
 const history=await page.evaluate(()=>JSON.parse(JSON.stringify(auditHistory)));
 const downloadPromise=page.waitForEvent('download');await page.locator('[data-action="export-audit"]').click();
 const download=await downloadPromise;assert.deepEqual(JSON.parse(fs.readFileSync(await download.path(),'utf8')).events,history);
 const enlarged=[],empty=[];
 if(extrasOnly){
  const textStyle=await page.addStyleTag({content:'#main-content :is(.subnav,.tabs,.ipam-tabs,.racks-tabs,.rack-subtabs,.audit-tabs) > button {font-size:18px;}'});
  for(const width of [1024,390])for(const theme of ['light','dark']){
   await page.setViewportSize({width,height:width===390?844:768});
   for(const item of [{screen:'dashboard',value:'overview'},{screen:'devices',value:'overview'},{screen:'ipam',value:'manage'},{screen:'racks',group:'overview',value:'locations'},{screen:'racks',group:'details',value:'settings'},{screen:'users',value:'list'},{screen:'audit',value:'coverage'},{screen:'settings',value:'email'},{screen:'account',value:'security'}]){
    await selectScreen(item,theme);const layout=await measure(item);assert.equal(layout.entrance,16);assert.equal(layout.overflow,false);
    const labels=await page.locator('#main-content .section-tab-control').evaluateAll(buttons=>{
     const visible=buttons.filter(b=>b.getBoundingClientRect().height>0),selected=visible.map(b=>[b.getAttribute('aria-selected'),b.getAttribute('aria-pressed')]);
     const positions=visible.map(b=>{b.focus({preventScroll:true});const r=b.getBoundingClientRect(),s=b.parentElement.getBoundingClientRect();return {label:b.textContent.trim(),visible:r.left>=s.left-1&&r.right<=s.right+1,nowrap:getComputedStyle(b).whiteSpace==='nowrap'};});
     return {positions,selectionUnchanged:JSON.stringify(selected)===JSON.stringify(visible.map(b=>[b.getAttribute('aria-selected'),b.getAttribute('aria-pressed')]))};
    });
    assert.equal(labels.selectionUnchanged,true);assert.ok(labels.positions.every(p=>p.visible&&p.nowrap));enlarged.push({width,theme,...item,labels});
   }
  }
  await textStyle.evaluate(el=>el.remove());
  const saved=await page.evaluate(()=>JSON.stringify({state:appState,history:auditHistory}));
  await page.evaluate(()=>{appState.devices=[];appState.racks=[];appState.rackAccessories=[];appState.subnets=[];appState.vlans=[];appState.ipAllocations={};auditHistory=[];});
  for(const width of [1440,390])for(const theme of ['light','dark']){
   await page.setViewportSize({width,height:width===390?844:950});
   for(const item of [{screen:'dashboard',value:'overview'},{screen:'devices',value:'inventory'},{screen:'ipam',value:'overview'},{screen:'racks',value:'overview'},{screen:'audit',value:'activity'}]){
    await selectScreen(item,theme);const layout=await measure(item);assert.equal(layout.entrance,16);assert.equal(layout.overflow,false);empty.push({width,theme,...layout});
   }
  }
  await page.evaluate(saved=>{const data=JSON.parse(saved);appState=data.state;auditHistory=data.history;renderContent();},saved);
 }
 const final=await page.evaluate(async()=>await(await fetch('/api/inventory/state')).json());assert.deepEqual(final,initial);assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,extrasOnly?'navigation-extras.json':'navigation-checks.json'),JSON.stringify({results,keyboard,enlarged,empty,inventoryUnchanged:true,errors},null,2));
 console.log('Interface consistency passed:',results.length,'layouts,',keyboard.length,'keyboard activations,',enlarged.length,'enlarged-label states and',empty.length,'empty-inventory states');
};
