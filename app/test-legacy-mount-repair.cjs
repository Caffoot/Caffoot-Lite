'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const src = fs.readFileSync(__dirname + '/caffoot-lite.html','utf8');
const start = src.indexOf('function phase16CLegacyMountRepairs(');
const end = src.indexOf('function phase16CCheckBackup(',start);
assert(start>0&&end>start);
const ctx = vm.createContext({phase19BAllowedMounts:type=>['Desktop','Laptop','Tablet'].includes(type)?['Desktop']:type==='Wireless Access Point'?['Tabletop / Shelf Mounted','Ceiling Mounted','Wall Mounted','Pole Mounted','Desktop']:['Desktop','Rack Mounted']});
vm.runInContext(src.slice(start,end),ctx);
const original={devices:[
{id:'1',name:'Old desktop',type:'Desktop',mountType:'Rack Mounted',location:'Racked',rackId:'r1',rackUStart:4,rackUEnd:5,rackUHeight:2,primaryIp:'10.1.1.5',notes:'keep'},
{id:'2',name:'Valid server',type:'Server - Physical',mountType:'Rack Mounted',location:'Racked',rackId:'r1',rackUStart:7,rackUEnd:8,rackUHeight:2}
],racks:[{id:'r1',name:'Test rack'}]};
const copy=JSON.parse(JSON.stringify(original));
const repairs=ctx.phase16CLegacyMountRepairs(copy);
assert.equal(repairs.length,1);
assert.equal(repairs[0].rack,'Test rack');
assert.equal(repairs[0].startU,4);
assert.equal(copy.devices[0].mountType,'Desktop');
assert.equal(copy.devices[0].location,'Unknown');
assert.equal(copy.devices[0].rackId,'');
assert.equal(copy.devices[0].rackUStart,null);
assert.equal(copy.devices[0].primaryIp,'10.1.1.5');
assert.equal(copy.devices[0].notes,'keep');
assert.deepEqual(copy.devices[1],original.devices[1]);
assert.deepEqual(original.devices[0].rackId,'r1');
assert.equal(ctx.phase16CLegacyMountRepairs(copy).length,0);
console.log('PASS: legacy rack mounting corrections preserve inventory and leave valid devices unchanged.');

const apOriginal={devices:[
{id:'ap1',name:'Legacy AP on shelf',type:'Wireless Access Point',mountType:'Desktop',location:'Office',rackId:'',notes:'keep AP'},
{id:'ap2',name:'Ceiling AP',type:'Wireless Access Point',mountType:'Ceiling Mounted',location:'Office',rackId:''},
{id:'ap3',name:'Unresolved rack AP',type:'Wireless Access Point',mountType:'Rack Mounted',location:'Racked',rackId:'r1',rackUStart:3}
],racks:[{id:'r1',name:'Test rack'}]};
const apCopy=JSON.parse(JSON.stringify(apOriginal));
assert.equal(ctx.phase16CLegacyMountRepairs(apCopy).length,0,'AP positions must not be guessed or automatically repaired');
assert.deepEqual(apCopy,apOriginal,'Legacy Desktop and other AP mountings must remain untouched');
const invalid=ctx.phase16CInvalidMounts(apCopy);
assert.equal(invalid.length,1,'Unsupported rack-mounted AP must be detected for explicit review');
assert.equal(invalid[0].id,'ap3');
console.log('PASS: legacy AP Desktop is retained and ambiguous AP mounting is never guessed.');
