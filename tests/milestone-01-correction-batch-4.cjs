// Focused #477 verification against real persisted history and disposable HTTPS.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn,spawnSync}=require('node:child_process'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..'),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-audit-details-'));
const output=process.env.CAFFOOT_BATCH4_OUTPUT;
const address='https://127.0.0.1:'+(process.env.CAFFOOT_BATCH4_PORT||'8118'),database=path.join(tmp,'inventory.sqlite3');
let server,browser;
function py(code,...args){const r=spawnSync('python3',['-c',code,...args],{cwd:root,encoding:'utf8'});assert.equal(r.status,0,r.stderr);return r.stdout.trim();}
const stored=()=>JSON.parse(py('import sqlite3,json,sys;db=sqlite3.connect(sys.argv[1]);print(json.dumps(db.execute("SELECT id,record_json FROM inventory_change_history ORDER BY id").fetchall()))',database));
async function main(){
 const seed=spawnSync('python3',['tests/visual_fixtures.py',tmp],{cwd:root,encoding:'utf8'});assert.equal(seed.status,0,seed.stderr);
 const credentials=JSON.parse(fs.readFileSync(path.join(tmp,'test-credentials.json')));
 py("import sqlite3,sys\nwith sqlite3.connect(sys.argv[1]) as db:\n db.execute(\"UPDATE organisation_features SET enabled=1 WHERE feature IN ('suppliers','it_assets')\")",database);
 const log=fs.openSync(path.join(tmp,'server.log'),'w');
 server=spawn('python3',['-c','import backend.server as s;import sys;s.PORT=int(sys.argv[1]);s.main()',new URL(address).port],{cwd:root,stdio:['ignore',log,log],env:{...process.env,CAFFOOT_DB_PATH:database,CAFFOOT_TLS_DIR:path.join(tmp,'tls'),CAFFOOT_WEB_ADDRESS:address,CAFFOOT_SERVER_ADDRESS:'127.0.0.1',CAFFOOT_HOST:'127.0.0.1'}});
 fs.closeSync(log);
 browser=await require('playwright').chromium.launch({headless:true,executablePath:process.env.CAFFOOT_CHROMIUM_PATH||undefined});
 const context=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:1000},locale:'en-GB',acceptDownloads:true});
 let healthy=false;
 for(let i=0;i<60;i++){try{if((await context.request.get(address+'/health',{timeout:750})).ok()){healthy=true;break;}}catch{}await new Promise(r=>setTimeout(r,150));}
 assert.ok(healthy,fs.readFileSync(path.join(tmp,'server.log'),'utf8'));
 const code=py('from backend.mfa import code_at;import sys,time;print(code_at(sys.argv[1],time.time()))',credentials.secret);
 const login=await context.request.post(address+'/api/login',{headers:{Origin:address},data:{username:credentials.username,password:credentials.password,mfa_code:code}});
 assert.equal(login.status(),200,await login.text());
 const session=await (await context.request.get(address+'/api/session')).json(),headers={Origin:address,'X-CSRF-Token':session.csrf_token};
 const save=async(route,data)=>{const r=await context.request.post(address+route,{headers,data});assert.equal(r.status(),200,await r.text());return r.json();};
 const company=name=>({name,website:'',description:'',address:{address:'',city:'',postcode:'',country:''},categoryIds:[]});
 const supplier=await save('/api/suppliers',{operation:'supplier.save',data:company('Northlight Ltd')});
 await save('/api/devices/create',{record:{id:'audit-477-laptop',name:'AST-LAP-014',type:'Laptop'},supplier:{id:supplier.id}});
 const first=stored();
 assert.ok(first.some(([,raw])=>{const e=JSON.parse(raw);return e.reason==='Equipment Supplier association'&&e.changes[0].after?.supplierName==='Northlight Ltd';}));
 await save('/api/suppliers',{operation:'supplier.save',data:company('Northlight Services'),supplierId:supplier.id,revision:supplier.revision});
 assert.deepEqual(stored().slice(0,first.length),first);
 // Persist representative historical fixture records; no synthetic UI or response.
 const event=(kind,label,before,after,fields,reason='Inventory saved')=>({at:'2026-11-26T09:00:00Z',actor:'Fictional Administrator',outcome:'Succeeded',reason,omitted:0,changes:[{kind,action:'Updated',label,fields,before,after}]});
 const legacy=event('Device','Legacy Laptop',{deviceId:'legacy-laptop',supplierId:null,supplierText:''},{deviceId:'legacy-laptop',supplierId:supplier.id,supplierText:''},['Supplier'],'Equipment Supplier association');
 legacy.changes[0].recordSubject={kind:'Device',id:'legacy-laptop',name:'Legacy Laptop'};
 const fixtures=[legacy,
 event('Device','Recorded Device Example',{deviceId:'demo',primaryIp:'192.0.2.10',assetTag:'',status:'Active'},{deviceId:'demo',primaryIp:'192.0.2.20',assetTag:'LAB-100',status:'Active'},['primaryIp','assetTag']),
 event('IPAM','Recorded IPAM Example',{reservedForDeviceId:'old'},{reservedForDeviceId:'new'},['reservedForDeviceId']),
 event('Rack','Recorded Rack Example',{heightU:24},{heightU:42},['heightU']),
 event('Staff Member','Recorded Staff Example',{Active:true,Department:'old'},{Active:false,Department:'new'},['Active','Department']),
 event('Department','Recorded Department Example',{name:'Old Department',archived:false},{name:'New Department',archived:false},['name']),
 event('Role','Recorded Role Example',{'Roles and permissions':{name:'Old Role'}},{'Roles and permissions':{name:'New Role'}},['Roles and permissions']),
 event('Security','Recorded Security Example',{'MFA status':'Not enrolled'},{'MFA status':'Enabled'},['MFA status']),
 event('Settings','Recorded Settings Example',{enabled:false},{enabled:true},['enabled']),
 event('Device','Recorded Value Example',{a:null,b:'',c:false,d:0,same:'context'},{a:'',b:null,c:0,d:false,extra:'<script>fictional</script>',same:'context'},['a','b','c','d','extra']),
 event('Device','Recorded One-sided Example',null,{deviceId:'one-sided'},['deviceId']),
 event('Device','Recorded No-diff Example',{deviceId:'unchanged'},{deviceId:'unchanged'},['deviceId'])];
 py('import sqlite3,json,sys\nwith sqlite3.connect(sys.argv[1]) as db:\n db.executemany("INSERT INTO inventory_change_history(record_json) VALUES(?)",[(json.dumps(e),) for e in json.loads(sys.argv[2])])',database,JSON.stringify(fixtures));
 const original=stored();
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(address+'/inventory');await page.locator('#app[aria-busy="false"]').waitFor();
 await page.evaluate(()=>{caffootSetTheme('light');switchTab('audit');});
 await page.getByRole('heading',{name:'Audit Trail',exact:true}).waitFor();
 const body=page.locator('#audit-detail-body'),technical=body.locator('details');
 const summary=technical.locator('summary');
 const mainRows=body.locator(':scope > .diff-row');
 const mainText=()=>mainRows.evaluateAll(rows=>rows.map(row=>row.innerText).join('\\n'));
 async function open(label,reason){
   let row=page.locator('tr[data-audit-index]').filter({hasText:label});
   if(reason)row=row.filter({hasText:reason});
   const trigger=row.first().getByRole('button',{name:'View Details'});await trigger.click();
   await page.locator('#audit-detail-layer:not([hidden])').waitFor();
   assert.equal(await technical.evaluate(el=>el.open),false);
   return trigger;
 }
 async function close(trigger){
   await page.keyboard.press('Escape');await page.locator('#audit-detail-layer').waitFor({state:'hidden'});
   assert.ok(await trigger.evaluate(el=>el===document.activeElement));
 }
 async function verifyDialogWidth(){
   const modal=page.locator('#audit-detail-layer .audit-modal');
   for(const viewport of [{width:1440,height:1000},{width:730,height:844},{width:390,height:844}]){
     await page.setViewportSize(viewport);
     for(const theme of ['light','dark']){
       await page.evaluate(theme=>caffootSetTheme(theme),theme);
       const widthTrigger=await open('Legacy Laptop','Equipment Supplier association');
       await summary.focus();await page.keyboard.press('Enter');assert.equal(await technical.evaluate(el=>el.open),true);
       await modal.waitFor({state:'visible'});
       const geometry=await modal.evaluate(el=>{
         const r=el.getBoundingClientRect(),layer=el.closest('.modal-layer'),style=getComputedStyle(layer);
         return {width:r.width,left:r.left,right:r.right,viewport:innerWidth,available:layer.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight),maxWidth:getComputedStyle(el).maxWidth};
       });
       assert.ok(geometry.available>0&&geometry.width>0,JSON.stringify({viewport,theme,geometry}));
       const expected=Math.min(viewport.width>730?850:470,geometry.available);
       assert.ok(Math.abs(geometry.width-expected)<=1,JSON.stringify({viewport,theme,expected,geometry}));
       assert.ok(geometry.left>=0&&geometry.right<=viewport.width+1,JSON.stringify(geometry));
       assert.equal(geometry.maxWidth,viewport.width>730?'850px':'470px');
       await close(widthTrigger);
     }
   }
   await page.setViewportSize({width:1440,height:1000});
   await page.evaluate(()=>caffootSetTheme('light'));
   console.log('Audit dialogue width: 850px desktop, existing narrow width preserved, light and dark verified.');
 }
 async function shot(name){
   if(!output)return;
   fs.mkdirSync(output,{recursive:true});
   await page.screenshot({path:path.join(output,name+'.png'),animations:'disabled'});
 }
 if(process.env.CAFFOOT_FOLLOWUP_WORDING==='1'){
   const unavailable='No paired before-and-after values are available for this event.';
   let wordingTrigger=await open('Recorded One-sided Example');
   await body.getByText(unavailable,{exact:true}).waitFor();
   await close(wordingTrigger);
   wordingTrigger=await open('Recorded No-diff Example');
   await body.getByText('No differing before-and-after values were captured for this event.',{exact:true}).waitFor();
   await close(wordingTrigger);
   const readerId=Number(py("import sqlite3,sys\nfrom backend.permissions import create_user\nwith sqlite3.connect(sys.argv[1]) as db:\n reader=create_user(db,1,'audit-wording-reader','Fictional-Audit-Reader-Password-2026!')\n db.execute(\"UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?\",(sys.argv[2],reader))\n db.execute(\"INSERT INTO account_permission_overrides VALUES(?,'Devices','read')\",(reader,))\n print(reader)",database,credentials.secret));
   assert.ok(readerId>0);
   const reader=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:1000},locale:'en-GB'});
   try{
     const readerCode=py('from backend.mfa import code_at;import sys,time;print(code_at(sys.argv[1],time.time()))',credentials.secret);
     const logged=await reader.request.post(address+'/api/login',{headers:{Origin:address},data:{username:'audit-wording-reader',password:'Fictional-Audit-Reader-Password-2026!',mfa_code:readerCode}});
     assert.equal(logged.status(),200,await logged.text());
     const restricted=await reader.newPage();restricted.on('pageerror',e=>errors.push(e.message));
     await restricted.goto(address+'/inventory');await restricted.locator('#app[aria-busy="false"]').waitFor();
     await restricted.evaluate(()=>{caffootSetTheme('light');switchTab('audit');});
     await restricted.getByRole('heading',{name:'Audit Trail',exact:true}).waitFor();
     const association=restricted.locator('tr[data-audit-index]').filter({hasText:'AST-LAP-014'}).filter({hasText:'Recorded change'}).first();
     await association.getByRole('button',{name:'View Details'}).click();
     const restrictedBody=restricted.locator('#audit-detail-body');
     await restrictedBody.getByText(unavailable,{exact:true}).waitFor();
     await restrictedBody.locator('summary').click();
     assert.doesNotMatch(await restrictedBody.innerText(),/Northlight Ltd|Northlight Services|supplierName/);
     assert.equal(await restrictedBody.locator(':scope > .diff-row').count(),0);
     if(output){fs.mkdirSync(output,{recursive:true});await restricted.screenshot({path:path.join(output,'audit-values-unavailable.png'),animations:'disabled'});}
   }finally{await reader.close();}
   assert.deepEqual(stored().slice(0,original.length),original);
   assert.deepEqual(errors,[]);
   console.log('Unavailable values wording verified for one-sided and genuinely restricted history; no-difference wording unchanged.');
   return;
 }
 let trigger=await open('AST-LAP-014','Equipment Supplier association');
 assert.equal(await mainRows.count(),1);assert.match(await mainText(),/Supplier\s+Not assigned\s+Northlight Ltd/);
 assert.doesNotMatch(await mainText(),/Northlight Services|deviceId|supplierId/);
 await shot('audit-supplier-name');await close(trigger);
 trigger=await open('Legacy Laptop','Equipment Supplier association');
 assert.match(await mainText(),/Historical name not recorded/);
 assert.doesNotMatch(await mainText(),/Northlight Services/);
 await summary.focus();await page.keyboard.press('Enter');assert.equal(await technical.evaluate(el=>el.open),true);
 assert.match(await technical.innerText(),/Internal Record ID/);
 assert.match(await technical.innerText(),/Record Name Source/);
 assert.match(await technical.innerText(),/deviceId/);
 assert.match(await technical.innerText(),/supplierId/);
 assert.match(await technical.innerText(),/supplierText/);
 await shot('audit-legacy-technical');await close(trigger);
 await verifyDialogWidth();
 trigger=await open('Recorded Device Example');
 assert.equal(await mainRows.count(),2);
 assert.match(await mainText(),/Primary IP Address/);assert.match(await mainText(),/Asset Tag/);
 assert.doesNotMatch(await mainText(),/Device Reference|Status/);
 await shot('audit-device-changes');await close(trigger);
 if(process.env.CAFFOOT_BATCH4_WIDTH_ONLY!=='1'){
 for(const [label,field] of [['Recorded IPAM Example','Reserved For Device Reference'],['Recorded Rack Example','Height (U)'],['Recorded Staff Example','Department Reference'],['Recorded Department Example','Name'],['Recorded Role Example','Roles and permissions'],['Recorded Security Example','MFA status'],['Recorded Settings Example','Enabled']]){
   trigger=await open(label);assert.ok((await mainText()).includes(field));await close(trigger);
 }
 trigger=await open('Recorded Value Example');const values=await mainRows.allTextContents();
 for(const text of ['Null (recorded)','Empty (recorded)','False','0','Not recorded','<script>fictional</script>'])assert.ok(values.join(' ').includes(text),text);
 assert.equal(await body.locator('script').count(),0);assert.doesNotMatch(values.join(' '),/context/);
 await close(trigger);
 trigger=await open('Recorded One-sided Example');assert.equal(await mainRows.count(),0);await body.getByText('No paired before-and-after values are available for this event.',{exact:true}).waitFor();await summary.click();assert.match(await technical.innerText(),/one-sided/);await close(trigger);
 trigger=await open('Recorded No-diff Example');assert.equal(await mainRows.count(),0);await summary.click();assert.match(await technical.innerText(),/unchanged/);await close(trigger);
 const downloaded=page.waitForEvent('download');await page.locator('[data-action="export-audit"]').click();
 const json=JSON.parse(fs.readFileSync(await (await downloaded).path(),'utf8'));
 for(const [,raw] of original)assert.ok(json.events.some(e=>JSON.stringify(e)===JSON.stringify(JSON.parse(raw))));
 }
 assert.deepEqual(stored().slice(0,original.length),original);assert.deepEqual(errors,[]);
 if(output){const pngs=fs.readdirSync(output).filter(f=>f.endsWith('.png'));fs.writeFileSync(path.join(output,'Provenance.json'),JSON.stringify({revision:spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).stdout.trim(),browser:browser.version(),viewport:{width:1440,height:1000},fixture:'Disposable HTTPS/SQLite; actual Supplier and Device saves, separately seeded fictional historical records',hashes:Object.fromEntries(pngs.map(f=>[f,createHash('sha256').update(fs.readFileSync(path.join(output,f))).digest('hex')]))},null,2));}
 console.log(process.env.CAFFOOT_BATCH4_WIDTH_ONLY==='1'?'Audit Details: approved width, three affected visual states, keyboard/focus and immutable stored history verified.':'Audit Details: event-time name, legacy fallback, raw context, representative labels, null/empty/false/zero, escaping, keyboard/focus, immutable history and JSON export verified.');
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();if(server)server.kill('SIGKILL');fs.rmSync(tmp,{recursive:true,force:true});});
