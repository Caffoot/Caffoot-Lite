'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');

(async()=>{
 const root=process.env.CAFFOOT_RELEASE_DIR;
 assert(root,'CAFFOOT_RELEASE_DIR must point to downloaded official release assets');
 const oldHtml=path.join(root,'1.2.1','Caffoot-Lite.html');
 const newHtml=path.join(root,'1.3.0','Caffoot-Lite.html');
 for(const file of [oldHtml,newHtml])assert(fs.statSync(file).size>100000,'Missing published HTML: '+file);
 const browser=await chromium.launch({headless:true});
 try{
  const context=await browser.newContext({acceptDownloads:true});
  await context.setOffline(true);
  const page=await context.newPage();
  const errors=[],requests=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(/^https?:/i.test(r.url()))requests.push(r.url())});
  await page.route(/^https?:/i,r=>r.abort('blockedbyclient'));
  page.on('dialog',d=>d.accept());
  const upload=async bytes=>{
    await page.locator('#import-file').setInputFiles({name:'v121-published-export.json',mimeType:'application/json',buffer:bytes});
    await page.waitForFunction(()=>document.getElementById('import-file').value==='');
  };
  await page.goto(pathToFileURL(oldHtml).href,{waitUntil:'load'});
  // Populate the genuine published v1.2.1 application using a tracked, non-personal inventory.
  const fixture=fs.readFileSync(path.join(__dirname,'fixtures','lite-schema-v1.example.json'));
  await upload(fixture);
  const oldCount=await page.evaluate(()=>appState.devices.length);
  assert(oldCount>0,'Published v1.2.1 did not load populated fixture');
  const downloadPromise=page.waitForEvent('download');
  await page.evaluate(()=>exportData());
  const download=await downloadPromise;
  const temp=path.join(root,'v121-export.json');
  await download.saveAs(temp);
  const exported=fs.readFileSync(temp);
  const backup=JSON.parse(exported);
  assert.equal(backup.devices.length,oldCount,'Export lost devices');
  console.log('PASS: published v1.2.1 imported populated test inventory and exported genuine backup');
  await page.goto(pathToFileURL(newHtml).href,{waitUntil:'load'});
  await upload(exported);
  const result=await page.evaluate(()=>({
    stored:localStorage.getItem('caffoot_state'),
    devices:appState.devices,
    racks:appState.racks,
    subnets:appState.subnets,
    locations:appState.deviceLocations,
    safety:localStorage.getItem('caffoot_phase11_pre_restore')
  }));
  assert(result.stored,'Published v1.3.0 did not persist imported inventory');
  for(const key of ['devices','racks','subnets','deviceLocations']){
    const actual=key==='deviceLocations'?result.locations:result[key];
    assert.deepEqual(actual,backup[key],'Published v1.3.0 changed imported '+key);
  }
  await page.reload({waitUntil:'load'});
  const after=await page.evaluate(()=>localStorage.getItem('caffoot_state'));
  assert.equal(after,result.stored,'Imported inventory did not persist across reload');
  assert.deepEqual(requests,[],'Published applications attempted network requests while offline');
  assert.deepEqual(errors,[],'Published applications caused uncaught browser errors');
  console.log('PASS: genuine v1.2.1 export imported into published v1.3.0, preserved core inventory and survived reload');
  await context.close();
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
