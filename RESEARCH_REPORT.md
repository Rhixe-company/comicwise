# RESEARCH_REPORT.md

## Project: comicwise

**Type:** Comic streaming / reader platform **Tech Stack:** Next.js 16, TypeScript strict, React 19, Drizzle ORM (Prisma migration in progress), PostgreSQL, NextAuth v5, Stripe, ImageKit, Cloudinary, BullMQ, Upstash QStash, Upstash Redis, Sentry, pnpm **Status:** Consolidation target (patterns extracted → rhixecompany-comics)

---

## Similar Projects

| Project | Relevance |
| --- | --- |
| rhixe_scans | Comic reader; shared Stripe + NextAuth + Tailwind + media delivery |
| rhixecompany-comics | Consolidation target inheriting reader architecture |
| Banking | Shared Next.js + payment flow patterns |
| university-libary-jsm | Shared Next.js + Drizzle ORM + PostgreSQL catalog |

---

## Key Findings

### Next.js 16 Comic Reader Patterns (2026)

- **Partial Prerendering (PPR)** — static catalog shell + streamed dynamic chapter content
- **Turbopack default** — ~400% faster dev; `--webpack` fallback if needed
- **Server Actions stable** — mutations without extra API endpoints
- **`proxy.ts` replaces `middleware.ts`** — explicit network boundary for auth
- **`"use cache"` directive** — granular per-component caching

### Drizzle + Prisma Migration (2026 Update)

- **Drizzle ~55KB bundle** vs Prisma 7's ~1.6MB — main driver continues
- **Prisma 7 rewrote engine in TypeScript** — 3× faster queries claimed; no Rust binary
- **Drizzle 0.45+ stable** — edge-runtime compatible, no codegen step
- **Strategy:** one domain at a time; no cross-ORM transactions; `strict: true` on Drizzle Kit

### Stripe Subscriptions 2026

- **Embedded Checkout** — Stripe pushes iframe/web-component over redirect
- **Webhooks:** `req.text()` (never `req.json()`), `constructEvent()` with secret, return 200 fast
- **Events:** `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_failed`

---

## Cheatsheets

| Topic | Resource |
| --- | --- |
| Next.js 16 | <https://nextjs.org/docs/app> |
| Drizzle ORM | <https://orm.drizzle.dev> |
| Stripe Subscriptions | <https://docs.stripe.com/billing/subscriptions/webhooks> |
| Auth.js v5 | <https://authjs.dev> |
| TanStack Query | <https://tanstack.com/query/latest> |

---

## Best Practices

1. **Server Components first** — server-side render catalog; only interactivity hydrates
2. **Drizzle DAL boundaries** — `dal/*` modules with precise `select` and `include`
3. **Stripe webhook idempotency** — check event ID uniqueness; `constructEvent()` verification
4. **TanStack for API state, Zustand for UI state** — clean separation of concerns
5. **Signed image URLs** — ImageKit/Cloudinary secure tokens for paywalled content
6. **Drizzle prepared statements** — precompile frequent chapter/catalog queries

---

## Common Pitfalls

| Pitfall | Impact | Avoidance |
| --- | --- | --- |
| Dual ORM during migration | Data drift | Migrate one domain at a time; no cross-ORM transactions |
| Missing Stripe webhook secret | 400 errors on events | Set `STRIPE_WEBHOOK_SECRET`; verify signature |
| Unsigned image URLs | Content theft | Sign URLs for subscriber-only content |
| Server data in client state | Stale UI | TanStack Query for API; Zustand only for UI state |
| Using `req.json()` in webhooks | Signature verify fails | Always `req.text()` for raw body |

---

## Performance

1. **`next/image` for catalog** — CDN-signed URLs; preload next chapter with `<link rel="preload">`
2. **Partial Prerendering** — static shell + streamed dynamic chapter content
3. **Drizzle prepared statements** — precompile high-frequency catalog queries
4. **Upstash Redis** — global replication, zero cold starts for caching/queuing
5. **Turbopack file-system caching** — persist compiler artifacts across dev restarts

---

## Security

1. **Signed image URLs** — protect paywalled content; expire after auth session ends
2. **Stripe webhook verification** — `constructEvent()` with endpoint secret
3. **WebAuthn/Passkeys** — phishing-resistant auth via NextAuth v5
4. **Rate limit auth endpoints** — Upstash Redis sliding window (5 req/15min)
5. **CSP headers** — content security for comic reader iframes/embeds
6. **Upgrade to Next.js 16.2.6+** — patches 13 advisories (May 2026)

---

## Related Projects (in workspace)

- **rhixe_scans** — comic reader; shared Stripe + NextAuth + Tailwind + media patterns
- **rhixecompany-comics** — consolidation target inheriting reader architecture
- **Banking** — shared Next.js + payment flow patterns; Drizzle ORM conventions
- **university-libary-jsm** — shared Next.js + Drizzle ORM + PostgreSQL reference

---

## Resources

| Resource | URL |
| --- | --- |
| Next.js 16 | <https://nextjs.org/docs> |
| Drizzle ORM | <https://orm.drizzle.dev> |
| Stripe Billing | <https://docs.stripe.com/billing> |
| Auth.js v5 | <https://authjs.dev> |
| Sentry | <https://docs.sentry.io/platforms/javascript/guides/nextjs> |

### Research Methodology

- **Web search:** Tavily search (2026 Next.js 16, Drizzle ORM, Stripe patterns)
- **Last verified:** 2026-07-28
