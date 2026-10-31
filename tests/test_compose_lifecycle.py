"""Opt-in real Docker Compose lifecycle verification.

Run from next/: CAFFOOT_DOCKER_SMOKE=1 python -m unittest tests.test_compose_lifecycle -v
Requires Docker Compose and permission to access the Docker daemon.
Uses a uniquely named temporary Compose project and removes its volume afterward.
"""
import os
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
        def run(*args):
            return subprocess.run([*command, *args], cwd=root, env=env,
                                  check=True, capture_output=True, text=True).stdout.strip()
        def inside(script):
            return run("exec", "-T", "caffoot-next", "python", "-c", script)
        try:
            run("up", "--build", "-d", "--wait")
            self.assertEqual(run("port", "caffoot-next", "8080").split(":")[-1], str(port))
            self.assertEqual(inside(
                "import pathlib; p=pathlib.Path('/opt/caffoot/inventory.html'); "
                "print(p.is_file() and p.stat().st_size > 800000)"), "True")
            fingerprint = inside(
                "import hashlib,pathlib; print(hashlib.sha256(pathlib.Path('/data/tls/server.crt').read_bytes()).hexdigest())")
            inside("import sqlite3; c=sqlite3.connect('/data/caffoot.sqlite3'); "
                   "c.execute('CREATE TABLE IF NOT EXISTS smoke_marker (value TEXT)'); "
                   "c.execute(\"INSERT INTO smoke_marker VALUES ('persisted')\"); c.commit()")
            run("restart", "caffoot-next")
            self.assertEqual(fingerprint, inside(
                "import hashlib,pathlib; print(hashlib.sha256(pathlib.Path('/data/tls/server.crt').read_bytes()).hexdigest())"))
            self.assertEqual(inside(
                "import sqlite3; c=sqlite3.connect('/data/caffoot.sqlite3'); "
                "print(c.execute('SELECT value FROM smoke_marker').fetchone()[0])"), "persisted")
            run("up", "-d", "--wait", "--force-recreate")
            self.assertEqual(fingerprint, inside(
                "import hashlib,pathlib; print(hashlib.sha256(pathlib.Path('/data/tls/server.crt').read_bytes()).hexdigest())"))
            self.assertEqual(inside(
                "import sqlite3; c=sqlite3.connect('/data/caffoot.sqlite3'); "
                "print(c.execute('SELECT value FROM smoke_marker').fetchone()[0])"), "persisted")
        finally:
            run("down", "-v", "--remove-orphans")


if __name__ == "__main__":
    unittest.main()
