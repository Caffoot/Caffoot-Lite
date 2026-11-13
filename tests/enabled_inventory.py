"""Explicit enabled-feature baseline for existing inventory regression fixtures."""


def enable_inventory_features(connection):
    """Model an existing installation; production fresh-install defaults stay off."""
    connection.execute("UPDATE organisation_features SET enabled=1 WHERE feature IN ('devices','ipam','racks')")
    connection.commit()
