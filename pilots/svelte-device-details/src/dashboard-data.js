// Summaries for the Dashboard come only from the existing permission-filtered
// inventory response. We do not request other sections to fill in missing data.

function array(value) {
  return Array.isArray(value) ? value : [];
}

function parseCidr(cidr) {
  if (typeof cidr !== 'string') return null;
  const [ip, prefixString, extra] = cidr.split('/');
  if (extra !== undefined || !/^(?:2[3-9]|30)$/.test(prefixString || '')) return null;
  const parts = (ip || '').split('.');
  if (parts.length !== 4 || !parts.every(part => /^\d{1,3}$/.test(part) &&
      Number(part) >= 0 && Number(part) <= 255)) return null;
  const prefix = Number(prefixString);
  const address = parts.reduce((sum, part) => sum * 256 + Number(part), 0) >>> 0;
  const mask = (0xffffffff << (32 - prefix)) >>> 0;
  const network = (address & mask) >>> 0;
  if (network !== address) return null; // Reject unaligned CIDRs, as the published IPAM does.
  const broadcast = (network + 2 ** (32 - prefix) - 1) >>> 0;
  return {first:network + 1, last:broadcast - 1, capacity:broadcast - network - 1};
}

function addressToNumber(value) {
  if (typeof value !== 'string') return null;
  const parts = value.split('.');
  if (parts.length !== 4 || !parts.every(part=>/^\d{1,3}$/.test(part) && Number(part)<=255)) return null;
  return parts.reduce((sum, part)=>sum * 256 + Number(part),0) >>> 0;
}

function numberToAddress(number) {
  return [24,16,8,0].map(shift=>(number >>> shift) & 255).join('.');
}

export function summariseSubnet(subnet, allocations = {}, devices = []) {
  const range = parseCidr(subnet?.cidr);
  if (!range) return {name:subnet?.name || '', cidr:subnet?.cidr || '', supported:false,
    capacity:0, assigned:0, reserved:0, available:0, utilisation:0};
  const owners = new Set(array(devices).map(device=>device.primaryIp).filter(Boolean));
  const gateway = addressToNumber(subnet?.gateway);
  let assigned=0, reserved=0;
  for (let number=range.first;number<=range.last;number++) {
    const ip=numberToAddress(number);
    const status=allocations[ip]?.status || (owners.has(ip) ? 'Assigned' : 'Available');
    if (status === 'Assigned') assigned++;
    else if (status === 'Reserved' || (status === 'Available' && number === gateway)) reserved++;
  }
  const used=assigned + reserved;
  return {name:subnet?.name || '', cidr:subnet?.cidr || '', supported:true,
    capacity:range.capacity, assigned, reserved, available:range.capacity-used,
    utilisation:Math.round(used / range.capacity * 100)};
}

export function summariseRack(rack, devices = [], accessories = [], includePlacement = true) {
  const height=Number(rack?.heightU) || 0;
  const installed=array(devices).filter(device=>device.rackId === rack?.id);
  const occupants=array(accessories).filter(item=>item.rackId===rack?.id &&
    !['pdu_vertical','cable_vertical'].includes(item.type));
  const used = face => installed.filter(item=>(item.rackFace || item.face || 'front')===face)
    .reduce((sum,item)=>{
      const first=Number(item.rackUStart),last=Number(item.rackUEnd ?? item.rackUStart);
      return sum+(Number.isInteger(first)&&Number.isInteger(last)&&last>=first?last-first+1:0);
    },0)+occupants.filter(item=>(item.face||'front')===face)
    .reduce((sum,item)=>sum+(Number(item.heightU)||0),0);
  const front=includePlacement ? used('front') : null;
  const rear=includePlacement ? used('rear') : null;
  return {name:rack?.name || rack?.id || 'Unnamed rack',height,
    front,rear,devices:includePlacement?installed.length:null,
    percent:height && includePlacement?Math.round(Math.max(front,rear)/height*100):null};
}

export function summariseDashboard(snapshot, history = []) {
  const access=snapshot?.sections || {};
  const hasDevices=access.Devices === true,hasIpam=access.IPAM === true,hasRacks=access.Racks === true;
  // Omitted data means "not permitted", not "zero records".
  const devices=hasDevices ? array(snapshot.devices) : [];
  const racks=hasRacks ? array(snapshot.racks) : [];
  const subnets=hasIpam ? array(snapshot.subnets) : [];
  const allocations=hasIpam && snapshot.ipAllocations && typeof snapshot.ipAllocations==='object' ?
    snapshot.ipAllocations : {};
  const accessories=hasRacks ? array(snapshot.rackAccessories) : [];
  const ipRows=hasIpam ? subnets.map(item=>summariseSubnet(item,allocations,devices)) : [];
  const rackRows=hasRacks ? racks.map(item=>summariseRack(item,devices,accessories,hasDevices)) : [];
  const statusCounts={};
  const typeCounts={};
  const locationCounts={};
  for (const device of devices) {
    const status=device.status || 'Active';
    const type=device.type || 'Unspecified';
    const location=device.location || 'Unknown';
    statusCounts[status]=(statusCounts[status]||0)+1;
    typeCounts[type]=(typeCounts[type]||0)+1;
    locationCounts[location]=(locationCounts[location]||0)+1;
  }
  const statuses=Object.entries(statusCounts).sort((a,b)=>b[1]-a[1]);
  const types=Object.entries(typeCounts).sort((a,b)=>b[1]-a[1]);
  const locations=Object.entries(locationCounts).sort((a,b)=>b[1]-a[1]);
  const events=array(history);
  const usableCapacity=ipRows.reduce((n,r)=>n+r.capacity,0);
  const assignedInSubnets=ipRows.reduce((n,r)=>n+r.assigned,0);
  const reservedInSubnets=ipRows.reduce((n,r)=>n+r.reserved,0);
  const totalAvailable=Math.max(0,usableCapacity-assignedInSubnets-reservedInSubnets);
  const ipUtilisation=usableCapacity?Math.round((assignedInSubnets+reservedInSubnets)/usableCapacity*100):0;
  const alerts=[
    ...ipRows.filter(r=>r.supported&&r.utilisation>=85).map(r=>({kind:'IPAM',name:r.name||r.cidr,
      percent:r.utilisation,severity:'warning',target:'ipam',text:'Subnet '+(r.name||r.cidr)+' is '+r.utilisation+'% used'})),
    ...rackRows.filter(r=>r.percent!==null&&r.percent>=85).map(r=>({kind:'Racks',name:r.name,
      percent:r.percent,severity:'warning',target:'racks',text:'Rack '+r.name+' is '+r.percent+'% occupied'}))
  ];
  // Cross-area diagnostics require permission for both sides of a relationship.
  if(hasDevices&&hasIpam){
    const addresses=new Set();
    for(const device of devices){
      if(!device.primaryIp)continue;
      if(addresses.has(device.primaryIp))alerts.push({kind:'Devices',severity:'critical',
        text:'Duplicate primary IP: '+device.primaryIp,target:'devices'});
      addresses.add(device.primaryIp);
      const alloc=allocations[device.primaryIp];
      if(!alloc||alloc.deviceId!==device.id)alerts.push({kind:'Devices',severity:'warning',
        text:(device.name||'Device')+' is not linked correctly in IPAM',target:'devices'});
    }
  }
  if(hasDevices&&hasRacks){
    const rackIds=new Set(racks.map(r=>r.id));
    for(const device of devices){
      if(device.rackId&&!rackIds.has(device.rackId))alerts.push({kind:'Racks',severity:'critical',
        text:(device.name||'Device')+' references a missing rack',target:'devices'});
    }
  }
  const healthIssues=alerts.filter(a=>a.severity==='critical').map(a=>a.text);
  return {
    access:{Devices:hasDevices,IPAM:hasIpam,Racks:hasRacks},
    devices,racks,subnets,ipRows,rackRows,statuses,types,locations,
    events:events.slice().reverse(),
    activeDevices:devices.filter(item=>(item.status||'Active').toLowerCase()==='active').length,
    ipAssigned:Object.values(allocations).filter(item=>item?.status==='Assigned').length,
    ipReserved:Object.values(allocations).filter(item=>item?.status==='Reserved').length,
    usableCapacity,assignedInSubnets,reservedInSubnets,totalAvailable,ipUtilisation,
    healthIssues,
    rackCount:racks.length,
    deviceCount:devices.length,
    subnetCount:subnets.length,
    warnings:alerts
  };
}

// Match the published CSV column order and protect spreadsheet users from
// device names that look like executable formulas.
function escapeCsv(value) {
  let text=String(value ?? '');
  if (/^\s*[=+\-@]/.test(text)) text="'"+text;
  return '"'+text.replace(/"/g,'""')+'"';
}

export function dashboardCsv(kind, data) {
  const access=data.access || {};
  if (!['devices','subnets','racks'].includes(kind) ||
    !(kind==='devices'?access.Devices:kind==='subnets'?access.IPAM:access.Racks)) {
    throw new Error('This report is not available to your account.');
  }
  // Device placement information is restricted when Rack access is absent.
  const reports={
    devices:[
      ['Hostname','Primary IP','Status','Type','Location','Manufacturer','Model','Serial Number','Rack','U Start','U End','IP Reserved'],
      ...data.devices.map(item=>[
        item.name,item.primaryIp,item.status || 'Active',item.type,item.location,
        item.manufacturer,item.model,item.serialNumber,
        access.Racks ? data.racks.find(rack=>rack.id===item.rackId)?.name || '' : '',
        access.Racks ? item.rackUStart : '',
        access.Racks ? item.rackUEnd : '',
        item.ipReserved?'Yes':'No'
      ])
    ],
    subnets:[
      ['Name','CIDR','Assigned','Reserved','Available','Capacity','Utilisation %','Supported /24'],
      ...data.ipRows.map(item=>[item.name,item.cidr,
        item.supported?item.assigned:'',item.supported?item.reserved:'',
        item.supported?item.available:'',item.supported?item.capacity:'',
        item.supported?item.utilisation:'',item.supported?'Yes':'No'])
    ],
    racks:[
      ['Rack','Height U','Front occupied U','Rear occupied U','Devices','Maximum face occupancy %'],
      ...data.rackRows.map(item=>[item.name,item.height,item.front,item.rear,item.devices,item.percent])
    ]
  };
  return '\uFEFF'+reports[kind].map(row=>row.map(escapeCsv).join(',')).join('\r\n');
}
