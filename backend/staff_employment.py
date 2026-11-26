"""Keep employment offboarding and login disablement in the same transaction."""
import json
from datetime import datetime, timezone

from backend.audit_events import audit_subject, record_actor_event
from backend.sessions import revoke_password_change_proof


def require_active_staff_login(connection, account_id):
    if connection.execute(
            'SELECT 1 FROM staff_members WHERE account_id=? AND active=0', (account_id,)).fetchone():
        raise ValueError('Reactivate the Staff Member before enabling their login')


def disable_employment_login(connection, account_id, *, actor_id=None):
    """Preserve administrator safeguards and revoke existing authentication proofs."""
    if not connection.in_transaction:
        raise RuntimeError('Employment changes require an active transaction')
    admin, active, username = connection.execute(
        'SELECT is_admin,active,username FROM accounts WHERE id=?', (account_id,)).fetchone()
    if account_id == actor_id:
        raise ValueError('Administrators cannot mark themselves as Left Company')
    if active and admin and connection.execute(
            'SELECT count(*) FROM accounts WHERE is_admin=1 AND active=1').fetchone()[0] <= 1:
        raise ValueError('Cannot disable the last active administrator')
    connection.execute('UPDATE accounts SET active=0 WHERE id=?', (account_id,))
    connection.execute('DELETE FROM account_sessions WHERE account_id=?', (account_id,))
    connection.execute('DELETE FROM account_email_proofs WHERE account_id=?', (account_id,))
    revoke_password_change_proof(connection, account_id)
    if not active:
        return
    values = dict(kind='Account', action='Updated', label=username,
                  fields=['Account status'], before={'Account status': 'Active'},
                  after={'Account status': 'Disabled'})
    if actor_id is not None:
        record_actor_event(connection, actor_id, **values,
            reason='Linked Staff Member marked as Left Company',
            subject=('Account', account_id, username))
    else:
        # An upgrade has no signed-in actor. Keep that provenance explicit.
        values.update(audit_subject('Account', account_id, username))
        event = dict(at=datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
                     actor='Application upgrade', outcome='Succeeded',
                     reason='Left Company linked login reconciled during upgrade', changes=[values], omitted=0)
        connection.execute('INSERT INTO inventory_change_history(record_json) VALUES(?)', (json.dumps(event),))


def reconcile_employment_logins(connection):
    """Fail before changing anything if legacy offboarding would remove every administrator."""
    targets = connection.execute(
        'SELECT a.id,a.is_admin FROM accounts a JOIN staff_members s ON s.account_id=a.id '
        'WHERE s.active=0 AND a.active=1').fetchall()
    if not targets:
        return
    administrators = connection.execute('SELECT count(*) FROM accounts WHERE active=1 AND is_admin=1').fetchone()[0]
    if any(admin for _, admin in targets) and administrators <= sum(bool(admin) for _, admin in targets):
        raise RuntimeError('Legacy Left Company logins include the last active administrator. '
                           'Upgrade stopped without changes; product owner approval is required.')
    for account_id, _ in targets:
        disable_employment_login(connection, account_id)
