# Quick Command Reference

**For quick lookup of all available commands**

## 🚀 Most Common Commands

```bash
# Development
pnpm dev              # Start dev server (port 3000)
pnpm dev:debug        # With Node.js debugger
pnpm build            # Build for production
pnpm start:prod       # Run production server
pnpm preview          # Build & preview

# Code Quality
pnpm lint             # Check linting
pnpm lint:fix         # Fix linting issues
pnpm format           # Format code
pnpm format:check     # Check formatting
pnpm type-check       # TypeScript checking
pnpm validate         # All checks combined

# Testing
pnpm test:unit:run    # Run unit tests
pnpm test:unit:watch  # Unit tests (watch)
pnpm test             # E2E tests (Playwright)
pnpm test:coverage    # With coverage report

# Database
pnpm db:push          # Apply schema changes
pnpm db:seed          # Seed database
pnpm db:reset         # Push + seed
pnpm db:studio        # Open Drizzle Studio
```

## 🛠️ Setup & Installation

```bash
pnpm install          # Install dependencies
pnpm setup            # Full setup (install + db)
pnpm setup:clean      # Clean + setup
pnpm setup:docker     # Setup with Docker DB

# Or use scripts
.\scripts\setup.ps1                    # PowerShell
bash scripts/setup.sh                  # Bash
.\setup-dev-environment.ps1            # Complete setup
```

## 🧹 Cleanup & Maintenance

```bash
pnpm clean            # Remove build artifacts
.\scripts\cleanup.ps1              # Also remove node_modules
bash scripts/cleanup.sh --full     # Same but for Bash

# Dependencies
pnpm check-updates    # Check for updates
pnpm update-deps      # Update interactively
pnpm audit            # Security audit
pnpm audit:fix        # Fix vulnerabilities
pnpm dedupe           # Deduplicate packages
```

## 🐳 Docker Commands

```bash
# Development (DB + Redis)
pnpm docker:dev
pnpm docker:dev:build
pnpm docker:dev-down

# Production
pnpm docker:up
pnpm docker:down
pnpm docker:rebuild
pnpm docker:logs
pnpm docker:clean
```

## 📦 Building & Deployment

```bash
# Build analysis
pnpm build:analyze    # Bundle analysis
pnpm build:debug      # Debug info
pnpm build:profile    # Profiling
pnpm analyze-bundle   # Bundle size check

# Deployment
pnpm deploy:vercel    # Deploy to Vercel
pnpm deploy:preview   # Preview deployment
pnpm deploy:docker    # Docker deployment
```

## 🧪 Advanced Testing

```bash
# E2E Testing
pnpm test                    # All E2E tests
pnpm test:ui                 # With UI (Playwright)
pnpm test:headed             # Visible browser
pnpm test:chromium           # Chromium only
pnpm test:firefox            # Firefox only
pnpm test:webkit             # WebKit only
pnpm test:auth               # Auth tests
pnpm test:crud               # CRUD tests
pnpm test:trace              # With trace files

# Unit Testing
pnpm test:unit:run           # Run once
pnpm test:unit:watch         # Watch mode
pnpm test:unit:ui            # UI mode
pnpm test:unit:coverage      # With coverage
```

## 📧 Email Templates

```bash
pnpm email:dev        # Dev server for templates
pnpm email:export     # Export templates
```

## 🔍 Code Analysis

```bash
pnpm cspell           # Spell check
pnpm cspell:fix       # Fix spelling
pnpm find-deadcode    # Find unused code
pnpm types:generate   # Generate types
pnpm info             # Next.js info
pnpm lighthouse       # Lighthouse audit
pnpm bundle-size      # Check bundle size
```

## 📋 Priority System

```bash
pnpm priority         # Show priority tasks
pnpm priority:list    # List all
pnpm priority:status  # Current status
pnpm priority:run:p0  # Run P0 tasks
pnpm priority:run:p1  # Run P1 tasks
pnpm priority:run:p2  # Run P2 tasks
pnpm priority:run:p3  # Run P3 tasks
```

## 🔄 CI/CD Pipeline

```bash
pnpm ci               # Full CI pipeline
pnpm ci:full          # With E2E tests
pnpm ci:build         # Build only
pnpm ci:test          # Tests with reporters
pnpm ci:lint          # Strict linting
```

## 📍 Port Configuration

Default port is **3000**. Change with:

```bash
# Environment variable
export PORT=4000
pnpm dev

# Or inline (macOS/Linux)
PORT=4000 pnpm dev

# Or inline (Windows PowerShell)
$env:PORT = 4000; pnpm dev

# Using scripts with options
.\scripts\dev.ps1 -Port 4000
bash scripts/dev.sh --port 4000
```

## 🔐 Environment Variables

Key variables (in `.env` file):

```bash
DATABASE_URL=postgresql://user:pass@host/comicwise
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NODE_ENV=development
DEBUG=*
```

## 📋 Script Reference

### PowerShell Scripts

```bash
.\scripts\setup.ps1 [-Clean] [-DockerDB] [-Dev] [-SkipValidation]
.\scripts\dev.ps1 [-Debug] [-Port 4000] [-Https]
.\scripts\build.ps1 [-Debug] [-Analyze]
.\scripts\run.ps1 [-Preview] [-Port 4000]
.\scripts\lint.ps1 [-Fix] [-Strict] [-FixType]
.\scripts\format.ps1 [-Check]
.\scripts\type-check.ps1 [-Watch]
.\scripts\test.ps1 [--Unit] [--E2E] [--Watch] [--UI] [--Coverage]
.\scripts\cleanup.ps1 [-Full]
```

### Bash Scripts

```bash
bash scripts/setup.sh [--clean] [--docker-db] [--dev] [--skip-validation]
bash scripts/dev.sh [--debug] [--port 4000] [--https]
bash scripts/build.sh [--debug] [--analyze]
bash scripts/run.sh [--preview] [--port 4000]
bash scripts/lint.sh [--fix] [--strict] [--fix-type]
bash scripts/format.sh [--check]
bash scripts/type-check.sh [--watch]
bash scripts/test.sh [--unit] [--e2e] [--watch] [--ui] [--coverage]
bash scripts/cleanup.sh [--full]
```

## 🔧 Common Workflows

### Fresh Development Setup

```bash
pnpm setup:clean
pnpm dev
```

### Fix All Issues

```bash
pnpm lint:fix
pnpm format
pnpm type-check
```

### Complete Quality Check

```bash
pnpm validate       # lint + format + type-check
pnpm test:unit:run  # unit tests
pnpm test           # e2e tests
```

### Production Ready

```bash
pnpm clean
pnpm install
pnpm validate
pnpm test:unit:run
pnpm build
```

### Docker Deployment

```bash
pnpm docker:clean     # Clean old containers
pnpm docker:build     # Build images
pnpm docker:up        # Start containers
pnpm docker:logs      # View logs
```

## ⚡ Performance Tips

1. **Use pnpm** - Faster than npm
2. **Turbopack enabled** - Faster dev builds (default)
3. **Incremental type checking** - Only check changed files
4. **Watch mode for development** - Auto-rebuild on changes

```bash
pnpm dev              # Auto-rebuild (Turbopack)
pnpm type-check:watch # Auto type-check
pnpm test:unit:watch  # Auto test (watch)
```

## 🐛 Debugging

```bash
# Node.js debugging
.\scripts\dev.ps1 -Debug
bash scripts/dev.sh --debug
# Connect to localhost:9229

# TypeScript type analysis
pnpm type-check

# ESLint detailed output
pnpm lint --format=json | jq

# Test debugging
pnpm test --debug

# Browser debugging (E2E)
pnpm test:headed      # See browser
pnpm test:ui          # Test UI mode
```

## ❓ Troubleshooting

| Problem             | Solution                                   |
| ------------------- | ------------------------------------------ |
| Port in use         | Use different port: `pnpm dev --port 4000` |
| Module not found    | `pnpm install`                             |
| Type errors         | `pnpm clean && pnpm install`               |
| DB connection error | Check `DATABASE_URL` in `.env`             |
| Tests timeout       | Increase timeout in `playwright.config.ts` |

## 📖 Full Documentation

For detailed information, see:

- **SCRIPTS_GUIDE.md** - Complete script documentation
- **SCRIPTS_OPTIMIZATION_REPORT.md** - Optimization details
- **package.json** - All available npm scripts
- Each script's help: `Get-Help .\scripts\dev.ps1` (PowerShell)

---

**Last Updated**: 2025-12-14  
**Version**: 2.0.0
