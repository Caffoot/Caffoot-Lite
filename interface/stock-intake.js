/* Stock screens use the existing application cards, tables, forms and access rules. */
'use strict';
(function(){
  let config=null,items=[],receipts=[],changes=[],tab='overview',detail=null,loaded=false,loading=false;
  let error='',receiptMode='new',pending=false,generation=0,detailRequest=0;
  let issues=[],deviceAssignments=[],registeredDevices=[],deviceChoices=[],movements=[],stockContext={},selectedRegisteredId=null,reissueDevices=[];
  let correction=null,correctionRequest=0,correctionTimer,returnCorrection=null;
  let receiptFocus = null;
  let issueDraft=null,report=null,reportDays=30,reportCategory='',inventoryFilter=null,movementFilter=null;
  const safe=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // Display label only; stock category IDs and all stock transactions remain unchanged.
  const displayStockType=name=>window.caffootPublicDeviceTypeName?.(name) ?? (name==='Server - Physical'?'Server':name==='Server - Virtual'?'Virtual Machine':name);
  function canRead(){return !!config?.canRead();}
  function canEdit(){return !!config?.canEdit();}
  // Preserve the browser-local calendar day; avoid locale-dependent native input defaults.
  function stockTodayIso(){
    const today=new Date();
    return String(today.getFullYear()).padStart(4,'0')+'-'+
      String(today.getMonth()+1).padStart(2,'0')+'-'+
      String(today.getDate()).padStart(2,'0');
  }
  function stockLabel(item){return [item.manufacturer,item.model].filter(Boolean).join(' ')||item.name;}
  function stockNotice(title,message){return `<div class="card card-padded"><h3>${safe(title)}</h3><p class="sub" role="status">${safe(message)}</p></div>`;}
  function stockButton(label,action,id='',primary=false){return `<button type="button" class="btn${primary?' primary':''}" data-stock-action="${action}" data-id="${safe(id)}">${label}</button>`;}
  function stockCard(title,description,content){return `<div class="card card-padded"><div class="card-head"><span class="iconwrap"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><use href="#i-box"/></svg></span><div><h3>${title}</h3><p class="sub">${description}</p></div></div><div class="divider"></div>${content}</div>`;}
  function stockField(label,name,type='text',value='',extra=''){
    return `<div class="preview-form-field"><label for="stock-${name}">${label}</label><input class="input" id="stock-${name}" name="${name}" type="${type}" value="${safe(value)}" ${extra}></div>`;
  }
  function stockSelect(label,name,options,extra='',selected=null){
    return `<div class="preview-form-field"><label for="stock-${name}">${label}</label><select class="input" id="stock-${name}" name="${name}" ${extra}>${options.map(([value,text])=>`<option value="${safe(value)}" ${String(value)===String(selected)?'selected':''}>${safe(text)}</option>`).join('')}</select></div>`;
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
    const choices=items.map(item=>[item.id,stockLabel(item)+' · '+displayStockType(item.category)+' · '+(item.trackingMode==='individual'?'Individual':'Quantity-Based')]);
    const fields=`<div class="preview-details-actions" role="group" aria-label="Stock Item">
      <button class="btn${receiptMode==='new'?' primary':''}" type="button" data-stock-action="mode-new" aria-pressed="${receiptMode==='new'}">New Stock Entry</button>
      <button class="btn${receiptMode==='existing'?' primary':''}" type="button" data-stock-action="mode-existing" aria-pressed="${receiptMode==='existing'}">Receive More Of An Existing Item</button></div>
      <fieldset id="stock-existing-fields" ${receiptMode==='new'?'hidden disabled':''}>
      ${stockSelect('Existing Stock Item','existing',choices.length?choices:[['','No Stock Items Recorded']], 'required')}<p class="formhint" id="stock-existing-summary"></p></fieldset>
      <fieldset id="stock-new-fields" ${receiptMode==='existing'?'hidden disabled':''}><div class="staff-fields">
      ${stockSelect('Equipment Type','category',[['Desktop','Desktop'],['Laptop','Laptop'],['Server - Physical','Server'],['Monitor','Monitor'],['Keyboard','Keyboard'],['Mouse','Mouse'],['Docking Station','Docking Station'],['Other','Other / Not Listed']])}
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
      ${stockField('Date Received','receivedOn','date',stockTodayIso(),'required')}
      ${stockField('Supplier (Optional)','supplier','text','','maxlength="200"')}
      <div class="preview-form-field"><label for="stock-notes">Receipt Notes (Optional)</label><textarea class="input" name="notes" id="stock-notes" maxlength="2000"></textarea></div></div>
      <div class="divider"></div><h3>Receipt &amp; Condition Checks</h3><p class="formhint">All received units are physically held. Only explicitly checked units become Ready To Issue. Brand-new equipment does not need a data wipe.</p>
      <label class="stock-check"><input type="checkbox" name="itemsChecked">Received Quantity And Items Checked</label>
      <label class="stock-check"><input type="checkbox" name="conditionChecked">Condition Checked And Working</label>
      ${stockField('Checked &amp; Ready To Issue','readyQuantity','number','0','required min="0" max="1" step="1" disabled')}`;
    return `<form id="stock-receipt-form" class="preview-aligned-form" data-stock-cancellable="true" data-receipt-mode="${receiptMode}"><div class="staff-main-grid"><div class="stock-card-stack">${stockCard('Record Equipment Received','Create a stock item or retain the identity of an existing compatible item.',fields)}${stockCard('Receipt Details','Keep this delivery’s date and optional purchasing Supplier separately from Manufacturer.',receipt)}
      <p class="formhint" data-stock-feedback role="alert"></p></div>
      <aside class="staff-side-stack">${stockCard('Receipt Summary','Calculated from this form before anything is saved.',`<div class="info-row"><label>New Physical Stock</label><b data-stock-summary="held">1</b></div><div class="info-row"><label>Ready To Issue</label><b data-stock-summary="ready">0</b></div><div class="info-row"><label>Awaiting Checks</label><b data-stock-summary="awaiting">1</b></div><p class="formhint">Receiving stock does not create managed Devices. Each delivery keeps its original date, Supplier, checks and actor.</p>`)}</aside></div><div class="stock-form-actions">${stockButton('Cancel','cancel-stock')}<button class="btn btn-primary" type="submit">Record Receipt</button></div></form>`;
  }
  function renderStockDetails(){
    if(!detail)return '';
    const item=detail.item,individual=item.trackingMode==='individual';
    const information=[['Equipment Type',displayStockType(item.category)],['Tracking Method',individual?'Individually Tracked':'Quantity-Based Stock'],
      ['Manufacturer',item.manufacturer||'Not Recorded'],['Model / Description',item.model],
      ['Shared Specifications',stockSpecText(item)||'Not Recorded']];
    const units=item.units.map(unit=>`<tr><td>${safe(unit.serialNumber||'Not Recorded')}</td><td>${safe(unit.assetTag||'Not Recorded')}</td><td>${stockStateLabel(stockUnitState(unit))}</td><td>${canEdit()&&unit.held&&!unit.deviceLinked&&!unit.balances.awaiting_preparation?`<label class="stock-check"><input type="checkbox" name="readyUnitIds" value="${unit.id}" ${unit.ready?'checked':''} aria-label="Ready: ${safe(unit.serialNumber||unit.assetTag||unit.id.slice(0,8))}">Ready</label>`:unit.ready?'Ready':'—'}</td></tr>`).join('');
    const registeredReady=individual?0:item.balances.readyToIssue-(item.quantityStateBalances.ready||0);
    const edit=`<form id="stock-readiness-form" class="preview-aligned-form" data-stock-cancellable="true" data-id="${item.id}" data-version="${item.version}">${individual?stockTable(['Serial Number','Asset Tag','State','Confirmed Ready'],units,'No Individual Units Recorded'):''}
      <div class="staff-fields">${stockField('New Ready To Issue Total','readyQuantity','number',item.balances.readyToIssue,`required min="${registeredReady}" max="${individual?item.units.filter(unit=>!unit.deviceLinked&&(unit.ready||unit.balances.awaiting_checks===1)).length:item.balances.readyToIssue+(item.quantityStateBalances.awaiting_checks||0)}" step="1" ${individual?'readonly':''}`)}
      ${individual?'':stockField('Minimum Stock Level (Optional)','minimumStockLevel','number',item.minimumStockLevel??'','min="0" max="9007199254740991" step="1"')}</div>
      ${individual?'':'<p class="formhint">Leave blank if no minimum is configured. Zero is a configured minimum. Low Stock warnings appear when Ready To Issue for this item falls below its configured minimum.</p>'}
      <div id="stock-readiness-checks" hidden><p class="formhint">Confirm the checks for the additional units becoming ready.</p>
      <label class="stock-check"><input type="checkbox" name="itemsChecked">Quantity And Correct Items Verified</label>
      <label class="stock-check"><input type="checkbox" name="conditionChecked">Condition Checked And Working</label></div>
      <div class="preview-form-field"><label for="stock-reason">Reason / Note <span id="stock-reason-required">(Optional)</span></label><textarea class="input" id="stock-reason" name="reason" maxlength="2000"></textarea></div>
      <p class="formhint" id="stock-readiness-summary"></p><p class="formhint" data-stock-feedback role="alert"></p>
      <div class="stock-form-actions">${stockButton('Cancel','cancel-readiness')}<button class="btn btn-primary" type="submit">Save Readiness Change</button></div></form>`;
    return `<section id="stock-item-details" class="stock-card-stack"><div class="section-heading"><div><h2 tabindex="-1">${safe(stockLabel(item))}</h2><p>Stock Item Details</p></div>${stockButton('Close Details','close-details')}</div>${stockMetrics(item.balances)}
      ${canEdit()&&config.canEditDevices()&&item.trackingMode==='quantity'&&['Desktop','Laptop','Server - Physical'].includes(item.category)&&(item.quantityStateBalances.ready||0)>0?'<div class="preview-details-actions">'+stockButton('Brand New — Get From Stock','register-device',item.id)+'</div>':''}
      ${stockCard('Current Stock Details','Manufacturer and Model remain separate from purchasing Supplier provenance.',information.map(([label,value])=>`<div class="info-row"><label>${label}</label><b>${safe(value)}</b></div>`).join(''))}
      ${stockCard(canEdit()?'Update Ready To Issue Quantity':'Read Only','Receipt checks preserve Physically Held. Returned equipment uses the preparation checks below.',canEdit()?edit:individual?stockTable(['Serial Number','Asset Tag','State','Ready'],units,'No Individual Units Recorded'):`<p class="sub">Minimum Stock Level: ${item.minimumStockLevel??'Not Configured'}</p>`)}${renderStockPreparation(item)}${window.caffootServiceDesk?.equipmentPanel('stockItem', item.id)||''}</section>`;
  }
  function renderStockInventory(){
    const rows=items.filter(stockInventoryMatches).map(item=>`<tr><td>${stockButton(safe(stockLabel(item)),'details',item.id)}<div class="sub">${safe(displayStockType(item.category))}${item.trackingMode==='quantity'&&item.minimumStockLevel!==null&&item.balances.readyToIssue<item.minimumStockLevel?' · Low Stock':''}${stockSpecText(item)?' · '+safe(stockSpecText(item)):''}</div></td><td>${item.trackingMode==='individual'?'Individual':'Quantity-Based'}</td><td>${item.balances.physicallyHeld}</td><td>${item.balances.readyToIssue}</td><td>${item.stateBalances.awaitingChecks}</td><td>${item.stateBalances.awaitingPreparation}</td><td>${item.stateBalances.currentlyIssued}</td><td>${item.stateBalances.writtenOff}</td><td>${stockButton(canEdit()?'View / Update':'View Details','details',item.id)}${canEdit()?stockButton('Issue Equipment','issue-item',item.id)+stockButton('Write Off','writeoff-item',item.id):''}</td></tr>`).join('');
    return `<div class="stock-card-stack">${inventoryFilter?`<div class="section-heading"><p class="sub">Dashboard selection: ${safe(displayStockType(inventoryFilter.category||'All Categories'))} · ${safe(inventoryFilter.status)}. Item totals include their registered units; Device rows show those same units, not additional stock.</p>${stockButton('Clear Dashboard Filters','clear-report-filters')}</div>`:''}${inventoryFilter?.status==='issued'?renderStockAssignments():`<div class="card stock-inventory-table">${stockTable(['Stock Item','Tracking','Physically Held','Ready','Awaiting Checks','Awaiting Preparation','Currently Issued','Written Off','Actions'],rows,'No Stock Received')}</div>${renderStockDetails()}${renderRegisteredStock()}`}</div>`;
  }
  function stockReportNumber(value){return BigInt(value||0).toLocaleString('en-GB');}
  function stockReportMetric(label,key,description,status){
    const actionable=report.canDrillAggregates||key==='itemsBelowMinimum';
    const content=`<span class="stathead">${label}</span><span class="statnum">${stockReportNumber(report.totals[key])}</span><span class="statfoot">${description}</span>`;
    return actionable?`<button type="button" class="card card-padded stat stock-report-metric" data-stock-action="report-drill" data-status="${status}">${content}</button>`:`<div class="card card-padded stat stock-report-metric">${content}</div>`;
  }
  function stockReportTable(title,headings,rows){
    return `<details class="stock-chart-table"><summary>${title} — Data Table</summary>${stockTable(headings,rows,'No Data For This Selection')}</details>`;
  }
  function stockReportBar(value,total,colour){
    const width=BigInt(total||0)>0n?Number(BigInt(value||0)*10000n/BigInt(total))/100:0;
    return `<span class="stock-report-bar ${colour}" style="width:${width}%"></span>`;
  }
  function renderStockOverview(){
    if(!report)return stockNotice('Loading Overview','Retrieving complete stock figures…');
    const counts=report.totals,held=BigInt(counts.physicallyHeld),ready=BigInt(counts.readyToIssue);
    const categoryControl=stockSelect('Equipment Category','report-category', [['','All Categories'],...report.categories.map(name=>[name,name])], '',reportCategory);
    const periodControl=stockSelect('Reporting Period','report-days', [['30','Last 30 Days'],['90','Last 90 Days']], '',String(reportDays));
    const controls=`<div class="card card-padded stock-report-controls">${categoryControl}${periodControl}<div class="sub">${stockDate(report.start)} – ${stockDate(report.end)}<br>Reporting dates affect movements and Written Off. Other figures show current stock.</div></div>`;
    const metrics=`<div class="stock-report-metrics">${stockReportMetric('Physically Held','physicallyHeld','Ready stock plus stock awaiting checks or preparation.','held')}${stockReportMetric('Ready To Issue','readyToIssue','Checked, available equipment.','ready')}${stockReportMetric('Awaiting Checks / Preparation','awaitingChecks','Held but unavailable to issue.','awaiting')}${stockReportMetric('Currently Issued','currentlyIssued','Equipment currently with a recipient.','issued')}${stockReportMetric('Written Off','writtenOff',`During the last ${reportDays} days; excluded from held stock.`,'written_off')}${stockReportMetric('Stock Categories','categories','Categories represented in current stock records.','all')}${stockReportMetric('Items Below Minimum','itemsBelowMinimum','Quantity items with Ready To Issue strictly below their own minimum.','low')}</div>`;
    const max=report.distribution.reduce((top,row)=>{const size=BigInt(row.physicallyHeld)+BigInt(row.currentlyIssued);return size>top?size:top;},1n);
    const distribution=report.distribution.map(row=>{
      const content=`<span>${safe(displayStockType(row.category))}</span><span class="stock-report-track" aria-hidden="true">${stockReportBar(row.physicallyHeld,max,'stock-report-held')}${stockReportBar(row.currentlyIssued,max,'stock-report-issued')}</span><span>${stockReportNumber(row.physicallyHeld)} / ${stockReportNumber(row.currentlyIssued)}</span>`;
      return report.canDrillAggregates?`<button type="button" class="stock-distribution-row" data-stock-action="report-drill" data-category="${safe(row.category)}" data-status="all" aria-label="${safe(displayStockType(row.category))}: ${row.physicallyHeld} held, ${row.currentlyIssued} issued. View Stock">${content}</button>`:`<div class="stock-distribution-row">${content}</div>`;
    }).join('');
    const distributionTable=stockReportTable('Equipment Distribution',['Category','Physically Held','Currently Issued'],report.distribution.map(row=>`<tr><th scope="row">${safe(displayStockType(row.category))}</th><td>${stockReportNumber(row.physicallyHeld)}</td><td>${stockReportNumber(row.currentlyIssued)}</td></tr>`).join(''));
    const equipment=stockCard('Equipment Distribution','Physically held / currently issued by category.',(distribution||'<p class="sub">No stock categories recorded.</p>')+distributionTable);
    const pct=held?Number(ready*10000n/held)/100:0;
    const readiness=`<div class="stock-readiness"><div class="stock-readiness-donut" style="--ready-share:${pct}%" role="img" aria-label="${counts.readyToIssue} ready and ${counts.awaitingChecks} awaiting checks or preparation"><span>${stockReportNumber(counts.physicallyHeld)}<small>Physically Held</small></span></div><div><p><b>${stockReportNumber(counts.readyToIssue)}</b> Ready To Issue</p><p><b>${stockReportNumber(counts.awaitingChecks)}</b> Awaiting Checks / Preparation</p>${held?'':'<p class="sub">No equipment is physically held.</p>'}</div></div>`;
    const readinessTable=stockReportTable('Stock Readiness',['State','Units'],`<tr><th scope="row">Ready To Issue</th><td>${stockReportNumber(counts.readyToIssue)}</td></tr><tr><th scope="row">Awaiting Checks / Preparation</th><td>${stockReportNumber(counts.awaitingChecks)}</td></tr>`);
    let classification=stockCard('Held Stock Classification','Individual Device classification needs Devices Read.','<p class="sub">Complete stock totals above include registered Devices. Individual Device records and their separate breakdown are restricted.</p>');
    if(report.classification){
      classification=stockCard('Held Stock Classification','Each physical unit is counted once.',Object.entries({unregistered:'Unregistered Quantity Stock',registered:'Registered Canonical Devices',individual:'Individually Tracked IT Assets'}).map(([key,label])=>`<button type="button" class="stock-classification-row" data-stock-action="report-drill" data-status="${key}"><span>${label}</span><b>${stockReportNumber(report.classification[key])}</b></button>`).join(''));
    }
    const kinds={received:'Received',issued:'Issued',returned:'Returned',written_off:'Written Off'};
    const movementMax=report.movements.reduce((top,bucket)=>Object.values(bucket.counts).reduce((value,count)=>BigInt(count)>value?BigInt(count):value,top),1n);
    const movementChart=`<div class="stock-movement-chart" role="img" aria-label="Stock movements from ${report.start} to ${report.end}; exact values in the following data table">${report.movements.map(bucket=>`<div class="stock-movement-column"><div class="stock-movement-bars">${Object.entries(bucket.counts).map(([kind,count])=>`<span class="stock-movement-bar stock-report-${kind}" style="height:${Number(BigInt(count)*10000n/movementMax)/100}%" title="${safe(kinds[kind])}: ${count}"></span>`).join('')}</div><span>${bucket.start.slice(8,10)}/${bucket.start.slice(5,7)}</span></div>`).join('')}</div><p class="sub stock-report-legend">${Object.entries(kinds).map(([key,label])=>`<span><i class="stock-report-${key}" aria-hidden="true"></i>${label}</span>`).join('')}</p>`;
    const movementRows=report.movements.map(bucket=>`<tr><th scope="row">${stockDate(bucket.start)} – ${stockDate(bucket.end)}</th>${Object.values(bucket.counts).map(count=>`<td>${stockReportNumber(count)}</td>`).join('')}</tr>`).join('');
    const movementTable=stockReportTable('Stock Movements',['Dates',...Object.values(kinds)],movementRows);
    const movementsCard=stockCard('Stock Movements',`Last ${reportDays} days. Effective corrected quantities use the original business date.`,movementChart+movementTable+(report.canDrillAggregates?stockButton('View Movement History','report-drill').replace('data-id=""','data-status="movements"'):''));
    const warnings=report.items.filter(row=>row.lowStock).map(row=>`<div class="stock-attention-row"><div><b>${safe(row.name)} · Low Stock</b><p class="sub">${stockReportNumber(row.counts.readyToIssue)} ready · Minimum ${stockReportNumber(row.minimum)}</p></div>${stockButton(canEdit()?'View / Update':'View Details','details',row.id)}</div>`).join('');
    const awaiting=BigInt(counts.awaitingChecks)>0n?`<div class="stock-attention-row"><div><b>Awaiting Checks / Preparation</b><p class="sub">${stockReportNumber(counts.awaitingChecks)} held units are unavailable to issue.</p></div>${report.canDrillAggregates?'<button class="btn" type="button" data-stock-action="report-drill" data-status="awaiting">View Stock</button>':''}</div>`:'';
    const attention=stockCard('Attention Required','Minimum Stock Levels apply independently to quantity-based items.',awaiting+warnings||'<p class="sub">No items below minimum or awaiting checks in this selection.</p>');
    const activityRows=report.recentActivity.map(event=>`<tr><td>${stockDate(event.date)}</td><td>${safe(event.name)}</td><td>${safe(({readiness_changed:'Readiness Changed',registered:'Registered',corrected:'Corrected',reassigned:'Reassigned',...kinds})[event.kind]||event.kind)}</td><td>${event.kind==='corrected'?`${event.previousQuantity} → ${event.correctedQuantity}`:stockReportNumber(event.effectiveQuantity)}</td><td><button type="button" class="btn" data-stock-action="report-movement" data-id="${event.entryId}">View Movement</button></td></tr>`).join('');
    const activity=stockCard('Recent Activity','Latest authorised activity by business date within this reporting period.',stockTable(['Date','Equipment','Movement','Effective Quantity','Details'],activityRows,'No Authorised Activity In This Period'));
    return `<div id="stock-overview" class="stock-card-stack">${controls}${metrics}${!report.canDrillAggregates?'<p class="sub">Figures show complete organisation-wide stock. Device details require Devices Read; aggregate cards are informational. Stock-item warnings open authorised stock details.</p>':''}<div class="stock-report-grid"><div class="stock-card-stack">${equipment}</div>${stockCard('Stock Readiness','Ready and awaiting equipment make up Physically Held.',readiness+readinessTable)}${classification}${attention}</div>${movementsCard}${activity}</div>`;
  }
  function stockInventoryMatches(item){
    if(!inventoryFilter)return true;
    const category=inventoryFilter.category;
    if(category&&item.category!==category)return false;
    const status=inventoryFilter.status,counts=item.balances;
    if(status==='low')return item.trackingMode==='quantity'&&item.minimumStockLevel!==null&&counts.readyToIssue<item.minimumStockLevel;
    if(status==='registered')return false;
    if(status==='unregistered')return item.trackingMode==='quantity'&&Object.entries(item.quantityStateBalances).some(([key,value])=>['ready','awaiting_checks','awaiting_preparation'].includes(key)&&value>0);
    if(status==='individual')return item.trackingMode==='individual'&&item.units.some(unit=>unit.held&&!unit.deviceLinked);
    return !['held','ready','awaiting'].includes(status)||counts[{held:'physicallyHeld',ready:'readyToIssue',awaiting:'awaitingChecks'}[status]]>0;
  }
  function stockRegisteredMatches(device){
    if(!inventoryFilter)return true;
    if(inventoryFilter.category&&device.category!==inventoryFilter.category)return false;
    const status=inventoryFilter.status;
    if(['low','unregistered','individual'].includes(status))return false;
    if(status==='held'||status==='registered')return ['ready','awaiting_checks','awaiting_preparation'].some(key=>device.states[key]>0);
    if(status==='ready')return device.states.ready>0;
    if(status==='awaiting')return (device.states.awaiting_checks||0)+(device.states.awaiting_preparation||0)>0;
    return true;
  }
  function renderStockAssignments(){
    const category=inventoryFilter?.category;
    const rows=[...issues.filter(issue=>issue.outstanding>0&&(!category||issue.specification.category===category)),...deviceAssignments.filter(issue=>!category||issue.category===category)];
    return stockCard('Currently Issued','Outstanding assignments, each counted once.',stockTable(['Equipment','Recipient','Outstanding','Issued On'],rows.map(issue=>`<tr><td>${safe(issue.name)}</td><td>${safe(issue.recipientLabel)}</td><td>${issue.outstanding}</td><td>${stockDate(issue.issuedOn)}</td></tr>`).join(''),'No Outstanding Assignments'));
  }
  function stockMovementMatches(event){
    if(!movementFilter)return true;
    if(movementFilter.entryId)return event.entryId===movementFilter.entryId;
    if(event.date<movementFilter.start||event.date>movementFilter.end)return false;
    if(movementFilter.kind&&event.kind!==movementFilter.kind)return false;
    if(movementFilter.category){
      const item=items.find(item=>item.id===event.stockItemId),device=registeredDevices.find(device=>device.deviceId===event.deviceId);
      if((item?.category||device?.category)!==movementFilter.category)return false;
    }
    return true;
  }
  function drillStockReport(button){
    const status=button.dataset.status||'all',category=button.dataset.category??reportCategory;
    if(!report||(!report.canDrillAggregates&&status!=='low'))return;
    detail=null;selectedRegisteredId=null;stockContext={};
    if(status==='written_off'||status==='movements'){
      tab='movements';movementFilter={kind:status==='written_off'?'written_off':null,category,start:report.start,end:report.end};
    }else{tab='inventory';inventoryFilter={status,category};}
    config.redraw();document.getElementById('stock-tab-'+tab)?.focus();
  }

  // Keep the recorded UTC instant unchanged; only the visible date order changes.
  function stockDateText(value){
    return /^\d{4}-\d{2}-\d{2}$/.test(value||'')
      ? value.slice(8,10)+'/'+value.slice(5,7)+'/'+value.slice(0,4) : String(value||'Not Recorded');
  }
  function stockDate(value){return /^\d{4}-\d{2}-\d{2}$/.test(value||'')
    ? `<time datetime="${value}">${stockDateText(value)}</time>` : safe(value);}
  function stockRecordedDate(value){
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:[\d.]+(?:Z|[+-]\d{2}:\d{2})$/.test(value||'')) return String(value||'Not Recorded');
    const date=new Date(value);
    if(!Number.isFinite(date.getTime()))return String(value||'Not Recorded');
    return new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'2-digit',year:'numeric',
      hour:'2-digit',minute:'2-digit',hourCycle:'h23',timeZone:'UTC'}).format(date)+' UTC';
  }
  function stockCheckLabel(value){return value===true?'Confirmed':value===false?'Not Confirmed':'Not Recorded';}
  function receiptSupplierCell(row, editable) {
    const original = safe(row.supplier || 'Not Recorded');
    if (!config.suppliersEnabled()) return original;
    const linked = row.supplierAssociation;
    return `<div>${original}</div><div class="sub">${linked ? 'Linked Supplier: ' + safe(linked.name) : 'No Supplier Association'}</div>
      ${editable ? `<div class="receipt-supplier-actions">${stockButton(linked ? 'Change Supplier' : 'Link Supplier','link-receipt-supplier',row.id)}
        ${linked ? stockButton('Remove Supplier Association','remove-receipt-supplier',row.id) : ''}</div>` : ''}`;
  }
  function renderStockHistory(){
    const editable = canEdit() && config.suppliersEnabled();
    const receiptRows=receipts.map(row=>`<tr id="stock-receipt-${row.id}" tabindex="-1">
      ${editable ? `<td class="equipment-supplier-select"><input type="checkbox" data-select-receipt-supplier="${row.id}" aria-label="Select receipt ${row.id}"></td>` : ''}<td>${stockDate(row.date)}<div class="sub">${safe(row.actor)}</div></td><td class="stock-receipt-item">${safe(stockLabel({...row.specification,name:row.name}))}<div class="sub">${safe(stockSpecText(row.specification||{}))}</div></td><td>${receiptSupplierCell(row,editable)}</td><td>${row.quantity}</td><td>${row.ready??'Not Recorded'}</td><td>${row.awaiting??'Not Recorded'}</td><td><details><summary>Receipt Checks</summary><p>Items: ${stockCheckLabel(row.checks?.itemsChecked)}<br>Condition: ${stockCheckLabel(row.checks?.conditionChecked)}</p><p>${safe(row.notes||'No receipt notes recorded.')}</p>${(row.units||[]).map(unit=>`<p>Serial Number: ${safe(unit.serialNumber||"Not Recorded")}<br>Asset Tag: ${safe(unit.assetTag||"Not Recorded")}</p>`).join('')}<p class="sub">Recorded: ${safe(stockRecordedDate(row.recordedAt))}</p></details></td></tr>`).join('');
    const changed=changes.map(row=>`<tr><td>${stockDate(row.date)}<div class="sub">${safe(row.actor)}</div></td><td>${safe(stockLabel({...row.specification,name:row.name}))}<div class="sub">${safe(stockSpecText(row.specification||{}))}</div></td><td>${row.preparation?row.quantity+' Prepared':(row.readyBefore??'Not Recorded')+' → '+(row.readyAfter??'Not Recorded')}</td><td>${safe(row.reason||'No note recorded.')}<div class="sub">${row.preparation?safe(row.checks?.workingCheckLabel||'Cleaned / Working')+': '+stockCheckLabel(row.checks?.cleanedWorking)+(row.checks?.dataCheckLabel?' · '+safe(row.checks.dataCheckLabel)+': '+stockCheckLabel(row.checks.dataPreparationConfirmed):''):'Items: '+stockCheckLabel(row.checks?.itemsChecked)+' · Condition: '+stockCheckLabel(row.checks?.conditionChecked)}</div></td></tr>`).join('');
    return `<div class="stock-card-stack"><div class="section-heading"><h2 id="stock-receipts-heading" tabindex="-1">Stock Receipts</h2>
      ${editable ? '<button class="btn" type="button" data-stock-action="assign-receipt-supplier" disabled>Assign Supplier</button>' : ''}</div>
      <div class="card${config.suppliersEnabled() ? ' stock-supplier-receipts' : ''}">${stockTable([...(editable ? ['Select'] : []),'Date / Actor','Stock Item','Supplier','Received','Ready','Awaiting','Checks / Notes'],receiptRows,'No Recorded Receipts')}</div><h2>Readiness Changes</h2><p class="sub">Later checks are separate movements. Original receipts are retained.</p><div class="card">${stockTable(['Date / Actor','Stock Item','Ready Before → After','Reason / Checks'],changed,'No Recorded Readiness Changes')}</div></div>`;
  }
  function clearStock(){
    issueDraft=null;report=null;inventoryFilter=null;movementFilter=null;
    correction=null;returnCorrection=null;correctionRequest++;clearTimeout(correctionTimer);
    generation++;detailRequest++;items=[];receipts=[];changes=[];issues=[];deviceAssignments=[];registeredDevices=[];deviceChoices=[];reissueDevices=[];movements=[];stockContext={};selectedRegisteredId=null;detail=null;loaded=false;loading=false;
  }
  async function stockRequest(path,payload){
    const response=await fetch(path.startsWith('/api/')?path:'/api/it-assets/'+path,{cache:'no-store',...(payload?{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':config.csrf},body:JSON.stringify(payload)}:{})});
    const result=await response.json();
    if(!response.ok){
      if([401,403].includes(response.status)){clearStock();await config.refreshAccess();config.redraw();}
      const failure=Error(result.error||'Unable to complete the stock operation.');failure.status=response.status;throw failure;
    }
    return result;
  }
  async function refreshStock(){
    if(!canRead()){clearStock();return;}
    const request=++generation;loading=true;
    try{
      const [result,reportResult]=await Promise.all([stockRequest('stock'),stockRequest('report?days='+reportDays+(reportCategory?'&category='+encodeURIComponent(reportCategory):''))]);
      if(request!==generation||!canRead())return;
      report=reportResult;reissueDevices=result.reissueDevices||[];items=result.items;receipts=result.receipts;changes=result.readinessChanges;issues=result.issues||[];deviceAssignments=result.deviceAssignments||[];registeredDevices=result.registeredDevices||[];deviceChoices=result.deviceChoices||[];movements=result.movements||[];loaded=true;error='';
      if(returnCorrection){returnCorrection.refreshRequired=false;returnCorrection.form.querySelector('[data-stock-feedback]').textContent='';}
      if(detail)detail=await stockRequest('stock/'+detail.item.id);
    }catch(failure){if(request===generation)error=failure.message;}
    finally{if(request===generation){loading=false;config.redraw();}}
  }
  function enterStock(){
    if(!canRead()){clearStock();return;}
    if(!canEdit()&&['receive','issue','return','writeoff'].includes(tab))tab='overview';
    if(!loaded&&!loading)void refreshStock();
  }
  function renderStock(){
    if(tab!=='issue'||stockContext.association||!canEdit())issueDraft=null;
    if(!canRead())return stockNotice('IT Assets Not Available','The feature and IT Assets Read access are required.');
    const title={overview:'Overview',receive:'Receive Stock',inventory:'Stock Inventory',history:'Receipt History',issue:stockContext.association?'Add Equipment':'Issue Equipment',return:'Return Equipment',writeoff:'Write Off',reissue:'Reissue Existing Device',movements:'Movement History'}[tab];
    const total=items.reduce((sum,item)=>{for(const key of Object.keys(sum))sum[key]+=BigInt(item.balances[key]);return sum;},{physicallyHeld:0n,readyToIssue:0n,awaitingChecks:0n});
    for(const device of registeredDevices.filter(device=>!device.stockItemId)){total.physicallyHeld+=BigInt(['ready','awaiting_checks','awaiting_preparation'].reduce((sum,key)=>sum+(device.states[key]||0),0));total.readyToIssue+=BigInt(device.states.ready||0);total.awaitingChecks+=BigInt((device.states.awaiting_checks||0)+(device.states.awaiting_preparation||0));}
    const tabs=[['overview','Overview'],...(canEdit()?[['receive','Receive Stock']]:[]),['inventory','Stock Inventory'],...(canEdit()&&config.canEditDevices()?[["reissue","Reissue Existing Device"]]:[]),['history','Receipt History'],...(canEdit()?[['issue',stockContext.association?'Add Equipment':'Issue Equipment'],['return','Return Equipment'],['writeoff','Write Off']]:[]),['movements','Movement History']];
    return `<div class="users-live stock-live"><div class="section-page-header"><div class="eyebrow">IT Assets</div><div class="header"><div><h1>${title}</h1><p>Receive, issue and return equipment, record checks and retain its history.</p></div></div></div>
      <nav class="tabs" role="tablist" aria-label="IT Assets">${tabs.map(([key,label])=>`<button class="tab${tab===key?' active':''}" type="button" id="stock-tab-${key}" role="tab" aria-selected="${tab===key}" aria-controls="stock-panel" tabindex="${tab===key?'0':'-1'}" data-stock-action="tab" data-tab="${key}">${label}</button>`).join('')}</nav>
      <section class="stock-panel" id="stock-panel" role="tabpanel" aria-labelledby="stock-tab-${tab}">${error?stockNotice('Stock Could Not Be Loaded',error)+stockButton('Reload Stock','reload'):''}${!loaded?stockNotice('Loading Stock','Retrieving permitted stock records…'):(tab==='overview'?renderStockOverview():stockMetrics(total)+(tab==='receive'?renderStockReceipt():tab==='inventory'?renderStockInventory():tab==='history'?renderStockHistory():tab==='reissue'?renderDeviceReissue():tab==='issue'?renderStockIssue():tab==='return'?renderStockReturn():tab==='writeoff'?renderStockWriteOff():renderStockMovements()))}</section></div>`;
  }
  function receiptTracking(form){
    return receiptMode==='new'?form.elements.trackingMode.value:items.find(item=>item.id===form.elements.existing.value)?.trackingMode||'quantity';
  }
  function hydrateStock(){
    hydrateStockCirculation();
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
      const registeredReady=individual?0:before-(item.quantityStateBalances.ready||0);
      if(!Number.isSafeInteger(ready)||ready<registeredReady||ready>item.balances.physicallyHeld){
        readiness.querySelector('#stock-readiness-summary').textContent=registeredReady
          ? `Enter a whole-number Ready total from ${registeredReady} to ${item.balances.physicallyHeld}. Registered Ready Devices cannot be changed here.`
          : 'Enter a whole-number ready total between zero and Physically Held.';
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
    error='';detail=null;selectedRegisteredId=null;tab='inventory';config.redraw();
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
      const chosenSupplier=form.supplierChooser?.value();
      if(chosenSupplier?.id)payload.supplierId=chosenSupplier.id;
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
    if (['assign-receipt-supplier','link-receipt-supplier','remove-receipt-supplier'].includes(action)) {
      if (!canEdit() || !config.suppliersEnabled() || pending) return;
      const ids = action === 'assign-receipt-supplier'
        ? [...document.querySelectorAll('[data-select-receipt-supplier]:checked')].map(input => Number(input.dataset.selectReceiptSupplier))
        : [Number(button.dataset.id)];
      const records = receipts.filter(row => ids.includes(row.id))
        .map(row => ({id:row.id, revision:row.supplierRevision, linked:!!row.supplierAssociation}));
      const label = action === 'link-receipt-supplier' ? (records[0]?.linked ? 'Change Supplier' : 'Link Supplier')
        : action === 'remove-receipt-supplier' ? 'Remove Supplier Association' : 'Assign Supplier';
      window.caffootSuppliers.openEquipmentAssignment('receipts', records, {
        action: label, trigger: button, refresh: async () => {
          await refreshStock();
          const entry = button.dataset.id && document.getElementById('stock-receipt-' + button.dataset.id);
          (entry || document.getElementById('stock-tab-history'))?.focus();
        }
      });
      return;
    }
    if(action==='report-drill'){drillStockReport(button);return;}
    if(action==='report-movement'){
      tab='movements';movementFilter={entryId:Number(button.dataset.id)};config.redraw();document.getElementById('stock-tab-movements')?.focus();return;
    }
    if(action==='clear-report-filters'){inventoryFilter=null;movementFilter=null;config.redraw();return;}
    if(action==='edit-issue'){
      if(!pending)editStockIssue(button.closest('form'));
      return;
    }
    if(action==='correct-return-movement'){
      const form=button.closest('form'),source=form&&stockSelectedReturn(form);
      if(!canEdit()||pending||returnCorrection?.refreshRequired||!stockReturnCorrectionEntry(source))return;
      void openStockCorrection(source.id,form).catch(failure=>{if(form.isConnected)form.querySelector('[data-stock-feedback]').textContent=failure.message;config.notify(failure.message,'error');});return;
    }
    if(action==='correct-movement'){
      if(!canEdit()||pending)return;
      leaveStockCorrection(()=>{void openStockCorrection(Number(button.dataset.id)).catch(failure=>config.notify(failure.message,'error'));});return;
    }
    if(action==='cancel-correction'){leaveStockCorrection(closeStockCorrection);return;}
    if((correction||returnCorrection)&&['tab','reload'].includes(action)){
      if(action==='reload'&&!correction){void refreshStock();return;}
      if(action==='tab'&&button.dataset.tab==='return'&&returnCorrection){leaveStockCorrection(closeStockCorrection);return;}
      leaveStockCorrection(()=>{correction=null;correctionRequest++;if(action==='reload')void refreshStock();else{tab=button.dataset.tab;config.redraw();document.getElementById('stock-tab-'+tab)?.focus();}},true);return;
    }
    if(action==='cancel-handover'){if(!pending&&stockContext.handover){const deviceId=stockContext.handover.deviceId;config.cancelHandover(deviceId,()=>{stockContext={};});}return;}
    if(action==='cancel-stock'||action==='cancel-readiness'){
      if(pending)return;
      const form=button.closest('form');
      if(!form)return;
      const association=stockContext.association;
      config.cancelStockForm(form,()=>{
        returnCorrection=null;stockContext={};detail=null;selectedRegisteredId=null;error='';receiptMode='new';tab='inventory';
        if(association)config.viewAssociations(association.deviceId);
        else {config.redraw();document.getElementById('stock-tab-inventory')?.focus();}
      });
      return;
    }
    if (action === 'tab' && /^#it-assets\/receipts\//.test(location.hash)) history.replaceState(null,'','#it-assets');
    if(action==='tab'){if(stockContext.association&&button.dataset.tab!=='issue')stockContext={};tab=button.dataset.tab;error='';config.redraw();document.getElementById('stock-tab-'+tab)?.focus();return;}
    if(action==='reload'){void refreshStock();return;}
    if(action==='reissue-device'){if(canEdit()&&config.canEditDevices())openStockWorkflow('reissue',{deviceId:button.dataset.id});return;}
    if(action==='register-device'){if(canEdit()&&config.canEditDevices())config.registerDevice(button.dataset.id);return;}
    if(action==='issue-item'){openStockWorkflow('issue',{stockItemId:button.dataset.id});return;}
    if(action==='writeoff-item'){openStockWorkflow('writeoff',{stockItemId:button.dataset.id});return;}
    if(action==='writeoff-device'){openStockWorkflow('writeoff',{deviceId:button.dataset.id});return;}
    if(action==='registered-details'){selectedRegisteredId=button.dataset.id;detail=null;tab='inventory';config.redraw();return;}
    if(action==='close-registered'){selectedRegisteredId=null;config.redraw();return;}
    if(action==='view-device'){config.viewDevice(button.dataset.id);return;}
    if(action==='details'||action==='cancel-readiness'){if(tab==='overview'){inventoryFilter=null;tab='inventory';}void openStockDetails(button.dataset.id||detail?.item.id).catch(failure=>{error=failure.message;config.redraw();});return;}
    if(action==='close-details'){detail=null;config.redraw();return;}
    if(action==='mode-new'||action==='mode-existing'){
      receiptMode=action==='mode-new'?'new':'existing';
      const form=button.closest('form');
      form.dataset.receiptMode=receiptMode;
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
    if(event.target.id==='stock-correction-form'){
      event.preventDefault();void submitStockCorrection(event.target).catch(failure=>{const feedback=event.target.querySelector('[data-stock-feedback]');if(feedback?.isConnected)feedback.textContent=failure.message;config.notify(failure.message,'error');});return;
    }
    const form=event.target;if(!form.matches('#stock-receipt-form,#stock-readiness-form,#stock-issue-form,#stock-return-form,#stock-writeoff-form,#stock-preparation-form,#stock-reissue-form'))return;
    event.preventDefault();
    void (form.matches('#stock-receipt-form,#stock-readiness-form')?submitStock(form):submitStockCirculation(form,event.submitter?.matches('#stock-issue-confirmation [type="submit"]')===true)).catch(failure=>{const feedback=form.querySelector('[data-stock-feedback]');if(feedback?.isConnected)feedback.textContent=failure.message;config.notify(failure.message,'error');});
  });
  document.addEventListener('input',event=>{if(event.target.closest('#stock-receipt-form,#stock-readiness-form,#stock-issue-form,#stock-return-form,#stock-writeoff-form,#stock-preparation-form,#stock-reissue-form'))hydrateStock();});
  document.addEventListener('change',event=>{
    if (event.target.hasAttribute('data-select-receipt-supplier')) {
      const panel = event.target.closest('#stock-panel');
      panel.querySelector('[data-stock-action="assign-receipt-supplier"]').disabled =
        !panel.querySelector('[data-select-receipt-supplier]:checked');
    }
    if(event.target.id==='stock-report-days'||event.target.id==='stock-report-category'){
      reportDays=Number(document.getElementById('stock-report-days').value);reportCategory=document.getElementById('stock-report-category').value;
      void refreshStock();return;
    }
    if(event.target.closest('#stock-receipt-form,#stock-readiness-form,#stock-issue-form,#stock-return-form,#stock-writeoff-form,#stock-preparation-form,#stock-reissue-form'))hydrateStock();});
  document.addEventListener('reset',event=>{
    if(event.target.id==='stock-receipt-form')event.target.dataset.operationId='';
    if(event.target.id==='stock-receipt-form'||event.target.id==='stock-issue-form')setTimeout(hydrateStock,0);
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&correction&&!document.getElementById('discard-dialog')&&!pending){
      event.preventDefault();leaveStockCorrection(closeStockCorrection);return;
    }
    const button=event.target.closest('[data-stock-action="tab"]');
    if(!button||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();event.stopImmediatePropagation();
    const buttons=[...button.parentElement.querySelectorAll('[data-stock-action="tab"]')];
    let index=buttons.indexOf(button);index=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
    if(buttons[index].dataset.tab==='return'&&returnCorrection){leaveStockCorrection(closeStockCorrection);return;}
    leaveStockCorrection(()=>{correction=null;correctionRequest++;tab=buttons[index].dataset.tab;config.redraw();document.getElementById('stock-tab-'+tab)?.focus();},true);
  });
    function stockStateLabel(state){return {ready:'Ready To Issue',awaiting_checks:'Awaiting Checks',awaiting_preparation:'Awaiting Preparation',issued:'Currently Issued',written_off:'Written Off',unrecorded:'Not Recorded As Stock'}[state]||'Not Physically Held';}
  function stockUnitState(unit){return ['written_off','issued','ready','awaiting_preparation','awaiting_checks'].find(state=>unit.balances[state]===1)||'';}
  function stockNote(label,name){return `<div class="preview-form-field"><label for="stock-${name}">${label}</label><textarea class="input" id="stock-${name}" name="${name}" maxlength="2000"></textarea></div>`;}
  function stockWorkflowForm(id,title,description,content,summary,action,confirmation=''){
    const handover=id==='reissue'&&!!stockContext.handover;
    const submit=`<button class="btn btn-primary" type="submit"${confirmation?' aria-describedby="stock-physical-return-confirmation"':''}>${action}</button>`;
    const actions=handover
      ?`<div class="assignment-modal-actions">${stockButton('Cancel','cancel-handover')}${submit}</div>`
      :`<div class="stock-form-actions">${stockButton('Cancel','cancel-stock')}${submit}</div>`;
    return `<form id="stock-${id}-form" class="preview-aligned-form"${handover?' data-direct-handover="true"':' data-stock-cancellable="true"'}><div class="staff-main-grid"><div class="stock-card-stack">${stockCard(title,description,content)}<p class="formhint" data-stock-feedback role="alert"></p>${confirmation?`<p class="formhint" id="stock-physical-return-confirmation">${confirmation}</p>`:''}</div><aside class="staff-side-stack">${stockCard('Selected Equipment','Only the selected equipment and its genuine quantities are used.',summary)}</aside></div>${actions}</form>`;
  }
  function stockIssueReady(item){return !item?0:item.trackingMode==='quantity'?(item.quantityStateBalances.ready||0):item.units.filter(unit=>unit.ready&&!unit.deviceLinked).length;}
  function renderDeviceReissue(){
    const handover=stockContext.handover;
    if(!config.canEditDevices()||(!handover&&!canEdit()))return stockNotice('Reissue Not Available','The required equipment editing rights are needed.');
    const deviceField=handover?stockField('Device','handoverDevice','text',handover.name,'readonly'):stockSelect('Ready Registered Device','reissueDevice',reissueDevices.length?reissueDevices.map(device=>[device.deviceId,device.name+' · '+device.category]):[['','No Ready Registered Devices']], 'required',stockContext.deviceId);
    const checks=handover?`<div class="divider"></div><h3>Preparation Checks</h3><label class="stock-check"><input type="checkbox" name="cleanedWorking" required>${safe(handover.preparation.workingCheckLabel)}</label>${handover.preparation.dataConfirmationRequired?'<label class="stock-check"><input type="checkbox" name="dataPreparationConfirmed" required>'+safe(handover.preparation.dataCheckLabel)+'</label>':''}<p class="formhint">Complete the applicable checks before confirming this Device Ready for its new holder.</p>`:'';
    const content=`<div class="staff-fields">${deviceField}
      ${stockSelect(handover?'Recipient Type':'Assign To','recipientKind',[['staff','Staff Member'],['department','Department']], '',stockContext.recipientKind||'staff')}
      ${handover?stockSelect('Find A Recipient','recipientId',[['','Select A Staff Member']], 'required'):stockField('Find A Recipient','recipientSearch','search','','maxlength="100"')+stockSelect('Staff Member Or Department','recipientId',[['','Select An Eligible Recipient']], 'required')}
      ${window.caffootEquipment.departmentPickerMarkup()}
      ${stockField(handover?'Date Reassigned':'Date Issued','issuedOn','date',stockTodayIso(),'required')}</div>${checks}${stockNote(handover?'Reassignment Note (Optional)':'Issue Note (Optional)','issueNote')}`;
    return stockWorkflowForm('reissue',handover?'Reassignment Details':'Reissue Existing Device',handover?'The current holder stays recorded until this complete handover succeeds.':'Issue one genuinely held, prepared Device while preserving its identity and all previous assignments.',content,
      handover?'<p>This Device goes directly to its new holder. It is not being returned to the storeroom. Associated equipment must already be resolved.</p>':'<p>Only unassigned registered Devices recorded as Ready To Issue are eligible. A successful assignment reduces Physically Held and Ready To Issue by one. Device Status, configuration, network and rack details stay as recorded.</p>',handover?'Confirm Ready And Reassign':'Reissue Existing Device');
  }
  function stockExistingIssueLabel(issue){
    const specification=issue.specification||{};
    const identity=[specification.serialNumber?'Serial '+specification.serialNumber:'',
      specification.assetTag?'Asset '+specification.assetTag:''].filter(Boolean).join(' · ');
    return issue.name+' · '+(identity?identity+' · ':'')+'Issue #'+issue.id+
      ' · '+issue.outstanding+' Outstanding · Issued '+issue.issuedOn;
  }
  function renderStockIssue(){
    if(!canEdit())return stockNotice('Read Only','IT Assets Edit is required to issue equipment.');
    if(stockContext.association&&!config.canEditDevices())return stockNotice('Read Only','Devices Edit and IT Assets Edit are required to add equipment.');
    const association=stockContext.association;
    if(issueDraft&&!association)return '<div id="stock-issue-draft"></div>';
    const choices=items.map(item=>[item.id,stockLabel(item)+' · '+stockIssueReady(item)+' Ready']);
    const recipient=association?`<p class="formhint">Issued To: <strong>${safe(association.recipientLabel)}</strong>. Equipment is linked to this Device only when you save.</p>`:`${stockSelect('Assign To','recipientKind',[['staff','Staff Member'],['department','Department']], '',stockContext.recipientKind||'staff')}${stockField('Find A Recipient','recipientSearch','search','','maxlength="100"')}${stockSelect('Staff Member Or Department','recipientId',[['','Select An Eligible Recipient']], 'required')}`;
    const methods=association?`${stockSelect('Add Equipment From','associationMethod',[['new','Issue And Associate'],['existing','Associate Already Issued Equipment']])}${recipient}<fieldset id="stock-association-existing" hidden disabled>${stockSelect('Already Issued Equipment','existingIssue',(stockContext.existingIssues||[]).map(issue=>[issue.id,stockExistingIssueLabel(issue)]).concat((stockContext.existingIssues||[]).length?[]:[['','No Eligible Issued Equipment']]),'required')}<p class="formhint">The entire outstanding original issue is linked. Stock is not issued or deducted again.</p></fieldset>`:'';
    const content=`${methods}<fieldset id="stock-association-new"><div class="staff-fields">${stockSelect('Ready Equipment','issueItem',choices.length?choices:[['','No Stock Items']], 'required',stockContext.stockItemId)}${stockField('Quantity To Issue','issueQuantity','number','1','required min="1" step="1"')}
      ${association?'':recipient}${stockField('Date Issued','issuedOn','date',stockTodayIso(),'required')}</div>
      <div id="stock-issue-unit-choices"></div>${stockNote('Issue Note (Optional)','issueNote')}</fieldset><p class="formhint" id="stock-issue-validation" role="status"></p>`;
    return stockWorkflowForm('issue',association?'Add Equipment':'Issue Equipment',association?'Use Ready stock or equipment already issued to this Device’s current holder.':'Choose ready stock and an eligible recipient. Individual equipment keeps its existing identity.',content,
      '<div id="stock-issue-availability" aria-live="polite"></div><p class="formhint">Awaiting, issued and written-off equipment cannot be issued. No managed Device is created by this form.</p>',association?'Add Equipment':'Issue Equipment');
  }
  function editStockIssue(form){
    form.querySelector('#stock-issue-confirmation')?.remove();
    for(const section of form.children)section.hidden=false;
    if(issueDraft)issueDraft.values=null;
    form.querySelector('[type="submit"]').focus();
  }
  function showStockIssueConfirmation(form){
    if(!form.reportValidity())return;
    const item=items.find(item=>item.id===form.elements.issueItem.value);
    const quantity=Number(form.elements.issueQuantity.value),recipient=form.elements.recipientId.selectedOptions[0];
    if(!item||!Number.isSafeInteger(quantity)||quantity<1||quantity>stockIssueReady(item)||!recipient?.value)
      throw Error('Select ready equipment, a valid quantity and an eligible recipient.');
    const selected=[...form.querySelectorAll('[name="issueUnitIds"]:checked')].map(input=>input.value);
    const units=item.units.filter(unit=>selected.includes(unit.id));
    if(item.trackingMode==='individual'&&(units.length!==quantity||units.some(unit=>!unit.ready||unit.deviceLinked)))
      throw Error('Select the individual equipment to issue from Ready stock.');
    // Keep the actual form so going back or changing theme retains every entered value.
    issueDraft={form,values:JSON.stringify([...new FormData(form)]),version:item.version};
    const identity=units.map(unit=>`<div class="info-row"><label>Individual Unit</label><b>${safe([unit.serialNumber?'Serial Number: '+unit.serialNumber:'',unit.assetTag?'Asset Tag: '+unit.assetTag:''].filter(Boolean).join(' · ')||'Individual Unit '+unit.id)}</b></div>`).join('');
    const summary=`<div class="info-row"><label>Equipment</label><b>${safe(stockLabel(item))} · ${safe(displayStockType(item.category))}</b></div>${identity}<div class="info-row"><label>Quantity</label><b>${quantity}</b></div><div class="info-row"><label>${form.elements.recipientKind.value==='staff'?'Staff Member':'Department'}</label><b>${safe(recipient.textContent)}</b></div>`;
    for(const section of form.children)section.hidden=true;
    const confirmation=document.createElement('section');
    confirmation.id='stock-issue-confirmation';confirmation.className='stock-card-stack';
    confirmation.setAttribute('aria-labelledby','stock-issue-confirmation-title');
    confirmation.innerHTML=`<h2 id="stock-issue-confirmation-title" tabindex="-1">Confirm Issue Equipment</h2>${stockCard('Issue Summary','Check the equipment, quantity and recipient before confirming this issue.',summary)}<p class="formhint" data-stock-feedback role="alert"></p><div class="stock-form-actions">${stockButton('Back To Edit','edit-issue')}<button class="btn btn-primary" type="submit">Confirm Issue</button></div>`;
    form.prepend(confirmation);
    confirmation.querySelector('h2').focus();
  }
  function stockReturnSources(){
    if(stockContext.returnSource?.startsWith('unassigned-device:')){
      const device=deviceChoices.find(item=>'unassigned-device:'+item.deviceId===stockContext.returnSource&&item.canReturnUnassigned);
      return device?[{...device,key:stockContext.returnSource,unassignedDevice:true}]:[];
    }
    return [...issues.filter(issue=>issue.outstanding>0).map(issue=>({...issue,key:'stock:'+issue.id})),...deviceAssignments.map(issue=>({...issue,key:'device:'+issue.id}))];
  }
  function renderStockReturn(){
    if(!canEdit())return stockNotice('Read Only','IT Assets Edit is required to return equipment.');
    const unassigned=stockContext.returnSource?.startsWith('unassigned-device:'),sources=stockReturnSources(),choices=sources.map(source=>[source.key,source.unassignedDevice?source.name:source.name+' · '+source.recipientLabel+' · '+source.outstanding+' Outstanding']);
    const content=`${stockSelect(unassigned?'Device Being Returned':'Select Issued Equipment','returnSource',choices.length?choices:[['',unassigned?'Device No Longer Eligible':'No Outstanding Equipment']], unassigned?'required disabled':'required',stockContext.returnSource)}<div class="preview-details-actions"><div id="stock-original-issue"></div><span id="stock-return-correction" hidden>${stockButton('Correct Movement','correct-return-movement')}</span></div><p class="formhint" id="stock-return-refresh" role="status"></p><div class="staff-fields">
      ${stockField('Date Returned','returnedOn','date',stockTodayIso(),'required')}${stockField('Quantity Returned','quantityReturned','number','1','required min="1" step="1"')}
      ${stockField('Cleaned &amp; Checked — Ready To Issue','readyReturnQuantity','number','0','required min="0" step="1"')}${stockField('Damaged — Write Off','writeOffReturnQuantity','number','0','required min="0" step="1"')}</div>
      <label class="stock-check"><input type="checkbox" name="cleanedWorking"><span data-stock-working-label>Cleaned And Checked Working</span></label><label class="stock-check" data-stock-wipe><input type="checkbox" name="dataPreparationConfirmed"><span data-stock-data-label>Data Wiped / Reset</span></label>
      <p class="formhint" data-stock-preparation-note>Only equipment that passes the applicable checks can become Ready.</p>${stockField('Damaged / Write-Off Reason','writeOffReason','text','','maxlength="2000"')}${stockNote('Return Note (Optional)','returnNote')}`;
    return stockWorkflowForm('return','Record An Equipment Return',unassigned?'Record the actual physical return of this existing Device. No recorded issue or current assignment is being closed.':'Return against the original outstanding issue. Unreturned equipment stays with its original holder.',content,
      '<div id="stock-return-summary" aria-live="polite"></div><p class="formhint">'+(unassigned?'This Device enters Awaiting Preparation. Complete the applicable checks later in Stock Inventory.':'Awaiting Checks is calculated as Returned − Ready − Written Off. Written-off units do not remain physically held.')+'</p>','Record Return',unassigned?'Recording this return confirms that this Device has been physically returned to stock.':'');
  }
  function renderStockWriteOff(){
    if(!canEdit())return stockNotice('Read Only','IT Assets Edit is required to write off equipment.');
    const choices=[...items.map(item=>['item:'+item.id,stockLabel(item)+' · Stock Item']),
      ...issues.filter(issue=>!issue.deviceAssignmentId&&issue.outstanding>0).map(issue=>['issue:'+issue.id,issue.name+' · Issued To '+issue.recipientLabel+' · '+issue.outstanding+' Outstanding']),
      ...(config.canEditDevices()?deviceChoices.filter(device=>!device.states.written_off).map(device=>['device:'+device.deviceId,device.name+' · Existing Device']):[])];
    const selected=stockContext.deviceId?'device:'+stockContext.deviceId:stockContext.issueEntryId?'issue:'+stockContext.issueEntryId:stockContext.stockItemId?'item:'+stockContext.stockItemId:null;
    const content=`${stockSelect('Equipment To Write Off','writeOffTarget',choices.length?choices:[['','No Eligible Equipment']], 'required',selected)}<div class="staff-fields">${stockSelect('Current State','writeOffState',[['','Select Equipment']],'required')}
      ${stockField('Quantity To Write Off','writeOffQuantity','number','1','required min="1" step="1"')}${stockField('Date Written Off','writtenOffOn','date',stockTodayIso(),'required')}
      ${stockField('Write-Off Reason','writeOffReason','text','','required maxlength="2000"')}</div><div id="stock-writeoff-unit-choices"></div>${stockNote('Write-Off Note (Optional)','writeOffNote')}
      <p class="formhint">This is a permanent historical action. The original equipment and holder history are retained. Other accessories are not written off automatically.</p>`;
    return stockWorkflowForm('writeoff','Write Off Equipment','Record the actual equipment and a reason. Missing issued equipment is written off without a return to stock.',content,
      '<div id="stock-writeoff-summary" aria-live="polite"></div>','Record Write Off');
  }
  function stockPreparationRequirement(item,registered){
    if(registered)return item.preparation;
    if(['Desktop','Laptop','Server - Physical'].includes(item.category))return {dataConfirmationRequired:true,dataCheckLabel:'Data Wiped / Reset',workingCheckLabel:'Checked Working'};
    if(item.category==='Printer')return {dataConfirmationRequired:true,dataCheckLabel:'Stored Documents, Credentials And User Data Cleared Where Applicable',workingCheckLabel:'Cleaned And Checked Working'};
    if(['Monitor','Keyboard','Mouse','Docking Station'].includes(item.category))return {dataConfirmationRequired:false,dataCheckLabel:'',workingCheckLabel:'Cleaned And Checked Working'};
    return {dataConfirmationRequired:true,dataCheckLabel:'Applicable Preparation Completed, Including Data Clearing Where Needed',workingCheckLabel:'Working And Condition Checked'};
  }
  function renderStockPreparation(item,registered=false){
    const units=registered?[]:item.units.filter(unit=>unit.balances.awaiting_preparation===1&&!unit.deviceLinked);
    const available=registered?(item.states.awaiting_preparation||0):item.trackingMode==='quantity'?(item.quantityStateBalances.awaiting_preparation||0):units.length;
    if(!available||!canEdit()||registered&&!config.canEditDevices())return '';
    const requirements=stockPreparationRequirement(item,registered),individual=registered||item.trackingMode==='individual';
    const picks=!registered&&individual?units.map(unit=>`<label class="stock-check"><input type="checkbox" name="prepareUnitIds" value="${safe(unit.id)}">${safe(unit.serialNumber||unit.assetTag||'Individual Unit '+unit.id.slice(0,8))}</label>`).join(''):'';
    const form=`<form id="stock-preparation-form" class="preview-aligned-form" data-stock-cancellable="true" data-id="${safe(registered?item.stockUnitId:item.id)}" data-registered="${registered}" data-version="${safe(item.version)}" data-available="${available}">
      <p class="formhint">${available} Awaiting Preparation. Confirm only the equipment actually checked.</p>${picks}<div class="staff-fields">${stockField('Quantity Newly Checked &amp; Ready','prepareQuantity','number',registered?'1':individual?'0':'1',`required min="1" max="${available}" step="1" ${individual?'readonly':''}`)}${stockField('Date Checked','checkedOn','date',stockTodayIso(),'required')}</div>
      <label class="stock-check"><input type="checkbox" name="cleanedWorking" required>${safe(requirements.workingCheckLabel)}</label>${requirements.dataConfirmationRequired?'<label class="stock-check"><input type="checkbox" name="dataPreparationConfirmed" required>'+safe(requirements.dataCheckLabel)+'</label>':''}
      ${item.category==='Printer'?'<p class="formhint">A factory reset is not required for every Printer. Confirm applicable data clearing before Ready.</p>':''}${stockNote('Preparation Note (Optional)','preparationNote')}<p class="formhint" data-stock-feedback role="alert"></p><div class="stock-form-actions">${stockButton('Cancel','cancel-stock')}<button class="btn btn-primary" type="submit">Mark Ready To Issue</button></div></form>`;
    return stockCard('Prepare Returned Equipment','Preparation preserves the physical total and original return history.',form);
  }
  function renderRegisteredStock(){
    const rows=registeredDevices.filter(stockRegisteredMatches).map(device=>`<tr><td>${stockButton(safe(device.name),'registered-details',device.stockUnitId)}<div class="sub">${safe(displayStockType(device.category))}</div></td><td>${['ready','awaiting_checks','awaiting_preparation'].reduce((sum,key)=>sum+(device.states[key]||0),0)}</td><td>${device.states.ready||0}</td><td>${device.states.awaiting_preparation||0}</td><td>${device.states.issued||0}</td><td>${device.states.written_off||0}</td><td>${stockButton('View / Update','registered-details',device.stockUnitId)}</td></tr>`).join('');
    const device=registeredDevices.find(record=>record.stockUnitId===selectedRegisteredId);
    const detail=device?stockCard(safe(device.name),'The same canonical Device and its genuine stock history.',
      `<div class="info-row"><label>Equipment Type</label><b>${safe(displayStockType(device.category))}</b></div><div class="info-row"><label>Serial Number</label><b>${safe(device.serialNumber||'Not Recorded')}</b></div><div class="info-row"><label>Asset Tag</label><b>${safe(device.assetTag||'Not Recorded')}</b></div><div class="preview-details-actions">${stockButton('View Device','view-device',device.deviceId)}${canEdit()&&config.canEditDevices()&&reissueDevices.some(item=>item.deviceId===device.deviceId)?stockButton('Reissue Existing Device','reissue-device',device.deviceId):''}${canEdit()&&config.canEditDevices()&&!device.states.written_off?stockButton('Write Off','writeoff-device',device.deviceId):''}${stockButton('Close Details','close-registered')}</div>`)+renderStockPreparation(device,true):'';
    return registeredDevices.length?`<h2>Registered Devices In Stock History</h2><div class="card">${stockTable(['Device','Physically Held','Ready','Awaiting Preparation','Currently Issued','Written Off','Details'],rows,'No Registered Stock Devices')}</div>${detail}`:'';
  }
  function renderStockMovements(){
    const labels={received:'Received',issued:'Issued',reassigned:'Reassigned',returned:'Returned',readiness_changed:'Readiness Changed',written_off:'Written Off',registered:'Registered',corrected:'Corrected'};
    const rows=movements.filter(stockMovementMatches).map(event=>`<tr data-movement-entry="${event.entryId}"><td>${stockDate(event.date)}<div class="sub">${safe(event.actor)}</div><div class="sub">Movement ${event.id} · Entry ${event.entryId}</div></td><td>${safe(event.name)}</td><td>${labels[event.kind]||safe(event.kind)}</td><td>${event.kind==='corrected'?`${event.previousQuantity} → ${event.correctedQuantity}<div class="sub">Original Entry ${event.correctsEntryId}</div>`:`${event.quantity}<div class="sub">Effective: ${event.effectiveQuantity}</div>`}</td><td>${safe(event.recipientLabel||'—')}</td><td>${safe(stockStateLabel(event.fromState))} → ${safe(stockStateLabel(event.toState))}</td><td>${safe(event.reason||event.note||'—')}<details><summary>Movement Details</summary><p>Recorded: ${safe(stockRecordedDate(event.recordedAt))}</p>${event.sourceIssueEntryId?`<p>Original Issue: ${event.sourceIssueEntryId}</p>`:''}${event.physicalReturnConfirmed?'<p>Physical Return Confirmed. No recorded issue or current assignment was closed.</p>':''}${event.checks?`<p>${Object.entries(event.checks).filter(([name,value])=>typeof value==='boolean'&&!(name==='dataPreparationConfirmed'&&event.checks.dataCheckLabel==='')).map(([name,value])=>`${safe({itemsChecked:'Items Checked',conditionChecked:'Condition Checked',cleanedWorking:event.checks.workingCheckLabel||'Cleaned And Checked Working',dataPreparationConfirmed:event.checks.dataCheckLabel||'Data Wiped / Reset'}[name]||name)}: ${stockCheckLabel(value)}`).join('<br>')}</p>`:''}${event.supplier?'<p>Supplier: '+safe(event.supplier)+'</p>':''}</details></td><td>${canEdit()&&event.canCorrect?stockButton('Correct Movement','correct-movement',event.entryId):'<span class="sub">'+(canEdit()?'No Quantity Correction':'Read Only')+'</span>'}</td></tr>`).join('');
    return `<div class="stock-card-stack">${correction&&canEdit()?renderStockCorrection():''}${movementFilter?`<div class="section-heading"><p class="sub">Dashboard movement selection${movementFilter.entryId?' · Entry '+movementFilter.entryId:' · '+movementFilter.start+' – '+movementFilter.end+(movementFilter.kind?' · Written Off':'')}.</p>${stockButton('Clear Dashboard Filters','clear-report-filters')}</div>`:''}<h2>Stock Movement History</h2><p class="sub">Original quantities and effective quantities are shown separately. Corrections retain the original reference, reason, actor and date. Each entry in a multi-entry movement is selected separately.</p><div class="card stock-movement-table">${stockTable(['Date / Actor / Reference','Equipment','Movement','Original / Effective Quantity','Original Holder','State Change','Reason / Note','Actions'],rows,'No Recorded Stock Movements')}</div></div>`;
  }
  function renderStockCorrection(){
    const selected=correction;
    const proposed=selected.draftQuantity??String(selected.effectiveQuantity),reason=selected.draftReason||'';
    const kind={received:'Received',issued:'Issued',returned:'Returned',written_off:'Written Off'}[selected.kind];
    const details=[['Original Movement',`${selected.movementId} · Entry ${selected.entryId} · ${kind}`],['Equipment',selected.name],['Original Recorded Quantity',selected.originalQuantity],['Current Effective Quantity',selected.effectiveQuantity],['Recorded By',selected.actor],['Movement Date',stockDateText(selected.date)],['Recorded At',stockRecordedDate(selected.recordedAt)],['Supplier / Source',selected.supplier||'Not Recorded'],['Original Recipient',selected.recipientLabel||'Not Applicable'],['Original Issue',selected.sourceIssueEntryId||'Not Applicable'],['Individual Unit / Device',selected.deviceId||selected.stockUnitId||'Quantity-Based Stock']];
    const original=details.map(([label,value])=>`<div class="info-row"><label>${label}</label><b>${safe(value)}</b></div>`).join('');
    const history=selected.history.length?`<ol class="stock-correction-history">${selected.history.map(row=>`<li><h4>Previous → Corrected: ${row.previousQuantity} → ${row.correctedQuantity}</h4><p>${safe(row.reason)}</p><p class="sub">${safe(row.actor)} · ${safe(stockRecordedDate(row.recordedAt))} · Correction ${row.id}</p></li>`).join('')}</ol>`:stockNotice('No Corrections Recorded','Corrections to this original entry will appear here.');
    return `<section id="stock-correction-details" class="stock-card-stack"><h2 tabindex="-1">Correct Stock Movement</h2><form id="stock-correction-form" class="preview-aligned-form" data-stock-cancellable="true"><div class="staff-main-grid"><div class="stock-card-stack">${stockCard('Original Movement Details','The original transaction, supplier and all later records are retained.',original)}${stockCard('Correction Details','Enter the corrected total for this original entry, rather than the difference.',`<div class="staff-fields">${stockField('Corrected Quantity','correctedQuantity','number',proposed,'required min="1" max="9007199254740991" step="1"')}</div><div class="preview-form-field"><label for="stock-correctionReason">Reason For Correction (Required)</label><textarea class="input" id="stock-correctionReason" name="correctionReason" required maxlength="2000">${safe(reason)}</textarea></div>`)}<p class="formhint" data-stock-feedback role="alert"></p></div><aside class="staff-side-stack">${stockCard('Stock Impact Before Saving','Calculated by the server against the complete movement history.',`<div id="stock-correction-impact">${renderCorrectionImpact(selected.before,selected.preview?.after)}</div><p id="stock-correction-validation" class="stock-correction-validation" role="status" aria-live="polite">${safe(selected.preview?.message||'Enter a changed quantity and a reason to check this correction.')}</p>`)}</aside></div><div class="stock-form-actions">${stockButton('Cancel','cancel-correction')}<button class="btn btn-primary" type="submit" disabled>Save Correction</button></div></form>${stockCard('Correction History','Every correction remains linked to the original entry.',history)}</section>`;
  }
  function renderCorrectionImpact(before,after){
    const labels=[['Physically Held','physicallyHeld'],['Ready To Issue','readyToIssue'],['Awaiting Checks','awaitingChecks'],['Awaiting Preparation','awaitingPreparation'],['Currently Issued','currentlyIssued'],['Written Off','writtenOff']];
    const rows=labels.map(([label,key])=>`<tr><th scope="row">${label}</th><td>${before.balances[key]}</td><td>${after?after.balances[key]:'—'}</td></tr>`).join('')+(before.outstanding!==null?`<tr><th scope="row">Original Issue Outstanding</th><td>${before.outstanding}</td><td>${after?after.outstanding:'—'}</td></tr>`:'');
    return `<table class="small-table stock-correction-balances"><thead><tr><th scope="col">Balance</th><th scope="col">Before</th><th scope="col">After</th></tr></thead><tbody>${rows}</tbody></table>`;
  }
  function stockReturnCorrectionEntry(source){
    return source?.key.startsWith('stock:')&&movements.find(entry=>entry.entryId===source.id&&entry.kind==='issued'&&entry.canCorrect);
  }
  function restoreStockReturn(){
    const rendered=document.getElementById('stock-return-form');
    if(!rendered||!returnCorrection)return;
    const form=returnCorrection.form,selected=form.elements.returnSource.value,sources=stockReturnSources();
    const eligible=sources.some(source=>source.key===selected);
    form.elements.returnSource.innerHTML='<option value="">Select Eligible Equipment</option>'+sources.map(source=>`<option value="${safe(source.key)}">${safe(source.name+' · '+source.recipientLabel+' · '+source.outstanding+' Outstanding')}</option>`).join('');
    form.elements.returnSource.value=eligible?selected:'';
    // Keep entered quantities visible for review, even when they are no longer valid.
    form.dataset.selected=form.elements.returnSource.value;
    form.querySelector('#stock-return-refresh').textContent=returnCorrection.refreshRequired?'The correction was saved, but stock could not be refreshed. Reload Stock before recording a return.':!eligible?'The original issue is no longer eligible for return. Your entered details are retained. Select eligible equipment and review the return details.':returnCorrection.message;
    if(rendered!==form)rendered.replaceWith(form);
  }
  function closeStockCorrection(){
    correction=null;correctionRequest++;clearTimeout(correctionTimer);
    if(returnCorrection)tab='return';
    config.redraw();
    (document.querySelector('#stock-return-correction:not([hidden]) button')||document.getElementById('stock-returnSource')||document.getElementById('stock-tab-movements'))?.focus();
  }
  function leaveStockCorrection(next,leaveReturn=false){
    if(pending)return;
    const proceed=()=>{
      if(leaveReturn&&returnCorrection)config.cancelStockForm(returnCorrection.form,()=>{returnCorrection=null;next();});
      else next();
    };
    const form=document.getElementById('stock-correction-form');
    if(form)config.cancelStockForm(form,proceed);else proceed();
  }
  async function openStockCorrection(entryId,returnForm=null){
    const request=++correctionRequest;
    const selected=returnForm?.elements.returnSource.value;
    const result=await stockRequest('corrections/'+entryId);
    if(request!==correctionRequest||!canEdit()||(returnForm&&(!returnForm.isConnected||returnForm.elements.returnSource.value!==selected)))return;
    if(returnForm){returnCorrection={form:returnForm,refreshRequired:false,message:''};returnForm.querySelector('[data-stock-feedback]').textContent='';}
    correction=result;tab='movements';config.redraw();
    document.querySelector('#stock-correction-details h2')?.focus();
    document.getElementById('stock-correction-details')?.scrollIntoView({block:'start'});
  }
  function stockCorrectionValues(form){
    return {entryId:correction.entryId,version:correction.version,correctedQuantity:form.elements.correctedQuantity.value===''?null:Number(form.elements.correctedQuantity.value),reason:form.elements.correctionReason.value};
  }
  async function previewStockCorrection(form){
    if(!correction||!form.isConnected||pending)return;
    const body=stockCorrectionValues(form),key=JSON.stringify(body);
    form.dataset.previewRequest=key;
    try{
      const result=await stockRequest('corrections/preview',body);
      if(!form.isConnected||form.dataset.previewRequest!==key)return;
      correction.preview=result;correction.previewPayload=key;
      form.querySelector('#stock-correction-impact').innerHTML=renderCorrectionImpact(result.before,result.after);
      const validation=form.querySelector('#stock-correction-validation');
      validation.textContent=result.message;validation.dataset.allowed=String(result.allowed);
      form.dataset.validatedPayload=result.allowed?key:'';
      form.querySelector('[type="submit"]').disabled=!result.allowed;
      form.dataset.previewCompleted=key;
    }catch(failure){
      if(!form.isConnected||form.dataset.previewRequest!==key)return;
      form.querySelector('#stock-correction-validation').textContent=failure.message;
      form.querySelector('#stock-correction-validation').dataset.allowed='false';
    }
  }
  function scheduleStockCorrection(form){
    clearTimeout(correctionTimer);
    correction.draftQuantity=form.elements.correctedQuantity.value;correction.draftReason=form.elements.correctionReason.value;correction.preview=null;correction.previewPayload='';
    form.dataset.previewRequest='';form.dataset.previewCompleted='';form.dataset.validatedPayload='';
    form.querySelector('[type="submit"]').disabled=true;
    form.querySelector('#stock-correction-impact').innerHTML=renderCorrectionImpact(correction.before,null);
    form.querySelector('#stock-correction-validation').textContent='Checking the proposed correction…';
    form.querySelector('#stock-correction-validation').removeAttribute('data-allowed');
    correctionTimer=setTimeout(()=>void previewStockCorrection(form),200);
  }
  async function submitStockCorrection(form){
    if(pending||!canEdit()||!correction)return;
    const body=stockCorrectionValues(form),key=JSON.stringify(body);
    if(form.dataset.validatedPayload!==key){scheduleStockCorrection(form);return;}
    if(form.dataset.operationPayload!==key){form.dataset.operationId=crypto.randomUUID();form.dataset.operationPayload=key;}
    pending=true;form.dataset.saving='true';
    const controls=[...form.elements].map(control=>[control,control.disabled]);controls.forEach(([control])=>control.disabled=true);
    try{
      await stockRequest('corrections',{operationId:form.dataset.operationId,...body});
      const entry=correction.entryId;
      if(returnCorrection){
        returnCorrection.refreshRequired=true;returnCorrection.message='Correction saved. Quantities and versions have been refreshed. Review the return details before saving.';
        correction=null;correctionRequest++;tab='return';await refreshStock();
        document.getElementById('stock-return-refresh')?.scrollIntoView({block:'center'});
        config.notify('Correction saved. Review the refreshed Return Equipment form.');return;
      }
      correction=null;correctionRequest++;await refreshStock();
      await openStockCorrection(entry);
      config.notify('Correction saved. The original movement and subsequent history are retained.');
    }catch(failure){
      if(form.isConnected&&[400,409].includes(failure.status)){
        correction.preview=null;correction.previewPayload='';form.dataset.validatedPayload='';
        form.querySelector('#stock-correction-validation').textContent='Correction Blocked: '+failure.message;
        form.querySelector('#stock-correction-validation').dataset.allowed='false';
      }
      throw failure;
    }finally{
      pending=false;delete form.dataset.saving;controls.forEach(([control,disabled])=>{if(control.isConnected)control.disabled=disabled;});
      if(form.isConnected&&!form.dataset.validatedPayload)form.querySelector('[type="submit"]').disabled=true;
    }
  }
  document.addEventListener('input',event=>{const form=event.target.closest('#stock-correction-form');if(form&&correction)scheduleStockCorrection(form);});
  document.addEventListener('click',event=>{
    if((!correction&&!returnCorrection)||event.target.closest('[data-stock-action]')||event.target.closest('#discard-dialog'))return;
    const navigation=event.target.closest('#sidebar [data-action],[data-action^="tab-"],a[href]');
    if(!navigation)return;
    event.preventDefault();event.stopImmediatePropagation();
    leaveStockCorrection(()=>{correction=null;correctionRequest++;navigation.click();},true);
  },true);
  window.addEventListener('beforeunload',event=>{
    const form=document.getElementById('stock-correction-form');
    if((form&&correction&&(form.elements.correctedQuantity.value!==String(correction.effectiveQuantity)||form.elements.correctionReason.value))||(returnCorrection&&config.hasStockFormChanges(returnCorrection.form))){event.preventDefault();event.returnValue='';}
  });
  function stockSelectedReturn(form){return stockReturnSources().find(source=>source.key===form.elements.returnSource.value);}
  function stockSelectedWriteOff(form){
    const selected=form.elements.writeOffTarget.value,split=selected.indexOf(':'),kind=selected.slice(0,split),id=selected.slice(split+1);
    return {kind,item:kind==='item'?items.find(item=>item.id===id):kind==='issue'?issues.find(issue=>String(issue.id)===id):deviceChoices.find(device=>device.deviceId===id)};
  }
  function hydrateStockCirculation(){
    const reissue=document.getElementById('stock-reissue-form');
    if(reissue){
      const handover=stockContext.handover;
      const device=handover||reissueDevices.find(item=>item.deviceId===reissue.elements.reissueDevice.value);
      const kind=reissue.elements.recipientKind.value;
      const shared=kind==='department'&&!!device?.sharedDepartments;
      const picker=reissue.querySelector('[data-department-picker]');
      const recipient=reissue.elements.recipientId;
      const search=reissue.elements.recipientSearch;
      picker.hidden=!shared;
      recipient.closest('.preview-form-field').hidden=shared;
      if(search)search.closest('.preview-form-field').hidden=shared;
      const submit=reissue.querySelector('[type="submit"]');
      const ready=!handover||(reissue.elements.cleanedWorking.checked&&
        (!handover.preparation.dataConfirmationRequired||reissue.elements.dataPreparationConfirmed.checked));
      if(shared){
        recipient.disabled=true;
        if(search)search.disabled=true;
        reissue.dataset.recipientQuery='department-picker';
        const selection=window.caffootEquipment.departmentPicker(picker,{onChange:hydrateStockCirculation});
        submit.disabled=!ready||!selection.values().length;
      }else{
        if(search)search.disabled=false;
        const key=handover?kind:kind+'|'+search.value;
        submit.disabled=!device||!ready||!recipient.value;
        if(reissue.dataset.recipientQuery!==key){
          reissue.dataset.recipientQuery=key;
          if(handover){
            recipient.disabled=true;
            recipient.innerHTML='<option value="">Loading '+(kind==='staff'?'Staff Members':'Departments')+'…</option>';
            submit.disabled=true;
            void loadHandoverRecipients(reissue,key);
          }else{
            recipient.disabled=false;
            void loadStockRecipients(reissue,key);
          }
        }
      }
    }
    const issue=document.getElementById('stock-issue-form');
    if(issue&&!pending){
      const existing=issue.elements.associationMethod?.value==='existing';
      const newFields=issue.querySelector('#stock-association-new'),existingFields=issue.querySelector('#stock-association-existing');
      newFields.hidden=existing;newFields.disabled=existing;
      if(existingFields){existingFields.hidden=!existing;existingFields.disabled=!existing;}
      const item=items.find(item=>item.id===issue.elements.issueItem.value),ready=stockIssueReady(item),individual=item?.trackingMode==='individual';
      if(issue.dataset.selected!==item?.id){issue.dataset.selected=item?.id||'';issue.querySelector('#stock-issue-unit-choices').innerHTML=individual?item.units.filter(unit=>unit.ready&&!unit.deviceLinked).map(unit=>`<label class="stock-check"><input type="checkbox" name="issueUnitIds" value="${safe(unit.id)}">${safe(unit.serialNumber||unit.assetTag||'Individual Unit '+unit.id.slice(0,8))}</label>`).join(''):'';}
      if(individual)issue.elements.issueQuantity.value=String(issue.querySelectorAll('[name="issueUnitIds"]:checked').length);
      issue.elements.issueQuantity.readOnly=individual;issue.elements.issueQuantity.max=String(ready);
      const quantity=Number(issue.elements.issueQuantity.value),valid=Number.isSafeInteger(quantity)&&quantity>0&&quantity<=ready;
      issue.querySelector('#stock-issue-availability').textContent=(item?stockLabel(item):'No Equipment Selected')+' · '+ready+' Ready To Issue For This Item';
      issue.querySelector('#stock-issue-validation').textContent=valid?'':`Enter a whole quantity from 1 to ${ready}. Awaiting or already issued equipment is unavailable.`;
      issue.querySelector('[type="submit"]').disabled=existing?!issue.elements.existingIssue.value:!valid||(!stockContext.association&&!issue.elements.recipientId.value);
      if(existing){const original=(stockContext.existingIssues||[]).find(item=>String(item.id)===issue.elements.existingIssue.value);issue.querySelector('#stock-issue-availability').textContent=original?stockExistingIssueLabel(original)+' · No Stock Deduction':'No Eligible Issued Equipment';issue.querySelector('#stock-issue-validation').textContent=original?'':'Select eligible equipment already issued to this exact holder.';}
      if(!stockContext.association){const searchKey=issue.elements.recipientKind.value+'|'+issue.elements.recipientSearch.value;
        if(issue.dataset.recipientQuery!==searchKey){issue.dataset.recipientQuery=searchKey;void loadStockRecipients(issue,searchKey);}}
    }
    const returned=document.getElementById('stock-return-form');
    if(returned){
      const source=stockSelectedReturn(returned);
      if(returned.dataset.selected!==(source?.key||'')){returned.dataset.selected=source?.key||'';returned.elements.quantityReturned.value='1';returned.elements.readyReturnQuantity.value='0';returned.elements.writeOffReturnQuantity.value='0';returned.elements.cleanedWorking.checked=false;returned.elements.dataPreparationConfirmed.checked=false;if(returnCorrection&&source)returned.querySelector('#stock-return-refresh').textContent='Review the return details for the newly selected equipment.';}
      const quantity=Number(returned.elements.quantityReturned.value),ready=Number(returned.elements.readyReturnQuantity.value),written=Number(returned.elements.writeOffReturnQuantity.value);
      const unassigned=!!source?.unassignedDevice,requirements=source?.key.startsWith('device:')?source.preparation:stockPreparationRequirement({category:unassigned?source.category:source?.specification?.category},false);
      const valid=!!source&&[quantity,ready,written].every(Number.isSafeInteger)&&quantity>0&&quantity<=(unassigned?1:source.outstanding)&&ready>=0&&written>=0&&ready+written<=quantity&&(!unassigned||quantity===1&&ready===0&&written===0);
      returned.elements.quantityReturned.max=String(unassigned?1:source?.outstanding||0);returned.elements.quantityReturned.readOnly=unassigned||source?.key.startsWith('device:')||!!source?.stockUnitId;
      returned.elements.readyReturnQuantity.disabled=unassigned;returned.elements.writeOffReturnQuantity.disabled=unassigned;returned.elements.cleanedWorking.disabled=unassigned;
      returned.elements.readyReturnQuantity.max=String(quantity);returned.elements.writeOffReturnQuantity.max=String(quantity);
      returned.querySelector('[data-stock-wipe]').hidden=!requirements.dataConfirmationRequired;returned.elements.dataPreparationConfirmed.disabled=unassigned||!requirements.dataConfirmationRequired;returned.querySelector('[data-stock-working-label]').textContent=requirements.workingCheckLabel;returned.querySelector('[data-stock-data-label]').textContent=requirements.dataCheckLabel;
      returned.elements.writeOffReason.closest('.preview-form-field').hidden=written===0;returned.elements.writeOffReason.required=written>0;
      returned.querySelector('#stock-original-issue').textContent=unassigned?`${source.name} · No recorded issue or current assignment is being closed.`:source?`${source.name} · ${source.recipientLabel} · Issued ${source.issuedOn} · ${source.outstanding} Outstanding`:'Select an original outstanding issue.';
      returned.querySelector('#stock-return-correction').hidden=!stockReturnCorrectionEntry(source)||!!returnCorrection?.refreshRequired;
      returned.querySelector('[data-stock-preparation-note]').textContent=unassigned?'This physical return records Awaiting Preparation only. Confirm the applicable checks later in Stock Inventory.':source?.category==='Printer'?'Clear stored documents, credentials and user data where applicable; a factory reset is not always required.':'Confirm the applicable preparation requirements before returned equipment becomes Ready.';
      returned.querySelector('#stock-return-summary').textContent=unassigned&&valid?'1 Device Returned · 1 Physically Held · 1 Awaiting Preparation · 0 Ready To Issue.':valid?`${quantity} Returned · ${ready} Ready · ${written} Written Off · ${quantity-ready-written} Awaiting Checks. Physically Held increases by ${quantity-written}.`:'Check whole quantities: Returned cannot exceed outstanding; Ready + Written Off cannot exceed Returned.';
      const checked=!ready||(returned.elements.cleanedWorking.checked&&(!requirements.dataConfirmationRequired||returned.elements.dataPreparationConfirmed.checked));
      returned.querySelector('[type="submit"]').disabled=!!returnCorrection?.refreshRequired||!valid||!checked||(written>0&&!returned.elements.writeOffReason.value.trim());
    }
    const writeoff=document.getElementById('stock-writeoff-form');
    if(writeoff){
      const {kind,item}=stockSelectedWriteOff(writeoff);
      const states=kind==='item'?(item?.trackingMode==='quantity'?item.quantityStateBalances:Object.fromEntries(['ready','awaiting_checks','awaiting_preparation'].map(state=>[state,item?.units.filter(unit=>!unit.deviceLinked&&unit.balances[state]===1).length||0]))):kind==='issue'?{issued:item?.outstanding||0}:item?.states||{};
      if(writeoff.dataset.selected!==writeoff.elements.writeOffTarget.value){
        writeoff.dataset.selected=writeoff.elements.writeOffTarget.value;
        const options=Object.entries(states).filter(([state,value])=>value>0&&['ready','awaiting_checks','awaiting_preparation','issued'].includes(state)&&!(kind==='item'&&state==='issued'));
        if(kind==='device'&&item&&!Object.keys(states).length)options.push(['unrecorded',1]);
        writeoff.elements.writeOffState.innerHTML=options.map(([state,count])=>`<option value="${state}">${state==='unrecorded'&&item.deviceAssignmentId?'Currently Assigned':stockStateLabel(state)} · ${count}</option>`).join('');
      }
      const state=writeoff.elements.writeOffState.value,individual=kind==='issue'?!!item?.stockUnitId:kind!=='item'||item?.trackingMode==='individual';
      const units=kind==='item'&&individual?item.units.filter(unit=>!unit.deviceLinked&&unit.balances[state]===1):[];
      const unitKey=writeoff.elements.writeOffTarget.value+'|'+state;
      if(writeoff.dataset.unitSelection!==unitKey){writeoff.dataset.unitSelection=unitKey;writeoff.querySelector('#stock-writeoff-unit-choices').innerHTML=units.map(unit=>`<label class="stock-check"><input type="checkbox" name="writeOffUnitIds" value="${safe(unit.id)}">${safe(unit.serialNumber||unit.assetTag||'Individual Unit '+unit.id.slice(0,8))}</label>`).join('');}
      if(individual)writeoff.elements.writeOffQuantity.value=String(kind==='item'?writeoff.querySelectorAll('[name="writeOffUnitIds"]:checked').length:1);
      writeoff.elements.writeOffQuantity.readOnly=individual;
      const available=state==='unrecorded'?1:states[state]||0,quantity=Number(writeoff.elements.writeOffQuantity.value),valid=!!item&&Number.isSafeInteger(quantity)&&quantity>0&&quantity<=available;
      writeoff.elements.writeOffQuantity.max=String(available);
      writeoff.querySelector('#stock-writeoff-summary').textContent=item?`${item.name||stockLabel(item)} · ${available} In Selected State. ${state==='issued'||state==='unrecorded'?'No physical return or held stock is invented.':'Writing off removes the selected quantity from Physically Held.'}`:'Select equipment to write off.';
      writeoff.querySelector('[type="submit"]').disabled=!valid||!writeoff.elements.writeOffReason.value.trim();
    }
    const preparation=document.getElementById('stock-preparation-form');
    if(preparation&&preparation.dataset.registered!=='true'&&detail?.item.trackingMode==='individual')preparation.elements.prepareQuantity.value=String(preparation.querySelectorAll('[name="prepareUnitIds"]:checked').length);
  }
  async function loadHandoverRecipients(form,kind){
    const recipient=form.elements.recipientId;
    try{
      // A single selection contains every eligible holder, not only the first 50.
      const recipients=[];let offset=0;
      while(true){
        const result=await stockRequest('/api/equipment/recipients?kind='+encodeURIComponent(kind)+'&offset='+offset);
        if(!form.isConnected||form.dataset.recipientQuery!==kind)return;
        recipients.push(...result.recipients);
        if(result.recipients.length<50)break;
        offset+=result.recipients.length;
      }
      if(!form.isConnected||form.dataset.recipientQuery!==kind)return;
      recipient.innerHTML='<option value="">Select A '+(kind==='staff'?'Staff Member':'Department')+'</option>'+
        recipients.map(item=>`<option value="${safe(item.id)}">${safe(item.label)}</option>`).join('');
      recipient.disabled=false;
      recipient.dispatchEvent(new Event('device-dropdown-refresh'));
      hydrateStockCirculation();
    }catch(failure){
      if(!form.isConnected||form.dataset.recipientQuery!==kind)return;
      recipient.innerHTML='<option value="">Unable To Load Recipients</option>';
      recipient.disabled=true;
      form.querySelector('[data-stock-feedback]').textContent=failure.message;
      hydrateStockCirculation();
    }
  }
  async function loadStockRecipients(form,key){
    try{
      const original=stockContext.recipientId&&stockContext.recipientKind===form.elements.recipientKind.value&&!form.elements.recipientSearch.value;
      const result=await stockRequest((stockContext.handover?'/api/equipment/recipients?kind=':'recipients?kind=')+encodeURIComponent(form.elements.recipientKind.value)+(original?'&recipientId='+encodeURIComponent(stockContext.recipientId):'&query='+encodeURIComponent(form.elements.recipientSearch.value)));
      if(!form.isConnected||form.dataset.recipientQuery!==key)return;
      const selected=form.elements.recipientId.value||stockContext.recipientId||'';
      form.elements.recipientId.innerHTML='<option value="">Select An Eligible Recipient</option>'+result.recipients.map(recipient=>`<option value="${safe(recipient.id)}">${safe(recipient.label)}</option>`).join('');
      if(result.recipients.some(recipient=>recipient.id===selected))form.elements.recipientId.value=selected;
      hydrateStockCirculation();
    }catch(failure){if(form.isConnected)form.querySelector('[data-stock-feedback]').textContent=failure.message;}
  }
  async function submitStockCirculation(form,issueConfirmed=false){
    const handover=stockContext.handover;
    if(pending||!(handover?config.canEditDevices():canEdit()))return;
    const confirmingIssue=form.id==='stock-issue-form'&&!stockContext.association;
    if(confirmingIssue){
      if(!form.querySelector('#stock-issue-confirmation')){showStockIssueConfirmation(form);return;}
      if(!issueConfirmed)return;
      if(issueDraft?.form!==form||issueDraft.values!==JSON.stringify([...new FormData(form)])){
        editStockIssue(form);
        throw Error('The issue details changed. Review them and choose Issue Equipment again.');
      }
    }
    const data=new FormData(form),operationId=form.dataset.operationId||(form.dataset.operationId=crypto.randomUUID());
    let payload={operationId},route;
    if(form.id==='stock-reissue-form'){
      const picker=form.querySelector('[data-department-picker]');
      const recipient=picker.hidden?{recipientId:String(data.get('recipientId'))}:
        {departmentIds:window.caffootEquipment.departmentPicker(picker).values()};
      Object.assign(payload,{recipientKind:String(data.get('recipientKind')),...recipient,note:String(data.get('issueNote')||'')});
      if(handover){
        route='/api/equipment/reassign';
        Object.assign(payload,{deviceId:handover.deviceId,version:handover.version,
          handedOverOn:String(data.get('issuedOn')),checks:{cleanedWorking:data.get('cleanedWorking')==='on',dataPreparationConfirmed:data.get('dataPreparationConfirmed')==='on'},readyConfirmed:true});
      }else{
        if(!config.canEditDevices())throw Error('Devices Edit and IT Assets Edit are required.');
        const device=reissueDevices.find(device=>device.deviceId===data.get('reissueDevice'));
        if(!device)throw Error('Select a Ready registered Device.');
        route='reissue-device';
        Object.assign(payload,{deviceId:device.deviceId,version:device.version,issuedOn:String(data.get('issuedOn'))});
      }
    }else if(form.id==='stock-issue-form'){
      if(stockContext.association&&data.get('associationMethod')==='existing'){
        const original=(stockContext.existingIssues||[]).find(item=>String(item.id)===data.get('existingIssue'));
        if(!original)throw Error('Select eligible already issued equipment.');
        route='/api/equipment/associations';Object.assign(payload,{issueEntryId:original.id,version:original.version});
      }else{
      const item=items.find(item=>item.id===data.get('issueItem'));
      if(!item)throw Error('Select ready equipment.');
      route='issue';Object.assign(payload,{stockItemId:item.id,version:item.version,quantity:Number(data.get('issueQuantity')),recipientKind:String(data.get('recipientKind')),recipientId:String(data.get('recipientId')),issuedOn:String(data.get('issuedOn')),note:String(data.get('issueNote')||'')});
      if(item.trackingMode==='individual')payload.stockUnitIds=data.getAll('issueUnitIds');
      if(stockContext.association){route='/api/equipment/issue-and-associate';delete payload.recipientKind;delete payload.recipientId;}
      }
      if(stockContext.association){const context=stockContext.association;Object.assign(payload,{deviceId:context.deviceId,deviceRevision:context.deviceRevision,deviceAssignmentId:context.deviceAssignmentId});}
    }else if(form.id==='stock-return-form'){
      if(returnCorrection?.refreshRequired)throw Error('Reload Stock to refresh quantities and versions before recording a return.');
      const source=stockSelectedReturn(form);if(!source)throw Error('Select an outstanding issue.');
      route='return';Object.assign(payload,{version:source.version,quantityReturned:Number(data.get('quantityReturned')),readyQuantity:Number(data.get('readyReturnQuantity')),writeOffQuantity:Number(data.get('writeOffReturnQuantity')),returnedOn:String(data.get('returnedOn')),checks:{cleanedWorking:data.get('cleanedWorking')==='on',dataPreparationConfirmed:data.get('dataPreparationConfirmed')==='on'},writeOffReason:String(data.get('writeOffReason')||''),note:String(data.get('returnNote')||'')});
      if(source.unassignedDevice)Object.assign(payload,{deviceId:source.deviceId,physicalReturnConfirmed:true});
      else payload[source.key.startsWith('device:')?'deviceAssignmentId':'issueEntryId']=source.id;
    }else if(form.id==='stock-writeoff-form'){
      const {kind,item}=stockSelectedWriteOff(form);if(!item)throw Error('Select equipment to write off.');
      route='write-off';Object.assign(payload,{version:item.version,quantity:Number(data.get('writeOffQuantity')),fromState:String(data.get('writeOffState')),writtenOffOn:String(data.get('writtenOffOn')),reason:String(data.get('writeOffReason')||''),note:String(data.get('writeOffNote')||'')});
      payload[kind==='item'?'stockItemId':kind==='issue'?'issueEntryId':'deviceId']=kind==='device'?item.deviceId:item.id;
      if(kind==='item'&&item.trackingMode==='individual')payload.stockUnitIds=data.getAll('writeOffUnitIds');
    }else{
      route='preparation';Object.assign(payload,{version:form.dataset.version,quantity:Number(data.get('prepareQuantity')),checkedOn:String(data.get('checkedOn')),checks:{cleanedWorking:data.get('cleanedWorking')==='on',dataPreparationConfirmed:data.get('dataPreparationConfirmed')==='on'},note:String(data.get('preparationNote')||'')});
      payload[form.dataset.registered==='true'?'stockUnitId':'stockItemId']=form.dataset.id;
      if(form.dataset.registered!=='true'&&detail.item.trackingMode==='individual')payload.stockUnitIds=data.getAll('prepareUnitIds');
    }
    if(confirmingIssue){
      payload.version=issueDraft.version;
      // An unchanged retry must not issue twice if the first response was lost.
      // Edited details need their own operation identifier.
      const key=JSON.stringify({...payload,operationId:undefined});
      if(form.dataset.operationPayload!==key){form.dataset.operationId=crypto.randomUUID();form.dataset.operationPayload=key;}
      payload.operationId=form.dataset.operationId;
    }
    pending=true;if(handover)form.dataset.saving='true';const controls=[...form.elements].map(control=>[control,control.disabled]);controls.forEach(([control])=>control.disabled=true);
    try{const associated=stockContext.association;await stockRequest(route,payload);delete form.dataset.saving;returnCorrection=null;stockContext={};if(handover){config.viewAssigned(handover.deviceId);config.notify('Device reassigned after confirmed preparation.');return;}if(route!=='preparation'){tab='inventory';detail=null;}await refreshStock();if(associated)config.viewAssociations(associated.deviceId);config.notify(associated?'Equipment associated.':{'reissue-device':'Device reissued.',issue:'Equipment issued.',return:'Equipment return recorded.','write-off':'Equipment written off.',preparation:'Preparation recorded.'}[route]);}
    finally{delete form.dataset.saving;pending=false;controls.forEach(([control,disabled])=>{if(control.isConnected)control.disabled=disabled;});}
  }
  function openStockWorkflow(action,context={}){
    if(!canEdit())return;
    issueDraft=null;
    stockContext={...context};tab=action;detail=null;selectedRegisteredId=null;
    if(stockContext.association||stockContext.returnSource?.startsWith('unassigned-device:'))loaded=false;
    config.navigate();if(!loaded&&!loading)void refreshStock();else config.redraw();
  }
  function openDirectHandover(context){
    if(!config.canEditDevices()||!context)return;
    stockContext={handover:context};
    config.openModal(`<div class="equipment-dialog stock-live"><div class="assignment-modal-head"><h2>Reassign Device</h2></div><div class="assignment-modal-body">${renderDeviceReissue()}</div></div>`);
    document.getElementById('stock-reissue-form').dataset.directHandover='true';
    hydrateStockCirculation();document.getElementById('stock-recipientKind')?.focus();
  }

  function prepareReceipt(identity) {
    receiptFocus = identity;
    tab = 'history';
    detail = null;
    loaded = false;
  }

  function hydrateStockPage(){
    const retainedIssue=document.getElementById('stock-issue-draft');
    if(retainedIssue&&issueDraft)retainedIssue.replaceWith(issueDraft.form);
    restoreStockReturn();
    if (loaded && receiptFocus) {
      const row = document.getElementById('stock-receipt-' + receiptFocus);
      receiptFocus = null;
      (row || document.getElementById('stock-receipts-heading'))?.focus();
      if (!row) config.notify('This receipt is no longer available.', 'error');
    }
    const receipt=document.getElementById('stock-receipt-form');
    if(receipt && config.suppliersEnabled() && !receipt.supplierChooser)
      receipt.supplierChooser=window.caffootSuppliers.mountEquipmentChooser(receipt.elements.supplier,'it-assets');
    hydrateStock();
    document.querySelectorAll('#stock-panel form[data-stock-cancellable="true"]').forEach(form=>config.rememberStockForm(form,
      form.id==='stock-correction-form'?{'stock-correctedQuantity':String(correction.effectiveQuantity),'stock-correctionReason':''}:null));
    const returned=document.getElementById('stock-return-form');
    if(returned&&!returnCorrection&&!stockContext.returnSource?.startsWith('unassigned-device:'))returnCorrection={form:returned,refreshRequired:false,message:''};
    const form=document.getElementById('stock-correction-form');
    if(form&&correction){
      if(correction.preview&&correction.previewPayload===JSON.stringify(stockCorrectionValues(form))){
        form.dataset.previewRequest=correction.previewPayload;form.dataset.previewCompleted=correction.previewPayload;
        form.dataset.validatedPayload=correction.preview.allowed?correction.previewPayload:'';
        form.querySelector('#stock-correction-validation').dataset.allowed=String(correction.preview.allowed);
        form.querySelector('[type="submit"]').disabled=!correction.preview.allowed;
      }else if(correction.draftQuantity!==undefined)scheduleStockCorrection(form);
    }
  }
  function dismissHandover(){if(stockContext.handover)stockContext={};}
  function configureStock(options){config=options;}
  window.caffootStockIntake={configure:configureStock,enter:enterStock,render:renderStock,hydrate:hydrateStockPage,refresh:refreshStock,clear:clearStock,prepareReceipt,openWorkflow:openStockWorkflow,openHandover:openDirectHandover,dismissHandover};
})();
