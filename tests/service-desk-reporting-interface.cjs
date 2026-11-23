// Exercise the real Service Desk screens on a disposable HTTPS installation.
const assert = require('node:assert/strict');
const {spawn, spawnSync} = require('node:child_process');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const {chromium} = require('playwright');

const root = path.resolve(__dirname, '..');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'caffoot-service-desk-'));
const screenshotFolder = process.env.CAFFOOT_SERVICE_DESK_SCREENSHOTS;
const settingsUrl = '/api/settings/service-desk';

async function startServer(zone, label) {
    const port = await new Promise(resolve => {
        const socket = net.createServer().listen(0, '127.0.0.1', () => {
            const number = socket.address().port;
            socket.close(() => resolve(number));
        });
    });
    const base = `https://127.0.0.1:${port}`;
    const database = path.join(temporary, label + '.sqlite');
    const seed = spawnSync('python3', ['-c',
        'import runpy; runpy.run_path("tests/fixtures/service_desk_reporting.py", run_name="__main__")',
        database, zone], {cwd: root, encoding:'utf8'});
    assert.equal(seed.status, 0, seed.stderr);
    const logfile = path.join(temporary, label + '.log');
    const fd = fs.openSync(logfile, 'w');
    const server = spawn('python3', ['-c',
        'from backend import server; import sys; server.PORT = int(sys.argv[1]); server.main()', String(port)], {
        cwd:root, stdio:['ignore', fd, fd], env:{
        ...process.env, TZ:zone, CAFFOOT_DB_PATH:database, CAFFOOT_TLS_DIR:path.join(temporary, label + '-tls'),
        CAFFOOT_HOST:'127.0.0.1', CAFFOOT_SERVER_ADDRESS:'127.0.0.1', CAFFOOT_WEB_ADDRESS:base, CAFFOOT_PORT:String(port)
    }});
    fs.closeSync(fd);
    return {server, base, logfile, date:seed.stdout.trim()};
}

async function openWorkspace(browser, instance, {actor = 1, theme = 'light', mobile = false} = {}) {
    const context = await browser.newContext({
        ignoreHTTPSErrors:true,
        viewport: mobile ? {width:390, height:844} : {width:1440, height:960}
    });
    await context.addCookies([{name:'caffoot_session', value:String(actor).repeat(64), url:instance.base,
        httpOnly:true, secure:true, sameSite:'Strict'}]);
    await context.addInitScript(theme => localStorage.setItem('caffoot_theme_preference', theme), theme);
    const page = await context.newPage();
    page.setDefaultTimeout(12000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (let retry = 0; retry < 30; retry++) {
        if (instance.server.exitCode !== null) throw new Error(fs.readFileSync(instance.logfile, 'utf8'));
        const health = await context.request.get(instance.base + '/health', {timeout:1000}).catch(() => null);
        if (health?.ok()) break;
        await new Promise(resolve => setTimeout(resolve, 150));
    }
    await page.goto(instance.base + '/inventory');
    await page.locator('#app[aria-busy="false"]').waitFor();
    assert.equal(await page.locator('html').evaluate(el => el.classList.contains('dark')), theme === 'dark');
    return {page, context, errors};
}

async function openSettings(page) {
    await page.locator('#next-settings-nav').click();
    await page.locator('#settings-service-desk-tab').click();
    await page.locator('[data-support-settings]').waitFor();
    const icon = page.locator('.service-desk-settings .note svg');
    assert.equal((await icon.boundingBox()).height, 18);
}

async function openServiceDesk(page) {
    const nav = page.locator('#sidebar [data-action="tab-service-desk"]');
    if (!await nav.isVisible()) {
        const group = page.locator('[aria-controls="nav-group-it"]');
        if (await group.count()) await group.click();
    }
    await nav.click();
    await page.locator('[data-report-period]:enabled').waitFor();
    await page.locator('[data-workload-status="Open"]').waitFor();
}

async function editSettings(page) {
    await openSettings(page);
    const mondayEnd = page.getByLabel('Monday End Time');
    assert.equal(await mondayEnd.inputValue(), '17:00');
    const saturday = page.getByRole('checkbox', {name:'Saturday Open'});
    const saturdayStart = page.getByLabel('Saturday Start Time');
    assert.equal(await saturdayStart.isDisabled(), true);
    await saturday.check();
    assert.equal(await saturdayStart.isEnabled(), true);
    await mondayEnd.fill('08:00');
    assert.equal(await mondayEnd.evaluate(el => el.validity.valid), false);
    await page.getByRole('button', {name:'Cancel', exact:true}).click();
    assert.equal(await mondayEnd.inputValue(), '17:00');
    assert.equal(await saturday.isChecked(), false);
    await mondayEnd.fill('18:00');
    await page.getByRole('button', {name:'Save Working Hours'}).click();
    await page.getByText('Working hours saved.').waitFor();

    await page.locator('#support-hours-tab').press('ArrowRight');
    await page.getByLabel('Excluded Date', {exact:true}).fill('2026-12-25');
    await page.getByLabel('Reason', {exact:true}).fill('Christmas shutdown');
    await page.getByRole('button', {name:'Add Excluded Date'}).click();
    await page.getByRole('row').filter({hasText:'Christmas shutdown'}).waitFor();
    await page.getByRole('button', {name:'Remove Excluded Date 25/12/2026'}).click();
    await page.getByRole('dialog').getByRole('button', {name:'Cancel'}).click();
    assert.equal(await page.getByRole('row').filter({hasText:'Christmas shutdown'}).count(), 1);
    await page.getByRole('button', {name:'Remove Excluded Date 25/12/2026'}).click();
    await page.getByRole('button', {name:'Remove Date', exact:true}).click();
    await page.getByText('No excluded dates have been added.').waitFor();
    await page.getByLabel('Excluded Date', {exact:true}).fill('2026-12-25');
    await page.getByLabel('Reason', {exact:true}).fill('Christmas shutdown');
    await page.getByRole('button', {name:'Add Excluded Date'}).click();
    await page.getByText('Excluded date added.').waitFor();

    await page.locator('#support-categories-tab').click();
    await page.locator('[data-support-form="add-category"]').getByLabel('Category Name').fill('VPN Issues');
    await page.getByRole('button', {name:'Add Category', exact:true}).click();
    await page.getByRole('button', {name:'Rename VPN Issues'}).click();
    await page.getByRole('dialog').getByLabel('Category Name').fill('Remote Access Support');
    await page.getByRole('button', {name:'Save Category'}).click();
    await page.getByRole('button', {name:'Hide Remote Access Support'}).click();
    await page.getByRole('dialog').getByRole('button', {name:'Hide Category'}).click();
    await page.getByRole('button', {name:'Restore Remote Access Support'}).click();
    await page.getByRole('dialog').getByRole('button', {name:'Restore Category'}).click();
    await page.getByRole('button', {name:'Hide Remote Access Support'}).waitFor();
    assert.match(await page.locator('[data-support-categories] tr').last().innerText(), /Other \/ Not Listed\s+Active\s+Fixed/);
}

async function verifyReport(page, date) {
    await openServiceDesk(page);
    const period = page.locator('[data-report-period]');
    assert.equal(await period.inputValue(), 'this-month');
    const weekend = [0, 6].includes(new Date(date).getUTCDay());
    assert.deepEqual(await page.locator('[data-report-metric]').allTextContents(), ['4','2','1', weekend ? '0h 0m' : '1h 0m']);
    const activity = page.locator('[data-report-technicians]');
    assert.match(await activity.getByText('Sam Taylor').locator('..').innerText(), /Sam Taylor\s+2\s+1/);
    const workload = await page.locator('[data-ticket-workload]').innerText();
    await period.selectOption('custom');
    const emptyDate = '1990-01-03';
    await page.locator('[data-report-dates] [name="from"]').fill(emptyDate);
    await page.locator('[data-report-dates] [name="to"]').fill(emptyDate);
    await page.locator('.service-desk-report:not([aria-busy])').waitFor();
    assert.deepEqual(await page.locator('[data-report-metric]').allTextContents(), ['0','0','0','—']);
    assert.equal(await page.locator('[data-ticket-workload]').innerText(), workload);
    await page.locator('[data-workload-status="On Hold"]').click();
    assert.equal(await page.locator('#ticket-queue-filters [name="status"]').inputValue(), 'On Hold');
    await page.getByText('Stores laptop display flickers').waitFor();
    await page.reload();
    await openServiceDesk(page);
    assert.equal(await period.inputValue(), 'custom');
    assert.equal(await page.locator('[data-report-dates] [name="from"]').inputValue(), emptyDate);
    await period.selectOption('this-month');
    await page.locator('.service-desk-report:not([aria-busy])').waitFor();
}

async function capture(browser, instance, theme, mobile) {
    const {page, context, errors} = await openWorkspace(browser, instance, {theme, mobile});
    const size = mobile ? 'mobile' : 'desktop';
    async function screenshot(name) {
        await page.evaluate(() => window.scrollTo(0, 0));
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, name + ' overflows the viewport');
        await page.screenshot({path:path.join(screenshotFolder, `${name}-${size}-${theme}.png`),
            fullPage:true, animations:'disabled'});
    }
    try {
        await openServiceDesk(page);
        assert.equal(await page.locator('.service-desk-activity-table').evaluate(card =>
            card.querySelector('table').getBoundingClientRect().right <= card.getBoundingClientRect().right), true);
        await screenshot('dashboard');
        await openSettings(page);
        await screenshot('working-hours');
        await page.locator('#support-dates-tab').click();
        await screenshot('excluded-dates');
        await page.locator('#support-categories-tab').click();
        await screenshot('ticket-categories');
        assert.deepEqual(errors, []);
    } finally {
        await context.close();
    }
}

async function run() {
    const browser = await chromium.launch({headless:true, executablePath:process.env.CAFFOOT_CHROMIUM_PATH || undefined});
    const instances = [];
    try {
        const valid = await startServer('Europe/London', 'valid');
        instances.push(valid);
        const admin = await openWorkspace(browser, valid);
        await editSettings(admin.page);
        await verifyReport(admin.page, valid.date);
        assert.deepEqual(admin.errors, []);
        await admin.context.close();

        const technician = await openWorkspace(browser, valid, {actor:2});
        await openServiceDesk(technician.page);
        assert.equal(await technician.page.locator('#next-settings-nav').isVisible(), false);
        assert.equal(await technician.page.locator('[data-report-period]').inputValue(), 'this-month');
        assert.equal((await technician.context.request.get(valid.base + settingsUrl)).status(), 403);
        assert.deepEqual(technician.errors, []);
        await technician.context.close();

        const missing = await startServer('', 'missing');
        instances.push(missing);
        const warning = await openWorkspace(browser, missing);
        await openServiceDesk(warning.page);
        await warning.page.getByText('Reporting is unavailable.', {exact:false}).waitFor();
        assert.deepEqual(await warning.page.locator('[data-report-metric]').allTextContents(), ['—','—','—','—']);
        assert.equal(await warning.page.locator('[data-workload-status="Open"] strong').innerText(), '1');
        await openSettings(warning.page);
        await warning.page.locator('[data-support-timezone]:visible').waitFor();
        if (screenshotFolder) {
            fs.mkdirSync(screenshotFolder, {recursive:true});
            await warning.page.screenshot({path:path.join(screenshotFolder, 'missing-timezone-desktop-light.png'), fullPage:true});
            for (const mobile of [false, true]) {
                for (const theme of ['light','dark']) await capture(browser, valid, theme, mobile);
            }
        }
        assert.deepEqual(warning.errors, []);
        console.log(`Chromium ${browser.version()} passed settings, reporting, permissions and missing-timezone checks.`);
    } finally {
        await browser.close();
        await Promise.all(instances.map(({server}) => new Promise(resolve => {
            if (server.exitCode !== null) return resolve();
            server.once('exit', resolve);
            server.kill();
        })));
        fs.rmSync(temporary, {recursive:true, force:true});
    }
}

run().catch(error => { console.error(error); process.exitCode = 1; });
