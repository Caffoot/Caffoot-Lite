'use strict';
const assert = require('node:assert/strict');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium} = require('playwright');

(async () => {
  const browser=await chromium.launch({headless:true});
  try {
    const context=await browser.newContext();
    const page=await context.newPage();
    const errors=[], requests=[];
    let acceptRestore=false, confirmations=0;
    page.on('pageerror',e=>errors.push(e.message));
    page.on('request',r=>{if(/^https?:/i.test(r.url())) requests.push(r.url());});
    page.on('dialog',async d=>{confirmations++; if(acceptRestore) await d.accept(); else await d.dismiss();});
    await page.route(/^https?:/i,r=>r.abort('blockedbyclient'));
    await page.goto(pathToFileURL(path.join(__dirname,'dist','Caffoot-Lite.html')).href,{waitUntil:'load'});
    const initial=await page.evaluate(()=>{
      if(!saveState()) throw Error('Could not establish baseline');
      return {stored:localStorage.getItem('caffoot_state'), active:JSON.stringify(appState)};
    });
    const backup=JSON.parse(initial.active);
    backup.browserRestoreTestMarker='validated-browser-restore';
    const bytes=Buffer.from(JSON.stringify(backup));
    async function upload(name) {
      await page.locator('#import-file').setInputFiles({name:name+'.json',mimeType:'application/json',buffer:bytes});
      await page.waitForFunction(()=>document.getElementById('import-file').value==='');
    }
    async function snapshot() {
      return page.evaluate(()=>({stored:localStorage.getItem('caffoot_state'),active:JSON.stringify(appState),
        safety:localStorage.getItem('caffoot_phase11_pre_restore')}));
    }
    const before=await snapshot();
    await upload('cancelled');
    assert.equal(confirmations,1,'Valid backup should prompt for approval');
    assert.deepEqual(await snapshot(),before,'Cancelled restore must not alter inventory or safety snapshot');
    console.log('PASS: cancelled restore preserves active and saved inventory');

    acceptRestore=true;
    await page.evaluate(()=>{window.__originalSaveState=saveState;saveState=()=>false;});
    await upload('failed-save');
    await page.evaluate(()=>{saveState=window.__originalSaveState;delete window.__originalSaveState;});
    assert.equal(confirmations,2,'Failed-save restore should request approval');
    assert.deepEqual(await snapshot(),before,'Failed save must roll back inventory and safety snapshot');
    console.log('PASS: simulated save failure rolls back inventory');

    await upload('successful');
    assert.equal(confirmations,3,'Successful restore should request approval');
    const after=await snapshot();
    assert.equal(JSON.parse(after.stored).browserRestoreTestMarker,'validated-browser-restore','Restored marker must be saved');
    assert.equal(JSON.parse(after.active).browserRestoreTestMarker,'validated-browser-restore','Restored marker must be active');
    assert.equal(after.safety,before.stored,'Pre-restore safety snapshot must preserve original inventory');
    await page.reload({waitUntil:'load'});
    const reloaded=await page.evaluate(()=>({
      marker:appState.browserRestoreTestMarker,
      stored:localStorage.getItem('caffoot_state'),
      safety:localStorage.getItem('caffoot_phase11_pre_restore')
    }));
    assert.equal(reloaded.marker,'validated-browser-restore','Restored inventory must survive browser reload');
    assert.equal(reloaded.stored,after.stored,'Saved inventory must survive reload unchanged');
    assert.equal(reloaded.safety,before.stored,'Safety snapshot must survive reload');
    assert.deepEqual(requests,[],'Restore must not use internet');
    assert.deepEqual(errors,[],'Restore must not produce uncaught browser exceptions');
    console.log('PASS: approved restore survives reload and retains original safety snapshot');
    await context.close();
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
