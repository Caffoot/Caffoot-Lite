'use strict';

// Verify local Markdown links and image paths. External URLs and fragment anchors are
// outside this check. No application files are changed by this script.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const excluded = new Set(['node_modules', '.git', 'dist', 'coverage']);
function markdownFiles(dir, output = []) {
  for (const item of fs.readdirSync(dir, {withFileTypes: true})) {
    if (item.isDirectory() && !excluded.has(item.name)) markdownFiles(path.join(dir, item.name), output);
    else if (item.isFile() && item.name.toLowerCase().endsWith('.md')) output.push(path.join(dir, item.name));
  }
  return output;
}
function checkFile(file, exists = fs.existsSync) {
  const errors = [];
  const source = fs.readFileSync(file, 'utf8');
  const lines = source.split(/\r?\n/);
  let fence = false;
  lines.forEach((line, index) => {
    if (/^\s*(?:```|~~~)/.test(line)) { fence = !fence; return; }
    if (fence) return;
    const pattern = /!?\[[^\]]*\]\(<?([^\s)>]+)>?(?:\s+["'][^"']*["'])?\)/g;
    for (const match of line.matchAll(pattern)) {
      const target = match[1];
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(target)) continue;
      let local;
      try { local = decodeURIComponent(target.split('#')[0].split('?')[0]); }
      catch (_) { errors.push(index + 1 + ': invalid URL encoding: ' + target); continue; }
      if (!local) continue;
      const resolved = path.resolve(path.dirname(file), local);
      if (!exists(resolved)) errors.push(index + 1 + ': missing target: ' + target);
    }
  });
  return errors;
}
if (process.argv.includes('--self-test')) {
  const assert = require('node:assert/strict');
  const os = require('node:os');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'caffoot-links-'));
  try {
    fs.writeFileSync(path.join(tmp, 'ok.md'), '# Hello');
    fs.writeFileSync(path.join(tmp, 'test.md'), '[valid](ok.md)\n[invalid](absent.md)\n[external](https://example.com)\n');
    assert.deepEqual(checkFile(path.join(tmp, 'test.md')), ['2: missing target: absent.md']);
    console.log('PASS: Markdown link checker self-test');
  } finally { fs.rmSync(tmp, {recursive: true, force: true}); }
} else {
  let count = 0;
  const failures = [];
  for (const file of markdownFiles(root)) {
    count++;
    for (const error of checkFile(file)) failures.push(path.relative(root, file) + ':' + error);
  }
  if (failures.length) {
    for (const error of failures) console.error('FAIL: ' + error);
    console.error('FAIL: ' + failures.length + ' missing local targets across ' + count + ' Markdown files');
    process.exitCode = 1;
  } else console.log('PASS: local Markdown targets found across ' + count + ' files (anchors and external URLs not checked)');
}
