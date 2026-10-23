'use strict';

// Check explicit current-release statements only. Historical version references are valid.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const version = require(path.join(root, 'app/package.json')).version;
const current = 'v' + version;
const files = {
  'README.md': [/\*\*Current release:\*\*\s*\[v(\d+\.\d+\.\d+)\]/i],
  'INSTALLATION.md': [/\*\*Current published stable release:\*\*\s*\[v(\d+\.\d+\.\d+)\]/i],
  'SECURITY.md': [/latest published stable release is\s*\*\*\[v(\d+\.\d+\.\d+)\]/i],
  'ROADMAP.md': [/\*\*Current published stable release:\*\*\s*\[v(\d+\.\d+\.\d+)\]/i],
  ['RELEASE-NOTES-' + version + '.md']: [/^# Caffoot Lite v(\d+\.\d+\.\d+)\b/m, /\*\*Status:\*\*\s*Published stable release/i]
};
function inspect(read, expected) {
  const errors = [];
  for (const [file, patterns] of Object.entries(files)) {
    let source;
    try { source = read(file); } catch (_) { errors.push(file + ': missing or unreadable'); continue; }
    for (const pattern of patterns) {
      const match = source.match(pattern);
      if (!match) { errors.push(file + ': required current-release statement not found'); continue; }
      if (match[1] && match[1] !== expected) errors.push(file + ': claims v' + match[1] + ', expected v' + expected);
    }
  }
  return errors;
}
if (process.argv.includes('--self-test')) {
  const fixtures = Object.fromEntries(Object.entries(files).map(([file, patterns]) =>
    [file, patterns.map(pattern => {
      if (file === 'README.md') return '**Current release:** [v' + version + '](url)';
      if (file === 'INSTALLATION.md' || file === 'ROADMAP.md') return '**Current published stable release:** [v' + version + '](url)';
      if (file === 'SECURITY.md') return 'latest published stable release is **[v' + version + '](url)**';
      return '# Caffoot Lite v' + version + ' — Release\n**Status:** Published stable release';
    }).join('\n')]));
  assert.deepEqual(inspect(file => fixtures[file], version), []);
  const changed = {...fixtures, 'INSTALLATION.md': '**Current published stable release:** [v0.0.1](url)'};
  assert(inspect(file => changed[file], version).some(x => x.includes('claims v0.0.1')));
  assert(inspect(file => file === 'SECURITY.md' ? undefined : fixtures[file], version).length > 0);
  console.log('PASS: release documentation checker self-tests (valid, stale, missing).');
} else {
  const errors = inspect(file => fs.readFileSync(path.join(root, file), 'utf8'), version);
  if (errors.length) { for (const error of errors) console.error('FAIL: ' + error); process.exitCode = 1; }
  else console.log('PASS: explicit published-release statements agree with ' + current + '. Historical references were not checked.');
}
