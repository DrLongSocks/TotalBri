# Total Bri — Storefront

Bilingual (es/en) Next.js 15 storefront for Total Bri, a cleaning-products manufacturer in Los Reyes, Michoacán. Checkout is a WhatsApp hand-off (no Shopify, no Stripe, no DB, no user accounts).

---

## Run it

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build (544 static pages)
pnpm test       # 40 domain tests
pnpm typecheck  # tsc --noEmit
pnpm lint       # eslint
```

Site is locale-prefix-aware:

- `/` → Spanish (default, no prefix)
- `/en/...` → English

Middleware at `./middleware.ts` handles locale detection and redirects.

## Env vars

Copy `.env.example` to `.env.local`. All three are validated at boot with zod (see `src/lib/env.ts`) — the app will refuse to build if any are missing or malformed.

```
NEXT_PUBLIC_WHATSAPP_PRIMARY=525346880969    # digits only, no +
NEXT_PUBLIC_WHATSAPP_SECONDARY=525341349764  # optional
NEXT_PUBLIC_SITE_URL=https://totalbri.mx     # production URL
```

## Where things live

```
app/
  layout.tsx                 root layout, fonts, metadataBase
  [locale]/
    layout.tsx               next-intl provider, Header/Footer, CartDrawerProvider
    (shop)/
      page.tsx               home
      tienda/                all products + per-category pages
      producto/[slug]/       PDP
      mayoreo/, nosotros/, buscar/, not-found
    error.tsx
  robots.ts, sitemap.ts, opengraph-image.tsx

src/
  domain/                    PURE, no React, no Next — testable in isolation
    product/  cart/  whatsapp/  category/  i18n/
  features/                  feature-scoped React
    catalog/  pdp/  cart/  search/  home/  mayoreo/
  components/
    layout/  primitives/  ui/     (shadcn primitives: Button, Sheet, Accordion, Select, Input)
  lib/                       cn, env, url param (de)serialization, seo JSON-LD

data/catalog.csv             source of truth for all 257 products
messages/es.json, en.json    all UI copy (product names come from CSV, not here)
```

### Architectural rules (do not break)

1. **Domain is pure.** Nothing under `src/domain/**` imports React, Next, or browser APIs. The cart reducer is `(state, action) → state`.
2. **URL is the source of truth for filters.** Filter state lives in `useSearchParams`. Shareable URLs and back-button-safe.
3. **Server components by default.** `ProductCard` is server. `CartTrigger`, filters, and the search dialog are client.
4. **The product map is loaded once.** `src/domain/product/repository.ts` reads `data/catalog.csv` at module load and caches it. The locale layout passes it into `CartDrawerProvider` so the drawer and search dialog can hydrate cart lines and do fuzzy matches without re-reading the CSV.
5. **Cart badge guards against SSR.** `useHasMounted` ensures the count never renders during SSR — persisted cart data is only available after hydration.

## Where to drop real assets

- **Product photos**: `/public/images/products/{slug}.webp`, 1600×1600 on white background. If missing, `ProductCard` falls back to a placehold.co URL with the product name. Matching slugs from the catalog — e.g. `desinfectante-cloralex-10l.webp`.
- **Hero imagery**: the three hero slides currently render navy→teal gradients with a noise overlay. Replace the HeroCarousel's gradient divs with real photography (85vh desktop, 70dvh mobile). `/public/hero/hero-1.webp` etc. would be the natural path.
- **Favicon**: drop into `/public/favicon.ico`.

## WhatsApp flow (replaces checkout)

Three message templates in `src/domain/whatsapp/templates.ts`, each a pure function of `(input, locale) → string`:

- `buildOrderMessage(lines, subtotal, locale)` — cart checkout
- `buildSingleProductMessage(product, qty, locale)` — PDP quick-buy
- `buildBulkInquiryMessage(form, locale)` — mayoreo form submit

All three handle: accents/ñ round-trip through `encodeURIComponent`, long-cart truncation to stay under the 1800-char wa.me URL limit, and out-of-stock line exclusion for cart messages. Covered by tests in `whatsapp/templates.test.ts`.

## What's deferred (communicate to client)

The brief called these out explicitly — they're intentionally not part of pass one:

- Real product photography (placeholders render until you drop files at the path above)
- Real hero imagery
- Newsletter backend — the form validates, shows a success toast, but doesn't POST anywhere. Wire it to Resend/Mailchimp when ready.
- Order history / user accounts — not needed, checkout is WhatsApp.
- Admin or inventory management — catalog changes happen by editing `data/catalog.csv` and redeploying.
- Payment integration — intentionally not built. WhatsApp is the checkout.
- Analytics — add GA4 via GTM post-launch.
- Reviews / ratings — not in scope.
- Live deployment — pick Vercel (easiest) or any Node host. `pnpm build && pnpm start`.

## Testing

```bash
pnpm test
```

40 tests across 5 files, all in the domain layer. No UI/E2E tests in pass one.

## Verified for handoff

- `pnpm install && pnpm dev` runs without errors
- `pnpm build` compiles; 544 static pages generated (all products × 2 locales + categories + shell pages)
- `pnpm typecheck` passes (strict + noUncheckedIndexedAccess)
- `pnpm lint` passes
- `pnpm test` — 40 of 40 tests pass
- All 257 products render in `/tienda`
- Navigation home → category → PDP → add to cart → drawer → WhatsApp link with correct pre-filled message
- Locale switch ES ↔ EN on every page without losing state
- Cart persists across page refresh (localStorage)
- 404 on bogus slugs (category or product)
- Mobile viewport (375px) has no horizontal scroll
- First-load JS: 105KB shared, well under the 150KB budget
# TotalBri
