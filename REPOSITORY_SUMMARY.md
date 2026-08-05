# REPOSITORY_SUMMARY.md

# Comicwise — Comic Streaming Platform

**Generated:** 2026-07-25  
**Status:** Active  
**Path:** `projects/comicwise/`

---

## Architecture

| Property      | Value                                                                  |
| ------------- | ---------------------------------------------------------------------- |
| **Type**      | Next.js comic streaming platform                                       |
| **Pattern**   | App Router with Prisma ORM, Stripe subscriptions                       |
| **Reference** | [Workflow Analysis](../docs/Project_Architecture/Workflow_Analysis.md) |

Next.js 15 + Prisma + Stripe. Digital comic storefront with subscription management, user auth, and image-optimized content delivery.

---

## Technology Stack

| Layer               | Technology                                  |
| ------------------- | ------------------------------------------- |
| **Frontend**        | Next.js 15, TypeScript (strict), App Router |
| **UI**              | Radix UI + shadcn/ui, Tailwind CSS          |
| **Database**        | PostgreSQL via Prisma                       |
| **Auth**            | NextAuth.js v5                              |
| **Payments**        | Stripe (subscriptions)                      |
| **Deploy**          | Vercel                                      |
| **Package Manager** | pnpm                                        |

---

## Project Structure

```
comicwise/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── api/               # API routes
│   │   ├── (auth)/            # Auth pages
│   │   ├── (dashboard)/       # Protected pages
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui base
│   │   ├── comics/           # Comic-specific
│   │   └── subscriptions/    # Subscription UI
│   ├── lib/                  # Utilities
│   │   ├── auth.ts           # NextAuth config
│   │   ├── db.ts             # Prisma client
│   │   ├── stripe.ts         # Stripe client
│   │   └── validations/      # Zod schemas
│   ├── hooks/                # Custom React hooks
│   └── store/                # Zustand stores
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Migration history
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
└── .env.example
```

---

## Commands

```bash
# Install
pnpm install

# Database
pnpm db:generate    # Prisma generate
pnpm db:push        # Push schema to DB
pnpm db:studio      # Prisma Studio

# Development
pnpm dev

# Quality
pnpm lint
pnpm typecheck
pnpm format

# Build
pnpm build
pnpm start
```

---

## Key Features

| Feature           | Implementation                               |
| ----------------- | -------------------------------------------- |
| **Comic Reading** | Next.js Image optimization, lazy loading     |
| **Subscriptions** | Stripe Checkout + Webhooks + Customer Portal |
| **Library**       | User-owned comics, reading progress          |
| **Admin**         | Comic upload, chapter management, analytics  |
| **Search**        | Full-text search via PostgreSQL              |

---

## CI/CD

**Workflow:** `.github/workflows/comicwise-ci.yml`  
**Jobs:** Install → TypeScript check → ESLint → Build → Test

---

## Related Projects

| Project                  | Relationship                           |
| ------------------------ | -------------------------------------- |
| `rhixe_scans`            | Similar comic reader, Next.js + Prisma |
| `rhixecompany-comics`    | Consolidation target (P1)              |
| `selenium_webdriver`     | Scraping utility being consolidated    |
| `Django-Scrapy-Selenium` | Legacy scraper being consolidated      |
