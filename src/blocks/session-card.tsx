import { Link } from '@fayz-ai/storefront'
import { afcNumber, genreAccent, sessionThumb, setHref, venueLabel, type Session } from '../content/entities'
import { pick, type Lang } from '../i18n'
import { UI } from '../i18n/ui'
import { usePlayer } from './player-store'

/** The play mark, drawn rather than a glyph, so it centres the same everywhere. */
export function PlayMark({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M6 4.5 L19 12 L6 19.5 Z" fill="currentColor" />
    </svg>
  )
}

/** A set as a card: the tile opens its page, the round button plays it in the
 *  docked mini player without leaving this one. The accent is the genre's and
 *  is always beside the genre's name. */
export function SessionCard({ s, lang }: { s: Session; lang: Lang }) {
  const t = UI[lang]
  const playing = usePlayer((p) => p.current?.youtubeId === s.youtubeId)
  const play = usePlayer((p) => p.play)
  const where = s.origin ?? (s.venue !== 'living-room' ? venueLabel[s.venue] : null)
  return (
    <article className={`af-scard${playing ? ' af-scard--on' : ''}`} style={{ ['--genre' as string]: genreAccent(s) }}>
      <span className="af-scard__acc" />
      <div className="af-scard__ph">
        {/* A second link to the same page, for the pointer; keyboard and screen
            readers get the one on the artist's name. */}
        <Link to={setHref(s)} className="af-scard__media" tabIndex={-1} aria-hidden="true">
          <img src={sessionThumb(s)} alt="" className="af-photo" loading="lazy" />
          <span className="af-scard__scrim" />
        </Link>
        <span className="af-scard__chip">{afcNumber(s)}</span>
        {playing ? <span className="af-scard__now">{t.player.nowPlaying}</span> : null}
        <button type="button" className="af-scard__play" aria-label={t.library.playMini(s.artist)} aria-pressed={playing} onClick={() => play(s)}>
          <PlayMark />
        </button>
      </div>
      <div className="af-scard__sb">
        <h3 className="af-scard__artist">
          <Link to={setHref(s)}>{s.artist}</Link>
        </h3>
        <div className="af-scard__ge">
          <span className="af-scard__dot" />
          <span>{[s.genres.join(' · '), where].filter(Boolean).join(' · ')}</span>
        </div>
        {s.note ? <p className="af-scard__note">{pick(s.note, lang)}</p> : null}
      </div>
    </article>
  )
}
