import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from 'react'
import { createIsomorphicFn } from '@tanstack/react-start'
import { getCookie, getRequestHeader } from '@tanstack/react-start/server'

// One set of English URLs for everyone; language is the visitor's, kept in a
// cookie + localStorage, never in the path. The server reads the cookie (or
// Accept-Language on a first visit) and renders in that language; the client
// hydrates with the same value and can switch it in place, no navigation.

export type Lang = 'en' | 'es' | 'pt'
export const LANGS: readonly Lang[] = ['en', 'es', 'pt']
export const DEFAULT_LANG: Lang = 'en'

/** A string in every language. */
export type L = Record<Lang, string>

export const LANG_META: Record<Lang, { label: string; name: string; html: string; intl: string; og: string }> = {
  en: { label: 'EN', name: 'English', html: 'en', intl: 'en-US', og: 'en_US' },
  es: { label: 'ES', name: 'Español', html: 'es', intl: 'es-ES', og: 'es_ES' },
  pt: { label: 'PT', name: 'Português', html: 'pt-BR', intl: 'pt-BR', og: 'pt_BR' },
}

export type PageKey = 'home' | 'experience' | 'video' | 'community' | 'partnerships' | 'shirt'

/** One English path per page. Language lives in a cookie, not here. */
export const ROUTES: Record<PageKey, string> = {
  home: '/',
  experience: '/experience',
  video: '/library',
  community: '/community',
  partnerships: '/partnerships',
  shirt: '/shirt',
}

export const LANG_COOKIE = 'af_lang'

function isLang(value: string | undefined | null): value is Lang {
  return value === 'en' || value === 'es' || value === 'pt'
}

export function routeFor(key: PageKey): string {
  return ROUTES[key]
}

/** Which page a path is, for nav highlighting and SEO. `/library/<id>` is the
 *  library too. Null for the SDK's own paths (cart, product, legal). */
export function pageFromPath(path: string): PageKey | null {
  const clean = (path.split('?')[0] ?? '/').replace(/\/+$/, '') || '/'
  for (const key of Object.keys(ROUTES) as PageKey[]) {
    if (ROUTES[key] === clean) return key
  }
  if (clean === ROUTES.video || clean.startsWith(`${ROUTES.video}/`)) return 'video'
  return null
}

function fromAcceptLanguage(header: string | null): Lang {
  const ranked = (header ?? '')
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=')
      return { base: tag.toLowerCase().split('-')[0], q: q ? Number(q) : 1 }
    })
    .filter((x) => x.base && !Number.isNaN(x.q))
    .sort((a, b) => b.q - a.q)
  for (const { base } of ranked) if (isLang(base)) return base
  return DEFAULT_LANG
}

/** Remember an explicit choice for a year, in both the cookie and localStorage. */
export function saveLang(lang: Lang): void {
  try {
    localStorage.setItem(LANG_COOKIE, lang)
  } catch {
    /* storage blocked */
  }
  try {
    document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`
  } catch {
    /* cookies blocked */
  }
}

/**
 * The language to render with, resolved the same on both sides: the server
 * reads the cookie (or negotiates Accept-Language on a first visit); the client
 * reads localStorage, then the cookie. Used to seed the provider and the head.
 */
export const currentLang = createIsomorphicFn()
  .server((): Lang => {
    try {
      const cookie = getCookie(LANG_COOKIE)
      if (isLang(cookie)) return cookie
      return fromAcceptLanguage(getRequestHeader('accept-language') ?? null)
    } catch {
      return DEFAULT_LANG
    }
  })
  .client((): Lang => {
    try {
      const ls = localStorage.getItem(LANG_COOKIE)
      if (isLang(ls)) return ls
    } catch {
      /* ignore */
    }
    try {
      const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${LANG_COOKIE}=(en|es|pt)`))?.[1]
      if (isLang(m)) return m
    } catch {
      /* ignore */
    }
    return DEFAULT_LANG
  })

/** The visitor's country (ISO2), from Cloudflare, for the phone default only. */
export const geoCountry = createIsomorphicFn()
  .server((): string => {
    try {
      return (getRequestHeader('cf-ipcountry') ?? '').toUpperCase()
    } catch {
      return ''
    }
  })
  .client((): string => '')

// --- Runtime language context -------------------------------------------------

interface LangState {
  lang: Lang
  setLang: (lang: Lang) => void
  geo: string
}

const LangCtx = createContext<LangState>({ lang: DEFAULT_LANG, setLang: () => {}, geo: '' })

/** Seeds the tree with the server-resolved language so hydration matches, then
 *  owns the switch: a change writes the cookie + localStorage and re-renders. */
export function LangProvider({ initial, geo = '', children }: { initial: Lang; geo?: string; children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initial)
  const setLang = (next: Lang) => {
    saveLang(next)
    setLangState(next)
  }
  useEffect(() => {
    document.documentElement.lang = LANG_META[lang].html
  }, [lang])
  return createElement(LangCtx.Provider, { value: { lang, setLang, geo } }, children)
}

export function useLang(): Lang {
  return useContext(LangCtx).lang
}

export function useSetLang(): (lang: Lang) => void {
  return useContext(LangCtx).setLang
}

export function useGeo(): string {
  return useContext(LangCtx).geo
}

export function pick(value: L, lang: Lang): string {
  return value[lang] ?? value.en
}
