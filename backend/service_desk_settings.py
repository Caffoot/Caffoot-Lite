"""Manage the support calendar and category catalogue as an administrator."""
from datetime import date
import re

from backend.audit_events import record_actor_event
from backend.permissions import _admin
from backend.service_desk import ticket_rows, ticket_text
from backend.service_desk_calendar import (WEEKDAYS, append_support_calendar,
                                           read_support_calendar, utc_timestamp)
from backend.service_desk_schema import OTHER_TICKET_CATEGORY_ID
from backend.sessions import session_account

CALENDAR_AUDIT_REASON = 'Service Desk calendar changed'
CATEGORY_AUDIT_REASON = 'Ticket category changed'
CLOCK_TIME = re.compile(r'(?:[01][0-9]|2[0-3]):[0-5][0-9]')
CALENDAR_DATE = re.compile(r'[0-9]{4}-[0-9]{2}-[0-9]{2}')


def parse_support_date(value):
    if not isinstance(value, str) or not CALENDAR_DATE.fullmatch(value):
        raise ValueError('Enter a valid date.')
    try:
        return date.fromisoformat(value)
    except ValueError as exc:
        raise ValueError('Enter a valid date.') from exc


def read_service_desk_settings(connection, actor):
    _admin(connection, actor)
    revision, _, hours, exclusions, name, _ = read_support_calendar(connection)
    categories = ticket_rows(connection.execute('SELECT id,name,hidden FROM service_desk_categories'))
    categories.sort(key=lambda category: (category['id'] == OTHER_TICKET_CATEGORY_ID, category['name'].casefold()))
    return {'calendarRevision': revision, 'workingHours': hours,
            'excludedDates': [{'date': day, 'reason': exclusions[day]} for day in sorted(exclusions)],
            'timezone': name, 'categories': categories, 'fixedCategoryId': OTHER_TICKET_CATEGORY_ID}


def validate_working_hours(hours):
    if not isinstance(hours, list) or len(hours) != len(WEEKDAYS):
        raise ValueError('Set working hours for all seven days.')
    for name, day in zip(WEEKDAYS, hours):
        if (not isinstance(day, dict) or day.keys() != {'enabled', 'start', 'end'}
                or type(day['enabled']) is not bool):
            raise ValueError(f'Choose whether {name} is open or closed.')
        for key in ('start', 'end'):
            if not isinstance(day[key], str) or (not CLOCK_TIME.fullmatch(day[key])
                                                  and (day['enabled'] or day[key] != '')):
                raise ValueError(f'Enter valid start and end times for {name}.')
        if day['enabled'] and day['start'] >= day['end']:
            raise ValueError(f'The end time for {name} must be later than the start time.')
    return hours


def save_support_calendar(connection, actor, payload):
    action = payload['action']
    revision, _, hours, exclusions, name, rules = read_support_calendar(connection)
    if action == 'working-hours' and payload.keys() == {'action', 'calendarRevision', 'workingHours'}:
        expected_revision = payload['calendarRevision']
        if expected_revision is not None and type(expected_revision) is not int:
            raise ValueError('Invalid support calendar revision.')
        if expected_revision != revision:
            raise FileExistsError('The support calendar has changed. Reload Settings before saving.')
        updated_hours = validate_working_hours(payload['workingHours'])
        updated_exclusions = exclusions
        label, fields = 'Working Hours', ['Working Hours']
        before, after = hours, updated_hours
    elif action in ('add-date', 'remove-date'):
        required = {'action', 'date', 'reason'} if action == 'add-date' else {'action', 'date'}
        if payload.keys() != required:
            raise ValueError('Enter the details for this excluded date.')
        day = parse_support_date(payload['date']).isoformat()
        updated_hours, updated_exclusions = hours, exclusions.copy()
        if action == 'add-date':
            if day in exclusions:
                raise ValueError('This date is already excluded.')
            updated_exclusions[day] = ticket_text(payload['reason'], 'Reason', 100)
        elif day not in updated_exclusions:
            raise FileExistsError('This excluded date has already been removed.')
        else:
            del updated_exclusions[day]
        label, fields = 'Excluded Dates', [day]
        before, after = exclusions.get(day), updated_exclusions.get(day)
    else:
        raise ValueError('Invalid support calendar settings.')
    if updated_hours != hours or updated_exclusions != exclusions:
        at = utc_timestamp()
        append_support_calendar(connection, at, updated_hours, updated_exclusions, name, rules, actor)
        record_actor_event(connection, actor, kind='Settings', action='Updated', label=label,
                           reason=CALENDAR_AUDIT_REASON, fields=fields,
                           subject=('Settings', 'service-desk:working-hours' if action == 'working-hours' else 'service-desk:excluded-date:' + day,
                                    label if action == 'working-hours' else 'Excluded date ' + day),
                           before={'value': before}, after={'value': after, 'effectiveAt': at})


def save_ticket_category(connection, actor, payload):
    action = payload['action']
    previous = None
    if action == 'add-category':
        if payload.keys() != {'action', 'name'}:
            raise ValueError('Enter a category name.')
    else:
        expected = {'action', 'id', 'name', 'previousName'} if action == 'rename-category' else {'action', 'id'}
        if payload.keys() != expected or type(payload['id']) is not int or not 0 < payload['id'] <= 2**63 - 1:
            raise ValueError('Select a ticket category.')
        if payload['id'] == OTHER_TICKET_CATEGORY_ID:
            raise ValueError('Other / Not Listed is always available and cannot be changed.')
        previous = connection.execute('SELECT id,name,hidden FROM service_desk_categories WHERE id=?',
                                      (payload['id'],)).fetchone()
        if previous is None:
            raise ValueError('This category no longer exists.')
        if action == 'rename-category' and payload['previousName'] != previous[1]:
            raise FileExistsError('This category has been renamed. Reload Settings before saving.')
    name = ticket_text(payload['name'], 'Category Name', 90) if action in ('add-category', 'rename-category') else previous[1]
    if any(name.casefold() == existing.casefold() and (previous is None or identity != previous[0])
           for identity, existing in connection.execute('SELECT id,name FROM service_desk_categories')):
        raise ValueError('A category with this name already exists, including hidden categories.')
    hidden = int(action == 'hide-category' or (action == 'rename-category' and previous[2]))
    if previous is None:
        identity = connection.execute('INSERT INTO service_desk_categories(name) VALUES(?)', (name,)).lastrowid
    else:
        identity = previous[0]
        if (name, hidden) == previous[1:]:
            return
        connection.execute('UPDATE service_desk_categories SET name=?,hidden=? WHERE id=?', (name, hidden, identity))
    record_actor_event(connection, actor, kind='Settings', action='Created' if previous is None else 'Updated',
                       label='Ticket Categories', reason=CATEGORY_AUDIT_REASON, fields=['Category'],
                       subject=('Settings', 'service-desk:category:' + str(identity), name),
                       before=None if previous is None else {'name': previous[1], 'hidden': bool(previous[2])},
                       after={'id': identity, 'name': name, 'hidden': bool(hidden)})


def save_service_desk_settings(connection, actor, session_token, payload):
    """Recheck permission under the write lock and save the audit with the change."""
    with connection:
        connection.execute('BEGIN IMMEDIATE')
        if session_account(connection, session_token) != actor:
            raise PermissionError('Verified administrator session required.')
        _admin(connection, actor)
        if not isinstance(payload, dict) or not isinstance(payload.get('action'), str):
            raise ValueError('Invalid Service Desk settings.')
        if payload['action'] in ('add-category', 'rename-category', 'hide-category', 'restore-category'):
            save_ticket_category(connection, actor, payload)
        else:
            save_support_calendar(connection, actor, payload)
        return read_service_desk_settings(connection, actor)
