<script>
  import { onMount, tick } from 'svelte';
  import logoUrl from '../../../assets/caffoot-logo-256.png';
  import { devices, platformOptions, softwareSuggestions, serviceSuggestions } from './pilot-data.js';

  const sections = ['Dashboard', 'Devices', 'IPAM', 'Network Racks', 'Audit Trail', 'Users', 'Settings & Data'];
  let selectedId = 'host';
  let mode = 'details';
  let tab = 'overview';
  let dialogOpen = true;
  let dialogElement;
  let collapsed = false;
  let readOnly = false;
  let draft = {};
  let softwareSearch = '';
  let serviceSearch = '';
  let notice = '';
  let validation = '';

  $: device = devices.find((item) => item.id === selectedId) ?? devices[0];
  $: isVm = device.kind === 'virtual';
  $: detailTabs = [
    ['overview', 'Overview'],
    ...(!isVm && device.hosting ? [['virtual-machines', 'Virtual Machines']] : []),
    ...(!isVm ? [['hardware', 'Hardware']] : []),
    ['network', 'Network'],
    ['software', 'Software'],
    ['location', 'Location']
  ];
  $: editTabs = [
    ['general', 'General'],
    ...(!isVm ? [['hardware', 'Hardware']] : []),
    ['software', 'Software & Firmware'],
    ['networking', 'Networking'],
    ['notes', 'Notes']
  ];

  onMount(() => { if (dialogOpen) dialogElement?.focus(); });

  async function focusDialog() {
    await tick();
    dialogElement?.focus();
  }

  function showDetails(id) {
    selectedId = id;
    mode = 'details';
    tab = 'overview';
    dialogOpen = true;
    validation = '';
    notice = '';
    focusDialog();
  }

  function editDevice() {
    if (readOnly) return;
    draft = {
      ...device,
      software: [...device.software],
      services: [...device.services]
    };
    softwareSearch = '';
    serviceSearch = '';
    mode = 'edit';
    tab = 'general';
    notice = '';
    validation = '';
    focusDialog();
  }

  function cancelEdit() {
    mode = 'details';
    tab = 'overview';
    notice = '';
    validation = '';
    focusDialog();
  }

  function closeDialog() {
    dialogOpen = false;
    mode = 'details';
    notice = '';
    validation = '';
  }

  function savePreview() {
    if (readOnly) {
      validation = 'This example account has read-only access.';
      return;
    }
    if (!draft.name.trim()) {
      tab = 'general';
      validation = 'Enter a device name first.';
      return;
    }
    if (!draft.location) {
      tab = 'general';
      validation = 'Select a Location Area first.';
      return;
    }
    if (isVm && !draft.host) {
      tab = 'general';
      validation = 'Select a physical hypervisor host.';
      return;
    }
    if (!isVm && draft.mount === 'Rack Mounted' && (!(Number(draft.rackU) > 0) || !(Number(draft.rackHeight) > 0))) {
      tab = 'general';
      validation = 'Enter a valid rack start U and equipment height.';
      return;
    }
    validation = '';
    notice = 'Preview only — no device, IP address or rack placement was saved.';
  }

  function toggleRole() {
    readOnly = !readOnly;
    if (readOnly && mode === 'edit') cancelEdit();
    notice = '';
  }

  function handleKeyboard(event) {
    if (!dialogOpen) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      if (mode === 'edit') cancelEdit();
      else closeDialog();
    }
    if (event.key === 'Tab' && dialogElement) {
      const focusable = [...dialogElement.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]')].filter((item) => item.getClientRects().length);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogElement)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialogElement)) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  function showExampleNotice() {
    notice = 'This section is outside the Device Details pilot. Nothing was changed.';
  }
</script>

<svelte:window on:keydown={handleKeyboard} />

<div class:collapsed class="shell">
  <aside class="sidebar" aria-label="Application Navigation">
    <div class="brand">
      <img src={logoUrl} alt="Caffoot hedgehog logo" class="logo" />
      {#if !collapsed}
        <div><div class="brand-name">Caffoot <span>Lite</span></div><div class="brand-caption">INFRASTRUCTURE, SIMPLIFIED.</div></div>
      {/if}
    </div>
    {#if !collapsed}<div class="nav-caption">WORKSPACE</div>{/if}
    <nav class="side-nav" aria-label="Main Sections">
      {#each sections as section}
        <button type="button" class:current={section === 'Devices'} disabled={section !== 'Devices'} title={section} aria-current={section === 'Devices' ? 'page' : undefined}>
          <span class="nav-glyph" aria-hidden="true">{section === 'Devices' ? '▣' : section === 'IPAM' ? '⌘' : section === 'Network Racks' ? '▤' : section === 'Audit Trail' ? '◷' : section === 'Users' ? '♙' : section === 'Settings & Data' ? '⚙' : '▦'}</span>
          {#if !collapsed}<span>{section}</span>{/if}
        </button>
      {/each}
    </nav>
    <div class="nav-bottom">
      <button type="button" class="collapse-btn" on:click={() => collapsed = !collapsed} aria-expanded={!collapsed} aria-label={collapsed ? 'Expand Menu' : 'Collapse Menu'}>
        <span aria-hidden="true">{collapsed ? '»' : '«'}</span>{#if !collapsed}<span>Collapse Menu</span>{/if}
      </button>
    </div>
  </aside>

  <div class="workspace">
    <header class="topbar">
      <div class="breadcrumb">Workspace <span>›</span> <strong>Devices</strong></div>
      <button class="account" type="button" disabled title="My Account is not part of this pilot">
        <span class="avatar">A</span><span class="account-label">My Account</span>
      </button>
    </header>

    <main class="main-content">
      <div class="eyebrow">INFRASTRUCTURE INVENTORY</div>
      <div class="page-heading">
        <div><h1>Devices</h1><p>Explore the devices, hardware and software recorded in your inventory.</p></div>
        <span class="preview-label">Isolated Svelte Pilot</span>
      </div>
      <div class="top-tabs" role="tablist" aria-label="Device Sections">
        <button role="tab" aria-selected="false" disabled>Overview</button>
        <button role="tab" aria-selected="true">Device Inventory</button>
        <button role="tab" aria-selected="false" disabled>Device Types</button>
        <button role="tab" aria-selected="false" disabled>Locations</button>
        <button role="tab" aria-selected="false" disabled>Manufacturers</button>
        <button role="tab" aria-selected="false" disabled>Models</button>
        <button role="tab" aria-selected="false" disabled>Software</button>
        <button role="tab" aria-selected="false" disabled>Server Services</button>
      </div>

      <section class="intro-card" aria-label="Pilot information">
        <div>
          <h2>Device Details Preview</h2>
          <p>Explore the approved Details and Edit Device designs using fictional examples. No information is saved or sent to the Caffoot Lite server.</p>
        </div>
        <label class="role-toggle"><input type="checkbox" checked={readOnly} on:change={toggleRole} /> Read-Only View</label>
      </section>

      <section class="inventory-card" aria-label="Example Device Inventory">
        <div class="inventory-header">
          <h2>Device Inventory</h2>
          <span>{devices.length} example devices</span>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Device Name</th><th>Type</th><th>Primary IP</th><th>Location</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {#each devices as item}
                <tr>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.kind === 'virtual' ? 'Virtual Machine' : 'Server'}</td>
                  <td>{item.ip}</td>
                  <td>{item.location}</td>
                  <td><span class="status"><span class="status-dot"></span>{item.status}</span></td>
                  <td><button type="button" class="btn btn-outline" on:click={() => showDetails(item.id)}>Details</button></td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</div>

{#if dialogOpen}
  <div class="overlay">
    <section class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" tabindex="-1" bind:this={dialogElement}>
      <header class="dialog-head">
        <div class="dialog-title-row">
          <div>
            <p class="dialog-eyebrow">{mode === 'edit' ? 'DEVICE MANAGEMENT' : 'DEVICE DETAILS'}</p>
            <h2 id="dialog-title">{mode === 'edit' ? 'Edit Device' : device.name}</h2>
            <p class="dialog-subtitle">{mode === 'edit' ? device.name + ' · Existing device details' : (isVm ? 'Virtual Machine' : 'Server') + ' · ' + device.location + ' · ' + device.status}</p>
          </div>
          <button class="close-btn" type="button" on:click={closeDialog} aria-label="Close device window">×</button>
        </div>
        <div class="dialog-tabs" role="tablist" aria-label="Device Detail or Form Sections">
          {#each (mode === 'edit' ? editTabs : detailTabs) as item}
            <button role="tab" type="button" aria-selected={tab === item[0]} class:active={tab === item[0]} on:click={() => { tab = item[0]; validation = ''; }} >{item[1]}</button>
          {/each}
        </div>
      </header>

      {#if mode === 'details'}
        <div class="dialog-body" role="tabpanel">
          {#if tab === 'overview'}
            <div class="detail-grid">
              <article class="panel">
                <h3><span class="mini-icon">▣</span> Device Overview</h3><p>Recorded identity and status</p>
                <dl class="facts">
                  <div><dt>Device Name</dt><dd>{device.name}</dd></div>
                  <div><dt>Type</dt><dd>{isVm ? 'Virtual Machine' : 'Server'}</dd></div>
                  <div><dt>Status</dt><dd><span class="chip">{device.status}</span></dd></div>
                  <div><dt>Primary IP</dt><dd>{device.ip}</dd></div>
                  <div><dt>Location Area</dt><dd>{device.location}</dd></div>
                  <div><dt>Operating System</dt><dd>{device.platform}</dd></div>
                </dl>
              </article>
              {#if isVm}
                <article class="panel">
                  <h3><span class="mini-icon">▤</span> Allocated Virtual Hardware</h3><p>These are the VM's own allocated resources, not physical host hardware.</p>
                  <dl class="facts">
                    <div><dt>vCPUs</dt><dd>{device.virtualCpu}</dd></div>
                    <div><dt>Allocated RAM (GB)</dt><dd>{device.virtualRam}</dd></div>
                    <div><dt>Virtual Disk (GB)</dt><dd>{device.virtualDisk}</dd></div>
                    <div><dt>Virtual Network Adapters</dt><dd>{device.virtualAdapters}</dd></div>
                  </dl>
                </article>
              {:else}
                <article class="panel">
                  <h3><span class="mini-icon">▤</span> At a Glance</h3><p>Existing inventory and mounting details</p>
                  <dl class="facts">
                    <div><dt>Manufacturer</dt><dd>{device.manufacturer}</dd></div>
                    <div><dt>Model</dt><dd>{device.model}</dd></div>
                    <div><dt>Serial Number</dt><dd>{device.serial}</dd></div>
                    <div><dt>Mounting</dt><dd>{device.mount}</dd></div>
                    <div><dt>Rack</dt><dd>{device.rack}</dd></div>
                  </dl>
                </article>
              {/if}
              {#if isVm}
                <article class="panel full">
                  <h3><span class="mini-icon">⌘</span> Physical Host</h3><p>A virtual machine is hosted by a physical hypervisor.</p>
                  <div class="related"><div><strong>{device.host}</strong><small>Physical server</small></div><button class="btn btn-outline" type="button" on:click={() => showDetails('host')}>View Host</button></div>
                </article>
              {/if}
              <article class="panel full">
                <h3><span class="mini-icon">≡</span> Notes</h3><p>Saved device notes</p>
                <div class="note-preview">{device.notes}</div>
              </article>
            </div>
          {:else if tab === 'virtual-machines' && !isVm}
            <article class="panel"><h3>Hosted Virtual Machines</h3><p>Guests linked to this physical server.</p>
              <div class="related"><div><strong>App-VM-01</strong><small>Virtual Machine · Active · 10.0.10.41</small></div><button class="btn btn-outline" type="button" on:click={() => showDetails('vm')}>View Details</button></div>
            </article>
          {:else if tab === 'hardware' && !isVm}
            <div class="detail-grid">
              <article class="panel full"><h3>Hardware &amp; Lifecycle</h3><p>Physical hardware and identity</p>
                <dl class="facts"><div><dt>Manufacturer</dt><dd>{device.manufacturer}</dd></div><div><dt>Model</dt><dd>{device.model}</dd></div><div><dt>Serial Number</dt><dd>{device.serial}</dd></div><div><dt>Device Type</dt><dd>{device.type}</dd></div><div><dt>Mount Type</dt><dd>{device.mount}</dd></div></dl>
              </article>
              <article class="panel full"><h3>Host Hardware</h3><p>Example physical server hardware — not the VM allocation</p>
                <dl class="facts"><div><dt>CPU</dt><dd>Intel Xeon</dd></div><div><dt>System RAM</dt><dd>128 GB</dd></div><div><dt>Form Factor</dt><dd>1U Rack Server</dd></div></dl>
              </article>
            </div>
          {:else if tab === 'network'}
            <article class="panel"><h3>Network Identity</h3><p>Recorded IPAM information</p>
              <dl class="facts"><div><dt>Primary IP</dt><dd>{device.ip}</dd></div><div><dt>Subnet</dt><dd>{device.subnet}</dd></div><div><dt>IP Reserved</dt><dd>No</dd></div><div><dt>Status</dt><dd>{device.status}</dd></div></dl>
            </article>
          {:else if tab === 'software'}
            <div class="detail-grid">
              <article class="panel"><h3>Installed Software</h3><p>Recorded on this device</p><div class="tag-list">{#each device.software as name}<span>{name}</span>{/each}</div></article>
              <article class="panel"><h3>Server Services</h3><p>Recorded on this device</p><div class="tag-list">{#each device.services as name}<span>{name}</span>{/each}</div></article>
            </div>
          {:else if tab === 'location'}
            <article class="panel"><h3>Location &amp; Mounting</h3><p>Recorded device location</p>
              <dl class="facts"><div><dt>Location Area</dt><dd>{device.location}</dd></div>{#if isVm}<div><dt>Inherited From Host</dt><dd>{device.host}</dd></div>{:else}<div><dt>Rack</dt><dd>{device.rack}</dd></div><div><dt>Rack Face</dt><dd>{device.rackFace}</dd></div><div><dt>Start U</dt><dd>{device.rackU}</dd></div>{/if}</dl>
            </article>
          {/if}
        </div>
        <footer class="dialog-footer">
          {#if !readOnly}
            <button type="button" class="btn btn-outline" on:click={() => { showExampleNotice(); }}>Duplicate</button>
            {#if !isVm}<button type="button" class="btn btn-outline" on:click={showExampleNotice}>View in Rack</button>{/if}
            <button type="button" class="btn btn-primary" on:click={editDevice}>Edit Device</button>
            <button type="button" class="btn btn-danger" on:click={showExampleNotice}>Delete Device</button>
          {/if}
          <button type="button" class="btn btn-outline" on:click={closeDialog}>Close</button>
        </footer>
      {:else}
        <form class="editor-form" on:submit|preventDefault={savePreview} novalidate>
          <div class="dialog-body" role="tabpanel">
            <div class="preview-hint">This is an interactive design test. Save Device checks this form but never changes the real inventory or these example records.</div>
            {#if validation}<div class="validation" role="alert">{validation}</div>{/if}
            {#if tab === 'general'}
              <div class="detail-grid">
                <article class="panel full">
                  <h3>General Details</h3><p>Device identity and classification</p>
                  <div class="form-grid">
                    <div class="field"><label for="device-name">Device Name</label><input id="device-name" bind:value={draft.name} autocomplete="off" /></div>
                    <div class="field"><label for="device-type">Device Type</label><input id="device-type" value={isVm ? 'Virtual Machine' : 'Server'} disabled /><small>The device's physical or virtual identity cannot be changed after creation.</small></div>
                    <div class="field"><label for="device-status">Status</label><select id="device-status" bind:value={draft.status}><option>Active</option><option>Maintenance</option><option>Retired</option></select></div>
                    <div class="field"><label for="device-location">Location Area</label><select id="device-location" bind:value={draft.location} disabled={isVm}><option value="">Select Location</option><option>Server Room</option><option>Office</option></select>{#if isVm}<small>Inherited from the physical host.</small>{/if}</div>
                  </div>
                </article>
                {#if isVm}
                  <article class="panel full">
                    <h3>Virtual Machine &amp; Host</h3><p>A VM receives its physical hardware and location from its hypervisor.</p>
                    <div class="form-grid"><div class="field"><label for="device-host">Physical Hypervisor Host</label><select id="device-host" bind:value={draft.host}><option value="">Select Host</option><option>Hypervisor-01</option></select></div></div>
                    <h3 class="section-break">Allocated Virtual Hardware</h3>
                    <div class="form-grid">
                      <div class="field"><label for="vm-cpu">vCPUs</label><input id="vm-cpu" type="number" min="1" bind:value={draft.virtualCpu} /></div>
                      <div class="field"><label for="vm-ram">Allocated RAM (GB)</label><input id="vm-ram" type="number" min="1" bind:value={draft.virtualRam} /></div>
                      <div class="field"><label for="vm-disk">Virtual Disk (GB)</label><input id="vm-disk" type="number" min="1" bind:value={draft.virtualDisk} /></div>
                      <div class="field"><label for="vm-adapters">Network Adapters</label><input id="vm-adapters" type="number" min="1" bind:value={draft.virtualAdapters} /></div>
                    </div>
                  </article>
                {:else}
                  <article class="panel full">
                    <h3>Mounting &amp; Rack Configuration</h3><p>Rack placement in the finished application keeps its existing front/rear and collision checks.</p>
                    <div class="form-grid">
                      <div class="field"><label for="mount-type">Mount Type</label><select id="mount-type" bind:value={draft.mount}><option>Rack Mounted</option><option>Desktop</option></select></div>
                      {#if draft.mount === 'Rack Mounted'}
                        <div class="field"><label for="rack-name">Rack</label><input id="rack-name" bind:value={draft.rack} /></div>
                        <div class="field"><label for="rack-face">Rack Face</label><select id="rack-face" bind:value={draft.rackFace}><option>Front</option><option>Rear</option></select></div>
                        <div class="field"><label for="rack-u">Start U</label><input id="rack-u" type="number" min="1" bind:value={draft.rackU} /></div>
                        <div class="field"><label for="rack-height">U Height</label><input id="rack-height" type="number" min="1" bind:value={draft.rackHeight} /></div>
                      {/if}
                    </div>
                    <label class="checkbox-line"><input type="checkbox" bind:checked={draft.hosting} /> Hosts Virtual Machines</label>
                  </article>
                {/if}
              </div>
            {:else if tab === 'hardware' && !isVm}
              <article class="panel"><h3>Hardware &amp; Lifecycle</h3><p>Physical devices only</p><div class="form-grid">
                <div class="field"><label for="manufacturer">Manufacturer</label><input id="manufacturer" bind:value={draft.manufacturer} /></div>
                <div class="field"><label for="model">Model</label><input id="model" bind:value={draft.model} /></div>
                <div class="field"><label for="serial">Serial Number</label><input id="serial" bind:value={draft.serial} /></div>
              </div></article>
            {:else if tab === 'software'}
              <div class="detail-grid">
                <article class="panel full"><h3>Operating System / Platform</h3><p>Device-type-specific operating systems</p>
                  <div class="field"><label for="platform">Operating System</label><select id="platform" bind:value={draft.platform}>{#each platformOptions[device.kind] as value}<option>{value}</option>{/each}</select></div>
                </article>
                <article class="panel"><h3>Installed Software</h3><p>Search and select relevant suggestions.</p>
                  <div class="field"><label for="software-search">Search Software</label><input id="software-search" bind:value={softwareSearch} placeholder="Search Software" /></div>
                  <div class="checkbox-list">{#each softwareSuggestions[device.kind].filter((name) => name.toLowerCase().includes(softwareSearch.toLowerCase())) as name}
                    <label><input type="checkbox" value={name} bind:group={draft.software} /> {name}</label>
                  {/each}</div>
                  <small>{draft.software.length} selected</small>
                </article>
                <article class="panel"><h3>Server Services</h3><p>Search and select relevant services.</p>
                  <div class="field"><label for="services-search">Search Server Services</label><input id="services-search" bind:value={serviceSearch} placeholder="Search Server Services" /></div>
                  <div class="checkbox-list">{#each serviceSuggestions.filter((name) => name.toLowerCase().includes(serviceSearch.toLowerCase())) as name}
                    <label><input type="checkbox" value={name} bind:group={draft.services} /> {name}</label>
                  {/each}</div>
                  <small>{draft.services.length} selected</small>
                </article>
              </div>
            {:else if tab === 'networking'}
              <article class="panel"><h3>Network Configuration</h3><p>The finished application must keep IPAM reservation and allocation safeguards.</p><div class="form-grid">
                <div class="field"><label for="ip-address">Primary IP Address</label><input id="ip-address" bind:value={draft.ip} inputmode="decimal" /></div>
                <div class="field"><label for="subnet">Subnet</label><input id="subnet" bind:value={draft.subnet} /></div>
              </div></article>
            {:else if tab === 'notes'}
              <article class="panel full"><h3>Notes</h3><p>Changes in this preview are temporary.</p>
                <div class="field"><label for="device-notes">Device Notes</label><textarea id="device-notes" bind:value={draft.notes} rows="7"></textarea></div>
              </article>
            {/if}
          </div>
          <footer class="dialog-footer">
            <button type="button" class="btn btn-outline" on:click={cancelEdit}>Back to Details</button>
            <button type="submit" class="btn btn-primary">Save Device</button>
          </footer>
        </form>
      {/if}
      {#if notice}<div class="floating-notice" role="status">{notice}<button type="button" aria-label="Dismiss message" on:click={() => notice = ''}>×</button></div>{/if}
    </section>
  </div>
{/if}
