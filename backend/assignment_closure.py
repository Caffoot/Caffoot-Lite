"""Close an allocation once, with its permanent stock fact and audit record."""
import sqlite3

from backend.stock_schema import normalise_schema_statement, stock_schema_statements

ASSIGNMENT_CLOSURE_COLUMN = (
    "ALTER TABLE device_assignments ADD COLUMN closure_movement_id INTEGER "
    "REFERENCES it_asset_stock_movements(id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED"
)
ASSIGNMENT_CLOSURE_SQL = """
CREATE TRIGGER device_assignment_closed_insert_guard
BEFORE INSERT ON device_assignments BEGIN
 SELECT RAISE(ABORT,'Existing assignment identities cannot be replaced')
 WHERE EXISTS(SELECT 1 FROM device_assignments
              WHERE id=NEW.id OR (device_id=NEW.device_id AND ended_at IS NULL));
 SELECT RAISE(ABORT,'New assignments cannot claim a completed closure')
 WHERE NEW.ended_at IS NOT NULL OR NEW.closure_movement_id IS NOT NULL;
END;
CREATE TRIGGER retain_device_assignment_update
BEFORE UPDATE ON device_assignments BEGIN
 SELECT RAISE(ABORT,'Only one-way audited assignment closure is permitted')
 WHERE OLD.ended_at IS NOT NULL OR OLD.closure_movement_id IS NOT NULL
    OR NEW.ended_at IS NULL OR datetime(NEW.ended_at) IS NULL
    OR NEW.ended_at<OLD.assigned_at
    OR typeof(NEW.closure_movement_id)!='integer' OR NEW.closure_movement_id<=0
    OR NEW.id IS NOT OLD.id OR NEW.device_id IS NOT OLD.device_id
    OR NEW.staff_id IS NOT OLD.staff_id OR NEW.department_id IS NOT OLD.department_id
    OR NEW.recipient_label IS NOT OLD.recipient_label
    OR NEW.assigned_at IS NOT OLD.assigned_at
    OR NEW.actor_id IS NOT OLD.actor_id OR NEW.actor_label IS NOT OLD.actor_label;
 SELECT RAISE(ABORT,'Closure requires a new matching return or write-off entry')
 WHERE NEW.closure_movement_id<=COALESCE((SELECT MAX(id) FROM it_asset_stock_movements),0)
    OR NOT EXISTS(
      SELECT 1 FROM it_asset_stock_entries e
      JOIN it_asset_stock_units u ON u.id=e.stock_unit_id
      WHERE e.movement_id=NEW.closure_movement_id AND e.device_assignment_id=OLD.id
        AND u.device_id=OLD.device_id AND e.quantity=1
        AND (e.from_state IS NULL OR
             (e.from_state='issued' AND e.staff_id IS OLD.staff_id
              AND e.department_id IS OLD.department_id))
        AND e.to_state IN ('awaiting_preparation','written_off'));
 SELECT RAISE(ABORT,'Closure requires an attributed audit record in the operation')
 WHERE NOT EXISTS(
   SELECT 1 FROM inventory_change_history h, json_each(h.record_json,'$.changes') c
   WHERE json_extract(c.value,'$.kind')='IT Assets'
     AND json_extract(c.value,'$.action') IN ('Returned','Written Off')
     AND json_extract(c.value,'$.after.assignmentId')=OLD.id
     AND json_extract(c.value,'$.after.closureMovementId')=NEW.closure_movement_id
     AND json_extract(c.value,'$.after.endedAt')=NEW.ended_at
     AND json_extract(c.value,'$.after.deviceId')=OLD.device_id
     AND json_type(h.record_json,'$.actorId')='integer'
     AND length(trim(json_extract(h.record_json,'$.actor')))>0);
END;
"""


def assignment_schema_objects(connection):
    """Read the allocation table and its explicitly named safeguards."""
    return {name: normalise_schema_statement(sql) for name, sql in connection.execute(
        "SELECT name,sql FROM sqlite_master WHERE tbl_name='device_assignments' AND sql IS NOT NULL")}


def expected_assignment_schema(*, closed, handovers=False):
    """Keep the original migration intact when comparing the approved extension."""
    from backend.schema import migrate_device_assignments
    with sqlite3.connect(':memory:') as reference:
        migrate_device_assignments(reference)
        if closed:
            reference.execute(ASSIGNMENT_CLOSURE_COLUMN)
            reference.execute('DROP TRIGGER retain_device_assignment_update')
            for statement in stock_schema_statements(ASSIGNMENT_CLOSURE_SQL):
                reference.execute(statement)
        if handovers:
            from backend.handover_schema import HANDOVER_COLUMNS, handover_assignment_statements
            for statement in HANDOVER_COLUMNS:
                reference.execute(statement)
            reference.execute('DROP TRIGGER device_assignment_closed_insert_guard')
            reference.execute('DROP TRIGGER retain_device_assignment_update')
            for statement in handover_assignment_statements():
                reference.execute(statement)
        return assignment_schema_objects(reference)


def validate_assignment_closure(connection, *, handovers=None):
    """Reject missing or unexpected closure guards without changing records."""
    if handovers is None:
        handovers = connection.execute('SELECT 1 FROM schema_migrations WHERE version=19').fetchone() is not None
    if assignment_schema_objects(connection) != expected_assignment_schema(closed=True, handovers=handovers):
        raise RuntimeError('Unexpected assignment closure schema; review required')
    if connection.execute('PRAGMA foreign_key_check').fetchone():
        raise RuntimeError('Assignment closure relationships failed verification')


def migrate_assignment_closure(connection):
    """Add the closure reference and retain every original allocation field."""
    if not connection.in_transaction:
        raise RuntimeError('Assignment closure requires the database upgrade transaction')
    if assignment_schema_objects(connection) != expected_assignment_schema(closed=False):
        raise RuntimeError('Unexpected existing assignment schema; review required')
    if connection.execute("SELECT 1 FROM sqlite_master WHERE name='device_assignment_closed_insert_guard'").fetchone():
        raise RuntimeError('Unexpected existing closure object; review required')
    connection.execute(ASSIGNMENT_CLOSURE_COLUMN)
    connection.execute('DROP TRIGGER retain_device_assignment_update')
    for statement in stock_schema_statements(ASSIGNMENT_CLOSURE_SQL):
        connection.execute(statement)
    validate_assignment_closure(connection)
