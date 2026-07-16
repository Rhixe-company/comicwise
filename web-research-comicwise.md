# Comicwise — Web Research Report

> **Project:** Comicwise (comic/manga streaming platform)
> **Stack:** Next.js 16, React 19, TypeScript, PostgreSQL, Drizzle ORM / Prisma, Stripe, Upstash Redis, Tailwind CSS v4, BullMQ, NextAuth v5
> **Date:** 2026-07-16

---

## Table of Contents

1. [Drizzle ORM & Prisma — Best Practices & Comparison](#1-drizzle-orm--prisma--best-practices--comparison)
2. [Redis (Upstash) Caching Strategies](#2-redis-upstash-caching-strategies)
3. [Tailwind CSS v4 — Best Practices & Optimization](#3-tailwind-css-v4--best-practices--optimization)
4. [Stripe + Next.js Integration (2026)](#4-stripe--nextjs-integration-2026)
5. [Next.js Server Actions — Security Must-Knows](#5-nextjs-server-actions--security-must-knows)
6. [TypeScript & Node Patterns for the Stack](#6-typescript--node-patterns-for-the-stack)
7. [Common Pitfalls & Performance Tips](#7-common-pitfalls--performance-tips)

---

## 1. Drizzle ORM & Prisma — Best Practices & Comparison

### Sources
- [Drizzle vs Prisma: 10x Faster Queries? 2026 Benchmarks](https://tech-insider.org/drizzle-vs-prisma-2026)
- [Drizzle vs Prisma ORM in 2026 (MakerKit)](https://makerkit.dev/blog/tutorials/drizzle-vs-prisma)
- [Prisma ORM Production Guide (Digital Applied, 2025)](https://www.digitalapplied.com/blog/prisma-orm-production-guide-nextjs)
- [Next.js + PostgreSQL + Drizzle ORM (Dave Gray)](https://www.youtube.com/watch?v=tiSm8ZjFQP0)
- [Drizzle ORM PostgreSQL Docs](https://orm.drizzle.team/docs/get-started-postgresql)
- [Drizzle Connection Pool Issues (GitHub Discussion)](https://github.com/drizzle-team/drizzle-orm/discussions/947)
- [Reddit: Best DB ORM for production Next.js](https://www.reddit.com/r/nextjs/comments/1k9prpi/best_db_orm_for_production)

### Key Findings

#### Drizzle ORM (comicwise uses Drizzle 0.45.1 as primary)

| Topic | Recommendation |
|-------|---------------|
| **SQL-first philosophy** | If you know SQL, you know Drizzle. Queries like `db.select().from(users).where(eq(users.active, true))` map 1:1 to SQL. |
| **Bundle size** | ~7.4 KB gzip — critical for serverless/edge deployments (vs Prisma 7's ~1.6 MB, and older Prisma's ~14 MB) |
| **Cold starts** | Zero runtime dependencies, no Rust binary. Drizzle wins decisively on Vercel Edge Functions, Cloudflare Workers, AWS Lambda. |
| **Migrations** | Drizzle Kit (`drizzle-kit push` / `drizzle-kit generate`) — generates plain SQL migration files you can review |
| **Zod integration** | Drizzle works seamlessly with Zod for runtime validation; many teams use `drizzle-zod` for schema-to-validation type generation |
| **Connection pooling** | Use `postgres` driver with `{ max: 10 }` pool size. For serverless, start with `max: 1` and scale up. |

**Connection pool pitfall:** In Next.js dev mode with hot-reload, Drizzle connections leak unless you use a singleton pattern (same as Prisma). Without it, you get: `"remaining connection slots are reserved for non-replication superuser connections"`. Use `globalThis` to persist the pool.

```ts
// lib/db.ts — Singleton pattern for Drizzle
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const globalForDb = globalThis as unknown as { client: postgres.Sql | undefined };

const client = globalForDb.client ?? postgres(process.env.DATABASE_URL!, { max: 10 });
if (process.env.NODE_ENV !== 'production') globalForDb.client = client;

export const db = drizzle(client);
```

#### Prisma (comicwise also has it — possible dual-ORM usage)

| Topic | Recommendation |
|-------|---------------|
| **Prisma 7 changes** | 90% smaller bundle (pure TypeScript client, dropped Rust binary). 3x faster queries vs Prisma 6. |
| **Singleton pattern** | **Essential** — Next.js hot-reload creates new clients. Store on `globalThis`. |
| **Schema design** | Use native DB types (`@db.VarChar(255)`, `@db.Timestamptz(3)`, `@db.Text`). Don't leave `String` bare. |
| **Indexing** | Add `@@index([foreignKey])` on every relation field. Composite indexes for common query patterns. |
| **Migrations** | `prisma migrate dev` for dev, `prisma migrate deploy` in production. Never modify DB schema directly. |
| **Prisma Accelerate** | For serverless, provides HTTP-based connection pooling + global edge caching. Free tier covers most hobby/early-stage. Paid from $49/mo. |

#### Drizzle vs Prisma — When to Use Which

| Factor | Drizzle | Prisma |
|--------|---------|--------|
| Serverless / Edge | ✅ Best choice | ⚠️ Acceptable with Accelerate |
| Bundle size sensitivity | ✅ ~7.4 KB | ⚠️ ~1.6 MB (Prisma 7) |
| SQL control | ✅ Full transparency | ❌ Abstracted |
| Team onboarding | Requires SQL knowledge | Lower barrier |
| Migrations | Raw SQL (reviewable) | Automated (`prisma migrate`) |
| Cold start | ✅ Near-zero | ⚠️ Some overhead |
| Ecosystem tooling | Smaller | Richer (Studio, Accelerate, Pulse) |

**Verdict for comicwise:** Drizzle's SQL-transparent approach and cold-start performance make it the right choice for a Next.js comic platform. Prisma may still be in use for portions where its richer tooling (Studio, migrations) offers value. Dual-ORM in one project is discouraged due to mental overhead — if both exist, plan to consolidate.

---

## 2. Redis (Upstash) Caching Strategies

### Sources
- [Redis Caching Strategies: Next.js Production Guide 2025](https://www.digitalapplied.com/blog/redis-caching-strategies-nextjs-production)
- [How to Cache Next.js Server Components with Redis (OneUptime, 2026)](https://oneuptime.com/blog/post/2026-03-31-redis-nextjs-server-components-cache/view)
- [Scaling Next.js with Redis cache handler (DEV)](https://dev.to/rafalsz/scaling-nextjs-with-redis-cache-handler-55lh)
- [Reddit: Why use Redis when Next.js already offers robust caching?](https://www.reddit.com/r/nextjs/comments/1kj3hxk/why_use_redis_when_nextjs_already_offers_robust)
- [Watt v3.18: Next.js 16 'use cache' with Redis/Valkey](https://blog.platformatic.dev/watt-v318-unlocks-nextjs-16s-revolutionary-use-cache-directive-with-redisvalkey)

### Key Findings

#### Why Redis for Comicwise
Comicwise uses Upstash Redis (1.37.0) — this is the ideal choice for serverless Next.js since it uses HTTP-based access (no TCP), has zero cold starts, and global replication.

**Performance gains:** Redis reduces response times from 50-300ms (DB queries) to 1-2ms — a 100x+ improvement for cached data.

#### Use Cases for Comicwise

| Use Case | Implementation | TTL |
|----------|---------------|-----|
| **Comic metadata cache** | Cache DB queries for comic lists, genres, tags | 1 hour (3600s) |
| **Reading progress** | Store user's last-read page/chapter | Per-user, no expiry |
| **Popular comics** | View counters, trending lists | 5-15 min |
| **Rate limiting** | `@upstash/ratelimit` on API routes & Server Actions | Per-request window |
| **Session data** | NextAuth sessions, JWT blacklists | Per-session TTL |
| **BullMQ job state** | Queue status for async image processing | Per-job |

#### Cache-Aside Pattern (Recommended)

```ts
// lib/redis.ts
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Generic cache helper
export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600,
): Promise<T> {
  const cached = await redis.get<T>(key);
  if (cached) return cached;

  const fresh = await fetcher();
  await redis.setex(key, ttl, fresh);
  return fresh;
}
```

#### Next.js 16 `use cache` Directive
Next.js 16 introduces `use cache` which can work with Redis/Valkey as the backing store. This lets you cache individual React components and functions with surgical precision. For self-hosted deployments, a Redis adapter provides distributed caching across instances.

#### Pitfalls
- **Always implement fallback:** If Redis is unavailable, degrade gracefully to direct DB fetches. Don't crash.
- **Cache invalidation is hard:** Use TTL-based expiration for most data. For user-specific data (reading progress), skip Redis or use short TTLs.
- **Don't cache everything:** Use Redis for frequently-read, infrequently-written data. Aim for 80%+ cache hit rate.
- **Next.js already has caching:** Built-in fetch cache, full route cache, and RSC cache cover many cases. Use Redis for what Next.js built-in cache doesn't handle (cross-instance, shared state, rate limiting).

---

## 3. Tailwind CSS v4 — Best Practices & Optimization

### Sources
- [Tailwind CSS v4 Full Course (JavaScript Mastery, 2026)](https://www.youtube.com/watch?v=6biMWgD6_JY)
- [Tailwind CSS Official Site](https://tailwindcss.com)
- [Tailwind CSS v4 Wikipedia](https://en.wikipedia.org/wiki/Tailwind_CSS) — Stable release 4.3.2

### Key Findings

Tailwind CSS v4 is a **major rewrite** from v3. Comicwise uses Tailwind v4.0.0.

#### What Changed in v4

| Feature | v3 | v4 |
|---------|----|----|
| Configuration | `tailwind.config.js` | CSS-first config via `@theme`, `@config` directives |
| Engine | Standalone CLI | Built on Lightning CSS (Rust-based, 100x faster) |
| Just-in-Time | JIT engine | Native — always-on, no purge config needed |
| Custom values | Arbitrary values `[#123]` | Native support for any value |
| CSS-first | JS config required | Everything in CSS: `@theme`, `@layer`, `@variant` |
| Modern CSS | Some vendor prefixes | Full modern CSS: `@container`, `@starting-style`, `@scope` |

#### Best Practices for Comicwise

1. **Use CSS-first configuration** — Define theme tokens in CSS, not JS:
   ```css
   @theme {
     --color-comic-primary: #ff6b35;
     --color-comic-secondary: #004e89;
     --font-family-comic: 'Bangers', system-ui;
     --breakpoint-manga: 540px;
   }
   ```

2. **ShadCN UI compatibility** — shadcn/ui v4 works with Tailwind v4. The `components.json` should reference the v4 config format.

3. **Performance** — Lightning CSS engine purges unused styles at build time. No manual `purge` config needed. Final CSS is typically <10 KB gzipped.

4. **Dark mode** — Use `dark:` variant prefix. Comicwise already has a reading mode; dark mode support should use the same Tailwind variant system.

5. **Responsive design** — Tailwind v4 uses `@media` queries with `max-width` breakpoints by default (mobile-first). For manga/comic layouts, custom breakpoints at `540px` (manga single-page width) and `720px` (two-page spread) are recommended.

6. **Avoid inline arbitrary values in production** — While `h-[400px]` works, define custom utilities in `@theme` for consistency and smaller output.

7. **JIT now always-on** — No config changes needed. Every class generates on-demand. Zero unused CSS in production.

---

## 4. Stripe + Next.js Integration (2026)

### Sources
- [The Ultimate Guide to Stripe + Next.js (2026 Edition, DEV)](https://dev.to/sameer_saleem/the-ultimate-guide-to-stripe-nextjs-2026-edition-2f33)
- [Stripe Checkout and Webhook in Next.js 15 (Medium, 2025)](https://medium.com/@gragson.john/stripe-checkout-and-webhook-in-a-next-js-15-2025-925d7529855e)
- [Vercel: Getting Started with Next.js, TypeScript, and Stripe](https://vercel.com/kb/guide/getting-started-with-nextjs-typescript-stripe)
- [Next.js Server Actions Security (MakerKit)](https://makerkit.dev/blog/tutorials/secure-nextjs-server-actions)

### Key Findings

#### 2026 Architecture — Server-Action-First

**Gone are the days of `/api/checkout` folders.** Stripe Checkout sessions should now be created via Server Actions:

```ts
// src/app/actions/stripe.ts
'use server';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function createCheckoutSession(priceId: string) {
  const origin = (await headers()).get('origin');
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',           // 2026: Embedded Checkout is preferred
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
  });
  return { clientSecret: session.client_secret };
}
```

#### Embedded Checkout (2026 Recommended)

Stripe now strongly pushes **Embedded Checkout** over redirect-based. The `EmbeddedCheckout` component from `@stripe/react-stripe-js` renders in an iframe on your domain — user never leaves your site, Stripe handles all PCI compliance.

```tsx
'use client';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { createCheckoutSession } from '@/app/actions/stripe';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutForm({ priceId }: { priceId: string }) {
  const fetchClientSecret = async () => {
    const result = await createCheckoutSession(priceId);
    return result.clientSecret;
  };

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
```

#### Webhook Handler — Critical Care

Webhooks still need a Route Handler (not a Server Action) because Stripe needs a static URL to POST to.

```ts
// src/app/api/webhook/route.ts
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature')!;
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // Update DB — 2026 practice: trigger background sync or email service
    await handleCheckoutCompleted(session);
  }
  
  return new Response(null, { status: 200 });
}
```

#### Security Best Practices

1. **Webhook signature verification is non-negotiable** — Always verify the raw request body with `stripe.webhooks.constructEvent()`.
2. **Use `req.text()` in App Router** — For webhook body parsing, use `request.text()` (not `request.json()`) to get the raw payload for signature verification.
3. **Idempotency** — Stripe webhooks can retry; make your handlers idempotent (check if already processed before updating DB).
4. **Environment variables** — Never expose `STRIPE_SECRET_KEY`. Use `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` for client-side.
5. **Local testing** — Use Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhook`
6. **Server Action authorization** — Always check auth inside the Server Action before creating a Checkout Session. Don't rely on the UI hiding the button.

#### Common Integration Pitfalls

| Pitfall | Solution |
|---------|----------|
| Webhook failing on Vercel (production) | Ensure raw body parsing with `req.text()`, not body parser middleware |
| Metadata missing from webhook event | Pass metadata via `session.metadata` when creating checkout |
| Multiple webhook events for one payment | Use idempotency keys or check DB before applying |
| CORS issues with Embedded Checkout | Ensure return_url includes the full origin |
| Subscription status sync | Use the webhook to sync Stripe subscription status to your DB (Drizzle/Prisma) |

---

## 5. Next.js Server Actions — Security Must-Knows

### Sources
- [Next.js Server Actions Security: 5 Vulnerabilities (MakerKit)](https://makerkit.dev/blog/tutorials/secure-nextjs-server-actions)
- [Next.js Server Action Security (Arcjet Blog)](https://blog.arcjet.com/next-js-server-action-security)
- [Reddit: How are you securing your Next.js server actions?](https://www.reddit.com/r/nextjs/comments/1klnrya/how_are_you_securing_your_nextjs_server_actions)

### Key Findings

#### Server Actions ARE Public HTTP Endpoints

Every `'use server'` function creates a POST endpoint. Your TypeScript types, client-side validation, and React component boundaries don't protect against an attacker hitting the endpoint with `curl`. **This is the #1 security mistake.**

#### The 5 Essential Protections

| # | Protection | Why | Implementation |
|---|-----------|-----|---------------|
| 1 | **Input validation** | TypeScript types vanish at runtime | Use Zod (v4) schemas with `safeParse()` |
| 2 | **Authentication** | Anyone can call the endpoint | Check session in every protected action |
| 3 | **Authorization** | Authenticated ≠ authorized | Verify ownership/role/permission |
| 4 | **Rate limiting** | Prevent brute force & abuse | `@upstash/ratelimit` per user or IP |
| 5 | **Closure data exposure** | Server Actions in components capture scope | Move sensitive Server Actions to separate files |

#### Pattern: Secure Server Action with All Protections

```ts
'use server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '@/lib/redis';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { purchases } from '@/db/schema';

const PurchaseComicSchema = z.object({
  comicId: z.string().uuid(),
  priceId: z.string().min(1),
});

export async function purchaseComic(input: unknown) {
  // 1. Input validation
  const parsed = PurchaseComicSchema.safeParse(input);
  if (!parsed.success) return { error: 'Invalid input' };

  // 2. Authentication
  const session = await auth();
  if (!session?.user) return { error: 'Unauthorized' };

  // 3. Rate limiting
  const ip = (await headers()).get('x-forwarded-for') ?? 'unknown';
  const ratelimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '60s') });
  const { success } = await ratelimit.limit(`purchase:${session.user.id}`);
  if (!success) return { error: 'Too many requests' };

  // 4. Authorization — user can only purchase if not already owned
  const existing = await db.select().from(purchases).where(
    eq(purchases.userId, session.user.id) && eq(purchases.comicId, parsed.data.comicId)
  ).limit(1);
  if (existing.length > 0) return { error: 'Already purchased' };

  // 5. Proceed with Stripe Checkout creation
  const { createCheckoutSession } = await import('./stripe');
  return createCheckoutSession(parsed.data.priceId);
}
```

#### Additional Security Tips

- **CSRF protection**: Next.js Server Actions inherit POST-based CSRF protection from browsers, but set `experimental.serverActions.allowedOrigins` in `next.config.ts` to be safe.
- **Non-deterministic action IDs**: Next.js 15+ generates unique IDs per server action build, making it harder to target, but this is security-by-obscurity. Don't rely on it.
- **React Taint APIs**: Use `experimental_taintObjectReference` and `experimental_taintUniqueValue` to prevent sensitive data from leaking to the client.
- **Self-hosting note**: Action encryption keys differ per server; for multi-server deployments, sync encryption keys or use a shared Redis store.

---

## 6. TypeScript & Node Patterns for the Stack

### Sources
- [Comicwise project codebase](https://github.com/vercel/next.js/discussions/53580)
- [Drizzle + TypeScript Patterns](https://tech-insider.org/drizzle-vs-prisma-2026)
- [Prisma Production Guide](https://www.digitalapplied.com/blog/prisma-orm-production-guide-nextjs)

### Key Findings

#### TypeScript Strict Mode

Comicwise uses TypeScript 5.9.3. Ensure `strict: true` in `tsconfig.json` — this enables `noUncheckedIndexedAccess`, `strictNullChecks`, `noImplicitAny`, etc. Critical for catching null issues in DB queries and Stripe API responses.

#### ORM + Zod = Defense in Depth

```ts
// db/schema.ts — Drizzle schema
import { pgTable, uuid, varchar, timestamp, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const comics = pgTable('comics', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  author: varchar('author', { length: 255 }).notNull(),
  priceInCents: integer('price_in_cents').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const insertComicSchema = createInsertSchema(comics);
export const selectComicSchema = createSelectSchema(comics);
```

#### Module Boundaries

Keep clean separation:
- `src/db/schema/` — Drizzle table definitions + Zod schemas
- `src/db/queries/` — Reusable query functions
- `src/app/actions/` — Server Actions (auth + validation + Stripe)
- `src/app/api/` — Route Handlers (only for webhooks)
- `src/components/` — React components (client + server)
- `src/lib/` — Shared utilities (stripe.ts, redis.ts, auth.ts, db.ts)

#### Bun vs pnpm Note

Comicwise's root workspace uses pnpm, but the workspace root AGENTS.md specifies bun. For comicwise specifically, package.json shows pnpm. Use whichever the project's own `package.json` / `pnpm-lock.yaml` indicates.

---

## 7. Common Pitfalls & Performance Tips

### Compiled from All Sources

#### Drizzle/Prisma Pitfalls

| Pitfall | How to Avoid |
|---------|-------------|
| **Connection leaks in dev** | Use `globalThis` singleton pattern for both Drizzle and Prisma |
| **N+1 queries** | Drizzle: use `with` for eager loading. Prisma: use `include` or `select` with relations. Monitor query count. |
| **Missing indexes** | Add indexes on all foreign keys and frequently-queried columns. Use `EXPLAIN ANALYZE` to verify. |
| **Large payloads (comic images)** | Never store images in DB. Use Cloudinary/ImageKit URLs in DB columns. |
| **Migrations in production** | Always `drizzle-kit migrate` / `prisma migrate deploy` in CI/CD — never manually. |

#### Stripe Pitfalls

| Pitfall | How to Avoid |
|---------|-------------|
| **Webhook body parsing** | Use `req.text()` (raw string) for signature verification, not `req.json()` |
| **Missing metadata** | Always pass `session.metadata = { userId, comicId }` when creating checkout sessions |
| **Idempotency** | Use Stripe's idempotency key or check your DB before processing webhook events |
| **Secret key exposure** | Never use `NEXT_PUBLIC_` prefix for `STRIPE_SECRET_KEY` |
| **Webhook timeout** | Return 200 immediately, then process in background (BullMQ queue) |

#### Redis/Upstash Pitfalls

| Pitfall | How to Avoid |
|---------|-------------|
| **Cache stampede** | Use stale-while-revalidate: serve stale + refresh in background |
| **No fallback** | Always wrap Redis calls in try/catch with DB fallback |
| **Over-caching** | Don't cache user-specific or rapidly-changing data. Use short TTLs when unsure. |
| **Redis as primary DB** | Redis is a cache, not a source of truth. Always maintain DB as primary source. |

#### Tailwind CSS v4 Pitfalls

| Pitfall | How to Avoid |
|---------|-------------|
| **Config file migration** | v4 uses CSS-first `@theme` instead of `tailwind.config.js`. Update any v3 config references. |
| **Missing classes in build** | Lightning CSS handles purge, but dynamic class construction (`text-${color}`) won't be detected. Use full class names. |
| **ShadCN compatibility** | Run `npx shadcn@latest init` for v4 compatibility. Ensure `components.json` references v4 paths. |

#### General Performance Tips

1. **Image optimization is CRITICAL for comicwise** — use `next/image` with Cloudinary/ImageKit transforms. Set proper `sizes` attribute for responsive comic pages.
2. **Stream comic pages** — Wrap image-heavy reading pages in `<Suspense>` boundaries. Show skeleton/placeholder while high-res pages load.
3. **Prefetch next chapter** — On the reading page, prefetch the next chapter's metadata using `next/link` with `prefetch={true}` or manual `router.prefetch()`.
4. **Server Components by default** — Only add `'use client'` for interactivity (reading UI, checkout, search). Keep data fetching in Server Components.
5. **BullMQ for async work** — Image processing, email notifications, and webhook fulfillment should be queued, not handled inline.
6. **Database connection pooling** — For both Drizzle and Prisma, set pool size appropriate for your deployment. Serverless: start at 1. Dedicated: `num_cpus * 2 + 1`.
7. **Bundle analysis** — Use `@next/bundle-analyzer` to monitor JS bundle size. Keep it under 200 KB initial load.
8. **TanStack Query for client data** — Use for optimistic updates (favorites, ratings, reading progress). Keep server-fetched data in Server Components.

#### Security Checklist for Comicwise

- [ ] All Server Actions validate input with Zod v4
- [ ] All protected Server Actions check authentication & authorization
- [ ] Stripe webhook handler verifies signatures with raw body
- [ ] Rate limiting on auth and payment endpoints (Upstash)
- [ ] `experimental.serverActions.allowedOrigins` set in `next.config.ts`
- [ ] Environment variables: secrets never prefixed with `NEXT_PUBLIC_`
- [ ] Image upload endpoints validate file types and sizes
- [ ] Content Security Policy headers configured
- [ ] Sentry error tracking configured for production
- [ ] CSRF protection enabled on form actions

---

*Research compiled from web search and extraction of authoritative sources (July 2026). For the most current information, consult the official docs of each technology.*
