import { createClient } from '@supabase/supabase-js'
import { setGlobalSupabaseClient } from '@fayz-ai/core'
import { createFayzShopProvider } from '@fayz-ai/storefront/shop'
import { setShopServiceUrl } from '@fayz-ai/shop'
import type { StorefrontConfig } from '@fayz-ai/storefront'

// The GoControl cluster. Vite inlines PUBLIC_* at build time, so a deployed
// store carries exactly what the CI vars said; missing values fall back to the
// SDK's mock catalogue, silently — check `backend.provider` when a page looks
// like a fixture.
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const publishableKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY

/** The tenant this storefront reads: Airfryer Collective in GoControl. */
export const storeId = import.meta.env.PUBLIC_FAYZ_STORE_ID ?? 'dae85322-34b7-4682-911a-e339a7b5185c'

export const supabaseCredentials = {
  url: supabaseUrl || undefined,
  anonKey: publishableKey || undefined,
}

// The integration service: the Stripe checkout, the shipping quote and the
// CEP lookup go there instead of to the cluster's edge functions. An empty
// PUBLIC_CONTROL_API_URL puts them back on the edge.
const serviceUrl = (import.meta.env.PUBLIC_CONTROL_API_URL ?? 'https://api.borgesoft.com') || undefined
setShopServiceUrl(serviceUrl ?? null)

export const shopProvider =
  supabaseUrl && publishableKey
    ? (createFayzShopProvider({ supabaseUrl, publishableKey, storeId, serviceUrl }) as StorefrontConfig['provider'])
    : undefined

// The ambient client, anonymous and sessionless: everything it reads is a
// published, column-whitelisted view granted to `anon`. The tenant is strict
// scoped on the cluster, so the store header is what lets the read through.
if (supabaseUrl && publishableKey) {
  setGlobalSupabaseClient(
    createClient(supabaseUrl, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { 'x-fayz-store': storeId } },
    }),
  )
}

export const shopBackend: StorefrontConfig['backend'] = {
  provider: shopProvider ? 'fayz-shop' : 'mock',
  url: supabaseUrl || undefined,
}
