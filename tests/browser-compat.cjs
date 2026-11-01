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
  await page.locator('.brand-header img[src="/assets/caffoot-icon-1024.png"]').waitFor();
  assert.equal(await page.locator('.brand-tagline').textContent(),'Infrastructure, Simplified.');
  assert.ok((await page.locator('main').evaluate(el=>getComputedStyle(el).fontFamily)).includes('Inter'),
    'First-run setup must use the approved Inter font stack');
  await page.setViewportSize({width:375,height:812});
  assert.ok(await page.locator('main').evaluate(el=>{
    const rect=el.getBoundingClientRect();
    return rect.left>=0 && rect.right<=window.innerWidth;
  }),'Branded setup panel must fit a narrow screen');
  await page.setViewportSize({width:1440,height:950});
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
  assert.equal(await page.title(),'Caffoot Lite — Infrastructure, Simplified.','Inventory browser tab must use Caffoot branding');
  await page.locator('#next-account-nav').waitFor();
  // Verify the approved computed typeface with the locally served Tailwind preflight.
  assert.ok((await page.locator('html').evaluate(el=>getComputedStyle(el).fontFamily)).includes('Inter'),
    'Inventory, Users, Settings and My account must inherit Inter typography');
  await page.waitForFunction(()=>document.querySelector('#page-title')?.textContent==='Dashboard Overview');
  for(const selector of ['#sidebar','#page-title','#main-content']){
    assert.ok((await page.locator(selector).evaluate(el=>getComputedStyle(el).fontFamily)).includes('Inter'),
      'Branded inventory typography should apply to '+selector);
  }
  // v2.1: the approved sidebar collapses without changing account or inventory state.
  const sidebarToggle=page.locator('#v21-sidebar-toggle');
  assert.ok(await sidebarToggle.isVisible(),'Premium sidebar must have a bottom collapse control');
  assert.equal(await sidebarToggle.getAttribute('aria-expanded'),'true');
  assert.equal(await page.locator('.v21-brand-tagline').textContent(),'Infrastructure, Simplified.');
  assert.ok(await page.locator('.v21-wordmark-lite').isVisible(),
    'Approved navy/orange Caffoot Lite wordmark must be visible');
  await sidebarToggle.click();
  assert.equal(await sidebarToggle.getAttribute('aria-expanded'),'false');
  assert.ok(await page.locator('#sidebar').evaluate(el=>el.classList.contains('v21-is-collapsed')));
  assert.equal(await page.locator('#sidebar [data-action="tab-ipam"]').getAttribute('aria-label'),'IPAM',
    'Collapsed navigation must keep accessible labels');
  assert.ok(await page.locator('#sidebar [data-action="tab-ipam"]').isVisible(),
    'Collapsed navigation must retain primary actions');
  assert.ok(!(await page.locator('#ipam-sidebar-actions').isVisible()),
    'Collapsed sidebar must conceal secondary actions without deleting them');
  await page.locator('#sidebar [data-action="tab-ipam"]').click();
  await page.waitForFunction(()=>document.querySelector('#page-title')?.textContent==='IP Address Management, Subnets & VLANs');
  await page.reload();
  await sidebarToggle.waitFor();
  assert.equal(await sidebarToggle.getAttribute('aria-expanded'),'false',
    'Sidebar choice must survive reload');
  await page.waitForFunction(()=>document.querySelector('#page-title')?.textContent==='Dashboard Overview');
  await sidebarToggle.click();
  assert.equal(await sidebarToggle.getAttribute('aria-expanded'),'true',
    'Expanded navigation must be available on demand');
  await page.setViewportSize({width:390,height:812});
  await sidebarToggle.click(); // Compact view gives the main content usable width.
  await page.waitForFunction(()=>document.getElementById('sidebar')?.getBoundingClientRect().width<=80);
  assert.ok(await page.locator('#sidebar').evaluate(el=>el.classList.contains('v21-is-collapsed')),
    'Compact navigation must fit a narrow viewport once its width transition finishes');
  await sidebarToggle.click(); // Expanded mobile menu overlays instead of squeezing the page.
  assert.equal(await page.locator('#sidebar').evaluate(el=>getComputedStyle(el).position),'absolute');
  await page.keyboard.press('Escape');
  assert.equal(await sidebarToggle.getAttribute('aria-expanded'),'false',
    'Escape should dismiss expanded navigation on small screens');
  await page.setViewportSize({width:1440,height:950});
  await sidebarToggle.click();
  assert.equal(await sidebarToggle.getAttribute('aria-expanded'),'true');
  console.log('v2.1 premium sidebar branding, collapse, persistence, keyboard and mobile navigation passed');
  // v2.1 shared shell: clear breadcrumb, authenticated account shortcut and safe responsive layout.
  const shellHeader=page.locator('#app > main > .v21-shell-header');
  assert.ok(await shellHeader.isVisible(),'Premium shared header should be present');
  assert.equal(await shellHeader.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 255, 255)',
    'Light theme must use the approved light header, not the legacy navy top bar');
  assert.equal(await page.locator('.v21-header-product').textContent(),'Caffoot Lite');
  assert.equal(await page.locator('.v21-header-page').textContent(),'Dashboard Overview');
  assert.equal(await page.locator('#v21-header-username').textContent(),'owner',
    'The top account shortcut must show the authenticated username, not a fabricated display name');
  assert.equal(await page.locator('#v21-header-avatar').textContent(),'O',
    'The round account avatar must have a usable fallback initial');
  assert.equal(await page.locator('#sidebar [data-action="tab-dashboard"]').getAttribute('aria-current'),'page',
    'The active page must be announced in the sidebar');
  await page.locator('#v21-account-shortcut').click();
  await page.waitForFunction(()=>document.querySelector('#page-title')?.textContent==='My account');
  assert.equal(await page.locator('#sidebar [data-action="tab-account"]').getAttribute('aria-current'),'page');
  assert.equal(await page.locator('#sidebar [data-action="tab-dashboard"]').getAttribute('aria-current'),null);
  await page.locator('#sidebar [data-action="tab-dashboard"]').click();
  await page.waitForFunction(()=>document.querySelector('#page-title')?.textContent==='Dashboard Overview');
  assert.ok(await page.locator('.v21-skip-link').count(),
    'Keyboard users must have a Skip to main content link');
  assert.equal(await page.locator('#main-content').getAttribute('tabindex'),'-1',
    'Skip link target must accept keyboard focus');
  await page.setViewportSize({width:390,height:812});
  assert.ok(await shellHeader.evaluate(el=>{
    const bounds=el.getBoundingClientRect();
    return bounds.left>=0 && bounds.right<=innerWidth && el.scrollWidth<=el.clientWidth+1;
  }),'Header must fit the mobile viewport without horizontal overflow');
  await page.setViewportSize({width:1440,height:950});
  console.log('v2.1 light premium page header, account shortcut, active navigation and mobile layout passed');

  // v2.1 Stage 3: empty welcome, retained Dashboard tabs, actions and reports.
  assert.ok(await page.locator("#v21-dashboard-empty").isVisible());
  assert.ok(await page.getByRole("heading",{name:"Infrastructure Overview"}).isVisible());
  assert.equal(await page.locator(".dashboard-stats .dashboard-stat").count(),4);
  assert.ok((await page.locator(".dashboard-stats .dashboard-stat p.text-3xl").allTextContents()).every(v=>v.trim()==="0"));
  assert.ok(await page.locator(".v21-dashboard-quick [data-action=\"open-device-modal\"]").isVisible());
  assert.ok(await page.locator(".v21-dashboard-quick [data-action=\"open-rack-modal\"]").isVisible());
  await page.locator('[data-dashboard-tab="insights"]').click();
  // Dashboard navigation deliberately refreshes saved SQLite state before switching.
  await page.locator("#dashboard-panel-insights").waitFor({state:"visible"});
  assert.equal(await page.locator("#dashboard-tab-insights").getAttribute("aria-selected"),"true");
  assert.ok(await page.getByText("Rack Capacity By Face").isVisible());
  await page.locator('[data-dashboard-tab="activity"]').click();
  await page.locator("#dashboard-panel-activity").waitFor({state:"visible"});
  assert.ok(await page.getByRole("heading",{name:/Reports & exports/i}).isVisible());
  await page.locator('[data-dashboard-tab="overview"]').click();
  await page.setViewportSize({width:390,height:812});
  await sidebarToggle.click();
  await page.waitForFunction(()=>document.getElementById("sidebar")?.getBoundingClientRect().width<=80);
  assert.ok(await page.locator(".v21-dashboard").evaluate(el=>el.getBoundingClientRect().right<=innerWidth+2 && el.scrollWidth<=el.clientWidth+2),
    "Dashboard must fit a narrow browser without clipping content");
  await page.setViewportSize({width:1440,height:950});
  await sidebarToggle.click();
  console.log("v2.1 premium Dashboard empty state, sections and mobile layout passed");
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
  assert.equal(await page.locator('.settings-tabs').count(),0,
    'Single Settings subsection must not show a redundant full-width tab');
  assert.ok(await page.getByRole('heading',{name:'Import Inventory',exact:true}).isVisible(),
    'Import Inventory section heading must remain');
  assert.ok(await page.locator('[data-action="next-import-pick"]').isEnabled(),
    'Administrator legacy migration picker must remain');
  assert.ok(await page.locator('[data-action="clear-inventory-data"]').isEnabled(),
    'Administrator Clear System safeguard must remain');
  const safetyResult=new Promise(resolve=>page.once('dialog',async dialog=>{
    const message=dialog.message();await dialog.accept();resolve(message);
  }));
  await page.locator('[data-action="check-inventory-safety"]').click();
  assert.match(await safetyResult,/INVENTORY SAFETY CHECK PASSED/,
    'Manual safety check must still reload and validate central inventory');
  await page.locator('#sidebar [data-action="tab-audit"]').click();
  await page.waitForFunction(()=>document.querySelector('#page-title')?.textContent==='Change History & Data Safety');
  assert.ok(await page.locator('#main-content > div.w-full').isVisible(),
    'Change History should fill the inventory workspace');
  await page.locator('#sidebar [data-action="tab-users"]').click();
  await page.getByRole('heading',{name:'User Management Overview'}).waitFor();
  assert.ok(await page.locator('#main-content > div.w-full').isVisible(),
    'Users overview should fill the inventory workspace');
  await page.getByText('Total users',{exact:true}).waitFor();
  await page.getByRole('heading',{name:'Administrators',exact:true}).waitFor();
  await page.getByText('Users by role',{exact:true}).waitFor();
  await page.getByText('MFA enrolment',{exact:true}).waitFor();
  assert.ok(await page.locator('#users-sidebar-actions').isVisible());
  assert.equal(await page.locator('#next-account-password-form').count(),0,
    'User Management must not contain personal account settings');
  await page.locator('#sidebar #next-account-nav').click();
  assert.equal(await page.locator('#page-title').textContent(),'My account');
  await page.locator('#next-account-password-form').waitFor();
  for(const [area,selector] of [['preferences','.theme-choice'],['help','.settings-help-topic'],['about','.settings-about']]){
    await page.locator('[data-action="select-account-section"][data-section="'+area+'"]').click();
    await page.locator(selector).first().waitFor();
    if(area==='help'){
      const links=page.locator('.settings-help-topic a[href*="/Features%20and%20Instructions/"]');
      assert.equal(await links.count(),8,'Existing help topics should link to the verified full guides');
      for(const link of await links.all()){
        assert.equal(await link.getAttribute('target'),'_blank');
        assert.match(await link.getAttribute('rel'),/noopener/);
      }
      assert.equal(await page.locator('.settings-help-topic').count(),6,'Built-in help topics must remain');
    }
    if(area==='about'){
      assert.ok(await page.getByText('Caffoot Lite v2.0.1',{exact:true}).isVisible(), 'About must identify the approved release version');
      assert.equal(await page.getByRole('link',{name:/User Guide/}).getAttribute('href'),
        'https://github.com/Caffoot/Caffoot-Lite/blob/main/docs/How%20To%27s/Features%20and%20Instructions/README.md');
      assert.equal(await page.getByRole('link',{name:/Installation Guide/}).getAttribute('href'),
        'https://github.com/Caffoot/Caffoot-Lite/blob/main/INSTALLATION.md');
    }
  }
  await page.locator('[data-action="select-account-section"][data-section="security"]').click();
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


  // v2.1 Stage 4: directory selection is read-only; existing table stays available.
  await page.locator('#sidebar [data-action="tab-devices"]').click();
  await page.locator('.v21-directory-split').waitFor({state:'visible'});
  assert.ok(await page.getByRole('heading',{name:'Device Directory'}).isVisible());
  assert.ok(await page.locator('#v21-directory-preview').getByText('browser-device',{exact:true}).isVisible());
  assert.ok(await page.locator('#modal-container').evaluate(el=>el.classList.contains('hidden')),
    'Selecting a directory device must not start editing or open a modal');
  await page.locator('[data-action="device-directory-view"][data-view="cards"]').click();
  assert.ok(await page.locator('.v21-device-cards').isVisible());
  await page.locator('[data-action="device-directory-view"][data-view="table"]').click();
  assert.ok(await page.locator('.device-table-wrapper').isVisible(),
    'Published device table and its original actions must remain available');
  await page.locator('[data-action="device-directory-view"][data-view="directory"]').click();
  await page.locator('#v21-directory-preview [data-action="view-device"]').click();
  await page.locator('.v21-device-detail-page').waitFor({state:'visible'});
  assert.equal(await page.locator('#modal-container').evaluate(el=>el.classList.contains('hidden')),true,
    'View Full Details must be a dedicated page, not a popup');
  await page.getByRole('tab',{name:'Hardware',exact:true}).click();
  assert.ok(await page.locator('#device-details-panel-hardware').isVisible());
  await page.getByRole('tab',{name:'Location',exact:true}).click();
  assert.equal(await page.locator('.v21-device-rack-preview').count(),0,
    'Unracked devices must not show a fictional rack location');
  await page.locator('[data-action="device-detail-back"]').first().click();
  await page.locator('.v21-directory-split').waitFor({state:'visible'});
  console.log('v2.1 Devices Directory, Cards, retained Table and full-page details passed');

  // A detected inconsistency appears only as an administrator warning; no data is saved.
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));
  await page.evaluate(()=>{
    switchTab('dashboard');
    appState.devices.push({...appState.devices.find(d=>d.name==='browser-device')});
    renderContent();
  });
  assert.equal(await page.locator('#v21-dashboard-empty').count(),0,
    'Saved devices and networks must suppress the empty-inventory welcome');
  const health=page.locator('#next-dashboard-inventory-health');
  assert.equal(await health.count(),1,'Admin must see actual inventory inconsistencies');
  assert.ok(await health.getByText(/Duplicate or missing device ID/).isVisible());
  assert.ok(await health.evaluate(el=>el.classList.contains('border-rose-200')),
    'Inventory warning must use established rose warning palette');
  await page.evaluate(()=>{appState.devices.pop();renderContent();});
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
  assert.equal((await state(page)).ipAllocations['10.64.20.15'].hostname,'spare-address');
  console.log('Published IPAM notes, independent reservation and bulk allocation saved and reloaded');

  await modal(page,'openManageLocationsModal');
  await page.locator('[data-action="rename-device-catalogue-entry"][data-kind="location"][data-name="Office"]').click();
  await page.locator('#device-catalogue-rename-value').fill('Workshop');
  await page.locator('[data-action="save-rename"][data-kind="location"]').click();
  await persisted(page,s=>s.devices.some(d=>d.id===device.id&&d.location==='Workshop'),'Location rename');
  await page.reload();
  await page.locator('#next-account-nav').waitFor();
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
  // Rack preview uses the real saved face and U position, not a fabricated rack.
  await page.evaluate(id=>openDeviceDetailView(id),rackSwitch.id);
  await page.locator('.v21-device-detail-page').waitFor({state:'visible'});
  await page.getByRole('tab',{name:'Location',exact:true}).click();
  assert.ok(await page.locator('.v21-device-rack-preview').isVisible(),
    'Valid rack-mounted device should have a small contextual placement illustration');
  assert.ok(await page.locator('.v21-device-rack-preview').getByText(/Front face.*U5/).isVisible());
  assert.ok((await page.locator('.v21-device-rack-preview-track').getAttribute('aria-label')).includes('U5'));
  await page.locator('[data-action="device-detail-back"]').first().click();

  // A VM receives its own Hardware tab and recorded physical host, but no rack illustration.
  // This temporary preview-only record is never posted to SQLite.
  await page.evaluate(hostId=>{
    const host=appState.devices.find(d=>String(d.id)===String(hostId));
    appState.devices.push({...host,id:'temporary-browser-vm',name:'temporary-browser-vm',
      type:'Server - Virtual',isVirtual:true,virtualHostId:hostId,
      mountType:'Not Applicable',rackId:null,face:null,rackUStart:null,rackUEnd:null,
      vmVcpu:2,vmRamGb:8,vmDiskGb:64,vmNicCount:1,previousTypeDetails:[]});
    openDeviceDetailView('temporary-browser-vm');
  },rackSwitch.id);
  await page.getByRole('tab',{name:'VM Hardware',exact:true}).click();
  assert.ok(await page.locator('#device-details-panel-hardware').getByText('Allocated virtual hardware').isVisible());
  await page.getByRole('tab',{name:'Overview',exact:true}).click();
  assert.ok(await page.locator('#device-details-panel-overview').getByText('rack-switch').isVisible(),
    'Virtual machine must retain its recorded physical host relationship');
  await page.getByRole('tab',{name:'Location',exact:true}).click();
  assert.equal(await page.locator('.v21-device-rack-preview').count(),0);
  await page.reload();
  await page.locator('#next-account-nav').waitFor();
  console.log('v2.1 contextual rack placement and virtual-machine hardware passed');

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
  await page.locator('#next-account-nav').waitFor();
  const rackSaved=await state(page);
  assert.equal(rackSaved.devices.find(d=>d.id===rackSwitch.id).rackId,rackId);
  assert.equal(rackSaved.rackAccessories.length,2);
  console.log('Rack device placement, patch panel and vertical PDU persisted after reload');

  // Approved acceptance: new accounts initially lack inventory access.
  await page.evaluate(()=>switchTab('users'));
  await page.locator('#users-sidebar-actions [data-action="sidebar-users-add"]').click();
  await page.locator('#next-user-create-form input[name="username"]').fill('editor');
  await page.locator('#next-user-create-form input[name="password"]').fill(password+'-Editor');
  await page.locator('#next-user-create-form button[type="submit"]').click();
  await page.waitForFunction(()=>[...document.querySelectorAll('#main-content h3')]
    .some(h=>h.textContent.trim()==='editor'));
  assert.equal(await page.locator('#users-sidebar-actions [data-action="sidebar-users-list"]').getAttribute('aria-current'),'page');
  await page.locator('#users-sidebar-actions [data-action="sidebar-users-overview"]').click();
  await page.getByText('Users by role',{exact:true}).waitFor();
  assert.equal(await page.getByText('Total users',{exact:true}).locator('..').locator('..').locator('p').textContent(),'2');
  assert.equal(await page.getByRole('heading',{name:'Administrators',exact:true}).locator('..').locator('..').locator('p').textContent(),'1');
  await page.locator('#users-sidebar-actions [data-action="sidebar-users-list"]').click();
  const editorId=await page.evaluate(async()=>{
    const r=await fetch('/api/users',{cache:'no-store'});
    if(!r.ok)throw Error('Unable to read users');
    return (await r.json()).users.find(user=>user.username==='editor')?.id;
  });
  assert.ok(Number.isInteger(editorId),'User not saved to SQLite');
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

  await page.locator('[data-next-user-permission][data-user-id="'+editorId+'"][data-section="Devices"]').selectOption('edit');
  await page.locator('[data-next-user-permission][data-user-id="'+editorId+'"][data-section="IPAM"]').selectOption('read');
  await page.locator('[data-next-user-permission][data-user-id="'+editorId+'"][data-section="Racks"]').selectOption('read');
  await page.waitForFunction(async id=>{
    const r=await fetch('/api/users',{cache:'no-store'});
    return r.ok && (await r.json()).users.find(user=>user.id===id)?.permissions.Devices==='edit';
  },editorId);
  await editor.locator('#username').fill('editor');
  await editor.locator('#password').fill(password+'-Editor');
  assert.ok(await editor.locator('#code-field').evaluate(el=>el.hidden));
  await editor.locator('#submit').click();
  await editor.locator('#code-field:not([hidden])').waitFor();
  await editor.locator('#code').fill(mfaCode(editorSecret));
  await editor.waitForURL('**/inventory');
  await editor.locator('#next-account-nav').waitFor();
  await editor.waitForFunction(()=>document.querySelector('#page-title')?.textContent==='Dashboard Overview');
  assert.equal(await editor.locator('#next-dashboard-mfa-notice').count(),0,
    'Enrolled editors must not see MFA setup guidance');
  await editor.evaluate(()=>{appState.devices.push({...appState.devices[0]});renderContent();});
  assert.equal(await editor.locator('.v21-dashboard-quick [data-action="open-rack-modal"]').count(),0,
    'Editors with read-only Racks must not be offered Add Rack');
  assert.equal(await editor.locator('#next-dashboard-inventory-health').count(),0,
    'Non-administrator editor must not see inventory health warnings');
  await editor.locator('[data-dashboard-tab="activity"]').click();
  assert.equal(await editor.getByText('Integrity issues',{exact:true}).count(),0,
    'Non-administrator editor must not see integrity health totals');
  await editor.evaluate(()=>{appState.devices.pop();renderContent();});
  await editor.locator('#sidebar #next-account-nav').click();
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
  assert.ok(await editor.locator('#ipam-sidebar-actions [data-action="open-subnet-modal"]').isHidden());
  await editor.locator('#sidebar [data-action="tab-racks"]').click();
  assert.ok(await editor.locator('#racks-sidebar-actions [data-action="open-rack-modal"]').isHidden());
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
  await editor.locator('#ipam-sidebar-actions [data-action="sidebar-ipam-addresses"]').click();
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
  await page.locator('#users-sidebar-actions [data-action="sidebar-users-add"]').click();
  await page.locator('#next-user-create-form input[name="username"]').fill('viewer');
  await page.locator('#next-user-create-form input[name="password"]').fill(password+'-Viewer');
  await page.locator('#next-user-create-form button[type="submit"]').click();
  await page.waitForFunction(()=>[...document.querySelectorAll('#main-content h3')].some(node=>node.textContent.trim()==='viewer'));
  const viewerId=await page.evaluate(async()=>{
    const r=await fetch('/api/users');
    return (await r.json()).users.find(u=>u.username==='viewer')?.id;
  });
  assert.ok(Number.isInteger(viewerId));
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
  await viewer.locator('.v21-directory-split').waitFor({state:'visible'});
  assert.equal(await viewer.locator('#v21-directory-preview [data-action="edit-device"]').count(),0);
  assert.equal(await viewer.locator('#v21-directory-preview [data-action="duplicate-device"]').count(),0);
  assert.equal(await viewer.locator('#v21-directory-preview [data-action="delete-device"]').count(),0);
  await viewer.locator('#v21-directory-preview [data-action="view-device"]').click();
  await viewer.locator('.v21-device-detail-page').waitFor({state:'visible'});
  assert.ok(await viewer.getByRole('tab',{name:'Software',exact:true}).isVisible());
  await viewer.locator('[data-action="device-detail-back"]').first().click();
  await viewer.locator('.v21-directory-split').waitFor({state:'visible'});
  assert.ok(await viewer.locator('#devices-sidebar-actions [data-action="open-device-modal"]').isHidden());
  await viewer.evaluate(()=>openDeviceModal());
  assert.ok(await viewer.locator('#modal-container').evaluate(el=>el.classList.contains('hidden')),
    'Read-only users must not be able to open the Device editor');
  await viewer.locator('#sidebar [data-action="tab-ipam"]').click();
  assert.ok(await viewer.locator('#ipam-sidebar-actions [data-action="open-subnet-modal"]').isHidden());
  await viewer.locator('#sidebar [data-action="tab-racks"]').click();
  assert.ok(await viewer.locator('#racks-sidebar-actions [data-action="open-rack-modal"]').isHidden());
  await viewer.locator('#sidebar #next-account-nav').click();
  for(const tab of ['preferences','help','about']){
    await viewer.locator('[data-action="select-account-section"][data-section="'+tab+'"]').click();
    assert.ok(await viewer.locator('[data-action="select-account-section"][data-section="'+tab+'"]').isVisible());
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
