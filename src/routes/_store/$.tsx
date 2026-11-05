import { createFileRoute, notFound } from '@tanstack/react-router'
import { cacheControlFor, headFor, loadRoute } from '../../host/tanstack'

// Every storefront path other than the home page. A splat rather than one
// file per route: the route table is data owned by the SDK.
export const Route = createFileRoute('/_store/$')({
  loader: async ({ params }) => {
    const data = await loadRoute(`/${params._splat ?? ''}`)
    if (data.missing) throw notFound()
    return data
  },
  head: ({ loaderData }) => headFor(loaderData),
  headers: ({ loaderData }) => ({ 'Cache-Control': cacheControlFor(loaderData?.path ?? '/') }),
})
