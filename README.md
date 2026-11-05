# airfryer-shop

The Airfryer Collective storefront: one product, the shirt, read from the
tenant's store in GoControl and server-rendered on TanStack Start, deployed as
a Cloudflare Worker.

## Shape

- `src/config/app.ts` is the store: name, theme, nav, the home page's two
  blocks and the commerce policy. Everything on screen comes from the SDK's
  storefront shell; this repo owns no components.
- `src/config/shop.ts` points the SDK at the GoControl cluster and the tenant.
- `src/host/tanstack.tsx` is the seam between the SDK and TanStack Start:
  loaders, head, cache headers, the router adapter. `src/host/server.ts` wraps
  the Worker in the edge cache.
- `src/routes/` is three files: the root document, the layout that mounts the
  store once, and the two leaves (`/` and everything else).

## Run

```bash
cp .env.example .env.local   # fill the cluster URL and publishable key
npm install
npm run dev                  # http://localhost:5320
npm run build && npm run preview   # the built Worker in workerd, :5321
```

## Deploy

`main` deploys through CI once the repository has the Cloudflare variable and
secret. From a machine with `CLOUDFLARE_API_TOKEN` in the environment,
`npm run deploy` does the same.

## Data

The product is the tenant's `plg_shop_products` row linked to its Estoque
product. Price, stock and photos are edited in GoControl → Loja; this repo
never writes.
