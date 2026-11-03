"""Prepare disposable accounts and realistic saved devices for the Svelte browser check.

This script only runs against the temporary database path passed by the test.
"""
import json
import sqlite3
import sys
import time
from pathlib import Path

# Direct execution from tests/ needs the repository root on the import path.
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from backend.accounts import bootstrap_first_admin, confirm_admin_mfa
from backend.http_security import COOKIE_NAME
from backend.mfa import code_at
from backend.permissions import create_user, set_permission
from backend.schema import initialise_database
from backend.sessions import login_session


def create_fixture(path):
    with sqlite3.connect(path) as db:
        db.execute("PRAGMA foreign_keys=ON")
        initialise_database(db)
        owner, secret = bootstrap_first_admin(db, "owner", "password")
        now = time.time()
        confirm_admin_mfa(db, owner, code_at(secret, now), timestamp=now)
        admin = login_session(db, "owner", "password",
                              mfa_code=code_at(secret, now), now=now)
        viewer = create_user(db, owner, "viewer", "password")
        set_permission(db, owner, viewer, "Devices", "read")
        viewer_token = login_session(db, "viewer", "password")
        not_allowed = create_user(db, owner, "ipam-reader", "password")
        set_permission(db, owner, not_allowed, "IPAM", "read")
        ipam_token = login_session(db, "ipam-reader", "password")

        host = {
            "id": "host-1", "name": "Hypervisor-01",
            "type": "Server - Physical", "location": "Server Room",
            "status": "Active", "primaryIp": "10.12.0.10",
            "manufacturer": "Dell", "model": "PowerEdge R650", "serialNumber": "XYZ-1",
            "mountType": "Rack Mounted", "rackId": "rack-1", "face": "front",
            "rackUStart": 18, "rackUEnd": 19, "notes": "Physical hypervisor.",
            "typeDetails": {
                "serverService_Hypervisor": True, "hypervisorProduct": "Proxmox VE",
                "hypervisorVersion": "8.2"
            }
        }
        vm = {
            "id": "guest-1", "name": "App-VM-01", "type": "Server - Virtual",
            "isVirtual": True, "virtualHostId": "host-1", "location": "Server Room",
            "status": "Active", "primaryIp": "10.12.0.11",
            "vmVcpu": 4, "vmRamGb": 8, "vmDiskGb": 100, "vmNicCount": 2,
            "virtualPlatform": "Proxmox VE", "mountType": "Not Applicable",
            "typeDetails": {"softwarePlatform": "Ubuntu Server"},
            "notes": "VM allocates resources from its host."
        }
        # A separate unusual name checks HTML escaping without spoiling
        # screenshots of the normal physical host and VM.
        tricky = {
            "id": "tricky-1", "name": "Test <script>alert(1)</script> &",
            "type": "Switch", "status": "Active", "location": "Office",
            "primaryIp": "", "mountType": "Desktop", "notes": "Escaping test."
        }
        for ordinal, device in enumerate((host, vm, tricky)):
            db.execute("INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES(?,?,?,?)",
                       (device["id"], device["name"], json.dumps(device), ordinal))
        rack = {"id": "rack-1", "name": "Rack A", "heightU": 42}
        db.execute("INSERT INTO inventory_racks(id,record_json,ordinal) VALUES(?,?,?)",
                   (rack["id"], json.dumps(rack), 0))
        db.commit()
    return {"admin": admin, "viewer": viewer_token, "ipam": ipam_token,
            "cookie_name": COOKIE_NAME}


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python tests/svelte_readonly_fixture.py /tmp/temporary.sqlite3")
    print(json.dumps(create_fixture(Path(sys.argv[1]))))
