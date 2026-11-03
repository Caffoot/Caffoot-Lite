import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const url = process.env.PILOT_URL ?? 'http://127.0.0.1:4173/';
const shots = new URL('../playwright-screenshots/', import.meta.url);
await mkdir(shots, { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 1536, height: 960 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(url, { waitUntil: 'networkidle' });

  // Start at physical Device Details, not at a mock-up of an already-rebuilt app.
  const dialog = page.getByRole('dialog');
  await dialog.waitFor();
  assert.match(await dialog.getByRole('heading', { level: 2 }).innerText(), /Hypervisor-01/);
  await dialog.getByRole('tab', { name: 'Hardware' }).click();
  await dialog.getByRole('heading', { name: 'Hardware & Lifecycle' }).waitFor();
  await dialog.getByRole('tab', { name: 'Virtual Machines' }).click();
  await dialog.getByRole('button', { name: 'View Details' }).click();

  // VM details describe its allocation, never pretend it owns physical host hardware.
  assert.equal(await dialog.getByRole('tab', { name: 'Hardware' }).count(), 0);
  await dialog.getByRole('heading', { name: 'Allocated Virtual Hardware' }).waitFor();
  await dialog.getByRole('button', { name: 'View Host' }).click();
  await dialog.getByRole('heading', { name: 'At a Glance' }).waitFor();
  await page.screenshot({ path: new URL('physical-details-1536.png', shots).pathname, fullPage: true });

  // Test a real, interactive edit form without any server calls or persistence.
  await dialog.getByRole('button', { name: 'Edit Device' }).click();
  await dialog.getByRole('tab', { name: 'Hardware' }).click();
  await dialog.getByLabel('Manufacturer').fill('Example Manufacturer');
  await dialog.getByRole('tab', { name: 'Software & Firmware' }).click();
  await dialog.getByLabel('Search Software').fill('Veeam');
  assert.equal(await dialog.getByText('Veeam Agent').count(), 1);
  await dialog.getByRole('tab', { name: 'General' }).click();
  await dialog.getByLabel('Device Name').fill('');
  await dialog.getByRole('button', { name: 'Save Device' }).click();
  await dialog.getByRole('alert').getByText('Enter a device name first.').waitFor();
  await dialog.getByLabel('Device Name').fill('Unsaved Example');
  await dialog.getByRole('button', { name: 'Save Device' }).click();
  await dialog.getByRole('status').getByText(/no device, IP address or rack placement was saved/).waitFor();
  await dialog.getByRole('button', { name: 'Back to Details' }).click();
  assert.match(await dialog.getByRole('heading', { level: 2 }).innerText(), /Hypervisor-01/);

  // Switching to VM edit must remove physical Hardware, rack placement and manufacturing inputs.
  await dialog.getByRole('tab', { name: 'Virtual Machines' }).click();
  await dialog.getByRole('button', { name: 'View Details' }).click();
  await dialog.getByRole('button', { name: 'Edit Device' }).click();
  assert.equal(await dialog.getByRole('tab', { name: 'Hardware' }).count(), 0);
  await dialog.getByLabel('Physical Hypervisor Host').waitFor();
  assert.equal(await dialog.getByLabel('Start U').count(), 0);
  await dialog.getByLabel('vCPUs').waitFor();
  await dialog.getByRole('tab', { name: 'Software & Firmware' }).click();
  const options = await dialog.getByLabel('Operating System').locator('option').allTextContents();
  assert.ok(options.includes('Ubuntu Server') && !options.includes('VMware ESXi'),
    'VM OS choices must be different from those of a physical hypervisor');
  await page.screenshot({ path: new URL('virtual-edit-1536.png', shots).pathname, fullPage: true });

  // Escape should safely leave editing; a further Escape closes the dialog.
  await page.keyboard.press('Escape');
  await dialog.getByRole('heading', { level: 2, name: 'App-VM-01' }).waitFor();
  await page.keyboard.press('Escape');
  assert.equal(await dialog.count(), 0);

  // Read-only mode only changes the demonstration's controls, not backend permissions.
  await page.getByLabel('Read-Only View').check();
  await page.getByRole('row', { name: /App-VM-01/ }).getByRole('button', { name: 'Details' }).click();
  assert.equal(await dialog.getByRole('button', { name: 'Edit Device' }).count(), 0);

  // The built static site must behave at the approved desktop, intermediate and mobile widths.
  for (const [width, height] of [[1536, 960], [1280, 850], [390, 844]]) {
    await page.setViewportSize({ width, height });
    await dialog.getByRole('heading', { level: 2, name: 'App-VM-01' }).waitFor();
    const bounds = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
      modal: document.querySelector('[role="dialog"]')?.getBoundingClientRect().width
    }));
    assert.ok(bounds.scroll <= bounds.viewport + 2, 'Page overflow at ' + width + ': ' + JSON.stringify(bounds));
    assert.ok(bounds.modal > 0 && bounds.modal <= width, 'Dialog should fit at width ' + width);
    await page.screenshot({ path: new URL('vm-details-' + width + '.png', shots).pathname, fullPage: true });
  }
  assert.deepEqual(errors, [], 'No browser page errors are allowed');
  await browser.close();
  console.log('Svelte Device Details pilot browser checks passed at 1536, 1280 and 390 px.');
} catch (error) {
  await browser.close();
  throw error;
}
