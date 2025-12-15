# ComicWise Scripts Guide

Complete guide to all available scripts for project development, building, and
deployment.

## Table of Contents

- [Quick Start](#quick-start)
- [Development Scripts](#development-scripts)
- [Build Scripts](#build-scripts)
- [Code Quality Scripts](#code-quality-scripts)
- [Database Scripts](#database-scripts)
- [Testing Scripts](#testing-scripts)
- [Utility Scripts](#utility-scripts)
- [Advanced Usage](#advanced-usage)

## Quick Start

```bash
# PowerShell (Windows)
.\scripts\setup.ps1
.\scripts\dev.ps1

# Bash (macOS/Linux)
bash scripts/setup.sh
bash scripts/dev.sh
```

## Development Scripts

### dev.ps1 / dev.sh

Start the development server with Turbopack.

```bash
# Basic usage
pnpm dev
.\scripts\dev.ps1          # PowerShell
bash scripts/dev.sh        # Bash

# With debugging (Node.js Inspector)
.\scripts\dev.ps1 -Debug
bash scripts/dev.sh --debug
# Connect debugger to localhost:9229

# With custom port
.\scripts\dev.ps1 -Port 4000
bash scripts/dev.sh --port 4000

# With experimental HTTPS
.\scripts\dev.ps1 -Https
bash scripts/dev.sh --https
```

### setup.ps1 / setup.sh

Complete project setup including dependencies, environment, and database.

```bash
# Basic setup
.\scripts\setup.ps1
bash scripts/setup.sh

# Clean install (removes build artifacts first)
.\scripts\setup.ps1 -Clean
bash scripts/setup.sh --clean

# Setup with Docker database
.\scripts\setup.ps1 -DockerDB
bash scripts/setup.sh --docker-db

# Setup and start dev server immediately
.\scripts\setup.ps1 -Dev
bash scripts/setup.sh --dev

# Skip validation checks
.\scripts\setup.ps1 -SkipValidation
bash scripts/setup.sh --skip-validation
```

## Build Scripts

### build.ps1 / build.sh

Build the application for production.

```bash
# Standard build
pnpm build
.\scripts\build.ps1
bash scripts/build.sh

# Debug build
.\scripts\build.ps1 -Debug
bash scripts/build.sh --debug

# Build with bundle analysis
.\scripts\build.ps1 -Analyze
bash scripts/build.sh --analyze
```

### run.ps1 / run.sh

Run the production server (requires prior build).

```bash
# Production server
pnpm start:prod
.\scripts\run.ps1
bash scripts/run.sh

# Preview mode
.\scripts\run.ps1 -Preview
bash scripts/run.sh --preview

# Custom port
.\scripts\run.ps1 -Port 4000
bash scripts/run.sh --port 4000
```

## Code Quality Scripts

### lint.ps1 / lint.sh

Run ESLint to check and fix code quality.

```bash
# Check only
pnpm lint
.\scripts\lint.ps1
bash scripts/lint.sh

# Auto-fix issues
pnpm lint:fix
.\scripts\lint.ps1 -Fix
bash scripts/lint.sh --fix

# Fix specific types
pnpm lint:fixtype
.\scripts\lint.ps1 -FixType
bash scripts/lint.sh --fix-type

# Strict mode (fail on warnings)
pnpm lint:strict
.\scripts\lint.ps1 -Strict
bash scripts/lint.sh --strict
```

### format.ps1 / format.sh

Format code with Prettier.

```bash
# Format all files
pnpm format
.\scripts\format.ps1
bash scripts/format.sh

# Check formatting without changes
pnpm format:check
.\scripts\format.ps1 -Check
bash scripts/format.sh --check
```

### type-check.ps1 / type-check.sh

Run TypeScript type checking.

```bash
# Check once
pnpm type-check
.\scripts\type-check.ps1
bash scripts/type-check.sh

# Watch mode
pnpm type-check:watch
.\scripts\type-check.ps1 -Watch
bash scripts/type-check.sh --watch
```

## Testing Scripts

### test.ps1 / test.sh

Run the test suite (Playwright E2E + Vitest unit tests).

```bash
# Unit tests (default)
pnpm test:unit:run
.\scripts\test.ps1 --Unit
bash scripts/test.sh --unit

# E2E tests
pnpm test
.\scripts\test.ps1 --E2E
bash scripts/test.sh --e2e

# Unit tests with UI
pnpm test:unit:ui
.\scripts\test.ps1 --Unit --UI
bash scripts/test.sh --unit --ui

# Unit tests with coverage
pnpm test:unit:coverage
.\scripts\test.ps1 --Unit --Coverage
bash scripts/test.sh --unit --coverage

# Watch mode
pnpm test:unit:watch
.\scripts\test.ps1 --Unit --Watch
bash scripts/test.sh --unit --watch
```

## Database Scripts

All database scripts use pnpm directly:

```bash
# Generate migrations
pnpm db:generate

# Push schema changes
pnpm db:push

# Run migrations
pnpm db:migrate

# Seed database
pnpm db:seed

# Seed specific entities
pnpm db:seed:users
pnpm db:seed:comics
pnpm db:seed:chapters

# Dry run (without actual seeding)
pnpm db:seed:dry-run

# Open Drizzle Studio
pnpm db:studio

# Reset database
pnpm db:reset
```

## Utility Scripts

### cleanup.ps1 / cleanup.sh

Remove build artifacts and optionally dependencies.

```bash
# Clean build artifacts only
pnpm clean
.\scripts\cleanup.ps1
bash scripts/cleanup.sh

# Full cleanup (includes node_modules and lock files)
.\scripts\cleanup.ps1 -Full
bash scripts/cleanup.sh --full
```

### install-deps.ps1 / install-deps.sh

Install/reinstall dependencies.

```bash
pnpm install
```

### Additional Utility Commands

```bash
# Type generation
pnpm types:generate

# Bundle analysis
pnpm analyze-bundle

# Spell checking
pnpm cspell
pnpm cspell:fix

# Dependency updates
pnpm check-updates
pnpm update-deps
pnpm audit
pnpm audit:fix

# Project info
pnpm info

# Email template development
pnpm email:dev
pnpm email:export
```

## Docker Scripts

```bash
# Development containers (DB + Redis only)
pnpm docker:dev
pnpm docker:dev:build
pnpm docker:dev-down

# Production containers
pnpm docker:up
pnpm docker:down
pnpm docker:restart
pnpm docker:logs

# Management
pnpm docker:clean
pnpm docker:prune
pnpm docker:build
```

## Advanced Usage

### Combined Workflows

```bash
# Full development setup with validation
.\setup-dev-environment.ps1 -Dev -DockerMode

# Production build and deployment
pnpm build
pnpm validate  # Run lint, format check, type check
pnpm docker:prod

# CI/CD pipeline
pnpm validate
pnpm test:unit:run
pnpm build

# Pre-commit checks
pnpm format
pnpm lint:fix
pnpm type-check
```

### Environment Variables

Set these in `.env` file (copy from `.env.example`):

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/comicwise"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# API Keys
OPENAI_API_KEY="..."
CLOUDINARY_URL="..."
```

### Port Configuration

```bash
# Set custom port
export PORT=4000
pnpm dev

# Or inline
PORT=4000 pnpm dev

# Windows PowerShell
$env:PORT = 4000
pnpm dev
```

### Performance Tips

1. **Use pnpm** instead of npm for faster installs
2. **Enable Turbopack** for faster dev builds (enabled by default)
3. **Run Playwright tests only when needed**: `pnpm test:unit:run` for quick
   feedback
4. **Use watch mode for development**: `tsc --noEmit --watch`
5. **Check dependencies**: `pnpm check-updates` regularly

### Troubleshooting

| Issue                     | Solution                                                            |
| ------------------------- | ------------------------------------------------------------------- |
| Port already in use       | Use `--port` flag or kill process: `lsof -ti:3000 \| xargs kill -9` |
| Database connection error | Check `DATABASE_URL` in `.env`                                      |
| Module not found          | Run `pnpm install`                                                  |
| Type errors after update  | Run `pnpm clean && pnpm install`                                    |
| Playwright tests fail     | Run `npx playwright install`                                        |

### Package Manager Detection

All scripts automatically detect and use pnpm if available, otherwise fall back
to npm. To force npm:

```bash
npm install  # Instead of pnpm install
npm run dev  # Instead of pnpm dev
```

## Script Reference Table

| Script     | Purpose               | Options                                  |
| ---------- | --------------------- | ---------------------------------------- |
| setup      | Full project setup    | -Clean, -DockerDB, -Dev, -SkipValidation |
| dev        | Start dev server      | -Debug, -Port, -Https                    |
| build      | Build for production  | -Debug, -Analyze                         |
| run        | Run production server | -Preview, -Port                          |
| lint       | Run ESLint            | -Fix, -Strict, -FixType                  |
| format     | Format with Prettier  | -Check                                   |
| type-check | TypeScript checking   | -Watch                                   |
| test       | Run test suite        | --Unit, --E2E, --Watch, --UI, --Coverage |
| cleanup    | Remove artifacts      | -Full                                    |

---

**Last Updated**: 2025-12-14  
**Version**: 2.0.0
