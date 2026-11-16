"""Register stock as canonical Devices without splitting physical and inventory facts."""
import json
import uuid

from backend.audit_events import record_actor_event
from backend.device_saves import create_device_in_transaction
from backend.permissions import can_access
from backend.stock_intake import (COMPUTER_TYPES, append_stock_fact, stock_item,
    stock_operation, stock_replay, stock_write_access, stock_text, stock_json)
from backend.stock_circulation import (canonical_device_choice, require_stock_device_edit,
    stock_recipient, stock_event_date, publish_stock_movement)


def require_device_stock_access(connection, actor):
    """Both independent editing rights are needed for a stock-to-Device operation."""
    from backend.stock_intake import stock_access
    stock_access(connection, actor, edit=True)
    if not can_access(connection, actor, 'Devices', edit=True):
        raise PermissionError('Devices Edit and IT Assets Edit are required')


def registration_source_ready(item):
    return (item['trackingMode'] == 'quantity' and item['category'] in COMPUTER_TYPES
            and item['quantityStateBalances'].get('ready', 0) > 0)


def device_stock_sources(connection, actor):
    """Offer only compatible, unregistered Ready stock and common specifications."""
    require_device_stock_access(connection, actor)
    sources = []
    for identity, in connection.execute('SELECT id FROM it_asset_stock_items ORDER BY name,id'):
        item = stock_item(connection, identity)
        if not registration_source_ready(item):
            continue
        details = dict(item['sharedSpecifications'])
        if 'storageMedium' in details:
            details['storageType'] = details.pop('storageMedium')
        sources.append(dict(id=identity, name=item['name'], version=item['version'],
            ready=item['quantityStateBalances']['ready'],
            prefill=dict(type=item['category'], manufacturer=item['manufacturer'],
                         model=item['model'], typeDetails=details)))
    return {'sources': sources}


def validate_registration_identity(connection, record, item):
    """A shared batch must never create a duplicate or virtual Device identity."""
    if (not isinstance(record, dict) or record.get('type') != item['category']
            or record.get('isVirtual') or record.get('virtualHostId')):
        raise ValueError('Choose stock compatible with this physical Device Type')
    name = record.get('name')
    serial = record.get('serialNumber', '')
    if (not isinstance(name, str) or not name.strip()
            or not isinstance(serial, str)):
        raise ValueError('Enter a unique Device Name; Serial Number is optional')
    for raw, in connection.execute('SELECT record_json FROM inventory_devices'):
        existing = json.loads(raw)
        if str(existing.get('name', '')).strip().casefold() == name.strip().casefold():
            raise FileExistsError('A Device with this name already exists')
        if serial.strip() and str(existing.get('serialNumber', '')).strip().casefold() == serial.strip().casefold():
            raise FileExistsError('A Device with this Serial Number already exists')


def register_stock_device(connection, actor, token, payload):
    """Transfer one quantity unit into one held Device in the normal save transaction."""
    fields = {'operationId', 'stockItemId', 'version', 'record'}
    operation, digest = stock_operation(payload, fields, fields)
    key = 'stock:register:' + str(actor) + ':' + operation
    connection.execute('BEGIN IMMEDIATE')
    try:
        stock_write_access(connection, actor, token)
        require_device_stock_access(connection, actor)
        replay = stock_replay(connection, key, digest)
        if replay is not None:
            connection.commit()
            return replay
        item = stock_item(connection, payload['stockItemId'])
        if payload['version'] != item['version']:
            raise FileExistsError('Stock changed. Reload Get From Stock and select the item again.')
        if not registration_source_ready(item):
            raise ValueError('The selected item has no compatible unregistered Ready stock available')
        record = payload['record']
        validate_registration_identity(connection, record, item)
        revision = create_device_in_transaction(connection, actor, record)
        unit = uuid.uuid4().hex
        connection.execute('INSERT INTO it_asset_stock_units(id,stock_item_id,device_id) VALUES(?,?,?)',
                           (unit, item['id'], record['id']))
        movement = connection.execute('SELECT coalesce(max(id),0)+1 FROM it_asset_stock_movements').fetchone()[0]
        result = dict(deviceId=record['id'], revision=revision, stockUnitId=unit,
                      stockItemId=item['id'], movementId=movement)
        append_stock_fact(connection, actor, key, 'registered', item,
            [(item['id'], 1, 'ready', None), (unit, 1, None, 'ready')],
            dict(operationHash=digest, result=result, deviceId=record['id']))
        record_actor_event(connection, actor, kind='IT Assets', action='Registered',
            label=record['id'], reason='Registered Device from Ready stock',
            fields=['Stock Movement'], after=dict(stockItemId=item['id'], deviceId=record['id'], movementId=movement))
        connection.commit()
        return result
    except BaseException:
        connection.rollback()
        raise


def device_ready_for_reissue(choice):
    """Only a genuine held Ready unit can leave stock through a new assignment."""
    states = choice['states']
    return (choice['physical'] and choice['stockUnitId'] is not None
            and choice['deviceAssignmentId'] is None and states.get('ready', 0) == 1
            and sum(states.get(state, 0) for state in
                    ('ready', 'awaiting_checks', 'awaiting_preparation')) == 1
            and not states.get('issued', 0) and not states.get('written_off', 0))


def reissue_device_choices(connection, actor):
    require_device_stock_access(connection, actor)
    return {'devices': [choice for identity, in connection.execute(
        'SELECT id FROM inventory_devices ORDER BY name,id')
        if device_ready_for_reissue(choice := canonical_device_choice(connection, identity))]}


def reissue_stock_device(connection, actor, token, payload):
    """Keep the original Device and commit its new assignment and physical issue together."""
    fields = {'operationId', 'deviceId', 'version', 'recipientKind', 'recipientId', 'issuedOn', 'note'}
    operation, digest = stock_operation(payload, fields, fields)
    key = 'stock:reissue:' + str(actor) + ':' + operation
    connection.execute('BEGIN IMMEDIATE')
    try:
        stock_write_access(connection, actor, token)
        require_device_stock_access(connection, actor)
        replay = stock_replay(connection, key, digest)
        if replay is not None:
            connection.commit()
            return replay
        device_id = payload['deviceId']
        require_stock_device_edit(connection, actor, device_id)
        choice = canonical_device_choice(connection, device_id)
        if payload['version'] != choice['version']:
            raise FileExistsError('Device or stock history changed. Reload before reissuing it.')
        if not device_ready_for_reissue(choice):
            raise ValueError('Choose an unassigned physical Device recorded as held and Ready To Issue')
        recipient = stock_recipient(connection, payload['recipientKind'], payload['recipientId'])
        issued = stock_event_date(payload['issuedOn'], 'Date Issued')
        note = stock_text(payload['note'], 'Issue Note', 2000)
        actor_label = connection.execute('SELECT username FROM accounts WHERE id=?', (actor,)).fetchone()[0]
        assignment = connection.execute('''INSERT INTO device_assignments
            (device_id,staff_id,department_id,recipient_label,assigned_at,actor_id,actor_label)
            VALUES(?,?,?,?,?,?,?)''', (device_id, recipient['staff_id'], recipient['department_id'],
                recipient['recipient_label'], issued, actor, actor_label)).lastrowid
        record_actor_event(connection, actor, kind='Device', action='Assigned', label=device_id,
            reason='Reissued equipment', fields=['Assignment'],
            after=dict(recipientKind=payload['recipientKind'], recipientId=payload['recipientId'], assignedAt=issued))
        entry = dict(stock_unit_id=choice['stockUnitId'], quantity=1, from_state='ready',
            to_state='issued', device_assignment_id=assignment, **recipient,
            snapshot_json=stock_json(dict(name=choice['name'], category=choice['category'],
                                         deviceId=device_id, deviceRevision=choice['revision'])))
        movement = connection.execute('SELECT coalesce(max(id),0)+1 FROM it_asset_stock_movements').fetchone()[0]
        result = dict(deviceId=device_id, assignmentId=assignment, movementId=movement)
        publish_stock_movement(connection, actor, key, 'issued', [entry],
            dict(operationHash=digest, result=result, deviceId=device_id, note=note), event_date=issued)
        connection.commit()
        return result
    except BaseException:
        connection.rollback()
        raise
