// Real HTTPS application journeys and optional screenshot capture for Batch 4.3.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawn, spawnSync} = require('node:child_process');
const {chromium} = require('playwright');

const root = path.resolve(__dirname, '..');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'caffoot-equipment-suppliers-'));
const database = path.join(temporary, 'inventory.sqlite3');
const origin = 'https://127.0.0.1:8098';
const password = 'Fictional-Equipment-Supplier-2026!';
let browser, server, reviewPage;
function python(source, args = []) {
  const result = spawnSync('python3', ['-c', source, ...args], {cwd: root, encoding: 'utf8'});
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}
async function main() {
  const secret = python(`
import sqlite3, sys, time
from backend.schema import initialise_database
from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.permissions import create_user
from backend.mfa import code_at
with sqlite3.connect(sys.argv[1]) as db:
    db.execute("PRAGMA foreign_keys=ON")
    initialise_database(db)
    admin, secret = bootstrap_first_admin(db, 'Owner', sys.argv[2])
    confirm_admin_mfa(db, admin, code_at(secret, time.time()))
    for username, grants in [('Equipment Editor', [('Devices','edit'),('IT Assets','edit')]),
                             ('Device Reader', [('Devices','read')])]:
        actor = create_user(db, admin, username, sys.argv[2])
        db.execute("UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?", (secret, actor))
        db.executemany("INSERT INTO account_permission_overrides VALUES(?,?,?)",
                       [(actor, section, level) for section, level in grants])
        db.commit()
    db.execute("UPDATE organisation_features SET enabled=1 WHERE feature IN ('devices','it_assets','suppliers')")
    db.execute("INSERT INTO suppliers(name,name_key,website,description) VALUES('Northlight Technology Ltd','northlight technology ltd','','')")
    print(secret)
`, [database, password]);
  const logfile = path.join(temporary, 'server.log');
  const log = fs.openSync(logfile, 'w');
  server = spawn('python3', ['-c', 'import backend.server as server; server.PORT=8098; server.main()'], {
    cwd: root, stdio: ['ignore', log, log], env: {...process.env, CAFFOOT_DB_PATH: database,
      CAFFOOT_TLS_DIR: path.join(temporary, 'tls'), CAFFOOT_WEB_ADDRESS: origin,
      CAFFOOT_SERVER_ADDRESS: '127.0.0.1', CAFFOOT_HOST: '127.0.0.1', CAFFOOT_PORT: '8098'},
  });
  fs.closeSync(log);
  browser = await chromium.launch({headless: true, executablePath: process.env.CAFFOOT_CHROMIUM_PATH || undefined});
  const errors = [];
  async function login(username, route) {
    const context = await browser.newContext({ignoreHTTPSErrors: true, viewport: {width: 1440, height: 1050}});
    for (let attempt = 0; attempt < 50; attempt++) {
      try { if ((await context.request.get(origin + '/health', {timeout: 500})).ok()) break; } catch (_) {}
      if (server.exitCode !== null) throw Error(fs.readFileSync(logfile, 'utf8'));
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    const code = python('from backend.mfa import code_at;import sys,time;print(code_at(sys.argv[1],time.time()))', [secret]);
    const signedIn = await context.request.post(origin + '/api/login', {headers: {Origin: origin},
      data: {username, password, mfa_code: code}});
    assert.equal(signedIn.status(), 200, await signedIn.text());
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.setDefaultTimeout(8000);
    await page.goto(origin + '/inventory' + route);
    await page.locator('#app[aria-busy="false"]').waitFor();
    return {page, context};
  }
  const {page, context} = await login('Owner', '#devices');
  reviewPage = page;
  const post = async (p, route, submit) => {
    const next = p.waitForResponse(response => response.url().endsWith(route) && response.request().method() === 'POST');
    await submit.click();
    const result = await next;
    assert.equal(result.status(), 200, await result.text());
    return {response: await result.json(), payload: result.request().postDataJSON()};
  };
  const deviceForm = page.locator('form[data-device-form]');
  const deviceSupplier = deviceForm.getByRole('combobox', {name: 'Supplier (Optional)'});
  const supplierDialog = page.locator('[data-supplier-dialog]');
  await page.getByRole('button', {name: 'Add Device', exact: true}).click();
  await deviceForm.locator('#dev-name').fill('Meeting Room Display');
  await deviceForm.locator('#dev-type').selectOption('Laptop');
  await deviceForm.locator('#dev-location').selectOption('Unknown');
  assert.match(await deviceSupplier.locator('xpath=ancestor::div[contains(@class,"form-section-card")]').locator('h3').textContent(), /Device Identity/);
  await deviceSupplier.fill('Northlight Technology Ltd');
  await deviceForm.getByRole('button', {name: '+ Add Supplier', exact: true}).click();
  await supplierDialog.getByLabel('Supplier Name').fill('Unsaved Company');
  await page.keyboard.press('Escape');
  await page.locator('#discard-dialog [data-action="discard-device-form-changes"]').click();
  assert.equal(await deviceForm.locator('#dev-name').inputValue(), 'Meeting Room Display');
  assert.equal(await deviceSupplier.inputValue(), 'Northlight Technology Ltd');

  const direct = await post(page, '/api/devices/create', page.locator('.device-review-footer [type="submit"]'));
  assert.deepEqual(direct.payload.supplier, {text: 'Northlight Technology Ltd'});
  await page.locator('#modal-container.hidden').waitFor({state: 'attached'});
  const state = async () => (await context.request.get(origin + '/api/inventory/state')).json();
  const device = (await state()).devices.find(record => record.name === 'Meeting Room Display');
  await page.evaluate(id => openDeviceModal(id), device.id);
  await deviceSupplier.waitFor();
  await deviceForm.getByRole('button', {name: '+ Add Supplier', exact: true}).click();
  await supplierDialog.getByLabel('Supplier Name').fill('Dockland Equipment Ltd');
  await supplierDialog.getByRole('button', {name: 'Add Another Contact'}).click();
  assert.equal(await supplierDialog.locator('[data-supplier-contact-entry]').count(), 2);
  const company = await post(page, '/api/suppliers', supplierDialog.getByRole('button', {name: 'Add Supplier', exact: true}));
  await deviceSupplier.waitFor();
  assert.equal(await deviceSupplier.inputValue(), 'Dockland Equipment Ltd');
  assert.equal(await deviceForm.locator('#dev-name').inputValue(), 'Meeting Room Display');
  const edit = await post(page, '/api/devices/edit/save', page.locator('.device-review-footer [type="submit"]'));
  assert.deepEqual(edit.payload.supplier, {id: company.response.id});
  await page.locator('#modal-container.hidden').waitFor({state: 'attached'});
  await page.evaluate(id => duplicateDevice(id), device.id);
  assert.equal(await deviceSupplier.inputValue(), '');
  await page.evaluate(() => closeModal(true));

  const editor = await login('Equipment Editor', '#it-assets');
  await editor.page.getByRole('tab', {name: 'Receive Stock', exact: true}).click();
  const receiptForm = editor.page.locator('#stock-receipt-form');
  await receiptForm.locator('#stock-category').selectOption('Keyboard');
  await receiptForm.locator('#stock-model').fill('USB Keyboards');
  await receiptForm.locator('#stock-quantity').fill('50');
  const receiptSupplier = receiptForm.getByRole('combobox', {name: 'Supplier (Optional)'});
  assert.equal(await receiptForm.getByRole('button', {name: '+ Add Supplier', exact: true}).count(), 0);
  await receiptSupplier.fill('Northlight');
  await editor.page.getByRole('option', {name: 'Northlight Technology Ltd'}).waitFor();
  await receiptSupplier.press('ArrowDown');
  await receiptSupplier.press('Enter');
  assert.equal(await receiptSupplier.inputValue(), 'Northlight Technology Ltd');
  const receipt = await post(editor.page, '/api/it-assets/receive', receiptForm.getByRole('button', {name: 'Record Receipt'}));
  assert.equal(receipt.payload.supplierId, 1);
  await editor.page.getByRole('tab', {name: 'Issue Equipment', exact: true}).click();
  assert.equal(await editor.page.getByRole('combobox', {name: 'Supplier (Optional)'}).count(), 0);

  const reader = await login('Device Reader', '#devices');
  await reader.page.evaluate(id => openDeviceDetailView(id), device.id);
  await reader.page.getByText('Dockland Equipment Ltd', {exact: true}).waitFor();
  assert.equal(await reader.page.getByRole('button', {name: 'View Supplier'}).count(), 0);
  assert.equal(await reader.page.locator('[data-select-device-supplier]').count(), 0);
  await page.evaluate(() => { activeDeviceDetailsTab = 'inventory'; switchTab('devices'); });
  await page.getByRole('checkbox', {name: 'Select Meeting Room Display'}).check();
  await page.getByRole('button', {name: 'Assign Supplier'}).click();
  await supplierDialog.getByText('1 selected Device').waitFor();
  assert.match(await supplierDialog.innerText(), /will be replaced/);
  await supplierDialog.getByRole('combobox', {name: 'Supplier'}).fill('Northlight');
  await supplierDialog.getByRole('option', {name: 'Northlight Technology Ltd'}).click();
  const assignment = await post(page, '/api/suppliers/assign/devices',
    supplierDialog.getByRole('button', {name: 'Confirm Assignment'}));
  assert.equal(assignment.response.updated, 1);
  assert.equal((await state()).deviceSuppliers[device.id].id, 1);

  await editor.page.getByRole('tab', {name: 'Receipt History'}).click();
  const stockRow = editor.page.locator('#stock-receipt-' + receipt.response.receiptId);
  await stockRow.getByRole('button', {name: 'Remove Supplier Association'}).click();
  const receiptDialog = editor.page.locator('[data-supplier-dialog]');
  assert.match(await receiptDialog.innerText(), /retains the original receipt/);
  await post(editor.page, '/api/suppliers/assign/receipts', receiptDialog.getByRole('button', {name: 'Confirm Removal'}));
  await stockRow.getByRole('button', {name: 'Link Supplier'}).waitFor();
  assert.match(await stockRow.innerText(), /Northlight Technology Ltd/);
  await stockRow.getByRole('checkbox').check();
  await editor.page.getByRole('button', {name: 'Assign Supplier'}).click();
  await receiptDialog.getByRole('combobox', {name: 'Supplier'}).fill('Northlight');
  await receiptDialog.getByRole('option', {name: 'Northlight Technology Ltd'}).click();
  await post(editor.page, '/api/suppliers/assign/receipts', receiptDialog.getByRole('button', {name: 'Confirm Assignment'}));
  await stockRow.getByText('Linked Supplier: Northlight Technology Ltd').waitFor();
  assert.deepEqual(errors, []);
  console.log('PASS: real Device and receipt fields, explicit selection, Supplier creation and discard, preserved drafts, duplicate blank, read-only name, and confirmed assignments and removal in the existing lists.');
}
main().catch(async error => {
  console.error(error);
  if (reviewPage) console.error(await reviewPage.locator('#modal-content').innerText().catch(() => ''));
  if (fs.existsSync(path.join(temporary, 'server.log'))) console.error(fs.readFileSync(path.join(temporary, 'server.log'), 'utf8').split('\n').slice(-10).join('\n'));
  process.exitCode = 1;
}).finally(async () => {
  await browser?.close();
  server?.kill();
  fs.rmSync(temporary, {recursive: true, force: true});
});
