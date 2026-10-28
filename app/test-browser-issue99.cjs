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
      const warned = !!document.getElementById('discard-dialog');
      const stillSubnet = !!document.querySelector('form[data-form-action="subnet"]');
      keepEditingDeviceForm();
      const keptEditing = !!document.querySelector('form[data-form-action="subnet"]');
      document.querySelector('[data-action="cancel-subnet-modal"]').click();
      discardDeviceFormChanges();
      await wait();
      const returnedToDevice = !!document.querySelector('form[data-device-form="true"]');
      const parentDraftPreserved = document.getElementById('dev-name')?.value === 'Fictional unsaved device';
      closeModal(true);
      deviceFormDraft = null;
      // Nested rack Cancel must honour the dirty-form prompt and retain the parent draft.
      deviceFormDraft = {deviceId:null,name:'Fictional rack parent',type:'Server - Physical'};
      deviceRackReturnPending = true;
      openRackModal();
      document.getElementById('rack-name').value = 'Fictional unsaved rack';
      const racksBefore = JSON.stringify(appState.racks);
      cancelRackFromDevice();
      const rackWarned = !!document.getElementById('discard-dialog');
      const rackStillOpen = !!document.querySelector('form[data-form-action="rack"]');
      keepEditingDeviceForm();
      const rackKept = !!document.querySelector('form[data-form-action="rack"]') && deviceRackReturnPending;
      cancelRackFromDevice();
      discardDeviceFormChanges();
      await wait();
      const rackReturned = !!document.querySelector('form[data-device-form="true"]');
      const rackParentPreserved = document.getElementById('dev-name')?.value === 'Fictional rack parent';
      const racksUnchanged = JSON.stringify(appState.racks) === racksBefore;
      closeModal(true);
      deviceFormDraft = null;
      // Header Close and keyboard Escape must use the same nested rack return journey.
      const nestedExitResults = {};
      for (const method of ['header','escape','clean']) {
        deviceFormDraft = {deviceId:null,name:'Fictional '+method+' parent',type:'Server - Physical'};
        deviceRackReturnPending = true;
        openRackModal();
        if (method !== 'clean') document.getElementById('rack-name').value = 'Fictional '+method+' rack';
        if (method === 'escape') {
          document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));
        } else {
          document.querySelector('#modal-content [data-action="close-modal"]').click();
        }
        const warned = !!document.getElementById('discard-dialog');
        const rackRetained = !!document.querySelector('form[data-form-action="rack"]');
        if (warned) {
          keepEditingDeviceForm();
          const kept = !!document.querySelector('form[data-form-action="rack"]') && deviceRackReturnPending;
          if (method === 'escape') document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));
          else document.querySelector('#modal-content [data-action="close-modal"]').click();
          discardDeviceFormChanges();
          nestedExitResults[method+'Kept'] = kept;
        }
        await wait();
        nestedExitResults[method+'Warning'] = method === 'clean' ? !warned : warned && rackRetained;
        nestedExitResults[method+'Returned'] = !!document.querySelector('form[data-device-form="true"]') &&
          document.getElementById('dev-name')?.value === 'Fictional '+method+' parent' &&
          !deviceRackReturnPending && JSON.stringify(appState.racks) === racksBefore;
        closeModal(true);
        deviceFormDraft = null;
      }
      const subnet = {id:'issue99-fictional-subnet',name:'Fictional',kind:'network',cidr:'10.88.92.0/29',gateway:'10.88.92.1',vlan:3892};
      appState.subnets.push(subnet);
      openBulkIpModal(subnet.id);
      const values = {'bulk-start':'2','bulk-end':'3','bulk-status':'Reserved','bulk-hostname':'fixture','bulk-notes':'issue99 notes'};
      for (const [id,value] of Object.entries(values)) document.getElementById(id).value = value;
      const allocationsBefore = JSON.stringify(appState.ipAllocations);
      handleBulkIpSubmit({preventDefault(){}},subnet.id);
      const preview = !!document.querySelector('[data-action="return-from-bulk-ip-assignment"]');
      document.querySelector('[data-action="return-from-bulk-ip-assignment"]')?.click();
      const restored = Object.entries(values).every(([id,value]) => document.getElementById(id)?.value === value);
      const pendingCleared = pendingBulkIpAssignment === null;
      const untouched = JSON.stringify(appState.ipAllocations) === allocationsBefore;
      closeModal(true);
      return {...nestedExitResults,warned,stillSubnet,keptEditing,returnedToDevice,parentDraftPreserved,rackWarned,rackStillOpen,rackKept,rackReturned,rackParentPreserved,racksUnchanged,preview,restored,pendingCleared,untouched,
        storedUnchanged:localStorage.getItem('caffoot_state')===storedBefore};
    });
    assert.equal(result.warned,true,'Edited subnet cancellation must warn');
    assert.equal(result.stillSubnet,true,'Warning must leave subnet visible');
    assert.equal(result.keptEditing,true,'Keep editing must retain subnet');
    assert.equal(result.returnedToDevice,true,'Discard must return to parent device');
    assert.equal(result.parentDraftPreserved,true,'Parent draft must survive');
    for (const [key,value] of Object.entries(result).filter(([key]) => /^(header|escape|clean)/.test(key)))
      assert.equal(value,true,'Nested rack exit failed: '+key);
    assert.equal(result.rackWarned,true,'Edited nested rack cancellation must warn');
    assert.equal(result.rackStillOpen,true,'Warning must leave rack form open');
    assert.equal(result.rackKept,true,'Keep Editing must preserve rack and return state');
    assert.equal(result.rackReturned,true,'Discard must return to parent device');
    assert.equal(result.rackParentPreserved,true,'Parent device draft must survive rack cancellation');
    assert.equal(result.racksUnchanged,true,'Rack cancellation must not change inventory');
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
        openRackAccessoryEditor('issue99-rack', 1);
        const form = document.getElementById('rack-accessory-form');
        if (!form) throw Error('Accessory editor did not open');
        form.querySelector('[name="name"]').value = 'Fictional accessory retry';
        const before = JSON.stringify(appState);
        let attempts = 0;
        saveState = () => { attempts++; return attempts > 1; };
        form.requestSubmit();
        const failedStateRestored = JSON.stringify(appState) === before;
        const error = document.getElementById('rack-accessory-form-error')?.textContent || '';
        const formRetained = document.getElementById('rack-accessory-form') === form;
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
        moveRackAccessoryToPosition('issue99-ops-accessory','issue99-ops-rack',2);
        const moveRolledBack = JSON.stringify(appState) === initial;
        const moveExplained = messages.some(m => m.kind === 'error' && m.message.includes('Original placement restored'));
        requestRackAccessoryDeletion('issue99-ops-accessory');
        const accept = document.getElementById('remove-accept');
        if (!accept) throw Error('Accessory removal confirmation missing');
        accept.click();
        const removalRolledBack = JSON.stringify(appState) === initial;
        const removalExplained = messages.some(m => m.kind === 'error' && m.message.includes('previous inventory is unchanged'));
        return {moveRolledBack,moveExplained,removalRolledBack,removalExplained};
      } finally {
        document.getElementById('remove-confirm')?.remove();
        saveState = previousSave;
        showToast = previousToast;
        appState = previousState;
        closeModal(true);
      }
    });
    for (const [key,value] of Object.entries(accessoryOperations))
      assert.equal(value,true,'Accessory operation failed: '+key);
    // M-026 gap: actual keyboard Escape, discard confirmation and focus return.
    // Synthetic unsaved form, with no inventory mutation or storage write.
    const keyboard = await page.evaluate(async () => {
      const trigger = document.createElement('button');
      trigger.textContent = 'Fictional modal trigger';
      document.body.appendChild(trigger);
      trigger.focus();
      const saved = localStorage.getItem('caffoot_state');
      try {
        openModal('<h2>Fictional form</h2><form data-form-action="software" onsubmit="return false"><input id="issue99-keyboard-name" value="Before"><button type="submit">Save</button></form>');
        const initialFocus = document.activeElement?.id === 'issue99-keyboard-name';
        const input = document.getElementById('issue99-keyboard-name');
        input.value = 'After';
        input.dispatchEvent(new Event('input', {bubbles:true}));
        document.dispatchEvent(new KeyboardEvent('keydown', {key:'Escape',bubbles:true,cancelable:true}));
        const discardShown = !!document.getElementById('discard-dialog');
        const remainsOpen = !document.getElementById('modal-container').classList.contains('hidden');
        keepEditingDeviceForm();
        const keepRetainsValue = document.getElementById('issue99-keyboard-name')?.value === 'After';
        document.dispatchEvent(new KeyboardEvent('keydown', {key:'Escape',bubbles:true,cancelable:true}));
        const warnedAgain = !!document.getElementById('discard-dialog');
        discardDeviceFormChanges();
        const closed = document.getElementById('modal-container').classList.contains('hidden');
        const focusRestored = document.activeElement === trigger;
        return {initialFocus,discardShown,remainsOpen,keepRetainsValue,warnedAgain,closed,focusRestored,
          storageUnchanged:localStorage.getItem('caffoot_state') === saved};
      } finally {
        closeModal(true);
        trigger.remove();
      }
    });
    for (const [key,value] of Object.entries(keyboard))
      assert.equal(value,true,'Modal keyboard regression failed: '+key);
    // Issue #157: focused removal guards, no persisted test data.
    const catalogue = await page.evaluate(() => {
      const oldState = appState, oldSave = saveState, oldToast = showToast;
      const messages = [];
      try {
        appState = {...oldState,
          devices:[{id:'fictional',type:'Server - Physical',manufacturer:'Example',model:'Example Model',
            typeDetails:{customSoftware_test:true,customServerFunction_test:true}}],
          hardwareCatalogue:[{id:'model_test',type:'Server - Physical',manufacturer:'Example',model:'Example Model'}],
          installedSoftware:[{key:'customSoftware_test',label:'Example Software',deviceTypes:['Server - Physical']}],
          serverFunctions:[{key:'customServerFunction_test',label:'Example Service'}]};
        saveState = () => true;
        showToast = (message,kind) => messages.push({message,kind});
        saveHardwareModel('model_test',true);
        archiveSoftwareCatalogueEntry('customSoftware_test');
        archiveServerService('customServerFunction_test');
        const blocked = appState.hardwareCatalogue.length===1 &&
          !appState.installedSoftware[0].archived && !appState.serverFunctions[0].archived &&
          messages.filter(m=>m.kind==='error').length===3;
        appState.devices=[];
        saveHardwareModel('model_test',true);
        archiveSoftwareCatalogueEntry('customSoftware_test');
        archiveServerService('customServerFunction_test');
        const unusedRemoved = appState.hardwareCatalogue.length===0 &&
          appState.installedSoftware[0].archived===true &&
          appState.serverFunctions[0].archived===true;
        return {blocked,unusedRemoved};
      } finally {
        saveState=oldSave;showToast=oldToast;appState=oldState;closeModal(true);
      }
    });
    for (const [key,value] of Object.entries(catalogue))
      assert.equal(value,true,'Issue #157 catalogue removal regression failed: '+key);

    // Issue #157: real catalogue editors, isolated in-memory fixtures and no storage writes.
    const editorChecks = await page.evaluate(() => {
      const originalState=appState, originalSave=saveState, originalToast=showToast;
      const stored=localStorage.getItem('caffoot_state'), messages=[];
      const results={};
      const modelMaker=Object.keys(builtInHardwareSuggestions['Server - Physical']||{})[0];
      if(!modelMaker)throw Error('Issue #157 test requires a built-in physical server manufacturer');
      const fixture=()=>({
        ...originalState,devices:[],
        hardwareCatalogue:[
          {id:'issue157-model-a',type:'Server - Physical',manufacturer:modelMaker,model:'Fictional Model A'},
          {id:'issue157-model-b',type:'Server - Physical',manufacturer:modelMaker,model:'Fictional Model B'}],
        installedSoftware:[
          {key:'issue157-software-a',label:'Fictional Software A',deviceTypes:['Server - Physical']},
          {key:'issue157-software-b',label:'Fictional Software B',deviceTypes:['Server - Physical']}],
        serverFunctions:[
          {key:'issue157-service-a',label:'Fictional Service A'},
          {key:'issue157-service-b',label:'Fictional Service B'}]
      });
      const cases=[
        {name:'model',open:()=>openHardwareModelManager('issue157-model-a'),save:()=>saveHardwareModel('issue157-model-a'),
         field:'model-name',original:'Fictional Model A',duplicate:'Fictional Model B',renamed:'Fictional Model Renamed',
         current:()=>appState.hardwareCatalogue.find(x=>x.id==='issue157-model-a')?.model,
         error:()=>document.getElementById('model-error')?.textContent||''},
        {name:'software',open:()=>openSoftwareCatalogueEditor('issue157-software-a'),save:()=>saveCustomSoftwareEntry('issue157-software-a'),
         field:'software-custom-name',original:'Fictional Software A',duplicate:'Fictional Software B',renamed:'Fictional Software Renamed',
         current:()=>appState.installedSoftware.find(x=>x.key==='issue157-software-a')?.label,
         error:()=>document.getElementById('software-custom-error')?.textContent||''},
        {name:'service',open:()=>openServerServiceEditor('issue157-service-a'),save:()=>saveServerServiceEntry('issue157-service-a'),
         field:'server-service-name-input',original:'Fictional Service A',duplicate:'Fictional Service B',renamed:'Fictional Service Renamed',
         current:()=>appState.serverFunctions.find(x=>x.key==='issue157-service-a')?.label,
         error:()=>messages.filter(x=>x.kind==='error').map(x=>x.message).join(' ')}
      ];
      try {
        showToast=(message,kind)=>messages.push({message,kind});
        for(const c of cases){
          appState=fixture();
          saveState=()=>false;
          c.open();
          const input=document.getElementById(c.field);
          results[c.name+'Prefilled']=input?.value===c.original;
          input.value=c.duplicate;
          c.save();
          results[c.name+'Duplicate']=c.current()===c.original && /already exists/i.test(c.error());
          input.value=c.renamed;
          c.save();
          results[c.name+'Rollback']=c.current()===c.original &&
            !!document.getElementById(c.field) && document.getElementById(c.field).value===c.renamed;
          closeModal(true);
          c.open();
          document.getElementById(c.field).value=c.renamed;
          document.querySelector('#modal-content [data-action="close-modal"]').click();
          results[c.name+'CancelWarning']=!!document.getElementById('discard-dialog');
          keepEditingDeviceForm();
          results[c.name+'KeepEditing']=document.getElementById(c.field)?.value===c.renamed;
          document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));
          results[c.name+'EscapeWarning']=!!document.getElementById('discard-dialog');
          discardDeviceFormChanges();
          results[c.name+'DiscardUnchanged']=c.current()===c.original;
          saveState=()=>true;
          c.open();
          document.getElementById(c.field).value=c.renamed;
          c.save();
          results[c.name+'Rename']=c.current()===c.renamed;
          closeModal(true);
        }
        results.storageUnchanged=localStorage.getItem('caffoot_state')===stored;
        return results;
      } finally {
        appState=originalState;saveState=originalSave;showToast=originalToast;closeModal(true);
      }
    });
    for (const [key,value] of Object.entries(editorChecks))
      assert.equal(value,true,'Issue #157 catalogue editor regression failed: '+key);
    // Issue #157: archive visibility, JSON backup shape and reload round-trip in isolated state.
    const archiveChecks = await page.evaluate(() => {
      const previousState=appState, previousSave=saveState, previousToast=showToast;
      const stored=localStorage.getItem('caffoot_state'), messages=[];
      try {
        const keySoftware='issue157-archived-software', keyService='issue157-archived-service';
        appState={...previousState,devices:[],
          installedSoftware:[{key:keySoftware,label:'Fictional Archived Software',deviceTypes:['Server - Physical']}],
          serverFunctions:[{key:keyService,label:'Fictional Archived Service'}]};
        saveState=()=>true;
        showToast=(message,kind)=>messages.push({message,kind});
        archiveSoftwareCatalogueEntry(keySoftware);
        archiveServerService(keyService);
        const archived=appState.installedSoftware[0]?.archived===true &&
          appState.serverFunctions[0]?.archived===true;
        const absentFromChoices=!getAvailableServerServiceCatalogueEntries().some(x=>x.key===keyService) &&
          !getAvailableSoftwareCatalogueEntries().some(x=>x.key===keySoftware);
        const snapshot=JSON.stringify({installedSoftware:appState.installedSoftware,
          serverFunctions:appState.serverFunctions});
        const restored=JSON.parse(snapshot);
        appState={...appState,...restored};
        const roundTrip=appState.installedSoftware[0]?.key===keySoftware &&
          appState.installedSoftware[0]?.archived===true &&
          appState.serverFunctions[0]?.key===keyService &&
          appState.serverFunctions[0]?.archived===true;
        return {archived,absentFromChoices,roundTrip,
          storageUnchanged:localStorage.getItem('caffoot_state')===stored};
      } finally {
        appState=previousState;saveState=previousSave;showToast=previousToast;closeModal(true);
      }
    });
    for (const [key,value] of Object.entries(archiveChecks))
      assert.equal(value,true,'Issue #157 archive serialization regression failed: '+key);
    // Issue #157: genuine application backup/import and reload, in this disposable browser context only.
    const backupPage = await context.newPage();
    try {
      await backupPage.goto(pathToFileURL(path.join(__dirname,'dist','Caffoot-Lite.html')).href);
      const backupJson = await backupPage.evaluate(() => {
        appState = cloneDefaultData();
        appState.installedSoftware = [{key:'issue157_backup_software',label:'Fictional Backup Software',deviceTypes:['Server - Physical'],archived:true}];
        appState.serverFunctions = [{key:'issue157_backup_service',label:'Fictional Backup Service',archived:true}];
        return JSON.stringify(createInventoryBackup());
      });
      const checked = await backupPage.evaluate(json => {
        const restored = validateAndNormaliseBackupForImport(parseBackupJsonWithHelpfulError(json));
        return restored.installedSoftware.some(x => x.key==='issue157_backup_software' && x.archived===true) &&
          restored.serverFunctions.some(x => x.key==='issue157_backup_service' && x.archived===true);
      }, backupJson);
      assert.equal(checked,true,'Application backup validation must retain archived catalogue entries');
      backupPage.on('dialog', dialog => dialog.accept());
      await backupPage.locator('#import-file').setInputFiles({
        name:'issue157-disposable-backup.json',mimeType:'application/json',buffer:Buffer.from(backupJson)
      });
      await backupPage.waitForFunction(() => {
        try {
          const stored=JSON.parse(localStorage.getItem('caffoot_state')||'null');
          return stored?.installedSoftware?.some(x=>x.key==='issue157_backup_software'&&x.archived===true) &&
            stored?.serverFunctions?.some(x=>x.key==='issue157_backup_service'&&x.archived===true);
        } catch { return false; }
      });
      await backupPage.reload();
      const afterReload = await backupPage.evaluate(() => ({
        software:appState.installedSoftware.some(x=>x.key==='issue157_backup_software'&&x.archived===true),
        service:appState.serverFunctions.some(x=>x.key==='issue157_backup_service'&&x.archived===true),
        excludedSoftware:!getAvailableSoftwareCatalogueEntries().some(x=>x.key==='issue157_backup_software'),
        excludedService:!getAvailableServerServiceCatalogueEntries().some(x=>x.key==='issue157_backup_service'),
        recovery:storageRecoveryFailure===null
      }));
      for(const [key,value] of Object.entries(afterReload))
        assert.equal(value,true,'Issue #157 actual import/reload failed: '+key);
    } finally {
      await backupPage.close();
    }
    console.log('PASS #99 focused form, bulk preview and accessory failure/retry and move/remove rollback');

  } finally {
    await context.close();
    await browser.close();
  }
})().catch(error => {console.error(error);process.exitCode=1;});
