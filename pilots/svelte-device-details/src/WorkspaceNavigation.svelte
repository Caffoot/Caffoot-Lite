<script>
  import logoUrl from '../../../assets/caffoot-logo-256.png';

  export let collapsed = false;
  export let workspaceMode = false;
  export let sections = {};
  export let isAdmin = false;
  export let activeSection = 'devices';
  export let onToggle = () => {};

  // Until each Svelte section is complete, link to the real working v2.0.3 screen.
  const items = [
    {id:'dashboard', label:'Dashboard', icon:'▦', href:'/workspace/dashboard/'},
    {id:'devices', label:'Devices', icon:'▣', href:'/workspace/', permission:'Devices'},
    {id:'ipam', label:'IPAM', icon:'⌘', href:'/inventory#ipam', permission:'IPAM'},
    {id:'racks', label:'Network Racks', icon:'▤', href:'/inventory#racks', permission:'Racks'},
    {id:'audit', label:'Audit Trail', icon:'◷', href:'/inventory#audit'},
    {id:'users', label:'Users', icon:'♙', href:'/inventory#users', admin:true},
    {id:'settings', label:'Settings & Data', icon:'⚙', href:'/inventory#settings', admin:true}
  ];

  function permitted(item, permissions, admin) {
    if (item.admin) return admin;
    if (item.permission) return Boolean(permissions[item.permission]?.read);
    return true;
  }
</script>

<aside class="sidebar" aria-label="Application Navigation">
  <div class="brand">
    <img class="logo" src={logoUrl} alt="Caffoot hedgehog logo" />
    {#if !collapsed}
      <div><div class="brand-name">Caffoot <span>Lite</span></div><div class="brand-caption">INFRASTRUCTURE, SIMPLIFIED.</div></div>
    {/if}
  </div>
  {#if !collapsed}<div class="nav-caption">WORKSPACE</div>{/if}
  <nav class="side-nav" aria-label="Main Sections">
    {#each items as item (item.id)}
      {#if workspaceMode}
        {#if permitted(item, sections, isAdmin)}
          <a href={item.href} class:current={item.id === activeSection}
            aria-current={item.id === activeSection ? 'page' : undefined} title={item.label}>
            <span class="nav-glyph" aria-hidden="true">{item.icon}</span>
            {#if !collapsed}<span>{item.label}</span>{/if}
          </a>
        {/if}
      {:else}
        <button type="button" disabled={item.id !== activeSection}
          class:current={item.id === activeSection}
          aria-current={item.id === activeSection ? 'page' : undefined} title={item.label}>
          <span class="nav-glyph" aria-hidden="true">{item.icon}</span>
          {#if !collapsed}<span>{item.label}</span>{/if}
        </button>
      {/if}
    {/each}
  </nav>
  <div class="nav-bottom">
    <button class="collapse-btn" type="button" on:click={onToggle}
      aria-expanded={!collapsed} aria-label={collapsed ? 'Expand Menu' : 'Collapse Menu'}>
      <span aria-hidden="true">{collapsed ? '»' : '«'}</span>
      {#if !collapsed}<span>Collapse Menu</span>{/if}
    </button>
  </div>
</aside>

<style>
  .side-nav a {
    border: 0; border-radius: 10px; background: none; color: #d2dfeb;
    min-height: 43px; display: flex; align-items: center; gap: 12px;
    padding: 9px 12px; text-align: left; font-size: 12px; font-weight: 600;
    text-decoration: none;
  }
  .side-nav a:hover { background: #253c54; color: #fff; }
  .side-nav a.current { background: #2e465e; color: #fff; }
  .side-nav a:focus-visible { outline: 3px solid #ef9b58; outline-offset: 2px; }
  :global(.collapsed) .side-nav a { justify-content: center; padding: 9px 4px; }
  @media (max-width: 850px) {
    .side-nav a { justify-content: center; padding-inline: 4px; }
    .side-nav a span:not(.nav-glyph) { display: none; }
  }
</style>
