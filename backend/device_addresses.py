"""Explicit basic device addresses, kept separate from managed IPAM assignments."""
from .permissions import can_access, feature_enabled
from .ipam_validation import _ip_number


def is_basic_address(device):
    return device.get('primaryIpMode') == 'basic'


def prepare_device_address(connection, account_id, record, previous=None):
    """Preserve address ownership; a normal save can never link a basic address."""
    record = dict(record)
    previous = previous or {}
    if record.get('primaryIp') is not None and not isinstance(record['primaryIp'], str):
        raise ValueError('Primary IP must be an IPv4 string or empty')
    if 'primaryIpMode' in record and record['primaryIpMode'] != 'basic':
        raise ValueError('Invalid primary IP mode')
    if is_basic_address(previous):
        record['primaryIpMode'] = 'basic'
    elif previous.get('primaryIp') and 'primaryIpMode' in record:
        raise ValueError('Managed addresses cannot be converted to basic addresses')
    elif not previous.get('primaryIp') and record.get('primaryIp') and not feature_enabled(connection, 'IPAM'):
        record['primaryIpMode'] = 'basic'
    elif not previous.get('primaryIp') and 'primaryIpMode' in record:
        raise ValueError('New basic addresses require IPAM to be disabled')
    if not record.get('primaryIp') and not is_basic_address(previous):
        record.pop('primaryIpMode', None)
    basic_change = is_basic_address(previous) or is_basic_address(record)
    changed = any(previous.get(key) != record.get(key) for key in ('primaryIp', 'ipReserved'))
    managed_operation = changed and not basic_change and bool(
        previous.get('primaryIp') or record.get('primaryIp'))
    if managed_operation and not can_access(connection, account_id, 'IPAM', edit=True):
        raise PermissionError('IPAM edit permission required for managed address changes')
    return record


def basic_address_errors(device, state):
    """Basic addresses bypass only managed-subnet and allocation requirements."""
    ip = device.get('primaryIp')
    number = _ip_number(ip)
    if number is None or ip != '.'.join(str(int(part)) for part in ip.split('.')) or device.get('ipReserved'):
        return ['Invalid basic IPv4 address or reservation flag']
    if device.get('type') not in ('Firewall','Router','Layer 3 Switch') and any(_ip_number(subnet.get('gateway')) == number for subnet in state['subnets']):
        return ['Basic IPv4 conflicts with a protected subnet gateway']
    if any(other.get('id') != device.get('id') and other.get('primaryIp')
           and _ip_number(other['primaryIp']) == number for other in state['devices']):
        return ['Duplicate device IPv4 address']
    for allocated_ip, allocation in state['ipAllocations'].items():
        if _ip_number(allocated_ip) == number and (
                not isinstance(allocation, dict) or allocation.get('deviceId')
                or allocation.get('reservedForDeviceId')
                or allocation.get('status') not in (None, '', 'Available')):
            return ['Basic IPv4 conflicts with an IPAM assignment or reservation']
    return []
