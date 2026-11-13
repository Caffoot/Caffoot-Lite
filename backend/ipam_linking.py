"""Explicitly link one basic Device address to an existing managed subnet."""
import json
import time

from .application_integrity import validate_live_application_state
from .audit_events import record_actor_event
from .device_addresses import is_basic_address
from .device_saves import _check_primary_ip_claim
from .inventory import reconstruct_inventory
from .ipam_validation import ip_belongs_to_subnet
from .normalisation_validation import validate_normalisation_devices
from .permissions import can_access
from .sessions import session_account


def link_device_to_ipam(connection, account_id, session_token, payload):
    """Recheck current identity, ownership and revision within one write lock."""
    if (not isinstance(payload, dict) or set(payload) != {'deviceId','revision','subnetId','primaryIp'}
            or type(payload['revision']) is not int or payload['revision'] < 0
            or any(not isinstance(payload[key], str) or not payload[key]
                   for key in ('deviceId','subnetId','primaryIp'))):
        raise ValueError('Invalid Link to IPAM request')
    connection.execute('BEGIN IMMEDIATE')
    try:
        if (session_account(connection, session_token) != account_id or
                not all(can_access(connection, account_id, section, edit=True)
                        for section in ('Devices','IPAM'))):
            raise PermissionError('Devices and IPAM edit permissions required')
        state = reconstruct_inventory(connection)
        device = next((d for d in state['devices'] if d['id'] == payload['deviceId']), None)
        row = connection.execute('SELECT revision FROM inventory_devices WHERE id=?', (payload['deviceId'],)).fetchone()
        if (not device or not is_basic_address(device) or device.get('primaryIp') != payload['primaryIp']
                or row[0] != payload['revision']):
            raise ValueError('Device address or revision changed; refresh before linking')
        if connection.execute('SELECT 1 FROM device_edit_reservations WHERE device_id=? AND expires_at>?',
                              (device['id'],int(time.time()))).fetchone():
            raise ValueError('Finish or cancel the Device edit before linking')
        subnet = next((s for s in state['subnets'] if s['id'] == payload['subnetId']), None)
        ip = device['primaryIp']
        if (not subnet or subnet.get('kind','network') != 'network'
                or not ip_belongs_to_subnet(ip, subnet.get('cidr'))):
            raise ValueError('Choose an existing managed subnet containing this IPv4 address')
        if any(s.get('gateway') == ip for s in state['subnets']) and device.get('type') not in ('Firewall','Router','Layer 3 Switch'):
            raise ValueError('This Device type cannot own a subnet gateway')
        _check_primary_ip_claim(state['ipAllocations'], ip, device['id'])
        allocation = dict(state['ipAllocations'].get(ip) or {})
        allocation.update(status='Assigned', deviceId=device['id'], hostname=device['name'])
        allocation.setdefault('notes','')
        state['ipAllocations'][ip] = allocation
        device.pop('primaryIpMode')
        validate_normalisation_devices(state)
        errors = validate_live_application_state(state)
        if errors:
            raise ValueError(errors[0])
        connection.execute('UPDATE inventory_devices SET record_json=?,revision=revision+1 WHERE id=?',
                           (json.dumps(device,ensure_ascii=False,allow_nan=False),device['id']))
        connection.execute('INSERT INTO inventory_ip_allocations(ip,record_json) VALUES(?,?) ON CONFLICT(ip) DO UPDATE SET record_json=excluded.record_json',
                           (ip,json.dumps(allocation,ensure_ascii=False,allow_nan=False)))
        record_actor_event(connection, account_id, kind='Device', action='Updated', label=device['name'],
                           reason='Device linked to IPAM', fields=['Primary IP Mode'],
                           before={'primaryIpMode':'basic'}, after={'primaryIpMode':'managed'})
        record_actor_event(connection, account_id, kind='IPAM', action='Updated', label=ip,
                           reason='Device linked to IPAM', fields=['deviceId','status'])
        connection.commit()
        return {'revision':payload['revision']+1}
    except BaseException:
        connection.rollback()
        raise
