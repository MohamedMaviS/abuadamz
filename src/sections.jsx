const { useContext } = React;

const KICK_USER = 'abu_adamz';
const CHANNELS = [
  { key:'kick',      name:'KICK',      handle:'kick.com/abu_adamz',   url:'https://kick.com/abu_adamz',                                  color:'#53fc18', icon:'Kick' },
  { key:'youtube',   name:'YOUTUBE',   handle:'@ABU_ADAMZ',           url:'https://www.youtube.com/@ABU_ADAMZ',                          color:'#ff0033', icon:'YouTube' },
  { key:'tiktok',    name:'TIKTOK',    handle:'@ABUADAMZ',            url:'https://www.tiktok.com/@ABUADAMZ',                            color:'#25f4ee', icon:'TikTok' },
  { key:'instagram', name:'INSTAGRAM', handle:'@ABU_ADAMZ1',          url:'https://www.instagram.com/ABU_ADAMZ1',                        color:'#e1306c', icon:'Instagram' },
  { key:'x',         name:'X',         handle:'@abu_adaamz',          url:'https://x.com/abu_adaamz',                                    color:'#ffffff', icon:'X' },
  { key:'discord',   name:'DISCORD',   handle:'discord.gg/yAjdhappZQ',url:'https://discord.com/invite/yAjdhappZQ',                       color:'#5865f2', icon:'Discord' },
  { key:'whatsapp',  name:'WHATSAPP',  handle:'Official channel',     url:'https://www.whatsapp.com/channel/0029Vb6dID43AzNXS9Dx4X06',   color:'#25d366', icon:'WhatsApp' },
];

const LOGO_FALLBACK = "data:image/svg+xml;utf8," + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#fce9a8'/><stop offset='.55' stop-color='#e9b949'/><stop offset='1' stop-color='#b9822a'/></linearGradient><radialGradient id='b' cx='.5' cy='.42' r='.62'><stop offset='0' stop-color='#1b1208'/><stop offset='1' stop-color='#0a0703'/></radialGradient></defs><rect width='600' height='600' fill='url(#b)'/><path d='M150 230 L210 290 L300 170 L390 290 L450 230 L420 410 L180 410 Z' fill='url(#g)' opacity='.85'/><text x='50%' y='62%' font-family='Georgia,serif' font-size='150' font-weight='900' fill='url(#g)' text-anchor='middle' dominant-baseline='middle'>AA</text></svg>"
);
function Logo({ className, lazy }) {
  return <img src="assets/logo.webp" alt="ABU ADAMZ" className={className}
    decoding="async" loading={lazy ? 'lazy' : 'eager'}
    onError={(e)=>{ const s=e.currentTarget;
      if(/\.webp$/.test(s.src)) s.src='assets/logo.jpg';
      else if(s.src.indexOf('data:')!==0) s.src=LOGO_FALLBACK; }} />;
}

function SecHead({ tag, icon, children }) {
  const IC = Icon[icon] || Icon.Star;
  return (
    <div className="sec__head">
      <div className="tag rv"><span className="tag__star"><IC/></span>{tag}</div>
      <h2 className="h-sec rv" style={{transitionDelay:'.08s'}}>{children}</h2>
    </div>
  );
}

/* rotating hero line: phrases fade out / in on a loop */
function RotatingLine() {
  const { t } = useContext(LangContext);
  const items = t.heroRotate || [];
  const [idx, setIdx] = React.useState(0);
  const [show, setShow] = React.useState(true);
  React.useEffect(() => {
    setIdx(0); setShow(true);
    if (items.length < 2) return;
    let alive = true;
    const id = setInterval(() => {
      setShow(false);
      setTimeout(() => { if (alive) { setIdx(p => (p + 1) % items.length); setShow(true); } }, 440);
    }, 3000);
    return () => { alive = false; clearInterval(id); };
  }, [t]);
  return (
    <div className="hero__rotate rv" style={{transitionDelay:'.18s'}}>
      <span className={`hero__rotate-i ${show ? 'show' : ''}`}>{items[idx]}</span>
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero({ isLive }) {
  const { t } = useContext(LangContext);
  const KICK = `https://kick.com/${KICK_USER}`;
  return (
    <header className="hero">
      <div className="app-pad hero__in">
        <div className="hero__crest rv rv-s" data-tilt="8">
          <span className="crest__rays" aria-hidden="true"></span>
          <span className="crest__halo" aria-hidden="true"></span>
          <div className="crest__frame">
            <Logo/>
            <span className="crest__sheen" aria-hidden="true"></span>
            <span className="crest__cn crest__cn--tl" aria-hidden="true"></span>
            <span className="crest__cn crest__cn--tr" aria-hidden="true"></span>
            <span className="crest__cn crest__cn--bl" aria-hidden="true"></span>
            <span className="crest__cn crest__cn--br" aria-hidden="true"></span>
          </div>
          <a className="crest__live" data-live={isLive} href={KICK} target="_blank" rel="noopener noreferrer"
             data-kpv onMouseEnter={()=>window.__hover?.()}>
            <span className="dot"></span><span>{isLive ? t.liveTag : t.offTag}</span>
          </a>
        </div>

        <div className="hero__copy">
          <div className="tag hero__kick rv"><span className="tag__star"><Icon.Crown/></span>{t.heroKicker}</div>
          <h1 className="hero__name rv" style={{transitionDelay:'.05s'}}>{t.heroName}</h1>
          <div className="hero__sub rv" style={{transitionDelay:'.12s'}}>{t.heroSub}</div>
          <RotatingLine/>
          <div className="hero__cta rv" style={{transitionDelay:'.24s'}}>
            <a className="btn btn-primary" href={KICK} target="_blank" rel="noopener noreferrer"
               data-kpv onMouseEnter={()=>window.__hover?.()} onClick={()=>window.__click?.()}>
              <Icon.Kick/><span>{t.heroWatch}</span>
            </a>
            <a className="btn btn-ghost" href="#channels" onMouseEnter={()=>window.__hover?.()} onClick={()=>window.__click?.()}>
              <Icon.Arrow/><span>{t.heroChannels}</span>
            </a>
          </div>
        </div>
      </div>
      <a className="scrollcue" href="#duty" aria-label={t.scroll}
         onMouseEnter={()=>window.__hover?.()} onClick={()=>window.__click?.()}>
        <span className="scrollcue__lab">{t.scroll}</span>
        <span className="scrollcue__mouse"><i></i></span>
        <span className="scrollcue__chev"></span>
      </a>
    </header>
  );
}

/* ---------------- ON DUTY (cinematic city band) ---------------- */
function OnDuty() {
  const { t } = useContext(LangContext);
  return (
    <section className="sec duty" id="duty">
      <div className="app-pad">
        <SecHead tag={t.dutyTag} icon="Shield">{t.dutyTitle}</SecHead>
        <div className="duty__frame rv rv-s" data-tilt="4">
          <img src="assets/city.webp" alt={t.dutyCaption} loading="lazy" decoding="async"
               onError={(e)=>{ const s=e.currentTarget; if(/\.webp$/.test(s.src)) s.src='assets/city.jpg'; }}/>
          <span className="duty__grad" aria-hidden="true"></span>
          <span className="duty__cn duty__cn--tl" aria-hidden="true"></span>
          <span className="duty__cn duty__cn--br" aria-hidden="true"></span>
          <div className="duty__cap"><span className="duty__badge"><Icon.Star/></span>{t.dutyCaption}</div>
        </div>
        <p className="lead duty__body rv" style={{transitionDelay:'.1s'}}>{t.dutyBody}</p>
      </div>
    </section>
  );
}

/* ---------------- LIVE NOW (Kick status, embeds the live stream) ---------------- */
function LiveNow({ data, refreshing, onRefresh }) {
  const { t } = useContext(LangContext);
  const KICK = `https://kick.com/${KICK_USER}`;
  const k = data && data.kick;
  const live = !!(k && k.live);
  const fmtNum = (n)=> (typeof n==='number') ? n.toLocaleString('en-US') : null;
  const title = (k && k.title) ? k.title : '';
  const viewers = k ? fmtNum(k.viewers) : null;
  const category = (k && k.category) ? k.category : '';

  return (
    <section className="sec live" id="live">
      <div className="app-pad">
        <div className={`liveband rv rv-s ${live?'is-live':(data?'is-off':'is-load')}`}>
          <span className="liveband__bg" aria-hidden="true"></span>

          <div className="liveband__top">
            <span className={`livestat ${live?'on':''}`}>
              <span className="livestat__dots"><i></i><i></i></span>
              {live ? t.liveNowLab : t.offlineLab}
            </span>
            <a className="liveband__url" href={KICK} target="_blank" rel="noopener noreferrer"
               onMouseEnter={()=>window.__hover?.()}>kick.com/{KICK_USER}</a>
          </div>

          {live ? (
            <div className="liveband__grid">
              <div className="livestage">
                <iframe src={`https://player.kick.com/${KICK_USER}?muted=true&autoplay=true`}
                  title="ABU ADAMZ live on Kick" allow="autoplay; fullscreen; picture-in-picture" loading="lazy"/>
                <span className="livestage__badge"><span className="dot2"></span>LIVE</span>
                {viewers && <span className="livestage__vc"><Icon.Eye/>{viewers}</span>}
              </div>
              <div className="liveband__info">
                <div className="liveband__lab"><span className="livedot"></span>{t.liveWatching}</div>
                <h3 className="liveband__title">{title || KICK_USER}</h3>
                <div className="liveband__meta">
                  {viewers && <span className="livepill2"><Icon.Eye/><b>{viewers}</b><span>{t.viewersLab}</span></span>}
                  {category && <span className="livepill2"><Icon.Monitor/><span>{category}</span></span>}
                </div>
                <a className="btn btn-primary liveband__cta" href={KICK} target="_blank" rel="noopener noreferrer"
                   data-kpv onMouseEnter={()=>window.__hover?.()} onClick={()=>window.__click?.()}>
                  <Icon.Kick/><span>{t.heroWatch}</span><Icon.Ext/>
                </a>
              </div>
            </div>
          ) : (
            <div className="liveband__off">
              <span className="liveband__offic">{data ? <Icon.Shield/> : <Icon.Refresh/>}</span>
              <h3 className="liveband__title liveband__title--off">{data ? t.liveOfflineTitle : t.liveLoading}</h3>
              {data && <p className="liveband__sub">{t.liveOfflineSub}</p>}
              {data &&
                <a className="btn btn-primary liveband__cta" href={KICK} target="_blank" rel="noopener noreferrer"
                   data-kpv onMouseEnter={()=>window.__hover?.()} onClick={()=>window.__click?.()}>
                  <Icon.Kick/><span>{t.heroWatch}</span><Icon.Ext/>
                </a>}
            </div>
          )}

          <div className="liveband__foot">
            <span className="liveband__auto"><span className={`liveband__pulse ${live?'on':''}`}></span>{t.autoRefresh}</span>
            <button className={`refreshbtn ${refreshing?'spin':''}`} onClick={()=>{ onRefresh&&onRefresh(); window.__click?.(); }}
               onMouseEnter={()=>window.__hover?.()} aria-label={t.refreshNow}>
              <Icon.Refresh/><span>{t.refreshNow}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CHANNEL HUB ---------------- */
function Channels() {
  const { t } = useContext(LangContext);
  return (
    <section className="sec" id="channels">
      <div className="app-pad">
        <SecHead tag={t.navChannels} icon="Star">
          <span className="rv">{t.chTitleA}</span> <span style={{color:'var(--ac)'}} className="rv">{t.chTitleB}</span>
        </SecHead>
        <p className="lead rv" style={{marginBottom:'42px'}}>{t.chSub}</p>
        <div className="hub">
          {CHANNELS.map((c,i)=>{
            const IC = Icon[c.icon];
            const kick = c.key==='kick';
            return (
              <a key={c.key} className="plaque rv" href={c.url} target="_blank" rel="noopener noreferrer"
                 data-tilt="6" style={{'--pc':c.color, transitionDelay:`${i*0.05}s`}}
                 {...(kick?{'data-kpv':''}:{})}
                 onMouseEnter={()=>window.__hover?.()} onClick={()=>window.__click?.()}>
                <span className="plaque__tok"><IC/></span>
                <span className="plaque__mid">
                  <span className="plaque__name">{c.name}</span>
                  <span className="plaque__handle">{c.handle}</span>
                </span>
                <span className="plaque__act">
                  <span className="plaque__act-txt">{t.act[c.key]}</span>
                  <span className="plaque__arrow"><Icon.Arrow/></span>
                </span>
                <span className="plaque__edge" aria-hidden="true"></span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- ABOUT / THE COMMANDER ---------------- */
function About() {
  const { t } = useContext(LangContext);
  const mq = [...t.marquee, ...t.marquee];
  return (
    <section className="sec" id="about">
      <div className="app-pad about__grid">
        <div className="about__art rv rv-s" data-tilt="7">
          <span className="about__halo" aria-hidden="true"></span>
          <div className="about__frame"><Logo lazy/></div>
        </div>
        <div className="about__copy">
          <div className="tag rv"><span className="tag__star"><Icon.Shield/></span>{t.aboutTag}</div>
          <div className="about__title rv" style={{transitionDelay:'.06s'}}>{t.aboutTitle}</div>
          <p className="lead rv" style={{transitionDelay:'.12s'}}>{t.aboutBody}</p>
          <div className="creds rv" style={{transitionDelay:'.18s'}}>
            {t.creds.map((c,i)=>(
              <div className="cred" key={i}>
                <div className="cred__v">{c.v}</div>
                <div className="cred__l">{c.l}</div>
              </div>
            ))}
          </div>
          <div className="tags rv" style={{transitionDelay:'.24s'}}>
            {t.tags.map(x=> <span key={x}>{x}</span>)}
          </div>
        </div>
      </div>
      <div className="app-pad">
        <div className="mq">
          <div className="mq__track">
            <i>{mq.map((w,k)=><React.Fragment key={k}>{w}<b><Icon.Star/></b></React.Fragment>)}</i>
            <i aria-hidden="true">{mq.map((w,k)=><React.Fragment key={'b'+k}>{w}<b><Icon.Star/></b></React.Fragment>)}</i>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- COMMUNITY ---------------- */
function Community() {
  const { t } = useContext(LangContext);
  const D = CHANNELS.find(c=>c.key==='discord');
  const W = CHANNELS.find(c=>c.key==='whatsapp');
  const en = t.navAbout==='The Commander';
  return (
    <section className="sec" id="community">
      <div className="app-pad">
        <SecHead tag={t.commTag} icon="Crown">{t.commTitle}</SecHead>
        <p className="lead rv" style={{marginBottom:'42px'}}>{t.commBody}</p>
        <div className="comm__grid">
          <div className="panel rv rv-l" data-tilt="6">
            <span className="panel__ic"><Icon.Discord/></span>
            <h3>Discord</h3>
            <p>{en?'Real-time chat, go-live pings, clips and giveaways with the squad.':'شات لايف، تنبيهات أول ما البث يبدأ، كليبات وجوايز مع العيلة.'}</p>
            <a className="btn btn-primary panel__cta" href={D.url} target="_blank" rel="noopener noreferrer"
               onMouseEnter={()=>window.__hover?.()} onClick={()=>window.__click?.()}>
              <Icon.Discord/><span>{t.discordCta}</span>
            </a>
          </div>
          <div className="panel rv rv-r" data-tilt="6">
            <span className="panel__ic"><Icon.WhatsApp/></span>
            <h3>WhatsApp</h3>
            <p>{en?'Follow the official channel so you never miss a go-live.':'تابِع القناة الرسمية علشان عمرك ما تفوّت لايف.'}</p>
            <a className="btn btn-primary panel__cta" href={W.url} target="_blank" rel="noopener noreferrer"
               onMouseEnter={()=>window.__hover?.()} onClick={()=>window.__click?.()}>
              <Icon.WhatsApp/><span>{t.whatsappCta}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  const { t } = useContext(LangContext);
  const top = (e)=>{ e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}); };
  return (
    <footer className="footer">
      <div className="footer__ghost" aria-hidden="true">ABU ADAMZ</div>
      <div className="app-pad footer__in">
        <div className="footer__tag rv">{t.footTagline}</div>
        <div className="footer__soc rv" style={{transitionDelay:'.08s'}}>
          {CHANNELS.map(c=>{ const IC=Icon[c.icon]; return (
            <a key={c.key} href={c.url} target="_blank" rel="noopener noreferrer" aria-label={c.name}
               onMouseEnter={()=>window.__hover?.()}><IC/></a>
          );})}
        </div>
        <a className="credit rv" href="https://mohamedmavis.com/" target="_blank" rel="noopener noreferrer"
           style={{transitionDelay:'.14s'}} onMouseEnter={()=>window.__hover?.()} aria-label="MaviS, mohamedmavis.com">
          <span className="credit__mk"><Icon.Crown/></span>
          <span className="credit__txt">
            <b>MaviS</b>
            <small>mohamedmavis.com</small>
          </span>
          <span className="credit__go"><Icon.Arrow/></span>
        </a>
        <div className="footer__bottom">
          <span>{t.rights}</span>
          <a href="#top" onClick={top} onMouseEnter={()=>window.__hover?.()}>{t.backTop} ↑</a>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Logo, Hero, OnDuty, LiveNow, Channels, About, Community, Footer });
