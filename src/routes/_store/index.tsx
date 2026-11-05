import { createFileRoute } from '@tanstack/react-router'
import { cacheControlFor, headFor, loadRoute } from '../../host/tanstack'

// No component: the store is rendered once by the `_store` layout. This file
// only says what '/' loads and how it is described and cached.
export const Route = createFileRoute('/_store/')({
  loader: () => loadRoute('/'),
  head: ({ loaderData }) => headFor(loaderData),
  headers: () => ({ 'Cache-Control': cacheControlFor('/') }),
})
