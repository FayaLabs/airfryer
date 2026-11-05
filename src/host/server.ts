import handler, { createServerEntry } from '@tanstack/react-start/server-entry'
import { waitUntil } from 'cloudflare:workers'

// The edge cache, made real. Every public page leaves the Worker with
// `Cache-Control: public, s-maxage=…`; on workers.dev nothing in front honours
// it, so this wraps the Start handler with the Workers Cache API: a public page
// renders once per PoP per TTL and is served from memory after that. What is
// cacheable is decided by the RESPONSE (see cacheControlFor in host/tanstack).

const TRACKING_PARAM = /^(utm_[a-z0-9_]+|fbclid|gclid|gbraid|wbraid|msclkid|ttclid|igshid|mc_cid|mc_eid|_ga|ref)$/i

function cacheKeyFor(request: Request): Request | null {
  if (request.method !== 'GET') return null
  const url = new URL(request.url)
  for (const key of [...url.searchParams.keys()]) {
    if (TRACKING_PARAM.test(key)) url.searchParams.delete(key)
  }
  url.hash = ''
  return new Request(url.toString(), { method: 'GET' })
}

function cacheable(response: Response): boolean {
  if (response.status !== 200) return false
  const cc = response.headers.get('cache-control') ?? ''
  return /\bpublic\b/.test(cc) && /\bs-maxage=[1-9]\d*/.test(cc) && !/\b(no-store|private)\b/.test(cc)
}

function withCacheStatus(response: Response, status: 'HIT' | 'MISS' | 'BYPASS'): Response {
  const headers = new Headers(response.headers)
  headers.set('x-edge-cache', status)
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
}

export default createServerEntry({
  async fetch(request) {
    // Never in dev: the vite plugin runs this Worker in workerd locally too, and
    // a cached page would hide the edit you just made.
    if (import.meta.env.DEV) return handler.fetch(request)

    const key = cacheKeyFor(request)
    if (!key) return handler.fetch(request)

    const cache = caches.default
    const hit = await cache.match(key)
    if (hit) return withCacheStatus(hit, 'HIT')

    const response = await handler.fetch(request)
    if (!cacheable(response)) return withCacheStatus(response, 'BYPASS')

    waitUntil(cache.put(key, response.clone()))
    return withCacheStatus(response, 'MISS')
  },
})
