// i18n — ABU ADAMZ (EN default, AR toggle)
const I18N = {
  en: {
    dir:'ltr',
    navAbout:'The Commander', navChannels:'Channels', navCommunity:'Community',
    watchLive:'Watch Live', live:'LIVE NOW', offline:'OFFLINE',

    heroKicker:'STREAMER · POLICE RP COMMANDER · GTA',
    heroName:'ABU ADAMZ',
    heroSub:'CHIEF OF POLICE · LAST CHANCE RP',
    heroTagline:'Veteran on the scene, live on Kick. Role-playing since 2019, and currently Chief of Police in Last Chance. Long patrols, real authority, and a community that rides every night.',
    heroWatch:'Watch on Kick',
    heroChannels:'All Channels',
    scroll:'SCROLL',

    dutyTag:'ON DUTY',
    dutyTitle:'LEADING THE PRECINCT',
    dutyBody:'Front and center with the whole department. Abu Adamz runs the precinct in Last Chance, leading every briefing, every patrol, and every call on the streets.',
    dutyCaption:'LAST CHANCE · POLICE HQ',

    chTitleA:'EVERY CHANNEL.',
    chTitleB:'ONE COMMAND.',
    chSub:'Pick your platform. The patrol never ends.',
    act:{ kick:'Watch live', youtube:'Subscribe', tiktok:'Follow', instagram:'Follow', x:'Follow', discord:'Join server', whatsapp:'Join channel' },

    aboutTag:'WHO IS',
    aboutTitle:'ABU ADAMZ',
    aboutBody:'Mohamed Ahmed, known to everyone as Abu Adam. A veteran of the scene at 45, gaming has been his life for years. He has been deep in police role-play since 2019, and today he runs the streets as Chief of Police in the city of Last Chance. Long patrols, real authority, and a community that rides with him every night.',
    creds:[
      { v:'45',          l:'YEARS OLD' },
      { v:'2019',        l:'ON PATROL SINCE' },
      { v:'CHIEF',       l:'OF POLICE' },
      { v:'LAST CHANCE', l:'RP CITY' },
    ],
    tags:['POLICE RP','GTA','LAST CHANCE','ROLE-PLAY','VETERAN','SINCE 2019'],
    marquee:['ABU ADAMZ','POLICE CHIEF','LAST CHANCE RP','SINCE 2019','GTA RP','VETERAN','KICK'],

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
    watchLive:'شوف اللايف', live:'لايف دلوقتي', offline:'مش لايف',

    heroKicker:'ستريمر · قائد شرطة رول بلاي · جاتا',
    heroName:'ABU ADAMZ',
    heroSub:'مدير الشرطة · لاست تشانس رول بلاي',
    heroTagline:'راجل محترف في المجال، لايف على Kick. بيلعب رول بلاي من 2019، ودلوقتي ماسك قطاع الشرطة في لاست تشانس. باترولات طويلة، هيبة حقيقية، وعيلة واقفة معاه كل ليلة.',
    heroWatch:'شوفني على Kick',
    heroChannels:'كل القنوات',
    scroll:'انزل تحت',

    dutyTag:'في الخدمة',
    dutyTitle:'قائد القسم',
    dutyBody:'قدّام الطابور مع القسم كله. ابو ادم ماسك قطاع الشرطة في لاست تشانس، بيقود كل بريفينج وكل باترول وكل بلاغ في الشارع.',
    dutyCaption:'لاست تشانس · مقر الشرطة',

    chTitleA:'كل القنوات،',
    chTitleB:'تحت أمر واحد.',
    chSub:'اختار منصتك، والباترول مبيوقفش.',
    act:{ kick:'شوف اللايف', youtube:'اشترك', tiktok:'تابِع', instagram:'تابِع', x:'تابِع', discord:'ادخل السيرفر', whatsapp:'ادخل القناة' },

    aboutTag:'مين هو',
    aboutTitle:'ابو ادم',
    aboutBody:'محمد أحمد، اللي الكل يعرفه باسم ابو ادم. راجل محترم وابن 45 سنة، والجيمنج حياته من زمان. بيلعب رول بلاي الشرطة من 2019، ودلوقتي ماسك قطاع الشرطة في مدينة لاست تشانس. باترولات طويلة، هيبة حقيقية، وعيلة واقفة جنبه كل ليلة.',
    creds:[
      { v:'45',          l:'سنة' },
      { v:'2019',        l:'في الخدمة من' },
      { v:'القائد',      l:'مدير الشرطة' },
      { v:'لاست تشانس',  l:'مدينة الرول بلاي' },
    ],
    tags:['شرطة رول بلاي','جاتا','لاست تشانس','رول بلاي','محترف','من 2019'],
    marquee:['ابو ادم','مدير الشرطة','لاست تشانس','من 2019','جاتا رول بلاي','محترف','كيك'],

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
