"""Verify actual elapsed time, including both sides of a clock change."""
from datetime import datetime
from zoneinfo import ZoneInfo
import json
import sqlite3
import unittest

from backend.schema import initialise_database
from backend.service_desk import change_ticket_lifecycle, record_ticket_event
from backend.service_desk_calendar import (DEFAULT_WORKING_HOURS, activate_deployment_timezone,
                                           append_support_calendar, eligible_working_time,
                                           read_support_calendar, utc_timestamp)
from test_service_desk_schema import insert_ticket, open_database


def instant(value):
    return datetime.fromisoformat(value + 'Z')


class ServiceDeskCalendarTests(unittest.TestCase):
    def setUp(self):
        self.connection = open_database()
        self.addCleanup(self.connection.close)
        initialise_database(self.connection)
        self.connection.execute("INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES('host','Host','{}',0)")
        self.connection.commit()
        self.actor = (1, 'Sam')

    def ticket(self, start):
        ticket = insert_ticket(self.connection)
        record_ticket_event(self.connection, ticket, 'Created', self.actor, utc_timestamp(instant(start)), status='Open')
        return ticket

    def close(self, ticket, at):
        facts = (None, 'Open', None, None, 1, 'Folder Access', 'Medium', 'Devices')
        change_ticket_lifecycle(self.connection, ticket, 'close', {'resolutionNote': 'Fixed.'},
                                facts, self.actor, utc_timestamp(instant(at)))
        return self.connection.execute("""
            SELECT resolution_working_seconds FROM service_desk_closures
            WHERE ticket_id=? ORDER BY id DESC LIMIT 1
        """, (ticket,)).fetchone()[0]

    def activate(self, name, at):
        self.connection.commit()
        activate_deployment_timezone(self.connection, name, at=utc_timestamp(instant(at)))

    def save_calendar(self, at, hours, exclusions):
        _, _, _, _, name, rules = read_support_calendar(self.connection)
        append_support_calendar(self.connection, utc_timestamp(instant(at)), hours, exclusions, name, rules, 1)

    def test_london_clock_changes_count_both_repeated_partial_windows(self):
        zone = ZoneInfo('Europe/London')
        for opens, closes, march, october in (('01:00', '03:00', 3600, 10800),
                                               ('01:30', '02:30', 1800, 5400)):
            schedule = [*DEFAULT_WORKING_HOURS[:6], {'enabled': True, 'start': opens, 'end': closes}]
            for date, expected in (('2026-03-29', march), ('2026-10-25', october)):
                with self.subTest(opens=opens, date=date):
                    start = instant(date + 'T00:00:00')
                    end = instant(date + 'T04:00:00')
                    self.assertEqual(eligible_working_time(start, end, zone, schedule, {}).total_seconds(), expected)
        self.assertEqual(eligible_working_time(instant('2026-03-29T00:59:59.500'),
                                             instant('2026-03-29T01:00:00.500'),
                                             zone, schedule, {}).total_seconds(), 0.5)

    def test_calendar_edits_are_prospective_and_closed_results_are_immutable(self):
        self.activate('Europe/London', '2026-11-23T09:00:00')
        ticket = self.ticket('2026-11-23T10:00:00')
        schedule = [dict(day, start='08:00', end='18:00') for day in DEFAULT_WORKING_HOURS]
        self.save_calendar('2026-11-23T13:00:00', schedule, {})
        self.assertEqual(self.close(ticket, '2026-11-23T18:00:00'), 8 * 3600)
        self.save_calendar('2026-11-23T19:00:00', schedule, {'2026-11-23': 'Shutdown'})
        self.assertEqual(self.connection.execute('SELECT resolution_working_seconds FROM service_desk_closures'
                                                 ).fetchone()[0], 8 * 3600)
        with self.assertRaisesRegex(sqlite3.IntegrityError, 'cannot be changed'):
            self.connection.execute('UPDATE service_desk_closures SET resolution_working_seconds=0')

    def test_exclusions_hold_and_timezones_apply_only_to_their_own_intervals(self):
        self.activate('Europe/London', '2026-11-23T09:00:00')
        ticket = self.ticket('2026-11-23T10:00:00')
        record_ticket_event(self.connection, ticket, 'Status Changed', self.actor,
                            utc_timestamp(instant('2026-11-23T11:00:00')), status='On Hold')
        self.save_calendar('2026-11-23T12:00:00', DEFAULT_WORKING_HOURS, {'2026-11-23': 'Shutdown'})
        record_ticket_event(self.connection, ticket, 'Status Changed', self.actor,
                            utc_timestamp(instant('2026-11-23T13:00:00')), status='Open')
        self.save_calendar('2026-11-23T14:00:00', DEFAULT_WORKING_HOURS, {})
        self.activate('America/New_York', '2026-11-23T16:00:00')
        self.assertEqual(self.close(ticket, '2026-11-23T18:00:00'), 5 * 3600)
        rows = self.connection.execute('SELECT timezone_name,saved_by,excluded_dates FROM service_desk_calendars')
        self.assertEqual([(name, actor, json.loads(dates)) for name, actor, dates in rows], [
            ('Europe/London', None, {}), ('Europe/London', 1, {'2026-11-23': 'Shutdown'}),
            ('Europe/London', 1, {}), ('America/New_York', None, {}),
        ])

    def test_unknown_timezone_is_not_backfilled_after_recovery(self):
        self.activate(None, '2026-11-23T08:00:00')
        ticket = self.ticket('2026-11-23T09:00:00')
        self.activate('Not/A-Timezone', '2026-11-23T09:30:00')
        self.activate('Europe/London', '2026-11-23T10:00:00')
        self.assertIsNone(self.close(ticket, '2026-11-23T11:00:00'))
        measured = self.ticket('2026-11-23T11:00:00')
        self.assertEqual(self.close(measured, '2026-11-23T12:00:00'), 3600)
        self.activate('Invalid', '2026-11-23T13:00:00')
        missing = self.ticket('2026-11-23T14:00:00')
        self.assertIsNone(self.close(missing, '2026-11-23T15:00:00'))
        self.assertEqual(self.connection.execute('SELECT count(*) FROM service_desk_calendars').fetchone()[0], 3)
