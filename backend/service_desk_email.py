"""Deliver committed Service Desk events through the shared email queue."""
from contextlib import closing
from dataclasses import replace
import smtplib
import sqlite3

from .account_email import queue_mail_task
from .email_rendering import safe_email_url
from .email_templates import email_template_state, read_email_branding, render_ticket_email
from .service_desk import TICKET_EQUIPMENT_LABEL, require_ticket
from .service_desk_access import TICKET_CUSTODY
from .smtp_settings import config_path, deliver_email, read_delivery_settings


def queue_ticket_email(database_path, origin, ticket_id, notification):
    # One job per event. A large Department must not consume one queue slot per member.
    return queue_mail_task(lambda: send_ticket_email(database_path, origin, ticket_id, notification))


def department_device_members(connection, ticket_id):
    """Resolve the Department audience from the ticket's physical custody ID."""
    assignment = connection.execute(f"""
        SELECT a.id,a.ended_at FROM service_desk_tickets ticket
        JOIN device_assignments a ON a.id={TICKET_CUSTODY}
        WHERE ticket.id=? AND a.staff_id IS NULL
    """, (ticket_id,)).fetchone()
    if assignment is None:
        return None
    if assignment[1] is not None:
        return []
    return connection.execute("""
        SELECT DISTINCT s.account_id,r.id FROM device_assignment_departments r
        JOIN staff_members s ON s.department_id=r.department_id
        WHERE r.assignment_id=? AND r.removed_at IS NULL AND s.active=1 AND s.account_id IS NOT NULL
        ORDER BY s.account_id
    """, (assignment[0],)).fetchall()


def snapshot_department_notice(connection, ticket_id, notification):
    """A later addition must never receive an already recorded Device update."""
    if notification is None or notification.technician_id is not None or notification.template_id == 'ticket-created':
        return notification
    members = department_device_members(connection, ticket_id)
    if members is None:
        return notification
    return replace(notification, department_members=tuple(
        (account, relationship) for account, relationship in members
        if authorised_mailbox(connection, 'department', ticket_id, account)))


def employee_audience(connection, ticket_id):
    members = department_device_members(connection, ticket_id)
    if members is not None:
        return 'department', [account for account, _ in members]
    assignment = connection.execute(f"""
        SELECT issue.department_id,ticket.employee_id,link.id,{TICKET_CUSTODY}
        FROM service_desk_tickets ticket
        LEFT JOIN it_asset_stock_entries issue ON issue.id=ticket.stock_issue_id
        LEFT JOIN device_equipment_associations link ON link.issue_entry_id=issue.id
        WHERE ticket.id=?
    """, (ticket_id,)).fetchone()
    if assignment is None:
        return 'personal', []
    department, employee, link, custody = assignment
    if link is not None:
        if custody is None:
            return 'personal', []
        # Department custody was handled above. For personal custody the live
        # ticket check below still requires both the link and stock period.
        department = None
    if department is not None:
        accounts = connection.execute(
            'SELECT account_id FROM staff_members WHERE department_id=? AND active=1 AND account_id IS NOT NULL '
            'ORDER BY account_id',
            (department,),
        )
        return 'department', [row[0] for row in accounts]
    account = connection.execute(
        'SELECT account_id FROM staff_members WHERE id=? AND active=1 AND account_id IS NOT NULL',
        (employee,),
    ).fetchone()
    return 'personal', [account[0]] if account else []


def authorised_mailbox(connection, scope, ticket_id, account_id, *, require_current_assignee=False):
    try:
        ticket = require_ticket(connection, account_id, scope, ticket_id)
    except (PermissionError, LookupError):
        return None
    if scope == 'it':
        # Replies and reopens apply to the current assignee. Assignment informs
        # the receiving technician of the committed change while access remains.
        if require_current_assignee and ticket[3] != account_id:
            return None
        return connection.execute("""
            SELECT p.email, coalesce(nullif(p.display_name,''), a.username)
            FROM accounts a JOIN account_profiles p ON p.account_id=a.id
            WHERE a.id=? AND a.active=1 AND p.email_verified=1 AND p.email<>''
        """, (account_id,)).fetchone()
    return connection.execute("""
        SELECT p.email, trim(s.first_name||' '||s.last_name)
        FROM staff_members s JOIN account_profiles p ON p.account_id=s.account_id
        WHERE s.account_id=? AND s.active=1 AND p.email_verified=1 AND p.email<>''
    """, (account_id,)).fetchone()


def send_ticket_email(database_path, origin, ticket_id, notification):
    smtp = read_delivery_settings(config_path(database_path))
    if smtp is None:
        return
    template_id = notification.template_id
    created = template_id == 'ticket-created'
    if created and not smtp['itSupportEmail']:
        return
    with closing(sqlite3.connect(database_path, timeout=10)) as connection:
        with connection:
            connection.execute('BEGIN')
            ticket = connection.execute(f"""
                SELECT {TICKET_EQUIPMENT_LABEL} FROM service_desk_tickets ticket WHERE ticket.id=?
            """, (ticket_id,)).fetchone()
            if ticket is None:
                return
            branding = read_email_branding(connection)
            wording = email_template_state(connection, template_id)['published']
            if created:
                scope, accounts = 'it', [None]
            elif notification.technician_id is not None:
                scope, accounts = 'it', [notification.technician_id]
            else:
                scope, accounts = employee_audience(connection, ticket_id)
                original = dict(notification.department_members or ())
                if notification.department_members is not None:
                    accounts = [account for account in accounts if account in original]
        page = 'inventory' if scope == 'it' else 'account'
        link = f'{origin}/{page}?ticket={scope}-{ticket_id}'
        if not safe_email_url(link):
            return
        values = {**notification.values, 'ticket_number': f'SD-{ticket_id:04d}', 'ticket_link': link}
        if not created:
            values['device_name'] = ticket[0] or ''
        sent_addresses = set()
        for account_id in accounts:
            if created:
                recipient = smtp['itSupportEmail']
            else:
                # Check live membership, custody, role, MFA and the verified address
                # immediately before each individual send, outside the write transaction.
                with connection:
                    connection.execute('BEGIN')
                    if notification.department_members is not None and (
                        account_id, original[account_id]
                    ) not in department_device_members(connection, ticket_id):
                        continue
                    mailbox = authorised_mailbox(
                        connection, scope, ticket_id, account_id,
                        require_current_assignee=template_id in ('ticket-reply', 'ticket-reopened'),
                    )
                if mailbox is None:
                    continue
                recipient, name = mailbox
                values['technician_name' if scope == 'it' else 'employee_name'] = name
            address = recipient.strip().casefold()
            if address in sent_addresses:
                continue
            mail = render_ticket_email(template_id, wording, branding, values)
            try:
                deliver_email(smtp, recipient, mail['subject'], mail['text'],
                              html=mail['html'], logo=branding['logo'])
                sent_addresses.add(address)
            except (smtplib.SMTPException, OSError, ValueError):
                # A failed delivery cannot undo the ticket or suppress other recipients.
                continue
