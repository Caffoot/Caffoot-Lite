// Browser regression and evidence for the Stage 6.6 account security journeys.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawn, spawnSync} = require('node:child_process');
const {chromium} = require('playwright');
const {openStaffAccount} = require('./staff-account-workflow.cjs');

const root = path.resolve(__dirname, '..');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'caffoot-stage-6-6-account-security-'));
const port = process.env.CAFFOOT_STAGE_6_6_ACCOUNT_PORT || '8488';
const origin = 'https://127.0.0.1:' + port;
const database = path.join(temporary, 'inventory.sqlite3');
const original = 'Fictional-Original-Password!';
const temporaryPassword = 'Fictional-Temporary-Password!';
const personalPassword = 'Fictional-Personal-Password!';
const screenshots = process.env.CAFFOOT_STAGE_6_6_ACCOUNT_SCREENSHOTS;
let server, browser;

function python(source, ...args) {
  const result = spawnSync('python3', ['-c', source, ...args], {cwd: root, encoding: 'utf8'});
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

function authenticator(secret) {
  return python('import sys,time; from backend.mfa import code_at; print(code_at(sys.argv[1], time.time()))', secret);
}

async function captureThemes(page, name, target) {
  for (const [theme, width, height] of [['light', 1440, 960], ['dark', 1440, 960], ['light', 390, 844], ['dark', 390, 844]]) {
    await page.setViewportSize({width, height});
    await page.emulateMedia({colorScheme: theme});
    await page.waitForFunction(dark => document.documentElement.classList.contains('dark') === dark, theme === 'dark');
    await target.scrollIntoViewIfNeeded();
    assert.ok(await target.isVisible());
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    if (screenshots) await page.screenshot({path: path.join(screenshots, `${name}-${theme}-${width}.png`)});
  }
  await page.setViewportSize({width: 1440, height: 960});
  await page.emulateMedia({colorScheme: 'light'});
}

async function submitCredentials(page, username, password) {
  await page.locator('#username').fill(username);
  await page.locator('#password').fill(password);
  await page.getByRole('button', {name: 'Sign In', exact: true}).click();
}

async function fillPasswords(dialog, password, confirmation = password) {
  await dialog.getByLabel('Temporary Password *', {exact: true}).fill(password);
  await dialog.getByLabel('Confirm Temporary Password *', {exact: true}).fill(confirmation);
}

async function run() {
  const secrets = JSON.parse(python(`
import json, sqlite3, sys, time
from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.mfa import code_at, new_secret
from backend.permissions import create_user
from backend.schema import initialise_database
with sqlite3.connect(sys.argv[1]) as db:
    db.execute('PRAGMA foreign_keys=ON')
    initialise_database(db)
    owner, owner_secret = bootstrap_first_admin(db, 'local-admin', sys.argv[2])
    confirm_admin_mfa(db, owner, code_at(owner_secret, time.time()))
    def add(username, first, surname):
        return create_user(db, owner, username, sys.argv[2], dict(firstName=first, lastName=surname, displayName='', email=username+'@example.invalid'))
    add('jamie.taylor', 'Jamie', 'Taylor')
    disabled = add('sam.ellis', 'Sam', 'Ellis')
    it_staff = add('alex.morgan', 'Alex', 'Morgan')
    db.execute('UPDATE accounts SET active=0 WHERE id=?', (disabled,))
    staff_secret = new_secret()
    db.execute('UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?', (staff_secret, it_staff))
    role = db.execute("SELECT id FROM roles WHERE role_key='it_staff'").fetchone()[0]
    db.execute('INSERT INTO account_roles VALUES(?,?)', (it_staff, role))
print(json.dumps({'owner': owner_secret, 'staff': staff_secret}))
`, database, original));
  if (screenshots) fs.mkdirSync(screenshots, {recursive: true});
  const log = fs.openSync(path.join(temporary, 'server.log'), 'w');
  server = spawn('python3', ['-c', 'from backend import server; import sys; server.PORT=int(sys.argv[1]); server.main()', port], {
    cwd: root, stdio: ['ignore', log, log], env: {
      ...process.env, CAFFOOT_DB_PATH: database, CAFFOOT_PORT: port, CAFFOOT_WEB_ADDRESS: origin,
      CAFFOOT_TLS_DIR: path.join(temporary, 'tls'), CAFFOOT_HOST: '127.0.0.1', CAFFOOT_SERVER_ADDRESS: '127.0.0.1',
    },
  });
  fs.closeSync(log);
  browser = await chromium.launch({headless: true, executablePath: process.env.CAFFOOT_CHROMIUM_PATH});
  const errors = [];
  async function client() {
    const context = await browser.newContext({ignoreHTTPSErrors: true, viewport: {width: 1440, height: 960}, colorScheme: 'light'});
    await context.addInitScript(() => localStorage.setItem('caffoot_theme_preference', 'system'));
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    return {context, page};
  }
  const admin = await client();
  let healthy = false;
  for (let attempt = 0; attempt < 60 && server.exitCode === null; attempt++) {
    try { if ((await admin.context.request.get(origin + '/health', {timeout: 500})).ok()) { healthy = true; break; } }
    catch (_) {}
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  assert.ok(healthy, fs.readFileSync(path.join(temporary, 'server.log'), 'utf8'));
  const login = await admin.context.request.post(origin + '/api/login', {
    headers: {Origin: origin}, data: {username: 'local-admin', password: original, mfa_code: authenticator(secrets.owner)},
  });
  assert.equal(login.status(), 200, await login.text());
  await admin.page.goto(origin + '/inventory#staff');
  await openStaffAccount(admin.page, 'jamie.taylor');
  const manage = admin.page.locator('[data-staff-account-modal] [role="dialog"]');
  const reset = manage.getByRole('button', {name: 'Reset Password', exact: true});
  const dialog = admin.page.getByRole('dialog', {name: 'Reset Password', exact: true});
  await captureThemes(admin.page, 'reset-control', reset);
  await reset.click();
  await dialog.waitFor();
  await captureThemes(admin.page, 'reset-password', dialog.getByLabel('Temporary Password *', {exact: true}));
  await fillPasswords(dialog, temporaryPassword, 'Different-Fictional-Password!');
  await dialog.getByRole('button', {name: 'Reset Password', exact: true}).click();
  await dialog.getByRole('alert').getByText('Passwords do not match.').waitFor();
  await dialog.getByRole('button', {name: 'Cancel'}).click();
  await dialog.waitFor({state: 'detached'});
  assert.ok(await reset.evaluate(element => element === document.activeElement));
  await reset.click();
  assert.equal(await dialog.getByLabel('Temporary Password *', {exact: true}).inputValue(), '');
  const staff = await client();
  const previous = await staff.context.request.post(origin + '/api/login', {
    headers: {Origin: origin}, data: {username: 'jamie.taylor', password: original},
  });
  assert.equal(previous.status(), 200);
  await fillPasswords(dialog, temporaryPassword);
  await dialog.getByRole('button', {name: 'Reset Password', exact: true}).click();
  const resetResult = manage.locator('[data-password-reset-result]');
  await resetResult.getByText(/Password reset for jamie\.taylor/).waitFor();
  assert.equal((await staff.context.request.get(origin + '/api/session')).status(), 401);
  await captureThemes(admin.page, 'reset-success', resetResult);

  await staff.page.goto(origin + '/setup');
  await submitCredentials(staff.page, 'jamie.taylor', temporaryPassword);
  const change = staff.page.getByRole('heading', {name: 'Change Your Password'});
  await change.waitFor();
  assert.equal(await staff.page.locator('#password').inputValue(), '');
  assert.equal((await staff.context.request.get(origin + '/api/session')).status(), 401);
  await captureThemes(staff.page, 'change-temporary-password', change);
  await staff.page.locator('#new-password').fill(temporaryPassword);
  await staff.page.locator('#confirm-new-password').fill(temporaryPassword);
  await staff.page.getByRole('button', {name: 'Change Password', exact: true}).click();
  await staff.page.getByText('Choose a password different from your temporary password.').waitFor();
  await staff.page.locator('#new-password').fill(personalPassword);
  await staff.page.locator('#confirm-new-password').fill(personalPassword);
  await staff.page.getByRole('button', {name: 'Change Password', exact: true}).click();
  const changeSuccess = staff.page.getByText('Password changed successfully. Sign in again with your new password.');
  await changeSuccess.waitFor();
  assert.equal((await staff.context.request.get(origin + '/api/session')).status(), 401);
  await captureThemes(staff.page, 'temporary-password-changed', changeSuccess);
  await submitCredentials(staff.page, 'jamie.taylor', personalPassword);
  await staff.page.waitForURL('**/account');
  await staff.page.locator('#app[aria-busy="false"]').waitFor();

  await openStaffAccount(admin.page, 'alex.morgan');
  const makeAdmin = manage.getByRole('button', {name: 'Make admin', exact: true});
  assert.ok(await makeAdmin.isDisabled());
  const eligibility = manage.locator('.administrator-eligibility');
  assert.match(await eligibility.innerText(), /Authenticator\s+Enrolled/);
  assert.match(await eligibility.innerText(), /Email Address\s+Not Verified/);
  await captureThemes(admin.page, 'administrator-eligibility', eligibility);
  // Seed the verified fixture state; email-code confirmation is exercised by the HTTP tests.
  python(`
import sqlite3, sys
with sqlite3.connect(sys.argv[1]) as db:
    db.execute("UPDATE account_profiles SET email_verified=1 WHERE account_id=(SELECT id FROM accounts WHERE username='alex.morgan')")
`, database);
  await openStaffAccount(admin.page, 'alex.morgan');
  assert.ok(await makeAdmin.isEnabled());
  await captureThemes(admin.page, 'administrator-eligible', eligibility);
  await reset.click();
  await fillPasswords(dialog, temporaryPassword);
  await dialog.getByRole('button', {name: 'Reset Password', exact: true}).click();
  await resetResult.getByText(/Password reset for alex\.morgan/).waitFor();
  assert.ok(await makeAdmin.isDisabled());
  await manage.getByText('The user must change their temporary password before becoming an administrator.').waitFor();
  const it = await client();
  await it.page.goto(origin + '/setup');
  await submitCredentials(it.page, 'alex.morgan', temporaryPassword);
  await it.page.getByRole('heading', {name: 'Verify Your Identity'}).waitFor();
  assert.ok(await it.page.getByRole('heading', {name: 'Change Your Password'}).isHidden());
  await it.page.locator('#code').fill(authenticator(secrets.staff));
  await it.page.getByRole('heading', {name: 'Change Your Password'}).waitFor();
  assert.equal((await it.context.request.get(origin + '/api/session')).status(), 401);
  await it.page.locator('#new-password').fill(personalPassword);
  await it.page.locator('#confirm-new-password').fill(personalPassword);
  await it.page.getByRole('button', {name: 'Change Password', exact: true}).click();
  await it.page.getByText('Password changed successfully. Sign in again with your new password.').waitFor();
  await openStaffAccount(admin.page, 'alex.morgan');
  assert.ok(await makeAdmin.isEnabled());
  await makeAdmin.click();
  await manage.getByRole('button', {name: 'Remove admin', exact: true}).waitFor();
  assert.ok(await reset.isDisabled());

  await openStaffAccount(admin.page, 'sam.ellis');
  await reset.click();
  await dialog.getByText('This account will remain disabled.', {exact: false}).waitFor();
  await fillPasswords(dialog, temporaryPassword);
  await dialog.getByRole('button', {name: 'Reset Password', exact: true}).click();
  await resetResult.getByText(/Account remains disabled/).waitFor();
  await openStaffAccount(admin.page, 'local-admin');
  assert.ok(await reset.isDisabled());
  await captureThemes(admin.page, 'existing-administrator-warning', manage.locator('.administrator-email-warning'));
  await manage.getByRole('button', {name: 'Done', exact: true}).click();
  await admin.page.getByRole('button', {name: 'Open My Account'}).click();
  const warning = admin.page.locator('#account-administrator-email-warning');
  await warning.waitFor();
  await captureThemes(admin.page, 'my-account-administrator-warning', warning);
  assert.ok((await (await admin.context.request.get(origin + '/api/session')).json()).is_admin);
  assert.deepEqual(errors, []);
  console.log(`Assisted password reset, mandatory change and administrator eligibility passed over HTTPS (Chromium ${browser.version()}).`);
}

run().catch(error => {
  const log = path.join(temporary, 'server.log');
  console.error(error, fs.existsSync(log) ? fs.readFileSync(log, 'utf8').split('\n').slice(-45).join('\n') : '');
  process.exitCode = 1;
}).finally(async () => {
  if (browser) await browser.close();
  if (server) server.kill();
  fs.rmSync(temporary, {recursive: true, force: true});
});
