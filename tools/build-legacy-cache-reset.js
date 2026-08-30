const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');
const LEGACY_PATHS = [
  '.claude/launch.json',
  '.gitignore',
  'api/live.js',
  'assets/city.jpg',
  'assets/city.webp',
  'assets/logo.jpg',
  'assets/logo.webp',
  'assets/music/track1.mp3',
  'assets/music/track2.mp3',
  'assets/music/track3.mp3',
  'package-lock.json',
  'package.json',
  'src/app.js',
  'src/app.jsx',
  'src/effects.js',
  'src/i18n.js',
  'src/icons.js',
  'src/icons.jsx',
  'src/sections.js',
  'src/sections.jsx',
  'src/styles.css',
  'src/tweaks.js',
  'src/tweaks.jsx',
  'tools/build.js',
  'vercel.json',
];

const marker = 'This legacy asset has been permanently removed.\n';

if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  throw new Error('Run the production build before creating cache-reset assets.');
}

for (const relativePath of LEGACY_PATHS) {
  const outputPath = path.join(DIST, relativePath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const contents = relativePath.endsWith('.json') ? JSON.stringify({ removed: true }) + '\n' : marker;
  fs.writeFileSync(outputPath, contents);
}

const headersPath = path.join(DIST, '_headers');
const noStoreRules = LEGACY_PATHS.map(
  (relativePath) => `\n/${relativePath}\n  Cache-Control: no-store, max-age=0\n  X-Robots-Tag: noindex`,
).join('');
fs.appendFileSync(headersPath, `${noStoreRules}\n`);

for (const relativePath of LEGACY_PATHS) {
  const contents = fs.readFileSync(path.join(DIST, relativePath), 'utf8');
  if (!contents.includes('removed')) throw new Error(`Unsafe legacy cache-reset payload: ${relativePath}`);
}

console.log(`created ${LEGACY_PATHS.length} harmless legacy cache-reset assets`);
