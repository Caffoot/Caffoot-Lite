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
  return {mode, version, published};
}
if (process.argv.includes('--self-test')) {
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
  console.log('PASS: published, candidate, stale, missing, historical and argument fixtures.');
} else {
  try {
    const {mode, version, published} = parse(process.argv.slice(2));
    const errors = inspect(file => fs.readFileSync(path.join(root, file), 'utf8'), version, mode, published);
    if (errors.length) { errors.forEach(error => console.error('FAIL: ' + error)); process.exitCode = 1; }
    else console.log('PASS: ' + mode + ' release documentation version statements checked.');
  } catch (error) { console.error('FAIL: ' + error.message); process.exitCode = 1; }
}
