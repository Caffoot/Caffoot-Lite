'use strict';
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors = [];
    const requests = [];
    let confirmations = 0;
    page.on('pageerror', e => errors.push(e.message));
    page.on('request', r => { if (/^https?:/i.test(r.url())) requests.push(r.url()); });
    page.on('dialog', async dialog => { confirmations++; await dialog.dismiss(); });
    await page.route(/^https?:/i, route => route.abort('blockedbyclient'));
    await page.goto(pathToFileURL(path.join(__dirname,'dist','Caffoot-Lite.html')).href, {waitUntil:'load'});
    const baseline = await page.evaluate(() => {
      if (!saveState()) throw Error('Baseline save failed');
      return {active:JSON.stringify(appState),stored:localStorage.getItem('caffoot_state'),
        safety:localStorage.getItem('caffoot_phase11_pre_restore')};
    });
    assert(baseline.stored, 'Baseline inventory must exist in browser storage');
    const cases = [
      ['invalid-json','{not valid JSON'],
      ['invalid-shape',JSON.stringify({devices:[],racks:[],subnets:[],ipAllocations:{}})],
      ['unsafe-nested-property','{"devices":[],"racks":[],"subnets":[],"ipAllocations":{},"vlans":[],"metadata":{"constructor":{"prototype":{"polluted":true}}}}'],
      ['oversized-file','x'.repeat(10*1024*1024+1)]
    ];
    for (const [name, contents] of cases) {
      await page.locator('#import-file').setInputFiles({
        name:name+'.json', mimeType:'application/json', buffer:Buffer.from(contents)
      });
      await page.waitForFunction(() => document.getElementById('import-file').value === '');
      const current = await page.evaluate(() => ({
        active:JSON.stringify(appState),stored:localStorage.getItem('caffoot_state'),
        safety:localStorage.getItem('caffoot_phase11_pre_restore')
      }));
      assert.deepEqual(current,baseline,name+' must not alter inventory or safety snapshot');
      assert.equal(confirmations,0,name+' must be rejected before replacement confirmation');
      console.log('PASS: browser rejected '+name+' without changing inventory');
    }
    await page.reload({waitUntil:'load'});
    const persisted=await page.evaluate(()=>localStorage.getItem('caffoot_state'));
    assert.equal(persisted,baseline.stored,'Rejected imports must not damage saved inventory across reload');
    assert.deepEqual(requests,[],'Import tests must stay offline');
    assert.deepEqual(errors,[],'Import tests must not cause uncaught browser exceptions');
    await context.close();
    console.log('PASS: rejected backup browser security and persistence checks');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
