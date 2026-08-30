// i18n — ABU ADAMZ (EN default, AR toggle)
const I18N = {
  en: {
    dir:'ltr',
    navAbout:'The Commander', navChannels:'Channels', navCommunity:'Community',
    watchLive:'Watch Live', live:'LIVE NOW', offline:'OFFLINE', liveTag:'LIVE', offTag:'OFFLINE',

    heroKicker:'STREAMER · POLICE RP COMMANDER · GTA',
    heroName:'ABU ADAMZ',
    heroSub:'CHIEF OF POLICE · GTA RP',
    heroTagline:'Veteran on the scene, live on Kick. Role-playing since 2019, and currently Chief of Police. Long patrols, real authority, and a community that rides every night.',
    heroWatch:'Watch on Kick',
    heroChannels:'All Channels',
    heroRotate:[
      'Veteran on the scene · live on Kick',
      'Role-playing since 2019',
      'Currently Chief of Police',
      'Long patrols · real authority',
      'A community that rides every night',
    ],
    scroll:'SCROLL',

    dutyTag:'ON DUTY',
    dutyTitle:'LEADING THE PRECINCT',
    dutyBody:'Front and center with the whole department. Abu Adamz runs the precinct, leading every briefing, every patrol, and every call on the streets.',
    dutyCaption:'POLICE HQ · ON PATROL',

    liveTag:'STREAM STATUS',
    liveNowLab:'LIVE NOW', offlineLab:'OFFLINE',
    liveOfflineTitle:'Off Duty Right Now',
    liveOfflineSub:'The chief is off the streets for now. Follow on Kick to catch the next patrol the moment it goes live.',
    liveWatching:'WATCHING NOW',
    viewersLab:'viewers',
    autoRefresh:'Live, auto-synced every 60s',
    refreshNow:'Sync now',
    liveLoading:'Syncing with Kick...',
    liveUnknownLab:'STATUS DELAYED',
    liveUnknownTitle:'Keeping the Last Known Status',
    liveUnknownSub:'Kick did not answer in time. The last confirmed status is kept and another check will run automatically.',
    statusStale:'Kick is delayed · last confirmed status kept',

    chTitleA:'EVERY CHANNEL.',
    chTitleB:'ONE COMMAND.',
    chSub:'Pick your platform. The patrol never ends.',
    act:{ kick:'Watch live', youtube:'Subscribe', tiktok:'Follow', instagram:'Follow', x:'Follow', discord:'Join server', snapchat:'Add', whatsapp:'Join channel' },

    aboutTag:'WHO IS',
    aboutTitle:'ABU ADAMZ',
    aboutBody:'Mohamed Ahmed, known to everyone as Abu Adam. A veteran of the scene at 45, gaming has been his life for years. He has been deep in police role-play since 2019, and today he runs the streets as Chief of Police. Long patrols, real authority, and a community that rides with him every night.',
    creds:[
      { v:'45',    l:'YEARS OLD' },
      { v:'2019',  l:'ON PATROL SINCE' },
      { v:'CHIEF', l:'OF POLICE' },
      { v:'KICK',  l:'LIVE ON' },
    ],
    tags:['POLICE RP','GTA','CHIEF OF POLICE','ROLE-PLAY','VETERAN','SINCE 2019'],
    marquee:['ABU ADAMZ','POLICE CHIEF','ON PATROL','SINCE 2019','GTA RP','VETERAN','KICK'],

    commTag:'THE PRECINCT',
    commTitle:'JOIN THE COMMUNITY',
    commBody:'Hop in the Discord and follow the WhatsApp channel for go-live alerts, clips, and everything Abu Adamz.',
    discordCta:'Join Discord',
    whatsappCta:'WhatsApp Channel',

    footTagline:'See you on the next patrol.',
    rights:'© 2026 ABU ADAMZ · All rights reserved',
    backTop:'Back to top',

    twTitle:'CUSTOMIZE', twLang:'LANGUAGE', twTheme:'THEME', twAccent:'ACCENT', twFx:'FX LEVEL', twSound:'HOVER SFX',
  },
  ar: {
    dir:'rtl',
    navAbout:'القائد', navChannels:'القنوات', navCommunity:'العيلة',
    watchLive:'شوف اللايف', live:'لايف دلوقتي', offline:'مش لايف', liveTag:'لايف', offTag:'أوفلاين',

    heroKicker:'ستريمر · قائد شرطة رول بلاي · جاتا',
    heroName:'ABU ADAMZ',
    heroSub:'قائد الشرطة · جاتا رول بلاي',
    heroTagline:'راجل محترف في المجال، لايف على Kick. بيلعب رول بلاي من 2019، ودلوقتي قائد الشرطة وماسك القطاع كله. باترولات طويلة، هيبة حقيقية، وعيلة واقفة معاه كل ليلة.',
    heroWatch:'شوفني على Kick',
    heroChannels:'كل القنوات',
    heroRotate:[
      'راجل محترف · لايف على Kick',
      'بيلعب رول بلاي من 2019',
      'دلوقتي قائد الشرطة',
      'باترولات طويلة · هيبة حقيقية',
      'وعيلة واقفة معاه كل ليلة',
    ],
    scroll:'انزل تحت',

    dutyTag:'في الخدمة',
    dutyTitle:'قائد القسم',
    dutyBody:'قدّام الطابور مع القسم كله. ابو ادم قائد الشرطة وماسك القطاع كله، بيقود كل بريفينج وكل باترول وكل بلاغ في الشارع.',
    dutyCaption:'مقر الشرطة · في الباترول',

    liveTag:'حالة البث',
    liveNowLab:'لايف دلوقتي', offlineLab:'مش لايف',
    liveOfflineTitle:'خارج الخدمة دلوقتي',
    liveOfflineSub:'القائد خارج الخدمة حالياً. تابِعه على Kick علشان تلحق الباترول الجاي أول ما يبدأ.',
    liveWatching:'بيتفرّجوا دلوقتي',
    viewersLab:'مشاهد',
    autoRefresh:'لايف، بيزامن أوتوماتيك كل 60 ثانية',
    refreshNow:'زامن دلوقتي',
    liveLoading:'بيزامن مع Kick...',
    liveUnknownLab:'التحديث متأخر',
    liveUnknownTitle:'محتفظين بآخر حالة مؤكدة',
    liveUnknownSub:'Kick مردّش في الوقت المحدد. آخر حالة مؤكدة محفوظة وهتتراجع تاني أوتوماتيك.',
    statusStale:'Kick متأخر · آخر حالة مؤكدة محفوظة',

    chTitleA:'كل القنوات،',
    chTitleB:'تحت أمر واحد.',
    chSub:'اختار منصتك، والباترول مبيوقفش.',
    act:{ kick:'شوف اللايف', youtube:'اشترك', tiktok:'تابِع', instagram:'تابِع', x:'تابِع', discord:'ادخل السيرفر', snapchat:'أضِفه', whatsapp:'ادخل القناة' },

    aboutTag:'مين هو',
    aboutTitle:'ابو ادم',
    aboutBody:'محمد أحمد، اللي الكل يعرفه باسم ابو ادم. راجل محترم وابن 45 سنة، والجيمنج حياته من زمان. بيلعب رول بلاي الشرطة من 2019، ودلوقتي قائد الشرطة وماسك القطاع كله. باترولات طويلة، هيبة حقيقية، وعيلة واقفة جنبه كل ليلة.',
    creds:[
      { v:'45',     l:'سنة' },
      { v:'2019',   l:'في الخدمة من' },
      { v:'قائد',   l:'الشرطة' },
      { v:'كيك',    l:'لايف على' },
    ],
    tags:['شرطة رول بلاي','جاتا','قائد الشرطة','رول بلاي','محترف','من 2019'],
    marquee:['ابو ادم','قائد الشرطة','في الباترول','من 2019','جاتا رول بلاي','محترف','كيك'],

    commTag:'القسم',
    commTitle:'انضم لعيلة ابو ادم',
    commBody:'خُش سيرفر الديسكورد وتابِع قناة الواتساب علشان يوصلك كل لايف وكليب وأخبار ابو ادم أول بأول.',
    discordCta:'ادخل الديسكورد',
    whatsappCta:'تابِع على واتساب',

    footTagline:'نشوفكوا في الباترول الجاي.',
    rights:'© 2026 ابو ادم · كل الحقوق محفوظة',
    backTop:'ارجع فوق',

    twTitle:'تخصيص', twLang:'اللغة', twTheme:'الثيم', twAccent:'اللون', twFx:'المؤثرات', twSound:'الصوت',
  }
};
window.I18N = I18N;
const LangContext = React.createContext({ lang:'en', t:I18N.en });
window.LangContext = LangContext;
