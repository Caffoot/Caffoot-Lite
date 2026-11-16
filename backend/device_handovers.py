"""Reassign one checked canonical Device without inventing a stock receipt."""
from datetime import datetime, timezone

from backend.audit_events import record_actor_event
from backend.permissions import can_access
from backend.sessions import session_account
from backend.equipment_associations import has_outstanding_associated_equipment
from backend.stock_intake import stock_operation, stock_replay, stock_digest, stock_json, stock_text
from backend.stock_circulation import (canonical_device_choice, require_stock_device_edit,
    stock_issue_records, stock_recipient, stock_event_date, preparation_requirements,
    preparation_checks, publish_stock_movement)


def require_handover_access(connection, actor_id, device_id):
    """Devices-only work stays independent; recorded stock also needs Assets Edit."""
    if not can_access(connection, actor_id, 'Devices', edit=True):
        raise PermissionError('Devices Edit is required')
    if not isinstance(device_id,str) or not device_id or len(device_id)>200:
        raise ValueError('Invalid Device identity')
    recorded = connection.execute('''SELECT 1 FROM it_asset_stock_units u
        JOIN it_asset_stock_entries e ON e.stock_unit_id=u.id
        JOIN it_asset_stock_movements m ON m.id=e.movement_id WHERE u.device_id=? LIMIT 1''', (device_id,)).fetchone()
    if recorded and not can_access(connection, actor_id, 'IT Assets', edit=True):
        raise PermissionError('Equipment editing access is required for this reassignment')


def device_handover_source(connection, actor_id, device_id):
    """Resolve current custody and safeguards inside the caller's transaction."""
    require_handover_access(connection, actor_id, device_id)
    choice = canonical_device_choice(connection, device_id)
    if not choice['physical'] or choice['deviceAssignmentId'] is None:
        raise ValueError('Select a currently assigned physical Device for reassignment')
    if has_outstanding_associated_equipment(connection, device_id):
        raise ValueError('This Device is not eligible for reassignment. Complete the required equipment work first.')
    assignment = connection.execute('''SELECT staff_id,department_id,recipient_label,assigned_at
        FROM device_assignments WHERE id=? AND ended_at IS NULL''', (choice['deviceAssignmentId'],)).fetchone()
    original = None
    if choice['states']:
        if choice['states'].get('issued', 0) != 1 or sum(choice['states'].values()) != 1:
            raise ValueError('This Device is not available for a direct handover')
        matches = [issue for issue in stock_issue_records(connection)
                   if issue['deviceAssignmentId'] == choice['deviceAssignmentId'] and issue['outstanding'] == 1]
        if len(matches) != 1 or matches[0]['stockUnitId'] != choice['stockUnitId']:
            raise ValueError('The Device custody record needs review before reassignment')
        original = matches[0]
    return dict(deviceId=device_id, name=choice['name'], deviceAssignmentId=choice['deviceAssignmentId'],
        version=stock_digest([choice['version'], *assignment]), current=assignment,
        preparation=preparation_requirements(choice['category']), category=choice['category'],
        revision=choice['revision'], stockUnitId=choice['stockUnitId'], originalIssue=original)


def device_handover_context(connection, actor_id, device_id):
    """Offer only permitted preparation/Device fields, never hidden stock details."""
    try:
        source = device_handover_source(connection, actor_id, device_id)
    except (PermissionError, ValueError, LookupError):
        return None
    return {key: source[key] for key in ('deviceId', 'name', 'deviceAssignmentId', 'version', 'preparation')}


def reassign_device(connection, actor_id, token, payload):
    """Keep the previous holder unless every prepared handover fact commits together."""
    fields = {'operationId', 'deviceId', 'version', 'recipientKind', 'recipientId',
              'handedOverOn', 'checks', 'readyConfirmed', 'note'}
    operation, digest = stock_operation(payload, fields, fields)
    key = 'equipment:reassign:' + str(actor_id) + ':' + operation
    connection.execute('BEGIN IMMEDIATE')
    try:
        if session_account(connection, token) != actor_id:
            raise PermissionError('Verified session required')
        require_handover_access(connection, actor_id, payload['deviceId'])
        replay = stock_replay(connection, key, digest)
        if replay is not None:
            connection.commit()
            return replay
        require_stock_device_edit(connection, actor_id, payload['deviceId'])
        source = device_handover_source(connection, actor_id, payload['deviceId'])
        if payload['version'] != source['version']:
            raise FileExistsError('Device or current holder changed. Reload before reassigning it.')
        recipient = stock_recipient(connection, payload['recipientKind'], payload['recipientId'])
        if (recipient['staff_id'], recipient['department_id']) == source['current'][:2]:
            raise ValueError('Select a different eligible recipient')
        happened = stock_event_date(payload['handedOverOn'], 'Date Reassigned')
        today = datetime.now(timezone.utc).date().isoformat()
        if happened < source['current'][3][:10] or happened > today:
            raise ValueError('Date Reassigned cannot precede the original issue date or be in the future')
        if payload['readyConfirmed'] is not True:
            raise ValueError('Explicit Ready confirmation is required before reassignment')
        checks = preparation_checks(payload['checks'], requirements=source['preparation'], ready=True)
        note = stock_text(payload['note'], 'Reassignment Note', 2000)
        ended = (datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')
                 if happened == today else happened + 'T23:59:59.999Z')
        next_id = connection.execute('SELECT coalesce(max(id),0)+1 FROM device_assignments').fetchone()[0]
        actor_label = connection.execute('SELECT username FROM accounts WHERE id=?', (actor_id,)).fetchone()[0]
        result = dict(deviceId=source['deviceId'], previousAssignmentId=source['deviceAssignmentId'],
                      assignmentId=next_id, handedOverOn=happened)
        record_actor_event(connection, actor_id, kind='Device', action='Reassigned', label=source['deviceId'],
            reason='Direct Device reassignment after confirmed preparation', fields=['Assignment', 'Preparation'],
            confirmation_id=key, after=dict(operationHash=digest, result=result,
                deviceId=source['deviceId'], previousAssignmentId=source['deviceAssignmentId'], assignmentId=next_id,
                recipientKind=payload['recipientKind'], recipientId=payload['recipientId'], endedAt=ended,
                assignedAt=ended, handedOverOn=happened, readyConfirmed=True, checks=checks, note=note))
        event_id = connection.execute('SELECT last_insert_rowid()').fetchone()[0]
        movement = None
        if source['originalIssue'] is not None:
            original = source['originalIssue']
            movement = connection.execute('SELECT coalesce(max(id),0)+1 FROM it_asset_stock_movements').fetchone()[0]
            snapshot = connection.execute('SELECT snapshot_json FROM it_asset_stock_entries WHERE id=?', (original['id'],)).fetchone()[0]
            connection.execute('''INSERT INTO it_asset_stock_entries
                (movement_id,stock_unit_id,quantity,from_state,to_state,staff_id,department_id,recipient_label,
                 source_issue_entry_id,device_assignment_id,snapshot_json) VALUES(?,?,1,'issued',NULL,?,?,?,?,?,?)''',
                (movement, source['stockUnitId'], original['staffId'], original['departmentId'], original['recipientLabel'],
                 original['id'], source['deviceAssignmentId'], snapshot))
        connection.execute('''UPDATE device_assignments SET ended_at=?,closure_movement_id=?,
            handover_event_id=?,successor_assignment_id=? WHERE id=?''',
            (ended, movement, event_id, next_id, source['deviceAssignmentId']))
        connection.execute('''INSERT INTO device_assignments
            (id,device_id,staff_id,department_id,recipient_label,assigned_at,actor_id,actor_label) VALUES(?,?,?,?,?,?,?,?)''',
            (next_id, source['deviceId'], recipient['staff_id'], recipient['department_id'],
             recipient['recipient_label'], ended, actor_id, actor_label))
        if movement is not None:
            entry = dict(stock_unit_id=source['stockUnitId'], quantity=1, from_state=None, to_state='issued',
                device_assignment_id=next_id, **recipient, snapshot_json=stock_json(dict(name=source['name'],
                    category=source['category'], deviceId=source['deviceId'], deviceRevision=source['revision'])))
            publish_stock_movement(connection, actor_id, key + ':stock', 'issued', [entry],
                dict(directHandover=True, handoverEventId=event_id, deviceId=source['deviceId'],
                     operationHash=digest, result=result, checks=checks, note=note), event_date=happened)
        connection.commit()
        return result
    except BaseException:
        connection.rollback()
        raise
