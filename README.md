# Total Bri

Bilingual (es/en) Next.js 15 storefront for Total Bri, a cleaning-products manufacturer in Los
Reyes, Michoacán — plus a Postgres-backed admin panel for inventory, workers, and invoice
processing, served at `/admin` on the same deployment.

Customer-facing checkout is a WhatsApp hand-off (no Shopify, no Stripe, no payment processing, no
customer accounts). The admin panel is a separate, authenticated surface with its own database.

---

## Stack

- **Storefront**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4 (CSS-first
  config, no `tailwind.config.js`), next-intl for i18n.
- **Admin panel**: the same Next.js app, `/admin/**`, backed by Drizzle ORM + Postgres (Neon
  serverless in production, local Postgres for dev), NextAuth v5 (beta) for auth, bcryptjs for
  password hashing, Resend for transactional email (invites, password reset, low-stock alerts),
  Vercel Blob for invoice PDF storage, `@anthropic-ai/sdk` for AI-assisted invoice line-item
  extraction.
- **Testing**: Vitest. **Monitoring**: Vercel Analytics + Speed Insights (zero-config, wired into
  the root layout).
- Deployed on Vercel.

`next-auth@5.0.0-beta` and `tailwindcss@^4-beta` are both pre-GA — a deliberate stack choice (see
`~/.claude/stacks/nextjs-drizzle-postgres-stack.md` for the house rules this project follows), not
an oversight, but worth knowing before a launch go/no-go call.

## Run it

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
pnpm test       # vitest — see "Testing" below
pnpm typecheck  # tsc --noEmit
pnpm lint       # eslint

# Admin panel only, once DATABASE_URL is set:
pnpm db:generate  # drizzle-kit generate — after changing src/db/schema.ts
pnpm db:migrate   # apply pending migrations
pnpm db:seed      # bootstrap the first admin user (SEED_ADMIN_* env vars)
```

Site is locale-prefix-aware:

- `/` → Spanish (default, no prefix)
- `/en/...` → English

Middleware at `./middleware.ts` handles both storefront locale detection/redirects and admin
session gating for `/admin/**`.

## Env vars

Copy `.env.example` to `.env.local`. Storefront vars are validated at boot with zod
(`src/lib/env.ts`); admin vars are validated separately (`src/lib/env.server.ts`, server-only) —
the app refuses to start if any required var is missing or malformed.

```
# Storefront (required)
NEXT_PUBLIC_WHATSAPP_PRIMARY=525346880969    # digits only, no +
NEXT_PUBLIC_WHATSAPP_SECONDARY=525341349764  # optional
NEXT_PUBLIC_SITE_URL=https://totalbri.mx     # production URL

# Admin panel (required for /admin to boot)
DATABASE_URL=...            # Neon pooled connection string
DATABASE_URL_UNPOOLED=...   # Neon direct connection — used for migrations
AUTH_SECRET=...             # 32+ chars
AUTH_URL=https://totalbri.mx
RESEND_API_KEY=...
RESEND_FROM_EMAIL=alerts@totalbri.mx
LOW_STOCK_ALERT_EMAIL_PRIMARY=...
LOW_STOCK_ALERT_EMAIL_SECONDARY=...

# Admin panel (optional — invoice-PDF import degrades gracefully without these)
ANTHROPIC_API_KEY=...
BLOB_READ_WRITE_TOKEN=...

# db:seed only, never committed with a real value
SEED_ADMIN_EMAIL=...
SEED_ADMIN_PASSWORD=...
SEED_ADMIN_NAME=...
```

See `.env.example` for the full, current list.

## Where things live

```
app/
  layout.tsx                 root layout, fonts, metadataBase, Analytics/SpeedInsights
  [locale]/
    layout.tsx                next-intl provider, Header/Footer, CartDrawerProvider
    (shop)/
      page.tsx                 home
      tienda/                  all products + per-category pages
      producto/[slug]/         PDP
      mayoreo/, nosotros/, buscar/, not-found.tsx, loading.tsx
    error.tsx
  admin/                      admin panel — auth-gated via middleware.ts
    dashboard/, materials/, materials/[id]/, materials/count/, materials/import/,
    workers/, login/, invite/accept/, reset-password/, log/[nfcTagId]/
    error.tsx, not-found.tsx, loading.tsx
  robots.ts, sitemap.ts, opengraph-image.tsx

src/
  domain/                    PURE, no React, no Next — testable in isolation
    product/  cart/  whatsapp/  category/  i18n/  inventory/  invites/  password-reset/  admin-i18n/
  features/                  feature-scoped React
    catalog/  pdp/  cart/  search/  home/  mayoreo/
    admin/                    materials/  workers/  invites/  password-reset/  usage/  reports/  layout/
  components/
    layout/  primitives/  ui/     (shadcn primitives: Button, Sheet, Accordion, Select, Input)
  lib/                        cn, env (storefront) / env.server (admin), url param (de)serialization,
                               seo JSON-LD, auth/, email/, invoice-import/, admin-locale
  db/                        Drizzle schema, migrations, queries/ (atomic restock/adjust/usage helpers)

data/catalog.csv             source of truth for all 268 storefront products
messages/es.json, en.json    storefront UI copy (product names come from CSV, not here)
```

### Architectural rules (do not break)

1. **Domain is pure.** Nothing under `src/domain/**` imports React, Next, or browser APIs. The
   cart reducer is `(state, action) → state`.
2. **URL is the source of truth for storefront filters.** Filter state lives in `useSearchParams`.
   Shareable URLs and back-button-safe.
3. **Server components by default.** Client boundaries are pushed to leaf components (cart
   trigger, filters, search dialog, forms) — pages and layouts stay server-rendered.
4. **The product map is loaded once.** `src/domain/product/repository.ts` reads `data/catalog.csv`
   at module load and caches it.
5. **Cart badge guards against SSR.** `useHasMounted` ensures the count never renders during SSR —
   persisted cart data is only available after hydration.
6. **Admin mutations are transactional and re-check auth server-side.** Multi-step writes (restock,
   invoice import, invite acceptance) go through `db.transaction`; every Server Action re-checks
   session/role independently of middleware — see `src/lib/auth/require-admin.ts` and
   `src/db/queries/*.ts`.
7. **The inventory ledger is append-only.** `inventoryTransactions` is the source of truth for
   stock — never updated or deleted, only inserted into.

## Where to drop real assets

- **Product photos**: `/public/images/products/{slug}.webp` (or `.jpg`), 1600×1600 on white
  background, matching slugs from the catalog. 264 of 268 products already have real photos as of
  this writing — the remainder fall back to a placehold.co URL.
- **Hero imagery**: `HeroCarousel` currently renders a gradient/noise placeholder. Replace with
  real photography (85vh desktop, 70dvh mobile). `/public/hero/hero-1.webp` etc. would be the
  natural path.
- **Favicon**: drop into `/public/favicon.ico` — doesn't exist yet.

## WhatsApp flow (replaces checkout)

Three message templates in `src/domain/whatsapp/templates.ts`, each a pure function of
`(input, locale) → string`:

- `buildOrderMessage(lines, subtotal, locale)` — cart checkout
- `buildSingleProductMessage(product, qty, locale)` — PDP quick-buy
- `buildBulkInquiryMessage(form, locale)` — mayoreo form submit

All three handle: accents/ñ round-trip through `encodeURIComponent`, long-cart truncation to stay
under the 1800-char wa.me URL limit, and out-of-stock line exclusion for cart messages. Covered by
tests in `whatsapp/templates.test.ts`.

## Admin panel

Authenticated at `/admin/login` (NextAuth v5, JWT sessions, 30-day maxAge for shift workers).
Two roles: `admin` (full access) and `worker` (NFC tap-to-log only). Fully bilingual (ES/EN,
runtime-switchable, `src/domain/admin-i18n/messages.ts`).

- **Materials** — CRUD, NFC tag linking, manual restock, bulk physical inventory count.
- **Invoice import** — upload a supplier PDF/quote, Claude extracts line items, admin reviews and
  confirms, restock is applied atomically (import row + every line item in one transaction).
  Gracefully disabled if `ANTHROPIC_API_KEY`/`BLOB_READ_WRITE_TOKEN` aren't set.
- **Workers** — invite via email (Resend), soft-delete (`disabledAt`, never a hard delete).
- **NFC usage logging** — tap a shelf tag to log consumption; triggers a low-stock email alert on
  threshold crossing.
- **Dashboard** — ~13 report cards/charts (stock overview, usage trends, days-until-stockout, cost
  tracking, burn rate, etc.), all backed by real Postgres queries.
- **Password reset** — enumeration-safe, token-based, 1-hour TTL.

## What's deferred (communicate to client)

- Real hero imagery — placeholder gradient renders until real photos are dropped in.
- 4 remaining product photos (see "Where to drop real assets").
- Favicon.
- Newsletter backend — the form validates, shows a success toast, but doesn't POST anywhere yet.
  Needs a provider decision (Resend audience API, Mailchimp, etc.) before wiring up.
- Payment integration — intentionally not built. WhatsApp is the checkout.
- Reviews / ratings — not in scope.
- Production deployment — the app has not yet been deployed to a live environment. To ship:
  1. Provision a production Neon Postgres database.
  2. Set every required var from `src/lib/env.server.ts` (see "Env vars" above) in the Vercel
     project's environment settings — never commit real values to the repo.
  3. Run `pnpm db:migrate` against `DATABASE_URL_UNPOOLED` to apply all migrations.
  4. Deploy (`vercel --prod` or push to the connected Git branch).
  5. Run `pnpm db:seed` once (with real `SEED_ADMIN_*` values set only in the deploy environment,
     never in a committed file) to create the first admin account.
- Deeper error tracking (Sentry or similar) — Vercel Analytics/Speed Insights are wired in, but
  there's no alerting on server-side exceptions yet.

## Testing

```bash
pnpm test
```

Vitest, all business logic — cart totals, WhatsApp message building, inventory/cost math, and
DB-transaction atomicity/concurrency for the admin panel's restock and usage-logging paths. The
two DB-integration tests (`src/db/queries/*.test.ts`) skip automatically without a real
`DATABASE_URL` set. No UI/E2E test suite exists yet — flows are verified manually (see below).

## Manually verified

- `pnpm install && pnpm dev` runs without errors.
- `pnpm build`, `pnpm typecheck`, `pnpm lint`, `pnpm test` all pass.
- All storefront products render in `/tienda`; navigation home → category → PDP → add to cart →
  drawer → WhatsApp link with correct pre-filled message.
- Locale switch ES ↔ EN on every storefront page without losing state; cart persists across page
  refresh (localStorage).
- 404 on bogus storefront slugs; mobile viewport (375px) has no horizontal scroll.
- Admin: login → materials CRUD → restock → invoice import (with keys configured) → dashboard
  reflects the change; worker invite → accept → NFC tap-to-log → low-stock email fires at
  threshold.
