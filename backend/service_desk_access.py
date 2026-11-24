"""Resolve the two ticket audiences against live permissions and custody."""
from backend.permissions import can_access, feature_enabled
from backend.role_policy import SERVICE_DESK_SECTION, evaluate_role_policy
from backend.stock_circulation import stock_issue_records

EQUIPMENT_COLUMNS = {
    'device': ('inventory_devices', 'device_id', 'Devices'),
    'stockUnit': ('it_asset_stock_units', 'stock_unit_id', 'IT Assets'),
    'stockItem': ('it_asset_stock_items', 'stock_item_id', 'IT Assets'),
}

# Each movement is committed as one operation. A return or correction that
# leaves zero outstanding ends access to that period's conversations, even
# when a subsequent correction increases the balance on the same issue.
STOCK_ASSIGNMENT_CONTINUES = """
    NOT EXISTS (
        SELECT 1 FROM (
            SELECT entry.movement_id,
                   SUM(SUM(entry.quantity *
                       ((entry.to_state IS 'issued') - (entry.from_state IS 'issued'))))
                       OVER (ORDER BY entry.movement_id) AS balance
            FROM it_asset_stock_entries entry
            JOIN it_asset_stock_movements movement ON movement.id=entry.movement_id
            WHERE entry.id=ticket.stock_issue_id OR entry.source_issue_entry_id=ticket.stock_issue_id
            GROUP BY entry.movement_id
        ) WHERE movement_id>=ticket.stock_movement_at_creation AND balance<=0
    )
"""


def linked_ticket_staff(connection, actor_id):
    """Get the current Staff identity through its saved link to this account."""
    return connection.execute(
        """SELECT id,department_id FROM staff_members WHERE account_id=? AND active=1""",
        (actor_id,),
    ).fetchone()


def device_recipient_filter(scope):
    if scope == 'personal':
        return 'a.staff_id=?'
    return """EXISTS(SELECT 1 FROM device_assignment_departments r
        WHERE r.assignment_id=a.id AND r.department_id=? AND r.removed_at IS NULL)"""


def ticket_scope_filter(connection, actor_id, scope, *, edit=False):
    """Return the same audience filter for counts, search, details and writes."""
    policy = evaluate_role_policy(connection, actor_id)
    if not policy.active or (policy.requires_mfa and not policy.mfa_enrolled):
        raise PermissionError('An active account with the required sign-in protection is needed.')
    if scope == 'it':
        if not policy.allows(SERVICE_DESK_SECTION, edit=edit):
            raise PermissionError('Service Desk permission required.')
        return (
            '((ticket.device_id IS NOT NULL AND ?) OR (ticket.device_id IS NULL AND ?))',
            tuple(policy.allows(section) and feature_enabled(connection, section)
                  for section in ('Devices', 'IT Assets')),
        )
    if scope not in ('personal', 'department'):
        raise ValueError('Invalid ticket scope.')
    staff = linked_ticket_staff(connection, actor_id)
    if staff is None or (scope == 'department' and staff[1] is None):
        return '0', ()
    recipient = 'staff_id' if scope == 'personal' else 'department_id'
    identity = staff[0] if scope == 'personal' else staff[1]
    return (
        f"""(
            (? AND EXISTS(SELECT 1 FROM device_assignments a
                           WHERE a.id=ticket.device_assignment_id AND a.ended_at IS NULL
                             AND {device_recipient_filter(scope)}))
            OR (? AND EXISTS(SELECT 1 FROM it_asset_stock_entries issue
                             WHERE issue.id=ticket.stock_issue_id AND issue.{recipient}=?)
                  AND {STOCK_ASSIGNMENT_CONTINUES})
        )""",
        (feature_enabled(connection, 'Devices'), identity,
         feature_enabled(connection, 'IT Assets'), identity),
    )


def ticket_equipment_for_creation(connection, actor_id, scope, kind, equipment_id, issue_id):
    """Resolve canonical equipment and record exactly the assignment seen now."""
    ticket_scope_filter(connection, actor_id, scope, edit=True)
    if not isinstance(kind, str) or kind not in EQUIPMENT_COLUMNS:
        raise ValueError('Select a Device or IT Asset.')
    if not isinstance(equipment_id, str) or not equipment_id or len(equipment_id) > 200:
        raise ValueError('Select a Device or IT Asset.')
    if issue_id is not None and (type(issue_id) is not int or not 0 < issue_id <= 2**63 - 1):
        raise ValueError('Invalid IT Asset issue.')
    table, column, section = EQUIPMENT_COLUMNS[kind]
    if not feature_enabled(connection, section) or (scope == 'it' and not can_access(connection, actor_id, section)):
        raise LookupError('Equipment not found.')
    restrictions = {'device': '', 'stockUnit': 'AND device_id IS NULL',
                    'stockItem': "AND tracking_mode='quantity'"}
    if not connection.execute(f'SELECT 1 FROM {table} WHERE id=? {restrictions[kind]}', (equipment_id,)).fetchone():
        raise LookupError('Equipment not found.')

    staff = linked_ticket_staff(connection, actor_id)
    if scope != 'it' and (staff is None or (scope == 'department' and staff[1] is None)):
        raise LookupError('Equipment not found.')
    recipient_key = 'staffId' if scope == 'personal' else 'departmentId'
    recipient = None if scope == 'it' else staff[0 if scope == 'personal' else 1]
    assignment_id = movement_id = employee_id = None
    if kind == 'device':
        if issue_id is not None:
            raise ValueError('A Device uses its own assignment record.')
        filter_sql, params = ('', ()) if scope == 'it' else (
            'AND ' + device_recipient_filter(scope), (recipient,))
        assignment = connection.execute(
            f'''SELECT a.id,a.staff_id FROM device_assignments a
                WHERE a.device_id=? AND a.ended_at IS NULL {filter_sql}''',
            (equipment_id, *params),
        ).fetchone()
        if scope != 'it' and assignment is None:
            raise LookupError('Equipment not found.')
        if assignment:
            assignment_id, employee_id = assignment
    else:
        issue_field = 'stockUnitId' if kind == 'stockUnit' else 'stockItemId'
        choices = [issue for issue in stock_issue_records(connection)
                   if issue[issue_field] == equipment_id and issue['outstanding'] > 0
                   and issue['deviceAssignmentId'] is None
                   and (scope == 'it' or issue[recipient_key] == recipient)
                   and (issue_id is None or issue['id'] == issue_id)]
        if len(choices) > 1:
            raise ValueError('Select the specific issue for this IT Asset.')
        if not choices and (scope != 'it' or issue_id is not None):
            raise LookupError('Equipment not found.')
        if choices:
            issue_id, employee_id = choices[0]['id'], choices[0]['staffId']
            movement_id = connection.execute(
                'SELECT max(movement_id) FROM it_asset_stock_entries WHERE id=? OR source_issue_entry_id=?',
                (issue_id, issue_id),
            ).fetchone()[0]
    if employee_id is None and scope != 'it':
        employee_id = staff[0]
    return column, assignment_id, issue_id, movement_id, employee_id


def employee_ticket_equipment(connection, actor_id, scope):
    """List only current equipment for this personal or Department audience."""
    ticket_scope_filter(connection, actor_id, scope)
    staff = linked_ticket_staff(connection, actor_id)
    if not staff or (scope == 'department' and staff[1] is None):
        return {'equipment': [], 'department': None}
    recipient = 'staff_id' if scope == 'personal' else 'department_id'
    identity = staff[0] if scope == 'personal' else staff[1]
    choices = []
    department = None
    if scope == 'department':
        department = connection.execute('SELECT name FROM departments WHERE id=?', (identity,)).fetchone()
    if feature_enabled(connection, 'Devices'):
        choices.extend(
            {'kind': 'device', 'id': device_id, 'label': label, 'type': device_type or ''}
            for device_id, label, device_type in connection.execute(f"""
                SELECT d.id,d.name,json_extract(d.record_json,'$.type')
                FROM device_assignments a JOIN inventory_devices d ON d.id=a.device_id
                WHERE a.ended_at IS NULL AND {device_recipient_filter(scope)}
            """, (identity,))
        )
    if feature_enabled(connection, 'IT Assets'):
        for issue in stock_issue_records(connection, **{recipient: identity}):
            if issue['outstanding'] <= 0 or issue['deviceAssignmentId'] is not None:
                continue
            unit = issue['stockUnitId']
            specification = issue['specification']
            choices.append({'kind': 'stockUnit' if unit else 'stockItem',
                            'id': unit or issue['stockItemId'], 'stockIssueId': issue['id'],
                            'label': f"{issue['name']} · Issue {issue['id']}", 'type': specification.get('category', '')})
    return {'equipment': sorted(choices, key=lambda choice: (choice['label'].casefold(), choice['id'])),
            'department': department[0] if department else None}
