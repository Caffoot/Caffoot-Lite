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
    await scenario('M-005 hypervisor confirmation Escape preserves editing and focus', async page => {
      const result = await page.evaluate(async () => {
        const container=document.getElementById('modal-container');
        const content=document.getElementById('modal-content');
        container.classList.remove('hidden');
        content.innerHTML='<button id="fictional-hypervisor-origin" type="button">Original control</button>';
        const origin=document.getElementById('fictional-hypervisor-origin');
        origin.focus();
        const pending=phaseM005ConfirmHypervisorRemoval('Fictional host', [{id:'guest-one',name:'Fictional guest'}]);
        const dialog=document.getElementById('phase-m005-hypervisor-dialog');
        const text=dialog?.textContent||'';
        document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));
        const accepted=await pending;
        return {accepted,removed:!document.getElementById('phase-m005-hypervisor-dialog'),
          focusRestored:document.activeElement===origin,originStillPresent:!!document.getElementById('fictional-hypervisor-origin'),text};
      });
      assert.equal(result.accepted,false);
      assert.equal(result.removed,true);
      assert.equal(result.focusRestored,true);
      assert.equal(result.originStillPresent,true);
      assert.match(result.text,/Fictional guest/);
      assert.match(result.text,/No guest data or host relationships will be changed/);
    });
    await scenario('M-005 hypervisor Keep Editing and confirmation return distinct outcomes', async page => {
      const result = await page.evaluate(async () => {
        const container=document.getElementById('modal-container');
        const content=document.getElementById('modal-content');
        container.classList.remove('hidden');
        content.innerHTML='<button id="fictional-hypervisor-origin-2" type="button">Original control</button>';
        const origin=document.getElementById('fictional-hypervisor-origin-2');
        origin.focus();
        const cancelPending=phaseM005ConfirmHypervisorRemoval('Fictional host', [{id:'guest-two',name:'Guest two'}]);
        document.querySelector('[data-action="phase-m005-hypervisor-cancel"]').click();
        const cancelled=await cancelPending;
        const cancelFocus=document.activeElement===origin;
        const acceptPending=phaseM005ConfirmHypervisorRemoval('Fictional host', [{id:'guest-two',name:'Guest two'}]);
        document.querySelector('[data-action="phase-m005-hypervisor-accept"]').click();
        const accepted=await acceptPending;
        return {cancelled,accepted,cancelFocus,acceptFocus:document.activeElement===origin,
          removed:!document.getElementById('phase-m005-hypervisor-dialog')};
      });
      assert.equal(result.cancelled,false);
      assert.equal(result.accepted,true);
      assert.equal(result.cancelFocus,true);
      assert.equal(result.acceptFocus,true);
      assert.equal(result.removed,true);
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
    await scenario('M-005 prevent deletion of host with dependants', async page => {
      const result = await page.evaluate(() => {
        appState.devices.push(
          {id:'fictional-host-001',name:'Fictional host',type:'Server - Physical',mountType:'Desktop',location:'Unknown'},
          {id:'fictional-vm-001',name:'Fictional VM 1',type:'Server - Virtual',mountType:'Desktop',location:'Unknown',virtualHostId:'fictional-host-001'},
          {id:'fictional-vm-002',name:'Fictional VM 2',type:'Server - Virtual',mountType:'Desktop',location:'Unknown',virtualHostId:'fictional-host-001'}
        );
        localStorage.setItem('caffoot_state',JSON.stringify(appState));
        const originalConfirm=window.confirm;
        const originalToast=showToast;
        const prompts=[];
        const notices=[];
        window.confirm=message=>{prompts.push(message);return true};
        showToast=(message,level)=>{notices.push({message,level})};
        try { deleteDevice('fictional-host-001'); }
        finally { window.confirm=originalConfirm; showToast=originalToast; }
        return {prompts,notices,hostExists:!!appState.devices.find(d=>d.id==='fictional-host-001'),
          dependants:appState.devices.filter(d=>d.virtualHostId==='fictional-host-001').map(d=>d.id)};
      });
      assert.equal(result.hostExists,true,'Host with dependent virtual devices must not be deleted');
      assert.deepEqual(result.dependants,['fictional-vm-001','fictional-vm-002'],
        'All dependent references must remain unchanged');
      assert.equal(result.prompts.length,0,'Unsafe deletion must stop before confirmation');
      assert(result.notices.some(n=>n.level==='error'&&n.message.includes('Fictional VM 1')&&n.message.includes('Fictional VM 2')),'Guard must identify both dependants');
      console.log('PASS M-005: deletion blocked and both dependent links preserved');
    });
    await scenario('M-005 allow deletion of unreferenced host', async page => {
      const result = await page.evaluate(() => {
        appState.devices.push({id:'fictional-unused-host',name:'Fictional unused host',type:'Server - Physical',mountType:'Desktop',location:'Unknown'});
        const originalConfirm=window.confirm;
        window.confirm=()=>true;
        try { deleteDevice('fictional-unused-host'); }
        finally { window.confirm=originalConfirm; }
        return {hostExists:!!appState.devices.find(d=>d.id==='fictional-unused-host')};
      });
      assert.equal(result.hostExists,false,'Unreferenced host deletion must remain available');
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

    await scenario('M-005 conversion incoming dependency guard source check', async page => {
      const result = await page.evaluate(() => {
        appState.devices.push(
          {id:'fictional-conversion-host',name:'Fictional conversion host',type:'Server - Physical',mountType:'Desktop',location:'Unknown'},
          {id:'fictional-conversion-vm',name:'Fictional conversion VM',type:'Server - Virtual',mountType:'Desktop',location:'Unknown',virtualHostId:'fictional-conversion-host'}
        );
        const host=appState.devices.find(d=>d.id==='fictional-conversion-host');
        // Baseline: existing device edit ultimately applies the selected type
        // without checking incoming virtualHostId links. Avoid DOM simulation
        // here; the complete form submission needs its own D13 browser case.
        const incoming=appState.devices.filter(d=>d.virtualHostId===host.id).length;
        const sourceHasIncomingGuard=handleDeviceSubmit.toString().includes('virtualHostId===deviceId') ||
          handleDeviceSubmit.toString().includes('virtualHostId === deviceId');
        return {incoming,sourceHasIncomingGuard};
      });
      assert.equal(result.incoming,1);
      assert.equal(result.sourceHasIncomingGuard,true,'Conversion handler must check incoming host links');
      console.log('PASS M-005: conversion source guard present; full D13 form submission remains pending');
    });
    await scenario('M-005 D13 actual conversion form handler protects hosted VMs', async page => {
      const result = await page.evaluate(async () => {
        const hostId='fictional-d13-host';
        appState.subnets.push({id:'fictional-d13-subnet',name:'D13 subnet',kind:'network',cidr:'10.88.76.0/29',gateway:'10.88.76.1',vlan:3876});
        appState.devices.push(
          {id:hostId,name:'Fictional D13 host',type:'Server - Physical',mountType:'Desktop',location:'Unknown',status:'Active',primaryIp:'10.88.76.2'},
          {id:'fictional-d13-vm',name:'Fictional D13 VM',type:'Server - Virtual',mountType:'Desktop',location:'Unknown',virtualHostId:hostId}
        );
        openDeviceModal(hostId);
        const set=(id,value)=>{const el=document.getElementById(id);if(!el)throw Error('Missing form control '+id);el.value=value;el.dispatchEvent(new Event('change',{bubbles:true}));};
        set('dev-type','Server - Virtual');
        set('dev-name','Fictional D13 host');
        set('dev-location','Unknown');
        set('dev-mount-type','Desktop');
        set('dev-subnet','fictional-d13-subnet');
        set('dev-ip','10.88.76.2');
        const notices=[];
        const originalToast=showToast;
        showToast=(message,level)=>notices.push({message,level});
        try {await handleDeviceSubmit({preventDefault(){}},hostId)}
        finally {showToast=originalToast}
        return {hostType:appState.devices.find(d=>d.id===hostId)?.type,
          vmHost:appState.devices.find(d=>d.id==='fictional-d13-vm')?.virtualHostId,
          notices,conversionDialog:!!document.getElementById('phase130-conversion-dialog')};
      });
      assert.equal(result.hostType,'Server - Physical','Blocked conversion must preserve physical host type');
      assert.equal(result.vmHost,'fictional-d13-host','Blocked conversion must preserve dependant link');
      assert(result.notices.some(n=>n.level==='error'&&n.message.includes('Fictional D13 VM')),'Conversion must identify dependant');
      assert.equal(result.conversionDialog,false,'Dependency guard must run before obsolete field confirmation');
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
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode=1; });
