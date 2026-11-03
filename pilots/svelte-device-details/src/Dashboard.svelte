<script>
  import { onMount } from 'svelte';
  import './dashboard-approved.css';
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
      /rack|accessory|mount/i.test(text);
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
  const legacyAdd = section => '/inventory#'+section+'/add';

  const barColours = ['#4a9c86','#6d95be','#ed8532'];
  const percent = value => Math.max(0,Math.min(100,Number(value)||0));
  const usedOnRack = rack => rack.front===null ? null : Math.max(rack.front,rack.rear);
  const eventTitle = event => event.reason || (event.changes && event.changes[0]?.label) || 'Saved inventory change';
  const eventTime = timestamp => {
    const date = new Date(timestamp);
    return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString();
  };
</script>

{#snippet head(title,subtitle,icon,tone='')}
  <div class="card-head">
    <span class={'iconwrap '+tone}><svg aria-hidden="true" fill="none" height="18" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" width="18"><use href={'#i-'+icon}></use></svg></span>
    <div><h3>{title}</h3><p class="sub">{subtitle}</p></div>
  </div>
{/snippet}

<svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden" xmlns="http://www.w3.org/2000/svg"><symbol id="i-grid" viewbox="0 0 24 24"><rect height="7" rx="1" width="7" x="3" y="3"></rect><rect height="7" rx="1" width="7" x="14" y="3"></rect><rect height="7" rx="1" width="7" x="3" y="14"></rect><rect height="7" rx="1" width="7" x="14" y="14"></rect></symbol><symbol id="i-box" viewbox="0 0 24 24"><rect height="18" rx="2" width="16" x="4" y="3"></rect><path d="M4 9h16M8 6h1M8 13h8M8 17h8"></path></symbol><symbol id="i-network" viewbox="0 0 24 24"><rect height="6" rx="1" width="6" x="9" y="2"></rect><rect height="6" rx="1" width="6" x="2" y="16"></rect><rect height="6" rx="1" width="6" x="16" y="16"></rect><path d="M12 8v4M5 16v-4h14v4"></path></symbol><symbol id="i-rack" viewbox="0 0 24 24"><rect height="20" rx="2" width="14" x="5" y="2"></rect><path d="M8 6h8M8 11h8M8 16h8M8 20h8"></path><circle cx="8" cy="6" r=".5"></circle><circle cx="8" cy="11" r=".5"></circle></symbol><symbol id="i-history" viewbox="0 0 24 24"><path d="M3 11a9 9 0 1 1 2.5 6.5M3 4v7h7M12 7v5l3 2"></path></symbol><symbol id="i-users" viewbox="0 0 24 24"><circle cx="9" cy="8" r="3"></circle><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5v1"></path></symbol><symbol id="i-settings" viewbox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M10 2h4l.8 2.6 2 1.1 2.6-.7 2 3.5-1.8 2v2.5l1.8 2-2 3.5-2.6-.7-2 1.1L14 22h-4l-.8-2.6-2-1.1-2.6.7-2-3.5 1.8-2v-2.5l-1.8-2 2-3.5 2.6.7 2-1.1Z"></path></symbol><symbol id="i-shield" viewbox="0 0 24 24"><path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5Z"></path><path d="m9 12 2 2 4-5"></path></symbol><symbol id="i-database" viewbox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 2 4 3 9 3s9-1 9-3V5M3 12c0 2 4 3 9 3s9-1 9-3"></path></symbol><symbol id="i-download" viewbox="0 0 24 24"><path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"></path></symbol><symbol id="i-upload" viewbox="0 0 24 24"><path d="M12 21V9m-5 5 5-5 5 5M4 7V3h16v4"></path></symbol><symbol id="i-mail" viewbox="0 0 24 24"><rect height="14" rx="2" width="20" x="2" y="5"></rect><path d="m2 7 10 7 10-7"></path></symbol><symbol id="i-tool" viewbox="0 0 24 24"><path d="M14 4a6 6 0 0 0-7 7L2 16l6 6 5-5a6 6 0 0 0 7-7l-5 4-5-5Z"></path></symbol><symbol id="i-info" viewbox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 11v6m0-10h.01"></path></symbol><symbol id="i-chevron" viewbox="0 0 24 24"><path d="m9 18 6-6-6-6"></path></symbol><symbol id="i-copy" viewbox="0 0 24 24"><rect height="13" rx="2" width="13" x="8" y="8"></rect><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"></path></symbol><symbol id="i-send" viewbox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4 20-7ZM11 13l11-11"></path></symbol><symbol id="i-alert" viewbox="0 0 24 24"><path d="M12 3 2 21h20L12 3Zm0 6v5m0 4h.01"></path></symbol><symbol id="i-lock" viewbox="0 0 24 24"><rect height="12" rx="2" width="16" x="4" y="10"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path></symbol><symbol id="i-user" viewbox="0 0 24 24"><circle cx="12" cy="8" r="4"></circle><path d="M4 22v-3a8 8 0 0 1 16 0v3"></path></symbol></svg>
<div class="shell production dashboard-shell" class:collapsed>
  <WorkspaceNavigation {collapsed} workspaceMode sections={sections} {isAdmin}
    activeSection="dashboard" onToggle={() => collapsed = !collapsed}/>
  <div class="workspace">
    <WorkspaceHeader workspaceMode {username} sectionTitle="Dashboard"/>
    <main class="main dashboard-content">
      <div class="eyebrow">YOUR INFRASTRUCTURE AT A GLANCE</div>
      <div class="header db-hero-row">
        <div><h1>Dashboard</h1><p>An organised view of your saved Devices, IPAM and Network Racks.</p></div>
      </div>

      {#if loading}
        <section role="status" class="card db-card db-section">Loading your Dashboard…</section>
      {:else if error && !summary}
        <section role="alert" class="card db-card db-section">
          <h2>Unable to show the Dashboard</h2><p>{error}</p>
          <a class="btn btn-outline" href="/setup">Open Sign In</a>
          <button type="button" class="btn btn-outline" on:click={refresh}>Try Again</button>
        </section>
      {:else if summary}
        {#if !mfaEnrolled}
          <section role="note" class="db-callout">
            <strong>Set Up Your Authenticator.</strong> Editing requires multi-factor authentication.
            <a href={legacy('account')}>Open Account Security</a>
          </section>
        {/if}
        {#if isAdmin && summary.healthIssues.length>0}
          <section role="alert" class="db-callout">
            <strong>Inventory Health — attention required.</strong>
            Potential consistency problems found.
            <a href={legacy('dashboard')}>Review Inventory Health</a>
          </section>
        {/if}
        <nav aria-label="Dashboard Sections" class="subnav" role="tablist">
          {#each tabs as tab}
            <button aria-selected={selectedTab===tab.id} class:active={selectedTab===tab.id}
              role="tab" id={'dash-tab-'+tab.id} aria-controls={'dash-panel-'+tab.id}
              on:click={() => selectedTab=tab.id} type="button">
              <svg aria-hidden="true" fill="none" height="18" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" width="18"><use href={tab.id==='overview'?'#i-grid':tab.id==='insights'?'#i-network':'#i-history'}></use></svg>
              {tab.label}
            </button>
          {/each}
        </nav>
        {#if selectedTab==='overview'}
          <section class="account-panel active" role="tabpanel" id="dash-panel-overview" aria-labelledby="dash-tab-overview">
            <div class="db-summary metric-grid">
              {#if summary.access.Devices}
                <a class="db-metric" href={legacy('devices')} aria-label="Devices">
                  <span class="db-metric-head">Devices <span class="iconwrap"><svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><use href="#i-box"></use></svg></span></span>
                  <strong>{summary.deviceCount}</strong><small>{summary.activeDevices} active · {summary.deviceCount-summary.activeDevices} other</small>
                </a>
              {/if}
              {#if summary.access.IPAM}
                <a class="db-metric" href={legacy('ipam')} aria-label="IP Addresses">
                  <span class="db-metric-head">IP Addresses <span class="iconwrap green"><svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><use href="#i-network"></use></svg></span></span>
                  <strong>{summary.ipAssigned+summary.ipReserved}</strong><small>{summary.ipAssigned} assigned · {summary.ipReserved} reserved</small>
                </a>
                <a class="db-metric" href={legacy('ipam')} aria-label="Subnets">
                  <span class="db-metric-head">Subnets <span class="iconwrap"><svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><use href="#i-network"></use></svg></span></span>
                  <strong>{summary.subnetCount}</strong><small>Managed networks</small>
                </a>
              {/if}
              {#if summary.access.Racks}
                <a class="db-metric" href={legacy('racks')} aria-label="Network Racks">
                  <span class="db-metric-head">Racks <span class="iconwrap orange"><svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><use href="#i-rack"></use></svg></span></span>
                  <strong>{summary.rackCount}</strong><small>{summary.access.Devices ? summary.devices.filter(device=>device.rackId).length+' mounted devices' : 'Recorded cabinets'}</small>
                </a>
              {/if}
            </div>
            <div class="db-two">
              <div class="db-stack">
                <div class="card db-card">
                  {@render head('Quick Access','Existing actions, available according to the signed-in user’s permissions.','grid','orange')}
                  <div class="db-actionrow">
                    {#if summary.access.Devices}
                      {#if permissions.Devices && permissions.IPAM}
                        <a class="btn btn-primary" href={legacyAdd('devices')}>Add Device</a>
                      {:else}
                        <a class="btn btn-outline" href={legacy('devices')}>View Devices</a>
                      {/if}
                    {/if}
                    {#if summary.access.Racks}
                      <a class="btn btn-outline" href={permissions.Racks?legacyAdd('racks'):legacy('racks')}>{permissions.Racks?'Add Rack':'Open Network Racks'}</a>
                    {/if}
                    {#if summary.access.IPAM}<a class="btn btn-outline" href={legacy('ipam')}>Open IPAM</a>{/if}
                  </div>
                </div>
                {#if summary.access.Devices}
                  <div class="card db-card">
                    {@render head('Recent Devices','The latest records in your saved inventory.','box')}
                    <div class="divider"></div>
                    {#if summary.devices.length}
                      {#each summary.devices.slice(-5).reverse() as device}
                        <div class="db-slimrow">
                          <div><strong>{device.name || 'Unnamed Device'}</strong><div class="db-muted">{device.type || 'Device'} · {device.primaryIp || 'No IP address'}</div></div>
                          <span class:db-good={(device.status||'Active').toLowerCase()==='active'} class="db-badge">{device.status || 'Active'}</span>
                        </div>
                      {/each}
                    {:else}<p class="db-empty-note">No devices have been recorded yet.</p>{/if}
                    <a class="btn btn-outline" href={legacy('devices')}>View All Devices</a>
                  </div>
                {/if}
                {#if summary.access.IPAM}
                  <div class="card db-card">
                    {@render head('Subnet Utilisation','Usable addresses across existing CIDR networks.','network','green')}
                    <div class="divider"></div>
                    {#if summary.ipRows.length}
                      {#each summary.ipRows.slice(0,5) as subnet,i}
                        <div class="db-progress-title" style:margin-top={i===0?'0':'18px'}>
                          <span>{subnet.name || subnet.cidr}{subnet.name && subnet.cidr ? ' · '+subnet.cidr : ''}</span>
                          <strong>{subnet.supported?subnet.utilisation+'%':'N/A'}</strong>
                        </div>
                        <div class="db-bar"><span style:width={percent(subnet.utilisation)+'%'} style:background={barColours[i%3]}></span></div>
                      {/each}
                    {:else}<p class="db-empty-note">No subnets have been recorded yet.</p>{/if}
                    <p class="db-muted" style="margin-bottom:0">Details, reservations and allocations remain managed within IPAM.</p>
                  </div>
                {/if}
              </div>
              <div class="db-stack">
                {#if summary.access.Racks}
                  <div class="card db-card">
                    {@render head('Rack Capacity','Used U-space across your cabinets.','rack','orange')}
                    <div class="divider"></div>
                    {#if summary.rackRows.length}
                      {#each summary.rackRows.slice(0,5) as rack,i}
                        <div class="db-progress-title" style:margin-top={i===0?'0':'14px'}>
                          <span>{rack.name}</span>
                          <strong>{usedOnRack(rack)===null?'Placement requires Devices access':usedOnRack(rack)+' / '+rack.height+'U'}</strong>
                        </div>
                        {#if usedOnRack(rack)!==null}
                          <div class="db-bar"><span style:width={percent(rack.percent)+'%'} style:background={rack.percent>=70?'#ed8532':'#7799b5'}></span></div>
                        {/if}
                      {/each}
                    {:else}<p class="db-empty-note">No racks have been recorded yet.</p>{/if}
                    <a class="btn btn-outline" href={legacy('racks')}>Open Network Racks</a>
                  </div>
                {/if}
                {#if summary.access.IPAM}
                  <div class="card db-card">
                    {@render head('Network Allocation Overview','A summary of your stored addressing data.','network')}
                    <div class="divider"></div>
                    <div class="db-legend">
                      <div><span class="db-dot blue"></span><span>Assigned</span><strong>{summary.assignedInSubnets}</strong></div>
                      <div><span class="db-dot"></span><span>Reserved</span><strong>{summary.reservedInSubnets}</strong></div>
                      <div><span class="db-dot green"></span><span>Available</span><strong>{summary.totalAvailable}</strong></div>
                    </div>
                    <a class="btn btn-outline" href={legacy('ipam')}>View IP Allocations</a>
                  </div>
                {/if}
                <div class="card db-card">
                  {@render head('Inventory Status','A concise snapshot of your saved inventory.','info')}
                  <div class="divider"></div>
                  {#if summary.access.Devices}<div class="db-slimrow"><strong>Devices</strong><span class="db-badge">{summary.deviceCount} tracked</span></div>{/if}
                  {#if summary.access.IPAM}<div class="db-slimrow"><strong>Subnets</strong><span class="db-badge">{summary.subnetCount} configured</span></div>{/if}
                  {#if summary.access.Racks}<div class="db-slimrow"><strong>Racks</strong><span class="db-badge">{summary.rackCount} configured</span></div>{/if}
                  {#if isAdmin}<p class="db-muted" style="margin-bottom:0">Administrator-only Inventory Health warnings appear only when the real checks detect an issue.</p>{/if}
                </div>
              </div>
            </div>
          </section>
        {:else if selectedTab==='insights'}
          <section class="account-panel active" role="tabpanel" id="dash-panel-insights" aria-labelledby="dash-tab-insights">
            <div class="db-insights-4">
              {#if summary.access.IPAM}
                <div class="card db-card">
                  {@render head('IP Address Utilisation','Allocated or reserved addresses across managed subnets.','network','orange')}
                  <div class="divider"></div>
                  <div class="db-stat-number">{summary.ipUtilisation}%</div>
                  <div class="db-bar"><span style:width={percent(summary.ipUtilisation)+'%'} style="background:#7197b9"></span></div>
                  <div class="db-legend">
                    <div><span class="db-dot blue"></span><span>Assigned</span><strong>{summary.assignedInSubnets}</strong></div>
                    <div><span class="db-dot"></span><span>Reserved</span><strong>{summary.reservedInSubnets}</strong></div>
                    <div><span class="db-dot green"></span><span>Available</span><strong>{summary.totalAvailable}</strong></div>
                  </div>
                </div>
              {/if}
              {#if summary.access.Devices}
                <div class="card db-card">
                  {@render head('Device Status','Status distribution in the saved inventory.','box')}
                  <div class="divider"></div>
                  <div class="db-stat-number">{summary.deviceCount} <span class="db-muted">devices</span></div>
                  <div class="db-legend">
                    {#each summary.statuses as status,i}
                      <div><span class={'db-dot '+(i===0?'green':i===2?'gray':'')}></span><span>{status[0]}</span><strong>{status[1]}</strong></div>
                    {/each}
                  </div>
                </div>
                <div class="card db-card">
                  {@render head('Hardware Distribution','Device categories by inventory count.','box')}
                  <div class="divider"></div>
                  {#if summary.types.length}
                    {#each summary.types.slice(0,6) as type}
                      <div class="db-progress-title"><span>{type[0]}</span><strong>{type[1]}</strong></div>
                      <div class="db-bar"><span style:width={percent(type[1]/Math.max(1,summary.types[0][1])*100)+'%'} style="background:#77a8a1"></span></div>
                    {/each}
                  {:else}<p class="db-empty-note">No devices have been recorded yet.</p>{/if}
                </div>
              {/if}
              {#if summary.access.Racks}
                <div class="card db-card">
                  {@render head('Rack Capacity by Face','Front and rear U occupancy, including accessories.','rack','orange')}
                  <div class="divider"></div>
                  {#if summary.rackRows.length}
                    {#each summary.rackRows.slice(0,3) as rack}
                      <div class="db-progress-title"><span>{rack.name} — Front</span><strong>{rack.front===null?'Not available':rack.front+' / '+rack.height+'U'}</strong></div>
                      {#if rack.front!==null}<div class="db-bar"><span style:width={percent(rack.front/rack.height*100)+'%'} style="background:#7396bb"></span></div>{/if}
                      <div class="db-progress-title"><span>{rack.name} — Rear</span><strong>{rack.rear===null?'Not available':rack.rear+' / '+rack.height+'U'}</strong></div>
                      {#if rack.rear!==null}<div class="db-bar"><span style:width={percent(rack.rear/rack.height*100)+'%'} style="background:#4a9c86"></span></div>{/if}
                    {/each}
                  {:else}<p class="db-empty-note">No racks have been recorded yet.</p>{/if}
                </div>
              {/if}
            </div>
            {#if summary.access.Racks}
              <div class="db-section card db-card">
                {@render head('Rack Details','The existing rack list and per-rack links stay available in this section.','rack')}
                <div class="divider"></div>
                <div class="db-grid">
                  {#each summary.rackRows as rack}
                    <div class="db-slimrow"><strong>{rack.name}</strong><span class="db-badge">{rack.height}U</span></div>
                  {/each}
                </div>
                <div class="db-actionrow"><a class="btn btn-outline" href={legacy('racks')}>Open Rack Details</a></div>
              </div>
            {/if}
          </section>
        {:else}
          <section class="account-panel active" role="tabpanel" id="dash-panel-activity" aria-labelledby="dash-tab-activity">
            <div class="db-summary db-activity-summary">
              <div class="card db-card">
                {@render head('Recent Save Events','Saved inventory changes.','history')}
                <div class="db-stat-number" style="margin-top:12px">{summary.events.length}</div>
              </div>
              <div class="card db-card">
                {@render head('Network Warnings','Existing consistency and capacity checks.','alert','orange')}
                <div class="db-stat-number" style="margin-top:12px">{summary.warnings.length}</div>
              </div>
            </div>
            <div class="db-two">
              <div class="db-stack">
                <div class="card db-card">
                  {@render head('Recent Activity','Existing saved-change timeline and filters.','history')}
                  <div class="divider"></div>
                  <div class="db-filters">
                    <label class="db-muted" for="activity-filter">Activity type</label>
                    <select id="activity-filter" bind:value={activityFilter}><option value="all">All Changes</option><option value="devices">Devices</option><option value="network">Network</option><option value="racks">Racks</option></select>
                  </div>
                  {#if visibleEvents.length}
                    {#each visibleEvents as event}
                      <div class="db-slimrow"><div><strong>{eventTitle(event)}</strong><div class="db-muted">{(event.changes||[]).map(change=>change.label||change.kind).filter(Boolean).join(', ')}</div></div><time class="db-muted" datetime={event.at||undefined}>{eventTime(event.at)}</time></div>
                    {/each}
                  {:else}<p class="db-empty-note">No saved changes match this filter.</p>{/if}
                  <div class="db-actionrow"><a class="btn btn-outline" href={legacy('audit')}>Full Change History</a></div>
                </div>
              </div>
              <div class="db-stack">
                <div class="card db-card">
                  {@render head('Warnings & Attention','IPAM linkage, duplicate IP and rack capacity warnings.','alert','orange')}
                  <div class="divider"></div>
                  <div class="db-filters">
                    <label class="db-muted" for="alert-filter">Severity</label>
                    <select id="alert-filter" bind:value={warningFilter}><option value="all">All Severities</option><option value="warning">Warning</option><option value="critical">Critical</option></select>
                  </div>
                  {#if visibleWarnings.length}
                    {#each visibleWarnings as warning}
                      <div class="db-slimrow"><a class="db-warning-link" href={legacy(warning.target)}><strong>{warning.text}</strong><div class="db-muted">{warning.kind} · Saved inventory checks</div></a><span class="db-badge db-warning">{warning.severity}</span></div>
                    {/each}
                  {:else}<p class="db-empty-note">No saved warnings match this filter.</p>{/if}
                </div>
              </div>
            </div>
            <div class="db-section card db-card">
              {@render head('Reports & Exports','Preserve all CSV and downloadable reports available in the existing application.','download')}
              <div class="divider"></div>
              <p class="db-muted">Existing report types, controls and permission requirements remain intact.</p>
              <div class="db-report-buttons">
                {#if summary.access.Devices}<button class="btn btn-outline" type="button" on:click={() => download('devices')}>Device Inventory CSV</button>{/if}
                {#if summary.access.IPAM}<button class="btn btn-outline" type="button" on:click={() => download('subnets')}>IPAM CSV</button>{/if}
                {#if summary.access.Racks}<button class="btn btn-outline" type="button" on:click={() => download('racks')}>Rack Report</button>{/if}
              </div>
            </div>
          </section>
        {/if}
        {#if error}<p role="alert" class="db-callout">{error}</p>{/if}
      {/if}
      <footer class="footer"><span>Caffoot Lite · Infrastructure, Simplified.</span><span>Dashboard</span></footer>
    </main>
  </div>
</div>
