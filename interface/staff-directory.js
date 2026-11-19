/* Show Staff Member and Department screens using the agreed layout.
   This module holds presentation state only; the server owns identity and access. */
'use strict';
(function(){
  const staffTemplate = {};
  let staff=[],departments=[],managedDepartments=[],users=[];
  let currentStaffId=null,searchText='',statusFilter='all',createLoginIntent=false;
  let mode='list',config=null,loaded=false,loading=false,activeSection='staff';
  let currentDepartmentId=null,departmentTab='overview',departmentDetails=null,departmentRequest=0;
  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const displayDeviceType=name=>name==='Server - Physical'?'Server':name==='Server - Virtual'?'Virtual Machine':name;
  const displayName=record=>[record.firstName,record.lastName].filter(Boolean).join(' ')||'Name Not Recorded';
  const departmentName=id=>departments.find(item=>item.id===id)?.name||'No Department';
  const isAdministrator=()=>!!config?.admin;
  const canReadStaff=()=>!!config?.rights?.staffMembers?.read;
  const canEditStaff=()=>!!config?.rights?.staffMembers?.edit;
  const canReadDepartments=()=>!!config?.rights?.departments?.read;
  const canEditDepartments=()=>!!config?.rights?.departments?.edit;
  function icon(name){return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><use href="#i-'+name+'"/></svg>';}
  function button(label,action,id='',primary=false){return '<button class="btn'+(primary?' primary':'')+'" type="button" data-staff-action="'+action+'" data-id="'+escapeHtml(id)+'">'+label+'</button>';}
  function badge(label,colour='dark'){return '<span class="badge '+colour+'">'+label+'</span>';}
  function header(title,description,action=''){
    return '<div class="section-page-header"><div class="eyebrow">STAFF DIRECTORY</div><div class="header"><div><h1>'+escapeHtml(title)+'</h1><p>'+escapeHtml(description)+'</p></div>'+(action?'<div class="preview-page-actions">'+action+'</div>':'')+'</div></div>';
  }
function renderStaffDirectory() {
  const query=searchText.trim().toLowerCase();
  const visible=staff.filter(record=>(!query||`${record.firstName} ${record.lastName} ${departments.find(item=>item.id===record.departmentId)?.name||''}`.toLowerCase().includes(query))&&(statusFilter==='all'||String(record.active)===statusFilter));
  const rows=visible.map(record=>`<div class="userrow" data-staff-id="${record.id}"><div class="who"><span class="initial" aria-hidden="true">${escapeHtml(record.firstName?.slice(0,1)||'?')}</span><div style="min-width:0"><h3 class="username preview-record-name">${escapeHtml(displayName(record))}</h3><div class="userdesc">${record.firstName?'Staff Member':'Migrated Record · Details Blank'}</div></div></div><div class="role-cell">${escapeHtml(departmentName(record.departmentId))}${departments.find(item=>item.id===record.departmentId)?.archived?'<div class="userdesc">Archived · Membership Retained</div>':''}</div><div class="mfa-cell">${isAdministrator()?badge(record.accountId?'Linked Login':'No Login',record.accountId?'blue':'dark'):escapeHtml(record.jobTitle||'—')}<div style="margin-top:5px">${badge(record.active?'Active':'Inactive',record.active?'green':'red')}</div></div><div class="permissions-cell"><div class="userdesc">${escapeHtml(record.email||'No Email Recorded')}</div><div class="userdesc">${escapeHtml(record.location||'')}</div></div><div class="actions preview-row-actions">${button('View Details','staff-details',record.id)}${canEditStaff()?button('Edit','staff-edit',record.id):''}</div></div>`).join('');
  return header('Staff Members','Maintain Staff profiles independently of Caffoot logins.',canEditStaff()?button('+ Add Staff Member','staff-add','',true):'')+`<div class="users-list-shell section active preview-staff-directory"><div class="toolbar"><div class="filters"><div class="field search"><label for="staff-directory-search">Find A Staff Member</label><input class="input" id="staff-directory-search" type="search" placeholder="Search by name or department…" value="${escapeHtml(searchText)}"></div><div class="field filter"><label for="staff-directory-status">Staff Status</label><select class="input" id="staff-directory-status"><option value="all">All Statuses</option><option value="true" ${statusFilter==='true'?'selected':''}>Active</option><option value="false" ${statusFilter==='false'?'selected':''}>Inactive</option></select></div></div></div><div class="card users-list-card"><div class="users-list-table-scroll"><div class="list-header"><span>Staff Member</span><span>Department</span><span>${isAdministrator()?'Login &amp; Status':'Job Title &amp; Status'}</span><span>Contact &amp; Location</span><span>Actions</span></div><div id="staff-directory-rows">${rows||'<p class="cardpad">No matching Staff Members.</p>'}</div></div><div class="list-footer" role="status">Showing ${visible.length} of ${staff.length} Staff Members</div></div></div>`;
}
function detailRow(label,value) {return `<div class="info-row"><label>${label}</label><b>${escapeHtml(value||'Not Recorded')}</b></div>`;}
function renderStaffDetails() {
  const record=staff.find(item=>item.id===currentStaffId);
  return header('Staff Details',displayName(record),button('Back To Staff Members','staff-back')+(canEditStaff()?button('Edit Staff Member','staff-edit',record.id,true):''))+`<section class="section active"><div class="section-heading"><div><h2>${escapeHtml(displayName(record))}</h2><p>${escapeHtml(departmentName(record.departmentId))}</p></div>${badge(record.active?'Active':'Inactive',record.active?'green':'red')}</div><div class="two-col"><div class="card cardpad"><h3 class="cardtitle">Personal Details</h3>${detailRow('First Name',record.firstName)}${detailRow('Surname',record.lastName)}${detailRow('Email Address',record.email)}${detailRow('Telephone',record.telephone)}</div><div class="card cardpad"><h3 class="cardtitle">Organisation</h3>${detailRow('Department',departmentName(record.departmentId))}${detailRow('Job Title',record.jobTitle)}${detailRow('Location',record.location)}<p class="formhint">Staff status is independent of account status. Inactivation does not return equipment or disable a login.</p></div></div>${isAdministrator()?`<div class="card cardpad" style="margin-top:17px"><h3 class="cardtitle">Caffoot Login</h3><p class="sub">${record.accountId?'Linked Account: '+escapeHtml(users.find(item=>item.id===record.accountId)?.username||'Account Recorded'):'This Staff Member has no Caffoot login.'} Staff and account profiles are managed separately.</p><div class="preview-details-actions">${button(record.accountId?'Manage Login In Permissions':'Create Login',record.accountId?'manage-login':'staff-create-login',record.id)}</div></div>`:''}<div class="preview-details-actions">${canEditStaff()?button(record.active?'Mark Inactive':'Reactivate','staff-status',record.id):''}</div>${window.caffootEquipment.staffPlaceholder(record)}</section>`;
}
function field(label, name, value='', type='text', required=false, help='', markRequired=required) {return `<div class="field preview-form-field"><label for="preview-${name}">${label}${markRequired?' *':''}</label><input class="input" id="preview-${name}" name="${name}" type="${type}" value="${escapeHtml(value)}" ${required?'required':''} ${type==='password'?'autocomplete="new-password"':''}>${help?'<small class="field-help">'+help+'</small>':''}</div>`;}
function renderStaffForm(record, createLogin=false, draft=null) {
  const editing=!!record;
  record=record||{firstName:'',lastName:'',email:'',departmentId:null,jobTitle:'',telephone:'',location:'',active:true,accountId:null};
  if(draft){
    record={...record,...draft.values,departmentId:draft.values.departmentId||null,active:draft.values.active==='true',revision:draft.revision};
    createLogin=draft.createLogin;
  }
  const options=departments.filter(item=>!item.archived||item.id===record.departmentId).map(item=>`<option value="${item.id}" ${item.id===record.departmentId?'selected':''}>${escapeHtml(item.name)}${item.archived?' · Archived · Existing Membership':''}</option>`).join('');
  const cardHeading=(title,description,symbol,colour='')=>`<div class="card-head"><span class="iconwrap ${colour}">${icon(symbol)}</span><div><h3>${title}</h3><p class="sub">${description}</p></div></div><div class="divider"></div>`;
  const personal=`<div class="card card-padded staff-details-card">${cardHeading('Personal Details','Basic information about the person, whether or not they sign in.','users')}<div class="staff-fields">
    ${field('First Name','firstName',record.firstName,'text',!editing)}${field('Surname','lastName',record.lastName,'text',!editing)}
    <div class="staff-span-two">${field('Email Address','email',record.email,'email')}</div>
    <div class="field preview-form-field"><label for="preview-departmentId">Department <span class="optional">Optional</span></label><select class="input" id="preview-departmentId" name="departmentId"><option value="">No Department</option>${options}</select></div>
    ${field('Job Title','jobTitle',record.jobTitle)}${field('Telephone Number','telephone',record.telephone,'tel')}${field('Location','location',record.location)}
    <div class="field preview-form-field staff-span-two"><label for="preview-active">Staff Status</label><select class="input" id="preview-active" name="active"><option value="true" ${record.active?'selected':''}>Active</option><option value="false" ${!record.active?'selected':''}>Inactive</option></select><small class="field-help">Changing Staff status does not automatically enable or disable a Caffoot login.</small></div>
    ${editing&&!record.firstName?'<p class="formhint staff-span-two">This migrated record has blank names. Keep missing details blank until known.</p>':''}
    <p class="formhint staff-span-two">Email Address, Department, Job Title, Telephone Number and Location are optional. Archived Departments cannot be selected for new membership.</p>
  </div></div>`;
  let loginContent;
  if(!isAdministrator())loginContent='<div class="staff-restricted">'+badge('Staff Directory Access Only','amber')+'<p>Creating or managing Caffoot logins is restricted to authorised administrators. You can still maintain permitted Staff details.</p></div>';
  else if(record.accountId)loginContent=`<div class="linked-account">${badge('Linked Account','green')}<strong>${escapeHtml(users.find(item=>item.id===record.accountId)?.username||'Account Recorded')}</strong><p>Staff and login records remain separate. Manage account access through Permissions.</p></div>${button('Manage Login In Permissions','manage-login',record.id)}`;
  else loginContent=`<label class="switch-row-staff" for="staff-create-login"><span><strong>Create Caffoot Login</strong><small>Enable this if the person needs to sign in to Caffoot Lite.</small></span><span class="switch-control"><input type="checkbox" id="staff-create-login" ${createLogin?'checked':''} aria-controls="staff-login-fields"><span class="switch-slider" aria-hidden="true"></span></span></label>
    <div class="staff-account-fields" id="staff-login-fields" ${createLogin?'':'hidden'}><div class="divider"></div>
    ${field('Username','username',draft?.values.username||'','text',createLogin,'A unique username used to sign in.',true)}
    ${field('Initial Password','password',draft?.values.password||'','password',createLogin,'Share the password using a secure channel.',true)}
    ${field('Confirm Initial Password','confirmPassword',draft?.values.confirmPassword||'','password',createLogin,'',true)}
    <div class="staff-role-note"><span class="role-name">Staff Member</span><strong>Default Role</strong><p>The baseline role is assigned to every new ordinary login. It does not grant general Devices, IT Assets, IPAM or Network Racks access.</p><p>Additional roles and individual permissions remain managed through the existing Permissions controls.</p></div>
    <div class="staff-mfa-hint"><strong>MFA And Security</strong><p>Existing password, MFA and account safeguards still apply. Any enabled additional role requires MFA.</p></div></div>`;
  const login=`<div class="card card-padded staff-login-card">${cardHeading('Caffoot Login','Optional account access, managed using the existing permissions system.','shield','orange')}${loginContent}</div>`;
  const guidance='<div class="card card-padded staff-security-summary"><h3>Equipment And Ticket Access</h3><p class="sub">A Staff record can hold equipment assignments without a login. A linked login later provides only the personal access allowed by the baseline Staff Member role.</p><div class="divider"></div><div class="staff-quickpoints"><div><span class="point-dot"></span><span>Assigned equipment stays linked to this Staff Member.</span></div><div><span class="point-dot"></span><span>Service Desk self-service arrives in the planned future stage.</span></div><div><span class="point-dot"></span><span>No automatic IT inventory permission or department-based grant.</span></div></div><p class="formhint" style="margin-top:14px">Initial Device assignments are available. Physical returns are recorded through Return Equipment; Service Desk is not yet available.</p></div>';
  return header(editing?'Edit Staff Member':'Add Staff Member','A Staff profile does not require a Caffoot login.',button('Back To Staff Members','staff-back'))+`<section class="section active staff-mode-view"><form id="staff-record-form" class="preview-aligned-form" data-id="${record.id||''}" data-revision="${escapeHtml(record.revision||'')}" autocomplete="off"><div class="staff-main-grid">${personal}<div class="staff-side-stack">${login}${guidance}</div></div><div class="staff-actions"><p>Staff details and Caffoot login security are saved separately unless you explicitly choose to create a login together.</p><div class="staff-action-buttons">${button('Cancel','staff-back')}<button class="btn primary" type="submit">Save Staff Member</button></div></div>${draft?.feedback||'<p class="formhint" id="preview-form-feedback" role="status"></p>'}</form></section>`;
}

function renderDepartments() {
  return header('Departments','Simple, flat Departments with preserved Staff relationships.',canEditDepartments()?button('+ Add Department','department-add','',true):'')+`<section class="section active"><div class="card users-list-card"><div class="users-list-table-scroll"><div class="list-header"><span>Department</span><span>Status</span><span>Membership</span><span>Availability</span><span>Manage</span></div>${departments.map(item=>`<div class="userrow"><div class="who"><span class="initial" aria-hidden="true">${escapeHtml(item.name.slice(0,1))}</span><div style="min-width:0"><h3 class="username preview-record-name">${escapeHtml(item.name)}</h3></div></div><div class="role-cell">${badge(item.archived?'Archived':'Active',item.archived?'amber':'green')}</div><div class="mfa-cell"><span class="userdesc">${item.archived?'Existing Links Retained':'Optional Staff Membership'}</span></div><div class="permissions-cell"><span class="userdesc">${item.archived?'No New Membership':'Available For New Membership'}</span></div><div class="actions preview-row-actions">${button('View Details','department-details',item.id)}${canEditDepartments()?button('Manage','department-edit',item.id):''}</div></div>`).join('')}</div><div class="list-footer">${departments.length} Departments</div></div><p class="formhint">Archive Departments with current or historical associations. Permanent deletion is only available when the server confirms there are none.</p></section>`;
}


  function departmentCard(title,description,content,symbol='users'){
    return `<article class="card card-padded"><div class="card-head"><span class="iconwrap">${icon(symbol)}</span><div><h3>${title}</h3><p class="sub">${description}</p></div></div><div class="divider"></div>${content}</article>`;
  }
  function departmentNotice(title,message){
    return `<div class="department-empty" role="status"><strong>${title}</strong><p class="sub">${message}</p></div>`;
  }
  function departmentDate(value){
    const date=value?new Date(value):null;
    return date&&!Number.isNaN(date.getTime())?date.toLocaleDateString('en-GB'):'Date Not Recorded';
  }
  function departmentTable(headings,rows,empty){
    return rows?`<div class="table-scroll"><table class="small-table"><thead><tr>${headings.map(label=>`<th scope="col">${label}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`:empty;
  }
  function departmentAssignmentRows(){
    const labels={issued:'Equipment Issued',returned:'Equipment Returned',readiness_changed:'Equipment Prepared',written_off:'Equipment Written Off'};
    return (departmentDetails.assignments?.history||[]).flatMap(item=>[{date:item.assignedAt,title:'Device Assigned',name:item.deviceName,actor:item.actorLabel},...(item.endedAt?[{date:item.closure?.date||item.endedAt,title:item.closure?.kind==='returned'?'Device Returned':item.closure?.kind==='written_off'?'Device Written Off':'Device Assignment Ended',name:item.deviceName,actor:item.closure?.actor||''}]:[])]).concat((departmentDetails.assignments?.assetMovements||[]).map(item=>({date:item.date,title:labels[item.kind]||'Equipment Movement',name:item.name+' · Quantity: '+item.quantity,actor:item.actor}))).map(item=>`<tr><td>${escapeHtml(departmentDate(item.date))}</td><td><strong>${item.title}</strong><div class="sub">${escapeHtml(item.name)}</div></td><td>${escapeHtml(item.actor||'Not Recorded')}</td></tr>`).join('');
  }
  function renderDepartmentOverview(record){
    const people=departmentDetails.people,assignments=departmentDetails.assignments;
    const staffCount=people?String(people.length):'Not Available';
    const deviceCount=assignments&&departmentDetails.deviceAccess?String(assignments.current.length):'Not Available';
    const assetCount=assignments&&departmentDetails.assetAccess?(assignments.assetCurrent||[]).reduce((sum,item)=>sum+BigInt(item.outstanding),0n).toLocaleString('en-GB'):'Not Available';
    const status=record.archived?'Archived':'Active';
    const information=detailRow('Department Name',record.name)+detailRow('Status',status)+detailRow('Structure','Independent Department')+detailRow('New Membership',record.archived?'Unavailable':'Available');
    const summary=detailRow('Staff Members',staffCount)+detailRow('Department-Owned Devices',deviceCount)+detailRow('IT Assets',assetCount)+detailRow('Permissions','Independent Section Rights');
    const metrics=[['Staff Members',staffCount,people?'Currently linked Staff records.':'Staff Members information is not available.'],['Shared Devices',deviceCount,assignments&&departmentDetails.deviceAccess?'Devices assigned to this Department.':'Device information is not available.'],['Department Status',status,'Membership does not grant additional permissions.']];
    return `<div class="two-col">${departmentCard('Department Information','Recorded Department details and status.',information)}${departmentCard('Department Summary','Each total requires access to its own section.',summary)}</div><div class="cards4 department-metrics">${metrics.map(([label,value,help])=>`<div class="card card-padded stat"><div class="stathead">${label}</div><div class="statnum">${value}</div><div class="statfoot">${help}</div></div>`).join('')}</div>`;
  }
  function renderDepartmentStaff(){
    if(!departmentDetails.people)return departmentNotice('Staff Members Not Available',departmentDetails.staffError||'Staff Members access is required to view Department membership.');
    const rows=departmentDetails.people.map(person=>`<tr><td><strong>${escapeHtml(displayName(person))}</strong></td><td>${escapeHtml(person.jobTitle||'Not Recorded')}</td><td>${badge(person.active?'Active':'Inactive',person.active?'green':'red')}</td><td>${button('View Staff Details','staff-details',person.id)}</td></tr>`).join('');
    return `<div class="section-heading"><div><h2>Staff Members</h2><p>Staff currently linked to this Department. Manage membership from the existing Staff form.</p></div></div><div class="card">${departmentTable(['Staff Member','Job Title','Status','Details'],rows,departmentNotice('No Staff Members In This Department','No current Staff membership is recorded.'))}</div>`;
  }
  function renderDepartmentEquipment(){
    const data=departmentDetails.assignments;
    if(!data)return departmentNotice('Department Equipment Not Available',departmentDetails.equipmentError||'The relevant Devices or IT Assets access is required to view shared equipment.');
    const rows=data.current.map(item=>{
      const device=departmentDetails.devices.find(record=>record.id===item.deviceId);
      return `<tr><td><strong>${escapeHtml(item.deviceName)}</strong><div><button type="button" class="btn" data-equipment-action="view-device" data-id="${escapeHtml(item.deviceId)}">View Device</button></div></td><td>${escapeHtml(displayDeviceType(device?.type||'Not Recorded'))}</td><td>${escapeHtml(item.recipientLabel)}</td><td>Current Holder<div class="sub">Assigned ${escapeHtml(departmentDate(item.assignedAt))}</div></td></tr>`;
    }).join('')+(data.assetCurrent||[]).map(item=>`<tr><td><strong>${escapeHtml(item.name)}</strong></td><td>IT Asset · Quantity: ${item.outstanding}</td><td>${escapeHtml(item.recipientLabel)}</td><td>Current Holder<div class="sub">Issued ${escapeHtml(departmentDate(item.issuedOn))}</div>${data.canIssueStock?`<button type="button" class="btn" data-equipment-action="return-stock" data-id="${item.id}">Return Equipment</button>`:''}</td></tr>`).join('');
    return `<div class="section-heading"><div><h2>Department-Owned Equipment</h2><p>Shared equipment assigned to this Department. Personally assigned Staff equipment is not included.</p></div>${data.canIssueStock&&!departmentDetails.record.archived?button('Issue Equipment','department-issue-stock',currentDepartmentId):''}</div><div class="card">${departmentTable([departmentDetails.assetAccess?'Equipment':'Device','Type','Assigned To','Assignment'],rows,departmentNotice(departmentDetails.assetAccess?'No Current Department-Owned Equipment':'No Current Department-Owned Devices',departmentDetails.assetAccess?'No equipment is currently assigned to this Department.':'No Devices are currently assigned to this Department.'))}</div><div class="department-history-card">${departmentCard('Assignment History','Recorded allocations on the original Device relationships.',departmentTable(['Date','Event','Recorded By'],departmentAssignmentRows(),departmentNotice('No Recorded Assignments','No Device assignment history is available for this Department.')))}</div><p class="formhint">${departmentDetails.assetAccess?'Original issue, return and write-off history is retained.':'IT Assets are not available with your current access. Devices retain their original identities.'}</p>`;
  }
  function renderDepartmentHistory(){
    const directoryRows=(departmentDetails.history||[]).flatMap(event=>(event.changes||[]).filter(change=>change.kind==='Department'&&change.label===currentDepartmentId).map(change=>({at:event.at,actor:event.actor,action:change.action,name:change.after?.name||change.before?.name||''})));
    const activity=directoryRows.map(item=>({...item,title:'Department '+item.action,description:item.name})).concat((departmentDetails.assignments?.history||[]).map(item=>({at:item.assignedAt,actor:item.actorLabel,title:'Device Assigned',description:item.deviceName+' · Assigned To '+item.recipientLabel})));
    const assetLabels={issued:'Equipment Issued',returned:'Equipment Returned',readiness_changed:'Equipment Prepared',written_off:'Equipment Written Off'};
    activity.push(...(departmentDetails.assignments?.assetMovements||[]).map(item=>({at:item.date,actor:item.actor,title:assetLabels[item.kind]||'Equipment Movement',description:item.name+' · Quantity: '+item.quantity})));
    activity.sort((a,b)=>(Date.parse(b.at)||0)-(Date.parse(a.at)||0));
    const rows=activity.map(item=>`<tr><td>${escapeHtml(departmentDate(item.at))}</td><td><strong>${escapeHtml(item.title)}</strong><div class="sub">${escapeHtml(item.description)}</div></td><td>${escapeHtml(item.actor||'Not Recorded')}</td></tr>`).join('');
    return `<div class="section-heading"><div><h2>Department History</h2><p>Department activity and Device assignments available with your current access.</p></div></div>${departmentCard('Recorded Activity','Saved Department changes and equipment assignment records.',departmentTable(['Date','Event','Recorded By'],rows,departmentNotice('No Recorded Activity Available','No Department changes or Device assignments are available with your current access.')))}${departmentDetails.historyError?'<p class="formhint" role="status">Department activity could not be loaded. Reopen Details to try again.</p>':''}`;
  }
  function renderDepartmentDetails(){
    const detail=departmentDetails,record=detail?.record;
    if(!record)return header('Department Details','',button('Back To Departments','department-back'))+departmentNotice(detail?.loading?'Loading Department Details…':'Department Details Not Available',detail?.error||'');
    const tabs=[['overview','Overview'],['staff','Staff Members'],['equipment','Equipment'],['history','History']];
    const panels=[renderDepartmentOverview(record),renderDepartmentStaff(),renderDepartmentEquipment(),renderDepartmentHistory()];
    return `<div class="department-details">${header(record.name,'Department Details · Current Staff and shared equipment',button('Back To Departments','department-back')+(canEditDepartments()?button('Manage Department','department-edit',record.id):''))}<div class="department-status">${badge(record.archived?'Archived':'Active',record.archived?'amber':'green')}<p class="sub">${record.archived?'Existing relationships are retained. New membership and assignments are unavailable.':'Membership does not grant additional permissions.'}</p></div><nav class="tabs" role="tablist" aria-label="Department Details">${tabs.map(([key,label])=>`<button class="tab${departmentTab===key?' active':''}" type="button" id="department-tab-${key}" role="tab" aria-selected="${departmentTab===key}" aria-controls="department-panel-${key}" tabindex="${departmentTab===key?'0':'-1'}" data-staff-action="department-tab" data-tab="${key}">${label}</button>`).join('')}</nav>${tabs.map(([key],index)=>`<section class="department-tab-panel" id="department-panel-${key}" role="tabpanel" aria-labelledby="department-tab-${key}" tabindex="0" ${departmentTab===key?'':'hidden'}>${panels[index]}</section>`).join('')}</div>`;
  }
  function selectDepartmentTab(tab){
    if(!['overview','staff','equipment','history'].includes(tab)||!currentDepartmentId)return;
    departmentTab=tab;redraw();
    document.getElementById('department-tab-'+tab)?.focus({preventScroll:true});
    document.getElementById('department-tab-'+tab)?.scrollIntoView({block:'nearest',inline:'nearest'});
  }
  async function loadDepartmentDetails(id){
    const requestId=++departmentRequest;
    departmentDetails={loading:true};redraw();
    try{
      // Every source checks its own current permissions on the server.
      // Missing access never becomes a zero total or a copied relationship.
      const {department}=await request('/api/departments/'+encodeURIComponent(id));
      const [people,equipment,history]=await Promise.allSettled([
        canReadStaff()?readAll('/api/staff-members','staffMembers'):Promise.resolve(null),
        (config.canReadDevices()||config.canReadAssets())?Promise.all([request('/api/equipment/assignments?departmentId='+encodeURIComponent(id)),config.canReadDevices()?request('/api/inventory/devices'):Promise.resolve({devices:[]})]):Promise.resolve(null),
        config.canReadHistory()?request('/api/inventory/history'):Promise.resolve(null)
      ]);
      if(requestId!==departmentRequest||id!==currentDepartmentId)return;
      departmentDetails={record:department,deviceAccess:config.canReadDevices(),assetAccess:config.canReadAssets(),
        people:people.status==='fulfilled'&&people.value?people.value.filter(person=>person.departmentId===id):null,
        assignments:equipment.status==='fulfilled'&&equipment.value?equipment.value[0]:null,
        devices:equipment.status==='fulfilled'&&equipment.value?equipment.value[1].devices:[],
        history:history.status==='fulfilled'?history.value?.changeHistory:null,
        staffError:people.status==='rejected'?'Staff membership could not be loaded. Reopen Details to try again.':null,
        equipmentError:equipment.status==='rejected'?'Device assignments could not be loaded. Check your access or reopen Details.':null,
        historyError:history.status==='rejected'};
      if(people.status==='fulfilled'&&people.value)staff=people.value;
    }catch(error){if(requestId===departmentRequest)departmentDetails={error:'Department Details could not be loaded. Check your access or return to the directory.'};}
    if(requestId===departmentRequest&&activeSection==='departments')redraw();
  }

  async function request(path,data){
    const headers=data===undefined?{}:{'Content-Type':'application/json','X-CSRF-Token':config.csrf};
    const response=await fetch(path,{method:data===undefined?'GET':'POST',cache:'no-store',headers,...(data===undefined?{}:{body:JSON.stringify(data)})});
    const payload=await response.json();
    if(!response.ok){
      const error=Error(payload.error||'Unable to complete the Staff operation.');
      error.code=payload.code;
      throw error;
    }
    return payload;
  }
  async function readAll(path,key){
    const list=[];
    for(let offset=0;offset<=1000000;offset+=100){
      const page=(await request(path+(path.includes('?')?'&':'?')+'limit=100&offset='+offset))[key];
      if(!Array.isArray(page))throw Error('Invalid directory response.');
      list.push(...page);
      if(page.length<100)return list;
    }
    throw Error('Directory results exceed the supported paging limit.');
  }
  async function refresh(){
    if(!config||loading)return;
    loading=true;
    try{
      const [people,choices,managed]=await Promise.all([
        canReadStaff()?readAll('/api/staff-members','staffMembers'):Promise.resolve([]),
        canReadStaff()?request('/api/staff-members/department-choices'):Promise.resolve({departments:[]}),
        canReadDepartments()?readAll('/api/departments','departments'):Promise.resolve([])
      ]);
      staff=people;managedDepartments=managed;
      users=isAdministrator()?(config.accountList()||[]):[];
      departments=canReadDepartments()?managed:(choices.departments||[]);
      if(canEditStaff()&&!canReadDepartments())departments=choices.departments||[];
      loaded=true;
      if(activeSection==='staff'||activeSection==='departments')config.redraw();
    }catch(error){config.notify(error.message,'error');}
    finally{loading=false;}
  }
  function render(section){
    if(!loaded)return '<p role="status" class="card cardpad">Loading directory…</p>';
    if(section==='departments'){
      if(!canReadDepartments())return '<p role="status">Department access is required.</p>';
      return currentDepartmentId?renderDepartmentDetails():renderDepartments();
    }
    if(!canReadStaff())return '<p role="status">Staff Members access is required.</p>';
    const record=staff.find(item=>item.id===currentStaffId);
    if(mode==='details'&&record)return renderStaffDetails();
    if(mode==='form'&&(record||!currentStaffId)){
      // A theme redraw must keep the current entries and their original saved revision.
      const form=document.querySelector('#staff-record-form');
      const draft=form&&form.dataset.id===(currentStaffId||'')?{
        values:Object.fromEntries(new FormData(form)),revision:form.dataset.revision,
        createLogin:!!form.querySelector('#staff-create-login')?.checked,
        feedback:form.querySelector('#preview-form-feedback')?.outerHTML
      }:null;
      return renderStaffForm(record,createLoginIntent,draft);
    }
    mode='list';currentStaffId=null;
    return renderStaffDirectory();
  }
  function enter(section){
    if(section!==activeSection){
      activeSection=section;
      mode='list';currentStaffId=null;createLoginIntent=false;
      currentDepartmentId=null;departmentDetails=null;departmentRequest++;
    }
    if(!loaded)void refresh();
  }
  function redraw(){config?.redraw();}
  function showStaffConflict(error,feedback,id){
    if(!feedback)return;
    feedback.textContent=error.message;
    if(error.code==='stale_staff_edit'){
      feedback.append(document.createTextNode(feedback.closest('#staff-record-form')?' Your unsaved details have been kept. ':' '));
      feedback.insertAdjacentHTML('beforeend',button('Refresh Current Details','staff-refresh',id));
    }
  }
  async function refreshStaffRecord(id){
    const form=document.querySelector('#staff-record-form');
    if(form&&!confirm('Refresh this Staff Member? This will replace your unsaved details, including any login fields, with the current saved values.'))return;
    const [result,choices]=await Promise.all([
      request('/api/staff-members/'+encodeURIComponent(id)),
      canReadDepartments()?readAll('/api/departments','departments').then(departments=>({departments})):request('/api/staff-members/department-choices')
    ]);
    if(currentStaffId!==id||(form&&!form.isConnected))return;
    staff=staff.map(record=>record.id===id?result.staffMember:record);
    departments=choices.departments;
    if(canReadDepartments())managedDepartments=departments;
    createLoginIntent=false;
    form?.remove();
    redraw();
    config.notify('Current Staff details loaded. Review them before saving.');
  }
  async function saveStaff(form){
    const formData=new FormData(form),payload={};
    for(const key of ['firstName','lastName','email','jobTitle','telephone','location'])payload[key]=String(formData.get(key)||'').trim();
    payload.departmentId=formData.get('departmentId')||null;
    payload.active=formData.get('active')==='true';
    const login=form.querySelector('#staff-create-login');
    if(login?.checked){
      const username=String(formData.get('username')||'').trim(),password=String(formData.get('password')||'');
      if(password!==String(formData.get('confirmPassword')||''))throw Error('The initial passwords do not match.');
      if(!username||!password)throw Error('Username and initial password are required.');
      payload.login={username,password};
    }
    const id=form.dataset.id;
    if(id)payload.revision=form.dataset.revision;
    const result=await request('/api/staff-members'+(id?'/'+encodeURIComponent(id):''),payload);
    currentStaffId=result.staffMember.id;mode='details';createLoginIntent=false;
    if(payload.login && isAdministrator())await config.reloadAccounts();
    await refresh();config.notify('Staff Member saved.');
  }
  function openDepartmentDialog(item=null){
    if(!canEditDepartments())return;
    const host=document.querySelector('#main-content');
    const previous=host.querySelector('[data-staff-dialog]');if(previous)previous.remove();
    const title=item?'Manage Department':'Add Department';
    const deleteButton=item?.canDelete?'<button class="btn danger" type="button" data-staff-action="department-delete" data-id="'+escapeHtml(item.id)+'">Delete Department</button>':'';
    const toggleButton=item?'<button class="btn" type="button" data-staff-action="department-toggle" data-id="'+escapeHtml(item.id)+'">'+(item.archived?'Reactivate':'Archive')+'</button>':'';
    const layer=document.createElement('div');layer.className='users-live';layer.dataset.staffDialog='';
    layer.innerHTML='<div class="modal-layer users-management-modal"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="staff-department-dialog-title"><div class="modal-head"><div><h2 id="staff-department-dialog-title">'+title+'</h2><p>Departments are flat. Archiving preserves current and historical associations.</p></div><button class="close app-modal-close" type="button" data-staff-action="department-close" aria-label="Close Department editor">Close ×</button></div><div class="modal-body"><form id="staff-department-form" data-id="'+escapeHtml(item?.id||'')+'"><div class="field"><label for="staff-department-name">Department Name *</label><input id="staff-department-name" class="input" name="name" maxlength="120" required value="'+escapeHtml(item?.name||'')+'"></div><p class="formhint" role="status" id="staff-department-feedback"></p><div class="modal-actions">'+deleteButton+toggleButton+'<button type="button" class="btn" data-staff-action="department-close">Cancel</button><button type="submit" class="btn primary">Save Department</button></div></form></div></div></div>';
    host.append(layer);layer.querySelector('input').focus();
  }
  function closeDepartmentDialog(){document.querySelector('[data-staff-dialog]')?.remove();}
  async function saveDepartment(form){
    const name=String(new FormData(form).get('name')||'').trim();
    const id=form.dataset.id;
    const result=await request('/api/departments'+(id?'/'+encodeURIComponent(id):''),{name});
    closeDepartmentDialog();await refresh();if(currentDepartmentId===id)await loadDepartmentDetails(id);config.notify('Department saved.');
    return result;
  }
  function configure(settings){
    config=settings;loaded=false;mode='list';activeSection='';
    currentDepartmentId=null;departmentDetails=null;departmentRequest++;
    staff=[];departments=[];managedDepartments=[];users=[];
  }
  document.addEventListener('click',event=>{
    const control=event.target.closest('[data-staff-action]');if(!control||!config)return;
    if(!control.closest('#main-content'))return;
    event.preventDefault();event.stopImmediatePropagation();
    const action=control.dataset.staffAction,id=control.dataset.id;
    if(action==='department-issue-stock'){window.caffootStockIntake.openWorkflow('issue',{recipientKind:'department',recipientId:id});return;}
    if(action==='department-back'){currentDepartmentId=null;departmentDetails=null;departmentRequest++;redraw();document.querySelector('[data-staff-action="department-details"]')?.focus();return;}
    if(action==='department-tab'){selectDepartmentTab(control.dataset.tab);return;}
    if(action==='department-details'&&canReadDepartments()){currentDepartmentId=id;departmentTab='overview';void loadDepartmentDetails(id);return;}
    if(action==='staff-back'){mode='list';currentStaffId=null;createLoginIntent=false;redraw();return;}
    if(action==='staff-add'&&canEditStaff()){mode='form';currentStaffId=null;createLoginIntent=false;redraw();return;}
    if(action==='staff-refresh'&&canEditStaff()){
      control.disabled=true;
      void refreshStaffRecord(id).catch(error=>config.notify(error.message,'error')).finally(()=>{if(control.isConnected)control.disabled=false;});return;
    }
    const record=staff.find(item=>item.id===id);
    if(action==='staff-details'&&record&&canReadStaff()){
      mode='details';currentStaffId=id;
      if(activeSection==='departments'){activeSection='staff';currentDepartmentId=null;departmentDetails=null;departmentRequest++;config.openStaff();}
      else redraw();
      return;
    }
    if(action==='staff-edit'&&record&&canEditStaff()){mode='form';currentStaffId=id;createLoginIntent=false;redraw();return;}
    if(action==='staff-create-login'&&record&&canEditStaff()&&isAdministrator()&&!record.accountId){mode='form';currentStaffId=id;createLoginIntent=true;redraw();return;}
    if(action==='manage-login'&&record?.accountId&&isAdministrator()){config.manageLogin(record.accountId);return;}
    if(action==='staff-status'&&record&&canEditStaff()){
      const next=!record.active;
      if(!confirm((next?'Reactivate':'Mark Inactive')+' '+displayName(record)+'? Equipment and login state will not change.'))return;
      void request('/api/staff-members/'+encodeURIComponent(id),{active:next,revision:record.revision}).then(async()=>{await refresh();config.notify('Staff status saved.');}).catch(error=>{
        if(error.code==='stale_staff_edit'&&control.isConnected){
          const feedback=document.createElement('p');feedback.className='formhint';feedback.setAttribute('role','status');
          control.parentElement.querySelector('[role="status"]')?.remove();
          control.parentElement.append(feedback);
          showStaffConflict(error,feedback,id);
        }
        config.notify(error.message,'error');
      });return;
    }
    if(action==='department-add'&&canEditDepartments()){openDepartmentDialog();return;}
    const department=managedDepartments.find(item=>item.id===id);
    if(action==='department-edit'&&department&&canEditDepartments()){openDepartmentDialog(department);return;}
    if(action==='department-close'){closeDepartmentDialog();return;}
    if(action==='department-toggle'&&department&&canEditDepartments()){
      const archived=!department.archived;
      if(!confirm((archived?'Archive':'Reactivate')+' '+department.name+'? Existing associations will be preserved.'))return;
      void request('/api/departments/'+encodeURIComponent(id),{archived}).then(async()=>{closeDepartmentDialog();await refresh();if(currentDepartmentId===id)await loadDepartmentDetails(id);config.notify('Department status saved.');}).catch(e=>config.notify(e.message,'error'));return;
    }
    if(action==='department-delete'&&department?.canDelete&&canEditDepartments()){
      if(!confirm('Permanently delete the unused Department '+department.name+'? This cannot be undone.'))return;
      void request('/api/departments/'+encodeURIComponent(id)+'/delete',{}).then(async()=>{closeDepartmentDialog();if(currentDepartmentId===id){currentDepartmentId=null;departmentDetails=null;departmentRequest++;}await refresh();config.notify('Unused Department deleted.');}).catch(e=>config.notify(e.message,'error'));
    }
  },true);
  document.addEventListener('submit',event=>{
    const form=event.target;if(!config||!['staff-record-form','staff-department-form'].includes(form.id))return;
    event.preventDefault();event.stopImmediatePropagation();
    const button=form.querySelector('button[type="submit"]'),feedback=form.querySelector('[role="status"]');
    if(button)button.disabled=true;
    void (form.id==='staff-record-form'?saveStaff(form):saveDepartment(form)).catch(error=>{
      showStaffConflict(error,feedback,form.dataset.id);
      config.notify(error.message,'error');
    }).finally(()=>{if(button?.isConnected)button.disabled=false;});
  },true);
  document.addEventListener('input',event=>{
    if(event.target?.id!=='staff-directory-search')return;
    searchText=event.target.value;
    const input=event.target,selection=input.selectionStart;
    const rows=staff.filter(record=>{const q=searchText.trim().toLowerCase();return (!q||[record.firstName,record.lastName,departmentName(record.departmentId)].join(' ').toLowerCase().includes(q))&&(statusFilter==='all'||String(record.active)===statusFilter);});
    const parent=input.closest('.preview-staff-directory');
    if(!parent)return;
    // Keep keyboard focus and caret in place while filtering.
    const rendered=renderStaffDirectory();
    const temporary=document.createElement('div');temporary.innerHTML=rendered;
    parent.querySelector('#staff-directory-rows').innerHTML=temporary.querySelector('#staff-directory-rows').innerHTML;
    parent.querySelector('.list-footer').textContent='Showing '+rows.length+' of '+staff.length+' Staff Members';
    if(selection!==null)input.setSelectionRange(selection,selection);
  });
  document.addEventListener('change',event=>{
    if(event.target?.id==='staff-directory-status'){statusFilter=event.target.value;redraw();}
    if(event.target?.id==='staff-create-login'){
      const checked=event.target.checked,fields=document.getElementById('staff-login-fields');
      if(fields){fields.hidden=!checked;fields.querySelectorAll('[name="username"],[name="password"],[name="confirmPassword"]').forEach(input=>input.required=checked);}
    }
  });
  document.addEventListener('keydown',event=>{
    const tab=event.target.closest('[data-staff-action="department-tab"]');
    if(tab){
      const order=['overview','staff','equipment','history'],index=order.indexOf(departmentTab);
      const next={ArrowRight:order[(index+1)%4],ArrowLeft:order[(index+3)%4],Home:order[0],End:order[3]}[event.key];
      if(next){event.preventDefault();selectDepartmentTab(next);}
    }
    if(event.key==='Escape'&&document.querySelector('[data-staff-dialog]'))closeDepartmentDialog();});
  window.caffootStaffDirectory={configure,refresh,enter,render};
})();
