"""Fictional installation data shared by the two private rehearsal images.

The caller runs this file inside a disposable container. No real installation
or external mail service is used, and private values are never printed.
"""
import hashlib
from contextlib import closing
import json
import sqlite3
import time
from pathlib import Path

PASSWORD = "Fictional-Restore-Password-2026!"
SECRET = "JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP"


def connect():
    connection = sqlite3.connect("/data/caffoot.sqlite3")
    connection.execute("PRAGMA foreign_keys=ON")
    return connection


def seed_installation():
    """Use published v2.1 helpers to create accounts and private settings."""
    from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
    from backend.account_email import issue_email_proof
    from backend.inventory import stage_inventory
    from backend.mfa import code_at
    from backend.permissions import create_user
    from backend.sessions import login_session
    from backend.smtp_settings import save_settings

    with connect() as db:
        assert db.execute("SELECT max(version) FROM schema_migrations").fetchone() == (10,)
        owner, secret = bootstrap_first_admin(db, "restore-owner", PASSWORD)
        confirm_admin_mfa(db, owner, code_at(secret, time.time()))
        for name, grant, state, active in (
            ("reader-unenrolled", "read", "absent", 1),
            ("reader-pending", "read", "pending", 1),
            ("reader-enrolled", "read", "confirmed", 1),
            ("editor", "edit", "confirmed", 1),
            ("disabled", "read", "confirmed", 0),
            ("staff", None, "absent", 1),
            ("staff-voluntary", None, "confirmed", 1),
        ):
            account = create_user(db, owner, name, PASSWORD, {
                "firstName": "Fictional", "lastName": name,
                "displayName": name, "email": name + "@example.test",
            })
            db.execute("UPDATE accounts SET active=?,mfa_secret=?,mfa_confirmed=? WHERE id=?",
                       (active, None if state == "absent" else SECRET,
                        int(state == "confirmed"), account))
            if grant:
                db.executemany("INSERT INTO account_permissions VALUES(?,?,?)",
                               [(account, section, grant) for section in ("Devices", "IPAM", "Racks")])
            db.execute("UPDATE account_profiles SET email_verified=? WHERE account_id=?",
                       (int(name != "reader-pending"), account))
            db.commit()
        stage_inventory(db, {
            "devices": [{"id": "restore-device", "name": "Fictional Desktop",
                         "type": "Desktop", "mountType": "Desktop",
                         "notes": "Preserve this fictional note", "primaryIp": "192.0.2.10"}],
            "subnets": [{"id": "restore-network", "name": "Fictional Network", "cidr": "192.0.2.0/24"}],
            "vlans": [{"id": "restore-vlan", "name": "Fictional VLAN", "vlanId": 10}],
            "racks": [{"id": "restore-rack", "name": "Fictional Rack", "height": 42}],
            "rackAccessories": [],
            "ipAllocations": {"192.0.2.10": {"deviceId": "restore-device", "status": "Assigned"}},
        })
        db.commit()
        issue_email_proof(db, 2, "verify")
        for name, secret in (("restore-owner", secret), ("reader-unenrolled", None),
                             ("reader-enrolled", SECRET), ("editor", SECRET), ("staff", None)):
            assert login_session(db, name, PASSWORD,
                                 mfa_code=code_at(secret, time.time()) if secret else None)
    save_settings("/data/smtp-settings.json", {
        "host": "smtp.example.test", "port": 587, "security": "starttls",
        "authenticate": True, "username": "fictional@example.test",
        "password": "Fictional-SMTP-Secret", "fromName": "Fictional Restore",
        "fromEmail": "fictional@example.test", "insecureConfirmed": False,
    })


def database_snapshot():
    """Compare complete ordered rows, including binary profile values."""
    # Closing the last connection removes temporary SQLite WAL bookkeeping,
    # so the file comparison describes the stopped installation itself.
    with closing(connect()) as db:
        assert db.execute("PRAGMA integrity_check").fetchone() == ("ok",)
        assert not db.execute("PRAGMA foreign_key_check").fetchall()
        tables = [row[0] for row in db.execute(
            "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")]
        return {table: [[{"bytes": value.hex()} if isinstance(value, bytes) else value
                         for value in row] for row in db.execute(
                             'SELECT * FROM "' + table + '" ORDER BY rowid')]
                for table in tables}


def file_manifest():
    """Record file contents and ownership without exposing private material."""
    result = {}
    for path in sorted(Path("/data").rglob("*")):
        info = path.stat()
        result[str(path.relative_to("/data"))] = {
            "sha256": hashlib.sha256(path.read_bytes()).hexdigest() if path.is_file() else None,
            "mode": info.st_mode & 0o777, "uid": info.st_uid, "gid": info.st_gid,
        }
    return result


def verify_upgraded_policy():
    """Check migrated sign-in and later inheritance using the real new policy."""
    from backend.authentication import MFAEnrolmentRequired
    from backend.schema import SCHEMA_VERSION
    from backend.permissions import can_access
    from backend.role_policy import evaluate_role_policy
    from backend.sessions import login_session
    with connect() as db:
        assert db.execute("SELECT max(version) FROM schema_migrations").fetchone() == (SCHEMA_VERSION,)
        for name in ("reader-unenrolled", "reader-pending"):
            try:
                login_session(db, name, PASSWORD, report_enrolment=True)
            except MFAEnrolmentRequired:
                pass
            else:
                raise AssertionError("Migrated Read account must enrol before sign-in")
        assert not db.execute("SELECT * FROM account_sessions").fetchall()
        account = db.execute("SELECT id FROM accounts WHERE username='staff'").fetchone()[0]
        assert evaluate_role_policy(db, account).permissions == {}
        assert not any(can_access(db, account, section) for section in ("Devices", "IPAM", "Racks"))
        # A missing old row must still allow an explicitly assigned role later.
        role = db.execute("INSERT INTO roles(role_key,name) VALUES('restore_readers','Restore Readers')").lastrowid
        db.execute("INSERT INTO role_grants VALUES(?,'Devices','read')", (role,))
        db.execute("INSERT INTO account_roles VALUES(?,?)", (account, role))
        # Schema 12 deliberately preserves old No Access with an override.
        # Choosing Inherit is required before a later role can supply access.
        db.execute("DELETE FROM account_permission_overrides WHERE account_id=? AND section='Devices'", (account,))
        assert evaluate_role_policy(db, account).permissions == {"Devices": "edit" if SCHEMA_VERSION >= 12 else "read"}
        assert evaluate_role_policy(db, account).mfa_mandatory
        assert not can_access(db, account, "Devices")
        db.rollback()
