"""Report the ticket events that fall inside the selected local dates."""
from datetime import date, datetime, timedelta
from io import BytesIO
from zoneinfo import ZoneInfo

from backend.permissions import can_access
from backend.service_desk import eligible_ticket_technician, ticket_rows
from backend.service_desk_access import ticket_scope_filter
from backend.service_desk_calendar import UTC, read_support_calendar
from backend.service_desk_settings import parse_support_date

REPORTING_PERIODS = ('today', 'last-7-days', 'last-30-days', 'this-month', 'this-year', 'custom')
SUPPORT_UPDATE = "event.kind='Message Added' AND message.kind='IT Update'"


def read_report_period(connection, actor):
    row = connection.execute("""
        SELECT period,start_date,end_date FROM service_desk_report_preferences WHERE account_id=?
    """, (actor,)).fetchone()
    period, start, end = row or ('this-month', None, None)
    return {'period': period, 'from': start, 'to': end}


def save_report_period(connection, actor, payload):
    ticket_scope_filter(connection, actor, 'it')
    if not isinstance(payload, dict) or payload.get('period') not in REPORTING_PERIODS:
        raise ValueError('Choose a reporting period.')
    period = payload['period']
    if period == 'custom':
        if payload.keys() != {'period', 'from', 'to'}:
            raise ValueError('Choose a start and end date.')
        start, end = parse_support_date(payload['from']), parse_support_date(payload['to'])
        if start > end:
            raise ValueError('The end date must be on or after the start date.')
        start, end = start.isoformat(), end.isoformat()
    else:
        if payload.keys() != {'period'}:
            raise ValueError('Choose a reporting period.')
        previous = read_report_period(connection, actor)
        start, end = previous['from'], previous['to']
    connection.execute("""
        INSERT INTO service_desk_report_preferences(account_id,period,start_date,end_date) VALUES(?,?,?,?)
        ON CONFLICT(account_id) DO UPDATE SET
        period=excluded.period,start_date=excluded.start_date,end_date=excluded.end_date
    """, (actor, period, start, end))


def reporting_dates(today, preference):
    period = preference['period']
    if period == 'custom':
        return date.fromisoformat(preference['from']), date.fromisoformat(preference['to'])
    if period in ('today', 'last-7-days', 'last-30-days'):
        days = {'today': 0, 'last-7-days': 6, 'last-30-days': 29}[period]
        return today - timedelta(days=days), today
    if period == 'this-month':
        return today.replace(day=1), today
    return today.replace(month=1, day=1), today


def report_event_rows(connection, allowed, values, start, end):
    # Convert candidate events individually so local midnight gaps and folds
    # use the date of the actual instant. The UTC search extends by a day
    # at each edge because a timezone offset is smaller than one day.
    lower = max(date.min.toordinal(), start.toordinal() - 1)
    upper = min(date.max.toordinal(), end.toordinal() + 1)
    return ticket_rows(connection.execute(f"""
        WITH candidate AS (
            SELECT event.id,event.ticket_id,event.kind,event.actor_id,event.actor_label,event.happened_at,
                   closure.resolution_working_seconds,
                   (SELECT max(boundary.id) FROM service_desk_events boundary
                     WHERE boundary.ticket_id=event.ticket_id AND boundary.id<event.id
                       AND boundary.kind IN ('Created','Reopened','Closed')) AS attempt_start
            FROM service_desk_events event
            JOIN service_desk_tickets ticket ON ticket.id=event.ticket_id
            LEFT JOIN service_desk_messages message ON event.kind='Message Added'
              AND message.ticket_id=event.ticket_id AND message.id=json_extract(event.details,'$.messageId')
            LEFT JOIN service_desk_closures closure ON closure.closed_event_id=event.id
            WHERE {allowed} AND event.happened_at BETWEEN ? AND ?
              AND (event.kind IN ('Created','Reopened') OR closure.id IS NOT NULL OR ({SUPPORT_UPDATE}))
        )
        SELECT candidate.*, boundary.kind IN ('Created','Reopened') AND NOT EXISTS (
            SELECT 1 FROM service_desk_events earlier
            JOIN service_desk_messages message ON message.ticket_id=earlier.ticket_id
              AND message.id=json_extract(earlier.details,'$.messageId') AND message.kind='IT Update'
            WHERE earlier.ticket_id=candidate.ticket_id AND earlier.id>boundary.id AND earlier.id<candidate.id
              AND earlier.kind='Message Added'
        ) AS first_action
        FROM candidate LEFT JOIN service_desk_events boundary ON boundary.id=candidate.attempt_start
        ORDER BY candidate.happened_at,candidate.id
    """, (*values, date.fromordinal(lower).isoformat(), date.fromordinal(upper).isoformat() + 'T23:59:59.999999Z')))


def read_service_desk_report(connection, actor, *, now=None):
    allowed, values = ticket_scope_filter(connection, actor, 'it')
    preference = read_report_period(connection, actor)
    _, _, _, _, name, rules = read_support_calendar(connection)
    if rules is None:
        admin = connection.execute('SELECT is_admin FROM accounts WHERE id=?', (actor,)).fetchone()
        return {'preference': preference, 'available': False, 'timezoneWarning': admin == (1,)}
    zone = ZoneInfo.from_file(BytesIO(rules), key=name)
    today = (now or datetime.now(UTC)).astimezone(zone).date()
    start, end = reporting_dates(today, preference)
    sections = [section for section in ('Devices', 'IT Assets') if can_access(connection, actor, section)]
    technicians = {
        identity: {'name': label, 'started': 0, 'closed': 0}
        for identity, label in connection.execute('SELECT id,username FROM accounts WHERE active=1')
        if any(eligible_ticket_technician(connection, identity, section) for section in sections)
    }
    counts = {'created': 0, 'closed': 0, 'reopened': 0}
    durations = []
    for event in report_event_rows(connection, allowed, values, start, end):
        local_date = datetime.fromisoformat(event['happened_at']).astimezone(zone).date()
        if not start <= local_date <= end:
            continue
        kind = event['kind']
        if kind in ('Created', 'Closed', 'Reopened'):
            counts[kind.lower()] += 1
        if kind == 'Closed' or (kind == 'Message Added' and event['first_action']):
            technician = technicians.setdefault(event['actor_id'],
                {'name': event['actor_label'], 'started': 0, 'closed': 0})
            if event['first_action']:
                technician['started'] += 1
            if kind == 'Closed':
                technician['closed'] += 1
                durations.append(event['resolution_working_seconds'])
    complete = None not in durations
    return {'preference': preference, 'available': True, 'today': today.isoformat(), 'counts': counts,
            'timezone': name, 'durationUnavailable': not complete,
            'averageSeconds': sum(durations) / len(durations) if durations and complete else None,
            'technicians': sorted(technicians.values(), key=lambda person: person['name'].casefold())}
