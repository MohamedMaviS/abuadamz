function TweaksPanel({ tw, set, open, onClose }) {
  if (!open) return null;
  const { t } = React.useContext(LangContext);
  const themes = [
    { k:'dynasty', c:'#e9b949', bg:'linear-gradient(135deg,#0a0703,#1b1208)' },
    { k:'royal',   c:'#ffcf66', bg:'linear-gradient(135deg,#0c0805,#23160a)' },
    { k:'onyx',    c:'#d9c79a', bg:'linear-gradient(135deg,#08080a,#16161c)' },
    { k:'light',   c:'#a9781f', bg:'linear-gradient(135deg,#efe6d2,#dccfb1)' },
  ];
  const accents = ['#e9b949','#f5c451','#ffd86b','#ffcf66','#d9a441','#c8912b','#b9822a','#f0e0b0','#d9c79a','#e7e7ea'];
  return (
    <div className="tw">
      <div className="tw__hd"><span>{t.twTitle}</span><button className="tw__x" onClick={onClose} aria-label="Close">✕</button></div>
      <div className="tw__bd">
        <div className="tw__row">
          <span className="tw__lab">{t.twLang}</span>
          <div className="seg">
            <button className={tw.lang==='en'?'on':''} onClick={()=>set('lang','en')}>English</button>
            <button className={tw.lang==='ar'?'on':''} onClick={()=>set('lang','ar')}>عربي</button>
          </div>
        </div>
        <div className="tw__row">
          <span className="tw__lab">{t.twTheme}</span>
          <div className="themes">
            {themes.map(th=>(
              <button key={th.k} className={tw.theme===th.k?'on':''}
                onClick={()=>{ set('theme',th.k); set('accent',th.c); }}>
                <i style={{background:th.bg,boxShadow:`inset 0 0 0 1px ${th.c}66`}}></i>{th.k.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="tw__row">
          <span className="tw__lab">{t.twAccent}</span>
          <div className="sw">
            {accents.map(a=>(
              <button key={a} className={tw.accent===a?'on':''} style={{background:a}}
                onClick={()=>set('accent',a)} aria-label={a}/>
            ))}
          </div>
        </div>
        <div className="tw__row">
          <span className="tw__lab">{t.twFx}</span>
          <div className="seg">
            {['low','normal','high'].map(f=>(
              <button key={f} className={tw.fx===f?'on':''} onClick={()=>set('fx',f)}>
                {f==='low'?'Low':f==='normal'?'Mid':'High'}
              </button>
            ))}
          </div>
        </div>
        <div className="tw__row">
          <span className="tw__lab">{t.twSound}</span>
          <div className="seg">
            <button className={tw.sound?'on':''} onClick={()=>set('sound',true)}>On</button>
            <button className={!tw.sound?'on':''} onClick={()=>set('sound',false)}>Off</button>
          </div>
        </div>
      </div>
    </div>
  );
}
window.TweaksPanel = TweaksPanel;
