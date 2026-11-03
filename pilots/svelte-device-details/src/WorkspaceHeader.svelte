<script>
  export let workspaceMode = false;
  export let username = '';
  export let sectionTitle = 'Devices';
</script>

<header class="topbar">
  <div class="crumb">
    <span>Caffoot Lite</span><span aria-hidden="true">›</span><b>{sectionTitle}</b>
  </div>
  <div class="top-right">
    {#if workspaceMode}
      <a class="header-account" href="/inventory#account" aria-label="Open My Account in Caffoot Lite">
        <span class="header-account-photo" aria-hidden="true">
          <span class="header-account-initial">{(username || 'A').slice(0,1).toUpperCase()}</span>
        </span>
        <span class="header-account-text">My Account</span>
      </a>
    {:else}
      <a class="header-account" href="/inventory" aria-label="Return to existing Caffoot Lite application">
        <span class="header-account-photo" aria-hidden="true"><span class="header-account-initial">A</span></span>
        <span class="header-account-text">Back to Caffoot Lite</span>
      </a>
    {/if}
  </div>
</header>

<style>
  .topbar { height:64px;border-bottom:1px solid #e1e8ee;background:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(20px,3vw,44px); }
  .crumb { display:flex;align-items:center;gap:10px;font-size:12px;color:#75899a; }
  .crumb b { color:#34526b;font-weight:650; }
  .top-right { display:flex;align-items:center;gap:11px; }
  .header-account { display:inline-flex;align-items:center;gap:10px;border:1px solid #e2eaf0;background:#fff;border-radius:11px;color:#29445e;padding:5px 12px 5px 5px;min-height:42px;font-size:13px;font-weight:750;white-space:nowrap;text-decoration:none; }
  .header-account:hover { border-color:#e6a671;background:#fffaf6; }
  .header-account:focus-visible { outline:3px solid rgba(238,135,55,.33);outline-offset:2px; }
  .header-account-photo { width:32px;height:32px;display:grid;place-items:center;flex-shrink:0;border-radius:50%;overflow:hidden;background:#f6e5d6;color:#a85d25;font-size:14px;font-weight:800; }
  @media(max-width:720px) {
    .topbar { height:54px;padding:0 14px; }
    .header-account { padding:4px;border-radius:50%;min-height:40px; }
    .header-account-text { display:none; }
  }
</style>
