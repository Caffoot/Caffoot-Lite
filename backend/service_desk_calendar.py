"""Keep the support calendar as it applied at each point in time."""
from datetime import datetime, time, timedelta, timezone
from io import BytesIO
import json
from pathlib import Path
from zoneinfo import TZPATH, ZoneInfo

UTC = timezone.utc
DAY = timedelta(days=1)
WEEKDAYS = ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
DEFAULT_WORKING_HOURS = [
    {'enabled': day < 5, 'start': '09:00', 'end': '17:00'} for day in range(7)
]


def utc_timestamp(instant=None):
    return (instant or datetime.now(UTC)).astimezone(UTC).isoformat(timespec='microseconds').replace('+00:00', 'Z')


def read_deployment_timezone(name):
    """Read the installed IANA rules so upgrades can retain earlier rules."""
    if not name or not all(part and part not in ('.', '..') and part.isascii()
                           and all(character.isalnum() or character in '_+-' for character in part)
                           for part in name.split('/')):
        return None, None
    if name.split('/')[0] in ('posix', 'right', 'localtime', 'posixrules'):
        return None, None
    for root in TZPATH:
        try:
            rules = (Path(root) / name).read_bytes()
            ZoneInfo.from_file(BytesIO(rules), key=name)
            return name, rules
        except (OSError, ValueError):
            continue
    return None, None


def read_support_calendar(connection):
    row = connection.execute("""
        SELECT id,effective_at,working_hours,excluded_dates,timezone_name,timezone_rules
        FROM service_desk_calendars ORDER BY id DESC LIMIT 1
    """).fetchone()
    if row is None:
        return None, None, DEFAULT_WORKING_HOURS, {}, None, None
    return row[0], row[1], json.loads(row[2]), json.loads(row[3]), row[4], row[5]


def append_support_calendar(connection, at, hours, exclusions, name, rules, actor_id=None):
    connection.execute("""
        INSERT INTO service_desk_calendars
          (effective_at,working_hours,excluded_dates,timezone_name,timezone_rules,saved_by)
        VALUES(?,?,?,?,?,?)
    """, (at, json.dumps(hours), json.dumps(exclusions), name, rules, actor_id))


def activate_deployment_timezone(connection, name, *, at=None):
    """Apply the deployment rules under the same lock as ticket and calendar writes."""
    name, rules = read_deployment_timezone(name)
    with connection:
        connection.execute('BEGIN IMMEDIATE')
        revision, _, hours, exclusions, old_name, old_rules = read_support_calendar(connection)
        if revision is None or (name, rules) != (old_name, old_rules):
            append_support_calendar(connection, at or utc_timestamp(), hours, exclusions, name, rules)


def split_timezone_offsets(start, end, zone):
    """Yield intervals with one UTC offset, cutting at the exact clock change."""
    offset = start.astimezone(zone).utcoffset()
    cursor = interval_start = start
    # IANA clock changes are separated by more than six hours. Check the
    # offset at each step, then locate a change to its exact second.
    while cursor < end:
        probe = min(cursor + timedelta(hours=6), end)
        next_offset = probe.astimezone(zone).utcoffset()
        if next_offset != offset:
            left, right = cursor.replace(microsecond=0), probe.replace(microsecond=0)
            while right - left > timedelta(seconds=1):
                middle = left + timedelta(seconds=(right - left) // timedelta(seconds=1) // 2)
                if middle.astimezone(zone).utcoffset() == offset:
                    left = middle
                else:
                    right = middle
            change = right
            yield interval_start, change, offset
            interval_start, offset = change, next_offset
        cursor = probe
    if interval_start < end:
        yield interval_start, end, offset


def eligible_working_time(start, end, zone, working_hours, excluded_dates):
    """Intersect actual elapsed time with enabled local hours and dates."""
    total = timedelta()
    windows = [(time.fromisoformat(day['start']), time.fromisoformat(day['end']))
               if day['enabled'] else None for day in working_hours]
    for segment_start, segment_end, offset in split_timezone_offsets(start, end, zone):
        local_start = segment_start.replace(tzinfo=None) + offset
        local_end = segment_end.replace(tzinfo=None) + offset
        date = local_start.date()
        while date <= local_end.date():
            hours = windows[date.weekday()]
            if hours and date.isoformat() not in excluded_dates:
                opens = datetime.combine(date, hours[0])
                closes = datetime.combine(date, hours[1])
                total += max(timedelta(), min(local_end, closes) - max(local_start, opens))
            date += DAY
    return total


def measure_resolution_attempt(connection, ticket_id, closed_event_id, at):
    """Measure this attempt before it closes, leaving unknown time unmeasured."""
    prior = connection.execute("""
        SELECT reopened_event_id FROM service_desk_closures
        WHERE ticket_id=? ORDER BY closed_event_id DESC LIMIT 1
    """, (ticket_id,)).fetchone()
    first_event = prior[0] if prior else 0
    event_rows = connection.execute("""
        SELECT kind,happened_at,json_extract(details,'$.status')
        FROM service_desk_events WHERE ticket_id=? AND id BETWEEN ? AND ?
          AND kind IN ('Created','Reopened','Status Changed','Closed')
        ORDER BY id
    """, (ticket_id, first_event, closed_event_id)).fetchall()
    if not event_rows or event_rows[0][0] != ('Reopened' if prior else 'Created'):
        return None
    start = datetime.fromisoformat(event_rows[0][1])
    end = datetime.fromisoformat(at)
    active = []
    active_start = start
    for kind, timestamp, status in event_rows[1:]:
        event_at = datetime.fromisoformat(timestamp)
        if kind == 'Status Changed' and status == 'On Hold':
            active.append((active_start, event_at))
            active_start = None
        elif active_start is None:
            active_start = event_at
    if active_start is not None:
        active.append((active_start, end))

    # Start with the calendar already in force, then replay later changes.
    calendars = connection.execute("""
        SELECT effective_at,working_hours,excluded_dates,timezone_name,timezone_rules
        FROM service_desk_calendars
        WHERE id >= (SELECT coalesce(max(id),0) FROM service_desk_calendars WHERE effective_at<=?)
          AND effective_at<=? ORDER BY id
    """, (event_rows[0][1], at)).fetchall()
    if not calendars or datetime.fromisoformat(calendars[0][0]) > start:
        return None
    total = timedelta()
    for index, (effective_at, hours, exclusions, name, rules) in enumerate(calendars):
        segment_start = max(start, datetime.fromisoformat(effective_at))
        segment_end = datetime.fromisoformat(calendars[index + 1][0]) if index + 1 < len(calendars) else end
        if rules is None and (segment_start < segment_end or (start == end and index == len(calendars) - 1)):
            return None
        if segment_start >= segment_end:
            continue
        zone = ZoneInfo.from_file(BytesIO(rules), key=name)
        hours, exclusions = json.loads(hours), json.loads(exclusions)
        for opens, closes in active:
            overlap_start, overlap_end = max(opens, segment_start), min(closes, segment_end)
            if overlap_start < overlap_end:
                total += eligible_working_time(overlap_start, overlap_end, zone, hours, exclusions)
    return total.total_seconds()
