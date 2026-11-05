import { useEffect, useState } from 'react'
import { createFileRoute, useMatches } from '@tanstack/react-router'
import { StorefrontView, renderedOnServer, type RouteData } from '../host/tanstack'

/**
 * The store, mounted once. '/' and every other path are two route files
 * because they load and describe themselves differently, but they are one
 * STORE: this pathless layout owns the one StorefrontView and reads the data
 * of whichever leaf matched, so navigation never remounts the shell.
 *
 * Per-shopper paths (cart, checkout, account) render nothing until mounted in
 * the browser: their state does not exist on the server, and a hydration over
 * server HTML would see the empty snapshot first.
 */
export const Route = createFileRoute('/_store')({
  component: StoreLayout,
})

function StoreLayout() {
  const matches = useMatches()
  const data = matches[matches.length - 1]?.loaderData as RouteData | undefined
  const mounted = useMounted()
  if (!data) return null
  if (!renderedOnServer(data.path) && !mounted) return null
  return <StorefrontView data={data} />
}

function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}
