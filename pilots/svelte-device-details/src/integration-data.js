/**
 * Small, read-only adapter for v2.0.3. All data comes from existing routes.
 * An existing section permission is required before we request that section.
 * No API route, field name or server-side permission check changes here.
 */
export class DeviceReadError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'DeviceReadError';
    this.status = status;
  }
}

async function getJson(path, fetcher = fetch) {
  const response = await fetcher(path, {
    method: 'GET', credentials: 'same-origin', cache: 'no-store',
    headers: { Accept: 'application/json' }
  });
  if (!response.ok) {
    const message = response.status === 401 ? 'Please sign in to view devices.' :
      response.status === 403 ? 'Your account does not have permission to view devices.' :
      'The requested device information could not be loaded.';
    throw new DeviceReadError(response.status, message);
  }
  return response.json();
}

export async function loadDevices(fetcher = fetch) {
  const permissionResult = await getJson('/api/inventory/sections', fetcher);
  const sections = permissionResult.sections || {};
  if (!sections.Devices?.read) {
    throw new DeviceReadError(403, 'Your account does not have permission to view devices.');
  }
  const deviceResult = await getJson('/api/inventory/devices', fetcher);
  const devices = Array.isArray(deviceResult.devices) ? deviceResult.devices : [];
  // Racks are independent: never request them unless the server says they are visible.
  const racks = sections.Racks?.read ?
    (await getJson('/api/inventory/racks', fetcher)).racks || [] : [];
  // We intentionally do not read /api/inventory/ipam: a device's own primaryIp is enough
  // for this first batch and avoids loading unrelated network allocations.
  return { devices, racks, rackAccess: Boolean(sections.Racks?.read) };
}

export function isVirtual(device) {
  return Boolean(device && (device.isVirtual === true || device.type === 'Server - Virtual'));
}

export function isHypervisor(device, allDevices = []) {
  return Boolean(device && !isVirtual(device) && device.type === 'Server - Physical' &&
    (device.typeDetails?.serverService_Hypervisor === true ||
      device.serverService_Hypervisor === true ||
      allDevices.some(guest => guest.virtualHostId === device.id)));
}

export function platformFor(device) {
  const details = device?.typeDetails || {};
  const hypervisor = device?.type === 'Server - Physical' &&
    (details.serverService_Hypervisor === true || device?.serverService_Hypervisor === true);
  return (hypervisor ? details.hypervisorProduct :
    (details.softwarePlatform || details.os || device?.os)) || 'Not recorded';
}

export function versionFor(device) {
  const details = device?.typeDetails || {};
  const hypervisor = device?.type === 'Server - Physical' &&
    (details.serverService_Hypervisor === true || device?.serverService_Hypervisor === true);
  return (hypervisor ? details.hypervisorVersion : details.softwareVersion) || '';
}

export function findHost(device, allDevices) {
  return device?.virtualHostId ?
    allDevices.find(record => record.id === device.virtualHostId) : undefined;
}

export function hostedGuests(device, allDevices) {
  return allDevices.filter(guest => guest.virtualHostId && guest.virtualHostId === device?.id);
}

export function rackFor(device, racks) {
  return device?.rackId ? racks.find(rack => rack.id === device.rackId) : undefined;
}

export function savedSelections(device, prefix) {
  return Object.entries(device?.typeDetails || {})
    .filter(([key, enabled]) => key.startsWith(prefix) && enabled === true)
    .map(([key]) => key.slice(prefix.length).replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' '))
    .sort((a, b) => a.localeCompare(b));
}
