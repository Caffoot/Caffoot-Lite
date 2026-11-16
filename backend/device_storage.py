"""Validate optional inventory storage details without interpreting legacy capacity."""
import math


def storage_text(value, label, maximum=100):
    if not isinstance(value, str) or not value.strip() or len(value) > maximum or '\x00' in value:
        raise ValueError('Enter a valid ' + label)


def storage_number(value, label, *, whole=False, minimum=0):
    if isinstance(value, bool) or not isinstance(value, (int, float, str)):
        raise ValueError('Enter a positive ' + label)
    try:
        number = float(value)
    except (ValueError, OverflowError):
        raise ValueError('Enter a positive ' + label) from None
    if not math.isfinite(number) or number <= 0 or number < minimum or whole and (not number.is_integer() or number > 9007199254740991):
        raise ValueError('Enter a valid positive ' + label)
    return number


def validate_device_storage(record, previous=None):
    """Check newly changed details while retaining unrelated and historic values."""
    details = record.get('typeDetails')
    if not isinstance(details, dict):
        return
    before = (previous or {}).get('typeDetails')
    before = before if isinstance(before, dict) else {}
    physical = not record.get('isVirtual') and record.get('type') in ('Desktop', 'Laptop', 'Server - Physical')
    medium = details.get('storageType')
    if medium != before.get('storageType') and medium not in (None, ''):
        if not physical:
            raise ValueError('Storage Type applies to physical Desktop, Laptop and Server Devices')
        storage_text(medium, 'Storage Type')
    pools, boot = details.get('zfsPools'), details.get('bootStorage')
    if pools == before.get('zfsPools') and boot == before.get('bootStorage'):
        return
    if record.get('type') != 'Server - Physical' or record.get('isVirtual'):
        if pools or boot:
            raise ValueError('Boot Storage and ZFS details apply to physical Servers only')
        return
    if pools is None:
        pools = []
    if not isinstance(pools, list) or len(pools) > 100:
        raise ValueError('Enter a valid ZFS Pool list')
    names, identities = set(), set()
    old_pools = {pool.get('id'): pool for pool in before.get('zfsPools', []) if isinstance(pool, dict)} if isinstance(before.get('zfsPools'), list) else {}
    layouts = {'Single': 1, 'Mirror': 2, 'RAIDZ1': 3, 'RAIDZ2': 4, 'RAIDZ3': 5}
    for pool in pools:
        if not isinstance(pool, dict):
            raise ValueError('Enter a valid ZFS Pool')
        storage_text(pool.get('id'), 'ZFS Pool identity')
        storage_text(pool.get('name'), 'ZFS Pool Name')
        name = pool['name'].strip().casefold()
        if name in names or pool['id'] in identities:
            raise ValueError('ZFS Pool names and identities must be unique within the Device')
        names.add(name); identities.add(pool['id'])
        vdevs = pool.get('vdevs')
        if not isinstance(vdevs, list) or not 1 <= len(vdevs) <= 100:
            raise ValueError('Record at least one VDEV per ZFS Pool')
        old_pool = old_pools.get(pool['id'], {})
        old_vdevs = {v.get('id'): v for v in old_pool.get('vdevs', []) if isinstance(v, dict)}
        seen = set()
        for vdev in vdevs:
            if not isinstance(vdev, dict):
                raise ValueError('Enter a valid VDEV')
            storage_text(vdev.get('id'), 'VDEV identity')
            if vdev['id'] in seen:
                raise ValueError('VDEV identities must be unique within the Pool')
            seen.add(vdev['id'])
            if vdev == old_vdevs.get(vdev['id']):
                continue
            layout = vdev.get('layout')
            if not isinstance(layout, str) or layout not in layouts:
                raise ValueError('Choose Single, Mirror or RAIDZ1/2/3 for each VDEV')
            storage_number(vdev.get('driveCount'), 'VDEV Drive Count', whole=True, minimum=layouts[layout])
            storage_number(vdev.get('capacity'), 'VDEV Capacity Per Drive')
            if vdev.get('unit') not in ('GB', 'TB'):
                raise ValueError('Choose a VDEV Capacity Unit')
            storage_text(vdev.get('driveType'), 'VDEV Drive Type')
    if boot is None:
        return
    if not isinstance(boot, dict):
        raise ValueError('Enter valid Boot Storage')
    if boot.get('source') == 'pool':
        if boot.get('poolId') not in identities:
            raise ValueError('Choose an existing recorded ZFS Pool for Boot Storage')
        if set(boot) - {'source', 'poolId'}:
            raise ValueError('A linked Boot Pool must not duplicate independent boot drives')
    elif boot.get('source') == 'independent':
        if boot != before.get('bootStorage'):
            storage_text(boot.get('driveType'), 'Boot Drive Type')
            storage_number(boot.get('driveCount'), 'Number Of Boot Drives', whole=True)
            storage_number(boot.get('capacity'), 'Boot Capacity Per Drive')
            if boot.get('unit') not in ('GB', 'TB') or boot.get('configuration') not in ('Single', 'Mirror', 'Other'):
                raise ValueError('Choose the Boot Capacity Unit and Boot Configuration')
            if boot.get('configuration') == 'Mirror' and float(boot['driveCount']) < 2:
                raise ValueError('Mirror Boot Storage needs at least two drives')
            if boot.get('poolName'):
                storage_text(boot['poolName'], 'Boot Pool Name')
    else:
        raise ValueError('Choose independent boot drives or an existing ZFS Pool')
