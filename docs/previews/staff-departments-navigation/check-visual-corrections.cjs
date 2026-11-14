// Check the isolated preview with an already installed Playwright and Chromium.
// These layout checks complement the side-by-side screenshots and owner review.
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const url = process.env.PREVIEW_URL || 'http://127.0.0.1:8767/preview.html';
const checks = [];

(async () => {
  const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox']});
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const button = name => page.getByRole('button', {name, exact: true});
    const navigation = name => page.locator('#sidebar').getByRole('button', {name, exact: true});
    const check = (value, name) => {assert(value, name); checks.push(name);};
    const box = selector => page.locator(selector).evaluate(element => {
      const bounds = element.getBoundingClientRect();
      return {x: bounds.x + scrollX, y: bounds.y + scrollY, width: bounds.width, height: bounds.height};
    });
    async function control(name, value) {
      await page.locator('#preview-review-controls').evaluate(element => element.open = true);
      await page.locator('#preview-' + name).selectOption(value);
      await page.locator('#preview-review-controls').evaluate(element => element.open = false);
    }
    async function alignedControls() {
      return page.locator('.preview-aligned-form .input:visible').evaluateAll(elements => elements.every(element => {
        const label = document.querySelector('label[for="' + element.id + '"]');
        return element.getBoundingClientRect().height === 42 && label && label.getBoundingClientRect().bottom < element.getBoundingClientRect().top;
      }));
    }
    for (const width of [1440, 1024, 768, 390]) {
      for (const theme of ['light', 'dark']) {
        const context = `${width}px ${theme}`;
        await page.setViewportSize({width, height: 1000});
        await page.goto(url);
        await control('theme', theme);
        const row = page.locator('[data-preview-staff-id="alex"]');
        check(await row.getByRole('button', {name: 'View Details', exact: true}).count() === 1 && await row.getByRole('button', {name: 'Edit', exact: true}).count() === 1, context + ': separate View Details and Edit');
        check(await page.locator('[data-preview-staff-id] [data-preview-action="staff-create-login"]').count() === 0, context + ': no directory-row Create Login');
        await button('+ Add Staff Member').click();
        check(!await page.locator('#preview-create-login').isChecked() && !await page.locator('#preview-login-fields').isVisible(), context + ': optional login starts off');
        const personal = await box('.staff-details-card');
        const login = await box('.staff-login-card');
        const guidance = await box('.staff-security-summary');
        check(width > 1110 ? login.x > personal.x + personal.width && Math.abs(login.y - personal.y) < 1 : login.y >= personal.y + personal.height, context + ': approved personal/login column order');
        check(width > 1110 || width <= 850 ? guidance.y >= login.y + login.height : guidance.x > login.x, context + ': separate guidance card');
        await page.locator('#preview-create-login').check();
        check(await page.locator('.staff-login-card .staff-role-note').isVisible() && await page.locator('.staff-login-card .staff-mfa-hint').isVisible(), context + ': role and MFA guidance inside login card');
        check(await alignedControls(), context + ': labelled 42px Staff controls');
        if (width > 590) {
          const department = await box('#preview-departmentId');
          const job = await box('#preview-jobTitle');
          check(Math.abs(department.y - job.y) < 1, context + ': Department and Job Title controls aligned');
        }
        const footer = await box('.staff-actions');
        const grid = await box('.staff-main-grid');
        check(footer.y >= grid.y + grid.height && await page.locator('.staff-action-buttons').getByRole('button', {name: 'Cancel', exact: true}).count() === 1 && await page.locator('.staff-action-buttons .primary').textContent() === 'Save Staff Member', context + ': separate Save/Cancel footer');
        const heading = await box('.section-page-header h1');
        const back = await box('.preview-page-actions');
        check(heading.x + heading.width <= back.x || heading.y + heading.height <= back.y, context + ': header actions do not squeeze or overlap heading');
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), context + ': no Staff form overflow');
        await button('Cancel').click();
        await row.getByRole('button', {name: 'Edit', exact: true}).click();
        check(await page.locator('.staff-login-card').getByRole('button', {name: 'Manage Login In Permissions', exact: true}).isVisible() && await alignedControls(), context + ': Edit retains linked login and aligned controls');
        await navigation('Departments').click();
        check(await page.locator('.preview-page-actions .primary').textContent() === '+ Add Department', context + ': primary Department action in page header');
        await button('+ Add Department').click();
        check(await alignedControls(), context + ': labelled 42px Department Add controls');
        await page.keyboard.press('Escape');
        await page.locator('.userrow').filter({hasText: 'Design Lab'}).getByRole('button').click();
        check(await alignedControls(), context + ': labelled 42px Department Edit controls');
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), context + ': no Department form overflow');
        await page.keyboard.press('Escape');
      }
    }
    await page.goto(url);
    await page.locator('[data-preview-staff-id="priya"]').getByRole('button', {name: 'View Details', exact: true}).click();
    await button('Create Login').click();
    check(await page.locator('.staff-login-card #preview-create-login').isChecked(), 'Record Create Login opens combined form with explicit login intent');
    await page.goto(url);
    await control('persona', 'staff-reader');
    check(await button('Edit').count() === 0 && await button('View Details').count() === 4, 'Staff Read shows View Details without Edit');
    await control('persona', 'staff-editor');
    check(await button('Edit').count() === 4 && await navigation('Departments').count() === 0, 'Staff Edit keeps row Edit without Departments access');
    await button('Edit').first().click();
    check(await page.locator('#preview-create-login').count() === 0 && await button('Manage Login In Permissions').count() === 0, 'Restricted combined form exposes no account controls');
    check(errors.length === 0, 'No preview page errors');
    const result = {checks, pageErrors: errors, viewports: [1440, 1024, 768, 390], themes: ['light', 'dark']};
    if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(result, null, 2) + '\n');
    console.log(JSON.stringify({checks: checks.length, pageErrors: errors}));
  } finally {
    await browser.close();
  }
})().catch(error => {console.error(error); process.exit(1);});
