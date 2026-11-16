/* Device allocation views use the same server relationships on every screen. */
'use strict';
(function(){
  let config=null,dialogContext=null,selectedDevices=new Map(),recipientResults=[];
  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dateLabel=value=>/^\d{4}-\d{2}-\d{2}$/.test(value)?value.slice(8,10)+'/'+value.slice(5,7)+'/'+value.slice(0,4):value?new Date(value).toLocaleDateString('en-GB'):'—';
  const button=(label,action,id='')=>`<button type="button" class="btn btn-outline" data-equipment-action="${action}" data-id="${escapeHtml(id)}">${label}</button>`;
  function canReadAssociations(){return !!config?.canReadAssociations();}
  async function request(path,payload){
    const response=await fetch(path,{cache:'no-store',...(payload?{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':config.csrf},body:JSON.stringify(payload)}:{})});
    const data=await response.json();
    if(!response.ok)throw Error(data.error||'Unable to load equipment.');
    return data;
  }
  function assignmentHistory(history,deviceView=false){
    if(!history.length)return '<p class="sub">No equipment assignment history.</p>';
    if(!deviceView)return `<table class="staff-history-list"><tbody>${history.map(item=>`<tr><td>${escapeHtml(dateLabel(item.assignedAt))}</td><td><strong>Assigned · ${escapeHtml(item.deviceName)}</strong><small>Assigned To ${escapeHtml(item.recipientLabel)} · Recorded By ${escapeHtml(item.actorLabel)}</small>${item.closure?`<small>${({returned:'Returned',written_off:'Written Off',reassigned:'Reassigned'})[item.closure.kind]||'Closed'} ${escapeHtml(dateLabel(item.closure.date))} · Recorded By ${escapeHtml(item.closure.actor)}</small>`:''}</td></tr>`).join('')}</tbody></table>`;
    return `<div class="table-scroll"><table class="small-table"><thead><tr><th>Staff Member / Department</th><th>Issue Date</th><th>Return / End Date</th><th>Movement</th></tr></thead><tbody>${history.map(item=>`<tr><td>${escapeHtml(item.recipientLabel)}</td><td>${escapeHtml(dateLabel(item.assignedAt))}</td><td>${escapeHtml(dateLabel(item.closure?.date||item.endedAt))}</td><td>Assigned<br>Recorded By ${escapeHtml(item.actorLabel)}${item.closure?`<br>${({returned:'Returned',written_off:'Written Off',reassigned:'Reassigned'})[item.closure.kind]||'Closed'} · Recorded By ${escapeHtml(item.closure.actor)}`:''}</td></tr>`).join('')}</tbody></table></div>`;
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
      host.innerHTML=`<section class="card" aria-label="Current Equipment Assignments"><div class="staff-assignment-top"><div><h3>Assigned Equipment</h3><p class="sub">Current equipment assigned to this Staff Member.</p></div>${result.canAssign&&host.dataset.active==='true'?button('Assign Equipment','assign-staff',id):''}${result.canIssueStock&&host.dataset.active==='true'?button('Issue Equipment','issue-stock-staff',id):''}</div>${host.dataset.active!=='true'?'<p class="staff-assignment-tip">Inactive Staff Member — outstanding assignments are retained. New assignments are unavailable.</p>':''}<div class="staff-assign-table table-scroll"><table class="small-table"><thead><tr><th>Equipment</th><th>Tracking</th><th>Issue Date</th><th>Manage</th></tr></thead><tbody>${rows||'<tr><td colspan="4">No assigned equipment.</td></tr>'}</tbody></table></div><div class="staff-assign-foot">Current assignments only. Equipment history remains on its original record.</div></section><div class="staff-detail-stack"><section class="card staff-detail-card" aria-label="Assignment History"><h3>Assignment History</h3><p class="sub">The same canonical history shown on each Device.</p><div class="divider"></div>${assignmentHistory(result.history)}${assetMovementHistory(result.assetMovements)}</section><section class="card staff-detail-card"><h3>How Assignments Work</h3><p class="sub">Assign existing Devices here or from Device Details. Both actions record the same relationship.</p><div class="divider"></div><p class="staff-assignment-tip">Return Equipment records physical returns and preserves outstanding quantities. Device reissue remains a separate workflow.</p></section></div>`;
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
      host.innerHTML=`<section class="device-details-section device-review-panel full"><h3><span class="mini-icon" aria-hidden="true">♙</span>Current Assignment</h3><p>Current Staff Member or Department holder of this Device.</p><div class="assignment-bar"><div class="assignment-main"><strong>${escapeHtml(current?.recipientLabel||'Unassigned')}</strong><small>${current?'Issue Date: '+escapeHtml(dateLabel(current.assignedAt)):'No current Staff or Department assignment.'}</small></div>${result.canAssign&&!result.dependency?button('Assign Device','assign-device',deviceId):''}${result.handoverContext?button('Reassign Device','reassign-device',deviceId):''}${result.canReissue?button('Reissue Existing Device','reissue-device-stock',deviceId):''}${result.canReturn?button('Return Equipment','return-device-stock',result.returnSource):''}${result.canWriteOff?button('Write Off','writeoff-device-stock',deviceId):''}</div>${result.dependency?'<p class="device-review-quiet">'+escapeHtml(result.dependency)+'</p>':''}</section><section class="device-details-section device-review-panel full"><h3><span class="mini-icon" aria-hidden="true">↻</span>Assignment History</h3><p>Shared with the original Staff or Department assignment record.</p>${assignmentHistory(result.history,true)}${assetMovementHistory(result.stockHistory,true)}</section>`;
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
      const history=result.history.map(record=>`<tr><td>${escapeHtml(record.issue.name)}</td><td>${record.issue.quantity} Issued · ${record.issue.outstanding} Outstanding</td><td>${escapeHtml(record.issue.recipientLabel)}</td><td>${escapeHtml(dateLabel(record.associatedAt))}<br>Recorded By ${escapeHtml(record.actorLabel)}<br>Issued ${escapeHtml(dateLabel(record.issue.issuedOn))} · ${escapeHtml(record.issue.actor)}${record.movements.map(movement=>`<br>${escapeHtml({returned:"Returned",written_off:"Written Off",readiness_changed:"Prepared"}[movement.kind]||"Movement")} ${movement.quantity} · ${escapeHtml(dateLabel(movement.date))} · ${escapeHtml(movement.actor)}`).join('')}</td></tr>`).join('');
      host.innerHTML=`<section class="device-details-section device-review-panel full"><h3><span class="mini-icon" aria-hidden="true">▣</span>Associated Equipment</h3><p>Equipment explicitly linked to this Device. Sharing a holder does not create a link.</p><div class="assignment-bar"><div class="assignment-main"><strong>${result.current.length} Current ${result.current.length===1?'Association':'Associations'}</strong></div>${result.canAdd?button('Add Equipment','add-associated',deviceId):''}</div><div class="table-scroll"><table class="small-table"><thead><tr><th>Equipment</th><th>Outstanding</th><th>Issued To</th><th>Issue Date</th><th>Manage</th></tr></thead><tbody>${current||'<tr><td colspan="5">No currently associated equipment.</td></tr>'}</tbody></table></div></section><section class="device-details-section device-review-panel full"><h3><span class="mini-icon" aria-hidden="true">↻</span>Association History</h3><p>Original issues, quantities and technician records are retained after equipment is returned or written off.</p><div class="table-scroll"><table class="small-table"><thead><tr><th>Equipment</th><th>Quantity</th><th>Original Holder</th><th>Association / Issue</th></tr></thead><tbody>${history||'<tr><td colspan="4">No association history.</td></tr>'}</tbody></table></div></section>`;
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
    return '<div class="account-page my-equipment"><div class="main"><div class="header"><div><div class="eyebrow">YOUR WORKSPACE</div><h1>My Equipment</h1><p>Your personally assigned Devices and equipment shared with your current Department.</p></div></div><section class="card card-padded" aria-labelledby="my-equipment-personal-heading"><div class="card-head"><div><h3 id="my-equipment-personal-heading">Assigned to Me</h3></div></div><div data-personal-equipment role="status">Loading equipment…</div></section><section class="card card-padded" style="margin-top:17px" aria-labelledby="my-equipment-shared-heading"><div class="card-head"><div><h3 id="my-equipment-shared-heading">Shared with My Department</h3><p>Shared equipment remains assigned to your Department.</p></div></div><div data-shared-equipment role="status">Loading equipment…</div></section></div></div>';
  }
  async function loadMyEquipment(container){
    const personal=container.querySelector('[data-personal-equipment]'),shared=container.querySelector('[data-shared-equipment]');
    if(!personal||!shared)return;
    const list=(items,empty)=>items.length?items.map(item=>`<div class="info-row"><b>${escapeHtml(item.name)}</b><span>${escapeHtml([item.type,item.manufacturer,item.model,item.quantity?'Quantity: '+item.quantity:''].filter(Boolean).join(' · '))}<br>Assigned: ${escapeHtml(dateLabel(item.assignedAt))}</span></div>`).join(''):'<p>'+empty+'</p>';
    try{
      const result=await request('/api/my-equipment');
      if(!personal.isConnected)return;
      personal.innerHTML=list(result.assignedToMe,'No equipment is currently assigned to you.');
      shared.innerHTML=list(result.sharedWithMyDepartment,'No shared equipment is currently available for your Department.');
    }catch(error){if(personal.isConnected){personal.textContent=error.message;shared.textContent=error.message;}}
  }
  function hydrate(container){
    container.querySelectorAll('[data-equipment-staff]').forEach(host=>void loadStaffEquipment(host));
    if(container.querySelector('[data-personal-equipment]'))void loadMyEquipment(container);
  }
  async function showAssignmentDialog(context){
    if(!config.canEdit())return;
    dialogContext=context;selectedDevices=new Map();recipientResults=[];
    if(context.deviceId)selectedDevices.set(context.deviceId,{id:context.deviceId,revision:context.revision});
    const recipientField=context.staffId?'':`<div class="assignment-field"><label for="equipment-recipient-kind">Assign To</label><select class="input" id="equipment-recipient-kind"><option value="staff">Staff Member</option><option value="department">Department</option></select></div><div class="assignment-field"><label for="equipment-recipient-search">Find A Recipient</label><input class="input" type="search" id="equipment-recipient-search" maxlength="100"></div><div class="assignment-field"><label for="equipment-recipient">Recipient</label><select class="input" id="equipment-recipient" required><option value="">Select An Active Recipient</option></select></div>`;
    const deviceField=context.deviceId?'':`<div class="assignment-field"><label for="equipment-device-search">Find Existing Devices</label><input class="input" type="search" id="equipment-device-search" maxlength="100"></div><fieldset class="assignment-field"><legend>Devices</legend><div id="equipment-device-choices" role="status">Loading eligible Devices…</div><p class="sub" id="equipment-selection-count">0 Devices Selected</p></fieldset>`;
    config.openModal(`<div class="equipment-dialog"><div class="assignment-modal-head"><h2>Assign Equipment</h2><p>Record an initial allocation of existing, unassigned Devices. This does not mark equipment as physically held stock or Ready.</p></div><form id="equipment-assignment-form"><div class="assignment-modal-body">${recipientField}${deviceField}<p class="sub">Use Return Equipment to record a physical return. This form records initial Device allocation only.</p><p role="alert" id="equipment-assignment-feedback"></p></div><div class="assignment-modal-actions">${button('Cancel','cancel-assignment')}<button type="submit" class="btn btn-primary">Confirm Assignment</button></div></form></div>`);
    document.querySelector('#equipment-recipient-kind,#equipment-device-search')?.focus();
    try{if(!context.staffId)await searchRecipients();if(!context.deviceId)await searchDevices();}
    catch(error){document.getElementById('equipment-assignment-feedback').textContent=error.message;}
  }
  async function searchRecipients(){
    const host=document.getElementById('equipment-recipient'),search=document.getElementById('equipment-recipient-search'),kind=document.getElementById('equipment-recipient-kind');
    if(!host)return;
    const query=search.value,selectedKind=kind.value;
    const result=await request('/api/equipment/recipients?kind='+selectedKind+'&query='+encodeURIComponent(query));
    if(!host.isConnected||search.value!==query||kind.value!==selectedKind)return;
    recipientResults=result.recipients;
    host.innerHTML='<option value="">Select An Active Recipient</option>'+recipientResults.map(item=>`<option value="${escapeHtml(item.id)}">${escapeHtml(item.label)}</option>`).join('');
  }
  async function searchDevices(){
    const host=document.getElementById('equipment-device-choices'),search=document.getElementById('equipment-device-search');
    if(!host)return;
    const query=search.value;
    const result=await request('/api/equipment/available-devices?query='+encodeURIComponent(query));
    if(!host.isConnected||search.value!==query)return;
    host.innerHTML=result.devices.map(item=>`<label class="device-review-check-item"><input type="checkbox" data-equipment-device="${escapeHtml(item.id)}" data-revision="${item.revision}" ${selectedDevices.has(item.id)?'checked':''}><span>${escapeHtml(item.name)} · ${escapeHtml(item.type)}</span></label>`).join('')||'<p>No eligible, unassigned Devices found.</p>';
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
    const recipientId=context.staffId||document.getElementById('equipment-recipient')?.value;
    if(!recipientId||!selectedDevices.size)throw Error('Select a recipient and at least one Device.');
    const recipientKind=context.staffId?'staff':document.getElementById('equipment-recipient-kind').value;
    form.dataset.saving='true';
    const controls=[...form.querySelectorAll('button,input,select')];controls.forEach(item=>item.disabled=true);
    try{
      await request('/api/equipment/assignments',{recipientKind,recipientId,devices:[...selectedDevices.values()]});
      delete form.dataset.saving;
      leaveAssignmentDialog();config.notify('Equipment assignment saved.');
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
    if(action==='reassign-device'){void request('/api/equipment/assignments?deviceId='+encodeURIComponent(id)).then(result=>{if(!result.handoverContext)throw Error('This Device is not currently eligible for reassignment.');window.caffootStockIntake.openHandover(result.handoverContext);}).catch(error=>config.notify(error.message,'error'));return;}
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
  window.caffootEquipment={configure(settings){config=settings;},staffPlaceholder,hydrate,loadDeviceEquipment,loadAssociatedEquipment,canReadAssociations,renderMyEquipment};
})();
