'use strict';
// Developer-only build: npm install && npm run build (inside app/).
// Creates a single HTML file with compiled Tailwind and embedded Font Awesome webfonts.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');
const root = __dirname;
const source = path.join(root, 'caffoot-lite.html');
const destination = path.join(root, 'dist', 'Caffoot-Lite.html');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'caffoot-css-'));
try {
  const cssInput = path.join(tmp, 'input.css');
  const cssOutput = path.join(tmp, 'output.css');
  fs.writeFileSync(cssInput, [
    '@import "' + path.join(root, 'node_modules', 'tailwindcss', 'index.css').replace(/\\/g, '/') + '" source(none);',
    '@source "' + source.replace(/\\/g, '/') + '";',
    '@custom-variant dark (&:where(.dark, .dark *));',
    '@theme { --color-brand-50: #eef2ff; --color-brand-100: #e0e7ff; --color-brand-500: #6366f1; --color-brand-600: #4f46e5; --color-brand-700: #4338ca; }',
    '@source inline("{hover:,dark:,dark:hover:}{bg,text,border}-{red,green,yellow,blue,gray,slate,indigo,amber,emerald}-{50,100,200,300,400,500,600,700,800,900}");',
    '@source inline("{sm:,md:,lg:}{hidden,block,flex,grid,inline-flex}");',
  ].join('\n') + '\n');
  const cli = path.join(root, 'node_modules', '@tailwindcss', 'cli', 'dist', 'index.mjs');
  const run = spawnSync(process.execPath, [cli, '-i', cssInput, '-o', cssOutput, '--minify'], { cwd: root, encoding: 'utf8' });
  if (run.status !== 0) throw Error('Tailwind compilation failed: ' + (run.stderr || run.stdout));
  let html = fs.readFileSync(source, 'utf8');
  const cdn = '<script src="https://cdn.tailwindcss.com"></script>';
  const config = /<script>\s*tailwind\.config\s*=\s*\{[\s\S]*?\n\s*<\/script>/;
  if (!html.includes(cdn) || !config.test(html)) throw Error('Unexpected source layout: Tailwind CDN/config not found');
  html = html.replace(cdn, '<style id="caffoot-tailwind">\n' + fs.readFileSync(cssOutput, 'utf8') + '\n</style>');
  html = html.replace(config, '');
  const fontCssPath = require.resolve('@fortawesome/fontawesome-free/css/all.min.css');
  const fontRoot = path.resolve(path.dirname(fontCssPath), '..', 'webfonts');
  let fontCss = fs.readFileSync(fontCssPath, 'utf8');
  fontCss = fontCss.replace(/url\((?:\.\.\/webfonts\/)([^)]+)\)/g, (_, filename) => {
    const clean = filename.replace(/["']/g, '').split('?')[0];
    if (!/^[a-z0-9.-]+\.(woff2|ttf)$/i.test(clean)) throw Error('Unexpected font filename: ' + clean);
    const bytes = fs.readFileSync(path.join(fontRoot, clean));
    return 'url(data:font/' + (clean.endsWith('.woff2') ? 'woff2' : 'ttf') + ';base64,' + bytes.toString('base64') + ')';
  });
  const fontLink = /<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.4\.0\/css\/all\.min\.css">/;
  if (!fontLink.test(html)) throw Error('Unexpected source layout: Font Awesome CDN link not found');
  html = html.replace(fontLink, '<style id="caffoot-icons">\n' + fontCss + '\n</style>');
  // Embed official branding assets so file:// releases remain truly standalone.
  const brandAssets = [
    ['../assets/caffoot-icon-1024.png', 'image/png'],
    ['../assets/apple-touch-icon.png', 'image/png'],
    ['../assets/favicon.ico', 'image/x-icon'],
  ];
  for (const [relativeUrl, mime] of brandAssets) {
    if (!html.includes(relativeUrl)) throw Error('Expected brand asset reference missing: ' + relativeUrl);
    const bytes = fs.readFileSync(path.resolve(root, relativeUrl));
    html = html.replaceAll(relativeUrl, 'data:' + mime + ';base64,' + bytes.toString('base64'));
  }
  if (html.includes('../assets/')) throw Error('External brand asset reference remains');
  if (/<(?:script|link)\b[^>]*\b(?:src|href)=["']https?:\/\//i.test(html)) throw Error('Remote runtime resource remains');
  // Complete runtime notices travel with the standalone HTML as well as the ZIP.
  const noticePaths = ['LICENSE', 'THIRD-PARTY-NOTICES.md', 'licenses/FONT-AWESOME-6.4.0.txt', 'licenses/TAILWIND-CSS-3.4.17.txt'];
  const escape = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const notices = noticePaths.map(name => name + '\n\n' + fs.readFileSync(path.resolve(root, '..', name), 'utf8')).join('\n\n--------------------\n\n');
  const template = /<template id="caffoot-license-notices">[\s\S]*?<\/template>/;
  if (!template.test(html)) throw Error('Licence notice template missing');
  html = html.replace(template, () => '<template id="caffoot-license-notices">' + escape(notices) + '</template>');
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, html);
  console.log('Built ' + destination + ' (' + Buffer.byteLength(html) + ' bytes)');
  console.log('Review the generated HTML in a browser before releasing.');
} finally { fs.rmSync(tmp, { recursive: true, force: true }); }

