'use strict';
const $=id=>document.getElementById(id);
const signInThemeMedia=typeof matchMedia==='function'?matchMedia('(prefers-color-scheme: dark)'):null;
// Use the same stored Light/Dark/System preference on the public security flow.
function applySignInTheme(){
 let preference='light';
 try {
  preference=localStorage.getItem('caffoot_theme_preference');
  if(!['light','dark','system'].includes(preference))
   preference=localStorage.getItem('caffoot_dark')==='true'?'dark':'light';
 } catch (_) {}
 document.documentElement.classList.toggle('dark',preference==='dark'||
   (preference==='system'&&!!signInThemeMedia?.matches));
}
applySignInTheme();
if(signInThemeMedia?.addEventListener)signInThemeMedia.addEventListener('change',applySignInTheme);
else if(signInThemeMedia?.addListener)signInThemeMedia.addListener(applySignInTheme);
let mode='login';
let setupWelcomeAcknowledged=false;
let csrfToken='';
let signedInUser='';
function showMfaQr(id,uri){
 const holder=$(id);holder.replaceChildren();
 try{
  new QRCode(holder,{text:uri,width:204,height:204,correctLevel:QRCode.CorrectLevel.M});
 }catch(error){
  holder.textContent='QR code unavailable. Use the setup key below.';
 }
}
async function showSession(){
 const r=await fetch('/api/session',{cache:'no-store'});
 if(!r.ok)return false;
 const session=await r.json();csrfToken=session.csrf_token;signedInUser=session.username;
 if(session.can_enter_inventory){
  window.location.replace('/inventory');
  return true;
 }
 $('form').hidden=true;$('signed-in').hidden=false;
 $('intro').textContent='Signed in';
 $('signed-in-message').textContent='Signed in as '+session.username+'.';
 $('account-panel').hidden=!session.is_admin;
 $('mfa-panel').hidden=!!session.mfa_enrolled;
 $('open-inventory').hidden=true;
 if(session.is_admin)await loadUsers();
 return true;
}
async function request(path,data){
 const r=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json',...(csrfToken?{'X-CSRF-Token':csrfToken}:{})},body:JSON.stringify(data)});
 const payload=await r.json();if(!r.ok)throw Error(payload.error||'Request failed');return payload;
}
function display(){
 $('password-recovery').hidden=!['login','login-mfa'].includes(mode);
 if($('password-recovery').hidden){resetRecoveryFlow();$('password-recovery').open=false;}
 const welcomeIsVisible=mode==='setup'&&!setupWelcomeAcknowledged;
 const complete=mode==='complete';
 $('setup-complete').hidden=!complete;
 $('resume-hint').hidden=mode!=='resume';
 for(const id of ['auth-heading','auth-eyebrow','intro'])$(id).hidden=complete;
 const step=mode==='setup'?(welcomeIsVisible?1:2):mode==='enrol'?3:0;
 $('setup-progress').hidden=!step;
 $('setup-step-label').textContent='0'+step+' / 04';
 $('setup-progress').querySelectorAll('.steps-track span').forEach((span,index)=>span.classList.toggle('complete',index<step));
 $('password-confirm-field').hidden=mode!=='setup';
 $('confirm-password').required=mode==='setup';
 $('back-to-welcome').hidden=mode!=='setup';
 $('welcome-flow').hidden=!welcomeIsVisible;
 $('form').hidden=welcomeIsVisible||complete;
 $('credentials').hidden=mode==='enrol'||mode==='login-mfa';
 $('back-to-login').hidden=mode!=='login-mfa';
 $('auth-heading').textContent=welcomeIsVisible?'Welcome to Caffoot Lite':
   mode==='setup'?'Create Your Administrator':
   mode==='enrol'?'Secure Your Account':
   mode==='resume'?'Finish Administrator Setup':
   mode==='login-mfa'?'Verify Your Identity':'Welcome Back';
 $('auth-eyebrow').textContent=mode==='setup'?'First-Time Setup':
   mode==='enrol'||mode==='login-mfa'?'Account security':'Welcome to Caffoot Lite';
 $('message').textContent='';
 $('enrolment').hidden=mode!=='enrol';
 $('code-field').hidden=mode!=='enrol' && mode!=='login-mfa';
 $('intro').textContent=welcomeIsVisible?'Your self-hosted workspace is ready to configure. Two essential steps will secure your first administrator account.':mode==='setup'?'Choose a username and password for your first administrator account. Authenticator enrolment follows.':mode==='enrol'?'Add the administrator account to your authenticator app, then confirm the six-digit code it generates.':mode==='resume'?'Sign in with your administrator credentials to resume MFA enrolment.':mode==='login-mfa'?'Enter the six-digit code from your authenticator app to finish signing in.':'Sign in with your Caffoot Lite account to access your infrastructure workspace.';
 $('submit').textContent=mode==='setup'?'Continue To Authenticator Setup':mode==='enrol'?'Confirm MFA Setup':mode==='resume'?'Continue Enrolment':mode==='login-mfa'?'Verify & Sign In':'Sign In';
 $('password').autocomplete=mode==='setup'?'new-password':'current-password';
 $('code').required=mode==='enrol'||mode==='login-mfa';
}
(async()=>{try{
 if(await showSession())return;
 const r=await fetch('/api/setup/status');if(!r.ok)throw Error('Unable to check setup');
 const status=await r.json();mode=status.setupRequired?'setup':status.enrollmentPending?'resume':'login';display();
}catch(e){$('intro').textContent=e.message}})();
$('get-started').addEventListener('click',()=>{
 setupWelcomeAcknowledged=true;display();$('username').focus();
});
$('back-to-login').addEventListener('click',()=>{
 mode='login';$('code').value='';display();$('username').focus();
});
document.querySelectorAll('[data-reveal]').forEach(button=>{
 button.addEventListener('click',()=>{
  const input=$(button.dataset.reveal);
  input.type=input.type==='password'?'text':'password';
  button.textContent=input.type==='password'?'Show':'Hide';
 });
});
$('username').addEventListener('input',()=>{if(mode==='login-mfa'){mode='login';$('code').value='';display();}});
$('password').addEventListener('input',()=>{if(mode==='login-mfa'){mode='login';$('code').value='';display();}});
$('code').addEventListener('input',()=>{
 if(mode==='login-mfa' && /^[0-9]{6}$/.test($('code').value) && !$('submit').disabled)
   $('form').requestSubmit();
});
$('form').addEventListener('submit',async e=>{
 e.preventDefault();$('submit').disabled=true;$('message').textContent='';
 const data={username:$('username').value,password:$('password').value};
 try{
 if(mode==='setup'){
   if($('password').value!==$('confirm-password').value)throw Error('The passwords do not match.');
   const r=await request('/api/setup',data);$('secret').textContent=r.mfaSecret;mode='enrol';display();showMfaQr('setup-qr',r.mfaUri);
 }else if(mode==='resume'){
   const r=await request('/api/setup/mfa-secret',data);$('secret').textContent=r.mfaSecret;mode='enrol';display();showMfaQr('setup-qr',r.mfaUri);
 }else if(mode==='enrol'){
   await request('/api/setup/mfa',{...data,mfa_code:$('code').value});
   $('code').value='';$('confirm-password').value='';$('secret').replaceChildren();$('setup-qr').replaceChildren();
   mode='complete';display();
 }else{
   try{
     await request('/api/login',{...data,...(mode==='login-mfa'?{mfa_code:$('code').value}:{})});
     if(!await showSession())throw Error('Unable to load session');
   }catch(error){
     if(mode==='login' && error.message==='invalid credentials'){
       mode='login-mfa';display();$('code').focus();
       $('message').textContent='If your account uses an authenticator, enter its code. Otherwise check your username and password.';
     }else throw error;
   }
 }
 }catch(err){$('message').style.color='#b91c1c';$('message').textContent=err.message}
 finally{$('submit').disabled=false}
});

$('start-mfa').addEventListener('submit',async event=>{
 event.preventDefault();try{
  const result=await request('/api/account/mfa/start',{password:$('mfa-password').value});
  $('user-mfa-secret').textContent=result.mfaSecret;$('start-mfa').hidden=true;$('confirm-mfa').hidden=false;showMfaQr('user-mfa-qr',result.mfaUri);
 }catch(error){$('account-message').textContent=error.message}
});
$('confirm-mfa').addEventListener('submit',async event=>{
 event.preventDefault();try{
  await request('/api/account/mfa/confirm',{code:$('user-mfa-code').value});
  csrfToken='';signedInUser='';$('signed-in').hidden=true;mode='login';display();
  $('message').textContent='MFA enrolled. Sign in with your authenticator code.';
 }catch(error){$('account-message').textContent=error.message}
});
async function loadUsers(){
 const r=await fetch('/api/users');if(!r.ok)throw Error('Unable to load users');
 const data=await r.json();const host=$('users-table');host.replaceChildren();
 for(const user of data.users){
  const panel=document.createElement('section');panel.className='panel';
  const heading=document.createElement('h3');heading.textContent=user.username+(user.isAdmin?' (administrator)':'');panel.append(heading);
  const info=document.createElement('p');info.textContent=(user.active?'Active':'Disabled')+' · MFA '+(user.mfaEnrolled?'enrolled':'not enrolled');panel.append(info);
  for(const section of ['Devices','IPAM','Racks']){
   const label=document.createElement('label');label.textContent=section+' ';
   const select=document.createElement('select');
   for(const [value,name] of [['','No access'],['read','Read'],['edit','Edit']]){
    const option=document.createElement('option');option.value=value;option.textContent=name;select.append(option);
   }
   select.value=user.permissions[section]||'';select.disabled=user.isAdmin;
   select.addEventListener('change',()=>adminAction('/api/users/permission',{userId:user.id,section,level:select.value||null}));
   label.append(select);panel.append(label);
  }
  for(const [name,path,field,value] of [[user.active?'Disable':'Enable','/api/users/active','active',!user.active],[user.isAdmin?'Remove admin':'Make admin','/api/users/admin','isAdmin',!user.isAdmin],['Delete','/api/users/delete',null,null]]){
   const button=document.createElement('button');button.className='small secondary';button.textContent=name;
   button.disabled=user.username.toLowerCase()===signedInUser.toLowerCase();
   button.addEventListener('click',()=>{if(name==='Delete'&&!confirm('Delete '+user.username+'?'))return;adminAction(path,{userId:user.id,...(field?{[field]:value}:{})})});panel.append(button);
  }
  host.append(panel);
 }
}
async function adminAction(path,data){
 try{await request(path,data);$('account-message').textContent='Updated successfully';await loadUsers()}
 catch(error){$('account-message').textContent=error.message;try{await loadUsers()}catch(refreshError){$('account-message').textContent+='; '+refreshError.message}}
}
$('create-user').addEventListener('submit',async event=>{
 event.preventDefault();await adminAction('/api/users/create',{username:$('new-username').value,password:$('initial-password').value});$('create-user').reset();
});
$('change-password').addEventListener('submit',async event=>{
 event.preventDefault();try{
  await request('/api/account/password',{currentPassword:$('current-password').value,newPassword:$('new-password').value});
  csrfToken='';signedInUser='';$('signed-in').hidden=true;mode='login';display();$('message').textContent='Password changed. Sign in again.';
 }catch(error){$('account-message').textContent=error.message}
});
$('sign-out').addEventListener('click',async()=>{
 try{
  const r=await fetch('/api/logout',{method:'POST',headers:{'X-CSRF-Token':csrfToken}});
  if(!r.ok)throw Error('Sign out failed');
  csrfToken='';$('signed-in').hidden=true;mode='login';display();
 }catch(e){$('signed-in-message').textContent=e.message}
});

let recoveryRequestVersion=0;
function showRecoveryFeedback(message,focusNext){
 const status=$('recovery-message');status.textContent=message;
 status.scrollIntoView({block:'center',behavior:'auto'});
 if(focusNext)focusNext.focus({preventScroll:true});
}
function resetRecoveryFlow(){
 recoveryRequestVersion++;
 for(const id of ['recovery-request-form','recovery-confirm-form']){
  $(id).reset();$(id).removeAttribute('aria-busy');$(id).querySelector('button[type="submit"]').disabled=false;
 }
 $('recovery-confirm-form').hidden=true;$('recovery-reset-fields').disabled=true;
 $('recovery-request-form').hidden=false;$('recovery-resend').hidden=true;
 $('recovery-message').textContent='';
}
window.addEventListener('pagehide',resetRecoveryFlow);
$('password-recovery').addEventListener('toggle',()=>{if(!$('password-recovery').open)resetRecoveryFlow();});
$('recovery-back').addEventListener('click',()=>{
 resetRecoveryFlow();$('password-recovery').open=false;$('username').focus();
});
$('recovery-resend').addEventListener('click',()=>{
 const username=$('recovery-request-form').elements.username.value;
 resetRecoveryFlow();$('recovery-request-form').elements.username.value=username;
 showRecoveryFeedback('Requesting another code replaces the previous code.',$('recovery-request-form').elements.username);
});
for(const id of ['recovery-request-form','recovery-confirm-form']){
 $(id).addEventListener('submit',async event=>{
  event.preventDefault();
  const form=event.target,button=form.querySelector('button[type="submit"]');
  if(button.disabled)return;
  const version=++recoveryRequestVersion,requesting=id==='recovery-request-form';
  button.disabled=true;form.setAttribute('aria-busy','true');$('recovery-resend').disabled=true;
  showRecoveryFeedback(requesting?'Requesting recovery instructions…':'Checking your recovery code…');
  try{
   const payload=Object.fromEntries(new FormData(form));
   const result=await request(requesting?'/api/recovery/request':'/api/recovery/confirm',payload);
   if(version!==recoveryRequestVersion)return;
   if(requesting){
    // Every neutral response opens the same next step, regardless of account eligibility.
    $('recovery-request-form').hidden=true;
    $('recovery-confirm-form').hidden=false;$('recovery-reset-fields').disabled=false;
    $('recovery-resend').hidden=false;
    showRecoveryFeedback(result.message,$('recovery-confirm-form').elements.token);
   }else{
    form.reset();form.hidden=true;$('recovery-reset-fields').disabled=true;$('recovery-resend').hidden=true;
    showRecoveryFeedback(result.status||result.message,$('recovery-back'));
   }
  }catch(error){
   if(version===recoveryRequestVersion)showRecoveryFeedback(error.message,$('recovery-message'));
  }finally{
   if(version===recoveryRequestVersion){button.disabled=false;form.removeAttribute('aria-busy');$('recovery-resend').disabled=false;}
  }
 });
}

$('back-to-welcome').addEventListener('click',()=>{setupWelcomeAcknowledged=false;display();});
$('setup-continue-sign-in').addEventListener('click',()=>{
 mode='login';$('code').value='';display();$('message').style.color='#166534';$('message').textContent='MFA enrolled. Sign in to continue.';
});
