import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DeviceReadError, loadDevices, isVirtual, isHypervisor,
  platformFor, versionFor, findHost, hostedGuests, rackFor
} from '../src/integration-data.js';

function makeFetch(responses, paths) {
  return async (path, options) => {
    paths.push(path);
    assert.equal(options.method, 'GET');
    assert.equal(options.credentials, 'same-origin');
    assert.equal(options.cache, 'no-store');
    if (!Object.hasOwn(responses, path)) throw Error('Unexpected request to ' + path);
    const [status, body] = responses[path];
    return new Response(JSON.stringify(body), {
      status, headers: { 'Content-Type': 'application/json' }
    });
  };
}

test('Devices reader never asks for Rack or IPAM data without access', async () => {
  const calls = [];
  const result = await loadDevices(makeFetch({
    '/api/inventory/sections': [200, {sections: {
      Devices: {read: true, edit: false}, IPAM: {read: false, edit: false}, Racks: {read: false, edit: false}
    }}],
    '/api/inventory/devices': [200, {devices: [{
      id:'host', type:'Server - Physical', name:'Physical <&>'
    }]}]
  }, calls));
  assert.deepEqual(calls, ['/api/inventory/sections','/api/inventory/devices']);
  assert.equal(result.devices[0].name,'Physical <&>');
  assert.deepEqual(result.racks,[]);
  assert.equal(result.rackAccess,false);
});

test('Rack details are only fetched when Racks read permission is granted', async () => {
  const calls = [];
  const result = await loadDevices(makeFetch({
    '/api/inventory/sections': [200, {sections: {
      Devices: {read: true}, Racks: {read: true}, IPAM: {read: false}
    }}],
    '/api/inventory/devices': [200, {devices:[{id:'host',rackId:'rack'}]}],
    '/api/inventory/racks': [200, {racks:[{id:'rack',name:'Server Room Rack'}]}]
  }, calls));
  assert.ok(calls.includes('/api/inventory/racks'));
  assert.ok(!calls.includes('/api/inventory/ipam'));
  assert.equal(rackFor(result.devices[0],result.racks).name,'Server Room Rack');
});

test('Devices denied stops before the devices request', async () => {
  const calls = [];
  await assert.rejects(loadDevices(makeFetch({
    '/api/inventory/sections':[200,{sections:{Devices:{read:false},IPAM:{read:true}}}]
  },calls)),err=>err instanceof DeviceReadError && err.status===403);
  assert.deepEqual(calls,['/api/inventory/sections']);
});

test('Unsigned-in and failed responses produce appropriate error states', async () => {
  const unauthCalls=[];
  await assert.rejects(loadDevices(makeFetch({
    '/api/inventory/sections':[401,{error:'unauthorised'}]
  },unauthCalls)),err=>err.status===401);
  const serverCalls=[];
  await assert.rejects(loadDevices(makeFetch({
    '/api/inventory/sections':[200,{sections:{Devices:{read:true}}}],
    '/api/inventory/devices':[503,{error:'unavailable'}]
  },serverCalls)),err=>err.status===503);
});

test('Real saved fields are used for physical hosts and virtual allocations', () => {
  const host={id:'one',type:'Server - Physical',typeDetails:{
    serverService_Hypervisor:true,hypervisorProduct:'Proxmox VE',hypervisorVersion:'8.2'
  }};
  const vm={id:'two',type:'Server - Virtual',virtualHostId:'one',vmVcpu:4,
    vmRamGb:8,vmDiskGb:100,vmNicCount:2,typeDetails:{softwarePlatform:'Ubuntu Server'}};
  assert.equal(isVirtual(host),false);
  assert.equal(isVirtual(vm),true);
  assert.equal(isHypervisor(host,[host,vm]),true);
  assert.equal(platformFor(host),'Proxmox VE');
  assert.equal(versionFor(host),'8.2');
  assert.equal(platformFor(vm),'Ubuntu Server');
  assert.equal(findHost(vm,[host,vm]),host);
  assert.deepEqual(hostedGuests(host,[host,vm]),[vm]);
  assert.equal(isVirtual({type:'Router',isVirtual:true}),true);
});
