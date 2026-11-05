// The one Workers runtime API the server entry uses. `@cloudflare/workers-types`
// would declare the whole platform and clash with the DOM lib this app also
// compiles against.
declare module 'cloudflare:workers' {
  export function waitUntil(promise: Promise<unknown>): void
}

// The Workers Cache API exposes the default cache as a property; the DOM lib
// does not know it.
interface CacheStorage {
  readonly default: Cache
}
