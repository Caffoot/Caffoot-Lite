"""Opt-in complete-volume upgrade and restore using two local private images.

See the upgrade rehearsal guide for image preparation and the exact command.
Only uniquely named, newly created Compose volumes are ever changed or removed.
"""
import json
import os
import socket
import subprocess
import tempfile
import unittest
import uuid
from pathlib import Path


@unittest.skipUnless(os.environ.get("CAFFOOT_UPGRADE_RESTORE") == "1",
                     "set CAFFOOT_UPGRADE_RESTORE=1 for isolated two-image restore rehearsal")
class UpgradeRestoreTests(unittest.TestCase):
    def test_complete_volume_upgrade_and_matching_image_restore(self):
        old_image = os.environ["CAFFOOT_V21_TEST_IMAGE"]
        new_image = os.environ["CAFFOOT_UPGRADE_TEST_IMAGE"]
        old_revision = os.environ["CAFFOOT_V21_TEST_REVISION"]
        new_revision = os.environ["CAFFOOT_UPGRADE_TEST_REVISION"]
        env = {key: value for key, value in os.environ.items() if key not in (
            "DOCKER_HOST", "DOCKER_CONTEXT", "DOCKER_TLS", "DOCKER_TLS_VERIFY", "DOCKER_CERT_PATH")}
        docker = ["docker", "--host=unix:///var/run/docker.sock"]
        project = "caffoot-restore-" + uuid.uuid4().hex[:12]
        fixture = (Path(__file__).parent / "fixtures/upgrade_restore.py").read_text()
        with socket.socket() as probe:
            probe.bind(("127.0.0.1", 0))
            port = probe.getsockname()[1]

        def run(command, *, source=None):
            result = subprocess.run(command, env=env, input=source, capture_output=True,
                                    text=True, timeout=180)
            if result.returncode:
                self.fail(f"Command failed ({result.returncode}): {command[:5]}\n{result.stderr}")
            return result.stdout.strip()

        for image, revision in ((old_image, old_revision), (new_image, new_revision)):
            actual = run([*docker, "image", "inspect", image, "--format",
                          '{{index .Config.Labels "org.opencontainers.image.revision"}}'])
            self.assertEqual(actual, revision)

        with tempfile.TemporaryDirectory(prefix="caffoot-restore-compose-") as temporary:
            config = Path(temporary) / "compose.json"
            command = [*docker, "compose", "-p", project, "-f", str(config)]

            def configure(image):
                config.write_text(json.dumps({"services": {"caffoot-lite": {
                    "image": image, "environment": {
                        "CAFFOOT_WEB_ADDRESS": f"https://127.0.0.1:{port}",
                        "CAFFOOT_SERVER_ADDRESS": "127.0.0.1", "CAFFOOT_PORT": str(port)},
                    "ports": [f"127.0.0.1:{port}:8080"],
                    "volumes": ["data:/data", "backup:/backup"],
                    "healthcheck": {"test": ["CMD", "python", "-c",
                        "import ssl,urllib.request; urllib.request.urlopen('https://127.0.0.1:8080/health',"
                        "context=ssl._create_unverified_context(),timeout=3)"],
                        "interval": "1s", "timeout": "5s", "retries": 30}}},
                    "volumes": {"data": {}, "backup": {}}}))

            def helper(script, *, root=False):
                return run([*command, "run", "--rm", "-T", "--no-deps",
                            *( ["--user", "0:0"] if root else []),
                            "--entrypoint", "python", "caffoot-lite", "-c", script])

            def snapshot():
                return json.loads(helper(fixture + "\nprint(json.dumps({'tables': database_snapshot(), 'files': file_manifest()}, sort_keys=True))"))

            def compare_snapshot(actual, expected, label):
                for category in ("tables", "files"):
                    self.assertEqual(set(actual[category]), set(expected[category]), f"{label}: {category} names")
                    for name, value in expected[category].items():
                        self.assertTrue(actual[category][name] == value, f"{label}: {category}/{name}")

            configure(old_image)
            try:
                run([*command, "up", "-d", "--wait", "--wait-timeout", "60"])
                run([*command, "stop"])
                helper(fixture + "\nseed_installation()")
                before = snapshot()
                self.assertEqual(len(before["tables"]["accounts"]), 8)
                self.assertEqual(len(before["tables"]["account_sessions"]), 5)
                for name in ("smtp-settings.json", "account-email-secret.key", "tls/server.key", "tls/server.crt"):
                    self.assertIn(name, before["files"])
                helper("import tarfile\nwith tarfile.open('/backup/data.tar','w') as archive:\n"
                       " archive.add('/data',arcname='data')\n"
                       "with tarfile.open('/backup/data.tar') as archive:\n"
                       " assert 'data/tls/server.key' in archive.getnames()", root=True)

                configure(new_image)
                run([*command, "up", "-d", "--wait", "--wait-timeout", "60", "--force-recreate"])
                run([*command, "stop"])
                upgraded = snapshot()
                added = set(upgraded["tables"]) - set(before["tables"])
                self.assertEqual(added, {"roles", "role_grants", "account_roles", "account_permission_overrides"})
                for table, rows in before["tables"].items():
                    if table not in ("schema_migrations", "account_sessions"):
                        self.assertTrue(upgraded["tables"][table] == rows, f"Preserved rows: {table}")
                self.assertEqual(upgraded["tables"]["account_sessions"], [])
                self.assertTrue(upgraded["tables"]["account_permission_overrides"] == before["tables"]["account_permissions"])
                self.assertEqual(len(upgraded["tables"]["account_roles"]), 8)
                for name, metadata in before["files"].items():
                    if not name.startswith("caffoot.sqlite3"):
                        self.assertEqual(upgraded["files"][name], metadata, name)
                helper(fixture + "\nverify_upgraded_policy()")
                run([*command, "up", "-d", "--wait", "--wait-timeout", "60", "--force-recreate"])
                run([*command, "stop"])
                compare_snapshot(snapshot(), upgraded, "Repeated v11 startup")

                # Restore only our generated test volume while its service is stopped.
                helper("import pathlib,shutil,tarfile; "
                       "[shutil.rmtree(p) if p.is_dir() else p.unlink() for p in pathlib.Path('/data').iterdir()]; "
                       "\nwith tarfile.open('/backup/data.tar') as archive:\n"
                       " archive.extractall('/',filter='fully_trusted')", root=True)
                compare_snapshot(snapshot(), before, "Complete restore")
                configure(old_image)
                run([*command, "up", "-d", "--wait", "--wait-timeout", "60", "--force-recreate"])
                run([*command, "stop"])
                compare_snapshot(snapshot(), before, "Matching v2.1 startup after restore")
                helper("import sqlite3,time; from backend.sessions import login_session,session_account; "
                       "db=sqlite3.connect('/data/caffoot.sqlite3'); "
                       "token=login_session(db,'reader-unenrolled','Fictional-Restore-Password-2026!'); "
                       "assert token and session_account(db,token)")
                print(f"Isolated restore passed: {project}; v2.1={old_revision}; v11={new_revision}; "
                      "8 accounts, 5 invalidated sessions, 4 new tables, exact restored rows/files/modes/owners")
            finally:
                run([*command, "down", "-v", "--remove-orphans"])
