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
          const subnet = { id:'fictional-subnet', name:'Audit test', cidr:'10.88.77.0/29', gateway:'10.88.77.1' };
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
          assert.equal(result.allocated,true,'Record actual bulk mutation despite missing copy');
          console.log('OBSERVED M-031 B2: bulk mutation persisted without verified safety snapshot');
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
      assert.equal(result.rackId,'');
      console.log('OBSERVED M-001: failed save leaves unassigned device in memory; saved bytes unchanged');
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
      assert.notEqual(result.after,result.before);
      console.log('OBSERVED M-020: failed graphic save changes in-memory preference without persistence');
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
      assert.equal(result.hasLocation,true);
      console.log('OBSERVED M-018: failed save retains new location in memory but not storage');
      await page.reload({waitUntil:'load'});
      assert.equal(await page.evaluate(() => appState.deviceLocations?.includes('Fictional audit room')),false);
    });
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode=1; });
