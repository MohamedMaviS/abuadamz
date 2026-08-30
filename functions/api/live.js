const KICK_USER = 'abu_adamz';
const UPSTREAM_TIMEOUT_MS = 5000;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

function securityHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, s-maxage=20, stale-while-revalidate=40',
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
    'Content-Type': 'application/json; charset=utf-8',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Referrer-Policy': 'no-referrer',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };
}

async function checkKick() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const response = await fetch(`https://kick.com/api/v2/channels/${KICK_USER}`, {
      headers: {
        'User-Agent': UA,
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        Referer: `https://kick.com/${KICK_USER}`,
      },
      cache: 'no-store',
      signal: controller.signal,
    });
    if (!response.ok) return { live: null, reason: `upstream-${response.status}` };

    const data = await response.json();
    const livestream = data && data.livestream;
    if (!livestream) return { live: false, title: '', viewers: null, category: '', thumb: '' };

    const category = livestream.categories && livestream.categories[0] && livestream.categories[0].name;
    const thumbnail = livestream.thumbnail && (livestream.thumbnail.url || livestream.thumbnail.src);
    return {
      live: typeof livestream.is_live === 'boolean' ? livestream.is_live : true,
      title: (livestream.session_title || '').trim(),
      viewers: typeof livestream.viewer_count === 'number' ? livestream.viewer_count : null,
      category: category || '',
      thumb: thumbnail || '',
    };
  } catch (error) {
    return { live: null, reason: error && error.name === 'AbortError' ? 'timeout' : 'upstream-error' };
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
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
      status: 405,
      headers: { ...securityHeaders(), Allow: 'GET, HEAD, OPTIONS' },
    });
  }

  const kick = await checkKick();
  const status = kick.live === null ? 'unknown' : kick.live ? 'live' : 'offline';
  const body = JSON.stringify({
    status,
    isLive: kick.live,
    platform: 'kick',
    kick: {
      live: kick.live,
      title: kick.title || '',
      viewers: typeof kick.viewers === 'number' ? kick.viewers : null,
      category: kick.category || '',
      thumb: kick.thumb || '',
    },
    checkedAt: new Date().toISOString(),
  });

  return new Response(context.request.method === 'HEAD' ? null : body, {
    status: 200,
    headers: securityHeaders(),
  });
}
