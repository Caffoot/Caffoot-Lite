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
const template=[
 container('site','10.128.96.0/20'),
 container('block','10.128.96.0/21','site'),
 {id:'future',cidr:'10.128.104.0/21',kind:'reserved',parentId:'site'},
 {id:'loop',cidr:'10.128.96.0/32',kind:'loopback',parentId:'block'},
 network('mgmt','10.128.96.128/26','block'),
 network('fortilink','10.128.96.192/26','block'),
 network('wlan','10.128.97.0/26','block'),
 network('servers','10.128.98.0/24','block'),
 network('voice','10.128.99.0/25','block'),
 network('office','10.128.100.0/23','block'),
 network('guest','10.128.102.0/24','block'),
 network('things','10.128.103.0/24','block')
];
assert.deepEqual(validateHierarchy(template),[]);
assert.deepEqual(validateHierarchy([network('twenty','172.16.16.0/20')]),[]);
assert.deepEqual(validateHierarchy([{id:'host',cidr:'10.0.0.1/32',kind:'loopback'}]),[]);
assert(validateHierarchy([...template,network('collision','10.128.98.128/25','block')]).length>0);
assert(validateHierarchy([null]).length>0);
assert(validateHierarchy([42]).length>0);
assert(validateHierarchy([{id:'bad-kind',cidr:'10.0.0.0/24',kind:'nonsense'}]).length>0);
assert(validateHierarchy([network('a','10.0.0.0/24',123)]).length>0);
assert(validateHierarchy([network('same','10.0.0.0/24'),network('same','10.1.0.0/24')]).length>0);
const bad=[
 [container('a','10.0.0.0/8'),network('b','10.10.0.0/16','a'),network('c','10.10.0.0/20','a')],
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
