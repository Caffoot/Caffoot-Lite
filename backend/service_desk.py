"""Read and change a ticket within one authenticated database transaction."""
from datetime import datetime, timezone
import json

from backend.permissions import can_access
from backend.role_policy import SERVICE_DESK_SECTION
from backend.service_desk_access import ticket_equipment_for_creation, ticket_scope_filter

STATUSES = ('Open', 'In Progress', 'On Hold', 'Closed')
PRIORITIES = ('Low', 'Medium', 'High')
HOLD_REASONS = ('Waiting for User', 'Waiting for Supplier', 'Waiting for Parts', 'Other')
REASSIGNMENT_REASONS = ('Sickness', 'Annual Leave / Holiday', 'Other Absence',
                       'Required Skill Set', 'Workload / Availability', 'Other / Not Listed')
TICKET_EQUIPMENT_LABEL = """
    coalesce((SELECT name FROM inventory_devices WHERE id=ticket.device_id),
             (SELECT name FROM it_asset_stock_items WHERE id=ticket.stock_item_id),
             (SELECT item.name FROM it_asset_stock_units unit
              JOIN it_asset_stock_items item ON item.id=unit.stock_item_id
              WHERE unit.id=ticket.stock_unit_id))
"""
TICKET_SUMMARY = f"""
    ticket.id, ticket.subject, ticket.status, ticket.priority,
    ticket.category_id AS categoryId, ticket.category_label AS category,
    CASE WHEN ticket.device_id IS NOT NULL THEN 'device'
         WHEN ticket.stock_unit_id IS NOT NULL THEN 'stockUnit' ELSE 'stockItem' END AS equipmentKind,
    coalesce(ticket.device_id,ticket.stock_unit_id,ticket.stock_item_id) AS equipmentId,
    {TICKET_EQUIPMENT_LABEL} AS equipmentLabel,
    ticket.created_by_label AS author, ticket.employee_label AS employee,
    (SELECT username FROM accounts WHERE id=ticket.technician_id) AS technician,
    ticket.created_at AS createdAt, ticket.updated_at AS updatedAt
"""


def ticket_rows(cursor):
    """Name the API fields explicitly selected by each query."""
    keys = [column[0] for column in cursor.description]
    return [dict(zip(keys, row)) for row in cursor]


def ticket_text(value, label, limit, *, required=True):
    """Validate bounded plain text before it becomes part of ticket history."""
    if not isinstance(value, str) or len(value) > limit or '\x00' in value:
        raise ValueError(f'{label} must be text of at most {limit} characters.')
    value = value.strip()
    if required and not value:
        raise ValueError(f'{label} is required.')
    return value


def ticket_category(connection, category_id):
    if type(category_id) is not int or not 0 < category_id <= 2**63 - 1:
        raise ValueError('Select a ticket category.')
    row = connection.execute(
        'SELECT name FROM service_desk_categories WHERE id=? AND hidden=0', (category_id,),
    ).fetchone()
    if row is None:
        raise ValueError('Select an available ticket category.')
    return row[0]


def read_ticket_categories(connection, actor_id, scope):
    ticket_scope_filter(connection, actor_id, scope)
    return {'categories': ticket_rows(connection.execute("""
        SELECT id,name FROM service_desk_categories WHERE hidden=0
        ORDER BY name='Other / Not Listed', name COLLATE NOCASE, id
    """))}


def read_ticket_list(connection, actor_id, scope, *, status=None, search='', limit=50, offset=0):
    allowed, values = ticket_scope_filter(connection, actor_id, scope)
    search = ticket_text(search, 'Search', 200, required=False)
    if status is not None and status not in STATUSES:
        raise ValueError('Invalid ticket status.')
    if not 1 <= limit <= 100 or not 0 <= offset <= 1_000_000:
        raise ValueError('Invalid ticket page.')
    if search:
        pattern = '%' + search.replace('!', '!!').replace('%', '!%').replace('_', '!_') + '%'
        allowed += f""" AND (ticket.subject LIKE ? ESCAPE '!' OR CAST(ticket.id AS TEXT)=?
                              OR {TICKET_EQUIPMENT_LABEL} LIKE ? ESCAPE '!')"""
        values += (pattern, search, pattern)
    counts = dict.fromkeys(STATUSES, 0)
    counts.update(connection.execute(
        'SELECT ticket.status,count(*) FROM service_desk_tickets ticket WHERE ' + allowed + ' GROUP BY ticket.status',
        values,
    ))
    if status is not None:
        allowed += ' AND ticket.status=?'
        values += (status,)
    tickets = ticket_rows(connection.execute(f"""
        SELECT {TICKET_SUMMARY} FROM service_desk_tickets ticket WHERE {allowed}
        ORDER BY ticket.updated_at DESC,ticket.id DESC LIMIT ? OFFSET ?
    """, (*values, limit, offset)))
    return {'tickets': tickets, 'counts': counts}


def require_ticket(connection, actor_id, scope, ticket_id, *, edit=False):
    permitted, values = ticket_scope_filter(connection, actor_id, scope, edit=edit)
    ticket = connection.execute(f"""
        SELECT ticket.created_by,ticket.status,ticket.status_before_hold,ticket.technician_id,
               ticket.category_id,ticket.category_label,ticket.priority,
               CASE WHEN ticket.device_id IS NOT NULL THEN 'Devices' ELSE 'IT Assets' END
        FROM service_desk_tickets ticket WHERE ticket.id=? AND {permitted}
    """, (ticket_id, *values)).fetchone()
    if ticket is None:
        raise LookupError('Ticket not found.')
    return ticket


def read_ticket(connection, actor_id, scope, ticket_id, resource=None):
    require_ticket(connection, actor_id, scope, ticket_id)
    visibility = '' if scope == 'it' else ' AND employee_visible=1'
    if resource == 'messages':
        messages = ticket_rows(connection.execute("""
            SELECT id,kind,body,actor_label AS author,created_at AS createdAt,
                   edited_at AS editedAt,employee_visible AS employeeVisible
            FROM service_desk_messages WHERE ticket_id=?""" + visibility + ' ORDER BY id', (ticket_id,)))
        attachments = ticket_rows(connection.execute("""
            SELECT attachment.id,attachment.message_id AS messageId,attachment.filename,
                   length(attachment.contents) AS size
            FROM service_desk_attachments attachment JOIN service_desk_messages message
              ON message.ticket_id=attachment.ticket_id AND message.id=attachment.message_id
            WHERE attachment.ticket_id=?""" + visibility + ' ORDER BY attachment.id', (ticket_id,)))
        return {'messages': messages, 'attachments': attachments}
    if resource == 'history':
        private_details = ',private_details' if scope == 'it' else ''
        events = ticket_rows(connection.execute("""
            SELECT id,kind,actor_label AS author,happened_at AS at,details""" + private_details + """
            FROM service_desk_events WHERE ticket_id=?""" + visibility + ' ORDER BY id', (ticket_id,)))
        for event in events:
            event['details'] = json.loads(event['details'])
            if scope == 'it':
                event['details'].update(json.loads(event.pop('private_details')))
        result = {'history': events}
        if scope == 'it':
            result['closureAttempts'] = ticket_rows(connection.execute("""
                SELECT id,closed_event_id AS closedEventId,resolution_message_id AS resolutionMessageId,
                       reopened_event_id AS reopenedEventId,resolution_working_seconds AS workingSeconds
                FROM service_desk_closures WHERE ticket_id=? ORDER BY id
            """, (ticket_id,)))
        return result
    ticket, = ticket_rows(connection.execute(f"""
        SELECT {TICKET_SUMMARY},ticket.description FROM service_desk_tickets ticket WHERE ticket.id=?
    """, (ticket_id,)))
    return ticket


def read_ticket_attachment(connection, actor_id, scope, ticket_id, attachment_id):
    require_ticket(connection, actor_id, scope, ticket_id)
    attachment = connection.execute("""
        SELECT attachment.filename,attachment.contents
        FROM service_desk_attachments attachment JOIN service_desk_messages message
          ON message.ticket_id=attachment.ticket_id AND message.id=attachment.message_id
        WHERE attachment.ticket_id=? AND attachment.id=? AND (? OR message.employee_visible=1)
    """, (ticket_id, attachment_id, scope == 'it')).fetchone()
    if attachment is None:
        raise LookupError('Attachment not found.')
    return attachment


def record_ticket_event(connection, ticket_id, kind, actor, at, *, visible=True, private=None, **details):
    return connection.execute("""
        INSERT INTO service_desk_events(ticket_id,kind,actor_id,actor_label,happened_at,employee_visible,details,private_details)
        VALUES(?,?,?,?,?,?,?,?)
    """, (ticket_id, kind, *actor, at, visible, json.dumps(details, ensure_ascii=False),
          json.dumps(private or {}, ensure_ascii=False))).lastrowid


def insert_ticket_message(connection, ticket_id, kind, body, actor, at, visible):
    return connection.execute("""
        INSERT INTO service_desk_messages(ticket_id,kind,body,actor_id,actor_label,created_at,employee_visible)
        VALUES(?,?,?,?,?,?,?)
    """, (ticket_id, kind, body, *actor, at, visible)).lastrowid


def create_ticket(connection, actor, scope, payload, at):
    required = {'equipmentKind', 'equipmentId', 'categoryId', 'subject', 'description'}
    if not required <= payload.keys() or payload.keys() - (required | {'stockIssueId'}):
        raise ValueError('Select equipment and a category, and enter a subject and description.')
    column, assignment_id, issue_id, movement_id, employee_id = ticket_equipment_for_creation(
        connection, actor[0], scope, payload['equipmentKind'], payload['equipmentId'], payload.get('stockIssueId'),
    )
    category_id = payload['categoryId']
    category = ticket_category(connection, category_id)
    subject = ticket_text(payload['subject'], 'Subject', 200)
    description = ticket_text(payload['description'], 'Description', 16000)
    employee = connection.execute(
        "SELECT trim(first_name||' '||last_name) FROM staff_members WHERE id=?", (employee_id,),
    ).fetchone()
    ticket_id = connection.execute(f"""
        INSERT INTO service_desk_tickets({column},device_assignment_id,stock_issue_id,stock_movement_at_creation,
            created_by,created_by_label,employee_id,employee_label,category_id,category_label,
            subject,description,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, (payload['equipmentId'], assignment_id, issue_id, movement_id, *actor, employee_id,
          employee[0] if employee else None, category_id, category, subject, description, at, at)).lastrowid
    record_ticket_event(connection, ticket_id, 'Created', actor, at, status='Open',
                        categoryId=category_id, category=category)
    return ticket_id


def save_ticket_message(connection, ticket_id, message_id, scope, payload, actor, at, status):
    allowed_fields = {'body'} | ({'employeeVisible'} if scope == 'it' and message_id is None else set())
    if payload.keys() - allowed_fields:
        raise ValueError('Invalid message fields.')
    body = ticket_text(payload.get('body'), 'Message', 16000)
    if message_id is not None:
        message = connection.execute("""
            SELECT body,employee_visible FROM service_desk_messages
            WHERE ticket_id=? AND id=? AND actor_id=? AND kind<>'Resolution Note'
              AND (? OR employee_visible=1)
        """, (ticket_id, message_id, actor[0], scope == 'it')).fetchone()
        if message is None:
            raise LookupError('Message not found.')
        previous, visible = message
        if previous == body:
            return message_id
        connection.execute('UPDATE service_desk_messages SET body=?,edited_at=? WHERE id=?', (body, at, message_id))
        record_ticket_event(connection, ticket_id, 'Message Edited', actor, at, visible=visible,
                            messageId=message_id, private={'previousBody': previous})
        return message_id
    visible = payload.get('employeeVisible', scope != 'it')
    if type(visible) is not bool:
        raise ValueError('Invalid message visibility.')
    if status == 'Closed' and visible:
        raise FileExistsError('Reopen the ticket before adding an employee-visible reply.')
    kind = 'IT Update' if scope == 'it' else 'Reply'
    message_id = insert_ticket_message(connection, ticket_id, kind, body, actor, at, visible)
    record_ticket_event(connection, ticket_id, 'Message Added', actor, at, visible=visible, messageId=message_id)
    return message_id


def change_ticket_lifecycle(connection, ticket_id, action, payload, ticket, actor, at):
    _, status, status_before_hold, technician_id, category_id, category, priority, section = ticket
    fields = {
        'assign': {'technicianId', 'reason', 'explanation'},
        'hold': {'reason', 'explanation', 'employeeVisible'},
        'resume': set(),
        'close': {'resolutionNote'},
        'reopen': set(),
        'priority': {'priority'},
        'category': {'categoryId'},
    }
    if action not in fields or payload.keys() - fields[action]:
        raise ValueError('Invalid ticket action or fields.')
    if action == 'assign':
        target_id = payload.get('technicianId')
        reason = payload.get('reason')
        explanation = ticket_text(payload.get('explanation', ''), 'Explanation', 2000, required=False)
        if (type(target_id) is not int or not 0 < target_id <= 2**63 - 1 or target_id == technician_id
                or not can_access(connection, target_id, SERVICE_DESK_SECTION, edit=True)
                or not can_access(connection, target_id, section)):
            raise ValueError('Select an eligible technician.')
        if status not in ('Open', 'In Progress'):
            raise FileExistsError('Only Open or In Progress tickets can be assigned.')
        if technician_id is not None and reason not in REASSIGNMENT_REASONS:
            raise ValueError('Select a reassignment reason.')
        if technician_id is None and (reason is not None or explanation):
            raise ValueError('A reason applies when reassigning a ticket.')
        old_label = connection.execute('SELECT username FROM accounts WHERE id=?', (technician_id,)).fetchone()
        new_label = connection.execute('SELECT username FROM accounts WHERE id=?', (target_id,)).fetchone()[0]
        connection.execute('UPDATE service_desk_tickets SET technician_id=?,status=? WHERE id=?',
                           (target_id, 'In Progress', ticket_id))
        record_ticket_event(connection, ticket_id, 'Assignment Changed', actor, at, technician=new_label,
                            private={'previousTechnician': old_label[0] if old_label else None,
                                     'previousTechnicianId': technician_id, 'technicianId': target_id,
                                     'reason': reason, 'explanation': explanation})
        if status == 'Open':
            record_ticket_event(connection, ticket_id, 'Status Changed', actor, at, before=status, status='In Progress')
    elif action == 'hold':
        reason = payload.get('reason')
        visible = payload.get('employeeVisible', False)
        explanation = ticket_text(payload.get('explanation', ''), 'Explanation', 2000, required=False)
        if status not in ('Open', 'In Progress'):
            raise FileExistsError('Only Open or In Progress tickets can be put on hold.')
        if reason not in HOLD_REASONS or type(visible) is not bool:
            raise ValueError('Select an On Hold reason.')
        connection.execute("UPDATE service_desk_tickets SET status='On Hold',status_before_hold=? WHERE id=?",
                           (status, ticket_id))
        record_ticket_event(connection, ticket_id, 'Status Changed', actor, at,
                            before=status, status='On Hold', reason=reason,
                            private={'explanation': explanation} if explanation and not visible else None,
                            **({'explanation': explanation} if visible and explanation else {}))
    elif action == 'resume':
        if status != 'On Hold':
            raise FileExistsError('The ticket is not On Hold.')
        connection.execute('UPDATE service_desk_tickets SET status=?,status_before_hold=NULL WHERE id=?',
                           (status_before_hold, ticket_id))
        record_ticket_event(connection, ticket_id, 'Status Changed', actor, at, before=status, status=status_before_hold)
    elif action == 'close':
        if status not in ('Open', 'In Progress'):
            raise FileExistsError('Only Open or In Progress tickets can be closed.')
        note = ticket_text(payload.get('resolutionNote'), 'Resolution note', 16000)
        message_id = insert_ticket_message(connection, ticket_id, 'Resolution Note', note, actor, at, True)
        event_id = record_ticket_event(connection, ticket_id, 'Closed', actor, at,
                                       before=status, status='Closed', messageId=message_id)
        connection.execute("""
            INSERT INTO service_desk_closures(ticket_id,closed_event_id,resolution_message_id) VALUES(?,?,?)
        """, (ticket_id, event_id, message_id))
        connection.execute("UPDATE service_desk_tickets SET status='Closed' WHERE id=?", (ticket_id,))
    elif action == 'reopen':
        if status != 'Closed':
            raise FileExistsError('Only Closed tickets can be reopened.')
        event_id = record_ticket_event(connection, ticket_id, 'Reopened', actor, at, before=status, status='Open')
        cursor = connection.execute("""
            UPDATE service_desk_closures SET reopened_event_id=? WHERE ticket_id=? AND reopened_event_id IS NULL
        """, (event_id, ticket_id))
        if cursor.rowcount != 1:
            raise FileExistsError('The ticket closure history needs review before reopening.')
        connection.execute("UPDATE service_desk_tickets SET status='Open' WHERE id=?", (ticket_id,))
    elif action == 'priority':
        new_priority = payload.get('priority')
        if new_priority not in PRIORITIES:
            raise ValueError('Select a ticket priority.')
        if new_priority != priority:
            connection.execute('UPDATE service_desk_tickets SET priority=? WHERE id=?', (new_priority, ticket_id))
            record_ticket_event(connection, ticket_id, 'Priority Changed', actor, at, before=priority, priority=new_priority)
    elif action == 'category':
        new_category_id = payload.get('categoryId')
        new_category = ticket_category(connection, new_category_id)
        if new_category_id != category_id:
            connection.execute('UPDATE service_desk_tickets SET category_id=?,category_label=? WHERE id=?',
                               (new_category_id, new_category, ticket_id))
            record_ticket_event(connection, ticket_id, 'Category Changed', actor, at, previousCategoryId=category_id,
                                previousCategory=category, categoryId=new_category_id, category=new_category)


def save_ticket_request(connection, actor_id, scope, payload, *, ticket_id=None, action=None, message_id=None):
    """Write a ticket and its history as one operation under the caller's lock."""
    if not connection.in_transaction:
        raise RuntimeError('Ticket writes require an active transaction')
    if not isinstance(payload, dict):
        raise ValueError('Send a JSON object.')
    actor_name = connection.execute('SELECT username FROM accounts WHERE id=? AND active=1', (actor_id,)).fetchone()
    if actor_name is None:
        raise PermissionError('Active account required.')
    actor = (actor_id, actor_name[0])
    at = datetime.now(timezone.utc).isoformat(timespec='microseconds').replace('+00:00', 'Z')
    if ticket_id is None:
        return {'id': create_ticket(connection, actor, scope, payload, at)}
    ticket = require_ticket(connection, actor_id, scope, ticket_id, edit=True)
    if action == 'messages':
        result = {'id': save_ticket_message(connection, ticket_id, message_id, scope, payload, actor, at, ticket[1])}
    else:
        if scope != 'it' and (action != 'reopen' or ticket[0] != actor_id):
            raise PermissionError('This action requires an authorised technician or the ticket author.')
        change_ticket_lifecycle(connection, ticket_id, action, payload, ticket, actor, at)
        result = {'id': ticket_id}
    connection.execute('UPDATE service_desk_tickets SET updated_at=? WHERE id=?', (at, ticket_id))
    return result
