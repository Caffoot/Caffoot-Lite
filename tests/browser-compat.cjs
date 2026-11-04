// Caffoot Lite Next: published browser controls exercised against HTTPS/SQLite.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {spawn,spawnSync}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-next-ui-'));
const address='https://127.0.0.1:8080';
const password='Test-Administrator-Password-2026!';
const logfile=path.join(tmp,'backend.log');
let server,browser;
const temporaryAssetLink=path.join(root,'assets');
const linkCreated=!fs.existsSync(temporaryAssetLink);
if(linkCreated)fs.symlinkSync(path.join(root,'..','assets'),temporaryAssetLink,'dir');
function mfaCode(secret){
  const p=spawnSync('python3',['-c',
    'from backend.mfa import code_at; import sys,time; print(code_at(sys.argv[1],time.time()))',secret],
    {cwd:root,encoding:'utf8'});
  if(p.status!==0)throw Error(p.stderr);
  return p.stdout.trim();
}
async function state(page){
  return page.evaluate(async()=>{
    const r=await fetch('/api/inventory/state',{cache:'no-store'});
    if(!r.ok)throw Error('SQLite inventory unavailable: '+r.status);
    return r.json();
  });
}
async function persisted(page,test,label){
  for(let i=0;i<45;i++){
    const value=await state(page);
    if(test(value))return value;
    await page.waitForTimeout(200);
  }
  throw Error(label+' not saved centrally; toast: '+await page.locator('#toast-message').textContent());
}
async function modal(page,name){
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));
  await page.evaluate(name=>{
    if(typeof window[name]!=='function')throw Error('Missing published modal '+name);
    window[name]();
  },name);
}
async function run(){
  const log=fs.openSync(logfile,'w');
  server=spawn('python3',['-m','backend.server'],{
    cwd:root,stdio:['ignore',log,log],
    env:{...process.env,CAFFOOT_DB_PATH:path.join(tmp,'inventory.sqlite3'),
      CAFFOOT_TLS_DIR:path.join(tmp,'tls'),CAFFOOT_WEB_ADDRESS:address,
      CAFFOOT_SERVER_ADDRESS:'127.0.0.1',CAFFOOT_PORT:'8080',CAFFOOT_HOST:'127.0.0.1'}
  });
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:950}});
  const page=await context.newPage();
  page.setDefaultTimeout(12000);
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  let online=false;
  for(let i=0;i<60;i++){
    if(server.exitCode!==null)throw Error('Server exited: '+fs.readFileSync(logfile,'utf8'));
    try{const r=await context.request.get(address+'/health',{timeout:1000});if(r.ok()){online=true;break}}
    catch(_){}
    await page.waitForTimeout(250);
  }
  assert.ok(online,'HTTPS server failed to start');
  console.log('HTTPS and SQLite startup passed');
  await page.goto(address+'/setup');
  assert.equal(await page.title(),'Caffoot Lite — Infrastructure, Simplified.','Setup browser tab must use Caffoot branding');
  assert.equal(await page.locator('link[rel="icon"]').getAttribute('href'),'/assets/favicon.ico',
    'Sign-in and first-run setup must declare the existing Caffoot favicon');
  assert.equal(await page.locator('link[rel="apple-touch-icon"]').getAttribute('href'),'/assets/apple-touch-icon.png',
    'Sign-in and first-run setup must declare the existing touch icon');
  const faviconResponse=await page.request.get(address+'/assets/favicon.ico');
  assert.equal(faviconResponse.status(),200,'Existing Caffoot favicon should be served to browsers');
  await page.locator('.brand-side .brand-logo[src="/assets/caffoot-icon-1024.png"]').waitFor();
  assert.equal(await page.locator('.brand-content h2').innerText(),'Infrastructure,\nSimplified.');
  assert.ok((await page.locator('main').evaluate(el=>getComputedStyle(el).fontFamily)).includes('Inter'),
    'First-run setup must use the approved Inter font stack');
  await page.setViewportSize({width:375,height:812});
  assert.ok(await page.locator('main').evaluate(el=>{
    const rect=el.getBoundingClientRect();
    return rect.left>=0 && rect.right<=window.innerWidth;
  }),'Branded setup panel must fit a narrow screen');
  await page.setViewportSize({width:1440,height:950});
  await page.locator('#welcome-flow:not([hidden])').waitFor();
  assert.ok(await page.getByRole('heading',{name:'Create Your Administrator'}).isVisible(),
    'Approved first-run welcome must explain the administrator step');
  await page.locator('#get-started').click();
  await page.waitForFunction(()=>document.querySelector('#intro')?.textContent.includes('Create the first administrator'));
  await page.locator('#username').fill('owner');
  await page.locator('#password').fill(password);
  await page.locator('#submit').click();
  await page.locator('#enrolment:not([hidden])').waitFor();
  const secret=(await page.locator('#secret').textContent()).trim();
  assert.ok(secret.length>=16,'MFA enrolment secret missing');
  await page.waitForFunction(()=>{
    const img=document.querySelector('#setup-qr img');
    return img && img.complete && img.naturalWidth>0;
  });
  await page.locator('#code').fill(mfaCode(secret));
  await page.locator('#submit').click();
  await page.getByText('MFA enrolled. Sign in to continue.').waitFor();
  assert.ok(await page.locator('#code-field').evaluate(el=>el.hidden),'Authenticator code should be hidden before sign-in');
  await page.locator('#submit').click();
  await page.locator('#code-field:not([hidden])').waitFor();
  await page.locator('#code').fill(mfaCode(secret));
  await page.waitForURL('**/inventory');
  assert.equal(await page.locator('script[src*="cdn.tailwindcss.com"]').count(),0,
    'Inventory must not load remote Tailwind JavaScript');
  assert.equal(await page.locator('link[href="/assets/tailwind.css"]').count(),1,
    'Inventory must load the local Tailwind stylesheet');
  const staticCSS=await page.request.get(address+'/assets/tailwind.css');
  assert.equal(staticCSS.status(),200,'Static stylesheet must be served by the backend');
  assert.match(staticCSS.headers()['content-type']||'',/text\/css/);
  assert.ok((await staticCSS.text()).includes('bg-white'),
    'Compiled inventory utilities must be present');
  assert.equal(await page.locator('#sidebar').evaluate(el=>getComputedStyle(el).display),'flex',
    'Tailwind utility layout must remain active');
  // The shared navigation must come from the approved seven-item HTML menu.
  assert.equal(await page.locator('#sidebar .nav-item[data-tab]').count(),7,
    'Approved sidebar must have exactly seven primary sections, not nested actions');
  assert.equal(await page.locator('#sidebar [id$="-sidebar-actions"]').count(),0,
    'The old nested section menus must not be shipped');
  assert.ok(await page.locator('#app .header-account').isVisible(),
    'Approved My Account control must be in the top-right header');
  assert.equal((await page.request.get(address+'/assets/caffoot-logo-256.png')).status(),200,
    'Approved branding asset must be served by the Python app');

  // Approved catalogue content must be a real live Device page, not preview HTML.
  await page.locator('#sidebar [data-action="tab-devices"]').click();
  await page.locator('#main-content [data-action="approved-device-section"][data-tab="types"]').click();
  await page.locator('#main-content .catalog-card [data-catalog-list="type"]').waitFor();
  const deviceTypeRows=page.locator('#main-content [data-catalog-row="type"]');
  const deviceTypeTotal=await deviceTypeRows.count();
  assert.ok(deviceTypeTotal>0,'Configured device types must appear in the approved catalogue layout');
  assert.ok(await page.locator('#main-content .catalog-header [data-action="open-manage-types"]').isVisible(),
    'The existing Manage Device Types action must remain available');
  await page.locator('#main-content input[data-catalogue-search="type"]').fill('no-existing-device-type-match-2026');
  assert.equal(await page.locator('#main-content [data-catalog-row="type"]:visible').count(),0,
    'Approved catalogue search should hide non-matching device types');
  await page.locator('#main-content [data-action="clear-catalogue-list-search"][data-catalogue="type"]').click();
  assert.equal(await page.locator('#main-content [data-catalog-row="type"]:visible').count(),deviceTypeTotal,
    'Clearing the catalogue search must restore all device types');
  await page.locator('#main-content [data-action="approved-device-section"][data-tab="locations"]').click();
  await page.locator('#main-content .catalog-card [data-catalog-list="location"]').waitFor();
  assert.ok(await page.locator('#main-content .catalog-header [data-action="open-manage-locations"]').isVisible(),
    'The existing Manage Locations action must remain available');
  await page.locator('#sidebar [data-action="tab-ipam"]').click();
  await page.locator('#main-content .ipam-stats').waitFor();
  assert.equal(await page.locator('#main-content .ipam-stat').count(),4,
    'Approved IPAM Overview must show the four live saved-inventory totals');
  assert.ok(await page.locator('#main-content .ipam-card #ipam-overview-search').isVisible(),
    'Approved IPAM Overview must keep working subnet search');
  await page.locator('#sidebar [data-action="tab-racks"]').click();
  await page.locator('#main-content [data-action="approved-rack-section"][data-section-tab="overview"]').click();
  await page.locator('#main-content .racks-grid#rack-overview-stats').waitFor();
  assert.equal(await page.locator('#main-content .rack-stat').count(),4,
    'Approved Network Racks Overview must show four live totals');
  await page.locator('#main-content [data-action="approved-rack-section"][data-section-tab="inventory"]').click();
  await page.locator('#main-content .rack-directory').waitFor();
  await page.locator('#main-content #v13-rack-search.rack-text-input').waitFor();
  await page.locator('#sidebar [data-action="tab-dashboard"]').click();
  assert.equal(await page.title(),'Caffoot Lite — Infrastructure, Simplified.','Inventory browser tab must use Caffoot branding');
  await page.locator('#app .header-account').waitFor();
  // Verify the approved computed typeface with the locally served Tailwind preflight.
  assert.ok((await page.locator('html').evaluate(el=>getComputedStyle(el).fontFamily)).includes('Inter'),
    'Inventory, Users, Settings and My account must inherit Inter typography');
  await page.waitForFunction(()=>document.querySelector('#page-title')?.textContent==='Dashboard Overview');
  for(const selector of ['#sidebar','#page-title','#main-content']){
    assert.ok((await page.locator(selector).evaluate(el=>getComputedStyle(el).fontFamily)).includes('Inter'),
      'Branded inventory typography should apply to '+selector);
  }
  console.log('First administrator, MFA, sign-in and direct Dashboard arrival passed');
  assert.equal(await page.locator('#next-dashboard-mfa-notice').count(),0,
    'Enrolled administrators must not see MFA setup guidance');
  assert.equal(await page.locator('#next-dashboard-inventory-health').count(),0,
    'Healthy administrator Dashboard must hide Inventory Health');
  assert.equal(await page.getByText('Keep a separate JSON backup',{exact:false}).count(),0,
    'Docker Dashboard must not show browser-era JSON backup advice');
  assert.equal(await page.getByRole('button',{name:'Refresh inventory'}).count(),0);
  for(const tab of ['ipam','devices','racks','audit','users','settings']){
    const navigation=page.locator('#sidebar [data-action="tab-'+tab+'"]');
    assert.ok(await navigation.isEnabled(),'Navigation disabled: '+tab);
    await navigation.click();
    assert.notEqual(await page.locator('#toast-message').textContent(),
      'This inventory operation is not yet connected to SQLite.');
  }
  await page.locator('#sidebar [data-action="tab-settings"]').click();
  assert.ok(await page.getByRole('heading',{name:'Settings & Data',exact:true}).isVisible(),
    'Settings & Data must use the owner-approved Draft 02 page');
  assert.equal(await page.locator('.approved-settings .subnav [data-action="approved-settings-tab"]').count(),3,
    'Approved Data & Backups, Email Settings and System Maintenance tabs must render');
  assert.ok(await page.getByRole('heading',{name:'Import Existing Inventory',exact:true}).isVisible(),
    'The approved Import Existing Inventory panel must remain');
  assert.ok(await page.locator('[data-action="next-import-pick"]').isEnabled(),
    'Administrator legacy migration picker must remain');

  // Approved email configuration must persist without disclosing its password.
  await page.locator('.approved-settings .subnav [data-tab="email"]').click();
  await page.waitForFunction(()=>document.querySelector('#smtp-config-status')?.textContent==='Not Configured');
  await page.locator('#approved-smtp-form [name="host"]').fill('mail.example.test');
  await page.locator('#approved-smtp-form [name="port"]').fill('587');
  await page.locator('#approved-smtp-form [name="username"]').fill('smtp-owner');
  await page.locator('#approved-smtp-form [name="password"]').fill('test-smtp-browser-password');
  await page.locator('#approved-smtp-form [name="fromName"]').fill('Caffoot Lite');
  await page.locator('#approved-smtp-form [name="fromEmail"]').fill('caffoot@example.test');
  await page.locator('#approved-smtp-form button[type="submit"]').click();
  await page.waitForFunction(()=>document.querySelector('#smtp-config-status')?.textContent==='Configured');
  const smtpDetails=await page.evaluate(async()=>{
    const response=await fetch('/api/settings/email',{cache:'no-store'});
    if(!response.ok)throw Error('SMTP configuration not readable');
    return response.json();
  });
  assert.equal(smtpDetails.host,'mail.example.test');
  assert.equal(smtpDetails.passwordConfigured,true);
  assert.equal(smtpDetails.password,undefined,'SMTP credentials must never be returned to the browser');
  assert.ok(await page.locator('#approved-smtp-form [name="password"]').inputValue()==='',
    'Saved SMTP passwords must never be reinserted into form fields');

  await page.locator('.approved-settings .subnav [data-tab="maintenance"]').click();
  assert.ok(await page.locator('[data-action="clear-inventory-data"]').isEnabled(),
    'Administrator Clear System safeguard must remain');
  const safetyResult=new Promise(resolve=>page.once('dialog',async dialog=>{
    const message=dialog.message();await dialog.accept();resolve(message);
  }));
  await page.locator('[data-action="check-inventory-safety"]').click();
  assert.match(await safetyResult,/INVENTORY SAFETY CHECK PASSED/,
    'Manual safety check must still reload and validate central inventory');
  await page.locator('#sidebar [data-action="tab-audit"]').click();
  await page.waitForFunction(()=>document.querySelector('#page-title')?.textContent==='Audit Trail');
  assert.ok(await page.locator('#main-content .approved-audit .audit-tabs').isVisible(),
    'Owner-approved Audit Trail section navigation must render');
  assert.equal(await page.locator('#main-content .approved-audit .audit-tab').count(),3,
    'Approved All Activity, Asset History and Recording Coverage must be available');
  assert.equal(await page.locator('#main-content .approved-audit #stat-total').textContent(),'1',
    'Saving the approved SMTP settings must create exactly one genuine, attributable audit event');
  assert.ok(await page.getByText('SMTP configuration updated',{exact:true}).first().isVisible(),
    'The real administrator SMTP change must be visible in the authorised Audit Trail');
  await page.locator('#sidebar [data-action="tab-users"]').click();
  await page.getByRole('heading',{name:'Your people, at a glance'}).waitFor();
  assert.ok(await page.locator('#main-content .approved-page-body .users-live').isVisible(),
    'Approved Users overview should fill the inventory workspace');
  await page.getByText('Total users',{exact:true}).waitFor();
  await page.getByText('Administrators',{exact:true}).first().waitFor();
  await page.getByText('Accounts by role',{exact:true}).waitFor();
  await page.getByText('Authenticator enrolment',{exact:true}).waitFor();
  assert.ok(await page.locator('#main-content .approved-page-header .tabs').isVisible());
  assert.equal(await page.locator('#next-account-password-form').count(),0,
    'User Management must not contain personal account settings');
  await page.locator('#app .header-account').click();
  assert.equal(await page.locator('#page-title').textContent(),'My account');
  await page.locator('#personal-details-form').waitFor();
  assert.ok(await page.getByRole('heading',{name:'Personal Details'}).isVisible(),
    'Approved My Account Overview must contain personal details');
  assert.equal(await page.locator('#profile-username').inputValue(),'owner',
    'Sign-in username must remain visible and read-only');
  assert.equal(await page.locator('#profile-username').getAttribute('readonly'),'',
    'Username is never editable in personal details');
  assert.equal(await page.locator('.approved-account .subnav [data-section="overview"]').getAttribute('aria-selected'),'true');
  assert.ok(await page.locator('.approved-account .future-compact').count()===2,
    'My Devices and My Tickets remain plainly marked Planned');
  await page.locator('[data-action="select-account-section"][data-section="security"]').first().click();
  await page.locator('#next-account-password-form').waitFor();
  assert.ok(await page.getByText('Security At A Glance',{exact:true}).isVisible());
  await page.locator('[data-action="select-account-section"][data-section="help"]').first().click();
  await page.locator('.approved-account .expander').first().waitFor();
  assert.equal(await page.locator('.approved-account .expander').count(),5,
    'Approved Help & Guides must keep its five expandable topics');
  const fullGuides=page.locator('.approved-account a[href*="Features%20and%20Instructions"]');
  assert.ok(await fullGuides.count()>0,'Approved full user documentation link must remain');
  await page.locator('[data-action="select-account-section"][data-section="about"]').first().click();
  assert.ok(await page.getByText('Published Release',{exact:true}).isVisible());
  assert.ok(await page.getByText('v2.0.3',{exact:true}).isVisible());
  await page.locator('[data-action="select-account-section"][data-section="overview"]').first().click();
  await page.locator('#personal-details-form').waitFor();
  assert.equal(await page.locator('#personal-details-form input[name="firstName"]').count(),1);
  await page.locator('#personal-details-form input[name="firstName"]').fill('Test');
  await page.locator('#personal-details-form input[name="lastName"]').fill('Administrator');
  await page.locator('#personal-details-form input[name="displayName"]').fill('Test Owner');
  await page.locator('#personal-details-form input[name="email"]').fill('owner@example.test');
  await page.locator('#personal-details-form button[type="submit"]').click();
  await page.waitForFunction(async()=>{
    const r=await fetch('/api/account/profile',{cache:'no-store'});
    return r.ok && (await r.json()).displayName==='Test Owner';
  });
  assert.equal(await page.locator('#profile-username').inputValue(),'owner',
    'Saving personal details must not alter the sign-in username');
  assert.equal(await page.locator('#personal-details-form input[name="email"]').inputValue(),'owner@example.test');
  const accountPhoto=Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j5l8AAAAASUVORK5CYII=',
    'base64'
  );
  await page.locator('#account-photo-input').setInputFiles({
    name:'profile.png',mimeType:'image/png',buffer:accountPhoto
  });
  await page.locator('#photo-preview-image:visible').waitFor();
  assert.equal(await page.locator('#header-account-initial img').count(),1,
    'Saved profile photo should also update the approved header avatar');
  await page.locator('[data-action="account-photo-remove"]').click();
  await page.waitForFunction(()=>!document.querySelector('#header-account-initial img'));
  assert.ok(await page.locator('#photo-preview-image').isHidden(),
    'Removing a profile photo must restore the default avatar');
  await page.locator('[data-action="select-account-section"][data-section="security"]').first().click();
  await page.locator('#sidebar [data-action="tab-users"]').click();
  assert.equal(await page.locator('#page-title').textContent(),'Users');
  await page.locator('#sidebar [data-action="tab-dashboard"]').click();
  assert.equal((await state(page)).sections.Devices,true);
  console.log('Authenticated central inventory rendered');

  await modal(page,'openSubnetModal');
  await page.locator('#sub-cidr').fill('10.64.20.0/24');
  await page.locator('#sub-name').fill('Browser Network');
  await page.locator('#sub-vlan').fill('17');
  await page.locator('#sub-gw').fill('10.64.20.1');
  await page.locator('form[data-form-action="subnet"] button[type="submit"]').click();
  const sub=await persisted(page,s=>s.subnets.some(x=>x.name==='Browser Network'),'Subnet');
  assert.equal(sub.vlans.length,1);
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));
  console.log('Subnet and linked VLAN form passed');

  // IPAM Draft 01: approved live Address Allocations page, not the old cards.
  await page.locator('#sidebar [data-action="tab-ipam"]').click();
  await page.locator('#main-content .approved-page-header [data-action="approved-ipam-section"][data-view="addresses"]').click();
  const approvedAddresses=page.locator('#main-content .ipam-approved-addresses');
  await approvedAddresses.waitFor();
  assert.ok(await approvedAddresses.locator('.ipam-subnet-bar #ipam-select-network').isVisible(),
    'Approved IPAM Active Network / VLAN selector must render');
  assert.ok(await approvedAddresses.locator('.ipam-network-summary .ipam-util-numbers').isVisible(),
    'Approved IPAM network identity and live capacity must render');
  assert.equal(await approvedAddresses.locator('.ipam-address-card').count(),32,
    'The published /24 initial host range must remain .1 through .32');
  assert.ok(await approvedAddresses.locator('[data-action="open-ip"][data-ip="10.64.20.2"]').isVisible(),
    'Address cards must retain the existing IP allocation action');
  await approvedAddresses.locator('#ipam-status-filter').selectOption('Reserved');
  assert.equal(await approvedAddresses.locator('.ipam-address-card').count(),1,
    'IPAM status filter must keep displaying the reserved gateway');
  await approvedAddresses.locator('#ipam-status-filter').selectOption('All');
  await approvedAddresses.locator('#ipam-address-search').fill('10.64.20.17');
  assert.equal(await approvedAddresses.locator('.ipam-address-card').count(),1,
    'Approved IPAM address search must filter the live inventory');
  await approvedAddresses.locator('#ipam-address-search').fill('');
  await approvedAddresses.locator('[data-action="ip-range-33-64"]').click();
  assert.ok(await approvedAddresses.locator('[data-action="open-ip"][data-ip="10.64.20.33"]').isVisible(),
    'Host range buttons must still browse the selected /24 network');
  assert.equal(await approvedAddresses.locator('[data-action="open-ip"][data-ip="10.64.20.1"]').count(),0,
    'Changing the selected host range must not display earlier addresses');
  await approvedAddresses.locator('[data-action="ip-range-1-32"]').click();
  await approvedAddresses.locator('#ipam-select-network').selectOption(sub.subnets.find(n=>n.name==='Browser Network').id);
  assert.ok(await approvedAddresses.locator('#ipam-next-free').isEnabled(),
    'Existing next-available IP workflow must be accessible in the approved design');
  await page.locator('#sidebar [data-action="tab-dashboard"]').click();
  console.log('Approved live IPAM Address Allocations search, filters and ranges passed');

  await modal(page,'openRackModal');
  await page.locator('#rack-name').fill('Browser Rack');
  await page.locator('form[data-form-action="rack"] button[type="submit"]').click();
  await persisted(page,s=>s.racks.some(x=>x.name==='Browser Rack'),'Rack');
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));
  console.log('Rack form passed');

  await modal(page,'openManageLocationsModal');
  await page.locator('#device-catalogue-new-entry-input').fill('Office');
  await page.locator('[data-action="add-device-type-or-location"][data-kind="location"]').click();
  await persisted(page,s=>s.settings.deviceLocations?.includes('Office'),'Location');
  await page.waitForFunction(()=>document.getElementById('toast-message')?.textContent.includes('Location added successfully.'));
  await page.evaluate(()=>closeModal(true));
  console.log('Managed location add passed');

  await modal(page,'openDeviceModal');
  const general=page.locator('#device-form-panel-general');
  await general.waitFor();
  assert.equal(await general.evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),2,
    'Device General form must use desktop columns');
  await page.setViewportSize({width:740,height:900});
  assert.notEqual(await general.evaluate(el=>getComputedStyle(el).display),'grid',
    'Device General form must remain stacked on narrow screens');
  await page.setViewportSize({width:1440,height:950});
  assert.ok(await page.locator('#dev-name').isVisible(),
    'Responsive layout must preserve Device Name field');
  await page.locator('#dev-name').fill('browser-device');
  const typeSelector=page.locator('#dev-type + .caffoot-select-host .caffoot-search-trigger');
  await typeSelector.waitFor();
  await typeSelector.click();
  await page.locator('.caffoot-search-popup:not([hidden]) input[type="search"]').fill('Desk');
  await page.locator('.caffoot-search-popup:not([hidden]) [role="option"]',{hasText:'Desktop'}).click();
  assert.equal(await page.locator('#dev-type').inputValue(),'Desktop',
    'Searchable selector must preserve the original native selection');
  await page.locator('#dev-mount-type').selectOption('Tabletop / Shelf Mounted');
  await page.locator('#dev-location').selectOption('Office');
  await page.getByRole('tab',{name:'Networking'}).click();
  await page.locator('#dev-block').selectOption('__unassigned__');
  await page.locator('#dev-vlan').selectOption('17');
  const options=await page.locator('#dev-subnet option').evaluateAll(nodes=>nodes.map(x=>({id:x.value,label:x.textContent})));
  const selected=options.find(x=>x.label.includes('10.64.20.0/24'));
  assert.ok(selected,'Subnet cascade failed to show published network');
  await page.locator('#dev-subnet').selectOption(selected.id);
  await page.locator('#dev-ip').fill('10.64.20.10');
  await page.locator('form[data-device-form="true"] button[type="submit"]').click();
  const saved=await persisted(page,s=>s.devices.some(d=>d.name==='browser-device'),'Device');
  const device=saved.devices.find(d=>d.name==='browser-device');
  assert.equal(saved.ipAllocations['10.64.20.10'].deviceId,device.id);
  console.log('Device form and primary IPAM allocation passed');
  await page.locator('#sidebar [data-action="tab-audit"]').click();
  await page.locator('.approved-audit #activity-results tr[data-audit-index]').first().waitFor();
  assert.ok(Number(await page.locator('.approved-audit #stat-total').textContent())>=1,
    'Audit Trail must show real saved events after a device change');
  assert.equal(await page.locator('.approved-audit #stat-actors').textContent(),'1',
    'Audit events must attribute a successful change to the authenticated owner');
  assert.ok(await page.locator('.approved-audit #activity-results').getByText('owner').count()>=1);
  await page.locator('.approved-audit #area').selectOption('Devices');
  await page.locator('.approved-audit #q').fill('browser-device');
  assert.ok(await page.locator('.approved-audit #activity-results tr[data-audit-index]:visible').count()>=1,
    'Approved area and search filters must match the saved device event');
  await page.locator('[data-action="audit-reset-filters"]').click();
  await page.locator('.approved-audit [data-action="audit-view-detail"]').first().click();
  await page.locator('#audit-detail-layer:not([hidden])').waitFor();
  assert.ok(await page.locator('#audit-detail-body').getByText('owner').isVisible());
  await page.locator('#audit-detail-layer [data-action="audit-close-detail"]').click();
  await page.locator('.approved-audit [data-action="audit-section"][data-tab="assets"]').click();
  await page.locator('#pane-assets:not([hidden])').waitFor();
  assert.ok(await page.locator('#asset-list .asset-item').count()>=1,
    'Approved Asset History must group real authorised records');
  await page.locator('.approved-audit [data-action="audit-section"][data-tab="coverage"]').click();
  await page.locator('#pane-coverage:not([hidden])').waitFor();
  await page.locator('#sidebar [data-action="tab-dashboard"]').click();
  console.log('Approved Audit Trail real events, filters and detail inspection passed');

  // A detected inconsistency appears only as an administrator warning; no data is saved.
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));
  await page.evaluate(()=>{
    switchTab('dashboard');
    appState.devices.push({...appState.devices.find(d=>d.name==='browser-device')});
    renderContent();
  });
  const health=page.locator('#next-dashboard-inventory-health');
  assert.equal(await health.count(),1,'Admin must see actual inventory inconsistencies');
  assert.ok(await health.getByText(/Duplicate or missing device ID/).isVisible());
  assert.ok(await health.evaluate(el=>el.classList.contains('db-error-card')),
    'Inventory Health must retain the accepted Dashboard warning component');
  await page.evaluate(()=>{
    const duplicates=appState.devices.map((device,i)=>device.name==='browser-device'?i:-1).filter(i=>i>=0);
    if(duplicates.length>1)appState.devices.splice(duplicates[duplicates.length-1],1);
    renderContent();
  });
  await page.waitForFunction(()=>!document.getElementById('next-dashboard-inventory-health'));
  assert.equal(await health.count(),0,'Corrected inventory must hide the warning');

  // Published IPAM paths: device-linked notes and independent reservations.
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));
  await page.evaluate(()=>openIpModal('10.64.20.10'));
  await page.locator('#ip-notes').fill('Device IPAM notes kept independently');
  await page.locator('form[data-form-action="ip"] button[type="submit"]').click();
  await persisted(page,s=>s.ipAllocations['10.64.20.10']?.notes==='Device IPAM notes kept independently',
                  'Device-linked IPAM notes');
  assert.equal((await state(page)).ipAllocations['10.64.20.10'].deviceId,device.id);
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));
  await page.evaluate(()=>openIpModal('10.64.20.15'));
  await page.locator('#ip-status').selectOption('Reserved');
  await page.locator('#ip-hostname').fill('spare-address');
  await page.locator('#ip-notes').fill('Independent reservation');
  await page.locator('form[data-form-action="ip"] button[type="submit"]').click();
  await persisted(page,s=>s.ipAllocations['10.64.20.15']?.status==='Reserved',
                  'Independent IPAM reservation');
  assert.equal((await state(page)).ipAllocations['10.64.20.15'].notes,'Independent reservation');
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));
  const subnetId=sub.subnets.find(x=>x.name==='Browser Network').id;
  await page.evaluate(id=>openBulkIpModal(id),subnetId);
  await page.locator('#bulk-start').fill('20');
  await page.locator('#bulk-end').fill('22');
  await page.locator('#bulk-status').selectOption('Reserved');
  await page.locator('#bulk-hostname').fill('pool');
  await page.locator('#bulk-notes').fill('Bulk notes');
  await page.locator('form[data-form-action="bulk-ip"] button[type="submit"]').click();
  const previewIps=await page.evaluate(()=>{
    const request=pendingBulkIpAssignment;
    if (!request) return [];
    return planBulkSubnetAddressAssignment(
      appState.subnets.find(s=>s.id===request.subnetId),
      request.start,request.end,request.status,request.hostname,request.notes
    ).changes.map(change=>change.ip);
  });
  assert.deepEqual(previewIps,['10.64.20.20','10.64.20.21','10.64.20.22'],
    'Published bulk confirmation must show the selected address range');
  const bulkResponse=page.waitForResponse(res=>res.url().endsWith('/api/ipam/allocation/bulk'));
  await page.locator('[data-action="apply-bulk-ip-assignment"]').click();
  assert.equal((await bulkResponse).status(),200,'Bulk IPAM save request rejected');
  await persisted(page,s=>[20,21,22].every(n=>
    s.ipAllocations['10.64.20.'+n]?.status==='Reserved'),'Bulk IPAM reservation');
  assert.equal((await state(page)).ipAllocations['10.64.20.20'].notes,'Bulk notes');
  await page.reload();
  await page.locator('#main-content .caffoot-dashboard').waitFor();
  assert.equal((await state(page)).ipAllocations['10.64.20.15'].hostname,'spare-address');
  console.log('Published IPAM notes, independent reservation and bulk allocation saved and reloaded');

  await modal(page,'openManageLocationsModal');
  await page.locator('[data-action="rename-device-catalogue-entry"][data-kind="location"][data-name="Office"]').click();
  await page.locator('#device-catalogue-rename-value').fill('Workshop');
  await page.locator('[data-action="save-rename"][data-kind="location"]').click();
  await persisted(page,s=>s.devices.some(d=>d.id===device.id&&d.location==='Workshop'),'Location rename');
  await page.reload();
  await page.locator('#app .header-account').waitFor();
  assert.equal((await state(page)).devices.find(d=>d.id===device.id).location,'Workshop');
  await modal(page,'openManageLocationsModal');
  await page.locator('[data-action="delete-device-type-or-location"][data-kind="location"][data-name="Workshop"]').click();
  await page.locator('[data-action="confirm-delete"]').click();
  await persisted(page,s=>s.devices.some(d=>d.id===device.id&&d.location==='Unknown'),'Location delete');
  await page.waitForFunction(()=>document.getElementById('toast-message')?.textContent.includes('deleted.'));
  await page.evaluate(()=>closeModal(true));
  console.log('Dependent location rename/delete and reload passed');

  // Published rack placement and accessory forms persist through central SQLite.
  const rackId=(await state(page)).racks.find(r=>r.name==='Browser Rack').id;
  await modal(page,'openDeviceModal');
  await page.locator('#dev-name').fill('rack-switch');
  await page.locator('#dev-type').selectOption('Switch');
  await page.locator('#dev-mount-type').selectOption('Rack Mounted');
  await page.locator('#dev-location').selectOption('Unknown');
  await page.locator('#dev-rack-id').selectOption(rackId);
  await page.locator('#dev-rack-face').selectOption('front');
  await page.locator('#dev-rack-height').fill('1');
  await page.locator('#dev-rack-u').selectOption('5');
  await page.getByRole('tab',{name:'Networking'}).click();
  await page.locator('#dev-block').selectOption('__unassigned__');
  await page.locator('#dev-vlan').selectOption('17');
  await page.locator('#dev-subnet').selectOption(subnetId);
  await page.locator('#dev-ip').fill('10.64.20.11');
  await page.locator('form[data-device-form="true"] button[type="submit"]').click();
  const switchState=await persisted(page,s=>s.devices.some(d=>d.name==='rack-switch' &&
    d.rackId===rackId && Number(d.rackUStart)===5),'Rack-mounted device creation');
  const rackSwitch=switchState.devices.find(d=>d.name==='rack-switch');
  assert.equal(switchState.ipAllocations['10.64.20.11'].deviceId,rackSwitch.id);
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));
  await page.evaluate(({id,deviceId})=>openAssignDeviceModal(id,6,deviceId),{id:rackId,deviceId:rackSwitch.id});
  await page.locator('#assign-face').selectOption('front');
  await page.locator('#assign-u-start').selectOption('6');
  await page.locator('form[data-form-action="assign"] button[type="submit"]').click();
  await persisted(page,s=>s.devices.some(d=>d.id===rackSwitch.id && d.rackId===rackId &&
    Number(d.rackUStart)===6),'Rack device move');
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));
  await page.evaluate(id=>openRackAccessoryEditor(id,3),rackId);
  await page.locator('#rack-accessory-form [name="type"]').selectOption('patch');
  await page.locator('#rack-accessory-form [name="name"]').fill('Browser Patch Panel');
  await page.locator('#rack-accessory-form [name="portCount"]').selectOption('24');
  await page.locator('#rack-accessory-form [name="startU"]').selectOption('3');
  await page.locator('#rack-accessory-form button[type="submit"]').click();
  await persisted(page,s=>s.rackAccessories.some(a=>a.name==='Browser Patch Panel' &&
    a.rackId===rackId && Number(a.startU)===3),'Rack horizontal accessory');
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));
  await page.evaluate(id=>{
    selectedRackAccessoryType='pdu_vertical';
    openRackAccessoryEditor(id,1);
  },rackId);
  await page.locator('#rack-accessory-form [name="type"]').selectOption('pdu_vertical');
  await page.locator('#rack-accessory-form [name="name"]').fill('Browser Vertical PDU');
  await page.locator('#rack-accessory-form [name="side"]').selectOption('left');
  await page.locator('#rack-accessory-form [name="heightU"]').fill('5');
  await page.locator('#rack-accessory-form [name="heightU"]').blur();
  await page.locator('#rack-accessory-form [name="startU"]').selectOption('1');
  await page.locator('#rack-accessory-form button[type="submit"]').click();
  await persisted(page,s=>s.rackAccessories.some(a=>a.name==='Browser Vertical PDU' &&
    a.side==='left'&&a.type==='pdu_vertical'),'Rack vertical accessory');
  await page.reload();
  await page.locator('#app .header-account').waitFor();
  const rackSaved=await state(page);
  assert.equal(rackSaved.devices.find(d=>d.id===rackSwitch.id).rackId,rackId);
  assert.equal(rackSaved.rackAccessories.length,2);
  console.log('Rack device placement, patch panel and vertical PDU persisted after reload');

  // Preserve the front/rear rack view and its printable elevations.
  await page.locator('#sidebar [data-action="tab-racks"]').click();
  await page.locator('#main-content .approved-page-header [data-action="approved-rack-section"][data-section-tab="inventory"]').click();
  await page.locator('[data-action="v13-open-rack"][data-id="'+rackId+'"]').click();
  await page.locator('.rack-elevation [data-rack-device="'+rackSwitch.id+'"]').waitFor();
  await page.locator('[data-action="rack-face-rear"]').click();
  await page.waitForFunction(()=>document.querySelector('[data-action="rack-face-rear"]')?.getAttribute('aria-pressed')==='true',
    null,{timeout:5000});
  assert.equal(await page.locator('[data-action="rack-face-rear"]').getAttribute('aria-pressed'),'true');
  assert.ok(await page.locator('[aria-label="Side orientation as viewed from rear face"]').isVisible());
  assert.equal(await page.locator('.rack-elevation [data-rack-device]').count(),0,
    'A front-mounted switch must not appear on the rear face');
  await page.locator('[data-action="rack-face-front"]').click();
  await page.waitForFunction(()=>document.querySelector('[data-action="rack-face-front"]')?.getAttribute('aria-pressed')==='true',
    null,{timeout:5000});
  assert.equal(await page.locator('[data-action="rack-face-front"]').getAttribute('aria-pressed'),'true');
  await page.locator('.rack-elevation [data-rack-device="'+rackSwitch.id+'"]').waitFor();
  assert.ok(await page.locator('[aria-label="Side orientation as viewed from front face"]').isVisible());
  // Exercise the real print action, capturing its HTML without invoking the system print dialog.
  await page.evaluate(()=>{
    window.__rackPrintMarkup='';
    window.__rackOriginalOpen=window.open;
    window.open=()=>({document:{open(){},write(html){window.__rackPrintMarkup=html;},close(){}},
      focus(){},print(){}});
  });
  let rackPrintMarkup='';
  try{
    await page.locator('[data-action="print-rack-capacity-details"]').click();
    rackPrintMarkup=await page.evaluate(()=>window.__rackPrintMarkup);
  }finally{
    await page.evaluate(()=>{
      window.open=window.__rackOriginalOpen;
      delete window.__rackOriginalOpen;
      delete window.__rackPrintMarkup;
    });
  }
  for(const label of ['Front elevation','Rear elevation','Vertical rail accessories (0U)',
                      'rack-switch','Browser Patch Panel','Browser Vertical PDU']){
    assert.ok(rackPrintMarkup.includes(label),'Rack print view is missing '+label);
  }
  console.log('Rack front/rear view, L/R markers and printable elevations passed');

  // The VM form must use an eligible physical hypervisor, not a separate rack position.
  await page.locator('#sidebar [data-action="tab-devices"]').click();
  await modal(page,'openDeviceModal');
  await page.locator('#dev-name').fill('browser-hypervisor');
  await page.locator('#dev-type').selectOption('Server - Physical');
  await page.locator('#dev-mount-type').selectOption('Tower / Floor Standing');
  await page.locator('#dev-location').selectOption('Unknown');
  await page.locator('#device-hosting-enabled').check();
  await page.locator('#host-platform-select').selectOption('Proxmox VE');
  await page.getByRole('tab',{name:'Networking'}).click();
  await page.locator('#dev-block').selectOption('__unassigned__');
  await page.locator('#dev-vlan').selectOption('17');
  await page.locator('#dev-subnet').selectOption(subnetId);
  await page.locator('#dev-ip').fill('10.64.20.12');
  await page.locator('form[data-device-form="true"] button[type="submit"]').click();
  const hostState=await persisted(page,s=>s.devices.some(d=>d.name==='browser-hypervisor' &&
    d.typeDetails?.serverService_Hypervisor===true),'Physical hypervisor');
  const hypervisor=hostState.devices.find(d=>d.name==='browser-hypervisor');
  assert.equal(hypervisor.typeDetails.hypervisorProduct,'Proxmox VE');
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));
  await modal(page,'openDeviceModal');
  await page.locator('#dev-name').fill('browser-vm');
  await page.locator('#dev-deployment').selectOption('virtual');
  await page.locator('#dev-vm-purpose').selectOption('Server - Virtual');
  await page.locator('#dev-virtual-host').selectOption(hypervisor.id);
  assert.ok(await page.locator('#device-form-tab-hardware').isHidden(),
    'VMs must not offer the physical Hardware tab');
  assert.ok(await page.locator('#device-form-mounting-options').isHidden(),
    'VMs must not offer independent rack placement');
  await page.getByRole('tab',{name:'Networking'}).click();
  await page.locator('#dev-block').selectOption('__unassigned__');
  await page.locator('#dev-vlan').selectOption('17');
  await page.locator('#dev-subnet').selectOption(subnetId);
  await page.locator('#dev-ip').fill('10.64.20.13');
  await page.locator('form[data-device-form="true"] button[type="submit"]').click();
  const vmState=await persisted(page,s=>s.devices.some(d=>d.name==='browser-vm' &&
    d.virtualHostId===hypervisor.id),'Hosted virtual machine');
  const vm=vmState.devices.find(d=>d.name==='browser-vm');
  assert.equal(vm.virtualPlatform,'Proxmox VE');
  assert.equal(vm.location,hypervisor.location);
  assert.equal(vm.mountType,'Not Applicable');
  assert.ok(!vm.rackId,'Physical rack placement must be owned by the hypervisor');
  console.log('Physical hypervisor selection and VM inheritance passed');

  // Approved acceptance: new accounts initially lack inventory access.
  await page.evaluate(()=>switchTab('users'));
  await page.locator('#main-content .approved-page-header [data-action="approved-users-section"][data-tab="add"]').click();
  await page.locator('#next-user-create-form input[name="username"]').fill('editor');
  await page.locator('#next-user-create-form input[name="password"]').fill(password+'-Editor');
  await page.locator('#next-user-create-form input[name="firstName"]').fill('Taylor');
  await page.locator('#next-user-create-form input[name="lastName"]').fill('Example');
  await page.locator('#next-user-create-form input[name="displayName"]').fill('Taylor E');
  await page.locator('#next-user-create-form input[name="email"]').fill('taylor@example.test');
  await page.locator('#next-user-create-form button[type="submit"]').click();
  await page.waitForFunction(()=>[...document.querySelectorAll('#main-content h3')]
    .some(h=>h.textContent.trim()==='editor'));
  assert.equal(await page.locator('#main-content .approved-page-header [data-action="approved-users-section"][data-tab="list"]').getAttribute('aria-selected'),'true');
  await page.locator('#main-content .approved-page-header [data-action="approved-users-section"][data-tab="overview"]').click();
  await page.getByText('Accounts by role',{exact:true}).waitFor();
  assert.equal(await page.locator('#main-content .users-live .statnum').nth(0).textContent(),'2');
  assert.equal(await page.locator('#main-content .users-live .statnum').nth(1).textContent(),'1');
  await page.locator('#main-content .approved-page-header [data-action="approved-users-section"][data-tab="list"]').click();
  const editorId=await page.evaluate(async()=>{
    const r=await fetch('/api/users',{cache:'no-store'});
    if(!r.ok)throw Error('Unable to read users');
    return (await r.json()).users.find(user=>user.username==='editor')?.id;
  });
  assert.ok(Number.isInteger(editorId),'User not saved to SQLite');
  const editorProfile=await page.evaluate(async id=>{
    const r=await fetch('/api/users',{cache:'no-store'});
    return (await r.json()).users.find(u=>u.id===id)?.profile;
  },editorId);
  assert.equal(editorProfile.displayName,'Taylor E','Optional details must persist with a newly created user');
  assert.equal(editorProfile.email,'taylor@example.test');
  assert.equal(editorProfile.emailVerified,false,'Adding an email must not mark it as verified');
  const second=await browser.newContext({
    ignoreHTTPSErrors:true,viewport:{width:1440,height:950}
  });
  const editor=await second.newPage();
  editor.setDefaultTimeout(12000);
  await editor.goto(address+'/setup');
  await editor.locator('#username').fill('editor');
  await editor.locator('#password').fill(password+'-Editor');
  await editor.locator('#submit').click();
  await editor.locator('#signed-in:not([hidden])').waitFor();
  assert.ok(editor.url().endsWith('/setup'),'Users without inventory access must remain on account page');
  assert.equal((await second.request.get(address+'/inventory')).status(),403,
    'Newly created user must have no access');
  await editor.locator('#mfa-panel:not([hidden])').waitFor();
  await editor.locator('#mfa-password').fill(password+'-Editor');
  await editor.locator('#start-mfa button[type="submit"]').click();
  await editor.locator('#confirm-mfa:not([hidden])').waitFor();
  const editorSecret=(await editor.locator('#user-mfa-secret').textContent()).trim();
  assert.ok(editorSecret.length>=16,'Editor MFA secret missing');
  await editor.waitForFunction(()=>{
    const img=document.querySelector('#user-mfa-qr img');
    return img && img.complete && img.naturalWidth>0;
  });
  await editor.locator('#user-mfa-code').fill(mfaCode(editorSecret));
  await editor.locator('#confirm-mfa button[type="submit"]').click();
  await editor.waitForFunction(()=>document.querySelector('#signed-in')?.hidden===true);

  await page.locator('#main-content [data-action="users-open-editor"][data-user-id="'+editorId+'"]').click();
  await page.locator('#main-content .users-management-modal').waitFor();
  await page.locator('#next-user-profile-form input[name="displayName"]').fill('Taylor Updated');
  await page.locator('#next-user-profile-form button[type="submit"]').click();
  await page.waitForFunction(async id=>{
    const r=await fetch('/api/users',{cache:'no-store'});
    return r.ok && (await r.json()).users.find(u=>u.id===id)?.profile.displayName==='Taylor Updated';
  },editorId);
  await page.locator('[data-next-user-permission][data-user-id="'+editorId+'"][data-section="Devices"]').selectOption('edit');
  await page.locator('[data-next-user-permission][data-user-id="'+editorId+'"][data-section="IPAM"]').selectOption('read');
  await page.locator('[data-next-user-permission][data-user-id="'+editorId+'"][data-section="Racks"]').selectOption('read');
  await page.waitForFunction(async id=>{
    const r=await fetch('/api/users',{cache:'no-store'});
    return r.ok && (await r.json()).users.find(user=>user.id===id)?.permissions.Devices==='edit';
  },editorId);
  await page.locator('#main-content .users-management-modal [data-action="users-close-editor"]').first().click();
  assert.equal(await page.locator('#main-content .users-management-modal').count(),0,
    'Closing the approved Manage dialog must return to the User List');
  await editor.locator('#username').fill('editor');
  await editor.locator('#password').fill(password+'-Editor');
  assert.ok(await editor.locator('#code-field').evaluate(el=>el.hidden));
  await editor.locator('#submit').click();
  await editor.locator('#code-field:not([hidden])').waitFor();
  await editor.locator('#code').fill(mfaCode(editorSecret));
  await editor.waitForURL('**/inventory');
  await editor.locator('#app .header-account').waitFor();
  await editor.waitForFunction(()=>document.querySelector('#page-title')?.textContent==='Dashboard Overview');
  assert.equal(await editor.locator('#next-dashboard-mfa-notice').count(),0,
    'Enrolled editors must not see MFA setup guidance');
  await editor.evaluate(()=>{appState.devices.push({...appState.devices[0]});renderContent();});
  assert.equal(await editor.locator('#next-dashboard-inventory-health').count(),0,
    'Non-administrator editor must not see inventory health warnings');
  await editor.locator('[data-dashboard-tab="activity"]').click();
  assert.equal(await editor.getByText('Integrity issues',{exact:true}).count(),0,
    'Non-administrator editor must not see integrity health totals');
  await editor.evaluate(()=>{appState.devices.pop();renderContent();});
  await editor.locator('#app .header-account').click();
  await editor.locator('#personal-details-form').waitFor();
  await editor.locator('[data-action="select-account-section"][data-section="security"]').first().click();
  await editor.locator('#next-account-password-form').waitFor();
  assert.equal(await editor.locator('#page-title').textContent(),'My account');
  await editor.locator('[data-action="tab-devices"]').click();
  assert.ok((await state(editor)).devices.some(d=>d.id===device.id),
    'Second authenticated browser must see the shared device');
  assert.ok(await editor.locator('#next-users-nav').evaluate(el=>el.classList.contains('hidden')),
    'Users management must be administrator-only');
  assert.ok(await editor.locator('#next-settings-nav').evaluate(el=>el.classList.contains('hidden')),
    'Settings & Data must be administrator-only');
  await editor.locator('#sidebar [data-action="tab-ipam"]').click();
  assert.ok(await editor.locator('#main-content .approved-page-header [data-action="open-subnet-modal"]').isHidden());
  await editor.locator('#sidebar [data-action="tab-racks"]').click();
  assert.ok(await editor.locator('#main-content .approved-page-header [data-action="open-rack-modal"]').isHidden());
  await editor.locator('#sidebar [data-action="tab-devices"]').click();
  console.log('Mixed editing and read-only section visibility passed');
  console.log('User creation, initially no access, editor MFA, permissions and shared viewing passed');

  // A second browser must read fresh SQLite inventory on navigation and on opening a record.
  await page.evaluate(()=>openIpModal('10.64.20.15'));
  await page.locator('#ip-notes').fill('Remote note after editor sign-in');
  await page.locator('form[data-form-action="ip"] button[type="submit"]').click();
  await persisted(page,s=>s.ipAllocations['10.64.20.15']?.notes==='Remote note after editor sign-in',
                  'Remote IP note');
  await editor.locator('#sidebar [data-action="tab-ipam"]').click();
  await editor.waitForFunction(()=>appState.ipAllocations['10.64.20.15']?.notes==='Remote note after editor sign-in');
  await editor.locator('#main-content .approved-page-header [data-action="approved-ipam-section"][data-view="addresses"]').click();
  await editor.locator('[data-action="open-ip"][data-ip="10.64.20.15"]').waitFor();
  await page.evaluate(()=>openIpModal('10.64.20.15'));
  await page.locator('#ip-notes').fill('Newer remote IP note');
  await page.locator('form[data-form-action="ip"] button[type="submit"]').click();
  await persisted(page,s=>s.ipAllocations['10.64.20.15']?.notes==='Newer remote IP note',
                  'Newer remote IP note');
  await editor.locator('[data-action="open-ip"][data-ip="10.64.20.15"]').click();
  await editor.locator('#ip-notes').waitFor();
  assert.equal(await editor.locator('#ip-notes').inputValue(),'Newer remote IP note',
    'Opening an IP after another user saves must not show stale notes');
  await editor.evaluate(()=>closeModal(true));
  console.log('Multi-user IPAM navigation and record-opening freshness passed');

  // Simple exclusive reservation across two simultaneous browsers.
  const ownerStarted=page.waitForResponse(res=>res.url().endsWith('/api/devices/edit/start'));
  await page.evaluate(id=>openDeviceModal(id),device.id);
  assert.equal((await ownerStarted).status(),200);
  await page.locator('#dev-name').waitFor();
  const competing=editor.waitForResponse(res=>res.url().endsWith('/api/devices/edit/start'));
  await editor.evaluate(id=>openDeviceModal(id),device.id);
  assert.notEqual((await competing).status(),200,
    'A second user must not reserve the same device');
  assert.ok((await state(editor)).devices.some(d=>d.id===device.id),
    'A competing edit must not prevent inventory viewing');

  const ownerCancelled=page.waitForResponse(res=>res.url().endsWith('/api/devices/edit/cancel'));
  await page.evaluate(()=>closeModal(true));
  assert.equal((await ownerCancelled).status(),200);
  const editorStarted=editor.waitForResponse(res=>res.url().endsWith('/api/devices/edit/start'));
  await editor.evaluate(id=>openDeviceModal(id),device.id);
  assert.equal((await editorStarted).status(),200,
    'The device must be editable after the first user cancels');
  await editor.locator('#dev-name').waitFor();
  const editorCancelled=editor.waitForResponse(res=>res.url().endsWith('/api/devices/edit/cancel'));
  await editor.evaluate(()=>closeModal(true));
  assert.equal((await editorCancelled).status(),200);
  await second.close();
  console.log('Two-user exclusive device edit reservations passed');
  // Read-only account must be able to sign in without MFA.
  await page.evaluate(()=>switchTab('users'));
  await page.locator('#main-content .approved-page-header [data-action="approved-users-section"][data-tab="add"]').click();
  await page.locator('#next-user-create-form input[name="username"]').fill('viewer');
  await page.locator('#next-user-create-form input[name="password"]').fill(password+'-Viewer');
  await page.locator('#next-user-create-form button[type="submit"]').click();
  await page.waitForFunction(()=>[...document.querySelectorAll('#main-content h3')].some(node=>node.textContent.trim()==='viewer'));
  const viewerId=await page.evaluate(async()=>{
    const r=await fetch('/api/users');
    return (await r.json()).users.find(u=>u.username==='viewer')?.id;
  });
  assert.ok(Number.isInteger(viewerId));
  await page.locator('#main-content [data-action="users-open-editor"][data-user-id="'+viewerId+'"]').click();
  await page.locator('#main-content .users-management-modal').waitFor();
  const blockedEdit=page.locator('[data-next-user-permission][data-user-id="'+viewerId+'"][data-section="Devices"]');
  await blockedEdit.selectOption('edit');
  await page.waitForFunction(()=>document.querySelector('#toast-message')?.textContent.includes('must set up MFA in My account'));
  await page.waitForFunction(id=>document.querySelector('[data-next-user-permission][data-user-id="'+id+'"][data-section="Devices"]')?.value==='',viewerId);
  assert.equal(await page.evaluate(async id=>{
    const user=(await (await fetch('/api/users')).json()).users.find(u=>u.id===id);
    return user?.permissions?.Devices||null;
  },viewerId),null,'Unenrolled users must not receive Edit permissions');
  for(const section of ['Devices','IPAM','Racks'])
    await page.locator('[data-next-user-permission][data-user-id="'+viewerId+'"][data-section="'+section+'"]').selectOption('read');
  await page.waitForFunction(async id=>{
    const user=(await (await fetch('/api/users')).json()).users.find(u=>u.id===id);
    return ['Devices','IPAM','Racks'].every(key=>user?.permissions[key]==='read');
  },viewerId);
  await page.locator('#main-content .users-management-modal [data-action="users-close-editor"]').first().click();
  const readContext=await browser.newContext({ignoreHTTPSErrors:true});
  const viewer=await readContext.newPage();
  await viewer.goto(address+'/setup');
  await viewer.locator('#username').fill('viewer');
  await viewer.locator('#password').fill(password+'-Viewer');
  assert.ok(await viewer.locator('#code-field').evaluate(e=>e.hidden));
  await viewer.locator('#submit').click();
  await viewer.waitForURL('**/inventory');
  await viewer.locator('#next-dashboard-mfa-notice').waitFor();
  await viewer.locator('#next-dashboard-mfa-notice [data-action="select-account-section"]').click();
  assert.equal(await viewer.locator('#page-title').textContent(),'My account');
  await viewer.locator('#next-account-mfa-start').waitFor();
  await viewer.locator('#sidebar [data-action="tab-dashboard"]').click();
  await viewer.locator('#next-dashboard-mfa-notice').waitFor();
  await viewer.evaluate(()=>{appState.devices.push({...appState.devices[0]});renderContent();});
  assert.equal(await viewer.locator('#next-dashboard-inventory-health').count(),0,
    'Read-only viewer must not see inventory health warnings');
  await viewer.evaluate(()=>{appState.devices.pop();renderContent();});
  assert.ok(await viewer.locator('#next-settings-nav').isHidden());
  assert.ok(await viewer.locator('#next-users-nav').isHidden());
  await viewer.locator('#sidebar [data-action="tab-devices"]').click();
  assert.ok(await viewer.locator('#main-content .approved-page-header [data-action="open-device-modal"]').isHidden());
  await viewer.evaluate(()=>openDeviceModal());
  assert.ok(await viewer.locator('#modal-container').evaluate(el=>el.classList.contains('hidden')),
    'Read-only users must not be able to open the Device editor');
  await viewer.locator('#sidebar [data-action="tab-ipam"]').click();
  assert.ok(await viewer.locator('#main-content .approved-page-header [data-action="open-subnet-modal"]').isHidden());
  await viewer.locator('#sidebar [data-action="tab-racks"]').click();
  assert.ok(await viewer.locator('#main-content .approved-page-header [data-action="open-rack-modal"]').isHidden());
  await viewer.locator('#app .header-account').click();
  await viewer.locator('#personal-details-form').waitFor();
  assert.equal(await viewer.locator('.approved-account .appearance-buttons [data-theme]').count(),3,
    'All signed-in users must retain the approved appearance controls on Account Overview');
  for(const tab of ['help','about']){
    await viewer.locator('[data-action="select-account-section"][data-section="'+tab+'"]').first().click();
    assert.equal(await viewer.locator('.approved-account .subnav [data-section="'+tab+'"]').getAttribute('aria-selected'),'true');
  }
  const denied=await viewer.evaluate(async()=>{
    const session=await (await fetch('/api/session')).json();
    const result=await fetch('/api/inventory/reset',{method:'POST',headers:{
      'Content-Type':'application/json','X-CSRF-Token':session.csrf_token
    },body:JSON.stringify({confirmed:true})});
    return result.status;
  });
  assert.equal(denied,403,'System maintenance must require administrator access');
  await readContext.close();
  console.log('Password-only read access, hidden editing controls and administrator-only maintenance passed');

  await page.evaluate(()=>switchTab('settings'));
  await page.locator('.approved-settings .subnav [data-tab="maintenance"]').click();
  await page.locator('[data-action="clear-inventory-data"]').waitFor();
  page.once('dialog',d=>d.accept());
  await page.locator('[data-action="clear-inventory-data"]').click();
  await persisted(page,s=>!s.devices.length&&!s.subnets.length&&!s.racks.length,'Clean Start');
  await page.reload();
  const clean=await state(page);
  assert.equal(clean.devices.length,0);
  assert.deepEqual(clean.settings.deviceLocations,['Unknown']);
  assert.equal(clean.changeHistory.at(-1).reason,'Clean inventory reset');
  console.log('Confirmed Clean Start persisted with central Change History');

  // Generate the backup with the unchanged published v1.3.3 exporter itself.
  const v133Source=spawnSync('git',['show','v1.3.3:app/caffoot-lite.html'],{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024});
  if(v133Source.status!==0)throw Error('Published v1.3.3 source unavailable: '+v133Source.stderr);
  const publishedFile=path.join(tmp,'caffoot-lite-v1.3.3.html');
  fs.writeFileSync(publishedFile,v133Source.stdout);
  const published=await context.newPage();
  await published.goto('file://'+publishedFile);
  const v133={
    subnets:[{id:'legacy-subnet',name:'Office',cidr:'10.0.0.0/24',
              gateway:'10.0.0.1',vlan:20}],
    vlans:[{id:'legacy-vlan',name:'Office',vlanId:20}],
    racks:[],rackAccessories:[],
    devices:[{id:'legacy-device',name:'legacy-pc',type:'Desktop',
              mountType:'Desktop',location:'Office',primaryIp:'10.0.0.10',
              assetTag:'ASSET-204',notes:'Preserve this published device note'}],
    ipAllocations:{'10.0.0.10':{status:'Assigned',deviceId:'legacy-device',
                                 notes:'Preserve this IPAM note'}},
    deviceTypes:['Desktop','Unknown'],deviceLocations:['Unknown','Office'],
    historicalSetting:{keep:[1,2,3]}
  };
  const exported=await published.evaluate(source=>{
    if(typeof createInventoryBackup!=='function')
      throw Error('Published v1.3.3 backup exporter is unavailable');
    return createInventoryBackup(source);
  },v133);
  await published.close();
  assert.equal(exported.caffootBackup.appVersion,'1.3.3');
  const file={name:'caffoot_lite_backup_v1.3.3.json',
    mimeType:'application/json',buffer:Buffer.from(JSON.stringify(exported))};
  await page.evaluate(()=>switchTab('settings'));
  await page.locator('.approved-settings .subnav [data-tab="data"]').click();
  async function chooseBackup(){
    assert.equal(await page.locator('[data-action="next-import-pick"]').isEnabled(),true,
      'Authorised import button must remain usable');
    const chooser=page.waitForEvent('filechooser');
    await page.locator('[data-action="next-import-pick"]').click();
    await (await chooser).setFiles(file);
    await page.getByRole('heading',{name:'Import Inventory from v1.3.3'}).waitFor();
    await page.getByText('Review the complete inventory replacement',{exact:false}).waitFor();
  }
  await chooseBackup();
  // Cancel must not mutate central inventory.
  const cancelledImport=page.waitForResponse(res=>res.url().endsWith('/api/import/cancel'));
  await page.locator('[data-next-import-action="cancel"]').click();
  assert.equal((await cancelledImport).status(),200);
  assert.equal((await state(page)).devices.length,0);
  await chooseBackup();
  const confirmation=page.locator('#next-import-replace-approval');
  await confirmation.check();
  await page.locator('[data-next-import-action="confirm"]').click();
  const imported=await persisted(page,s=>s.devices.some(d=>d.id==='legacy-device'),'v1.3.3 import');
  const legacy=imported.devices.find(d=>d.id==='legacy-device');
  assert.equal(legacy.assetTag,'ASSET-204');
  assert.equal(legacy.notes,'Preserve this published device note');
  assert.equal(imported.ipAllocations['10.0.0.10'].notes,'Preserve this IPAM note');
  assert.deepEqual(imported.settings.historicalSetting,{keep:[1,2,3]});
  assert.equal(imported.subnets[0].id,'legacy-subnet');
  const accountNames=await page.evaluate(async()=>{
    const response=await fetch('/api/users',{cache:'no-store'});
    if(!response.ok)throw Error('Users cannot be read after import');
    return (await response.json()).users.map(x=>x.username);
  });
  assert.ok(accountNames.includes('owner')&&accountNames.includes('editor'),
    'Import must preserve users and their account settings');
  await page.reload();
  assert.equal((await state(page)).devices[0].id,'legacy-device');
  console.log('Published v1.3.3 export, cancelled review, confirmed one-way import, history fields and account retention passed');
  assert.deepEqual(errors,[],'Browser JavaScript errors');
}
run().then(async()=>{
  console.log('PASS: Caffoot Lite focused Chromium compatibility');
  await browser?.close();server?.kill('SIGTERM');
  fs.rmSync(tmp,{recursive:true,force:true});
  if(linkCreated)fs.rmSync(temporaryAssetLink);
}).catch(async e=>{
  console.error('FAIL: '+(e.stack||e));
  if(fs.existsSync(logfile))console.error('Server log:\n'+fs.readFileSync(logfile,'utf8').slice(-13000));
  await browser?.close().catch(()=>{});
  server?.kill('SIGTERM');
  if(linkCreated)fs.rmSync(temporaryAssetLink,{force:true});
  process.exitCode=1;
});
