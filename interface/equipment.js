/* Device allocation views use the same server relationships on every screen. */
'use strict';
(function(){
  let config=null,dialogContext=null,selectedDevices=new Map();
  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const displayDeviceType=name=>window.caffootPublicDeviceTypeName?.(name) ?? (name==='Server - Physical'?'Server':name==='Server - Virtual'?'Virtual Machine':name);
  const dateLabel=value=>/^\d{4}-\d{2}-\d{2}$/.test(value)?value.slice(8,10)+'/'+value.slice(5,7)+'/'+value.slice(0,4):value?new Date(value).toLocaleDateString('en-GB'):'—';
  const button=(label,action,id='')=>`<button type="button" class="btn btn-outline" data-equipment-action="${action}" data-id="${escapeHtml(id)}">${label}</button>`;
  function canReadAssociations(){return !!config?.canReadAssociations();}
  async function request(path,payload){
    const response=await fetch(path,{cache:'no-store',...(payload?{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':config.csrf},body:JSON.stringify(payload)}:{})});
    const data=await response.json();
    if(!response.ok)throw Error(data.error||'Unable to load equipment.');
    return data;
  }
  function departmentPickerMarkup() {
    return `<fieldset class="equipment-department-picker assignment-field" data-department-picker hidden>
      <legend>Departments</legend>
      <label>Find A Department<input class="input" type="search" maxlength="100" data-department-search></label>
      <div data-department-choices>Loading Departments…</div>
      <p class="sub" data-department-count role="status"></p>
      <input type="hidden" data-department-selection value="[]">
    </fieldset>`;
  }
  const departmentPickers=new WeakMap();
  function departmentPicker(root,{initial=[],onChange=()=>{}}={}){
    if(departmentPickers.has(root))return departmentPickers.get(root);
    const search=root.querySelector('[data-department-search]');
    const choices=root.querySelector('[data-department-choices]');
    const count=root.querySelector('[data-department-count]');
    const selection=root.querySelector('[data-department-selection]');
    const selected=new Map(initial.map(item=>[item.id,item]));
    const retainedArchived=initial.filter(item=>item.archived);
    let matches=[], timer, generation=0;
    const render=()=>{
      const candidates=new Map([...selected,...[...retainedArchived,...matches].map(item=>[item.id,item])]);
      selection.value=JSON.stringify([...selected.keys()].sort());
      count.textContent=selected.size+' '+(selected.size===1?'Department':'Departments')+' Selected';
      choices.innerHTML=[...candidates.values()].map(item=>`<label class="device-review-check-item">
        <input type="checkbox" value="${escapeHtml(item.id)}" data-department-choice ${selected.has(item.id)?'checked':''}>
        <span>${escapeHtml(item.label)}${item.archived?' · Archived':''}</span></label>`).join('')||'<p>No Departments found.</p>';
    };
    const find=async()=>{
      const requestId=++generation, query=search.value, results=[];
      try{
        for(let offset=0;;offset+=50){
          const response=await request('/api/equipment/recipients?kind=department&query='+encodeURIComponent(query)+'&offset='+offset);
          if(!root.isConnected||requestId!==generation||search.value!==query)return;
          results.push(...response.recipients);
          if(response.recipients.length<50)break;
        }
        matches=results;render();
      }catch(error){if(root.isConnected&&requestId===generation)choices.textContent=error.message;}
    };
    search.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(find,180);});
    choices.addEventListener('change',event=>{
      const input=event.target;
      if(!input.matches('[data-department-choice]'))return;
      if(input.checked){
        const item=[...retainedArchived,...matches].find(item=>item.id===input.value);
        if(item)selected.set(item.id,item);
      }else selected.delete(input.value);
      const focus=input.value;
      render();
      [...choices.querySelectorAll('[data-department-choice]')].find(item=>item.value===focus)?.focus();
      onChange();
    });
    const picker={values:()=>[...selected.keys()]};
    departmentPickers.set(root,picker);
    render();
    void find();
    return picker;
  }
  function departmentHistory(changes){
    return changes?.length?`<h4 class="text-xs font-semibold mt-3 mb-1">Department Assignment History</h4><div class="table-scroll"><table class="small-table">
      <thead><tr><th>Department</th><th>Date / Time</th><th>Change</th><th>Recorded By</th></tr></thead>
      <tbody>${changes.flatMap(item=>[
        {label:item.label,at:item.addedAt,action:'Department Added',actor:item.addedBy},
        ...(item.removedAt?[{label:item.label,at:item.removedAt,action:'Department Removed',actor:item.removedBy}]:[])
      ]).sort((a,b)=>b.at.localeCompare(a.at)).map(item=>`<tr><td>${escapeHtml(item.label)}</td>
      <td>${escapeHtml(new Date(item.at).toLocaleString('en-GB'))}</td><td>${item.action}</td>
      <td>${escapeHtml(item.actor)}</td></tr>`).join('')}</tbody></table></div>`:'';
  }
  function assignmentHistory(history,deviceView=false){
    if(!history.length)return '<p class="sub">No equipment assignment history.</p>';
    if(!deviceView)return `<table class="staff-history-list"><tbody>${history.map(item=>`<tr><td>${escapeHtml(dateLabel(item.assignedAt))}</td><td><strong>Assigned · ${escapeHtml(item.deviceName)}</strong><small>Assigned To ${escapeHtml(item.recipientLabel)} · Recorded By ${escapeHtml(item.actorLabel)}</small>${item.closure?`<small>${({returned:'Returned',written_off:'Written Off',reassigned:'Reassigned'})[item.closure.kind]||'Closed'} ${escapeHtml(dateLabel(item.closure.date))} · Recorded By ${escapeHtml(item.closure.actor)}</small>`:''}</td></tr>`).join('')}</tbody></table>`;
    return `<h4 class="text-xs font-semibold mt-3 mb-1">Physical Assignment History</h4><div class="table-scroll"><table class="small-table"><thead><tr><th>Staff Member / Department</th><th>Issue Date</th><th>Return / End Date</th><th>Movement</th></tr></thead><tbody>${history.map(item=>`<tr><td>${escapeHtml(item.recipientLabel)}</td><td>${escapeHtml(dateLabel(item.assignedAt))}</td><td>${escapeHtml(dateLabel(item.closure?.date||item.endedAt))}</td><td>Assigned<br>Recorded By ${escapeHtml(item.actorLabel)}${item.closure?`<br>${({returned:'Returned',written_off:'Written Off',reassigned:'Reassigned'})[item.closure.kind]||'Closed'} · Recorded By ${escapeHtml(item.closure.actor)}`:''}</td></tr>`).join('')}</tbody></table></div>`;
  }
  function assetMovementHistory(history,deviceView=false){
    const labels={registered:'Device Registered',issued:'Equipment Issued',reassigned:'Device Reassigned',returned:'Equipment Returned',readiness_changed:'Equipment Prepared',written_off:'Equipment Written Off'};
    if(deviceView&&history?.some(item=>item.physicalReturnConfirmed))return `<div class="table-scroll"><table class="small-table"><thead><tr><th>Date</th><th>Movement</th><th>Recorded By</th></tr></thead><tbody>${history.map(item=>`<tr><td>${escapeHtml(dateLabel(item.date))}</td><td><strong>${labels[item.kind]||'Equipment Movement'}</strong><br>${escapeHtml(item.name)}<br>Quantity: ${item.quantity}</td><td>${escapeHtml(item.actor)}</td></tr>`).join('')}</tbody></table></div>`;
    return history?.length?`<table class="staff-history-list"><tbody>${history.map(item=>`<tr><td>${escapeHtml(dateLabel(item.date))}</td><td><strong>${labels[item.kind]||'Equipment Movement'} · ${escapeHtml(item.name)}</strong><small>Quantity: ${item.quantity} · Recorded By ${escapeHtml(item.actor)}</small></td></tr>`).join('')}</tbody></table>`:'';
  }
  function staffPlaceholder(record){
    if(!config?.canRead())return '';
    return `<div class="staff-profile-grid equipment-staff" data-equipment-staff="${escapeHtml(record.id)}" data-active="${record.active}" aria-live="polite"><p class="card cardpad" role="status">Loading assigned equipment…</p></div>`;
  }
  async function loadStaffEquipment(host){
    const id=host.dataset.equipmentStaff;
    try{
      const result=await request('/api/equipment/assignments?staffId='+encodeURIComponent(id));
      if(!host.isConnected)return;
      const rows=result.current.map(item=>`<tr><td>${escapeHtml(item.deviceName)}</td><td>Device</td><td>${escapeHtml(dateLabel(item.assignedAt))}</td><td>${button('View Device','view-device',item.deviceId)}</td></tr>`).join('')+(result.assetCurrent||[]).map(item=>`<tr><td>${escapeHtml(item.name)}</td><td>IT Asset · Quantity: ${item.outstanding}</td><td>${escapeHtml(dateLabel(item.issuedOn))}</td><td>${result.canIssueStock?button('Return Equipment','return-stock',String(item.id)):'Read Only'}</td></tr>`).join('');
      host.innerHTML=`<section class="card" aria-label="Current Equipment Assignments"><div class="staff-assignment-top"><div><h3>Assigned Equipment</h3><p class="sub">Current equipment assigned to this Staff Member.</p></div>${result.canAssign&&host.dataset.active==='true'?button('Assign Equipment','assign-staff',id):''}${result.canIssueStock&&host.dataset.active==='true'?button('Issue Equipment','issue-stock-staff',id):''}</div>${host.dataset.active!=='true'?'<p class="staff-assignment-tip">This staff member has left the company. Outstanding assignments are retained. New assignments are unavailable.</p>':''}<div class="staff-assign-table table-scroll"><table class="small-table"><thead><tr><th>Equipment</th><th>Tracking</th><th>Issue Date</th><th>Manage</th></tr></thead><tbody>${rows||'<tr><td colspan="4">No assigned equipment.</td></tr>'}</tbody></table></div><div class="staff-assign-foot">Current assignments only. Equipment history remains on its original record.</div></section><div class="staff-detail-stack"><section class="card staff-detail-card" aria-label="Assignment History"><h3>Assignment History</h3><p class="sub">The same canonical history shown on each Device.</p><div class="divider"></div>${assignmentHistory(result.history)}${assetMovementHistory(result.assetMovements)}</section><section class="card staff-detail-card"><h3>How Assignments Work</h3><p class="sub">Assign existing Devices here or from Device Details. Both actions record the same relationship.</p><div class="divider"></div><p class="staff-assignment-tip">Return Equipment records physical returns and preserves outstanding quantities. Device reissue remains a separate workflow.</p></section></div>`;
    }catch(error){if(host.isConnected)host.innerHTML='<p class="card cardpad" role="status">'+escapeHtml(error.message)+'</p>';}
  }
  async function loadDeviceEquipment(deviceId){
    const host=document.getElementById('device-details-panel-assigned');
    if(!host)return;
    host.dataset.deviceId=deviceId;
    try{
      const result=await request('/api/equipment/assignments?deviceId='+encodeURIComponent(deviceId));
      if(!host.isConnected||host.dataset.deviceId!==deviceId)return;
      const current=result.current[0];
      host.innerHTML=`<section class="device-details-section device-review-panel full"><h3><span class="mini-icon" aria-hidden="true">♙</span>Current Assignment</h3><p>Current Staff Member or Departments assigned to this Device.</p><div class="assignment-bar"><div class="assignment-main"><strong>${escapeHtml(current?.recipientLabel||'Unassigned')}</strong><small>${current?'Issue Date: '+escapeHtml(dateLabel(current.assignedAt)):'No current Staff or Department assignment.'}</small></div>${result.canAssign&&!result.dependency?button('Assign Device','assign-device',deviceId):''}${result.canManageDepartments?button('Manage Departments','manage-departments',deviceId):''}${result.handoverContext?button('Reassign Device','reassign-device',deviceId):''}${result.canReissue?button('Reissue Existing Device','reissue-device-stock',deviceId):''}${result.canReturn?button('Return Equipment','return-device-stock',result.returnSource):''}${result.canWriteOff?button('Write Off','writeoff-device-stock',deviceId):''}</div>${result.dependency?'<p class="device-review-quiet">'+escapeHtml(result.dependency)+'</p>':''}${result.reissueBlockReason?'<p class="device-review-quiet">'+escapeHtml(result.reissueBlockReason)+'</p>':''}</section><section class="device-details-section device-review-panel full"><h3><span class="mini-icon" aria-hidden="true">↻</span>Assignment History</h3><p>The same canonical assignment history is retained on this Device.</p>${assignmentHistory(result.history,true)}${departmentHistory(result.departmentChanges)}${assetMovementHistory(result.stockHistory,true)}</section>`;
      host.dataset.revision=String(result.revision);
    }catch(error){if(host.isConnected)host.innerHTML='<p role="status">'+escapeHtml(error.message)+'</p>';}
  }
  async function loadAssociatedEquipment(deviceId){
    const host=document.getElementById('device-details-panel-associated');
    if(!host)return;
    host.dataset.deviceId=deviceId;
    if(!config.canReadAssociations()){host.replaceChildren();return;}
    try{
      const result=await request('/api/equipment/associations?deviceId='+encodeURIComponent(deviceId));
      if(!host.isConnected||host.dataset.deviceId!==deviceId||!config.canReadAssociations())return;
      const current=result.current.map(record=>{const issue=record.issue;return `<tr><td><strong>${escapeHtml(issue.name)}</strong>${issue.stockUnitId?'<br>'+escapeHtml(issue.specification.serialNumber||issue.specification.assetTag||'Individually Tracked'):''}</td><td>${issue.outstanding}</td><td>${escapeHtml(issue.recipientLabel)}</td><td>${escapeHtml(dateLabel(issue.issuedOn))}</td><td>${config.canIssueStock()?'<div class="flex flex-wrap gap-2">'+button('Return Equipment','return-stock',String(issue.id))+button('Write Off','writeoff-associated',String(issue.id))+'</div>': 'Read Only'}</td></tr>`;}).join('');
      const history=result.history.map(record=>{const issue=record.issue;
        const previousOutstanding=record.assignmentEndedAt!==null&&issue.outstanding>0;
        const resolve=previousOutstanding?(config.canIssueStock()?'<div class="flex flex-wrap gap-2">'+button('Return Equipment','return-stock',String(issue.id))+button('Write Off','writeoff-associated',String(issue.id))+'</div>':'Read Only'):'—';
        return `<tr><td>${escapeHtml(issue.name)}${issue.stockUnitId?'<br>'+escapeHtml(issue.specification.serialNumber||issue.specification.assetTag||'Individually Tracked'):''}</td><td>${issue.quantity} Issued · ${issue.outstanding} Outstanding</td><td>${escapeHtml(issue.recipientLabel)}</td><td>${escapeHtml(dateLabel(record.associatedAt))}<br>Recorded By ${escapeHtml(record.actorLabel)}<br>Issued ${escapeHtml(dateLabel(issue.issuedOn))} · ${escapeHtml(issue.actor)}${record.movements.map(movement=>`<br>${escapeHtml({returned:"Returned",written_off:"Written Off",readiness_changed:"Prepared"}[movement.kind]||"Movement")} ${movement.quantity} · ${escapeHtml(dateLabel(movement.date))} · ${escapeHtml(movement.actor)}`).join('')}</td><td>${resolve}</td></tr>`;}).join('');
      host.innerHTML=`<section class="device-details-section device-review-panel full"><h3><span class="mini-icon" aria-hidden="true">▣</span>Associated Equipment</h3><p>Equipment explicitly linked to this Device. Sharing a holder does not create a link.</p><div class="assignment-bar"><div class="assignment-main"><strong>${result.current.length} Current ${result.current.length===1?'Association':'Associations'}</strong></div>${result.canAdd?button('Add Equipment','add-associated',deviceId):''}</div><div class="table-scroll"><table class="small-table"><thead><tr><th>Equipment</th><th>Outstanding</th><th>Issued To</th><th>Issue Date</th><th>Manage</th></tr></thead><tbody>${current||'<tr><td colspan="5">No currently associated equipment.</td></tr>'}</tbody></table></div></section><section class="device-details-section device-review-panel full"><h3><span class="mini-icon" aria-hidden="true">↻</span>Association History</h3><p>Original issues, quantities and technician records are retained after equipment is returned or written off. Resolve any outstanding equipment from earlier assignments here before reissuing the Device.</p><div class="table-scroll"><table class="small-table"><thead><tr><th>Equipment</th><th>Quantity</th><th>Original Holder</th><th>Association / Issue</th><th>Manage</th></tr></thead><tbody>${history||'<tr><td colspan="5">No association history.</td></tr>'}</tbody></table></div></section>`;
    }catch(error){if(host.isConnected)host.innerHTML='<p role="status">'+escapeHtml(error.message)+'</p>';}
  }
  async function openAssociatedEquipment(deviceId){
    if(!config.canReadAssociations()||!config.canEdit()||!config.canIssueStock())return;
    try{
      const result=await request('/api/equipment/associations?deviceId='+encodeURIComponent(deviceId));
      if(!result.canAdd)throw Error('An eligible current holder and Devices / IT Assets Edit are required.');
      window.caffootStockIntake.openWorkflow('issue',{association:result.context,existingIssues:result.existingIssues});
    }catch(error){config.notify(error.message,'error');}
  }

  function renderMyEquipment(){
    const section=(scope,heading,helper='')=>`<section aria-labelledby="my-equipment-${scope}-heading">
      <div class="device-results-head"><div><h2 id="my-equipment-${scope}-heading">${heading}</h2>${helper}
      <p data-equipment-count="${scope}" aria-live="polite"></p></div></div>
      <p class="my-equipment-scroll-tip" hidden>Scroll the table horizontally to see all columns and actions.</p>
      <div class="device-table-card" data-${scope}-equipment><p class="device-empty" role="status">Loading equipment…</p></div></section>`;
    return `<div class="account-page my-equipment"><div class="main"><div class="header"><div><h1>My Equipment</h1><p>Your personally assigned Devices and equipment shared with your current Department.</p></div></div>
      <section class="device-toolbar" aria-labelledby="my-equipment-filter-heading"><div class="device-toolbar-head"><div><h2 id="my-equipment-filter-heading">Search &amp; Filter Equipment</h2><p>Narrow your equipment by name, hardware or type.</p></div><button type="button" class="btn btn-outline" data-equipment-clear disabled>Clear Filters</button></div>
      <div><label class="device-search-label" for="my-equipment-search">Search Equipment</label><div class="device-search-wrap"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></svg><input class="device-search" id="my-equipment-search" type="search" autocomplete="off" placeholder="Search by name, type, manufacturer, model or operating system" disabled></div></div>
      <div class="device-filters"><label class="device-filter">Equipment Type<select data-equipment-type disabled><option value="">All types</option></select></label><label class="device-filter">Equipment Kind<select data-equipment-kind disabled><option value="">All equipment</option><option>Device</option><option>IT Asset</option></select></label></div></section>
      <div class="my-equipment-error" data-equipment-error hidden role="alert">Equipment could not be loaded. Please try again. <button type="button" class="btn btn-outline" data-equipment-retry>Try Again</button></div>
      <div data-equipment-sections>${section('personal','Assigned to Me')}${section('shared','Shared with My Department','<p>Shared equipment remains assigned to your Department.</p>')}</div>
      <dialog class="my-equipment-details" aria-labelledby="my-equipment-detail-title"><div class="modal-scroll-body">
        <header class="my-equipment-detail-head"><div><div class="eyebrow">EQUIPMENT DETAILS</div><h2 id="my-equipment-detail-title"></h2><p data-equipment-detail-scope></p></div><button type="button" class="btn btn-outline" data-equipment-detail-close aria-label="Close equipment details">Close ×</button></header>
        <div class="my-equipment-detail-body" data-equipment-detail-body></div>
        <footer class="my-equipment-detail-actions"><button type="button" class="btn btn-outline" data-equipment-detail-close>Close</button><span data-equipment-detail-report></span></footer>
      </div></dialog>
      </div></div>`;
  }
  const equipmentKind=item=>item.equipmentKind==='IT Asset'?'IT Asset':'Device';
  const equipmentType=item=>item.type?displayDeviceType(item.type):'Not recorded';
  const equipmentOS=item=>equipmentKind(item)==='IT Asset'?'Not applicable':item.operatingSystem||'Not recorded';
  const equipmentDate=item=>item.assignedAt?dateLabel(item.assignedAt):'Not recorded';
  function equipmentReport(item,scope,primary=false){
    if(!window.caffootServiceDesk.canUseEmployee())return '';
    return `<button type="button" class="btn ${primary?'btn-primary':'btn-outline'}" data-ticket-report-equipment="${escapeHtml(item.id)}" data-equipment-scope="${scope}" ${equipmentKind(item)==='IT Asset'?'data-ticket-report-asset':''} aria-label="Report A Problem With ${escapeHtml(item.name)}">Report A Problem</button>`;
  }
  const equipmentViews=new WeakSet();
  async function loadMyEquipment(container){
    const root=container.querySelector('.my-equipment');
    if(!root||equipmentViews.has(root))return;
    equipmentViews.add(root);
    const search=root.querySelector('#my-equipment-search'),type=root.querySelector('[data-equipment-type]'),kind=root.querySelector('[data-equipment-kind]'),clear=root.querySelector('[data-equipment-clear]');
    const sections=root.querySelector('[data-equipment-sections]'),error=root.querySelector('[data-equipment-error]'),dialog=root.querySelector('.my-equipment-details');
    const hosts={personal:root.querySelector('[data-personal-equipment]'),department:root.querySelector('[data-shared-equipment]')};
    let data={personal:[],department:[]},loading=false,detailGeneration=0;
    const heading=scope=>scope==='personal'?'Assigned to Me':'Shared with My Department';
    const empty=scope=>scope==='personal'?'No equipment is currently assigned to you.':'No shared equipment is currently available for your Department.';
    const controls=disabled=>[search,type,kind,clear].forEach(control=>control.disabled=disabled);
    const read=async()=>{const result=await request('/api/my-equipment');return {personal:result.assignedToMe,department:result.sharedWithMyDepartment};};
    const rows=(items,scope)=>items.map(item=>`<tr><td><b class="device-name">${escapeHtml(item.name)}</b><div class="device-detail">${equipmentKind(item)}${item.quantity?' · Quantity: '+escapeHtml(item.quantity):''}</div></td><td><span class="device-chip">${escapeHtml(equipmentType(item))}</span></td><td>${escapeHtml([item.manufacturer,item.model].filter(Boolean).join(' · ')||'Not recorded')}</td><td>${escapeHtml(equipmentOS(item))}</td><td class="my-equipment-date">${escapeHtml(equipmentDate(item))}</td><td><div class="device-actions"><button type="button" class="device-action-details" data-my-equipment-detail="${escapeHtml(item.id)}" data-equipment-scope="${scope}" aria-label="Details for ${escapeHtml(item.name)}">Details</button>${equipmentReport(item,scope)}</div></td></tr>`).join('');
    function render(){
      const query=search.value.trim().toLowerCase();
      for(const [scope,host] of Object.entries(hosts)){
        const all=data[scope],matches=all.filter(item=>(!type.value||equipmentType(item)===type.value)&&(!kind.value||equipmentKind(item)===kind.value)&&[item.name,equipmentType(item),item.manufacturer,item.model,item.operatingSystem].filter(Boolean).join(' ').toLowerCase().includes(query));
        host.parentElement.querySelector('[data-equipment-count]').textContent=`Showing ${matches.length} of ${all.length} equipment records`;
        host.parentElement.querySelector('.my-equipment-scroll-tip').hidden=!matches.length;
        host.innerHTML=matches.length?`<div class="device-table-scroll" tabindex="0" role="region" aria-label="${heading(scope)} equipment table"><table class="device-table"><thead><tr><th scope="col">Name</th><th scope="col">Type</th><th scope="col">Hardware</th><th scope="col">Operating System</th><th scope="col">Assigned date</th><th scope="col" class="my-equipment-actions-heading">Actions</th></tr></thead><tbody>${rows(matches,scope)}</tbody></table></div>`:`<div class="device-empty"><strong>${all.length?'No matching equipment':'No equipment available'}</strong>${all.length?'Try a different search or clear your filters.':empty(scope)}</div>`;
      }
    }
    async function refresh(){
      if(loading)return;
      loading=true;controls(true);
      try{
        const next=await read();if(!root.isConnected)return;
        data=next;
        const previous=type.value,types=[...new Set([...data.personal,...data.department].map(equipmentType))].sort();
        type.innerHTML='<option value="">All types</option>'+types.map(value=>`<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('');
        type.value=types.includes(previous)?previous:'';
        error.hidden=true;sections.hidden=false;controls(false);render();
      }catch(err){if(root.isConnected){data={personal:[],department:[]};Object.values(hosts).forEach(host=>host.replaceChildren());sections.hidden=true;error.hidden=false;}}
      finally{loading=false;}
    }
    function closeDetails(){++detailGeneration;if(dialog.open)dialog.close();dialog.querySelector('[data-equipment-detail-body]').replaceChildren();dialog.querySelector('[data-equipment-detail-report]').replaceChildren();}
    async function openDetails(trigger){
      const generation=++detailGeneration,scope=trigger.dataset.equipmentScope,id=trigger.dataset.myEquipmentDetail;
      const title=dialog.querySelector('#my-equipment-detail-title'),body=dialog.querySelector('[data-equipment-detail-body]'),report=dialog.querySelector('[data-equipment-detail-report]');
      title.textContent='Equipment Details';dialog.querySelector('[data-equipment-detail-scope]').textContent=heading(scope);
      body.innerHTML='<p role="status">Loading equipment…</p>';report.replaceChildren();dialog.showModal();dialog.querySelector('[data-equipment-detail-close]').focus();
      try{
        const next=await read();if(!root.isConnected||!dialog.open||generation!==detailGeneration)return;
        const item=next[scope].find(entry=>entry.id===id);
        if(!item)throw Error('This equipment is no longer available.');
        title.textContent=item.name;
        const fields=[['Equipment Type',equipmentType(item)],['Equipment Kind',equipmentKind(item)],['Manufacturer',item.manufacturer||'Not recorded'],['Model',item.model||'Not recorded']];
        if(equipmentKind(item)==='Device')fields.push(['Serial Number',item.serialNumber||'Not recorded']);
        fields.push(['Operating System',equipmentOS(item)],['Assigned date',equipmentDate(item)]);
        if(item.quantity)fields.push(['Outstanding Quantity',item.quantity]);
        const apps=item.installedSoftware||[];
        body.innerHTML=`<dl class="my-equipment-facts">${fields.map(([key,value])=>`<div><dt>${key}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl>${equipmentKind(item)==='Device'&&['Laptop','Desktop'].includes(item.type)?`<section class="my-equipment-software"><h3>Recorded Installed Software</h3><p>${apps.length?'Software names recorded against this Device. This is not a live scan.':'No installed software is recorded for this Device.'}</p>${apps.length?'<ul>'+apps.map(app=>`<li><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m5 12 4 4L19 6"/></svg>${escapeHtml(app)}</li>`).join('')+'</ul>':''}</section>`:''}`;
        report.innerHTML=equipmentReport(item,scope,true);
      }catch(err){if(root.isConnected&&dialog.open&&generation===detailGeneration){title.textContent='Equipment Details';body.textContent='Equipment details could not be loaded or are no longer available.';report.replaceChildren();}}
    }
    search.addEventListener('input',render);type.addEventListener('change',render);kind.addEventListener('change',render);
    clear.addEventListener('click',()=>{search.value=type.value=kind.value='';render();});
    error.querySelector('[data-equipment-retry]').addEventListener('click',refresh);
    root.addEventListener('click',event=>{
      const trigger=event.target.closest('[data-my-equipment-detail]');
      if(trigger)void openDetails(trigger);
      if(event.target.closest('[data-equipment-detail-close]'))closeDetails();
      // Keep the existing delegated Service Desk handler and fresh ticket eligibility checks.
      if(dialog.open&&event.target.closest('[data-equipment-detail-report] [data-ticket-report-equipment]')){
        // Closing removes the top-layer barrier, but leave the clicked control attached
        // until the existing document-level handler has consumed its attributes.
        ++detailGeneration;dialog.close();
      }
    });
    dialog.addEventListener('cancel',event=>{event.preventDefault();closeDetails();});
    await refresh();
  }
  function hydrate(container){
    container.querySelectorAll('[data-equipment-staff]').forEach(host=>void loadStaffEquipment(host));
    if(container.querySelector('[data-personal-equipment]'))void loadMyEquipment(container);
  }
  async function showAssignmentDialog(context){
    if(!config.canEdit())return;
    dialogContext=context;selectedDevices=new Map();
    if(context.deviceId)selectedDevices.set(context.deviceId,{id:context.deviceId,revision:context.revision});
    const recipientField=context.staffId||context.manage?'':`<div class="assignment-field"><label for="equipment-recipient-kind">Assign To</label><select class="input" id="equipment-recipient-kind"><option value="staff">Staff Member</option><option value="department">Department</option></select></div><div class="assignment-field"><label for="equipment-recipient-search">Find A Recipient</label><input class="input" type="search" id="equipment-recipient-search" maxlength="100"></div><div class="assignment-field"><label for="equipment-recipient">Recipient</label><select class="input" id="equipment-recipient" required><option value="">Select An Active Recipient</option></select></div>`;
    const deviceField=context.deviceId?'':`<div class="assignment-field"><label for="equipment-device-search">Find Existing Devices</label><input class="input" type="search" id="equipment-device-search" maxlength="100"></div><fieldset class="assignment-field"><legend>Devices</legend><div id="equipment-device-choices" role="status">Loading eligible Devices…</div><p class="sub" id="equipment-selection-count">0 Devices Selected</p></fieldset>`;
    const subtitle=context.manage?'Add or remove Departments that share this Device. The current custody period continues.'
      :'Record an initial allocation of existing, unassigned Devices. This does not mark equipment as physically held stock or Ready.';
    config.openModal(`<div class="equipment-dialog"><div class="assignment-modal-head"><h2>${context.manage?'Manage Departments':'Assign Equipment'}</h2><p>${subtitle}</p></div><form id="equipment-assignment-form"><div class="assignment-modal-body">${recipientField}${context.staffId?'':departmentPickerMarkup()}${deviceField}<p class="sub">${context.manage?'At least one Department must remain. Use the existing equipment workflow to end this custody period.':'Use Return Equipment to record a physical return. This form records initial Device allocation only.'}</p><p role="alert" id="equipment-assignment-feedback"></p></div><div class="assignment-modal-actions">${button('Cancel','cancel-assignment')}<button type="submit" class="btn btn-primary">${context.manage?'Save Changes':'Confirm Assignment'}</button></div></form></div>`);
    const picker=document.querySelector('#equipment-assignment-form [data-department-picker]');
    if(context.manage&&picker){picker.hidden=false;departmentPicker(picker,{initial:context.departments});}
    document.querySelector(context.manage?'[data-department-search]':'#equipment-recipient-kind,#equipment-device-search')?.focus();
    try{if(!context.staffId&&!context.manage)await searchRecipients();if(!context.deviceId)await searchDevices();}
    catch(error){const feedback=document.getElementById('equipment-assignment-feedback');if(feedback)feedback.textContent=error.message;}
  }
  async function searchRecipients(){
    const host=document.getElementById('equipment-recipient'),search=document.getElementById('equipment-recipient-search'),kind=document.getElementById('equipment-recipient-kind');
    if(!host)return;
    const picker=host.closest('form').querySelector('[data-department-picker]');
    const department=kind.value==='department';
    picker.hidden=!department;
    host.closest('.assignment-field').hidden=search.closest('.assignment-field').hidden=department;
    host.disabled=department;
    if(department){departmentPicker(picker);return;}
    const query=search.value,selectedKind=kind.value;
    const result=await request('/api/equipment/recipients?kind='+selectedKind+'&query='+encodeURIComponent(query));
    if(!host.isConnected||search.value!==query||kind.value!==selectedKind)return;
    host.innerHTML='<option value="">Select An Active Recipient</option>'+result.recipients.map(item=>`<option value="${escapeHtml(item.id)}">${escapeHtml(item.label)}</option>`).join('');
  }
  async function searchDevices(){
    const host=document.getElementById('equipment-device-choices'),search=document.getElementById('equipment-device-search');
    if(!host)return;
    const query=search.value;
    const result=await request('/api/equipment/available-devices?query='+encodeURIComponent(query));
    if(!host.isConnected||search.value!==query)return;
    host.innerHTML=result.devices.map(item=>`<label class="device-review-check-item"><input type="checkbox" data-equipment-device="${escapeHtml(item.id)}" data-revision="${item.revision}" ${selectedDevices.has(item.id)?'checked':''}><span>${escapeHtml(item.name)} · ${escapeHtml(displayDeviceType(item.type))}</span></label>`).join('')||'<p>No eligible, unassigned Devices found.</p>';
  }
  function leaveAssignmentDialog(){
    const previous=dialogContext;dialogContext=null;
    config.closeModal();
    if(previous?.deviceId){config.viewDevice(previous.deviceId);config.selectAssignedTab();}
    else config.redraw();
  }
  async function saveAssignment(form){
    if(!dialogContext)return;
    const context=dialogContext;
    const recipientKind=context.manage?'department':context.staffId?'staff':document.getElementById('equipment-recipient-kind').value;
    const recipientId=context.staffId||document.getElementById('equipment-recipient')?.value;
    const departmentIds=recipientKind==='department'?departmentPicker(form.querySelector('[data-department-picker]')).values():null;
    if(!selectedDevices.size||!(departmentIds?departmentIds.length:recipientId))
      throw Error(departmentIds?'Select at least one Department.':'Select a recipient and at least one Device.');
    const payload=context.manage?{deviceId:context.deviceId,revision:context.revision,assignmentId:context.assignmentId,departmentIds}:
      {recipientKind,devices:[...selectedDevices.values()],...(departmentIds?{departmentIds}:{recipientId})};
    form.dataset.saving='true';
    const controls=[...form.querySelectorAll('button:enabled,input:enabled,select:enabled')];controls.forEach(item=>item.disabled=true);
    try{
      await request('/api/equipment/'+(context.manage?'manage-departments':'assignments'),payload);
      await config.equipmentChanged();
      delete form.dataset.saving;
      leaveAssignmentDialog();config.notify(context.manage?'Departments saved.':'Equipment assignment saved.');
    }finally{delete form.dataset.saving;controls.forEach(item=>item.disabled=false);}
  }
  document.addEventListener('click',event=>{
    const control=event.target.closest('[data-equipment-action]');if(!control||!config)return;
    event.preventDefault();event.stopImmediatePropagation();
    const action=control.dataset.equipmentAction,id=control.dataset.id;
    if(action==='view-device'){config.viewDevice(id);return;}
    if(action==='add-associated'){void openAssociatedEquipment(id);return;}
    if(action==='writeoff-associated'){window.caffootStockIntake.openWorkflow('writeoff',{issueEntryId:Number(id)});return;}
    if(action==='issue-stock-staff'){window.caffootStockIntake.openWorkflow('issue',{recipientKind:'staff',recipientId:id});return;}
    if(action==='return-stock'){window.caffootStockIntake.openWorkflow('return',{returnSource:'stock:'+id});return;}
    if(action==='manage-departments'){
      void request('/api/equipment/assignments?deviceId='+encodeURIComponent(id)).then(result=>{
        if(!result.canManageDepartments)throw Error('This Device is no longer available for Department changes.');
        const current=result.current[0];
        return showAssignmentDialog({deviceId:id,revision:result.revision,assignmentId:current.id,
          departments:current.departments,manage:true});
      }).catch(error=>config.notify(error.message,'error'));
      return;
    }
    if(action==='reassign-device'){
      void request('/api/equipment/assignments?deviceId='+encodeURIComponent(id)).then(result=>{
        const handover=result.handoverContext;
        const holder=handover&&result.current.find(item=>item.id===handover.deviceAssignmentId);
        if(!holder)throw Error('This Device is not currently eligible for reassignment.');
        window.caffootStockIntake.openHandover({...handover,currentStaffId:holder.staffId,currentDepartmentId:holder.departmentId});
      }).catch(error=>config.notify(error.message,'error'));
      return;
    }
    if(action==='reissue-device-stock'){window.caffootStockIntake.openWorkflow('reissue',{deviceId:id});return;}
    if(action==='return-device-stock'){window.caffootStockIntake.openWorkflow('return',{returnSource:id});return;}
    if(action==='writeoff-device-stock'){window.caffootStockIntake.openWorkflow('writeoff',{deviceId:id});return;}
    if(action==='cancel-assignment'){if(!document.querySelector('#equipment-assignment-form[data-saving]'))leaveAssignmentDialog();return;}
    if(action==='assign-staff')void showAssignmentDialog({staffId:id});
    if(action==='assign-device')void showAssignmentDialog({deviceId:id,revision:Number(document.getElementById('device-details-panel-assigned').dataset.revision)});
  });
  document.addEventListener('change',event=>{
    const control=event.target;
    if(control.matches('[data-equipment-device]')){
      if(control.checked)selectedDevices.set(control.dataset.equipmentDevice,{id:control.dataset.equipmentDevice,revision:Number(control.dataset.revision)});
      else selectedDevices.delete(control.dataset.equipmentDevice);
      document.getElementById('equipment-selection-count').textContent=selectedDevices.size+' Devices Selected';
    }
    if(control.id==='equipment-recipient-kind')void searchRecipients().catch(error=>config.notify(error.message,'error'));
  });
  let searchTimer;
  document.addEventListener('input',event=>{
    const id=event.target.id;if(!['equipment-recipient-search','equipment-device-search'].includes(id))return;
    clearTimeout(searchTimer);searchTimer=setTimeout(()=>void (id==='equipment-device-search'?searchDevices():searchRecipients()).catch(error=>config.notify(error.message,'error')),180);
  });
  document.addEventListener('submit',event=>{
    if(event.target.id!=='equipment-assignment-form')return;
    event.preventDefault();event.stopImmediatePropagation();
    if(event.target.dataset.saving)return;
    void saveAssignment(event.target).catch(error=>{
      const feedback=document.getElementById('equipment-assignment-feedback');if(feedback)feedback.textContent=error.message;
      config.notify(error.message,'error');
    });
  });
  window.caffootEquipment={configure(settings){config=settings;},staffPlaceholder,hydrate,loadDeviceEquipment,loadAssociatedEquipment,canReadAssociations,renderMyEquipment,departmentPickerMarkup,departmentPicker};
})();
