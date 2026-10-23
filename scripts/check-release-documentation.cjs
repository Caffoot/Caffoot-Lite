'use strict';

// Published mode checks public stable claims. Candidate mode checks candidate metadata only.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const packageVersion = require(path.join(root, 'app/package.json')).version;
const stableFiles = {
  'README.md': [/\*\*Current release:\*\*\s*\[v(\d+\.\d+\.\d+)\]/i],
  'INSTALLATION.md': [/\*\*Current published stable release:\*\*\s*\[v(\d+\.\d+\.\d+)\]/i],
  'SECURITY.md': [/latest published stable release is\s*\*\*\[v(\d+\.\d+\.\d+)\]/i],
  'ROADMAP.md': [/\*\*Current published stable release:\*\*\s*\[v(\d+\.\d+\.\d+)\]/i]
};
function inspect(read, expected, mode, published) {
  const errors = [];
  const specs = mode === 'published'
    ? {...stableFiles, ['RELEASE-NOTES-' + expected + '.md']: [/^# Caffoot Lite v(\d+\.\d+\.\d+)\b/m, /\*\*Status:\*\*\s*Published stable release/i]}
    : {['RELEASE-NOTES-' + expected + '.md']: [/^# Caffoot Lite v(\d+\.\d+\.\d+)\b/m]};
  if (mode === 'candidate' && published) {
    for (const [file, patterns] of Object.entries(stableFiles)) specs[file] = patterns;
  }
  for (const [file, patterns] of Object.entries(specs)) {
    let source;
    try { source = read(file); if (typeof source !== 'string') throw Error('missing content'); }
    catch (_) { errors.push(file + ': missing or unreadable'); continue; }
    for (const pattern of patterns) {
      const match = source.match(pattern);
      if (!match) { errors.push(file + ': required statement not found'); continue; }
      const wanted = mode === 'candidate' && file in stableFiles ? published : expected;
      if (match[1] && match[1] !== wanted) errors.push(file + ': claims v' + match[1] + ', expected v' + wanted);
    }
  }
  return errors;
}
function parse(args) {
  const mode = args.includes('--candidate') ? 'candidate' : 'published';
  if (args.includes('--candidate') && args.includes('--published')) throw Error('Choose one mode');
  const value = flag => { const i = args.indexOf(flag); return i < 0 ? undefined : args[i + 1]; };
  const version = value('--version') || packageVersion;
  const published = value('--published-version');
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw Error('Version must be X.Y.Z');
  if (published && !/^\d+\.\d+\.\d+$/.test(published)) throw Error('Published version must be X.Y.Z');
  if (mode === 'candidate' && version !== packageVersion) throw Error('Candidate version must match app/package.json');
  if (mode === 'published' && version !== packageVersion) throw Error('Published version must match app/package.json');
  if (mode === 'candidate' && !published) throw Error('Candidate mode requires --published-version X.Y.Z');
  if (mode === 'candidate' && published === version) throw Error('Candidate and published versions must differ');
  return {mode, version, published};
}

const auditFiles = [
  'docs/standards/TECHNICAL-DOCUMENTATION-POLICY.md',
  'docs/audits/V1.3.0-DOCUMENTATION-COVERAGE-AUDIT.md',
  'docs/audits/AUDIT-FINDINGS-REMEDIATION-PROGRAMME.md',
  'docs/workflows/TECHNICAL-WORKFLOWS.md',
  'docs/testing/WORKFLOW-VERIFICATION-COVERAGE-REGISTER.md',
  'docs/testing/WF-02-IMPORTED-RACK-TEST-MATRIX.md'
];
function auditCoverage(read) {
  const errors = [];
  const docs = {};
  for (const file of auditFiles) {
    try {
      const content = read(file);
      if (typeof content !== 'string' || !content.trim()) throw Error('empty document');
      docs[file] = content;
    } catch (_) { errors.push(file + ': required document missing or empty'); }
  }
  function checkRows(file, prefix, count, digits) {
    if (!docs[file]) return;
    const rows = docs[file].split(/\r?\n/).filter(line => /^\s*\|/.test(line));
    for (let n = 1; n <= count; n++) {
      const id = prefix + '-' + String(n).padStart(digits, '0');
      const matching = rows.filter(line => new RegExp('^' + id + '(?:\\b|$)').test(line.split('|')[1]?.trim() || ''));
      if (matching.length !== 1)
        errors.push(file + ': expected one current table row for ' + id + ', found ' + matching.length);
    }
  }
  checkRows('docs/audits/AUDIT-FINDINGS-REMEDIATION-PROGRAMME.md', 'M', 31, 3);
  checkRows('docs/testing/WORKFLOW-VERIFICATION-COVERAGE-REGISTER.md', 'WF', 13, 2);
  const rack = docs['docs/testing/WF-02-IMPORTED-RACK-TEST-MATRIX.md'];
  if (rack) {
    for (let n = 1; n <= 18; n++) {
      const id = 'WF02-T' + String(n).padStart(2, '0');
      if (!rack.split(/\r?\n/).some(line => /^\s*\|/.test(line) && line.split('|')[1]?.trim() === id))
        errors.push('docs/testing/WF-02-IMPORTED-RACK-TEST-MATRIX.md: missing scenario ' + id);
    }
  }
  return errors;
}
function auditFixtures() {
  const docs = Object.fromEntries(auditFiles.map(file => [file, '# Test fixture\n']));
  docs['docs/audits/AUDIT-FINDINGS-REMEDIATION-PROGRAMME.md'] =
    Array.from({length: 31}, (_, i) => '| M-' + String(i + 1).padStart(3, '0') + ' | Open |').join('\n');
  docs['docs/testing/WORKFLOW-VERIFICATION-COVERAGE-REGISTER.md'] =
    Array.from({length: 13}, (_, i) => '| WF-' + String(i + 1).padStart(2, '0') + ' | Pending |').join('\n');
  docs['docs/testing/WF-02-IMPORTED-RACK-TEST-MATRIX.md'] =
    Array.from({length: 18}, (_, i) => '| WF02-T' + String(i + 1).padStart(2, '0') + ' | Pending |').join('\n');
  return docs;
}

if (process.argv.includes('--audit-self-test')) {
  const fixtures = auditFixtures();
  const read = file => fixtures[file];
  assert.deepEqual(auditCoverage(read), []);
  const labelled = {...fixtures, 'docs/testing/WORKFLOW-VERIFICATION-COVERAGE-REGISTER.md': fixtures['docs/testing/WORKFLOW-VERIFICATION-COVERAGE-REGISTER.md'].replace('| WF-01 |', '| WF-01 Startup and recovery |')};
  assert.deepEqual(auditCoverage(file => labelled[file]), []);
  assert(auditCoverage(file => file.endsWith('TECHNICAL-DOCUMENTATION-POLICY.md') ? undefined : read(file)).some(x => x.includes('required document')));
  assert(auditCoverage(file => file.includes('REMEDIATION-PROGRAMME.md') ? read(file).replace('| M-031 |', '| M-030 |') : read(file)).some(x => x.includes('M-031')));
  assert(auditCoverage(file => file.includes('WORKFLOW-VERIFICATION-COVERAGE-REGISTER.md') ? read(file).replace('| WF-13 |', '| WF-12 |') : read(file)).some(x => x.includes('WF-13')));
  assert(auditCoverage(file => file.includes('IMPORTED-RACK-TEST-MATRIX.md') ? read(file).replace('| WF02-T18 |', '| WF02-T17 |') : read(file)).some(x => x.includes('WF02-T18')));
  console.log('PASS: audit coverage positive, missing document, finding, workflow and scenario fixtures');
} else if (process.argv.includes('--audit-coverage')) {
  const errors = auditCoverage(file => fs.readFileSync(path.join(root, file), 'utf8'));
  if (errors.length) { errors.forEach(x => console.error('FAIL: ' + x)); process.exitCode = 1; }
  else console.log('PASS: required audit documents, findings, workflows and imported rack scenarios');
} else if (process.argv.includes('--self-test')) {
  const fixtures = {
    'README.md': '**Current release:** [v1.3.0](url)\nHistorical v1.2.1',
    'INSTALLATION.md': '**Current published stable release:** [v1.3.0](url)',
    'SECURITY.md': 'latest published stable release is **[v1.3.0](url)**',
    'ROADMAP.md': '**Current published stable release:** [v1.3.0](url)',
    'RELEASE-NOTES-1.3.0.md': '# Caffoot Lite v1.3.0 — Published\n**Status:** Published stable release',
    'RELEASE-NOTES-1.3.1.md': '# Caffoot Lite v1.3.1 — Candidate\n**Status:** Draft'
  };
  const read = file => fixtures[file];
  assert.deepEqual(inspect(read, '1.3.0', 'published'), []);
  assert.deepEqual(inspect(read, '1.3.1', 'candidate', '1.3.0'), []);
  assert(inspect(file => file === 'INSTALLATION.md' ? '**Current published stable release:** [v1.2.1](url)' : read(file), '1.3.1', 'candidate', '1.3.0').some(x => x.includes('claims v1.2.1')));
  assert(inspect(file => file === 'SECURITY.md' ? undefined : read(file), '1.3.0', 'published').some(x => x.includes('missing')));
  assert(inspect(read, '1.3.1', 'published').length > 0);
  assert.throws(() => parse(['--candidate']), /requires --published-version/);
  assert.throws(() => parse(['--candidate', '--published-version', packageVersion]), /must differ/);
  console.log('PASS: published, candidate, stale, missing, historical and argument fixtures.');
} else {
  try {
    const {mode, version, published} = parse(process.argv.slice(2));
    const errors = inspect(file => fs.readFileSync(path.join(root, file), 'utf8'), version, mode, published);
    if (errors.length) { errors.forEach(error => console.error('FAIL: ' + error)); process.exitCode = 1; }
    else console.log('PASS: ' + mode + ' release documentation version statements checked.');
  } catch (error) { console.error('FAIL: ' + error.message); process.exitCode = 1; }
}
