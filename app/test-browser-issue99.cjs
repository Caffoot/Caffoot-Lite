'use strict';
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

// Issue #99: focused browser checks, disposable offline inventory only.
(async () => {
  const browser = await chromium.launch({headless:true});
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.route(/^https?:/i, route => route.abort('blockedbyclient'));
  try {
    await page.goto(pathToFileURL(path.join(__dirname,'dist','Caffoot-Lite.html')).href);
    const result = await page.evaluate(async () => {
      const wait = () => new Promise(resolve => setTimeout(resolve, 25));
      const storedBefore = localStorage.getItem('caffoot_state');
      // Parent device draft must survive both keep-editing and discard flows.
      deviceFormDraft = {deviceId:null,name:'Fictional unsaved device',type:'Server - Physical'};
      openSubnetModal();
      const subnetForm = document.querySelector('form[data-form-action="subnet"]');
      const field = document.getElementById('sub-name');
      if (!field) throw Error('Subnet name input missing');
      field.value = 'Fictional unsaved subnet';
      document.querySelector('[data-action="cancel-subnet-modal"]').click();
      const warned = !!document.getElementById('phase120-discard-dialog');
      const stillSubnet = !!document.querySelector('form[data-form-action="subnet"]');
      phase120KeepEditing();
      const keptEditing = !!document.querySelector('form[data-form-action="subnet"]');
      document.querySelector('[data-action="cancel-subnet-modal"]').click();
      phase120DiscardChanges();
      await wait();
      const returnedToDevice = !!document.querySelector('form[data-device-form="true"]');
      const parentDraftPreserved = document.getElementById('dev-name')?.value === 'Fictional unsaved device';
      closeModal(true);
      deviceFormDraft = null;
      const subnet = {id:'issue99-fictional-subnet',name:'Fictional',kind:'network',cidr:'10.88.92.0/29',gateway:'10.88.92.1',vlan:3892};
      appState.subnets.push(subnet);
      openBulkIpModal(subnet.id);
      const values = {'bulk-start':'2','bulk-end':'3','bulk-status':'Reserved','bulk-hostname':'fixture','bulk-notes':'issue99 notes'};
      for (const [id,value] of Object.entries(values)) document.getElementById(id).value = value;
      const allocationsBefore = JSON.stringify(appState.ipAllocations);
      handleBulkIpSubmit({preventDefault(){}},subnet.id);
      const preview = !!document.querySelector('[data-action="phase12b-back"]');
      document.querySelector('[data-action="phase12b-back"]')?.click();
      const restored = Object.entries(values).every(([id,value]) => document.getElementById(id)?.value === value);
      const pendingCleared = phase12BPending === null;
      const untouched = JSON.stringify(appState.ipAllocations) === allocationsBefore;
      closeModal(true);
      return {warned,stillSubnet,keptEditing,returnedToDevice,parentDraftPreserved,preview,restored,pendingCleared,untouched,
        storedUnchanged:localStorage.getItem('caffoot_state')===storedBefore};
    });
    assert.equal(result.warned,true,'Edited subnet cancellation must warn');
    assert.equal(result.stillSubnet,true,'Warning must leave subnet visible');
    assert.equal(result.keptEditing,true,'Keep editing must retain subnet');
    assert.equal(result.returnedToDevice,true,'Discard must return to parent device');
    assert.equal(result.parentDraftPreserved,true,'Parent draft must survive');
    assert.equal(result.preview,true,'Bulk preview must offer Back to editing');
    assert.equal(result.restored,true,'Bulk values must be restored');
    assert.equal(result.pendingCleared,true,'Back must clear pending application');
    assert.equal(result.untouched,true,'Preview and Back must not change IP allocations');
    assert.equal(result.storedUnchanged,true,'Neither journey may write inventory');
    // Isolated accessory failure injection: no browser storage writes or real inventory.
    const accessory = await page.evaluate(() => {
      const originalState = appState;
      const originalSave = saveState;
      const storedBefore = localStorage.getItem('caffoot_state');
      try {
        appState = {...originalState, racks:[...originalState.racks, {id:'issue99-rack',name:'Fictional test rack',heightU:42}], rackAccessories:[...(originalState.rackAccessories||[])]};
        phase13COpenAccessory('issue99-rack', 1);
        const form = document.getElementById('phase13c-form');
        if (!form) throw Error('Accessory editor did not open');
        form.querySelector('[name="name"]').value = 'Fictional accessory retry';
        const before = JSON.stringify(appState);
        let attempts = 0;
        saveState = () => { attempts++; return attempts > 1; };
        form.requestSubmit();
        const failedStateRestored = JSON.stringify(appState) === before;
        const error = document.getElementById('phase13c-error')?.textContent || '';
        const formRetained = document.getElementById('phase13c-form') === form;
        const valuesRetained = form.querySelector('[name="name"]').value === 'Fictional accessory retry';
        const noStorageWrite = localStorage.getItem('caffoot_state') === storedBefore;
        form.requestSubmit();
        const retrySucceeded = attempts === 2 && (appState.rackAccessories||[]).filter(a=>a.name==='Fictional accessory retry').length === 1;
        return {failedStateRestored, errorShown:error.includes('could not be saved') && error.includes('try again'),formRetained,valuesRetained,noStorageWrite,retrySucceeded};
      } finally {
        saveState = originalSave;
        appState = originalState;
        closeModal(true);
      }
    });
    assert.equal(accessory.failedStateRestored,true,'Failed accessory save must roll back inventory');
    assert.equal(accessory.errorShown,true,'Failed accessory save must explain retry');
    assert.equal(accessory.formRetained,true,'Failed accessory save must keep the editor open');
    assert.equal(accessory.valuesRetained,true,'Failed accessory save must preserve entered values');
    assert.equal(accessory.noStorageWrite,true,'Failure injection must not write browser inventory');
    assert.equal(accessory.retrySucceeded,true,'Retry must create exactly one accessory');
    // Removal and movement failures must report errors without changing inventory.
    const accessoryOperations = await page.evaluate(() => {
      const previousState = appState;
      const previousSave = saveState;
      const previousToast = showToast;
      const messages = [];
      try {
        appState = {...previousState,
          racks:[...previousState.racks,{id:'issue99-ops-rack',name:'Fictional operations rack',heightU:42}],
          rackAccessories:[...(previousState.rackAccessories||[]),{id:'issue99-ops-accessory',rackId:'issue99-ops-rack',type:'shelf',name:'Fictional accessory',face:'front',startU:1,heightU:1}]};
        const initial = JSON.stringify(appState);
        saveState = () => false;
        showToast = (message,kind) => messages.push({message,kind});
        phase13CMoveAccessory('issue99-ops-accessory','issue99-ops-rack',2);
        const moveRolledBack = JSON.stringify(appState) === initial;
        const moveExplained = messages.some(m => m.kind === 'error' && m.message.includes('Original placement restored'));
        phase13CDeleteAccessory('issue99-ops-accessory');
        const accept = document.getElementById('phase13c-remove-accept');
        if (!accept) throw Error('Accessory removal confirmation missing');
        accept.click();
        const removalRolledBack = JSON.stringify(appState) === initial;
        const removalExplained = messages.some(m => m.kind === 'error' && m.message.includes('previous inventory is unchanged'));
        return {moveRolledBack,moveExplained,removalRolledBack,removalExplained};
      } finally {
        document.getElementById('phase13c-remove-confirm')?.remove();
        saveState = previousSave;
        showToast = previousToast;
        appState = previousState;
        closeModal(true);
      }
    });
    for (const [key,value] of Object.entries(accessoryOperations))
      assert.equal(value,true,'Accessory operation failed: '+key);
    console.log('PASS #99 focused form, bulk preview and accessory failure/retry and move/remove rollback');

  } finally {
    await context.close();
    await browser.close();
  }
})().catch(error => {console.error(error);process.exitCode=1;});
