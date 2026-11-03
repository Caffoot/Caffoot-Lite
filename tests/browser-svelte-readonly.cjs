// Real HTTPS/SQLite browser check of the opt-in read-only Svelte interface.
// Uses disposable accounts and inventory; never touches a published installation.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawn, spawnSync} = require('node:child_process');
const {chromium} = require('playwright');

const root = path.resolve(__dirname, '..');
const address = 'https://127.0.0.1:8080';
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'caffoot-svelte-readonly-'));
const screenshots = path.join(root, 'pilots', 'svelte-device-details', 'playwright-screenshots');
const dbPath = path.join(temp, 'read-only.sqlite3');
let backend, browser;

function fixture() {
  const p = spawnSync('python3', ['tests/svelte_readonly_fixture.py', dbPath], {
    cwd: root, encoding: 'utf8'
  });
  if (p.status !== 0) throw Error('Fixture setup failed: ' + p.stderr);
  return JSON.parse(p.stdout);
}

async function waitOnline(context) {
  for (let i = 0; i < 70; i++) {
    if (backend.exitCode !== null) throw Error('The backend exited unexpectedly');
    try {
      const res = await context.request.get(address + '/health', {timeout: 900});
      if (res.status() === 200) return;
    } catch (_) {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw Error('Temporary HTTPS backend did not start');
}

async function contextWithToken(token, cookieName) {
  const context = await browser.newContext({ignoreHTTPSErrors: true,
    viewport: {width: 1440, height: 950}});
  if (token) await context.addCookies([{
    name: cookieName, value: token, url: address, secure: true, sameSite: 'Strict'
  }]);
  return context;
}

async function run() {
  const tokens = fixture();
  fs.mkdirSync(screenshots, {recursive: true});
  const output = fs.openSync(path.join(temp, 'backend.log'), 'w');
  backend = spawn('python3', ['-m', 'backend.server'], {
    cwd: root, stdio: ['ignore', output, output],
    env: {
      ...process.env, CAFFOOT_DB_PATH: dbPath,
      CAFFOOT_TLS_DIR: path.join(temp, 'tls'),
      CAFFOOT_WEB_ADDRESS: address, CAFFOOT_SERVER_ADDRESS: '127.0.0.1',
      CAFFOOT_PORT: '8080', CAFFOOT_HOST: '127.0.0.1',
      CAFFOOT_DEV_SVELTE_DETAILS: '1'
    }
  });

  browser = await chromium.launch({headless: true});
  const anonymous = await contextWithToken(null, tokens.cookie_name);
  await waitOnline(anonymous);
  assert.equal((await anonymous.request.get(address + '/__dev/svelte-device-details/')).status(), 401,
    'Unsigned-in users must not view the preview');
  await anonymous.close();

  const denied = await contextWithToken(tokens.ipam, tokens.cookie_name);
  assert.equal((await denied.request.get(address + '/__dev/svelte-device-details/')).status(), 403,
    'An IPAM-only reader must not view Devices');
  assert.equal((await denied.request.get(address + '/api/inventory/devices')).status(), 403,
    'Existing Devices API must still reject IPAM-only users');
  await denied.close();

  const viewer = await contextWithToken(tokens.viewer, tokens.cookie_name);
  assert.equal((await viewer.request.get(address + '/inventory')).status(), 200,
    'Existing inventory screen must remain available');
  const page = await viewer.newPage();
  const errors = [];
  const requests = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('request', request => requests.push(new URL(request.url()).pathname + ':' + request.method()));
  const response = await page.goto(address + '/__dev/svelte-device-details/', {waitUntil:'networkidle'});
  assert.equal(response.status(), 200, 'Protected Svelte page must load');
  await page.getByRole('heading', {name:'Real Device Details · Read Only'}).waitFor();
  // Deliberately tricky text must be rendered as text, never as a script.
  await page.getByRole('row', {name:/Test <script>/}).getByRole('button', {name:'Details'}).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('heading', {name:'Test <script>alert(1)</script> &'}).waitFor();
  assert.equal(await dialog.locator('script').count(), 0,
    'HTML-looking device names must never create executable markup');
  await dialog.getByRole('button', {name:'Close', exact:true}).click();

  // Use the ordinary hypervisor and its VM in the visible screenshots.
  await page.getByRole('row', {name:/Hypervisor-01/}).getByRole('button', {name:'Details'}).click();
  await dialog.getByRole('heading', {name:'Hypervisor-01'}).waitFor();
  await page.screenshot({path:path.join(screenshots,'real-device-host-overview-1440.png'),fullPage:true});
  assert.equal(await dialog.getByRole('button', {name:/Save|Delete|Edit Device/}).count(), 0,
    'No edit/save/delete controls may be present in the read-only interface');
  await dialog.getByRole('tab', {name:'Hardware'}).click();
  await dialog.getByRole('heading', {name:'Hardware & Lifecycle'}).waitFor();
  await dialog.getByRole('tab', {name:'Virtual Machines'}).click();
  await dialog.getByRole('button', {name:'View Details'}).click();
  await dialog.getByRole('heading', {name:'App-VM-01'}).waitFor();
  assert.equal(await dialog.getByRole('tab', {name:'Hardware'}).count(), 0,
    'VMs must not have the physical Hardware tab');
  await dialog.getByText('4', {exact:true}).first().waitFor();
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:path.join(screenshots,'real-device-vm-overview-390.png'),fullPage:true});
  await page.setViewportSize({width:1440,height:950});
  await dialog.getByRole('button', {name:'View Host'}).click();
  await dialog.getByRole('heading', {name:'Hypervisor-01'}).waitFor();
  await dialog.getByRole('tab', {name:'Location'}).click();
  await dialog.getByText('Requires Racks access').waitFor();
  assert.ok(!requests.some(r=>r.startsWith('/api/inventory/racks:')),
    'A Devices-only reader must not fetch Racks');
  assert.ok(!requests.some(r=>r.startsWith('/api/inventory/ipam:')),
    'This Devices-only preview must not fetch IPAM allocations');
  assert.ok(!requests.some(r=>r.endsWith(':POST')),
    'The read-only browser must never send POST requests');
  assert.ok(!errors.length, 'Browser errors: ' + errors.join('; '));
  await page.screenshot({path:path.join(screenshots,'real-device-viewer-1440.png'),fullPage:true});

  for (const [width, height] of [[1280, 850], [390, 844]]) {
    await page.setViewportSize({width, height});
    const size = await page.evaluate(() => ({
      scroll:document.documentElement.scrollWidth,
      viewport:window.innerWidth,
      dialogWidth:document.querySelector('[role=dialog]')?.getBoundingClientRect().width
    }));
    assert.ok(size.scroll <= size.viewport + 2, 'Horizontal overflow: ' + JSON.stringify(size));
    assert.ok(size.dialogWidth > 0 && size.dialogWidth <= width, 'Dialog must fit: ' + width);
    await page.screenshot({path:path.join(screenshots,'real-device-viewer-' + width + '.png'),fullPage:true});
  }
  await viewer.close();

  const admin = await contextWithToken(tokens.admin, tokens.cookie_name);
  const adminPage = await admin.newPage();
  const adminRequests = [];
  adminPage.on('request', request => adminRequests.push(new URL(request.url()).pathname));
  assert.equal((await adminPage.goto(address + '/__dev/svelte-device-details/', {waitUntil:'networkidle'})).status(), 200);
  await adminPage.getByRole('row', {name:/Hypervisor-01/}).getByRole('button',{name:'Details'}).click();
  await adminPage.getByRole('dialog').getByRole('tab',{name:'Location'}).click();
  await adminPage.getByText('Rack A',{exact:true}).waitFor();
  assert.ok(adminRequests.includes('/api/inventory/racks'),
    'Racks information should be loaded only when permitted');
  await adminPage.screenshot({path:path.join(screenshots,'real-device-admin-rack-1440.png'),fullPage:true});
  await admin.close();
  console.log('Read-only Svelte HTTP, permissions, host/VM, escaping, no writes and layout tests passed.');
}

run().catch(e=>{
  console.error(e);
  process.exitCode=1;
}).finally(async()=>{
  if(browser) await browser.close().catch(()=>{});
  if(backend && backend.exitCode === null) backend.kill('SIGTERM');
  fs.rmSync(temp, {recursive:true,force:true});
});
