// Check the integrated dashboard against persisted stock and capture only its four review views.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn,spawnSync}=require('node:child_process'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),temporary=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-dashboard-'));
const output=process.env.CAFFOOT_DASHBOARD_OUTPUT||path.join(temporary,'evidence');
const database=path.join(temporary,'inventory.sqlite3'),address='https://127.0.0.1:8120';
let browser,server;
function python(code,args=[]){const result=spawnSync('python3',['-c',code,...args],{cwd:root,encoding:'utf8',env:{...process.env,PYTHONDONTWRITEBYTECODE:'1',PYTHONPATH:'tests:.'}});assert.equal(result.status,0,result.stderr);return result.stdout.trim();}
async function main(){
 const seeded=spawnSync('python3',['tests/visual_fixtures.py',temporary],{cwd:root,encoding:'utf8'});assert.equal(seeded.status,0,seeded.stderr);
 const credentials=JSON.parse(fs.readFileSync(path.join(temporary,'test-credentials.json')));
 python(`import sqlite3,sys
from backend.permissions import create_user
with sqlite3.connect(sys.argv[1]) as db:
 db.execute('PRAGMA foreign_keys=ON')
 for name,devices in [('dashboard-reader',True),('dashboard-assets-only',False)]:
  identity=create_user(db,1,name,'Fictional-Account-Password-2026!')
  db.execute('UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?',(sys.argv[2],identity))
  db.execute("INSERT INTO account_permission_overrides VALUES(?,'IT Assets','read')",(identity,))
  if devices: db.execute("INSERT INTO account_permission_overrides VALUES(?,'Devices','read')",(identity,))
  db.commit()
 db.execute("INSERT INTO staff_members(id,first_name,last_name) VALUES('dashboard-recipient','Morgan','Reed')")
 db.commit()`,[database,credentials.secret]);
 const log=fs.openSync(path.join(temporary,'server.log'),'w');
 server=spawn('python3',['-c','import backend.server as server;server.PORT=8120;server.main()'],{cwd:root,stdio:['ignore',log,log],env:{...process.env,PYTHONDONTWRITEBYTECODE:'1',CAFFOOT_DB_PATH:database,CAFFOOT_TLS_DIR:path.join(temporary,'tls'),CAFFOOT_WEB_ADDRESS:address,CAFFOOT_SERVER_ADDRESS:'127.0.0.1',CAFFOOT_HOST:'127.0.0.1'}});
 browser=await chromium.launch({headless:true,executablePath:process.env.CAFFOOT_CHROMIUM_PATH||undefined});
 const owner=await browser.newContext({ignoreHTTPSErrors:true,locale:'en-GB',viewport:{width:1440,height:1050}});
 for(let attempt=0;attempt<60;attempt++){try{if((await owner.request.get(address+'/health',{timeout:750})).ok())break;}catch{}await new Promise(resolve=>setTimeout(resolve,150));}
 const code=()=>python('import sys,time;from backend.mfa import code_at;print(code_at(sys.argv[1],time.time()))',[credentials.secret]);
 async function login(context,username,password){const response=await context.request.post(address+'/api/login',{headers:{Origin:address},data:{username,password,mfa_code:code()}});assert.equal(response.status(),200,await response.text());return (await context.request.get(address+'/api/session')).json();}
 const session=await login(owner,credentials.username,credentials.password);
 async function post(route,data){const response=await owner.request.post(address+route,{headers:{Origin:address,'X-CSRF-Token':session.csrf_token},data});assert.equal(response.status(),200,await response.text());return response.json();}
 async function stock(){return (await owner.request.get(address+'/api/it-assets/stock')).json();}
 const today=new Date().toISOString().slice(0,10),older=new Date(Date.now()-45*86400000).toISOString().slice(0,10);
 await post('/api/settings/features',{feature:'it_assets',enabled:true});
 async function receive(category,model,quantity,ready,trackingMode='quantity',receivedOn=today){return post('/api/it-assets/receive',{operationId:crypto.randomUUID(),item:{category,trackingMode,manufacturer:'',model,sharedSpecifications:{}},quantity,receivedOn,readyQuantity:ready,checks:{itemsChecked:ready>0,conditionChecked:ready>0},supplier:'Local Purchasing',notes:'Persisted dashboard test stock'});}
 const keyboards=await receive('Keyboard','Office Keyboard',12,4),monitors=await receive('Monitor','24-inch Display',8,6);
 await receive('Docking Station','USB-C Dock',1,1,'individual');
 await receive('Mouse','Wireless Mouse',6,6,'quantity',older);
 const laptops=await receive('Laptop','Portable Workstation',1,1);
 let data=await stock(),keyboard=data.items.find(row=>row.id===keyboards.stockItemId),laptop=data.items.find(row=>row.id===laptops.stockItemId);
 await post('/api/it-assets/register-device',{operationId:crypto.randomUUID(),stockItemId:laptop.id,version:laptop.version,record:{id:crypto.randomUUID().replaceAll('-',''),name:'Portable-01',type:'Laptop',status:'Active',manufacturer:'',model:'Portable Workstation',serialNumber:'',primaryIp:'',mountType:'Desktop',location:'Unknown',typeDetails:{}}});
 data=await stock();laptop=data.items.find(row=>row.id===laptop.id);
 await post('/api/it-assets/readiness',{operationId:crypto.randomUUID(),stockItemId:laptop.id,version:laptop.version,readyQuantity:1,minimumStockLevel:1,checks:{itemsChecked:true,conditionChecked:true},reason:''});
 await post('/api/it-assets/issue',{operationId:crypto.randomUUID(),stockItemId:keyboard.id,version:keyboard.version,quantity:2,recipientKind:'staff',recipientId:'dashboard-recipient',issuedOn:today,note:''});
 data=await stock();keyboard=data.items.find(row=>row.id===keyboard.id);
 await post('/api/it-assets/readiness',{operationId:crypto.randomUUID(),stockItemId:keyboard.id,version:keyboard.version,readyQuantity:2,minimumStockLevel:3,checks:{itemsChecked:true,conditionChecked:true},reason:''});
 data=await stock();const monitor=data.items.find(row=>row.id===monitors.stockItemId);
 await post('/api/it-assets/write-off',{operationId:crypto.randomUUID(),stockItemId:monitor.id,version:monitor.version,quantity:1,fromState:'ready',writtenOffOn:today,reason:'Damaged panel',note:''});
 const expected=await (await owner.request.get(address+'/api/it-assets/report')).json();
 assert.equal(expected.totals.itemsBelowMinimum,'1');assert.equal(expected.classification.registered,'1');
 const page=await owner.newPage(),errors=[];page.on('pageerror',error=>errors.push(String(error)));
 await page.goto(address+'/inventory#it-assets');await page.locator('#stock-overview').waitFor();
 assert.equal(await page.locator('#stock-tab-overview').getAttribute('aria-selected'),'true');
 assert.equal(await page.locator('#stock-overview .stock-report-metric').count(),7);
 assert.match(await page.locator('#stock-overview').innerText(),/Registered Canonical Devices/);
 await page.locator('#stock-report-days').selectOption('90');
 await page.waitForFunction(()=>document.querySelector('#stock-overview').textContent.includes('Last 90 days'));
 const long=await (await owner.request.get(address+'/api/it-assets/report?days=90')).json();
 assert.equal(long.totals.physicallyHeld,expected.totals.physicallyHeld);
 assert.ok(long.movements.some(bucket=>BigInt(bucket.counts.received)>0n));
 await page.locator('#stock-report-category').selectOption('Keyboard');
 await page.waitForFunction(()=>document.querySelector('#stock-overview .stock-report-metric .statnum')?.textContent==='10');
 await page.locator('[data-stock-action="report-drill"][data-status="low"]').click();
 assert.equal(await page.locator('.stock-inventory-table tbody tr').count(),1);
 assert.match(await page.locator('.stock-inventory-table').innerText(),/Office Keyboard.*Low Stock/s);
 await page.locator('[data-stock-action="details"]').first().click();await page.locator('#stock-readiness-form').waitFor();
 assert.equal(await page.locator('#stock-minimumStockLevel').inputValue(),'3');
 await page.locator('#stock-tab-overview').click();
 await page.locator('#stock-report-category').selectOption('');
 await page.waitForFunction(()=>document.querySelectorAll('.stock-distribution-row').length===5);
 await page.locator('[data-stock-action="report-drill"][data-status="written_off"]').click();
 assert.match(await page.locator('.stock-movement-table').innerText(),/Written Off/);
 assert.equal(await page.locator('.stock-movement-table tbody tr').count(),1);
 await page.locator('#stock-tab-overview').click();
 await page.locator('[data-stock-action="report-drill"][data-status="issued"]').click();
 assert.match(await page.locator('#stock-panel').innerText(),/Morgan Reed/);
 await page.locator('#stock-tab-overview').click();
 await page.locator('[data-stock-action="report-drill"][data-status="registered"]').click();
 assert.match(await page.locator('#stock-panel').innerText(),/Portable-01/);
 await page.locator('#stock-tab-overview').click();
 const reader=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:1050}});
 await login(reader,'dashboard-reader','Fictional-Account-Password-2026!');
 const readerPage=await reader.newPage();await readerPage.goto(address+'/inventory#it-assets');await readerPage.locator('#stock-overview').waitFor();
 await readerPage.locator('[data-stock-action="report-drill"][data-status="low"]').click();
 await readerPage.locator('[data-stock-action="details"]').first().click();await readerPage.locator('#stock-item-details').waitFor();
 assert.equal(await readerPage.locator('#stock-readiness-form').count(),0);
 assert.equal(await readerPage.locator('[data-stock-action="issue-item"]').count(),0);
 const restricted=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:1050}});
 await login(restricted,'dashboard-assets-only','Fictional-Account-Password-2026!');
 const restrictedReport=await (await restricted.request.get(address+'/api/it-assets/report')).json();
 assert.deepEqual(restrictedReport.totals,expected.totals);assert.equal(restrictedReport.classification,null);
 assert.ok(!JSON.stringify(restrictedReport).includes('Portable-01'));
 const restrictedPage=await restricted.newPage();await restrictedPage.goto(address+'/inventory#it-assets');await restrictedPage.locator('#stock-overview').waitFor();
 assert.equal(await restrictedPage.locator('button.stock-report-metric').count(),1);
 assert.equal(await restrictedPage.locator('.stock-classification-row').count(),0);
 assert.equal(await restrictedPage.locator('#stock-tab-receive').count(),0);
 // A keyboard user can reach chart values without interacting with a graphic.
 await page.locator('#stock-overview details summary').first().focus();await page.keyboard.press('Enter');
 assert.equal(await page.locator('#stock-overview details').first().getAttribute('open'),'');
 await page.keyboard.press('Enter');
 await page.locator('#stock-report-days').selectOption('30');
 await page.waitForFunction(()=>document.querySelector('#stock-overview').textContent.includes('Last 30 days'));
 assert.deepEqual(errors,[]);
 fs.mkdirSync(output,{recursive:true});const screens=[];
 if(process.env.CAFFOOT_DASHBOARD_CAPTURE==='1'){
  for(const [width,height] of [[1440,1050],[390,844]])for(const theme of ['light','dark']){
   await page.setViewportSize({width,height});await page.evaluate(theme=>caffootSetTheme(theme),theme);
   await page.mouse.move(1,1);await page.evaluate(()=>scrollTo(0,0));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Dashboard page overflow');
   const filename='dashboard-'+theme+'-'+width+'.png';await page.screenshot({path:path.join(output,filename),fullPage:true});screens.push(filename);
  }
 }
 const denied=await restricted.request.post(address+'/api/it-assets/receive',{headers:{Origin:address,'X-CSRF-Token':(await (await restricted.request.get(address+'/api/session')).json()).csrf_token},data:{}});assert.equal(denied.status(),403);
 await post('/api/settings/features',{feature:'it_assets',enabled:false,confirmDisable:true});
 assert.equal((await restricted.request.get(address+'/api/it-assets/report')).status(),403);
 console.log(JSON.stringify({checks:'Dashboard periods, category and KPI drill-downs, item details, assignment view, keyboard tables, read-only and restricted viewers, API denial, responsive overflow',screens,errors},null,2));
}
main().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();if(server)server.kill();});
