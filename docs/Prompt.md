# ComicWise Development Guide

A comprehensive guide for developing and maintaining the ComicWise project - a
Next.js 16 comic reading platform with PostgreSQL, Redis, and TypeScript.

## Table of Contents

- [Quick Reference](#quick-reference)
- [Project Structure](#project-structure)
- [Path Aliases](#path-aliases)
- [Initial Setup Tasks](#initial-setup-tasks)
- [Development Workflow](#development-workflow)
- [Code Quality Standards](#code-quality-standards)
- [Database Operations](#database-operations)
- [Component Installation](#component-installation)
- [Type Generation](#type-generation)
- [Migration & Refactoring Tasks](#migration--refactoring-tasks)
- [Feature Implementation Tasks](#feature-implementation-tasks)
- [Common Tasks](#common-tasks)
- [Scripts Reference](#scripts-reference)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Quick Reference

### Environment

- **Package Manager:** `pnpm` (Windows system)
- **Runtime:** Node.js 22+
- **Framework:** Next.js 16 (App Router + Turbopack)
- **Database:** PostgreSQL 17 + Drizzle ORM
- **Cache:** Redis (Upstash)
- **TypeScript:** 5.x
- **Styling:** Tailwind CSS 4
- **UI:** shadcn/ui components
- **Auth:** NextAuth.js v5
- **Email:** React Email + Nodemailer
- **Image Upload:** ImageKit/Cloudinary/Local

### Critical Notes

⚠️ **Before Starting:**

- Do NOT create summaries until all tasks are completed successfully
- Package manager: **pnpm** on **Windows** system
- Consider rate-limiting when running tasks (avoid hitting API limits)
- Complete all tasks without creating explanations unless errors occur

### Essential Commands

```bash
# Development
pnpm dev              # Start dev server (Turbopack)
pnpm build            # Production build
pnpm start            # Start production server

# Quality Checks
pnpm validate         # Type-check + lint + format check
pnpm type-check       # TypeScript validation
pnpm lint             # Run ESLint
pnpm lint:check       # Check linting without fixing
pnpm lint:fix         # Auto-fix ESLint issues
pnpm format           # Format with Prettier

# Database
pnpm db:studio        # Open Drizzle Studio
pnpm db:push          # Push schema to database
pnpm db:seed          # Seed with test data
pnpm db:reset         # Drop, recreate, seed

# Testing
pnpm test             # E2E tests (Playwright)
pnpm test:unit        # Unit tests (Vitest)
pnpm test:all         # All tests

# Docker
pnpm docker:up        # Start containers
pnpm docker:down      # Stop containers
pnpm docker:clean     # Clean all containers/volumes

# Health Checks
pnpm health:all       # Check all services
pnpm health:db        # Database only
pnpm health:redis     # Redis only
```

---

## Initial Setup Tasks

### 1. Project Understanding

**Read and understand all project files:**

```bash
# Markdown and text files
@.md    # All markdown documentation
@.txt   # Text documentation files

# Code files
@.ts    # TypeScript files
@.tsx   # React TypeScript files
@.mjs   # ES Module JavaScript files
@.mts   # TypeScript module files
@.json  # Configuration JSON files

# Configuration
@.yml   # YAML configuration files
@.ps1   # PowerShell scripts
@.sh    # Bash scripts
@Dockerfile  # Docker configuration
```

**Analyze:**

- Package manager: **pnpm**
- Overall project structure
- Configuration patterns
- Code organization
- Existing patterns and conventions

### 2. Configuration Review & Validation

#### 2.1 Prettier Configuration

Review `@.prettierrc.ts`:

**Verify all Prettier plugins are installed:**

- `prettier`
- `prettier-plugin-organize-imports`
- `prettier-plugin-tailwindcss`
- `prettier-plugin-packagejson`
- `prettier-plugin-sort-json`

**Action:** Install missing plugins if needed

#### 2.2 PostCSS Configuration

Review `@postcss.config.mjs`:

**Required plugins:**

- `autoprefixer`
- `cssnano`
- `postcss-import`
- `postcss-nested`
- `postcss-preset-env`

**Action:** Install missing PostCSS packages

#### 2.3 ESLint Configuration

Review `@eslint.config.ts`:

**Verify:**

1. All ESLint plugins are properly installed and configured
2. Each plugin has rules configured in the main config block
3. There are no redundant or conflicting rules
4. The config adheres to best practices for performance and maintainability

**Action:**

- Report any missing plugins or configuration gaps
- Install any missing packages
- Provide maximum patch for gaps

### 3. Install Core Dependencies

```bash
# Core dependencies
pnpm add @auth/drizzle-adapter @auth/core @upstash/qstash @upstash/ratelimit @upstash/redis @upstash/workflow dotenv drizzle-orm drizzle-zod imagekit imagekitio-next next-auth nodemailer postgres server-only slugify

# Dev dependencies
pnpm add -D drizzle-kit npm-check-updates cspell eslint-config-prettier eslint-plugin-better-tailwindcss eslint-plugin-jsx-a11y @types/eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-drizzle eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-simple-import-sort eslint-plugin-zod globals prettier prettier-plugin-organize-imports prettier-plugin-tailwindcss @eslint/css @eslint/json @eslint/markdown eslint-formatter-compact autoprefixer cssnano postcss-import postcss-nested
```

---

## Project Structure

```
comicwise/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/          # Auth pages (sign-in, sign-up, etc.)
│   │   ├── (root)/          # Public pages (home, comics, etc.)
│   │   ├── admin/           # Admin dashboard
│   │   └── api/             # API routes
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── admin/          # Admin-specific components
│   │   ├── emails/         # React Email templates
│   │   └── layout/         # Layout components
│   ├── lib/                 # Core utilities
│   │   ├── actions/        # Server actions
│   │   ├── validations/    # Zod schemas
│   │   ├── auth.ts         # NextAuth config
│   │   ├── cache.ts        # Redis caching
│   │   ├── email.ts        # Email sending
│   │   ├── ratelimit.ts    # Rate limiting
│   │   └── utils.ts        # Utility functions
│   ├── dal/                 # Data Access Layer
│   ├── dto/                 # Data Transfer Objects
│   ├── database/           # Database layer
│   │   ├── queries/        # Read operations
│   │   ├── mutations/      # Write operations
│   │   ├── seed/           # Seed data & scripts
│   │   ├── schema.ts       # Drizzle schema
│   │   └── db.ts           # Database client
│   ├── services/           # Business logic
│   │   ├── upload/         # Image upload service
│   │   ├── cacheService.ts
│   │   ├── imageService.ts
│   │   └── searchService.ts
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript types & definitions
│   └── stores/             # State management (Zustand)
├── scripts/                # Build & utility scripts
├── compose/                # Docker compose configurations
├── public/                 # Static assets
├── drizzle/                # Database migrations
├── .envs/                  # Environment templates
├── app-config.ts           # App configuration
├── package.json            # Dependencies & scripts
├── tsconfig.json           # TypeScript config
└── docker-compose.yml      # Docker setup
```

---

## Path Aliases

The project uses TypeScript path aliases for clean imports. All aliases are
configured in `tsconfig.json`.

### Primary Aliases (# prefix)

```typescript
#components/*  → src/components/*
#ui/*          → src/components/ui/*
#layout/*      → src/components/layout/*
#emails/*      → src/components/emails/*
#admin/*       → src/components/admin/*

#lib/*         → src/lib/*
#actions/*     → src/lib/actions/*
#validations/* → src/lib/validations/*

#dal           → src/dal
#dal/*         → src/dal/*
#dto           → src/dto
#dto/*         → src/dto/*

#database/*    → src/database/*
#db/*          → src/database/*
#queries/*     → src/database/queries/*
#mutations/*   → src/database/mutations/*
#schema        → src/database/schema.ts

#hooks/*       → src/hooks/*
#types/*       → src/types/*
#services/*    → src/services/*
#stores/*      → src/stores/*
```

### Short Aliases (no prefix)

```typescript
auth           → src/lib/auth.ts
authConfig     → src/lib/authConfig.ts
db             → src/database/db.ts
schema         → src/database/schema.ts
utils          → src/lib/utils.ts
cn             → src/lib/utils.ts (same as utils)
types          → src/types/index.ts
appConfig      → app-config.ts
redis          → redis.ts
env            → src/lib/env.ts
```

### Legacy Aliases (@ prefix) - Backwards Compatibility

```typescript
@/*            → src/*
@/components/* → src/components/*
@/lib/*        → src/lib/*
@/hooks/*      → src/hooks/*
@/database/*   → src/database/*
```

### Usage Examples

```typescript
// Good - Using short aliases
import { db } from "db";
import { comics } from "schema";
import { cn } from "utils";

// Good - Using # prefix
import { Button } from "#ui/button";
import { createComic } from "#actions/comics";
import { comicDal } from "#dal/comicDal";

// Acceptable - Legacy @ prefix
import { SomeComponent } from "@/components/SomeComponent";

// Avoid - Full relative paths
import { db } from "../../database/db"; // ❌ Don't do this
```

---

## Component Installation

### shadcn/ui Components

#### Install All Components (Bulk)

```bash
# Install all components at once
pnpm dlx shadcn@latest add -a --overwrite
```

#### Install Dashboard

```bash
pnpm dlx shadcn@latest add dashboard-01 --overwrite
```

#### Install WDS Components

```bash
pnpm dlx shadcn@latest add @wds/action-button @wds/loading-swap @wds/multi-select @wds/number-input @wds/password-input --overwrite
```

#### Install React Bits

```bash
pnpm dlx shadcn@latest add @react-bits/LightRays-TS-TW
```

#### Install SS Themes & Components

```bash
# Theme
pnpm dlx shadcn@latest add @ss-themes/material-design

# Data table
pnpm dlx shadcn@latest add @ss-components/data-table-04

# Blocks
pnpm dlx shadcn@latest add @ss-blocks/dashboard-shell-01 @ss-blocks/blog-component-01 @ss-blocks/navbar-component-01 @ss-blocks/footer-component-01 @ss-blocks/login-page-01 @ss-blocks/register-01 @ss-blocks/application-shell-01
```

#### Install Registry Components (Bulk)

```bash
# All registry components at once
pnpm dlx shadcn@latest add https://www.shadcn.io/registry/amber-minimal.json https://www.shadcn.io/registry/table.json https://www.shadcn.io/registry/list.json https://www.shadcn.io/registry/choicebox.json https://www.shadcn.io/registry/color-picker.json https://www.shadcn.io/registry/combobox.json https://www.shadcn.io/registry/dropzone.json https://www.shadcn.io/registry/image-crop.json https://www.shadcn.io/registry/image-zoom.json https://www.shadcn.io/registry/announcement.json https://www.shadcn.io/registry/avatar-group.json https://www.shadcn.io/registry/pill.json https://www.shadcn.io/registry/tags.json https://www.shadcn.io/registry/navbar-05.json https://www.shadcn.io/registry/relative-time.json https://www.shadcn.io/registry/3d-card.json https://www.shadcn.io/registry/spinner.json https://www.shadcn.io/registry/interactive-grid-pattern.json https://www.shadcn.io/registry/marquee.json https://www.shadcn.io/registry/video-player.json https://www.shadcn.io/registry/mini-calendar.json https://www.shadcn.io/registry/use-copy-to-clipboard.json https://www.shadcn.io/registry/use-local-storage.json https://www.shadcn.io/registry/use-debounce-value.json https://www.shadcn.io/registry/use-boolean.json https://www.shadcn.io/registry/use-on-click-outside.json https://www.shadcn.io/registry/use-media-query.json https://www.shadcn.io/registry/use-dark-mode.json --overwrite
```

#### Install UI Components (Individual)

```bash
# Tables and Lists
pnpm dlx shadcn@latest add https://www.shadcn.io/registry/table.json
pnpm dlx shadcn@latest add https://www.shadcn.io/registry/list.json https://www.shadcn.io/registry/choicebox.json

# Form Components
pnpm dlx shadcn@latest add https://www.shadcn.io/registry/color-picker.json https://www.shadcn.io/registry/dropzone.json https://www.shadcn.io/registry/video-player.json https://www.shadcn.io/registry/mini-calendar.json

# Advanced Components
pnpm dlx shadcn@latest add https://www.shadcn.io/registry/combobox.json https://www.shadcn.io/registry/image-crop.json https://www.shadcn.io/registry/image-zoom.json https://www.shadcn.io/registry/announcement.json https://www.shadcn.io/registry/avatar-group.json https://www.shadcn.io/registry/pill.json https://www.shadcn.io/registry/tags.json https://www.shadcn.io/registry/navbar-05.json https://www.shadcn.io/registry/relative-time.json https://www.shadcn.io/registry/3d-card.json https://www.shadcn.io/registry/spinner.json https://www.shadcn.io/registry/interactive-grid-pattern.json https://www.shadcn.io/registry/marquee.json
```

#### Install React Hooks (Individual)

```bash
# Storage hooks
pnpm dlx shadcn@latest add https://www.shadcn.io/registry/use-local-storage.json

# Utility hooks
pnpm dlx shadcn@latest add https://www.shadcn.io/registry/use-boolean.json
pnpm dlx shadcn@latest add https://www.shadcn.io/registry/use-debounce-value.json
pnpm dlx shadcn@latest add https://www.shadcn.io/registry/use-on-click-outside.json
pnpm dlx shadcn@latest add https://www.shadcn.io/registry/use-media-query.json
pnpm dlx shadcn@latest add https://www.shadcn.io/registry/use-dark-mode.json
pnpm dlx shadcn@latest add https://www.shadcn.io/registry/use-is-client.json
pnpm dlx shadcn@latest add https://www.shadcn.io/registry/use-copy-to-clipboard.json
```

---

## Type Generation

### Generate TypeScript Declaration Files

```bash
# React
pnpm dlx dts-gen@latest -m react

# Prettier plugins
pnpm dlx dts-gen@latest -m prettier-plugin-organize-imports

# TypeScript ESLint
pnpm dlx dts-gen@latest -m typescript-eslint -f tsEslint.d.ts

# ESLint plugins
pnpm dlx dts-gen@latest -m eslint-plugin-zod -f pluginZod.d.ts
pnpm dlx dts-gen@latest -m eslint-plugin-simple-import-sort -f pluginSimpleImportSort.d.ts
pnpm dlx dts-gen@latest -m eslint-plugin-react-hooks -f pluginReactHooks.d.ts
pnpm dlx dts-gen@latest -m eslint-plugin-prettier -f pluginPrettier.d.ts
pnpm dlx dts-gen@latest -m eslint-plugin-jsx-a11y -f pluginJsxA11y.d.ts
pnpm dlx dts-gen@latest -m eslint-plugin-drizzle -f pluginDrizzle.d.ts
pnpm dlx dts-gen@latest -m eslint-plugin-better-tailwindcss -f pluginBetterTailwindcss.d.ts

# Next.js and Auth
pnpm dlx dts-gen@latest -m next
pnpm dlx dts-gen@latest -m @auth/core
pnpm dlx dts-gen@latest -m @auth/drizzle-adapter
pnpm dlx dts-gen@latest -m next-auth

# ESLint packages
pnpm dlx dts-gen@latest -m @eslint/css
pnpm dlx dts-gen@latest -m @eslint/json
pnpm dlx dts-gen@latest -m @eslint/markdown

# Email
pnpm dlx dts-gen@latest -m nodemailer
pnpm dlx dts-gen@latest -m @types/nodemailer
```

---

## Migration & Refactoring Tasks

### 1. TypeScript Path Alias Setup

**Setup custom paths in `tsconfig.json`:**

```typescript
// Already configured in project:
{
  "compilerOptions": {
    "paths": {
      // Primary (#) - recommended
      "#components/*": ["./src/components/*"],
      "#ui/*": ["./src/components/ui/*"],
      "#lib/*": ["./src/lib/*"],
      "#actions/*": ["./src/lib/actions/*"],
      "#dal/*": ["./src/dal/*"],
      "#dto/*": ["./src/dto/*"],

      // Short aliases - convenience
      "utils": ["./src/lib/utils.ts"],
      "actions": ["./src/lib/actions"],
      "db": ["./src/database/db.ts"],
      "schema": ["./src/database/schema.ts"],

      // Legacy (@) - backwards compatibility
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
```

**Action:** Ensure all paths are configured correctly

### 2. Import Path Migration

**Replace all imports throughout the project:**

```bash
# Replace the following patterns:
@/src/lib/utils       → utils
@/src/lib/actions     → actions
@/src/components      → components
@/src/components/layout → layout
@/src/components/ui   → ui
```

**Tool:** Optimize `@scripts/replace-imports.ts` to handle this migration

**Action:** Run the migration script after optimization

### 3. Type Safety Improvements

**Task: Update all `any` types**

- Replace `any` with proper generic types
- Infer types from usage where possible
- Use `unknown` for truly unknown types

**Task: Create comprehensive types file**

Location: `@src/types/*`

**Action:**

1. Create optimized type definitions
2. Define all interfaces for the project
3. Ensure type safety across codebase
4. Update all project files to use new types

### 4. File Naming Convention

**Task: Refactor to CamelCase**

- Refactor all `@.ts` and `@.tsx` files to use CamelCase
- Ensure all fields in `@src/database/schema.ts` use CamelCase
- Update all related files and functions

**Example:**

```bash
# Before
user-profile.tsx
user_actions.ts

# After
UserProfile.tsx
UserActions.ts
```

### 5. Server Actions Optimization

**Task: Create DTO pattern for server actions**

- Optimize all files with `"use server"` directive
- Create enhanced DTO versions at `@src/dto`
- Update all usage to reference DTO files
- Delete old files after migration

**Structure:**

```
src/
├── dto/
│   ├── authDto.ts      # Authentication DTOs
│   ├── comicsDto.ts    # Comics DTOs
│   ├── chaptersDto.ts  # Chapters DTOs
│   └── ...
└── lib/actions/
    ├── auth.ts         # Uses authDto
    ├── comics.ts       # Uses comicsDto
    └── ...
```

### 6. DAL & DTO Refactoring

**Task: Refactor Data Access Layer**

Location: `@src/dal/*Dal.ts`

**Ensure:**

- Proper data access handling
- Separation of database logic from business logic
- Consistent patterns across all DAL files

**Task: Refactor Data Transfer Objects**

Location: `@src/dto/*Dto.ts`

**Ensure:**

- Data transformation logic
- Consistent response formats
- Type safety

**Reference:**

- `@src/lib/actions/*.ts` for usage patterns
- `@src/lib/*.ts` for utility functions

**Action:**

- Update cleanup scripts to handle duplicate files
- Run cleanup scripts after refactoring

### 7. Script Optimization

**Task: Optimize all scripts**

Locations:

- `@package.json` scripts
- PowerShell scripts in `@scripts/*.ps1`
- Bash scripts in `@scripts/*.sh`

**Ensure:**

- Follow best practices
- Efficient execution
- Proper error handling
- Clear documentation

### 8. Linting Fixes

**Task: Fix all linting errors manually**

```bash
# Run linting
pnpm run lint:check

# Fix automatically where possible
pnpm run lint:fix

# Manually fix remaining issues
```

**Ensure:**

- Code adheres to defined ESLint rules
- No warnings or errors remain
- Consistent code style

---

## Feature Implementation Tasks

### 1. Advanced Logging System

**Task: Implement robust logging mechanism**

**Options:**

- Winston (recommended for Node.js)
- Pino (faster, lighter)

**Implementation:**

```typescript
// src/lib/logger.ts
import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

// Usage
logger.info("User logged in", { userId: 123 });
logger.error("Database error", { error: err.message });
logger.debug("Processing comic data", { comicId: 456 });
```

**Capture:**

- Important events
- Errors with stack traces
- Debug information
- Performance metrics

### 2. Environment Variable Management

**Task: Integrate environment management**

**Already implemented with T3 Env:**

```typescript
// src/lib/env.ts
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(32),
    REDIS_URL: z.string().url(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    // ...
  },
});
```

**Benefits:**

- Type-safe environment variables
- Runtime validation
- Compile-time checking
- Secure configuration handling

### 3. Project Scaffolding System

**Task: Implement easy project scaffolding**

**Features:**

- Templates for components, pages, API routes
- Automated file generation
- Consistent structure

**Implementation:**

```bash
# Create scaffold script
pnpm cli scaffold component <name>
pnpm cli scaffold page <path>
pnpm cli scaffold api <route>
pnpm cli scaffold crud <resource>
```

### 4. Bulk Image Upload

**Task: Implement multi-provider image upload**

**Already implemented in `@src/services/upload/`**

**Providers:**

- ImageKit
- Cloudinary
- AWS S3
- Local storage

**Usage:**

```bash
# Bulk upload commands
pnpm upload:bulk              # Use configured provider
pnpm upload:bulk:imagekit     # ImageKit
pnpm upload:bulk:cloudinary   # Cloudinary
pnpm upload:bulk:aws          # AWS S3
pnpm upload:bulk:dry-run      # Test mode
```

### 5. System Health Monitoring

**Task: Implement health check system**

**Already implemented:**

```bash
pnpm health:all       # All services
pnpm health:db        # Database
pnpm health:redis     # Redis
pnpm health:check     # App health
```

**Script location:** `@scripts/health-check.ts`

### 6. Cache Management with Redis

**Task: Implement Redis cache commands**

**Already implemented:**

```bash
pnpm cache:clear      # Clear all cache
pnpm cache:stats      # View statistics
pnpm redis:cli        # Open Redis CLI
pnpm redis:flush      # Flush database
```

### 7. Queue Workers for Background Jobs

**Task: Implement queue system**

**Already implemented with QStash and BullMQ:**

```bash
pnpm queue:worker     # Start worker
pnpm queue:stats      # View statistics
pnpm queue:clean      # Clean jobs
pnpm upstash          # QStash dev mode
```

### 8. Shell Aliases & Tab Completion

**Task: Create shell aliases**

**Add to `.bashrc`, `.zshrc`, or PowerShell profile:**

```bash
# Quick aliases
alias cw='pnpm cli'
alias cwd='pnpm dev'
alias cwb='pnpm build'
alias cwt='pnpm test'
alias cwdb='pnpm db:studio'
alias cws='pnpm db:seed'
alias cwl='pnpm lint:fix'
alias cwv='pnpm validate'
```

### 9. CI/CD Integration

**Task: Track CI health with automated workflows**

**Scripts:**

```bash
pnpm ci              # Run CI checks locally
pnpm ci:full         # Complete CI suite
pnpm ci:build        # Build only
pnpm ci:lint         # Lint only
pnpm ci:test         # Test only
```

### 10. Complete Documentation

**Features to implement:**

- ✅ Complete docs for commands (this file)
- Tab completion for scripts
- Workflow chaining examples
- Error troubleshooting guides
- Pro tips and shortcuts
- CI/CD templates
- Complete onboarding guide

---

## Feature-Specific Implementation Tasks

### Authentication Pages Optimization

**Location:** `src/app/(auth)`

**Task: Optimize all auth pages**

**Pages:**

- Sign-in
- Sign-out
- New user registration
- Forgot password
- Verify request

**Implementation checklist:**

- ☐ Implement Zod validation
- ☐ Add email sending functionality
- ☐ Integrate rate limiting
- ☐ Add workflow automation
- ☐ Implement proper error handling

**Reference files:**

- `src/components/emails/*` - Email templates
- `src/lib/validations/*.ts` - Validation schemas
- `src/types/index.ts` - Type definitions
- `src/lib/actions/auth.ts` - Auth actions
- `src/lib/nodemailer.ts` - Email service
- `src/lib/actions/workflow.ts` - Workflow handling
- `src/lib/ratelimit.ts` - Rate limiting
- `src/app/api/workflows/onboarding/route.ts` - Onboarding workflow

**Action:** Update all existing code as needed

### Seed Helpers Optimization

**Location:** `src/lib/seedHelpers.ts` (to be created/optimized)

**Task: Create dynamic data seeding system**

**Data sources:**

- `./users.json`
- `./data.json`
- `./chapters.json`
- `./comics.json`
- `./chaptersdata.json`
- `./comicsdata.json`
- `./chaptersdata*.json`
- `./comicsdata*.json`

**Features:**

- Replace `src/database/data.ts`
- Implement Zod validation for all data
- Dynamic data creation
- Batch processing
- Progress tracking

**Reference:**

- `src/lib/validations/*.ts` - Validation schemas
- `src/types/index.ts` - Type definitions
- `src/database/seed/*.ts` - Existing seed functions

**Action:** Update all existing seed code

### Admin Components Generation

**Location:** `src/components/admin`

**Task: Generate optimized admin components**

**Features:**

- Full CRUD functionality (Create, Read, Update, Delete)
- Integration with all actions from `src/lib/actions`
- Zod validation for all forms
- Type-safe components

**Reference:**

- `src/lib/validations/*.ts` - Validation schemas
- `src/types/index.ts` - Type definitions
- `src/lib/actions/*` - Available actions

**Auto-create:**

- Components as needed
- Admin pages
- Form components
- Table components

**Action:** Update all existing admin code

### Admin Page Container

**Task: Create optimized admin page container**

**Steps:**

1. Read `src/components/__tests__/dashboard/dashCon.tsx`
2. Generate optimized `adminPageContainer` component
3. Use best practices and patterns
4. Implement into `src/app/(admin)/page.tsx`

**Features:**

- Dashboard layout
- Navigation
- Stats display
- Quick actions

### App Navbar Component

**Task: Create optimized App Navbar**

**Read these files for reference:**

- `src/components/layout/LightRays`
- `src/components/ui/shadcn-io/navbar-05`
- `src/components/shadcn-studio/blocks/navbar-component-01/navbar-component-01.tsx`

**Features:**

- NextAuth integration
- User menu
- Mobile responsive
- Theme toggle
- Navigation items

**Action:**

1. Generate optimized `AppNavbar.tsx`
2. Update existing code if exists
3. Implement into `src/app` with required props
4. Update all related files

### Bookmarks & Series Pages

**Location:**

- `src/app/(root)/bookmarks`
- `src/app/(root)/series`

**Task: Optimize pages for full functionality**

**Features:**

- Full CRUD operations
- Add comic to bookmark
- Remove comic from bookmark
- Reading progress tracking
- Zod validation

**Reference:**

- `src/lib/actions/auth.ts` - Auth context
- `src/lib/validations/*.ts` - Validation schemas
- `src/types/index.ts` - Type definitions

**Auto-create:**

- Components
- Pages
- Functions
- Schemas

**Action:** Optimize series pages with same functionality

### Profile Management

**Location:**

- `src/components/profile`
- `src/app/(root)/profile`

**Task: Optimize profile components**

**Features:**

- NextAuth CRUD functionality
- User info editing
- Avatar upload
- Password change
- Account settings

**Reference:**

- `src/lib/auth.ts` - NextAuth config
- `src/lib/authConfig.ts` - Auth configuration
- All `src/lib/auth*.ts` files

**Action:** Update all existing code

### NextAuth User Setup

**Task: Setup NextAuth user schema**

**Action:**

- Configure NextAuth user to reflect `src/database/schema.ts`
- Ensure proper type mapping
- Update adapters if needed
- Test authentication flow

### HTML to React Conversion

**Location:** `./html` folder

**Task: Convert all HTML files to React components**

**Process:**

1. Read all `.html` files in `./html` folder
2. Convert to functional React components using JSX
3. Use HTML title as component name
4. Convert `class` to `className`
5. Format self-closing tags correctly
6. Provide data as props
7. Follow best practices

**After conversion:**

1. Run `pnpm run lint:fix`
2. Fix all warnings and errors
3. Run `pnpm run build`
4. Fix any build errors
5. Auto-import into their respective pages
6. Backup existing files
7. Create new files with generated data

---

## TypeScript & Code Optimization Tasks

### 1. Read All TypeScript Files

**Task: Read and analyze all TS/TSX files**

```bash
# Patterns to read:
"**/**/**/*.ts"
"**/**/**/*.tsx"
"**/*.mts"
"src/**/**/**/*.ts"
"src/**/**/**/*.tsx"
```

### 2. Optimize TypeScript Files

**Task: Generate optimized versions**

- Apply best practices
- Improve type safety
- Enhance performance
- Remove code smells
- Implement design patterns

### 3. Optimize Configuration Files

**Files to optimize:**

#### tsconfig.json

```json
{
  "compilerOptions": {
    // Optimize for best performance and type safety
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
    // ... other optimizations
  }
}
```

#### tailwind.config.ts

- Optimize class scanning
- Configure plugins efficiently
- Set up custom themes

#### postcss.config.js

- Configure plugins in correct order
- Optimize for production

### 4. Optimize Docker Configuration

#### Dockerfile (in compose folder)

- Multi-stage builds
- Layer caching optimization
- Security best practices
- Size optimization

#### docker-compose files

- Service configuration
- Network setup
- Volume management
- Environment variables

### 5. Optimize Build Scripts

#### Makefile

- Efficient targets
- Proper dependencies
- Error handling

#### test-docker.sh

- Comprehensive testing
- Health checks
- Cleanup procedures

---

## Final Cleanup & Validation Tasks

### 1. Type Checking

```bash
# Run type checking
pnpm run typecheck

# Fix all errors
# Pay special attention to *Columns.tsx files
```

### 2. Build & Lint Validation

```bash
# Run lint check and build
pnpm run lint:check && pnpm run build

# Fix all warnings and errors
# Then run lint fix
pnpm run lint:fix

# Final build
pnpm run build
```

### 3. Documentation Generation

**Task: Generate optimized README.md**

**Steps:**

1. Read all `*.md` files in the project
2. Generate comprehensive `README.md`
3. Include:
   - Project overview
   - Setup instructions
   - Architecture documentation
   - API documentation
   - Deployment guide
4. Delete redundant `*.md` files
5. Keep only essential documentation

### 4. Project Cleanup

**Task: Cleanup unused files**

**Actions:**

1. Delete unused files in `@src`
2. Delete unused components not referenced by:
   - `src/app/**/*`
   - `src/components/layout/**/*`
3. Uninstall unused dependencies
4. Optimize folder structure
5. Remove duplicate code

**Verify before deleting:**

```bash
# Check for file usage
grep -r "ComponentName" src/

# Check imports
grep -r "from.*ComponentName" src/
```

### 5. Final Validation

**Run complete validation suite:**

```bash
# Type check
pnpm run typecheck

# Lint
pnpm run lint:strict

# Format check
pnpm run format:check

# Build
pnpm run build

# Tests
pnpm run test:all

# Health checks
pnpm health:all
```

---

## Development Workflow

### Setup

1. **Clone & Install:**

```bash
git clone <repository-url>
cd comicwise
pnpm install
```

2. **Configure Environment:**

```bash
cp .envs/.env.development .env.local
# Edit .env.local with your configuration
```

3. **Setup Database:**

```bash
pnpm db:push    # Push schema
pnpm db:seed    # Seed data
```

4. **Start Development:**

```bash
pnpm dev        # Opens http://localhost:3000
```

### Development Scripts

```bash
# Development Servers
pnpm dev              # Turbopack dev server (recommended)
pnpm dev:debug        # With Node.js debugger
pnpm dev:https        # HTTPS mode for testing OAuth, etc.

# Building
pnpm build            # Production build
pnpm build:analyze    # Analyze bundle size
pnpm build:debug      # Build with debug info
pnpm start            # Start production server

# Code Quality
pnpm validate         # Complete check (type + lint + format)
pnpm validate:quick   # Quick check (type + lint only)
pnpm type-check       # TypeScript validation
pnpm type-check:watch # Watch mode
pnpm lint             # Run ESLint
pnpm lint:strict      # ESLint with zero warnings
pnpm lint:fix         # Auto-fix issues
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting only

# Cleanup
pnpm clean            # Clean build artifacts
pnpm clean:cache      # Clear Next.js cache
pnpm clean:all        # Nuclear option (removes node_modules)
```

---

## Code Quality Standards

### Type Safety

**DO:**

- Use proper TypeScript types from `#types/*`
- Leverage Drizzle's generated types
- Use Zod for runtime validation
- Infer types whenever possible: `type X = z.infer<typeof schema>`
- Use `unknown` instead of `any` when type is truly unknown

**DON'T:**

- Use `any` type
- Use `@ts-ignore` or `@ts-expect-error` (fix the issue instead)
- Skip validation on user input
- Define duplicate types (check `#types/*` first)

**Example:**

```typescript
// ✅ Good
import { createInsertSchema } from "drizzle-zod";
import { comics } from "schema";
import { z } from "zod";

const insertComicSchema = createInsertSchema(comics);
type InsertComic = z.infer<typeof insertComicSchema>;

export async function createComic(data: unknown) {
  const validated = insertComicSchema.parse(data);
  return await db.insert(comics).values(validated);
}

// ❌ Bad
export async function createComic(data: any) {
  return await db.insert(comics).values(data); // No validation!
}
```

### Validation Schemas

**Location:** `src/lib/validations/`

**Pattern:**

```typescript
// src/lib/validations/auth.ts
import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signUpSchema = signInSchema
  .extend({
    username: z.string().min(3).max(20),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
```

### ESLint & Prettier

**Pre-commit checks:**

```bash
pnpm validate  # Always run before committing
```

**Key ESLint Rules:**

- `drizzle/enforce-delete-with-where` - Prevent accidental mass deletes
- `@next/next/no-html-link-for-pages` - Use Next.js `<Link>`
- `react-hooks/exhaustive-deps` - Hook dependency checking
- `simple-import-sort` - Organize imports
- `prettier/prettier` - Enforce Prettier formatting

**Prettier Configuration:**

- Tab width: 2
- Semicolons: always
- Single quotes: false (use double quotes)
- Trailing commas: all
- Print width: 80
- Plugins: organize-imports → tailwindcss

---

## Database Operations

### Schema Management

**Location:** `src/database/schema.ts`

**Commands:**

```bash
pnpm db:generate      # Generate migrations
pnpm db:push          # Push schema to database (dev)
pnpm db:migrate       # Run migrations (production)
pnpm db:studio        # Open Drizzle Studio GUI
pnpm db:check         # Validate schema
pnpm db:drop          # Drop all tables (⚠️ dangerous)
```

### DAL Pattern (Recommended)

The Data Access Layer pattern separates database logic from business logic.

**Structure:**

```
src/
├── dal/              # Data Access Layer (database operations)
├── dto/              # Data Transfer Objects (data transformation)
└── lib/actions/      # Server Actions (business logic + API)
```

**DAL Example:**

```typescript
// src/dal/comicDal.ts
import { db } from "db";
import { comics } from "schema";
import { eq, desc, and } from "drizzle-orm";

export async function getComicById(id: number) {
  return await db.query.comics.findFirst({
    where: eq(comics.id, id),
    with: {
      genres: true,
      chapters: { orderBy: desc(chapters.chapterNumber) },
      authors: true,
    },
  });
}

export async function getPublishedComics(limit = 20) {
  return await db.query.comics.findMany({
    where: eq(comics.status, "published"),
    limit,
    orderBy: desc(comics.createdAt),
  });
}
```

**DTO Example:**

```typescript
// src/dto/comicsDto.ts
import type { Comic, Genre } from "#types/database";

export function toComicResponse(comic: Comic & { genres?: Genre[] }) {
  return {
    id: comic.id,
    title: comic.title,
    slug: comic.slug,
    description: comic.description,
    coverUrl: comic.coverImage,
    status: comic.status,
    genres: comic.genres?.map((g) => g.name) ?? [],
    // Only expose needed fields
  };
}

export function toComicListItem(comic: Comic) {
  return {
    id: comic.id,
    title: comic.title,
    slug: comic.slug,
    coverUrl: comic.coverImage,
    // Minimal data for list views
  };
}
```

**Server Action Example:**

```typescript
// src/lib/actions/comics.ts
"use server";

import { comicDal } from "#dal/comicDal";
import { toComicResponse } from "#dto/comicsDto";

export async function getComic(id: number) {
  const comic = await comicDal.getComicById(id);
  if (!comic) return null;
  return toComicResponse(comic);
}
```

### Query vs Mutation Pattern

**Queries** (`src/database/queries/`) - **READ** operations (SELECT)
**Mutations** (`src/database/mutations/`) - **WRITE** operations
(INSERT/UPDATE/DELETE)

```typescript
// queries/comics.ts
export const getComics = async (limit = 20) => {
  return await db.query.comics.findMany({ limit });
};

// mutations/comics.ts
export const createComic = async (data: NewComic) => {
  return await db.insert(comics).values(data).returning();
};

export const updateComic = async (id: number, data: Partial<NewComic>) => {
  return await db.update(comics).set(data).where(eq(comics.id, id)).returning();
};

export const deleteComic = async (id: number) => {
  return await db.delete(comics).where(eq(comics.id, id));
};
```

### Database Seeding

```bash
pnpm db:seed              # Seed all data
pnpm db:seed:users        # Seed users only
pnpm db:seed:comics       # Seed comics only
pnpm db:seed:chapters     # Seed chapters only
pnpm db:seed:verbose      # Detailed logging
pnpm db:seed:dry-run      # Preview without writing
pnpm db:reset             # Drop → recreate → seed
pnpm db:reset:hard        # Drop → generate → push → seed
```

**Configuration:** `src/database/seed/config.ts`

**Data Sources:** JSON files in project root:

- `users.json`
- `comics.json`, `comicsdata1.json`, `comicsdata2.json`
- `chapters.json`, `chaptersdata1.json`, `chaptersdata2.json`

---

## Common Tasks

### Adding a New Feature

**1. Create Database Schema** (if needed):

```typescript
// src/database/schema.ts
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  comicId: integer("comic_id")
    .references(() => comics.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

**2. Generate & Push:**

```bash
pnpm db:generate  # Create migration
pnpm db:push      # Apply to database
```

**3. Create DAL:**

```typescript
// src/dal/reviewDal.ts
import { db } from "db";
import { reviews } from "schema";
import { eq } from "drizzle-orm";

export async function getReviewsByComicId(comicId: number) {
  return await db.query.reviews.findMany({
    where: eq(reviews.comicId, comicId),
    with: { user: true },
  });
}

export async function createReview(data: NewReview) {
  return await db.insert(reviews).values(data).returning();
}
```

**4. Create DTO:**

```typescript
// src/dto/reviewDto.ts
export function toReviewResponse(review: Review & { user?: User }) {
  return {
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    author: review.user
      ? {
          id: review.user.id,
          username: review.user.username,
        }
      : null,
  };
}
```

**5. Create Server Action:**

```typescript
// src/lib/actions/reviews.ts
"use server";

import { reviewDal } from "#dal/reviewDal";
import { toReviewResponse } from "#dto/reviewDto";

export async function getComicReviews(comicId: number) {
  const reviews = await reviewDal.getReviewsByComicId(comicId);
  return reviews.map(toReviewResponse);
}
```

**6. Create API Route** (optional):

```typescript
// src/app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { getComicReviews } from "#actions/reviews";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const comicId = searchParams.get("comicId");

  if (!comicId) {
    return NextResponse.json({ error: "comicId required" }, { status: 400 });
  }

  const reviews = await getComicReviews(parseInt(comicId));
  return NextResponse.json(reviews);
}
```

### Adding UI Components

**shadcn/ui component:**

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add form
pnpm dlx shadcn@latest add input
```

**Custom component:**

```typescript
// src/components/ReviewCard.tsx
import { Button } from "#ui/button";
import { Card } from "#ui/card";
import type { ReviewResponse } from "#types/review";

interface ReviewCardProps {
  review: ReviewResponse;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-2">
        <span className="font-semibold">{review.author?.username}</span>
        <span className="text-sm text-muted-foreground">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="mt-2">{review.comment}</div>
      <div className="mt-2">Rating: {review.rating}/5</div>
    </Card>
  );
}
```

### Image Upload

**Configuration (.env.local):**

```env
UPLOAD_PROVIDER=imagekit  # or: cloudinary, local, s3

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Usage:**

```typescript
import { uploadImage, deleteImage, getImageUrl } from "#services/upload";

// Upload
const result = await uploadImage(fileBuffer, {
  folder: "comic-covers",
  filename: "one-piece-cover",
  transformation: { width: 800, height: 1200, quality: 85 },
});

if (result.success) {
  console.log("URL:", result.url);
  console.log("Public ID:", result.publicId);
}

// Get optimized URL
const optimizedUrl = await getImageUrl(result.publicId, {
  width: 400,
  quality: 80,
});

// Delete
await deleteImage(result.publicId);
```

**Bulk upload:**

```bash
pnpm upload:bulk              # Upload to configured provider
pnpm upload:bulk:imagekit     # Force ImageKit
pnpm upload:bulk:cloudinary   # Force Cloudinary
pnpm upload:bulk:aws          # Force AWS S3
pnpm upload:bulk:dry-run      # Test without uploading
```

### Email Templates

**Location:** `src/components/emails/`

**Development:**

```bash
cd src/components/emails
pnpm dev  # Preview server at http://localhost:3000
```

**Usage:**

```typescript
import { sendEmail } from "#lib/email";
import VerificationEmail from "#emails/VerificationEmail";

await sendEmail({
  to: user.email,
  subject: "Verify your email",
  react: VerificationEmail({
    username: user.username,
    token: verificationToken,
  }),
});
```

**Create new template:**

```tsx
// src/components/emails/WelcomeEmail.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  username: string;
}

export default function WelcomeEmail({ username }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to ComicWise!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome, {username}!</Heading>
          <Text style={text}>
            Thanks for joining ComicWise. Start exploring comics now!
          </Text>
          <Link href="https://comicwise.app">Browse Comics</Link>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#ffffff", fontFamily: "sans-serif" };
const container = { margin: "0 auto", padding: "20px" };
const h1 = { fontSize: "24px", fontWeight: "bold" };
const text = { fontSize: "16px", lineHeight: "24px" };
```

### Rate Limiting

**Configuration:** `app-config.ts`

```typescript
export const appConfig = {
  rateLimit: {
    auth: { requests: 5, window: 900 }, // 5 req per 15 min
    email: { requests: 3, window: 3600 }, // 3 req per hour
    api: { requests: 100, window: 60 }, // 100 req per minute
    default: { requests: 10, window: 10 }, // 10 req per 10 sec
  },
};
```

**Usage:**

```typescript
import { rateLimit } from "#lib/ratelimit";

export async function sendVerificationEmail(userId: string) {
  // Check rate limit
  const { success } = await rateLimit.email.limit(userId);
  if (!success) {
    throw new Error("Too many requests. Please try again later.");
  }

  // Proceed with email sending
  await sendEmail(/* ... */);
}
```

### Caching with Redis

**Basic usage:**

```typescript
import { cache } from "#lib/cache";

// Set cache (expires in 1 hour)
await cache.set("comic:123", comicData, { ex: 3600 });

// Get cache
const data = await cache.get("comic:123");

// Delete cache
await cache.del("comic:123");

// Delete pattern
await cache.del("comic:*"); // Delete all comic cache
```

**Cache wrapper:**

```typescript
import { withCache } from "#lib/cacheMiddleware";

export const getComic = withCache(
  async (id: number) => {
    return await db.query.comics.findFirst({ where: eq(comics.id, id) });
  },
  {
    key: (id) => `comic:${id}`,
    ttl: 3600, // 1 hour
  }
);
```

**Redis scripts:**

```bash
pnpm cache:clear      # Clear all cache
pnpm cache:stats      # View statistics
pnpm redis:cli        # Open Redis CLI
pnpm redis:flush      # Flush entire database (⚠️ dangerous)
```

---

## Scripts Reference

### Database Scripts

```bash
pnpm db:push          # Push schema (dev)
pnpm db:migrate       # Run migrations (prod)
pnpm db:generate      # Generate migrations
pnpm db:studio        # Drizzle Studio GUI
pnpm db:seed          # Seed data
pnpm db:reset         # Complete reset
pnpm db:check         # Validate schema
pnpm db:pull          # Pull from database
pnpm db:drop          # Drop all tables
```

### Image Upload Scripts

```bash
pnpm upload:bulk              # Bulk upload
pnpm upload:bulk:cloudinary   # Cloudinary
pnpm upload:bulk:imagekit     # ImageKit
pnpm upload:bulk:aws          # AWS S3
pnpm upload:bulk:dry-run      # Test mode
pnpm upload:test              # Test upload
```

### Cache Scripts

```bash
pnpm cache:clear      # Clear cache
pnpm cache:stats      # Statistics
pnpm redis:cli        # Redis CLI
pnpm redis:flush      # Flush database
```

### Queue Scripts

```bash
pnpm queue:worker     # Start worker
pnpm queue:stats      # Statistics
pnpm queue:clean      # Clean jobs
pnpm upstash          # QStash dev mode
```

### Health Checks

```bash
pnpm health:all       # All services
pnpm health:check     # App health
pnpm health:db        # Database
pnpm health:redis     # Redis
```

### Testing Scripts

```bash
pnpm test             # E2E (Playwright)
pnpm test:unit        # Unit (Vitest)
pnpm test:all         # All tests
pnpm test:ui          # Playwright UI
pnpm test:unit:ui     # Vitest UI
pnpm test:debug       # Debug mode
pnpm test:headed      # Headed browser
pnpm test:report      # View report
pnpm test:codegen     # Generate tests
```

### Docker Scripts

```bash
pnpm docker:up        # Start containers
pnpm docker:down      # Stop containers
pnpm docker:build     # Build images
pnpm docker:clean     # Remove all
pnpm docker:logs      # View logs
```

### Utility Scripts

```bash
pnpm setup            # Initial setup
pnpm setup:docker     # Docker setup
pnpm clean            # Clean build
pnpm clean:all        # Clean everything
pnpm check-updates    # Check for updates
pnpm imports:optimize # Optimize imports
pnpm imports:check    # Check imports
```

---

## Best Practices

### Server Components vs Client Components

**Default to Server Components:**

```tsx
// app/comics/[id]/page.tsx
import { getComic } from "#actions/comics";

export default async function ComicPage({
  params,
}: {
  params: { id: string };
}) {
  const comic = await getComic(parseInt(params.id));

  return (
    <div>
      <h1>{comic.title}</h1>
      {/* ... */}
    </div>
  );
}
```

**Use Client Components when needed:**

```tsx
"use client"; // Only when you need interactivity

import { useState } from "react";
import { Button } from "#ui/button";

export function BookmarkButton({ comicId }: { comicId: number }) {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <Button onClick={() => setBookmarked(!bookmarked)}>
      {bookmarked ? "Remove Bookmark" : "Add Bookmark"}
    </Button>
  );
}
```

### Server Actions

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { comicDal } from "#dal/comicDal";

export async function addBookmark(comicId: number, userId: number) {
  await comicDal.createBookmark({ comicId, userId });
  revalidatePath("/bookmarks");
  return { success: true };
}
```

### Error Handling

```typescript
import { z } from "zod";

export async function createComic(data: unknown) {
  try {
    // Validate input
    const validated = insertComicSchema.parse(data);

    // Perform operation
    const comic = await db.insert(comics).values(validated).returning();

    return { success: true, data: comic[0] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid input", details: error.errors };
    }

    console.error("Failed to create comic:", error);
    return { success: false, error: "Failed to create comic" };
  }
}
```

### Environment Variables

**Use T3 Env for validation:**

```typescript
// src/lib/env.ts
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(32),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
```

---

## Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
pnpm clean:cache
pnpm db:push      # Ensure DB schema is synced
pnpm build
```

### Type Errors

```bash
# Regenerate Drizzle types
pnpm db:generate

# Check TypeScript
pnpm type-check

# Restart TypeScript server in your editor
# VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### Import Errors

```bash
# Verify tsconfig.json path aliases
# Restart TypeScript server
# Check that files exist at the import path
```

### Database Connection Issues

```bash
# Test connection
pnpm health:db

# Check .env.local
echo $DATABASE_URL  # (or: $env:DATABASE_URL in PowerShell)

# Open Drizzle Studio to verify
pnpm db:studio
```

### Redis Connection Issues

```bash
# Test connection
pnpm health:redis

# Start Redis container
pnpm docker:up

# Check Redis CLI
pnpm redis:cli
# Then run: PING (should return PONG)
```

### Docker Issues

```bash
# Clean restart
pnpm docker:clean
pnpm docker:build
pnpm docker:up

# View logs
pnpm docker:logs

# Check container status
docker ps -a
docker stats
```

### Performance Issues

```bash
# Analyze bundle
pnpm build:analyze

# Check build stats
pnpm build --debug

# Profile in dev mode
pnpm dev:debug
# Then open chrome://inspect in Chrome
```

### Common Error Messages

**"Module not found"**

- Check path aliases in `tsconfig.json`
- Restart TypeScript server
- Verify file exists

**"Cannot find module 'db'"**

- Regenerate types: `pnpm db:generate`
- Restart dev server

**"Rate limit exceeded"**

- Check Redis connection: `pnpm health:redis`
- Review rate limit config in `app-config.ts`

**"Email failed to send"**

- Verify SMTP settings in `.env.local`
- Check email service status
- Review logs for specific error

---

**Last Updated:** 2025-12-23

**ComicWise Development Team** | Built with Next.js 16 | Powered by PostgreSQL &
Redis
