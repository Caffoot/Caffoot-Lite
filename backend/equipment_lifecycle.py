"""Authoritative physical Device dates, settings and warning calculations."""
from calendar import monthrange
from datetime import date, datetime, timezone
import json

from .audit_events import record_actor_event
from .permissions import _admin, can_access, feature_enabled
from .sessions import session_account

DEFAULT_LIFESPANS = {
    'Desktop': 3, 'Laptop': 3, 'Server - Physical': 5, 'Switch': 7, 'Tablet': 4,
    'Layer 3 Switch': 7, 'Router': 7, 'Firewall': 5, 'NAS': 5, 'Printer': 5,
    'Scanner': 5, 'Access Point': 5, 'Wireless LAN Controller': 7, 'PDU': 7,
    'UPS': 5, 'Unknown': None,
}
VIRTUAL_TYPES = frozenset(('Server - Virtual', 'Virtual Machine'))
DATE_FIELDS = {
    'purchaseDate': 'Purchase Date', 'originalInServiceDate': 'Original In Service Date',
    'warrantyExpiry': 'Warranty Expiry', 'replacementOverride': 'Planned Replacement Date',
}
DATE_COLUMNS = 'purchase_date,original_in_service_date,warranty_expiry,replacement_override'
DEVICE_AUDIT_REASON = 'Equipment Lifecycle dates changed'
SETTINGS_AUDIT_REASON = 'Equipment Lifecycle settings changed'
FIRST_SERVICE_AUDIT_REASON = 'Original In Service Date recorded at first stock issue'
UNCHANGED_LIFECYCLE = object()


def utc_today():
    return datetime.now(timezone.utc).date()


def physical_device(record):
    return not (record.get('isVirtual') or record.get('virtualHostId')
                or record.get('type') in VIRTUAL_TYPES)


def calendar_date(value, label, *, latest=None):
    if value is None:
        return None
    try:
        parsed = date.fromisoformat(value)
    except (TypeError, ValueError):
        raise ValueError(f'Enter a valid {label}.') from None
    if parsed.isoformat() != value:
        raise ValueError(f'Enter a valid {label}.')
    if latest is not None and parsed > latest:
        raise ValueError(f'{label} cannot be in the future.')
    return parsed


def add_calendar_years(baseline, years):
    if baseline is None or years is None:
        return None
    year = baseline.year + years
    if year > date.max.year:
        return None
    day = min(baseline.day, monthrange(year, baseline.month)[1])
    return date(year, baseline.month, day)


def warning_state(value, today, days):
    if value is None:
        return None
    remaining = (value - today).days
    if remaining < 0:
        return 'past'
    if remaining <= days:
        return 'upcoming'
    return None


def lifecycle_configuration(connection):
    warranty, replacement, revision = connection.execute(
        'SELECT warranty_days,replacement_days,revision FROM equipment_lifecycle_settings'
    ).fetchone()
    return dict(warrantyDays=warranty, replacementDays=replacement, revision=revision)


def display_type(name):
    return 'Server' if name == 'Server - Physical' else name


def lifecycle_types(connection):
    """Combine settings with the existing managed and discovered types."""
    configured = connection.execute(
        "SELECT value_json FROM inventory_settings WHERE key='deviceTypes'"
    ).fetchone()
    managed = json.loads(configured[0]) if configured else []
    discovered = [name for (name,) in connection.execute(
        "SELECT DISTINCT json_extract(record_json,'$.type') FROM inventory_devices"
    )]
    rows = {name: (years, bool(archived), original) for name, years, archived, original
            in connection.execute('SELECT name,years,archived,original_name FROM equipment_lifecycle_types')}
    canonical = (name for name, (_, _, original) in rows.items() if original is not None)
    names = dict.fromkeys(name for name in (*canonical, *managed, *discovered)
                          if isinstance(name, str) and name and name not in VIRTUAL_TYPES)
    return [
        dict(name=name, label='Server (Custom)' if name == 'Server' and 'Server - Physical' in names else display_type(name),
             years=rows.get(name, (None, False, None))[0], archived=rows.get(name, (None, False, None))[1])
        for name in names
    ]


def device_type_availability(connection):
    archived, renamed = [], []
    for name, is_archived, original in connection.execute(
            'SELECT name,archived,original_name FROM equipment_lifecycle_types'):
        if is_archived:
            archived.append(name)
        if original is not None and original != name:
            renamed.append(original)
    return dict(archived=archived, renamed=renamed)


def require_selectable_device_type(connection, device_type, previous=None):
    if device_type == previous:
        return
    availability = device_type_availability(connection)
    if isinstance(device_type, str) and any(
            name.casefold() == device_type.casefold() for name in availability['archived']):
        raise ValueError('Choose a Device Type that is available for new selections.')
    if device_type in availability['renamed']:
        row = connection.execute(
            "SELECT value_json FROM inventory_settings WHERE key='deviceTypes'"
        ).fetchone()
        if row is None or device_type not in json.loads(row[0]):
            raise ValueError('Choose the current name of this Device Type.')


def read_lifecycle_settings(connection, actor):
    _admin(connection, actor)
    if not feature_enabled(connection, 'Equipment Lifecycle'):
        raise PermissionError('Equipment Lifecycle is disabled')
    return dict(lifecycle_configuration(connection), types=lifecycle_types(connection))


def whole_number(value, minimum, maximum, label, *, optional=False):
    if optional and value is None:
        return value
    if type(value) is not int or not minimum <= value <= maximum:
        raise ValueError(f'{label} must be a whole number between {minimum:,} and {maximum:,}.')
    return value


def save_lifecycle_settings(connection, actor, token, payload):
    connection.execute('BEGIN IMMEDIATE')
    try:
        if session_account(connection, token) != actor:
            raise PermissionError('Verified administrator session required')
        current = read_lifecycle_settings(connection, actor)
        if not isinstance(payload, dict) or set(payload) != {
                'warrantyDays', 'replacementDays', 'revision', 'types'}:
            raise ValueError('Invalid Lifecycle Settings')
        if type(payload['revision']) is not int or payload['revision'] != current['revision']:
            raise FileExistsError('Lifecycle Settings changed. Reopen Lifecycle Settings and try again.')
        warning_fields = {'warrantyDays': 'Warranty Expiry Warning Period',
                          'replacementDays': 'Planned Replacement Warning Period'}
        for key, label in warning_fields.items():
            whole_number(payload[key], 0, 3650, label)

        types = {row['name']: row for row in current['types']}
        entries = payload['types']
        if not isinstance(entries, list) or len(entries) != len(types):
            raise FileExistsError('Device Types changed. Reopen Lifecycle Settings and try again.')
        seen = set()
        for entry in entries:
            if (not isinstance(entry, dict) or set(entry) != {'name', 'years'}
                    or not isinstance(entry['name'], str)):
                raise ValueError('Invalid Device Type lifespan')
            name = entry['name']
            if name in seen or name not in types:
                raise FileExistsError('Device Types changed. Reopen Lifecycle Settings and try again.')
            seen.add(name)
            kind = types[name]
            label = kind['label']
            years = whole_number(entry['years'], 1, 100, f'{label} lifespan', optional=True)
            if years == kind['years']:
                continue
            connection.execute(
                'INSERT INTO equipment_lifecycle_types(name,years) VALUES(?,?) '
                'ON CONFLICT(name) DO UPDATE SET years=excluded.years', (name, years))
            record_actor_event(connection, actor, kind='Settings', action='Updated', label=label,
                reason=SETTINGS_AUDIT_REASON, fields=['Expected Equipment Lifespan'],
                before={'Expected Equipment Lifespan': kind['years']},
                after={'Expected Equipment Lifespan': years})

        before = {label: current[key] for key, label in warning_fields.items() if current[key] != payload[key]}
        if before:
            after = {label: payload[key] for key, label in warning_fields.items() if label in before}
            record_actor_event(connection, actor, kind='Settings', action='Updated', label='Warning Periods',
                reason=SETTINGS_AUDIT_REASON, fields=before, before=before, after=after)
        connection.execute(
            'UPDATE equipment_lifecycle_settings SET warranty_days=?,replacement_days=?,revision=revision+1',
            (payload['warrantyDays'], payload['replacementDays']))
        result = read_lifecycle_settings(connection, actor)
        connection.commit()
        return result
    except BaseException:
        connection.rollback()
        raise


def device_lifecycle_values(connection, device_id):
    row = connection.execute(
        f'SELECT {DATE_COLUMNS} FROM device_lifecycle WHERE device_id=?', (device_id,)
    ).fetchone()
    return dict(zip(DATE_FIELDS, row or (None,) * len(DATE_FIELDS)))


def write_device_lifecycle(connection, actor, record, updates):
    """Persist approved fields inside the existing reserved Device transaction."""
    if not feature_enabled(connection, 'Equipment Lifecycle') or not can_access(
            connection, actor, 'Devices', edit=True):
        raise PermissionError('Equipment Lifecycle and Devices Edit are required')
    if not physical_device(record):
        raise ValueError('Equipment Lifecycle dates apply to physical Devices only.')
    if not isinstance(updates, dict) or not updates.keys() <= DATE_FIELDS.keys():
        raise ValueError('Invalid Equipment Lifecycle dates.')
    if 'replacementOverride' in updates:
        _admin(connection, actor)
    device_id = record['id']
    previous = device_lifecycle_values(connection, device_id)
    today = utc_today()
    for key, value in updates.items():
        calendar_date(value, DATE_FIELDS[key], latest=today if key in ('purchaseDate', 'originalInServiceDate') else None)
    values = dict(previous, **updates)
    changed = [key for key in updates if values[key] != previous[key]]
    if not changed:
        return
    connection.execute(
        f'INSERT INTO device_lifecycle(device_id,{DATE_COLUMNS}) VALUES(?,?,?,?,?) '
        'ON CONFLICT(device_id) DO UPDATE SET purchase_date=excluded.purchase_date,'
        'original_in_service_date=excluded.original_in_service_date,warranty_expiry=excluded.warranty_expiry,'
        'replacement_override=excluded.replacement_override', (device_id, *values.values()))
    record_actor_event(connection, actor, kind='Device', action='Updated', label=device_id,
        reason=DEVICE_AUDIT_REASON, fields=[DATE_FIELDS[key] for key in changed],
        before={DATE_FIELDS[key]: previous[key] for key in changed},
        after={DATE_FIELDS[key]: values[key] for key in changed})


def project_device_lifecycle(connection, devices):
    """Compute only visible physical Device dates, using one UTC reference date."""
    settings = lifecycle_configuration(connection)
    today = utc_today()
    lifespans = dict(connection.execute('SELECT name,years FROM equipment_lifecycle_types'))
    saved = {row[0]: dict(zip(DATE_FIELDS, row[1:])) for row in connection.execute(
        f'SELECT device_id,{DATE_COLUMNS} FROM device_lifecycle')}
    result = []
    for device in devices:
        if not physical_device(device):
            continue
        values = saved.get(device['id'], dict.fromkeys(DATE_FIELDS))
        baseline = values['originalInServiceDate'] or values['purchaseDate']
        years = lifespans.get(device.get('type'))
        calculated = add_calendar_years(date.fromisoformat(baseline), years) if baseline else None
        replacement = date.fromisoformat(values['replacementOverride']) if values['replacementOverride'] else calculated
        warranty = date.fromisoformat(values['warrantyExpiry']) if values['warrantyExpiry'] else None
        result.append(dict(values, deviceId=device['id'], lifespan=years,
            plannedReplacementDate=replacement.isoformat() if replacement else None,
            warrantyWarning=warning_state(warranty, today, settings['warrantyDays']),
            replacementWarning=warning_state(replacement, today, settings['replacementDays'])))
    return dict(today=today.isoformat(), warrantyDays=settings['warrantyDays'],
                replacementDays=settings['replacementDays'], devices=result)


def capture_first_service_from_stock(connection, actor, device_id, unit_id, issued_on):
    """Only known registration followed by its first physical issue proves first service."""
    if not connection.in_transaction:
        raise RuntimeError('First service capture requires the stock transaction')
    if device_lifecycle_values(connection, device_id)['originalInServiceDate'] is not None:
        return
    registered, previously_moved, previously_assigned = connection.execute(
        """SELECT
            EXISTS(SELECT 1 FROM it_asset_stock_entries e JOIN it_asset_stock_movements m
                   ON m.id=e.movement_id WHERE e.stock_unit_id=? AND m.kind='registered'),
            EXISTS(SELECT 1 FROM it_asset_stock_entries e JOIN it_asset_stock_movements m
                   ON m.id=e.movement_id WHERE e.stock_unit_id=? AND m.kind IN ('issued','returned')),
            EXISTS(SELECT 1 FROM device_assignments WHERE device_id=?)""",
        (unit_id, unit_id, device_id)).fetchone()
    if not registered or previously_moved or previously_assigned:
        return
    calendar_date(issued_on, 'Date Issued for first service (UTC)', latest=utc_today())
    connection.execute(
        'INSERT INTO device_lifecycle(device_id,original_in_service_date) VALUES(?,?) '
        'ON CONFLICT(device_id) DO UPDATE SET original_in_service_date=excluded.original_in_service_date',
        (device_id, issued_on))
    record_actor_event(connection, actor, kind='Device', action='Updated', label=device_id,
        reason=FIRST_SERVICE_AUDIT_REASON, fields=['Original In Service Date'],
        before={'Original In Service Date': None}, after={'Original In Service Date': issued_on})
