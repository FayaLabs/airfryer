import { useEffect } from 'react'
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { initStorefrontRuntime } from '@fayz-ai/storefront'
import { storeConfig } from '../config/app'
import { AfPlayerLayer } from '../blocks/player'
import { StorefrontView } from '../host/tanstack'
import appCss from '../styles.css?url'
import { LANG_META, LangProvider, currentLang, geoCountry, type Lang } from '../i18n'

// Blocks, entities and the shop provider. Runs once per module evaluation: on
// the server for the render, and again in the browser for hydration.
initStorefrontRuntime(storeConfig)

const FONTS =
  'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700;800&display=swap'

const supabaseOrigin = (() => {
  try {
    return new URL(import.meta.env.PUBLIC_SUPABASE_URL ?? '').origin
  } catch {
    return ''
  }
})()

export const Route = createRootRoute({
  // The visitor's language + country, resolved once on the server (cookie, else
  // Accept-Language; country from Cloudflare) and serialized so the client
  // hydrates in the same language. The switcher takes over from here.
  loader: (): { lang: Lang; geo: string } => ({ lang: currentLang(), geo: geoCountry() }),
  head: () => ({
    // The fallback title; a matched route replaces it. No robots meta here: it
    // would leak into every page, and the 404 status alone keeps a wrong URL out.
    meta: [{ title: `${storeConfig.name} — 404` }],
    links: [
      // Fonts in the server head, not the SDK's client-side injection: the
      // display type is the brand, and it must not flash in as a fallback.
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' as const },
      { rel: 'stylesheet', href: FONTS },
      { rel: 'icon', type: 'image/png', href: '/media/favicon-64.png' },
      { rel: 'apple-touch-icon', href: '/media/apple-touch-icon.png' },
      { rel: 'stylesheet', href: appCss },
      ...(supabaseOrigin ? [{ rel: 'preconnect' as const, href: supabaseOrigin, crossOrigin: 'anonymous' as const }] : []),
    ],
  }),
  component: RootDocument,
  notFoundComponent: NotFound,
})

function NotFound() {
  // A real 404 status; the shell still draws so the visitor lands in the store.
  return <StorefrontView data={{ path: '/404', entries: {}, product: null, missing: true, origin: '' }} />
}

function RootDocument() {
  const { lang, geo } = Route.useLoaderData()
  // Set once React has committed the hydrated tree; server HTML LOOKS
  // interactive before that, and anything acting on it earlier is reset.
  useEffect(() => {
    document.documentElement.setAttribute('data-hydrated', '')
  }, [])
  return (
    <html lang={LANG_META[lang].html}>
      <head>
        <HeadContent />
      </head>
      <body>
        <LangProvider initial={lang} geo={geo}>
          <Outlet />
          <AfPlayerLayer />
        </LangProvider>
        <Scripts />
      </body>
    </html>
  )
}
