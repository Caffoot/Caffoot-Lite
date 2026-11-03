// Exercise the new Sign In and Dashboard against disposable HTTPS/SQLite servers.
// This does not connect to a published Caffoot Lite installation.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawn,spawnSync} = require('node:child_process');
const {chromium} = require('playwright');

const root=path.resolve(__dirname,'..');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-batch1-'));
const screenshots=path.join(root,'pilots','svelte-device-details','batch1-screenshots');
let browser;
const servers=[];

function makeFixture(file) {
  const run=spawnSync('python3',['tests/svelte_readonly_fixture.py',file],
    {cwd:root,encoding:'utf8'});
  if (run.status!==0) throw Error('Unable to make test records: '+run.stderr);
  return JSON.parse(run.stdout);
}

function codeFor(secret) {
  const run=spawnSync('python3',['-c',
    'from backend.mfa import code_at; import sys,time; print(code_at(sys.argv[1],time.time()))',
    secret],{cwd:root,encoding:'utf8'});
  if (run.status!==0) throw Error('Unable to generate disposable authenticator code');
  return run.stdout.trim();
}

async function launchServer(port,db) {
  const address='https://127.0.0.1:'+port;
  const log=fs.openSync(path.join(temp,'server-'+port+'.log'),'w');
  const child=spawn('python3',['-m','backend.server'],{
    cwd:root,stdio:['ignore',log,log],env:{
      ...process.env,CAFFOOT_DB_PATH:db,
      CAFFOOT_TLS_DIR:path.join(temp,'tls-'+port),
      CAFFOOT_WEB_ADDRESS:address,CAFFOOT_SERVER_ADDRESS:'127.0.0.1',
      CAFFOOT_HOST:'127.0.0.1',CAFFOOT_PORT:String(port),
      CAFFOOT_SVELTE_WORKSPACE:'1'
    }
  });
  servers.push(child);
  const context=await browser.newContext({ignoreHTTPSErrors:true});
  for(let i=0;i<80;i++){
    if(child.exitCode!==null)throw Error('Temporary test backend exited: '+port);
    try {
      if((await context.request.get(address+'/health',{timeout:700})).status()===200){
        await context.close();
        return address;
      }
    } catch (_) {}
    await new Promise(resolve=>setTimeout(resolve,200));
  }
  await context.close();
  throw Error('The temporary backend was not ready: '+port);
}

async function testSignedInData() {
  const db=path.join(temp,'existing.sqlite3');
  const fixture=makeFixture(db);
  const address=await launchServer(8080,db);
  const context=await browser.newContext({ignoreHTTPSErrors:true,acceptDownloads:true,
    viewport:{width:1440,height:900}});
  const page=await context.newPage();
  const browserErrors=[];
  page.on('pageerror',e=>browserErrors.push(e.message));
  assert.equal((await page.goto(address+'/sign-in/',{waitUntil:'domcontentloaded'})).status(),200);
  await page.getByRole('heading',{name:'Welcome Back'}).waitFor();
  await page.getByLabel('Username',{exact:true}).fill('viewer');
  await page.getByLabel('Password',{exact:true}).fill('password');
  await page.getByRole('button',{name:'Sign In',exact:true}).click();
  await page.waitForURL('**/workspace/dashboard/');
  await page.getByRole('heading',{name:'Dashboard',exact:true}).waitFor();
  await page.getByRole('tab',{name:'Overview'}).waitFor();
  assert.equal(await page.getByRole('link',{name:'IP Addresses'}).count(),0,
    'Devices-only users cannot see IPAM totals');
  assert.equal(await page.getByRole('link',{name:'Network Racks'}).count(),0,
    'Devices-only users cannot see Rack totals');
  await page.screenshot({path:path.join(screenshots,'dashboard-devices-reader-1440.png'),
    fullPage:true});
  await page.getByRole('tab',{name:'Network Insights'}).click();
  assert.equal(await page.getByRole('button',{name:'Subnets CSV'}).count(),0);
  const download=page.waitForEvent('download');
  await page.getByRole('button',{name:'Devices CSV'}).click();
  const exported=await download;
  assert.ok(exported.suggestedFilename().endsWith('.csv'));
  await page.getByRole('tab',{name:'Activity & Alerts'}).click();
  await page.getByRole('heading',{name:'Recent Activity'}).waitFor();
  await page.screenshot({path:path.join(screenshots,'dashboard-devices-reader-activity.png'),
    fullPage:true});

  // The same route must never retrieve Devices for an IPAM-only account.
  const ipamContext=await browser.newContext({ignoreHTTPSErrors:true});
  await ipamContext.addCookies([{name:fixture.cookie_name,value:fixture.ipam,url:address,
    secure:true,sameSite:'Strict'}]);
  const ipamPage=await ipamContext.newPage();
  const requests=[];
  ipamPage.on('request',r=>requests.push(new URL(r.url()).pathname));
  await ipamPage.goto(address+'/workspace/dashboard/',{waitUntil:'domcontentloaded'});
  await ipamPage.getByRole('heading',{name:'Dashboard',exact:true}).waitFor();
  assert.equal(await ipamPage.getByRole('link',{name:'Devices',exact:true}).count(),0);
  assert.ok(!requests.includes('/api/inventory/devices'));
  await ipamPage.screenshot({path:path.join(screenshots,'dashboard-ipam-only-1440.png'),
    fullPage:true});
  await ipamContext.close();

  const adminContext=await browser.newContext({ignoreHTTPSErrors:true,
    viewport:{width:390,height:844}});
  await adminContext.addCookies([{name:fixture.cookie_name,value:fixture.admin,url:address,
    secure:true,sameSite:'Strict'}]);
  const adminPage=await adminContext.newPage();
  await adminPage.goto(address+'/workspace/dashboard/',{waitUntil:'domcontentloaded'});
  await adminPage.getByRole('heading',{name:'Dashboard',exact:true}).waitFor();
  assert.equal(await adminPage.getByRole('link',{name:'IP Addresses'}).count(),1);
  assert.equal(await adminPage.locator('.metric-grid').getByRole('link',{name:'Network Racks'}).count(),1);
  const sizes=await adminPage.evaluate(()=>({
    content:document.documentElement.scrollWidth,screen:innerWidth
  }));
  assert.ok(sizes.content<=sizes.screen+2,'Mobile Dashboard overflow: '+JSON.stringify(sizes));
  await adminPage.screenshot({path:path.join(screenshots,'dashboard-admin-mobile-390.png'),
    fullPage:true});
  assert.deepEqual(browserErrors,[]);
  await context.close();
  await adminContext.close();
}

async function testFirstRunAndMfa() {
  const address=await launchServer(8080,path.join(temp,'first-run.sqlite3'));
  const context=await browser.newContext({ignoreHTTPSErrors:true,
    viewport:{width:1280,height:850}});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(address+'/sign-in/',{waitUntil:'domcontentloaded'});
  await page.getByRole('heading',{name:'Welcome to Caffoot Lite'}).waitFor();
  await page.screenshot({path:path.join(screenshots,'signin-first-run-1280.png'),fullPage:true});
  await page.getByRole('button',{name:'Get Started'}).click();
  await page.getByLabel('Username',{exact:true}).fill('new-owner');
  await page.getByLabel('Password',{exact:true}).fill('correct-horse-battery-staple');
  await page.getByLabel('Confirm Password').fill('correct-horse-battery-staple');
  await page.getByRole('button',{name:'Continue to Authenticator Setup'}).click();
  await page.getByRole('heading',{name:'Secure Your Account'}).waitFor();
  const secret=(await page.locator('.secret code').textContent()).trim();
  assert.ok(secret.length>8,'The authenticator setup key should be visible');
  await page.screenshot({path:path.join(screenshots,'signin-authenticator-1280.png'),fullPage:true});

  // Refreshing during setup must allow resuming with existing credentials.
  await page.reload({waitUntil:'domcontentloaded'});
  await page.getByRole('heading',{name:'Finish Administrator Setup'}).waitFor();
  await page.getByLabel('Administrator Username').fill('new-owner');
  await page.getByLabel('Password',{exact:true}).fill('correct-horse-battery-staple');
  await page.getByRole('button',{name:'Continue Enrolment'}).click();
  await page.getByRole('heading',{name:'Secure Your Account'}).waitFor();
  assert.equal((await page.locator('.secret code').textContent()).trim(),secret,
    'Recovery must keep the administrator authenticator secret');
  await page.getByLabel('Six-Digit Authenticator Code').fill(codeFor(secret));
  await page.getByRole('button',{name:'Confirm MFA Setup'}).click();
  try {
    await page.getByRole('heading',{name:"You're All Set!"}).waitFor({timeout:8000});
  } catch (caught) {
    const errors=await page.getByRole('alert').allTextContents();
    const headings=await page.getByRole('heading').allTextContents();
    const invalid=await page.locator('input:invalid').evaluateAll(inputs=>inputs.map(input=>({
      label:input.closest('label')?.textContent?.trim().slice(0,45)||'Unknown',
      pattern:input.validity.patternMismatch,
      length:input.value.length,
      missing:input.validity.valueMissing
    })));
    throw new Error('First administrator MFA confirmation did not complete: '+
      (errors.join('; ') || 'no visible error')+
      '; headings='+JSON.stringify(headings)+
      '; invalid fields='+JSON.stringify(invalid)+
      ' ('+page.url()+')',{cause:caught});
  }
  await page.getByRole('button',{name:'Return to Sign In'}).click();
  await page.getByLabel('Username',{exact:true}).fill('new-owner');
  await page.getByLabel('Password',{exact:true}).fill('correct-horse-battery-staple');
  await page.getByRole('button',{name:'Sign In',exact:true}).click();
  await page.getByRole('heading',{name:'Verify Your Identity'}).waitFor();
  await page.getByLabel('Authenticator Code').fill(codeFor(secret));
  await page.getByRole('button',{name:'Verify & Sign In'}).click();
  await page.waitForURL('**/workspace/dashboard/');
  await page.getByRole('heading',{name:'Dashboard',exact:true}).waitFor();
  assert.deepEqual(errors,[],'Browser should not produce JavaScript errors');
  await context.close();
}

async function run(){
  fs.mkdirSync(screenshots,{recursive:true});
  browser=await chromium.launch({headless:true});
  await testSignedInData();
  // Caffoot Lite deliberately listens on its fixed internal port 8080.
  // Stop the first disposable server before testing a fresh installation.
  for (const child of servers) {
    if (child.exitCode===null) {
      const exited=new Promise(resolve=>child.once('exit',resolve));
      child.kill('SIGTERM');
      await exited;
    }
  }
  servers.length=0;
  await testFirstRunAndMfa();
  console.log('Approved Batch 1 Sign In, MFA, recovery, Dashboard and permissions passed.');
}
run().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{
  if(browser)await browser.close().catch(()=>{});
  for(const child of servers)if(child.exitCode===null)child.kill('SIGTERM');
  fs.rmSync(temp,{recursive:true,force:true});
});
