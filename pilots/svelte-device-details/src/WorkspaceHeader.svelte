<script>
  export let workspaceMode = false;
  export let username = '';
  export let sectionTitle = 'Devices';
</script>

<header class="topbar">
  <div class="breadcrumb">Workspace <span aria-hidden="true">›</span> <strong>{sectionTitle}</strong></div>
  {#if workspaceMode}
    <a class="account" href="/inventory#account" aria-label="Open My Account in Caffoot Lite">
      <span class="avatar" aria-hidden="true">{(username || 'A').slice(0,1).toUpperCase()}</span>
      <span class="account-label">My Account</span>
    </a>
  {:else}
    <a class="account" href="/inventory" aria-label="Return to existing Caffoot Lite application">
      <span class="avatar" aria-hidden="true">A</span>
      <span class="account-label">Back to Caffoot Lite</span>
    </a>
  {/if}
</header>

<style>
  .account { text-decoration: none; border-radius: 9px; padding: 6px; }
  .account:hover { background: #f0f4f8; }
  .account:focus-visible { outline: 3px solid #ef9b58; outline-offset: 2px; }
</style>
