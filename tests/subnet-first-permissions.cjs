// Verify the new IPAM forms using separate real sessions with restricted rights.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
module.exports=async function verifySubnetFirstPermissions({context,fixtureDirectory,errors,state}){
 const sessions=JSON.parse(fs.readFileSync(path.join(fixtureDirectory,'subnet-role-sessions.json'),'utf8'));
 for(const [role,token]of Object.entries(sessions)){
  const isolated=await context.browser().newContext({ignoreHTTPSErrors:true});await isolated.addCookies([{name:'caffoot_session',value:token,url:'https://127.0.0.1:8080',secure:true,httpOnly:true,sameSite:'Strict'}]);
  await isolated.route(/https:\/\/(fonts\.googleapis|fonts\.gstatic|cdnjs\.cloudflare)\.com\//,r=>r.abort());
  const member=await isolated.newPage();member.on('pageerror',e=>errors.push(role+': '+e.message));await member.goto('https://127.0.0.1:8080/inventory');await member.locator('#app[aria-busy=false]').waitFor();await member.locator('#sidebar [data-action=tab-ipam]').click();
  if(role==='subnet-reader'){
   assert.equal(await member.locator('#main-content [data-action=open-subnet-modal]:visible').count(),0);assert.equal(await member.locator('#main-content [data-action=open-multiple-subnets]:visible').count(),0);
  }else{
   const memberState=await(await isolated.request.get('https://127.0.0.1:8080/api/inventory/state')).json();assert.equal(memberState.editPermissions.Devices,false);assert(!('devices'in memberState));await member.locator('#main-content [data-action=open-multiple-subnets]:visible').first().click();await member.locator('#subnet-batch-start').fill('10.86.0.0');await member.locator('#subnet-batch-count').fill('1');await member.locator('#subnet-batch-convention').selectOption('First usable IP');await member.locator('#subnet-batch-generator [type=submit]').click();await member.locator('#subnet-row-0-name').fill('Fictional IPAM-only subnet');await member.locator('#subnet-row-0-purpose').selectOption('Management');await member.locator('#subnet-batch-preview [type=submit]').click();await member.waitForFunction(()=>document.getElementById('modal-container').classList.contains('hidden'));assert((await state()).subnets.some(s=>s.name==='Fictional IPAM-only subnet'));
  }
  await isolated.close();
 }
};
