"""Read installed application choices without exposing the Device record."""
import json
from pathlib import Path
import re


OTHER_SOFTWARE_KEY = 'other'
OTHER_SOFTWARE_LABEL = 'Other / Not Listed'
SOFTWARE_CATALOGUE = Path(__file__).resolve().parent.parent / 'interface' / 'installed-software-catalogue.json'


def ticket_software_choices(connection, equipment_id):
    """Match the Device Details inventory flags, including older saved records."""
    record = json.loads(connection.execute(
        'SELECT record_json FROM inventory_devices WHERE id=?', (equipment_id,),
    ).fetchone()[0])
    if record.get('type') not in ('Laptop', 'Desktop'):
        return []
    choices = _recorded_choices(connection, record, include_orphans=True)
    choices.append({'key': OTHER_SOFTWARE_KEY, 'label': OTHER_SOFTWARE_LABEL})
    return choices


def employee_installed_software(connection, record):
    """Return recorded names only for an already-authorised employee Device."""
    if record.get('type') not in ('Laptop', 'Desktop'):
        return []
    return list(dict.fromkeys(
        choice['label'] for choice in _recorded_choices(connection, record, include_orphans=False)
    ))


def _recorded_choices(connection, record, *, include_orphans):
    catalogue = json.loads(SOFTWARE_CATALOGUE.read_text(encoding='utf-8'))
    row = connection.execute(
        "SELECT value_json FROM inventory_settings WHERE key='installedSoftware'",
    ).fetchone()
    configured = json.loads(row[0]) if row else []
    entries = {}
    if isinstance(configured, list):
        for entry in configured:
            if (isinstance(entry, dict) and isinstance(entry.get('key'), str)
                    and isinstance(entry.get('label'), str) and entry['label'].strip()):
                if (include_orphans or entry['key'].startswith(('catalogSoftware_', 'customSoftware_'))
                        or entry['key'] in catalogue['legacyLabels']):
                    entries.setdefault(entry['key'], entry['label'])
    for suggestion in catalogue['suggestions']:
        name = suggestion['name']
        key = 'catalogSoftware_' + re.sub(r'[^a-z0-9]+', '_', name.lower()).strip('_')
        entries.setdefault(key, name)
    for key, name in catalogue['legacyLabels'].items():
        entries.setdefault(key, name)
    details = record.get('typeDetails')
    if not isinstance(details, dict):
        details = {}
    if include_orphans:
        for key in record.keys() | details.keys():
            if key.startswith(('catalogSoftware_', 'customSoftware_')):
                entries.setdefault(key, key.split('_', 1)[1].replace('_', ' '))
    choices = [{'key': key, 'label': label} for key, label in entries.items()
               if key != OTHER_SOFTWARE_KEY and label.strip()
               and (include_orphans or label.strip().casefold() != OTHER_SOFTWARE_LABEL.casefold())
               and details.get(key, record.get(key)) is True]
    choices.sort(key=lambda choice: (choice['label'].casefold(), choice['key']))
    return choices
