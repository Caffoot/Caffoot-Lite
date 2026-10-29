"""Minimal Caffoot Lite Next backend foundation.

No inventory endpoints are exposed until the v1.3.3-compatible database
projection, authentication and permissions are implemented.
"""
import json
import os
import sqlite3
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

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
        connection.execute("""
            CREATE TABLE IF NOT EXISTS schema_migrations (
                version INTEGER PRIMARY KEY,
                applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        """)
        connection.execute(
            "INSERT OR IGNORE INTO schema_migrations (version) VALUES (1)"
        )


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/health":
            try:
                with connect() as connection:
                    connection.execute("SELECT 1").fetchone()
                self.respond(200, {"status": "ok"})
            except sqlite3.Error:
                self.respond(503, {"status": "unavailable"})
        else:
            self.respond(404, {"error": "not found"})

    def respond(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)


def main():
    initialise_database()
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    server.serve_forever()


if __name__ == "__main__":
    main()
