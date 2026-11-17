// Issue #400: real HTTPS/SQLite/Chromium session-expiry navigation and sign-in evidence.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawn, spawnSync} = require('node:child_process');
const {chromium} = require('playwright');

const root = path.resolve(__dirname, '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'caffoot-session-ended-'));
const db = path.join(tmp, 'inventory.sqlite3');
const address = 'https://127.0.0.1:8080';
const password = 'Fictional-Session-Test-2026!';
const evidence = process.env.CAFFOOT_SESSION_OUTPUT || path.join(tmp, 'evidence');
fs.mkdirSync(evidence, {recursive: true});

function python(script, args = []) {
  const result = spawnSync('python3', ['-c', script, ...args], {
    cwd: root, encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stderr || 'Python fixture failed');
  return result.stdout.trim();
}
const secret = python([
  'import sqlite3,sys,time',
  'from backend.schema import initialise_database',
  'from backend.accounts import bootstrap_first_admin,confirm_admin_mfa',
  'from backend.mfa import code_at',
  'with sqlite3.connect(sys.argv[1]) as connection:',
  ' connection.execute("PRAGMA foreign_keys=ON")',
  ' initialise_database(connection)',
  ' admin,secret=bootstrap_first_admin(connection,"owner",sys.argv[2])',
  ' now=time.time()',
  ' confirm_admin_mfa(connection,admin,code_at(secret,now),timestamp=now)',
  ' print(secret)',
].join('\n'), [db, password]);

function mfaCode() {
  return python('import sys,time;from backend.mfa import code_at;print(code_at(sys.argv[1],time.time()))', [secret]);
}
function revokeSessions() {
  python([
    'import sqlite3,sys',
    'with sqlite3.connect(sys.argv[1]) as db:',
    ' db.execute("DELETE FROM account_sessions")',
    ' db.commit()',
  ].join('\n'), [db]);
}

let server;
let browser;
async function run() {
  const log = fs.openSync(path.join(tmp, 'backend.log'), 'w');
  server = spawn('python3', ['-m', 'backend.server'], {
    cwd: root, stdio: ['ignore', log, log],
    env: {...process.env, CAFFOOT_DB_PATH: db, CAFFOOT_TLS_DIR: path.join(tmp, 'tls'),
      CAFFOOT_WEB_ADDRESS: address, CAFFOOT_SERVER_ADDRESS: '127.0.0.1',
      CAFFOOT_PORT: '8080', CAFFOOT_HOST: '127.0.0.1'}
  });
  browser = await chromium.launch({headless: true, executablePath: process.env.CAFFOOT_CHROMIUM_PATH || undefined});
  const context = await browser.newContext({ignoreHTTPSErrors: true, viewport: {width: 1440, height: 900}});
  const page = await context.newPage();
  page.setDefaultTimeout(16000);

  let started = false;
  for (let i = 0; i < 60; i++) {
    assert.equal(server.exitCode, null, 'HTTPS service exited unexpectedly');
    try {
      const health = await context.request.get(address + '/health', {timeout: 1000});
      if (health.ok()) { started = true; break; }
    } catch (_) {}
    await page.waitForTimeout(250);
  }
  assert.ok(started, 'HTTPS service did not start');

  // Pages, the known Rack Print route and APIs have different navigation rules.
  for (const route of ['/inventory', '/account', '/inventory?rack-print=same-tab']) {
    const response = await context.request.get(address + route, {maxRedirects: 0});
    assert.equal(response.status(), 303, route);
    assert.equal(response.headers()['location'], '/setup#sign-in-required');
    await page.goto(address + route);
    await page.locator('#message').waitFor({state: 'visible'});
    assert.equal(await page.locator('#message').textContent(),
      'Please sign in to continue using Caffoot Lite.');
    assert.equal(new URL(page.url()).pathname, '/setup');
  }
  const missing = await context.request.get(address + '/api/session');
  assert.equal(missing.status(), 401);
  assert.deepEqual(await missing.json(), {error: 'unauthorised'});
  const unknown = await context.request.get(address + '/not-a-page', {maxRedirects: 0});
  assert.equal(unknown.status(), 404);
  const otherQuery = await context.request.get(address + '/inventory?unknown=1', {maxRedirects: 0});
  assert.equal(otherQuery.status(), 404);

  async function signIn() {
    await page.goto(address + '/setup');
    await page.locator('#form:not([hidden])').waitFor();
    await page.locator('#username').fill('owner');
    await page.locator('#password').fill(password);
    await page.locator('#submit').click();
    await page.locator('#code-field:not([hidden])').waitFor();
    await page.locator('#code').fill(mfaCode());
    await page.waitForURL('**/inventory');
    await page.locator('#app[aria-busy="false"]').waitFor({timeout: 30000});
  }
  async function expectEnded() {
    await page.locator('#message').getByText('Your Session Has Ended').waitFor();
    assert.equal(new URL(page.url()).pathname, '/setup');
    assert.ok((await page.locator('#message').innerText()).includes(
      'Your session has ended. Please sign in again to continue using Caffoot Lite.'));
    assert.equal(await page.locator('#password-recovery').isVisible(), true);
    assert.equal(await page.locator('#submit').innerText(), 'Sign In');
  }

  await signIn();
  // A genuine 403 does not prove expiry: validate the live session and remain here.
  const denied = await page.evaluate(async () => {
    const response = await fetch('/api/account/password', {
      method: 'POST', headers: {'Content-Type': 'application/json', 'X-CSRF-Token': 'invalid'},
      body: JSON.stringify({currentPassword: 'incorrect', newPassword: 'not-changed'}),
    });
    return response.status;
  });
  assert.equal(denied, 403);
  assert.equal(new URL(page.url()).pathname, '/inventory');
  assert.equal((await page.evaluate(async () => (await fetch('/api/session')).status)), 200);

  // An already-open workspace detects an invalid session on a subsequent read.
  revokeSessions();
  await page.evaluate(() => { void fetch('/api/inventory/state', {cache: 'no-store'}).catch(() => {}); });
  await expectEnded();

  // The approved original sign-in UI must retain its layout in four real states.
  for (const {name, width, height, dark} of [
    {name: 'desktop-light', width: 1440, height: 900, dark: false},
    {name: 'desktop-dark', width: 1440, height: 900, dark: true},
    {name: 'mobile-light', width: 390, height: 844, dark: false},
    {name: 'mobile-dark', width: 390, height: 844, dark: true},
  ]) {
    await page.setViewportSize({width, height});
    await page.evaluate(preferDark => {
      localStorage.setItem('caffoot_theme_preference', preferDark ? 'dark' : 'light');
      applySignInTheme();
    }, dark);
    assert.equal(await page.locator('html').evaluate(element => element.classList.contains('dark')), dark);
    assert.ok(await page.locator('main').evaluate(element => {
      const bounds = element.getBoundingClientRect();
      return bounds.left >= -1 && bounds.right <= innerWidth + 1;
    }), 'Approved sign-in panel overflows at ' + name);
    await page.screenshot({path: path.join(evidence, 'session-ended-' + name + '.png'), fullPage: true});
  }
  await page.setViewportSize({width: 1440, height: 900});
  await page.evaluate(() => {localStorage.setItem('caffoot_theme_preference', 'light'); applySignInTheme();});

  // Signing in again remains possible, including the existing MFA journey.
  await signIn();
  const csrf = await page.evaluate(async () => (await (await fetch('/api/session')).json()).csrf_token);
  revokeSessions();
  // Expired write requests are 403 APIs, but the workspace confirms the
  // session has ended before navigating. The failed mutation is never retried.
  await page.evaluate(csrfToken => {
    void fetch('/api/account/password', {
      method: 'POST', headers: {'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken},
      body: JSON.stringify({currentPassword: 'incorrect', newPassword: 'should-not-save'}),
    }).catch(() => {});
  }, csrf);
  await expectEnded();
  assert.equal(python([
    'import sqlite3,sys',
    'from backend.accounts import verify_password',
    'with sqlite3.connect(sys.argv[1]) as db:',
    ' stored=db.execute("SELECT password_hash FROM accounts WHERE username=?", ("owner",)).fetchone()[0]',
    ' print("unchanged" if verify_password(sys.argv[2],stored) else "changed")',
  ].join('\n'), [db, password]), 'unchanged');
  await signIn();
  console.log('Issue #400: direct HTML routes, 401/403 distinctions, expired reads and writes, re-sign-in/MFA and four theme/viewport captures passed.');
  await context.close();
}

run().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
}).finally(async () => {
  if (browser) await browser.close();
  if (server && server.exitCode === null) server.kill('SIGTERM');
});
