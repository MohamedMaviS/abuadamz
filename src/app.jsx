const { useState, useEffect, useRef } = React;
/* KICK_USER and CHANNELS are declared in sections.jsx (loaded first) and shared
   via global script scope — do not redeclare them here. */

function hexToRgba(hex,a){ const h=hex.replace('#',''); const n=parseInt(h.length===3?h.split('').map(c=>c+c).join(''):h,16); return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`; }
function shade(hex,p){ const h=hex.replace('#',''); const n=parseInt(h.length===3?h.split('').map(c=>c+c).join(''):h,16); let r=(n>>16)&255,g=(n>>8)&255,b=n&255; const a=Math.round(2.55*p); r=Math.max(0,Math.min(255,r+a)); g=Math.max(0,Math.min(255,g+a)); b=Math.max(0,Math.min(255,b+a)); return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1); }

function App(){
  const [tw,setTw]=useState(window.TWEAKS_DEFAULT);
  const [panel,setPanel]=useState(false);
  const [liveData,setLiveData]=useState(null);
  const [refreshing,setRefreshing]=useState(false);
  const isLive=!!(liveData&&liveData.isLive);

  const set=(k,v)=>setTw(p=>({...p,[k]:v}));

  const refreshLive=React.useCallback(async()=>{
    setRefreshing(true);
    try{ const r=await fetch('/api/live',{cache:'no-store'}); if(r.ok){ const d=await r.json(); if(d&&typeof d.isLive==='boolean') setLiveData(d); } }catch(_){}
    setRefreshing(false);
  },[]);

  useEffect(()=>{
    const r=document.documentElement;
    r.setAttribute('data-theme',tw.theme);
    r.setAttribute('data-fx',tw.fx);
    r.setAttribute('lang',tw.lang);
    r.setAttribute('dir',tw.lang==='ar'?'rtl':'ltr');
    const a=tw.accent;
    r.style.setProperty('--ac',a);
    r.style.setProperty('--ac-2',shade(a,-22));
    r.style.setProperty('--ac-soft',hexToRgba(a,.14));
    r.style.setProperty('--glow',`0 0 60px ${hexToRgba(a,.32)}`);
    window.__sfx?.(tw.sound);
  },[tw]);

  useEffect(()=>{ refreshLive(); const id=setInterval(refreshLive,60000); return ()=>clearInterval(id); },[refreshLive]);

  useEffect(()=>{ setTimeout(()=>window.__reveal?.(),80); },[tw.lang]);

  const t=I18N[tw.lang]||I18N.en;
  return (
    <LangContext.Provider value={{lang:tw.lang,t}}>
      <Nav isLive={isLive} lang={tw.lang} setLang={v=>set('lang',v)} onCustomize={()=>setPanel(o=>!o)}/>
      <Hero isLive={isLive}/>
      <LiveNow data={liveData} refreshing={refreshing} onRefresh={refreshLive}/>
      <OnDuty/>
      <Channels/>
      <About/>
      <Community/>
      <Footer/>
      <TweaksPanel tw={tw} set={set} open={panel} onClose={()=>setPanel(false)}/>
      <KickPreview/>
      <MusicPlayer/>
    </LangContext.Provider>
  );
}

function Nav({ isLive, lang, setLang, onCustomize }){
  const { t }=React.useContext(LangContext);
  const [sc,setSc]=useState(false);
  useEffect(()=>{ const f=()=>setSc(window.scrollY>16); f(); addEventListener('scroll',f); return ()=>removeEventListener('scroll',f); },[]);
  return (
    <nav className={`nav ${sc?'scrolled':''}`}>
      <div className="nav__bar">
        <a className="brand" href="#top" onMouseEnter={()=>window.__hover?.()} onClick={()=>window.__click?.()} aria-label="ABU ADAMZ">
          <span className="brand__mk"><Logo/></span>
          <span className="brand__wm">ABU ADAMZ</span>
        </a>
        <div className="nav__links">
          <a href="#about" onMouseEnter={()=>window.__hover?.()}>{t.navAbout}</a>
          <a href="#channels" onMouseEnter={()=>window.__hover?.()}>{t.navChannels}</a>
          <a href="#community" onMouseEnter={()=>window.__hover?.()}>{t.navCommunity}</a>
        </div>
        <div className="nav__right">
          <a className="livepill" data-live={isLive} href={`https://kick.com/${KICK_USER}`} target="_blank" rel="noopener noreferrer"
             data-kpv onMouseEnter={()=>window.__hover?.()}>
            <span className="dot"></span><span>{isLive?t.live:t.watchLive}</span>
          </a>
          <div className="langtog" data-l={lang}>
            <button className={lang==='en'?'on':''} onClick={()=>{setLang('en');window.__click?.();}}>EN</button>
            <button className={lang==='ar'?'on':''} onClick={()=>{setLang('ar');window.__click?.();}}>ع</button>
          </div>
          <button className="iconbtn" onClick={()=>{onCustomize();window.__click?.();}} aria-label="Customize">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.2-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.2 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

/* Kick hover-preview: hovering any [data-kpv] pops an embedded mini-player (desktop). */
function KickPreview(){
  const [show,setShow]=useState(false);
  const [mount,setMount]=useState(false);
  const [pos,setPos]=useState({top:0,left:0});
  const [muted,setMuted]=useState(true);
  const [vol,setVol]=useState(0.7);
  const hide=useRef(null);

  useEffect(()=>{
    if(window.innerWidth<900) return;
    const W=480,H=270,G=14;
    const open=(el)=>{
      clearTimeout(hide.current);
      const r=el.getBoundingClientRect();
      let top=r.bottom+G; if(top+H>innerHeight-20) top=Math.max(20,r.top-H-G);
      let left=r.left+r.width/2-W/2; left=Math.max(16,Math.min(left,innerWidth-W-16));
      setPos({top,left}); setMount(true); setShow(true);
    };
    const sched=()=>{ clearTimeout(hide.current); hide.current=setTimeout(()=>setShow(false),200); };
    const over=(e)=>{ const tg=e.target.closest('[data-kpv]'); if(tg){open(tg);return;} if(e.target.closest('.kpv')) clearTimeout(hide.current); };
    const out=(e)=>{ const tg=e.target.closest('[data-kpv]'); if(!tg)return; const g=e.relatedTarget; if(g&&(g.closest?.('[data-kpv]')||g.closest?.('.kpv')))return; sched(); };
    const pout=(e)=>{ if(!e.target.closest('.kpv'))return; const g=e.relatedTarget; if(g&&(g.closest?.('[data-kpv]')||g.closest?.('.kpv')))return; sched(); };
    document.addEventListener('mouseover',over);
    document.addEventListener('mouseout',out);
    document.addEventListener('mouseout',pout);
    return ()=>{ document.removeEventListener('mouseover',over); document.removeEventListener('mouseout',out); document.removeEventListener('mouseout',pout); clearTimeout(hide.current); };
  },[]);

  return (
    <div className={`kpv ${show?'show':''}`} style={{top:pos.top,left:pos.left}} aria-hidden={!show}>
      <div className="kpv__v">
        {mount && <iframe key={`k-${muted?'m':'u'}-${Math.round(vol*10)}`}
          src={`https://player.kick.com/${KICK_USER}?autoplay=true&muted=${muted}&volume=${vol}`}
          title="ABU ADAMZ live on Kick" allow="autoplay; fullscreen; picture-in-picture" loading="lazy"/>}
      </div>
      <div className="kpv__ft">
        <span className="kpv__dot"></span><span>KICK.COM/{KICK_USER.toUpperCase()}</span>
        <span className="kpv__au">
          <button className="kpv__mute" onClick={(e)=>{e.preventDefault();e.stopPropagation();setMuted(m=>!m);}} aria-label={muted?'Unmute':'Mute'}>
            {muted?(
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            ):(
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            )}
          </button>
          <input className="kpv__vol" type="range" min="0" max="1" step="0.05" value={muted?0:vol}
            onChange={(e)=>{const v=parseFloat(e.target.value);setVol(v);setMuted(v===0);}}
            onClick={(e)=>e.stopPropagation()} aria-label="Volume"/>
        </span>
      </div>
    </div>
  );
}

/* Music player — floating launcher + expandable panel (playlist, seek, volume).
   Auto-starts on first user interaction. Gold theme. */
function fmtTime(s){ if(!s||!isFinite(s)) return '0:00'; const m=Math.floor(s/60); const ss=Math.floor(s%60); return m+':'+String(ss).padStart(2,'0'); }

function MusicPlayer(){
  const TRACKS = [
    { title:'صلعة البلّور',    src:'assets/music/track1.mp3' },
    { title:'صلعة ملوكي',      src:'assets/music/track2.mp3' },
    { title:'يا أبو آدم أصلع',  src:'assets/music/track3.mp3' },
  ];
  const ARTIST = 'ABU ADAMZ · 2026';
  const [idx, setIdx]       = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [open, setOpen]     = React.useState(false);
  const [vol, setVol]       = React.useState(0.55);
  const [muted, setMuted]   = React.useState(false);
  const [cur, setCur]       = React.useState(0);
  const [dur, setDur]       = React.useState(0);
  const audioRef  = React.useRef(null);

  React.useEffect(()=>{
    const a = audioRef.current; if(!a) return;
    const onEnd  = ()=>setIdx(p=>(p+1)%TRACKS.length);
    const onTime = ()=>setCur(a.currentTime||0);
    const onMeta = ()=>setDur(a.duration||0);
    a.addEventListener('ended', onEnd);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onMeta);
    return ()=>{ a.removeEventListener('ended',onEnd); a.removeEventListener('timeupdate',onTime); a.removeEventListener('loadedmetadata',onMeta); };
  },[]);

  React.useEffect(()=>{ const a=audioRef.current; if(!a) return; a.load(); setCur(0); if(playing) a.play().catch(()=>{}); },[idx]);
  React.useEffect(()=>{ const a=audioRef.current; if(!a) return; if(playing){ a.play().catch(()=>setPlaying(false)); } else { a.pause(); } },[playing]);
  React.useEffect(()=>{ const a=audioRef.current; if(!a) return; a.volume=vol; a.muted=muted; },[vol,muted]);

  /* No auto-start: playback only begins when the user hits play. */

  const seekTo = (e)=>{ const a=audioRef.current; if(!a||!dur) return; const r=e.currentTarget.getBoundingClientRect(); let x=(e.clientX-r.left)/r.width; x=Math.max(0,Math.min(1,x)); a.currentTime=x*dur; setCur(a.currentTime); };
  const pick = (i)=>{ setIdx(i); setPlaying(true); window.__click?.(); };

  const t = TRACKS[idx];
  const pct = dur ? (cur/dur*100) : 0;

  return (
    <div className={`mp ${open?'is-open':''}`} data-playing={playing}>
      <audio ref={audioRef} src={t.src} preload="metadata"/>

      <div className="mp__panel" role="region" aria-label="Music player" aria-hidden={!open}>
        <div className="mp__hd">
          <span className="mp__hdlab"><span className="mp__eq"><i/><i/><i/></span>NOW PLAYING · {idx+1}/{TRACKS.length}</span>
          <button className="mp__x" onClick={()=>{ setOpen(false); window.__click?.(); }} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>

        <div className="mp__now">
          <div className="mp__cover"><span className="mp__eq mp__eq--cover"><i/><i/><i/><i/></span></div>
          <div className="mp__nowtxt">
            <div className="mp__title">{t.title}</div>
            <div className="mp__artist">{ARTIST}</div>
          </div>
        </div>

        <div className="mp__seek" dir="ltr">
          <div className="mp__bar" onClick={seekTo}>
            <div className="mp__fill" style={{width:pct+'%'}}/>
            <span className="mp__knob" style={{left:pct+'%'}}/>
          </div>
          <div className="mp__time"><span>{fmtTime(cur)}</span><span>{fmtTime(dur)}</span></div>
        </div>

        <div className="mp__ctrls">
          <button className="mp__btn" onClick={()=>{ setIdx(p=>(p-1+TRACKS.length)%TRACKS.length); window.__click?.(); }} aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 6h2v12H7zM20 6v12L9.5 12z"/></svg>
          </button>
          <button className="mp__pp" onClick={()=>{ setPlaying(p=>!p); window.__click?.(); }} aria-label={playing?'Pause':'Play'}>
            {playing
              ? <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1.2"/><rect x="13.5" y="5" width="4" height="14" rx="1.2"/></svg>
              : <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>}
          </button>
          <button className="mp__btn" onClick={()=>{ setIdx(p=>(p+1)%TRACKS.length); window.__click?.(); }} aria-label="Next">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15 6h2v12h-2zM4 6v12l10.5-6z"/></svg>
          </button>
          <div className="mp__vol">
            <button className="mp__btn" onClick={()=>{ setMuted(m=>!m); window.__click?.(); }} aria-label={muted?'Unmute':'Mute'}>
              {(muted||vol===0)
                ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M18.07 5.93a9 9 0 0 1 0 12.14"/></svg>}
            </button>
            <input className="mp__volbar" type="range" min="0" max="1" step="0.02" value={muted?0:vol}
              onChange={(e)=>{ const v=parseFloat(e.target.value); setVol(v); setMuted(v===0); }} aria-label="Volume"/>
          </div>
        </div>

        <div className="mp__list">
          {TRACKS.map((tr,i)=>(
            <button key={i} className={`mp__row ${i===idx?'on':''}`} onClick={()=>pick(i)}>
              <span className="mp__num">{String(i+1).padStart(2,'0')}</span>
              <span className="mp__rowtitle">{tr.title}</span>
              {i===idx
                ? <span className="mp__eq mp__eq--row" aria-hidden="true"><i/><i/><i/></span>
                : <span className="mp__rowplay" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>}
            </button>
          ))}
        </div>
      </div>

      <button className="mp__fab" onClick={()=>{ setOpen(o=>!o); window.__click?.(); }} aria-label="Music player" aria-expanded={open}>
        <span className="mp__eq mp__eq--fab" aria-hidden="true"><i/><i/><i/><i/></span>
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App/>);
