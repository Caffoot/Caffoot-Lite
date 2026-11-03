<script>
  import { onMount, tick } from 'svelte';
  import logo from '../../../assets/caffoot-logo-256.png';

  let mode = 'loading';
  let username = '';
  let password = '';
  let confirmPassword = '';
  let mfaCode = '';
  let mfaSecret = '';
  let mfaUri = '';
  let error = '';
  let success = '';
  let busy = false;
  let showPassword = false;
  let qrHolder;
  const destination = '/workspace/dashboard/';

  onMount(() => { void initialise(); });

  async function api(url, payload) {
    const response=await fetch(url,{
      method:'POST',credentials:'same-origin',
      headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)
    });
    const result=await response.json().catch(()=>({}));
    if (!response.ok) throw new Error(result.error || 'We could not complete that request.');
    return result;
  }

  async function initialise() {
    error='';
    try {
      const session=await fetch('/api/session',{credentials:'same-origin',cache:'no-store'});
      if (session.ok) {
        const state=await session.json();
        if (state.can_enter_inventory) {
          window.location.replace(destination);
          return;
        }
        mode='signed-in';
        return;
      }
      const response=await fetch('/api/setup/status',{credentials:'same-origin',cache:'no-store'});
      if (!response.ok) throw new Error('Unable to check the first-run setup status.');
      const status=await response.json();
      mode=status.setupRequired?'welcome':status.enrollmentPending?'resume':'login';
    } catch (caught) {
      error=caught.message || 'Unable to load Sign In.';
      mode='error';
    }
  }

  function switchTo(next) {
    mode=next;
    error='';
    success='';
    mfaCode='';
    showPassword=false;
  }

  async function renderQr() {
    await tick();
    if (!qrHolder || !mfaUri || typeof window.QRCode!=='function') return;
    qrHolder.replaceChildren();
    try {
      new window.QRCode(qrHolder,{text:mfaUri,width:184,height:184,
        correctLevel:window.QRCode.CorrectLevel.M});
    } catch (_) {
      qrHolder.textContent='Use the setup key below if the QR code is unavailable.';
    }
  }

  async function createAdministrator() {
    if (password !== confirmPassword) {
      error='Passwords do not match.';
      return;
    }
    busy=true;error='';
    try {
      const result=await api('/api/setup',{username,password});
      mfaSecret=result.mfaSecret || '';
      mfaUri=result.mfaUri || '';
      mode='enrol';
      await renderQr();
    } catch(caught) {
      error=caught.message;
    } finally {busy=false;}
  }

  async function resumeEnrolment() {
    busy=true;error='';
    try {
      const result=await api('/api/setup/mfa-secret',{username,password});
      mfaSecret=result.mfaSecret || '';
      mfaUri=result.mfaUri || '';
      mode='enrol';
      await renderQr();
    } catch(caught) {
      error=caught.message;
    } finally {busy=false;}
  }

  async function finishEnrolment() {
    busy=true;error='';
    try {
      await api('/api/setup/mfa',{username,password,mfa_code:mfaCode});
      password='';confirmPassword='';mfaCode='';mfaSecret='';mfaUri='';
      mode='complete';
    } catch(caught) {
      error=caught.message;
    } finally {busy=false;}
  }

  async function signIn() {
    busy=true;error='';
    try {
      await api('/api/login',{username,password,
        ...(mode==='login-mfa'?{mfa_code:mfaCode}:{})});
      const response=await fetch('/api/session',{credentials:'same-origin',cache:'no-store'});
      if (!response.ok) throw new Error('Your session could not be confirmed.');
      const session=await response.json();
      password='';mfaCode='';
      if (session.can_enter_inventory) {
        window.location.replace(destination);
      } else {
        mode='signed-in';
      }
    } catch(caught) {
      if (mode==='login' && caught.message==='invalid credentials') {
        mode='login-mfa';
        error='If your account uses an authenticator, enter its code. Otherwise check your username and password.';
      } else {
        error=caught.message;
      }
    } finally {busy=false;}
  }
</script>

<svelte:head>
  <title>Caffoot Lite — Sign In</title>
</svelte:head>

<div class="signin-shell">
  <aside class="signin-brand">
    <div class="signin-logo"><img src={logo} alt="Caffoot Lite hedgehog logo"/><span>Caffoot <b>Lite</b></span></div>
    <div class="signin-brand-content">
      <p class="kicker">YOUR INFRASTRUCTURE. YOUR CONTROL.</p>
      <h2>Infrastructure,<br/><span>Simplified.</span></h2>
      <p>A beautifully straightforward home for the devices, networks and racks that matter — self-hosted, secure and entirely yours.</p>
    </div>
    <p class="signin-foot">CAFFOOT LITE · SELF-HOSTED INVENTORY</p>
  </aside>

  <main class="signin-main">
    <div class="signin-form-wrap">
      {#if mode==='loading'}
        <p role="status">Checking your account…</p>
      {:else if mode==='error'}
        <h1>Unable to Continue</h1>
        <p role="alert">{error}</p>
        <button class="primary" on:click={initialise}>Try Again</button>
      {:else if mode==='welcome'}
        <div class="steps">FIRST-TIME SETUP · STEP 1 OF 4</div>
        <p class="eyebrow">Let's get you started</p>
        <h1>Welcome to Caffoot Lite</h1>
        <p class="subtitle">Your self-hosted workspace is ready to configure. Two essential steps will secure your first administrator account.</p>
        <div class="welcome-steps">
          <div><strong>01</strong><span><b>Create Your Administrator</b><small>Choose your first account credentials.</small></span></div>
          <div><strong>02</strong><span><b>Set Up Your Authenticator</b><small>Confirm your six-digit code to protect the account.</small></span></div>
        </div>
        <button class="primary" on:click={()=>switchTo('create')}>Get Started</button>
      {:else if mode==='create'}
        <div class="steps">FIRST-TIME SETUP · STEP 2 OF 4</div>
        <p class="eyebrow">Administrator account</p>
        <h1>Create Your Administrator</h1>
        <p class="subtitle">Choose the credentials for your first administrator account. Authenticator enrolment follows.</p>
        <form on:submit|preventDefault={createAdministrator}>
          <label>Username <input bind:value={username} autocomplete="username" maxlength="256" required/></label>
          <label>Password <input type={showPassword?'text':'password'} bind:value={password}
            autocomplete="new-password" required/></label>
          <label>Confirm Password <input type={showPassword?'text':'password'} bind:value={confirmPassword}
            autocomplete="new-password" required/></label>
          <button class="reveal" type="button" on:click={()=>showPassword=!showPassword}>
            {showPassword?'Hide Passwords':'Show Passwords'}</button>
          {#if error}<p role="alert" class="error">{error}</p>{/if}
          <button class="primary" type="submit" disabled={busy}>Continue to Authenticator Setup</button>
          <button class="secondary" type="button" on:click={()=>switchTo('welcome')}>Back</button>
        </form>
      {:else if mode==='resume'}
        <div class="steps">FIRST-TIME SETUP · RECOVERY</div>
        <p class="eyebrow">Continue account protection</p>
        <h1>Finish Administrator Setup</h1>
        <p class="subtitle">If setup was interrupted, sign in with your administrator credentials to continue authenticator enrolment.</p>
        <form on:submit|preventDefault={resumeEnrolment}>
          <label>Administrator Username <input bind:value={username} autocomplete="username" required/></label>
          <label>Password <input bind:value={password} type={showPassword?'text':'password'} autocomplete="current-password" required/></label>
          <button class="reveal" type="button" on:click={()=>showPassword=!showPassword}>{showPassword?'Hide Password':'Show Password'}</button>
          {#if error}<p role="alert" class="error">{error}</p>{/if}
          <button class="primary" type="submit" disabled={busy}>Continue Enrolment</button>
        </form>
      {:else if mode==='enrol'}
        <div class="steps">FIRST-TIME SETUP · STEP 3 OF 4</div>
        <p class="eyebrow">Protect your account</p>
        <h1>Secure Your Account</h1>
        <p class="subtitle">Scan this code with your authenticator app, or enter the setup key manually.</p>
        <div class="qr-frame" bind:this={qrHolder} aria-label="Authenticator setup QR code"></div>
        <div class="secret"><small>Manual Setup Key</small><code>{mfaSecret}</code></div>
        <form on:submit|preventDefault={finishEnrolment}>
          <label>Six-Digit Authenticator Code
            <input bind:value={mfaCode} autocomplete="one-time-code" inputmode="numeric"
              pattern={'[0-9]{6}'} maxlength="6" required/></label>
          {#if error}<p role="alert" class="error">{error}</p>{/if}
          <button class="primary" type="submit" disabled={busy}>Confirm MFA Setup</button>
        </form>
      {:else if mode==='complete'}
        <div class="steps">FIRST-TIME SETUP · STEP 4 OF 4</div>
        <p class="eyebrow">First-time setup complete</p>
        <h1>You're All Set!</h1>
        <p class="subtitle">Your administrator account is ready. Sign in with your username, password and authenticator to enter Caffoot Lite.</p>
        <button class="primary" on:click={()=>switchTo('login')}>Return to Sign In</button>
      {:else if mode==='signed-in'}
        <p class="eyebrow">You're signed in</p>
        <h1>Account Access</h1>
        <p class="subtitle">Your account is signed in but doesn't currently have access to the inventory. You can still use the established account tools.</p>
        <a class="primary link" href="/setup">Open Existing Account Tools</a>
      {:else}
        <p class="eyebrow">{mode==='login-mfa'?'Account security':'Welcome to Caffoot Lite'}</p>
        <h1>{mode==='login-mfa'?'Verify Your Identity':'Welcome Back'}</h1>
        <p class="subtitle">{mode==='login-mfa'?
          'Enter the six-digit code from your authenticator app to finish signing in.':
          'Sign in with your Caffoot Lite account to access your infrastructure workspace.'}</p>
        <form on:submit|preventDefault={signIn}>
          <label>Username <input bind:value={username} autocomplete="username" required
            on:input={()=>{if(mode==='login-mfa')switchTo('login');}}/></label>
          <label>Password <input bind:value={password} type={showPassword?'text':'password'}
            autocomplete="current-password" required
            on:input={()=>{if(mode==='login-mfa')switchTo('login');}}/></label>
          <button type="button" class="reveal" on:click={()=>showPassword=!showPassword}>
            {showPassword?'Hide Password':'Show Password'}</button>
          {#if mode==='login-mfa'}
            <label>Authenticator Code
              <input bind:value={mfaCode} autocomplete="one-time-code" inputmode="numeric"
                pattern={'[0-9]{6}'} maxlength="6" required/></label>
          {/if}
          {#if error}<p role="alert" class="error">{error}</p>{/if}
          {#if success}<p role="status" class="success">{success}</p>{/if}
          <button class="primary" type="submit" disabled={busy}>
            {mode==='login-mfa'?'Verify & Sign In':'Sign In'}</button>
          {#if mode==='login-mfa'}
            <button class="secondary" type="button" on:click={()=>switchTo('login')}>Back to Sign In</button>
          {/if}
        </form>
      {/if}
    </div>
    <div class="signin-mobile-foot">Caffoot Lite · Infrastructure, Simplified.</div>
  </main>
</div>

<style>
  :global(:root) { font-family:'Inter Variable',Inter,system-ui,sans-serif; color:#223b53; background:#f5f7fa; }
  :global(*) { box-sizing:border-box; }
  :global(body) { margin:0; }
  :global(button), :global(input) { font:inherit; }
  :global(:focus-visible) { outline:3px solid #f3a36d; outline-offset:3px; }
  .signin-shell { min-height:100vh; display:grid; grid-template-columns:minmax(350px,46%) minmax(0,1fr); }
  .signin-brand { background:linear-gradient(130deg,#142b43,#203e5b); color:#fff; padding:45px clamp(28px,4vw,65px);
    display:flex; flex-direction:column; min-width:0; }
  .signin-logo { display:flex; align-items:center; gap:12px; font-size:21px; font-weight:750; letter-spacing:-.65px; }
  .signin-logo img { width:50px; height:50px; border-radius:12px; }
  .signin-logo b { color:#ffac6c; }
  .signin-brand-content { margin:auto 0; }
  .signin-brand-content .kicker { color:#ec9a59; font-size:11px; font-weight:850; letter-spacing:.13em; }
  .signin-brand-content h2 { font-size:clamp(36px,4vw,58px); line-height:1.08; letter-spacing:-1.8px; margin:17px 0 22px; font-weight:790; }
  .signin-brand-content h2 span { color:#f4a15e; }
  .signin-brand-content>p:last-child { color:#bdd0df; max-width:420px; line-height:1.8; font-size:14px; }
  .signin-foot { color:#8ba8bf; font-size:10px; letter-spacing:.12em; }
  .signin-main { background:#f8fafc; display:flex; flex-direction:column; justify-content:center; align-items:center; padding:35px 24px; }
  .signin-form-wrap { background:#fff; border:1px solid #e1e8ee; border-radius:19px; width:min(100%,510px);
    padding:clamp(24px,4vw,45px); box-shadow:0 15px 48px rgba(28,52,77,.06); }
  .eyebrow { color:#d27931; font-size:10px; font-weight:850; letter-spacing:.16em; text-transform:uppercase; margin:0 0 11px; }
  h1 { font-weight:790; letter-spacing:-1.1px; color:#1f3850; font-size:32px; margin:0 0 12px; line-height:1.15; }
  .subtitle { color:#697f94; font-size:14px; line-height:1.7; margin:0 0 24px; }
  form { display:grid; gap:14px; }
  label { display:grid; gap:8px; color:#395770; font-size:12.5px; font-weight:700; }
  input { background:#fff; border:1px solid #d1dce5; border-radius:10px; color:#223b53;
    padding:12px 13px; min-width:0; width:100%; font-size:14px; }
  input:focus { border-color:#e18c47; outline:3px solid #fff0e2; }
  button { cursor:pointer; border-radius:9px; border:0; font-weight:750; }
  button:disabled { opacity:.55; cursor:wait; }
  .primary { display:flex; justify-content:center; align-items:center; padding:13px 17px; background:#ed8532;
    color:white; font-size:13px; text-decoration:none; min-height:44px; width:100%; margin-top:9px; }
  .primary:hover { background:#d87327; }
  .secondary { padding:11px; background:#f2f5f8; color:#3d5970; font-size:12px; }
  .reveal { justify-self:end; padding:4px; color:#b56732; font-size:12px; background:none; margin-top:-8px; }
  .steps { color:#8da0af; font-size:11px; font-weight:750; letter-spacing:.10em; margin:0 0 30px; }
  .welcome-steps { display:grid; gap:15px; margin:25px 0; }
  .welcome-steps div { display:flex; gap:15px; align-items:center; border:1px solid #e7edf2; border-radius:12px; padding:15px; }
  .welcome-steps strong { background:#eaf1f7; color:#4e718a; padding:9px; border-radius:9px; }
  .welcome-steps span { display:grid; gap:5px; }
  .welcome-steps b { font-size:13px; }
  .welcome-steps small { color:#74899e; line-height:1.5; }
  .error { padding:11px 13px; color:#9b3333; background:#fff2f0; border-radius:8px; font-size:12px; line-height:1.5; }
  .success { color:#367658; }
  .qr-frame { display:flex; justify-content:center; background:#fff; min-height:202px; padding:9px;
    width:max-content; max-width:100%; margin:10px auto; border:1px solid #e3e9ef; border-radius:12px; }
  .secret { display:grid; gap:8px; padding:13px; border-radius:9px; background:#f2f6f9; margin:15px 0; }
  .secret small { color:#718a9d; }
  .secret code { overflow-wrap:anywhere; font-size:12px; color:#294a65; }
  .signin-mobile-foot { display:none; }
  @media(max-width:900px) {
    .signin-shell { grid-template-columns:1fr; }
    .signin-brand { padding:22px; }
    .signin-brand-content,.signin-foot { display:none; }
    .signin-main { flex:1; padding:30px 15px; }
    .signin-mobile-foot { display:block; color:#8b9daf; margin-top:17px; font-size:11px; }
  }
  @media(max-width:480px) { .signin-form-wrap { padding:22px 17px; } h1 { font-size:27px; } }
</style>
