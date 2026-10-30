"""Caffoot Lite Next HTTPS backend and inventory integration groundwork."""
import json
import os
import sqlite3
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

from .device_saves import create_device, save_reserved_device
from .schema import initialise_database as migrate_database
from .accounts import bootstrap_first_admin, confirm_admin_mfa, verify_password, hash_password
from .mfa import new_secret, verify_code
from .import_drafts import ImportDrafts
from .request_auth import authenticated_account, csrf_for_session
from .http_security import read_session_cookie, session_cookie, clear_session_cookie
from .request_auth import login, logout
from .permissions import (can_access, create_user, set_permission,
                          set_account_active, set_administrator, delete_user)
from .request_auth import authorised_mutation
from .http_security import require_same_origin
from .tls import ensure_certificate
from .deployment_settings import validate_published_port

DB_PATH = Path(os.environ.get("CAFFOOT_DB_PATH", "/data/caffoot.sqlite3"))
HOST = os.environ.get("CAFFOOT_HOST", "0.0.0.0")
PORT = 8080  # Fixed internal port; Compose publishes the configurable host port.
PUBLIC_ORIGIN = os.environ.get("CAFFOOT_WEB_ADDRESS", "")
MAX_LOGIN_BYTES = 4096
MAX_IMPORT_BYTES = 10 * 1024 * 1024
IMPORT_DRAFTS = ImportDrafts()
IMPORT_ROUTES = frozenset(("/api/import/preview", "/api/import/access-point-choices",
                           "/api/import/confirm", "/api/import/cancel"))
TLS_DIR = Path(os.environ.get("CAFFOOT_TLS_DIR", "/data/tls"))
TLS_NAMES = os.environ.get("CAFFOOT_SERVER_ADDRESS", "")


def validate_public_origin(value):
    """Accept only an explicit canonical HTTPS browser origin."""
    if not isinstance(value, str) or not value or value != value.strip():
        raise ValueError("CAFFOOT_WEB_ADDRESS is required")
    try:
        parsed = urlsplit(value)
        port = parsed.port
    except ValueError as exc:
        raise ValueError("invalid HTTPS origin") from exc
    if (parsed.scheme != "https" or not parsed.hostname or
            parsed.username is not None or parsed.password is not None or
            parsed.path or parsed.query or parsed.fragment or
            parsed.netloc.endswith(":") or
            value != "https://" + parsed.netloc):
        raise ValueError("CAFFOOT_WEB_ADDRESS must be an HTTPS origin without path or credentials")
    return value


def connect():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH, timeout=10)
    connection.execute("PRAGMA foreign_keys=ON")
    connection.execute("PRAGMA busy_timeout=10000")
    return connection


def initialise_database():
    with connect() as connection:
        migrate_database(connection)


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path in ("/", "/setup"):
            body = (Path(__file__).resolve().parent.parent / "setup.html").read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.send_header("X-Content-Type-Options", "nosniff")
            self.end_headers()
            self.wfile.write(body)
            return
        if self.path == "/health":
            try:
                with connect() as connection:
                    connection.execute("SELECT 1").fetchone()
                self.respond(200, {"status": "ok"})
            except sqlite3.Error:
                self.respond(503, {"status": "unavailable"})
        elif self.path == "/api/setup/status":
            with connect() as connection:
                configured = connection.execute("SELECT 1 FROM accounts LIMIT 1").fetchone() is not None
                pending = configured and connection.execute("SELECT 1 FROM accounts WHERE is_admin=1 AND mfa_confirmed=1 LIMIT 1").fetchone() is None
            self.respond(200, {"setupRequired": not configured, "enrollmentPending": pending})
        elif self.path == "/api/users":
            with connect() as connection:
                account_id = authenticated_account(connection, self.headers.get("Cookie"))
                if account_id is None:
                    self.respond(401, {"error": "unauthorised"})
                    return
                administrator = connection.execute(
                    "SELECT is_admin,active,mfa_confirmed FROM accounts WHERE id=?",
                    (account_id,),
                ).fetchone()
                if administrator != (1, 1, 1):
                    self.respond(403, {"error": "forbidden"})
                    return
                users = []
                for user_id, username, is_admin, active, mfa_confirmed in connection.execute(
                    "SELECT id,username,is_admin,active,mfa_confirmed FROM accounts ORDER BY id"
                ):
                    permissions = {section: level for section, level in connection.execute(
                        "SELECT section,level FROM account_permissions WHERE account_id=?",
                        (user_id,),
                    )}
                    users.append({
                        "id": user_id, "username": username,
                        "isAdmin": bool(is_admin), "active": bool(active),
                        "mfaEnrolled": bool(mfa_confirmed),
                        "permissions": permissions,
                    })
                self.respond(200, {"users": users})
        elif self.path == "/api/inventory/sections":
            with connect() as connection:
                account_id = authenticated_account(connection, self.headers.get("Cookie"))
                if account_id is None:
                    self.respond(401, {"error": "unauthorised"})
                    return
                permissions = {}
                for section in ("Devices", "IPAM", "Racks"):
                    permissions[section] = {
                        "read": can_access(connection, account_id, section),
                        "edit": can_access(connection, account_id, section, edit=True),
                    }
                self.respond(200, {"sections": permissions})
        elif self.path in ("/api/inventory/devices", "/api/inventory/ipam", "/api/inventory/racks"):
            section = {
                "/api/inventory/devices": "Devices",
                "/api/inventory/ipam": "IPAM",
                "/api/inventory/racks": "Racks",
            }[self.path]
            with connect() as connection:
                account_id = authenticated_account(connection, self.headers.get("Cookie"))
                if account_id is None:
                    self.respond(401, {"error": "unauthorised"})
                    return
                if not can_access(connection, account_id, section):
                    self.respond(403, {"error": "forbidden"})
                    return
                if section == "Devices":
                    result = {"devices": [json.loads(raw) for (raw,) in connection.execute(
                        "SELECT record_json FROM inventory_devices ORDER BY ordinal"
                    )]}
                elif section == "IPAM":
                    result = {
                        "subnets": [json.loads(raw) for (raw,) in connection.execute(
                            "SELECT record_json FROM inventory_subnets ORDER BY ordinal"
                        )],
                        "vlans": [json.loads(raw) for (raw,) in connection.execute(
                            "SELECT record_json FROM inventory_vlans ORDER BY ordinal"
                        )],
                        "ipAllocations": {ip: json.loads(raw) for ip, raw in connection.execute(
                            "SELECT ip,record_json FROM inventory_ip_allocations ORDER BY rowid"
                        )},
                    }
                else:
                    result = {
                        "racks": [json.loads(raw) for (raw,) in connection.execute(
                            "SELECT record_json FROM inventory_racks ORDER BY ordinal"
                        )],
                        "rackAccessories": [json.loads(raw) for (raw,) in connection.execute(
                            "SELECT record_json FROM inventory_rack_accessories ORDER BY ordinal"
                        )],
                    }
                self.respond(200, result)
        elif self.path == "/api/inventory/state":
            """Return one permission-filtered SQLite snapshot for the inventory UI."""
            with connect() as connection:
                account_id = authenticated_account(connection, self.headers.get("Cookie"))
                if account_id is None:
                    self.respond(401, {"error": "unauthorised"})
                    return
                sections = {section: can_access(connection, account_id, section)
                            for section in ("Devices", "IPAM", "Racks")}
                if not any(sections.values()):
                    self.respond(403, {"error": "forbidden"})
                    return
                result = {"sections": sections}
                # The published device records remain unchanged. Revisions and
                # edit permissions are separate backend metadata for the shared
                # edit-reservation workflow.
                result["editPermissions"] = {
                    section: can_access(connection, account_id, section, edit=True)
                    for section in ("Devices", "IPAM", "Racks")
                }
                # Only expose revisions for records the caller can actually
                # view. IPAM/Racks editors still need revisions to reserve a
                # device whose placement or primary allocation they change.
                result["deviceRevisions"] = {
                    device_id: revision for device_id, revision in connection.execute(
                        "SELECT id,revision FROM inventory_devices ORDER BY ordinal"
                    )
                } if sections["Devices"] and any(result["editPermissions"].values()) else {}
                if sections["Devices"]:
                    result["devices"] = [json.loads(raw) for (raw,) in connection.execute(
                        "SELECT record_json FROM inventory_devices ORDER BY ordinal"
                    )]
                if sections["IPAM"]:
                    result["subnets"] = [json.loads(raw) for (raw,) in connection.execute(
                        "SELECT record_json FROM inventory_subnets ORDER BY ordinal"
                    )]
                    result["vlans"] = [json.loads(raw) for (raw,) in connection.execute(
                        "SELECT record_json FROM inventory_vlans ORDER BY ordinal"
                    )]
                    result["ipAllocations"] = {ip: json.loads(raw) for ip, raw in connection.execute(
                        "SELECT ip,record_json FROM inventory_ip_allocations ORDER BY rowid"
                    )}
                if sections["Racks"]:
                    result["racks"] = [json.loads(raw) for (raw,) in connection.execute(
                        "SELECT record_json FROM inventory_racks ORDER BY ordinal"
                    )]
                    result["rackAccessories"] = [json.loads(raw) for (raw,) in connection.execute(
                        "SELECT record_json FROM inventory_rack_accessories ORDER BY ordinal"
                    )]
                result["settings"] = {key: json.loads(raw) for key, raw in connection.execute(
                    "SELECT key,value_json FROM inventory_settings"
                )}
                result["changeHistory"] = [json.loads(raw) for (raw,) in connection.execute(
                    "SELECT record_json FROM inventory_change_history ORDER BY id"
                )]
                self.respond(200, result)
        elif self.path == "/api/inventory/settings":
            with connect() as connection:
                account_id = authenticated_account(connection, self.headers.get("Cookie"))
                if account_id is None:
                    self.respond(401, {"error": "unauthorised"})
                    return
                if not any(can_access(connection, account_id, section)
                           for section in ("Devices", "IPAM", "Racks")):
                    self.respond(403, {"error": "forbidden"})
                    return
                settings = {key: json.loads(raw) for key, raw in connection.execute(
                    "SELECT key,value_json FROM inventory_settings"
                )}
                self.respond(200, {"settings": settings})
        elif self.path == "/api/inventory/history":
            with connect() as connection:
                account_id = authenticated_account(connection, self.headers.get("Cookie"))
                if account_id is None:
                    self.respond(401, {"error": "unauthorised"})
                    return
                if not any(can_access(connection, account_id, section)
                           for section in ("Devices", "IPAM", "Racks")):
                    self.respond(403, {"error": "forbidden"})
                    return
                history = [json.loads(raw) for (raw,) in connection.execute(
                    "SELECT record_json FROM inventory_change_history ORDER BY id"
                )]
                self.respond(200, {"changeHistory": history})
        elif self.path == "/api/session":
            with connect() as connection:
                cookie = self.headers.get("Cookie")
                account_id = authenticated_account(connection, cookie)
                if account_id is None:
                    self.respond(401, {"error": "unauthorised"})
                    return
                account = connection.execute(
                    "SELECT username,is_admin,mfa_confirmed FROM accounts WHERE id=?",
                    (account_id,),
                ).fetchone()
                if account is None:
                    self.respond(401, {"error": "unauthorised"})
                    return
                self.respond(200, {
                    "username": account[0],
                    "is_admin": bool(account[1]),
                    "mfa_enrolled": bool(account[2]),
                    "csrf_token": csrf_for_session(read_session_cookie(cookie)),
                })
        else:
            self.respond(404, {"error": "not found"})

    def do_POST(self):
        if self.path in ("/api/users/create", "/api/users/permission", "/api/users/active",
                         "/api/users/admin", "/api/users/delete", "/api/account/password",
                         "/api/account/mfa/start", "/api/account/mfa/confirm",
                         "/api/devices/edit/start", "/api/devices/edit/cancel",
                         "/api/devices/edit/save", "/api/devices/create"):
            self.handle_user_mutation()
            return
        if self.path in IMPORT_ROUTES:
            self.handle_import()
            return
        if self.path not in ("/api/login", "/api/logout", "/api/setup", "/api/setup/mfa", "/api/setup/mfa-secret"):
            self.respond(404, {"error": "not found"})
            return
        origin = self.headers.get("Origin")
        if not PUBLIC_ORIGIN or not require_same_origin(origin, PUBLIC_ORIGIN):
            self.respond(403, {"error": "forbidden"})
            return
        if self.path == "/api/logout":
            with connect() as connection:
                ok = logout(
                    connection, self.headers.get("Cookie"), origin, PUBLIC_ORIGIN,
                    self.headers.get("X-CSRF-Token"),
                )
            if not ok:
                self.respond(403, {"error": "forbidden"})
                return
            self.respond(200, {"status": "signed out"},
                         cookie=clear_session_cookie())
            return
        length = self.headers.get("Content-Length")
        if length is None or not length.isdecimal() or not 0 < int(length) <= MAX_LOGIN_BYTES:
            self.respond(400, {"error": "invalid request"})
            return
        if self.headers.get("Content-Type", "").split(";")[0].strip().lower() != "application/json":
            self.respond(415, {"error": "JSON required"})
            return
        try:
            payload = json.loads(self.rfile.read(int(length)))
        except (UnicodeDecodeError, ValueError):
            self.respond(400, {"error": "invalid JSON"})
            return
        if not isinstance(payload, dict) or not isinstance(payload.get("username"), str) or not isinstance(payload.get("password"), str):
            self.respond(400, {"error": "invalid credentials"})
            return
        if len(payload["username"]) > 256 or len(payload["password"]) > 4096 or not isinstance(payload.get("mfa_code"), (str, type(None))):
            self.respond(400, {"error": "invalid credentials"})
            return
        if self.path in ("/api/setup", "/api/setup/mfa", "/api/setup/mfa-secret"):
            if set(payload) - ({"username", "password"} if self.path == "/api/setup" else {"username", "password", "mfa_code"} if self.path == "/api/setup/mfa" else {"username", "password"}):
                self.respond(400, {"error": "unexpected setup fields"})
                return
            with connect() as connection:
                try:
                    if self.path == "/api/setup":
                        account_id, secret = bootstrap_first_admin(
                            connection, payload["username"], payload["password"]
                        )
                        self.respond(200, {"accountId": account_id, "mfaSecret": secret})
                    else:
                        from .accounts import verify_password
                        row = connection.execute(
                            "SELECT id,password_hash FROM accounts WHERE username=? AND is_admin=1",
                            (payload["username"],)
                        ).fetchone()
                        if row is None or not verify_password(payload["password"], row[1]):
                            raise ValueError("Invalid administrator credentials")
                        if self.path == "/api/setup/mfa-secret":
                            pending = connection.execute("SELECT mfa_secret FROM accounts WHERE id=? AND mfa_confirmed=0", (row[0],)).fetchone()
                            if pending is None:
                                raise ValueError("MFA already enrolled")
                            self.respond(200, {"mfaSecret": pending[0]})
                        else:
                            confirm_admin_mfa(connection, row[0], payload.get("mfa_code"))
                            self.respond(200, {"status": "mfa enrolled"})
                except ValueError as exc:
                    self.respond(400, {"error": str(exc)})
                except sqlite3.IntegrityError:
                    self.respond(400, {"error": "administrator already exists"})
            return
        with connect() as connection:
            token = login(
                connection, self.client_address[0], payload["username"],
                payload["password"], mfa_code=payload.get("mfa_code"),
            )
        if token is None:
            self.respond(401, {"error": "invalid credentials"})
            return
        self.respond(200, {"status": "signed in"}, cookie=session_cookie(token))

    def handle_user_mutation(self):
        """Administrator-only account creation and section permission changes."""
        origin = self.headers.get("Origin")
        if not PUBLIC_ORIGIN or not require_same_origin(origin, PUBLIC_ORIGIN):
            self.respond(403, {"error": "forbidden"})
            return
        length = self.headers.get("Content-Length")
        if length is None or not length.isdecimal() or not 0 < int(length) <= MAX_LOGIN_BYTES:
            self.respond(400, {"error": "invalid request size"})
            return
        if self.headers.get("Content-Type", "").split(";")[0].strip().lower() != "application/json":
            self.respond(415, {"error": "JSON required"})
            return
        try:
            payload = json.loads(self.rfile.read(int(length)))
            if not isinstance(payload, dict):
                raise ValueError("Invalid user request")
            with connect() as connection:
                actor = authorised_mutation(
                    connection, self.headers.get("Cookie"), origin, PUBLIC_ORIGIN,
                    self.headers.get("X-CSRF-Token"),
                )
                if actor is None:
                    self.respond(403, {"error": "forbidden"})
                    return
                if self.path == "/api/devices/create":
                    if set(payload) != {"record"}:
                        raise ValueError("Invalid device create request")
                    result = {"revision": create_device(connection, actor, payload["record"])}
                elif self.path == "/api/devices/edit/save":
                    if set(payload) not in ({"deviceId", "revision", "record"},
                                            {"deviceId", "revision", "record", "section"}):
                        raise ValueError("Invalid device save request")
                    result = {"revision": save_reserved_device(
                        connection, actor, payload["deviceId"], payload["revision"],
                        payload["record"], payload.get("section", "Devices"))}
                elif self.path in ("/api/devices/edit/start", "/api/devices/edit/cancel"):
                    if set(payload) not in ({"deviceId"}, {"deviceId", "section"}) or not isinstance(payload["deviceId"], str):
                        raise ValueError("Device identifier required")
                    section = payload.get("section", "Devices")
                    if section not in ("Devices", "IPAM", "Racks"):
                        raise ValueError("Invalid inventory section")
                    if not can_access(connection, actor, section, edit=True):
                        raise PermissionError("Section edit permission required")
                    device_id = payload["deviceId"]
                    now = int(time.time())
                    connection.execute("BEGIN IMMEDIATE")
                    try:
                        connection.execute("DELETE FROM device_edit_reservations WHERE expires_at<=?", (now,))
                        if self.path.endswith("/start"):
                            device = connection.execute("SELECT revision FROM inventory_devices WHERE id=?", (device_id,)).fetchone()
                            if device is None:
                                raise ValueError("Device not found")
                            existing = connection.execute(
                                "SELECT account_id FROM device_edit_reservations WHERE device_id=?", (device_id,)
                            ).fetchone()
                            if existing and existing[0] != actor:
                                raise ValueError("Device is being edited by another user")
                            if existing:
                                reservation_revision = connection.execute(
                                    "SELECT base_revision FROM device_edit_reservations WHERE device_id=?",
                                    (device_id,),
                                ).fetchone()[0]
                            else:
                                reservation_revision = device[0]
                            connection.execute(
                                "INSERT INTO device_edit_reservations(device_id,account_id,expires_at,base_revision) VALUES(?,?,?,?) "
                                "ON CONFLICT(device_id) DO UPDATE SET expires_at=excluded.expires_at",
                                (device_id, actor, now + 300, reservation_revision),
                            )
                            result = {"status": "reserved", "expiresAt": now + 300,
                                      "revision": reservation_revision}
                        else:
                            connection.execute(
                                "DELETE FROM device_edit_reservations WHERE device_id=? AND account_id=?",
                                (device_id, actor),
                            )
                            result = {"status": "released"}
                        connection.commit()
                    except BaseException:
                        connection.rollback()
                        raise
                elif self.path == "/api/account/mfa/start":
                    if set(payload) != {"password"}:
                        raise ValueError("Password required")
                    row = connection.execute(
                        "SELECT password_hash,mfa_secret,mfa_confirmed FROM accounts WHERE id=?",
                        (actor,),
                    ).fetchone()
                    if row is None or not verify_password(payload["password"], row[0]):
                        raise ValueError("Invalid password")
                    if row[2]:
                        raise ValueError("MFA already enrolled")
                    secret = row[1] or new_secret()
                    if not row[1]:
                        connection.execute("UPDATE accounts SET mfa_secret=? WHERE id=?", (secret, actor))
                        connection.commit()
                    result = {"mfaSecret": secret}
                elif self.path == "/api/account/mfa/confirm":
                    if set(payload) != {"code"}:
                        raise ValueError("Authenticator code required")
                    row = connection.execute(
                        "SELECT mfa_secret,mfa_confirmed FROM accounts WHERE id=?", (actor,)
                    ).fetchone()
                    if row is None or row[1] or not row[0] or not verify_code(row[0], payload["code"]):
                        raise ValueError("Invalid authenticator code")
                    connection.execute("BEGIN IMMEDIATE")
                    try:
                        connection.execute("UPDATE accounts SET mfa_confirmed=1 WHERE id=?", (actor,))
                        connection.execute("DELETE FROM account_sessions WHERE account_id=?", (actor,))
                        connection.commit()
                    except BaseException:
                        connection.rollback()
                        raise
                    result = {"status": "mfa enrolled"}
                elif self.path == "/api/account/password":
                    if set(payload) != {"currentPassword", "newPassword"}:
                        raise ValueError("Current and new passwords required")
                    current_password = payload["currentPassword"]
                    new_password = payload["newPassword"]
                    row = connection.execute(
                        "SELECT password_hash FROM accounts WHERE id=?", (actor,)
                    ).fetchone()
                    if row is None or not verify_password(current_password, row[0]):
                        raise ValueError("Current password is incorrect")
                    replacement_hash = hash_password(new_password)
                    connection.execute("BEGIN IMMEDIATE")
                    try:
                        connection.execute(
                            "UPDATE accounts SET password_hash=? WHERE id=?",
                            (replacement_hash, actor),
                        )
                        connection.execute(
                            "DELETE FROM account_sessions WHERE account_id=?", (actor,)
                        )
                        connection.commit()
                    except BaseException:
                        connection.rollback()
                        raise
                    result = {"status": "password changed"}
                elif self.path == "/api/users/create":
                    if set(payload) != {"username", "password"}:
                        raise ValueError("Username and password required")
                    user_id = create_user(connection, actor, payload["username"], payload["password"])
                    result = {"id": user_id}
                elif self.path == "/api/users/permission":
                    if set(payload) != {"userId", "section", "level"} or type(payload["userId"]) is not int:
                        raise ValueError("Invalid permission request")
                    set_permission(connection, actor, payload["userId"], payload["section"], payload["level"])
                    result = {"status": "updated"}
                else:
                    if type(payload.get("userId")) is not int:
                        raise ValueError("Invalid user identifier")
                    if self.path == "/api/users/delete":
                        if set(payload) != {"userId"}:
                            raise ValueError("Invalid delete request")
                        delete_user(connection, actor, payload["userId"])
                        result = {"status": "deleted"}
                    elif self.path == "/api/users/active":
                        if set(payload) != {"userId", "active"}:
                            raise ValueError("Invalid account status request")
                        set_account_active(connection, actor, payload["userId"], payload["active"])
                        result = {"status": "updated"}
                    elif self.path == "/api/users/admin":
                        if set(payload) != {"userId", "isAdmin"}:
                            raise ValueError("Invalid administrator request")
                        set_administrator(connection, actor, payload["userId"], payload["isAdmin"])
                        result = {"status": "updated"}
                    else:
                        raise ValueError("Unknown account operation")
        except PermissionError:
            self.respond(403, {"error": "forbidden"})
            return
        except (ValueError, TypeError, sqlite3.IntegrityError) as exc:
            self.respond(400, {"error": str(exc)})
            return
        self.respond(200, result)

    def handle_import(self):
        """Authenticated server-owned import stages; never accept a candidate."""
        origin = self.headers.get("Origin")
        if not PUBLIC_ORIGIN or not require_same_origin(origin, PUBLIC_ORIGIN):
            self.respond(403, {"error": "forbidden"})
            return
        route = self.path
        content_type = self.headers.get("Content-Type", "").split(";")[0].strip().lower()
        if content_type != ("application/octet-stream" if route.endswith("/preview") else "application/json"):
            self.respond(415, {"error": "invalid content type"})
            return
        length = self.headers.get("Content-Length")
        limit = MAX_IMPORT_BYTES if route.endswith("/preview") else MAX_LOGIN_BYTES
        if length is None or not length.isdecimal() or not 0 < int(length) <= limit:
            self.respond(413, {"error": "invalid request size"})
            return
        body = self.rfile.read(int(length))
        args = {
            "cookie_header": self.headers.get("Cookie"),
            "origin": origin, "allowed_origin": PUBLIC_ORIGIN,
            "csrf_header": self.headers.get("X-CSRF-Token"),
        }
        try:
            payload = None
            if route != "/api/import/preview":
                payload = json.loads(body)
                if not isinstance(payload, dict) or not isinstance(payload.get("draftId"), str):
                    raise ValueError("Invalid import draft request")
                if len(payload["draftId"]) > 128:
                    raise ValueError("Invalid import draft identifier")
                if set(payload) - {"draftId", "choices", "legacyMountApproved", "replacementConfirmed"}:
                    raise ValueError("Unexpected import request fields")
            with connect() as connection:
                if route == "/api/import/preview":
                    draft_id, review = IMPORT_DRAFTS.begin(connection, body, **args)
                    result = {"draftId": draft_id, "review": review}
                elif route == "/api/import/access-point-choices":
                    if not isinstance(payload.get("choices"), list):
                        raise ValueError("Access Point choices required")
                    review = IMPORT_DRAFTS.choose_access_point_mounts(
                        connection, payload["draftId"], payload["choices"], **args
                    )
                    result = {"review": review}
                elif route == "/api/import/cancel":
                    IMPORT_DRAFTS.cancel_authenticated(
                        connection, payload["draftId"], **args
                    )
                    result = {"status": "cancelled"}
                else:
                    if (type(payload.get("legacyMountApproved", False)) is not bool or
                            type(payload.get("replacementConfirmed", False)) is not bool):
                        raise ValueError("Invalid confirmation flags")
                    IMPORT_DRAFTS.confirm(
                        connection, payload["draftId"],
                        legacy_mount_approved=payload.get("legacyMountApproved", False),
                        replacement_confirmed=payload.get("replacementConfirmed", False),
                        **args
                    )
                    result = {"status": "imported"}
        except PermissionError:
            self.respond(403, {"error": "forbidden"})
            return
        except (ValueError, TypeError) as exc:
            self.respond(400, {"error": str(exc)})
            return
        except sqlite3.Error:
            self.respond(503, {"error": "database unavailable"})
            return
        self.respond(200, result)

    def respond(self, status, payload, *, cookie=None):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        if cookie is not None:
            self.send_header("Set-Cookie", cookie)
        self.end_headers()
        self.wfile.write(body)


def main():
    initialise_database()
    validate_published_port(os.environ.get("CAFFOOT_PORT", "8080"))
    validate_public_origin(PUBLIC_ORIGIN)
    if not TLS_NAMES:
        raise RuntimeError("CAFFOOT_SERVER_ADDRESS must identify the TLS hostname or IP")
    context = ensure_certificate(TLS_DIR, TLS_NAMES)
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    server.socket = context.wrap_socket(server.socket, server_side=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
