import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useRouterState } from '@tanstack/react-router'
import { ArrowLeft, Search, Share2, X } from 'lucide-react'
import { Link, useRoutePath } from '@fayz-ai/storefront'
import { pick, routeFor, useLang, type Lang } from '../i18n'
import { UI } from '../i18n/ui'
import { afcNumber, newestFirst, sessionThumb, sessions, venueLabel, type Session } from '../content/entities'
import { usePlayer } from './player-store'
import { PlayMark, SessionCard } from './session-card'

// The Library: every recorded set, straight onto the tiles. HÖR's shape (sticky
// tabs, a style wall, an artist index) on our three rooms, with the state in the
// URL so a filtered view can be shared. A tile opens /library/<id>; its play
// button starts the docked mini player (see player.tsx).

type Room = 'all' | 'living-room' | 'leaving-room' | 'rio'
type View = 'sets' | 'styles' | 'artists'
type Sort = 'newest' | 'oldest' | 'az'

const ROOMS: readonly Room[] = ['all', 'living-room', 'leaving-room', 'rio']

function inRoom(s: Session, room: Room): boolean {
  if (room === 'all') return true
  if (room === 'rio') return s.edition === 'rio'
  if (room === 'leaving-room') return s.venue !== 'living-room'
  return s.venue === 'living-room' && s.edition !== 'rio'
}

/** A–Z bucket: accents fold, so Andrés and Animaâ both file under A. */
const letterOf = (name: string) => name.normalize('NFD').charAt(0).toUpperCase()
const byName = (a: string, b: string) => a.localeCompare(b, 'en', { sensitivity: 'base' })

function matches(s: Session, query: string): boolean {
  const hay = [s.artist, s.origin ?? '', venueLabel[s.venue], afcNumber(s), ...s.genres].join(' ').toLowerCase()
  return hay.includes(query.toLowerCase())
}

/** Filter state lives in the query string: shareable, and right on the server. */
function useLibraryParams() {
  const router = useRouter()
  const search = useRouterState({ select: (s) => s.location.searchStr ?? '' })
  const params = useMemo(() => new URLSearchParams(search), [search])
  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(window.location.search)
    for (const [k, v] of Object.entries(patch)) {
      if (v) next.set(k, v)
      else next.delete(k)
    }
    const qs = next.toString()
    void router.history.replace(`${routeFor('video')}${qs ? `?${qs}` : ''}`)
  }
  const room = params.get('room') as Room | null
  const view = params.get('view') as View | null
  const sort = params.get('sort') as Sort | null
  return {
    room: room && ROOMS.includes(room) ? room : 'all',
    view: view === 'styles' || view === 'artists' ? view : 'sets',
    sort: sort === 'oldest' || sort === 'az' ? sort : 'newest',
    style: params.get('style'),
    q: params.get('q') ?? '',
    update,
  }
}

function StyleWall({ onPick, active }: { onPick: (style: string) => void; active: string | null }) {
  const groups = useMemo(() => {
    const counts = new Map<string, number>()
    for (const s of sessions) for (const g of s.genres) counts.set(g, (counts.get(g) ?? 0) + 1)
    const buckets = new Map<string, [string, number][]>()
    for (const entry of [...counts].sort((a, b) => byName(a[0], b[0]))) {
      const l = letterOf(entry[0])
      buckets.set(l, [...(buckets.get(l) ?? []), entry])
    }
    return [...buckets]
  }, [])
  return (
    <div className="af-wall">
      {groups.map(([letter, list]) => (
        <span key={letter} className="af-wall__group">
          <span aria-hidden className="af-wall__letter">{letter}</span>
          {list.map(([style, n]) => (
            <button key={style} type="button" className="af-gpill af-gpill--lg" aria-pressed={active === style} onClick={() => onPick(style)}>
              {style} <span className="af-gpill__n">{n}</span>
            </button>
          ))}
        </span>
      ))}
    </div>
  )
}

function ArtistIndex({ onPick }: { onPick: (artist: string) => void }) {
  const groups = useMemo(() => {
    const names = [...new Set(sessions.map((s) => s.artist))].sort(byName)
    const buckets = new Map<string, string[]>()
    for (const name of names) buckets.set(letterOf(name), [...(buckets.get(letterOf(name)) ?? []), name])
    return [...buckets]
  }, [])
  return (
    <div className="af-index">
      <nav className="af-index__rail" aria-label="A–Z">
        {groups.map(([letter]) => (
          <a key={letter} href={`#az-${letter}`} className="af-index__letter">{letter}</a>
        ))}
      </nav>
      <div className="af-index__list">
        {groups.map(([letter, names]) => (
          <section key={letter} id={`az-${letter}`} className="af-index__group">
            <h2 className="af-index__head">{letter}</h2>
            {names.map((name) => (
              <button key={name} type="button" className="af-index__name" onClick={() => onPick(name)}>{name}</button>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}

/** The archive as a filterable wall. No hero: it opens on the tiles. */
export function AfLibrary() {
  const lang = useLang()
  const t = UI[lang]
  const L = t.library
  const { room, view, sort, style, q, update } = useLibraryParams()
  const [typed, setTyped] = useState(q)

  // The field updates at once, the URL (and the grid) a beat later.
  useEffect(() => setTyped(q), [q])
  useEffect(() => {
    if (typed === q) return
    const id = setTimeout(() => update({ q: typed || null }), 200)
    return () => clearTimeout(id)
  }, [typed])

  const list = useMemo(() => {
    const found = newestFirst(sessions).filter((s) => inRoom(s, room) && (!style || s.genres.includes(style)) && (!q || matches(s, q)))
    if (sort === 'oldest') return found.reverse()
    if (sort === 'az') return found.sort((a, b) => byName(a.artist, b.artist))
    return found
  }, [room, style, q, sort])

  const viewTabs: [View, string][] = [['sets', t.sessions.all], ['styles', L.tabStyles], ['artists', L.tabArtists]]
  const editions: [Room, string][] = [
    ['all', L.allEditions],
    ['living-room', L.tabLivingRoom],
    ['leaving-room', L.tabLeavingRoom],
    ['rio', L.tabRio],
  ]
  const sorts: [Sort, string][] = [['newest', L.newest], ['oldest', L.oldest], ['az', L.az]]
  const heading = view === 'styles' ? L.tabStyles : view === 'artists' ? L.tabArtists : room === 'all' ? t.sessions.all : editions.find(([r]) => r === room)?.[1]

  return (
    <section className="af-lib">
      <div className="af-lib__tabs">
        <div className="af-wrap">
          <div className="af-tabs" role="group" aria-label={L.browse}>
            {viewTabs.map(([v, label]) => (
              <button key={v} type="button" className={`af-tab${view === v ? ' af-tab--on' : ''}`} aria-pressed={view === v} onClick={() => update({ view: v === 'sets' ? null : v })}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="af-wrap af-lib__body">
        {view === 'styles' ? (
          <>
            <h1 className="af-lib__title">{heading}</h1>
            <StyleWall active={style} onPick={(s) => update({ style: s, view: null })} />
          </>
        ) : view === 'artists' ? (
          <>
            <h1 className="af-lib__title">{heading}</h1>
            <ArtistIndex onPick={(a) => update({ q: a, style: null, room: null, view: null })} />
          </>
        ) : (
          <>
            <header className="af-lib__bar">
              <div className="af-lib__heading">
                <h1 className="af-lib__title">{heading}</h1>
                <span className="af-mono af-muted" aria-live="polite">{L.sets(list.length)}</span>
              </div>
              <div className="af-lib__controls">
                <label className="af-search">
                  <Search size={16} strokeWidth={2} aria-hidden />
                  <span className="af-visually-hidden">{L.search}</span>
                  <input type="search" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder={L.searchPh} maxLength={32} />
                </label>
                <div className="af-sort" role="group" aria-label={L.sortBy}>
                  <span aria-hidden>{L.sortBy}:</span>
                  {sorts.map(([key, label]) => (
                    <button key={key} type="button" aria-pressed={sort === key} onClick={() => update({ sort: key === 'newest' ? null : key })}>{label}</button>
                  ))}
                </div>
              </div>
            </header>

            <div className="af-lib__editions" role="group" aria-label={L.edition}>
              <span className="af-kicker" aria-hidden>{L.edition}</span>
              {editions.map(([r, label]) => (
                <button key={r} type="button" className="af-gpill" aria-pressed={room === r} onClick={() => update({ room: r === 'all' ? null : r })}>{label}</button>
              ))}
            </div>

            {style ? (
              <div className="af-lib__active">
                <button type="button" className="af-gpill af-gpill--on" onClick={() => update({ style: null })} aria-label={`${L.clear}: ${style}`}>
                  {L.style}: {style} <X size={14} strokeWidth={2.5} aria-hidden />
                </button>
              </div>
            ) : null}

            <h2 className="af-visually-hidden">{L.sets(list.length)}</h2>
            {list.length ? (
              <div className="af-lib__grid">
                {list.map((s) => <SessionCard key={s.youtubeId} s={s} lang={lang} />)}
              </div>
            ) : (
              <div className="af-lib__empty">
                <p className="af-lead">{L.empty}</p>
                <button type="button" className="af-btn af-btn--ghost" onClick={() => { setTyped(''); update({ q: null, style: null, room: null }) }}>{L.clear}</button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

function ShareButton({ s, lang }: { s: Session; lang: Lang }) {
  const L = UI[lang].library
  const [copied, setCopied] = useState(false)
  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: `${s.artist} · Airfryer Collective`, url })
      else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      /* the share sheet was dismissed */
    }
  }
  return (
    <button type="button" className="af-btn af-btn--ghost" onClick={share}>
      <Share2 size={16} strokeWidth={2} aria-hidden /> <span aria-live="polite">{copied ? L.copied : L.share}</span>
    </button>
  )
}

/** The set's own page: the frame takes the screen; the one player (player.tsx)
 *  sits over it, then docks bottom-right when you scroll or leave. */
export function AfVideoPlayer() {
  const lang = useLang()
  const t = UI[lang]
  const L = t.library
  const path = useRoutePath()
  const id = decodeURIComponent((path.split('?')[0] ?? '').split('/').filter(Boolean).pop() ?? '')
  const s = sessions.find((x) => x.youtubeId === id)
  const frameRef = useRef<HTMLDivElement>(null)
  const play = usePlayer((p) => p.play)
  const setStage = usePlayer((p) => p.setStage)
  const playingThis = usePlayer((p) => p.current?.youtubeId === id)

  useEffect(() => {
    if (!s) return
    setStage(frameRef.current, s.youtubeId)
    play(s)
    return () => setStage(null, null)
  }, [s, play, setStage])

  const related = useMemo(() => {
    if (!s) return []
    const shared = (o: Session) => o.genres.filter((g) => s.genres.includes(g)).length
    return newestFirst(sessions)
      .filter((o) => o.youtubeId !== s.youtubeId)
      .sort((a, b) => shared(b) - shared(a))
      .slice(0, 3)
  }, [s])

  if (!s) {
    return (
      <section className="af-section" style={{ minHeight: '70vh', display: 'grid', placeItems: 'center' }}>
        <div className="af-wrap" style={{ textAlign: 'center', display: 'grid', gap: 20, justifyItems: 'center' }}>
          <p className="af-lead" style={{ margin: 0 }}>404</p>
          <Link to={routeFor('video')} className="af-btn af-btn--ghost"><ArrowLeft size={16} /> {L.back}</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="af-player">
      <div className="af-player__stage">
        <div ref={frameRef} className="af-player__frame">
          <img src={sessionThumb(s)} alt="" className="af-photo" />
          {playingThis ? null : (
            <button type="button" className="af-player__start" aria-label={`${t.sessions.watch}: ${s.artist}`} onClick={() => play(s)}>
              <PlayMark size={32} />
            </button>
          )}
        </div>
      </div>

      <div className="af-wrap af-player__info">
        <div className="af-player__text">
          <Link to={routeFor('video')} className="af-player__back"><ArrowLeft size={16} aria-hidden /> {L.back}</Link>
          <span className="af-eyebrow">{afcNumber(s)} · {venueLabel[s.venue]}{s.edition === 'rio' ? ` · ${L.rioTag}` : ''}{s.tag ? ` · ${s.tag}` : ''}</span>
          <h1 className="af-h2">{s.artist}</h1>
          {s.note || s.origin ? <p className="af-lead" style={{ margin: 0 }}>{s.note ? pick(s.note, lang) : s.origin}</p> : null}
          <div className="af-player__styles">
            {s.genres.map((g) => (
              <Link key={g} to={`${routeFor('video')}?style=${encodeURIComponent(g)}`} className="af-gpill">{g}</Link>
            ))}
          </div>
        </div>
        <div className="af-player__actions">
          <ShareButton s={s} lang={lang} />
          <a className="af-btn af-btn--ghost" href={`https://www.youtube.com/watch?v=${s.youtubeId}`} target="_blank" rel="noreferrer">{L.youtube}</a>
        </div>
      </div>

      <div className="af-wrap af-player__next">
        <h2 className="af-kicker">{L.related}</h2>
        <div className="af-lib__grid">
          {related.map((o) => <SessionCard key={o.youtubeId} s={o} lang={lang} />)}
        </div>
      </div>
    </section>
  )
}
