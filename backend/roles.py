"""Administrator role changes with a reviewed, session-bound confirmation.

The same account policy computes the preview and checks live access. Temporary
changes used for previews are always rolled back before returning a response.
"""
import hashlib
import hmac
import json
import re
import secrets
import sqlite3
import time

from backend.audit_events import record_actor_event
from backend.permissions import _admin, _target
from backend import role_policy
from backend.sessions import session_account

CONFIRMATION_SECONDS = 5 * 60
_CONFIRMATION_SECRET = secrets.token_bytes(32)


def _json(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=True)


def _validate_action(action):
    """Accept proposed values only, never a caller's claimed consequences."""
    if not isinstance(action, dict):
        raise ValueError("A role action is required")
    fields = {
        "role.create": {"type", "roleKey", "name", "grants"},
        "role.update": {"type", "roleId", "name", "enabled", "grants"},
        "role.delete": {"type", "roleId"},
        "membership.assign": {"type", "roleId", "userId"},
        "membership.remove": {"type", "roleId", "userId"},
        "override.set": {"type", "userId", "section", "level"},
    }
    kind = action.get("type")
    if not isinstance(kind, str) or kind not in fields or set(action) != fields[kind]:
        raise ValueError("Invalid role action fields")
    for key in ("roleId", "userId"):
        if key in action and (type(action[key]) is not int or action[key] <= 0):
            raise ValueError("Invalid role or account identifier")
    if "roleKey" in action and (not isinstance(action["roleKey"], str)
            or not re.fullmatch(r"[a-z][a-z0-9_]{0,79}", action["roleKey"])
            or action["roleKey"] == role_policy.STAFF_ROLE_KEY):
        raise ValueError("Invalid custom role key")
    if "name" in action and (not isinstance(action["name"], str)
            or action["name"] != action["name"].strip()
            or not 1 <= len(action["name"]) <= 80
            or any(ord(c) < 32 or ord(c) == 127 for c in action["name"])):
        raise ValueError("A role name must contain 1 to 80 printable characters")
    if "enabled" in action and type(action["enabled"]) is not bool:
        raise ValueError("Invalid role status")
    if "grants" in action:
        grants = action["grants"]
        if (not isinstance(grants, dict) or any(section not in role_policy.SECTIONS
                or level not in role_policy.LEVELS for section, level in grants.items())):
            raise ValueError("Invalid role grants")
    if kind == "override.set" and (action["section"] not in role_policy.SECTIONS
            or action["level"] not in (None, "deny", *role_policy.LEVELS)):
        raise ValueError("Invalid individual permission choice")
    return dict(action)


def _require_actor(connection, actor_id, session_token, now):
    if session_account(connection, session_token, now=now) != actor_id:
        raise PermissionError("Current administrator session required")
    _admin(connection, actor_id)


def role_catalogue(connection):
    """List stable role identifiers and configured grants for administrators."""
    return [{"id": role_id, "roleKey": key, "name": name, "enabled": bool(enabled),
             "isBuiltin": bool(builtin), "grants": dict(connection.execute(
                 "SELECT section,level FROM role_grants WHERE role_id=? ORDER BY section", (role_id,))),
             "accountCount": connection.execute(
                 "SELECT count(*) FROM account_roles WHERE role_id=?", (role_id,)).fetchone()[0]}
            for role_id, key, name, enabled, builtin in connection.execute(
                "SELECT id,role_key,name,enabled,is_builtin FROM roles ORDER BY id")]


def account_access_details(connection, account_id):
    """Describe inheritance separately from an overriding individual choice."""
    policy = role_policy.evaluate_role_policy(connection, account_id)
    roles = [{"id": row[0], "roleKey": row[1], "name": row[2], "enabled": bool(row[3]),
              "grants": dict(connection.execute(
                  "SELECT section,level FROM role_grants WHERE role_id=? ORDER BY section", (row[0],)))}
             for row in connection.execute(
                 "SELECT r.id,r.role_key,r.name,r.enabled FROM roles r JOIN account_roles a "
                 "ON a.role_id=r.id WHERE a.account_id=? ORDER BY r.id", (account_id,))]
    overrides = dict(connection.execute(
        "SELECT section,level FROM account_permission_overrides WHERE account_id=?", (account_id,)))
    sections = {}
    for section in role_policy.SECTIONS:
        sources = [{"roleId": role["id"], "level": role["grants"][section]}
                   for role in roles if role["enabled"] and section in role["grants"]
                   and role["roleKey"] != role_policy.STAFF_ROLE_KEY]
        inherited = max((source["level"] for source in sources),
                        key=lambda level: role_policy.LEVELS.index(level), default=None)
        effective = "edit" if policy.is_admin else policy.permissions.get(section)
        sections[section] = {"sources": sources, "inherited": inherited,
                             "override": overrides.get(section), "effective": effective,
                             "canRead": policy.allows(section),
                             "canEdit": policy.allows(section, edit=True)}
    return {"roles": roles, "sections": sections, "active": policy.active,
            "isAdmin": policy.is_admin, "mfaEnrolled": policy.mfa_enrolled,
            "mfaMandatory": policy.mfa_mandatory, "requiresMfa": policy.requires_mfa,
            "mfaPending": policy.requires_mfa and not policy.mfa_enrolled}


def _action_targets(connection, action):
    """Protect the baseline and identify every account whose role is involved."""
    if "userId" in action:
        _target(connection, action["userId"])
    if "roleId" in action:
        role = connection.execute("SELECT role_key,is_builtin FROM roles WHERE id=?",
                                  (action["roleId"],)).fetchone()
        if role is None:
            raise ValueError("Role not found")
        if role[1] or role[0] == role_policy.STAFF_ROLE_KEY:
            raise ValueError("Staff Member cannot be changed or unassigned")
    if "userId" in action:
        return [action["userId"]]
    if "roleId" in action:
        return [row[0] for row in connection.execute(
            "SELECT account_id FROM account_roles WHERE role_id=? ORDER BY account_id", (action["roleId"],))]
    return []


def _apply_values(connection, action):
    """Write proposed values inside the caller's preview or confirmation transaction."""
    kind = action["type"]
    if kind == "role.create":
        role_id = connection.execute(
            "INSERT INTO roles(role_key,name) VALUES(?,?)", (action["roleKey"], action["name"])).lastrowid
    elif kind == "role.update":
        role_id = action["roleId"]
        connection.execute("UPDATE roles SET name=?,enabled=? WHERE id=?",
                           (action["name"], int(action["enabled"]), role_id))
        connection.execute("DELETE FROM role_grants WHERE role_id=?", (role_id,))
    elif kind == "role.delete":
        connection.execute("DELETE FROM roles WHERE id=?", (action["roleId"],))
    elif kind == "membership.assign":
        connection.execute("INSERT INTO account_roles(account_id,role_id) VALUES(?,?)",
                           (action["userId"], action["roleId"]))
    elif kind == "membership.remove":
        removed = connection.execute("DELETE FROM account_roles WHERE account_id=? AND role_id=?",
                                     (action["userId"], action["roleId"]))
        if not removed.rowcount:
            raise ValueError("Role is not assigned to this account")
    elif kind == "override.set":
        connection.execute("DELETE FROM account_permission_overrides WHERE account_id=? AND section=?",
                           (action["userId"], action["section"]))
        if action["level"] is not None:
            connection.execute("INSERT INTO account_permission_overrides VALUES(?,?,?)",
                               (action["userId"], action["section"], action["level"]))
    if kind in ("role.create", "role.update"):
        connection.executemany("INSERT INTO role_grants VALUES(?,?,?)",
                               [(role_id, section, level) for section, level in action["grants"].items()])


def _security_snapshot(connection, account_ids, action):
    """Include private dependencies in the proof digest, never in its public preview."""
    accounts = []
    for account_id in sorted(set(account_ids)):
        accounts.append({
            "account": connection.execute("SELECT * FROM accounts WHERE id=?", (account_id,)).fetchone(),
            "roles": [list(row) for row in connection.execute(
                "SELECT r.id,r.role_key,r.name,r.enabled,r.is_builtin,g.section,g.level "
                "FROM account_roles a JOIN roles r ON r.id=a.role_id "
                "LEFT JOIN role_grants g ON g.role_id=r.id WHERE a.account_id=? ORDER BY r.id,g.section", (account_id,))],
            "overrides": connection.execute("SELECT section,level FROM account_permission_overrides WHERE account_id=? ORDER BY section", (account_id,)).fetchall(),
            "sessions": connection.execute("SELECT * FROM account_sessions WHERE account_id=? ORDER BY token_hash", (account_id,)).fetchall(),
            "email": connection.execute("SELECT email,email_verified FROM account_profiles WHERE account_id=?", (account_id,)).fetchone(),
        })
    # The catalogue also guards uniqueness, deletion and assignment changes, even
    # when a role currently has no members. No secret catalogue data is returned.
    names = {account["account"][1] for account in accounts}
    # Audit sequence numbers also notice a relevant change which was later
    # reversed. Returning to the old values does not renew an old confirmation.
    history = []
    for event_id, raw in connection.execute("SELECT id,record_json FROM inventory_change_history ORDER BY id"):
        event = json.loads(raw)
        if not isinstance(event, dict) or not isinstance(event.get("changes"), list):
            continue
        if any(change.get("kind") in ("Role", "Account", "Security")
               and (change.get("kind") == "Role" or change.get("label") in names)
               for change in event.get("changes", []) if isinstance(change, dict)):
            history.append(event_id)
    return {"accounts": accounts, "catalogue": role_catalogue(connection), "action": action, "history": history}


def _preview_impact(connection, actor_id, action, now):
    targets = _action_targets(connection, action)
    role_before = _audit_role_value(connection, action) if action["type"].startswith("role.") else None
    before = {user: account_access_details(connection, user) for user in targets}
    snapshot = _security_snapshot(connection, [actor_id, *targets], action)
    connection.execute("SAVEPOINT role_preview")
    try:
        _apply_values(connection, action)
        after = {user: account_access_details(connection, user) for user in targets}
        role_after = _audit_role_value(connection, action) if action["type"].startswith("role.") else None
        unchanged = snapshot == _security_snapshot(connection, [actor_id, *targets], action)
    finally:
        connection.execute("ROLLBACK TO role_preview")
        connection.execute("RELEASE role_preview")
    if unchanged:
        raise ValueError("The proposed role action makes no change")
    users = []
    for user in targets:
        prior, current = before[user], after[user]
        rights_changed = any(prior["sections"][section]["effective"] != current["sections"][section]["effective"]
                             for section in role_policy.SECTIONS)
        mfa_changed = any(prior[key] != current[key] for key in ("mfaMandatory", "requiresMfa", "mfaPending"))
        revoke = action["type"].startswith("membership.") or rights_changed or mfa_changed
        sessions = connection.execute("SELECT count(*) FROM account_sessions WHERE account_id=? AND expires_at>?",
                                      (user, now)).fetchone()[0]
        retained = {section: current["sections"][section]["effective"] for section in role_policy.SECTIONS
                    if prior["sections"][section]["effective"] and current["sections"][section]["effective"]}
        users.append({"userId": user, "username": connection.execute("SELECT username FROM accounts WHERE id=?", (user,)).fetchone()[0],
                      "before": prior, "after": current, "retainedPermissions": retained,
                      "sessionCount": sessions, "revokeSessions": revoke,
                      "revokedSessionCount": sessions if revoke else 0})
    preview = {"action": action, "available": True, "users": users, "accountCount": len(users),
               "revokedSessionCount": sum(user["revokedSessionCount"] for user in users)}
    if action["type"].startswith("role."):
        preview.update({"roleBefore": role_before, "roleAfter": role_after})
    return preview, hashlib.sha256(_json({"snapshot": snapshot, "preview": preview}).encode()).hexdigest()


def _confirmation_signature(session_token, contents):
    # Keep the signing key on the server. A cookie holder must not be able to
    # manufacture a confirmation by calculating a signature themselves.
    key = hmac.new(_CONFIRMATION_SECRET, bytes.fromhex(session_token), hashlib.sha256).digest()
    return hmac.new(key, b"caffoot-role-confirmation-v1:" + _json(contents).encode(), hashlib.sha256).hexdigest()


def _issue_preview(connection, actor_id, session_token, action, now):
    preview, digest = _preview_impact(connection, actor_id, action, now)
    proof = {"actorId": actor_id, "action": action, "state": digest,
             "expiresAt": int(now) + CONFIRMATION_SECONDS, "confirmationId": secrets.token_hex(16)}
    proof["signature"] = _confirmation_signature(session_token, proof)
    return {**preview, "proof": proof}


def preview_role_change(connection, actor_id, session_token, action, *, now=None):
    """Return an authoritative preview without saving any proposed change."""
    action = _validate_action(action)
    connection.execute("BEGIN IMMEDIATE")
    try:
        now = time.time() if now is None else now
        _require_actor(connection, actor_id, session_token, now)
        return _issue_preview(connection, actor_id, session_token, action, now)
    finally:
        connection.rollback()


def confirm_role_change(connection, actor_id, session_token, action, proof, *, now=None):
    """Recheck the displayed consequences, then save values, history and revocation together."""
    action = _validate_action(action)
    connection.execute("BEGIN IMMEDIATE")
    try:
        # Waiting for another writer must not extend a proof or session's life.
        now = time.time() if now is None else now
        _require_actor(connection, actor_id, session_token, now)
        try:
            fresh = _issue_preview(connection, actor_id, session_token, action, now)
        except (ValueError, sqlite3.IntegrityError):
            connection.rollback()
            return {"status": "confirmation required", "preview": {"action": action, "available": False, "proof": None,
                     "error": "The action is no longer available. Refresh the roles and accounts."}}
        valid = False
        if isinstance(proof, dict) and set(proof) == {"actorId", "action", "state", "expiresAt", "confirmationId", "signature"}:
            contents = {key: value for key, value in proof.items() if key != "signature"}
            identifier = proof["confirmationId"]
            valid = (type(proof["expiresAt"]) is int and now < proof["expiresAt"] <= now + CONFIRMATION_SECONDS
                     and type(proof["actorId"]) is int and proof["actorId"] == actor_id and proof["action"] == action
                     and proof["state"] == fresh["proof"]["state"]
                     and isinstance(identifier, str) and re.fullmatch(r"[a-f0-9]{32}", identifier)
                     and isinstance(proof["signature"], str)
                     and re.fullmatch(r"[a-f0-9]{64}", proof["signature"])
                     and hmac.compare_digest(proof["signature"], _confirmation_signature(session_token, contents))
                     and not connection.execute("SELECT 1 FROM inventory_change_history WHERE json_extract(record_json,'$.confirmationId')=? LIMIT 1", (identifier,)).fetchone())
        if not valid:
            connection.rollback()
            return {"status": "confirmation required", "preview": fresh}
        previous = _audit_role_value(connection, action) if action["type"].startswith("role.") else fresh["users"][0]["before"]
        _apply_values(connection, action)
        # Only explicit account/role data enters history; passwords, session tokens,
        # authenticator secrets and the confirmation proof are never recorded.
        label = (action.get("roleKey") or previous["roleKey"]) if action["type"].startswith("role.") else fresh["users"][0]["username"]
        after = _audit_role_value(connection, action) if action["type"].startswith("role.") else fresh["users"][0]["after"]
        record_actor_event(connection, actor_id, kind="Role" if action["type"].startswith("role.") else "Account",
                           action={"role.create": "Created", "role.delete": "Deleted"}.get(action["type"], "Updated"),
                           label=label, reason="Roles or individual permissions changed", fields=["Roles and permissions"],
                           before={"Roles and permissions": previous}, after={"Roles and permissions": after},
                           confirmation_id=proof["confirmationId"])
        for user in fresh["users"]:
            if user["revokeSessions"]:
                connection.execute("DELETE FROM account_sessions WHERE account_id=?", (user["userId"],))
                connection.execute("DELETE FROM account_email_proofs WHERE account_id=?", (user["userId"],))
        connection.commit()
        return {"status": "updated", "impact": {key: value for key, value in fresh.items() if key != "proof"},
                "notificationAccountIds": [user["userId"] for user in fresh["users"]]}
    except BaseException:
        connection.rollback()
        raise


def _audit_role_value(connection, action):
    """Keep the changed role readable in history after its active record is deleted."""
    return next((role for role in role_catalogue(connection)
                 if role["id"] == action.get("roleId") or role["roleKey"] == action.get("roleKey")), None)
