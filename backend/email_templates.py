"""Store administrator-only template drafts, publications and shared branding."""
import base64
from contextlib import closing
import re
import sqlite3

from .audit_events import record_actor_event
from .email_logo import MAX_ENCODED_LOGO_BYTES, validate_logo
from .email_rendering import render_email, validate_email_wording
from .email_template_catalogue import (FICTIONAL_CODE, FICTIONAL_VALUES, TEMPLATES, VARIABLES,
                                      account_security_text)
from .permissions import _admin
from .sessions import session_account

MAX_BRANDING_REQUEST_BYTES = MAX_ENCODED_LOGO_BYTES + 16000
_COLOUR = re.compile(r'#[0-9a-fA-F]{6}')
EMAIL_SETTINGS_AUDIT_REASONS = frozenset({
    'Email template default loaded into editor', 'Email template draft saved',
    'Email template published', 'Company branding saved',
})
DEFAULT_BRANDING = {'name': 'Caffoot Lite', 'primary': '#213d56', 'accent': '#ed8532',
                    'footer': 'Please do not reply with passwords or other sensitive information.',
                    'logo': None, 'revision': 0}


def migrate_email_templates(connection):
    """Keep the settings and managed logo together in the existing SQLite backup."""
    connection.execute("""CREATE TABLE email_templates (
        id TEXT PRIMARY KEY, revision INTEGER NOT NULL,
        draft_subject TEXT, draft_body TEXT, published_subject TEXT, published_body TEXT,
        CHECK ((draft_subject IS NULL) = (draft_body IS NULL)),
        CHECK ((published_subject IS NULL) = (published_body IS NULL))
    )""")
    connection.execute("""CREATE TABLE email_branding (
        id INTEGER PRIMARY KEY CHECK(id=1), revision INTEGER NOT NULL,
        name TEXT NOT NULL, primary_colour TEXT NOT NULL, accent_colour TEXT NOT NULL,
        footer TEXT NOT NULL, logo_mime TEXT, logo_data BLOB, logo_width INTEGER, logo_height INTEGER,
        CHECK ((logo_mime IS NULL) = (logo_data IS NULL) AND
               (logo_width IS NULL) = (logo_data IS NULL) AND (logo_height IS NULL) = (logo_data IS NULL))
    )""")


def email_template_state(connection, template_id):
    template = TEMPLATES[template_id]
    default = {key: template[key] for key in ('subject', 'body')}
    row = connection.execute(
        'SELECT revision,draft_subject,draft_body,published_subject,published_body FROM email_templates WHERE id=?',
        (template_id,)).fetchone()
    revision, draft_subject, draft_body, published_subject, published_body = row or (0, None, None, None, None)
    return {
        'id': template_id, 'revision': revision, 'default': default,
        'draft': None if draft_subject is None else {'subject': draft_subject, 'body': draft_body},
        'published': default if published_subject is None else {'subject': published_subject, 'body': published_body},
        'publishedDefault': published_subject is None or (published_subject == default['subject']
                                                         and published_body == default['body']),
    }


def read_email_branding(connection):
    row = connection.execute(
        'SELECT revision,name,primary_colour,accent_colour,footer,logo_mime,logo_data,logo_width,logo_height '
        'FROM email_branding WHERE id=1').fetchone()
    if not row:
        return DEFAULT_BRANDING.copy()
    revision, name, primary, accent, footer, mime, data, width, height = row
    logo = {'mime': mime, 'data': data, 'width': width, 'height': height} if data is not None else None
    return {'revision': revision, 'name': name, 'primary': primary, 'accent': accent, 'footer': footer, 'logo': logo}


def public_email_branding(branding):
    logo = branding['logo']
    return {**branding, 'logo': {**logo, 'data': base64.b64encode(logo['data']).decode('ascii')} if logo else None}


def read_email_templates(connection, actor):
    _admin(connection, actor)
    templates = []
    for template_id, template in TEMPLATES.items():
        metadata = {key: template[key] for key in ('group', 'name', 'hint', 'event', 'to')}
        variables = [{'key': key, 'label': VARIABLES[key][0], 'help': VARIABLES[key][1]}
                     for key in template['variables']]
        templates.append({**email_template_state(connection, template_id), **metadata, 'variables': variables})
    return {'templates': templates, 'branding': public_email_branding(read_email_branding(connection))}


def require_email_revision(supplied, previous):
    if type(supplied) is not int or supplied < 0:
        raise ValueError('Reload Email Templates before saving.')
    if supplied != previous:
        raise FileExistsError('Another administrator changed these settings. Reload Settings before saving.')


def save_email_template(connection, actor, action, payload):
    template_id = payload.get('id')
    if not isinstance(template_id, str) or template_id not in TEMPLATES:
        raise ValueError('Select an email template.')
    current = email_template_state(connection, template_id)
    template = TEMPLATES[template_id]
    if action == 'restore' and payload.keys() == {'action', 'id'}:
        record_actor_event(connection, actor, kind='Settings', action='Updated', label=template['name'],
                           reason='Email template default loaded into editor', fields=['Email Template'],
                           subject=('Settings', 'email-template:' + template_id, template['name']))
        return current['default']
    fields = {'action', 'id', 'revision'}
    if action == 'draft':
        fields |= {'subject', 'body'}
    if payload.keys() != fields:
        raise ValueError('Invalid email template changes.')
    require_email_revision(payload['revision'], current['revision'])
    if action == 'draft':
        draft = validate_email_wording(template, payload['subject'], payload['body'], complete=False)
        connection.execute(
            'INSERT INTO email_templates(id,revision,draft_subject,draft_body) VALUES(?,?,?,?) '
            'ON CONFLICT(id) DO UPDATE SET revision=excluded.revision,draft_subject=excluded.draft_subject,'
            'draft_body=excluded.draft_body', (template_id, current['revision'] + 1, draft['subject'], draft['body']))
        reason = 'Email template draft saved'
    else:
        if current['draft'] is None:
            raise FileExistsError('Save a draft before publishing.')
        draft = validate_email_wording(template, **current['draft'], complete=True)
        connection.execute(
            'UPDATE email_templates SET revision=revision+1,published_subject=?,published_body=?,'
            'draft_subject=NULL,draft_body=NULL WHERE id=?', (draft['subject'], draft['body'], template_id))
        reason = 'Email template published'
    record_actor_event(connection, actor, kind='Settings', action='Updated', label=template['name'],
                       reason=reason, fields=['Email Template'],
                       subject=('Settings', 'email-template:' + template_id, template['name']))
    return email_template_state(connection, template_id)


def validate_branding_fields(payload):
    name, primary, accent, footer = (payload.get(key) for key in ('name', 'primary', 'accent', 'footer'))
    if (not isinstance(name, str) or not name.strip() or len(name) > 80
            or any(ord(char) < 32 or char == '\x7f' or 0xd800 <= ord(char) <= 0xdfff for char in name)):
        raise ValueError('Enter a Company Name of up to 80 characters.')
    if any(not isinstance(colour, str) or not _COLOUR.fullmatch(colour) for colour in (primary, accent)):
        raise ValueError('Choose a valid Primary Colour and Accent Colour.')
    if (not isinstance(footer, str) or len(footer) > 2000
            or any((ord(char) < 32 and char not in '\t\r\n') or 0xd800 <= ord(char) <= 0xdfff for char in footer)):
        raise ValueError('Enter an Email Footer of up to 2,000 characters.')
    return {'name': name.strip(), 'primary': primary.lower(), 'accent': accent.lower(),
            'footer': footer.replace('\r\n', '\n').replace('\r', '\n').strip()}


def save_email_branding(connection, actor, payload):
    if payload.keys() != {'action', 'revision', 'name', 'primary', 'accent', 'footer', 'logo'}:
        raise ValueError('Invalid Company Branding settings.')
    current = read_email_branding(connection)
    require_email_revision(payload['revision'], current['revision'])
    branding = validate_branding_fields(payload)
    supplied_logo = payload['logo']
    logo = current['logo'] if supplied_logo == 'keep' else (None if supplied_logo is None else validate_logo(supplied_logo))
    revision = current['revision'] + 1
    connection.execute(
        'INSERT INTO email_branding(id,revision,name,primary_colour,accent_colour,footer,'
        'logo_mime,logo_data,logo_width,logo_height) VALUES(1,?,?,?,?,?,?,?,?,?) '
        'ON CONFLICT(id) DO UPDATE SET revision=excluded.revision,name=excluded.name,'
        'primary_colour=excluded.primary_colour,accent_colour=excluded.accent_colour,footer=excluded.footer,'
        'logo_mime=excluded.logo_mime,logo_data=excluded.logo_data,logo_width=excluded.logo_width,'
        'logo_height=excluded.logo_height',
        (revision, *branding.values(), *((logo['mime'], logo['data'], logo['width'], logo['height'])
                                        if logo else (None, None, None, None))))
    record_actor_event(connection, actor, kind='Settings', action='Updated', label='Company Branding',
                       reason='Company branding saved', fields=['Company Branding'],
                       subject=('Settings', 'company-branding', 'Company Branding'))
    return public_email_branding({**branding, 'logo': logo, 'revision': revision})


def mutate_email_templates(connection, actor, session_token, payload):
    """Check the active administrator again inside the transaction used for saving."""
    with connection:
        connection.execute('BEGIN IMMEDIATE')
        if session_account(connection, session_token) != actor:
            raise PermissionError('Verified administrator session required.')
        _admin(connection, actor)
        action = payload.get('action') if isinstance(payload, dict) else None
        if action == 'branding':
            return save_email_branding(connection, actor, payload)
        if action in ('draft', 'publish', 'restore'):
            return save_email_template(connection, actor, action, payload)
        raise ValueError('Invalid Email Templates action.')


def sample_email(connection, actor, payload, *, complete=False):
    """Use only fictional records, even if the administrator supplies extra fields."""
    _admin(connection, actor)
    allowed = {'action', 'id', 'subject', 'body', 'recipient'} if complete else {'action', 'id', 'subject', 'body'}
    if not isinstance(payload, dict) or payload.keys() != allowed:
        raise ValueError('Invalid sample email.')
    template_id = payload['id']
    if not isinstance(template_id, str) or template_id not in TEMPLATES:
        raise ValueError('Select an email template.')
    template = TEMPLATES[template_id]
    wording = validate_email_wording(template, payload['subject'], payload['body'], complete=complete)
    branding = read_email_branding(connection)
    logo = branding['logo']
    if template['group'] == 'account':
        values = {**FICTIONAL_VALUES, 'company_name': branding['name']}
        mail = render_email(template, wording, branding, values,
                            [('', account_security_text(template_id, FICTIONAL_CODE))],
                            logo_source='cid:company-logo', preview=not complete)
    else:
        statuses = {'ticket-created': 'Open', 'ticket-hold': 'On Hold', 'ticket-closed': 'Closed'}
        values = {**FICTIONAL_VALUES, 'ticket_status': statuses.get(template_id, '')}
        mail = render_ticket_email(template_id, wording, branding, values, preview=not complete)
    if not complete:
        mail['brandingRevision'] = branding['revision']
    return mail, logo


def render_ticket_email(template_id, wording, branding, values, *, preview=False):
    template = TEMPLATES[template_id]
    details = [(label, values.get(key, '')) for label, key in template['locked']
               if values.get(key)]
    if template_id == 'ticket-reopened':
        details.append(('Status', 'Open (Reopened)'))
    return render_email(template, wording, branding, values, details,
                        logo_source='cid:company-logo', preview=preview)


def sample_email_branding(connection, actor, payload):
    """Preview unsaved branding fields using a single fictional notification."""
    _admin(connection, actor)
    if payload.keys() != {'action', 'name', 'primary', 'accent', 'footer'}:
        raise ValueError('Invalid sample branding.')
    branding = validate_branding_fields(payload)
    template = TEMPLATES['ticket-closed']
    wording = {'subject': 'Sample Caffoot notification',
               'body': '<p>Hello {{employee_name}},</p><p>This is a sample support email showing your '
                       'company name, colours and footer.</p><p>Branding is shared across supported templates.</p>'}
    return render_email(template, wording, branding, FICTIONAL_VALUES,
                        [('Notification', 'Fictional sample only')], preview=True)


def render_account_email(database_path, template_id, security_text, display_name):
    """Use the published wording and a consistent branding snapshot for account mail."""
    with closing(sqlite3.connect(database_path, timeout=10)) as connection:
        connection.execute('BEGIN')
        branding = read_email_branding(connection)
        template = TEMPLATES[template_id]
        wording = email_template_state(connection, template_id)['published']
    logo = branding['logo']
    values = {'company_name': branding['name'], 'recipient_name': display_name}
    mail = render_email(template, wording, branding, values, [('', security_text)], logo_source='cid:company-logo')
    return mail, logo
