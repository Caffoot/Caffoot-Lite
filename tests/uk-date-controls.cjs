'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const filename = path.join(__dirname, '..', 'interface', 'uk-date-controls.js');
const source = fs.readFileSync(filename, 'utf8');
const document = {
  documentElement: {
    nodeType: 1,
    matches: () => false,
    querySelectorAll: () => [],
  },
  addEventListener: () => {},
};
const window = {addEventListener: () => {}};
class FakeMutationObserver { observe() {} }
const hook = 'window.caffootUkDates = {toIso,toUk,validIso,sync,validate,focus};';
assert.equal(source.split(hook).length, 2, 'Expected a single production API export');
const instrumented = source.replace(hook, hook + '\nwindow.__dateValidationTest = {applyText,errorFor,syncOne};');
class InputEvent { constructor(type,options) { this.type=type; this.bubbles=!!options?.bubbles; } }
vm.runInNewContext(instrumented, {document, window, MutationObserver: FakeMutationObserver, Event: InputEvent}, {
  filename: 'uk-date-controls.js',
  timeout: 1000,
});
const {toIso, toUk, validIso} = window.caffootUkDates;

const cases = [
  ['15/03/2023', '2023-03-15'],
  ['05/06/2024', '2024-06-05'], // DD/MM, not MM/DD
  ['29/02/2024', '2024-02-29'],
  ['29/02/2000', '2000-02-29'],
  ['31/12/2026', '2026-12-31'],
  ['01/01/0001', '0001-01-01'],
];
for (const [visible, iso] of cases) {
  assert.equal(toIso(visible), iso);
  assert.equal(toUk(iso), visible);
  assert.equal(validIso(iso), true);
}
for (const invalid of [
  '29/02/2023','29/02/1900','31/04/2026','00/12/2026','01/13/2026',
  '1/2/2026','03/15/2023','2023-03-15','31/12/0000','not a date',
]) assert.equal(toIso(invalid), '', invalid);
for (const invalid of [
  '2023-02-29','1900-02-29','2026-04-31','2026-00-12','0000-12-31','not a date',
]) assert.equal(validIso(invalid), false, invalid);
assert.equal(toUk(''), '');
assert.equal(toIso(''), '');
assert.equal(toUk('2026-11-18'), '18/11/2026');
console.log('PASS: UK date display, strict calendar validation and ISO round trips');

const {applyText,syncOne} = window.__dateValidationTest;
function makeRecord(value,required=false,max='') {
  const events=[];
  const native={isConnected:true,value:'2024-02-29',min:'',max,
    dispatchEvent(event) { events.push(event.type); }};
  const text={
    value,required,validity:{customError:false},
    setCustomValidity(message) { this.validity.customError=!!message; this.message=message; },
    setAttribute() {},
  };
  const error={textContent:''};
  return {record:{native,text,button:{disabled:false},error},events};
}
{
  const {record,events}=makeRecord('31/02/2024');
  assert.equal(applyText(record,true),false);
  assert.equal(record.native.value,'');
  assert.equal(record.text.validity.customError,true);
  assert.deepEqual(events,['input']);
}
{
  const {record}=makeRecord('05/06/2024');
  assert.equal(applyText(record,false),true);
  assert.equal(record.native.value,'2024-06-05');
  assert.equal(record.text.validity.customError,false);
}
{
  const {record}=makeRecord('19/11/2026',false,'2026-11-18');
  assert.equal(applyText(record,false),false);
  assert.match(record.text.message,/18\/11\/2026/);
  assert.equal(record.native.value,'');
}
{
  const {record}=makeRecord('',true);
  assert.equal(applyText(record,false),false);
  assert.equal(record.native.value,'');
}
{
  const {record}=makeRecord('15032023');
  assert.equal(applyText(record,false),true);
  assert.equal(record.text.value,'15/03/2023');
  assert.equal(record.native.value,'2023-03-15');
}
console.log('PASS: required, invalid, future and eight-digit date controls preserve ISO');

{
  // A real calendar date beyond max must not disappear when focus moves to Save.
  // The native value is intentionally empty until the user corrects the visible field.
  const {record}=makeRecord('19/11/2026',false,'2026-11-18');
  assert.equal(applyText(record,true),false);
  assert.equal(record.native.value,'');
  syncOne(record,false);
  assert.equal(record.text.value,'19/11/2026');
  assert.equal(record.text.validity.customError,true);
  assert.match(record.error.textContent,/18\/11\/2026/);
}
{
  // Programmatic updates still refresh valid, non-editing controls normally.
  const {record}=makeRecord('05/06/2024');
  record.native.value='2025-02-03';
  syncOne(record,false);
  assert.equal(record.text.value,'03/02/2025');
}
console.log('PASS: out-of-range UK dates persist for correction; valid values resynchronise');

