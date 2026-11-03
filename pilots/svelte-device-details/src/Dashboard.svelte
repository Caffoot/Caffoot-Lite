<script>
  import { onMount } from 'svelte';
  import WorkspaceNavigation from './WorkspaceNavigation.svelte';
  import WorkspaceHeader from './WorkspaceHeader.svelte';
  import { summariseDashboard, dashboardCsv } from './dashboard-data.js';

  let sections = {};
  let isAdmin = false;
  let username = '';
  let mfaEnrolled = true;
  let permissions = {};
  let summary = null;
  let loading = true;
  let error = '';
  let selectedTab = 'overview';
  let activityFilter = 'all';
  let warningFilter = 'all';
  let collapsed = false;
  const tabs = [
    {id:'overview',label:'Overview'},
    {id:'insights',label:'Network Insights'},
    {id:'activity',label:'Activity & Alerts'}
  ];
  $: visibleEvents = summary ? summary.events.filter(event => {
    if (activityFilter==='all') return true;
    const text = String(event.reason || '') + ' ' + (Array.isArray(event.changes)
      ? event.changes.map(change=>(change.kind || '')+' '+(change.label || '')).join(' ') : '');
    return activityFilter==='devices' ? /device/i.test(text) :
      activityFilter==='network' ? /ipam|subnet|address|allocation|vlan/i.test(text) :
      /rack/i.test(text);
  }).slice(0,12) : [];
  $: visibleWarnings = summary ? summary.warnings.filter(item =>
    warningFilter==='all'||warningFilter===item.severity).slice(0,12) : [];

  onMount(() => { void refresh(); });

  async function getJson(url) {
    const response = await fetch(url,{credentials:'same-origin',cache:'no-store'});
    if (!response.ok) {
      const failure = new Error(response.status === 401 ? 'Please sign in to see your Dashboard.' :
        response.status === 403 ? 'Your account cannot view the Dashboard.' :
        'Unable to load your saved Dashboard information.');
      failure.status = response.status;
      throw failure;
    }
    return response.json();
  }

  async function refresh() {
    loading=true;error='';
    try {
      const [session,access,snapshot,history] = await Promise.all([
        getJson('/api/session'),getJson('/api/inventory/sections'),
        getJson('/api/inventory/state'),getJson('/api/inventory/history')
      ]);
      username=session.username || '';
      isAdmin=Boolean(session.is_admin);
      mfaEnrolled=Boolean(session.mfa_enrolled);
      sections=access.sections || {};
      permissions=snapshot.editPermissions || {};
      summary=summariseDashboard(snapshot,history.changeHistory || []);
    } catch (caught) {
      error=caught.message || 'Unable to load your Dashboard.';
    } finally {
      loading=false;
    }
  }

  function download(kind) {
    try {
      const csv=dashboardCsv(kind,summary);
      const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));
      const link=document.createElement('a');
      link.href=url;
      link.download='caffoot_lite_'+kind+'_'+new Date().toISOString().slice(0,10)+'.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
    } catch (caught) {
      error=caught.message;
    }
  }

  const legacy = section => '/inventory#'+section;
</script>

<div class="shell production" class:collapsed>
  <WorkspaceNavigation {collapsed} workspaceMode sections={sections} {isAdmin}
    activeSection="dashboard" onToggle={() => collapsed = !collapsed}/>
  <div class="workspace">
    <WorkspaceHeader workspaceMode {username} sectionTitle="Dashboard"/>
    <main class="main-content dashboard">
      <div class="eyebrow">YOUR INFRASTRUCTURE AT A GLANCE</div>
      <div class="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>An organised view of your saved Devices, IPAM and Network Racks.</p>
        </div>
        <button type="button" class="btn btn-outline" on:click={refresh} disabled={loading}>
          Refresh
        </button>
      </div>
      {#if loading}
        <section role="status" class="dash-card message">Loading your Dashboard…</section>
      {:else if error && !summary}
        <section role="alert" class="dash-card message">
          <h2>Unable to show the Dashboard</h2><p>{error}</p>
          <a class="btn btn-outline" href="/setup">Open Sign In</a>
          <button class="btn btn-outline" on:click={refresh}>Try Again</button>
        </section>
      {:else if summary}
        {#if !mfaEnrolled}
          <section role="note" class="dash-alert">
            <strong>Set Up Your Authenticator</strong>
            <span>Editing requires multi-factor authentication. Read-only access does not.</span>
            <a href={legacy('account')}>Open Account Security</a>
          </section>
        {/if}
        {#if isAdmin && summary.healthIssues.length>0}
          <section class="dash-alert" role="alert">
            <strong>Inventory Health — attention required</strong>
            <span>Potential consistency problems found. Use the existing Dashboard for the full check.</span>
            <a href={legacy('dashboard')}>Review Inventory Health</a>
          </section>
        {/if}
        <nav class="dash-tabs" role="tablist" aria-label="Dashboard Sections">
          {#each tabs as tab}
            <button type="button" role="tab" id={'dash-tab-'+tab.id}
              aria-controls={'dash-panel-'+tab.id} aria-selected={selectedTab===tab.id}
              class:active={selectedTab===tab.id} on:click={() => selectedTab=tab.id}>
              {tab.label}
            </button>
          {/each}
        </nav>

        {#if selectedTab==='overview'}
          <section role="tabpanel" aria-labelledby="dash-tab-overview" id="dash-panel-overview">
            <div class="metric-grid">
              {#if summary.access.Devices}
                <a class="metric" href={legacy('devices')}><span>Devices</span><strong>{summary.deviceCount}</strong><small>{summary.activeDevices} active</small></a>
              {/if}
              {#if summary.access.IPAM}
                <a class="metric" href={legacy('ipam')}><span>IP Addresses</span><strong>{summary.ipAssigned}</strong><small>{summary.ipReserved} reserved</small></a>
                <a class="metric" href={legacy('ipam')}><span>Subnets</span><strong>{summary.subnetCount}</strong><small>Managed networks</small></a>
              {/if}
              {#if summary.access.Racks}
                <a class="metric" href={legacy('racks')}><span>Network Racks</span><strong>{summary.rackCount}</strong><small>Recorded cabinets</small></a>
              {/if}
            </div>

            <div class="dash-grid">
              <article class="dash-card">
                <header><h2>Quick Access</h2><p>Use the working application for actions not yet converted.</p></header>
                <div class="dash-actions">
                  {#if summary.access.Devices}
                    <a class="btn btn-outline" href={legacy('devices')}>View Devices</a>
                    {#if permissions.Devices && permissions.IPAM}
                      <a class="btn btn-primary" href={legacy('devices')}>Add Device in Existing App</a>
                    {/if}
                  {/if}
                  {#if summary.access.IPAM}<a class="btn btn-outline" href={legacy('ipam')}>Open IPAM</a>{/if}
                  {#if summary.access.Racks}
                    <a class="btn btn-outline" href={legacy('racks')}>View Racks</a>
                    {#if permissions.Racks}
                      <a class="btn btn-outline" href={legacy('racks')}>Add Rack in Existing App</a>
                    {/if}
                  {/if}
                </div>
              </article>
              {#if summary.access.Devices}
                <article class="dash-card">
                  <header><h2>Recent Devices</h2><p>The most recent records in your inventory.</p></header>
                  {#if summary.devices.length}
                    <div class="dash-rows">
                      {#each summary.devices.slice(-5).reverse() as item}
                        <a href={legacy('devices')} class="dash-row"><span>{item.name || 'Unnamed Device'}</span><small>{item.status || 'Active'}</small></a>
                      {/each}
                    </div>
                  {:else}<p class="empty">No devices have been recorded yet.</p>{/if}
                </article>
              {/if}
              {#if summary.access.IPAM}
                <article class="dash-card">
                  <header><h2>Subnet Utilisation</h2><p>Usable addresses across your networks.</p></header>
                  {#if summary.ipRows.length}
                    <div class="dash-rows">
                      {#each summary.ipRows.slice(0,5) as item}
                        <div class="dash-row"><span>{item.name || item.cidr}</span>
                          <small>{item.supported?item.utilisation+'%':'Not supported'}</small></div>
                      {/each}
                    </div>
                  {:else}<p class="empty">No subnets have been recorded yet.</p>{/if}
                </article>
              {/if}
              {#if summary.access.Racks}
                <article class="dash-card">
                  <header><h2>Rack Capacity</h2><p>Front and rear rack space where your account has the relevant access.</p></header>
                  {#if summary.rackRows.length}
                    <div class="dash-rows">
                      {#each summary.rackRows.slice(0,5) as item}
                        <div class="dash-row"><span>{item.name}</span>
                          <small>{item.percent===null ? item.height+'U · Placement requires Devices access' :
                            item.front+'U front / '+item.rear+'U rear / '+item.height+'U'}</small></div>
                      {/each}
                    </div>
                  {:else}<p class="empty">No racks have been recorded yet.</p>{/if}
                </article>
              {/if}
              {#if summary.access.IPAM}
                <article class="dash-card">
                  <header><h2>Network Allocation Overview</h2><p>Saved IP addresses in your accessible networks.</p></header>
                  <div class="distribution"><span>Assigned</span><strong>{summary.assignedInSubnets}</strong></div>
                  <div class="distribution"><span>Reserved</span><strong>{summary.reservedInSubnets}</strong></div>
                  <div class="distribution"><span>Available</span><strong>{summary.totalAvailable}</strong></div>
                  <div class="distribution"><span>Utilisation</span><strong>{summary.ipUtilisation}%</strong></div>
                  <progress max="100" value={summary.ipUtilisation} aria-label="Overall IP allocation utilisation"></progress>
                  <p class="empty">{summary.usableCapacity} usable addresses across your managed networks</p>
                </article>
              {/if}
              <article class="dash-card">
                <header><h2>Inventory Status</h2><p>Only the areas your account is permitted to view.</p></header>
                {#if summary.access.Devices}<div class="dash-row"><span>Devices</span><strong>{summary.deviceCount} tracked</strong></div>{/if}
                {#if summary.access.IPAM}<div class="dash-row"><span>Subnets</span><strong>{summary.subnetCount} configured</strong></div>{/if}
                {#if summary.access.Racks}<div class="dash-row"><span>Racks</span><strong>{summary.rackCount} configured</strong></div>{/if}
              </article>
            </div>
          </section>
        {:else if selectedTab==='insights'}
          <section role="tabpanel" aria-labelledby="dash-tab-insights" id="dash-panel-insights">
            <div class="dash-grid">
              {#if summary.access.IPAM}
                <article class="dash-card"><header><h2>IP Address Utilisation</h2><p>Assigned and reserved addresses in managed networks.</p></header>
                  {#each summary.ipRows as item}
                    <div class="distribution"><span>{item.name || item.cidr}</span><strong>{item.supported?item.utilisation+'%':'N/A'}</strong></div>
                    {#if item.supported}<progress max="100" value={item.utilisation} aria-label={'Utilisation for '+(item.name||item.cidr)}></progress>{/if}
                  {:else}<p class="empty">No managed networks yet.</p>{/each}
                </article>
              {/if}
              {#if summary.access.Devices}
                <article class="dash-card"><header><h2>Device Status</h2><p>Status distribution from your saved inventory.</p></header>
                  {#each summary.statuses as item}
                    <div class="distribution"><span>{item[0]}</span><strong>{item[1]}</strong></div>
                  {:else}<p class="empty">No devices recorded yet.</p>{/each}
                </article>
                <article class="dash-card"><header><h2>Hardware Distribution</h2><p>Device categories in the inventory.</p></header>
                  {#each summary.types as item}
                    <div class="distribution"><span>{item[0]}</span><strong>{item[1]}</strong></div>
                  {:else}<p class="empty">No device types recorded yet.</p>{/each}
                </article>
              {/if}
              {#if summary.access.Racks}
                <article class="dash-card"><header><h2>Rack Capacity by Face</h2><p>Front and rear occupancy.</p></header>
                  {#each summary.rackRows as item}
                    <div class="distribution"><span>{item.name}</span><strong>{item.percent===null?'Requires Devices access':item.percent+'%'}</strong></div>
                    {#if item.percent!==null}<progress max="100" value={Math.min(100,item.percent)} aria-label={'Rack occupancy for '+item.name}></progress>{/if}
                  {:else}<p class="empty">No racks recorded yet.</p>{/each}
                </article>
              {/if}
              {#if summary.access.Racks}
                <article class="dash-card">
                  <header><h2>Rack Details</h2><p>Open the existing Rack screen for each cabinet.</p></header>
                  {#each summary.rackRows as item}
                    <a class="dash-row" href={legacy('racks')}><span>{item.name}</span><strong>{item.height}U</strong></a>
                  {:else}<p class="empty">No racks recorded yet.</p>{/each}
                </article>
              {/if}
              <article class="dash-card">
                <header><h2>Reports &amp; Exports</h2><p>Download the information your account is allowed to view.</p></header>
                <div class="dash-actions">
                  {#if summary.access.Devices}<button class="btn btn-outline" on:click={() => download('devices')}>Devices CSV</button>{/if}
                  {#if summary.access.IPAM}<button class="btn btn-outline" on:click={() => download('subnets')}>Subnets CSV</button>{/if}
                  {#if summary.access.Racks}<button class="btn btn-outline" on:click={() => download('racks')}>Racks CSV</button>{/if}
                </div>
              </article>
            </div>
          </section>
        {:else}
          <section role="tabpanel" aria-labelledby="dash-tab-activity" id="dash-panel-activity">
            <div class="metric-grid">
              <article class="metric"><span>Recent Save Events</span><strong>{summary.events.length}</strong><small>Visible to your account</small></article>
              <article class="metric"><span>Network Warnings</span><strong>{summary.warnings.length}</strong><small>Potential issues in accessible records</small></article>
            </div>
            <div class="dash-grid">
              <article class="dash-card">
                <header><h2>Recent Activity</h2><p>Saved changes visible to your account.</p></header>
                <label class="dash-filter">Activity Type
                  <select bind:value={activityFilter}>
                    <option value="all">All Activity</option><option value="devices">Devices</option>
                    <option value="network">Network</option><option value="racks">Racks</option>
                  </select>
                </label>
                {#each visibleEvents as event}
                  <div class="dash-event">
                    <div class="dash-row">
                      <strong>{event.reason || 'Inventory saved'}</strong>
                      <small>{event.at && !Number.isNaN(new Date(event.at).getTime())
                        ?new Date(event.at).toLocaleString('en-GB'):'Date unavailable'}</small>
                    </div>
                    {#each (event.changes || []).slice(0,3) as change}
                      <p class="event-detail">{change.action || 'Changed'} {change.kind || 'record'}: {change.label || ''}</p>
                    {/each}
                  </div>
                {:else}<p class="empty">No activity to show for this selection.</p>{/each}
                <a href={legacy('audit')} class="dash-more">Open Change History</a>
              </article>
              <article class="dash-card">
                <header><h2>Warnings &amp; Attention</h2><p>Capacity warnings at 85% or more.</p></header>
                <label class="dash-filter">Severity
                  <select bind:value={warningFilter}>
                    <option value="all">All Severities</option>
                    <option value="critical">Critical only</option>
                    <option value="warning">Warnings only</option>
                  </select>
                </label>
                {#each visibleWarnings as item}
                  <a class="dash-row" href={legacy(item.target || 'dashboard')}>
                    <span><strong>{item.severity==='critical'?'Critical':'Warning'}:</strong> {item.text}</span>
                  </a>
                {:else}<p class="empty">No warnings match this selection.</p>{/each}
                <a href={legacy('dashboard')} class="dash-more">View Existing Dashboard Checks</a>
              </article>
            </div>
          </section>
        {/if}
        {#if error}<p role="alert" class="dash-alert">{error}</p>{/if}
      {/if}
    </main>
  </div>
</div>

<style>
  .dashboard { max-width: none; }
  .dash-tabs { display:flex; gap:25px; border-bottom:1px solid #dfe7ee; margin:23px 0 24px; overflow-x:auto; }
  .dash-tabs button { background:none; border:0; border-bottom:3px solid transparent; font-size:13.5px;
    color:#7890a6; font-weight:700; padding:0 4px 15px; white-space:nowrap; }
  .dash-tabs button.active { border-bottom-color:#ed8532; color:#1e3850; }
  .metric-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:15px; margin-bottom:18px; }
  .metric { background:#fff; border:1px solid #e1e8ee; border-radius:15px; padding:20px; display:grid; gap:7px;
    text-decoration:none; color:#244057; }
  .metric span { font-size:12px; color:#6a8398; font-weight:650; }
  .metric strong { font-size:29px; letter-spacing:-1px; }
  .metric small { font-size:11px; color:#7990a4; }
  .metric:hover { border-color:#e5a06e; }
  .dash-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px; }
  .dash-card { background:#fff; border:1px solid #e1e8ee; border-radius:15px; padding:22px; min-width:0;
    box-shadow:0 7px 26px rgba(31,51,73,.04); }
  .dash-card header { margin-bottom:18px; }
  .dash-card h2 { margin:0 0 5px; font-size:16px; color:#223b53; font-weight:750; }
  .dash-card header p { font-size:12px; line-height:1.5; color:#70859a; margin:0; }
  .dash-actions { display:flex; flex-wrap:wrap; gap:10px; }
  .dash-actions a { text-decoration:none; }
  .dash-rows { display:grid; }
  .dash-row { display:flex; align-items:center; justify-content:space-between; gap:13px;
    padding:12px 0; border-bottom:1px solid #edf0f4; font-size:13px; color:#29445e; }
  .dash-row:last-child { border-bottom:0; }
  .dash-row small { text-align:right; color:#71879b; }
  .dash-event { border-bottom:1px solid #edf0f4; padding-bottom:10px; }
  .dash-event .dash-row { border-bottom:0; }
  .event-detail { margin:4px 0; font-size:12px; line-height:1.5; color:#73879b; }
  a.dash-row { text-decoration:none; }
  a.dash-row:hover { color:#b66025; }
  .empty { margin:12px 0; font-size:13px; color:#8194a6; }
  .distribution { display:flex; justify-content:space-between; gap:14px; margin:15px 0 6px; font-size:13px; }
  progress { display:block; width:100%; height:10px; accent-color:#ed8532; }
  .dash-filter { display:grid; gap:7px; margin-bottom:16px; color:#38546b; font-size:12px; font-weight:700; }
  select { width:100%; border:1px solid #dce5ed; background:#fff; border-radius:9px; padding:10px; color:#254058; }
  .dash-more { display:inline-block; margin-top:16px; color:#b76527; font-size:12px; font-weight:700; }
  .message { margin-top:24px; }
  .dash-alert { display:flex; align-items:center; flex-wrap:wrap; gap:12px; margin-top:18px; margin-bottom:12px;
    border:1px solid #f2dcc2; background:#fff7ed; border-radius:12px; padding:14px 18px; font-size:13px; }
  .dash-alert a { color:#a85c22; }
  @media(max-width:1100px) { .metric-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
  @media(max-width:850px) { .dash-grid { grid-template-columns:1fr; } }
  @media(max-width:550px) { .metric-grid { grid-template-columns:1fr 1fr; gap:10px; }
    .metric { padding:14px; } .dash-card { padding:16px; } .dash-row { align-items:start; flex-wrap:wrap; }
  }
</style>
