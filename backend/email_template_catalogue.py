"""The approved email types, editor variables and built-in wording for Caffoot Lite."""

VARIABLES = {
    'employee_name': ('Employee Name', 'Display name of the authorised employee.'),
    'technician_name': ('Technician Name', 'Display name of the assigned technician.'),
    'recipient_name': ('Recipient Name', 'The account display name, if one is available.'),
    'company_name': ('Company Name', 'Company Name from the shared branding settings.'),
    'ticket_number': ('Ticket Number', 'The ticket reference, such as SD-0048.'),
    'device_name': ('Device / Asset', 'Name of the authorised equipment linked to the ticket.'),
    'ticket_status': ('Ticket Status', 'The status from the approved notification event.'),
    'resolution_note': ('Resolution Note', 'The required employee-visible closure resolution.'),
    'ticket_link': (
        'Secure Ticket Link',
        'A ticket address that still requires sign-in and ticket access.',
    ),
    'hold_reason': ('On Hold Reason', 'The selected employee-visible reason.'),
    'hold_explanation': (
        'Visible Explanation',
        'Included only when IT deliberately makes it visible to the employee.',
    ),
    'visible_update': ('Employee-Visible Update', 'Text of the update visible to the employee.'),
    'employee_reply': ('Employee Reply', 'The employee’s authorised reply.'),
}

TEMPLATES = {
    'ticket-closed': {
        'group': 'service',
        'name': 'Ticket Closed',
        'hint': 'Employee · Resolution recorded',
        'to': 'employee@example.invalid',
        'event': 'Authorised employee when a ticket is closed',
        'subject': 'Your Caffoot request {{ticket_number}} has been closed',
        'body': (
            '<p>Hello {{employee_name}},</p><p>We have closed your support ticket '
            '<strong>{{ticket_number}}</strong> relating to '
            '<strong>{{device_name}}</strong>.</p><p><strong>Resolution:</strong> '
            '{{resolution_note}}</p><p>If you still need help, you may be able to reopen this ticket in '
            'Caffoot Lite.</p><p>Kind regards,<br>The IT Support Team</p>'
        ),
        'variables': (
            'employee_name', 'ticket_number', 'device_name', 'ticket_status', 'resolution_note',
            'ticket_link',
        ),
        'locked': (
            ('Ticket', 'ticket_number'),
            ('Equipment', 'device_name'),
            ('Status', 'ticket_status'),
            ('Resolution', 'resolution_note'),
        ),
    },
    'ticket-hold': {
        'group': 'service',
        'name': 'Ticket On Hold',
        'hint': 'Employee · Reason shown',
        'to': 'employee@example.invalid',
        'event': 'Authorised employee when a ticket is put On Hold',
        'subject': 'Update on your ticket {{ticket_number}} — On Hold',
        'body': (
            '<p>Hello {{employee_name}},</p><p>Your ticket <strong>{{ticket_number}}</strong> for '
            '<strong>{{device_name}}</strong> has been placed <strong>On '
            'Hold</strong>.</p><p><strong>Reason:</strong> {{hold_reason}}</p><p>We will update you when '
            'we are able to continue.</p><p>Kind regards,<br>The IT Support Team</p>'
        ),
        'variables': (
            'employee_name', 'ticket_number', 'device_name', 'ticket_status', 'hold_reason',
            'hold_explanation', 'ticket_link',
        ),
        'locked': (
            ('Ticket', 'ticket_number'),
            ('Equipment', 'device_name'),
            ('Status', 'ticket_status'),
            ('Reason', 'hold_reason'),
            ('Visible Explanation', 'hold_explanation'),
        ),
    },
    'ticket-update': {
        'group': 'service',
        'name': 'Ticket Update',
        'hint': 'Employee · Visible IT update',
        'to': 'employee@example.invalid',
        'event': 'Employee-visible IT update only (never internal notes)',
        'subject': 'A new update on ticket {{ticket_number}}',
        'body': (
            '<p>Hello {{employee_name}},</p><p>The IT team has posted a new update on '
            '<strong>{{ticket_number}}</strong>.</p><p>{{visible_update}}</p><p>You can view the ticket '
            'securely in Caffoot Lite.</p>'
        ),
        'variables': ('employee_name', 'ticket_number', 'device_name', 'visible_update', 'ticket_link'),
        'locked': (
            ('Ticket', 'ticket_number'),
            ('Equipment', 'device_name'),
            ('Visible Update', 'visible_update'),
        ),
    },
    'ticket-assigned': {
        'group': 'service',
        'name': 'Ticket Assigned',
        'hint': 'IT technician · Not self-assignment',
        'to': 'technician@example.invalid',
        'event': 'Receiving technician when assigned/reassigned by someone else',
        'subject': 'Ticket {{ticket_number}} assigned to you',
        'body': (
            '<p>Hello {{technician_name}},</p><p>You have been assigned ticket '
            '<strong>{{ticket_number}}</strong> concerning <strong>{{device_name}}</strong>.</p><p>Sign in'
            ' to Caffoot Lite to view the authorised ticket details.</p>'
        ),
        'variables': ('technician_name', 'ticket_number', 'device_name', 'ticket_link'),
        'locked': (('Ticket', 'ticket_number'), ('Equipment', 'device_name')),
    },
    'ticket-reply': {
        'group': 'service',
        'name': 'Employee Reply',
        'hint': 'IT technician · Employee reply',
        'to': 'technician@example.invalid',
        'event': 'Current assigned technician when an employee replies',
        'subject': 'Employee replied to ticket {{ticket_number}}',
        'body': (
            '<p>Hello {{technician_name}},</p><p>An employee has replied to ticket '
            '<strong>{{ticket_number}}</strong>.</p><p><strong>Reply:</strong> '
            '{{employee_reply}}</p><p>View the full conversation securely in Caffoot Lite.</p>'
        ),
        'variables': ('technician_name', 'ticket_number', 'employee_reply', 'ticket_link'),
        'locked': (('Ticket', 'ticket_number'), ('Employee Reply', 'employee_reply')),
    },
    'ticket-reopened': {
        'group': 'service',
        'name': 'Ticket Reopened',
        'hint': 'IT technician · Previously assigned',
        'to': 'technician@example.invalid',
        'event': 'Previously assigned technician when a closed ticket is reopened',
        'subject': 'Ticket {{ticket_number}} has been reopened',
        'body': (
            '<p>Hello {{technician_name}},</p><p>Ticket <strong>{{ticket_number}}</strong> for '
            '<strong>{{device_name}}</strong> has been reopened.</p><p>Please review the ticket in Caffoot'
            ' Lite.</p>'
        ),
        'variables': ('technician_name', 'ticket_number', 'device_name', 'ticket_link'),
        'locked': (('Ticket', 'ticket_number'), ('Equipment', 'device_name')),
    },
    'email-verification': {
        'group': 'account',
        'name': 'Email Verification',
        'hint': 'Account · Email ownership',
        'to': 'account.user@example.invalid',
        'event': 'Account holder requesting email verification',
        'subject': 'Caffoot Lite email verification',
        'body': '<p>Use the verification instructions below to confirm your email address.</p>',
        'variables': ('company_name', 'recipient_name'),
    },
    'password-recovery': {
        'group': 'account',
        'name': 'Password Recovery',
        'hint': 'Account · Verified email',
        'to': 'account.user@example.invalid',
        'event': 'Account holder with a verified recovery email address',
        'subject': 'Caffoot Lite password recovery',
        'body': '<p>Use the recovery instructions below to recover access to your account.</p>',
        'variables': ('company_name', 'recipient_name'),
    },
    'account-security-notice': {
        'group': 'account',
        'name': 'Account Security Notice',
        'hint': 'Account · Security changes',
        'to': 'account.user@example.invalid',
        'event': 'Eligible recipients of an account security change',
        'subject': 'Caffoot Lite account security notice',
        'body': '<p>Please review the account security information below.</p>',
        'variables': ('company_name',),
    },
}

FICTIONAL_VALUES = {
    'employee_name': 'Alex Morgan',
    'technician_name': 'Sam Patel',
    'recipient_name': 'Jordan Taylor',
    'ticket_number': 'SD-0048',
    'device_name': 'Laptop-017',
    'resolution_note': 'Printer driver reinstalled and tested.',
    'ticket_link': 'https://support.example.invalid/tickets/SD-0048',
    'hold_reason': 'Waiting for Parts',
    'hold_explanation': 'The replacement part is due on Thursday.',
    'visible_update': 'We have arranged a replacement charger.',
    'employee_reply': 'The replacement device is working well.',
}
FICTIONAL_CODE = '12345678'

SECURITY_NOTICE = (
    'An important account, password, email, MFA, role or permission change occurred. '
    'Active sessions may have ended and MFA may be required before continuing. '
    'Sign in to your Caffoot Lite installation to review its protected Audit Trail. '
    'Contact your administrator if you did not expect this change.'
)


def account_security_text(template_id, code=None):
    """Keep the working instructions and single-use code outside editable wording."""
    if template_id == 'account-security-notice':
        return SECURITY_NOTICE
    instruction = 'Confirm email ownership' if template_id == 'email-verification' else 'Recover your password'
    return (
        f'{instruction} by entering this single-use code in your Caffoot Lite installation:\n\n{code}'
        '\n\nIt expires in 15 minutes. Required authenticator protection still applies. '
        'If you did not request this, ignore this message.'
    )
