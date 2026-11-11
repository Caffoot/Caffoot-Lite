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
 if(session.can_enter_inventory){
  window.location.replace('/inventory');
  return true;
 }
 window.location.replace('/account');return true;
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
 const enrolling=mode==='enrol'||mode==='required-enrol';
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
 $('credentials').hidden=enrolling||mode==='login-mfa';
 $('back-to-login').hidden=!['login-mfa','required-enrol'].includes(mode);
 $('auth-heading').textContent=welcomeIsVisible?'Welcome to Caffoot Lite':
   mode==='setup'?'Create Your Administrator':
   enrolling?'Secure Your Account':
   mode==='resume'?'Finish Administrator Setup':
   mode==='login-mfa'?'Verify Your Identity':'Welcome Back';
 $('auth-eyebrow').textContent=mode==='setup'?'First-Time Setup':
   enrolling||mode==='login-mfa'?'Account Security':'Welcome to Caffoot Lite';
 $('message').textContent='';
 $('enrolment').hidden=!enrolling;
 $('enrolment').classList.toggle('required-mfa-enrolment',mode==='required-enrol');
 $('code-field').hidden=!enrolling&&mode!=='login-mfa';
 $('intro').textContent=welcomeIsVisible?'Your self-hosted workspace is ready to configure. Two essential steps will secure your first administrator account.':mode==='setup'?'Choose a username and password for your first administrator account. Authenticator enrolment follows.':mode==='required-enrol'?'Your assigned roles or access require MFA. Add this account to your authenticator, confirm its code, then sign in again.':mode==='enrol'?'Add the administrator account to your authenticator app, then confirm the six-digit code it generates.':mode==='resume'?'Sign in with your administrator credentials to resume MFA enrolment.':mode==='login-mfa'?'Enter the six-digit code from your authenticator app to finish signing in.':'Sign in with your Caffoot Lite account to access your infrastructure workspace.';
 $('submit').textContent=mode==='setup'?'Continue To Authenticator Setup':enrolling?'Confirm MFA Setup':mode==='resume'?'Continue Enrolment':mode==='login-mfa'?'Verify & Sign In':'Sign In';
 $('password').autocomplete=mode==='setup'?'new-password':'current-password';
 $('code').required=enrolling||mode==='login-mfa';
}
(async()=>{try{
 if(await showSession())return;
 const r=await fetch('/api/setup/status');if(!r.ok)throw Error('Unable to check setup');
 const status=await r.json();mode=status.setupRequired?'setup':status.enrollmentPending?'resume':'login';display();
 if(window.location.hash==='#mfa-removed'){
  $('message').style.color='#166534';$('message').textContent='MFA removed. All sessions have ended. Sign in again.';
  history.replaceState(null,'','/setup');
 }
}catch(e){$('intro').textContent=e.message}})();
$('get-started').addEventListener('click',()=>{
 setupWelcomeAcknowledged=true;display();$('username').focus();
});
$('back-to-login').addEventListener('click',()=>{
 clearRequiredMfaDisplay();mode='login';display();$('username').focus();
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
 }else if(mode==='required-enrol'){
   await request('/api/login/mfa/confirm',{...data,mfa_code:$('code').value});
   clearRequiredMfaDisplay();$('password').value='';mode='login';display();
   $('message').style.color='#166534';$('message').textContent='MFA enrolled. Sign in again with your password and authenticator code.';
   $('username').focus();
 }else if(mode==='enrol'){
   await request('/api/setup/mfa',{...data,mfa_code:$('code').value});
   $('code').value='';$('confirm-password').value='';$('secret').replaceChildren();$('setup-qr').replaceChildren();
   mode='complete';display();
 }else{
   try{
     const result=await request('/api/login',{...data,...(mode==='login-mfa'?{mfa_code:$('code').value}:{})});
     if(result.status==='mfa enrolment required'){
       const enrolment=await request('/api/login/mfa/start',data);
       mode='required-enrol';$('code').value='';display();
       $('secret').textContent=enrolment.mfaSecret;showMfaQr('setup-qr',enrolment.mfaUri);$('code').focus();return;
     }
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
function showRecoveryFeedback(message,focusNext){
 const status=$('recovery-message');status.textContent=message;
 status.scrollIntoView({block:'center',behavior:'auto'});
 if(focusNext)focusNext.focus({preventScroll:true});
}
function resetRecoveryFlow(){
 recoveryRequestVersion++;recoveryChallengeId='';
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
   if(!requesting){payload.challengeId=recoveryChallengeId;payload.token=payload.token.trim();}
   const result=await request(requesting?'/api/recovery/request':'/api/recovery/confirm',payload);
   if(version!==recoveryRequestVersion)return;
   if(requesting){
    recoveryChallengeId=result.challengeId;
    // Every neutral response opens the same next step, regardless of account eligibility.
    $('recovery-request-form').hidden=true;
    $('recovery-confirm-form').hidden=false;$('recovery-reset-fields').disabled=false;
    $('recovery-resend').hidden=false;
    showRecoveryFeedback(result.message,$('recovery-confirm-form').elements.token);
   }else{
    form.reset();recoveryChallengeId='';form.hidden=true;$('recovery-reset-fields').disabled=true;$('recovery-resend').hidden=true;
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

// Clear the displayed key when an existing-account enrolment is left or completed.
function clearRequiredMfaDisplay(){
 $('code').value='';$('secret').replaceChildren();$('setup-qr').replaceChildren();
}
window.addEventListener('pagehide',()=>{clearRequiredMfaDisplay();$('password').value='';});
