'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const htmlPath = path.join(__dirname, 'dist', 'Caffoot-Lite.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const remote = [...html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)\s*=\s*["']https?:\/\/[^"']+["']/gi)];
assert.equal(remote.length, 0, 'Built file still has remote script/stylesheet references');
assert.doesNotMatch(html, /tailwind\.config\s*=/, 'Tailwind CDN configuration remains');
assert.match(html, /<style id="caffoot-tailwind">[\s\S]+?<\/style>/, 'Compiled Tailwind missing');
assert.match(html, /<style id="caffoot-icons">[\s\S]+?<\/style>/, 'Embedded Font Awesome missing');
assert.match(html, /data:font\/woff2;base64,/, 'Embedded icon fonts missing');
assert.match(html, /caffoot_state/, 'New Caffoot storage key missing');
assert.match(html, /<title>Caffoot Lite/, 'Lite branding missing');
assert.ok(html.includes('alt="Caffoot hedgehog mascot"') && html.includes('src="data:image/png;base64,'), 'Embedded sidebar mascot missing');
assert.ok(html.includes('<link rel="icon" href="data:image/x-icon;base64,'), 'Embedded favicon missing');
assert.ok(html.includes('<link rel="apple-touch-icon" href="data:image/png;base64,'), 'Embedded Apple touch icon missing');
assert.ok(!html.includes('../assets/'), 'Release still depends on external brand assets');

assert.doesNotMatch(html, /<(?:img|audio|video|source|iframe)\b[^>]*\b(?:src|poster)\s*=\s*["']https?:\/\//i, 'Built file has a remote media dependency');
assert.doesNotMatch(html, /@import\s+(?:url\()?\s*["']?https?:\/\//i, 'Built CSS imports a remote stylesheet');
assert.doesNotMatch(html, /url\(\s*["']?https?:\/\//i, 'Built CSS contains remote URL resources');
assert.doesNotMatch(html, /<(?:script|link|img|source|iframe)\b[^>]*\b(?:src|href)\s*=\s*["']\.\.\//i, 'Built HTML refers to a parent-directory resource');

assert.match(html, /switchTab\('dashboard'\)/, 'Dashboard startup missing');
assert.match(html, /exportData\(\)/, 'Export function reference missing');
assert.match(html, /<template id="caffoot-license-notices">[\s\S]*?SIL OPEN FONT LICENSE[\s\S]*?<\/template>/, 'Complete embedded licence notices missing');
console.log('PASS: standalone HTML structure and local assets verified.');
console.log('NOTE: This does not replace browser testing, especially offline file:// operation and import/export.');

