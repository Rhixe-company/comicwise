# ComicWise - Complete Setup Guide

> Comprehensive setup documentation for the ComicWise project

**Last Updated:** December 24, 2025  
**Version:** 2.0  
**Package Manager:** pnpm

---

## 📑 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Development Workflow](#development-workflow)
6. [Project Structure](#project-structure)
7. [Custom Path Aliases](#custom-path-aliases)
8. [Scaffolding & Templates](#scaffolding--templates)
9. [Shell Aliases](#shell-aliases)
10. [Type Safety](#type-safety)
11. [Linting & Formatting](#linting--formatting)
12. [Testing](#testing)
13. [Docker Setup](#docker-setup)
14. [Deployment](#deployment)
15. [Troubleshooting](#troubleshooting)
16. [Best Practices](#best-practices)

---

## Prerequisites

### Required Software

- **Node.js**: 22+ (LTS recommended)
- **pnpm**: 9+ (enable with `corepack enable`)
- **PostgreSQL**: 17+ or Docker
- **Git**: Latest version

### Optional Tools

- **Docker**: For containerized development
- **VS Code**: Recommended editor
- **Redis**: For caching (or use Docker)

### System Requirements

- **OS**: Windows 10+, macOS 10.15+, Linux
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 5GB free space

---

## Initial Setup

### 1. Clone Repository

\`\`\`bash git clone <repository-url> cd comicwise \`\`\`

### 2. Install Dependencies

\`\`\`bash

# Enable Corepack (if not already enabled)

corepack enable

# Install all dependencies

pnpm install \`\`\`

### 3. Environment Setup

\`\`\`bash

# Copy environment template

cp .env.example .env.local

# Edit configuration

# Windows: notepad .env.local

# macOS/Linux: nano .env.local

\`\`\`

---

## Environment Configuration

### Required Variables

\`\`\`env

# Database

DATABASE_URL=postgresql://user:password@localhost:5432/comicwise

# Authentication

NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=http://localhost:3000

# Email (optional but recommended)

EMAIL_SERVER_HOST=smtp.gmail.com EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@comicwise.com \`\`\`

### Optional Services

\`\`\`env

# OAuth Providers (optional)

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

GITHUB_ID=your-github-id GITHUB_SECRET=your-github-secret

# Image Upload (choose one)

CLOUDINARY_CLOUD_NAME=your-cloud-name CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Or ImageKit

IMAGEKIT_PUBLIC_KEY=your-public-key IMAGEKIT_PRIVATE_KEY=your-private-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id

# Redis (for caching)

REDIS_URL=redis://localhost:6379

# QStash (for background jobs)

QSTASH_URL=your-qstash-url QSTASH_TOKEN=your-qstash-token \`\`\`

---

## Database Setup

### Local PostgreSQL

\`\`\`bash

# Push schema to database

pnpm db:push

# Seed database with sample data

pnpm db:seed

# Open Drizzle Studio (database GUI)

pnpm db:studio \`\`\`

### Docker PostgreSQL

\`\`\`bash

# Start all services (includes PostgreSQL & Redis)

docker-compose -f docker-compose.dev.yml up -d

# Initialize database

docker-compose exec app pnpm db:push docker-compose exec app pnpm db:seed \`\`\`

### Database Commands

| Command              | Description               |
| -------------------- | ------------------------- |
| \`pnpm db:push\`     | Push schema to database   |
| \`pnpm db:pull\`     | Pull schema from database |
| \`pnpm db:generate\` | Generate migrations       |
| \`pnpm db:migrate\`  | Run migrations            |
| \`pnpm db:studio\`   | Open Drizzle Studio       |
| \`pnpm db:seed\`     | Seed database             |
| \`pnpm db:reset\`    | Drop, recreate, and seed  |

---

## Development Workflow

### Start Development Server

\`\`\`bash

# Start with Turbopack (faster)

pnpm dev

# Start with debugging

pnpm dev:debug

# Start with HTTPS

pnpm dev:https \`\`\`

### Code Quality Checks

\`\`\`bash

# Type check

pnpm type-check

# Lint code

pnpm lint

# Auto-fix lint issues

pnpm lint:fix

# Format code

pnpm format

# Run all validations

pnpm validate \`\`\`

### Build & Production

\`\`\`bash

# Build for production

pnpm build

# Build with bundle analysis

pnpm build:analyze

# Start production server

pnpm start \`\`\`

---

## Project Structure

\`\`\` comicwise/ ├── src/ │ ├── app/ # Next.js App Router │ │ ├── (auth)/ #
Authentication pages │ │ ├── (root)/ # Main app routes │ │ ├── admin/ # Admin
dashboard │ │ ├── api/ # API routes │ │ ├── layout.tsx # Root layout │ │ └──
page.tsx # Home page │ ├── components/ # React components │ │ ├── ui/ #
shadcn/ui components │ │ ├── layout/ # Layout components │ │ ├── admin/ # Admin
components │ │ └── emails/ # Email templates │ ├── lib/ # Utilities & helpers │
│ ├── actions/ # Server actions │ │ ├── validations/ # Zod schemas │ │ ├──
auth.ts # NextAuth config │ │ └── utils.ts # Utility functions │ ├── database/ #
Database layer │ │ ├── schema.ts # Drizzle schema │ │ ├── queries/ # Database
queries │ │ ├── mutations/ # Database mutations │ │ └── db.ts # Database client
│ ├── types/ # TypeScript types │ │ ├── index.ts # Type exports │ │ ├──
database.ts # DB types │ │ └── ... # Other types │ ├── hooks/ # Custom React
hooks │ ├── services/ # External services │ ├── stores/ # State management │ └──
styles/ # Global styles ├── public/ # Static assets ├── scripts/ # Build &
utility scripts ├── docs/ # Documentation ├── .env.local # Environment variables
├── next.config.ts # Next.js config ├── tailwind.config.ts # Tailwind config ├──
tsconfig.json # TypeScript config └── package.json # Dependencies \`\`\`

---

## Custom Path Aliases

### Primary Aliases (# prefix)

\`\`\`typescript import { Button } from "#ui/button"; import { createUser } from
"#actions/users"; import { db } from "#database/db"; import type { User } from
"#types"; \`\`\`

### Available Aliases

| Alias              | Path                       | Usage            |
| ------------------ | -------------------------- | ---------------- |
| \`#/\*\`           | \`./src/\*\`               | Core source      |
| \`#components/\*\` | \`./src/components/\*\`    | Components       |
| \`#ui/\*\`         | \`./src/components/ui/\*\` | UI components    |
| \`#lib/\*\`        | \`./src/lib/\*\`           | Libraries        |
| \`#actions/\*\`    | \`./src/lib/actions/\*\`   | Server actions   |
| \`#hooks/\*\`      | \`./src/hooks/\*\`         | React hooks      |
| \`#types/\*\`      | \`./src/types/\*\`         | TypeScript types |
| \`#database/\*\`   | \`./src/database/\*\`      | Database         |
| \`#services/\*\`   | \`./src/services/\*\`      | Services         |

### Short Aliases

| Alias      | Path                         |
| ---------- | ---------------------------- |
| \`auth\`   | \`./src/lib/auth.ts\`        |
| \`db\`     | \`./src/database/db.ts\`     |
| \`schema\` | \`./src/database/schema.ts\` |
| \`utils\`  | \`./src/lib/utils.ts\`       |
| \`types\`  | \`./src/types/index.ts\`     |

---

## Scaffolding & Templates

### Quick Scaffolding

\`\`\`bash

# Create component

pnpm scaffold component UserCard

# Create page

pnpm scaffold page dashboard/analytics

# Create API route

pnpm scaffold api users

# Create server action

pnpm scaffold action createUser

# Create hook

pnpm scaffold hook useUser

# Create database query

pnpm scaffold query getUserById

# Create type definition

pnpm scaffold type UserProfile \`\`\`

### Template Types

- **Component**: React components (client/server)
- **Page**: Next.js pages
- **API**: API route handlers
- **Action**: Server actions
- **Hook**: Custom React hooks
- **Query**: Database queries
- **Mutation**: Database mutations
- **Type**: TypeScript types
- **Test**: Test files

---

## Shell Aliases

### Installation

#### PowerShell (Windows)

\`\`\`powershell

# Add to PowerShell profile

. C:\\path\\to\\comicwise\\scripts\\aliases-comicwise.ps1

# Or permanently

echo ". $(Get-Location)\\scripts\\aliases-comicwise.ps1" >> $PROFILE \`\`\`

#### Bash/Zsh (macOS/Linux)

\`\`\`bash

# Add to ~/.bashrc or ~/.zshrc

source /path/to/comicwise/scripts/aliases-comicwise.sh

# Or

echo "source $(pwd)/scripts/aliases-comicwise.sh" >> ~/.bashrc \`\`\`

### Common Aliases

\`\`\`bash cw # pnpm cwd # pnpm dev cwb # pnpm build cws # pnpm start cwt # pnpm
test

cw:db # pnpm db:studio cw:db:seed # pnpm db:seed cw:db:reset # pnpm db:reset

cw:check # pnpm type-check cw:lint # pnpm lint cw:lint:fix # pnpm lint:fix
cw:validate # pnpm validate

cw:fresh # Fresh setup (clean + install + seed) cw:quick:check # Quick
validation cw:full:check # Full validation with tests \`\`\`

---

## Type Safety

### Type Checking

\`\`\`bash

# Check types

pnpm type-check

# Watch mode

pnpm type-check:watch

# Fix common type issues

pnpm tsx scripts/fix-any-types.ts --dry-run \`\`\`

### Type Organization

All types are centralized in \`src/types/\`:

- \`Core.ts\` - Core application types
- \`database.ts\` - Database models
- \`actions.ts\` - Server action types
- \`Api.ts\` - API response types
- \`forms.ts\` - Form data types
- \`index.ts\` - Centralized exports

### Import Types

\`\`\`typescript // From centralized types import type { User, Comic,
ApiResponse } from "types";

// From specific type files import type { ComicFilters } from "#types/database";
\`\`\`

---

## Linting & Formatting

### Configuration

- **ESLint**: \`eslint.config.ts\`
- **Prettier**: \`.prettierrc.ts\`
- **TypeScript**: \`tsconfig.json\`

### Commands

\`\`\`bash

# Lint code

pnpm lint

# Fix auto-fixable issues

pnpm lint:fix

# Strict mode (fail on warnings)

pnpm lint:strict

# Format code

pnpm format

# Check formatting

pnpm format:check \`\`\`

### Pre-commit Hooks

Husky runs automatically before commits:

- Prettier formatting
- ESLint checks
- Type checking

---

## Testing

### Unit Tests (Vitest)

\`\`\`bash

# Run unit tests

pnpm test:unit

# Watch mode

pnpm test:unit:watch

# Coverage report

pnpm test:unit:coverage

# UI mode

pnpm test:unit:ui \`\`\`

### E2E Tests (Playwright)

\`\`\`bash

# Run E2E tests

pnpm test

# UI mode

pnpm test:ui

# Debug mode

pnpm test:debug

# Headed mode

pnpm test:headed

# Generate tests

pnpm test:codegen \`\`\`

---

## Docker Setup

### Development

\`\`\`bash

# Start all services

docker-compose -f docker-compose.dev.yml up -d

# View logs

docker-compose logs -f

# Stop services

docker-compose down

# Clean up

docker-compose down -v --remove-orphans \`\`\`

### Production

\`\`\`bash

# Build production image

docker-compose build

# Start production

docker-compose up -d

# Health check

docker-compose ps \`\`\`

### Services

- **App**: http://localhost:3000
- **PostgreSQL**: localhost:5433
- **PgAdmin**: http://localhost:5051
- **Redis**: localhost:6380

---

## Deployment

### Vercel

\`\`\`bash

# Deploy preview

pnpm deploy:preview

# Deploy production

pnpm deploy:vercel \`\`\`

### Environment Variables

Set these in your deployment platform:

- \`DATABASE_URL\`
- \`NEXTAUTH_SECRET\`
- \`NEXTAUTH_URL\`
- All optional service credentials

---

## Troubleshooting

### Common Issues

#### Port Already in Use

\`\`\`bash

# Kill process on port 3000 (Windows)

Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess |
Stop-Process

# macOS/Linux

lsof -ti:3000 | xargs kill \`\`\`

#### Database Connection Failed

\`\`\`bash

# Check database is running

pnpm health:db

# Reset database

pnpm db:reset \`\`\`

#### Type Errors

\`\`\`bash

# Clean and rebuild

pnpm clean pnpm install pnpm db:generate pnpm type-check \`\`\`

#### Build Fails

\`\`\`bash

# Clean Next.js cache

pnpm clean:cache

# Rebuild

pnpm build \`\`\`

---

## Best Practices

### Code Organization

1. Use path aliases for imports
2. Keep components small and focused
3. Colocate related files
4. Use TypeScript strictly

### Database

1. Always use transactions for multiple operations
2. Use prepared statements (Drizzle handles this)
3. Index frequently queried fields
4. Validate data with Zod before DB operations

### Performance

1. Use Server Components by default
2. Add "use client" only when needed
3. Implement caching strategies
4. Optimize images with Next.js Image

### Security

1. Never commit secrets
2. Validate all user input
3. Use rate limiting for API routes
4. Sanitize database inputs

---

## GitHub Copilot CLI Prompts

### Quick Setup

\`\`\` @workspace Setup ComicWise project from scratch with all dependencies and
database \`\`\`

### Create Component

\`\`\` @workspace Create a new UserProfile component in src/components with
proper TypeScript types and styling \`\`\`

### Add Feature

\`\`\` @workspace Add a new comic rating feature with database schema, API
route, and UI component \`\`\`

### Fix Errors

\`\`\` @workspace Fix all TypeScript type errors in src/components/admin \`\`\`

### Optimize

\`\`\` @workspace Optimize database queries in src/database/queries for better
performance \`\`\`

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [pnpm Documentation](https://pnpm.io)

---

**Need Help?**

- Check existing [documentation](./README.md)
- Review [closed issues](../../issues?q=is%3Aissue+is%3Aclosed)
- Open a [new issue](../../issues/new)

---

_Last updated: December 24, 2025_
