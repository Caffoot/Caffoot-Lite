// Exercise the actual tagged exporter and the HTTPS import interface with fictional data.
const assert = require('node:assert/strict');
const {execFileSync, spawn} = require('node:child_process');
const {createHash} = require('node:crypto');
const fs = require('node:fs');
const http = require('node:http');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const {chromium} = require('playwright');

const root = path.resolve(__dirname, '..');
const legacyRevision = '65d9e016c6ddefcd43f236cacdf78fa168e7472f';
const publishedHtml = execFileSync('git', ['show', legacyRevision + ':app/caffoot-lite.html'], {cwd: root});
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'caffoot-stage62-browser-'));
const database = path.join(temporary, 'inventory.sqlite3');
const screenshotFolder = process.env.CAFFOOT_STAGE62_SCREENSHOTS;
const token = 'a'.repeat(64);
const owner = 'stage62-owner';

const legacyData = {
    subnets: [{id:'office', name:'Training Office', cidr:'192.0.2.0/24', gateway:'192.0.2.1', vlan:20}],
    vlans: [{id:'office-vlan', name:'Training Office', vlanId:20}],
    racks: [{id:'demo-rack', name:'Training Rack', heightU:42, widthMm:600, depthMm:800}],
    rackAccessories: [],
    devices: [
        {id:'desk', name:'Reception Desktop', type:'Desktop', mountType:'Desktop', location:'Training Office',
            primaryIp:'192.0.2.10', assetTag:'TRAIN-204', notes:'Fictional reception equipment',
            extraLegacyField:{inspection:'training', values:[1, 2]}},
        {id:'ap', name:'Landing Access Point', type:'Access Point', mountType:'Rack Mounted', rackId:'demo-rack',
            rackUStart:2, rackUEnd:2, rackUHeight:1, location:'Training Office', primaryIp:''},
        {id:'laptop', name:'Workshop Laptop', type:'Laptop', mountType:'Rack Mounted', rackId:'',
            location:'Racked', primaryIp:''},
        {id:'switch', name:'Training Switch', type:'Switch', mountType:'Rack Mounted', rackId:'demo-rack',
            rackUStart:10, rackUEnd:10, rackUHeight:1, face:'front', location:'Training Office', primaryIp:''},
    ],
    ipAllocations: {'192.0.2.10': {status:'Assigned', deviceId:'desk', notes:'Fictional reception IP'}},
    historicalSetting: {keep:['fictional', 42]},
};

function python(script, ...args) {
    return execFileSync('python3', ['-c', script, database, ...args], {
        cwd: root, encoding: 'utf8', env: {...process.env, PYTHONDONTWRITEBYTECODE:'1'},
    }).trim();
}

function snapshot() {
    return python(`
import hashlib, sqlite3, sys
with sqlite3.connect(sys.argv[1]) as db:
    assert db.execute('PRAGMA integrity_check').fetchone() == ('ok',)
    assert db.execute('PRAGMA foreign_key_check').fetchall() == []
    print(hashlib.sha256('\\n'.join(db.iterdump()).encode()).hexdigest())
`);
}

function protectedRows() {
    return python(`
import json, sqlite3, sys
with sqlite3.connect(sys.argv[1]) as db:
    print(json.dumps([
        db.execute("SELECT rowid,* FROM inventory_devices WHERE id IN ('desk','laptop') ORDER BY id").fetchall(),
        db.execute('SELECT * FROM device_suppliers ORDER BY device_id').fetchall(),
        db.execute('SELECT * FROM device_lifecycle ORDER BY device_id').fetchall(),
    ]))
`);
}

async function freePort() {
    const socket = net.createServer();
    await new Promise(resolve => socket.listen(0, '127.0.0.1', resolve));
    const port = socket.address().port;
    await new Promise(resolve => socket.close(resolve));
    return port;
}

async function exportFromPublished(page, state, filename) {
    // Supply fictional browser state, including the earlier mounting forms this
    // migration is intended to repair. The published download handler writes the JSON.
    await page.evaluate(inventory => Object.assign(appState, inventory), state);
    const downloaded = page.waitForEvent('download');
    await page.getByRole('button', {name:'Download Backup', exact:true}).click();
    const file = await downloaded;
    assert.match(file.suggestedFilename(), /^caffoot_lite_backup_.*\.json$/);
    await file.saveAs(filename);
    const exported = JSON.parse(fs.readFileSync(filename, 'utf8'));
    assert.equal(exported.caffootBackup.appVersion, '1.3.3');
    assert.equal(exported.caffootBackup.format, 'caffoot-inventory');
    assert.equal(exported.caffootBackup.schemaVersion, 1);
    assert.deepEqual(exported.devices, state.devices);
    return exported;
}

async function openData(page) {
    await page.locator('#next-settings-nav').click();
    await page.locator('.settings-screen .subnav [data-tab="data"]').click();
    await page.getByRole('button', {name:'Import v1.3.3 Inventory', exact:true}).waitFor();
}

async function chooseBackup(page, filename) {
    const chooser = page.waitForEvent('filechooser');
    await page.getByRole('button', {name:'Import v1.3.3 Inventory', exact:true}).click();
    await (await chooser).setFiles(filename);
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('heading', {name:'Import Inventory from v1.3.3'}).waitFor();
    await dialog.getByText('Landing Access Point', {exact:false}).waitFor();
    return dialog;
}

async function continueMountReview(dialog) {
    await dialog.locator('[data-next-ap-mount]').selectOption('Wall Mounted');
    await dialog.getByRole('button', {name:'Continue', exact:true}).click();
}

async function capture(page, file) {
    if (!screenshotFolder) return;
    fs.mkdirSync(screenshotFolder, {recursive:true});
    await page.screenshot({path:path.join(screenshotFolder, file), animations:'disabled'});
}

async function inventory(page) {
    const result = await page.request.get(new URL('/api/inventory/state', page.url()).href);
    assert.equal(result.status(), 200);
    return result.json();
}

async function run() {
    const legacyServer = http.createServer((request, response) => {
        response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        response.end(publishedHtml);
    });
    let server;
    let browser;
    const log = path.join(temporary, 'server.log');
    try {
        await new Promise(resolve => legacyServer.listen(0, '127.0.0.1', resolve));
        const legacyOrigin = 'http://127.0.0.1:' + legacyServer.address().port;
        browser = await chromium.launch({headless:true, executablePath:process.env.CAFFOOT_CHROMIUM_PATH || undefined});
        const contexts = {ignoreHTTPSErrors:true, viewport:{width:1440, height:960}, acceptDownloads:true};
        const legacyContext = await browser.newContext(contexts);
        await legacyContext.route('**/*', route => {
            const url = new URL(route.request().url());
            return url.origin === legacyOrigin || url.origin === 'https://cdn.tailwindcss.com'
                ? route.continue() : route.abort();
        });
        const legacyPage = await legacyContext.newPage();
        const legacyErrors = [];
        legacyPage.on('pageerror', error => legacyErrors.push(error.message));
        await legacyPage.goto(legacyOrigin + '/');
        await legacyPage.getByRole('button', {name:'Open Settings and Data'}).click();
        const original = path.join(temporary, 'passed', 'caffoot_lite_backup.json');
        const conflicting = path.join(temporary, 'rejected', 'caffoot_lite_backup.json');
        const exportData = await exportFromPublished(legacyPage, legacyData, original);
        const conflictingData = structuredClone(legacyData);
        conflictingData.devices.shift();
        delete conflictingData.ipAllocations['192.0.2.10'];
        conflictingData.devices.find(device => device.id === 'laptop').name = 'Renamed Workshop Laptop';
        await exportFromPublished(legacyPage, conflictingData, conflicting);
        assert.deepEqual(legacyErrors, []);
        await legacyContext.close();

        python(`
import sqlite3, sys, time
from backend.accounts import hash_password
from backend.schema import initialise_database
from backend.sessions import _digest
with sqlite3.connect(sys.argv[1]) as db:
    initialise_database(db)
    db.execute("UPDATE organisation_features SET enabled=1 WHERE feature IN ('devices','ipam','racks')")
    db.execute("INSERT INTO accounts(id,username,password_hash,is_admin,mfa_confirmed,mfa_secret) "
               "VALUES(1,?,?,1,1,'JBSWY3DPEHPK3PXP')", (sys.argv[2], hash_password('Fictional-browser-password!')))
    db.execute("INSERT INTO account_sessions VALUES(?,1,?,?)", (_digest(sys.argv[3]), int(time.time())+3600, int(time.time())))
`, owner, token);
        const port = await freePort();
        const base = 'https://127.0.0.1:' + port;
        const fd = fs.openSync(log, 'w');
        server = spawn('python3', ['-c',
            'from backend import server; import sys; server.PORT = int(sys.argv[1]); server.main()', String(port)], {
            cwd:root, stdio:['ignore',fd,fd], env:{...process.env, PYTHONDONTWRITEBYTECODE:'1',
                CAFFOOT_DB_PATH:database, CAFFOOT_TLS_DIR:path.join(temporary,'tls'),
                CAFFOOT_HOST:'127.0.0.1', CAFFOOT_SERVER_ADDRESS:'127.0.0.1',
                CAFFOOT_WEB_ADDRESS:base, CAFFOOT_PORT:String(port), TZ:'Etc/UTC'},
        });
        fs.closeSync(fd);
        const context = await browser.newContext(contexts);
        await context.route('**/*', route =>
            route.request().url().startsWith(base + '/') ? route.continue() : route.abort());
        await context.addCookies([{name:'caffoot_session', value:token, url:base, secure:true, httpOnly:true, sameSite:'Strict'}]);
        await context.addInitScript(() => localStorage.setItem('caffoot_theme_preference', 'light'));
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        let ready = false;
        for (let attempt = 0; attempt < 30; attempt++) {
            const health = await context.request.get(base + '/health', {timeout:1000}).catch(() => null);
            if (health?.ok()) { ready = true; break; }
            if (server.exitCode !== null) break;
            await new Promise(resolve => setTimeout(resolve, 150));
        }
        assert.ok(ready, 'The disposable HTTPS server did not start');
        await page.goto(base + '/inventory');
        await page.locator('#app[aria-busy="false"]').waitFor();
        await openData(page);

        const empty = snapshot();
        let dialog = await chooseBackup(page, original);
        await capture(page, '01-access-point-review.png');
        await continueMountReview(dialog);
        await dialog.getByText('Review legacy computer mounting corrections', {exact:true}).waitFor();
        await capture(page, '02-replacement-review.png');
        const cancelled = page.waitForResponse(response => response.url().endsWith('/api/import/cancel'));
        await dialog.getByRole('button', {name:'Cancel', exact:true}).click();
        assert.equal((await cancelled).status(), 200);
        assert.equal(snapshot(), empty);

        dialog = await chooseBackup(page, original);
        await continueMountReview(dialog);
        await dialog.getByRole('checkbox', {name:'I approve these mounting corrections.'}).check();
        await dialog.getByRole('checkbox', {name:/I understand that this replaces/}).check();
        const confirmed = page.waitForResponse(response => response.url().endsWith('/api/import/confirm'));
        await dialog.getByRole('button', {name:'Confirm Import', exact:true}).click();
        assert.equal((await confirmed).status(), 200);
        await page.getByText('Inventory imported.', {exact:true}).waitFor();
        await capture(page, '03-import-success.png');

        await page.reload();
        await page.locator('#app[aria-busy="false"]').waitFor();
        const saved = await inventory(page);
        const [desktop, ap, laptop, networkSwitch] = saved.devices;
        assert.equal(desktop.id, 'desk');
        assert.equal(desktop.assetTag, exportData.devices[0].assetTag);
        assert.equal(desktop.notes, exportData.devices[0].notes);
        assert.deepEqual(desktop.extraLegacyField, exportData.devices[0].extraLegacyField);
        assert.deepEqual(saved.settings.historicalSetting, exportData.historicalSetting);
        assert.equal(saved.ipAllocations['192.0.2.10'].deviceId, desktop.id);
        assert.equal(saved.ipAllocations['192.0.2.10'].notes, exportData.ipAllocations['192.0.2.10'].notes);
        assert.equal(saved.subnets[0].vlan, saved.vlans[0].vlanId);
        assert.equal(ap.mountType, 'Wall Mounted');
        assert.equal(ap.rackId, '');
        assert.equal(laptop.mountType, 'Desktop');
        assert.equal(laptop.location, 'Unknown');
        assert.equal(networkSwitch.rackId, saved.racks[0].id);
        assert.equal(networkSwitch.rackUStart, 10);
        assert.equal(saved.racks[0].widthMm, 600);

        python(`
import sqlite3, sys
with sqlite3.connect(sys.argv[1]) as db:
    db.execute('PRAGMA foreign_keys=ON')
    db.execute("INSERT INTO suppliers(id,name,name_key,website,description) VALUES(1,'Example Parts','example parts','','')")
    db.execute("INSERT INTO device_suppliers(device_id,supplier_id) VALUES('desk',1)")
    db.execute("INSERT INTO device_lifecycle(device_id,purchase_date) VALUES('laptop','2026-11-20')")
    db.execute("UPDATE inventory_devices SET revision=7 WHERE id IN ('desk','laptop')")
`);
        const protectedState = snapshot();
        const protectedBefore = protectedRows();
        await openData(page);
        dialog = await chooseBackup(page, conflicting);
        const rejected = page.waitForResponse(response => response.url().endsWith('/api/import/access-point-choices'));
        await continueMountReview(dialog);
        assert.equal((await rejected).status(), 400);
        await dialog.getByRole('heading', {name:'Backup Import Could Not Continue'}).waitFor();
        await dialog.getByText('No inventory or associated records have been changed.', {exact:false}).waitFor();
        assert.match(await dialog.innerText(), /Reception Desktop — missing from the backup \(Supplier association\)/);
        assert.match(await dialog.innerText(), /Workshop Laptop — changed in the backup \(Equipment Lifecycle record\)/);
        assert.equal(await dialog.getByRole('button', {name:'Confirm Import', exact:true}).count(), 0);
        await capture(page, '04-protected-import-rejection.png');
        assert.equal(snapshot(), protectedState);
        await dialog.getByRole('button', {name:'Close', exact:true}).click();

        dialog = await chooseBackup(page, original);
        await continueMountReview(dialog);
        await dialog.getByRole('checkbox', {name:'I approve these mounting corrections.'}).check();
        await dialog.getByRole('checkbox', {name:/I understand that this replaces/}).check();
        const retained = page.waitForResponse(response => response.url().endsWith('/api/import/confirm'));
        await dialog.getByRole('button', {name:'Confirm Import', exact:true}).click();
        assert.equal((await retained).status(), 200);
        await page.getByText('Inventory imported.', {exact:true}).waitFor();
        const after = await inventory(page);
        assert.equal(after.deviceRevisions.desk, 7);
        assert.equal(after.deviceRevisions.laptop, 7);
        assert.equal(protectedRows(), protectedBefore);
        assert.deepEqual(errors, []);
        console.log('PASS: published v1.3.3 Download Backup control and actual v2.2 HTTPS import, both mounting reviews, cancellation, persistence, conflict rejection, and identical protected re-import.');
        console.log('Published HTML SHA-256: ' + createHash('sha256').update(publishedHtml).digest('hex'));
        console.log('Chromium: ' + browser.version());
    } catch (error) {
        if (fs.existsSync(log)) console.error(fs.readFileSync(log, 'utf8'));
        throw error;
    } finally {
        if (browser) await browser.close();
        if (server && server.exitCode === null) {
            const stopped = new Promise(resolve => server.once('exit', resolve));
            server.kill('SIGTERM');
            await stopped;
        }
        await new Promise(resolve => legacyServer.close(resolve));
        fs.rmSync(temporary, {recursive:true, force:true});
    }
}

run().catch(error => { console.error(error); process.exitCode = 1; });
