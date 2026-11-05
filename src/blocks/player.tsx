import { useEffect, useState, type MouseEvent } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Maximize2, X } from 'lucide-react'
import { afcNumber, setHref } from '../content/entities'
import { useLang } from '../i18n'
import { UI } from '../i18n/ui'
import { usePlayer } from './player-store'

// The one YouTube iframe on the site, mounted above the routes (see __root.tsx)
// so it survives navigation. An iframe reloads if it moves in the DOM, so it
// never does: only this wrapper's position changes, between the set page's frame
// and the docked mini player bottom-right. Playback carries across pages.

type Box = { top: number; left: number; width: number; height: number }

export function AfPlayerLayer() {
  const current = usePlayer((s) => s.current)
  const stage = usePlayer((s) => s.stage)
  const stageId = usePlayer((s) => s.stageId)
  const close = usePlayer((s) => s.close)
  const t = UI[useLang()].player
  const router = useRouter()
  const [box, setBox] = useState<Box | null>(null)
  const [stageVisible, setStageVisible] = useState(true)

  useEffect(() => {
    if (!stage) {
      setBox(null)
      setStageVisible(true)
      return
    }
    // In document coordinates, so the page's own scroll carries the player.
    const measure = () => {
      const r = stage.getBoundingClientRect()
      setBox({ top: r.top + window.scrollY, left: r.left + window.scrollX, width: r.width, height: r.height })
    }
    measure()
    const resize = new ResizeObserver(measure)
    resize.observe(stage)
    resize.observe(document.body)
    window.addEventListener('resize', measure)
    // Scrolled past the frame: dock, as HÖR does, and come back on the way up.
    const seen = new IntersectionObserver(([e]) => setStageVisible(e.isIntersecting), { threshold: 0.4 })
    seen.observe(stage)
    return () => {
      resize.disconnect()
      seen.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [stage])

  if (!current) return null
  const staged = !!box && stageVisible && stageId === current.youtubeId
  const href = setHref(current)
  const expand = (e: MouseEvent) => {
    e.preventDefault()
    // Already on this set's page and only scrolled away: go back up to the frame.
    if (stageId === current.youtubeId) window.scrollTo({ top: 0, behavior: 'smooth' })
    else void router.history.push(href)
  }

  return (
    <aside className={`af-dock${staged ? ' af-dock--stage' : ''}`} aria-label={t.label} style={staged ? box : undefined}>
      {staged ? null : (
        <header className="af-dock__bar">
          <a className="af-dock__btn" href={href} onClick={expand} aria-label={t.expand} title={t.expand}>
            <Maximize2 size={16} strokeWidth={2} aria-hidden />
          </a>
          <div className="af-dock__title">
            <span className="af-dock__label">{t.nowPlaying}</span>
            <span className="af-dock__name">{afcNumber(current)} — {current.artist}</span>
          </div>
          <button type="button" className="af-dock__btn" onClick={close} aria-label={t.close} title={t.close}>
            <X size={18} strokeWidth={2} aria-hidden />
          </button>
        </header>
      )}
      <div className="af-dock__frame">
        <iframe
          key={current.youtubeId}
          src={`https://www.youtube-nocookie.com/embed/${current.youtubeId}?autoplay=1&rel=0&playsinline=1`}
          title={`${current.artist} · Airfryer Collective`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </aside>
  )
}
