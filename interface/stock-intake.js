/* Stock screens use the existing application cards, tables, forms and access rules. */
'use strict';
(function(){
  let config=null,items=[],receipts=[],changes=[],tab='receive',detail=null,loaded=false,loading=false;
  let error='',receiptMode='new',pending=false,generation=0,detailRequest=0;
  const safe=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function canRead(){return !!config?.canRead();}
  function canEdit(){return !!config?.canEdit();}
  function stockLabel(item){return [item.manufacturer,item.model].filter(Boolean).join(' ')||item.name;}
  function stockNotice(title,message){return `<div class="card card-padded"><h3>${safe(title)}</h3><p class="sub" role="status">${safe(message)}</p></div>`;}
  function stockButton(label,action,id='',primary=false){return `<button type="button" class="btn${primary?' primary':''}" data-stock-action="${action}" data-id="${safe(id)}">${label}</button>`;}
  function stockCard(title,description,content){return `<div class="card card-padded"><div class="card-head"><span class="iconwrap"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><use href="#i-box"/></svg></span><div><h3>${title}</h3><p class="sub">${description}</p></div></div><div class="divider"></div>${content}</div>`;}
  function stockField(label,name,type='text',value='',extra=''){
    return `<div class="preview-form-field"><label for="stock-${name}">${label}</label><input class="input" id="stock-${name}" name="${name}" type="${type}" value="${safe(value)}" ${extra}></div>`;
  }
  function stockSelect(label,name,options,extra=''){
    return `<div class="preview-form-field"><label for="stock-${name}">${label}</label><select class="input" id="stock-${name}" name="${name}" ${extra}>${options.map(([value,text])=>`<option value="${safe(value)}">${safe(text)}</option>`).join('')}</select></div>`;
  }
  function stockTable(headings,rows,empty){
    return rows?`<div class="table-scroll"><table class="small-table"><thead><tr>${headings.map(label=>`<th scope="col">${label}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`:stockNotice(empty,'Only recorded stock and actions are shown.');
  }
  function stockMetrics(balances){
    return `<div class="cards4 stock-metrics">${[['Physically Held','physicallyHeld'],['Ready To Issue','readyToIssue'],['Awaiting Checks','awaitingChecks']].map(([label,key])=>`<div class="card card-padded stat"><div class="stathead">${label}</div><div class="statnum">${balances[key].toLocaleString('en-GB')}</div><div class="statfoot">${key==='physicallyHeld'?'Includes stock awaiting checks.':key==='readyToIssue'?'Explicitly checked and confirmed.':'Held but not available to issue.'}</div></div>`).join('')}</div>`;
  }
  function stockSpecText(item){
    const spec=item.sharedSpecifications||{};
    return [spec.processor,spec.memory?`${spec.memory} ${spec.memoryUnit} RAM`:'',
      spec.storage?`${spec.storage} ${spec.storageUnit}`:'',spec.storageMedium].filter(Boolean).join(' · ');
  }
  function renderStockReceipt(){
    if(!canEdit())return stockNotice('Read Only','IT Assets Edit is required to receive stock.');
    const choices=items.map(item=>[item.id,stockLabel(item)+' · '+item.category+' · '+(item.trackingMode==='individual'?'Individual':'Quantity-Based')]);
    const fields=`<div class="preview-details-actions" role="group" aria-label="Stock Item">
      <button class="btn${receiptMode==='new'?' primary':''}" type="button" data-stock-action="mode-new" aria-pressed="${receiptMode==='new'}">New Stock Entry</button>
      <button class="btn${receiptMode==='existing'?' primary':''}" type="button" data-stock-action="mode-existing" aria-pressed="${receiptMode==='existing'}">Receive More Of An Existing Item</button></div>
      <fieldset id="stock-existing-fields" ${receiptMode==='new'?'hidden disabled':''}>
      ${stockSelect('Existing Stock Item','existing',choices.length?choices:[['','No Stock Items Recorded']], 'required')}<p class="formhint" id="stock-existing-summary"></p></fieldset>
      <fieldset id="stock-new-fields" ${receiptMode==='existing'?'hidden disabled':''}><div class="staff-fields">
      ${stockSelect('Equipment Type','category',[['Desktop','Desktop'],['Laptop','Laptop'],['Server - Physical','Physical Server'],['Monitor','Monitor'],['Keyboard','Keyboard'],['Mouse','Mouse'],['Docking Station','Docking Station'],['Other','Other / Not Listed']])}
      ${stockSelect('Tracking Method','trackingMode',[['quantity','Quantity-Based Stock'],['individual','Individually Tracked']])}
      ${stockField('Manufacturer (Optional)','manufacturer','text','','maxlength="120"')}
      ${stockField('Model / Description','model','text','','required maxlength="120"')}</div>
      <fieldset id="stock-computer-fields"><h3>Shared Computer Specifications</h3><p class="formhint">Only common fields for this equipment. Individual Device identities are entered separately in a later workflow.</p><div class="staff-fields">
      ${stockField('Processor (Optional)','processor','text','','maxlength="200"')}
      ${stockField('Memory Size (Optional)','memory','number','','min="0" step="any"')}
      ${stockSelect('Memory Unit','memoryUnit',[['GB','GB'],['MB','MB'],['TB','TB']])}
      ${stockField('Storage Capacity (Optional)','storage','number','','min="0" step="any"')}
      ${stockSelect('Storage Unit','storageUnit',[['GB','GB'],['TB','TB'],['PB','PB']])}
      ${stockSelect('Storage Type (Optional)','storageMedium',[['','Not Specified'],['NVMe SSD','NVMe SSD'],['SATA SSD','SATA SSD'],['HDD','HDD'],['Other','Other']])}</div></fieldset></fieldset>
      <fieldset id="stock-individual-fields" hidden disabled><h3>Individual Equipment</h3><p class="formhint">Receive one individually tracked unit at a time. Each unit keeps its own identity, even without a serial number.</p><div class="staff-fields">
      ${stockField('Serial Number (Optional)','serialNumber','text','','maxlength="200"')}
      ${stockField('Asset Tag (Optional)','assetTag','text','','maxlength="200"')}</div></fieldset>`;
    const receipt=`<div class="staff-fields">${stockField('Quantity Received','quantity','number','1','required min="1" max="9007199254740991" step="1"')}
      ${stockField('Date Received','receivedOn','date',new Date().toLocaleDateString('en-CA'),'required')}
      ${stockField('Supplier (Optional)','supplier','text','','maxlength="200"')}
      <div class="preview-form-field"><label for="stock-notes">Receipt Notes (Optional)</label><textarea class="input" name="notes" id="stock-notes" maxlength="2000"></textarea></div></div>
      <div class="divider"></div><h3>Receipt &amp; Condition Checks</h3><p class="formhint">All received units are physically held. Only explicitly checked units become Ready To Issue. Brand-new equipment does not need a data wipe.</p>
      <label class="stock-check"><input type="checkbox" name="itemsChecked">Received Quantity And Items Checked</label>
      <label class="stock-check"><input type="checkbox" name="conditionChecked">Condition Checked And Working</label>
      ${stockField('Checked &amp; Ready To Issue','readyQuantity','number','0','required min="0" max="1" step="1" disabled')}`;
    return `<form id="stock-receipt-form" class="preview-aligned-form"><div class="staff-main-grid"><div class="stock-card-stack">${stockCard('Record Equipment Received','Create a stock item or retain the identity of an existing compatible item.',fields)}${stockCard('Receipt Details','Keep this delivery’s date and optional purchasing Supplier separately from Manufacturer.',receipt)}
      <p class="formhint" data-stock-feedback role="alert"></p><div class="preview-details-actions"><button class="btn" type="reset">Reset</button><button class="btn primary" type="submit">Record Receipt</button></div></div>
      <aside class="staff-side-stack">${stockCard('Receipt Summary','Calculated from this form before anything is saved.',`<div class="info-row"><label>New Physical Stock</label><b data-stock-summary="held">1</b></div><div class="info-row"><label>Ready To Issue</label><b data-stock-summary="ready">0</b></div><div class="info-row"><label>Awaiting Checks</label><b data-stock-summary="awaiting">1</b></div><p class="formhint">Receiving stock does not create managed Devices. Each delivery keeps its original date, Supplier, checks and actor.</p>`)}</aside></div></form>`;
  }
  function renderStockDetails(){
    if(!detail)return '';
    const item=detail.item,individual=item.trackingMode==='individual';
    const information=[['Equipment Type',item.category],['Tracking Method',individual?'Individually Tracked':'Quantity-Based Stock'],
      ['Manufacturer',item.manufacturer||'Not Recorded'],['Model / Description',item.model],
      ['Shared Specifications',stockSpecText(item)||'Not Recorded']];
    const units=item.units.map(unit=>`<tr><td>${safe(unit.serialNumber||'Not Recorded')}</td><td>${safe(unit.assetTag||'Not Recorded')}</td><td>${unit.ready?'Ready To Issue':unit.held?'Awaiting Checks':'Not Physically Held'}</td><td>${canEdit()&&unit.held&&!unit.deviceLinked?`<label class="stock-check"><input type="checkbox" name="readyUnitIds" value="${unit.id}" ${unit.ready?'checked':''} aria-label="Ready: ${safe(unit.serialNumber||unit.assetTag||unit.id.slice(0,8))}">Ready</label>`:unit.ready?'Ready':'—'}</td></tr>`).join('');
    const edit=`<form id="stock-readiness-form" class="preview-aligned-form" data-id="${item.id}" data-version="${item.version}">${individual?stockTable(['Serial Number','Asset Tag','State','Confirmed Ready'],units,'No Individual Units Recorded'):''}
      <div class="staff-fields">${stockField('New Ready To Issue Total','readyQuantity','number',item.balances.readyToIssue,`required min="0" max="${item.balances.physicallyHeld}" step="1" ${individual?'readonly':''}`)}
      ${individual?'':stockField('Minimum Stock Level (Optional)','minimumStockLevel','number',item.minimumStockLevel??'','min="0" max="9007199254740991" step="1"')}</div>
      ${individual?'':'<p class="formhint">Leave blank if no minimum is configured. Zero is a configured minimum. Low Stock warnings are not available in this build.</p>'}
      <div id="stock-readiness-checks" hidden><p class="formhint">Confirm the checks for the additional units becoming ready.</p>
      <label class="stock-check"><input type="checkbox" name="itemsChecked">Quantity And Correct Items Verified</label>
      <label class="stock-check"><input type="checkbox" name="conditionChecked">Condition Checked And Working</label></div>
      <div class="preview-form-field"><label for="stock-reason">Reason / Note <span id="stock-reason-required">(Optional)</span></label><textarea class="input" id="stock-reason" name="reason" maxlength="2000"></textarea></div>
      <p class="formhint" id="stock-readiness-summary"></p><p class="formhint" data-stock-feedback role="alert"></p>
      <div class="preview-details-actions">${stockButton('Cancel','cancel-readiness')}<button class="btn primary" type="submit">Save Readiness Change</button></div></form>`;
    return `<section id="stock-item-details" class="stock-card-stack"><div class="section-heading"><div><h2 tabindex="-1">${safe(stockLabel(item))}</h2><p>Stock Item Details</p></div>${stockButton('Close Details','close-details')}</div>${stockMetrics(item.balances)}
      ${stockCard('Current Stock Details','Manufacturer and Model remain separate from purchasing Supplier provenance.',information.map(([label,value])=>`<div class="info-row"><label>${label}</label><b>${safe(value)}</b></div>`).join(''))}
      ${stockCard(canEdit()?'Update Ready To Issue Quantity':'Read Only','Readiness changes preserve Physically Held and the original receipts.',canEdit()?edit:individual?stockTable(['Serial Number','Asset Tag','State','Ready'],units,'No Individual Units Recorded'):`<p class="sub">Minimum Stock Level: ${item.minimumStockLevel??'Not Configured'}</p>`)}</section>`;
  }
  function renderStockInventory(){
    const rows=items.map(item=>`<tr><td>${stockButton(safe(stockLabel(item)),'details',item.id)}<div class="sub">${safe(item.category)}${stockSpecText(item)?' · '+safe(stockSpecText(item)):''}</div></td><td>${item.trackingMode==='individual'?'Individual':'Quantity-Based'}</td><td>${item.balances.physicallyHeld}</td><td>${item.balances.readyToIssue}</td><td>${item.balances.awaitingChecks}</td><td>${stockButton(canEdit()?'View / Update':'View Details','details',item.id)}</td></tr>`).join('');
    return `<div class="stock-card-stack"><div class="card">${stockTable(['Stock Item','Tracking','Physically Held','Ready','Awaiting','Actions'],rows,'No Stock Received')}</div>${renderStockDetails()}</div>`;
  }
  function stockDate(value){return /^\d{4}-\d{2}-\d{2}$/.test(value)?value.slice(8,10)+'/'+value.slice(5,7)+'/'+value.slice(0,4):safe(value);}
  function stockCheckLabel(value){return value===true?'Confirmed':value===false?'Not Confirmed':'Not Recorded';}
  function renderStockHistory(){
    const receiptRows=receipts.map(row=>`<tr><td>${stockDate(row.date)}<div class="sub">${safe(row.actor)}</div></td><td>${safe(stockLabel({...row.specification,name:row.name}))}<div class="sub">${safe(stockSpecText(row.specification||{}))}</div></td><td>${safe(row.supplier||'Not Recorded')}</td><td>${row.quantity}</td><td>${row.ready??'Not Recorded'}</td><td>${row.awaiting??'Not Recorded'}</td><td><details><summary>Receipt Checks</summary><p>Items: ${stockCheckLabel(row.checks?.itemsChecked)}<br>Condition: ${stockCheckLabel(row.checks?.conditionChecked)}</p><p>${safe(row.notes||'No receipt notes recorded.')}</p>${(row.units||[]).map(unit=>`<p>Serial Number: ${safe(unit.serialNumber||"Not Recorded")}<br>Asset Tag: ${safe(unit.assetTag||"Not Recorded")}</p>`).join('')}<p class="sub">Recorded: ${safe(row.recordedAt)}</p></details></td></tr>`).join('');
    const changed=changes.map(row=>`<tr><td>${stockDate(row.date)}<div class="sub">${safe(row.actor)}</div></td><td>${safe(stockLabel({...row.specification,name:row.name}))}<div class="sub">${safe(stockSpecText(row.specification||{}))}</div></td><td>${row.readyBefore??'Not Recorded'} → ${row.readyAfter??'Not Recorded'}</td><td>${safe(row.reason||'No note recorded.')}<div class="sub">Items: ${stockCheckLabel(row.checks?.itemsChecked)} · Condition: ${stockCheckLabel(row.checks?.conditionChecked)}</div></td></tr>`).join('');
    return `<div class="stock-card-stack"><h2>Stock Receipts</h2><div class="card">${stockTable(['Date / Actor','Stock Item','Supplier','Received','Ready','Awaiting','Checks / Notes'],receiptRows,'No Recorded Receipts')}</div><h2>Readiness Changes</h2><p class="sub">Later checks are separate movements. Original receipts are retained.</p><div class="card">${stockTable(['Date / Actor','Stock Item','Ready Before → After','Reason / Checks'],changed,'No Recorded Readiness Changes')}</div></div>`;
  }
  function clearStock(){
    generation++;detailRequest++;items=[];receipts=[];changes=[];detail=null;loaded=false;loading=false;
  }
  async function stockRequest(path,payload){
    const response=await fetch('/api/it-assets/'+path,{cache:'no-store',...(payload?{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':config.csrf},body:JSON.stringify(payload)}:{})});
    const result=await response.json();
    if(!response.ok){
      if([401,403].includes(response.status)){clearStock();await config.refreshAccess();config.redraw();}
      throw Error(result.error||'Unable to complete the stock operation.');
    }
    return result;
  }
  async function refreshStock(){
    if(!canRead()){clearStock();return;}
    const request=++generation;loading=true;
    try{
      const result=await stockRequest('stock');
      if(request!==generation||!canRead())return;
      items=result.items;receipts=result.receipts;changes=result.readinessChanges;loaded=true;error='';
      if(detail)detail=await stockRequest('stock/'+detail.item.id);
    }catch(failure){if(request===generation)error=failure.message;}
    finally{if(request===generation){loading=false;config.redraw();}}
  }
  function enterStock(){
    if(!canRead()){clearStock();return;}
    if(!canEdit()&&tab==='receive')tab='inventory';
    if(!loaded&&!loading)void refreshStock();
  }
  function renderStock(){
    if(!canRead())return stockNotice('IT Assets Not Available','The feature and IT Assets Read access are required.');
    const title={receive:'Receive Stock',inventory:'Stock Inventory',history:'Receipt History'}[tab];
    const total=items.reduce((sum,item)=>{for(const key of Object.keys(sum))sum[key]+=BigInt(item.balances[key]);return sum;},{physicallyHeld:0n,readyToIssue:0n,awaitingChecks:0n});
    const tabs=[...(canEdit()?[['receive','Receive Stock']]:[]),['inventory','Stock Inventory'],['history','Receipt History']];
    return `<div class="users-live stock-live"><div class="section-page-header"><div class="eyebrow">IT Assets</div><div class="header"><div><h1>${title}</h1><p>Receive equipment, retain each delivery and confirm stock readiness.</p></div></div></div>
      <nav class="tabs" role="tablist" aria-label="IT Assets">${tabs.map(([key,label])=>`<button class="tab${tab===key?' active':''}" type="button" id="stock-tab-${key}" role="tab" aria-selected="${tab===key}" aria-controls="stock-panel" tabindex="${tab===key?'0':'-1'}" data-stock-action="tab" data-tab="${key}">${label}</button>`).join('')}</nav>
      <section class="stock-panel" id="stock-panel" role="tabpanel" aria-labelledby="stock-tab-${tab}">${error?stockNotice('Stock Could Not Be Loaded',error)+stockButton('Reload Stock','reload'):''}${!loaded?stockNotice('Loading Stock','Retrieving permitted stock records…'):stockMetrics(total)+(tab==='receive'?renderStockReceipt():tab==='inventory'?renderStockInventory():renderStockHistory())}</section></div>`;
  }
  function receiptTracking(form){
    return receiptMode==='new'?form.elements.trackingMode.value:items.find(item=>item.id===form.elements.existing.value)?.trackingMode||'quantity';
  }
  function hydrateStock(){
    const form=document.getElementById('stock-receipt-form');
    if(form){
      const individual=receiptTracking(form)==='individual';
      const computer=['Desktop','Laptop','Server - Physical'].includes(form.elements.category.value);
      const technical=form.querySelector('#stock-computer-fields');
      technical.hidden=!computer;technical.disabled=!computer||receiptMode!=='new';
      const identifiers=form.querySelector('#stock-individual-fields');
      identifiers.hidden=!individual;identifiers.disabled=!individual;
      form.elements.quantity.readOnly=individual;if(individual)form.elements.quantity.value='1';
      const checked=form.elements.itemsChecked.checked&&form.elements.conditionChecked.checked;
      form.elements.readyQuantity.disabled=!checked;
      if(!checked)form.elements.readyQuantity.value='0';
      const quantity=Number(form.elements.quantity.value),ready=Number(form.elements.readyQuantity.value);
      form.elements.readyQuantity.max=String(quantity);
      const valid=Number.isSafeInteger(quantity)&&quantity>0&&Number.isSafeInteger(ready)&&ready>=0&&ready<=quantity;
      for(const [key,value] of Object.entries({held:quantity,ready,awaiting:quantity-ready})){
        form.querySelector('[data-stock-summary="'+key+'"]').textContent=valid?String(value):'Check Quantity';
      }
      const item=items.find(item=>item.id===form.elements.existing.value);
      form.querySelector('#stock-existing-summary').textContent=item?stockLabel(item)+' · '+stockSpecText(item)+'. Specifications are retained. Choose a new entry for a different configuration.':'No compatible stock item has been selected.';
    }
    const readiness=document.getElementById('stock-readiness-form');
    if(readiness&&detail){
      const item=detail.item,individual=item.trackingMode==='individual';
      const selected=[...readiness.querySelectorAll('[name="readyUnitIds"]:checked')].map(input=>input.value);
      if(individual)readiness.elements.readyQuantity.value=String(selected.length);
      const ready=Number(readiness.elements.readyQuantity.value),before=item.balances.readyToIssue;
      if(!Number.isSafeInteger(ready)||ready<0||ready>item.balances.physicallyHeld){
        readiness.querySelector('#stock-readiness-summary').textContent='Enter a whole-number ready total between zero and Physically Held.';
        return;
      }
      const increasing=individual?item.units.some(unit=>!unit.ready&&selected.includes(unit.id)):ready>before;
      const decreasing=individual?item.units.some(unit=>unit.ready&&!selected.includes(unit.id)):ready<before;
      readiness.querySelector('#stock-readiness-checks').hidden=!increasing;
      readiness.elements.reason.required=decreasing;
      readiness.querySelector('#stock-reason-required').textContent=decreasing?'(Required For Rechecking)':'(Optional)';
      readiness.querySelector('#stock-readiness-summary').textContent=`After saving: ${item.balances.physicallyHeld} physically held · ${ready} ready · ${item.balances.physicallyHeld-ready} awaiting checks.`;
    }
  }
  async function openStockDetails(id){
    const request=++detailRequest;
    error='';detail=null;tab='inventory';config.redraw();
    const result=await stockRequest('stock/'+encodeURIComponent(id));
    if(request!==detailRequest||!canRead())return;
    detail=result;config.redraw();
    document.querySelector('#stock-item-details h2')?.focus();
  }
  async function submitStock(form){
    if(pending||!canEdit())return;
    const data=new FormData(form),readiness=form.id==='stock-readiness-form';
    const operationId=form.dataset.operationId||(form.dataset.operationId=crypto.randomUUID());
    const checks={itemsChecked:data.get('itemsChecked')==='on',conditionChecked:data.get('conditionChecked')==='on'};
    let payload;
    if(readiness){
      payload={operationId,stockItemId:form.dataset.id,version:form.dataset.version,readyQuantity:Number(data.get('readyQuantity')),
        minimumStockLevel:data.get('minimumStockLevel')===null||data.get('minimumStockLevel')===''?null:Number(data.get('minimumStockLevel')),
        checks,reason:String(data.get('reason')||'')};
      if(detail.item.trackingMode==='individual')payload.readyUnitIds=data.getAll('readyUnitIds');
    }else{
      payload={operationId,quantity:Number(data.get('quantity')),receivedOn:String(data.get('receivedOn')),
        supplier:String(data.get('supplier')||''),notes:String(data.get('notes')||''),checks,readyQuantity:Number(data.get('readyQuantity')||0)};
      if(receiptMode==='existing'){
        const item=items.find(item=>item.id===data.get('existing'));
        if(!item)throw Error('Choose an existing stock item.');
        payload.stockItemId=item.id;payload.configurationKey=item.configurationKey;
      }else{
        const category=String(data.get('category')),sharedSpecifications={};
        if(['Desktop','Laptop','Server - Physical'].includes(category)){
          for(const key of ['processor','storageMedium'])if(data.get(key))sharedSpecifications[key]=String(data.get(key));
          for(const key of ['memory','storage'])if(data.get(key)!==''){
            sharedSpecifications[key]=Number(data.get(key));sharedSpecifications[key+'Unit']=String(data.get(key+'Unit'));
          }
        }
        payload.item={category,trackingMode:String(data.get('trackingMode')),manufacturer:String(data.get('manufacturer')||''),
          model:String(data.get('model')||''),sharedSpecifications};
      }
      if(receiptTracking(form)==='individual'){payload.serialNumber=String(data.get('serialNumber')||'');payload.assetTag=String(data.get('assetTag')||'');}
    }
    pending=true;const button=form.querySelector('[type="submit"]');button.disabled=true;
    try{
      const response=await stockRequest(readiness?'readiness':'receive',payload);
      await refreshStock();
      if(!readiness){detail=null;tab='history';config.redraw();}
      config.notify(readiness?'Stock readiness saved.':'Stock receipt recorded.');
    }finally{pending=false;if(button.isConnected)button.disabled=false;}
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-stock-action]');if(!button||!config)return;
    const action=button.dataset.stockAction;event.preventDefault();
    if(action==='tab'){tab=button.dataset.tab;error='';config.redraw();document.getElementById('stock-tab-'+tab)?.focus();return;}
    if(action==='reload'){void refreshStock();return;}
    if(action==='details'||action==='cancel-readiness'){void openStockDetails(button.dataset.id||detail?.item.id).catch(failure=>{error=failure.message;config.redraw();});return;}
    if(action==='close-details'){detail=null;config.redraw();return;}
    if(action==='mode-new'||action==='mode-existing'){
      receiptMode=action==='mode-new'?'new':'existing';
      const form=button.closest('form');
      for(const [id,hidden] of [['stock-new-fields',receiptMode!=='new'],['stock-existing-fields',receiptMode!=='existing']]){
        form.querySelector('#'+id).hidden=hidden;form.querySelector('#'+id).disabled=hidden;
      }
      for(const control of form.querySelectorAll('[data-stock-action^="mode-"]')){
        const selected=control.dataset.stockAction==='mode-'+receiptMode;
        control.classList.toggle('primary',selected);control.setAttribute('aria-pressed',String(selected));
      }
      form.elements.itemsChecked.checked=false;form.elements.conditionChecked.checked=false;hydrateStock();
    }
  });
  document.addEventListener('submit',event=>{
    const form=event.target;if(!form.matches('#stock-receipt-form,#stock-readiness-form'))return;
    event.preventDefault();
    void submitStock(form).catch(failure=>{const feedback=form.querySelector('[data-stock-feedback]');if(feedback?.isConnected)feedback.textContent=failure.message;config.notify(failure.message,'error');});
  });
  document.addEventListener('input',event=>{if(event.target.closest('#stock-receipt-form,#stock-readiness-form'))hydrateStock();});
  document.addEventListener('change',event=>{if(event.target.closest('#stock-receipt-form,#stock-readiness-form'))hydrateStock();});
  document.addEventListener('reset',event=>{if(event.target.id==='stock-receipt-form'){event.target.dataset.operationId='';setTimeout(hydrateStock,0);}});
  document.addEventListener('keydown',event=>{
    const button=event.target.closest('[data-stock-action="tab"]');
    if(!button||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();event.stopImmediatePropagation();
    const buttons=[...button.parentElement.querySelectorAll('[data-stock-action="tab"]')];
    let index=buttons.indexOf(button);index=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
    tab=buttons[index].dataset.tab;config.redraw();document.getElementById('stock-tab-'+tab)?.focus();
  });
  function configureStock(options){config=options;}
  window.caffootStockIntake={configure:configureStock,enter:enterStock,render:renderStock,hydrate:hydrateStock,refresh:refreshStock,clear:clearStock};
})();
