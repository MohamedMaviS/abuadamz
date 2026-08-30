const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const errors = [];
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else files.push(path.relative(DIST, full).replace(/\\/g, '/'));
  }
}

if (!fs.existsSync(DIST)) errors.push('dist/ does not exist');
else walk(DIST);

const forbidden = [
  /(^|\/)package(?:-lock)?\.json$/,
  /(^|\/)vercel\.json$/,
  /(^|\/)tools\//,
  /\.jsx$/,
  /(^|\/)api\/live\.js$/,
  /(^|\/)\.claude\//,
  /(^|\/)\.git/,
];
for (const file of files) {
  if (forbidden.some((rule) => rule.test(file))) errors.push(`private source leaked into dist: ${file}`);
}

for (const required of ['index.html', '404.html', '_headers', 'robots.txt', 'sitemap.xml']) {
  if (!files.includes(required)) errors.push(`missing required deploy file: ${required}`);
}

if (files.includes('index.html')) {
  const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
  if (html.includes('unpkg.com')) errors.push('production HTML still depends on unpkg');
  const refs = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)]
    .map((match) => match[1])
    .filter((ref) => !/^(?:https?:|data:|mailto:|tel:)/.test(ref));
  for (const ref of refs) {
    const relative = ref.replace(/^\//, '').split('?')[0];
    if (!fs.existsSync(path.join(DIST, relative))) errors.push(`broken local reference in index.html: ${ref}`);
  }
}

if (files.includes('_headers')) {
  const headers = fs.readFileSync(path.join(DIST, '_headers'), 'utf8');
  if (headers.includes('unsafe-eval')) errors.push('CSP still allows unsafe-eval');
  if (headers.includes('unpkg.com')) errors.push('CSP still allows the retired unpkg runtime');
  if (headers.includes('__JSON_LD_HASH__')) errors.push('CSP hash placeholder remains');
  if (files.includes('index.html')) {
    const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
    const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    const expected = match && `sha256-${crypto.createHash('sha256').update(match[1]).digest('base64')}`;
    if (!expected || !headers.includes(`'${expected}'`)) errors.push('JSON-LD CSP hash does not match index.html');
  }
}

if (!files.some((file) => /^src\/app\.[a-f0-9]{12}\.js$/.test(file))) {
  errors.push('fingerprinted app bundle is missing');
}
if (!files.some((file) => /^assets\/city\.[a-f0-9]{12}\.webp$/.test(file))) {
  errors.push('fingerprinted city image is missing');
}
for (const runtime of ['react', 'react-dom']) {
  if (!files.some((file) => new RegExp(`^vendor/${runtime}\\.[a-f0-9]{12}\\.js$`).test(file))) {
    errors.push(`fingerprinted ${runtime} runtime is missing`);
  }
}

if (errors.length) {
  for (const error of errors) console.error(`FAIL: ${error}`);
  process.exit(1);
}

const bytes = files.reduce((sum, file) => sum + fs.statSync(path.join(DIST, file)).size, 0);
console.log(`checked ${files.length} deployable files (${bytes} bytes): OK`);
