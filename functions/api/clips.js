const KICK_USER = 'abu_adamz';
const UPSTREAM_TIMEOUT_MS = 6500;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

function securityHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
    'Content-Type': 'application/json; charset=utf-8',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Referrer-Policy': 'no-referrer',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };
}

function safeCursor(value) {
  if (!value || value.length > 300) return '';
  try {
    const cursor = JSON.parse(value);
    if (!cursor || typeof cursor !== 'object') return '';
    if (!/^clip_[A-Z0-9]+$/i.test(String(cursor.id || ''))) return '';
    if (!Number.isFinite(Number(cursor.view)) || Number(cursor.view) < 0) return '';
    return JSON.stringify({ view:Number(cursor.view), id:String(cursor.id) });
  } catch (_) {
    return '';
  }
}

function normalizeClip(clip) {
  if (!clip || clip.privacy === 'private' || !/^clip_[A-Z0-9]+$/i.test(String(clip.id || ''))) return null;
  const thumbnail = String(clip.thumbnail_url || '');
  if (!thumbnail.startsWith('https://clips.kick.com/')) return null;
  return {
    id: String(clip.id),
    title: String(clip.title || '').trim().slice(0, 180),
    url: `https://kick.com/${KICK_USER}/clips/${clip.id}`,
    thumbnail,
    views: Math.max(0, Number(clip.views ?? clip.view_count) || 0),
    likes: Math.max(0, Number(clip.likes ?? clip.likes_count) || 0),
    duration: Math.max(0, Number(clip.duration) || 0),
    createdAt: String(clip.created_at || ''),
  };
}

async function fetchClips(cursor) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const url = new URL(`https://kick.com/api/v2/channels/${KICK_USER}/clips`);
    url.searchParams.set('sort', 'view');
    url.searchParams.set('time', 'all');
    if (cursor) url.searchParams.set('cursor', cursor);
    const response = await fetch(url, {
      headers: {
        'User-Agent': UA,
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'ar-EG,ar;q=0.9,en;q=0.8',
        Referer: `https://kick.com/${KICK_USER}/clips`,
      },
      cache: 'no-store',
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`upstream-${response.status}`);
    const data = await response.json();
    const clips = (Array.isArray(data.clips) ? data.clips : [])
      .map(normalizeClip)
      .filter(Boolean)
      .sort((a, b) => b.views - a.views);
    const nextCursor = safeCursor(typeof data.nextCursor === 'string' ? data.nextCursor : JSON.stringify(data.nextCursor || ''));
    return { clips, nextCursor };
  } finally {
    clearTimeout(timeout);
  }
}

export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...securityHeaders(),
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
  if (context.request.method !== 'GET' && context.request.method !== 'HEAD') {
    return new Response(JSON.stringify({ error:'method_not_allowed' }), {
      status: 405,
      headers: { ...securityHeaders(), Allow:'GET, HEAD, OPTIONS' },
    });
  }

  const requestUrl = new URL(context.request.url);
  const rawCursor = requestUrl.searchParams.get('cursor') || '';
  const cursor = safeCursor(rawCursor);
  if (rawCursor && !cursor) {
    return new Response(JSON.stringify({ error:'invalid_cursor' }), {
      status: 400,
      headers: securityHeaders(),
    });
  }

  try {
    const result = await fetchClips(cursor);
    const body = JSON.stringify({
      ...result,
      sort:'views',
      updatedAt:new Date().toISOString(),
    });
    return new Response(context.request.method === 'HEAD' ? null : body, {
      status: 200,
      headers: securityHeaders(),
    });
  } catch (_) {
    return new Response(JSON.stringify({ error:'clips_unavailable', clips:[], nextCursor:'' }), {
      status: 503,
      headers: { ...securityHeaders(), 'Cache-Control':'no-store' },
    });
  }
}
