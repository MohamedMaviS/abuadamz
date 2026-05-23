// Precompile JSX -> plain JS so the site needs no in-browser Babel.
// Classic React runtime + script scope keeps the cross-file globals
// (Icon, Logo, I18N, App, ...) working exactly as before.
// Run:  node tools/build.js   (after editing any src/*.jsx)
const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src');
const FILES = ['icons.jsx', 'sections.jsx', 'tweaks.jsx', 'app.jsx'];

let ok = true;
for (const f of FILES) {
  const inPath = path.join(SRC, f);
  const outPath = path.join(SRC, f.replace(/\.jsx$/, '.js'));
  try {
    const res = babel.transformFileSync(inPath, {
      configFile: false,
      babelrc: false,
      sourceType: 'script',
      presets: [[require.resolve('@babel/preset-react'), { runtime: 'classic' }]],
      minified: true,
      compact: true,
      comments: false,
    });
    fs.writeFileSync(outPath, '// compiled from ' + f + ' — edit the .jsx, run tools/build.js\n' + res.code + '\n');
    console.log('built', f, '->', path.basename(outPath), (res.code.length / 1024).toFixed(1) + 'KB');
  } catch (e) {
    ok = false;
    console.error('FAILED', f, e.message);
  }
}
process.exit(ok ? 0 : 1);
