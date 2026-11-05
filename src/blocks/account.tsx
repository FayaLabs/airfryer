import { useMemo, useState, type FormEvent } from 'react'
import { ArrowUpRight, Check, LogOut } from 'lucide-react'
import { Link, establishCustomerSession, signOutCustomer, useSessionStore } from '@fayz-ai/storefront'
import { COUNTRIES, getCountry, maskDigitCount, maskPhone, unmaskPhone } from '@fayz-ai/core'
import { createClient } from '@supabase/supabase-js'
import { routeFor, useGeo, useLang } from '../i18n'
import { UI } from '../i18n/ui'
import { social } from '../content/entities'
import { storeId, supabaseCredentials } from '../config/shop'

// The community-access screen, in place of the SDK's ecommerce account form.
// It's a custom route (see config/app.ts routes) so it can collect a required
// phone number at sign-up, which the SDK's signUpCustomer would drop. We create
// the auth user with the phone in user_metadata via Supabase directly, then
// hand the session to the SDK with establishCustomerSession so cart/checkout
// recognise the member.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DEFAULT_ISO = 'ES'

/** A throwaway client just to create the user with the phone; the SDK adapter
 *  owns the real session. No session persistence here to avoid a second store. */
const authClient =
  supabaseCredentials.url && supabaseCredentials.anonKey
    ? createClient(supabaseCredentials.url, supabaseCredentials.anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { headers: { 'x-fayz-store': storeId } },
      })
    : null

function Member() {
  const lang = useLang()
  const a = UI[lang].account
  const name = useSessionStore((s) => s.name)
  const email = useSessionStore((s) => s.email)
  const [busy, setBusy] = useState(false)
  return (
    <div className="af-auth__card af-card">
      <span className="af-pill af-pill--live" style={{ alignSelf: 'start' }}>{a.active}</span>
      <h1 className="af-h2" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>{a.hi}{name ? `, ${name.split(' ')[0]}` : ''}.</h1>
      <p className="af-lead" style={{ margin: 0 }}>{a.memberLead}</p>
      {email ? <p className="af-mono af-muted" style={{ margin: 0 }}>{email}</p> : null}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
        <Link to={routeFor('video')} className="af-btn af-btn--primary">{a.toLibrary}</Link>
        <Link to={routeFor('shirt')} className="af-btn af-btn--ghost">{a.toShirt}</Link>
      </div>
      <button
        type="button"
        className="af-link af-tap"
        style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'none', border: 0, cursor: 'pointer' }}
        onClick={async () => {
          setBusy(true)
          try {
            await signOutCustomer()
          } finally {
            setBusy(false)
          }
        }}
        disabled={busy}
      >
        <LogOut size={15} strokeWidth={2} aria-hidden /> {a.signout}
      </button>
    </div>
  )
}

function AuthForm() {
  const lang = useLang()
  const a = UI[lang].account
  const geo = useGeo()
  const [mode, setMode] = useState<'in' | 'join'>('join')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [iso2, setIso2] = useState(() => (COUNTRIES.some((c) => c.iso2 === geo) ? geo : DEFAULT_ISO))
  const [phone, setPhone] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirm, setConfirm] = useState(false)

  const country = useMemo(() => getCountry(iso2), [iso2])
  const phoneDigits = unmaskPhone(phone)
  const phoneFull = `${country.dial}${phoneDigits}`

  const join = mode === 'join'

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setErr('')
    if (!EMAIL_RE.test(email.trim())) return setErr(a.errEmail)
    if (password.length < 6) return setErr(a.errPassword)
    if (join) {
      if (!name.trim()) return setErr(a.errName)
      if (phoneDigits.length < maskDigitCount(country.mask)) return setErr(a.errPhone)
    }
    setBusy(true)
    try {
      if (join) {
        if (!authClient) return setErr(a.errGeneric)
        const { data, error } = await authClient.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: name.trim(), phone: phoneFull } },
        })
        if (error) return setErr(error.message || a.errGeneric)
        if (!data.session) {
          // Email confirmation is on: the account exists but isn't live yet.
          setConfirm(true)
          return
        }
        await establishCustomerSession(email.trim(), { password, name: name.trim() })
      } else {
        await establishCustomerSession(email.trim(), { password })
      }
      // On success the session store flips and the page swaps to <Member/>.
    } catch {
      setErr(a.errGeneric)
    } finally {
      setBusy(false)
    }
  }

  if (confirm) {
    return (
      <div className="af-auth__card af-card" role="status" aria-live="polite">
        <span className="af-pill af-pill--heat" style={{ alignSelf: 'start', display: 'inline-flex', gap: 6 }}><Check size={14} strokeWidth={2.5} aria-hidden /></span>
        <h1 className="af-h2" style={{ fontSize: 'clamp(26px, 4vw, 40px)' }}>{a.confirmTitle}</h1>
        <p className="af-lead" style={{ margin: 0 }}>{a.confirm}</p>
      </div>
    )
  }

  return (
    <div className="af-auth__card af-card">
      <div className="af-tabs af-auth__tabs" role="group" aria-label={a.tabIn}>
        <button type="button" className={`af-tab${join ? ' af-tab--on' : ''}`} aria-pressed={join} onClick={() => { setMode('join'); setErr('') }}>{a.tabJoin}</button>
        <button type="button" className={`af-tab${!join ? ' af-tab--on' : ''}`} aria-pressed={!join} onClick={() => { setMode('in'); setErr('') }}>{a.tabIn}</button>
      </div>

      <div style={{ display: 'grid', gap: 6 }}>
        <h1 className="af-h2" style={{ fontSize: 'clamp(26px, 4vw, 40px)' }}>{join ? a.joinTitle : a.inTitle}</h1>
        <p className="af-lead" style={{ margin: 0 }}>{join ? a.joinLead : a.inLead}</p>
      </div>

      <form onSubmit={onSubmit} noValidate style={{ display: 'grid', gap: 16 }}>
        {join ? (
          <div className="af-field">
            <label className="af-field__label" htmlFor="ac-name">{a.name}</label>
            <input id="ac-name" className="af-input" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={a.namePh} />
          </div>
        ) : null}
        <div className="af-field">
          <label className="af-field__label" htmlFor="ac-email">{a.email}</label>
          <input id="ac-email" className="af-input" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={a.emailPh} required />
        </div>
        <div className="af-field">
          <label className="af-field__label" htmlFor="ac-pass">{a.password}</label>
          <input id="ac-pass" className="af-input" type="password" autoComplete={join ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={a.passwordPh} required />
        </div>
        {join ? (
          <div className="af-field">
            <label className="af-field__label" htmlFor="ac-phone">{a.phone}</label>
            <div className="af-phone">
              <select className="af-input af-phone__cc" aria-label={a.country} value={iso2} onChange={(e) => setIso2(e.target.value)}>
                {COUNTRIES.map((c) => (
                  <option key={c.iso2} value={c.iso2}>{c.flag} {c.iso2} {c.dial}</option>
                ))}
              </select>
              <input
                id="ac-phone"
                className="af-input"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                value={phone}
                onChange={(e) => setPhone(maskPhone(e.target.value, country.mask))}
                placeholder={country.mask}
                required
              />
            </div>
            <p className="af-field__label" style={{ opacity: 0.7, textTransform: 'none', letterSpacing: 0 }}>{a.phoneHint}</p>
          </div>
        ) : null}

        {err ? <p className="af-field__error" role="alert">{err}</p> : null}

        <button type="submit" className="af-btn af-btn--primary af-btn--block" disabled={busy}>
          {busy ? a.working : join ? a.join : a.signin}
        </button>
      </form>
    </div>
  )
}

/** The /account route: a member view when signed in, the community-access form
 *  (with required phone) when not. */
export function AfAccount() {
  const customerId = useSessionStore((s) => s.customerId)
  return (
    <section className="af-section">
      <div className="af-wrap af-auth">
        {customerId ? <Member /> : <AuthForm />}
        <p className="af-mono af-muted af-auth__foot">
          <a href={social.instagram} target="_blank" rel="noreferrer" className="af-tap" style={{ color: 'inherit', gap: 6 }}>
            Instagram <ArrowUpRight size={13} strokeWidth={2} aria-hidden />
          </a>
        </p>
      </div>
    </section>
  )
}
