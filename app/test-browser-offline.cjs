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
    // Regression: imported subnet strings must remain values, never executable markup.
    const subnetProbe = await page.evaluate(() => {
      const marker = 'subnet-attribute-escape-test';
      const payload = '\"><img src=x onerror=alert(1)>';
      const subnet = {
        id: marker, cidr: '192.168.77.0/24', name: payload,
        vlan: 77, gateway: '192.168.77.1', description: payload
      };
      appState.subnets.push(subnet);
      try {
        openSubnetModal(marker);
        const content = document.getElementById('modal-content');
        const name = content.querySelector('#sub-name');
        const description = content.querySelector('#sub-desc');
        const labels = ['sub-cidr', 'sub-name', 'sub-vlan', 'sub-gw', 'sub-desc']
          .map(id => {
            const input = content.querySelector('#' + id);
            return { id, labelled: !!(input && input.labels && input.labels.length) };
          });
        return {
          name: name && name.value,
          description: description && description.value,
          injectedImages: content.querySelectorAll('img').length,
          fieldCount: content.querySelectorAll('input').length,
          labels
        };
      } finally {
        closeModal();
        appState.subnets.splice(appState.subnets.indexOf(subnet), 1);
      }
    });
    const payload = '"><img src=x onerror=alert(1)>';
    assert.equal(subnetProbe.name, payload, 'Subnet name must preserve exact text');
    assert.equal(subnetProbe.description, payload, 'Subnet description must preserve exact text');
    assert.equal(subnetProbe.injectedImages, 0, 'Subnet values must not create injected elements');
    assert.equal(subnetProbe.fieldCount, 5, 'Subnet values must not alter the form structure');
    assert(subnetProbe.labels.every(field => field.labelled),
      'All five subnet fields must have associated labels');
    console.log('PASS: subnet edit fields safely preserve hostile text and accessible labels.');
    // IPAM regression: visible labels must identify the actual controls, and
    // an unexpected allocation key must never become markup in the heading.
    const ipProbe = await page.evaluate(() => {
      const ip = '192.168.77.42<img src=x onerror=alert(1)>';
      openIpModal(ip);
      try {
        const dialog = document.getElementById('modal-content');
        const fields = ['ip-status', 'ip-hostname', 'ip-notes'].map(id => {
          const el = dialog.querySelector('#' + id);
          return { id, label: el && el.labels && el.labels[0] && el.labels[0].textContent.trim() };
        });
        return {
          fields,
          heading: dialog.querySelector('h3')?.textContent,
          images: dialog.querySelectorAll('img').length
        };
      } finally {
        closeModal();
      }
    });
    assert.deepEqual(ipProbe.fields, [
      { id: 'ip-status', label: 'Status' },
      { id: 'ip-hostname', label: 'Hostname' },
      { id: 'ip-notes', label: 'Notes' }
    ], 'Every IPAM allocation field must have its matching accessible label');
    assert.equal(ipProbe.heading, 'Configure IP: 192.168.77.42<img src=x onerror=alert(1)>',
      'IP dialog heading must preserve the literal text');
    assert.equal(ipProbe.images, 0, 'IP dialog heading must not inject HTML elements');
    console.log('PASS: IPAM allocation labels and heading escaping in Chromium.');
    // Device regression: rack and location controls must retain accessible labels.
    const deviceLabels = await page.evaluate(() => {
      openDeviceModal();
      try {
        const dialog = document.getElementById('modal-content');
        const ids = ['dev-name', 'dev-type', 'dev-mount-type', 'dev-location',
          'dev-custom-location', 'dev-rack-face', 'dev-rack-u',
          'dev-rack-height', 'dev-notes'];
        return ids.map(id => {
          const control = dialog.querySelector('#' + id);
          return {
            id,
            present: !!control,
            label: control && control.labels && control.labels[0]
              ? control.labels[0].textContent.trim() : null,
            required: !!(control && control.required)
          };
        });
      } finally {
        closeModal();
      }
    });
    for (const field of deviceLabels) {
      assert(field.present, field.id + ' must be present in Add Device');
      assert(field.label && field.label.length > 0, field.id + ' must have an associated label');
    }
    for (const id of ['dev-name', 'dev-type', 'dev-mount-type', 'dev-location']) {
      assert(deviceLabels.find(field => field.id === id).required,
        id + ' must retain required validation');
    }
    console.log('PASS: Device form mounting, location, rack and notes labels in Chromium.');
    // Inventory integrity: reject rack collisions and out-of-range U allocations.
    const rackValidation = await page.evaluate(() => {
      const rack = { id: 'browser-rack-check', name: 'Browser rack', heightU: 12 };
      const occupied = {
        id: 'browser-occupied-device', rackId: rack.id,
        face: 'front', rackUStart: 4, rackUEnd: 6
      };
      appState.racks.push(rack);
      appState.devices.push(occupied);
      try {
        return {
          overlap: validateRackPlacement('new-device', rack.id, 'front', 5, 7),
          outside: validateRackPlacement('new-device', rack.id, 'front', 11, 13),
          missing: validateRackPlacement('new-device', 'missing-browser-rack', 'front', 1, 1),
          clear: validateRackPlacement('new-device', rack.id, 'front', 7, 9),
          otherFace: validateRackPlacement('new-device', rack.id, 'rear', 5, 7)
        };
      } finally {
        appState.devices.splice(appState.devices.indexOf(occupied), 1);
        appState.racks.splice(appState.racks.indexOf(rack), 1);
      }
    });
    assert.match(rackValidation.overlap, /overlap/i, 'Rack U overlap must be rejected');
    assert.match(rackValidation.outside, /between U1 and U12/i, 'Rack U bounds must be enforced');
    assert.match(rackValidation.missing, /no longer exists/i, 'Missing racks must be rejected');
    assert.equal(rackValidation.clear, null, 'Non-overlapping rack positions should remain valid');
    assert.equal(rackValidation.otherFace, null, 'Opposite rack faces may share U positions');
    console.log('PASS: rack placement rejects collisions and out-of-range positions.');
    // Device/IPAM integrity: rejected changes must not release the existing IP.
    const ipamIntegrity = await page.evaluate(() => {
      const subnet = { id: 'browser-ipam-subnet', cidr: '10.240.77.0/24',
        gateway: '10.240.77.1', name: 'Browser IPAM test', vlan: 77 };
      const device = { id: 'browser-ipam-device', name: 'Original device',
        notes: 'Original notes', primaryIp: '10.240.77.10', ipReserved: false };
      const rival = { id: 'browser-ipam-rival', name: 'Other device',
        primaryIp: '10.240.77.20' };
      const keys = ['10.240.77.10', '10.240.77.20', '10.240.77.30'];
      const originals = keys.map(ip => [ip, appState.ipAllocations[ip]]);
      appState.subnets.push(subnet);
      appState.devices.push(device, rival);
      appState.ipAllocations[keys[0]] = {
        status: 'Assigned', deviceId: device.id, hostname: device.name, notes: device.notes
      };
      appState.ipAllocations[keys[1]] = {
        status: 'Assigned', deviceId: rival.id, hostname: rival.name
      };
      appState.ipAllocations[keys[2]] = { status: 'Reserved', hostname: 'Reserved host' };
      try {
        const before = JSON.stringify({
          device: device.primaryIp, old: appState.ipAllocations[keys[0]]
        });
        const rejected = [];
        for (const ip of [keys[1], keys[2], '10.241.77.44']) {
          try { setDevicePrimaryIp(device, ip); rejected.push(null); }
          catch (error) { rejected.push(error.message); }
        }
        const after = JSON.stringify({
          device: device.primaryIp, old: appState.ipAllocations[keys[0]]
        });
        device.name = 'Updated device';
        device.notes = 'Updated notes';
        syncDeviceIpamRecord(device);
        const synced = { ...appState.ipAllocations[keys[0]] };
        setDevicePrimaryIp(device, '10.240.77.11');
        const moved = {
          ip: device.primaryIp,
          oldExists: Object.prototype.hasOwnProperty.call(appState.ipAllocations, keys[0]),
          newAllocation: { ...appState.ipAllocations['10.240.77.11'] }
        };
        return { rejected, unchanged: before === after, synced, moved };
      } finally {
        appState.devices.splice(appState.devices.indexOf(rival), 1);
        appState.devices.splice(appState.devices.indexOf(device), 1);
        appState.subnets.splice(appState.subnets.indexOf(subnet), 1);
        delete appState.ipAllocations['10.240.77.11'];
        for (const [ip, original] of originals) {
          if (original === undefined) delete appState.ipAllocations[ip];
          else appState.ipAllocations[ip] = original;
        }
      }
    });
    assert(ipamIntegrity.rejected.every(message => typeof message === 'string'),
      'Duplicate, reserved and out-of-subnet IP addresses must be rejected');
    assert(ipamIntegrity.unchanged, 'Rejected IP changes must retain original allocation');
    assert.equal(ipamIntegrity.synced.hostname, 'Updated device');
    assert.equal(ipamIntegrity.synced.notes, 'Updated notes');
    assert.equal(ipamIntegrity.moved.ip, '10.240.77.11');
    assert.equal(ipamIntegrity.moved.oldExists, false, 'Old owned allocation must be released');
    assert.equal(ipamIntegrity.moved.newAllocation.hostname, 'Updated device');
    assert.equal(ipamIntegrity.moved.newAllocation.deviceId, 'browser-ipam-device');
    console.log('PASS: Device/IPAM rejection, detail synchronisation and IP reassignment.');
    // A failed browser storage write must roll back Device edits and IPAM changes.
    const failedDeviceSave = await page.evaluate(() => {
      const subnet = { id: 'browser-save-subnet', cidr: '10.240.78.0/24',
        gateway: '10.240.78.1', name: 'Browser save test', vlan: 78 };
      const device = { id: 'browser-save-device', name: 'Before save failure',
        type: 'Switch', mountType: 'Desktop', location: 'Unknown',
        notes: 'Original note', status: 'Active', primaryIp: '10.240.78.10',
        ipReserved: false, rackId: '', face: 'front' };
      const originalSaveState = saveState;
      const originalStorage = localStorage.getItem('caffoot_state');
      appState.subnets.push(subnet);
      appState.devices.push(device);
      appState.ipAllocations[device.primaryIp] = {
        deviceId: device.id, status: 'Assigned',
        hostname: device.name, notes: device.notes
      };
      const before = JSON.stringify(appState);
      let modalStayedOpen = false;
      try {
        openDeviceModal(device.id);
        const type = document.getElementById('dev-type');
        const location = document.getElementById('dev-location');
        if (!Array.from(type.options).some(option => option.value === device.type)) {
          type.add(new Option(device.type, device.type));
        }
        if (!Array.from(location.options).some(option => option.value === device.location)) {
          location.add(new Option(device.location, device.location));
        }
        type.value = device.type;
        location.value = device.location;
        document.getElementById('dev-mount-type').value = 'Desktop';
        document.getElementById('dev-subnet').value = subnet.id;
        document.getElementById('dev-name').value = 'Changed but not saved';
        document.getElementById('dev-notes').value = 'Changed note';
        document.getElementById('dev-ip').value = '10.240.78.11';
        saveState = () => false;
        handleDeviceSubmit({ preventDefault() {} }, device.id);
        modalStayedOpen = !document.getElementById('modal-container').classList.contains('hidden');
        return {
          unchanged: JSON.stringify(appState) === before,
          storedUnchanged: localStorage.getItem('caffoot_state') === originalStorage,
          modalStayedOpen
        };
      } finally {
        saveState = originalSaveState;
        closeModal();
        const idx = appState.devices.findIndex(item => item.id === device.id);
        if (idx >= 0) appState.devices.splice(idx, 1);
        const subnetIdx = appState.subnets.findIndex(item => item.id === subnet.id);
        if (subnetIdx >= 0) appState.subnets.splice(subnetIdx, 1);
        delete appState.ipAllocations['10.240.78.10'];
        delete appState.ipAllocations['10.240.78.11'];
      }
    });
    assert(failedDeviceSave.unchanged, 'Failed Device save must restore Device and IPAM state');
    assert(failedDeviceSave.storedUnchanged, 'Failed Device save must not alter stored inventory');
    assert(failedDeviceSave.modalStayedOpen, 'Failed Device save must keep edit dialog open');
    console.log('PASS: failed Device save rolls back IPAM and inventory without closing form.');
    // A failed first save must not leave a ghost device or orphaned IPAM allocation.
    const failedDeviceCreate = await page.evaluate(() => {
      const subnet = { id: 'browser-create-subnet', cidr: '10.240.79.0/24',
        gateway: '10.240.79.1', name: 'Browser create test', vlan: 79 };
      const ip = '10.240.79.15';
      const originalSaveState = saveState;
      const originalStorage = localStorage.getItem('caffoot_state');
      appState.subnets.push(subnet);
      const before = JSON.stringify(appState);
      try {
        openDeviceModal();
        const type = document.getElementById('dev-type');
        const location = document.getElementById('dev-location');
        if (!Array.from(type.options).some(option => option.value === 'Switch')) {
          type.add(new Option('Switch', 'Switch'));
        }
        if (!Array.from(location.options).some(option => option.value === 'Unknown')) {
          location.add(new Option('Unknown', 'Unknown'));
        }
        type.value = 'Switch';
        location.value = 'Unknown';
        document.getElementById('dev-mount-type').value = 'Desktop';
        document.getElementById('dev-subnet').value = subnet.id;
        document.getElementById('dev-name').value = 'Browser ghost device';
        document.getElementById('dev-ip').value = ip;
        saveState = () => false;
        handleDeviceSubmit({ preventDefault() {} }, null);
        return {
          unchanged: JSON.stringify(appState) === before,
          storedUnchanged: localStorage.getItem('caffoot_state') === originalStorage,
          noGhost: !appState.devices.some(d => d.name === 'Browser ghost device'),
          noOrphan: !Object.prototype.hasOwnProperty.call(appState.ipAllocations, ip),
          modalStayedOpen: !document.getElementById('modal-container').classList.contains('hidden')
        };
      } finally {
        saveState = originalSaveState;
        closeModal();
        const idx = appState.subnets.findIndex(s => s.id === subnet.id);
        if (idx >= 0) appState.subnets.splice(idx, 1);
      }
    });
    assert(failedDeviceCreate.unchanged, 'Failed Device creation must restore inventory state');
    assert(failedDeviceCreate.storedUnchanged, 'Failed Device creation must preserve stored inventory');
    assert(failedDeviceCreate.noGhost, 'Failed Device creation must not leave a ghost device');
    assert(failedDeviceCreate.noOrphan, 'Failed Device creation must not leave an orphan IPAM allocation');
    assert(failedDeviceCreate.modalStayedOpen, 'Failed Device creation must keep form open');
    console.log('PASS: failed Device creation leaves no ghost device or orphan IPAM record.');
    assert.deepEqual(outbound, [], 'Standalone file must not attempt network requests');
    assert.deepEqual(failures, [], 'Browser must not raise uncaught JavaScript errors');
    console.log('PASS: Chromium file:// startup, navigation, offline operation and localStorage reload.');
    await context.close();
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
