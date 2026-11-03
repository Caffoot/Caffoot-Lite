// Fictional preview records only. They are never fetched from or sent to Caffoot Lite.
export const devices = [
  {
    id: 'host', name: 'Hypervisor-01', kind: 'physical', type: 'Server - Physical',
    status: 'Active', location: 'Server Room', ip: '10.0.10.20',
    subnet: '10.0.10.0/24', platform: 'VMware ESXi', manufacturer: 'Dell',
    model: 'PowerEdge R650', serial: 'HYP-1001', rack: 'Rack A · Front',
    mount: 'Rack Mounted', rackFace: 'Front', rackU: '18', rackHeight: '1',
    hosting: true, software: ['VMware ESXi'], services: ['Hypervisor'],
    notes: 'Primary virtualisation host in the server room.'
  },
  {
    id: 'vm', name: 'App-VM-01', kind: 'virtual', type: 'Server - Virtual',
    status: 'Active', location: 'Server Room', ip: '10.0.10.41',
    subnet: '10.0.10.0/24', platform: 'Ubuntu Server', manufacturer: '', model: '',
    serial: '', rack: '', mount: 'Not Applicable', host: 'Hypervisor-01',
    virtualCpu: '4', virtualRam: '8', virtualDisk: '100', virtualAdapters: '2',
    software: ['Docker Engine', 'Nginx'], services: ['Web Server'],
    notes: 'Example application VM.'
  }
];

export const softwareSuggestions = {
  physical: ['VMware ESXi', 'Proxmox VE', 'Windows Server', 'OpenSSH Server', 'Veeam Agent'],
  virtual: ['Ubuntu Server', 'Docker Engine', 'Nginx', 'VMware Tools', 'OpenSSH Server']
};
export const serviceSuggestions = ['Hypervisor', 'Web Server', 'Database Server', 'File Server'];
export const platformOptions = {
  physical: ['VMware ESXi', 'Proxmox VE', 'Windows Server'],
  virtual: ['Ubuntu Server', 'Debian', 'Windows Server']
};
