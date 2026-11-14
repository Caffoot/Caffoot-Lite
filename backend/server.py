"""Caffoot Lite HTTPS routes for accounts, shared inventory and protected resources."""
import json
import secrets
import os
import sqlite3
import time
import smtplib
import ssl
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, parse_qs

from .device_saves import create_device, delete_reserved_device, save_reserved_device
from .ipam_linking import link_device_to_ipam, unique_link_fields
from .ipam_saves import change_independent_allocation, change_bulk_allocations
from .collection_saves import (change_inventory_record, remove_linked_rack_shelf,
                               change_ipam_subnet_and_vlan_records,
                               delete_subnet_with_dependencies)
from .settings_saves import save_inventory_setting
from .inventory_projection import project_inventory_response
from .feature_settings import read_feature_settings, save_feature_setting, unique_feature_fields
from .smtp_settings import (config_path as smtp_config_path, public_settings as smtp_public_settings,
                            save_settings as save_smtp_settings, send_test_email)
from .device_catalogue import change_device_catalogue
from .reset_inventory import reset_inventory
from .ipam_repair import apply_ipam_repairs
from .audit_events import record_actor_event
from .account_email import (MAIL_REQUESTS, REQUEST_MESSAGE, issue_email_proof,
                            confirm_email_proof, queue_email, security_recipients,
                            notify_security_change, record_blocked_sign_in,
                            role_change_notifications)
from .profiles import (read_profile, save_profile, read_profile_photo,
                       save_profile_photo, remove_profile_photo, MAX_PHOTO_BYTES)
from .schema import initialise_database as migrate_database
from .accounts import bootstrap_first_admin, confirm_admin_mfa, verify_password, hash_password
from .authentication import MFAEnrolmentRequired
from .account_security import (start_required_mfa_enrolment,
                               confirm_required_mfa_enrolment, remove_own_mfa)
from .mfa import new_secret, provisioning_uri, verify_code
from .import_drafts import ImportDrafts
from .request_auth import authenticated_account, csrf_for_session
from .http_security import read_session_cookie, session_cookie, clear_session_cookie
from .request_auth import login, logout, THROTTLE
from .permissions import (can_access, feature_enabled, create_user,
                          set_account_active, set_administrator, delete_user)
from .role_policy import evaluate_role_policy
from .roles import (preview_role_change, confirm_role_change, role_catalogue,
                    account_access_details)
from .history_permissions import visible_change_history
from .request_auth import authorised_mutation
from .http_security import require_same_origin
from .tls import ensure_certificate
from .deployment_settings import validate_published_port
from .staff_directory import (require_directory_access, list_directory,
                               read_staff_member, read_department,
                               save_staff_member, save_department, unique_directory_fields)

DB_PATH = Path(os.environ.get("CAFFOOT_DB_PATH", "/data/caffoot.sqlite3"))
HOST = os.environ.get("CAFFOOT_HOST", "0.0.0.0")
PORT = 8080  # Fixed internal port; Compose publishes the configurable host port.
PUBLIC_ORIGIN = os.environ.get("CAFFOOT_WEB_ADDRESS", "")
MAX_LOGIN_BYTES = 4096
MAX_IMPORT_BYTES = 10 * 1024 * 1024
ASSET_ROOT = Path(__file__).resolve().parent.parent / "assets"
PUBLIC_ASSETS = {"favicon.ico": "image/x-icon",
                 "apple-touch-icon.png": "image/png",
                 "caffoot-icon-1024.png": "image/png",
                 "caffoot-logo-256.png": "image/png",
                 "qrcode.min.js": "application/javascript; charset=utf-8",
                     "tailwind.css": "text/css; charset=utf-8"}
# Only these packaged presentation files can be requested; source and data stay private.
INTERFACE_ROOT = Path(__file__).resolve().parent.parent / "interface"
INTERFACE_FILES = {
    "/interface/" + str(path.relative_to(INTERFACE_ROOT)): path
    for path in INTERFACE_ROOT.rglob("*")
    if path.is_file() and path.suffix in (".html", ".css", ".js")
}

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
    def end_headers(self):
        # Block framing without restricting the established inline inventory scripts.
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("Content-Security-Policy", "frame-ancestors 'none'")
        self.send_header("Referrer-Policy", "no-referrer")
        super().end_headers()

    def do_GET(self):
        if self.path.startswith(("/api/staff-members", "/api/departments")):
            self.handle_directory_request()
            return
        if self.path == "/api/settings/features":
            self.handle_feature_settings()
            return
        if self.path in ("/interface/sign-in.js", "/interface/styles/sign-in.css",
                         "/interface/styles/sign-in-controls.css"):
            path = INTERFACE_FILES[self.path]
            body = path.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", ("application/javascript" if path.suffix == ".js"
                                             else "text/css") + "; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.send_header("X-Content-Type-Options", "nosniff")
            self.end_headers()
            self.wfile.write(body)
            return
        if self.path in INTERFACE_FILES:
            with connect() as connection:
                account_id = authenticated_account(connection, self.headers.get("Cookie"))
                if account_id is None:
                    self.respond(401, {"error": "unauthorised"})
                    return
                # These packaged files contain interface code and templates only.
                # Staff accounts need them for their own approved My Account screen;
                # inventory and administrator data retain their separate API checks.
            path = INTERFACE_FILES[self.path]
            body = path.read_bytes()
            content_type = {".html": "text/html", ".css": "text/css",
                            ".js": "application/javascript"}[path.suffix]
            self.send_response(200)
            self.send_header("Content-Type", content_type + "; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "private, no-store")
            self.send_header("X-Content-Type-Options", "nosniff")
            self.end_headers()
            self.wfile.write(body)
            return
        if self.path.startswith("/assets/") and self.path[8:] in PUBLIC_ASSETS:
            name = self.path[8:]
            try:
                data = (ASSET_ROOT / name).read_bytes()
            except OSError:
                self.respond(503, {"error": "branding asset unavailable"})
                return
            self.send_response(200)
            self.send_header("Content-Type", PUBLIC_ASSETS[name])
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Cache-Control", "public, max-age=86400")
            self.send_header("X-Content-Type-Options", "nosniff")
            self.end_headers()
            self.wfile.write(data)
            return
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
        if self.path in ("/inventory", "/inventory?rack-print=same-tab", "/account"):
            with connect() as connection:
                account_id = authenticated_account(connection, self.headers.get("Cookie"))
                if account_id is None:
                    self.respond(401, {"error": "unauthorised"})
                    return
                if self.path != "/account" and not evaluate_role_policy(connection, account_id).is_admin and not any(can_access(connection, account_id, section)
                           for section in ("Devices", "IPAM", "Racks")):
                    self.respond(403, {"error": "forbidden"})
                    return
            body = (Path(__file__).resolve().parent.parent / "inventory.html").read_bytes()
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
        elif self.path in ("/api/account/profile", "/api/account/photo"):
            with connect() as connection:
                account_id = authenticated_account(connection, self.headers.get("Cookie"))
                if account_id is None:
                    self.respond(401, {"error": "unauthorised"})
                    return
                if self.path == "/api/account/profile":
                    self.respond(200, read_profile(connection, account_id))
                    return
                photo = read_profile_photo(connection, account_id)
                if not photo or photo[1] is None:
                    self.respond(404, {"error": "photo not found"})
                    return
                mime, data = photo
                self.send_response(200)
                self.send_header("Content-Type", mime)
                self.send_header("Content-Length", str(len(data)))
                self.send_header("Cache-Control", "private, no-store")
                self.send_header("X-Content-Type-Options", "nosniff")
                self.end_headers()
                self.wfile.write(data)
                return
        elif self.path == "/api/settings/email":
            with connect() as connection:
                account_id = authenticated_account(connection, self.headers.get("Cookie"))
                if account_id is None:
                    self.respond(401, {"error": "unauthorised"})
                    return
                admin = connection.execute(
                    "SELECT active,is_admin,mfa_confirmed FROM accounts WHERE id=?",
                    (account_id,),
                ).fetchone()
                if admin != (1, 1, 1):
                    self.respond(403, {"error": "forbidden"})
                    return
                try:
                    safe_settings = smtp_public_settings(smtp_config_path(DB_PATH))
                except (OSError, ValueError, json.JSONDecodeError):
                    self.respond(503, {"error": "Email settings cannot be read safely"})
                    return
                self.respond(200, safe_settings)
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
                    permissions = evaluate_role_policy(connection, user_id).permissions
                    users.append({
                        "id": user_id, "username": username,
                        "isAdmin": bool(is_admin), "active": bool(active),
                        "mfaEnrolled": bool(mfa_confirmed),
                        "permissions": permissions,
                        "accessDetails": account_access_details(connection, user_id),
                        "profile": read_profile(connection, account_id, user_id),
                    })
                self.respond(200, {"users": users, "roles": role_catalogue(connection)})
        elif self.path == "/api/inventory/sections":
            with connect() as connection:
                connection.execute("BEGIN")
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
                connection.execute("BEGIN")
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
                self.respond(200, project_inventory_response(connection, account_id, result))
        elif self.path == "/api/inventory/state":
            """Return one permission-filtered SQLite snapshot for the inventory UI."""
            with connect() as connection:
                connection.execute("BEGIN")
                account_id = authenticated_account(connection, self.headers.get("Cookie"))
                if account_id is None:
                    self.respond(401, {"error": "unauthorised"})
                    return
                sections = {section: can_access(connection, account_id, section)
                            for section in ("Devices", "IPAM", "Racks")}
                if not any(sections.values()) and not evaluate_role_policy(connection, account_id).is_admin:
                    self.respond(403, {"error": "forbidden"})
                    return
                result = {"sections": sections}
                if sections["Devices"]:
                    result["ipamEnabled"] = feature_enabled(connection, "IPAM")
                    result["racksEnabled"] = feature_enabled(connection, "Racks")
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
                    result["deviceEditors"] = {device_id: username for device_id, username in connection.execute(
                        "SELECT reservation.device_id, account.username "
                        "FROM device_edit_reservations AS reservation "
                        "JOIN accounts AS account ON account.id=reservation.account_id "
                        "WHERE reservation.expires_at>?", (int(time.time()),)
                    )}
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
                result["changeHistory"] = visible_change_history(connection, account_id)
                self.respond(200, project_inventory_response(connection, account_id, result))
        elif self.path == "/api/inventory/settings":
            with connect() as connection:
                connection.execute("BEGIN")
                account_id = authenticated_account(connection, self.headers.get("Cookie"))
                if account_id is None:
                    self.respond(401, {"error": "unauthorised"})
                    return
                if not evaluate_role_policy(connection, account_id).is_admin and not any(can_access(connection, account_id, section)
                           for section in ("Devices", "IPAM", "Racks")):
                    self.respond(403, {"error": "forbidden"})
                    return
                settings = {key: json.loads(raw) for key, raw in connection.execute(
                    "SELECT key,value_json FROM inventory_settings"
                )}
                self.respond(200, project_inventory_response(connection, account_id, {"settings": settings}))
        elif self.path == "/api/inventory/history":
            with connect() as connection:
                connection.execute("BEGIN")
                account_id = authenticated_account(connection, self.headers.get("Cookie"))
                if account_id is None:
                    self.respond(401, {"error": "unauthorised"})
                    return
                if not any(can_access(connection, account_id, section)
                           for section in ("Devices", "IPAM", "Racks")):
                    self.respond(403, {"error": "forbidden"})
                    return
                history = visible_change_history(connection, account_id)
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
                    "assigned_roles": [{"name": role["name"], "enabled": role["enabled"]}
                                       for role in account_access_details(connection, account_id)["roles"]],
                    "mfa_enrolled": bool(account[2]),
                    "mfa_removal_eligible": bool(account[2]) and not evaluate_role_policy(
                        connection, account_id).mfa_mandatory,
                    "can_enter_inventory": bool(account[1]) or any(
                        can_access(connection, account_id, section)
                        for section in ("Devices", "IPAM", "Racks")
                    ),
                    "csrf_token": csrf_for_session(read_session_cookie(cookie)),
                })
        else:
            self.respond(404, {"error": "not found"})

    def do_POST(self):
        if self.path.startswith(("/api/staff-members", "/api/departments")):
            self.handle_directory_request()
            return
        if self.path == "/api/settings/features":
            self.handle_feature_settings()
            return
        if self.path in ("/api/users/roles/preview", "/api/users/roles/confirm",
                         "/api/users/permission"):
            self.handle_role_change()
            return
        if self.path in ("/api/account/email/request", "/api/account/email/confirm",
                         "/api/recovery/request", "/api/recovery/confirm"):
            self.handle_account_email()
            return
        if self.path == "/api/account/photo":
            self.handle_profile_photo()
            return
        if self.path in ("/api/account/profile", "/api/account/photo/remove",
                         "/api/users/create", "/api/users/profile", "/api/users/active",
                         "/api/users/admin", "/api/users/delete", "/api/settings/email",
                         "/api/settings/email/test", "/api/account/password",
                         "/api/account/mfa/start", "/api/account/mfa/confirm", "/api/account/mfa/remove",
                         "/api/devices/edit/start", "/api/devices/edit/cancel",
                         "/api/devices/edit/save", "/api/devices/create",
                         "/api/devices/delete", "/api/devices/ipam/link", "/api/ipam/allocation/save",
                         "/api/ipam/allocation/delete", "/api/ipam/allocation/bulk",
                         "/api/ipam/subnets/save", "/api/ipam/subnets/delete",
                         "/api/inventory/rack-shelves/remove", "/api/inventory/record/save",
                         "/api/inventory/record/delete", "/api/inventory/settings/save",
                         "/api/inventory/device-catalogue/change", "/api/inventory/reset",
                         "/api/inventory/ipam/repair"):
            self.handle_user_mutation()
            return
        if self.path in IMPORT_ROUTES:
            self.handle_import()
            return
        if self.path not in ("/api/login", "/api/login/mfa/start", "/api/login/mfa/confirm",
                             "/api/logout", "/api/setup", "/api/setup/mfa", "/api/setup/mfa-secret"):
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
        if self.path in ("/api/login/mfa/start", "/api/login/mfa/confirm"):
            expected = {"username", "password"}
            if self.path.endswith("/confirm"):
                expected.add("mfa_code")
            if set(payload) != expected:
                self.respond(400, {"error": "invalid request"})
                return
            peer, username = self.client_address[0], payload["username"]
            if not THROTTLE.allowed(peer, username):
                self.respond(401, {"error": "invalid credentials or MFA request"})
                return
            with connect() as connection:
                try:
                    if self.path.endswith("/start"):
                        account_name, secret = start_required_mfa_enrolment(
                            connection, username, payload["password"],
                        )
                        # Showing a pending key must not reset failed code attempts.
                        self.respond(200, {"mfaSecret": secret,
                                           "mfaUri": provisioning_uri(account_name, secret)})
                        return
                    account_id = confirm_required_mfa_enrolment(
                        connection, username, payload["password"], payload["mfa_code"],
                    )
                    recipients = security_recipients(connection, account_id)
                    recipients.update(security_recipients(connection, administrators=True))
                except (PermissionError, ValueError):
                    THROTTLE.failed(peer, username)
                    self.respond(401, {"error": "invalid credentials or MFA request"})
                    return
            THROTTLE.succeeded(peer, username)
            notify_security_change(smtp_config_path(DB_PATH), recipients)
            self.respond(200, {"status": "mfa enrolled"})
            return
        if self.path in ("/api/setup", "/api/setup/mfa", "/api/setup/mfa-secret"):
            if set(payload) - ({"username", "password"} if self.path == "/api/setup" else {"username", "password", "mfa_code"} if self.path == "/api/setup/mfa" else {"username", "password"}):
                self.respond(400, {"error": "unexpected setup fields"})
                return
            # Pending administrator password/MFA checks are public until first setup finishes.
            # Apply the existing per-peer/account throttle to these credential proofs too.
            if self.path != "/api/setup" and not THROTTLE.allowed(
                self.client_address[0], payload["username"]
            ):
                self.respond(400, {"error": "Invalid administrator credentials"})
                return
            with connect() as connection:
                try:
                    if self.path == "/api/setup":
                        account_id, secret = bootstrap_first_admin(
                            connection, payload["username"], payload["password"]
                        )
                        self.respond(200, {"accountId": account_id, "mfaSecret": secret,
                                           "mfaUri": provisioning_uri(payload["username"].strip(), secret)})
                    else:
                        from .accounts import verify_password
                        row = connection.execute(
                            "SELECT id,password_hash,username FROM accounts WHERE username=? AND is_admin=1",
                            (payload["username"],)
                        ).fetchone()
                        if row is None or not verify_password(payload["password"], row[1]):
                            THROTTLE.failed(self.client_address[0], payload["username"])
                            raise ValueError("Invalid administrator credentials")
                        if self.path == "/api/setup/mfa-secret":
                            pending = connection.execute("SELECT mfa_secret FROM accounts WHERE id=? AND mfa_confirmed=0", (row[0],)).fetchone()
                            if pending is None:
                                raise ValueError("MFA already enrolled")
                            THROTTLE.succeeded(self.client_address[0], payload["username"])
                            self.respond(200, {"mfaSecret": pending[0],
                                               "mfaUri": provisioning_uri(row[2], pending[0])})
                        else:
                            try:
                                confirm_admin_mfa(connection, row[0], payload.get("mfa_code"))
                            except ValueError:
                                THROTTLE.failed(self.client_address[0], payload["username"])
                                raise
                            THROTTLE.succeeded(self.client_address[0], payload["username"])
                            self.respond(200, {"status": "mfa enrolled"})
                except ValueError as exc:
                    self.respond(400, {"error": str(exc)})
                except sqlite3.IntegrityError:
                    self.respond(400, {"error": "administrator already exists"})
            return
        try:
            with connect() as connection:
                token = login(
                    connection, self.client_address[0], payload["username"],
                    payload["password"], mfa_code=payload.get("mfa_code"),
                )
        except MFAEnrolmentRequired:
            self.respond(200, {"status": "mfa enrolment required"})
            return
        if token is None:
            if not THROTTLE.allowed(self.client_address[0], payload["username"]):
                with connect() as connection:
                    if record_blocked_sign_in(connection, self.client_address[0], payload["username"]):
                        notify_security_change(smtp_config_path(DB_PATH), security_recipients(connection, administrators=True))
                self.respond(401, {"error": "Sign-in is temporarily limited after repeated attempts. Please wait and try again."})
                return
            self.respond(401, {"error": "invalid credentials"})
            return
        self.respond(200, {"status": "signed in"}, cookie=session_cookie(token))

    def handle_directory_request(self):
        """Protect directory reads and saves with the established request checks."""
        parsed = urlsplit(self.path)
        parts = parsed.path.strip('/').split('/')
        section = {'staff-members': 'Staff Members', 'departments': 'Departments'}.get(parts[1] if len(parts) > 1 else '')
        action = parts[3] if len(parts) == 4 else None
        if (section is None or len(parts) not in (2, 3, 4)
                or (len(parts) == 4 and (self.command != 'POST' or action !=
                    ('login' if section == 'Staff Members' else 'delete')))
                or parsed.path.endswith('/') or (self.command == 'POST' and parsed.query)):
            self.respond(404, {'error': 'not found'})
            return
        record_id = parts[2] if len(parts) >= 3 else None
        origin = self.headers.get('Origin')
        if (self.headers.get('Sec-Fetch-Site') == 'cross-site'
                or (origin is not None and (not PUBLIC_ORIGIN or not require_same_origin(origin, PUBLIC_ORIGIN)))
                or (self.command == 'POST' and (not PUBLIC_ORIGIN or not require_same_origin(origin, PUBLIC_ORIGIN)))):
            self.respond(403, {'error': 'forbidden'})
            return
        try:
            with connect() as connection:
                cookie = self.headers.get('Cookie')
                if self.command == 'GET':
                    connection.execute('BEGIN')
                actor = (authenticated_account(connection, cookie) if self.command == 'GET' else
                         authorised_mutation(connection, cookie, origin, PUBLIC_ORIGIN, self.headers.get('X-CSRF-Token')))
                if actor is None:
                    self.respond(401 if self.command == 'GET' else 403, {'error': 'unauthorised'})
                    return
                require_directory_access(connection, actor, section, edit=self.command == 'POST')
                if self.command == 'GET':
                    parameters = parse_qs(parsed.query, keep_blank_values=True)
                    if set(parameters) - {'query', 'limit', 'offset'} or any(len(value) != 1 for value in parameters.values()):
                        raise ValueError('Invalid search parameters')
                    if record_id:
                        result = (read_staff_member(connection, actor, record_id) if section == 'Staff Members'
                                  else read_department(connection, actor, record_id))
                    else:
                        result = list_directory(connection, actor, section,
                            query=parameters.get('query', [''])[0],
                            limit=int(parameters.get('limit', ['100'])[0]),
                            offset=int(parameters.get('offset', ['0'])[0]))
                else:
                    length = self.headers.get('Content-Length', '')
                    if not length.isdecimal() or not 0 < int(length) <= MAX_LOGIN_BYTES:
                        raise ValueError('Invalid request size')
                    if self.headers.get('Content-Type', '').split(';')[0].strip().lower() != 'application/json':
                        self.respond(415, {'error': 'JSON required'})
                        return
                    payload = json.loads(self.rfile.read(int(length)), object_pairs_hook=unique_directory_fields)
                    if section == 'Staff Members':
                        result = save_staff_member(connection, actor, read_session_cookie(cookie), payload,
                            staff_id=record_id, login_only=action == 'login')
                    else:
                        result = save_department(connection, actor, read_session_cookie(cookie), payload,
                            department_id=record_id, delete=action == 'delete')
            key = ('staffMembers' if section == 'Staff Members' else 'departments') if isinstance(result, list) else ('staffMember' if section == 'Staff Members' else 'department')
            self.respond(200, {key: result})
        except PermissionError:
            self.respond(403, {'error': 'forbidden'})
        except LookupError as exc:
            self.respond(404, {'error': str(exc)})
        except (FileExistsError, sqlite3.IntegrityError):
            self.respond(409, {'error': 'Directory record conflict'})
        except (ValueError, TypeError) as exc:
            self.respond(400, {'error': str(exc)})

    def handle_feature_settings(self):
        """Use existing session and request proofs for organisation settings."""
        origin = self.headers.get("Origin")
        if (self.headers.get("Sec-Fetch-Site") == "cross-site"
                or (origin is not None and (not PUBLIC_ORIGIN
                    or not require_same_origin(origin, PUBLIC_ORIGIN)))
                or (self.command == "POST" and (not PUBLIC_ORIGIN
                    or not require_same_origin(origin, PUBLIC_ORIGIN)))):
            self.respond(403, {"error": "forbidden"})
            return
        try:
            with connect() as connection:
                cookie = self.headers.get("Cookie")
                if self.command == "GET":
                    actor = authenticated_account(connection, cookie)
                    if actor is None:
                        self.respond(401, {"error": "unauthorised"})
                        return
                    self.respond(200, {"features": read_feature_settings(connection, actor)})
                    return
                actor = authorised_mutation(
                    connection, cookie, origin, PUBLIC_ORIGIN,
                    self.headers.get("X-CSRF-Token"),
                )
                if actor is None:
                    raise PermissionError("Verified session required")
                read_feature_settings(connection, actor)
                length = self.headers.get("Content-Length", "")
                if not length.isdecimal() or not 0 < int(length) <= MAX_LOGIN_BYTES:
                    raise ValueError("Invalid request size")
                if self.headers.get("Content-Type", "").split(";")[0].strip().lower() != "application/json":
                    self.respond(415, {"error": "JSON required"})
                    return
                payload = json.loads(self.rfile.read(int(length)), object_pairs_hook=unique_feature_fields)
                result = save_feature_setting(
                    connection, actor, read_session_cookie(cookie), payload,
                )
            self.respond(200, {"features": result})
        except PermissionError:
            self.respond(403, {"error": "forbidden"})
        except (ValueError, TypeError, sqlite3.IntegrityError) as exc:
            self.respond(400, {"error": str(exc)})

    def handle_role_change(self):
        """Require the existing request safeguards before preview or confirmation."""
        if not PUBLIC_ORIGIN or not require_same_origin(self.headers.get("Origin"), PUBLIC_ORIGIN):
            self.respond(403, {"error": "forbidden"})
            return
        length = self.headers.get("Content-Length", "")
        if not length.isdecimal() or not 0 < int(length) <= MAX_LOGIN_BYTES:
            self.respond(400, {"error": "invalid request size"})
            return
        if self.headers.get("Content-Type", "").split(";")[0].strip().lower() != "application/json":
            self.respond(415, {"error": "JSON required"})
            return
        try:
            payload = json.loads(self.rfile.read(int(length)))
            expected = {"action", "proof"} if self.path.endswith("/confirm") else {"action"}
            with connect() as connection:
                actor = authorised_mutation(connection, self.headers.get("Cookie"),
                    self.headers.get("Origin"), PUBLIC_ORIGIN, self.headers.get("X-CSRF-Token"))
                if actor is None or connection.execute(
                        "SELECT is_admin,active,mfa_confirmed FROM accounts WHERE id=?", (actor,)).fetchone() != (1, 1, 1):
                    raise PermissionError("Verified active administrator required")
                if self.path == "/api/users/permission":
                    self.respond(410, {"error": "Permission changes require a role preview and confirmation.",
                                       "previewEndpoint": "/api/users/roles/preview"})
                    return
                if not isinstance(payload, dict) or set(payload) != expected:
                    raise ValueError("Invalid role request fields")
                token = read_session_cookie(self.headers.get("Cookie"))
                if self.path.endswith("/preview"):
                    result = preview_role_change(connection, actor, token, payload["action"])
                else:
                    result = confirm_role_change(connection, actor, token, payload["action"], payload["proof"])
                    if result["status"] == "updated":
                        account_ids = result.pop("notificationAccountIds")
                        result["notifications"] = role_change_notifications(
                            connection, smtp_config_path(DB_PATH), account_ids)
                self.respond(409 if result.get("status") == "confirmation required" else 200, result)
        except PermissionError:
            self.respond(403, {"error": "forbidden"})
        except (ValueError, TypeError, sqlite3.IntegrityError) as exc:
            self.respond(400, {"error": str(exc)})

    def handle_user_mutation(self):
        """Administrator-only account creation and section permission changes."""
        origin = self.headers.get("Origin")
        if not PUBLIC_ORIGIN or not require_same_origin(origin, PUBLIC_ORIGIN):
            self.respond(403, {"error": "forbidden"})
            return
        length = self.headers.get("Content-Length")
        inventory_path = self.path.startswith(("/api/devices/", "/api/ipam/", "/api/inventory/"))
        request_limit = MAX_IMPORT_BYTES if inventory_path and self.path != "/api/devices/ipam/link" else MAX_LOGIN_BYTES
        if length is None or not length.isdecimal() or not 0 < int(length) <= request_limit:
            self.respond(400, {"error": "invalid request size"})
            return
        if self.headers.get("Content-Type", "").split(";")[0].strip().lower() != "application/json":
            self.respond(415, {"error": "JSON required"})
            return
        notice_recipients = set()
        security_change = self.path in (
            "/api/account/profile", "/api/account/password", "/api/account/mfa/confirm", "/api/account/mfa/remove",
            "/api/users/profile", "/api/users/active",
            "/api/users/admin", "/api/users/create", "/api/users/delete")
        try:
            payload = json.loads(self.rfile.read(int(length)), object_pairs_hook=unique_link_fields) if self.path == "/api/devices/ipam/link" else json.loads(self.rfile.read(int(length)))
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
                if security_change:
                    target = payload.get("userId", actor)
                    if type(target) is not int:
                        raise ValueError("Invalid user identifier")
                    if self.path in ("/api/account/profile", "/api/users/profile"):
                        prior = connection.execute("SELECT email FROM account_profiles WHERE account_id=?", (target,)).fetchone()
                        details = payload.get("profile", payload)
                        if not isinstance(details, dict) or not isinstance(details.get("email", ""), str):
                            raise ValueError("Invalid profile details")
                        if (prior[0] if prior else "") == details.get("email", "").strip():
                            security_change = False
                    notice_recipients = security_recipients(connection, target)
                    notice_recipients.update(security_recipients(connection, administrators=True))
                if self.path == "/api/inventory/reset" and not connection.execute(
                    "SELECT 1 FROM accounts WHERE id=? AND is_admin=1", (actor,)
                ).fetchone():
                    self.respond(403, {"error": "forbidden"})
                    return
                if self.path == "/api/account/profile":
                    result = save_profile(connection, actor, payload)
                elif self.path == "/api/account/photo/remove":
                    if payload != {"remove": True}:
                        raise ValueError("Invalid photo removal request")
                    remove_profile_photo(connection, actor)
                    result = {"status": "removed"}
                elif self.path == "/api/inventory/settings/save":
                    if set(payload) != {"key", "value"}:
                        raise ValueError("Invalid inventory settings request")
                    save_inventory_setting(connection, actor, payload["key"], payload["value"])
                    result = {"status": "saved"}
                elif self.path == "/api/inventory/ipam/repair":
                    if set(payload) != {"expectedFixes"}:
                        raise ValueError("Invalid IPAM repair request")
                    repaired = apply_ipam_repairs(connection, actor, payload["expectedFixes"])
                    result = {"status": "repaired", "count": repaired}
                elif self.path == "/api/inventory/reset":
                    if payload != {"confirmed": True}:
                        raise ValueError("Clean Start confirmation required")
                    reset_inventory(connection, actor)
                    result = {"status": "reset"}
                elif self.path == "/api/inventory/device-catalogue/change":
                    if set(payload) != {"kind", "operation", "oldName", "newName", "expectedDevices"}:
                        raise ValueError("Invalid managed catalogue request")
                    affected = change_device_catalogue(
                        connection, actor, payload["kind"], payload["operation"],
                        payload["oldName"], payload["newName"], payload["expectedDevices"]
                    )
                    result = {"status": "saved", "affectedDevices": affected}
                elif self.path == "/api/inventory/rack-shelves/remove":
                    if set(payload) != {"shelfId", "expectedShelf", "devices"}:
                        raise ValueError("Invalid rack shelf removal request")
                    count = remove_linked_rack_shelf(connection, actor, payload["shelfId"],
                                                    payload["expectedShelf"], payload["devices"])
                    result = {"status": "deleted", "affectedDevices": count}
                elif self.path in ("/api/inventory/record/save", "/api/inventory/record/delete"):
                    expected = ({"collection", "id", "record"}
                                if self.path.endswith("/save") else {"collection", "id"})
                    if set(payload) != expected:
                        raise ValueError("Invalid inventory request")
                    change_inventory_record(
                        connection, actor, payload["collection"], payload["id"],
                        payload["record"] if self.path.endswith("/save") else None,
                    )
                    result = {"status": "saved"}
                elif self.path in ("/api/ipam/allocation/save", "/api/ipam/allocation/delete"):
                    expected = ({"ip", "record"} if self.path.endswith("/save") else {"ip"})
                    if set(payload) != expected:
                        raise ValueError("Invalid IPAM request")
                    change_independent_allocation(
                        connection, actor, payload["ip"],
                        payload["record"] if self.path.endswith("/save") else None,
                    )
                    result = {"status": "saved"}
                elif self.path == "/api/ipam/subnets/delete":
                    if set(payload) != {"subnetId", "expectedDevices", "expectedIps"}:
                        raise ValueError("Invalid subnet deletion request")
                    delete_subnet_with_dependencies(
                        connection, actor, payload["subnetId"],
                        payload["expectedDevices"], payload["expectedIps"]
                    )
                    result = {"status": "deleted"}
                elif self.path == "/api/ipam/subnets/save":
                    if set(payload) != {"changes"}:
                        raise ValueError("Invalid subnet save request")
                    change_ipam_subnet_and_vlan_records(
                        connection, actor, payload["changes"]
                    )
                    result = {"status": "saved"}
                elif self.path == "/api/ipam/allocation/bulk":
                    if set(payload) != {"changes"}:
                        raise ValueError("Invalid bulk IPAM request")
                    change_bulk_allocations(connection, actor, payload["changes"])
                    result = {"status": "saved"}
                elif self.path == "/api/devices/delete":
                    if set(payload) not in ({"deviceId", "revision"},
                                            {"deviceId", "revision", "relatedDevices"}):
                        raise ValueError("Invalid device delete request")
                    delete_reserved_device(connection, actor, payload["deviceId"],
                                           payload["revision"], payload.get("relatedDevices"))
                    result = {"status": "deleted"}
                elif self.path == "/api/devices/ipam/link":
                    result = link_device_to_ipam(connection, actor,
                        read_session_cookie(self.headers.get("Cookie")), payload)
                elif self.path == "/api/devices/create":
                    if set(payload) != {"record"}:
                        raise ValueError("Invalid device create request")
                    result = {"revision": create_device(connection, actor, payload["record"])}
                elif self.path == "/api/devices/edit/save":
                    if set(payload) not in ({"deviceId", "revision", "record"},
                                            {"deviceId", "revision", "record", "section"},
                                            {"deviceId", "revision", "record", "relatedDevices"},
                                            {"deviceId", "revision", "record", "section", "relatedDevices"}):
                        raise ValueError("Invalid device save request")
                    result = {"revision": save_reserved_device(
                        connection, actor, payload["deviceId"], payload["revision"],
                        payload["record"], payload.get("section", "Devices"),
                        payload.get("relatedDevices"))}
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
                        if not can_access(connection, actor, section, edit=True):
                            raise PermissionError("Section edit permission was revoked")
                        if not feature_enabled(connection, "Devices"):
                            raise PermissionError("Devices feature is disabled")
                        connection.execute("DELETE FROM device_edit_reservations WHERE expires_at<=?", (now,))
                        if self.path.endswith("/start"):
                            device = connection.execute("SELECT revision FROM inventory_devices WHERE id=?", (device_id,)).fetchone()
                            if device is None:
                                raise ValueError("Device not found")
                            existing = connection.execute(
                                "SELECT reservation.account_id, account.username "
                                "FROM device_edit_reservations AS reservation "
                                "JOIN accounts AS account ON account.id=reservation.account_id "
                                "WHERE reservation.device_id=?", (device_id,)
                            ).fetchone()
                            if existing and existing[0] != actor:
                                raise ValueError("Device is being edited by " + existing[1])
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
                elif self.path == "/api/account/mfa/remove":
                    if set(payload) != {"password", "code"}:
                        raise ValueError("Current password and authenticator code required")
                    account = connection.execute(
                        "SELECT username FROM accounts WHERE id=?", (actor,),
                    ).fetchone()
                    if account is None:
                        raise PermissionError("Invalid credentials or MFA request")
                    username = account[0]
                    peer = self.client_address[0]
                    if not THROTTLE.allowed(peer, username):
                        raise PermissionError("Invalid credentials or MFA request")
                    try:
                        remove_own_mfa(
                            connection, actor, payload["password"], payload["code"],
                            session_token=read_session_cookie(self.headers.get("Cookie")),
                        )
                    except (PermissionError, ValueError):
                        THROTTLE.failed(peer, username)
                        raise PermissionError("Invalid credentials or MFA request") from None
                    THROTTLE.succeeded(peer, username)
                    result = {"status": "mfa removed"}
                elif self.path == "/api/account/mfa/start":
                    if set(payload) != {"password"}:
                        raise ValueError("Password required")
                    row = connection.execute(
                        "SELECT username,password_hash,mfa_secret,mfa_confirmed FROM accounts WHERE id=?",
                        (actor,),
                    ).fetchone()
                    if row is None or not verify_password(payload["password"], row[1]):
                        raise ValueError("Invalid password")
                    if row[3]:
                        raise ValueError("MFA already enrolled")
                    secret = row[2] or new_secret()
                    if not row[2]:
                        connection.execute("UPDATE accounts SET mfa_secret=? WHERE id=?", (secret, actor))
                        connection.commit()
                    result = {"mfaSecret": secret, "mfaUri": provisioning_uri(row[0], secret)}
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
                        username = connection.execute(
                            "SELECT username FROM accounts WHERE id=?", (actor,)
                        ).fetchone()[0]
                        record_actor_event(
                            connection, actor, kind="Security", action="Updated",
                            label=username, reason="MFA enrolment confirmed",
                            fields=["Multi-factor authentication"],
                            before={"MFA status": "Not enrolled"},
                            after={"MFA status": "Enabled"},
                        )
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
                        username = connection.execute(
                            "SELECT username FROM accounts WHERE id=?", (actor,)
                        ).fetchone()[0]
                        record_actor_event(
                            connection, actor, kind="Security", action="Updated",
                            label=username, reason="Account password changed",
                            fields=["Password"],
                        )
                        connection.execute(
                            "DELETE FROM account_sessions WHERE account_id=?", (actor,)
                        )
                        connection.commit()
                    except BaseException:
                        connection.rollback()
                        raise
                    result = {"status": "password changed"}
                elif self.path in ("/api/settings/email", "/api/settings/email/test"):
                    administrator = connection.execute(
                        "SELECT active,is_admin,mfa_confirmed FROM accounts WHERE id=?",
                        (actor,),
                    ).fetchone()
                    if administrator != (1, 1, 1):
                        raise PermissionError("Verified administrator required")
                    if self.path == "/api/settings/email":
                        saved = save_smtp_settings(smtp_config_path(DB_PATH), payload)
                        record_actor_event(
                            connection, actor, kind="Security", action="Updated",
                            label="Outgoing email", reason="SMTP configuration updated",
                            fields=["Outgoing email configuration"],
                        )
                        result = saved
                    else:
                        if set(payload) != {"recipient"}:
                            raise ValueError("A test recipient is required")
                        result = send_test_email(smtp_config_path(DB_PATH), payload["recipient"])
                        record_actor_event(
                            connection, actor, kind="Security", action="Created",
                            label="SMTP test", reason="SMTP test message sent",
                            fields=["Delivery tested"],
                        )
                elif self.path == "/api/users/create":
                    if set(payload) not in ({"username", "password"},
                                            {"username", "password", "profile"}):
                        raise ValueError("Username and password required")
                    user_id = create_user(
                        connection, actor, payload["username"], payload["password"],
                        profile=payload.get("profile"),
                    )
                    result = {"id": user_id}
                elif self.path == "/api/users/profile":
                    if (set(payload) != {"userId", "profile"}
                            or type(payload["userId"]) is not int):
                        raise ValueError("Invalid user profile request")
                    administrator = connection.execute(
                        "SELECT active,is_admin,mfa_confirmed FROM accounts WHERE id=?",
                        (actor,),
                    ).fetchone()
                    if administrator != (1, 1, 1):
                        raise PermissionError("Verified administrator required")
                    result = save_profile(connection, actor, payload["profile"],
                                          target_id=payload["userId"])
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
            message = str(exc)
            if self.path != "/api/devices/ipam/link" and self.path.startswith(("/api/devices/", "/api/ipam/", "/api/inventory/")):
                with connect() as connection:
                    actor = authenticated_account(connection, self.headers.get("Cookie"))
                    if not all(can_access(connection, actor, section)
                               for section in ("Devices", "IPAM", "Racks")):
                        # Validation checks the full saved inventory. Do not reveal
                        # hidden record names or addresses in a conflict message.
                        message = "Inventory operation could not be completed. Check your access and submitted values."
            self.respond(400, {"error": message})
            return
        except (OSError, smtplib.SMTPException, ssl.SSLError):
            # Do not reflect mail-server diagnostics or credential details to clients.
            self.respond(502, {"error": "SMTP operation failed. Check server configuration and connectivity."})
            return
        if security_change:
            with connect() as connection:
                connection.execute("DELETE FROM account_email_proofs WHERE account_id=?", (payload.get("userId", actor),))
            notify_security_change(smtp_config_path(DB_PATH), notice_recipients)
        self.respond(200, result, cookie=clear_session_cookie()
                     if self.path == "/api/account/mfa/remove" else None)

    def handle_account_email(self):
        """Keep email proofs separate from sessions, with same-origin and abuse checks."""
        if not PUBLIC_ORIGIN or not require_same_origin(self.headers.get("Origin"), PUBLIC_ORIGIN):
            self.respond(403, {"error": "forbidden"})
            return
        length = self.headers.get("Content-Length", "")
        if not length.isdecimal() or not 0 < int(length) <= MAX_LOGIN_BYTES:
            self.respond(400, {"error": "invalid request size"})
            return
        if self.headers.get("Content-Type", "").split(";")[0].strip().lower() != "application/json":
            self.respond(415, {"error": "JSON required"})
            return
        private = self.path.startswith("/api/account/")
        requesting = self.path.endswith("/request")
        try:
            payload = json.loads(self.rfile.read(int(length)))
            expected = ({"password"} if requesting else {"password", "token", "challengeId"}) if private else (
                {"username"} if requesting else {"token", "password", "mfa_code", "challengeId"})
            if not isinstance(payload, dict) or set(payload) != expected or any(
                    not isinstance(value, str) for value in payload.values()):
                raise ValueError("Invalid email confirmation request")
            with connect() as connection:
                actor = None
                if private:
                    actor = authorised_mutation(connection, self.headers.get("Cookie"),
                                                self.headers.get("Origin"), PUBLIC_ORIGIN,
                                                self.headers.get("X-CSRF-Token"))
                    if actor is None:
                        self.respond(403, {"error": "forbidden"})
                        return
                key = str(actor) if private else payload.get("username", "confirmation")[:256]
                peer = self.client_address[0]
                # A separate email-operation limit does not alter the existing login throttle.
                throttle_key = ("verification:" if private else "recovery:") + key
                if not MAIL_REQUESTS.allowed(peer, throttle_key):
                    if requesting and not private:
                        self.respond(200, {"message": REQUEST_MESSAGE, "challengeId": secrets.token_hex(32)})
                    else:
                        self.respond(429, {"error": "Please wait before trying again"})
                    return
                MAIL_REQUESTS.failed(peer, throttle_key)
                if private:
                    row = connection.execute("SELECT password_hash FROM accounts WHERE id=?", (actor,)).fetchone()
                    if not row or not verify_password(payload["password"], row[0]):
                        raise ValueError("Current credentials are invalid")
                if requesting:
                    if not private:
                        row = connection.execute("SELECT id FROM accounts WHERE username=? COLLATE NOCASE AND active=1",
                                                 (payload["username"].strip(),)).fetchone()
                        actor = row[0] if row else None
                    configured = smtp_public_settings(smtp_config_path(DB_PATH))["configured"]
                    proof = issue_email_proof(connection, actor, "verify" if private else "recover") if configured and actor else None
                    connection.commit()
                    if proof:
                        token, recipient, challenge_id = proof
                        queue_email(smtp_config_path(DB_PATH), recipient,
                                    "Caffoot Lite email verification" if private else "Caffoot Lite password recovery",
                                    ("Confirm email ownership" if private else "Recover your password") +
                                    " by entering this single-use code in your Caffoot Lite installation:\n\n" + token +
                                    "\n\nIt expires in 15 minutes. Required authenticator protection still applies. "
                                    "If you did not request this, ignore this message.")
                    self.respond(200, {"message": REQUEST_MESSAGE, "challengeId": proof[2] if proof else secrets.token_hex(32)})
                    return
                target = confirm_email_proof(connection, payload["token"], "verify" if private else "recover",
                                             challenge_id=payload["challengeId"], account_id=actor if private else None,
                                             password=payload["password"], mfa_code=payload.get("mfa_code"))
                recipients = security_recipients(connection, target)
                recipients.update(security_recipients(connection, administrators=True))
            notify_security_change(smtp_config_path(DB_PATH), recipients)
            self.respond(200, {"status": "Email verified" if private else "Password updated; sign in with your authenticator if required"})
        except (ValueError, TypeError):
            self.respond(400, {"error": "Invalid or expired confirmation"})
        except (OSError, smtplib.SMTPException):
            if requesting:
                self.respond(200, {"message": REQUEST_MESSAGE, "challengeId": secrets.token_hex(32)})
            else:
                self.respond(503, {"error": "Email confirmation is temporarily unavailable"})
        except sqlite3.Error:
            self.respond(503, {"error": "database unavailable"})

    def handle_profile_photo(self):
        """Upload private user image bytes only after session and CSRF verification."""
        origin = self.headers.get("Origin")
        if not PUBLIC_ORIGIN or not require_same_origin(origin, PUBLIC_ORIGIN):
            self.respond(403, {"error": "forbidden"})
            return
        raw_length = self.headers.get("Content-Length")
        if (raw_length is None or not raw_length.isdecimal() or
                not 0 < int(raw_length) <= MAX_PHOTO_BYTES):
            self.respond(413, {"error": "Profile photo must be no larger than 5 MB"})
            return
        mime = self.headers.get("Content-Type", "").split(";")[0].strip().lower()
        if mime not in ("image/png", "image/jpeg", "image/webp"):
            self.respond(415, {"error": "JPG, PNG or WEBP required"})
            return
        with connect() as connection:
            actor = authorised_mutation(
                connection, self.headers.get("Cookie"), origin, PUBLIC_ORIGIN,
                self.headers.get("X-CSRF-Token"),
            )
            if actor is None:
                self.respond(403, {"error": "forbidden"})
                return
            payload = self.rfile.read(int(raw_length))
            try:
                save_profile_photo(connection, actor, mime, payload)
            except ValueError as exc:
                self.respond(400, {"error": str(exc)})
                return
        self.respond(200, {"status": "saved"})

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
                actor = authenticated_account(connection, self.headers.get("Cookie"))
                if actor is None or not connection.execute(
                    "SELECT 1 FROM accounts WHERE id=? AND is_admin=1", (actor,)
                ).fetchone():
                    self.respond(403, {"error": "forbidden"})
                    return
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
