// Owner-approved Issue #305 comparisons, reusing the isolated approved visual runner.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
module.exports=async({page,out})=>{
 const baseline=process.env.CAFFOOT_ISSUE305_BASELINE==='1',results=[],errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('https://127.0.0.1:8080/inventory');await page.locator('#app[aria-busy="false"]').waitFor();
 await page.bringToFront();
 await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}'});
 const initialState=await page.evaluate(async()=>await(await fetch('/api/inventory/state')).json());
 async function measure(kind){return page.evaluate(kind=>{
  const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom};};
  const device=kind==='devices';
  const heading=document.querySelector(device?'.intelligence-heading':'.racks-panel[data-panel="overview"] .racks-hub-bar');
  const tabs=document.querySelector(device?'.intelligence-pills':'.racks-panel[data-panel="overview"] > .rack-subtabs');
  const metrics=document.querySelector(device?'.intelligence-grid':'#rack-overview-stats');
  const insights=document.querySelector(device?'.intelligence-panel[data-insight-panel="overview"] > .intelligence-two':'#rack-overview-insights');
  const mainTabs=document.querySelector(device?'.device-tabs':'.racks-tabs');
  const cards=[...metrics.children];
  const r={heading:rect(heading),tabs:rect(tabs),metrics:rect(metrics),insights:rect(insights)};
  const style=getComputedStyle(metrics);
  return {...r,mainGap:r.heading.y-mainTabs.getBoundingClientRect().bottom,headingToTabs:r.tabs.y-r.heading.bottom,tabsToMetrics:r.metrics.y-r.tabs.bottom,metricsToInsights:r.insights.y-r.metrics.bottom,metricRowGap:parseFloat(style.rowGap),metricColumnGap:parseFloat(style.columnGap),referenceInsightGap:device?parseFloat(getComputedStyle(insights).gap):null,metricsVisible:cards.every(e=>e.getBoundingClientRect().height>0),metricsText:cards.map(e=>e.textContent.trim()),content:insights.textContent.trim(),chartValues:[...insights.querySelectorAll('[role="img"]')].map(e=>e.getAttribute('aria-label')),overflow:document.documentElement.scrollWidth>innerWidth,insightGroups:[...insights.querySelectorAll(':scope > *,:scope > .space-y-4 > *,:scope > .space-y-4 > .grid > *')].map(e=>({...rect(e),class:e.className,marginTop:getComputedStyle(e).marginTop,gap:getComputedStyle(e).gap}))};
 },kind);}
 try{
  for(const width of [1440,390])for(const theme of ['light','dark']){
   await page.setViewportSize({width,height:width===1440?950:844});
   await page.evaluate(theme=>{closeModal(true);caffootSetTheme(theme);switchTab('devices');activeDeviceDetailsTab='overview';deviceIntelligenceTab='overview';renderContent();},theme);
   if(process.env.CAFFOOT_ISSUE305_ACTIONS_ONLY==='1'){
    await page.evaluate(()=>{switchTab('racks');v13RackSection='overview';v13RackOverviewTab='locations';renderContent();});
    const strip=page.locator('.racks-panel[data-panel="overview"] > .rack-subtabs');
    await strip.evaluate(e=>e.scrollLeft=e.scrollWidth);
    const reachable=await strip.evaluate(e=>{const a=e.querySelector('.active').getBoundingClientRect(),b=e.getBoundingClientRect();return a.left>=b.left&&a.right<=b.right+1;});
    assert.ok(reachable,'Locations & Types remains reachable by horizontal scrolling');
    await page.screenshot({path:path.join(out,'rack-scroll-'+theme+'-'+width+'.png'),fullPage:true});
    await page.locator('[data-action="v13-overview-tab"][data-tab="capacity"]').focus();await page.keyboard.press('Enter');
    await page.waitForFunction(()=>v13RackOverviewTab==='capacity');assert.equal(await page.locator('#rack-overview-stats > .rack-stat').count(),4);
    const backup=await page.evaluate(()=>JSON.stringify({racks:appState.racks,devices:appState.devices,rackAccessories:appState.rackAccessories}));
    for(const tab of ['capacity','equipment','locations']){
     await page.evaluate(tab=>{appState.racks=[];appState.devices=[];appState.rackAccessories=[];v13RackOverviewTab=tab;renderContent();},tab);
     const values=await page.locator('#rack-overview-stats strong').allTextContents();assert.deepEqual(values,['0','0U','0','0']);
     const empty=await measure('racks');assert.equal(empty.metricsVisible,true);assert.equal(empty.overflow,false);
     results.push({screen:'empty-'+tab,width,theme,...empty});
    }
    await page.evaluate(backup=>{Object.assign(appState,JSON.parse(backup));switchTab('audit');activeAuditTab='coverage';renderContent();},backup);
    const history=await page.evaluate(()=>JSON.parse(JSON.stringify(auditHistory)));
    const waiting=page.waitForEvent('download');await page.locator('[data-action="export-audit"]').click();const download=await waiting;
    const exported=JSON.parse(fs.readFileSync(await download.path(),'utf8'));assert.deepEqual(exported.events,history);assert.ok(Number.isFinite(Date.parse(exported.exportedAt)));
    results.push({screen:'actions',width,theme,keyboard:true,horizontalScroll:true,auditExportEvents:exported.events.length});
    console.log('Checked Issue #305 actions',width,theme);continue;
   }
   await page.waitForTimeout(220);
   const reference=await measure('devices');results.push({screen:'devices',width,theme,...reference});
   await page.screenshot({path:path.join(out,'devices-'+theme+'-'+width+'.png'),fullPage:true});
   if(process.env.CAFFOOT_ISSUE305_MEASURE_ONLY==='1')continue;
   await page.evaluate(()=>{switchTab('racks');v13RackSection='overview';renderContent();});
   for(const tab of ['capacity','equipment','locations']){
    await page.locator('[data-action="v13-overview-tab"][data-tab="'+tab+'"]').click();
    await page.waitForFunction(tab=>v13RackOverviewTab===tab,tab);await page.waitForTimeout(80);
    const actual=await measure('racks');results.push({screen:'racks-'+tab,width,theme,...actual});
    assert.equal(actual.metricsVisible,true,'All four shared metrics visible on '+tab);
    assert.equal(actual.metricsText.length,4);assert.equal(actual.overflow,false);
    if(!baseline){
     for(const key of ['mainGap','headingToTabs','tabsToMetrics','metricsToInsights','metricRowGap','metricColumnGap'])
      assert.ok(Math.abs(actual[key]-reference[key])<.1,tab+' matches measured Devices '+key+': '+actual[key]+' vs '+reference[key]);
     assert.equal(actual.tabs.height,reference.tabs.height,'Secondary strip uses measured Device height');
     const groups=await page.locator('#rack-overview-insights,#rack-overview-insights .rack-overview-stack,#rack-overview-insights .rack-overview-grid').evaluateAll(es=>es.map(e=>parseFloat(getComputedStyle(e).gap)));
     assert.ok(groups.every(g=>g===reference.referenceInsightGap),'Insight group gaps match Devices');
     assert.ok(actual.tabs.bottom<=actual.metrics.y&&actual.metrics.bottom<=actual.insights.y,'Approved secondary tabs → metrics → insights order');
     const old=JSON.parse(fs.readFileSync(path.join(__dirname,'../docs/development-handovers/evidence/issue-305/baseline.json'))).results.find(r=>r.screen==='racks-'+tab&&r.width===width&&r.theme===theme);
     for(const key of ['metricsText','content','chartValues'])assert.deepEqual(actual[key],old[key],tab+' preserves '+key);
    }
    await page.screenshot({path:path.join(out,'racks-'+tab+'-'+theme+'-'+width+'.png'),fullPage:true});
   }
   // The selected overview insight survives leaving and returning to the main section.
   for(const section of ['inventory','accessories','overview']){
    await page.locator('[data-action="approved-rack-section"][data-section-tab="'+section+'"]').click();
    if(section==='overview')assert.equal(await page.locator('[data-action="v13-overview-tab"][aria-pressed="true"]').getAttribute('data-tab'),'locations');
    else{
     const value=await page.locator('#main-content').evaluate(e=>({text:e.textContent.trim(),overflow:document.documentElement.scrollWidth>innerWidth}));
     results.push({screen:'rack-'+section,width,theme,...value});assert.equal(value.overflow,false);
    }
   }
   await page.locator('#sidebar [data-tab="audit"]').click();await page.waitForFunction(()=>currentTab==='audit');
   await page.locator('.audit-tab[data-tab="coverage"]').click();
   const audit=await page.locator('#main-content').evaluate(e=>({cards:[...e.querySelectorAll('.coverage-card')].map(c=>({heading:c.querySelector('.big').textContent,description:c.querySelector('p').textContent,label:c.querySelector('.eyebrow')?.textContent||null})),statuses:[...e.querySelectorAll('.coverage-status')].map(c=>c.textContent),notice:e.querySelector('.audit-warn').textContent,overflow:document.documentElement.scrollWidth>innerWidth}));
   results.push({screen:'audit',width,theme,...audit});assert.equal(audit.overflow,false);
   if(!baseline){
    assert.equal(audit.cards.length,3);assert.ok(audit.cards.every(c=>c.label===null),'Only redundant card labels removed');
    const old=JSON.parse(fs.readFileSync(path.join(__dirname,'../docs/development-handovers/evidence/issue-305/baseline.json'))).results.find(r=>r.screen==='audit'&&r.width===width&&r.theme===theme);
    assert.deepEqual(audit.cards.map(({heading,description})=>({heading,description})),old.cards.map(({heading,description})=>({heading,description})));
    for(const key of ['statuses','notice'])assert.deepEqual(audit[key],old[key]);
   }
   await page.screenshot({path:path.join(out,'audit-'+theme+'-'+width+'.png'),fullPage:true});
   console.log('Checked Issue #305',width,theme);
  }
  const finalState=await page.evaluate(async()=>await(await fetch('/api/inventory/state')).json());
  assert.deepEqual(finalState,initialState,'Navigation and visual checks preserve SQLite inventory/history');
  assert.deepEqual(errors,[]);
 }finally{fs.writeFileSync(path.join(out,'measurements.json'),JSON.stringify({baseline,errors,results},null,2));}
};
