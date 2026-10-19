'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(__dirname+'/caffoot-lite.html','utf8');
const begin=html.indexOf('function phase19BRenderFields(');
const end=html.indexOf('let phase19BFormValues =',begin);
assert(begin>=0&&end>begin,'production dynamic form renderer must exist');
const escapeBegin=html.indexOf('function escapeHtml(');
const escapeEnd=html.indexOf('\n        }',escapeBegin)+10;
assert(escapeBegin>=0&&escapeEnd>escapeBegin);
const hostile='x" autofocus onfocus="alert(1)';
const ctx=vm.createContext({
 phase19BFieldsFor:()=>[hostile],
 phase19BTypeGroups:{server:'server'},
 phase19BServerFunctions:()=>[{key:hostile,label:'Example label'}],
 phase120AvailableServerServices:()=>[{key:hostile,label:'Example label'}],
 phase19BSoftware:()=>[],
 phase19BServerFunctionFields:()=>[hostile],
 phase19BSoftwareFields:()=>[],
 phase19BFlags:new Set(),
 phase19BChoices:{},
 phase19BLabels:{},
 phase19BNumeric:new Set()
});
vm.runInContext(html.slice(escapeBegin,escapeEnd)+'\n'+html.slice(begin,end),ctx);
const result=ctx.phase19BRenderFields('server',{[hostile]:true});
assert(result.includes('data-phase19b-field="x&quot; autofocus onfocus=&quot;alert(1)"'));
assert(!result.includes('data-phase19b-field="x" autofocus'));
const ctx2=vm.createContext({...ctx,phase19BServerFunctionFields:()=>[],phase19BSoftwareFields:()=>[]});
vm.runInContext(html.slice(escapeBegin,escapeEnd)+'\n'+html.slice(begin,end),ctx2);
const input=ctx2.phase19BRenderFields('server',{[hostile]:'hello'});
assert(input.includes('id="phase19b-x&quot; autofocus onfocus=&quot;alert(1)"'));
assert(input.includes('for="phase19b-x&quot; autofocus onfocus=&quot;alert(1)"'));
assert(!input.includes('id="phase19b-x" autofocus'));
console.log('PASS: imported managed field keys remain escaped in checkbox, input, id and label attributes.');
