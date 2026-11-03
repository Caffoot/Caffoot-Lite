// Stage 2A: real HTTPS/SQLite workspace, permissions and legacy navigation.
// Uses only temporary data; no production installation or public image.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawn, spawnSync} = require('node:child_process');
const {chromium} = require('playwright');

const root = path.resolve(__dirname, '..');
const address = 'https://127.0.0.1:8080';
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'caffoot-svelte-workspace-'));
const dbPath = path.join(temp, 'workspace.sqlite3');
const screenshots = path.join(root, 'pilots', 'svelte-device-details', 'workspace-screenshots');
let backend, browser;

function fixture() {
  const p = spawnSync('python3', ['tests/svelte_readonly_fixture.py', dbPath], {
    cwd:root, encoding:'utf8'
  });
  if(p.status !== 0) throw Error('Temporary inventory setup failed: ' + p.stderr);
  return JSON.parse(p.stdout);
}

async function waitOnline(context) {
  for (let i=0;i<70;i++) {
    if(backend.exitCode !== null) throw Error('Temporary backend exited');
    try {
      const reply = await context.request.get(address + '/health', {timeout:900});
      if(reply.status() === 200) return;
    } catch (_) {}
    await new Promise(resolve => setTimeout(resolve,250));
  }
  throw Error('Temporary HTTPS backend did not start');
}

async function contextFor(tokens, token, width=1440) {
  const context = await browser.newContext({ignoreHTTPSErrors:true,
    viewport:{width,height:900}});
  if(token) await context.addCookies([{
    name:tokens.cookie_name, value:token, url:address, secure:true, sameSite:'Strict'
  }]);
  return context;
}

async function run() {
  const tokens=fixture();
  fs.mkdirSync(screenshots,{recursive:true});
  const log=fs.openSync(path.join(temp,'backend.log'),'w');
  backend=spawn('python3',['-m','backend.server'],{
    cwd:root,stdio:['ignore',log,log],env:{
      ...process.env,CAFFOOT_DB_PATH:dbPath,CAFFOOT_TLS_DIR:path.join(temp,'tls'),
      CAFFOOT_WEB_ADDRESS:address,CAFFOOT_SERVER_ADDRESS:'127.0.0.1',
      CAFFOOT_PORT:'8080',CAFFOOT_HOST:'127.0.0.1',CAFFOOT_SVELTE_WORKSPACE:'1'
    }
  });
  browser=await chromium.launch({headless:true});
  const anonymous=await contextFor(tokens,null);
  await waitOnline(anonymous);
  assert.equal((await anonymous.request.get(address+'/workspace/')).status(),401);
  await anonymous.close();

  const viewer=await contextFor(tokens,tokens.viewer);
  const page=await viewer.newPage();
  const requests=[], errors=[];
  page.on('request', r=>requests.push(new URL(r.url()).pathname+':'+r.method()));
  page.on('pageerror', e=>errors.push(e.message));
  assert.equal((await page.goto(address+'/workspace/',{waitUntil:'networkidle'})).status(),200);
  await page.getByRole('heading',{name:'Devices · Read-only workspace'}).waitFor();
  // The owner's accepted My Account Draft 06 defines the shared typography.
  // Check actual loaded local font faces, not merely a CSS fallback declaration.
  const type = await page.evaluate(async () => {
    await document.fonts.ready;
    const style = selector => {
      const element = document.querySelector(selector);
      if (!element) throw Error('Missing typography element: '+selector);
      const css = getComputedStyle(element);
      return {size:css.fontSize, weight:css.fontWeight, family:css.fontFamily};
    };
    return {
      base: style('body'),
      nav: style('.shell.production .side-nav a'),
      brand: style('.shell.production .brand-name'),
      heading: style('.shell.production .page-heading h1'),
      faces: [...document.fonts].filter(face =>
        face.family === 'Inter Variable' && face.status === 'loaded').length
    };
  });
  assert.ok(type.base.family.includes('Inter Variable'), 'Inter Variable must be the primary font');
  assert.equal(type.base.size,'14px','Approved body typography must be 14px');
  assert.equal(type.nav.size,'13px','Approved navigation typography must be 13px');
  assert.equal(type.nav.weight,'550','Use the actual variable-font navigation weight');
  assert.equal(type.brand.weight,'750','Approved brand label weight');
  assert.equal(type.heading.size,'31px','Approved title size');
  assert.equal(type.heading.weight,'790','Approved title variable weight');
  assert.ok(type.faces > 0, 'An Inter Variable font must actually load');
  // Network events are more reliable than ResourceTiming entries for fonts
  // in headless Chromium. Capture requests from before first navigation.
  const fontRequests = requests.filter(request => request.endsWith('.woff2:GET'));
  assert.ok(fontRequests.length > 0, 'Bundle local WOFF2 assets, never rely on system fonts');
  assert.ok(fontRequests.every(request => request.startsWith('/workspace/assets/')),
    'Inter files must load from the Caffoot Lite server only');
  assert.equal(await page.getByRole('link',{name:'My Account'}).count(),1);
  assert.equal(await page.getByRole('link',{name:'IPAM',exact:true}).count(),0,
    'Devices-only viewers must not be offered IPAM');
  assert.equal(await page.getByRole('link',{name:'Users',exact:true}).count(),0,
    'Normal users must not see administrator navigation');
  assert.equal(await page.getByRole('link',{name:'Devices',exact:true}).count(),1);
  assert.equal(await page.getByRole('link',{name:'Dashboard',exact:true}).count(),1);
  assert.ok(!requests.some(p=>p.startsWith('/api/inventory/ipam:') ||
                              p.startsWith('/api/inventory/racks:')));
  assert.ok(!requests.some(p=>p.endsWith(':POST')));
  await page.screenshot({path:path.join(screenshots,'workspace-devices-1440.png'),fullPage:true});

  await page.getByRole('row',{name:/Hypervisor-01/}).getByRole('button',{name:'Details'}).click();
  const dialog=page.getByRole('dialog');
  await dialog.getByRole('heading',{name:'Hypervisor-01'}).waitFor();
  await page.screenshot({path:path.join(screenshots,'workspace-device-host-1440.png'),fullPage:true});
  await dialog.getByRole('tab',{name:'Virtual Machines'}).click();
  await dialog.getByRole('button',{name:'View Details'}).click();
  await dialog.getByRole('heading',{name:'App-VM-01'}).waitFor();
  assert.equal(await dialog.getByRole('tab',{name:'Hardware'}).count(),0);
  for(const [width,height] of [[1280,850],[390,844]]) {
    await page.setViewportSize({width,height});
    const dimensions=await page.evaluate(()=>({
      scroll:document.documentElement.scrollWidth,viewport:window.innerWidth
    }));
    assert.ok(dimensions.scroll<=dimensions.viewport+2,
      'No horizontal overflow allowed: '+JSON.stringify(dimensions));
    await page.screenshot({path:path.join(screenshots,'workspace-device-vm-'+width+'.png'),
      fullPage:true});
  }
  await dialog.getByRole('button',{name:'Close',exact:true}).click();
  await page.getByRole('button',{name:'Collapse Menu'}).click();
  await page.getByRole('button',{name:'Expand Menu'}).click();
  await page.getByRole('link',{name:'Open My Account in Caffoot Lite'}).click();
  await page.waitForURL('**/inventory#account');
  await page.locator('[data-action="select-account-section"][data-section="security"]').first().waitFor();
  assert.ok(!errors.length,'Browser errors: '+errors.join('; '));
  await viewer.close();

  const ipam=await contextFor(tokens,tokens.ipam);
  const ipamPage=await ipam.newPage();
  const ipamRequests=[];
  ipamPage.on('request',r=>ipamRequests.push(new URL(r.url()).pathname));
  assert.equal((await ipamPage.goto(address+'/workspace/',{waitUntil:'networkidle'})).status(),200);
  await ipamPage.getByRole('heading',{name:'Choose an available section'}).waitFor();
  await ipamPage.getByRole('heading',{name:'Workspace',exact:true}).waitFor();
  assert.equal(await ipamPage.getByRole('tab').count(),0,
    'No Devices tabs should be offered to an IPAM-only reader');
  assert.equal(await ipamPage.getByRole('link',{name:'Devices',exact:true}).count(),0);
  assert.equal(await ipamPage.getByRole('link',{name:'IPAM',exact:true}).count(),1);
  assert.ok(!ipamRequests.includes('/api/inventory/devices'));
  await ipamPage.screenshot({path:path.join(screenshots,'workspace-ipam-only-1440.png'),
    fullPage:true});
  await ipamPage.getByRole('link',{name:'IPAM',exact:true}).click();
  await ipamPage.waitForURL('**/inventory#ipam');
  await ipamPage.locator('[data-action="tab-ipam"]').first().waitFor();
  await ipam.close();

  const admin=await contextFor(tokens,tokens.admin);
  const adminPage=await admin.newPage();
  assert.equal((await adminPage.goto(address+'/workspace/',{waitUntil:'networkidle'})).status(),200);
  await adminPage.getByRole('link',{name:'Users',exact:true}).waitFor();
  await adminPage.getByRole('link',{name:'Settings & Data',exact:true}).waitFor();
  await adminPage.screenshot({path:path.join(screenshots,'workspace-admin-1440.png'),
    fullPage:true});
  await adminPage.getByRole('link',{name:'Users',exact:true}).click();
  await adminPage.waitForURL('**/inventory#users');
  await admin.close();
  console.log('Stage 2A workspace route, permissions, navigation, VM and responsive browser checks passed.');
}

run().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{
  if(browser) await browser.close().catch(()=>{});
  if(backend && backend.exitCode === null) backend.kill('SIGTERM');
  fs.rmSync(temp,{recursive:true,force:true});
});
