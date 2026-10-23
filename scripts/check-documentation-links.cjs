'use strict';

// Verify local Markdown links, image paths and Markdown heading anchors.
// External URLs and non-Markdown fragment anchors are outside this check. No application files are changed by this script.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const excluded = new Set(['node_modules', '.git', 'dist', 'coverage']);
function anchors(markdown) {
  const found = new Set();
  const counts = new Map();
  let fenced = false;
  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*(?:```|~~~)/.test(line)) { fenced = !fenced; continue; }
    if (fenced) continue;
    const heading = line.match(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/);
    if (!heading) continue;
    const base = heading[1].replace(/<[^>]*>/g, '').replace(/!?\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1').replace(/[\\*_~`]/g, '').toLowerCase().replace(/[^\p{L}\p{N}\-_ ]/gu, '').replace(/ /g, '-');
    const n = counts.get(base) || 0;
    counts.set(base, n + 1);
    found.add(base + (n ? '-' + n : ''));
  }
  return found;
}
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
      if (!exists(resolved)) { errors.push(index + 1 + ': missing target: ' + target); continue; }
      const fragment = target.includes('#') ? target.slice(target.indexOf('#') + 1) : '';
      if (fragment && resolved.toLowerCase().endsWith('.md')) {
        let anchor;
        try { anchor = decodeURIComponent(fragment); }
        catch (_) { errors.push(index + 1 + ': invalid heading encoding: ' + target); continue; }
        if (!anchors(fs.readFileSync(resolved, 'utf8')).has(anchor)) errors.push(index + 1 + ': missing heading: ' + target);
      }
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
    fs.writeFileSync(path.join(tmp, 'ok.md'), '# Hello World\n## Repeat\n## Repeat\n');
    fs.writeFileSync(path.join(tmp, 'test.md'), '[good](ok.md#hello-world)\n[duplicate](ok.md#repeat-1)\n[bad](ok.md#absent)\n');
    assert.deepEqual(checkFile(path.join(tmp, 'test.md')), ['3: missing heading: ok.md#absent']);
    assert(anchors('# One\n# One').has('one-1'));
    console.log('PASS: Markdown link and heading checker self-tests');
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
  } else console.log('PASS: local Markdown file targets and heading anchors found across ' + count + ' files (external URLs not checked)');
}
