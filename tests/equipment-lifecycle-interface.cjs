// Exercise the real HTTPS application using a disposable SQLite database.
const assert = require('node:assert/strict');
const {spawn, spawnSync} = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {createHash} = require('node:crypto');
const {chromium} = require('playwright');

const root = path.resolve(__dirname, '..');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'caffoot-lifecycle-'));
const database = path.join(temporary, 'inventory.sqlite3');
const origin = 'https://127.0.0.1:8103';
const password = 'Fictional-Lifecycle-Equipment-Review!';
const target = process.env.CAFFOOT_LIFECYCLE_OUTPUT;
let browser, server;
let completed = false;

function python(source, args = []) {
  const result = spawnSync('python3', ['-c', source, ...args], {
    cwd: root, encoding: 'utf8', env: {...process.env, PYTHONDONTWRITEBYTECODE: '1'},
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

async function main() {
  const secret = python(`
import sqlite3, sys, time
from datetime import datetime, timedelta, timezone
from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.inventory import stage_inventory
from backend.mfa import code_at
from backend.permissions import create_user
from backend.schema import initialise_database

with sqlite3.connect(sys.argv[1]) as db:
    db.execute("PRAGMA foreign_keys=ON")
    initialise_database(db)
    admin, secret = bootstrap_first_admin(db, 'Owner', sys.argv[2])
    confirm_admin_mfa(db, admin, code_at(secret, time.time()))
    for username, level in [('Device Editor', 'edit'), ('Device Reader', 'read'), ('Network Reader', 'read')]:
        actor = create_user(db, admin, username, sys.argv[2])
        db.execute("UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?", (secret, actor))
        section = 'IPAM' if username == 'Network Reader' else 'Devices'
        db.execute("INSERT INTO account_permission_overrides VALUES(?,?,?)", (actor, section, level))
        db.commit()
    db.execute("UPDATE organisation_features SET enabled=1 WHERE feature IN ('devices','ipam')")
    db.commit()
    common = dict(location='Office', mountType='Desktop', primaryIp='', manufacturer='Dell', model='OptiPlex', typeDetails={})
    stage_inventory(db, dict(devices=[
        dict(common, id='workshop', name='Workshop Desktop', type='Desktop', status='Active'),
        dict(common, id='lab', name='Lab Laptop', type='Laptop', status='Maintenance'),
        dict(common, id='retired', name='Former Reception PC', type='Desktop', status='Retired'),
        dict(common, id='server', name='Legacy Reporting Server', type='Legacy Server', status='Active'),
        dict(common, id='virtual', name='Virtual Training Server', type='Server - Virtual',
             isVirtual=True, mountType='Not Applicable', status='Active'),
        dict(common, id='spare', name='Stockroom Laptop', type='Laptop', status='Active'),
    ], deviceTypes=['Desktop','Laptop','Legacy Server','Server - Physical','Server - Virtual','Unknown'],
        deviceLocations=['Office','Unknown'], subnets=[], vlans=[], racks=[], ipAllocations={}))
    today = datetime.now(timezone.utc).date()
    db.executemany("INSERT INTO device_lifecycle VALUES(?,?,?,?,?)", [
        ('workshop', '2024-03-15', '2024-02-29', (today + timedelta(days=7)).isoformat(), None),
        ('lab', '2019-06-14', None, '2023-07-23', None),
        ('retired', '2016-04-02', '2016-05-14', '2019-04-02', '2019-05-14'),
        ('server', '2021-02-12', '2021-02-22', None, (today + timedelta(days=2)).isoformat()),
    ])
    print(secret)
`, [database, password]);

  const logFile = path.join(temporary, 'server.log');
  const log = fs.openSync(logFile, 'w');
  server = spawn('python3', ['-c', 'import backend.server as server; server.PORT=8103; server.main()'], {
    cwd: root, stdio: ['ignore', log, log], env: {...process.env, CAFFOOT_DB_PATH: database,
      CAFFOOT_TLS_DIR: path.join(temporary, 'tls'), CAFFOOT_WEB_ADDRESS: origin,
      CAFFOOT_SERVER_ADDRESS: '127.0.0.1', CAFFOOT_HOST: '127.0.0.1', PYTHONDONTWRITEBYTECODE: '1'},
  });
  fs.closeSync(log);
  browser = await chromium.launch({executablePath: process.env.CAFFOOT_CHROMIUM_PATH || undefined});
  const errors = [];
  async function login(username) {
    const context = await browser.newContext({ignoreHTTPSErrors: true, locale: 'en-GB',
      viewport: {width: 1440, height: 1050}});
    for (let attempt = 0; attempt < 40; attempt++) {
      try { if ((await context.request.get(origin + '/health', {timeout: 500})).ok()) break; } catch (_) {}
      if (server.exitCode !== null) throw Error(fs.readFileSync(logFile, 'utf8'));
      await new Promise(resolve => setTimeout(resolve, 125));
    }
    const code = python('from backend.mfa import code_at;import sys,time;print(code_at(sys.argv[1],time.time()))', [secret]);
    const signedIn = await context.request.post(origin + '/api/login', {
      headers: {Origin: origin}, data: {username, password, mfa_code: code},
    });
    assert.equal(signedIn.status(), 200, await signedIn.text());
    const page = await context.newPage();
    page.on('pageerror', error => {errors.push(error.message); console.error(error.stack);});
    page.setDefaultTimeout(8000);
    return {page, context};
  }
  async function go(page, section) {
    await page.goto('about:blank');
    await page.goto(origin + '/inventory#' + section);
    await page.locator('#app[aria-busy="false"]').waitFor();
  }
  async function optionalFeatures(page) {
    await go(page, 'settings');
    await page.getByRole('tab', {name: 'Optional Features'}).click();
    await page.locator('#optional-feature-equipment-lifecycle').waitFor();
  }
  async function settings(page) {
    await optionalFeatures(page);
    await page.getByRole('button', {name: 'Lifecycle Settings', exact: true}).click();
    await page.getByRole('heading', {name: 'Lifecycle Settings'}).waitFor();
  }
  async function lifecycle(page) {
    await go(page, 'dashboard');
    await page.getByRole('tab', {name: 'Lifecycle', exact: true}).click();
    await page.getByRole('heading', {name: 'Equipment Requiring Attention'}).waitFor();
  }
  async function details(page, device) {
    await page.locator('[data-lifecycle-device]').filter({hasText: device}).click();
    await page.locator('#device-lifecycle-heading').waitFor();
  }
  async function edit(page) {
    await page.getByRole('button', {name: 'Edit device', exact: true}).click();
    await page.locator('.device-editor-dialog').getByRole('tab', {name: 'Hardware', exact: true}).click();
    await page.locator('#device-lifecycle-edit-heading').waitFor();
  }
  async function postOn(page, route, click) {
    const response = page.waitForResponse(r => r.url().endsWith(route) && r.request().method() === 'POST');
    await click();
    const result = await response;
    assert.equal(result.status(), 200, await result.text());
    return result.request().postDataJSON();
  }
  async function manager(page) {
    await go(page, 'devices');
    await page.getByRole('tab', {name: 'Device Types', exact: true}).click();
    await page.getByRole('button', {name: 'Manage Device Types', exact: true}).click();
    await page.getByRole('heading', {name: 'Manage Device Types'}).waitFor();
  }

  const {page, context} = await login('Owner');
  await optionalFeatures(page);
  assert.equal(await page.locator('#optional-feature-equipment-lifecycle').isChecked(), false);
  assert.equal(await page.getByRole('button', {name: 'Lifecycle Settings', exact: true}).count(), 0);
  await postOn(page, '/api/settings/features', () =>
    page.locator('#optional-feature-equipment-lifecycle').check({force: true}));
  await page.getByRole('button', {name: 'Lifecycle Settings', exact: true}).click();
  const form = page.locator('#lifecycle-settings-form');
  assert.equal(await form.locator('[name=warrantyDays]').inputValue(), '90');
  assert.equal(await form.locator('[name=replacementDays]').inputValue(), '90');
  assert.equal(await form.getByRole('spinbutton', {name: 'Server lifespan in years', exact: true}).inputValue(), '5');
  assert.equal(await form.getByRole('spinbutton', {name: 'Legacy Server lifespan in years'}).inputValue(), '');
  assert.equal(await form.getByRole('spinbutton', {name: /Virtual Machine|Server - Virtual/}).count(), 0);
  await form.locator('[name=warrantyDays]').fill('0');
  await form.getByRole('spinbutton', {name: 'Legacy Server lifespan in years'}).fill('7');
  await postOn(page, '/api/settings/lifecycle', () => form.getByRole('button', {name: 'Save Settings'}).click());
  await settings(page);
  assert.equal(await form.locator('[name=warrantyDays]').inputValue(), '0');
  await form.locator('[name=replacementDays]').fill('5');
  page.once('dialog', dialog => dialog.dismiss());
  await form.getByRole('button', {name: 'Cancel', exact: true}).click();
  assert.equal(await form.locator('[name=replacementDays]').inputValue(), '5');
  page.once('dialog', dialog => dialog.accept());
  await page.keyboard.press('Escape');
  await form.waitFor({state: 'detached'});
  await settings(page);
  assert.equal(await form.locator('[name=replacementDays]').inputValue(), '90');
  await form.locator('[name=warrantyDays]').fill('90');
  await postOn(page, '/api/settings/lifecycle', () => form.getByRole('button', {name: 'Save Settings'}).click());

  await lifecycle(page);
  const tabs = page.getByRole('tablist', {name: 'Dashboard sections'});
  assert.deepEqual((await tabs.getByRole('tab').allTextContents()).map(text => text.trim()),
    ['Overview', 'Network Insights', 'Activity & Alerts', 'Lifecycle']);
  await page.keyboard.press('ArrowLeft');
  await page.locator('#dashboard-tab-activity[aria-selected="true"]').waitFor();
  await page.keyboard.press('ArrowRight');
  await page.locator('#dashboard-tab-lifecycle[aria-selected="true"]').waitFor();
  const metrics = page.locator('[data-lifecycle-category]');
  assert.deepEqual(await metrics.locator('strong').allTextContents(), ['1','1','1','1']);
  const search = page.getByRole('searchbox', {name: 'Search Devices'});
  await search.fill('Reception');
  assert.equal(await page.locator('[data-lifecycle-device]').count(), 0);
  await page.getByText('Include Retired Devices', {exact: true}).click();
  await page.locator('[data-lifecycle-device]').filter({hasText: 'Former Reception PC'}).waitFor();
  assert.deepEqual(await metrics.locator('strong').allTextContents(), ['1','1','1','1']);
  await page.getByRole('button', {name: 'Clear Filters'}).click();
  await metrics.filter({hasText: 'Warranty Expiring Soon'}).click();
  assert.equal(await page.locator('[data-lifecycle-device]').count(), 1);
  await details(page, 'Workshop Desktop');
  assert.match(await page.locator('.device-lifecycle-section').textContent(), /28\/02\/2027/);
  await edit(page);
  const fields = page.locator('[data-lifecycle-editor]');
  const ukPurchase = fields.locator('#caffoot-uk-lifecycle-purchaseDate');
  await ukPurchase.waitFor();
  assert.equal(await ukPurchase.inputValue(), '15/03/2024');
  await ukPurchase.fill('29/02/2024');
  assert.equal(await fields.locator('#lifecycle-purchaseDate').inputValue(), '2024-02-29');
  await ukPurchase.fill('31/02/2024');
  assert.equal(await fields.locator('#lifecycle-purchaseDate').inputValue(), '');
  assert.equal(await ukPurchase.getAttribute('aria-invalid'), 'true');
  await ukPurchase.fill('15/03/2024');
  await fields.getByRole('button', {name:'Choose Purchase Date from calendar'}).click();
  const ukPicker = page.getByRole('dialog', {name:'Choose Purchase Date (DD/MM/YYYY)'});
  await ukPicker.waitFor();
  assert.equal(await ukPicker.getByRole('button', {name:/15 March 2024/}).count(), 1);
  await page.keyboard.press('Escape');
  await ukPicker.waitFor({state:'hidden'});
  assert.equal(await fields.locator('#lifecycle-purchaseDate').inputValue(), '2024-03-15');
  await fields.locator('#lifecycle-warrantyExpiry').fill('');
  await fields.getByRole('button', {name: 'Use Suggestion'}).click();
  assert.equal(await fields.locator('#lifecycle-warrantyExpiry').inputValue(), '2025-03-15');
  await fields.locator('#lifecycle-purchaseDate').fill('2023-03-15');
  assert.equal(await fields.locator('#lifecycle-warrantyExpiry').inputValue(), '2025-03-15');
  await fields.locator('#lifecycle-replacementOverride').fill('2030-08-12');
  const saved = await postOn(page, '/api/devices/edit/save', () =>
    page.getByRole('button', {name: 'Save Device', exact: true}).click());
  assert.deepEqual(saved.lifecycle, {purchaseDate:'2023-03-15', warrantyExpiry:'2025-03-15', replacementOverride:'2030-08-12'});
  await page.locator('[data-lifecycle-editor]').waitFor({state:'hidden'});
  await lifecycle(page);
  await details(page, 'Workshop Desktop');
  assert.match(await page.locator('.device-lifecycle-section').textContent(), /Manual override/);
  await edit(page);
  await fields.getByRole('button', {name: 'Use Calculated Date'}).click();
  assert.equal(await fields.locator('#lifecycle-replacementOverride').inputValue(), '2027-02-28');
  await page.getByRole('button', {name: 'Back to Details', exact:true}).click();
  await page.getByRole('button', {name: 'Discard Changes', exact:true}).click();
  await page.locator('.device-editor-dialog').waitFor({state:'hidden'});
  await lifecycle(page);
  await details(page, 'Workshop Desktop');
  assert.match(await page.locator('.device-lifecycle-section').textContent(), /12\/08\/2030/);
  await edit(page);
  await fields.getByRole('button', {name: 'Use Calculated Date'}).click();
  const reset = await postOn(page, '/api/devices/edit/save', () =>
    page.getByRole('button', {name: 'Save Device', exact:true}).click());
  assert.deepEqual(reset.lifecycle, {replacementOverride:null});
  await page.locator('[data-lifecycle-editor]').waitFor({state:'hidden'});

  await manager(page);
  // A legacy stored type key remains attached to its actions while the visible
  // name (and accessible Archive label) follows the approved public naming.
  const legacyPhysical = page.locator('.catalog-manager-row')
    .filter({has: page.locator('[data-action="rename-device-catalogue-entry"][data-name="Server - Physical"]')});
  const legacyVirtual = page.locator('.catalog-manager-row')
    .filter({has: page.locator('[data-action="rename-device-catalogue-entry"][data-name="Server - Virtual"]')});
  assert.equal(await legacyPhysical.locator('strong').innerText(), 'Server');
  assert.equal(await legacyVirtual.locator('strong').innerText(), 'Virtual Machine');
  assert.equal(await page.getByRole('button', {name:'Archive Server', exact:true}).count(), 1);
  await postOn(page, '/api/inventory/device-catalogue/change', () =>
    page.getByRole('button', {name: 'Archive Legacy Server', exact: true}).click());
  await page.getByRole('button', {name: 'Unarchive Legacy Server', exact:true}).waitFor();
  await go(page, 'devices');
  await page.getByRole('button', {name: 'Add Device', exact:true}).click();
  assert.equal(await page.locator('#dev-type option').filter({hasText: 'Legacy Server'}).count(), 0);
  assert.equal(await fields.count(), 0);
  await lifecycle(page);
  await details(page, 'Legacy Reporting Server');
  await page.getByRole('button', {name: 'Duplicate', exact:true}).click();
  assert.equal(await fields.count(), 0);
  assert.equal(await page.locator('#dev-type').inputValue(), '');
  await settings(page);
  assert.equal(await form.getByRole('spinbutton', {name: 'Legacy Server lifespan in years'}).inputValue(), '7');

  const reader = await login('Device Reader');
  await lifecycle(reader.page);
  await details(reader.page, 'Lab Laptop');
  assert.equal(await reader.page.getByRole('button', {name:'Edit device', exact:true}).isVisible(), false);
  assert.equal((await reader.context.request.get(origin + '/api/settings/lifecycle')).status(),403);
  await reader.context.close();

  const editor = await login('Device Editor');
  await lifecycle(editor.page);
  await details(editor.page, 'Legacy Reporting Server');
  await edit(editor.page);
  assert.equal(await editor.page.locator('#lifecycle-replacementOverride').getAttribute('readonly'), '');
  assert.equal(await editor.page.getByRole('button', {name:'Use Calculated Date'}).isVisible(), false);
  await editor.page.locator('#lifecycle-purchaseDate').fill('2021-02-15');
  const ordinaryEdit = await postOn(editor.page, '/api/devices/edit/save', () =>
    editor.page.getByRole('button', {name: 'Save Device', exact:true}).click());
  assert.deepEqual(ordinaryEdit.lifecycle, {purchaseDate:'2021-02-15'});
  await editor.context.close();

  const staff = await login('Network Reader');
  await go(staff.page, 'dashboard');
  assert.equal(await staff.page.getByRole('tab', {name:'Lifecycle', exact:true}).count(), 0);
  const restricted = await staff.context.request.get(origin + '/api/inventory/state');
  assert.equal(Object.hasOwn(await restricted.json(), 'equipmentLifecycle'), false);
  await staff.context.close();

  if(target){
    fs.mkdirSync(target,{recursive:true});
    const captures=[];
    async function take(name, theme, fullPage=false){
      assert.equal(await page.locator('html').evaluate(el=>el.classList.contains('dark')), theme==='dark');
      const viewport=page.viewportSize();
      const file=`${name}-${theme}-${viewport.width}.png`;
      const bytes = await page.screenshot({path:path.join(target,file),fullPage,animations:'disabled'});
      captures.push({file,viewport,theme,fullPage,sha256:createHash('sha256').update(bytes).digest('hex')});
    }
    for(const viewport of [{width:1440,height:1050},{width:390,height:844}]){
      await page.setViewportSize(viewport);
      for(const theme of ['light','dark']){
        await lifecycle(page);
        await page.evaluate(value=>caffootSetTheme(value), theme);
        await page.getByText('Include Retired Devices', {exact: true}).click();
        assert.equal(await page.locator('.lifecycle-table table').evaluate(element =>
          element.scrollWidth <= element.closest('.lifecycle-table').clientWidth), true);
        await take('dashboard',theme,true);
        await details(page,'Workshop Desktop');
        await page.locator('#device-lifecycle-heading').scrollIntoViewIfNeeded();
        await take('device-details',theme);
        await edit(page);
        await fields.locator('#lifecycle-warrantyExpiry').fill('');
        await fields.evaluate(section=>{
          const body=section.closest('.device-review-body');
          body.scrollTop+=section.getBoundingClientRect().top-body.getBoundingClientRect().top-8;
        });
        await take('device-edit',theme);
        await settings(page);
        await take('settings',theme,true);
        await manager(page);
        await page.getByRole('button', {name:'Unarchive Legacy Server',exact:true}).scrollIntoViewIfNeeded();
        await take('device-types',theme);
      }
    }
    fs.writeFileSync(path.join(target,'captures.json'),JSON.stringify({
      revision:spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).stdout.trim(),
      browser:browser.version(), capturedAt:new Date().toISOString(), captures,
    },null,2)+'\n');
  }
  await optionalFeatures(page);
  page.once('dialog', dialog => dialog.accept());
  await postOn(page, '/api/settings/features', () => page.locator('#optional-feature-equipment-lifecycle').uncheck({force:true}));
  await go(page,'dashboard');
  assert.equal(await page.getByRole('tab', {name:'Lifecycle',exact:true}).count(),0);
  assert.equal(Object.hasOwn(await (await context.request.get(origin+'/api/inventory/state')).json(), 'equipmentLifecycle'),false);
  assert.deepEqual(errors,[]);
  await context.close();
  completed=true;
  console.log('Equipment Lifecycle journeys passed in the real HTTPS application.');
}

main().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{
  if(browser)await browser.close();
  if(server)server.kill();
  if(completed)fs.rmSync(temporary,{recursive:true,force:true});
  else console.error('Local test diagnostics: '+temporary);
});
