// Rendered baseline and verification for the six approved Batch 02 findings.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const screens=[
 ['dashboard','dashboard'],['my-account','account'],['settings','settings'],
 ['devices-overview','devices','overview'],['device-inventory','devices','inventory'],
 ['device-editor','devices','overview','editor'],['device-management','devices','manufacturers'],
 ['ipam','ipam'],['racks','racks'],['users','users'],['audit','audit']
];
async function measure(page){return page.evaluate(()=>{
 const rect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};};
 const visible=e=>e&&e.getBoundingClientRect().height>0&&getComputedStyle(e).visibility!=='hidden';
 const samples={};
 for(const selector of ['body','.header h1','.crumb','.card','.card h3','.card p','.device-toolbar','.device-toolbar h2','.device-filter select','.device-table th','.device-table td','.device-empty strong','.device-review-panel','.device-review-panel h3','.device-review-field label','.device-review-field input','.device-review-field select','.app-modal-close','.personal-card','.personal-card h3','.audit-overview-note','.audit-warn','.intelligence-metric','.catalog-record','.catalog-record strong','.ipam-stat','.rack-directory-item','.users-live .card','.context']){
  const e=[...document.querySelectorAll(selector)].find(visible);if(!e)continue;const s=getComputedStyle(e);
  let background='';for(let p=e;p;p=p.parentElement){const c=getComputedStyle(p).backgroundColor;if(c!=='rgba(0, 0, 0, 0)'&&c!=='transparent'){background=c;break;}}
  samples[selector]={...rect(e),color:s.color,background:s.backgroundColor,effectiveBackground:background,border:s.borderColor,font:s.fontSize,lineHeight:s.lineHeight};
 }
 const nav=[...document.querySelectorAll('#sidebar .nav-item')].map(e=>{const s=getComputedStyle(e);return {label:e.dataset.tab,...rect(e),gap:s.gap,padding:s.padding,font:s.fontSize,lineHeight:s.lineHeight,icon:rect(e.querySelector('svg')),background:s.backgroundColor,color:s.color};});
 const tabs=document.querySelector('.approved-page-header .device-tabs,.approved-page-header .racks-tabs');
 const heading=[...document.querySelectorAll('#main-content h2')].find(visible),metrics=document.querySelector('.intelligence-metric-grid,.racks-grid');
 const spacing=tabs&&heading?{tabs:rect(tabs),heading:rect(heading),metrics:visible(metrics)?rect(metrics):null,gap:heading.getBoundingClientRect().top-tabs.getBoundingClientRect().bottom}:null;
 const allocation=[...document.querySelectorAll('[data-action="tab-ipam"].btn')].find(e=>e.textContent==='View IP Allocations');
 const stats=allocation?.closest('.card').querySelector('.db-legend');
 return {dark:document.documentElement.classList.contains('dark'),overflow:document.documentElement.scrollWidth>innerWidth,samples,nav,spacing,allocation:allocation?{action:rect(allocation),stats:rect(stats)}:null};
});}
module.exports=async function verifyOwnerBatch02({page,context,out}){
 const baseline=process.env.CAFFOOT_BATCH02_BASELINE==='1',results=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('https://127.0.0.1:8080/inventory');await page.locator('#app[aria-busy="false"]').waitFor();
 for(const width of [1440,390])for(const theme of ['light','dark']){
  await page.setViewportSize({width,height:width===1440?950:844});
  await page.evaluate(theme=>caffootSetTheme(theme),theme);
  for(const [name,tab,section,modal] of screens){
   await page.evaluate(({tab,section,modal})=>{
    closeModal(true);switchTab(tab);
    if(tab==='devices'){activeDeviceDetailsTab=section;renderContent();}
    if(tab==='racks'){v13RackSection='overview';renderContent();}
    if(modal==='editor')openDeviceModal();
   },{tab,section,modal});
   if(modal)await page.locator('#device-editor-form').waitFor();
   const values=await measure(page);results.push({screen:name,width,theme,...values});
   await page.screenshot({path:path.join(out,name+'-'+theme+'-'+width+'.png'),fullPage:!modal});
  }
  const anonymous=await context.browser().newContext({ignoreHTTPSErrors:true,viewport:{width,height:width===1440?950:844}});
  await anonymous.addInitScript(theme=>localStorage.setItem('caffoot_theme_preference',theme),theme);
  const login=await anonymous.newPage();await login.goto('https://127.0.0.1:8080/setup');await login.locator('#form:not([hidden])').waitFor();
  results.push({screen:'sign-in',width,theme,...await measure(login)});await login.screenshot({path:path.join(out,'sign-in-'+theme+'-'+width+'.png'),fullPage:true});await anonymous.close();
  console.log('Captured twelve screen areas',theme,width);
 }
 assert.deepEqual(errors,[],'Batch 02 browser errors');
 fs.writeFileSync(path.join(out,'batch-02-measurements.json'),JSON.stringify({baseline,results},null,2));
};
