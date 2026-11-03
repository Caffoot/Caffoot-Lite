import test from 'node:test';
import assert from 'node:assert/strict';
import {summariseSubnet, summariseRack, summariseDashboard, dashboardCsv} from '../src/dashboard-data.js';

const host={id:'h',name:'=SUM(1,1)',status:'Active',type:'Physical Server',
  primaryIp:'10.12.0.10',rackId:'r1',face:'front',rackUStart:18,rackUEnd:19};
const vm={id:'v',name:'App VM',type:'Virtual Server',status:'Active',primaryIp:'10.12.0.11'};
const rack={id:'r1',name:'Rack A',heightU:42};
const subnet={name:'Internal',cidr:'10.12.0.0/24',gateway:'10.12.0.1'};
const allocation={'10.12.0.10':{status:'Assigned'},'10.12.0.1':{status:'Reserved'}};

test('Subnet numbers follow the published gateway and allocation rules',()=>{
  const r=summariseSubnet(subnet,allocation,[host,vm]);
  assert.equal(r.capacity,254);
  assert.equal(r.assigned,2);
  assert.equal(r.reserved,1);
  assert.equal(r.available,251);
  assert.equal(r.utilisation,1);
  assert.equal(summariseSubnet({name:'block',cidr:'10.1.0.0/16'}).supported,false);
  assert.equal(summariseSubnet({cidr:'10.12.0.1/24'}).supported,false,
    'Subnets must use aligned CIDRs');
});

test('Rack space is calculated separately for front and rear',()=>{
  const r=summariseRack(rack,[host],[{rackId:'r1',face:'rear',heightU:3,type:'shelf'}]);
  assert.equal(r.front,2);
  assert.equal(r.rear,3);
  assert.equal(r.percent,7);
  assert.equal(summariseRack(rack,[],[],false).front,null);
});

test('Only authorised areas enter Dashboard summaries or CSV exports',()=>{
  const state={sections:{Devices:true,IPAM:false,Racks:false},
    devices:[host,vm],subnets:[subnet],racks:[rack],ipAllocations:allocation};
  const result=summariseDashboard(state,[{reason:'Device created'}]);
  assert.equal(result.deviceCount,2);
  assert.equal(result.activeDevices,2);
  assert.equal(result.ipRows.length,0);
  assert.equal(result.rackRows.length,0);
  assert.equal(result.events.length,1);
  assert.throws(()=>dashboardCsv('subnets',result),/not available/);
  assert.throws(()=>dashboardCsv('racks',result),/not available/);
  const csv=dashboardCsv('devices',result);
  assert.ok(csv.includes("'=SUM(1,1)"),'Cells starting with formulas must be neutralised');
  assert.ok(csv.includes('"Hostname","Primary IP"'));
  assert.ok(!csv.includes('Rack A'),'Rack names are hidden without Rack access');
});

test('Combined authorised sections produce the existing report columns',()=>{
  const state={sections:{Devices:true,IPAM:true,Racks:true},
    devices:[host,vm],subnets:[subnet],racks:[rack],ipAllocations:allocation};
  const result=summariseDashboard(state);
  assert.equal(result.rackRows[0].front,2);
  assert.equal(result.ipRows[0].assigned,2);
  assert.equal(result.usableCapacity,254);
  assert.equal(result.totalAvailable,251);
  assert.equal(result.ipUtilisation,1);
  assert.ok(dashboardCsv('devices',result).includes('Rack A'));
  assert.ok(dashboardCsv('subnets',result).includes('"Capacity"'));
  assert.ok(dashboardCsv('racks',result).includes('"Maximum face occupancy %"'));
});

test('A restricted Dashboard never treats absent data as zero authorised records',()=>{
  const data=summariseDashboard({sections:{Devices:false,IPAM:true,Racks:false},
    subnets:[subnet],devices:[host],racks:[rack]});
  assert.equal(data.access.Devices,false);
  assert.equal(data.access.Racks,false);
  assert.equal(data.devices.length,0);
  assert.equal(data.ipRows.length,1);
  assert.throws(()=>dashboardCsv('devices',data));
  assert.equal(data.warnings.some(item=>item.kind==='Devices'),false);
});

test('Related-record warnings require access to both relevant sections',()=>{
  const faulty={...host,primaryIp:'10.12.0.12',rackId:'missing-rack'};
  const restricted=summariseDashboard({sections:{Devices:true,IPAM:false,Racks:false},
    devices:[faulty]});
  assert.equal(restricted.warnings.length,0);
  const complete=summariseDashboard({sections:{Devices:true,IPAM:true,Racks:true},
    devices:[faulty],racks:[rack],subnets:[subnet],ipAllocations:allocation});
  assert.ok(complete.warnings.some(item=>/not linked correctly in IPAM/.test(item.text)));
  assert.ok(complete.warnings.some(item=>/missing rack/.test(item.text)));
  assert.equal(complete.healthIssues.length,1);
});

test('IPAM orphan warnings match the published Dashboard without exposing restricted Devices',()=>{
  const orphan={'10.12.0.44':{status:'Assigned',deviceId:'missing'}};
  const full=summariseDashboard({sections:{Devices:true,IPAM:true,Racks:false},
    devices:[host],subnets:[subnet],ipAllocations:orphan});
  assert.ok(full.warnings.some(warning=>warning.kind==='IPAM' &&
    /references a missing device/.test(warning.text)));
  const restricted=summariseDashboard({sections:{Devices:false,IPAM:true,Racks:false},
    subnets:[subnet],ipAllocations:orphan});
  assert.ok(!restricted.warnings.some(warning=>/references a missing device/.test(warning.text)));
});
