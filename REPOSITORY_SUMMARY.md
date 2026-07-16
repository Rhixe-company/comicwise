# REPOSITORY_SUMMARY.md — comicwise

> Generated from actual git history and repository files. Evidence-based; nothing fabricated.

## Overview

**comicwise** is a full-stack **comic / manga streaming platform**. It lets users browse comics by genre/author/popularity, read them in an immersive reader, manage tiered subscriptions via Stripe, and engage through bookmarks, reading progress, comments, and ratings. Like Banking, it is a real code submodule (large `src/` tree, `docs/`, seed data, lint reports) rather than a stub.

The product is built on **Next.js 16** (App Router) with **PostgreSQL via Drizzle ORM** (a Prisma migration is noted as "in progress"), and integrates:

- **Stripe** — subscription / payment management
- **ImageKit + Cloudinary** — image optimization and storage
- **NextAuth v5 (beta)** with **WebAuthn passkeys** — authentication
- **BullMQ / Upstash QStash** — async job queues
- **Upstash Redis** — caching/rate limiting; **Sentry** — monitoring

Status per `README.md`: **Active**. License: **Private** (no license specified).

## Architecture

- **Framework:** Next.js 16.1.6 (App Router, Turbopack), React 19, server components by default
- **Language:** TypeScript 5.9.3 (strict)
- **UI:** Tailwind CSS 4, shadcn/ui, Framer Motion, Radix UI
- **State:** Zustand 5.x (client) + TanStack Query 5.x (server state)
- **Database:** PostgreSQL via Drizzle ORM 0.45.1 (Prisma migration in progress)
- **Auth:** NextAuth v5 (beta.30) with credentials/OAuth + WebAuthn passkeys; JWT sessions; middleware-protected routes
- **Payments:** Stripe (subscriptions)
- **Media:** ImageKit, Cloudinary
- **Email:** Resend + React Email
- **Async:** BullMQ 5.71.0, Upstash QStash
- **Caching:** Upstash Redis 1.37.0
- **Monitoring:** Sentry
- **Testing:** Vitest 4.1.0, Playwright 1.58.2
- **Package manager:** pnpm 9.12.3

### Layer map (from `ARCHITECTURE.md`)

```
Browser → Next.js App Router → RSC / Server Action
        → Drizzle ORM → PostgreSQL
        → Upstash Redis (cache) → ImageKit (images)
External: Stripe (payments), Sentry (monitoring), Resend (email)
```

## Key Components

- **App routes** (`src/app/`): route groups `(auth)`, `(root)` with `comics/`, `authors/`, `browse/`, `subscriptions/`, `settings/`; `admin/` dashboard; `api/` routes.
- **Pages:** `/` (home/browse), `/comics/[id]` (detail & reader), `/subscriptions`, `/auth`, `/admin`.
- **Server Actions** (`src/actions/`): data mutations (`"use server"`).
- **Components** (`src/components/`): React components incl. shadcn/ui primitives.
- **Lib / hooks / styles:** utilities, custom React hooks, global styles.
- **Data layer:** Drizzle ORM schemas; TanStack Query on client; Zustand stores.
- **Quality artifacts present in repo:** `lint-report.json`, `quality-gate.json`, `seed-report-2026-03-20.json`, `seed-urls-report.txt` (11.8 MB — large seeding dataset), `test-report.txt`, `test-ui-report.txt`, `triage-report.txt`, and many `docs/` planning docs (`MASTER_PHASE_PLAN_4-6.md`, `BATCH-IMPLEMENTATION-PLAN.md`, `PHASE4D-SECURITY-AUDIT.md`, etc.).
- **Config:** `next.config.ts`, `drizzle.config.ts`, `pnpm-workspace.yaml`, `Dockerfile`, `docker-compose.yml`, `.cwrc.json` (comicwise-specific config), `.schemas/`.

## Technologies

See `technology-stack.md`. Highlights:

- Next.js 16.1.6, React 19.2.4, TypeScript 5.9.3, Tailwind CSS 4.0.0, shadcn/ui 4.0.6, Zustand 5.0.11, Zod 4.3.6, React Hook Form 7.71.2, TanStack Query 5.90.21, TanStack Table 8.21.3, Recharts 3.8.0
- Backend/DB: NextAuth v5 5.0.0-beta.30, Drizzle ORM 0.45.1, Upstash Redis 1.37.0, BullMQ 5.71.0
- Integrations: ImageKit, Cloudinary, Stripe, Resend, Sentry
- Dev/quality: pnpm, ESLint 9.0.0, Prettier 3.8.1, Vitest 4.1.0, Playwright 1.58.2, Husky 9.1.7

## Data Flow

`Browser → Next.js App Router → RSC/Server Action → Drizzle ORM → PostgreSQL`, with Upstash Redis as cache and ImageKit for image delivery. Stripe webhooks drive the subscription lifecycle; Sentry captures errors; Resend delivers transactional email.

## Team

Git contributor statistics (`git shortlog -sn`):

- **Total contributors:** 1
- **Contributor:** `rhixecompany <rhixecompany@gmail.com>` — 7 commits (100%)

> Note: All commits carry the same author identity. The commit history reflects repository setup/maintenance activity rather than the original upstream development history (see `THE_STORY_OF_THIS_REPO.md`).

## Evidence Appendix (git)

- `git rev-list --count HEAD` = **7** commits total (all within the last year).
- Commit dates span **2026-06-12 → 2026-07-16**, all authored by `rhixecompany`.
- Files present confirm a real, sizable Next.js project (e.g. `bun.lock` ~492 KB, `package.json` 15.5 KB, large seed datasets, comprehensive `docs/` plans). Notably, comicwise has the **richest planning/audit paper trail** of the five repos (phase plans, security audits, quality gates).
