// Exercise the actual sign-in and navigation over HTTPS with isolated fictional accounts.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawn, spawnSync} = require('node:child_process');
const {chromium} = require('playwright');

const root = path.resolve(__dirname, '..');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'caffoot-stage-6-6-sign-in-'));
const port = process.env.CAFFOOT_STAGE_6_6_SIGN_IN_PORT || '8486';
const origin = 'https://127.0.0.1:' + port;
const database = path.join(temporary, 'inventory.sqlite3');
const password = 'Fictional-Batch-One-Password!';
const screenshots = process.env.CAFFOOT_STAGE_6_6_SIGN_IN_SCREENSHOTS;
let server, browser;

function python(source, ...args) {
  const result = spawnSync('python3', ['-c', source, ...args], {cwd: root, encoding: 'utf8'});
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

async function submitCredentials(page, username, enteredPassword = password) {
  await page.locator('#username').fill(username);
  await page.locator('#password').fill(enteredPassword);
  await page.locator('#submit').click();
}

async function waitForPermissionRequest(requested) {
  let timer;
  try {
    await Promise.race([requested, new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('Expected a permission request')), 15000);
    })]);
  } finally {
    clearTimeout(timer);
  }
}

async function holdResponse(context, url, {fail = false} = {}) {
  let permit, started;
  const release = new Promise(resolve => { permit = resolve; });
  const requested = new Promise(resolve => { started = resolve; });
  await context.route(url, async route => {
    started();
    await release;
    if (fail) await route.fulfill({status: 503, json: {error: 'Test permission service unavailable'}});
    else await route.continue();
  }, {times: 1});
  return {requested, permit};
}

async function allRestrictedNavigationHidden(page) {
  await page.locator('#sidebar').waitFor();
  assert.deepEqual(await page.locator('#sidebar [data-tab]:visible').evaluateAll(
    links => links.map(link => link.dataset.tab)), ['equipment']);
}

async function run() {
  const secret = python(`
import sqlite3, sys, time
from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.mfa import code_at
from backend.permissions import create_user
from backend.schema import initialise_database
sys.path.insert(0, 'tests')
from enabled_inventory import enable_inventory_features
with sqlite3.connect(sys.argv[1]) as db:
    db.execute('PRAGMA foreign_keys=ON')
    initialise_database(db)
    enable_inventory_features(db)
    actor, secret = bootstrap_first_admin(db, 'local-admin', sys.argv[2])
    confirm_admin_mfa(db, actor, code_at(secret, time.time()))
    create_user(db, actor, 'jamie.taylor', sys.argv[2])
    disabled = create_user(db, actor, 'disabled.staff', sys.argv[2])
    db.execute('UPDATE accounts SET active=0 WHERE id=?', (disabled,))
print(secret)
`, database, password);
  const log = fs.openSync(path.join(temporary, 'server.log'), 'w');
  server = spawn('python3', ['-c', 'from backend import server; import sys; server.PORT=int(sys.argv[1]); server.main()', port], {cwd: root, stdio: ['ignore', log, log], env: {
    ...process.env, CAFFOOT_DB_PATH: database, CAFFOOT_PORT: port, CAFFOOT_WEB_ADDRESS: origin,
    CAFFOOT_TLS_DIR: path.join(temporary, 'tls'), CAFFOOT_HOST: '127.0.0.1', CAFFOOT_SERVER_ADDRESS: '127.0.0.1',
  }});
  fs.closeSync(log);
  browser = await chromium.launch({headless: true, executablePath: process.env.CAFFOOT_CHROMIUM_PATH});
  const context = await browser.newContext({ignoreHTTPSErrors: true, viewport: {width: 1440, height: 960}});
  const page = await context.newPage(), errors = [];
  page.on('pageerror', error => errors.push(error.message));
  let healthy = false;
  for (let attempt = 0; attempt < 60 && server.exitCode === null; attempt++) {
    try { if ((await context.request.get(origin + '/health', {timeout: 500})).ok()) { healthy = true; break; } }
    catch (_) {}
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  assert.ok(healthy, fs.readFileSync(path.join(temporary, 'server.log'), 'utf8'));
  await page.goto(origin + '/setup');
  await page.getByRole('heading', {name: 'Welcome Back'}).waitFor();
  for (const [username, enteredPassword] of [
    ['disabled.staff', password], ['local-admin', 'wrong-password'], ['no-such-account', password],
  ]) {
    await submitCredentials(page, username, enteredPassword);
    await page.getByText('Unable to sign in. Please check your credentials or contact your administrator.').waitFor();
    assert.ok(await page.locator('#code-field').isHidden());
    assert.equal(await page.locator('#password').inputValue(), '');
  }

  // The click sends the session probe on the sign-in page first. Hold the
  // workspace's permission response by referring to the initiating document.
  const holdWorkspaceSession = async (pathname, fail = false) => {
    let permit, started;
    const release = new Promise(resolve => { permit = resolve; });
    const requested = new Promise(resolve => { started = resolve; });
    const handler = async route => {
      if (new URL(route.request().frame().url()).pathname !== pathname) return route.continue();
      started();
      await release;
      if (fail) await route.fulfill({status: 503, json: {error: 'Test permission service unavailable'}});
      else await route.continue();
    };
    await context.route('**/api/session', handler);
    return {requested, permit, remove: () => context.unroute('**/api/session', handler)};
  };
  const staffPermissions = await holdWorkspaceSession('/account');
  await submitCredentials(page, 'jamie.taylor');
  await waitForPermissionRequest(staffPermissions.requested);
  await allRestrictedNavigationHidden(page);
  staffPermissions.permit();
  await page.locator('#app[aria-busy="false"]').waitFor();
  await staffPermissions.remove();
  assert.ok(await page.locator('#sidebar [data-nav-group="it"]').isHidden());
  assert.equal((await context.request.get(origin + '/api/inventory/state')).status(), 403);
  assert.equal((await context.request.get(origin + '/api/users')).status(), 403);
  const failure = await holdWorkspaceSession('/account', true);
  await page.reload();
  await waitForPermissionRequest(failure.requested);
  await allRestrictedNavigationHidden(page);
  failure.permit();
  await page.getByText('Please sign in first.').waitFor();
  await allRestrictedNavigationHidden(page);
  await failure.remove();
  await context.clearCookies();

  await page.goto(origin + '/setup');
  await submitCredentials(page, 'local-admin');
  await page.getByRole('heading', {name: 'Verify Your Identity'}).waitFor();
  assert.equal(await page.locator('#password').inputValue(), '');
  assert.equal((await context.request.get(origin + '/api/session')).status(), 401);
  if (screenshots) {
    fs.mkdirSync(screenshots, {recursive: true});
    for (const [theme, width, height] of [['light', 1440, 960], ['dark', 1440, 960], ['light', 390, 844], ['dark', 390, 844]]) {
      await page.setViewportSize({width, height});
      await page.emulateMedia({colorScheme: theme});
      await page.evaluate(() => localStorage.setItem('caffoot_theme_preference', 'system'));
      await page.reload();
      await page.getByRole('heading', {name: 'Welcome Back'}).waitFor();
      assert.ok(await page.locator('#code-field').isHidden());
      assert.equal(await page.locator('html').evaluate(el => el.classList.contains('dark')), theme === 'dark');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({path: path.join(screenshots, `sign-in-${theme}-${width}.png`)});
      await submitCredentials(page, 'local-admin');
      await page.getByRole('heading', {name: 'Verify Your Identity'}).waitFor();
      assert.ok(await page.locator('#code').isVisible());
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({path: path.join(screenshots, `authenticator-${theme}-${width}.png`)});
    }
  }
  const inventory = await holdResponse(context, '**/api/inventory/state');
  await page.locator('#code').fill(python('from backend.mfa import code_at; import sys,time; print(code_at(sys.argv[1], time.time()))', secret));
  await waitForPermissionRequest(inventory.requested);
  await allRestrictedNavigationHidden(page);
  inventory.permit();
  await page.locator('#app[aria-busy="false"]').waitFor();
  assert.ok(await page.locator('#sidebar [data-tab="devices"]').isVisible());
  assert.ok(await page.locator('#sidebar [data-tab="users"]').isVisible());
  assert.equal((await context.request.get(origin + '/api/inventory/state')).status(), 200);
  await page.getByRole('button', {name: 'Settings & Data'}).click();
  await page.locator('.settings-screen [data-tab="features"]').click();
  const devicesFeature = page.locator('[data-optional-feature="devices"]');
  assert.ok(await devicesFeature.isChecked());
  const changedPermissions = await holdResponse(context, '**/api/inventory/state');
  page.once('dialog', dialog => dialog.accept());
  await devicesFeature.click({force: true});
  await waitForPermissionRequest(changedPermissions.requested);
  await allRestrictedNavigationHidden(page);
  changedPermissions.permit();
  await page.locator('[data-feature-card="devices"] [data-feature-status]').getByText('Disabled').waitFor();
  assert.ok(await page.locator('#sidebar [data-tab="devices"]').isHidden());
  assert.ok(await page.locator('#sidebar [data-tab="users"]').isVisible());
  const failedInventory = await holdResponse(context, '**/api/inventory/state', {fail: true});
  await page.reload();
  await waitForPermissionRequest(failedInventory.requested);
  await allRestrictedNavigationHidden(page);
  failedInventory.permit();
  await page.getByText('Unable to load central inventory.').waitFor();
  await allRestrictedNavigationHidden(page);
  assert.deepEqual(errors, []);
  console.log(`Sign-in and fail-closed navigation passed over HTTPS (Chromium ${browser.version()}).`);
}

run().catch(error => {
  console.error(error, fs.readFileSync(path.join(temporary, 'server.log'), 'utf8'));
  process.exitCode = 1;
}).finally(async () => {
  if (browser) await browser.close();
  if (server) server.kill();
  fs.rmSync(temporary, {recursive: true, force: true});
});
