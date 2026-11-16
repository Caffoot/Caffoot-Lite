"""Preview and append reasoned quantity corrections to the permanent stock journal."""
from collections import defaultdict
from datetime import datetime, timezone
import json

from backend.audit_events import record_actor_event
from backend.stock_intake import (MAX_QUANTITY, stock_access, stock_digest, stock_json,
    stock_operation, stock_quantity, stock_replay, stock_text, stock_write_access)
from backend.stock_circulation import require_stock_device_edit


def correction_source(connection, actor, entry_id):
    """Resolve one original entry, keeping individual identities and linked rights intact."""
    stock_access(connection, actor, edit=True)
    if type(entry_id) is not int or entry_id < 1:
        raise ValueError('Select an original movement entry')
    cursor = connection.execute('''SELECT e.*,m.kind,m.event_date,m.recorded_at,
        m.actor_id,m.actor_label,m.supplier_name,u.device_id
        FROM it_asset_stock_entries e JOIN it_asset_stock_movements m ON m.id=e.movement_id
        LEFT JOIN it_asset_stock_units u ON u.id=e.stock_unit_id WHERE e.id=?''', (entry_id,))
    row = cursor.fetchone()
    if row is None:
        raise LookupError('Original movement entry not found')
    source = dict(zip([column[0] for column in cursor.description], row))
    if source['kind'] not in ('received', 'issued', 'returned', 'written_off'):
        raise ValueError('Select a Received, Issued, Returned or Written Off entry')
    issue = entry_id if source['to_state'] == 'issued' else source['source_issue_entry_id']
    links = connection.execute('''SELECT a.id,a.device_id,a.ended_at
        FROM device_equipment_associations l JOIN device_assignments a ON a.id=l.device_assignment_id
        WHERE l.issue_entry_id=?''', (issue,)).fetchall()
    for device in {source['device_id'], *(row[1] for row in links)} - {None}:
        require_stock_device_edit(connection, actor, device)
    source['associations'] = links
    source['issue_id'] = issue
    previous = connection.execute('''SELECT corrected_quantity FROM it_asset_stock_movements
        WHERE corrects_entry_id=? ORDER BY id DESC LIMIT 1''', (entry_id,)).fetchone()
    source['effective_quantity'] = previous[0] if previous else source['quantity']
    return source


def correction_version(connection):
    """Invalidate an open form when stock, Device custody or explicit links change."""
    latest = connection.execute('SELECT coalesce(max(id),0) FROM it_asset_stock_movements').fetchone()[0]
    assignments = connection.execute('''SELECT id,device_id,ended_at,closure_movement_id,
        handover_event_id,successor_assignment_id FROM device_assignments ORDER BY id''').fetchall()
    devices = connection.execute('SELECT id,revision FROM inventory_devices ORDER BY id').fetchall()
    links = connection.execute('SELECT id,device_assignment_id,issue_entry_id FROM device_equipment_associations ORDER BY id').fetchall()
    return stock_digest([latest, assignments, devices, links])


def replay_corrected_stock(connection, source, quantity):
    """Check every later transfer in publication order without writing preview records."""
    states = defaultdict(lambda: defaultdict(int))
    assignments = defaultdict(int)
    groups = defaultdict(list)
    for row in connection.execute('''SELECT e.id,e.movement_id,e.stock_item_id,e.stock_unit_id,
        e.from_state,e.to_state,e.source_issue_entry_id,coalesce(
          (SELECT c.corrected_quantity FROM it_asset_stock_movements c
           WHERE c.corrects_entry_id=e.id ORDER BY c.id DESC LIMIT 1),e.quantity)
        FROM it_asset_stock_entries e JOIN it_asset_stock_movements m ON m.id=e.movement_id
        WHERE m.kind!='corrected' ORDER BY m.id,e.id'''):
        groups[row[1]].append(row)
    for movement, entries in groups.items():
        touched = set()
        for entry, _, item, unit, old, new, issue, effective in entries:
            amount = quantity if entry == source['id'] else effective
            subject = ('unit', unit) if unit else ('item', item)
            touched.add(subject)
            for state, delta in ((old, -amount), (new, amount)):
                if state is not None:
                    states[subject][state] += delta
            if old == 'issued' or new == 'issued':
                assignments[issue or entry] += amount * ((new == 'issued') - (old == 'issued'))
        # A direct handover publishes both custody entries together. Check their
        # combined effect, so it never appears to create a second physical unit.
        for subject in touched:
            values = states[subject]
            maximum = 1 if subject[0] == 'unit' else MAX_QUANTITY
            held = sum(values[key] for key in ('ready', 'awaiting_checks', 'awaiting_preparation'))
            if (any(value < 0 or value > maximum for value in values.values())
                    or not 0 <= held <= maximum
                    or subject[0] == 'unit' and not 0 <= sum(values.values()) <= 1):
                raise ValueError(f'Movement {movement} would have an impossible stock balance. '
                                 'Later readiness, registration and movement records must remain valid.')
        if any(value < 0 or value > MAX_QUANTITY for value in assignments.values()):
            raise ValueError(f'Movement {movement} would exceed its original issue quantity. '
                             'Later returns, write-offs and assignments must remain valid.')
    if any(ended is not None for _, _, ended in source['associations']) and assignments[source['issue_id']] > 0:
        raise ValueError('This correction would reopen associated equipment after its Device assignment ended. '
                         'The recorded return and subsequent handover must remain valid.')
    subject = ('unit', source['stock_unit_id']) if source['stock_unit_id'] else ('item', source['stock_item_id'])
    values = dict(states[subject])
    # Quantity stock and its registered Devices share the catalogue totals.
    if subject[0] == 'item':
        for unit, in connection.execute('SELECT id FROM it_asset_stock_units WHERE stock_item_id=?', (subject[1],)):
            for key, value in states[('unit', unit)].items():
                values[key] = values.get(key, 0) + value
    balances = dict(physicallyHeld=sum(values.get(key, 0) for key in ('ready', 'awaiting_checks', 'awaiting_preparation')),
        readyToIssue=values.get('ready', 0),
        awaitingChecks=values.get('awaiting_checks', 0) + values.get('awaiting_preparation', 0),
        awaitingPreparation=values.get('awaiting_preparation', 0),
        currentlyIssued=values.get('issued', 0), writtenOff=values.get('written_off', 0))
    if any(value > MAX_QUANTITY for value in balances.values()):
        raise ValueError('Calculated stock exceeds the supported whole-number range')
    return dict(balances=balances, outstanding=assignments.get(source['issue_id']) if source['issue_id'] else None)


def stock_correction_context(connection, actor, entry_id):
    """Show original facts, the effective quantity and each attributed correction."""
    source = correction_source(connection, actor, entry_id)
    history = [dict(id=identity, previousQuantity=previous, correctedQuantity=corrected,
                    reason=reason, actor=label, actorId=actor_id, date=happened, recordedAt=recorded)
        for identity, previous, corrected, reason, label, actor_id, happened, recorded in connection.execute('''
            SELECT id,previous_quantity,corrected_quantity,reason,actor_label,actor_id,event_date,recorded_at
            FROM it_asset_stock_movements WHERE corrects_entry_id=? ORDER BY id DESC''', (entry_id,))]
    snapshot = json.loads(source['snapshot_json'])
    return dict(entryId=entry_id, movementId=source['movement_id'], kind=source['kind'],
        originalQuantity=source['quantity'], effectiveQuantity=source['effective_quantity'],
        actor=source['actor_label'], actorId=source['actor_id'], date=source['event_date'],
        recordedAt=source['recorded_at'], supplier=source['supplier_name'],
        recipientLabel=source['recipient_label'] or snapshot.get('recipientLabel'),
        sourceIssueEntryId=source['source_issue_entry_id'], deviceAssignmentId=source['device_assignment_id'],
        stockUnitId=source['stock_unit_id'], deviceId=source['device_id'],
        name=snapshot.get('name', 'Equipment'), specification=snapshot,
        fromState=source['from_state'], toState=source['to_state'],
        history=history, version=correction_version(connection),
        before=replay_corrected_stock(connection, source, source['effective_quantity']))


def validate_stock_correction(connection, actor, payload):
    """Use the same protected calculation for preview and the final atomic save."""
    source = correction_source(connection, actor, payload['entryId'])
    version = correction_version(connection)
    if payload['version'] != version:
        raise FileExistsError('Stock or assignment history changed. Reload the movement and preview again.')
    before = replay_corrected_stock(connection, source, source['effective_quantity'])
    result = dict(allowed=False, version=version, before=before, after=None)
    try:
        quantity = stock_quantity(payload['correctedQuantity'], 'Corrected Quantity', 1)
        reason = stock_text(payload['reason'], 'Reason For Correction', 2000, required=True)
        if quantity == source['effective_quantity']:
            raise ValueError('No change: enter a quantity different from the current effective quantity.')
        if source['stock_unit_id'] is not None:
            raise ValueError('Individually tracked equipment must retain its one permanent identity. '
                             'A quantity correction cannot create, remove or replace a Device or individual unit.')
        result['after'] = replay_corrected_stock(connection, source, quantity)
        result.update(allowed=True, message='Ready To Save: all subsequent movements and original issue balances remain valid.')
    except ValueError as exc:
        result['message'] = 'Correction Blocked: ' + str(exc)
    return source, result


def preview_stock_correction(connection, actor, token, payload):
    """Read a consistent preview without inserting entries, audit or operation records."""
    fields = {'entryId', 'version', 'correctedQuantity', 'reason'}
    if not isinstance(payload, dict) or set(payload) != fields:
        raise ValueError('Invalid correction preview request')
    connection.execute('BEGIN')
    try:
        stock_write_access(connection, actor, token)
        return validate_stock_correction(connection, actor, payload)[1]
    finally:
        connection.rollback()


def save_stock_correction(connection, actor, token, payload):
    """Revalidate and append the compensating entry, immutable header and audit together."""
    fields = {'operationId', 'entryId', 'version', 'correctedQuantity', 'reason'}
    operation, digest = stock_operation(payload, fields, fields)
    key = 'stock:correct:' + str(actor) + ':' + operation
    connection.execute('BEGIN IMMEDIATE')
    try:
        stock_write_access(connection, actor, token)
        # Recheck cross-feature rights even when retrying a completed correction.
        correction_source(connection, actor, payload['entryId'])
        repeated = stock_replay(connection, key, digest)
        if repeated is not None:
            connection.commit()
            return repeated
        source, preview = validate_stock_correction(connection, actor, payload)
        if not preview['allowed']:
            raise ValueError(preview['message'])
        quantity = payload['correctedQuantity']
        previous = source['effective_quantity']
        movement = connection.execute('SELECT coalesce(max(id),0)+1 FROM it_asset_stock_movements').fetchone()[0]
        entry = {key: source[key] for key in ('stock_item_id', 'stock_unit_id', 'staff_id',
            'department_id', 'recipient_label', 'device_assignment_id', 'snapshot_json')}
        entry.update(movement_id=movement, quantity=abs(quantity-previous),
            from_state=source['from_state'] if quantity > previous else source['to_state'],
            to_state=source['to_state'] if quantity > previous else source['from_state'],
            source_issue_entry_id=source['id'] if source['to_state'] == 'issued' else source['source_issue_entry_id'])
        columns = list(entry)
        connection.execute('INSERT INTO it_asset_stock_entries('+','.join(columns)+') VALUES('+','.join('?' for _ in columns)+')',
                           [entry[column] for column in columns])
        result = dict(correctionId=movement, entryId=source['id'], originalMovementId=source['movement_id'],
                      previousQuantity=previous, correctedQuantity=quantity, **preview['after'])
        label = connection.execute('SELECT username FROM accounts WHERE id=?', (actor,)).fetchone()[0]
        reason = payload['reason'].strip()
        connection.execute('''INSERT INTO it_asset_stock_movements
            (id,operation_key,kind,event_date,actor_id,actor_label,reason,checks_json,
             corrects_entry_id,previous_quantity,corrected_quantity)
            VALUES(?,?,'corrected',?,?,?,?,?,?,?,?)''',
            (movement, key, datetime.now(timezone.utc).date().isoformat(), actor, label, reason,
             stock_json(dict(operationHash=digest, result=result)), source['id'], previous, quantity))
        record_actor_event(connection, actor, kind='IT Assets', action='Corrected',
            label=str(source['movement_id']), reason=reason, fields=['Stock Movement Quantity'],
            before=dict(entryId=source['id'], quantity=previous),
            after=dict(entryId=source['id'], originalMovementId=source['movement_id'],
                       correctionId=movement, quantity=quantity), confirmation_id=key)
        connection.commit()
        return result
    except BaseException:
        connection.rollback()
        raise
