'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(__dirname + '/caffoot-lite.html', 'utf8');
const start = html.indexOf('function phase13COpenAccessory(');
const end = html.indexOf('function phase13CDeleteAccessory(', start);
assert(start >= 0 && end > start, 'Accessory modal source missing');
const modalEnd = html.indexOf("modal.classList.remove('hidden');", start);
assert(modalEnd > start, 'Accessory modal markup boundary missing');
const code = html.slice(start, modalEnd) + '\n}';
const modalContent = {classList:{remove(){}},innerHTML:''};
const modal = {classList:{remove(){},add(){}},querySelector(){return {addEventListener(){}}}};
const hostile = '\"><img src=x onerror=alert(1)>';
const context = vm.createContext({
  appState:{racks:[{id:'rack1',name:'Example rack',heightU:hostile}],rackAccessories:[{id:'acc1',rackId:'rack1',startU:hostile,heightU:hostile,type:'blank',name:hostile}]},
  phase13CSelectedAccessory:'blank',activeRackFace:'front',
  phase13CAccessoryTypes:{blank:{label:'Blank panel'}},
  document:{getElementById(id){return id==='modal-content'?modalContent:modal;}},
  escapeHtml(value){return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
});
vm.runInContext(code, context);
context.phase13COpenAccessory('rack1',1,'acc1');
assert(!modalContent.innerHTML.includes('<img'), 'Hostile imported numeric data reached executable markup');
assert.match(modalContent.innerHTML, /name="startU"[^>]*<\/select>/);
assert.match(modalContent.innerHTML, /name="heightU"[^>]*value="1"/);
assert.match(modalContent.innerHTML, /name="startU"[^>]*required/);
assert(modalContent.innerHTML.includes('&lt;img'), 'Description should remain visible as escaped text');
console.log('PASS: malformed imported rack placement numbers cannot inject accessory modal HTML.');
