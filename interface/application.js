const defaultData = {
            subnets: [],
            vlans: [],
            racks: [],
            devices: [],
            rackAccessories: [],
            deviceTypes: ['Server - Physical', 'Server - Virtual', 'Desktop', 'Laptop', 'Tablet', 'Switch', 'Layer 3 Switch', 'Router', 'Firewall', 'NAS', 'Printer', 'Scanner', 'Access Point', 'Wireless LAN Controller', 'PDU', 'UPS', 'Unknown'],
            deviceTypeGraphics: {},
            deviceLocations: ['Unknown'],
            ipAllocations: {},
            serverFunctions: [],
            installedSoftware: [],
            managedOptionsCleared: false
        };

        const STATE_VERSION = 3;
        const SOFTWARE_SERVICE_NAME_MAX_LENGTH = 100;

        function cloneDefaultData() {
            return JSON.parse(JSON.stringify(defaultData));
        }

        function isPlainObject(value) {
            return value !== null && typeof value === 'object' && !Array.isArray(value);
        }

        function isValidIpv4(ip) {
            const parts = String(ip || '').trim().split('.');
            return parts.length === 4 && parts.every(part => {
                if (!/^\d{1,3}$/.test(part)) return false;
                const n = Number(part);
                return n >= 0 && n <= 255;
            });
        }

        // unsigned IPv4 math; supported host ranges /23 through /30.
        function parseIpv4AddressToNumber(ip) {
            if (!isValidIpv4(ip)) return null;
            return ip.split('.').reduce((n,part)=>((n*256)+Number(part)),0);
        }
        function formatIpv4Address(n) {
            return [24,16,8,0].map(shift=>Math.floor(n/2**shift)%256).join('.');
        }
        function parseSupportedIpv4Subnet(cidr) {
            const m=String(cidr||'').match(/^([^/]+)\/(\d{1,2})$/);
            if(!m) return null;
            const prefix=Number(m[2]), raw=parseIpv4AddressToNumber(m[1]);
            if(raw===null||prefix<23||prefix>30) return null;
            const size=2**(32-prefix), network=Math.floor(raw/size)*size;
            if(raw!==network) return null;
            return {prefix,network,last:network+size-1,first:network+1,lastHost:network+size-2,capacity:size-2,size};
        }
        function isUsableHostAddressInSubnet(ip,cidr) {
            const x=parseSupportedIpv4Subnet(cidr),n=parseIpv4AddressToNumber(ip);
            return !!(x&&n!==null&&n>=x.first&&n<=x.lastHost);
        }
        function isValidCidr24(cidr) { return !!parseSupportedIpv4Subnet(cidr); }

// Pure IPv4 hierarchy validation. No DOM, storage, or network dependencies.
// This file is the testable foundation for the upcoming app integration.
function hierarchyIpNumber(ip) {
  const parts=String(ip).split('.');
  if(parts.length!==4 || !parts.every(p=>/^\d{1,3}$/.test(p)&&Number(p)<=255)) return null;
  return parts.reduce((n,p)=>n*256+Number(p),0);
}
function hierarchyIpString(n) { return [24,16,8,0].map(k=>Math.floor(n/2**k)%256).join('.'); }
function hierarchyParseCidr(value,{minPrefix=0,maxPrefix=32}={}) {
  const m=/^([^/]+)\/(\d{1,2})$/.exec(String(value));
  if(!m) return null;
  const raw=hierarchyIpNumber(m[1]),prefix=Number(m[2]);
  if(raw===null||prefix<minPrefix||prefix>maxPrefix) return null;
  const size=2**(32-prefix),start=Math.floor(raw/size)*size;
  return {prefix,start,end:start+size-1,size,aligned:raw===start,canonical:hierarchyIpString(start)+'/'+prefix};
}
function hierarchyValidate(subnets) {
  const errors=[];
  if(!Array.isArray(subnets)) return ['Subnets must be an array.'];
  const ids=new Map(),cidrs=new Set(),ranges=new Map();
  for(const s of subnets) {
    if(!s||typeof s!=='object'||Array.isArray(s)||typeof s.id!=='string'||!s.id.trim()) {errors.push('Subnet ID is missing.');continue;}
    if(ids.has(s.id)) { errors.push('Duplicate subnet ID: '+s.id); continue; }
    ids.set(s.id,s);
    const kind=s.kind===undefined?'network':s.kind;
    if(kind!=='network'&&kind!=='container'&&kind!=='reserved'&&kind!=='loopback') { errors.push('Invalid subnet kind: '+s.id); continue; }
    if(s.parentId!==undefined&&s.parentId!==null&&s.parentId!==''&&typeof s.parentId!=='string') errors.push('Invalid parent ID for '+s.id);
    const range=hierarchyParseCidr(s.cidr,{minPrefix:kind==='container'||kind==='reserved'?0:kind==='loopback'?32:1,maxPrefix:kind==='loopback'?32:32});
    if(!range) errors.push('Invalid CIDR for '+s.id+': '+s.cidr);
    else if(!range.aligned) errors.push('Misaligned CIDR '+s.cidr+'; use '+range.canonical);
    else {
      ranges.set(s.id,range);
      if(cidrs.has(range.canonical)) errors.push('Duplicate CIDR: '+range.canonical);
      cidrs.add(range.canonical);
    }
  }
  for(const s of subnets) {
    if(!s||!s.id||!ranges.has(s.id)) continue;
    const parentId=typeof s.parentId==='string'?s.parentId:null;
    if(!parentId) continue;
    if(parentId===s.id) {errors.push('Subnet cannot parent itself: '+s.id);continue;}
    const p=ids.get(parentId);
    if(!p) {errors.push('Missing parent '+parentId+' for '+s.id);continue;}
    if(p.kind!=='container') errors.push('Parent must be a container: '+parentId);
    const child=ranges.get(s.id),parent=ranges.get(parentId);
    if(parent&&!(parent.start<=child.start&&child.end<=parent.end&&child.size<parent.size))
      errors.push('Child '+s.id+' is not strictly inside parent '+parentId);
    const seen=new Set([s.id]);
    let cursor=p;
    while(cursor) {
      if(seen.has(cursor.id)) {errors.push('Parent cycle involving '+s.id);break;}
      seen.add(cursor.id);
      cursor=cursor.parentId?ids.get(cursor.parentId):null;
    }
  }
  // Every intersecting pair must have an explicit ancestor relationship.
  function ancestor(ancestorId,childId) {
    const seen=new Set();
    let s=ids.get(childId);
    while(s&&s.parentId&&!seen.has(s.id)) {
      seen.add(s.id);
      if(s.parentId===ancestorId) return true;
      s=ids.get(s.parentId);
    }
    return false;
  }
  for(let i=0;i<subnets.length;i++) for(let j=i+1;j<subnets.length;j++) {
    const a=subnets[i],b=subnets[j];
    if(!a||!b||typeof a!=='object'||typeof b!=='object'||a.id===b.id) continue;
    const x=ranges.get(a.id),y=ranges.get(b.id);
    if(x&&y&&x.start<=y.end&&y.start<=x.end&&!ancestor(a.id,b.id)&&!ancestor(b.id,a.id))
      errors.push('Overlapping unrelated subnets: '+a.cidr+' and '+b.cidr);
  }
  return errors;
}

function hierarchyValidateTypes(subnets) {
  if(!Array.isArray(subnets)) return ['Subnets must be an array.'];
  const errors=[];
  for(const s of subnets) {
    if(!s||typeof s!=='object'||Array.isArray(s)) {errors.push('Invalid subnet record.');continue;}
    const kind=s.kind===undefined?'network':s.kind;
    if(!['network','container','reserved','loopback'].includes(kind)) {
      errors.push('Invalid subnet kind: '+String(s.id));continue;
    }
    const range=hierarchyParseCidr(s.cidr);
    if(!range||!range.aligned) {errors.push('Invalid subnet CIDR: '+String(s.cidr));continue;}
    if(kind==='network') {
      if(range.prefix>30||range.prefix<1) errors.push('Network requires a /1–/30 CIDR: '+s.cidr);
      const vlan=Number(s.vlan);
      if(s.vlan!==null&&s.vlan!==undefined&&s.vlan!==''&&(!Number.isInteger(vlan)||vlan<1||vlan>4094))
        errors.push('Network requires VLAN 1–4094: '+String(s.id));
      const gateway=hierarchyIpNumber(s.gateway);
      if(!(s.purpose==='VPN'&&(s.gateway===undefined||s.gateway===null||s.gateway===''))&&(gateway===null||gateway<=range.start||gateway>=range.end))
        errors.push('Network requires a usable gateway: '+String(s.id));
      if('purpose' in s&&!['LAN','Management','VPN'].includes(s.purpose))errors.push('Select LAN, Management or VPN purpose: '+String(s.id));
    } else {
      if(kind==='loopback'&&range.prefix!==32) errors.push('Loopback requires /32: '+String(s.id));
      if(s.gateway!==undefined&&s.gateway!==null&&s.gateway!=='')
        errors.push(kind+' must not have a gateway: '+String(s.id));
      if(s.vlan!==undefined&&s.vlan!==null&&s.vlan!=='')
        errors.push(kind+' must not have a VLAN: '+String(s.id));
    }
  }
  return errors;
}
        // Read-only ownership assessment: never migrate records during rendering.
        function previewLegacyVlanOwnershipInApp(state = appState) {
            return state.vlans.filter(v => v && !v.parentId).map(v => {
                const matches = state.subnets.filter(sub =>
                    sub && (!sub.kind || sub.kind === 'network') &&
                    Number(sub.vlan) === Number(v.vlanId));
                return {
                    id: v.id,
                    vlanId: v.vlanId,
                    status: matches.length === 1 ? 'unique' : matches.length ? 'ambiguous' : 'orphaned',
                    parentId: matches.length === 1 ? (matches[0].parentId || null) : null
                };
            });
        }

        async function reconcileLegacyVlanOwnership() {
            const preview = previewLegacyVlanOwnershipInApp();
            const candidates = preview.filter(item => item.status === 'unique' && item.parentId);
            if (!candidates.length) {
                showToast('No uniquely matched legacy VLAN records need reconciliation.');
                return;
            }
            if (preview.some(item => item.status !== 'unique')) {
                showToast('Reconciliation blocked: ambiguous or orphaned VLAN records require review.', 'error');
                return;
            }
            const candidateIds = new Set(candidates.map(item => item.id));
            const proposed = appState.vlans.map(v => candidateIds.has(v.id)
                ? { ...v, parentId: candidates.find(item => item.id === v.id).parentId }
                : { ...v });
            const seen = new Set();
            for (const v of proposed) {
                const key = (v.parentId || '__unassigned__') + ':' + String(v.vlanId);
                if (seen.has(key)) {
                    showToast('Reconciliation blocked: duplicate VLAN numbers within a domain.', 'error');
                    return;
                }
                seen.add(key);
            }
            if (!window.confirm('Assign IP Address Block ownership to ' + candidates.length +
                ' uniquely matched legacy VLAN records? Unassigned records will stay unchanged.')) return;
            const before = JSON.stringify(appState);
            appState.vlans = proposed;
            if (!nextIpamBridge || !await nextIpamBridge.saveSubnet(before, 'VLAN ownership updated.')) {
                appState = JSON.parse(before);
                showToast('Reconciliation was not saved; inventory restored.', 'error');
                return;
            }
            renderContent();
        }

        // v1.2.0 migration primitive: operate on a copy, never mutate a supplied backup.
        // Called by state normalisation before rack-placement validation.
        function migrateLegacyRackLocation(devices) {
            if (!Array.isArray(devices)) throw new Error('Devices must be an array.');
            return devices.map(device => {
                if (!isPlainObject(device)) throw new Error('Invalid device in migration.');
                const copy = {...device};
                if (copy.location === 'Racked' && (copy.mountType === 'Rack Mounted' || copy.rackId)) {
                    copy.location = 'Unknown';
                }
                return copy;
            });
        }

        // Canonicalise known historical rack accessory identifiers on detached data.
        // Shared by startup loading and backup import; unknown types remain invalid.
        function normaliseLegacyRackAccessoryTypes(accessories) {
            const legacy={fan:'fan_tray',pdu:'pdu_horizontal',vent:'ventilation'};
            return accessories.map(a=>{
                if (!a || typeof a!=='object' || !Object.prototype.hasOwnProperty.call(legacy,a.type)) return a;
                return {...a,type:legacy[a.type]};
            });
        }
        function normaliseState(raw) {
            if (!isPlainObject(raw)) throw new Error('Imported data must be a JSON object.');

            const requiredArrays = ['subnets', 'vlans', 'racks', 'devices'];
            for (const key of requiredArrays) {
                if (!Array.isArray(raw[key])) {
                    throw new Error(`Imported data is missing a valid ${key} array.`);
                }
            }
            if (!isPlainObject(raw.ipAllocations)) {
                throw new Error('Imported data is missing a valid ipAllocations object.');
            }

            const state = {
                ...cloneDefaultData(),
                ...raw,
                stateVersion: STATE_VERSION,
                subnets: raw.subnets,
                vlans: raw.vlans,
                racks: raw.racks,
                devices: migrateLegacyRackLocation(raw.devices),
                rackAccessories: Array.isArray(raw.rackAccessories) ? normaliseLegacyRackAccessoryTypes(raw.rackAccessories) : [],
                deviceTypes: Array.isArray(raw.deviceTypes) ? raw.deviceTypes : cloneDefaultData().deviceTypes,
                deviceTypeGraphics: isPlainObject(raw.deviceTypeGraphics) ? raw.deviceTypeGraphics : {},
                deviceLocations: Array.isArray(raw.deviceLocations) ? raw.deviceLocations : cloneDefaultData().deviceLocations,
                ipAllocations: raw.ipAllocations
            };

            // Migrate older saves which did not have managed type/location lists.
            const discoveredTypes = state.devices.map(d => String(d.type || '').trim()).filter(Boolean);
            const discoveredLocations = state.devices.map(d => String(d.location || '').trim()).filter(Boolean);
            state.deviceTypes = [...new Set([...state.deviceTypes, ...discoveredTypes, 'Layer 3 Switch', 'Wireless LAN Controller'])];
            state.deviceLocations = [...new Set([...state.deviceLocations, ...discoveredLocations, 'Unknown'])].filter(location => location !== 'Blank' && location !== 'Racked');

            // Blank is no longer a valid managed location.
            state.devices.forEach(device => {
                if (device.location === 'Blank' || !device.location) device.location = 'Unknown';
            });

            for (const subnet of state.subnets) {
                // Hierarchical address blocks are validated by the shared hierarchy validators below.
                // Do not apply legacy /23–/30, VLAN and gateway requirements to them.
                if (isPlainObject(subnet) && subnet.kind && subnet.kind !== 'network') continue;
                if (!isPlainObject(subnet) || !subnet.id || !subnet.name || !isValidCidr24(subnet.cidr)) {
                    throw new Error('Every subnet must have an id, name and valid /23–/30 CIDR.');
                }
                if (subnet.vlan!=null&&subnet.vlan!==''&&(!Number.isInteger(Number(subnet.vlan)) || Number(subnet.vlan) < 1 || Number(subnet.vlan) > 4094)) {
                    throw new Error(`Invalid VLAN ID on subnet ${subnet.name}.`);
                }
                if(subnet.purpose==='VPN'&&!subnet.gateway)continue;
                if (!isValidIpv4(subnet.gateway)) {
                    throw new Error(`Invalid gateway on subnet ${subnet.name}.`);
                }
                if (!isUsableHostAddressInSubnet(subnet.gateway, subnet.cidr)) {
                    throw new Error(`Gateway ${subnet.gateway} does not belong to subnet ${subnet.cidr}.`);
                }
            }

            // Shared hierarchy rules also preserve the old flat-subnet overlap checks.
            const hierarchyErrors = hierarchyValidate(state.subnets);
            if (hierarchyErrors.length) throw new Error(hierarchyErrors[0]);
            const typeErrors = hierarchyValidateTypes(state.subnets);
            if (typeErrors.length) throw new Error(typeErrors[0]);

            const vlanIds = new Set();
            const vlanNumbers = new Set();
            for (const vlan of state.vlans) {
                if (!isPlainObject(vlan) || !vlan.id || !vlan.name) throw new Error('Every VLAN must have an id and name.');
                const vlanNumber = Number(vlan.vlanId);
                if (!Number.isInteger(vlanNumber) || vlanNumber < 1 || vlanNumber > 4094) throw new Error(`Invalid VLAN ID: ${vlan.vlanId}.`);
                if (vlanIds.has(vlan.id)) throw new Error(`Duplicate VLAN ID: ${vlan.id}.`);
                const vlanDomain = vlan.parentId || '__unassigned__';
                const vlanKey = JSON.stringify([vlanDomain, vlanNumber]);
                if (vlanNumbers.has(vlanKey)) throw new Error(`Duplicate VLAN number ${vlanNumber} within the same IP Address Block.`);
                vlanIds.add(vlan.id);
                vlanNumbers.add(vlanKey);
            }

            const deviceIds = new Set();
            for (const device of state.devices) {
                if (!isPlainObject(device) || !device.id || !device.name) throw new Error('Every device must have an id and name.');
                if (deviceIds.has(device.id)) throw new Error(`Duplicate device ID: ${device.id}.`);
                deviceIds.add(device.id);
                if (!getRecognisedDeviceMountTypes(device.type).includes(device.mountType || (device.rackId ? 'Rack Mounted' : 'Desktop'))) throw new Error(`Device ${device.name} has an incompatible mounting type for ${device.type}.`);
                if (device.primaryIp && !isValidIpv4(device.primaryIp)) throw new Error(`Invalid primary IP on device ${device.name}.`);
                const shelfError=getDeviceShelfAssociationError(device,state);
                if(shelfError)throw new Error(shelfError);
                if(device.rackShelfAccessoryId)continue;
                if (device.mountType === 'Rack Mounted' || device.rackId) {
                    if (device.mountType !== 'Rack Mounted') throw new Error(`Device ${device.name} has a rack assignment but is not Rack Mounted.`);
                    if (!device.location || device.location === 'Racked') throw new Error(`Rack Mounted device ${device.name} needs a physical location or Unknown.`);
                    if (!device.rackId || !state.racks.some(r => r.id === device.rackId)) throw new Error(`Device ${device.name} references a missing rack.`);
                    if (!['front','rear'].includes(device.face || 'front')) throw new Error(`Invalid rack face on device ${device.name}.`);
                    if (!Number.isInteger(Number(device.rackUStart)) || !Number.isInteger(Number(device.rackUHeight)) || Number(device.rackUStart) < 1 || Number(device.rackUHeight) < 1) throw new Error(`Invalid rack position on device ${device.name}.`);
                    const expectedEnd = Number(device.rackUStart) + Number(device.rackUHeight) - 1;
                    if (Number(device.rackUEnd) !== expectedEnd) throw new Error(`Rack end U is inconsistent for device ${device.name}.`);
                    const rack = state.racks.find(r => r.id === device.rackId);
                    if (expectedEnd > Number(rack.heightU)) throw new Error(`Device ${device.name} exceeds rack capacity.`);
                } else if (device.location === 'Racked') {
                    throw new Error(`Racked device ${device.name} is missing a rack assignment.`);
                }
            }

            const primaryIps = new Set();
            for (const device of state.devices) {
                if (device.primaryIp) {
                    if (primaryIps.has(device.primaryIp)) throw new Error(`Duplicate primary IP: ${device.primaryIp}.`);
                    primaryIps.add(device.primaryIp);
                    const owningSubnet = state.subnets.find(subnet => ipBelongsToSubnet(device.primaryIp, subnet.cidr));
                    if (!owningSubnet) throw new Error(`Primary IP ${device.primaryIp} on device ${device.name} does not belong to an existing subnet.`);
                }
            }

            for (const [ip, allocation] of Object.entries(state.ipAllocations)) {
                if (!isValidIpv4(ip) || !isPlainObject(allocation)) {
                    throw new Error(`Invalid IP allocation record: ${ip}.`);
                }
                if (!state.subnets.some(subnet => ipBelongsToSubnet(ip, subnet.cidr))) {
                    throw new Error(`IP allocation ${ip} does not belong to any configured subnet.`);
                }
                if (allocation.deviceId && !deviceIds.has(allocation.deviceId)) {
                    throw new Error(`IP ${ip} references missing device ${allocation.deviceId}.`);
                }
            }

            // Repair recoverable device/IPAM drift instead of rejecting an otherwise usable state.
            // The device record is the source of truth for its primary IP and hostname. IPAM notes belong to the address.
            for (const device of state.devices) {
                if (!device.primaryIp) continue;

                const existing = state.ipAllocations[device.primaryIp];
                if (!existing || !isPlainObject(existing)) {
                    state.ipAllocations[device.primaryIp] = {
                        status: 'Assigned',
                        deviceId: device.id,
                        hostname: device.name || '',
                        notes: ''
                    };
                    continue;
                }

                // Repair a stale/missing device link while preserving allocation-specific fields.
                if (existing.deviceId !== device.id || existing.status !== (device.ipReserved ? 'Reserved' : 'Assigned')) {
                    existing.deviceId = device.id;
                    existing.status = device.ipReserved ? 'Reserved' : 'Assigned';
                }
                existing.hostname = device.name || '';
                // Preserve existing address-specific IPAM notes during normalisation.
            }

            // A device primary IP cannot be simultaneously assigned to another device.
            for (const [ip, allocation] of Object.entries(state.ipAllocations)) {
                if (allocation.deviceId) {
                    const owner = state.devices.find(d => d.id === allocation.deviceId);
                    if (!owner) {
                        allocation.deviceId = '';
                        if (allocation.status === 'Assigned') allocation.status = 'Available';
                    }
                    if (owner && owner.primaryIp !== ip) {
                        allocation.deviceId = '';
                        if (allocation.status === 'Assigned') allocation.status = 'Available';
                    }
                }
            }

            return state;
        }

        function validateApplicationState() {
            const errors = [];
            // Apply the same hierarchy rules during live integrity checks as on import.
            errors.push(...hierarchyValidate(appState.subnets));
            errors.push(...hierarchyValidateTypes(appState.subnets));
            const subnetIds = new Set();
            const vlanNumbers = new Set();
            const deviceIds = new Set();
            const primaryIps = new Map();

            appState.subnets.forEach(subnet => {
                if (!subnet.id || subnetIds.has(subnet.id)) errors.push(`Duplicate or missing subnet ID: ${subnet.id || '(missing)'}`);
                subnetIds.add(subnet.id);
                // Containers, reservations and loopbacks have no VLAN/gateway.
                // Their CIDR and type rules are checked by hierarchyValidateTypes above.
                if (subnet.kind && subnet.kind !== 'network') return;
                if (!isValidCidr24(subnet.cidr)) errors.push(`Invalid subnet CIDR: ${subnet.cidr}`);
                if (!(subnet.purpose==='VPN'&&!subnet.gateway)&&(!isValidIpv4(subnet.gateway) || !ipBelongsToSubnet(subnet.gateway, subnet.cidr))) errors.push(`Invalid gateway for subnet ${subnet.name || subnet.cidr}.`);
                if(subnet.vlan==null||subnet.vlan==='')return;
                const vlan = Number(subnet.vlan);
                const domain = subnet.parentId || '__unassigned__';
                const vlanKey = JSON.stringify([domain, vlan]);
                if (!Number.isInteger(vlan) || vlan < 1 || vlan > 4094 || vlanNumbers.has(vlanKey)) errors.push(`Invalid or duplicate VLAN ${subnet.vlan} in this IP Address Block.`);
                vlanNumbers.add(vlanKey);
            });

            appState.devices.forEach(device => {
                if (!device.id || deviceIds.has(device.id)) errors.push(`Duplicate or missing device ID: ${device.id || '(missing)'}`);
                deviceIds.add(device.id);
                if (!getRecognisedDeviceMountTypes(device.type).includes(device.mountType || (device.rackId ? 'Rack Mounted' : 'Desktop'))) errors.push(`Device ${device.name} has an incompatible mounting type for ${device.type}.`);
                if (device.location === 'Blank') errors.push(`Device ${device.name} still uses the retired Blank location.`);
                if (device.primaryIp) {
                    if (primaryIps.has(device.primaryIp)) errors.push(`Duplicate primary IP: ${device.primaryIp}.`);
                    primaryIps.set(device.primaryIp, device.id);
                    const subnet = appState.subnets.find(s => ipBelongsToSubnet(device.primaryIp, s.cidr));
                    if (!subnet) errors.push(`Primary IP ${device.primaryIp} on ${device.name} has no subnet.`);
                    const allocation = appState.ipAllocations[device.primaryIp];
                    if (!allocation || allocation.deviceId !== device.id || allocation.status !== (device.ipReserved ? 'Reserved' : 'Assigned')) errors.push(`IPAM is out of sync for ${device.name} (${device.primaryIp}).`);
                }
                const shelfError=getDeviceShelfAssociationError(device);
                if(shelfError)errors.push(shelfError);
                if(device.rackShelfAccessoryId)return;
                if (device.rackId) {
                    const rack = appState.racks.find(r => r.id === device.rackId);
                    if (!rack) errors.push(`Device ${device.name} references a missing rack.`);
                    if (device.mountType !== 'Rack Mounted') errors.push(`Rack assignment is inconsistent for ${device.name}.`);
                    if (Number(device.rackUEnd) !== Number(device.rackUStart) + Number(device.rackUHeight) - 1) errors.push(`Rack U range is inconsistent for ${device.name}.`);
                }
            });

            Object.entries(appState.ipAllocations).forEach(([ip, allocation]) => {
                if (!appState.subnets.some(s => ipBelongsToSubnet(ip, s.cidr))) errors.push(`IPAM allocation ${ip} is outside all configured subnets.`);
                if (allocation?.deviceId) {
                    const device = getDeviceById(allocation.deviceId);
                    if (!device) errors.push(`IPAM allocation ${ip} references a missing device.`);
                    else if (device.primaryIp !== ip || allocation.status !== (device.ipReserved ? 'Reserved' : 'Assigned')) errors.push(`IPAM/device mismatch for ${ip}.`);
                }
            });

            return errors;
        }

        // Caffoot Lite v1 uses its own browser storage namespace.
        const STORAGE_KEY = 'caffoot_state';

        // preserve unreadable stored data. Never overwrite it on startup.
        let storageRecoveryFailure = null;
        function loadStoredState() { return cloneDefaultData(); }

        let appState = loadStoredState();
        // The server supplies the authoritative state after authentication.
        // Browser recovery of old inventory is not applicable in the server application.
        // Do not write on startup: it could overwrite unreadable data or mask an integrity problem.
        function showStorageRecoveryBanner() {
            if (!storageRecoveryFailure) return;
            const banner = document.createElement('section');
            banner.id = 'storage-recovery-banner';
            banner.setAttribute('role','alert');
            banner.style.cssText = 'position:fixed;z-index:99999;left:16px;right:16px;top:16px;max-width:900px;margin:auto;padding:18px;background:#7f1d1d;color:white;border:2px solid #fecaca;border-radius:14px;box-shadow:0 12px 35px #0006;font:14px system-ui';
            const heading = document.createElement('strong');
            heading.textContent = 'Caffoot Lite recovery mode — saved inventory was not loaded';
            const message = document.createElement('p');
            message.style.margin = '8px 0';
            message.textContent = 'Your existing browser data has NOT been overwritten. Changes are disabled until you recover or explicitly reset it. ' + storageRecoveryFailure.reason;
            const download = document.createElement('button');
            download.textContent = 'Download original stored data';
            download.disabled = storageRecoveryFailure.raw === null;
            download.style.cssText = 'background:white;color:#7f1d1d;padding:9px 12px;border-radius:8px;margin-right:8px;font-weight:700';
            download.onclick = () => {
                const blob = new Blob([storageRecoveryFailure.raw], {type:'text/plain'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href=url; a.download='caffoot_lite_unreadable_recovery.txt'; a.click();
                setTimeout(()=>URL.revokeObjectURL(url),1000);
            };
            const reset = document.createElement('button');
            reset.textContent = 'Reset to empty inventory';
            reset.style.cssText = 'background:#fecaca;color:#450a0a;padding:9px 12px;border-radius:8px;font-weight:700';
            reset.onclick = () => {
                if (!confirm('This replaces the unreadable stored inventory with an empty Caffoot Lite inventory. Download the original data first. Continue?')) return;
                if (!confirm('Final confirmation: overwrite the existing saved inventory?')) return;
                try {
                    const emptySnapshot = JSON.stringify(cloneDefaultData());
                    localStorage.setItem(STORAGE_KEY, emptySnapshot);
                    if (localStorage.getItem(STORAGE_KEY) !== emptySnapshot) {
                        throw new Error('Browser storage did not retain the empty inventory. Your existing data has not been confirmed as replaced.');
                    }
                    location.reload();
                } catch (error) { alert('Reset failed: '+String(error.message||error)); }
            };
            banner.append(heading,message,download,reset);
            document.body.appendChild(banner);
        }
        let currentTab = 'dashboard';
        let selectedSubnetId = appState.subnets[0]?.id || '';
        let selectedRackId = appState.racks[0]?.id || '';
        let activeRackFace = 'front';
        let draggedRackDeviceId = null;
        let draggedRackAccessoryId = null;
        let draggedVerticalRackAccessoryId = null;
        let activeRackTab = 'view';
        let v13RackSection = 'overview';
        let v13RackDetailOpen = false;
        let v13RackOverviewTab = 'capacity';
        let selectedRackAccessoryType = 'blank';
        // temporarily preserve the device form while creating a missing subnet.
        let deviceFormDraft = null;
        let ipViewRange = '1-32';
        let ipAddressGridPage = 0;

        // Keep the existing caffoot_dark preference compatible with previous releases.
        // Only the explicit 'system' setting follows OS changes automatically.
        const caffootThemeMedia = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-color-scheme: dark)') : null;
        function caffootThemePreference() {
            let value = null;
            try { value = localStorage.getItem('caffoot_theme_preference'); } catch (_) {}
            if (value === 'light' || value === 'dark' || value === 'system') return value;
            try { return localStorage.getItem('caffoot_dark') === 'true' ? 'dark' : 'light'; }
            catch (_) { return 'light'; }
        }
        function caffootApplyTheme() {
            const preference = caffootThemePreference();
            const isDark = preference === 'dark' || (preference === 'system' && !!caffootThemeMedia?.matches);
            document.documentElement.classList.toggle('dark', isDark);
            // A System preference can change while a searchable modal is open.
            // Read the native control again so neither theme freezes inline colours.
            for (const select of document.querySelectorAll('select.caffoot-search-native')) {
                const trigger=select.nextElementSibling?.querySelector('.caffoot-search-trigger');
                if (!trigger) continue;
                const style=getComputedStyle(select);
                Object.assign(trigger.style,{color:style.color,backgroundColor:style.backgroundColor,borderColor:style.borderColor});
            }
            document.getElementById('theme-icon')?.setAttribute('class', isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon');
        }
        function caffootSetTheme(preference) {
            if (!['light','dark','system'].includes(preference)) return;
            try {
                localStorage.setItem('caffoot_theme_preference', preference);
                localStorage.setItem('caffoot_dark', String(preference === 'dark' || (preference === 'system' && !!caffootThemeMedia?.matches)));
            } catch (error) { console.warn('Theme preference could not be saved:', error); }
            caffootApplyTheme();
            renderContent();
        }
        caffootApplyTheme();
        if (caffootThemeMedia) {
            const onSystemThemeChange = () => {
                if (caffootThemePreference() === 'system') {
                    caffootApplyTheme();
                    try { localStorage.setItem('caffoot_dark', String(!!caffootThemeMedia.matches)); } catch (_) {}
                }
            };
            if (typeof caffootThemeMedia.addEventListener === 'function') caffootThemeMedia.addEventListener('change', onSystemThemeChange);
            else if (typeof caffootThemeMedia.addListener === 'function') caffootThemeMedia.addListener(onSystemThemeChange);
        }
        function toggleDarkMode() {
            caffootSetTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');
        }

        // a compact, local, best-effort audit trail.
        // Audit records are metadata only; backup JSON still contains the complete inventory.
        const AUDIT_KEY = 'caffoot_audit_v1';
        function readAuditHistory() { return []; }
        let auditHistory = readAuditHistory();
        let auditBaseline = JSON.stringify(appState);
        let nextAuditReason = '';
        function auditChanges(before, after) {
            const changes = [];
            const categories = [
                ['devices','Device','name'],
                ['subnets','Subnet','cidr'],
                ['racks','Rack','name'],
                ['vlans','VLAN','name']
            ];
            for (const [key,kind,labelKey] of categories) {
                const left = new Map((Array.isArray(before[key]) ? before[key] : []).map(x=>[String(x.id),x]));
                const right = new Map((Array.isArray(after[key]) ? after[key] : []).map(x=>[String(x.id),x]));
                for (const [id,item] of right) {
                    const old=left.get(id), label=String(item[labelKey] || id).slice(0,100);
                    if (!old) changes.push({action:'Created',kind,label,fields:[]});
                    else if (JSON.stringify(old)!==JSON.stringify(item)) {
                        const fields=[...new Set([...Object.keys(old),...Object.keys(item)])]
                            .filter(k=>k!=='id' && JSON.stringify(old[k])!==JSON.stringify(item[k]));
                        changes.push({action:'Updated',kind,label,fields:fields.slice(0,16)});
                    }
                }
                for (const [id,item] of left) if (!right.has(id))
                    changes.push({action:'Deleted',kind,label:String(item[labelKey] || id).slice(0,100),fields:[]});
            }
            const oldIp=before.ipAllocations || {}, newIp=after.ipAllocations || {};
            for (const ip of new Set([...Object.keys(oldIp),...Object.keys(newIp)])) {
                if (JSON.stringify(oldIp[ip]) === JSON.stringify(newIp[ip])) continue;
                const action = !(ip in oldIp) ? 'Created' : !(ip in newIp) ? 'Deleted' : 'Updated';
                changes.push({action,kind:'IPAM',label:ip,fields:action==='Updated'
                    ? [...new Set([...Object.keys(oldIp[ip] || {}),...Object.keys(newIp[ip] || {})])]
                        .filter(k=>JSON.stringify(oldIp[ip]?.[k])!==JSON.stringify(newIp[ip]?.[k])).slice(0,16) : []});
            }
            for (const key of ['deviceTypes','deviceLocations']) {
                if (JSON.stringify(before[key])!==JSON.stringify(after[key]))
                    changes.push({action:'Updated',kind:key==='deviceTypes'?'Device types':'Locations',label:'Managed list',fields:[]});
            }
            return changes;
        }
        function recordAudit(before,after,reason) {
            const changes = auditChanges(before,after);
            if (!changes.length && !reason) return;
            const event = {at:new Date().toISOString(), reason:reason || 'Inventory saved',
                changes:changes.slice(0,60), omitted:Math.max(0,changes.length-60)};
            auditHistory.push(event);
            try { localStorage.setItem(AUDIT_KEY,JSON.stringify(auditHistory)); }
            catch (error) { console.warn('Audit history could not be persisted:',error); showToast('Inventory saved, but audit history could not be stored. Export a backup.', 'error'); }
        }
        function restoreAuditAfterRolledBackOperation(previousHistory, previousStoredHistory) {
            auditHistory = previousHistory;
            try {
                if (previousStoredHistory === null) localStorage.removeItem(AUDIT_KEY);
                else localStorage.setItem(AUDIT_KEY, previousStoredHistory);
                if (localStorage.getItem(AUDIT_KEY) !== previousStoredHistory)
                    throw new Error('History rollback verification failed.');
            } catch (error) {
                console.warn('Rolled-back operation history could not be restored:', error);
                showToast('Inventory restored, but local change history may contain an incorrect entry.', 'error');
            }
        }
        function exportAuditHistory() {
            const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),events:auditHistory},null,2)],{type:'application/json'});
            const url=URL.createObjectURL(blob);
            const a=document.createElement('a');
            a.href=url; a.download='caffoot_lite_audit_'+new Date().toISOString().slice(0,10)+'.json';
            document.body.appendChild(a); a.click(); a.remove();
            setTimeout(()=>URL.revokeObjectURL(url),1000);
        }
        const auditMarkup=renderInterfaceTemplate("audit-trail/audit-markup-1",[]);
        let activeAuditTab='activity';
        let selectedAuditAsset='';
        let auditLastFocus=null;
        function auditVisibleRows(){
          const rows=[];
          for(let i=auditHistory.length-1;i>=0;i--){
            const ev=auditHistory[i];
            if(!ev||typeof ev!=='object'||!Array.isArray(ev.changes))continue;
            for(let j=ev.changes.length-1;j>=0;j--){
              const change=ev.changes[j];
              if(!change||typeof change!=='object'||Array.isArray(change))continue;
              const kind=String(change.kind||'Unknown');
              const area=['IPAM','Subnet','VLAN'].includes(kind)?'IPAM':kind==='Rack'?'Racks':
                kind==='Settings'?'Settings':kind==='Account'?'Users':
                ['Authentication','Security'].includes(kind)?'Security':
                ['Device','Device types','Locations'].includes(kind)?'Devices':'Other';
              rows.push({index:rows.length,at:ev.at||'',actor:typeof ev.actor==='string'&&ev.actor.trim()?ev.actor:'Not recorded',
                area,kind,action:String(change.action||'Updated'),label:String(change.label||'Unspecified record'),
                reason:String(ev.reason||'Recorded change'),outcome:String(ev.outcome||'Succeeded'),
                fields:Array.isArray(change.fields)?change.fields.filter(x=>typeof x==='string'):[],
                before:change.before,after:change.after});
            }
          }
          return rows;
        }
        function auditDate(value){
          const d=new Date(value);
          return Number.isNaN(d.getTime())?'Not recorded':d.toISOString().replace('T',' ').slice(0,19);
        }
        function renderAuditHTML() {
          const rows=auditVisibleRows();
          const names=[...new Set(rows.map(r=>r.actor).filter(n=>n!=='Not recorded'))].sort();
          const assets=[...new Map(rows.map(r=>[JSON.stringify([r.kind,r.label]),{kind:r.kind,label:r.label,area:r.area}])).entries()];
          if(!assets.some(([key])=>key===selectedAuditAsset))selectedAuditAsset=assets[0]?.[0]||'';
          const tr=rows.map(r=>'<tr data-audit-index="'+r.index+'" data-area="'+escapeHtml(r.area)+'" data-verb="'+escapeHtml(r.action)+'" data-actor="'+escapeHtml(r.actor)+'" data-search="'+escapeHtml([r.actor,r.area,r.action,r.kind,r.label,r.reason].join(' ').toLowerCase())+'">' +
            '<td><div class="time">'+escapeHtml(auditDate(r.at))+'</div><div class="secondary">UTC</div></td>' +
            '<td><strong>'+escapeHtml(r.actor)+'</strong></td>' +
            '<td><div class="event-name">'+escapeHtml(r.kind+' '+r.action.toLowerCase())+'</div><div class="event-note">'+escapeHtml(r.reason)+'</div></td>' +
            '<td><span class="act-badge '+escapeHtml(r.action.toLowerCase())+'">'+escapeHtml(r.action)+'</span></td>' +
            '<td><div class="subject">'+escapeHtml(r.label)+'</div><div class="secondary">'+escapeHtml(r.area)+'</div></td>' +
            '<td><button class="audit-row-button" type="button" data-action="audit-view-detail" data-index="'+r.index+'">View Details</button></td></tr>').join('')||
            '<tr><td colspan="6" class="audit-empty">No authorised audit events are recorded yet.</td></tr>';
          const list=assets.map(([key,asset])=>{
            const count=rows.filter(r=>r.kind===asset.kind&&r.label===asset.label).length;
            return '<button class="asset-item '+(key===selectedAuditAsset?'selected':'')+'" type="button" data-action="audit-select-asset" data-key="'+escapeHtml(key)+'"><span><b>'+escapeHtml(asset.label)+'</b><small>'+escapeHtml(asset.area)+' · Saved history</small></span><span class="num">'+count+'</span></button>';
          }).join('')||'<p class="audit-empty">No authorised records to display.</p>';
          const chosen=assets.find(([key])=>key===selectedAuditAsset)?.[1];
          const timeline=chosen?rows.filter(r=>r.kind===chosen.kind&&r.label===chosen.label):[];
          const timelineHtml=timeline.length?'<h3>'+escapeHtml(chosen.label)+'</h3><p class="subtitle">'+timeline.length+' saved changes</p>' +
            '<div class="timeline-list">'+timeline.map(r=>'<div class="timeline-entry"><strong>'+escapeHtml(r.kind+' '+r.action.toLowerCase())+'</strong><p>'+escapeHtml(r.actor)+' · '+escapeHtml(auditDate(r.at))+' UTC</p><button type="button" class="audit-row-button" data-action="audit-view-detail" data-index="'+r.index+'">View event details</button></div>').join('')+'</div>':
            '<p class="audit-empty">Select a record to view its history.</p>';
          return auditMarkup
            .replace('<!--AUDIT_ACTORS-->',names.map(n=>'<option value="'+escapeHtml(n)+'">'+escapeHtml(n)+'</option>').join(''))
            .replace('<tbody id="activity-results"></tbody>','<tbody id="activity-results">'+tr+'</tbody>')
            .replace('<div class="card asset-list" id="asset-list"></div>','<div class="card asset-list" id="asset-list">'+list+'</div>')
            .replace('<div class="card timeline" id="asset-timeline"></div>','<div class="card timeline" id="asset-timeline">'+timelineHtml+'</div>')
            .replace('id="stat-total">0','id="stat-total">'+rows.length)
            .replace('id="stat-inventory">0','id="stat-inventory">'+rows.filter(r=>['Devices','IPAM','Racks'].includes(r.area)).length)
            .replace('id="stat-security">0','id="stat-security">'+rows.filter(r=>['Users','Security'].includes(r.area)).length)
            .replace('id="stat-actors">0','id="stat-actors">'+names.length)
            .replace('id="result-count">0 saved events','id="result-count">'+rows.length+' saved events');
        }
        function hydrateAudit(container){
          const root=container.querySelector('.audit-screen');if(!root)return;
          root.querySelectorAll('.audit-tab').forEach(b=>{
            const on=b.dataset.tab===activeAuditTab;
            b.classList.toggle('active',on);b.setAttribute('aria-selected',String(on));
          });
          root.querySelectorAll('.audit-pane').forEach(p=>p.hidden=p.id!=='pane-'+activeAuditTab);
        }
        function applyAuditFilters(){
          const root=document.querySelector('#main-content .audit-screen');if(!root)return;
          const q=(root.querySelector('#q')?.value||'').trim().toLowerCase();
          const area=root.querySelector('#area')?.value||'';
          const action=root.querySelector('#action')?.value||'';
          const actor=root.querySelector('#actor')?.value||'';
          let matching=0;
          root.querySelectorAll('#activity-results tr[data-audit-index]').forEach(row=>{
            const show=(!q||row.dataset.search.includes(q))&&(!area||row.dataset.area===area)&&
              (!action||row.dataset.verb===action)&&
              (!actor||(actor==='unknown'?row.dataset.actor==='Not recorded':row.dataset.actor===actor));
            row.hidden=!show;if(show)matching++;
          });
          root.querySelector('#result-count').textContent=matching+' matching events';
        }
        document.addEventListener('input',event=>{
          if(!event.target.closest('#main-content .audit-screen .audit-toolbar'))return;
          applyAuditFilters();
        },true);
        document.addEventListener('change',event=>{
          if(!event.target.closest('#main-content .audit-screen .audit-toolbar'))return;
          applyAuditFilters();
        },true);
        document.addEventListener('input',event=>{
          if(event.target.id!=='asset-search'||!event.target.closest('.audit-screen'))return;
          const q=event.target.value.trim().toLowerCase();
          event.target.closest('.audit-screen').querySelectorAll('.asset-item').forEach(button=>{
            button.hidden=!button.textContent.toLowerCase().includes(q);
          });
        },true);
        document.addEventListener('keydown',event=>{
          if(event.key==='Escape'&&!document.getElementById('audit-detail-layer')?.hidden){
            event.preventDefault();closeAuditDetail();
          }
        },true);
        function closeAuditDetail(){
          const layer=document.getElementById('audit-detail-layer');
          if(layer)layer.hidden=true;
          if(auditLastFocus?.isConnected)auditLastFocus.focus();
          auditLastFocus=null;
        }
        function showAuditDetail(index){
          const row=auditVisibleRows()[index],layer=document.getElementById('audit-detail-layer');
          if(!row||!layer)return;
          auditLastFocus=document.activeElement;
          document.getElementById('audit-detail-title').textContent=row.kind+' '+row.action.toLowerCase();
          document.getElementById('audit-detail-lead').textContent=row.label+' · '+row.area;
          let fields=row.fields.length?'<h3 class="detail-section">Recorded field names</h3><p class="detail-description">'+escapeHtml(row.fields.join(', '))+'</p>':
            '<p class="detail-description">No field-level differences were captured for this event.</p>';
          if(row.before&&row.after&&typeof row.before==='object'&&typeof row.after==='object'){
            const keys=[...new Set([...Object.keys(row.before),...Object.keys(row.after)])].slice(0,30);
            fields=renderInterfaceTemplate("audit-trail/fields-1",[])+
              keys.map(k=>'<div class="diff-row"><b>'+escapeHtml(k)+'</b><span class="before">'+escapeHtml(String(row.before[k]??'Not recorded'))+'</span><span class="after">'+escapeHtml(String(row.after[k]??'Not recorded'))+'</span></div>').join('');
          }
          document.getElementById('audit-detail-body').innerHTML='<div class="detail-meta"><div><small>Performed by</small><b>'+escapeHtml(row.actor)+'</b></div><div><small>When (UTC)</small><b>'+escapeHtml(auditDate(row.at))+'</b></div><div><small>Result</small><b>'+escapeHtml(row.outcome)+'</b></div></div><p class="detail-description">'+escapeHtml(row.reason)+'</p>'+fields;
          layer.hidden=false;
          layer.querySelector('[data-action="audit-close-detail"]').focus();
        }

        let nextDeviceBridge = null;
        let nextDeviceModalClosed = null;
        let nextImportModalClosed = null;
        let nextIpamBridge = null;
        let nextRackBridge = null;
        let nextSettingsBridge = null;
        let nextDeviceCatalogueBridge = null;
        let nextResetBridge = null;
        let nextIntegrityRepairBridge = null;
        let nextRenderUsers = () => '';
        let activeUsersTab = 'overview';
        let nextRenderAccount = () => '';
        let hydrateAccount = () => {};
        let removeAccountPhoto = () => Promise.resolve();
        let activeAccountSection = 'overview';
        let nextImportAllowed = false;
        function saveState() { showToast('This inventory operation is not yet connected to SQLite.', 'error'); return false; }

        // Inventory data-integrity helpers
        function getDeviceById(deviceId) {
            return appState.devices.find(d => d.id === deviceId);
        }

        function findDeviceUsingIp(ip, excludeDeviceId = null) {
            if (!ip) return null;
            return appState.devices.find(d => d.primaryIp === ip && d.id !== excludeDeviceId) || null;
        }

        function setDevicePrimaryIp(device, newIp) {
            const oldIp = device.primaryIp || '';
            const trimmedIp = (newIp || '').trim();

            if (trimmedIp && findDeviceUsingIp(trimmedIp, device.id)) {
                throw new Error(`IP address ${trimmedIp} is already assigned to another device.`);
            }
            // refuse to take an IPAM address owned by a different device.
            // Validate before releasing the old address so a failed edit leaves it intact.
            if (trimmedIp) {
                const gatewaySubnet = findSubnetUsingGatewayAddress(trimmedIp);
                if (gatewaySubnet && trimmedIp !== oldIp && !['Firewall', 'Router', 'Layer 3 Switch'].includes(device.type)) {
                    throw new Error(`Gateway ${trimmedIp} may only be assigned to a Firewall, Router or Layer 3 Switch.`);
                }
                if (!appState.subnets.some(subnet => ipBelongsToSubnet(trimmedIp, subnet.cidr))) {
                    throw new Error(`IP address ${trimmedIp} is not in a configured subnet.`);
                }
                const allocation = appState.ipAllocations[trimmedIp];
                if (allocation?.deviceId && allocation.deviceId !== device.id) {
                    throw new Error(`IP address ${trimmedIp} is linked to another device in IPAM.`);
                }
                if (allocation?.reservedForDeviceId && allocation.reservedForDeviceId !== device.id) {
                    throw new Error(`IP address ${trimmedIp} is reserved for another device.`);
                }
                if (trimmedIp !== oldIp && allocation && !allocation.deviceId &&
                    ['Reserved', 'Assigned'].includes(allocation.status) &&
                    allocation.reservedForDeviceId !== device.id) {
                    throw new Error(`IP address ${trimmedIp} is already ${allocation.status.toLowerCase()} in IPAM.`);
                }
            }

            if (oldIp && appState.ipAllocations[oldIp]?.deviceId === device.id) {
                const oldAllocation = appState.ipAllocations[oldIp];
                // Release ownership without discarding address-specific IPAM information.
                appState.ipAllocations[oldIp] = { ...oldAllocation, status: 'Available', deviceId: '' };
            }

            device.primaryIp = trimmedIp;

            if (trimmedIp) {
                const existing = appState.ipAllocations[trimmedIp] || {};
                appState.ipAllocations[trimmedIp] = {
                    ...existing,
                    status: device.ipReserved ? 'Reserved' : 'Assigned',
                    deviceId: device.id,
                    hostname: device.name || existing.hostname || '',
                    notes: existing.notes || ''
                };
            }
        }

        // Keep the IPAM record in sync when any device details change.
        // The device remains the source of truth for its primary IP allocation.
        function syncDeviceIpamRecord(device) {
            if (!device?.primaryIp) return;

            const existing = appState.ipAllocations[device.primaryIp] || {};
            appState.ipAllocations[device.primaryIp] = {
                ...existing,
                status: device.ipReserved ? 'Reserved' : 'Assigned',
                deviceId: device.id,
                hostname: device.name || '',
                notes: existing.notes || ''
            };
        }

        function isRackMountedDevice(device) {
            return device?.mountType === 'Rack Mounted' || (!!device?.rackId && !device?.mountType);
        }
        function getDeviceShelfAssociationError(device, state = appState) {
            const id=device.rackShelfAccessoryId, hasId=id!==undefined&&id!==null&&id!=='';
            if(!hasId && !(device.mountType==='Tabletop / Shelf Mounted'&&device.rackId))return '';
            if(typeof id!=='string'||!id)return 'Select an existing Rack Shelf, or clear the optional rack.';
            if(device.mountType!=='Tabletop / Shelf Mounted'||device.isVirtual===true||device.type==='Server - Virtual')return 'Only physical Tabletop / Shelf Mounted devices can use a Rack Shelf.';
            const shelf=(state.rackAccessories||[]).find(a=>a.id===id);
            if(!shelf||shelf.type!=='shelf')return 'The selected Rack Shelf is missing or no longer a shelf. Review the selection.';
            if(!device.rackId||shelf.rackId!==device.rackId)return 'The selected Rack Shelf must belong to the selected rack.';
            if(!state.racks.some(r=>r.id===device.rackId))return 'The selected rack no longer exists.';
            if(['face','rackUStart','rackUEnd','rackUHeight'].some(k=>device[k]!==undefined&&device[k]!==null&&device[k]!==''))return 'A shelf-mounted device must not have its own rack U or face.';
            return '';
        }
        function getRackShelfLocation(device) {
            const shelf=(appState.rackAccessories||[]).find(a=>a.id===device.rackShelfAccessoryId&&a.type==='shelf'&&a.rackId===device.rackId);
            const rack=appState.racks.find(r=>r.id===device.rackId);
            return shelf&&rack?`${rack.name} · Shelf U${shelf.startU} (${shelf.face==='rear'?'Rear':'Front'})`:'Recorded shelf unavailable — review access or selection';
        }
        function initialiseDeviceShelfFields(form) {
            const card=form.querySelector('#device-form-mounting-options');
            const group=document.createElement('div');group.className='device-review-form-grid device-editor-shelf-placement';group.hidden=true;
            group.innerHTML='<div class="device-review-field"><label for="dev-shelf-rack">Rack (Optional)</label><select id="dev-shelf-rack"><option value="">No Rack Association</option></select></div>'
                +'<div class="device-review-field" data-device-shelf-field><label for="dev-rack-shelf">Rack Shelf <span class="required-mark">*</span></label><select id="dev-rack-shelf"></select><small>The shelf owns its rack U position; this device uses no additional U.</small><div class="device-review-catalogue-actions"><button type="button" class="device-review-smallbtn" data-action="create-rack-shelf-from-device">+ Add Rack Shelf</button></div></div>';
            card.querySelector(':scope > .device-review-hint').before(group);
            const rack=group.querySelector('#dev-shelf-rack');
            for(const r of appState.racks)rack.add(new Option(r.name,r.id));
            const recorded=form.querySelector('#dev-rack-id')?.value||'';
            if(recorded&&![...rack.options].some(o=>o.value===recorded))rack.add(new Option('Recorded rack unavailable — retained',recorded));
            rack.value=recorded;
            const shelf=group.querySelector('#dev-rack-shelf');shelf.dataset.recordedShelf=form.dataset.rackShelfAccessoryId||'';
            rack.addEventListener('change',()=>{shelf.dataset.recordedShelf='';refreshDeviceShelfFields();defaultDeviceLocationFromRack(rack.value);});
            shelf.addEventListener('change',()=>shelf.dataset.recordedShelf=shelf.value);
            refreshDeviceShelfFields();
        }
        function refreshDeviceShelfFields(selectedId) {
            const form=document.getElementById('device-editor-form');
            const group=form?.querySelector('.device-editor-shelf-placement');if(!group)return;
            const active=!isVirtualDeviceForm()&&document.getElementById('dev-mount-type')?.value==='Tabletop / Shelf Mounted';
            group.hidden=!active;
            const rack=group.querySelector('#dev-shelf-rack'),shelf=group.querySelector('#dev-rack-shelf');
            const chosen=selectedId??shelf.dataset.recordedShelf??'';
            shelf.replaceChildren(new Option('Select a Rack Shelf...',''));
            for(const a of appState.rackAccessories||[])if(a.type==='shelf'&&a.rackId===rack.value)shelf.add(new Option(`${a.name||'Rack Shelf'} · U${a.startU} (${a.face==='rear'?'Rear':'Front'})`,a.id));
            if(chosen&&![...shelf.options].some(o=>o.value===chosen))shelf.add(new Option('Recorded shelf unavailable — review',chosen));
            shelf.value=chosen;shelf.dataset.recordedShelf=chosen;
            group.querySelector('[data-device-shelf-field]').hidden=!rack.value;
            const permitted=!!nextRackBridge?.canEdit();
            rack.disabled=!active||!permitted;shelf.disabled=!active||!rack.value||!permitted;
            shelf.required=active&&!!rack.value;
            const add=group.querySelector('[data-action="create-rack-shelf-from-device"]');add.disabled=!permitted;add.hidden=!permitted;
        }
        let rackShelfReturnContext = null;
        function openRackShelfCreation(rackId, onReturn) {
            if(rackShelfReturnContext||!nextRackBridge?.canEdit())return showToast('Racks edit permission required.','error');
            if(!appState.racks.some(r=>r.id===rackId))return showToast('The selected rack is no longer available.','error');
            const content=document.getElementById('modal-content'),container=document.getElementById('modal-container');
            const context={fragment:document.createDocumentFragment(),contentClass:content.className,containerClass:container.className,
                heading:content.getAttribute('aria-labelledby'),focus:document.activeElement,previousType:selectedRackAccessoryType,previousFace:activeRackFace,onReturn};
            // Retain the actual editor nodes and its existing reservation, not a reconstructed partial form.
            while(content.firstChild)context.fragment.append(content.firstChild);
            rackShelfReturnContext=context;
            content.classList.remove('device-review-container');container.classList.remove('device-review-overlay');container.classList.add('rack-modal-shade');
            selectedRackAccessoryType='shelf';openRackAccessoryEditor(rackId,1);
            const type=content.querySelector('#rack-accessory-form [name="type"]');if(type)type.disabled=true;
            content.querySelector('[name="name"]')?.focus();
        }
        function returnFromRackShelfCreation(savedShelf=null) {
            const context=rackShelfReturnContext;if(!context)return;
            rackShelfReturnContext=null;
            const content=document.getElementById('modal-content'),container=document.getElementById('modal-container');
            content.replaceChildren(context.fragment);content.className=context.contentClass;container.className=context.containerClass;
            if(context.heading)content.setAttribute('aria-labelledby',context.heading);else content.removeAttribute('aria-labelledby');
            selectedRackAccessoryType=context.previousType;activeRackFace=context.previousFace;
            context.onReturn(savedShelf);
            if(context.focus?.isConnected)context.focus.focus({preventScroll:true});
        }
        function createRackShelfFromDevice() {
            const rackId=document.getElementById('dev-shelf-rack')?.value;
            if(!rackId)return showDeviceEditorFeedback('Choose an optional rack before adding a shelf.','dev-shelf-rack');
            const draft=captureDeviceFormDraft();
            if(!draft)return showDeviceEditorFeedback('Unable to preserve the device form.');
            openRackShelfCreation(rackId,shelf=>refreshDeviceShelfFields(shelf?.id));
        }
        async function openRackShelfRemovalReview(id) {
            let review;
            try{review=await nextRackBridge.reviewShelf(id);}catch(error){return showToast(error.message,'error');}
            if(!review.devices.length)return requestRackAccessoryDeletion(id);
            openModal(renderInterfaceTemplate("racks/shelf-removal-review-1",[escapeHtml(review.shelf.name||'Rack Shelf')]));
            const form=document.getElementById('rack-shelf-removal-form'),rows=form.querySelector('[data-shelf-removal-devices]'),feedback=form.querySelector('[role="alert"]');
            const options=()=>'<option value="">Choose An Action...</option><option value="retire">Retired — Clear Active Rack And Shelf</option>'+(appState.rackAccessories||[]).filter(a=>a.type==='shelf'&&a.id!==id).map(a=>`<option value="shelf:${escapeHtml(a.id)}">Reassign: ${escapeHtml(getRackShelfLocation({rackId:a.rackId,rackShelfAccessoryId:a.id}))}</option>`).join('');
            for(const d of review.devices){
                const row=document.createElement('div');row.className='rack-form-grid';
                row.innerHTML=`<label class="rack-field">${escapeHtml(d.name)}<select required data-shelf-device-choice="${escapeHtml(d.id)}">${options()}</select></label><label class="rack-field">Rack For Replacement Shelf<select data-shelf-target-rack>${appState.racks.map(r=>`<option value="${escapeHtml(r.id)}" ${r.id===review.shelf.rackId?'selected':''}>${escapeHtml(r.name)}</option>`).join('')}</select></label><div class="rack-form-actions"><button type="button" class="btn btn-outline" data-add-replacement-shelf>+ Add Rack Shelf</button></div>`;
                row.querySelector('[data-add-replacement-shelf]').addEventListener('click',()=>openRackShelfCreation(row.querySelector('[data-shelf-target-rack]').value,saved=>{
                    for(const select of rows.querySelectorAll('[data-shelf-device-choice]')){const previous=select.value;select.innerHTML=options();select.value=previous;}
                    if(saved)row.querySelector('[data-shelf-device-choice]').value='shelf:'+saved.id;
                }));rows.append(row);
            }
            form.addEventListener('invalid',event=>{event.preventDefault();feedback.textContent='Choose an action for every linked device.';event.target.focus();},true);
            form.addEventListener('submit',async event=>{
                event.preventDefault();feedback.textContent='';
                const choices=review.devices.map(d=>{const value=[...rows.querySelectorAll('[data-shelf-device-choice]')].find(s=>s.dataset.shelfDeviceChoice===d.id).value;
                    if(value==='retire')return {deviceId:d.id,revision:d.revision,action:'retire'};
                    const shelf=(appState.rackAccessories||[]).find(a=>'shelf:'+a.id===value);
                    return {deviceId:d.id,revision:d.revision,action:'reassign',rackId:shelf?.rackId||'',shelfId:shelf?.id||''};});
                try{await nextRackBridge.removeShelf(review.shelf,choices);closeModal(true);renderContent();}
                catch(error){feedback.textContent=error.message;feedback.tabIndex=-1;feedback.focus();}
            });
        }

        function validateRackPlacement(deviceId, rackId, face, startU, endU = startU) {
            const rack = appState.racks.find(r => r.id === rackId);
            if (!rack) return 'Selected rack no longer exists.';

            const start = Number(startU);
            const end = Number(endU);
            const rackHeight = Number(rack.heightU);

            if (!Number.isInteger(start) || !Number.isInteger(end)) {
                return 'Rack U positions must be whole numbers.';
            }
            if (start < 1 || end < 1 || start > rackHeight || end > rackHeight) {
                return `Rack position must be between U1 and U${rackHeight}.`;
            }
            if (end < start) {
                return 'Rack end U cannot be below the start U.';
            }

            const overlaps = appState.devices.some(d => {
                if (!isRackMountedDevice(d) || d.id === deviceId || d.rackId !== rackId || (d.face || 'front') !== (face || 'front')) return false;
                const otherStart = Number(d.rackUStart);
                const otherEnd = Number(d.rackUEnd || d.rackUStart);
                if (!Number.isInteger(otherStart) || !Number.isInteger(otherEnd)) return false;
                return start <= otherEnd && end >= otherStart;
            });

            if (overlaps) {
                return `The selected U position overlaps another device on the ${face || 'front'} face.`;
            }
            if ((appState.rackAccessories || []).some(a => a.rackId === rackId && !['pdu_vertical','cable_vertical'].includes(a.type) && a.face === (face || 'front') && start <= Number(a.startU) + Number(a.heightU) - 1 && end >= Number(a.startU))) {
                return 'The selected U position overlaps a rack accessory.';
            }
            return null;
        }

        function showToast(message, type = 'success') {
            if(type==='error' && showDeviceEditorFeedback(message))return;
            const toast = document.getElementById('toast');
            const msg = document.getElementById('toast-message');
            const icon = document.getElementById('toast-icon');
            
            msg.textContent = message;
            icon.className = type === 'success' ? 'fa-solid fa-circle-check text-emerald-400 text-lg' : 'fa-solid fa-circle-exclamation text-amber-400 text-lg';

            // mirror validation errors inside the currently open form.
            if (type === 'error') {
                const formError = document.querySelector('#modal-container form [data-form-error]');
                if (formError) {
                    formError.textContent = message;
                    formError.classList.add('is-visible');
                }
                // Highlight the relevant control for common application-level
                // validation failures (native required-field errors are handled
                // separately by the 'invalid' listener).
                const rules = [
                    [/rack name/i, 'rack-name'],
                    [/device name|hostname|unique device name/i, 'dev-name'],
                    [/device type/i, 'dev-type'],
                    [/mounting option/i, 'dev-mount-type'],
                    [/select a location/i, 'dev-location'],
                    [/existing subnet|selected subnet/i, 'dev-subnet'],
                    [/primary ip|ip address/i, 'dev-ip'],
                    [/network cidr|valid network cidr/i, 'sub-cidr'],
                    [/subnet name/i, 'sub-name'],[/subnet purpose/i,'sub-purpose'],
                    [/vlan id/i, 'sub-vlan'],
                    [/gateway/i, 'sub-gw']
                ];
                const match = rules.find(([pattern, id]) => pattern.test(message) &&
                    document.getElementById(id)?.closest('#modal-container form'));
                if (match) {
                    const field = document.getElementById(match[1]);
                    field.setAttribute('aria-invalid', 'true');
                    field.focus();
                }
            }

            toast.classList.remove('translate-y-20', 'opacity-0');
            setTimeout(() => {
                toast.classList.add('translate-y-20', 'opacity-0');
            }, 3000);
        }

        // Accessibility: browser-native required-field errors must also be
        // visible in the form and announced, even when submit is prevented.
        document.addEventListener('invalid', function(event) {
            const field = event.target;
            const form = field.closest && field.closest('#modal-container form');
            if (!form || form.id==='device-editor-form') return;
            field.setAttribute('aria-invalid', 'true');
            const error = form.querySelector('[data-form-error]');
            if (!error) return;
            const label = field.id ? form.querySelector('label[for="' + field.id + '"]') : null;
            const fieldName = label ? label.textContent.replace('*', '').trim() : (field.getAttribute('aria-label') || 'This field');
            const message = fieldName + ': ' + (field.validationMessage || 'Please check this value.');
            if(form.dataset.formAction==='subnet'){event.preventDefault();showSubnetFormError(message,field.id);return;}
            error.textContent = message;
            error.classList.add('is-visible');
        }, true);

        // The approved IPAM Overview search filters real saved Address Blocks and networks.
        document.addEventListener('input', function(event) {
            if (event.target?.id !== 'ipam-overview-search') return;
            const query = event.target.value.trim().toLowerCase();
            let count = 0;
            document.querySelectorAll('#main-content [data-ipam-network-group]').forEach(card => {
                const visible = !query || (card.dataset.search || '').includes(query);
                card.hidden = !visible;
                if (visible) count++;
            });
            const status = document.getElementById('ipam-overview-search-status');
            if (status) status.textContent = count
                ? 'Showing ' + count + ' matching ' + (count === 1 ? 'card.' : 'cards.')
                : 'No matching IP Address Blocks or networks found.';
        });
        document.addEventListener('input', function(event) {
            const field = event.target;
            const form = field.closest && field.closest('#modal-container form');
            if (!form || !field.matches('input,select,textarea')) return;
            if (!field.closest('#subnet-batch-preview') && field.validity && field.validity.valid) field.removeAttribute('aria-invalid');
        });

        // Use the single approved sidebar across every section.
        const sidebarPreferenceKey = 'caffoot-sidebar-collapsed';
        function toggleSidebar() {
            const shell = document.getElementById('app');
            const sidebar = document.getElementById('sidebar');
            const collapsed = !shell.classList.contains('collapsed');
            shell.classList.toggle('collapsed', collapsed);
            sidebar.classList.toggle('collapsed', collapsed);
            const toggle = sidebar.querySelector('[data-action="toggle-sidebar"]');
            if (toggle) toggle.setAttribute('aria-expanded', String(!collapsed));
            try { localStorage.setItem(sidebarPreferenceKey, collapsed ? 'true' : 'false'); }
            catch (_) { /* The menu still works if preferences cannot be saved. */ }
        }
        try {
            if (localStorage.getItem(sidebarPreferenceKey) === 'true') {
                document.getElementById('app').classList.add('collapsed');
                document.getElementById('sidebar').classList.add('collapsed');
                document.querySelector('[data-action="toggle-sidebar"]')?.setAttribute('aria-expanded', 'false');
            }
        } catch (_) { /* Local preferences may be unavailable in private browsing. */ }

        function switchTab(tabId) {
            document.getElementById('rack-print-frame')?.remove();
            currentTab = tabId;
            document.querySelectorAll('#sidebar .nav-item[data-tab]').forEach(button => {
                const selected = button.dataset.tab === tabId;
                button.classList.toggle('current', selected);
                button.classList.toggle('subtle', !selected);
                if (selected) button.setAttribute('aria-current', 'page');
                else button.removeAttribute('aria-current');
            });
            const titles = {
                dashboard: 'Dashboard',
                ipam: 'IPAM',
                devices: 'Devices',
                racks: 'Network Racks',


                audit: 'Audit Trail',
                settings: 'Settings & Data',
                users: 'Users & Permissions',
                account: 'My Account'
            };
            document.getElementById('page-title').textContent = titles[tabId];
            renderContent();
        }

        // safely render user-controlled values into HTML and inline event attributes.
        function escapeHtml(value) {
            return String(value ?? '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        function inlineJsArg(value) {
            return escapeHtml(JSON.stringify(String(value ?? '')));
        }

        const BROWSER_STORAGE_NOTICE_KEY = 'caffoot_browser_storage_notice_v1';
        let browserStorageNoticeAcknowledged = true;
        try { browserStorageNoticeAcknowledged = typeof localStorage !== 'undefined' && localStorage.getItem(BROWSER_STORAGE_NOTICE_KEY) === 'acknowledged'; }
        catch (error) { console.warn('Browser storage notice preference unavailable:', error); }
        function browserStorageWarning(firstRun = false, showBackupAction = true) {
            return renderInterfaceTemplate("shared/browser-storage-warning-3",[showBackupAction ? renderInterfaceTemplate("shared/browser-storage-warning-1",[]) : '',firstRun ? renderInterfaceTemplate("shared/browser-storage-warning-2",[]) : '']);
        }
        function acknowledgeBrowserStorageNotice() {
            browserStorageNoticeAcknowledged = true;
            try { localStorage.setItem(BROWSER_STORAGE_NOTICE_KEY, 'acknowledged'); }
            catch (error) { console.warn('Could not remember browser storage notice:', error); }
            renderContent();
        }
        function renderSectionTabIcon(iconId) {
            return `<svg class="section-tab-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" focusable="false"><use href="#${iconId}"/></svg>`;
        }

        // Use the approved in-page tabs rather than resurrecting the old
        // nested sidebar. All buttons call the existing section handlers.
        function renderSectionHeader(section) {
            const tab = (key, label, icon, action, active, cssClass, extraAttribute = 'data-tab') =>
                `<button type="button" role="tab" data-action="${action}" ${extraAttribute}="${key}" aria-selected="${active ? 'true' : 'false'}" class="section-tab-control ${cssClass}${active ? ' active' : ''}">${renderSectionTabIcon(icon)}${label}</button>`;
            if (section === 'devices') {
                const options = [
                    ['overview','Overview','i-grid'],['inventory','Device Inventory','i-box'],
                    ['types','Device Types','i-box'],['locations','Locations','i-network'],
                    ['manufacturers','Manufacturers','i-box'],['models','Models','i-box'],
                    ['software','Software','i-tool'],['services','Server Services','i-network']
                ];
                return renderInterfaceTemplate("shared/render-section-header-1",[options.map(([key,label,icon])=>tab(key,label,icon,'select-device-section',activeDeviceDetailsTab===key,'')).join(''),activeDeviceDetailsTab==='inventory'?'Find, inspect and manage the devices recorded in your inventory.':'Explore the devices, hardware and software recorded in your inventory.']);
            }
            if (section === 'ipam') {
                const options=[['overview','Overview','i-grid'],['addresses','IP Addresses','i-network'],['manage','Manage Subnets','i-settings']];
                return renderInterfaceTemplate("shared/render-section-header-2",[options.map(([key,label,icon])=>tab(key,label,icon,'select-ipam-section',activeIpamTab===key,'ipam-tab','data-view')).join('')]);
            }
            if (section === 'racks') {
                const options=[['overview','Overview','i-grid'],['inventory','Rack Inventory','i-rack'],['accessories','Rack Accessories','i-tool']];
                return renderInterfaceTemplate("shared/render-section-header-3",[options.map(([key,label,icon])=>tab(key,label,icon,'select-rack-section',v13RackSection===key,'racks-tab','data-section-tab')).join('')]);
            }
            if (section === 'users') {
                const options=[['overview','Overview','i-grid'],['list','User List','i-users'],['add','Add User','i-user']];
                return renderInterfaceTemplate("shared/render-section-header-4",[options.map(([key,label,icon])=>tab(key,label,icon,'select-users-section',activeUsersTab===key,'tab')).join('')]);
            }
            return '';
        }

        // Reveal the complete tab label by scrolling only its own navigation row.
        function revealSectionTab(strip, button) {
            const bounds=strip.getBoundingClientRect(),tab=button.getBoundingClientRect();
            if(tab.left<bounds.left)strip.scrollLeft-=bounds.left-tab.left;
            else if(tab.right>bounds.right)strip.scrollLeft+=tab.right-bounds.right;
        }

        // Keep the selected section in view without moving the document vertically.
        function revealActiveSectionTabs(container=document.getElementById('main-content')) {
            container?.querySelectorAll('.subnav,.tabs,.audit-tabs,.intelligence-tabs').forEach(strip=>{
                const selected=strip.querySelector(':scope > .active,:scope > [aria-selected="true"]');
                if(!selected)return;
                revealSectionTab(strip,selected);
            });
        }
        window.addEventListener('resize',()=>revealActiveSectionTabs());
        document.addEventListener('focusin',event=>{
            const button=event.target.closest('button');
            const strip=button?.parentElement;
            if(strip?.closest('#main-content') && strip.matches('.subnav,.tabs,.audit-tabs,.intelligence-tabs,.intelligence-pills,.ipam-tabs,.racks-tabs,.rack-subtabs')) {
                revealSectionTab(strip,button);
            }
        });

        function renderContent() {
            const container = document.getElementById('main-content');
            // Clear confirmation secrets before replacing an account view, including while a request is pending.
            container.querySelector('#account-email-verification-form')?.reset();
            document.body.style.overflow='';
            container.className = ['account','audit','settings'].includes(currentTab) ? '' : 'main';
            const previousStrips=container.dataset.renderedTab===currentTab
                ? [...container.querySelectorAll('.subnav,.tabs,.audit-tabs,.intelligence-tabs')].map(strip=>strip.scrollLeft) : [];
            const deviceDesign=activeDeviceDetailsTab==='overview'?'devices':activeDeviceDetailsTab==='inventory'?'device-inventory':'device-management';
            const design = {devices:deviceDesign, audit:'audit-trail', account:'my-account'}[currentTab] || currentTab;
            document.getElementById('interface-page-style').textContent = interfaceStyles.get(design);
            // replace the view once, avoiding an extra DOM teardown.
            let html = '';
            if (currentTab === 'dashboard') html = renderDashboardHTML();
            else if (currentTab === 'ipam') html = renderIpamHTML();
            else if (currentTab === 'devices') html = renderDevicesHTML();
            else if (currentTab === 'racks') html = renderRackHubV13();
            else if (currentTab === 'audit') html = renderAuditHTML();
            else if (currentTab === 'users') html = nextRenderUsers();
            else if (currentTab === 'account') html = nextRenderAccount();
            else if (currentTab === 'settings') html = renderApplicationSettings();
            if (['devices','ipam','racks','users'].includes(currentTab)) {
                const panelClass = {devices:['overview','inventory'].includes(activeDeviceDetailsTab)?'account-panel':'account-panel catalog-section',ipam:'ipam-panel',racks:'racks-panel'+(v13RackSection==='overview'?' rack-overview-section':''),users:'users-sections'}[currentTab];
                html = renderSectionHeader(currentTab) + '<section class="' + panelClass + ' active section-page-body"' + (currentTab==='devices'?' data-section="'+activeDeviceDetailsTab+'"':'') + '>' + html + '</section>';
            }
            container.innerHTML = html;
            if (currentTab === 'account') hydrateAccount(container);
            if (currentTab === 'audit') hydrateAudit(container);
            if (currentTab === 'settings') hydrateSettings(container);
            container.dataset.renderedTab=currentTab;
            container.querySelectorAll('.subnav,.tabs,.audit-tabs,.intelligence-tabs').forEach((strip,index)=>{
                strip.scrollLeft=previousStrips[index]||0;
            });
            revealActiveSectionTabs(container);
            const rackScroll = container.querySelector('[data-rack-scroll="true"]');
            if (rackScroll) {
                const updateScrollHint = () => {
                    rackScroll.dataset.moreBelow = String(rackScroll.scrollHeight - rackScroll.scrollTop - rackScroll.clientHeight > 3);
                };
                rackScroll.addEventListener('scroll', updateScrollHint, {passive:true});
                updateScrollHint();
            }
        }


        // conservative repair planner. Never changes source data during preview.
        let inventoryIntegrityRepairPreview = null;
        function planDeviceIpAllocationIntegrityRepairs(state=appState) {
            const fixes=[], blocked=[];
            const owners=new Map();
            for(const d of state.devices) if(d.primaryIp) {
                if(!owners.has(d.primaryIp)) owners.set(d.primaryIp,[]);
                owners.get(d.primaryIp).push(d);
            }
            for(const [ip,devices] of owners) {
                if(devices.length!==1) { blocked.push(`Duplicate primary IP ${ip}: manual resolution required.`); continue; }
                const d=devices[0], existing=state.ipAllocations[ip];
                if(!state.subnets.some(n=>ipBelongsToSubnet(ip,n.cidr))) {
                    blocked.push(`${d.name}: ${ip} has no matching subnet.`); continue;
                }
                if(existing?.deviceId && existing.deviceId!==d.id) {
                    blocked.push(`${ip} belongs to another IPAM record (${existing.deviceId}). Review manually.`); continue;
                }
                if(existing && !existing.deviceId && existing.status && existing.status!=='Available') {
                    blocked.push(`${ip} is ${existing.status} without a matching owner. Review manually.`); continue;
                }
                const expected={status:d.ipReserved?'Reserved':'Assigned',deviceId:d.id,hostname:d.name||''};
                if(!existing || Object.entries(expected).some(([k,v])=>existing[k]!==v)) {
                    fixes.push({ip,deviceId:d.id,name:d.name,expected,
                        reason:existing?'Synchronise device-owned IPAM fields':'Create missing device IPAM allocation'});
                }
            }
            for(const [ip,a] of Object.entries(state.ipAllocations)) {
                if(a?.deviceId && !state.devices.some(d=>d.id===a.deviceId && d.primaryIp===ip))
                    blocked.push(`${ip} has a stale or orphaned IPAM link. Review manually.`);
                if(a?.reservedForDeviceId && !state.devices.some(d=>d.id===a.reservedForDeviceId))
                    blocked.push(`${ip} has an orphaned reservation. Review manually.`);
            }
            for(const d of state.devices) if(d.rackId && !state.racks.some(r=>r.id===d.rackId))
                blocked.push(`${d.name} refers to a missing rack. Review manually.`);
            return {fixes,blocked};
        }
        function previewInventoryIntegrityRepairs() {
            if (!nextIntegrityRepairBridge) return;
            void nextIntegrityRepairBridge.preview();
        }
        function applyPreviewedInventoryIntegrityRepairs() {
            if (!nextIntegrityRepairBridge) return;
            void nextIntegrityRepairBridge.apply();
        }
        function renderIntegrityRepairPreviewHtml() {
            const preview=inventoryIntegrityRepairPreview;
            return renderInterfaceTemplate("shared/render-integrity-repair-preview-html-7",[preview?renderInterfaceTemplate("shared/render-integrity-repair-preview-html-6",[preview.plan.fixes.length,preview.plan.blocked.length,preview.plan.fixes.length?renderInterfaceTemplate("shared/render-integrity-repair-preview-html-2",[preview.plan.fixes.map(f=>renderInterfaceTemplate("shared/render-integrity-repair-preview-html-1",[escapeHtml(f.ip),escapeHtml(f.name),escapeHtml(f.reason)])).join('')]):'<p class="text-sm text-slate-700 dark:text-slate-200">No safe automatic repairs are needed.</p>',preview.plan.blocked.length?renderInterfaceTemplate("shared/render-integrity-repair-preview-html-4",[preview.plan.blocked.map(x=>renderInterfaceTemplate("shared/render-integrity-repair-preview-html-3",[escapeHtml(x)])).join('')]):'',preview.plan.fixes.length?renderInterfaceTemplate("shared/render-integrity-repair-preview-html-5",[]):'']):'']);
        }

        // read-only, generated from the current inventory.
        function buildInventoryReportData() {
            const devices=Array.isArray(appState.devices)?appState.devices:[];
            const racks=Array.isArray(appState.racks)?appState.racks:[];
            const subnets=Array.isArray(appState.subnets)?appState.subnets:[];
            const locationCounts=new Map();
            for (const d of devices) {
                const location=String(d.location || 'Unknown');
                locationCounts.set(location,(locationCounts.get(location)||0)+1);
            }
            const rackRows=racks.map(r=>{
                const height=Number(r.heightU)||0;
                const installed=devices.filter(d=>isRackMountedDevice(d)&&d.rackId===r.id);
                const accessories=(Array.isArray(appState.rackAccessories)?appState.rackAccessories:[])
                    .filter(a=>a.rackId===r.id && a.type!=='pdu_vertical' && a.type!=='cable_vertical');
                // Front and rear occupancy are separately reported to avoid combining
                // distinct faces as if they were one physical space.
                const occupancy=face=>{
                    const deviceU=installed.filter(d=>(d.face||'front')===face)
                        .reduce((sum,d)=>{
                            const a=Number(d.rackUStart),b=Number(d.rackUEnd??d.rackUStart);
                            return sum+(Number.isInteger(a)&&Number.isInteger(b)&&b>=a?b-a+1:0);
                        },0);
                    const accessoryU=accessories.filter(a=>(a.face||'front')===face)
                        .reduce((sum,a)=>sum+(Number(a.heightU)||0),0);
                    return deviceU+accessoryU;
                };
                const front=occupancy('front'),rear=occupancy('rear');
                const percent=height?Math.round(Math.max(front,rear)/height*100):0;
                return {name:r.name||r.id,height,front,rear,devices:installed.length,percent};
            });
            const subnetRows=subnets.map(n=>{
                const x=calculateSubnetUtilisationSummary(n);
                return {name:n.name||'',cidr:n.cidr||'',supported:x.supported,
                    assigned:x.assigned,reserved:x.reserved,available:x.available,
                    utilisation:x.utilisation,capacity:x.capacity};
            });
            return {devices,locations:[...locationCounts].sort((a,b)=>b[1]-a[1]),
                racks:rackRows,subnets:subnetRows};
        }
        function escapeCsvCellAndNeutraliseSpreadsheetFormula(value) {
            let v=String(value??'');
            // Prevent CSV formula injection when opened in spreadsheet software.
            if (/^[\s]*[=+\-@]/.test(v)) v="'"+v;
            return '"'+v.replace(/"/g,'""')+'"';
        }
        function downloadInventoryReportCsv(kind) {
            const data=buildInventoryReportData();
            const reports={
                devices: [
                    ['Hostname','Primary IP','Status','Type','Location','Manufacturer','Model','Serial Number','Rack','U Start','U End','IP Reserved'],
                    ...data.devices.map(d=>[d.name,d.primaryIp,d.status||'Active',d.type,d.location,d.manufacturer,d.model,d.serialNumber,
                        appState.racks.find(r=>r.id===d.rackId)?.name||'',d.rackUStart,d.rackUEnd,d.ipReserved?'Yes':'No'])
                ],
                subnets: [
                    ['Name','CIDR','Assigned','Reserved','Available','Capacity','Utilisation %','Supported /24'],
                    ...data.subnets.map(n=>[n.name,n.cidr,n.supported?n.assigned:'',n.supported?n.reserved:'',
                        n.supported?n.available:'',n.supported?n.capacity:'',n.supported?n.utilisation:'',n.supported?'Yes':'No'])
                ],
                racks: [
                    ['Rack','Height U','Front occupied U','Rear occupied U','Devices','Maximum face occupancy %'],
                    ...data.racks.map(r=>[r.name,r.height,r.front,r.rear,r.devices,r.percent])
                ]
            };
            if (!Object.prototype.hasOwnProperty.call(reports,kind)) return;
            const csv='\uFEFF'+reports[kind].map(row=>row.map(escapeCsvCellAndNeutraliseSpreadsheetFormula).join(',')).join('\r\n');
            const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));
            const a=document.createElement('a');
            a.href=url; a.download='caffoot_lite_'+kind+'_'+new Date().toISOString().slice(0,10)+'.csv';
            document.body.appendChild(a); a.click(); a.remove();
            setTimeout(()=>URL.revokeObjectURL(url),1000);
        }
        function renderInventoryReportsHtml(includeCsvButtons=true) {
            const data=buildInventoryReportData();
            const maxLocation=Math.max(1,...data.locations.map(([,n])=>n));
            const warnSubnets=data.subnets.filter(x=>x.supported&&x.utilisation>=85);
            const warnRacks=data.racks.filter(x=>x.height&&x.percent>=85);
            return renderInterfaceTemplate("shared/render-inventory-reports-html-8",[includeCsvButtons?renderInterfaceTemplate("shared/render-inventory-reports-html-2",[[['devices','Devices CSV'],['subnets','Subnets CSV'],['racks','Racks CSV']].map(([id,label])=>renderInterfaceTemplate("shared/render-inventory-reports-html-1",[id,label])).join('')]):'',data.locations.length?data.locations.map(([name,n])=>renderInterfaceTemplate("shared/render-inventory-reports-html-3",[escapeHtml(name),n,Math.round(n/maxLocation*100)])).join(''):'<p class="text-sm text-slate-600 dark:text-slate-300">No devices recorded yet.</p>',data.subnets.length?data.subnets.map(n=>renderInterfaceTemplate("shared/render-inventory-reports-html-5",[escapeHtml(n.name),escapeHtml(n.cidr),n.supported&&n.utilisation>=85?'text-amber-800 dark:text-amber-200':'text-slate-900 dark:text-white',n.supported?n.utilisation+'%':'N/A',n.supported?renderInterfaceTemplate("shared/render-inventory-reports-html-4",[n.utilisation>=85?'bg-amber-600':'bg-emerald-700 dark:bg-emerald-400',n.utilisation]):'<p class="text-xs text-amber-800 dark:text-amber-200">Subnet CIDR is outside the supported /23–/30 range.</p>'])).join(''):'<p class="text-sm text-slate-600 dark:text-slate-300">No subnets recorded yet.</p>',data.racks.length?data.racks.map(r=>renderInterfaceTemplate("shared/render-inventory-reports-html-6",[escapeHtml(r.name),r.percent>=85?'text-amber-800 dark:text-amber-200':'text-slate-700 dark:text-slate-200',r.front,r.rear,r.height,r.percent])).join(''):'<p class="text-sm text-slate-600 dark:text-slate-300">No racks recorded yet.</p>',(warnSubnets.length||warnRacks.length)?renderInterfaceTemplate("shared/render-inventory-reports-html-7",[escapeHtml([...warnSubnets.map(x=>'Subnet '+x.name+' ('+x.utilisation+'%)'),...warnRacks.map(x=>'Rack '+x.name+' ('+x.percent+'%)')].join(' · '))]):'<p class="text-sm text-emerald-800 dark:text-emerald-200">No subnet or rack capacity warnings at the 85% threshold.</p>']);
        }

        let activeDashboardTab = 'overview';
        let dashboardActivityFilter = 'all';
        let dashboardAlertSeverityFilter = 'all';
        document.addEventListener('change', event => {
            const filter = event.target.closest('[data-dashboard-filter]');
            if (!filter) return;
            if (filter.dataset.dashboardFilter === 'activity') dashboardActivityFilter = filter.value;
            if (filter.dataset.dashboardFilter === 'alerts') dashboardAlertSeverityFilter = filter.value;
            renderContent();
            document.getElementById(filter.id)?.focus({preventScroll:true});
        });
        function renderDashboardHTML() {
            const devices = Array.isArray(appState.devices) ? appState.devices : [];
            const racks = Array.isArray(appState.racks) ? appState.racks : [];
            const subnets = Array.isArray(appState.subnets) ? appState.subnets : [];
            const allocations = isPlainObject(appState.ipAllocations) ? appState.ipAllocations : {};

            const activeDevices = devices.filter(d => (d.status || 'Active').toLowerCase() === 'active').length;
            const inactiveDevices = devices.length - activeDevices;
            const assignedIps = Object.values(allocations).filter(a => a?.status === 'Assigned').length;
            const reservedIps = Object.values(allocations).filter(a => a?.status === 'Reserved').length;
            const totalTrackedIps = Object.keys(allocations).length;
            const rackIds = new Set(racks.map(r => r.id));
            const rackedDevices = devices.filter(d => isRackMountedDevice(d)&&d.rackId&&rackIds.has(d.rackId)).length;
            const unmountedDevices = devices.length - rackedDevices;

            const typeCounts = devices.reduce((map, d) => {
                const type = d.type || 'Other';
                map[type] = (map[type] || 0) + 1;
                return map;
            }, {});
            const topTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
            const maxTypeCount = Math.max(1, ...topTypes.map(([, count]) => count));

            // use each subnet's real usable host capacity (/23 through /30).
            const subnetStats = subnets.map(subnet => {
                const summary = calculateSubnetUtilisationSummary(subnet);
                return { ...subnet, used: summary.assigned + summary.reserved,
                    assigned: summary.assigned, reserved: summary.reserved,
                    capacity: summary.capacity, percentage: summary.utilisation,
                    supported: summary.supported };
            });
            const totalSubnetCapacity = subnetStats.reduce((sum, subnet) => sum + subnet.capacity, 0);
            const subnetAssigned = subnetStats.reduce((sum, subnet) => sum + subnet.assigned, 0);
            const subnetReserved = subnetStats.reduce((sum, subnet) => sum + subnet.reserved, 0);
            const ipUtilisation = totalSubnetCapacity ? Math.min(100, Math.round(((subnetAssigned + subnetReserved) / totalSubnetCapacity) * 100)) : 0;
            const reservedDeviceCount = devices.filter(d => d.primaryIp && d.ipReserved).length;
            const alerts = [];
            const deviceIds = new Set(devices.map(d => d.id));
            const seenPrimaryIps = new Set();
            devices.forEach(device => {
                if (device.primaryIp) {
                    if (seenPrimaryIps.has(device.primaryIp)) {
                        alerts.push({ level: 'danger', icon: 'fa-triangle-exclamation', text: `Duplicate primary IP: ${device.primaryIp}`, destination:'devices', deviceId:device.id });
                    }
                    seenPrimaryIps.add(device.primaryIp);
                    const allocation = allocations[device.primaryIp];
                    if (!allocation || allocation.deviceId !== device.id) {
                        alerts.push({ level: 'warning', icon: 'fa-link-slash', text: `${device.name} is not linked correctly in IPAM`, destination:'devices', deviceId:device.id });
                    }
                }
                if (device.rackId && !racks.some(r => r.id === device.rackId)) {
                    alerts.push({ level: 'danger', icon: 'fa-hard-drive', text: `${device.name} references a missing rack`, destination:'devices', deviceId:device.id });
                }
            });
            Object.entries(allocations).forEach(([ip, allocation]) => {
                if (allocation?.deviceId && !deviceIds.has(allocation.deviceId)) {
                    alerts.push({ level: 'danger', icon: 'fa-link-slash', text: `${ip} references a missing device`, destination:'ipam', ip });
                }
            });
            racks.forEach(rack => {
                const rackDevices = devices.filter(d => isRackMountedDevice(d)&&d.rackId === rack.id);
                const used = rackDevices.reduce((sum, d) => {
                    const start = Number(d.rackUStart);
                    const end = Number(d.rackUEnd ?? d.rackUStart);
                    return Number.isInteger(start) && Number.isInteger(end) && end >= start ? sum + (end - start + 1) : sum;
                }, 0);
                if ((Number(rack.heightU) || 0) > 0 && used / Number(rack.heightU) >= 0.85) {
                    alerts.push({ level: 'warning', icon: 'fa-gauge-high', text: `${rack.name} is ${Math.round((used / Number(rack.heightU)) * 100)}% occupied`, destination:'racks', rackId:rack.id });
                }
            });
            const filteredDashboardAlerts = alerts.filter(a => dashboardAlertSeverityFilter === 'all' || (dashboardAlertSeverityFilter === 'critical' ? a.level === 'danger' : a.level !== 'danger')).slice(0, 12);
            const filteredDashboardAuditEntries = (Array.isArray(auditHistory) ? auditHistory : []).slice().reverse().filter(entry => {
                if (dashboardActivityFilter === 'all') return true;
                const changes = Array.isArray(entry.changes) ? entry.changes : [];
                const source = `${entry.reason || ''} ${changes.map(c => `${c.kind || ''} ${c.label || ''}`).join(' ')}`.toLowerCase();
                return dashboardActivityFilter === 'devices' ? /device/.test(source) : dashboardActivityFilter === 'network' ? /ipam|subnet|ip address|allocation|vlan/.test(source) : /rack|accessory|mount/.test(source);
            }).slice(0, 8);
            // The pinned Dashboard Activity & Alerts lists use the original
            // db-slimrow, db-badge, db-filters and db-empty-note component hierarchy.
            // Entries remain permission-filtered by the existing history API.
            const dashboardActivityTimelineHtml = filteredDashboardAuditEntries.length
              ? filteredDashboardAuditEntries.map(entry=>{
                  const when=new Date(entry.at);
                  const time=Number.isNaN(when.getTime())?'Date unavailable':when.toLocaleString();
                  const changes=Array.isArray(entry.changes)?entry.changes:[];
                  const description=changes.slice(0,3).map(c=>[c.action||'Changed',c.kind||'record',c.label||''].join(' ')).join(' · ')||'Inventory saved without item-level changes.';
                  const kindText=`${entry.reason||''} ${changes.map(c=>c.kind||'').join(' ')}`.toLowerCase();
                  const kind=/device/.test(kindText)?'devices':/ipam|subnet|ip address|allocation|vlan/.test(kindText)?'network':/rack|accessory|mount/.test(kindText)?'racks':'other';
                  return renderInterfaceTemplate("dashboard/dashboard-activity-timeline-html-1",[kind,escapeHtml(entry.reason||'Inventory saved'),escapeHtml(description),escapeHtml(time)]);
                }).join('')
              : '';
            const dashboardWarningRowsHtml = filteredDashboardAlerts.map(alert=>{
                const critical=alert.level==='danger';
                const severity=critical?'Critical':'Warning';
                return renderInterfaceTemplate("dashboard/dashboard-warning-rows-html-1",[critical?'critical':'warning',escapeHtml(alert.destination||'diagnostics'),escapeHtml(String(alert.deviceId||'')),escapeHtml(String(alert.rackId||'')),escapeHtml(String(alert.ip||'')),escapeHtml(severity+': '+alert.text+'. Open related section'),escapeHtml(alert.text),severity]);
              }).join('');
            const dashboardActivityFilterControlsHtml = renderInterfaceTemplate("dashboard/dashboard-activity-filter-controls-html-1",[dashboardActivityFilter==='all'?'selected':'',dashboardActivityFilter==='devices'?'selected':'',dashboardActivityFilter==='network'?'selected':'',dashboardActivityFilter==='racks'?'selected':'']);
            const dashboardAlertFilterControlsHtml = renderInterfaceTemplate("dashboard/dashboard-alert-filter-controls-html-1",[dashboardAlertSeverityFilter==='all'?'selected':'',dashboardAlertSeverityFilter==='warning'?'selected':'',dashboardAlertSeverityFilter==='critical'?'selected':'']);
            const integrityErrors = validateApplicationState();
            const integrityHealthy = integrityErrors.length === 0;
            const integrityPreview = integrityErrors.slice(0, 5);

            const networkSnapshot = renderInterfaceTemplate("dashboard/network-snapshot-1",[subnetAssigned,subnetReserved,Math.max(0,totalSubnetCapacity-subnetAssigned-subnetReserved)]);
            const statusPill = (label, count, classes) => renderInterfaceTemplate("dashboard/status-pill-1",[classes,escapeHtml(label),count]);

            const quickActions = renderInterfaceTemplate("dashboard/quick-actions-1",[]);

            // The approved Rack Details panel keeps the existing rack-selection action.
            const rackCards = racks.length ? racks.map(rack =>
                renderInterfaceTemplate("racks/rack-cards-1",[escapeHtml(rack.id),escapeHtml(rack.name),Number(rack.heightU) || 0])).join('') : '<p class="db-muted">No racks configured yet.</p>';

            const recentDevices = devices.slice().reverse().slice(0, 6);
            const recentDeviceRows = recentDevices.slice(0,3).map(d=>renderInterfaceTemplate("devices/recent-device-rows-1",[escapeHtml(d.name),escapeHtml(d.type||'Device'),escapeHtml(d.primaryIp||'No primary IP'),String(d.status||'Active').toLowerCase()==='active'?'db-good':'',escapeHtml(d.status||'Active')])).join('')||'<p class="db-muted">No devices configured yet.</p>';
            const deviceRows = recentDevices.length ? recentDevices.map(device => renderInterfaceTemplate("devices/device-rows-1",[getCategoryIcon(device.type),escapeHtml(device.name),escapeHtml(device.type || 'Device'),escapeHtml(device.primaryIp || 'No primary IP'),String(device.status).toLowerCase() === 'active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',escapeHtml(device.status || 'Active')])).join('') : renderInterfaceTemplate("devices/device-rows-2",[]);

            const typeRows = topTypes.length ? topTypes.map(([type, count]) => renderInterfaceTemplate("dashboard/type-rows-1",[escapeHtml(type),escapeHtml(type),Math.round((count / maxTypeCount) * 100),count])).join('') : renderInterfaceTemplate("dashboard/type-rows-2",[]);

            const subnetRows = subnetStats.length ? subnetStats.map(subnet => renderInterfaceTemplate("ipam/subnet-rows-1",[escapeHtml(subnet.name),escapeHtml(subnet.cidr),escapeHtml(subnet.vlan),subnet.used,subnet.capacity || 0,subnet.percentage >= 85 ? 'bg-amber-500' : 'bg-emerald-500',Math.max(subnet.percentage, subnet.used ? 1 : 0)])).join('') : renderInterfaceTemplate("ipam/subnet-rows-2",[]);

            // Visual insights are computed from current application state.
            const insightSegment = (label, value, total, colour) => renderInterfaceTemplate("dashboard/insight-segment-1",[colour,escapeHtml(label),value,total ? Math.round(value / total * 100) : 0]);
            const statusCounts = devices.reduce((map, d) => { const key = String(d.status || 'Active').trim() || 'Active'; map[key] = (map[key] || 0) + 1; return map; }, {});
            const statusEntries = Object.entries(statusCounts).sort((a,b) => b[1] - a[1]);
            const statusColours = ['#059669','#3b82f6','#f59e0b','#64748b','#a855f7','#e11d48'];
            const statusGradient = statusEntries.length && devices.length ? `conic-gradient(${statusEntries.map(([name,count],i) => {
                const before = statusEntries.slice(0,i).reduce((n,[,c])=>n+c,0) / devices.length * 100;
                return `${statusColours[i % statusColours.length]} ${before}% ${((before+count)/devices.length*100)}%`;
            }).join(',')})` : 'conic-gradient(#cbd5e1 0% 100%)';
            const rackInsights = racks.map(rack => {
                const height = Number(rack.heightU) || 0;
                const rackDevices = devices.filter(d => isRackMountedDevice(d)&&d.rackId === rack.id);
                const accessories = (appState.rackAccessories || []).filter(a => a.rackId === rack.id);
                const faces = ['front','rear'].map(face => {
                    const occupied = new Set();
                    rackDevices.filter(d => String(d.rackFace || 'front').toLowerCase() === face).forEach(d => {
                        const start = Number(d.rackUStart), end = Number(d.rackUEnd ?? d.rackUStart);
                        if(Number.isInteger(start) && Number.isInteger(end)) for(let u=Math.max(1,start);u<=Math.min(height,end);u++) occupied.add(u);
                    });
                    accessories.filter(a => !['pdu_vertical','cable_vertical'].includes(a.type) && String(a.face || 'front').toLowerCase() === face).forEach(a => {
                        const start = Number(a.startU), size = Number(a.heightU) || 1;
                        if(Number.isInteger(start)) for(let u=Math.max(1,start);u<=Math.min(height,start+size-1);u++) occupied.add(u);
                    });
                    return {face, used: occupied.size, capacity:height, percent:height?Math.round(occupied.size/height*100):0};
                });
                return {rack, faces};
            });
            // Original approved four-card grid: all figures are from saved inventory.
            const networkInsights = renderInterfaceTemplate("dashboard/network-insights-4",[ipUtilisation,ipUtilisation,ipUtilisation,subnetAssigned,subnetReserved,Math.max(0,totalSubnetCapacity-subnetAssigned-subnetReserved),devices.length,statusEntries.length?statusEntries.map(([name,count],i)=>renderInterfaceTemplate("dashboard/network-insights-1",[i%3===0?'green':i%3===1?'':'gray',escapeHtml(name),count])).join(''):'<p class="db-muted">No devices configured yet.</p>',topTypes.length?topTypes.map(([name,count],i)=>renderInterfaceTemplate("dashboard/network-insights-2",[i?'margin-top:18px':'',escapeHtml(name),count,Math.round(count/maxTypeCount*100)])).join(''):'<p class="db-muted">No devices configured yet.</p>',rackInsights.length?rackInsights.flatMap(({rack,faces})=>faces.map(({face,used,capacity,percent})=>renderInterfaceTemplate("dashboard/network-insights-3",[escapeHtml(rack.name),face==='front'?'Front':'Rear',used,capacity,percent,face==='front'?'#7396bb':'#4a9c86']))).join(''):'<p class="db-muted">No racks configured yet.</p>']);
            return renderInterfaceTemplate("dashboard/render-dashboard-html-10",[window.nextMfaEnrolled === false ? renderInterfaceTemplate("dashboard/render-dashboard-html-1",[]) : '',[['overview','Overview','i-grid'],['insights','Network Insights','i-network'],['activity','Activity & Alerts','i-history']].map(([id,label,icon])=>renderInterfaceTemplate("dashboard/render-dashboard-html-2",[id,id,activeDashboardTab===id,activeDashboardTab===id?'0':'-1',activeDashboardTab===id?'active':'',id,icon,label])).join(''),activeDashboardTab==='overview'?'':'hidden',[
                                ['Devices', devices.length, `${activeDevices} active · ${inactiveDevices} other`, 'i-box', 'tab-devices'],
                                ['IP Addresses', totalTrackedIps, `${assignedIps} assigned · ${reservedIps} reserved`, 'i-network', 'tab-ipam'],
                                ['Subnets', subnets.length, 'Managed networks', 'i-network', 'tab-ipam'],
                                ['Racks', racks.length, `${rackedDevices} mounted devices`, 'i-rack', 'dashboard-racks-overview']
                            ].map(([label,value,detail,icon,action],index) => renderInterfaceTemplate("dashboard/render-dashboard-html-3",[action,label,value,label,index===1?'green':index===3?'orange':'',icon,value,detail])).join(''),window.nextSessionIsAdmin === true && !integrityHealthy ? renderInterfaceTemplate("dashboard/render-dashboard-html-5",[integrityPreview.map(error => renderInterfaceTemplate("dashboard/render-dashboard-html-4",[escapeHtml(error)])).join('')]) : '',quickActions,recentDeviceRows,subnetStats.length ? subnetStats.slice(0,3).map(subnet => renderInterfaceTemplate("dashboard/render-dashboard-html-6",[escapeHtml(subnet.name),escapeHtml(subnet.cidr),subnet.percentage,escapeHtml(subnet.name),subnet.percentage,subnet.percentage])).join('') : '<p class="db-muted">No subnets configured yet.</p>',rackInsights.length ? rackInsights.slice(0,3).map(({rack,faces}) => {
                                        const used = Math.max(...faces.map(face=>face.used));
                                        const capacity = Number(rack.heightU)||0;
                                        const pct = capacity ? Math.round(used/capacity*100) : 0;
                                        return renderInterfaceTemplate("dashboard/render-dashboard-html-7",[escapeHtml(rack.name),used,capacity,escapeHtml(rack.name),pct,pct,pct>=85?'#ed8532':'#7799b5']);
                                    }).join('') : '<p class="db-muted">No network racks configured yet.</p>',networkSnapshot,devices.length,subnets.length,racks.length,activeDashboardTab==='insights'?'':'hidden',networkInsights,rackCards,activeDashboardTab==='activity'?'':'hidden',filteredDashboardAuditEntries.length,alerts.length,window.nextSessionIsAdmin===true&&integrityErrors.length?renderInterfaceTemplate("dashboard/render-dashboard-html-8",[integrityErrors.length]):'',dashboardActivityFilterControlsHtml,dashboardActivityTimelineHtml,filteredDashboardAuditEntries.length?'hidden':'',dashboardAlertFilterControlsHtml,dashboardWarningRowsHtml,filteredDashboardAlerts.length?'hidden':'',alerts.length?'No saved warnings match this filter.':'No saved warnings detected.',alerts.length>filteredDashboardAlerts.length?renderInterfaceTemplate("dashboard/render-dashboard-html-9",[filteredDashboardAlerts.length,alerts.length]):'','']);
        }

        function getCategoryIcon(type) {
            switch(type) {
                case 'Server': return 'fa-server';
                case 'Switch': return 'fa-network-wired';
                case 'Router': return 'fa-route';
                case 'PDU': return 'fa-bolt';
                case 'Patch Panel': return 'fa-plug';
                case 'NAS': case 'Storage': return 'fa-hard-drive';
                case 'UPS': return 'fa-battery-full';
                default: return 'fa-microchip';
            }
        }

        // lightweight, offline rack fascias configured per managed device type.
        const deviceFasciaGraphicPresets = {automatic:'Automatic',switch24:'24-port switch',switch48:'48-port switch',server:'Server',router:'Router / firewall',storage:'Storage / NAS',ups:'UPS / PDU',plain:'Plain front panel'};
        function getDefaultDeviceFasciaGraphic(type) {
            const t=String(type||'').toLowerCase();
            if(t.includes('switch'))return 'switch24';
            if(t.includes('server'))return 'server';
            if(t.includes('router')||t.includes('firewall'))return 'router';
            if(t.includes('nas')||t.includes('storage'))return 'storage';
            if(t.includes('ups')||t.includes('pdu'))return 'ups';
            return 'plain';
        }
        function openDeviceTypeRackFasciaSettings(type) {
            if(!getUniqueDeviceTypes().includes(type))return;
            const current=appState.deviceTypeGraphics?.[type]||'automatic';
            openModal(renderInterfaceTemplate("settings/open-device-type-rack-fascia-settings-1",[escapeHtml(type),Object.entries(deviceFasciaGraphicPresets).map(([key,label])=>`<option value="${key}" ${current===key?'selected':''}>${label}</option>`).join(''),escapeHtml(type)]));
        }
        async function saveDeviceTypeRackFasciaSettings(type) {
            const choice=document.getElementById('rack-style')?.value;
            if(!getUniqueDeviceTypes().includes(type)||!Object.hasOwn(deviceFasciaGraphicPresets,choice))return;
            if(!isPlainObject(appState.deviceTypeGraphics))appState.deviceTypeGraphics={};
            const before = JSON.stringify(appState);
            if(choice==='automatic')delete appState.deviceTypeGraphics[type];
            else appState.deviceTypeGraphics[type]=choice;
            if (!await nextSettingsBridge.save('deviceTypeGraphics')) {
                appState = JSON.parse(before);
                showToast('Device graphic was not saved; previous selection restored.', 'error');
            }
            openManageTypesModal();renderContent();
        }
        // calculate occupancy by unique U slots, not by summing item heights.
        let rackAccessoryPlacementHeightU = 1;
        function getOccupiedRackUnits(rack, face) {
            const used = new Set();
            const height = Number(rack.heightU) || 0;
            appState.devices.filter(d => isRackMountedDevice(d)&&d.rackId === rack.id && (d.face || 'front') === face).forEach(d => {
                for (let u = Number(d.rackUStart); u <= Number(d.rackUEnd || d.rackUStart); u++) {
                    if (Number.isInteger(u) && u >= 1 && u <= height) used.add(u);
                }
            });
            (appState.rackAccessories || []).filter(a => a.rackId === rack.id && a.face === face && !['pdu_vertical','cable_vertical'].includes(a.type)).forEach(a => {
                for (let u = Number(a.startU); u < Number(a.startU) + Number(a.heightU); u++) {
                    if (Number.isInteger(u) && u >= 1 && u <= height) used.add(u);
                }
            });
            return {occupied:used.size, available:Math.max(0,height-used.size), capacity:height, percent:height?Math.round(used.size/height*100):0};
        }
        function findAvailableRackUnitRanges(rack, face, requiredHeight = 1) {
            const height = Number(rack.heightU) || 0;
            const needed = Number(requiredHeight);
            if (!Number.isInteger(needed) || needed < 1 || needed > height) return [];
            const result = [];
            for (let start = 1; start + needed - 1 <= height; start++) {
                if (!validateRackPlacement(null, rack.id, face, start, start + needed - 1)) result.push(start);
            }
            return result;
        }
        function printRackElevation(rackId) {
            const rack = appState.racks.find(r=>r.id===rackId);
            if (!rack) { showToast('Rack not found.', 'error'); return; }
            const safe = value => escapeHtml(String(value ?? ''));
            const pages=['front','rear'].map(face=>{
                const usage=getOccupiedRackUnits(rack,face);
                const slots=Array.from({length:Number(rack.heightU)},(_,i)=>Number(rack.heightU)-i).map(u=>{
                    const d=appState.devices.find(d=>isRackMountedDevice(d)&&d.rackId===rack.id&&(d.face||'front')===face&&Number(d.rackUStart)<=u&&Number(d.rackUEnd||d.rackUStart)>=u);
                    const a=(appState.rackAccessories||[]).find(a=>a.rackId===rack.id&&a.face===face&&!['pdu_vertical','cable_vertical'].includes(a.type)&&Number(a.startU)<=u&&Number(a.startU)+Number(a.heightU)-1>=u);
                    const item=d||a;
                    const name=d?.name||a?.name||'';
                    const cls=d?'device':a?'accessory':'empty';
                    const first=d?u===Number(d.rackUEnd||d.rackUStart):a?u===Number(a.startU)+Number(a.heightU)-1:false;
                    return renderInterfaceTemplate("racks/slots-1",[cls,u,item&&first?safe(name):item?'↳':'']);
                }).join('');
                const rails=(appState.rackAccessories||[]).filter(a=>a.rackId===rack.id&&a.face===face&&['pdu_vertical','cable_vertical'].includes(a.type)).sort((a,b)=>Number(b.startU)-Number(a.startU)).map(a=>renderInterfaceTemplate("racks/rails-1",[safe(a.name||rackAccessoryTypeDefinitions[a.type]?.label||'Vertical accessory'),safe(a.side==='right'?'Right':'Left'),safe(a.startU),safe(Number(a.startU)+Number(a.heightU)-1)])).join('');
                return renderInterfaceTemplate("racks/print-capacity-page",[face==='front'?'Front':'Rear',usage.occupied,usage.available,usage.percent,slots,rails?renderInterfaceTemplate("racks/print-equipment-list",[rails]):'<p>None fitted</p>']);
            }).join('');
            const html = renderInterfaceTemplate("racks/print-rack-elevation-1",[safe(rack.name),safe(rack.name),safe(rack.location||''),safe(rack.heightU),safe(new Date().toLocaleString()),pages]);
            // Keep normal printing until the same-tab trial passes browser acceptance.
            if (new URLSearchParams(window.location.search).get('rack-print') === 'same-tab') {
                printRackElevationInFrame(html);
                return;
            }
            const w=window.open('','_blank');
            if (!w) { showToast('Allow pop-ups to print the rack elevation.', 'error'); return; }
            w.document.open();
            w.document.write(html);
            w.document.close();
            w.focus();
            // User initiates the browser print/PDF flow explicitly via the toolbar.
            w.print();
        }

        function printRackElevationInFrame(html) {
            document.getElementById('rack-print-frame')?.remove();
            const frame = document.createElement('iframe');
            const previousFocus = document.activeElement;
            const position = {left: window.scrollX, top: window.scrollY};
            frame.id = 'rack-print-frame';
            frame.title = 'Rack Elevation Print Trial';
            frame.tabIndex = -1;
            frame.setAttribute('aria-hidden', 'true');
            frame.style.cssText = 'position:fixed;left:-20000px;top:0;width:800px;height:1100px;border:0;pointer-events:none';
            frame.onload = async () => {
                try {
                    await frame.contentDocument.fonts.ready;
                    frame.contentWindow.addEventListener('afterprint', () => {
                        previousFocus?.focus({preventScroll: true});
                        window.scrollTo(position);
                    }, {once: true});
                    frame.contentWindow.focus();
                    frame.contentWindow.print();
                } catch (error) {
                    showToast('Print trial unavailable. Remove ?rack-print=same-tab from the address and use Print / PDF again.', 'error');
                }
            };
            frame.srcdoc = html;
            // Keep the document after printing: browsers differ in when afterprint fires.
            // The next trial or navigation removes it without interrupting PDF saving.
            // The application shell is hidden in print media; keep this document outside it.
            document.body.append(frame);
        }

        // estate-wide, read-only rack overview. Existing rack editor/elevations are unchanged.
        function renderRackHubV13() {
            const racks=appState.racks||[], devices=appState.devices||[], accessories=appState.rackAccessories||[];
            const totalU=racks.reduce((sum,r)=>sum+(Number(r.heightU)||0),0);
            const mounted=devices.filter(d=>isRackMountedDevice(d)&&racks.some(r=>r.id===d.rackId));
            const linkedAccessories=accessories.filter(a=>racks.some(r=>r.id===a.rackId));
            const card=(label,value,icon)=>renderInterfaceTemplate("racks/card-1",[icon,label,value]);
            let body='';
            if(v13RackSection==='overview') {
                const insights=racks.map(r=>{
                    const height=Math.max(0,Number(r.heightU)||0);
                    const rackDevices=mounted.filter(d=>d.rackId===r.id);
                    const rackAccessories=linkedAccessories.filter(a=>a.rackId===r.id);
                    const faces=['front','rear'].map(face=>{
                        const occupied=new Set();
                        const mark=(start,end)=>{if(!Number.isInteger(start)||!Number.isInteger(end)||end<start)return;for(let u=Math.max(1,start);u<=Math.min(height,end);u++)occupied.add(u);};
                        rackDevices.filter(d=>String(d.face||d.rackFace||'front').toLowerCase()===face).forEach(d=>mark(Number(d.rackUStart),Number(d.rackUEnd??d.rackUStart)));
                        rackAccessories.filter(a=>!['pdu_vertical','cable_vertical'].includes(a.type) && String(a.face||'front').toLowerCase()===face && Number(a.heightU)>0).forEach(a=>mark(Number(a.startU),Number(a.startU)+Number(a.heightU)-1));
                        let run=0,largest=0;
                        for(let u=1;u<=height;u++){run=occupied.has(u)?0:run+1;largest=Math.max(largest,run);}
                        return {face,used:occupied.size,free:height-occupied.size,largest};
                    });
                    return {rack:r,height,devices:rackDevices.length,accessories:rackAccessories.length,faces};
                });
                const totalFaceCapacity=insights.reduce((n,r)=>n+r.height*2,0);
                const usedFaceU=insights.reduce((n,r)=>n+r.faces[0].used+r.faces[1].used,0);
                const percent=totalFaceCapacity?Math.round(usedFaceU/totalFaceCapacity*100):0;
                const locations=new Map();
                insights.forEach(r=>{const name=r.rack.location||'Not recorded';const prev=locations.get(name)||{racks:0,devices:0};prev.racks++;prev.devices+=r.devices;locations.set(name,prev);});
                const tabs=[['capacity','Capacity','i-rack'],['equipment','Equipment','i-box'],['locations','Locations & Types','i-network']];
                const tabNav=tabs.map(([id,label,icon])=>`<button type="button" data-action="v13-overview-tab" data-tab="${id}" aria-pressed="${v13RackOverviewTab===id}" class="section-tab-control ${v13RackOverviewTab===id?'active':''}">${renderSectionTabIcon(icon)}${label}</button>`).join('');
                const bar=(used,height)=>`<div class="h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden" role="img" aria-label="${used} of ${height} rack units occupied"><div class="h-full bg-indigo-600 dark:bg-indigo-400" style="width:${height?Math.min(100,Math.round(used/height*100)):0}%"></div></div>`;
                const chartBox=(title,description,content)=>renderInterfaceTemplate("racks/chart-box-1",[title,description,content]);
                const chartRows=(entries,max,unit='')=>entries.map(([label,value])=>renderInterfaceTemplate("racks/chart-rows-1",[escapeHtml(String(label)),value,unit,max?Math.min(100,value/max*100):0])).join('')||'<p class="text-sm text-slate-500 dark:text-slate-400">No data recorded yet.</p>';
                // An illustrative rack diagram makes the distinction between total free U and contiguous free U explicit.
                const rackSpaceGuide=()=>{
                    const cells=Array.from({length:12},(_,i)=>{
                        const u=12-i,free=u>=7||u<=3;
                        return renderInterfaceTemplate("racks/cells-1",[u,free?'border-emerald-300 dark:border-emerald-700 bg-emerald-100 dark:bg-emerald-900/40':'border-slate-400 dark:border-slate-500 bg-slate-300 dark:bg-slate-600']);
                    }).join('');
                    return chartBox('Understanding available rack space','Illustrative 12U rack — not a live reading or an actual inventory rack.',renderInterfaceTemplate("racks/rack-space-guide-1",[cells]));
                };
                let panel='';
                if(v13RackOverviewTab==='capacity'){
                    const front=insights.reduce((n,r)=>n+r.faces[0].used,0),rear=insights.reduce((n,r)=>n+r.faces[1].used,0);
                    const faceChart=chartRows([['Front occupied',front],['Rear occupied',rear]],totalU,'U');
                    const freeChart=chartRows(insights.map(r=>[r.rack.name,Math.max(r.faces[0].largest,r.faces[1].largest)]).sort((a,b)=>b[1]-a[1]),Math.max(1,...insights.map(r=>r.height)),'U');
                    panel=renderInterfaceTemplate("racks/panel-4",[chartBox('Combined face utilisation','Front and rear rack-unit capacity are counted separately.',renderInterfaceTemplate("racks/panel-1",[bar(usedFaceU,totalFaceCapacity),usedFaceU,totalFaceCapacity-usedFaceU,percent])),chartBox('Front vs rear occupancy','Occupied units on each face, compared with physical estate height.',renderInterfaceTemplate("racks/panel-2",[faceChart])),chartBox('Largest contiguous free space','Longest uninterrupted empty U block on either the front or rear face of each rack. A rack can have more free U in total than this value.',renderInterfaceTemplate("racks/panel-3",[freeChart])),rackSpaceGuide()]);
                } else if(v13RackOverviewTab==='equipment'){
                    const counts=new Map();mounted.forEach(d=>{const name=d.type||'Unspecified';counts.set(name,(counts.get(name)||0)+1);});
                    const types=[...counts.entries()].sort((a,b)=>b[1]-a[1]);
                    panel=renderInterfaceTemplate("racks/panel-8",[chartBox('Mounted equipment by type','Each bar counts devices assigned to a rack, grouped by their recorded device type. A device is counted once.',renderInterfaceTemplate("racks/panel-5",[chartRows(types,Math.max(1,...types.map(x=>x[1])))])),chartBox('Devices and accessories by rack','Compare how many devices and rack accessories are recorded in each rack. These are item counts, not rack-unit usage.',renderInterfaceTemplate("racks/panel-7",[insights.map(r=>renderInterfaceTemplate("racks/panel-6",[escapeHtml(r.rack.name),chartRows([['Devices',r.devices],['Accessories',r.accessories]],Math.max(1,...insights.map(x=>Math.max(x.devices,x.accessories))))])).join('')||'<p class="text-sm text-slate-500">No racks recorded.</p>']))]);
                    panel+=chartBox('How to read these charts','Equipment figures describe saved inventory records, not live device status.',renderInterfaceTemplate("racks/panel-9",[]));
                } else {
                    const ranked=[...locations.entries()].sort((a,b)=>b[1].racks-a[1].racks);
                    panel=renderInterfaceTemplate("racks/panel-12",[chartBox('Racks by location','Each bar counts racks assigned to that location, regardless of rack height.',renderInterfaceTemplate("racks/panel-10",[chartRows(ranked.map(([name,value])=>[name,value.racks]),Math.max(1,...ranked.map(x=>x[1].racks)))])),chartBox('Mounted devices by location','Each bar counts devices mounted in racks at that location; unmounted devices are excluded.',renderInterfaceTemplate("racks/panel-11",[chartRows(ranked.map(([name,value])=>[name,value.devices]),Math.max(1,...ranked.map(x=>x[1].devices)))]))]);
                    panel+=chartBox('How to read location charts','Locations come from the rack records in your inventory.',renderInterfaceTemplate("racks/panel-13",[]));
                }
                body=renderInterfaceTemplate("racks/estate-overview-panel",[card('Total racks',racks.length,'fa-server'),card('Physical rack capacity',totalU+'U','fa-ruler-vertical'),card('Mounted devices',mounted.length,'fa-hard-drive'),card('Rack accessories',linkedAccessories.length,'fa-layer-group'),tabNav,panel]);
            } else if(v13RackSection==='inventory') {
                if(v13RackDetailOpen && racks.some(r=>r.id===selectedRackId)) {
                    const selected=racks.find(r=>r.id===selectedRackId);
                    body=renderRacksHTML();
                } else {
                    const rackCards=racks.map(r=>{
                        const rackDevices=mounted.filter(d=>d.rackId===r.id);
                        const rackAccessories=linkedAccessories.filter(a=>a.rackId===r.id);
                        const height=Math.max(0,Number(r.heightU)||0);
                        const occupied=new Set();
                        rackDevices.forEach(d=>{
                            const start=Number(d.rackUStart),end=Number(d.rackUEnd??d.rackUStart);
                            if(Number.isInteger(start)&&Number.isInteger(end)&&end>=start)
                                for(let u=Math.max(1,start);u<=Math.min(height,end);u++) occupied.add(u);
                        });
                        // Count each occupied U once, including horizontal accessories.
                        // Vertical 0U rails do not consume a numbered rack unit.
                        rackAccessories.filter(a=>!['pdu_vertical','cable_vertical'].includes(a.type)&&Number(a.heightU)>0)
                            .forEach(a=>{
                                const start=Number(a.startU),end=start+Number(a.heightU)-1;
                                if(Number.isInteger(start)&&Number.isInteger(end)&&end>=start)
                                    for(let u=Math.max(1,start);u<=Math.min(height,end);u++)occupied.add(u);
                            });
                        const percent=height?Math.round(occupied.size/height*100):0;
                        const name=escapeHtml(r.name||'Unnamed rack'),location=escapeHtml(r.location||'Not recorded'),type=escapeHtml(r.type||'Not recorded');
                        const search=escapeHtml((r.name||'')+' '+(r.location||''));
                        return renderInterfaceTemplate("racks/rack-cards-2",[search,escapeHtml(r.id),name,location,height,type,percent,percent,occupied.size,rackDevices.length,rackAccessories.length])
                    }).join('');
                    body=renderInterfaceTemplate("racks/inventory-panel",[rackCards||'<p class="rack-note">No racks recorded yet. Add a rack to get started.</p>']);
                }
            } else {
                body=renderInterfaceTemplate("racks/accessories-panel",[racks.map(r=>{const items=linkedAccessories.filter(a=>a.rackId===r.id);return renderInterfaceTemplate("racks/accessory-directory-entry",[escapeHtml(r.id),escapeHtml(r.name),items.length,items.filter(a=>rackAccessoryTypeDefinitions[a.type]?.vertical).length,escapeHtml(r.location||'Not recorded'),escapeHtml(String(r.heightU))]);}).join('')||'<p class="rack-note">No racks recorded yet.</p>']);
            }
            return renderInterfaceTemplate("racks/render-rack-hub-v13-1",[body]);
        }

        document.addEventListener('change', event => {
            if (event.target?.id !== 'v13-rack-detail-select') return;
            const rack = appState.racks.find(r => r.id === event.target.value);
            if (!rack) return;
            selectedRackId = rack.id;
            activeRackTab = 'view';
            renderContent();
        });

        function renderRacksHTML() {
            const currentRack = appState.racks.find(r => r.id === selectedRackId) || appState.racks[0];

            if (!currentRack) {
                return renderInterfaceTemplate("racks/render-racks-html-1",[]);
            }

            const rackDevices = appState.devices.filter(d => isRackMountedDevice(d)&&d.rackId === currentRack.id);
            const faceDevices = rackDevices.filter(d => (d.face || 'front') === activeRackFace);
            const rackAccessories=(appState.rackAccessories||[]).filter(a=>a.rackId===currentRack.id);
            const faceAccessories=rackAccessories.filter(a=>a.face===activeRackFace && !rackAccessoryTypeDefinitions[a.type]?.vertical);
            const verticalAccessories=rackAccessories.filter(a=>a.face===activeRackFace && rackAccessoryTypeDefinitions[a.type]?.vertical);

            const faceUUsed = faceDevices.reduce((acc, d) => {
                const height = (parseInt(d.rackUEnd || d.rackUStart) - parseInt(d.rackUStart) + 1) || 1;
                return acc + height;
            }, 0);
            const accessoryUUsed=faceAccessories.reduce((sum,a)=>sum+a.heightU,0);
            const totalCapacityPercent = Math.min(100, Math.round(((faceUUsed+accessoryUUsed) / currentRack.heightU) * 100));

            const uMap = {};
            faceDevices.forEach(d => {
                const start = parseInt(d.rackUStart);
                const end = parseInt(d.rackUEnd || d.rackUStart);
                const minU = Math.min(start, end);
                const maxU = Math.max(start, end);
                for (let u = minU; u <= maxU; u++) {
                    uMap[u] = { device: d, isTopSlot: u === maxU };
                }
            });

            faceAccessories.forEach(a=>{for(let u=a.startU;u<a.startU+a.heightU;u++)uMap[u]={accessory:a,isTopSlot:u===a.startU+a.heightU-1};});
            let rackSlotsHtml = '';
            const heightU = currentRack.heightU || 42;

            for (let u = heightU; u >= 1; u--) {
                const occupancy = uMap[u];
                if (occupancy) {
                    if (occupancy.accessory) {
                        if(occupancy.isTopSlot){
                            const a=occupancy.accessory, kind=rackAccessoryTypeDefinitions[a.type]||rackAccessoryTypeDefinitions.blank;
                            rackSlotsHtml+=renderInterfaceTemplate("racks/rack-slots-html-1",[escapeHtml(a.id),a.face==='rear'?'rear':'front',u,escapeHtml(currentRack.id),a.heightU*40,escapeHtml(a.name||kind.label),kind.label,a.heightU,a.face,a.face==='rear'?'rear':'front',a.heightU===1?`U${a.startU}`:`U${a.startU}–${a.startU+a.heightU-1}`,escapeHtml(a.name||kind.label),escapeHtml(kind.label),escapeHtml(a.id),escapeHtml(a.name||kind.label),escapeHtml(a.id),escapeHtml(a.name||kind.label)]);
                        }
                        continue;
                    }
                    if (occupancy.isTopSlot) {
                        const dev = occupancy.device;
                        const start = parseInt(dev.rackUStart);
                        const end = parseInt(dev.rackUEnd || dev.rackUStart);
                        const span = Math.abs(end - start) + 1;
                        const isRear = dev.face === 'rear';
                        const badgeBg = isRear ? 'bg-purple-600 text-white' : 'bg-emerald-600 text-white';
                        const borderCol = isRear 
                            ? 'border-purple-300 dark:border-purple-800 bg-purple-50/90 dark:bg-purple-950/40' 
                            : 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/90 dark:bg-emerald-950/40';

                        rackSlotsHtml += renderInterfaceTemplate("racks/rack-slots-html-2",[escapeHtml(dev.id),isRear?'rear':'front',u,escapeHtml(currentRack.id),span*40,escapeHtml(dev.name),escapeHtml(dev.type),escapeHtml(dev.primaryIp||'No IP'),span,dev.face||'front',isRear?'rear':'front',span===1?`U${start}`:`U${start}–${end}`,escapeHtml(dev.name),escapeHtml(dev.type||'Device'),escapeHtml(dev.primaryIp||'No IP recorded'),escapeHtml(dev.id),escapeHtml(currentRack.id),start,escapeHtml(dev.name),escapeHtml(dev.id),escapeHtml(dev.name)]);
                    }
                    continue;
                } else {
                    rackSlotsHtml += renderInterfaceTemplate("racks/rack-slots-html-3",[u,activeRackFace,escapeHtml(currentRack.name),u,escapeHtml(currentRack.id),escapeHtml(currentRack.id),u,u,activeRackFace]);
                }
            }

            return renderInterfaceTemplate("racks/render-racks-html-11",[escapeHtml(currentRack.name),escapeHtml(currentRack.location||'Not recorded'),escapeHtml(currentRack.heightU),escapeHtml(currentRack.type||'Not recorded'),escapeHtml(formatRackDimension(currentRack.widthMm ?? currentRack.width)),escapeHtml(formatRackDimension(currentRack.depthMm ?? currentRack.depth)),appState.racks.map(r=>`<option value="${escapeHtml(r.id)}" ${r.id===currentRack.id?'selected':''}>${escapeHtml(r.name)}</option>`).join(''),escapeHtml(currentRack.id),[['view','Rack View','i-rack'],['equipment','Equipment','i-box'],['settings','Rack Settings','i-settings']].map(([key,label,icon])=>`<button type="button" role="tab" data-action="select-rack-tab" data-tab="${key}" aria-selected="${activeRackTab===key}" class="section-tab-control ${activeRackTab===key?'active':''}">${renderSectionTabIcon(icon)}${label}</button>`).join(''),activeRackTab==='view'?'':'hidden',activeRackFace==='rear'?'rear':'',escapeHtml(currentRack.name),activeRackFace==='front'?'Front':'Rear',faceDevices.length,faceAccessories.length,getOccupiedRackUnits(currentRack,activeRackFace).percent,activeRackFace==='front',activeRackFace==='front'?'active':'',activeRackFace==='rear',activeRackFace==='rear'?'active':'',Number(currentRack.heightU) > 12 ? 'true' : 'false',activeRackFace.toUpperCase(),renderRackVerticalAccessoryRail(currentRack,verticalAccessories,"left"),rackSlotsHtml,renderRackVerticalAccessoryRail(currentRack,verticalAccessories,"right"),activeRackFace,activeRackFace,escapeHtml(currentRack.location || 'Server Room'),currentRack.heightU,['front','rear'].map(face=>{const used=getOccupiedRackUnits(currentRack,face);return renderInterfaceTemplate("racks/render-racks-html-2",[face==='front'?'Front':'Rear',used.occupied,used.available,face==='rear'?'rear':'',used.percent]);}).join(''),[['Location',currentRack.location||'Not recorded'],['Physical rack height',currentRack.heightU+'U'],['Front mounted devices',rackDevices.filter(d=>(d.face||'front')==='front').length],['Rear mounted devices',rackDevices.filter(d=>(d.face||'front')==='rear').length],['Selected face occupancy',getOccupiedRackUnits(currentRack,activeRackFace).occupied+'U / '+currentRack.heightU+'U']].map(([k,v])=>renderInterfaceTemplate("racks/render-racks-html-3",[escapeHtml(k),escapeHtml(String(v))])).join(''),escapeHtml(currentRack.id),activeRackFace,[1,2,3,4].map(n=>`<button type="button" class="${rackAccessoryPlacementHeightU===n?'active':''}" data-action="select-rack-accessory-height" data-height="${n}">${n}U</button>`).join(''),(()=>{const positions=findAvailableRackUnitRanges(currentRack,activeRackFace,rackAccessoryPlacementHeightU);return renderInterfaceTemplate("racks/render-racks-html-5",[positions.length?renderInterfaceTemplate("racks/render-racks-html-4",[positions.length,positions[0],rackAccessoryPlacementHeightU>1?'–U'+(positions[0]+rackAccessoryPlacementHeightU-1):'']):'No contiguous space for this height on the selected face.',positions[0]??'',positions.length?'':'disabled']);})(),activeRackFace==='front'?'Rear':'Front',rackDevices.filter(d=>(d.face||'front')!==activeRackFace).map(d=>renderInterfaceTemplate("racks/render-racks-html-6",[escapeHtml(d.name),escapeHtml(String(d.rackUStart)),escapeHtml(d.primaryIp||'No IP'),escapeHtml(d.face||'front'),escapeHtml(String(d.rackUStart))])).join('')||'<p class="rack-note">No devices mounted on the opposite face.</p>',activeRackTab==='equipment'?'':'hidden',(()=>{const ds=[...faceDevices].sort((a,b)=>Number(b.rackUStart)-Number(a.rackUStart));const acc=[...faceAccessories,...verticalAccessories];return renderInterfaceTemplate("racks/render-racks-html-9",[activeRackFace==='front'?'Front':'Rear',ds.length,rackDevices.length,activeRackFace==='front',activeRackFace==='front'?'active':'',activeRackFace==='rear',activeRackFace==='rear'?'active':'',acc.length,acc.map(a=>renderInterfaceTemplate("racks/render-racks-html-7",[escapeHtml(a.name||rackAccessoryTypeDefinitions[a.type]?.label||'Accessory'),rackAccessoryTypeDefinitions[a.type]?.vertical?(activeRackFace==='front'?'Front':'Rear')+' '+(a.side==='right'?'Right':'Left')+' 0U rail':(activeRackFace==='front'?'Front':'Rear')+' · U'+a.startU+'–'+(Number(a.startU)+Number(a.heightU)-1),escapeHtml(rackAccessoryTypeDefinitions[a.type]?.label||a.type),escapeHtml(a.id)])).join('')||'<tr><td colspan="4">No accessories on this face.</td></tr>',ds.map(d=>renderInterfaceTemplate("racks/render-racks-html-8",[escapeHtml(d.name),activeRackFace==='front'?'Front':'Rear',escapeHtml(String(d.rackUStart)),Number(d.rackUEnd)>Number(d.rackUStart)?'–U'+escapeHtml(String(d.rackUEnd)):'',escapeHtml(d.primaryIp||'—'),activeRackFace,escapeHtml(String(d.rackUStart))])).join('')||'<tr><td colspan="5">No devices mounted on this face.</td></tr>']);})(),activeRackTab==='settings'?'':'hidden',[['Rack name',currentRack.name],['Location',currentRack.location||'Not set'],['Rack type',currentRack.type||'Not recorded'],['Height',currentRack.heightU+'U'],['Width',formatRackDimension(currentRack.widthMm ?? currentRack.width)],['Depth',formatRackDimension(currentRack.depthMm ?? currentRack.depth)],['Mounted devices',rackDevices.length],['Accessories',rackAccessories.length]].map(([name,value])=>renderInterfaceTemplate("racks/render-racks-html-10",[escapeHtml(name),escapeHtml(String(value))])).join(''),escapeHtml(currentRack.id),escapeHtml(currentRack.id),escapeHtml(currentRack.id)]);
        }

        function changeRack(id) {
            selectedRackId = id;
            renderContent();
        }

        // --- DEVICES VIEW (With Manage Type & Location Buttons) ---
        let activeDeviceDetailsTab = 'overview';
        let deviceIntelligenceTab = 'overview';
        let deviceOsFilter = '';
        let deviceServiceFilter = '';
        let deviceMissingFilter = '';
        let deviceSearchTerm = '';
        let deviceTypeFilter = '';
        let deviceStatusFilter = '';
        let deviceAssignmentFilter = '';
        let deviceLocationFilter = '';
        let deviceMountFilter = '';
        let deviceHardwareFilter = null;
        let deviceSort = 'name-asc';
        function getEffectiveDevicePlatform(device) {
            const details = device?.typeDetails || {};
            const hypervisor = device?.type === 'Server - Physical' &&
                (details.serverService_Hypervisor === true || device.serverService_Hypervisor === true);
            // A hypervisor host must never be counted under its preserved historical guest/host OS.
            return String(hypervisor ? (details.hypervisorProduct || '') : (details.softwarePlatform || details.os || '')).trim() || 'Not Recorded';
        }
        function getEffectiveDevicePlatformVersion(device) {
            const details = device?.typeDetails || {};
            return device?.type === 'Server - Physical' &&
                (details.serverService_Hypervisor === true || device.serverService_Hypervisor === true)
                ? String(details.hypervisorVersion || '').trim() : String(details.softwareVersion || '').trim();
        }
        function getVisibleDevices() {
            const term = deviceSearchTerm.trim().toLowerCase();
            // Build the rack index once per filter operation, not once per device.
            const validRackIds = deviceMountFilter ? new Set(appState.racks.map(r => String(r.id))) : null;
            const filtered = appState.devices.filter(d =>
                (!deviceOsFilter || getEffectiveDevicePlatform(d) === deviceOsFilter) &&
                (!deviceServiceFilter || d.typeDetails?.[deviceServiceFilter] === true) &&
                (!deviceMissingFilter || (deviceMissingFilter==='ip' ? !String(d.primaryIp||'').trim() : deviceMissingFilter==='type' ? (!String(d.type||'').trim() || d.type==='Unknown') : deviceMissingFilter==='location' ? (!String(d.location||'').trim() || d.location==='Unknown') : false)) &&
                (!deviceTypeFilter || d.type === deviceTypeFilter) &&
                (!deviceStatusFilter || (d.status || 'Active') === deviceStatusFilter) &&
                (!deviceAssignmentFilter || (deviceAssignmentFilter === 'assigned' ? Boolean(d.primaryIp && appState.subnets.some(n => (!n.kind || n.kind === 'network') && ipBelongsToSubnet(d.primaryIp,n.cidr))) : !d.primaryIp || !appState.subnets.some(n => (!n.kind || n.kind === 'network') && ipBelongsToSubnet(d.primaryIp,n.cidr)))) &&
                (!deviceLocationFilter || (d.location || 'Unknown') === deviceLocationFilter) &&
                (!deviceMountFilter || (deviceMountFilter === 'racked' ? validRackIds.has(String(d.rackId)) : !validRackIds.has(String(d.rackId)))) &&
                (!deviceHardwareFilter || (String(d[deviceHardwareFilter.field]||'').trim() || 'Not Recorded') === deviceHardwareFilter.value) &&
                (!term || [d.name, d.primaryIp, d.type, d.location, d.manufacturer, d.model, d.serialNumber].some(v => String(v || '').toLowerCase().includes(term)))
            );
            const [field, direction] = deviceSort.split('-');
            const property = {name:'name', type:'type', location:'location', ip:'primaryIp'}[field] || 'name';
            return filtered.sort((a,b) => {
                const left = String(a[property] || '');
                const right = String(b[property] || '');
                const cmp = left.localeCompare(right, undefined, {numeric:true, sensitivity:'base'});
                return (direction === 'desc' ? -cmp : cmp) || String(a.id).localeCompare(String(b.id));
            });
        }
        function filterHardwareModels(){
            const query=(document.getElementById('model-search')?.value||'').trim().toLocaleLowerCase();
            const maker=(document.getElementById('hardware-model-manufacturer-filter')?.value||'').toLocaleLowerCase();
            const type=(document.getElementById('model-type')?.value||'').toLocaleLowerCase();
            const source=(document.getElementById('model-source')?.value||'').toLocaleLowerCase();
            const inUse=!!document.getElementById('hardware-model-in-use')?.checked;
            let shown=0;
            document.querySelectorAll('[data-model-row]').forEach(row=>{
                const visible=row.dataset.modelRow.includes(query)&&(!maker||row.dataset.modelMaker===maker)&&(!type||row.dataset.modelType===type)&&(!source||row.dataset.modelSources.split('|').includes(source))&&(!inUse||Number(row.dataset.modelDevices)>0);
                row.hidden=!visible;row.classList.toggle('hidden',!visible);
                if(visible)shown++;
            });
            const count=document.getElementById('hardware-model-count');
            if(count)count.textContent=shown+' models shown';
            document.getElementById('model-empty')?.classList.toggle('hidden',shown!==0);
        }
        document.addEventListener('input',function(event){
            if(event.target?.id==='service-search'){
                const query=event.target.value.trim().toLowerCase();
                const rows=[...document.querySelectorAll('[data-service-row]')];
                rows.forEach(row=>{row.hidden=!row.dataset.serviceRow.includes(query);row.classList.toggle('hidden',row.hidden);});
                const count=document.getElementById('service-count');
                if(count)count.textContent=rows.filter(row=>!row.classList.contains('hidden')).length+' services shown';
            } else if(event.target?.id==='manufacturer-search'){
                const query=event.target.value.trim().toLocaleLowerCase();
                const rows=[...document.querySelectorAll('[data-manufacturer-row]')];
                rows.forEach(row=>{row.hidden=!row.dataset.manufacturerRow.includes(query);row.classList.toggle('hidden',row.hidden);});
                const count=document.getElementById('hardware-manufacturer-count');
                if(count)count.textContent=rows.filter(row=>!row.hidden).length+' manufacturers shown';
            } else if(['model-search','hardware-model-manufacturer-filter','model-type','model-source','hardware-model-in-use'].includes(event.target?.id))filterHardwareModels();
        });
        document.addEventListener('change',function(event){
            if(['hardware-model-manufacturer-filter','model-type','model-source','hardware-model-in-use'].includes(event.target?.id))filterHardwareModels();
        });
        // Read-only catalogue overview. Suggestions and device records remain untouched.


        // One manufacturer identity can have many device-type associations.
        // Persist each association as a legacy-compatible manufacturer-only catalogue row.
        function openCatalogueModal(title, subtitle, fields, actions, note, formAttrs='') {
          // The structure and classes are from pinned Devices Management.
          openModal(renderInterfaceTemplate("device-management/open-catalogue-modal-1",[escapeHtml(title),escapeHtml(subtitle),formAttrs,fields,escapeHtml(note),actions]));
          const content=document.getElementById('modal-content');
          content.classList.add('catalogue-modal');
          document.getElementById('modal-container').classList.add('catalog-modal-overlay');
          const heading=content.querySelector('.catalog-modal-head h2');
          if(heading){heading.id='catalog-modal-title';content.setAttribute('aria-labelledby',heading.id);}
        }
                function openHardwareManufacturerManager(id='',deleting=false) {
            const entry=getConfiguredHardwareCatalogueEntries().find(x=>x.id===id&&!x.model);
            const builtInName=typeof id==='string'&&id.startsWith('builtin:')?id.slice(8):'';
            const makerName=entry?.manufacturer||builtInName;
            const originalMaker=[...new Set([...Object.values(builtInHardwareSuggestions).flatMap(m=>Object.keys(m)),'Dell','HP','HPE','Lenovo','ASUS','Apple','Cisco','Samsung','Microsoft','Toshiba'])].find(n=>[n,String(getHardwareSeedPreferences()['maker:'+n.toLowerCase()]?.label||n)].some(label=>label.toLowerCase()===String(makerName||'').toLowerCase()))||makerName;
            const seedTypes=Object.entries(builtInHardwareSuggestions).filter(([type,m])=>Object.keys(m).some(n=>n.toLowerCase()===String(originalMaker||'').toLowerCase())).map(([type])=>type);
            const globalDefaults=['Dell','HP','HPE','Lenovo','ASUS','Apple','Cisco','Samsung','Microsoft','Toshiba'];
            const isBuiltIn=seedTypes.length>0||globalDefaults.some(n=>n.toLowerCase()===String(originalMaker||'').toLowerCase());
            if(id&&!entry&&!builtInName)return;
            const matches=makerName?getConfiguredHardwareCatalogueEntries().filter(x=>!x.model&&x.manufacturer.toLowerCase()===makerName.toLowerCase()):[];
            const selected=new Set([...matches.map(x=>x.type),...seedTypes]);
            const types=[...new Set([...(appState.deviceTypes||[]),...Object.keys(builtInHardwareSuggestions),...selected])].filter(t=>t&&t!=='Server - Virtual').sort();
            const affected=makerName?appState.devices.filter(d=>String(d.manufacturer||'').toLowerCase()===makerName.toLowerCase()).length:0;
            const checks=types.map(t=>renderInterfaceTemplate("device-management/checks-1",[escapeHtml(t),selected.has(t)?'checked':'',seedTypes.includes(t)?'disabled':'',escapeHtml(t)])).join('');
            const fields=deleting
              ? renderInterfaceTemplate("device-management/fields-1",[escapeHtml(entry.manufacturer),matches.length,affected])
              : renderInterfaceTemplate("device-management/fields-2",[escapeHtml(makerName||''),isBuiltIn?'readonly':'',isBuiltIn?'<p class="catalog-modal-info">Built-in manufacturer names and default associations are protected. You may add custom associations.</p>':'',checks]);
            const actions=renderInterfaceTemplate("device-management/actions-1",[deleting?'confirm-remove-catalogue-manufacturer':'save-catalogue-manufacturer',escapeHtml(id),deleting?'btn-outline':'btn-primary',deleting?'Remove Suggestions':'Save Manufacturer']);
            openCatalogueModal(deleting?'Remove Manufacturer Suggestions':makerName?'Manage Manufacturer':'Add Manufacturer',
              'Associate a manufacturer with multiple device types. Built-in suggestions, model entries and existing device records are retained.',
              fields,actions,deleting?'Custom suggestions can be removed without deleting saved devices.':'Changes to manufacturer associations do not change recorded devices.',
              deleting?'':'id="manufacturer-form" data-form-action="manufacturer"');
            if(!deleting)rememberModalForm();
        }
        async function saveHardwareManufacturer(id='',remove=false){
            const items=getConfiguredHardwareCatalogueEntries().map(x=>({...x}));
            const entry=items.find(x=>x.id===id&&!x.model);
            const builtInName=typeof id==='string'&&id.startsWith('builtin:')?id.slice(8):'';
            const makerName=entry?.manufacturer||builtInName;
            const originalMaker=[...new Set([...Object.values(builtInHardwareSuggestions).flatMap(m=>Object.keys(m)),'Dell','HP','HPE','Lenovo','ASUS','Apple','Cisco','Samsung','Microsoft','Toshiba'])].find(n=>[n,String(getHardwareSeedPreferences()['maker:'+n.toLowerCase()]?.label||n)].some(label=>label.toLowerCase()===String(makerName||'').toLowerCase()))||makerName;
            const seedTypes=Object.entries(builtInHardwareSuggestions).filter(([type,m])=>Object.keys(m).some(n=>n.toLowerCase()===String(originalMaker||'').toLowerCase())).map(([type])=>type);
            const builtIn=seedTypes.length>0||['Dell','HP','HPE','Lenovo','ASUS','Apple','Cisco','Samsung','Microsoft','Toshiba'].some(n=>n.toLowerCase()===String(originalMaker||'').toLowerCase());
            if(id&&!entry&&!builtInName)return;
            if(remove&&builtIn){showToast('Built-in manufacturers cannot be removed.','error');return;}
            const previousName=makerName?.toLowerCase();
            const existing=previousName?items.filter(x=>!x.model&&x.manufacturer.toLowerCase()===previousName):[];
            let name='',types=[];
            if(!remove){
                const field=document.getElementById('manufacturer-name');
                const error=document.getElementById('manufacturer-error');
                name=String(field?.value||'').trim();
                types=[...document.querySelectorAll('input[name="catalogue-manufacturer-device-type"]:checked')].map(x=>x.value);
                types.push(...seedTypes);
                types=[...new Set(types)];
                const message=builtIn&&name.toLowerCase()!==makerName.toLowerCase()?'Built-in manufacturer names cannot be changed.':!name?'Enter a manufacturer name.':name.length>120?'Manufacturer name must be 120 characters or fewer.':!types.length?'Select at least one device type.':types.some(t=>items.some(x=>!x.model&&!existing.includes(x)&&x.type===t&&x.manufacturer.toLowerCase()===name.toLowerCase()))?'This manufacturer already has a custom association for a selected device type.':'';
                if(message){if(error){error.textContent=message;error.classList.remove('hidden');}field?.focus();return;}
            }
            // Only manufacturer-only rows are managed here. Model rows remain untouched.
            const keep=items.filter(x=>!existing.includes(x));
            if(!remove){
                types.filter(type=>!seedTypes.includes(type)).forEach(type=>{
                    const old=existing.find(x=>x.type===type);
                    keep.push(old?{...old,manufacturer:name}:{id:'hardware_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,9),type,manufacturer:name,model:''});
                });
            }
            const previous=appState.hardwareCatalogue;
            appState.hardwareCatalogue=keep;
            if(!await nextSettingsBridge.save('hardwareCatalogue')){if(previous===undefined)delete appState.hardwareCatalogue;else appState.hardwareCatalogue=previous;showToast('Could not save the catalogue.','error');return;}
            closeModal(true);
            renderContent();
            showToast(remove?'Manufacturer suggestions removed.':'Manufacturer saved.');
        }
        function openBuiltInManufacturerEditor(original) {
            const defaults=['Dell','HP','HPE','Lenovo','ASUS','Apple','Cisco','Samsung','Microsoft','Toshiba'];
            const known=defaults.includes(original)||Object.values(builtInHardwareSuggestions).some(m=>Object.keys(m).includes(original));
            if(!known)return;
            const pref=getHardwareSeedPreferences()['maker:'+original.toLowerCase()]||{};
            const assigned=appState.devices.filter(d=>[original,String(pref.label||original)].some(name=>String(d.manufacturer||'').trim().toLowerCase()===name.trim().toLowerCase()));
            const fields=renderInterfaceTemplate("device-management/fields-4",[escapeHtml(pref.label||original),pref.hidden?'checked':'',assigned.length?'disabled':'',assigned.length?renderInterfaceTemplate("device-management/fields-3",[assigned.slice(0,5).map(d=>escapeHtml(d.name||d.hostname||d.id||'Unnamed device')).join(', ')]):'']);
            const actions=renderInterfaceTemplate("device-management/actions-2",[escapeHtml(original)]);
            openCatalogueModal('Manage Built-in Manufacturer',
              `Original: ${original}. Existing devices and historical backups remain unchanged.`,
              fields,actions,'Built-in manufacturer suggestions have editable display and visibility preferences. Original identities and saved devices are retained.');
        }
        async function saveBuiltInManufacturerOverride(original){
            const defaults=['Dell','HP','HPE','Lenovo','ASUS','Apple','Cisco','Samsung','Microsoft','Toshiba'];
            if(!defaults.includes(original)&&!Object.values(builtInHardwareSuggestions).some(m=>Object.keys(m).includes(original)))return;
            const label=String(document.getElementById('built-in-manufacturer-name')?.value||'').trim();
            const hidden=!!document.getElementById('built-in-manufacturer-hidden')?.checked;
            const error=document.getElementById('built-in-manufacturer-error');
            if(!label||label.length>120){if(error)error.textContent='Enter a manufacturer name of up to 120 characters.';return;}
            if(hidden&&appState.devices.some(d=>[original,String(getHardwareSeedPreferences()['maker:'+original.toLowerCase()]?.label||original)].some(name=>String(d.manufacturer||'').trim().toLowerCase()===name.trim().toLowerCase()))){if(error)error.textContent='Manufacturer is assigned to devices and cannot be hidden.';return;}
            const prefs=getHardwareSeedPreferences();
            const duplicates=[...new Set([...Object.values(builtInHardwareSuggestions).flatMap(m=>Object.keys(m)),...defaults,...getConfiguredHardwareCatalogueEntries().map(x=>x.manufacturer)])].filter(n=>n.toLowerCase()!==original.toLowerCase());
            if(duplicates.some(n=>String(prefs['maker:'+n.toLowerCase()]?.label||n).toLowerCase()===label.toLowerCase())){if(error)error.textContent='Another manufacturer suggestion already uses that name.';return;}
            const previous=appState.hardwareSeedPreferences;
            appState.hardwareSeedPreferences={...prefs,['maker:'+original.toLowerCase()]:{label,hidden}};
            if(!await nextSettingsBridge.save('hardwareSeedPreferences')){if(previous===undefined)delete appState.hardwareSeedPreferences;else appState.hardwareSeedPreferences=previous;showToast('Could not save manufacturer preference.','error');return;}
            closeModal(true);renderContent();showToast('Built-in manufacturer preference saved.');
        }
        // Approved catalogue markup with existing protected actions and saved data.
        function renderCatalogueButton(label, action, attributes='') {
            return renderInterfaceTemplate("device-management/source-button",[
                `data-action="${action}" ${attributes}`,escapeHtml(label)]);
        }
        function renderCatalogueRecord(attributes, name, source, description, controls) {
            const tone=source==='Custom'?' pill-custom':source==='Archived'?' pill-archived':'';
            const badge=source?`<span class="catalog-pill${tone}">${escapeHtml(source)}</span>`:'';
            return renderInterfaceTemplate("device-management/source-record",[attributes,escapeHtml(name),badge,escapeHtml(description),controls]);
        }
        function renderDeviceCategoryCatalogue(kind) {
            const isType=kind==='type',field=isType?'type':'location';
            const values=isType?getUniqueDeviceTypes():getUniqueDeviceLocations();
            const counts=new Map();
            appState.devices.forEach(device=>{
                const value=String(device[field]||'').trim();
                const key=!value||value==='Unknown'?'Not Recorded':value;
                counts.set(key,(counts.get(key)||0)+1);
            });
            const rows=[...new Set([...values.filter(value=>value&&value!=='Unknown'),'Not Recorded'])]
                .map(name=>({name,label:isType?(name==='Server - Physical'?'Server':name==='Server - Virtual'?'Virtual Machine':name):name,count:counts.get(name)||0}))
                .filter(row=>row.count||row.name!=='Not Recorded').sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label));
            const markup=rows.map(({name,label,count})=>renderCatalogueRecord(
                `data-catalog-row="${field}" data-filter-text="${escapeHtml(label.toLowerCase())}"`,label,
                name==='Not Recorded'?'Protected':'',`${count} device${count===1?'':'s'} in inventory`,
                renderCatalogueButton('View Devices','open-catalogue-details',`data-kind="${field}" data-name="${escapeHtml(name)}"`))).join('');
            return renderInterfaceTemplate(isType?"device-management/source-types":"device-management/source-locations",[
                values.length,appState.devices.length,counts.get('Not Recorded')||0,markup||'<p class="catalog-aside-note">No devices recorded yet. Add a device to populate this overview.</p>',`Showing ${rows.length} categories`]);
        }
        function renderHardwareManufacturersHtml() {
            const map=new Map();
            function add(name,source,type,model) {
                name=String(name||'').trim();
                if(!name)return;
                const key=name.toLocaleLowerCase();
                if(!map.has(key))map.set(key,{name,sources:new Set(),types:new Set(),models:new Set(),devices:0});
                const item=map.get(key);
                item.sources.add(source);
                if(type)item.types.add(type);
                if(model)item.models.add(model);
            }
            Object.entries(getVisibleBuiltInHardwareSuggestions()).forEach(([type,m])=>Object.keys(m).forEach(name=>add(name,'Built-in',type)));
            const defaultMakers=['Dell','HP','HPE','Lenovo','ASUS','Apple','Cisco','Samsung','Microsoft','Toshiba'];
            defaultMakers.forEach(original=>{
                const pref=getHardwareSeedPreferences()['maker:'+original.toLowerCase()]||{};
                if(!pref.hidden)add(String(pref.label||original).trim()||original,'Built-in');
            });
            const makerOrigins=new Map();
            [...new Set([...Object.values(builtInHardwareSuggestions).flatMap(m=>Object.keys(m)),...defaultMakers])].forEach(original=>{
                const pref=getHardwareSeedPreferences()['maker:'+original.toLowerCase()]||{};
                if(!pref.hidden)makerOrigins.set(String(pref.label||original).trim().toLowerCase(),original);
            });
            const hiddenMakers=[...new Set([...Object.values(builtInHardwareSuggestions).flatMap(m=>Object.keys(m)),...defaultMakers])].filter(original=>getHardwareSeedPreferences()['maker:'+original.toLowerCase()]?.hidden);
            getConfiguredHardwareCatalogueEntries().forEach(x=>add(x.manufacturer,'Custom',x.type,x.model));
            appState.devices.forEach(d=>{
                add(d.manufacturer,'Inventory',d.type,d.model);
                const item=map.get(String(d.manufacturer||'').trim().toLocaleLowerCase());
                if(item)item.devices++;
            });
            const items=[...map.values()].sort((a,b)=>a.name.localeCompare(b.name));
            const summary=[['Manufacturers',items.length],['Used in Inventory',items.filter(x=>x.devices>0).length],['Custom Suggestions',items.filter(x=>x.sources.has('Custom')).length]];
            const rows=items.map(item=>{
                const key=getConfiguredHardwareCatalogueEntries().find(entry=>entry.manufacturer.toLowerCase()===item.name.toLowerCase()&&!entry.model)?.id||'builtin:'+item.name;
                let controls=renderCatalogueButton('View Devices','device-hardware-drilldown',`data-field="manufacturer" data-value="${escapeHtml(item.name)}"`);
                if(makerOrigins.has(item.name.toLowerCase()))controls+=renderCatalogueButton('Manage Suggestion','built-in-manufacturer-edit',`data-name="${escapeHtml(makerOrigins.get(item.name.toLowerCase()))}"`);
                controls+=renderCatalogueButton(item.sources.has('Built-in')?'Device Types':'Edit','manufacturer-edit',`data-name="${escapeHtml(key)}"`);
                if(!item.sources.has('Built-in')&&!key.startsWith('builtin:'))controls+=renderCatalogueButton('Remove','manufacturer-remove',`data-name="${escapeHtml(key)}"`);
                return renderCatalogueRecord(`data-manufacturer-row="${escapeHtml(item.name.toLowerCase())}"`,item.name,item.sources.has('Built-in')?'Built-in':item.sources.has('Custom')?'Custom':'Recorded',
                    `${[...item.types].join(', ')} · ${item.devices} device${item.devices===1?'':'s'} in inventory`,controls);
            }).join('');
            const hiddenRows=hiddenMakers.map(name=>renderCatalogueRecord('',name,'Archived','Hidden from new suggestions',renderCatalogueButton('Manage / Restore','built-in-manufacturer-edit',`data-name="${escapeHtml(name)}"`))).join('');
            const hidden=hiddenRows?renderInterfaceTemplate("device-management/source-hidden",['Hidden Built-in Manufacturers',hiddenRows]):'';
            return renderInterfaceTemplate("device-management/source-manufacturers",[...summary.map(([,count])=>count),rows,`${items.length} manufacturers shown`,'','','',0,hidden]);
        }


        function getNonVirtualDeviceTypesAssociatedWithManufacturer(manufacturer){
            const key=String(manufacturer||'').trim().toLowerCase();
            if(!key)return [];
            const builtin=Object.entries(getVisibleBuiltInHardwareSuggestions()).filter(([type,makers])=>type!=='Server - Virtual'&&Object.keys(makers).some(m=>m.toLowerCase()===key)).map(([type])=>type);
            const custom=getConfiguredHardwareCatalogueEntries().filter(x=>!x.model&&x.manufacturer.toLowerCase()===key&&x.type!=='Server - Virtual').map(x=>x.type);
            return [...new Set([...builtin,...custom])].sort((a,b)=>a.localeCompare(b));
        }
        function refreshModelDeviceTypeChoices(){
            const maker=document.getElementById('hardware-model-manufacturer-select'),field=document.getElementById('model-device-type');
            if(!maker||!field)return;
            const previous=field.value,allowed=getNonVirtualDeviceTypesAssociatedWithManufacturer(maker.value);
            const legacy=field.dataset.originalType||'',same=maker.value===field.dataset.originalMaker;
            field.innerHTML='<option value="">'+(maker.value?'Select Device Type':'Select Manufacturer First')+'</option>'+allowed.map(t=>'<option value="'+escapeHtml(t)+'">'+escapeHtml(t)+'</option>').join('')+(same&&legacy&&!allowed.includes(legacy)?'<option value="'+escapeHtml(legacy)+'">'+escapeHtml(legacy)+' (Existing Association)</option>':'');
            field.disabled=!maker.value;
            field.value=[...field.options].some(o=>o.value===previous)?previous:(same&&legacy?legacy:'');
            const note=document.getElementById('hardware-model-device-type-note');
            if(note)note.textContent=!maker.value?'Select a manufacturer first.':allowed.length?'Only device types associated with '+maker.value+' are offered.':'No associations yet. Add one in Manufacturers first.';
        }
        document.addEventListener('change',e=>{if(e.target?.id==='hardware-model-manufacturer-select')refreshModelDeviceTypeChoices();});
        function openHardwareModelManager(id='',remove=false) {
            const item=getConfiguredHardwareCatalogueEntries().find(x=>x.id===id&&x.model);
            if(id&&!item)return;
            const makers=new Set([...Object.values(getVisibleBuiltInHardwareSuggestions()).flatMap(x=>Object.keys(x)),...getConfiguredHardwareCatalogueEntries().map(x=>x.manufacturer),...appState.devices.map(x=>x.manufacturer)].filter(Boolean));
            const types=item?getNonVirtualDeviceTypesAssociatedWithManufacturer(item.manufacturer):[];
            const opts=(values,current)=>[...values].sort((a,b)=>a.localeCompare(b)).map(v=>`<option value="${escapeHtml(v)}" ${v===current?'selected':''}>${escapeHtml(v)}</option>`).join('');
            const used=item?appState.devices.filter(d=>d.model?.toLowerCase()===item.model.toLowerCase()&&d.manufacturer?.toLowerCase()===item.manufacturer.toLowerCase()&&d.type===item.type).length:0;
            const fields=remove
              ? renderInterfaceTemplate("device-management/fields-5",[escapeHtml(item.model),escapeHtml(item.manufacturer),escapeHtml(item.type),used,used?'Removal is blocked until those devices are updated.':'This unused custom suggestion can be removed.'])
              : renderInterfaceTemplate("device-management/fields-6",[escapeHtml(item?.model||''),opts(makers,item?.manufacturer||''),opts(types,item?.type||'')]);
            const actions=renderInterfaceTemplate("device-management/actions-3",[remove?'confirm-remove-catalogue-model':'save-catalogue-model',escapeHtml(id),remove?'btn-outline':'btn-primary',remove?'Remove Model':'Save Model']);
            openCatalogueModal(remove?'Remove Model Suggestion':item?'Edit Model Suggestion':'Add Model Suggestion',
              'Custom suggestions only. Built-in models and saved devices are never changed.',
              fields,actions,'Manufacturer and associated non-virtual device type are required for custom models.',
              remove?'':'id="model-form" data-form-action="model"');
            if(!remove){
              const field=document.getElementById('model-device-type');
              field.dataset.originalType=item?.type||'';
              field.dataset.originalMaker=item?.manufacturer||'';
              refreshModelDeviceTypeChoices();
              rememberModalForm();
            }
        }
        async function saveHardwareModel(id='',remove=false){
            const items=getConfiguredHardwareCatalogueEntries().map(x=>({...x}));
            const item=items.find(x=>x.id===id&&x.model);
            if(id&&!item)return;
            let model='',manufacturer='',type='';
            if(!remove){
                model=String(document.getElementById('model-name')?.value||'').trim();
                manufacturer=String(document.getElementById('hardware-model-manufacturer-select')?.value||'').trim();
                type=String(document.getElementById('model-device-type')?.value||'').trim();
                const seeded=(getVisibleBuiltInHardwareSuggestions()[type]||{});
                const builtin=Object.entries(seeded).some(([m,models])=>m.toLowerCase()===manufacturer.toLowerCase()&&models.some(v=>v.toLowerCase()===model.toLowerCase()));
                const duplicate=items.some(x=>x.id!==id&&x.type===type&&x.manufacturer.toLowerCase()===manufacturer.toLowerCase()&&String(x.model||'').toLowerCase()===model.toLowerCase());
                const allowed=getNonVirtualDeviceTypesAssociatedWithManufacturer(manufacturer);
                const legacy=!!item&&item.manufacturer===manufacturer&&item.type===type;
                const error=!model?'Enter a model name.':!manufacturer?'Select a manufacturer.':!type?'Select a device type.':!allowed.includes(type)&&!legacy?'This device type is not associated with this manufacturer. Update Manufacturers first.':builtin?'This is already a built-in model suggestion.':duplicate?'This model suggestion already exists.':'';
                if(error){const el=document.getElementById('model-error');if(el){el.textContent=error;el.classList.remove('hidden');}return;}
            }
            if(remove){
                const used=appState.devices.some(d=>String(d.model||'').trim().toLowerCase()===String(item.model||'').trim().toLowerCase()&&String(d.manufacturer||'').trim().toLowerCase()===String(item.manufacturer||'').trim().toLowerCase()&&d.type===item.type);
                if(used){showToast('This model is used by a device. Edit that device before removing its model suggestion.','error');return;}
                items.splice(items.findIndex(x=>x.id===id),1);
            }
            else if(item)Object.assign(item,{model,manufacturer,type});
            else items.push({id:'hardware_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8),model,manufacturer,type});
            const previous=appState.hardwareCatalogue;
            appState.hardwareCatalogue=items;
            if(!await nextSettingsBridge.save('hardwareCatalogue')){if(previous===undefined)delete appState.hardwareCatalogue;else appState.hardwareCatalogue=previous;showToast('Could not save the model.','error');return;}
            closeModal(true);renderContent();showToast(remove?'Model suggestion removed.':'Model suggestion saved.');
        }
        function openBuiltInHardwareModelEditor(key) {
            let identity;
            try{identity=JSON.parse(key);}catch{return;}
            if(!Array.isArray(identity)||identity.length!==3)return;
            const [type,maker,model]=identity;
            if(!(builtInHardwareSuggestions[type]?.[maker]||[]).includes(model))return;
            const prefKey='model:'+key,pref=getHardwareSeedPreferences()[prefKey]||{};
            const users=appState.devices.filter(d=>d.type===type&&[maker,String(getHardwareSeedPreferences()['maker:'+maker.toLowerCase()]?.label||maker)].some(name=>String(d.manufacturer||'').trim().toLowerCase()===name.trim().toLowerCase())&&[model,String(getHardwareSeedPreferences()['model:'+key]?.label||model)].some(name=>String(d.model||'').trim().toLowerCase()===name.trim().toLowerCase()));
            const fields=renderInterfaceTemplate("device-management/fields-8",[escapeHtml(pref.label||model),pref.hidden?'checked':'',users.length?'disabled':'',users.length?renderInterfaceTemplate("device-management/fields-7",[users.slice(0,5).map(d=>escapeHtml(d.name||d.hostname||d.id||'Unnamed device')).join(', ')]):'']);
            const actions=renderInterfaceTemplate("device-management/actions-4",[escapeHtml(key)]);
            openCatalogueModal('Manage Built-in Model',
              `Original: ${maker} · ${model} · ${type}. Existing device records will not be renamed.`,
              fields,actions,'Built-in models may be renamed or hidden as suggestions. Existing devices and backups are retained.');
        }
        async function saveBuiltInHardwareModelOverride(key){
            let identity;
            try{identity=JSON.parse(key);}catch{return;}
            if(!Array.isArray(identity)||identity.length!==3)return;
            const [type,maker,model]=identity;
            if(!(builtInHardwareSuggestions[type]?.[maker]||[]).includes(model))return;
            const label=String(document.getElementById('built-in-model-name')?.value||'').trim();
            const hidden=!!document.getElementById('built-in-model-hidden')?.checked;
            const error=document.getElementById('built-in-model-error');
            if(!label||label.length>120){if(error)error.textContent='Enter a model name of up to 120 characters.';return;}
            const users=appState.devices.filter(d=>d.type===type&&[maker,String(getHardwareSeedPreferences()['maker:'+maker.toLowerCase()]?.label||maker)].some(name=>String(d.manufacturer||'').trim().toLowerCase()===name.trim().toLowerCase())&&[model,String(getHardwareSeedPreferences()['model:'+key]?.label||model)].some(name=>String(d.model||'').trim().toLowerCase()===name.trim().toLowerCase()));
            if(hidden&&users.length){if(error)error.textContent='This model is assigned to devices and cannot be hidden.';return;}
            const prefs=getHardwareSeedPreferences(),next={...prefs,['model:'+key]:{label,hidden}};
            const displayMaker=String(prefs['maker:'+maker.toLowerCase()]?.label||maker).trim()||maker;
            const effective=getVisibleBuiltInHardwareSuggestions()[type]||{};
            const other=[...(effective[displayMaker]||[]).filter(x=>x.toLowerCase()!==String(prefs['model:'+key]?.label||model).toLowerCase()),...getConfiguredHardwareCatalogueEntries().filter(x=>x.type===type&&x.manufacturer.toLowerCase()===displayMaker.toLowerCase()).map(x=>x.model)];
            if(other.some(x=>String(x||'').toLowerCase()===label.toLowerCase())){if(error)error.textContent='This model suggestion already exists.';return;}
            const previous=appState.hardwareSeedPreferences;
            appState.hardwareSeedPreferences=next;
            if(!await nextSettingsBridge.save('hardwareSeedPreferences')){if(previous===undefined)delete appState.hardwareSeedPreferences;else appState.hardwareSeedPreferences=previous;showToast('Could not save model preference.','error');return;}
            closeModal(true);renderContent();showToast('Built-in model preference saved.');
        }
        function renderHardwareModelsHtml(){
            const map=new Map();
            function add(model,manufacturer,type,source){
                model=String(model||'').trim();manufacturer=String(manufacturer||'').trim();type=String(type||'').trim();
                if(!model||!manufacturer)return;
                const key=[model,manufacturer,type].map(x=>x.toLocaleLowerCase()).join('|');
                if(!map.has(key))map.set(key,{model,manufacturer,type,sources:new Set(),devices:0});
                map.get(key).sources.add(source);
            }
            const builtinModelOrigins=new Map();
            Object.entries(builtInHardwareSuggestions).forEach(([type,makers])=>Object.entries(makers).forEach(([originalMaker,models])=>{
                const makerPref=getHardwareSeedPreferences()['maker:'+originalMaker.toLowerCase()]||{};
                if(makerPref.hidden)return;
                const manufacturer=String(makerPref.label||originalMaker).trim()||originalMaker;
                models.forEach(originalModel=>{
                    const originalKey=JSON.stringify([type,originalMaker,originalModel]);
                    const pref=getHardwareSeedPreferences()['model:'+originalKey]||{};
                    if(pref.hidden)return;
                    const model=String(pref.label||originalModel).trim()||originalModel;
                    add(model,manufacturer,type,'Built-in');
                    builtinModelOrigins.set([model,manufacturer,type].map(x=>x.toLocaleLowerCase()).join('|'),originalKey);
                });
            }));
            getConfiguredHardwareCatalogueEntries().forEach(x=>add(x.model,x.manufacturer,x.type,'Custom'));
            appState.devices.forEach(d=>{
                add(d.model,d.manufacturer,d.type,'Inventory');
                const key=[d.model,d.manufacturer,d.type].map(x=>String(x||'').trim().toLocaleLowerCase()).join('|');
                if(map.has(key))map.get(key).devices++;
            });
            const hiddenBuiltins=Object.entries(getHardwareSeedPreferences()).filter(([key,value])=>key.startsWith('model:')&&isPlainObject(value)&&value.hidden).flatMap(([key])=>{
                try{
                    const [type,maker,model]=JSON.parse(key.slice(6));
                    return (builtInHardwareSuggestions[type]?.[maker]||[]).includes(model)?[{key:key.slice(6),type,maker,model}]:[];
                }catch{return [];}
            });
            const items=[...map.values()].sort((a,b)=>a.manufacturer.localeCompare(b.manufacturer)||a.model.localeCompare(b.model)||a.type.localeCompare(b.type));
            const makers=[...new Set(items.map(item=>item.manufacturer))].sort((a,b)=>a.localeCompare(b));
            const types=[...new Set(items.map(item=>item.type).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
            const options=values=>values.map(value=>`<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('');
            const rows=items.map(item=>{
                let controls=renderCatalogueButton('View Devices','device-hardware-drilldown',`data-field="model" data-value="${escapeHtml(item.model)}"`);
                if(item.sources.has('Built-in'))controls+=renderCatalogueButton('Manage Suggestion','built-in-model-edit',`data-name="${escapeHtml(builtinModelOrigins.get([item.model,item.manufacturer,item.type].map(value=>value.toLowerCase()).join('|'))||'')}"`);
                else for(const entry of getConfiguredHardwareCatalogueEntries().filter(entry=>entry.model&&entry.model.toLowerCase()===item.model.toLowerCase()&&entry.manufacturer.toLowerCase()===item.manufacturer.toLowerCase()&&entry.type.toLowerCase()===item.type.toLowerCase())){
                    controls+=renderCatalogueButton('Edit','model-edit',`data-name="${escapeHtml(entry.id)}"`)+renderCatalogueButton('Remove','model-remove',`data-name="${escapeHtml(entry.id)}"`);
                }
                return renderCatalogueRecord(`data-model-maker="${escapeHtml(item.manufacturer.toLowerCase())}" data-model-type="${escapeHtml(item.type.toLowerCase())}" data-model-sources="${escapeHtml([...item.sources].join('|').toLowerCase())}" data-model-devices="${item.devices}" data-model-row="${escapeHtml([item.model,item.manufacturer,item.type].join(' ').toLowerCase())}"`,item.model,item.sources.has('Built-in')?'Built-in':item.sources.has('Custom')?'Custom':'Recorded',`${item.manufacturer} · ${item.type} · ${item.devices} device${item.devices===1?'':'s'} in inventory`,controls);
            }).join('');
            const hiddenRows=hiddenBuiltins.map(item=>renderCatalogueRecord('',item.model,'Archived',`${item.maker} · ${item.type}`,renderCatalogueButton('Manage / Restore','built-in-model-edit',`data-name="${escapeHtml(item.key)}"`))).join('');
            const hidden=hiddenRows?renderInterfaceTemplate("device-management/source-hidden",['Hidden Built-in Models',hiddenRows]):'';
            return renderInterfaceTemplate("device-management/source-models",[items.length,items.filter(item=>item.devices>0).length,items.filter(item=>item.sources.has('Custom')).length,rows,`${items.length} models shown`,options(makers),options(types),'',0,hidden]);
        }
        const builtInSoftwareSuggestions = [{"name":"Microsoft 365 Apps","types":["Desktop","Laptop","Tablet"],"platformContexts":["mac-desktop","windows-desktop"]},{"name":"LibreOffice","types":["Desktop","Laptop","Tablet"],"platformContexts":["linux-desktop","mac-desktop","windows-desktop"]},{"name":"Google Chrome","types":["Desktop","Laptop","Tablet"],"platformContexts":["linux-desktop","mac-desktop","windows-desktop"]},{"name":"Mozilla Firefox","types":["Desktop","Laptop","Tablet"],"platformContexts":["linux-desktop","mac-desktop","windows-desktop"]},{"name":"Microsoft Edge","types":["Desktop","Laptop","Tablet"],"platformContexts":["windows-desktop"]},{"name":"Adobe Acrobat Reader","types":["Desktop","Laptop","Tablet"],"platformContexts":[]},{"name":"Microsoft Teams","types":["Desktop","Laptop","Tablet"],"platformContexts":["mac-desktop","windows-desktop"]},{"name":"Zoom Workplace","types":["Desktop","Laptop","Tablet"],"platformContexts":["mac-desktop","windows-desktop"]},{"name":"7-Zip","types":["Desktop","Laptop","Tablet"],"platformContexts":["windows-desktop"]},{"name":"VLC media player","types":["Desktop","Laptop","Tablet"],"platformContexts":["linux-desktop","mac-desktop","windows-desktop"]},{"name":"Bitwarden","types":["Desktop","Laptop","Tablet"],"platformContexts":["linux-desktop","mac-desktop","windows-desktop"]},{"name":"KeePassXC","types":["Desktop","Laptop","Tablet"],"platformContexts":["linux-desktop","mac-desktop","windows-desktop"]},{"name":"Microsoft Defender for Endpoint","types":["Desktop","Laptop","Tablet","Server - Physical","Server - Virtual"],"platformContexts":["linux-desktop","linux-server","mac-desktop","windows-desktop","windows-server"]},{"name":"CrowdStrike Falcon Sensor","types":["Desktop","Laptop","Tablet","Server - Physical","Server - Virtual"],"platformContexts":["linux-desktop","linux-server","mac-desktop","windows-desktop","windows-server"]},{"name":"SentinelOne Agent","types":["Desktop","Laptop","Tablet","Server - Physical","Server - Virtual"],"platformContexts":["linux-desktop","linux-server","mac-desktop","windows-desktop","windows-server"]},{"name":"Tailscale","types":["Desktop","Laptop","Tablet","Server - Physical","Server - Virtual","Firewall","Router","Layer 3 Switch","Wireless Access Point","Access Point","Wireless LAN Controller","NAS"],"platformContexts":["linux-desktop","linux-server","mac-desktop","nas-apps","openwrt","windows-desktop","windows-server"]},{"name":"OpenVPN Connect","types":["Desktop","Laptop","Tablet"],"platformContexts":[]},{"name":"WireGuard","types":["Desktop","Laptop","Tablet","Server - Physical","Server - Virtual","Firewall","Router","Layer 3 Switch","Wireless Access Point","Access Point","Wireless LAN Controller"],"platformContexts":["linux-desktop","linux-server","openwrt"]},{"name":"AnyDesk","types":["Desktop","Laptop","Tablet"],"platformContexts":[]},{"name":"RustDesk","types":["Desktop","Laptop","Tablet"],"platformContexts":[]},{"name":"TeamViewer","types":["Desktop","Laptop","Tablet"],"platformContexts":[]},{"name":"Microsoft Remote Desktop","types":["Desktop","Laptop","Tablet"],"platformContexts":[]},{"name":"Zabbix Agent","types":["Desktop","Laptop","Tablet","Server - Physical","Server - Virtual","Firewall","Router","Layer 3 Switch","Switch"],"platformContexts":["linux-desktop","linux-server","mac-desktop","windows-desktop","windows-server"]},{"name":"NinjaOne Agent","types":["Desktop","Laptop","Tablet","Server - Physical","Server - Virtual"],"platformContexts":["mac-desktop","windows-desktop","windows-server"]},{"name":"PDQ Connect","types":["Desktop","Laptop","Tablet","Server - Physical","Server - Virtual"],"platformContexts":["windows-desktop","windows-server"]},{"name":"Visual Studio Code","types":["Desktop","Laptop","Tablet"],"platformContexts":["linux-desktop","mac-desktop","windows-desktop"]},{"name":"Git","types":["Desktop","Laptop","Server - Physical","Server - Virtual","Tablet"],"platformContexts":["linux-desktop","linux-server","mac-desktop","windows-desktop","windows-server"]},{"name":"PowerShell 7","types":["Desktop","Laptop","Server - Physical","Server - Virtual","Tablet"],"platformContexts":["windows-desktop","windows-server"]},{"name":"PuTTY","types":["Desktop","Laptop"],"platformContexts":[]},{"name":"WinSCP","types":["Desktop","Laptop","Tablet"],"platformContexts":["windows-desktop"]},{"name":"Wireshark","types":["Desktop","Laptop"],"platformContexts":[]},{"name":"Docker Desktop","types":["Desktop","Laptop"],"platformContexts":[]},{"name":"VMware Workstation","types":["Desktop","Laptop"],"platformContexts":[]},{"name":"VirtualBox","types":["Desktop","Laptop"],"platformContexts":[]},{"name":"Notepad++","types":["Desktop","Laptop","Tablet"],"platformContexts":["windows-desktop"]},{"name":"Python","types":["Desktop","Laptop","Server - Physical","Server - Virtual"],"platformContexts":[]},{"name":"Java Runtime","types":["Desktop","Laptop"],"platformContexts":[]},{"name":"Node.js","types":["Desktop","Laptop"],"platformContexts":[]},{"name":"Microsoft Power BI Desktop","types":["Desktop","Laptop","Tablet"],"platformContexts":["windows-desktop"]},{"name":"AutoCAD","types":["Desktop","Laptop"],"platformContexts":[]},{"name":"Docker Engine","types":["Server - Physical","Server - Virtual"],"platformContexts":["linux-server"]},{"name":"Podman","types":["Server - Physical","Server - Virtual"],"platformContexts":["linux-server"]},{"name":"Kubernetes","types":["Server - Physical","Server - Virtual"],"platformContexts":["linux-server"]},{"name":"containerd","types":["Server - Physical","Server - Virtual"],"platformContexts":["linux-server"]},{"name":"Nginx","types":["Server - Physical","Server - Virtual"],"platformContexts":["linux-server"]},{"name":"Apache HTTP Server","types":["Server - Physical","Server - Virtual"],"platformContexts":["linux-server"]},{"name":"IIS","types":["Server - Physical","Server - Virtual"],"platformContexts":["windows-server"]},{"name":"PostgreSQL","types":["Server - Physical","Server - Virtual"],"platformContexts":["linux-server","windows-server"]},{"name":"MariaDB","types":["Server - Physical","Server - Virtual"],"platformContexts":["linux-server","windows-server"]},{"name":"MySQL Server","types":["Server - Physical","Server - Virtual"],"platformContexts":["linux-server","windows-server"]},{"name":"Microsoft SQL Server","types":["Server - Physical","Server - Virtual"],"platformContexts":["windows-server"]},{"name":"Redis","types":["Server - Physical","Server - Virtual"],"platformContexts":["linux-server"]},{"name":"RabbitMQ","types":["Server - Physical","Server - Virtual"],"platformContexts":["linux-server"]},{"name":"Prometheus","types":["Server - Physical","Server - Virtual"],"platformContexts":["linux-server"]},{"name":"Grafana","types":["Server - Physical","Server - Virtual"],"platformContexts":["linux-server"]},{"name":"Zabbix Server","types":["Server - Physical","Server - Virtual"],"platformContexts":["linux-server"]},{"name":"Wazuh Agent","types":["Server - Physical","Server - Virtual","Firewall","Router","Layer 3 Switch"],"platformContexts":["linux-server","opnsense","windows-server"]},{"name":"Veeam Agent","types":["Server - Physical","Server - Virtual","NAS"],"platformContexts":["windows-server"]},{"name":"Restic","types":["Server - Physical","Server - Virtual","NAS"],"platformContexts":["linux-server"]},{"name":"BorgBackup","types":["Server - Physical","Server - Virtual","NAS"],"platformContexts":["linux-server"]},{"name":"OpenSSH Server","types":["Server - Physical","Server - Virtual"],"platformContexts":["linux-server"]},{"name":"Ansible","types":["Server - Physical","Server - Virtual"],"platformContexts":["linux-server"]},{"name":"Terraform","types":["Server - Physical","Server - Virtual"],"platformContexts":["linux-server"]},{"name":"HashiCorp Vault","types":["Server - Physical","Server - Virtual"],"platformContexts":["linux-server"]},{"name":"VMware ESXi","types":["Server - Physical"],"platformContexts":[]},{"name":"Proxmox VE","types":["Server - Physical"],"platformContexts":[]},{"name":"Microsoft Hyper-V","types":["Server - Physical"],"platformContexts":[]},{"name":"Dell OpenManage","types":["Server - Physical"],"platformContexts":[]},{"name":"HPE iLO Management","types":["Server - Physical"],"platformContexts":[]},{"name":"IPMItool","types":["Server - Physical"],"platformContexts":[]},{"name":"TrueNAS SCALE","types":["Server - Physical","NAS"],"platformContexts":[]},{"name":"Ubuntu Server","types":["Server - Physical","Server - Virtual"],"platformContexts":[]},{"name":"Windows Server","types":["Server - Physical","Server - Virtual"],"platformContexts":[]},{"name":"VMware Tools","types":["Server - Virtual"],"platformContexts":[]},{"name":"QEMU Guest Agent","types":["Server - Virtual"],"platformContexts":[]},{"name":"Hyper-V Integration Services","types":["Server - Virtual"],"platformContexts":[]},{"name":"cloud-init","types":["Server - Virtual"],"platformContexts":[]},{"name":"Synology DSM","types":["NAS"],"platformContexts":[]},{"name":"QNAP QTS","types":["NAS"],"platformContexts":[]},{"name":"OpenMediaVault","types":["NAS"],"platformContexts":[]},{"name":"rsync","types":["NAS"],"platformContexts":[]},{"name":"Syncthing","types":["NAS","Server - Physical","Server - Virtual"],"platformContexts":["nas-apps"]},{"name":"pfSense","types":["Firewall","Router","Layer 3 Switch"],"platformContexts":[]},{"name":"OPNsense","types":["Firewall","Router","Layer 3 Switch"],"platformContexts":[]},{"name":"FortiOS","types":["Firewall","Router","Layer 3 Switch"],"platformContexts":[]},{"name":"Cisco IOS XE","types":["Firewall","Router","Layer 3 Switch"],"platformContexts":[]},{"name":"MikroTik RouterOS","types":["Firewall","Router","Layer 3 Switch","Switch"],"platformContexts":[]},{"name":"VyOS","types":["Firewall","Router","Layer 3 Switch"],"platformContexts":[]},{"name":"OpenWrt","types":["Firewall","Router","Layer 3 Switch","Wireless Access Point","Access Point","Wireless LAN Controller"],"platformContexts":[]},{"name":"OpenVPN","types":["Firewall","Router","Layer 3 Switch"],"platformContexts":[]},{"name":"Cisco IOS","types":["Switch"],"platformContexts":[]},{"name":"Cisco NX-OS","types":["Switch"],"platformContexts":[]},{"name":"Aruba AOS-CX","types":["Switch"],"platformContexts":[]},{"name":"UniFi Network","types":["Switch","Wireless Access Point","Access Point","Wireless LAN Controller","Server - Physical","Server - Virtual","Firewall","Router"],"platformContexts":["linux-server","unifi-console","windows-server"]},{"name":"Aruba Instant On","types":["Wireless Access Point","Access Point","Wireless LAN Controller"],"platformContexts":[]},{"name":"ArubaOS","types":["Wireless Access Point","Access Point","Wireless LAN Controller"],"platformContexts":[]},{"name":"Cisco Catalyst Center","types":["Wireless Access Point","Access Point","Wireless LAN Controller"],"platformContexts":[]},{"name":"TP-Link Omada Controller","types":["Wireless Access Point","Access Point","Wireless LAN Controller","Server - Physical","Server - Virtual"],"platformContexts":["linux-server","windows-server"]},{"name":"HP Universal Print Driver","types":["Printer"],"platformContexts":[]},{"name":"Brother Printer Driver","types":["Printer"],"platformContexts":[]},{"name":"Canon Printer Driver","types":["Printer"],"platformContexts":[]},{"name":"Epson Printer Driver","types":["Printer"],"platformContexts":[]},{"name":"PaperCut MF","types":["Printer"],"platformContexts":[]},{"name":"Microsoft Intune Company Portal","types":["Tablet"],"platformContexts":[]},{"name":"Jamf Self Service","types":["Tablet"],"platformContexts":[]},{"name":"Microsoft Authenticator","types":["Tablet"],"platformContexts":[]},{"name":"Google Authenticator","types":["Tablet"],"platformContexts":[]},{"name":"Snort","types":["Firewall","Router","Layer 3 Switch"],"platformContexts":["pfsense"]},{"name":"Suricata","types":["Firewall","Router","Layer 3 Switch"],"platformContexts":["pfsense"]},{"name":"pfBlockerNG","types":["Firewall","Router","Layer 3 Switch"],"platformContexts":["pfsense"]},{"name":"HAProxy","types":["Firewall","Router","Layer 3 Switch"],"platformContexts":["opnsense","pfsense"]},{"name":"ACME","types":["Firewall","Router","Layer 3 Switch"],"platformContexts":["pfsense"]},{"name":"FRR","types":["Firewall","Router","Layer 3 Switch"],"platformContexts":["opnsense","pfsense"]},{"name":"FreeRADIUS","types":["Firewall","Router","Layer 3 Switch"],"platformContexts":["opnsense","pfsense"]},{"name":"NUT","types":["Firewall","Router","Layer 3 Switch"],"platformContexts":["pfsense"]},{"name":"ACME Client","types":["Firewall","Router","Layer 3 Switch"],"platformContexts":["opnsense"]},{"name":"Caddy","types":["Firewall","Router","Layer 3 Switch"],"platformContexts":["opnsense"]},{"name":"CrowdSec","types":["Firewall","Router","Layer 3 Switch"],"platformContexts":["opnsense"]},{"name":"Nginx plugin","types":["Firewall","Router","Layer 3 Switch"],"platformContexts":["opnsense"]},{"name":"SQM / LuCI SQM","types":["Firewall","Router","Layer 3 Switch","Wireless Access Point","Access Point","Wireless LAN Controller"],"platformContexts":["openwrt"]},{"name":"adblock","types":["Firewall","Router","Layer 3 Switch","Wireless Access Point","Access Point","Wireless LAN Controller"],"platformContexts":["openwrt"]},{"name":"mwan3","types":["Firewall","Router","Layer 3 Switch","Wireless Access Point","Access Point","Wireless LAN Controller"],"platformContexts":["openwrt"]},{"name":"UniFi Protect","types":["Firewall","Router","Wireless LAN Controller"],"platformContexts":["unifi-console"]},{"name":"UniFi Access","types":["Firewall","Router","Wireless LAN Controller"],"platformContexts":["unifi-console"]},{"name":"UniFi Talk","types":["Firewall","Router","Wireless LAN Controller"],"platformContexts":["unifi-console"]},{"name":"UniFi Connect","types":["Firewall","Router","Wireless LAN Controller"],"platformContexts":["unifi-console"]},{"name":"UniFi InnerSpace","types":["Firewall","Router","Wireless LAN Controller"],"platformContexts":["unifi-console"]},{"name":"Synology Drive Server","types":["NAS","Server - Physical","Server - Virtual"],"platformContexts":["synology"]},{"name":"Active Backup for Business","types":["NAS","Server - Physical","Server - Virtual"],"platformContexts":["synology"]},{"name":"Hyper Backup","types":["NAS","Server - Physical","Server - Virtual"],"platformContexts":["synology"]},{"name":"Surveillance Station","types":["NAS","Server - Physical","Server - Virtual"],"platformContexts":["synology"]},{"name":"Container Manager","types":["NAS","Server - Physical","Server - Virtual"],"platformContexts":["synology"]},{"name":"HBS 3","types":["NAS","Server - Physical","Server - Virtual"],"platformContexts":["qnap"]},{"name":"Container Station","types":["NAS","Server - Physical","Server - Virtual"],"platformContexts":["qnap"]},{"name":"Virtualization Station","types":["NAS","Server - Physical","Server - Virtual"],"platformContexts":["qnap"]},{"name":"Qsync Central","types":["NAS","Server - Physical","Server - Virtual"],"platformContexts":["qnap"]},{"name":"Plex","types":["NAS","Server - Physical","Server - Virtual"],"platformContexts":["nas-apps"]},{"name":"Jellyfin","types":["NAS","Server - Physical","Server - Virtual"],"platformContexts":["nas-apps"]},{"name":"Nextcloud","types":["NAS","Server - Physical","Server - Virtual"],"platformContexts":["nas-apps"]},{"name":"Immich","types":["NAS","Server - Physical","Server - Virtual"],"platformContexts":["nas-apps"]},{"name":"PaperCut embedded","types":["Printer"],"platformContexts":["printer"]}];
        function openSoftwareCatalogueEditor(key='') {
            const entry=getConfiguredSoftwareCatalogueEntries().find(x=>x.key===key)||builtInSoftwareSuggestions.filter(x=>createBuiltInSoftwareCatalogueKey(x.name)===key).map(x=>({key,label:x.name,deviceTypes:x.types}))[0];
            if(key&&!entry)return;
            const types=[...new Set([...(appState.deviceTypes||[]),...builtInSoftwareSuggestions.flatMap(x=>x.types),...getConfiguredSoftwareCatalogueEntries().flatMap(x=>x.deviceTypes||[])])].sort();
            const selected=new Set(entry?.deviceTypes||[]);
            let fields=renderInterfaceTemplate("device-management/fields-10",[escapeHtml(entry?.label||''),types.map(t=>renderInterfaceTemplate("device-management/fields-9",[escapeHtml(t),selected.has(t)?'checked':'',escapeHtml(t)])).join('')]);
            const builtIn=builtInSoftwareSuggestions.find(item=>createBuiltInSoftwareCatalogueKey(item.name)===key);
            if(builtIn)fields+=renderInterfaceTemplate("device-management/source-availability",[renderSoftwareDeviceTypeControls(builtIn.name)]);
            const actions=renderInterfaceTemplate("device-management/actions-5",[escapeHtml(key)]);
            openCatalogueModal(entry?'Edit Custom Software':'Add Custom Software',
              'Availability does not mean installed. Existing device software assignments remain unchanged.',
              fields,actions,'Software may be available for multiple device types. Archiving preserves recorded installations.',
              'data-form-action="software"');
            rememberModalForm();
        }
        async function saveCustomSoftwareEntry(key=''){
            const name=String(document.getElementById('software-custom-name')?.value||'').trim();
            const types=[...document.querySelectorAll('input[name="software-custom-type"]:checked')].map(x=>x.value);
            const entries=getConfiguredSoftwareCatalogueEntries().map(x=>({...x}));
            const current=entries.find(x=>x.key===key);
            const duplicate=entries.some(x=>x.key!==key&&String(x.label||'').trim().toLowerCase()===name.toLowerCase())||builtInSoftwareSuggestions.some(x=>x.name.toLowerCase()===name.toLowerCase()&&createBuiltInSoftwareCatalogueKey(x.name)!==key);
            const error=!name?'Enter a software name.':name.length>SOFTWARE_SERVICE_NAME_MAX_LENGTH?`Name must be ${SOFTWARE_SERVICE_NAME_MAX_LENGTH} characters or fewer.`:duplicate?'That software name already exists.':!types.length?'Select at least one device type.':'';
            if(error){document.getElementById('software-custom-error').textContent=error;return;}
            if(current)Object.assign(current,{label:name,deviceTypes:types});
            else if(key){const builtin=builtInSoftwareSuggestions.find(x=>createBuiltInSoftwareCatalogueKey(x.name)===key);if(!builtin)return;entries.push({key,label:name,deviceTypes:types});}
            else entries.push({key:'customSoftware_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8),label:name,deviceTypes:types});
            const previous=appState.installedSoftware;appState.installedSoftware=entries;
            if(!await nextSettingsBridge.save('installedSoftware')){appState.installedSoftware=previous;showToast('Could not save software.','error');return;}
            closeModal(true);renderContent();showToast('Custom software saved.');
        }
        function confirmSoftwareCatalogueRemoval(key){
            const entry=getConfiguredSoftwareCatalogueEntries().find(x=>x.key===key&&!x.archived)||builtInSoftwareSuggestions.filter(x=>createBuiltInSoftwareCatalogueKey(x.name)===key).map(x=>({key,label:x.name,deviceTypes:x.types}))[0];
            if(!entry)return;
            const users=appState.devices.filter(d=>d.typeDetails?.[key]===true||d[key]===true);
            const count=users.length;
            const names=users.slice(0,5).map(d=>escapeHtml(d.name||d.hostname||d.id||'Unnamed device')).join(', ');
            openModal(renderInterfaceTemplate("device-management/confirm-software-catalogue-removal-1",[])+escapeHtml(entry.label)+'</strong> from available software choices? '+count+' device(s) have this software recorded. '+(count?'This software is in use by '+names+(count>5?' and '+(count-5)+' more':'')+' and cannot be removed until those assignments are updated.':'This unused software can be removed from available choices; its catalogue record will be retained for recovery.')+renderInterfaceTemplate("device-management/confirm-software-catalogue-removal-2",[])+escapeHtml(key)+'" class="h-11 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white">Remove Software</button></div></div>');
        }
        async function archiveSoftwareCatalogueEntry(key){
            const previous=appState.installedSoftware;
            const entry=getConfiguredSoftwareCatalogueEntries().find(x=>x.key===key&&!x.archived)||builtInSoftwareSuggestions.filter(x=>createBuiltInSoftwareCatalogueKey(x.name)===key).map(x=>({key,label:x.name,deviceTypes:x.types}))[0];
            if(!entry)return;
            const assigned=appState.devices.filter(d=>d.typeDetails?.[key]===true||d[key]===true);
            if(assigned.length){showToast('Software is assigned to '+assigned.slice(0,3).map(d=>d.name||d.hostname||d.id||'unnamed device').join(', ')+(assigned.length>3?' and others':'')+' and cannot be removed.','error');return;}
            const saved=getConfiguredSoftwareCatalogueEntries();
            appState.installedSoftware=saved.some(x=>x.key===key)?saved.map(x=>x.key===key?{...x,archived:true}:x):[...saved,{...entry,archived:true}];
            if(!await nextSettingsBridge.save('installedSoftware')){appState.installedSoftware=previous;showToast('Could not remove software.','error');return;}
            closeModal(true);renderContent();showToast('Software removed from available choices. Existing records preserved.');
        }
        async function restoreArchivedSoftwareEntry(key){
            const previous=appState.installedSoftware;
            const entry=getConfiguredSoftwareCatalogueEntries().find(x=>x.key===key&&x.archived);
            if(!entry)return;
            if(getAvailableSoftwareCatalogueEntries().some(x=>x.key!==key&&String(x.label||'').trim().toLowerCase()===String(entry.label||'').trim().toLowerCase())){showToast('Another available software entry already uses that name. Rename it before restoring this one.','error');return;}
            appState.installedSoftware=getConfiguredSoftwareCatalogueEntries().map(x=>x.key===key?{...x,archived:false}:x);
            if(!await nextSettingsBridge.save('installedSoftware')){appState.installedSoftware=previous;showToast('Could not restore software.','error');return;}
            renderContent();showToast('Software restored to available choices.');
        }
        function renderSoftwareCatalogueHtml(){
            const configured=getConfiguredSoftwareCatalogueEntries();
            const builtins=builtInSoftwareSuggestions.map(x=>{const key=createBuiltInSoftwareCatalogueKey(x.name);const override=configured.find(y=>y.key===key);return {name:override?.label||x.name,key,types:override?.deviceTypes||x.types,source:'built-in',archived:!!override?.archived,count:0};});
            const names=new Set(builtins.map(x=>x.name.toLowerCase()));
            const custom=configured.filter(x=>!x.archived&&!builtInSoftwareSuggestions.some(y=>createBuiltInSoftwareCatalogueKey(y.name)===x.key)&&!names.has(String(x.label||'').toLowerCase())).map(x=>({name:x.label,key:x.key,types:Array.isArray(x.deviceTypes)?x.deviceTypes:[],source:'configured',count:appState.devices.filter(d=>d.typeDetails?.[x.key]===true||d[x.key]===true).length}));
            const archived=configured.filter(x=>x.archived);
            const items=[...builtins.filter(x=>!x.archived),...custom].map(x=>{
                const option=getAvailableSoftwareCatalogueEntries().find(o=>o.key===x.key||String(o.label||'').toLowerCase()===x.name.toLowerCase());
                return {...x,configured:!!option,count:option?appState.devices.filter(d=>d.typeDetails?.[option.key]===true||d[option.key]===true).length:0};
            }).sort((a,b)=>a.name.localeCompare(b.name));
            const types=[...new Set([...items.flatMap(x=>x.types),...(appState.deviceTypes||[])])].sort((a,b)=>a.localeCompare(b));
            const rows=items.map(item=>renderCatalogueRecord(
                `data-software-row="${escapeHtml(item.name.toLowerCase())}" data-software-types="${escapeHtml('|'+item.types.join('|')+'|')}" data-software-used="${item.count}" data-software-source="${item.source}"`,item.name,item.source==='built-in'?'Built-in':'Custom',
                `${item.types.join(', ')} · ${item.count} installed record${item.count===1?'':'s'}`,
                renderCatalogueButton('View Devices','device-intelligence-drilldown',`data-kind="service" data-value="${escapeHtml(item.key)}"`)+
                renderCatalogueButton(item.source==='built-in'?'Manage':'Edit','software-custom-edit',`data-name="${escapeHtml(item.key)}"`)+
                renderCatalogueButton('Remove','software-custom-remove',`data-name="${escapeHtml(item.key)}"`))).join('');
            const archivedRows=archived.map(item=>renderCatalogueRecord('',item.label,'Archived','Preserved historical installations',
                renderCatalogueButton('View Devices','device-intelligence-drilldown',`data-kind="service" data-value="${escapeHtml(item.key)}"`)+renderCatalogueButton('Restore','software-custom-restore',`data-name="${escapeHtml(item.key)}"`))).join('');
            const typeOptions=types.map(type=>`<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join('');
            return renderInterfaceTemplate("device-management/source-software",[items.length,items.filter(item=>item.count>0).length,archived.length,rows,`${items.length} software options shown`,'',typeOptions,archivedRows,archived.length]);
        }
        async function enableSuggestedSoftware(name){
            const suggestion=builtInSoftwareSuggestions.find(x=>x.name===name);
            if(!suggestion)return;
            if(getConfiguredSoftwareCatalogueEntries().some(x=>x.label.toLowerCase()===name.toLowerCase())){showToast('This software is already configured.');return;}
            const snapshot=JSON.stringify(appState);
            const key='customSoftware_'+Date.now().toString(36);
            appState.installedSoftware=[...getConfiguredSoftwareCatalogueEntries(),{key,label:suggestion.name,deviceTypes:suggestion.types}];
            if(!await nextSettingsBridge.save('installedSoftware')){const previous=JSON.parse(snapshot);Object.keys(appState).forEach(k=>delete appState[k]);Object.assign(appState,previous);showToast('Could not save software option.','error');return;}
            switchTab('devices');
            showToast(suggestion.name+' is now available on compatible device forms.');
        }
        function filterSoftwareCatalogue(){
            const query=(document.getElementById('software-search')?.value||'').trim().toLowerCase();
            const source=document.getElementById('software-source')?.value||'';
            const type=document.getElementById('software-type')?.value||'';
            const used=!!document.getElementById('software-used')?.checked;
            let count=0;
            document.querySelectorAll('[data-software-row]').forEach(row=>{
                const visible=row.dataset.softwareRow.includes(query)&&(!source||row.dataset.softwareSource===source)&&(!type||row.dataset.softwareTypes.includes('|'+type+'|'))&&(!used||Number(row.dataset.softwareUsed)>0);
                row.hidden=!visible;row.classList.toggle('hidden',!visible);
                if(visible)count++;
            });
            const output=document.getElementById('software-catalogue-count');
            if(output)output.textContent=count+' software options shown';
            document.getElementById('software-empty')?.classList.toggle('hidden',count!==0);
        }
        document.addEventListener('input',event=>{if(['software-search','software-source','software-type','software-used'].includes(event.target?.id))filterSoftwareCatalogue();});
        document.addEventListener('change',event=>{if(['software-source','software-type','software-used'].includes(event.target?.id))filterSoftwareCatalogue();});
        function openServerServiceEditor(key='') {
            const item=getAvailableServerServiceCatalogueEntries().find(x=>x.key===key);
            if(key&&!item)return;
            const fields=renderInterfaceTemplate("device-management/fields-11",[escapeHtml(item?.label||'')]);
            const actions=renderInterfaceTemplate("device-management/actions-6",[escapeHtml(key)]);
            openCatalogueModal(item?'Edit Server Service':'Add Custom Server Service',
              'Manage the server services available to recorded devices.',
              fields,actions,'Archive and restore preserve existing server service assignments.','data-form-action="server-service"');
        }
        async function saveServerServiceEntry(key){
            const label=String(document.getElementById('server-service-name-input')?.value||'').trim();
            if(!label||label.length>SOFTWARE_SERVICE_NAME_MAX_LENGTH)return showToast(`Enter a service name (up to ${SOFTWARE_SERVICE_NAME_MAX_LENGTH} characters).`,'error');
            if([...getConfiguredServerServiceCatalogueEntries(),...builtInServerServiceSuggestions].some(x=>x.label.toLowerCase()===label.toLowerCase()&&x.key!==key))return showToast('That service name already exists.','error');
            const old=appState.serverFunctions;
            const items=getConfiguredServerServiceCatalogueEntries().map(x=>({...x}));
            if(key){const entry=items.find(x=>x.key===key&&!x.archived);if(entry)entry.label=label;
                else {const builtin=builtInServerServiceSuggestions.find(x=>x.key===key);if(!builtin)return;items.push({...builtin,label});}}
            else items.push({key:'customServerFunction_'+Date.now().toString(36),label});
            appState.serverFunctions=items;
            if(!await nextSettingsBridge.save('serverFunctions')){appState.serverFunctions=old;return showToast('Could not save server service.','error');}
            closeModal(true);renderContent();showToast('Server service saved.');
        }
        async function restoreArchivedServerService(key){
            const entry=getConfiguredServerServiceCatalogueEntries().find(x=>x.key===key&&x.archived);
            if(!entry)return;
            if(getAvailableServerServiceCatalogueEntries().some(x=>x.key!==key&&String(x.label||'').trim().toLowerCase()===String(entry.label||'').trim().toLowerCase())){showToast('Another available server service already uses that name. Rename it before restoring this one.','error');return;}
            const previous=appState.serverFunctions;
            appState.serverFunctions=previous.map(x=>x.key===key?{...x,archived:false}:x);
            if(!await nextSettingsBridge.save('serverFunctions')){appState.serverFunctions=previous;return showToast('Could not restore server service.','error');}
            renderContent();showToast('Server service restored. Existing device assignments preserved.');
        }
        function renderServerServicesCatalogueHtml(){
            const saved=getConfiguredServerServiceCatalogueEntries();
            const active=getAvailableServerServiceCatalogueEntries();
            const archived=saved.filter(x=>x.archived).sort((a,b)=>String(a.label||'').localeCompare(String(b.label||''),undefined,{sensitivity:'base'}));
            const rows=active.map(item=>{
                const count=appState.devices.filter(device=>device.typeDetails?.[item.key]===true||device[item.key]===true).length;
                return renderCatalogueRecord(`data-service-row="${escapeHtml(item.label.toLowerCase())}"`,item.label,saved.some(entry=>entry.key===item.key)?'Custom':'Built-in',`${count} devices with service enabled`,
                    renderCatalogueButton('View Devices','device-intelligence-drilldown',`data-kind="service" data-value="${escapeHtml(item.key)}"`)+renderCatalogueButton('Manage','server-catalog-edit',`data-name="${escapeHtml(item.key)}"`)+renderCatalogueButton('Remove','server-catalog-remove',`data-name="${escapeHtml(item.key)}"`));
            }).join('');
            const archivedRows=archived.map(item=>renderCatalogueRecord('',item.label,'Archived','Preserved on existing device records',renderCatalogueButton('Restore','server-catalog-restore',`data-name="${escapeHtml(item.key)}"`))).join('');
            return renderInterfaceTemplate("device-management/source-services",[active.length,active.filter(item=>appState.devices.some(device=>device.typeDetails?.[item.key]===true||device[item.key]===true)).length,archived.length,rows,`${active.length} services shown`,'','',archivedRows,archived.length]);
        }
        function renderDevicesHTML() {
            if(['types','locations'].includes(activeDeviceDetailsTab))return renderDeviceCategoryCatalogue(activeDeviceDetailsTab==='types'?'type':'location');
            if(activeDeviceDetailsTab==='manufacturers')return renderHardwareManufacturersHtml();
            if(activeDeviceDetailsTab==='models')return renderHardwareModelsHtml();
            if(activeDeviceDetailsTab==='software')return renderSoftwareCatalogueHtml();
            if(activeDeviceDetailsTab==='services')return renderServerServicesCatalogueHtml();

            // Live saved-inventory values in the approved Hardware cards.
            const renderHardwareMetric=(label,field,icon,tone='')=>{
                const count=appState.devices.filter(d=>String(d[field]||'').trim()).length;
                const pct=appState.devices.length?Math.round(count/appState.devices.length*100):0;
                return renderInterfaceTemplate("devices/render-hardware-metric-1",[escapeHtml(label),tone,icon,count,pct]);
            };
            const renderHardwareChart=(field,tone='blue')=>{
                const counts=new Map();
                appState.devices.forEach(d=>{const name=String(d[field]||'').trim()||'Not Recorded';counts.set(name,(counts.get(name)||0)+1);});
                const groups=[...counts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
                const max=Math.max(1,...groups.map(([,n])=>n));
                return groups.length?groups.map(([name,count])=>renderInterfaceTemplate("devices/render-hardware-chart-1",[field,escapeHtml(name),count,escapeHtml(name),escapeHtml(name),count,tone,Math.round(count/max*100)])).join(''):'<p class="intelligence-empty">No recorded values.</p>';
            };

            // Live inventory models for the pinned Operating Systems,
            // Software & Services and Data Quality screen components.
            const renderDeviceInsightChart=kind=>{
                const counts=new Map();
                appState.devices.forEach(device=>{
                    const details=device.typeDetails&&typeof device.typeDetails==='object'?device.typeDetails:{};
                    const values=kind==='os'?[getEffectiveDevicePlatform(device)]:
                        Object.entries(details).filter(([key,value])=>value===true&&!['serialPort','usbPort'].includes(key)).map(([key])=>key);
                    if(kind==='software'&&!values.length)return;
                    values.forEach(value=>counts.set(value,(counts.get(value)||0)+1));
                });
                const groups=[...counts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
                const max=Math.max(1,...groups.map(([,count])=>count));
                return groups.length?groups.map(([key,count])=>{
                    const label=kind==='os'?key:(builtInServerServiceSuggestions.find(service=>service.key===key)?.label||key);
                    const action=kind==='os'
                        ?`data-action="device-os-drilldown" data-os="${escapeHtml(key)}"`
                        :`data-action="device-intelligence-drilldown" data-kind="service" data-value="${escapeHtml(key)}"`;
                    return renderInterfaceTemplate("devices/render-device-insight-chart-1",[action,count,escapeHtml(label),escapeHtml(label),count,Math.round(count/max*100)]);
                }).join(''):'<p class="intelligence-empty">No recorded values.</p>';
            };
            const renderDeviceQualityCards=()=>[
                ['Missing Primary IP','ip',device=>!String(device.primaryIp||'').trim()],
                ['Missing Device Type','type',device=>!String(device.type||'').trim()||device.type==='Unknown'],
                ['Missing Location','location',device=>!String(device.location||'').trim()||device.location==='Unknown']
            ].map(([label,kind,test])=>{
                const count=appState.devices.filter(test).length;
                return renderInterfaceTemplate("devices/render-device-quality-cards-1",[kind,label,count]);
            }).join('');
            const renderArchivedSoftware=()=>{
                const archived=getConfiguredSoftwareCatalogueEntries().filter(x=>x.archived);
                const affected=appState.devices.map(device=>({
                    device,
                    software:archived.filter(entry=>device.typeDetails?.[entry.key]===true||device[entry.key]===true)
                })).filter(x=>x.software.length);
                if(!affected.length)return '<div class="intelligence-overview-box" style="margin-top:0"><span>No devices have archived software recorded.</span></div>';
                return renderInterfaceTemplate("device-management/render-archived-software-2",[affected.sort((a,b)=>String(a.device.name||'').localeCompare(String(b.device.name||''))).map(x=>renderInterfaceTemplate("device-management/render-archived-software-1",[escapeHtml(String(x.device.id)),escapeHtml(String(x.device.name||'Unnamed Device')),x.software.map(entry=>escapeHtml(String(entry.label||entry.key))).join(', ')])).join('')]);
            };
            return renderInterfaceTemplate("devices/render-devices-html-9",[activeDeviceDetailsTab==='manufacturers'?renderHardwareManufacturersHtml():'',activeDeviceDetailsTab==='models'?renderHardwareModelsHtml():'',activeDeviceDetailsTab==='software'?renderSoftwareCatalogueHtml():'',activeDeviceDetailsTab==='overview'?'':'hidden',deviceIntelligenceTab==='overview',deviceIntelligenceTab==='overview'?'active':'',deviceIntelligenceTab==='hardware',deviceIntelligenceTab==='hardware'?'active':'',deviceIntelligenceTab==='os',deviceIntelligenceTab==='os'?'active':'',deviceIntelligenceTab==='software',deviceIntelligenceTab==='software'?'active':'',deviceIntelligenceTab==='quality',deviceIntelligenceTab==='quality'?'active':'',deviceIntelligenceTab==='overview'?'':'hidden',[['Total Devices',appState.devices.length,'i-box','orange','Recorded in inventory'],['With Primary IP',appState.devices.filter(d=>String(d.primaryIp||'').trim()).length,'i-network','green','Devices with a primary IP'],['Locations Recorded',appState.devices.filter(d=>String(d.location||'').trim() && d.location!=='Unknown').length,'i-rack','','Known location assigned'],['Device Types',new Set(appState.devices.map(d=>String(d.type||'').trim()).filter(Boolean)).size,'i-grid','','Different classifications']].map(([label,value,icon,tone,caption])=>renderInterfaceTemplate("devices/render-devices-html-1",[label,icon,value,tone,caption])).join(''),[['Devices by Type','type'],['Devices by Location','location']].map(([heading,field])=>{
                                const counts=new Map();
                                appState.devices.forEach(d=>{
                                    const raw=String(d[field]||'').trim();
                                    const name=raw && raw!=='Unknown' ? (field==='type' && raw==='Server - Physical' ? 'Server' : field==='type' && raw==='Server - Virtual' ? 'Virtual Machine' : raw) : 'Not Recorded';
                                    counts.set(name,(counts.get(name)||0)+1);
                                });
                                const groups=[...counts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
                                const max=Math.max(1,...groups.map(g=>g[1]));
                                return renderInterfaceTemplate("devices/render-devices-html-3",[field==='type'?'orange':'',field==='type'?'#i-box':'#i-network',heading,field==='type'?'Equipment classification across your inventory.':'Physical areas associated with your devices.',groups.length?groups.map(([name,count])=>renderInterfaceTemplate("devices/render-devices-html-2",[field,escapeHtml(name),escapeHtml(name),count,escapeHtml(name),count,field==='type'?'orange':'blue',(count/max)*100])).join(''):'<p class="intelligence-empty">No devices recorded yet.</p>']);
                            }).join(''),deviceIntelligenceTab==='hardware'?'':'hidden',[['Manufacturers','manufacturer','i-box','orange'],['Models','model','i-grid',''],['Mounting Methods','mountType','i-rack','']].map(([label,field,icon,tone])=>renderHardwareMetric(label,field,icon,tone)).join(''),renderHardwareChart('manufacturer','orange'),renderHardwareChart('model'),renderHardwareChart('mountType','green'),deviceIntelligenceTab==='os'?'':'hidden',renderDeviceInsightChart('os'),deviceIntelligenceTab==='software'?'':'hidden',renderDeviceInsightChart('software'),renderArchivedSoftware(),deviceIntelligenceTab==='quality'?'':'hidden',renderDeviceQualityCards(),activeDeviceDetailsTab==='inventory'?'':'hidden',escapeHtml(deviceSearchTerm),deviceAssignmentFilter===''?'selected':'',deviceAssignmentFilter==='assigned'?'selected':'',deviceAssignmentFilter==='unassigned'?'selected':'',getUniqueDeviceTypes().sort((a,b)=>a.localeCompare(b)).map(t=>`<option value="${escapeHtml(t)}" ${deviceTypeFilter === t ? 'selected' : ''}>${escapeHtml(t==='Server - Physical' ? 'Server' : t==='Server - Virtual' ? 'Virtual Machine' : t)}</option>`).join(''),['Active','Maintenance','Retired'].map(v=>`<option value="${v}" ${deviceStatusFilter===v?'selected':''}>${v}</option>`).join(''),[...new Set(appState.devices.map(d=>d.location||'Unknown'))].sort((a,b)=>a.localeCompare(b)).map(v=>`<option value="${escapeHtml(v)}" ${deviceLocationFilter===v?'selected':''}>${escapeHtml(v)}</option>`).join(''),deviceMountFilter==='racked'?'selected':'',deviceMountFilter==='unracked'?'selected':'',(deviceOsFilter || deviceServiceFilter || deviceMissingFilter || deviceHardwareFilter)?'':'hidden',escapeHtml(deviceOsFilter?'Operating System: '+deviceOsFilter:deviceServiceFilter?'Software / Service: '+deviceServiceFilter:deviceMissingFilter?({ip:'Missing Primary IP',type:'Missing Device Type',location:'Missing Location'}[deviceMissingFilter]||'Data Quality'):deviceHardwareFilter?({manufacturer:'Manufacturer',model:'Model',mountType:'Mounting Method'}[deviceHardwareFilter.field]||'Hardware')+': '+deviceHardwareFilter.value:''),getVisibleDevices().length,appState.devices.length,[['name-asc','Name A–Z'],['name-desc','Name Z–A'],['type-asc','Type A–Z'],['type-desc','Type Z–A'],['location-asc','Location A–Z'],['location-desc','Location Z–A'],['ip-asc','IP address ↑'],['ip-desc','IP address ↓']].map(([value,label])=>`<option value="${value}" ${deviceSort === value ? 'selected' : ''}>${label}</option>`).join(''),getVisibleDevices().map(d => {
                                    const rack = appState.racks.find(r => String(r.id) === String(d.rackId));
                                    const isUnknownLocation = !d.location || d.location === 'Unknown' || !getUniqueDeviceLocations().includes(d.location);
                                    // A valid rack placement does not imply a known physical room/site.
                                    const hasValidRackPlacement = d.mountType === 'Rack Mounted' && !!rack &&
                                        ['front', 'rear'].includes(d.face) && Number.isInteger(Number(d.rackUStart)) &&
                                        Number(d.rackUStart) >= 1 && Number(d.rackUEnd) >= Number(d.rackUStart) &&
                                        Number(d.rackUEnd) <= Number(rack.heightU);
                                    const locationNeedsAttention = isUnknownLocation && !hasValidRackPlacement;
                                    const locText = isUnknownLocation ? 'Unknown' : d.location;
                                    return renderInterfaceTemplate("devices/render-devices-html-4",[escapeHtml(d.id),escapeHtml(d.name),escapeHtml(d.serialNumber ? 'S/N '+d.serialNumber : rack ? rack.name+' · '+(d.face||'front') : d.mountType || 'Not in rack'),d.type==='Server - Virtual'?'vm':'',escapeHtml(d.type==='Server - Physical' ? 'Server' : d.type==='Server - Virtual' ? 'Virtual Machine' : d.type),escapeHtml(locText),locationNeedsAttention ? '<div class="device-detail" style="color:var(--theme-warning-text,#b26449)">Needs attention</div>' : '',escapeHtml(d.primaryIp || 'None'),d.status === 'Retired' ? 'retired' : d.status === 'Maintenance' ? 'maintenance' : '',escapeHtml(d.status || 'Active'),escapeHtml([d.manufacturer,d.model].filter(Boolean).join(' ') || '—'),escapeHtml(d.id)]);
                                }).join(''),getVisibleDevices().length === 0 ? renderInterfaceTemplate("devices/render-devices-html-5",[appState.devices.length?'No matching devices':'Your inventory is empty',appState.devices.length?'Try another search or remove your filters.':'Add your first device to get started.',appState.devices.length?'clear-device-filters':'open-device-modal',appState.devices.length?'Clear search and filters':'Add Device',appState.devices.length?'':'btn btn-primary']) : '','hidden','']);
        }

        // --- MANAGED TYPES & LOCATIONS ---
        let deviceTypeLocationSearchFilters = {type:'',location:''};
        function getManagedDeviceTypeOrLocationNames(kind) {
            const key = kind === 'type' ? 'deviceTypes' : 'deviceLocations';
            const prop = kind === 'type' ? 'type' : 'location';
            const list = Array.isArray(appState[key]) ? appState[key] : [];
            return [...new Set([...list,...appState.devices.map(d=>d[prop])].filter(Boolean))]
                .sort((a,b)=>a.localeCompare(b,undefined,{sensitivity:'base'}));
        }
        function getUniqueDeviceTypes() { return [...new Set([...getManagedDeviceTypeOrLocationNames('type'), ...defaultData.deviceTypes])].sort((a,b)=>a.localeCompare(b,undefined,{sensitivity:'base'})); }
        function getUniqueDeviceLocations() { return getManagedDeviceTypeOrLocationNames('location'); }
        function isProtectedDeviceTypeOrLocation(kind,name) {
            return name.toLowerCase()==='unknown';
        }
                function openDeviceCatalogueManager(kind) {
            const isType=kind==='type',label=isType?'Device Types':'Locations';
            const search=deviceTypeLocationSearchFilters[kind].trim().toLowerCase();
            const all=getManagedDeviceTypeOrLocationNames(kind);
            const entries=all.filter(n=>n.toLowerCase().includes(search));
            const fields=renderInterfaceTemplate("device-management/fields-14",[isType?'Device Type':'Location',isType?'device type':'location',kind,isType?'Type':'Location',isType?'device types':'locations',escapeHtml(deviceTypeLocationSearchFilters[kind]),kind,isType?'Device types':'Locations',isType?'device types':'locations',entries.length,all.length,entries.length?entries.map(name=>{
                  const count=appState.devices.filter(d=>d[isType?'type':'location']===name).length;
                  const locked=isProtectedDeviceTypeOrLocation(kind,name);
                  return renderInterfaceTemplate("device-management/fields-12",[escapeHtml(name),count,count===1?'':'s',locked?' · Protected':'',kind,escapeHtml(name),locked?'disabled':'',escapeHtml(name),kind,escapeHtml(name),locked?'disabled':'',escapeHtml(name)]);
                }).join(''):renderInterfaceTemplate("device-management/fields-13",[isType?'device types':'locations'])]);
            const actions=renderInterfaceTemplate("device-management/actions-7",[]);
            openCatalogueModal(`Manage ${label}`,
              `${all.length} configured · Changes update the existing saved device inventory.`,
              fields,actions,
              `Unknown is protected. Deleting an in-use ${isType?'device type':'location'} requires confirmation and changes affected devices to Unknown.`);
        }
        function openManageTypesModal(){openDeviceCatalogueManager('type');}
        function openManageLocationsModal(){openDeviceCatalogueManager('location');}
        let deviceTypeLocationDeletionApproved=false;
        let pendingDeviceTypeLocationDeletion=null;
                function requestDeviceCatalogueEntryDeletion(kind,name) {
            if(document.getElementById('delete-dialog') || document.getElementById('discard-dialog'))return;
            const prop=kind==='type'?'type':'location';
            if(isProtectedDeviceTypeOrLocation(kind,name)||!getManagedDeviceTypeOrLocationNames(kind).includes(name))return;
            const affected=appState.devices.filter(d=>d[prop]===name).length;
            const content=document.getElementById('modal-content');
            if(!content)return;
            const overlay=document.createElement('div');
            overlay.id='delete-dialog';
            overlay.setAttribute('role','alertdialog');
            overlay.setAttribute('aria-modal','true');
            overlay.setAttribute('aria-labelledby','device-catalogue-delete-title');
            overlay.setAttribute('aria-describedby','delete-description');
            overlay.className='absolute inset-0 z-50 flex items-center justify-center p-3';
            overlay.style.background='#10283cca';
            overlay.innerHTML=renderInterfaceTemplate("device-management/request-device-catalogue-entry-deletion-1",[kind==='type'?'Device Type':'Location',escapeHtml(name),kind==='type'?'device type':'location',affected,affected===1?'':'s',affected?'Affected devices will be changed to Unknown.':'No existing devices will be changed.']);
            if(getComputedStyle(content).position==='static')content.style.position='relative';
            overlay._returnFocus=document.activeElement;
            pendingDeviceTypeLocationDeletion={kind,name};
            content.appendChild(overlay);
            overlay.querySelector('[data-action="cancel-delete"]').focus();
        }
        function cancelDeviceCatalogueEntryDeletion(){
            const overlay=document.getElementById('delete-dialog');
            const focus=overlay?._returnFocus;
            overlay?.remove();
            pendingDeviceTypeLocationDeletion=null;
            if(focus?.isConnected)focus.focus();
        }
        function applyConfirmedDeviceCatalogueEntryDeletion(){
            const pending=pendingDeviceTypeLocationDeletion;
            if(!pending)return;
            cancelDeviceCatalogueEntryDeletion();
            deviceTypeLocationDeletionApproved=true;
            try{applyDeviceCatalogueChange(pending.kind,'delete',pending.name);}
            finally{deviceTypeLocationDeletionApproved=false;}
        }
        function applyDeviceCatalogueChange(kind,operation,oldName,newName='') {
            const key=kind==='type'?'deviceTypes':'deviceLocations',prop=kind==='type'?'type':'location';
            const list=getManagedDeviceTypeOrLocationNames(kind);
            const name=newName.trim();
            if(operation!=='delete') {
                if(!name){showToast('Enter a name first.','error');return;}
                if(name.length>100){showToast('Name is too long.','error');return;}
                if((name.toLowerCase()==='unknown'||(kind==='location'&&name.toLowerCase()==='racked')) && (operation==='add'||name.toLowerCase()!==oldName?.toLowerCase())){
                    showToast('That name is reserved for a system value.','error');return;
                }
                if(list.some(n=>n.toLowerCase()===name.toLowerCase() && (operation==='add'||n!==oldName))){showToast('That name already exists.','error');return;}
            }
            if(operation!=='add' && (isProtectedDeviceTypeOrLocation(kind,oldName)||!list.includes(oldName))){showToast('This entry cannot be changed.','error');return;}
            if(operation==='rename' && oldName===name)return;
            const affected=appState.devices.filter(d=>d[prop]===oldName).length;
            if(operation==='delete' && !deviceTypeLocationDeletionApproved){requestDeviceCatalogueEntryDeletion(kind,oldName);return;}
            if(!nextDeviceCatalogueBridge){showToast("This inventory operation is not yet connected to SQLite.","error");return;}
            void nextDeviceCatalogueBridge.change(kind,operation,oldName,name);

        }
        function editDeviceTypePrompt(n){openDeviceTypeOrLocationRename('type',n);}
        function editDeviceLocationPrompt(n){openDeviceTypeOrLocationRename('location',n);}
                function openDeviceTypeOrLocationRename(kind,n) {
            const manager=document.querySelector('.device-catalogue-manager');
            if(!manager)return;
            const label=kind==='type'?'Device Type':'Location';
            manager._deviceCatalogueSavedContent=manager.innerHTML;
            manager._deviceCatalogueReturnFocusName=n;
            manager._deviceCataloguePreviousHeading=document.getElementById('catalog-modal-title')?.textContent||'';
            manager._deviceCataloguePreviousSubtitle=document.getElementById('catalog-modal-sub')?.textContent||'';
            document.getElementById('catalog-modal-title').textContent=`Rename ${label}`;
            document.getElementById('catalog-modal-sub').textContent='Update the name and return to the catalogue management list.';
            manager.innerHTML=renderInterfaceTemplate("devices/open-device-type-or-location-rename-1",[label,escapeHtml(n),label.toLowerCase(),kind,escapeHtml(n)]);
            manager.dataset.deviceCatalogueEditing='true';
            const input=manager.querySelector('#device-catalogue-rename-value');
            input?.focus();input?.select();
        }
                function cancelDeviceCatalogueEntryRename(force=false) {
            const manager=document.querySelector('.device-catalogue-manager[data-device-catalogue-editing="true"]');
            const input=manager?.querySelector('#device-catalogue-rename-value');
            if(!force && input && input.value!==manager._deviceCatalogueReturnFocusName){
              confirmDiscardDeviceFormChanges(()=>cancelDeviceCatalogueEntryRename(true));return;
            }
            if(!manager)return;
            if(manager._deviceCatalogueSavedContent){
              manager.innerHTML=manager._deviceCatalogueSavedContent;
              document.getElementById('catalog-modal-title').textContent=manager._deviceCataloguePreviousHeading||'Manage Catalogue';
              document.getElementById('catalog-modal-sub').textContent=manager._deviceCataloguePreviousSubtitle||'';
              delete manager._deviceCatalogueSavedContent;
              delete manager.dataset.deviceCatalogueEditing;
              const button=[...manager.querySelectorAll('[data-action="rename-device-catalogue-entry"]')].find(b=>b.dataset.name===manager._deviceCatalogueReturnFocusName);
              (button||manager.querySelector('button'))?.focus();
              delete manager._deviceCatalogueReturnFocusName;
              delete manager._deviceCataloguePreviousHeading;
              delete manager._deviceCataloguePreviousSubtitle;
            }
        }
        function deleteDeviceType(n){applyDeviceCatalogueChange('type','delete',n);}
        function deleteDeviceLocation(n){applyDeviceCatalogueChange('location','delete',n);}

        // --- MERGED IPAM & VLANs VIEW ---
        let ipamStatusFilter = 'All';
        let ipamAddressSearch = '';
        let activeIpamTab = 'overview';
        // operate on the existing /24 IPAM address grid without
        // assuming that every stored subnet is a /24.
        function findSubnetUsingGatewayAddress(ip) {
            return appState.subnets.find(s => s.kind !== 'container' && s.gateway === ip && isUsableHostAddressInSubnet(ip, s.cidr)) || null;
        }

        function calculateSubnetUtilisationSummary(subnet) {
            const range=parseSupportedIpv4Subnet(subnet?.cidr);
            if(!range) return {supported:false,cidr:subnet?.cidr||'',capacity:0,assigned:0,reserved:0,available:0,next:null,utilisation:0,duplicates:[]};
            const owners=new Map();
            for(const d of appState.devices) {
                if(!isUsableHostAddressInSubnet(d.primaryIp,subnet.cidr)) continue;
                const arr=owners.get(d.primaryIp)||[];arr.push(d.name||d.id);owners.set(d.primaryIp,arr);
            }
            const duplicates=[...owners].filter(([,a])=>a.length>1).map(([ip,owners])=>({ip,owners}));
            let assigned=0,reserved=0,next=null;
            for(let n=range.first;n<=range.lastHost;n++) {
                const ip=formatIpv4Address(n), alloc=appState.ipAllocations[ip];
                const status=alloc?.status||(owners.has(ip)?'Assigned':'Available');
                if(status==='Reserved') reserved++;
                else if(status==='Assigned') assigned++;
                else if(ip===subnet.gateway) reserved++; // Protected without writing an allocation record.
                else if(next===null && status==='Available' && !owners.has(ip)) next=ip;
            }
            return {supported:true,cidr:subnet.cidr,capacity:range.capacity,assigned,reserved,
                available:range.capacity-assigned-reserved,next,
                utilisation:Math.round((assigned+reserved)/range.capacity*100),duplicates};
        }

        let ipamManageBlockFilter = null; // null = all, empty string = unassigned

        // Read-only subnet hierarchy, with native keyboard-accessible disclosure.
        function renderSubnetHierarchyPreview() {
            const subnets = appState.subnets || [];
            const ids = new Set(subnets.map(s => String(s.id)));
            const byParent = new Map();
            for (const subnet of subnets) {
                const parent = subnet.parentId && ids.has(String(subnet.parentId)) ? String(subnet.parentId) : '';
                if (!byParent.has(parent)) byParent.set(parent, []);
                byParent.get(parent).push(subnet);
            }
            const visited = new Set();
            function nodes(parent, ancestry = new Set()) {
                return (byParent.get(parent) || []).map(subnet => {
                    const id = String(subnet.id);
                    if (ancestry.has(id) || visited.has(id)) return '';
                    visited.add(id);
                    const next = new Set(ancestry);
                    next.add(id);
                    const children = nodes(id, next);
                    const isContainer = subnet.kind === 'container';
                    const name = escapeHtml(String(subnet.name || 'Unnamed Subnet'));
                    const cidr = escapeHtml(String(subnet.cidr || ''));
                    const type = isContainer ? 'IP Address Block' : subnet.kind === 'reserved' ? 'Reserved Range' : subnet.kind === 'loopback' ? 'Loopback /32' : 'Network / VLAN';
                    const details = '<span class="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">' + type + (isContainer ? '' : ' · VLAN ' + escapeHtml(String(subnet.vlan ?? '—'))) + '</span>';
                    const editAction = '<button type="button" data-action="edit-subnet" data-id="' + escapeHtml(id) + '" class="inline-flex align-middle items-center ml-3 px-2 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:underline" aria-label="Edit ' + name + '"><i class="fa-solid fa-pen mr-1"></i>Edit</button>';
                    if (children || isContainer) {
                        return '<details ' + (isContainer ? 'data-ipam-hierarchy-block="' + escapeHtml(id) + '" ' : '') + renderInterfaceTemplate("ipam/nodes-1",[]) + cidr + ' — ' + name + details + '</span>' + editAction + '</summary>' + (children || '<p class="text-xs text-slate-500 dark:text-slate-400 ml-5 py-2">No Child Subnets</p>') + '</details>';
                    }
                    return renderInterfaceTemplate("ipam/nodes-2",[]) + cidr + ' — ' + name + details + editAction + '</div>';
                }).join('');
            }
            const roots = nodes('');
            const orphaned = subnets.filter(subnet => !visited.has(String(subnet.id)));
            return renderInterfaceTemplate("ipam/render-subnet-hierarchy-preview-1",[]) + (roots || '<p class="text-sm text-slate-500">No Subnets Yet</p>') + (orphaned.length ? '<p class="text-xs text-rose-600">Some subnet relationships could not be displayed.</p>' : '') + '</section>';
        }

                // IPAM Manage Subnets: real SQLite-backed records.
        function renderIpamManage(){
            const blocks=appState.subnets.filter(s=>s.kind==='container');
            const networks=appState.subnets.filter(s=>(s.kind||'network')==='network');
            const vlans=appState.vlans||[];
            const groups=blocks.map(block=>({
                id:String(block.id),name:block.name||block.cidr||'IP Address Block',
                cidr:block.cidr,list:networks.filter(n=>String(n.parentId||'')===String(block.id)),
                vlans:vlans.filter(v=>String(v.parentId||'')===String(block.id))
            }));
            const loose=networks.filter(n=>!blocks.some(b=>String(b.id)===String(n.parentId||'')));
            const looseVlans=vlans.filter(v=>!blocks.some(b=>String(b.id)===String(v.parentId||'')));
            if(loose.length||looseVlans.length){
                groups.push({id:'',name:'Unassigned Networks',cidr:'No IP Address Block',list:loose,vlans:looseVlans});
            }
            const displayed=ipamManageBlockFilter===null?groups:groups.filter(g=>g.id===ipamManageBlockFilter);
            const scopedNetworks=displayed.flatMap(g=>g.list);
            const activeNetwork=scopedNetworks.find(n=>n.id===selectedSubnetId)||scopedNetworks[0]||null;
            const legacy=previewLegacyVlanOwnershipInApp();
            const scoped=legacy.filter(v=>v.status==='unique'&&v.parentId).length;
            const ambiguous=legacy.filter(v=>v.status==='ambiguous').length;
            const orphaned=legacy.filter(v=>v.status==='orphaned').length;
            const unassigned=legacy.filter(v=>v.status==='unique'&&!v.parentId).length;
            const needsUpdate=scoped>0,hasIssues=ambiguous>0||orphaned>0;
            const managedGroups=displayed.map(group=>{
                const editBlock=group.id?'<div style="display:flex;justify-content:flex-end;margin-top:10px">'+
                    '<button type="button" class="btn btn-outline" data-action="edit-ipam-block" data-id="'+escapeHtml(group.id)+'">Edit Block</button></div>':'';
                const networkRows=group.list.map(n=>{
                    return '<div class="ipam-subnet-row"><div><strong>'+escapeHtml(n.name||n.cidr)+'</strong> '+
                        '<span class="ipam-mini-badge">'+escapeHtml(n.purpose||'Not assigned')+'</span> '+
                        '<span class="ipam-mini-badge">VLAN '+escapeHtml(n.vlan??'Not assigned')+'</span>'+
                        '<p>'+escapeHtml(n.cidr||'')+' · '+escapeHtml(n.description||'No description')+'</p></div>'+
                        '<div class="ipam-subnet-row-actions">'+
                        '<button class="btn btn-outline" type="button" data-action="ipam-open-network-addresses" data-id="'+escapeHtml(n.id)+'">Browse IP Addresses</button>'+
                        '<button class="btn btn-outline" type="button" data-action="edit-subnet" data-id="'+escapeHtml(n.id)+'">Edit Subnet</button></div></div>';
                }).join('');
                // Keep legacy VLANs inspectable if they have no unambiguous
                // linked network, as the existing page already allowed.
                const unmatched=group.vlans.filter(v=>group.list.filter(n=>Number(n.vlan)===Number(v.vlanId)).length!==1)
                    .map(v=>'<div class="ipam-subnet-row"><div><strong>'+escapeHtml(v.name||'VLAN')+'</strong> '+
                        '<span class="ipam-mini-badge">VLAN '+escapeHtml(v.vlanId??'—')+'</span>'+
                        '<p>Review linked subnet and VLAN ownership</p></div>'+
                        '<div class="ipam-subnet-row-actions"><button class="btn btn-outline" type="button" data-action="open-subnet-by-vlan" data-id="'+escapeHtml(v.id)+'">Edit VLAN &amp; Subnet</button></div></div>').join('');
                return '<details class="ipam-block-group" data-ipam-hierarchy-block="'+escapeHtml(group.id||'__unassigned__')+'" open>'+
                    '<summary class="ipam-block-head"><span><strong>'+escapeHtml(group.name)+'</strong>'+
                    '<small>'+escapeHtml(group.cidr||'')+' · '+group.list.length+' network'+(group.list.length===1?'':'s')+'</small></span>'+
                    '<span class="ipam-mini-badge">Click to expand / collapse</span></summary>'+
                    '<div class="ipam-block-body">'+editBlock+networkRows+unmatched+'</div></details>';
            }).join('');
            return renderInterfaceTemplate("ipam/render-ipam-manage-1",[escapeHtml(activeNetwork?.id||''),!activeNetwork?'disabled':'',ipamManageBlockFilter===null?'ipam-hidden':'',ipamManageBlockFilter!==null?'Showing '+escapeHtml(displayed[0]?.name||'selected IP Address Block')+' only. <button type="button" class="btn btn-outline" data-action="ipam-show-all-blocks">Show All IP Address Blocks</button>':'',managedGroups||'<p class="ipam-empty">No matching IP Address Blocks or networks.</p>',needsUpdate||hasIssues?'Review required':'No action required',needsUpdate?scoped+' VLAN record(s) can be linked to their identified IP Address Block.':'VLAN ownership is up to date. No action required.',unassigned,hasIssues?'<p class="ipam-warning">'+ambiguous+' VLAN(s) match multiple subnets; '+orphaned+' have no matching subnet. Review these records before updating ownership.</p>':'',needsUpdate&&!hasIssues?'<button type="button" class="btn btn-primary" data-action="reconcile-legacy-vlans">Update VLAN Ownership ('+scoped+')</button>':'']);
        }

        function renderIpamHTML() {
            if(activeIpamTab==='manage')return renderIpamManage();
            // IPAM Overview: inventory-wide, read-only totals.
            // Return before selected-network rendering so Overview never depends on its dropdown.
            if (activeIpamTab === 'overview') {
                const blocks = appState.subnets.filter(s => s.kind === 'container');
                const networks = appState.subnets.filter(s => (s.kind || 'network') === 'network');
                let capacity = 0, available = 0;
                for (const network of networks) {
                    const summary = calculateSubnetUtilisationSummary(network);
                    if (!summary.supported) continue;
                    capacity += summary.capacity;
                    available += summary.available;
                }
                const overviewStats = [
                    ['IP Address Blocks', blocks.length],
                    ['Networks', networks.length],
                    ['Usable Addresses', capacity],
                    ['Available Addresses', available]
                ];
                // Native disclosure elements keep large inventories compact and keyboard-accessible.
                const groups = blocks.map(block => ({block, networks: networks.filter(n => String(n.parentId || '') === String(block.id))}));
                const ungrouped = networks.filter(n => !blocks.some(b => String(b.id) === String(n.parentId || '')));
                if (ungrouped.length) groups.push({block:null, networks:ungrouped});
                const networkGroups = groups.map(({block,networks:list}) => {
                    const title = block ? block.name || block.cidr : 'Unassigned Networks';
                    const cidr = block ? block.cidr : 'No parent IP Address Block';
                    const search = [title,cidr,...list.flatMap(n => [n.name,n.cidr,n.vlan,n.description])].join(' ').toLowerCase();
                    return renderInterfaceTemplate("ipam/network-groups-1",[escapeHtml(block?.id || ''),escapeHtml(search),escapeHtml(title),escapeHtml(cidr),list.length,list.length===1?'network':'networks']);
                }).join('');
                return renderInterfaceTemplate("ipam/render-ipam-html-2",[overviewStats.map(([label,value])=>renderInterfaceTemplate("ipam/render-ipam-html-1",[escapeHtml(label),Number(value).toLocaleString('en-GB')])).join(''),networkGroups || '<p class="ipam-empty">No networks yet. Add a Network / VLAN subnet to begin.</p>',groups.length]);
            }
            const availableNetworks = appState.subnets.filter(s => (s.kind || 'network') === 'network' &&
                (activeIpamTab !== 'manage' || ipamManageBlockFilter === null ||
                 (s.parentId || '') === ipamManageBlockFilter));
            const subnet = availableNetworks.find(s => s.id === selectedSubnetId) || availableNetworks[0] || null;
            if (activeIpamTab === 'manage' && selectedSubnetId !== (subnet?.id || '')) selectedSubnetId = subnet?.id || '';
            if (activeIpamTab === 'manage' && !subnet) return renderSubnetHierarchyPreview();
            
            if(activeIpamTab==='addresses'&&!subnet){
                return '<section class="ipam-panel active ipam-addresses" data-panel="addresses" data-ipam-panel="addresses" role="tabpanel">'+
                    renderInterfaceTemplate("ipam/render-ipam-html-3",[])+
                    '<button class="btn btn-primary" type="button" data-action="open-subnet-modal">Add Single Subnet</button><button class="btn btn-outline" type="button" data-action="open-multiple-subnets">Add Multiple Subnets</button></div></section>';
            }
            if (!subnet && appState.subnets.length === 0) {
                return renderInterfaceTemplate("ipam/render-ipam-html-4",[]);
            }

            const activeNetwork = subnet;
            if (subnet?.kind === 'container' && !activeNetwork) {
                if (activeIpamTab === 'manage') return renderSubnetHierarchyPreview();
                const blocks = appState.subnets.filter(s => s.kind === 'container');
                const heading = activeIpamTab === 'addresses' ? 'IP Addresses' : 'IPAM Overview';
                const blockSummary = activeIpamTab === 'overview' ? renderInterfaceTemplate("ipam/block-summary-2",[[['IP Address Blocks', blocks.length], ['Network / VLAN Subnets', 0], ['Host Allocations', 0]].map(([label, value]) => renderInterfaceTemplate("ipam/block-summary-1",[label,value])).join('')]) : '';
                return renderInterfaceTemplate("ipam/render-ipam-html-5",[heading,blockSummary]);
            }
            const activeSubnetUtilisationSummary = calculateSubnetUtilisationSummary(activeNetwork);
            const baseIpParts = subnet ? subnet.cidr.split('/')[0].split('.') : ['192', '168', '1'];
            const basePrefix = `${baseIpParts[0]}.${baseIpParts[1]}.${baseIpParts[2]}`;
            
            let startHost = 1;
            let endHost = 32;
            if (ipViewRange === '1-32') { startHost = 1; endHost = 32; }
            else if (ipViewRange === '33-64') { startHost = 33; endHost = 64; }
            else if (ipViewRange === '65-128') { startHost = 65; endHost = 128; }
            else if (ipViewRange === '129-192') { startHost = 129; endHost = 192; }
            else if (ipViewRange === '193-254') { startHost = 193; endHost = 254; }
            else if (ipViewRange === 'all') { startHost = 1; endHost = 254; }

            const ipAddressGridSubnetRange=parseSupportedIpv4Subnet(subnet.cidr);
            const isIpAddressGridPaginated=ipAddressGridSubnetRange.prefix!==24;
            const ipAddressGridPageCount=Math.ceil(ipAddressGridSubnetRange.capacity/32);
            ipAddressGridPage=Math.max(0,Math.min(ipAddressGridPage,ipAddressGridPageCount-1));
            const ipAddressGridStartAddressNumber=ipAddressGridSubnetRange.first+ipAddressGridPage*32;
            const ipAddressGridEndAddressNumber=Math.min(ipAddressGridSubnetRange.lastHost,ipAddressGridStartAddressNumber+31);
            const networkParent = appState.subnets.find(item => String(item.id) === String(subnet.parentId || ''));
            const networkMask = ipAddressGridSubnetRange ? formatIpv4Address((0xFFFFFFFF << (32 - ipAddressGridSubnetRange.prefix)) >>> 0) : '—';
            const networkInfoItems = [
                ['Network Name', subnet.name || '—'],
                ['Network CIDR', subnet.cidr || '—'],
                ['Purpose',subnet.purpose||'Not assigned'],
                ['Subnet Mask', networkMask],
                ['Usable Address Range', ipAddressGridSubnetRange ? formatIpv4Address(ipAddressGridSubnetRange.first) + ' – ' + formatIpv4Address(ipAddressGridSubnetRange.lastHost) : '—'],
                ['Gateway', subnet.gateway || 'Not configured'],
                ['VLAN ID', subnet.vlan ?? 'Not assigned'],
                ['Parent IP Address Block', networkParent ? networkParent.name + ' (' + networkParent.cidr + ')' : 'None'],
                ['Usable Addresses', activeSubnetUtilisationSummary.capacity],
                ['Assigned', activeSubnetUtilisationSummary.assigned],
                ['Reserved', activeSubnetUtilisationSummary.reserved],
                ['Available', activeSubnetUtilisationSummary.available]
            ];
            const networkInformationPanel = renderInterfaceTemplate("ipam/network-information-panel-2",[networkInfoItems.map(([label,value]) => renderInterfaceTemplate("ipam/network-information-panel-1",[escapeHtml(String(label)),escapeHtml(String(value))])).join('')]);
            const assignedCount = activeSubnetUtilisationSummary.assigned;
            const reservedCount = activeSubnetUtilisationSummary.reserved;

            const ipamStatusLegend = renderInterfaceTemplate("ipam/ipam-status-legend-1",[]);
            let ipListHtml = '';
            let ipamAddressCards = '';
            let ipamAddressCount = 0;
            if (subnet && activeSubnetUtilisationSummary.supported) {
                for (let i = (isIpAddressGridPaginated?ipAddressGridStartAddressNumber:startHost); i <= (isIpAddressGridPaginated?ipAddressGridEndAddressNumber:endHost); i++) {
                    const ip = isIpAddressGridPaginated ? formatIpv4Address(i) : `${basePrefix}.${i}`;
                    const alloc = appState.ipAllocations[ip];
                    const gatewayProtected = ip === subnet.gateway;
                    const status = gatewayProtected && (!alloc || alloc.status === 'Available') ? (appState.devices.some(d => d.primaryIp === ip) ? 'Assigned' : 'Reserved') : (alloc?.status || (appState.devices.some(d => d.primaryIp === ip) ? 'Assigned' : 'Available'));
                    const displayStatus = gatewayProtected ? `Gateway · ${status}` : status;
                    const reservedDevice = alloc?.reservedForDeviceId ? getDeviceById(alloc.reservedForDeviceId) : null;
                    const missingReservedDevice = Boolean(alloc?.reservedForDeviceId && !reservedDevice);
                    
                    let badgeColor = 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600';
                    if (status === 'Assigned') badgeColor = 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 font-semibold';
                    if (status === 'Reserved') badgeColor = 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-indigo-800';

                    if (ipamStatusFilter !== 'All' && status !== ipamStatusFilter) continue;
                    if (ipamAddressSearch.trim() && ![ip, alloc?.hostname, reservedDevice?.name].some(v => String(v || '').toLowerCase().includes(ipamAddressSearch.trim().toLowerCase()))) continue;
                    const allocationOwner = missingReservedDevice ? 'Missing reserved device' :
                        reservedDevice && status==='Reserved' ? 'For: '+reservedDevice.name :
                        gatewayProtected ? (status==='Assigned'?'Assigned to Network Device':'Reserved') :
                        alloc ? (alloc.hostname||'Assigned IP') : 'Available';
                    ipamAddressCards += renderInterfaceTemplate("ipam/ipam-overview-cards-1",[status.toLowerCase(),escapeHtml(ip),escapeHtml(ip),escapeHtml(displayStatus),escapeHtml(ip),escapeHtml(displayStatus),escapeHtml(allocationOwner),escapeHtml(allocationOwner)]);
                    ipamAddressCount++;
                    ipListHtml += renderInterfaceTemplate("ipam/ip-list-html-1",[escapeHtml(ip),escapeHtml(ip),escapeHtml(displayStatus),badgeColor,ip,escapeHtml(displayStatus),missingReservedDevice ? 'Missing reserved device' : reservedDevice && status === 'Reserved' ? 'For: ' + escapeHtml(reservedDevice.name) : (gatewayProtected ? (status === 'Assigned' ? 'Assigned to Network Device' : 'Reserved') : (alloc ? escapeHtml(alloc.hostname || 'Assigned IP') : 'Available'))]);
                }
            }

            if(activeIpamTab==='addresses'){
                return renderInterfaceTemplate("ipam/render-ipam-html-6",[availableNetworks.map(n=>'<option value="'+escapeHtml(n.id)+'" '+(n.id===subnet.id?'selected':'')+'>'+escapeHtml(n.cidr)+' — '+escapeHtml(n.name||'Network')+' (VLAN '+escapeHtml(n.vlan??'Not assigned')+')</option>').join(''),escapeHtml(activeSubnetUtilisationSummary.next||''),!activeSubnetUtilisationSummary.next?'disabled':'',activeSubnetUtilisationSummary.next?'Next Available: '+escapeHtml(activeSubnetUtilisationSummary.next):'No Available Addresses',escapeHtml(subnet.cidr),escapeHtml(subnet.vlan??'Not assigned'),escapeHtml(subnet.name||'Network'),escapeHtml(subnet.description||'No description'),escapeHtml(subnet.gateway||'Not configured'),escapeHtml(formatIpv4Address(ipAddressGridSubnetRange.first)),escapeHtml(formatIpv4Address(ipAddressGridSubnetRange.lastHost)),escapeHtml(networkParent?.name||'Unassigned'),escapeHtml(networkMask),activeSubnetUtilisationSummary.assigned,activeSubnetUtilisationSummary.reserved,activeSubnetUtilisationSummary.available,activeSubnetUtilisationSummary.utilisation,activeSubnetUtilisationSummary.utilisation,activeSubnetUtilisationSummary.utilisation,activeSubnetUtilisationSummary.capacity,activeSubnetUtilisationSummary.duplicates.length?'<p class="ipam-result-text">Duplicate device IP warning: '+activeSubnetUtilisationSummary.duplicates.map(d=>escapeHtml(d.ip)+' ('+d.owners.map(escapeHtml).join(', ')+')').join('; ')+'</p>':'',isIpAddressGridPaginated?formatIpv4Address(ipAddressGridStartAddressNumber)+' – '+formatIpv4Address(ipAddressGridEndAddressNumber):'.'+startHost+' – .'+endHost,escapeHtml(subnet.cidr),isIpAddressGridPaginated?'<span class="ipam-result-text">Page '+(ipAddressGridPage+1)+' of '+ipAddressGridPageCount+'</span><button type="button" data-action="show-previous-ip-address-grid-page" '+(ipAddressGridPage===0?'disabled':'')+'>Previous</button><button type="button" data-action="show-next-ip-address-grid-page" '+(ipAddressGridPage===ipAddressGridPageCount-1?'disabled':'')+'>Next</button>':[['1-32','.1–.32'],['33-64','.33–.64'],['65-128','.65–.128'],['129-192','.129–.192'],['193-254','.193–.254'],['all','Show All']].map(([id,label])=>'<button type="button" data-action="ip-range-'+id+'" class="'+(ipViewRange===id?'active':'')+'" aria-pressed="'+(ipViewRange===id)+'">'+label+'</button>').join(''),escapeHtml(ipamAddressSearch),['All','Available','Assigned','Reserved'].map(s=>'<option value="'+s+'" '+(ipamStatusFilter===s?'selected':'')+'>'+(s==='All'?'All statuses':s)+'</option>').join(''),ipamAddressCards||'<p class="ipam-empty">No addresses to display for this range or filter.</p>',ipamAddressCount,isIpAddressGridPaginated?'page':'host range',escapeHtml(subnet.purpose||'Not assigned')]);
            }

            return renderInterfaceTemplate("ipam/render-ipam-html-24",[activeIpamTab==='manage'?'':'hidden',ipamManageBlockFilter !== null ? renderInterfaceTemplate("ipam/render-ipam-html-7",[escapeHtml(ipamManageBlockFilter === '' ? 'Unassigned Networks' : (appState.subnets.find(s => String(s.id) === String(ipamManageBlockFilter))?.name || 'Selected IP Address Block'))]) : '',(() => {
                        const legacy = previewLegacyVlanOwnershipInApp();
                        const scoped = legacy.filter(v => v.status === 'unique' && v.parentId).length;
                        const ambiguous = legacy.filter(v => v.status === 'ambiguous').length;
                        const orphaned = legacy.filter(v => v.status === 'orphaned').length;
                        const unassigned = legacy.filter(v => v.status === 'unique' && !v.parentId).length;
                        const needsUpdate = scoped > 0;
                        const hasIssues = ambiguous > 0 || orphaned > 0;
                        return renderInterfaceTemplate("ipam/render-ipam-html-10",[needsUpdate || hasIssues ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40',needsUpdate ? `${scoped} VLAN record(s) can be linked to their identified IP Address Block.` : 'VLAN ownership is up to date. No action required.',unassigned,hasIssues ? renderInterfaceTemplate("ipam/render-ipam-html-8",[ambiguous,orphaned]) : '',needsUpdate && !hasIssues ? renderInterfaceTemplate("ipam/render-ipam-html-9",[scoped]) : '']);
                    })(),(() => {
                            const blocks = appState.subnets.filter(sub => sub.kind === 'container');
                            const groups = blocks.map(block => ({
                                id: block.id, name: block.name, cidr: block.cidr,
                                vlans: appState.vlans.filter(v => v.parentId === block.id)
                            }));
                            groups.push({
                                id: '__unassigned__', name: 'Unassigned VLANs', cidr: 'No IP Address Block',
                                vlans: appState.vlans.filter(v => !v.parentId || !blocks.some(b => b.id === v.parentId))
                            });
                            return groups.filter(group => (ipamManageBlockFilter === null || (ipamManageBlockFilter === '' ? group.id === '__unassigned__' : String(group.id) === String(ipamManageBlockFilter))) && (group.vlans.length || group.id !== '__unassigned__' || ipamManageBlockFilter === '')).map(group => renderInterfaceTemplate("ipam/render-ipam-html-13",[escapeHtml(group.id),escapeHtml(group.name),escapeHtml(group.cidr || ''),group.vlans.length,group.id !== '__unassigned__' ? `<button type="button" data-action="edit-ipam-block" data-id="${escapeHtml(group.id)}" class="px-3 py-1.5 rounded-lg border border-orange-300 dark:border-amber-800 text-sm font-semibold">Edit Block</button>` : '',group.vlans.slice().sort((a,b) => Number(a.vlanId)-Number(b.vlanId)).map(v => {
                                            const matches = appState.subnets.filter(sub => (!sub.kind || sub.kind === 'network') &&
                                                Number(sub.vlan) === Number(v.vlanId) &&
                                                (sub.parentId || '__unassigned__') === (v.parentId || '__unassigned__'));
                                            const cidr = matches.length === 1 ? matches[0].cidr : '';
                                            return renderInterfaceTemplate("ipam/render-ipam-html-12",[escapeHtml(v.vlanId),escapeHtml(v.id),escapeHtml(v.name),cidr ? renderInterfaceTemplate("ipam/render-ipam-html-11",[escapeHtml(cidr)]) : '',escapeHtml(v.description || 'No description')]);
                                        }).join('')])).join('');
                        })(),availableNetworks.map(s => `
                                    <option value="${escapeHtml(s.id)}" ${s.id === activeNetwork.id ? 'selected' : ''}>${escapeHtml(s.cidr)} (${escapeHtml(s.name)} - VLAN ${escapeHtml(s.vlan)})</option>
                                `).join(''),activeIpamTab==='manage'?'flex':'hidden',subnet ? renderInterfaceTemplate("ipam/render-ipam-html-14",[escapeHtml(subnet.id),escapeHtml(subnet.id)]) : '',subnet ? renderInterfaceTemplate("ipam/render-ipam-html-23",[activeIpamTab==='overview'?'':'hidden',networkInformationPanel,escapeHtml(subnet.cidr),subnet.vlan,escapeHtml(subnet.name),escapeHtml(subnet.description || 'No description'),escapeHtml(subnet.gateway),assignedCount,reservedCount,activeSubnetUtilisationSummary.supported ? activeSubnetUtilisationSummary.available : '—',activeSubnetUtilisationSummary.supported && activeSubnetUtilisationSummary.next ? renderInterfaceTemplate("ipam/render-ipam-html-15",[escapeHtml(activeSubnetUtilisationSummary.next),escapeHtml(activeSubnetUtilisationSummary.next)]) : '',activeSubnetUtilisationSummary.supported ? renderInterfaceTemplate("ipam/render-ipam-html-19",[[['Assigned',activeSubnetUtilisationSummary.assigned,'text-blue-800 dark:text-sky-200'],['Reserved',activeSubnetUtilisationSummary.reserved,'text-amber-800 dark:text-amber-200'],['Available',activeSubnetUtilisationSummary.available,'text-emerald-800 dark:text-emerald-200'],['Used',activeSubnetUtilisationSummary.utilisation+'%','text-slate-900 dark:text-white']].map(([name,value,color])=>renderInterfaceTemplate("ipam/render-ipam-html-16",[name,color,value])).join(''),activeSubnetUtilisationSummary.utilisation,activeSubnetUtilisationSummary.utilisation,activeSubnetUtilisationSummary.utilisation >= 85 ? renderInterfaceTemplate("ipam/render-ipam-html-17",[]) : '',activeSubnetUtilisationSummary.duplicates.length ? renderInterfaceTemplate("ipam/render-ipam-html-18",[activeSubnetUtilisationSummary.duplicates.map(d=>`${escapeHtml(d.ip)} (${d.owners.map(escapeHtml).join(', ')})`).join('; ')]) : '']) : renderInterfaceTemplate("ipam/render-ipam-html-20",[]),activeIpamTab==='addresses'?'':'hidden',isIpAddressGridPaginated ? formatIpv4Address(ipAddressGridStartAddressNumber)+' – '+formatIpv4Address(ipAddressGridEndAddressNumber) : startHost+'–'+endHost,isIpAddressGridPaginated ? renderInterfaceTemplate("ipam/render-ipam-html-21",[ipAddressGridPage+1,ipAddressGridPageCount,ipAddressGridPage===0?'disabled':'',ipAddressGridPage===ipAddressGridPageCount-1?'disabled':'']) : '',!isIpAddressGridPaginated ? renderInterfaceTemplate("ipam/render-ipam-html-22",[ipViewRange === '1-32' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',ipViewRange === '33-64' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',ipViewRange === '65-128' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',ipViewRange === '129-192' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',ipViewRange === '193-254' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',ipViewRange === 'all' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300']) : '',ipamStatusLegend,escapeHtml(ipamAddressSearch),['All','Available','Assigned','Reserved'].map(v=>`<option value="${v}" ${ipamStatusFilter===v?'selected':''}>${v==='All'?'All statuses':v}</option>`).join(''),ipListHtml || '<p class="col-span-full py-8 text-center text-slate-600 dark:text-slate-300">No addresses to display for this range or filter.</p>']) : '']);
        }

        function changeSubnet(id) {
            if (activeIpamTab === 'manage' && ipamManageBlockFilter !== null &&
                !appState.subnets.some(s => s.id === id && (s.kind || 'network') === 'network' &&
                    (s.parentId || '') === ipamManageBlockFilter)) {
                showToast('Choose a subnet from the selected IP Address Block.', 'error');
                return;
            }
            selectedSubnetId = id;
            ipAddressGridPage = 0;
            renderContent();
        }

        // CIDR-aware, bounded bulk edits. Offset 1 is the first usable IP.
        function planBulkSubnetAddressAssignment(subnet, start, end, status, hostname, notes) {
            const range=parseSupportedIpv4Subnet(subnet?.cidr);
            if (!range) return {error:'Unsupported or invalid subnet.'};
            if (!Number.isInteger(start)||!Number.isInteger(end)||start<1||end<start||end>range.capacity)
                return {error:`Enter host offsets from 1 to ${range.capacity}, in ascending order.`};
            if (end-start+1>512) return {error:'Maximum 512 addresses per operation. Split larger ranges into batches.'};
            if (!['Reserved','Available'].includes(status)) return {error:'Choose Reserve or Release.'};
            const changes=[],blocked=[];
            for(let offset=start;offset<=end;offset++) {
                const ip=formatIpv4Address(range.network+offset);
                if (ip === subnet.gateway) { blocked.push(ip); continue; }
                const owners=appState.devices.filter(d=>d.primaryIp===ip);
                const old=appState.ipAllocations[ip];
                if (owners.length || (old?.deviceId && getDeviceById(old.deviceId))) {
                    blocked.push(ip); continue;
                }
                if(status==='Available') {
                    if(old && (old.status!=='Available' || old.deviceId || old.reservedForDeviceId)) changes.push({ip,offset,old,updated:{...old,status:'Available',deviceId:'',reservedForDeviceId:''}});
                } else {
                    if(old?.status==='Assigned') {blocked.push(ip);continue;}
                    const updated={...old,status:'Reserved',deviceId:'',hostname:hostname?`${hostname}-${offset}`:(old?.hostname||''),notes:notes||old?.notes||''};
                    if(JSON.stringify(old)!==JSON.stringify(updated)) changes.push({ip,offset,old,updated});
                }
            }
            return {changes,blocked,range,status};
        }
        function openIpamModal(markup) {
    openModal(markup);
    document.getElementById('modal-content').classList.add('ipam-record-modal');
}

        function openBulkIpModal(subnetId) {
    const subnet = appState.subnets.find(s => s.id === subnetId);
    const range = parseSupportedIpv4Subnet(subnet?.cidr);
    if (!range) return showToast('Invalid subnet for bulk editing.', 'error');
    openIpamModal(renderInterfaceTemplate("ipam/open-bulk-ip-modal-1",[escapeHtml(subnet.id),formatIpv4Address(range.first),formatIpv4Address(Math.min(range.first + 31, range.lastHost)),escapeHtml(appState.subnets.find(b => b.id === subnet.parentId)?.name || 'Unassigned'),escapeHtml(subnet.name),escapeHtml(String(subnet.vlan??'Not assigned'))]));
}

        function confirmIpamBulkAssignment(plan,status,notes,sample){
    openIpamModal(renderInterfaceTemplate("ipam/confirm-ipam-bulk-assignment-2",[status==='Reserved'?'reservation':'release',plan.changes.length,plan.blocked.length,plan.blocked.length?renderInterfaceTemplate("ipam/confirm-ipam-bulk-assignment-1",[escapeHtml(plan.blocked.slice(0,6).join(', '))]):'',escapeHtml(sample||'none'),status==='Reserved'&&notes?'<p class="ipam-modal-note">Entered IPAM notes replace existing notes on eligible addresses.</p>':'',!plan.changes.length?'disabled':'',plan.changes.length]));
}

        function handleBulkIpSubmit(e,subnetId) {
            e.preventDefault();
            const subnet=appState.subnets.find(s=>s.id===subnetId);
            // Convert the approved address inputs to the existing bounded host-offset planner.
            const range=parseSupportedIpv4Subnet(subnet?.cidr);
            const firstIp=parseIpv4AddressToNumber(document.getElementById('bulk-start')?.value.trim());
            const lastIp=parseIpv4AddressToNumber(document.getElementById('bulk-end')?.value.trim());
            if(!range||firstIp===null||lastIp===null) return showToast('Enter two usable IP addresses within this subnet.','error');
            const start=firstIp-range.network,end=lastIp-range.network;
            const status=document.getElementById('bulk-status')?.value;
            const hostname=document.getElementById('bulk-hostname')?.value.trim()||'';
            const notes=document.getElementById('bulk-notes')?.value.trim()||'';
            const plan=planBulkSubnetAddressAssignment(subnet,start,end,status,hostname,notes);
            if(plan.error) return showToast(plan.error,'error');
            const sample=plan.changes.slice(0,6).map(x=>x.ip).join(', ');
            confirmIpamBulkAssignment(plan,status,notes,sample);
            pendingBulkIpAssignment={subnetId,start,end,status,hostname,notes};
        }
        let pendingBulkIpAssignment=null;
        function returnToBulkIpAddressEditor() {
            const request = pendingBulkIpAssignment;
            pendingBulkIpAssignment = null;
            if (!request) return closeModal();
            openBulkIpModal(request.subnetId);
            const range=parseSupportedIpv4Subnet(appState.subnets.find(s=>s.id===request.subnetId)?.cidr);
            const values = {'bulk-start':range?formatIpv4Address(range.network+request.start):'',
                'bulk-end':range?formatIpv4Address(range.network+request.end):'',
                'bulk-status':request.status, 'bulk-hostname':request.hostname, 'bulk-notes':request.notes};
            Object.entries(values).forEach(([id,value]) => {
                const field = document.getElementById(id);
                if (field) field.value = value;
            });
            rememberModalForm();
            document.getElementById('bulk-start')?.focus();
        }
        async function applyBulkIpChanges() {
            const request=pendingBulkIpAssignment;
            if(!request) return showToast('Bulk preview expired. Start again.','error');
            const subnet=appState.subnets.find(s=>s.id===request.subnetId);
            const plan=planBulkSubnetAddressAssignment(subnet,request.start,request.end,request.status,request.hostname,request.notes);
            if(plan.error||!plan.changes?.length) return showToast(plan.error||'No eligible addresses remain.','error');
            // Central persistence belongs to the permission-aware SQLite bridge.
            if(!nextIpamBridge || !await nextIpamBridge.saveBulk(plan.changes)) return;
            pendingBulkIpAssignment=null;
            closeModal(true);
            renderContent();
        }

        // Suggest the first usable address when creating a subnet. Manual edits are respected.
        function subnetCidrFeedback(value) {
            const cidr = String(value || '').trim();
            if (!cidr) return {message: 'Enter a network CIDR to suggest a gateway.', invalid: false};
            const parts = cidr.match(/^([^/]+)\/(\d{1,2})$/);
            if (!parts) return {message: 'Use an IPv4 network in CIDR format, for example 192.168.1.0/24.', invalid: true};
            const ip = parseIpv4AddressToNumber(parts[1]);
            if (ip === null) return {message: 'Enter a valid IPv4 address (four numbers from 0 to 255).', invalid: true};
            const prefix = Number(parts[2]);
            if (prefix < 23 || prefix > 30) return {message: 'Caffoot Lite supports subnet sizes /23 through /30.', invalid: true};
            const size = 2 ** (32 - prefix);
            const network = Math.floor(ip / size) * size;
            if (ip !== network) return {
                message: 'Not a /' + prefix + ' network boundary. Did you mean ' + formatIpv4Address(network) + '/' + prefix + '?',
                invalid: true
            };
            return {message: 'Suggested gateway: ' + formatIpv4Address(network + 1) + ' (first usable IP; you can change it)', invalid: false};
        }

        function suggestSubnetGateway() {
            const cidrInput = document.getElementById('sub-cidr');
            const gatewayInput = document.getElementById('sub-gw');
            if (!cidrInput || !gatewayInput || gatewayInput.dataset.manualGateway==='true') return;
            const form = cidrInput.closest('form[data-form-action="subnet"]');
            if (!form || form.dataset.subnetId) return; // Never overwrite an existing subnet gateway.
            if (document.getElementById('sub-kind')?.value === 'container') { cidrInput.removeAttribute('aria-invalid'); cidrInput.removeAttribute('aria-describedby'); return; }
            const range = parseSupportedIpv4Subnet(cidrInput.value.trim());
            const suggestion = range ? formatIpv4Address(range.first) : '';
            const previous = gatewayInput.dataset.autoGateway || '';
            if (!gatewayInput.value.trim() || gatewayInput.value === previous) {
                gatewayInput.value = suggestion;
                gatewayInput.dataset.autoGateway = suggestion;
            }
            const hint = document.getElementById('sub-gw-hint');
            const feedback = subnetCidrFeedback(cidrInput.value);
            if (hint) {
                hint.textContent = feedback.message;
                hint.classList.toggle('text-red-700', feedback.invalid);
                hint.classList.toggle('dark:text-red-300', feedback.invalid);
                hint.classList.toggle('text-slate-600', !feedback.invalid);
                hint.classList.toggle('dark:text-slate-300', !feedback.invalid);
                hint.setAttribute('role', feedback.invalid ? 'alert' : 'status');
            }
            cidrInput.setAttribute('aria-invalid', feedback.invalid ? 'true' : 'false');
            cidrInput.setAttribute('aria-describedby', 'sub-gw-hint');
        }

function openSubnetModal(subnetId = null) {
    const subnet = subnetId ? appState.subnets.find(s => s.id === subnetId) : null;
    openIpamModal(renderInterfaceTemplate("ipam/open-subnet-modal-1",[subnet ? (subnet.kind === 'container' ? 'Edit IP Address Block' : 'Edit Subnet') : 'Add Single Subnet',escapeHtml(subnet ? subnet.id : ''),subnet ? 'disabled' : '',subnet?.kind !== 'container' ? 'selected' : '',subnet?.kind === 'container' ? 'selected' : '',escapeHtml(subnet ? subnet.cidr : ''),escapeHtml(subnet ? subnet.name : ''),escapeHtml(subnet ? subnet.vlan : ''),escapeHtml(subnet ? subnet.gateway : ''),appState.subnets.filter(s => s.kind === 'container' && s.id !== subnetId).map(s => `<option value="${escapeHtml(s.id)}" ${subnet?.parentId === s.id ? 'selected' : ''}>${escapeHtml(s.cidr)} — ${escapeHtml(s.name)}</option>`).join(''),escapeHtml(subnet ? (subnet.description || '') : ''),subnet ? `<button type="button" data-action="delete-subnet" data-id="${escapeHtml(subnet.id)}" class="btn btn-outline danger-action">Delete ${subnet.kind === 'container' ? 'IP Address Block' : 'Subnet'}</button>` : '', '<option value="">'+(subnet&&!subnet.purpose?'Not assigned (previously recorded)':'Select a purpose...')+'</option>'+['LAN','Management','VPN'].map(value=>'<option value="'+value+'" '+(subnet?.purpose===value?'selected':'')+'>'+value+'</option>').join('')]));
    const subnetTypeSelect = document.getElementById('sub-kind');
    const updateSubnetTypePreview = () => {
        const isContainer = subnetTypeSelect.value === 'container';
        document.getElementById('sub-name-label').textContent = isContainer ? 'IP Address Block Name' : 'Subnet Name';
        document.querySelectorAll('#modal-content [data-network-only]').forEach(element => {
            element.hidden = isContainer;
            element.style.display = isContainer ? 'none' : '';
        });
        for (const id of ['sub-vlan', 'sub-gw','sub-purpose']) {
            const input = document.getElementById(id);
            if(input){input.disabled=isContainer;input.required=!isContainer&&(id==='sub-purpose'?(!subnet||!!subnet.purpose):id==='sub-gw'?document.getElementById('sub-purpose').value!=='VPN':false);}
        }
        const submit = document.querySelector('#modal-content form[data-form-action="subnet"] button[type="submit"]');
        if (submit) {
            submit.disabled = false;
            submit.title = '';
            submit.textContent = isContainer ? 'Save IP Address Block' : 'Save Subnet';
        }
    };
    subnetTypeSelect.addEventListener('change', updateSubnetTypePreview);
    document.getElementById('sub-purpose').addEventListener('change',()=>{updateSubnetTypePreview();validateSubnetGatewayField();document.getElementById('sub-gw-required').textContent=document.getElementById('sub-purpose').value==='VPN'?'(Optional)':'*';});
    updateSubnetTypePreview();
    if (!subnet && subnetTypeSelect.value === 'network') suggestSubnetGateway();
    document.getElementById('sub-gw-required').textContent=subnet?.purpose==='VPN'?'(Optional)':'*';
}

                // Resolve VLAN card editing by stable record ID and scoped VLAN identity.
        function openSubnetModalByVlanId(vlanRecordId) {
            const vlan = appState.vlans.find(v => v.id === vlanRecordId);
            if (!vlan) return;
            const domain = vlan.parentId || '__unassigned__';
            const matches = appState.subnets.filter(s =>
                (!s.kind || s.kind === 'network') &&
                Number(s.vlan) === Number(vlan.vlanId)
            );
            // Legacy VLAN records lack parentId even when their subnet is in a block.
            // Resolve them only when there is exactly one matching subnet; never guess
            // between multiple blocks that reuse the same VLAN number.
            const scoped = matches.filter(s => (s.parentId || '__unassigned__') === domain);
            const subnet = scoped.length === 1 ? scoped[0] :
                (!vlan.parentId && matches.length === 1 ? matches[0] : null);
            if (subnet) openSubnetModal(subnet.id);
            else showToast(matches.length > 1
                ? 'Multiple subnets use this VLAN number; the legacy VLAN record has no unique block association.'
                : 'No linked subnet was found for this VLAN.', 'error');
        }

        async function handleSubnetSubmit(e, subnetId) {
            e.preventDefault();
            const requestedKind = document.getElementById('sub-kind')?.value;
            if (requestedKind === 'container') {
                const cidr = document.getElementById('sub-cidr').value.trim();
                const name = document.getElementById('sub-name').value.trim();
                const description = document.getElementById('sub-desc').value.trim();
                const parentId = document.getElementById('sub-parent').value || null;
                const range = hierarchyParseCidr(cidr);
                if (!range || !range.aligned || !name) {
                    showSubnetFormError('Enter a valid aligned CIDR and a IP Address Block name.');
                    return;
                }
                const previous = JSON.stringify(appState);
                const previousSelection = selectedSubnetId;
                const existing = subnetId ? appState.subnets.find(s => s.id === subnetId) : null;
                if (subnetId && (!existing || existing.kind !== 'container')) {
                    showSubnetFormError('Changing an existing network into a container is not supported.');
                    return;
                }
                const record = { ...(existing||{}), id: existing ? existing.id : 'sub_' + crypto.randomUUID(), kind: 'container', cidr, name, description };
                if(parentId)record.parentId=parentId;else if(existing?.parentId)delete record.parentId;
                const candidate = appState.subnets.map(s => s.id === record.id ? record : s);
                if (!existing) candidate.push(record);
                const issues = [...hierarchyValidate(candidate), ...hierarchyValidateTypes(candidate)];
                if (issues.length) {
                    showSubnetFormError(formatSubnetValidationMessage(issues[0],candidate),'sub-cidr');
                    return;
                }
                appState.subnets = candidate;
                if (!nextIpamBridge || !await nextIpamBridge.saveSubnet(previous)) {
                    appState = JSON.parse(previous);
                    selectedSubnetId = previousSelection;
                    if(!document.querySelector('#modal-content [data-form-error]')?.textContent)showSubnetFormError('IP Address Block was not saved. Previous inventory restored.');
                    return;
                }
                closeModal(true);
                renderContent();
                return;
            }
            if (requestedKind !== 'network') {
                showSubnetFormError('This subnet type is not available yet.');
                return;
            }
            const cidr = document.getElementById('sub-cidr').value.trim();
            const nameValue = document.getElementById('sub-name').value;
            const savedName = appState.subnets.find(subnet=>subnet.id===subnetId)?.name;
            const name = savedName&&nameValue===savedName?savedName:nameValue.trim();
            const vlanText=document.getElementById('sub-vlan').value.trim();
            const vlanIdVal=vlanText===''?null:Number(vlanText);
            const purpose=document.getElementById('sub-purpose').value;
            const originalSubnet=appState.subnets.find(s=>s.id===subnetId);
            if((!originalSubnet||originalSubnet.purpose)&&!purpose){showSubnetFormError('Select a subnet purpose.');return;}
            if(subnetNameConflicts({id:subnetId,name},originalSubnet)){showSubnetFormError('A subnet with this name already exists. Choose a unique subnet name.','sub-name');return;}
            const gateway = document.getElementById('sub-gw').value.trim();
            const description = document.getElementById('sub-desc').value.trim();
            const parentId = document.getElementById('sub-parent')?.value || null;

            if (!isValidCidr24(cidr)) {
                showSubnetFormError('Enter a valid network CIDR from /23 to /30 (e.g. 192.168.10.0/24).');
                return;
            }
            if (!name) {
                showSubnetFormError('Subnet name is required.');
                return;
            }
            if (vlanIdVal!==null&&(!Number.isInteger(vlanIdVal) || vlanIdVal < 1 || vlanIdVal > 4094)) {
                showSubnetFormError('VLAN ID must be between 1 and 4094.');
                return;
            }
            if (!(purpose==='VPN'&&!gateway)&&!isValidIpv4(gateway)) {
                showSubnetFormError('Gateway must be a valid IPv4 address.');
                return;
            }
            if (!(purpose==='VPN'&&!gateway)&&!isUsableHostAddressInSubnet(gateway, cidr)) {
                showSubnetFormError('Gateway must be a usable host address within the subnet.');
                return;
            }

            const duplicateSubnet = appState.subnets.find(s => s.cidr === cidr && s.id !== subnetId);
            if (duplicateSubnet) {
                showSubnetFormError(`Subnet ${cidr} already exists.`);
                return;
            }

            // Validate the proposed parent-child relationship before mutating live state.
            // Preserve legacy flat-network records without introducing default fields.
            const existingSubnet = subnetId ? appState.subnets.find(s => s.id === subnetId) : null;
            const proposedSubnet = {
                ...(existingSubnet || {}),
                id: existingSubnet?.id || 'sub_' + Date.now(),
                cidr, name, description, ...(purpose?{purpose}:{}), ...(vlanIdVal!==null?{vlan:existingSubnet&&Number(existingSubnet.vlan)===vlanIdVal?existingSubnet.vlan:vlanIdVal}:{}), ...(gateway?{gateway}:{})
            };
            if(vlanIdVal===null&&existingSubnet?.vlan!=null&&existingSubnet.vlan!=='')delete proposedSubnet.vlan;
            if(!gateway&&existingSubnet?.gateway!=null&&existingSubnet.gateway!=='')delete proposedSubnet.gateway;
            if (parentId) proposedSubnet.parentId = parentId;
            else if(existingSubnet?.parentId)delete proposedSubnet.parentId;
            const proposedSubnets = appState.subnets.filter(s => s.id !== proposedSubnet.id).concat(proposedSubnet);
            const hierarchyIssues = [...hierarchyValidate(proposedSubnets), ...hierarchyValidateTypes(proposedSubnets)];
            if (hierarchyIssues.length) {
                showSubnetFormError(formatSubnetValidationMessage(hierarchyIssues[0],proposedSubnets),'sub-parent');
                return;
            }
            const otherSubnetWithVlan = vlanIdVal===null?null:appState.subnets.find(s => (!s.kind || s.kind === 'network') && Number(s.vlan) === vlanIdVal && (s.parentId || '__unassigned__') === (parentId || '__unassigned__') && s.id !== subnetId);
            if (otherSubnetWithVlan) {
                showSubnetFormError(`VLAN ${vlanIdVal} is already used by ${otherSubnetWithVlan.name}.`);
                return;
            }

            const otherVlan = vlanIdVal===null?null:appState.vlans.find(v => Number(v.vlanId) === vlanIdVal && (v.parentId || '__unassigned__') === (parentId || '__unassigned__'));
            if (otherVlan && otherVlan.name !== name && !appState.subnets.some(s => Number(s.vlan) === vlanIdVal && (s.parentId || '__unassigned__') === (parentId || '__unassigned__') && s.id === subnetId)) {
                showSubnetFormError(`VLAN ${vlanIdVal} already exists with the name ${otherVlan.name}.`);
                return;
            }

            // preserve an unchanged gateway owned by one eligible network device.
            // Do not release or reassign an existing IPAM record during subnet edits.
            const existingGatewaySubnet = subnetId ? appState.subnets.find(s => s.id === subnetId) : null;
            const gatewayOwners = gateway?appState.devices.filter(d => d.primaryIp === gateway):[];
            const gatewayAllocation = gateway?appState.ipAllocations[gateway]:null;
            const eligibleExistingGatewayOwner = existingGatewaySubnet?.gateway === gateway &&
                gatewayOwners.length === 1 &&
                ['Firewall', 'Router', 'Layer 3 Switch'].includes(gatewayOwners[0].type) &&
                gatewayAllocation?.deviceId === gatewayOwners[0].id &&
                (!gatewayAllocation.reservedForDeviceId || gatewayAllocation.reservedForDeviceId === gatewayOwners[0].id);
            if ((gatewayOwners.length || gatewayAllocation) && !eligibleExistingGatewayOwner) {
                showSubnetFormError('Gateway IP is already assigned or reserved. Release that address before using it as a gateway.');
                return;
            }

            const beforeSubnetSave = JSON.stringify(appState);
            const previousSubnetSelection = selectedSubnetId;
            const previousDeviceDraftSubnet = deviceFormDraft?.subnetId;

            if (subnetId) {
                const sub = appState.subnets.find(s => s.id === subnetId);
                if (!sub) {
                    showSubnetFormError('Subnet no longer exists.');
                    return;
                }
                const previousVlanId = Number(sub.vlan);
                const previousParentId = sub.parentId || '__unassigned__';
                if (sub.cidr !== cidr) {
                    const dependentDevices = appState.devices.filter(d => d.primaryIp && ipBelongsToSubnet(d.primaryIp, sub.cidr));
                    const dependentIps = Object.keys(appState.ipAllocations).filter(ip => ipBelongsToSubnet(ip, sub.cidr));
                    if (dependentDevices.length || dependentIps.length) {
                        showSubnetFormError(`CIDR cannot be changed while ${dependentDevices.length} device(s) and ${dependentIps.length} IPAM allocation(s) depend on the subnet.`);
                        return;
                    }
                }
                sub.cidr = cidr;
                sub.name = name;
                if(vlanIdVal!==null)sub.vlan=proposedSubnet.vlan;else if(sub.vlan!=null&&sub.vlan!=='')delete sub.vlan;
                if(gateway)sub.gateway=gateway;else if(sub.gateway!=null&&sub.gateway!=='')delete sub.gateway;
                if(purpose)sub.purpose=purpose;
                sub.description = description;
                if (parentId) sub.parentId = parentId;
                else if(sub.parentId)delete sub.parentId;
                if (Number.isInteger(previousVlanId)&&previousVlanId>=1&&(previousVlanId !== vlanIdVal || previousParentId !== (parentId || '__unassigned__')) &&
                    !appState.subnets.some(item => item.id !== sub.id && Number(item.vlan) === previousVlanId && (item.parentId || '__unassigned__') === previousParentId)) {
                    appState.vlans = appState.vlans.filter(v => !(Number(v.vlanId) === previousVlanId && (v.parentId || '__unassigned__') === previousParentId));
                }
            } else {
                const newSub = proposedSubnet;
                appState.subnets.push(newSub);
                selectedSubnetId = newSub.id;
                if (deviceFormDraft) deviceFormDraft.subnetId = newSub.id;
            }

            if(vlanIdVal!==null){
            let existingVlan = appState.vlans.find(v => Number(v.vlanId) === vlanIdVal && (v.parentId || '__unassigned__') === (parentId || '__unassigned__'));
            if (existingVlan) {
                existingVlan.name = name;
                existingVlan.description = description;
            } else {
                appState.vlans.push({
                    id: 'vlan_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9),
                    vlanId: vlanIdVal,
                    name,
                    description,
                    color: 'indigo',
                    // New VLAN records retain their stable IP Address Block ownership.
                    // Legacy records are left untouched until explicit reconciliation.
                    ...(parentId ? { parentId } : {})
                });
            }

            }
            if (!nextIpamBridge || !await nextIpamBridge.saveSubnet(beforeSubnetSave)) {
                appState = JSON.parse(beforeSubnetSave);
                selectedSubnetId = previousSubnetSelection;
                if (deviceFormDraft) deviceFormDraft.subnetId = previousDeviceDraftSubnet;
                if(!document.querySelector('#modal-content [data-form-error]')?.textContent)showSubnetFormError('Subnet changes were not saved. Previous inventory restored.');
                return;
            }
            const returnToDevice = !!deviceFormDraft;
            closeModal(true);
            if (returnToDevice) {
                const draftDeviceId = deviceFormDraft.deviceId || null;
                switchTab('devices');
                setTimeout(() => openDeviceModal(draftDeviceId), 0);
            } else {
                renderContent();
            }
        }

        // Keep validation visible inside the editor and identify the field to correct.
        function showSubnetFormError(message, fieldId) {
            const form=document.querySelector('#modal-content form');
            if(!form)return;
            const text=formatSubnetValidationMessage(message),summary=form.querySelector('[data-form-error]');
            if(summary){summary.textContent=text;summary.classList.add('is-visible');}
            const field=document.getElementById(fieldId||(/name/i.test(text)?'sub-name':/VLAN/.test(text)?'sub-vlan':/gateway/i.test(text)?'sub-gw':'sub-cidr'));
            if(field&&form.contains(field)){
                const details=field.closest('details');if(details)details.open=true;
                field.setAttribute('aria-invalid','true');
                let hint=document.getElementById(field.id+'-error');
                if(!hint){hint=document.createElement('small');hint.id=field.id+'-error';hint.className='ipam-field-error';field.after(hint);}
                hint.textContent=text;field.setAttribute('aria-describedby',[...new Set([...(field.getAttribute('aria-describedby')||'').split(/\s+/),hint.id].filter(Boolean))].join(' '));field.focus();
            }
            if(summary)summary.scrollIntoView({block:'nearest'});
        }
        function formatSubnetValidationMessage(message, records=[]) {
            const all=[...appState.subnets,...(subnetBatchDraft?.parent?[subnetBatchDraft.parent]:[]),...records];
            let text=String(message||'The subnet could not be saved. Review the highlighted fields.');
            if(text.startsWith('Child ')&&text.includes('not strictly inside parent')){
                const child=all.find(r=>text.startsWith('Child '+r.id+' ')),parent=all.find(r=>text.endsWith('parent '+r.id));
                return 'Subnet '+(child?.cidr||'range')+' must be strictly inside Address Block '+(parent?.cidr||'range')+'. Choose a containing block or create without a block.';
            }
            if(text.startsWith('Overlapping unrelated subnets:')){
                const ranges=text.slice(text.indexOf(':')+1).trim();
                return 'The ranges '+ranges+' overlap without a parent relationship. An existing independent subnet inside a proposed block is also rejected by the current rule. Choose a non-overlapping range or no block.';
            }
            for(const record of all)if(record.id)text=text.split(record.id).join(record.cidr||record.name||'selected subnet');
            return text.replace(/sub_[A-Za-z0-9_-]+/g,'selected subnet');
        }
        function subnetNameConflicts(record, existing=null, records=appState.subnets) {
            if(existing&&record.name===existing.name)return false;
            const name=String(record.name||'').trim().toLowerCase();
            return !!name&&records.some(other=>other.id!==record.id&&(!other.kind||other.kind==='network')&&String(other.name||'').trim().toLowerCase()===name);
        }

        let subnetBatchDraft = null;
        function subnetHasVlan(subnet) {
            return subnet?.vlan!==undefined&&subnet?.vlan!==null&&subnet?.vlan!=='';
        }
        function validateSubnetGatewayField() {
            const gateway=document.getElementById('sub-gw'),cidr=document.getElementById('sub-cidr')?.value.trim();
            if(!gateway||gateway.disabled)return;
            const value=gateway.value.trim(),optional=document.getElementById('sub-purpose')?.value==='VPN';
            gateway.setCustomValidity(value&&!isUsableHostAddressInSubnet(value,cidr)?'Gateway must be a usable host address within this subnet.':!value&&!optional?'A gateway is required for this subnet purpose.':'');
            const hint=document.getElementById('sub-gw-hint');
            if(hint&&gateway.dataset.manualGateway==='true')hint.textContent=gateway.validationMessage||(optional&&!value?'No gateway assigned to this VPN range.':'Gateway is within the selected subnet.');
        }
        function openMultipleSubnets(resume=false) {
            if(!resume||!subnetBatchDraft)subnetBatchDraft={organisation:'none',pool:'',parentName:'',parentCidr:'',existing:'',start:'',prefix:'24',count:'',convention:'',spacing:'consecutive',parentId:'sub_'+crypto.randomUUID(),rows:[]};
            const draft=subnetBatchDraft,option=(value,label,current)=>'<option value="'+escapeHtml(value)+'" '+(value===current?'selected':'')+'>'+escapeHtml(label)+'</option>';
            openIpamModal(renderInterfaceTemplate("ipam/multiple-subnets-generator",[...['none','existing','new'].map(v=>draft.organisation===v?'selected':''),appState.subnets.filter(s=>s.kind==='container').map(s=>option(s.id,s.name+' — '+s.cidr,draft.existing)).join(''),['10.0.0.0/8','172.16.0.0/12','192.168.0.0/16'].map(v=>option(v,v,draft.pool)).join(''),escapeHtml(draft.parentName),escapeHtml(draft.parentCidr),escapeHtml(draft.start),[23,24,25,26,27,28,29,30].map(v=>option(String(v),'/'+v,draft.prefix)).join(''),escapeHtml(draft.count),['First usable IP','Last usable IP'].map(v=>option(v,v,draft.convention)).join(''),[['consecutive','Consecutive'],['tenth','Every 10th Subnet'],['custom','Custom CIDRs']].map(([value,label])=>option(value,label,draft.spacing||'consecutive')).join(''),draft.organisation!=='none'||draft.pool?'open':'']));
            document.getElementById('modal-content').classList.add('ipam-subnet-generator');
            const form=document.getElementById('subnet-batch-generator');
            const organisation=document.getElementById('subnet-batch-organisation');
            const visibility=()=>{
                for(const [selector,visible]of [['[data-new-parent]',organisation.value==='new'],['[data-existing-parent]',organisation.value==='existing']])form.querySelectorAll(selector).forEach(label=>{label.hidden=!visible;label.style.display=visible?'':'none';const field=label.querySelector('input,select');field.disabled=!visible;field.required=visible;});
            };
            const planning=form.querySelector('.ipam-optional-planning');
            const planningVisibility=()=>{visibility();planning.querySelectorAll('input,select').forEach(field=>{if(!planning.open)field.disabled=true;else if(!field.closest('[data-new-parent],[data-existing-parent]'))field.disabled=false;});};
            organisation.addEventListener('change',planningVisibility);planning.addEventListener('toggle',planningVisibility);planningVisibility();
            document.getElementById('subnet-batch-pool').addEventListener('change',event=>{
                if(!event.target.value)return;
                const pool=hierarchyParseCidr(event.target.value);
                document.getElementById('subnet-batch-start').value=formatIpv4Address(pool.start);
                if(organisation.value==='new')document.getElementById('subnet-batch-parent-cidr').value=event.target.value;
            });
            form.addEventListener('submit',event=>{
                event.preventDefault();
                for(const [key,id]of Object.entries({organisation:'organisation',pool:'pool',parentName:'parent-name',parentCidr:'parent-cidr',existing:'existing',start:'start',prefix:'prefix',count:'count',convention:'convention',spacing:'spacing'}))draft[key]=document.getElementById('subnet-batch-'+id).value.trim();
                try{generateSubnetBatchPreview();}catch(error){showSubnetFormError(error.message,error.fieldId||'subnet-batch-start');}
            });
        }
        function generateSubnetBatchPreview() {
            const draft=subnetBatchDraft,count=Number(draft.count),prefix=Number(draft.prefix);
            const reject=(message,field)=>{throw Object.assign(Error(message),{fieldId:'subnet-batch-'+field});};
            if(!Number.isInteger(count)||count<1||count>50)reject('Create between 1 and 50 subnets per operation.','count');
            if(!['First usable IP','Last usable IP'].includes(draft.convention))reject('Select a gateway convention.','convention');
            const first=parseSupportedIpv4Subnet(draft.start+'/'+prefix);
            if(!first)reject('Enter an aligned starting address with a /23–/30 prefix.','start');
            const spacing=draft.spacing||'consecutive',stride=spacing==='tenth'?10:1;
            if(!['consecutive','tenth','custom'].includes(spacing))reject('Select a subnet spacing option.','spacing');
            if(first.network+first.size*((count-1)*stride+1)>2**32)reject('The generated range exceeds IPv4 address space.','count');
            let parent=null;
            if(draft.organisation==='existing'){
                parent=appState.subnets.find(s=>s.id===draft.existing&&s.kind==='container');
                if(!parent)reject('Select an existing IP Address Block.','existing');
            }else if(draft.organisation==='new'){
                const range=hierarchyParseCidr(draft.parentCidr);
                if(!draft.parentName)reject('Enter an IP Address Block name.','parent-name');
                if(!range?.aligned)reject('Enter an aligned block CIDR, for example 10.128.0.0/16. This is separate from the subnet prefix.','parent-cidr');
                parent={id:draft.parentId,kind:'container',cidr:draft.parentCidr,name:draft.parentName};
            }
            const key=[draft.start,draft.prefix,spacing].join('|'),prior=draft.rows;
            draft.rows=Array.from({length:count},(_,index)=>{
                const start=first.network+first.size*index*stride,old=prior[index];
                const cidr=spacing==='custom'&&old&&draft.generationKey===key?old.cidr:formatIpv4Address(start)+'/'+prefix;
                const range=parseSupportedIpv4Subnet(cidr);
                return {id:old?.id||'sub_'+crypto.randomUUID(),cidr,name:old?.name||'',purpose:old?.purpose||'',vlan:old?.vlan||'',gateway:old?.gatewayEdited?old.gateway:range?formatIpv4Address(draft.convention==='First usable IP'?range.first:range.lastHost):old?.gateway||'',gatewayEdited:old?.gatewayEdited||false,description:old?.description||''};
            });
            draft.generationKey=key;draft.parent=parent;
            const records=draft.rows.map(row=>({id:row.id,kind:'network',cidr:row.cidr,...(parent?{parentId:parent.id}:{})}));
            const parentRange=parent?hierarchyParseCidr(parent.cidr):null,pool=draft.pool?hierarchyParseCidr(draft.pool):null;
            for(const record of records){const range=hierarchyParseCidr(record.cidr);
                if(spacing!=='custom'&&parentRange&&(!range||range.start<parentRange.start||range.end>parentRange.end||range.size>=parentRange.size))reject('Subnet '+record.cidr+' must be strictly inside Address Block '+parent.cidr+'. Choose a broader block such as /16 or no block.','parent-cidr');
                if(spacing!=='custom'&&pool&&(!range||range.start<pool.start||range.end>pool.end))reject('Generated subnets must stay within the selected quick-fill range.','pool');
            }
            const issues=hierarchyValidate([...appState.subnets,...(draft.organisation==='new'?[parent]:[]),...records]);
            if(issues.length&&spacing!=='custom')reject(formatSubnetValidationMessage(issues[0],records),draft.organisation==='new'?'parent-cidr':'start');
            renderSubnetBatchPreview();
            if(spacing==='custom')showSubnetBatchIssues(getSubnetBatchIssues(getSubnetBatchRecords()).filter(issue=>['cidr','gateway'].includes(issue.field)));
        }
        function getSubnetBatchRecords() {
            const draft=subnetBatchDraft;
            return draft.rows.map(row=>({id:row.id,kind:'network',cidr:row.cidr,name:row.name.trim(),purpose:row.purpose,description:row.description,...(draft.parent?{parentId:draft.parent.id}:{}),...(row.vlan.trim()?{vlan:Number(row.vlan)}:{}),...(row.gateway.trim()?{gateway:row.gateway.trim()}:{})}));
        }
        function getSubnetBatchIssues(records) {
            const issues=[],draft=subnetBatchDraft,vlans=new Set(appState.subnets.filter(subnetHasVlan).map(s=>JSON.stringify([s.parentId||'',Number(s.vlan)])));
            records.forEach((record,index)=>{
                const add=(field,message)=>issues.push({index,field,message});
                if(!record.name)add('name','Enter a subnet name.');
                else if(subnetNameConflicts(record,null,[...appState.subnets,...records]))add('name','A subnet with this name already exists. Choose a unique subnet name.');
                if(!parseSupportedIpv4Subnet(record.cidr))add('cidr','Enter an aligned subnet CIDR from /23 to /30.');
                const pool=draft.pool?hierarchyParseCidr(draft.pool):null,range=hierarchyParseCidr(record.cidr);
                if(pool&&range&&(range.start<pool.start||range.end>pool.end))add('cidr','This subnet is outside the selected quick-fill range.');
                if(!['LAN','Management','VPN'].includes(record.purpose))add('purpose','Select LAN, Management or VPN.');
                if(subnetHasVlan(record)){
                    const key=JSON.stringify([record.parentId||'',record.vlan]);
                    if(!Number.isInteger(record.vlan)||record.vlan<1||record.vlan>4094)add('vlan','VLAN must be an integer from 1 to 4094.');
                    else if(vlans.has(key))add('vlan','This VLAN is already used in this Address Block.');
                    vlans.add(key);
                    const catalogue=appState.vlans.find(v=>Number(v.vlanId)===record.vlan&&(v.parentId||'')===(record.parentId||''));
                    if(catalogue&&catalogue.name!==record.name)add('vlan','This VLAN already has another catalogue name.');
                }
                if(record.gateway||record.purpose!=='VPN'){
                    if(!isUsableHostAddressInSubnet(record.gateway,record.cidr))add('gateway','Enter a usable gateway within '+record.cidr+'.');
                    else if(appState.ipAllocations[record.gateway]||appState.devices.some(d=>d.primaryIp===record.gateway))add('gateway','Gateway IP is already assigned or reserved.');
                }
            });
            const hierarchy=hierarchyValidate([...appState.subnets,...(draft.organisation==='new'?[draft.parent]:[]),...records]);
            hierarchy.forEach(message=>{
                const affected=records.map((record,index)=>message.includes(record.cidr)||message.includes(record.id)?index:-1).filter(index=>index>=0);
                for(const index of affected.length?affected:[0])issues.push({index,field:draft.spacing==='custom'?'cidr':'name',message:formatSubnetValidationMessage(message,records)});
            });
            return issues;
        }
        function showSubnetBatchIssues(issues) {
            const form=document.getElementById('subnet-batch-preview');
            form.querySelectorAll('[data-subnet-error]').forEach(el=>{el.textContent='';el.hidden=true;el.classList.remove('is-visible');});
            form.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));
            for(const issue of issues){const row=form.querySelector('[data-subnet-row="'+issue.index+'"]'),error=row.querySelector('[data-subnet-error]');error.hidden=false;error.classList.add('is-visible');error.textContent+=(error.textContent?' ':'')+issue.message;(row.querySelector('[data-subnet-field="'+issue.field+'"]')||row.querySelector('[data-subnet-field=name]')).setAttribute('aria-invalid','true');}
            const summary=form.querySelector('[data-form-error]');summary.textContent=issues.length?'Please correct the highlighted subnet rows. Nothing has been saved.':'';summary.classList.toggle('is-visible',!!issues.length);
        }
        function renderSubnetBatchPreview() {
            const draft=subnetBatchDraft,rows=draft.rows;
            const controls=rows.map((row,index)=>{
                const field=(key,label,type='text')=>'<label class="ipam-field" for="subnet-row-'+index+'-'+key+'"><span class="ipam-preview-label">'+label+'</span><input id="subnet-row-'+index+'-'+key+'" data-subnet-field="'+key+'" type="'+type+'" value="'+escapeHtml(row[key])+'" '+(key==='name'||key==='cidr'||key==='gateway'&&row.purpose!=='VPN'?'required':key==='vlan'?'min="1" max="4094" step="1"':key==='description'?'disabled':'')+' aria-describedby="subnet-row-'+index+'-error"></label>';
                return '<tr data-subnet-row="'+index+'"><th scope="row">'+(draft.spacing==='custom'?field('cidr','Subnet CIDR *'):escapeHtml(row.cidr))+'<p class="form-error" id="subnet-row-'+index+'-error" data-subnet-error role="alert" hidden></p></th><td>'+field('name','Name *')+'<details><summary tabindex="0">Description (Optional)</summary>'+field('description','Description')+'</details></td><td><label class="ipam-field" for="subnet-row-'+index+'-purpose"><span class="ipam-preview-label">Purpose *</span><select id="subnet-row-'+index+'-purpose" data-subnet-field="purpose" required aria-describedby="subnet-row-'+index+'-error"><option value="">Select a purpose...</option>'+['LAN','Management','VPN'].map(value=>'<option '+(row.purpose===value?'selected':'')+'>'+value+'</option>').join('')+'</select></label></td><td>'+field('vlan','VLAN (Optional)','number')+'</td><td>'+field('gateway',row.purpose==='VPN'?'Gateway (Optional)':'Gateway *')+'</td></tr>';
            }).join('');
            const context=draft.parent?draft.parent.name+' — '+draft.parent.cidr:'No Address Block';
            openIpamModal(renderInterfaceTemplate("ipam/multiple-subnets-preview",[escapeHtml(rows.length+' subnet'+(rows.length===1?'':'s')+' · '+context+' · '+rows[0].cidr+' – '+rows.at(-1).cidr),controls,rows.length+' '+(rows.length===1?'Subnet':'Subnets')]));
            document.getElementById('modal-content').classList.add('ipam-subnet-preview');
            const form=document.getElementById('subnet-batch-preview');
            // Closed descriptions keep their values but stay outside the dialog's keyboard order.
            form.querySelectorAll('details').forEach(details=>details.addEventListener('toggle',()=>{details.querySelector('[data-subnet-field=description]').disabled=!details.open||form.dataset.saving==='true';}));
            document.getElementById('subnet-batch-back').addEventListener('click',()=>openMultipleSubnets(true));
            const capture=event=>{
                const key=event.target.dataset.subnetField,index=Number(event.target.closest('[data-subnet-row]')?.dataset.subnetRow);
                if(!key||!rows[index])return;
                rows[index][key]=event.target.value;if(key==='gateway')rows[index].gatewayEdited=true;
                if(key==='cidr'&&!rows[index].gatewayEdited){const range=parseSupportedIpv4Subnet(rows[index].cidr);if(range){rows[index].gateway=formatIpv4Address(draft.convention==='First usable IP'?range.first:range.lastHost);event.target.closest('[data-subnet-row]').querySelector('[data-subnet-field=gateway]').value=rows[index].gateway;}}
                const gateway=event.target.closest('[data-subnet-row]').querySelector('[data-subnet-field=gateway]');gateway.required=rows[index].purpose!=='VPN';gateway.closest('label').querySelector('span').textContent=rows[index].purpose==='VPN'?'Gateway (Optional)':'Gateway *';
                showSubnetBatchIssues(getSubnetBatchIssues(getSubnetBatchRecords()));
            };
            form.addEventListener('input',capture);form.addEventListener('change',capture);
            form.addEventListener('submit',async event=>{
                event.preventDefault();const records=getSubnetBatchRecords(),issues=getSubnetBatchIssues(records);
                showSubnetBatchIssues(issues);
                if(issues.length){form.querySelector('[aria-invalid=true]').focus();return;}
                const before=JSON.stringify(appState);
                if(draft.organisation==='new')appState.subnets.push(draft.parent);
                appState.subnets.push(...records);
                for(const record of records.filter(subnetHasVlan)){
                    const existing=appState.vlans.find(v=>Number(v.vlanId)===record.vlan&&(v.parentId||'')===(record.parentId||''));
                    if(!existing)appState.vlans.push({id:'vlan_'+crypto.randomUUID(),name:record.name,vlanId:record.vlan,color:'indigo',...(record.parentId?{parentId:record.parentId}:{})});
                }
                form.dataset.saving='true';
                const controls=[...document.getElementById('modal-content').querySelectorAll('button,input,select,textarea')],disabled=controls.map(control=>control.disabled);
                controls.forEach(control=>control.disabled=true);
                const saved=nextIpamBridge&&await nextIpamBridge.saveSubnet(before,'Created '+records.length+' subnets.');
                delete form.dataset.saving;
                if(!saved){
                    appState=JSON.parse(before);controls.forEach((control,index)=>control.disabled=disabled[index]);form.querySelector('[aria-invalid=true]')?.focus();
                    const error=form.querySelector('[data-form-error]');error.classList.add('is-visible');if(!error.textContent)error.textContent='The batch was not saved. Please review and try again.';
                    return;
                }
                subnetBatchDraft=null;closeModal(true);renderContent();
            });
        }

        function ipBelongsToSubnet(ip,cidr) { return isUsableHostAddressInSubnet(ip,cidr); }

        // refuse destructive operations with dependent records.
        // Users can deliberately detach/reassign dependencies first.
        function getDevicesAndIpAllocationsInSubnet(subnet, state=appState) {
            const devices=state.devices.filter(d=>d.primaryIp && ipBelongsToSubnet(d.primaryIp,subnet.cidr));
            const allocations=Object.keys(state.ipAllocations).filter(ip=>ipBelongsToSubnet(ip,subnet.cidr));
            return {devices,allocations};
        }
        function findInventoryIntegrityIssues(state=appState) {
            const issues=[];
            const seen=new Map();
            const rackIds=new Set(state.racks.map(r=>r.id));
            for(const d of state.devices) {
                if(d.primaryIp) {
                    if(seen.has(d.primaryIp)) issues.push(`Duplicate primary IP ${d.primaryIp}: ${seen.get(d.primaryIp)} and ${d.name}`);
                    else seen.set(d.primaryIp,d.name);
                    const a=state.ipAllocations[d.primaryIp];
                    if(!a || a.deviceId!==d.id || a.status!==(d.ipReserved?'Reserved':'Assigned'))
                        issues.push(`IPAM mismatch for ${d.name} (${d.primaryIp})`);
                }
                if(d.rackId && !rackIds.has(d.rackId)) issues.push(`Missing rack for ${d.name}`);
            }
            const deviceIds=new Set(state.devices.map(d=>d.id));
            for(const [ip,a] of Object.entries(state.ipAllocations)) {
                if(a?.deviceId && !deviceIds.has(a.deviceId)) issues.push(`Orphaned IPAM device link at ${ip}`);
                if(a?.reservedForDeviceId && !deviceIds.has(a.reservedForDeviceId)) issues.push(`Orphaned IPAM reservation at ${ip}`);
            }
            return issues;
        }
        function showDeletionBlockedNotice(subnet,block,rows,blockedIps){
    openIpamModal(renderInterfaceTemplate("shared/show-deletion-blocked-notice-1",[escapeHtml(subnet.name),escapeHtml(subnet.cidr),escapeHtml(String(subnet.vlan??'None')),escapeHtml(block?.name||'Unassigned'),blockedIps.length,rows]));
}

        function confirmInventoryDeletion(subnet,isNetwork,block,deps,deviceRows,subId){
    openIpamModal(renderInterfaceTemplate("shared/confirm-inventory-deletion-3",[isNetwork?'Subnet':'IP Address Block',escapeHtml(subnet.name),escapeHtml(subnet.cidr),isNetwork?renderInterfaceTemplate("shared/confirm-inventory-deletion-1",[escapeHtml(String(subnet.vlan??'Not assigned'))]):'',escapeHtml(block?.name||'Unassigned'),deps.devices.length?renderInterfaceTemplate("shared/confirm-inventory-deletion-2",[deps.devices.length,deviceRows]):'<p class="ipam-modal-note">No device assignments will be changed.</p>',escapeHtml(subId),deps.devices.length?'Move Devices & Delete Subnet':isNetwork?'Delete Subnet':'Delete IP Address Block']));
}

        function showSubnetDeletionBlocked(subnet, blockedIps) {
            const block = appState.subnets.find(s => s.id === subnet.parentId);
            const rows = blockedIps.map(ip => {
                const record = appState.ipAllocations[ip] || {};
                const reason = record.reservedForDeviceId ? 'Device Reservation' :
                    record.deviceId ? 'Device Allocation' : (record.status || 'IPAM Record');
                return renderInterfaceTemplate("ipam/rows-1",[escapeHtml(ip),escapeHtml(String(reason))]);
            }).join('');
            showDeletionBlockedNotice(subnet,block,rows,blockedIps);
        }

        function deleteSubnet(subId) {
            const subnet = appState.subnets.find(x => x.id === subId);
            if (!subnet) return;
            const children = appState.subnets.filter(x => String(x.parentId || '') === String(subId));
            if (children.length) {
                showToast(`Cannot delete ${subnet.name}: ${children.length} child subnet(s) or block(s) must be moved or deleted first.`, 'error');
                return;
            }
            const deps = getDevicesAndIpAllocationsInSubnet(subnet);
            // Only device-owned primary allocations can be detached automatically.
            // Independent reservations and ambiguous IPAM links must be resolved manually.
            const ownedIps = new Set(deps.devices.map(d => d.primaryIp));
            const unsafeIps = deps.allocations.filter(ip => {
                const a = appState.ipAllocations[ip];
                const owner = deps.devices.find(d => d.primaryIp === ip);
                return !owner || a?.deviceId !== owner.id || Boolean(a?.reservedForDeviceId);
            });
            if (unsafeIps.length || deps.devices.some(d => !appState.ipAllocations[d.primaryIp] || !ownedIps.has(d.primaryIp))) {
                const missing = deps.devices.filter(d => !appState.ipAllocations[d.primaryIp]).map(d => d.primaryIp);
                showSubnetDeletionBlocked(subnet, [...new Set([...unsafeIps, ...missing])]);
                return;
            }
            const isNetwork = !subnet.kind || subnet.kind === 'network';
            const domain = subnet.parentId || '__unassigned__';
            const linked = isNetwork&&subnetHasVlan(subnet) ? appState.vlans.filter(v =>
                Number(v.vlanId) === Number(subnet.vlan) &&
                (v.parentId || '__unassigned__') === domain
            ) : [];
            if (isNetwork && linked.length > 1) {
                showToast('Multiple VLAN records match this subnet. Resolve VLAN ownership before deleting.', 'error');
                return;
            }
            if (isNetwork && linked.length === 0 && appState.vlans.some(v =>
                Number(v.vlanId) === Number(subnet.vlan) && !v.parentId
            )) {
                showToast('Legacy VLAN ownership is unresolved. Reconcile VLAN ownership before deleting.', 'error');
                return;
            }
            const otherUsers = linked.length ? appState.subnets.filter(x =>
                x.id !== subId && (!x.kind || x.kind === 'network') &&
                Number(x.vlan) === Number(subnet.vlan) &&
                (x.parentId || '__unassigned__') === domain
            ) : [];
            if (otherUsers.length) {
                showToast('This VLAN is shared by another subnet in the same block. Reassign it before deleting.', 'error');
                return;
            }
            const block = appState.subnets.find(x => x.id === subnet.parentId);
            const deviceRows = deps.devices.map(d => renderInterfaceTemplate("devices/device-rows-3",[escapeHtml(d.name),escapeHtml(d.primaryIp)])).join('');
            const previewSignature = JSON.stringify({
                subnet: [subnet.id, subnet.name, subnet.cidr, subnet.kind, subnet.vlan, subnet.parentId],
                devices: deps.devices.map(d => [d.id, d.primaryIp]).sort((a,b) => String(a[0]).localeCompare(String(b[0]))),
                allocations: deps.allocations.map(ip => [ip, appState.ipAllocations[ip]]).sort((a,b) => a[0].localeCompare(b[0])),
                linked: linked.map(v => [v.id, v.vlanId, v.parentId])
            });
            pendingSubnetDeletion = { subId, previewSignature };
            confirmInventoryDeletion(subnet,isNetwork,block,deps,deviceRows,subId);
        }

        let pendingSubnetDeletion = null;
        function confirmDeleteSubnet(subId) {
            // Revalidate on confirmation: no stale or changed dependency preview may be applied.
            const subnet = appState.subnets.find(s => s.id === subId);
            if (!subnet) { closeModal(true); return; }
            const confirmation = document.querySelector('[data-action="confirm-delete-subnet"]');
            if (!confirmation || confirmation.dataset.id !== subId) return;
            const deps = getDevicesAndIpAllocationsInSubnet(subnet);
            const domain = subnet.parentId || '__unassigned__';
            const linked = (!subnet.kind || subnet.kind === 'network') ? appState.vlans.filter(v =>
                Number(v.vlanId) === Number(subnet.vlan) && (v.parentId || '__unassigned__') === domain
            ) : [];
            const currentSignature = JSON.stringify({
                subnet: [subnet.id, subnet.name, subnet.cidr, subnet.kind, subnet.vlan, subnet.parentId],
                devices: deps.devices.map(d => [d.id, d.primaryIp]).sort((a,b) => String(a[0]).localeCompare(String(b[0]))),
                allocations: deps.allocations.map(ip => [ip, appState.ipAllocations[ip]]).sort((a,b) => a[0].localeCompare(b[0])),
                linked: linked.map(v => [v.id, v.vlanId, v.parentId])
            });
            if (!pendingSubnetDeletion || pendingSubnetDeletion.subId !== subId || pendingSubnetDeletion.previewSignature !== currentSignature) {
                pendingSubnetDeletion = null;
                closeModal(true);
                showToast('Subnet or dependent records changed after preview. Deletion cancelled; please review again.', 'error');
                return;
            }
            pendingSubnetDeletion = null;
            closeModal(true);
            deleteSubnetCommit(subId);
        }

        async function deleteSubnetCommit(subId) {
            const subnet = appState.subnets.find(s => s.id === subId);
            if (!subnet) return;
            const deps = getDevicesAndIpAllocationsInSubnet(subnet);
            const independent = deps.allocations.filter(ip => {
                const owner = deps.devices.find(d => d.primaryIp === ip);
                const a = appState.ipAllocations[ip];
                return !owner || a?.deviceId !== owner.id || Boolean(a?.reservedForDeviceId);
            });
            if (independent.length || appState.subnets.some(s => s.parentId === subId)) {
                showToast('Dependencies changed; deletion cancelled. Review the subnet again.', 'error');
                return;
            }
            const isNetwork = !subnet.kind || subnet.kind === 'network';
            const domain = subnet.parentId || '__unassigned__';
            const linked = isNetwork&&subnetHasVlan(subnet) ? appState.vlans.filter(v => Number(v.vlanId) === Number(subnet.vlan) && (v.parentId || '__unassigned__') === domain) : [];
            if (linked.length > 1 || (isNetwork && linked.length === 0 && appState.vlans.some(v => Number(v.vlanId) === Number(subnet.vlan) && !v.parentId)) ||
                appState.subnets.some(s => subnetHasVlan(subnet)&&s.id !== subId && (!s.kind || s.kind === 'network') && Number(s.vlan) === Number(subnet.vlan) && (s.parentId || '__unassigned__') === domain)) {
                showToast('VLAN ownership changed; deletion cancelled.', 'error');
                return;
            }
            const expectedDevices = deps.devices.map(device => ({id:device.id, ip:device.primaryIp}));
            if (!nextIpamBridge || !await nextIpamBridge.deleteSubnet(subId, expectedDevices, deps.allocations)) {
                showToast('Subnet was not deleted; previous inventory is unchanged.', 'error');
                return;
            }
            selectedSubnetId = appState.subnets[0]?.id || '';
            renderContent();
        }

        async function deleteVlan(vId) {
            const vlan = appState.vlans.find(v => v.id === vId);
            if (!vlan) return;
            // Match VLAN number AND parent block. Legacy records without parentId share the unassigned domain.
            // This prevents a VLAN deletion in one block from depending on unrelated blocks.
            const vlanDomain = vlan.parentId || '__unassigned__';
            const linkedSubnets = appState.subnets.filter(s =>
                (!s.kind || s.kind === 'network') &&
                Number(s.vlan) === Number(vlan.vlanId) &&
                (s.parentId || '__unassigned__') === vlanDomain
            );
            if (linkedSubnets.length) {
                showToast('Delete or reassign the linked subnet before deleting this VLAN.', 'error');
                return;
            }
            if (confirm('Delete this VLAN?')) {
                const before = JSON.stringify(appState);
                appState.vlans = appState.vlans.filter(v => v.id !== vId);
                if (!nextIpamBridge || !await nextIpamBridge.saveSubnet(before, 'VLAN deleted.')) {
                    appState = JSON.parse(before);
                    renderContent();
                    showToast('VLAN was not deleted because the changes could not be saved.', 'error');
                } else renderContent();
            }
        }

function openIpModal(ip) {
    const gatewaySubnet = findSubnetUsingGatewayAddress(ip);
    if (gatewaySubnet) {
        const owner = findDeviceUsingIp(ip);
        showToast(`Gateway ${ip} is protected${owner ? ` and assigned to ${owner.name}` : ''}. Edit the network device instead.`, 'error');
        return;
    }
    const alloc = appState.ipAllocations[ip] || { status: 'Available', hostname: '', notes: '' };
    const primaryDevice = findDeviceUsingIp(ip);
    const deviceOwned = Boolean(primaryDevice || alloc.deviceId);
    const orphanedReservation = alloc.reservedForDeviceId && !getDeviceById(alloc.reservedForDeviceId);
    openIpamModal(renderInterfaceTemplate("ipam/open-ip-modal-3",[escapeHtml(ip),escapeHtml(ip),deviceOwned ? renderInterfaceTemplate("ipam/open-ip-modal-1",[escapeHtml(ip),escapeHtml(primaryDevice?.name || alloc.hostname || alloc.deviceId)]) : '<div class="ipam-modal-explain">Configure the selected address using the existing Available, Assigned and Reserved states.</div>',orphanedReservation ? renderInterfaceTemplate("ipam/open-ip-modal-2",[]) : '',deviceOwned ? 'disabled' : '',alloc.status === 'Available' ? 'selected' : '',alloc.status === 'Assigned' ? 'selected' : '',alloc.status === 'Reserved' ? 'selected' : '',escapeHtml(alloc.hostname || ''),deviceOwned ? 'disabled' : '',escapeHtml(alloc.notes || '')]));
    if (!nextIpamBridge?.canEdit()) {
        document.querySelectorAll('#modal-content form[data-form-action="ip"] input, #modal-content form[data-form-action="ip"] select, #modal-content form[data-form-action="ip"] button[type="submit"]').forEach(element => { element.disabled = true; });
    }
}

                async function handleIpSubmit(e, ip) {
            e.preventDefault();
            const status = document.getElementById('ip-status').value;
            const hostname = document.getElementById('ip-hostname').value;
            const notes = document.getElementById('ip-notes').value;
            const releaseOrphan = Boolean(document.getElementById('ip-release-orphan')?.checked);
            const previousAllocation = appState.ipAllocations[ip] ? {...appState.ipAllocations[ip]} : null;
            const primaryDevice = findDeviceUsingIp(ip);
            if (findSubnetUsingGatewayAddress(ip)) {
                showToast(`Gateway ${ip} is protected. Edit the network device instead.`, 'error');
                return;
            }

            if (primaryDevice || previousAllocation?.deviceId) {
                const existing = appState.ipAllocations[ip];
                // A device-owned address may update its own IPAM notes, never its device notes or ownership.
                if (!existing || status !== existing.status || hostname !== (existing.hostname || '') || releaseOrphan) {
                    showToast(`IP address ${ip} is the primary IP of ${primaryDevice?.name || existing.deviceId}. Only IPAM notes can be edited here; edit the device to change its assignment.`, 'error');
                    return;
                }
                appState.ipAllocations[ip] = { ...existing, notes };
                if (!nextIpamBridge || !await nextIpamBridge.save(ip, previousAllocation)) {
                    appState.ipAllocations[ip] = previousAllocation;
                    showToast('IP notes could not be saved. Previous allocation restored.', 'error');
                    return;
                }
                closeModal(true);
                renderContent();
                return;
            }

            if (status === 'Available') {
                const existing = appState.ipAllocations[ip];
                if (existing?.deviceId) {
                    const device = getDeviceById(existing.deviceId);
                    if (device?.primaryIp === ip) {
                        showToast(`IP ${ip} is a device primary IP. Edit the device before making it Available.`, 'error');
                        return;
                    }
                }
                if (existing || hostname || notes) appState.ipAllocations[ip] = { ...existing, status: 'Available', deviceId: '', reservedForDeviceId: existing?.status === 'Available' && !releaseOrphan ? (existing.reservedForDeviceId || '') : '', hostname, notes };
            } else {
                const existing = appState.ipAllocations[ip] || {};
                let deviceId = existing.deviceId || '';
                if (deviceId) {
                    const device = getDeviceById(deviceId);
                    if (!device || device.primaryIp !== ip) {
                        deviceId = '';
                    }
                }
                appState.ipAllocations[ip] = { ...existing, status, deviceId, hostname, notes, reservedForDeviceId: status === existing.status && !releaseOrphan ? (existing.reservedForDeviceId || '') : '' };
            }
            if (!nextIpamBridge || !await nextIpamBridge.save(ip, previousAllocation)) {
                if (previousAllocation) appState.ipAllocations[ip] = previousAllocation;
                else delete appState.ipAllocations[ip];
                showToast('IP changes could not be saved. Previous allocation restored.', 'error');
                return;
            }
            closeModal(true);
            renderContent();
        }

        // Accessibility: modal focus is contained and returned to its trigger.
        let modalReturnFocus = null;
        // Keep the live device form (including unsaved input values) while managing options.
        let deviceOptionsReturnContent = null;
        function preserveDeviceFormDuringOptionsDialog() {
            if (deviceOptionsReturnContent) return;
            const content = document.getElementById('modal-content');
            if (!content?.querySelector('form[data-device-form="true"]')) return;
            captureDeviceDetailFieldValues();
            deviceOptionsReturnContent = document.createDocumentFragment();
            while (content.firstChild) deviceOptionsReturnContent.appendChild(content.firstChild);
        }
        // Compare current field values with the initial form, not merely whether a field was touched.
        const modalFormSnapshots = new WeakMap();
        function modalFormSnapshot(form) {
            return JSON.stringify(Array.from(form.querySelectorAll('input,select,textarea'))
                .filter(field => !['button','submit','reset','hidden'].includes(field.type))
                .map(field => [field.id || field.name || '', field.type, field.type === 'checkbox' || field.type === 'radio' ? field.checked : field.value]));
        }
        function rememberModalForm() {
            const form = document.querySelector('#modal-content form[data-device-form="true"], #modal-content form[data-ipam-subnet-creation], #modal-content form[data-form-action="subnet"], #modal-content form[data-form-action="rack"], #modal-content form[data-form-action="ip"], #modal-content form[data-form-action="assign"], #modal-content form[data-form-action="bulk-ip"], #modal-content form[data-form-action="manufacturer"], #modal-content form[data-form-action="model"], #modal-content form[data-form-action="software"], #modal-content form[data-form-action="server-service"]');
            if (form) modalFormSnapshots.set(form, modalFormSnapshot(form));
        }
        let pendingDeviceFormDiscardCallback=null;
        function confirmDiscardDeviceFormChanges(onDiscard){
            if(document.getElementById('discard-dialog'))return false;
            pendingDeviceFormDiscardCallback=onDiscard;
            const overlay=document.createElement('div');
            overlay.id='discard-dialog';
            overlay.setAttribute('role','alertdialog');
            overlay.setAttribute('aria-modal','true');
            overlay.setAttribute('aria-labelledby','device-form-discard-title');
            overlay.setAttribute('aria-describedby','discard-description');
            overlay.className='absolute inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 rounded-2xl';
            overlay.innerHTML=renderInterfaceTemplate("device-details/confirm-discard-device-form-changes-1",[]);
            const content=document.getElementById('modal-content');
            if(getComputedStyle(content).position==='static')content.style.position='relative';
            overlay._returnFocus=document.activeElement;
            content.appendChild(overlay);
            overlay.querySelector('[data-action="keep-editing"]').focus();
            return false;
        }
        let resolvePendingRackCorrection = null;
        function confirmRackPlacementCorrection() {
            if (document.getElementById('rack-correction-dialog')) return Promise.resolve(false);
            return new Promise(resolve => {
                resolvePendingRackCorrection = resolve;
                const overlay = document.createElement('div');
                overlay.id = 'rack-correction-dialog';
                overlay.setAttribute('role', 'alertdialog');
                overlay.setAttribute('aria-modal', 'true');
                overlay.setAttribute('aria-labelledby', 'device-form-correction-title');
                overlay.setAttribute('aria-describedby', 'rack-correction-description');
                overlay.className = 'absolute inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 rounded-2xl';
                overlay.innerHTML = renderInterfaceTemplate("racks/confirm-rack-placement-correction-1",[]);
                const content = document.getElementById('modal-content');
                if (getComputedStyle(content).position === 'static') content.style.position = 'relative';
                overlay._returnFocus = document.activeElement;
                content.appendChild(overlay);
                overlay.querySelector('[data-action="rack-correction-cancel"]').focus();
            });
        }
        function resolveRackPlacementCorrection(accepted) {
            const overlay = document.getElementById('rack-correction-dialog');
            const focus = overlay?._returnFocus;
            overlay?.remove();
            const resolve = resolvePendingRackCorrection;
            resolvePendingRackCorrection = null;
            if (focus?.isConnected) focus.focus();
            if (resolve) resolve(accepted);
        }
        function keepEditingDeviceForm(){
            const overlay=document.getElementById('discard-dialog');
            const focus=overlay?._returnFocus;
            overlay?.remove();pendingDeviceFormDiscardCallback=null;
            if(focus?.isConnected)focus.focus();
        }
        function discardDeviceFormChanges(){
            const callback=pendingDeviceFormDiscardCallback;
            document.getElementById('discard-dialog')?.remove();
            pendingDeviceFormDiscardCallback=null;
            if(callback)callback();
        }
        function returnToDeviceFormFromSubnet() {
            const draft = deviceFormDraft;
            closeModal(false, () => {
                if (draft) {
                    switchTab('devices');
                    setTimeout(() => openDeviceModal(draft.deviceId || null), 0);
                }
            });
        }
        function closeModal(force = false, onClosed = null) {
            if(document.getElementById('subnet-batch-preview')?.dataset.saving==='true')return;
            if(rackShelfReturnContext){returnFromRackShelfCreation();return;}
            if (deviceOptionsReturnContent) {
                captureInstalledSoftwareSelections();
                captureServerServiceSelections();
                const content = document.getElementById('modal-content');
                content.replaceChildren(deviceOptionsReturnContent);
                deviceOptionsReturnContent = null;
                refreshDeviceDetailFields();
                content.querySelector('form[data-device-form="true"]')?.querySelector('input,select,textarea')?.focus();
                return;
            }
            const editableForm = document.querySelector('#modal-content form[data-device-form="true"], #modal-content form[data-ipam-subnet-creation], #modal-content form[data-form-action="subnet"], #modal-content form[data-form-action="rack"], #modal-content form[data-form-action="ip"], #modal-content form[data-form-action="assign"], #modal-content form[data-form-action="bulk-ip"], #modal-content form[data-form-action="manufacturer"], #modal-content form[data-form-action="model"], #modal-content form[data-form-action="software"], #modal-content form[data-form-action="server-service"]');
            if (!force && editableForm && modalFormSnapshots.has(editableForm) &&
                modalFormSnapshot(editableForm) !== modalFormSnapshots.get(editableForm) &&
                !confirmDiscardDeviceFormChanges(() => closeModal(true, onClosed))) return;
            const container = document.getElementById('modal-container');
            container.classList.add('hidden');
            container.classList.remove('flex');
            if (nextDeviceModalClosed) nextDeviceModalClosed();
            if (nextImportModalClosed) nextImportModalClosed();
            if (modalReturnFocus && modalReturnFocus.isConnected) modalReturnFocus.focus();
            modalReturnFocus = null;
            if (typeof onClosed === 'function') onClosed();
        }

        function openModal(htmlContent) {
            const container = document.getElementById('modal-container');
            const content = document.getElementById('modal-content');
            if (container.classList.contains('hidden')) modalReturnFocus = document.activeElement;
            content.classList.remove('rack-balanced-modal', 'settings-access-point-review', 'settings-legacy-review', 'ipam-record-modal','ipam-subnet-preview','ipam-subnet-generator', 'catalogue-modal', 'device-review-container', 'ipam-modal', 'catalog-modal');
            container.classList.remove('catalog-modal-overlay', 'device-review-overlay', 'ipam-modal-overlay', 'rack-modal-shade');
            content.innerHTML = htmlContent;
            if(content.querySelector('.ipam-modal-head')){
                content.classList.add('ipam-modal');container.classList.add('ipam-modal-overlay');
            }
            if(content.querySelector('.catalog-modal-head')){
                content.classList.add('catalog-modal','catalogue-modal');container.classList.add('catalog-modal-overlay');
            }
            if(content.querySelector(':scope > .rack-modal'))container.classList.add('rack-modal-shade');
            container.classList.remove('hidden');
            container.classList.add('flex');
            const heading = content.querySelector('h1,h2,h3,h4');
            if (heading) {
                heading.id = 'caffoot-modal-heading';
                content.setAttribute('aria-labelledby', heading.id);
            } else {
                content.removeAttribute('aria-labelledby');
                content.setAttribute('aria-label', 'Caffoot dialog');
            }
            const first = content.querySelector('input:not([type="hidden"]):not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled])');
            (first || content).focus();
            rememberModalForm();
        }

        document.addEventListener('keydown', function(event) {
            if(['Enter',' '].includes(event.key)&&event.target?.matches('.db-rack-row[role="button"]')){
                event.preventDefault();event.target.click();return;
            }
            if (event.key === 'Enter' && event.target?.id === 'dev-custom-location') {
                event.preventDefault();
                addCustomLocationOption();
                return;
            }
            const container = document.getElementById('modal-container');
            if (!container || container.classList.contains('hidden')) return;
            if (event.key === 'Escape') {
                event.preventDefault();
                if(document.getElementById('delete-dialog')){cancelDeviceCatalogueEntryDeletion();return;}
                if(document.getElementById('hypervisor-selection-dialog')){document.querySelector('#hypervisor-selection-dialog [data-action="cancel"]')?.click();return;}
                if(document.getElementById('rack-correction-dialog')){resolveRackPlacementCorrection(false);return;}
                if(document.getElementById('discard-dialog')){keepEditingDeviceForm();return;}
                if (container.querySelector('.device-catalogue-manager[data-device-catalogue-editing="true"]')) {
                    cancelDeviceCatalogueEntryRename();
                    return;
                }
                if (deviceFormDraft && container.querySelector('form[data-form-action="subnet"]')) {
                    returnToDeviceFormFromSubnet();
                } else if (deviceRackReturnPending && container.querySelector('form[data-form-action="rack"]')) {
                    cancelRackFromDevice();
                } else closeModal();
                return;
            }
            if (event.key !== 'Tab') return;
            const activeDialog=document.getElementById('hypervisor-selection-dialog')||document.getElementById('rack-correction-dialog')||document.getElementById('delete-dialog')||document.getElementById('discard-dialog');
            const items = Array.from((activeDialog||container).querySelectorAll('a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(el => el.getClientRects().length);
            if (!items.length) { event.preventDefault(); document.getElementById('modal-content').focus(); return; }
            // Safari can omit buttons/selects from its native Tab order depending on
            // keyboard settings. Advance explicitly through every dialog control.
            const current = items.indexOf(document.activeElement);
            const next = event.shiftKey
                ? (current <= 0 ? items.length - 1 : current - 1)
                : (current < 0 || current === items.length - 1 ? 0 : current + 1);
            event.preventDefault();
            items[next].focus();
        });

        const rackTypes = ['Floor-standing cabinet', 'Wall-mounted cabinet', 'Open-frame 2-post', 'Open-frame 4-post', 'Wall-mounted network enclosure'];
        const rackHeightPresets = [6, 9, 12, 18, 24, 42, 48];
        function readRackDimension(value) {
            if (value == null || String(value).trim() === '') return NaN;
            const match = String(value).trim().match(/^(\d+)\s*(?:mm)?$/i);
            const dimension = match ? Number(match[1]) : NaN;
            return Number.isInteger(dimension) && dimension >= 1 && dimension <= 10000 ? dimension : NaN;
        }

        function formatRackDimension(value) {
            const dimension = readRackDimension(value);
            return Number.isFinite(dimension) ? dimension + ' mm' : 'Not Recorded';
        }

        function rackPhysicalDetails(rack) {
            return {
                type: rack ? (rack.type || 'Free Standing') : rackTypes[0],
                height: rack ? Number(rack.heightU) : 42,
                width: rack ? readRackDimension(rack.widthMm ?? rack.width) : 600,
                depth: rack ? readRackDimension(rack.depthMm ?? rack.depth) : 600
            };
        }

        function openRackModal(rackId = null, correction = false) {
            const rack = rackId ? appState.racks.find(r => r.id === rackId) : null;
            if (rackId && !rack) return;
            const details = rackPhysicalDetails(rack);
            const physicalEditable = !rack || correction;
            const types = Array.from(new Set([...rackTypes, details.type]));
            const heights = Array.from(new Set([...rackHeightPresets, details.height])).filter(h => Number.isInteger(h) && h > 0).sort((a,b) => a-b);
            openModal(renderInterfaceTemplate("racks/open-rack-modal-2",[rack ? (correction ? 'Correct Rack Specifications' : 'Edit Network Rack') : 'Add Network Rack Enclosure',!rack?'Create a new enclosure with its physical dimensions.':correction?'A protected correction workflow reviews physical specifications and mounted equipment.':'Edit rack identity and placement; physical specifications remain locked.',escapeHtml(rack ? rack.id : ''),correction,rack ? escapeHtml(rack.name) : '',rack ? escapeHtml(rack.location || '') : '',physicalEditable ? '' : 'disabled',types.map(t => `<option value="${escapeHtml(t)}" ${t === details.type ? 'selected' : ''}>${escapeHtml(t)}</option>`).join(''),physicalEditable ? '' : 'disabled',heights.map(h => `<option value="${h}" ${h === details.height ? 'selected' : ''}>${h}U</option>`).join(''),physicalEditable ? '' : 'disabled',Number.isFinite(details.width) ? details.width : '',physicalEditable ? '' : 'disabled',Number.isFinite(details.depth) ? details.depth : '',physicalEditable ? '' : 'disabled',rack && !correction ? renderInterfaceTemplate("racks/open-rack-modal-1",[]) : correction ? '<div class="rack-modal-info rack-warn">Changes to physical specifications must not invalidate any mounted devices or accessories.</div>' : '',correction ? 'Review Correction' : 'Save Rack']));
            const heightSelect = document.getElementById('rack-height');
            if (physicalEditable && heightSelect) heightSelect.addEventListener('change', () => {
                const custom = document.getElementById('rack-height-custom');
                custom.hidden = heightSelect.value !== 'custom';
                custom.required = heightSelect.value === 'custom';
            });
        }

        async function handleRackSubmit(e, rackId) {
            e.preventDefault();
            const correction = e.target.closest('form').dataset.correction === 'true';
            const rack = rackId ? appState.racks.find(r => r.id === rackId) : null;
            if (rackId && !rack) return;
            const name = document.getElementById('rack-name').value.trim();
            if (!name) { showToast('Rack name is required.', 'error'); return; }
            const location = document.getElementById('rack-location').value;
            const before = JSON.stringify(appState);
            let physical = null;
            if (!rack || correction) {
                const selectedHeight = document.getElementById('rack-height').value;
                const rawHeight = selectedHeight === 'custom' ? document.getElementById('rack-height-custom').value : selectedHeight;
                const heightU = rawHeight === '' ? NaN : Number(rawHeight);
                const rawWidth = document.getElementById('rack-width').value;
                const rawDepth = document.getElementById('rack-depth').value;
                const widthMm = rawWidth === '' ? NaN : Number(rawWidth);
                const depthMm = rawDepth === '' ? NaN : Number(rawDepth);
                const type = document.getElementById('rack-type').value;
                if (!Number.isInteger(heightU) || heightU < 1 || heightU > 100 || !Number.isInteger(widthMm) || widthMm < 1 || widthMm > 10000 || !Number.isInteger(depthMm) || depthMm < 1 || depthMm > 10000 || !rackTypes.includes(type) && !(rack && type === rack.type)) {
                    showToast('Enter a valid rack type, height (1–100U), width and depth in mm.', 'error'); return;
                }
                physical = {heightU, widthMm, depthMm, type};
                if (rack) {
                    const device = appState.devices.find(d => d.rackId === rackId && Number(d.rackUEnd || d.rackUStart) > heightU);
                    const accessory = (appState.rackAccessories || []).find(a => a.rackId === rackId && Number(a.startU) + Number(a.heightU) - 1 > heightU);
                    if (device || accessory) { showToast('Rack height cannot be reduced below mounted devices or accessories.', 'error'); return; }
                    if (!(await confirmRackPlacementCorrection())) return;
                }
            }
            const previousRackSelection = selectedRackId;
            if (rack) {
                rack.name = name;
                rack.location = location;
                if (correction) {
                    rack.heightU = physical.heightU;
                    rack.widthMm = physical.widthMm;
                    rack.depthMm = physical.depthMm;
                    rack.depth = physical.depthMm + 'mm';
                    rack.type = physical.type;
                }
            } else {
                const newRack = {id: 'rack_' + Date.now(), name, heightU: physical.heightU, widthMm: physical.widthMm, depthMm: physical.depthMm, depth: physical.depthMm + 'mm', type: physical.type, location};
                appState.racks.push(newRack);
                selectedRackId = newRack.id;
            }
            const savedRack = appState.racks.find(item => item.id === (rackId || selectedRackId));
            if (!nextRackBridge || !savedRack ||
                !await nextRackBridge.save(savedRack.id, savedRack)) {
                appState = JSON.parse(before);
                selectedRackId = previousRackSelection;
                showToast('Rack changes were not saved. Please check the validation message.', 'error');
                return;
            }
            if (deviceRackReturnPending) {
                if (deviceFormDraft) deviceFormDraft.rackId = selectedRackId;
                const draftId = deviceFormDraft?.deviceId || null;
                deviceRackReturnPending = false;
                closeModal(true);
                switchTab('devices');
                setTimeout(() => openDeviceModal(draftId), 0);
            } else {
                closeModal(true);
                renderContent();
            }
        }

        async function deleteRack(rackId) {
            const rack=appState.racks.find(r=>r.id===rackId);
            if(!rack) return;
            const mounted=appState.devices.filter(d=>d.rackId===rackId);
            if(mounted.length || (appState.rackAccessories||[]).some(a=>a.rackId===rackId)) {
                showToast(`Cannot delete ${rack.name}: remove mounted devices and accessories first.`, 'error');
                return;
            }
            if(!confirm(`Delete empty rack ${rack.name}? This cannot be undone.`)) return;
            const before=JSON.stringify(appState);
            const previousSelection=selectedRackId;
            appState.racks=appState.racks.filter(r=>r.id!==rackId);
            selectedRackId=appState.racks[0]?.id||'';
            if (!nextRackBridge || !await nextRackBridge.save(rackId,null)) {
                appState=JSON.parse(before);
                selectedRackId=previousSelection;
                showToast('Rack was not deleted because the changes could not be saved.','error');
            }
            renderContent();
        }

        // Rack placement: the approved single form, connected to the existing rack saves.
        function openRackSlotPlacementDialog(rackId, slotU, mode = 'device') {
            if (!nextRackBridge?.canEdit()) {
                showToast('Racks edit permission required.', 'error'); return;
            }
            const rack = appState.racks.find(r => r.id === rackId);
            const u = Number(slotU);
            if (!rack || !Number.isInteger(u) || u < 1 || u > Number(rack.heightU)) return;
            const devices = appState.devices.filter(d => d.mountType === 'Rack Mounted' &&
                getRecognisedDeviceMountTypes(d.type).includes('Rack Mounted') && (!d.rackId || d.rackId === rackId));
            const types = Object.entries(rackAccessoryTypeDefinitions).filter(([,definition]) => !definition.vertical);
            const isAccessory = mode === 'accessory';
            const preferredHeight = Math.max(1, Math.min(12, Number(rackAccessoryPlacementHeightU) || 1));
            openModal(renderInterfaceTemplate("racks/open-rack-slot-placement-dialog-1",[u,escapeHtml(rackId),u,isAccessory?'':'selected',isAccessory?'selected':'',activeRackFace==='front'?'selected':'',activeRackFace==='rear'?'selected':'',devices.length?'Select a device...':'No eligible Rack Mounted devices available',devices.map(d=>`<option value="${escapeHtml(d.id)}">${escapeHtml(d.name)} · ${escapeHtml(d.type)}</option>`).join(''),types.map(([key,definition])=>`<option value="${escapeHtml(key)}" ${key==='patch'?'selected':''}>${escapeHtml(definition.label)}</option>`).join(''),Math.min(12,Number(rack.heightU)),preferredHeight]));
            const form = document.getElementById('rack-placement-form');
            const kind = form.querySelector('#place-item-type');
            const deviceSelect = form.querySelector('#assign-device-id');
            const typeSelect = form.querySelector('#place-accessory-type');
            const faceSelect = form.querySelector('#assign-face');
            const heightInput = form.querySelector('#place-height');
            const startSelect = form.querySelector('#assign-u-start');
            const portField = form.querySelector('#place-port-field');
            const portSelect = form.querySelector('#place-port-count');
            const errorField = form.querySelector('[data-form-error]');
            function refresh() {
                const deviceMode = kind.value === 'device';
                for (const [id,show] of [['place-device-field',deviceMode],['place-accessory-field',!deviceMode],['place-accessory-name',!deviceMode]]) {
                    const label = form.querySelector('#'+id);
                    label.hidden = !show;
                    label.querySelectorAll('input,select').forEach(control => { control.disabled = !show; });
                }
                const patch = !deviceMode && typeSelect.value === 'patch';
                portField.hidden = !patch;
                portSelect.disabled = !patch;
                const device = appState.devices.find(d => d.id === deviceSelect.value);
                if (deviceMode) {
                    heightInput.max = String(Number(rack.heightU));
                    heightInput.value = String(device ? Math.max(1,Number(device.rackUHeight) || (Number(device.rackUEnd)-Number(device.rackUStart)+1) || 1) : 1);
                    heightInput.disabled = true;
                } else {
                    const maximumAccessoryHeight = Math.min(12,Number(rack.heightU));
                    heightInput.max = String(maximumAccessoryHeight);
                    if (!Number.isInteger(Number(heightInput.value)) ||
                        Number(heightInput.value) < 1 || Number(heightInput.value) > maximumAccessoryHeight) {
                        heightInput.value = String(preferredHeight);
                    }
                    heightInput.disabled = false;
                }
                const height = Number(heightInput.value);
                const available = [];
                if ((deviceMode ? !!device : !!rackAccessoryTypeDefinitions[typeSelect.value]) &&
                    Number.isInteger(height) && height >= 1 && height <= Number(rack.heightU)) {
                    for (let start = 1; start + height - 1 <= Number(rack.heightU); start++) {
                        const invalid = deviceMode
                            ? validateRackPlacement(device.id,rackId,faceSelect.value,start,start+height-1)
                            : validateRackAccessoryPlacement({rackId,type:typeSelect.value,face:faceSelect.value,side:null,startU:start,heightU:height});
                        if (!invalid) available.push(start);
                    }
                }
                const previous = Number(startSelect.value) || u;
                startSelect.replaceChildren();
                for (const position of available) startSelect.add(new Option(
                    height === 1 ? 'U'+position : 'U'+position+'–U'+(position+height-1),String(position)));
                startSelect.disabled = !available.length;
                if (available.length) startSelect.value = String(available.includes(previous)?previous:available.includes(u)?u:available[0]);
                errorField.textContent = available.length ? '' : (deviceMode && !device?'Select an eligible Rack Mounted device.':'No available positions for this type, height and face.');
            }
            kind.addEventListener('change',refresh);
            deviceSelect.addEventListener('change',refresh);
            typeSelect.addEventListener('change',refresh);
            faceSelect.addEventListener('change',refresh);
            heightInput.addEventListener('input',refresh);
            refresh();
            form.addEventListener('submit',async event => {
                if (kind.value === 'device') return; // Existing delegated assign handler and save logic.
                event.preventDefault(); event.stopPropagation();
                const data = new FormData(form);
                const candidate = {
                    id:'acc-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),
                    rackId, type:String(data.get('accessoryType')),name:String(data.get('accessoryName')||'').trim(),
                    face:String(data.get('face')),startU:Number(data.get('startU')),
                    heightU:Number(data.get('heightU')),side:null,
                    portCount:String(data.get('accessoryType'))==='patch'?Number(data.get('portCount')):null
                };
                const invalid = !nextRackBridge?.canEdit() ? 'Racks edit permission required.'
                    : !startSelect.value ? 'No free U position is available.'
                    : (candidate.type==='patch' && ![12,24,48].includes(candidate.portCount)) ? 'Choose a valid patch-panel port count.'
                    : validateRackAccessoryPlacement(candidate);
                if (invalid) { errorField.textContent = invalid; return; }
                const before = JSON.stringify(appState);
                if (!Array.isArray(appState.rackAccessories)) appState.rackAccessories=[];
                appState.rackAccessories.push(candidate);
                if (!await nextRackBridge.saveAccessory(candidate.id,candidate)) {
                    appState=JSON.parse(before);
                    errorField.textContent='Accessory could not be saved. Your previous inventory is unchanged.';
                    return;
                }
                closeModal(true);activeRackFace=candidate.face;renderContent();
            });
        }

        function openAssignDeviceModal(rackId, slotU, editDeviceId = null) {
            if (!nextRackBridge?.canEdit()) {
                showToast('Racks edit permission required.', 'error'); return;
            }
            const rack = appState.racks.find(r => r.id === rackId);
            if (!rack) { showToast('Select a rack before mounting a device.', 'error'); return; }
            const occupant = appState.devices.find(d => d.rackId === rackId && (d.face || 'front') === activeRackFace &&
                Number(d.rackUStart) <= Number(slotU) && Number(d.rackUEnd || d.rackUStart) >= Number(slotU));
            const editingDevice = editDeviceId ? appState.devices.find(d => d.id === editDeviceId && d.rackId === rackId) : null;
            if (editDeviceId && !editingDevice) { showToast('The mounted device could not be found.', 'error'); return; }
            const unassignedDevices = appState.devices.filter(d => d.mountType === 'Rack Mounted' && getRecognisedDeviceMountTypes(d.type).includes('Rack Mounted') && (!d.rackId || d.rackId === rackId));
            if (occupant) unassignedDevices.sort((a, b) => (a.id === occupant.id ? -1 : b.id === occupant.id ? 1 : 0));

            openModal(renderInterfaceTemplate("device-details/open-assign-device-modal-1",[escapeHtml(rackId),Number(slotU)||1,editingDevice ? 'aria-label="Mounted device being edited"' : '',editingDevice ? '' : (unassignedDevices.length ? '<option value="" selected disabled>Select a device...</option>' : '<option value="" selected disabled>No eligible Rack Mounted devices available</option>'),unassignedDevices.map(d => `<option value="${escapeHtml(d.id)}" ${editingDevice && d.id === editingDevice.id ? 'selected' : ''}>${escapeHtml(d.name)} (${escapeHtml(d.type)})</option>`).join(''),activeRackFace==='front'?'selected':'',activeRackFace==='rear'?'selected':'']));
            const deviceSelect = document.getElementById('assign-device-id');
            const faceSelect = document.getElementById('assign-face');
            const startSelect = document.getElementById('assign-u-start');
            const refresh = () => refreshAssignStartPositions(rackId, Number(startSelect?.value) || Number(slotU));
            deviceSelect?.addEventListener('change', refresh);
            faceSelect?.addEventListener('change', refresh);
            refreshAssignStartPositions(rackId, Number(slotU));
        }

        // Only offer positions that fit the inventory device on the selected face.
        function refreshAssignStartPositions(rackId, preferredU) {
            const select = document.getElementById('assign-u-start');
            const deviceId = document.getElementById('assign-device-id')?.value;
            const face = document.getElementById('assign-face')?.value || 'front';
            const device = appState.devices.find(d => d.id === deviceId);
            const rack = appState.racks.find(r => r.id === rackId);
            if (!select) return;
            select.replaceChildren();
            if (!device || !rack) {
                select.add(new Option('Select a device first', ''));
                select.disabled = true;
                return;
            }
            const height = Math.max(1, Number(device.rackUHeight) || (Number(device.rackUEnd) - Number(device.rackUStart) + 1) || 1);
            const available = [];
            for (let u = 1; u + height - 1 <= Number(rack.heightU); u++) {
                if (!validateRackPlacement(device.id, rackId, face, u, u + height - 1)) available.push(u);
            }
            if (!available.length) {
                select.add(new Option('No available positions', ''));
                select.disabled = true;
                return;
            }
            select.disabled = false;
            for (const u of available) {
                const label = height === 1 ? `U${u}` : `U${u}–U${u + height - 1}`;
                select.add(new Option(label, String(u)));
            }
            const preferred = Number(preferredU);
            const chosen = available.includes(preferred) ? preferred :
                available.reduce((best, u) => Math.abs(u - preferred) < Math.abs(best - preferred) ? u : best, available[0]);
            select.value = String(chosen);
        }

        async function handleAssignSubmit(e, rackId, defaultSlot) {
            e.preventDefault();
            const before = JSON.stringify(appState);
            const deviceId = document.getElementById('assign-device-id')?.value;
            if (!deviceId) { showToast('Select a device from inventory before mounting.', 'error'); return; }
            const face = document.getElementById('assign-face').value;
            const uStart = parseInt(document.getElementById('assign-u-start').value);
            if (!Number.isInteger(uStart)) {
                showToast('No valid rack position is available for this device on the selected face.', 'error');
                return;
            }

            const device = appState.devices.find(d => d.id === deviceId);
            if (!device || device.mountType !== 'Rack Mounted' || !getRecognisedDeviceMountTypes(device.type).includes('Rack Mounted')) {
                showToast('Only devices configured as Rack Mounted can be placed in a rack.', 'error');
                return;
            }
            if (device) {
                const height = Math.max(1, Number(device.rackUHeight) || (Number(device.rackUEnd) - Number(device.rackUStart) + 1) || 1);
                const endU = uStart + height - 1;
                const validationError = validateRackPlacement(device.id, rackId, face, uStart, endU);
                if (validationError) {
                    showToast(validationError, 'error');
                    return;
                }

                device.rackId = rackId;
                device.face = face;
                device.rackUStart = uStart;
                device.rackUEnd = endU;
                device.rackUHeight = height;
                device.mountType = 'Rack Mounted';
                // Preserve the physical location when moving between racks.
            }

            if (!nextRackBridge || !await nextRackBridge.savePlacement(deviceId)) {
                appState = JSON.parse(before);
                showToast('Rack move was not saved; your previous placement was restored.', 'error');
                return;
            }
            closeModal(true);
            activeRackFace = face;
            renderContent();
        }

        async function unassignDevice(deviceId) {
            const device = appState.devices.find(d => d.id === deviceId);
            if (device) {
                const before = JSON.stringify(appState);
                device.rackId = '';
                device.rackUStart = null;
                device.rackUEnd = null;
                // Preserve the physical location when unassigning a rack.
                device.mountType = 'Desktop';
                if (!nextRackBridge || !await nextRackBridge.savePlacement(deviceId)) {
                    appState = JSON.parse(before);
                    showToast('Rack unassignment was not saved; original placement restored.', 'error');
                }
                renderContent();
            }
        }

        function getSubnetForIp(ip) {
            if(!isValidIpv4(ip)) return null;
            return appState.subnets.find(subnet=>(!subnet.kind||subnet.kind==='network')&&isUsableHostAddressInSubnet(ip,subnet.cidr))||null;
        }
        function refreshDeviceIpOptions() {
            const subnetSelect = document.getElementById('dev-subnet');
            const ipInput = document.getElementById('dev-ip');
            const select = document.getElementById('dev-ip-available');
            const hint = document.getElementById('dev-ip-hint');
            if (!subnetSelect || !ipInput || !select) return;
            const subnet = appState.subnets.find(s => s.id === subnetSelect.value);
            select.innerHTML = '<option value="">Select next available IP...</option>';
            if (!subnet) {
                ipInput.disabled = true;
                select.disabled = true;
                ipInput.value = '';
                if (hint) hint.textContent = 'Select an existing subnet before entering an IP address.';
                return;
            }
            const range = parseSupportedIpv4Subnet(subnet.cidr);
            if (!range) {
                ipInput.disabled = true;
                select.disabled = true;
                if (hint) hint.textContent = 'This subnet has an invalid address range.';
                return;
            }
            const currentIp = ipInput.value.trim();
            const editingId = document.querySelector('[data-device-form="true"]')?.dataset.deviceId || '';
            const used = new Set(Object.keys(appState.ipAllocations || {}));
            appState.devices.forEach(d => { if (d.primaryIp && d.id !== editingId) used.add(d.primaryIp); });
            const available = [];
            let count = 0;
            for (let n = range.first; n <= range.lastHost; n++) {
                const ip = formatIpv4Address(n);
                if (ip === subnet.gateway && ip !== currentIp) continue;
                if (!used.has(ip) || (ip === currentIp && appState.devices.some(d => d.id === editingId && d.primaryIp === ip))) {
                    count++;
                    if (available.length < 50) available.push(ip);
                }
            }
            select.innerHTML = '<option value="">Select next available IP...</option>' +
                available.map(ip => `<option value="${escapeHtml(ip)}" ${ip === currentIp ? 'selected' : ''}>${escapeHtml(ip)}${ip === currentIp ? ' (current)' : ''}</option>`).join('');
            select.disabled = available.length === 0;
            ipInput.disabled = false;
            ipInput.placeholder = 'Enter an IP or choose above';
            if (hint) hint.textContent = `${subnet.name || subnet.cidr} · ${count} available · showing first ${available.length} · gateway excluded`;
        }

        function handleDeviceIpSelection() {
            const select = document.getElementById('dev-ip-available');
            const input = document.getElementById('dev-ip');
            if (select && input && select.value) {
                input.value = select.value;
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }

        function getDeviceSubnetTopLevelBlock(subnet) {
            let current = subnet;
            const visited = new Set();
            while (current?.parentId && !visited.has(current.id)) {
                visited.add(current.id);
                current = appState.subnets.find(s => s.id === current.parentId);
            }
            return current?.kind === 'container' && !current.parentId ? current : null;
        }
        function refreshDeviceSubnetSelectionCascade(level = 'initial') {
            const block=document.getElementById('dev-block'),vlan=document.getElementById('dev-vlan'),subnet=document.getElementById('dev-subnet');
            if(!block||!vlan||!subnet)return;
            const selectedId=level==='initial'?subnet.dataset.initialSubnet:subnet.value;
            const selected=appState.subnets.find(s=>s.id===selectedId);
            if(level==='initial'&&block.dataset.restoredFilter!==undefined)block.value=block.dataset.restoredFilter;
            else if(level==='initial'&&selected&&!block.value)block.value=getDeviceSubnetTopLevelBlock(selected)?.id||'__unassigned__';
            const inside=s=>{
                if(!block.value)return true;
                if(block.value==='__unassigned__')return !s.parentId;
                const seen=new Set();let parent=s.parentId;
                while(parent&&!seen.has(parent)){if(parent===block.value)return true;seen.add(parent);parent=appState.subnets.find(p=>p.id===parent)?.parentId;}
                return false;
            };
            const networks=appState.subnets.filter(s=>(!s.kind||s.kind==='network')&&inside(s));
            subnet.innerHTML='<option value="">Select a subnet...</option>'+networks.map(s=>'<option value="'+escapeHtml(s.id)+'">'+escapeHtml((s.name||s.cidr)+' — '+s.cidr)+'</option>').join('');
            if(networks.some(s=>s.id===selectedId))subnet.value=selectedId;
            const current=appState.subnets.find(s=>s.id===subnet.value);
            vlan.value=subnetHasVlan(current)?String(current.vlan):'Not assigned';
            if(level!=='initial')handleDeviceSubnetChange();
            if(!networks.length&&block.value&&block.value!=='__unassigned__'){
                const hint=document.getElementById('dev-ip-hint');if(hint)hint.textContent='This IP Address Block has no usable child subnets. Create an addressable subnet in IPAM first.';
            }
            refreshDeviceEditorDropdowns();
        }
        function handleDeviceSubnetChange() {
            const select=document.getElementById('dev-subnet'),ip=document.getElementById('dev-ip'),vlan=document.getElementById('dev-vlan');
            if(!select||!ip)return;
            const subnet=appState.subnets.find(s=>s.id===select.value),current=getSubnetForIp(ip.value.trim());
            if(vlan)vlan.value=subnetHasVlan(subnet)?String(subnet.vlan):'Not assigned';
            if(!subnet||!current||current.id!==subnet.id)ip.value='';
            refreshDeviceIpOptions();refreshDeviceEditorDropdowns();
        }

        function updateDeviceRackLimits() {
            const rackSelect = document.getElementById('dev-rack-id');
            const start = document.getElementById('dev-rack-u');
            const height = document.getElementById('dev-rack-height');
            const face = document.getElementById('dev-rack-face');
            const hint = document.getElementById('dev-rack-range-hint');
            const form = document.querySelector('[data-device-form="true"]');
            if (!rackSelect || !start || !height || !hint) return;
            const rack = appState.racks.find(r => r.id === rackSelect.value);
            const previous = start.value || start.dataset.initialU || '';
            delete start.dataset.initialU;
            if (!rack) {
                start.innerHTML = '<option value="">Select a rack first...</option>';
                start.disabled = true;
                height.disabled = true;
                hint.textContent = 'Select or create a network rack before choosing a mounting position.';
                return;
            }
            start.disabled = false;
            height.disabled = false;
            const capacity = Number(rack.heightU);
            height.max = String(capacity);
            const units = Number(height.value);
            const validHeight = Number.isInteger(units) && units > 0 && units <= capacity;
            const maxStart = validHeight ? capacity - units + 1 : 0;
            const deviceId = form?.dataset.deviceId || null;
            const currentFace = face?.value || 'front';
            const available = [];
            for (let u = 1; u <= maxStart; u++) {
                const end = u + units - 1;
                if (!validateRackPlacement(deviceId, rack.id, currentFace, u, end)) available.push(u);
            }
            start.innerHTML = '<option value="">Select Start U...</option>' + available.map(u =>
                `<option value="${u}">U${u}–U${u + units - 1}</option>`).join('');
            if (available.includes(Number(previous))) start.value = String(previous);
            else if (available.length === 1) start.value = String(available[0]);
            hint.textContent = !validHeight
                ? `U Height must be between 1 and ${capacity} for ${rack.name}.`
                : available.length
                    ? `${rack.name} (${capacity}U): ${available.length} available starting position(s) for a ${units}U device. Occupied positions are excluded.`
                    : `No available ${units}U positions on the ${currentFace} face of ${rack.name}.`;
            height.setCustomValidity(validHeight ? '' : `U Height must be between 1 and ${capacity}.`);
            start.required = true;
        }
        function toggleDeviceMountType() {
            refreshDeviceShelfFields();
            const mount = document.getElementById('dev-mount-type')?.value;
            const location = document.getElementById('dev-location');
            const rackOptions = document.getElementById('racked-options');
            const height = document.getElementById('dev-rack-height');
            const rack = document.getElementById('dev-rack-id');
            if(rack)rack.required=mount==='Rack Mounted'&&!isVirtualDeviceForm();
            if (!location || !rackOptions) return;
            if (mount === 'Rack Mounted') {
                // Location Area stays editable independently of mounting.
                rackOptions.hidden = false;
                rackOptions.classList.remove('hidden');
                if (height) height.required = true;
            } else {
                // Switching mounting must not erase a building or room.
                rackOptions.classList.add('hidden');
                rackOptions.hidden = true;
                if (height) height.required = false;
            }
        }

        // read-only details follow the same order as the Add/Edit form.
        // Use the current managed labels, including renamed software and server functions.
        function getDeviceDetailFieldLabel(key, type) {
            if (deviceTypeDetailGroups[String(type || '').toLowerCase().trim()] === 'router' && key === 'networkConnection') return 'WAN connection method';
            const managed = [...getConfiguredServerServiceCatalogueEntries(), ...builtInServerServiceSuggestions, ...getAvailableSoftwareCatalogueEntries()].find(item => item.key === key);
            return ({softwarePlatform:'Operating System',softwareVersion:'OS Version',windowsLicence:'Windows Licence'})[key] || managed?.label || deviceDetailFieldLabels[key] || key;
        }
        function buildDeviceDetailRows(device, field) {
            const details = device.typeDetails && typeof device.typeDetails === 'object' ? device.typeDetails : {};
            const keys = getDetailFieldsForDeviceType(device.type);
            // Incompatible fields are displayed in the separate History tab, never as active hardware.
            const historical = [];
            const allKeys = [...keys, ...historical];
            const flags = new Set([...booleanDeviceDetailFields, ...getAvailableServerServiceFieldKeys(), ...getAvailableSoftwareCatalogueEntries().map(x=>x.key)]);
            const serviceKeys=new Set([...builtInServerServiceSuggestions,...getConfiguredServerServiceCatalogueEntries()].map(x=>x.key));
            const rows = allKeys.filter(key => !serviceKeys.has(key) && !['softwarePlatform','softwareVersion','windowsLicence'].includes(key) && ![...getAvailableSoftwareCatalogueEntries(),...getConfiguredSoftwareCatalogueEntries()].some(x=>x.key===key) && details[key] !== '' && details[key] !== null && details[key] !== undefined)
                .map(key => {
                    const value = details[key];
                    const display = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
                    return field(getDeviceDetailFieldLabel(key, device.type), display);
                });
            return rows.join('');
        }
        // Preserve the existing authenticated modal and focus/discard/permission controls.
        // The source overlay and container are shared by Device Details and Add/Edit.
        function openDeviceReviewModal(markup) {
            openModal(markup);
            document.getElementById('modal-container').classList.add('device-review-overlay');
            document.getElementById('modal-content').classList.add('device-review-container');
        }
        function openDeviceDetailView(deviceId) {
            const d = appState.devices.find(device => String(device.id) === String(deviceId));
            if (!d) return showToast('Device not found.', 'error');
            const rack = appState.racks.find(r => String(r.id) === String(d.rackId));
            const subnet = d.primaryIp ? getSubnetForIp(d.primaryIp) : null;
            const mounted = isRackMountedDevice(d) && !!rack;
            const uStart = Number(d.rackUStart);
            const uEnd = Number(d.rackUEnd || d.rackUStart);
            const uText = mounted && Number.isFinite(uStart) && uStart > 0
                ? `U${uStart}${Number.isFinite(uEnd) && uEnd > uStart ? '–U' + uEnd : ''}` : 'Not assigned';
            const safe = value => escapeHtml(value === undefined || value === null || value === '' ? '—' : String(value));
            const field = (label, value) => renderInterfaceTemplate("devices/field-1",[escapeHtml(label),safe(value)]);
            const section = (title, icon, body, full=false, subtitle='', rawBody=false) => renderInterfaceTemplate("devices/section-3",[full?' full':'',icon,escapeHtml(title),subtitle?renderInterfaceTemplate("devices/section-1",[escapeHtml(subtitle)]):'',rawBody?body:renderInterfaceTemplate("devices/section-2",[body])]);
            const status = d.status || 'Active';
            const detailRows = buildDeviceDetailRows(d, field);
            const activeFields = new Set(getDetailFieldsForDeviceType(d.type));
            const suggestedSoftware=new Set(getDeviceSoftwareSuggestions(d.type,d.typeDetails||{}).map(item=>item.key));
            const softwareEntries=getDeviceSoftwareCatalogueEntries(d,d.typeDetails||{}).filter(item=>isDeviceSoftwareSelected(item.key,d.typeDetails||{},d));
            const installedSoftware=softwareEntries.sort((a,b)=>String(a.label||'').localeCompare(String(b.label||''),undefined,{sensitivity:'base'})).map(x=>renderInterfaceTemplate("device-management/installed-software-2",[safe(x.label)+(!suggestedSoftware.has(x.key)?' <small>Previously recorded — review</small>':''),x.archived?renderInterfaceTemplate("device-management/installed-software-1",[safe(d.id),safe(x.key)]):''])).join('');

            const deviceDetails=d.typeDetails||{};
            const serverServiceEntries=[...getAvailableServerServiceCatalogueEntries(),...getConfiguredServerServiceCatalogueEntries().filter(x=>x.archived)].filter((x,i,all)=>all.findIndex(y=>y.key===x.key)===i).filter(x=>(activeFields.has(x.key)||x.archived) && (deviceDetails[x.key]===true||d[x.key]===true)).sort((a,b)=>String(a.label||'').localeCompare(String(b.label||''),undefined,{sensitivity:'base'}));
            const serverServices=serverServiceEntries.map(x=>renderInterfaceTemplate("device-management/server-services-2",[safe(x.label),x.archived?renderInterfaceTemplate("device-management/server-services-1",[]):''])).join('');
            const isHypervisorHost=d.type==='Server - Physical' && (deviceDetails.serverService_Hypervisor===true || d.serverService_Hypervisor===true);
            const platformDetails=[['Operating System',getEffectiveDevicePlatform(d)],['OS Version',getEffectiveDevicePlatformVersion(d)],...(isHypervisorHost?[]:[['Windows licence',deviceDetails.windowsLicence]])].filter(([label])=>['server','computer'].includes(deviceTypeDetailGroups[String(d.type||'').toLowerCase().trim()]) || label==='Operating System' && activeFields.has('os')).filter(([,value])=>value!==undefined&&value!==null&&value!=='').map(([label,value])=>field(label,value)).join('');
            const historicalSnapshots = Array.isArray(d.previousTypeDetails) ? [...d.previousTypeDetails].reverse() : [];
            const historyRows = historicalSnapshots.map((snapshot,index)=>renderInterfaceTemplate("devices/history-rows-1",[safe(snapshot.type||'Previous type'),index+1,Object.entries(snapshot.details||{}).map(([key,value])=>field(getDeviceDetailFieldLabel(key,snapshot.type),typeof value==='boolean'?(value?'Yes':'No'):value)).join('')])).join('');
            // read-only hosted guest visibility, including preserved legacy references.
            const hostedGuests = d.type === 'Server - Physical'
                ? appState.devices.filter(guest => guest.id !== d.id && guest.virtualHostId === d.id)
                : [];
            const hasRecordedHypervisor = d.type === 'Server - Physical' &&
                (d.typeDetails?.serverService_Hypervisor === true || d.serverService_Hypervisor === true);
            // Keep legacy hosted guests visible even when the hypervisor service was not recorded.
            const showVirtualMachinesTab = d.type === 'Server - Physical' && (hasRecordedHypervisor || hostedGuests.length > 0);
            const hypervisorNotice = showVirtualMachinesTab && !hasRecordedHypervisor
                ? renderInterfaceTemplate("device-details/hypervisor-notice-1",[])
                : '';
            const hostingSection = d.type === 'Server - Physical'
                ? section('Hosted Virtual Machines', 'fa-server', hostedGuests.length
                    ? hostedGuests.map(guest => renderInterfaceTemplate("devices/hosting-section-1",[safe(guest.name || guest.id),guest.type === 'Server - Virtual' ? 'Virtual Machine' : safe(guest.type || 'Virtual Machine'),safe(guest.status || 'Active'),guest.primaryIp ? ' · ' + safe(guest.primaryIp) : '',safe(guest.id),safe(guest.name || guest.id)])).join('') + '<div class="device-review-quiet">Existing host–guest relationships remain unchanged.</div>'
                    : '<p class="device-review-quiet">No hosted virtual machines recorded.</p>', true, 'Guests are linked to this physical server.', true)
                : d.type === 'Server - Virtual'
                    ? section('Physical Host', 'fa-server', renderInterfaceTemplate("devices/hosting-section-2",[safe(d.virtualHostId ? (appState.devices.find(host => host.id === d.virtualHostId)?.name || 'Missing or unavailable host (legacy reference preserved)') : 'Not assigned'),d.virtualHostId && appState.devices.some(host => host.id === d.virtualHostId) ? `<button type="button" data-action="view-hosted-virtual-machine" data-id="${safe(d.virtualHostId)}" class="btn btn-outline">View Host</button>` : '']),true,'A virtual machine is hosted by a physical hypervisor.',true)
                    : '';
            const isVirtualDevice = d.type === 'Server - Virtual';
            const virtualHardware = isVirtualDevice ? section('Allocated virtual hardware', 'fa-microchip',
                field('vCPUs', d.vmVcpu) + field('Allocated RAM (GB)', d.vmRamGb) +
                field('Virtual disk (GB)', d.vmDiskGb) + field('Virtual network adapters', d.vmNicCount), false, 'These are the VM’s own allocated resources, not physical host hardware.') : '';
            const hardware = field('Manufacturer', d.manufacturer) + field('Model', d.model) + field('Serial number', d.serialNumber);
            const rackRows = d.rackShelfAccessoryId ? field('Rack Shelf',getRackShelfLocation(d)) : mounted ? field('Rack', rack.name) + field('Face', String(d.face || 'front').toLowerCase() === 'rear' ? 'Rear' : 'Front') + field('Start U', Number.isFinite(uStart) && uStart > 0 ? uStart : 'Not assigned') + field('U height', (Number(d.rackUHeight) || (uEnd-uStart+1) || 1) + 'U') : '';
            openDeviceReviewModal(renderInterfaceTemplate("devices/open-device-detail-view-7",[safe(d.name),safe(d.type),safe(d.location),safe(status),[['overview','Overview'],...(showVirtualMachinesTab ? [['virtual-machines','Virtual Machines']] : []),...(!isVirtualDevice ? [['hardware','Hardware']] : []),['network','Network'],['software','Software'],['location','Location'],...(historyRows?[['history','History']]:[])].map(([key,label],i)=>`<button type="button" role="tab" id="device-details-tab-${key}" aria-controls="device-details-panel-${key}" aria-selected="${i===0?'true':'false'}" tabindex="${i===0?'0':'-1'}" data-action="select-device-details-tab" data-name="${key}" class="device-details-tab device-review-tab ${i===0?'device-details-tab-active':''}">${label}</button>`).join(''),section('Device Overview', 'fa-circle-info',
                            field('Device name',d.name)+field('Type',d.type)+field('Status',status)+field('Primary IP',d.primaryIp)+field('Location Area',d.location)+field('Operating System',getEffectiveDevicePlatform(d)), false, 'Recorded identity and status'),isVirtualDevice ? virtualHardware :
                            section('At a Glance','fa-microchip',
                              field('Manufacturer',d.manufacturer)+field('Model',d.model)+field('Serial number',d.serialNumber)+
                              field('Mounting',d.mountType||(mounted?'Rack Mounted':'Desktop'))+field('Rack',d.rackShelfAccessoryId?getRackShelfLocation(d):mounted?rack.name:'Not racked'), false, 'Existing inventory and mounting details'),d.type==='Server - Physical'?'':hostingSection,d.notes?safe(d.notes):'No additional notes have been recorded.',showVirtualMachinesTab ? renderInterfaceTemplate("devices/open-device-detail-view-1",[hypervisorNotice,hostingSection]) : '',!isVirtualDevice ? renderInterfaceTemplate("devices/open-device-detail-view-3",[section('Hardware & Lifecycle', 'fa-microchip', hardware + field('Device Type', d.type) + field('Status', status) + field('Mount Type', d.mountType || (mounted ? 'Rack Mounted' : 'Desktop')) + (detailRows ? renderInterfaceTemplate("devices/open-device-detail-view-2",[safe(d.type),detailRows]) : ''), true, 'Physical hardware and device identity')]) : '',section('Network Identity', 'fa-network-wired', field('Primary IP', d.primaryIp) + field('Subnet', subnet ? (subnet.cidr || subnet.name || subnet.network || subnet.id) : 'Not linked') + field('IP reserved', d.ipReserved ? 'Yes' : 'No') + field('Status', status), true, 'Recorded IPAM information'),section('Operating System / Platform', 'fa-desktop',platformDetails || field('Operating System','Not recorded'), false, 'Recorded software platform'),section('Installed Software', 'fa-laptop-code', installedSoftware || '<p class="device-review-quiet">No installed software recorded.</p>', false, 'Installed on this device', true),isHypervisorHost ? section('Hypervisor Service', 'fa-server', field('Hosts virtual machines','Yes') + field('Hypervisor software',deviceDetails.hypervisorProduct || 'Not recorded') + field('Version', deviceDetails.hypervisorVersion || 'Not recorded'), true, 'The virtualisation product is recorded on the physical host.') : '',serverServices?section('Server Services', 'fa-server',serverServices):'',section('Mounting & Location', 'fa-location-dot', isVirtualDevice ? field('Location Area', d.location) + field('Physical Host', d.virtualHostId ? (appState.devices.find(host => host.id === d.virtualHostId)?.name || 'Missing or unavailable host (legacy reference preserved)') : 'Not assigned') : field('Location Area', d.location) + field('Mounting', d.mountType || (mounted ? 'Rack Mounted' : 'Desktop')) + rackRows, true, 'Virtual machines are not physically mounted in racks.'),mounted && !isVirtualDevice ? renderInterfaceTemplate("devices/open-device-detail-view-4",[safe(d.id)]) : '',historyRows?renderInterfaceTemplate("devices/open-device-detail-view-5",[historyRows]):'',safe(d.id),mounted ? renderInterfaceTemplate("devices/open-device-detail-view-6",[safe(d.id)]) : '',safe(d.id),safe(d.id)]));
        }
        function confirmUninstallOfArchivedSoftware(deviceId,key){
            const device=appState.devices.find(d=>String(d.id)===String(deviceId));
            const software=getConfiguredSoftwareCatalogueEntries().find(x=>x.key===key&&x.archived);
            if(!device||!software||(device.typeDetails?.[key]!==true&&device[key]!==true))return showToast('Archived installation not found.','error');
            openModal(renderInterfaceTemplate("device-management/confirm-uninstall-of-archived-software-1",[])+escapeHtml(software.label)+'</strong> as uninstalled on <strong>'+escapeHtml(device.name)+renderInterfaceTemplate("device-management/confirm-uninstall-of-archived-software-2",[])+escapeHtml(String(device.id))+'" data-name="'+escapeHtml(key)+'" class="h-11 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-semibold">Mark as Uninstalled</button></div></div>');
        }
        async function recordUninstallOfArchivedSoftware(deviceId,key){
            const device=appState.devices.find(d=>String(d.id)===String(deviceId));
            const software=getConfiguredSoftwareCatalogueEntries().find(x=>x.key===key&&x.archived);
            if(!device||!software||(device.typeDetails?.[key]!==true&&device[key]!==true))return showToast('Archived installation not found.','error');
            const previousDetails=device.typeDetails;
            const previousLegacy=device[key];
            device.typeDetails={...(device.typeDetails||{}),[key]:false};
            if(Object.prototype.hasOwnProperty.call(device,key))device[key]=false;
            if (!nextDeviceBridge || !await nextDeviceBridge.saveArchivedInstallation(deviceId)) {
                device.typeDetails=previousDetails;
                if(Object.prototype.hasOwnProperty.call(device,key))device[key]=previousLegacy;
                return showToast('Could not update the installation record.','error');
            }
            closeModal(true);
            renderContent();
            openDeviceDetailView(deviceId);
            selectDeviceDetailsTab('software');
            showToast('Software marked as uninstalled in inventory.');
        }
        function selectDeviceDetailsTab(key){
            const root=document.querySelector('.device-details-dialog');
            if(!root)return;
            const target=root.querySelector('#device-details-panel-'+key);
            if(!target)return;
            root.querySelectorAll('.device-details-panel').forEach(panel=>{panel.hidden=panel!==target;});
            root.querySelectorAll('.device-details-tab').forEach(tab=>{
                const active=tab.dataset.name===key;
                tab.setAttribute('aria-selected',String(active));
                tab.tabIndex=active?0:-1;
                tab.classList.toggle('device-details-tab-active',active);
            });
        }
        // Legacy device-type configurations remain visible as read-only history.
        // Do not restore them into active devices: identity and type are immutable.

        function navigateToDeviceRack(deviceId) {
            const d = appState.devices.find(device => String(device.id) === String(deviceId));
            if (!d?.rackId || !appState.racks.some(r => String(r.id) === String(d.rackId))) return showToast('Rack not found.', 'error');
            selectedRackId = appState.racks.find(r => String(r.id) === String(d.rackId)).id;
            activeRackFace = d.face === 'rear' ? 'rear' : 'front';
            activeRackTab = 'view';
            v13RackSection = 'inventory';
            v13RackDetailOpen = true;
            closeModal();
            // Switch through the normal navigation path so the selected rack and face render.
            switchTab('racks');
            // Rack elevations can be taller than the viewport. Find the actual mounted
            // device after rendering and bring it into view, rather than the rack header.
            requestAnimationFrame(() => requestAnimationFrame(() => {
                const target = Array.from(document.querySelectorAll('[data-rack-device]'))
                    .find(el => el.dataset.rackDevice === String(d.id));
                if (!target) {
                    showToast('Rack opened, but the device position could not be found.', 'error');
                    return;
                }
                target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
                target.classList.add('rack-located-device');
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
                target.addEventListener('animationend', () => target.classList.remove('rack-located-device'), { once: true });
            }));
        }

        function duplicateDevice(deviceId) {
            const source = getDeviceById(deviceId);
            if (!source) return showToast('Device not found.', 'error');
            const subnet = source.primaryIp ? getSubnetForIp(source.primaryIp) : null;
            // Virtual devices are hosted by a hypervisor, never mounted in a rack themselves.
            const mounted = !(source.isVirtual === true || source.type === 'Server - Virtual') && isRackMountedDevice(source);
            const height = Math.max(1, Number(source.rackUHeight) || (Number(source.rackUEnd) - Number(source.rackUStart) + 1) || 1);
            const draft = {
                deviceId:null, duplicatedFrom:source.id, name:'', primaryIp:'',
                subnetId:subnet?.id || '', type:source.type || '', isVirtual:source.isVirtual === true || source.type === 'Server - Virtual',
                location:source.location || '', mountType:(source.isVirtual === true || source.type === 'Server - Virtual') ? 'Not Applicable' : (mounted ? 'Rack Mounted' : (source.mountType || 'Desktop')),
                rackId:mounted||source.rackShelfAccessoryId ? source.rackId || '' : '', rackShelfAccessoryId:source.rackShelfAccessoryId||'', face:source.face || 'front',
                rackUHeight:height, rackUStart:1, ipReserved:!!source.ipReserved,
                status:source.status || 'Active', manufacturer:source.manufacturer || '',
                model:source.model || '', serialNumber:'', notes:source.notes || '',
                // #164: Copy VM host/platform and allocations into the editable draft.
                // The new record still requires an eligible host on save; legacy exemptions do not carry over.
                virtualPlatform:source.virtualPlatform || '', virtualHostId:source.virtualHostId || '',
                typeDetails:{...(source.typeDetails||{})}
            };
            if (mounted && source.rackId) {
                const rack = appState.racks.find(r => r.id === source.rackId);
                const limit = Number(rack?.heightU ?? rack?.height ?? rack?.size ?? rack?.totalU ?? 0);
                let found = false;
                for (let u = 1; u <= limit - height + 1; u++) {
                    if (!validateRackPlacement(null, source.rackId, draft.face, u, u + height - 1)) {
                        draft.rackUStart = u;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    // Never prefill an occupied rack position when duplicating.
                    draft.rackId = '';
                    draft.rackUStart = 1;
                    draft.mountType = 'Desktop';
                    draft.location = source.location === 'Racked' ? '' : (source.location || '');
                    draft.editorWarning='No free rack slot was found. Select a mounting location before saving the copy.';
                }
            }
            deviceFormDraft = draft;
            openDeviceModal();
            const input = document.getElementById('dev-name');
            if (input) { input.placeholder = 'New hostname (required)'; input.focus(); }
        }


        // Access-inspired device type detail profiles. Optional fields are stored
        // on each device; switching types hides, but never erases, previously entered values.
        const deviceDetailFieldProfiles = {"network":["networkCard","networkConnection"],"printer":["networkCard","networkConnection","printerColour","printerDesign"],"computer":["windowsLicence","os","networkCard","networkConnection","processor","graphics","memory","memoryUnit","storage","storageUnit","Swan","MicrosoftOffice","Planet","SpindleSoftware","Preactor","RedLionApp","SalesBase","HelpDesk","ProductionITHelpDeskDashboards","PDA","TMS","PhoneBook","EasyLabel"],"server":["windowsLicence","os","networkCard","networkConnection","processor","graphics","memory","memoryUnit","storage","storageUnit","SwanServer","SQLServer","TMSServer","printserver","keriserver","ActiveDirectory","AntivirusSoftware","DNS","DHCP","ExchangeServer","BackupSoftware","PlanetDB","SystemsDatabaseBackEndTables","PDASystem","raid","driveCount"],"nas":["networkCard","networkConnection","memory","memoryUnit","storage","storageUnit","raid","driveCount"],"phone":["handsetCount"],"ups":["powerOutlets","serialPort","usbPort"],"tape":["networkCard","networkConnection","driveCount"],"ap":[]};
        deviceDetailFieldProfiles.switch=['portCount','networkCard','networkConnection'];
        deviceDetailFieldProfiles.router=['portCount','networkConnection'];
        // User-managed server roles: the list is preserved in older compatible backups and can
        // be edited without changing device types or deleting historical device values.
        const legacyServerServiceFieldKeys = ['SwanServer','SQLServer','TMSServer','printserver','keriserver','ActiveDirectory','AntivirusSoftware','DNS','DHCP','ExchangeServer','BackupSoftware','PlanetDB','SystemsDatabaseBackEndTables','PDASystem'];
        // Shared starter catalogue; existing custom keys and per-device selections stay intact.
        const builtInServerServiceSuggestions = [
            {key:'ActiveDirectory',label:'Active Directory'},
            {key:'DNS',label:'DNS Server'},
            {key:'DHCP',label:'DHCP Server'},
            {key:'printserver',label:'Print Server'},
            {key:'BackupSoftware',label:'Backup Server'},
            {key:'serverService_File',label:'File Server'},
            {key:'serverService_Web',label:'Web Server'},
            {key:'serverService_Database',label:'Database Server'},
            {key:'serverService_Hypervisor',label:'Hypervisor'},
            {key:'serverService_RemoteDesktop',label:'Remote Desktop Services'},
            {key:'serverService_Monitoring',label:'Monitoring Server'},
            {key:'serverService_VPN',label:'VPN Server'}
        ];
        function getConfiguredServerServiceCatalogueEntries() {
            return Array.isArray(appState.serverFunctions) ? appState.serverFunctions : [];
        }
        // Suggested services are a view-layer catalogue, not implicit saved options.
        // Clean Start and legacy backups therefore retain their existing semantics.
        function getAvailableServerServiceCatalogueEntries() {
            const saved = getConfiguredServerServiceCatalogueEntries();
            const keys = new Set(saved.map(item => item.key));
            return [...saved.filter(item=>!item.archived), ...builtInServerServiceSuggestions.filter(item => !keys.has(item.key))].sort((a,b)=>String(a.label||'').localeCompare(String(b.label||''),undefined,{sensitivity:'base'}));
        }
        function getAvailableServerServiceFieldKeys() { return getAvailableServerServiceCatalogueEntries().map(x=>x.key); }
        function openServerServiceManager() {
            preserveDeviceFormDuringOptionsDialog();
            const items=getConfiguredServerServiceCatalogueEntries().filter(item=>!deviceOptionsReturnContent||deviceOptionsReturnContent.querySelector('#dev-type')?.value!=='Server - Physical'||item.key!=='serverService_Hypervisor');
            openModal(renderInterfaceTemplate("device-management/open-server-service-manager-3",[items.map(x=>renderInterfaceTemplate("device-management/open-server-service-manager-2",[deviceOptionsReturnContent ? renderInterfaceTemplate("device-management/open-server-service-manager-1",[escapeHtml(x.key),deviceDetailFormValues[x.key]===true?'checked':'',escapeHtml(x.label)]) : escapeHtml(x.label),escapeHtml(x.key),escapeHtml(x.label),escapeHtml(x.key),escapeHtml(x.label)])).join(''),deviceOptionsReturnContent ? '' : '<button type="button" data-action="open-manage-types" class="h-11 px-4 rounded-xl border border-slate-400">Back To Types</button>']));
        }
        function captureServerServiceSelections() {
            if(!deviceOptionsReturnContent)return;
            document.querySelectorAll('[data-server-service-select]').forEach(el=>{
                deviceDetailFormValues[el.dataset.serverServiceSelect]=el.checked;
            });
        }
        async function updateServerServiceCatalogue(action,key='') {
            captureServerServiceSelections();
            const items=getConfiguredServerServiceCatalogueEntries().map(x=>({...x}));
            const old=items.find(x=>x.key===key);
            if(action!=='add'&&!old)return;
            const entered=action==='add'?document.getElementById('server-service-manager-name-input')?.value:action==='rename'?prompt('Rename server function:',old.label):'';
            if(action!=='delete' && entered===null)return;
            const label=String(entered||'').trim();
            if(action!=='delete' && (!label||label.length>SOFTWARE_SERVICE_NAME_MAX_LENGTH)){showToast(`Enter a server function name (up to ${SOFTWARE_SERVICE_NAME_MAX_LENGTH} characters).`,'error');return;}
            if(action!=='delete' && items.some(x=>x.label.toLowerCase()===label.toLowerCase() && x.key!==key)){showToast('That server function already exists.','error');return;}
            if(action==='delete'){confirmServerServiceArchive(key);return;}
            const snapshot=JSON.stringify(appState);
            if(action==='add'){
                const id='customServerFunction_'+Date.now().toString(36);
                items.push({key:id,label});
            }else if(action==='rename')old.label=label;
            else return;
            appState.serverFunctions=items;
            if(!await nextSettingsBridge.save('serverFunctions')){const prior=JSON.parse(snapshot);Object.keys(appState).forEach(k=>delete appState[k]);Object.assign(appState,prior);showToast('Could not save the change.','error');return;}
            openServerServiceManager();
        }
        function confirmServerServiceArchive(key){
            const entry=getAvailableServerServiceCatalogueEntries().find(x=>x.key===key);
            if(!entry)return;
            const users=appState.devices.filter(d=>d.typeDetails?.[key]===true||d[key]===true);
            const count=users.length;
            const names=users.slice(0,5).map(d=>escapeHtml(d.name||d.hostname||d.id||'Unnamed device')).join(', ');
            openModal(renderInterfaceTemplate("device-management/confirm-server-service-archive-1",[])+escapeHtml(entry.label)+'</strong>? It will no longer be available for new assignments. '+count+' device(s) currently have this service recorded, and their historical records will be preserved. '+(count?'Removal is blocked while assigned to: '+names+(count>5?' and '+(count-5)+' more':'')+'.':'')+renderInterfaceTemplate("device-management/confirm-server-service-archive-2",[])+escapeHtml(key)+'" class="h-11 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-semibold">Archive Service</button></div></div>');
        }
        async function archiveServerService(key){
            const entry=getAvailableServerServiceCatalogueEntries().find(x=>x.key===key);
            if(!entry)return;
            const assigned=appState.devices.filter(d=>d.typeDetails?.[key]===true||d[key]===true);
            if(assigned.length){showToast('Service is assigned to '+assigned.slice(0,3).map(d=>d.name||d.hostname||d.id||'unnamed device').join(', ')+(assigned.length>3?' and others':'')+' and cannot be removed.','error');return;}
            const previous=appState.serverFunctions;
            const saved=getConfiguredServerServiceCatalogueEntries();
            appState.serverFunctions=saved.some(x=>x.key===key)?saved.map(x=>x.key===key?{...x,archived:true}:x):[...saved,{...entry,archived:true}];
            if(!await nextSettingsBridge.save('serverFunctions')){appState.serverFunctions=previous;return showToast('Could not archive server service.','error');}
            closeModal(true);renderContent();showToast('Server service archived. Existing records preserved.');
        }
        // Hardware suggestions are advisory: typed values remain authoritative.
        const builtInHardwareSuggestions = {
            'Laptop': {'Dell':['Latitude 5450','Latitude 7450','Precision 3591'],'HP':['EliteBook 840','ProBook 450'],'Lenovo':['ThinkPad T14','ThinkPad X1 Carbon'],'ASUS':['ExpertBook B5'],'Apple':['MacBook Air','MacBook Pro'],'Toshiba':[]},
            'Desktop': {'Dell':['OptiPlex','Precision'],'HP':['EliteDesk','ProDesk'],'Lenovo':['ThinkCentre','ThinkStation'],'ASUS':['ExpertCenter'],'Apple':['Mac mini','iMac']},
            'Tablet': {'Apple':['iPad','iPad Air','iPad Pro'],'Samsung':['Galaxy Tab'],'Microsoft':['Surface Pro'],'Lenovo':['Tab']},
            'Server - Physical': {'Dell':['PowerEdge'],'HPE':['ProLiant DL','ProLiant ML'],'Lenovo':['ThinkSystem'],'Supermicro':['SuperServer']},
            'Switch': {'Cisco':['Catalyst','Nexus'],'Aruba':['CX'],'HPE':['FlexNetwork'],'Ubiquiti':['UniFi Switch']},
            'Firewall': {'Fortinet':['FortiGate'],'Cisco':['Firepower'],'Sophos':['XGS'],'Palo Alto Networks':['PA Series']},
            'NAS': {'Synology':['DiskStation','RackStation'],'QNAP':['TS Series']}
        };
        // User-managed hardware suggestions are stored with the offline inventory.
        // Saved preferences overlay immutable hardware seeds. Original keys remain
        // stable so inventory records and older backups are never rewritten.
        function getHardwareSeedPreferences(){
            const value=appState.hardwareSeedPreferences;
            return isPlainObject(value)?value:{};
        }
        function getVisibleBuiltInHardwareSuggestions(){
            const prefs=getHardwareSeedPreferences(),result={};
            Object.entries(builtInHardwareSuggestions).forEach(([type,makers])=>{
                result[type]={};
                Object.entries(makers).forEach(([maker,models])=>{
                    const makerKey='maker:'+maker.toLowerCase();
                    const makerPref=isPlainObject(prefs[makerKey])?prefs[makerKey]:{};
                    if(makerPref.hidden)return;
                    const label=String(makerPref.label||maker).trim()||maker;
                    result[type][label]=models.flatMap(model=>{
                        const key='model:'+JSON.stringify([type,maker,model]);
                        const pref=isPlainObject(prefs[key])?prefs[key]:{};
                        return pref.hidden?[]:[String(pref.label||model).trim()||model];
                    });
                });
            });
            return result;
        }
        function getConfiguredHardwareCatalogueEntries(){
            return Array.isArray(appState.hardwareCatalogue)?appState.hardwareCatalogue:[];
        }
        let activeHardwareCatalogueDeviceType='';
        function getSelectedHardwareCatalogueDeviceType(){
            return document.getElementById('dev-type')?.value||activeHardwareCatalogueDeviceType;
        }
        function openHardwareCatalogueManager(){
            activeHardwareCatalogueDeviceType=getSelectedHardwareCatalogueDeviceType();
            preserveDeviceFormDuringOptionsDialog();
            const type=getSelectedHardwareCatalogueDeviceType()||'Device';
            const items=getConfiguredHardwareCatalogueEntries().filter(x=>x.type===type);
            openModal(renderInterfaceTemplate("device-management/open-hardware-catalogue-manager-2",[escapeHtml(type),items.length?items.map(x=>renderInterfaceTemplate("device-management/open-hardware-catalogue-manager-1",[escapeHtml(x.manufacturer),x.model?' — '+escapeHtml(x.model):'',escapeHtml(x.id),escapeHtml(x.id)])).join(''):'<p class="text-sm text-slate-600 dark:text-slate-300">No custom entries yet. Built-in suggestions are available automatically.</p>']));
        }
        async function updateHardwareCatalogue(action,id=''){
            const type=getSelectedHardwareCatalogueDeviceType()||'Device';
            const items=getConfiguredHardwareCatalogueEntries().map(x=>({...x}));
            const entry=items.find(x=>x.id===id);
            if(action!=='add'&&!entry)return;
            let maker='',model='';
            if(action==='add'){
                maker=String(document.getElementById('hardware-catalog-maker')?.value||'').trim();
                model=String(document.getElementById('hardware-catalog-model')?.value||'').trim();
            }else if(action==='edit'){
                const enteredMaker=prompt('Manufacturer:',entry.manufacturer);
                if(enteredMaker===null)return;
                const enteredModel=prompt('Model (leave blank for manufacturer only):',entry.model||'');
                if(enteredModel===null)return;
                maker=enteredMaker.trim();model=enteredModel.trim();
            }else if(!confirm('Remove this catalogue suggestion? Existing device records will not change.'))return;
            if(action!=='remove'){
                if(!maker||maker.length>120||model.length>120){showToast('Enter a manufacturer (up to 120 characters) and an optional model (up to 120 characters).','error');return;}
                if(items.some(x=>x.id!==id&&x.type===type&&x.manufacturer.toLowerCase()===maker.toLowerCase()&&String(x.model||'').toLowerCase()===model.toLowerCase())){showToast('That catalogue entry already exists.','error');return;}
            }
            if(action==='add')items.push({id:'hardware_'+Date.now().toString(36),type,manufacturer:maker,model});
            else if(action==='edit'){entry.manufacturer=maker;entry.model=model;}
            else items.splice(items.findIndex(x=>x.id===id),1);
            const previous=appState.hardwareCatalogue;
            appState.hardwareCatalogue=items;
            if(!await nextSettingsBridge.save('hardwareCatalogue')){if(previous===undefined)delete appState.hardwareCatalogue;else appState.hardwareCatalogue=previous;showToast('Could not save the catalogue.','error');return;}
            openHardwareCatalogueManager();
        }
        function isVirtualDeviceForm(){
            const deployment=document.getElementById('dev-deployment');
            return deployment ? deployment.value==='virtual' : document.getElementById('dev-type')?.value==='Server - Virtual';
        }
        function updateVirtualHardwareFieldVisibility(){
            const type=document.getElementById('dev-type')?.value || '';
            const virtual=isVirtualDeviceForm();
            // VM placement belongs to the host. Retain historical values in storage.
            const mounting=document.getElementById('device-form-mounting-options');
            if(mounting){
                mounting.hidden=virtual;
                mounting.classList.toggle('hidden',virtual);
                mounting.style.display=virtual?'none':'';
            }
            const mountSelect=document.getElementById('dev-mount-type');
            if(mountSelect) mountSelect.required=!virtual;
            // The location is derived from the selected host when saving a VM.
            // A hidden required select otherwise prevents the submit handler running.
            const locationSelect=document.getElementById('dev-location');
            if(locationSelect) locationSelect.required=!virtual;
            document.querySelectorAll('#device-editor-form [data-device-editor-location]').forEach(el=>el.hidden=virtual);
            const locationPanel=document.querySelector('#device-editor-form #dev-create-location-panel');
            if(locationPanel)locationPanel.hidden=virtual||locationSelect?.value!=='__caffoot_create_location__';
            document.getElementById('device-form-physical-purpose')?.classList.toggle('hidden',virtual);
            // Keep Add Device tabs in sync with deployment selection.
            const locationArea=document.getElementById('device-form-location-area');
            if(locationArea){
                locationArea.hidden=virtual;
                locationArea.classList.toggle('hidden',virtual);
                locationArea.style.display=virtual?'none':'';
            }
            const hardwareTab=document.getElementById('device-form-tab-hardware');
            if(hardwareTab){
                hardwareTab.hidden=virtual;
                hardwareTab.classList.toggle('hidden',virtual);
                if(virtual && document.querySelector('[data-device-form="true"]')?.dataset.activeDeviceTab==='hardware')
                    document.getElementById('device-form-tab-general')?.click();
            }
            const typeSelect=document.getElementById('dev-type');
            if(typeSelect) typeSelect.required=!virtual;
            const purposeSelect=document.getElementById('dev-vm-purpose');
            if(purposeSelect) purposeSelect.required=virtual;
            const rackHeight=document.getElementById('dev-rack-height');
            if(virtual && rackHeight) rackHeight.required=false;
            ['physical-manufacturer','physical-model'].forEach(id=>document.getElementById(id)?.classList.toggle('hidden',virtual));
            document.getElementById('virtual-fields')?.classList.toggle('hidden',!virtual);
            document.getElementById('host-platform-fields')?.classList.toggle('hidden',type!=='Server - Physical');
            syncHostingFieldVisibility();
        }
        function refreshHardwareSuggestions(preserve=true) {
            const type=document.getElementById('dev-type')?.value||'';
            updateVirtualHardwareFieldVisibility();
            const maker=document.getElementById('dev-manufacturer');
            const model=document.getElementById('dev-model');
            const makerSelect=document.getElementById('dev-manufacturer-select');
            const modelSelect=document.getElementById('dev-model-select');
            const makerCustom=document.getElementById('dev-manufacturer-custom');
            const modelCustom=document.getElementById('dev-model-custom');
            if(!maker||!model||!makerSelect||!modelSelect)return;
            const seeds=getVisibleBuiltInHardwareSuggestions()[type]||{};
            const related=appState.devices.filter(d=>d.type===type);
            const catalog=getConfiguredHardwareCatalogueEntries().filter(x=>x.type===type);
            const makers=new Set([...Object.keys(seeds),...related.map(d=>String(d.manufacturer||'').trim()).filter(Boolean),...catalog.map(x=>x.manufacturer)]);
            ['Dell','HP','HPE','Lenovo','ASUS','Apple','Cisco','Samsung','Microsoft','Toshiba'].forEach(m=>{const pref=getHardwareSeedPreferences()['maker:'+m.toLowerCase()]||{};if(!pref.hidden)makers.add(String(pref.label||m).trim()||m);});
            const currentMaker=maker.value.trim();
            const makerValues=[...makers].sort((a,b)=>a.localeCompare(b));
            makerSelect.replaceChildren(new Option('Select Manufacturer...',''),...makerValues.map(v=>new Option(v,v)),new Option('Other / Custom Manufacturer','__custom__'));
            const matchingMaker=makerValues.find(v=>v.toLowerCase()===currentMaker.toLowerCase());
            makerSelect.value=currentMaker?(matchingMaker||'__custom__'):(makerSelect.value==='__custom__'?'__custom__':'');
            makerCustom.classList.toggle('hidden',makerSelect.value!=='__custom__');
            makerCustom.value=makerSelect.value==='__custom__'?currentMaker:'';
            const models=new Set(catalog.filter(x=>x.manufacturer.toLowerCase()===currentMaker.toLowerCase()).map(x=>x.model).filter(Boolean));
            Object.entries(seeds).forEach(([name,values])=>{if(name.toLowerCase()===currentMaker.toLowerCase())values.forEach(v=>models.add(v));});
            related.forEach(d=>{if(String(d.manufacturer||'').trim().toLowerCase()===currentMaker.toLowerCase() && String(d.model||'').trim())models.add(String(d.model).trim());});
            const currentModel=model.value.trim();
            const modelValues=[...models].sort((a,b)=>a.localeCompare(b));
            modelSelect.replaceChildren(new Option('Select Model...',''),...modelValues.map(v=>new Option(v,v)),new Option('Other / Custom Model','__custom__'));
            const matchingModel=modelValues.find(v=>v.toLowerCase()===currentModel.toLowerCase());
            modelSelect.value=currentModel?(matchingModel||'__custom__'):(modelSelect.value==='__custom__'?'__custom__':'');
            modelCustom.classList.toggle('hidden',modelSelect.value!=='__custom__');
            modelCustom.value=modelSelect.value==='__custom__'?currentModel:'';
            refreshDeviceEditorDropdowns();
        }
        function handleHardwareSelectionChange(kind) {
            const select=document.getElementById('dev-'+kind+'-select');
            const field=document.getElementById('dev-'+kind);
            const custom=document.getElementById('dev-'+kind+'-custom');
            if(!select||!field||!custom)return;
            const isCustom=select.value==='__custom__';
            custom.classList.toggle('hidden',!isCustom);
            if(!isCustom)field.value=select.value;
            else {custom.value='';field.value='';custom.focus();}
            if(kind==='manufacturer'){
                document.getElementById('dev-model').value='';
                refreshHardwareSuggestions();
                if(isCustom){custom.classList.remove('hidden');custom.focus();}
            }
        }
        // Desktop, laptop and tablet software is managed independently of server functions.
        const legacySoftwareFieldKeys = ['Swan','MicrosoftOffice','Planet','SpindleSoftware','Preactor','RedLionApp','SalesBase','HelpDesk','ProductionITHelpDeskDashboards','PDA','TMS','PhoneBook','EasyLabel'];
        function getConfiguredSoftwareCatalogueEntries() {
            return Array.isArray(appState.installedSoftware) ? appState.installedSoftware : [];
        }
        function getConfiguredSoftwareCatalogueFieldKeys(){return getConfiguredSoftwareCatalogueEntries().map(x=>x.key);}
        function openConfiguredSoftwareCatalogueManager(){
            preserveDeviceFormDuringOptionsDialog();
            const items=getConfiguredSoftwareCatalogueEntries().filter(item=>!deviceOptionsReturnContent||!isDeviceEditorHypervisorProduct(item));
            openModal(renderInterfaceTemplate("device-management/open-configured-software-catalogue-manager-3",[items.map(x=>renderInterfaceTemplate("device-management/open-configured-software-catalogue-manager-2",[deviceOptionsReturnContent ? renderInterfaceTemplate("device-management/open-configured-software-catalogue-manager-1",[escapeHtml(x.key),deviceDetailFormValues[x.key]===true?'checked':'',escapeHtml(x.label)]) : escapeHtml(x.label),escapeHtml(x.key),escapeHtml(x.label),escapeHtml(x.key),escapeHtml(x.label)])).join(''),deviceOptionsReturnContent ? '' : '<button type="button" data-action="open-manage-types" class="h-11 px-4 rounded-xl border border-slate-400">Back To Types</button>']));
        }
        function captureInstalledSoftwareSelections(){
            if(!deviceOptionsReturnContent)return;
            document.querySelectorAll('[data-installed-software-select]').forEach(el=>{
                deviceDetailFormValues[el.dataset.installedSoftwareSelect]=el.checked;
            });
        }
        async function updateConfiguredSoftwareCatalogue(action,key=''){
            captureInstalledSoftwareSelections();
            const items=getConfiguredSoftwareCatalogueEntries().map(x=>({...x}));
            const old=items.find(x=>x.key===key);
            if(action!=='add'&&!old)return;
            const entered=action==='add'?document.getElementById('software-name')?.value:action==='rename'?prompt('Rename software:',old.label):'';
            if(action!=='delete'&&entered===null)return;
            const label=String(entered||'').trim();
            if(deviceOptionsReturnContent&&action!=='delete'&&isDeviceEditorHypervisorProduct(label)){showToast('Configure hypervisor products using the hosting controls on General.','error');return;}
            if(action!=='delete'&&(!label||label.length>SOFTWARE_SERVICE_NAME_MAX_LENGTH)){showToast(`Enter a software name (up to ${SOFTWARE_SERVICE_NAME_MAX_LENGTH} characters).`,'error');return;}
            if(action!=='delete'&&items.some(x=>x.label.toLowerCase()===label.toLowerCase()&&x.key!==key)){showToast('That software already exists.','error');return;}
            if(action==='delete'&&!confirm(`Remove "${old.label}" from software options? Existing device details will be retained.`))return;
            const snapshot=JSON.stringify(appState);
            if(action==='add')items.push({key:'customSoftware_'+Date.now().toString(36),label});
            else if(action==='rename')old.label=label;
            else items.splice(items.findIndex(x=>x.key===key),1);
            appState.installedSoftware=items;
            if(!await nextSettingsBridge.save('installedSoftware')){const prior=JSON.parse(snapshot);Object.keys(appState).forEach(k=>delete appState[k]);Object.assign(appState,prior);showToast('Could not save the change.','error');return;}
            openConfiguredSoftwareCatalogueManager();
        }
        const deviceDetailFieldLabels = {"portCount":"Number of ports","networkCard":"Network card","networkConnection":"Network connection method","printerColour":"Printer colour type","printerDesign":"Printer design type","windowsLicence":"Windows licence","os":"Operating system","processor":"Processor","graphics":"Graphics card","memory":"Memory size","memoryUnit":"Memory unit","storage":"Storage size","storageUnit":"Storage unit","raid":"RAID type","driveCount":"Number of hard drives","handsetCount":"Number of handsets","powerOutlets":"UPS power outlets","serialPort":"UPS serial port","usbPort":"UPS USB port","Swan":"Swan","MicrosoftOffice":"Microsoft Office","Planet":"Planet","SpindleSoftware":"Spindle Software","Preactor":"Preactor","RedLionApp":"Red Lion App","SalesBase":"Sales Base","HelpDesk":"Help Desk","ProductionITHelpDeskDashboards":"Production I T Help Desk Dashboards","PDA":"P D A","TMS":"T M S","PhoneBook":"Phone Book","EasyLabel":"Easy Label","SwanServer":"Swan Server","SQLServer":"S Q L Server","TMSServer":"T M S Server","printserver":"printserver","keriserver":"keriserver","ActiveDirectory":"Active Directory","AntivirusSoftware":"Antivirus Software","DNS":"D N S","DHCP":"D H C P","ExchangeServer":"Exchange Server","BackupSoftware":"Backup Software","PlanetDB":"Planet D B","SystemsDatabaseBackEndTables":"Systems Database Back End Tables","PDASystem":"P D A System"};
        const deviceTypeDetailGroups = {
            'switch':'switch','router':'router','firewall':'network','print servers':'network',
            'printer':'printer','scanner':'printer',
            'desktop':'computer','laptop':'computer','tablet':'computer',
            'server':'server','server - virtual':'server','server - physical':'server','physical server':'server','virtual server':'server',
            'nas':'nas','phone system':'phone','ups':'ups','tape drive':'tape','access point':'ap','ap':'ap','print server':'network','wireless access point':'ap','wireless lan controller':'network'
        };

        const deviceDetailFieldChoices = {
            portCount:['4','8','12','16','24','48'],networkConnection:['Ethernet','Wi-Fi','Fibre','Other'],printerColour:['Colour','Monochrome'],
            printerDesign:['Laser','Inkjet','Thermal','Dot matrix','Other'],
            memoryUnit:['MB','GB','TB'],storageUnit:['GB','TB','PB'],
            raid:['None','RAID 0','RAID 1','RAID 5','RAID 6','RAID 10','Other']
        };
        const booleanDeviceDetailFields = new Set(['Swan','MicrosoftOffice','Planet','SpindleSoftware','Preactor','RedLionApp','SalesBase','HelpDesk','ProductionITHelpDeskDashboards','PDA','TMS','PhoneBook','EasyLabel','SwanServer','SQLServer','TMSServer','printserver','keriserver','ActiveDirectory','AntivirusSoftware','DNS','DHCP','ExchangeServer','BackupSoftware','PlanetDB','SystemsDatabaseBackEndTables','PDASystem','serialPort','usbPort']);
        const numericDeviceDetailFields = new Set(['memory','storage','driveCount','handsetCount','powerOutlets']);
        function createBuiltInSoftwareCatalogueKey(name){return 'catalogSoftware_'+String(name).toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');}
        function getAvailableSoftwareCatalogueEntries(){
            const configured=getConfiguredSoftwareCatalogueEntries();
            const active=configured.filter(x=>!x.archived);
            const known=new Set(configured.map(x=>String(x.label||'').trim().toLowerCase()));
            const overriddenKeys=new Set(configured.map(x=>x.key));
            return [...active,...builtInSoftwareSuggestions.filter(x=>!overriddenKeys.has(createBuiltInSoftwareCatalogueKey(x.name))&&!known.has(x.name.toLowerCase())).map(x=>({key:createBuiltInSoftwareCatalogueKey(x.name),label:x.name,deviceTypes:x.types,builtin:true}))].sort((a,b)=>String(a.label||'').localeCompare(String(b.label||''),undefined,{sensitivity:'base'}));
        }
        function isSoftwareHiddenForDeviceType(name,type){return (appState.softwareTypeExclusions||{})[name]?.includes(type)===true;}
        async function toggleSoftwareForDeviceType(name,type){
            const entry=builtInSoftwareSuggestions.find(x=>x.name===name);
            if(!entry||!entry.types.includes(type))return;
            const previous=appState.softwareTypeExclusions;
            const next={...(previous||{})},set=new Set(next[name]||[]);
            if(set.has(type))set.delete(type);else set.add(type);
            if(set.size)next[name]=[...set];else delete next[name];
            appState.softwareTypeExclusions=next;
            if(!await nextSettingsBridge.save('softwareTypeExclusions')){appState.softwareTypeExclusions=previous;showToast('Unable to save software preference.','error');return;}
            renderContent();
            document.querySelectorAll('#modal-container [data-action="software-toggle"]').forEach(button=>{
                if(button.dataset.name===name&&button.dataset.type===type)
                    button.textContent=type+(isSoftwareHiddenForDeviceType(name,type)?' · Hidden':' · Available');
            });
        }
        function renderSoftwareDeviceTypeControls(name){
            const entry=builtInSoftwareSuggestions.find(x=>x.name===name);
            return entry?entry.types.map(t=>'<button type="button" data-action="software-toggle" data-name="'+escapeHtml(name)+'" data-type="'+escapeHtml(t)+'" class="btn btn-outline mini-btn">'+escapeHtml(t)+(isSoftwareHiddenForDeviceType(name,t)?' · Hidden':' · Available')+'</button>').join(' '):'';
        }
        // Offline catalogue suggestions are not compatibility guarantees or validators.
        // Use the guest's own platform. A dedicated physical host uses its hosting product.
        function getDeviceSoftwareContext(type,values={}) {
            const hosting=type==='Server - Physical'&&values.serverService_Hypervisor===true;
            const platform=String(hosting ? values.hypervisorProduct||document.getElementById('host-platform')?.value||'' : values.softwarePlatform||'').trim();
            const group=getPlatformGroupForDeviceType(type);
            if(group==='computer'){
                if(platform==='Windows')return 'windows-desktop';
                if(platform==='macOS')return 'mac-desktop';
                if(['Ubuntu','Debian','Fedora','Linux Mint','openSUSE Leap','openSUSE Tumbleweed'].includes(platform))return 'linux-desktop';
            }
            if(group==='server'){
                if(platform==='Windows Server'||hosting&&platform==='Microsoft Hyper-V')return 'windows-server';
                if(['Ubuntu Server','Debian','Red Hat Enterprise Linux','Rocky Linux','AlmaLinux OS','CentOS Linux','CentOS Stream','SUSE Linux Enterprise Server','openSUSE Leap','openSUSE Tumbleweed'].includes(platform))return 'linux-server';
            }
            if(['pfSense CE','pfSense Plus'].includes(platform))return 'pfsense';
            if(['OPNsense Community','OPNsense Business'].includes(platform))return 'opnsense';
            if(platform==='OpenWrt')return 'openwrt';
            if(platform==='UniFi OS'&&['Router','Firewall','Wireless LAN Controller'].includes(type))return 'unifi-console';
            if(platform==='Synology DSM')return 'synology';
            if(['QNAP QTS','QNAP QuTS hero'].includes(platform))return 'qnap';
            if(['TrueNAS SCALE','Unraid'].includes(platform))return 'nas-apps';
            if(String(type).toLowerCase()==='printer')return 'printer';
            return '';
        }
        function getDeviceSoftwareSuggestions(type,values={}) {
            const context=getDeviceSoftwareContext(type,values),typeKeys=new Set(getSoftwareFieldsForDeviceType(type));
            return getAvailableSoftwareCatalogueEntries().filter(item=>{
                if(!typeKeys.has(item.key)||isDeviceEditorHypervisorProduct(item))return false;
                const seed=builtInSoftwareSuggestions.find(entry=>createBuiltInSoftwareCatalogueKey(entry.name)===item.key);
                // User-defined catalogue items retain their declared device-type scope.
                if(!seed){
                    const name=String(item.label||'').trim().toLowerCase();
                    const platformNames=[...Object.values(platformOptionsByDeviceGroup).flat(),...Object.keys(platformVersionOptionsByName),'pfSense','OPNsense','CentOS'];
                    if(platformNames.some(platform=>platform.toLowerCase()===name))return false;
                    const recognised=builtInSoftwareSuggestions.find(entry=>entry.name.toLowerCase()===name);
                    return !recognised||recognised.platformContexts.includes(context);
                }
                return !isSoftwareHiddenForDeviceType(seed.name,type)&&seed.platformContexts.includes(context);
            });
        }
        function isDeviceSoftwareSelected(key,values={},device=null) {
            return Object.hasOwn(values,key) ? values[key]===true : device?.[key]===true;
        }
        function getDeviceSoftwareCatalogueEntries(device=null,values={}) {
            const entries=getConfiguredSoftwareCatalogueEntries().map(item=>({...item}));
            for(const seed of builtInSoftwareSuggestions){const key=createBuiltInSoftwareCatalogueKey(seed.name);if(!entries.some(item=>item.key===key))entries.push({key,label:seed.name,deviceTypes:seed.types,builtin:true});}
            for(const key of legacySoftwareFieldKeys)if(!entries.some(item=>item.key===key))entries.push({key,label:deviceDetailFieldLabels[key]||key});
            for(const key of new Set([...Object.keys(device||{}),...Object.keys(values)])){
                if(/^(catalogSoftware_|customSoftware_)/.test(key)&&!entries.some(item=>item.key===key))entries.push({key,label:key.replace(/^(catalogSoftware_|customSoftware_)/,'').replace(/_/g,' ')});
            }
            return entries;
        }
        function refreshDeviceSoftwareSuggestions() {
            const fields=document.getElementById('device-form-installed-software-fields');
            if(!fields)return;
            fields.querySelectorAll('[data-device-detail-field]').forEach(control=>{deviceDetailFormValues[control.dataset.deviceDetailField]=control.checked;});
            const hosting=document.getElementById('device-hosting-enabled');
            if(document.getElementById('dev-type')?.value==='Server - Physical'&&hosting){
                deviceDetailFormValues.serverService_Hypervisor=hosting.checked;
                deviceDetailFormValues.hypervisorProduct=document.getElementById('host-platform')?.value||deviceDetailFormValues.hypervisorProduct||'';
            }
            fields.innerHTML=renderInlineDevicePicker('software',document.getElementById('dev-type')?.value||'',deviceDetailFormValues);
        }
        function preserveLegacyDeviceSoftwareFlags(target,values) {
            // Retain the original storage location, including explicit removals.
            // Unknown metadata and simultaneous pre-existing typeDetails keys are untouched.
            for(const entry of getDeviceSoftwareCatalogueEntries(deviceEditorSoftwareSource,values)){
                if(!Object.hasOwn(deviceEditorSoftwareSource||{},entry.key)||Object.hasOwn(deviceEditorSoftwareSource?.typeDetails||{},entry.key))continue;
                target[entry.key]=isDeviceSoftwareSelected(entry.key,values,deviceEditorSoftwareSource);
                delete values[entry.key];
            }
        }
        function getSoftwareFieldsForDeviceType(type){
            return getAvailableSoftwareCatalogueEntries().filter(x=>(!Array.isArray(x.deviceTypes)||!x.deviceTypes.length||x.deviceTypes.some(t=>t.toLowerCase()===String(type||'').toLowerCase()))&&(!x.builtin||!isSoftwareHiddenForDeviceType(x.label,type))).map(x=>x.key);
        }
        function getDetailFieldsForDeviceType(type) {
            const group=deviceTypeDetailGroups[String(type||'').toLowerCase().trim()];
            if(group==='computer')return [...deviceDetailFieldProfiles.computer.filter(k=>!legacySoftwareFieldKeys.includes(k)),...getSoftwareFieldsForDeviceType(type)];
            if(group==='server')return [...deviceDetailFieldProfiles.server.filter(k=>!legacyServerServiceFieldKeys.includes(k)),...getAvailableServerServiceFieldKeys(),...getSoftwareFieldsForDeviceType(type)];
            return [...(deviceDetailFieldProfiles[group] || []),...getSoftwareFieldsForDeviceType(type)];
        }
        // Keep persisted typeDetails keys unchanged while separating physical and software controls.
        function isSoftwareDetailField(key) {
            return key === 'windowsLicence' ||
                getAvailableSoftwareCatalogueEntries().some(x=>x.key===key) ||
                getAvailableServerServiceFieldKeys().includes(key) ||
                legacySoftwareFieldKeys.includes(key) ||
                legacyServerServiceFieldKeys.includes(key);
        }
        const DEVICE_EDITOR_HYPERVISOR_PRODUCTS = ['VMware ESXi','Proxmox VE','Microsoft Hyper-V','KVM','XCP-ng'];
        function isDeviceEditorHypervisorProduct(value) {
            const name = String(value?.label ?? value?.name ?? value ?? '').trim().toLowerCase();
            const products = [...DEVICE_EDITOR_HYPERVISOR_PRODUCTS, ...appState.devices
                .filter(device => device.type === 'Server - Physical')
                .map(device => device.typeDetails?.hypervisorProduct).filter(Boolean)];
            // Catalogue overrides may rename a product while retaining its original key.
            return products.some(product => String(product).trim().toLowerCase() === name ||
                (value?.key && createBuiltInSoftwareCatalogueKey(product) === value.key));
        }
        function renderDeviceEditorRetainedSoftware(type, values) {
            const suggestions=new Set(getDeviceSoftwareSuggestions(type,values).map(item=>item.key));
            const retained=getDeviceSoftwareCatalogueEntries(deviceEditorSoftwareSource,values).filter(item=>isDeviceSoftwareSelected(item.key,values,deviceEditorSoftwareSource)&&!suggestions.has(item.key));
            return retained.length ? '<div class="device-review-quiet" data-retained-software '+(retained.some(isDeviceEditorHypervisorProduct)?'data-retained-hypervisor-software':'')+'><p><strong>Previously recorded — review</strong></p><p>These selections are outside the current suggestions. They stay recorded until you untick them.</p><div class="device-review-checklist">'+retained.map(item=>renderInterfaceTemplate("devices/choices-1",[escapeHtml(item.key),'checked',escapeHtml(item.label)])).join('')+'</div></div>' : '';

        }
        function refreshDeviceEditorHostVersionChoices() {
            const select = document.getElementById('host-version-select');
            const version = document.getElementById('host-version');
            if (!select || !version) return;
            const choices = getPlatformVersionOptions(document.getElementById('host-platform')?.value || '');
            select.replaceChildren(new Option('Select a version...',''), ...choices.map(value => new Option(value,value)), new Option('Custom / Other...','__custom__'));
            const custom = !!version.value && !choices.includes(version.value);
            select.value = custom ? '__custom__' : version.value;
            version.hidden = !custom;
            refreshDeviceEditorDropdowns();
        }

        function showDeviceEditorFeedback(message, fieldId = '') {
            const form = document.querySelector('#modal-container:not(.hidden) #device-editor-form');
            if (!form) return false;
            const dialog = form.closest('.device-editor-dialog');
            let feedback = dialog?.querySelector('[data-device-editor-feedback]');
            if (!feedback) return false;
            const nested = document.querySelector('#hypervisor-selection-dialog,#platform-dialog,#discard-dialog');
            if (nested) {
                feedback = nested.querySelector('[data-device-editor-feedback]');
                if (!feedback) {
                    feedback = document.createElement('p');feedback.className = 'form-error device-editor-feedback';
                    feedback.dataset.deviceEditorFeedback = '';feedback.setAttribute('role','alert');
                    nested.firstElementChild.appendChild(feedback);
                }
            }
            feedback.textContent = String(message);feedback.hidden = false;feedback.classList.add('is-visible');
            const rules = [
                [/rack shelf|shelf-mounted|selected shelf/i,'dev-rack-shelf'],
                [/hypervisor product|hosting.*product|host product/i,'host-platform-select'],
                [/physical.*host|host.*eligible|eligible.*host/i,'dev-virtual-host'],
                [/vCPU/i,'dev-vmVcpu'],[/allocated ram/i,'dev-vmRamGb'],[/virtual disk/i,'dev-vmDiskGb'],[/network adapters/i,'dev-vmNicCount'],
                [/device name|hostname|this name|unique.*name/i,'dev-name'],[/device type|identity/i,'dev-type'],
                [/mounting|free rack slot/i,'dev-mount-type'],[/location/i,'dev-location'],[/subnet/i,'dev-subnet'],
                [/select.*rack|rack.*(?:missing|no longer|not found|not available)|references a missing rack/i,'dev-rack-id'],
                [/primary ip|ip address|device\/ipam/i,'dev-ip'],[/rack.*height|U height/i,'dev-rack-height'],[/rack|starting U|start U/i,'dev-rack-u']
            ];
            const field = form.querySelector('#' + (fieldId || rules.find(([pattern]) => pattern.test(message))?.[1] || 'device-editor-no-field'));
            if (field && !nested) {
                const panel = field.closest('[role="tabpanel"]');
                if (panel) dialog.querySelector('[aria-controls="' + panel.id + '"]')?.click();
                field.setAttribute('aria-invalid','true');
                requestAnimationFrame(() => {
                    const target = field.classList.contains('caffoot-search-native') ? field.nextElementSibling?.querySelector('.caffoot-search-trigger') : field;
                    if (target?.getClientRects().length) {target.scrollIntoView({block:'nearest',inline:'nearest'});target.focus({preventScroll:true});}
                    else {feedback.tabIndex=-1;feedback.focus({preventScroll:true});}
                });
            } else if (!nested) {feedback.tabIndex = -1;feedback.focus({preventScroll:true});}
            return true;
        }
        function bindDeviceEditorValidation(form) {
            form.addEventListener('invalid', event => {
                event.preventDefault();event.target.setAttribute('aria-invalid','true');
                if (form.dataset.pendingInvalid) return;
                form.dataset.pendingInvalid = 'true';
                queueMicrotask(() => {
                    delete form.dataset.pendingInvalid;
                    const first = [...form.elements].find(field => field.willValidate && !field.validity.valid);
                    if (first) {
                        const label = first.labels?.[0]?.textContent.replace('*','').trim() || first.getAttribute('aria-label') || 'This field';
                        showDeviceEditorFeedback(label + ': ' + first.validationMessage,first.id);
                    }
                });
            },true);
            form.addEventListener('submit', event => {
                const ordinary = document.getElementById('platform-name')?.value || '';
                if (!isHypervisorHostingEnabledInDeviceForm() && isDeviceEditorHypervisorProduct(ordinary) && ordinary !== form.dataset.originalPlatform) {
                    event.preventDefault();event.stopImmediatePropagation();
                    showDeviceEditorFeedback('Configure hypervisor products using the hosting controls on General.','device-hosting-enabled');
                }
            },true);
            form.addEventListener('input', event => {
                if (!event.target.matches('input,select,textarea')) return;
                const feedback = form.closest('.device-editor-dialog').querySelector('[data-device-editor-feedback]');
                feedback.hidden = true;feedback.classList.remove('is-visible');
            });
        }

        function renderInlineDevicePicker(kind,type,values={}) {
            const software=kind==='software', label=software?'Software':'Server Service';
            const entries=(software?getDeviceSoftwareSuggestions(type,values):
              getAvailableServerServiceCatalogueEntries().filter(item=>type!=='Server - Physical'||item.key!=='serverService_Hypervisor'));
            const selected=entries.filter(item=>isDeviceSoftwareSelected(item.key,values,deviceEditorSoftwareSource)).length;
            const deviceTypes=getUniqueDeviceTypes();
            const choices=entries.map(item=>renderInterfaceTemplate("devices/choices-1",[escapeHtml(item.key),isDeviceSoftwareSelected(item.key,values,deviceEditorSoftwareSource)?'checked':'',escapeHtml(item.label)])).join('');
            return (software ? '<p class="device-review-quiet">Suggestions depend on this device and its OS. Check package availability for the recorded edition, release and model. Custom software remains available.</p>'+renderDeviceEditorRetainedSoftware(type,values) : '') + renderInterfaceTemplate("devices/render-inline-device-picker-3",[kind,kind,software?'software':'server services',kind,kind,software?'software':'server services',kind,label,kind,selected,entries.length,software?'Installed Software':'Server Services',kind,choices,kind,label,kind,label,kind,kind,label.toLowerCase(),software?renderInterfaceTemplate("devices/render-inline-device-picker-2",[deviceTypes.map(t=>renderInterfaceTemplate("devices/render-inline-device-picker-1",[escapeHtml(t),t===type?'checked':'',escapeHtml(t)])).join('')]):'',kind,kind]);
        }
                function updateInlinePickerCount(picker) {
            if(!picker)return;
            const inputs=[...picker.querySelectorAll('.device-review-checklist input[type="checkbox"]')];
            const count=picker.querySelector('.device-review-inline-count');
            if(count)count.textContent=inputs.filter(x=>x.checked).length+' selected · '+inputs.length+' available';
        }
                function openInlineDeviceQuickAdd(kind) {
            if(!['software','services','manufacturer','model'].includes(kind))return;
            const panel=document.querySelector('#modal-content form[data-device-form="true"] [data-review-create="'+kind+'"]');
            if(!panel)return;
            panel.hidden=false;
            panel.querySelector('[data-review-create-error]')?.setAttribute('hidden','');
            if(kind==='manufacturer'){
                const group=panel.querySelector('[data-review-associated-types="manufacturer"]');
                const type=document.getElementById('dev-type')?.value||'';
                if(group)group.innerHTML=getUniqueDeviceTypes().filter(t=>t&&t!=='Server - Virtual').map(t=>'<label><input type="checkbox" value="'+escapeHtml(t)+'" '+(t===type?'checked':'')+'><span>'+escapeHtml(t==='Server - Physical'?'Server (Physical)':t)+'</span></label>').join('');
            }
            panel.querySelector('[data-review-new-name]')?.focus();
        }
                function cancelInlineDeviceQuickAdd(kind) {
            if(!['software','services','manufacturer','model'].includes(kind))return;
            const panel=document.querySelector('#modal-content form[data-device-form="true"] [data-review-create="'+kind+'"]');
            if(!panel)return;
            panel.hidden=true;
            const input=panel.querySelector('[data-review-new-name]');
            if(input)input.value='';
            document.querySelector('#modal-content form[data-device-form="true"] [data-action="device-inline-quick-open"][data-kind="'+kind+'"]')?.focus();
        }
                async function saveInlineDeviceQuickAdd(kind) {
            if(kind==='manufacturer'||kind==='model')return saveInlineHardwareQuickAdd(kind);
            if(!['software','services'].includes(kind))return;
            const panel=document.querySelector('#modal-content form[data-device-form="true"] [data-review-create="'+kind+'"]');
            if(!panel||panel.hidden)return;
            const input=panel.querySelector('[data-review-new-name]'),error=panel.querySelector('[data-review-create-error]');
            const fail=message=>{if(error){error.textContent=message;error.hidden=false;}input?.focus();};
            const label=String(input?.value||'').trim();
            if(!label||label.length>SOFTWARE_SERVICE_NAME_MAX_LENGTH)return fail(`Enter a name of ${SOFTWARE_SERVICE_NAME_MAX_LENGTH} characters or fewer.`);
            const software=kind==='software';
            if(software && isDeviceEditorHypervisorProduct(label))return showDeviceEditorFeedback('Configure hypervisor products using the hosting controls on General.','device-hosting-enabled');
            const currentType=document.getElementById('dev-type')?.value||'';
            const knownTypes=new Set(getUniqueDeviceTypes());
            const types=software?[...panel.querySelectorAll('[data-review-associated-types="software"] input:checked')].map(x=>x.value).filter(t=>knownTypes.has(t)):[];
            if(software&&!types.length)return fail('Select at least one device type.');
            const duplicates=software?[
              ...getConfiguredSoftwareCatalogueEntries().map(x=>x.label),
              ...builtInSoftwareSuggestions.map(x=>x.name)
            ]:[...getConfiguredServerServiceCatalogueEntries(),...builtInServerServiceSuggestions].map(x=>x.label);
            if(duplicates.some(x=>String(x||'').trim().toLowerCase()===label.toLowerCase()))return fail('That catalogue item already exists. Select it from the list.');
            const button=panel.querySelector('[data-action="device-inline-quick-save"]');
            if(button?.disabled)return;
            if(button)button.disabled=true;
            captureDeviceDetailFieldValues();
            const field=software?'installedSoftware':'serverFunctions';
            const previous=appState[field];
            const key=(software?'customSoftware_':'customServerFunction_')+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8);
            const next=[...(Array.isArray(previous)?previous:[])];
            next.push(software?{key,label,deviceTypes:types}:{key,label});
            appState[field]=next;
            try{
              if(!await nextSettingsBridge.save(field)){
                appState[field]=previous;
                return fail('Could not save this catalogue item. The existing device form is unchanged.');
              }
              deviceDetailFormValues[key]=true;
              refreshDeviceDetailFields();
              showToast(label+' added and selected for this device.');
            }catch(err){
              appState[field]=previous;
              return fail('Could not save this catalogue item. Please try again.');
            }finally{
              if(button?.isConnected)button.disabled=false;
            }
        }
        document.addEventListener('input',event=>{
          const search=event.target.closest('.device-review-inline-pick [data-review-search]');
          if(!search)return;
          const picker=search.closest('.device-review-inline-pick'),query=String(search.value||'').trim().toLowerCase();
          picker.querySelectorAll('.device-review-check-item').forEach(row=>{row.hidden=!row.textContent.toLowerCase().includes(query)});
        });
        document.addEventListener('change',event=>{
          const control=event.target.closest('.device-review-inline-pick input[data-device-detail-field]');
          if(!control)return;
          deviceDetailFormValues[control.dataset.deviceDetailField]=control.checked;
          if(control.dataset.deviceDetailField==='serverService_Hypervisor'&&document.getElementById('dev-type')?.value==='Server - Physical'){document.getElementById('device-hosting-enabled').checked=control.checked;syncHostingFieldVisibility();}
          updateInlinePickerCount(control.closest('.device-review-inline-pick'));
        });

        // Device editor inline hardware catalogue fields with real SQLite-backed settings.
        function renderInlineHardwareQuickAdd(kind) {
            if(!['manufacturer','model'].includes(kind))return '';
            const label=kind==='manufacturer'?'Manufacturer':'Model';
            const current=document.getElementById('dev-type')?.value||'';
            const types=kind==='manufacturer'?getUniqueDeviceTypes().filter(t=>t&&t!=='Server - Virtual'):[];
            const associations=kind==='manufacturer'
                ? renderInterfaceTemplate("shared/associations-1",[])+types.map(t=>'<label><input type="checkbox" value="'+escapeHtml(t)+'" '+(t===current?'checked':'')+'><span>'+escapeHtml(t==='Server - Physical'?'Server (Physical)':t)+'</span></label>').join('')+'</div>'
                : '';
            return '<div class="device-review-inline-create" data-review-create="'+kind+'" hidden>'
                +'<h4>Add '+label+' without leaving the device form</h4>'
                +'<div class="device-review-inline-add-actions"><div class="device-review-field">'
                +'<label for="review-new-'+kind+'">'+label+' name</label><input id="review-new-'+kind+'" data-review-new-name="'+kind+'" type="text" maxlength="100" placeholder="Enter '+label.toLowerCase()+' name"></div></div>'
                +associations+'<p class="device-review-inline-explain" role="alert" data-review-create-error hidden></p>'
                +renderInterfaceTemplate("shared/render-inline-hardware-quick-add-1",[])+kind+'">Add &amp; Select</button>'
                +'<button type="button" class="device-review-smallbtn" data-action="device-inline-quick-cancel" data-kind="'+kind+'">Cancel</button></div></div>';
        }
        async function saveInlineHardwareQuickAdd(kind) {
            if(!['manufacturer','model'].includes(kind))return;
            const panel=document.querySelector('#modal-content form[data-device-form="true"] [data-review-create="'+kind+'"]');
            if(!panel||panel.hidden)return;
            const input=panel.querySelector('[data-review-new-name]'),error=panel.querySelector('[data-review-create-error]');
            const fail=msg=>{if(error){error.textContent=msg;error.hidden=false;}input?.focus();};
            const label=String(input?.value||'').trim(),type=document.getElementById('dev-type')?.value||'';
            if(!label||label.length>100)return fail('Enter a name of 100 characters or fewer.');
            if(!type||isVirtualDeviceForm()||type==='Server - Virtual')return fail('Select a physical device type first.');
            const items=getConfiguredHardwareCatalogueEntries();
            let rows=[];
            if(kind==='manufacturer'){
                const knownTypes=new Set(getUniqueDeviceTypes());
                const types=[...panel.querySelectorAll('[data-review-associated-types="manufacturer"] input:checked')].map(x=>x.value).filter(t=>knownTypes.has(t)&&t!=='Server - Virtual');
                if(!types.length)return fail('Select at least one device type.');
                const defaults=['Dell','HP','HPE','Lenovo','ASUS','Apple','Cisco','Samsung','Microsoft','Toshiba'];
                const known=[...Object.values(getVisibleBuiltInHardwareSuggestions()).flatMap(x=>Object.keys(x)),...defaults.map(n=>getHardwareSeedPreferences()['maker:'+n.toLowerCase()]?.label||n),...items.map(x=>x.manufacturer),...appState.devices.map(x=>x.manufacturer)];
                if(known.some(n=>String(n||'').trim().toLowerCase()===label.toLowerCase()))return fail('That manufacturer already exists. Select it from the list.');
                rows=types.map(t=>({id:'hardware_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,9),type:t,manufacturer:label,model:''}));
            }else{
                const maker=String(document.getElementById('dev-manufacturer')?.value||'').trim();
                if(!maker)return fail('Choose or add a manufacturer before adding a model.');
                if(!getNonVirtualDeviceTypesAssociatedWithManufacturer(maker).includes(type))return fail('Associate this manufacturer with the selected device type first.');
                const duplicate=items.some(x=>x.type===type&&x.manufacturer.toLowerCase()===maker.toLowerCase()&&String(x.model||'').toLowerCase()===label.toLowerCase());
                const builtin=Object.entries(getVisibleBuiltInHardwareSuggestions()[type]||{}).some(([n,models])=>n.toLowerCase()===maker.toLowerCase()&&models.some(m=>m.toLowerCase()===label.toLowerCase()));
                if(duplicate||builtin)return fail('That model already exists. Select it from the list.');
                rows=[{id:'hardware_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,9),type,manufacturer:maker,model:label}];
            }
            const button=panel.querySelector('[data-action="device-inline-quick-save"]');
            if(button?.disabled)return;
            if(button)button.disabled=true;
            const previous=appState.hardwareCatalogue;
            appState.hardwareCatalogue=[...items,...rows];
            try{
                if(!await nextSettingsBridge.save('hardwareCatalogue')){
                    appState.hardwareCatalogue=previous;
                    return fail('Could not save this catalogue item. The device form is unchanged.');
                }
                if(kind==='manufacturer'){
                    document.getElementById('dev-manufacturer').value=label;
                    document.getElementById('dev-model').value='';
                }else document.getElementById('dev-model').value=label;
                refreshHardwareSuggestions();
                panel.hidden=true;
                if(input)input.value='';
                showToast(label+' added and selected for this device.');
            }catch(err){
                appState.hardwareCatalogue=previous;
                return fail('Could not save this catalogue item. Please try again.');
            }finally{if(button?.isConnected)button.disabled=false;}
        }

        function renderDeviceDetailFields(type, values={}, section='all') {
            const keys=getDetailFieldsForDeviceType(type).filter(key =>
                key !== 'os' && key !== 'windowsLicence' && !(type === 'Server - Physical' && key === 'serverService_Hypervisor' && section === 'services') && (section === 'all' || (section === 'hardware' && !isSoftwareDetailField(key)) || (section === 'services' && getAvailableServerServiceFieldKeys().includes(key)) || (section === 'installed' && getAvailableSoftwareCatalogueEntries().some(x=>x.key===key)) || (section === 'software' && isSoftwareDetailField(key))));
            if(section==='installed'||section==='services'||section==='software')keys.sort((a,b)=>String(getAvailableServerServiceCatalogueEntries().find(x=>x.key===a)?.label||getAvailableSoftwareCatalogueEntries().find(x=>x.key===a)?.label||deviceDetailFieldLabels[a]||a).localeCompare(String(getAvailableServerServiceCatalogueEntries().find(x=>x.key===b)?.label||getAvailableSoftwareCatalogueEntries().find(x=>x.key===b)?.label||deviceDetailFieldLabels[b]||b),undefined,{sensitivity:'base'}));
            if (!keys.length) return '<p class="text-sm text-slate-600 dark:text-slate-300">'+(type ? 'No additional fields are configured for this type yet.' : 'Select a device type above to display its additional fields.')+'</p>';
            return '<div class="device-review-form-grid">'+keys.map(key=>{
                const label=(deviceTypeDetailGroups[String(type||'').toLowerCase().trim()]==='router'&&key==='networkConnection')?'WAN connection method':(getAvailableServerServiceCatalogueEntries().find(x=>x.key===key)?.label||getAvailableSoftwareCatalogueEntries().find(x=>x.key===key)?.label||deviceDetailFieldLabels[key]||key);
                const value=values[key]??'';
                if(booleanDeviceDetailFields.has(key)||getAvailableServerServiceFieldKeys().includes(key)||getAvailableSoftwareCatalogueEntries().some(x=>x.key===key)) {
                    const tile = section === 'services' || section === 'installed';
                    return tile ? renderInterfaceTemplate("devices/render-device-detail-fields-1",[escapeHtml(key),value===true?'checked':'',escapeHtml(label)]) : renderInterfaceTemplate("devices/render-device-detail-fields-2",[escapeHtml(key),value===true?'checked':'',escapeHtml(label)]);
                }
                const choices=deviceDetailFieldChoices[key];
                if(choices) return renderInterfaceTemplate("devices/render-device-detail-fields-3",[escapeHtml(key),escapeHtml(label),escapeHtml(key),escapeHtml(key),choices.map(opt=>`<option value="${escapeHtml(opt)}" ${value===opt?'selected':''}>${escapeHtml(opt)}</option>`).join('')]);
                return renderInterfaceTemplate("devices/render-device-detail-fields-4",[escapeHtml(key),escapeHtml(label),escapeHtml(key),escapeHtml(key),numericDeviceDetailFields.has(key)?'number':'text',numericDeviceDetailFields.has(key)?'min="0" step="any"':'',escapeHtml(String(value))]);
            }).join('')+'</div>';
        }
        // Offline, device-type-aware platform suggestions. Names are not version claims.
        const platformOptionsByDeviceGroup = Object.freeze({
            network: ['FortiOS','PAN-OS','pfSense CE','pfSense Plus','OPNsense Community','OPNsense Business','UniFi OS','Sophos Firewall OS','Cisco ASA Software','Cisco Secure Firewall Threat Defense'],
            router: ['pfSense CE','pfSense Plus','OPNsense Community','OPNsense Business','Cisco IOS','Cisco IOS XE','MikroTik RouterOS','Junos OS','OpenWrt','UniFi OS','VyOS'],
            switch: ['Cisco IOS','Cisco IOS XE','Cisco NX-OS','ArubaOS-Switch','Aruba AOS-CX','Junos OS','Junos OS Evolved','UniFi Switch Firmware','MikroTik RouterOS'],
            nas: ['Synology DSM','QNAP QTS','QNAP QuTS hero','TrueNAS SCALE','TrueNAS CORE','Unraid'],
            ap: ['UniFi AP Firmware','Aruba Instant','Cisco IOS','TP-Link Omada Firmware','OpenWrt'],
            controller: ['UniFi OS','ArubaOS','Cisco Catalyst 9800 IOS XE','TP-Link Omada Firmware'],
            server: ['Windows Server','Ubuntu Server','Debian','Red Hat Enterprise Linux','Rocky Linux','AlmaLinux OS','CentOS Linux','CentOS Stream','SUSE Linux Enterprise Server','openSUSE Leap','openSUSE Tumbleweed','Proxmox VE','VMware ESXi'],
            computer: ['Windows','macOS','Ubuntu','Debian','Fedora','Linux Mint','openSUSE Leap','openSUSE Tumbleweed'],
            ups: ['UPS Firmware','PDU Firmware'],
            generic: ['Firmware','Embedded Software']
        });
        function getPlatformGroupForDeviceType(type) {
            const normalized = String(type || '').toLowerCase().trim();
            if (normalized === 'wireless lan controller') return 'controller';
            if (normalized === 'layer 3 switch') return 'switch';
            return deviceTypeDetailGroups[normalized] || 'generic';
        }
        function getPlatformOptionsForDeviceType(type) {
            const choices = platformOptionsByDeviceGroup[getPlatformGroupForDeviceType(type)] || platformOptionsByDeviceGroup.generic;
            // Dedicated host hypervisors are not normal guest OS suggestions.
            // This filters the editor only: historical saved values and backups remain unchanged.
            if (String(type || '').toLowerCase().trim() === 'server - virtual') {
                return choices.filter(name => !['Proxmox VE', 'VMware ESXi', 'Microsoft Hyper-V', 'KVM', 'XCP-ng'].includes(name));
            }
            return choices;
        }
        // Historical major releases are offline suggestions, not support-status claims.
        const platformVersionOptionsByName = Object.freeze({
    "Windows Server": [
        "2025",
        "2022",
        "2019",
        "2016",
        "2012 R2",
        "2012",
        "2008 R2",
        "2008",
        "2003",
        "2000"
    ],
    "Windows": [
        "11",
        "10",
        "8.1",
        "8",
        "7",
        "Vista",
        "XP",
        "2000",
        "ME",
        "98"
    ],
    "macOS": [
        "26 Tahoe",
        "15 Sequoia",
        "14 Sonoma",
        "13 Ventura",
        "12 Monterey",
        "11 Big Sur",
        "10.15 Catalina",
        "10.14 Mojave",
        "10.13 High Sierra",
        "10.12 Sierra",
        "10.11 El Capitan",
        "10.10 Yosemite",
        "10.9 Mavericks"
    ],
    "Ubuntu Server": [
        "26.04 LTS",
        "24.04 LTS",
        "22.04 LTS",
        "20.04 LTS",
        "18.04 LTS",
        "16.04 LTS",
        "14.04 LTS",
        "12.04 LTS",
        "10.04 LTS",
        "8.04 LTS"
    ],
    "Ubuntu": [
        "26.10",
        "26.04 LTS",
        "25.10",
        "25.04",
        "24.10",
        "24.04 LTS",
        "23.10",
        "23.04",
        "22.10",
        "22.04 LTS",
        "21.10",
        "21.04",
        "20.10",
        "20.04 LTS",
        "19.10",
        "19.04",
        "18.10",
        "18.04 LTS",
        "17.10",
        "17.04",
        "16.10",
        "16.04 LTS"
    ],
    "Debian": [
        "13",
        "12",
        "11",
        "10",
        "9",
        "8",
        "7",
        "6",
        "5",
        "4"
    ],
    "Fedora": [
        "45",
        "44",
        "43",
        "42",
        "41",
        "40",
        "39",
        "38",
        "37",
        "36",
        "35",
        "34",
        "33",
        "32"
    ],
    "Linux Mint": [
        "22.3",
        "22.2",
        "22.1",
        "22",
        "21.3",
        "21.2",
        "21.1",
        "21",
        "20.3",
        "20.2",
        "20.1",
        "20",
        "19.3",
        "19.2",
        "19.1",
        "19"
    ],
    "CentOS Linux": [
        "8",
        "7",
        "6",
        "5"
    ],
    "CentOS Stream": [
        "10",
        "9",
        "8"
    ],
    "Rocky Linux": [
        "10",
        "9",
        "8"
    ],
    "AlmaLinux OS": [
        "10",
        "9",
        "8"
    ],
    "Red Hat Enterprise Linux": [
        "10",
        "9",
        "8",
        "7",
        "6",
        "5"
    ],
    "SUSE Linux Enterprise Server": [
        "16",
        "15",
        "12",
        "11"
    ],
    "openSUSE Leap": [
        "16.0",
        "15.6",
        "15.5",
        "15.4",
        "15.3"
    ],
    "Proxmox VE": [
        "9.2",
        "9.1",
        "9.0",
        "8.4",
        "8.3",
        "8.2",
        "8.1",
        "8.0",
        "7",
        "6",
        "5",
        "4",
        "3",
        "2",
        "1"
    ],
    "VMware ESXi": [
        "8",
        "7",
        "6.7",
        "6.5",
        "6.0",
        "5.5",
        "5.1",
        "5.0",
        "4.1",
        "4.0"
    ],
    "Microsoft Hyper-V": [
        "2025",
        "2022",
        "2019",
        "2016",
        "2012 R2",
        "2012",
        "2008 R2"
    ],
    "XCP-ng": [
        "8.3",
        "8.2",
        "8.1"
    ],
    "pfSense CE": [
        "2.9.0",
        "2.8.1",
        "2.8.0",
        "2.7.2",
        "2.7.1",
        "2.7.0",
        "2.6.0"
    ],
    "pfSense Plus": [
        "26.07",
        "26.03.1",
        "26.03",
        "25.11",
        "25.07",
        "24.11",
        "24.03"
    ],
    "OPNsense Community": [
        "26.7",
        "26.1",
        "25.7",
        "25.1",
        "24.7",
        "24.1",
        "23.7",
        "23.1",
        "22.7",
        "22.1"
    ],
    "OPNsense Business": [
        "26.10",
        "26.4",
        "25.10",
        "25.4",
        "24.10",
        "24.4",
        "23.10",
        "23.4",
        "22.10",
        "22.4"
    ],
    "FortiOS": [
        "7.6",
        "7.4",
        "7.2",
        "7.0",
        "6.4",
        "6.2",
        "6.0",
        "5.6",
        "5.4",
        "5.2"
    ],
    "PAN-OS": [
        "11.2",
        "11.1",
        "11.0",
        "10.2",
        "10.1",
        "10.0",
        "9.1",
        "9.0",
        "8.1"
    ],
    "Sophos Firewall OS": [
        "21.5",
        "21",
        "20",
        "19.5",
        "19",
        "18.5",
        "18"
    ],
    "Synology DSM": [
        "7.3",
        "7.2",
        "7.1",
        "7.0",
        "6.2",
        "6.1",
        "6.0",
        "5.2",
        "5.1",
        "5.0"
    ],
    "QNAP QTS": [
        "5.2",
        "5.1",
        "5.0",
        "4.5",
        "4.4",
        "4.3",
        "4.2"
    ],
    "QNAP QuTS hero": [
        "h6.0",
        "h5.3",
        "h5.2",
        "h5.1",
        "h5.0",
        "h4.5"
    ],
    "TrueNAS SCALE": [
        "25.10",
        "25.04",
        "24.10",
        "24.04",
        "23.10",
        "22.12",
        "22.02"
    ],
    "TrueNAS CORE": [
        "13.3",
        "13.0",
        "12.0",
        "11.3",
        "11.2",
        "11"
    ],
    "Unraid": [
        "7.2",
        "7.1",
        "7.0",
        "6.12",
        "6.11",
        "6.10",
        "6.9"
    ],
    "OpenWrt": [
        "25.12",
        "24.10",
        "23.05",
        "22.03",
        "21.02",
        "19.07",
        "18.06",
        "17.01"
    ],
    "MikroTik RouterOS": [
        "7",
        "6"
    ],
    "VyOS": [
        "1.4",
        "1.3",
        "1.2"
    ]
});
        function getPlatformVersionOptions(platform) {
            return platformVersionOptionsByName[platform] || [];
        }
        function isWindowsPlatform(platform) {
            return /^Windows(?: Server)?$/i.test(String(platform || '').trim());
        }
        // Refresh displayed choices without treating an automatic update as a user's choice.
        function refreshDeviceEditorDropdowns() {
            document.querySelectorAll('#device-editor-form select').forEach(select=>select.dispatchEvent(new Event('device-dropdown-refresh')));
        }
        function getRecordedDevicePlatform() {
            const details=deviceEditorSoftwareSource?.typeDetails||{};
            return {name:details.softwarePlatform??details.os??deviceEditorSoftwareSource?.os??'',version:details.softwareVersion??''};
        }
        function refreshDeviceEditorContext() {
            captureDeviceDetailFieldValues();
            const type=document.getElementById('dev-type')?.value||'';
            const name=deviceDetailFormValues.softwarePlatform||'';
            const choices=getPlatformOptionsForDeviceType(type).filter(value=>!isDeviceEditorHypervisorProduct(value));
            const known=Object.values(platformOptionsByDeviceGroup).flat().includes(name)||isDeviceEditorHypervisorProduct(name);
            // Saved values and unknown Custom entries remain available. Only an incompatible
            // new standard choice is cleared; the original saved record is never changed here.
            if(name&&known&&!choices.includes(name)&&name!==getRecordedDevicePlatform().name){
                deviceDetailFormValues.softwarePlatform='';deviceDetailFormValues.softwareVersion='';
                document.getElementById('platform-name').value='';
                document.getElementById('platform-version').value='';
            }
            refreshDeviceDetailFields();
            refreshHardwareSuggestions();
            refreshDeviceEditorDropdowns();
        }
        function clearDeviceDraftPlatformVersion() {
            deviceDetailFormValues.softwareVersion='';
            const version=document.getElementById('platform-version');if(version)version.value='';
        }
        function defaultDeviceLocationFromRack(rackId) {
            const form=document.getElementById('device-editor-form');
            if(!form||isVirtualDeviceForm())return;
            const previous=form.dataset.locationRackId||'';
            form.dataset.locationRackId=rackId||'';
            const rack=appState.racks.find(item=>item.id===rackId),location=document.getElementById('dev-location');
            if(!location||location.disabled||form.dataset.deviceId||form.dataset.locationManuallyOverridden==='true')return;
            if(previous===rackId&&(location.value||form.dataset.duplicateSourceId))return;
            const recordedLocation=rack?.location;
            if(typeof recordedLocation!=='string'||!recordedLocation.trim()||['Racked','__caffoot_create_location__'].includes(recordedLocation))return;
            let option=[...location.options].find(item=>item.value===recordedLocation);
            // A rack's recorded room may not yet appear in the Device location list.
            // Offer that existing value in this draft without creating a catalogue entry.
            if(!option){
                option=new Option(recordedLocation,recordedLocation);
                location.insertBefore(option,location.querySelector('option[value="__caffoot_create_location__"]'));
            }
            location.value=option.value;location.dataset.previousLocation=option.value;
            refreshDeviceEditorDropdowns();
        }
        function renderSoftwarePlatformFields(type, values = {}) {
            const group = getPlatformGroupForDeviceType(type);
            const isComputer = group === 'server' || group === 'computer';
            const name = values.softwarePlatform ?? '';
            const version = values.softwareVersion ?? '';
            const retained = isDeviceEditorHypervisorProduct(name);
            const choices = getPlatformOptionsForDeviceType(type).filter(value=>!isDeviceEditorHypervisorProduct(value));
            const options = [...new Set([...choices, ...(name && !retained && !choices.includes(name) ? [name] : [])])];
            let markup = renderInterfaceTemplate("device-management/render-software-platform-fields-1",['Operating System',!name?'selected':'',options.map(x => `<option value="${escapeHtml(x)}" ${name===x?'selected':''}>${escapeHtml(x)}${x===name&&!choices.includes(x)&&name===getRecordedDevicePlatform().name?' — Previously Recorded':''}</option>`).join(''),escapeHtml(String(name)),name && !choices.includes(name) ? '' : 'hidden','OS / Platform version',getPlatformVersionOptions(name).map(v=>`<option value="${escapeHtml(v)}" ${version===v?'selected':''}>${escapeHtml(v)}</option>`).join(''),version && !getPlatformVersionOptions(name).includes(version)?'selected':'',escapeHtml(String(version)),version && !getPlatformVersionOptions(name).includes(version)?'':'hidden',isWindowsPlatform(name)?'':'hidden',escapeHtml(String(values.windowsLicence ?? ''))]);
            const recorded=getRecordedDevicePlatform();
            if(!retained&&name&&name===recorded.name&&(!choices.includes(name)||(version&&version===recorded.version&&!getPlatformVersionOptions(name).includes(version)))){
                const container=document.createElement('div');container.innerHTML=markup;
                const notice=document.createElement('small');notice.dataset.retainedPlatform='';
                notice.textContent='Previously recorded OS or version retained. Choose another value to replace it.';
                container.querySelector('#platform-select').parentElement.append(notice);markup=container.innerHTML;
            }
            if(retained){
                const container=document.createElement('div');container.innerHTML=markup;
                container.querySelector('#platform-select').value='';
                container.querySelector('#platform-name').hidden=true;
                const notice=document.createElement('small');notice.dataset.retainedHypervisorOs='';
                notice.textContent='Previously recorded OS retained: '+name+'. Configure hosting on General.';
                container.querySelector('#platform-select').parentElement.append(notice);
                markup=container.innerHTML;
            }
            return markup;
        }
        function bindSoftwarePlatformFields() {
            const select = document.getElementById('platform-select');
            const custom = document.getElementById('platform-name');
            if (!select || !custom) return;
            select.addEventListener('change', () => {
                const previousPlatform=deviceDetailFormValues.softwarePlatform||'';
                const customSelected=select.value==='__custom__';
                if (customSelected) {
                    custom.hidden = false;
                    custom.value = '';
                    custom.focus();
                } else {
                    custom.hidden = true;
                    custom.value = select.value;
                }
                if(previousPlatform!==custom.value)clearDeviceDraftPlatformVersion();
                captureSoftwarePlatformFields();
                refreshSoftwarePlatformFields();
                refreshDeviceSoftwareSuggestions();
                if(customSelected){
                    // Rebuilding version choices must not hide the custom choice the user just made.
                    document.getElementById('platform-select').value='__custom__';
                    const field=document.getElementById('platform-name');
                    field.hidden=false;field.focus();
                }
            });
            custom.addEventListener('input',()=>{
                if(custom.value!==deviceDetailFormValues.softwarePlatform){
                    clearDeviceDraftPlatformVersion();
                    const version=document.getElementById('version-select');
                    version.replaceChildren(new Option('Select a version...',''),...getPlatformVersionOptions(custom.value).map(value=>new Option(value,value)),new Option('Custom / Other...','__custom__'));
                    document.getElementById('platform-version').hidden=true;
                }
                captureSoftwarePlatformFields();refreshDeviceSoftwareSuggestions();refreshDeviceEditorDropdowns();
            });
            const versionSelect = document.getElementById('version-select');
            const versionInput = document.getElementById('platform-version');
            versionSelect?.addEventListener('change', () => {
                if (versionSelect.value === '__custom__') {
                    versionInput.hidden = false;
                    versionInput.value = '';
                    versionInput.focus();
                } else {
                    versionInput.hidden = true;
                    versionInput.value = versionSelect.value;
                }
                captureSoftwarePlatformFields();
            });
        }
        function captureSoftwarePlatformFields() {
            const name = document.getElementById('platform-name');
            const version = document.getElementById('platform-version');
            if (name) deviceDetailFormValues.softwarePlatform = name.value;
            if (version) deviceDetailFormValues.softwareVersion = version.value;
            const licence = document.getElementById('device-form-windows-licence');
            if (licence) deviceDetailFormValues.windowsLicence = licence.value;
        }
        function refreshSoftwarePlatformFields() {
            captureSoftwarePlatformFields();
            const panel = document.getElementById('software-platform');
            if (!panel) return;
            const type = document.getElementById('dev-type')?.value || '';
            panel.outerHTML = renderSoftwarePlatformFields(type, deviceDetailFormValues);
            bindSoftwarePlatformFields();
            syncHostingFieldVisibility();
        }
        let deviceDetailFormValues = {};
        let deviceEditorSoftwareSource = null;
        function isHypervisorHostingEnabledInDeviceForm() {
            const control = document.getElementById('device-hosting-enabled');
            return control ? control.checked : deviceDetailFormValues.serverService_Hypervisor === true;
        }
        function syncHostingFieldVisibility() {
            refreshDeviceSoftwareSuggestions();
            const enabled = isHypervisorHostingEnabledInDeviceForm();
            const fields = document.getElementById('device-hosting-details');
            if (fields) fields.hidden = !enabled;
            const platform = document.getElementById('software-platform');
            if (platform) platform.hidden = document.getElementById('dev-type')?.value === 'Server - Physical' && enabled;
            if(document.getElementById('dev-type')?.value==='Server - Physical'){
                const service=document.querySelector('.device-review-inline-pick input[data-device-detail-field="serverService_Hypervisor"]');
                if(service){service.checked=enabled;updateInlinePickerCount(service.closest('.device-review-inline-pick'));}
            }
        }
        function captureDeviceDetailFieldValues() {
            captureSoftwarePlatformFields();
            document.querySelectorAll('[data-device-detail-field]').forEach(el=>{
                deviceDetailFormValues[el.dataset.deviceDetailField]=el.type==='checkbox'?el.checked:el.value;
            });
            if (document.getElementById('dev-type')?.value === 'Server - Physical' &&
                document.getElementById('device-hosting-enabled')) {
                deviceDetailFormValues.serverService_Hypervisor = isHypervisorHostingEnabledInDeviceForm();
            }
            return {...deviceDetailFormValues};
        }
        function refreshDeviceDetailFields() {
            captureSoftwarePlatformFields();
            captureDeviceDetailFieldValues();
            refreshSoftwarePlatformFields();
            const panel=document.getElementById('device-detail-fields-panel');
            const type=document.getElementById('dev-type')?.value;
            if(panel) panel.innerHTML=renderDeviceDetailFields(type,deviceDetailFormValues,'hardware');
            const serviceFields = document.getElementById('server-services-fields');
            if(serviceFields) serviceFields.innerHTML=renderInlineDevicePicker('services',type,deviceDetailFormValues);
            const hosting = document.getElementById('device-hosting-enabled');
            if (hosting && type === 'Server - Physical') hosting.checked = deviceDetailFormValues.serverService_Hypervisor === true;
            syncHostingFieldVisibility();
            const installedFields = document.getElementById('device-form-installed-software-fields');
            if(installedFields) installedFields.innerHTML=renderInlineDevicePicker('software',type,deviceDetailFormValues);
            document.getElementById('details-section')?.classList.toggle('hidden',!getDetailFieldsForDeviceType(type).some(key=>!isSoftwareDetailField(key)));
            document.getElementById('server-services-section')?.classList.toggle('hidden',deviceTypeDetailGroups[String(type||'').toLowerCase().trim()]!=='server');
            const serviceWrapper=document.querySelector('#device-editor-form .device-server-services');
            if(serviceWrapper)serviceWrapper.hidden=deviceTypeDetailGroups[String(type||'').toLowerCase().trim()]!=='server';
            document.getElementById('device-form-installed-software-section')?.classList.remove('hidden');
            const group=deviceTypeDetailGroups[String(type||'').toLowerCase().trim()];
            document.getElementById('manage-server-services-button')?.classList.toggle('hidden',group!=='server');
            document.getElementById('manage-installed-software-button')?.classList.toggle('hidden',group!=='server'&&group!=='computer');
            updateDeviceMountChoices();
            updateVirtualHardwareFieldVisibility();
            refreshDeviceEditorDropdowns();
        }

        function isWirelessAccessPointDeviceType(type){return ['access point','ap','wireless access point'].includes(String(type||'').toLowerCase().trim());}
        // Device mounting describes physical installation, independently of Location Area.
        // Keep legacy mounting values available to avoid changing existing device records.
        // Broad compatibility whitelist: historical selections remain valid in saved inventories.
        function getRecognisedDeviceMountTypes(type){
            return ['Desktop','Tabletop / Shelf Mounted','Shelf Mounted','Rack Mounted','Wall Mounted','Ceiling Mounted','Pole Mounted','DIN Rail Mounted','Under-Desk Mounted','Floor Standing','Tower / Floor Standing','Handheld','Mobile','Vehicle Mounted','Not Applicable','Unknown'];
        }
        // Narrower, device-appropriate suggestions shown when adding or changing a device.
        function getSuggestedMountTypes(type){
            const normalized=String(type||'').trim().toLowerCase();
            if(normalized==='laptop'||normalized==='tablet') return ['Tabletop / Shelf Mounted','Handheld','Mobile','Vehicle Mounted','Not Applicable','Unknown'];
            if(normalized==='desktop') return ['Tabletop / Shelf Mounted','Under-Desk Mounted','Wall Mounted','Floor Standing','Not Applicable','Unknown'];
            if(isWirelessAccessPointDeviceType(type)) return ['Tabletop / Shelf Mounted','Ceiling Mounted','Wall Mounted','Pole Mounted','Unknown'];
            if(normalized==='firewall'||normalized==='router'||normalized==='switch'||normalized==='wireless lan controller') return ['Rack Mounted','Tabletop / Shelf Mounted','Wall Mounted','DIN Rail Mounted','Unknown'];
            if(normalized==='server'||normalized==='server - physical'||normalized==='physical server') return ['Rack Mounted','Tower / Floor Standing','Tabletop / Shelf Mounted','Unknown'];
            if(normalized==='server - virtual'||normalized==='virtual server') return ['Not Applicable','Unknown'];
            if(normalized==='printer'||normalized==='scanner'||normalized==='print server'||normalized==='print servers') return ['Tabletop / Shelf Mounted','Floor Standing','Rack Mounted','Unknown'];
            if(normalized==='nas') return ['Tabletop / Shelf Mounted','Rack Mounted','Floor Standing','Unknown'];
            if(normalized==='ups') return ['Rack Mounted','Floor Standing','Tabletop / Shelf Mounted','Unknown'];
            return ['Rack Mounted','Tabletop / Shelf Mounted','Wall Mounted','Floor Standing','Unknown'];
        }
        function getDefaultMountType(type){
            return getSuggestedMountTypes(type)[0];
        }
        function renderDeviceMountOptions(type, selected){
            const opts=getSuggestedMountTypes(type);
            if (selected && getRecognisedDeviceMountTypes(type).includes(selected) && !opts.includes(selected)) opts.push(selected);
            return opts.map(v=>`<option value="${escapeHtml(v)}" ${selected===v?'selected':''}>${escapeHtml(v)}</option>`).join('');
        }
        function updateDeviceMountChoices(){
            const type=document.getElementById('dev-type')?.value;
            const mount=document.getElementById('dev-mount-type');
            if(!mount)return;
            const previous=mount.value;
            const options=isVirtualDeviceForm()?['Not Applicable']:getSuggestedMountTypes(type);
            const chosen=isVirtualDeviceForm() ? 'Not Applicable' : ((options.includes(previous) || (previous && getRecognisedDeviceMountTypes(type).includes(previous))) ? previous : getDefaultMountType(type));
            mount.innerHTML='<option value="" disabled>Select mounting type...</option>'+ (isVirtualDeviceForm()?'<option value="Not Applicable">Not Applicable</option>':renderDeviceMountOptions(type,chosen));
            mount.value=chosen;
            toggleDeviceMountType();
        }
        // Rearrange existing form nodes, without recreating inputs or changing saved data.
        // Markdown is stored as plain text. Preview creates DOM nodes, never evaluates note HTML.
        function initialiseNotesEditor(form) {
            const editor = form.querySelector('#dev-notes');
            const preview = form.querySelector('#notes-preview');
            const toggle = form.querySelector('#notes-toggle');
            if (!editor || !preview || !toggle) return;
            function inlineMarkdown(target, text) {
                const pattern = /(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\*\*([^*\n]+)\*\*|\*([^*\n]+)\*|`([^`\n]+)`)/g;
                let last = 0, match;
                while ((match = pattern.exec(text)) !== null) {
                    target.appendChild(document.createTextNode(text.slice(last, match.index)));
                    const node = document.createElement(match[2] ? 'a' : match[4] ? 'strong' : match[5] ? 'em' : 'code');
                    if (match[2]) { node.href = match[3]; node.target = '_blank'; node.rel = 'noopener noreferrer'; }
                    node.textContent = match[2] || match[4] || match[5] || match[6];
                    target.appendChild(node);
                    last = pattern.lastIndex;
                }
                target.appendChild(document.createTextNode(text.slice(last)));
            }
            function render() {
                preview.replaceChildren();
                for (const line of editor.value.split(/\r?\n/)) {
                    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
                    const bullet = /^\s*[-*]\s+(.*)$/.exec(line);
                    const number = /^\s*\d+\.\s+(.*)$/.exec(line);
                    const node = document.createElement(heading ? (heading[1].length === 1 ? 'h2' : 'h3') : bullet || number ? 'p' : 'p');
                    inlineMarkdown(node, heading ? heading[2] : bullet ? '• ' + bullet[1] : number ? '1. ' + number[1] : line);
                    preview.appendChild(node);
                }
            }
            form.querySelectorAll('[data-notes-format]').forEach(button => button.addEventListener('click', () => {
                const kind = button.dataset.notesFormat;
                const start = editor.selectionStart, end = editor.selectionEnd;
                const selected = editor.value.slice(start, end);
                const wrap = {bold:['**','**'], italic:['*','*'], code:['`','`'], link:['[','](https://example.com)'], heading:['## ',''], bullet:['- ',''], number:['1. ','']}[kind];
                if (!wrap) return;
                const insertion = wrap[0] + (selected || (kind === 'link' ? 'link text' : 'text')) + wrap[1];
                editor.setRangeText(insertion, start, end, 'select');
                editor.dispatchEvent(new Event('input', {bubbles:true}));
                editor.focus();
            }));
            toggle.addEventListener('click', () => {
                const show = preview.hidden;
                if (show) render();
                preview.hidden = !show;
                editor.hidden = show;
                toggle.textContent = show ? 'Edit Notes' : 'Preview';
                toggle.setAttribute('aria-pressed', String(show));
                if (!show) editor.focus();
            });
            editor.addEventListener('input', () => { if (!preview.hidden) render(); });
        }

        function initialiseDeviceTabs(form) {
            if (!form || form.querySelector('[data-device-tabs]')) return;
            const sections = Array.from(form.children).filter(el => el.classList.contains('form-section-card'));
            if (sections.length !== 5) return;
            sections.forEach(section => {section.classList.add('device-review-panel');section.classList.remove('space-y-4');});
            const isVirtualDevice = isVirtualDeviceForm();
            const labels = [
                ['general', 'General'],
                ['hardware', 'Hardware'],
                ['software', 'Software & Firmware'],
                ['networking', 'Networking'],
                ['notes', 'Notes']
            ];
            const nav = document.createElement('div');
            nav.className = 'device-form-tabs device-review-tabs';
            nav.setAttribute('role', 'tablist');
            nav.setAttribute('aria-label', 'Device form sections');
            nav.dataset.deviceTabs = 'true';
            const panels = new Map();
            const buttons = new Map();
            labels.forEach(([id, label], index) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'device-form-tab device-review-tab';
                button.id = 'device-form-tab-' + id;
                button.setAttribute('role', 'tab');
                button.setAttribute('aria-controls', 'device-form-panel-' + id);
                button.textContent = label;
                nav.appendChild(button);
                buttons.set(id, button);
                const panel = document.createElement('div');
                panel.id = 'device-form-panel-' + id;
                panel.className = 'device-form-panel device-review-form-panel';
                panel.setAttribute('role', 'tabpanel');
                panel.setAttribute('aria-labelledby', button.id);
                panel.setAttribute('tabindex', '0');
                panels.set(id, panel);
            });
            form.insertBefore(nav, sections[0]);
            labels.forEach(([id]) => form.insertBefore(panels.get(id), sections[0]));
            // The device editor uses a two-column card grid within the General tab.
            // Work with the original input elements so native saves and listeners survive.
            const generalGrid = document.createElement('div');
            generalGrid.className = 'device-review-grid';
            panels.get('general').appendChild(generalGrid);
            generalGrid.append(sections[0], sections[2]);
            sections[0].classList.add('full');
            sections[2].classList.add('full', 'device-physical-mounting');
            // The approved VM configuration is a separate General card.
            // Relocate existing inputs, preserving saved values and event handlers.
            const virtualFields = sections[0].querySelector('#virtual-fields');
            if (virtualFields) {
                const vmHidden=virtualFields.classList.contains('hidden');
                virtualFields.className='form-section-card device-review-panel full device-review-vm-configuration';
                virtualFields.classList.toggle('hidden',vmHidden);
                const vmTitle = virtualFields.querySelector(':scope > p');
                if (vmTitle) {
                    const heading = document.createElement('h3');
                    heading.innerHTML = '<span class="mini-icon" aria-hidden="true">▣</span>Virtual Machine Configuration';
                    vmTitle.replaceWith(heading);
                }
                // The pinned source separates the host assignment, inherited
                // platform guidance, and allocated VM resources in this single card.
                const vmDescription = virtualFields.querySelector(':scope > p');
                if (vmDescription) vmDescription.textContent =
                    'Virtual machines are attached to a physical hypervisor. Physical manufacturer and model do not apply.';
                const hostGrid = virtualFields.querySelector(':scope > .grid');
                if(hostGrid)hostGrid.className='device-review-form-grid';
                if (hostGrid) {
                    const hint = document.createElement('div');
                    hint.className = 'device-review-hint';
                    hint.style.margin='15px 0';
                    hint.textContent = 'The virtualisation platform comes from the selected physical hypervisor. It is not configured separately on this VM.';
                    hostGrid.insertAdjacentElement('afterend', hint);
                }
                const allocations = virtualFields.querySelector('[data-device-detail-field="vmVcpu"]')?.parentElement?.parentElement;
                if(allocations)allocations.className='device-review-form-grid';
                const allocationSection = allocations?.parentElement;
                const allocationLabel = allocationSection?.querySelector(':scope > p');
                if (allocationLabel) {
                    const heading = document.createElement('h3');
                    heading.textContent = 'Allocated Virtual Hardware';
                    heading.style.marginTop='20px';
                    allocationSection.replaceWith(heading,allocations);
                }
                generalGrid.insertBefore(virtualFields, sections[2]);
            }
            // Keep hardware inputs mounted for legacy preservation, but hide the tab for VMs.
            const hardwareGrid = document.createElement('div');
            hardwareGrid.className = 'device-review-grid';
            panels.get('hardware').appendChild(hardwareGrid);
            sections[1].classList.add('full');
            hardwareGrid.appendChild(sections[1]);
            // Networking uses two full-width source cards.
            // Keep the original live IPAM inputs and their event handlers in place.
            const networkingGrid=document.createElement('div');
            networkingGrid.className='device-review-grid';
            const networkIdentity=sections[3];
            networkIdentity.classList.add('full');
            const oldNetworkHeading=networkIdentity.querySelector('.form-section-heading');
            if(oldNetworkHeading){
                const heading=document.createElement('h3');
                heading.innerHTML='<span class="mini-icon" aria-hidden="true">▣</span>Network Identity';
                const subtitle=document.createElement('p');
                subtitle.textContent='IPAM assignments use existing subnets and allocation protections.';
                oldNetworkHeading.replaceWith(heading,subtitle);
            }
            const originalGuidance=[...networkIdentity.querySelectorAll('.device-help')].find(
                el=>el.textContent.includes("Don't see the required network?"));
            const guidanceText=originalGuidance?.textContent.trim()||
                'Create the network in IPAM first, then return to this device.';
            originalGuidance?.remove();
            const oldNetworkGrid=networkIdentity.querySelector('.network-grid');
            if(oldNetworkGrid){
                const fields=document.createElement('div');
                fields.className='device-review-form-grid';
                for(const id of ['dev-block','dev-subnet','dev-vlan','dev-ip']){
                    const control=networkIdentity.querySelector('#'+id);
                    const label=networkIdentity.querySelector('label[for="'+id+'"]');
                    if(!control||!label)continue;
                    const field=document.createElement('div');field.className='device-review-field';
                    label.className='';field.append(label,control);
                    if(id==='dev-vlan'){const hint=document.createElement('small');hint.id='dev-vlan-hint';hint.textContent='Read-only. VLAN is managed on the selected subnet in IPAM.';control.setAttribute('aria-describedby',hint.id);field.append(hint);}
                    if(id==='dev-ip'){
                        const available=networkIdentity.querySelector('#dev-ip-available');
                        const availableLabel=networkIdentity.querySelector('label[for="dev-ip-available"]');
                        if(available&&availableLabel){availableLabel.className='';availableLabel.textContent='Choose an Available IP Address';label.textContent='Or Enter a Primary IP Address *';field.prepend(availableLabel,available);}
                        const addressHint=networkIdentity.querySelector('#dev-ip-hint');
                        if(addressHint)field.append(addressHint);
                    }
                    fields.append(field);
                }
                oldNetworkGrid.before(fields);
                const createSubnet=oldNetworkGrid.querySelector('[data-action="create-subnet-from-device"]');
                if(createSubnet)createSubnet.className='device-review-smallbtn';
                networkIdentity.querySelector('.form-label')?.remove();
                oldNetworkGrid.querySelectorAll(':scope > .device-review-field').forEach(node=>{if(!node.querySelector('input,select,button'))node.remove();});
                oldNetworkGrid.replaceWith(...oldNetworkGrid.childNodes);
                networkIdentity.querySelectorAll('.network-grid').forEach(node=>node.remove());
            }
            const reservation=networkIdentity.querySelector('#dev-ip-reserved');
            const reservationLabel=reservation?.parentElement;
            if(reservationLabel){
                reservationLabel.className='device-review-checkbox';reservation.className='';
                const copy=reservationLabel.querySelector('span');
                copy.className='';copy.replaceChildren(document.createTextNode('Reserve this IP address for this device'));
                const help=document.createElement('small');help.textContent='The same IP is linked to the device and shown as Reserved in IPAM; no second address is needed.';copy.append(help);
            }
            networkingGrid.appendChild(networkIdentity);
            const guidance=document.createElement('section');
            guidance.className='device-review-panel full';
            guidance.innerHTML='<h3><span class="mini-icon" aria-hidden="true">▣</span>Subnet Guidance</h3>'
                +'<p>Missing the required subnet?</p>';
            const hint=document.createElement('div');
            hint.className='device-review-hint';
            hint.textContent=guidanceText;
            guidance.appendChild(hint);
            const createSubnet=networkIdentity.querySelector('[data-action="create-subnet-from-device"]');
            if(createSubnet)guidance.appendChild(createSubnet);
            networkingGrid.appendChild(guidance);
            panels.get('networking').appendChild(networkingGrid);
            // Notes is a full-width card in the same source grid as the other tabs.
            // Move, rather than copy, the editor so Markdown preview and save handlers survive.
            const notesGrid = document.createElement('div');
            notesGrid.className = 'device-review-grid';
            sections[4].classList.add('full');
            notesGrid.appendChild(sections[4]);
            panels.get('notes').appendChild(notesGrid);
            // Move existing field nodes rather than cloning controls, preserving IDs and handlers.
            const status = form.querySelector('#dev-status');
            const statusRow = status?.closest('div');
            if (statusRow && status?.type !== 'hidden') {
                sections[0].appendChild(statusRow);
            } else if (status?.type === 'hidden') {
                // New devices still need the hidden Active status value submitted.
                sections[0].appendChild(status);
            }
            const location = form.querySelector('#dev-location');
            const locationRow = location?.parentElement;
            if (locationRow && locationRow.contains(form.querySelector('#dev-custom-location'))) {
                // The source puts Location Area inside Device Identity, not in
                // Mounting or a separate card. Keep native location validation.
                sections[0].appendChild(locationRow);
                locationRow.classList.add('device-review-field');
                const locationActions = document.createElement('div');
                locationActions.className = 'device-review-catalogue-actions';
                const addLocation = document.createElement('button');
                addLocation.type = 'button';
                addLocation.className = 'device-review-smallbtn';
                addLocation.textContent = '+ Add Location';
                addLocation.addEventListener('click', () => {
                    const locationSelect = form.querySelector('#dev-location');
                    if (!locationSelect) return;
                    locationSelect.value = '__caffoot_create_location__';
                    locationSelect.dispatchEvent(new Event('change', {bubbles:true}));
                });
                locationActions.appendChild(addLocation);
                locationRow.appendChild(locationActions);
            }
            // Preserve every original field, but use the approved card headings
            // and field grids rather than the old free-form section layout.
            const identityHeading = sections[0].querySelector(':scope > .form-section-heading');
            const identityTitle = document.createElement('h3');
            identityTitle.innerHTML = '<span class="mini-icon" aria-hidden="true">▣</span>Device Identity';
            const identitySubtitle = document.createElement('p');
            identitySubtitle.textContent = 'Name, classification and deployment';
            identityHeading?.replaceWith(identityTitle, identitySubtitle);
            const identityFields = document.createElement('div');
            identityFields.className = 'device-review-form-grid';
            Array.from(sections[0].children).forEach(child => {
                if (child === identityTitle || child === identitySubtitle ||
                    (child.id === 'dev-status' && child.type === 'hidden')) return;
                if (child.tagName === 'DIV') child.classList.add('device-review-field');
                identityFields.appendChild(child);
            });
            const deployment=identityFields.querySelector('#dev-deployment')?.parentElement;
            let previousClassification=deployment;
            for(const [id,kind] of [['device-form-physical-purpose','physical'],['device-form-vm-purpose-wrapper','virtual']]){
                const classification=identityFields.querySelector('#'+id);
                if(!classification||!previousClassification)continue;
                classification.classList.remove('mt-2','device-review-field');
                classification.classList.add('device-'+kind+'-type');
                const field=document.createElement('div');field.className='device-review-field';
                field.append(...classification.childNodes);classification.append(field);
                previousClassification.after(classification);previousClassification=classification;
            }
            if(form.dataset.deviceId&&deployment){
                // Show the source grid while retaining the existing classification lock.
                deployment.classList.remove('hidden');
                deployment.querySelector('select').disabled=true;
                identityFields.querySelectorAll('#dev-type,#dev-vm-purpose').forEach(select=>{select.disabled=true;});
                deployment.querySelector('label').textContent='Deployment';
                identityFields.querySelector('#device-form-physical-purpose')?.classList.toggle('hidden',isVirtualDevice);
                identityFields.querySelector('#device-form-vm-purpose-wrapper')?.classList.toggle('hidden',!isVirtualDevice);

                identityFields.querySelector('p.text-sm.font-semibold')?.remove();
            }
            if(deployment&&!deployment.querySelector(':scope > small')){
                const help=document.createElement('small');
                help.textContent=form.dataset.deviceId?'Existing deployment is not changed by editing.':'VMs can only be created when an eligible physical hypervisor exists.';
                deployment.appendChild(help);
            }
            if(locationRow)locationRow.dataset.deviceEditorLocation='';
            const locationActions=locationRow?.querySelector('.device-review-catalogue-actions');
            if(locationActions){
                locationActions.dataset.deviceEditorLocation='';
                locationActions.style.margin='0 0 2px';
                identityFields.appendChild(locationActions);
            }
            const locationPanel=locationRow?.querySelector('#dev-create-location-panel');
            if(locationPanel){
                locationPanel.className='device-review-inline-create';
                const title=document.createElement('h4');title.textContent='Add Location without leaving the device form';
                const label=locationPanel.querySelector('label');
                const input=locationPanel.querySelector('input');
                const buttons=[...locationPanel.querySelectorAll('button')];
                const field=document.createElement('div');field.className='device-review-field';
                const row=document.createElement('div');row.className='device-review-inline-add-actions';
                const actions=document.createElement('div');actions.className='device-review-catalogue-actions';
                if(label&&input){label.className='';label.textContent='Location name';input.className='';input.placeholder='Enter location name';input.maxLength=100;field.append(label,input);row.append(field);}
                buttons.forEach((button,index)=>{button.className='device-review-smallbtn'+(index===0?' primary':'');if(index===0)button.textContent='Add & Select';actions.append(button);});
                locationPanel.replaceChildren(title,row,actions);
                identityFields.appendChild(locationPanel);
            }
            const statusField=identityFields.querySelector('#dev-status')?.parentElement;
            if(statusField&&statusField!==identityFields){
                const previousHelp=statusField.querySelector('p');
                if(previousHelp){const help=document.createElement('small');help.textContent='Retiring a device does not automatically release its IP or rack position.';previousHelp.replaceWith(help);}
                identityFields.appendChild(statusField);
            }
            sections[0].appendChild(identityFields);
            const mountingHeading = sections[2].querySelector(':scope > .form-section-heading');
            const mountingTitle = document.createElement('h3');
            mountingTitle.innerHTML = '<span class="mini-icon" aria-hidden="true">▣</span>Mounting & Rack Configuration';
            const mountingSubtitle = document.createElement('p');
            mountingSubtitle.textContent = 'Rack placement uses the existing Front/Rear, U height and collision checks in v2.0.1.';
            mountingHeading?.replaceWith(mountingTitle, mountingSubtitle);
            const mountingFields = document.createElement('div');
            mountingFields.className = 'device-review-form-grid';
            Array.from(sections[2].children).forEach(child => {
                if (child === mountingTitle || child === mountingSubtitle) return;
                mountingFields.appendChild(child);
            });
            const rackFields=mountingFields.querySelector('#racked-options');
            rackFields?.querySelector(':scope > .block')?.remove();
            const createRack=rackFields?.querySelector('[data-action="create-rack-from-device"]');
            if(createRack){
                createRack.className='device-review-smallbtn';
                const actions=document.createElement('div');actions.className='device-review-catalogue-actions';
                actions.style.gridColumn='1 / -1';
                const help=createRack.parentElement.querySelector('.device-help');
                if(help){help.className='device-review-hint';help.style.gridColumn='1 / -1';rackFields.append(help);}
                createRack.textContent='+ Create Network Rack';
                createRack.className='device-review-smallbtn';
                actions.append(createRack);rackFields.append(actions);
            }
            sections[2].appendChild(mountingFields);
            const mountingHint = document.createElement('div');
            mountingHint.className = 'device-review-hint';
            mountingHint.style.marginTop='15px';
            mountingHint.textContent = 'End U is calculated from Start U + U Height - 1. Conflicting or out-of-range positions must still be rejected in the live application.';
            sections[2].appendChild(mountingHint);
            const hardwareHeading = sections[1].querySelector(':scope > .form-section-heading');
            const hardwareTitle = document.createElement('h3');
            hardwareTitle.innerHTML = '<span class="mini-icon" aria-hidden="true">▣</span>Hardware & Lifecycle';
            const hardwareSubtitle = document.createElement('p');
            hardwareSubtitle.textContent = 'Physical devices only. This entire tab is hidden for virtual machines.';
            hardwareHeading?.replaceWith(hardwareTitle, hardwareSubtitle);
            const notesHeading = sections[4].querySelector(':scope > .form-section-heading');
            if (notesHeading) {
                const title = document.createElement('h3');
                title.innerHTML = '<span class="mini-icon" aria-hidden="true">▣</span>Notes / Details';
                const subtitle = document.createElement('p');
                subtitle.textContent = 'The real application retains the existing notes editor and formatting controls.';
                sections[4].querySelector(':scope > .device-review-sub')?.remove();
                notesHeading.replaceWith(title, subtitle);
            }
            panels.get('notes').dataset.notesPanel = 'true';
            initialiseNotesEditor(form);
            const softwareGrid = document.createElement('div');
            softwareGrid.className = 'device-review-grid';
            panels.get('software').appendChild(softwareGrid);
            const platformContainer = document.createElement('div');
            platformContainer.innerHTML = renderSoftwarePlatformFields(form.querySelector('#dev-type')?.value || '', deviceDetailFormValues);
            softwareGrid.appendChild(platformContainer.firstElementChild);
            // The owner places the one physical-host setup immediately beneath Device Type.
            const hostingFields = sections[0].querySelector('#host-platform-fields');
            if(hostingFields){
                hostingFields.className='device-editor-hosting wide';
                hostingFields.querySelector(':scope > p')?.remove();
                const typeField=identityFields.querySelector('#device-form-physical-purpose');
                typeField.after(hostingFields);
                const checkbox=hostingFields.querySelector('#device-hosting-enabled');
                const label=checkbox.closest('label');label.className='device-review-checkbox';checkbox.className='';
                const text=label.querySelector('span');text.replaceChildren(document.createTextNode('This physical server hosts virtual machines'));
                const help=document.createElement('small');help.textContent='Hosted VMs remain linked to their physical host.';text.append(help);
                const config=hostingFields.querySelector('#device-hosting-details');
                config.className='device-review-form-grid';
                config.querySelector(':scope > p')?.remove();
                for(const [id,title] of [['host-platform-select','Hypervisor Software/OS'],['host-version','Version']]){
                    const control=config.querySelector('#'+id),oldLabel=config.querySelector('label[for="'+(id==='host-platform-select'?'host-platform':id)+'"]');
                    const field=document.createElement('div');field.className='device-review-field';oldLabel.htmlFor=id;oldLabel.textContent=title;oldLabel.className='';field.append(oldLabel);
                    if(id==='host-platform-select')field.append(control,config.querySelector('#host-platform'));
                    else{
                        const select=document.createElement('select');select.id='host-version-select';select.setAttribute('aria-label','Hypervisor Version');
                        control.setAttribute('aria-label','Custom Hypervisor Version');field.append(select,control);
                        select.addEventListener('change',()=>{control.hidden=select.value!=='__custom__';control.value=control.hidden?select.value:'';if(!control.hidden)control.focus();});
                    }
                    config.append(field);
                }
                refreshDeviceEditorHostVersionChoices();
            }
            bindSoftwarePlatformFields();
            syncHostingFieldVisibility();
            // Existing manager buttons and checkbox data stay on their original DOM nodes.
            const hardwareDetails = form.querySelector('#details-section');
            if (hardwareDetails) {
                // Keep type-specific fields inside Hardware & Lifecycle, without a second card.
                hardwareDetails.classList.remove('form-section-card','space-y-4');
                hardwareDetails.querySelector(':scope > .form-section-heading')?.remove();
                const managers = hardwareDetails.querySelector('.flex.flex-wrap.gap-2');
                const type = form.querySelector('#dev-type')?.value || '';
                const group = deviceTypeDetailGroups[String(type||'').toLowerCase().trim()];
                const servicesSection = document.createElement('div');
                servicesSection.id = 'server-services-section';
                servicesSection.className = 'device-review-panel';
                servicesSection.innerHTML = renderInterfaceTemplate("devices/initialise-device-tabs-1",[]);
                const installedSection = document.createElement('div');
                installedSection.id = 'device-form-installed-software-section';
                installedSection.className = 'device-review-panel';
                installedSection.innerHTML = renderInterfaceTemplate("devices/initialise-device-tabs-2",[]);
                if (managers) {
                    const servicesManager = managers.querySelector('#manage-server-services-button');
                    const softwareManager = managers.querySelector('#manage-installed-software-button');
                    if (servicesManager) {
                        servicesManager.className = 'device-review-smallbtn' + (servicesManager.classList.contains('hidden') ? ' hidden' : '');
                        servicesManager.textContent = 'Manage Server Services';
                        servicesSection.insertBefore(servicesManager, servicesSection.querySelector('#server-services-fields'));
                    }
                    if (softwareManager) {
                        softwareManager.className = 'device-review-smallbtn' + (softwareManager.classList.contains('hidden') ? ' hidden' : '');
                        softwareManager.textContent = 'Manage Installed Software';
                        installedSection.insertBefore(softwareManager, installedSection.querySelector('#device-form-installed-software-fields'));
                    }
                }
                const serviceWrapper=document.createElement('div');serviceWrapper.className='device-server-services';serviceWrapper.append(servicesSection);
                softwareGrid.append(installedSection,serviceWrapper);
                servicesSection.querySelector('#server-services-fields').innerHTML = renderInlineDevicePicker('services', type, deviceDetailFormValues);
                installedSection.querySelector('#device-form-installed-software-fields').innerHTML = renderInlineDevicePicker('software', type, deviceDetailFormValues);
                servicesSection.classList.toggle('hidden', group !== 'server');serviceWrapper.hidden=group!=='server';
                installedSection.classList.remove('hidden');
                hardwareDetails.classList.toggle('hidden', !getDetailFieldsForDeviceType(type).some(key => !isSoftwareDetailField(key)));
            }
            let active = form.dataset.initialDeviceTab || 'general';
            function activate(id, focusButton = false) {
                if (!panels.has(id)) return;
                active = id;
                const body=form.closest('.device-review-body');
                if(body)body.scrollTop=0;
                form.dataset.activeDeviceTab = id;
                form.closest('.device-editor-dialog')?.classList.toggle('device-editor-notes',id==='notes');
                labels.forEach(([key]) => {
                    const selected = key === id;
                    buttons.get(key).setAttribute('aria-selected', String(selected));
                    buttons.get(key).tabIndex = selected ? 0 : -1;
                    panels.get(key).hidden = !selected;
                });
                if (focusButton) buttons.get(id).focus();
            }
            labels.forEach(([id], index) => {
                const button = buttons.get(id);
                button.addEventListener('click', () => activate(id));
                button.addEventListener('keydown', event => {
                    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
                    if (!keys.includes(event.key)) return;
                    event.preventDefault();
                    const visibleTabs = labels.map(([key]) => key).filter(key => !buttons.get(key).hidden);
                    const current = visibleTabs.indexOf(id);
                    let next = current;
                    if (event.key === 'ArrowRight') next = (current + 1) % visibleTabs.length;
                    if (event.key === 'ArrowLeft') next = (current + visibleTabs.length - 1) % visibleTabs.length;
                    if (event.key === 'Home') next = 0;
                    if (event.key === 'End') next = visibleTabs.length - 1;
                    activate(visibleTabs[next], true);
                });
            });
            // Native constraint validation needs the invalid control's panel visible.
            form.addEventListener('invalid', event => {
                if(form.id==='device-editor-form')return;
                const panel = event.target.closest('.device-form-panel');
                if (panel && panel.hidden) {
                    const id = labels.find(([key]) => panels.get(key) === panel)?.[0];
                    if (id) activate(id);
                }
            }, true);
            // Field labels use the pinned form's typography rather than legacy utility classes.
            form.querySelectorAll('.device-review-field label').forEach(label=>{label.className='';});
            form.querySelector('label[for="dev-mount-type"] .required-mark')?.remove();
            activate(active);
            // Use the approved dialog's fixed header/footer and scrolling body.
            const dialog = form.closest('.device-review-dialog');
            if (dialog) {
                const sourceLabels={'dev-manufacturer-select':'Manufacturer','dev-model-select':'Model','dev-serial':'Serial number','dev-ip':'Primary IP Address','dev-vmVcpu':'vCPUs','dev-virtual-host':'Physical Hypervisor Host'};
                for(const [id,text] of Object.entries(sourceLabels)){
                    const label=form.querySelector('label[for="'+id+'"]');
                    if(label){label.textContent=text;if(form.querySelector('#'+id)?.required){const mark=document.createElement('span');mark.className='required-mark';mark.textContent=' *';label.append(mark);}}
                    if(id==='dev-virtual-host'){const help=document.createElement('small');help.textContent='Required for new virtual machines; existing legacy assignments are preserved.';label.parentElement.append(help);}
                }
                form.id = 'device-editor-form';
                form.dataset.originalPlatform=String(deviceDetailFormValues.softwarePlatform??'');
                dialog.classList.add('device-editor-dialog');
                dialog.querySelector('.device-review-head').append(nav);
                const body = document.createElement('div');
                body.className = 'device-review-body';
                form.before(body);
                body.append(form);
                const footer = form.querySelector('.form-actions');
                if (footer) {
                    footer.className = 'device-review-footer';
                    const feedback=form.querySelector('[data-form-error]');
                    if(feedback){feedback.dataset.deviceEditorFeedback='';feedback.classList.add('device-editor-feedback');feedback.hidden=true;dialog.append(feedback);}
                    if(form.dataset.deviceId||form.dataset.duplicateSourceId){
                        const back=footer.querySelector('[data-action="close-modal"]');
                        back.textContent='Back to Details';back.dataset.action='device-editor-back';back.dataset.id=form.dataset.deviceId||form.dataset.duplicateSourceId;
                    }

                    footer.querySelector('button[type="submit"]').setAttribute('form', form.id);
                    dialog.append(footer);
                }
                initialiseDeviceShelfFields(form);
                bindDeviceEditorValidation(form);
                dialog.classList.toggle('device-editor-notes',active==='notes');
            }
        }

        function openDeviceModal(deviceId = null) {
            const device = deviceId ? appState.devices.find(d => d.id === deviceId) : null;
            const draft = deviceFormDraft && (!deviceId || deviceFormDraft.deviceId === deviceId) ? deviceFormDraft : null;
            const isDuplicate = !deviceId && !!draft?.duplicatedFrom;
            deviceFormDraft = null;
            const types = getUniqueDeviceTypes();
            const locations = getUniqueDeviceLocations();
            const currentType = draft?.type ?? device?.type ?? '';
            const hasEligiblePhysicalHost = appState.devices.some(d => d.type === 'Server - Physical' && d.status !== 'Retired' && (d.typeDetails?.serverService_Hypervisor === true || d.serverService_Hypervisor === true));
            // Keep legacy virtual types selectable when editing, even without a current host.
            const availableFormTypes = types.filter(t => t !== 'Server - Virtual');
            const isExistingVirtual = (draft?.isVirtual ?? device?.isVirtual) === true || currentType === 'Server - Virtual';
            const vmPurposes = [['Server','Server - Virtual'],['Desktop','Desktop'],['Firewall','Firewall'],['Router','Router'],['NAS','NAS'],['Wireless LAN Controller','Wireless LAN Controller']];
            deviceDetailFormValues = {...(draft?.typeDetails ?? device?.typeDetails ?? {})};
            const sourceRecord=device||(isDuplicate?getDeviceById(draft.duplicatedFrom):null);
            deviceEditorSoftwareSource=sourceRecord?JSON.parse(JSON.stringify(sourceRecord)):null;
            // Show known legacy OS data without inferring a hypervisor or changing an explicit blank.
            if(deviceDetailFormValues.softwarePlatform===undefined){
                const recordedPlatform=deviceDetailFormValues.os??sourceRecord?.os;
                if(typeof recordedPlatform==='string')deviceDetailFormValues.softwarePlatform=recordedPlatform;
            }
            // Copies inherit an explicit hosting flag, never eligibility merely because a draft exists.
            const sourceHostsVirtualMachines=sourceRecord?.typeDetails?.serverService_Hypervisor===true||sourceRecord?.serverService_Hypervisor===true;
            if(currentType==='Server - Physical'&&sourceHostsVirtualMachines&&
                (!draft||draft.typeDetails?.serverService_Hypervisor===undefined)){
                deviceDetailFormValues.serverService_Hypervisor=true;
            }
            const currentLoc = draft?.location ?? device?.location ?? '';
            const requestedMountType = isExistingVirtual ? 'Not Applicable' : (draft?.mountType ?? device?.mountType ?? (device?.rackId ? 'Rack Mounted' : getDefaultMountType(currentType)));
            const mountType = getRecognisedDeviceMountTypes(currentType).includes(requestedMountType) ? requestedMountType : getDefaultMountType(currentType);
            const currentSubnet = draft?.subnetId ? appState.subnets.find(s => s.id === draft.subnetId) : (device?.primaryIp ? getSubnetForIp(device.primaryIp) : null);
            const currentHeight = draft?.rackUHeight || (device?.rackUStart && device?.rackUEnd ? Math.max(1, Number(device.rackUEnd) - Number(device.rackUStart) + 1) : 1);
            const retainedHostId = draft?.virtualHostId ?? device?.virtualHostId ?? '';
            const missingLegacyHost = device && isExistingVirtual && retainedHostId && retainedHostId===device.virtualHostId &&
                !appState.devices.some(host=>host.id===retainedHostId&&host.type==='Server - Physical');
            openDeviceReviewModal(renderInterfaceTemplate("device-details/open-device-modal-5",[device ? 'Edit Device' : isDuplicate ? 'Duplicate Device' : 'Add New Device',device ? escapeHtml(device.name)+' · Existing device details' : isDuplicate ? 'Enter a unique name and IP. The original device is unchanged.' : 'Configure a physical device or VM with the existing Caffoot fields.','',escapeHtml(device?.id || draft?.deviceId || ''),escapeHtml(draft?.name ?? device?.name ?? ''),device ? 'hidden' : '',!isExistingVirtual?'selected':'',hasEligiblePhysicalHost||isExistingVirtual?`<option value="virtual" ${isExistingVirtual?'selected':''}>Virtual Machine (VM)</option>`:'',isExistingVirtual || device ? 'hidden' : '',currentType === '' ? 'selected' : '',availableFormTypes.map(t => `<option value="${escapeHtml(t)}" ${currentType === t ? 'selected' : ''}>${escapeHtml(t === 'Server - Physical' ? 'Server' : t)}</option>`).join(''),currentType==='Server - Virtual'?'selected':'',isExistingVirtual && !device ? '' : 'hidden',vmPurposes.map(([label,value])=>`<option value="${escapeHtml(value)}" ${currentType===value?'selected':''}>${escapeHtml(label)}</option>`).join(''),device ? renderInterfaceTemplate("device-details/open-device-modal-2",[escapeHtml(isExistingVirtual ? 'Virtual ' : 'Physical '),escapeHtml(currentType === 'Server - Virtual' || currentType === 'Server - Physical' ? 'Server' : currentType)]) : '',['','VMware ESXi','Proxmox VE','Microsoft Hyper-V','KVM','XCP-ng','Other'].map(x=>'<option value="'+escapeHtml(x)+'" '+((draft?.virtualPlatform ?? device?.virtualPlatform ?? '')===x?'selected':'')+'>'+escapeHtml(x||'Select Platform...')+'</option>').join(''),device?.type === 'Server - Virtual' ? '(legacy assignments preserved)' : '(required)',appState.devices.filter(x=>x.id!==(device?.id||'')&&x.type==='Server - Physical'&&((x.status!=='Retired'&&(x.typeDetails?.serverService_Hypervisor===true||x.serverService_Hypervisor===true))||x.id===(draft?.virtualHostId??device?.virtualHostId??''))).map(x=>'<option value="'+escapeHtml(x.id)+'" '+((draft?.virtualHostId ?? device?.virtualHostId ?? '')===x.id?'selected':'')+'>'+escapeHtml(x.name)+(x.status==='Retired'||!(x.typeDetails?.serverService_Hypervisor===true||x.serverService_Hypervisor===true)?' (existing legacy assignment)':'')+'</option>').join('')+(missingLegacyHost?'<option value="'+escapeHtml(retainedHostId)+'" selected>Missing or legacy host (retained)</option>':''),[['vmVcpu','vCPU count'],['vmRamGb','Allocated RAM (GB)'],['vmDiskGb','Virtual disk (GB)'],['vmNicCount','Virtual network adapters']].map(([key,label])=>renderInterfaceTemplate("device-details/open-device-modal-3",[key,label,key,key,escapeHtml(deviceDetailFormValues[key] ?? '')])).join(''),deviceDetailFormValues.serverService_Hypervisor === true ? 'checked' : '',deviceDetailFormValues.serverService_Hypervisor === true ? '' : 'hidden',['VMware ESXi','Proxmox VE','Microsoft Hyper-V','KVM','XCP-ng'].map(p=>`<option value="${escapeHtml(p)}" ${deviceDetailFormValues.hypervisorProduct===p?'selected':''}>${escapeHtml(p)}</option>`).join(''),deviceDetailFormValues.hypervisorProduct && !['VMware ESXi','Proxmox VE','Microsoft Hyper-V','KVM','XCP-ng'].includes(deviceDetailFormValues.hypervisorProduct)?'selected':'',escapeHtml(deviceDetailFormValues.hypervisorProduct || ''),deviceDetailFormValues.hypervisorProduct && !['VMware ESXi','Proxmox VE','Microsoft Hyper-V','KVM','XCP-ng'].includes(deviceDetailFormValues.hypervisorProduct)?'':'hidden',escapeHtml(deviceDetailFormValues.hypervisorVersion || ''),device ? renderInterfaceTemplate("device-details/open-device-modal-4",[['Active','Maintenance','Retired'].map(v=>`<option value="${v}" ${(draft?.status ?? device?.status ?? 'Active')===v?'selected':''}>${v}</option>`).join('')]) : '<input type="hidden" id="dev-status" value="Active">',escapeHtml(draft?.manufacturer ?? device?.manufacturer ?? ''),escapeHtml(draft?.model ?? device?.model ?? ''),escapeHtml(draft?.serialNumber ?? device?.serialNumber ?? ''),renderInlineHardwareQuickAdd("manufacturer"),renderInlineHardwareQuickAdd("model"),getDetailFieldsForDeviceType(currentType).length===0?'hidden':'',deviceTypeDetailGroups[String(currentType||'').toLowerCase().trim()]==='server'?'':'hidden',['server','computer'].includes(deviceTypeDetailGroups[String(currentType||'').toLowerCase().trim()])?'':'hidden',renderDeviceDetailFields(currentType,deviceDetailFormValues,'hardware'),renderDeviceMountOptions(currentType,mountType),escapeHtml(currentLoc),currentLoc === '' ? 'selected' : '',locations.map(l => `<option value="${escapeHtml(l)}" ${currentLoc === l ? 'selected' : ''}>${escapeHtml(l)}</option>`).join(''),mountType === 'Rack Mounted' ? '' : 'hidden',mountType === 'Rack Mounted' ? '' : 'hidden',!appState.racks.length ? 'selected' : '',appState.racks.length ? 'Select a network rack...' : 'No network racks created yet',appState.racks.map(r => `<option value="${escapeHtml(r.id)}" ${(draft?.rackId ?? device?.rackId) === r.id ? 'selected' : ''}>${escapeHtml(r.name)}</option>`).join(''),(draft?.face ?? device?.face) !== 'rear' ? 'selected' : '',(draft?.face ?? device?.face) === 'rear' ? 'selected' : '',escapeHtml(String(draft?.rackUStart ?? device?.rackUStart ?? 1)),currentHeight,appState.subnets.filter(s => s.kind === 'container').map(b => `<option value="${escapeHtml(b.id)}" ${currentSubnet && getDeviceSubnetTopLevelBlock(currentSubnet)?.id === b.id ? 'selected' : ''}>${escapeHtml(b.name || b.cidr)}</option>`).join(''),currentSubnet && !getDeviceSubnetTopLevelBlock(currentSubnet) ? 'selected' : '',escapeHtml(currentSubnet?.id || ''),escapeHtml(draft?.primaryIp ?? device?.primaryIp ?? ''),(draft?.ipReserved ?? device?.ipReserved ?? (device?.primaryIp && appState.ipAllocations[device.primaryIp]?.status === 'Reserved')) ? 'checked' : '',escapeHtml(draft?.notes ?? device?.notes ?? '')]));
            const tabbedDeviceForm = document.querySelector('[data-device-form="true"]');
            if(tabbedDeviceForm&&isDuplicate)tabbedDeviceForm.dataset.duplicateSourceId=draft.duplicatedFrom;
            if (tabbedDeviceForm && draft?.activeDeviceTab) tabbedDeviceForm.dataset.initialDeviceTab = draft.activeDeviceTab;
            tabbedDeviceForm.dataset.rackShelfAccessoryId=String(draft?.rackShelfAccessoryId??device?.rackShelfAccessoryId??'');
            tabbedDeviceForm.dataset.locationManuallyOverridden=String(!!draft?.locationManuallyOverridden);
            tabbedDeviceForm.dataset.locationRackId=draft?.locationRackId??draft?.rackId??device?.rackId??'';
            initialiseDeviceTabs(tabbedDeviceForm);
            document.getElementById('dev-location')?.addEventListener('change',()=>{tabbedDeviceForm.dataset.locationManuallyOverridden='true';});
            if(draft?.rackId)defaultDeviceLocationFromRack(draft.rackId);
            const deviceTypeSelectElement=document.getElementById('dev-type');
            const deploymentSelect=document.getElementById('dev-deployment');
            const purposeSelect=document.getElementById('dev-vm-purpose');
            const syncVmPurpose=()=>{
                const virtual=deploymentSelect.value==='virtual';
                document.getElementById('device-form-physical-purpose')?.classList.toggle('hidden',virtual);
                document.getElementById('device-form-vm-purpose-wrapper')?.classList.toggle('hidden',!virtual);
                if(virtual) deviceTypeSelectElement.value=purposeSelect.value;
                else if(deviceTypeSelectElement.value==='Server - Virtual') deviceTypeSelectElement.value='Server - Physical';
                // A hidden purpose must never leave the physical type unselected.
                if(!virtual && !deviceTypeSelectElement.value) deviceTypeSelectElement.value='Server - Physical';
                refreshDeviceEditorContext();
            };
            deploymentSelect?.addEventListener('change',syncVmPurpose);
            purposeSelect?.addEventListener('change',syncVmPurpose);
            if(deviceTypeSelectElement) {
                deviceTypeSelectElement.addEventListener('change',refreshDeviceEditorContext);
                deviceTypeSelectElement.addEventListener('input',refreshDeviceEditorContext);
            }
            ['manufacturer','model'].forEach(kind=>{
                document.getElementById('dev-'+kind+'-select')?.addEventListener('change',()=>handleHardwareSelectionChange(kind));
                document.getElementById('dev-'+kind+'-custom')?.addEventListener('input',event=>{
                    document.getElementById('dev-'+kind).value=event.target.value;
                    if(kind==='manufacturer')refreshHardwareSuggestions();
                });
            });
            refreshHardwareSuggestions();
            document.getElementById('device-hosting-enabled')?.addEventListener('change', syncHostingFieldVisibility);
            document.getElementById('host-platform-select')?.addEventListener('change', event => {
                const input = document.getElementById('host-platform');
                if (!input) return;
                const previousProduct=input.value;
                const custom = event.target.value === '__custom__';
                input.classList.toggle('hidden', !custom);
                input.value = custom ? (['VMware ESXi','Proxmox VE','Microsoft Hyper-V','KVM','XCP-ng'].includes(input.value) ? '' : input.value) : event.target.value;
                if(previousProduct!==input.value){document.getElementById('host-version').value='';deviceDetailFormValues.hypervisorVersion='';}
                if (custom) input.focus();
                refreshDeviceSoftwareSuggestions();
                // Update the chosen product before building its versions, including native keyboard changes.
                refreshDeviceEditorHostVersionChoices();
            });
            document.getElementById('host-platform')?.addEventListener('input',event=>{
                if(event.target.value!==deviceDetailFormValues.hypervisorProduct){
                    document.getElementById('host-version').value='';deviceDetailFormValues.hypervisorVersion='';
                }
                refreshDeviceSoftwareSuggestions();refreshDeviceEditorHostVersionChoices();
            });
            syncHostingFieldVisibility();
            if(draft?.subnetBlock!==undefined)document.getElementById('dev-block').dataset.restoredFilter=draft.subnetBlock;
            refreshDeviceSubnetSelectionCascade('initial');
            refreshDeviceIpOptions();
            if(draft?.editorWarning)showDeviceEditorFeedback(draft.editorWarning,'dev-mount-type');
            ['dev-rack-id', 'dev-rack-height', 'dev-rack-face'].forEach(id => {
                const field = document.getElementById(id);
                field?.addEventListener('change', updateDeviceRackLimits);
                field?.addEventListener('input', updateDeviceRackLimits);
                if(id==='dev-rack-id')field?.addEventListener('change',()=>defaultDeviceLocationFromRack(field.value));
            });
            updateDeviceRackLimits();
            updateDeviceMountChoices();
            updateVirtualHardwareFieldVisibility();
            rememberModalForm();
            const deviceForm = document.querySelector('[data-device-form="true"]');
            if (deviceForm) {
                const clearFieldError = event => {
                    const field = event.target;
                    if (field && field.matches('input,select')) {
                        field.classList.remove('device-form-invalid-field');
                        field.removeAttribute('aria-invalid');
                    }
                };
                deviceForm.addEventListener('input', clearFieldError);
                deviceForm.addEventListener('change', clearFieldError);
                deviceForm.addEventListener('invalid', event => {
                    const field = event.target;
                    field.classList.add('device-form-invalid-field');
                    field.setAttribute('aria-invalid', 'true');
                    const error = deviceForm.querySelector('[data-form-error]');
                    if (error) { error.textContent = 'Please complete the highlighted required field before saving.'; error.classList.add('is-visible'); }
                }, true);
            }
        }

        function captureDeviceFormDraft() {
            const form = document.querySelector('[data-device-form="true"]');
            if (!form) return null;
            return {
                deviceId: form.dataset.deviceId || null,
                duplicatedFrom: form.dataset.duplicateSourceId || null,
                activeDeviceTab: form.dataset.activeDeviceTab || 'general',
                name: document.getElementById('dev-name')?.value || '',
                type: document.getElementById('dev-type')?.value || '',
                isVirtual: isVirtualDeviceForm(),
                mountType: document.getElementById('dev-mount-type')?.value || '',
                location: document.getElementById('dev-location')?.value || '',
                locationManuallyOverridden: form.dataset.locationManuallyOverridden==='true',
                locationRackId: form.dataset.locationRackId||'',
                rackId: document.getElementById('dev-mount-type')?.value==='Tabletop / Shelf Mounted' ? document.getElementById('dev-shelf-rack')?.value||'' : document.getElementById('dev-rack-id')?.value||'',
                rackShelfAccessoryId: document.getElementById('dev-mount-type')?.value==='Tabletop / Shelf Mounted' ? document.getElementById('dev-rack-shelf')?.value||'' : '',
                face: document.getElementById('dev-rack-face')?.value || 'front',
                rackUStart: parseInt(document.getElementById('dev-rack-u')?.value || '', 10) || null,
                rackUHeight: parseInt(document.getElementById('dev-rack-height')?.value || '', 10) || null,
                subnetId: document.getElementById('dev-subnet')?.value || '',
                subnetBlock:document.getElementById('dev-block')?.value||'',
                primaryIp: document.getElementById('dev-ip')?.value || '',
                ipReserved: !!document.getElementById('dev-ip-reserved')?.checked,
                status: document.getElementById('dev-status')?.value || 'Active',
                manufacturer: document.getElementById('dev-manufacturer')?.value || '',
                model: document.getElementById('dev-model')?.value || '',
                virtualPlatform: document.getElementById('dev-virtual-platform')?.value || '',
                virtualHostId: document.getElementById('dev-virtual-host')?.value || '',
                serialNumber: document.getElementById('dev-serial')?.value || '',
                typeDetails: captureDeviceDetailFieldValues(),
                notes: document.getElementById('dev-notes')?.value || ''
            };
        }

        let deviceRackReturnPending = false;
        function createRackFromDevice() {
            const draft = captureDeviceFormDraft();
            if (!draft) return showToast('Unable to preserve device details.', 'error');
            deviceFormDraft = draft;
            deviceRackReturnPending = true;
            closeModal(true);
            openRackModal();
        }
        function cancelRackFromDevice() {
            if (!deviceRackReturnPending) { closeModal(); return; }
            const draft = deviceFormDraft;
            closeModal(false, () => {
                deviceRackReturnPending = false;
                switchTab('devices');
                setTimeout(() => openDeviceModal(draft?.deviceId || null), 0);
            });
        }

        function createSubnetFromDevice() {
            deviceFormDraft = captureDeviceFormDraft();
            if (!deviceFormDraft) {
                showToast('Unable to preserve the device form. Please reopen the form.', 'error');
                return;
            }
            // Draft has already been captured; do not prompt to discard it.
            closeModal(true);
            switchTab('ipam');
            setTimeout(() => openSubnetModal(), 0);
        }

        let previousDeviceLocationSelection = '';
        function handleDeviceLocationSelectionChange(select) {
            const panel = document.getElementById('dev-create-location-panel');
            if (!panel) return;
            if (select.value === '__caffoot_create_location__') {
                previousDeviceLocationSelection = select.dataset.previousLocation || '';
                panel.hidden = false;
                document.getElementById('dev-custom-location')?.focus();
                return;
            }
            previousDeviceLocationSelection = select.value;
            select.dataset.previousLocation = select.value;
            panel.hidden = true;
            // Rack mounting is controlled independently by the device mounting type.
        }
        function cancelCustomDeviceLocation() {
            const select = document.getElementById('dev-location');
            const panel = document.getElementById('dev-create-location-panel');
            if (!select || !panel) return;
            select.value = previousDeviceLocationSelection && Array.from(select.options).some(o => o.value === previousDeviceLocationSelection) ? previousDeviceLocationSelection : '';
            select.dataset.previousLocation = select.value;
            panel.hidden = true;
            const input = document.getElementById('dev-custom-location');
            if (input) input.value = '';
            refreshDeviceEditorDropdowns();
            // Rack mounting is controlled independently by the device mounting type.
        }
        async function addCustomLocationOption() {
            const input = document.getElementById('dev-custom-location');
            const select = document.getElementById('dev-location');
            if (!input || !select) return;
            const newVal = input.value.trim();
            if (!newVal) { showToast('Enter a location name first.', 'error'); input.focus(); return; }
            const existing = Array.from(select.options).find(o => o.value.toLowerCase() === newVal.toLowerCase());
            if (existing && existing.value !== '__caffoot_create_location__') {
                select.value = existing.value;
            } else {
                const opt = document.createElement('option');
                opt.value = newVal; opt.textContent = newVal;
                select.insertBefore(opt, select.querySelector('option[value="__caffoot_create_location__"]'));
                select.value = newVal;
                const before = JSON.stringify(appState);
                if (!Array.isArray(appState.deviceLocations)) appState.deviceLocations = [];
                if (!appState.deviceLocations.some(l => l.toLowerCase() === newVal.toLowerCase())) appState.deviceLocations.push(newVal);
                if (!await nextSettingsBridge.save('deviceLocations')) {
                    appState = JSON.parse(before);
                    opt.remove();
                    select.value = '__caffoot_create_location__';
                    showToast('Location was not saved. Please try again.', 'error');
                    input.focus();
                    return;
                }
                showToast(`Added location: ${newVal}`);
            }
            previousDeviceLocationSelection = select.value;
            select.dataset.previousLocation = select.value;
            document.getElementById('device-editor-form').dataset.locationManuallyOverridden='true';
            refreshDeviceEditorDropdowns();
            document.getElementById('dev-create-location-panel').hidden = true;
            input.value = '';
            // Rack mounting is controlled independently by the device mounting type.
        }

        // Only catalogue-recognised keys can be removed automatically; unknown legacy
        // and custom keys are retained so historical backups remain recoverable.
        // Only populated, recognised fields that are not valid for the destination
        // are archived. Unknown legacy fields remain untouched for backup compatibility.
        function findObsoleteDeviceFieldsForTypeChange(oldType, newType, details) {
            const known = new Set([...Object.values(deviceDetailFieldProfiles).flat(), ...legacySoftwareFieldKeys,
                ...legacyServerServiceFieldKeys, ...getAvailableServerServiceFieldKeys(),
                ...getConfiguredSoftwareCatalogueFieldKeys(), ...getAvailableSoftwareCatalogueEntries().map(item=>item.key),
                'softwarePlatform','softwareVersion','windowsLicence']);
            const allowed = new Set([...getDetailFieldsForDeviceType(newType),'os']);
            if (['computer','server'].includes(deviceTypeDetailGroups[String(newType||'').toLowerCase().trim()])) {
                allowed.add('softwarePlatform'); allowed.add('softwareVersion'); allowed.add('windowsLicence');
            }
            return Object.keys(details||{}).filter(key=>known.has(key)&&!allowed.has(key)&&
                details[key]!==''&&details[key]!==null&&details[key]!==undefined&&details[key]!==false);
        }
        function requestHypervisorGuestReassignment(hostName, guests, hostId) {
            if (document.getElementById('hypervisor-selection-dialog')) return Promise.resolve(null);
            return new Promise(resolve => {
                const candidates = appState.devices.filter(device =>
                    device.id !== hostId && device.type === 'Server - Physical' && device.status !== 'Retired' &&
                    (device.typeDetails?.serverService_Hypervisor === true || device.serverService_Hypervisor === true));
                const overlay = document.createElement('div');
                overlay.id = 'hypervisor-selection-dialog';
                overlay.setAttribute('role', 'dialog');
                overlay.setAttribute('aria-modal', 'true');
                overlay.setAttribute('aria-labelledby', 'hypervisor-selection-title');
                overlay.className = 'absolute inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 rounded-2xl';
                overlay.innerHTML = renderInterfaceTemplate("device-details/request-hypervisor-guest-reassignment-2",[escapeHtml(hostName),guests.map((guest,index)=>renderInterfaceTemplate("device-details/request-hypervisor-guest-reassignment-1",[index,escapeHtml(guest.name||guest.id),index,index,candidates.map(host=>'<option value="host:'+escapeHtml(host.id)+'">Reassign to '+escapeHtml(host.name||host.id)+'</option>').join('')])).join('')]);
                const content = document.getElementById('modal-content');
                if (content && !content.closest('.hidden')) {
                    if (getComputedStyle(content).position === 'static') content.style.position = 'relative';
                } else {
                    overlay.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 p-4';
                }
                const returnFocus = document.activeElement;
                const finish = value => { overlay.remove(); if (returnFocus?.isConnected) returnFocus.focus(); resolve(value); };
                overlay.addEventListener('click', event => {
                    const action = event.target.closest('[data-action]')?.dataset.action;
                    if (action === 'cancel') finish(null);
                    if (action !== 'confirm') return;
                    const choices = [...overlay.querySelectorAll('[data-m005-guest]')].map(el=>el.value);
                    if (choices.some(value=>!value)) return showToast('Choose an action for every virtual machine.', 'error');
                    if (choices.some(value=>value.startsWith('host:') && !candidates.some(host=>host.id===value.slice(5))))
                        return showToast('A selected destination host is no longer eligible.', 'error');
                    finish(choices);
                });
                overlay.addEventListener('keydown', event => {
                    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); finish(null); }
                    if (event.key === 'Tab') {
                        const controls = [...overlay.querySelectorAll('select,button')];
                        const index = controls.indexOf(document.activeElement);
                        if (event.shiftKey && index === 0) { event.preventDefault(); controls[controls.length-1].focus(); }
                        else if (!event.shiftKey && index === controls.length-1) { event.preventDefault(); controls[0].focus(); }
                    }
                });
                (content && !content.closest('.hidden') ? content : document.body).appendChild(overlay);
                overlay.querySelector('[data-action="cancel"]').focus();
            });
        }

        function confirmHypervisorPlatformChangeForGuests(hostName, guests, oldPlatform, newPlatform) {
            if (document.getElementById('platform-dialog')) return Promise.resolve(false);
            return new Promise(resolve => {
                const overlay = document.createElement('div');
                overlay.id = 'platform-dialog';
                overlay.setAttribute('role', 'alertdialog');
                overlay.setAttribute('aria-modal', 'true');
                overlay.setAttribute('aria-labelledby', 'device-platform-selection-title');
                overlay.className = 'absolute inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 rounded-2xl';
                overlay.innerHTML = renderInterfaceTemplate("device-details/confirm-hypervisor-platform-change-for-guests-1",[escapeHtml(hostName),escapeHtml(oldPlatform || 'Not specified'),escapeHtml(newPlatform || 'Not specified'),guests.map(guest=>'<li>'+escapeHtml(guest.name||guest.id)+' ('+escapeHtml(guest.virtualPlatform||'Not specified')+' → '+escapeHtml(newPlatform)+')</li>').join('')]);
                const content = document.getElementById('modal-content');
                if (!content) return resolve(false);
                if (getComputedStyle(content).position === 'static') content.style.position = 'relative';
                const returnFocus = document.activeElement;
                const finish = accepted => { overlay.remove(); if (returnFocus?.isConnected) returnFocus.focus(); resolve(accepted); };
                overlay.addEventListener('click', event => {
                    const action = event.target.closest('[data-action]')?.dataset.action;
                    if (action === 'cancel') finish(false);
                    if (action === 'confirm') finish(true);
                });
                overlay.addEventListener('keydown', event => {
                    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); finish(false); }
                    if (event.key === 'Tab') {
                        const controls = [...overlay.querySelectorAll('button')];
                        const index = controls.indexOf(document.activeElement);
                        if (event.shiftKey && index === 0) { event.preventDefault(); controls[controls.length-1].focus(); }
                        else if (!event.shiftKey && index === controls.length-1) { event.preventDefault(); controls[0].focus(); }
                    }
                });
                content.appendChild(overlay);
                overlay.querySelector('[data-action="cancel"]').focus();
            });
        }

        async function handleDeviceSubmit(e, deviceId) {
            e.preventDefault();
            const name = document.getElementById('dev-name').value.trim();
            const type = document.getElementById('dev-type').value;
            const isVirtualServer = isVirtualDeviceForm();
            const originalDevice = deviceId ? getDeviceById(deviceId) : null;
            const formPermissions = document.querySelector('[data-device-form="true"]')?.dataset || {};
            const ipamReadOnly = !!originalDevice && formPermissions.ipamReadOnly === 'true';
            const racksReadOnly = !!originalDevice && formPermissions.racksReadOnly === 'true';
            if (deviceId && !originalDevice) return showToast('Device no longer exists.', 'error');
            if (originalDevice && (type !== originalDevice.type || isVirtualServer !== (originalDevice.isVirtual === true || originalDevice.type === 'Server - Virtual'))) return showToast('Device identity cannot be changed. Create a new device instead.', 'error');
            if (isVirtualServer && !['Server - Virtual','Desktop','Firewall','Router','NAS','Wireless LAN Controller'].includes(type)) return showToast('Select a valid VM purpose.', 'error');
            const selectedHostId = document.getElementById('dev-virtual-host')?.value || '';
            const selectedHost = appState.devices.find(d => d.id === selectedHostId);
            // Physical placement is owned by the host, not by an individual VM.
            // Keep legacy location when its host no longer exists.
            const mountType = isVirtualServer ? 'Not Applicable' :
                racksReadOnly && (originalDevice.rackId || originalDevice.mountType === 'Rack Mounted')
                    ? originalDevice.mountType : document.getElementById('dev-mount-type').value;
            const location = isVirtualServer ? (selectedHost?.location || getDeviceById(deviceId)?.location || 'Unknown') : document.getElementById('dev-location').value;
            if (location === '__caffoot_create_location__') {
                showToast('Add or cancel the new location before saving this device.', 'error');
                return;
            }
            const primaryIp = ipamReadOnly ? originalDevice.primaryIp : document.getElementById('dev-ip').value.trim();
            const subnetId = ipamReadOnly ? (getSubnetForIp(primaryIp)?.id || '') : document.getElementById('dev-subnet').value;
            const ipReserved = ipamReadOnly ? originalDevice.ipReserved : document.getElementById('dev-ip-reserved').checked;
            const status = document.getElementById('dev-status').value;
            const manufacturer = document.getElementById('dev-manufacturer').value.trim();
            const model = document.getElementById('dev-model').value.trim();
            const serialNumber = document.getElementById('dev-serial').value.trim();
            // Preserve existing historical host metadata when editing a physical device.
            const virtualHostId = isVirtualServer?(document.getElementById('dev-virtual-host')?.value||''):(getDeviceById(deviceId)?.virtualHostId||'');
            // #164: A VM inherits the platform from its selected physical hypervisor.
            // Retain historical metadata when its host is absent or has no configured product.
            const virtualHost = appState.devices.find(d=>d.id===virtualHostId&&d.type==='Server - Physical');
            const virtualPlatform = isVirtualServer
                ? (String(virtualHost?.typeDetails?.hypervisorProduct||'').trim() || getDeviceById(deviceId)?.virtualPlatform || '')
                : (getDeviceById(deviceId)?.virtualPlatform||'');
            const existingDeviceHostIsUnchanged = () => !!deviceId && getDeviceById(deviceId)?.virtualHostId === virtualHostId;
            // #164: New VMs must have an eligible physical host. Preserve legacy edits.
            if(isVirtualServer && !virtualHostId && (!deviceId || !(getDeviceById(deviceId)?.isVirtual === true || getDeviceById(deviceId)?.type==='Server - Virtual')))return showToast('Select an eligible physical Hypervisor host for the new virtual machine.','error');
            if(isVirtualServer && virtualHostId&&!existingDeviceHostIsUnchanged()&&!appState.devices.some(d=>d.id===virtualHostId&&d.type==='Server - Physical'&&d.id!==deviceId&&d.status!=='Retired'&&(d.typeDetails?.serverService_Hypervisor===true||d.serverService_Hypervisor===true)))return showToast('Select an eligible Hypervisor host, or retain the existing legacy assignment.','error');
            if (!['Active','Maintenance','Retired'].includes(status)) return showToast('Invalid device status.', 'error');
            const notes = document.getElementById('dev-notes').value.trim();
            let typeDetails = captureDeviceDetailFieldValues();
            // #164: Optional VM allocations must be whole, positive numbers when supplied.
            // Historical imports may omit these fields and remain unchanged.
            if (isVirtualServer) {
                for (const [key, label] of [['vmVcpu','vCPU count'],['vmRamGb','Allocated RAM'],['vmDiskGb','Virtual disk'],['vmNicCount','Virtual network adapters']]) {
                    const raw = String(typeDetails[key] ?? '').trim();
                    if (raw !== '' && (!/^\d+$/.test(raw) || !Number.isSafeInteger(Number(raw)) || Number(raw) < 1)) {
                        return showToast(label + ' must be a positive whole number, or left blank.', 'error');
                    }
                }
            }
            if (type === 'Server - Physical' && typeDetails.serverService_Hypervisor === true &&
                !String(typeDetails.hypervisorProduct || '').trim() &&
                !String(getDeviceById(deviceId)?.typeDetails?.hypervisorProduct || '').trim() &&
                !(deviceId && (getDeviceById(deviceId)?.typeDetails?.serverService_Hypervisor === true ||
                                getDeviceById(deviceId)?.serverService_Hypervisor === true))) {
                return showToast('Select or enter a Hypervisor product to enable hosting.', 'error');
            }
            if (!name) return showToast('Please enter a device name.', 'error');
            if (appState.devices.some(d => String(d.id) !== String(deviceId || '') && String(d.name || '').trim().toLowerCase() === name.toLowerCase())) return showToast('A device with this name already exists. Please enter a unique device name.', 'error');
            if (!type) return showToast('Please select a device type.', 'error');
            if (!mountType || (!isVirtualServer && !getRecognisedDeviceMountTypes(type).includes(mountType))) return showToast('Please select a valid mounting option for this device type.', 'error');
            if (!location) return showToast('Please select a location.', 'error');
            if (!subnetId) return showToast('Please select an existing subnet.', 'error');
            if (!primaryIp) return showToast('Please enter a primary IP address.', 'error');
            const subnet = appState.subnets.find(s => s.id === subnetId);
            const matchingSubnet = getSubnetForIp(primaryIp);
            if (!subnet || !matchingSubnet || matchingSubnet.id !== subnet.id) return showToast('The primary IP must belong to the selected existing subnet.', 'error');
            if (findDeviceUsingIp(primaryIp, deviceId)) return showToast(`IP address ${primaryIp} is already assigned to another device.`, 'error');
            let rackShelfAccessoryId = '';
            let rackId = '', face = 'front', rackUStart = null, rackUEnd = null, rackUHeight = null;
            if (mountType === 'Rack Mounted' && !racksReadOnly) {
                if (!location || location === 'Racked') return showToast('Select a physical Location Area or Unknown.', 'error');
                rackId = document.getElementById('dev-rack-id').value; face = document.getElementById('dev-rack-face').value;
                if(!rackId)return showDeviceEditorFeedback('Select a rack for Rack Mounted equipment.','dev-rack-id');
                if(!appState.racks.some(rack=>rack.id===rackId))return showDeviceEditorFeedback('Selected rack no longer exists. Choose an existing rack.','dev-rack-id');
                rackUStart = parseInt(document.getElementById('dev-rack-u').value, 10); rackUHeight = parseInt(document.getElementById('dev-rack-height').value, 10);
                if (!Number.isInteger(rackUStart) || !Number.isInteger(rackUHeight) || rackUStart < 1 || rackUHeight < 1) return showToast('Please enter a valid rack start U and U height.', 'error');
                rackUEnd = rackUStart + rackUHeight - 1;
                const validationError = validateRackPlacement(deviceId, rackId, face, rackUStart, rackUEnd);
                if (validationError) return showToast(validationError, 'error');
            }
            if(mountType==='Tabletop / Shelf Mounted'&&!racksReadOnly){
                rackId=document.getElementById('dev-shelf-rack')?.value||'';
                rackShelfAccessoryId=rackId?document.getElementById('dev-rack-shelf')?.value||'':'';
                if(rackId)face=null;
                const error=getDeviceShelfAssociationError({name,type,mountType,rackId,rackShelfAccessoryId,face,rackUStart,rackUEnd,rackUHeight});
                if(error)return showDeviceEditorFeedback(error,'dev-rack-shelf');
            }
            if (racksReadOnly) {
                rackShelfAccessoryId=originalDevice.rackShelfAccessoryId??'';
                rackId = originalDevice.rackId ?? '';
                face = originalDevice.face ?? null;
                rackUStart = originalDevice.rackUStart ?? null;
                rackUEnd = originalDevice.rackUEnd ?? null;
                rackUHeight = originalDevice.rackUHeight ?? null;
            }
            const existingDevice = deviceId ? getDeviceById(deviceId) : null;
            // host retirement and loss of Hypervisor eligibility
            // still require an explicit decision for every assigned guest.
            let removalGuests = [];
            let removalChoices = [];
            if (existingDevice && existingDevice.type === 'Server - Physical') {
                const wasHypervisor = existingDevice.typeDetails?.serverService_Hypervisor === true || existingDevice.serverService_Hypervisor === true;
                const remainsHypervisor = type === 'Server - Physical' && typeDetails.serverService_Hypervisor === true;
                const retiring = status === 'Retired' && existingDevice.status !== 'Retired';
                if (retiring || (wasHypervisor && !remainsHypervisor)) {
                    const hostedGuests = appState.devices.filter(guest => guest.id !== deviceId && guest.virtualHostId === deviceId);
                    if (hostedGuests.length) {
                        const choices = await requestHypervisorGuestReassignment(existingDevice.name, hostedGuests, deviceId);
                        if (!choices) return;
                        if (getDeviceById(deviceId) !== existingDevice || document.getElementById('dev-type')?.value !== type ||
                            document.getElementById('dev-status')?.value !== status ||
                            (type === 'Server - Physical' && captureDeviceDetailFieldValues().serverService_Hypervisor !== typeDetails.serverService_Hypervisor)) return;
                        removalGuests = hostedGuests;
                        removalChoices = choices;
                    }
                }
            }
            // an explicit host Hypervisor product change updates assigned guests in one transaction.
            let platformGuests = [];
            const previousHypervisor = String(existingDevice?.typeDetails?.hypervisorProduct || '').trim();
            const nextHypervisor = String(typeDetails.hypervisorProduct || '').trim();
            if (existingDevice && existingDevice.type === 'Server - Physical' && type === 'Server - Physical' &&
                previousHypervisor && nextHypervisor && previousHypervisor !== nextHypervisor && removalGuests.length === 0) {
                platformGuests = appState.devices.filter(guest => guest.id !== deviceId && guest.virtualHostId === deviceId);
                if (platformGuests.length) {
                    if (!await confirmHypervisorPlatformChangeForGuests(existingDevice.name, platformGuests, previousHypervisor, nextHypervisor)) return;
                    if (getDeviceById(deviceId) !== existingDevice || document.getElementById('dev-type')?.value !== type ||
                        document.getElementById('host-platform')?.value.trim() !== nextHypervisor) return;
                }
            }
            const beforeDeviceSave = JSON.stringify(appState);
            if (existingDevice) {
                Object.assign(existingDevice, {status, manufacturer, model, serialNumber, typeDetails, virtualPlatform, virtualHostId, isVirtual:isVirtualServer});
                preserveLegacyDeviceSoftwareFlags(existingDevice,typeDetails);
                existingDevice.ipReserved = ipReserved;
                existingDevice.name = name; existingDevice.type = type; existingDevice.mountType = mountType; existingDevice.location = location; existingDevice.notes = notes;
                existingDevice.rackId = rackId; existingDevice.face = face; existingDevice.rackUStart = rackUStart; existingDevice.rackUEnd = rackUEnd; existingDevice.rackUHeight = rackUHeight;
                if(rackShelfAccessoryId||Object.hasOwn(existingDevice,'rackShelfAccessoryId'))existingDevice.rackShelfAccessoryId=rackShelfAccessoryId;
                try { setDevicePrimaryIp(existingDevice, primaryIp); syncDeviceIpamRecord(existingDevice); } catch (error) { appState = JSON.parse(beforeDeviceSave); return showToast('Device/IPAM update cancelled: ' + error.message, 'error'); }
            } else {
                const newDevice = { id: 'dev_' + Date.now(), name, type, mountType, location, notes, status, manufacturer, model, serialNumber, typeDetails, virtualPlatform, virtualHostId, isVirtual:isVirtualServer, ipReserved, primaryIp: '', rackId, face, rackUStart, rackUEnd, rackUHeight };
                if(rackShelfAccessoryId)newDevice.rackShelfAccessoryId=rackShelfAccessoryId;
                preserveLegacyDeviceSoftwareFlags(newDevice,typeDetails);
                appState.devices.push(newDevice);
                try { setDevicePrimaryIp(newDevice, primaryIp); syncDeviceIpamRecord(newDevice); } catch (error) { appState = JSON.parse(beforeDeviceSave); return showToast('Device/IPAM creation cancelled: ' + error.message, 'error'); }
            }
            for (let index = 0; index < removalGuests.length; index++) {
                const guest = removalGuests[index];
                const choice = removalChoices[index];
                guest.previousVirtualHosts = [...(Array.isArray(guest.previousVirtualHosts) ? guest.previousVirtualHosts : []),
                    {hostId:deviceId, changedAt:new Date().toISOString(), action:choice}];
                if (choice === 'unassign') guest.virtualHostId = '';
                else if (choice === 'retire') { guest.virtualHostId = ''; guest.status = 'Retired'; }
                else if (choice.startsWith('host:')) {
                    const destination = appState.devices.find(host => host.id === choice.slice(5) &&
                        host.type === 'Server - Physical' && host.status !== 'Retired' &&
                        (host.typeDetails?.serverService_Hypervisor === true || host.serverService_Hypervisor === true));
                    if (!destination) { appState = JSON.parse(beforeDeviceSave); return showToast('Destination Hypervisor is no longer eligible.', 'error'); }
                    guest.virtualHostId = destination.id;
                    const destinationPlatform = String(destination.typeDetails?.hypervisorProduct || '').trim();
                    if (destinationPlatform && guest.virtualPlatform !== destinationPlatform) {
                        guest.previousVirtualPlatforms = [...(Array.isArray(guest.previousVirtualPlatforms) ? guest.previousVirtualPlatforms : []),
                            {platform:guest.virtualPlatform || '', hostId:deviceId, changedAt:new Date().toISOString()}];
                        guest.virtualPlatform = destinationPlatform;
                    }
                }
            }
            for (const guest of platformGuests) {
                guest.previousVirtualPlatforms = [...(Array.isArray(guest.previousVirtualPlatforms) ? guest.previousVirtualPlatforms : []),
                    {platform:guest.virtualPlatform || '', hostId:deviceId, changedAt:new Date().toISOString()}];
                guest.virtualPlatform = nextHypervisor;
            }
            if (!nextDeviceBridge || !await nextDeviceBridge.save(beforeDeviceSave, deviceId)) {
                appState = JSON.parse(beforeDeviceSave);
                return;
            }
            closeModal(true); renderContent();
        }

        async function deleteDevice(deviceId) {
            if (!nextDeviceBridge) return;
            try { await nextDeviceBridge.reserveForDelete(deviceId); }
            catch (error) { showToast(error.message, 'error'); return; }
            try {
            const device=getDeviceById(deviceId);
            if (!device) { showToast('Device no longer exists.', 'error'); return; }
            const hostedDependants=appState.devices.filter(d=>d.id!==deviceId&&d.virtualHostId===deviceId);
            let choices=[];
            if(hostedDependants.length) {
                // Use the same per guest review as retirement and Hypervisor removal.
                // Deleting the host itself still requires the existing separate confirmation.
                choices=await requestHypervisorGuestReassignment(device.name,hostedDependants,deviceId);
                if(!choices) return;
                if(getDeviceById(deviceId)!==device ||
                    hostedDependants.some(guest=>getDeviceById(guest.id)!==guest||guest.virtualHostId!==deviceId)) {
                    return showToast('Inventory changed while reviewing guests. Please try again.','error');
                }
            }
            const related=Object.keys(appState.ipAllocations).filter(ip=>appState.ipAllocations[ip]?.deviceId===deviceId);
            const reserved=Object.keys(appState.ipAllocations).filter(ip=>appState.ipAllocations[ip]?.reservedForDeviceId===deviceId);
            const message=`Delete device ${device.name}?\n\nPrimary IP: ${device.primaryIp||'none'}\nLinked IPAM records: ${related.length}\nOther reservations: ${reserved.length}\nRack: ${device.rackId?'mounted':'not mounted'}\n\n${hostedDependants.length} hosted virtual machines will be resolved as selected.\n\nThis cannot be undone.`;
            if(!confirm(message)) return;
            const before=JSON.stringify(appState);
            for(let index=0;index<hostedDependants.length;index++){
                const guest=hostedDependants[index],choice=choices[index];
                guest.previousVirtualHosts=[...(Array.isArray(guest.previousVirtualHosts)?guest.previousVirtualHosts:[]),
                    {hostId:deviceId,changedAt:new Date().toISOString(),action:choice}];
                if(choice==='unassign')guest.virtualHostId='';
                else if(choice==='retire'){guest.virtualHostId='';guest.status='Retired';}
                else if(choice.startsWith('host:')){
                    const destination=appState.devices.find(host=>host.id===choice.slice(5)&&host.id!==deviceId&&
                        host.type==='Server - Physical'&&host.status!=='Retired'&&
                        (host.typeDetails?.serverService_Hypervisor===true||host.serverService_Hypervisor===true));
                    if(!destination){appState=JSON.parse(before);return showToast('Destination Hypervisor is no longer eligible.','error');}
                    guest.virtualHostId=destination.id;
                    const platform=String(destination.typeDetails?.hypervisorProduct||'').trim();
                    if(platform&&guest.virtualPlatform!==platform){
                        guest.previousVirtualPlatforms=[...(Array.isArray(guest.previousVirtualPlatforms)?guest.previousVirtualPlatforms:[]),
                            {platform:guest.virtualPlatform||'',hostId:deviceId,changedAt:new Date().toISOString()}];
                        guest.virtualPlatform=platform;
                    }
                }else{appState=JSON.parse(before);return showToast('Invalid guest decision.','error');}
            }
            for(const ip of related){
                const allocation=appState.ipAllocations[ip];
                if(allocation)appState.ipAllocations[ip]={...allocation,status:'Available',deviceId:''};
            }
            for(const ip of reserved)if(appState.ipAllocations[ip])appState.ipAllocations[ip].reservedForDeviceId='';
            appState.devices=appState.devices.filter(d=>d.id!==deviceId);
            await nextDeviceBridge.remove(before, deviceId);
            } finally { await nextDeviceBridge.cancelDelete(deviceId); }
        }

        // one purpose per settings section; existing handlers remain unchanged.
        // A browser may block localStorage (including for file:// pages).
        // Reading optional recovery indicators must not prevent Settings from rendering.
        function personalSafeStorageGet(key) {
            try { return localStorage.getItem(key); }
            catch (error) { console.warn('Optional browser storage unavailable:', error); return null; }
        }

        function openBackupExplanationDialog() {
            openModal('<div class="p-6 text-slate-800 dark:text-slate-100 space-y-4">' +
                '<h2 class="text-xl font-bold">Understanding your backups</h2>' +
                renderInterfaceTemplate("migration/open-backup-explanation-dialog-1",[]) +
                renderInterfaceTemplate("migration/open-backup-explanation-dialog-2",[]) +
                renderInterfaceTemplate("migration/open-backup-explanation-dialog-3",[]) +
                renderInterfaceTemplate("migration/open-backup-explanation-dialog-4",[]) +
                '<div class="flex justify-end"><button type="button" data-action="backup-help-close" class="settings-action">Close</button></div></div>');
        }

        function renderPersonalSettingsBody(section) {
            const button = (action,label,icon,extra='') => `<button type="button" data-action="${action}" ${extra} class="settings-action"><i class="fa-solid ${icon}" aria-hidden="true"></i>${label}</button>`;
            let body = '';
            if (section === 'preferences') {
                const preference = caffootThemePreference();
                const themeChoice = (mode,label,icon,description) => '<button type="button" data-action="change-appearance-theme" data-theme="' + mode + '" aria-pressed="' + (preference === mode) + '" class="theme-choice' + (preference === mode ? ' settings-theme-selected' : '') + '"><i class="fa-solid ' + icon + '" aria-hidden="true"></i><span><strong>' + label + '</strong><small>' + description + '</small></span><i class="fa-solid fa-check settings-theme-check" aria-hidden="true"></i></button>';
                body = renderInterfaceTemplate("settings/appearance-panel",[]) +
                    themeChoice('light','Light Mode','fa-sun','Always use the light theme') +
                    themeChoice('dark','Dark Mode','fa-moon','Always use the dark theme') +
                    themeChoice('system','Use System Setting','fa-desktop','Follow your device appearance') +
                    '</div></section>';
            } else if (section === 'help') {
                // The authoritative Markdown user guides are shared with GitHub and the future website.
                const guideRoot = 'https://github.com/Caffoot/Caffoot-Lite/blob/main/docs/how-tos/features-and-instructions/';
                const helpTopics = [
                    ['Getting Started', 'Create your administrator on first run and enrol MFA. Then use Devices, IPAM and Network Racks just as in published v1.3.3. Authorised users work from the same central inventory.', [['Getting Started', 'Getting-Started.md']]],
                    ['Import from v1.3.3', 'Under Import Inventory, choose a fresh JSON backup exported from published v1.3.3 and review all required corrections before confirming replacement. For older HTML versions, upgrade to v1.3.3 before exporting.', [['Migration', 'Migration-Backup-and-Restore.md']]],
                    ['Devices, IPAM and Racks', 'Manage the familiar devices, primary IP assignments, subnets, VLANs, racks and accessories. Device editing reserves that device for one user at a time.', [['Devices', 'Devices.md'], ['IPAM', 'IPAM.md'], ['Racks', 'Racks.md']]],
                    ['Users and MFA', 'Administrators manage users and permissions in the Users section. New users have no access until permissions are granted. MFA is required for editing and administration.', [['Users and MFA', 'Users-Permissions-and-MFA.md']]],
                    ['Database backup and recovery', 'Use your established Docker, Portainer or database volume backup application. Caffoot Lite has no ongoing inventory JSON backup export.', [['Backup and restore', 'Migration-Backup-and-Restore.md']]],
                    ['Appearance', 'Appearance Preferences offers Light Mode, Dark Mode and Use System Setting. This appearance preference remains local to your browser.', [['Settings', 'Settings-and-Change-History.md']]]
                ];
                const guideLinks = guides => '<div class="flex flex-wrap gap-x-5 gap-y-2 px-5 pb-4">' + guides.map(([label,file]) =>
                    '<a href="' + guideRoot + encodeURIComponent(file) + '" target="_blank" rel="noopener noreferrer" class="text-sm font-semibold text-indigo-700 dark:text-indigo-300 hover:underline focus-visible:underline" aria-label="Read full ' + label + ' guide (opens new tab)">Read full ' + label + ' guide <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a>'
                ).join('') + '</div>';
                body = renderInterfaceTemplate("settings/help-guides-panel",[]) +
                    '<div class="settings-help-topics">' + helpTopics.map(([title,content,guides]) => '<details class="settings-help-topic"><summary>' + title + '</summary><p>' + content + '</p>' + guideLinks(guides) + '</details>').join('') + '</div></section>';
            } else {
                body = '<section class="settings-panel settings-about"><div class="settings-about-brand">' +
                    '<img src="../assets/caffoot-icon-1024.png" alt="Caffoot hedgehog logo" width="76" height="76">' +
                    renderInterfaceTemplate("settings/about-summary",[]) +
                    '<div class="settings-about-version"><span>Installed Version</span><strong>Caffoot Lite v2.0.3</strong></div>' +
                    '<p>Manage devices, IP addresses, subnets and network racks using a shared central SQLite database with authorised multi-user access.</p>' +
                    '<h4>Project & Documentation</h4><div class="settings-about-links">' +
                    renderInterfaceTemplate("settings/repository-link",[]) +
                    renderInterfaceTemplate("settings/user-guides-link",[]) +
                    renderInterfaceTemplate("settings/installation-link",[]) +
                    renderInterfaceTemplate("settings/releases-link",[]) +
                    renderInterfaceTemplate("settings/about-offline-note",[]) +
                    '<p>For offline instructions, open Help & Guides in My account.</p>' +
                    '<div class="settings-buttons">' + button('caffoot-licences','Software Licences','fa-file-lines') + '</div></section>';
            }

            return body;
        }

        // The approved Settings & Data HTML, with only preview handlers
        // replaced by existing live application actions and secured SMTP APIs.
        const settingsMarkup=renderInterfaceTemplate("settings/settings-markup-1",[]);
        let activeSettingsTab='data';
        let smtpSettings=null;
        let smtpLoaded=false;
        let smtpLoading=false;
        async function loadSmtpSettings(){
          if(smtpLoaded||smtpLoading||window.nextSessionIsAdmin!==true)return;
          smtpLoading=true;
          try{
            const response=await fetch('/api/settings/email',{cache:'no-store'});
            if(!response.ok)throw new Error('Unable to load outgoing email settings.');
            smtpSettings=await response.json();
          }catch(error){
            showToast(error.message,'error');
          }finally{
            smtpLoading=false;
            smtpLoaded=true;
            if(currentTab==='settings'&&activeSettingsTab==='email')renderContent();
          }
        }
        function renderApplicationSettings(){
          if(window.nextSessionIsAdmin!==true)return '';
          return settingsMarkup;
        }
        function syncSmtpForm(root){
          const form=root.querySelector('#smtp-settings-form');
          if(!form)return;
          const s=smtpSettings;
          if(s){
            for(const key of ['host','port','security','authenticate','username','fromName','fromEmail','insecureConfirmed']){
              const input=form.elements.namedItem(key);
              if(!input)continue;
              if(input.type==='checkbox')input.checked=!!s[key];
              else input.value=s[key]===undefined?'':String(s[key]);
            }
          }
          form.elements.namedItem('password').value='';
          form.elements.namedItem('password').placeholder=s?.passwordConfigured?'Leave blank to keep the saved password':'Enter SMTP password';
          const status=root.querySelector('#smtp-config-status');
          if(status)status.textContent=!smtpLoaded?'Loading…':s?.configured?'Configured':smtpSettings?'Not Configured':'Unavailable';
          const button=form.querySelector('button[type="submit"]');
          if(button)button.disabled=!smtpLoaded||!smtpSettings;
          const send=root.querySelector('#smtp-test-form button[type="submit"]');
          if(send)send.disabled=!s?.configured;
          updateSmtpFields(form);
        }
        function updateSmtpFields(form){
          if(!form)return;
          const enabled=form.elements.namedItem('authenticate')?.checked;
          const authFields=form.querySelector('#smtp-auth-fields');
          if(authFields){
            authFields.classList.toggle('is-off',!enabled);
            authFields.querySelectorAll('input').forEach(input=>input.disabled=!enabled);
          }
          const plain=form.elements.namedItem('security')?.value==='none';
          const warning=form.querySelector('#smtp-insecure-warning');
          if(warning)warning.hidden=!plain;
          if(!plain)form.elements.namedItem('insecureConfirmed').checked=false;
        }
        function hydrateSettings(container){
          const root=container.querySelector('.settings-screen');
          if(!root)return;
          root.querySelectorAll('.account-panel').forEach(panel=>{
            const selected=panel.dataset.section===activeSettingsTab;
            panel.classList.toggle('active',selected);
            panel.hidden=!selected;
          });
          root.querySelectorAll('.subnav [data-action="select-settings-tab"]').forEach(button=>{
            const selected=button.dataset.tab===activeSettingsTab;
            button.classList.toggle('active',selected);
            button.setAttribute('aria-selected',String(selected));
          });
          const importButton=root.querySelector('[data-action="next-import-pick"]');
          if(importButton)importButton.disabled=!nextImportAllowed;
          if(activeSettingsTab==='email'){
            syncSmtpForm(root);
            if(!smtpLoaded&&!smtpLoading)void loadSmtpSettings();
          }
        }
        // Manual release checks never read or send inventory, or change browser storage.
        function caffootCompareVersions(left, right) {
            const parse = value => {
                const match = /^(?:[vV])?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:\.(0|[1-9]\d*))?(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/.exec(value);
                if (!match) throw new Error('Release version is not recognised.');
                const pre = match[5] ? match[5].split('.') : [];
                if (pre.some(part => !part || (/^\d+$/.test(part) && part.length > 1 && part[0] === '0'))) throw new Error('Release version is not recognised.');
                return {numbers:[...match.slice(1,4),match[4] || '0'].map(BigInt), pre};
            };
            const a = parse(left), b = parse(right);
            for (let i=0;i<4;i++) if (a.numbers[i] !== b.numbers[i]) return a.numbers[i] > b.numbers[i] ? 1 : -1;
            if (!a.pre.length || !b.pre.length) return a.pre.length === b.pre.length ? 0 : a.pre.length ? -1 : 1;
            for (let i=0;i<Math.max(a.pre.length,b.pre.length);i++) {
                if (a.pre[i] === undefined) return -1;
                if (b.pre[i] === undefined) return 1;
                if (a.pre[i] === b.pre[i]) continue;
                const an = /^\d+$/.test(a.pre[i]), bn = /^\d+$/.test(b.pre[i]);
                if (an && bn) return BigInt(a.pre[i]) > BigInt(b.pre[i]) ? 1 : -1;
                if (an !== bn) return an ? -1 : 1;
                return a.pre[i] > b.pre[i] ? 1 : -1;
            }
            return 0;
        }

        function caffootShowLicences() {
            const template = document.getElementById('caffoot-license-notices');
            openModal(renderInterfaceTemplate("shared/caffoot-show-licences-1",[template ? template.innerHTML : 'See LICENSE and THIRD-PARTY-NOTICES.md beside the developer source.']));
        }

        function caffootUpdateGuide() {
            openModal(renderInterfaceTemplate("shared/caffoot-update-guide-1",[]));
        }

        let caffootUpdateChecking = false;
        async function caffootCheckUpdates() {
            if (caffootUpdateChecking) return;
            const status = document.getElementById('caffoot-update-status');
            if (!status) return;
            if (typeof navigator !== 'undefined' && navigator.onLine === false) {
                status.textContent = 'Offline — update check unavailable. You can continue using Caffoot Lite and open the Safe Update Guide.';
                return;
            }
            caffootUpdateChecking = true;
            status.textContent = 'Checking official stable releases…';
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000);
            try {
                const response = await fetch('https://api.github.com/repos/caffoot/Caffoot-Lite/releases/latest', {signal:controller.signal, credentials:'omit', referrerPolicy:'no-referrer', headers:{Accept:'application/vnd.github+json'}});
                if (response.status === 404) {
                    status.textContent = 'No public release is available yet, or the repository is private. Your current version is ' + CAFFOOT_LITE_VERSION + '.';
                    return;
                }
                if (!response.ok) throw new Error('Release check unavailable');
                const release = await response.json();
                if (!release || release.draft !== false || release.prerelease !== false || typeof release.tag_name !== 'string') throw new Error('Invalid release');
                const newer = caffootCompareVersions(release.tag_name, CAFFOOT_LITE_VERSION) > 0;
                status.textContent = newer ? 'A newer release (' + release.tag_name + ') is available. Download a JSON backup, then follow the safe update guide.' : 'Up to date — no newer stable release found. Installed version: ' + CAFFOOT_LITE_VERSION + '.';
            } catch (error) {
                status.textContent = 'Could not check releases. Check your connection or visit Official releases in the safe update guide. Your inventory has not changed.';
            } finally {
                clearTimeout(timeout);
                caffootUpdateChecking = false;
            }
        }

        async function checkInventorySafety() {
            try {
                if (!nextIntegrityRepairBridge) throw new Error('Central inventory unavailable.');
                await nextIntegrityRepairBridge.reload();
                if (!['Devices','IPAM','Racks'].every(section => nextIntegrityRepairBridge.canViewSection(section)))
                    throw new Error('Access to Devices, IPAM and Racks is required for this whole-inventory check.');
                const issues = validateApplicationState();
                if (issues.length) {
                    window.alert('INVENTORY SAFETY CHECK — ACTION REQUIRED\n\n' +
                        issues.slice(0, 12).map((issue, i) => (i + 1) + '. ' + issue).join('\n') +
                        (issues.length > 12 ? '\n...and ' + (issues.length - 12) + ' more issue(s).' : '') +
                        '\n\nReview the affected inventory records before making changes.');
                    return;
                }
                window.alert('INVENTORY SAFETY CHECK PASSED\n\n' +
                    appState.devices.length + ' devices, ' + appState.racks.length + ' racks, ' +
                    appState.subnets.length + ' subnets and ' + Object.keys(appState.ipAllocations).length +
                    ' IPAM records checked.\n\nCentral inventory loaded successfully.');
            } catch(error) {
                window.alert('INVENTORY SAFETY CHECK FAILED\n\n' + error.message);
            }
        }

        function requestInventoryReset() {
            const summary = [
                appState.devices.length + ' devices',
                appState.racks.length + ' racks',
                appState.subnets.length + ' subnets'
            ].join(', ');
            if (!window.confirm([
                'WARNING: RESET CAFFOOT LITE TO A CLEAN START',
                '',
                'Current inventory: ' + summary,
                '',
                'ALL inventory, IPAM records, managed server options and software options will be replaced.',
                '',
                'Database backup and restoration are handled by your Docker or volume backup application.',
                '',
                'Press OK to reset or Cancel to keep everything.'
            ].join('\n'))) return;
            if (!nextResetBridge) {
                showToast('This inventory operation is not yet connected to SQLite.', 'error');
                return;
            }
            void nextResetBridge.reset();
        }

        const CAFFOOT_BACKUP_FORMAT = 'caffoot-inventory';
        const CAFFOOT_BACKUP_SCHEMA_VERSION = 1;
        const CAFFOOT_LITE_VERSION = '1.3.3';
        function createInventoryBackup(state = appState) {
            return {
                ...JSON.parse(JSON.stringify(state)),
                caffootBackup: {
                    format: CAFFOOT_BACKUP_FORMAT,
                    schemaVersion: CAFFOOT_BACKUP_SCHEMA_VERSION,
                    app: 'Caffoot Lite',
                    appVersion: CAFFOOT_LITE_VERSION,
                    exportedAt: new Date().toISOString()
                }
            };
        }
        function validateBackupVersion(raw) {
            if (!Object.prototype.hasOwnProperty.call(raw, 'caffootBackup')) return 0; // legacy inventory export
            const meta = raw.caffootBackup;
            if (!meta || typeof meta !== 'object' || Array.isArray(meta) ||
                meta.format !== CAFFOOT_BACKUP_FORMAT ||
                !Number.isSafeInteger(meta.schemaVersion) || meta.schemaVersion < 1 ||
                typeof meta.app !== 'string' || !['Caffoot Lite','Caffoot Pro'].includes(meta.app) ||
                typeof meta.appVersion !== 'string' || !/^[0-9]+\.[0-9]+\.[0-9]+(?:\.[0-9]+)?(?:-[a-zA-Z0-9.-]+)?$/.test(meta.appVersion) ||
                typeof meta.exportedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T/.test(meta.exportedAt) || !Number.isFinite(Date.parse(meta.exportedAt)))
                throw new Error('Backup version metadata is invalid or unsupported.');
            if (meta.schemaVersion > CAFFOOT_BACKUP_SCHEMA_VERSION)
                throw new Error('This backup uses a newer inventory schema. Update Caffoot Lite before importing it.');
            return meta.schemaVersion;
        }
        // Work on a detached copy: legacy normalisation must never mutate the input backup.
        function normaliseImportedBackupAndPlanLegacyMountRepairs(raw) {
            validateBackupVersion(raw);
            const detached = JSON.parse(JSON.stringify(raw));
            const repairs = planLegacyComputerMountingCorrections(detached);
            const candidate = normaliseState(detached);
            if (repairs.length) Object.defineProperty(candidate, '_legacyMountRepairs', { value: repairs, enumerable: false });
            return candidate;
        }
        function exportData() {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(createInventoryBackup(), null, 2));
            const dlAnchor = document.createElement('a');
            dlAnchor.setAttribute("href", dataStr);
            dlAnchor.setAttribute("download", `caffoot_lite_backup_${new Date().toISOString().slice(0,10)}.json`);
            document.body.appendChild(dlAnchor);
            dlAnchor.click();
            dlAnchor.remove();
        }

        // safety snapshots are kept separately from active inventory.
        const SAFETY_SNAPSHOT_KEY = 'caffoot_phase11_pre_restore';
        // Reject dangerous object keys before migration, merging or rendering imported JSON.
        function rejectUnsafeBackupKeys(root) {
            const blocked = new Set(['__proto__', 'prototype', 'constructor']);
            const pending = [root];
            const visited = new WeakSet();
            while (pending.length) {
                const value = pending.pop();
                if (!value || typeof value !== 'object' || visited.has(value)) continue;
                visited.add(value);
                for (const key of Object.keys(value)) {
                    if (blocked.has(key)) throw new Error('Backup contains a prohibited object property.');
                    const child = value[key];
                    if (child && typeof child === 'object') pending.push(child);
                }
            }
        }
        function validateBackupStructure(raw) {
            if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Backup must be a JSON object.');
            const required = ['devices', 'subnets', 'racks'];
            for (const key of required) {
                if (!Array.isArray(raw[key])) throw new Error(`Backup is missing a valid ${key} array.`);
                if (raw[key].length > 50000) throw new Error(`Backup contains too many ${key} records.`);
            }
            if (!raw.ipAllocations || typeof raw.ipAllocations !== 'object' || Array.isArray(raw.ipAllocations))
                throw new Error('Backup is missing a valid IP allocation table.');
            if (Object.keys(raw.ipAllocations).length > 100000)
                throw new Error('Backup contains too many IP allocations.');
            for (const key of required) {
                if (raw[key].some(item => !item || typeof item !== 'object' || Array.isArray(item)))
                    throw new Error(`Backup has invalid entries in ${key}.`);
            }
            return true;
        }
        function downloadPreRestoreSafetySnapshot() {
            const raw = localStorage.getItem(SAFETY_SNAPSHOT_KEY);
            if (!raw) return showToast('No pre-restore safety snapshot is available.', 'error');
            const url = URL.createObjectURL(new Blob([raw], {type:'application/json'}));
            const a = document.createElement('a');
            a.href=url; a.download='caffoot_lite_pre_restore_safety_snapshot.json';
            document.body.appendChild(a); a.click(); a.remove();
            setTimeout(()=>URL.revokeObjectURL(url),1000);
        }
        // inspect an imported file without changing the saved inventory.
        // Compatibility repair is intentionally limited to device-type/mounting mismatches.
        // Never mutate the original backup; all other integrity failures still block restore.
        function planLegacyComputerMountingCorrections(candidate) {
            const changes = [];
            for (const device of candidate.devices) {
                if(device.rackShelfAccessoryId!==undefined&&device.rackShelfAccessoryId!==null&&device.rackShelfAccessoryId!=='')continue;
                const allowed = getRecognisedDeviceMountTypes(device.type);
                const mount = device.mountType || (device.rackId ? 'Rack Mounted' : 'Desktop');
                const legacyComputer = ['desktop', 'laptop', 'tablet'].includes(String(device.type || '').trim().toLowerCase());
                const noRackPosition = !device.rackId && device.rackUStart == null &&
                    device.rackUEnd == null && device.rackUHeight == null;
                // Old backups sometimes mark a desktop as "Racked" even though
                // its mounting type is Desktop and it has no rack assignment.
                const legacyLocation = legacyComputer && noRackPosition &&
                    device.location === 'Racked' && mount !== 'Rack Mounted' && allowed.includes(mount);
                const orphanedMount = legacyComputer && noRackPosition && mount === 'Rack Mounted';
                const incompatibleRackMount = legacyComputer && (mount === 'Rack Mounted' || Boolean(device.rackId));
                if (!legacyLocation && !orphanedMount && !incompatibleRackMount) continue;
                // Only offer safe, unambiguous corrections. Unknown mount values
                // and dangling rack references remain validation failures.
                if (!legacyLocation && !orphanedMount && !(
                    incompatibleRackMount && (mount === 'Rack Mounted' || device.rackId)
                )) continue;
                const proposedMount = legacyLocation ? mount : 'Desktop';
                changes.push({
                    id: device.id, name: device.name, type: device.type,
                    mountType: mount, location: device.location,
                    proposedMountType: proposedMount,
                    rack: candidate.racks.find(r => r.id === device.rackId)?.name || device.rackId || '(none)',
                    startU: device.rackUStart, endU: device.rackUEnd
                });
                device.mountType = proposedMount;
                device.location = 'Unknown';
                device.rackId = '';
                device.face = 'front';
                device.rackUStart = null;
                device.rackUEnd = null;
                device.rackUHeight = null;
            }
            return changes;
        }
                function findInvalidDeviceMounts(state) {
            return state.devices.filter(d => !getRecognisedDeviceMountTypes(d.type).includes(d.mountType || (d.rackId ? 'Rack Mounted' : 'Desktop')));
        }
        // Validate rack occupancy only on the detached import candidate. Never alter positions.
        function findRackImportConflicts(candidate) {
            const issues = [];
            const occupied = new Map();
            const ids = new Set();
            const validAccessoryTypes = new Set(['blank', 'patch', 'brush', 'cable', 'shelf', 'pdu_horizontal', 'ventilation', 'fan_tray', 'environmental_sensor', 'pdu_vertical', 'cable_vertical']);
            const racks = new Map(candidate.racks.map(r => [r.id, r]));
            const place = (record, label, rackId, face, start, height, rail) => {
                const rack = racks.get(rackId);
                if (!rack) { issues.push(label + ' references a missing rack.'); return; }
                const limit = Number(rack.heightU);
                if (!Number.isInteger(limit) || limit < 1 || !Number.isInteger(start) ||
                    !Number.isInteger(height) || height < 1 || start < 1 || start + height - 1 > limit) {
                    issues.push(label + ' has an invalid rack U position.'); return;
                }
                if (!['front', 'rear'].includes(face)) { issues.push(label + ' has an invalid rack face.'); return; }
                const key = JSON.stringify([rackId, face, rail]);
                const positions = occupied.get(key) || [];
                const end = start + height - 1;
                const collision = positions.find(p => start <= p.end && end >= p.start);
                if (collision) issues.push(label + ' overlaps ' + collision.label + '.');
                positions.push({start, end, label});
                occupied.set(key, positions);
            };
            for (const device of candidate.devices) {
                const shelfError=getDeviceShelfAssociationError(device,candidate);
                if(shelfError){issues.push(shelfError);continue;}
                if(device.rackShelfAccessoryId)continue;
                if (!device.rackId) continue;
                const start = Number(device.rackUStart), height = Number(device.rackUHeight);
                place(device, 'Device ' + String(device.name || device.id || '(unnamed)'),
                    device.rackId, device.face || 'front', start, height, 'horizontal');
            }
            for (const accessory of (Array.isArray(candidate.rackAccessories) ? candidate.rackAccessories : [])) {
                if (!accessory || typeof accessory !== 'object' || Array.isArray(accessory)) {
                    issues.push('Backup contains an invalid rack accessory record.'); continue;
                }
                const label = 'Accessory ' + String(accessory.name || accessory.id || '(unnamed)');
                if (!accessory.id || ids.has(accessory.id)) issues.push(label + ' has a missing or duplicate ID.');
                ids.add(accessory.id);
                if (!validAccessoryTypes.has(accessory.type)) {
                    issues.push(label + ' has an unsupported accessory type.'); continue;
                }
                const vertical = accessory.type === 'pdu_vertical' || accessory.type === 'cable_vertical';
                if (vertical && !['left', 'right'].includes(accessory.side)) {
                    issues.push(label + ' has an invalid side rail.'); continue;
                }
                place(accessory, label, accessory.rackId, accessory.face,
                    Number(accessory.startU), Number(accessory.heightU),
                    vertical ? 'rail-' + accessory.side : 'horizontal');
            }
            return issues;
        }
        function validateAndNormaliseBackupForImport(raw) {
            rejectUnsafeBackupKeys(raw);
            validateBackupStructure(raw);
            if (Object.prototype.hasOwnProperty.call(raw, 'rackAccessories') && !Array.isArray(raw.rackAccessories))
                throw new Error('Backup has an invalid rackAccessories collection.');
            validateBackupVersion(raw);
            const candidate = normaliseImportedBackupAndPlanLegacyMountRepairs(raw);
            const invalidMounts = findInvalidDeviceMounts(candidate);
            if (invalidMounts.length) throw new Error('Backup contains unsupported device mounting types: ' + invalidMounts.slice(0, 4).map(d => String(d.name)).join(', '));
            const original = appState;
            let issues;
            try {
                appState = candidate;
                issues = validateApplicationState();
            } finally {
                appState = original;
            }
            issues.push(...findRackImportConflicts(candidate));
            if (issues.length) throw new Error(`Inventory integrity check found ${issues.length} issue(s): ${issues.slice(0, 4).join('; ')}${issues.length > 4 ? '; and more' : ''}`);
            return candidate;
        }
        function parseBackupJsonWithHelpfulError(contents) {
            try { return JSON.parse(contents); }
            catch (error) { throw new Error('This file is not valid JSON. Select a Caffoot Lite or older compatible JSON backup (not a CSV export). ' + error.message); }
        }
        // Import failures must remain visible until explicitly dismissed.
        function showBackupImportError(message) {
            openModal(renderInterfaceTemplate("migration/show-backup-import-error-1",[escapeHtml(String(message))]));
        }
        // Review detached legacy corrections before restore. Closing the dialog always cancels.
        function reviewLegacyDeviceMountingRepairs(repairs) {
            return new Promise(resolve => {
                const container = document.getElementById('modal-container');
                const rows = repairs.map(change => renderInterfaceTemplate("device-details/rows-1",[escapeHtml(String(change.name || '(unnamed device)')),escapeHtml(String(change.type || 'Unknown')),escapeHtml(String(change.mountType)),escapeHtml(String(change.location || "Unknown")),escapeHtml(String(change.rack)),change.startU != null ? ', U' + escapeHtml(String(change.startU)) : '',escapeHtml(String(change.proposedMountType || "Desktop"))])).join('');
                openModal(renderInterfaceTemplate("device-details/review-legacy-device-mounting-repairs-1",[repairs.length,repairs.length === 1 ? '' : 's',repairs.length,rows]));
                document.getElementById('modal-content').classList.add('settings-legacy-review');
                let finished = false;
                const observer = new MutationObserver(() => {
                    if (container.classList.contains('hidden')) finish(false);
                });
                const finish = approved => {
                    if (finished) return;
                    finished = true;
                    observer.disconnect();
                    document.getElementById('modal-content').classList.remove('settings-legacy-review');
                    container.removeEventListener('click', onClick);
                    if (!container.classList.contains('hidden')) closeModal(true);
                    resolve(approved);
                };
                const onClick = event => {
                    const button = event.target.closest('[data-legacy-review]');
                    if (!button) return;
                    finish(button.dataset.legacyReview === 'approve');
                };
                container.addEventListener('click', onClick);
                observer.observe(container, {attributes:true,attributeFilter:['class']});
            });
        }
        // AP conflicts require an explicit choice, never an inferred mounting position.
        function findAccessPointMountConflictsInBackup(raw) {
            // Inspect the validated raw backup before migration: normaliseState
            // rejects incompatible AP mounts, so migration cannot run first.
            return raw.devices.filter(device => isWirelessAccessPointDeviceType(device.type) && !device.rackShelfAccessoryId &&
                (!getRecognisedDeviceMountTypes(device.type).includes(device.mountType || (device.rackId ? 'Rack Mounted' : 'Desktop')) ||
                Boolean(device.rackId))).map(device => ({
                    id: device.id, name: device.name, type: device.type,
                    mountType: device.mountType || (device.rackId ? 'Rack Mounted' : 'Desktop'),
                    rack: raw.racks.find(r => r.id === device.rackId)?.name || device.rackId || '(none)'
                }));
        }
        function chooseAccessPointMountingCorrections(conflicts) {
            return new Promise(resolve => {
                const container = document.getElementById('modal-container');
                const options = ['Tabletop / Shelf Mounted','Ceiling Mounted','Wall Mounted','Pole Mounted','Desktop'];
                const rows = conflicts.map((device, index) => renderInterfaceTemplate("device-details/rows-2",[escapeHtml(String(device.name || '(unnamed device)')),escapeHtml(String(device.mountType)),escapeHtml(String(device.rack)),index,index,index,options.map(option => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join('')])).join('');
                openModal(renderInterfaceTemplate("device-details/choose-access-point-mounting-corrections-1",[conflicts.length,conflicts.length === 1 ? '' : 's',rows]));
                document.getElementById('modal-content').classList.add('settings-access-point-review');
                let finished = false;
                const observer = new MutationObserver(() => {
                    if (container.classList.contains('hidden')) finish(null);
                });
                const finish = choices => {
                    if (finished) return;
                    finished = true;
                    observer.disconnect();
                    document.getElementById('modal-content').classList.remove('settings-access-point-review');
                    container.removeEventListener('click', onClick);
                    if (!container.classList.contains('hidden')) closeModal(true);
                    resolve(choices);
                };
                const onClick = event => {
                    const button = event.target.closest('[data-ap-action]');
                    if (!button) return;
                    if (button.dataset.apAction === 'cancel') return finish(null);
                    const selections = [...container.querySelectorAll('[data-ap-choice]')].map(select => select.value);
                    if (selections.length !== conflicts.length || selections.some(choice => !options.includes(choice))) {
                        container.querySelector('[data-ap-error]').textContent = 'Select a valid mounting type for every Access Point.';
                        return;
                    }
                    finish(selections);
                };
                container.addEventListener('click', onClick);
                observer.observe(container, {attributes:true,attributeFilter:['class']});
            });
        }
        function applyAccessPointMountingCorrectionsToBackup(raw, conflicts, choices) {
            const copy = JSON.parse(JSON.stringify(raw));
            for (let index = 0; index < conflicts.length; index++) {
                const device = copy.devices.find(item => item.id === conflicts[index].id);
                if (!device || !isWirelessAccessPointDeviceType(device.type) || !getRecognisedDeviceMountTypes(device.type).includes(choices[index]))
                    throw new Error('Invalid Access Point mounting selection.');
                device.mountType = choices[index];
                device.rackId = '';
                device.face = 'front';
                device.rackUStart = null;
                device.rackUEnd = null;
                device.rackUHeight = null;
                if (String(device.location || '').toLowerCase() === 'racked') device.location = 'Unknown';
            }
            return copy;
        }
        function importData(event) {
            const input = event.target;
            const file = input.files?.[0];
            if (!file) return;
            if (file.size > 10 * 1024 * 1024) {
                showBackupImportError('Backup exceeds the 10 MB safety limit.');
                input.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    const raw = parseBackupJsonWithHelpfulError(reader.result);
                    rejectUnsafeBackupKeys(raw);
                    validateBackupStructure(raw);
                    validateBackupVersion(raw);
                    const apConflicts = findAccessPointMountConflictsInBackup(raw);
                    let reviewedRaw = raw;
                    if (apConflicts.length) {
                        const choices = await chooseAccessPointMountingCorrections(apConflicts);
                        if (!choices) return;
                        reviewedRaw = applyAccessPointMountingCorrectionsToBackup(raw, apConflicts, choices);
                    }
                    const candidate = validateAndNormaliseBackupForImport(reviewedRaw);
                    const repairs = candidate._legacyMountRepairs || [];
                    if (repairs.length && !(await reviewLegacyDeviceMountingRepairs(repairs))) return;
                    const summary = `${candidate.devices.length} devices, ${candidate.racks.length} racks, ${candidate.subnets.length} subnets, ${Object.keys(candidate.ipAllocations).length} IPAM records`;
                    const currentSummary = `${appState.devices.length} devices, ${appState.racks.length} racks, ${appState.subnets.length} subnets`;
                    if (!confirm(`Backup validation passed.\n\nFile: ${file.name}\nBackup: ${summary}\nCurrent inventory: ${currentSummary}\n\nRestore will REPLACE your current inventory. A verified safety snapshot will be created first.\n\nContinue?`)) return;
                    // Capture the current inventory before any restore or rollback operation.
                    const original = appState;
                    // A failed safety-snapshot write blocks replacement. Existing data stays untouched.
                    const currentSnapshot = localStorage.getItem(STORAGE_KEY) || JSON.stringify(original);
                    const previousSafetySnapshot = localStorage.getItem(SAFETY_SNAPSHOT_KEY);
                    try {
                        localStorage.setItem(SAFETY_SNAPSHOT_KEY, currentSnapshot);
                        if (localStorage.getItem(SAFETY_SNAPSHOT_KEY) !== currentSnapshot)
                            throw new Error('Safety snapshot verification failed.');
                    } catch (snapshotError) {
                        throw new Error('Unable to create the pre-restore safety snapshot. Restore cancelled: ' + snapshotError.message);
                    }
                    // Persist before changing the active in-memory inventory.
                    const key = typeof STORAGE_KEY !== 'undefined' ? STORAGE_KEY : 'caffoot_state';
                    // saveState handles storage errors; do not replace active state on a failed save.
                    appState = candidate;
                    const previousHistory = auditHistory.slice();
                    const previousStoredHistory = localStorage.getItem(AUDIT_KEY);
                    nextAuditReason = 'Backup restored';
                    try {
                        if (!saveState()) throw new Error('Browser storage rejected the backup.');
                        const stored = localStorage.getItem(key);
                        if (!stored || JSON.stringify(normaliseState(JSON.parse(stored))) !== JSON.stringify(candidate))
                            throw new Error('Saved backup verification failed.');
                    } catch (error) {
                        appState = original;
                        nextAuditReason = '';
                        // Roll back the active saved state if persistence/verification failed.
                        try {
                            localStorage.setItem(key, currentSnapshot);
                            if (localStorage.getItem(key) !== currentSnapshot) throw new Error('Rollback verification failed');
                            if (previousSafetySnapshot === null) localStorage.removeItem(SAFETY_SNAPSHOT_KEY);
                            else localStorage.setItem(SAFETY_SNAPSHOT_KEY, previousSafetySnapshot);
                            if (localStorage.getItem(SAFETY_SNAPSHOT_KEY) !== previousSafetySnapshot)
                                throw new Error('Previous safety snapshot restoration could not be verified.');
                        } catch (rollbackError) {
                            storageRecoveryFailure = { reason: 'Backup restore rollback could not be verified. Further saves are blocked.', raw: currentSnapshot };
                            showStorageRecoveryBanner();
                            throw new Error('Restore failed and automatic storage rollback could not be verified. Further saves are blocked. Download the original stored data from the recovery banner. ' + rollbackError.message);
                        }
                        restoreAuditAfterRolledBackOperation(previousHistory, previousStoredHistory);
                        auditBaseline = currentSnapshot;
                        throw new Error('Restore cancelled; original inventory retained. ' + error.message);
                    }
                    selectedSubnetId = appState.subnets[0]?.id || '';
                    selectedRackId = appState.racks[0]?.id || '';
                    renderContent();
                    showToast('Validated backup restored successfully.');
                } catch (error) {
                    console.error('Backup restore failed', error);
                    showBackupImportError(`Restore failed: ${error.message}`);
                } finally {
                    input.value = '';
                }
            };
            reader.onerror = () => { showBackupImportError('Unable to read backup file.'); input.value = ''; };
            reader.readAsText(file, 'UTF-8');
        }

        document.addEventListener('submit', function(event) {
            const form = event.target.closest('form');
            if (!form) return;
            if (form.dataset.deviceForm === 'true') return handleDeviceSubmit(event, form.dataset.deviceId || null);
            switch (form.dataset.formAction) {
                case 'bulk-ip': return handleBulkIpSubmit(event, form.dataset.subnetId);
                case 'subnet': return handleSubnetSubmit(event, form.dataset.subnetId || null);
                case 'ip': return handleIpSubmit(event, form.dataset.ip);
                case 'rack': return handleRackSubmit(event, form.dataset.rackId || null);
                case 'assign': return handleAssignSubmit(event, form.dataset.rackId, Number(form.dataset.defaultSlot) || 1);
                default: break;
            }
        });

        document.addEventListener('keydown', function(event) {
            if (event.key !== 'Escape') return;
            const openMenus = document.querySelectorAll('.device-menu[open]');
            if (!openMenus.length) return;
            openMenus.forEach(menu => { menu.open = false; });
            const lastMenu = openMenus[openMenus.length - 1];
            const trigger = lastMenu.querySelector('summary');
            if (trigger) trigger.focus();
        });
        document.addEventListener('click', function(event) {
            if (event.target.closest('.device-menu')) return;
            document.querySelectorAll('.device-menu[open]').forEach(menu => { menu.open = false; });
        });
        document.addEventListener('input', function(event) {
            if (event.target.id === 'sub-cidr') {
                suggestSubnetGateway();validateSubnetGatewayField();
                return;
            }
            if (event.target.id === 'sub-gw') {
                event.target.dataset.autoGateway = '';event.target.dataset.manualGateway='true';validateSubnetGatewayField();
                return;
            }
            if (event.target.id === 'ipam-address-search') {
                ipamAddressSearch = event.target.value;
                const cursor = event.target.selectionStart;
                renderContent();
                const field = document.getElementById('ipam-address-search');
                if (field) { field.focus(); try { field.setSelectionRange(cursor,cursor); } catch (_) {} }
                return;
            }
            if (event.target.id !== 'device-search') return;
            deviceSearchTerm = event.target.value;
            const caret = event.target.selectionStart;
            renderContent();
            const search = document.getElementById('device-search');
            if (search) {
                search.focus();
                try { search.setSelectionRange(caret, caret); } catch (_) {}
            }
        });
        document.addEventListener('change', function(event) {
            if (event.target.id === 'ipam-select-network') {
                changeSubnet(event.target.value);
                return;
            }
            if (event.target.id === 'ipam-status-filter') {
                ipamStatusFilter = event.target.value;
                renderContent();
                return;
            }
            if (event.target.id === 'device-assignment-filter') { deviceAssignmentFilter = event.target.value; renderContent(); return; }
            if (event.target.id === 'device-status-filter') {
                deviceStatusFilter = event.target.value;
                renderContent();
                return;
            }
            if (event.target.id === 'device-type-filter') {
                deviceTypeFilter = event.target.value;
                renderContent();
                return;
            }
            if (event.target.id === 'device-location-filter') { deviceLocationFilter = event.target.value; renderContent(); return; }
            if (event.target.id === 'device-mount-filter') { deviceMountFilter = event.target.value; renderContent(); return; }
            if (event.target.id === 'device-sort') {
                deviceSort = event.target.value;
                renderContent();
                return;
            }
            const target = event.target.closest('[data-action]');
            if (!target) return;

            switch (target.dataset.action) {
                case 'import-file':
                    importData({ target });
                    break;
                case 'device-location-change':
                    handleDeviceLocationSelectionChange(target);
                    break;
                case 'device-mount-type-change':
                    toggleDeviceMountType();
                    break;
                case 'device-ip-select':
                    handleDeviceIpSelection();
                    break;
                case 'device-block-change': refreshDeviceSubnetSelectionCascade('block'); break;
                case 'device-subnet-change':
                    handleDeviceSubnetChange();
                    break;
                default:
                    break;
            }
        });



        const rackAccessoryTypeDefinitions = {
            blank: {label:'Blanking plate',icon:'fa-grip-lines'},
            patch: {label:'Patch panel',icon:'fa-network-wired'},
            brush: {label:'Brush panel',icon:'fa-grip'},
            cable: {label:'Cable manager',icon:'fa-bars-staggered'},
            shelf: {label:'Rack shelf',icon:'fa-layer-group'},
            pdu_horizontal: {label:'Horizontal rack PDU',icon:'fa-plug'},
            ventilation: {label:'Ventilation panel',icon:'fa-wind'},
            fan_tray: {label:'Fan tray',icon:'fa-fan'},
            environmental_sensor: {label:'Environmental sensor (rack-mounted)',icon:'fa-temperature-half'},
            pdu_vertical: {label:'Vertical PDU',icon:'fa-plug',vertical:true},
            cable_vertical: {label:'Vertical Cable Manager',icon:'fa-bars-staggered',vertical:true}
        };
        // CSS-only rack fascia art; no external images or data changes.
        function validateRackAccessoryPlacement(candidate, excludeId = null) {
            const rack = appState.racks.find(r=>r.id===candidate.rackId);
            if (!rack || !['front','rear'].includes(candidate.face)) return 'Choose a valid rack and face.';
            const start = Number(candidate.startU), height = Number(candidate.heightU);
            const vertical=(candidate.type==='pdu_vertical'||candidate.type==='cable_vertical');
            if (!Number.isInteger(start) || !Number.isInteger(height) || height<1 || height>(vertical?Number(rack.heightU):12) || start<1 || start+height-1>Number(rack.heightU)) return `Accessory must fit within U1–U${rack.heightU}.`;
            if(vertical && !['left','right'].includes(candidate.side)) return 'Choose left or right as viewed from this face.';
            const end = start+height-1;
            if(vertical){
                if((appState.rackAccessories||[]).some(a=>a.id!==excludeId && a.rackId===candidate.rackId && (a.type==='pdu_vertical'||a.type==='cable_vertical') && a.face===candidate.face && a.side===candidate.side && start<=Number(a.startU)+Number(a.heightU)-1 && end>=Number(a.startU)))return 'This side rail is occupied at the selected height.';
                return null;
            }
            if (appState.devices.some(d=>isRackMountedDevice(d)&&d.rackId===candidate.rackId && (d.face||'front')===candidate.face && start<=Number(d.rackUEnd||d.rackUStart) && end>=Number(d.rackUStart))) return 'This position overlaps a mounted device.';
            if ((appState.rackAccessories||[]).some(a=>a.id!==excludeId && a.rackId===candidate.rackId && a.type!=='pdu_vertical' && a.type!=='cable_vertical' && a.face===candidate.face && start<=a.startU+a.heightU-1 && end>=a.startU)) return 'This position overlaps another accessory.';
            return null;
        }
        function renderRackVerticalAccessoryRail(rack, accessories, side){
            const height=Number(rack.heightU)||42;
            const items=accessories.filter(a=>a.side===side);
            const blocks=items.map(a=>{
                const bottom=(Number(a.startU)-1)/height*100, span=Number(a.heightU)/height*100;
                const label=a.name||rackAccessoryTypeDefinitions[a.type]?.label||'0U accessory';
                const title=escapeHtml(label+' · U'+a.startU+'–U'+(Number(a.startU)+Number(a.heightU)-1)+' · '+side);
                return renderInterfaceTemplate("racks/blocks-1",[escapeHtml(a.id),title,title,escapeHtml(a.id),a.type==='pdu_vertical'?'rack-vertical-pdu':'rack-vertical-cable cable',bottom,span,escapeHtml(label)]);
            }).join('');
            return `<div class="rack-side-rail rack-vertical-rail vertical-rack-accessory-rail" data-rack-id="${escapeHtml(rack.id)}" data-side="${side}" aria-label="${side} 0U rail as viewed from ${activeRackFace} face"><button type="button" data-action="add-vertical-rack-accessory" data-side="${side}" data-rack-id="${escapeHtml(rack.id)}" class="rail-add vertical-rack-accessory-add-control" title="Add vertical 0U accessory on ${side}" aria-label="Add vertical 0U accessory on ${side}"></button>${blocks}</div>`;
        }
        function openRackAccessoryEditor(rackId, startU = 1, editId = null) {
            if (!nextRackBridge?.canEdit()) {
                showToast('Racks edit permission required.', 'error');
                return;
            }
            const rack=appState.racks.find(r=>r.id===rackId);
            if(!rack) return;
            const existing=(appState.rackAccessories||[]).find(a=>a.id===editId);
            const type=existing?.type||selectedRackAccessoryType;
            const verticalWorkflow=!!rackAccessoryTypeDefinitions[type]?.vertical;
            const face=existing?.face||activeRackFace;
            const safeRackHeight = Number(rack.heightU);
            const rackLimit = Number.isInteger(safeRackHeight) && safeRackHeight >= 1 && safeRackHeight <= 100 ? safeRackHeight : 42;
            const safeStart = Number(existing?.startU ?? startU);
            const safeHeight = Number(existing?.heightU ?? 1);
            const start = Number.isInteger(safeStart) && safeStart >= 1 && safeStart <= rackLimit ? safeStart : 1;
            const height = Number.isInteger(safeHeight) && safeHeight >= 1 && safeHeight <= (rackAccessoryTypeDefinitions[type]?.vertical?rackLimit:12) ? safeHeight : 1;
            const modal=document.getElementById('modal-container');
            const modalContent = document.getElementById('modal-content');
            modalContent.classList.remove('rack-balanced-modal');
            modalContent.innerHTML=renderInterfaceTemplate("racks/open-rack-accessory-editor-2",[existing?(verticalWorkflow?'Edit Vertical 0U Accessory':'Edit Horizontal Accessory Placement'):verticalWorkflow?'Add Vertical 0U Accessory':'Place Horizontal Accessory',verticalWorkflow?'Manage a vertical 0U accessory on the left or right rail. Rail accessories do not occupy central rack U slots.':'Place a horizontal rack accessory into free U positions on the selected face.',verticalWorkflow?'Vertical Accessory Type':'Horizontal Accessory Type',Object.entries(rackAccessoryTypeDefinitions).filter(([key,item])=>!!item.vertical===verticalWorkflow).map(([key,item])=>`<option value="${key}" ${type===key?'selected':''}>${item.label}</option>`).join(''),type==='patch'?'':'display:none;',type==='patch'?'required':'disabled',Number(existing?.portCount)===12?'selected':'',![12,48].includes(Number(existing?.portCount))?'selected':'',Number(existing?.portCount)===48?'selected':'',escapeHtml(existing?.name||''),face==='front'?'selected':'',face==='rear'?'selected':'',rackAccessoryTypeDefinitions[type]?.vertical?'':'display:none;',existing?.side==='left'?'selected':'',existing?.side==='right'?'selected':'',verticalWorkflow?'Vertical Span (U)':'Height (U)',rackAccessoryTypeDefinitions[type]?.vertical?rackLimit:12,height,existing?renderInterfaceTemplate("racks/open-rack-accessory-editor-1",[]):'',existing?'Save changes':'Place accessory']);
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            const form=modal.querySelector('#rack-accessory-form');
            modal.querySelector('#rack-accessory-remove-button')?.addEventListener('click',()=>requestRackAccessoryDeletion(existing.id));
            const typeSelect=modal.querySelector('#rack-accessory-form [name="type"]');
            const portField=modal.querySelector('#rack-port-field');
            const portSelect=modal.querySelector('#rack-accessory-form [name="portCount"]');
            const faceSelect=modal.querySelector('#rack-accessory-form [name="face"]');
            const startSelect=modal.querySelector('#rack-accessory-form [name="startU"]');
            const heightInput=modal.querySelector('#rack-accessory-form [name="heightU"]');
            const positionHint=modal.querySelector('#rack-position-hint');
            const sideField=modal.querySelector('#rack-side-field');
            const sideSelect=modal.querySelector('#rack-accessory-form [name="side"]');
            function refreshAccessoryOptions() {
                const isPatch=typeSelect.value==='patch';
                const isVertical=!!rackAccessoryTypeDefinitions[typeSelect.value]?.vertical;
                sideField.style.display=isVertical?'':'none';
                heightInput.max=String(isVertical?rackLimit:12);
                portField.style.display=isPatch?'':'none';
                portSelect.disabled=!isPatch;
                portSelect.required=isPatch;
                const previous=startSelect.value||String(start);
                const h=Number(heightInput.value);
                const options=[];
                if(Number.isInteger(h)&&h>=1&&h<=(isVertical?rackLimit:12)) {
                    for(let u=1;u+h-1<=rackLimit;u++) {
                        const candidate={rackId,type:typeSelect.value,side:sideSelect.value,face:faceSelect.value,startU:u,heightU:h};
                        if(!validateRackAccessoryPlacement(candidate,existing?.id)) options.push(u);
                    }
                }
                startSelect.replaceChildren();
                for(const u of options) {
                    const option=document.createElement('option');
                    option.value=String(u);
                    option.textContent=h===1?'U'+u:'U'+u+'–U'+(u+h-1);
                    startSelect.appendChild(option);
                }
                if(options.includes(Number(previous))) startSelect.value=previous;
                else if(options.includes(start)) startSelect.value=String(start);
                else if(options.length) startSelect.value=String(options[0]);
                startSelect.disabled=options.length===0;
                positionHint.textContent=options.length
                    ? options.length+' available starting position'+(options.length===1?'':'s')+' on the '+faceSelect.value+(isVertical?' '+sideSelect.value+' 0U rail.':' face.')
                    : 'No available positions for this height and face. Change the height or face.';
            }
            typeSelect.addEventListener('change',refreshAccessoryOptions);
            sideSelect.addEventListener('change',refreshAccessoryOptions);
            faceSelect.addEventListener('change',refreshAccessoryOptions);
            heightInput.addEventListener('change',refreshAccessoryOptions);
            heightInput.addEventListener('blur',refreshAccessoryOptions);
            refreshAccessoryOptions();
            modal.querySelector('#rack-accessory-form').addEventListener('submit',async event=>{
                event.preventDefault();
                if(startSelect.disabled){modal.querySelector('#rack-accessory-form-error').textContent='No available rack position for this accessory.';return;}
                const data=new FormData(event.currentTarget);
                const candidate={id:existing?.id||('acc-'+Date.now()+'-'+Math.random().toString(36).slice(2,8)),rackId,type:rackShelfReturnContext?'shelf':String(data.get('type')),name:String(data.get('name')).trim(),face:String(data.get('face')),startU:Number(data.get('startU')),heightU:Number(data.get('heightU')),side:rackAccessoryTypeDefinitions[String(data.get('type'))]?.vertical?String(data.get('side')):null,portCount:String(data.get('type'))==='patch'?Number(data.get('portCount')):null};
                const error=(!!rackAccessoryTypeDefinitions[candidate.type]?.vertical!==verticalWorkflow)?'Choose an accessory type for this placement.':(candidate.type==='patch' && ![12,24,48].includes(candidate.portCount))?'Choose a valid patch panel port count.':validateRackAccessoryPlacement(candidate,existing?.id);
                if(error){modal.querySelector('#rack-accessory-form-error').textContent=error;return;}
                const before=JSON.stringify(appState);
                if(!Array.isArray(appState.rackAccessories))appState.rackAccessories=[];
                if(existing)Object.assign(existing,candidate);else appState.rackAccessories.push(candidate);
                if (!await nextRackBridge.saveAccessory(candidate.id,candidate)) {
                    appState=JSON.parse(before);
                    const feedback=modal.querySelector('#rack-accessory-form-error');
                    if(feedback)feedback.textContent='Accessory could not be saved. Your previous inventory is unchanged. Your entries are still here so you can try again.';
                    return;
                }
                if(rackShelfReturnContext){returnFromRackShelfCreation(candidate);return;}
                closeModal();activeRackFace=candidate.face;renderContent();
            });
        }
        function requestRackAccessoryDeletion(id){
            const accessory=(appState.rackAccessories||[]).find(a=>a.id===id);
            if(!accessory||document.getElementById('remove-confirm'))return;
            if(accessory.type==='shelf'&&appState.devices.some(d=>d.rackShelfAccessoryId===id)){void openRackShelfRemovalReview(id);return;}
            const overlay=document.createElement('div');
            overlay.id='remove-confirm';
            overlay.className='fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4';
            overlay.setAttribute('role','alertdialog');
            overlay.setAttribute('aria-modal','true');
            overlay.setAttribute('aria-labelledby','rack-remove-title');
            overlay.innerHTML=renderInterfaceTemplate("racks/request-rack-accessory-deletion-1",[escapeHtml(accessory.name||rackAccessoryTypeDefinitions[accessory.type]?.label||'accessory')]);
            const previousFocus=document.activeElement;
            document.body.appendChild(overlay);
            const cancel=()=>{overlay.remove();if(previousFocus?.isConnected)previousFocus.focus();};
            overlay.querySelector('#remove-cancel').addEventListener('click',cancel);
            overlay.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();cancel();}});
            overlay.querySelector('#remove-cancel').focus();
            overlay.querySelector('#remove-accept').addEventListener('click',async ()=>{
            overlay.remove();
            const before=JSON.stringify(appState);
            appState.rackAccessories=appState.rackAccessories.filter(a=>a.id!==id);
            if (!nextRackBridge || !await nextRackBridge.saveAccessory(id,null)) {
                appState=JSON.parse(before);
                showToast('Accessory could not be removed. Your previous inventory is unchanged.','error');
                return;
            }
            closeModal();renderContent();
            });
        }
        async function moveRackAccessoryToPosition(id,rackId,startU){
            const a=(appState.rackAccessories||[]).find(x=>x.id===id);
            if(!a)return false;
            if(rackAccessoryTypeDefinitions[a.type]?.vertical)return false;
            const candidate={...a,rackId,face:activeRackFace,startU:Number(startU)};
            const error=validateRackAccessoryPlacement(candidate,id);
            if(error){showToast(error,'error');return false;}
            const before=JSON.stringify(appState);Object.assign(a,candidate);
            if (!nextRackBridge || !await nextRackBridge.saveAccessory(id,candidate)) {
                appState=JSON.parse(before);
                showToast('Accessory move could not be saved. Original placement restored.','error');
                return false;
            }
            renderRackViewPreservingScrollPosition();return true;
        }

        // single validated pathway for drag/drop and accessible click-to-move.
        async function moveDeviceToRackPosition(deviceId, rackId, targetU) {
            const device = appState.devices.find(d => d.id === deviceId);
            if (!device || !rackId) { showToast('Device or rack was not found.', 'error'); return false; }
            const height = Math.max(1, Number(device.rackUHeight) || (Number(device.rackUEnd) - Number(device.rackUStart) + 1) || 1);
            const start = Number(targetU);
            const end = start + height - 1;
            const error = validateRackPlacement(device.id, rackId, activeRackFace, start, end);
            if (error) { showToast(error, 'error'); return false; }
            const before = JSON.stringify(appState);
            device.rackId = rackId;
            device.face = activeRackFace;
            device.rackUStart = start;
            device.rackUEnd = end;
            device.rackUHeight = height;
            device.mountType = 'Rack Mounted';
            // Drag-and-drop rack placement must preserve the physical location.
            if (!nextRackBridge || !await nextRackBridge.savePlacement(deviceId)) {
                appState = JSON.parse(before);
                showToast('Move could not be saved; original placement restored.', 'error');
                return false;
            }
            draggedRackDeviceId = null;
            renderRackViewPreservingScrollPosition();
            return true;
        }
        function updateRackDragPointerLabel(event, label, invalid = false) {
            let pointerLabel = document.querySelector('.rack-drag-hud');
            if (!pointerLabel) {
                pointerLabel = document.createElement('div');
                pointerLabel.setAttribute('aria-hidden', 'true');
                document.body.appendChild(pointerLabel);
            }
            pointerLabel.className = 'rack-drag-hud' + (invalid ? ' invalid' : '');
            pointerLabel.textContent = label;
            // Keep the candidate's position visible even when a tall accessory's ends are off-screen.
            const bounds = pointerLabel.getBoundingClientRect();
            pointerLabel.style.left = Math.max(0, Math.min(event.clientX + 16, window.innerWidth - bounds.width - 8)) + 'px';
            pointerLabel.style.top = Math.max(0, Math.min(event.clientY + 16, window.innerHeight - bounds.height - 8)) + 'px';
        }
        function clearRackDragPointerLabel() {
            document.querySelectorAll('.rack-drag-hud').forEach(element => element.remove());
        }
        function clearRackDropPreview() {
            clearRackDragPointerLabel();
            document.querySelectorAll('.rack-drag-preview').forEach(el => el.remove());
            document.querySelectorAll('.rack-drag-target').forEach(el => el.classList.remove('rack-drag-target'));
        }
        function renderRackViewPreservingScrollPosition() {
            const previous = document.querySelector('[data-rack-scroll="true"]');
            const scrollTop = previous ? previous.scrollTop : 0;
            renderContent();
            const next = document.querySelector('[data-rack-scroll="true"]');
            if (next) next.scrollTop = scrollTop;
        }
        // drag near the top/bottom of the rack viewport to scroll its
        // contents, not the surrounding page. Never alter rack placement rules.
        let rackDragAutoScrollFrame = null;
        let rackDragAutoScrollContainer = null;
        let rackDragAutoScrollSpeed = 0;
        function stopRackDragAutoScroll() {
            if (rackDragAutoScrollFrame !== null) cancelAnimationFrame(rackDragAutoScrollFrame);
            rackDragAutoScrollFrame = null;
            rackDragAutoScrollContainer = null;
            rackDragAutoScrollSpeed = 0;
        }
        function tickRackDragAutoScroll() {
            if (!draggedRackDeviceId && !draggedRackAccessoryId) { stopRackDragAutoScroll(); return; }
            const pane = rackDragAutoScrollContainer;
            if (!pane || !pane.isConnected || !rackDragAutoScrollSpeed) { stopRackDragAutoScroll(); return; }
            const oldTop = pane.scrollTop;
            pane.scrollTop = Math.max(0, Math.min(pane.scrollHeight - pane.clientHeight, oldTop + rackDragAutoScrollSpeed));
            if (pane.scrollTop === oldTop) { stopRackDragAutoScroll(); return; }
            rackDragAutoScrollFrame = requestAnimationFrame(tickRackDragAutoScroll);
        }
        function trackRackDrag(event) {
            if (!draggedRackDeviceId && !draggedRackAccessoryId) return;
            const pane = document.querySelector('[data-rack-scroll="true"]');
            if (!pane) return;
            const bounds = pane.getBoundingClientRect();
            // The bottom of the rack can be below the Safari viewport when the
            // rack workspace is opened part-way down the document. Use only the
            // visible intersection, so scrolling begins before the macOS Dock.
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            const visibleTop = Math.max(bounds.top, 0);
            const visibleBottom = Math.min(bounds.bottom, viewportHeight - 24);
            const visibleHeight = visibleBottom - visibleTop;
            if (visibleHeight < 35) { stopRackDragAutoScroll(); return; }
            const withinX = event.clientX >= bounds.left && event.clientX <= bounds.right;
            const withinY = event.clientY >= visibleTop - 45 && event.clientY <= visibleBottom + 45;
            if (!withinX || !withinY) { stopRackDragAutoScroll(); return; }
            // Prevent Safari from interpreting a rack drag as a document drag.
            event.preventDefault();
            if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
            const edge = Math.min(105, Math.max(28, visibleHeight * 0.35));
            const topDistance = event.clientY - visibleTop;
            const bottomDistance = visibleBottom - event.clientY;
            let speed = 0;
            if (topDistance < edge) speed = -Math.max(3, (edge - topDistance) / edge * 17);
            else if (bottomDistance < edge) speed = Math.max(3, (edge - bottomDistance) / edge * 17);
            if (!speed) { stopRackDragAutoScroll(); return; }
            rackDragAutoScrollContainer = pane;
            rackDragAutoScrollSpeed = speed;
            if (rackDragAutoScrollFrame === null) rackDragAutoScrollFrame = requestAnimationFrame(tickRackDragAutoScroll);
        }
        document.addEventListener('dragover', trackRackDrag);
        function getVerticalRackAccessoryDropTarget(event,rail,accessory){
            const rack=appState.racks.find(r=>r.id===rail.dataset.rackId);
            if(!rack)return null;
            const bounds=rail.getBoundingClientRect(), total=Number(rack.heightU),height=Number(accessory.heightU);
            if(!total||bounds.height<=0||height>total)return null;
            const pointerU=Math.floor((bounds.bottom-event.clientY)/bounds.height*total)+1;
            const startU=Math.max(1,Math.min(total-height+1,pointerU-Math.floor(height/2)));
            const candidate={...accessory,rackId:rack.id,face:activeRackFace,side:rail.dataset.side,startU};
            return {candidate,error:validateRackAccessoryPlacement(candidate,accessory.id),total};
        }
        function clearVerticalRackAccessoryDragPreview(){
            clearRackDragPointerLabel();
            document.querySelectorAll('.rack-vertical-drop-preview').forEach(el=>el.remove());
            document.querySelectorAll('.vertical-rack-accessory-rail').forEach(el=>el.classList.remove('rack-vertical-drop-valid','rack-vertical-drop-invalid'));
        }
        document.addEventListener('dragstart',event=>{
            const source=event.target.closest('[data-vertical-accessory]');
            if (source && !nextRackBridge?.canEdit()) { event.preventDefault(); return; }
            if(!source)return;
            draggedVerticalRackAccessoryId=source.dataset.verticalAccessory;
            event.dataTransfer.effectAllowed='move';
            event.dataTransfer.setData('text/plain',draggedVerticalRackAccessoryId);
            event.stopImmediatePropagation();
        });
        document.addEventListener('dragover',event=>{
            if(!draggedVerticalRackAccessoryId)return;
            const rail=event.target.closest('.vertical-rack-accessory-rail');
            if(!rail){clearVerticalRackAccessoryDragPreview();return;}
            event.preventDefault();event.stopImmediatePropagation();
            const a=(appState.rackAccessories||[]).find(a=>a.id===draggedVerticalRackAccessoryId);
            if(!a)return;
            const placement=getVerticalRackAccessoryDropTarget(event,rail,a);
            clearVerticalRackAccessoryDragPreview();
            if(!placement)return;
            const invalid=!!placement.error;
            rail.classList.add(invalid?'rack-vertical-drop-invalid':'rack-vertical-drop-valid');
            const preview=document.createElement('div');
            preview.className='rack-vertical-drop-preview rack-drop-preview'+(invalid?' rack-vertical-drop-invalid invalid':'');
            preview.style.bottom=((placement.candidate.startU-1)/placement.total*100)+'%';
            preview.style.height=(Number(a.heightU)/placement.total*100)+'%';
            const range = 'U' + placement.candidate.startU + '–U' + (placement.candidate.startU + Number(a.heightU) - 1);
            const label = (invalid ? 'Occupied / invalid · ' : 'Move to ') + range;
            const previewLabel = document.createElement('span');
            previewLabel.className = 'rack-drop-preview-label';
            previewLabel.textContent = label;
            preview.appendChild(previewLabel);
            preview.setAttribute('aria-hidden', 'true');
            rail.appendChild(preview);
            updateRackDragPointerLabel(event, label, invalid);
            event.dataTransfer.dropEffect=invalid?'none':'move';
        });
        document.addEventListener('drop',async event=>{
            if(!draggedVerticalRackAccessoryId)return;
            event.preventDefault();event.stopImmediatePropagation();
            const rail=event.target.closest('.vertical-rack-accessory-rail');
            const a=(appState.rackAccessories||[]).find(a=>a.id===draggedVerticalRackAccessoryId);
            const placement=rail&&a?getVerticalRackAccessoryDropTarget(event,rail,a):null;
            draggedVerticalRackAccessoryId=null;
            clearVerticalRackAccessoryDragPreview();
            if(!placement||placement.error){if(placement?.error)showToast(placement.error,'error');return;}
            const before=JSON.stringify(appState);
            Object.assign(a,placement.candidate);
            if (!nextRackBridge || !await nextRackBridge.saveAccessory(a.id, a)) {
                appState=JSON.parse(before);
                showToast('Accessory move could not be saved. Original placement restored.','error');
                return;
            }
            renderRackViewPreservingScrollPosition();
        });
        document.addEventListener('dragend',()=>{
            draggedVerticalRackAccessoryId=null;clearVerticalRackAccessoryDragPreview();
        });
        let rackDeviceDragGrabOffsetU = null;
        document.addEventListener('dragstart', event => {
            const source = event.target.closest('[data-rack-device]');
            const accessory=event.target.closest('[data-rack-accessory]');
            if(!source&&!accessory)return;
            if (!nextRackBridge?.canEdit()) { event.preventDefault(); return; }
            // Remember which U within the dragged item was grabbed, so moving
            // across an empty U does not jump by the full equipment height.
            const grabbed=source||accessory;
            const grabbedRect=grabbed.getBoundingClientRect();
            const grabbedHeight=accessory?Number((appState.rackAccessories||[]).find(a=>a.id===accessory.dataset.rackAccessory)?.heightU)||1:
                Math.max(1,Number(appState.devices.find(d=>d.id===source.dataset.rackDevice)?.rackUHeight)||1);
            rackDeviceDragGrabOffsetU=grabbedRect.height>0?
                grabbedHeight-1-Math.min(grabbedHeight-1,Math.max(0,Math.floor((event.clientY-grabbedRect.top)/grabbedRect.height*grabbedHeight))):0;
            draggedRackAccessoryId=accessory?.dataset.rackAccessory||null;
            draggedRackDeviceId = source?.dataset.rackDevice||null;
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', draggedRackDeviceId || draggedRackAccessoryId || 'rack-item');
            // Safari can use the full multi-U rack row as its native drag image,
            // making it look like the entire rack is being pulled beyond the screen.
            // Replace it with a small, fixed-size label that follows the pointer.
            if (typeof event.dataTransfer.setDragImage === 'function') {
                const ghost = document.createElement('div');
                ghost.textContent = (source || accessory).querySelector('.rack-device-name')?.textContent?.trim() || 'Rack equipment';
                ghost.style.cssText = 'position:fixed;top:0;left:0;width:190px;max-width:190px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:10px 12px;border-radius:8px;background:#14532d;color:#fff;font:600 13px system-ui;pointer-events:none;z-index:2147483647';
                document.body.appendChild(ghost);
                try { event.dataTransfer.setDragImage(ghost, 20, 20); } catch (_) {}
                requestAnimationFrame(() => ghost.remove());
            }
        });
        // Resolve the pointer against the rendered rack rows.
        function getRackDropPosition(event,target) {
            const grid=target.closest('[data-rack-u-grid]');
            if (!grid) return Number(target.dataset.rackDropU);
            // Resolve the actual rendered row, including a multi-U item. A whole-grid
            // average can select the neighbouring U when rows have different heights.
            const rows=[...grid.querySelectorAll(':scope > [data-rack-drop-u]')];
            const row=rows.find(element=>{
                const bounds=element.getBoundingClientRect();
                return event.clientY>=bounds.top && event.clientY<bounds.bottom;
            });
            if (!row) return null;
            const bounds=row.getBoundingClientRect();
            const span=Math.max(1,Number(row.dataset.rackSpan)||1);
            const offset=Math.min(span-1,Math.max(0,Math.floor((event.clientY-bounds.top)/bounds.height*span)));
            return Number(row.dataset.rackDropU)-offset-(rackDeviceDragGrabOffsetU??0);
        }
        document.addEventListener('dragover', event => {
            const grid = event.target.closest('[data-rack-u-grid]');
            const target = grid?.querySelector('[data-rack-drop-u]');
            if (!target || (!draggedRackDeviceId&&!draggedRackAccessoryId)) return;
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
            const device = appState.devices.find(d => d.id === draggedRackDeviceId);
            const accessory=(appState.rackAccessories||[]).find(a=>a.id===draggedRackAccessoryId);
            if (!device&&!accessory) return;
            const height = accessory?accessory.heightU:Math.max(1, Number(device.rackUHeight) || (Number(device.rackUEnd) - Number(device.rackUStart) + 1) || 1);
            const startU = getRackDropPosition(event,target);
            if (startU === null) { clearRackDropPreview(); return; }
            const rackId = target.dataset.rackDropId;
            const error = accessory?validateRackAccessoryPlacement({...accessory,rackId,face:activeRackFace,startU},accessory.id):validateRackPlacement(device.id, rackId, activeRackFace, startU, startU + height - 1);
            // The pointer can move between U positions within one tall rack item.
            // Refresh the preview even when the drop target element is unchanged.
            clearRackDropPreview();
            target.classList.add('rack-drag-target');
            const preview = document.createElement('div');
            preview.className = 'rack-drag-preview rack-drop-preview' + (error ? ' rack-drop-invalid invalid' : '');
            preview.style.pointerEvents = 'none';
            preview.style.height = `${height * 40}px`;
            // Rack grid runs from U1 at its bottom. Use that common origin
            // regardless of the height of the element receiving dragover.
            preview.style.bottom = `${(startU-1)*40}px`;
            const range = height === 1 ? 'U' + startU : 'U' + startU + '–U' + (startU + Number(height) - 1);
            const label = (error ? 'Occupied / invalid · ' : 'Move to ') + range;
            const previewLabel = document.createElement('span');
            previewLabel.className = 'rack-drop-preview-label';
            previewLabel.textContent = label;
            preview.appendChild(previewLabel);
            updateRackDragPointerLabel(event, label, !!error);
            event.dataTransfer.dropEffect = error ? 'none' : 'move';
            preview.setAttribute('aria-hidden', 'true');
            grid.appendChild(preview);
        });
        document.addEventListener('dragover', event => {
            if ((!draggedRackDeviceId && !draggedRackAccessoryId) || event.target.closest('[data-rack-u-grid]')) return;
            clearRackDropPreview();
        });
        document.addEventListener('drop', event => {
            stopRackDragAutoScroll();
            const grid = event.target.closest('[data-rack-u-grid]');
            const target = grid?.querySelector('[data-rack-drop-u]');
            if (!target || (!draggedRackDeviceId&&!draggedRackAccessoryId)) { clearRackDropPreview(); return; }
            event.preventDefault();
            const deviceId = draggedRackDeviceId, accessoryId=draggedRackAccessoryId;
            // Resolve placement before clearing the preview or drag state.
            // Clearing can change the grid geometry and must not affect the drop.
            const startU = getRackDropPosition(event,target);
            if (startU === null) { clearRackDropPreview(); return; }
            const rackId = target.dataset.rackDropId;
            draggedRackDeviceId = null;draggedRackAccessoryId=null;
            clearRackDropPreview();
            if(accessoryId)moveRackAccessoryToPosition(accessoryId,rackId,startU);
            else moveDeviceToRackPosition(deviceId,rackId,startU);
        });
        document.addEventListener('dragend', () => {
            stopRackDragAutoScroll();
            draggedRackDeviceId = null;draggedRackAccessoryId=null;
            rackDeviceDragGrabOffsetU=null;
            clearRackDropPreview();
        });

        // Approved catalogue search filters the visible saved categories only.
        document.addEventListener('input', function(event) {
            const input = event.target;
            if (!input.matches('input[data-catalogue-search]')) return;
            const field = input.dataset.catalogueSearch;
            if (!['type','location'].includes(field)) return;
            const list = document.querySelector('#main-content [data-catalog-list="'+field+'"]');
            if (!list) return;
            const query = input.value.trim().toLocaleLowerCase();
            let visible = 0;
            const items = [...list.querySelectorAll('[data-catalog-row="'+field+'"]')];
            items.forEach(row => {
                row.hidden = query !== '' && !(row.dataset.filterText || '').includes(query);
                if (!row.hidden) visible++;
            });
            const count = document.querySelector('#main-content [data-catalogue-count="'+field+'"]');
            if (count) count.textContent = 'Showing ' + visible + ' of ' + items.length + ' categories';
        });

        // centralised event delegation for dynamically-rendered controls.
        // Buttons/links carry data-action rather than inline JavaScript. This keeps
        // user-entered values out of executable HTML attributes and means one handler
        // continues to work after renderContent() replaces #main-content.
        document.addEventListener('click', function(event) {
            const target = event.target.closest('[data-action]');
            if (!target) return;

            const action = target.dataset.action;
            const id = target.dataset.id;
            const name = target.dataset.name;
            if (target.matches('input[type="file"]')) return;
            event.preventDefault();

            switch (action) {
                case 'clear-catalogue-list-search': {
                    const field = target.dataset.catalogue;
                    if (!['type','location'].includes(field)) break;
                    const input = document.querySelector('#main-content [data-catalogue-search="'+field+'"]');
                    if (input) {
                        input.value = '';
                        input.dispatchEvent(new Event('input',{bubbles:true}));
                        input.focus();
                    }
                    break;
                }
                case 'clear-device-filters': deviceServiceFilter = ''; deviceMissingFilter = ''; deviceOsFilter = ''; deviceSearchTerm = ''; deviceTypeFilter = ''; deviceStatusFilter = ''; deviceLocationFilter = ''; deviceMountFilter = ''; deviceAssignmentFilter = ''; deviceHardwareFilter = null; renderContent(); break;
                case 'inventory-tab': if (['inventory','manage'].includes(target.dataset.tab)) { activeDeviceDetailsTab=target.dataset.tab==='manage'?'types':target.dataset.tab; switchTab('devices'); } break;
                case 'sidebar-devices-overview': activeDeviceDetailsTab='overview'; switchTab('devices'); break;
                case 'device-intelligence-tab': if (['overview','hardware','os','software','quality'].includes(target.dataset.tab)) { deviceIntelligenceTab=target.dataset.tab; renderContent(); } break;
                case 'device-hardware-drilldown': { const field=String(target.dataset.field||''); const value=String(target.dataset.value||''); if (!['manufacturer','model','mountType'].includes(field) || !value) break; deviceOsFilter=''; deviceServiceFilter=''; deviceMissingFilter=''; deviceSearchTerm=''; deviceTypeFilter=''; deviceStatusFilter=''; deviceLocationFilter=''; deviceMountFilter=''; deviceAssignmentFilter=''; deviceHardwareFilter={field,value}; activeDeviceDetailsTab='inventory'; switchTab('devices'); break; }
                case 'device-os-drilldown': { const os=String(target.dataset.os||''); if (!os) break; deviceServiceFilter=''; deviceMissingFilter=''; deviceOsFilter=os; deviceHardwareFilter=null; deviceSearchTerm=''; deviceTypeFilter=''; deviceStatusFilter=''; deviceLocationFilter=''; deviceMountFilter=''; deviceAssignmentFilter=''; activeDeviceDetailsTab='inventory'; switchTab('devices'); break; }
                case 'device-intelligence-drilldown': { const kind=String(target.dataset.kind||''); const value=String(target.dataset.value||''); if (!['type','location','service','missing'].includes(kind) || !value) break; deviceOsFilter=''; deviceServiceFilter=''; deviceMissingFilter=''; deviceSearchTerm=''; deviceTypeFilter=''; deviceStatusFilter=''; deviceLocationFilter=''; deviceMountFilter=''; deviceAssignmentFilter=''; deviceHardwareFilter=null; if (kind==='type' && value!=='Not Recorded') deviceTypeFilter=value==='Server' ? 'Server - Physical' : value==='Virtual Machine' ? 'Server - Virtual' : value; else if(kind==='location' && value!=='Not Recorded') deviceLocationFilter=value; else if(kind==='service') deviceServiceFilter=value; else if(kind==='missing' && ['ip','type','location'].includes(value)) deviceMissingFilter=value; else if(kind==='type' && value==='Not Recorded') deviceMissingFilter='type'; else if(kind==='location' && value==='Not Recorded') deviceMissingFilter='location'; activeDeviceDetailsTab='inventory'; switchTab('devices'); break; }
                case 'open-catalogue-details': {
                    deviceSearchTerm=''; deviceTypeFilter=''; deviceLocationFilter=''; deviceOsFilter=''; deviceServiceFilter=''; deviceMissingFilter=''; deviceHardwareFilter=null; deviceStatusFilter=''; deviceMountFilter=''; deviceAssignmentFilter='';
                    if(target.dataset.name==='Not Recorded')deviceMissingFilter=target.dataset.kind==='type'?'type':'location';
                    else if(target.dataset.kind==='type')deviceTypeFilter=target.dataset.name;
                    else deviceLocationFilter=target.dataset.name;
                    activeDeviceDetailsTab='inventory';switchTab('devices');break;
                }
                case 'sidebar-devices-inventory': activeDeviceDetailsTab='inventory'; switchTab('devices'); break;
                case 'sidebar-devices-types': activeDeviceDetailsTab='types'; switchTab('devices'); break;
                case 'sidebar-devices-locations': activeDeviceDetailsTab='locations'; switchTab('devices'); break;
                case 'sidebar-devices-manufacturers': activeDeviceDetailsTab='manufacturers'; switchTab('devices'); break;
                case 'sidebar-devices-models': activeDeviceDetailsTab='models'; switchTab('devices'); break;
                case 'sidebar-devices-software': activeDeviceDetailsTab='software'; switchTab('devices'); break;
                case 'sidebar-devices-services': activeDeviceDetailsTab='services'; switchTab('devices'); break;
                case 'server-catalog-add': openServerServiceEditor(); break;
                case 'server-catalog-edit': openServerServiceEditor(name); break;
                case 'server-catalog-save': saveServerServiceEntry(name); break;
                case 'server-catalog-remove': confirmServerServiceArchive(name); break;
                case 'server-catalog-restore': restoreArchivedServerService(name); break;
                case 'enable-suggested-software': enableSuggestedSoftware(name); break;
                case 'software-toggle': toggleSoftwareForDeviceType(name,target.dataset.type); break;
                case 'software-custom-add': openSoftwareCatalogueEditor(); break;
                case 'software-custom-edit': openSoftwareCatalogueEditor(name); break;
                case 'software-custom-remove': confirmSoftwareCatalogueRemoval(name); break;
                case 'software-custom-confirm-remove': archiveSoftwareCatalogueEntry(name); break;
                case 'software-custom-save': saveCustomSoftwareEntry(name); break;
                case 'software-custom-restore': restoreArchivedSoftwareEntry(name); break;
                case 'software-reset': ['software-search','software-source','software-type'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';}); if(document.getElementById('software-used'))document.getElementById('software-used').checked=false; filterSoftwareCatalogue(); break;
                case 'model-add': openHardwareModelManager(); break;
                case 'built-in-model-edit': openBuiltInHardwareModelEditor(name); break;
                case 'built-in-model-save': saveBuiltInHardwareModelOverride(name); break;
                case 'model-edit': openHardwareModelManager(name); break;
                case 'model-remove': openHardwareModelManager(name,true); break;
                case 'save-catalogue-model': saveHardwareModel(name); break;
                case 'confirm-remove-catalogue-model': saveHardwareModel(name,true); break;
                case 'service-reset': {const field=document.getElementById('service-search');if(field){field.value='';field.dispatchEvent(new Event('input',{bubbles:true}));}break;}
                case 'manufacturer-reset': {const el=document.getElementById('manufacturer-search');if(el){el.value='';el.dispatchEvent(new Event('input',{bubbles:true}));}break;}
                case 'model-reset': ['model-search','hardware-model-manufacturer-filter','model-type','model-source'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';}); if(document.getElementById('hardware-model-in-use'))document.getElementById('hardware-model-in-use').checked=false; filterHardwareModels(); break;
                case 'manufacturer-add': openHardwareManufacturerManager(); break;
                case 'built-in-manufacturer-edit': openBuiltInManufacturerEditor(name); break;
                case 'built-in-manufacturer-save': saveBuiltInManufacturerOverride(name); break;
                case 'manufacturer-edit': openHardwareManufacturerManager(name); break;
                case 'manufacturer-remove': openHardwareManufacturerManager(name,true); break;
                case 'manufacturer-all': document.querySelectorAll('input[name="catalogue-manufacturer-device-type"]:not(:disabled)').forEach(x=>x.checked=true); break;
                case 'manufacturer-none': document.querySelectorAll('input[name="catalogue-manufacturer-device-type"]:not(:disabled)').forEach(x=>x.checked=false); break;
                case 'save-catalogue-manufacturer': saveHardwareManufacturer(name); break;
                case 'confirm-remove-catalogue-manufacturer': saveHardwareManufacturer(name,true); break;
                case 'open-device-modal': openDeviceModal(); break;
                case 'edit-device': openDeviceModal(id); break;
                case 'view-device': openDeviceDetailView(id); break;
                case 'device-editor-back': closeModal(false,()=>openDeviceDetailView(id)); break;
                case 'select-device-details-tab': selectDeviceDetailsTab(name); break;
                case 'archived-software-remove': confirmUninstallOfArchivedSoftware(id,name); break;
                case 'archived-software-confirm-uninstall': recordUninstallOfArchivedSoftware(id,name); break;
                case 'view-hosted-virtual-machine': openDeviceDetailView(id); break;
                case 'edit-device-from-details': openDeviceModal(id); break;
                case 'duplicate-device-from-details': closeModal(); duplicateDevice(id); break;
                case 'delete-device-from-details': closeModal(); deleteDevice(id); break;
                case 'navigate-to-device-rack': navigateToDeviceRack(id); break;
                case 'duplicate-device': duplicateDevice(id); break;
                case 'delete-device': deleteDevice(id); break;
                case 'hardware-catalog-manage': openHardwareCatalogueManager(); break;
                case 'hardware-catalog-add': updateHardwareCatalogue('add'); break;
                case 'hardware-catalog-edit': updateHardwareCatalogue('edit',name); break;
                case 'hardware-catalog-remove': updateHardwareCatalogue('remove',name); break;
                case 'device-inline-quick-open': openInlineDeviceQuickAdd(target.dataset.kind); break;
                case 'device-inline-quick-cancel': cancelInlineDeviceQuickAdd(target.dataset.kind); break;
                case 'device-inline-quick-save': saveInlineDeviceQuickAdd(target.dataset.kind); break;
                case 'manage-installed-software': openConfiguredSoftwareCatalogueManager(); break;
                case 'add-software': updateConfiguredSoftwareCatalogue('add'); break;
                case 'rename-software': updateConfiguredSoftwareCatalogue('rename',name); break;
                case 'delete-software': updateConfiguredSoftwareCatalogue('delete',name); break;
                case 'manage-server-services': openServerServiceManager(); break;
                case 'add-service': updateServerServiceCatalogue('add'); break;
                case 'rename-service': updateServerServiceCatalogue('rename',name); break;
                case 'delete-service': updateServerServiceCatalogue('delete',name); break;
                case 'server-service-confirm-archive': archiveServerService(name); break;
                case 'add-device-type-or-location': applyDeviceCatalogueChange(target.dataset.kind,'add','',document.getElementById('device-catalogue-new-entry-input')?.value||''); break;
                case 'search-device-catalogue': deviceTypeLocationSearchFilters[target.dataset.kind]=document.getElementById('device-catalogue-search-input')?.value||'';openDeviceCatalogueManager(target.dataset.kind); break;
                case 'rack-correction-cancel': resolveRackPlacementCorrection(false); break;
                case 'rack-correction-accept': resolveRackPlacementCorrection(true); break;
                case 'keep-editing': keepEditingDeviceForm(); break;
                case 'discard-device-form-changes': discardDeviceFormChanges(); break;
                case 'save-rename': applyDeviceCatalogueChange(target.dataset.kind,'rename',name,document.getElementById('device-catalogue-rename-value')?.value||''); break;
                case 'cancel-rename': cancelDeviceCatalogueEntryRename(); break;
                case 'rename-device-catalogue-entry': openDeviceTypeOrLocationRename(target.dataset.kind,name); break;
                case 'delete-device-type-or-location': requestDeviceCatalogueEntryDeletion(target.dataset.kind,name); break;
                case 'cancel-delete': cancelDeviceCatalogueEntryDeletion(); break;
                case 'confirm-delete': applyConfirmedDeviceCatalogueEntryDeletion(); break;
                case 'open-manage-types': openManageTypesModal(); break;
                case 'open-manage-locations': openManageLocationsModal(); break;
                case 'add-custom-location': addCustomLocationOption(); break;
                case 'cancel-custom-location': cancelCustomDeviceLocation(); break;
                case 'create-subnet-from-device': createSubnetFromDevice(); break;
                case 'create-rack-from-device': createRackFromDevice(); break;
                case 'create-rack-shelf-from-device': createRackShelfFromDevice(); break;
                case 'cancel-rack-from-device': cancelRackFromDevice(); break;
                case 'delete-device-type': deleteDeviceType(name); break;
                case 'edit-device-type': editDeviceTypePrompt(name); break;
                case 'edit-device-fascia-graphic': openDeviceTypeRackFasciaSettings(name); break;
                case 'save-rack-fascia-graphic': saveDeviceTypeRackFasciaSettings(name); break;
                case 'delete-location': deleteDeviceLocation(name); break;
                case 'edit-location': editDeviceLocationPrompt(name); break;
                case 'open-rack-modal': openRackModal(); break;
                case 'edit-rack': openRackModal(id); break;
                case 'correct-rack-specifications': openRackModal(id, true); break;
                case 'delete-rack': deleteRack(id); break;
                case 'add-rack-accessory': openRackAccessoryEditor(selectedRackId,1); break;
                case 'add-vertical-rack-accessory': selectedRackAccessoryType='pdu_vertical';openRackAccessoryEditor(target.dataset.rackId,1);selectedRackAccessoryType='blank'; {const f=document.querySelector('#rack-accessory-form [name="side"]');if(f){f.value=target.dataset.side;f.dispatchEvent(new Event('change'));}} break;
                case 'edit-rack-accessory': {const a=(appState.rackAccessories||[]).find(a=>a.id===id);if(a)openRackAccessoryEditor(a.rackId,a.startU,id);break;}
                case 'delete-rack-accessory': requestRackAccessoryDeletion(id); break;
                case 'select-rack-tab': if (['view','equipment','settings'].includes(target.dataset.tab)) { activeRackTab=target.dataset.tab; renderContent(); } break;
                case 'select-rack': selectedRackId = id; renderContent(); break;
                case 'rack-face-front': activeRackFace = 'front'; renderContent(); break;
                case 'rack-face-rear': activeRackFace = 'rear'; renderContent(); break;
                case 'rack-face-device': activeRackFace = target.dataset.face || 'front'; activeRackTab = 'view'; renderContent(); break;
                case 'print-rack-capacity-details': printRackElevation(id || selectedRackId); break;
                case 'select-rack-accessory-height': rackAccessoryPlacementHeightU = Number(target.dataset.height) || 1; renderContent(); break;
                case 'mount-rack-accessory': openAssignDeviceModal(selectedRackId, Number(target.dataset.u)); break;
                case 'mount-rack-accessory': {
                    const rack = appState.racks.find(r => r.id === selectedRackId) || appState.racks[0];
                    if (!rack) { showToast('Create a rack first.', 'error'); break; }
                    const candidate = Array.from({length: Number(rack.heightU)}, (_, i) => i + 1).find(u => !validateRackPlacement(null, rack.id, activeRackFace, u, u));
                    openAssignDeviceModal(rack.id, candidate || 1);
                    break;
                }
                case 'place-rack-item': openRackSlotPlacementDialog(target.dataset.rackId, Number(target.dataset.u)); break;
                case 'placement-device': openRackSlotPlacementDialog(target.dataset.rackId, Number(target.dataset.u), 'device'); break;
                case 'placement-accessory': openRackSlotPlacementDialog(target.dataset.rackId, Number(target.dataset.u), 'accessory'); break;
                case 'assign-device': openAssignDeviceModal(target.dataset.rackId, Number(target.dataset.u), target.dataset.deviceId || null); break;
                case 'unassign-device': unassignDevice(id); break;
                case 'open-subnet-modal': openSubnetModal(); break;
                case 'open-multiple-subnets': openMultipleSubnets(); break;
                case 'edit-subnet': openSubnetModal(id); break;
                case 'delete-subnet': deleteSubnet(id); break;
                case 'confirm-delete-subnet': confirmDeleteSubnet(id); break;
                case 'bulk-ip': openBulkIpModal(id); break;
                case 'select-ipam-tab': if (['overview','addresses','manage'].includes(target.dataset.tab)) { activeIpamTab=target.dataset.tab; renderContent(); } break;
                case 'apply-bulk-ip-assignment': applyBulkIpChanges(); break;
                case 'open-subnet-by-vlan': openSubnetModalByVlanId(id); break;
                case 'reconcile-legacy-vlans': reconcileLegacyVlanOwnership(); break;
                case 'edit-ipam-block': openSubnetModal(id); break;
                case 'delete-vlan': deleteVlan(id); break;
                case 'open-ip': openIpModal(target.dataset.ip); break;
                case 'select-next-available-ip-address': openIpModal(target.dataset.ip); break;
                case 'show-previous-ip-address-grid-page': ipAddressGridPage=Math.max(0,ipAddressGridPage-1); renderContent(); break;
                case 'show-next-ip-address-grid-page': ipAddressGridPage++; renderContent(); break;
                case 'ip-range-all': ipViewRange = 'all'; renderContent(); break;
                case 'ip-range-1-32': ipViewRange = '1-32'; renderContent(); break;
                case 'ip-range-33-64': ipViewRange = '33-64'; renderContent(); break;
                case 'ip-range-65-128': ipViewRange = '65-128'; renderContent(); break;
                case 'ip-range-129-192': ipViewRange = '129-192'; renderContent(); break;
                case 'ip-range-193-254': ipViewRange = '193-254'; renderContent(); break;
                case 'sidebar-ipam-overview': activeIpamTab = 'overview'; switchTab('ipam'); break;
                case 'sidebar-ipam-addresses': activeIpamTab = 'addresses'; switchTab('ipam'); break;
                case 'ipam-open-block': {
                    const blockId = String(target.dataset.id || '');
                    if (blockId && !appState.subnets.some(s => s.id === blockId && s.kind === 'container')) break;
                    ipamManageBlockFilter = blockId;
                    activeIpamTab = 'manage';
                    switchTab('ipam');
                    const tree = document.querySelectorAll('[data-ipam-hierarchy-block]');
                    tree.forEach(item => {
                        if (blockId) item.open = item.getAttribute('data-ipam-hierarchy-block') === blockId;
                    });
                    const selectedBlock = blockId ? [...tree].find(item => item.getAttribute('data-ipam-hierarchy-block') === blockId) : null;
                    if (selectedBlock) selectedBlock.scrollIntoView({block:'center',behavior:'instant'});
                    break;
                }
                case 'ipam-open-network-addresses': {
                    const network=appState.subnets.find(n=>String(n.id)===String(id)&&(n.kind||'network')==='network');
                    if(network){selectedSubnetId=network.id;ipamManageBlockFilter=null;activeIpamTab='addresses';ipAddressGridPage=0;switchTab('ipam');}
                    break;
                }
                case 'ipam-show-all-blocks': ipamManageBlockFilter = null; activeIpamTab = 'manage'; switchTab('ipam'); break;
                case 'sidebar-ipam-manage': ipamManageBlockFilter = null; activeIpamTab = 'manage'; switchTab('ipam'); break;
                case 'tab-ipam': switchTab('ipam'); break;
                case 'tab-audit': switchTab('audit'); break;
                case 'audit-section':
                    if(['activity','assets','coverage'].includes(target.dataset.tab)){
                        activeAuditTab=target.dataset.tab;
                        renderContent();
                    }
                    break;
                case 'audit-view-detail':
                    showAuditDetail(Number(target.dataset.index)); break;
                case 'audit-close-detail':
                    closeAuditDetail(); break;
                case 'audit-select-asset':
                    selectedAuditAsset=target.dataset.key;
                    renderContent(); break;
                case 'audit-reset-filters': {
                    const root=document.querySelector('#main-content .audit-screen');
                    if(root){
                        for(const id of ['q','area','action','actor'])root.querySelector('#'+id).value='';
                        applyAuditFilters();
                    }
                    break;
                }
                case 'export-audit': exportAuditHistory(); break;
                case 'check-inventory-safety': void checkInventorySafety(); break;
                case 'caffoot-licences': caffootShowLicences(); break;
                case 'caffoot-check-updates': caffootCheckUpdates(); break;
                case 'caffoot-update-guide': caffootUpdateGuide(); break;
                case 'export-backup': exportData(); break;
                case 'acknowledge-browser-storage': acknowledgeBrowserStorageNotice(); break;
                case 'clear-inventory-data': requestInventoryReset(); break;
                case 'download-snapshot': downloadPreRestoreSafetySnapshot(); break;
                case 'backup-help': openBackupExplanationDialog(); break;
                case 'backup-help-close': closeModal(true); break;
                case 'open-network-reports': openModal(renderInterfaceTemplate("dashboard/source-network-reports",[renderInventoryReportsHtml(false)])); break;
                case 'export-selected-inventory-csv': downloadInventoryReportCsv(target.dataset.report); break;
                
                case 'tab-settings': switchTab('settings'); break;
                case 'tab-users': switchTab('users'); break;
                case 'sidebar-users-overview': activeUsersTab='overview'; switchTab('users'); break;
                case 'sidebar-users-list': activeUsersTab='list'; switchTab('users'); break;
                case 'sidebar-users-add': activeUsersTab='add'; switchTab('users'); break;
                case 'tab-account': activeAccountSection='overview'; switchTab('account'); break;
                case 'select-account-section': if (['overview','security','help','about'].includes(target.dataset.section)) { activeAccountSection=target.dataset.section; switchTab('account'); } break;
                case 'choose-backup-import': document.getElementById('import-file')?.click(); break;
                case 'toggle-settings-theme': toggleDarkMode(); renderContent(); break;
                case 'change-appearance-theme': caffootSetTheme(target.dataset.theme); break;
                case 'toggle-account-help': target.closest('.expander')?.classList.toggle('open'); break;
                case 'account-photo-remove': void removeAccountPhoto().catch(error=>showToast(error.message,'error')); break;
                case 'preview-inventory-integrity-repairs': previewInventoryIntegrityRepairs(); break;
                case 'apply-inventory-integrity-repairs': applyPreviewedInventoryIntegrityRepairs(); break;
                case 'open-alert': {
                    const destination = target.dataset.destination;
                    const deviceId = target.dataset.deviceId;
                    const rackId = target.dataset.rackId;
                    const ip = target.dataset.ip;
                    if (destination === 'devices') {
                        switchTab('devices');
                        // Open the device details when available; otherwise show the inventory.
                        if (deviceId && appState.devices.some(d => String(d.id) === String(deviceId)) && typeof openDeviceDetailView === 'function') openDeviceDetailView(deviceId);
                    } else if (destination === 'racks') {
                        switchTab('racks');
                    } else if (destination === 'ipam') {
                        switchTab('ipam');
                        if (ip && typeof openIpModal === 'function') openIpModal(ip);
                    } else switchTab('settings');
                    break;
                }
                case 'dashboard-tab': {
                    const next = target.dataset.dashboardTab;
                    if (['overview','insights','activity'].includes(next)) {
                        activeDashboardTab = next;
                        renderContent();
                        const active = document.getElementById('dashboard-tab-' + next);
                        if (active) active.focus({preventScroll:true});
                    }
                    break;
                }
                case 'toggle-sidebar': toggleSidebar(); break;
                case 'select-device-section': {
                    if (['overview','inventory','types','locations','manufacturers','models','software','services'].includes(target.dataset.tab)) {
                        activeDeviceDetailsTab = target.dataset.tab;
                        switchTab('devices');
                    }
                    break;
                }
                case 'select-ipam-section': {
                    if (['overview','addresses','manage'].includes(target.dataset.view)) {
                        activeIpamTab = target.dataset.view;
                        switchTab('ipam');
                    }
                    break;
                }
                case 'select-rack-section': {
                    if (['overview','inventory','accessories'].includes(target.dataset.sectionTab)) {
                        v13RackSection = target.dataset.sectionTab;
                        v13RackDetailOpen = false;
                        switchTab('racks');
                    }
                    break;
                }
                case 'select-users-section': {
                    if (['overview','list','add'].includes(target.dataset.tab)) {
                        activeUsersTab = target.dataset.tab;
                        switchTab('users');
                    }
                    break;
                }
                case 'tab-dashboard': switchTab('dashboard'); break;
                case 'tab-devices': switchTab('devices'); break;


                case 'tab-ipam': switchTab('ipam'); break;
                case 'v13-overview-tab': { const next=target.dataset.tab; if(['capacity','equipment','locations'].includes(next)){v13RackOverviewTab=next;renderContent();} break; }
                case 'sidebar-racks-overview': v13RackSection='overview'; switchTab('racks'); break;
                case 'sidebar-racks-inventory': v13RackSection='inventory'; v13RackDetailOpen=false; switchTab('racks'); break;
                case 'sidebar-racks-accessories': v13RackSection='accessories'; switchTab('racks'); break;
                case 'v13-back-rack-inventory': v13RackSection='inventory'; v13RackDetailOpen=false; switchTab('racks'); break;
                case 'v13-open-rack': { const rack=appState.racks.find(r=>r.id===target.dataset.id); if(rack){selectedRackId=rack.id;v13RackSection='inventory';v13RackDetailOpen=true;activeRackTab='view';switchTab('racks');} break; }
                case 'v13-open-rack-accessories': { const rack=appState.racks.find(r=>r.id===target.dataset.id); if(rack){selectedRackId=rack.id;v13RackSection='inventory';v13RackDetailOpen=true;activeRackTab='equipment';switchTab('racks');} break; }
                case 'dashboard-racks-overview': v13RackSection='overview'; v13RackDetailOpen=false; switchTab('racks'); break;
                case 'tab-racks': switchTab('racks'); break;
                case 'toggle-dark-mode': toggleDarkMode(); break;
                case 'export-data': exportData(); break;
                case 'cancel-subnet-modal': returnToDeviceFormFromSubnet(); break;
                case 'return-from-bulk-ip-assignment': returnToBulkIpAddressEditor(); break;
                case 'close-modal': { if (pendingBulkIpAssignment && !document.querySelector('#modal-content form[data-form-action="bulk-ip"]')) pendingBulkIpAssignment = null; if (deviceRackReturnPending && document.querySelector('#modal-content form[data-form-action="rack"]')) cancelRackFromDevice(); else closeModal(); break; }
                default:
                    console.warn('Unhandled data-action:', action);
            }
        });

        document.addEventListener('input', function(event) {
            if(event.target?.id !== 'v13-rack-search') return;
            const query=event.target.value.trim().toLocaleLowerCase();
            let shown=0;
            document.querySelectorAll('[data-v13-rack-row]').forEach(row=>{
                const match=(row.dataset.search||'').toLocaleLowerCase().includes(query);
                row.classList.toggle('hidden',!match);
                if(match) shown++;
            });
            const empty=document.getElementById('v13-rack-no-results');
            if(empty) empty.classList.toggle('hidden',shown!==0 || !(appState.racks||[]).length);
        });

        window.onload = function() { /* inventory is loaded after authentication */ };
    
// Caffoot Lite: published inventory UI, authoritative SQLite persistence.
void (async () => {
  const collections = ['devices','subnets','vlans','racks','rackAccessories','ipAllocations'];
  const section = {devices:'Devices',ipam:'IPAM',racks:'Racks'};
  let permissions = {};
  let editPermissions = {};
  let deviceRevisions = {};
  let deviceEditors = {};
  let csrfToken = '';
  let activeEdit = null;
  let pendingSave = false;
  let activeDelete = null;
  let sessionIsAdmin = false;
  async function refreshCentralInventory(render = true) {
    const response = await fetch('/api/inventory/state', {cache:'no-store'});
    if (!response.ok) throw new Error(response.status === 401 ? 'Please sign in first.' : 'Unable to load central inventory.');
    const state = await response.json();
    permissions = state.sections || {};
    editPermissions = state.editPermissions || {};
    nextImportAllowed = ['Devices','IPAM','Racks'].every(key => editPermissions[key]);
    deviceRevisions = state.deviceRevisions || {};
    deviceEditors = state.deviceEditors || {};
    // A replacement import or Clean Start can remove optional managed settings.
    // Reconstruct the entire display state from SQLite, not stale browser values.
    const fresh=cloneDefaultData();
    for (const key of collections) {
      if (Object.prototype.hasOwnProperty.call(state,key)) fresh[key] = state[key];
    }
    for (const [key,value] of Object.entries(state.settings || {})) fresh[key] = value;
    appState = fresh;
    auditHistory = Array.isArray(state.changeHistory) ? state.changeHistory : [];
    auditBaseline = JSON.stringify(appState);
    if (render) renderContent();
  }
  async function postInventory(path, data) {
    const response = await fetch(path, {
      method:'POST',
      headers:{'Content-Type':'application/json','X-CSRF-Token':csrfToken},
      body:JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to save inventory.');
    return result;
  }
  const actionCanEditIpam = new Set(['open-subnet-modal','open-multiple-subnets','bulk-ip','apply-bulk-ip-assignment',
    'edit-subnet','edit-ipam-block','delete-vlan','reconcile-legacy-vlans',
    'delete-subnet','confirm-delete-subnet','apply-inventory-integrity-repairs',
    'create-subnet-from-device']);
  const actionCanEditManaged = new Set([
    'edit-device-fascia-graphic','save-rack-fascia-graphic',
    'manufacturer-add','manufacturer-edit','manufacturer-remove',
    'save-catalogue-manufacturer','confirm-remove-catalogue-manufacturer',
    'built-in-manufacturer-edit','built-in-manufacturer-save',
    'model-add','model-edit','model-remove','save-catalogue-model',
    'confirm-remove-catalogue-model','built-in-model-edit','built-in-model-save',
    'software-custom-add','software-custom-edit','software-custom-remove',
    'software-custom-confirm-remove','software-custom-save',
    'software-custom-restore','enable-suggested-software',
    'server-catalog-add','server-catalog-edit','server-catalog-save',
    'server-catalog-remove','server-catalog-restore',
    'server-service-confirm-archive','software-toggle',
    'hardware-catalog-add','hardware-catalog-edit','hardware-catalog-remove',
    'add-service','rename-service','delete-service',
    'add-software','rename-software','delete-software',
    'add-custom-location','add-device-type-or-location','save-rename',
    'rename-device-catalogue-entry','delete-device-type-or-location',
    'delete-device-type','delete-location','edit-device-type','edit-location',
    'confirm-delete'
  ]);
  const actionCanEditRack = new Set(['open-rack-modal','edit-rack',
    'correct-rack-specifications','delete-rack','add-rack-accessory',
    'add-vertical-rack-accessory','edit-rack-accessory','delete-rack-accessory',
    'place-rack-item','placement-device','placement-accessory',
    'assign-device','unassign-device','mount-rack-accessory',
    'create-rack-from-device','create-rack-shelf-from-device']);
  const actionCanEditDevice = new Set([
    'open-device-modal','edit-device','edit-device-from-details',
    'delete-device','delete-device-from-details',
    'duplicate-device','duplicate-device-from-details',
    'archived-software-remove','archived-software-confirm-uninstall'
  ]);
  const readOnlyActions = new Set([
    'clear-device-filters','clear-catalogue-list-search','change-appearance-theme',
    'export-audit','export-selected-inventory-csv'
  ]);
  const blockedActions = /^(add|create|edit|delete|remove|save|restore|reset|import|export|repair|assign|reserve|release|clear|bulk|duplicate|move|place|unplace|update|change|apply|confirm|choose-backup)/i;
  function isBlockedAction(action, element = null) {
    // The published file picker also receives a click. Do not intercept it
    // for an authorised one-way import; the backend rechecks full edit access.
    if (action === 'import-file' || action === 'next-import-pick')
      return !nextImportAllowed;
    if (readOnlyActions.has(action)) return false;
    if (['open-device-modal','duplicate-device','duplicate-device-from-details'].includes(action))
      return !(editPermissions.Devices && editPermissions.IPAM);
    if (action === 'open-subnet-modal'||action==='open-multiple-subnets') return !editPermissions.IPAM;
    if (action === 'check-inventory-safety')
      return !['Devices','IPAM','Racks'].every(section => permissions[section]);
    if (action === 'apply-inventory-integrity-repairs')
      return !(permissions.Devices && editPermissions.IPAM);
    if (action === 'preview-inventory-integrity-repairs')
      return !(permissions.Devices && permissions.IPAM);
    if (action === 'clear-inventory-data')
      return !['Devices','IPAM','Racks'].every(section => editPermissions[section]);
    if (editPermissions.Devices && action === 'confirm' &&
        element && element.closest('#hypervisor-selection-dialog,#platform-dialog')) return false;
    if (actionCanEditManaged.has(action) || actionCanEditDevice.has(action))
      return !editPermissions.Devices;
    return (blockedActions.test(action) ||
      action === 'reconcile-legacy-vlans' || action === 'open-rack-modal' ||
      action === 'correct-rack-specifications') &&
      !(editPermissions.Devices && actionCanEditDevice.has(action)) &&
      !(editPermissions.IPAM && actionCanEditIpam.has(action)) &&
      !(editPermissions.Racks && actionCanEditRack.has(action));
  }
  function applyAllowedControls() {
    for(const root of [document.getElementById('sidebar'), document.getElementById('main-content'), document.getElementById('modal-content')]){
      if(!root) continue;
      root.querySelectorAll('button').forEach(button=>{
        const blocked=isBlockedAction(button.dataset.action || '',button);
        const unsupportedSubmit=button.type==='submit' && button.form && !(
          button.form?.matches('#next-account-password-form,#next-account-mfa-start,#next-account-mfa-confirm,#personal-details-form,#account-email-verification-form') ||
          (sessionIsAdmin && button.closest('#next-user-create-form,#next-user-profile-form,#smtp-settings-form,#smtp-test-form')) ||
          (editPermissions.Devices && button.form?.matches('form[data-device-form="true"]')) ||
          (editPermissions.IPAM && button.closest('form[data-form-action="ip"],form[data-form-action="bulk-ip"],form[data-form-action="subnet"],form[data-ipam-subnet-creation]')) ||
          (editPermissions.Devices && editPermissions.Racks && button.closest('#rack-shelf-removal-form')) ||
          (editPermissions.Racks && button.closest('form[data-form-action="rack"],form[data-form-action="assign"],#rack-accessory-form'))
        );
        if(blocked || unsupportedSubmit){
          button.disabled=true;
          // Hide unavailable modifying actions for read-only users, while
          // retaining existing backend safeguards and editor behaviour.
          if(!sessionIsAdmin) button.hidden=true;
        }
      });
    }
  }
  // The original native select remains authoritative for validation and
  // dependent inventory handlers. Only longer lists receive a searchable view.
  let openSearchPopup=null;
  const popupSources=new Map();
  function enhanceLongSelects(){
    for(const [popup,select] of popupSources){
      if(!select.isConnected){
        popup.remove();popupSources.delete(popup);
      }
    }
    for(const select of document.querySelectorAll('#main-content select,#modal-content select')){
      if(select.dataset.caffootSearch || select.multiple || select.disabled ||
         [...select.options].filter(o=>!o.hidden).length<9)continue;
      // Keep the approved select's appearance when adding the existing search popup.
      const selectStyle=getComputedStyle(select);
      const presentation=Object.fromEntries(['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing',
        'color','backgroundColor','border','borderRadius','padding','margin','height','minHeight']
        .map(property=>[property,selectStyle[property]]));
      select.dataset.caffootSearch='true';
      select.classList.add('caffoot-search-native');
      select.tabIndex=-1;
      const host=document.createElement('div');
      host.className='caffoot-select-host';
      const trigger=document.createElement('button');
      trigger.type='button';
      trigger.className='caffoot-search-trigger';
      Object.assign(trigger.style,presentation);
      const caption=document.createElement('span');
      caption.style.cssText='min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
      const arrow=document.createElementNS('http://www.w3.org/2000/svg','svg');
      arrow.setAttribute('viewBox','0 0 24 24');arrow.setAttribute('width','12');arrow.setAttribute('height','12');
      arrow.setAttribute('fill','none');arrow.setAttribute('stroke','currentColor');arrow.setAttribute('stroke-width','1.8');
      arrow.setAttribute('aria-hidden','true');arrow.style.transform='rotate(90deg)';
      const chevron=document.createElementNS('http://www.w3.org/2000/svg','use');
      chevron.setAttribute('href','#i-chevron');arrow.append(chevron);
      trigger.append(caption,arrow);
      const label=document.querySelector('label[for="'+select.id+'"]');
      trigger.setAttribute('aria-label',label?.textContent?.trim()||select.getAttribute('aria-label')||'Select option');
      trigger.setAttribute('aria-haspopup','listbox');
      trigger.setAttribute('aria-expanded','false');
      const popup=document.createElement('div');
      popup.className='caffoot-search-popup';
      popup.hidden=true;
      const search=document.createElement('input');
      search.type='search';search.className='caffoot-search-input';
      search.placeholder='Search options...';
      search.setAttribute('aria-label','Search '+trigger.getAttribute('aria-label'));
      const results=document.createElement('div');
      results.className='caffoot-search-options';
      results.setAttribute('role','listbox');
      popup.append(search,results);
      document.body.append(popup);
      popupSources.set(popup,select);
      select.insertAdjacentElement('afterend',host);
      host.append(trigger);
      function sync(){
        const selected=select.selectedOptions[0];
        const value=selected?.textContent?.trim()||'Select...';
        if(caption.textContent!==value)caption.textContent=value;
        trigger.disabled=select.disabled;
      }
      function close(){
        popup.hidden=true;trigger.setAttribute('aria-expanded','false');
        if(openSearchPopup===close)openSearchPopup=null;
      }
      function choose(option){
        select.value=option.value;
        select.dispatchEvent(new Event('change',{bubbles:true}));
        sync();close();trigger.focus();
      }
      function draw(){
        results.replaceChildren();
        const query=search.value.trim().toLowerCase();
        const options=[...select.options].filter(o=>!o.disabled&&!o.hidden&&o.textContent.toLowerCase().includes(query));
        for(const option of options){
          const row=document.createElement('button');
          row.type='button';row.textContent=option.textContent;
          row.setAttribute('role','option');row.setAttribute('aria-selected',String(option.selected));
          row.addEventListener('click',()=>choose(option));
          results.append(row);
        }
        if(!options.length){
          const empty=document.createElement('p');
          empty.textContent='No matching options';
          empty.style.cssText='padding:10px;font-size:13px';
          results.append(empty);
        }
      }
      function open(){
        if(openSearchPopup&&openSearchPopup!==close)openSearchPopup();
        search.value='';sync();draw();
        const rect=trigger.getBoundingClientRect();
        const width=Math.max(rect.width,180);
        const availableBelow=window.innerHeight-rect.bottom-12;
        const availableAbove=rect.top-12;
        const height=Math.min(270,Math.max(160,Math.max(availableBelow,availableAbove)));
        popup.style.width=width+'px';
        popup.style.maxHeight=height+'px';
        popup.style.overflowY='auto';
        popup.style.left=Math.max(8,Math.min(rect.left,window.innerWidth-width-8))+'px';
        popup.style.top=(availableBelow>=height||availableBelow>=availableAbove?
          Math.min(window.innerHeight-height-8,rect.bottom+4):
          Math.max(8,rect.top-height-4))+'px';
        popup.hidden=false;trigger.setAttribute('aria-expanded','true');
        openSearchPopup=close;search.value='';search.focus();
      }
      trigger.addEventListener('click',()=>popup.hidden?open():close());
      if(label)label.addEventListener('click',e=>{e.preventDefault();open();});
      search.addEventListener('input',draw);
      search.addEventListener('keydown',event=>{
        if(event.key==='Escape'){event.preventDefault();close();trigger.focus();}
        else if(event.key==='ArrowDown'){event.preventDefault();results.querySelector('button')?.focus();}
        else if(event.key==='Enter'){event.preventDefault();results.querySelector('button')?.click();}
      });
      results.addEventListener('keydown',event=>{
        if(event.key==='Escape'){event.preventDefault();close();trigger.focus();}
        if(event.key==='ArrowDown'||event.key==='ArrowUp'){
          event.preventDefault();
          const options=[...results.querySelectorAll('button')];
          const index=options.indexOf(document.activeElement);
          options[Math.max(0,Math.min(options.length-1,index+(event.key==='ArrowDown'?1:-1)))]?.focus();
        }
      });
      select.addEventListener('change',sync);
      select.addEventListener('device-dropdown-refresh',()=>{sync();if(!popup.hidden)draw();});
      // Detached fields are disposed with their modal or page on the next render.
      sync();
    }
  }
  document.addEventListener('click',event=>{
    if(openSearchPopup && !event.target.closest('.caffoot-search-popup,.caffoot-select-host'))openSearchPopup();
  },true);
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&openSearchPopup){
      const popup=[...popupSources.keys()].find(element=>!element.hidden);
      const select=popupSources.get(popup);
      openSearchPopup();event.preventDefault();event.stopImmediatePropagation();
      select?.nextElementSibling?.querySelector('.caffoot-search-trigger')?.focus();
    }
  },true);
  // A fixed popup must not stay detached from its field when the form scrolls or resizes.
  document.addEventListener('scroll',event=>{
    if(openSearchPopup&&!event.target.closest?.('.caffoot-search-popup'))openSearchPopup();
  },true);
  window.addEventListener('resize',()=>{if(openSearchPopup)openSearchPopup();});
  const enhanceSelects=()=>enhanceLongSelects();
  new MutationObserver(enhanceSelects).observe(document.getElementById('main-content'),{childList:true,subtree:true});
  new MutationObserver(enhanceSelects).observe(document.getElementById('modal-content'),{childList:true,subtree:true});
  // Refresh SQLite-backed inventory when another user may have changed it.
  // Only read/navigation actions are deferred; do not replace an open edit draft.
  const freshNavigationActions = new Set([
    'tab-dashboard','tab-devices','tab-ipam','tab-racks','tab-audit','tab-settings',
    'dashboard-tab','inventory-tab','device-intelligence-tab',
    'select-ipam-tab','ipam-open-block','ipam-show-all-blocks',
    'select-rack','select-rack-tab','rack-face-front','rack-face-rear',
    'v13-open-rack','v13-overview-tab','open-alert',
    'view-device','view-hosted-virtual-machine','edit-device','edit-device-from-details',
    'open-device-modal','open-ip','select-next-available-ip-address',
    'open-rack-modal','edit-rack','correct-rack-specifications','edit-rack-accessory',
    'open-subnet-modal','open-multiple-subnets','edit-subnet','edit-ipam-block','open-subnet-by-vlan','bulk-ip'
  ]);
  let resumingFreshNavigation = false;
  document.addEventListener('click', event => {
    if (resumingFreshNavigation) return;
    const element = event.target.closest('[data-action]');
    if (!element) return;
    const action = element.dataset.action || '';
    if (!(freshNavigationActions.has(action) ||
          /^sidebar-(devices|ipam|racks)-/.test(action))) return;
    if (isBlockedAction(action, element) || pendingSave || activeEdit || activeDelete ||
        document.querySelector('#modal-container:not(.hidden) form')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    // A refresh can replace the live rack tab before the deferred click.
    // Preserve the selected approved tab and dispatch to its new element.
    const rackTab = action === 'select-rack-tab' &&
      ['view','equipment','settings'].includes(element.dataset.tab)
        ? element.dataset.tab : null;
    void refreshCentralInventory(false).then(() => {
      const current = element.isConnected ? element : (
        rackTab ? document.querySelector(
          '#main-content [data-action="select-rack-tab"][data-tab="'+rackTab+'"]'
        ) : null
      );
      if (!current) return;
      resumingFreshNavigation = true;
      try { current.click(); }
      finally { resumingFreshNavigation = false; }
    }).catch(error => showToast(error.message, 'error'));
  }, true);
  const originalSwitchTab = switchTab;
  switchTab = function(tab) {
    if (((tab === 'users' || tab === 'settings') && !sessionIsAdmin) ||
        (section[tab] && !permissions[section[tab]])) {
      showToast('You do not have access to this section.', 'error');
      return;
    }
    originalSwitchTab(tab);
    applyAllowedControls();
  };
  // Keep the published read-only device details open during a competing edit.
  const originalOpenDeviceDetailView = openDeviceDetailView;
  function updateDeviceEditorNotice(deviceId) {
    const dialog = document.querySelector('.device-details-dialog');
    const editButton = dialog?.querySelector('[data-action="edit-device-from-details"]');
    if (!editButton || String(editButton.dataset.id) !== String(deviceId)) return;
    const editor = deviceEditors[String(deviceId)];
    const locked = !!editor && editor.toLowerCase() !== signedInUsername.toLowerCase();
    let notice = dialog.querySelector('[data-device-editor-notice]');
    if (locked) {
      if (!notice) {
        notice = document.createElement('p');
        notice.dataset.deviceEditorNotice = 'true';
        notice.setAttribute('role', 'status');
        notice.className = 'rounded-lg border border-red-400 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 dark:border-red-600 dark:bg-red-950/50 dark:text-red-200 break-words';
        dialog.querySelector('header').after(notice);
      }
      notice.textContent = 'Currently being edited by ' + editor + '. You can view this device, but editing is unavailable until ' + editor + ' finishes.';
      editButton.disabled = true;
      editButton.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      notice?.remove();
      if (editPermissions.Devices) {
        editButton.disabled = false;
        editButton.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    }
  }
  openDeviceDetailView = function(deviceId) {
    originalOpenDeviceDetailView(deviceId);
    updateDeviceEditorNotice(deviceId);
    // Refresh reservation ownership when details open; viewing itself never locks.
    void refreshCentralInventory(false).then(() => updateDeviceEditorNotice(deviceId))
      .catch(error => showToast(error.message, 'error'));
  };
  const originalOpenDeviceModal = openDeviceModal;
  function applyDeviceFormSectionPermissions(deviceId) {
    const form = document.querySelector('#modal-content form[data-device-form="true"]');
    if (!form) return;
    if (!editPermissions.IPAM) {
      if (deviceId) {
        form.dataset.ipamReadOnly = 'true';
        for (const id of ['dev-block','dev-vlan','dev-subnet','dev-ip','dev-ip-available','dev-ip-reserved']) {
          const field = document.getElementById(id);
          if (field) field.disabled = true;
        }
      }
      const button = form.querySelector('[data-action="create-subnet-from-device"]');
      if (button) button.hidden = true;
    }
    if (!editPermissions.Racks) {
      if (deviceId) form.dataset.racksReadOnly = 'true';
      for (const id of ['dev-rack-id','dev-rack-face','dev-rack-u','dev-rack-height','dev-shelf-rack','dev-rack-shelf']) {
        const field = document.getElementById(id);
        if (field) field.disabled = true;
      }
      const button = form.querySelector('[data-action="create-rack-from-device"]');
      if (button) button.hidden = true;
      const mount = document.getElementById('dev-mount-type');
      const existing = deviceId ? appState.devices.find(device => device.id === deviceId) : null;
      if (mount && existing && (existing.rackId || existing.mountType === 'Rack Mounted')) {
        mount.disabled = true;
      } else if (mount) {
        // Keep non-rack mounting choices editable without granting rack placement.
        const forbidRackMount = () => {
          for (const option of mount.options) {
            if (option.value === 'Rack Mounted') option.disabled = true;
          }
        };
        forbidRackMount();
        new MutationObserver(forbidRackMount).observe(mount,{childList:true});
      }
    }
  }
  openDeviceModal = function(deviceId = null) {
    if (!editPermissions.Devices) {
      showToast('Devices edit permission required.', 'error');
      return;
    }
    if (!deviceId) {
      if (!editPermissions.IPAM) {
        showToast('Devices and IPAM edit permission required to add a device.', 'error');
        return;
      }
      originalOpenDeviceModal(null);
      applyDeviceFormSectionPermissions(null);
      return;
    }
    (async () => {
      try {
        if (!activeEdit || activeEdit.deviceId !== deviceId) {
          if (activeEdit) await postInventory('/api/devices/edit/cancel', {deviceId:activeEdit.deviceId});
          activeEdit = null;
          const reservation = await postInventory('/api/devices/edit/start', {deviceId});
          activeEdit = {deviceId, revision:reservation.revision};
        }
        await refreshCentralInventory(false);
        if (!appState.devices.some(device=>device.id===deviceId))
          throw new Error('Device no longer exists.');
        originalOpenDeviceModal(deviceId);
        applyDeviceFormSectionPermissions(deviceId);
      } catch (error) {
        if (activeEdit && activeEdit.deviceId===deviceId) {
          await postInventory('/api/devices/edit/cancel', {deviceId}).catch(()=>{});
          activeEdit = null;
        }
        if (error.message.startsWith('Device is being edited by ')) {
          deviceEditors[String(deviceId)] = error.message.slice('Device is being edited by '.length);
          if (!document.querySelector('.device-details-dialog')) originalOpenDeviceDetailView(deviceId);
          updateDeviceEditorNotice(deviceId);
        } else {
          showToast(error.message,'error');
        }
      }
    })();
  };
  nextDeviceModalClosed = function() {
    if (!activeEdit) return;
    const deviceId = activeEdit.deviceId;
    activeEdit = null;
    postInventory('/api/devices/edit/cancel',{deviceId}).catch(error=>showToast(error.message,'error'));
  };
  function relatedChanges(before, deletedId = null) {
    const oldById = new Map(before.devices.map(device=>[device.id,device]));
    const related = [];
    for (const record of appState.devices) {
      const previous = oldById.get(record.id);
      if (!previous || record.id === deletedId || JSON.stringify(previous)===JSON.stringify(record)) continue;
      if (!(record.id in deviceRevisions)) throw new Error('Device revision unavailable. Refresh the inventory.');
      related.push({deviceId:record.id, revision:deviceRevisions[record.id], record});
    }
    return related;
  }
  async function saveDevice(beforeJson, deviceId) {
    if (pendingSave) return false;
    pendingSave = true;
    try {
      const before=JSON.parse(beforeJson);
      const record=deviceId
        ? appState.devices.find(device=>device.id===deviceId)
        : appState.devices.find(device=>!before.devices.some(previous=>previous.id===device.id));
      if (!record) throw new Error('The device to save was not found.');
      const relatedDevices = relatedChanges(before, deviceId);
      if (deviceId && (!activeEdit || activeEdit.deviceId!==deviceId))
        throw new Error('Device edit reservation is no longer active.');
      const payload = deviceId
        ? {deviceId, revision:activeEdit.revision, record, relatedDevices}
        : {record};
      await postInventory(deviceId ? '/api/devices/edit/save' : '/api/devices/create',payload);
      activeEdit = null;
      try { await refreshCentralInventory(false); }
      catch (error) { showToast('Device saved. Unable to refresh the latest inventory.', 'error'); return true; }
      showToast('Device saved.');
      return true;
    } catch (error) {
      showToast(error.message,'error');
      return false;
    } finally { pendingSave=false; }
  }
  nextIpamBridge = {
    canEdit: () => !!editPermissions.IPAM,
    async saveBulk(changes) {
      if (!editPermissions.IPAM || pendingSave) {
        showToast('IPAM edit permission required or another save is in progress.', 'error');
        return false;
      }
      pendingSave=true;
      try {
        await postInventory('/api/ipam/allocation/bulk',{
          changes:changes.map(change=>({ip:change.ip,record:change.updated}))
        });
        try { await refreshCentralInventory(false); }
        catch(error) {
          showToast('Bulk IPAM changes saved. Unable to refresh the latest inventory.', 'error');
          return true;
        }
        showToast('Bulk IPAM changes saved.');
        return true;
      } catch(error) {
        showToast(error.message, 'error');
        return false;
      } finally { pendingSave=false; }
    },
    async save(ip, previous) {
      if (!editPermissions.IPAM) {
        showToast('IPAM edit permission required.', 'error');
        return false;
      }
      const record = appState.ipAllocations[ip] || null;
      if (JSON.stringify(record) === JSON.stringify(previous)) return true;
      try {
        await postInventory(record ? '/api/ipam/allocation/save' : '/api/ipam/allocation/delete',
          record ? {ip,record} : {ip});
        try { await refreshCentralInventory(false); }
        catch (error) {
          showToast('IPAM changes saved. Unable to refresh the latest inventory.', 'error');
          return true;
        }
        showToast('IPAM changes saved.');
        return true;
      } catch (error) {
        showToast(error.message, 'error');
        return false;
      }
    },
    async deleteSubnet(subnetId,expectedDevices,expectedIps) {
      if (!editPermissions.IPAM || pendingSave) {
        showToast('IPAM edit permission required or another save is in progress.','error');
        return false;
      }
      pendingSave=true;
      try {
        await postInventory('/api/ipam/subnets/delete',{
          subnetId, expectedDevices, expectedIps
        });
        try { await refreshCentralInventory(false); }
        catch(error) {
          showToast('Subnet deleted. Unable to refresh the latest inventory.','error');
          return true;
        }
        showToast('Subnet deleted.');
        return true;
      } catch(error) {
        showToast(error.message,'error');
        return false;
      } finally { pendingSave=false; }
    },
    async saveSubnet(beforeJson, successMessage='Subnet changes saved.') {
      if (!editPermissions.IPAM || pendingSave) {
        showToast('IPAM edit permission required or another save is in progress.', 'error');
        return false;
      }
      const old=JSON.parse(beforeJson);
      const changes=[];
      for (const collection of ['subnets','vlans']) {
        const previous=new Map(old[collection].map(record=>[record.id,record]));
        const current=new Map(appState[collection].map(record=>[record.id,record]));
        for (const [id,record] of current)
          if (JSON.stringify(previous.get(id))!==JSON.stringify(record))
            changes.push({collection,id,record});
        for (const [id] of previous)
          if (!current.has(id)) changes.push({collection,id,record:null});
      }
      if (!changes.length) return true;
      pendingSave=true;
      try {
        await postInventory('/api/ipam/subnets/save',{changes});
        try{await refreshCentralInventory(false);}catch(error){showToast('Subnets saved. Unable to refresh the latest inventory.','error');return true;}
        showToast(successMessage);
        return true;
      } catch(error) {
        const preview=document.getElementById('subnet-batch-preview');
        if(preview&&subnetBatchDraft){
          const message=formatSubnetValidationMessage(error.message,subnetBatchDraft.rows),index=subnetBatchDraft.rows.findIndex(row=>message.toLowerCase().includes(row.name.trim().toLowerCase())&&row.name.trim()||message.includes(row.cidr));
          if(index>=0)showSubnetBatchIssues([{index,field:/name/i.test(message)?'name':subnetBatchDraft.spacing==='custom'?'cidr':'gateway',message}]);
          const summary=preview.querySelector('[data-form-error]');summary.textContent=message+' Nothing has been saved.';summary.classList.add('is-visible');
        }else showSubnetFormError(error.message);
        return false;
      } finally { pendingSave=false; }
    }
  };
  nextSettingsBridge = {
    async save(key) {
      if (!editPermissions.Devices || pendingSave) {
        showToast('Devices edit permission required or another save is in progress.','error');
        return false;
      }
      pendingSave=true;
      try {
        await postInventory('/api/inventory/settings/save',{key,value:appState[key]});
        await refreshCentralInventory(false);
        return true;
      } catch(error) {
        showToast(error.message,'error');
        return false;
      } finally { pendingSave=false; }
    }
  };
  nextIntegrityRepairBridge = {
    reload: async () => refreshCentralInventory(false),
    canViewSection: section => !!permissions[section],
    async preview() {
      if (!permissions.Devices || !permissions.IPAM) {
        showToast('Devices and IPAM view permissions required.','error');
        return;
      }
      try {
        await refreshCentralInventory(false);
        inventoryIntegrityRepairPreview = {
          snapshot: JSON.stringify(appState),
          plan: planDeviceIpAllocationIntegrityRepairs()
        };
        renderContent();
      } catch(error) {showToast(error.message,'error');}
    },
    async apply() {
      const preview=inventoryIntegrityRepairPreview;
      if (!preview) return showToast('Run a repair preview first.','error');
      if (!editPermissions.IPAM || !permissions.Devices || pendingSave)
        return showToast('IPAM edit permission required or another save is in progress.','error');
      if (!preview.plan.fixes.length)
        return showToast('No safe repairs are pending.','error');
      if (!confirm('Apply '+preview.plan.fixes.length+
        ' proposed IPAM repair(s)? Conflicts are not changed.')) return;
      pendingSave=true;
      try {
        await refreshCentralInventory(false);
        if (JSON.stringify(appState)!==preview.snapshot)
          throw new Error('Inventory changed. Preview repairs again.');
        const result=await postInventory('/api/inventory/ipam/repair',{
          expectedFixes:preview.plan.fixes.map(fix=>({ip:fix.ip,deviceId:fix.deviceId}))
        });
        inventoryIntegrityRepairPreview=null;
        await refreshCentralInventory(false);
        renderContent();
        showToast(result.count+' IPAM repair(s) saved.','success');
        return true;
      } catch(error) {
        inventoryIntegrityRepairPreview=null;
        renderContent();
        showToast('Repair cancelled: '+error.message,'error');
        return false;
      } finally {pendingSave=false;}
    }
  };
  nextResetBridge = {
    async reset() {
      if (!['Devices','IPAM','Racks'].every(section => editPermissions[section]) || pendingSave) {
        showToast('All inventory section edit permissions required or another save is in progress.','error');
        return false;
      }
      pendingSave=true;
      try {
        await postInventory('/api/inventory/reset', {confirmed:true});
        appState = cloneDefaultData();
        try { await refreshCentralInventory(false); }
        catch(error) {
          renderContent();
          showToast('Clean Start saved. Unable to refresh the latest inventory.','error');
          return true;
        }
        selectedSubnetId = '';
        selectedRackId = '';
        renderContent();
        showToast('Caffoot Lite has been reset to a clean inventory.', 'success');
        return true;
      } catch(error) {
        showToast('Reset cancelled: '+error.message,'error');
        return false;
      } finally { pendingSave=false; }
    }
  };
  nextDeviceCatalogueBridge = {
    async change(kind,operation,oldName,newName) {
      if (!editPermissions.Devices || pendingSave) {
        showToast('Devices edit permission required or another save is in progress.','error');
        return false;
      }
      const field=kind==='type'?'type':'location';
      const expectedDevices=operation==='add' ? [] :
        appState.devices.filter(device=>device[field]===oldName).map(device=>device.id);
      pendingSave=true;
      try {
        const result=await postInventory('/api/inventory/device-catalogue/change',{
          kind,operation,oldName,newName,expectedDevices
        });
        await refreshCentralInventory(false);
        showToast(operation==='delete'
          ? result.affectedDevices+' device(s) set to Unknown; '+kind+' deleted.'
          : (kind==='type'?'Type':'Location')+' '+(operation==='add'?'added':'renamed')+' successfully.','success');
        openDeviceCatalogueManager(kind);
        renderContent();
        return true;
      } catch(error) {
        showToast(error.message,'error');
        return false;
      } finally { pendingSave=false; }
    }
  };
  nextRackBridge = {
    async reviewShelf(id) {
      if(!editPermissions.Devices||!editPermissions.Racks)throw Error('Devices and Racks edit permissions are required to review a linked shelf.');
      await refreshCentralInventory(false);
      if(!editPermissions.Devices||!editPermissions.Racks)throw Error('Devices and Racks edit permissions are required to review a linked shelf.');
      const shelf=appState.rackAccessories.find(a=>a.id===id&&a.type==='shelf');
      if(!shelf)throw Error('The rack shelf is no longer available.');
      return {shelf:JSON.parse(JSON.stringify(shelf)),devices:appState.devices.filter(d=>d.rackShelfAccessoryId===id).map(d=>({id:d.id,name:d.name,revision:deviceRevisions[d.id]}))};
    },
    async removeShelf(shelf,devices) {
      if(!editPermissions.Devices||!editPermissions.Racks||pendingSave)throw Error('Devices and Racks edit permissions are required, with no other save in progress.');
      pendingSave=true;
      try{
        await postInventory('/api/inventory/rack-shelves/remove',{shelfId:shelf.id,expectedShelf:shelf,devices});
        try{await refreshCentralInventory(false);}catch(error){showToast('Shelf removal saved. Refresh to see the latest inventory.','error');}
        return true;
      }finally{pendingSave=false;}
    },
    canEdit: () => !!editPermissions.Racks,
    async savePlacement(deviceId) {
      if (!editPermissions.Racks || pendingSave) {
        showToast('Racks edit permission required or another save is in progress.','error');
        return false;
      }
      const record=appState.devices.find(device=>device.id===deviceId);
      if (!record) { showToast('Device no longer exists.','error'); return false; }
      pendingSave=true;
      let reserved=false;
      try {
        const reservation=await postInventory('/api/devices/edit/start',{deviceId,section:'Racks'});
        reserved=true;
        if (deviceRevisions[deviceId] !== undefined &&
            deviceRevisions[deviceId] !== reservation.revision)
          throw new Error('Device has changed since editing began. Refresh the inventory.');
        await postInventory('/api/devices/edit/save',{
          deviceId,revision:reservation.revision,record,section:'Racks'
        });
        reserved=false;
        try { await refreshCentralInventory(false); }
        catch(error) {
          showToast('Rack placement saved. Unable to refresh the latest inventory.','error');
          return true;
        }
        showToast('Rack placement saved.');
        return true;
      } catch(error) {
        showToast(error.message,'error');
        return false;
      } finally {
        if (reserved)
          await postInventory('/api/devices/edit/cancel',{deviceId,section:'Racks'}).catch(()=>{});
        pendingSave=false;
      }
    },
    async save(rackId, record) {
      return this.persist('racks',rackId,record);
    },
    async saveAccessory(accessoryId,record) {
      return this.persist('rackAccessories',accessoryId,record);
    },
    async persist(collection,recordId,record) {
      if (!editPermissions.Racks || pendingSave) {
        showToast('Racks edit permission required or another save is in progress.', 'error');
        return false;
      }
      pendingSave=true;
      try {
        await postInventory(record ? '/api/inventory/record/save' : '/api/inventory/record/delete',
          record ? {collection,id:recordId,record} : {collection,id:recordId});
        try { await refreshCentralInventory(false); }
        catch(error) {
          showToast('Rack changes saved. Unable to refresh the latest inventory.','error');
          return true;
        }
        showToast('Rack changes saved.');
        return true;
      } catch(error) {
        showToast(error.message,'error');
        return false;
      } finally { pendingSave=false; }
    }
  };
  async function reserveForDelete(deviceId) {
    if (!editPermissions.Devices) throw new Error('Devices edit permission required.');
    await refreshCentralInventory(false);
    if (!appState.devices.some(device => device.id === deviceId))
      throw new Error('Device no longer exists.');
    const reservation = await postInventory('/api/devices/edit/start',{deviceId});
    activeDelete = {deviceId,revision:reservation.revision};
  }
  async function removeDevice(beforeJson,deviceId) {
    if (pendingSave) return false;
    pendingSave = true;
    try {
      if (!activeDelete || activeDelete.deviceId!==deviceId)
        throw new Error('Device edit reservation is no longer active.');
      const before=JSON.parse(beforeJson);
      await postInventory('/api/devices/delete',{
        deviceId, revision:activeDelete.revision,
        relatedDevices:relatedChanges(before,deviceId)
      });
      activeDelete = null;
      try { await refreshCentralInventory(); }
      catch (error) {
        renderContent();
        showToast('Device deleted. Unable to refresh the latest inventory.', 'error');
        return true;
      }
      showToast('Device deleted.');
      return true;
    } catch(error) {
      appState=JSON.parse(beforeJson);
      showToast(error.message,'error');
      return false;
    } finally { pendingSave=false; }
  }
  async function cancelDelete(deviceId) {
    if (!activeDelete || activeDelete.deviceId!==deviceId) return;
    activeDelete = null;
    try { await postInventory('/api/devices/edit/cancel',{deviceId}); }
    catch(error) { showToast(error.message,'error'); }
  }
  async function saveArchivedInstallation(deviceId) {
    if (!editPermissions.Devices || pendingSave) {
      showToast('Devices edit permission required or another save is in progress.','error');
      return false;
    }
    const record=appState.devices.find(device=>device.id===deviceId);
    if (!record) {showToast('Device no longer exists.','error');return false;}
    pendingSave=true;
    let reserved=false;
    try {
      const edit=await postInventory('/api/devices/edit/start',{deviceId});
      reserved=true;
      if (deviceRevisions[deviceId] !== undefined &&
          deviceRevisions[deviceId] !== edit.revision)
        throw new Error('Device has changed since editing began. Refresh the inventory.');
      await postInventory('/api/devices/edit/save',{
        deviceId,revision:edit.revision,record
      });
      reserved=false;
      await refreshCentralInventory(false);
      return true;
    } catch(error) {
      showToast(error.message,'error');
      return false;
    } finally {
      if(reserved)
        await postInventory('/api/devices/edit/cancel',{deviceId}).catch(()=>{});
      pendingSave=false;
    }
  }
  nextDeviceBridge = {save:saveDevice,reserveForDelete,remove:removeDevice,
    cancelDelete,saveArchivedInstallation};

  // Self-service account controls follow the established Users card styling.
  let sessionMfaEnrolled=false;
  function renderAccountSections(){
    const card='rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-5 space-y-3';
    const field='block w-full max-w-sm border rounded-lg p-2 mt-1 text-slate-900';
    const button='px-4 py-2 rounded-xl bg-indigo-700 text-white font-semibold';
    let html='<section class="'+card+'"><h3 class="font-bold">Change password</h3>' +
      '<form id="next-account-password-form" class="space-y-3">' +
      renderInterfaceTemplate("my-account/current-password-field",[])+field+'"></label>' +
      renderInterfaceTemplate("my-account/new-password-field",[])+field+'"></label>' +
      '<button type="submit" class="'+button+'">Change password</button></form></section>';
    if(sessionMfaEnrolled) {
      html+='<section class="'+card+'"><h3 class="font-bold">Authenticator</h3><p class="text-sm">MFA enrolled</p></section>';
    } else {
      html+='<section class="'+card+'"><h3 class="font-bold">Authenticator setup</h3>' +
        '<p class="text-sm">Enrol an authenticator before receiving edit or administrator access.</p>' +
        renderInterfaceTemplate("my-account/mfa-enrolment-request",[])+field+'"></label>' +
        '<button type="submit" class="'+button+'">Start MFA enrolment</button></form>' +
        '<div id="next-account-mfa-details" hidden><p class="text-sm">Scan this QR code with your authenticator.</p>' +
        '<div id="next-account-mfa-qr" class="w-fit mx-auto bg-white p-3" role="img" aria-label="Authenticator setup QR code"></div>' +
        renderInterfaceTemplate("my-account/mfa-setup-key",[]) +
        renderInterfaceTemplate("my-account/mfa-enrolment-confirmation",[])+field+'"></label>' +
        '<button type="submit" class="'+button+'">Confirm MFA</button></form></div></section>';
    }
    return html+'<button type="button" id="next-account-signout" class="px-4 py-2 rounded-xl bg-slate-700 text-white text-sm font-semibold">Sign out</button>';
  }
  // Owner-approved My Account HTML, replacing the legacy account UI.
  const accountMarkup=renderInterfaceTemplate("my-account/account-markup-1",[]);
  let accountProfile=null;
  let accountPhotoUrl=null;
  function renderAccountMfaPanel(){
    if(sessionMfaEnrolled){
      return renderInterfaceTemplate("my-account/render-account-mfa-panel-1",[]);
    }
    return renderInterfaceTemplate("my-account/render-account-mfa-panel-2",[])+
      renderInterfaceTemplate("my-account/render-account-mfa-panel-3",[])+
      renderInterfaceTemplate("my-account/render-account-mfa-panel-4",[])+
      '<details><summary>Can’t scan? Show setup key</summary><p id="next-account-mfa-secret" class="break-all"></p></details>'+
      renderInterfaceTemplate("my-account/render-account-mfa-panel-5",[]);
  }
  nextRenderAccount=function(){
    const username=escapeHtml(signedInUsername||'');
    return accountMarkup
      .replaceAll('{{C_USERNAME}}',username)
      .replaceAll('{{C_ROLE}}',sessionIsAdmin?'Administrator':'User')
      .replaceAll('{{C_MFA}}',sessionMfaEnrolled?'Enabled':'Not enrolled')
      .replace('<!--CAFFOOT_MFA_PANEL-->',renderAccountMfaPanel());
  };
  function initialiseAccountEmailVerification(root){
    const personalForm=root.querySelector('#personal-details-form');
    const email=personalForm?.elements.email;
    if(!email)return;
    const action=root.querySelector('#open-email-verification');
    const badge=root.querySelector('#account-email-status');
    const hint=root.querySelector('#account-email-hint');
    personalForm.insertAdjacentHTML('afterend',renderInterfaceTemplate('my-account/email-verification-1',[]));
    const panel=root.querySelector('#account-email-verification');
    const form=root.querySelector('#account-email-verification-form');
    const send=root.querySelector('#request-email-verification');
    const cancel=root.querySelector('#cancel-email-verification');
    const fields=root.querySelector('#email-verification-code-fields');
    const status=root.querySelector('#email-verification-message');
    // Preserve leading zeroes and trim clipboard padding before maxlength is applied.
    form.elements.token.addEventListener('paste',event=>{
      const code=event.clipboardData?.getData('text').trim();
      if(/^[0-9]{8}$/.test(code||'')){
        event.preventDefault();event.target.value=code;
        event.target.dispatchEvent(new Event('input',{bubbles:true}));
      }
    });
    let requestVersion=0;
    let emailChallengeId='';
    function closeEmailVerification(){
      requestVersion++;emailChallengeId='';form.reset();form.removeAttribute('aria-busy');
      form.querySelectorAll('button').forEach(button=>{button.disabled=false;});
      fields.hidden=true;fields.disabled=true;panel.hidden=true;
      send.textContent='Send Confirmation Code';status.textContent='';
      action.setAttribute('aria-expanded','false');
    }
    function updateEmailVerificationStatus(){
      const savedEmail=accountProfile?.email||'';
      const dirty=email.value.trim()!==savedEmail;
      const verified=!!savedEmail&&!dirty&&!!accountProfile?.emailVerified;
      badge.textContent=verified?'Verified':'Not Verified';
      action.hidden=verified;action.disabled=!savedEmail||dirty;
      hint.textContent=dirty?'Save Personal Details before verifying this address.':!savedEmail?
        'Save an email address before verifying it.':verified?
        'Your email address is verified for optional password recovery.':'Verify this address before using optional password recovery.';
      if(dirty||!savedEmail||verified)closeEmailVerification();
    }
    function showEmailVerificationFeedback(message,focusNext){
      status.textContent=message;
      status.scrollIntoView({block:'center',behavior:'auto'});
      if(focusNext)focusNext.focus({preventScroll:true});
    }
    action.addEventListener('click',()=>{
      closeEmailVerification();panel.hidden=false;action.setAttribute('aria-expanded','true');
      form.elements.password.focus();
    });
    cancel.addEventListener('click',()=>{closeEmailVerification();action.focus();});
    email.addEventListener('input',updateEmailVerificationStatus);
    updateEmailVerificationStatus();
    send.addEventListener('click',async()=>{
      if(send.disabled||!form.elements.password.reportValidity())return;
      const version=++requestVersion;
      send.disabled=true;form.querySelector('[type="submit"]').disabled=true;
      form.setAttribute('aria-busy','true');
      showEmailVerificationFeedback('Requesting a confirmation code…');
      try{
        const result=await postInventory('/api/account/email/request',{password:form.elements.password.value});
        if(version!==requestVersion||!root.isConnected)return;
        emailChallengeId=result.challengeId;
        form.elements.token.value='';fields.hidden=false;fields.disabled=false;
        send.textContent='Resend Confirmation Code';
        showEmailVerificationFeedback(result.message+' Check your email and enter the confirmation code.',form.elements.token);
      }catch(error){
        if(version===requestVersion&&root.isConnected)showEmailVerificationFeedback(error.message,status);
      }finally{
        if(version===requestVersion&&root.isConnected){send.disabled=false;form.querySelector('[type="submit"]').disabled=false;form.removeAttribute('aria-busy');}
      }
    });
    form.addEventListener('submit',async event=>{
      event.preventDefault();event.stopPropagation();
      const button=form.querySelector('[type="submit"]');
      if(fields.disabled||button.disabled)return;
      const version=++requestVersion;
      button.disabled=true;send.disabled=true;form.setAttribute('aria-busy','true');
      showEmailVerificationFeedback('Checking your confirmation code…');
      try{
        await postInventory('/api/account/email/confirm',{password:form.elements.password.value,token:form.elements.token.value.trim(),challengeId:emailChallengeId});
        if(version!==requestVersion||!root.isConnected)return;
        form.reset();await loadAccountProfile();
        if(version!==requestVersion||!root.isConnected)return;
        renderContent();
        const confirmation=document.getElementById('account-email-hint');
        if(confirmation){confirmation.textContent='Email address verified. You can use optional password recovery.';confirmation.focus();}
        showToast('Email address verified.');
      }catch(error){
        if(version===requestVersion&&root.isConnected)showEmailVerificationFeedback(error.message,status);
      }finally{
        if(version===requestVersion&&root.isConnected){button.disabled=false;send.disabled=false;form.removeAttribute('aria-busy');}
      }
    });
  }
  hydrateAccount=function hydrateAccount(container){
    const root=container.querySelector('.account-screen');
    if(!root)return;
    root.querySelectorAll('.account-panel').forEach(panel=>{
      const selected=panel.dataset.section===activeAccountSection;
      panel.classList.toggle('active',selected);
      panel.hidden=!selected;
    });
    root.querySelectorAll('.subnav [data-action="select-account-section"]').forEach(button=>{
      const selected=button.dataset.section===activeAccountSection;
      button.classList.toggle('active',selected);
      button.setAttribute('aria-selected',String(selected));
    });
    const form=root.querySelector('#personal-details-form');
    if(form){
      for(const name of ['firstName','lastName','displayName','email']){
        form.elements.namedItem(name).value=accountProfile?.[name]||'';
      }
      root.querySelector('#profile-username').value=signedInUsername||'';
      const image=root.querySelector('#photo-preview-image');
      const placeholder=root.querySelector('.profile-placeholder');
      if(accountPhotoUrl){
        image.src=accountPhotoUrl;image.hidden=false;placeholder.hidden=true;
      }else{
        image.removeAttribute('src');image.hidden=true;placeholder.hidden=false;
      }
      root.querySelector('#photo-remove').hidden=!accountPhotoUrl;
    }
    initialiseAccountEmailVerification(root);
    const preference=caffootThemePreference();
    const label=root.querySelector('#home-theme-name');
    if(label)label.textContent=preference==='system'?'Use System Setting':preference==='dark'?'Dark Mode':'Light Mode';
    root.querySelectorAll('.appearance-buttons [data-theme]').forEach(button=>{
      const on=button.dataset.theme===preference;
      button.classList.toggle('selected',on);
      button.setAttribute('aria-pressed',String(on));
    });
  };
  function updateAccountHeaderPhoto(){
    const picture=document.getElementById('header-account-initial');
    if(!picture)return;
    picture.replaceChildren();
    if(accountPhotoUrl){
      const img=document.createElement('img');
      img.src=accountPhotoUrl;
      img.alt='';
      picture.append(img);
    }else{
      picture.textContent=(accountProfile?.displayName||signedInUsername||'A').charAt(0).toUpperCase();
    }
  }
  async function loadAccountProfile(){
    const response=await fetch('/api/account/profile',{cache:'no-store'});
    if(!response.ok)throw new Error('Unable to load personal details.');
    const profile=await response.json();
    let nextPhotoUrl=null;
    if(profile.hasPhoto){
      const photo=await fetch('/api/account/photo',{cache:'no-store'});
      if(!photo.ok)throw new Error('Unable to load profile photo.');
      nextPhotoUrl=URL.createObjectURL(await photo.blob());
    }
    const oldPhotoUrl=accountPhotoUrl;
    accountProfile=profile;
    accountPhotoUrl=nextPhotoUrl;
    updateAccountHeaderPhoto();
    if(oldPhotoUrl)URL.revokeObjectURL(oldPhotoUrl);
  }
  removeAccountPhoto=async function removeAccountPhoto(){
    await postInventory('/api/account/photo/remove',{remove:true});
    await loadAccountProfile();
    if(currentTab==='account')renderContent();
    showToast('Profile photo removed.');
  };
  // Users: administrator-only section, following the published sidebar and panel style.
  let users = null;
  let activeUserEditorId = null;
  nextRenderUsers = function() {
    if (!sessionIsAdmin) return '';
    const profileFields=(profile={})=>[
      ['firstName','First Name','text',100],
      ['lastName','Last Name','text',100],
      ['displayName','Display Name','text',120],
      ['email','E-Mail Address','email',254]
    ].map(([key,label,type,max])=>
      '<div class="field"><label for="user-'+key.replace(/[A-Z]/g,letter=>'-'+letter.toLowerCase())+'">'+label+'</label>'+
      '<input class="input" id="user-'+key.replace(/[A-Z]/g,letter=>'-'+letter.toLowerCase())+'" name="'+key+'" type="'+type+
      '" autocomplete="off" placeholder="'+({firstName:'First name',lastName:'Last name',displayName:'Name shown across Caffoot Lite',email:'name@example.com'}[key])+'" maxlength="'+max+'" value="'+escapeHtml(profile[key]||'')+'"></div>'
    ).join('');
    let html='<div class="users-live">';
    if (!users) return html + '<p role="status">Loading users...</p></div>';
    if (activeUsersTab==='overview') {
      const total=users.length,admins=users.filter(u=>u.isAdmin).length;
      const active=users.filter(u=>u.active).length,enrolled=users.filter(u=>u.mfaEnrolled).length;
      const stats=[
        ['Total users',total,'users','Recorded accounts'],
        ['Administrators',admins,'shield','Full administration access'],
        ['Active users',active,'check','Accounts currently enabled'],
        ['MFA enrolled',enrolled,'key','Protected by an authenticator']
      ];
      const stat=([label,count,icon,foot])=>'<section class="card cardpad stat">'+
        '<div class="stathead"><span>'+label+'</span><span class="stat-icon">'+renderInterfaceTemplate('users/icon-'+icon,[])+'</span></div>'+
        '<div class="statnum">'+count+'</div><div class="statfoot">'+foot+'</div></section>';
      const bars=(items)=>items.map(([label,count,colour])=>'<div class="barrow">'+
        '<div class="barline"><span>'+label+'</span><b>'+count+'</b></div>'+
        '<div class="track"><div class="fill '+colour+'" style="width:'+(total?Math.round(count/total*100):0)+'%"></div></div></div>').join('');
      html+='<section class="section active" aria-label="Users Overview">'+
        renderInterfaceTemplate("users/overview-summary",[])+
        '<button class="btn primary" type="button" data-action="users-add-nav">+ Add User</button></div>';
      html+='<div class="cards4">'+stats.map(stat).join('')+'</div>';
      html+='<div class="two-col"><div class="card cardpad"><h3 class="cardtitle">Accounts by role</h3>'+
        '<p class="sub">Administrators and standard users across this installation.</p>'+
        bars([['Administrators',admins,''],['Standard users',total-admins,'soft']])+
        '<div class="card-end"><span class="tiny">All figures come from the saved accounts.</span>'+
        '<button class="action-link" type="button" data-action="select-users-section" data-tab="list">View User List →</button></div></div>';
      html+='<div class="card cardpad"><h3 class="cardtitle">Authenticator enrolment</h3>'+
        '<p class="sub">MFA is required before editing or administrator access is granted.</p>'+
        bars([['Enrolled',enrolled,''],['Not enrolled',total-enrolled,'orange']])+
        '<div class="card-end"><span class="tiny">Each user enrols MFA under My Account.</span>'+
        '<button class="action-link" type="button" data-action="users-filter-pending">Review not enrolled →</button></div></div></div>';
      html+='<div class="card cardpad" style="margin-top:17px"><div class="section-heading"><div><h2>Access, made simple</h2>'+
        '<p>Individual permissions keep responsibilities clearly separated.</p></div></div>'+
        renderInterfaceTemplate("users/read-access-guide",[])+
        '<div class="guide-item"><strong>Read</strong><p>Users can view permitted records without changing information in that section.</p></div>'+
        renderInterfaceTemplate("users/edit-access-guide",[]);
      return html+'</div>';
    }
    if (activeUsersTab==='add') {
      return html+'<section class="section active users-create-shell" aria-label="Add User">'+
        renderInterfaceTemplate("users/next-render-users-1",[])+
        '<div class="addwrap"><div class="card form-panel"><h3 class="cardtitle">Create User</h3>'+
        renderInterfaceTemplate("users/next-render-users-2",[])+
        '<form id="next-user-create-form"><div class="form-grid">'+
        renderInterfaceTemplate("users/next-render-users-3",[])+
        renderInterfaceTemplate("users/next-render-users-4",[])+
        renderInterfaceTemplate("users/next-render-users-5",[])+
        '<div class="form-grid profile-grid">'+profileFields()+'</div>'+
        renderInterfaceTemplate("users/next-render-users-6",[])+
        renderInterfaceTemplate("users/next-render-users-7",[])+
        renderInterfaceTemplate("users/next-render-users-8",[]);
    }
    const rows=users.map(user=>{
      const own=user.username.toLowerCase()===signedInUsername.toLowerCase();
      const role=user.isAdmin?'Administrator':'Standard user';
      const grantPills=user.isAdmin?'<span class="badge dark">All sections</span>':['Devices','IPAM','Racks'].map(section=>{
        const level=user.isAdmin?'edit':(user.permissions?.[section]||'');
        return `<span class="mini ${level==='edit'?'edit':level===''?'no':''}" title="${section}: ${level||'No access'}">${section}: ${level==='edit'?'Edit':level==='read'?'Read':'—'}</span>`;
      }).join('');
      return renderInterfaceTemplate("users/rows-1",[user.id,escapeHtml([user.username,user.profile?.firstName,user.profile?.lastName,user.profile?.displayName,user.profile?.email].filter(Boolean).join(' ').toLowerCase()),user.active?'active':'disabled',user.mfaEnrolled?'enrolled':'pending',escapeHtml(user.username.slice(0,1).toUpperCase()),escapeHtml(user.username),own?'Your account · Protected':(user.profile?.displayName||[user.profile?.firstName,user.profile?.lastName].filter(Boolean).join(' ')||role),user.isAdmin?'blue':'dark',role,user.active?'green':'red',user.active?'Active':'Disabled',user.mfaEnrolled?'green':'amber',user.mfaEnrolled?'✓ MFA enrolled':'○ Not enrolled',grantPills,user.id,own?'View':'Manage']);
    }).join('');
    html+=renderInterfaceTemplate("users/account-list-panel",[rows,users.length,users.length]);
    const editingUser=users.find(u=>u.id===activeUserEditorId);
    if(editingUser){
      const own=editingUser.username.toLowerCase()===signedInUsername.toLowerCase();
      const permissionControls=['Devices','IPAM','Racks'].map(section=>renderInterfaceTemplate("users/permission-controls-1",[section,section,section,editingUser.id,section,own||editingUser.isAdmin?'disabled':'',[['','No access'],['read','Read'],['edit','Edit']].map(([value,label])=>`<option value="${value}" ${(editingUser.isAdmin?'edit':editingUser.permissions?.[section]||'')===value?'selected':''}>${label}</option>`).join('')])).join('');
      const operation=(kind,label)=>`<button type="button" class="btn ${kind==='delete'?'danger':''}" data-next-user-operation="${kind}" data-user-id="${editingUser.id}" ${own?'disabled':''}>${label}</button>`;
      const profile=editingUser.profile||{};
      const profileHTML=renderInterfaceTemplate("users/source-profile",[editingUser.id,...['firstName','lastName','displayName','email'].map(key=>escapeHtml(profile[key]||'')),own?'Edit your own personal details through My Account.':'Contact details do not change the sign-in username or account permissions. Saving an email address does not verify it.',own?'disabled':'']);
      const meta=renderInterfaceTemplate("users/source-user-meta",[editingUser.active?'green':'red',editingUser.active?'Active':'Disabled',editingUser.isAdmin?'blue':'dark',editingUser.isAdmin?'Administrator · all sections':'Standard user',editingUser.mfaEnrolled?'green':'amber',editingUser.mfaEnrolled?'MFA enrolled':'MFA not enrolled']);
      const administratorNote=editingUser.isAdmin?'<div class="note-row" style="margin-bottom:13px">Administrators have access to all inventory sections. Their per-section permissions are not individually configured.</div>':'';
      const warnings=own?'<div class="modal-warning">You cannot disable, demote or delete your own signed-in administrator account. These controls are intentionally unavailable.</div>':!editingUser.mfaEnrolled&&!editingUser.isAdmin?'<div class="modal-warning">Editing and administrator access require the user to enrol an authenticator in My Account first. Read access is allowed without enrolment.</div>':'';
      const activeControl=renderInterfaceTemplate("users/source-account-control",[editingUser.active?'Disable account':'Enable account',editingUser.active?'Prevent this person signing in until the account is enabled again.':'Allow this person to sign in again.',operation('active',editingUser.active?'Disable':'Enable')]);
      const administratorControl=renderInterfaceTemplate("users/source-account-control",[editingUser.isAdmin?'Remove administrator':'Make administrator',editingUser.isAdmin?'Return this account to standard-user status.':'Grant existing administrator privileges to an MFA-enrolled account.',operation('admin',editingUser.isAdmin?'Remove admin':'Make admin')]);
      html+=renderInterfaceTemplate("users/account-management-dialog",[own?'Your administrator account':'Manage '+escapeHtml(editingUser.username),own?'Self-protection prevents account changes here. Use My Account for your own security settings.':'Review access and account controls for this user.',meta,profileHTML,administratorNote,renderInterfaceTemplate("users/access-summary",[permissionControls]),warnings,activeControl,administratorControl,renderInterfaceTemplate("users/source-delete-control",[operation('delete','Delete User')])]);
      document.body.style.overflow='hidden';
    }
    return html+'</div>';
  };
  // Clear the account editor before the shared tab handler renders the next Users tab.
  // This listener shares the real editor state rather than creating a stray global.
  document.addEventListener('click', event=>{
    if(event.target.closest('[data-action="select-users-section"],[data-action^="sidebar-users-"]')) {
      activeUserEditorId=null;
    }
  },true);
  function filterUserRows() {
    const list=document.getElementById('users-live-list');
    if(!list) return;
    const search=(list.querySelector('#live-users-search')?.value||'').trim().toLowerCase();
    const status=list.querySelector('#live-users-status')?.value||'all';
    const mfa=list.querySelector('#live-users-mfa')?.value||'all';
    let count=0;
    const rows=[...list.querySelectorAll('[data-users-row]')];
    rows.forEach(row=>{
      const visible=(!search || row.dataset.search.includes(search)) &&
        (status==='all'||row.dataset.active===status) &&
        (mfa==='all'||row.dataset.mfa===mfa);
      row.hidden=!visible;
      if(visible)count++;
    });
    const caption=list.querySelector('#live-users-count');
    if(caption)caption.textContent='Showing '+count+' of '+rows.length+' accounts';
  }
  document.addEventListener('input', event=>{
    if(event.target?.id==='live-users-search')filterUserRows();
  });
  document.addEventListener('change', event=>{
    if(['live-users-status','live-users-mfa'].includes(event.target?.id))filterUserRows();
  });
  function closeUserWorkspace(){
    const closingId=activeUserEditorId;
    activeUserEditorId=null;
    renderContent();
    document.querySelector('#main-content [data-action="users-open-editor"][data-user-id="'+closingId+'"]')?.focus();
  }
  document.addEventListener('click', event=>{
    const target=event.target.closest('[data-action="users-open-editor"],[data-action="users-close-editor"],[data-action="users-add-nav"]');
    if(!target||currentTab!=='users'||!sessionIsAdmin)return;
    if(target.dataset.action==='users-open-editor'){
      const id=Number(target.dataset.userId);
      if(!users?.some(user=>user.id===id))return;
      activeUserEditorId=id;
      renderContent();
      document.querySelector('#main-content .users-management-modal [data-action="users-close-editor"]')?.focus();
    } else if(target.dataset.action==='users-close-editor'){
      closeUserWorkspace();
    } else {
      activeUserEditorId=null;
      activeUsersTab='add';
      switchTab('users');
    }
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&activeUserEditorId!==null&&currentTab==='users'){
      closeUserWorkspace();
    }
  });
  let signedInUsername = '';
  async function loadCentralUsers() {
    const response=await fetch('/api/users',{cache:'no-store'});
    if (!response.ok) throw new Error('Unable to load users.');
    users=(await response.json()).users;
    if (currentTab === 'users') renderContent();
  }
  async function changeCentralUser(path,payload) {
    await postInventory(path,payload);
    await loadCentralUsers();
    showToast('Users updated.');
  }

  // Published v1.3.3 import decisions stay explicit. Original JSON is held by
  // the server draft; no inventory data is written to browser storage.
  let importDraft=null;
  let importWorking=false;
  const accessPointMounts=['Tabletop / Shelf Mounted','Ceiling Mounted','Wall Mounted','Pole Mounted','Desktop'];
  function importPanel(body) {
    openModal('<div class="p-6 sm:p-7 space-y-4 text-slate-900 dark:text-white">' +
      '<h2 class="text-xl font-bold">Import Inventory from v1.3.3</h2>' + body + '</div>');
  }
  async function cancelImport() {
    if (!importDraft || importWorking) return;
    const id=importDraft.id;
    importDraft=null;
    await postInventory('/api/import/cancel',{draftId:id}).catch(error=>showToast(error.message,'error'));
  }
  nextImportModalClosed=function(){ void cancelImport(); };
  function showImportReview(review) {
    if (!importDraft) return;
    if (review.requiresAccessPointMountReview) {
      const conflicts=review.accessPointMountConflicts||[];
      let rows=renderInterfaceTemplate("migration/rows-1",[]);
      for (const item of conflicts) {
        rows+='<label class="block text-sm font-semibold">' + escapeHtml(item.name||item.id||'Access Point') +
          ' — ' + escapeHtml(item.mountType||'Unknown') + ' (' + escapeHtml(item.rack||'none') + ')' +
          '<select data-next-ap-mount class="block w-full border rounded-xl p-2 mt-1 bg-white dark:bg-slate-700" required>' +
          '<option value="">Select mounting type...</option>';
        for (const mount of accessPointMounts) rows+='<option value="' + escapeHtml(mount) + '">' + escapeHtml(mount) + '</option>';
        rows+='</select></label>';
      }
      importPanel(rows + renderInterfaceTemplate("migration/show-import-review-1",[]) +
        '<button type="button" data-next-import-action="choices" class="px-4 py-2 rounded-xl bg-indigo-700 text-white">Continue</button></div>');
      return;
    }
    const counts=review.counts||{};
    const current=counts.current||{},incoming=counts.backup||{};
    let body='<p class="text-sm">Review the complete inventory replacement before confirming. Existing inventory will not be merged.</p>' +
      renderInterfaceTemplate("migration/inventory-preview-table",[]);
    for (const [key,label] of [['devices','Devices'],['racks','Racks'],['subnets','Subnets'],['ipAllocations','IPAM allocations']])
      body+='<tr class="border-t dark:border-slate-600"><th class="text-left p-2">' + label + '</th><td class="text-right p-2">' +
        (current[key]===undefined?'—':Number(current[key])) + '</td><td class="text-right p-2">' +
        Number(incoming[key]||0) + '</td></tr>';
    body+='</tbody></table></div><p class="text-sm">Missing rack dimensions remain unrecorded. Use Correct Rack Specifications to enter and confirm measured dimensions after import.</p>';
    if (review.requiresLegacyMountReview) {
      const fixes=review.legacyMountRepairs||[];
      body+='<div class="border border-amber-500 rounded-xl p-3 space-y-2"><h3 class="font-bold">Review legacy computer mounting corrections</h3>';
      for (const item of fixes)
        body+='<p class="text-sm">' + escapeHtml(item.name||item.id||'Device') + ': ' +
          escapeHtml(item.mountType||'Unknown') + ' → ' + escapeHtml(item.proposedMountType||'Desktop') +
          ' (Location: Unknown)</p>';
      body+=renderInterfaceTemplate("migration/legacy-mounting-approval",[]);
    }
    body+=renderInterfaceTemplate("migration/inventory-replacement-approval",[]) +
      renderInterfaceTemplate("migration/review-actions",[]) +
      '<button type="button" data-next-import-action="confirm" class="px-4 py-2 rounded-xl bg-indigo-700 text-white">Confirm Import</button></div>';
    importPanel(body);
  }
  async function chooseImportFile(file) {
    if (!file) return;
    if (!nextImportAllowed) { showToast('Edit permission is required for Devices, IPAM and Racks.', 'error'); return; }
    if (importDraft) await cancelImport();
    if (file.size > 10*1024*1024) { showToast('Import file exceeds the supported size.', 'error'); return; }
    importWorking=true;
    try {
      const response=await fetch('/api/import/preview',{
        method:'POST',headers:{'Content-Type':'application/octet-stream','X-CSRF-Token':csrfToken},body:file
      });
      const payload=await response.json();
      if (!response.ok) throw new Error(payload.error||'Unable to review import.');
      importDraft={id:payload.draftId};
      showImportReview(payload.review);
    } catch(error) { showToast(error.message,'error'); }
    finally { importWorking=false; }
  }
  async function actOnImport(action) {
    if (action==='cancel') { await cancelImport(); closeModal(true); return; }
    if (!importDraft || importWorking) return;
    let url,payload;
    if (action==='choices') {
      const selectors=[...document.querySelectorAll('#modal-content [data-next-ap-mount]')];
      const choices=selectors.map(input=>input.value);
      if (choices.some(value=>!accessPointMounts.includes(value))) {
        showToast('Select a mounting type for every Access Point.','error');return;
      }
      url='/api/import/access-point-choices';
      payload={draftId:importDraft.id,choices};
    } else if (action==='confirm') {
      if (!document.getElementById('next-import-replace-approval')?.checked) {
        showToast('Confirm that this import replaces existing inventory.','error');return;
      }
      if (document.getElementById('next-import-legacy-approval') &&
          !document.getElementById('next-import-legacy-approval').checked) {
        showToast('Review and approve the mounting corrections.','error');return;
      }
      url='/api/import/confirm';
      payload={draftId:importDraft.id,replacementConfirmed:true,
               legacyMountApproved:!!document.getElementById('next-import-legacy-approval')?.checked};
    } else return;
    importWorking=true;
    try {
      const result=await postInventory(url,payload);
      if (action==='choices') showImportReview(result.review);
      else {
        importDraft=null;
        closeModal(true);
        await refreshCentralInventory();
        showToast('Inventory imported.');
      }
    } catch(error) {
      if (action==='confirm') importDraft=null; // Server consumes confirmation drafts.
      showToast(error.message,'error');
    } finally { importWorking=false; }
  }
  // Capture import-file change before the published browser-only import handler.
  document.getElementById('import-file').addEventListener('change',event=>{
    event.stopImmediatePropagation();
    const file=event.target.files?.[0];
    event.target.value='';
    void chooseImportFile(file);
  },true);
  // Reuse existing authenticated account APIs; password and MFA changes end the session.
  document.addEventListener('submit',event=>{
    const form=event.target;
    const id=form.id;
    if(!['next-account-password-form','next-account-mfa-start','next-account-mfa-confirm','personal-details-form'].includes(id))return;
    event.preventDefault();event.stopImmediatePropagation();
    const data=new FormData(form),submit=form.querySelector('button[type="submit"]');
    submit.disabled=true;
    void (async()=>{
      if(id==='personal-details-form'){
        const details={
          firstName:String(data.get('firstName')||''),
          lastName:String(data.get('lastName')||''),
          displayName:String(data.get('displayName')||''),
          email:String(data.get('email')||'')
        };
        accountProfile=await postInventory('/api/account/profile',details);
        updateAccountHeaderPhoto();
        if(currentTab==='account')renderContent();
        showToast('Personal details saved.');
      }else if(id==='next-account-password-form'){
        if(data.get('newPassword')!==data.get('confirmPassword'))throw new Error('The new passwords do not match.');
        await postInventory('/api/account/password',{
          currentPassword:data.get('currentPassword'),newPassword:data.get('newPassword')
        });
        window.location.assign('/setup');
      }else if(id==='next-account-mfa-start'){
        const result=await postInventory('/api/account/mfa/start',{password:data.get('password')});
        const panel=document.getElementById('next-account-mfa-details');
        document.getElementById('next-account-mfa-secret').textContent=result.mfaSecret;
        form.hidden=true;panel.hidden=false;
        const holder=document.getElementById('next-account-mfa-qr');
        try{
          new QRCode(holder,{text:result.mfaUri,width:204,height:204,correctLevel:QRCode.CorrectLevel.M});
        }catch(error){holder.textContent='QR code unavailable. Use the setup key below.';}
      }else{
        await postInventory('/api/account/mfa/confirm',{code:data.get('code')});
        window.location.assign('/setup');
      }
    })().catch(error=>showToast(error.message,'error')).finally(()=>{submit.disabled=false;});
  },true);
  document.addEventListener('change',event=>{
    if(event.target.id!=='account-photo-input')return;
    event.stopImmediatePropagation();
    const file=event.target.files?.[0];
    event.target.value='';
    if(!file)return;
    void (async()=>{
      if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024)
        throw new Error('Upload a JPG, PNG or WEBP image up to 5 MB.');
      const response=await fetch('/api/account/photo',{
        method:'POST',headers:{'Content-Type':file.type,'X-CSRF-Token':csrfToken},body:file
      });
      if(!response.ok){
        const error=await response.json().catch(()=>({}));
        throw new Error(error.error||'Unable to save profile photo.');
      }
      await loadAccountProfile();
      if(currentTab==='account')renderContent();
      showToast('Profile photo saved.');
    })().catch(error=>showToast(error.message,'error'));
  },true);
  document.addEventListener('click',event=>{
    if(event.target.id!=='next-account-signout')return;
    event.preventDefault();
    void postInventory('/api/logout',{}).then(()=>window.location.assign('/setup'))
      .catch(error=>showToast(error.message,'error'));
  },true);
  document.addEventListener('submit',event=>{
    if (event.target.id !== 'next-user-create-form' || !sessionIsAdmin) return;
    event.preventDefault();event.stopImmediatePropagation();
    const form=event.target;
    const fields=new FormData(form);
    void changeCentralUser('/api/users/create',{
      username:fields.get('username'),password:fields.get('password'),
      profile:{
        firstName:String(fields.get('firstName')||''),
        lastName:String(fields.get('lastName')||''),
        displayName:String(fields.get('displayName')||''),
        email:String(fields.get('email')||'')
      }
    }).then(()=>{
      activeUsersTab='list';
      switchTab('users');
    }).catch(error=>showToast(error.message,'error'));
  },true);
  document.addEventListener('submit',event=>{
    if(event.target.id!=='next-user-profile-form'||!sessionIsAdmin)return;
    event.preventDefault();event.stopImmediatePropagation();
    const form=event.target,fields=new FormData(form);
    const submit=form.querySelector('button[type="submit"]');
    submit.disabled=true;
    void changeCentralUser('/api/users/profile',{
      userId:Number(form.dataset.userId),
      profile:{
        firstName:String(fields.get('firstName')||''),
        lastName:String(fields.get('lastName')||''),
        displayName:String(fields.get('displayName')||''),
        email:String(fields.get('email')||'')
      }
    }).catch(error=>{showToast(error.message,'error');submit.disabled=false;});
  },true);
  document.addEventListener('click',event=>{
    if(!event.target.closest('[data-action="users-filter-pending"]')||!sessionIsAdmin||currentTab!=='users')return;
    activeUsersTab='list';
    switchTab('users');
    const select=document.getElementById('live-users-mfa');
    if(select){select.value='pending';filterUserRows();}
  });
  document.addEventListener('change',event=>{
    const select=event.target.closest('[data-next-user-permission]');
    if (!select || !sessionIsAdmin) return;
    void changeCentralUser('/api/users/permission',{
      userId:Number(select.dataset.userId),section:select.dataset.section,
      level:select.value||null
    }).catch(async error=>{
      const message = /^MFA enrolment required for (editing|administrators)$/.test(error.message)
        ? 'This user must set up MFA in My account before editing or administrator access can be granted.'
        : error.message;
      showToast(message,'error');
      await loadCentralUsers().catch(()=>{});
    });
  },true);
  document.addEventListener('click',event=>{
    const element=event.target.closest('[data-next-user-operation],[data-next-import-action],[data-action="next-import-pick"]');
    if (!element) return;
    event.preventDefault();event.stopImmediatePropagation();
    if (element.dataset.action==='next-import-pick') {
      if (nextImportAllowed) document.getElementById('import-file').click();
      return;
    }
    if (element.dataset.nextImportAction) {
      void actOnImport(element.dataset.nextImportAction);return;
    }
    if (!sessionIsAdmin) return;
    const id=Number(element.dataset.userId);
    const user=(users||[]).find(entry=>entry.id===id);
    if (!user || user.username.toLowerCase()===signedInUsername.toLowerCase()) return;
    const kind=element.dataset.nextUserOperation;
    let path,payload;
    if (kind==='delete') {
      if (!confirm('Delete ' + user.username + '?')) return;
      path='/api/users/delete';payload={userId:id};
    } else if (kind==='active') {
      path='/api/users/active';payload={userId:id,active:!user.active};
    } else if (kind==='admin') {
      path='/api/users/admin';payload={userId:id,isAdmin:!user.isAdmin};
    } else return;
    void changeCentralUser(path,payload).catch(error=>showToast(error.message,'error'));
  },true);

  // Settings & Data: replace stand-alone preview actions with live workflows.
  document.addEventListener('click',event=>{
    const target=event.target.closest('.settings-screen [data-action]');
    if(!target||currentTab!=='settings'||!sessionIsAdmin)return;
    const action=target.dataset.action;
    if(action==='select-settings-tab'&&['data','email','maintenance'].includes(target.dataset.tab)){
      activeSettingsTab=target.dataset.tab;
      renderContent();
    }else if(action==='settings-screen-copy'){
      const value=document.getElementById(target.dataset.copyId)?.textContent;
      if(value)void navigator.clipboard.writeText(value)
        .then(()=>showToast('Example command copied. Verify your actual storage volume.'))
        .catch(()=>showToast('Clipboard unavailable. Select and copy the command manually.','error'));
    }else if(action==='settings-screen-guidance'){
      window.open('https://github.com/Caffoot/Caffoot-Lite/blob/main/docs/How%20To%27s/Features%20and%20Instructions/Migration-Backup-and-Restore.md','_blank','noopener,noreferrer');
    }else if(action==='reset-smtp-settings'){
      renderContent();
      showToast('Unsaved email settings discarded.');
    }
  });
  document.addEventListener('change',event=>{
    if(currentTab!=='settings')return;
    const form=event.target.closest('#smtp-settings-form');
    if(form&&['authenticate','security'].includes(event.target.name)){
      updateSmtpFields(form);
    }
  });
  document.addEventListener('submit',event=>{
    if(!['smtp-settings-form','smtp-test-form'].includes(event.target.id))return;
    event.preventDefault();event.stopImmediatePropagation();
    if(!sessionIsAdmin)return;
    const form=event.target,button=form.querySelector('button[type="submit"]');
    if(button)button.disabled=true;
    void (async()=>{
      if(form.id==='smtp-settings-form'){
        const data=new FormData(form);
        const result=await postInventory('/api/settings/email',{
          host:String(data.get('host')||''),
          port:Number(data.get('port')),
          security:String(data.get('security')||''),
          authenticate:form.elements.namedItem('authenticate').checked,
          username:String(data.get('username')||''),
          password:String(data.get('password')||''),
          fromName:String(data.get('fromName')||''),
          fromEmail:String(data.get('fromEmail')||''),
          insecureConfirmed:form.elements.namedItem('insecureConfirmed').checked
        });
        smtpSettings=result;
        smtpLoaded=true;
        if(currentTab==='settings')renderContent();
        showToast('Outgoing email settings saved.');
      }else{
        await postInventory('/api/settings/email/test',{
          recipient:String(new FormData(form).get('recipient')||'')
        });
        showToast('Test email sent.');
        if(button)button.disabled=false;
      }
    })().catch(error=>{
      showToast(error.message,'error');
      if(button)button.disabled=false;
    });
  },true);
  document.addEventListener('click', event => {
    const element = event.target.closest('button,[data-action]');
    if (!element) return;
    const action = element.dataset.action || '';
    if (isBlockedAction(action, element) || (element.matches('button') && element.type==='submit' && element.form &&
        !element.form.matches('form[data-device-form="true"],#next-user-create-form,#next-user-profile-form,#next-account-password-form,#next-account-mfa-start,#next-account-mfa-confirm,#personal-details-form,#smtp-settings-form,#smtp-test-form,#account-email-verification-form') &&
        !(editPermissions.IPAM && element.closest('form[data-form-action="ip"],form[data-form-action="bulk-ip"],form[data-form-action="subnet"],form[data-ipam-subnet-creation]')) &&
        !(editPermissions.Devices && editPermissions.Racks && element.closest('#rack-shelf-removal-form')) &&
        !(editPermissions.Racks && element.closest('form[data-form-action="rack"],form[data-form-action="assign"],#rack-accessory-form')))) {
      event.preventDefault();
      event.stopImmediatePropagation();
      showToast(!sessionIsAdmin ? 'Edit permission is required for this action.' : 'This inventory operation is not yet connected to SQLite.', 'error');
    }
  },true);
  document.addEventListener('submit',event => {
    if (event.target.matches('#next-account-password-form,#next-account-mfa-start,#next-account-mfa-confirm,#personal-details-form,#next-user-profile-form,#smtp-settings-form,#smtp-test-form,#account-email-verification-form') ||
        (editPermissions.Devices && event.target.matches('form[data-device-form="true"]')) ||
        (editPermissions.IPAM && event.target.matches('form[data-form-action="ip"],form[data-form-action="bulk-ip"],form[data-form-action="subnet"],form[data-ipam-subnet-creation]')) ||
        (editPermissions.Racks && event.target.matches('form[data-form-action="rack"],form[data-form-action="assign"],#rack-accessory-form')) ||
        (editPermissions.Devices && editPermissions.Racks && event.target.matches('#rack-shelf-removal-form')) ||
        (sessionIsAdmin && event.target.matches('#next-user-create-form'))) return;
    event.preventDefault();event.stopImmediatePropagation();
  },true);
  const root=document.getElementById('main-content');
  new MutationObserver(applyAllowedControls).observe(root,{childList:true,subtree:true});
  new MutationObserver(applyAllowedControls).observe(document.getElementById('modal-content'),{childList:true,subtree:true});
  try {
    const sessionResponse=await fetch('/api/session',{cache:'no-store'});
    if(!sessionResponse.ok) throw new Error('Please sign in first.');
    const session=await sessionResponse.json();
    csrfToken=session.csrf_token;
    sessionIsAdmin=!!session.is_admin;
    window.nextSessionIsAdmin=sessionIsAdmin;
    signedInUsername=session.username;
    sessionMfaEnrolled=!!session.mfa_enrolled;
    await loadAccountProfile();
    window.nextMfaEnrolled=sessionMfaEnrolled;
    document.getElementById('next-users-nav').classList.toggle('hidden', !sessionIsAdmin);
    document.getElementById('next-settings-nav').classList.toggle('hidden', !sessionIsAdmin);
    if (sessionIsAdmin) await loadCentralUsers();
    await refreshCentralInventory(false);
    // Hide only the browser-backup actions excluded from the server application by issue #215.
    document.querySelectorAll('[data-action="settings-backup"],[data-action="export-data"],[data-action="export-backup"]').forEach(el=>el.hidden=true);
    switchTab('dashboard');
    // Preserve existing fragment entry points without changing server permissions.
    const destination = window.location.hash.slice(1);
    const legacyDestination = {
      dashboard:'dashboard', devices:'devices', ipam:'ipam',
      racks:'racks', audit:'audit', users:'users',
      settings:'settings', account:'account'
    }[destination];
    const canOpen = legacyDestination === 'dashboard' || legacyDestination === 'account' ||
      (legacyDestination === 'devices' && permissions.Devices?.read) ||
      (legacyDestination === 'ipam' && permissions.IPAM?.read) ||
      (legacyDestination === 'racks' && permissions.Racks?.read) ||
      (legacyDestination === 'audit' && ['Devices','IPAM','Racks'].some(area => permissions[area]?.read)) ||
      (sessionIsAdmin && ['users','settings'].includes(legacyDestination));
    if (legacyDestination && canOpen) switchTab(legacyDestination);
    document.getElementById('app').inert=false;
    document.getElementById('app').setAttribute('aria-busy','false');
  }catch(error){
    const container=document.getElementById('main-content');
    container.replaceChildren();
    const warning=document.createElement('p');
    warning.textContent=error.message;
    warning.style.cssText='padding:24px;color:#b91c1c;font-weight:bold';
    container.append(warning);
  }
})();
