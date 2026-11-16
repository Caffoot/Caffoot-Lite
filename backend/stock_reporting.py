"""Read complete stock figures while keeping individual Device details protected."""
from datetime import datetime, timedelta, timezone

from backend.permissions import can_access
from backend.stock_intake import stock_access, stock_item
from backend.stock_circulation import registered_stock_devices, stock_movement_history, legacy_device_issue

HELD_STATES = ('ready', 'awaiting_checks', 'awaiting_preparation')
MOVEMENT_KINDS = ('received', 'issued', 'returned', 'written_off')


def stock_report_counts(states):
    """Describe physical possession separately from issues and write-off movements."""
    return dict(physicallyHeld=sum(states.get(key, 0) for key in HELD_STATES),
                readyToIssue=states.get('ready', 0),
                awaitingChecks=states.get('awaiting_checks', 0) + states.get('awaiting_preparation', 0),
                currentlyIssued=states.get('issued', 0))


def read_stock_report(connection, actor, *, days=30, category=None, today=None):
    """Report real balances and effective business dates without changing the journal.

    Complete stock aggregates are authorised by IT Assets Read. Identifiable
    Device activity and the stock classification still need Devices Read.
    Counts travel as decimal text so large totals remain exact in the browser.
    """
    stock_access(connection, actor)
    if type(days) is not int or days not in (30, 90):
        raise ValueError('Choose a 30 or 90 day reporting period')
    devices = can_access(connection, actor, 'Devices')
    today = today or datetime.now(timezone.utc).date()
    start = today - timedelta(days=days - 1)
    groups, catalogue = {}, []
    classification = dict(unregistered=0, registered=0, individual=0)

    def add_counts(name, counts):
        target = groups.setdefault(name, dict.fromkeys(stock_report_counts({}), 0))
        for key, value in counts.items():
            target[key] += value

    for identity, in connection.execute('SELECT id FROM it_asset_stock_items ORDER BY name COLLATE NOCASE,id'):
        item = stock_item(connection, identity)
        counts = dict(item['balances'], currentlyIssued=item['stateBalances']['currentlyIssued'])
        add_counts(item['category'], counts)
        low = (item['trackingMode'] == 'quantity' and item['minimumStockLevel'] is not None
               and counts['readyToIssue'] < item['minimumStockLevel'])
        catalogue.append(dict(id=identity, name=item['name'], category=item['category'],
                              counts=counts, lowStock=low, minimum=item['minimumStockLevel']))
        if devices and (category is None or item['category'] == category):
            classification['unregistered'] += sum(item['quantityStateBalances'].get(key, 0) for key in HELD_STATES)
            for unit in item['units']:
                classification['registered' if unit['deviceLinked'] else 'individual'] += int(unit['held'])
    registered = registered_stock_devices(connection)
    for device in registered:
        if not device['stockItemId']:
            add_counts(device['category'], stock_report_counts(device['states']))
            if devices and (category is None or device['category'] == category):
                classification['registered'] += sum(device['states'].get(key, 0) for key in HELD_STATES)
    # Older assignments have no stock issue entry. Count each only once.
    for identity, in connection.execute('''SELECT a.id FROM device_assignments a
        WHERE a.ended_at IS NULL AND NOT EXISTS(SELECT 1 FROM it_asset_stock_entries e
        JOIN it_asset_stock_movements m ON m.id=e.movement_id
        WHERE e.device_assignment_id=a.id AND m.kind='issued')'''):
        issue = legacy_device_issue(connection, identity)
        add_counts(issue['category'], dict(physicallyHeld=0, readyToIssue=0, awaitingChecks=0, currentlyIssued=1))
    # These are aggregate facts, not the permission-filtered individual history.
    facts = []
    for kind, happened, item_category, quantity in connection.execute('''SELECT m.kind,m.event_date,
        json_extract(e.snapshot_json,'$.category'),coalesce((SELECT c.corrected_quantity
        FROM it_asset_stock_movements c WHERE c.corrects_entry_id=e.id ORDER BY c.id DESC LIMIT 1),e.quantity)
        FROM it_asset_stock_entries e JOIN it_asset_stock_movements m ON m.id=e.movement_id
        WHERE m.kind IN ('received','issued','returned','written_off')
        AND coalesce(json_extract(m.checks_json,'$.directHandover'),0)!=1'''):
        if start.isoformat() <= happened <= today.isoformat():
            facts.append((kind, happened, item_category or 'Other', quantity))
    categories = sorted(set(groups) | {row[2] for row in facts})
    if category is not None and category not in categories:
        raise ValueError('Choose a recorded Equipment Category')
    selected = {key: value for key, value in groups.items() if category is None or key == category}
    totals = {key: sum(row[key] for row in selected.values()) for key in stock_report_counts({})}
    chosen = [row for row in catalogue if category is None or row['category'] == category]
    facts = [row for row in facts if category is None or row[2] == category]
    totals['writtenOff'] = sum(row[3] for row in facts if row[0] == 'written_off')
    totals['itemsBelowMinimum'] = sum(row['lowStock'] for row in chosen)
    totals['categories'] = len(selected)
    buckets = []
    for offset in range(0, days, 7 if days == 30 else 15):
        begin = start + timedelta(days=offset)
        end = min(begin + timedelta(days=6 if days == 30 else 14), today)
        counts = {kind: str(sum(row[3] for row in facts if row[0] == kind and begin.isoformat() <= row[1] <= end.isoformat()))
                  for kind in MOVEMENT_KINDS}
        buckets.append(dict(start=begin.isoformat(), end=end.isoformat(), counts=counts))
    chosen_items = {item['id'] for item in chosen}
    chosen_devices = {device['deviceId'] for device in registered if device['category'] == category}
    recent = stock_movement_history(connection, actor)
    recent = [row for row in recent if start.isoformat() <= row['date'] <= today.isoformat()
              and (category is None or row.get('stockItemId') in chosen_items
                   or row.get('deviceId') in chosen_devices)]
    recent.sort(key=lambda row: (row['date'], row['id'], row['entryId']), reverse=True)
    return dict(days=days, start=start.isoformat(), end=today.isoformat(), category=category,
        categories=categories, totals={key: str(value) for key, value in totals.items()},
        distribution=[dict(category=name, **{key: str(value) for key, value in counts.items()}) for name, counts in selected.items()],
        classification={key: str(value) for key, value in classification.items()} if devices else None,
        canViewDevices=devices, canDrillAggregates=devices, movements=buckets,
        items=[dict(row, counts={key: str(value) for key, value in row['counts'].items()},
                    minimum=str(row['minimum']) if row['minimum'] is not None else None) for row in chosen],
        recentActivity=recent[:6])
