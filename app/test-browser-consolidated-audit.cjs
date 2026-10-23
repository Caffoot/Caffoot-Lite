'use strict';
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

// One isolated Chromium suite, with independent case results per audit finding.
// All fixtures are fictional and browser contexts are disposable.
(async () => {
  const browser = await chromium.launch({ headless: true });
  const url = pathToFileURL(path.join(__dirname, 'dist', 'Caffoot-Lite.html')).href;
  async function scenario(name, fn) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.route(/^https?:/i, route => route.abort('blockedbyclient'));
    try {
      await page.goto(url, { waitUntil: 'load' });
      await fn(page);
      console.log('PASS ' + name);
    } finally { await context.close(); }
  }
  try {
    const key = 'caffoot_phase12b_prebulk_snapshot';
    const inventoryKey = 'caffoot_state';
    for (const mode of ['throw-snapshot', 'ignore-snapshot', 'throw-main', 'success', 'old-snapshot']) {
      await scenario('M-031 ' + mode, async page => {
        const result = await page.evaluate(({ mode, key, inventoryKey }) => {
          const subnet = { id:'fictional-subnet', name:'Audit test', kind:'network', cidr:'10.88.77.0/29', gateway:'10.88.77.1', vlan:3877 };
          appState.subnets.push(subnet);
          const before = JSON.stringify(appState);
          localStorage.setItem(inventoryKey, before);
          if (mode === 'old-snapshot') localStorage.setItem(key, 'older fictional snapshot');
          const priorSnapshot = localStorage.getItem(key);
          const original = Storage.prototype.setItem;
          Storage.prototype.setItem = function (k,v) {
            if (k === key && mode === 'throw-snapshot') throw Error('fictional snapshot failure');
            if (k === key && mode === 'ignore-snapshot') return;
            if (k === inventoryKey && mode === 'throw-main') throw Error('fictional main save failure');
            return original.call(this,k,v);
          };
          phase12BPending = {subnetId:subnet.id,start:2,end:2,status:'Reserved',hostname:'fictional',notes:'audit'};
          let thrown = null;
          try { phase12BApply(); } catch(e) { thrown=String(e); }
          Storage.prototype.setItem = original;
          return {before,priorSnapshot,after:JSON.stringify(appState),
            primary:localStorage.getItem(inventoryKey),snapshot:localStorage.getItem(key),
            allocated:!!appState.ipAllocations['10.88.77.2'],thrown};
        }, {mode,key,inventoryKey});
        assert.equal(result.thrown,null,'Bulk handler should not throw');
        if (mode === 'throw-snapshot') {
          assert.equal(result.after,result.before);
          assert.equal(result.primary,result.before);
          assert.equal(result.snapshot,result.priorSnapshot);
        } else if (mode === 'ignore-snapshot') {
          assert.equal(result.snapshot,result.priorSnapshot,'Silent write did not create a safety copy');
          console.log('OBSERVED M-031 B2: snapshot ignored; allocated=' + result.allocated + ', savedChanged=' + (result.primary!==result.before));
          assert.equal(result.primary,result.before,'Failed save must preserve original inventory bytes');
          assert.equal(result.after,result.before,'Failed save must restore original in-memory inventory');
        } else if (mode === 'throw-main') {
          assert.equal(result.after,result.before);
          assert.equal(result.primary,result.before);
          assert.equal(result.snapshot,result.before);
        } else {
          assert.equal(result.snapshot,result.before);
          assert.equal(result.allocated,true);
          assert.notEqual(result.primary,result.before);
        }
        await page.reload({waitUntil:'load'});
        const persisted = await page.evaluate(() => ({main:localStorage.getItem('caffoot_state'),snapshot:localStorage.getItem('caffoot_phase12b_prebulk_snapshot')}));
        assert.equal(persisted.main,result.primary);
        assert.equal(persisted.snapshot,result.snapshot);
      });
    }
    await scenario('M-001 failed rack unassignment', async page => {
      const result = await page.evaluate(() => {
        appState.racks.push({id:'fictional-rack',name:'Fictional rack',heightU:42});
        appState.devices.push({id:'fictional-device',name:'Fictional device',type:'Server',mountType:'Rack Mounted',rackId:'fictional-rack',rackUStart:1,rackUEnd:1,rackUHeight:1,face:'front'});
        const before=JSON.stringify(appState);
        localStorage.setItem('caffoot_state',before);
        const original=Storage.prototype.setItem;
        Storage.prototype.setItem=function(k,v){if(k==='caffoot_state')throw Error('fictional save failure');return original.call(this,k,v)};
        let thrown=null;
        try {unassignDevice('fictional-device')} catch(e){thrown=String(e)}
        Storage.prototype.setItem=original;
        return {before,after:JSON.stringify(appState),stored:localStorage.getItem('caffoot_state'),thrown,
          rackId:appState.devices.find(d=>d.id==='fictional-device').rackId};
      });
      assert.equal(result.thrown,null);
      assert.equal(result.stored,result.before);
      assert.equal(result.rackId,'fictional-rack','Failed rack unassignment must restore placement');
      assert.equal(result.after,result.before,'Failed rack unassignment must restore in-memory inventory');
      await page.reload({waitUntil:'load'});
      assert.equal(await page.evaluate(() => appState.devices.find(d=>d.id==='fictional-device')?.rackId),'fictional-rack');
    });
    await scenario('M-020 failed device graphic save', async page => {
      const result=await page.evaluate(() => {
        appState.devices.push({id:'fictional-graphic-device',name:'Fictional graphic device',type:'Server'});
        const type='Server';
        const presets=Object.keys(phase13GPresets).filter(x=>x!=='automatic');
        if(!presets.length) return {blocked:'No graphic presets'};
        document.getElementById('phase13g-style')?.remove();
        const select=document.createElement('select');
        select.id='phase13g-style';
        select.innerHTML='<option value="'+presets[0]+'">'+presets[0]+'</option>';
        document.body.appendChild(select);
        const before=JSON.stringify(appState);
        localStorage.setItem('caffoot_state',before);
        const original=Storage.prototype.setItem;
        Storage.prototype.setItem=function(k,v){if(k==='caffoot_state')throw Error('fictional save failure');return original.call(this,k,v)};
        let thrown=null;
        try {phase13GSaveGraphics(type)}catch(e){thrown=String(e)}
        Storage.prototype.setItem=original;
        return {before,stored:localStorage.getItem('caffoot_state'),after:JSON.stringify(appState),thrown,type};
      });
      assert(!result.blocked,result.blocked);
      assert.equal(result.thrown,null);
      assert.equal(result.stored,result.before);
      assert.equal(result.after,result.before,'Failed graphic save must restore in-memory selection');
      await page.reload({waitUntil:'load'});
      assert.equal(await page.evaluate(() => localStorage.getItem('caffoot_state')),result.before);
    });
    await scenario('M-018 failed custom location save', async page => {
      const result=await page.evaluate(() => {
        const input=document.createElement('input');input.id='dev-custom-location';input.value='Fictional audit room';
        const select=document.createElement('select');select.id='dev-location';
        select.innerHTML='<option value="__caffoot_create_location__">Create location</option>';
        const panel=document.createElement('div');panel.id='dev-create-location-panel';
        document.body.append(input,select,panel);
        const before=JSON.stringify(appState);
        localStorage.setItem('caffoot_state',before);
        const original=Storage.prototype.setItem;
        Storage.prototype.setItem=function(k,v){if(k==='caffoot_state')throw Error('fictional save failure');return original.call(this,k,v)};
        let thrown=null;
        try {addCustomLocationOption()}catch(e){thrown=String(e)}
        Storage.prototype.setItem=original;
        return {before,stored:localStorage.getItem('caffoot_state'),after:JSON.stringify(appState),
          hasLocation:appState.deviceLocations?.includes('Fictional audit room'),thrown};
      });
      assert.equal(result.thrown,null);
      assert.equal(result.stored,result.before);
      assert.equal(result.hasLocation,false,'Failed location save must restore in-memory locations');
      assert.equal(result.after,result.before,'Failed location save must restore inventory');
      await page.reload({waitUntil:'load'});
      assert.equal(await page.evaluate(() => appState.deviceLocations?.includes('Fictional audit room')),false);
    });
    await scenario('M-018 location selection and cancellation', async page => {
      const result=await page.evaluate(() => {
        const select=document.createElement('select');
        select.id='dev-location';
        select.innerHTML='<option value="Room A">Room A</option><option value="Room B">Room B</option><option value="__caffoot_create_location__">Create location</option>';
        select.value='Room A';
        select.dataset.previousLocation='Room A';
        const panel=document.createElement('div');
        panel.id='dev-create-location-panel';
        panel.hidden=true;
        const input=document.createElement('input');
        input.id='dev-custom-location';
        document.body.append(select,panel,input);
        let error=null;
        try {
          select.value='Room B';
          phase130HandleLocationChange(select);
          select.value='__caffoot_create_location__';
          phase130HandleLocationChange(select);
          phase130CancelCustomLocation();
        } catch(e) {error=String(e)}
        return {error,selected:select.value,panelHidden:panel.hidden};
      });
      assert.equal(result.error,null);
      assert.equal(result.selected,'Room B');
      assert.equal(result.panelHidden,true);
    });
    for (const mode of ['throw-snapshot','ignore-snapshot','throw-main','success','old-snapshot']) {
      await scenario('M-012 repair ' + mode, async page => {
        page.on('dialog', dialog => dialog.accept());
        const result=await page.evaluate(mode => {
          appState.subnets.push({id:'fictional-repair-subnet',name:'Fictional repair',kind:'network',cidr:'10.87.76.0/29',gateway:'10.87.76.1',vlan:3876});
          appState.devices.push({id:'fictional-repair-device',name:'Fictional repair device',type:'Server',primaryIp:'10.87.76.2'});
          const before=JSON.stringify(appState);
          localStorage.setItem('caffoot_state',before);
          const key='caffoot_phase11c_pre_repair_v1';
          if(mode==='old-snapshot')localStorage.setItem(key,'previous fictional repair snapshot');
          const old=localStorage.getItem(key);
          const original=Storage.prototype.setItem;
          Storage.prototype.setItem=function(k,v){
            if(k===key&&mode==='throw-snapshot')throw Error('fictional repair snapshot failure');
            if(k===key&&mode==='ignore-snapshot')return;
            if(k==='caffoot_state'&&mode==='throw-main')throw Error('fictional repair main failure');
            return original.call(this,k,v);
          };
          phase11CPreview={snapshot:before,plan:phase11CPlan()};
          let thrown=null;
          try {phase11CApplyRepair()}catch(e){thrown=String(e)}
          Storage.prototype.setItem=original;
          return {before,old,stored:localStorage.getItem('caffoot_state'),snapshot:localStorage.getItem(key),
            after:JSON.stringify(appState),allocated:!!appState.ipAllocations['10.87.76.2'],thrown};
        },mode);
        assert.equal(result.thrown,null);
        if(mode==='throw-snapshot'||mode==='throw-main'){
          assert.equal(result.after,result.before);
          assert.equal(result.stored,result.before);
          assert.equal(result.snapshot,result.old);
        }else if(mode==='ignore-snapshot'){
          assert.equal(result.snapshot,result.old,'Existing safety snapshot must remain unchanged');
          assert.equal(result.allocated,false,'Repair must not proceed without a verified snapshot');
          assert.equal(result.after,result.before,'Failed snapshot must preserve in-memory inventory');
          assert.equal(result.stored,result.before,'Failed snapshot must preserve stored inventory');
        }else{
          assert.equal(result.snapshot,result.before);
          assert.equal(result.allocated,true);
          assert.notEqual(result.stored,result.before);
        }
        await page.reload({waitUntil:'load'});
        const persisted=await page.evaluate(()=>({stored:localStorage.getItem('caffoot_state'),snapshot:localStorage.getItem('caffoot_phase11c_pre_repair_v1')}));
        assert.equal(persisted.stored,result.stored);
        assert.equal(persisted.snapshot,result.snapshot);
      });
    }
    for (const mode of ['throw-main','ignore-restore-snapshot','old-snapshot']) {
      await scenario('M-011 import rollback ' + mode, async page => {
        const initial=await page.evaluate(mode => {
          if(!saveState())throw Error('Could not establish fictional baseline');
          const original=localStorage.getItem('caffoot_state');
          const safety='caffoot_phase11_pre_restore';
          if(mode==='old-snapshot'||mode==='ignore-restore-snapshot')localStorage.setItem(safety,'fictional earlier safety copy');
          return {original,safety:localStorage.getItem(safety)};
        },mode);
        const candidate=JSON.parse(initial.original);
        candidate.browserConsolidatedImportMarker='fictional import';
        let accepted=0;
        page.on('dialog',dialog=>{accepted++;return dialog.accept()});
        await page.evaluate(mode=>{
          const original=Storage.prototype.setItem;
          window.__auditOriginalSetItem=original;
          const safety='caffoot_phase11_pre_restore';
          let mainWrites=0;
          Storage.prototype.setItem=function(k,v){
            if(k==='caffoot_state'&&++mainWrites===1)throw Error('fictional import primary save failure');
            if(k===safety&&mode==='ignore-restore-snapshot'&&mainWrites>0)return;
            return original.call(this,k,v);
          };
        },mode);
        await page.locator('#import-file').setInputFiles({
          name:'fictional-import.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(candidate))
        });
        await page.waitForFunction(()=>document.getElementById('import-file').value==='');
        const outcome=await page.evaluate(()=>{
          Storage.prototype.setItem=window.__auditOriginalSetItem||Storage.prototype.setItem;
          delete window.__auditOriginalSetItem;
          return {stored:localStorage.getItem('caffoot_state'),safety:localStorage.getItem('caffoot_phase11_pre_restore')};
        });
        assert(accepted>=1,'Import confirmation was not shown');
        assert.equal(outcome.stored,initial.original);
        if(mode==='old-snapshot')assert.equal(outcome.safety,initial.safety);
        if(mode==='ignore-restore-snapshot'){
          assert.notEqual(outcome.safety,initial.safety,'Injected failure must leave secondary safety copy unrestored');
          assert.equal(outcome.stored,initial.original,'Failed secondary rollback must preserve original main inventory');
        }
        await page.reload({waitUntil:'load'});
        assert.equal(await page.evaluate(()=>localStorage.getItem('caffoot_state')),initial.original);
      });
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode=1; });
