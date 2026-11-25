"""Private unread reply counts and exact, session-bound conversation acknowledgements."""
import hashlib
import hmac
import json
import secrets
import time

from backend.service_desk_access import ticket_scope_filter

# Separate from the session/CSRF proof: a client cannot mint a conversation
# acknowledgement even if it possesses its own session token. Restarting the
# server invalidates outstanding proofs, not the durable read receipts.
_PROOF_KEY = secrets.token_bytes(32)
_PROOF_SECONDS = 300

_ELIGIBLE = """
    message.actor_id<>? AND (? OR message.employee_visible=1)
    AND message.kind IN ('Reply','IT Update','Resolution Note')
    AND NOT EXISTS (
        SELECT 1 FROM service_desk_events event
        WHERE event.ticket_id=message.ticket_id AND event.kind='Created'
          AND json_extract(event.details,'$.attachmentMessageId')=message.id
    )
"""
_UNREAD = _ELIGIBLE + """
    AND NOT EXISTS (
        SELECT 1 FROM service_desk_message_reads receipt
        WHERE receipt.account_id=? AND receipt.message_id=message.id
    )
"""
UNREAD_COUNT = f"""(SELECT count(*) FROM service_desk_messages message
    WHERE message.ticket_id=ticket.id AND {_UNREAD})"""


def unread_parameters(actor_id, scope):
    return actor_id, scope == 'it', actor_id


def read_unread_counts(connection, actor_id, scope):
    """Count distinct accessible tickets, independently of list filters/pages."""
    def count(allowed, values, audience):
        return connection.execute(f"""
            SELECT count(*) FROM service_desk_tickets ticket
            WHERE ({allowed}) AND {UNREAD_COUNT}>0
        """, (*values, *unread_parameters(actor_id, audience))).fetchone()[0]

    if scope == 'it':
        allowed, values = ticket_scope_filter(connection, actor_id, scope)
        return {'it': count(allowed, values, scope)}
    if scope not in ('personal', 'department'):
        raise ValueError('Invalid ticket scope.')
    personal, personal_values = ticket_scope_filter(connection, actor_id, 'personal')
    department, department_values = ticket_scope_filter(connection, actor_id, 'department')
    return {
        'personal': count(personal, personal_values, 'personal'),
        'department': count(department, department_values, 'department'),
        'combined': count(f'({personal}) OR ({department})',
                          (*personal_values, *department_values), 'personal'),
    }


def _eligible_ids(connection, actor_id, scope, ticket_id, maximum):
    return [row[0] for row in connection.execute(f"""
        SELECT message.id FROM service_desk_messages message
        WHERE message.ticket_id=? AND message.id<=? AND {_ELIGIBLE}
        ORDER BY message.id
    """, (ticket_id, maximum, actor_id, scope == 'it'))]


def _signature(session, actor_id, scope, ticket_id, expires, maximum, identities):
    data = json.dumps([session, actor_id, scope, ticket_id, expires, maximum, identities],
                      separators=(',', ':')).encode('utf-8')
    return hmac.new(_PROOF_KEY, data, hashlib.sha256).hexdigest()


def conversation_read_proof(connection, actor_id, scope, ticket_id, session, messages):
    """Called only in the authorised read transaction that returned these rows."""
    if not session or not messages:
        return None
    maximum = max(message['id'] for message in messages)
    returned = {message['id'] for message in messages}
    identities = _eligible_ids(connection, actor_id, scope, ticket_id, maximum)
    if not identities or not set(identities).issubset(returned):
        return None
    expires = int(time.time()) + _PROOF_SECONDS
    return f'{expires}.{maximum}.' + _signature(
        session, actor_id, scope, ticket_id, expires, maximum, identities)


def acknowledge_conversation(connection, actor_id, scope, ticket_id, session, payload):
    """Caller must hold BEGIN IMMEDIATE and have rechecked session/ticket access.

    The upper bound is only a query limit: the signature also authenticates
    every eligible identity in the exact returned snapshot. A changed set
    cannot be acknowledged. Newer messages remain unread.
    """
    if not connection.in_transaction:
        raise RuntimeError('Read acknowledgement requires an active transaction')
    if not session or set(payload) != {'proof'} or not isinstance(payload['proof'], str):
        raise ValueError('Invalid conversation acknowledgement.')
    parts = payload['proof'].split('.')
    if (len(parts) != 3 or any(not part.isascii() or not part.isdecimal() or len(part)>19
                               for part in parts[:2]) or len(parts[2]) != 64
            or any(character not in '0123456789abcdef' for character in parts[2])):
        raise ValueError('Invalid conversation acknowledgement.')
    expires, maximum = map(int, parts[:2])
    now = time.time()
    if not now < expires <= now + _PROOF_SECONDS or not 0 < maximum <= 2**63-1:
        raise PermissionError('Conversation acknowledgement expired or invalid.')
    identities = _eligible_ids(connection, actor_id, scope, ticket_id, maximum)
    expected = _signature(session, actor_id, scope, ticket_id, expires, maximum, identities)
    if not hmac.compare_digest(parts[2], expected):
        raise PermissionError('Conversation acknowledgement no longer valid.')
    connection.executemany("""
        INSERT INTO service_desk_message_reads(account_id,message_id) VALUES(?,?)
        ON CONFLICT(account_id,message_id) DO NOTHING
    """, ((actor_id, identity) for identity in identities))
    return {'unreadCount': connection.execute(f"""
        SELECT {UNREAD_COUNT} FROM service_desk_tickets ticket WHERE ticket.id=?
    """, (*unread_parameters(actor_id, scope), ticket_id)).fetchone()[0]}
