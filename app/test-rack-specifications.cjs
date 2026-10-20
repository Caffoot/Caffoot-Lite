'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, 'caffoot-lite.html'), 'utf8');
const begin = html.indexOf('        const rackTypes = ');
const end = html.indexOf('        function deleteRack(rackId)', begin);
assert(begin > 0 && end > begin, 'Rack specification implementation exists');
const code = html.slice(begin, end);
const state = {racks:[{id:'r1',name:'Old',type:'Free Standing',heightU:27,depth:'600mm',location:'A'}],devices:[{id:'d1',name:'Switch',rackId:'r1',rackUStart:25,rackUEnd:27}],rackAccessories:[]};
const inputs = { 'rack-name':'Renamed', 'rack-location':'B', 'rack-height':'12', 'rack-height-custom':'', 'rack-width':'800', 'rack-depth':'900', 'rack-type':'Floor-standing cabinet' };
const toast=[];let confirms=0, saves=0;
const context=vm.createContext({appState:state,document:{getElementById(id){return {value:inputs[id]};}},showToast:(...args)=>toast.push(args),confirm:()=>{confirms++;return true;},confirms:0,saveState:()=>{saves++;return true;},closeModal:()=>{},renderContent:()=>{},deviceRackReturnPending:false,selectedRackId:'r1'});
vm.runInContext(code,context);
// The styled correction dialog is asynchronous; simulate user approval without browser DOM.
vm.runInContext('phase120ConfirmRackCorrection = async () => { confirms++; return true; }', context);
// The production submit listener is delegated on document: currentTarget is NOT the form.
(async () => {
const submit=async (correction)=>context.handleRackSubmit({preventDefault(){},target:{closest(){return {dataset:{correction:String(correction)}}}},currentTarget:{dataset:{}}},'r1');
await submit(false);
assert.equal(state.racks[0].name,'Renamed');
assert.equal(state.racks[0].location,'B');
assert.equal(state.racks[0].heightU,27,'Normal edit cannot change height');
assert.equal(state.racks[0].depth,'600mm','Normal edit cannot change depth');
assert.equal(context.confirms,0);
await submit(true);
assert.equal(state.racks[0].heightU,27,'Correction cannot shrink past device');
assert.match(toast.at(-1)[0],/cannot be reduced/);
assert.equal(context.confirms,0);
inputs['rack-height']='42';
await submit(true);
assert.equal(state.racks[0].heightU,42);
assert.equal(state.racks[0].widthMm,800);
assert.equal(state.racks[0].depthMm,900);
assert.equal(state.racks[0].depth,'900mm');
assert.equal(context.confirms,1);
assert.equal(saves,2);
// Invalid custom heights and empty dimensions must never overwrite stored specs.
inputs['rack-height']='custom';
inputs['rack-height-custom']='';
await submit(true);
assert.equal(state.racks[0].heightU,42);
assert.equal(saves,2);
inputs['rack-height-custom']='27';
inputs['rack-width']='';
await submit(true);
assert.equal(state.racks[0].heightU,42);
assert.equal(saves,2);
// Accessory occupying the highest U prevents shrinking even without a device there.
inputs['rack-width']='800';
state.devices=[];
state.rackAccessories=[{id:'a1',rackId:'r1',name:'Shelf',startU:40,heightU:2}];
inputs['rack-height']='24';
await submit(true);
assert.equal(state.racks[0].heightU,42);
assert.equal(saves,2);

console.log('PASS: delegated form submission, locked rack editing, 27U preservation, safe correction and millimetre storage.');
})().catch(err => { console.error(err); process.exitCode = 1; });
