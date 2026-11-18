// Exercise the real HTTPS Supplier application and optionally capture review evidence.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawn, spawnSync} = require('node:child_process');
const {chromium} = require('playwright');

const root = path.resolve(__dirname, '..');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'caffoot-suppliers-'));
const database = path.join(temporary, 'inventory.sqlite3');
const origin = 'https://127.0.0.1:8097';
const evidence = process.env.CAFFOOT_SUPPLIER_EVIDENCE;
let browser, server, log;
const owner = 'Purchasing Owner', reader = 'Purchasing Reader';
const password = 'Fictional-Supplier-Acceptance-2026!';
function python(source, args = []) {
  const result = spawnSync('python3', ['-c', source, ...args], {cwd: root, encoding: 'utf8'});
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}
const revision = () => spawnSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8'}).stdout.trim();

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
    owner, secret = bootstrap_first_admin(db, sys.argv[2], sys.argv[4])
    confirm_admin_mfa(db, owner, code_at(secret, time.time()))
    reader = create_user(db, owner, sys.argv[3], sys.argv[4])
    db.execute("UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?", (secret, reader))
    db.execute("INSERT INTO account_permission_overrides VALUES(?,'Suppliers','read')", (reader,))
    print(secret)
`, [database, owner, reader, password]);
  log = fs.openSync(path.join(temporary, 'server.log'), 'w');
  server = spawn('python3', ['-c', 'import backend.server as server; server.PORT=8097; server.main()'], {
    cwd: root, stdio: ['ignore', log, log], env: {...process.env, CAFFOOT_DB_PATH: database,
      CAFFOOT_TLS_DIR: path.join(temporary, 'tls'), CAFFOOT_WEB_ADDRESS: origin,
      CAFFOOT_SERVER_ADDRESS: '127.0.0.1', CAFFOOT_HOST: '127.0.0.1', CAFFOOT_PORT: '8097'}
  });
  browser = await chromium.launch({headless: true, executablePath: process.env.CAFFOOT_CHROMIUM_PATH || undefined});
  const contextOptions = {ignoreHTTPSErrors: true, viewport: {width: 1440, height: 1050}};
  const context = await browser.newContext(contextOptions);
  for (let attempt = 0; attempt < 45; attempt++) {
    try { if ((await context.request.get(origin + '/health', {timeout: 600})).ok()) break; } catch (_) {}
    if (server.exitCode !== null) throw Error(fs.readFileSync(path.join(temporary, 'server.log'), 'utf8'));
    await new Promise(resolve => setTimeout(resolve, 125));
  }
  async function login(context, username) {
    const code = python('from backend.mfa import code_at;import sys,time;print(code_at(sys.argv[1],time.time()))', [secret]);
    const response = await context.request.post(origin + '/api/login', {headers: {Origin: origin},
      data: {username, password, mfa_code: code}});
    assert.equal(response.status(), 200, await response.text());
  }
  await login(context, owner);
  const page = await context.newPage();
  page.setDefaultTimeout(6500);
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  const button = name => page.getByRole('button', {name, exact: true});
  const dialog = page.locator('#modal-content');
  const modalButton = name => dialog.getByRole('button', {name, exact: true});
  const supplierNav = page.locator('#sidebar [data-tab="suppliers"]');
  async function settings() {
    await page.goto(origin + '/inventory');
    await page.locator('#next-settings-nav').click();
    await page.getByRole('tab', {name: 'Optional Features'}).click();
    await page.locator('#optional-feature-suppliers').waitFor();
  }
  async function toggleFeature(enabled) {
    const control = page.locator('#optional-feature-suppliers');
    const response = page.waitForResponse(result =>
      result.url().endsWith('/api/settings/features') && result.request().method() === 'POST');
    if (!enabled) page.once('dialog', confirmation => confirmation.accept());
    await control.setChecked(enabled, {force: true});
    assert.equal((await response).status(), 200);
    await page.waitForFunction(expected => {
      const input = document.querySelector('#optional-feature-suppliers');
      return input && !input.disabled && input.checked === expected;
    }, enabled);
  }
  await settings();
  assert.equal(await supplierNav.isVisible(), false);
  assert.equal(await page.locator('#optional-feature-equipment-lifecycle').count(), 0);
  await toggleFeature(true);
  await supplierNav.click();
  assert.equal(await page.locator('.supplier-live .tabs').evaluate(nav => getComputedStyle(nav).display), 'flex');
  assert.notEqual(await button('Add Supplier').evaluate(control => getComputedStyle(control).backgroundColor),
    await button('Manage Categories').evaluate(control => getComputedStyle(control).backgroundColor));
  await button('Add Supplier').click();
  await dialog.getByLabel('Supplier Name').fill('Northlight Technology Ltd');
  await dialog.getByLabel('Website').fill('https://example.org');
  await dialog.getByLabel('Supplier Description').fill('Business laptops, network equipment and software licences.');
  await dialog.getByLabel('Address', {exact: true}).fill('42 Bridge Street');
  await dialog.getByLabel('Town / City').fill('Manchester');
  await dialog.getByLabel('Postcode').fill('M1 2AB');
  await dialog.getByLabel('Hardware', {exact: true}).check();
  await dialog.getByLabel('Networking', {exact: true}).check();
  const entries = dialog.locator('[data-supplier-contact-entry]');
  assert.equal(await entries.count(), 1);
  await entries.first().getByLabel('Role / Job Title').fill('Account Manager');
  await modalButton('Add Supplier').click();
  await dialog.getByRole('alert').getByText('Enter a Contact name').waitFor();
  assert.equal(await entries.first().getByLabel('Role / Job Title').inputValue(), 'Account Manager');
  await entries.first().getByLabel('Contact Name').fill('Kim Cooper');
  await entries.first().getByLabel('Telephone Numbers').fill('0161 555 0134\n07700 900201');
  await entries.first().getByLabel('Email Addresses').fill('kim@example.org\nsales@example.org');
  await entries.first().getByLabel('Contact Scope').selectOption('company');
  await modalButton('Add Another Contact').click();
  await entries.nth(1).getByLabel('Contact Name').fill('Jo Patel');
  await entries.nth(1).getByLabel('Role / Job Title').fill('Technical Support');
  await modalButton('Add Supplier').click();
  await page.getByRole('heading', {name: 'Supplier Overview'}).waitFor();
  const supplierUrl = page.url();
  await page.getByRole('tab', {name: 'Locations', exact: true}).click();
  await button('Add Location').click();
  await dialog.getByLabel('Location Name').fill('Leeds Branch');
  await dialog.getByLabel('Address', {exact: true}).fill('18 Park Row');
  await dialog.getByLabel('Town / City').fill('Leeds');
  await modalButton('Add Location').click();
  const leeds = page.getByRole('article').filter({has: page.getByRole('heading', {name: 'Leeds Branch'})});
  await leeds.waitFor();
  assert.equal(await leeds.getByRole('button', {name: 'Kim Cooper'}).count(), 1);
  await page.getByRole('tab', {name: 'Contacts', exact: true}).click();
  await button('Jo Patel').click();
  await modalButton('Edit Contact').click();
  await dialog.getByLabel('Leeds Branch').check();
  await dialog.getByLabel('Professional / Social Links').fill('Company Profile | https://example.org/support');
  await modalButton('Save Contact').click();
  await dialog.getByRole('link', {name: 'Company Profile'}).waitFor();
  await modalButton('Add Note').click();
  await dialog.getByLabel('Note').fill('Jo coordinates technical support across both offices.');
  await modalButton('Save Note').click();
  const contactNote = 'Jo coordinates technical support across both offices.';
  await dialog.getByText(contactNote).waitFor();
  await modalButton('Edit').click();
  await dialog.getByLabel('Note').fill('Uncommitted correction');
  await page.keyboard.press('Escape');
  await button('Keep Editing').click();
  assert.equal(await dialog.getByLabel('Note').inputValue(), 'Uncommitted correction');
  await modalButton('Cancel').click();
  await button('Discard Changes').click();
  await dialog.getByText(contactNote).waitFor();
  await modalButton('Close').click();
  await page.getByRole('tab', {name: 'Notes', exact: true}).click();
  await button('Add Supplier Note').click();
  await dialog.getByLabel('Note').fill('Quarterly licensing review takes place in March.');
  await modalButton('Save Note').click();
  await page.getByText('Quarterly licensing review takes place in March.').waitFor();
  await page.getByLabel('Filter Notes By Owner').selectOption('contacts');
  assert.equal(await page.getByText(contactNote).count(), 1);
  assert.equal(await page.getByText('Quarterly licensing review takes place in March.').count(), 0);
  await page.getByLabel('Filter Notes By Owner').selectOption('all');
  assert.equal(await page.getByText(/Use Archive to retain/).isVisible(), true);
  const readContext = await browser.newContext(contextOptions);
  await login(readContext, reader);
  const readPage = await readContext.newPage();
  await readPage.goto(supplierUrl);
  await readPage.getByRole('heading', {name: 'Supplier Overview'}).waitFor();
  assert.equal(await readPage.getByRole('button', {name: 'Edit Supplier'}).count(), 0);
  assert.equal(await readPage.locator('#sidebar [data-tab="it-assets"]').isVisible(), false);
  assert.equal(await readPage.locator('#sidebar [data-tab="devices"]').isVisible(), false);
  await readContext.close();

  await settings();
  await toggleFeature(false);
  await supplierNav.waitFor({state: 'hidden'});
  assert.equal((await context.request.get(origin + '/api/suppliers')).status(), 403);
  await toggleFeature(true);
  await supplierNav.click();
  await page.getByLabel('Search Suppliers').fill('northlight');
  await button('Filter By Category').click();
  await page.getByRole('listbox').getByRole('option', {name: 'Hardware', exact: true}).click();
  assert.equal(await button('Northlight Technology Ltd').count(), 1);
  assert.deepEqual(errors, []);

  if (evidence) {
    fs.mkdirSync(evidence, {recursive: true});
    const shots = [];
    async function capture(name, theme, width, height) {
      await page.waitForFunction(() => document.documentElement.scrollWidth <= innerWidth + 1);
      const file = `${name}-${theme}-${width}.png`;
      await page.screenshot({path: path.join(evidence, file), animations: 'disabled'});
      shots.push({file, theme, viewport: {width, height}});
    }
    for (const [width, height] of [[1440, 1050], [390, 844]]) {
      await page.setViewportSize({width, height});
      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => caffootSetTheme(theme), theme);
        await page.goto(origin + '/inventory#suppliers');
        await page.reload();
        await button('Northlight Technology Ltd').waitFor();
        await capture('directory', theme, width, height);
        await button('Add Supplier').click();
        await capture('add-supplier', theme, width, height);
        await modalButton('Add Supplier').scrollIntoViewIfNeeded();
        await capture('add-supplier-contact', theme, width, height);
        await modalButton('Cancel').click();
        await button('Northlight Technology Ltd').click();
        await page.getByRole('heading', {name: 'Supplier Overview'}).waitFor();
        await capture('overview', theme, width, height);
        for (const tab of ['Locations', 'Contacts', 'Notes']) {
          await page.getByRole('tab', {name: tab, exact: true}).click();
          await capture(tab.toLowerCase(), theme, width, height);
          if (tab === 'Contacts') {
            await button('Jo Patel').click();
            await capture('contact-details', theme, width, height);
            await modalButton('Close').click();
          }
        }
      }
    }
    fs.writeFileSync(path.join(evidence, 'manifest.json'), JSON.stringify({
      sourceCommit: revision(), schema: 21, browser: 'Chromium ' + browser.version(),
      origin, captures: shots
    }, null, 2) + '\n');
  }
  assert.deepEqual(errors, []);
  console.log('PASS Supplier settings, form validation, multi-location Contacts, Notes, Cancel/Escape, filters and Read permissions');
}
main().catch(error => {console.error(error); process.exitCode = 1;}).finally(async () => {
  await browser?.close();
  server?.kill();
  if (log !== undefined) fs.closeSync(log);
  if (process.exitCode) console.error('Isolated server log:', path.join(temporary, 'server.log'));
  else fs.rmSync(temporary, {recursive: true, force: true});
});
