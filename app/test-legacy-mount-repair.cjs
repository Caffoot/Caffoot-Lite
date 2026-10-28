'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const src = fs.readFileSync(__dirname + '/caffoot-lite.html','utf8');
const start = src.indexOf('function planLegacyComputerMountingCorrections(');
const end = src.indexOf('function validateAndNormaliseBackupForImport(',start);
assert(start>0&&end>start);
const ctx = vm.createContext({getRecognisedDeviceMountTypes:type=>['Desktop','Laptop','Tablet'].includes(type)?['Desktop']:type==='Wireless Access Point'?['Tabletop / Shelf Mounted','Ceiling Mounted','Wall Mounted','Pole Mounted','Desktop']:['Desktop','Rack Mounted']});
vm.runInContext(src.slice(start,end),ctx);
const original={devices:[
{id:'1',name:'Old desktop',type:'Desktop',mountType:'Rack Mounted',location:'Racked',rackId:'r1',rackUStart:4,rackUEnd:5,rackUHeight:2,primaryIp:'10.1.1.5',notes:'keep'},
{id:'2',name:'Valid server',type:'Server - Physical',mountType:'Rack Mounted',location:'Racked',rackId:'r1',rackUStart:7,rackUEnd:8,rackUHeight:2}
],racks:[{id:'r1',name:'Test rack'}]};
const copy=JSON.parse(JSON.stringify(original));
const repairs=ctx.planLegacyComputerMountingCorrections(copy);
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
assert.equal(ctx.planLegacyComputerMountingCorrections(copy).length,0);
console.log('PASS: legacy rack mounting corrections preserve inventory and leave valid devices unchanged.');

const legacyLocation={devices:[
{id:'loc1',name:'Legacy desktop location',type:'Desktop',mountType:'Desktop',location:'Racked',rackId:'',rackUStart:null,rackUEnd:null,rackUHeight:null,notes:'keep location note'},
{id:'loc2',name:'Legacy laptop location',type:'Laptop',mountType:'Desktop',location:'Racked',rackId:'',rackUStart:null,rackUEnd:null,rackUHeight:null},
{id:'loc3',name:'Orphaned tablet rack mount',type:'Tablet',mountType:'Rack Mounted',location:'Racked',rackId:'',rackUStart:null,rackUEnd:null,rackUHeight:null},
{id:'loc4',name:'Normal desktop',type:'Desktop',mountType:'Desktop',location:'Office',rackId:''}
],racks:[]};
const locationCopy=JSON.parse(JSON.stringify(legacyLocation));
const locationRepairs=ctx.planLegacyComputerMountingCorrections(locationCopy);
assert.equal(locationRepairs.length,3,'Legacy Racked location and orphaned mounts must be reviewed');
assert.equal(locationRepairs[0].proposedMountType,'Desktop');
assert.equal(locationCopy.devices[0].location,'Unknown');
assert.equal(locationCopy.devices[0].notes,'keep location note');
assert.equal(locationCopy.devices[1].location,'Unknown');
assert.equal(locationCopy.devices[2].mountType,'Desktop');
assert.equal(locationCopy.devices[2].rackId,'');
assert.deepEqual(locationCopy.devices[3],legacyLocation.devices[3]);
assert.equal(ctx.planLegacyComputerMountingCorrections(locationCopy).length,0,'Corrections must be idempotent');
console.log('PASS: legacy Racked locations and orphaned computer mounts receive explicit corrections.');


const apOriginal={devices:[
{id:'ap1',name:'Legacy AP on shelf',type:'Wireless Access Point',mountType:'Desktop',location:'Office',rackId:'',notes:'keep AP'},
{id:'ap2',name:'Ceiling AP',type:'Wireless Access Point',mountType:'Ceiling Mounted',location:'Office',rackId:''},
{id:'ap3',name:'Unresolved rack AP',type:'Wireless Access Point',mountType:'Rack Mounted',location:'Racked',rackId:'r1',rackUStart:3}
],racks:[{id:'r1',name:'Test rack'}]};
const apCopy=JSON.parse(JSON.stringify(apOriginal));
assert.equal(ctx.planLegacyComputerMountingCorrections(apCopy).length,0,'AP positions must not be guessed or automatically repaired');
assert.deepEqual(apCopy,apOriginal,'Legacy Desktop and other AP mountings must remain untouched');
const invalid=ctx.findInvalidDeviceMounts(apCopy);
assert.equal(invalid.length,1,'Unsupported rack-mounted AP must be detected for explicit review');
assert.equal(invalid[0].id,'ap3');
console.log('PASS: legacy AP Desktop is retained and ambiguous AP mounting is never guessed.');
