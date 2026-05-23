/* ABU ADAMZ — DYNASTY effects: gold ember drift + green sweep canvas,
   gold pointer light, scroll reveals, 3D tilt, synth SFX */

/* ---------- Gold ember + green sweep background ---------- */
(function () {
  const c = document.getElementById('fx');
  if (!c) return;
  const ctx = c.getContext('2d');
  const DPR = Math.min(1.5, window.devicePixelRatio || 1);
  let W, H, motes = [], raf = 0, paused = false;

  let gold = '#e9b949', volt = '#ffd86b';
  const readVars = () => {
    const cs = getComputedStyle(document.documentElement);
    const a = cs.getPropertyValue('--ac').trim(); if (a) gold = a;
    const v = cs.getPropertyValue('--volt').trim(); if (v) volt = v;
  };
  readVars();

  function rgb(hex) {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map(x => x + x).join('') : h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function size() {
    W = c.width = innerWidth * DPR;
    H = c.height = innerHeight * DPR;
    c.style.width = innerWidth + 'px';
    c.style.height = innerHeight + 'px';
  }
  function spawn(initial) {
    return {
      x: Math.random() * W,
      y: initial ? Math.random() * H : H + Math.random() * 60 * DPR,
      r: (Math.random() * 2.1 + 0.6) * DPR,
      sp: (Math.random() * 0.35 + 0.12) * DPR,
      sway: (Math.random() * 22 + 8) * DPR,
      swSp: Math.random() * 0.012 + 0.004,
      ph: Math.random() * Math.PI * 2,
      tw: Math.random() * 0.02 + 0.006,
      green: Math.random() < 0.14,
    };
  }
  function make() {
    const n = innerWidth < 768 ? 20 : 42;
    motes = [];
    for (let i = 0; i < n; i++) motes.push(spawn(true));
  }
  size(); make();
  addEventListener('resize', () => { size(); make(); });
  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
    if (!paused) raf = requestAnimationFrame(tick);
  });

  // green light sweep timing
  let sweepT = -2;            // seconds into the current sweep (negative = waiting)
  const SWEEP_GAP = 9.5;      // seconds between sweeps
  const SWEEP_DUR = 2.6;      // seconds a sweep takes to cross
  let last = performance.now();

  let fc = 0;
  function tick(now) {
    if (paused) return;
    if ((++fc & 127) === 0) readVars();
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const [gr, gg, gb] = rgb(gold);
    const [vr, vg, vb] = rgb(volt);

    ctx.clearRect(0, 0, W, H);

    // (central gold glow is a static CSS gradient now — cheaper than a per-frame fill)

    // rising gold motes
    ctx.globalCompositeOperation = 'lighter';
    for (const m of motes) {
      m.y -= m.sp;
      m.ph += m.swSp;
      const x = m.x + Math.cos(m.ph) * m.sway;
      const tw = 0.55 + 0.45 * Math.sin(now * m.tw + m.ph);
      if (m.y < -20 * DPR) { Object.assign(m, spawn(false)); continue; }
      const col = m.green ? `${vr},${vg},${vb}` : `${gr},${gg},${gb}`;
      const a = (m.green ? 0.5 : 0.7) * tw;
      const g = ctx.createRadialGradient(x, m.y, 0, x, m.y, m.r * 4);
      g.addColorStop(0, `rgba(${col},${a})`);
      g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, m.y, m.r * 4, 0, Math.PI * 2); ctx.fill();
    }

    // green energy sweep (police-light pass)
    sweepT += dt;
    if (sweepT > SWEEP_DUR) sweepT = -(SWEEP_GAP);
    if (sweepT >= 0 && sweepT <= SWEEP_DUR) {
      const p = sweepT / SWEEP_DUR;            // 0..1 across screen
      const cx = (-0.25 + p * 1.5) * W;
      const band = W * 0.16;
      const env = Math.sin(p * Math.PI);       // fade in/out
      const sg = ctx.createLinearGradient(cx - band, 0, cx + band, 0);
      sg.addColorStop(0, `rgba(${vr},${vg},${vb},0)`);
      sg.addColorStop(0.5, `rgba(${vr},${vg},${vb},${0.07 * env})`);
      sg.addColorStop(1, `rgba(${vr},${vg},${vb},0)`);
      ctx.fillStyle = sg;
      ctx.save();
      ctx.translate(W / 2, H / 2); ctx.rotate(-0.18); ctx.translate(-W / 2, -H / 2);
      ctx.fillRect(0, -H * 0.3, W, H * 1.6);
      ctx.restore();
    }

    ctx.globalCompositeOperation = 'source-over';
    raf = requestAnimationFrame(tick);
  }
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    raf = requestAnimationFrame(tick);
  } else {
    tick(performance.now()); cancelAnimationFrame(raf);
  }
})();

/* ---------- Pointer gold light ---------- */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 900) return;
  let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, raf = 0;
  const el = document.createElement('div');
  el.id = 'goldlight';
  document.body.appendChild(el);
  const move = () => {
    x += (tx - x) * 0.12; y += (ty - y) * 0.12;
    el.style.transform = `translate(${x}px,${y}px)`;
    if (Math.abs(tx - x) > .5 || Math.abs(ty - y) > .5) raf = requestAnimationFrame(move);
    else raf = 0;
  };
  addEventListener('pointermove', (e) => {
    tx = e.clientX; ty = e.clientY;
    if (!raf) raf = requestAnimationFrame(move);
  }, { passive: true });
})();

/* ---------- Scroll reveal ---------- */
(function () {
  const show = (el) => requestAnimationFrame(() =>
    requestAnimationFrame(() => el.classList.add('in')));
  const io = new IntersectionObserver((es) => {
    for (const e of es) if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  const bind = () => {
    document.documentElement.classList.add('ready');
    document.querySelectorAll('.rv:not(.in):not([data-b])').forEach(el => {
      el.dataset.b = 1;
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.95 && r.bottom > -40) show(el);
      else io.observe(el);
    });
  };
  window.__reveal = bind;
  if (document.readyState !== 'loading') bind(); else addEventListener('DOMContentLoaded', bind);
  addEventListener('load', bind);
  setTimeout(bind, 700); setTimeout(bind, 1700);
  setTimeout(() => document.querySelectorAll('.rv:not(.in)').forEach(e => e.classList.add('in')), 3800);
})();

/* ---------- 3D tilt ---------- */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 768) return;
  const SEL = '[data-tilt]';
  const reg = () => {
    document.querySelectorAll(SEL + ':not([data-tb])').forEach(el => {
      el.dataset.tb = 1;
      const MAX = +(el.dataset.tilt || 8);
      let rid = 0, trx = 0, try_ = 0, crx = 0, cry = 0, on = false, rect = null;
      const paint = () => {
        crx += (trx - crx) * .16; cry += (try_ - cry) * .16;
        if (!on && Math.abs(crx) < .04 && Math.abs(cry) < .04) { el.style.transform = ''; rid = 0; return; }
        el.style.transform = `perspective(1000px) rotateX(${crx.toFixed(2)}deg) rotateY(${cry.toFixed(2)}deg) translateZ(0)`;
        rid = requestAnimationFrame(paint);
      };
      el.addEventListener('pointerenter', () => { on = true; rect = el.getBoundingClientRect(); if (!rid) rid = requestAnimationFrame(paint); });
      el.addEventListener('pointermove', (e) => {
        if (!rect) rect = el.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width - .5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - .5) * 2;
        try_ = nx * MAX; trx = -ny * MAX; if (!rid) rid = requestAnimationFrame(paint);
      });
      el.addEventListener('pointerleave', () => { on = false; trx = 0; try_ = 0; rect = null; if (!rid) rid = requestAnimationFrame(paint); });
    });
  };
  window.__tilt = reg;
  setTimeout(reg, 400); setTimeout(reg, 1400);
  setTimeout(() => {
    const root = document.getElementById('app'); if (!root) return;
    let p = 0;
    new MutationObserver(() => { if (p) return; p = setTimeout(() => { p = 0; reg(); }, 220); })
      .observe(root, { childList: true, subtree: true });
  }, 1600);
})();

/* ---------- Synth hover / click SFX ---------- */
(function () {
  let ac = null, on = true;
  window.__sfx = v => on = !!v;
  const ctx = () => { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } } if (ac.state === 'suspended') ac.resume().catch(()=>{}); return ac; };
  let last = 0;
  window.__hover = () => {
    if (!on) return; const n = performance.now(); if (n - last < 55) return; last = n;
    const a = ctx(); if (!a) return;
    const o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle'; o.frequency.setValueAtTime(1480, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(820, a.currentTime + .07);
    g.gain.setValueAtTime(.022, a.currentTime); g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .09);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .11);
  };
  window.__click = () => {
    if (!on) return; const a = ctx(); if (!a) return; const t = a.currentTime;
    const o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(240, t); o.frequency.exponentialRampToValueAtTime(76, t + .09);
    g.gain.setValueAtTime(.065, t); g.gain.exponentialRampToValueAtTime(.0001, t + .12);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + .13);
  };
})();
