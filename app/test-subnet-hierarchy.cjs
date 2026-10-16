'use strict';
const assert=require('node:assert/strict');
const {parseCidr,validateHierarchy}=require('./subnet-hierarchy.cjs');
const container=(id,cidr,parentId)=>({id,cidr,kind:'container',parentId});
const network=(id,cidr,parentId)=>({id,cidr,kind:'network',parentId});
const good=[container('company','10.0.0.0/8'),container('london','10.10.0.0/16','company'),network('servers','10.10.10.0/24','london'),network('desktops','10.10.20.0/24','london')];
assert.deepEqual(validateHierarchy(good),[]);
assert.deepEqual(validateHierarchy([network('legacy','192.168.1.0/24')]),[]);
assert.equal(parseCidr('10.10.10.75/26').canonical,'10.10.10.64/26');
assert.equal(parseCidr('10.0.0.0/8').aligned,true);
assert.equal(parseCidr('10.0.0.0/8',{minPrefix:23,maxPrefix:30}),null);
const bad=[
 [container('a','10.0.0.0/8'),network('b','10.10.0.0/16','a')],
 [container('a','10.0.0.0/8'),network('b','10.10.0.0/24','missing')],
 [container('a','10.0.0.0/8'),network('b','11.0.0.0/24','a')],
 [container('a','10.0.0.0/8'),container('b','10.0.0.0/8','a')],
 [container('a','10.0.0.0/8','b'),container('b','10.1.0.0/16','a')],
 [network('a','10.1.0.0/24'),network('b','10.1.0.0/25')],
 [network('a','10.1.0.0/24'),network('a','10.2.0.0/24')],
 [network('a','10.10.10.75/24')],
 [network('a','10.1.0.0/24'),network('b','10.1.0.0/24','a')]
];
for(const [i,items] of bad.entries()) assert(validateHierarchy(items).length>0,'invalid case '+i+' should fail');
console.log('PASS: hierarchy CIDR, nesting, boundaries, cycles, overlap, and legacy defaults.');
