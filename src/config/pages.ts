import type { StorefrontBlockLike, StorefrontContentPageConfig } from '@fayz-ai/storefront'
import { social } from '../content/entities'
import { TEE_LOOKS } from '../content/tee'
import { DEFAULT_LANG, routeFor, type Lang, type PageKey } from '../i18n'
import { t, tk } from '../i18n/token'

// The site as documents: five pages, each a block list the SDK routes, renders
// and head-tags, at one English path. Copy is NOT baked per language here —
// blocks carry COPY tokens (i18n/token.ts) and resolve them to the visitor's
// language at render (useI18nProps). So this builds one tree, not three.
// Copy is written per audience: Experience for whoever wants to be in the
// room, Community for whoever wants to belong (and play), Partnerships for venues
// and brands, and the shirt page for whoever is ready to buy.

type Cta = { label: string; href: string }

interface PageCopy {
  ig: string
  yt: string
  mail: string
  home: {
    title: string
    accent: string
    subtitle: string
    primary: string
    showreel: string
    sessionsEyebrow: string
    sessionsTitle: string
    archive: string
    whyEyebrow: string
    whyTitle: string
    whyText: string
    join: string
    leavinEyebrow: string
    leavinTitle: string
    leavinText: string
    watchSets: string
    seePhotos: string
    noiseTitle: string
    noiseAccent: string
    noiseText: string
  }
  experience: {
    title: string
    eyebrow: string
    heroTitle: string
    heroAccent: string
    heroText: string
    seeArchive: string
    lrEyebrow: string
    lrTitle: string
    lrAccent: string
    lr: [string, string]
    lrAlt: string
    archiveEyebrow: string
    archiveTitle: string
    archiveAccent: string
    archiveText: string
    galleryTitle: string
    galleryAccent: string
    galleryText: string
    ctaEyebrow: string
    ctaTitle: string
    ctaAccent: string
    ctaText: string
  }
  video: {
    title: string
    eyebrow: string
    heroTitle: string
    heroAccent: string
  }
  community: {
    title: string
    heroTitle: string
    heroAccent: string
    heroText: string
    join: string
    play: string
    whyEyebrow: string
    whyTitle: string
    whyAccent: string
    why: [string, string]
    whyAlt: string
    crewText: string
    djEyebrow: string
    djTitle: string
    djAccent: string
    dj: [string, string]
    djAlt: string
    djCta: string
    djSubject: string
    ctaEyebrow: string
    ctaTitle: string
    ctaAccent: string
  }
  partnerships: {
    title: string
    eyebrow: string
    heroTitle: string
    heroAccent: string
    heroText: string
    talk: string
    subject: string
    seeCases: string
    statsNote: string
    getEyebrow: string
    getTitle: string
    getAccent: string
    casesEyebrow: string
    casesTitle: string
    casesAccent: string
    stepsEyebrow: string
    stepsTitle: string
    stepsAccent: string
    watchEyebrow: string
    watchTitle: string
    watchAccent: string
    archive: string
    fitEyebrow: string
    fitTitle: string
    fitAccent: string
    fitAlt: string
    waysEyebrow: string
    waysTitle: string
    waysAccent: string
    ctaEyebrow: string
    ctaTitle: string
    ctaAccent: string
    ctaText: string
    gets: { title: string; text: string }[]
    cases: { status: string; date: string; title: string; text: string; facts: string[]; imageAlt: string }[]
    steps: { title: string; text: string }[]
    fit: [string, string]
    ways: { title: string; text: string; points: [string, string] }[]
  }
  shirt: {
    title: string
    marquee: [string, string, string]
    videoEyebrow: string
    videoTitle: string
    videoAccent: string
    processEyebrow: string
    processTitle: string
    processAccent: string
    processAlts: [string, string, string]
  }
}

export const COPY: Record<Lang, PageCopy> = {
  en: {
    ig: 'Follow on Instagram',
    yt: 'Watch on YouTube',
    mail: 'Send us an email',
    home: {
      title: "Intimate Living Room Sessions.",
      accent: "Living Room",
      subtitle: "Music collective born in Barcelona, sharing our love for music",
      primary: "Explore sessions",
      showreel: "Watch showreel",
      sessionsEyebrow: "The archive",
      sessionsTitle: "Latest sessions",
      archive: "View all archive",
      whyEyebrow: "The community",
      whyTitle: "Why we dance",
      whyText: "We dance because music connects us beyond words. Because a beat can speak what words can’t. Because in that shared moment, heartbeats and basslines become one.",
      join: "Join the community",
      leavinEyebrow: "Airfryer Collective",
      leavinTitle: "Leavin’ the Room",
      leavinText: "From the living room to Bridge 48.",
      watchSets: "Watch the sets",
      seePhotos: "See the photos",
      noiseTitle: "Let’s make noise.",
      noiseAccent: "noise.",
      noiseText: "Get in touch.",
    },
    experience: {
      title: 'Experience',
      eyebrow: 'Experience',
      heroTitle: 'One room. One sound. People who care.',
      heroAccent: 'People who care.',
      heroText: 'Living Room Sessions are intimate nights in a flat: one DJ, a few dozen people, no phones in the air. When the room got too small we stepped out, but we always come back to it.',
      seeArchive: 'See the archive',
      lrEyebrow: 'Living Room Sessions',
      lrTitle: 'No stage. No VIP area.',
      lrAccent: 'No VIP area.',
      lr: [
        'The DJ plays at eye level, on the living-room table. Whoever dances is an arm’s length from whoever plays.',
        'Every session is filmed and goes up on YouTube. Not to go viral: to archive a scene that is happening right now.',
      ],
      lrAlt: 'A packed session in a living room',
      archiveEyebrow: 'The archive',
      archiveTitle: 'Every session, recorded.',
      archiveAccent: 'recorded.',
      archiveText: 'Browse by room or by artist, or just press play and find something new.',
      galleryTitle: 'The first time out of the house.',
      galleryAccent: 'out of the house.',
      galleryText: '24 May 2026. 150 people, 7 DJs, two rooms, sold out.',
      ctaEyebrow: 'What’s next',
      ctaTitle: 'Let’s make noise.',
      ctaAccent: 'noise.',
      ctaText: 'New sets, upcoming dates and what happens next, on Instagram.',
    },
    video: {
      title: 'Library',
      eyebrow: 'The library',
      heroTitle: 'Every set, recorded.',
      heroAccent: 'recorded.',
    },
    community: {
      title: 'Community',
      heroTitle: 'Some play. Some dance. Some just close their eyes.',
      heroAccent: 'close their eyes.',
      heroText: "We're music lovers. That's it. And everyone comes for the same reason.",
      join: 'Join in',
      play: 'I want to play',
      whyEyebrow: 'Why we dance',
      whyTitle: "Because a beat says what words can't.",
      whyAccent: "words can't.",
      why: [
        'We dance because music connects us beyond words. Because in that shared moment, heartbeats and basslines become one.',
        "It started with friends in a living room in Barcelona. Today 763 people have been on the floor, with 31 artists from 8 countries.",
      ],
      whyAlt: 'A full dancefloor at Bridge 48',
      crewText: 'Four people, three countries, one room.',
      djEyebrow: 'For DJs',
      djTitle: 'This is your lab.',
      djAccent: 'lab.',
      dj: [
        'No safe setlists, no expectations. Just you and the music you love, for a room that listens.',
        'We build sessions together. If you have a sound to share, send a recorded set and tell us a bit about you.',
      ],
      djAlt: 'The Lab Room booth at Bridge 48',
      djCta: 'Send my set',
      djSubject: 'I want to play a session',
      ctaEyebrow: 'Come in',
      ctaTitle: 'There’s room for you.',
      ctaAccent: 'for you.',
    },
    partnerships: {
      title: "Partnerships",
      eyebrow: "Cultural partnerships",
      heroTitle: "Bring a session to your space.",
      heroAccent: "your space.",
      heroText: "We make nights with venues that put music first. Your space, our community, and every set recorded.",
      talk: "Bring a session",
      subject: "Partnership with Airfryer",
      seeCases: "See past nights",
      statsNote: "No advertising. No promotion budget. Every person came because someone told them about it.",
      getEyebrow: "What you get",
      getTitle: "More than a night on the calendar.",
      getAccent: "on the calendar.",
      gets: [
        { title: "Content production", text: "High-end video and audio of every set. Assets that promote your venue and the artists." },
        { title: "Organic growth", text: "A loyal community that follows the music, not the hype. Real engagement, real people." },
        { title: "International reach", text: "Artists from 8 countries. A global sound in a local space." },
        { title: "Professionalism", text: "Serious about the music, serious about the execution. We handle the details." },
      ],
      casesEyebrow: "Proof",
      casesTitle: "We’ve done this twice. Both filled the room.",
      casesAccent: "filled the room.",
      cases: [
        { status: "Sold out", date: "May 2026", title: "Bridge 48", text: "Our first night out of the living room. 150 of our people bought tickets, with no advertising.", facts: ["150 tickets", "7 DJs", "2 rooms"], imageAlt: "A DJ playing to a packed crowd at Bridge 48" },
        { status: "Full capacity", date: "July 2026", title: "Espai Salvadiscos", text: "A vinyl association with thousands of members, normally members-only. They opened the doors for us.", facts: ["3 DJs", "Vinyl association", "Members-only space"], imageAlt: "A DJ playing among the vinyl shelves at Salvadiscos" },
      ],
      stepsEyebrow: "How it works",
      stepsTitle: "It starts with a conversation.",
      stepsAccent: "a conversation.",
      steps: [
        { title: "We talk", text: "We look for venues run by people on the same frequency: music lovers who built a space around it." },
        { title: "We make the night together", text: "Their name next to ours. Their crowd next to ours." },
        { title: "The music stays first", text: "The DJs stay free. The room stays a community, just a bigger one." },
        { title: "The night keeps working", text: "Each one becomes a series on YouTube and a few weeks of content." },
      ],
      watchEyebrow: "See for yourself",
      watchTitle: "What it looks like.",
      watchAccent: "looks like.",
      archive: "View all sessions",
      fitEyebrow: "Who it’s for",
      fitTitle: "Music over commerce.",
      fitAccent: "over commerce.",
      fit: ["We care about spaces that value music over commerce. Venues where the sound matters, where the community matters, where the energy in the room matters more than the number of people in it.", "If your space shares that philosophy, we’d love to bring a session."],
      fitAlt: "A DJ in the booth with the crowd clapping",
      waysEyebrow: "Ways to work together",
      waysTitle: "Three ways in.",
      waysAccent: "ways in.",
      ways: [
        { title: "Leavin’ the Room", text: "We make the night at your venue: line-up, community and recording.", points: ["Bridge 48: sold out", "Salvadiscos: full capacity"] },
        { title: "Living Room Session", text: "A session presented with your brand, at the usual intimate scale.", points: ["Full recording on YouTube", "Presence in the room and the archive"] },
        { title: "Collabs", text: "Brands, artists and photographers. We’re open to creative partnerships.", points: ["First collab: the shirt with Pri Amaral", "Original artwork, limited edition"] },
      ],
      ctaEyebrow: "Let’s talk",
      ctaTitle: "Press play.",
      ctaAccent: "play.",
      ctaText: "If this resonates, we’d love to bring a session to your space.",
    },
    shirt: {
      title: 'Viva los seres que bailan shirt',
      marquee: ['Viva los seres que bailan', 'Airfryer × Pri Amaral', 'One-off edition'],
      videoEyebrow: 'In motion',
      videoTitle: 'It was made for this.',
      videoAccent: 'for this.',
      processEyebrow: 'The process',
      processTitle: 'From canvas to cotton.',
      processAccent: 'cotton.',
      processAlts: ['Pri Amaral painting live at session #010', 'The print up close on black cotton', 'The shirt laid out next to a turntable'],
    },
  },
  es: {
    ig: 'Seguir en Instagram',
    yt: 'Ver en YouTube',
    mail: 'Escríbenos',
    home: {
      title: "Living Room Sessions íntimas.",
      accent: "Living Room",
      subtitle: "Colectivo de música nacido en Barcelona, compartiendo nuestro amor por la música",
      primary: "Explorar sesiones",
      showreel: "Ver el showreel",
      sessionsEyebrow: "El archivo",
      sessionsTitle: "Últimas sesiones",
      archive: "Ver todo el archivo",
      whyEyebrow: "La comunidad",
      whyTitle: "Por qué bailamos",
      whyText: "Bailamos porque la música nos conecta más allá de las palabras. Porque un beat dice lo que las palabras no pueden. Porque en ese momento compartido, latidos y bajos se vuelven uno.",
      join: "Únete a la comunidad",
      leavinEyebrow: "Airfryer Collective",
      leavinTitle: "Leavin’ the Room",
      leavinText: "Del salón a Bridge 48.",
      watchSets: "Ver los sets",
      seePhotos: "Ver las fotos",
      noiseTitle: "Hagamos ruido.",
      noiseAccent: "ruido.",
      noiseText: "Escríbenos.",
    },
    experience: {
      title: 'Experiencia',
      eyebrow: 'Experiencia',
      heroTitle: 'Una sala. Un sonido. Gente a la que le importa.',
      heroAccent: 'Gente a la que le importa.',
      heroText: 'Las Living Room Sessions son noches íntimas en un piso: un DJ, unas pocas decenas de personas, ningún móvil en alto. Cuando la sala se quedó pequeña salimos, pero siempre volvemos a ella.',
      seeArchive: 'Ver el archivo',
      lrEyebrow: 'Living Room Sessions',
      lrTitle: 'Sin escenario. Sin zona VIP.',
      lrAccent: 'Sin zona VIP.',
      lr: [
        'El DJ toca a la altura de los ojos, en la mesa del salón. Quien baila está a un brazo de quien toca.',
        'Cada sesión se graba en vídeo y se sube a YouTube. No para hacerse viral: para archivar una escena que está pasando ahora.',
      ],
      lrAlt: 'Una sesión llena en un salón',
      archiveEyebrow: 'El archivo',
      archiveTitle: 'Cada sesión, grabada.',
      archiveAccent: 'grabada.',
      archiveText: 'Explora por sala o por artista, o dale al play y descubre.',
      galleryTitle: 'La primera vez fuera de casa.',
      galleryAccent: 'fuera de casa.',
      galleryText: '24 de mayo de 2026. 150 personas, 7 DJs, dos salas, entradas agotadas.',
      ctaEyebrow: 'Lo que viene',
      ctaTitle: 'Hagamos ruido.',
      ctaAccent: 'ruido.',
      ctaText: 'Nuevos sets, próximas fechas y lo que viene, en Instagram.',
    },
    video: {
      title: 'Biblioteca',
      eyebrow: 'La biblioteca',
      heroTitle: 'Cada set, grabado.',
      heroAccent: 'grabado.',
    },
    community: {
      title: 'Comunidad',
      heroTitle: 'Unos tocan. Otros bailan. Otros solo cierran los ojos.',
      heroAccent: 'cierran los ojos.',
      heroText: 'Somos amantes de la música. Nada más. Y todos venimos por lo mismo.',
      join: 'Únete',
      play: 'Quiero tocar',
      whyEyebrow: 'Por qué bailamos',
      whyTitle: 'Porque un beat dice lo que las palabras no.',
      whyAccent: 'las palabras no.',
      why: [
        'Bailamos porque la música nos conecta más allá de las palabras. Porque en ese momento compartido, latido y línea de bajo son una sola cosa.',
        'Empezó con amigos en un salón de Barcelona. Hoy 763 personas han pasado por la pista, con 31 artistas de 8 países.',
      ],
      whyAlt: 'La pista llena en Bridge 48',
      crewText: 'Cuatro personas, tres países, una sala.',
      djEyebrow: 'Para DJs',
      djTitle: 'Esto es tu laboratorio.',
      djAccent: 'laboratorio.',
      dj: [
        'Sin setlist seguro, sin expectativas. Solo tú y la música que amas, para una sala que escucha.',
        'Montamos las sesiones juntos. Si tienes un sonido que compartir, mándanos un set grabado y cuéntanos un poco de ti.',
      ],
      djAlt: 'La cabina de la Lab Room en Bridge 48',
      djCta: 'Enviar mi set',
      djSubject: 'Quiero tocar en una sesión',
      ctaEyebrow: 'Entra',
      ctaTitle: 'En la sala hay sitio para ti.',
      ctaAccent: 'para ti.',
    },
    partnerships: {
      title: "Colaboraciones",
      eyebrow: "Colaboraciones culturales",
      heroTitle: "Lleva una sesión a tu espacio.",
      heroAccent: "tu espacio.",
      heroText: "Hacemos noches con salas que ponen la música primero. Tu espacio, nuestra comunidad y cada set grabado.",
      talk: "Llevar una sesión",
      subject: "Partnership with Airfryer",
      seeCases: "Ver noches anteriores",
      statsNote: "Sin publicidad. Sin presupuesto de promoción. Cada persona vino porque alguien se lo contó.",
      getEyebrow: "Qué recibes",
      getTitle: "Más que una noche en el calendario.",
      getAccent: "en el calendario.",
      gets: [
        { title: "Producción de contenido", text: "Vídeo y audio de alta calidad de cada set. Material que promociona tu sala y a los artistas." },
        { title: "Crecimiento orgánico", text: "Una comunidad fiel que sigue la música, no el hype. Interacción real, gente real." },
        { title: "Alcance internacional", text: "Artistas de 8 países. Un sonido global en un espacio local." },
        { title: "Profesionalidad", text: "En serio con la música, en serio con la ejecución. Nos ocupamos de los detalles." },
      ],
      casesEyebrow: "Pruebas",
      casesTitle: "Lo hemos hecho dos veces. Las dos llenamos la sala.",
      casesAccent: "llenamos la sala.",
      cases: [
        { status: "Agotado", date: "Mayo de 2026", title: "Bridge 48", text: "Nuestra primera noche fuera del salón. 150 personas de nuestra gente compraron entrada, sin publicidad.", facts: ["150 entradas", "7 DJs", "2 salas"], imageAlt: "Un DJ tocando ante una sala llena en Bridge 48" },
        { status: "Aforo completo", date: "Julio de 2026", title: "Espai Salvadiscos", text: "Una asociación del vinilo con miles de socios, normalmente solo para socios. Nos abrieron las puertas.", facts: ["3 DJs", "Asociación del vinilo", "Espacio de socios"], imageAlt: "Un DJ tocando entre estanterías de vinilos en Salvadiscos" },
      ],
      stepsEyebrow: "Cómo funciona",
      stepsTitle: "Empieza con una conversación.",
      stepsAccent: "una conversación.",
      steps: [
        { title: "Hablamos", text: "Buscamos salas de gente en la misma frecuencia: amantes de la música que han creado un espacio a su alrededor." },
        { title: "Hacemos la noche juntos", text: "Su nombre junto al nuestro. Su público junto al nuestro." },
        { title: "La música va primero", text: "Los DJs siguen libres. La sala sigue siendo una comunidad, solo que más grande." },
        { title: "La noche sigue funcionando", text: "Cada una se convierte en una serie en YouTube y varias semanas de contenido." },
      ],
      watchEyebrow: "Compruébalo",
      watchTitle: "Así se ve.",
      watchAccent: "se ve.",
      archive: "Ver todas las sesiones",
      fitEyebrow: "Para quién es",
      fitTitle: "La música sobre el negocio.",
      fitAccent: "sobre el negocio.",
      fit: ["Nos importan los espacios que valoran la música sobre el negocio. Salas donde importa el sonido, donde importa la comunidad, donde la energía importa más que el número de personas.", "Si tu espacio comparte esa filosofía, nos encantaría llevar una sesión."],
      fitAlt: "Un DJ en la cabina con el público aplaudiendo",
      waysEyebrow: "Formas de colaborar",
      waysTitle: "Tres formas de empezar.",
      waysAccent: "de empezar.",
      ways: [
        { title: "Leavin’ the Room", text: "Hacemos la noche en tu sala: line-up, comunidad y grabación.", points: ["Bridge 48: agotado", "Salvadiscos: aforo completo"] },
        { title: "Living Room Session", text: "Una sesión presentada con tu marca, a la escala íntima de siempre.", points: ["Grabación completa en YouTube", "Presencia en la sala y en el archivo"] },
        { title: "Colabs", text: "Marcas, artistas y fotógrafos. Estamos abiertos a colaboraciones creativas.", points: ["Primera colab: la camiseta con Pri Amaral", "Obra original, edición limitada"] },
      ],
      ctaEyebrow: "Hablemos",
      ctaTitle: "Dale al play.",
      ctaAccent: "play.",
      ctaText: "Si esto resuena contigo, nos encantaría llevar una sesión a tu espacio.",
    },
    shirt: {
      title: 'Camiseta Viva los seres que bailan',
      marquee: ['Viva los seres que bailan', 'Airfryer × Pri Amaral', 'Edición única'],
      videoEyebrow: 'En movimiento',
      videoTitle: 'Está hecha para esto.',
      videoAccent: 'para esto.',
      processEyebrow: 'El proceso',
      processTitle: 'Del lienzo al algodón.',
      processAccent: 'algodón.',
      processAlts: ['Pri Amaral pintando en vivo en la sesión #010', 'El estampado de cerca sobre algodón negro', 'La camiseta junto a un tocadiscos'],
    },
  },
  pt: {
    ig: 'Seguir no Instagram',
    yt: 'Assistir no YouTube',
    mail: 'Mandar um e-mail',
    home: {
      title: "Living Room Sessions íntimas.",
      accent: "Living Room",
      subtitle: "Coletivo de música nascido em Barcelona, dividindo nosso amor pela música",
      primary: "Explorar sessões",
      showreel: "Ver o showreel",
      sessionsEyebrow: "O arquivo",
      sessionsTitle: "Últimas sessões",
      archive: "Ver todo o arquivo",
      whyEyebrow: "A comunidade",
      whyTitle: "Por que a gente dança",
      whyText: "A gente dança porque a música conecta além das palavras. Porque uma batida diz o que as palavras não conseguem. Porque nesse momento compartilhado, coração e grave viram um só.",
      join: "Entrar na comunidade",
      leavinEyebrow: "Airfryer Collective",
      leavinTitle: "Leavin’ the Room",
      leavinText: "Da sala de estar para o Bridge 48.",
      watchSets: "Ver os sets",
      seePhotos: "Ver as fotos",
      noiseTitle: "Vamos fazer barulho.",
      noiseAccent: "barulho.",
      noiseText: "Fala com a gente.",
    },
    experience: {
      title: 'Experiência',
      eyebrow: 'Experiência',
      heroTitle: 'Uma sala. Um som. Gente que se importa.',
      heroAccent: 'Gente que se importa.',
      heroText: 'Living Room Sessions são noites íntimas num apartamento: um DJ, poucas dezenas de pessoas, nenhum celular no alto. Quando a sala ficou pequena, a gente saiu, mas sempre volta pra ela.',
      seeArchive: 'Ver o arquivo',
      lrEyebrow: 'Living Room Sessions',
      lrTitle: 'Sem palco. Sem área VIP.',
      lrAccent: 'Sem área VIP.',
      lr: [
        'O DJ toca na altura dos olhos, na mesa da sala. Quem dança está a um braço de distância de quem toca.',
        'Cada sessão é gravada em vídeo e vai pro YouTube. Não pra viralizar: pra virar arquivo de uma cena que está acontecendo agora.',
      ],
      lrAlt: 'Sessão lotada numa sala de estar',
      archiveEyebrow: 'O arquivo',
      archiveTitle: 'Toda sessão, gravada.',
      archiveAccent: 'gravada.',
      archiveText: 'Explora por sala, por artista, ou só aperta o play e descobre.',
      galleryTitle: 'A primeira vez fora de casa.',
      galleryAccent: 'fora de casa.',
      galleryText: '24 de maio de 2026. 150 pessoas, 7 DJs, duas salas, ingresso esgotado.',
      ctaEyebrow: 'O que vem',
      ctaTitle: 'Vamos fazer barulho.',
      ctaAccent: 'barulho.',
      ctaText: 'Novos sets, próximas datas e o que vem por aí, no Instagram.',
    },
    video: {
      title: 'Biblioteca',
      eyebrow: 'A biblioteca',
      heroTitle: 'Cada set, gravado.',
      heroAccent: 'gravado.',
    },
    community: {
      title: 'Comunidade',
      heroTitle: 'Uns tocam. Uns dançam. Uns só fecham o olho.',
      heroAccent: 'fecham o olho.',
      heroText: 'A gente é amante de música. Só isso. E todo mundo vem pelo mesmo motivo.',
      join: 'Entrar na roda',
      play: 'Quero tocar',
      whyEyebrow: 'Por que a gente dança',
      whyTitle: 'Porque um beat diz o que palavra não diz.',
      whyAccent: 'palavra não diz.',
      why: [
        'A gente dança porque a música conecta além das palavras. Porque naquele momento dividido, batimento e linha de baixo viram uma coisa só.',
        'Começou com amigos numa sala em Barcelona. Hoje são 763 pessoas que já passaram pela pista, 31 artistas e gente de 8 países.',
      ],
      whyAlt: 'Pista cheia em Bridge 48',
      crewText: 'Quatro pessoas, três países, uma sala.',
      djEyebrow: 'Pra DJs',
      djTitle: 'Isso aqui é seu laboratório.',
      djAccent: 'laboratório.',
      dj: [
        'Sem setlist seguro, sem expectativa. Só você e a música que você ama, pra uma sala que escuta.',
        'A gente monta as sessões junto. Se você tem um som pra dividir, manda um set gravado e conta um pouco de você.',
      ],
      djAlt: 'A cabine da Lab Room em Bridge 48',
      djCta: 'Mandar meu set',
      djSubject: 'Quero tocar numa sessão',
      ctaEyebrow: 'Entra',
      ctaTitle: 'A sala tem espaço pra você.',
      ctaAccent: 'pra você.',
    },
    partnerships: {
      title: "Parcerias",
      eyebrow: "Parcerias culturais",
      heroTitle: "Leve uma sessão para o seu espaço.",
      heroAccent: "seu espaço.",
      heroText: "Fazemos noites com casas que colocam a música em primeiro lugar. Seu espaço, nossa comunidade e cada set gravado.",
      talk: "Levar uma sessão",
      subject: "Partnership with Airfryer",
      seeCases: "Ver noites anteriores",
      statsNote: "Sem anúncios. Sem verba de divulgação. Cada pessoa veio porque alguém contou.",
      getEyebrow: "O que você recebe",
      getTitle: "Mais que uma noite na agenda.",
      getAccent: "na agenda.",
      gets: [
        { title: "Produção de conteúdo", text: "Vídeo e áudio de alta qualidade de cada set. Material que divulga sua casa e os artistas." },
        { title: "Crescimento orgânico", text: "Uma comunidade fiel que segue a música, não o hype. Engajamento real, gente real." },
        { title: "Alcance internacional", text: "Artistas de 8 países. Um som global num espaço local." },
        { title: "Profissionalismo", text: "Sérios com a música, sérios com a execução. A gente cuida dos detalhes." },
      ],
      casesEyebrow: "Provas",
      casesTitle: "Já fizemos duas vezes. Nas duas a casa encheu.",
      casesAccent: "a casa encheu.",
      cases: [
        { status: "Esgotado", date: "Maio de 2026", title: "Bridge 48", text: "Nossa primeira noite fora da sala. 150 pessoas da nossa comunidade compraram ingresso, sem anúncio.", facts: ["150 ingressos", "7 DJs", "2 salas"], imageAlt: "Um DJ tocando para a pista cheia no Bridge 48" },
        { status: "Lotação completa", date: "Julho de 2026", title: "Espai Salvadiscos", text: "Uma associação do vinil com milhares de sócios, normalmente só para sócios. Abriram as portas para nós.", facts: ["3 DJs", "Associação do vinil", "Espaço de sócios"], imageAlt: "Um DJ tocando entre estantes de vinil na Salvadiscos" },
      ],
      stepsEyebrow: "Como funciona",
      stepsTitle: "Começa com uma conversa.",
      stepsAccent: "uma conversa.",
      steps: [
        { title: "A gente conversa", text: "Procuramos casas de gente na mesma frequência: amantes de música que construíram um espaço em torno dela." },
        { title: "Fazemos a noite juntos", text: "O nome deles ao lado do nosso. O público deles ao lado do nosso." },
        { title: "A música vem primeiro", text: "Os DJs seguem livres. A sala segue sendo uma comunidade, só que maior." },
        { title: "A noite continua rendendo", text: "Cada uma vira uma série no YouTube e algumas semanas de conteúdo." },
      ],
      watchEyebrow: "Veja você mesmo",
      watchTitle: "É assim que fica.",
      watchAccent: "que fica.",
      archive: "Ver todas as sessões",
      fitEyebrow: "Para quem é",
      fitTitle: "Música acima do comércio.",
      fitAccent: "acima do comércio.",
      fit: ["Valorizamos espaços que colocam a música acima do comércio. Casas onde o som importa, onde a comunidade importa, onde a energia importa mais que o número de pessoas.", "Se o seu espaço compartilha dessa filosofia, adoraríamos levar uma sessão."],
      fitAlt: "Um DJ na cabine com o público aplaudindo",
      waysEyebrow: "Formas de trabalhar juntos",
      waysTitle: "Três formas de começar.",
      waysAccent: "de começar.",
      ways: [
        { title: "Leavin’ the Room", text: "Fazemos a noite na sua casa: line-up, comunidade e gravação.", points: ["Bridge 48: esgotado", "Salvadiscos: lotação completa"] },
        { title: "Living Room Session", text: "Uma sessão apresentada com a sua marca, na escala íntima de sempre.", points: ["Gravação completa no YouTube", "Presença na sala e no arquivo"] },
        { title: "Collabs", text: "Marcas, artistas e fotógrafos. Estamos abertos a parcerias criativas.", points: ["Primeira collab: a camisa com a Pri Amaral", "Arte original, edição limitada"] },
      ],
      ctaEyebrow: "Vamos conversar",
      ctaTitle: "Dá o play.",
      ctaAccent: "play.",
      ctaText: "Se isso fez sentido, adoraríamos levar uma sessão para o seu espaço.",
    },
    shirt: {
      title: 'Camisa Viva los seres que bailan',
      marquee: ['Viva los seres que bailan', 'Airfryer × Pri Amaral', 'Edição única'],
      videoEyebrow: 'Em movimento',
      videoTitle: 'Ela foi feita pra isso.',
      videoAccent: 'pra isso.',
      processEyebrow: 'Do processo',
      processTitle: 'Da tela pro algodão.',
      processAccent: 'algodão.',
      processAlts: ['Pri Amaral pintando ao vivo na sessão #010', 'A estampa de perto no algodão preto', 'A camisa ao lado de uma vitrola'],
    },
  },
}

const b48 = (n: number) => `/media/gallery/b48-${String(n).padStart(2, '0')}.jpg`

// One block tree for everyone. Copy props are COPY tokens (t / tk), resolved to
// the visitor's language at render; hrefs are the single English paths. `en`
// (the default copy) is read only for object shapes (tk) and mailto subjects,
// which stay English in the URL while the button label still translates.
function buildBlocks(): Record<PageKey, StorefrontBlockLike[]> {
  const en = COPY[DEFAULT_LANG]
  const ig: Cta = { label: t('ig'), href: social.instagram }
  const yt: Cta = { label: t('yt'), href: social.youtube }
  const mail = (subjectEn: string, labelToken: string = t('mail')): Cta => ({ label: labelToken, href: `mailto:${social.email}?subject=${encodeURIComponent(subjectEn)}` })

  // The original home's sections, in its order, plus the shirt before the close.
  const home: StorefrontBlockLike[] = [
    {
      type: 'afHero',
      props: {
        title: t('home.title'),
        accent: t('home.accent'),
        subtitle: t('home.subtitle'),
        video: '/media/hero-video.mp4',
        poster: '/media/photos/livingroom.jpg',
        primary: { label: t('home.primary'), href: '#sessions' },
        secondary: { label: t('home.showreel'), href: social.showreel, icon: 'play' },
      },
    },
    { type: 'afStats' },
    {
      type: 'afSessions',
      props: {
        anchor: 'sessions',
        eyebrow: t('home.sessionsEyebrow'),
        title: t('home.sessionsTitle'),
        ids: ['Oq45UGmvxBE', 'oPAwYG0t9I8', 'lmSqYLC9XeM', 'iThWGMtdAk4', 'ezyciDVG0lw', '17sTKp8EePY'],
        action: { label: t('home.archive'), href: routeFor('video') },
      },
    },
    { type: 'afWhoWeAre' },
    {
      type: 'afVoices',
      props: { eyebrow: t('home.whyEyebrow'), title: t('home.whyTitle'), text: t('home.whyText'), cta: { label: t('home.join'), href: routeFor('community') } },
    },
    {
      type: 'afEventSpotlight',
      props: { eyebrow: t('home.leavinEyebrow'), title: t('home.leavinTitle'), text: t('home.leavinText'), watch: t('home.watchSets'), photos: t('home.seePhotos') },
    },
    { type: 'afTeeSpotlight' },
    { type: 'afContact', props: { title: t('home.noiseTitle'), accent: t('home.noiseAccent'), text: t('home.noiseText') } },
  ]

  const experience: StorefrontBlockLike[] = [
    {
      type: 'afHero',
      props: { height: 'tall', eyebrow: t('experience.eyebrow'), title: t('experience.heroTitle'), accent: t('experience.heroAccent'), subtitle: t('experience.heroText'), image: '/media/photos/b48-closingset.jpg', primary: { label: t('experience.seeArchive'), href: '#archive' }, secondary: ig },
    },
    {
      type: 'afStory',
      props: { eyebrow: t('experience.lrEyebrow'), title: t('experience.lrTitle'), accent: t('experience.lrAccent'), paragraphs: t('experience.lr'), image: '/media/photos/livingroom.jpg', imageAlt: t('experience.lrAlt'), side: 'left' },
    },
    { type: 'afRules' },
    {
      type: 'afSessions',
      props: { anchor: 'archive', eyebrow: t('experience.archiveEyebrow'), title: t('experience.archiveTitle'), accent: t('experience.archiveAccent'), text: t('experience.archiveText'), limit: 6, action: { label: t('experience.seeArchive'), href: routeFor('video') } },
    },
    { type: 'afEvents' },
    {
      type: 'afGallery',
      props: { eyebrow: "Leavin' the Room @ Bridge 48", title: t('experience.galleryTitle'), accent: t('experience.galleryAccent'), text: t('experience.galleryText'), images: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(b48), anchor: 'gallery' },
    },
    {
      type: 'afCta',
      props: { eyebrow: t('experience.ctaEyebrow'), title: t('experience.ctaTitle'), accent: t('experience.ctaAccent'), text: t('experience.ctaText'), primary: ig, secondary: yt, image: '/media/photos/livingroom-joy.jpg' },
    },
  ]

  // The Library: lands straight on the tiles — a grid wall of every set, room
  // tabs, no hero. The experience page tells the story and links here.
  const video: StorefrontBlockLike[] = [
    {
      type: 'afLibrary',
    },
  ]

  const community: StorefrontBlockLike[] = [
    {
      type: 'afHero',
      props: { height: 'tall', eyebrow: t('community.title'), title: t('community.heroTitle'), accent: t('community.heroAccent'), subtitle: t('community.heroText'), image: '/media/photos/livingroom-joy.jpg', primary: { label: t('community.join'), href: social.instagram }, secondary: { label: t('community.play'), href: '#play' } },
    },
    {
      type: 'afStory',
      props: { eyebrow: t('community.whyEyebrow'), title: t('community.whyTitle'), accent: t('community.whyAccent'), paragraphs: t('community.why'), image: '/media/photos/b48-dancefloor.jpg', imageAlt: t('community.whyAlt') },
    },
    { type: 'afCrew', props: { text: t('community.crewText') } },
    { type: 'afVoices' },
    {
      type: 'afStory',
      props: { anchor: 'play', eyebrow: t('community.djEyebrow'), title: t('community.djTitle'), accent: t('community.djAccent'), paragraphs: t('community.dj'), image: '/media/photos/b48-labroom.jpg', imageAlt: t('community.djAlt'), side: 'left', tone: 'dark', cta: mail(en.community.djSubject, t('community.djCta')) },
    },
    { type: 'afMarquee', props: { loud: true, speed: 40 } },
    {
      type: 'afCta',
      props: { eyebrow: t('community.ctaEyebrow'), title: t('community.ctaTitle'), accent: t('community.ctaAccent'), primary: ig, secondary: yt, image: '/media/photos/b48-community.jpg' },
    },
  ]

  // A landing page with one job: get a venue or brand to write to us. Promise,
  // proof, what they get, the two nights that prove it, how it works, then who
  // it's for, with the same call to action at the top, middle and end.
  const talk = mail(en.partnerships.subject, t('partnerships.talk'))
  const partnerships: StorefrontBlockLike[] = [
    {
      type: 'afHero',
      props: { height: 'tall', eyebrow: t('partnerships.eyebrow'), title: t('partnerships.heroTitle'), accent: t('partnerships.heroAccent'), subtitle: t('partnerships.heroText'), image: '/media/photos/b48-liveroom.jpg', primary: talk, secondary: { label: t('partnerships.seeCases'), href: '#cases' } },
    },
    { type: 'afStats', props: { note: t('partnerships.statsNote') } },
    { type: 'afOffers', props: { eyebrow: t('partnerships.getEyebrow'), title: t('partnerships.getTitle'), accent: t('partnerships.getAccent'), items: t('partnerships.gets') } },
    {
      type: 'afCases',
      props: { anchor: 'cases', eyebrow: t('partnerships.casesEyebrow'), title: t('partnerships.casesTitle'), accent: t('partnerships.casesAccent'), items: t('partnerships.cases'), images: ['/media/photos/b48-closingset.jpg', '/media/thumbs/salvadiscos/leo-janeiro.jpg'] },
    },
    { type: 'afSteps', props: { eyebrow: t('partnerships.stepsEyebrow'), title: t('partnerships.stepsTitle'), accent: t('partnerships.stepsAccent'), items: t('partnerships.steps'), action: talk } },
    {
      type: 'afSessions',
      props: { eyebrow: t('partnerships.watchEyebrow'), title: t('partnerships.watchTitle'), accent: t('partnerships.watchAccent'), ids: ['D4Hc6bTMGL0', 'Oq45UGmvxBE', 'UUWR6SZaU2I'], action: { label: t('partnerships.archive'), href: routeFor('video') } },
    },
    { type: 'afVoices' },
    {
      type: 'afStory',
      props: { eyebrow: t('partnerships.fitEyebrow'), title: t('partnerships.fitTitle'), accent: t('partnerships.fitAccent'), paragraphs: t('partnerships.fit'), image: '/media/photos/b48-booth-crowd.jpg', imageAlt: t('partnerships.fitAlt') },
    },
    { type: 'afOffers', props: { eyebrow: t('partnerships.waysEyebrow'), title: t('partnerships.waysTitle'), accent: t('partnerships.waysAccent'), items: t('partnerships.ways') } },
    { type: 'afPartners' },
    { type: 'afCrew' },
    {
      type: 'afCta',
      props: { loud: true, eyebrow: t('partnerships.ctaEyebrow'), title: t('partnerships.ctaTitle'), accent: t('partnerships.ctaAccent'), text: t('partnerships.ctaText'), primary: talk, secondary: ig, image: '/media/photos/b48-crowd.jpg' },
    },
  ]

  const shirt: StorefrontBlockLike[] = [
    { type: 'afTeeBuy' },
    { type: 'afMarquee', props: { loud: true, speed: 26, items: t('shirt.marquee') } },
    { type: 'afTeeDetails' },
    { type: 'afTeeArtist' },
    // The video slot: pass `youtubeId` or `src` to fill it. Sits after the
    // product facts so an empty slot never reads as the page's second beat.
    { type: 'afVideo', props: { eyebrow: t('shirt.videoEyebrow'), title: t('shirt.videoTitle'), accent: t('shirt.videoAccent'), poster: TEE_LOOKS.livingRoom } },
    { type: 'afTeeLookbook' },
    { type: 'afGallery', props: { eyebrow: t('shirt.processEyebrow'), title: t('shirt.processTitle'), accent: t('shirt.processAccent'), images: ['/media/photos/session10-painting.jpg', TEE_LOOKS.macro, TEE_LOOKS.flatlay], alts: t('shirt.processAlts') } },
    { type: 'afTeeFaq' },
    { type: 'afTeeFinal' },
    { type: 'afTeeSticky' },
  ]

  return { home, experience, video, community, partnerships, shirt }
}

/** Page titles, for <title> and the content-page config. */
export function pageTitle(key: PageKey, lang: Lang): string {
  const c = COPY[lang]
  // Home has a title too: without one the SDK titles a content page by its
  // slug ("Home Pt") once the client takes over the head.
  return { home: 'Living Room Sessions', experience: c.experience.title, video: c.video.title, community: c.community.title, partnerships: c.partnerships.title, shirt: c.shirt.title }[key]
}

const built = buildBlocks()

/** The store's own home page at `/`. */
export const homeBlocks = built.home

/** One content page per page, at its English path. The <title> and meta
 *  description are set per request in the visitor's language by headFor; the
 *  title here (default language) is only the SDK's fallback. */
export const contentPages: Record<string, StorefrontContentPageConfig> = {}
for (const key of Object.keys(built) as PageKey[]) {
  contentPages[key] = { title: pageTitle(key, DEFAULT_LANG), path: routeFor(key), blocks: built[key] }
}
// A set's own page: /library/<id>. One parametric content page; the player
// block reads the id from the path and finds the set.
contentPages.set = {
  title: COPY[DEFAULT_LANG].video.title,
  path: `${routeFor('video')}/:id`,
  blocks: [{ type: 'afVideoPlayer' }],
}
