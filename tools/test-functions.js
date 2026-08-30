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

async function testClipsFunction() {
  let upstreamUrl = '';
  const onRequest = loadFunction('functions/api/clips.js', {
    fetch: async (url) => {
      upstreamUrl = String(url);
      return new Response(JSON.stringify({
        clips: [
          {
            id: 'clip_TOP123',
            title: 'Top patrol',
            thumbnail_url: 'https://clips.kick.com/clips/top/thumbnail.webp',
            views: 2034,
            likes: 18,
            duration: 49,
            created_at: '2026-08-29T22:00:00Z',
            privacy: 'public',
          },
          {
            id: 'clip_PRIVATE123',
            title: 'Hidden',
            thumbnail_url: 'https://clips.kick.com/clips/private/thumbnail.webp',
            views: 9000,
            privacy: 'private',
          },
        ],
        nextCursor: { view:47, id:'clip_NEXT123' },
      }), { status:200 });
    },
  });

  let response = await onRequest({ request:new Request('https://example.test/api/clips') });
  let body = await readJson(response);
  assert.equal(response.status, 200);
  assert.equal(body.sort, 'views');
  assert.equal(body.clips.length, 1);
  assert.equal(body.clips[0].views, 2034);
  assert.equal(body.clips[0].url, 'https://kick.com/abu_adamz/clips/clip_TOP123');
  assert.equal(body.nextCursor, '{"view":47,"id":"clip_NEXT123"}');
  assert.match(upstreamUrl, /sort=view/);
  assert.match(upstreamUrl, /time=all/);

  response = await onRequest({ request:new Request('https://example.test/api/clips?cursor=bad') });
  assert.equal(response.status, 400);

  response = await onRequest({ request:new Request('https://example.test/api/clips', { method:'POST' }) });
  assert.equal(response.status, 405);

  const unavailable = loadFunction('functions/api/clips.js', {
    fetch: async () => { throw new Error('upstream unavailable'); },
  });
  response = await unavailable({ request:new Request('https://example.test/api/clips') });
  assert.equal(response.status, 503);
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

Promise.all([testLiveFunction(), testClipsFunction(), testMediaFunction()])
  .then(() => console.log('function tests: OK'))
  .catch((error) => { console.error(error); process.exit(1); });
