// Exercise account recovery against the actual HTTPS application and a local mail sink.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {execFileSync, spawn} = require('node:child_process');
const {chromium} = require('playwright');

const root = path.resolve(__dirname, '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'caffoot-recovery-'));
const origin = 'https://127.0.0.1:8443';
const db = path.join(tmp, 'inventory.sqlite3');
const mail = path.join(tmp, 'mail-code');
const log = path.join(tmp, 'server.log');
const username = 'recovery-owner';
const original = 'Fictional-Original-Password!';
const recovered = 'Fictional-Recovered-Password!';
const mismatch = 'Fictional-Confirmation-Mismatch!';
let browser, server;

function python(code, args) {
  return execFileSync('python3', ['-c', code, ...args], {cwd: root, encoding: 'utf8'}).trim();
}
function authenticator(secret) {
  return python('import sys,time; from backend.mfa import code_at; print(code_at(sys.argv[1],time.time()))', [secret]);
}
function api(request, endpoint, data) {
  return request.post(origin + endpoint, {headers: {Origin: origin}, data});
}
async function postFromPage(page, endpoint, submit, status) {
  const response = page.waitForResponse(r => r.url() === origin + endpoint && r.request().method() === 'POST');
  await submit();
  const result = await response;
  assert.equal(result.status(), status);
  return result;
}

async function main() {
  const fd = fs.openSync(log, 'w');
  server = spawn('python3', ['tests/fixtures/recovery_browser.py', mail, '8443'], {
    cwd: root, stdio: ['ignore', fd, fd], env: {
      ...process.env, PYTHONPATH: root, CAFFOOT_DB_PATH: db, CAFFOOT_TLS_DIR: path.join(tmp, 'tls'),
      CAFFOOT_WEB_ADDRESS: origin, CAFFOOT_PORT: '8443', CAFFOOT_HOST: '127.0.0.1',
      CAFFOOT_SERVER_ADDRESS: '127.0.0.1',
    },
  });
  fs.closeSync(fd);
  browser = await chromium.launch({executablePath: process.env.CAFFOOT_CHROMIUM_PATH || undefined});
  const context = await browser.newContext({ignoreHTTPSErrors: true, viewport: {width: 1440, height: 950}});
  for (let attempt = 0; attempt < 60; attempt++) {
    if (await context.request.get(origin + '/health').then(r => r.ok()).catch(() => false)) break;
    if (server.exitCode !== null || attempt === 59) throw new Error(fs.readFileSync(log, 'utf8'));
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  const page = await context.newPage();
  const requests = [], errors = [];
  page.on('request', request => {
    if (request.method() === 'POST') requests.push(new URL(request.url()).pathname);
  });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(origin + '/setup');
  await page.locator('#get-started').click();
  await page.locator('#username').fill(username);
  await page.locator('#password').fill(original);
  await page.locator('#confirm-password').fill(mismatch);
  await page.locator('#submit').click();
  await page.locator('#message').filter({hasText: 'The passwords do not match.'}).waitFor();
  assert.ok(!requests.includes('/api/setup'));
  await page.locator('#confirm-password').fill(original);
  await postFromPage(page, '/api/setup', () => page.locator('#submit').click(), 200);
  await page.locator('#enrolment:not([hidden])').waitFor();
  const secret = await page.locator('#secret').textContent();
  await page.locator('#code').fill(authenticator(secret));
  await page.locator('#submit').click();
  await page.locator('#setup-complete:not([hidden])').waitFor();
  assert.equal(await page.locator('#confirm-password').inputValue(), '');
  console.log('First administrator rejects mismatch and accepts matching confirmation with MFA.');

  const login = password => api(context.request, '/api/login', {username, password, mfa_code: authenticator(secret)});
  assert.equal((await login(original)).status(), 200);
  const session = await (await context.request.get(origin + '/api/session')).json();
  const options = {headers: {Origin: origin, 'X-CSRF-Token': session.csrf_token}};
  assert.equal((await context.request.post(origin + '/api/account/profile', {
    ...options, data: {firstName: '', lastName: '', displayName: '', email: 'recovery@example.org'},
  })).status(), 200);
  const verification = await context.request.post(origin + '/api/account/email/request', {
    ...options, data: {password: original},
  });
  assert.equal(verification.status(), 200);
  assert.equal((await context.request.post(origin + '/api/account/email/confirm', {
    ...options, data: {password: original, challengeId: (await verification.json()).challengeId, token: fs.readFileSync(mail, 'utf8')},
  })).status(), 200);

  const guest = await browser.newContext({ignoreHTTPSErrors: true});
  const recovery = await guest.newPage();
  recovery.on('pageerror', error => errors.push(error.message));
  const confirms = [];
  recovery.on('request', request => {
    if (request.url() === origin + '/api/recovery/confirm') confirms.push(request);
  });
  const form = recovery.locator('#recovery-confirm-form');
  const password = form.getByLabel('New Password', {exact: true});
  const confirmation = form.getByLabel('Confirm New Password', {exact: true});
  const token = form.getByLabel('Recovery Code (8 Digits)');
  const mfa = form.getByLabel('Authenticator Code (If Enrolled)');
  const recover = form.getByRole('button', {name: 'Recover Password'});
  const feedback = recovery.locator('#recovery-message');
  const requestForm = recovery.locator('#recovery-request-form');
  const summary = recovery.getByText('Forgot Password?', {exact: true});
  async function requestCode() {
    await requestForm.getByLabel('Username').fill(username);
    const response = await postFromPage(recovery, '/api/recovery/request',
      () => requestForm.getByRole('button').click(), 200);
    await form.waitFor();
    return (await response.json()).challengeId;
  }
  async function cleared() {
    assert.equal(await password.inputValue(), '');
    assert.equal(await confirmation.inputValue(), '');
  }
  async function fillPasswords() {
    await password.fill(recovered);
    await confirmation.fill(recovered);
  }

  await recovery.goto(origin + '/setup');
  await summary.focus();
  await recovery.keyboard.press('Enter');
  const challengeId = await requestCode();
  assert.equal(await token.evaluate(el => el === document.activeElement), true);
  assert.equal(await feedback.getAttribute('role'), 'status');
  assert.equal(await confirmation.getAttribute('aria-describedby'), 'recovery-message');
  assert.equal(await password.getAttribute('autocomplete'), 'new-password');
  assert.equal(await confirmation.getAttribute('autocomplete'), 'new-password');
  for (const [width, height, name] of [[1440, 950, 'desktop'], [390, 844, 'mobile']]) {
    await recovery.setViewportSize({width, height});
    assert.ok(await recovery.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    const first = await password.boundingBox();
    const second = await confirmation.boundingBox();
    assert.ok(name === 'desktop' ? first.y === second.y && first.x < second.x : first.y < second.y);
    if (process.env.CAFFOOT_RECOVERY_OUTPUT) {
      await cleared();
      await recovery.screenshot({
        path: path.join(process.env.CAFFOOT_RECOVERY_OUTPUT, 'recover-password-' + name + '.png'),
        fullPage: true, animations: 'disabled',
      });
    }
  }
  await token.fill(fs.readFileSync(mail, 'utf8'));
  await token.press('Tab');
  assert.equal(await password.evaluate(el => el === document.activeElement), true);
  await password.press('Tab');
  assert.equal(await confirmation.evaluate(el => el === document.activeElement), true);
  await confirmation.press('Tab');
  assert.equal(await mfa.evaluate(el => el === document.activeElement), true);
  await expectRequired(password);
  await password.fill(recovered);
  await expectRequired(confirmation);
  await confirmation.fill(recovered + ' ');
  await recover.press('Enter');
  await feedback.filter({hasText: 'The new passwords do not match.'}).waitFor();
  assert.equal(await confirmation.evaluate(el => el === document.activeElement), true);
  await confirmation.fill(mismatch);
  await recover.press('Enter');
  assert.equal(confirms.length, 0);
  assert.equal((await login(original)).status(), 200);
  console.log('Recovery blocks empty and unequal fields and supports keyboard order and focus on desktop/mobile.');

  await fillPasswords();
  const code = await token.inputValue();
  await token.fill(code === '00000000' ? '11111111' : '00000000');
  await mfa.fill(authenticator(secret));
  await postFromPage(recovery, '/api/recovery/confirm', () => recover.press('Enter'), 400);
  await token.fill(code);
  await mfa.fill('');
  await postFromPage(recovery, '/api/recovery/confirm', () => recover.press('Enter'), 400);
  await feedback.filter({hasText: 'Invalid or expired confirmation'}).waitFor();
  assert.equal((await login(original)).status(), 200);
  const mfaCode = authenticator(secret);
  await mfa.fill(mfaCode);
  const result = await postFromPage(recovery, '/api/recovery/confirm', () => recover.press('Enter'), 200);
  const payload = result.request().postDataJSON();
  assert.deepEqual(payload, {password: recovered, token: code, mfa_code: mfaCode, challengeId});
  assert.match(payload.mfa_code, /^[0-9]{6}$/);
  assert.deepEqual(await result.json(), {status: 'Password updated; sign in with your authenticator if required'});
  await form.waitFor({state: 'hidden'});
  await cleared();
  assert.equal((await context.request.get(origin + '/api/session')).status(), 401);
  assert.equal((await login(original)).status(), 401);
  assert.equal((await api(guest.request, '/api/login', {username, password: recovered})).status(), 401);
  assert.equal((await login(recovered)).status(), 200);
  assert.equal((await api(guest.request, '/api/recovery/confirm', payload)).status(), 400);
  console.log('Real recovery rejects bad proof and missing MFA, then succeeds, clears fields, revokes sessions and consumes proof.');

  // Use a separate fictional username to exercise cleanup without exhausting the owner's request limit.
  await recovery.getByRole('button', {name: 'Back To Sign In'}).click();
  await summary.click();
  async function openReset() {
    await requestForm.getByLabel('Username').fill('cleanup-example');
    await requestForm.getByRole('button').click();
    await form.waitFor();
    await fillPasswords();
  }
  await openReset();
  await recovery.getByRole('button', {name: 'Request Another Code'}).click();
  await form.waitFor({state: 'hidden'});
  await cleared();
  await openReset();
  await recovery.getByRole('button', {name: 'Back To Sign In'}).click();
  await cleared();
  assert.equal(await recovery.locator('#username').evaluate(el => el === document.activeElement), true);
  await summary.click();
  await openReset();
  await summary.click();
  await recovery.locator('#recovery-confirm-form[hidden]').waitFor({state: 'attached'});
  await cleared();
  await summary.click();
  await requestForm.getByLabel('Username').fill('navigation-example');
  await requestForm.getByRole('button').click();
  await form.waitFor();
  await fillPasswords();
  await recovery.evaluate(() => window.addEventListener('pagehide', () => {
    const fields = document.querySelector('#recovery-confirm-form').elements;
    sessionStorage.setItem('recoveryClearedOnPagehide', String(!fields.password.value && !fields.confirmPassword.value));
  }, {once: true}));
  await recovery.reload();
  assert.equal(await recovery.evaluate(() => sessionStorage.getItem('recoveryClearedOnPagehide')), 'true');
  await cleared();

  for (const request of confirms) {
    assert.deepEqual(Object.keys(request.postDataJSON()).sort(), ['challengeId', 'mfa_code', 'password', 'token']);
  }
  const dump = python('import sqlite3,sys; print("\\n".join(sqlite3.connect(sys.argv[1]).iterdump()))', [db]);
  for (const value of [original, recovered, mismatch]) {
    assert.ok(!dump.includes(value));
    assert.ok(!fs.readFileSync(log, 'utf8').includes(value));
  }
  assert.deepEqual(errors, []);
  console.log('Resend, Back, collapse and reload clear both fields; payloads, database/audit and server logs checked.');
  console.log('Chromium ' + browser.version());

  async function expectRequired(field) {
    await recover.press('Enter');
    assert.equal(await field.evaluate(el => el.validity.valueMissing && !!el.validationMessage && el === document.activeElement), true);
    assert.equal(confirms.length, 0);
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await browser?.close();
  if (server && server.exitCode === null) {
    await new Promise(resolve => {
      server.once('exit', resolve);
      server.kill();
    });
  }
  fs.rmSync(tmp, {recursive: true, force: true});
});
