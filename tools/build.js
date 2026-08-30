const babel = require('@babel/core');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const JSX_FILES = ['icons.jsx', 'sections.jsx', 'tweaks.jsx', 'app.jsx'];
const PLAIN_JS_FILES = ['config.js', 'effects.js', 'i18n.js'];
const RUNTIME_FILES = [
  ['vendor/react.js', path.join(ROOT, 'node_modules', 'react', 'umd', 'react.production.min.js')],
  ['vendor/react-dom.js', path.join(ROOT, 'node_modules', 'react-dom', 'umd', 'react-dom.production.min.js')],
];

function hash(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 12);
}

function write(relativePath, contents) {
  const outputPath = path.join(DIST, relativePath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, contents);
  return outputPath;
}

function fingerprint(relativePath, contents) {
  const parsed = path.posix.parse(relativePath.replace(/\\/g, '/'));
  const fingerprinted = path.posix.join(parsed.dir, `${parsed.name}.${hash(contents)}${parsed.ext}`);
  write(fingerprinted, contents);
  return fingerprinted;
}

function replaceAll(input, replacements) {
  let output = input;
  for (const [from, to] of replacements) output = output.split(from).join(to);
  return output;
}

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

const replacements = [];
const assetRoot = path.join(ROOT, 'assets');

for (const [logical, sourcePath] of RUNTIME_FILES) {
  const output = fingerprint(logical, fs.readFileSync(sourcePath));
  replacements.push([logical, output]);
}

for (const entry of fs.readdirSync(assetRoot, { withFileTypes: true })) {
  if (!entry.isFile()) continue;
  const logical = `assets/${entry.name}`;
  const contents = fs.readFileSync(path.join(assetRoot, entry.name));
  const output = fingerprint(logical, contents);
  replacements.push([logical, output]);
}

const musicRoot = path.join(assetRoot, 'music');
for (const entry of fs.readdirSync(musicRoot, { withFileTypes: true })) {
  if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== '.mp3') continue;
  const contents = fs.readFileSync(path.join(musicRoot, entry.name));
  const version = hash(contents);
  const parsed = path.parse(entry.name);
  const output = `assets/music/${parsed.name}.${version}${parsed.ext}`;
  write(output, contents);
  replacements.push([`assets/music/${entry.name}`, `/media/${entry.name}?v=${version}`]);
}

const cssSource = fs.readFileSync(path.join(SRC, 'styles.css'), 'utf8');
const cssOutput = fingerprint('src/styles.css', Buffer.from(replaceAll(cssSource, replacements)));
replacements.push(['src/styles.css', cssOutput]);

for (const file of PLAIN_JS_FILES) {
  const source = fs.readFileSync(path.join(SRC, file), 'utf8');
  const output = fingerprint(`src/${file}`, Buffer.from(replaceAll(source, replacements)));
  replacements.push([`src/${file}`, output]);
}

for (const file of JSX_FILES) {
  const sourcePath = path.join(SRC, file);
  const result = babel.transformFileSync(sourcePath, {
    configFile: false,
    babelrc: false,
    sourceType: 'script',
    presets: [[require.resolve('@babel/preset-react'), { runtime: 'classic' }]],
    minified: true,
    compact: true,
    comments: false,
  });
  const logical = `src/${file.replace(/\.jsx$/, '.js')}`;
  const compiled = `// compiled from ${file}\n${replaceAll(result.code, replacements)}\n`;
  const output = fingerprint(logical, Buffer.from(compiled));
  replacements.push([logical, output]);
}

let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
html = replaceAll(html, replacements);
write('index.html', html);

const ldJsonMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (!ldJsonMatch) throw new Error('index.html is missing its JSON-LD block');
const ldJsonHash = crypto.createHash('sha256').update(ldJsonMatch[1]).digest('base64');

let headers = fs.readFileSync(path.join(ROOT, '_headers'), 'utf8');
headers = headers.split('__JSON_LD_HASH__').join(`sha256-${ldJsonHash}`);
if (headers.includes('__JSON_LD_HASH__')) throw new Error('CSP hash placeholder was not replaced');
write('_headers', headers);

for (const file of ['404.html', 'robots.txt', 'sitemap.xml']) {
  write(file, fs.readFileSync(path.join(ROOT, file)));
}

const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else files.push(path.relative(DIST, full).replace(/\\/g, '/'));
  }
}
walk(DIST);
console.log(`built ${files.length} deployable files in dist/`);
for (const file of files) console.log(`  ${file}`);
