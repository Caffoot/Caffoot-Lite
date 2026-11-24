"""Schema 29: one physical custody period with equal Department relationships."""
import re

from backend.assignment_closure import expected_assignment_schema
from backend.equipment_associations import EQUIPMENT_ASSOCIATION_SQL
from backend.handover_schema import handover_stock_guard
from backend.stock_schema import STOCK_SCHEMA_SQL, normalise_schema_statement, stock_schema_statements


DEPARTMENTS_SQL = """
CREATE TABLE device_assignment_departments (
 id INTEGER PRIMARY KEY AUTOINCREMENT CHECK(id>0),
 assignment_id INTEGER NOT NULL REFERENCES device_assignments(id)
   ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED,
 department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
 added_at TEXT NOT NULL CHECK(datetime(added_at) IS NOT NULL),
 added_by INTEGER NOT NULL CHECK(typeof(added_by)='integer' AND added_by>0),
 added_by_label TEXT NOT NULL CHECK(length(trim(added_by_label))>0),
 removed_at TEXT CHECK(removed_at IS NULL OR (datetime(removed_at) IS NOT NULL AND removed_at>=added_at)),
 removed_by INTEGER CHECK(removed_by IS NULL OR (typeof(removed_by)='integer' AND removed_by>0)),
 removed_by_label TEXT CHECK(length(trim(removed_by_label))>0),
 CHECK((removed_at IS NULL)=(removed_by IS NULL) AND (removed_at IS NULL)=(removed_by_label IS NULL))
);
CREATE UNIQUE INDEX device_assignment_department_open
 ON device_assignment_departments(assignment_id,department_id) WHERE removed_at IS NULL;
CREATE INDEX device_assignment_department_lookup
 ON device_assignment_departments(department_id,assignment_id);
CREATE TRIGGER device_assignment_department_insert BEFORE INSERT ON device_assignment_departments BEGIN
 SELECT RAISE(ABORT,'Only new Department relationships can be added')
 WHERE NEW.removed_at IS NOT NULL OR EXISTS(SELECT 1 FROM device_assignment_departments
     WHERE id=NEW.id OR (assignment_id=NEW.assignment_id AND department_id=NEW.department_id AND removed_at IS NULL))
   OR NOT EXISTS(SELECT 1 FROM departments WHERE id=NEW.department_id AND archived=0)
   OR EXISTS(SELECT 1 FROM device_assignments a JOIN inventory_devices d ON d.id=a.device_id
     WHERE a.id=NEW.assignment_id AND (a.staff_id IS NOT NULL OR a.ended_at IS NOT NULL
       OR NEW.added_at<a.assigned_at
       OR (NEW.department_id IS NOT a.department_id AND NOT (
         json_extract(d.record_json,'$.type') IN ('Desktop','Laptop','Printer')
         AND COALESCE(json_extract(d.record_json,'$.isVirtual'),0)=0
         AND COALESCE(json_extract(d.record_json,'$.virtualHostId'),'')=''))));
END;
CREATE TRIGGER device_assignment_department_remove BEFORE UPDATE ON device_assignment_departments BEGIN
 SELECT RAISE(ABORT,'Only attributed removal from current custody is permitted')
 WHERE OLD.removed_at IS NOT NULL OR NEW.removed_at IS NULL
   OR NEW.id IS NOT OLD.id OR NEW.assignment_id IS NOT OLD.assignment_id
   OR NEW.department_id IS NOT OLD.department_id OR NEW.added_at IS NOT OLD.added_at
   OR NEW.added_by IS NOT OLD.added_by OR NEW.added_by_label IS NOT OLD.added_by_label
   OR NOT EXISTS(SELECT 1 FROM device_assignments WHERE id=OLD.assignment_id AND ended_at IS NULL)
   OR NOT EXISTS(SELECT 1 FROM device_assignment_departments
     WHERE assignment_id=OLD.assignment_id AND id!=OLD.id AND removed_at IS NULL);
END;
CREATE TRIGGER device_assignment_department_no_delete BEFORE DELETE ON device_assignment_departments BEGIN
 SELECT RAISE(ABORT,'Department relationship history must be retained');
END;
"""

ASSIGNMENT_INSERT_SQL = """
CREATE TRIGGER device_assignment_department_custody AFTER INSERT ON device_assignments BEGIN
 SELECT RAISE(ABORT,'Expected eligible initial Department relationships')
 WHERE EXISTS(SELECT 1 FROM device_assignment_departments WHERE assignment_id=NEW.id)
   AND (NEW.staff_id IS NOT NULL OR NEW.department_id IS NOT NULL
     OR NOT EXISTS(SELECT 1 FROM inventory_devices d WHERE d.id=NEW.device_id
       AND json_extract(d.record_json,'$.type') IN ('Desktop','Laptop','Printer')
       AND COALESCE(json_extract(d.record_json,'$.isVirtual'),0)=0
       AND COALESCE(json_extract(d.record_json,'$.virtualHostId'),'')='')
     OR EXISTS(SELECT 1 FROM device_assignment_departments r JOIN departments d ON d.id=r.department_id
       WHERE r.assignment_id=NEW.id AND (r.added_at IS NOT NEW.assigned_at OR r.added_by IS NOT NEW.actor_id
         OR r.added_by_label IS NOT NEW.actor_label OR d.archived!=0)));
 INSERT INTO device_assignment_departments(assignment_id,department_id,added_at,added_by,added_by_label)
 SELECT NEW.id,NEW.department_id,NEW.assigned_at,NEW.actor_id,NEW.actor_label WHERE NEW.department_id IS NOT NULL;
 SELECT RAISE(ABORT,'Department custody requires an assigned Department')
 WHERE NEW.staff_id IS NULL AND NOT EXISTS(SELECT 1 FROM device_assignment_departments WHERE assignment_id=NEW.id);
END;
"""

RECIPIENT_SQL = """
 SELECT RAISE(ABORT,'A new custody recipient must match current shared custody and its physical issue')
 WHERE EXISTS(
   SELECT 1 FROM it_asset_stock_entries e LEFT JOIN it_asset_stock_units u ON u.id=e.stock_unit_id
   WHERE e.movement_id=NEW.id AND e.custody_recipient_id IS NOT NULL AND
     ((e.source_issue_entry_id IS NULL AND NOT EXISTS(
       SELECT 1 FROM device_assignments a WHERE a.id=e.custody_recipient_id
         AND a.staff_id IS NULL AND a.ended_at IS NULL AND NEW.kind='issued'
         AND 1<(SELECT count(*) FROM device_assignment_departments
                WHERE assignment_id=a.id AND removed_at IS NULL)
         AND EXISTS(SELECT 1 FROM device_assignment_departments r JOIN departments d ON d.id=r.department_id
                    WHERE r.assignment_id=a.id AND r.removed_at IS NULL AND d.archived=0)))
      OR NOT ((e.device_assignment_id IS e.custody_recipient_id AND u.device_id IS NOT NULL)
        OR (e.device_assignment_id IS NULL AND u.device_id IS NULL AND EXISTS(
          SELECT 1 FROM device_equipment_associations l
          WHERE l.issue_entry_id=coalesce(e.source_issue_entry_id,e.id)
            AND l.device_assignment_id=e.custody_recipient_id)))));
"""

LEGACY_RECIPIENT = "((staff_id IS NOT NULL)!=(department_id IS NOT NULL))"


def assignment_schema():
    expected = expected_assignment_schema(closed=True, handovers=True)
    expected['device_assignments'] = (expected['device_assignments']
        .replace('CREATE TABLE device_assignments', 'CREATE TABLE "device_assignments"')
        .replace('CHECK((staff_id IS NOT NULL) != (department_id IS NOT NULL))',
                 'CHECK(staff_id IS NULL OR department_id IS NULL)'))
    expected['device_assignment_department_custody'] = normalise_schema_statement(
        next(stock_schema_statements(ASSIGNMENT_INSERT_SQL)))
    for name in ('retain_device_assignment_update', 'device_handover_closure_guard'):
        expected[name] = expected[name].replace(
            'e.staff_id IS OLD.staff_id AND e.department_id IS OLD.department_id',
            '(e.custody_recipient_id IS OLD.id OR (e.custody_recipient_id IS NULL '
            'AND e.staff_id IS OLD.staff_id AND e.department_id IS OLD.department_id))')
    expected['device_handover_successor_guard'] = expected['device_handover_successor_guard'].replace(
        'AND NOT (NEW.staff_id IS old.staff_id AND NEW.department_id IS old.department_id)',
        """AND (NEW.staff_id IS NOT old.staff_id OR (
            NEW.staff_id IS NULL AND old.staff_id IS NULL AND (
              EXISTS(SELECT 1 FROM device_assignment_departments r WHERE r.assignment_id=old.id AND r.removed_at IS NULL
                     AND NOT EXISTS(SELECT 1 FROM device_assignment_departments n
                                    WHERE n.assignment_id=NEW.id AND n.department_id=r.department_id)
                     AND r.department_id IS NOT NEW.department_id)
              OR EXISTS(SELECT 1 FROM device_assignment_departments n WHERE n.assignment_id=NEW.id
                        AND NOT EXISTS(SELECT 1 FROM device_assignment_departments r
                           WHERE r.assignment_id=old.id AND r.removed_at IS NULL AND r.department_id=n.department_id))
              OR (NEW.department_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM device_assignment_departments r
                    WHERE r.assignment_id=old.id AND r.removed_at IS NULL AND r.department_id=NEW.department_id)))))""").replace(
        "AND NEW.department_id=json_extract(h.record_json,'$.changes[0].after.recipientId') AND p.archived=0)))",
        """AND NEW.department_id=json_extract(h.record_json,'$.changes[0].after.recipientId') AND p.archived=0)
       OR (json_extract(h.record_json,'$.changes[0].after.recipientKind')='department'
           AND NEW.staff_id IS NULL AND NEW.department_id IS NULL AND
           json_type(h.record_json,'$.changes[0].after.departmentIds')='array' AND
           (SELECT count(*) FROM device_assignment_departments WHERE assignment_id=NEW.id)=
             json_array_length(h.record_json,'$.changes[0].after.departmentIds') AND
           NOT EXISTS(SELECT 1 FROM device_assignment_departments r WHERE r.assignment_id=NEW.id
             AND r.department_id NOT IN (SELECT value FROM json_each(h.record_json,'$.changes[0].after.departmentIds'))))))""")
    return {name: normalise_schema_statement(sql) for name, sql in expected.items()}


def stock_entries_schema():
    original = next(sql for sql in stock_schema_statements(STOCK_SCHEMA_SQL)
                    if sql.startswith('CREATE TABLE it_asset_stock_entries '))
    return (original.replace('CREATE TABLE it_asset_stock_entries', 'CREATE TABLE "it_asset_stock_entries"')
        .replace(" snapshot_json TEXT", " custody_recipient_id INTEGER REFERENCES device_assignments(id) ON DELETE RESTRICT,\n snapshot_json TEXT")
        .replace('THEN ' + LEGACY_RECIPIENT, 'THEN ((' + LEGACY_RECIPIENT + ' AND custody_recipient_id IS NULL)'
                 ' OR (staff_id IS NULL AND department_id IS NULL AND custody_recipient_id IS NOT NULL))')
        .replace('ELSE staff_id IS NULL', 'ELSE custody_recipient_id IS NULL AND staff_id IS NULL'))


def stock_movement_guard():
    return (handover_stock_guard()
        .replace('AND s.device_assignment_id IS e.device_assignment_id',
                 'AND s.custody_recipient_id IS e.custody_recipient_id\n           AND s.device_assignment_id IS e.device_assignment_id')
        .replace('OR (a.staff_id IS e.staff_id AND a.department_id IS e.department_id',
                 'OR ((e.custody_recipient_id IS a.id OR (e.custody_recipient_id IS NULL '
                 'AND a.staff_id IS e.staff_id AND a.department_id IS e.department_id))')
        .replace('AND e.device_assignment_id IS o.device_assignment_id',
                 'AND e.custody_recipient_id IS o.custody_recipient_id\n       AND e.device_assignment_id IS o.device_assignment_id')
        .replace(" SELECT RAISE(ABORT,'Held or written-off", RECIPIENT_SQL + "\n SELECT RAISE(ABORT,'Held or written-off"))


def association_guard():
    original = next(sql for sql in stock_schema_statements(EQUIPMENT_ASSOCIATION_SQL)
                    if sql.startswith('CREATE TRIGGER device_equipment_associations_insert_guard'))
    return (original.replace('JOIN it_asset_stock_movements m', 'LEFT JOIN it_asset_stock_movements m')
        .replace('   LEFT JOIN departments d ON d.id=a.department_id\n', '')
        .replace('''     AND ((a.staff_id IS NOT NULL AND s.active=1)
          OR (a.department_id IS NOT NULL AND d.archived=0))
     AND e.staff_id IS a.staff_id AND e.department_id IS a.department_id
     AND m.kind='issued' AND e.to_state='issued'
     AND e.device_assignment_id IS NULL AND u.device_id IS NULL
     AND (SELECT''', '''     AND e.to_state='issued' AND e.device_assignment_id IS NULL AND u.device_id IS NULL
     AND ((e.custody_recipient_id IS a.id AND m.id IS NULL AND e.source_issue_entry_id IS NULL
           AND e.from_state='ready')
       OR (e.custody_recipient_id IS NULL AND e.staff_id IS a.staff_id AND m.kind='issued'
         AND ((a.staff_id IS NOT NULL AND s.active=1 AND e.department_id IS NULL)
           OR EXISTS(SELECT 1 FROM device_assignment_departments r JOIN departments d ON d.id=r.department_id
                     WHERE r.assignment_id=a.id AND r.removed_at IS NULL AND d.archived=0
                       AND r.department_id=e.department_id))
         AND (SELECT''').replace('OR x.source_issue_entry_id=e.id)>0);',
                                'OR x.source_issue_entry_id=e.id)>0)));'))


def replace_table(connection, table, definition, objects):
    """Copy original columns verbatim and retain any AUTOINCREMENT high-water mark."""
    temporary = table + '_next'
    columns = ','.join(row[1] for row in connection.execute(f'PRAGMA table_info({table})'))
    previous_sequence = connection.execute('SELECT seq FROM sqlite_sequence WHERE name=?', (table,)).fetchone()
    connection.execute(definition.replace(f'CREATE TABLE "{table}"', f'CREATE TABLE {temporary}', 1))
    connection.execute(f'INSERT INTO {temporary} ({columns}) SELECT {columns} FROM {table}')
    for left, right in ((table, temporary), (temporary, table)):
        if connection.execute(f'SELECT {columns} FROM {left} EXCEPT SELECT {columns} FROM {right} LIMIT 1').fetchone():
            raise RuntimeError(f'Schema 29 changed existing {table} records')
    connection.execute(f'DROP TABLE {table}')
    connection.execute(f'ALTER TABLE {temporary} RENAME TO {table}')
    if previous_sequence is not None:
        connection.execute('DELETE FROM sqlite_sequence WHERE name=?', (table,))
        connection.execute('INSERT INTO sqlite_sequence(name,seq) VALUES(?,?)', (table, previous_sequence[0]))
    for statement in objects:
        connection.execute(statement)


def validate_relationships(connection):
    from backend.handover_schema import validate_device_handovers
    from backend.equipment_associations import validate_equipment_associations
    validate_device_handovers(connection, sharing=True)
    validate_equipment_associations(connection, sharing=True)
    expected = {re.match(r'CREATE (?:TABLE|(?:UNIQUE )?INDEX|TRIGGER) (\w+)', sql)[1]:
                normalise_schema_statement(sql) for sql in stock_schema_statements(DEPARTMENTS_SQL)}
    actual = dict(connection.execute('SELECT name,sql FROM sqlite_schema '
        "WHERE tbl_name='device_assignment_departments' AND sql IS NOT NULL"))
    if {name: normalise_schema_statement(sql) for name, sql in actual.items()} != expected:
        raise RuntimeError('Unexpected Department custody schema; review required')
    if connection.execute("""
        SELECT 1 FROM device_assignments a WHERE
          (a.staff_id IS NOT NULL AND EXISTS(SELECT 1 FROM device_assignment_departments r WHERE r.assignment_id=a.id))
          OR (a.staff_id IS NULL AND NOT EXISTS(SELECT 1 FROM device_assignment_departments r
             WHERE r.assignment_id=a.id AND r.removed_at IS NULL))
        LIMIT 1
    """).fetchone():
        raise RuntimeError('Department custody relationships failed verification')


def migrate_shared_devices(connection):
    if not connection.in_transaction or connection.execute('PRAGMA foreign_keys').fetchone()[0]:
        raise RuntimeError('Schema 29 requires the locked SQLite table rebuild transaction')
    if connection.execute('PRAGMA foreign_key_check').fetchone():
        raise RuntimeError('Existing custody relationships failed verification')
    settings = connection.execute('PRAGMA legacy_alter_table').fetchone()[0]
    connection.execute('PRAGMA legacy_alter_table=ON')
    try:
        assignments = assignment_schema()
        assignment_table = assignments.pop('device_assignments')
        department_insert = assignments.pop('device_assignment_department_custody')
        replace_table(connection, 'device_assignments', assignment_table, assignments.values())
        replace_table(connection, 'it_asset_stock_entries', stock_entries_schema(), (
            sql for sql in stock_schema_statements(STOCK_SCHEMA_SQL)
            if (' ON it_asset_stock_entries(' in sql
                or (sql.startswith('CREATE TRIGGER ') and ' ON it_asset_stock_entries BEGIN' in sql))))
        table, *guards = stock_schema_statements(DEPARTMENTS_SQL)
        connection.execute(table)
        connection.execute("""INSERT INTO device_assignment_departments
            (assignment_id,department_id,added_at,added_by,added_by_label)
            SELECT id,department_id,assigned_at,actor_id,actor_label FROM device_assignments WHERE department_id IS NOT NULL""")
        for statement in [*guards, department_insert]:
            connection.execute(statement)
        for name, statement in (('it_asset_movements_insert_guard', stock_movement_guard()),
                                ('device_equipment_associations_insert_guard', association_guard())):
            connection.execute(f'DROP TRIGGER {name}')
            connection.execute(statement)
        validate_relationships(connection)
    finally:
        connection.execute(f'PRAGMA legacy_alter_table={settings}')
