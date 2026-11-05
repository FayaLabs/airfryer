import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { ArrowUpRight, Asterisk, Play, Quote } from 'lucide-react'
import { Link, Reveal } from '@fayz-ai/storefront'
import { countries, social, stats, voices } from '../content/entities'
import { pick, routeFor, useLang } from '../i18n'
import { useI18nProps } from '../i18n/resolve'
import { UI } from '../i18n/ui'
import { glideTo, useHeroMotion, usePanelSwap } from '../lib/gsap-motion'
import { AfLou } from './lou'

// The collective's own sections, shared by every page. Plain props in, the
// `af-*` vintage system out; no data loading here.

type Cta = { label: string; href: string; icon?: 'play' }

function CtaLink({ cta, variant = 'primary' }: { cta: Cta; variant?: 'primary' | 'solid' | 'ghost' }) {
  const external = /^https?:|^mailto:/.test(cta.href)
  const anchor = cta.href.startsWith('#')
  const className = `af-btn af-btn--${variant}`
  const label = (
    <>
      {cta.icon === 'play' ? <Play size={14} fill="currentColor" strokeWidth={0} aria-hidden /> : null}
      {cta.label}
    </>
  )
  if (anchor) {
    // Same-page scroll (e.g. the hero's "Explore sessions" → #sessions), not a route.
    return (
      <a className={className} href={cta.href}>
        {label}
      </a>
    )
  }
  return external ? (
    <a className={className} href={cta.href} target={cta.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
      {label}
    </a>
  ) : (
    <Link to={cta.href} className={className}>
      {label}
    </Link>
  )
}

/** Headline with one word in the holographic italic, the dossier's signature. */
function Headline({ text, accent, as: Tag = 'h2', className = 'af-h2' }: { text: string; accent?: string; as?: 'h1' | 'h2'; className?: string }) {
  if (!accent || !text.includes(accent)) return <Tag className={className}>{text}</Tag>
  const [before, after] = text.split(accent)
  return (
    <Tag className={className}>
      {before}
      <span className="af-accent">{accent}</span>
      {after}
    </Tag>
  )
}

export interface AfHeroProps {
  eyebrow?: string
  title: string
  accent?: string
  subtitle?: string
  video?: string
  poster?: string
  image?: string
  primary?: Cta
  secondary?: Cta
  height?: 'screen' | 'tall'
}

/** Full-bleed documentary footage (or a photo) with cream type over it. The
 *  screen hero fills the viewport behind the header, centred, with Lou walking. */
export function AfHero(raw: AfHeroProps) {
  const { eyebrow, title, accent, subtitle, video, poster, image, primary, secondary, height = 'screen' } = useI18nProps(raw)
  // Footage only for visitors who haven't asked for less motion; checked after
  // mount, so the server and the first client render agree (poster first).
  const [motionOk, setMotionOk] = useState(false)
  useEffect(() => setMotionOk(!window.matchMedia('(prefers-reduced-motion: reduce)').matches), [])
  const rootRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  useHeroMotion(rootRef, bgRef)
  const still = poster ?? image
  return (
    <section ref={rootRef} className={`af-hero af-hero--${height}`}>
      {/* Oversized so the parallax drift never reveals a gap at the edges. */}
      <div ref={bgRef} aria-hidden className="af-hero__media">
        {video && motionOk ? (
          <video autoPlay muted loop playsInline poster={poster}>
            <source src={video} type="video/mp4" />
          </video>
        ) : still ? (
          <img src={still} alt="" className="af-photo" fetchPriority="high" />
        ) : null}
      </div>
      <div aria-hidden className="af-hero__scrim" />
      {height === 'screen' ? <AfLou /> : null}
      <div className="af-wrap af-hero__body">
        <div className="af-hero__copy">
          {eyebrow ? <div className="af-eyebrow" data-rise>{eyebrow}</div> : null}
          <div data-rise><Headline as="h1" className="af-display" text={title} accent={accent} /></div>
          {subtitle ? <p className="af-lead af-hero__lead" data-rise>{subtitle}</p> : null}
          {primary || secondary ? (
            <div className="af-hero__cta" data-rise>
              {primary ? <CtaLink cta={primary} /> : null}
              {secondary ? <CtaLink cta={secondary} variant="ghost" /> : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export interface AfMarqueeProps {
  items?: string[]
  loud?: boolean
  speed?: number
}

export function AfMarquee(raw: AfMarqueeProps) {
  const { items, loud, speed = 30 } = useI18nProps(raw)
  const lang = useLang()
  const list = items ?? countries[lang]
  const row = [...list, ...list]
  return (
    <div className={`af-marquee${loud ? ' af-marquee--loud' : ''}`} aria-hidden>
      <div className="af-marquee__track" style={{ ['--af-marquee-speed' as string]: `${speed}s` }}>
        {row.map((item, i) => (
          <span key={i} className="af-marquee__item">
            {item}
            <Asterisk size={28} strokeWidth={2.5} color="var(--af-muted)" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  )
}

export function AfStats(raw: { note?: string }) {
  const { note } = useI18nProps(raw)
  const lang = useLang()
  const items = stats.map((s) => ({ value: s.value, label: pick(s.label, lang) }))
  return (
    <section className="af-section af-section--tight">
      <div className="af-wrap">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 24 }}>
          {items.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div style={{ borderLeft: '1px solid var(--af-line)', paddingLeft: 20 }}>
                <div style={{ fontFamily: 'var(--af-display)', fontWeight: 800, fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 1, letterSpacing: '-0.04em', color: 'var(--af-cream)' }}>{s.value}</div>
                <div className="af-mono af-muted" style={{ marginTop: 10 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
        {note ? <p className="af-mono af-muted" style={{ marginTop: 32 }}>{note}</p> : null}
      </div>
    </section>
  )
}

export interface AfStoryProps {
  eyebrow?: string
  title: string
  accent?: string
  paragraphs: string[]
  image?: string
  imageAlt?: string
  side?: 'left' | 'right'
  cta?: Cta
  tone?: 'base' | 'dark' | 'surface'
  aspect?: string
  anchor?: string
}

/** Text beside a framed photo, or beside the spinning record. */
export function AfStory(raw: AfStoryProps) {
  const { eyebrow, title, accent, paragraphs, image, imageAlt = '', side = 'right', cta, tone = 'base', aspect = '4 / 5', anchor } = useI18nProps(raw)
  const media: ReactNode = image ? (
    <div className="af-frame af-frame--vignette" style={{ aspectRatio: aspect }}>
      <img src={image} alt={imageAlt} className="af-photo" loading="lazy" />
    </div>
  ) : null
  return (
    <section id={anchor} style={{ scrollMarginTop: 72 }} className={`af-section${tone === 'surface' ? ' af-section--surface' : ''}`}>
      <div className="af-wrap af-grid-2">
        {side === 'left' ? <Reveal>{media}</Reveal> : null}
        <Reveal>
          <div style={{ display: 'grid', gap: 24 }}>
            {eyebrow ? <span className="af-eyebrow">{eyebrow}</span> : null}
            <Headline text={title} accent={accent} />
            {paragraphs.map((p, i) => (
              <p key={i} className={i === 0 ? 'af-lead' : 'af-body'} style={{ margin: 0 }}>{p}</p>
            ))}
            {cta ? <div><CtaLink cta={cta} variant="ghost" /></div> : null}
          </div>
        </Reveal>
        {side === 'right' ? <Reveal>{media}</Reveal> : null}
      </div>
    </section>
  )
}

/** Artists in their own words, under "why we dance" where a page passes it. */
export function AfVoices(raw: { eyebrow?: string; title?: string; text?: string; cta?: Cta }) {
  const p = useI18nProps(raw)
  const lang = useLang()
  const t = UI[lang].voices
  const eyebrow = p.eyebrow ?? t.eyebrow
  const title = p.title ?? t.title
  // Two copies of the list so the track can scroll forever; the second copy is
  // decorative (aria-hidden) and hides under reduced motion, where the rail
  // becomes a plain horizontal scroll instead.
  const loop = [...voices, ...voices]
  return (
    <section id="community" className="af-section af-section--surface" style={{ scrollMarginTop: 72 }}>
      <div className="af-wrap">
        <header style={{ display: 'grid', gap: 20, marginBottom: 48, justifyItems: 'start' }}>
          <span className="af-eyebrow">{eyebrow}</span>
          <h2 className="af-h2">{title}</h2>
          {p.text ? <p className="af-lead" style={{ margin: 0 }}>{p.text}</p> : null}
          {p.cta ? <CtaLink cta={p.cta} variant="ghost" /> : null}
        </header>
      </div>
      <div className="af-voices" aria-label={title}>
        <ul className="af-voices__track">
          {loop.map((v, i) => (
            <li key={i} className={`af-voices__item${i >= voices.length ? ' af-voices__item--dup' : ''}`} aria-hidden={i >= voices.length}>
              <figure className="af-card af-voices__card" style={{ margin: 0, padding: 28, height: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
                <Quote size={28} strokeWidth={1.5} color="var(--af-muted)" aria-hidden />
                <blockquote style={{ margin: 0, fontFamily: 'var(--af-serif)', fontStyle: 'italic', fontSize: 19, lineHeight: 1.45, color: 'var(--af-cream)' }}>{pick(v.quote, lang)}</blockquote>
                <figcaption style={{ marginTop: 'auto' }}>
                  <div className="af-h3" style={{ fontSize: 16 }}>{v.name}</div>
                  <div className="af-mono af-muted" style={{ marginTop: 6 }}>{pick(v.detail, lang)}</div>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const WHO_ART = ['/media/who/venues.webp', '/media/who/music.webp', '/media/who/djs.webp']
const clampPos = (v: number) => Math.min(2, Math.max(0, v))

/** The original's crossfader, as a real one: drag it (or swipe the section, or
 *  use the arrow keys) and the record's picture crossfades with the position,
 *  the disc scratches, and the text swaps in the direction of travel. */
export function AfWhoWeAre() {
  const lang = useLang()
  const t = UI[lang].who
  const [pos, setPos] = useState(1)
  const active = Math.round(pos)
  const links = [routeFor('partnerships'), '', social.instagram]
  const panelsRef = useRef<HTMLDivElement>(null)
  usePanelSwap(panelsRef, active)

  const glide = useRef<ReturnType<typeof glideTo>>(null)
  const posRef = useRef(pos)
  posRef.current = pos
  const goTo = (target: number) => {
    glide.current?.kill()
    glide.current = glideTo(posRef.current, clampPos(target), setPos)
  }
  useEffect(() => () => void glide.current?.kill(), [])

  // Swipe anywhere on the section (the disc too, with a mouse). A vertical move
  // stays a page scroll; the section's touch-action leaves that to the browser.
  const swipe = useRef<{ x: number; y: number; start: number; width: number; on: boolean } | null>(null)
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = e.target as HTMLElement
    if (el.closest('input, button, a')) return
    if (e.pointerType === 'mouse' && !el.closest('.af-disc')) return
    glide.current?.kill()
    swipe.current = { x: e.clientX, y: e.clientY, start: posRef.current, width: e.currentTarget.clientWidth, on: false }
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const s = swipe.current
    if (!s) return
    const dx = e.clientX - s.x
    if (!s.on) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(e.clientY - s.y)) return
      s.on = true
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    setPos(clampPos(s.start - (dx / s.width) * 2))
  }
  const endSwipe = () => {
    const s = swipe.current
    swipe.current = null
    if (!s?.on) return
    // A flick counts even if it didn't cross halfway.
    const moved = posRef.current - s.start
    goTo(Math.abs(moved) > 0.18 ? Math.round(s.start) + Math.sign(moved) : Math.round(s.start))
  }

  return (
    <section id="about" className="af-section" style={{ scrollMarginTop: 72 }}>
      <div className="af-wrap af-grid-2 af-who" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endSwipe} onPointerCancel={endSwipe}>
        <div aria-hidden className="af-disc" style={{ ['--pos' as string]: pos }}>
          <div className="af-disc__spin">
            <div className="af-disc__plate" />
          </div>
          <div className="af-disc__label">
            {WHO_ART.map((src, i) => {
              const d = pos - i
              return (
                <img
                  key={src}
                  src={src}
                  alt=""
                  draggable={false}
                  style={{ opacity: Math.max(0, 1 - Math.abs(d) * 1.7), transform: `rotate(${d * -46}deg) scale(${1 - Math.abs(d) * 0.16})` }}
                />
              )
            })}
          </div>
        </div>
        <div style={{ display: 'grid', gap: 28 }}>
          <div className="af-fader">
            <div className="af-fader__labels">
              {t.labels.map((label, i) => (
                <button key={label} type="button" className="af-fader__label" aria-pressed={active === i} onClick={() => goTo(i)}>{label}</button>
              ))}
            </div>
            <input
              type="range"
              className="af-fader__range"
              min={0}
              max={2}
              step={0.01}
              value={pos}
              onChange={(e) => {
                glide.current?.kill()
                setPos(Number(e.target.value))
              }}
              onPointerUp={() => goTo(Math.round(posRef.current))}
              onKeyDown={(e) => {
                const to = { ArrowLeft: active - 1, ArrowDown: active - 1, ArrowRight: active + 1, ArrowUp: active + 1, Home: 0, End: 2 }[e.key]
                if (to === undefined) return
                e.preventDefault()
                goTo(to)
              }}
              aria-label={t.fader}
              aria-valuetext={t.labels[active]}
            />
          </div>
          <div ref={panelsRef} className="af-who__panels">
            {t.panels.map((panel, i) => (
              <div key={panel.title} data-panel data-active={active === i} className="af-who__panel" inert={active !== i}>
                <h2 className="af-h2" data-panel-item>{panel.title}</h2>
                <p className="af-lead" style={{ margin: 0 }} data-panel-item>{panel.lead}</p>
                <div className="af-who__boxes">
                  {panel.boxes.map((box) => (
                    <div key={box.title} className="af-who__box" data-panel-item>
                      <h3 className="af-who__title">{box.title}</h3>
                      <p className="af-body" style={{ margin: 0, fontSize: 15 }}>{box.text}</p>
                    </div>
                  ))}
                </div>
                {panel.link ? <div data-panel-item><CtaLink cta={{ label: panel.link, href: links[i] }} variant="ghost" /></div> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/** "Let's make noise": the four ways to reach us, as cards. */
export function AfContact(raw: { title: string; accent?: string; text?: string }) {
  const { title, accent, text } = useI18nProps(raw)
  const t = UI[useLang()].contact
  const cards: { title: string; text: string; href: string; external?: boolean }[] = [
    { title: t.ig, text: '@airfryer_collective', href: social.instagram, external: true },
    { title: t.yt, text: t.ytText, href: social.youtube, external: true },
    { title: t.email, text: social.email, href: `mailto:${social.email}` },
    { title: t.partners, text: t.partnersText, href: routeFor('partnerships') },
  ]
  return (
    <section id="contact" className="af-section" style={{ scrollMarginTop: 72 }}>
      <div className="af-wrap" style={{ display: 'grid', gap: 40 }}>
        <header style={{ display: 'grid', gap: 14, justifyItems: 'center', textAlign: 'center' }}>
          <Headline text={title} accent={accent} />
          {text ? <p className="af-lead" style={{ margin: 0 }}>{text}</p> : null}
        </header>
        <div className="af-contact">
          {cards.map((c) => {
            const body = (
              <>
                <span className="af-contact__title">{c.title} <ArrowUpRight size={16} strokeWidth={2} aria-hidden /></span>
                <span className="af-contact__text">{c.text}</span>
              </>
            )
            return c.href.startsWith('/') ? (
              <Link key={c.title} to={c.href} className="af-contact__card">{body}</Link>
            ) : (
              <a key={c.title} href={c.href} className="af-contact__card" target={c.external ? '_blank' : undefined} rel="noreferrer">{body}</a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export interface AfCtaProps {
  eyebrow?: string
  title: string
  accent?: string
  text?: string
  primary?: Cta
  secondary?: Cta
  image?: string
  /** The page's one job: the main-action yellow instead of the quiet cream. */
  loud?: boolean
}

/** Closing call to action over a dimmed photo. */
export function AfCta(raw: AfCtaProps) {
  const { eyebrow, title, accent, text, primary, secondary, image, loud } = useI18nProps(raw)
  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: 'var(--af-well)' }}>
      {image ? <img src={image} alt="" aria-hidden className="af-photo af-photo--bw" style={{ position: 'absolute', inset: 0, opacity: 0.28 }} /> : null}
      <div className="af-wrap af-wrap--narrow" style={{ position: 'relative', paddingBlock: 'clamp(80px, 12vw, 152px)', textAlign: 'center', display: 'grid', gap: 24, justifyItems: 'center' }}>
        {eyebrow ? <span className="af-eyebrow af-eyebrow--plain">{eyebrow}</span> : null}
        <Headline text={title} accent={accent} />
        {text ? <p className="af-lead" style={{ margin: 0 }}>{text}</p> : null}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 8 }}>
          {primary ? <CtaLink cta={primary} variant={loud ? 'primary' : 'solid'} /> : null}
          {secondary ? <CtaLink cta={secondary} variant="ghost" /> : null}
        </div>
      </div>
    </section>
  )
}

export { CtaLink, Headline }
export type { Cta }
