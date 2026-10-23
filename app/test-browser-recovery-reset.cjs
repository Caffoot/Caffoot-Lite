'use strict';
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ acceptDownloads: true });
    const page = await context.newPage();
    await page.route(/^https?:/i, route => route.abort('blockedbyclient'));
    const url = pathToFileURL(path.join(__dirname, 'dist', 'Caffoot-Lite.html')).href;
    await page.goto(url, { waitUntil: 'load' });
    const raw = '{invalid fictional inventory M-014';
    async function prepare() {
      await page.evaluate(value => localStorage.setItem('caffoot_state', value), raw);
      await page.reload({ waitUntil: 'load' });
      await page.locator('#phase17a-recovery').waitFor({ state: 'visible' });
      assert.equal(await page.evaluate(() => localStorage.getItem('caffoot_state')), raw);
    }
    async function clickReset(decisions, expectAlert = false) {
      const seen = [];
      const handler = async dialog => {
        seen.push(dialog.type());
        if (dialog.type() === 'confirm') {
          const accept = decisions.shift();
          assert.notEqual(accept, undefined, 'Unexpected confirmation');
          if (accept) await dialog.accept(); else await dialog.dismiss();
        } else if (dialog.type() === 'alert' && expectAlert) {
          assert.match(dialog.message(), /Reset failed/i);
          await dialog.accept();
        } else {
          await dialog.dismiss();
          throw new Error('Unexpected dialog: ' + dialog.message());
        }
      };
      page.on('dialog', handler);
      try {
        await page.locator('#phase17a-recovery').getByRole('button', { name: 'Reset to empty inventory' }).click();
      } finally {
        page.off('dialog', handler);
      }
      return seen;
    }
    await prepare();
    assert.deepEqual(await clickReset([false]), ['confirm']);
    assert.equal(await page.evaluate(() => localStorage.getItem('caffoot_state')), raw);
    console.log('PASS M-014 R1: first cancellation preserves original inventory.');

    assert.deepEqual(await clickReset([true, false]), ['confirm', 'confirm']);
    assert.equal(await page.evaluate(() => localStorage.getItem('caffoot_state')), raw);
    console.log('PASS M-014 R2: second cancellation preserves original inventory.');

    await page.evaluate(() => {
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (key === 'caffoot_state') throw new Error('fictional storage write failure');
        return original.call(this, key, value);
      };
    });
    assert.deepEqual(await clickReset([true, true], true), ['confirm', 'confirm', 'alert']);
    assert.equal(await page.evaluate(() => localStorage.getItem('caffoot_state')), raw);
    await page.locator('#phase17a-recovery').waitFor({ state: 'visible' });
    console.log('PASS M-014 R3: throwing write preserves original inventory and reports failure.');

    await page.reload({ waitUntil: 'load' });
    await page.evaluate(() => {
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (key === 'caffoot_state') return;
        return original.call(this, key, value);
      };
    });
    const silentReload = page.waitForEvent('load');
    assert.deepEqual(await clickReset([true, true]), ['confirm', 'confirm']);
    await silentReload;
    await page.locator('#phase17a-recovery').waitFor({ state: 'visible' });
    assert.equal(await page.evaluate(() => localStorage.getItem('caffoot_state')), raw);
    console.log('OBSERVED M-014 R4: silently ignored write reloads into recovery; original bytes remain.');

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#phase17a-recovery').getByRole('button', { name: 'Download original stored data' }).click();
    const download = await downloadPromise;
    const fs = require('node:fs');
    assert.equal(fs.readFileSync(await download.path(), 'utf8'), raw);
    console.log('PASS M-014 R6: recovery download preserves exact original bytes.');

    const successfulReload = page.waitForEvent('load');
    assert.deepEqual(await clickReset([true, true]), ['confirm', 'confirm']);
    await successfulReload;
    assert.equal(await page.locator('#phase17a-recovery').count(), 0);
    const saved = await page.evaluate(() => localStorage.getItem('caffoot_state'));
    assert(saved && JSON.parse(saved).devices, 'New default inventory should persist');
    assert.notEqual(saved, raw);
    console.log('PASS M-014 R5: successful reset persists a valid empty inventory.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
