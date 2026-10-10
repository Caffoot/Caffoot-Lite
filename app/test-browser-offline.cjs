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
    const outbound = [];
    const failures = [];
    page.on('request', request => {
      if (/^https?:/i.test(request.url())) outbound.push(request.url());
    });
    page.on('pageerror', error => failures.push(error.message));
    await page.route(/^https?:/i, route => route.abort('blockedbyclient'));
    const url = pathToFileURL(path.join(__dirname, 'dist', 'Caffoot-Lite.html')).href;
    await page.goto(url, { waitUntil: 'load' });
    await page.locator('#main-content').waitFor({ state: 'visible' });
    assert.match(await page.title(), /Caffoot Lite/);
    for (const tab of ['devices','ipam','racks','dashboard']) {
      await page.evaluate(tab => switchTab(tab), tab);
      assert((await page.locator('#main-content').innerText()).trim().length > 30, tab+' should render content');
    }
    const saved = await page.evaluate(() => {
      const success = saveState();
      return { success, stored: localStorage.getItem('caffoot_state') };
    });
    assert.equal(saved.success, true, 'Inventory save should succeed in browser');
    assert(saved.stored && JSON.parse(saved.stored).devices, 'Inventory should be stored');
    await page.reload({ waitUntil: 'load' });
    const restored = await page.evaluate(() => localStorage.getItem('caffoot_state'));
    assert.equal(restored, saved.stored, 'Reload must preserve saved inventory');
    assert.deepEqual(outbound, [], 'Standalone file must not attempt network requests');
    assert.deepEqual(failures, [], 'Browser must not raise uncaught JavaScript errors');
    console.log('PASS: Chromium file:// startup, navigation, offline operation and localStorage reload.');
    await context.close();
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
