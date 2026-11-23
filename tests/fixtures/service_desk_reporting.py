"""Prepare fictional Service Desk activity for the HTTPS browser check."""
from datetime import datetime, timedelta, timezone
import json
import sqlite3
import sys
from unittest.mock import patch
from zoneinfo import ZoneInfo

from backend.schema import initialise_database
from backend.service_desk import save_ticket_request
from backend.service_desk_calendar import activate_deployment_timezone, utc_timestamp
from backend.sessions import _digest


def seed_service_desk(database, zone):
    today = datetime.now(ZoneInfo('Europe/London')).replace(hour=8, minute=0, second=0, microsecond=0)
    with sqlite3.connect(database) as connection:
        connection.execute('PRAGMA foreign_keys=ON')
        initialise_database(connection)
        for identity, name in enumerate(('Alex Morgan', 'Sam Taylor', 'Dave Jones'), 1):
            connection.execute("""
                INSERT INTO accounts(id,username,password_hash,is_admin,mfa_confirmed,mfa_secret)
                VALUES(?,?,?, ?,1,'JBSWY3DPEHPK3PXP')
            """, (identity, name, 'Browser fixture', int(identity == 1)))
            token = str(identity) * 64
            connection.execute('INSERT INTO account_sessions VALUES(?,?,9999999999,1)', (_digest(token), identity))
            if identity != 1:
                for section in ('Service Desk', 'Devices'):
                    connection.execute('INSERT INTO account_permission_overrides VALUES(?,?,?)',
                                       (identity, section, 'edit'))
        connection.execute("UPDATE organisation_features SET enabled=1 WHERE feature='devices'")
        devices = ('Reception Laptop', 'Office Printer', 'Stores Laptop')
        for index, name in enumerate(devices):
            key = f'equipment-{index}'
            record = {'id': key, 'name': name, 'type': 'Laptop', 'primaryIp': ''}
            connection.execute('INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES(?,?,?,?)',
                               (key, name, json.dumps(record), index))
        connection.commit()
        activate_deployment_timezone(connection, zone, at=utc_timestamp((today - timedelta(days=7)).astimezone(timezone.utc)))
        connection.execute('BEGIN IMMEDIATE')

        def save(hour, minute, actor, payload, ticket_id=None, action=None):
            at = today.replace(hour=hour, minute=minute)
            with patch('backend.service_desk.utc_timestamp', return_value=utc_timestamp(at.astimezone(timezone.utc))):
                return save_ticket_request(connection, actor, 'it', payload, ticket_id=ticket_id, action=action)['id']

        def create(hour, minute, subject, equipment):
            return save(hour, minute, 1, {'equipmentKind': 'device', 'equipmentId': f'equipment-{equipment}',
                        'categoryId': 4, 'subject': subject, 'description': 'Example support request.'})

        ticket = create(8, 0, 'Shared portal sign-in fails', 0)
        save(9, 0, 1, {'technicianId': 2}, ticket, 'assign')
        save(9, 30, 2, {'body': 'Reproduced the error and checked the configuration.'}, ticket, 'messages')
        save(10, 0, 3, {'resolutionNote': 'Updated the account and confirmed access.'}, ticket, 'close')
        save(10, 15, 1, {}, ticket, 'reopen')
        save(11, 15, 2, {'resolutionNote': 'Confirmed the second account can sign in.'}, ticket, 'close')
        create(8, 30, 'Laptop Wi-Fi keeps disconnecting', 0)
        printer = create(8, 45, 'Office printer leaves streaks', 1)
        save(9, 15, 1, {'technicianId': 3}, printer, 'assign')
        other = create(9, 0, 'Stores laptop display flickers', 2)
        save(9, 30, 1, {'reason': 'Waiting for Parts'}, other, 'hold')
    print(today.date().isoformat())


if __name__ == '__main__':
    seed_service_desk(sys.argv[1], sys.argv[2])
