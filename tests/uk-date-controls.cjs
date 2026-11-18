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
vm.runInNewContext(source, {document, window, MutationObserver: FakeMutationObserver}, {
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
