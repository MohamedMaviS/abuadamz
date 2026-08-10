// ============================================================
// /api/live — live-status endpoint (Cloudflare Pages Function)
// ------------------------------------------------------------
// Browser CORS rules block the site from hitting kick.com /
// youtube.com / tiktok.com directly, so we check here
// server-side from Cloudflare's edge — no CORS, no quota, no middleman.
//
// Response shape:
//   { isLive: boolean, platform: 'kick' | 'youtube' | 'tiktok',
//     debug:  { kick, youtube, tiktok } }   // each true|false|null
//
// null means "could not determine" — the client keeps its
// previous state so a transient upstream blip does not flip OFF.
// ============================================================

const KICK_USER = 'abu_adamz';
const YT_USER = 'ABU_ADAMZ';
const TIKTOK_USER = 'ABUADAMZ';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

// --- Kick: clean JSON API. `livestream` is an object while live, null while offline.
// Returns rich info: { live, title, viewers, category }. live === null => unknown.
async function checkKick() {
  try {
    const r = await fetch(`https://kick.com/api/v2/channels/${KICK_USER}`, {
      headers: {
        'User-Agent': UA,
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': `https://kick.com/${KICK_USER}`,
      },
      cache: 'no-store',
    });
    if (!r.ok) return { live: null };
    const d = await r.json();
    const ls = d && d.livestream;
    if (ls) {
      const live = (typeof ls.is_live === 'boolean') ? ls.is_live : true;
      const cat = ls.categories && ls.categories[0] && ls.categories[0].name;
      const thumb = ls.thumbnail && (ls.thumbnail.url || ls.thumbnail.src);
      return {
        live,
        title: (ls.session_title || '').trim(),
        viewers: (typeof ls.viewer_count === 'number') ? ls.viewer_count : null,
        category: cat || '',
        thumb: thumb || '',
      };
    }
    return { live: false };
  } catch {
    return { live: null };
  }
}

// --- YouTube: scrape the /live page for live-only markers.
async function checkYouTube() {
  try {
    const r = await fetch(`https://www.youtube.com/@${YT_USER}/live`, {
      headers: { 'User-Agent': UA, 'Accept': 'text/html', 'Accept-Language': 'en-US,en;q=0.9' },
      cache: 'no-store', redirect: 'follow',
    });
    if (!r.ok) return null;
    const html = await r.text();
    if (/hlsManifestUrl/i.test(html)) return true;
    if (/"isLiveNow"\s*:\s*true/i.test(html)) return true;
    if (/"liveBroadcastContent"\s*:\s*"live"/i.test(html)) return true;
    return false;
  } catch {
    return null;
  }
}

// --- TikTok: no public API. Scrape the /live page for live-only markers.
async function checkTikTok() {
  try {
    const r = await fetch(`https://www.tiktok.com/@${TIKTOK_USER}/live`, {
      headers: { 'User-Agent': UA, 'Accept': 'text/html', 'Accept-Language': 'en-US,en;q=0.9' },
      cache: 'no-store',
    });
    if (!r.ok) return null;
    const html = await r.text();
    if (/liveRoom[\s\S]{0,1200}?"status"\s*:\s*2/i.test(html)) return true;
    if (/"@type"\s*:\s*"BroadcastEvent"/i.test(html)) return true;
    if (/"isLive"\s*:\s*true/i.test(html)) return true;
    return false;
  } catch {
    return null;
  }
}

export async function onRequest(context) {
  const [kick, youtube, tiktok] = await Promise.all([checkKick(), checkYouTube(), checkTikTok()]);

  let isLive = false;
  let platform = 'kick';
  if (kick.live === true)    { isLive = true; platform = 'kick';    }
  else if (youtube === true) { isLive = true; platform = 'youtube'; }
  else if (tiktok === true)  { isLive = true; platform = 'tiktok';  }

  const body = {
    isLive,
    platform,
    kick: {
      live: kick.live === true,
      title: kick.title || '',
      viewers: (typeof kick.viewers === 'number') ? kick.viewers : null,
      category: kick.category || '',
      thumb: kick.thumb || '',
    },
    debug: { kick: kick.live, youtube, tiktok },
  };

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, s-maxage=20, stale-while-revalidate=40',
      'access-control-allow-origin': '*',
    },
  });
}
