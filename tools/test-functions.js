const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

function loadFunction(relativePath, globals = {}) {
  const filename = path.join(ROOT, relativePath);
  const source = fs.readFileSync(filename, 'utf8')
    .replace(/export\s+async\s+function\s+onRequest/, 'async function onRequest');
  const context = {
    AbortController,
    Date,
    Headers,
    Request,
    Response,
    URL,
    Uint8Array,
    clearTimeout,
    console,
    module: { exports: {} },
    setTimeout,
    ...globals,
  };
  vm.runInNewContext(`${source}\nmodule.exports = { onRequest };`, context, { filename });
  return context.module.exports.onRequest;
}

async function readJson(response) {
  return JSON.parse(await response.text());
}

async function testLiveFunction() {
  const offline = loadFunction('functions/api/live.js', {
    fetch: async () => new Response(JSON.stringify({ livestream: null }), { status: 200 }),
  });
  let response = await offline({ request: new Request('https://example.test/api/live') });
  let body = await readJson(response);
  assert.equal(response.status, 200);
  assert.equal(body.status, 'offline');
  assert.equal(body.isLive, false);

  const live = loadFunction('functions/api/live.js', {
    fetch: async () => new Response(JSON.stringify({ livestream: {
      is_live: true,
      session_title: 'Patrol',
      viewer_count: 123,
      categories: [{ name: 'GTA' }],
    } }), { status: 200 }),
  });
  response = await live({ request: new Request('https://example.test/api/live') });
  body = await readJson(response);
  assert.equal(body.status, 'live');
  assert.equal(body.isLive, true);
  assert.equal(body.kick.viewers, 123);

  const unknown = loadFunction('functions/api/live.js', {
    fetch: async () => { throw new Error('upstream unavailable'); },
  });
  response = await unknown({ request: new Request('https://example.test/api/live') });
  body = await readJson(response);
  assert.equal(body.status, 'unknown');
  assert.equal(body.isLive, null);

  response = await unknown({ request: new Request('https://example.test/api/live', { method: 'POST' }) });
  assert.equal(response.status, 405);
}

async function testMediaFunction() {
  const bytes = Uint8Array.from({ length: 100 }, (_, index) => index);
  const onRequest = loadFunction('functions/media/[file].js');
  const env = {
    ASSETS: {
      fetch: async () => new Response(bytes, { status: 200, headers: { ETag: 'test' } }),
    },
  };

  let response = await onRequest({
    request: new Request('https://example.test/media/track1.mp3?v=aaaaaaaaaaaa', { headers: { Range: 'bytes=10-19' } }),
    params: { file: 'track1.mp3' },
    env,
  });
  assert.equal(response.status, 206);
  assert.equal(response.headers.get('Content-Range'), 'bytes 10-19/100');
  assert.equal((await response.arrayBuffer()).byteLength, 10);

  response = await onRequest({
    request: new Request('https://example.test/media/track1.mp3?v=aaaaaaaaaaaa', { headers: { Range: 'bytes=999-1000' } }),
    params: { file: 'track1.mp3' },
    env,
  });
  assert.equal(response.status, 416);

  response = await onRequest({
    request: new Request('https://example.test/media/track1.mp3?v=bad'),
    params: { file: 'track1.mp3' },
    env,
  });
  assert.equal(response.status, 404);
}

Promise.all([testLiveFunction(), testMediaFunction()])
  .then(() => console.log('function tests: OK'))
  .catch((error) => { console.error(error); process.exit(1); });
