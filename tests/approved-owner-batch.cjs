// Check the approved rack, verification, recovery and branding changes with fictional data.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
module.exports=async({page,context,out})=>{
 const address='https://127.0.0.1:8080',results=[],errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto(address+'/inventory');await page.locator('#app[aria-busy="false"]').waitFor();await page.bringToFront();
 await page.evaluate(async()=>{
  const session=await(await fetch('/api/session')).json();
  for(const face of ['front','rear'])for(const record of [
   {id:'horizontal-'+face,name:'Fictional Panel',type:'blank',heightU:2,startU:30,rackId:'rack-0',face},
   {id:'vertical-'+face,name:'Fictional 0U',type:'pdu_vertical',heightU:8,startU:10,rackId:'rack-0',face,side:'left'},
   {id:'blocker-'+face,name:'Fictional Rail Blocker',type:'cable_vertical',heightU:8,startU:30,rackId:'rack-0',face,side:'left'}
  ]){
   const response=await fetch('/api/inventory/record/save',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':session.csrf_token},body:JSON.stringify({collection:'rackAccessories',id:record.id,record})});
   assertResponse(response);
  }
  function assertResponse(response){if(!response.ok)throw Error('Unable to seed fictional rack accessory');}
 });
 await page.reload();await page.locator('#app[aria-busy="false"]').waitFor();await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
 for(const [width,height] of [[1440,950],[1280,800],[390,844]])for(const dark of [false,true])for(const face of ['front','rear']){
  await page.setViewportSize({width,height});
  await page.evaluate(({dark,face})=>{caffootSetTheme(dark?'dark':'light');switchTab('racks');selectedRackId='rack-0';activeRackFace=face;v13RackSection='inventory';v13RackDetailOpen=true;renderContent();}, {dark,face});
  const preview=await page.evaluate(face=>{
   const pane=document.querySelector('[data-rack-scroll]');pane.scrollTop=700;
   const dispatch=(el,type,y,dt)=>el.dispatchEvent(new DragEvent(type,{bubbles:true,cancelable:true,dataTransfer:dt,clientX:el.getBoundingClientRect().x+5,clientY:y}));
   const footprint=el=>{const s=getComputedStyle(el);return {position:s.position,border:s.borderTopWidth,colour:s.borderTopColor,height:el.getBoundingClientRect().height};};
   const before=pane.scrollHeight,source=document.querySelector('[data-rack-accessory="horizontal-'+face+'"]'),dt=new DataTransfer();
   dispatch(source,'dragstart',source.getBoundingClientRect().y+5,dt);
   const row=document.querySelector('[data-rack-drop-u="26"]');dispatch(row,'dragover',row.getBoundingClientRect().y+5,dt);
   const horizontal=footprint(document.querySelector('.rack-drag-preview'));
   const horizontalScrollUnchanged=pane.scrollHeight===before;
   const label=document.querySelector('.rack-drag-hud').textContent;
   // Out-of-bounds placement must retain the approved invalid styling.
   const top=document.querySelector('[data-rack-drop-u="1"]');dispatch(top,'dragover',top.getBoundingClientRect().y+5,dt);
   const invalid=document.querySelector('.rack-drag-preview').classList.contains('invalid');
   dispatch(source,'dragend',0,dt);
   const v=document.querySelector('[data-vertical-accessory="vertical-'+face+'"]'),rail=document.querySelector('.vertical-rack-accessory-rail[data-side="right"]'),vd=new DataTransfer();
   dispatch(v,'dragstart',v.getBoundingClientRect().y+5,vd);dispatch(rail,'dragover',rail.getBoundingClientRect().bottom-600,vd);
   const vertical=footprint(document.querySelector('.rack-vertical-drop-preview'));
   const verticalScrollUnchanged=pane.scrollHeight===before;
   const left=document.querySelector('.vertical-rack-accessory-rail[data-side="left"]');dispatch(left,'dragover',left.getBoundingClientRect().bottom-1400,vd);
   const verticalInvalid=document.querySelector('.rack-vertical-drop-preview').classList.contains('invalid');
   dispatch(v,'dragend',0,vd);
   return {horizontal,vertical,horizontalScrollUnchanged,verticalScrollUnchanged,label,invalid,verticalInvalid,clean:!document.querySelector('.rack-drop-preview,.rack-drag-hud')};
  },face);
  assert.equal(preview.horizontal.position,'absolute');assert.equal(preview.vertical.position,'absolute');
  assert.equal(preview.horizontal.border,'3px');assert.equal(preview.vertical.border,'3px');
  assert.equal(preview.horizontal.colour,'rgb(59, 130, 246)');assert.equal(preview.vertical.colour,'rgb(59, 130, 246)');
  assert.ok(preview.horizontalScrollUnchanged&&preview.verticalScrollUnchanged&&preview.invalid&&preview.verticalInvalid&&preview.clean,JSON.stringify(preview));
  assert.match(preview.label,/Move to U/);
  if((width===1440||width===390)&&face==='front'){
   await page.locator('[data-rack-scroll]').scrollIntoViewIfNeeded();
   await page.evaluate(face=>{
    const pane=document.querySelector('[data-rack-scroll]');pane.scrollTop=500;
    const source=document.querySelector('[data-rack-accessory="horizontal-'+face+'"]'),row=document.querySelector('[data-rack-drop-u="26"]'),dt=new DataTransfer();
    source.dispatchEvent(new DragEvent('dragstart',{bubbles:true,dataTransfer:dt,clientY:source.getBoundingClientRect().y+5}));
    row.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer:dt,clientX:row.getBoundingClientRect().x+50,clientY:row.getBoundingClientRect().y+5}));
   },face);
   await page.locator('[data-rack-scroll]').screenshot({path:path.join(out,`rack-preview-${width}-${dark?'dark':'light'}.png`)});
   await page.evaluate(()=>{document.dispatchEvent(new DragEvent('dragend',{bubbles:true}));document.querySelector('[data-rack-scroll]').scrollTop=700;});
  }

  const horizontal=await page.evaluate(async face=>{const ok=await moveRackAccessoryToPosition('horizontal-'+face,'rack-0',30);return {ok,scroll:document.querySelector('[data-rack-scroll]').scrollTop};},face);
  assert.ok(horizontal.ok);assert.equal(horizontal.scroll,700);
  const response=page.waitForResponse(r=>r.url().endsWith('/api/inventory/state'));
  await page.evaluate(face=>{const v=document.querySelector('[data-vertical-accessory="vertical-'+face+'"]'),rail=document.querySelector('.vertical-rack-accessory-rail[data-side="right"]'),dt=new DataTransfer();document.querySelector('[data-rack-scroll]').scrollTop=700;v.dispatchEvent(new DragEvent('dragstart',{bubbles:true,dataTransfer:dt}));rail.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:dt,clientY:rail.getBoundingClientRect().bottom-600}));},face);
  await response;await page.waitForFunction(()=>document.querySelector('[data-rack-scroll]').scrollTop===700);
  const saved=await page.evaluate(async face=>(await(await fetch('/api/inventory/state')).json()).rackAccessories.find(a=>a.id==='vertical-'+face),face);
  assert.equal(saved.side,'right');assert.equal(saved.face,face);
  // Return to the left rail for the next scenario, through the normal saved record API.
  await page.evaluate(async face=>{const a=appState.rackAccessories.find(a=>a.id==='vertical-'+face);a.side='left';await nextRackBridge.saveAccessory(a.id,a);},face);
  await page.evaluate(face=>openRackAccessoryEditor('rack-0',30,'horizontal-'+face),face);
  assert.ok((await page.locator('#rack-accessory-remove-button').getAttribute('class')).split(' ').includes('btn'));
  await page.locator('#rack-accessory-remove-button').click();await page.locator('#remove-cancel').click();
  assert.equal(await page.locator('#rack-accessory-remove-button').evaluate(el=>el===document.activeElement),true);
  await page.evaluate(()=>closeModal(true));results.push({kind:'rack',width,dark,face,scroll:700,preview});
 }
 await page.evaluate(()=>switchTab('account'));
 assert.equal(await page.locator('#account-email-status').textContent(),'Not Verified');
 assert.ok(await page.locator('#open-email-verification').isDisabled());
 // The backend's proof/security tests exercise real tokens; these browser routes only test UI states.
 let verified=false;
 await page.route('**/api/account/profile',async route=>{
  if(route.request().method()!=='GET')return route.continue();
  await route.fulfill({json:{firstName:'Fictional',lastName:'Person',displayName:'Fictional Person',email:'fictional@example.test',emailVerified:verified,hasPhoto:false}});
 });
 await page.route('**/api/account/email/request',route=>route.fulfill({json:{message:'If recovery is available, instructions will be emailed. Otherwise, contact your Caffoot Lite administrator.'}}));
 let confirmFails=true;
 await page.route('**/api/account/email/confirm',route=>{
  assert.deepEqual(Object.keys(route.request().postDataJSON()).sort(),['password','token']);
  if(confirmFails)return route.fulfill({status:400,json:{error:'Invalid or expired confirmation'}});
  verified=true;return route.fulfill({json:{status:'Email verified'}});
 });
 await page.reload();await page.locator('#app[aria-busy="false"]').waitFor();await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});await page.evaluate(()=>switchTab('account'));
 assert.equal(await page.locator('#account-email-status').textContent(),'Not Verified');
 await page.locator('#account-email').fill('changed@example.test');assert.ok(await page.locator('#open-email-verification').isDisabled());
 await page.locator('#account-email').fill('fictional@example.test');await page.locator('#open-email-verification').click();
 assert.ok(await page.locator('#email-verification-code-fields').isHidden());
 await page.locator('#account-email-verification-form input[name="password"]').fill('Fictional password');await page.locator('#request-email-verification').click();
 await page.locator('#email-verification-code-fields').waitFor();await page.locator('#account-email-verification-form input[name="token"]').fill('x'.repeat(64));
 await page.locator('#account-email-verification-form button[type="submit"]').click();await page.locator('#email-verification-message').filter({hasText:'Invalid or expired'}).waitFor();
 assert.equal(await page.locator('#account-email-status').textContent(),'Not Verified');
 confirmFails=false;await page.locator('#account-email-verification-form button[type="submit"]').click();
 await page.waitForFunction(()=>document.querySelector('#account-email-status').textContent==='Verified');assert.ok(await page.locator('#open-email-verification').isHidden());
 assert.equal(await page.locator('#account-email-verification-form input[name="password"]').inputValue(),'');results.push({kind:'verification',dirty:true,failure:true,success:true});
 verified=false;
 await page.reload();await page.locator('#app[aria-busy="false"]').waitFor();await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
 for(const width of [1440,1280,390,320])for(const dark of [false,true]){
  await page.setViewportSize({width,height:844});await page.evaluate(dark=>{caffootSetTheme(dark?'dark':'light');switchTab('account');},dark);
  await page.locator('#open-email-verification').focus();await page.keyboard.press('Enter');
  await page.locator('#account-email-verification-form input[name="password"]').fill('Fictional password');await page.locator('#request-email-verification').click();await page.locator('#email-verification-code-fields').waitFor();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Verification form must fit '+width);
  if(width===1440||width===390)await page.screenshot({path:path.join(out,`verification-${width}-${dark?'dark':'light'}.png`),fullPage:true,mask:[page.locator('#account-email-verification-form input')]});

  const enlarged=await page.evaluate(()=>{
   const panel=document.querySelector('#account-email-verification');
   const sizes=[...panel.querySelectorAll('*')].map(el=>[el,getComputedStyle(el).fontSize]);
   sizes.forEach(([el,size])=>{el.style.fontSize=(parseFloat(size)*2)+'px';});
   return {overflow:document.documentElement.scrollWidth>innerWidth,wide:[...panel.querySelectorAll('*')].filter(el=>el.getBoundingClientRect().right>innerWidth).map(el=>({tag:el.tagName,class:el.className,text:el.textContent.slice(0,40)}))};
  });
  assert.ok(!enlarged.overflow,'Enlarged verification text: '+width+' '+JSON.stringify(enlarged));
  await page.locator('#cancel-email-verification').click();
  assert.equal(await page.locator('#account-email-verification-form input[name="password"]').inputValue(),'');
  assert.equal(await page.locator('#account-email-verification-form input[name="token"]').inputValue(),'');
  assert.ok(await page.locator('#open-email-verification').evaluate(el=>el===document.activeElement));
  results.push({kind:'verification-layout',width,dark,cancelClearsSecrets:true});
 }
 await page.locator('#open-email-verification').click();await page.locator('#account-email-verification-form input[name="password"]').fill('Fictional password');
 assert.ok(await page.evaluate(()=>{const previous=document.querySelector('#account-email-verification-form');switchTab('dashboard');return previous.elements.password.value==='';}),'Account navigation clears the previous form');

 // An unauthenticated page must show the same next step for every neutral result.
 const publicContext=await context.browser().newContext({ignoreHTTPSErrors:true});
 const signIn=await publicContext.newPage();signIn.on('pageerror',error=>errors.push(error.message));
 await signIn.route(/https:\/\/(fonts\.googleapis|fonts\.gstatic|cdnjs\.cloudflare)\.com\//,route=>route.abort());
 let requestFails=false,resetFails=true,requests=[],requestGate=null,releaseRequest;
 await signIn.route('**/api/recovery/request',async route=>{
  requests.push(route.request().postDataJSON());
  if(requestGate)await requestGate;
  return route.fulfill(requestFails?{status:503,json:{error:'Service unavailable'}}:{json:{message:'If recovery is available, instructions will be emailed. Otherwise, contact your Caffoot Lite administrator.'}});
 });
 await signIn.route('**/api/recovery/confirm',route=>{
  assert.deepEqual(Object.keys(route.request().postDataJSON()).sort(),['mfa_code','password','token']);
  return route.fulfill(resetFails?{status:400,json:{error:'Invalid or expired confirmation'}}:{json:{status:'Password updated; sign in with your authenticator if required'}});
 });
 await signIn.goto(address+'/');await signIn.locator('#auth-heading').filter({hasText:'Welcome Back'}).waitFor();
 await signIn.getByText('Forgot Password?',{exact:true}).click();await signIn.locator('#recovery-request-form input').fill('fictional-user');
 requestGate=new Promise(resolve=>{releaseRequest=resolve;});
 const pendingResponse=signIn.waitForResponse(response=>response.url().endsWith('/api/recovery/request'));
 await signIn.locator('#recovery-request-form button').click();
 assert.match(await signIn.locator('#recovery-message').textContent(),/Requesting recovery/);
 assert.ok(await signIn.locator('#recovery-request-form button').isDisabled());
 assert.equal(await signIn.locator('#recovery-request-form').getAttribute('aria-busy'),'true');
 assert.ok(await signIn.locator('#recovery-message').evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}));
 await signIn.locator('#recovery-back').click();releaseRequest();await pendingResponse;requestGate=null;
 assert.ok(await signIn.locator('#recovery-confirm-form').isHidden());
 for(const [width,height] of [[1440,950],[1280,800],[900,800],[768,800],[730,800],[390,844],[320,700]])for(const dark of [false,true]){
  await signIn.setViewportSize({width,height});await signIn.goto(address+'/');await signIn.bringToFront();await signIn.locator('#auth-heading').filter({hasText:'Welcome Back'}).waitFor();
  await signIn.evaluate(dark=>{localStorage.setItem('caffoot_theme_preference',dark?'dark':'light');applySignInTheme();},dark);
  await signIn.addStyleTag({content:'.screen{animation:none!important}'});
  assert.equal(await signIn.locator('.brand-tagline-heading').textContent(),'Simplicity in everything.');
  assert.equal(await signIn.locator('.brand-tagline-detail').textContent(),'Your infrastructure. Your users. Your data.');
  assert.ok(await signIn.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const lines=await signIn.locator('.brand-tagline-detail').evaluate(el=>el.getBoundingClientRect().height/parseFloat(getComputedStyle(el).lineHeight));assert.equal(lines,1);
  await signIn.getByText('Forgot Password?',{exact:true}).click();assert.ok(await signIn.locator('#recovery-confirm-form').isHidden());
  await signIn.locator('#recovery-request-form input').fill('fictional-user');await signIn.locator('#recovery-request-form button').click();
  await signIn.locator('#recovery-confirm-form').waitFor();assert.equal(await signIn.locator('#recovery-message').getAttribute('role'),'status');
  assert.ok(await signIn.locator('#recovery-message').evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}));
  assert.equal(await signIn.locator('#recovery-confirm-form input[name="token"]').evaluate(el=>el===document.activeElement),true);
  await signIn.locator('#recovery-confirm-form input[name="token"]').fill('x'.repeat(64));await signIn.locator('#recovery-confirm-form input[name="password"]').fill('Fictional reset password');
  await signIn.locator('#recovery-confirm-form button').click();await signIn.locator('#recovery-message').filter({hasText:'Invalid or expired'}).waitFor();
  await signIn.locator('#recovery-back').click();assert.ok(await signIn.locator('#recovery-confirm-form').isHidden());
  assert.equal(await signIn.locator('#recovery-confirm-form input[name="password"]').inputValue(),'');
  if(width===1440||width===390)await signIn.screenshot({path:path.join(out,`sign-in-approved-${width}-${dark?'dark':'light'}.png`),fullPage:true});
  await signIn.evaluate(()=>document.documentElement.style.fontSize='200%');assert.ok(await signIn.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await signIn.evaluate(()=>{
   document.documentElement.style.fontSize='';
   const sizes=[...document.querySelectorAll('.auth-shell *')].map(el=>[el,getComputedStyle(el).fontSize]);
   sizes.forEach(([el,size])=>{el.style.fontSize=(parseFloat(size)*2)+'px';});
  });
  assert.ok(await signIn.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Doubled Sign In text must fit '+width);
  results.push({kind:'sign-in',width,dark,normalAndEnlarged:true});
 }
 requestFails=true;await signIn.getByText('Forgot Password?',{exact:true}).click();await signIn.locator('#recovery-request-form input').fill('fictional-user');await signIn.locator('#recovery-request-form button').click();await signIn.locator('#recovery-message').filter({hasText:'Service unavailable'}).waitFor();assert.ok(await signIn.locator('#recovery-confirm-form').isHidden());
 requestFails=false;await signIn.locator('#recovery-request-form button').click();await signIn.locator('#recovery-confirm-form').waitFor();
 await signIn.locator('#recovery-resend').click();assert.ok(await signIn.locator('#recovery-confirm-form').isHidden());await signIn.locator('#recovery-request-form button').click();await signIn.locator('#recovery-confirm-form').waitFor();
 resetFails=false;await signIn.locator('#recovery-confirm-form input[name="token"]').fill('x'.repeat(64));await signIn.locator('#recovery-confirm-form input[name="password"]').fill('Fictional reset password');await signIn.locator('#recovery-confirm-form button').click();await signIn.locator('#recovery-message').filter({hasText:'Password updated'}).waitFor();assert.ok(await signIn.locator('#recovery-confirm-form').isHidden());assert.equal(await signIn.locator('#recovery-confirm-form input[name="password"]').inputValue(),'');
 assert.ok(requests.every(payload=>Object.keys(payload).length===1&&'username' in payload));await publicContext.close();
 await page.bringToFront();
 for(const width of [1440,1280,390,320])for(const dark of [false,true]){
  await page.setViewportSize({width,height:844});await page.evaluate(dark=>{caffootSetTheme(dark?'dark':'light');switchTab('account');activeAccountSection='about';renderContent();},dark);
  const tagline=page.locator('.account-panel[data-section="about"] .card-head .sub');assert.equal(await tagline.textContent(),'Simplicity in everything.Your infrastructure. Your users. Your data.');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.equal(await page.locator('.account-panel[data-section="about"] .info-row').count(),3);
  if(width===1440||width===390)await page.screenshot({path:path.join(out,`about-approved-${width}-${dark?'dark':'light'}.png`),fullPage:true});
  await page.locator('.account-panel[data-section="about"] .card-head .sub').evaluate(el=>{
   const sizes=[el,...el.querySelectorAll('*')].map(node=>[node,getComputedStyle(node).fontSize]);
   sizes.forEach(([node,size])=>{node.style.fontSize=(parseFloat(size)*2)+'px';});
  });
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Doubled About tagline must fit '+width);
  results.push({kind:'about',width,dark,enlargedTagline:true});
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'approved-owner-batch.json'),JSON.stringify(results,null,2));
 console.log('Approved owner batch passed: rack previews/persistence/scroll, guided verification/recovery, branding and responsive layouts.');
};
