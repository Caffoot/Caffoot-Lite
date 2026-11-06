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
let server,browser,publishedServer;
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
  await page.locator('#app[aria-busy="false"]').waitFor();
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));
  await page.evaluate(name=>{
    if(typeof window[name]!=='function')throw Error('Missing published modal '+name);
    window[name]();
  },name);
}
async function verifySoftwareVisibility(page){
  await page.locator('#sidebar [data-action="tab-devices"]').click();
  await page.locator('#main-content [data-action="approved-device-section"][data-tab="software"]').click();
  const catalogDialog=page.locator('#modal-content .catalog-modal');
  await page.locator('#main-content [data-action="software-custom-edit"]').first().click();
  const availabilityToggle=catalogDialog.locator('[data-action="software-toggle"]').first();
  const availabilityName=await availabilityToggle.getAttribute('data-name');
  const availabilityType=await availabilityToggle.getAttribute('data-type');
  await availabilityToggle.click();
  await persisted(page,s=>s.settings?.softwareTypeExclusions?.[availabilityName]?.includes(availabilityType),'Built-in software visibility');
  await page.waitForFunction(()=>document.querySelector('#modal-container [data-action="software-toggle"]')?.textContent.endsWith(' · Hidden'));
  await availabilityToggle.click();
  await persisted(page,s=>!s.settings?.softwareTypeExclusions?.[availabilityName]?.includes(availabilityType),'Restored built-in software visibility');
  await page.waitForFunction(()=>document.querySelector('#modal-container [data-action="software-toggle"]')?.textContent.endsWith(' · Available'));
  await catalogDialog.locator('.catalog-modal-head [data-action="close-modal"]').click();
  console.log('Software visibility hide/restore persisted in SQLite and modal labels refreshed');
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
  await page.waitForFunction(()=>document.querySelector('#auth-heading')?.textContent==='Create Your Administrator');
  await page.locator('#username').fill('owner');
  await page.locator('#password').fill(password);
  await page.locator('#confirm-password').fill(password);
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
  await page.locator('#setup-complete:not([hidden])').waitFor();
  await page.locator('#setup-continue-sign-in').click();
  await page.getByText('MFA enrolled. Sign in to continue.').waitFor();
  assert.ok((await page.locator('#code').inputValue())==='',
    'Returned sign-in must not retain the enrolment verification code');
  assert.ok((await page.locator('#confirm-password').inputValue())==='',
    'Enrolment-only password confirmation must be cleared');
  assert.ok((await page.locator('#secret').textContent())==='',
    'The completed enrolment must remove the setup seed from the page');
  assert.equal(await page.locator('#setup-qr').locator('*').count(),0,
    'The completed enrolment must remove the setup QR code');

  assert.ok(await page.locator('#code-field').evaluate(el=>el.hidden),'Authenticator code should be hidden before sign-in');
  await page.locator('#submit').click();
  await page.locator('#code-field:not([hidden])').waitFor();
  await page.locator('#code').fill(mfaCode(secret));
  await page.waitForURL('**/inventory');
  assert.equal(await page.locator('script[src*="cdn.tailwindcss.com"]').count(),0,
    'Inventory must not load remote Tailwind JavaScript');
  assert.equal(await page.locator('link[href="/interface/styles/utilities.css"]').count(),1,
    'Inventory must load local utilities without replacing the approved element defaults');
  const staticCSS=await page.request.get(address+'/assets/tailwind.css');
  assert.equal(staticCSS.status(),200,'Static stylesheet must be served by the backend');
  assert.match(staticCSS.headers()['content-type']||'',/text\/css/);
  assert.ok((await staticCSS.text()).includes('bg-white'),
    'Compiled inventory utilities must be present');
  assert.equal(await page.locator('#sidebar').evaluate(el=>getComputedStyle(el).display),'flex',
    'Tailwind utility layout must remain active');
  const sharedSidebar=await page.locator('#sidebar').elementHandle();
  await page.locator('[data-action="toggle-approved-sidebar"]').click();
  assert.equal(await page.locator('#app').evaluate(el=>el.classList.contains('collapsed')),true,
    'The approved menu collapse control must work');
  await page.locator('[data-action="toggle-approved-sidebar"]').click();
  assert.equal(await page.locator('#app').evaluate(el=>el.classList.contains('collapsed')),false,
    'The approved menu must expand again');
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
  await page.locator('#main-content [data-action="approved-device-section"][data-tab="overview"]').click();
  const approvedDeviceOverview=page.locator('#main-content [data-device-panel="overview"] .intelligence-panel[data-insight-panel="overview"]');
  await approvedDeviceOverview.waitFor();
  assert.equal(await approvedDeviceOverview.locator('.intelligence-metric').count(),4,
    'Approved Devices Overview must show four original-format saved-inventory totals');
  assert.equal(await approvedDeviceOverview.locator('.intelligence-two > article.intelligence-card').count(),2,
    'Device type and location must use approved Draft 03 intelligence cards, not legacy panels');
  assert.deepEqual(await approvedDeviceOverview.locator('.intelligence-two > article.intelligence-card h3').allTextContents(),
    ['Devices by Type','Devices by Location'],
    'Approved Draft 03 intelligence card headings must appear in their original layout');
  assert.equal(await approvedDeviceOverview.locator('.intelligence-two .intelligence-card-head .iconwrap').count(),2,
    'Both approved intelligence cards must retain their original icon/header components');
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

  // The pinned Batch 02 Type/Location manager, rename and delete confirmation,
  // while retaining protected Unknown and the original saved-data actions.
  await page.locator('#main-content [data-action="open-manage-types"]').click();
  const typeManager=page.locator('#modal-content .catalog-modal .device-catalogue-manager');
  await typeManager.waitFor();
  assert.equal(await page.locator('#catalog-modal-title').textContent(),'Manage Device Types');
  assert.ok(await typeManager.locator('.catalog-modal-field #device-catalogue-new-entry-input').isVisible(),
    'Device Type add input must use the original approved catalogue field');
  assert.ok(await typeManager.locator('.catalog-modal-field #device-catalogue-search-input').isVisible());
  assert.ok(await typeManager.locator('.catalog-manager-list .catalog-manager-row').count()>0,
    'Device Type manager must render the original approved list and rows');
  const protectedType=typeManager.locator('.catalog-manager-row [data-action="rename-device-catalogue-entry"][data-name="Unknown"]');
  if(await protectedType.count())assert.equal(await protectedType.isDisabled(),true,
    'Protected Unknown type must not become editable');
  const renameType=typeManager.locator('.catalog-manager-row [data-action="rename-device-catalogue-entry"]:not([disabled])').first();
  assert.ok(await renameType.count(),'At least one configured device type must be manageable');
  const originalTypeName=await renameType.getAttribute('data-name');
  await renameType.click();
  assert.equal(await page.locator('#catalog-modal-title').textContent(),'Rename Device Type');
  assert.equal(await page.locator('#device-catalogue-rename-value').inputValue(),originalTypeName);
  await page.locator('#modal-content [data-action="cancel-rename"]').click();
  assert.equal(await page.locator('#catalog-modal-title').textContent(),'Manage Device Types');
  await typeManager.locator('.catalog-manager-row [data-action="delete-device-type-or-location"]:not([disabled])').first().click();
  const confirmTypeDelete=page.locator('#delete-dialog[role="alertdialog"]');
  await confirmTypeDelete.waitFor();
  assert.ok(await confirmTypeDelete.locator('.catalog-modal .catalog-delete-warning').isVisible(),
    'Confirmed deletions must retain the approved warning panel and preserve the confirmation step');
  await confirmTypeDelete.locator('[data-action="cancel-delete"]').click();
  assert.equal(await confirmTypeDelete.count(),0,'Cancel must close without deleting the type');
  await page.locator('#modal-content .catalog-modal-head [data-action="close-modal"]').click();
  assert.equal(await page.locator('#modal-container:not(.hidden)').count(),0);
  await page.locator('#main-content [data-action="approved-device-section"][data-tab="locations"]').click();
  await page.locator('#main-content .catalog-card [data-catalog-list="location"]').waitFor();
  assert.ok(await page.locator('#main-content .catalog-header [data-action="open-manage-locations"]').isVisible(),
    'The existing Manage Locations action must remain available');

  await page.locator('#main-content [data-action="open-manage-locations"]').click();
  const locationManager=page.locator('#modal-content .catalog-modal .device-catalogue-manager');
  await locationManager.waitFor();
  assert.equal(await page.locator('#catalog-modal-title').textContent(),'Manage Locations');
  assert.ok(await locationManager.locator('.catalog-manager-list .catalog-manager-row').count()>0);
  assert.ok(await locationManager.locator('#device-catalogue-new-entry-input').isVisible());
  await page.locator('#modal-content .catalog-modal-head [data-action="close-modal"]').click();

  // The copied Batch 02 page components must also render and filter live records.
  for(const section of ['types','locations','manufacturers','models','software','services']){
    await page.locator('#main-content [data-action="approved-device-section"][data-tab="'+section+'"]').click();
    const panel=page.locator('#main-content .catalog-section');
    await panel.evaluate(el=>Promise.all(el.getAnimations({subtree:true}).map(animation=>animation.finished)));
    assert.equal(await page.locator('.device-tabs .section-tab-icon[aria-hidden="true"][focusable="false"]').count(),8,
      'All eight main Device tabs retain labels and decorative shared icons');
    assert.equal(await panel.evaluate(el=>el.firstElementChild.getBoundingClientRect().top-document.querySelector('.device-tabs').getBoundingClientRect().bottom),16,
      'Catalogue content uses the shared 16px entrance gap');
    assert.equal(await panel.locator(':scope > .intelligence-grid.catalog-kpis > .intelligence-metric').count(),3,
      'The source catalogue KPI hierarchy must render for '+section);
    assert.equal(await panel.locator(':scope > .catalog-card').first().locator(':scope > .catalog-card-top + .catalog-toolbar + .catalog-list + .catalog-count').count(),1,
      'The source catalogue header, filters, records and count must stay in order for '+section);
    await page.setViewportSize({width:390,height:844});
    assert.equal(await panel.locator('.catalog-kpis').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),1,
      'Pinned catalogue KPIs must stack on a 390px screen for '+section);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,
      'Catalogue controls must not overflow the mobile document for '+section);
    const selected=page.locator('.device-tabs [data-tab="'+section+'"]');
    await page.waitForFunction(section=>{
      const el=document.querySelector('.device-tabs [data-tab="'+section+'"]');
      if(!el)return false;
      const a=el.getBoundingClientRect(),b=el.parentElement.getBoundingClientRect();
      return a.left>=b.left-1&&a.right<=b.right+1;
    },section);
    assert.equal(await selected.evaluate(el=>{const a=el.getBoundingClientRect(),b=el.parentElement.getBoundingClientRect();return a.left>=b.left-1&&a.right<=b.right+1;}),true,
      'The active mobile catalogue tab must remain visible after rendering '+section);
    await page.setViewportSize({width:1440,height:950});
  }
  await page.locator('#main-content [data-action="approved-device-section"][data-tab="inventory"]').click();
  const inventoryTypeTrigger=page.locator('.device-filter:has(#device-type-filter) .caffoot-search-trigger');
  await inventoryTypeTrigger.waitFor();
  assert.ok(await inventoryTypeTrigger.evaluate(trigger=>{
    const original=getComputedStyle(document.getElementById('device-type-filter')),live=getComputedStyle(trigger);
    return ['border','borderRadius','padding','fontFamily','fontSize','fontWeight','color'].every(property=>original[property]===live[property]);
  }),'Searchable Device Type must retain the approved native control presentation');
  await inventoryTypeTrigger.click();
  const typeSearch=page.locator('.caffoot-search-popup:visible .caffoot-search-input');
  await typeSearch.fill('no-matching-device-type');
  assert.equal(await page.locator('.caffoot-search-popup:visible [role="option"]').count(),0);
  await typeSearch.fill('Server');
  await page.locator('.caffoot-search-popup:visible [role="option"]').first().click();
  assert.notEqual(await page.locator('#device-type-filter').inputValue(),'');
  await page.locator('[data-action="clear-device-filters"]').first().click();
  await page.locator('#main-content [data-action="approved-device-section"][data-tab="manufacturers"]').click();
  await page.locator('#manufacturer-search').fill('no-matching-catalogue-record');
  assert.equal(await page.locator('[data-manufacturer-row]:visible').count(),0,
    'Search must hide source catalogue rows, including their flex layout');
  await page.locator('[data-action="manufacturer-reset"]').click();
  assert.ok(await page.locator('[data-manufacturer-row]:visible').count()>0,
    'Clear Filters must restore live catalogue rows');

  // Pinned Batch 02 catalogue dialogs: source structure, original input IDs and responsive multi-type fields.
  await page.locator('#main-content [data-action="approved-device-section"][data-tab="manufacturers"]').click();
  await page.locator('#main-content [data-action="manufacturer-add"]').click();
  const catalogDialog=page.locator('#modal-content .catalog-modal');
  await catalogDialog.waitFor();
  assert.ok(await catalogDialog.locator('.catalog-modal-head .eyebrow').isVisible());
  assert.ok(await catalogDialog.locator('.catalog-modal-field #manufacturer-name').isVisible());
  assert.ok(await catalogDialog.locator('.catalog-modal-actions [data-action="save-catalogue-manufacturer"]').isVisible());
  assert.ok(await catalogDialog.locator('.catalog-type-field[data-multi-device-types="manufacturers"] .catalog-type-option input[name="catalogue-manufacturer-device-type"]').count()>1);
  const beforeCatalogueViewport=page.viewportSize();
  await page.setViewportSize({width:390,height:844});
  assert.equal(await catalogDialog.locator('.catalog-type-options').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),1,
    'Approved manufacturer type checkboxes must form a single column on narrow screens');
  await page.setViewportSize(beforeCatalogueViewport);
  await catalogDialog.locator('.catalog-modal-head [data-action="close-modal"]').click();
  assert.ok(await page.locator('#modal-container').evaluate(el=>el.classList.contains('hidden')));
  const originalManufacturer=page.locator('#main-content [data-action="built-in-manufacturer-edit"]').first();
  if(await originalManufacturer.count()){
    await originalManufacturer.click();
    assert.ok(await catalogDialog.locator('.catalog-modal-field #built-in-manufacturer-name').isVisible());
    await catalogDialog.locator('.catalog-modal-head [data-action="close-modal"]').click();
  }
  await page.locator('#main-content [data-action="approved-device-section"][data-tab="models"]').click();
  await page.locator('#main-content [data-action="model-add"]').click();
  assert.ok(await catalogDialog.locator('.catalog-modal-field #hardware-model-manufacturer-select').isVisible());
  assert.ok(await catalogDialog.locator('.catalog-modal-field #model-device-type').isVisible());
  await catalogDialog.locator('.catalog-modal-head [data-action="close-modal"]').click();
  await page.locator('#main-content [data-action="approved-device-section"][data-tab="software"]').click();
  await page.locator('#main-content [data-action="software-custom-add"]').click();
  assert.ok(await catalogDialog.locator('.catalog-modal-field #software-custom-name').isVisible());
  assert.ok(await catalogDialog.locator('.catalog-type-field[data-multi-device-types="software"] input[name="software-custom-type"]').count()>1);
  assert.ok(await catalogDialog.locator('.catalog-modal-actions [data-action="software-custom-save"]').isVisible());
  await catalogDialog.locator('.catalog-modal-head [data-action="close-modal"]').click();
  if(process.env.CAFFOOT_BROWSER_FOCUS==='software-visibility'){
    await verifySoftwareVisibility(page);
    assert.deepEqual(errors,[],'Browser JavaScript errors');
    return;
  }
  await page.locator('#main-content [data-action="approved-device-section"][data-tab="services"]').click();
  await page.locator('#main-content [data-action="server-catalog-add"]').click();
  assert.ok(await catalogDialog.locator('.catalog-modal-field #server-service-name-input').isVisible());
  assert.ok(await catalogDialog.locator('.catalog-modal-actions [data-action="server-catalog-save"]').isVisible());
  await catalogDialog.locator('.catalog-modal-head [data-action="close-modal"]').click();
  console.log('Approved catalogue modal structure and mobile multi-type field coverage passed');
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
  await page.waitForFunction(()=>document.querySelector('#page-title')?.textContent==='Dashboard');
  for(const selector of ['#sidebar','#page-title','#main-content']){
    assert.ok((await page.locator(selector).evaluate(el=>getComputedStyle(el).fontFamily)).includes('Inter'),
      'Branded inventory typography should apply to '+selector);
  }

  // Approved Dashboard Draft 02 Overview must use its source cards rather than legacy panels.
  const draft02Overview=page.locator('#main-content #dashboard-panel-overview');
  await draft02Overview.waitFor({state:'visible'});
  assert.equal(await draft02Overview.locator('.db-summary > button.db-metric').count(),4,
    'The original Dashboard Overview has four clickable source metric cards');
  assert.ok(await draft02Overview.locator('.db-summary .db-metric-head .iconwrap svg use').count()===4,
    'Approved metrics must retain the pinned inline SVG symbols');
  assert.equal(await draft02Overview.locator('.db-two > .db-stack > .card.db-card').count(),6,
    'The pinned Overview has three cards in each stack, including live network allocation');
  assert.ok(await draft02Overview.locator('.db-actionrow [data-action="open-device-modal"].btn').isVisible());
  assert.ok(await draft02Overview.locator('.db-actionrow [data-action="open-rack-modal"].btn').isVisible());
  assert.ok(await draft02Overview.locator('.db-actionrow [data-action="tab-ipam"].btn').isVisible());
  assert.equal(await draft02Overview.locator('.db-stack .db-slimrow').count(),3,
    'Empty inventory must preserve the three pinned Inventory Status rows');
  assert.ok(await draft02Overview.locator('.card-head h3').filter({hasText:'Recent Devices'}).isVisible());
  console.log('First administrator, MFA, sign-in and direct Dashboard arrival passed');
  assert.equal(await page.locator('#next-dashboard-mfa-notice').count(),0,
    'Enrolled administrators must not see MFA setup guidance');
  assert.equal(await page.locator('#next-dashboard-inventory-health').count(),0,
    'Healthy administrator Dashboard must hide Inventory Health');
  // Dashboard Draft 02 source four-card grid, rack layout and mobile stacking.
  await page.locator('#main-content [data-dashboard-tab="insights"]').click();
  const draft02Insights=page.locator('#main-content #dashboard-panel-insights');
  await draft02Insights.waitFor({state:'visible'});
  assert.equal(await draft02Insights.locator('.db-insights-4 > .card.db-card').count(),4);
  assert.deepEqual(await draft02Insights.locator('.db-insights-4 .card-head h3').allTextContents(),
    ['IP Address Utilisation','Device Status','Hardware Distribution','Rack Capacity by Face']);
  assert.equal(await draft02Insights.locator('.db-insights-4 .divider').count(),4);
  assert.ok(await draft02Insights.locator('.db-section.card.db-card .db-grid').isVisible());
  assert.ok(await draft02Insights.locator('.db-section .db-actionrow [data-action="tab-racks"]').isVisible());
  const draft02Viewport=page.viewportSize();
  await page.setViewportSize({width:390,height:844});
  const narrowColumns=await draft02Insights.locator('.db-insights-4').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length);
  assert.equal(narrowColumns,1,'Approved four insight cards must stack into one mobile column');
  await page.setViewportSize(draft02Viewport);
  await page.locator('#main-content [data-dashboard-tab="overview"]').click();

  // Pinned Dashboard Draft 02 Activity & Alerts component fidelity and live actions.
  await page.locator('#main-content [data-dashboard-tab="activity"]').click();
  const draft02Activity=page.locator('#main-content #dashboard-panel-activity');
  await draft02Activity.waitFor({state:'visible'});
  assert.equal(await draft02Activity.locator('.db-summary > .card.db-card').count(),2,
    'Activity summary must use the two original source cards');
  assert.deepEqual(await draft02Activity.locator('.db-summary .card-head h3').allTextContents(),
    ['Recent Save Events','Network Warnings']);
  assert.deepEqual(await draft02Activity.locator('.db-two .card-head h3').allTextContents(),
    ['Recent Activity','Warnings & Attention'],
    'Activity and alert filters must be inside the original two card stacks');
  assert.ok(await draft02Activity.locator('.db-filters select#activity-filter[data-dashboard-filter="activity"]').isVisible());
  assert.ok(await draft02Activity.locator('.db-filters select#alert-filter[data-dashboard-filter="alerts"]').isVisible());
  await draft02Activity.locator('#activity-filter').selectOption('devices');
  assert.equal(await draft02Activity.locator('#activity-filter').inputValue(),'devices',
    'Activity filter must retain its selected value after live redraw');
  await draft02Activity.locator('#activity-filter').selectOption('all');
  await draft02Activity.locator('#alert-filter').selectOption('critical');
  assert.equal(await draft02Activity.locator('#alert-filter').inputValue(),'critical',
    'Severity filter must retain its selected value after live redraw');
  await draft02Activity.locator('#alert-filter').selectOption('all');
  assert.ok(await draft02Activity.locator('#activity-empty').isVisible(),
    'Fresh inventory must show source empty-state copy without fabricated history');
  assert.ok(await draft02Activity.locator('#alert-empty').isVisible(),
    'Fresh inventory must show source empty state without fabricated warnings');
  assert.equal(await draft02Activity.locator('.db-section.card.db-card .db-report-buttons button[data-action="export-selected-inventory-csv"]').count(),3,
    'Pinned report actions must map to all three existing CSV downloads');
  await draft02Activity.locator('[data-action="open-network-reports"]').click();
  assert.ok(await page.locator('#modal-content section[aria-label="Network reports"]').isVisible(),
    'Existing detailed Network Reports must remain available from the approved report controls');
  await page.locator('#modal-content [data-action="close-modal"]').click();
  assert.equal(await draft02Activity.locator('[data-action="export-selected-inventory-csv"]').count(),3,
    'There must not be duplicate report export buttons');
  const csvDownload=page.waitForEvent('download');
  await draft02Activity.locator('.db-report-buttons [data-report="devices"]').click();
  assert.match((await csvDownload).suggestedFilename(),/^caffoot_lite_devices_/,
    'Original source export button must execute the existing safe CSV downloader');
  const activityViewport=page.viewportSize();
  await page.setViewportSize({width:390,height:844});
  assert.equal(await draft02Activity.locator('.db-two').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),1,
    'Original Dashboard Activity columns must stack on narrow mobile');
  await page.setViewportSize(activityViewport);
  await page.locator('#main-content [data-dashboard-tab="overview"]').click();
  assert.equal(await page.getByText('Keep a separate JSON backup',{exact:false}).count(),0,
    'Docker Dashboard must not show browser-era JSON backup advice');
  assert.equal(await page.getByRole('button',{name:'Refresh inventory'}).count(),0);
  for(const tab of ['ipam','devices','racks','audit','users','settings']){
    const navigation=page.locator('#sidebar [data-action="tab-'+tab+'"]');
    assert.ok(await navigation.isEnabled(),'Navigation disabled: '+tab);
    await navigation.click();
    assert.equal(await sharedSidebar.evaluate(el=>el.isConnected),true,
      'Section navigation must retain the single shared sidebar: '+tab);
    assert.equal(await page.locator('#app .header-account').count(),1,
      'Each section must retain one shared account control: '+tab);
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
  assert.equal(await page.locator('.audit-tabs + .audit-stats').count(),1,
    'The four shared totals follow Audit navigation once');
  assert.equal(await page.locator('.audit-stats').evaluate(el=>el.getBoundingClientRect().top-document.querySelector('.audit-tabs').getBoundingClientRect().bottom),16,
    'Audit totals begin 16px below the tabs');
  assert.equal(await page.locator('.audit-tab .section-tab-icon[aria-hidden="true"][focusable="false"]').count(),3,
    'Audit tab icons remain decorative');
  assert.equal(await page.locator('.audit-stat .hint').first().evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)',
    'Settings help styling must not turn Audit Trail captions into warning panels');
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
  assert.equal(await page.locator('#page-title').textContent(),'My Account');
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
  assert.equal(await page.locator('.approved-account .expander').count(),6,
    'Help & Guides must preserve all six published help topics');
  assert.equal(await page.locator('.approved-account .expander a').count(),8,
    'All eight published guide links must remain available');
  const fullGuides=page.locator('.approved-account a[href*="Features%20and%20Instructions"]');
  assert.ok(await fullGuides.count()>0,'Approved full user documentation link must remain');
  await page.locator('[data-action="select-account-section"][data-section="about"]').first().click();
  assert.ok(await page.getByText('Published Release',{exact:true}).isVisible());
  assert.ok(await page.getByText('v2.0.3',{exact:true}).isVisible());
  await page.locator('.approved-account [data-action="caffoot-licences"]').click();
  await page.locator('#modal-content').getByRole('heading',{name:'Software Licences'}).waitFor();
  assert.ok((await page.locator('#modal-content').textContent()).includes('MIT License'));
  await page.locator('#modal-content [data-action="close-modal"]').first().click();
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
  await page.locator('.email-verification summary').click();
  await page.locator('#account-email-verification-form input[name="password"]').fill(password);
  const verificationRequest=page.waitForResponse(response=>response.url().endsWith('/api/account/email/request'));
  await page.locator('#request-email-verification').click();
  assert.equal((await verificationRequest).status(),200);
  await page.waitForFunction(()=>document.querySelector('#email-verification-message')?.textContent.includes('contact your Caffoot Lite administrator'));
  const lightCard=await page.locator('.personal-card').evaluate(el=>getComputedStyle(el).backgroundColor);
  await page.locator('.appearance-buttons [data-theme="dark"]').click();
  assert.ok(await page.locator('html').evaluate(el=>el.classList.contains('dark')));
  assert.notEqual(await page.locator('.personal-card').evaluate(el=>getComputedStyle(el).backgroundColor),lightCard);
  await page.emulateMedia({colorScheme:'dark'});
  await page.locator('.appearance-buttons [data-theme="system"]').click();
  assert.ok(await page.locator('html').evaluate(el=>el.classList.contains('dark')));
  await page.locator('.appearance-buttons [data-theme="light"]').click();
  await page.emulateMedia({colorScheme:'light'});
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
  assert.equal(await page.locator('#page-title').textContent(),'Users & Permissions');
  await page.locator('.approved-page-header [data-tab="list"]').click();
  await page.locator('[data-action="users-open-editor"]').first().click();
  const ownerWorkspace=page.locator('.users-management-modal .modal');
  assert.equal(await ownerWorkspace.evaluate(el=>Math.round(el.getBoundingClientRect().width)),710,
    'Owner workspace must use the approved full-width layout');
  assert.equal(await ownerWorkspace.locator('.profile-modal-grid .input:disabled').count(),4,
    'Owner personal details must remain protected in the approved workspace');
  assert.equal(await ownerWorkspace.locator('[data-next-user-operation]:disabled').count(),3,
    'Owner disable, demote and delete safeguards must remain');
  await page.setViewportSize({width:390,height:844});
  assert.equal(await ownerWorkspace.locator('.profile-modal-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),1,
    'Approved user profile fields must stack on mobile');
  await ownerWorkspace.locator('[data-action="users-close-editor"]').first().click();
  await page.setViewportSize({width:1440,height:950});
  await page.locator('#sidebar [data-action="tab-dashboard"]').click();
  assert.equal((await state(page)).sections.Devices,true);
  console.log('Authenticated central inventory rendered');

  await modal(page,'openSubnetModal');
  const ipamAddDialog=page.locator('#modal-content.approved-ipam-modal');
  assert.ok(await ipamAddDialog.locator('.ipam-modal-head h2').getByText('Add Subnet',{exact:true}).isVisible(),
    'IPAM Add Subnet must use approved Draft 01 modal heading');
  assert.equal(await ipamAddDialog.locator('.ipam-modal-body > .ipam-form-grid > .ipam-field').count(),7,
    'IPAM Add Subnet must use the original Draft 01 field-grid structure');
  assert.ok(await ipamAddDialog.locator('.ipam-modal-actions button[type="submit"]').isVisible(),
    'Approved IPAM form footer must retain the working save action');
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

  const approvedSubnetId=sub.subnets.find(x=>x.name==='Browser Network').id;
  // IPAM Draft 01 Manage Subnets uses the real grouped hierarchy and edit actions.
  await page.locator('#sidebar [data-action="tab-ipam"]').click();
  await page.locator('#main-content .approved-page-header [data-action="approved-ipam-section"][data-view="manage"]').click();
  const approvedManage=page.locator('#main-content .ipam-approved-manage');
  await approvedManage.waitFor();
  assert.ok(await approvedManage.getByRole('heading',{name:'IP Address Blocks, Networks & VLANs'}).isVisible());
  assert.ok(await approvedManage.getByRole('heading',{name:'VLAN Ownership Check'}).isVisible());
  assert.ok(await approvedManage.locator('[data-ipam-hierarchy-block="__unassigned__"]').isVisible());
  assert.ok(await approvedManage.getByText('Browser Network',{exact:true}).first().isVisible());
  assert.ok(await approvedManage.locator('[data-action="open-subnet-modal"]').isEnabled());
  assert.ok(await approvedManage.locator('[data-action="bulk-ip"]').isEnabled());
  assert.ok(await approvedManage.locator('[data-action="edit-subnet"][data-id="'+approvedSubnetId+'"]').isVisible());
  await approvedManage.locator('[data-action="edit-subnet"][data-id="'+approvedSubnetId+'"]').click();
  const ipamEditDialog=page.locator('#modal-content.approved-ipam-modal');
  await ipamEditDialog.waitFor();
  assert.ok(await ipamEditDialog.locator('.ipam-modal-head h2').getByText('Edit Subnet',{exact:true}).isVisible(),
    'Edit Subnet must use the same approved Draft 01 form');
  assert.equal(await ipamEditDialog.locator('#sub-name').inputValue(),'Browser Network');
  assert.ok(await ipamEditDialog.locator('#sub-kind').isDisabled(),
    'Editing a saved subnet must not allow its type to change');
  assert.ok(await ipamEditDialog.locator('.ipam-modal-actions [data-action="delete-subnet"]').isVisible(),
    'The existing protected subnet delete action must stay available in the approved footer');
  await page.setViewportSize({width:390,height:844});
  assert.equal((await ipamEditDialog.locator('.ipam-form-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns)).trim().split(/\s+/).length,1,
    'Approved IPAM modal field grid must stack at mobile width');
  const mobileIpamCancel=ipamEditDialog.locator('[data-action="cancel-subnet-modal"]').last();
  await mobileIpamCancel.scrollIntoViewIfNeeded();
  const mobileIpamBounds=await mobileIpamCancel.boundingBox();
  assert.ok(mobileIpamBounds.y>=0&&mobileIpamBounds.y+mobileIpamBounds.height<=844,
    'Tall mobile IPAM editors must allow the footer actions to scroll into view');
  await mobileIpamCancel.focus();
  assert.ok(await mobileIpamCancel.evaluate(el=>document.activeElement===el),
    'Mobile IPAM footer must remain keyboard accessible');
  await page.setViewportSize({width:1440,height:950});
  await ipamEditDialog.locator('[data-action="cancel-subnet-modal"]').last().click();
  await page.locator('#modal-container').waitFor({state:'hidden'});
  await approvedManage.locator('[data-action="ipam-open-network-addresses"][data-id="'+approvedSubnetId+'"]').click();
  assert.ok(await page.locator('#main-content .ipam-approved-addresses #ipam-select-network').isVisible());
  await page.locator('#main-content .ipam-approved-addresses [data-action="open-ip"][data-ip="10.64.20.2"]').click();
  const ipamAddressDialog=page.locator('#modal-content.approved-ipam-modal');
  await ipamAddressDialog.waitFor();
  assert.ok(await ipamAddressDialog.locator('.ipam-modal-head h2').getByText('Configure IP:',{exact:false}).isVisible(),
    'IP address editing must use the original approved Draft 01 modal header');
  assert.equal(await ipamAddressDialog.locator('.ipam-form-grid > .ipam-field').count(),3,
    'Approved address editor must retain Status, Hostname and IPAM Notes');
  await ipamAddressDialog.locator('#ip-notes').fill('Interface integration regression');
  await ipamAddressDialog.locator('button[type="submit"]').click();
  await persisted(page,s=>s.ipAllocations['10.64.20.2']?.notes==='Interface integration regression','Approved IPAM notes');
  await page.locator('#modal-container').waitFor({state:'hidden'});
  await page.locator('#sidebar [data-action="tab-dashboard"]').click();
  console.log('Approved IPAM Draft 01 add/edit and address form save paths passed');

  await modal(page,'openRackModal');
  const approvedRackForm=page.locator('#modal-content .rack-modal');
  await approvedRackForm.waitFor();
  assert.ok(await approvedRackForm.locator('.rack-modal-top h2')
    .getByText('Add Network Rack Enclosure',{exact:true}).isVisible(),
    'Draft 04 Add Rack dialog must use the original approved modal header');
  assert.equal(await approvedRackForm.locator('.rack-form-grid > .rack-field').count(),6,
    'The approved form must contain six original Rack identity/dimension fields');
  assert.equal(await approvedRackForm.locator('form[data-form-action="rack"] [required]#rack-name').count(),1,
    'The approved Rack Name field must retain native required validation');
  assert.equal(await approvedRackForm.locator('.rack-form-actions button').count(),2,
    'The approved Rack modal must retain Cancel and Save actions');

  await page.locator('#rack-name').fill('Browser Rack');
  await page.locator('form[data-form-action="rack"] button[type="submit"]').click();
  await persisted(page,s=>s.racks.some(x=>x.name==='Browser Rack'),'Rack');
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));
  console.log('Rack form passed');

  // Approved Rack Inventory Draft 04 cards must show saved rack metadata.
  await page.locator('#sidebar [data-action="tab-racks"]').click();
  await page.locator('#main-content .approved-page-header [data-action="approved-rack-section"][data-section-tab="inventory"]').click();
  const newRackCard=page.locator('#main-content [data-v13-rack-row][data-action="v13-open-rack"]')
    .filter({hasText:'Browser Rack'});
  await newRackCard.waitFor();
  assert.ok(await newRackCard.getByText('View Rack Elevation',{exact:true}).isVisible(),
    'Approved Rack Inventory card action must be retained');
  assert.ok(await newRackCard.locator('.iconwrap.orange').isVisible(),
    'The approved Rack Inventory card icon must appear');
  assert.ok((await newRackCard.locator('.rack-small').first().textContent()).includes('U'),
    'Rack Inventory must show the actual rack height');
  await newRackCard.click();
  const rackDetail=page.locator('#main-content .rack-workspace');
  await rackDetail.waitFor();

  // Draft 04 rack detail is the approved markup, with live elevation/actions.
  const approvedElevation=rackDetail.locator('.rack-detail-workspace .rack-elev-panel');
  assert.ok(await approvedElevation.isVisible(),
    'Rack View must render the original approved elevation panel');
  assert.ok(await approvedElevation.locator('#rack-elev-scroll.rack-elev-scroll').isVisible(),
    'The approved elevation must have its own scroll container');
  assert.equal(await approvedElevation.locator('.rack-elevation .rack-side-rail').count(),2,
    'Both approved L/R 0U rails must be present');
  assert.equal(await approvedElevation.locator('.rack-elevation .rack-slot-group .rack-empty').count(),
    Number(await page.evaluate(()=>appState.racks.find(r=>r.name==='Browser Rack')?.heightU || 0)),
    'An empty rack must expose every U through approved Place Here buttons');
  // Draft 04 uses one Placement Type form, not separate legacy action tabs.
  await page.evaluate(() => openRackSlotPlacementDialog(
    appState.racks.find(r=>r.name==='Browser Rack').id,1));
  const approvedPlacement=page.locator('#modal-content .rack-modal');
  await approvedPlacement.waitFor();
  assert.ok(await approvedPlacement.locator('.rack-modal-top h2')
    .getByText('Place Device / Horizontal Accessory at U1',{exact:true}).isVisible(),
    'Clicked rack U must open the approved Draft 04 placement header');
  assert.equal(await approvedPlacement.locator('#rack-placement-form .rack-form-grid #place-item-type').count(),1,
    'Approved equipment placement must use its original Placement Type selector');
  assert.equal(await approvedPlacement.locator('#rack-placement-form #assign-face').count(),1);
  assert.equal(await approvedPlacement.locator('#rack-placement-form #assign-u-start').count(),1);
  await approvedPlacement.locator('#place-item-type').selectOption('accessory');
  assert.ok(await approvedPlacement.locator('#place-accessory-field').isVisible(),
    'Horizontal accessory choice must appear within the same approved placement form');
  assert.ok(await approvedPlacement.locator('#place-port-field').isVisible(),
    'Saved patch-panel port options must remain available');
  assert.ok(await approvedPlacement.locator('#place-device-field').isHidden(),
    'Device selector must hide when placing a horizontal accessory');
  await approvedPlacement.locator('#place-item-type').selectOption('device');
  assert.ok(await approvedPlacement.locator('#place-device-field').isVisible(),
    'Original placement selector must restore the device fields');
  await page.setViewportSize({width:420,height:900});
  assert.equal(await approvedPlacement.locator('.rack-form-grid').evaluate(
    el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),1,
    'Draft 04 placement form must stack on narrow screens');
  await page.evaluate(()=>closeModal(true));
  await page.setViewportSize({width:1440,height:950});
  assert.equal(await rackDetail.locator('.rack-aside > .rack-card.pad').count(),3,
    'Draft 04 must have capacity, available positions and opposite-face cards');
  assert.equal(await rackDetail.locator('.rack-height-picker button').count(),4,
    'Approved Rack View has 1–4U height-selection controls');
  await page.setViewportSize({width:420,height:900});
  assert.equal(await rackDetail.locator('.rack-detail-workspace').evaluate(el=>
    getComputedStyle(el).gridTemplateColumns.split(' ').length),1,
    'The approved rack detail must stack on mobile');
  await page.setViewportSize({width:1440,height:950});

  assert.ok(await rackDetail.locator('.rack-detail-bar .rack-detail-title h2').getByText('Browser Rack',{exact:true}).isVisible(),
    'Approved Draft 04 must display the selected rack name in the detail header');
  assert.ok(await rackDetail.locator('.rack-detail-bar [data-action="v13-back-rack-inventory"]').isVisible(),
    'Approved Rack Detail must have a working Back to Rack Inventory action');
  assert.ok(await rackDetail.locator('.rack-detail-bar [data-action="print-rack-capacity-details"]').isVisible(),
    'Approved Rack Detail must keep the existing Print / PDF action');
  assert.equal(await rackDetail.locator('.rack-subtabs [data-action="select-rack-tab"]').count(),3,
    'Approved Rack Detail must retain Rack View, Equipment and Rack Settings tabs');
  assert.ok(await approvedElevation.locator('.rack-elev-top .rack-face-control [data-action="rack-face-front"]').isVisible(),
    'The approved front/rear control must be available in the rack elevation');
  await rackDetail.locator('[data-action="select-rack-tab"][data-tab="equipment"]').click();
  await page.waitForFunction(()=>activeRackTab==='equipment' &&
    !!document.querySelector('.rack-workspace section[aria-label="Mounted equipment"]:not(.hidden)'),
    null,{timeout:10000});
  assert.ok(await rackDetail.locator('section[aria-label="Mounted equipment"]').isVisible(),
    'Equipment remains available without changing the approved placement logic');
  assert.ok(await rackDetail.locator('section[aria-label="Mounted equipment"] > .rack-card.pad').isVisible(),
    'Equipment must use the original approved card frame');
  assert.equal(await rackDetail.locator('section[aria-label="Mounted equipment"] .rack-table').count(),2,
    'Draft 04 has separate accessories and mounted-device tables');

  await rackDetail.locator('[data-action="select-rack-tab"][data-tab="settings"]').click();
  await page.waitForFunction(()=>activeRackTab==='settings' &&
    !!document.querySelector('.rack-workspace section[aria-label="Rack settings"]:not(.hidden)'),
    null,{timeout:10000});
  assert.ok(await rackDetail.locator('section[aria-label="Rack settings"]').isVisible(),
    'Rack Settings must remain accessible from the selected rack');
  assert.equal(await rackDetail.locator('section[aria-label="Rack settings"] .rack-editor-grid .rack-editor-field').count(),8,
    'Draft 04 Rack Settings must show eight original rack specification tiles');
  assert.equal(await rackDetail.locator('section[aria-label="Rack settings"] .rack-editor-actions button').count(),3,
    'Edit, correct specifications and delete actions must remain protected and available');
  await rackDetail.locator('section[aria-label="Rack settings"] [data-action="edit-rack"]').click();
  await approvedRackForm.waitFor();
  assert.ok(await approvedRackForm.locator('.rack-modal-top h2').getByText('Edit Network Rack',{exact:true}).isVisible(),
    'Approved Draft 04 Edit Rack form must use the same modal structure');
  assert.equal(await approvedRackForm.locator('#rack-height').isDisabled(),true,
    'The normal Edit Rack form must keep physical dimensions locked');
  await approvedRackForm.locator('[data-action="close-modal"]').click();
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));


  await rackDetail.locator('.rack-subtabs [data-action="select-rack-tab"][data-tab="view"]').click();
  await page.waitForFunction(()=>activeRackTab==='view' &&
    !!document.querySelector('.rack-workspace section[aria-label="Visual rack view"]:not(.hidden)'),
    null,{timeout:10000});
  assert.ok(await rackDetail.locator('.rack-elevation').isVisible(),
    'The existing rack elevation must be preserved under the approved tabs');
  await rackDetail.locator('[data-action="v13-back-rack-inventory"]').click();
  assert.ok(await page.locator('#main-content [data-v13-rack-row]').filter({hasText:'Browser Rack'}).isVisible(),
    'Back to Rack Inventory must return to the saved rack directory');
  // The approved Accessories directory opens the protected Equipment tab.
  await page.locator('#main-content .approved-page-header [data-action="approved-rack-section"][data-section-tab="accessories"]').click();
  const accessoryDirectory=page.locator('#main-content #rack-accessory-root .rack-directory');
  await accessoryDirectory.waitFor();
  const accessoryCard=accessoryDirectory.locator('.rack-directory-item[data-action="v13-open-rack-accessories"]')
    .filter({hasText:'Browser Rack'});
  assert.ok(await accessoryCard.isVisible(),'Rack Accessories must use approved directory cards');
  assert.ok(await accessoryCard.getByText('Manage Accessories in Rack',{exact:true}).isVisible(),
    'The approved accessory card action must be retained');
  await accessoryCard.click();
  await page.waitForFunction(()=>v13RackSection==='inventory' && v13RackDetailOpen && activeRackTab==='equipment');
  assert.ok(await page.locator('.rack-workspace section[aria-label="Mounted equipment"]').isVisible(),
    'Selecting approved accessory card must open real rack equipment management');

  await page.locator('#sidebar [data-action="tab-dashboard"]').click();
  console.log('Approved Rack Detail header, tabs and back-navigation passed');

  await modal(page,'openManageLocationsModal');
  await page.locator('#device-catalogue-new-entry-input').fill('Office');
  await page.locator('[data-action="add-device-type-or-location"][data-kind="location"]').click();
  await persisted(page,s=>s.settings.deviceLocations?.includes('Office'),'Location');
  await page.waitForFunction(()=>document.getElementById('toast-message')?.textContent.includes('Location added successfully.'));
  await page.evaluate(()=>closeModal(true));
  console.log('Managed location add passed');

  await modal(page,'openDeviceModal');
  const approvedEditor=page.locator('#modal-content .device-modal.device-review-dialog');
  await approvedEditor.waitFor();
  assert.ok(await page.locator('#modal-container.device-review-overlay #modal-content.approved-device-review-container').isVisible(),
    'Approved Device Add/Edit must mount inside its original Batch 04 overlay');
  assert.equal(await page.locator('#modal-container').evaluate(el=>getComputedStyle(el).position),'fixed',
    'Approved Device dialog overlay must cover the viewport');
  assert.ok(await page.locator('#modal-content').evaluate(el=>el.getAttribute('aria-modal')==='true'),
    'Existing authenticated modal semantics must remain intact');

  assert.ok(await approvedEditor.getByRole('heading',{name:'Add New Device'}).isVisible(),
    'Approved Batch 04 Add Device heading must render');
  assert.ok(await approvedEditor.getByText('DEVICE MANAGEMENT',{exact:true}).isVisible(),
    'Approved Device editor eyebrow must render');
  assert.equal(await approvedEditor.locator('.device-form-tabs.device-review-tabs [role="tab"]').count(),5,
    'All five original Device form tabs must remain available');
  assert.ok(await approvedEditor.locator('#device-form-panel-general .form-section-card.device-review-panel').first().isVisible(),
    'Approved information cards must contain the working legacy form fields');
  assert.ok(await approvedEditor.locator('.device-review-footer button[type="submit"]').isVisible(),
    'Save Device must remain available in the approved footer');
  assert.equal(await approvedEditor.locator('.device-review-footer button[type="submit"]').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(237, 133, 50)',
    'The approved Save Device button must retain the source orange');
  const general=page.locator('#device-form-panel-general');
  await general.waitFor();
  const generalGrid=general.locator(':scope > .device-review-grid');
  assert.equal(await generalGrid.locator(':scope > .device-review-panel.full:visible').count(),2,
    'Approved physical-device General tab must use Device Identity and Mounting cards');
  assert.ok(await generalGrid.locator('#virtual-fields').isHidden(),
    'Virtual Machine Configuration must not be visible on the physical-device General tab');
  const identityCard=generalGrid.locator(':scope > .device-review-panel').first();
  const identityPositions=await identityCard.evaluate(card=>Object.fromEntries(['dev-name','dev-deployment','dev-type','dev-location'].map(id=>{const r=card.querySelector('#'+id).getBoundingClientRect();return [id,{x:r.x,y:r.y}]})));
  assert.equal(identityPositions['dev-type'].x,identityPositions['dev-name'].x,
    'Physical Device Type must occupy the separate left-column field in the source grid');
  assert.equal(identityPositions['dev-location'].x,identityPositions['dev-deployment'].x,
    'Location Area must occupy the right column of the source identity grid');

  assert.ok(await identityCard.getByRole('heading',{name:'Device Identity'}).isVisible());
  assert.equal(await identityCard.locator('#dev-name').count(),1,
    'Original Device Name input must stay in Device Identity');
  assert.equal(await identityCard.locator('#dev-location').count(),1,
    'Approved Location Area must live inside Device Identity, not Mounting');
  assert.equal(await generalGrid.locator('#device-form-mounting-options #dev-location').count(),0,
    'Mounting must not contain a duplicate Location Area control');
  assert.ok(await generalGrid.getByRole('heading',{name:'Mounting & Rack Configuration'}).isVisible());
  for(const id of ['dev-mount-type','dev-rack-id','dev-rack-face','dev-rack-u','dev-rack-height']){
    assert.equal(await generalGrid.locator('#device-form-mounting-options #'+id).count(),1,
      'Mounting card must preserve live Rack control '+id);
  }
  assert.equal(await generalGrid.evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),2,
    'Approved source General cards must use desktop columns');
  assert.equal(await identityCard.locator('.device-review-form-grid').evaluate(
    el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),2,
    'Approved Device Identity fields must use the two-column source grid');
  await identityCard.getByRole('button',{name:'+ Add Location'}).click();
  assert.ok(await identityCard.locator('#dev-create-location-panel').isVisible(),
    'Add Location must open the existing live location editor');
  await identityCard.locator('[data-action="cancel-custom-location"]').click();
  assert.ok(await identityCard.locator('#dev-create-location-panel').isHidden(),
    'Cancelling inline Location must retain the existing field');
  await page.setViewportSize({width:420,height:900});
  assert.equal(await generalGrid.evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),1,
    'Approved General cards must stack at mobile width');
  assert.equal(await identityCard.locator('.device-review-form-grid').evaluate(
    el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),1,
    'Approved Device Identity fields must stack on mobile');
  await page.setViewportSize({width:1440,height:950});
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
  assert.deepEqual(await page.locator('form[data-device-form="true"]').evaluate(form=>
    [...form.elements].filter(field=>field.validity&&!field.validity.valid).map(field=>({id:field.id,message:field.validationMessage}))),[],
    'The source editor grid must retain a valid device and networking form before saving');
  await page.locator('button[type="submit"][form="device-editor-form"]').click();
  const saved=await persisted(page,s=>s.devices.some(d=>d.name==='browser-device'),'Device');
  const device=saved.devices.find(d=>d.name==='browser-device');
  assert.equal(saved.ipAllocations['10.64.20.10'].deviceId,device.id);
  console.log('Device form and primary IPAM allocation passed');

  // Approved intelligence chart rows open the *real*, permission-aware inventory.
  await page.locator('#sidebar [data-action="tab-devices"]').click();
  await page.locator('#main-content [data-action="approved-device-section"][data-tab="overview"]').click();
  const desktopTypeBreakdown=page.locator('#main-content [data-insight-panel="overview"] .intelligence-chart-row[data-kind="type"][data-value="Desktop"]');
  await desktopTypeBreakdown.waitFor();
  assert.ok(await desktopTypeBreakdown.isVisible(),
    'The approved Devices by Type chart must use saved inventory rather than preview data');
  await desktopTypeBreakdown.click();
  // Pinned Device Inventory Draft 02, not the old toolbar/table arrangement.
  const approvedInventory=page.locator('#main-content [data-device-panel="inventory"]');
  await approvedInventory.waitFor();
  assert.equal(await approvedInventory.locator('.device-toolbar .device-filters select').count(),5,
    'The approved Device Inventory has exactly five primary search filters');
  assert.ok(await approvedInventory.locator('.device-results-head #device-sort').isVisible(),
    'Sort must be inside the approved results header, not an extra toolbar filter');
  assert.ok(await approvedInventory.locator('.device-toolbar .device-search-wrap #device-search').isVisible(),
    'Approved Search Devices input must remain connected to live inventory');
  assert.ok(await approvedInventory.locator('.device-table-card .device-table-scroll .device-table').isVisible(),
    'Device table must use the original Draft 02 table/card structure');
  assert.ok(await approvedInventory.locator('.device-results-head #device-result-count').isVisible(),
    'The approved device results header must show actual saved-record counts');
  await page.setViewportSize({width:420,height:900});
  assert.equal(await approvedInventory.locator('.device-filters').evaluate(el=>
    getComputedStyle(el).gridTemplateColumns.split(' ').length),1,
    'The five approved Device Inventory filters must stack on mobile');
  await page.setViewportSize({width:1440,height:950});

  await page.waitForFunction(()=>activeDeviceDetailsTab==='inventory' && deviceTypeFilter==='Desktop');
  assert.ok(await page.locator('#main-content [data-device-panel="inventory"] .device-table').getByText('browser-device').isVisible(),
    'Clicking the approved chart row must open the filtered live Device Inventory');

  await approvedInventory.locator('#device-search').fill('no-device-with-this-name-2026');
  assert.equal(await approvedInventory.locator('.device-table tbody .device-name').count(),0,
    'Approved search input must filter live records without preview script handlers');
  await approvedInventory.locator('#device-search').fill('');
  assert.ok(await approvedInventory.locator('.device-table tbody .device-name').filter({hasText:'browser-device'}).isVisible(),
    'Clearing approved inventory search must restore saved records');
  await approvedInventory.locator('#device-sort').selectOption('name-desc');
  assert.equal(await approvedInventory.locator('#device-sort').inputValue(),'name-desc',
    'Moving the approved Sort control must retain the existing sort interaction');

  await page.locator('#main-content [data-action="clear-device-filters"]').first().click();

  // Draft 03's Hardware panel must render its original metric, card and chart structure.
  await page.locator('#main-content [data-action="approved-device-section"][data-tab="overview"]').click();
  await page.locator('#main-content [data-action="device-intelligence-tab"][data-tab="hardware"]').click();
  const approvedHardware=page.locator('#main-content .intelligence-panel[data-insight-panel="hardware"]');
  await approvedHardware.waitFor();
  assert.ok(await approvedHardware.isVisible(),'Approved Hardware panel should be selected');
  assert.equal(await approvedHardware.locator('#hardware-metrics .intelligence-metric').count(),3,
    'Approved Hardware overview must show the three live recorded-field totals');
  assert.equal(await approvedHardware.locator('article.intelligence-card').count(),3,
    'Approved Hardware overview must retain the manufacturer, model and mounting cards');
  assert.deepEqual(await approvedHardware.locator('article.intelligence-card h3').allTextContents(),
    ['Manufacturers','Models','Mounting Methods']);
  assert.equal(await approvedHardware.locator('.intelligence-chart').count(),3,
    'Every Hardware card needs the original approved chart-row structure');
  const mountingRow=approvedHardware.locator('.intelligence-chart-row[data-field="mountType"][data-value="Tabletop / Shelf Mounted"]');
  assert.ok(await mountingRow.isVisible(),'Hardware chart must show real recorded mounting methods');
  await mountingRow.click();
  await page.waitForFunction(()=>activeDeviceDetailsTab==='inventory' &&
    deviceHardwareFilter?.field==='mountType' &&
    deviceHardwareFilter?.value==='Tabletop / Shelf Mounted');
  assert.ok(await page.locator('#main-content [data-device-panel="inventory"] .device-table')
    .getByText('browser-device').isVisible(),
    'Approved Mounting Methods chart must open matching saved devices');
  await page.locator('#main-content [data-action="clear-device-filters"]').first().click();



  // Remaining approved Draft 03 tabs use their source cards and real inventory.
  await page.locator('#main-content [data-action="approved-device-section"][data-tab="overview"]').click();
  await page.locator('#main-content [data-action="device-intelligence-tab"][data-tab="os"]').click();
  const approvedOs=page.locator('#main-content .intelligence-panel[data-insight-panel="os"]');
  await approvedOs.waitFor();
  assert.ok(await approvedOs.isVisible(),'Approved Operating Systems panel must be visible');
  assert.deepEqual(await approvedOs.locator('article.intelligence-card h3').allTextContents(),
    ['Operating Systems','Platform information'],
    'Operating Systems must use both original Draft 03 cards');
  const osRow=approvedOs.locator('#insight-operating-systems .intelligence-chart-row').first();
  assert.ok(await osRow.isVisible(),'Operating Systems must use actual recorded platforms');
  const osValue=await osRow.getAttribute('data-os');
  await osRow.click();
  await page.waitForFunction(value=>activeDeviceDetailsTab==='inventory' && deviceOsFilter===value,osValue);
  assert.ok((await page.evaluate(()=>getVisibleDevices().map(d=>getEffectiveDevicePlatform(d))))
    .every(value=>value===osValue),'Operating Systems chart must filter the actual saved device platforms');
  await page.locator('#main-content [data-action="clear-device-filters"]').first().click();

  await page.locator('#main-content [data-action="approved-device-section"][data-tab="overview"]').click();
  await page.locator('#main-content [data-action="device-intelligence-tab"][data-tab="software"]').click();
  const approvedSoftware=page.locator('#main-content .intelligence-panel[data-insight-panel="software"]');
  await approvedSoftware.waitFor({state:'visible'});
  assert.ok(await approvedSoftware.isVisible(),'Approved Software & Services panel must be visible');
  assert.deepEqual(await approvedSoftware.locator('article.intelligence-card h3').allTextContents(),
    ['Software & Services','Installed software','Devices with Archived Software'],
    'Software & Services must use the original three-card structure');
  assert.ok(await approvedSoftware.locator('#insight-software.intelligence-chart').isVisible());
  assert.ok(await approvedSoftware.locator('#insight-archived').isVisible(),
    'Archived-software references must remain in the approved card');
  const serviceRows=approvedSoftware.locator('#insight-software .intelligence-chart-row');
  if(await serviceRows.count()){
    const firstService=serviceRows.first(),serviceValue=await firstService.getAttribute('data-value');
    await firstService.click();
    await page.waitForFunction(value=>activeDeviceDetailsTab==='inventory' && deviceServiceFilter===value,serviceValue);
    await page.locator('#main-content [data-action="clear-device-filters"]').first().click();
    await page.locator('#main-content [data-action="approved-device-section"][data-tab="overview"]').click();
  }else{
    assert.ok(await approvedSoftware.locator('#insight-software .intelligence-empty').isVisible(),
      'Without recorded software, the approved empty-state must appear');
  }

  await page.locator('#main-content [data-action="device-intelligence-tab"][data-tab="quality"]').click();
  const approvedQuality=page.locator('#main-content .intelligence-panel[data-insight-panel="quality"]');
  await approvedQuality.waitFor({state:'visible'});
  assert.ok(await approvedQuality.isVisible(),'Approved Data Quality panel must be visible');
  assert.equal(await approvedQuality.locator('article.intelligence-card').count(),1);
  assert.equal(await approvedQuality.locator('#insight-quality .intelligence-quality-card').count(),3,
    'Data Quality must use three original approved quality cards');
  const qualityIp=approvedQuality.locator('.intelligence-quality-card[data-value="ip"]');
  assert.equal(Number(await qualityIp.locator('.quality-number').textContent()),
    await page.evaluate(()=>appState.devices.filter(d=>!String(d.primaryIp||'').trim()).length),
    'Approved Data Quality count must reflect actual saved inventory');
  await page.setViewportSize({width:420,height:900});
  assert.equal(await approvedQuality.locator('.intelligence-breakdown').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),2,
    'Draft 03 mobile quality cards must use two-column responsive grid');
  await page.setViewportSize({width:1440,height:950});
  await qualityIp.click();
  await page.waitForFunction(()=>activeDeviceDetailsTab==='inventory' && deviceMissingFilter==='ip');
  assert.ok((await page.evaluate(()=>getVisibleDevices().map(d=>d.primaryIp)))
    .every(value=>!String(value||'').trim()),
    'Data Quality action must open actual devices with missing IP addresses');
  await page.locator('#main-content [data-action="clear-device-filters"]').first().click();

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

  // A detected inconsistency appears only as an administrator warning; no data
  // is saved. Check the transient in-memory duplicate synchronously: a legitimate
  // asynchronous state refresh can otherwise erase the temporary test input.
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));
  const inventoryHealth=await page.evaluate(()=>{
    switchTab('dashboard');
    const existing=appState.devices.find(d=>d.name==='browser-device');
    if(!existing)throw Error('Browser test device missing');
    appState.devices.push({...existing});
    renderContent();
    const health=document.getElementById('next-dashboard-inventory-health');
    const result={
      present:!!health,
      duplicate:!!health&&/Duplicate or missing device ID/.test(health.textContent),
      approvedComponent:!!health&&health.classList.contains('db-error-card')
    };
    const duplicates=appState.devices.map((d,i)=>d.name==='browser-device'?i:-1).filter(i=>i>=0);
    if(duplicates.length>1)appState.devices.splice(duplicates[duplicates.length-1],1);
    renderContent();
    result.cleared=!document.getElementById('next-dashboard-inventory-health');
    return result;
  });
  assert.equal(inventoryHealth.present,true,'Admin must see actual inventory inconsistencies');
  assert.equal(inventoryHealth.duplicate,true,'Admin warning must identify duplicate or missing device IDs');
  assert.equal(inventoryHealth.approvedComponent,true,
    'Inventory Health must retain the accepted Dashboard warning component');
  assert.equal(inventoryHealth.cleared,true,'Corrected inventory must hide the warning');

  // Published IPAM paths: device-linked notes and independent reservations.
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));
  await page.evaluate(()=>openIpModal('10.64.20.10'));
  assert.ok(await page.locator('#modal-content.approved-ipam-modal .ipam-modal-explain.warn').isVisible(),
    'Device-owned IP modal must explain that its assignment is protected');
  assert.ok(await page.locator('#ip-status').isDisabled(),
    'Device-owned IP status must not be changed from IPAM');
  assert.ok(await page.locator('#ip-hostname').isDisabled(),
    'Device-owned hostname must remain controlled by the Device form');
  assert.ok(await page.locator('#ip-notes').isEnabled(),
    'Device-owned IPAM notes must remain editable for authorised users');
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
  const ipamBulkDialog=page.locator('#modal-content.approved-ipam-modal');
  assert.ok(await ipamBulkDialog.locator('.ipam-modal-head h2').getByText('Bulk Edit IP Range',{exact:true}).isVisible(),
    'Bulk IPAM editor must use the approved Draft 01 dialog structure');
  assert.equal(await ipamBulkDialog.locator('.ipam-form-grid > .ipam-field').count(),5,
    'Bulk IPAM editor must show the approved From, To, Status, Hostname and Notes controls');
  assert.equal(await page.locator('#bulk-start').inputValue(),'10.64.20.1',
    'Bulk IPAM must default to a usable IP address rather than an internal host offset');
  await page.locator('#bulk-start').fill('10.64.20.20');
  await page.locator('#bulk-end').fill('10.64.20.22');
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
  const bulkPreviewDialog=page.locator('#modal-content.approved-ipam-modal');
  assert.ok(await bulkPreviewDialog.locator('.ipam-modal-head h2')
    .getByText('Confirm bulk reservation',{exact:true}).isVisible(),
    'The real bulk confirmation must use the approved Draft 01 modal');
  assert.ok(await bulkPreviewDialog.locator('.ipam-modal-actions [data-action="apply-bulk-ip-assignment"]').isVisible(),
    'The existing protected Apply action must remain in the approved footer');
  await bulkPreviewDialog.locator('.ipam-modal-actions [data-action="return-from-bulk-ip-assignment"]').click();
  assert.equal(await page.locator('#bulk-start').inputValue(),'10.64.20.20',
    'Going back from preview must preserve the original starting IP address');
  assert.equal(await page.locator('#bulk-end').inputValue(),'10.64.20.22',
    'Going back from preview must preserve the original ending IP address');
  assert.equal(await page.locator('#bulk-hostname').inputValue(),'pool',
    'Going back from preview must not discard the hostname prefix');
  await page.locator('form[data-form-action="bulk-ip"] button[type="submit"]').click();
  await bulkPreviewDialog.locator('.ipam-modal-head h2').getByText('Confirm bulk reservation',{exact:true}).waitFor();
  const bulkResponse=page.waitForResponse(res=>res.url().endsWith('/api/ipam/allocation/bulk'));
  await page.locator('[data-action="apply-bulk-ip-assignment"]').click();
  assert.equal((await bulkResponse).status(),200,'Bulk IPAM save request rejected');
  await persisted(page,s=>[20,21,22].every(n=>
    s.ipAllocations['10.64.20.'+n]?.status==='Reserved'),'Bulk IPAM reservation');
  assert.equal((await state(page)).ipAllocations['10.64.20.20'].notes,'Bulk notes');
  await page.evaluate(id=>deleteSubnet(id),subnetId);
  const blockedIpamDelete=page.locator('#modal-content.approved-ipam-modal');
  assert.ok(await blockedIpamDelete.locator('.ipam-modal-head h2')
    .getByText('Subnet Deletion Blocked',{exact:true}).isVisible(),
    'Protected subnet deletion must retain its safety warning in the approved modal');
  assert.ok(await blockedIpamDelete.locator('[aria-label="Protected IP addresses"]').isVisible(),
    'Blocked deletion must show the actual protected IP addresses');
  assert.ok((await state(page)).subnets.some(s=>s.id===subnetId),
    'Viewing a blocked deletion must never remove the selected subnet');
  await blockedIpamDelete.locator('.ipam-modal-actions [data-action="close-modal"]').click();
  await page.locator('#modal-container').waitFor({state:'hidden'});
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
  await page.locator('button[type="submit"][form="device-editor-form"]').click();
  const switchState=await persisted(page,s=>s.devices.some(d=>d.name==='rack-switch' &&
    d.rackId===rackId && Number(d.rackUStart)===5),'Rack-mounted device creation');
  const rackSwitch=switchState.devices.find(d=>d.name==='rack-switch');
  assert.equal(switchState.ipAllocations['10.64.20.11'].deviceId,rackSwitch.id);
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));
  // Save a real mounted-device move using the Draft 04 combined placement form.
  await page.evaluate(id=>openRackSlotPlacementDialog(id,6,'device'),rackId);
  const savedPlacement=page.locator('#rack-placement-form');
  await savedPlacement.locator('#assign-device-id').selectOption(rackSwitch.id);
  await savedPlacement.locator('#assign-face').selectOption('front');
  await savedPlacement.locator('#assign-u-start').selectOption('6');
  assert.equal(await savedPlacement.locator('#place-height').isDisabled(),true,
    'Device height must be determined by the inventory record, not edited independently');
  await savedPlacement.locator('button[type="submit"]').click();
  await persisted(page,s=>s.devices.some(d=>d.id===rackSwitch.id && d.rackId===rackId &&
    Number(d.rackUStart)===6),'Draft 04 rack device move');
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));

  // The original combined form also saves horizontal accessories to SQLite.
  await page.evaluate(id=>openRackSlotPlacementDialog(id,3,'accessory'),rackId);
  const savedAccessoryPlacement=page.locator('#rack-placement-form');
  assert.equal(await savedAccessoryPlacement.locator('#place-item-type').inputValue(),'accessory');
  await savedAccessoryPlacement.locator('#place-accessory-type').selectOption('patch');
  await savedAccessoryPlacement.locator('#place-accessory-name-input').fill('Browser Patch Panel');
  await savedAccessoryPlacement.locator('#place-height').fill('1');
  await savedAccessoryPlacement.locator('#place-height').blur();
  await savedAccessoryPlacement.locator('#assign-u-start').selectOption('3');
  await savedAccessoryPlacement.locator('#place-port-count').selectOption('24');
  await savedAccessoryPlacement.locator('button[type="submit"]').click();
  await persisted(page,s=>s.rackAccessories.some(a=>a.name==='Browser Patch Panel' &&
    a.type==='patch' && Number(a.portCount)===24 &&
    a.rackId===rackId && Number(a.startU)===3),'Draft 04 horizontal rack accessory');
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));

  // Existing accessory editing must remain connected after the new placement flow.
  const savedPatch=(await state(page)).rackAccessories.find(a=>a.name==='Browser Patch Panel');
  await page.evaluate(({id,accessoryId})=>openRackAccessoryEditor(id,3,accessoryId),
    {id:rackId,accessoryId:savedPatch.id});
  const rackAccessoryModal=page.locator('#modal-content .rack-modal.accessory-modal');
  assert.ok(await rackAccessoryModal.locator('.rack-modal-top h2')
    .getByText('Edit Horizontal Accessory Placement',{exact:true}).isVisible(),
    'Editing a saved horizontal accessory must use the Draft 04 modal header');
  assert.ok(await rackAccessoryModal.locator('.rack-form-grid > .rack-field').count()>=6,
    'The saved accessory editor must retain the approved form grid');
  assert.equal(await rackAccessoryModal.locator('#rack-accessory-form [name="name"]').inputValue(),
    'Browser Patch Panel','Accessory editing must load existing saved data');
  await page.evaluate(()=>closeModal(true));

  await page.evaluate(id=>{
    selectedRackAccessoryType='pdu_vertical';
    openRackAccessoryEditor(id,1);
  },rackId);
  assert.ok(await page.locator('#modal-content .rack-modal-top h2')
    .getByText('Add Vertical 0U Accessory',{exact:true}).isVisible(),
    '0U editor must use the approved dedicated vertical accessory modal');
  assert.ok(await page.locator('#rack-accessory-form #rack-side-field').isVisible(),
    'The original left/right 0U rail selector must remain visible');
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
  await page.locator('#sidebar [data-action="tab-racks"]').click();
  await page.locator('#main-content .approved-page-header [data-action="approved-rack-section"][data-section-tab="accessories"]').click();
  const savedAccessoryCard=page.locator('#rack-accessory-root .rack-directory-item')
    .filter({hasText:'Browser Rack'});
  assert.ok(await savedAccessoryCard.getByText('2 accessories · 1 vertical 0U rails',{exact:true}).isVisible(),
    'Approved Rack Accessories directory must reflect saved accessories and 0U rails');

  console.log('Rack device placement, patch panel and vertical PDU persisted after reload');

  // Preserve the front/rear rack view and its printable elevations.
  await page.locator('#sidebar [data-action="tab-racks"]').click();
  await page.locator('#main-content .approved-page-header [data-action="approved-rack-section"][data-section-tab="inventory"]').click();
  await page.locator('[data-action="v13-open-rack"][data-id="'+rackId+'"]').click();
  await page.locator('.rack-elevation [data-rack-device="'+rackSwitch.id+'"]').waitFor();
  // The Rack View and Equipment tabs each retain their own face control.
  // Scope the navigation assertion to the visible elevation toolbar.
  const rackElevationFaces=page.locator('#main-content .rack-elev-top .rack-face-control');
  await rackElevationFaces.locator('[data-action="rack-face-rear"]').click();
  await page.waitForFunction(()=>document.querySelector('#main-content .rack-elev-top .rack-face-control [data-action="rack-face-rear"]')?.getAttribute('aria-pressed')==='true',
    null,{timeout:5000});
  assert.equal(await rackElevationFaces.locator('[data-action="rack-face-rear"]').getAttribute('aria-pressed'),'true');
  assert.ok(await page.locator('[aria-label="Side orientation as viewed from rear face"]').isVisible());
  assert.equal(await page.locator('.rack-elevation [data-rack-device]').count(),0,
    'A front-mounted switch must not appear on the rear face');
  await rackElevationFaces.locator('[data-action="rack-face-front"]').click();
  await page.waitForFunction(()=>document.querySelector('#main-content .rack-elev-top .rack-face-control [data-action="rack-face-front"]')?.getAttribute('aria-pressed')==='true',
    null,{timeout:5000});
  assert.equal(await rackElevationFaces.locator('[data-action="rack-face-front"]').getAttribute('aria-pressed'),'true');
  await page.locator('.rack-elevation [data-rack-device="'+rackSwitch.id+'"]').waitFor();
  assert.ok(await page.locator('[aria-label="Side orientation as viewed from front face"]').isVisible());
  // Dispatch real HTML5 drag events through the mounted DOM and verify central saves.
  async function dragRackItem(sourceSelector,targetSelector,vertical=false){
    await page.evaluate(({sourceSelector,targetSelector,vertical})=>{
      const source=document.querySelector(sourceSelector),target=document.querySelector(targetSelector);
      if(!source||!target||!source.draggable)throw Error('Rack drag surface is unavailable');
      const transfer=new DataTransfer(),start=source.getBoundingClientRect(),end=target.getBoundingClientRect();
      const point={clientX:end.x+end.width/2,clientY:vertical?end.bottom-end.height*2.5/42:end.y+end.height/2};
      source.dispatchEvent(new DragEvent('dragstart',{bubbles:true,dataTransfer:transfer,clientX:start.x+start.width/2,clientY:start.y+start.height/2}));
      target.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer:transfer,...point}));
      target.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:transfer,...point}));
      source.dispatchEvent(new DragEvent('dragend',{bubbles:true,dataTransfer:transfer,...point}));
    },{sourceSelector,targetSelector,vertical});
  }
  const draggedDevice='[data-rack-device="'+rackSwitch.id+'"]';
  await dragRackItem(draggedDevice,'[data-rack-drop-u="10"]');
  await persisted(page,s=>Number(s.devices.find(d=>d.id===rackSwitch.id).rackUStart)===10,'Device drag to U10');
  await page.waitForSelector(draggedDevice+'[data-rack-drop-u="10"]');
  await dragRackItem(draggedDevice,'[data-rack-drop-u="3"]');
  assert.equal(Number((await state(page)).devices.find(d=>d.id===rackSwitch.id).rackUStart),10,
    'A drag onto an occupied rack position must not change persisted placement');
  await dragRackItem(draggedDevice,'[data-rack-drop-u="6"]');
  await persisted(page,s=>Number(s.devices.find(d=>d.id===rackSwitch.id).rackUStart)===6,'Device drag back to U6');
  const draggedPatch='[data-rack-accessory="'+savedPatch.id+'"]';
  await dragRackItem(draggedPatch,'[data-rack-drop-u="4"]');
  await persisted(page,s=>Number(s.rackAccessories.find(a=>a.id===savedPatch.id).startU)===4,'Horizontal accessory drag');
  await page.waitForSelector(draggedPatch+'[data-rack-drop-u="4"]');
  await dragRackItem(draggedPatch,'[data-rack-drop-u="3"]');
  await persisted(page,s=>Number(s.rackAccessories.find(a=>a.id===savedPatch.id).startU)===3,'Horizontal accessory drag back');
  const verticalAccessory=(await state(page)).rackAccessories.find(a=>a.name==='Browser Vertical PDU');
  await dragRackItem('[data-vertical-accessory="'+verticalAccessory.id+'"]','.vertical-rack-accessory-rail[data-side="right"]',true);
  await persisted(page,s=>s.rackAccessories.find(a=>a.id===verticalAccessory.id).side==='right','Vertical accessory drag to right rail');
  await dragRackItem('[data-vertical-accessory="'+verticalAccessory.id+'"]','.vertical-rack-accessory-rail[data-side="left"]',true);
  await persisted(page,s=>s.rackAccessories.find(a=>a.id===verticalAccessory.id).side==='left','Vertical accessory drag back to left rail');
  console.log('Rack device, horizontal accessory and L/R 0U HTML5 drag handlers, collision rejection and SQLite saves passed');

  // Exercise the real print action, capturing its HTML without invoking the system print dialog.
  await page.evaluate(()=>{
    window.__rackPrintMarkup='';
    window.__rackOriginalOpen=window.open;
    window.open=()=>({document:{open(){},write(html){window.__rackPrintMarkup=html;},close(){}},
      focus(){},print(){}});
  });
  let rackPrintMarkup='';
  try{
    await page.locator('#main-content .rack-detail-bar [data-action="print-rack-capacity-details"]').click();
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
  await approvedEditor.waitFor();
  assert.equal(await approvedEditor.locator('.device-review-head h2').textContent(),'Add New Device');
  assert.ok(await approvedEditor.locator('#device-form-panel-general').getByRole('heading',{name:'Device Identity'}).isVisible(),
    'Approved Device Identity heading must be visible in the reopened General tab');
  assert.deepEqual(await approvedEditor.locator('[role="tab"]').allTextContents(),
    ['General','Hardware','Software & Firmware','Networking','Notes']);
  await approvedEditor.getByRole('tab',{name:'Hardware'}).click();
  const hardwareCardGrid=approvedEditor.locator('#device-form-panel-hardware > .device-review-grid');
  assert.equal(await hardwareCardGrid.locator(':scope > .device-review-panel.full').count(),1,
    'Approved Hardware tab must use one full-width source card');
  const approvedHardwareFields=hardwareCardGrid.locator('.device-review-form-grid').first();
  assert.equal(await approvedHardwareFields.locator(':scope > .device-review-field').count(),3,
    'Approved Batch 04 Manufacturer, Model and Serial fields must share the original source grid');
  for(const id of ['physical-manufacturer','physical-model']){
    assert.ok(await approvedHardwareFields.locator('#'+id+'.device-review-field').isVisible(),
      'Pinned hardware field must retain its original id: '+id);
  }
  assert.ok(await approvedHardwareFields.locator('.device-review-field #dev-serial').isVisible(),
    'The original serial input remains connected to the saved hardware form');
  assert.equal(await approvedHardwareFields.evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),2,
    'Approved hardware field grid must use two desktop columns');
  await page.setViewportSize({width:420,height:900});
  assert.equal(await approvedHardwareFields.evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),1,
    'Pinned hardware field grid must stack to one column on mobile');
  await page.setViewportSize({width:1440,height:950});
  assert.ok(await approvedEditor.locator('#device-form-panel-hardware').getByRole('heading',{name:'Hardware & Lifecycle'}).isVisible(),
    'Approved Hardware card must be present');
  assert.ok(await approvedEditor.locator('#dev-manufacturer-select').isVisible(),
    'The live manufacturer selector must remain available');
  await approvedEditor.getByRole('tab',{name:'Software & Firmware'}).click();
  const softwareGrid=approvedEditor.locator('#device-form-panel-software > .device-review-grid');
  assert.deepEqual(await softwareGrid.locator(':scope > .device-review-panel').evaluateAll(
    nodes=>nodes.map(el=>el.id)),
    ['software-platform','device-form-installed-software-section','host-platform-fields','server-services-section'],
    'Source Software & Firmware cards must use the approved order');
  assert.ok(await softwareGrid.getByRole('heading',{name:'Operating System / Platform'}).isVisible(),
    'Operating System source card heading must be visible');
  assert.equal(await softwareGrid.getByRole('heading',{name:'Virtualisation / Hypervisor',includeHidden:true}).count(),1,
    'Physical hypervisor card must retain approved source heading');
  const platformGrid=softwareGrid.locator('#software-platform > .device-review-form-grid');
  for(const id of ['platform-select','platform-name','version-select','platform-version','device-form-windows-licence']){
    assert.equal(await platformGrid.locator('#'+id).count(),1,
      'Source platform card must retain its live field '+id);
  }
  assert.equal(await softwareGrid.evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),2,
    'Approved Software card grid must use desktop columns');
  await page.setViewportSize({width:420,height:900});
  assert.equal(await softwareGrid.evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),1,
    'Approved Software cards must stack on mobile');
  assert.equal(await platformGrid.evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),1,
    'Operating System fields must stack on mobile');
  await page.setViewportSize({width:1440,height:950});
  await approvedEditor.getByRole('tab',{name:'General'}).click();
  await page.setViewportSize({width:420,height:900});
  assert.equal(await page.locator('#modal-container.device-review-overlay').evaluate(el=>getComputedStyle(el).paddingLeft),'0px',
    'Pinned Batch 04 mobile overlay must have zero padding');
  assert.equal(await approvedEditor.evaluate(el=>Math.round(el.getBoundingClientRect().width)),420,
    'Approved Device editor must span the full 420px viewport on mobile');
  assert.equal(await approvedEditor.evaluate(el=>getComputedStyle(el).borderTopLeftRadius),'0px',
    'Approved mobile Device dialog must be edge-to-edge');
  assert.equal(await approvedEditor.locator('#device-form-panel-general > .device-review-grid').evaluate(
    node=>getComputedStyle(node).gridTemplateColumns.split(' ').length),1,
    'Device Editor source card grid must stack at mobile width');
  assert.ok(await approvedEditor.locator('.device-review-footer button[type="submit"]').isVisible(),
    'Save Device must remain accessible on mobile');
  const editorFooterButtons=await approvedEditor.locator('.device-review-footer button').evaluateAll(nodes=>nodes.map(el=>el.getBoundingClientRect().y));
  assert.equal(editorFooterButtons[0],editorFooterButtons[1],
    'Approved mobile Cancel and Save Device controls must share one row');
  await page.setViewportSize({width:1440,height:950});
  await page.locator('#dev-name').fill('browser-hypervisor');
  await page.locator('#dev-type').selectOption('Server - Physical');
  await approvedEditor.getByRole('tab',{name:'Hardware'}).click();

  // Exact Batch 04 inline Manufacturer/Model additions must be saved through
  // the existing hardware catalogue while keeping the Device editor open.
  const hardwareTab=approvedEditor.locator('#device-form-panel-hardware');
  const addManufacturer=hardwareTab.locator('[data-action="device-inline-quick-open"][data-kind="manufacturer"]');
  const addModel=hardwareTab.locator('[data-action="device-inline-quick-open"][data-kind="model"]');
  assert.ok(await addManufacturer.isVisible()&&await addModel.isVisible(),
    'Pinned Batch 04 hardware editor must offer both inline quick-add buttons');
  await addManufacturer.click();
  const makerPanel=hardwareTab.locator('.device-review-inline-create[data-review-create="manufacturer"]');
  assert.ok(await makerPanel.isVisible(),'Approved inline Manufacturer panel must open in place');
  assert.ok(await makerPanel.locator('[data-review-associated-types="manufacturer"] input[value="Server - Physical"]').isChecked(),
    'The current physical type must be selected by default');
  await makerPanel.locator('[data-review-new-name="manufacturer"]').fill('Browser Inline Manufacturer');
  await makerPanel.locator('[data-action="device-inline-quick-save"]').click();
  await persisted(page,s=>s.settings.hardwareCatalogue?.some(x=>
    x.manufacturer==='Browser Inline Manufacturer'&&x.type==='Server - Physical'&&!x.model),
    'Inline manufacturer');
  await page.waitForFunction(()=>document.getElementById('dev-manufacturer')?.value==='Browser Inline Manufacturer');
  assert.equal(await approvedEditor.locator('#dev-manufacturer-select').inputValue(),'Browser Inline Manufacturer',
    'Saved manufacturer must be selected in the existing device form');
  assert.ok(await makerPanel.isHidden(),'Successful inline creation must dismiss the Manufacturer panel');
  await addModel.click();
  const modelPanel=hardwareTab.locator('.device-review-inline-create[data-review-create="model"]');
  assert.ok(await modelPanel.isVisible(),'Approved inline Model panel must open in place');
  await modelPanel.locator('[data-review-new-name="model"]').fill('Browser Inline Model');
  await modelPanel.locator('[data-action="device-inline-quick-save"]').click();
  await persisted(page,s=>s.settings.hardwareCatalogue?.some(x=>
    x.manufacturer==='Browser Inline Manufacturer'&&x.model==='Browser Inline Model'&&x.type==='Server - Physical'),
    'Inline model');
  await page.waitForFunction(()=>document.getElementById('dev-model')?.value==='Browser Inline Model');
  assert.equal(await approvedEditor.locator('#dev-model-select').inputValue(),'Browser Inline Model',
    'Saved model must be selected in the existing device form');
  await addManufacturer.click();
  await makerPanel.locator('[data-review-new-name="manufacturer"]').fill('Browser Inline Manufacturer');
  await makerPanel.locator('[data-action="device-inline-quick-save"]').click();
  assert.match(await makerPanel.locator('[data-review-create-error]').textContent(),/already exists/,
    'Duplicate manufacturers must be rejected without mutating the saved catalogue');
  await makerPanel.locator('[data-action="device-inline-quick-cancel"]').click();
  assert.ok(await makerPanel.isHidden(),'Cancel must dismiss the source-style inline panel');
  await page.setViewportSize({width:420,height:900});
  await addModel.click();
  assert.equal(await modelPanel.locator('.device-review-inline-add-actions .device-review-field').evaluate(el=>
    Math.round(el.getBoundingClientRect().width)),
    await modelPanel.locator('.device-review-inline-add-actions').evaluate(el=>
    Math.round(el.getBoundingClientRect().width)),
    'Approved inline hardware form field must span its mobile container');
  await modelPanel.locator('[data-action="device-inline-quick-cancel"]').click();
  await page.setViewportSize({width:1440,height:950});
  console.log('Approved inline hardware catalogue, SQLite persistence, duplicate protection and mobile layout passed');

  // Batch 04 uses the original field wrapper for native Add/Edit inputs.
  // Check DOM hierarchy, not merely that a CSS class exists elsewhere.
  const sourceFieldControls=['dev-name','dev-deployment','dev-type','dev-mount-type',
    'dev-rack-id','dev-rack-face','dev-rack-u','dev-rack-height',
    'dev-block','dev-ip'];
  for(const id of sourceFieldControls){
    assert.equal(await approvedEditor.locator('.device-review-field > #'+id+', .device-review-field > label + #'+id).count(),1,
      'Approved Add/Edit field wrapper must contain the existing '+id+' input');
  }
  assert.equal(await approvedEditor.locator('.device-review-field > #dev-status').count(),0,
    'New devices retain their hidden status outside the approved visible field controls');
  console.log('Approved Add/Edit identity, rack and IPAM source field wrappers passed');

  const dynamicDeviceFields=approvedEditor.locator('#device-detail-fields-panel .device-review-form-grid');
  assert.ok(await dynamicDeviceFields.locator('.device-review-field input,.device-review-field select').count()>0,
    'Type-specific hardware details must use the original source field wrappers and keep editable controls');
  // Batch 04 Networking uses separate full-width Network Identity and
  // Subnet Guidance cards around the original live IPAM fields.
  await approvedEditor.getByRole('tab',{name:'Networking'}).click();
  const approvedNetworking=approvedEditor.locator('#device-form-panel-networking');
  const networkGrid=approvedNetworking.locator(':scope > .device-review-grid');
  assert.equal(await networkGrid.locator(':scope > .device-review-panel.full').count(),2,
    'Source Networking tab must contain its two full-width cards');
  assert.ok(await networkGrid.getByRole('heading',{name:'Network Identity'}).isVisible());
  assert.ok(await networkGrid.getByRole('heading',{name:'Subnet Guidance'}).isVisible());
  assert.ok(await networkGrid.locator('.device-review-hint').getByText(/Create it in IPAM/).isVisible(),
    'Original Subnet Guidance must be kept in the separate source card');
  for(const id of ['dev-block','dev-vlan','dev-subnet','dev-ip','dev-ip-available','dev-ip-reserved']){
    assert.equal(await networkGrid.locator('#'+id).count(),1,
      'Network Identity must retain its existing IPAM control '+id);
  }
  assert.ok(await networkGrid.locator('[data-action="create-subnet-from-device"]').isVisible(),
    'Source integration must keep the live Create subnet in IPAM action');
  await page.setViewportSize({width:420,height:900});
  assert.equal(await networkGrid.evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),1,
    'Approved Networking cards must stack at mobile width');
  await page.setViewportSize({width:1440,height:950});
  console.log('Approved Network Identity/Subnet Guidance cards and live IPAM controls passed');

  // Pinned Batch 04 Notes card: original toolbar, field grid and preview,
  // while keeping the legacy Markdown editor and its saved field.
  await approvedEditor.getByRole('tab',{name:'Notes'}).click();
  const approvedNotes=approvedEditor.locator('#device-form-panel-notes');
  const approvedNotesGrid=approvedNotes.locator(':scope > .device-review-grid');
  assert.equal(await approvedNotesGrid.locator(':scope > .device-review-panel.full').count(),1,
    'Batch 04 Notes must mount its one full-width card inside the approved grid');
  assert.equal(await approvedNotesGrid.evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),2,
    'Approved Notes outer grid must retain desktop columns');
  assert.ok(await approvedNotes.getByRole('heading',{name:'Notes / Details',level:3}).isVisible(),
    'Approved Notes card heading must match Batch 04');
  assert.ok(await approvedNotes.getByText('Add notes and use Preview to check formatting.',{exact:true}).isVisible(),
    'Owner-approved Notes guidance must accompany the saved editor');
  assert.ok(await approvedNotes.locator('.device-review-note-toolbar[role="toolbar"]').isVisible(),
    'Original Notes formatting toolbar must be present');
  assert.ok(await approvedNotes.locator('.device-review-form-grid .device-review-field.wide #dev-notes').isVisible(),
    'The working saved Notes field must use the source form grid');
  assert.equal(await approvedNotes.locator('#dev-notes').evaluate(el=>Math.round(el.getBoundingClientRect().height)),125,
    'Notes must use the pinned 125px minimum editor instead of the old 18-row layout');
  await approvedNotes.locator('#dev-notes').fill('**Browser note**');
  await approvedNotes.locator('#notes-toggle').click();
  assert.ok(await approvedNotes.locator('#notes-preview.device-review-note-preview').isVisible(),
    'Approved Notes preview component must open');
  assert.ok((await approvedNotes.locator('#notes-preview').textContent()).includes('Browser note'),
    'Existing Markdown preview must render the note');
  await approvedNotes.locator('#notes-toggle').click();
  assert.ok(await approvedNotes.locator('#dev-notes').isVisible(),
    'Preview must return to the working editor');
  assert.equal(await approvedNotes.locator('#dev-notes').inputValue(),'**Browser note**',
    'Preview must not discard typed notes');
  await page.setViewportSize({width:420,height:900});
  assert.equal(await approvedNotesGrid.evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),1,
    'Approved Notes full-width card must use a single mobile column');
  assert.equal(await approvedNotes.locator('.device-review-form-grid').evaluate(el=>
    getComputedStyle(el).gridTemplateColumns.split(' ').length),1,
    'Approved Notes fields must stack in a single mobile column');
  await page.setViewportSize({width:1440,height:950});
  console.log('Approved Device Notes structure, Markdown preview and mobile layout passed');

  await approvedEditor.getByRole('tab',{name:'General'}).click();
  const mountingCard=approvedEditor.locator('#device-form-panel-general .device-physical-mounting.device-review-panel.full');
  assert.equal(await mountingCard.count(),1,
    'General tab must use the approved full-width physical mounting card');
  assert.ok(await mountingCard.getByText('Choose a rack face, starting position and equipment height.',{exact:true}).isVisible(),
    'Approved mounting card must retain the pinned source explanation');
  assert.ok(await mountingCard.locator('.device-review-hint')
    .getByText('End U is calculated from Start U + U Height - 1. Positions must fit the rack without overlapping existing equipment.',{exact:true}).isVisible(),
    'Approved rack card must retain the original calculated-height collision warning');
  await page.locator('#dev-mount-type').selectOption('Tower / Floor Standing');
  await page.locator('#dev-location').selectOption('Unknown');
  await approvedEditor.getByRole('tab',{name:'Software & Firmware'}).click();
  assert.ok(await approvedEditor.locator('#device-form-panel-software #host-platform-fields').isVisible(),
    'Physical hypervisor options belong in Software & Firmware');
  await page.locator('#device-hosting-enabled').check();
  await page.locator('#host-platform-select').selectOption('Proxmox VE');
  await page.getByRole('tab',{name:'Networking'}).click();
  await page.locator('#dev-block').selectOption('__unassigned__');
  await page.locator('#dev-vlan').selectOption('17');
  await page.locator('#dev-subnet').selectOption(subnetId);
  await page.locator('#dev-ip').fill('10.64.20.12');
  await page.locator('button[type="submit"][form="device-editor-form"]').click();
  const hostState=await persisted(page,s=>s.devices.some(d=>d.name==='browser-hypervisor' &&
    d.typeDetails?.serverService_Hypervisor===true),'Physical hypervisor');
  const hypervisor=hostState.devices.find(d=>d.name==='browser-hypervisor');
  assert.equal(hypervisor.typeDetails.hypervisorProduct,'Proxmox VE');
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));
  await modal(page,'openDeviceModal');
  await page.locator('#dev-name').fill('browser-vm');
  await page.locator('#dev-deployment').selectOption('virtual');
  const vmCard=approvedEditor.locator('#device-form-panel-general > .device-review-grid > .device-review-vm-configuration.device-review-panel.full');
  assert.ok(await vmCard.isVisible(),
    'Approved full-width VM allocation card must be visible in General');
  assert.ok(await vmCard.getByRole('heading',{name:'Virtual Machine Configuration'}).isVisible(),
    'VM card heading must use Batch 04 presentation');
  assert.ok(await vmCard.getByRole('heading',{name:'Allocated Virtual Hardware'}).isVisible(),
    'Approved VM allocation subsection must use the original heading');
  assert.ok(await vmCard.locator('.device-review-hint').getByText(
    'The virtualisation platform comes from the selected physical hypervisor.',{exact:false}).isVisible(),
    'Approved VM host-inheritance guidance must be visible');
  assert.equal(await vmCard.locator('.device-review-hint').count(),1,
    'VM card must keep one source host-inheritance guidance panel');
  await page.setViewportSize({width:420,height:900});
  assert.equal(await vmCard.locator('.device-review-form-grid').first().evaluate(
    el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),1,
    'VM host-selection field grid must stack at mobile width');
  await page.setViewportSize({width:1440,height:950});
  assert.equal(await vmCard.locator('.device-review-form-grid').count(),2,
    'Approved VM card must provide separate host and allocated hardware grids');
  for(const id of ['dev-virtual-host','dev-vmVcpu','dev-vmRamGb','dev-vmDiskGb','dev-vmNicCount']){
    assert.equal(await vmCard.locator('#'+id).count(),1,
      'VM card must retain original saved field '+id);
  }
  for(const id of ['dev-virtual-host','dev-vmVcpu','dev-vmRamGb','dev-vmDiskGb','dev-vmNicCount']){
    assert.equal(await vmCard.locator('.device-review-field > #'+id+', .device-review-field > label + #'+id).count(),1,
      'Approved VM host and allocation fields must keep their native saved control '+id);
  }
  assert.ok(await approvedEditor.locator('#dev-virtual-host').isVisible(),
    'VMs must retain their physical-host selector');
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
  await page.locator('button[type="submit"][form="device-editor-form"]').click();
  const vmState=await persisted(page,s=>s.devices.some(d=>d.name==='browser-vm' &&
    d.virtualHostId===hypervisor.id),'Hosted virtual machine');
  const vm=vmState.devices.find(d=>d.name==='browser-vm');
  assert.equal(vm.virtualPlatform,'Proxmox VE');
  assert.equal(vm.location,hypervisor.location);
  assert.equal(vm.mountType,'Not Applicable');
  assert.ok(!vm.rackId,'Physical rack placement must be owned by the hypervisor');
  console.log('Physical hypervisor selection and VM inheritance passed');

  // Approved Batch 04 Device Details: real device information and actions.
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));
  await page.evaluate(id=>openDeviceDetailView(id),hypervisor.id);
  const deviceReview=page.locator('#modal-content .device-details-dialog.device-review-dialog');
  await deviceReview.waitFor();
  assert.ok(await page.locator('#modal-container.device-review-overlay #modal-content.approved-device-review-container').isVisible(),
    'Device Details must reuse the exact approved Batch 04 overlay');

  assert.ok(await deviceReview.locator('.device-review-head h2').getByText('browser-hypervisor',{exact:true}).isVisible(),
    'Approved Device Details must show the selected live device name');
  assert.ok(await deviceReview.getByRole('heading',{name:'Device Overview'}).isVisible(),
    'Approved Device Overview card must be present');
  assert.ok(await deviceReview.getByRole('heading',{name:'At a Glance'}).isVisible(),
    'Approved Device Details must preserve the physical device summary');
  assert.equal(await deviceReview.locator('#device-details-panel-overview dt').filter({hasText:'Location Area'}).count(),1,
    'Approved Details overview must retain the Location Area source label');
  for(const caption of ['Recorded identity and status','Existing inventory and mounting details','Saved device notes']){
    assert.ok(await deviceReview.locator('#device-details-panel-overview').getByText(caption,{exact:true}).isVisible(),
      'Approved Details overview must render original card description: '+caption);
  }
  assert.ok(await deviceReview.locator('#device-details-panel-overview .device-review-note-preview')
    .isVisible(),'Device Overview Notes must use the original approved notes preview component');
  await deviceReview.getByRole('tab',{name:'Software'}).click();
  const detailsSoftware= deviceReview.locator('#device-details-panel-software');
  assert.ok(await detailsSoftware.locator(':scope > .device-review-panel').first()
    .getByRole('heading',{name:'Operating System / Platform'}).isVisible(),
    'Approved Details Software tab must lead with Operating System / Platform');
  assert.ok(await detailsSoftware.getByText('Recorded software platform',{exact:true}).isVisible(),
    'Approved OS card must preserve source description');
  assert.equal(await detailsSoftware.locator(':scope > .device-review-panel').first()
    .locator('dt').filter({hasText:'Operating System'}).count(),1,
    'Software Details must use the pinned Operating System fact label');
  const recordedPlatformLabels=await detailsSoftware.locator(':scope > .device-review-panel').first()
    .locator('dt').allTextContents();
  assert.ok(!recordedPlatformLabels.includes('OS version'),
    'Any recorded OS version must use the pinned OS Version label, not legacy casing');
  assert.ok(await detailsSoftware.getByText('Installed on this device',{exact:true}).isVisible(),
    'Approved Installed Software card must preserve source description');
  assert.ok(await detailsSoftware.locator(':scope > .device-review-panel').nth(1)
    .getByRole('heading',{name:'Installed Software'}).isVisible(),
    'Approved Details Installed Software must follow Operating System / Platform');
  const installedSoftwareCard=detailsSoftware.locator(':scope > .device-review-panel').nth(1);
  assert.equal(await installedSoftwareCard.locator('.device-details-field').count(),0,
    'Approved Installed Software must not render legacy key/value fact rows');
  const installedCards=installedSoftwareCard.locator('.record-preview.device-details-installed-software');
  if(await installedCards.count()){
    assert.equal(await installedCards.locator(':scope > .chip').count(),await installedCards.count(),
      'Every installed software preview must retain its approved Installed badge');
  } else {
    assert.ok(await installedSoftwareCard.getByText('No installed software recorded.',{exact:true}).isVisible(),
      'Empty installed software card must retain the approved source empty state');
  }

  const hypervisorDetailsCard=detailsSoftware.locator(':scope > .device-review-panel.full')
    .filter({hasText:'Hypervisor Service'});
  assert.ok(await hypervisorDetailsCard.isVisible(),
    'Recorded physical hypervisors must have the separate approved full-width service card');
  assert.ok(await hypervisorDetailsCard.getByText('Proxmox VE',{exact:true}).isVisible(),
    'The Hypervisor Service card must show the real saved product, not preview sample data');
  await deviceReview.getByRole('tab',{name:'Network'}).click();
  assert.ok(await deviceReview.locator('#device-details-panel-network')
    .getByRole('heading',{name:'Network Identity'}).isVisible(),
    'Network tab must retain approved Network Identity heading');
  assert.equal(await deviceReview.locator('#device-details-panel-network dt')
    .filter({hasText:'Status'}).count(),1,
    'Approved Network Identity must display the live device status');
  await deviceReview.getByRole('tab',{name:'Location'}).click();
  assert.ok(await deviceReview.locator('#device-details-panel-location')
    .getByRole('heading',{name:'Mounting & Location'}).isVisible(),
    'Location tab must use approved Mounting & Location title');
  assert.ok(await deviceReview.locator('#device-details-panel-location')
    .getByText('Virtual machines are not physically mounted in racks.',{exact:true}).isVisible(),
    'Location source guidance must remain visible alongside saved mounting information');
  await deviceReview.getByRole('tab',{name:'Overview'}).click();
  assert.ok(await deviceReview.getByRole('tab',{name:'Virtual Machines'}).isVisible(),
    'Physical hosts with virtual machines must retain their guest listing');
  await deviceReview.getByRole('tab',{name:'Virtual Machines'}).click();
  const hostedVmPanel=deviceReview.locator('#device-details-panel-virtual-machines .device-review-panel.full');
  assert.ok(await hostedVmPanel.getByRole('heading',{name:'Hosted Virtual Machines'}).isVisible(),
    'The physical host must use the original full-width Hosted Virtual Machines card');
  assert.ok(await hostedVmPanel.getByText('Guests are linked to this physical server.',{exact:true}).isVisible(),
    'The original related-devices explanation must be preserved');
  assert.ok(await hostedVmPanel.getByText('Existing host–guest relationships remain unchanged.',{exact:true}).isVisible(),
    'Approved related-record guidance must remain visible below the saved VM previews');
  const hostedVmRecord=hostedVmPanel.locator('.record-preview.device-details-related-record');
  assert.equal(await hostedVmRecord.count(),1,
    'Hosted guests must use the approved related-record preview, not legacy fact rows');
  assert.ok(await hostedVmRecord.getByText('browser-vm',{exact:true}).isVisible(),
    'Hosted VM must remain discoverable from its physical host');
  assert.ok(await hostedVmRecord.getByText('Virtual Machine · Active · 10.64.20.13',{exact:true}).isVisible(),
    'Pinned hosted guest preview must use the approved VM label and saved state/IP');
  assert.ok(await hostedVmRecord.getByText('10.64.20.13',{exact:false}).isVisible(),
    'Host guest preview must use the saved VM IP address');
  assert.ok(await hostedVmRecord.getByRole('button',{name:'View details for browser-vm'}).isVisible(),
    'Approved VM preview must retain the working View Details navigation action');
  await hostedVmRecord.getByRole('button',{name:'View details for browser-vm'}).click();
  await deviceReview.locator('.device-review-head h2').getByText('browser-vm',{exact:true})
    .waitFor({state:'visible'});
  assert.equal(await deviceReview.getByRole('tab',{name:'Hardware'}).count(),0,
    'View Details must actually open the linked VM, with no physical hardware tab');
  await page.evaluate(id=>openDeviceDetailView(id),hypervisor.id);
  await deviceReview.locator('.device-review-head h2').getByText('browser-hypervisor',{exact:true})
    .waitFor({state:'visible'});
  await deviceReview.getByRole('tab',{name:'Hardware'}).click();
  assert.ok(await deviceReview.getByRole('heading',{name:'Hardware & Lifecycle'}).isVisible(),
    'Physical hardware details must use the approved Batch 04 heading');
  const hardwareCard=deviceReview.locator('#device-details-panel-hardware > .device-review-panel.full');
  assert.ok(await hardwareCard.getByText('Physical hardware and device identity',{exact:true}).isVisible(),
    'Hardware & Lifecycle must retain the pinned Batch 04 source subtitle');
  for (const label of ['Device Type','Status','Mount Type']) {
    assert.equal(await hardwareCard.locator('dt').filter({hasText:label}).count(),1,
      'Approved Hardware & Lifecycle must display saved '+label);
  }
  assert.ok(await deviceReview.locator('[data-action="edit-device-from-details"]').isVisible(),
    'Approved footer must keep live editing controls');
  await deviceReview.locator('[data-action="edit-device-from-details"]').click();
  await approvedEditor.locator('.device-review-head h2').getByText('Edit Device',{exact:true}).waitFor();
  assert.equal(await approvedEditor.locator('#dev-name').inputValue(),'browser-hypervisor',
    'Edit Device must retain the saved physical device identity');
  await approvedEditor.getByRole('tab',{name:'Software & Firmware'}).click();
  assert.ok(await approvedEditor.locator('#device-form-panel-software #host-platform-fields').isVisible(),
    'Edit Device must retain approved hypervisor layout');
  assert.ok(await approvedEditor.locator('#device-hosting-enabled').isChecked(),
    'Edit Device must preserve the saved physical hypervisor setting');
  await approvedEditor.locator('[data-action="close-modal"]').first().click();
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));

  await page.evaluate(id=>openDeviceDetailView(id),vm.id);
  await deviceReview.waitFor();
  assert.equal(await deviceReview.getByRole('tab',{name:'Hardware'}).count(),0,
    'VM Device Details must not expose physical hardware');
  assert.ok(await deviceReview.getByRole('heading',{name:'Allocated virtual hardware'}).isVisible(),
    'Approved Device Details must show VM-owned virtual hardware');
  const relatedHost=deviceReview.locator('#device-details-panel-overview > .device-review-panel.full')
    .filter({hasText:'Physical Host'});
  assert.ok(await relatedHost.isVisible(),
    'VM details must use the approved full-width Physical Host source card');
  assert.ok(await relatedHost.locator(':scope > .record-preview').isVisible(),
    'VM Physical Host must use the original record preview structure');
  assert.ok(await relatedHost.getByText('A virtual machine is hosted by a physical hypervisor.',{exact:true}).isVisible(),
    'VM Physical Host must retain source guidance');
  assert.ok(await relatedHost.getByText('browser-hypervisor',{exact:true}).isVisible(),
    'The VM host card must render the saved physical host');
  await relatedHost.getByRole('button',{name:'View Host'}).click();
  // Live read/navigation actions refresh saved inventory before dispatching.
  // Wait for the actual destination rather than racing that authorised refresh.
  await deviceReview.locator('.device-review-head h2')
    .getByText('browser-hypervisor',{exact:true}).waitFor({state:'visible'});
  assert.ok(await deviceReview.locator('.device-review-head h2')
    .getByText('browser-hypervisor',{exact:true}).isVisible(),
    'View Host must navigate to the real physical host record');
  await page.evaluate(id=>openDeviceDetailView(id),vm.id);
  await deviceReview.getByRole('heading',{name:'Allocated virtual hardware'}).waitFor();
  await deviceReview.getByRole('tab',{name:'Software'}).click();
  const vmDetailsSoftware=deviceReview.locator('#device-details-panel-software');
  assert.ok(await vmDetailsSoftware.locator(':scope > .device-review-panel').first()
    .getByRole('heading',{name:'Operating System / Platform'}).isVisible(),
    'VM software details must lead with approved Operating System / Platform');
  assert.ok(await vmDetailsSoftware.locator(':scope > .device-review-panel').nth(1)
    .getByRole('heading',{name:'Installed Software'}).isVisible(),
    'VM software details must retain source Installed Software order');
  await deviceReview.getByRole('tab',{name:'Location'}).click();
  const vmLocation=deviceReview.locator('#device-details-panel-location');
  assert.ok(await vmLocation.getByText('browser-hypervisor',{exact:true}).isVisible(),
    'VM Location must retain the approved Physical Host fact with the saved host name');
  assert.equal(await vmLocation.locator('dt').filter({hasText:'Physical Host'}).count(),1,
    'Approved VM Location must label its inherited physical host');
  await deviceReview.getByRole('tab',{name:'Overview'}).click();
  assert.equal(await deviceReview.locator('[data-action="navigate-to-device-rack"]').count(),0,
    'Virtual machines must not acquire independent rack placement');
  await page.setViewportSize({width:420,height:900});
  const columns=await deviceReview.locator('#device-details-panel-overview').evaluate(
    node=>getComputedStyle(node).gridTemplateColumns.split(' ').length);
  assert.equal(columns,1,'Approved Device Details cards must stack on narrow screens');
  assert.equal(await page.locator('#modal-container.device-review-overlay').evaluate(el=>getComputedStyle(el).paddingLeft),'0px',
    'Pinned Device Details overlay must also lose desktop padding on mobile');
  assert.equal(await deviceReview.evaluate(el=>Math.round(el.getBoundingClientRect().width)),420,
    'Approved VM Details dialog must span the mobile viewport');

  await page.setViewportSize({width:1440,height:950});
  await deviceReview.locator('[data-action="close-modal"]').first().click();
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));
  await page.evaluate(id=>openDeviceDetailView(id),rackSwitch.id);
  await deviceReview.getByRole('tab',{name:'Location'}).click();
  const rackNavigationCard=deviceReview.locator('#device-details-panel-location > .device-review-panel.full')
    .filter({hasText:'Rack Navigation'});
  assert.ok(await rackNavigationCard.isVisible(),
    'Approved Details Location tab must contain a distinct full-width Rack Navigation card for racked devices');
  assert.ok(await rackNavigationCard.getByText('Opens the existing rack view in the completed application.',{exact:true}).isVisible(),
    'Rack Navigation guidance must match the pinned HTML without changing navigation');
  const savedRackLocation=deviceReview.locator('#device-details-panel-location > .device-review-panel.full').first();
  for(const label of ['Rack','Face','Start U','U height']){
    assert.equal(await savedRackLocation.locator('dt').filter({hasText:label}).count(),1,
      'Approved rack-mounted Location card must include '+label);
  }
  assert.ok(await savedRackLocation.getByText('6',{exact:true}).isVisible(),
    'Approved rack-mounted Location card must show the persisted Start U of the moved device');
  assert.equal(await rackNavigationCard.locator('[data-action="navigate-to-device-rack"]').getAttribute('data-id'),
    rackSwitch.id,'Approved Rack Navigation must use the saved device ID');
  await deviceReview.locator('[data-action="close-modal"]').first().click();
  await page.waitForFunction(()=>document.querySelector('#modal-container')?.classList.contains('hidden'));
  await modal(page,'openManageLocationsModal');
  assert.equal(await page.locator('#modal-container.device-review-overlay').count(),0,
    'Approved Device overlay classes must reset before opening other application dialogs');
  assert.equal(await page.locator('#modal-content.approved-device-review-container').count(),0,
    'Non-device dialogues must recover their own original container style');
  await page.evaluate(()=>closeModal(true));
  console.log('Approved Device Details for physical and virtual hardware passed');

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
  await editor.locator('#app[aria-busy="false"]').waitFor();
  await editor.locator('#app .header-account').waitFor();
  await editor.waitForFunction(()=>document.querySelector('#page-title')?.textContent==='Dashboard');
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
  assert.equal(await editor.locator('#page-title').textContent(),'My Account');
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
  assert.equal(await viewer.locator('#page-title').textContent(),'My Account');
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
  publishedServer=require('node:http').createServer((request,response)=>{
    response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
    response.end(v133Source.stdout);
  });
  await new Promise(resolve=>publishedServer.listen(0,'127.0.0.1',resolve));
  await published.goto('http://127.0.0.1:'+publishedServer.address().port+'/');
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
  console.log('PASS: Caffoot Lite '+(process.env.CAFFOOT_BROWSER_FOCUS||'focused Chromium compatibility'));
  await browser?.close();server?.kill('SIGTERM');publishedServer?.close();
  fs.rmSync(tmp,{recursive:true,force:true});
  if(linkCreated)fs.rmSync(temporaryAssetLink);
}).catch(async e=>{
  console.error('FAIL: '+(e.stack||e));
  if(fs.existsSync(logfile))console.error('Server log:\n'+fs.readFileSync(logfile,'utf8').slice(-13000));
  await browser?.close().catch(()=>{});
  server?.kill('SIGTERM');publishedServer?.close();
  if(linkCreated)fs.rmSync(temporaryAssetLink,{force:true});
  process.exitCode=1;
});
