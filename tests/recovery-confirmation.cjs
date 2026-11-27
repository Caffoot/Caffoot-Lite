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
const changed = 'Fictional-Changed-Password!';
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

  const login = (password, request = context.request) => api(request, '/api/login', {username, password, mfa_code: authenticator(secret)});
  assert.equal((await login(original)).status(), 200);
  await page.goto(origin + '/inventory');
  await page.locator('#app[aria-busy="false"] .header-account').click();
  const profile = page.locator('#personal-details-form');
  await profile.getByLabel('Email Address').fill('recovery@example.org');
  await postFromPage(page, '/api/account/profile', () => profile.getByRole('button', {name: 'Save Personal Details'}).click(), 200);
  await page.locator('#toast').filter({hasText: 'Personal details saved.'}).waitFor();
  await page.locator('[data-action="select-account-section"][data-section="security"]').first().click();

  const accountForm = page.locator('#next-account-password-form');
  const change = page.locator('button[form="next-account-password-form"]');
  assert.equal(await accountForm.locator('button[type="submit"]').count(), 0);
  await accountForm.locator('[name="currentPassword"]').fill(original);
  await accountForm.locator('[name="newPassword"]').fill(changed);
  await accountForm.locator('[name="confirmPassword"]').fill(mismatch);
  await change.click();
  await page.locator('#toast').filter({hasText: 'The new passwords do not match.'}).waitFor();
  assert.ok(!requests.includes('/api/account/password'));
  const secondSession = await browser.newContext({ignoreHTTPSErrors: true});
  assert.equal((await login(original, secondSession.request)).status(), 200);

  await accountForm.locator('[name="confirmPassword"]').fill(changed);
  await accountForm.locator('[name="currentPassword"]').fill(mismatch);
  await postFromPage(page, '/api/account/password', () => change.click(), 400);
  await page.locator('#toast').filter({hasText: 'Current password is incorrect'}).waitFor();
  assert.equal((await context.request.get(origin + '/api/session')).status(), 200);
  assert.equal((await login(changed, secondSession.request)).status(), 401);
  assert.equal((await login(original, secondSession.request)).status(), 200);

  await accountForm.locator('[name="currentPassword"]').fill(original);
  const update = await postFromPage(page, '/api/account/password', () => change.click(), 200);
  assert.deepEqual(update.request().postDataJSON(), {currentPassword: original, newPassword: changed});
  await page.waitForURL('**/setup');
  assert.equal((await context.request.get(origin + '/api/session')).status(), 401);
  assert.equal((await secondSession.request.get(origin + '/api/session')).status(), 401);
  await secondSession.close();
  assert.equal((await login(original)).status(), 401);
  assert.equal((await login(changed)).status(), 200);
  console.log('My Account saves personal details, blocks mismatches, rejects wrong current passwords and revokes the session on change.');

  const session = await (await context.request.get(origin + '/api/session')).json();
  const options = {headers: {Origin: origin, 'X-CSRF-Token': session.csrf_token}};
  await checkOptionalMfa(options);
  const verification = await context.request.post(origin + '/api/account/email/request', {
    ...options, data: {password: changed},
  });
  assert.equal(verification.status(), 200);
  assert.equal((await context.request.post(origin + '/api/account/email/confirm', {
    ...options, data: {password: changed, challengeId: (await verification.json()).challengeId, token: fs.readFileSync(mail, 'utf8')},
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
  const recover = form.getByRole('button', {name: 'Reset Password', exact: true});
  const feedback = recovery.locator('#recovery-message');
  const requestForm = recovery.locator('#recovery-request-form');
  const summary = recovery.getByText('Forgot Password?', {exact: true});
  async function requestCode() {
    await requestForm.getByLabel('Username').fill(username);
    const response = await postFromPage(recovery, '/api/recovery/request',
      () => requestForm.getByRole('button').click(), 200);
    await form.waitFor();
    const {challengeId, message} = await response.json();
    assert.equal(message, 'If recovery is available, instructions will be emailed. Otherwise, contact your Caffoot Lite administrator.');
    assert.equal(await feedback.textContent(), message);
    assert.equal(await feedback.evaluate(el => el.classList.contains('status')), false);
    return challengeId;
  }
  async function cleared() {
    assert.equal(await password.inputValue(), '');
    assert.equal(await confirmation.inputValue(), '');
  }
  async function fillPasswords() {
    await password.fill(recovered);
    await confirmation.fill(recovered);
  }

  const loginForm = recovery.locator('#form');
  const recoveryUsername = requestForm.getByLabel('Username');
  const requestButton = requestForm.getByRole('button', {name: 'Request Recovery Code'});
  const back = recovery.getByRole('button', {name: 'Back To Sign In'});
  async function checkLayout(step) {
    assert.ok(await loginForm.isHidden());
    assert.ok(await summary.isHidden());
    assert.ok(await back.isVisible());
    assert.equal(await requestForm.isVisible(), step === 'request');
    assert.equal(await form.isVisible(), step === 'reset');
    assert.equal(await recovery.locator('#recovery-resend').isVisible(), step === 'reset');
    await recovery.getByRole('heading', {name: step === 'request' ? 'Request a Recovery Code' : 'Reset Your Password'}).waitFor();

    for (const [width, height, name] of [[1440, 950, 'desktop'], [390, 844, 'mobile']]) {
      await recovery.setViewportSize({width, height});
      for (const theme of ['light', 'dark']) {
        await recovery.evaluate(theme => {
          localStorage.setItem('caffoot_theme_preference', theme);
          applySignInTheme();
        }, theme);
        assert.equal(await recovery.locator('html').evaluate(el => el.classList.contains('dark')), theme === 'dark');
        assert.ok(await recovery.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        assert.ok(await loginForm.isHidden());
        if (step === 'reset') {
          const first = await password.boundingBox();
          const second = await confirmation.boundingBox();
          assert.ok(name === 'desktop' ? first.y === second.y && first.x < second.x : first.y < second.y);
        }
        if (theme === 'light' && process.env.CAFFOOT_RECOVERY_OUTPUT) {
          await recovery.screenshot({
            path: path.join(process.env.CAFFOOT_RECOVERY_OUTPUT, 'recovery-' + step + '-' + name + '.png'),
            fullPage: true, animations: 'disabled',
          });
        }
      }
    }
    await recovery.evaluate(() => {
      localStorage.setItem('caffoot_theme_preference', 'light');
      applySignInTheme();
    });
  }

  await recovery.goto(origin + '/setup');
  await loginForm.waitFor();
  assert.equal(await recovery.locator('.brand-content > p').last().textContent(), 'A beautifully straightforward home for the devices, networks and racks that matter. Self-hosted, secure and entirely yours.');
  await summary.focus();
  await recovery.keyboard.press('Enter');
  await recovery.waitForFunction(() => document.querySelector('#recovery-request-form input') === document.activeElement);
  await checkLayout('request');
  await recoveryUsername.press('Tab');
  assert.equal(await requestButton.evaluate(el => el === document.activeElement), true);
  await requestButton.press('Tab');
  assert.equal(await back.evaluate(el => el === document.activeElement), true);
  const challengeId = await requestCode();
  assert.equal(await token.evaluate(el => el === document.activeElement), true);
  assert.equal(await feedback.getAttribute('role'), 'status');
  assert.equal(await confirmation.getAttribute('aria-describedby'), 'recovery-message');
  assert.equal(await password.getAttribute('autocomplete'), 'new-password');
  assert.equal(await confirmation.getAttribute('autocomplete'), 'new-password');
  await checkLayout('reset');
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
  assert.equal((await login(changed)).status(), 200);
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
  assert.equal(await feedback.textContent(), 'Invalid or expired confirmation');
  for (const [width, height] of [[1440, 950], [390, 844]]) {
    await recovery.setViewportSize({width, height});
    for (const theme of ['light', 'dark']) {
      await recovery.evaluate(theme => {
        localStorage.setItem('caffoot_theme_preference', theme);
        applySignInTheme();
      }, theme);
      const style = await feedback.evaluate(el => {
        const css = getComputedStyle(el), indicator = getComputedStyle(el, '::before');
        return {error: el.classList.contains('status'), color: css.color, background: css.backgroundColor,
          indicator: indicator.content, border: indicator.borderTopWidth, fits: document.documentElement.scrollWidth <= innerWidth};
      });
      assert.equal(style.error, true);
      assert.equal(style.color, theme === 'dark' ? 'rgb(254, 205, 211)' : 'rgb(165, 38, 38)');
      assert.equal(style.background, theme === 'dark' ? 'rgb(76, 45, 58)' : 'rgb(252, 236, 233)');
      assert.match(style.indicator, /!/);
      assert.equal(style.border, '1px');
      assert.equal(style.fits, true);
    }
  }
  await recovery.setViewportSize({width: 1440, height: 950});
  await recovery.evaluate(() => { localStorage.setItem('caffoot_theme_preference', 'light'); applySignInTheme(); });
  assert.equal((await login(changed)).status(), 200);
  const mfaCode = authenticator(secret);
  await mfa.fill(mfaCode);
  const result = await postFromPage(recovery, '/api/recovery/confirm', () => recover.press('Enter'), 200);
  const payload = result.request().postDataJSON();
  assert.deepEqual(payload, {password: recovered, token: code, mfa_code: mfaCode, challengeId});
  assert.match(payload.mfa_code, /^[0-9]{6}$/);
  assert.deepEqual(await result.json(), {status: 'Password updated; sign in with your authenticator if required'});
  await form.waitFor({state: 'hidden'});
  await cleared();
  assert.equal(await feedback.evaluate(el => el.classList.contains('status')), false);
  assert.equal((await context.request.get(origin + '/api/session')).status(), 401);
  assert.equal((await login(changed)).status(), 401);
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
  assert.ok(await loginForm.isVisible());
  await summary.click();
  await openReset();
  await recovery.locator('#password-recovery').evaluate(el => { el.open = false; });
  await recovery.locator('#recovery-confirm-form[hidden]').waitFor({state: 'attached'});
  await cleared();
  assert.ok(await loginForm.isVisible());
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

  await recovery.locator('#username').fill(username);
  await recovery.locator('#password').fill(recovered);
  await recovery.locator('#submit').click();
  const loginCode = recovery.locator('#code');
  await loginCode.waitFor();
  await summary.click();
  assert.ok(await loginForm.isHidden());
  await back.click();
  assert.equal(await loginCode.evaluate(el => el === document.activeElement), true);
  await recovery.getByRole('heading', {name: 'Verify Your Identity'}).waitFor();
  await loginCode.fill(authenticator(secret));
  await recovery.waitForURL('**/inventory');
  console.log('Back restores the original sign-in and MFA challenge, and browser sign-in with MFA succeeds.');

  for (const request of confirms) {
    assert.deepEqual(Object.keys(request.postDataJSON()).sort(), ['challengeId', 'mfa_code', 'password', 'token']);
  }
  const dump = python('import sqlite3,sys; print("\\n".join(sqlite3.connect(sys.argv[1]).iterdump()))', [db]);
  for (const value of [original, changed, recovered, mismatch]) {
    assert.ok(!dump.includes(value));
    assert.ok(!fs.readFileSync(log, 'utf8').includes(value));
  }
  assert.deepEqual(errors, []);
  console.log('Resend, Back, collapse and reload clear both fields; payloads, database/audit and server logs checked.');
  console.log('Chromium ' + browser.version());

  async function checkOptionalMfa(options) {
    const staff = {username: 'mfa-example', password: 'Fictional-Optional-MFA!'};
    assert.equal((await context.request.post(origin + '/api/users/create', {...options, data: staff})).status(), 200);
    const staffContext = await browser.newContext({ignoreHTTPSErrors: true});
    const staffPage = await staffContext.newPage();
    staffPage.on('pageerror', error => errors.push(error.message));
    const openSecurity = async () => {
      await staffPage.goto(origin + '/account');
      await staffPage.locator('.account-screen .subnav [data-section="security"]').click();
    };
    assert.equal((await api(staffContext.request, '/api/login', staff)).status(), 200);
    await openSecurity();
    const start = staffPage.locator('#next-account-mfa-start');
    await start.locator('[name="password"]').fill(staff.password);
    const enrolment = await postFromPage(staffPage, '/api/account/mfa/start', () => start.getByRole('button').click(), 200);
    const {mfaSecret} = await enrolment.json();
    const confirm = staffPage.locator('#next-account-mfa-confirm');
    await confirm.locator('[name="code"]').fill(authenticator(mfaSecret));
    await postFromPage(staffPage, '/api/account/mfa/confirm', () => confirm.getByRole('button').click(), 200);
    await staffPage.waitForURL('**/setup');
    assert.equal((await staffContext.request.get(origin + '/api/session')).status(), 401);
    assert.equal((await api(staffContext.request, '/api/login', {...staff, mfa_code: authenticator(mfaSecret)})).status(), 200);
    await openSecurity();
    await staffPage.locator('.optional-mfa-removal summary').click();
    const remove = staffPage.locator('#account-mfa-removal-form');
    await remove.locator('[name="password"]').fill(staff.password);
    await remove.locator('[name="code"]').fill(authenticator(mfaSecret));
    await postFromPage(staffPage, '/api/account/mfa/remove', () => remove.getByRole('button').click(), 200);
    await staffPage.waitForURL('**/setup#mfa-removed');
    assert.equal((await staffContext.request.get(origin + '/api/session')).status(), 401);
    await staffContext.close();
    console.log('My Account starts, confirms and removes optional MFA through the shared submit handler.');
  }

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
