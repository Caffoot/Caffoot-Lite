/* Standalone fictional-data interaction harness. It never loads the application or calls an API. */
'use strict';
const sourceTemplates = JSON.parse(document.getElementById('preview-source-templates').textContent);
const sectionNames = ['Devices', 'IPAM', 'Racks', 'Staff Members', 'Departments', 'IT Assets'];
const sectionLabel = name => name === 'Racks' ? 'Network Racks' : name;
const initialDepartments = [
  {id:'it',name:'IT',archived:false,history:true},
  {id:'production',name:'Production',archived:false,history:true},
  {id:'former-operations',name:'Former Operations',archived:true,history:true},
  {id:'design',name:'Design Lab',archived:false,history:false},
  {id:'former-team',name:'Former Team',archived:true,history:true}
];
const initialStaff = [
  {id:'alex',firstName:'Alex',lastName:'Morgan',email:'alex@example.invalid',departmentId:'it',jobTitle:'IT Technician',telephone:'',location:'Main Office',active:true,accountId:2},
  {id:'priya',firstName:'Priya',lastName:'Taylor',email:'',departmentId:'production',jobTitle:'Production Operative',telephone:'',location:'Workshop',active:true,accountId:null},
  {id:'sam',firstName:'Sam',lastName:'Reed',email:'sam@example.invalid',departmentId:'former-operations',jobTitle:'',telephone:'',location:'',active:false,accountId:null},
  {id:'migrated',firstName:'',lastName:'',email:'',departmentId:null,jobTitle:'',telephone:'',location:'',active:true,accountId:3}
];
const initialRoles = [
  {id:1,roleKey:'staff_member',name:'Staff Member',enabled:true,isBuiltin:true,grants:{}},
  {id:2,roleKey:'it_staff',name:'IT Staff',enabled:true,isBuiltin:true,grants:{Devices:'edit',IPAM:'edit',Racks:'edit'}},
  {id:3,roleKey:'directory_coordinator',name:'Directory Coordinator',enabled:true,isBuiltin:false,grants:{'Staff Members':'edit',Departments:'read'}}
];
const initialUsers = [
  {id:1,username:'preview.admin',isAdmin:true,active:true,mfaEnrolled:true,roles:[1],overrides:{},profile:{firstName:'',lastName:'',displayName:'Preview Administrator',email:''}},
  {id:2,username:'alex.morgan',isAdmin:false,active:true,mfaEnrolled:true,roles:[1,2,3],overrides:{Departments:'deny'},profile:{firstName:'Alex',lastName:'Morgan',displayName:'Alex',email:'alex@example.invalid'}},
  {id:3,username:'migration.example',isAdmin:false,active:true,mfaEnrolled:false,roles:[1],overrides:{},profile:{firstName:'',lastName:'',displayName:'',email:''}}
];
let staff = structuredClone(initialStaff), departments = structuredClone(initialDepartments);
let users = structuredClone(initialUsers), roles = structuredClone(initialRoles);
let destination = 'staff', permissionTab = 'overview', persona = 'admin', assetsEnabled = false;
let currentStaffId = null, searchText = '', statusFilter = 'all';
let dialogState = null, pendingSampleChange = null, toastTimer, createLoginIntent = false;
const groupsOpen = {it:true,staff:true};
const $ = id => document.getElementById(id);
function escapeHtml(value) {return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
function template(name, values=[]) {return sourceTemplates[name].replace(/\{\{slot:(\d+)\}\}/g, (_, index) => String(values[Number(index)] ?? ''));}
function icon(name) {return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><use href="#i-${name}"/></svg>`;}
function isAdministrator() {return persona === 'admin';}
function canReadStaff() {return isAdministrator() || persona.startsWith('staff-');}
function canEditStaff() {return isAdministrator() || persona === 'staff-editor';}
function canReadDepartments() {return isAdministrator() || persona.startsWith('department-');}
function canEditDepartments() {return isAdministrator() || persona === 'department-editor';}
function displayName(record) {return [record.firstName,record.lastName].filter(Boolean).join(' ') || 'Name Not Recorded';}
function departmentName(id) {return departments.find(item => item.id === id)?.name || 'No Department';}
function sampleNotice() {return '<p class="preview-sample-note">PREVIEW ONLY · FICTIONAL SAMPLE DATA · Changes reset on reload. No live application or API connection.</p>';}
function header(title, description, action='') {return `${sampleNotice()}<div class="section-page-header"><div class="eyebrow">${destination==='departments'?'STAFF ORGANISATION':'STAFF DIRECTORY'}</div><div class="header"><div><h1>${title}</h1><p>${description}</p></div>${action?'<div class="preview-page-actions">'+action+'</div>':''}</div></div>`;}
function button(label, action, id='', primary=false) {return `<button class="btn${primary?' primary':''}" type="button" data-preview-action="${action}" data-id="${escapeHtml(id)}">${label}</button>`;}
function badge(label, colour='dark') {return `<span class="badge ${colour}">${label}</span>`;}
function toast(message) {clearTimeout(toastTimer);$('preview-toast').textContent=message;$('preview-toast').classList.add('show');toastTimer=setTimeout(()=>$('preview-toast').classList.remove('show'),3500);}
function navButton(key, label, symbol) {const selected=destination===key||(key==='staff'&&destination.startsWith('staff-'));return `<button type="button" class="nav-item ${selected?'current':'subtle'}" data-destination="${key}" aria-label="${label}" title="${label}" ${selected?'aria-current="page"':''}>${icon(symbol)}<span class="nav-text">${label}</span></button>`;}
function navGroup(key, label, symbol, children) {return `<div class="preview-nav-group"><button type="button" class="nav-item subtle preview-group-toggle" data-preview-group="${key}" aria-label="${label} Group" aria-expanded="${groupsOpen[key]}" aria-controls="preview-group-${key}" title="${label}">${icon(symbol)}<span class="nav-text">${label}</span><span class="preview-group-chevron">${icon('chevron')}</span></button><div id="preview-group-${key}" class="preview-group-children" ${groupsOpen[key]?'':'hidden'}>${children}</div></div>`;}
function renderNavigation() {
  let html='<div class="nav-label">WORKSPACE</div>';
  if(isAdministrator())html+=navButton('dashboard','Dashboard','grid')+navGroup('it','IT','tool',navButton('devices','Devices','box')+(assetsEnabled?navButton('assets','IT Assets','box'):'')+navButton('ipam','IPAM','network')+navButton('racks','Network Racks','rack'));
  const children=(canReadStaff()?navButton('staff','Staff Members','users'):'')+(canReadDepartments()?navButton('departments','Departments','network'):'')+(isAdministrator()?navButton('permissions','Permissions','shield'):'');
  if(children)html+=navGroup('staff','Staff','users',children);
  if(isAdministrator())html+=navButton('audit','Audit Trail','history');
  $('preview-navigation').innerHTML=html;
  $('preview-settings').hidden=!isAdministrator();
  $('preview-settings').innerHTML=icon('settings')+'<span class="nav-text">Settings &amp; Data</span>';
  $('page-title').textContent=({staff:'Staff Members',departments:'Departments',permissions:'Permissions',account:'My Account',dashboard:'Dashboard',devices:'Devices',assets:'IT Assets',ipam:'IPAM',racks:'Network Racks',audit:'Audit Trail',settings:'Settings & Data'})[destination];
}
function renderStaffDirectory() {
  const query=searchText.trim().toLowerCase();
  const visible=staff.filter(record=>(!query||`${record.firstName} ${record.lastName} ${departments.find(item=>item.id===record.departmentId)?.name||''}`.toLowerCase().includes(query))&&(statusFilter==='all'||String(record.active)===statusFilter));
  const rows=visible.map(record=>`<div class="userrow" data-preview-staff-id="${record.id}"><div class="who"><span class="initial" aria-hidden="true">${escapeHtml(record.firstName?.slice(0,1)||'?')}</span><div style="min-width:0"><h3 class="username preview-record-name">${escapeHtml(displayName(record))}</h3><div class="userdesc">${record.firstName?'Staff Member':'Migrated Record · Details Blank'}</div></div></div><div class="role-cell">${escapeHtml(departmentName(record.departmentId))}${departments.find(item=>item.id===record.departmentId)?.archived?'<div class="userdesc">Archived · Membership Retained</div>':''}</div><div class="mfa-cell">${isAdministrator()?badge(record.accountId?'Linked Login':'No Login',record.accountId?'blue':'dark'):escapeHtml(record.jobTitle||'—')}<div style="margin-top:5px">${badge(record.active?'Active':'Inactive',record.active?'green':'red')}</div></div><div class="permissions-cell"><div class="userdesc">${escapeHtml(record.email||'No Email Recorded')}</div><div class="userdesc">${escapeHtml(record.location||'')}</div></div><div class="actions preview-row-actions">${button('View Details','staff-details',record.id,true)}${canEditStaff()?button('Edit','staff-edit',record.id):''}</div></div>`).join('');
  return header('Staff Members','Maintain Staff profiles independently of Caffoot logins.',canEditStaff()?button('+ Add Staff Member','staff-add','',true):'')+`<div class="users-list-shell section active preview-staff-directory"><div class="toolbar"><div class="filters"><div class="field search"><label for="preview-staff-search">Find A Staff Member</label><input class="input" id="preview-staff-search" type="search" placeholder="Search by name or department…" value="${escapeHtml(searchText)}"></div><div class="field filter"><label for="preview-staff-status">Staff Status</label><select class="input" id="preview-staff-status"><option value="all">All Statuses</option><option value="true" ${statusFilter==='true'?'selected':''}>Active</option><option value="false" ${statusFilter==='false'?'selected':''}>Inactive</option></select></div></div></div><div class="card users-list-card"><div class="users-list-table-scroll"><div class="list-header"><span>Staff Member</span><span>Department</span><span>${isAdministrator()?'Login &amp; Status':'Job Title &amp; Status'}</span><span>Contact &amp; Location</span><span>Actions</span></div><div id="preview-staff-rows">${rows||'<p class="cardpad">No matching Staff Members.</p>'}</div></div><div class="list-footer" role="status">Showing ${visible.length} of ${staff.length} Staff Members · Sample Data</div></div></div>`;
}
function detailRow(label,value) {return `<div class="info-row"><label>${label}</label><b>${escapeHtml(value||'Not Recorded')}</b></div>`;}
function renderStaffDetails() {
  const record=staff.find(item=>item.id===currentStaffId);
  return header('Staff Details',displayName(record),button('Back To Staff Members','staff-back')+(canEditStaff()?button('Edit Staff Member','staff-edit',record.id,true):''))+`<section class="section active"><div class="section-heading"><div><h2>${escapeHtml(displayName(record))}</h2><p>${escapeHtml(departmentName(record.departmentId))}</p></div>${badge(record.active?'Active':'Inactive',record.active?'green':'red')}</div><div class="two-col"><div class="card cardpad"><h3 class="cardtitle">Personal Details</h3>${detailRow('First Name',record.firstName)}${detailRow('Surname',record.lastName)}${detailRow('Email Address',record.email)}${detailRow('Telephone',record.telephone)}</div><div class="card cardpad"><h3 class="cardtitle">Organisation</h3>${detailRow('Department',departmentName(record.departmentId))}${detailRow('Job Title',record.jobTitle)}${detailRow('Location',record.location)}<p class="formhint">Staff status is independent of account status. Inactivation does not return equipment or disable a login.</p></div></div>${isAdministrator()?`<div class="card cardpad" style="margin-top:17px"><h3 class="cardtitle">Caffoot Login</h3><p class="sub">${record.accountId?'Linked account: '+escapeHtml(users.find(item=>item.id===record.accountId)?.username||'Sample Account'):'This Staff Member has no Caffoot login.'} Staff and account profiles are managed separately.</p><div class="preview-details-actions">${button(record.accountId?'Manage Login In Permissions':'Create Login',record.accountId?'manage-login':'staff-create-login',record.id)}</div></div>`:''}<div class="preview-details-actions">${canEditStaff()?button(record.active?'Mark Inactive':'Reactivate','staff-status',record.id):''}</div></section>`;
}
function field(label, name, value='', type='text', required=false, help='', markRequired=required) {return `<div class="field preview-form-field"><label for="preview-${name}">${label}${markRequired?' *':''}</label><input class="input" id="preview-${name}" name="${name}" type="${type}" value="${escapeHtml(value)}" ${required?'required':''} ${type==='password'?'autocomplete="new-password"':''}>${help?'<small class="field-help">'+help+'</small>':''}</div>`;}
function renderStaffForm(record, createLogin=false) {
  const editing=!!record;
  record=record||{firstName:'',lastName:'',email:'',departmentId:null,jobTitle:'',telephone:'',location:'',active:true,accountId:null};
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
  else if(record.accountId)loginContent=`<div class="linked-account">${badge('Linked Account','green')}<strong>${escapeHtml(users.find(item=>item.id===record.accountId)?.username||'Sample Account')}</strong><p>Staff and login records remain separate. Manage account access through Permissions.</p></div>${button('Manage Login In Permissions','manage-login',record.id)}`;
  else loginContent=`<label class="switch-row-staff" for="preview-create-login"><span><strong>Create Caffoot Login</strong><small>Enable this if the person needs to sign in to Caffoot Lite.</small></span><span class="switch-control"><input type="checkbox" id="preview-create-login" ${createLogin?'checked':''} aria-controls="preview-login-fields"><span class="switch-slider" aria-hidden="true"></span></span></label>
    <div class="staff-account-fields" id="preview-login-fields" ${createLogin?'':'hidden'}><div class="divider"></div>
    ${field('Username','username','','text',createLogin,'A unique username used to sign in.',true)}
    ${field('Initial Password','password','','password',createLogin,'Share the password using a secure channel.',true)}
    ${field('Confirm Initial Password','confirmPassword','','password',createLogin,'',true)}
    <div class="staff-role-note"><span class="role-name">Staff Member</span><strong>Default Role</strong><p>The baseline role is assigned to every new ordinary login. It does not grant general Devices, IT Assets, IPAM or Network Racks access.</p><p>Additional roles and individual permissions remain managed through the existing Permissions controls.</p></div>
    <div class="staff-mfa-hint"><strong>MFA And Security</strong><p>Existing password, MFA and account safeguards still apply. Any enabled additional role requires MFA.</p></div></div>`;
  const login=`<div class="card card-padded staff-login-card">${cardHeading('Caffoot Login','Optional account access, managed using the existing permissions system.','shield','orange')}${loginContent}</div>`;
  const guidance='<div class="card card-padded staff-security-summary"><h3>Equipment And Ticket Access</h3><p class="sub">A Staff record can hold equipment assignments without a login. A linked login later provides only the personal access allowed by the baseline Staff Member role.</p><div class="divider"></div><div class="staff-quickpoints"><div><span class="point-dot"></span><span>Assigned equipment stays linked to this Staff Member.</span></div><div><span class="point-dot"></span><span>Service Desk self-service arrives in the planned future stage.</span></div><div><span class="point-dot"></span><span>No automatic IT inventory permission or department-based grant.</span></div></div><p class="formhint" style="margin-top:14px">Context only: equipment and ticket actions are not operational in this preview.</p></div>';
  return header(editing?'Edit Staff Member':'Add Staff Member','A Staff profile does not require a Caffoot login.',button('Back To Staff Members','staff-back'))+`<section class="section active staff-mode-view"><form id="preview-staff-form" class="preview-aligned-form" data-id="${record.id||''}" autocomplete="off"><div class="staff-main-grid">${personal}<div class="staff-side-stack">${login}${guidance}</div></div><div class="staff-actions"><p><strong>Preview only.</strong> Changes affect fictional sample data and never write application records or create a live login.</p><div class="staff-action-buttons">${button('Cancel','staff-back')}<button class="btn primary" type="submit">Save Staff Member</button></div></div><p class="formhint" id="preview-form-feedback" role="status"></p></form></section>`;
}

function renderDepartments() {
  return header('Departments','Simple, flat Departments with preserved Staff relationships.',canEditDepartments()?button('+ Add Department','department-add','',true):'')+`<section class="section active"><div class="card users-list-card"><div class="users-list-table-scroll"><div class="list-header"><span>Department</span><span>Status</span><span>Membership</span><span>Availability</span><span>Manage</span></div>${departments.map(item=>`<div class="userrow"><div class="who"><span class="initial" aria-hidden="true">${escapeHtml(item.name.slice(0,1))}</span><div><h3 class="username">${escapeHtml(item.name)}</h3></div></div><div class="role-cell">${badge(item.archived?'Archived':'Active',item.archived?'amber':'green')}</div><div class="mfa-cell"><span class="userdesc">${item.archived?'Existing Links Retained':'Optional Staff Membership'}</span></div><div class="permissions-cell"><span class="userdesc">${item.archived?'No New Membership':'Available For New Membership'}</span></div><div class="actions">${canEditDepartments()?button('Manage','department-edit',item.id):'Read Only'}</div></div>`).join('')}</div><div class="list-footer">${departments.length} Departments · Sample Data</div></div><p class="formhint">Archive Departments with any current or historical associations. Permanent deletion is available only for a never-associated Department, such as the sample Design Lab.</p></section>`;
}

function permissionLabel(level) {return ({read:'Read',edit:'Edit',deny:'No Access'})[level]||'No Access';}
function inheritedGrant(user, section) {return roles.filter(role=>user.roles.includes(role.id)&&role.enabled&&role.roleKey!=='staff_member').reduce((level,role)=>role.grants[section]==='edit'?'edit':level||role.grants[section]||null,null);}
function effectiveGrant(user, section) {if(user.isAdmin)return 'edit';const choice=user.overrides[section];return choice==='deny'?null:choice||inheritedGrant(user,section);}
function mandatoryMfa(user) {return user.isAdmin||roles.some(role=>user.roles.includes(role.id)&&role.enabled&&role.roleKey!=='staff_member')||sectionNames.some(section=>effectiveGrant(user,section));}
function userAccessDescription(user) {return user.mfaEnrolled?'MFA Enrolled':mandatoryMfa(user)?'MFA Required · Setup Pending':'MFA Optional';}
function renderPermissions() {
  const tabs=[['overview','Overview','grid'],['list','User List','users'],['add','Add User','user'],['roles','Manage Roles','shield']].map(([key,label,symbol])=>`<button class="tab section-tab-control${permissionTab===key?' active':''}" type="button" data-permission-tab="${key}" aria-selected="${permissionTab===key}">${icon(symbol)}${label}</button>`).join('');
  const top=sampleNotice()+template('shared/render-section-header-4',[tabs]).replace('Users &amp; Permissions','Permissions').replace('Changes are saved centrally and checked by the server.','The application checks changes on the server. This preview changes sample data only.');
  if(permissionTab==='roles')return top+renderRoleCatalogue();
  if(permissionTab==='add')return top+renderAddUser();
  if(permissionTab==='overview')return top+renderPermissionsOverview();
  const rows=users.map(user=>template('users/rows-1',[
    user.id,escapeHtml([user.username,...Object.values(user.profile)].filter(Boolean).join(' ').toLowerCase()),user.active?'active':'disabled',user.mfaEnrolled?'enrolled':'pending',escapeHtml(user.username[0].toUpperCase()),escapeHtml(user.username),user.id===1?'Your Account · Protected':escapeHtml(user.profile.displayName||[user.profile.firstName,user.profile.lastName].filter(Boolean).join(' ')||'Staff Member'),user.isAdmin?'blue':'dark',user.isAdmin?'Administrator':'Staff Member',user.active?'green':'red',user.active?'Active':'Disabled',user.mfaEnrolled?'green':'amber',userAccessDescription(user),user.isAdmin?'<span class="badge dark">All Sections</span>':sectionNames.map(section=>`<span class="mini ${effectiveGrant(user,section)==='edit'?'edit':effectiveGrant(user,section)?'':'no'}">${sectionLabel(section)}: ${permissionLabel(effectiveGrant(user,section))}</span>`).join(' '),user.id,user.id===1?'View':'Manage',roles.filter(role=>user.roles.includes(role.id)&&role.roleKey!=='staff_member').map(role=>badge(escapeHtml(role.name),role.enabled?'blue':'amber')).join('')])).join('');
  return top+'<div class="users-live">'+template('users/account-list-panel',[rows,users.length,users.length])+'</div>';
}
function renderPermissionsOverview() {
  const stats=[['Total Users',users.length,'users','Recorded Sample Accounts'],['Administrators',users.filter(user=>user.isAdmin).length,'shield','Independent Account Flag'],['Active Users',users.filter(user=>user.active).length,'check','Accounts Currently Enabled'],['MFA Enrolled',users.filter(user=>user.mfaEnrolled).length,'key','Authenticator Enrolment']];
  const bars=items=>items.map(([label,count,colour])=>`<div class="barrow"><div class="barline"><span>${label}</span><b>${count}</b></div><div class="track"><div class="fill ${colour}" style="width:${users.length?Math.round(count/users.length*100):0}%"></div></div></div>`).join('');
  const inheritedPanels='<div class="two-col"><div class="card cardpad"><h3 class="cardtitle">Accounts By Role</h3><p class="sub">Staff Member is automatic; additional roles grant reusable section access.</p>'+bars([['Administrators',users.filter(user=>user.isAdmin).length,''],['Staff Members',users.length,'soft']])+'<div class="card-end"><span class="tiny">All figures come from fictional sample accounts.</span><button class="action-link" type="button" data-permission-tab="list">View User List →</button></div></div><div class="card cardpad"><h3 class="cardtitle">Authenticator Enrolment</h3><p class="sub">Enabled additional roles and wider Read/Edit access require MFA.</p>'+bars([['Enrolled',users.filter(user=>user.mfaEnrolled).length,''],['Not Enrolled',users.filter(user=>!user.mfaEnrolled).length,'orange']])+'<div class="card-end"><span class="tiny">Required enrolment starts at sign-in.</span><button class="action-link" type="button" data-action="users-filter-pending">Review Not Enrolled →</button></div></div></div>';
  return '<div class="users-live"><section class="section active">'+template('users/overview-summary')+button('+ Add User','user-add','',true)+'</div><div class="cards4">'+stats.map(([label,count,symbol,foot])=>`<section class="card cardpad stat"><div class="stathead"><span>${label}</span><span class="stat-icon">${template('users/icon-'+symbol)}</span></div><div class="statnum">${count}</div><div class="statfoot">${foot}</div></section>`).join('')+'</div>'+inheritedPanels+'<div class="card cardpad" style="margin-top:17px"><div class="section-heading"><div><h2>Access, Made Simple</h2><p>Enabled roles supply inherited access; individual overrides take precedence.</p></div></div>'+template('users/read-access-guide')+'<div class="guide-item"><strong>Read</strong><p>Users can view permitted records without changing information in that section.</p></div>'+template('users/edit-access-guide')+'</div>';
}
function renderRoleCatalogue() {
  return '<div class="users-live"><section class="section active" aria-label="Manage Roles"><div class="section-heading"><div><h2>Manage Roles</h2><p>Reusable section grants, separate from Administrator status.</p></div>'+button('+ Create Role','role-add','',true)+'</div><div class="card cardpad">'+roles.map(role=>`<div class="switch-row role-catalogue-row"><div><strong>${escapeHtml(role.name)}</strong><small>${role.roleKey==='staff_member'?'Protected Staff Member Baseline':(role.isBuiltin?'Protected Identity · ':'')+(role.enabled?'Enabled · MFA Required':'Disabled · Assignments Retained')} · ${users.filter(user=>user.roles.includes(role.id)).length} Assigned Accounts</small><small>${sectionNames.map(section=>sectionLabel(section)+': '+permissionLabel(role.grants[section])).join(' · ')}</small></div><button class="btn" type="button" data-preview-action="role-edit" data-id="${role.id}" ${role.roleKey==='staff_member'?'disabled':''}>${role.roleKey==='staff_member'?'Protected':'Manage'}</button></div>`).join('')+'</div><p class="formhint">Disabling a role retains assignments. Other roles and individual overrides may retain access. Every change needs review and confirmation. IT Assets grants do not enable its feature.</p></section></div>';
}
function renderAddUser() {
  return '<div class="users-live"><section class="section active users-create-shell">'+template('users/next-render-users-1')+'<div class="addwrap"><div class="card form-panel"><h3 class="cardtitle">Create User</h3>'+template('users/next-render-users-2')+'<form id="preview-user-create-form"><div class="form-grid">'+template('users/next-render-users-3')+template('users/next-render-users-4')+template('users/next-render-users-5')+'<div class="form-grid profile-grid">'+field('First Name','accountFirstName')+field('Last Name','accountLastName')+field('Display Name','accountDisplayName')+field('Email Address','accountEmail','','email')+'</div>'+template('users/next-render-users-6')+template('users/next-render-users-7')+template('users/next-render-users-8');
}
function renderContextOnly() {
  return `${sampleNotice()}<div class="header"><div><h1>${escapeHtml($('page-title').textContent)}</h1><p>Existing v2.1 destination retained in the navigation.</p></div></div><div class="context">This preview does not propose changes to this existing screen. Use Staff Members, Departments or Permissions to review the additions.${destination==='assets'?' IT Assets is shown only because the separate review switch was enabled; no stock actions are implemented.':''}</div>${button('Return To Staff Preview',canReadStaff()?'staff-back':'departments-back')}`;
}
function renderMain() {
  renderNavigation();
  const root=$('main-content');
  root.className='main users-live';
  if(destination==='staff')root.innerHTML=renderStaffDirectory();
  else if(destination==='staff-details')root.innerHTML=renderStaffDetails();
  else if(destination==='staff-form')root.innerHTML=renderStaffForm(staff.find(item=>item.id===currentStaffId),createLoginIntent);
  else if(destination==='departments')root.innerHTML=renderDepartments();
  else if(destination==='permissions'&&isAdministrator())root.innerHTML=renderPermissions();
  else root.innerHTML=renderContextOnly();
  if(destination.startsWith('staff-'))$('page-title').textContent=destination==='staff-details'?'Staff Details':currentStaffId?'Edit Staff Member':'Add Staff Member';
}
function openDialog(title, description, body, actions='') {
  closeDialog();
  const opener=document.activeElement;
  const layer=document.createElement('div');layer.className='users-live';layer.dataset.roleLayer='';
  layer.innerHTML=`<div class="modal-layer users-management-modal"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="preview-dialog-title"><div class="modal-head"><div><h2 id="preview-dialog-title">${title}</h2><p>${description}</p></div><button type="button" class="close app-modal-close" aria-label="Close Dialog" data-preview-action="close-dialog">Close ×</button></div><div class="modal-body">${body}<p class="formhint" id="preview-dialog-feedback" role="status"></p><div class="modal-actions">${actions}</div></div></div></div>`;
  const elements=[$('sidebar'),document.querySelector('.topbar'),...$('main-content').children];
  elements.forEach(element=>element.inert=true);
  $('main-content').append(layer);document.body.style.overflow='hidden';
  dialogState={layer,opener,elements};layer.querySelector('.close').focus();
}
function closeDialog() {
  if(!dialogState)return;
  const {layer,opener,elements}=dialogState;layer.remove();elements.forEach(element=>element.inert=false);document.body.style.overflow='';dialogState=null;
  if(opener?.isConnected)opener.focus();
}
function openDepartmentDialog(id) {
  const record=departments.find(item=>item.id===id);
  const used=record&&(record.history||staff.some(person=>person.departmentId===record.id));
  const body=`<form id="preview-department-form" class="preview-aligned-form" data-id="${record?.id||''}"><div class="form-grid">${field('Department Name','departmentName',record?.name||'','text',true)}<div class="field preview-form-field"><label for="preview-department-status">Status</label><select class="input" id="preview-department-status" name="archived"><option value="false" ${!record?.archived?'selected':''}>Active</option><option value="true" ${record?.archived?'selected':''}>Archived</option></select></div></div><p class="formhint">Archiving retains Staff membership and history. Archived Departments cannot receive new membership.</p>${used?'<div class="modal-warning">This sample Department has current or historical associations. Archive it instead of deleting it.</div>':''}</form>`;
  openDialog(record?'Manage Department':'Add Department','Flat Department records. Changes affect fictional sample data only.',body,(record?button(record.archived?'Reactivate':'Archive',record.archived?'department-reactivate':'department-archive',record.id):'')+(record&&!used?button('Delete Permanently','department-delete',record.id):'')+button('Cancel','close-dialog')+'<button class="btn primary" type="submit" form="preview-department-form">Save Department</button>');
}
function openAccountDialog(id) {
  if(!isAdministrator())return;
  const user=users.find(item=>item.id===Number(id));if(!user)return;
  const own=user.id===1;
  const permissions=sectionNames.map(section=>template('users/permission-controls-1',[
    section.toLowerCase().replaceAll(' ','-'),sectionLabel(section),section.toLowerCase().replaceAll(' ','-'),user.id,section,own||user.isAdmin?'disabled':'',
    [['','Inherit'],['deny','No Access'],['read','Read'],['edit','Edit']].map(([value,label])=>`<option value="${value}" ${(user.overrides[section]||'')===value?'selected':''}>${label}</option>`).join(''),permissionLabel(inheritedGrant(user,section)),permissionLabel(effectiveGrant(user,section))+(section==='IT Assets'&&!assetsEnabled?' · Feature Disabled':'')])).join('');
  const profile=template('users/source-profile',[user.id,...['firstName','lastName','displayName','email'].map(key=>escapeHtml(user.profile[key]||'')),own?'Use My Account for your own personal details.':'These account details do not synchronise Staff profiles.',own?'disabled':'']);
  const membership='<div class="section-label" style="margin-top:24px">Assigned Roles</div><p class="formhint">Staff Member is automatic. Each additional enabled role requires MFA, even without section grants. Review and confirm each change.</p><div class="role-memberships">'+roles.map(role=>`<label class="role-membership"><input type="checkbox" data-preview-membership="${role.id}" data-user-id="${user.id}" ${user.roles.includes(role.id)?'checked':''} ${own||role.roleKey==='staff_member'?'disabled':''}><span>${escapeHtml(role.name)}${role.isBuiltin?' · Protected':''}${!role.enabled?' · Disabled':''}</span></label>`).join('')+'</div>';
  const operation=(action,label)=>`<button type="button" class="btn" data-preview-action="${action}" data-id="${user.id}" ${own?'disabled':''}>${label}</button>`;
  const controls=template('users/source-account-control',[user.active?'Disable Account':'Enable Account','Account status remains independent of Staff status.',operation('user-active',user.active?'Disable':'Enable')])+template('users/source-account-control',[user.isAdmin?'Remove Administrator':'Make Administrator','Administrator promotion requires enrolled MFA. Self and last-administrator protection remain.',operation('user-admin',user.isAdmin?'Remove Administrator':'Make Administrator')])+template('users/source-delete-control',[operation('user-delete','Delete User')]);
  const meta=template('users/source-user-meta',[user.active?'green':'red',user.active?'Active':'Disabled',user.isAdmin?'blue':'dark',user.isAdmin?'Administrator · All Sections':'Staff Member',user.mfaEnrolled?'green':'amber',userAccessDescription(user)]);
  const content=template('users/account-management-dialog',[own?'Your Administrator Account':'Manage '+escapeHtml(user.username),own?'Self-protection prevents account changes here. Use My Account for your own security settings.':'Review the existing account controls. This is a sample-only simulation.',meta,profile+membership,user.isAdmin?'<div class="note-row">Administrator access is independent of section overrides. Disabled features remain unavailable.</div>':'','<p class="formhint">Highest enabled-role grant is inherited. Individual No Access, Read or Edit takes precedence. Inherit restores the role result.</p>'+template('users/access-summary',[permissions]),own?'<div class="modal-warning">You cannot disable, demote or delete your own signed-in administrator account.</div>':!user.mfaEnrolled&&mandatoryMfa(user)?'<div class="modal-warning">MFA enrolment is required before wider Read/Edit access or additional roles can be used.</div>':'',controls,'','']);
  closeDialog();
  const opener=document.activeElement,layer=document.createElement('div');layer.className='users-live';layer.innerHTML=content;
  const elements=[$('sidebar'),document.querySelector('.topbar'),...$('main-content').children];elements.forEach(element=>element.inert=true);
  $('main-content').append(layer);document.body.style.overflow='hidden';dialogState={layer,opener,elements};
  layer.querySelector('.close').focus();
}
function openRoleDialog(id) {
  const role=roles.find(item=>item.id===Number(id));if(role?.roleKey==='staff_member')return;
  const body=`<form id="preview-role-form" data-id="${role?.id||''}"><div class="field"><label for="preview-role-name">Role Name</label><input class="input" id="preview-role-name" name="name" required maxlength="80" value="${escapeHtml(role?.name||'')}" ${role?.isBuiltin?'readonly':''}></div><label class="role-membership"><input type="checkbox" name="enabled" ${!role||role.enabled?'checked':''} ${!role?'disabled':''}>Enabled</label><p class="formhint">Enabled additional roles require MFA. Built-in names are protected; custom role renaming retains assignments.</p><div class="access-grid">${sectionNames.map(section=>`<div class="access-option"><label for="preview-role-${section.toLowerCase().replaceAll(' ','-')}">${sectionLabel(section)}</label><select class="input" id="preview-role-${section.toLowerCase().replaceAll(' ','-')}" name="${section}">${[['','No Access'],['read','Read'],['edit','Edit']].map(([value,label])=>`<option value="${value}" ${(role?.grants[section]||'')===value?'selected':''}>${label}</option>`).join('')}</select></div>`).join('')}</div></form>`;
  openDialog(role?'Manage '+escapeHtml(role.name):'Create Role','New roles start unassigned. Administrator status is managed separately.',body,(role&&!role.isBuiltin?button('Delete Role','role-delete',role.id):'')+'<button class="btn primary" type="submit" form="preview-role-form">Review Changes</button>');
}
function reviewSampleAccessChange(title, apply, explanation='') {
  const snapshot=()=>users.map(user=>({id:user.id,username:user.username,active:user.active,isAdmin:user.isAdmin,mfa:userAccessDescription(user),roles:[...user.roles],sections:sectionNames.map(section=>({section,inherited:inheritedGrant(user,section),override:user.overrides[section]||null,effective:effectiveGrant(user,section)}))}));
  const before=snapshot(),saved={users:structuredClone(users),roles:structuredClone(roles),staff:structuredClone(staff)};
  let after;
  try {apply();after=snapshot();} finally {users=saved.users;roles=saved.roles;staff=saved.staff;}
  const affected=before.filter(user=>JSON.stringify(user)!==JSON.stringify(after.find(item=>item.id===user.id)));
  const state=details=>details?`<p>Account ${details.active?'Active':'Disabled'} · ${details.isAdmin?'Administrator':'Standard User'} · ${details.mfa}</p><ul>${details.sections.map(right=>`<li><strong>${sectionLabel(right.section)}</strong>: Inherited ${permissionLabel(right.inherited)}; Override ${right.override?permissionLabel(right.override):'Inherit'}; Effective ${permissionLabel(right.effective)}${right.section==='IT Assets'&&!assetsEnabled?' · Feature Disabled':''}</li>`).join('')}</ul>`:'<p>Account removed; independent Staff record retained.</p>';
  const userRows=affected.map(user=>`<section class="role-impact-account"><h3>${escapeHtml(user.username)}</h3><strong>Before</strong>${state(user)}<strong>After</strong>${state(after.find(item=>item.id===user.id))}</section>`).join('');
  openDialog('Review Access Change','Review and confirm before changing sample access.',`<div class="note-row"><div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(explanation)}</p></div></div><p>${affected.length} Affected Sample Accounts · Changed rights or membership require session revocation in the application.</p><p class="formhint">Visual simulation only. Authoritative before/after rights, session counts, MFA consequences and confirmation proofs must still come from the existing server preview/confirmation service.</p>${userRows||'<p>No assigned sample account changes. Role definition remains separately reviewable.</p>'}`,button('Cancel','close-dialog')+button('Confirm Change','confirm-sample-change','',true));
  pendingSampleChange=apply;
}

function goTo(next) {
  if((next.startsWith('staff')&&!canReadStaff())||(next==='departments'&&!canReadDepartments())||(next==='permissions'&&!isAdministrator()))return;
  if(!isAdministrator()&&!['staff','departments','account'].includes(next))return;
  closeDialog();destination=next;searchText='';statusFilter='all';createLoginIntent=false;renderMain();window.scrollTo(0,0);
}
function confirmDirectoryChange(title, description, apply) {
  openDialog(title,'Fictional sample data only.',`<div class="modal-warning">${description}</div>`,button('Cancel','close-dialog')+button('Confirm','confirm-sample-change','',true));pendingSampleChange=apply;
}
function filterPreviewUsers() {
  const list=$('users-live-list');if(!list)return;
  const search=$('live-users-search').value.trim().toLowerCase(),status=$('live-users-status').value,mfa=$('live-users-mfa').value;
  const rows=[...list.querySelectorAll('[data-users-row]')];let count=0;
  rows.forEach(row=>{const visible=(!search||row.dataset.search.toLowerCase().includes(search))&&(status==='all'||row.dataset.active===status)&&(mfa==='all'||row.dataset.mfa===mfa);row.hidden=!visible;if(visible)count++;});
  $('live-users-count').textContent=`Showing ${count} of ${rows.length} accounts`;
}
document.addEventListener('click', event=>{
  const group=event.target.closest('[data-preview-group]');
  if(group){groupsOpen[group.dataset.previewGroup]=!groupsOpen[group.dataset.previewGroup];renderNavigation();return;}
  const navigation=event.target.closest('[data-destination]');
  if(navigation){goTo(navigation.dataset.destination);return;}
  if(event.target.closest('[data-action="tab-account"]')){goTo('account');return;}
  if(event.target.closest('#preview-collapse')){const collapsed=$('app').classList.toggle('collapsed');$('sidebar').classList.toggle('collapsed',collapsed);$('preview-collapse').setAttribute('aria-expanded',String(!collapsed));return;}
  if(event.target.closest('#preview-reset')){location.reload();return;}
  const tab=event.target.closest('[data-permission-tab]');
  if(tab&&isAdministrator()){permissionTab=tab.dataset.permissionTab;closeDialog();renderMain();return;}
  const sourceAction=event.target.closest('[data-action]');
  if(sourceAction&&isAdministrator()){
    if(sourceAction.dataset.action==='users-open-editor'){openAccountDialog(sourceAction.dataset.userId);return;}
    if(sourceAction.dataset.action==='users-close-editor'){closeDialog();return;}
    if(sourceAction.dataset.action==='users-add-nav'){permissionTab='add';closeDialog();renderMain();return;}
    if(sourceAction.dataset.action==='users-filter-pending'){permissionTab='list';closeDialog();renderMain();$('live-users-mfa').value='pending';filterPreviewUsers();return;}
  }
  const control=event.target.closest('[data-preview-action]');if(!control)return;
  const action=control.dataset.previewAction,id=control.dataset.id;
  if(action==='close-dialog'){closeDialog();pendingSampleChange=null;return;}
  if(action==='staff-back'){goTo('staff');return;}
  if(action==='departments-back'){goTo('departments');return;}
  if(action==='staff-details'&&canReadStaff()){currentStaffId=id;destination='staff-details';renderMain();return;}
  if(['staff-add','staff-edit','staff-create-login'].includes(action)&&canEditStaff()){
    if(action==='staff-create-login'&&!isAdministrator())return;
    currentStaffId=action==='staff-add'?null:id;createLoginIntent=action==='staff-create-login';destination='staff-form';renderMain();return;
  }
  if(action==='manage-login'&&isAdministrator()){
    const record=staff.find(item=>item.id===id);goTo('permissions');permissionTab='list';renderMain();openAccountDialog(record.accountId);return;
  }
  if(action==='staff-status'&&canEditStaff()){
    const record=staff.find(item=>item.id===id);
    confirmDirectoryChange(record.active?'Mark Staff Inactive':'Reactivate Staff','Staff status changes do not change a login, remove history or return equipment.',()=>{staff.find(item=>item.id===id).active=!record.active;});return;
  }
  if(action.startsWith('department-')&&canEditDepartments()){
    if(['department-add','department-edit'].includes(action)){openDepartmentDialog(id);return;}
    const record=departments.find(item=>item.id===id);if(!record)return;
    if(action==='department-delete'){
      if(record.history||staff.some(person=>person.departmentId===id)){toast('This Department must be archived because it has associations.');return;}
      confirmDirectoryChange('Delete Department Permanently','This sample Department has no current or historical associations. This action removes only the sample Department.',()=>{departments=departments.filter(item=>item.id!==id);});return;
    }
    const archived=action==='department-archive';
    confirmDirectoryChange(archived?'Archive Department':'Reactivate Department',archived?'Existing Staff membership is retained. New membership becomes unavailable.':'This Department becomes available for future membership; history is retained.',()=>{departments.find(item=>item.id===id).archived=archived;});return;
  }
  if(action==='confirm-sample-change'){
    const apply=pendingSampleChange;pendingSampleChange=null;closeDialog();if(apply)apply();renderMain();toast('Sample change saved in this preview only.');return;
  }
  if(!isAdministrator())return;
  if(action==='user-add'){permissionTab='add';renderMain();return;}
  if(action==='role-add'||action==='role-edit'){openRoleDialog(id);return;}
  if(action==='role-delete'){
    const role=roles.find(item=>item.id===Number(id));if(!role||role.isBuiltin)return;
    reviewSampleAccessChange('Delete '+role.name,()=>{roles=roles.filter(item=>item.id!==Number(id));users.forEach(user=>user.roles=user.roles.filter(roleId=>roleId!==Number(id)));});return;
  }
  if(action.startsWith('user-')){
    const user=users.find(item=>item.id===Number(id));if(!user||user.id===1)return;
    if(action==='user-admin'&&!user.isAdmin&&!user.mfaEnrolled){toast('MFA enrolment is required before administrator promotion.');return;}
    if(user.isAdmin&&user.active&&users.filter(item=>item.isAdmin&&item.active).length<=1){toast('The last active administrator is protected.');return;}
    reviewSampleAccessChange(action==='user-active'?'Change Account Status':action==='user-admin'?'Change Administrator Status':'Delete Login Account',()=>{
      const current=users.find(item=>item.id===Number(id));
      if(action==='user-active')current.active=!current.active;
      if(action==='user-admin')current.isAdmin=!current.isAdmin;
      if(action==='user-delete'){users=users.filter(item=>item.id!==Number(id));staff.forEach(record=>{if(record.accountId===Number(id))record.accountId=null;});}
    },'Staff status, directory profile and history remain independent.');
  }
});
document.addEventListener('input',event=>{
  if(event.target.id==='preview-staff-search'){
    const position=event.target.selectionStart;searchText=event.target.value;renderMain();$('preview-staff-search').focus();$('preview-staff-search').setSelectionRange(position,position);
  }
  if(event.target.id==='live-users-search'){
    filterPreviewUsers();
  }
});
document.addEventListener('change',event=>{
  const target=event.target;
  if(target.id==='preview-theme'){document.documentElement.classList.toggle('dark',target.value==='dark');return;}
  if(target.id==='preview-persona'){closeDialog();persona=target.value;destination=canReadStaff()?'staff':'departments';currentStaffId=null;searchText='';statusFilter='all';createLoginIntent=false;renderMain();return;}
  if(target.id==='preview-assets'){assetsEnabled=target.checked;if(destination==='assets'&&!assetsEnabled)destination='staff';renderMain();return;}
  if(target.id==='preview-staff-status'){statusFilter=target.value;renderMain();return;}
  if(target.id==='preview-create-login'){
    $('preview-login-fields').hidden=!target.checked;
    $('preview-login-fields').querySelectorAll('input').forEach(input=>{input.required=target.checked;input.disabled=!target.checked;if(!target.checked)input.value='';});return;
  }
  if(target.matches('[data-next-user-permission]')&&isAdministrator()){
    const id=Number(target.dataset.userId),section=target.dataset.section,value=target.value;
    const user=users.find(item=>item.id===id);target.value=user.overrides[section]||'';
    if(user.isAdmin||id===1)return;
    reviewSampleAccessChange(sectionLabel(section)+' — '+(value?permissionLabel(value):'Inherit'),()=>{const current=users.find(item=>item.id===id);if(value)current.overrides[section]=value;else delete current.overrides[section];},'An individual override takes precedence over inherited grants. Feature switches remain independent.');return;
  }
  if(target.matches('[data-preview-membership]')&&isAdministrator()){
    const id=Number(target.dataset.userId),roleId=Number(target.dataset.previewMembership),assigned=target.checked;
    target.checked=!assigned;if(id===1||roles.find(role=>role.id===roleId)?.roleKey==='staff_member')return;
    reviewSampleAccessChange((assigned?'Assign':'Remove')+' Role',()=>{const user=users.find(item=>item.id===id);user.roles=assigned?[...user.roles,roleId]:user.roles.filter(value=>value!==roleId);},'Changing role membership requires rechecking MFA and revoking affected sessions.');return;
  }
  if(['live-users-status','live-users-mfa'].includes(target.id)){
    filterPreviewUsers();
  }
});
document.addEventListener('submit',event=>{
  event.preventDefault();
  const form=event.target,data=new FormData(form);
  if(!form.reportValidity())return;
  if(form.id==='preview-staff-form'&&canEditStaff()){
    const login=isAdministrator()&&$('preview-create-login')?.checked;
    if(login&&data.get('password')!==data.get('confirmPassword')){$('preview-form-feedback').textContent='Passwords must match.';$('preview-confirmPassword').focus();return;}
    const id=form.dataset.id||crypto.randomUUID(),existing=staff.find(item=>item.id===id);
    const values=Object.fromEntries(['firstName','lastName','email','jobTitle','telephone','location'].map(key=>[key,String(data.get(key)||'').trim()]));
    if(!existing&&(!values.firstName||!values.lastName)){$('preview-form-feedback').textContent='Enter First Name and Surname.';return;}
    const departmentId=String(data.get('departmentId')||'')||null;
    if(departments.find(item=>item.id===departmentId)?.archived&&existing?.departmentId!==departmentId){$('preview-form-feedback').textContent='Choose an active Department.';return;}
    if(login&&users.some(user=>user.username.toLowerCase()===String(data.get('username')).toLowerCase())){$('preview-form-feedback').textContent='Choose a unique sample username.';return;}
    const record={...existing,...values,id,departmentId,active:data.get('active')==='true',accountId:existing?.accountId||null};
    if(login){const userId=Math.max(...users.map(user=>user.id))+1;users.push({id:userId,username:String(data.get('username')).trim(),isAdmin:false,active:true,mfaEnrolled:false,roles:[1],overrides:{},profile:{...values,displayName:''}});record.accountId=userId;}
    if(existing)Object.assign(existing,record);else staff.push(record);
    [existing?.departmentId,departmentId].filter(Boolean).forEach(department=>{departments.find(item=>item.id===department).history=true;});
    currentStaffId=id;createLoginIntent=false;destination='staff-details';renderMain();toast('Staff sample saved. Account profile changes remain separate.');return;
  }
  if(form.id==='preview-department-form'&&canEditDepartments()){
    const id=form.dataset.id,name=String(data.get('departmentName')).trim();
    if(!name||departments.some(item=>item.id!==id&&item.name.toLowerCase()===name.toLowerCase())){$('preview-dialog-feedback').textContent='Choose a unique Department name.';return;}
    const existing=departments.find(item=>item.id===id);
    if(existing)Object.assign(existing,{name,archived:data.get('archived')==='true'});else departments.push({id:crypto.randomUUID(),name,archived:data.get('archived')==='true',history:false});
    closeDialog();renderMain();toast('Sample Department saved; existing membership is retained.');return;
  }
  if(!isAdministrator())return;
  if(form.id==='preview-role-form'){
    const id=Number(form.dataset.id)||Math.max(...roles.map(role=>role.id))+1;
    const values={name:String(data.get('name')).trim(),enabled:form.dataset.id?data.has('enabled'):true,grants:Object.fromEntries(sectionNames.filter(section=>data.get(section)).map(section=>[section,data.get(section)]))};
    reviewSampleAccessChange('Save '+values.name,()=>{const role=roles.find(item=>item.id===id);if(role)Object.assign(role,values);else roles.push({...values,id,roleKey:'sample_'+id,isBuiltin:false});},sectionNames.map(section=>sectionLabel(section)+': '+permissionLabel(values.grants[section])).join(' · '));return;
  }
  if(form.id==='next-user-profile-form'){
    const user=users.find(item=>item.id===Number(form.dataset.userId));if(user.id===1)return;
    user.profile=Object.fromEntries(['firstName','lastName','displayName','email'].map(key=>[key,String(data.get(key)||'').trim()]));toast('Sample account profile updated. Staff directory details are unchanged.');return;
  }
  if(form.id==='preview-user-create-form'){
    if(data.get('password')!==data.get('confirmPassword')){toast('Passwords must match.');return;}
    const username=String(data.get('username')).trim();if(users.some(user=>user.username.toLowerCase()===username.toLowerCase())){toast('Choose a unique sample username.');return;}
    const id=Math.max(...users.map(user=>user.id))+1;
    const profile={firstName:String(data.get('accountFirstName')||''),lastName:String(data.get('accountLastName')||''),displayName:String(data.get('accountDisplayName')||''),email:String(data.get('accountEmail')||'')};
    users.push({id,username,isAdmin:false,active:true,mfaEnrolled:false,roles:[1],overrides:{},profile});staff.push({id:crypto.randomUUID(),...profile,departmentId:null,jobTitle:'',telephone:'',location:'',active:true,accountId:id});permissionTab='list';renderMain();toast('Sample account created with one Staff identity and the baseline role only.');
  }
});
document.addEventListener('keydown',event=>{
  if(!dialogState)return;
  if(event.key==='Escape'){event.preventDefault();closeDialog();pendingSampleChange=null;return;}
  if(event.key!=='Tab')return;
  const controls=[...dialogState.layer.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),[tabindex="0"]')].filter(element=>element.getClientRects().length);
  if(event.shiftKey&&document.activeElement===controls[0]){event.preventDefault();controls.at(-1).focus();}
  else if(!event.shiftKey&&document.activeElement===controls.at(-1)){event.preventDefault();controls[0].focus();}
});
renderMain();
