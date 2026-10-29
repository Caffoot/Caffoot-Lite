"""Minimal Caffoot Lite Next backend foundation.

No inventory endpoints are exposed until the v1.3.3-compatible database
projection, authentication and permissions are implemented.
"""
import json
import os
import sqlite3
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

from .schema import initialise_database as migrate_database
from .request_auth import authenticated_account, csrf_for_session
from .http_security import read_session_cookie, session_cookie, clear_session_cookie
from .request_auth import login, logout
from .http_security import require_same_origin
from .tls import ensure_certificate

DB_PATH = Path(os.environ.get("CAFFOOT_DB_PATH", "/data/caffoot.sqlite3"))
HOST = os.environ.get("CAFFOOT_HOST", "0.0.0.0")
PORT = int(os.environ.get("CAFFOOT_PORT", "8080"))
PUBLIC_ORIGIN = os.environ.get("CAFFOOT_PUBLIC_ORIGIN", "")
MAX_LOGIN_BYTES = 4096
TLS_DIR = Path(os.environ.get("CAFFOOT_TLS_DIR", "/data/tls"))
TLS_NAMES = os.environ.get("CAFFOOT_TLS_NAMES", "")


def validate_public_origin(value):
    """Accept only an explicit canonical HTTPS browser origin."""
    if not isinstance(value, str) or not value or value != value.strip():
        raise ValueError("CAFFOOT_PUBLIC_ORIGIN is required")
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
        raise ValueError("CAFFOOT_PUBLIC_ORIGIN must be an HTTPS origin without path or credentials")
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
        if self.path == "/health":
            try:
                with connect() as connection:
                    connection.execute("SELECT 1").fetchone()
                self.respond(200, {"status": "ok"})
            except sqlite3.Error:
                self.respond(503, {"status": "unavailable"})
        elif self.path == "/api/session":
            with connect() as connection:
                cookie = self.headers.get("Cookie")
                account_id = authenticated_account(connection, cookie)
                if account_id is None:
                    self.respond(401, {"error": "unauthorised"})
                    return
                account = connection.execute(
                    "SELECT username,is_admin FROM accounts WHERE id=?",
                    (account_id,),
                ).fetchone()
                if account is None:
                    self.respond(401, {"error": "unauthorised"})
                    return
                self.respond(200, {
                    "username": account[0],
                    "is_admin": bool(account[1]),
                    "csrf_token": csrf_for_session(read_session_cookie(cookie)),
                })
        else:
            self.respond(404, {"error": "not found"})

    def do_POST(self):
        if self.path not in ("/api/login", "/api/logout"):
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
        with connect() as connection:
            token = login(
                connection, self.client_address[0], payload["username"],
                payload["password"], mfa_code=payload.get("mfa_code"),
            )
        if token is None:
            self.respond(401, {"error": "invalid credentials"})
            return
        self.respond(200, {"status": "signed in"}, cookie=session_cookie(token))

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
    validate_public_origin(PUBLIC_ORIGIN)
    if not TLS_NAMES:
        raise RuntimeError("CAFFOOT_TLS_NAMES must identify the TLS hostname or IP")
    context = ensure_certificate(TLS_DIR, TLS_NAMES)
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    server.socket = context.wrap_socket(server.socket, server_side=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
