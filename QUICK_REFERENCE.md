# ComicWise - Quick Reference Guide

> **Quick commands and workflows for daily development**

---

## 🚀 Daily Development

```bash
# Start development server
pnpm dev

# Open in browser
http://localhost:3000

# View database
pnpm db:studio
```

---

## ✅ Before Committing

```bash
# Run all checks (recommended)
pnpm validate

# Or run individually:
pnpm type-check    # TypeScript validation
pnpm lint:strict   # ESLint with no warnings
pnpm format:check  # Prettier formatting check
```

---

## 🗄️ Database

```bash
# Push schema changes
pnpm db:push

# Seed database
pnpm db:seed

# Open Drizzle Studio
pnpm db:studio

# Reset database (destructive!)
pnpm db:reset
```

---

## 🧪 Testing

```bash
# Run all tests
pnpm test:all

# Unit tests only
pnpm test:unit

# E2E tests only
pnpm test

# Watch mode
pnpm test:unit:watch

# Interactive UI
pnpm test:ui
```

---

## 🎨 Code Quality

```bash
# Auto-fix lint issues
pnpm lint:fix

# Format all files
pnpm format

# Type check
pnpm type-check
```

---

## 📦 Build & Deploy

```bash
# Production build
pnpm build

# Start production server
pnpm start

# Deploy to Vercel
pnpm deploy:vercel
```

---

## 🐳 Docker

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Clean up
docker-compose down -v
```

---

## 🔍 Troubleshooting

```bash
# Clear cache
pnpm clean

# Reinstall dependencies
pnpm clean:all && pnpm install

# Check health
pnpm health:all

# Database connection
pnpm health:db

# Redis connection
pnpm health:redis
```

---

## 📝 Common Tasks

### Create New Component

```bash
pnpm cli scaffold component MyComponent
```

### Create New Page

```bash
# Manual: create src/app/(root)/my-page/page.tsx
```

### Update Dependencies

```bash
pnpm check-updates
pnpm update-deps
```

### Seed Specific Data

```bash
pnpm db:seed:users
pnpm db:seed:comics
pnpm db:seed:chapters
```

---

## 🎯 Path Aliases

Use these in imports:

```typescript
import { Button } from "@/components/ui/button";
import { db } from "@/database/db";
import type { UserDto } from "@/dto";
import { getCurrentUser } from "@/lib/auth";
import { createComic } from "@/database/mutations/comics";
import { getComicBySlug } from "@/database/queries/comics";
```

---

## 🔐 Environment

Required `.env.local` variables:

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

---

## 📊 Monitoring

```bash
# Cache stats
pnpm cache:stats

# Queue stats
pnpm queue:stats

# Redis CLI
pnpm redis:cli
```

---

## 🆘 Help

```bash
# Interactive CLI
pnpm cli

# List all scripts
pnpm run

# Script help
pnpm <script> --help
```

---

**Last Updated**: December 26, 2025
