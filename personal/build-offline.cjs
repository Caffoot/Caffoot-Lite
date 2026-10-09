'use strict';
// Developer-only build: npm install && npm run build (inside personal/).
// Creates a single HTML file with compiled Tailwind and embedded Font Awesome webfonts.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');
const root = __dirname;
const source = path.join(root, 'caffoot-personal.html');
const destination = path.join(root, 'dist', 'caffoot-personal-offline.html');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'caffoot-css-'));
try {
  const cssInput = path.join(tmp, 'input.css');
  const cssOutput = path.join(tmp, 'output.css');
  fs.writeFileSync(cssInput, '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n');
  const cli = require.resolve('tailwindcss/lib/cli.js');
  const run = spawnSync(process.execPath, [cli, '-i', cssInput, '-o', cssOutput, '--minify', '-c', path.join(root, 'tailwind.config.cjs')], { cwd: root, encoding: 'utf8' });
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
  if (/<(?:script|link)\b[^>]*\b(?:src|href)=["']https?:\/\//i.test(html)) throw Error('Remote runtime resource remains');
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, html);
  console.log('Built ' + destination + ' (' + Buffer.byteLength(html) + ' bytes)');
  console.log('Review the generated HTML in a browser before releasing.');
} finally { fs.rmSync(tmp, { recursive: true, force: true }); }
