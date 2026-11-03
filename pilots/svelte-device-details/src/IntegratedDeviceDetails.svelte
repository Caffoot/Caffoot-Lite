<script>
  import { onMount, tick } from 'svelte';
  import logoUrl from '../../../assets/caffoot-logo-256.png';
  import {
    loadDevices, isVirtual, isHypervisor, platformFor, versionFor,
    findHost, hostedGuests, rackFor, savedSelections
  } from './integration-data.js';

  let devices = [];
  let racks = [];
  let rackAccess = false;
  let loading = true;
  let error = '';
  let unauthorised = false;
  let forbidden = false;
  let currentId = '';
  let activeTab = 'overview';
  let collapsed = false;
  let dialog;
  let lastTrigger;

  const sections = ['Dashboard', 'Devices', 'IPAM', 'Network Racks', 'Audit Trail', 'Users', 'Settings & Data'];
  $: device = devices.find(item => item.id === currentId);
  $: virtual = isVirtual(device);
  $: guests = device ? hostedGuests(device, devices) : [];
  $: host = device ? findHost(device, devices) : undefined;
  $: hasGuests = device ? isHypervisor(device, devices) : false;
  $: mountedRack = device && rackAccess ? rackFor(device, racks) : undefined;
  $: tabs = device ? [
    ['overview', 'Overview'],
    ...(hasGuests ? [['virtual-machines', 'Virtual Machines']] : []),
    ...(!virtual ? [['hardware', 'Hardware']] : []),
    ['network', 'Network'],
    ['software', 'Software'],
    ['location', 'Location'],
    ...(Array.isArray(device.previousTypeDetails) && device.previousTypeDetails.length ?
      [['history', 'History']] : [])
  ] : [];

  onMount(() => { refresh(); });

  async function refresh() {
    loading = true;
    error = '';
    unauthorised = false;
    forbidden = false;
    currentId = '';
    try {
      const result = await loadDevices();
      devices = result.devices;
      racks = result.racks;
      rackAccess = result.rackAccess;
    } catch (caught) {
      error = caught.message || 'The device information could not be loaded.';
      unauthorised = caught.status === 401;
      forbidden = caught.status === 403;
    } finally {
      loading = false;
    }
  }

  async function openDetails(item, trigger = undefined) {
    lastTrigger = trigger;
    currentId = item.id;
    activeTab = 'overview';
    await tick();
    dialog?.focus();
  }

  function closeDetails() {
    currentId = '';
    lastTrigger?.focus();
    lastTrigger = undefined;
  }

  function showRelated(item) {
    if (item) openDetails(item);
  }

  function handleKey(event) {
    if (!currentId) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDetails();
      return;
    }
    if (event.key === 'Tab' && dialog) {
      const items = [...dialog.querySelectorAll('button:not([disabled]), a[href]')].filter(item => item.getClientRects().length);
      if (!items.length) return;
      if (event.shiftKey && (document.activeElement === items[0] || document.activeElement === dialog)) {
        event.preventDefault(); items[items.length - 1].focus();
      } else if (!event.shiftKey && (document.activeElement === items[items.length - 1] || document.activeElement === dialog)) {
        event.preventDefault(); items[0].focus();
      }
    }
  }
</script>

<svelte:window on:keydown={handleKey}/>

<div class:collapsed class="shell">
  <aside class="sidebar" aria-label="Application Navigation">
    <div class="brand">
      <img class="logo" src={logoUrl} alt="Caffoot hedgehog logo"/>
      {#if !collapsed}
        <div><div class="brand-name">Caffoot <span>Lite</span></div><div class="brand-caption">INFRASTRUCTURE, SIMPLIFIED.</div></div>
      {/if}
    </div>
    {#if !collapsed}<div class="nav-caption">WORKSPACE</div>{/if}
    <nav class="side-nav" aria-label="Main Sections">
      {#each sections as section}
        <button type="button" disabled={section !== 'Devices'} class:current={section === 'Devices'} title={section}
          aria-current={section === 'Devices' ? 'page' : undefined}>
          <span class="nav-glyph" aria-hidden="true">{section === 'Devices' ? '▣' : section === 'IPAM' ? '⌘' : section === 'Network Racks' ? '▤' : section === 'Audit Trail' ? '◷' : section === 'Users' ? '♙' : section === 'Settings & Data' ? '⚙' : '▦'}</span>
          {#if !collapsed}<span>{section}</span>{/if}
        </button>
      {/each}
    </nav>
    <div class="nav-bottom">
      <button class="collapse-btn" type="button" on:click={() => collapsed = !collapsed} aria-expanded={!collapsed} aria-label={collapsed ? 'Expand Menu' : 'Collapse Menu'}>
        <span aria-hidden="true">{collapsed ? '»' : '«'}</span>{#if !collapsed}<span>Collapse Menu</span>{/if}
      </button>
    </div>
  </aside>

  <div class="workspace">
    <header class="topbar">
      <div class="breadcrumb">Workspace <span>›</span> <strong>Devices</strong></div>
      <a class="account" href="/inventory" aria-label="Return to existing Caffoot Lite application">
        <span class="avatar">A</span><span class="account-label">Back to Caffoot Lite</span>
      </a>
    </header>

    <main class="main-content">
      <div class="eyebrow">INFRASTRUCTURE INVENTORY</div>
      <div class="page-heading">
        <div><h1>Devices</h1><p>Explore the devices recorded in your inventory.</p></div>
        <span class="preview-label">Read-only integration test</span>
      </div>
      <div class="top-tabs" role="tablist" aria-label="Device Sections">
        <button type="button" role="tab" aria-selected="false" disabled>Overview</button>
        <button type="button" role="tab" aria-selected="true">Device Inventory</button>
        <button type="button" role="tab" aria-selected="false" disabled>Device Types</button>
        <button type="button" role="tab" aria-selected="false" disabled>Locations</button>
        <button type="button" role="tab" aria-selected="false" disabled>Manufacturers</button>
        <button type="button" role="tab" aria-selected="false" disabled>Models</button>
        <button type="button" role="tab" aria-selected="false" disabled>Software</button>
        <button type="button" role="tab" aria-selected="false" disabled>Server Services</button>
      </div>

      <section class="intro-card" aria-label="Integration test information">
        <div>
          <h2>Real Device Details · Read Only</h2>
          <p>This development-only screen reads the existing Caffoot Lite Devices API. It cannot edit, create, delete, allocate or save any records. Use the normal application for all other functions.</p>
        </div>
        <a class="btn btn-outline" href="/inventory">Open existing app</a>
      </section>

      {#if loading}
        <section class="inventory-card integration-message" role="status"><p>Loading devices…</p></section>
      {:else if error}
        <section class="inventory-card integration-message" role="alert">
          <h2>Unable to show devices</h2><p>{error}</p>
          {#if unauthorised}<a class="btn btn-primary" href="/setup">Sign in</a>{/if}
          {#if !unauthorised && !forbidden}<button class="btn btn-outline" on:click={refresh}>Try again</button>{/if}
        </section>
      {:else}
        <section class="inventory-card" aria-label="Device Inventory">
          <div class="inventory-header"><h2>Device Inventory</h2><span>{devices.length} {devices.length === 1 ? 'device' : 'devices'}</span></div>
          {#if devices.length === 0}
            <div class="integration-message" role="status">No devices have been recorded yet.</div>
          {:else}
            <div class="table-wrap"><table>
              <thead><tr><th>Device Name</th><th>Type</th><th>Primary IP</th><th>Location</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {#each devices as row (row.id)}
                  <tr>
                    <td><strong>{row.name || 'Unnamed device'}</strong></td>
                    <td>{isVirtual(row) ? 'Virtual Machine' : row.type || 'Not recorded'}</td>
                    <td>{row.primaryIp || '—'}</td>
                    <td>{row.location || '—'}</td>
                    <td><span class="status"><span class="status-dot"></span>{row.status || 'Active'}</span></td>
                    <td><button type="button" class="btn btn-outline" on:click={(event) => openDetails(row, event.currentTarget)}>Details</button></td>
                  </tr>
                {/each}
              </tbody>
            </table></div>
          {/if}
        </section>
      {/if}
    </main>
  </div>
</div>

{#if device}
  <div class="overlay">
    <section class="dialog" role="dialog" aria-modal="true" tabindex="-1" aria-labelledby="device-details-title" bind:this={dialog}>
      <header class="dialog-head">
        <div class="dialog-title-row">
          <div><p class="dialog-eyebrow">DEVICE DETAILS</p>
            <h2 id="device-details-title">{device.name || 'Unnamed device'}</h2>
            <p class="dialog-subtitle">{virtual ? 'Virtual Machine' : device.type || 'Device'} · {device.location || 'Unknown location'} · {device.status || 'Active'}</p>
          </div>
          <button class="close-btn" type="button" on:click={closeDetails} aria-label="Close device window">×</button>
        </div>
        <div class="dialog-tabs" role="tablist" aria-label="Device Details Sections">
          {#each tabs as item}
            <button type="button" role="tab" aria-selected={activeTab === item[0]} class:active={activeTab === item[0]} on:click={() => activeTab = item[0]}>
              {item[1]}
            </button>
          {/each}
        </div>
      </header>

      <div class="dialog-body" role="tabpanel">
        {#if activeTab === 'overview'}
          <div class="detail-grid">
            <article class="panel">
              <h3><span class="mini-icon">▣</span> Device Overview</h3><p>Recorded identity and status</p>
              <dl class="facts">
                <div><dt>Device Name</dt><dd>{device.name || '—'}</dd></div>
                <div><dt>Type</dt><dd>{virtual ? 'Virtual Machine' : device.type || '—'}</dd></div>
                <div><dt>Status</dt><dd><span class="chip">{device.status || 'Active'}</span></dd></div>
                <div><dt>Primary IP</dt><dd>{device.primaryIp || '—'}</dd></div>
                <div><dt>Location Area</dt><dd>{device.location || '—'}</dd></div>
                <div><dt>Operating System</dt><dd>{platformFor(device)}</dd></div>
              </dl>
            </article>
            {#if virtual}
              <article class="panel">
                <h3><span class="mini-icon">▤</span> Allocated Virtual Hardware</h3><p>Resources allocated to this VM, not its host's physical hardware.</p>
                <dl class="facts">
                  <div><dt>vCPUs</dt><dd>{device.vmVcpu ?? '—'}</dd></div>
                  <div><dt>Allocated RAM (GB)</dt><dd>{device.vmRamGb ?? '—'}</dd></div>
                  <div><dt>Virtual Disk (GB)</dt><dd>{device.vmDiskGb ?? '—'}</dd></div>
                  <div><dt>Virtual Network Adapters</dt><dd>{device.vmNicCount ?? '—'}</dd></div>
                </dl>
              </article>
            {:else}
              <article class="panel">
                <h3><span class="mini-icon">▤</span> At a Glance</h3><p>Existing inventory and mounting details</p>
                <dl class="facts">
                  <div><dt>Manufacturer</dt><dd>{device.manufacturer || '—'}</dd></div>
                  <div><dt>Model</dt><dd>{device.model || '—'}</dd></div>
                  <div><dt>Serial Number</dt><dd>{device.serialNumber || '—'}</dd></div>
                  <div><dt>Mounting</dt><dd>{device.mountType || '—'}</dd></div>
                  <div><dt>Rack</dt><dd>{!rackAccess ? 'Restricted to Racks users' : mountedRack?.name || 'Not assigned'}</dd></div>
                </dl>
              </article>
            {/if}

            {#if virtual}
              <article class="panel full">
                <h3><span class="mini-icon">⌘</span> Physical Host</h3><p>Host relationship from the saved device record</p>
                {#if host}
                  <div class="related"><div><strong>{host.name}</strong><small>Physical host</small></div>
                    <button type="button" class="btn btn-outline" on:click={() => showRelated(host)}>View Host</button>
                  </div>
                {:else}<p>Missing or unavailable physical host. The saved reference has not been changed.</p>{/if}
              </article>
            {/if}
            <article class="panel full">
              <h3><span class="mini-icon">≡</span> Notes</h3><p>Saved device notes</p>
              <div class="note-preview">{device.notes || 'No notes recorded.'}</div>
            </article>
          </div>

        {:else if activeTab === 'virtual-machines' && !virtual}
          <article class="panel"><h3>Hosted Virtual Machines</h3><p>Existing host–guest relationships are preserved.</p>
            {#if guests.length}
              {#each guests as guest (guest.id)}
                <div class="related"><div><strong>{guest.name || 'Unnamed VM'}</strong><small>{guest.status || 'Active'} · {guest.primaryIp || 'No primary IP'}</small></div>
                  <button type="button" class="btn btn-outline" on:click={() => showRelated(guest)}>View Details</button>
                </div>
              {/each}
            {:else}
              <p>No hosted virtual machines are recorded.</p>
            {/if}
          </article>

        {:else if activeTab === 'hardware' && !virtual}
          <article class="panel full">
            <h3>Hardware &amp; Lifecycle</h3><p>Physical-device hardware only</p>
            <dl class="facts">
              <div><dt>Manufacturer</dt><dd>{device.manufacturer || '—'}</dd></div>
              <div><dt>Model</dt><dd>{device.model || '—'}</dd></div>
              <div><dt>Serial Number</dt><dd>{device.serialNumber || '—'}</dd></div>
              <div><dt>Device Type</dt><dd>{device.type || '—'}</dd></div>
              <div><dt>Status</dt><dd>{device.status || 'Active'}</dd></div>
            </dl>
          </article>

        {:else if activeTab === 'network'}
          <article class="panel">
            <h3>Network Identity</h3><p>Network address recorded on this device</p>
            <dl class="facts">
              <div><dt>Primary IP</dt><dd>{device.primaryIp || 'Not assigned'}</dd></div>
              <div><dt>IPAM</dt><dd>Use the existing IPAM screen for subnet, reservation and allocation details.</dd></div>
            </dl>
          </article>

        {:else if activeTab === 'software'}
          <div class="detail-grid">
            <article class="panel">
              <h3>Operating System / Platform</h3><p>Saved software and hypervisor details</p>
              <dl class="facts">
                <div><dt>Operating System</dt><dd>{platformFor(device)}</dd></div>
                <div><dt>Version</dt><dd>{versionFor(device) || '—'}</dd></div>
                {#if virtual}<div><dt>Host Platform</dt><dd>{device.virtualPlatform || '—'}</dd></div>{/if}
              </dl>
            </article>
            <article class="panel">
              <h3>Recorded Services</h3><p>Service flags in this device record</p>
              {#if savedSelections(device,'serverService_').length}
                <div class="tag-list">{#each savedSelections(device,'serverService_') as service}<span>{service}</span>{/each}</div>
              {:else}<p>No service flags recorded.</p>{/if}
              <p class="integration-detail-note">Full software catalogue labels will be checked in the Devices migration stage.</p>
            </article>
          </div>

        {:else if activeTab === 'location'}
          <article class="panel">
            <h3>Location &amp; Mounting</h3><p>Existing saved location and rack information</p>
            <dl class="facts">
              <div><dt>Location Area</dt><dd>{device.location || '—'}</dd></div>
              {#if virtual}
                <div><dt>Physical Host</dt><dd>{host?.name || 'Missing or unavailable host'}</dd></div>
                <div><dt>Rack Placement</dt><dd>Inherited from physical host</dd></div>
              {:else if rackAccess}
                <div><dt>Rack</dt><dd>{mountedRack?.name || 'Not assigned'}</dd></div>
                {#if mountedRack}
                  <div><dt>Rack Face</dt><dd>{device.face || 'front'}</dd></div>
                  <div><dt>Start U</dt><dd>{device.rackUStart ?? '—'}</dd></div>
                  <div><dt>End U</dt><dd>{device.rackUEnd ?? device.rackUStart ?? '—'}</dd></div>
                {/if}
              {:else}
                <div><dt>Rack Placement</dt><dd>Requires Racks access</dd></div>
              {/if}
            </dl>
          </article>

        {:else if activeTab === 'history'}
          <article class="panel">
            <h3>Previous Type Details</h3><p>Historical configurations saved on this device</p>
            {#each device.previousTypeDetails || [] as previous, index}
              <div class="related"><div><strong>{previous.type || 'Previous type'}</strong><small>Saved configuration {index + 1}</small></div></div>
            {/each}
            <p>Change History permissions and older records remain in the existing application.</p>
          </article>
        {/if}
      </div>
      <footer class="dialog-footer">
        <span class="integration-readonly">Read-only · no changes can be saved</span>
        <button class="btn btn-outline" type="button" on:click={closeDetails}>Close</button>
      </footer>
    </section>
  </div>
{/if}

<style>
  .integration-message { padding: 24px; color: #4d6c85; }
  .integration-message h2 { font-size: 17px; margin-bottom: 8px; }
  .integration-message p { margin-bottom: 14px; }
  .integration-readonly { margin-right: auto; font-size: 11px; color: #6b8194; font-weight: 750; }
  .integration-detail-note { margin-top: 15px !important; font-style: italic; }
  .intro-card a { white-space: nowrap; text-decoration: none; }
  .account { text-decoration: none; }
  .related + .related { margin-top: 10px; }
  @media (max-width:640px) {.intro-card a{align-self:flex-start}.integration-readonly{max-width:155px;}}
</style>
