"""Issue, return and write off equipment without replacing its original history."""
from datetime import date, datetime, timezone
import json

from backend.audit_events import record_actor_event
from backend.device_assignments import assignment_recipients
from backend.stock_intake import (stock_access, stock_item, stock_json, stock_text,
    stock_quantity, stock_operation, stock_replay, stock_write_access, stock_configuration)


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


def stock_recipients(connection, actor, *, query='', kind='staff', limit=50):
    """Offer the same eligible name-only picker under independent stock rights."""
    stock_access(connection, actor, edit=True)
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
    record_actor_event(connection, actor, kind='IT Assets', action=action,
        label=str(details.get('stockItemId') or details.get('deviceId') or 'Equipment'),
        reason=reason or action+' equipment', fields=['Stock Movement'], after={'movementId':movement})
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
        original=json.loads(snapshot)
        result.append(dict(id=identity,stockItemId=item,stockUnitId=unit,quantity=quantity,
            outstanding=outstanding,staffId=staff,departmentId=department,recipientLabel=recipient,
            deviceAssignmentId=assignment,name=original.get('name','Equipment'),specification=original,
            issuedOn=issued,actor=actor,recordedAt=recorded))
    return result


def read_stock_issues(connection, actor):
    stock_access(connection,actor)
    return dict(issues=stock_issue_records(connection))


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
