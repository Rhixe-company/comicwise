# ComicWise — Optimized Setup & Dev Environment Guide

**Project**: ComicWise  
**Version**: 1.0.0  
**Last Updated**: 2025-12-13  
**Framework**: Next.js 16 + TypeScript 5 + PostgreSQL + Drizzle ORM

---

## 📋 Quick Start (2 minutes)

```powershell
# Install dependencies
pnpm install

# Set up environment
copy .env.example .env.local
# Edit .env.local with your local database URL and secrets

# Initialize database
pnpm db:push
pnpm db:seed

# Start development server
pnpm dev

# Open browser
Start-Process "http://localhost:3000"
```

---

## 🔧 ESLint Configuration Status

### ✅ Installed & Configured (15 ESLint Plugins)

The project uses a **flat ESLint v9 configuration** with comprehensive plugin
setup:

#### Core Plugins (5)

1. **@typescript-eslint/eslint-plugin** v8.49.0 - TypeScript linting rules
2. **eslint-plugin-react** v7.37.5 - React best practices
3. **eslint-plugin-react-hooks** v7.0.1 - React hooks rules
4. **@next/eslint-plugin-next** v16.0.10 - Next.js specific rules
5. **eslint-plugin-import** v2.32.0 - Import/export rules

#### Utility & Code Quality Plugins (4)

6. **eslint-plugin-simple-import-sort** v12.1.1 - Consistent import ordering
7. **eslint-plugin-unused-imports** v4.3.0 - Remove unused imports
8. **eslint-plugin-prettier** v5.5.4 - Prettier integration
9. **eslint-plugin-jsx-a11y** v6.10.2 - Accessibility rules

#### Specialized Domain Plugins (4)

10. **eslint-plugin-better-tailwindcss** v3.8.0 - Tailwind CSS optimization
11. **eslint-plugin-drizzle** v0.2.3 - Drizzle ORM best practices
12. **eslint-plugin-zod** v1.4.0 - Zod validation rules
13. **eslint-plugin-security** v3.0.1 - Security vulnerability detection

#### Additional Quality Plugins (2)

14. **eslint-plugin-sonarjs** v3.0.5 - Code quality via SonarQube rules
15. **@eslint/css** v0.14.1 - CSS/SCSS linting (flat config)

### 📝 Config Files Location

- **ESLint Config**: `eslint.config.ts` (flat config v9)
- **Prettier Config**: `prettier.config.ts`
- **PostCSS Config**: `postcss.config.mjs`
- **TypeScript Config**: `tsconfig.json`
- **Next.js Config**: `next.config.ts`

### 🎯 ESLint Rules Configuration

The configuration provides:

- **Rules**: 150+ comprehensive rules covering JS, TS, React, Next.js, CSS,
  JSON, Markdown
- **Extends**: Combines recommended configs from all 15 plugins
- **Settings**: Custom settings for Tailwind, imports, React, accessibility
- **File-specific**: Separate configs for tests, hooks, types, config files,
  markdown, CSS, JSON
- **Global Ignores**: `.next`, `node_modules`, `dist`, `build`, `.vercel`,
  `public`, `drizzle`

### ✨ Key Rule Highlights

**TypeScript Strict**:

- `@typescript-eslint/no-explicit-any`: warn
- `@typescript-eslint/no-unused-vars`: warn with `_` pattern ignore
- `@typescript-eslint/prefer-nullish-coalescing`: warn
- `@typescript-eslint/consistent-type-imports`: warn (separate-type-imports)

**React Best Practices**:

- `react/jsx-key`: error with fragment shorthand check
- `react-hooks/rules-of-hooks`: error
- `react-hooks/exhaustive-deps`: warn
- `react/no-direct-mutation-state`: error

**Code Quality**:

- `eqeqeq`: error (always strict equality)
- `no-console`: warn (allow log, warn, error)
- `prefer-const`: warn
- `no-trailing-spaces`: error
- `semi`: error (never) - no semicolons
- `quotes`: error (double quotes)

**Import Organization**:

- `simple-import-sort/imports`: warn
- `simple-import-sort/exports`: warn
- `unused-imports/no-unused-imports`: error
- `import/first`: error

**Tailwind CSS**:

- `better-tailwindcss/no-conflicting-classes`: warn
- `better-tailwindcss/enforce-consistent-class-order`: warn
- `better-tailwindcss/no-duplicate-classes`: warn

**Security**:

- `security/detect-non-literal-regexp`: warn
- `security/detect-child-process`: warn
- `security/detect-unsafe-regex`: warn

**ORM & Validation**:

- `drizzle/enforce-delete-with-where`: error
- `drizzle/enforce-update-with-where`: error
- `zod/prefer-enum`: error

---

## 🚀 Common Development Commands

### Code Quality & Validation

```powershell
# Lint all files (warnings allowed)
pnpm lint

# Lint with auto-fix
pnpm lint:fix

# Lint strict mode (zero warnings)
pnpm lint:strict

# Format code
pnpm format

# Check formatting without changes
pnpm format:check

# Type checking
pnpm type-check

# Watch mode type checking
pnpm type-check:watch

# Full validation (type-check + lint + format check)
pnpm validate

# Spell checking
pnpm cspell
pnpm cspell:fix
```

### Development

```powershell
# Start dev server
pnpm dev

# Debug mode
pnpm dev:debug

# HTTPS dev server
pnpm dev:https

# Build for production
pnpm build

# Analyze bundle
pnpm build:analyze

# Start production server
pnpm start

# Preview production build
pnpm preview
```

### Database

```powershell
# Generate migrations
pnpm db:generate

# Push schema to database
pnpm db:push

# Run migrations
pnpm db:migrate

# Seed database
pnpm db:seed

# Seed with flags
pnpm db:seed:users          # Users only
pnpm db:seed:comics         # Comics only
pnpm db:seed:chapters       # Chapters only
pnpm db:seed:dry-run        # Preview without changes
pnpm db:seed:verbose        # Detailed logging
pnpm db:seed:no-images      # Skip image processing

# Database studio (visual editor)
pnpm db:studio

# Reset database (push + seed)
pnpm db:reset

# Backup database
pnpm db:backup
```

### Testing

```powershell
# Run Playwright E2E tests
pnpm test

# Interactive UI
pnpm test:ui

# Headed mode (see browser)
pnpm test:headed

# Debug specific test
pnpm test:debug

# Run unit tests
pnpm test:unit

# Watch mode
pnpm test:unit:watch

# Coverage report
pnpm test:unit:coverage

# CI mode
pnpm test:ci
```

### Docker

```powershell
# Build images
pnpm docker:build

# Start services
pnpm docker:up

# Stop services
pnpm docker:down

# Dev environment
pnpm docker:dev
pnpm docker:dev:build

# Production
pnpm docker:prod

# View logs
pnpm docker:logs

# Clean up
pnpm docker:clean
pnpm docker:prune
```

---

## 📁 Project Structure

```
comicwise/
├── src/
│   ├── app/                    # Next.js 16 app router
│   │   ├── (root)/            # Public routes
│   │   ├── (auth)/            # Auth routes (sign-in, sign-up, etc.)
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── admin/            # Admin-specific components
│   │   ├── emails/           # React Email templates
│   │   └── [feature]/        # Feature components
│   ├── lib/                   # Utilities & helpers
│   │   ├── authConfig.ts      # NextAuth v5 config
│   │   ├── auth.ts           # Auth helpers
│   │   ├── image.ts          # Image upload/CDN
│   │   ├── validations/      # Zod schemas
│   │   └── [utils]/          # Other utilities
│   ├── database/             # Database layer
│   │   ├── schema.ts         # Drizzle schema
│   │   ├── db.ts            # Database client
│   │   ├── queries/          # Prepared queries
│   │   └── seed/             # Seed data
│   ├── types/                # TypeScript types
│   │   ├── index.ts
│   │   ├── database.d.ts
│   │   └── [domain].ts
│   ├── hooks/                # React hooks
│   │   ├── useImageUpload.ts
│   │   └── [feature].ts
│   ├── styles/               # Global styles
│   │   └── globals.css       # Tailwind CSS
│   └── services/             # Business logic
│       └── upload/           # Image upload adapters
├── public/                   # Static assets
├── docs/                     # Documentation
├── scripts/                  # Utility scripts
│   ├── codemods/            # AST transformations
│   ├── priority-system.ts   # Task priority system
│   └── generate-stub-types.ts
├── tests/                    # Test files (Playwright)
├── .github/
│   └── workflows/           # GitHub Actions
├── .vscode/                 # VS Code settings
├── compose/                 # Docker compose scripts
├── .env.example             # Example environment
├── .env.local              # Local environment (gitignored)
├── docker-compose.yml      # Production compose
├── docker-compose.dev.yml  # Dev compose
├── eslint.config.ts        # ESLint flat config
├── prettier.config.ts      # Prettier config
├── tsconfig.json          # TypeScript config
├── next.config.ts         # Next.js config
├── vitest.config.ts       # Unit test config
├── playwright.config.ts   # E2E test config
├── Makefile               # Common tasks
└── package.json           # Dependencies

```

---

## 🔐 Environment Variables Setup

### Required Variables

Copy `.env.example` to `.env.local` and update:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/comicwise"

# NextAuth v5
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here-min-32-chars"

# OAuth Providers (optional)
GITHUB_ID="your-github-app-id"
GITHUB_SECRET="your-github-app-secret"
GOOGLE_ID="your-google-oauth-id"
GOOGLE_SECRET="your-google-oauth-secret"

# Email (Nodemailer)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@comicwise.com"

# Image Upload (choose one)
CLOUDINARY_URL="cloudinary://key:secret@cloud"
# OR
IMAGEKIT_PUBLIC_KEY="your-imagekit-public-key"
IMAGEKIT_PRIVATE_KEY="your-imagekit-private-key"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your-id"
# OR
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket-name"

# Upstash (optional)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
QSTASH_TOKEN="..."

# Analytics (optional)
NEXT_PUBLIC_GA_ID="GA-..."
```

### Load Environment

Add to PowerShell profile (`$PROFILE`):

```powershell
# Load .env.local on every new session
function Load-DevEnv {
    if (Test-Path .env.local) {
        Get-Content .env.local | ForEach-Object {
            if ($_ -and !$_.StartsWith("#")) {
                $name, $value = $_ -split "=", 2
                [Environment]::SetEnvironmentVariable($name, $value)
            }
        }
    }
}
Load-DevEnv
```

---

## 🎯 Priority-Based Task System

### P0 — Immediate (Must Have)

- [ ] `pnpm install` succeeds
- [ ] `pnpm type-check` passes
- [ ] `pnpm lint` shows no critical errors
- [ ] `.env.local` configured
- [ ] `pnpm db:push` connects to database

**Copilot Chat Prompt**:

```
Fix all TypeScript errors and missing imports in the repository.
Ensure `pnpm type-check` passes with zero errors.
Update import paths to use `@/` aliases instead of relative paths.
Run `pnpm type-check` to verify.
```

### P1 — High Priority (Week 1)

- [ ] NextAuth v5 + Drizzle adapter wired
- [ ] Sign-in/Sign-up pages working
- [ ] Database schema validated
- [ ] Seed script runs successfully
- [ ] `pnpm build` succeeds
- [ ] CI/GitHub Actions workflow passing

**Copilot Chat Prompt**:

```
Ensure NextAuth v5 is fully configured with:
1. `src/lib/authConfig.ts` with all providers and callbacks
2. Drizzle ORM adapter properly wired
3. Sign-in/Sign-up pages at `src/app/(auth)/`
4. Server actions for registration and login
5. Email provider using Nodemailer with React Email templates

Validate the setup by running `pnpm dev` and testing auth flow locally.
Report any missing environment variables or connection errors.
```

### P2 — Medium Priority (Week 2-3)

- [ ] Admin CRUD pages for all entities
- [ ] Image upload abstraction working
- [ ] API routes for client-side operations
- [ ] Email notifications integrated
- [ ] Database seeding reliable
- [ ] E2E tests for critical paths

**Copilot Chat Prompt**:

```
Create CRUD admin pages (create, read, update, delete) for:
1. Comics - with image upload, slug generation, genre/author selection
2. Chapters - with chapter number, images, ordering
3. Users - with role management and email sending
4. Authors/Artists - metadata management
5. Genres/Types - category management

Use shadcn/ui components, Zod schemas, and server actions.
Implement pagination (cursor-based) and filtering.
Hook email notifications to create/update events.

Acceptance: All pages render, validation works, operations succeed.
```

### P3 — Low Priority (Nice-to-Have)

- [ ] Performance optimizations (image optimization, code splitting)
- [ ] Advanced analytics dashboard
- [ ] Search optimization with full-text indexes
- [ ] Cache strategies with Redis/Upstash
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Mobile app via React Native/Expo

**Copilot Chat Prompt**:

```
Implement performance optimizations:
1. Image optimization: use `next/image` with responsive srcset
2. Code splitting: lazy load admin and chapter routes
3. Database: add indexes for search queries (title, genre, author)
4. Caching: implement Redis caching for frequently accessed data
5. Metrics: integrate Web Vitals tracking

Report performance improvements using Lighthouse and Web Vitals.
```

---

## 🛠️ GitHub Copilot Integration

### Using GitHub Copilot Chat

1. **Open Copilot Chat** in VS Code (Cmd+I on Mac, Ctrl+I on Windows)
2. **Paste a prompt** from the sections below
3. **Review suggestions** before accepting
4. **Run validation** commands after changes

### Using GitHub Copilot CLI

```powershell
# Install (if not already)
gh extension install github/gh-copilot

# Run prompt interactively
gh copilot suggest "your prompt here"

# Run in diagnostic mode
gh copilot suggest -t shell "your prompt"
```

### Token Usage Optimization

- **Batch requests**: Group 3-5 related tasks in one prompt
- **Reference files**: Use `@filename` to provide context without token waste
- **Use slash commands**:
  - `/explain` - Understand code without changes
  - `/fix` - Quick bug fixes
  - `/tests` - Generate test cases
  - `/doc` - Add documentation

**Recommended Prompts**:

#### Refactor Imports (saves ~500 tokens)

```
@eslint.config.ts Review this config and ensure all 15 plugins are:
1. Properly imported at the top
2. Listed in `plugins` section
3. Have rules configured
4. Are extended in appropriate file configs

Report any missing plugins or configuration gaps.
```

#### Add Type Definitions (saves ~400 tokens)

```
Create missing TypeScript interfaces for database queries.
Add to `src/types/database.d.ts`:
- ComicWithChapters
- ChapterWithComic
- UserProfile

Ensure strict types and export all interfaces for use across the app.
```

#### Scaffold Admin Pages (saves ~600 tokens)

```
@package.json Review the database tables (comics, chapters, users, genres).
Create admin CRUD scaffolding that:
1. Uses shadcn/ui components
2. Implements Zod validation
3. Uses server actions
4. Supports pagination

Generate one page as example (e.g., comics admin).
```

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)

```powershell
# Run all
pnpm test:unit

# Watch mode (develop)
pnpm test:unit:watch

# Coverage report
pnpm test:unit:coverage

# Single file
pnpm test:unit src/lib/validations.test.ts
```

### E2E Tests (Playwright)

```powershell
# Run all browsers
pnpm test

# Specific browser
pnpm test:chromium
pnpm test:firefox

# With UI
pnpm test:ui

# Debug mode
pnpm test:debug

# Update snapshots
pnpm test:update-snapshots

# CI mode (GitHub)
pnpm test:ci
```

### Coverage Targets

```
- Statements: >= 70%
- Branches: >= 60%
- Functions: >= 70%
- Lines: >= 70%
```

### Test Files Location

```
tests/
├── auth.spec.ts          # Authentication flows
├── crud.spec.ts          # CRUD operations
├── search.spec.ts        # Search functionality
└── [feature].spec.ts     # Feature-specific tests

src/**/__tests__/
├── [module].test.ts      # Unit tests
└── [component].test.tsx  # Component tests
```

---

## 🔍 Code Quality Gates

### Linting

```powershell
# Fix all auto-fixable issues
pnpm lint:fix

# Strict mode (CI)
pnpm lint:strict

# Check specific rules
eslint . --fix-type problem --fix-type suggestion
```

### Type Checking

```powershell
# Full type check
pnpm type-check

# Watch mode
pnpm type-check:watch
```

### Formatting

```powershell
# Apply Prettier
pnpm format

# Check without changes
pnpm format:check
```

### Combined Validation

```powershell
# Run all checks (recommended before commit)
pnpm validate
```

### Pre-commit Hooks

Files in `.husky/` ensure:

- ESLint passes
- TypeScript compiles
- Prettier is applied
- No secrets committed

---

## 📦 Dependency Management

### Check for Updates

```powershell
# List outdated packages
pnpm check-updates

# Interactive update
pnpm update-deps

# Patch only
pnpm update-deps:patch

# Using npm-check-updates
pnpm check-updates:ncu
```

### Security Audit

```powershell
# Check for vulnerabilities
pnpm audit

# Auto-fix
pnpm audit:fix
```

### Cleanup

```powershell
# Remove duplicate dependencies
pnpm dedupe

# Clean install
pnpm clean && pnpm install
```

---

## 🐳 Docker & Containerization

### Development Environment

```powershell
# Start with hot reload
pnpm docker:dev

# Build and start
pnpm docker:dev:build

# View logs
pnpm docker:logs

# Stop
pnpm docker:down
```

### Production Deployment

```powershell
# Build production image
pnpm docker:prod

# Services included:
# - Node.js 20 app (Next.js)
# - PostgreSQL 17
# - Redis (optional)
# - Nginx reverse proxy (optional)
```

### Dockerfile Best Practices

✅ Multi-stage builds  
✅ Non-root user  
✅ Health checks  
✅ Security scanning  
✅ Optimized layers  
✅ `.dockerignore`

---

## 📚 Documentation

### Architecture Documentation

- **Database**: `docs/DATABASE_SCHEMA.md` (if exists)
- **API**: Auto-generated from OpenAPI/Swagger
- **Auth Flow**: `docs/AUTH_FLOW.md` (if exists)
- **Deployment**: `docs/DEPLOYMENT.md` (if exists)

### Code Documentation

```typescript
// Always document complex functions
/**
 * Uploads an image to CDN and returns optimized URL
 * @param file - Image file to upload
 * @param options - Upload options (width, height, quality)
 * @returns Optimized image URL with responsive srcset
 * @throws UploadError if file exceeds 10MB or invalid format
 * @example
 * const url = await uploadImage(file, { width: 800 });
 */
async function uploadImage(
  file: File,
  options?: UploadOptions
): Promise<string> {
  // ...
}
```

---

## 🚨 Troubleshooting

### Common Issues

#### `pnpm install` fails

```powershell
# Clear cache
pnpm store prune

# Remove lock file
Remove-Item pnpm-lock.yaml

# Reinstall
pnpm install
```

#### Port 3000 already in use

```powershell
# Use alternate port
pnpm dev -- -p 3001

# Or kill process on port 3000
Get-NetTCPConnection -LocalPort 3000 | Stop-Process -Force
```

#### Database connection refused

```powershell
# Verify PostgreSQL is running
# Check connection string in .env.local
# Ensure database exists:
createdb comicwise

# Or via Docker:
pnpm docker:up
```

#### `pnpm lint` timeout

```powershell
# Run with longer timeout
pnpm lint --max-warnings=10

# Or specify directory
pnpm lint src/
```

#### Type errors after dependency update

```powershell
# Rebuild TypeScript
pnpm type-check

# Clear Next.js cache
Remove-Item .next -Recurse

# Full clean rebuild
pnpm clean && pnpm install && pnpm type-check
```

---

## 🎯 Performance Metrics

### Target Web Vitals

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Build Metrics

- **Bundle Size**: < 200KB (main)
- **Build Time**: < 60s
- **Lighthouse Score**: > 90 (all categories)

### Monitor with

```powershell
# Bundle analysis
pnpm bundle-size

# Build profiling
pnpm build:profile

# Lighthouse audit
pnpm lighthouse
```

---

## 📝 Commit & PR Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

**Examples**:

```
feat(auth): add NextAuth v5 integration with Drizzle adapter
fix(search): resolve case-insensitive query filtering
docs(api): update endpoint documentation
refactor(admin): convert forms to server actions
perf(images): optimize image loading with next/image
```

### Branch Naming

```
feature/auth-setup
bugfix/search-filter
docs/api-reference
refactor/image-upload
```

### Pull Request Checklist

- [ ] Tests pass (`pnpm test`)
- [ ] Type check passes (`pnpm type-check`)
- [ ] Lint passes (`pnpm lint`)
- [ ] Code formatted (`pnpm format`)
- [ ] Documentation updated
- [ ] No console warnings/errors
- [ ] Accessibility checked (WCAG)

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"

      - run: pnpm install
      - run: pnpm type-check
      - run: pnpm lint --max-warnings=0
      - run: pnpm test:unit:run
      - run: pnpm build
```

---

## 📈 Scaling Guidelines

### As Features Grow

1. **Keep `src/` modular**: One feature per subdirectory
2. **Split routes**: Use route groups `(feature)/`
3. **Database**: Add indexes for growing tables
4. **Caching**: Implement Redis for hot data
5. **CDN**: Serve static assets from CloudFront/Cloudflare
6. **Monitoring**: Add Sentry, LogRocket, or similar
7. **CI/CD**: Optimize build times with caching

### Estimated Scalability

- **100K users**: Current setup handles fine
- **1M users**: Add read replicas, implement caching
- **10M+ users**: Consider microservices, API gateway

---

## 🎓 Learning Resources

### Official Docs

- [Next.js 16 Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React 19 Docs](https://react.dev)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

### Tutorials & Guides

- Next.js: Server Components, Streaming, App Router
- TypeScript: Advanced Types, Generics, Utility Types
- React: Hooks, Context, Suspense
- Drizzle: Schema Design, Queries, Migrations
- Testing: Playwright, Vitest, Test Doubles

---

## ✅ Final Checklist (Before Launch)

- [ ] All environment variables configured
- [ ] Database seeded with test data
- [ ] Authentication flows tested
- [ ] Admin pages fully functional
- [ ] Image upload working with CDN
- [ ] Email notifications sending
- [ ] E2E tests pass locally
- [ ] Build succeeds: `pnpm build`
- [ ] No console errors in dev
- [ ] Lighthouse score > 90
- [ ] Security audit clean: `pnpm audit`
- [ ] Type check passes: `pnpm type-check`
- [ ] Linter strict: `pnpm lint:strict`

---

## 📞 Getting Help

1. **Check existing issues**: GitHub Issues
2. **Search documentation**: `/docs` folder
3. **Ask in discussions**: GitHub Discussions
4. **Contact maintainers**: See CONTRIBUTING.md
5. **Use GitHub Copilot Chat**: Quick answers (includes context)

---

**Happy coding! 🚀**
