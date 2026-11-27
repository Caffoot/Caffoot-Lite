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
const password = 'Fictional-Batch-Three-Password!';
const screenshotFolder = process.env.CAFFOOT_BATCH3_OUTPUT;

function python(source, ...args) {
    const result = spawnSync('python3', ['-c', source, ...args], {cwd:root, encoding:'utf8'});
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
}

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
    python(`import sqlite3,sys\nfrom backend.accounts import hash_password\nfrom backend.mfa import new_secret\nwith sqlite3.connect(sys.argv[1]) as db:\n    db.execute('UPDATE accounts SET password_hash=?', (hash_password(sys.argv[2]),))\n    for (identity,) in db.execute('SELECT id FROM accounts').fetchall():\n        db.execute('UPDATE accounts SET mfa_secret=? WHERE id=?', (new_secret(), identity))\n    db.execute('DELETE FROM account_sessions')`, database, password);
    const logfile = path.join(temporary, label + '.log');
    const fd = fs.openSync(logfile, 'w');
    const server = spawn('python3', ['-c',
        'from backend import server; import sys; server.PORT = int(sys.argv[1]); server.main()', String(port)], {
        cwd:root, stdio:['ignore', fd, fd], env:{
        ...process.env, TZ:zone, CAFFOOT_DB_PATH:database, CAFFOOT_TLS_DIR:path.join(temporary, label + '-tls'),
        CAFFOOT_HOST:'127.0.0.1', CAFFOOT_SERVER_ADDRESS:'127.0.0.1', CAFFOOT_WEB_ADDRESS:base, CAFFOOT_PORT:String(port)
    }});
    fs.closeSync(fd);
    return {server, base, logfile, database, date:seed.stdout.trim()};
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


async function signIn(page, instance, username) {
    await page.goto(instance.base + '/setup');
    await page.getByRole('heading', {name:'Welcome Back'}).waitFor();
    await page.locator('#username').fill(username);
    await page.locator('#password').fill(password);
    await page.locator('#submit').click();
    await page.getByRole('heading', {name:'Verify Your Identity'}).waitFor();
    const code = python(`import sqlite3,sys,time\nfrom backend.mfa import code_at\nwith sqlite3.connect(sys.argv[1]) as db:\n    secret = db.execute("SELECT mfa_secret FROM accounts WHERE username=?", (sys.argv[2],)).fetchone()[0]\n    print(code_at(secret, time.time()))`, instance.database, username);
    await page.locator('#code').fill(code);
    await page.locator('#app[aria-busy="false"]').waitFor();
    await openServiceDesk(page);
}

async function signOut(page, instance) {
    assert.equal((await page.request.get(instance.base + '/api/session')).status(), 200);
    await page.getByRole('button', {name:'Open My Account'}).click();
    const logout = page.waitForResponse(response => response.url() === instance.base + '/api/logout' && response.request().method() === 'POST');
    await page.locator('#next-account-signout').press('Enter');
    const response = await logout;
    assert.ok(response.ok(), 'Sign-out HTTP status: ' + response.status());
    await page.getByRole('heading', {name:'Welcome Back'}).waitFor();
    assert.equal((await page.request.get(instance.base + '/api/session')).status(), 401);
}

async function waitForPreference(page, instance, expected) {
    for (let attempt=0; attempt<40; attempt++) {
        const response = await page.request.get(instance.base + '/api/service-desk/it/report');
        assert.equal(response.status(), 200);
        const result = await response.json();
        if (JSON.stringify(result.preference) === JSON.stringify(expected)) return result;
        await new Promise(resolve=>setTimeout(resolve,100));
    }
    assert.fail('Saved reporting preference did not match ' + JSON.stringify(expected));
}

async function run() {
    let instance, browser;
    try {
        instance = await startServer('Europe/London','batch3');
        browser = await chromium.launch({headless:true, executablePath:process.env.CAFFOOT_CHROMIUM_PATH || undefined});
        const context = await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:960}});
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error=>errors.push(error.message));
        let healthy = false;
        for (let attempt=0; attempt<60 && instance.server.exitCode===null; attempt++) {
            try { if ((await context.request.get(instance.base+'/health',{timeout:500})).ok()) { healthy=true; break; } } catch (_) {}
            await new Promise(resolve=>setTimeout(resolve,150));
        }
        assert.ok(healthy, fs.readFileSync(instance.logfile,'utf8'));
        await signIn(page,instance,'Alex Morgan');
        const report = page.locator('.service-desk-report');
        const period = report.locator('[data-report-period]');
        const visible = report.locator('.caffoot-uk-date-text');
        const sources = report.locator('[data-report-dates] input[type="date"]');
        await period.selectOption('custom');
        await visible.first().fill('01/01/2020');
        await visible.first().press('Tab');
        await visible.last().fill('01/01/2020');
        await visible.last().press('Tab');
        await report.locator('[data-report-metric="average"]').waitFor();
        const saved = {period:'custom',from:'2020-01-01',to:'2020-01-01'};
        const result = await waitForPreference(page,instance,saved);
        assert.deepEqual(result.counts,{created:0,closed:0,reopened:0});
        await signOut(page,instance);
        await signIn(page,instance,'Alex Morgan');
        assert.equal(await period.inputValue(),'custom');
        assert.equal(await sources.count(),2);
        const underlying = await sources.evaluateAll(inputs=>inputs.map(input=>input.value));
        const displayed = await visible.evaluateAll(inputs=>inputs.map(input=>input.value));
        assert.deepEqual(underlying,['2020-01-01','2020-01-01']);
        assert.deepEqual(await report.locator('[data-report-metric]').allTextContents(),['0','0','0','—']);
        console.log(JSON.stringify({underlying,displayed,preference:(await waitForPreference(page,instance,saved)).preference,chromium:browser.version()}));
        if (process.env.CAFFOOT_BATCH3_BASELINE==='1') {
            assert.ok(displayed.some(value=>value!=='01/01/2020'),'Baseline did not reproduce the visible date restoration failure');
            if (screenshotFolder) {
                fs.mkdirSync(screenshotFolder,{recursive:true});
                await page.screenshot({path:path.join(screenshotFolder,'baseline-restored-dates.png')});
            }
        } else {
            assert.deepEqual(displayed,['01/01/2020','01/01/2020']);
            const screenshot = async name => {
                if (!screenshotFolder) return;
                fs.mkdirSync(screenshotFolder,{recursive:true});
                await page.screenshot({path:path.join(screenshotFolder,name+'.png'),animations:'disabled'});
            };
            await screenshot('restored-empty-dates');
            const ukDate = instance.date.split('-').reverse().join('/');
            // Start with a different technician: their preference must not inherit Alex's.
            await signOut(page,instance);
            await signIn(page,instance,'Sam Taylor');
            assert.equal(await period.inputValue(),'this-month');
            const populated = {period:'custom',from:instance.date,to:instance.date};
            await period.selectOption('custom');
            assert.equal(await visible.last().inputValue(),ukDate,'Default To date must be visible');
            await visible.first().fill(ukDate);
            await visible.first().press('Tab');
            await visible.last().fill(ukDate);
            await visible.last().press('Tab');
            const populatedResult = await waitForPreference(page,instance,populated);
            assert.deepEqual(populatedResult.counts,{created:4,closed:2,reopened:1});
            await signOut(page,instance);
            await signIn(page,instance,'Sam Taylor');
            assert.equal(await period.inputValue(),'custom');
            assert.deepEqual(await sources.evaluateAll(inputs=>inputs.map(input=>input.value)),[instance.date,instance.date]);
            assert.deepEqual(await visible.evaluateAll(inputs=>inputs.map(input=>input.value)),[ukDate,ukDate]);
            const weekend = [0,6].includes(new Date(instance.date).getUTCDay());
            assert.deepEqual(await report.locator('[data-report-metric]').allTextContents(),['4','2','1',weekend?'0h 0m':'1h 0m']);
            await screenshot('restored-populated-dates');
            await signOut(page,instance);
            await signIn(page,instance,'Alex Morgan');
            assert.equal(await period.inputValue(),'custom');
            assert.deepEqual(await visible.evaluateAll(inputs=>inputs.map(input=>input.value)),['01/01/2020','01/01/2020']);
            assert.deepEqual(await report.locator('[data-report-metric]').allTextContents(),['0','0','0','—']);
            assert.deepEqual((await waitForPreference(page,instance,saved)).counts,{created:0,closed:0,reopened:0});
            console.log('Empty and populated custom dates restored after real sign-out and sign-in; independent technician preferences verified.');
        }
        assert.deepEqual(errors,[]);
        await context.close();
    } finally {
        if (browser) await browser.close();
        if (instance) instance.server.kill();
        fs.rmSync(temporary,{recursive:true,force:true});
    }
}
run().catch(error=>{console.error(error);process.exitCode=1;});
