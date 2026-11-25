// Exercise the real HTTPS Supplier application and optionally capture review evidence.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawn, spawnSync} = require('node:child_process');
const {createHash} = require('node:crypto');
const {chromium} = require('playwright');

const root = path.resolve(__dirname, '..');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'caffoot-suppliers-'));
const database = path.join(temporary, 'inventory.sqlite3');
const origin = 'https://127.0.0.1:8097';
const headerEvidence = process.env.CAFFOOT_SUPPLIER_HEADER_EVIDENCE;
const evidence = headerEvidence || process.env.CAFFOOT_SUPPLIER_EVIDENCE;
const issueEvidence = process.env.CAFFOOT_SUPPLIER_ISSUE_EVIDENCE;
let browser, server, log;
const owner = 'Purchasing Owner', reader = 'Purchasing Reader';
const password = 'Fictional-Supplier-Acceptance-2026!';
function python(source, args = []) {
  const result = spawnSync('python3', ['-c', source, ...args], {cwd: root, encoding: 'utf8'});
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}
const revision = () => spawnSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8'}).stdout.trim();

async function checkDetailsHeader(page, actions, explanation = null) {
  const group = page.locator('.supplier-live .section-page-header > .header > .preview-page-actions');
  assert.deepEqual(await group.getByRole('button').allTextContents(), actions);
  const note = group.locator('.supplier-header-retention');
  if (explanation) assert.match(await note.textContent(), explanation);
  else assert.equal(await note.count(), 0);

  await group.evaluate((element, expectedNote) => {
    const bounds = element.closest('.header').getBoundingClientRect();
    const buttons = [...element.querySelectorAll('button')].map(button => button.getBoundingClientRect());
    if (buttons.some(button => button.left < bounds.left - 1 || button.right > bounds.right + 1))
      throw Error('Supplier Details header actions overflow their container');
    if (innerWidth >= 1200 && buttons.some(button => Math.abs(button.top - buttons[0].top) > 1))
      throw Error('Supplier Details header actions wrap at desktop width');
    if (expectedNote) {
      const note = element.querySelector('.supplier-header-retention').getBoundingClientRect();
      if (note.top < Math.max(...buttons.map(button => button.bottom)) ||
          note.left < bounds.left - 1 || note.right > bounds.right + 1)
        throw Error('Supplier retention explanation does not fit below the header actions');
    }
  }, Boolean(explanation));
}

async function purchaserHasOneSelected(page) {
  return page.locator('#sidebar [aria-current="page"]').evaluateAll(items =>
    items.length === 1 && items[0].dataset.tab === 'purchasing');
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
    owner, secret = bootstrap_first_admin(db, sys.argv[2], sys.argv[4])
    confirm_admin_mfa(db, owner, code_at(secret, time.time()))
    reader = create_user(db, owner, sys.argv[3], sys.argv[4])
    db.execute("UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?", (secret, reader))
    db.execute("INSERT INTO account_permission_overrides VALUES(?,'Suppliers','read')", (reader,))
    db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='devices'")
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
  const lifecycleFeature = page.locator('#optional-feature-equipment-lifecycle');
  assert.equal(await lifecycleFeature.count(), 1, 'Equipment Lifecycle has its own enable switch');
  assert.equal(await lifecycleFeature.isChecked(), false, 'Equipment Lifecycle starts disabled');
  await toggleFeature(true);
  assert.equal(await lifecycleFeature.isChecked(), false, 'Enabling Supplier Management leaves Equipment Lifecycle disabled');
  const purchasingNav = button('Purchasing');
  const itToggle = page.locator('#sidebar [data-group="it"]');
  const purchasingToggle = page.locator('#sidebar [data-group="purchasing"]');
  await purchasingNav.click();
  await page.getByText('No Active Supplier Issues', {exact: true}).waitFor();
  assert.equal(await page.locator('#sidebar [aria-label="Dashboard"]').count(), 0);
  assert.equal(await supplierNav.isVisible(), true);
  await itToggle.press('Space');
  assert.equal(await itToggle.getAttribute('aria-expanded'), 'false');
  assert.equal(await supplierNav.isVisible(), true);
  await purchasingToggle.press('Space');
  assert.equal(await purchasingToggle.getAttribute('aria-expanded'), 'false');
  await button('IT').click();
  await page.waitForURL('**/inventory#dashboard');
  assert.equal(await itToggle.getAttribute('aria-expanded'), 'true');
  assert.equal(await purchasingToggle.getAttribute('aria-expanded'), 'false');
  await page.locator('#sidebar [data-tab="devices"]').click();
  await page.locator('#sidebar [data-tab="devices"][aria-current="page"]').waitFor();
  assert.deepEqual(await page.locator('#sidebar [aria-current="page"]').evaluateAll(items => items.map(item => item.dataset.tab)), ['devices']);
  await purchasingNav.click();
  assert.equal(await purchasingToggle.getAttribute('aria-expanded'), 'true');
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
  const archiveActions = ['Back To Suppliers', 'Edit Supplier', 'Archive'];
  const retention = /This Supplier has Note history\. Use Archive to retain its records\./;
  await checkDetailsHeader(page, [...archiveActions, 'Delete']);
  await button('Delete').click();
  await dialog.getByRole('heading', {name: 'Delete Supplier?'}).waitFor();
  await modalButton('Cancel').click();
  await checkDetailsHeader(page, [...archiveActions, 'Delete']);
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
  await page.getByRole('tab', {name: 'Notes & Issues', exact: true}).click();
  await button('Add Supplier Note').click();
  await dialog.getByLabel('Note').fill('Quarterly licensing review takes place in March.');
  await modalButton('Save Note').click();
  await page.getByText('Quarterly licensing review takes place in March.').waitFor();
  await page.getByLabel('Filter Notes By Owner').selectOption('contacts');
  assert.equal(await page.getByText(contactNote).count(), 1);
  assert.equal(await page.getByText('Quarterly licensing review takes place in March.').count(), 0);
  await page.getByLabel('Filter Notes By Owner').selectOption('all');
  await checkDetailsHeader(page, archiveActions, retention);
  await button('Archive').click();
  await modalButton('Archive Supplier').click();
  await button('Reactivate').waitFor();
  await checkDetailsHeader(page, ['Back To Suppliers', 'Edit Supplier', 'Reactivate'], retention);
  await button('Reactivate').click();
  await modalButton('Reactivate Supplier').click();
  await button('Archive').waitFor();
  await checkDetailsHeader(page, archiveActions, retention);
  async function addIssue(title, description, contact) {
    await button('Add Issue').click();
    await dialog.getByRole('heading', {name: 'Add Supplier Issue'}).waitFor();
    assert.equal(await dialog.getByLabel('Issue Status').count(), 0);
    await dialog.getByLabel('Issue Title').fill(title);
    await dialog.getByLabel('Main Description').fill(description);
    if (contact) await dialog.getByLabel(contact, {exact: true}).check();
  }
  await button('Issues').click();
  const issueEvidenceUrl = page.url();
  assert.match(issueEvidenceUrl, /\/notes\/issues$/);
  await addIssue('Damaged monitors', 'Three monitors arrived with cracked screens.', 'Jo Patel');
  await modalButton('Add Issue Category').click();
  await dialog.getByLabel('Category Name').fill('Replacement Parts');
  await modalButton('Save Category').click();
  await dialog.getByRole('button', {name: 'Issue Category', exact: true}).filter({hasText: 'Replacement Parts'}).waitFor();
  await modalButton('Add Issue').click();
  const monitorRow = page.locator('#supplier-issue-rows tr').filter({hasText: 'Damaged monitors'});
  await monitorRow.waitFor();
  assert.match(await monitorRow.innerText(), /Replacement Parts[\s\S]*Jo Patel[\s\S]*Open/);
  await page.getByRole('button', {name: 'Filter Issues By Category', exact: true}).click();
  await page.getByRole('listbox').getByRole('option', {name: 'Warranty', exact: true}).click();
  assert.equal(await monitorRow.count(), 0);
  await page.getByRole('button', {name: 'Filter Issues By Category', exact: true}).click();
  await page.getByRole('listbox').getByRole('option', {name: 'Replacement Parts', exact: true}).click();
  await monitorRow.getByRole('button', {name: 'View Details'}).click();
  await dialog.getByRole('heading', {name: 'Supplier Issue Details'}).waitFor();
  await dialog.getByLabel('Issue Status').selectOption('In Progress');
  await dialog.getByLabel('New Dated Update').fill('The supplier is arranging replacements.');
  await modalButton('Save Issue Changes').click();
  await monitorRow.getByText('In Progress', {exact: true}).waitFor();
  await monitorRow.getByRole('button', {name: 'View Details'}).click();
  await modalButton('Edit').click();
  await dialog.getByLabel('Issue Update').fill('Uncommitted update correction');
  await page.keyboard.press('Escape');
  await button('Keep Editing').click();
  assert.equal(await dialog.getByLabel('Issue Update').inputValue(), 'Uncommitted update correction');
  await modalButton('Cancel').click();
  await button('Discard Changes').click();
  await dialog.getByText('The supplier is arranging replacements.').waitFor();
  await modalButton('Edit').click();
  await dialog.getByLabel('Issue Update').fill('The supplier has confirmed that replacements are being arranged.');
  await modalButton('Save Changes').click();
  await dialog.getByText(/Corrected by Purchasing Owner/).waitFor();
  await dialog.getByLabel('Jo Patel', {exact: true}).uncheck();
  await dialog.getByLabel('Kim Cooper', {exact: true}).check();
  await modalButton('Save Issue Changes').click();
  await monitorRow.getByText('Kim Cooper', {exact: true}).waitFor();
  await page.getByRole('tab', {name: 'Contacts', exact: true}).click();
  await button('Jo Patel').click();
  await dialog.getByText('No Supplier Issues Are Linked To This Contact.').waitFor();
  await modalButton('Close').click();
  await button('Kim Cooper').click();
  await modalButton('View Supplier Issue').click();
  await dialog.getByRole('heading', {name: 'Supplier Issue Details'}).waitFor();
  await modalButton('Cancel').click();
  await dialog.getByRole('heading', {name: 'Kim Cooper'}).waitFor();
  await modalButton('Close').click();

  await page.getByRole('tab', {name: 'Overview', exact: true}).click();
  assert.match(await button(/Active Issues/).innerText(), /1/);
  await button(/Active Issues/).click();
  await button('Manage Issue Categories').click();
  const replacement = dialog.getByRole('row', {name: /Replacement Parts/});
  await replacement.getByRole('button', {name: 'Retire', exact: true}).click();
  await modalButton('Retire Issue Category').click();
  await replacement.getByText('Retired', {exact: true}).waitFor();
  await modalButton('Close').click();
  assert.match(await monitorRow.innerText(), /Replacement Parts \(Retired\)/);
  await button('Filter Issues By Category').click();
  await page.getByRole('listbox').getByRole('option', {name: 'All Categories', exact: true}).click();

  for (const [title, description, status] of [
    ['Missing delivery label', 'The dispatch label is missing from the delivery.', 'Open'],
    ['Incorrect dock model', 'The supplier sent the correct dock model as a replacement.', 'Resolved'],
    ['Invoice credit checked', 'Accounts checked the replacement invoice and accepted the credit.', 'Closed']
  ]) {
    await addIssue(title, description);
    await modalButton('Add Issue').click();
    await button(title).waitFor();
    if (status === 'Open') continue;
    await button(title).click();
    await dialog.getByLabel('Issue Status').selectOption(status);
    await modalButton('Save Issue Changes').click();
    await page.locator('#supplier-issue-rows tr').filter({hasText: title}).getByText(status, {exact: true}).waitFor();
  }

  await button('Purchasing').click();
  const dashboard = page.locator('.purchasing-dashboard');
  await dashboard.waitFor();
  assert.deepEqual(await dashboard.locator('.db-metric strong').allTextContents(), ['1', '1', '1', '1']);
  assert.deepEqual(await dashboard.locator('[data-issue-status] strong').allTextContents(), ['1', '1', '1', '1']);
  assert.deepEqual(await dashboard.locator('.device-table button').allTextContents(), ['Missing delivery label', 'Damaged monitors']);
  await button('Damaged monitors').click();
  await dialog.getByLabel('Issue Title').waitFor();
  assert.equal(await dialog.getByLabel('Main Description').inputValue(), 'Three monitors arrived with cracked screens.');
  await modalButton('Cancel').click();
  await dashboard.locator('section').filter({has: page.getByRole('heading', {name: 'Recent Supplier Issues'})})
    .getByRole('button', {name: 'View All Issues'}).click();
  await page.getByRole('heading', {name: 'Supplier Issues', exact: true}).waitFor();
  await page.locator('#supplier-issue-rows tr').first().waitFor();
  assert.equal(await page.locator('#supplier-issue-rows tr').count(), 4);
  await page.getByLabel('Filter Issues By Status').selectOption('Closed');
  assert.equal(await page.locator('#supplier-issue-rows tr').count(), 1);
  await button('Invoice credit checked').click();
  await dialog.getByLabel('Issue Status').selectOption('Open');
  await modalButton('Save Issue Changes').click();
  await page.getByText('No Issues Match These Filters').waitFor();
  await button('Back To Purchasing Dashboard').click();
  await dashboard.waitFor();
  assert.deepEqual(await dashboard.locator('.db-metric strong').allTextContents(), ['1', '1', '2', '1']);
  await page.getByRole('button', {name: /Open Supplier Issues/}).click();
  await page.getByRole('heading', {name: 'Supplier Issues', exact: true}).waitFor();
  await page.getByLabel('Filter Issues By Status').waitFor();
  assert.equal(await page.getByLabel('Filter Issues By Status').inputValue(), 'Open');
  assert.equal(await page.locator('#supplier-issue-rows tr').count(), 2);
  await page.goBack();
  await dashboard.waitFor();
  await button('Audit Trail').click();
  const audit = page.locator('#activity-results tr').filter({hasText: 'Supplier issue update corrected'});
  await audit.getByRole('button', {name: 'View Details'}).click();
  const auditDetail = page.locator('#audit-detail-body');
  await auditDetail.getByText('The supplier is arranging replacements.', {exact: true}).waitFor();
  await auditDetail.getByText('The supplier has confirmed that replacements are being arranged.', {exact: true}).waitFor();

  const readContext = await browser.newContext(contextOptions);
  await login(readContext, reader);
  const readPage = await readContext.newPage();
  await readPage.goto(supplierUrl);
  await readPage.getByRole('heading', {name: 'Supplier Overview'}).waitFor();
  await checkDetailsHeader(readPage, ['Back To Suppliers']);
  assert.equal(await readPage.locator('#sidebar [data-tab="it-assets"]').isVisible(), false);
  assert.equal(await readPage.locator('#sidebar [data-tab="devices"]').isVisible(), false);
  await readPage.goto(origin + '/inventory#purchasing');
  await readPage.getByRole('button', {name: 'Damaged monitors', exact: true}).click();
  await readPage.getByRole('heading', {name: 'Supplier Issue Details'}).waitFor();
  assert.equal(await readPage.getByRole('button', {name: 'Edit', exact: true}).count(), 0);
  assert.match(await readPage.locator('#modal-content').innerText(), /Three monitors arrived with cracked screens/);
  await readPage.getByRole('button', {name: 'Close', exact: true}).click();
  await readPage.goto(issueEvidenceUrl);
  await readPage.locator('#supplier-issue-rows tr').first().waitFor();
  assert.equal(await readPage.getByRole('button', {name: 'Add Issue', exact: true}).count(), 0);
  await readContext.close();

  await settings();
  await toggleFeature(false);
  await supplierNav.waitFor({state: 'hidden'});
  assert.equal((await context.request.get(origin + '/api/suppliers')).status(), 403);
  assert.equal((await context.request.get(origin + '/api/suppliers/dashboard')).status(), 403);
  assert.equal(await purchasingNav.isVisible(), false);
  await page.goto(origin + '/inventory#purchasing/issues');
  await page.locator('#app[aria-busy="false"]').waitFor();
  assert.equal(await page.getByRole('heading', {name: 'Supplier Issues', exact: true}).count(), 0);
  await settings();
  await toggleFeature(true);
  await button('Purchasing').click();
  await supplierNav.click();
  await button('Manage Categories').click();
  await modalButton('Add Category').click();
  await dialog.getByLabel('Category Name').fill('Cloud Services');
  await modalButton('Add Category').click();
  const cloud = dialog.getByRole('row', {name: /Cloud Services/});
  await cloud.getByRole('button', {name: 'Archive', exact: true}).click();
  await modalButton('Archive Supplier Category').click();
  await cloud.getByText('Archived', {exact: true}).waitFor();
  await cloud.getByRole('button', {name: 'Reactivate', exact: true}).click();
  await modalButton('Reactivate Supplier Category').click();
  await cloud.getByText('Active', {exact: true}).waitFor();
  await modalButton('Close').click();
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
        if (!headerEvidence) {
          await capture('directory', theme, width, height);
          await button('Manage Categories').click();
          await capture('categories', theme, width, height);
          await modalButton('Close').click();
          await button('Add Supplier').click();
          await capture('add-supplier', theme, width, height);
          await modalButton('Add Supplier').scrollIntoViewIfNeeded();
          await capture('add-supplier-contact', theme, width, height);
          await modalButton('Cancel').click();
        }
        await button('Northlight Technology Ltd').click();
        await page.getByRole('heading', {name: 'Supplier Overview'}).waitFor();
        await checkDetailsHeader(page, archiveActions, retention);
        await capture('overview', theme, width, height);
        for (const tab of ['Locations', 'Contacts', 'Notes & Issues']) {
          await page.getByRole('tab', {name: tab, exact: true}).click();
          await checkDetailsHeader(page, archiveActions, retention);
          await capture(tab.toLowerCase(), theme, width, height);
          if (!headerEvidence && tab === 'Contacts') {
            await button('Jo Patel').click();
            await capture('contact-details', theme, width, height);
            await modalButton('Close').click();
          }
        }
        if (!headerEvidence) {
          await settings();
          await page.locator('[data-feature-card="suppliers"]').scrollIntoViewIfNeeded();
          await capture('optional-features', theme, width, height);
        }
      }
    }
    fs.writeFileSync(path.join(evidence, 'manifest.json'), JSON.stringify({
      sourceCommit: revision(), schema: 22, browser: 'Chromium ' + browser.version(),
      origin, captures: shots
    }, null, 2) + '\n');
  }
  if (issueEvidence) {
    fs.mkdirSync(issueEvidence, {recursive: true});
    const captures = [];
    async function capture(name, theme, width, height, fullPage = false) {
      await page.waitForFunction(() => document.documentElement.scrollWidth <= innerWidth + 1);
      assert.equal(await page.locator('html').evaluate(el => el.classList.contains('dark')), theme === 'dark');
      const filename = `${name}-${theme}-${width}.png`;
      const bytes = await page.screenshot({path: path.join(issueEvidence, filename), animations: 'disabled', fullPage});
      captures.push({file: filename, theme, viewport: {width, height}, sha256: createHash('sha256').update(bytes).digest('hex')});
    }
    await page.waitForFunction(() => document.getElementById('toast').classList.contains('opacity-0'));
    for (const [width, height] of [[1440, 1050], [390, 844]]) {
      await page.setViewportSize({width, height});
      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => caffootSetTheme(theme), theme);
        await page.goto(origin + '/inventory#purchasing');
        await dashboard.waitFor();
        assert.equal(await dashboard.locator('.db-summary').evaluate(el => getComputedStyle(el).display), 'grid');
        assert.equal(await purchaserHasOneSelected(page), true);
        if (width < 500) {
          const table = dashboard.locator('.purchasing-recent table');
          assert.equal(await table.evaluate(el => getComputedStyle(el).display), 'block');
          assert.equal(await table.locator('tbody').evaluate(el => el.scrollWidth <= el.clientWidth + 1), true);
          await purchasingToggle.press('Enter');
          assert.equal(await supplierNav.isVisible(), false);
          await purchasingToggle.press('Enter');
          assert.equal(await supplierNav.isVisible(), true);
          await purchasingToggle.evaluate(el => el.blur());
        }
        await capture('purchasing-dashboard', theme, width, height, true);
        await dashboard.locator('section').filter({has: page.getByRole('heading', {name: 'Recent Supplier Issues'})})
          .getByRole('button', {name: 'View All Issues'}).click();
        await page.locator('#supplier-issue-rows tr').first().waitFor();
        await capture('all-supplier-issues', theme, width, height, true);
        await button('Manage Issue Categories').click();
        await dialog.getByRole('heading', {name: 'Manage Issue Categories'}).waitFor();
        await capture('issue-categories', theme, width, height);
        await modalButton('Close').click();
        await page.goto(issueEvidenceUrl);
        await monitorRow.waitFor();
        await capture('supplier-issues', theme, width, height, true);
        await button('Add Issue').click();
        await dialog.getByRole('heading', {name: 'Add Supplier Issue'}).waitFor();
        await capture('add-issue', theme, width, height);
        await modalButton('Cancel').click();
        await button('Damaged monitors').click();
        await dialog.getByLabel('Issue Title').waitFor();
        await capture('issue-details', theme, width, height);
        await dialog.evaluate(modal => modal.scrollTop = modal.scrollHeight);
        await capture('issue-update-history', theme, width, height);
        await modalButton('Cancel').click();
      }
    }
    fs.writeFileSync(path.join(issueEvidence, 'manifest.json'), JSON.stringify({
      sourceCommit: revision(), schema: 22, browser: 'Chromium ' + browser.version(),
      origin, captures
    }, null, 2) + '\n');
  }
  assert.deepEqual(errors, []);
  console.log('PASS Supplier workflows and Details header, including Issue correction, status transitions, handover, categories, Purchasing metrics, navigation and access');
}
main().catch(error => {console.error(error); process.exitCode = 1;}).finally(async () => {
  await browser?.close();
  server?.kill();
  if (log !== undefined) fs.closeSync(log);
  if (process.exitCode) console.error('Isolated server log:', path.join(temporary, 'server.log'));
  else fs.rmSync(temporary, {recursive: true, force: true});
});
