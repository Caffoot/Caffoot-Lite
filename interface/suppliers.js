/* Supplier pages share the existing inventory tables, cards and modal shell. */
'use strict';
(function () {
  const api = '/api/suppliers';
  const tabs = [
    ['overview', 'Overview', 'grid'], ['locations', 'Locations', 'network'],
    ['contacts', 'Contacts', 'users'], ['notes', 'Notes', 'history']
  ];
  let config, active = false, requestId = 0, draftId = 0, pending = false, returnDialog;
  let directory, supplier, supplierId, tab = 'overview', loading = false, error = '';
  let search = '', categoryFilter = '', contactSearch = '', contactFilter = '', noteFilter = 'all';

  const safe = value => config.escape(value);
  const icon = name => config.icon('i-' + name);
  const editable = () => config?.canEdit();
  const list = (items, fallback = 'Not Recorded') => items.filter(Boolean).map(safe).join('<br>') || fallback;
  const locationAddress = location => list(location ? [location.address, location.city, location.postcode, location.country] : []);
  const labelStatus = state => ({active: 'Active', archived: 'Archived', disabled: 'Disabled'})[state];
  const badge = state => `<span class="device-status ${state === 'active' ? '' : state === 'disabled' ? 'retired' : 'maintenance'}">${labelStatus(state)}</span>`;
  const findContact = id => supplier.contacts.find(item => item.id === id);
  const findLocation = id => supplier.locations.find(item => item.id === id);
  const findNote = id => supplier.notes.find(item => item.id === id);
  const options = (entries, selected) => entries.map(([value, label]) =>
    `<option value="${safe(value)}"${String(value) === String(selected) ? ' selected' : ''}>${safe(label)}</option>`).join('');

  function button(label, action, id = '', style = 'btn-outline') {
    return `<button class="btn ${style}" type="button" data-supplier-action="${action}" data-id="${safe(id)}">${safe(label)}</button>`;
  }
  function nameButton(label, action, id) {
    return `<button class="device-name" type="button" data-supplier-action="${action}" data-id="${id}">${safe(label)}</button>`;
  }
  function header(title, heading, actions = '') {
    return `<div class="section-page-header"><div class="eyebrow">Purchasing</div>
      <div class="header"><div><h1 tabindex="-1" id="supplier-page-heading">${safe(title)}</h1><p>${safe(heading)}</p></div>
      ${actions ? `<div class="preview-page-actions">${actions}</div>` : ''}</div></div>`;
  }
  function sectionHeading(title, description, actions = '') {
    return `<div class="section-heading"><div><h2>${title}</h2><p>${description}</p></div><div class="preview-page-actions">${actions}</div></div>`;
  }
  function table(headings, rows, empty, id = '') {
    return `<div class="device-table-card"><div class="device-table-scroll" tabindex="0" role="region" aria-label="${safe(headings[0])} table">
      <table class="device-table"><thead><tr>${headings.map(label => `<th scope="col">${label}</th>`).join('')}</tr></thead>
      <tbody${id ? ` id="${id}"` : ''}>${rows || emptyRow(headings.length, empty)}</tbody></table></div></div>`;
  }
  function emptyRow(columns, message) {
    return `<tr><td colspan="${columns}"><div class="department-empty">${safe(message)}</div></td></tr>`;
  }
  function field(label, name, value = '', {type = 'text', attrs = '', wide = false} = {}) {
    const control = type === 'textarea'
      ? `<textarea class="input" id="supplier-${name}" name="${name}" ${attrs}>${safe(value)}</textarea>`
      : `<input class="input" id="supplier-${name}" name="${name}" type="${type}" value="${safe(value)}" ${attrs}>`;
    return `<div class="preview-form-field${wide ? ' staff-span-two' : ''}"><label for="supplier-${name}">${label}</label>${control}</div>`;
  }
  function select(label, name, entries, value = '') {
    return `<div class="device-filter"><label for="supplier-${name}">${label}</label>
      <select id="supplier-${name}" name="${name}">${options(entries, value)}</select></div>`;
  }
  function toolSearch(label, id, value, filter, placeholder) {
    return `<div class="device-toolbar"><div class="supplier-filters">
      <div><label class="device-search-label" for="${id}">${label}</label><div class="device-search-wrap">${icon('users')}
      <input class="device-search" id="${id}" type="search" value="${safe(value)}" placeholder="${placeholder}" autocomplete="off"></div></div>
      ${filter}</div></div>`;
  }
  function card(title, content, action = '') {
    return `<article class="card card-padded"><div class="row-between supplier-row"><h3>${title}</h3>${action}</div>${content}</article>`;
  }
  function info(label, value) {
    return `<div class="info-row"><label>${label}</label><b>${value || 'Not Recorded'}</b></div>`;
  }
  function webLink(url, label) {
    try {
      const parsed = new URL(url);
      if (['https:', 'http:'].includes(parsed.protocol) && !parsed.username && !parsed.password)
        return `<a class="inline-link" href="${safe(parsed.href)}" target="_blank" rel="noopener noreferrer">${safe(label)}</a>`;
    } catch (_) { /* Render invalid stored values as text. */ }
    return safe(label);
  }
  function categoryTags(ids, catalogue) {
    return catalogue.filter(item => ids.includes(item.id)).map(item =>
      `<span class="pill">${safe(item.name)}${item.archived ? ' (Archived)' : ''}</span>`).join(' ') || '—';
  }
  function directoryResults() {
    const query = search.trim().toLocaleLowerCase('en-GB');
    const matches = directory.suppliers.filter(item =>
      (!categoryFilter || item.categoryIds.includes(Number(categoryFilter))) &&
      (item.name + ' ' + item.description).toLocaleLowerCase('en-GB').includes(query));
    const rows = matches.map(item => `<tr><td>${nameButton(item.name, 'open', item.id)}${item.city ? `<div class="sub">${safe(item.city)}</div>` : ''}</td>
      <td>${categoryTags(item.categoryIds, directory.categories)}</td><td>${item.locationCount}</td><td>${item.contactCount}</td>
      <td>${badge(item.status)}</td><td class="supplier-table-actions">${button('View', 'open', item.id)}</td></tr>`).join('');
    return {rows, count: matches.length};
  }
  function renderDirectory() {
    const {rows, count} = directoryResults();
    const activeCategories = directory.categories.filter(item => !item.archived);
    return header('Suppliers', 'Manage supplier companies, locations and contacts.',
      editable() ? button('Manage Categories', 'categories') + button('Add Supplier', 'supplier-form', '', 'primary') : '') +
      `<nav class="tabs" aria-label="Supplier Sections">
        <button type="button" class="tab section-tab-control active" aria-current="page" data-supplier-action="directory">${icon('users')}Supplier Directory</button></nav>
      <section class="stock-panel" aria-label="Supplier Directory">
      ${toolSearch('Search Suppliers', 'supplier-search', search,
        select('Filter By Category', 'category-filter', [['', 'All Categories'], ...activeCategories.map(item => [item.id, item.name])], categoryFilter),
        'Search by supplier name or description')}
      <div class="device-results-head"><div><h2>Supplier Directory</h2><p id="supplier-result-count" aria-live="polite">Showing ${count} of ${directory.suppliers.length} suppliers</p></div></div>
      ${table(['Supplier Name', 'Categories', 'Locations', 'Contacts', 'Status', 'Actions'], rows, 'No Suppliers Match These Filters', 'supplier-directory-rows')}</section>`;
  }
  function contactScope(contact) {
    return contact.companyWide ? 'Company-wide' : contact.locationIds.map(id => {
      const location = findLocation(id);
      return location ? location.name + (location.archived ? ' (Archived)' : '') : '';
    }).filter(Boolean).join(', ');
  }
  function lifecycleButtons(record, item, status = item.archived ? 'archived' : 'active') {
    if (!editable()) return '';
    const key = record === 'supplier' ? '' : item.id;
    let lifecycle = status === 'archived' ? button('Reactivate', record + '.reactivate', key) : button('Archive', record + '.archive', key);
    if (record === 'supplier' && item.hasSupplyHistory)
      lifecycle = config.admin ? button(status === 'disabled' ? 'Re-enable' : 'Disable', status === 'disabled' ? 'supplier.enable' : 'supplier.disable') : '';
    const removal = item.deleteReason ? `<p class="sub supplier-retention">${safe(item.deleteReason)}${record === 'supplier' && item.hasSupplyHistory && !config.admin ? ' An administrator can change its availability.' : ''}</p>`
      : button('Delete', record + '.delete', key);
    return lifecycle + removal;
  }
  function renderOverview() {
    const location = supplier.locations.find(item => item.main);
    const information = info('Supplier Name', safe(supplier.name)) +
      info('Supplier Description', `<span class="supplier-note-text">${safe(supplier.description || 'Not Recorded')}</span>`) +
      info('Website', webLink(supplier.website, supplier.website)) + info('Company Address', locationAddress(location)) +
      info('Categories', categoryTags(supplier.categoryIds, supplier.categories));
    const metrics = [['Locations', 'locations', supplier.locations], ['Contacts', 'contacts', supplier.contacts]].map(([label, key, data]) =>
      `<button class="card card-padded stat stock-report-metric" type="button" data-supplier-action="tab" data-id="${key}">
        <span class="statnum">${data.filter(item => !item.archived).length}</span><span class="stathead">${label}</span></button>`).join('');
    return sectionHeading('Supplier Overview', 'Company details and a summary of the supplier relationship.') +
      `<div class="two-col">${card('Company Information', information + '<p class="sub">The company address uses the Main Office Location.</p>',
        editable() ? button('Edit', 'supplier-form', supplier.id) : '')}
      ${card('At A Glance', '<div class="supplier-metrics">' + metrics + '</div>')}</div>`;
  }
  function renderLocations() {
    const entries = supplier.locations.map(location => {
      const contacts = supplier.contacts.filter(contact => contact.companyWide || contact.locationIds.includes(location.id));
      const rows = contacts.map(contact => `<tr><td>${nameButton(contact.name, 'contact-details', contact.id)}
        ${contact.archived ? badge('archived') : ''}</td><td>${safe(contact.role || '—')}</td><td>${safe(contactScope(contact))}</td>
        <td>${button('View', 'contact-details', contact.id)}</td></tr>`).join('');
      return card(safe(location.name) + (location.main ? ' <span class="pill">Primary Address</span>' : '') +
        (location.archived ? ' ' + badge('archived') : ''),
        `<p class="sub">${locationAddress(location)}</p><div class="divider"></div><h3>Contacts At This Location</h3>
         ${table(['Contact', 'Role', 'Location Scope', 'Actions'], rows, 'No Contacts Recorded For This Location')}
         ${editable() ? `<div class="preview-details-actions">${location.main || location.archived ? '' : button('Make Main Office', 'location.make-main', location.id)}
           ${lifecycleButtons('location', location)}</div>` : ''}`,
        editable() ? button('Edit Location', 'location-form', location.id) : '');
    }).join('');
    return sectionHeading('Supplier Locations', 'View offices and branches and the contacts who cover them.',
      editable() ? button('Add Location', 'location-form', '', 'primary') : '') +
      `<div class="stock-card-stack">${entries}</div>`;
  }
  function contactRows() {
    const query = contactSearch.trim().toLocaleLowerCase('en-GB');
    return supplier.contacts.filter(contact => (contact.name + ' ' + contact.role + ' ' + contact.emails.join(' '))
      .toLocaleLowerCase('en-GB').includes(query) &&
      (!contactFilter || contact.companyWide || contactFilter !== 'company' && contact.locationIds.includes(Number(contactFilter))))
      .map(contact => `<tr><td>${nameButton(contact.name, 'contact-details', contact.id)}${contact.archived ? badge('archived') : ''}</td>
      <td>${safe(contact.role || '—')}</td><td>${safe(contactScope(contact))}</td><td>${safe(contact.phones[0] || '—')}</td>
      <td>${safe(contact.emails[0] || '—')}</td><td>${button('View Details', 'contact-details', contact.id)}</td></tr>`).join('');
  }
  function renderContacts() {
    const locations = supplier.locations.map(location =>
      [location.id, location.name + (location.archived ? ' (Archived)' : '') + ' + Company-wide']);
    return sectionHeading('Supplier Contacts', 'Find people by name, email or the locations they cover.',
      editable() ? button('Add Contact', 'contact-form', '', 'primary') : '') +
      toolSearch('Search Contacts', 'supplier-contact-search', contactSearch, select('Filter Contacts By Location',
        'contact-filter', [['', 'All Contacts'], ['company', 'Company-wide'], ...locations], contactFilter), 'Search by name, role or email') +
      `<div class="supplier-results">${table(['Name', 'Role', 'Location', 'Telephone', 'Email', 'Actions'],
        contactRows(), 'No Contacts Match These Filters', 'supplier-contact-rows')}</div>`;
  }
  function formatDate(value) {
    return new Intl.DateTimeFormat('en-GB', {dateStyle: 'medium', timeStyle: 'short'}).format(new Date(value));
  }
  function noteCards(notes, contactDetail = false) {
    return notes.map(note => {
      const contact = findContact(note.contactId);
      const meta = `<p class="sub">Added by ${safe(note.createdBy)} · <time datetime="${safe(note.createdAt)}">${formatDate(note.createdAt)}</time>
        ${note.updatedAt ? `<br>Edited by ${safe(note.updatedBy)} · <time datetime="${safe(note.updatedAt)}">${formatDate(note.updatedAt)}</time>` : ''}</p>`;
      const actions = (!contactDetail && contact ? button('View Contact', 'contact-details', contact.id) : '') +
        (editable() ? button('Edit', 'note-form', note.id) + button('Delete', 'note.delete', note.id) : '');
      return `<div class="card card-padded"><div class="row-between supplier-row"><div><h3>${safe(contact?.name || 'Supplier Note')}</h3>${meta}</div>
        <div class="preview-page-actions">${actions}</div></div><p class="supplier-note-text">${safe(note.text)}</p></div>`;
    }).join('');
  }
  function renderNotes() {
    const notes = supplier.notes.filter(note => noteFilter === 'all' || (noteFilter === 'supplier') === (note.contactId === null));
    return sectionHeading('Notes', 'Read notes about the company and its contacts.',
      editable() ? button('Add Supplier Note', 'note-form', '', 'primary') : '') +
      `<div class="device-toolbar supplier-results">${select('Filter Notes By Owner', 'note-filter',
        [['all', 'All Notes'], ['supplier', 'Supplier Notes'], ['contacts', 'Contact Notes']], noteFilter)}</div>
      <div class="stock-card-stack">${noteCards(notes) || card('No Notes Match Your Filter', '')}</div>`;
  }
  function renderDetails() {
    const content = {overview: renderOverview, locations: renderLocations, contacts: renderContacts, notes: renderNotes}[tab]();
    return header(supplier.name, 'Supplier Details',
      button('Back To Suppliers', 'directory') + (editable() ? button('Edit Supplier', 'supplier-form', supplier.id) : '')) +
      `<div class="row-between supplier-row">${badge(supplier.status)}<div class="preview-page-actions">${lifecycleButtons('supplier', supplier, supplier.status)}</div></div>
      <nav class="tabs" role="tablist" aria-label="Supplier Details Tabs">${tabs.map(([key, label, symbol]) =>
        `<button type="button" class="tab section-tab-control${tab === key ? ' active' : ''}" role="tab" id="supplier-tab-${key}"
        aria-selected="${tab === key}" aria-controls="supplier-panel" tabindex="${tab === key ? '0' : '-1'}"
        data-supplier-action="tab" data-id="${key}">${icon(symbol)}${label}</button>`).join('')}</nav>
      <section class="stock-panel" id="supplier-panel" role="tabpanel" aria-labelledby="supplier-tab-${tab}">${content}</section>`;
  }
  function render() {
    let content;
    if (loading || error) content = header('Suppliers', 'Supplier Directory', supplierId ? button('Back To Suppliers', 'directory') : '') +
      `<p role="status">${safe(error || 'Loading Suppliers…')}</p>${error ? button('Try Again', 'retry') : ''}`;
    else if (supplier) content = renderDetails();
    else if (directory) content = renderDirectory();
    else content = '';
    return `<div class="users-live stock-live supplier-live">${content}</div>`;
  }

  async function request(path, payload) {
    const response = await fetch(path, payload ? {
      method: 'POST', headers: {'Content-Type': 'application/json', 'X-CSRF-Token': config.csrf},
      body: JSON.stringify(payload), cache: 'no-store'
    } : {cache: 'no-store'});
    const body = await response.json();
    if (!response.ok) throw Error(response.status === 403 ? 'Suppliers access is unavailable. Check Optional Features and your permissions.' : body.error);
    return body;
  }
  function readRoute() {
    const route = /^#suppliers(?:\/([1-9]\d*)(?:\/(overview|locations|contacts|notes))?)?$/.exec(location.hash);
    return [route?.[1] ? Number(route[1]) : null, route?.[2] || 'overview'];
  }
  function writeRoute(identity, view) {
    const hash = '#suppliers' + (identity ? '/' + identity + '/' + view : '');
    if (location.hash !== hash) history.pushState(null, '', hash);
  }
  async function show(identity, view = 'overview', navigate = true, focus = '') {
    if (navigate) writeRoute(identity, view);
    if (identity !== supplierId) {
      contactSearch = contactFilter = '';
      noteFilter = 'all';
    }
    supplierId = identity;
    tab = view;
    if (supplier && supplier.id === identity && !error) {
      config.redraw();
      if (focus) document.getElementById(focus)?.focus({preventScroll: true});
      return;
    }
    const generation = ++requestId;
    supplier = null;
    directory = null;
    loading = true;
    error = '';
    config.redraw();
    try {
      const data = await request(identity ? api + '/' + identity : api);
      if (generation !== requestId) return;
      if (identity) supplier = data;
      else {
        directory = data;
        if (categoryFilter && !data.categories.some(item => item.id === Number(categoryFilter) && !item.archived)) categoryFilter = '';
      }
    } catch (failure) {
      if (generation !== requestId) return;
      error = failure.message;
    }
    if (generation !== requestId) return;
    loading = false;
    config.redraw();
    if (focus) document.getElementById(focus)?.focus();
  }

  function dialog(title, description, content, {submit = '', build, destructive = false, restore, success} = {}) {
    returnDialog = restore;
    submitDialog = build && {build, success, restore};
    config.openModal(`<div class="equipment-dialog users-live stock-live supplier-live" data-supplier-dialog>
      <header class="assignment-modal-head"><div><h2>${safe(title)}</h2>${description ? `<p class="sub">${safe(description)}</p>` : ''}</div>
      <button type="button" class="btn btn-outline" data-action="close-modal" aria-label="Close Dialog">×</button></header>
      <div class="assignment-modal-body">${build ? `<form class="preview-aligned-form" data-supplier-form>
        ${content}<p class="formhint supplier-feedback" data-supplier-feedback role="alert"></p>
        <div class="stock-form-actions"><button class="btn btn-outline" type="button" data-action="close-modal">Cancel</button>
        <button class="btn ${destructive ? 'bg-rose-700 hover:bg-rose-800 text-white' : 'primary'}" type="submit">${safe(submit)}</button></div></form>`
        : `${content}<div class="stock-form-actions"><button class="btn btn-outline" type="button" data-action="close-modal">Close</button></div>`}</div></div>`);
    if (build && !destructive) document.querySelector('[data-supplier-form] input:not([type="checkbox"]),[data-supplier-form] textarea')?.focus();
  }

  let submitDialog;
  const required = 'required maxlength="160"';
  const lines = value => String(value || '').split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const valueOf = (data, key) => String(data.get(key) || '').trim();
  const selectedIds = (data, key) => data.getAll(key).map(Number);
  function addressFields(location = {}, adding = false) {
    return field('Address', 'address', location.address, {attrs: 'maxlength="400" placeholder="Street And Building"', wide: true}) +
      field('Town / City', 'city', location.city, {attrs: 'maxlength="160"'}) +
      field('Postcode', 'postcode', location.postcode, {attrs: 'maxlength="40"'}) +
      field('Country', 'country', location.country ?? (adding ? 'United Kingdom' : ''), {attrs: 'maxlength="160"', wide: true});
  }
  function readAddress(data) {
    return Object.fromEntries(['address', 'city', 'postcode', 'country'].map(key => [key, valueOf(data, key)]));
  }
  function checkList(name, values, selected) {
    return `<div class="supplier-check-list">${values.map(item =>
      `<label class="stock-check"><input type="checkbox" name="${name}" value="${item.id}" ${selected.includes(item.id) ? 'checked' : ''}>
      ${safe(item.name)}${item.archived ? ' (Archived)' : ''}</label>`).join('')}</div>`;
  }
  function formSection(title, description, content, actions = '') {
    return `<fieldset class="supplier-form-section"><legend>${title}</legend>
      ${description || actions ? `<div class="row-between supplier-row"><p class="sub">${description}</p>${actions}</div>` : ''}${content}</fieldset>`;
  }
  function contactEntry(index) {
    const prefix = 'entry-' + (++draftId);
    return `<div class="card card-padded" data-supplier-contact-entry data-prefix="${prefix}">
      <div class="row-between supplier-row"><h3>Contact ${index}</h3>${button('Remove', 'remove-entry')}</div>
      <div class="staff-fields">${field('Contact Name', prefix + '-name', '', {attrs:'maxlength="160" placeholder="Contact Name"'})}
        ${field('Role / Job Title', prefix + '-role', '', {attrs:'maxlength="160" placeholder="Account Manager"'})}
        ${field('Telephone Numbers', prefix + '-phones', '', {type:'textarea', attrs:'placeholder="One Per Line"'})}
        ${field('Email Addresses', prefix + '-emails', '', {type:'textarea', attrs:'placeholder="One Per Line"'})}
        <div class="staff-span-two">${select('Contact Scope', prefix + '-scope', [['main', 'Main Office'], ['company', 'Company-wide']], 'main')}</div></div></div>`;
  }
  function supplierForm() {
    const existing = supplier;
    const catalogue = existing?.categories || directory.categories;
    const selected = existing?.categoryIds || [];
    const categories = checkList('categoryIds', catalogue.filter(item => !item.archived || selected.includes(item.id)), selected);
    const company = `<div class="staff-fields">
      ${field('Supplier Name *', 'name', existing?.name, {attrs: required + ' placeholder="Example Supplier Ltd" autocomplete="off"'})}
      ${field('Website', 'website', existing?.website, {type: 'url', attrs: 'maxlength="2048" placeholder="https://www.example.com"'})}
      ${field('Supplier Description', 'description', existing?.description, {type: 'textarea', attrs: 'maxlength="4000" placeholder="What does this supplier provide?"', wide: true})}</div>`;
    const location = existing?.locations.find(item => item.main);
    const content = company +
      formSection('Main Office Address', existing ? 'Changes here also update the Main Office Location.' : 'This address creates the first Location, named Main Office by default.',
        `<div class="staff-fields">${addressFields(location, !existing)}</div>`) +
      formSection('Supplier Categories', 'Select any categories that apply to this company.', categories) +
      (existing ? '' : formSection('Contacts', 'Enter any contacts you already have.',
        `<div id="supplier-contact-entries" class="stock-card-stack">${contactEntry(1)}</div>`, button('Add Another Contact', 'add-entry')));
    dialog(existing ? 'Edit Supplier' : 'Add Supplier', existing ? existing.name : 'Capture Company Details, Categories And Contacts', content, {
      submit: existing ? 'Save Supplier' : 'Add Supplier',
      build(form) {
        const data = new FormData(form);
        const payload = {name: valueOf(data, 'name'), website: valueOf(data, 'website'),
          description: valueOf(data, 'description'), address: readAddress(data), categoryIds: selectedIds(data, 'categoryIds')};
        if (!existing) payload.contacts = [...form.querySelectorAll('[data-supplier-contact-entry]')].map(entry => {
          const prefix = entry.dataset.prefix;
          return {name: valueOf(data, prefix + '-name'), role: valueOf(data, prefix + '-role'),
            phones: lines(data.get(prefix + '-phones')), emails: lines(data.get(prefix + '-emails')),
            companyWide: data.get(prefix + '-scope') === 'company'};
        });
        return command('supplier.save', payload, existing);
      },
      success: data => updateSupplier(data, !existing)
    });
  }
  function locationForm(location) {
    dialog(location ? 'Edit Location' : 'Add Location', supplier.name, `<div class="staff-fields">
      ${field('Location Name *', 'name', location?.name, {attrs: required + ' placeholder="Manchester Branch"', wide: true})}
      ${addressFields(location, !location)}</div>`, {
      submit: location ? 'Save Location' : 'Add Location',
      build(form) {
        const data = new FormData(form);
        return command('location.save', {name: valueOf(data, 'name'), address: readAddress(data)}, supplier, location);
      },
      success: updateSupplier
    });
  }
  function contactForm(contact, restore) {
    const selected = contact?.locationIds || [];
    const choices = supplier.locations.filter(item => !item.archived || selected.includes(item.id));
    const wide = contact?.companyWide || !choices.length;
    const content = `<div class="staff-fields">
      ${field('Contact Name *', 'name', contact?.name, {attrs: required})}
      ${field('Job Title / Role', 'role', contact?.role, {attrs: 'maxlength="160" placeholder="Account Manager"'})}
      ${field('Telephone Numbers', 'phones', contact?.phones.join('\n'), {type:'textarea', attrs:'placeholder="One Telephone Number Per Line"'})}
      ${field('Email Addresses', 'emails', contact?.emails.join('\n'), {type:'textarea', attrs:'placeholder="One Email Address Per Line"'})}
      ${field('Professional / Social Links', 'profiles', contact?.profiles.map(item => item.label + ' | ' + item.url).join('\n'),
        {type:'textarea', attrs:'placeholder="LinkedIn | https://www.linkedin.com"', wide:true})}</div>` +
      formSection('Contact Scope', 'Company-wide Contacts appear at every Location. Otherwise choose one or more Locations.',
        `<label class="stock-check"><input type="checkbox" id="supplier-company-wide" name="companyWide" ${wide ? 'checked' : ''}> Company-wide Contact</label>
         <div id="supplier-contact-locations" ${wide ? 'hidden' : ''}>${checkList('locationIds', choices, selected)}</div>`);
    dialog(contact ? 'Edit Contact' : 'Add Contact', supplier.name, content, {
      submit: contact ? 'Save Contact' : 'Add Contact', restore,
      build(form) {
        const data = new FormData(form);
        const companyWide = data.has('companyWide');
        const profiles = lines(data.get('profiles')).map(profile => {
          const separator = profile.indexOf('|');
          if (separator < 1 || !profile.slice(separator + 1).trim())
            throw Error('Enter each professional link as Label | https://example.com.');
          return {label: profile.slice(0, separator).trim(), url: profile.slice(separator + 1).trim()};
        });
        return command('contact.save', {name: valueOf(data, 'name'), role: valueOf(data, 'role'),
          phones: lines(data.get('phones')), emails: lines(data.get('emails')), profiles,
          companyWide, locationIds: companyWide ? [] : selectedIds(data, 'locationIds')}, supplier, contact);
      },
      success: data => { updateSupplier(data); restore?.(); }
    });
  }
  function contactDetails(contact) {
    if (!contact) return;
    const content = `<div data-supplier-contact-details="${contact.id}" class="stock-card-stack">
      <div class="row-between supplier-row"><p class="sub">${safe(contact.role)} ${contact.archived ? badge('archived') : ''}</p>
      <div class="preview-page-actions">${editable() ? button('Edit Contact', 'contact-form', contact.id) : ''}</div></div>
      <div class="two-col">
        ${card('Contact Information', info('Telephone', list(contact.phones)) + info('Email', list(contact.emails)) +
          info('Locations', safe(contactScope(contact))) + info('Professional Links', contact.profiles.map(item => webLink(item.url, item.label)).join('<br>')))}
        ${card('Contact Notes', `<div class="stock-card-stack supplier-results">${noteCards(supplier.notes.filter(note => note.contactId === contact.id), true)
          || '<p class="sub">No Contact Notes Yet.</p>'}</div>`, editable() ? button('Add Note', 'new-contact-note', contact.id) : '')}</div>
      ${editable() ? `<div class="preview-page-actions">${lifecycleButtons('contact', contact)}</div>` : ''}</div>`;
    dialog(contact.name, 'Contact Details', content);
  }
  function noteForm(note, contactId, restore) {
    const contact = findContact(contactId);
    dialog(`${note ? 'Edit' : 'Add'} ${contact ? 'Contact' : 'Supplier'} Note`, contact?.name || supplier.name,
      field('Note *', 'note', note?.text, {type:'textarea', attrs:'rows="5" required maxlength="12000" placeholder="Record useful information or a conversation."'}), {
        submit: note ? 'Save Changes' : 'Save Note', restore,
        build: form => command('note.save', {contactId, text: valueOf(new FormData(form), 'note')}, supplier, note),
        success: data => { updateSupplier(data); restore?.(); }
      });
  }
  function categoriesDialog() {
    const rows = directory.categories.map(item => `<tr><td>${safe(item.name)}</td><td>${badge(item.archived ? 'archived' : 'active')}</td>
      <td class="supplier-table-actions">${button('Rename', 'category-form', item.id)}
      ${button(item.archived ? 'Reactivate' : 'Archive', item.archived ? 'category.reactivate' : 'category.archive', item.id)}</td></tr>`).join('');
    dialog('Manage Supplier Categories', 'Archived categories stay on existing Supplier records.',
      table(['Category', 'Status', 'Actions'], rows, 'No Supplier Categories') +
      `<div class="preview-details-actions">${button('Add Category', 'category-form', '', 'primary')}</div>`);
  }
  function categoryForm(category) {
    dialog(category ? 'Rename Category' : 'Add Category', 'Supplier Categories',
      field('Category Name *', 'name', category?.name, {attrs:'required maxlength="70"'}), {
        submit: category ? 'Save Category' : 'Add Category', restore: categoriesDialog,
        build: form => command('category.save', {name: valueOf(new FormData(form), 'name')}, null, category),
        success: updateCategories
      });
  }

  function command(operation, data, company = null, record = null) {
    const result = {operation, data};
    if (company) Object.assign(result, {supplierId: company.id, revision: company.revision});
    if (record) {
      result.recordId = record.id;
      if (!company) result.revision = record.revision;
    }
    return result;
  }
  function updateSupplier(data, newCompany = false) {
    supplier = data;
    supplierId = data.id;
    if (newCompany) {
      tab = 'overview';
      writeRoute(data.id, tab);
    }
    if (contactFilter && contactFilter !== 'company' && !findLocation(Number(contactFilter))) contactFilter = '';
    config.redraw();
    document.getElementById(newCompany ? 'supplier-page-heading' : 'supplier-tab-' + tab)?.focus({preventScroll: !newCompany});
  }
  function updateCategories(data) {
    directory = data;
    if (categoryFilter && !data.categories.some(item => item.id === Number(categoryFilter) && !item.archived)) categoryFilter = '';
    config.redraw();
    categoriesDialog();
  }
  function statusConfirmation(operation, identity, restore) {
    const [kind, verb] = operation.split('.');
    const record = {supplier, location: supplier && findLocation(identity), contact: supplier && findContact(identity),
      note: supplier && findNote(identity), category: directory?.categories.find(item => item.id === identity)}[kind];
    if (!record) return;
    const label = {supplier: 'Supplier', category: 'Supplier Category', location: 'Location', contact: 'Contact', note: 'Note'}[kind];
    const title = verb === 'make-main' ? 'Make Main Office' : `${verb[0].toUpperCase() + verb.slice(1)} ${label}`;
    const descriptions = {
      delete: kind === 'supplier' ? 'Permanently delete this Supplier and its unused Locations and Contacts.' : `Permanently delete this ${label}.`,
      archive: `Archive this ${label} and keep its existing history and relationships.`,
      reactivate: `Return this ${label} to active use with its existing record and history.`,
      'make-main': 'Use this Location as the company address. Existing Contact assignments stay with their Locations.'
    };
    dialog(title + '?', record.name || (record.contactId ? findContact(record.contactId)?.name : supplier?.name),
      `<p>${descriptions[verb]}</p>`, {
        submit: title, destructive: verb === 'delete', restore: kind === 'category' ? categoriesDialog : restore,
        build: () => command(operation, {confirmed: true}, kind === 'category' ? null : supplier, kind === 'supplier' ? null : record),
        success(data) {
          if (kind === 'category') updateCategories(data);
          else if (kind === 'supplier' && verb === 'delete') void show(null);
          else {
            updateSupplier(data);
            if (kind !== 'contact' || verb !== 'delete') restore?.();
          }
        }
      });
  }
  async function supplyConfirmation(operation) {
    const id = supplier.id;
    const impact = await request(api + '/' + id + '/impact');
    if (!active || supplier?.id !== id) return;
    if (impact.revision !== supplier.revision || !impact.sections.length)
      throw Error('This Supplier changed. Reopen its details to review the current impact.');
    const enable = operation === 'supplier.enable';
    const submit = enable ? 'Re-enable Supplier' : 'Disable Supplier';
    dialog(submit + '?', supplier.name, `<p>Affected sections: ${safe(impact.sections.join(' and '))}.</p>
      <p>${enable ? 'This Supplier will be available for new selections.' : 'This Supplier will be unavailable for new selections.'}
      Its existing associations and supply history will be retained.</p>`, {
        submit,
        build: () => command(operation, {confirmed: true, sections: impact.sections}, supplier),
        success: updateSupplier
      });
  }
  function refreshRows() {
    const directoryRows = document.getElementById('supplier-directory-rows');
    if (directoryRows && directory) {
      const {rows, count} = directoryResults();
      directoryRows.innerHTML = rows || emptyRow(6, 'No Suppliers Match These Filters');
      document.getElementById('supplier-result-count').textContent = `Showing ${count} of ${directory.suppliers.length} suppliers`;
    }
    const contacts = document.getElementById('supplier-contact-rows');
    if (contacts && supplier) contacts.innerHTML = contactRows() || emptyRow(6, 'No Contacts Match These Filters');
  }

  document.addEventListener('click', event => {
    const target = event.target.closest('[data-supplier-action]');
    if (!target || !active || pending) return;
    const action = target.dataset.supplierAction;
    const identity = Number(target.dataset.id);
    const details = target.closest('[data-supplier-contact-details]');
    const restore = details && (() => contactDetails(findContact(Number(details.dataset.supplierContactDetails))));
    switch (action) {
      case 'directory': if (supplierId || error) void show(null, 'overview', true, 'supplier-page-heading'); break;
      case 'retry': void show(supplierId, tab, false); break;
      case 'open': void show(identity, 'overview', true, 'supplier-page-heading'); break;
      case 'tab': {
        const selected = target.dataset.id;
        void show(supplierId, selected, true, 'supplier-tab-' + selected);
        break;
      }
      case 'contact-details': contactDetails(findContact(identity)); break;
      default:
        if (!editable()) return;
        switch (action) {
          case 'supplier-form': supplierForm(); break;
          case 'location-form': locationForm(findLocation(identity)); break;
          case 'contact-form': contactForm(findContact(identity), restore); break;
          case 'new-contact-note': noteForm(null, identity, restore); break;
          case 'note-form': {
            const note = findNote(identity);
            noteForm(note, note?.contactId ?? null, restore);
            break;
          }
          case 'categories': categoriesDialog(); break;
          case 'category-form': categoryForm(directory.categories.find(item => item.id === identity)); break;
          case 'add-entry': {
            const entries = document.getElementById('supplier-contact-entries');
            entries.insertAdjacentHTML('beforeend', contactEntry(entries.children.length + 1));
            entries.lastElementChild.querySelector('input').focus();
            break;
          }
          case 'remove-entry': {
            target.closest('[data-supplier-contact-entry]').remove();
            [...document.getElementById('supplier-contact-entries').children].forEach((entry, index) => {
              entry.querySelector('h3').textContent = 'Contact ' + (index + 1);
            });
            document.querySelector('[data-supplier-action="add-entry"]').focus();
            break;
          }
          case 'supplier.disable':
          case 'supplier.enable':
            void supplyConfirmation(action).catch(failure => config.notify(failure.message, 'error'));
            break;
          default: statusConfirmation(action, identity, restore);
        }
    }
  });
  document.addEventListener('submit', event => {
    const form = event.target;
    if (!form.matches('form[data-supplier-form]')) return;
    event.preventDefault();
    if (!editable() || pending || !submitDialog) return;
    const {build, success} = submitDialog;
    const feedback = form.querySelector('[data-supplier-feedback]');
    const submit = form.querySelector('button[type="submit"]');
    pending = submit.disabled = true;
    form.dataset.saving = 'true';
    void (async () => {
      try {
        const data = await request(api, build(form));
        delete form.dataset.saving;
        config.closeModal(true);
        success(data);
        config.notify('Supplier changes saved.');
      } catch (failure) {
        feedback.textContent = failure.message;
      } finally {
        delete form.dataset.saving;
        pending = submit.disabled = false;
      }
    })();
  });
  document.addEventListener('input', event => {
    if (!active) return;
    if (event.target.id === 'supplier-search') search = event.target.value;
    else if (event.target.id === 'supplier-contact-search') contactSearch = event.target.value;
    else return;
    refreshRows();
  });
  document.addEventListener('change', event => {
    if (!active) return;
    const {id, value, checked} = event.target;
    if (id === 'supplier-category-filter') categoryFilter = value;
    else if (id === 'supplier-contact-filter') contactFilter = value;
    else if (id === 'supplier-note-filter') {
      noteFilter = value;
      config.redraw();
      document.getElementById(id)?.focus();
      return;
    } else if (id === 'supplier-company-wide') {
      document.getElementById('supplier-contact-locations').hidden = checked;
      return;
    } else return;
    refreshRows();
  });
  document.addEventListener('keydown', event => {
    const target = event.target.closest('[role="tab"][id^="supplier-tab-"]');
    if (!target || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = tabs.findIndex(([key]) => key === tab);
    const next = {Home: 0, End: tabs.length - 1, ArrowLeft: (index + tabs.length - 1) % tabs.length,
      ArrowRight: (index + 1) % tabs.length}[event.key];
    const selected = tabs[next][0];
    void show(supplierId, selected, true, 'supplier-tab-' + selected);
  });

  window.caffootSuppliers = {
    configure(settings) { config = settings; },
    enter(fromRoute = false) {
      active = true;
      void show(...(fromRoute ? readRoute() : [null, 'overview']), !fromRoute);
    },
    leave() {
      active = false;
      requestId++;
      directory = supplier = supplierId = null;
      loading = false;
      error = '';
    },
    closed(force) {
      const restore = returnDialog;
      returnDialog = submitDialog = null;
      if (!force) restore?.();
    },
    render
  };
})();
