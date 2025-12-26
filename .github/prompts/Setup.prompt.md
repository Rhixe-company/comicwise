# ComicWise Project Setup Prompt

## Project Overview
Next.js 16 + React 19 + TypeScript 5 + Drizzle ORM comic reading platform

## Quick Start
```bash
pnpm install
pnpm db:push
pnpm db:seed
pnpm dev
```

## Tech Stack
- **Framework:** Next.js 16 (App Router, React 19)
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** NextAuth.js v5
- **Styling:** TailwindCSS v4
- **Cache:** Redis (Upstash)
- **Upload:** Cloudinary, ImageKit, AWS S3

## Architecture
- `src/app` - Next.js App Router pages
- `src/components` - React components
- `src/lib` - Business logic & utilities
- `src/database` - Database schema & queries
- `src/types` - TypeScript definitions

## Key Features
- Full-text search with PostgreSQL
- Image optimization with multiple providers
- Rate limiting & caching
- Email notifications
- Admin dashboard

## Development Commands
- `pnpm dev` - Start dev server
- `pnpm build` - Production build
- `pnpm type-check` - Type checking
- `pnpm lint` - Lint code
- `pnpm test` - Run tests

## Configuration Files
All config files follow Next.js 16 and React 19 best practices.
See individual config files for details.
