# 🔧 ComicWise - Master Commands Reference

Quick reference for all important commands organized by use case.

## 🚀 Development

```bash
# Start development server
pnpm dev

# Start with debugging
pnpm dev:debug

# Start with HTTPS
pnpm dev:https

# Type checking in watch mode
pnpm type-check:watch

# Run formatter in watch mode (via linter)
pnpm lint --fix --watch
```

## 🏗️ Building

```bash
# Standard build
pnpm build

# Build with analysis
pnpm build:analyze

# Debug build
pnpm build:debug

# Standalone build
pnpm build:standalone

# Check before building
pnpm validate
```

## 🗄️ Database

```bash
# Push schema to database
pnpm db:push

# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Check schema
pnpm db:check

# Pull current schema
pnpm db:pull

# Drop database (dev only!)
pnpm db:drop

# Full reset (dev only!)
pnpm db:reset
pnpm db:reset:hard

# Open Drizzle Studio
pnpm db:studio
```

## 🌱 Database Seeding

```bash
# Seed all data
pnpm db:seed

# Seed specific entities
pnpm db:seed:users
pnpm db:seed:comics
pnpm db:seed:chapters

# Dry run (validate without inserting)
pnpm db:seed:dry-run

# Verbose output
pnpm db:seed:verbose

# Clear all data
pnpm seed:clear

# Validate seeding
pnpm seed:validate
```

## ✅ Quality Assurance

```bash
# Type checking
pnpm type-check
pnpm type-check:watch

# Linting
pnpm lint
pnpm lint:fix
pnpm lint:strict

# Code formatting
pnpm format
pnpm format:check

# Full validation
pnpm validate
pnpm validate:quick

# Import checking
pnpm imports:check
pnpm imports:optimize
```

## 🧪 Testing

### Unit Tests
```bash
# Run all unit tests
pnpm test:unit:run

# Watch mode
pnpm test:unit:watch

# UI mode
pnpm test:unit

# Coverage report
pnpm test:unit:coverage
```

### E2E Tests
```bash
# Run all tests
pnpm test

# Headed mode (see browser)
pnpm test:headed

# Debug mode
pnpm test:debug

# UI mode
pnpm test:ui

# Generate test code
pnpm test:codegen

# View report
pnpm test:report
```

### CI Pipeline
```bash
# Full CI
pnpm ci
pnpm ci:full

# Just type check
pnpm ci:lint

# Just build
pnpm ci:build

# Run all tests
pnpm ci:test
```

## 📦 Dependency Management

```bash
# Install dependencies
pnpm install

# Add dependency
pnpm add <package>

# Add dev dependency
pnpm add -D <package>

# Update all dependencies
pnpm update

# Check for updates
pnpm check-updates

# Update browserslist
pnpm check-updates && pnpm update
```

## 🔍 Analysis & Optimization

### Project Analysis
```bash
# Full analysis with export
pnpm tsx scripts/analyzeProject.ts --export

# Quick analysis
pnpm tsx scripts/analyzeProject.ts
```

### Environment Validation
```bash
# Validate environment
pnpm tsx scripts/envValidator.ts

# With detailed report
pnpm tsx scripts/envValidator.ts --report
```

### Package Analysis
```bash
# Analyze packages
pnpm tsx scripts/analyzePackages.ts

# With report
pnpm tsx scripts/analyzePackages.ts --report
```

### Cleanup
```bash
# Dry run cleanup
pnpm tsx scripts/advancedCleanup.ts --dry-run

# Actually clean
pnpm tsx scripts/advancedCleanup.ts

# With report
pnpm tsx scripts/advancedCleanup.ts --report
```

### Generate Documentation
```bash
pnpm tsx scripts/generateDocs.ts
```

### Completion Report
```bash
pnpm tsx scripts/completionReport.ts
```

## 🏥 Health Checks

```bash
# Check all services
pnpm health:all

# Database connection
pnpm health:db

# Redis connection
pnpm health:redis

# General health
pnpm health:check
```

## 🔐 Security & Optimization

```bash
# Clear cache
pnpm cache:clear

# Cache statistics
pnpm cache:stats

# Full cache management
pnpm cache:clear && pnpm cache:stats

# Clean project
pnpm clean

# Deep clean
pnpm clean:all

# Advanced cleanup
pnpm cleanup
pnpm cleanup:dry-run

# Comprehensive optimization
pnpm optimize:all

# Type optimization
pnpm optimize:types

# CamelCase optimization
pnpm optimize:camelcase
```

## 🔄 Queue & Background Jobs

```bash
# Queue worker
pnpm queue:worker

# Queue statistics
pnpm queue:stats

# Clean queue
pnpm queue:clean
```

## 📤 Upload Operations

```bash
# Bulk upload
pnpm upload:bulk

# Provider specific
pnpm upload:bulk:aws
pnpm upload:bulk:cloudinary
pnpm upload:bulk:imagekit

# Dry run
pnpm upload:bulk:dry-run

# Test
pnpm upload:test
```

## 🐳 Docker

```bash
# Build image
pnpm docker:build

# Start services
pnpm docker:up

# Stop services
pnpm docker:down

# View logs
pnpm docker:logs

# Clean services
pnpm docker:clean

# Redis CLI
pnpm redis:cli

# Flush Redis
pnpm redis:flush
```

## 🚀 Deployment

```bash
# Validate before deployment
pnpm validate

# Preview deploy
pnpm deploy:preview

# Production deploy
pnpm deploy:vercel

# Production start
pnpm start:prod

# Production with env
NODE_ENV=production pnpm start
```

## 🎨 Code Generation & Scaffolding

```bash
# Scaffold new component/hook/action
pnpm scaffold

# Scaffold component
pnpm scaffold:component

# Scaffold hook
pnpm scaffold:hook

# Scaffold action
pnpm scaffold:action

# Generate types
pnpm typegen

# Generate/Check types
pnpm db:generate
```

## 💾 Git Operations

```bash
# Commit with conventional format
git commit -m "feat: add new feature"
git commit -m "fix: bug fix"
git commit -m "docs: update documentation"
git commit -m "refactor: restructure code"
git commit -m "test: add tests"

# Pre-commit hook (auto-formats)
# (runs before commit via husky)
```

---

## 🔗 Quick Workflows

### Start Fresh
```bash
pnpm clean:all
pnpm install
pnpm db:reset
pnpm db:seed
pnpm dev
```

### Full Validation Before Commit
```bash
pnpm type-check
pnpm lint:fix
pnpm format
pnpm test:unit:run
```

### Full Pre-Deploy Check
```bash
pnpm validate
pnpm test:unit:run
pnpm test
pnpm build
```

### Database Maintenance
```bash
pnpm health:db
pnpm db:check
pnpm db:pull
pnpm db:push
pnpm db:seed:dry-run
```

### Performance Review
```bash
pnpm tsx scripts/analyzeProject.ts --export
pnpm build:analyze
pnpm health:all
```

### Security Audit
```bash
pnpm lint:strict
pnpm tsx scripts/analyzeProject.ts --export
pnpm check-updates
```

---

## 📋 Script Locations

All custom scripts are in `/scripts`:

```
scripts/
├── masterOptimization.ts        # 5-phase orchestrator
├── envValidator.ts              # Environment validator
├── advancedCleanup.ts           # Cleanup tool
├── analyzeProject.ts            # Analysis tool
├── analyzePackages.ts           # Package analyzer
├── generateDocs.ts              # Doc generator
├── completionReport.ts          # Summary report
├── scaffold.ts                  # Code generation
├── projectCleanup2025.ts        # Project cleanup
└── ... (40+ other utilities)
```

---

## 🆘 Troubleshooting Commands

```bash
# Fix all import errors
pnpm imports:optimize

# Fix type errors
pnpm optimize:types

# Rebuild everything
pnpm clean && pnpm install && pnpm build

# Full reset
pnpm setup:clean

# Emergency reset
pnpm setup:full
```

---

## 📊 Monitoring & Reporting

```bash
# Generate all analysis reports
pnpm tsx scripts/analyzeProject.ts --export
pnpm tsx scripts/envValidator.ts --report
pnpm tsx scripts/analyzePackages.ts --report

# View reports
open reports/
```

---

## 💡 Pro Tips

1. **Use validate before commit**: `pnpm validate`
2. **Watch mode development**: `pnpm type-check:watch` in parallel terminal
3. **Quick build check**: `pnpm build` before deployment
4. **Database recovery**: `pnpm db:reset:hard` for complete reset
5. **Performance testing**: `pnpm build:analyze` after major changes
6. **Dependency updates**: `pnpm check-updates` monthly

---

**Last Updated**: 2025-12-29  
**Version**: 2.0.0
