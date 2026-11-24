// Exercise the existing screens against real HTTPS with fictional records.
const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const {spawn, spawnSync} = require('node:child_process');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const {chromium} = require('playwright');

const root = path.resolve(__dirname, '..');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'caffoot-shared-devices-'));
const evidence = process.env.CAFFOOT_STAGE64_SCREENSHOTS;
const captureScreens = new Set((process.env.CAFFOOT_STAGE64_CAPTURE_SCREEN || '').split(',').filter(Boolean));
const database = path.join(temporary, 'caffoot.sqlite3');
const log = path.join(temporary, 'server.log');
const captures = {};
const errors = [];
let server, browser;

const seed = `
import json, sqlite3, sys
from backend.device_assignments import assign_devices
from backend.equipment_associations import add_associated_equipment
from backend.schema import initialise_database
from backend.service_desk import save_ticket_request
from backend.sessions import _digest
from backend.stock_circulation import issue_stock, stock_issue_records
from backend.stock_intake import receive_stock, stock_item

with sqlite3.connect(sys.argv[1]) as db:
    db.execute('PRAGMA foreign_keys=ON')
    initialise_database(db)
    db.execute("UPDATE organisation_features SET enabled=1 WHERE feature IN ('devices','it_assets')")
    for identity, name in enumerate(('Morgan Reed', 'Casey Smith', 'Jordan Taylor'), 1):
        db.execute("INSERT INTO accounts(id,username,password_hash,is_admin,mfa_confirmed,mfa_secret) VALUES(?,?,?, ?,1,'JBSWY3DPEHPK3PXP')",
                   (identity,name,'Fictional browser fixture',int(identity==1)))
        db.execute('INSERT INTO account_sessions VALUES(?,?,9999999999,1)', (_digest(str(identity)*64),identity))
    db.executemany('INSERT INTO departments(id,name) VALUES(?,?)',
                   [('accounts','Accounts'),('sales','Sales'),('hr','HR')])
    db.executemany('INSERT INTO staff_members(id,account_id,first_name,last_name,department_id) VALUES(?,?,?,?,?)',
                   [('casey',2,'Casey','Smith','sales'),('jordan',3,'Jordan','Taylor','accounts')])
    fixtures = [('office-printer','Main Office Printer','Printer'),('sales-laptop','Sales Laptop','Laptop'),
                ('spare-printer','Meeting Room Printer','Printer')]
    for index, (identity,name,kind) in enumerate(fixtures):
        record = dict(id=identity,name=name,type=kind,status='Active',primaryIp='',mountType='Desktop',typeDetails={})
        db.execute('INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES(?,?,?,?)',
                   (identity,name,json.dumps(record),index))
    db.commit()
    for device,kind,recipient in [('office-printer','department','accounts'),('sales-laptop','staff','casey')]:
        assign_devices(db,1,'1'*64,dict(recipientKind=kind,recipientId=recipient,devices=[dict(id=device,revision=0)]))
    token = '1'*64
    receipt = receive_stock(db,1,token,dict(operationId='fixture-accessory-receipt',quantity=4,
        readyQuantity=4,receivedOn='2026-11-15',supplier='',notes='',
        checks=dict(itemsChecked=True,conditionChecked=True),
        item=dict(category='Other',trackingMode='quantity',manufacturer='Fictional',
                  model='Printer USB Cable',sharedSpecifications={})))
    item = receipt['stockItemId']
    issue_stock(db,1,token,dict(operationId='fixture-accessory-issue',stockItemId=item,
        version=stock_item(db,item)['version'],quantity=1,recipientKind='department',recipientId='accounts',
        issuedOn='2026-11-16',note=''))
    issue, = stock_issue_records(db)
    assignment, = db.execute("SELECT id FROM device_assignments WHERE device_id='office-printer'").fetchone()
    add_associated_equipment(db,1,token,dict(operationId='fixture-accessory-link',deviceId='office-printer',
        deviceRevision=0,deviceAssignmentId=assignment,issueEntryId=issue['id'],version=issue['version']))
    db.execute('BEGIN IMMEDIATE')
    save_ticket_request(db,1,'it',dict(equipmentKind='device',equipmentId='office-printer',
        categoryId=5,subject='Printer jams after page one',description='The paper feed stops on every second page.'))
    print(json.dumps({'issueId':issue['id'],'name':issue['name']}))
`;

function run(command, args) {
    const result = spawnSync(command, args, {cwd:root, encoding:'utf8'});
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
}

async function listenPort() {
    return new Promise((resolve, reject) => {
        const probe = net.createServer().once('error', reject).listen(0, '127.0.0.1', () => {
            const port = probe.address().port;
            probe.close(() => resolve(port));
        });
    });
}

async function openWorkspace(base, actor) {
    const context = await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:960}});
    await context.addCookies([{name:'caffoot_session',value:String(actor).repeat(64),url:base,
        httpOnly:true,secure:true,sameSite:'Strict'}]);
    const page = await context.newPage();
    page.setDefaultTimeout(12000);
    page.on('pageerror', error => errors.push(error.message));
    for (let retry=0; retry<30; retry++) {
        if (server.exitCode !== null) throw Error(fs.readFileSync(log,'utf8'));
        const health = await context.request.get(base+'/health',{timeout:1000}).catch(() => null);
        if (health?.ok()) break;
        await new Promise(resolve => setTimeout(resolve,150));
    }
    await page.goto(base+(actor===1?'/inventory':'/account'));
    await page.locator('#app[aria-busy="false"]').waitFor();
    return page;
}

async function capture(page, name, required) {
    if (!evidence || (captureScreens.size && !captureScreens.has(name))) return;
    for (const [width,height,device] of [[1440,960,'desktop'],[390,844,'mobile']]) {
        await page.setViewportSize({width,height});
        for (const theme of ['light','dark']) {
            await page.evaluate(value => caffootSetTheme(value), theme);
            if (name==='department-tickets') {
                const tab = page.getByRole('tab',{name:'Department Tickets',exact:true});
                if (await tab.getAttribute('aria-selected')!=='true') await tab.click();
            }
            await required.waitFor();
            await page.locator('#toast:not(.opacity-0)').waitFor({state:'detached'});
            if (name==='current-assignment' && device==='mobile') {
                const history = page.locator('#device-details-panel-assigned > section').last();
                await history.evaluate(element => element.scrollIntoView({block:'start'}));
            }
            const geometry = await page.evaluate(() => ({viewport:innerWidth, width:document.documentElement.scrollWidth,
                                                          dark:document.documentElement.classList.contains('dark')}));
            assert.equal(geometry.dark, theme==='dark');
            assert.ok(geometry.width<=width, JSON.stringify({name, ...geometry}));
            const filename = `${name}-${device}-${theme}.png`;
            const buffer = await page.screenshot({
                path:path.join(evidence,filename), animations:'disabled',
                fullPage:name==='department-tickets' || (name==='my-equipment' && device==='mobile')
            });
            captures[filename] = {width,height,theme,sha256:createHash('sha256').update(buffer).digest('hex')};
        }
    }
    await page.setViewportSize({width:1440,height:960});
    await page.evaluate(() => caffootSetTheme('light'));
}

async function openDevice(page, id) {
    await page.locator('#sidebar [data-tab="devices"]').click();
    await page.getByRole('tab',{name:'Device Inventory',exact:true}).click();
    await page.locator(`[data-action="view-device"][data-id="${id}"]`).first().click();
    await page.locator('#device-details-tab-assigned').click();
    await page.locator('#device-details-panel-assigned .assignment-main strong').waitFor();
}

async function main() {
    const accessory = JSON.parse(run('python3',['-c',seed,database]));
    const accessoryKey = 'stock-issue-' + accessory.issueId;
    const accessoryLabel = department => `${accessory.name} · Issue ${accessory.issueId} · Shared with ${department}`;
    const port = await listenPort();
    const base = `https://127.0.0.1:${port}`;
    const fd = fs.openSync(log,'w');
    server = spawn('python3',['-c','from backend import server; import sys; server.PORT = int(sys.argv[1]); server.main()',String(port)],{
        cwd:root,stdio:['ignore',fd,fd],env:{
        ...process.env,TZ:'Europe/London',CAFFOOT_DB_PATH:database,CAFFOOT_TLS_DIR:path.join(temporary,'tls'),
        CAFFOOT_HOST:'127.0.0.1',CAFFOOT_SERVER_ADDRESS:'127.0.0.1',CAFFOOT_WEB_ADDRESS:base,CAFFOOT_PORT:String(port)
    }});
    fs.closeSync(fd);
    browser = await chromium.launch({headless:true,executablePath:process.env.CAFFOOT_CHROMIUM_PATH||undefined});
    if (evidence) fs.mkdirSync(evidence,{recursive:true});
    const admin = await openWorkspace(base,1);
    const employee = await openWorkspace(base,2);
    const accounts = await openWorkspace(base,3);
    const assigned = admin.locator('#device-details-panel-assigned');
    const picker = admin.locator('#equipment-assignment-form [data-department-picker]');
    const choose = identity => picker.locator(`[data-department-choice][value="${identity}"]`);
    const warning = page => page.locator('[data-ticket-confidentiality]');
    const ticketForm = page => page.locator('#service-desk-create-form');

    // One Department displays the warning before a second Department joins.
    await accounts.locator('#sidebar [data-tab="equipment"]').click();
    await accounts.locator('[data-ticket-report-equipment="office-printer"]').click();
    await warning(accounts).waitFor();
    await accounts.getByRole('button',{name:'Cancel',exact:true}).click();
    await accounts.locator(`[data-ticket-report-equipment="${accessoryKey}"]`).click();
    await warning(accounts).waitFor();
    assert.equal(await ticketForm(accounts).locator('[name="equipment"] option:checked').textContent(),
                 accessoryLabel('Accounts'));
    await accounts.getByRole('button',{name:'Cancel',exact:true}).click();

    await openDevice(admin,'spare-printer');
    await assigned.getByRole('button',{name:'Assign Device',exact:true}).click();
    await admin.locator('#equipment-recipient-kind').selectOption('department');
    await choose('accounts').check();
    await picker.getByRole('searchbox').fill('Sales');
    await choose('sales').check();
    assert.equal(await choose('accounts').isChecked(),true);
    await capture(admin,'assign-device',picker);
    await admin.getByRole('button',{name:'Confirm Assignment',exact:true}).click();
    await assigned.getByText('Accounts, Sales',{exact:true}).first().waitFor();
    await admin.getByRole('button',{name:'Close',exact:true}).click();

    await openDevice(admin,'office-printer');
    await assigned.getByRole('button',{name:'Manage Departments',exact:true}).click();
    await choose('accounts').uncheck();
    await admin.getByRole('button',{name:'Save Changes',exact:true}).click();
    await admin.getByRole('alert').filter({hasText:'Select at least one Department'}).waitFor();
    await choose('sales').check();
    await admin.getByRole('button',{name:'Cancel',exact:true}).click();
    await assigned.locator('.assignment-main strong').getByText('Accounts',{exact:true}).waitFor();
    await assigned.getByRole('button',{name:'Manage Departments',exact:true}).click();
    await choose('sales').check();
    await choose('hr').check();
    await capture(admin,'manage-departments',picker);
    await admin.getByRole('button',{name:'Save Changes',exact:true}).click();
    await assigned.getByText('Accounts, HR, Sales',{exact:true}).first().waitFor();
    const history = assigned.locator('section').filter({has:admin.getByRole('heading', {name:'Assignment History', exact:true})});
    assert.deepEqual(await history.getByRole('heading',{level:4}).allTextContents(),
        ['Physical Assignment History','Department Assignment History']);
    const physical = history.locator('h4:has-text("Physical Assignment History") + div table');
    const department = history.locator('h4:has-text("Department Assignment History") + div table');
    assert.deepEqual(await physical.locator('th').allTextContents(),
        ['Staff Member / Department','Issue Date','Return / End Date','Movement']);
    assert.deepEqual(await department.locator('th').allTextContents(),
        ['Department','Date / Time','Change','Recorded By']);
    assert.deepEqual(await physical.locator('tbody tr td:first-child').allTextContents(), ['Accounts']);
    assert.deepEqual(await department.locator('tbody tr td:first-child').allTextContents(), ['Sales','HR','Accounts']);
    await capture(admin,'current-assignment',history.getByRole('heading',{name:'Department Assignment History'}));
    await admin.getByRole('button',{name:'Close',exact:true}).click();

    await admin.locator('#sidebar [data-tab="departments"]').click();
    await admin.locator('[data-staff-action="department-details"][data-id="sales"]').click();
    await admin.getByRole('tab',{name:'Equipment',exact:true}).click();
    const departmentPrinter = admin.getByRole('row').filter({
        has:admin.locator('[data-equipment-action="view-device"][data-id="office-printer"]')
    });
    await departmentPrinter.waitFor();
    assert.equal(await departmentPrinter.locator('[data-id="office-printer"]').count(),1);
    const departmentAccessory = admin.getByRole('row').filter({hasText:accessory.name});
    await departmentAccessory.getByText('Accounts, HR, Sales',{exact:true}).waitFor();
    await capture(admin,'department-equipment',departmentAccessory);

    await employee.locator('#sidebar [data-tab="equipment"]').click();
    const sharedPrinter = employee.locator('[data-shared-equipment]').getByText('Main Office Printer',{exact:true});
    await sharedPrinter.waitFor();
    await employee.locator('[data-personal-equipment]').getByText('Sales Laptop',{exact:true}).waitFor();
    const sharedAccessory = employee.locator('[data-shared-equipment]').getByText(accessory.name,{exact:true});
    await sharedAccessory.waitFor();
    await employee.locator('[data-personal-equipment] [data-ticket-report-equipment]').first().waitFor();
    for (const width of [1440,390,320]) {
        await employee.setViewportSize({width,height:960});
        const layout = await employee.locator('.my-equipment').evaluate(element => ({
            documentWidth:document.documentElement.scrollWidth,
            buttons:[...element.querySelectorAll('[data-ticket-report-equipment]')].map(button => {
                const {left,right} = button.getBoundingClientRect();
                const row = button.closest('.info-row');
                return {left,right,rowRight:row.getBoundingClientRect().right,scope:button.dataset.equipmentScope};
            })
        }));
        assert.ok(layout.buttons.some(button => button.scope==='personal'));
        assert.ok(layout.buttons.some(button => button.scope==='department'));
        assert.ok(layout.documentWidth<=width, `My Equipment overflows at ${width}px`);
        for (const {left,right,rowRight} of layout.buttons) {
            assert.ok(left>=0 && right<=width, `Report A Problem overflows at ${width}px`);
            assert.ok(Math.abs(right-rowRight)<1 && Math.abs(right-layout.buttons[0].right)<1,
                `Report A Problem is not right-aligned across both cards at ${width}px`);
        }
    }
    await employee.setViewportSize({width:1440,height:960});
    await capture(employee,'my-equipment',sharedAccessory);
    await employee.locator('[data-ticket-report-equipment="sales-laptop"]').click();
    await ticketForm(employee).waitFor();
    assert.equal(await ticketForm(employee).locator('[name="equipment"] option:checked').textContent(),
                 'Sales Laptop · Assigned to Me');
    await warning(employee).waitFor({state:'hidden'});
    await employee.getByRole('button',{name:'Cancel',exact:true}).click();
    await employee.locator('[data-ticket-report-equipment="office-printer"]').click();
    await warning(employee).waitFor();
    assert.equal(await ticketForm(employee).locator('[name="equipment"] option:checked').textContent(),
                 'Main Office Printer · Shared with Sales');
    assert.ok(await warning(employee).evaluate(element =>
        !!(element.compareDocumentPosition(element.closest('form').elements.subject) & Node.DOCUMENT_POSITION_FOLLOWING)));
    await capture(employee,'ticket-confidentiality',warning(employee));
    await employee.getByRole('button',{name:'Cancel',exact:true}).click();
    await employee.locator(`[data-ticket-report-equipment="${accessoryKey}"]`).click();
    await warning(employee).waitFor();
    assert.equal(await ticketForm(employee).locator('[name="equipment"] option:checked').textContent(),
                 accessoryLabel('Sales'));
    assert.match(await warning(employee).textContent(), /assigned to the Device this equipment is associated with/);
    assert.ok(await warning(employee).evaluate(element =>
        !!(element.compareDocumentPosition(element.closest('form').elements.subject) & Node.DOCUMENT_POSITION_FOLLOWING)));
    await capture(employee,'accessory-confidentiality',warning(employee));
    await ticketForm(employee).locator('[name="categoryId"]').selectOption('5');
    await ticketForm(employee).locator('[name="subject"]').fill('Printer cable connection drops');
    await ticketForm(employee).locator('[name="description"]').fill('The printer disappears when the cable moves.');
    await employee.getByRole('button',{name:'Create Ticket',exact:true}).click();
    await ticketForm(employee).waitFor({state:'hidden'});

    await employee.locator('#sidebar [data-tab="my-tickets"]').click();
    await employee.getByRole('tab',{name:'Department Tickets',exact:true}).click();
    const ticket = employee.getByText('Printer jams after page one',{exact:true});
    await ticket.waitFor();
    const accessoryTicket = employee.getByText('Printer cable connection drops',{exact:true});
    await accessoryTicket.waitFor();
    await capture(employee,'department-tickets',accessoryTicket);
    await employee.locator('[data-employee-ticket-create]').click();
    const equipment = ticketForm(employee).locator('[name="equipment"]');
    await equipment.selectOption({label:'Main Office Printer · Shared with Sales'});
    await warning(employee).waitFor();
    await equipment.selectOption({label:accessoryLabel('Sales')});
    await warning(employee).waitFor();
    assert.match(await warning(employee).textContent(), /assigned to the Device this equipment is associated with/);
    await equipment.selectOption({label:'Sales Laptop · Assigned to Me'});
    await warning(employee).waitFor({state:'hidden'});
    await employee.getByRole('button',{name:'Cancel',exact:true}).click();
    assert.deepEqual(errors,[]);

    if (evidence) {
        if (captureScreens.size) assert.equal(Object.keys(captures).length, 4 * captureScreens.size);
        const sources = ['interface/application.js','interface/equipment.js','interface/staff-directory.js',
            'interface/stock-intake.js','interface/service-desk.js','interface/styles/equipment.css',
            'interface/styles/service-desk.css','backend/shared_devices.py','backend/shared_device_schema.py',
            'backend/device_assignments.py','backend/stock_circulation.py','backend/service_desk_access.py',
            'backend/service_desk.py'];
        const report = {sourceRevision:run('git',['rev-parse','HEAD']), browser:await browser.version(),
            capturedAt:new Date().toISOString(), origin:base, schema:29,
            fixture:'Fictional Staff, Departments, Devices and tickets seeded in this Chromium test.',
            sourceHashes:Object.fromEntries(sources.map(source => [source,
                createHash('sha256').update(fs.readFileSync(path.join(root,source))).digest('hex')])), captures};
        fs.writeFileSync(path.join(evidence,'capture-manifest.json'),JSON.stringify(report,null,2)+'\n');
    }
    console.log('Shared Devices Chromium check passed with '+Object.keys(captures).length+' application captures.');
}

main().catch(error => {
    console.error(error);
    if (fs.existsSync(log)) console.error(fs.readFileSync(log,'utf8').split('\n').slice(-20).join('\n'));
    process.exitCode=1;
}).finally(async () => {
    if (browser) await browser.close();
    if (server) server.kill();
    fs.rmSync(temporary,{recursive:true,force:true});
});
