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
let pendingCredentials=null;
let passwordChangeProof='';
const neutralSignInFailure='Unable to sign in. Please check your credentials or contact your administrator.';
function clearPasswordField(id){
 $(id).value='';$(id).type='password';
 document.querySelector('[data-reveal="'+id+'"]').textContent='Show';
}
function clearPasswordChange(){
 passwordChangeProof='';clearPasswordField('new-password');clearPasswordField('confirm-new-password');
}
function showMfaQr(id,uri){
 const holder=$(id);holder.replaceChildren();
 try{
  new QRCode(holder,{text:uri,width:204,height:204,correctLevel:QRCode.CorrectLevel.M});
  const image=holder.querySelector('img');if(image)image.alt='Authenticator Setup QR Code';
 }catch(error){
  holder.textContent='QR code unavailable. Use the setup key below.';
 }
}
async function showSession(){
 const r=await fetch('/api/session',{cache:'no-store'});
 if(!r.ok)return false;
 const session=await r.json();csrfToken=session.csrf_token;
 const ticket=/^\?ticket=(it|personal|department)-[1-9]\d{0,18}$/.exec(window.location.search);
 if(ticket && ticket[1]!=='it'){
  window.location.replace('/account'+ticket[0]);
  return true;
 }
 if(session.can_enter_workspace || session.can_enter_inventory){
  window.location.replace('/inventory'+(ticket?.[0]||''));
  return true;
 }
 window.location.replace('/account');return true;
}
async function request(path,data){
 const r=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json',...(csrfToken?{'X-CSRF-Token':csrfToken}:{})},body:JSON.stringify(data)});
 const payload=await r.json();
 if(!r.ok)throw Object.assign(Error(payload.error||'Request failed'),{code:payload.code});
 return payload;
}
function display(){
 $('password-recovery').hidden=!['login','login-mfa'].includes(mode);
 if($('password-recovery').hidden){resetRecoveryFlow();$('password-recovery').open=false;}
 const welcomeIsVisible=mode==='setup'&&!setupWelcomeAcknowledged;
 const complete=mode==='complete';
 const enrolling=mode==='enrol'||mode==='required-enrol';
 const changingPassword=mode==='change-password';
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
 $('credentials').hidden=enrolling||mode==='login-mfa'||changingPassword;
 $('username').required=$('password').required=!$('credentials').hidden;
 $('change-password-fields').hidden=!changingPassword;
 $('new-password').required=$('confirm-new-password').required=changingPassword;
 $('back-to-login').hidden=!['login-mfa','required-enrol','change-password'].includes(mode);
 $('auth-heading').textContent=welcomeIsVisible?'Welcome to Caffoot Lite':
   mode==='setup'?'Create Your Administrator':
   enrolling?'Secure Your Account':
   mode==='resume'?'Finish Administrator Setup':
   changingPassword?'Change Your Password':
   mode==='login-mfa'?'Verify Your Identity':'Welcome Back';
 $('auth-eyebrow').textContent=mode==='setup'?'First-Time Setup':
   enrolling||mode==='login-mfa'||changingPassword?'Account Security':'Welcome to Caffoot Lite';
 $('message').textContent='';
 $('message').classList.remove('good');
 $('enrolment').hidden=!enrolling;
 $('enrolment').classList.toggle('required-mfa-enrolment',mode==='required-enrol');
 $('code-field').hidden=!enrolling&&mode!=='login-mfa';
 $('intro').textContent=welcomeIsVisible?'Your self-hosted workspace is ready to configure. Two essential steps will secure your first administrator account.':mode==='setup'?'Choose a username and password for your first administrator account. Authenticator enrolment follows.':mode==='required-enrol'?'Your assigned roles or access require MFA. Add this account to your authenticator, confirm its code, then sign in again.':mode==='enrol'?'Add the administrator account to your authenticator app, then confirm the six-digit code it generates.':mode==='resume'?'Sign in with your administrator credentials to resume MFA enrolment.':mode==='login-mfa'?'Enter the six-digit code from your authenticator app to finish signing in.':changingPassword?'Your administrator has reset your password. Choose a new password before you can access Caffoot Lite.':'Sign in with your Caffoot Lite account to access your infrastructure workspace.';
 $('submit').textContent=mode==='setup'?'Continue To Authenticator Setup':enrolling?'Confirm MFA Setup':mode==='resume'?'Continue Enrolment':mode==='login-mfa'?'Verify & Sign In':changingPassword?'Change Password':'Sign In';
 $('password').autocomplete=mode==='setup'?'new-password':'current-password';
 $('code').required=enrolling||mode==='login-mfa';
}
(async()=>{try{
 if(await showSession())return;
 const r=await fetch('/api/setup/status');if(!r.ok)throw Error('Unable to check setup');
 const status=await r.json();mode=status.setupRequired?'setup':status.enrollmentPending?'resume':'login';display();
 if(mode==='login' && window.location.hash==='#session-ended'){
  const heading=document.createElement('strong');
  heading.textContent='Your Session Has Ended';
  $('message').replaceChildren(heading,document.createElement('br'),
   document.createTextNode('Your session has ended. Please sign in again to continue using Caffoot Lite.'));
  history.replaceState(null,'','/setup'+window.location.search);
 }else if(mode==='login' && window.location.hash==='#sign-in-required'){
  $('message').textContent='Please sign in to continue using Caffoot Lite.';
  history.replaceState(null,'','/setup'+window.location.search);
 }
 if(window.location.hash==='#mfa-removed'){
  $('message').classList.add('good');$('message').textContent='MFA removed. All sessions have ended. Sign in again.';
  history.replaceState(null,'','/setup');
 }
}catch(e){$('intro').textContent=e.message}})();
$('get-started').addEventListener('click',()=>{
 setupWelcomeAcknowledged=true;display();$('username').focus();
});
$('back-to-login').addEventListener('click',()=>{
 pendingCredentials=null;clearPasswordField('password');clearPasswordChange();clearRequiredMfaDisplay();mode='login';display();$('username').focus();
});
document.querySelectorAll('[data-reveal]').forEach(button=>{
 button.addEventListener('click',()=>{
  const input=$(button.dataset.reveal);
  input.type=input.type==='password'?'text':'password';
  button.textContent=input.type==='password'?'Show':'Hide';
 });
});
$('code').addEventListener('input',()=>{
 if(mode==='login-mfa' && /^[0-9]{6}$/.test($('code').value) && !$('submit').disabled)
   $('form').requestSubmit();
});
$('form').addEventListener('submit',async e=>{
 e.preventDefault();
 if($('submit').disabled)return;
 $('submit').disabled=$('back-to-login').disabled=true;$('message').textContent='';$('message').classList.remove('good');
 const data=pendingCredentials||{username:$('username').value,password:$('password').value};
 try{
 if(mode==='setup'){
   if($('password').value!==$('confirm-password').value)throw Error('The passwords do not match.');
   const r=await request('/api/setup',data);$('secret').textContent=r.mfaSecret;mode='enrol';display();showMfaQr('setup-qr',r.mfaUri);
 }else if(mode==='resume'){
   const r=await request('/api/setup/mfa-secret',data);$('secret').textContent=r.mfaSecret;mode='enrol';display();showMfaQr('setup-qr',r.mfaUri);
 }else if(mode==='required-enrol'){
   await request('/api/login/mfa/confirm',{...data,mfa_code:$('code').value});
   pendingCredentials=null;clearRequiredMfaDisplay();clearPasswordField('password');mode='login';display();
   $('message').classList.add('good');$('message').textContent='MFA enrolled. Sign in again with your password and authenticator code.';
   $('username').focus();
 }else if(mode==='enrol'){
   await request('/api/setup/mfa',{...data,mfa_code:$('code').value});
   $('code').value='';$('confirm-password').value='';$('secret').replaceChildren();$('setup-qr').replaceChildren();
   mode='complete';display();
 }else if(mode==='change-password'){
   const password=$('new-password').value,confirmation=$('confirm-new-password').value;
   if(password!==confirmation){$('confirm-new-password').focus();throw Error('The passwords do not match.');}
   try{
     await request('/api/login/change-password',{proof:passwordChangeProof,password,confirmation});
   }catch(error){
     if(error.code==='password_change_expired'){
       clearPasswordChange();mode='login';display();$('password').focus();
     }else $('new-password').focus();
     throw error;
   }
   clearPasswordChange();mode='login';display();$('password').focus();
   $('message').classList.add('good');$('message').textContent='Password changed successfully. Sign in again with your new password.';
 }else{
   try{
     const result=await request('/api/login',{...data,...(mode==='login-mfa'?{mfa_code:$('code').value}:{})});
     if(result.status==='mfa enrolment required'){
       const enrolment=await request('/api/login/mfa/start',data);
       pendingCredentials=data;clearPasswordField('password');
       mode='required-enrol';$('code').value='';display();
       $('secret').textContent=enrolment.mfaSecret;showMfaQr('setup-qr',enrolment.mfaUri);$('code').focus();return;
     }
     pendingCredentials=null;clearPasswordField('password');$('code').value='';
     if(result.status==='password change required'){
       passwordChangeProof=result.proof;mode='change-password';display();$('new-password').focus();return;
     }
     if(!await showSession())throw Error('Unable to load session');
   }catch(error){
     if(mode==='login' && error.code==='mfa_required'){
       pendingCredentials=data;clearPasswordField('password');
       mode='login-mfa';display();$('code').focus();
       return;
     }
     if(mode==='login'){
       clearPasswordField('password');$('password').focus();
     }else if(mode==='login-mfa'){
       $('code').value='';$('code').focus();
     }
     throw error.message==='invalid credentials'?Error(neutralSignInFailure):error;
   }
 }
 }catch(err){$('message').textContent=err.message}
 finally{$('submit').disabled=$('back-to-login').disabled=false}
});

// Trim pasted padding before the browser applies the eight-character limit.
$('recovery-confirm-form').elements.token.addEventListener('paste',event=>{
 const code=event.clipboardData?.getData('text').trim();
 if(/^[0-9]{8}$/.test(code||'')){
  event.preventDefault();event.target.value=code;
  event.target.dispatchEvent(new Event('input',{bubbles:true}));
 }
});
let recoveryRequestVersion=0;
let recoveryChallengeId='';
function showRecoveryFeedback(message,focusNext,rejected=false){
 const status=$('recovery-message');status.classList.toggle('status',rejected);status.textContent=message;
 status.scrollIntoView({block:'center',behavior:'auto'});
 if(focusNext)focusNext.focus({preventScroll:true});
}
function resetRecoveryFlow(){
 recoveryRequestVersion++;recoveryChallengeId='';
 for(const id of ['recovery-request-form','recovery-confirm-form']){
  $(id).reset();$(id).removeAttribute('aria-busy');$(id).querySelector('button[type="submit"]').disabled=false;
 }
 $('recovery-confirm-form').hidden=true;$('recovery-reset-fields').disabled=true;
 $('recovery-request-form').hidden=false;$('recovery-resend').hidden=true;$('recovery-resend').disabled=false;
 $('recovery-heading').textContent='Request a Recovery Code';
 $('recovery-guidance').hidden=false;$('recovery-reset-guidance').hidden=true;
 $('recovery-message').classList.remove('status');$('recovery-message').textContent='';
}
window.addEventListener('pagehide',resetRecoveryFlow);
$('password-recovery').addEventListener('toggle',()=>{
 if($('password-recovery').open){
  $('recovery-request-form').elements.username.focus();
 }else{
  resetRecoveryFlow();
 }
});
$('recovery-back').addEventListener('click',()=>{
 resetRecoveryFlow();$('password-recovery').open=false;$(mode==='login-mfa'?'code':'username').focus();
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
  const requesting=id==='recovery-request-form';
  if(!requesting){
   const {password,confirmPassword}=form.elements;
   if(!password.value||!confirmPassword.value){
    showRecoveryFeedback('Enter and confirm your new password.',password.value?confirmPassword:password);
    return;
   }
   if(password.value!==confirmPassword.value){
    showRecoveryFeedback('The new passwords do not match.',confirmPassword);
    return;
   }
  }
  const version=++recoveryRequestVersion;
  button.disabled=true;form.setAttribute('aria-busy','true');$('recovery-resend').disabled=true;
  showRecoveryFeedback(requesting?'Requesting recovery instructions…':'Checking your recovery code…');
  try{
   const payload=Object.fromEntries(new FormData(form));
   if(!requesting){
    delete payload.confirmPassword;
    payload.challengeId=recoveryChallengeId;payload.token=payload.token.trim();
   }
   const result=await request(requesting?'/api/recovery/request':'/api/recovery/confirm',payload);
   if(version!==recoveryRequestVersion)return;
   if(requesting){
    recoveryChallengeId=result.challengeId;
    // Every neutral response opens the same next step, regardless of account eligibility.
    $('recovery-request-form').hidden=true;
    $('recovery-confirm-form').hidden=false;$('recovery-reset-fields').disabled=false;
    $('recovery-resend').hidden=false;
    $('recovery-heading').textContent='Reset Your Password';
    $('recovery-guidance').hidden=true;$('recovery-reset-guidance').hidden=false;
    showRecoveryFeedback(result.message,$('recovery-confirm-form').elements.token);
   }else{
    form.reset();recoveryChallengeId='';form.hidden=true;$('recovery-reset-fields').disabled=true;$('recovery-resend').hidden=true;
    $('recovery-heading').textContent='Password Updated';
    $('recovery-reset-guidance').hidden=true;
    showRecoveryFeedback(result.status||result.message,$('recovery-back'));
   }
  }catch(error){
   if(version===recoveryRequestVersion)showRecoveryFeedback(error.message,$('recovery-message'),!requesting);
  }finally{
   if(version===recoveryRequestVersion){button.disabled=false;form.removeAttribute('aria-busy');$('recovery-resend').disabled=false;}
  }
 });
}

$('back-to-welcome').addEventListener('click',()=>{setupWelcomeAcknowledged=false;display();});
$('setup-continue-sign-in').addEventListener('click',()=>{
 mode='login';$('code').value='';display();$('message').classList.add('good');$('message').textContent='MFA enrolled. Sign in to continue.';
});

// Clear the displayed key when an existing-account enrolment is left or completed.
function clearRequiredMfaDisplay(){
 $('code').value='';$('secret').replaceChildren();$('setup-qr').replaceChildren();
}
window.addEventListener('pagehide',()=>{pendingCredentials=null;clearRequiredMfaDisplay();clearPasswordField('password');clearPasswordChange();});
