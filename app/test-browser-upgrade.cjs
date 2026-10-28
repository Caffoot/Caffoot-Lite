'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {pathToFileURL}=require('node:url'),{chromium}=require('playwright');
(async()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-upgrade-'));
 const source=path.join(__dirname,'dist','Caffoot-Lite.html');
 const moved=path.join(temp,'new-folder','Caffoot-Lite-test.html');fs.mkdirSync(path.dirname(moved),{recursive:true});fs.copyFileSync(source,moved);
 const browser=await chromium.launch({headless:true});
 try{
 const context=await browser.newContext({acceptDownloads:true});await context.setOffline(true);
 const page=await context.newPage(),errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});
 await page.route(/^https?:/,r=>r.abort());let approve=true,confirmations=0;
 page.on('dialog',async d=>{confirmations++;if(approve)await d.accept();else await d.dismiss();});
 const snapshot=()=>page.evaluate(()=>({active:JSON.stringify(appState),stored:localStorage.getItem('caffoot_state'),safety:localStorage.getItem('caffoot_phase11_pre_restore')}));
 const upload=async bytes=>{await page.locator('#import-file').setInputFiles({name:'example-backup.json',mimeType:'application/json',buffer:bytes});await page.waitForFunction(()=>!document.getElementById('import-file').value);};
 await page.goto(pathToFileURL(source).href);
 await upload(fs.readFileSync(path.join(__dirname,'fixtures','lite-schema-v1.example.json')));
 assert.equal((await page.evaluate(()=>appState.devices.length)),2);
 const downloadEvent=page.waitForEvent('download');await page.evaluate(()=>exportData());const download=await downloadEvent;const exported=path.join(temp,'exported.json');await download.saveAs(exported);const bytes=fs.readFileSync(exported),backup=JSON.parse(bytes);
 assert.equal(backup.caffootBackup.schemaVersion,1);assert.equal(backup.devices.length,2);
 const old=await snapshot();await page.goto(pathToFileURL(moved).href);
 const sharedStorage=(await snapshot()).stored===old.stored;
 // Do not assume browser-specific file storage scope: establish a separate destination inventory.
 await page.evaluate(()=>{appState=cloneDefaultData();if(!saveState())throw Error('Cannot save destination baseline');currentTab='settings';phase16ASection='backup';renderContent();});
 const baseline=await snapshot();approve=false;await upload(bytes);assert.deepEqual(await snapshot(),baseline,'Cancelled import into moved file must preserve destination');
 approve=true;await upload(bytes);
 const after=await snapshot();
 const inventory=await page.evaluate(()=>phase20CreateBackup());
 for(const key of Object.keys(backup).filter(k=>k!=='caffootBackup'))assert.equal(JSON.stringify(inventory[key]),JSON.stringify(backup[key]),'Moved-file restore must preserve '+key);
 assert.equal(after.safety,baseline.stored);
 await page.reload();assert.deepEqual(await snapshot(),after,'Restored inventory must persist in renamed file');
 // #192: legacy device-type history must remain read-only and survive backup round-trips.
 const legacy=JSON.parse(bytes);
 legacy.devices[0].previousTypeDetails=[{type:'Printer',details:{model:'Legacy fictional printer',serialNumber:'HISTORY-ONLY'}}];
 await upload(Buffer.from(JSON.stringify(legacy)));
 assert.equal(JSON.stringify(await page.evaluate(()=>appState.devices[0].previousTypeDetails)),JSON.stringify(legacy.devices[0].previousTypeDetails),'Legacy history must survive import');
 await page.evaluate(()=>phase14CViewDevice(appState.devices[0].id));
 await page.locator('#phase14c-tab-history').click();
 const historyModal=await page.locator('#modal-content').innerText();
 assert.match(historyModal,/Previous Device Type Details/,'Legacy history must remain visible');
 assert.match(historyModal,/Legacy fictional printer/,'Legacy snapshot fields must remain visible');
 assert.equal(await page.locator('[data-action="phase130-restore"]').count(),0,'Legacy history must not offer configuration restoration');
 await page.keyboard.press('Escape');
 const roundTrip=await page.evaluate(()=>phase20CreateBackup());
 assert.equal(JSON.stringify(roundTrip.devices[0].previousTypeDetails),JSON.stringify(legacy.devices[0].previousTypeDetails),'Legacy history must survive export');
 await page.reload();
 assert.equal(JSON.stringify(await page.evaluate(()=>appState.devices[0].previousTypeDetails)),JSON.stringify(legacy.devices[0].previousTypeDetails),'Legacy history must survive reload');
 await upload(bytes);
 assert.deepEqual(await snapshot(),after,'Original fixture must be restored after legacy-history check');
 const bad=JSON.parse(bytes);bad.caffootBackup.schemaVersion=2;const count=confirmations;await upload(Buffer.from(JSON.stringify(bad)));assert.deepEqual(await snapshot(),after);assert.equal(confirmations,count,'Unsupported schema must reject before confirmation');
 // The expected rejection is displayed in a modal; dismiss it before testing
 // controls behind the modal, and verify that dismissal leaves data untouched.
 await page.locator('#modal-container').waitFor({state:'visible'});
 await page.keyboard.press('Escape');
 await page.locator('#modal-container').waitFor({state:'hidden'});
 assert.deepEqual(await snapshot(),after,'Dismissing rejected backup error must preserve inventory');
 await page.evaluate(()=>{currentTab='settings';phase16ASection='backup';renderContent();});
 await page.locator('[data-action="caffoot-check-updates"]').click();assert.match(await page.locator('#caffoot-update-status').textContent(),/offline/i);
 await page.locator('[data-action="caffoot-update-guide"]').click();await page.getByRole('heading',{name:'Safely update Caffoot Lite'}).waitFor();await page.keyboard.press('Escape');
 await page.locator('[data-action="phase16a-section"][data-section="about"]').click();await page.locator('[data-action="caffoot-licences"]').click();assert.match(await page.locator('#modal-content').innerText(),/SIL OPEN FONT LICENSE/);await page.keyboard.press('Escape');
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);assert.equal(fs.readFileSync(exported,'utf8'),bytes.toString(),'Original backup file unchanged');
 await page.goto(pathToFileURL(source).href);assert.deepEqual(await snapshot(),sharedStorage?after:old,'Original path must reflect the observed shared or separate storage scope');
 console.log('Observed file storage: '+(sharedStorage?'shared across original and renamed paths':'separate per path')+'.');
 console.log('PASS: populated export, moved/renamed HTML restore, cancellation, future-schema rejection, persistence, offline update guide and embedded licences.');
 await context.close();
 }finally{await browser.close();fs.rmSync(temp,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
