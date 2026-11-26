// Reuse the Staff Members entry point in browser regressions for account controls.
async function openStaffList(page) {
 await page.locator('#app[aria-busy="false"]').waitFor();
 const close=page.locator('[data-staff-account-modal] [data-action="users-close-editor"]').first();
 if(await close.isVisible())await close.click();
 const list=page.locator('.preview-staff-directory');
 await page.evaluate(async()=>{
  switchTab('staff');
  await window.caffootStaffDirectory.refresh();
 });
 if(!await list.isVisible())await page.locator('[data-staff-action="staff-back"]').first().click();
 await list.waitFor();
}

async function startStaffLoginForm(page) {
 await openStaffList(page);
 await page.locator('[data-staff-action="staff-add"]').click();
 const form=page.locator('#staff-record-form');
 await form.locator('#staff-create-login').check();
 return form;
}

async function openStaffAccount(page,username,tab='personal') {
 await openStaffList(page);
 await page.locator('#staff-directory-search').fill(username);
 await page.locator('[data-staff-id]').filter({has:page.getByText('Username: '+username,{exact:true})})
  .getByRole('button',{name:'View Details'}).click();
 const button=page.getByRole('button',{name:'Manage Permissions'});
 await button.click();
 await page.locator('[data-staff-account-modal] [role="dialog"]').waitFor();
 await page.locator('[data-account-tab="'+tab+'"]').click();
 return button;
}

module.exports={openStaffList,startStaffLoginForm,openStaffAccount};
