import { useEffect, useMemo, useState } from 'react'
import { create } from 'zustand'
import { Check, Minus, Play, Plus } from 'lucide-react'
import type { BlockNode } from '@fayz-ai/core'
import type { Product } from '@fayz-ai/shop/types'
import {
  Link,
  Reveal,
  formatMoney,
  getProductOptionGroups,
  selectionPrice,
  useBlockData,
  useMarketProduct,
  useStorefrontActions,
  type ProductOptionSelection,
} from '@fayz-ai/storefront'
import { TEE_FALLBACK, TEE_LOOKS, TEE_PACKSHOTS, TEE_SLUG } from '../content/tee'
import { social } from '../content/entities'
import { LANG_META, routeFor, useLang, type Lang } from '../i18n'
import { UI } from '../i18n/ui'
import { Headline } from './brand'

// The shirt's landing page, as blocks. Every block that shows a price or sells
// declares the same `products.bySlug` need, so the server resolves the row once
// and the page renders the live price and stock with no client fetch.

export const TEE_DATA = { product: { loader: 'products.bySlug', params: { slug: TEE_SLUG } } } as const

type BlockProps = { node?: BlockNode }

function useTee(node: BlockNode | undefined) {
  const res = useBlockData<Product | null>(node, 'product', TEE_DATA.product)
  // The product as the SDK returns it from the backend (price, currency,
  // options/variants all come from the Control SDK — nothing overridden here).
  const product = useMarketProduct(res.data ?? null)
  const view = product ?? TEE_FALLBACK
  return { product, view }
}

/** One selection for the whole page: the sticky bar and the closing section
 *  buy what the buy box shows, not a fresh default. */
const useTeeState = create<{
  selection: ProductOptionSelection
  quantity: number
  setSelection: (s: ProductOptionSelection) => void
  setQuantity: (n: number) => void
}>((set) => ({
  selection: {},
  quantity: 1,
  setSelection: (selection) => set({ selection }),
  setQuantity: (quantity) => set({ quantity }),
}))

/** Option axis names as GoControl writes them, per language. */
const OPTION_LABELS: Record<string, Record<Lang, string>> = {
  tamanho: { en: 'Size', es: 'Talla', pt: 'Tamanho' },
  size: { en: 'Size', es: 'Talla', pt: 'Tamanho' },
  cor: { en: 'Colour', es: 'Color', pt: 'Cor' },
}
function optionLabel(label: string, lang: Lang) {
  return OPTION_LABELS[label.toLowerCase()]?.[lang] ?? label
}

/** Selection, price and the two buy verbs. Never adds the fallback. */
function useTeeBuy(product: Product | null, view: typeof TEE_FALLBACK) {
  const actions = useStorefrontActions()
  const groups = useMemo(() => (product ? getProductOptionGroups(product) : []), [product])
  const { selection, setSelection, quantity, setQuantity } = useTeeState()
  const missing = groups.filter((g) => !selection[g.id])
  const price = product ? selectionPrice(product, selection) : view.price
  const canBuy = !!product && missing.length === 0 && !product.metadata?.unavailableInMarket
  const add = (checkout: boolean) => {
    if (!product || !canBuy) return
    actions.addToCart(product, quantity, selection)
    if (checkout) actions.navigateTo('/checkout')
  }
  return { groups, selection, setSelection, quantity, setQuantity, price, canBuy, missing, add }
}

function money(value: number, currency: string, lang: Lang) {
  return formatMoney(value, currency || 'BRL', LANG_META[lang].intl)
}

function Stock({ count, lang }: { count: number; lang: Lang }) {
  if (!count || count <= 0) return null
  const t = UI[lang].tee
  const low = count <= 10
  return <div className="af-mono" style={{ color: low ? 'var(--af-heat)' : 'rgb(236 230 219 / 0.8)' }}>{low ? t.last(count) : t.pieces(count)}</div>
}

const GALLERY = [
  { src: TEE_PACKSHOTS.back, contain: true },
  { src: TEE_LOOKS.partyBack },
  { src: TEE_PACKSHOTS.front, contain: true },
  { src: TEE_LOOKS.partyFront },
  { src: TEE_LOOKS.front },
  { src: TEE_LOOKS.streetNight },
]

function Gallery({ lang }: { lang: Lang }) {
  const t = UI[lang].tee
  const [active, setActive] = useState(0)
  const current = GALLERY[active]
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div className="af-frame af-gallery-main" style={{ background: current.contain ? '#e6dccd' : 'var(--af-surface)' }}>
        <img
          key={current.src}
          className={current.contain ? undefined : 'af-photo'}
          src={current.src}
          alt={t.gallery[active]}
          style={current.contain ? { width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' } : undefined}
          fetchPriority={active === 0 ? 'high' : undefined}
          width={1000}
          height={1250}
        />
        <span className="af-pill" style={{ position: 'absolute', left: 14, bottom: 14 }}>{String(active + 1).padStart(2, '0')} / {String(GALLERY.length).padStart(2, '0')}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GALLERY.length}, 1fr)`, gap: 8 }}>
        {GALLERY.map((g, i) => (
          <button
            key={g.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={t.photo(i + 1)}
            aria-pressed={i === active}
            className="af-plain-btn af-thumb"
            style={{ background: g.contain ? '#e6dccd' : 'var(--af-surface)' }}
          >
            <img src={g.src} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: g.contain ? 'contain' : 'cover', display: 'block', mixBlendMode: g.contain ? 'multiply' : undefined }} />
          </button>
        ))}
      </div>
    </div>
  )
}

function QtyStepper({ value, onChange, lang }: { value: number; onChange: (n: number) => void; lang: Lang }) {
  const t = UI[lang].tee
  const btn = { width: 48, height: 52, display: 'grid', placeItems: 'center', borderRadius: 999 }
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid rgb(236 230 219 / 0.22)', borderRadius: 999 }}>
      <button type="button" className="af-plain-btn" style={btn} aria-label={t.less} disabled={value <= 1} onClick={() => onChange(Math.max(1, value - 1))}><Minus size={16} aria-hidden /></button>
      <span className="af-price" style={{ minWidth: 20, textAlign: 'center', fontFamily: 'var(--af-display)', fontWeight: 700 }} aria-live="polite">{value}</span>
      <button type="button" className="af-plain-btn" style={btn} aria-label={t.more} disabled={value >= 5} onClick={() => onChange(Math.min(5, value + 1))}><Plus size={16} aria-hidden /></button>
    </div>
  )
}

/** Above the fold: gallery, the pitch, the price and the button. */
export function AfTeeBuy({ node }: BlockProps) {
  const lang = useLang()
  const t = UI[lang].tee
  const { product, view } = useTee(node)
  const buy = useTeeBuy(product, view)
  return (
    <section id="af-buy" style={{ paddingBlock: 'clamp(24px, 4vw, 56px) clamp(48px, 8vw, 96px)' }}>
      <div className="af-wrap" style={{ display: 'grid', gap: 'clamp(28px, 5vw, 64px)', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', alignItems: 'start' }}>
        <Gallery lang={lang} />
        <div style={{ display: 'grid', gap: 20, position: 'sticky', top: 88 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span className="af-pill af-pill--live">{t.oneOff}</span>
            <span className="af-pill">{t.noRestock}</span>
          </div>
          <span className="af-eyebrow">{t.eyebrow}</span>
          <h1 className="af-h2" style={{ fontSize: 'clamp(40px, 5.2vw, 68px)' }}>
            Viva los seres <span className="af-accent">que bailan</span>
          </h1>
          <p className="af-lead" style={{ margin: 0 }}>{t.pitch}</p>
          <div style={{ display: 'grid', gap: 6 }}>
            <span className="af-price" style={{ fontFamily: 'var(--af-display)', fontWeight: 700, fontSize: 40, lineHeight: 1 }}>{money(buy.price, view.currency, lang)}</span>
            {lang !== 'pt' && view.currency === 'BRL' ? <span className="af-mono af-muted">{t.priceNote}</span> : null}
          </div>
          <Stock count={view.inventoryCount} lang={lang} />

          {buy.groups.map((g) => (
            <fieldset key={g.id} style={{ border: 0, padding: 0, margin: 0, display: 'grid', gap: 10 }}>
              <legend className="af-mono af-muted" style={{ marginBottom: 10 }}>{optionLabel(g.label, lang)}{buy.selection[g.id] ? `: ${buy.selection[g.id]}` : ''}</legend>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {g.values.map((v) => {
                  const on = buy.selection[g.id] === v
                  return (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={on}
                      onClick={() => buy.setSelection({ ...buy.selection, [g.id]: v })}
                      className="af-plain-btn"
                      style={{ minWidth: 52, height: 48, padding: '0 14px', boxSizing: 'border-box', borderRadius: 999, textAlign: 'center', lineHeight: '48px', fontFamily: 'var(--af-display)', fontWeight: 700, border: `1px solid ${on ? 'var(--af-cream)' : 'rgb(236 230 219 / 0.22)'}`, background: on ? 'var(--af-cream)' : 'transparent', color: on ? 'var(--af-ink)' : 'var(--af-cream)', transition: 'background 0.2s, color 0.2s' }}
                    >
                      {v}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          ))}

          <div id="af-buy-row" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <QtyStepper value={buy.quantity} onChange={buy.setQuantity} lang={lang} />
            <button type="button" className="af-btn af-btn--primary" style={{ flex: 1 }} disabled={!buy.canBuy} onClick={() => buy.add(false)}>
              {buy.missing.length ? t.choose(optionLabel(buy.missing[0].label, lang)) : t.add}
            </button>
          </div>
          <button type="button" className="af-btn af-btn--ghost af-btn--block" disabled={!buy.canBuy} onClick={() => buy.add(true)}>
            {t.buyNow}
          </button>
          {!product ? <p className="af-mono af-muted" style={{ margin: 0 }}>{t.offline}</p> : null}
          <ul style={{ listStyle: 'none', margin: 0, padding: '18px 0 0', borderTop: '1px solid rgb(236 230 219 / 0.08)', display: 'flex', flexWrap: 'wrap', gap: '10px 22px' }}>
            {t.trust.map((item) => (
              <li key={item} className="af-mono af-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Check size={14} color="var(--af-heat)" aria-hidden /> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/** Bottom bar once the buy box has scrolled away; the button never leaves reach. */
export function AfTeeSticky({ node }: BlockProps) {
  const lang = useLang()
  const t = UI[lang].tee
  const { product, view } = useTee(node)
  const buy = useTeeBuy(product, view)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    // Shown while the buy button itself is out of view (scrolled past or,
    // on a phone, not reached yet), hidden over the closing CTA and the footer.
    const target = document.getElementById('af-buy-row')
    const others = [document.getElementById('af-final'), document.querySelector('footer')].filter(Boolean) as Element[]
    if (!target || typeof IntersectionObserver === 'undefined') return
    const seen = new Map<Element, boolean>()
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) seen.set(e.target, e.isIntersecting)
      setShown(!(seen.get(target) ?? true) && !others.some((el) => seen.get(el)))
    })
    io.observe(target)
    for (const el of others) io.observe(el)
    return () => io.disconnect()
  }, [])
  // The docked video player sits above this bar, never under it.
  useEffect(() => {
    const root = document.documentElement.style
    if (shown) root.setProperty('--af-dock-offset', '72px')
    else root.removeProperty('--af-dock-offset')
    return () => {
      root.removeProperty('--af-dock-offset')
    }
  }, [shown])
  const needsChoice = buy.missing.length > 0
  return (
    <div
      aria-hidden={!shown}
      inert={!shown}
      style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 40, transform: shown ? 'none' : 'translateY(110%)', transition: 'transform 0.3s var(--af-ease)', background: 'rgb(20 18 16 / 0.94)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgb(236 230 219 / 0.1)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="af-wrap" style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBlock: 10 }}>
        <img src={TEE_PACKSHOTS.back} alt="" width={48} height={48} style={{ objectFit: 'contain', background: '#e6dccd', borderRadius: 8, flexShrink: 0 }} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: 'var(--af-display)', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
          <div className="af-mono af-muted af-price">{money(buy.price, view.currency, lang)}</div>
        </div>
        {needsChoice ? (
          <a href="#af-buy" className="af-btn af-btn--primary" style={{ minHeight: 44, padding: '0 20px' }}>{t.choose(optionLabel(buy.missing[0].label, lang))}</a>
        ) : (
          <button type="button" className="af-btn af-btn--primary" disabled={!buy.canBuy} onClick={() => buy.add(false)} style={{ minHeight: 44, padding: '0 20px' }}>{t.add}</button>
        )}
      </div>
    </div>
  )
}

export interface AfVideoProps {
  eyebrow?: string
  title?: string
  accent?: string
  text?: string
  /** A YouTube id, or a direct mp4. Empty leaves a framed poster as the slot. */
  youtubeId?: string
  src?: string
  poster?: string
  ratio?: string
}

/** The video slot. Empty, it is a placeholder that still sells (poster + copy). */
export function AfVideo({ eyebrow, title, accent, text, youtubeId, src, poster, ratio = '16 / 9' }: AfVideoProps) {
  const t = UI[useLang()].video
  const [playing, setPlaying] = useState(false)
  const hasVideo = !!(youtubeId || src)
  return (
    <section className="af-section">
      <div className="af-wrap" style={{ display: 'grid', gap: 36 }}>
        {title ? (
          <header style={{ display: 'grid', gap: 18, maxWidth: 760 }}>
            {eyebrow ? <span className="af-eyebrow">{eyebrow}</span> : null}
            <Headline text={title} accent={accent} />
            {text ? <p className="af-lead" style={{ margin: 0 }}>{text}</p> : null}
          </header>
        ) : null}
        <div className="af-frame af-frame--vignette" style={{ aspectRatio: ratio }}>
          {playing && youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
              title={title ?? 'Video'}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
            />
          ) : playing && src ? (
            <video src={src} poster={poster} controls autoPlay playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <button type="button" className="af-plain-btn" disabled={!hasVideo} onClick={() => setPlaying(true)} aria-label={hasVideo ? t.play : t.soon} style={{ position: 'absolute', inset: 0, opacity: 1, cursor: hasVideo ? 'pointer' : 'default' }}>
              {poster ? <img src={poster} alt="" className="af-photo" loading="lazy" style={{ opacity: 0.7 }} /> : null}
              <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                <span style={{ display: 'grid', justifyItems: 'center', gap: 14 }}>
                  <span style={{ width: 84, height: 84, borderRadius: '50%', display: 'grid', placeItems: 'center', background: hasVideo ? 'var(--af-heat)' : 'rgb(28 26 23 / 0.5)', color: hasVideo ? 'var(--af-on-heat)' : 'var(--af-cream)', border: hasVideo ? 0 : '1px dashed rgb(236 230 219 / 0.5)' }}>
                    <Play size={28} fill="currentColor" strokeWidth={0} style={{ marginLeft: 4 }} aria-hidden />
                  </span>
                  {!hasVideo ? <span className="af-pill">{t.soon}</span> : null}
                </span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

/** What the shirt is: four facts beside the print up close. */
export function AfTeeDetails() {
  const t = UI[useLang()].tee
  return (
    <section className="af-section">
      <div className="af-wrap af-grid-2">
        <Reveal>
          <div className="af-frame af-frame--vignette" style={{ aspectRatio: '1' }}>
            <img src={TEE_LOOKS.macro} alt={t.macroAlt} className="af-photo" loading="lazy" />
          </div>
        </Reveal>
        <div style={{ display: 'grid', gap: 28 }}>
          <span className="af-eyebrow">{t.detailsEyebrow}</span>
          <Headline text={t.detailsTitle} accent={t.detailsAccent} />
          <div>
            {t.features.map((f, i) => (
              <div key={f.title} style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: 12, padding: '20px 0', borderTop: '1px solid rgb(236 230 219 / 0.08)' }}>
                <span className="af-mono af-muted" style={{ paddingTop: 4 }}>{String(i + 1).padStart(2, '0')}</span>
                <div style={{ display: 'grid', gap: 6 }}>
                  <h3 className="af-h3" style={{ fontSize: 20 }}>{f.title}</h3>
                  <p className="af-body" style={{ margin: 0 }}>{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const LOOKS = [
  { src: TEE_LOOKS.livingRoom, wide: true },
  { src: TEE_LOOKS.balcony },
  { src: TEE_LOOKS.booth },
  { src: TEE_LOOKS.front },
  { src: TEE_LOOKS.street },
  { src: TEE_LOOKS.flatlay },
]

/** Where it lives: a scrollable strip of the shirt out in the world. */
export function AfTeeLookbook() {
  const t = UI[useLang()].tee
  return (
    <section className="af-section af-section--surface" style={{ overflow: 'hidden' }}>
      <div className="af-wrap" style={{ display: 'grid', gap: 20, marginBottom: 40 }}>
        <span className="af-eyebrow">{t.lookEyebrow}</span>
        <Headline text={t.lookTitle} accent={t.lookAccent} />
      </div>
      <div role="list" tabIndex={0} aria-label={t.lookTitle} style={{ display: 'flex', gap: 16, overflowX: 'auto', scrollSnapType: 'x mandatory', paddingInline: 'max(16px, calc((100vw - 1240px) / 2 + 40px))', paddingBottom: 12, scrollbarWidth: 'thin' }}>
        {LOOKS.map((l, i) => (
          <figure key={l.src} role="listitem" style={{ margin: 0, flex: `0 0 ${l.wide ? 'min(86vw, 760px)' : 'min(72vw, 380px)'}`, scrollSnapAlign: 'start', display: 'grid', gap: 12 }}>
            <div className="af-frame" style={{ aspectRatio: l.wide ? '16 / 10' : '4 / 5' }}>
              <img src={l.src} alt={t.looks[i]} className="af-photo" loading="lazy" />
            </div>
            <figcaption className="af-mono af-muted">{t.looks[i]}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

/** The artist behind the print. */
export function AfTeeArtist() {
  const t = UI[useLang()].tee
  return (
    <section className="af-section">
      <div className="af-wrap af-grid-2">
        <Reveal>
          <div className="af-frame af-frame--vignette" style={{ aspectRatio: '4 / 5' }}>
            <img src="/media/photos/session10-painting.jpg" alt={t.artistPhotoAlt} className="af-photo" loading="lazy" />
            <span className="af-pill" style={{ position: 'absolute', left: 14, bottom: 14 }}>{t.artistPhotoTag}</span>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gap: 22 }}>
          <span className="af-eyebrow">{t.artistEyebrow}</span>
          <h2 className="af-h2">Pri <span className="af-accent">Amaral</span></h2>
          <p className="af-lead" style={{ margin: 0 }}>{t.artistLead}</p>
          <p className="af-body" style={{ margin: 0 }}>{t.artistBody}</p>
          <p className="af-body" style={{ margin: 0 }}>{t.artistShows}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
            <a className="af-link af-mono af-tap" href={social.priInstagram} target="_blank" rel="noreferrer">@priamaral6</a>
            <a className="af-link af-mono af-tap" href={social.priSite} target="_blank" rel="noreferrer">priamaral.com</a>
          </div>
        </div>
      </div>
    </section>
  )
}

export function AfTeeFaq() {
  const t = UI[useLang()].tee
  return (
    <section className="af-section">
      <div className="af-wrap af-wrap--narrow" style={{ display: 'grid', gap: 32 }}>
        <div style={{ display: 'grid', gap: 18 }}>
          <span className="af-eyebrow">{t.faqEyebrow}</span>
          <h2 className="af-h2">{t.faqTitle}</h2>
        </div>
        <div>
          {t.faq.map((f) => (
            <details key={f.q} className="af-faq">
              <summary>
                {f.q}
                <Plus size={20} className="af-faq__icon" aria-hidden />
              </summary>
              <p className="af-body" style={{ margin: '0 0 20px' }}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Last word before the footer: the price and the button again. */
export function AfTeeFinal({ node }: BlockProps) {
  const lang = useLang()
  const t = UI[lang].tee
  const { product, view } = useTee(node)
  const buy = useTeeBuy(product, view)
  return (
    <section id="af-final" style={{ position: 'relative', overflow: 'hidden', background: 'var(--af-well)' }}>
      <img src={TEE_LOOKS.livingRoom} alt="" aria-hidden className="af-photo" loading="lazy" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, var(--af-ink), rgb(20 18 16 / 0.6) 50%, var(--af-well))' }} />
      <div className="af-wrap af-wrap--narrow" style={{ position: 'relative', paddingBlock: 'clamp(80px, 12vw, 152px)', textAlign: 'center', display: 'grid', gap: 22, justifyItems: 'center' }}>
        <span className="af-pill af-pill--live">{t.finalBadge(view.inventoryCount)}</span>
        <h2 className="af-display" style={{ fontSize: 'clamp(44px, 8vw, 104px)' }}>
          Viva los seres <span className="af-accent">que bailan</span>
        </h2>
        <p className="af-lead" style={{ margin: 0 }}>{t.finalNote}</p>
        <div className="af-price" style={{ fontFamily: 'var(--af-display)', fontWeight: 700, fontSize: 36 }}>{money(buy.price, view.currency, lang)}</div>
        {buy.missing.length ? (
          <a href="#af-buy" className="af-btn af-btn--primary">{t.choose(optionLabel(buy.missing[0].label, lang))}</a>
        ) : (
          <button type="button" className="af-btn af-btn--primary" disabled={!buy.canBuy} onClick={() => buy.add(true)}>{t.buyNow}</button>
        )}
      </div>
    </section>
  )
}

/** Home-page teaser: the shirt with its live price and sizes, pointing to the
 *  landing. Boiler Room's card habit: a second photo on hover, sizes in the card. */
export function AfTeeSpotlight({ node }: BlockProps) {
  const lang = useLang()
  const t = UI[lang].tee
  const { product, view } = useTee(node)
  const sizes = useMemo(() => (product ? getProductOptionGroups(product) : []).find((g) => /tamanho|size|talla/i.test(g.label)), [product])
  return (
    <section className="af-section" style={{ overflow: 'hidden' }}>
      <div className="af-wrap af-grid-2">
        <Reveal>
          <Link to={routeFor('shirt')} className="af-frame af-swap" style={{ display: 'block', aspectRatio: '4 / 5', background: '#fff' }} aria-label={t.spotCta}>
            <img src={TEE_PACKSHOTS.back} alt={t.spotAlt} loading="lazy" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }} />
            <img src={TEE_LOOKS.balcony} alt="" aria-hidden className="af-photo af-swap__next" loading="lazy" />
          </Link>
        </Reveal>
        <div style={{ display: 'grid', gap: 22 }}>
          <span className="af-eyebrow">{t.spotEyebrow}</span>
          <h2 className="af-h2">Viva los seres <span className="af-accent">que bailan</span></h2>
          <p className="af-lead" style={{ margin: 0 }}>{t.spotText}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <Link to={routeFor('shirt')} className="af-btn af-btn--solid">{t.spotCta}</Link>
            <span className="af-price" style={{ fontFamily: 'var(--af-display)', fontWeight: 700, fontSize: 24 }}>{money(view.price, view.currency, lang)}</span>
          </div>
          {sizes ? <div className="af-mono af-muted">{sizes.values.join(' · ')}</div> : null}
          <Stock count={view.inventoryCount} lang={lang} />
        </div>
      </div>
    </section>
  )
}
