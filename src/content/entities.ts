import type { L } from '../i18n'

// The collective as data: the entities the old static site carried in its
// markup (sessions, crew, artists' words, events, partners) lifted into typed
// records so every page reads the same source, in every language. Facts only;
// nothing here is invented for marketing.

export interface Session {
  number: string
  artist: string
  genres: string[]
  youtubeId: string
  /** Local thumb under /media/thumbs; falls back to YouTube's own. */
  thumb?: string
  venue: 'living-room' | 'bridge48' | 'salvadiscos'
  /** The living room that crossed the ocean: sessions filmed in Rio. */
  edition?: 'rio'
  origin?: string
  tag?: 'Live Set' | 'B2B'
  note?: L
}

export const sessions: Session[] = [
  { number: '010', artist: 'Nuup B2B Valderrama', genres: ['Indie Dance', 'Melodic House'], youtubeId: 'UUWR6SZaU2I', thumb: '/media/photos/session10-painting.jpg', venue: 'living-room', tag: 'B2B', note: { en: 'Pri Amaral painted it live', es: 'Pri Amaral la pintó en vivo', pt: 'Pri Amaral pintou ao vivo' } },
  { number: '016', artist: 'Seed Selector', genres: ['House'], youtubeId: 'lmSqYLC9XeM', thumb: '/media/thumbs/living-room/seed-selector.jpg', venue: 'living-room', origin: 'São Paulo', note: { en: "Too hot for the living room, so we moved the whole session to the dining room. House music without borders, from São Paulo.", es: "Demasiado calor para el salón, así que movimos toda la sesión al comedor. House sin fronteras, desde São Paulo.", pt: "Quente demais para a sala, então levamos a sessão inteira para a sala de jantar. House sem fronteiras, de São Paulo." } },
  { number: '015', artist: 'Soulfie', genres: ['House', 'Disco', 'Soul'], youtubeId: 'iThWGMtdAk4', thumb: '/media/thumbs/living-room/soulfie.jpg', venue: 'living-room', origin: 'Santa Catarina → São Paulo', note: { en: "Soul and disco at the root, house music in all its branches. From Santa Catarina, based in São Paulo.", es: "Soul y disco en la raíz, house en todas sus ramas. De Santa Catarina a São Paulo.", pt: "Soul e disco na raiz, house em todos os galhos. De Santa Catarina a São Paulo." } },
  { number: '014', artist: 'KMNI', genres: ['Afro House'], youtubeId: 'ezyciDVG0lw', thumb: '/media/thumbs/living-room/kmni.jpg', venue: 'living-room', origin: 'Cameroon → LA', note: { en: "West African rhythm meets modern electronic music. Cameroonian-born, Los Angeles-based.", es: "Ritmo de África occidental y música electrónica moderna. De Camerún a Los Ángeles.", pt: "Ritmo da África Ocidental encontra a música eletrônica moderna. De Camarões a Los Angeles." } },
  { number: '013', artist: 'Animaâ B2B Ganem', genres: ['Indie Dance', 'Deep House'], youtubeId: '17sTKp8EePY', thumb: '/media/thumbs/living-room/animaa-b2b-ganem.jpg', venue: 'living-room', tag: 'B2B', note: { en: "From deep, underground grooves into full indie dance energy. The living room sessions, back in 2026.", es: "De grooves profundos y underground a pura energía indie dance. Las sesiones del salón, de vuelta en 2026.", pt: "De grooves profundos e underground à energia total do indie dance. As sessões da sala, de volta em 2026." } },
  { number: '012', artist: 'Rafael Paste', genres: ['House'], youtubeId: 'TVDlgcok6zo', venue: 'living-room', edition: 'rio', tag: 'Live Set' },
  { number: '011', artist: 'Benny', genres: ['House'], youtubeId: '5wImLyql194', venue: 'living-room', edition: 'rio', tag: 'Live Set' },
  { number: '009', artist: 'Marco Boarelli', genres: ['Progressive House'], youtubeId: 'Ivd6Lh5xJZw', venue: 'living-room', origin: 'Argentina' },
  { number: '008', artist: 'Ezera', genres: ['Melodic Techno', 'Future Rave'], youtubeId: 'llMg7pImNsU', venue: 'living-room', origin: 'Canada → Barcelona' },
  { number: '007', artist: 'Andrés Divitto', genres: ['Organic House', 'Deep House'], youtubeId: 'PxE58mDfmA4', venue: 'living-room', origin: 'Argentina → Barcelona' },
  { number: '006', artist: 'Le Bulla', genres: ['House'], youtubeId: 'sFto1Cpjzm8', venue: 'living-room', origin: 'Barcelona' },
  { number: '005', artist: 'Dubbelle', genres: ['Afro House', 'Afro Techno'], youtubeId: 'pLGyy7kkAHk', venue: 'living-room', origin: 'Brazil → Barcelona' },
  { number: '004', artist: 'Henry Carlin', genres: ['Indie Dance'], youtubeId: '892ogtvgm5M', venue: 'living-room' },
  { number: '003', artist: 'Entropia', genres: ['Breakbeat', 'Acid', 'Garage'], youtubeId: 'o1pChRTfiCY', venue: 'living-room' },
  { number: '002', artist: 'Keyblow', genres: ['Melodic Techno', 'Indie Dance'], youtubeId: 'QTKRufMAuMc', venue: 'living-room', origin: 'Argentina → Barcelona' },
  { number: '001', artist: 'Omaya', genres: ['Afro House', 'Indie Dance'], youtubeId: 'tckwNO78RaI', thumb: '/media/photos/session01-omaya.jpg', venue: 'living-room', tag: 'Live Set' },
  { number: 'B48', artist: 'Le Bulla', genres: ['Indie Dance', 'House'], youtubeId: 'udaSeXCRQn0', thumb: '/media/thumbs/bridge48/le-bulla.jpg', venue: 'bridge48' },
  { number: 'B48', artist: 'Marco Boarelli', genres: ['Progressive House'], youtubeId: 'b9Svr_Aajr0', thumb: '/media/thumbs/bridge48/marco-boarelli.jpg', venue: 'bridge48' },
  { number: 'B48', artist: 'Nairo', genres: ['Indie Dance'], youtubeId: 'R0v4VRlLJwM', thumb: '/media/thumbs/bridge48/nairo.jpg', venue: 'bridge48' },
  { number: 'B48', artist: 'Valderrama', genres: ['Indie Dance'], youtubeId: 'D4Hc6bTMGL0', thumb: '/media/thumbs/bridge48/valderrama.jpg', venue: 'bridge48' },
  { number: 'B48', artist: 'DJ Tortuga', genres: ['Funk', 'Disco House'], youtubeId: 'AfY2lzSK3bw', thumb: '/media/thumbs/bridge48/dj-tortuga.jpg', venue: 'bridge48' },
  { number: 'B48', artist: 'Charlins', genres: ['Progressive', 'Melodic House'], youtubeId: 'dqgOX_mWxR8', thumb: '/media/thumbs/bridge48/charlins.jpg', venue: 'bridge48' },
  { number: 'B48', artist: 'Mats + Ma House', genres: ['House'], youtubeId: 'ro6n1MVRhWU', thumb: '/media/thumbs/bridge48/mats-ma-house.jpg', venue: 'bridge48', tag: 'B2B' },
  { number: 'SD', artist: 'Leo Janeiro', genres: ['House'], youtubeId: 'Oq45UGmvxBE', thumb: '/media/thumbs/salvadiscos/leo-janeiro.jpg', venue: 'salvadiscos', origin: 'Rio de Janeiro', note: { en: "This whole night started with him. We met at ADE 2025 and thanked him for the music. Six months later he wrote back.", es: "Toda esta noche empezó con él. Nos conocimos en ADE 2025 y le dimos las gracias por la música. Seis meses después nos escribió.", pt: "Essa noite inteira começou com ele. A gente se conheceu no ADE 2025 e agradeceu pela música. Seis meses depois ele respondeu." } },
  { number: 'SD', artist: 'Andrés Divitto', genres: ['Deep House'], youtubeId: 'oPAwYG0t9I8', thumb: '/media/thumbs/salvadiscos/andres-divitto.jpg', venue: 'salvadiscos', note: { en: "Leavin’ the Room is back, this time at Salva Discos. When it was time to pick who would open the night, there was no list. It was him.", es: "Leavin’ the Room vuelve, esta vez en Salva Discos. A la hora de elegir quién abría la noche, no hubo lista. Fue él.", pt: "O Leavin’ the Room voltou, desta vez na Salva Discos. Na hora de escolher quem abria a noite, não teve lista. Foi ele." } },
]

export const venueLabel: Record<Session['venue'], string> = {
  'living-room': 'Living Room',
  bridge48: 'Bridge 48',
  salvadiscos: 'Salva Discos',
}

export function sessionThumb(s: Session): string {
  // maxresdefault, not hqdefault: hq letterboxes 16:9 video with black bars.
  return s.thumb ?? `https://img.youtube.com/vi/${s.youtubeId}/maxresdefault.jpg`
}

/** A set's catalogue number: AFC/016, AFC/B48. */
export function afcNumber(s: Session): string {
  return `AFC/${s.number}`
}

/** Where a set plays: its own page, by YouTube id (unique per video). */
export function setHref(s: Session): string {
  return `/library/${s.youtubeId}`
}

/** The design system's one accent per card, by genre. Always shown beside the
 *  genre's name, never as colour alone. Heat is the default: House. */
export function genreAccent(s: Session): string {
  const has = (re: RegExp) => s.genres.some((g) => re.test(g))
  if (has(/afro/i)) return 'var(--af-rosa)'
  if (has(/disco|soul|funk/i)) return 'var(--af-lima)'
  if (has(/indie|progressive|melodic|techno|rave|breakbeat|acid|garage/i)) return 'var(--af-azul)'
  return 'var(--af-heat)'
}

const sessionNumber = (s: Session) => {
  const n = parseInt(s.number, 10)
  return Number.isNaN(n) ? -1 : n
}

/** Living-room sets by number, newest first, then the nights out of the room.
 *  (Sets carry no recording date, so the number is the only real order.) */
export function newestFirst(list: Session[]): Session[] {
  return [...list].sort((a, b) => sessionNumber(b) - sessionNumber(a))
}

export interface Member {
  name: string
  role: L
  bio: L
  portrait: string
}

export const crew: Member[] = [
  {
    name: 'Douglas Monroe',
    role: { en: 'Founder · Community', es: 'Fundador · Comunidad', pt: 'Fundador · Comunidade' },
    bio: { en: 'Brazilian in Barcelona. The sessions happen in his living room.', es: 'Brasileño en Barcelona. Las sesiones pasan en su salón.', pt: 'Brasileiro em Barcelona. As sessões acontecem na sala dele.' },
    portrait: '/media/team/douglas.jpg',
  },
  {
    name: 'Franco Ricchetti',
    role: { en: 'Operations', es: 'Operaciones', pt: 'Operações' },
    bio: { en: 'Argentine, by way of Amsterdam. Shoots photos and plays.', es: 'Argentino, de paso por Ámsterdam. Fotografía y pincha.', pt: 'Argentino, passou por Amsterdam. Fotografa e toca.' },
    portrait: '/media/team/franco.jpg',
  },
  {
    name: 'Ivan',
    role: { en: 'DJ network', es: 'Red de DJs', pt: 'Rede de DJs' },
    bio: { en: 'DJ and producer signed to Soundgarden. Looks after whoever plays.', es: 'DJ y productor fichado por Soundgarden. Cuida de quien pincha.', pt: 'DJ e produtor, assinado pela Soundgarden. Cuida de quem toca.' },
    portrait: '/media/team/ivan.jpg',
  },
  {
    name: 'Vini',
    role: { en: 'Creative direction', es: 'Dirección creativa', pt: 'Direção criativa' },
    bio: { en: 'From Rio, remote. The first DJ to ever play an Airfryer session.', es: 'De Río, en remoto. El primer DJ en tocar una sesión Airfryer.', pt: 'Carioca, remoto. O primeiro DJ a tocar numa sessão Airfryer.' },
    portrait: '/media/team/vini.jpg',
  },
]

export interface Voice {
  quote: L
  name: string
  detail: L
}

export const voices: Voice[] = [
  {
    quote: {
      en: 'Airfryer is exactly what music means to me: being surrounded by people you love, in a safe place, with a good atmosphere and a deep bassline in the background.',
      es: 'Airfryer es exactamente lo que la música significa para mí: estar rodeado de gente que quieres, en un lugar seguro, con buen ambiente y un bajo profundo de fondo.',
      pt: 'Airfryer é exatamente o que a música significa pra mim: estar rodeado de gente que você ama, num lugar seguro, com uma boa energia e um grave profundo ao fundo.',
    },
    name: 'Le Bulla',
    detail: { en: 'House · Session #006 · Spain', es: 'House · Sesión #006 · España', pt: 'House · Sessão #006 · Espanha' },
  },
  {
    quote: {
      en: 'A place to connect with music and with friends, as a community. From the moment I discovered the collective, I connected instantly.',
      es: 'Un lugar para conectar con la música y con los amigos, en comunidad. Desde que descubrí el colectivo, conecté al instante.',
      pt: 'Um lugar pra se conectar com a música e com os amigos, em comunidade. Desde que conheci o coletivo, a conexão foi instantânea.',
    },
    name: 'Marco Boarelli',
    detail: { en: 'Progressive House · Session #009 · Argentina', es: 'Progressive House · Sesión #009 · Argentina', pt: 'Progressive House · Sessão #009 · Argentina' },
  },
  {
    quote: {
      en: 'We felt we had a blank canvas. It was the perfect moment to express ourselves in the purest way.',
      es: 'Sentimos que teníamos un lienzo en blanco. Era el momento perfecto para expresarnos de la forma más pura.',
      pt: 'Sentimos que tínhamos uma tela em branco. Era o momento perfeito pra nos expressar da forma mais pura.',
    },
    name: 'Valderrama',
    detail: { en: 'Session #010 · Colombia', es: 'Sesión #010 · Colombia', pt: 'Sessão #010 · Colômbia' },
  },
  {
    quote: {
      en: 'This session gave me the freedom to play whatever I wanted. I could share my proposal exactly how I wanted.',
      es: 'Esta sesión me dio libertad para tocar lo que quisiera. Pude compartir mi propuesta como yo quería.',
      pt: 'Essa sessão me deu liberdade pra tocar o que eu quisesse. Pude mostrar minha proposta do jeito que eu queria.',
    },
    name: 'Nuup',
    detail: { en: 'Session #010 · Mexico', es: 'Sesión #010 · México', pt: 'Sessão #010 · México' },
  },
]

export interface CollectiveEvent {
  title: string
  venue: string
  city: string
  date: L
  status?: L
  text: L
  image: string
  facts?: L[]
}

export const events: CollectiveEvent[] = [
  {
    title: "Leavin' the Room",
    venue: 'Bridge 48',
    city: 'Barcelona',
    date: { en: '24 May 2026', es: '24 may 2026', pt: '24 mai 2026' },
    status: { en: 'Sold out', es: 'Agotado', pt: 'Esgotado' },
    text: {
      en: 'What started in a living room got bigger than the room could hold. The walls got too hot, the neighbours got too patient. We stepped out for the first time: same intention, same energy, finally with the sound system to match.',
      es: 'Lo que empezó en un salón se hizo más grande de lo que el salón aguantaba. Las paredes se calentaron, los vecinos tuvieron paciencia. Salimos por primera vez: misma intención, misma energía, por fin con el sonido a la altura.',
      pt: 'O que começou numa sala ficou maior que a sala. As paredes esquentaram, os vizinhos foram pacientes. Saímos pela primeira vez: mesma intenção, mesma energia, finalmente com o som à altura.',
    },
    image: '/media/photos/b48-closingset.jpg',
    facts: [
      { en: '150 people', es: '150 personas', pt: '150 pessoas' },
      { en: '7 DJs', es: '7 DJs', pt: '7 DJs' },
      { en: '2 rooms', es: '2 salas', pt: '2 salas' },
    ],
  },
  {
    title: "Leavin' the Room",
    venue: 'Salva Discos',
    city: 'Barcelona',
    date: { en: 'Jul 2026', es: 'jul 2026', pt: 'jul 2026' },
    text: {
      en: 'With Leo Janeiro, at a cultural association with 9,000 members. Andrés Divitto opened the night.',
      es: 'Con Leo Janeiro, en una asociación cultural de 9.000 socios. Andrés Divitto abrió la noche.',
      pt: 'Com Leo Janeiro, numa associação cultural de 9.000 sócios. Andrés Divitto abriu a noite.',
    },
    image: '/media/thumbs/salvadiscos/andres-divitto.jpg',
  },
  {
    title: 'ADE',
    venue: 'Amsterdam Dance Event',
    city: 'Amsterdam',
    date: { en: '2025', es: '2025', pt: '2025' },
    text: {
      en: 'Where we met Pri Amaral, and where the shirt began.',
      es: 'Donde conocimos a Pri Amaral, y donde empezó la camiseta.',
      pt: 'Onde conhecemos a Pri Amaral, e de onde veio a camisa.',
    },
    image: '/media/photos/b48-community.jpg',
  },
  {
    title: 'Hot Beats',
    venue: 'Rio de Janeiro',
    city: 'Rio',
    date: { en: '2026', es: '2026', pt: '2026' },
    text: {
      en: 'Sessions #011 and #012 crossed the ocean: the living room, Rio edition.',
      es: 'Las sesiones #011 y #012 cruzaron el océano: el salón, edición Río.',
      pt: 'As sessões #011 e #012 cruzaram o oceano: a sala de estar, edição Rio.',
    },
    image: '/media/photos/livingroom.jpg',
  },
]

export const stats: { value: string; label: L }[] = [
  { value: '763', label: { en: 'People', es: 'Personas', pt: 'Pessoas' } },
  { value: '31', label: { en: 'Artists', es: 'Artistas', pt: 'Artistas' } },
  { value: '30', label: { en: 'Sessions', es: 'Sesiones', pt: 'Sessões' } },
  { value: '8', label: { en: 'Countries', es: 'Países', pt: 'Países' } },
]

export const countries: Record<'en' | 'es' | 'pt', string[]> = {
  en: ['Argentina', 'Brazil', 'Canada', 'Colombia', 'Ireland', 'Italy', 'Portugal', 'Spain'],
  es: ['Argentina', 'Brasil', 'Canadá', 'Colombia', 'Irlanda', 'Italia', 'Portugal', 'España'],
  pt: ['Argentina', 'Brasil', 'Canadá', 'Colômbia', 'Irlanda', 'Itália', 'Portugal', 'Espanha'],
}

export const houseRules: { title: L; text: L }[] = [
  { title: { en: 'Doors at 7pm', es: 'Puertas a las 19h', pt: 'Portas às 19h' }, text: { en: 'Come early. The room fills up.', es: 'Llega pronto. La sala se llena.', pt: 'Chega cedo. A sala enche.' } },
  { title: { en: 'No shoes on the dancefloor', es: 'Sin zapatos en la pista', pt: 'Sem sapato na pista' }, text: { en: "It's a home. Treat it like one.", es: 'Es una casa. Trátala como tal.', pt: 'É uma casa. Trata como tal.' } },
  { title: { en: 'Bring your own', es: 'Trae tu bebida', pt: 'Traz a sua bebida' }, text: { en: 'BYOB, and share with whoever is next to you.', es: 'BYOB, y comparte con quien tengas al lado.', pt: 'BYOB, e divide com quem tá do lado.' } },
  { title: { en: "We're recording", es: 'Estamos grabando', pt: 'Estamos gravando' }, text: { en: 'Unplug and live it. If you post, tag us.', es: 'Desconecta y vívelo. Si publicas, etiquétanos.', pt: 'Desliga o celular e vive. Se postar, marca a gente.' } },
  { title: { en: 'Dance', es: 'Baila', pt: 'Dança' }, text: { en: "That's what the room is for.", es: 'Para eso existe la sala.', pt: 'É pra isso que a sala existe.' } },
]

export const partners: { name: string; kind: L }[] = [
  { name: 'Bridge 48', kind: { en: 'Venue · Barcelona', es: 'Sala · Barcelona', pt: 'Venue · Barcelona' } },
  { name: 'Salva Discos', kind: { en: 'Cultural association · 9,000 members', es: 'Asociación cultural · 9.000 socios', pt: 'Associação cultural · 9.000 sócios' } },
  { name: 'ADE', kind: { en: 'Amsterdam Dance Event', es: 'Amsterdam Dance Event', pt: 'Amsterdam Dance Event' } },
  { name: 'Hot Beats', kind: { en: 'Rio de Janeiro', es: 'Río de Janeiro', pt: 'Rio de Janeiro' } },
  { name: 'Pri Amaral', kind: { en: 'Visual artist · shirt collab', es: 'Artista visual · colab de la camiseta', pt: 'Artista visual · collab da camisa' } },
]

export const social = {
  instagram: 'https://instagram.com/airfryer_collective',
  youtube: 'https://www.youtube.com/@AirfryerCollective',
  email: 'airfryercollective@gmail.com',
  showreel: 'https://www.instagram.com/reel/Daf6m1UNcFx/',
  priInstagram: 'https://instagram.com/priamaral6',
  priSite: 'https://www.priamaral.com/',
}
