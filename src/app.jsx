const { useState, useEffect } = React;
/* YT_URL and CHANNELS are declared in sections.jsx (loaded first) and shared
   via global script scope — do not redeclare them here. */

function hexToRgba(hex,a){ const h=hex.replace('#',''); const n=parseInt(h.length===3?h.split('').map(c=>c+c).join(''):h,16); return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`; }
function shade(hex,p){ const h=hex.replace('#',''); const n=parseInt(h.length===3?h.split('').map(c=>c+c).join(''):h,16); let r=(n>>16)&255,g=(n>>8)&255,b=n&255; const a=Math.round(2.55*p); r=Math.max(0,Math.min(255,r+a)); g=Math.max(0,Math.min(255,g+a)); b=Math.max(0,Math.min(255,b+a)); return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1); }

function App(){
  const [tw,setTw]=useState(window.TWEAKS_DEFAULT);
  const [panel,setPanel]=useState(false);
  const [isLive,setLive]=useState(false);

  const set=(k,v)=>setTw(p=>({...p,[k]:v}));

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

  useEffect(()=>{
    let dead=false;
    const ping=async()=>{ try{ const r=await fetch('/api/live',{cache:'no-store'}); if(!r.ok)return; const d=await r.json(); if(!dead && typeof d.isLive==='boolean') setLive(d.isLive);}catch(_){} };
    ping(); const id=setInterval(ping,60000); return ()=>{dead=true;clearInterval(id);};
  },[]);

  useEffect(()=>{ setTimeout(()=>window.__reveal?.(),80); },[tw.lang]);

  const t=I18N[tw.lang]||I18N.en;
  return (
    <LangContext.Provider value={{lang:tw.lang,t}}>
      <Nav isLive={isLive} lang={tw.lang} setLang={v=>set('lang',v)} onCustomize={()=>setPanel(o=>!o)}/>
      <Hero isLive={isLive}/>
      <Channels/>
      <About/>
      <Community/>
      <Footer/>
      <TweaksPanel tw={tw} set={set} open={panel} onClose={()=>setPanel(false)}/>
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
          <a className="livepill" data-live={isLive} href={YT_URL} target="_blank" rel="noopener noreferrer"
             onMouseEnter={()=>window.__hover?.()}>
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

ReactDOM.createRoot(document.getElementById('app')).render(<App/>);
