"""Preserve hidden Device placement values while organisation Racks is disabled."""
from .permissions import feature_enabled

RACK_FIELDS = ('mountType','rackId','rackUStart','rackUEnd','rackUHeight',
               'face','rackFace','rackShelfAccessoryId')


def prepare_device_rack_fields(connection, record, previous=None):
    """Restore omitted hidden values and refuse explicit placement changes."""
    record = dict(record)
    if feature_enabled(connection, 'Racks'):
        return record
    previous = previous or {}
    mounted = previous.get('rackId') or previous.get('rackShelfAccessoryId') or previous.get('mountType') == 'Rack Mounted'
    if mounted:
        for key in (*RACK_FIELDS, 'location'):
            if key in record and (key not in previous or record[key] != previous[key]):
                raise PermissionError('Hidden Rack placement and Location must remain unchanged')
            if key in previous:
                record[key] = previous[key]
    elif (record.get('mountType') == 'Rack Mounted' or record.get('rackId')
          or record.get('rackShelfAccessoryId') or any(record.get(key) not in (None,'',0)
              for key in ('rackUStart','rackUEnd','rackUHeight'))):
        raise PermissionError('New Rack placement is unavailable while Racks is disabled')
    return record
