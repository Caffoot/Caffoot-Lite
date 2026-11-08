"""Opt-in real Docker Compose lifecycle verification.

Run from repository root: CAFFOOT_DOCKER_SMOKE=1 python -m unittest tests.test_compose_lifecycle -v
Requires Docker Compose and permission to access the Docker daemon.
Uses a uniquely named temporary Compose project and removes its volume afterward.
"""
import os
import json
import shutil
import socket
import subprocess
import tempfile
import unittest
import uuid
from pathlib import Path


@unittest.skipUnless(os.environ.get("CAFFOOT_DOCKER_SMOKE") == "1",
                     "set CAFFOOT_DOCKER_SMOKE=1 for real Docker lifecycle test")
class ComposeLifecycleTests(unittest.TestCase):
    def test_configurable_port_and_persistent_data_after_restart(self):
        if not shutil.which("docker"):
            self.skipTest("Docker unavailable")
        root = Path(__file__).resolve().parents[1]
        project = "caffoot-smoke-" + uuid.uuid4().hex[:12]
        with socket.socket() as probe:
            probe.bind(("127.0.0.1", 0))
            port = probe.getsockname()[1]
        env = dict(os.environ, CAFFOOT_WEB_ADDRESS=f"https://127.0.0.1:{port}",
                   CAFFOOT_SERVER_ADDRESS="127.0.0.1", CAFFOOT_PORT=str(port))
        command = ["docker", "compose", "-p", project, "-f", str(root / "compose.yaml")]
        build_settings = tempfile.TemporaryDirectory(prefix="caffoot-compose-build-")
        if os.environ.get("CAFFOOT_BUILD_CA"):
            override = Path(build_settings.name) / "build-ca.json"
            override.write_text(json.dumps({
                "services": {"caffoot-lite": {"build": {"secrets": ["proxy_ca"]}}},
                "secrets": {"proxy_ca": {"file": str(Path(os.environ["CAFFOOT_BUILD_CA"]).resolve(strict=True))}},
            }))
            command.extend(["-f", str(override)])
        def run(*args):
            return subprocess.run([*command, *args], cwd=root, env=env,
                                  check=True, capture_output=True, text=True).stdout.strip()
        def inside(script):
            return run("exec", "-T", "caffoot-lite", "python", "-c", script)
        try:
            run("up", "--build", "-d", "--wait")
            self.assertEqual(run("port", "caffoot-lite", "8080").split(":")[-1], str(port))
            self.assertEqual(inside(
                "import pathlib; p=pathlib.Path('/opt/caffoot'); "
                "print((p/'inventory.html').is_file() and "
                "(p/'interface/application.js').is_file() and "
                "(p/'interface/screens/device-inventory.html').is_file() and "
                "len(list((p/'interface/screens').glob('*.html'))) >= 12)"), "True")
            fingerprint = inside(
                "import hashlib,pathlib; print(hashlib.sha256(pathlib.Path('/data/tls/server.crt').read_bytes()).hexdigest())")
            inside("import sqlite3; c=sqlite3.connect('/data/caffoot.sqlite3'); "
                   "c.execute('CREATE TABLE IF NOT EXISTS smoke_marker (value TEXT)'); "
                   "c.execute(\"INSERT INTO smoke_marker VALUES ('persisted')\"); c.commit()")
            inside("import sqlite3,time; from backend.accounts import bootstrap_first_admin,confirm_admin_mfa; "
                   "from backend.mfa import code_at; from backend.profiles import save_profile; "
                   "from backend.account_email import issue_email_proof,confirm_email_proof; "
                   "c=sqlite3.connect('/data/caffoot.sqlite3'); "
                   "actor,secret=bootstrap_first_admin(c,'fictional-smoke-owner','Fictional-Smoke-Password'); "
                   "confirm_admin_mfa(c,actor,code_at(secret,time.time())); "
                   "save_profile(c,actor,dict(firstName='',lastName='',displayName='',email='smoke@example.test')); "
                   "proof=issue_email_proof(c,actor,'verify'); "
                   "exec(\"try:\\n confirm_email_proof(c,'invalid!','verify',challenge_id=proof[2],account_id=actor)\\nexcept ValueError: pass\")")
            email_key_hash = inside(
                "import hashlib,pathlib; p=pathlib.Path('/data/account-email-secret.key'); "
                "assert p.stat().st_mode&0o777==0o600; print(hashlib.sha256(p.read_bytes()).hexdigest())")
            run("restart", "caffoot-lite")
            self.assertEqual(fingerprint, inside(
                "import hashlib,pathlib; print(hashlib.sha256(pathlib.Path('/data/tls/server.crt').read_bytes()).hexdigest())"))
            self.assertEqual(inside(
                "import sqlite3; c=sqlite3.connect('/data/caffoot.sqlite3'); "
                "print(c.execute('SELECT value FROM smoke_marker').fetchone()[0])"), "persisted")
            self.assertEqual(email_key_hash, inside("import hashlib,pathlib; print(hashlib.sha256(pathlib.Path('/data/account-email-secret.key').read_bytes()).hexdigest())"))
            self.assertEqual(inside("import sqlite3; c=sqlite3.connect('/data/caffoot.sqlite3'); print(c.execute('SELECT count(*) FROM account_email_attempts').fetchone()[0])"), "1")
            run("up", "-d", "--wait", "--force-recreate")
            self.assertEqual(fingerprint, inside(
                "import hashlib,pathlib; print(hashlib.sha256(pathlib.Path('/data/tls/server.crt').read_bytes()).hexdigest())"))
            self.assertEqual(inside(
                "import sqlite3; c=sqlite3.connect('/data/caffoot.sqlite3'); "
                "print(c.execute('SELECT value FROM smoke_marker').fetchone()[0])"), "persisted")
            self.assertEqual(email_key_hash, inside("import hashlib,pathlib; print(hashlib.sha256(pathlib.Path('/data/account-email-secret.key').read_bytes()).hexdigest())"))
            self.assertEqual(inside("import sqlite3; c=sqlite3.connect('/data/caffoot.sqlite3'); print(c.execute('SELECT count(*) FROM account_email_attempts').fetchone()[0])"), "1")
        finally:
            run("down", "-v", "--remove-orphans")
            build_settings.cleanup()


if __name__ == "__main__":
    unittest.main()
