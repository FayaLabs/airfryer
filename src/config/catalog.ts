import type { MockShopSeed } from '@fayz-ai/shop'
import { TEE_FALLBACK, TEE_PACKSHOTS, TEE_SLUG } from '../content/tee'

// The mock catalogue for local dev without cluster credentials: the shirt as it
// should be set up in GoControl (sizes, a euro market), so the landing page sells
// end to end against the SDK's mock provider. Ignored once the fayz-shop provider
// is set: the live store has neither sizes nor a public market yet.

const now = '2026-10-13T00:00:00.000Z'
const id = 'mock-tee'

export const mockCatalog: MockShopSeed = {
  // Empty, not absent: absent loads the SDK's demo departments into the footer.
  categories: [],
  // The two markets it should hold: Brazil in reais at the product price,
  // Spain in euros from the Barcelona branch at its own price.
  markets: [
    { code: 'br', name: 'Brasil', currency: 'BRL', locale: 'pt-BR', countries: ['BR'], isDefault: true, shippingFlatRate: 0, shippingFreeAbove: null },
    { code: 'eu', name: 'España', currency: 'EUR', locale: 'es-ES', countries: ['ES'], isDefault: false, shippingFlatRate: 6, shippingFreeAbove: 100 },
  ],
  marketPrices: { eu: [{ productId: id, variantId: null, price: 36.7 }] },
  products: [
    {
      id,
      tenantId: 'airfryer',
      name: TEE_FALLBACK.name,
      slug: TEE_SLUG,
      description: TEE_FALLBACK.description,
      price: TEE_FALLBACK.price,
      compareAtPrice: null,
      currency: TEE_FALLBACK.currency,
      status: 'active',
      inventoryCount: 27,
      sku: null,
      sortOrder: 0,
      metadata: {},
      options: [{ id: 'mock-tee-size', name: 'Tamanho', position: 0, values: ['P', 'M', 'G', 'GG'] }],
      images: [
        { id: 'mock-tee-back', productId: id, url: TEE_PACKSHOTS.back, altText: 'Costas da camisa', sortOrder: 0, isPrimary: true, createdAt: now },
        { id: 'mock-tee-front', productId: id, url: TEE_PACKSHOTS.front, altText: 'Frente da camisa', sortOrder: 1, isPrimary: false, createdAt: now },
      ],
      categoryId: null,
      categoryName: null,
      isPhysical: true,
      weight: null,
      weightUnit: 'g',
      createdAt: now,
      updatedAt: now,
    },
  ],
}
