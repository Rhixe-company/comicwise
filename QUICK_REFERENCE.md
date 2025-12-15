# ComicWise — Quick Reference Guide

**Last Updated**: 2025-12-13  
**Project**: ComicWise (Next.js 16 + PostgreSQL + Drizzle ORM)

---

## 🚀 Quick Start (Copy-Paste)

```powershell
# Clone and install
cd C:\Users\Alexa\Desktop\SandBox\comicwise
pnpm install

# Setup environment
copy .env.example .env.local
# Edit .env.local with your database URL and secrets

# Initialize database
pnpm db:push
pnpm db:seed

# Start development
pnpm dev
```

---

## ⚡ Essential Commands

### Development

```powershell
pnpm dev              # Start dev server (http://localhost:3000)
pnpm dev:debug        # Debug mode (inspect protocol)
pnpm dev:https        # HTTPS dev server
```

### Code Quality

```powershell
pnpm lint             # Run ESLint
pnpm lint:fix         # Auto-fix issues
pnpm format           # Format with Prettier
pnpm type-check       # TypeScript check
pnpm validate         # Run all checks
```

### Database

```powershell
pnpm db:push          # Sync schema to database
pnpm db:seed          # Seed test data
pnpm db:studio        # Open database GUI
pnpm db:reset         # Push + Seed
```

### Testing

```powershell
pnpm test             # Run E2E tests (Playwright)
pnpm test:ui          # Interactive test UI
pnpm test:unit        # Run unit tests (Vitest)
```

### Build & Deploy

```powershell
pnpm build            # Build for production
pnpm build:analyze    # Bundle analysis
pnpm start            # Start production server
pnpm preview          # Preview production build
```

---

## 📁 Key Files & Folders

| Path                     | Purpose                           |
| ------------------------ | --------------------------------- |
| `src/app/`               | Next.js 16 app router             |
| `src/components/`        | React components (shadcn/ui)      |
| `src/lib/`               | Utilities & helpers               |
| `src/database/`          | Drizzle schema & queries          |
| `src/types/`             | TypeScript interfaces             |
| `src/hooks/`             | React hooks                       |
| `eslint.config.ts`       | ESLint configuration (15 plugins) |
| `prettier.config.ts`     | Code formatter config             |
| `tsconfig.json`          | TypeScript configuration          |
| `next.config.ts`         | Next.js configuration             |
| `.env.local`             | Local environment (gitignored)    |
| `docker-compose.dev.yml` | Docker dev environment            |
| `Makefile`               | Common tasks                      |

---

## 🔐 Environment Setup

### Create `.env.local`

```bash
# Database (required)
DATABASE_URL="postgresql://user:password@localhost:5432/comicwise"

# NextAuth (required)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Email (Nodemailer)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@comicwise.com"

# Image Upload (choose one)
CLOUDINARY_URL="cloudinary://key:secret@cloud"
# OR IMAGEKIT_* or AWS_* variables

# Optional
UPSTASH_REDIS_REST_URL="..."
NEXTAUTH_DEBUG="true"  # For auth debugging
```

### Generate NEXTAUTH_SECRET

```powershell
# PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Minimum 0 -Maximum 256) }))

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🎯 ESLint Configuration (15 Plugins)

### Installed Plugins

1. **@typescript-eslint** - TypeScript rules
2. **eslint-plugin-react** - React best practices
3. **eslint-plugin-react-hooks** - React hooks rules
4. **@next/eslint-plugin-next** - Next.js specific
5. **eslint-plugin-import** - Import/export rules
6. **eslint-plugin-simple-import-sort** - Import ordering
7. **eslint-plugin-unused-imports** - Remove unused imports
8. **eslint-plugin-prettier** - Prettier integration
9. **eslint-plugin-jsx-a11y** - Accessibility
10. **eslint-plugin-better-tailwindcss** - Tailwind optimization
11. **eslint-plugin-drizzle** - Drizzle ORM rules
12. **eslint-plugin-zod** - Zod validation rules
13. **eslint-plugin-security** - Security checks
14. **eslint-plugin-sonarjs** - Code quality (bonus)
15. **@eslint/css** - CSS linting (bonus)

### Key Rules

- ✅ Strict equality (`eqeqeq: error`)
- ✅ No semicolons (`semi: error, never`)
- ✅ Double quotes (`quotes: error, double`)
- ✅ React hooks (`react-hooks/rules-of-hooks: error`)
- ✅ No console in prod (`no-console: warn, allow: [warn, error, log]`)
- ✅ Enforce where clauses in Drizzle
  (`drizzle/enforce-delete-with-where: error`)

---

## 🧪 Testing

### E2E Tests (Playwright)

```powershell
pnpm test                   # Run all browsers
pnpm test:headed            # See browser window
pnpm test:ui                # Interactive UI
pnpm test:debug             # Step through tests
pnpm test:update-snapshots  # Update visual snapshots
```

**Test Files**: `tests/` folder

### Unit Tests (Vitest)

```powershell
pnpm test:unit              # Run all
pnpm test:unit:watch        # Watch mode
pnpm test:unit:coverage     # Coverage report
```

**Test Files**: `src/**/__tests__/`

---

## 🐳 Docker

### Start Docker Stack

```powershell
# With Docker Compose
pnpm docker:dev              # Start PostgreSQL + Redis + Next.js

# View logs
pnpm docker:logs

# Stop
pnpm docker:down

# Clean up
pnpm docker:clean
```

**Compose Files**:

- `docker-compose.dev.yml` - Development stack
- `docker-compose.yml` - Production stack

---

## 📊 GitHub Copilot Integration

### Copy-Paste These Prompts into Copilot Chat

#### 1️⃣ Fix TypeScript Errors (P0)

```
Scan the repository for TypeScript errors and missing imports.
Fix import paths to use '@/' aliases instead of relative paths.
Run pnpm type-check to verify.
```

#### 2️⃣ Wire NextAuth v5 (P1)

```
Scaffold NextAuth v5 with:
- src/lib/authConfig.ts (providers, callbacks)
- Drizzle adapter setup
- Sign-in/Sign-up pages
- Email provider with Nodemailer

Test with pnpm dev and verify auth flows work.
```

#### 3️⃣ Create Admin CRUD Pages (P2)

```
Create admin pages for Comics with:
- Table with pagination (cursor-based)
- Create/Edit/Delete forms
- Zod validation schemas
- Server actions for mutations
- Image upload using useImageUpload hook
```

#### 4️⃣ Setup CI Pipeline (P2)

```
Generate .github/workflows/ci.yml that:
- Installs deps
- Runs pnpm type-check
- Runs pnpm lint
- Runs pnpm test:unit:run
- Builds with pnpm build
- Fails if any step errors

Set up branch protection rules.
```

---

## 🔍 Debugging Tips

### Type Errors

```powershell
# See detailed errors
pnpm type-check

# Watch mode for development
pnpm type-check:watch
```

### Linting Issues

```powershell
# View all issues
pnpm lint

# Auto-fix simple ones
pnpm lint:fix

# Strict mode (zero warnings)
pnpm lint:strict
```

### Database Issues

```powershell
# Open database GUI
pnpm db:studio

# Check schema
pnpm db:check

# Reset entirely
pnpm db:drop
pnpm db:push
pnpm db:seed
```

### Runtime Errors

```powershell
# Debug mode with inspect protocol
NODE_OPTIONS='--inspect' pnpm dev

# Or simple dev
pnpm dev:debug
```

---

## 📚 Documentation Files

| File                        | Purpose                        |
| --------------------------- | ------------------------------ |
| `SETUP_OPTIMIZED_FINAL.md`  | Complete setup guide (24KB)    |
| `GITHUB_COPILOT_PROMPTS.md` | Copilot Chat prompts (18KB)    |
| `tasks.optimized.txt`       | Task breakdown with priorities |
| `setup.txt`                 | Quick reference                |
| `README.md`                 | Project overview               |
| `docs/`                     | Additional documentation       |

---

## ⚠️ Common Issues & Fixes

### `pnpm install` fails

```powershell
# Clear cache and retry
pnpm store prune
Remove-Item pnpm-lock.yaml
pnpm install
```

### Port 3000 in use

```powershell
# Find and kill process
Get-NetTCPConnection -LocalPort 3000 | Stop-Process -Force

# Or use different port
pnpm dev -- -p 3001
```

### Database won't connect

```powershell
# Verify PostgreSQL is running
# Check DATABASE_URL in .env.local
# Use Docker if local DB unavailable
pnpm docker:dev
```

### Type errors after update

```powershell
# Clear caches and rebuild
pnpm clean
pnpm install
pnpm type-check
Remove-Item .next -Recurse
```

---

## 🎓 Learning Path

1. **Setup** (30 mins): Run setup script, verify with `pnpm validate`
2. **Explore** (1 hour): `pnpm dev`, browse app, check `src/` structure
3. **Read Docs** (30 mins): Review `SETUP_OPTIMIZED_FINAL.md`
4. **First Task** (1-2 hours): Start with P0 from task list
5. **Use Copilot** (ongoing): Copy prompts from `GITHUB_COPILOT_PROMPTS.md`

---

## 🚀 Next Steps

- [ ] Run `pnpm install` and `pnpm validate`
- [ ] Copy `.env.example` to `.env.local` and configure
- [ ] Start with `pnpm dev`
- [ ] Read `SETUP_OPTIMIZED_FINAL.md` for detailed guide
- [ ] Use `GITHUB_COPILOT_PROMPTS.md` for Copilot Chat tasks
- [ ] Follow priority system: P0 → P1 → P2 → P3

---

## 📞 Support

- **Issues**: Check GitHub Issues or search docs
- **Questions**: Use GitHub Copilot Chat for quick answers
- **Bugs**: Create issue with `pnpm validate` output
- **Documentation**: Update `.md` files as you go

---

**Generated**: 2025-12-13  
**Status**: ✅ Ready to use
