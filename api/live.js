// ============================================================
// /api/live — live-status endpoint (Vercel Edge Function)
// ------------------------------------------------------------
// Browser CORS rules block the site from hitting youtube.com /
// tiktok.com directly, so we check here server-side from
// Vercel's IP — no CORS, no quota, no middleman.
//
// Response shape:
//   { isLive: boolean, platform: 'youtube' | 'tiktok',
//     debug:  { youtube: true|false|null, tiktok: true|false|null } }
//
// null means "could not determine" — the client keeps its
// previous state so a transient upstream blip does not flip OFF.
// ============================================================

export const config = { runtime: 'edge' };

const YT_USER = 'ABU_ADAMZ';
const TIKTOK_USER = 'ABUADAMZ';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

// --- YouTube: scrape the /live page for live-only markers.
async function checkYouTube() {
  try {
    const r = await fetch(`https://www.youtube.com/@${YT_USER}/live`, {
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      cache: 'no-store',
      redirect: 'follow',
    });
    if (!r.ok) return null;
    const html = await r.text();
    // hlsManifestUrl is only present on an actively streaming watch page.
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
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
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

export default async function handler() {
  const [youtube, tiktok] = await Promise.all([checkYouTube(), checkTikTok()]);

  let isLive = false;
  let platform = 'youtube';
  if (youtube === true)      { isLive = true; platform = 'youtube'; }
  else if (tiktok === true)  { isLive = true; platform = 'tiktok';  }

  return new Response(JSON.stringify({ isLive, platform, debug: { youtube, tiktok } }), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, s-maxage=20, stale-while-revalidate=40',
      'access-control-allow-origin': '*',
    },
  });
}
