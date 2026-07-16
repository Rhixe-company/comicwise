# Comicwise — Research Report

> **Project:** Comicwise (comic/manga streaming platform)
> **Stack:** Next.js 16, React 19, TypeScript 5.9, PostgreSQL, Drizzle ORM (primary), Prisma, Stripe, Upstash Redis,
Tailwind CSS v4, BullMQ, NextAuth v5
> **Date:** 2026-07-16

---

## 1. Drizzle ORM vs Prisma

Drizzle (~7.4 KB gzip, near-zero cold start, full SQL transparency) is the primary ORM — ideal for serverless Next.js. Prisma v7 (~1.6 MB, abstracted, richer tooling) also exists in the project; plan to consolidate. **Key pitfall:** Connection leaks in dev — always use `globalThis` singleton pattern with both.

---

## 2. Redis (Upstash) Caching

Upstash Redis (HTTP-based, zero cold starts) is ideal for serverless. **Use cases:** metadata 1h TTL, reading progress (per-user, no expiry), trending 5–15 min, rate limiting, BullMQ state. Cache-aside + DB fallback; never primary store. `use cache` + `cacheLife` enable component caching via a Redis adapter.

---

## 3. Tailwind CSS v4

Major rewrite from v3. CSS-first config via `@theme { ... }` replaces `tailwind.config.js`. Lightning CSS (Rust-based) provides 100x faster builds, always-on JIT, no purge config needed. Custom breakpoints: 540px (manga single-page) and 720px (two-page spread). Avoid dynamic class construction (`text-${color}`) — Lightning CSS cannot detect these.

---

## 4. Stripe + Next.js (2026 Patterns)

Server-Action-first: create Checkout Sessions via `'use server'`, not `/api/checkout`. Stripe pushes **Embedded Checkout** (`@stripe/react-stripe-js`) for PCI compliance on your domain. Webhooks still need a Route Handler with raw-body parsing + `stripe.webhooks.constructEvent()` signature verification. Use idempotency keys for retry safety.

---

## 5. Server Actions Security

Every `'use server'` function is a public POST endpoint — TypeScript types provide zero runtime protection. Five essential protections:

1. **Input validation:** Zod v4 schemas with `safeParse()`
2. **Authentication:** Check session in every protected action
3. **Authorization:** Verify ownership/role/permission
4. **Rate limiting:** `@upstash/ratelimit` per user or IP
5. **Closure data exposure:** Move sensitive actions to separate files

Set `experimental.serverActions.allowedOrigins` in `next.config.ts` for CSRF protection.

---

## 6. Image Optimization (Critical for Comicwise)

Comic pages are 40–60% of page weight — one page can be 1–3 MB. **Techniques:** AVIF+WebP fallback (30–50% smaller), declare dimensions (eliminates CLS), `fetchpriority="high"` on LCP, lazy-load below-fold, blur placeholders, CDN immutable caching. **Hybrid:** covers via `next/image`, pages pre-optimized as AVIF via CDN with `<picture>` fallback. Budget: ≤200 KB/page.

---

## 7. Content Delivery & CDN Strategy

Cache comic pages aggressively with immutable headers (`Cache-Control: public, max-age=31536000, immutable`). Preconnect to CDN origin; preload next 3 pages on chapter open. Use bandwidth detection (`navigator.connection.effectiveType`) for adaptive quality. CDN options: Cloudinary (free 25 GB), imgix, Cloudflare Images, Vercel Blob, AWS S3+CloudFront.

---

## 8. Platform Architecture & Data Model

**Architecture:** Next.js App Router with Server Components by default, `'use client'` only for interactivity (reader UI, checkout). BullMQ queues for async work (image processing, emails, webhook fulfillment). TanStack Query for client-side optimistic updates (favorites, ratings).

**Key data entities:** User (with Stripe Customer ID), Comic (slug, coverUrl, status), Chapter (free/preview flag,
pageCount), Page (imageUrl, blurDataUrl), Subscription (Stripe subscription ID, plan, status), Bookmark. Use cursor-based pagination for chapter lists.

---

## 9. TypeScript & Project Structure

TypeScript strict mode (`strict: true`). Module layout: `src/db/schema/` (tables + Zod schemas), `src/db/queries/` (query functions), `src/app/actions/` (Server Actions), `src/app/api/` (Route Handlers — webhooks only), `src/components/` (React), `src/lib/` (utilities). Use `drizzle-zod` for schema-to-validation type gen. Keep migration files as reviewable plain SQL from `drizzle-kit`.

---

## 10. Performance Checklist

- Singleton patterns to prevent DB connection leaks in dev
- Indexes on all foreign keys and queried columns
- Comic images on CDN only (never in DB)
- Cache-aside with Redis; stream pages with `<Suspense>`
- Prefetch next chapter metadata; bundle <200 KB initial load
- Rate limiting on auth/payment; Sentry in production; CSP headers

---

*Research from web search and authoritative sources (July 2026). Full citations in `web-research-comicwise.md`.*
## Related Projects
- **Banking** — shared Next.js 16 + Tailwind CSS + PostgreSQL stack
- **ecom** — shared PostgreSQL + React/Redux frontend patterns
- **cookiecutter-django-tailwind** — shared Tailwind CSS v4 + Postgres conventions
