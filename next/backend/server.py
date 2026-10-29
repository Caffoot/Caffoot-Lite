"""Minimal Caffoot Lite Next backend foundation.

No inventory endpoints are exposed until the v1.3.3-compatible database
projection, authentication and permissions are implemented.
"""
import json
import os
import sqlite3
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from .schema import initialise_database as migrate_database
from .request_auth import authenticated_account, csrf_for_session
from .http_security import read_session_cookie

DB_PATH = Path(os.environ.get("CAFFOOT_DB_PATH", "/data/caffoot.sqlite3"))
HOST = os.environ.get("CAFFOOT_HOST", "0.0.0.0")
PORT = int(os.environ.get("CAFFOOT_PORT", "8080"))


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

    def respond(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(body)


def main():
    initialise_database()
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    server.serve_forever()


if __name__ == "__main__":
    main()
