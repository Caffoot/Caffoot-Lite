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
      const memoryBefore = JSON.stringify(appState);
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
      const parentDraftPreserved = document.getElementById('device-name')?.value === 'Fictional unsaved device' ||
        document.querySelector('form[data-device-form="true"]')?.textContent?.includes('Fictional unsaved device');
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
      appState = JSON.parse(memoryBefore);
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
    console.log('PASS #99 focused form cancellation and bulk preview return');
  } finally {
    await context.close();
    await browser.close();
  }
})().catch(error => {console.error(error);process.exitCode=1;});
