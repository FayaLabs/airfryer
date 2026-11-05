import type { Product } from '@fayz-ai/shop/types'

/** The shirt's slug in GoControl. Its PDP stays at /product/<slug>; the
 *  landing pages (one per language, see i18n ROUTES.shirt) are where the
 *  site sends people. */
export const TEE_SLUG = 'camisa-viva-los-seres-que-bailan'
export const TEE_PDP = `/product/${TEE_SLUG}`

const bucket =
  'https://klvfxzreepavcpyjiwla.supabase.co/storage/v1/object/public/shop-images/dae85322-34b7-4682-911a-e339a7b5185c/products/e26e7d2b-f1eb-4640-b0d1-cb3bddc20f76'

/** The two studio shots GoControl holds for the product. */
export const TEE_PACKSHOTS = {
  front: `${bucket}/1791903253194-Black%20Airfryer%20Collective%20T-Shirt.webp`,
  back: `${bucket}/1791903257033-Colorful%20Viva%20Los%20Seres%20Back%20Graphic%20Tee.webp`,
}

/** Editorial shots generated from the packshots (fal.ai, Nano Banana 2.1).
 *  The partyBack / partyFront / streetNight set is the grainy 35mm film-flash
 *  look: shot-not-rendered, for the buy-box gallery. */
export const TEE_LOOKS = {
  livingRoom: '/images/tee/hero-livingroom.jpg',
  balcony: '/images/tee/balcony.jpg',
  booth: '/images/tee/dj-booth.jpg',
  front: '/images/tee/front-flash.jpg',
  street: '/images/tee/street.jpg',
  macro: '/images/tee/macro.jpg',
  flatlay: '/images/tee/flatlay.jpg',
  partyBack: '/images/tee/party-back.jpg',
  partyFront: '/images/tee/party-front.jpg',
  streetNight: '/images/tee/street-night.jpg',
}

/**
 * What the page shows when the catalogue can't answer (no cluster env in
 * local dev). Mirrors the live row; never sold from: the buy button only adds
 * a product the provider returned.
 */
export const TEE_FALLBACK: Pick<Product, 'name' | 'price' | 'compareAtPrice' | 'currency' | 'inventoryCount' | 'description'> = {
  name: 'Camisa Viva los seres que Bailan',
  price: 89.9,
  compareAtPrice: null,
  currency: 'BRL',
  // 0 hides the stock line: an offline page must not claim live stock.
  inventoryCount: 0,
  description: 'A camisa da Airfryer Collective com Pri Amaral. Edição única, feita para quem dança.',
}
