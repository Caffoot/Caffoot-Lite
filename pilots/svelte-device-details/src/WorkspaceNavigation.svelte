<script>
  import { onMount } from 'svelte';
  import logoUrl from '../../../assets/caffoot-logo-256.png';

  export let collapsed = false;
  export let workspaceMode = false;
  export let sections = {};
  export let isAdmin = false;
  export let activeSection = 'devices';
  export let onToggle = () => {};

  // The seven approved sections; unfinished ones still open the working app.
  const items = [
    { id: 'dashboard', label: 'Dashboard', href: '/workspace/dashboard/' },
    { id: 'devices', label: 'Devices', href: '/workspace/', permission: 'Devices' },
    { id: 'ipam', label: 'IPAM', href: '/inventory#ipam', permission: 'IPAM' },
    { id: 'racks', label: 'Network Racks', href: '/inventory#racks', permission: 'Racks' },
    { id: 'audit', label: 'Audit Trail', href: '/inventory#audit' },
    { id: 'users', label: 'Users', href: '/inventory#users', admin: true },
    { id: 'settings', label: 'Settings & Data', href: '/inventory#settings', admin: true }
  ];

  function permitted(item) {
    if (item.admin) return isAdmin;
    if (item.permission) return Boolean(sections[item.permission]?.read);
    return true;
  }

  onMount(() => {
    try {
      if (localStorage.getItem('caffoot_sidebar_collapsed') === '1' && !collapsed) onToggle();
    } catch (_) { /* Storage is optional; navigation remains available. */ }
  });

  function toggleMenu() {
    try { localStorage.setItem('caffoot_sidebar_collapsed', collapsed ? '0' : '1'); }
    catch (_) { /* Non-persistent collapse remains functional. */ }
    onToggle();
  }
</script>

<aside class="sidebar" class:collapsed aria-label="Application Navigation">
  <div class="brand">
    <img src={logoUrl} alt="Caffoot hedgehog logo" />
    <div class="brand-text">
      <div class="brand-name">Caffoot <span>Lite</span></div>
      <div class="brand-sub">INFRASTRUCTURE, SIMPLIFIED.</div>
    </div>
  </div>
  <div class="nav-label">WORKSPACE</div>
  <nav class="side-nav" aria-label="Main Sections">
    {#each items.filter(item => item.id !== 'settings') as item (item.id)}
      {#if permitted(item)}
        {#if workspaceMode}
          <a class="nav-item" class:current={item.id === activeSection} href={item.href}
            title={item.label} aria-current={item.id === activeSection ? 'page' : undefined}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              {#if item.id === 'dashboard'}
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              {:else if item.id === 'devices'}
                <rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M8 6h1M8 13h8M8 17h8"/>
              {:else if item.id === 'ipam'}
                <rect x="9" y="2" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><path d="M12 8v4M5 16v-4h14v4"/>
              {:else if item.id === 'racks'}
                <rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8M8 11h8M8 16h8M8 20h8"/>
              {:else if item.id === 'audit'}
                <path d="M3 11a9 9 0 1 1 2.5 6.5M3 4v7h7M12 7v5l3 2"/>
              {:else}
                <circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5v1"/>
              {/if}
            </svg>
            <span class="nav-text">{item.label}</span>
          </a>
        {:else}
          <button type="button" class="nav-item" class:current={item.id === activeSection}
            disabled={item.id !== activeSection} title={item.label}
            aria-current={item.id === activeSection ? 'page' : undefined}>
            <span aria-hidden="true">{item.id === 'devices' ? '▣' : '·'}</span>
            <span class="nav-text">{item.label}</span>
          </button>
        {/if}
      {/if}
    {/each}
  </nav>
  <div class="nav-bottom">
    {#if permitted(items[6])}
      <a href="/inventory#settings" class="nav-item" class:current={activeSection === 'settings'}
        title="Settings & Data" aria-current={activeSection === 'settings' ? 'page' : undefined}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/><path d="M10 2h4l.8 2.6 2 1.1 2.6-.7 2 3.5-1.8 2v2.5l1.8 2-2 3.5-2.6-.7-2 1.1L14 22h-4l-.8-2.6-2-1.1-2.6.7-2-3.5 1.8-2v-2.5l-1.8-2 2-3.5 2.6.7 2-1.1Z"/>
        </svg>
        <span class="nav-text">Settings &amp; Data</span>
      </a>
    {/if}
    <button class="sidebar-button" type="button" title="Collapse or expand sidebar"
      aria-label={collapsed ? 'Expand Menu' : 'Collapse Menu'} aria-expanded={!collapsed} on:click={toggleMenu}>
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d={collapsed ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'}/>
      </svg>
      <span class="collapse-text">{collapsed ? 'Expand Menu' : 'Collapse Menu'}</span>
    </button>
  </div>
</aside>

<style>
  .sidebar { background:#142b43;color:#d2dce5;display:flex;flex-direction:column;min-height:100vh;padding:20px 13px 15px;gap:12px;position:sticky;top:0;height:100vh; }
  .brand { display:flex;align-items:center;gap:10px;margin:1px 7px 21px;padding:0; }
  .brand img { width:42px;height:42px;border-radius:10px;transform:none; }
  .brand-name { font-size:16px;font-weight:750;letter-spacing:-.55px;color:white; }
  .brand-name span { color:#ffac6c; }
  .brand-sub { font-size:9px;letter-spacing:.045em;color:#94abc1;margin-top:3px; }
  .nav-label { font-weight:700;letter-spacing:.13em;font-size:10px;color:#829ab2;margin:10px 11px 4px; }
  nav { display:grid;gap:2px; }
  .nav-item { display:flex;align-items:center;gap:12px;width:100%;padding:11px 13px;border:0;text-align:left;border-radius:10px;color:#d2dfeb;background:none;font-size:13px;font-weight:550;text-decoration:none;min-height:41px; }
  .nav-item svg { width:17px;height:17px;stroke-width:1.8;flex-shrink:0; }
  .nav-item.current { background:#2e465e;color:#fff; }
  .nav-item.current svg { color:#ffa164; }
  .nav-item:hover,.sidebar-button:hover { background:#253c54;color:#fff; }
  .nav-item:focus-visible,.sidebar-button:focus-visible { outline:3px solid #ef9b58;outline-offset:2px; }
  .nav-item:disabled { opacity:1;cursor:default; }
  .nav-bottom { margin-top:auto;border-top:1px solid #365069;padding-top:11px;display:grid;gap:5px; }
  .sidebar-button { border:0;background:#243d56;color:#c7d7e6;border-radius:9px;padding:9px;display:flex;align-items:center;justify-content:center;gap:9px;font-size:11px;margin-top:9px;min-height:33px; }
  .sidebar-button svg { width:15px;height:15px;color:#f5a66a; }
  .sidebar.collapsed { width:65px;padding-inline:8px; }
  .sidebar.collapsed .brand { justify-content:center;margin:0 0 22px; }
  .sidebar.collapsed .brand img { width:37px;height:37px; }
  .sidebar.collapsed .brand-text,.sidebar.collapsed .nav-label,.sidebar.collapsed .nav-text,.sidebar.collapsed .collapse-text { display:none; }
  .sidebar.collapsed .nav-item { justify-content:center;padding:11px 6px; }
  @media(max-width:720px) {
    .sidebar { width:65px;padding:16px 8px; }
    .brand { justify-content:center;margin:0 0 16px; }
    .brand img { width:36px;height:36px; }
    .brand-text,.nav-label,.nav-text,.collapse-text { display:none; }
    .nav-item { justify-content:center;padding:11px 6px; }
  }
</style>
