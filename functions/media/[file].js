const TRACKS = new Set(['track1.mp3', 'track2.mp3', 'track3.mp3']);
const VERSION_RE = /^[a-f0-9]{12}$/;

function addHeaders(headers) {
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Cache-Control', 'public, max-age=31556952, immutable');
  headers.set('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
  headers.set('Content-Type', 'audio/mpeg');
  headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  headers.set('Referrer-Policy', 'no-referrer');
  headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  return headers;
}

function errorResponse(message, status, extra = {}) {
  const headers = addHeaders(new Headers(extra));
  headers.set('Cache-Control', 'no-store');
  headers.set('Content-Type', 'text/plain; charset=utf-8');
  return new Response(message, { status, headers });
}

function parseRange(value, size) {
  if (!value || value.includes(',')) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(value.trim());
  if (!match || (!match[1] && !match[2])) return null;

  let start;
  let end;
  if (!match[1]) {
    const suffix = Number(match[2]);
    if (!Number.isSafeInteger(suffix) || suffix <= 0) return null;
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] ? Number(match[2]) : size - 1;
  }

  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start >= size || end < start) return null;
  return { start, end: Math.min(end, size - 1) };
}

export async function onRequest(context) {
  const method = context.request.method;
  if (method === 'OPTIONS') {
    const headers = addHeaders(new Headers());
    headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Range');
    return new Response(null, { status: 204, headers });
  }
  if (method !== 'GET' && method !== 'HEAD') {
    return errorResponse('Method Not Allowed', 405, { Allow: 'GET, HEAD, OPTIONS' });
  }

  const file = String(context.params.file || '');
  const url = new URL(context.request.url);
  const version = url.searchParams.get('v') || '';
  if (!TRACKS.has(file) || !VERSION_RE.test(version)) return errorResponse('Not Found', 404);

  const stem = file.slice(0, -4);
  const assetUrl = new URL(`/assets/music/${stem}.${version}.mp3`, context.request.url);
  const asset = await context.env.ASSETS.fetch(new Request(assetUrl, { method: 'GET' }));
  if (!asset.ok) return errorResponse('Not Found', 404);

  const bytes = new Uint8Array(await asset.arrayBuffer());
  const size = bytes.byteLength;
  if (!size) return errorResponse('Asset Error', 502);

  const headers = addHeaders(new Headers(asset.headers));
  headers.set('Content-Length', String(size));
  if (method === 'HEAD') return new Response(null, { status: 200, headers });

  const requestedRange = context.request.headers.get('Range');
  if (!requestedRange) return new Response(bytes, { status: 200, headers });

  const range = parseRange(requestedRange, size);
  if (!range) {
    headers.set('Content-Range', `bytes */${size}`);
    headers.set('Content-Length', '0');
    return new Response(null, { status: 416, headers });
  }

  const chunk = bytes.slice(range.start, range.end + 1);
  headers.set('Content-Range', `bytes ${range.start}-${range.end}/${size}`);
  headers.set('Content-Length', String(chunk.byteLength));
  return new Response(chunk, { status: 206, headers });
}
