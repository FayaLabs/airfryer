import { useEffect, useMemo, useState } from 'react'
import { useRouter, useRouterState } from '@tanstack/react-router'
import { createIsomorphicFn } from '@tanstack/react-start'
import { getRequestUrl } from '@tanstack/react-start/server'
import { buildSeoTags, hostRouterAdapter, type BlockNode, type RouterAdapter, type SeoConfig } from '@fayz-ai/core'
import {
  collectDataNeeds,
  resolvePageDataNeed,
  resolveConfig,
  PageDataScope,
  StorefrontConfigHost,
  StorefrontRouterProvider,
  StorefrontShell,
  defaultPageBlocks,
  isKnownPath,
  isPublicPath,
  matchContentPage,
  matchPath,
  pageSeo,
  productSeo,
  toBlockNodes,
  type PageDataEntry,
} from '@fayz-ai/storefront'
import { getShopProvider } from '@fayz-ai/shop/runtime'
import type { Product } from '@fayz-ai/shop/types'
import { storeConfig, storeDescription } from '../config/app'
import { pageTitle } from '../config/pages'
import { LANG_META, currentLang, pageFromPath, useGeo, useLang, type L, type PageKey } from '../i18n'
import { UI } from '../i18n/ui'

// ---------------------------------------------------------------------------
// The only file that knows both TanStack Start and the Fayz storefront.
//
// The SDK owns the store: its route table, its blocks, its data needs, its SEO
// descriptors. TanStack owns the request: where the loader runs, what the head
// contains, what status and cache headers go out. Swapping the framework is a
// rewrite of this file and nothing else.
// ---------------------------------------------------------------------------

/** Resolved once: the server render and the browser read the same object. */
export const config = resolveConfig(storeConfig)

const ambientOrigin = createIsomorphicFn()
  .server(() => {
    try {
      return new URL(getRequestUrl()).origin
    } catch {
      return ''
    }
  })
  .client(() => window.location.origin)

/** Public origin for canonical and OpenGraph URLs. */
export function siteOrigin(): string {
  const configured = import.meta.env.PUBLIC_SITE_ORIGIN
  return configured ? configured.replace(/\/$/, '') : ambientOrigin()
}

// --- Data ---------------------------------------------------------------------

/** The block tree the SDK will render for `path`, the source of its data needs. */
function treeFor(path: string): BlockNode[] {
  const pages = config.pages
  if (matchPath('/product/:slug', path)) {
    return toBlockNodes(pages.product?.blocks ?? defaultPageBlocks('product')) as BlockNode[]
  }
  if (matchPath('/catalog', path)) {
    return toBlockNodes(pages.catalog?.blocks ?? defaultPageBlocks('catalog')) as BlockNode[]
  }
  if (path === '/' || path === '') {
    return toBlockNodes(pages.home?.blocks ?? defaultPageBlocks('home')) as BlockNode[]
  }
  // Editorial pages (the collective's sections and the shirt's landing) are
  // block documents too; resolving their needs here is what lets the landing
  // render the live price on the server.
  const content = matchContentPage(pages, path)
  if (content) return toBlockNodes(content.page.blocks) as BlockNode[]
  return []
}

/** Resolve everything the page declares before it renders, one failure per need. */
async function resolvePageData(path: string): Promise<Record<string, PageDataEntry>> {
  const params = matchPath('/product/:slug', path) ?? matchContentPage(config.pages, path)?.params ?? {}
  const needs = collectDataNeeds(treeFor(path), params)
  const entries: Record<string, PageDataEntry> = {}
  await Promise.all(
    needs.map(async (need) => {
      entries[need.key] = await resolvePageDataNeed(need)
    }),
  )
  return entries
}

/** The product a product route is about, for its SEO and its 404 status. */
async function productFor(path: string): Promise<Product | null> {
  const slug = matchPath('/product/:slug', path)?.slug
  if (!slug) return null
  const found = await getShopProvider().listProducts({ slug, status: 'active', limit: 1 })
  return found[0] ?? null
}

export async function loadRoute(path: string) {
  const origin = siteOrigin()
  const [entries, product] = await Promise.all([resolvePageData(path), productFor(path)])
  // A URL the route table does not know, or a product URL whose product is
  // gone, must answer 404: a soft 404 gets indexed as real content.
  const isProduct = !!matchPath('/product/:slug', path)
  const missing = !isKnownPath(config, path) || (isProduct && product === null)
  return { path, entries, product, missing, origin }
}

export type RouteData = Awaited<ReturnType<typeof loadRoute>>

// --- Head ---------------------------------------------------------------------

const DESCRIPTIONS: Record<PageKey, L> = {
  home: {
    en: 'A music community born in a Barcelona living room. Living Room Sessions, nights out of the room, and the Viva los seres que bailan shirt with Pri Amaral.',
    es: 'Una comunidad de música nacida en un salón de Barcelona. Living Room Sessions, noches fuera de la sala y la camiseta Viva los seres que bailan con Pri Amaral.',
    pt: 'Comunidade de música nascida numa sala de estar em Barcelona. Living Room Sessions, noites fora da sala e a camisa Viva los seres que bailan com Pri Amaral.',
  },
  experience: {
    en: 'Living Room Sessions in Barcelona: intimate nights, DJs playing what they actually listen to, and the archive of every recorded set.',
    es: 'Living Room Sessions en Barcelona: noches íntimas, DJs tocando lo que de verdad escuchan y el archivo de cada sesión grabada.',
    pt: 'Living Room Sessions em Barcelona: noites íntimas, DJs tocando o que realmente ouvem, e o arquivo de todas as sessões gravadas.',
  },
  video: {
    en: 'The Airfryer Collective library: every recorded set, by room — Living Room Sessions, Bridge 48 and Salva Discos. Press play.',
    es: 'La biblioteca de Airfryer Collective: cada set grabado, por sala — Living Room Sessions, Bridge 48 y Salva Discos. Dale al play.',
    pt: 'A biblioteca da Airfryer Collective: cada set gravado, por sala — Living Room Sessions, Bridge 48 e Salva Discos. É só dar play.',
  },
  community: {
    en: 'Who holds the room, who has played and how to join Airfryer Collective. DJs: send us your set.',
    es: 'Quién sostiene la sala, quién ya ha tocado y cómo unirte a Airfryer Collective. DJs: mandadnos vuestro set.',
    pt: 'Quem segura a sala, quem já tocou e como entrar na roda da Airfryer Collective. DJs: mandem seu set.',
  },
  partnerships: {
    en: 'Bring an Airfryer session to your space. Cultural partnerships with venues and brands that put music first: 763 people, 31 DJs, no advertising.',
    es: 'Lleva una sesión de Airfryer a tu espacio. Colaboraciones culturales con salas y marcas que ponen la música primero: 763 personas, 31 DJs, sin publicidad.',
    pt: 'Leve uma sessão da Airfryer para o seu espaço. Parcerias culturais com casas e marcas que colocam a música em primeiro lugar: 763 pessoas, 31 DJs, sem anúncios.',
  },
  shirt: {
    en: 'The Viva los seres que bailan shirt: black, original Pri Amaral artwork on the back, the Airfryer mascot on the chest. One-off edition, no restock.',
    es: 'La camiseta Viva los seres que bailan: negra, obra original de Pri Amaral a la espalda, la mascota de Airfryer en el pecho. Edición única, sin reposición.',
    pt: 'Camisa Viva los seres que bailan: preta, arte original da Pri Amaral nas costas, mascote da Airfryer no peito. Edição única, sem reposição.',
  },
}

const SHARE_IMAGE: Partial<Record<PageKey, string>> = { shirt: '/images/tee/balcony.jpg' }

function seoToHead(seo: SeoConfig, path: string, origin: string) {
  const tags = buildSeoTags(seo)
  const lang = currentLang()
  const page = pageFromPath(path)
  // One URL per page now, in the visitor's language — no per-language
  // alternates. The canonical in buildSeoTags still points at this path.
  const image = page && SHARE_IMAGE[page] ? [{ property: 'og:image', content: `${origin}${SHARE_IMAGE[page]}` }] : []
  return {
    meta: [
      { charSet: 'utf-8' as const },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: tags.title },
      ...tags.meta,
      { property: 'og:locale', content: LANG_META[lang].og },
      ...image,
      // Checkout, account and order pages are one shopper's state at a URL.
      ...(isPublicPath(config, path) ? [] : [{ name: 'robots', content: 'noindex,nofollow' }]),
    ],
    links: [...tags.links],
    scripts: tags.jsonLd.map((obj) => ({
      type: 'application/ld+json',
      children: JSON.stringify(obj).replace(/</g, '\\u003c'),
    })),
  }
}

export function headFor(data?: RouteData) {
  const path = data?.path ?? '/'
  const ctx = { config, path, origin: data?.origin ?? '' }
  const page = pageFromPath(path)
  const lang = currentLang()
  const title = page ? pageTitle(page, lang) : undefined
  const seo: SeoConfig = data?.product
    ? (productSeo(data.product, ctx) as SeoConfig)
    : (pageSeo(ctx, {
        title: title ? `${title} — ${config.name}` : config.name,
        description: page ? DESCRIPTIONS[page][lang] : storeDescription,
      }) as SeoConfig)
  return seoToHead(seo, path, ctx.origin)
}

// --- Caching and where a page renders -----------------------------------------

const PRIVATE_CACHE = 'private, no-store, must-revalidate'

/** Every page renders in the visitor's language and country, under one URL per
 *  page, and the edge cache keys on the URL alone (host/server.ts). So nothing
 *  may be shared there, or one visitor's language is served to the next. */
export function cacheControlFor(_path: string): string {
  return PRIVATE_CACHE
}

/** Public pages render on the server; per-shopper ones (cart state, session)
 *  render on the client only, after mount. The loader still runs for the head. */
export function renderedOnServer(path: string): boolean {
  return isPublicPath(config, path)
}

// --- Render -------------------------------------------------------------------

/** TanStack Router as the storefront's history owner. The path the SDK sees is
 *  the COMMITTED one, not the router's optimistic location. */
function useTanStackRouterAdapter(committedPath: string): RouterAdapter {
  const router = useRouter()
  const location = useRouterState({ select: (s) => s.location })
  const pathname = committedPath.split('?')[0] || '/'
  const search = location.pathname === pathname ? (location.searchStr ?? '') : ''
  const current = pathname + search
  return useMemo(
    () =>
      hostRouterAdapter({
        navigate: (to) => void router.navigate({ to, replace: false }),
        replace: (to) => void router.navigate({ to, replace: true }),
        currentPath: () => current,
      }),
    [router, current],
  )
}

/** Preload on intent for the SDK's own anchors, which TanStack's Link never sees. */
function useIntentPreload(): void {
  const router = useRouter()
  useEffect(() => {
    let last = ''
    const onIntent = (event: Event) => {
      const target = event.target as Element | null
      const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!anchor) return
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.origin !== window.location.origin) return
      if (anchor.hasAttribute('download') || anchor.href.includes('#')) return
      const to = anchor.pathname
      if (to === last || to === window.location.pathname) return
      last = to
      void router.preloadRoute({ to }).catch(() => {})
    }
    document.addEventListener('pointerover', onIntent, { passive: true })
    document.addEventListener('focusin', onIntent, { passive: true })
    document.addEventListener('touchstart', onIntent, { passive: true })
    return () => {
      document.removeEventListener('pointerover', onIntent)
      document.removeEventListener('focusin', onIntent)
      document.removeEventListener('touchstart', onIntent)
    }
  }, [router])
}

/** A thin bar once a navigation has been pending for longer than a blink. */
function NavigationProgress() {
  const pending = useRouterState({ select: (s) => s.status === 'pending' })
  const lang = useLang()
  const [shown, setShown] = useState(false)
  useEffect(() => {
    if (!pending) {
      setShown(false)
      return
    }
    const t = setTimeout(() => setShown(true), 150)
    return () => clearTimeout(t)
  }, [pending])
  if (!shown) return null
  return (
    <div
      role="progressbar"
      aria-label={UI[lang].header.loading}
      aria-busy="true"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, background: 'hsl(var(--primary))', zIndex: 100 }}
    />
  )
}

export function StorefrontView({ data }: { data: RouteData }) {
  const router = useTanStackRouterAdapter(data.path)
  useIntentPreload()
  // The visitor's language and Cloudflare's country reach the SDK's own screens
  // (cart, checkout, product). An empty country falls back to the browser's.
  const language = useLang()
  const country = useGeo()
  const buyer = useMemo(() => ({ language, country: country || undefined }), [language, country])
  return (
    <>
      <NavigationProgress />
      <StorefrontConfigHost config={config} buyer={buyer}>
        {/* Seeding scope: the page's own scope finds these keys answered here
            and fetches nothing, so the server renders products, not skeletons. */}
        <PageDataScope nodes={[]} initial={data.entries}>
          <StorefrontRouterProvider value={router}>
            <StorefrontShell path={data.path} router={router} />
          </StorefrontRouterProvider>
        </PageDataScope>
      </StorefrontConfigHost>
    </>
  )
}
