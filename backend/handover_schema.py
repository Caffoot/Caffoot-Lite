"""Extend canonical assignments for checked handovers without physical receipts."""
from backend.assignment_closure import ASSIGNMENT_CLOSURE_SQL
from backend.stock_schema import STOCK_SCHEMA_SQL, normalise_schema_statement, stock_schema_statements

HANDOVER_COLUMNS = (
    'ALTER TABLE device_assignments ADD COLUMN handover_event_id INTEGER REFERENCES '
    'inventory_change_history(id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED',
    'ALTER TABLE device_assignments ADD COLUMN successor_assignment_id INTEGER REFERENCES '
    'device_assignments(id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED',
)

HANDOVER_ASSIGNMENT_SQL = """
CREATE TRIGGER device_handover_closure_guard BEFORE UPDATE ON device_assignments
WHEN NEW.handover_event_id IS NOT NULL BEGIN
 SELECT RAISE(ABORT,'Only a new audited handover may close this assignment')
 WHERE OLD.ended_at IS NOT NULL OR OLD.closure_movement_id IS NOT NULL OR OLD.handover_event_id IS NOT NULL
   OR OLD.successor_assignment_id IS NOT NULL OR NEW.ended_at IS NULL OR datetime(NEW.ended_at) IS NULL
   OR NEW.ended_at<OLD.assigned_at
   OR typeof(NEW.handover_event_id)!='integer' OR NEW.handover_event_id<=0
   OR typeof(NEW.successor_assignment_id)!='integer'
   OR NEW.successor_assignment_id<=COALESCE((SELECT MAX(id) FROM device_assignments),0)
   OR NEW.id IS NOT OLD.id OR NEW.device_id IS NOT OLD.device_id
   OR NEW.staff_id IS NOT OLD.staff_id OR NEW.department_id IS NOT OLD.department_id
   OR NEW.recipient_label IS NOT OLD.recipient_label OR NEW.assigned_at IS NOT OLD.assigned_at
   OR NEW.actor_id IS NOT OLD.actor_id OR NEW.actor_label IS NOT OLD.actor_label;
 SELECT RAISE(ABORT,'Handover requires attributed preparation and explicit Ready confirmation')
 WHERE NOT EXISTS(
   SELECT 1 FROM inventory_change_history h JOIN inventory_devices d ON d.id=OLD.device_id
   WHERE h.id=NEW.handover_event_id
     AND json_type(h.record_json,'$.actorId')='integer' AND json_extract(h.record_json,'$.actorId')>0
     AND length(trim(json_extract(h.record_json,'$.actor')))>0
     AND json_extract(h.record_json,'$.changes[0].kind')='Device'
     AND json_extract(h.record_json,'$.changes[0].action')='Reassigned'
     AND json_extract(h.record_json,'$.changes[0].after.deviceId')=OLD.device_id
     AND json_extract(h.record_json,'$.changes[0].after.previousAssignmentId')=OLD.id
     AND json_extract(h.record_json,'$.changes[0].after.assignmentId')=NEW.successor_assignment_id
     AND json_extract(h.record_json,'$.changes[0].after.endedAt')=NEW.ended_at
     AND json_extract(h.record_json,'$.changes[0].after.assignedAt')=NEW.ended_at
     AND json_extract(h.record_json,'$.changes[0].after.handedOverOn')=substr(NEW.ended_at,1,10)
     AND json_type(h.record_json,'$.changes[0].after.readyConfirmed')='true'
     AND json_type(h.record_json,'$.changes[0].after.checks.cleanedWorking')='true'
     AND (json_extract(d.record_json,'$.type') IN ('Monitor','Keyboard','Mouse','Docking Station')
          OR json_type(h.record_json,'$.changes[0].after.checks.dataPreparationConfirmed')='true')
     AND coalesce(json_extract(d.record_json,'$.isVirtual'),0)=0
     AND coalesce(json_extract(d.record_json,'$.virtualHostId'),'')=''
     AND coalesce(json_extract(d.record_json,'$.type'),'') NOT IN ('Virtual Machine','Server - Virtual'));
 SELECT RAISE(ABORT,'Outstanding associated equipment prevents handover')
 WHERE EXISTS(
   SELECT 1 FROM device_equipment_associations l JOIN device_assignments a ON a.id=l.device_assignment_id
   JOIN it_asset_stock_entries e ON e.id=l.issue_entry_id OR e.source_issue_entry_id=l.issue_entry_id
   JOIN it_asset_stock_movements m ON m.id=e.movement_id WHERE a.device_id=OLD.device_id
   GROUP BY l.id HAVING sum(e.quantity*((e.to_state IS 'issued')-(e.from_state IS 'issued')))>0);
 SELECT RAISE(ABORT,'Registered custody needs its matching pending transfer; other Devices remain outside stock')
 WHERE (EXISTS(SELECT 1 FROM it_asset_stock_units u JOIN it_asset_stock_entries e ON e.stock_unit_id=u.id
               JOIN it_asset_stock_movements m ON m.id=e.movement_id WHERE u.device_id=OLD.device_id))
       != (NEW.closure_movement_id IS NOT NULL)
   OR (NEW.closure_movement_id IS NOT NULL AND (
       typeof(NEW.closure_movement_id)!='integer'
       OR NEW.closure_movement_id<=COALESCE((SELECT MAX(id) FROM it_asset_stock_movements),0)
       OR NOT EXISTS(SELECT 1 FROM it_asset_stock_entries e JOIN it_asset_stock_units u ON u.id=e.stock_unit_id
         WHERE e.movement_id=NEW.closure_movement_id AND u.device_id=OLD.device_id
           AND e.device_assignment_id=OLD.id AND e.quantity=1 AND e.from_state='issued' AND e.to_state IS NULL
           AND e.staff_id IS OLD.staff_id AND e.department_id IS OLD.department_id)));
END;
CREATE TRIGGER device_handover_successor_guard AFTER INSERT ON device_assignments
WHEN EXISTS(SELECT 1 FROM device_assignments WHERE successor_assignment_id=NEW.id) BEGIN
 SELECT RAISE(ABORT,'The new holder must match the prepared handover and be eligible')
 WHERE NOT EXISTS(
   SELECT 1 FROM device_assignments old JOIN inventory_change_history h ON h.id=old.handover_event_id
   LEFT JOIN staff_members s ON s.id=NEW.staff_id LEFT JOIN departments p ON p.id=NEW.department_id
   WHERE old.successor_assignment_id=NEW.id AND old.device_id=NEW.device_id
     AND NEW.assigned_at=old.ended_at AND NEW.ended_at IS NULL
     AND NEW.actor_id=json_extract(h.record_json,'$.actorId') AND NEW.actor_label=json_extract(h.record_json,'$.actor')
     AND NOT (NEW.staff_id IS old.staff_id AND NEW.department_id IS old.department_id)
     AND ((json_extract(h.record_json,'$.changes[0].after.recipientKind')='staff'
           AND NEW.staff_id=json_extract(h.record_json,'$.changes[0].after.recipientId') AND s.active=1)
       OR (json_extract(h.record_json,'$.changes[0].after.recipientKind')='department'
           AND NEW.department_id=json_extract(h.record_json,'$.changes[0].after.recipientId') AND p.archived=0)));
END;
"""

HANDOVER_AUDIT_SQL = """
CREATE TRIGGER device_handover_audit_no_update BEFORE UPDATE ON inventory_change_history
WHEN EXISTS(SELECT 1 FROM device_assignments WHERE handover_event_id=OLD.id) BEGIN
 SELECT RAISE(ABORT,'Handover preparation and history are permanent');
END;
CREATE TRIGGER device_handover_audit_no_delete BEFORE DELETE ON inventory_change_history
WHEN EXISTS(SELECT 1 FROM device_assignments WHERE handover_event_id=OLD.id) BEGIN
 SELECT RAISE(ABORT,'Handover preparation and history are permanent');
END;
"""

HANDOVER_STOCK_SQL = """
CREATE TRIGGER device_handover_stock_guard BEFORE INSERT ON it_asset_stock_movements
WHEN json_type(NEW.checks_json,'$.directHandover')='true' BEGIN
 SELECT RAISE(ABORT,'A direct handover requires exactly its two canonical custody entries')
 WHERE NEW.kind!='issued' OR (SELECT count(*) FROM it_asset_stock_entries WHERE movement_id=NEW.id)!=2
   OR NOT EXISTS(
     SELECT 1 FROM device_assignments old JOIN device_assignments next ON next.id=old.successor_assignment_id
     JOIN inventory_change_history h ON h.id=old.handover_event_id
     JOIN it_asset_stock_entries outgoing ON outgoing.movement_id=NEW.id
     JOIN it_asset_stock_entries incoming ON incoming.movement_id=NEW.id AND incoming.id!=outgoing.id
     JOIN it_asset_stock_units u ON u.id=outgoing.stock_unit_id
     JOIN it_asset_stock_entries original ON original.id=outgoing.source_issue_entry_id
     WHERE old.closure_movement_id=NEW.id AND old.handover_event_id=json_extract(NEW.checks_json,'$.handoverEventId')
       AND u.device_id=old.device_id AND next.device_id=old.device_id
       AND json_extract(NEW.checks_json,'$.deviceId')=old.device_id
       AND NEW.actor_id=json_extract(h.record_json,'$.actorId') AND NEW.actor_label=json_extract(h.record_json,'$.actor')
       AND NEW.event_date=json_extract(h.record_json,'$.changes[0].after.handedOverOn')
       AND outgoing.device_assignment_id=old.id AND outgoing.from_state='issued' AND outgoing.to_state IS NULL
       AND outgoing.snapshot_json IS original.snapshot_json AND outgoing.quantity=1
       AND incoming.stock_unit_id=outgoing.stock_unit_id AND incoming.stock_item_id IS NULL
       AND incoming.device_assignment_id=next.id AND incoming.from_state IS NULL AND incoming.to_state='issued'
       AND incoming.source_issue_entry_id IS NULL AND incoming.quantity=1);
END;
"""


def handover_assignment_statements():
    """Retain the physical-return guard and add a separately checked closure path."""
    insert, update = list(stock_schema_statements(ASSIGNMENT_CLOSURE_SQL))
    insert = insert.replace('OR NEW.closure_movement_id IS NOT NULL;',
        'OR NEW.closure_movement_id IS NOT NULL OR NEW.handover_event_id IS NOT NULL OR NEW.successor_assignment_id IS NOT NULL;')
    update = update.replace('BEFORE UPDATE ON device_assignments BEGIN',
        'BEFORE UPDATE ON device_assignments WHEN NEW.handover_event_id IS NULL BEGIN').replace(
        'WHERE OLD.ended_at IS NOT NULL', 'WHERE NEW.successor_assignment_id IS NOT NULL OR OLD.ended_at IS NOT NULL', 1)
    return [insert, update, *stock_schema_statements(HANDOVER_ASSIGNMENT_SQL)]


def handover_stock_guard():
    """Permit only an audited pair of issued-custody changes, with no held state."""
    original = next(statement for statement in stock_schema_statements(STOCK_SCHEMA_SQL)
                    if statement.startswith('CREATE TRIGGER it_asset_movements_insert_guard'))
    flag = "json_type(NEW.checks_json,'$.directHandover') IS 'true'"
    return original.replace("(NEW.kind='issued' AND e.source_issue_entry_id IS NOT NULL)",
        "(NEW.kind='issued' AND e.source_issue_entry_id IS NOT NULL AND NOT (" + flag + '))').replace(
        "(NEW.kind='issued' AND e.from_state='ready' AND e.to_state='issued')",
        "(NEW.kind='issued' AND ((e.from_state='ready' AND e.to_state='issued') OR ((" + flag +
        ") AND ((e.from_state='issued' AND e.to_state IS NULL) OR (e.from_state IS NULL AND e.to_state='issued')))))")


def handover_schema_objects(connection):
    return {name: normalise_schema_statement(sql) for name, sql in connection.execute(
        "SELECT name,sql FROM sqlite_master WHERE name GLOB 'device_handover_*' AND sql IS NOT NULL")}


def validate_device_handovers(connection):
    """Fail closed if any handover guard or canonical relationship is unexpected."""
    from backend.assignment_closure import validate_assignment_closure
    from backend.stock_schema import validate_it_asset_stock
    expected = {statement.split()[2]: normalise_schema_statement(statement) for statement in
                [*stock_schema_statements(HANDOVER_ASSIGNMENT_SQL),
                 *stock_schema_statements(HANDOVER_AUDIT_SQL), *stock_schema_statements(HANDOVER_STOCK_SQL)]}
    if handover_schema_objects(connection) != expected:
        raise RuntimeError('Unexpected Device handover schema; review required')
    validate_assignment_closure(connection, handovers=True)
    validate_it_asset_stock(connection, handovers=True)


def migrate_device_handovers(connection):
    """Extend history in the upgrade transaction without inventing assignments or stock."""
    from backend.assignment_closure import validate_assignment_closure
    from backend.stock_schema import validate_it_asset_stock
    if not connection.in_transaction:
        raise RuntimeError('Device handovers require the database upgrade transaction')
    validate_assignment_closure(connection, handovers=False)
    validate_it_asset_stock(connection, handovers=False)
    if handover_schema_objects(connection):
        raise RuntimeError('Unexpected existing Device handover schema; review required')
    for statement in HANDOVER_COLUMNS:
        connection.execute(statement)
    connection.execute('DROP TRIGGER device_assignment_closed_insert_guard')
    connection.execute('DROP TRIGGER retain_device_assignment_update')
    connection.execute('DROP TRIGGER it_asset_movements_insert_guard')
    for statement in [*handover_assignment_statements(), handover_stock_guard(),
                      *stock_schema_statements(HANDOVER_AUDIT_SQL), *stock_schema_statements(HANDOVER_STOCK_SQL)]:
        connection.execute(statement)
    validate_device_handovers(connection)
