"""Issue, return and write off equipment without replacing its original history."""
from datetime import date, datetime, timezone
import json

from backend.audit_events import record_actor_event
from backend.device_assignments import assignment_recipients
from backend.permissions import can_access
from backend.stock_intake import (stock_access, stock_item, stock_json, stock_text,
    stock_quantity, stock_operation, stock_replay, stock_write_access, stock_configuration,
    stock_digest)


def stock_event_date(value, label):
    if not isinstance(value, str):
        raise ValueError('Enter a valid '+label)
    try:
        valid = date.fromisoformat(value).isoformat() == value
    except ValueError:
        valid = False
    if not valid:
        raise ValueError('Enter a valid '+label)
    return value


def stock_recipients(connection, actor, *, query='', kind='staff', limit=50, identity=None):
    """Offer the same eligible name-only picker under independent stock rights."""
    stock_access(connection, actor, edit=True)
    if identity is not None:
        if query or not isinstance(identity,str) or not identity or len(identity)>200:
            raise ValueError('Invalid recipient selection')
        recipient=stock_recipient(connection,kind,identity)
        return [dict(id=identity,label=recipient['recipient_label'],kind=kind)]
    return assignment_recipients(connection, actor, query=query, kind=kind, limit=limit, section='IT Assets')


def stock_recipient(connection, kind, identity):
    if kind not in ('staff', 'department') or not isinstance(identity, str) or not identity:
        raise ValueError('Choose an eligible Staff Member or Department')
    if kind == 'staff':
        row = connection.execute("SELECT trim(first_name||' '||last_name),active FROM staff_members WHERE id=?", (identity,)).fetchone()
    else:
        row = connection.execute('SELECT name,1-archived FROM departments WHERE id=?', (identity,)).fetchone()
    if row is None or not row[1]:
        raise ValueError('An active Staff Member or non-archived Department is required')
    return dict(staff_id=identity if kind == 'staff' else None,
                department_id=identity if kind == 'department' else None,
                recipient_label=row[0] or 'Name Not Recorded')


def stock_movement_snapshot(item, unit=None):
    snapshot = {**stock_configuration(item), 'name': item['name']}
    if unit:
        snapshot.update(stockUnitId=unit['id'], serialNumber=unit.get('serialNumber'), assetTag=unit.get('assetTag'))
    return stock_json(snapshot)


def publish_stock_movement(connection, actor, key, kind, entries, details, *, event_date, reason='', closures=()):
    """Publish all transfers, their audit and any allocation closure together."""
    movement = connection.execute('SELECT coalesce(max(id),0)+1 FROM it_asset_stock_movements').fetchone()[0]
    for entry in entries:
        values = dict(entry, movement_id=movement)
        columns = list(values)
        connection.execute('INSERT INTO it_asset_stock_entries('+','.join(columns)+') VALUES('+','.join('?' for _ in columns)+')',
                           [values[column] for column in columns])
    action = {'issued':'Issued', 'returned':'Returned', 'written_off':'Written Off', 'readiness_changed':'Prepared'}[kind]
    audit_details = {'movementId': movement}
    if details.get('physicalReturnConfirmed') is True:
        audit_details.update(deviceId=details['deviceId'], returnedOn=event_date,
                             physicalReturnConfirmed=True, returnOrigin='unassigned_device')
    record_actor_event(connection, actor, kind='IT Assets', action=action,
        label=str(details.get('stockItemId') or details.get('deviceId') or 'Equipment'),
        reason=reason or action+' equipment', fields=['Stock Movement'], after=audit_details)
    for assignment, device_id in closures:
        ended = datetime.now(timezone.utc).isoformat().replace('+00:00','Z')
        record_actor_event(connection, actor, kind='IT Assets', action=action, label=device_id,
            reason=reason or action+' equipment', fields=['Assignment'],
            after=dict(assignmentId=assignment, closureMovementId=movement, deviceId=device_id, endedAt=ended))
        connection.execute('UPDATE device_assignments SET ended_at=?,closure_movement_id=? WHERE id=?',
                           (ended,movement,assignment))
    label = connection.execute('SELECT username FROM accounts WHERE id=?', (actor,)).fetchone()[0]
    connection.execute('''INSERT INTO it_asset_stock_movements
        (id,operation_key,kind,event_date,actor_id,actor_label,reason,checks_json) VALUES(?,?,?,?,?,?,?,?)''',
        (movement,key,kind,event_date,actor,label,reason,stock_json(details)))
    return movement


def stock_issue_records(connection, *, staff_id=None, department_id=None):
    """Resolve outstanding quantities from the original issue and its transfers."""
    result=[]
    for row in connection.execute('''SELECT e.id,e.stock_item_id,e.stock_unit_id,e.quantity,
        e.staff_id,e.department_id,e.recipient_label,e.device_assignment_id,e.snapshot_json,
        m.event_date,m.actor_label,m.recorded_at,
        (SELECT coalesce(sum(x.quantity*((x.to_state IS 'issued')-(x.from_state IS 'issued'))),0)
         FROM it_asset_stock_entries x JOIN it_asset_stock_movements closed ON closed.id=x.movement_id
         WHERE x.id=e.id OR x.source_issue_entry_id=e.id)
        FROM it_asset_stock_entries e JOIN it_asset_stock_movements m ON m.id=e.movement_id
        WHERE m.kind='issued' AND e.to_state='issued' ORDER BY e.id DESC'''):
        (identity,item,unit,quantity,staff,department,recipient,assignment,snapshot,issued,actor,recorded,outstanding)=row
        if staff_id is not None and staff!=staff_id or department_id is not None and department!=department_id:
            continue
        original={key:value for key,value in json.loads(snapshot).items() if key in (
            'name','category','manufacturer','model','sharedSpecifications','stockUnitId','serialNumber','assetTag')}
        latest=connection.execute('SELECT coalesce(max(movement_id),0) FROM it_asset_stock_entries WHERE id=? OR source_issue_entry_id=?', (identity,identity)).fetchone()[0]
        result.append(dict(id=identity,stockItemId=item,stockUnitId=unit,quantity=quantity,
            outstanding=outstanding,staffId=staff,departmentId=department,recipientLabel=recipient,
            deviceAssignmentId=assignment,name=original.get('name','Equipment'),specification=original,
            issuedOn=issued,actor=actor,recordedAt=recorded,version=stock_digest([identity,outstanding,latest])))
    return result


def read_stock_issues(connection, actor):
    stock_access(connection,actor)
    devices=can_access(connection,actor,'Devices')
    issues=stock_issue_records(connection)
    if not devices:
        issues=[issue for issue in issues if not issue['deviceAssignmentId']]
    assignments=[]
    choices=[]
    if devices:
        for identity, in connection.execute('''SELECT a.id FROM device_assignments a WHERE a.ended_at IS NULL
            AND NOT EXISTS(SELECT 1 FROM it_asset_stock_entries e JOIN it_asset_stock_movements m ON m.id=e.movement_id
                WHERE e.device_assignment_id=a.id AND m.kind='issued') ORDER BY a.id DESC'''):
            assignments.append(legacy_device_issue(connection,identity))
        for identity, in connection.execute('SELECT id FROM inventory_devices ORDER BY name,id'):
            choice=canonical_device_choice(connection,identity)
            if choice['physical']:
                choices.append(choice)
    return dict(issues=issues,deviceAssignments=assignments,
                registeredDevices=registered_stock_devices(connection) if devices else [],
                deviceChoices=choices)


def issue_stock(connection, actor, token, payload):
    """Issue only selected ready stock to an eligible recipient under the write lock."""
    fields={'operationId','stockItemId','version','quantity','stockUnitIds','recipientKind','recipientId','issuedOn','note'}
    operation,digest=stock_operation(payload,fields,fields-{'stockUnitIds'})
    key='stock:issue:'+str(actor)+':'+operation
    connection.execute('BEGIN IMMEDIATE')
    try:
        stock_write_access(connection,actor,token)
        replay=stock_replay(connection,key,digest)
        if replay is not None:
            connection.commit()
            return replay
        item=stock_item(connection,payload['stockItemId'])
        if payload['version']!=item['version']:
            raise FileExistsError('Stock changed. Reload the selected item before issuing equipment.')
        quantity=stock_quantity(payload['quantity'],'Quantity To Issue',1)
        if quantity>item['balances']['readyToIssue']:
            raise ValueError('Quantity To Issue exceeds this item’s Ready To Issue balance')
        recipient=stock_recipient(connection,payload['recipientKind'],payload['recipientId'])
        issued=stock_event_date(payload['issuedOn'],'Date Issued')
        note=stock_text(payload['note'],'Issue Note',2000)
        if item['trackingMode']=='quantity':
            if quantity>item['quantityStateBalances'].get('ready',0):
                raise ValueError('Quantity To Issue exceeds this item’s unregistered Ready balance')
            if 'stockUnitIds' in payload:
                raise ValueError('Quantity stock does not accept individual selections')
            entries=[dict(stock_item_id=item['id'],quantity=quantity)]
        else:
            selected=payload.get('stockUnitIds')
            if (not isinstance(selected,list) or any(not isinstance(identity,str) for identity in selected)
                    or len(selected)!=quantity or len(set(selected))!=quantity):
                raise ValueError('Select each individual unit to issue')
            available={unit['id']:unit for unit in item['units'] if unit['ready'] and not unit['deviceLinked']}
            if set(selected)-available.keys():
                raise ValueError('Selected equipment is unavailable or requires the Device reissue workflow')
            entries=[dict(stock_unit_id=identity,quantity=1,
                          snapshot_json=stock_movement_snapshot(item,available[identity])) for identity in selected]
        for entry in entries:
            entry.update(recipient,from_state='ready',to_state='issued')
            entry.setdefault('snapshot_json',stock_movement_snapshot(item))
        movement=connection.execute('SELECT coalesce(max(id),0)+1 FROM it_asset_stock_movements').fetchone()[0]
        result=dict(stockItemId=item['id'],movementId=movement,issuedQuantity=quantity)
        publish_stock_movement(connection,actor,key,'issued',entries,
            dict(operationHash=digest,result=result,stockItemId=item['id'],note=note),event_date=issued)
        connection.commit()
        return result
    except BaseException:
        connection.rollback()
        raise


def stock_unit_states(connection, identity):
    states={}
    for quantity,old,new in connection.execute('''SELECT e.quantity,e.from_state,e.to_state
        FROM it_asset_stock_entries e JOIN it_asset_stock_movements m ON m.id=e.movement_id
        WHERE e.stock_unit_id=? ORDER BY e.id''',(identity,)):
        for state,delta in ((old,-quantity),(new,quantity)):
            if state is not None:
                states[state]=states.get(state,0)+delta
    return states


def registered_stock_devices(connection):
    """Project only actual journalled Device units, using canonical identifiers."""
    result=[]
    for unit,device_id,name,raw,revision,stock_item_id in connection.execute('''SELECT u.id,d.id,d.name,d.record_json,d.revision,u.stock_item_id
        FROM it_asset_stock_units u JOIN inventory_devices d ON d.id=u.device_id
        WHERE EXISTS(SELECT 1 FROM it_asset_stock_entries e JOIN it_asset_stock_movements m ON m.id=e.movement_id
                     WHERE e.stock_unit_id=u.id) ORDER BY d.name,d.id'''):
        record=json.loads(raw)
        states=stock_unit_states(connection,unit)
        latest=connection.execute('SELECT coalesce(max(movement_id),0) FROM it_asset_stock_entries WHERE stock_unit_id=?',(unit,)).fetchone()[0]
        result.append(dict(stockUnitId=unit,stockItemId=stock_item_id,deviceId=device_id,name=name,category=record.get('type',''),
            manufacturer=record.get('manufacturer',''),model=record.get('model',''),
            serialNumber=record.get('serialNumber',''),assetTag=record.get('assetTag',''),states=states,
            version=stock_digest([unit,latest,revision]),preparation=preparation_requirements(record.get('type',''))))
    return result


def legacy_device_issue(connection, identity):
    if type(identity) is not int or identity<1:
        raise ValueError('Invalid original Device assignment')
    row=connection.execute('''SELECT a.id,a.device_id,a.staff_id,a.department_id,a.recipient_label,
        a.assigned_at,d.name,d.record_json,d.revision FROM device_assignments a
        JOIN inventory_devices d ON d.id=a.device_id WHERE a.id=? AND a.ended_at IS NULL''',(identity,)).fetchone()
    if row is None:
        raise LookupError('Outstanding Device assignment not found')
    assignment,device_id,staff,department,label,assigned,name,raw,revision=row
    record=json.loads(raw)
    unit=connection.execute('SELECT id FROM it_asset_stock_units WHERE device_id=?',(device_id,)).fetchone()
    return dict(id=assignment,deviceId=device_id,staffId=staff,departmentId=department,
        recipientLabel=label,issuedOn=assigned[:10],quantity=1,outstanding=1,name=name,
        category=record.get('type',''),stockUnitId=unit[0] if unit else None,
        version=stock_digest([assignment,revision,assigned,unit[0] if unit else None]),
        preparation=preparation_requirements(record.get('type','')))


def preparation_requirements(category):
    """Use the approved checks without treating every reset as a factory reset."""
    if category in ('Desktop','Laptop','Server - Physical'):
        return dict(dataConfirmationRequired=True,dataCheckLabel='Data Wiped / Reset',
                    workingCheckLabel='Checked Working',requiresWipe=True)
    if category=='Printer':
        return dict(dataConfirmationRequired=True,
            dataCheckLabel='Stored Documents, Credentials And User Data Cleared Where Applicable',
            workingCheckLabel='Cleaned And Checked Working',requiresWipe=False)
    if category in ('Monitor','Keyboard','Mouse','Docking Station'):
        return dict(dataConfirmationRequired=False,dataCheckLabel='',
                    workingCheckLabel='Cleaned And Checked Working',requiresWipe=False)
    return dict(dataConfirmationRequired=True,
        dataCheckLabel='Applicable Preparation Completed, Including Data Clearing Where Needed',
        workingCheckLabel='Working And Condition Checked',requiresWipe=False)


def preparation_checks(value, *, requirements, ready):
    if not isinstance(value,dict) or set(value)!={'cleanedWorking','dataPreparationConfirmed'} or any(type(v) is not bool for v in value.values()):
        raise ValueError('Confirm the applicable equipment checks')
    if ready and (not value['cleanedWorking'] or requirements['dataConfirmationRequired'] and not value['dataPreparationConfirmed']):
        raise ValueError('Complete the working/condition check and confirm: '+requirements['dataCheckLabel'])
    return dict(value,workingCheckLabel=requirements['workingCheckLabel'],dataCheckLabel=requirements['dataCheckLabel'])


def require_stock_device_edit(connection, actor, device_id):
    if not can_access(connection,actor,'Devices',edit=True):
        raise PermissionError('Devices Edit and IT Assets Edit are required')
    if not isinstance(device_id,str) or not device_id or len(device_id)>200:
        raise ValueError('Invalid Device identity')
    if connection.execute("SELECT 1 FROM device_edit_reservations WHERE device_id=? AND expires_at>strftime('%s','now')",(device_id,)).fetchone():
        raise FileExistsError('Device is being edited; try again after editing finishes')


def return_stock(connection, actor, token, payload):
    """Keep partial returns and every checked/damaged disposition in one transaction."""
    fields={'operationId','issueEntryId','deviceAssignmentId','deviceId','physicalReturnConfirmed',
            'version','quantityReturned','readyQuantity','writeOffQuantity','returnedOn','checks','writeOffReason','note'}
    required=fields-{'issueEntryId','deviceAssignmentId','deviceId','physicalReturnConfirmed'}
    operation,digest=stock_operation(payload,fields,required)
    direct_device = 'deviceId' in payload
    if sum(field in payload for field in ('issueEntryId','deviceAssignmentId','deviceId')) != 1:
        raise ValueError('Select one original issue, assignment or unassigned Device')
    if direct_device:
        if payload.get('physicalReturnConfirmed') is not True:
            raise ValueError('Confirm that this Device has been physically returned to stock')
    elif 'physicalReturnConfirmed' in payload:
        raise ValueError('Physical-return provenance applies only to an unassigned Device')
    key='stock:return:'+str(actor)+':'+operation
    connection.execute('BEGIN IMMEDIATE')
    try:
        stock_write_access(connection,actor,token)
        if direct_device and not can_access(connection,actor,'Devices',edit=True):
            raise PermissionError('Devices Edit and IT Assets Edit are required')
        replay=stock_replay(connection,key,digest)
        if replay is not None:
            connection.commit()
            return replay
        closures=[]
        device_id=None
        if direct_device:
            device_id=payload['deviceId']
            require_stock_device_edit(connection,actor,device_id)
            source=canonical_device_choice(connection,device_id)
            if payload['version']!=source['version']:
                raise FileExistsError('Device or stock history changed. Reload before returning it.')
            if not source['canReturnUnassigned']:
                raise ValueError('Select an unassigned physical Device without existing stock history')
            if source['stockUnitId'] is None:
                import uuid
                source['stockUnitId']=uuid.uuid4().hex
                connection.execute('INSERT INTO it_asset_stock_units(id,device_id) VALUES(?,?)',
                                   (source['stockUnitId'],device_id))
            entry=dict(stock_unit_id=source['stockUnitId'],quantity=1,from_state=None)
            snapshot=dict(name=source['name'],category=source['category'],deviceId=device_id,
                          deviceRevision=source['revision'])
            requirements=preparation_requirements(source['category'])
        elif 'deviceAssignmentId' in payload:
            if not can_access(connection,actor,'Devices',edit=True):
                raise PermissionError('Devices Edit and IT Assets Edit are required')
            source=legacy_device_issue(connection,payload['deviceAssignmentId'])
            device_id=source['deviceId']
            require_stock_device_edit(connection,actor,device_id)
            if source['stockUnitId'] is None:
                import uuid
                source['stockUnitId']=uuid.uuid4().hex
                connection.execute('INSERT INTO it_asset_stock_units(id,device_id) VALUES(?,?)',(source['stockUnitId'],device_id))
            elif connection.execute('SELECT 1 FROM it_asset_stock_entries WHERE stock_unit_id=? LIMIT 1',(source['stockUnitId'],)).fetchone():
                raise FileExistsError('Use the original stock issue for this Device')
            entry=dict(stock_unit_id=source['stockUnitId'],quantity=1,from_state=None,
                       device_assignment_id=source['id'])
            snapshot=dict(name=source['name'],category=source['category'],deviceId=device_id,
                originalAssignmentId=source['id'],recipientLabel=source['recipientLabel'],issuedOn=source['issuedOn'])
            closures=[(source['id'],device_id)]
            requirements=source['preparation']
        else:
            identity=payload['issueEntryId']
            if type(identity) is not int or identity<1:
                raise ValueError('Invalid original issue reference')
            source=next((row for row in stock_issue_records(connection) if row['id']==identity),None)
            if source is None:
                raise LookupError('Original stock issue not found')
            if source['outstanding']<1:
                raise ValueError('This issue has no outstanding equipment')
            snapshot=dict(source['specification'],originalIssueEntryId=identity)
            entry={('stock_item_id' if source['stockItemId'] else 'stock_unit_id'):
                source['stockItemId'] or source['stockUnitId'],
                'from_state':'issued','source_issue_entry_id':identity,'staff_id':source['staffId'],
                'department_id':source['departmentId'],'recipient_label':source['recipientLabel']}
            if source['deviceAssignmentId']:
                device_id=connection.execute('SELECT device_id FROM it_asset_stock_units WHERE id=?',(source['stockUnitId'],)).fetchone()[0]
                require_stock_device_edit(connection,actor,device_id)
                entry['device_assignment_id']=source['deviceAssignmentId']
                closures=[(source['deviceAssignmentId'],device_id)]
            requirements=preparation_requirements(snapshot.get('category',''))
        if payload['version']!=source['version']:
            raise FileExistsError('Outstanding equipment changed. Reload the issue before returning it.')
        returned=stock_quantity(payload['quantityReturned'],'Quantity Returned',1)
        ready=stock_quantity(payload['readyQuantity'],'Cleaned & Checked — Ready To Issue')
        damaged=stock_quantity(payload['writeOffQuantity'],'Damaged — Write Off')
        if direct_device and (returned!=1 or ready!=0 or damaged!=0):
            raise ValueError('An unassigned Device returns as one unit Awaiting Preparation')
        if returned>(1 if direct_device else source['outstanding']) or ready+damaged>returned:
            raise ValueError('Return dispositions cannot exceed Returned or the outstanding issue quantity')
        if source.get('stockUnitId') and returned!=1:
            raise ValueError('An individual unit must return as its one permanent identity')
        returned_on=stock_event_date(payload['returnedOn'],'Date Returned')
        if direct_device and returned_on>datetime.now(timezone.utc).date().isoformat():
            raise ValueError('Date Returned cannot be in the future')
        if not direct_device and returned_on<source['issuedOn']:
            raise ValueError('Date Returned cannot precede the original issue date')
        checks=preparation_checks(payload['checks'],requirements=requirements,ready=ready)
        reason=stock_text(payload['writeOffReason'],'Damaged / Write-Off Reason',2000,required=damaged>0)
        note=stock_text(payload['note'],'Return Note',2000)
        entry.update(quantity=returned,to_state='awaiting_preparation',snapshot_json=stock_json(snapshot))
        first=connection.execute('SELECT coalesce(max(id),0)+1 FROM it_asset_stock_movements').fetchone()[0]
        result=dict(returnMovementId=first,readinessMovementId=first+1 if ready else None,
            writeOffMovementId=first+1+bool(ready) if damaged else None,
            returnedQuantity=returned,readyQuantity=ready,writtenOffQuantity=damaged,
            awaitingQuantity=returned-ready-damaged)
        details=dict(operationHash=digest,result=result,stockItemId=source.get('stockItemId'),deviceId=device_id,
            sourceIssueEntryId=source['id'] if 'issueEntryId' in payload else None,
            originalAssignmentId=closures[0][0] if closures else None,
            checks=checks,note=note,returnedQuantity=returned,readyQuantity=ready,writtenOffQuantity=damaged)
        if direct_device:
            details.update(physicalReturnConfirmed=True,returnOrigin='unassigned_device',
                           deviceRevision=source['revision'])
        publish_stock_movement(connection,actor,key,'returned',[entry],details,event_date=returned_on,closures=closures)
        for amount,kind,state,suffix in ((ready,'readiness_changed','ready','ready'),(damaged,'written_off','written_off','writeoff')):
            if not amount:
                continue
            transfer={k:v for k,v in entry.items() if k in ('stock_item_id','stock_unit_id','snapshot_json','device_assignment_id')}
            transfer.update(quantity=amount,from_state='awaiting_preparation',to_state=state)
            publish_stock_movement(connection,actor,key+':'+suffix,kind,[transfer],
                dict(returnMovementId=first,checks=checks,note=note,sourceIssueEntryId=details['sourceIssueEntryId']),
                event_date=returned_on,reason=reason if kind=='written_off' else '')
        connection.commit()
        return result
    except BaseException:
        connection.rollback()
        raise


def prepare_stock(connection, actor, token, payload):
    """Confirm returned equipment ready without recording another physical receipt."""
    fields={'operationId','stockItemId','stockUnitId','version','quantity','stockUnitIds','checkedOn','checks','note'}
    operation,digest=stock_operation(payload,fields,fields-{'stockItemId','stockUnitId','stockUnitIds'})
    if ('stockItemId' in payload)==('stockUnitId' in payload):
        raise ValueError('Select one stock item or registered Device')
    key='stock:prepare:'+str(actor)+':'+operation
    connection.execute('BEGIN IMMEDIATE')
    try:
        stock_write_access(connection,actor,token)
        replay=stock_replay(connection,key,digest)
        if replay is not None:
            connection.commit()
            return replay
        quantity=stock_quantity(payload['quantity'],'Quantity Newly Checked & Ready',1)
        entries=[]
        if 'stockUnitId' in payload:
            if not can_access(connection,actor,'Devices',edit=True):
                raise PermissionError('Devices Edit and IT Assets Edit are required')
            item=next((row for row in registered_stock_devices(connection) if row['stockUnitId']==payload['stockUnitId']),None)
            if not item:
                raise LookupError('Registered stock Device not found')
            require_stock_device_edit(connection,actor,item['deviceId'])
            if quantity!=1 or item['states'].get('awaiting_preparation',0)!=1:
                raise ValueError('This Device is not awaiting preparation')
            requirements=item['preparation']
            entries=[dict(stock_unit_id=item['stockUnitId'],quantity=1,
                          snapshot_json=stock_json(dict(name=item['name'],category=item['category'],deviceId=item['deviceId'])))]
        else:
            item=stock_item(connection,payload['stockItemId'])
            requirements=preparation_requirements(item['category'])
            if item['trackingMode']=='quantity':
                available=stock_state_balance(connection,'stock_item_id',item['id'],'awaiting_preparation')
                if 'stockUnitIds' in payload or quantity>available:
                    raise ValueError('Quantity exceeds this item’s Awaiting Preparation balance')
                entries=[dict(stock_item_id=item['id'],quantity=quantity,snapshot_json=stock_movement_snapshot(item))]
            else:
                selected=payload.get('stockUnitIds')
                available={unit['id']:unit for unit in item['units'] if unit['balances'].get('awaiting_preparation',0)==1 and not unit['deviceLinked']}
                if (not isinstance(selected,list) or any(not isinstance(identity,str) for identity in selected)
                        or len(selected)!=quantity or len(set(selected))!=quantity or set(selected)-available.keys()):
                    raise ValueError('Select the individual equipment awaiting preparation')
                entries=[dict(stock_unit_id=identity,quantity=1,snapshot_json=stock_movement_snapshot(item,available[identity])) for identity in selected]
        if item['version']!=payload['version']:
            raise FileExistsError('Stock changed. Reload before confirming preparation.')
        checks=preparation_checks(payload['checks'],requirements=requirements,ready=quantity)
        checked=stock_event_date(payload['checkedOn'],'Date Checked')
        note=stock_text(payload['note'],'Preparation Note',2000)
        for entry in entries:
            entry.update(from_state='awaiting_preparation',to_state='ready')
        movement=connection.execute('SELECT coalesce(max(id),0)+1 FROM it_asset_stock_movements').fetchone()[0]
        result=dict(readinessMovementId=movement,quantity=quantity)
        publish_stock_movement(connection,actor,key,'readiness_changed',entries,
            dict(operationHash=digest,result=result,checks=checks,note=note,stockItemId=item.get('id'),deviceId=item.get('deviceId')),
            event_date=checked)
        connection.commit()
        return result
    except BaseException:
        connection.rollback()
        raise


def stock_state_balance(connection, column, identity, state):
    if column not in ('stock_item_id','stock_unit_id'):
        raise ValueError('Invalid stock identity kind')
    return connection.execute('''SELECT coalesce(sum(e.quantity*((e.to_state IS ?)-(e.from_state IS ?))),0)
        FROM it_asset_stock_entries e JOIN it_asset_stock_movements m ON m.id=e.movement_id
        WHERE e.'''+column+'=?',(state,state,identity)).fetchone()[0]


def canonical_device_choice(connection, identity):
    if not isinstance(identity,str) or not identity or len(identity)>200:
        raise ValueError('Invalid Device identity')
    row=connection.execute('SELECT name,record_json,revision FROM inventory_devices WHERE id=?',(identity,)).fetchone()
    if row is None:
        raise LookupError('Device not found')
    name,raw,revision=row
    record=json.loads(raw)
    unit=connection.execute('SELECT id FROM it_asset_stock_units WHERE device_id=?',(identity,)).fetchone()
    states=stock_unit_states(connection,unit[0]) if unit else {}
    assignment=connection.execute('SELECT id FROM device_assignments WHERE device_id=? AND ended_at IS NULL',(identity,)).fetchone()
    latest=connection.execute('SELECT coalesce(max(movement_id),0) FROM it_asset_stock_entries WHERE stock_unit_id=?',
                             (unit[0] if unit else None,)).fetchone()[0]
    physical=not (record.get('isVirtual') or record.get('virtualHostId') or record.get('type') in ('Virtual Machine','Server - Virtual'))
    return dict(deviceId=identity,name=name,category=record.get('type',''),physical=physical,revision=revision,
        canReturnUnassigned=physical and assignment is None and latest==0,
        stockUnitId=unit[0] if unit else None,states=states,deviceAssignmentId=assignment[0] if assignment else None,
        version=stock_digest([identity,revision,unit[0] if unit else None,latest,assignment[0] if assignment else None]))


def write_off_stock(connection, actor, token, payload):
    """Write off a real item once, preserving its identity and any original holder."""
    fields={'operationId','stockItemId','stockUnitIds','issueEntryId','deviceId','version',
            'quantity','fromState','writtenOffOn','reason','note'}
    operation,digest=stock_operation(payload,fields,fields-{'stockItemId','stockUnitIds','issueEntryId','deviceId'})
    if sum(key in payload for key in ('stockItemId','issueEntryId','deviceId'))!=1:
        raise ValueError('Select one stock item, issued individual item or canonical Device')
    key='stock:writeoff:'+str(actor)+':'+operation
    connection.execute('BEGIN IMMEDIATE')
    try:
        stock_write_access(connection,actor,token)
        replay=stock_replay(connection,key,digest)
        if replay is not None:
            connection.commit()
            return replay
        quantity=stock_quantity(payload['quantity'],'Quantity To Write Off',1)
        written=stock_event_date(payload['writtenOffOn'],'Date Written Off')
        reason=stock_text(payload['reason'],'Write-Off Reason',2000,required=True)
        note=stock_text(payload['note'],'Write-Off Note',2000)
        state=payload['fromState']
        closures=[]
        device_id=None
        item_id=None
        if 'deviceId' in payload:
            device_id=payload['deviceId']
            require_stock_device_edit(connection,actor,device_id)
            item=canonical_device_choice(connection,device_id)
            if not item['physical'] or quantity!=1 or item['states'].get('written_off',0):
                raise ValueError('Select an available physical Device that has not been written off')
            if item['version']!=payload['version']:
                raise FileExistsError('Device changed. Reload before writing it off.')
            if item['deviceAssignmentId']:
                source=legacy_device_issue(connection,item['deviceAssignmentId'])
                if written<source['issuedOn']:
                    raise ValueError('Date Written Off cannot precede the original issue')
                closures=[(source['id'],device_id)]
            if item['stockUnitId'] is None:
                import uuid
                item['stockUnitId']=uuid.uuid4().hex
                connection.execute('INSERT INTO it_asset_stock_units(id,device_id) VALUES(?,?)',(item['stockUnitId'],device_id))
            entries=[dict(stock_unit_id=item['stockUnitId'],quantity=1,
                snapshot_json=stock_json(dict(name=item['name'],category=item['category'],deviceId=device_id)))]
            if not item['states']:
                if state!='unrecorded':
                    raise ValueError('This Device has no recorded physical stock balance')
                entries[0]['from_state']=None
            elif state=='issued':
                source=next((row for row in stock_issue_records(connection) if row['deviceAssignmentId']==item['deviceAssignmentId'] and row['outstanding']==1),None)
                if source is None:
                    raise ValueError('Original issued Device stock reference not found')
                entries[0].update(from_state='issued',source_issue_entry_id=source['id'],
                    staff_id=source['staffId'],department_id=source['departmentId'],recipient_label=source['recipientLabel'])
            elif state in ('ready','awaiting_checks','awaiting_preparation') and item['states'].get(state,0)==1:
                entries[0]['from_state']=state
            else:
                raise ValueError('The Device is not held in the selected state')
            if closures:
                entries[0]['device_assignment_id']=closures[0][0]
        elif 'issueEntryId' in payload:
            identity=payload['issueEntryId']
            if type(identity) is not int or identity<1:
                raise ValueError('Invalid original issue')
            source=next((row for row in stock_issue_records(connection) if row['id']==identity),None)
            if source is None or source['stockUnitId'] is None or source['outstanding']!=1 or quantity!=1 or state!='issued':
                raise ValueError('Select one outstanding individually identified issue')
            if source['version']!=payload['version']:
                raise FileExistsError('The outstanding issue changed. Reload before writing it off.')
            if written<source['issuedOn']:
                raise ValueError('Date Written Off cannot precede the original issue')
            if source['deviceAssignmentId']:
                device_id=connection.execute('SELECT device_id FROM it_asset_stock_units WHERE id=?',(source['stockUnitId'],)).fetchone()[0]
                require_stock_device_edit(connection,actor,device_id)
                closures=[(source['deviceAssignmentId'],device_id)]
            entries=[dict(stock_unit_id=source['stockUnitId'],quantity=1,from_state='issued',
                source_issue_entry_id=source['id'],staff_id=source['staffId'],department_id=source['departmentId'],
                recipient_label=source['recipientLabel'],snapshot_json=stock_json(source['specification']))]
            if source['deviceAssignmentId']:
                entries[0]['device_assignment_id']=source['deviceAssignmentId']
        else:
            item=stock_item(connection,payload['stockItemId'])
            item_id=item['id']
            if item['version']!=payload['version']:
                raise FileExistsError('Stock changed. Reload before writing it off.')
            if state not in ('ready','awaiting_checks','awaiting_preparation'):
                raise ValueError('Select the correct physically held state')
            if item['trackingMode']=='quantity':
                if 'stockUnitIds' in payload or quantity>stock_state_balance(connection,'stock_item_id',item['id'],state):
                    raise ValueError('Quantity exceeds this item’s selected held balance')
                entries=[dict(stock_item_id=item['id'],quantity=quantity,from_state=state,snapshot_json=stock_movement_snapshot(item))]
            else:
                selected=payload.get('stockUnitIds')
                available={unit['id']:unit for unit in item['units'] if unit['balances'].get(state,0)==1 and not unit['deviceLinked']}
                if (not isinstance(selected,list) or any(not isinstance(identity,str) for identity in selected)
                        or len(selected)!=quantity or len(set(selected))!=quantity or set(selected)-available.keys()):
                    raise ValueError('Select each individual unit in the stated held condition')
                entries=[dict(stock_unit_id=identity,quantity=1,from_state=state,
                    snapshot_json=stock_movement_snapshot(item,available[identity])) for identity in selected]
        for entry in entries:
            entry['to_state']='written_off'
        movement=connection.execute('SELECT coalesce(max(id),0)+1 FROM it_asset_stock_movements').fetchone()[0]
        result=dict(writeOffMovementId=movement,quantity=quantity)
        publish_stock_movement(connection,actor,key,'written_off',entries,
            dict(operationHash=digest,result=result,note=note,stockItemId=item_id,deviceId=device_id),
            event_date=written,reason=reason,closures=closures)
        connection.commit()
        return result
    except BaseException:
        connection.rollback()
        raise


def stock_movement_history(connection, actor, *, staff_id=None, department_id=None, device_id=None):
    """Project real journal facts without request digests, private fields or hidden Devices."""
    stock_access(connection,actor)
    device_access=can_access(connection,actor,'Devices')
    if device_id is not None and not device_access:
        raise PermissionError('Devices Read permission required')
    events=[]
    for row in connection.execute('''SELECT m.id,m.kind,m.event_date,m.recorded_at,m.actor_label,m.reason,
        m.supplier_name,m.checks_json,e.id,e.quantity,e.from_state,e.to_state,e.staff_id,e.department_id,
        COALESCE(e.recipient_label,a.recipient_label),e.source_issue_entry_id,e.snapshot_json,u.device_id,e.stock_item_id,u.stock_item_id
        FROM it_asset_stock_movements m JOIN it_asset_stock_entries e ON e.movement_id=m.id
        LEFT JOIN it_asset_stock_units u ON u.id=e.stock_unit_id
        LEFT JOIN device_assignments a ON a.id=e.device_assignment_id ORDER BY m.id DESC,e.id'''):
        (movement,kind,happened,recorded,actor_label,reason,supplier,details,entry,quantity,old,new,
         staff,department,holder,source,snapshot,device,item,unit_item)=row
        if device and not device_access or device_id is not None and device!=device_id:
            continue
        if (staff_id is not None or department_id is not None) and device:
            continue
        metadata=json.loads(details)
        original_source=metadata.get('sourceIssueEntryId')
        if source is None and type(original_source) is int:
            source=original_source
            linked=connection.execute('SELECT staff_id,department_id,recipient_label FROM it_asset_stock_entries WHERE id=?',(source,)).fetchone()
            if linked:
                staff,department,holder=linked
        if staff_id is not None and staff!=staff_id or department_id is not None and department!=department_id:
            continue
        original=json.loads(snapshot)
        events.append(dict(id=movement,entryId=entry,kind=kind,date=happened,recordedAt=recorded,
            actor=actor_label,reason=reason,supplier=supplier,quantity=quantity,fromState=old,toState=new,
            sourceIssueEntryId=source,recipientLabel=holder,name=original.get('name','Equipment'),
            stockItemId=item or unit_item,deviceId=device,
            checks=metadata.get('checks'),note=metadata.get('note',metadata.get('notes',''))))
        if metadata.get('physicalReturnConfirmed') is True:
            events[-1].update(physicalReturnConfirmed=True,returnOrigin='unassigned_device')
    return events
