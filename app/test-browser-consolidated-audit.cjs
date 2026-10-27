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
      console.log('START ' + name);
      await Promise.race([
        fn(page),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Browser scenario timed out after 30 seconds: ' + name)), 30000))
      ]);
      console.log('PASS ' + name);
    } finally { await context.close(); }
  }
  try {
    await scenario('M-017 readable invalid startup inventory enters protected recovery', async page => {
      const original = await page.evaluate(() => {
        const invalid = JSON.parse(JSON.stringify(appState));
        invalid.devices.push({id:'duplicate-fixture',name:'Fixture one',type:'Server - Physical'});
        invalid.devices.push({id:'duplicate-fixture',name:'Fixture two',type:'Server - Physical'});
        const raw = JSON.stringify(invalid);
        localStorage.setItem('caffoot_state', raw);
        return raw;
      });
      await page.reload({waitUntil:'load'});
      const result = await page.evaluate(() => ({
        protected:!!phase17AStorageRecovery,
        raw:phase17AStorageRecovery?.raw,
        stored:localStorage.getItem('caffoot_state'),
        banner:!!document.getElementById('phase17a-recovery'),
        saved:saveState()
      }));
      assert.equal(result.protected,true,'Invalid readable inventory must enter recovery');
      assert.equal(result.raw,original,'Original inventory must remain downloadable');
      assert.equal(result.stored,original,'Startup and rejected save must not overwrite stored inventory');
      assert.equal(result.banner,true,'Recovery must be visible');
      assert.equal(result.saved,false,'Ordinary saves must be blocked in recovery');
    });
    await scenario('M-022 failed new rack save restores selection and stored inventory', async page => {
      const result = await page.evaluate(async () => {
        const beforeSelection = selectedRackId;
        const beforeRacks = JSON.stringify(appState.racks);
        const beforeStored = localStorage.getItem('caffoot_state');
        openRackModal();
        document.getElementById('rack-name').value = 'Fictional failed rack';
        document.getElementById('rack-height').value = '42';
        document.getElementById('rack-width').value = '600';
        document.getElementById('rack-depth').value = '1000';
        const original = Storage.prototype.setItem;
        Storage.prototype.setItem = function(key,value) {
          if (key === 'caffoot_state') return;
          return original.call(this,key,value);
        };
        try {
          await handleRackSubmit({preventDefault(){},target:document.querySelector('#rack-name').closest('form')},null);
        } finally {
          Storage.prototype.setItem = original;
        }
        return {
          beforeSelection,afterSelection:selectedRackId,
          beforeRacks,afterRacks:JSON.stringify(appState.racks),
          beforeStored,afterStored:localStorage.getItem('caffoot_state')
        };
      });
      assert.equal(result.afterSelection,result.beforeSelection,'Failed new rack must restore previous selection');
      assert.equal(result.afterRacks,result.beforeRacks,'Failed new rack must restore inventory');
      assert.equal(result.afterStored,result.beforeStored,'Ignored storage write must not alter saved inventory');
    });
    await scenario('M-017 dashboard service label preserves raw drilldown key', async page => {
      const result = await page.evaluate(() => {
        appState.devices.push({id:'hypervisor-label-fixture',name:'Hypervisor label fixture',type:'Server - Physical',typeDetails:{serverService_Hypervisor:true}});
        phase14DeviceTab='overview';
        deviceIntelligenceTab='software';
        const html=renderDevicesHTML();
        return {html,storedKey:appState.devices.at(-1).typeDetails.serverService_Hypervisor};
      });
      assert.match(result.html,/data-value="serverService_Hypervisor"/,'Dashboard must retain raw filter key');
      assert.match(result.html,/>Hypervisor<\/span>/,'Dashboard must display friendly label');
      assert.equal(result.storedKey,true,'Service value must remain unchanged');
    });
    await scenario('M-010/M-019 browser import validation preserves inventory', async page => {
      const before = await page.evaluate(() => {
        if (!saveState()) throw Error('Cannot establish fictional baseline');
        return {stored:localStorage.getItem('caffoot_state'),
          active:JSON.stringify(appState), safety:localStorage.getItem('caffoot_phase11_pre_restore')};
      });
      const base = JSON.parse(before.active);
      base.racks = [{id:'fixture-rack',name:'Fixture rack',heightU:12}];
      base.rackAccessories = [
        {id:'fixture-a',name:'Fixture A',type:'patch',rackId:'fixture-rack',face:'front',startU:2,heightU:2},
        {id:'fixture-b',name:'Fixture B',type:'blank',rackId:'fixture-rack',face:'front',startU:3,heightU:1}
      ];
      let confirmations=0;
      page.on('dialog', async d => { confirmations++; await d.dismiss(); });
      async function attempt(name, candidate, expected) {
        await page.locator('#import-file').setInputFiles({
          name:name+'.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(candidate))
        });
        await page.waitForFunction(() => document.getElementById('import-file').value === '');
        const result=await page.evaluate(() => ({
          stored:localStorage.getItem('caffoot_state'),
          active:JSON.stringify(appState),safety:localStorage.getItem('caffoot_phase11_pre_restore'),
          error:document.getElementById('modal-container')?.innerText || ''
        }));
        assert.equal(result.stored,before.stored,name+' must preserve stored inventory');
        assert.equal(result.active,before.active,name+' must preserve active inventory');
        assert.equal(result.safety,before.safety,name+' must preserve safety snapshot');
        if (expected === 'reject') assert.match(result.error,/overlap|invalid|integrity/i,name+' must explain rejection');
        if (expected === 'confirm') assert.equal(confirmations,1,name+' should offer a restore confirmation');
        await page.evaluate(() => { if (typeof closeModal === 'function') closeModal(); });
      }
      await attempt('overlapping-accessories',base,'reject');
      assert.equal(confirmations,0,'Overlapping accessories must be rejected before confirmation');
      const malformed={...base,rackAccessories:{}};
      await attempt('malformed-accessory-collection',malformed,'reject');
      assert.equal(confirmations,0,'Malformed accessories must be rejected before confirmation');
      const valid={...base,rackAccessories:[
        base.rackAccessories[0],
        {...base.rackAccessories[1],face:'rear'}
      ]};
      await attempt('opposite-face-accessories',valid,'confirm');
      await page.reload({waitUntil:'load'});
      assert.equal(await page.evaluate(() => localStorage.getItem('caffoot_state')),before.stored,
        'Rejected and cancelled imports must preserve inventory across reload');
    });
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
    await scenario('#140 vertical accessories do not consume rack U capacity', async page => {
      const result = await page.evaluate(() => {
        const rack={id:'fixture-140-rack',name:'18U fixture',heightU:18};
        appState.racks.push(rack);
        appState.devices.push({id:'fixture-140-server',name:'2U server',type:'Server - Physical',rackId:rack.id,face:'front',rackUStart:3,rackUEnd:4});
        appState.rackAccessories.push(
          {id:'fixture-140-pdu',name:'Vertical PDU',type:'pdu_vertical',rackId:rack.id,face:'front',side:'left',startU:1,heightU:18},
          {id:'fixture-140-cable',name:'Vertical Cable Manager',type:'cable_vertical',rackId:rack.id,face:'rear',side:'right',startU:1,heightU:18}
        );
        const vertical={front:phase13LUsage(rack,'front'),rear:phase13LUsage(rack,'rear')};
        appState.rackAccessories.push({id:'fixture-140-patch',name:'Patch panel',type:'patch',rackId:rack.id,face:'front',startU:5,heightU:1});
        const horizontal=phase13LUsage(rack,'front');
        return {vertical,horizontal};
      });
      assert.equal(result.vertical.front.occupied,2);
      assert.equal(result.vertical.front.available,16);
      assert.equal(result.vertical.rear.occupied,0);
      assert.equal(result.vertical.rear.available,18);
      assert.equal(result.horizontal.occupied,3,'Horizontal accessory must still consume one U');
      assert.equal(result.horizontal.available,15);
    });
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
          return {stored:localStorage.getItem('caffoot_state'),safety:localStorage.getItem('caffoot_phase11_pre_restore'),
            recoveryActive:!!phase17AStorageRecovery,
            recoveryReason:phase17AStorageRecovery?.reason||'',
            recoveryRaw:phase17AStorageRecovery?.raw||null,
            bannerPresent:!!document.getElementById('phase17a-recovery'),
            blockedSave:phase17AStorageRecovery ? saveState() : null};
        });
        assert(accepted>=1,'Import confirmation was not shown');
        assert.equal(outcome.stored,initial.original);
        if(mode==='old-snapshot')assert.equal(outcome.safety,initial.safety);
        if(mode==='ignore-restore-snapshot'){
          assert.notEqual(outcome.safety,initial.safety,'Injected failure must leave secondary safety copy unrestored');
          assert.equal(outcome.stored,initial.original,'Failed secondary rollback must preserve original main inventory');
          assert.equal(outcome.recoveryActive,true,'Secondary rollback failure must activate recovery protection');
          assert.equal(outcome.blockedSave,false,'Recovery protection must block subsequent saves');
          assert.equal(outcome.bannerPresent,true,'Secondary rollback failure must display recovery banner');
          assert.equal(outcome.recoveryRaw,initial.original,'Recovery export must retain exact original stored bytes');
          assert.match(outcome.recoveryReason,/rollback could not be verified/i);
        }
        await page.reload({waitUntil:'load'});
        assert.equal(await page.evaluate(()=>localStorage.getItem('caffoot_state')),initial.original);
      });
    }

    // M-005: deletion protection acceptance, with legacy validator and import
    // characterisation retained separately until compatibility handling is designed.
    await scenario('M-005 physical host details list hosted guests', async page => {
      const result = await page.evaluate(() => {
        appState.devices.push(
          {id:'fictional-display-host',name:'Fictional display host',type:'Server - Physical',location:'Unknown'},
          {id:'fictional-display-vm-a',name:'Fictional web VM',type:'Server - Virtual',status:'Active',virtualHostId:'fictional-display-host'},
          {id:'fictional-display-vm-b',name:'Fictional database VM',type:'Server - Virtual',status:'Maintenance',virtualHostId:'fictional-display-host'}
        );
        phase14CViewDevice('fictional-display-host');
        const tab=document.getElementById('phase14c-tab-virtual-machines');
        phase14CSelectTab('virtual-machines');
        const panel=document.getElementById('phase14c-panel-virtual-machines');
        return {text:panel?.textContent||'',tabSelected:tab?.getAttribute('aria-selected'),panelVisible:!panel?.hidden,links:appState.devices.filter(d=>d.virtualHostId==='fictional-display-host').length};
      });
      assert.equal(result.tabSelected,'true','Virtual Machines tab must be selected');
      assert.equal(result.panelVisible,true,'Virtual Machines panel must be visible');
      assert.match(result.text,/Hosted virtual machines/);
      assert.match(result.text,/Fictional web VM/);
      assert.match(result.text,/Fictional database VM/);
      assert.match(result.text,/Maintenance/);
      assert.equal(result.links,2,'Viewing host details must preserve guest links');
    });
    await scenario('M-005 navigate from hosted guest list to guest details', async page => {
      const result = await page.evaluate(() => {
        appState.devices.push(
          {id:'fictional-nav-host',name:'Fictional navigation host',type:'Server - Physical',location:'Unknown'},
          {id:'fictional-nav-guest',name:'Fictional navigation guest',type:'Server - Virtual',location:'Unknown',virtualHostId:'fictional-nav-host'}
        );
        phase14CViewDevice('fictional-nav-host');
        phase14CSelectTab('virtual-machines');
        const button=document.querySelector('#phase14c-panel-virtual-machines [data-action="phase14c-view-hosted-guest"][data-id="fictional-nav-guest"]');
        if(!button)return {buttonFound:false};
        button.click();
        return {buttonFound:true,detailText:document.querySelector('.phase14c-detail')?.textContent||'',
          hostId:appState.devices.find(d=>d.id==='fictional-nav-guest')?.virtualHostId};
      });
      assert.equal(result.buttonFound,true,'Guest details button must be present');
      assert.match(result.detailText,/Fictional navigation guest/);
      assert.match(result.detailText,/Fictional navigation host/);
      assert.equal(result.hostId,'fictional-nav-host','Navigation must not change the guest host reference');
    });
    await scenario('M-005 physical host details show empty guest state', async page => {
      const text = await page.evaluate(() => {
        appState.devices.push({id:'fictional-display-empty',name:'Fictional empty host',type:'Server - Physical',location:'Unknown',typeDetails:{serverService_Hypervisor:true}});
        phase14CViewDevice('fictional-display-empty');
        phase14CSelectTab('virtual-machines');
        return document.getElementById('phase14c-panel-virtual-machines')?.textContent||'';
      });
      assert.match(text,/No hosted virtual machines recorded/);
    });
    await scenario('M-005 no VM tab without hypervisor or hosted guests', async page => {
      const result = await page.evaluate(() => {
        appState.devices.push({id:'fictional-no-hypervisor',name:'Fictional ordinary physical server',type:'Server - Physical',location:'Unknown'});
        phase14CViewDevice('fictional-no-hypervisor');
        return {tab:!!document.getElementById('phase14c-tab-virtual-machines'),
          panel:!!document.getElementById('phase14c-panel-virtual-machines')};
      });
      assert.equal(result.tab,false);
      assert.equal(result.panel,false);
    });
    await scenario('M-005 existing guests remain visible without hypervisor service', async page => {
      const result = await page.evaluate(() => {
        appState.devices.push(
          {id:'fictional-legacy-host',name:'Fictional legacy host',type:'Server - Physical',location:'Unknown'},
          {id:'fictional-legacy-guest',name:'Fictional legacy guest',type:'Server - Virtual',location:'Unknown',virtualHostId:'fictional-legacy-host'}
        );
        phase14CViewDevice('fictional-legacy-host');
        phase14CSelectTab('virtual-machines');
        return {tab:!!document.getElementById('phase14c-tab-virtual-machines'),
          text:document.getElementById('phase14c-panel-virtual-machines')?.textContent||'',
          hostId:appState.devices.find(d=>d.id==='fictional-legacy-guest')?.virtualHostId};
      });
      assert.equal(result.tab,true);
      assert.match(result.text,/Fictional legacy guest/);
      assert.match(result.text,/no Hypervisor service selected/);
      assert.equal(result.hostId,'fictional-legacy-host');
    });
    await scenario('M-005 guest resolution Escape preserves editing and focus', async page => {
      const result = await page.evaluate(async () => {
        const container=document.getElementById('modal-container');
        const content=document.getElementById('modal-content');
        container.classList.remove('hidden');
        content.innerHTML='<button id="fictional-hypervisor-origin" type="button">Original control</button>';
        const origin=document.getElementById('fictional-hypervisor-origin');
        origin.focus();
        const pending=phaseM005ConfirmHypervisorRemoval('Fictional host', [{id:'guest-one',name:'Fictional guest'}], 'fictional-host');
        const dialog=document.getElementById('phase-m005-hypervisor-dialog');
        const text=dialog?.textContent||'';
        document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));
        const accepted=await pending;
        return {accepted,removed:!document.getElementById('phase-m005-hypervisor-dialog'),
          focusRestored:document.activeElement===origin,originStillPresent:!!document.getElementById('fictional-hypervisor-origin'),text};
      });
      assert.equal(result.accepted,null);
      assert.equal(result.removed,true);
      assert.equal(result.focusRestored,true);
      assert.equal(result.originStillPresent,true);
      assert.match(result.text,/Fictional guest/);
      assert.match(result.text,/Nothing changes until you confirm and save/);
    });
    await scenario('M-005 guest resolution requires explicit choice and supports cancellation', async page => {
      const result = await page.evaluate(async () => {
        const container=document.getElementById('modal-container');
        const content=document.getElementById('modal-content');
        container.classList.remove('hidden');
        content.innerHTML='<button id="fictional-hypervisor-origin-2" type="button">Original control</button>';
        const origin=document.getElementById('fictional-hypervisor-origin-2');
        origin.focus();
        const cancelPending=phaseM005ConfirmHypervisorRemoval('Fictional host', [{id:'guest-two',name:'Guest two'}], 'fictional-host');
        document.querySelector('#phase-m005-hypervisor-dialog [data-action="cancel"]').click();
        const cancelled=await cancelPending;
        const cancelFocus=document.activeElement===origin;
        const acceptPending=phaseM005ConfirmHypervisorRemoval('Fictional host', [{id:'guest-two',name:'Guest two'}], 'fictional-host');
        document.querySelector('#phase-m005-hypervisor-dialog [data-action="confirm"]').click();
        const stillOpen=!!document.getElementById('phase-m005-hypervisor-dialog');
        document.querySelector('[data-m005-guest="0"]').value='unassign';
        document.querySelector('#phase-m005-hypervisor-dialog [data-action="confirm"]').click();
        const accepted=await acceptPending;
        return {cancelled,accepted,cancelFocus,acceptFocus:document.activeElement===origin,
          stillOpen,removed:!document.getElementById('phase-m005-hypervisor-dialog')};
      });
      assert.equal(result.cancelled,null);
      assert.deepEqual(result.accepted,['unassign']);
      assert.equal(result.stillOpen,true,'Confirmation must require a guest decision');
      assert.equal(result.cancelFocus,true);
      assert.equal(result.acceptFocus,true);
      assert.equal(result.removed,true);
    });
    for (const decision of ['escape','confirm']) {
      await scenario('M-005 full hypervisor form save ' + decision, async page => {
        const result=await page.evaluate(async decision => {
          const hostId='fictional-hypervisor-form-host';
          appState.subnets.push({id:'fictional-hypervisor-form-subnet',name:'Hypervisor form subnet',kind:'network',cidr:'10.88.74.0/29',gateway:'10.88.74.1',vlan:3874});
          appState.devices.push(
            {id:hostId,name:'Fictional hypervisor form host',type:'Server - Physical',mountType:'Desktop',location:'Unknown',status:'Active',primaryIp:'10.88.74.2',typeDetails:{serverService_Hypervisor:true}},
            {id:'fictional-hypervisor-form-vm',name:'Fictional hypervisor form VM',type:'Server - Virtual',mountType:'Desktop',location:'Unknown',virtualHostId:hostId}
          );
          localStorage.setItem('caffoot_state',JSON.stringify(appState));
          const before=localStorage.getItem('caffoot_state');
          openDeviceModal(hostId);
          const set=(id,value)=>{const el=document.getElementById(id);if(!el)throw Error('Missing form control '+id);el.value=value;el.dispatchEvent(new Event('change',{bubbles:true}));};
          set('dev-location','Unknown');
          set('dev-mount-type','Desktop');
          set('dev-subnet','fictional-hypervisor-form-subnet');
          set('dev-ip','10.88.74.2');
          const hypervisor=document.getElementById('phase-m005-hosting-enabled');
           if(!hypervisor)throw Error('Shared hosting checkbox missing');
           hypervisor.checked=false;
           hypervisor.dispatchEvent(new Event('change',{bubbles:true}));
          const pending=handleDeviceSubmit({preventDefault(){}},hostId);
          await Promise.resolve();
          const dialog=document.getElementById('phase-m005-hypervisor-dialog');
          if(!dialog)throw Error('Expected hypervisor confirmation missing');
          if(decision==='escape')document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));
          else { document.querySelector('[data-m005-guest="0"]').value='unassign'; document.querySelector('#phase-m005-hypervisor-dialog [data-action="confirm"]').click(); }
          await pending;
          const host=appState.devices.find(d=>d.id===hostId);
          const guest=appState.devices.find(d=>d.id==='fictional-hypervisor-form-vm');
          return {before,after:localStorage.getItem('caffoot_state'),hypervisor:host.typeDetails?.serverService_Hypervisor,
            guestHost:guest.virtualHostId,dialogClosed:!document.getElementById('phase-m005-hypervisor-dialog'),
            formStillOpen:!!document.getElementById('dev-name')};
        },decision);
        assert.equal(result.dialogClosed,true);
        assert.equal(result.guestHost,decision==='escape'?'fictional-hypervisor-form-host':'');
        if(decision==='escape') {
          assert.equal(result.hypervisor,true,'Escape must preserve recorded hypervisor');
          assert.equal(result.after,result.before,'Escape must not persist changes');
          assert.equal(result.formStillOpen,true,'Escape must return to edit form');
        } else {
          assert.equal(result.hypervisor,false,'Confirmed removal must update service');
          assert.notEqual(result.after,result.before,'Confirmed removal must persist');
          const persisted=JSON.parse(result.after);
          assert.equal(persisted.devices.find(d=>d.id==='fictional-hypervisor-form-vm').virtualHostId,'');
        }
      });
    }
    await scenario('M-005 confirmed hypervisor removal rolls back failed storage save', async page => {
      const result=await page.evaluate(async () => {
        const hostId='fictional-hypervisor-failed-save-host';
        appState.subnets.push({id:'fictional-hypervisor-failed-subnet',name:'Failed save subnet',kind:'network',cidr:'10.88.73.0/29',gateway:'10.88.73.1',vlan:3873});
        appState.devices.push(
          {id:hostId,name:'Fictional failed save host',type:'Server - Physical',mountType:'Desktop',location:'Unknown',status:'Active',primaryIp:'10.88.73.2',typeDetails:{serverService_Hypervisor:true}},
          {id:'fictional-hypervisor-failed-vm',name:'Fictional failed save VM',type:'Server - Virtual',mountType:'Desktop',location:'Unknown',virtualHostId:hostId}
        );
        const before=JSON.stringify(appState);
        localStorage.setItem('caffoot_state',before);
        openDeviceModal(hostId);
        const set=(id,value)=>{const el=document.getElementById(id);if(!el)throw Error('Missing form control '+id);el.value=value;el.dispatchEvent(new Event('change',{bubbles:true}));};
        set('dev-location','Unknown');
        set('dev-mount-type','Desktop');
        set('dev-subnet','fictional-hypervisor-failed-subnet');
        set('dev-ip','10.88.73.2');
        const checkbox=document.getElementById('phase-m005-hosting-enabled');
        if(!checkbox)throw Error('Shared hosting checkbox missing');
        checkbox.checked=false;
        checkbox.dispatchEvent(new Event('change',{bubbles:true}));
        const original=Storage.prototype.setItem;
        const notices=[];
        const originalToast=showToast;
        Storage.prototype.setItem=function(key,value){if(key==='caffoot_state')throw Error('fictional storage failure');return original.call(this,key,value)};
        showToast=(message,level)=>notices.push({message,level});
        let thrown=null;
        try {
          const pending=handleDeviceSubmit({preventDefault(){}},hostId);
          await Promise.resolve();
          const confirm=document.querySelector('#phase-m005-hypervisor-dialog [data-action="confirm"]');
          if(!confirm)throw Error('Expected hypervisor confirmation missing');
          document.querySelector('[data-m005-guest="0"]').value='unassign';
          confirm.click();
          await pending;
        } catch(error) {thrown=String(error); }
        finally {Storage.prototype.setItem=original;showToast=originalToast;}
        return {before,after:JSON.stringify(appState),stored:localStorage.getItem('caffoot_state'),
          hostHypervisor:appState.devices.find(d=>d.id===hostId)?.typeDetails?.serverService_Hypervisor,
          guestHost:appState.devices.find(d=>d.id==='fictional-hypervisor-failed-vm')?.virtualHostId,
          formStillOpen:!!document.getElementById('dev-name'),notices,thrown};
      });
      assert.equal(result.thrown,null,'Failed storage write must be handled without throwing');
      assert.equal(result.after,result.before,'Failed save must restore entire in-memory inventory');
      assert.equal(result.stored,result.before,'Failed save must preserve stored inventory');
      assert.equal(result.hostHypervisor,true,'Failed save must retain original Hypervisor service');
      assert.equal(result.guestHost,'fictional-hypervisor-failed-save-host','Guest relationship must remain intact');
      assert.equal(result.formStillOpen,true,'Failed save must keep the edit form open');
      assert(result.notices.some(n=>n.level==='error'&&/not saved/i.test(n.message)),
        'Failed save must report the error to the user');
    });
    await scenario('M-005 legacy missing physical host remains visible', async page => {
      const result = await page.evaluate(() => {
        appState.devices.push({id:'fictional-display-orphan',name:'Fictional orphan guest',type:'Server - Virtual',location:'Unknown',virtualHostId:'fictional-absent-host'});
        phase14CViewDevice('fictional-display-orphan');
        return {text:document.getElementById('phase14c-panel-overview')?.textContent||'',
          original:appState.devices.find(d=>d.id==='fictional-display-orphan')?.virtualHostId};
      });
      assert.match(result.text,/Missing or unavailable host/);
      assert.equal(result.original,'fictional-absent-host','Viewing legacy guest must not modify host reference');
    });
    await scenario('M-005 host deletion requires guest resolution and preserves data on cancellation', async page => {
      const result = await page.evaluate(async () => {
        appState.devices.push(
          {id:'fictional-host-001',name:'Fictional host',type:'Server - Physical',mountType:'Desktop',location:'Unknown'},
          {id:'fictional-vm-001',name:'Fictional VM 1',type:'Server - Virtual',mountType:'Desktop',location:'Unknown',virtualHostId:'fictional-host-001'},
          {id:'fictional-vm-002',name:'Fictional VM 2',type:'Server - Virtual',mountType:'Desktop',location:'Unknown',virtualHostId:'fictional-host-001'}
        );
        const before=JSON.stringify(appState);
        const pending=deleteDevice('fictional-host-001');
        const dialog=document.getElementById('phase-m005-hypervisor-dialog');
        const guestLabels=dialog?.textContent||'';
        dialog?.querySelector('[data-action="cancel"]')?.click();
        await pending;
        return {before,after:JSON.stringify(appState),dialogShown:!!dialog,
          guestLabels,dialogRemoved:!document.getElementById('phase-m005-hypervisor-dialog')};
      });
      assert.equal(result.dialogShown,true,'Host deletion must show guest decisions');
      assert.match(result.guestLabels,/Fictional VM 1/);
      assert.match(result.guestLabels,/Fictional VM 2/);
      assert.equal(result.dialogRemoved,true);
      assert.equal(result.after,result.before,'Cancelled deletion must not change any inventory records');
    });
    await scenario('M-005 host deletion reassigns guest and preserves platform and host history', async page => {
      const result=await page.evaluate(async () => {
        const host={id:'fictional-source-hv',name:'Source HV',type:'Server - Physical',status:'Active',typeDetails:{serverService_Hypervisor:true,hypervisorProduct:'VMware'}};
        const destination={id:'fictional-target-hv',name:'Target HV',type:'Server - Physical',status:'Active',typeDetails:{serverService_Hypervisor:true,hypervisorProduct:'Proxmox'}};
        const guest={id:'fictional-moving-vm',name:'Moving VM',type:'Server - Virtual',status:'Active',virtualHostId:host.id,virtualPlatform:'VMware',operatingSystem:'Guest OS unchanged'};
        appState.devices.push(host,destination,guest);
        const originalConfirm=window.confirm;
        window.confirm=()=>true;
        try {
          const pending=deleteDevice(host.id);
          const selector=document.querySelector('#phase-m005-hypervisor-dialog [data-m005-guest="0"]');
          if(!selector)throw Error('Guest decision selector missing');
          selector.value='host:'+destination.id;
          document.querySelector('#phase-m005-hypervisor-dialog [data-action="confirm"]').click();
          await pending;
        } finally {window.confirm=originalConfirm}
        const updated=appState.devices.find(d=>d.id===guest.id);
        return {sourceExists:!!appState.devices.find(d=>d.id===host.id),
          host:updated?.virtualHostId,platform:updated?.virtualPlatform,os:updated?.operatingSystem,
          previousHosts:updated?.previousVirtualHosts,previousPlatforms:updated?.previousVirtualPlatforms};
      });
      assert.equal(result.sourceExists,false);
      assert.equal(result.host,'fictional-target-hv');
      assert.equal(result.platform,'Proxmox');
      assert.equal(result.os,'Guest OS unchanged');
      assert.equal(result.previousHosts?.at(-1)?.hostId,'fictional-source-hv');
      assert.equal(result.previousPlatforms?.at(-1)?.platform,'VMware');
    });
    await scenario('M-005 host deletion retires guest without deleting history', async page => {
      const result=await page.evaluate(async () => {
        const host={id:'fictional-retire-host',name:'Retiring HV',type:'Server - Physical',status:'Active'};
        const guest={id:'fictional-retired-vm',name:'Retired VM',type:'Server - Virtual',status:'Active',virtualHostId:host.id};
        appState.devices.push(host,guest);
        const originalConfirm=window.confirm;
        window.confirm=()=>true;
        try {
          const pending=deleteDevice(host.id);
          const selector=document.querySelector('#phase-m005-hypervisor-dialog [data-m005-guest="0"]');
          if(!selector)throw Error('Guest decision selector missing');
          selector.value='retire';
          document.querySelector('#phase-m005-hypervisor-dialog [data-action="confirm"]').click();
          await pending;
        } finally {window.confirm=originalConfirm}
        const updated=appState.devices.find(d=>d.id===guest.id);
        return {sourceExists:!!appState.devices.find(d=>d.id===host.id),
          guestExists:!!updated,status:updated?.status,host:updated?.virtualHostId,
          previousHosts:updated?.previousVirtualHosts};
      });
      assert.equal(result.sourceExists,false);
      assert.equal(result.guestExists,true);
      assert.equal(result.status,'Retired');
      assert.equal(result.host,'');
      assert.equal(result.previousHosts?.at(-1)?.hostId,'fictional-retire-host');
      assert.equal(result.previousHosts?.at(-1)?.action,'retire');
    });
    await scenario('M-005 host deletion handles mixed guest decisions and preserves histories', async page => {
      const result=await page.evaluate(async () => {
        const source={id:'fictional-mixed-source',name:'Mixed Source',type:'Server - Physical',status:'Active',typeDetails:{serverService_Hypervisor:true,hypervisorProduct:'VMware'}};
        const target={id:'fictional-mixed-target',name:'Mixed Target',type:'Server - Physical',status:'Active',typeDetails:{serverService_Hypervisor:true,hypervisorProduct:'Proxmox'}};
        const guests=['unassign','retire','reassign'].map((kind,index)=>({
          id:'fictional-mixed-'+kind,name:'Mixed '+kind,type:'Server - Virtual',
          status:'Active',virtualHostId:source.id,virtualPlatform:'VMware',
          operatingSystem:'Guest OS '+index,customHistoricalNote:'Retain '+kind
        }));
        appState.devices.push(source,target,...guests);
        const originalConfirm=window.confirm;
        window.confirm=()=>true;
        try {
          const pending=deleteDevice(source.id);
          const selectors=[...document.querySelectorAll('#phase-m005-hypervisor-dialog [data-m005-guest]')];
          if(selectors.length!==3)throw Error('Expected three guest decisions');
          selectors[0].value='unassign';
          selectors[1].value='retire';
          selectors[2].value='host:'+target.id;
          document.querySelector('#phase-m005-hypervisor-dialog [data-action="confirm"]').click();
          await pending;
        } finally {window.confirm=originalConfirm}
        return {sourceExists:!!appState.devices.find(d=>d.id===source.id),
          guests:guests.map(g=>appState.devices.find(d=>d.id===g.id))};
      });
      assert.equal(result.sourceExists,false);
      assert.equal(result.guests.length,3);
      const [unassigned,retired,reassigned]=result.guests;
      for(const [index,guest] of result.guests.entries()){
        assert(guest,'No dependent guest may be deleted');
        assert.equal(guest.operatingSystem,'Guest OS '+index);
        assert.equal(guest.customHistoricalNote,'Retain '+['unassign','retire','reassign'][index]);
        assert.equal(guest.previousVirtualHosts?.at(-1)?.hostId,'fictional-mixed-source');
      }
      assert.equal(unassigned.virtualHostId,'');
      assert.equal(unassigned.status,'Active');
      assert.equal(unassigned.previousVirtualHosts.at(-1).action,'unassign');
      assert.equal(unassigned.virtualPlatform,'VMware');
      assert.equal(retired.virtualHostId,'');
      assert.equal(retired.status,'Retired');
      assert.equal(retired.previousVirtualHosts.at(-1).action,'retire');
      assert.equal(reassigned.virtualHostId,'fictional-mixed-target');
      assert.equal(reassigned.status,'Active');
      assert.equal(reassigned.virtualPlatform,'Proxmox');
      assert.equal(reassigned.previousVirtualPlatforms?.at(-1)?.platform,'VMware');
    });
    await scenario('M-005 actual guest decision controls require explicit choice and preserve cancelled inventory', async page => {
      await page.evaluate(() => {
        appState.devices.push(
          {id:'fictional-ui-host',name:'Fictional UI Host',type:'Server - Physical',status:'Active'},
          {id:'fictional-ui-guest',name:'Fictional UI Guest',type:'Server - Virtual',status:'Active',virtualHostId:'fictional-ui-host',operatingSystem:'Preserved Guest OS'}
        );
        window.__m005UiBefore=JSON.stringify(appState);
        window.__m005UiPending=deleteDevice('fictional-ui-host');
      });
      const dialog=page.locator('#phase-m005-hypervisor-dialog');
      await dialog.waitFor();
      await dialog.locator('[data-action="confirm"]').click();
      assert.equal(await dialog.count(),1,'Missing guest choice must keep dialog open');
      await dialog.locator('[data-m005-guest="0"]').selectOption('retire');
      await dialog.locator('[data-action="cancel"]').click();
      await page.evaluate(() => window.__m005UiPending);
      const result=await page.evaluate(() => ({
        before:window.__m005UiBefore,after:JSON.stringify(appState),
        host:appState.devices.find(d=>d.id==='fictional-ui-host'),
        guest:appState.devices.find(d=>d.id==='fictional-ui-guest')
      }));
      assert.equal(result.after,result.before,'Cancel through actual dialog controls must not mutate inventory');
      assert(result.host,'Cancelled host deletion must preserve host');
      assert.equal(result.guest.virtualHostId,'fictional-ui-host');
      assert.equal(result.guest.operatingSystem,'Preserved Guest OS');
    });
    await scenario('M-005 actual guest decision controls confirm retirement and persist after reload', async page => {
      await page.evaluate(() => {
        appState.devices.push(
          {id:'fictional-ui-confirm-host',name:'Fictional UI Confirm Host',type:'Server - Physical',status:'Active'},
          {id:'fictional-ui-confirm-guest',name:'Fictional UI Confirm Guest',type:'Server - Virtual',status:'Active',virtualHostId:'fictional-ui-confirm-host',operatingSystem:'Preserved Guest OS'}
        );
        localStorage.setItem('caffoot_state',JSON.stringify(appState));
        window.__m005UiConfirmPending=deleteDevice('fictional-ui-confirm-host');
      });
      const dialog=page.locator('#phase-m005-hypervisor-dialog');
      await dialog.waitFor();
      await dialog.locator('[data-m005-guest="0"]').selectOption('retire');
      page.once('dialog',d=>d.accept());
      await dialog.locator('[data-action="confirm"]').click();
      await page.evaluate(() => window.__m005UiConfirmPending);
      await page.reload({waitUntil:'load'});
      const result=await page.evaluate(() => ({
        host:appState.devices.find(d=>d.id==='fictional-ui-confirm-host'),
        guest:appState.devices.find(d=>d.id==='fictional-ui-confirm-guest')
      }));
      assert.equal(result.host,undefined);
      assert.equal(result.guest.status,'Retired');
      assert.equal(result.guest.virtualHostId,'');
      assert.equal(result.guest.operatingSystem,'Preserved Guest OS');
      assert.equal(result.guest.previousVirtualHosts?.at(-1)?.hostId,'fictional-ui-confirm-host');
    });
    await scenario('M-005 unreferenced host can still be deleted', async page => {
      const result = await page.evaluate(async () => {
        appState.devices.push({id:'fictional-unused-host',name:'Fictional unused host',type:'Server - Physical',mountType:'Desktop',location:'Unknown'});
        const originalConfirm=window.confirm;
        window.confirm=()=>true;
        try { await deleteDevice('fictional-unused-host'); }
        finally { window.confirm=originalConfirm; }
        return {hostExists:!!appState.devices.find(d=>d.id==='fictional-unused-host')};
      });
      assert.equal(result.hostExists,false,'Unreferenced host deletion must remain available');
    });
    await scenario('#164 VM-first purpose choices and eligible-host gating', async page => {
      const result=await page.evaluate(() => {
        const purposes=['Server - Virtual','Desktop','Firewall','Router','NAS','Wireless LAN Controller'];
        openDeviceModal();
        const noHostOption=!!document.querySelector('#dev-deployment option[value="virtual"]');
        const host={id:'fixture-164-host',name:'Fixture #164 Hypervisor',type:'Server - Physical',status:'Active',
          typeDetails:{serverService_Hypervisor:true,hypervisorProduct:'Proxmox VE'}};
        appState.devices.push(host);
        openDeviceModal();
        const deployment=document.getElementById('dev-deployment');
        const optionAvailable=!!deployment.querySelector('option[value="virtual"]');
        deployment.value='virtual';
        deployment.dispatchEvent(new Event('change',{bubbles:true}));
        const purpose=document.getElementById('dev-vm-purpose');
        const choices=purposes.map(type=>{
          purpose.value=type;
          purpose.dispatchEvent(new Event('change',{bubbles:true}));
          return {purpose:type,actual:document.getElementById('dev-type').value,
            hostVisible:!document.getElementById('phase120-virtual-fields').classList.contains('hidden'),
            physicalHidden:document.getElementById('phase120-physical-purpose').classList.contains('hidden')};
        });
        return {noHostOption,optionAvailable,choices,
          hostAvailable:!!document.querySelector('#dev-virtual-host option[value="fixture-164-host"]')};
      });
      assert.equal(result.noHostOption,false,'New VM must not be offered without an eligible host');
      assert.equal(result.optionAvailable,true,'Eligible hypervisor must enable VM creation');
      assert.equal(result.hostAvailable,true,'Eligible host must be selectable');
      assert.equal(result.choices.length,6);
      for(const choice of result.choices){
        assert.equal(choice.actual,choice.purpose,'VM purpose must map to the saved device type');
        assert.equal(choice.hostVisible,true,'VM host and hardware controls must remain visible');
        assert.equal(choice.physicalHidden,true,'Physical device type controls must be hidden for a VM');
      }
    });
    await scenario('#164 new VM requires host and rejects invalid hardware without mutation', async page => {
      const result=await page.evaluate(async () => {
        const host={id:'fixture-164-validation-host',name:'Fixture #164 Validation Host',type:'Server - Physical',
          status:'Active',location:'Unknown',typeDetails:{serverService_Hypervisor:true,hypervisorProduct:'Proxmox VE'}};
        appState.devices.push(host);
        openDeviceModal();
        const deployment=document.getElementById('dev-deployment');
        deployment.value='virtual';
        deployment.dispatchEvent(new Event('change',{bubbles:true}));
        const purpose=document.getElementById('dev-vm-purpose');
        purpose.value='Server - Virtual';
        purpose.dispatchEvent(new Event('change',{bubbles:true}));
        document.getElementById('dev-name').value='Fixture #164 New VM';
        const originalToast=showToast;
        const messages=[];
        showToast=(message)=>messages.push(String(message));
        try {
          const before=appState.devices.length;
          document.getElementById('dev-virtual-host').value='';
          await handleDeviceSubmit({preventDefault(){}},null);
          const missingHost={message:messages.at(-1),unchanged:appState.devices.length===before};
          document.getElementById('dev-virtual-host').value=host.id;
          const fields=Array.from(document.querySelectorAll('[data-phase19b-field]'));
          const allocation=fields.find(x=>x.getAttribute('data-phase19b-field')==='vmVcpu');
          if(!allocation)throw Error('vCPU allocation input missing');
          allocation.value='-2';
          await handleDeviceSubmit({preventDefault(){}},null);
          return {missingHost,invalidAllocation:{message:messages.at(-1),unchanged:appState.devices.length===before}};
        } finally {showToast=originalToast;}
      });
      assert.match(result.missingHost.message,/eligible physical Hypervisor host/);
      assert.equal(result.missingHost.unchanged,true,'Missing host must not create a VM');
      assert.match(result.invalidAllocation.message,/vCPU count must be a positive whole number/);
      assert.equal(result.invalidAllocation.unchanged,true,'Invalid allocation must not create a VM');
    });
    await scenario('#134 virtual machine host selector is on General for Add and Edit', async page => {
      const result = await page.evaluate(() => {
        const host={id:'fixture-134-physical',name:'Fixture Hypervisor',type:'Server - Physical',status:'Active',typeDetails:{serverService_Hypervisor:true,hypervisorProduct:'Proxmox VE'}};
        const guest={id:'fixture-134-guest',name:'Fixture Guest',type:'Server - Virtual',status:'Active',virtualHostId:host.id,virtualPlatform:'Proxmox VE',typeDetails:{}};
        appState.devices.push(host,guest);
        openDeviceModal();
        const deployment=document.getElementById('dev-deployment');
        deployment.value='virtual';
        deployment.dispatchEvent(new Event('change',{bubbles:true}));
        const purpose=document.getElementById('dev-vm-purpose');
        purpose.value='Server - Virtual';
        purpose.dispatchEvent(new Event('change',{bubbles:true}));
        const virtualBlock=document.getElementById('phase120-virtual-fields');
        const add={
          inGeneral:!!document.querySelector('[data-device-form] .form-section-card:first-child #phase120-virtual-fields'),
          inHardware:!!document.querySelector('[data-device-form] .form-section-card:nth-child(2) #phase120-virtual-fields'),
          visible:!!virtualBlock&&!virtualBlock.classList.contains('hidden'),
          hostAvailable:!!document.querySelector('#dev-virtual-host option[value="fixture-134-physical"]')
        };
        document.getElementById('dev-virtual-host').value=host.id;
        const selected=document.getElementById('dev-virtual-host').value;
        openDeviceModal(guest.id);
        const edit={
          inGeneral:!!document.querySelector('[data-device-form] .form-section-card:first-child #phase120-virtual-fields'),
          selected:document.getElementById('dev-virtual-host')?.value,
          visible:!document.getElementById('phase120-virtual-fields')?.classList.contains('hidden')
        };
        const editDeploymentHidden=document.getElementById('dev-deployment')?.closest('.hidden')!==null;
        const editVirtualIdentity=phase120IsVirtualForm();
        return {add,selected,edit,editDeploymentHidden,editVirtualIdentity};
      });
      assert.equal(result.add.inGeneral,true,'Virtual host selector belongs to General');
      assert.equal(result.add.inHardware,false,'Hardware must not contain duplicate virtual host controls');
      assert.equal(result.add.visible,true,'Add virtual server must reveal host controls');
      assert.equal(result.add.hostAvailable,true,'Eligible hypervisor must be selectable');
      assert.equal(result.selected,'fixture-134-physical');
      assert.equal(result.edit.inGeneral,true,'Edit virtual server must use same General controls');
      assert.equal(result.edit.visible,true,'Edit virtual server must reveal host controls');
      assert.equal(result.edit.selected,'fixture-134-physical','Saved host selection must populate Edit');
      assert.equal(result.editDeploymentHidden,true,'Edit must hide creation-only deployment choice');
      assert.equal(result.editVirtualIdentity,true,'Edit must preserve the saved virtual identity');
    });
    await scenario('#134 shared Add and Edit physical host controls preserve legacy values', async page => {
      const result = await page.evaluate(() => {
        const type='Server - Physical';
        openDeviceModal();
        document.getElementById('dev-type').value=type;
        phase19BRefreshFields();
        const add={onGeneral:!!document.querySelector('[data-device-form] .form-section-card:first-child #phase-m005-host-platform-fields'),
          selectOptions:!!document.querySelector('#phase-m005-host-platform-select option[value="__custom__"]'),
          hosting:document.getElementById('phase-m005-hosting-enabled')?.checked,
          duplicate:!!document.querySelector('#phase120-server-services-fields [data-phase19b-field="serverService_Hypervisor"]')};
        document.getElementById('phase-m005-hosting-enabled').checked=true;
        document.getElementById('phase-m005-hosting-enabled').dispatchEvent(new Event('change',{bubbles:true}));
        const productSelect=document.getElementById('phase-m005-host-platform-select');
        productSelect.value='Proxmox VE';
        productSelect.dispatchEvent(new Event('change',{bubbles:true}));
        const selected={product:document.getElementById('phase-m005-host-platform').value,
          customHidden:document.getElementById('phase-m005-host-platform').classList.contains('hidden')};
        productSelect.value='__custom__';
        productSelect.dispatchEvent(new Event('change',{bubbles:true}));
        const customVisible=!document.getElementById('phase-m005-host-platform').classList.contains('hidden');
        document.getElementById('phase-m005-host-platform').value='Custom Hypervisor';
        document.getElementById('phase-m005-host-version').value='2026.1';
        const enabled=phase19BReadFields();
        const host={id:'fictional-134-host',name:'Historical host',type,status:'Active',
          mountType:'Desktop',location:'Unknown',serverService_Hypervisor:true,
          typeDetails:{hypervisorProduct:'Historical Platform',hypervisorVersion:'Legacy 1'}};
        appState.devices.push(host);
        openDeviceModal(host.id);
        const edit={hosting:document.getElementById('phase-m005-hosting-enabled')?.checked,
          product:document.getElementById('phase-m005-host-platform')?.value,
          version:document.getElementById('phase-m005-host-version')?.value,
          flag:phase19BReadFields().serverService_Hypervisor};
        document.getElementById('phase-m005-hosting-enabled').checked=false;
        document.getElementById('phase-m005-hosting-enabled').dispatchEvent(new Event('change',{bubbles:true}));
        const disabled={flag:phase19BReadFields().serverService_Hypervisor,
          product:document.getElementById('phase-m005-host-platform').value,
          hidden:document.getElementById('phase-m005-hosting-details').hidden};
        return {add,selected,customVisible,enabled,edit,disabled};
      });
      assert.equal(result.add.onGeneral,true,'Hosting controls should appear in the General tab');
      assert.equal(result.add.selectOptions,true,'Hypervisor software should offer Custom / Other');
      assert.equal(result.selected.product,'Proxmox VE','Recognised dropdown choice must update saved product field');
      assert.equal(result.selected.customHidden,true,'Recognised choice must hide custom input');
      assert.equal(result.customVisible,true,'Custom / Other must reveal custom input');
      assert.equal(result.add.hosting,false);
      assert.equal(result.add.duplicate,false);
      assert.equal(result.enabled.serverService_Hypervisor,true);
      assert.equal(result.enabled.hypervisorProduct,'Custom Hypervisor');
      assert.equal(result.enabled.hypervisorVersion,'2026.1');
      assert.equal(result.edit.hosting,true);
      assert.equal(result.edit.flag,true);
      assert.equal(result.edit.product,'Historical Platform');
      assert.equal(result.edit.version,'Legacy 1');
      assert.equal(result.disabled.flag,false);
      assert.equal(result.disabled.product,'Historical Platform');
      assert.equal(result.disabled.hidden,true);
    });
    await scenario('#134 physical hypervisor save persists through reload', async page => {
      const result=await page.evaluate(async () => {
        const hostId='fictional-134-persist-host';
        appState.subnets.push({id:'fictional-134-persist-subnet',name:'Fictional hosting subnet',kind:'network',cidr:'10.88.72.0/29',gateway:'10.88.72.1',vlan:3872});
        appState.devices.push({id:hostId,name:'Fictional hosting host',type:'Server - Physical',
          mountType:'Desktop',location:'Unknown',status:'Active',primaryIp:'10.88.72.2',
          typeDetails:{serverService_Hypervisor:false}});
        openDeviceModal(hostId);
        const set=(id,value)=>{const el=document.getElementById(id);if(!el)throw Error('Missing form control '+id);el.value=value;el.dispatchEvent(new Event('change',{bubbles:true}));};
        set('dev-location','Unknown');
        set('dev-mount-type','Desktop');
        set('dev-subnet','fictional-134-persist-subnet');
        set('dev-ip','10.88.72.2');
        const enabled=document.getElementById('phase-m005-hosting-enabled');
        enabled.checked=true;
        enabled.dispatchEvent(new Event('change',{bubbles:true}));
        set('phase-m005-host-platform-select','Microsoft Hyper-V');
        set('phase-m005-host-version','2026');
        await handleDeviceSubmit({preventDefault(){}},hostId);
        return {stored:JSON.parse(localStorage.getItem('caffoot_state')||'{}').devices?.find(d=>d.id===hostId),
          inMemory:appState.devices.find(d=>d.id===hostId)};
      });
      assert.equal(result.stored?.typeDetails?.serverService_Hypervisor,true);
      assert.equal(result.stored?.typeDetails?.hypervisorProduct,'Microsoft Hyper-V');
      assert.equal(result.stored?.typeDetails?.hypervisorVersion,'2026');
      assert.equal(result.inMemory?.typeDetails?.hypervisorProduct,'Microsoft Hyper-V');
      await page.reload({waitUntil:'load'});
      const restored=await page.evaluate(() => {
        const host=appState.devices.find(d=>d.id==='fictional-134-persist-host');
        openDeviceModal(host.id);
        return {host,checked:document.getElementById('phase-m005-hosting-enabled').checked,
          selected:document.getElementById('phase-m005-host-platform-select').value,
          version:document.getElementById('phase-m005-host-version').value};
      });
      assert.equal(restored.checked,true);
      assert.equal(restored.selected,'Microsoft Hyper-V');
      assert.equal(restored.version,'2026');
    });
    await scenario('#134 custom hypervisor JSON backup import and reload preserves host and guest', async page => {
      const raw=await page.evaluate(() => {
        const backup=JSON.parse(JSON.stringify(appState));
        backup.devices.push(
          {id:'fictional-134-import-host',name:'Fictional custom hypervisor host',
            type:'Server - Physical',mountType:'Desktop',location:'Unknown',status:'Active',
            typeDetails:{serverService_Hypervisor:true,hypervisorProduct:'Historical Custom Hypervisor',hypervisorVersion:'Legacy 4.2'}},
          {id:'fictional-134-import-guest',name:'Fictional hosted VM',
            type:'Server - Virtual',mountType:'Desktop',location:'Unknown',status:'Active',
            virtualHostId:'fictional-134-import-host',virtualPlatform:'Historical Custom Hypervisor',
            operatingSystem:'Historical Guest OS',operatingSystemVersion:'Legacy Guest 1'}
        );
        return backup;
      });
      page.on('dialog',dialog=>dialog.accept());
      await page.locator('#import-file').setInputFiles({
        name:'fictional-134-custom-hypervisor.json',mimeType:'application/json',
        buffer:Buffer.from(JSON.stringify(raw))
      });
      await page.waitForFunction(() => {
        const stored=localStorage.getItem('caffoot_state');
        return !!stored && JSON.parse(stored).devices?.some(d=>d.id==='fictional-134-import-host');
      },null,{timeout:10000});
      await page.reload({waitUntil:'load'});
      const result=await page.evaluate(() => {
        const host=appState.devices.find(d=>d.id==='fictional-134-import-host');
        const guest=appState.devices.find(d=>d.id==='fictional-134-import-guest');
        openDeviceModal(host.id);
        return {host,guest,checked:document.getElementById('phase-m005-hosting-enabled').checked,
          choice:document.getElementById('phase-m005-host-platform-select').value,
          product:document.getElementById('phase-m005-host-platform').value,
          version:document.getElementById('phase-m005-host-version').value};
      });
      assert.equal(result.host.typeDetails.serverService_Hypervisor,true);
      assert.equal(result.host.typeDetails.hypervisorProduct,'Historical Custom Hypervisor');
      assert.equal(result.host.typeDetails.hypervisorVersion,'Legacy 4.2');
      assert.equal(result.checked,true);
      assert.equal(result.choice,'__custom__');
      assert.equal(result.product,'Historical Custom Hypervisor');
      assert.equal(result.version,'Legacy 4.2');
      assert.equal(result.guest.virtualHostId,'fictional-134-import-host');
      assert.equal(result.guest.virtualPlatform,'Historical Custom Hypervisor');
      assert.equal(result.guest.operatingSystem,'Historical Guest OS');
    });
    await scenario('M-005 baseline orphan host validation', async page => {
      const result = await page.evaluate(() => {
        appState.devices.push({id:'fictional-orphan-vm',name:'Fictional orphan VM',
          type:'Server - Virtual',mountType:'Desktop',location:'Unknown',
          virtualHostId:'fictional-missing-host'});
        return {issues:validateApplicationState(),hostId:appState.devices.at(-1).virtualHostId};
      });
      assert.equal(result.hostId,'fictional-missing-host');
      assert.equal(result.issues.some(x=>/virtual.host|fictional-missing-host/i.test(x)),false,
        'Baseline: general validation currently does not report orphan virtualHostId');
      console.log('OBSERVED M-005: general validation did not flag fictional orphan host reference');
    });

    await scenario('M-005 D13 permanent host identity protects dependent VMs', async page => {
      const result = await page.evaluate(async () => {
        const hostId='fictional-d13-host';
        appState.subnets.push({id:'fictional-d13-subnet',name:'D13 subnet',kind:'network',cidr:'10.88.76.0/29',gateway:'10.88.76.1',vlan:3876});
        appState.devices.push(
          {id:hostId,name:'Fictional D13 host',type:'Server - Physical',mountType:'Desktop',location:'Unknown',status:'Active',primaryIp:'10.88.76.2'},
          {id:'fictional-d13-vm',name:'Fictional D13 VM',type:'Server - Virtual',mountType:'Desktop',location:'Unknown',virtualHostId:hostId}
        );
        openDeviceModal(hostId);
        const deploymentHidden=!!document.getElementById('dev-deployment')?.closest('.hidden');
        const typeHidden=!!document.getElementById('dev-type')?.closest('.hidden');
        const set=(id,value)=>{const el=document.getElementById(id);if(!el)throw Error('Missing form control '+id);el.value=value;el.dispatchEvent(new Event('change',{bubbles:true}));};
        // Attempt an otherwise prohibited identity change programmatically.
        set('dev-type','Server - Virtual');
        set('dev-name','Fictional D13 host');
        set('dev-location','Unknown');
        set('dev-mount-type','Desktop');
        set('dev-subnet','fictional-d13-subnet');
        set('dev-ip','10.88.76.2');
        const notices=[];
        const originalToast=showToast;
        showToast=(message,level)=>notices.push({message,level});
        try {await handleDeviceSubmit({preventDefault(){}},hostId);}
        finally {showToast=originalToast;}
        return {hostType:appState.devices.find(d=>d.id===hostId)?.type,
          vmHost:appState.devices.find(d=>d.id==='fictional-d13-vm')?.virtualHostId,
          notices,deploymentHidden,typeHidden,
          guestDialog:!!document.getElementById('phase-m005-hypervisor-dialog'),
          conversionDialog:!!document.getElementById('phase130-conversion-dialog')};
      });
      assert.equal(result.deploymentHidden,true,'Edit must hide creation-only deployment selection');
      assert.equal(result.typeHidden,true,'Edit must hide creation-only device type selection');
      assert.equal(result.hostType,'Server - Physical','Blocked identity change must preserve physical host type');
      assert.equal(result.vmHost,'fictional-d13-host','Blocked identity change must preserve dependent VM');
      assert.equal(result.notices.some(n=>/Device identity cannot be changed/.test(n.message)),true,'Save must reject attempted identity change');
      assert.equal(result.guestDialog,false,'Rejected identity change must not invoke guest resolution');
      assert.equal(result.conversionDialog,false,'Rejected identity change must not invoke conversion dialogue');
    });
    await scenario('M-005 baseline detached legacy backup host reference', async page => {
      const result=await page.evaluate(() => {
        const raw=JSON.parse(JSON.stringify(appState));
        raw.devices.push({id:'fictional-legacy-vm',name:'Fictional legacy VM',
          type:'Server - Virtual',mountType:'Desktop',location:'Unknown',
          virtualHostId:'fictional-missing-legacy-host'});
        const before=JSON.stringify(raw);
        let candidate=null,error=null;
        try {candidate=phase16CCheckBackup(raw);}
        catch(e){error=String(e.message||e);}
        return {error,rawUnchanged:JSON.stringify(raw)===before,
          hostId:candidate?.devices.find(d=>d.id==='fictional-legacy-vm')?.virtualHostId||null};
      });
      assert.equal(result.error,null,'Baseline: legacy orphan host currently passes general backup check');
      assert.equal(result.rawUnchanged,true,'Backup validation must not mutate the input backup');
      assert.equal(result.hostId,'fictional-missing-legacy-host','Legacy orphan host identity must not silently change');
      console.log('OBSERVED M-005: backup candidate accepts orphan virtualHostId without modifying source JSON');
    });
    await scenario('M-005 historical orphan virtual machine full JSON import and reload', async page => {
      const raw=await page.evaluate(() => {
        const backup=JSON.parse(JSON.stringify(appState));
        backup.devices.push({id:'fictional-import-orphan-vm',name:'Historical orphan VM',
          type:'Server - Virtual',mountType:'Desktop',location:'Unknown',
          virtualHostId:'fictional-previous-host',virtualPlatform:'Legacy Hypervisor',
          operatingSystem:'Historical guest OS',customHistoricalNote:'Keep this original value'});
        return backup;
      });
      assert.equal(Object.prototype.hasOwnProperty.call(raw,'caffootBackup'),false);
      page.on('dialog',dialog=>dialog.accept());
      await page.locator('#import-file').setInputFiles({
        name:'fictional-historical-orphan.json',mimeType:'application/json',
        buffer:Buffer.from(JSON.stringify(raw))
      });
      await page.waitForFunction(() => {
        const stored=localStorage.getItem('caffoot_state');
        return !!stored&&JSON.parse(stored).devices?.some(d=>d.id==='fictional-import-orphan-vm');
      },null,{timeout:10000});
      await page.reload({waitUntil:'load'});
      const result=await page.evaluate(() => {
        const vm=appState.devices.find(d=>d.id==='fictional-import-orphan-vm');
        const stored=JSON.parse(localStorage.getItem('caffoot_state')).devices
          .find(d=>d.id==='fictional-import-orphan-vm');
        return {vm,stored};
      });
      assert(result.vm,'Historical virtual machine must remain after reload');
      assert.equal(result.vm.virtualHostId,'fictional-previous-host');
      assert.equal(result.vm.virtualPlatform,'Legacy Hypervisor');
      assert.equal(result.vm.operatingSystem,'Historical guest OS');
      assert.equal(result.vm.customHistoricalNote,'Keep this original value');
      assert.equal(result.stored.virtualHostId,'fictional-previous-host');
      assert.equal(result.stored.customHistoricalNote,'Keep this original value');
    });
    await scenario('M-006 N31 historical IPAM file import and reload', async page => {
      const raw = await page.evaluate(() => {
        const backup = JSON.parse(JSON.stringify(appState));
        backup.subnets.push({id:'fictional-legacy-subnet',name:'Historical IPAM subnet',kind:'network',cidr:'10.88.77.0/29',gateway:'10.88.77.1',vlan:3877});
        backup.ipAllocations['10.88.77.2'] = {status:'Available',deviceId:'',hostname:'legacy-host',notes:'Historical address notes'};
        backup.ipAllocations['10.88.77.3'] = {status:'Available',deviceId:'',reservedForDeviceId:'fictional-missing-historical-device',hostname:'legacy-reservation',notes:'Different historical notes'};
        return backup;
      });
      assert.equal(Object.prototype.hasOwnProperty.call(raw,'caffootBackup'),false,'Fixture must use legacy unversioned JSON');
      page.on('dialog', dialog => dialog.accept());
      await page.locator('#import-file').setInputFiles({
        name:'fictional-legacy-ipam.json',
        mimeType:'application/json',
        buffer:Buffer.from(JSON.stringify(raw))
      });
      try {
        await page.waitForFunction(() => {
          const saved=localStorage.getItem('caffoot_state');
          if(!saved) return false;
          const allocations=JSON.parse(saved).ipAllocations;
          return allocations?.['10.88.77.2']?.notes==='Historical address notes' &&
            allocations?.['10.88.77.3']?.notes==='Different historical notes';
        },null,{timeout:10000});
      } catch (error) {
        const diagnostic=await page.evaluate(() => ({
          modalText:document.getElementById('modal-container')?.innerText?.slice(0,1200)||'',
          storedAllocations:Object.keys(JSON.parse(localStorage.getItem('caffoot_state')||'{}').ipAllocations||{}).slice(0,12),
          inMemoryNotes:[appState.ipAllocations['10.88.77.2']?.notes,appState.ipAllocations['10.88.77.3']?.notes],
          selectedFile:document.getElementById('import-file')?.files?.[0]?.name||null
        }));
        throw new Error('N31 import persistence not observed: '+JSON.stringify(diagnostic)+'; '+error.message);
      }
      await page.reload({waitUntil:'load'});
      const persisted=await page.evaluate(() => ({
        first:appState.ipAllocations['10.88.77.2']?.notes,
        second:appState.ipAllocations['10.88.77.3']?.notes,
        historicalReservation:appState.ipAllocations['10.88.77.3']?.reservedForDeviceId,
        storedReservation:JSON.parse(localStorage.getItem('caffoot_state')).ipAllocations['10.88.77.3']?.reservedForDeviceId,
        storedFirst:JSON.parse(localStorage.getItem('caffoot_state')).ipAllocations['10.88.77.2']?.notes
      }));
      assert.equal(persisted.first,'Historical address notes');
      assert.equal(persisted.second,'Different historical notes');
      assert.equal(persisted.historicalReservation,'fictional-missing-historical-device','Legacy reservation reference must not be silently rewritten');
      assert.equal(persisted.storedReservation,'fictional-missing-historical-device','Stored legacy reservation reference must survive import');
      assert.equal(persisted.storedFirst,'Historical address notes');
    });
    await scenario('M-006 N22 actual individual IP form save and release', async page => {
      await page.evaluate(() => {
        appState.subnets.push({id:'fictional-ui-subnet',name:'UI IPAM check',kind:'network',
          cidr:'10.88.79.0/29',gateway:'10.88.79.1',vlan:3879});
        appState.ipAllocations['10.88.79.2']={status:'Reserved',deviceId:'',
          reservedForDeviceId:'fictional-historical-owner',hostname:'old-label',
          notes:'Original address note',customLegacyField:'keep-history'};
        saveState();
        openIpModal('10.88.79.2');
      });
      const form=page.locator('form[data-form-action="ip"][data-ip="10.88.79.2"]');
      await form.locator('#ip-notes').fill('Edited through real IPAM form');
      await form.locator('button[type="submit"]').click();
      const saved=await page.evaluate(() => appState.ipAllocations['10.88.79.2']);
      assert.equal(saved.notes,'Edited through real IPAM form');
      await page.evaluate(() => openIpModal('10.88.79.2'));
      const releaseForm=page.locator('form[data-form-action="ip"][data-ip="10.88.79.2"]');
      await releaseForm.locator('#ip-status').selectOption('Available');
      await releaseForm.locator('button[type="submit"]').click();
      await page.reload({waitUntil:'load'});
      const released=await page.evaluate(() => ({
        memory:appState.ipAllocations['10.88.79.2'],
        stored:JSON.parse(localStorage.getItem('caffoot_state')).ipAllocations['10.88.79.2']
      }));
      for(const allocation of [released.memory,released.stored]){
        assert.equal(allocation.status,'Available');
        assert.equal(allocation.deviceId,'');
        assert.equal(allocation.reservedForDeviceId,'');
        assert.equal(allocation.notes,'Edited through real IPAM form');
        assert.equal(allocation.customLegacyField,'keep-history');
      }
    });
    await scenario('M-009 existing network gateway owner survives subnet edit', async page => {
      for (const type of ['Router', 'Firewall', 'Layer 3 Switch']) {
        const result = await page.evaluate(type => {
          const suffix = type.toLowerCase().replace(/[^a-z0-9]/g, '');
          const subnet = {id:'fictional-gateway-'+suffix,name:'Before edit',kind:'network',cidr:'10.88.72.0/29',gateway:'10.88.72.1',vlan:3872};
          const owner = {id:'fictional-owner-'+suffix,name:'Fictional '+type,type,primaryIp:subnet.gateway};
          appState.subnets.push(subnet);
          appState.devices.push(owner);
          appState.ipAllocations[subnet.gateway] = {status:'Assigned',deviceId:owner.id,reservedForDeviceId:'',notes:'Preserve gateway notes'};
          const originalAllocation = JSON.stringify(appState.ipAllocations[subnet.gateway]);
          const fields = {'sub-kind':'network','sub-cidr':subnet.cidr,'sub-name':'After edit','sub-vlan':String(subnet.vlan),'sub-gw':subnet.gateway,'sub-desc':'Edited safely','sub-parent':''};
          for (const [id,value] of Object.entries(fields)) {
            let el = document.getElementById(id);
            if (!el) { el = document.createElement('input'); el.id=id; document.body.appendChild(el); }
            el.value=value;
          }
          handleSubnetSubmit({preventDefault(){}},subnet.id);
          const edited=appState.subnets.find(s=>s.id===subnet.id);
          const persisted=JSON.parse(localStorage.getItem('caffoot_state'));
          const result={name:edited.name,allocation:JSON.stringify(appState.ipAllocations[subnet.gateway]),originalAllocation,
            savedName:persisted.subnets.find(s=>s.id===subnet.id)?.name,savedAllocation:JSON.stringify(persisted.ipAllocations[subnet.gateway])};
          appState.subnets=appState.subnets.filter(s=>s.id!==subnet.id);
          appState.devices=appState.devices.filter(d=>d.id!==owner.id);
          delete appState.ipAllocations[subnet.gateway];
          return result;
        },type);
        assert.equal(result.name,'After edit',type+' should allow unchanged legitimate gateway');
        assert.equal(result.savedName,'After edit',type+' edit should persist');
        assert.equal(result.allocation,result.originalAllocation,type+' must preserve IPAM ownership and notes');
        assert.equal(result.savedAllocation,result.originalAllocation,type+' must persist IPAM without mutation');
      }
    });
    await scenario('M-009 changed gateway cannot take another device address', async page => {
      const result = await page.evaluate(() => {
        const subnet = {id:'fictional-gateway-conflict',name:'Before rejected edit',kind:'network',cidr:'10.88.73.0/29',gateway:'10.88.73.1',vlan:3873};
        const gatewayOwner = {id:'fictional-gateway-current-owner',name:'Fictional Router',type:'Router',primaryIp:subnet.gateway};
        const conflictingOwner = {id:'fictional-gateway-other-owner',name:'Fictional Server',type:'Server',primaryIp:'10.88.73.2'};
        appState.subnets.push(subnet);
        appState.devices.push(gatewayOwner,conflictingOwner);
        appState.ipAllocations[subnet.gateway] = {status:'Assigned',deviceId:gatewayOwner.id,reservedForDeviceId:'',notes:'Current gateway note'};
        appState.ipAllocations[conflictingOwner.primaryIp] = {status:'Assigned',deviceId:conflictingOwner.id,reservedForDeviceId:'',notes:'Keep conflicting owner note'};
        const beforeSubnet = JSON.stringify(subnet);
        const beforeGateway = JSON.stringify(appState.ipAllocations[subnet.gateway]);
        const beforeConflict = JSON.stringify(appState.ipAllocations[conflictingOwner.primaryIp]);
        const beforeSaved = localStorage.getItem('caffoot_state');
        const fields = {'sub-kind':'network','sub-cidr':subnet.cidr,'sub-name':'Should not save','sub-vlan':String(subnet.vlan),'sub-gw':conflictingOwner.primaryIp,'sub-desc':'Rejected edit','sub-parent':''};
        for(const [id,value] of Object.entries(fields)){
          let el=document.getElementById(id);
          if(!el){el=document.createElement('input');el.id=id;document.body.appendChild(el);}
          el.value=value;
        }
        handleSubnetSubmit({preventDefault(){}},subnet.id);
        const result = {
          subnet:JSON.stringify(appState.subnets.find(s=>s.id===subnet.id)),beforeSubnet,
          gateway:JSON.stringify(appState.ipAllocations[subnet.gateway]),beforeGateway,
          conflict:JSON.stringify(appState.ipAllocations[conflictingOwner.primaryIp]),beforeConflict,
          storageUnchanged:localStorage.getItem('caffoot_state')===beforeSaved
        };
        appState.subnets=appState.subnets.filter(s=>s.id!==subnet.id);
        appState.devices=appState.devices.filter(d=>![gatewayOwner.id,conflictingOwner.id].includes(d.id));
        delete appState.ipAllocations[subnet.gateway];
        delete appState.ipAllocations[conflictingOwner.primaryIp];
        return result;
      });
      assert.equal(result.subnet,result.beforeSubnet,'Rejected gateway change must preserve subnet');
      assert.equal(result.gateway,result.beforeGateway,'Rejected change must preserve original gateway owner and notes');
      assert.equal(result.conflict,result.beforeConflict,'Rejected change must preserve conflicting owner and notes');
      assert.equal(result.storageUnchanged,true,'Rejected gateway change must not persist inventory changes');
    });
    await scenario('M-006 N22 individual and bulk release retain notes', async page => {
      const result=await page.evaluate(() => {
        const subnet={id:'fictional-release-subnet',name:'Release checks',kind:'network',cidr:'10.88.78.0/29',gateway:'10.88.78.1',vlan:3878};
        appState.subnets.push(subnet);
        const first='10.88.78.2',second='10.88.78.3';
        appState.ipAllocations[first]={status:'Reserved',deviceId:'',reservedForDeviceId:'fictional-missing-device',hostname:'original-host',notes:'Keep first address note',customLegacyField:'historical'};
        appState.ipAllocations[second]={status:'Available',deviceId:'',reservedForDeviceId:'fictional-missing-device',hostname:'second-host',notes:'Keep second address note',customLegacyField:'historical'};
        for(const [id,value] of [['ip-status','Available'],['ip-hostname','original-host'],['ip-notes','Keep first address note']]) {
          let el=document.getElementById(id);
          if(!el){el=document.createElement('input');el.id=id;document.body.appendChild(el);}
          el.value=value;
        }
        handleIpSubmit({preventDefault(){}},first);
        const individual=JSON.parse(JSON.stringify(appState.ipAllocations[first]));
        const plan=phase12BBulkPlan(subnet,3,3,'Available','','');
        phase12BPending={subnetId:subnet.id,start:3,end:3,status:'Available',hostname:'',notes:''};
        phase12BApply();
        return {individual,planChanges:plan.changes.length,bulk:appState.ipAllocations[second],saved:JSON.parse(localStorage.getItem('caffoot_state')).ipAllocations};
      });
      assert.equal(result.individual.status,'Available');
      assert.equal(result.individual.deviceId,'');
      assert.equal(result.individual.reservedForDeviceId,'');
      assert.equal(result.individual.notes,'Keep first address note');
      assert.equal(result.individual.customLegacyField,'historical');
      assert.equal(result.planChanges,1,'Bulk release must clear a stale reservation even if already Available');
      assert.equal(result.bulk.status,'Available');
      assert.equal(result.bulk.reservedForDeviceId,'');
      assert.equal(result.bulk.notes,'Keep second address note');
      assert.equal(result.bulk.customLegacyField,'historical');
      assert.equal(result.saved['10.88.78.2'].notes,'Keep first address note');
      assert.equal(result.saved['10.88.78.3'].reservedForDeviceId,'');
      await page.reload({waitUntil:'load'});
      const after=await page.evaluate(() => ({
        first:appState.ipAllocations['10.88.78.2'],
        second:appState.ipAllocations['10.88.78.3']
      }));
      assert.equal(after.first.notes,'Keep first address note');
      assert.equal(after.first.reservedForDeviceId,'');
      assert.equal(after.second.notes,'Keep second address note');
      assert.equal(after.second.reservedForDeviceId,'');
    });
    await scenario('#94 S11 failed device deletion restores persisted and in-memory inventory', async page => {
      const result = await page.evaluate(() => {
        const device = {id:'issue94-delete-device',name:'Issue 94 fictional device',type:'Server - Physical'};
        appState.devices.push(device);
        if (!saveState()) throw Error('Cannot establish fictional device baseline');
        const beforeMemory = JSON.stringify(appState);
        const beforeStored = localStorage.getItem('caffoot_state');
        const original = Storage.prototype.setItem;
        Storage.prototype.setItem = function(key,value) {
          if (key === 'caffoot_state') return;
          return original.call(this,key,value);
        };
        let committed;
        try {
          appState.devices = appState.devices.filter(d => d.id !== device.id);
          committed = phase11BCommitDelete(beforeMemory,'Device');
        } finally { Storage.prototype.setItem = original; }
        return {committed,beforeMemory,afterMemory:JSON.stringify(appState),
          beforeStored,afterStored:localStorage.getItem('caffoot_state')};
      });
      assert.equal(result.committed,false,'Failed device deletion must not report success');
      assert.equal(result.afterMemory,result.beforeMemory,'Failed deletion must restore the inventory');
      assert.equal(result.afterStored,result.beforeStored,'Failed deletion must preserve stored bytes');
      await page.reload({waitUntil:'load'});
      assert.equal(await page.evaluate(() => !!appState.devices.find(d => d.id === 'issue94-delete-device')),
        true,'Deleted device must remain after reload');
    });
    await scenario('#94 S20 failed server service restoration preserves catalogue', async page => {
      const result = await page.evaluate(() => {
        const entry = {key:'serverService_issue94fictional',label:'Issue 94 fictional service',archived:true};
        appState.serverFunctions = [...(appState.serverFunctions || []),entry];
        if (!saveState()) throw Error('Cannot establish fictional catalogue baseline');
        const beforeMemory = JSON.stringify(appState.serverFunctions);
        const beforeStored = localStorage.getItem('caffoot_state');
        const original = Storage.prototype.setItem;
        Storage.prototype.setItem = function(key,value) {
          if (key === 'caffoot_state') return;
          return original.call(this,key,value);
        };
        try { phase120RestoreServerService(entry.key); }
        finally { Storage.prototype.setItem = original; }
        return {beforeMemory,afterMemory:JSON.stringify(appState.serverFunctions),
          beforeStored,afterStored:localStorage.getItem('caffoot_state')};
      });
      assert.equal(result.afterMemory,result.beforeMemory,'Failed catalogue restore must roll back');
      assert.equal(result.afterStored,result.beforeStored,'Failed catalogue restore must preserve stored bytes');
      await page.reload({waitUntil:'load'});
      assert.equal(await page.evaluate(() => appState.serverFunctions.find(x => x.key === 'serverService_issue94fictional')?.archived),
        true,'Archived service must remain archived after reload');
    });
    await scenario('#97 rack report and dashboard count ordinary accessories but not vertical 0U', async page => {
      const result = await page.evaluate(() => {
        appState.racks.push({id:'fixture97rack',name:'Fixture #97 rack',heightU:12});
        appState.devices.push({id:'fixture97server',name:'Fixture #97 server',type:'Server - Physical',
          rackId:'fixture97rack',face:'front',rackUStart:2,rackUEnd:3});
        appState.rackAccessories.push(
          {id:'fixture97shelf',name:'Shelf',type:'shelf',rackId:'fixture97rack',face:'front',startU:5,heightU:1},
          {id:'fixture97horizontal',name:'PDU',type:'pdu_horizontal',rackId:'fixture97rack',face:'rear',startU:6,heightU:1},
          {id:'fixture97vertical',name:'Vertical PDU',type:'pdu_vertical',rackId:'fixture97rack',face:'front',startU:1,heightU:12},
          {id:'fixture97cable',name:'Vertical cable',type:'cable_vertical',rackId:'fixture97rack',face:'rear',startU:1,heightU:12}
        );
        const row=phase10DReportData().racks.find(r=>r.name==='Fixture #97 rack');
        return {row};
      });
      assert.equal(result.row.front,3,'Front should include 2U server and 1U shelf');
      assert.equal(result.row.rear,1,'Rear should include horizontal 1U PDU only');
      assert.equal(result.row.percent,25,'Capacity uses fuller face, excluding vertical 0U');
    });
    await scenario('#97 legacy rack accessory types normalise on browser startup', async page => {
      await page.evaluate(() => {
        const saved=JSON.parse(JSON.stringify(appState));
        saved.racks.push({id:'fixture97startup',name:'Fixture 97 startup rack',heightU:9});
        saved.rackAccessories.push({id:'fixture97startupfan',rackId:'fixture97startup',
          face:'front',startU:1,heightU:2,type:'fan',name:'Historical fan'});
        localStorage.setItem('caffoot_state',JSON.stringify(saved));
      });
      await page.reload({waitUntil:'load'});
      const result=await page.evaluate(() => ({
        type:appState.rackAccessories.find(a=>a.id==='fixture97startupfan')?.type,
        recovery:!!phase17AStorageRecovery,
        storedType:JSON.parse(localStorage.getItem('caffoot_state')).rackAccessories
          .find(a=>a.id==='fixture97startupfan')?.type
      }));
      assert.equal(result.type,'fan_tray','Historical startup accessory should be canonicalised');
      assert.equal(result.recovery,false,'Valid historical inventory must load without recovery');
      assert.equal(result.storedType,'fan','Startup normalisation must not silently rewrite stored inventory');
    });
    await scenario('#97 legacy rack accessory backup types migrate safely', async page => {
      const result=await page.evaluate(() => {
        const raw=JSON.parse(JSON.stringify(appState));
        raw.racks.push({id:'fixture97legacyrack',name:'Fixture 97 legacy rack',heightU:12});
        raw.rackAccessories.push(
          {id:'fixture97fan',rackId:'fixture97legacyrack',face:'front',startU:1,heightU:2,type:'fan',name:'Legacy fan'},
          {id:'fixture97pdu',rackId:'fixture97legacyrack',face:'rear',startU:3,heightU:1,type:'pdu',name:'Legacy PDU'},
          {id:'fixture97vent',rackId:'fixture97legacyrack',face:'front',startU:5,heightU:1,type:'vent',name:'Legacy vent'}
        );
        const original=JSON.stringify(raw);
        const candidate=phase16CCheckBackup(raw);
        const converted=candidate.rackAccessories.filter(x=>x.rackId==='fixture97legacyrack')
          .map(x=>({type:x.type,startU:x.startU,heightU:x.heightU,face:x.face}));
        const invalid=JSON.parse(original);
        invalid.rackAccessories[invalid.rackAccessories.length-1].type='unknown_legacy_type';
        let rejected=false;
        try {phase16CCheckBackup(invalid);} catch(e){rejected=/unsupported accessory type/.test(e.message);}
        return {untouched:JSON.stringify(raw)===original,converted,rejected};
      });
      assert.equal(result.untouched,true,'Import migration must not mutate the original backup');
      assert.deepEqual(result.converted,[
        {type:'fan_tray',startU:1,heightU:2,face:'front'},
        {type:'pdu_horizontal',startU:3,heightU:1,face:'rear'},
        {type:'ventilation',startU:5,heightU:1,face:'front'}
      ]);
      assert.equal(result.rejected,true,'Unknown accessory types must remain rejected');
    });
    await scenario('#97 multi-U accessory can drag one U within its own footprint', async page => {
      const result=await page.evaluate(() => {
        appState.racks.push({id:'fixture97drag',name:'Fixture 97 drag rack',heightU:9});
        appState.rackAccessories.push({id:'fixture97drag6',name:'Fixture 97 six U accessory',
          type:'shelf',rackId:'fixture97drag',face:'front',startU:1,heightU:6});
        const target=document.createElement('div');
        target.dataset.rackAccessory='fixture97drag6';
        target.dataset.rackDropU='6';
        target.getBoundingClientRect=()=>({top:80,height:240});
        const grid=document.createElement('div');
        grid.dataset.rackUGrid='true';
        grid.getBoundingClientRect=()=>({top:0,bottom:360,height:360});
        grid.appendChild(target);
        document.body.appendChild(grid);
        const resolved=phase13DropPosition({clientY:300},target);
        const originalFace=activeRackFace;
        activeRackFace='front';
        let moved;
        try { moved=phase13CMoveAccessory('fixture97drag6', 'fixture97drag', resolved); }
        finally { activeRackFace=originalFace;grid.remove(); }
        return {resolved,moved,start:appState.rackAccessories.find(a=>a.id==='fixture97drag6')?.startU};
      });
      assert.equal(result.resolved,2,'Pointer over U2 must resolve to U2 rather than top U6');
      assert.equal(result.start,2,'6U accessory should move to U2–U7');
    });
    await scenario('#171 multi-U rack drag preview refreshes and movement works in both directions', async page => {
      const result=await page.evaluate(() => {
        appState.racks.push({id:'fixture171rack',name:'Fixture 171 rack',heightU:9});
        appState.rackAccessories.push({id:'fixture171accessory',name:'Fixture 171 six U accessory',
          type:'shelf',rackId:'fixture171rack',face:'front',startU:1,heightU:6});
        const target=document.createElement('div');
        target.dataset.rackDropId='fixture171rack';
        target.dataset.rackDropU='6';
        target.dataset.rackAccessory='fixture171accessory';
        target.getBoundingClientRect=()=>({top:100,height:240});
        const grid=document.createElement('div');
        grid.dataset.rackUGrid='true';
        grid.style.position='relative';
        grid.style.height='360px';
        grid.getBoundingClientRect=()=>({top:-40,bottom:320,height:360});
        grid.appendChild(target);
        document.body.appendChild(grid);
        const originalFace=activeRackFace;
        activeRackFace='front';
        const dispatch=(type,y)=>target.dispatchEvent(new DragEvent(type,{
          bubbles:true,cancelable:true,clientY:y,dataTransfer:new DataTransfer()
        }));
        const getStart=()=>appState.rackAccessories.find(a=>a.id==='fixture171accessory').startU;
        try {
          phase13CDraggedAccessoryId='fixture171accessory';
          dispatch('dragover',280);
          const first=grid.querySelector('.phase13-drop-preview');
          const firstNonInteractive=first?.style.pointerEvents==='none';
          dispatch('dragover',240);
          const second=grid.querySelector('.phase13-drop-preview');
          const refreshed=!!second && second!==first && grid.querySelectorAll('.phase13-drop-preview').length===1;
          dispatch('drop',280);
          const down=getStart();
          phase13CDraggedAccessoryId='fixture171accessory';
          dispatch('drop',320);
          const up=getStart();
          return {firstNonInteractive,refreshed,down,up};
        } finally {
          phase13CDraggedAccessoryId=null;
          activeRackFace=originalFace;
          phase13ClearDropPreview();
          grid.remove();
        }
      });
      assert.equal(result.firstNonInteractive,true,'Drag preview must not intercept pointer events');
      assert.equal(result.refreshed,true,'Preview must refresh within the same multi-U target');
      assert.equal(result.down,2,'6U accessory must move one U down');
      assert.equal(result.up,1,'6U accessory must move one U back up');
    });
    await scenario('#171 upwards drag preserves grabbed U offset over empty rack positions', async page => {
      const result=await page.evaluate(() => {
        appState.racks.push({id:'fixture171offsetrack',name:'Fixture 171 offset rack',heightU:12});
        appState.rackAccessories.push({id:'fixture171offsetitem',name:'Fixture 171 4U item',
          type:'shelf',rackId:'fixture171offsetrack',face:'front',startU:3,heightU:4});
        const source=document.createElement('div');
        source.dataset.rackAccessory='fixture171offsetitem';
        source.dataset.rackDropU='6';
        source.dataset.rackDropId='fixture171offsetrack';
        source.draggable=true;
        source.getBoundingClientRect=()=>({top:100,height:160});
        const grid=document.createElement('div');
        grid.dataset.rackUGrid='true';
        grid.style.position='relative';
        grid.style.height='480px';
        grid.getBoundingClientRect=()=>({top:0,bottom:480,height:480});
        grid.appendChild(source);
        document.body.appendChild(grid);
        const empty=document.createElement('div');
        empty.dataset.rackDropU='7';
        empty.dataset.rackDropId='fixture171offsetrack';
        grid.appendChild(empty);
        const originalFace=activeRackFace;
        activeRackFace='front';
        try {
          source.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,clientY:100+3*40+20,dataTransfer:new DataTransfer()}));
          const start=phase13DropPosition({clientY:240},empty);
          empty.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,clientY:240,dataTransfer:new DataTransfer()}));
          const preview=grid.querySelector('.phase13-drop-preview');
          const previewBottom=preview?.style.bottom;
          const previewHeight=preview?.style.height;
          empty.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,clientY:240,dataTransfer:new DataTransfer()}));
          return {start,previewBottom,previewHeight,placed:appState.rackAccessories.find(a=>a.id==='fixture171offsetitem').startU};
        } finally {
          source.dispatchEvent(new DragEvent('dragend',{bubbles:true,dataTransfer:new DataTransfer()}));
          activeRackFace=originalFace;
          grid.remove();
        }
      });
      assert.equal(result.start,4,'Moving one U above a 4U item must preserve grab offset');
      assert.equal(result.previewBottom,'120px','Preview must align with U4 in rack grid coordinates');
      assert.equal(result.previewHeight,'160px','4U equipment must always have a 4U preview');
      assert.equal(result.placed,4,'Upward drop must reposition by one U rather than four');
    });
    await scenario('#97 rack CSV export uses accessory-aware report rows', async page => {
      const result=await page.evaluate(async () => {
        appState.racks.push({id:'fixture97csvrack',name:'Fixture 97 CSV rack',heightU:10});
        appState.devices.push({id:'fixture97csvserver',name:'Fixture 97 CSV server',type:'Server - Physical',
          rackId:'fixture97csvrack',face:'front',rackUStart:2,rackUEnd:3});
        appState.rackAccessories.push(
          {id:'fixture97csvshelf',name:'Shelf',type:'shelf',rackId:'fixture97csvrack',face:'front',startU:5,heightU:1},
          {id:'fixture97csvvertical',name:'Vertical PDU',type:'pdu_vertical',rackId:'fixture97csvrack',face:'front',startU:1,heightU:10}
        );
        const original=URL.createObjectURL;
        let exported=null;
        URL.createObjectURL=blob=>{exported=blob;return 'blob:fixture97';};
        const click=HTMLAnchorElement.prototype.click;
        HTMLAnchorElement.prototype.click=function(){};
        try { phase10DDownloadCsv('racks'); }
        finally { URL.createObjectURL=original;HTMLAnchorElement.prototype.click=click; }
        return exported ? await exported.text() : '';
      });
      assert.match(result,/"Fixture 97 CSV rack","10","3","0","1","30"/,
        'Rack CSV should include 2U device and 1U shelf but not vertical 0U');
    });
    await scenario('#97 archived device assignments persist across reload and unrelated edit', async page => {
      await page.evaluate(() => {
        appState.installedSoftware.push({key:'software_fixture97persist',label:'Fixture 97 retained software',archived:true});
        appState.serverFunctions.push({key:'serverService_fixture97persist',label:'Fixture 97 retained service',archived:true});
        appState.devices.push({id:'fixture97persist',name:'Fixture 97 retained device',type:'Server - Physical',
          typeDetails:{software_fixture97persist:true,serverService_fixture97persist:true}});
        if (!saveState()) throw Error('Unable to persist #97 baseline');
      });
      await page.reload({waitUntil:'load'});
      const result=await page.evaluate(() => {
        const device=appState.devices.find(d=>d.id==='fixture97persist');
        if (!device) return {missing:true};
        device.notes='Unrelated #97 note edit';
        if (!saveState()) throw Error('Unable to persist unrelated edit');
        phase14CViewDevice(device.id);
        return {software:document.body.textContent.includes('Fixture 97 retained software'),
          service:document.body.textContent.includes('Fixture 97 retained service'),
          softwareAssigned:device.typeDetails?.software_fixture97persist,
          serviceAssigned:device.typeDetails?.serverService_fixture97persist};
      });
      assert.equal(result.software,true,'Archived software must remain visible after reload');
      assert.equal(result.service,true,'Archived service must remain visible after reload');
      assert.equal(result.softwareAssigned,true,'Unrelated edit must preserve software assignment');
      assert.equal(result.serviceAssigned,true,'Unrelated edit must preserve service assignment');
      await page.reload({waitUntil:'load'});
      const persisted=await page.evaluate(() => {
        const d=appState.devices.find(x=>x.id==='fixture97persist');
        return {notes:d?.notes,software:d?.typeDetails?.software_fixture97persist,
          service:d?.typeDetails?.serverService_fixture97persist};
      });
      assert.equal(persisted.notes,'Unrelated #97 note edit');
      assert.equal(persisted.software,true);
      assert.equal(persisted.service,true);
    });
    await scenario('#97 archived software and server service remain visible in device details', async page => {
      const result = await page.evaluate(() => {
        const software={key:'software_fixture97',label:'Fixture #97 legacy software',archived:true,deviceTypes:['Server - Physical']};
        const service={key:'serverService_fixture97',label:'Fixture #97 legacy service',archived:true};
        appState.installedSoftware.push(software);
        appState.serverFunctions.push(service);
        appState.devices.push({id:'fixture97device',name:'Fixture #97 device',type:'Server - Physical',
          typeDetails:{[software.key]:true,[service.key]:true}});
        phase14CViewDevice('fixture97device');
        const text=document.body.textContent||'';
        return {software:text.includes(software.label),service:text.includes(service.label),
          softwareAvailable:phase120SoftwareOptions().some(x=>x.key===software.key),
          serviceAvailable:phase120AvailableServerServices().some(x=>x.key===service.key)};
      });
      assert.equal(result.software,true,'Archived installed software must appear');
      assert.equal(result.service,true,'Archived enabled service must appear');
      assert.equal(result.softwareAvailable,false,'Archived software must not be offered for assignment');
      assert.equal(result.serviceAvailable,false,'Archived service must not be offered for assignment');
    });
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode=1; });
