# RESEARCH_REPORT.md

## Project: comicwise

**Type:** Comic streaming / reader platform
**Tech Stack:** Next.js 16, TypeScript strict, React 19, Drizzle ORM (Prisma migration in progress), PostgreSQL, NextAuth v5 beta, Stripe, ImageKit, Cloudinary, BullMQ, Upstash QStash, Upstash Redis, Sentry, Vitest, Playwright, pnpm
**Status:** Consolidation target (patterns extracted → rhixecompany-comics)

---

## Similar Projects

| Project | Relevance |
|---------|-----------|
| rhixe_scans | Comic reader; shared Stripe + NextAuth + Tailwind |
| rhixecompany-comics | Consolidation target |
| university-libary-jsm | Next.js 15 + Prisma + PostgreSQL |
| Banking | Next.js + payment flows |

---

## Key Findings

### Next.js 16 Comic Reader Patterns
- **Partial Prerendering (PPR)** — static shell + streamed dynamic content via Suspense
- **Server Actions stable** for mutations (checkout, chapter access)
- **Image optimization** for comic assets via `next/image` + CDN signed URLs
- **Async `params`/`searchParams`** in App Router (Next.js 16+)
- **Cache Components** with `"use cache"` directive for granular caching
- **`proxy.ts` replaces `middleware.ts`** — explicit network boundary

### Drizzle + Prisma Migration
- **Drizzle ~50KB bundle** vs Prisma ~500KB+ — main driver for migration
- **Migration strategy:** dual-ORM during transition; migrate one domain at a time
- **Drizzle 0.45+** stable v1; edge-runtime compatible, no codegen step
- **Prisma 7** rewrote engine in TypeScript (dropped Rust binary)

### Stripe Subscriptions + State Management
- **Server Actions** for Checkout Sessions; Embedded Checkout for no-redirect flow
- **Verify webhooks** via `constructEvent()`; idempotency key per event
- **TanStack Query v5** for server state (catalog, chapters, progress sync)
- **Zustand v5** for client-only UI state (reader mode, zoom, theme)
- **Pattern:** TanStack for async server data; Zustand for synchronous UI

---

## Cheatsheets & Quick Reference

| Topic | Resource | Type |
|-------|----------|------|
| Next.js 16 | <https://nextjs.org/docs/app> | Docs |
| Drizzle ORM | <https://orm.drizzle.dev> | Docs |
| Stripe Subscriptions | <https://docs.stripe.com/billing/subscriptions/webhooks> | Guide |
| TanStack/Zustand | <https://tanstack.com/query/latest> | Docs |
| NextAuth v5 | <https://authjs.dev> | Docs |

---

## Best Practices

1. **Server Components first** — server-side render catalog; only interactivity hydrates
2. **Drizzle DAL boundaries** — `dal/*` modules with precise `select`/`include`
3. **Stripe webhook idempotency** — check event ID uniqueness; verify `constructEvent`
4. **TanStack for API state, Zustand for UI state** — clean separation of concerns
5. **Signed image URLs** — protect paywalled comic content from unauthorized access

---

## Common Pitfalls

| Pitfall | Impact | Avoidance |
|---------|--------|-----------|
| Dual ORM during migration | Data drift | Migrate one domain at a time; eschew cross-ORM transactions |
| Missing Stripe webhook secret | 400 errors | Set `STRIPE_WEBHOOK_SECRET`; verify signature |
| Unsigned image URLs | Content theft | Sign URLs for subscriber-only content |
| Server data in client state | Stale UI | TanStack Query for API; Zustand only for UI state |

---

## Performance

1. **`next/image` for catalog** — CDN-signed URLs for chapter images; preload next chapter
2. **Partial Prerendering** — static shell + dynamic content streams
3. **Cache static metadata** — `force-static` + `revalidateTag` invalidation
4. **Drizzle edge runtime** — smaller bundles for serverless deployments
5. **Upstash Redis** — global replication, zero cold starts for caching/queuing

---

## Security

1. **Signed image URLs** — protect paywalled comic content; expire after auth
2. **Stripe webhook verification** — `constructEvent()` with endpoint secret
3. **WebAuthn/Passkeys** — phishing-resistant auth for subscribers
4. **Rate limit auth endpoints** — Upstash Redis for throttle control
5. **CSP headers** — content security for comic reader iframes/embeds

---

## Related Projects (in workspace)

- **rhixe_scans** — comic reader; shared Stripe + NextAuth + Tailwind patterns
- **rhixecompany-comics** — consolidation target inheriting reader architecture
- **university-libary-jsm** — Next.js 15 + Prisma + PostgreSQL reference
- **Banking** — Next.js + payment flow patterns

---

## Resources

| Resource | URL |
|----------|-----|
| Next.js 16 | <https://nextjs.org/docs> |
| Drizzle ORM | <https://orm.drizzle.dev> |
| Stripe Billing | <https://docs.stripe.com/billing> |
| Auth.js v5 | <https://authjs.dev> |

### Research Methodology
- **Web search:** web_search / web-research-pipeline
- **Documentation:** web_extract (Next.js, Stripe, Drizzle docs)
- **State management patterns:** TanStack Query + Zustand documentation
- **Last verified:** 2026-07-16
