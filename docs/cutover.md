# Putting the new site live

Today `airfryercollective.com` is served by Netlify and the new site is a
Cloudflare Worker. Merging this code doesn't move the domain: `netlify.toml`
keeps Netlify on `legacy/`, and only the DNS change in step 5 switches visitors.

## 1. Before merging

- [ ] In Netlify, check how the site deploys: linked to this repository, or
      uploaded by hand. Either way the merge shouldn't change the live site, but
      a linked site is worth watching on its first deploy.

## 2. Connect this repository to Cloudflare

Add these in Settings → Secrets and variables → Actions:

| Name | Type | Value |
|---|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | Variable | The Cloudflare account that owns the `airfryer-shop` Worker |
| `CLOUDFLARE_API_TOKEN` | Secret | A token that can deploy that Worker |
| `PUBLIC_SUPABASE_URL` | Variable | The GoControl cluster URL |
| `PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Variable | The cluster's publishable key |
| `PUBLIC_FAYZ_STORE_ID` | Variable | `dae85322-34b7-4682-911a-e339a7b5185c` |

Leave `PUBLIC_SITE_ORIGIN` unset for now, so the deploy smoke test runs against
the `workers.dev` URL.

Then stop deploying from `FayaLabs/airfryer-shop`, so two repositories don't
overwrite the same Worker.

## 3. Add the store data in GoControl

Without this, Spanish buyers see BRL prices and `/shirt` has no sizes.

- [ ] Sizes P, M, G and GG on the shirt.
- [ ] A published `eu` market: EUR, `es-ES`, Spain, flat shipping rate.
- [ ] The shirt's euro price.
- [ ] Confirm the BRL price. The store says R$ 39,90 and the code's fallback says
      R$ 89,90.
- [ ] Connect a Stripe account. Until then, orders stay pending.
- [ ] Decide on VAT. Nothing calculates it today.

## 4. Check the new site on `workers.dev`

- [ ] Home, Library, Partnerships and the shirt, in all three languages.
- [ ] A full test purchase, from Spain and from Brazil.
- [ ] Old links: `/sessions.html`, `/session-omaya.html`, `/processo/`,
      `/salvadiscos/`.
- [ ] The QR codes in the Salva Discos dossier.

## 5. Move the domain

1. Add `airfryercollective.com` as a custom domain on the Worker. This changes
   DNS, so lower the record's TTL a day earlier if you can.
2. Set the `PUBLIC_SITE_ORIGIN` variable to `https://airfryercollective.com`.
3. Re-run the deploy, so canonical and social links use the real domain.

To roll back, point DNS back to Netlify. It keeps serving `legacy/` until step 6.

## 6. Clean up, after a week or so

- [ ] Delete `legacy/` and `netlify.toml`, after moving the PDF tooling in
      `legacy/salvadiscos/` if you still use it.
- [ ] Decide on the old partnerships dossier. It's only in `legacy/partnerships/`,
      and its URL now shows the new landing page.
- [ ] Turn off the Netlify site and archive `FayaLabs/airfryer-shop`.
