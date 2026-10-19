'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname,'caffoot-lite.html'),'utf8');
function section(start,end) {
  const a=html.indexOf(start),b=html.indexOf(end,a);
  assert(a>=0 && b>a,'Missing production source boundary: '+start);
  return html.slice(a,b);
}
const escapeSource=section('function escapeHtml(value)','function inlineJsArg(value)');
const modalSource=section('function phase13COpenAccessory(','function phase13CDeleteAccessory(');
const payloads=['"><img src=x onerror=alert(1)>','</option><svg onload=alert(1)>',"' autofocus onfocus='alert(1)"];
for(const hostile of payloads) {
  const content={innerHTML:'',classList:{remove(){}}};
  const formNode={addEventListener(){}};
  const modal={classList:{remove(){},add(){}},querySelector(){return formNode;}};
  const ctx=vm.createContext({
    appState:{racks:[{id:'rack1',name:hostile,heightU:42}],rackAccessories:[{id:'acc1',rackId:'rack1',name:hostile,type:'blank',face:'front',startU:1,heightU:1}]},
    phase13CSelectedAccessory:'blank',activeRackFace:'front',
    phase13CAccessoryTypes:{blank:{label:'Blank panel'}},
    document:{getElementById(id){return id==='modal-content'?content:modal;}}
  });
  vm.runInContext(escapeSource+'\n'+modalSource,ctx);
  ctx.phase13COpenAccessory('rack1',1,'acc1');
  assert(content.innerHTML.includes(ctx.escapeHtml(hostile)),'Escaped imported text not displayed');
  assert(!content.innerHTML.includes(hostile),'Raw hostile imported value reached modal HTML');
  assert(!/<(?:img|svg|script)\b/i.test(content.innerHTML),'Injected element reached modal markup');
  assert(content.innerHTML.includes('value="'+ctx.escapeHtml(hostile)+'"'),'Description must be escaped inside input value');
}
console.log('PASS: accessory modal escapes hostile imported rack names and descriptions.');
