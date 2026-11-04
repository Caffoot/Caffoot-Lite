"""Last-resort recovery for the sole administrator, run locally by the host operator.

Stop Caffoot Lite and back up its complete data volume before using this command.
There is deliberately no HTTP route for this operation. The existing first-run
MFA confirmation flow must be completed before the administrator can sign in.
"""
import getpass
import os
from pathlib import Path
import sqlite3

from .accounts import hash_password
from .audit_events import record_actor_event
from .mfa import new_secret


def recover_sole_administrator(connection, username, password):
    """Keep the same identity and data, revoke sessions and require fresh MFA."""
    encoded = hash_password(password)
    connection.execute("BEGIN IMMEDIATE")
    try:
        rows = connection.execute(
            "SELECT id,username,active FROM accounts WHERE is_admin=1"
        ).fetchall()
        if len(rows) != 1 or rows[0][1] != username or rows[0][2] != 1:
            raise ValueError("Recovery requires the exact username of the sole active administrator")
        account_id = rows[0][0]
        connection.execute(
            "UPDATE accounts SET password_hash=?,mfa_secret=?,mfa_confirmed=0 WHERE id=?",
            (encoded, new_secret(), account_id),
        )
        connection.execute("DELETE FROM account_sessions WHERE account_id=?", (account_id,))
        connection.execute("DELETE FROM device_edit_reservations WHERE account_id=?", (account_id,))
        connection.execute("DELETE FROM account_email_proofs WHERE account_id=?", (account_id,))
        record_actor_event(
            connection, account_id, kind="Security", action="Updated", label=username,
            reason="Sole administrator recovered by local Docker host operator; fresh MFA required",
            fields=["Credentials", "Sessions", "MFA enrolment"],
        )
        connection.commit()
    except BaseException:
        connection.rollback()
        raise


def main():
    path = Path(os.environ.get("CAFFOOT_DB_PATH", "/data/caffoot.sqlite3")).resolve()
    if not path.is_file():
        raise SystemExit("Existing database not found; no database was created")
    print("Caffoot Lite must be stopped. Back up the entire data volume first.")
    username = input("Sole administrator username: ")
    if input("Type RECOVER to continue: ") != "RECOVER":
        raise SystemExit("Cancelled")
    password = getpass.getpass("New password: ")
    if password != getpass.getpass("Confirm new password: "):
        raise SystemExit("Passwords do not match")
    with sqlite3.connect(path.as_uri() + "?mode=rw", uri=True) as connection:
        connection.execute("PRAGMA foreign_keys=ON")
        from .schema import SCHEMA_VERSION
        version = connection.execute("SELECT MAX(version) FROM schema_migrations").fetchone()[0]
        if version != SCHEMA_VERSION:
            raise SystemExit("Use the same application build that last upgraded this database")
        recover_sole_administrator(connection, username, password)
    print("Credentials restored. Restart Caffoot Lite, resume setup and confirm a new authenticator before signing in.")


if __name__ == "__main__":
    main()
