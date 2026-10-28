'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, 'caffoot-lite.html'), 'utf8');
const from = html.indexOf('function getDevicesAndIpAllocationsInSubnet(');
const to = html.indexOf('function deleteVlan(', from);
assert(from !== -1 && to > from, 'Subnet deletion handlers must exist');
const source = html.slice(from, to);
function scenario({reserved=false,device=false,save=true}={}) {
    const state = {
        subnets:[{id:'block',kind:'container',name:'Customer Block',cidr:'10.0.0.0/16'},
                 {id:'net',kind:'network',parentId:'block',name:'Servers',cidr:'10.0.1.0/24',vlan:10}],
        vlans:[{id:'vlan',parentId:'block',vlanId:10,name:'Servers'}],
        devices:device?[{id:'dev',name:'Server',primaryIp:'10.0.1.20'}]:[],
        ipAllocations:reserved?{'10.0.1.55':{status:'Reserved'}}:
            device?{'10.0.1.20':{status:'Assigned',deviceId:'dev'}}:{},
        racks:[]
    };
    const original=JSON.stringify(state);
    const notices=[];
    let modal='';
    const ctx=vm.createContext({
        appState:state, selectedSubnetId:'net', 
        document:{querySelector:()=>({dataset:{id:'net'}})},
        isUsableHostAddressInSubnet:(ip,cidr)=>ip.startsWith(cidr.split('/')[0].replace(/\.0$/,'' )+'.'),
        ipBelongsToSubnet:(ip,cidr)=>ip.startsWith(cidr.split('/')[0].replace(/\.0$/,'' )+'.'),
        escapeHtml:String,openModal:html=>{modal=html;},closeModal:()=>{},
        showToast:(message)=>notices.push(message),
        saveState:()=>save,renderContent:()=>{},
        setDevicePrimaryIp:(d,ip)=>{delete ctx.appState.ipAllocations[d.primaryIp];d.primaryIp=ip;}
    });
    vm.runInContext(source,ctx);
    return {ctx,original,notices,get modal(){return modal;}};
}
let t=scenario({reserved:true});
t.ctx.deleteSubnet('net');
assert.match(t.modal,/Subnet Deletion Blocked/);
assert.equal(JSON.stringify(t.ctx.appState),t.original,'Protected reservation must not change inventory');

t=scenario({device:true});
t.ctx.deleteSubnet('net');
assert.match(t.modal,/Move Devices & Delete Subnet/);
t.ctx.appState.ipAllocations['10.0.1.55']={status:'Reserved'};
const changed=JSON.stringify(t.ctx.appState);
t.ctx.confirmDeleteSubnet('net');
assert.equal(JSON.stringify(t.ctx.appState),changed,'Stale confirmation must not delete inventory');
assert(t.notices.some(x=>/changed after preview/.test(x)));

t=scenario({device:true,save:false});
t.ctx.deleteSubnet('net');
t.ctx.confirmDeleteSubnet('net');
assert.equal(JSON.stringify(t.ctx.appState),t.original,'Failed save must restore all inventory');
assert.equal(t.ctx.selectedSubnetId,'net','Failed save must restore selected subnet');

t=scenario({device:true,save:true});
t.ctx.deleteSubnet('net');
t.ctx.confirmDeleteSubnet('net');
assert(!t.ctx.appState.subnets.some(s=>s.id==='net'));
assert(!t.ctx.appState.vlans.some(v=>v.id==='vlan'));
assert.equal(t.ctx.appState.devices[0].primaryIp,'');
assert.equal(t.ctx.appState.devices[0].previousPrimaryIp,'10.0.1.20');
console.log('PASS: protected IPs, stale deletion preview, failed-save rollback and device detachment.');
