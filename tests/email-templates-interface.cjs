// Exercise the integrated Settings UI against a disposable Caffoot Lite server.
const assert = require('node:assert/strict');
const {spawn, spawnSync} = require('node:child_process');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const {chromium} = require('playwright');

const root = path.resolve(__dirname, '..');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'caffoot-email-templates-'));
const screenshots = process.env.CAFFOOT_EMAIL_TEMPLATE_SCREENSHOTS;
let server;
let browser;

async function startEmailTemplateServer() {
    const port = await new Promise(resolve => {
        const socket = net.createServer().listen(0, '127.0.0.1', () => {
            const number = socket.address().port;
            socket.close(() => resolve(number));
        });
    });
    const base = 'https://127.0.0.1:' + port;
    const database = path.join(temporary, 'caffoot.sqlite3');
    const seed = spawnSync('python3', ['-c', `
import sqlite3
import sys
from backend.schema import initialise_database
from backend.sessions import _digest

with sqlite3.connect(sys.argv[1]) as connection:
    initialise_database(connection)
    for actor, user, admin in ((1, 'Alex Morgan', 1), (2, 'Sam Patel', 0), (3, 'Jordan Taylor', 0)):
        connection.execute("INSERT INTO accounts(id,username,password_hash,is_admin,mfa_confirmed,mfa_secret) "
                           "VALUES(?,?,'Browser fixture',?,1,'JBSWY3DPEHPK3PXP')", (actor, user, admin))
        connection.execute('INSERT INTO account_sessions VALUES(?,?,9999999999,1)', (_digest(str(actor)*64), actor))
    connection.execute("UPDATE organisation_features SET enabled=1 WHERE feature='devices'")
    connection.execute("INSERT INTO account_permission_overrides VALUES(2,'Devices','read')")
    connection.execute("INSERT INTO account_permission_overrides VALUES(2,'Service Desk','edit')")
`, database], {cwd: root, encoding: 'utf8'});
    assert.equal(seed.status, 0, seed.stderr);
    const log = path.join(temporary, 'server.log');
    const fd = fs.openSync(log, 'w');
    server = spawn('python3', ['-c',
        'from backend import server; import sys; server.PORT = int(sys.argv[1]); server.main()', String(port)],
    {cwd: root, stdio: ['ignore', fd, fd], env: {
        ...process.env, CAFFOOT_DB_PATH: database, CAFFOOT_TLS_DIR: path.join(temporary, 'tls'),
        CAFFOOT_HOST: '127.0.0.1', CAFFOOT_SERVER_ADDRESS: '127.0.0.1', CAFFOOT_WEB_ADDRESS: base,
        TZ: 'Europe/London'
    }});
    fs.closeSync(fd);
    return {base, log};
}

async function openEmailWorkspace({base, log}, {actor = 1, theme = 'light', mobile = false} = {}) {
    const context = await browser.newContext({ignoreHTTPSErrors: true,
        viewport: mobile ? {width: 390, height: 844} : {width: 1440, height: 960}});
    await context.addCookies([{name: 'caffoot_session', value: String(actor).repeat(64), url: base,
        httpOnly: true, secure: true, sameSite: 'Strict'}]);
    await context.addInitScript(value => localStorage.setItem('caffoot_theme_preference', value), theme);
    const page = await context.newPage();
    page.setDefaultTimeout(12000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    let ready = false;
    for (let retry = 0; retry < 30; retry++) {
        if (server.exitCode !== null) throw new Error(fs.readFileSync(log, 'utf8'));
        const response = await context.request.get(base + '/health', {timeout: 1000}).catch(() => null);
        if (response?.ok()) {
            ready = true;
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 150));
    }
    assert.ok(ready, fs.readFileSync(log, 'utf8'));
    await page.goto(base + (actor === 3 ? '/account' : '/inventory'));
    await page.locator('#app[aria-busy="false"]').waitFor();
    assert.equal(await page.locator('html').evaluate(el => el.classList.contains('dark')), theme === 'dark');
    return {page, context, errors};
}

async function openEmailTemplates(page) {
    await page.locator('#next-settings-nav').click();
    await page.getByRole('tab', {name: 'Email Settings', exact: true}).click();
    await page.getByRole('heading', {name: 'Outgoing Email Settings'}).waitFor();
    await page.locator('#settings-email-templates-tab').click();
    await page.locator('#preview-email .mail-hero').waitFor();
}

async function captureEmailScreen(page, name) {
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        name + ' has horizontal overflow');
    if (!screenshots) return;
    fs.mkdirSync(screenshots, {recursive: true});
    await page.evaluate(() => {
        document.activeElement?.blur();
        // Smooth scrolling can still move sticky panels during a full-page capture.
        window.scrollTo({left: 0, top: 0, behavior: 'instant'});
    });
    await page.waitForFunction(() => scrollY === 0 && document.scrollingElement.scrollTop === 0);
    await page.screenshot({path: path.join(screenshots, name + '.png'), fullPage: true, animations: 'disabled'});
}

async function fictionalCompanyLogo(page) {
    const png = await page.evaluate(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 360;
        canvas.height = 144;
        const context = canvas.getContext('2d');
        context.fillStyle = '#f9f5e8';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#214260';
        context.font = 'bold 32px sans-serif';
        context.textAlign = 'center';
        context.fillText('MAPLEBROOK', 180, 79);
        context.fillStyle = '#995317';
        context.font = 'bold 17px sans-serif';
        context.fillText('IT SUPPORT', 180, 108);
        return canvas.toDataURL('image/png').split(',')[1];
    });
    return {name: 'maplebrook.png', mimeType: 'image/png', buffer: Buffer.from(png, 'base64')};
}

async function runEmailTemplateBrowserChecks() {
    const instance = await startEmailTemplateServer();
    browser = await chromium.launch({headless: true});
    const {page, context, errors} = await openEmailWorkspace(instance);
    await openEmailTemplates(page);
    assert.equal(await page.locator('.template-option').count(), 10);
    assert.equal(await page.locator('.var-row').count(), 6);
    assert.equal(await page.getByRole('group', {name: 'Visual Formatting'}).getByRole('button').count(), 5);
    await captureEmailScreen(page, 'templates-desktop-light');

    const subject = page.getByLabel('Email Subject');
    const draft = page.getByRole('button', {name: 'Save as Draft'});
    const publish = page.getByRole('button', {name: 'Publish', exact: true});
    const body = page.getByRole('textbox', {name: 'Email Body'});
    await subject.fill('Resolved ');
    await subject.press('End');
    await page.getByRole('button', {name: 'Insert Ticket Number'}).click();
    assert.equal(await subject.inputValue(), 'Resolved {{ticket_number}}');
    await page.locator('#preview-subject').getByText('Resolved SD-0048', {exact: true}).waitFor();
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.getByRole('button', {name: 'Copy Ticket Number'}).click();
    await page.getByText('Copied {{ticket_number}}.', {exact: true}).waitFor();
    for (const [format, rendered] of [['Italic', 'em'], ['Underline', 'u'], ['Bullet List', 'ul li']]) {
        await body.fill('Formatted example');
        await body.press('Control+a');
        await page.getByRole('button', {name: format, exact: true}).click();
        await page.locator('#preview-email ' + rendered).getByText('Formatted example').waitFor();
    }
    await body.fill('Please review the resolution');
    await body.press('Control+a');
    await page.getByRole('button', {name: 'Bold', exact: true}).click();
    await page.locator('#preview-email strong').getByText('Please review the resolution').waitFor();
    await body.press('End');
    await page.getByRole('button', {name: 'Insert Link', exact: true}).click();
    const dialog = page.getByRole('dialog', {name: 'Insert Link'});
    await dialog.getByLabel('Link Address').fill('invalid address');
    await dialog.getByRole('button', {name: 'Insert Link', exact: true}).click();
    await dialog.getByRole('alert').getByText('Enter a valid HTTPS link.').waitFor();
    await dialog.getByLabel('Link Address').fill('https://support.example.invalid/help');
    await dialog.getByRole('button', {name: 'Insert Link', exact: true}).click();
    await page.locator('#preview-email a').getByText('https://support.example.invalid/help').waitFor();
    assert.equal(await page.locator('#preview-email a').getAttribute('href'), null);
    assert.ok(await publish.isDisabled());
    await draft.click();
    await page.getByText('Saved Draft Ready', {exact: true}).waitFor();
    assert.ok(await publish.isEnabled());
    await captureEmailScreen(page, 'saved-draft-desktop-light');
    await page.reload();
    await page.locator('#app[aria-busy="false"]').waitFor();
    await openEmailTemplates(page);
    await page.getByText('Saved Draft Ready', {exact: true}).waitFor();
    assert.equal(await subject.inputValue(), 'Resolved {{ticket_number}}');
    await publish.click();
    await page.getByText('Template published.', {exact: true}).waitFor();
    assert.ok(await publish.isDisabled());
    page.once('dialog', confirmation => confirmation.accept());
    await page.getByRole('button', {name: 'Restore Default'}).click();
    await page.getByText('Unsaved Changes', {exact: true}).waitFor();
    await draft.click();
    await page.getByText('Saved Draft Ready', {exact: true}).waitFor();
    await publish.click();
    await page.getByText('Published Default', {exact: true}).waitFor();

    await page.getByRole('button', {name: /Ticket On Hold/}).click();
    await page.locator('#preview-email').getByText(/Waiting for Parts/).first().waitFor();
    assert.equal(await page.locator('.var-row').count(), 7);
    await captureEmailScreen(page, 'on-hold-variables-desktop-light');
    await page.getByRole('button', {name: /Email Verification/}).click();
    assert.equal(await page.locator('.var-row').count(), 2);
    await page.locator('#preview-email').getByText(/12345678/).waitFor();
    await captureEmailScreen(page, 'account-verification-desktop-light');
    await page.getByRole('button', {name: /Password Recovery/}).click();
    await page.locator('#preview-email').getByText(/Recover your password/).waitFor();
    await captureEmailScreen(page, 'account-recovery-desktop-light');
    await page.getByRole('button', {name: /Account Security Notice/}).click();
    assert.equal(await page.locator('.var-row').count(), 1);
    await page.locator('#preview-email').getByText(/protected Audit Trail/).waitFor();
    await captureEmailScreen(page, 'account-security-desktop-light');
    await page.getByLabel('Send Test Email To').fill('reviewer@example.invalid');
    await page.getByRole('button', {name: 'Send Test Email', exact: true}).click();
    await page.getByText('Configure SMTP before sending a test email').waitFor();

    await page.locator('#email-editor-tab').focus();
    await page.keyboard.press('ArrowRight');
    const brand = page.getByRole('tabpanel', {name: 'Company Branding'});
    await brand.waitFor();
    await brand.getByLabel('Company Name').fill('Maplebrook Ltd');
    await brand.getByLabel('Email Footer').fill('Sent by Maplebrook Ltd IT Support.\nPlease keep account codes private.');
    await page.locator('#branding-preview-email .mail-brandname').getByText('Maplebrook Ltd').waitFor();
    await captureEmailScreen(page, 'branding-desktop-light');
    await page.locator('#logo-upload').setInputFiles(await fictionalCompanyLogo(page));
    await page.locator('#branding-preview-email img[width="180"][height="72"]').waitFor();
    await page.getByRole('button', {name: 'Save Company Branding'}).click();
    await page.getByText('Company branding saved.', {exact: true}).waitFor();
    await captureEmailScreen(page, 'branding-logo-desktop-light');
    assert.deepEqual(errors, []);
    await context.close();

    for (const [theme, mobile] of [['dark', false], ['light', true], ['dark', true]]) {
        const view = await openEmailWorkspace(instance, {theme, mobile});
        const size = mobile ? 'mobile' : 'desktop';
        await openEmailTemplates(view.page);
        await captureEmailScreen(view.page, `templates-${size}-${theme}`);
        await view.page.locator('#email-branding-tab').click();
        await view.page.locator('#branding-preview-email img').waitFor();
        await captureEmailScreen(view.page, `branding-${size}-${theme}`);
        if (theme === 'dark' && mobile) {
            await view.page.getByRole('button', {name: 'Remove Logo'}).click();
            await view.page.locator('#branding-preview-email .mail-brandname').waitFor();
            await view.page.getByRole('button', {name: 'Save Company Branding'}).click();
            await view.page.getByText('Company branding saved.', {exact: true}).waitFor();
        }
        assert.deepEqual(view.errors, []);
        await view.context.close();
    }

    for (const actor of [2, 3]) {
        const view = await openEmailWorkspace(instance, {actor});
        assert.equal(await view.page.locator('#settings-email-templates-tab').count(), 0);
        assert.ok(!await view.page.locator('#next-settings-nav').isVisible());
        assert.equal((await view.context.request.get(instance.base + '/api/settings/email-templates')).status(), 403);
        assert.deepEqual(view.errors, []);
        await view.context.close();
    }
    console.log('Email Templates browser checks passed.');
}

runEmailTemplateBrowserChecks().catch(error => {
    console.error(error);
    if (fs.existsSync(path.join(temporary, 'server.log'))) {
        console.error(fs.readFileSync(path.join(temporary, 'server.log'), 'utf8').split('\n').slice(-18).join('\n'));
    }
    process.exitCode = 1;
}).finally(async () => {
    await browser?.close();
    if (server && server.exitCode === null) {
        await new Promise(resolve => {
            server.once('exit', resolve);
            server.kill('SIGTERM');
        });
    }
    fs.rmSync(temporary, {recursive: true, force: true});
});
