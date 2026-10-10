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

    // Corrupt the isolated browser inventory and verify recovery without overwriting it.
    const corrupt = '{broken inventory JSON';
    await page.evaluate(value => localStorage.setItem('caffoot_state', value), corrupt);
    await page.reload({ waitUntil: 'load' });
    const recovery = page.locator('#phase17a-recovery');
    await recovery.waitFor({ state: 'visible' });
    assert.match(await recovery.innerText(), /recovery mode/i);
    assert.equal(await page.evaluate(() => saveState()), false, 'Recovery must block saving');
    assert.equal(await page.evaluate(() => localStorage.getItem('caffoot_state')), corrupt,
      'Corrupt inventory must remain untouched');
    const downloadPromise = page.waitForEvent('download');
    await recovery.getByRole('button', { name: 'Download original stored data' }).click();
    const download = await downloadPromise;
    assert.equal(download.suggestedFilename(), 'caffoot_lite_unreadable_recovery.txt');
    const fs = require('node:fs');
    assert.equal(fs.readFileSync(await download.path(), 'utf8'), corrupt,
      'Recovery download must preserve the original stored text');
    await page.reload({ waitUntil: 'load' });
    await page.locator('#phase17a-recovery').waitFor({ state: 'visible' });
    assert.equal(await page.evaluate(() => localStorage.getItem('caffoot_state')), corrupt,
      'Corrupt data must survive a second reload');
    console.log('PASS: corrupted inventory recovery protects data and exports original text.');
    // WCAG AA contrast audit for the application's shared light/dark text tokens.
    const contrast = await page.evaluate(() => {
      const css = getComputedStyle(document.documentElement);
      const read = name => css.getPropertyValue(name).trim();
      const sample = () => ({
        text: read('--ui-text'), muted: read('--ui-text-muted'),
        subtle: read('--ui-text-subtle'), surface: read('--ui-surface'),
        alternative: read('--ui-surface-alt')
      });
      const originallyDark = document.documentElement.classList.contains('dark');
      document.documentElement.classList.remove('dark');
      const light = sample();
      document.documentElement.classList.add('dark');
      const dark = sample();
      document.documentElement.classList.toggle('dark', originallyDark);
      return { light, dark };
    });
    const luminance = hex => {
      assert.match(hex, /^#[0-9a-f]{6}$/i, 'Contrast token must be a six-digit hex colour');
      const channels = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
      const linear = channels.map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
      return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
    };
    const ratio = (a, b) => {
      const x = luminance(a), y = luminance(b);
      return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
    };
    for (const [theme, tokens] of Object.entries(contrast)) {
      for (const foreground of ['text', 'muted', 'subtle']) {
        for (const background of ['surface', 'alternative']) {
          assert(ratio(tokens[foreground], tokens[background]) >= 4.5,
            theme + ' ' + foreground + ' on ' + background + ' must meet WCAG AA text contrast');
        }
      }
    }
    console.log('PASS: light/dark shared text tokens meet WCAG AA contrast on both surfaces.');
    // Exercise real keyboard focus containment and return in the universal dialog.
    await page.evaluate(() => {
      const trigger = document.createElement('button');
      trigger.id = 'accessibility-test-trigger';
      trigger.textContent = 'Open accessibility test dialog';
      document.body.appendChild(trigger);
      trigger.focus();
      openModal('<h2>Keyboard test dialog</h2><label for="accessibility-test-field">Test field</label><input id="accessibility-test-field" required><button id="accessibility-test-close" type="button">Close</button>');
    });
    assert.equal(await page.locator('#modal-content').getAttribute('aria-modal'), 'true');
    assert.equal(await page.locator('#modal-content').getAttribute('aria-labelledby'), 'caffoot-modal-heading');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'accessibility-test-field',
      'Dialog must focus its first input');
    const fieldAccessibility = await page.locator('#accessibility-test-field').evaluate(el => ({
      label: el.labels && el.labels[0] && el.labels[0].textContent.trim(),
      required: el.required
    }));
    assert.deepEqual(fieldAccessibility, { label: 'Test field', required: true });
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'accessibility-test-close',
      'Reverse tab must wrap to final dialog control');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'accessibility-test-field',
      'Forward tab must wrap to first dialog control');
    const focusStyle = await page.locator('#accessibility-test-field').evaluate(el => {
      const css = getComputedStyle(el);
      return { style: css.outlineStyle, width: parseFloat(css.outlineWidth) };
    });
    assert.notEqual(focusStyle.style, 'none', 'Keyboard focus must have a visible outline');
    assert(focusStyle.width >= 2, 'Keyboard focus outline must be at least 2px');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#modal-container').evaluate(el => el.classList.contains('hidden')), true,
      'Escape must close dialog');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'accessibility-test-trigger',
      'Closing dialog must return focus to trigger');
    await page.evaluate(() => document.getElementById('accessibility-test-trigger').remove());
    console.log('PASS: modal keyboard trap, labelled field, visible focus, Escape and focus return.');
    assert.deepEqual(outbound, [], 'Standalone file must not attempt network requests');
    assert.deepEqual(failures, [], 'Browser must not raise uncaught JavaScript errors');
    console.log('PASS: Chromium file:// startup, navigation, offline operation and localStorage reload.');
    await context.close();
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
