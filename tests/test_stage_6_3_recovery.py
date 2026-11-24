"""Opt-in isolated Stage 6.3 restore of stopped schema-28 and schema-10 mounts."""
from contextlib import closing
import hashlib
import http.client
from http.cookies import SimpleCookie
import json
import os
from pathlib import Path
import socket
import ssl
import subprocess
import tempfile
import time
import unittest
from uuid import uuid4

from backend.mfa import code_at
from fixtures.stage_6_3_recovery import ATTACHMENT, DISABLED, PNG
from fixtures.upgrade_restore import PASSWORD, SECRET

IMAGES = (
    ('CAFFOOT_V21_TEST_IMAGE', 'c3237114108cad9f7d4e57657b6aed5e0091a5ef'),
    ('CAFFOOT_V22_TEST_IMAGE', '5645bc4f91b8090a3eef62673c817bfaa6b10966'),
)
DOCKER = ('docker', '--host=unix:///var/run/docker.sock')
ZONE = 'Europe/London'


@unittest.skipUnless(os.environ.get('CAFFOOT_STAGE63_RECOVERY') == '1',
                     'set CAFFOOT_STAGE63_RECOVERY=1 to run the disposable rehearsal')
class CompleteVolumeRecoveryTests(unittest.TestCase):
    def setUp(self):
        self.env = {key: value for key, value in os.environ.items()
                    if not key.startswith(('DOCKER_', 'COMPOSE_'))}
        self.name = 'caffoot-stage63-' + uuid4().hex[:12]
        temporary = tempfile.TemporaryDirectory(prefix=self.name + '-')
        self.addCleanup(temporary.cleanup)
        self.temporary = Path(temporary.name)
        self.env_file = self.temporary / 'empty.env'
        self.env_file.touch()
        with closing(socket.socket()) as probe:
            probe.bind(('127.0.0.1', 0))
            self.port = probe.getsockname()[1]
        self.origin = f'https://127.0.0.1:{self.port}'
        fixtures = Path(__file__).parent / 'fixtures'
        self.fixture = '\n'.join((fixtures / name).read_text()
                                 for name in ('upgrade_restore.py', 'stage_6_3_recovery.py'))
        images = []
        for variable, revision in IMAGES:
            image, label, architecture, user = self.docker(
                'image', 'inspect', os.environ[variable], '--format',
                '{{.Id}} {{index .Config.Labels "org.opencontainers.image.revision"}} {{.Architecture}} {{.Config.User}}'
            ).split()
            self.assertEqual(label, revision)
            self.assertEqual(user, '10001:10001')
            images.append(image)
            print(f'IMAGE {image} {architecture} {label}', flush=True)
        self.published, self.review = images

    def docker(self, *args, source=None):
        result = subprocess.run([*DOCKER, *args], input=source, text=True, capture_output=True,
                                timeout=120, check=False, env=self.env, cwd=self.temporary)
        if result.returncode:
            self.fail(f'Docker command {args[0]} {args[1]} failed ({result.returncode})\n{result.stderr}')
        return result.stdout.strip()

    def volume(self, short_name):
        name = f'{self.name}-{short_name}'
        self.assertEqual(self.docker('volume', 'ls', '--filter', f'name=^{name}$', '--quiet'), '')
        self.docker('volume', 'create', '--driver', 'local', '--label', f'caffoot.rehearsal={self.name}', name)
        self.addCleanup(self.remove_volume, name)
        return name

    def remove_volume(self, name):
        label = self.docker('volume', 'inspect', name, '--format',
                            '{{index .Labels "caffoot.rehearsal"}}')
        self.assertEqual(label, self.name)
        self.docker('volume', 'rm', name)
        self.assertEqual(self.docker('volume', 'ls', '--filter', f'name=^{name}$', '--quiet'), '')

    def compose(self, phase, image, mount, *, bind=False):
        project = f'{self.name}-{phase}'
        config = self.temporary / f'{phase}.json'
        service = {
            'image': image, 'pull_policy': 'never',
            'ports': [f'127.0.0.1:{self.port}:8080'],
            'environment': {'CAFFOOT_WEB_ADDRESS': self.origin, 'CAFFOOT_SERVER_ADDRESS': '127.0.0.1',
                            'CAFFOOT_PORT': str(self.port), 'TZ': ZONE},
            'volumes': [{
                'type': 'bind' if bind else 'volume', 'source': str(mount) if bind else 'data',
                'target': '/data', **({'bind': {'create_host_path': False}} if bind else {}),
            }],
            'healthcheck': {'test': ['CMD', 'python', '-c',
                "import ssl,urllib.request; urllib.request.urlopen('https://127.0.0.1:8080/health',"
                "context=ssl._create_unverified_context(),timeout=3)"],
                'interval': '1s', 'timeout': '4s', 'retries': 30},
        }
        config.write_text(json.dumps({'services': {'caffoot-lite': service},
                                      'volumes': {} if bind else {'data': {'external': True, 'name': mount}}}))
        command = ('compose', '--env-file', str(self.env_file), '-p', project, '-f', str(config))
        self.assertEqual(self.docker('ps', '-aq', '--filter', f'label=com.docker.compose.project={project}'), '')
        self.assertEqual(self.docker('network', 'ls', '--quiet', '--filter', f'name=^{project}_default$'), '')
        self.addCleanup(self.clean_compose, command, project)
        return command

    def clean_compose(self, command, project):
        self.docker(*command, 'down')
        self.assertEqual(self.docker('ps', '-aq', '--filter', f'label=com.docker.compose.project={project}'), '')
        self.assertEqual(self.docker('network', 'ls', '--quiet', '--filter', f'name=^{project}_default$'), '')

    def start(self, command, mount, image, *, bind=False, recreate=False):
        # Inspect the mapping before the application is allowed to open SQLite.
        self.docker(*command, 'create', *(['--force-recreate'] if recreate else []))
        container = self.docker(*command, 'ps', '-aq', 'caffoot-lite')
        info = json.loads(self.docker('inspect', container))[0]
        self.assertEqual(info['Image'], image)
        self.assertEqual(len(info['Mounts']), 1)
        actual, = info['Mounts']
        self.assertEqual(actual['Destination'], '/data')
        self.assertEqual(actual['Type'], 'bind' if bind else 'volume')
        self.assertEqual(actual['Source'] if bind else actual['Name'], str(mount))
        self.wait_ready(command)
        return container

    def wait_ready(self, command):
        self.docker(*command, 'up', '-d', '--no-build', '--no-recreate',
                    '--pull', 'never', '--wait', '--wait-timeout', '50')

    def stop(self, command, container):
        self.docker(*command, 'stop')
        running, exit_code = self.docker(
            'inspect', container, '--format', '{{.State.Running}} {{.State.ExitCode}}'
        ).split()
        self.assertEqual(running, 'false')
        print(f'STOPPED {command[4]} exit={exit_code}', flush=True)

    def helper(self, image, mount, action, archive_name=None, *, bind=False):
        root = action in ('save', 'restore')
        mode = '' if action.startswith('seed-') or action == 'restore' else ',readonly'
        data_type = 'bind' if bind else 'volume'
        mounts = ['--mount', f'type={data_type},source={mount},target=/data{mode}']
        if archive_name:
            mode = '' if action == 'save' else ',readonly'
            mounts += ['--mount', f'type=volume,source={self.backups},target=/backup{mode}']
        return self.docker(
            'run', '--rm', '--pull=never', '-i', '--network=none',
            '--user', '0:0' if root else '10001:10001',
            *mounts, '--entrypoint', 'python', image, '-', action,
            *([archive_name] if archive_name else []), source=self.fixture,
        )

    def snapshot(self, image, mount, **options):
        result = json.loads(self.helper(image, mount, 'snapshot', **options))
        for name in ('caffoot.sqlite3', 'tls/server.crt', 'tls/server.key',
                     'smtp-settings.json', 'account-email-secret.key', '.recovery-fixture/marker'):
            self.assertIn(name, result['files'])
        for name in ('tls/server.key', 'smtp-settings.json', 'account-email-secret.key'):
            self.assertEqual(result['files'][name]['mode'], 0o600, name)
            self.assertEqual((result['files'][name]['uid'], result['files'][name]['gid']), (10001, 10001))
        return result

    def compare(self, actual, expected, *, after_start=False):
        for field in ('version', 'schema'):
            self.assertEqual(actual[field], expected[field], field)
        for category in ('files', 'tables'):
            saved = expected[category]
            observed = actual[category]
            if after_start and category == 'files':
                # Probes sign in and out. SQLite can change its file bytes
                # while preserving all rows, so compare those separately.
                saved = {key: value for key, value in saved.items() if not key.startswith('caffoot.sqlite3')}
                observed = {key: value for key, value in observed.items() if not key.startswith('caffoot.sqlite3')}
                for key in ('mode', 'uid', 'gid'):
                    self.assertEqual(actual['files']['caffoot.sqlite3'][key], expected['files']['caffoot.sqlite3'][key])
            self.assertEqual(set(observed), set(saved), f'{category} paths')
            for key, value in saved.items():
                self.assertEqual(observed[key], value, f'{category}/{key}')

    def request(self, path, *, status=200, payload=None, session=None, binary=False):
        headers = {'Origin': self.origin}
        if payload is not None:
            headers['Content-Type'] = 'application/json'
        if session:
            headers.update({'Cookie': session[0], 'X-CSRF-Token': session[1]})
        with closing(http.client.HTTPSConnection(
            '127.0.0.1', self.port, context=self.trust, timeout=10,
        )) as client:
            client.connect()
            peer = hashlib.sha256(client.sock.getpeercert(binary_form=True)).hexdigest()
            self.assertEqual(peer, self.certificate)
            client.request('GET' if payload is None else 'POST', path,
                           body=None if payload is None else json.dumps(payload), headers=headers)
            response = client.getresponse()
            content = response.read()
            self.assertEqual(response.status, status, path)
            result = content if binary else json.loads(content)
            return result, response.getheader('Set-Cookie')

    def login(self, name, *, mfa=True):
        payload = {'username': name, 'password': PASSWORD}
        if mfa:
            payload['mfa_code'] = code_at(SECRET, time.time())
        result, raw = self.request('/api/login', payload=payload)
        self.assertEqual(result['status'], 'signed in')
        cookie = SimpleCookie(raw)['caffoot_session']
        self.assertTrue(cookie['secure'])
        cookie_header = f'{cookie.key}={cookie.value}'
        result, _ = self.request('/api/session', session=(cookie_header, ''))
        self.assertEqual(result['username'], name)
        session = (cookie_header, result['csrf_token'])
        self.addCleanup(self.logout_if_needed, session)
        return session

    def logout_if_needed(self, session):
        # Sessions are deliberately ended within each functional check.
        if session in self.active_sessions:
            self.active_sessions.remove(session)
            self.request('/api/logout', payload={}, session=session)

    def trust_published(self, container):
        pem = self.docker('exec', container, 'cat', '/data/tls/server.crt')
        self.trust = ssl.create_default_context(cadata=pem)
        self.certificate = hashlib.sha256(ssl.PEM_cert_to_DER_cert(pem)).hexdigest()
        print(f'TLS SHA-256 {self.certificate}', flush=True)

    def functional(self, *, review=None):
        self.request('/health')
        self.request('/api/session', status=401)
        self.request('/api/login', status=401,
                     payload={'username': 'restore-owner', 'password': PASSWORD})
        self.request('/api/login', status=401, payload={
            'username': 'disabled', 'password': PASSWORD, 'mfa_code': code_at(SECRET, time.time()),
        })
        self.active_sessions = []
        try:
            for name in ('restore-owner', 'reader-enrolled'):
                self.active_sessions.append(self.login(name))
            owner, reader = self.active_sessions
            def get(path, **options):
                return self.request(path, session=owner, **options)[0]

            self.assertEqual(get('/api/setup/status')['setupRequired'], False)
            self.assertEqual(get('/api/settings/email')['host'], '127.0.0.1')
            self.assertTrue(get('/api/settings/email')['passwordConfigured'])
            devices = self.request('/api/inventory/devices', session=reader)[0]['devices']
            self.assertIn('restore-device', {device['id'] for device in devices})
            self.assertIn('192.0.2.10', get('/api/inventory/ipam')['ipAllocations'])
            self.assertEqual(self.request('/api/account/photo', session=reader, binary=True)[0], PNG)
            self.request('/api/settings/email', session=reader, status=403)
            if review is None:
                self.assertIn('restore-rack', {rack['id'] for rack in get('/api/inventory/racks')['racks']})
                return
            saved = get('/api/settings/features')['features']
            self.assertTrue(all(saved[name] is False for name in DISABLED))
            get('/api/inventory/racks', status=403)
            self.assertNotIn('equipmentLifecycle', get('/api/inventory/state'))
            self.assertEqual(get(f"/api/staff-members/{review['staff']}")['staffMember']['departmentId'], 'recovery')
            self.assertEqual(get('/api/departments/recovery')['department']['name'], 'Fictional Reception')
            self.assertTrue(get('/api/equipment/assignments?deviceId=restore-device')['history'])
            self.assertEqual(get('/api/it-assets/stock/' + review['stock'])['item']['balances']['physicallyHeld'], 3)
            self.assertEqual(get(f"/api/suppliers/{review['supplier']}")['name'], 'Fictional Purchasing Supplier')
            self.assertTrue(get('/api/suppliers/issues')['issues'])
            ticket = str(review['ticket'])
            it = f'/api/service-desk/it/tickets/{ticket}'
            personal = f'/api/service-desk/personal/tickets/{ticket}'
            self.assertEqual(get(it)['status'], 'Closed')
            self.assertEqual(len(get(it + '/history')['closureAttempts']), 2)
            self.assertIn('Private technician note', {row['body'] for row in get(it + '/messages')['messages']})
            report = get('/api/service-desk/it/report')
            self.assertEqual(report['timezone'], ZONE)
            self.assertEqual(report['counts'], {'created': 1, 'closed': 2, 'reopened': 1})
            templates = get('/api/settings/email-templates')
            self.assertIn('Support request {{ticket_number}}',
                          {entry['published']['subject'] for entry in templates['templates']})
            self.assertEqual(templates['branding']['name'], 'Fictional Support')
            self.active_sessions.append(self.login('staff', mfa=False))
            self.active_sessions.append(self.login('staff-voluntary'))
            employee, unrelated = self.active_sessions[2:]
            messages = self.request(personal + '/messages', session=employee)[0]
            self.assertNotIn('Private technician note', {entry['body'] for entry in messages['messages']})
            self.request(it, session=employee, status=403)
            self.request(personal, session=unrelated, status=404)
            self.request('/api/inventory/devices', session=employee, status=403)
            expected = {'diagnostic.txt': ATTACHMENT, 'diagnostic.png': PNG}
            self.assertEqual({entry['filename'] for entry in messages['attachments']}, set(expected))
            for entry in messages['attachments']:
                path = personal + f"/attachments/{entry['id']}"
                self.assertEqual(self.request(path, session=employee, binary=True)[0], expected[entry['filename']])
                self.request(path, session=unrelated, status=404)
        finally:
            for session in self.active_sessions[:]:
                self.logout_if_needed(session)

    def test_complete_named_volume_recovery_and_matching_rollback(self):
        source10 = self.volume('source10')
        source28 = self.volume('source28')
        target28 = self.volume('target28')
        target10 = self.volume('rollback')
        self.backups = self.volume('archives')

        source = self.compose('source10', self.published, source10)
        container = self.start(source, source10, self.published)
        self.trust_published(container)
        self.stop(source, container)
        self.helper(self.published, source10, 'seed-published')
        saved10 = self.snapshot(self.published, source10)
        self.assertEqual(saved10['version'], 10)
        self.assertEqual(saved10['tables']['account_sessions'][0], 5)
        self.record_archive(self.published, source10, saved10)

        # Migrate a separate exact copy so rollback never opens schema 28 with v2.1.
        self.helper(self.published, source28, 'restore', 'schema10')
        self.compare(self.snapshot(self.published, source28), saved10)
        source = self.compose('source28', self.review, source28)
        container = self.start(source, source28, self.review)
        self.stop(source, container)
        review = json.loads(self.helper(self.review, source28, 'seed-review'))
        saved28 = self.snapshot(self.review, source28)
        self.assertEqual(saved28['version'], 28)
        self.assertEqual(saved28['tables']['service_desk_attachments'][0], 2)
        self.record_archive(self.review, source28, saved28)

        target = self.compose('target28', self.review, target28)
        self.helper(self.review, target28, 'restore', 'schema28')
        self.compare(self.snapshot(self.review, target28), saved28)
        container = self.start(target, target28, self.review)
        self.functional(review=review)
        self.docker(*target, 'restart')
        self.wait_ready(target)
        self.functional(review=review)
        self.stop(target, container)
        self.compare(self.snapshot(self.review, target28), saved28, after_start=True)
        replacement = self.start(target, target28, self.review, recreate=True)
        self.assertNotEqual(container, replacement)
        self.functional(review=review)
        self.stop(target, replacement)
        self.compare(self.snapshot(self.review, target28), saved28, after_start=True)
        print('SCHEMA 28 PASS: exact pre-start restore, trusted HTTPS and access after start, restart and recreation',
              flush=True)

        rollback = self.compose('rollback', self.published, target10)
        self.helper(self.published, target10, 'restore', 'schema10')
        self.compare(self.snapshot(self.published, target10), saved10)
        container = self.start(rollback, target10, self.published)
        self.functional()
        self.stop(rollback, container)
        replacement = self.start(rollback, target10, self.published, recreate=True)
        self.assertNotEqual(container, replacement)
        self.functional()
        self.stop(rollback, replacement)
        self.compare(self.snapshot(self.published, target10), saved10, after_start=True)
        self.compare(self.snapshot(self.published, source10), saved10)
        print('SCHEMA 10 PASS: original unchanged, exact rollback, matching-image access and recreation', flush=True)

        self.compare(self.snapshot(self.review, source28), saved28)
        self.focus_bind(saved28)
        print('REHEARSAL PASS: all recovery scenarios completed', flush=True)

    def record_archive(self, image, mount, snapshot):
        version = snapshot['version']
        checksum = self.helper(image, mount, 'save', f'schema{version}')
        self.assertRegex(checksum, r'^[a-f0-9]{64}$')
        print(f"ARCHIVE schema={version} sha256={checksum} "
              f"tables={len(snapshot['tables'])} paths={len(snapshot['files'])} "
              f"python={snapshot['python']} sqlite={snapshot['sqlite']} "
              f"sidecars={[name for name in snapshot['files'] if name.startswith('caffoot.sqlite3-')]}",
              flush=True)

    def focus_bind(self, saved):
        parent = Path(tempfile.mkdtemp(prefix=self.name + '-bind-', dir='/tmp'))
        self.addCleanup(parent.rmdir)
        parent.chmod(0o755)
        directory = parent / 'data'
        directory.mkdir(mode=0o755)
        self.addCleanup(directory.rmdir)
        self.addCleanup(self.clear_bind, directory)
        self.helper(self.review, directory, 'restore', 'schema28', bind=True)
        self.compare(self.snapshot(self.review, directory, bind=True), saved)
        command = self.compose('bind', self.review, directory, bind=True)
        container = self.start(command, directory, self.review, bind=True)
        self.request('/health')
        self.active_sessions = []
        owner = self.login('restore-owner')
        self.active_sessions.append(owner)
        try:
            result, _ = self.request('/api/inventory/devices', session=owner)
            self.assertIn('restore-device', {device['id'] for device in result['devices']})
            for feature in DISABLED:
                self.request('/api/settings/features', session=owner, payload={'feature': feature, 'enabled': True})
            racks, _ = self.request('/api/inventory/racks', session=owner)
            self.assertIn('restore-rack', {rack['id'] for rack in racks['racks']})
            inventory, _ = self.request('/api/inventory/state', session=owner)
            self.assertIn('2024-03-12', json.dumps(inventory['equipmentLifecycle']))
        finally:
            self.logout_if_needed(owner)
        self.stop(command, container)
        after = self.snapshot(self.review, directory, bind=True)
        expected_tables = dict(saved['tables'])
        expected_tables.update({name: after['tables'][name]
                                for name in ('inventory_change_history', 'sqlite_sequence', 'organisation_features')})
        self.compare(after, dict(saved, tables=expected_tables), after_start=True)
        info = directory.stat()
        print(f'BIND PASS: runtime UID/GID 10001:10001, runner-visible UID/GID {info.st_uid}:{info.st_gid}, '
              'exact stopped restore and durable data after re-enabling features', flush=True)

    def clear_bind(self, directory):
        self.docker('run', '--rm', '--pull=never', '--network=none', '--user', '0:0',
                    '--mount', f'type=bind,source={directory},target=/data',
                    '--entrypoint', 'python', self.review, '-c',
                    "import shutil; from pathlib import Path\n"
                    "for path in Path('/data').iterdir():\n"
                    "    shutil.rmtree(path) if path.is_dir() else path.unlink()")
