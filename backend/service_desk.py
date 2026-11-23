"""Read and change a ticket within one authenticated database transaction."""
from dataclasses import dataclass, field
import json

from backend.permissions import can_access
from backend.role_policy import SERVICE_DESK_SECTION
from backend.service_desk_access import (EQUIPMENT_COLUMNS, employee_ticket_equipment,
                                        ticket_equipment_for_creation, ticket_scope_filter)
from backend.service_desk_attachments import insert_ticket_attachments
from backend.service_desk_calendar import measure_resolution_attempt, utc_timestamp
from backend.service_desk_schema import OTHER_TICKET_CATEGORY_ID, SOFTWARE_TICKET_CATEGORY_ID
from backend.stock_circulation import stock_issue_records
from backend.ticket_software import ticket_software_choices

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


@dataclass(frozen=True)
class TicketNotification:
    template_id: str
    values: dict = field(default_factory=dict)
    technician_id: int | None = None


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
    categories = ticket_rows(connection.execute(
        'SELECT id,name FROM service_desk_categories WHERE hidden=0'
    ))
    categories.sort(key=lambda category: (category['id'] == OTHER_TICKET_CATEGORY_ID, category['name'].casefold()))
    return {'categories': categories, 'softwareCategoryId': SOFTWARE_TICKET_CATEGORY_ID}


def read_ticket_list(connection, actor_id, scope, *, status=None, search='', limit=50, offset=0,
                     priority=None, assignment=None, technician=None, sort=None,
                     equipment_kind=None, equipment_id=None):
    allowed, values = ticket_scope_filter(connection, actor_id, scope)
    search = ticket_text(search, 'Search', 200, required=False)
    if status is not None and status not in STATUSES:
        raise ValueError('Invalid ticket status.')
    if not 1 <= limit <= 100 or not 0 <= offset <= 1_000_000:
        raise ValueError('Invalid ticket page.')
    orders = {'newest': 'ticket.updated_at DESC,ticket.id DESC',
              'oldest': 'ticket.updated_at,ticket.id', 'ticket': 'ticket.id DESC'}
    if scope != 'it' and any(value is not None for value in (priority, assignment, technician)):
        raise ValueError('Invalid ticket list parameters.')
    if priority is not None and priority not in PRIORITIES:
        raise ValueError('Invalid ticket priority.')
    if assignment not in (None, 'mine', 'unassigned') or (sort is not None and sort not in orders):
        raise ValueError('Invalid ticket assignment or sort.')
    if (equipment_kind is None) != (equipment_id is None):
        raise ValueError('Select a Device or IT Asset.')
    scoped, scoped_values = allowed, values
    if equipment_kind is not None:
        if equipment_kind not in EQUIPMENT_COLUMNS or not 0 < len(equipment_id) <= 200:
            raise ValueError('Select a Device or IT Asset.')
        if equipment_kind == 'stockItem' and scope == 'it':
            allowed += ''' AND (ticket.stock_item_id=? OR ticket.stock_unit_id IN (
                SELECT id FROM it_asset_stock_units WHERE stock_item_id=? AND device_id IS NULL))'''
            values += (equipment_id, equipment_id)
        else:
            allowed += f' AND ticket.{EQUIPMENT_COLUMNS[equipment_kind][1]}=?'
            values += (equipment_id,)
    # Workload totals use equipment access but stay independent of queue filters.
    if scope == 'it':
        scoped, scoped_values = allowed, values
    if search:
        pattern = '%' + search.replace('!', '!!').replace('%', '!%').replace('_', '!_') + '%'
        if scope == 'it':
            allowed += f""" AND (ticket.subject LIKE ? ESCAPE '!' OR CAST(ticket.id AS TEXT)=?
                OR printf('SD-%04d',ticket.id) LIKE ? ESCAPE '!' OR {TICKET_EQUIPMENT_LABEL} LIKE ? ESCAPE '!'
                OR ticket.employee_label LIKE ? ESCAPE '!' OR ticket.created_by_label LIKE ? ESCAPE '!'
                OR ticket.category_label LIKE ? ESCAPE '!' OR EXISTS (
                    SELECT 1 FROM accounts WHERE id=ticket.technician_id AND username LIKE ? ESCAPE '!'))"""
            values += (pattern, search, pattern, pattern, pattern, pattern, pattern, pattern)
        else:
            allowed += f""" AND (ticket.subject LIKE ? ESCAPE '!' OR CAST(ticket.id AS TEXT)=?
                OR printf('SD-%04d',ticket.id) LIKE ? ESCAPE '!' OR {TICKET_EQUIPMENT_LABEL} LIKE ? ESCAPE '!'
                OR coalesce(ticket.employee_label,ticket.created_by_label) LIKE ? ESCAPE '!')"""
            values += (pattern, search, pattern, pattern, pattern)
    counts = dict.fromkeys(STATUSES, 0)
    counts.update(connection.execute(
        'SELECT ticket.status,count(*) FROM service_desk_tickets ticket WHERE ' + allowed + ' GROUP BY ticket.status',
        values,
    ))
    for column, value in (('status', status), ('priority', priority), ('technician_id', technician),
                          ('technician_id', actor_id if assignment == 'mine' else None)):
        if value is not None:
            allowed += f' AND ticket.{column}=?'
            values += (value,)
    if assignment == 'unassigned':
        allowed += ' AND ticket.technician_id IS NULL'
    tickets = ticket_rows(connection.execute(f"""
        SELECT {TICKET_SUMMARY} FROM service_desk_tickets ticket WHERE {allowed}
        ORDER BY {orders[sort or 'newest']} LIMIT ? OFFSET ?
    """, (*values, limit, offset)))
    workload_counts = dict.fromkeys(STATUSES, 0)
    workload_counts.update(connection.execute(
        'SELECT ticket.status,count(*) FROM service_desk_tickets ticket WHERE ' + scoped + ' GROUP BY ticket.status',
        scoped_values,
    ))
    result = {'tickets': tickets, 'counts': counts, 'workloadCounts': workload_counts,
              'filteredTotal': counts[status] if status else sum(counts.values())}
    if scope == 'it':
        result['filteredTotal'] = connection.execute(
            'SELECT count(*) FROM service_desk_tickets ticket WHERE ' + allowed, values).fetchone()[0]
        result['technicians'] = ticket_rows(connection.execute(f"""
            SELECT DISTINCT accounts.id,accounts.username AS name
            FROM service_desk_tickets ticket JOIN accounts ON accounts.id=ticket.technician_id
            WHERE {scoped} ORDER BY accounts.username COLLATE NOCASE, accounts.id
        """, scoped_values))
    return result


def read_ticket_equipment_choices(connection, actor_id, scope='it'):
    """Offer only canonical equipment and identify separate outstanding stock issues."""
    if scope != 'it':
        return employee_ticket_equipment(connection, actor_id, scope)
    ticket_scope_filter(connection, actor_id, 'it', edit=True)
    choices = []
    if can_access(connection, actor_id, 'Devices'):
        choices.extend({'kind': 'device', 'id': identity, 'label': name or identity}
                       for identity, name in connection.execute('SELECT id,name FROM inventory_devices'))
    if can_access(connection, actor_id, 'IT Assets'):
        issues = {}
        for issue in stock_issue_records(connection):
            if issue['outstanding'] > 0 and issue['deviceAssignmentId'] is None:
                identity = issue['stockUnitId'] or issue['stockItemId']
                issues.setdefault(identity, []).append(issue)
        assets = connection.execute("""
            SELECT 'stockItem',id,name FROM it_asset_stock_items WHERE tracking_mode='quantity'
            UNION ALL
            SELECT 'stockUnit',unit.id,item.name||coalesce(' · '||unit.asset_tag,'')
                   ||coalesce(' · '||unit.serial_number,'')
            FROM it_asset_stock_units unit JOIN it_asset_stock_items item ON item.id=unit.stock_item_id
            WHERE unit.device_id IS NULL
        """)
        for kind, identity, name in assets:
            current = issues.get(identity, [])
            if current:
                choices.extend({'kind': kind, 'id': identity,
                                'label': f"{name} · {issue['recipientLabel']} (Issue {issue['id']})",
                                'stockIssueId': issue['id']} for issue in current)
            else:
                choices.append({'kind': kind, 'id': identity, 'label': name})
    return {'equipment': sorted(choices, key=lambda choice: (choice['label'].casefold(), choice['id']))}


def read_ticket_software_choices(connection, actor_id, scope, equipment_id):
    ticket_equipment_for_creation(connection, actor_id, scope, 'device', equipment_id, None)
    return {'software': ticket_software_choices(connection, equipment_id)}


def read_ticket_assignment_choices(connection, actor_id, ticket_id):
    """Use the same eligibility check as assignment and omit the current assignee."""
    ticket = require_ticket(connection, actor_id, 'it', ticket_id, edit=True)
    accounts = connection.execute('SELECT id,username FROM accounts WHERE active=1 ORDER BY username COLLATE NOCASE')
    return {'technicians': [{'id': identity, 'name': name} for identity, name in accounts
                            if identity != ticket[3] and eligible_ticket_technician(connection, identity, ticket[7])]}


def eligible_ticket_technician(connection, identity, equipment_section):
    return (can_access(connection, identity, SERVICE_DESK_SECTION, edit=True)
            and can_access(connection, identity, equipment_section))


def require_ticket(connection, actor_id, scope, ticket_id, *, edit=False):
    permitted, values = ticket_scope_filter(connection, actor_id, scope, edit=edit)
    ticket = connection.execute(f"""
        SELECT ticket.affected_software,ticket.status,ticket.status_before_hold,ticket.technician_id,
               ticket.category_id,ticket.category_label,ticket.priority,
               CASE WHEN ticket.device_id IS NOT NULL THEN 'Devices' ELSE 'IT Assets' END
        FROM service_desk_tickets ticket WHERE ticket.id=? AND {permitted}
    """, (ticket_id, *values)).fetchone()
    if ticket is None:
        raise LookupError('Ticket not found.')
    return ticket


def read_ticket(connection, actor_id, scope, ticket_id, resource=None):
    access = require_ticket(connection, actor_id, scope, ticket_id)
    visibility = '' if scope == 'it' else ' AND employee_visible=1'
    if resource == 'messages':
        messages = ticket_rows(connection.execute("""
            SELECT id,kind,body,actor_label AS author,created_at AS createdAt,
                   edited_at AS editedAt,employee_visible AS employeeVisible,
                   (actor_id=? AND kind<>'Resolution Note' AND NOT EXISTS (
                       SELECT 1 FROM service_desk_events event WHERE event.ticket_id=service_desk_messages.ticket_id
                       AND event.kind='Created' AND json_extract(event.details,'$.attachmentMessageId')=service_desk_messages.id
                   )) AS editable
            FROM service_desk_messages WHERE ticket_id=?""" + visibility + ' ORDER BY id', (actor_id, ticket_id)))
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
        SELECT {TICKET_SUMMARY},ticket.description,ticket.affected_software AS affectedSoftware
        FROM service_desk_tickets ticket WHERE ticket.id=?
    """, (ticket_id,)))
    if scope == 'it':
        ticket.update(technicianId=access[3], statusBeforeHold=access[2],
                      canEdit=can_access(connection, actor_id, SERVICE_DESK_SECTION, edit=True))
    else:
        kind, identity = ticket['equipmentKind'], ticket['equipmentId']
        equipment_type = {
            'device': "SELECT json_extract(record_json,'$.type') FROM inventory_devices WHERE id=?",
            'stockItem': 'SELECT category FROM it_asset_stock_items WHERE id=?',
            'stockUnit': """SELECT item.category FROM it_asset_stock_items item
                            JOIN it_asset_stock_units unit ON unit.stock_item_id=item.id WHERE unit.id=?""",
        }
        ticket['equipmentType'] = connection.execute(equipment_type[kind], (identity,)).fetchone()[0]
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


def create_ticket(connection, actor, scope, payload, at, attachments):
    required = {'equipmentKind', 'equipmentId', 'categoryId', 'subject', 'description'}
    optional = {'stockIssueId'} if scope == 'it' else {'stockIssueId', 'affectedSoftware'}
    if not required <= payload.keys() or payload.keys() - (required | optional):
        raise ValueError('Select equipment and a category, and enter a subject and description.')
    column, assignment_id, issue_id, movement_id, employee_id = ticket_equipment_for_creation(
        connection, actor[0], scope, payload['equipmentKind'], payload['equipmentId'], payload.get('stockIssueId'),
    )
    category_id = payload['categoryId']
    category = ticket_category(connection, category_id)
    software = payload.get('affectedSoftware')
    affected_software = None
    if software is not None and software != '':
        if not isinstance(software, str) or category_id != SOFTWARE_TICKET_CATEGORY_ID or column != 'device_id':
            raise ValueError('Affected Software applies to Software / Applications tickets on a Laptop or Desktop.')
        choices = ticket_software_choices(connection, payload['equipmentId'])
        affected_software = next((choice['label'] for choice in choices if choice['key'] == software), None)
        if affected_software is None:
            raise ValueError('Select software recorded on this Device or Other / Not Listed.')
    subject = ticket_text(payload['subject'], 'Subject', 200)
    description = ticket_text(payload['description'], 'Description', 16000)
    employee = connection.execute(
        "SELECT trim(first_name||' '||last_name) FROM staff_members WHERE id=?", (employee_id,),
    ).fetchone()
    ticket_id = connection.execute(f"""
        INSERT INTO service_desk_tickets({column},device_assignment_id,stock_issue_id,stock_movement_at_creation,
            created_by,created_by_label,employee_id,employee_label,category_id,category_label,
            subject,description,created_at,updated_at,affected_software) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, (payload['equipmentId'], assignment_id, issue_id, movement_id, *actor, employee_id,
          employee[0] if employee else None, category_id, category, subject, description, at, at, affected_software)).lastrowid
    initial_files = {}
    if attachments:
        # Initial files are part of the original request and share its verified audience.
        message_id = insert_ticket_message(connection, ticket_id, 'IT Update',
                                           'Attachments Submitted With Ticket', actor, at, True)
        insert_ticket_attachments(connection, ticket_id, message_id, attachments)
        initial_files['attachmentMessageId'] = message_id
    record_ticket_event(connection, ticket_id, 'Created', actor, at, status='Open',
                        categoryId=category_id, category=category, **initial_files,
                        **({'affectedSoftware': affected_software} if affected_software else {}))
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
              AND NOT EXISTS (SELECT 1 FROM service_desk_events event
                  WHERE event.ticket_id=service_desk_messages.ticket_id AND event.kind='Created'
                  AND json_extract(event.details,'$.attachmentMessageId')=service_desk_messages.id)
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
    affected_software, status, status_before_hold, technician_id, category_id, category, priority, section = ticket
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
                or not eligible_ticket_technician(connection, target_id, section)):
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
        if target_id != actor[0]:
            return TicketNotification('ticket-assigned', technician_id=target_id)
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
        return TicketNotification('ticket-hold', {
            'ticket_status': 'On Hold', 'hold_reason': reason, 'hold_explanation': explanation if visible else '',
        })
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
        seconds = measure_resolution_attempt(connection, ticket_id, event_id, at)
        connection.execute("""
            INSERT INTO service_desk_closures
              (ticket_id,closed_event_id,resolution_message_id,resolution_working_seconds) VALUES(?,?,?,?)
        """, (ticket_id, event_id, message_id, seconds))
        connection.execute("UPDATE service_desk_tickets SET status='Closed' WHERE id=?", (ticket_id,))
        return TicketNotification('ticket-closed', {'ticket_status': 'Closed', 'resolution_note': note})
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
        if technician_id is not None:
            return TicketNotification('ticket-reopened', technician_id=technician_id)
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
            software = affected_software if new_category_id == SOFTWARE_TICKET_CATEGORY_ID else None
            connection.execute("""
                UPDATE service_desk_tickets SET category_id=?,category_label=?,affected_software=? WHERE id=?
            """, (new_category_id, new_category, software, ticket_id))
            record_ticket_event(connection, ticket_id, 'Category Changed', actor, at, previousCategoryId=category_id,
                                previousCategory=category, categoryId=new_category_id, category=new_category,
                                **({'previousAffectedSoftware': affected_software} if affected_software and not software else {}))


def remove_ticket_attachment(connection, ticket_id, attachment_id, actor, at):
    """Remove the file and retain its attributed change with the parent message."""
    row = connection.execute("""
        SELECT attachment.message_id,attachment.filename,message.employee_visible
        FROM service_desk_attachments attachment JOIN service_desk_messages message
          ON message.ticket_id=attachment.ticket_id AND message.id=attachment.message_id
        WHERE attachment.ticket_id=? AND attachment.id=?
    """, (ticket_id, attachment_id)).fetchone()
    if row is None:
        raise LookupError('Attachment not found.')
    message_id, filename, visible = row
    connection.execute('DELETE FROM service_desk_attachments WHERE ticket_id=? AND id=?',
                       (ticket_id, attachment_id))
    record_ticket_event(connection, ticket_id, 'Message Edited', actor, at, visible=visible,
                        messageId=message_id, removedAttachmentId=attachment_id, filename=filename)


def save_ticket_request(connection, actor_id, scope, payload, *, ticket_id=None, action=None,
                        message_id=None, attachments=()):
    """Write a ticket and its history as one operation under the caller's lock."""
    if not connection.in_transaction:
        raise RuntimeError('Ticket writes require an active transaction')
    if not isinstance(payload, dict):
        raise ValueError('Send a JSON object.')
    actor_name = connection.execute('SELECT username FROM accounts WHERE id=? AND active=1', (actor_id,)).fetchone()
    if actor_name is None:
        raise PermissionError('Active account required.')
    actor = (actor_id, actor_name[0])
    at = utc_timestamp()
    if ticket_id is None:
        result = {'id': create_ticket(connection, actor, scope, payload, at, attachments)}
        if scope in ('personal', 'department'):
            result['notification'] = TicketNotification('ticket-created', {'ticket_status': 'Open'})
        return result
    ticket = require_ticket(connection, actor_id, scope, ticket_id, edit=True)
    notification = None
    if action == 'attachments':
        if scope != 'it' or payload:
            raise PermissionError('Attachment removal requires an authorised technician.')
        remove_ticket_attachment(connection, ticket_id, message_id, actor, at)
        result = {'id': message_id}
    elif action == 'messages':
        result = {'id': save_ticket_message(connection, ticket_id, message_id, scope, payload, actor, at, ticket[1])}
        if attachments:
            insert_ticket_attachments(connection, ticket_id, result['id'], attachments)
        if message_id is None:
            if scope == 'it' and payload.get('employeeVisible') is True:
                notification = TicketNotification('ticket-update', {'visible_update': payload['body'].strip()})
            elif scope != 'it' and ticket[3] is not None:
                notification = TicketNotification('ticket-reply', {'employee_reply': payload['body'].strip()},
                                                  technician_id=ticket[3])
    else:
        if 'expectedUpdatedAt' in payload and scope == 'it':
            payload = payload.copy()
            expected = payload.pop('expectedUpdatedAt')
            current = connection.execute('SELECT updated_at FROM service_desk_tickets WHERE id=?',
                                         (ticket_id,)).fetchone()[0]
            if current != expected:
                raise FileExistsError('This ticket has changed. Review the latest details before trying again.')
        if scope != 'it' and action != 'reopen':
            raise PermissionError('This action requires an authorised technician.')
        notification = change_ticket_lifecycle(connection, ticket_id, action, payload, ticket, actor, at)
        result = {'id': ticket_id}
    connection.execute('UPDATE service_desk_tickets SET updated_at=? WHERE id=?', (at, ticket_id))
    if notification is not None:
        result['notification'] = notification
    return result
