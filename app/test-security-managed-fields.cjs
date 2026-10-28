'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(__dirname+'/caffoot-lite.html','utf8');
const begin=html.indexOf('function renderDeviceDetailFields(');
const end=html.indexOf('let deviceDetailFormValues =',begin);
assert(begin>=0&&end>begin,'production dynamic form renderer must exist');
const escapeBegin=html.indexOf('function escapeHtml(');
const escapeEnd=html.indexOf('\n        }',escapeBegin)+10;
assert(escapeBegin>=0&&escapeEnd>escapeBegin);
const hostile='x" autofocus onfocus="alert(1)';
const ctx=vm.createContext({
 getDetailFieldsForDeviceType:()=>[hostile],
 deviceTypeDetailGroups:{server:'server'},
 getConfiguredServerServiceCatalogueEntries:()=>[{key:hostile,label:'Example label'}],
 getAvailableServerServiceCatalogueEntries:()=>[{key:hostile,label:'Example label'}],
 getConfiguredSoftwareCatalogueEntries:()=>[],
 getAvailableSoftwareCatalogueEntries:()=>[],
 getAvailableServerServiceFieldKeys:()=>[hostile],
 getConfiguredSoftwareCatalogueFieldKeys:()=>[],
 booleanDeviceDetailFields:new Set(),
 deviceDetailFieldChoices:{},
 deviceDetailFieldLabels:{},
 numericDeviceDetailFields:new Set()
});
vm.runInContext(html.slice(escapeBegin,escapeEnd)+'\n'+html.slice(begin,end),ctx);
const result=ctx.renderDeviceDetailFields('server',{[hostile]:true});
assert(result.includes('data-device-detail-field="x&quot; autofocus onfocus=&quot;alert(1)"'));
assert(!result.includes('data-device-detail-field="x" autofocus'));
const ctx2=vm.createContext({...ctx,getAvailableServerServiceFieldKeys:()=>[],getConfiguredSoftwareCatalogueFieldKeys:()=>[]});
vm.runInContext(html.slice(escapeBegin,escapeEnd)+'\n'+html.slice(begin,end),ctx2);
const input=ctx2.renderDeviceDetailFields('server',{[hostile]:'hello'});
assert(input.includes('id="device-detail-x&quot; autofocus onfocus=&quot;alert(1)"'));
assert(input.includes('for="device-detail-x&quot; autofocus onfocus=&quot;alert(1)"'));
assert(!input.includes('id="device-detail-x" autofocus'));
console.log('PASS: imported managed field keys remain escaped in checkbox, input, id and label attributes.');
