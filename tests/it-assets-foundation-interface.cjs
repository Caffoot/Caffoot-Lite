// Check the existing Optional Features screen against a real isolated HTTPS server.
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn,spawnSync}=require('node:child_process');
const {createHash}=require('node:crypto');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),baseline='2e6c50ba4777b7500258d2a1a28317764d806020';
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-it-assets-'));
const output=process.env.CAFFOOT_ASSETS_OUTPUT||path.join(temporary,'evidence');
fs.mkdirSync(output,{recursive:true});
const address='https://127.0.0.1:8096',database=path.join(temporary,'inventory.sqlite3');
let browser,server,log;
function python(code,args=[]){
 const result=spawnSync('python3',['-c',code,...args],{cwd:root,encoding:'utf8',env:{...process.env,PYTHONDONTWRITEBYTECODE:'1'}});
 assert.equal(result.status,0,result.stderr);return result.stdout.trim();
}
function snapshot(){
 return python([
  'import sqlite3,sys,json,hashlib',
  'db=sqlite3.connect(sys.argv[1])',
  'tables=[r[0] for r in db.execute("SELECT name FROM sqlite_master WHERE type=\'table\' AND name NOT IN (\'organisation_features\',\'inventory_change_history\',\'sqlite_sequence\')")]',
  'data={t:db.execute("SELECT * FROM "+t+" ORDER BY 1").fetchall() for t in tables}',
  'print(hashlib.sha256(json.dumps(data,sort_keys=True).encode()).hexdigest())'
 ].join('\n'),[database]);
}
async function main(){
 const identity=JSON.parse(python([
  'import sqlite3,json,sys,time',
  'from backend.schema import initialise_database',
  'from backend.accounts import bootstrap_first_admin,confirm_admin_mfa',
  'from backend.permissions import create_user',
  'from backend.mfa import code_at',
  'with sqlite3.connect(sys.argv[1]) as db:',
  ' db.execute("PRAGMA foreign_keys=ON")',
  ' initialise_database(db)',
  ' owner,secret=bootstrap_first_admin(db,"owner","Fictional-Acceptance-Password-2026!")',
  ' confirm_admin_mfa(db,owner,code_at(secret,time.time()))',
  ' reader=create_user(db,owner,"asset-reader","Fictional-Reader-Password-2026!")',
  ' db.execute("UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?",(secret,reader))',
  ' db.execute("INSERT INTO account_permission_overrides VALUES(?,?,?)",(reader,"IT Assets","read"))',
  ' db.execute("INSERT INTO departments(id,name) VALUES(\'fixture-department\',\'Fictional Department\')")',
  ' db.execute("INSERT INTO staff_members(id,first_name,department_id) VALUES(\'fixture-person\',\'Fictional Staff\',\'fixture-department\')")',
  ' db.execute("INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES(\'fixture-device\',\'Fictional Laptop\',\'{\\"type\\":\\"Laptop\\"}\',0)")',
  ' db.execute("INSERT INTO device_assignments(device_id,staff_id,recipient_label,assigned_at,actor_id,actor_label) VALUES(\'fixture-device\',\'fixture-person\',\'Fictional Staff\',\'2026-11-15\',?,\'owner\')",(owner,))',
  ' db.commit()',
  ' print(json.dumps(dict(secret=secret)))'
 ].join('\n'),[database]));
 log=fs.openSync(path.join(temporary,'server.log'),'w');
 server=spawn('python3',['-c','import backend.server as server; server.PORT=8096; server.main()'],{
  cwd:root,stdio:['ignore',log,log],env:{...process.env,PYTHONDONTWRITEBYTECODE:'1',
  CAFFOOT_DB_PATH:database,CAFFOOT_TLS_DIR:path.join(temporary,'tls'),CAFFOOT_WEB_ADDRESS:address,
  CAFFOOT_SERVER_ADDRESS:'127.0.0.1',CAFFOOT_HOST:'127.0.0.1',CAFFOOT_PORT:'8096'}
 });
 browser=await chromium.launch({headless:true,executablePath:process.env.CAFFOOT_CHROMIUM_PATH||undefined});
 const context=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:1050}});
 for(let attempt=0;attempt<60;attempt++){
  try{if((await context.request.get(address+'/health',{timeout:750})).ok())break;}catch{}
  if(server.exitCode!==null)throw Error('Isolated server stopped: '+fs.readFileSync(path.join(temporary,'server.log'),'utf8'));
  await new Promise(resolve=>setTimeout(resolve,150));
 }
 const code=()=>python('from backend.mfa import code_at;import sys,time;print(code_at(sys.argv[1],time.time()))',[identity.secret]);
 const login=await context.request.post(address+'/api/login',{headers:{Origin:address},
  data:{username:'owner',password:'Fictional-Acceptance-Password-2026!',mfa_code:code()}});
 assert.equal(login.status(),200,await login.text());
 const page=await context.newPage(),errors=[],screens=[],metrics=[];
 page.on('pageerror',error=>errors.push(String(error)));
 let changes=0;page.on('request',request=>{if(request.method()==='POST'&&request.url().endsWith('/api/settings/features'))changes++;});
 async function panel(){
  await page.goto(address+'/inventory#settings');
  await page.locator('[data-action="select-settings-tab"][data-tab="features"]').click();
  await page.locator('[data-feature-card="it_assets"]').waitFor();
 }
 await panel();
 const input=()=>page.locator('#optional-feature-it-assets');
 const card=()=>page.locator('[data-feature-card="it_assets"]');
 assert.deepEqual(await page.locator('#optional-feature-additional [data-feature-card]').evaluateAll(
  cards=>cards.map(node=>node.dataset.featureCard)),['suppliers','it_assets']);
 assert.equal(await input().isChecked(),false);
 assert.equal(await input().getAttribute('aria-label'),'Enable IT Assets');
 assert.equal(await card().locator('.description').textContent(),
  'Receive, issue and return equipment, record checks and write off unusable items.');
 const originalCards=await page.locator('[data-feature-card]:not([data-feature-card="it_assets"])').evaluateAll(
  cards=>cards.map(node=>node.outerHTML));
 assert.equal(await page.locator('[data-optional-feature="equipment_lifecycle"]').count(),0);
 const preserved=snapshot();
 const saved=page.waitForResponse(response=>response.url().endsWith('/api/settings/features')&&response.request().method()==='POST');
 await input().check({force:true});assert.equal((await saved).status(),200);
 await page.waitForFunction(()=>document.querySelector('#optional-feature-it-assets')?.getAttribute('aria-label')==='Disable IT Assets');
 assert.equal(snapshot(),preserved);
 const beforeCancel=changes;
 page.once('dialog',dialog=>dialog.dismiss());
 await input().click({force:true});
 assert.equal(await input().isChecked(),true);
 assert.equal(changes,beforeCancel);
 await panel();assert.equal(await input().isChecked(),true);
 assert.deepEqual(await page.locator('[data-feature-card]:not([data-feature-card="it_assets"])').evaluateAll(
  cards=>cards.map(node=>node.outerHTML)),originalCards);
 assert.equal((await context.request.get(address+'/api/it-assets/stock')).status(),200);
 assert.equal(await page.locator('[data-action="tab-it-assets"]').isVisible(),true);
 for(const enabled of [true,false]){
  if(!enabled){
   page.once('dialog',dialog=>{assert.equal(dialog.message(),'Disable IT Assets? Saved data and permissions will be retained.');return dialog.accept();});
   const disabled=page.waitForResponse(response=>response.url().endsWith('/api/settings/features')&&response.request().method()==='POST');
   await input().uncheck({force:true});assert.equal((await disabled).status(),200);
   await page.waitForFunction(()=>document.querySelector('#optional-feature-it-assets')?.getAttribute('aria-label')==='Enable IT Assets');
  }
  for(const [width,height] of [[1440,1050],[390,844]]){
   await page.setViewportSize({width,height});
   for(const theme of ['light','dark']){
    await page.evaluate(theme=>caffootSetTheme(theme),theme);
    await page.waitForFunction(()=>{
     const toast=document.getElementById('toast');
     return !toast||Number(getComputedStyle(toast).opacity)===0;
    });
    assert.equal(await input().isChecked(),enabled);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal page overflow');
    const style=await card().evaluate(node=>{
     const css=getComputedStyle(node),heading=getComputedStyle(node.querySelector('h4'));
     return {padding:css.padding,radius:css.borderRadius,font:heading.fontFamily,
      background:css.backgroundColor,colour:css.color,width:node.getBoundingClientRect().width};
    });
    const existingStyle=await page.locator('[data-feature-card="suppliers"]').evaluate(node=>{
     const css=getComputedStyle(node),heading=getComputedStyle(node.querySelector('h4'));
     return {padding:css.padding,radius:css.borderRadius,font:heading.fontFamily,
      background:css.backgroundColor,colour:css.color,width:node.getBoundingClientRect().width};
    });
    assert.deepEqual(style,existingStyle);
    const name='optional-features-'+(enabled?'enabled':'disabled')+'-'+theme+'-'+width+'.png';
    await page.screenshot({path:path.join(output,name),fullPage:true});screens.push(name);
    metrics.push({enabled,width,theme,style});
   }
  }
 }
 await page.setViewportSize({width:1440,height:1050});
 await input().focus();await page.keyboard.press('Space');
 await page.waitForFunction(()=>document.querySelector('#optional-feature-it-assets')?.getAttribute('aria-label')==='Disable IT Assets');
 assert.equal(snapshot(),preserved);
 const reader=await browser.newContext({ignoreHTTPSErrors:true});
 const readerLogin=await reader.request.post(address+'/api/login',{headers:{Origin:address},
  data:{username:'asset-reader',password:'Fictional-Reader-Password-2026!',mfa_code:code()}});
 assert.equal(readerLogin.status(),200,await readerLogin.text());
 assert.equal((await reader.request.get(address+'/api/settings/features')).status(),403);
 assert.equal((await reader.request.get(address+'/api/inventory/devices')).status(),403);
 assert.equal((await reader.request.get(address+'/api/staff-members')).status(),403);
 await reader.close();
 const preservedSources={
  'interface/screens/settings.html':baseline,
  'interface/styles/settings.css':baseline,
  // Stage 3 Server Storage and direct-handover styling merged through PRs #390 and #391.
  'interface/styles/components.css':'53b04328c4f895bfc1f72f0416c43a519b2e8b42',
  'interface/styles/staff.css':baseline,
  // Later Staff stock, stale-edit and help corrections merged through PRs #389, #402 and #408.
  'interface/staff-directory.js':'5de585aae716d2b4db8d568e0a23fcc8cddaf750',
  'interface/design-sources.json':baseline
 };
 const hashes={};
 for(const [name,revision] of Object.entries(preservedSources)){
  const prior=spawnSync('git',['show',revision+':'+name],{cwd:root});
  assert.equal(prior.status,0);const current=fs.readFileSync(path.join(root,name));
  assert.deepEqual(current,prior.stdout,name+' differs from '+revision);
  hashes[name]=createHash('sha256').update(current).digest('hex');
 }
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(output,'browser-results.json'),JSON.stringify({
  baseline,captureSource:spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).stdout.trim(),
  screenshots:screens,metrics,preservedSources,unchangedSourceHashes:hashes,pageErrors:errors,
  checks:['Default Off','Additional Features','Saved Choice','Cancel Sends No POST',
   'Existing Cards Preserved','Retained Data And Security','Keyboard Toggle',
   'Independent Permissions','Stock Access Follows Feature Choice','Responsive Light And Dark']
 },null,2)+'\n');
 console.log('PASS: Optional Features persistence, cancellation, permissions, retained data, existing cards and source styles.');
 console.log('PASS: '+screens.length+' real desktop/mobile light/dark screenshots; no page errors or horizontal page overflow.');
}
main().catch(error=>{
 fs.writeFileSync(path.join(output,'failure.txt'),String(error)+'\n'+(fs.existsSync(path.join(temporary,'server.log'))?fs.readFileSync(path.join(temporary,'server.log'),'utf8'):''));
 console.error(error);process.exitCode=1;
}).finally(async()=>{
 if(browser)await browser.close();if(server)server.kill();if(log!==undefined)fs.closeSync(log);
 fs.rmSync(temporary,{recursive:true,force:true});
});
