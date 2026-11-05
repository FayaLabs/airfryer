# Airfryer Collective

The Airfryer Collective site and shop: community pages, the sessions library
and the shirt. Server-rendered on TanStack Start with the `@fayz-ai` storefront
SDK, deployed as a Cloudflare Worker. Products and orders live in GoControl.

`airfryercollective.com` is still served by Netlify from `legacy/` until the
cutover in [docs/cutover.md](docs/cutover.md).

## Where things are

| Path | What it is |
|---|---|
| `src/config/` | The store: pages (`pages.ts`), SDK setup (`app.ts`, `shop.ts`), mock catalog |
| `src/blocks/` | The site's sections, as `af-*` blocks |
| `src/content/` | Sessions, artists and stats, plus the announcement bar |
| `src/i18n/` | English, Spanish and Portuguese copy. One set of URLs, language in a cookie |
| `src/host/` | The seam with TanStack Start and the Worker's edge cache |
| `public/` | Media, redirects from old URLs, and the `processo` and `salvadiscos` dossiers |
| `brand/system/` | The design system |
| `docs/` | [Map of the docs](docs/README.md) and the cutover steps |
| `legacy/` | The old static site, unchanged |

## Run

```bash
cp .env.example .env.local   # fill the cluster URL and publishable key
npm install
npm run dev                  # http://localhost:5320
npm run build && npm run preview   # the built Worker in workerd, :5321
```

## Deploy

`main` deploys through CI once the repository has the `CLOUDFLARE_ACCOUNT_ID`
variable and the `CLOUDFLARE_API_TOKEN` secret. Until then the job is skipped.
From a machine with both in the environment, `npm run deploy` does the same.

## Data

The product is the tenant's `plg_shop_products` row linked to its Estoque
product. Price, stock and photos are edited in GoControl → Loja; this repo
never writes.
