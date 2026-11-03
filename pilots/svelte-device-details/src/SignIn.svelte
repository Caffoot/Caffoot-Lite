<script>
  import { onMount, tick } from 'svelte';
  import logo from '../../../assets/caffoot-icon-1024.png';
  import './signin-approved.css';

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
      new window.QRCode(qrHolder,{text:mfaUri,width:148,height:148,
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

{#snippet setupSteps(current)}
  <div class="steps">
    <div class="steps-head"><span>First-Time Setup</span><span>0{current} / 04</span></div>
    <div class="steps-track">
      {#each [1,2,3,4] as i}<span class:complete={i<=current}></span>{/each}
    </div>
  </div>
{/snippet}
{#snippet successIcon()}
  <div class="success-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg></div>
{/snippet}
{#snippet arrow()}
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
{/snippet}

<svelte:head>
  <title>Caffoot Lite — Sign In</title>
</svelte:head>
<div class="canvas">
  <main class="auth-shell" aria-label="Caffoot Lite account access">
    <aside class="brand-side" aria-label="Caffoot Lite branding">
      <div class="brand">
        <img class="brand-logo" src={logo} alt="Original Caffoot mascot, upright"/>
        <div><div class="wordmark">Caffoot <span>Lite</span></div><small>INFRASTRUCTURE, SIMPLIFIED.</small></div>
      </div>
      <div class="brand-content">
        <div class="kicker">Your Infrastructure. Your Control.</div>
        <h2>Infrastructure,<span>Simplified.</span></h2>
        <p>A beautifully straightforward home for the devices, networks and racks that matter — self-hosted, secure and entirely yours.</p>
      </div>
      <div class="brand-foot"><span>Self-Hosted</span><span>Open Source</span><span>Your Data</span></div>
    </aside>
    <div class="form-side">
      <div class="form-upper">
        <span class="secure"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg> Secure account access</span>
        <span class="app-version">Caffoot Lite</span>
      </div>
      <div class="form-main">
        {#if mode==='loading'}
          <section class="screen active"><p role="status" class="subtitle">Checking your account…</p></section>
        {:else if mode==='error'}
          <section class="screen active">
            <p class="eyebrow">Account access</p><h1>Unable to Continue</h1>
            <p role="alert" class="status visible">{error}</p>
            <button class="primary" type="button" on:click={initialise}>Try Again</button>
          </section>
        {:else if mode==='welcome'}
          <section class="screen active">
            {@render setupSteps(1)}
            <p class="eyebrow">Let's get you started</p><h1>Welcome to Caffoot Lite</h1>
            <p class="subtitle">Your self-hosted workspace is ready to configure. Two essential steps will secure your first administrator account.</p>
            <div class="welcome-list">
              <div class="welcome-item"><span class="welcome-number">01</span><div><h3>Create Your Administrator</h3><p>Set the credentials for your first administrator.</p></div></div>
              <div class="welcome-item"><span class="welcome-number">02</span><div><h3>Set Up Your Authenticator</h3><p>Confirm your six-digit code to complete enrolment.</p></div></div>
            </div>
            <button class="primary" type="button" on:click={()=>switchTo('create')}>Get Started {@render arrow()}</button>
            <p class="inline-note">First-run setup is available only before the initial administrator is fully configured.</p>
          </section>
        {:else if mode==='create'}
          <section class="screen active">
            {@render setupSteps(2)}
            <p class="eyebrow">Administrator account</p><h1>Create Your Administrator</h1>
            <p class="subtitle">Choose a username and password for your first administrator account. Authenticator enrolment follows.</p>
            <form on:submit|preventDefault={createAdministrator}>
              <div class="form-fields">
                <label class="field">Username <input aria-label="Username" bind:value={username} autocomplete="username" maxlength="256" placeholder="Choose a username" required/></label>
                <label class="field">Password <span class="password-field">
                  <input aria-label="Password" type={showPassword?'text':'password'} bind:value={password} autocomplete="new-password" placeholder="Choose a password" required/>
                  <button class="show-password" type="button" on:click={()=>showPassword=!showPassword}>{showPassword?'Hide':'Show'}</button>
                </span></label>
                <label class="field">Confirm Password <span class="password-field">
                  <input aria-label="Confirm Password" type={showPassword?'text':'password'} bind:value={confirmPassword} autocomplete="new-password" placeholder="Re-enter your password" required/>
                  <button class="show-password" type="button" on:click={()=>showPassword=!showPassword}>{showPassword?'Hide':'Show'}</button>
                </span></label>
              </div>
              {#if error}<p role="alert" class="status visible">{error}</p>{/if}
              <button class="primary" type="submit" disabled={busy}>Continue to Authenticator Setup {@render arrow()}</button>
              <button class="secondary" type="button" on:click={()=>switchTo('welcome')}>← Back</button>
            </form>
          </section>
        {:else if mode==='resume'}
          <section class="screen active">
            <p class="eyebrow">Continue account protection</p><h1>Finish Administrator Setup</h1>
            <p class="subtitle">If authenticator enrolment was interrupted, sign in with the administrator credentials you already created.</p>
            <div class="resume-hint">Your administrator account may already exist. Resume the authenticator setup rather than creating a second administrator.</div>
            <form on:submit|preventDefault={resumeEnrolment}>
              <div class="form-fields">
                <label class="field">Administrator Username <input aria-label="Administrator Username" bind:value={username} autocomplete="username" placeholder="Administrator username" required/></label>
                <label class="field">Password <span class="password-field">
                  <input aria-label="Password" type={showPassword?'text':'password'} bind:value={password} autocomplete="current-password" placeholder="Administrator password" required/>
                  <button class="show-password" type="button" on:click={()=>showPassword=!showPassword}>{showPassword?'Hide':'Show'}</button>
                </span></label>
              </div>
              {#if error}<p role="alert" class="status visible">{error}</p>{/if}
              <button class="primary" type="submit" disabled={busy}>Continue Enrolment {@render arrow()}</button>
            </form>
          </section>
        {:else if mode==='enrol'}
          <section class="screen active">
            {@render setupSteps(3)}
            <p class="eyebrow">Protect your account</p><h1>Secure Your Account</h1>
            <p class="subtitle">Add the administrator account to your authenticator app, then confirm the six-digit code it generates.</p>
            <div class="qr-layout">
              <div class="qr-placeholder" role="img" aria-label="Authenticator setup QR code">
                <div class="qr-live" bind:this={qrHolder}></div>
              </div>
              <div class="qr-copy"><b>Scan with your authenticator</b><p>This QR code is generated by Caffoot Lite for your administrator account. Use the manual setup key if you cannot scan it.</p></div>
            </div>
            <details class="key">
              <summary>Can't scan? Show setup key information</summary>
              <p>Enter this private setup key in your authenticator app:</p>
              <code>{mfaSecret}</code>
            </details>
            <form on:submit|preventDefault={finishEnrolment}>
              <label class="field">Six-Digit Authenticator Code
                <input aria-label="Six-Digit Authenticator Code" class="code-input" bind:value={mfaCode} autocomplete="one-time-code" inputmode="numeric" pattern={'[0-9]{6}'} maxlength="6" placeholder="••••••" required/>
              </label>
              {#if error}<p role="alert" class="status visible">{error}</p>{/if}
              <button class="primary" type="submit" disabled={busy}>Confirm MFA Setup {@render arrow()}</button>
            </form>
            <p class="inline-note">Authenticator enrolment is mandatory for the first administrator.</p>
          </section>
        {:else if mode==='complete'}
          <section class="screen active">
            {@render setupSteps(4)}
            {@render successIcon()}
            <p class="eyebrow">First-Time Setup Complete</p><h1>You're All Set!</h1>
            <p class="subtitle">Your administrator account and authenticator are now ready. Sign in with your credentials to open your workspace.</p>
            <ul class="success-list">
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg> Administrator Account Created</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg> Authenticator Successfully Enrolled</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg> Ready To Sign In</li>
            </ul>
            <button class="primary" type="button" on:click={()=>switchTo('login')}>Continue to Sign In {@render arrow()}</button>
          </section>
        {:else if mode==='signed-in'}
          <section class="screen active">
            <p class="eyebrow">Account access</p><h1>Account Access</h1>
            <p class="subtitle">You're signed in but your account doesn't currently have access to inventory. Existing account tools remain available.</p>
            <a class="primary" href="/setup">Open Existing Account Tools</a>
          </section>
        {:else if mode==='login-mfa'}
          <section class="screen active">
            <p class="eyebrow">Account security</p><h1>Verify Your Identity</h1>
            <p class="subtitle">Enter the six-digit code from your authenticator app to finish signing in.</p>
            <form on:submit|preventDefault={signIn}>
              <label class="field">Authenticator Code
                <input aria-label="Authenticator Code" class="code-input" bind:value={mfaCode} autocomplete="one-time-code" inputmode="numeric" pattern={'[0-9]{6}'} maxlength="6" placeholder="••••••" required/>
              </label>
              {#if error}<p role="alert" class="status visible">{error}</p>{/if}
              <button class="primary" type="submit" disabled={busy}>Verify & Sign In {@render arrow()}</button>
              <button class="secondary" type="button" on:click={()=>switchTo('login')}>← Back to Sign In</button>
            </form>
          </section>
        {:else}
          <section class="screen active">
            <p class="eyebrow">Welcome to Caffoot Lite</p><h1>Welcome Back</h1>
            <p class="subtitle">Sign in with your Caffoot Lite account to access your infrastructure workspace.</p>
            <form on:submit|preventDefault={signIn}>
              <div class="form-fields">
                <label class="field">Username
                  <input aria-label="Username" bind:value={username} maxlength="256" autocomplete="username" placeholder="Enter your username" required/>
                </label>
                <label class="field">Password <span class="password-field">
                  <input aria-label="Password" bind:value={password} type={showPassword?'text':'password'} autocomplete="current-password" placeholder="Enter your password" required/>
                  <button class="show-password" type="button" on:click={()=>showPassword=!showPassword}>{showPassword?'Hide':'Show'}</button>
                </span></label>
              </div>
              {#if error}<p role="alert" class="status visible">{error}</p>{/if}
              <button class="primary" type="submit" disabled={busy}>Sign In {@render arrow()}</button>
            </form>
          </section>
        {/if}
      </div>
      <div class="form-foot"><span>© Caffoot Lite</span><span>Self-hosted infrastructure inventory</span></div>
    </div>
  </main>
</div>
