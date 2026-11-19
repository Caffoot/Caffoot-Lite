/* Equipment Lifecycle controls within the existing Settings, Device and Dashboard screens. */
(() => {
  'use strict';

  const dates = [
    ['purchaseDate','Purchase Date','Enter the actual purchase date, if known.'],
    ['originalInServiceDate','Original In Service Date','Enter or correct the date this equipment first entered service.'],
    ['warrantyExpiry','Warranty Expiry','Enter the confirmed warranty expiry, if known.'],
    ['replacementOverride','Planned Replacement Date',''],
  ];
  // Present recorded ISO calendar dates in the approved UK DD/MM/YYYY format.
  const day = 86400000;
  const asDate = value => new Date(value+'T00:00:00Z');
  const dateLabel = value => value ? value.slice(8,10)+'/'+value.slice(5,7)+'/'+value.slice(0,4) : 'Not recorded';
  const typeLabel = name => window.caffootPublicDeviceTypeName?.(name || 'Unknown') ?? (name === 'Server - Physical' ? 'Server' : name === 'Server - Virtual' ? 'Virtual Machine' : name || 'Unknown');
  const esc = value => String(value ?? '').replace(/[&<>"']/g,
    character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const yearsLabel = years => years ? `${years} ${years===1?'year':'years'}` : 'Lifespan Not Set';

  function addYears(value, years) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !years) return '';
    const date = asDate(value);
    if (!Number.isFinite(date.getTime()) || date.getUTCFullYear()+years>9999) return '';
    const month = date.getUTCMonth();
    date.setUTCFullYear(date.getUTCFullYear()+years);
    if (date.getUTCMonth()!==month) date.setUTCDate(0);
    return date.toISOString().slice(0,10);
  }

  function renderDetails(values, type, field) {
    return renderInterfaceTemplate('device-details/lifecycle-details', [
      dates.map(([key,label])=>field(label,dateLabel(
        key==='replacementOverride'?values.plannedReplacementDate:values[key]))).join(''),
      values.replacementOverride?'Manual override':
        `Calculated · ${esc(typeLabel(type))} · ${yearsLabel(values.lifespan)}`,
    ]);
  }

  function bindEditor(form, saved, today, type, admin, restored) {
    const anchor = form.querySelector('[data-action="hardware-catalog-manage"]')?.closest('.device-review-catalogue-actions');
    if (!anchor) return;
    anchor.insertAdjacentHTML('afterend',renderInterfaceTemplate('device-details/lifecycle-editor',[
      dates.map(([key,label,help])=>renderInterfaceTemplate('device-details/lifecycle-field',[
        key,label,key==='replacementOverride'&&!admin?'readonly':'',
        ['purchaseDate','originalInServiceDate'].includes(key)?`max="${esc(today)}"`:'',
        help,
      ])).join(''),
    ]));
    const section = form.querySelector('[data-lifecycle-editor]');
    const input = key=>section.querySelector('[data-lifecycle-field="'+key+'"]');
    const planned = input('replacementOverride');
    const mode = section.querySelector('[data-lifecycle-replacement-mode]');
    const suggestion = section.querySelector('[data-lifecycle-warranty]');
    const accept = suggestion.querySelector('button');
    const reset = section.querySelector('[data-lifecycle-reset]');
    const update = () => {
      const purchase = input('purchaseDate').value;
      const service = input('originalInServiceDate').value;
      const warranty = input('warrantyExpiry').value;
      const calculated = addYears(service || purchase,saved.lifespan);
      const suggested = addYears(purchase,1);
      const manual = mode.value==='manual';
      if (!manual) planned.value=calculated;
      planned.setAttribute('aria-invalid',String(manual&&!planned.value));
      section.querySelector('#lifecycle-help-replacementOverride').textContent = manual
        ? 'Manually overridden date.' : 'Calculated from the service date or purchase date and the type lifespan.';
      section.querySelector('[data-lifecycle-mode-title]').textContent = manual
        ? 'Manual Replacement Override' : 'Calculated Replacement Date';
      section.querySelector('[data-lifecycle-mode-description]').textContent = manual
        ? 'The recorded date stays fixed when the dates or lifespan used for calculation change.'
        : `${typeLabel(type)} · ${yearsLabel(saved.lifespan)} · ${dateLabel(calculated)}`;
      reset.hidden=!(admin&&manual);
      suggestion.hidden=!suggested||!!warranty;
      suggestion.querySelector('[data-lifecycle-suggestion]').textContent=suggested?`Suggested Expiry · ${dateLabel(suggested)}`:'';
      accept.dataset.suggested=suggested;
      window.caffootUkDates?.sync(section);
    };
    const values={...saved,...restored};
    for (const [key] of dates) input(key).value=values[key]||'';
    mode.value=values.replacementOverride?'manual':'calculated';
    section.addEventListener('input',event=>{
      const backing = event.target.closest('.caffoot-uk-date-wrap')?.querySelector('[data-lifecycle-field]');
      if(event.target===planned || backing===planned) mode.value='manual';
      update();
    });
    accept.addEventListener('click',()=>{
      input('warrantyExpiry').value=accept.dataset.suggested;
      update();
      if (window.caffootUkDates) window.caffootUkDates.focus(input('warrantyExpiry'));
      else input('warrantyExpiry').focus();
    });
    reset.addEventListener('click',()=>{
      mode.value='calculated';
      update();
      if (window.caffootUkDates) window.caffootUkDates.focus(planned);
      else planned.focus();
    });
    form.lifecycleDraft = () => Object.fromEntries(dates.map(([key])=>[
      key,key==='replacementOverride'&&mode.value==='calculated'?null:input(key).value||null,
    ]));
    form.lifecycleChanges = () => {
      if (window.caffootUkDates && !window.caffootUkDates.validate(form))
        throw new Error('Enter a valid date in DD/MM/YYYY format.');
      if (mode.value==='manual'&&!planned.value)
        throw new Error('Enter a Planned Replacement Date or choose Use Calculated Date.');
      for (const [key,label] of dates) {
        const control=input(key);
        if (control.validity.badInput || control.value&&!/^\d{4}-\d{2}-\d{2}$/.test(control.value))
          throw new Error(`Enter a valid ${label}.`);
        if (control.validity.rangeOverflow) throw new Error(`${label} cannot be in the future.`);
      }
      return Object.fromEntries(Object.entries(form.lifecycleDraft()).filter(([key,value])=>value!==saved[key]));
    };
    update();
  }

  const conditions = [
    ['warranty-upcoming','Warranty Expiring Soon','i-history','orange'],
    ['warranty-past','Warranty Expired','i-alert','orange'],
    ['replacement-upcoming','Replacement Due Soon','i-history',''],
    ['replacement-past','Replacement Overdue','i-alert','orange'],
  ];

  function renderDashboard(values, devices, active) {
    const byId = new Map(devices.map(device=>[device.id,device]));
    const rows = values.devices.flatMap(dates=>{
      const device=byId.get(dates.deviceId);
      if(!device)return [];
      const status=device.status||'Active';
      const categories=[];
      if(status!=='Retired'){
        if(dates.warrantyWarning)categories.push('warranty-'+dates.warrantyWarning);
        if(dates.replacementWarning)categories.push('replacement-'+dates.replacementWarning);
      }
      return [{...dates,name:device.name,type:device.type||'Unknown',status,categories}];
    });
    const counts = new Map(conditions.map(([key])=>[key,0]));
    for(const {categories} of rows)
      for(const category of categories) counts.set(category,counts.get(category)+1);
    const captions = [
      `Warranty expires within ${values.warrantyDays} days`,'Recorded warranty date has passed',
      `Planned replacement within ${values.replacementDays} days`,'Planned replacement date has passed',
    ];
    const typeChoices = [...new Set(rows.map(row=>row.type))].sort((a,b)=>typeLabel(a).localeCompare(typeLabel(b)));
    const html = renderInterfaceTemplate('dashboard/lifecycle-panel',[
      active?'':'hidden',
      conditions.map(([key,label,icon,tone],index)=>renderInterfaceTemplate('dashboard/lifecycle-metric',[
        key,label,counts.get(key),icon,tone,captions[index],
      ])).join(''),
      conditions.map(([key,label])=>`<option value="${key}">${label}</option>`).join(''),
      typeChoices.map(value=>`<option value="${esc(value)}">${esc(typeLabel(value))}</option>`).join(''),
    ]);
    return {html,rows,today:values.today};
  }

  function bindDashboard(panel, dashboard, openDevice) {
    if (!panel || !dashboard) return;
    const filters = panel.querySelector('form');
    const buttons = [...panel.querySelectorAll('[data-lifecycle-category]')];
    const result = panel.querySelector('[data-lifecycle-results]');
    const count = panel.querySelector('[data-lifecycle-count]');
    const category = filters.elements.attention;
    const search = filters.elements.search;
    const type = filters.elements.deviceType;
    const retired = filters.elements.retired;
    const closest = row => Math.min(...[row.warrantyExpiry,row.plannedReplacementDate]
      .filter(Boolean).map(value=>Math.abs((asDate(value)-asDate(dashboard.today))/day)),Infinity);
    const ordered = [...dashboard.rows].sort((a,b)=>closest(a)-closest(b)||a.name.localeCompare(b.name));
    const render = () => {
      const query=search.value.trim().toLowerCase();
      const rows=ordered.filter(row=>{
        const isHistorical=row.status==='Retired'&&retired.checked&&category.value==='all';
        const matchingCondition=category.value==='all'?row.categories.length:row.categories.includes(category.value);
        return (matchingCondition || isHistorical && (row.warrantyExpiry || row.plannedReplacementDate
            || row.purchaseDate || row.originalInServiceDate))
          && (!type.value||row.type===type.value)
          && (!query||`${row.name} ${typeLabel(row.type)} ${row.status}`.toLowerCase().includes(query));
      });
      result.innerHTML=rows.length?renderInterfaceTemplate('dashboard/lifecycle-table',[
        rows.map(row=>renderInterfaceTemplate('dashboard/lifecycle-row',[
          esc(row.deviceId),esc(row.name),esc(typeLabel(row.type)),esc(row.status),
          esc(dateLabel(row.warrantyExpiry)),esc(dateLabel(row.plannedReplacementDate)),
          row.status==='Retired'?'<span class="lifecycle-attention">Retired · Historical Dates</span>':
            row.categories.map(key=>`<span class="lifecycle-attention ${key.endsWith('-past')?'is-past':''}">${conditions.find(item=>item[0]===key)[1]}</span>`).join(''),
        ])).join(''),
      ]):'<p class="db-empty-note">No Devices match the current selection.</p>';
      count.textContent=`Showing ${rows.length} ${rows.length===1?'Device':'Devices'}`;
      buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.lifecycleCategory===category.value)));
    };
    buttons.forEach(button=>button.addEventListener('click',()=>{
      category.value=category.value===button.dataset.lifecycleCategory?'all':button.dataset.lifecycleCategory;
      render();
    }));
    result.addEventListener('click',event=>{
      const button=event.target.closest('[data-lifecycle-device]');
      if(button)openDevice(button.dataset.lifecycleDevice);
    });
    filters.addEventListener('submit',event=>event.preventDefault());
    filters.addEventListener('change',render);
    search.addEventListener('input',render);
    filters.addEventListener('reset',()=>queueMicrotask(()=>{
      type.dispatchEvent(new Event('device-dropdown-refresh'));
      render();
    }));
    render();
  }

  window.caffootLifecycle = {renderDetails,bindEditor,renderDashboard,bindDashboard};
})();
