import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, ShoppingBag, User, X } from 'lucide-react'
import { DeliverToPicker, Link, useCart, useRoutePath, useStorefrontActions } from '@fayz-ai/storefront'
import { LANGS, LANG_META, pageFromPath, pick, routeFor, useLang, useSetLang, type PageKey } from '../i18n'
import { UI } from '../i18n/ui'
import { social } from '../content/entities'
import { announcement } from '../content/announcement'
import { useMenuMotion } from '../lib/gsap-motion'

// The site's own header and footer in place of the SDK's: one 64px bar (no
// contact strip), navigation and language in the visitor's language, the cart
// one tap away. The SDK's cart drawer and checkout still mount underneath; this
// only replaces the chrome around them.

/** Build-time year: a render-time `new Date()` can disagree with a cached page. */
const YEAR = 2026

const NAV = ['experience', 'video', 'community', 'partnerships', 'shirt'] as const satisfies readonly PageKey[]

function Brand({ to }: { to: string }) {
  return (
    <Link to={to} className="af-header__brand" aria-label="Airfryer Collective">
      <img src="/media/mascot-line-256.png" alt="" width={38} height={38} className="af-mascot" />
      <span className="af-header__brand-text">
        Airfryer <span style={{ opacity: 0.6 }}>Collective</span>
      </span>
    </Link>
  )
}

/** The language override: a click switches the whole site in place (no
 *  navigation) and remembers the choice in the cookie + localStorage. */
function LangSwitch() {
  const current = useLang()
  const setLang = useSetLang()
  const t = UI[current]
  return (
    <nav className="af-lang" aria-label={t.header.language}>
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          className="af-lang__btn"
          onClick={() => setLang(l)}
          lang={LANG_META[l].html}
          aria-current={l === current}
          title={LANG_META[l].name}
        >
          {LANG_META[l].label}
        </button>
      ))}
    </nav>
  )
}

/** The one variable promo line (content/announcement.ts): above the header, or
 *  fixed at the bottom, dismissible per visitor. Hidden when disabled. */
const ANNOUNCE_DISMISS = 'af.announcement.dismissed'

function AfAnnouncement() {
  const lang = useLang()
  const t = UI[lang]
  const [dismissed, setDismissed] = useState(false)
  const text = pick(announcement.text, lang)
  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(ANNOUNCE_DISMISS) === text)
    } catch {
      /* storage blocked */
    }
  }, [text])
  if (!announcement.enabled || dismissed) return null
  const dismiss = () => {
    try {
      localStorage.setItem(ANNOUNCE_DISMISS, text)
    } catch {
      /* storage blocked */
    }
    setDismissed(true)
  }
  return (
    <div className="af-announce" data-position={announcement.position}>
      <Link to={announcement.href} className="af-announce__link">
        {text}
        <ArrowUpRight size={14} strokeWidth={2} aria-hidden />
      </Link>
      <button type="button" className="af-announce__close" onClick={dismiss} aria-label={t.header.close}>
        <X size={15} strokeWidth={2} aria-hidden />
      </button>
    </div>
  )
}

export function AfHeader() {
  const path = useRoutePath()
  const lang = useLang()
  const t = UI[lang]
  const page = pageFromPath(path)
  const actions = useStorefrontActions()
  const count = useCart().lines.reduce((n, l) => n + l.quantity, 0)
  const [open, setOpen] = useState(false)
  // Stays true through the closing animation, so the items can animate out.
  const [shown, setShown] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  const sheetRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useMenuMotion(sheetRef, open, shown, () => setShown(false))
  useEffect(() => setOpen(false), [path])
  useEffect(() => {
    if (!open) return
    // A real modal: everything behind, the header included now that it slides
    // away, can't be tabbed into. Focus starts on the sheet's own close button
    // and goes back to the toggle when it closes.
    const behind = ['main', 'footer', '.af-header', '.af-announce'].map((s) => document.querySelector(s)).filter(Boolean) as HTMLElement[]
    behind.forEach((el) => el.setAttribute('inert', ''))
    closeRef.current?.focus()
    const wide = window.matchMedia('(min-width: 960px)')
    const onWide = () => setOpen(false)
    wide.addEventListener('change', onWide)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const toggle = toggleRef.current
    return () => {
      behind.forEach((el) => el.removeAttribute('inert'))
      wide.removeEventListener('change', onWide)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      toggle?.focus()
    }
  }, [open])

  return (
    <>
      <a className="af-skip" href="#af-main">{t.header.skip}</a>
      <AfAnnouncement />
      <header className="af-header">
        <div className="af-wrap af-header__bar">
          <Brand to={routeFor('home')} />
          <nav className="af-header__nav" aria-label={t.header.primaryNav}>
            {NAV.map((key) => (
              <Link key={key} to={routeFor(key)} className="af-header__link" aria-current={page === key ? 'page' : undefined}>
                {t.nav[key]}
              </Link>
            ))}
          </nav>
          <div className="af-header__tools">
            <Link to="/account" className="af-icon-btn" aria-label={t.header.account}>
              <User size={20} strokeWidth={1.75} aria-hidden />
            </Link>
            <button type="button" className="af-icon-btn" aria-label={`${t.header.cart}${mounted && count ? ` (${count})` : ''}`} onClick={() => actions.openCart()}>
              <ShoppingBag size={20} strokeWidth={1.75} aria-hidden />
              {mounted && count ? <span className="af-badge" aria-hidden>{count}</span> : null}
            </button>
            {page !== 'shirt' && page !== 'home' ? (
              <Link to={routeFor('shirt')} className="af-btn af-btn--ghost af-header__cta" style={{ marginLeft: 8 }}>
                {t.header.shop}
              </Link>
            ) : null}
            <button
              ref={toggleRef}
              type="button"
              className="af-icon-btn af-header__menu-btn"
              aria-label={t.header.menu}
              aria-expanded={open}
              aria-controls="af-sheet"
              onClick={() => {
                setShown(true)
                setOpen(true)
              }}
            >
              <Menu size={22} strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        </div>
      </header>
      {shown ? (
        <div id="af-sheet" ref={sheetRef} className="af-sheet" role="dialog" aria-modal="true" aria-label={t.header.menu} inert={!open}>
          <div className="af-sheet__top">
            <button ref={closeRef} type="button" className="af-icon-btn" data-menu="close" aria-label={t.header.close} onClick={() => setOpen(false)}>
              <X size={22} strokeWidth={1.75} aria-hidden />
            </button>
          </div>
          {NAV.map((key) => (
            <Link key={key} to={routeFor(key)} className="af-sheet__link" aria-current={page === key ? 'page' : undefined}>
              <span className="af-sheet__mask"><span className="af-sheet__label" data-menu="label">{t.nav[key]}</span></span>
              <span data-menu="arrow" style={{ display: 'inline-flex' }}><ArrowUpRight size={22} strokeWidth={1.5} aria-hidden /></span>
              <span className="af-sheet__rule" data-menu="rule" />
            </Link>
          ))}
          <div data-menu="foot" style={{ marginTop: 'auto', paddingTop: 32, display: 'grid', gap: 12 }}>
            <a className="af-body af-tap" href={social.instagram} target="_blank" rel="noreferrer" style={{ color: 'var(--af-cream)' }}>Instagram</a>
            <a className="af-body af-tap" href={social.youtube} target="_blank" rel="noreferrer" style={{ color: 'var(--af-cream)' }}>YouTube</a>
          </div>
        </div>
      ) : null}
      <span id="af-main" tabIndex={-1} style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }} />
    </>
  )
}

export function AfFooter() {
  const lang = useLang()
  const t = UI[lang]
  const linkStyle = { textDecoration: 'none', color: 'rgb(236 230 219 / 0.8)' }
  return (
    <footer style={{ background: 'var(--af-surface)', borderTop: '1px solid var(--af-line)', overflow: 'hidden' }}>
      <div className="af-wrap" style={{ paddingBlock: 'clamp(56px, 8vw, 96px) 32px', display: 'grid', gap: 48 }}>
        <div style={{ display: 'grid', gap: 40, gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <img src="/media/mascot-line-256.png" alt="" width={56} height={56} className="af-mascot" />
              <span className="af-h3" style={{ fontSize: 18 }}>Airfryer <span className="af-muted">Collective</span></span>
            </div>
            <p className="af-body" style={{ margin: 0, maxWidth: 360 }}>{t.footer.tagline}</p>
          </div>
          <nav aria-label={t.footer.navigation} style={{ display: 'grid', gap: 4 }}>
            <span className="af-kicker" style={{ marginBottom: 8 }}>{t.footer.navigation}</span>
            {NAV.map((key) => (
              <Link key={key} to={routeFor(key)} className="af-body" style={{ ...linkStyle, minHeight: 44, display: 'flex', alignItems: 'center' }}>{t.nav[key]}</Link>
            ))}
            <Link to="/account" className="af-body" style={{ ...linkStyle, minHeight: 44, display: 'flex', alignItems: 'center' }}>{t.footer.orders}</Link>
          </nav>
          <div style={{ display: 'grid', gap: 4 }}>
            <span className="af-kicker" style={{ marginBottom: 8 }}>{t.footer.contact}</span>
            <a className="af-body" style={{ ...linkStyle, minHeight: 44, display: 'flex', alignItems: 'center' }} href={`mailto:${social.email}`}>{social.email}</a>
            <a className="af-body" style={{ ...linkStyle, minHeight: 44, display: 'flex', alignItems: 'center' }} href={social.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a className="af-body" style={{ ...linkStyle, minHeight: 44, display: 'flex', alignItems: 'center' }} href={social.youtube} target="_blank" rel="noreferrer">YouTube</a>
          </div>
        </div>
        <div aria-hidden style={{ fontFamily: 'var(--af-display)', fontWeight: 800, lineHeight: 0.8, letterSpacing: '-0.045em', fontSize: 'clamp(56px, 13vw, 200px)', color: 'rgb(236 230 219 / 0.05)', whiteSpace: 'nowrap' }}>
          Airfryer
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, borderTop: '1px solid rgb(236 230 219 / 0.06)', paddingTop: 24 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
            <Link to="/privacy" className="af-mono af-muted af-tap" style={{ textDecoration: 'none' }}>{t.footer.privacy}</Link>
            <Link to="/terms" className="af-mono af-muted af-tap" style={{ textDecoration: 'none' }}>{t.footer.terms}</Link>
            <Link to="/refunds" className="af-mono af-muted af-tap" style={{ textDecoration: 'none' }}>{t.footer.refunds}</Link>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
            <LangSwitch />
            <DeliverToPicker className="af-deliver-to" />
          </div>
          <span className="af-mono af-muted">© {YEAR} Airfryer Collective · Barcelona · Rio</span>
        </div>
      </div>
    </footer>
  )
}
