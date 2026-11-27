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


async function verifyQueueRefresh(page, browser, instance, screenshot) {
    const second = await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:960}});
    const sam = await second.newPage();
    const errors = [];
    sam.on('pageerror', error=>errors.push(error.message));
    const queueURL = url => new URL(url).pathname === '/api/service-desk/it/tickets';
    const reportURL = url => new URL(url).pathname === '/api/service-desk/it/report';
    const rows = page.locator('[data-ticket-rows]');
    const count = page.locator('[data-ticket-count]');
    const open = page.locator('[data-workload-status="Open"] strong');
    const status = page.locator('#ticket-queue-filters [name="status"]');
    const sort = page.locator('[name="sort"][form="ticket-queue-filters"]');
    const search = page.locator('#service-desk-search');
    const report = page.locator('.service-desk-report');
    const subject = 'Batch 3 external ticket';
    // Evidence only: scroll the real queue into view, without altering application state.
    async function queueScreenshot(name, target = rows) {
        if (!screenshotFolder) return;
        const previousScroll = await page.evaluate(() => {
            const ancestors = [];
            for (let el = document.querySelector('#service-desk-queue'); el; el = el.parentElement) {
                ancestors.push([el.scrollLeft, el.scrollTop]);
            }
            return {ancestors, x: window.scrollX, y: window.scrollY};
        });
        try {
            await page.locator('#service-desk-queue').evaluate(el => el.scrollIntoView({block:'start', behavior:'instant'}));
            for (const locator of [count, status, sort, target]) {
                const box = await locator.boundingBox();
                const viewport = page.viewportSize();
                assert.ok(box && box.x >= 0 && box.y >= 0 && box.x + box.width <= viewport.width + 1 && box.y + box.height <= viewport.height + 1, 'Queue evidence is outside the viewport: ' + name);
            }
            await screenshot(name);
        } finally {
            await page.evaluate(({ancestors,x,y}) => {
                let el = document.querySelector('#service-desk-queue');
                for (const [left,top] of ancestors) {
                    if (!el) break;
                    el.scrollTo({left,top,behavior:'instant'});
                    el = el.parentElement;
                }
                window.scrollTo({left:x,top:y,behavior:'instant'});
            }, previousScroll);
        }
    }
    let queueRequests = 0, reportRequests = 0;
    const returnToTab = target => target.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));
    const blur = target => target.evaluate(()=>document.activeElement?.blur());
    const nextQueue = target => target.waitForResponse(response=>queueURL(response.url()) && response.request().method()==='GET');
    const waitIdle = target => target.locator('.service-desk-page:not([aria-busy])').waitFor();
    const change = async (locator,value) => {
        const done = nextQueue(page);
        await locator.selectOption(value);
        await done;
        await waitIdle(page);
        await blur(page);
    };
    async function mutate(path, payload) {
        // Execute the same protected API used by the UI, in the genuine second session.
        return sam.evaluate(async ({path,payload})=>{
            const session = await fetch('/api/session',{cache:'no-store'});
            if (!session.ok) throw Error('Second session unavailable: '+session.status);
            const {csrf_token} = await session.json();
            const response = await fetch('/api/service-desk/it/'+path,{method:'POST',
                headers:{'Content-Type':'application/json','X-CSRF-Token':csrf_token},body:JSON.stringify(payload)});
            if (!response.ok) throw Error('Ticket mutation failed: '+response.status+' '+(await response.json()).error);
            return response.json();
        },{path,payload});
    }
    try {
        await signIn(sam,instance,'Sam Taylor');
        await page.bringToFront();
        await waitIdle(page);
        await change(sort,'oldest');
        await change(status,'Open');
        assert.equal(await page.evaluate(()=>document.hidden),false);
        const before = Number(await open.innerText());
        const historical = await report.locator('[data-report-metric]').allTextContents();
        const savedDates = await report.locator('.caffoot-uk-date-text').evaluateAll(inputs=>inputs.map(input=>input.value));
        const track = request=>{
            if (request.method()!=='GET') return;
            if (queueURL(request.url())) queueRequests++;
            if (reportURL(request.url())) reportRequests++;
        };
        page.on('request',track);
        const ticket = await mutate('tickets',{equipmentKind:'device',equipmentId:'equipment-0',categoryId:4,
            subject,description:'Created in the second authenticated session.'});
        assert.ok(ticket.id);
        // A real 30-second interval updates the first session, without any navigation or manual refresh.
        await rows.getByText(subject,{exact:true}).waitFor({timeout:45000});
        assert.equal(Number(await open.innerText()),before+1);
        assert.equal(await status.inputValue(),'Open');
        assert.equal(await sort.inputValue(),'oldest');
        assert.deepEqual(await report.locator('[data-report-metric]').allTextContents(),historical);
        assert.deepEqual(await report.locator('.caffoot-uk-date-text').evaluateAll(inputs=>inputs.map(input=>input.value)),savedDates);
        await screenshot('workload-auto-created');
        await queueScreenshot('queue-auto-created', rows.getByText(subject,{exact:true}));
        // Hidden tab: suspend queue requests through a full refresh interval.
        await page.evaluate(()=>{
            Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});
            document.dispatchEvent(new Event('visibilitychange'));
        });
        const hiddenCount = queueRequests;
        const detail = await sam.evaluate(async id=>await (await fetch('/api/service-desk/it/tickets/'+id,{cache:'no-store'})).json(),ticket.id);
        await mutate('tickets/'+ticket.id+'/close',{resolutionNote:'Resolved in the second authenticated session.',expectedUpdatedAt:detail.updatedAt});
        await page.waitForTimeout(31000);
        assert.equal(queueRequests,hiddenCount,'Hidden page must not poll the queue');
        assert.equal(Number(await open.innerText()),before+1);
        await page.evaluate(()=>{
            delete document.hidden;
            document.dispatchEvent(new Event('visibilitychange'));
        });
        await rows.getByText(subject,{exact:true}).waitFor({state:'hidden',timeout:5000});
        assert.equal(Number(await open.innerText()),before);
        await screenshot('workload-auto-closed');
        await queueScreenshot('queue-auto-closed');
        // A search control in use and an open Create Ticket draft must not be disrupted.
        await search.focus();
        let requests = queueRequests;
        await returnToTab(page);
        await page.waitForTimeout(500);
        assert.equal(queueRequests,requests,'Do not refresh while editing a filter');
        assert.equal(await search.evaluate(el=>document.activeElement===el),true);
        await blur(page);
        await page.locator('[data-ticket-create]').click();
        const draft = page.locator('#service-desk-create-form [name="subject"]');
        await draft.fill('Unsaved draft must remain');
        requests = queueRequests;
        await returnToTab(page);
        await page.waitForTimeout(500);
        assert.equal(queueRequests,requests,'Do not refresh under an open ticket form');
        assert.equal(await draft.inputValue(),'Unsaved draft must remain');
        // Discard the fixture draft through the normal cancel/confirmation path.
        page.on('dialog',dialog=>dialog.accept());
        await page.locator('.service-desk-dialog [data-ticket-footer]').getByRole('button',{name:'Cancel',exact:true}).click();
        const discard = page.getByRole('button',{name:/Discard/i});
        if (await discard.isVisible()) await discard.click();
        await page.locator('.service-desk-dialog').waitFor({state:'hidden'});
        await blur(page);
        // Failed automatic request leaves the last successful rows and workload intact.
        const beforeFailure = await rows.innerText();
        const workload = await page.locator('[data-ticket-workload]').innerText();
        await page.route(url=>queueURL(url.href),route=>route.fulfill({status:503,json:{error:'Fictional transient failure'}}),{times:1});
        await returnToTab(page);
        await page.getByText('Automatic refresh failed. Retrying…',{exact:false}).waitFor();
        assert.equal(await rows.innerText(),beforeFailure);
        assert.equal(await page.locator('[data-ticket-workload]').innerText(),workload);
        await queueScreenshot('workload-refresh-retry');
        await returnToTab(page);
        await page.getByText('Automatic refresh failed. Retrying…',{exact:false}).waitFor({state:'hidden'});
        // A delayed older background result must not overwrite a newer filter response.
        let release, started, completed;
        const gate = new Promise(resolve=>{release=resolve;});
        const requested = new Promise(resolve=>{started=resolve;});
        const finished = new Promise(resolve=>{completed=resolve;});
        await page.route(url=>queueURL(url.href),async route=>{
            try {
                const response = await route.fetch();
                started();
                await gate;
                try { await route.fulfill({response}); } catch (_) { /* superseded request aborted */ }
            } finally { completed(); }
        },{times:1});
        await returnToTab(page);
        try {
            await Promise.race([requested,new Promise((_,reject)=>setTimeout(()=>reject(Error('Delayed queue request not started')),10000))]);
            await change(status,'Closed');
            await rows.getByText(subject,{exact:true}).waitFor();
        } finally { release(); }
        await finished;
        assert.equal(await status.inputValue(),'Closed');
        assert.ok(await rows.getByText(subject,{exact:true}).isVisible());
        assert.equal(reportRequests,0,'Queue refresh must not request historical reports');
        // Leaving Service Desk removes the timer; returning to the browser tab does not restart it.
        await page.getByRole('button',{name:'Open My Account'}).click();
        await page.locator('.service-desk-page').waitFor({state:'detached'});
        requests = queueRequests;
        await returnToTab(page);
        await page.waitForTimeout(31000);
        assert.equal(queueRequests,requests,'Departed Service Desk page must not poll');
        page.off('request',track);
        // Actual permission withdrawal from Sam's isolated fixture account.
        await sam.bringToFront();
        await waitIdle(sam);
        await blur(sam);
        python("import sqlite3,sys\nwith sqlite3.connect(sys.argv[1]) as db:\n    db.execute(\"DELETE FROM account_permission_overrides WHERE account_id=2 AND section='Service Desk'\")",instance.database);
        const denied = await second.request.get(instance.base+'/api/service-desk/it/tickets');
        assert.equal(denied.status(),403,'Protected endpoint must deny withdrawn rights');
        await returnToTab(sam);
        await sam.getByText('You no longer have permission for this Service Desk action.',{exact:true}).first().waitFor();
        assert.equal(await sam.locator('[data-ticket-rows] tr').count(),0);
        assert.equal(await sam.locator('[data-ticket-workload] button').count(),0);
        assert.ok(await sam.locator('[data-ticket-create]').isHidden());
        const samQueueRequests = [];
        sam.on('request',request=>{if(queueURL(request.url())) samQueueRequests.push(request.url());});
        await returnToTab(sam);
        await sam.waitForTimeout(1000);
        assert.deepEqual(samQueueRequests,[]);
        assert.deepEqual(await sam.locator('[data-report-metric]').allTextContents(),['—','—','—','—']);
        assert.equal(await sam.locator('[data-report-technicians] tr').count(),1);
        assert.equal((await sam.locator('[data-report-technicians]').innerText()).trim(),'—');
        // Expire Alex's actual fixture session while the IT queue is open.
        await page.bringToFront();
        await openServiceDesk(page);
        await waitIdle(page);
        await blur(page);
        python("import sqlite3,sys\nwith sqlite3.connect(sys.argv[1]) as db:\n    db.execute('DELETE FROM account_sessions WHERE account_id=1')",instance.database);
        assert.equal((await page.request.get(instance.base+'/api/session')).status(),401);
        const expired = nextQueue(page);
        await returnToTab(page);
        assert.equal((await expired).status(),401);
        await page.locator('#message').getByText('Your Session Has Ended').waitFor();
        assert.equal(new URL(page.url()).pathname,'/setup');
        assert.equal(await page.locator('[data-ticket-rows]').count(),0);
        assert.equal(await page.locator('[data-ticket-workload]').count(),0);
        const expiredRequests = [];
        page.on('request',request=>{if(queueURL(request.url())) expiredRequests.push(request.url());});
        await returnToTab(page);
        await page.waitForTimeout(1000);
        assert.deepEqual(expiredRequests,[]);
        await signIn(page,instance,'Alex Morgan');
        assert.ok(await page.locator('[data-ticket-workload] button').first().isVisible());
        console.log('Expired IT queue session redirects to approved sign-in, removes old queue and restarts only after genuine reauthentication.');
        assert.deepEqual(errors,[]);
        console.log('Automatic IT queue/workload refresh passed: genuine two-session mutations, real interval, hidden/departed page pause, return refresh, retained filters/report/draft, transient failure recovery, stale-response cancellation and actual permission withdrawal.');
    } finally { await second.close(); }
}

// Diagnostic only: distinguish an idle completed selection with retained focus
// from the already accepted active-editing guard. No application change.
async function investigateRetainedFocus(page,browser,instance){
    const second=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:960}});
    const sam=await second.newPage();
    try{
        await signIn(sam,instance,'Sam Taylor');
        await page.bringToFront();
        const period=page.locator('[data-report-period]');
        const report=page.locator('.service-desk-report');
        const rows=page.locator('[data-ticket-rows]');
        const open=page.locator('[data-workload-status="Open"] strong');
        await page.locator('.service-desk-page:not([aria-busy])').waitFor();
        await period.focus();
        await period.selectOption('today');
        await report.locator('[data-report-period]:enabled').waitFor();
        await page.locator('.service-desk-report:not([aria-busy])').waitFor();
        const naturallyRetained=await period.evaluate(el=>document.activeElement===el);
        // A browser may blur after changing a select; test the retained-focus
        // condition explicitly, and report whether the normal interaction did so.
        if(!naturallyRetained)await period.focus();
        assert.ok(await period.evaluate(el=>document.activeElement===el));
        assert.equal(await page.evaluate(()=>document.hidden),false);
        const before=Number(await open.innerText());
        const subject='Retained focus diagnostic ticket';
        const queueRequests=[];
        const track=request=>{if(request.method()==='GET'&&new URL(request.url()).pathname==='/api/service-desk/it/tickets')queueRequests.push(request.url());};
        page.on('request',track);
        const result=await sam.evaluate(async subject=>{
            const session=await fetch('/api/session',{cache:'no-store'});
            if(!session.ok)throw Error('Second session unavailable: '+session.status);
            const {csrf_token}=await session.json();
            const response=await fetch('/api/service-desk/it/tickets',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf_token},body:JSON.stringify({equipmentKind:'device',equipmentId:'equipment-0',categoryId:4,subject,description:'Fictional second-session diagnostic.'})});
            if(!response.ok)throw Error('Diagnostic mutation failed: '+response.status);
            return response.json();
        },subject);
        assert.ok(result.id);
        await page.waitForTimeout(31000);
        assert.equal(await page.evaluate(()=>document.hidden),false);
        assert.ok(await period.evaluate(el=>document.activeElement===el),'Focus must remain for the diagnostic');
        const requestsWhileFocused=queueRequests.length;
        const visibleWhileFocused=await rows.getByText(subject,{exact:true}).count();
        const workloadWhileFocused=Number(await open.innerText());
        console.log(JSON.stringify({naturallyRetained,requestsWhileFocused,visibleWhileFocused,workloadWhileFocused,before,period:await period.inputValue()}));
        assert.equal(requestsWhileFocused,0,'Expected current source to suppress refresh while idle select retains focus');
        assert.equal(visibleWhileFocused,0);
        assert.equal(workloadWhileFocused,before);
        await page.getByRole('heading',{name:'Service Desk',exact:true}).click();
        assert.ok(await period.evaluate(el=>document.activeElement!==el));
        await rows.getByText(subject,{exact:true}).waitFor({timeout:45000});
        assert.equal(Number(await open.innerText()),before+1);
        assert.equal(await period.inputValue(),'today');
        assert.ok(queueRequests.length>0);
        page.off('request',track);
        console.log('Retained-focus suppression reproduced on unchanged refresh code; after clearing focus real interval resumed. This is diagnostic evidence, not a Safari-specific root-cause claim.');
    }finally{await second.close();}
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
        if(process.env.CAFFOOT_FOCUS_DIAGNOSTIC==='1'){
            await investigateRetainedFocus(page,browser,instance);
            assert.deepEqual(errors,[]);
            await context.close();
            return;
        }
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
            await verifyQueueRefresh(page,browser,instance,screenshot);
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
