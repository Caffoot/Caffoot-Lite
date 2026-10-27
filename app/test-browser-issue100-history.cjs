'use strict';
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

// #100 / WF-09: isolated history-only evidence. Run against the existing built HTML.
// This test never alters a real user's browser profile or inventory.
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
      console.log('PASS #100 ' + name);
    } finally { await context.close(); }
  }
  try {
    await scenario('successful history save persists across reload', async page => {
      const result = await page.evaluate(() => {
        appState.deviceLocations.push('WF09 fictional location');
        const saved = saveState();
        return { saved, events: JSON.parse(localStorage.getItem('caffoot_audit_v1') || '[]') };
      });
      assert.equal(result.saved, true);
      assert.ok(result.events.some(e => e.changes?.some(c => c.kind === 'Locations')));
      await page.reload({ waitUntil: 'load' });
      const reloaded = await page.evaluate(() => ({
        count: auditHistory.length,
        rendered: renderAuditHTML().includes('Locations'),
        stored: JSON.parse(localStorage.getItem('caffoot_audit_v1') || '[]').length
      }));
      assert.equal(reloaded.count, result.events.length);
      assert.equal(reloaded.stored, result.events.length);
      assert.equal(reloaded.rendered, true);
    });

    await scenario('denied history write does not block verified inventory save', async page => {
      const result = await page.evaluate(() => {
        const originalSet = Storage.prototype.setItem;
        Storage.prototype.setItem = function(key, value) {
          if (key === 'caffoot_audit_v1') throw new Error('WF09 injected audit quota failure');
          return originalSet.call(this, key, value);
        };
        try {
          appState.deviceLocations.push('WF09 denied-history location');
          const saved = saveState();
          return {
            saved,
            persisted: JSON.parse(localStorage.getItem('caffoot_state')).deviceLocations.includes('WF09 denied-history location'),
            inMemoryHistory: auditHistory.length,
            durableHistory: JSON.parse(localStorage.getItem('caffoot_audit_v1') || '[]').length
          };
        } finally { Storage.prototype.setItem = originalSet; }
      });
      assert.equal(result.saved, true);
      assert.equal(result.persisted, true);
      assert.ok(result.inMemoryHistory > result.durableHistory);
      await page.reload({ waitUntil: 'load' });
      const after = await page.evaluate(() => ({
        inventory: appState.deviceLocations.includes('WF09 denied-history location'),
        history: auditHistory.length
      }));
      assert.equal(after.inventory, true);
      assert.equal(after.history, result.durableHistory);
    });

    await scenario('malformed array-shaped history is isolated from inventory', async page => {
      await page.evaluate(() => localStorage.setItem('caffoot_audit_v1', JSON.stringify([{}])));
      await page.reload({ waitUntil: 'load' });
      const result = await page.evaluate(() => {
        const inventoryAvailable = Array.isArray(appState.devices);
        let historyRendered = false, error = '';
        try { historyRendered = typeof renderAuditHTML() === 'string'; }
        catch (e) { error = String(e.message || e); }
        return { inventoryAvailable, historyRendered, error };
      });
      assert.equal(result.inventoryAvailable, true);
      assert.equal(result.historyRendered, true, 'Malformed history entries should not break the history screen: ' + result.error);
    });
    await scenario('late clean reset verification must not claim a completed reset', async page => {
      const result = await page.evaluate(() => {
        const oldConfirm = window.confirm;
        const oldGet = Storage.prototype.getItem;
        const oldSet = Storage.prototype.setItem;
        appState.deviceLocations.push('WF09 reset fixture location');
        if (!saveState()) throw new Error('Unable to seed reset fixture inventory');
        const beforeInventory = localStorage.getItem('caffoot_state');
        const beforeEvents = JSON.parse(localStorage.getItem('caffoot_audit_v1') || '[]');
        let stateWrites = 0, readsAfterWrite = 0;
        window.confirm = () => true;
        Storage.prototype.setItem = function(key, value) {
          if (key === 'caffoot_state') { stateWrites++; readsAfterWrite = 0; }
          return oldSet.call(this, key, value);
        };
        Storage.prototype.getItem = function(key) {
          if (key === 'caffoot_state' && stateWrites === 1 && ++readsAfterWrite === 2)
            return null; // After saveState's verified readback, fail the caller's extra check.
          return oldGet.call(this, key);
        };
        try { phase16AClearSystem(); }
        finally {
          window.confirm = oldConfirm;
          Storage.prototype.getItem = oldGet;
          Storage.prototype.setItem = oldSet;
        }
        const afterEvents = JSON.parse(localStorage.getItem('caffoot_audit_v1') || '[]');
        return {
          stateWrites,
          readsAfterWrite,
          inventoryRestored: localStorage.getItem('caffoot_state') === beforeInventory,
          falseResetEvent: afterEvents.slice(beforeEvents.length).some(e => e.reason === 'Clean inventory reset')
        };
      });
      assert.ok(result.stateWrites >= 2, 'Expected initial save and subsequent rollback; observed ' + JSON.stringify(result));
      assert.equal(result.inventoryRestored, true, 'Inventory rollback must remain intact');
      assert.equal(result.falseResetEvent, false, 'Rolled-back reset must not remain recorded as successful');
    });

    await scenario('late backup restore verification must not claim a completed restore', async page => {
      const result = await page.evaluate(async () => {
        appState.deviceLocations.push('WF09 current inventory');
        if (!saveState()) throw new Error('Unable to seed restore fixture');
        const beforeInventory = localStorage.getItem('caffoot_state');
        const beforeEvents = JSON.parse(localStorage.getItem('caffoot_audit_v1') || '[]');
        const backup = JSON.parse(beforeInventory);
        backup.deviceLocations.push('WF09 restored inventory');
        const file = new File([JSON.stringify(backup)], 'wf09-restore.json', { type: 'application/json' });
        const input = document.createElement('input');
        input.type = 'file';
        const transfer = new DataTransfer();
        transfer.items.add(file);
        input.files = transfer.files;
        const oldConfirm = window.confirm;
        const oldGet = Storage.prototype.getItem;
        const oldSet = Storage.prototype.setItem;
        let stateWrites = 0, readsAfterWrite = 0;
        window.confirm = () => true;
        Storage.prototype.setItem = function(key, value) {
          if (key === 'caffoot_state') { stateWrites++; readsAfterWrite = 0; }
          return oldSet.call(this, key, value);
        };
        Storage.prototype.getItem = function(key) {
          if (key === 'caffoot_state' && stateWrites === 1 && ++readsAfterWrite === 2)
            return null;
          return oldGet.call(this, key);
        };
        try {
          importData({ target: input });
          await new Promise(resolve => setTimeout(resolve, 300));
        } finally {
          window.confirm = oldConfirm;
          Storage.prototype.getItem = oldGet;
          Storage.prototype.setItem = oldSet;
        }
        const afterEvents = JSON.parse(localStorage.getItem('caffoot_audit_v1') || '[]');
        return {
          stateWrites,
          inventoryRestored: localStorage.getItem('caffoot_state') === beforeInventory,
          falseRestoreEvent: afterEvents.slice(beforeEvents.length).some(e => e.reason === 'Backup restored')
        };
      });
      assert.ok(result.stateWrites >= 2, 'Expected restore save and rollback; observed ' + JSON.stringify(result));
      assert.equal(result.inventoryRestored, true, 'Restore failure must retain original inventory');
      assert.equal(result.falseRestoreEvent, false, 'Rolled-back restore must not remain recorded as successful');
    });

  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
