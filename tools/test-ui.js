const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const DIST = path.join(__dirname, '..', 'dist');

function findFile(pattern) {
  const match = fs.readdirSync(path.join(DIST, 'src')).find((file) => pattern.test(file));
  if (!match) throw new Error(`Missing compiled UI file: ${pattern}`);
  return path.join(DIST, 'src', match);
}

const sandbox = {
  React,
  console,
  setInterval,
  clearInterval,
  setTimeout,
  clearTimeout,
  window: {},
};
const context = vm.createContext(sandbox);

for (const file of [
  findFile(/^config\.[a-f0-9]{12}\.js$/),
  findFile(/^i18n\.[a-f0-9]{12}\.js$/),
  findFile(/^icons\.[a-f0-9]{12}\.js$/),
  findFile(/^sections\.[a-f0-9]{12}\.js$/),
]) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
}

const Clips = vm.runInContext('Clips', context);
const LangContext = vm.runInContext('LangContext', context);
const I18N = sandbox.window.I18N;

function render(Component, lang) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(
      LangContext.Provider,
      { value: { lang, t: I18N[lang] } },
      React.createElement(Component),
    ),
  );
}

const clipsEnglish = render(Clips, 'en');
assert.match(clipsEnglish, /KICK · MOST VIEWED/);
assert.match(clipsEnglish, /LATEST ON TIKTOK/);
assert.match(clipsEnglish, /tiktok-embed/);
assert.match(clipsEnglish, /https:\/\/kick\.com\/abu_adamz\/clips/);
assert.match(clipsEnglish, /https:\/\/www\.tiktok\.com\/@abuadamz/);

const compiledSections = fs.readFileSync(findFile(/^sections\.[a-f0-9]{12}\.js$/), 'utf8');
assert.doesNotMatch(compiledSections, /UpcomingStream|NIGHT PATROLS|باترولات الليل/);

console.log('UI render tests: OK');
