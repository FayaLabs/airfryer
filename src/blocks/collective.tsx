import { useMemo } from 'react'
import { Reveal } from '@fayz-ai/storefront'
import { pick, routeFor, useLang } from '../i18n'
import { useI18nProps } from '../i18n/resolve'
import { UI } from '../i18n/ui'
import { crew, events, houseRules, newestFirst, partners, sessions } from '../content/entities'
import { CtaLink, Headline, type Cta } from './brand'
import { SessionCard } from './session-card'

// The collective's records rendered: sessions, events, crew, rules, partners.
// Every list defaults to the entities file, so a page only passes copy.

function SectionHeader({ eyebrow, title, accent, text, action }: { eyebrow?: string; title: string; accent?: string; text?: string; action?: Cta }) {
  return (
    <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 'clamp(32px, 5vw, 56px)' }}>
      <div style={{ display: 'grid', gap: 20, maxWidth: 760 }}>
        {eyebrow ? <span className="af-eyebrow">{eyebrow}</span> : null}
        <Headline text={title} accent={accent} />
        {text ? <p className="af-lead" style={{ margin: 0 }}>{text}</p> : null}
      </div>
      {action ? <CtaLink cta={action} variant="ghost" /> : null}
    </header>
  )
}

export interface AfSessionsProps {
  eyebrow?: string
  title?: string
  accent?: string
  text?: string
  limit?: number
  /** These sets, in this order, instead of the newest. */
  ids?: string[]
  action?: Cta
  anchor?: string
}

/** The latest sets: the Library's card, newest first. The full wall is /library. */
export function AfSessions(raw: AfSessionsProps) {
  const { eyebrow, title = '', accent, text, limit, ids, action, anchor } = useI18nProps(raw)
  const lang = useLang()
  const list = useMemo(() => {
    if (ids) return ids.flatMap((id) => sessions.filter((s) => s.youtubeId === id))
    const ordered = newestFirst(sessions)
    return limit ? ordered.slice(0, limit) : ordered
  }, [ids, limit])
  return (
    <section id={anchor} className="af-section" style={{ scrollMarginTop: 72 }}>
      <div className="af-wrap">
        <SectionHeader eyebrow={eyebrow} title={title} accent={accent} text={text} action={action} />
        <div className="af-lib__grid">
          {list.map((s) => <SessionCard key={s.youtubeId} s={s} lang={lang} />)}
        </div>
      </div>
    </section>
  )
}

/** Gigs as ticket stubs: date, venue, what happened. */
export function AfEvents({ eyebrow, title, accent, text }: { eyebrow?: string; title?: string; accent?: string; text?: string }) {
  const lang = useLang()
  const t = UI[lang].events
  eyebrow ??= t.eyebrow
  title ??= t.title
  return (
    <section className="af-section">
      <div className="af-wrap">
        <SectionHeader eyebrow={eyebrow} title={title} accent={accent} text={text} />
        <div style={{ display: 'grid', gap: 20 }}>
          {events.map((e, i) => (
            <Reveal key={`${e.title}-${e.venue}`} delay={i * 80}>
              <article className="af-ticket" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                  <div className="af-frame" style={{ borderRadius: 0, minHeight: 220 }}>
                    <img src={e.image} alt="" className="af-photo af-photo--bw" loading="lazy" />
                  </div>
                  <div style={{ padding: 'clamp(24px, 3vw, 36px)', display: 'grid', gap: 14, alignContent: 'center' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                      <span className="af-mono">{pick(e.date, lang)}</span>
                      <span className="af-mono af-muted">· {e.city}</span>
                      {e.status ? <span className="af-pill af-pill--heat">{pick(e.status, lang)}</span> : null}
                    </div>
                    <h3 className="af-h3" style={{ fontSize: 'clamp(24px, 3vw, 34px)' }}>
                      {e.title} <span className="af-muted">@ {e.venue}</span>
                    </h3>
                    <p className="af-body" style={{ margin: 0 }}>{pick(e.text, lang)}</p>
                    {e.facts ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {e.facts.map((f) => <span key={f.en} className="af-pill">{pick(f, lang)}</span>)}
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/** The first night out of the room, as one big card: the original's event block. */
export function AfEventSpotlight(raw: { eyebrow?: string; title: string; text?: string; watch: string; photos: string }) {
  const { eyebrow, title, text, watch, photos } = useI18nProps(raw)
  const lang = useLang()
  const e = events[0]
  return (
    <section id="events" className="af-section" style={{ scrollMarginTop: 72 }}>
      <div className="af-wrap" style={{ display: 'grid', gap: 40 }}>
        <header style={{ display: 'grid', gap: 14, justifyItems: 'center', textAlign: 'center' }}>
          {eyebrow ? <span className="af-eyebrow">{eyebrow}</span> : null}
          <Headline text={title} />
          {text ? <p className="af-lead" style={{ margin: 0 }}>{text}</p> : null}
        </header>
        <article className="af-spot">
          <div className="af-spot__media">
            <img src={e.image} alt="" className="af-photo" loading="lazy" />
            {e.status ? <span className="af-pill" style={{ position: 'absolute', top: 16, left: 16 }}>{pick(e.status, lang)}</span> : null}
          </div>
          <div className="af-spot__body">
            <span className="af-mono af-muted">{pick(e.date, lang)} · {e.city}</span>
            <h3 className="af-h3" style={{ fontSize: 'clamp(24px, 3vw, 32px)' }}>{e.title} <span className="af-muted">@ {e.venue}</span></h3>
            <p className="af-body" style={{ margin: 0 }}>{pick(e.text, lang)}</p>
            {e.facts ? <div className="af-mono af-muted">{e.facts.map((f) => pick(f, lang)).join(' · ')}</div> : null}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 6 }}>
              <CtaLink cta={{ label: watch, href: `${routeFor('video')}?room=leaving-room` }} variant="ghost" />
              <CtaLink cta={{ label: photos, href: `${routeFor('experience')}#gallery` }} variant="ghost" />
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

/** Past nights as proof, for the partnerships page. */
export function AfCases(raw: {
  anchor?: string
  eyebrow?: string
  title: string
  accent?: string
  items: { status: string; date: string; title: string; text: string; facts: string[]; imageAlt: string }[]
  images: string[]
}) {
  const { anchor, eyebrow, title, accent, items, images } = useI18nProps(raw)
  return (
    <section id={anchor} className="af-section" style={{ scrollMarginTop: 72 }}>
      <div className="af-wrap">
        <SectionHeader eyebrow={eyebrow} title={title} accent={accent} />
        <div className="af-cases">
          {items.map((c, i) => (
            <article key={c.title} className="af-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div className="af-frame" style={{ aspectRatio: '16 / 10', borderRadius: 0 }}>
                <img src={images[i]} alt={c.imageAlt} className="af-photo" loading="lazy" />
                <span className="af-pill" style={{ position: 'absolute', top: 14, left: 14 }}>{c.status}</span>
              </div>
              <div style={{ padding: 24, display: 'grid', gap: 12 }}>
                <span className="af-mono af-muted">{c.date}</span>
                <h3 className="af-h3">{c.title}</h3>
                <p className="af-body" style={{ margin: 0 }}>{c.text}</p>
                <div className="af-mono af-muted">{c.facts.join(' · ')}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Numbered steps with the page's call to action at the end. */
export function AfSteps(raw: { eyebrow?: string; title: string; accent?: string; items: { title: string; text: string }[]; action?: Cta }) {
  const { eyebrow, title, accent, items, action } = useI18nProps(raw)
  return (
    <section className="af-section af-section--surface">
      <div className="af-wrap">
        <SectionHeader eyebrow={eyebrow} title={title} accent={accent} />
        <ol className="af-steps">
          {items.map((step, i) => (
            <li key={step.title} className="af-steps__item">
              <span className="af-mono af-muted">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="af-h3" style={{ fontSize: 20 }}>{step.title}</h3>
              <p className="af-body" style={{ margin: 0, fontSize: 15 }}>{step.text}</p>
            </li>
          ))}
        </ol>
        {action ? <div style={{ marginTop: 36 }}><CtaLink cta={action} /></div> : null}
      </div>
    </section>
  )
}

export function AfCrew(raw: { eyebrow?: string; title?: string; accent?: string; text?: string }) {
  const p = useI18nProps(raw)
  const lang = useLang()
  const t = UI[lang].crew
  const { accent, text } = p
  const eyebrow = p.eyebrow ?? t.eyebrow
  const title = p.title ?? t.title
  return (
    <section className="af-section">
      <div className="af-wrap">
        <SectionHeader eyebrow={eyebrow} title={title} accent={accent} text={text} />
        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {crew.map((m, i) => (
            <Reveal key={m.name} delay={i * 80}>
              <figure style={{ margin: 0, display: 'grid', gap: 16 }}>
                <div className="af-frame af-frame--vignette" style={{ aspectRatio: '3 / 4' }}>
                  <img src={m.portrait} alt={m.name} className="af-photo af-photo--bw" loading="lazy" />
                </div>
                <figcaption style={{ display: 'grid', gap: 6 }}>
                  <div className="af-h3" style={{ fontSize: 18 }}>{m.name}</div>
                  <div className="af-mono af-muted">{pick(m.role, lang)}</div>
                  <p className="af-body" style={{ margin: 0, fontSize: 15 }}>{pick(m.bio, lang)}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/** The house rules, printed like the card at the door. */
export function AfRules({ eyebrow, title }: { eyebrow?: string; title?: string }) {
  const lang = useLang()
  const t = UI[lang].rules
  eyebrow ??= t.eyebrow
  title ??= t.title
  return (
    <section className="af-section af-section--surface">
      <div className="af-wrap">
        <SectionHeader eyebrow={eyebrow} title={title} />
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 0 }}>
          {houseRules.map((r, i) => (
            <li key={r.title.en} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 16, padding: '22px 0', borderTop: '1px solid rgb(236 230 219 / 0.08)', alignItems: 'baseline' }}>
              <span className="af-mono af-muted">{String(i + 1).padStart(2, '0')}</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 24px', alignItems: 'baseline' }}>
                <span className="af-h3">{pick(r.title, lang)}</span>
                <span className="af-body">{pick(r.text, lang)}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** A loose photo wall; images keep their own aspect, the grid packs them. */
export function AfGallery(raw: { eyebrow?: string; title?: string; accent?: string; text?: string; images: string[]; alts?: string[]; action?: Cta; anchor?: string }) {
  const { eyebrow, title, accent, text, images, alts, action, anchor } = useI18nProps(raw)
  return (
    <section id={anchor} className="af-section" style={{ scrollMarginTop: 72 }}>
      <div className="af-wrap">
        {title ? <SectionHeader eyebrow={eyebrow} title={title} accent={accent} text={text} action={action} /> : null}
        <div style={{ columns: '3 260px', columnGap: 16 }}>
          {images.map((src, i) => (
            <Reveal key={src} delay={(i % 3) * 80} style={{ breakInside: 'avoid', marginBottom: 16 }}>
              <div className="af-frame">
                <img src={src} alt={alts?.[i] ?? ''} className="af-photo" loading="lazy" style={{ height: 'auto' }} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function AfPartners({ eyebrow, title }: { eyebrow?: string; title?: string }) {
  const lang = useLang()
  const t = UI[lang].partners
  eyebrow ??= t.eyebrow
  title ??= t.title
  return (
    <section className="af-section af-section--tight">
      <div className="af-wrap">
        <SectionHeader eyebrow={eyebrow} title={title} />
        <div style={{ display: 'grid', gap: 1, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', background: 'rgb(236 230 219 / 0.08)', border: '1px solid rgb(236 230 219 / 0.08)', borderRadius: 'var(--af-w-md)', overflow: 'hidden' }}>
          {partners.map((p) => (
            <div key={p.name} style={{ background: 'var(--af-ink)', padding: '28px 24px', display: 'grid', gap: 8 }}>
              <div className="af-h3" style={{ fontSize: 20 }}>{p.name}</div>
              <div className="af-mono af-muted">{pick(p.kind, lang)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export interface AfOffer {
  number?: string
  title: string
  text: string
  points?: string[]
}

/** What a brand or venue can do with us: formats as numbered cards. */
export function AfOffers(raw: { eyebrow?: string; title: string; accent?: string; text?: string; items: AfOffer[]; action?: Cta }) {
  const { eyebrow, title, accent, text, items, action } = useI18nProps(raw)
  return (
    <section className="af-section">
      <div className="af-wrap">
        <SectionHeader eyebrow={eyebrow} title={title} accent={accent} text={text} action={action} />
        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {items.map((o, i) => (
            <Reveal key={o.title} delay={i * 80}>
              <article className="af-card" style={{ padding: 28, height: '100%', display: 'grid', gap: 16, alignContent: 'start' }}>
                <span className="af-mono af-muted">{o.number ?? String(i + 1).padStart(2, '0')}</span>
                <h3 className="af-h3">{o.title}</h3>
                <p className="af-body" style={{ margin: 0 }}>{o.text}</p>
                {o.points ? (
                  <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }} className="af-body">
                    {o.points.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
