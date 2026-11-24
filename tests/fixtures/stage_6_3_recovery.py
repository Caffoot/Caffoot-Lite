"""Run inside the matching local image, on a uniquely created stopped mount."""
import base64
import os
import shutil
import stat
import sys
import tarfile
import tempfile
from datetime import date
from pathlib import Path, PurePosixPath
from uuid import uuid4

# Concatenated after the existing fictional upgrade fixture by the driver.
DATA = Path('/data')
PNG = base64.b64decode(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGMQdYgCAAEdALBYRfE0AAAAAElFTkSuQmCC'
)
ATTACHMENT = b'Fictional Stage 6.3 diagnostic\r\n'
DISABLED = ('racks', 'equipment_lifecycle')


def seed_published():
    from backend.inventory import reconstruct_inventory, stage_inventory
    from backend.profiles import save_profile_photo
    from backend.smtp_settings import save_settings

    seed_installation()
    with closing(connect()) as db:
        inventory = reconstruct_inventory(db)
        inventory['subnets'][0].update(gateway='192.0.2.1', vlan=10)
        inventory['racks'][0]['heightU'] = 42
        inventory['devices'].append({
            'id': 'recovery-server', 'name': 'Fictional Rack Server', 'type': 'Server - Physical',
            'status': 'Active', 'mountType': 'Rack Mounted', 'rackId': 'restore-rack',
            'rackUStart': 1, 'rackUHeight': 2, 'rackUEnd': 2, 'location': 'Unknown', 'primaryIp': '',
        })
        stage_inventory(db, inventory)
        with db:
            # Known fictional authenticator used by HTTPS checks. The fixture's
            # pre-existing sessions and the persisted MFA state survive backup.
            db.execute("UPDATE accounts SET mfa_secret=? WHERE id=1", (SECRET,))
            marker = {"action": "Updated", "actorId": 1, "changes": [],
                      "actorLabel": "restore-owner", "timestamp": "2026-11-20T12:00:00Z"}
            db.execute("INSERT INTO inventory_change_history(record_json) VALUES(?)",
                       (json.dumps(marker),))
        save_profile_photo(db, 4, 'image/png', PNG)
    smtp = DATA / 'smtp-settings.json'
    settings = json.loads(smtp.read_text())
    settings.update(host='127.0.0.1', port=1)
    save_settings(smtp, settings)
    extra = DATA / '.recovery-fixture'
    extra.mkdir(mode=0o750)
    (extra / 'marker').write_text('Fictional installation metadata\n')
    (extra / 'marker').chmod(0o640)


def seed_review():
    from backend.device_assignments import assign_devices
    from backend.device_saves import save_reserved_device
    from backend.email_templates import mutate_email_templates
    from backend.feature_settings import FEATURES, save_feature_setting
    from backend.mfa import code_at
    from backend.service_desk import save_ticket_request
    from backend.service_desk_attachments import validate_ticket_attachments
    from backend.service_desk_reporting import save_report_period
    from backend.sessions import login_session
    from backend.stock_circulation import issue_stock
    from backend.stock_intake import receive_stock, stock_item
    from backend.suppliers import save_supplier_operation

    with closing(connect()) as db:
        assert db.execute('SELECT max(version) FROM schema_migrations').fetchone() == (28,)
        token = login_session(db, 'restore-owner', PASSWORD, mfa_code=code_at(SECRET, time.time()))
        assert token
        for name in FEATURES:
            save_feature_setting(db, 1, token, {'feature': name, 'enabled': True})

        with db:
            db.executemany('INSERT INTO departments(id,name) VALUES(?,?)',
                           [('recovery', 'Fictional Reception'), ('other', 'Fictional Finance')])
            db.execute("UPDATE staff_members SET department_id='recovery' WHERE account_id=7")
            db.execute("UPDATE staff_members SET department_id='other' WHERE account_id=8")
            db.execute("""DELETE FROM account_roles WHERE account_id IN (7,8)
                          AND role_id=(SELECT id FROM roles WHERE role_key='it_staff')""")
            # Migrated Staff keep their legacy Devices No Access override.
            db.execute("""INSERT INTO account_permission_overrides VALUES
                          (7,'Service Desk','deny'),(8,'Service Desk','deny')""")
            staff = db.execute('SELECT id FROM staff_members WHERE account_id=7').fetchone()[0]
            record, revision = db.execute(
                "SELECT record_json,revision FROM inventory_devices WHERE id='restore-device'"
            ).fetchone()
        company = save_supplier_operation(db, 1, token, {
            'operation': 'supplier.save',
            'data': {'name': 'Fictional Purchasing Supplier', 'categoryIds': [],
                     'address': dict(address='', city='', postcode='', country=''),
                     'website': '', 'description': ''},
        })
        save_supplier_operation(db, 1, token, {
            'operation': 'issue.save', 'supplierId': company['id'], 'revision': company['revision'],
            'data': {'title': 'Example delivery issue', 'description': 'Fictional packing damage'},
        })
        with db:
            db.execute("INSERT INTO device_edit_reservations VALUES('restore-device',1,?,?)",
                       (int(time.time()) + 120, revision))
        save_reserved_device(
            db, 1, 'restore-device', revision, json.loads(record),
            lifecycle={'purchaseDate': '2024-03-12'}, supplier={'id': company['id']},
        )
        revision, = db.execute(
            "SELECT revision FROM inventory_devices WHERE id='restore-device'"
        ).fetchone()
        assign_devices(db, 1, token, {
            'recipientKind': 'staff', 'recipientId': staff,
            'devices': [{'id': 'restore-device', 'revision': revision}],
        })
        item = receive_stock(db, 1, token, {
            'operationId': uuid4().hex, 'receivedOn': date.today().isoformat(),
            'quantity': 4, 'readyQuantity': 4,
            'item': {'category': 'Monitor', 'trackingMode': 'quantity', 'manufacturer': 'Fictional',
                     'model': 'Display', 'sharedSpecifications': {}},
            'checks': {'itemsChecked': True, 'conditionChecked': True},
            'supplier': company['name'], 'supplierId': company['id'], 'notes': 'Test delivery',
        })['stockItemId']
        issue_stock(db, 1, token, {
            'operationId': uuid4().hex, 'stockItemId': item, 'version': stock_item(db, item)['version'],
            'quantity': 1, 'recipientKind': 'department', 'recipientId': 'recovery',
            'issuedOn': date.today().isoformat(), 'note': 'Test issue',
        })
        with db:
            db.execute('BEGIN IMMEDIATE')
            # Exercise the actual ticket writer without dispatching notifications.
            attachments = validate_ticket_attachments([{
                'filename': 'diagnostic.txt', 'contents': base64.b64encode(ATTACHMENT).decode(),
            }, {'filename': 'diagnostic.png', 'contents': base64.b64encode(PNG).decode()}])
            ticket = save_ticket_request(db, 7, 'personal', {
                'equipmentKind': 'device', 'equipmentId': 'restore-device', 'categoryId': 5,
                'subject': 'Fictional display fault', 'description': 'Example support request.',
            }, attachments=attachments)['id']
            for action, payload in (
                ('assign', {'technicianId': 1}),
                ('messages', {'body': 'Private technician note'}),
                ('messages', {'body': 'Fictional progress update', 'employeeVisible': True}),
                ('close', {'resolutionNote': 'Fictional resolution'}),
                ('reopen', {}),
                ('close', {'resolutionNote': 'Fictional final resolution'}),
            ):
                save_ticket_request(db, 1, 'it', payload, ticket_id=ticket, action=action)
            save_report_period(db, 1, {'period': 'last-7-days'})

        mutate_email_templates(db, 1, token, {
            'action': 'draft', 'id': 'ticket-created', 'revision': 0,
            'subject': 'Support request {{ticket_number}}', 'body': '<p>Fictional template.</p>',
        })
        mutate_email_templates(db, 1, token, {'action': 'publish', 'id': 'ticket-created', 'revision': 1})
        mutate_email_templates(db, 1, token, {
            'action': 'branding', 'revision': 0, 'name': 'Fictional Support', 'primary': '#112233',
            'accent': '#224466', 'footer': 'Fictional footer',
            'logo': {'mime': 'image/png', 'data': base64.b64encode(PNG).decode()},
        })

        for name in DISABLED:
            save_feature_setting(db, 1, token, {'feature': name, 'enabled': False, 'confirmDisable': True})

        # Check association and BLOB coverage before the archive is taken.
        assert db.execute("SELECT purchase_date FROM device_lifecycle WHERE device_id='restore-device'").fetchone() == ('2024-03-12',)
        assert db.execute('SELECT count(*) FROM service_desk_closures').fetchone() == (2,)
        assert dict(db.execute('SELECT filename,contents FROM service_desk_attachments')) == {
            'diagnostic.txt': ATTACHMENT, 'diagnostic.png': PNG,
        }
        print(json.dumps({'ticket': ticket, 'stock': item, 'supplier': company['id'], 'staff': staff}))


def snapshot():
    files = file_manifest()
    root = DATA.stat()
    files['.'] = dict(sha256=None, mode=stat.S_IMODE(root.st_mode), uid=root.st_uid, gid=root.st_gid)
    # SQLite may create or checkpoint sidecars when opened. Read a private
    # temporary copy so neither the stopped source nor a restored mount changes.
    with tempfile.TemporaryDirectory() as temporary:
        path = Path(temporary) / 'caffoot.sqlite3'
        for item in DATA.glob('caffoot.sqlite3*'):
            shutil.copyfile(item, path.with_name(item.name))
        with closing(sqlite3.connect(path)) as db:
            assert db.execute('PRAGMA integrity_check').fetchall() == [('ok',)]
            assert db.execute('PRAGMA foreign_key_check').fetchall() == []
            schema = db.execute("SELECT type,name,tbl_name,sql FROM sqlite_schema ORDER BY type,name").fetchall()
            tables = {}
            for kind, name, _, _ in schema:
                if kind == 'table':
                    # Stable order and length-delimited type-aware values, including BLOBs.
                    quoted = name.replace('"', '""')
                    rows = db.execute(f'SELECT * FROM "{quoted}" ORDER BY rowid')
                    values = [[['blob', value.hex()] if isinstance(value, bytes)
                               else [type(value).__name__, value] for value in row] for row in rows]
                    tables[name] = [len(values), digest(values)]
            version, = db.execute('SELECT max(version) FROM schema_migrations').fetchone()
    return dict(files=files, tables=tables, schema=digest(schema), version=version,
                python=sys.version.split()[0], sqlite=sqlite3.sqlite_version)


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=True, separators=(',', ':')).encode()).hexdigest()


def archive(action, name):
    saved = Path('/backup') / (name + '.tar')
    if action == 'save':
        old_umask = os.umask(0o077)
        try:
            with tarfile.open(saved, 'x') as backup:
                backup.add(DATA, arcname='.')
        finally:
            os.umask(old_umask)
        with tarfile.open(saved) as backup:
            assert set(backup.getnames()) == {'.', *('./' + path for path in file_manifest())}
        with saved.open('rb') as source:
            print(hashlib.file_digest(source, 'sha256').hexdigest())
    else:
        assert not list(DATA.iterdir()), 'Expected an empty recovery mount'
        with tarfile.open(saved) as backup:
            members = backup.getmembers()
            names = [PurePosixPath(member.name) for member in members]
            assert PurePosixPath('.') in names and len(names) == len(set(names))
            assert all(not name.is_absolute() and '..' not in name.parts for name in names)
            assert all(member.isfile() or member.isdir() for member in members)
            # The archive was written by this helper in the private test
            # volume. Preserve numeric ownership and modes on extraction.
            backup.extractall(DATA, members=members, filter='fully_trusted')


if __name__ == '__main__':
    action = sys.argv[1]
    if action == 'seed-published':
        seed_published()
    elif action == 'seed-review':
        seed_review()
    elif action == 'snapshot':
        print(json.dumps(snapshot()))
    else:
        archive(action, sys.argv[2])
