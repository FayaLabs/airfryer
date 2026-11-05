import { createElement } from 'react'
import { defineStorefrontConfig } from '@fayz-ai/storefront'
import '../blocks'
import { AfFooter, AfHeader } from '../blocks/chrome'
import { AfAccount } from '../blocks/account'
import { social } from '../content/entities'
import { ROUTES } from '../i18n'
import { mockCatalog } from './catalog'
import { contentPages, homeBlocks } from './pages'
import { shopBackend, shopProvider, supabaseCredentials } from './shop'

// The collective's site on the storefront SDK. Home and four editorial pages
// are block documents (config/pages.ts) built from the app's own blocks
// (src/blocks); cart, checkout, account and the PDP are the SDK's, dressed in
// the same vintage palette through the theme below.
const storeName = 'Airfryer Collective'

export const storeDescription =
  'A music community born in a Barcelona living room. Living Room Sessions, nights out of the room, and the Viva los seres que bailan shirt with artwork by Pri Amaral.'

const logo = createElement(
  'span',
  { style: { display: 'inline-flex', alignItems: 'center', gap: 10 } },
  createElement('img', { src: '/media/mascot-line-256.png', alt: '', width: 38, height: 38, style: { objectFit: 'contain' } }),
  createElement(
    'span',
    { style: { fontFamily: 'var(--af-display)', fontWeight: 700, letterSpacing: '-0.01em', textTransform: 'uppercase', fontSize: 16 } },
    'Airfryer ',
    createElement('span', { style: { opacity: 0.6 } }, 'Collective'),
  ),
)

export const storeConfig = defineStorefrontConfig({
  name: storeName,
  description: storeDescription,
  logo,
  // Real URLs: every page indexable and server-renderable.
  routing: 'history' as const,
  imageLoading: { transform: 'supabase' as const },
  currency: 'BRL',
  locale: 'pt-BR',
  // Spain (Barcelona) and Brazil (Rio). The buyer's country drives the checkout's
  // address form and payment rails; the first is the default for a visitor whose
  // country is unknown. Currency and price per country come from the store's
  // markets in GoControl; the two lines above are the base (Brazil) market.
  countries: ['ES', 'BR'],
  provider: shopProvider,
  backend: shopBackend,
  // Local dev without cluster env: the shirt as the only mock product.
  catalog: shopProvider ? undefined : mockCatalog,
  auth:
    supabaseCredentials.url && supabaseCredentials.anonKey
      ? { provider: 'supabase' as const, supabase: { url: supabaseCredentials.url, anonKey: supabaseCredentials.anonKey } }
      : undefined,
  // Not what decides a charge: the store's payment provider in GoControl does
  // (stripe-connect, on the integration service). No Stripe account is connected
  // to the tenant yet (the placeholder was revoked 2026-10-13), so until the
  // merchant connects one, the order stays pending.
  payments: { mode: 'mock' as const, methods: ['pix', 'credit_card'] as const },
  // The design system (brand/system) as HSL triplets, so the SDK's own screens
  // match: warm ink, cream type, Heat (yellow) for the one primary action.
  theme: {
    name: 'airfryer-broadcast',
    colors: {
      background: '36 10% 10%',
      foreground: '39 31% 89%',
      primary: '48 98% 57%',
      primaryForeground: '37 68% 6%',
      accent: '48 98% 57%',
      accentForeground: '37 68% 6%',
      card: '42 17% 12%',
      cardForeground: '39 31% 89%',
      muted: '35 16% 15%',
      mutedForeground: '27 8% 57%',
      border: '35 13% 19%',
      headerBackground: '30 11% 7%',
      headerForeground: '39 31% 89%',
      announcementBackground: '48 98% 57%',
      announcementForeground: '37 68% 6%',
    },
    font: {
      heading: 'Archivo',
      body: 'Archivo',
      googleFonts: ['Archivo:wght@400;500;600;700;800', 'JetBrains Mono:wght@500;600;700;800'],
    },
    radius: 'pill',
    uppercaseButtons: false,
    header: { variant: 'classic', uppercaseNav: false, showCategories: false, showSearch: false },
  },
  // Read only by SDK screens that list nav (the header is the app's own, see
  // blocks/chrome.tsx, and renders these per language).
  nav: [
    { label: 'Experience', to: ROUTES.experience },
    { label: 'Library', to: ROUTES.video },
    { label: 'Community', to: ROUTES.community },
    { label: 'Partnerships', to: ROUTES.partnerships },
    { label: 'The shirt', to: ROUTES.shirt },
  ],
  components: { Header: AfHeader, Footer: AfFooter },
  // Our own /account: community access with a required phone, in place of the
  // SDK's ecommerce auth form (which can't be overridden or take extra fields).
  routes: [{ id: 'account', path: '/account', kind: 'account' as const, component: AfAccount }],
  pages: {
    home: { blocks: homeBlocks },
    content: contentPages,
  },
  footer: {
    about: storeDescription,
    contact: { email: social.email },
    social: [
      { label: 'Instagram', href: social.instagram },
      { label: 'YouTube', href: social.youtube },
    ],
    credit: `© ${new Date().getFullYear()} ${storeName}. Barcelona · Rio.`,
  },
})
