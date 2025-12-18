# 📖 SETUP.md - Quick Reference Guide

## Location

```
C:\Users\Alexa\Desktop\SandBox\comicwise\SETUP.md
```

## File Information

- **Size**: 15.41 KB
- **Lines**: 722
- **Words**: 2,053
- **Sections**: 13
- **Code Examples**: 50+
- **Commands Documented**: 80+
- **Troubleshooting Issues**: 7

## Quick Navigation

### For Experienced Developers (⚡ 5 minutes)

```bash
# Jump to: "Quick Start (5 minutes)"
# Commands provided:
pnpm install
cp .env.example .env.local
docker run ... postgres:17-alpine
pnpm db:push && pnpm db:seed
pnpm dev
```

### For New Developers (📖 15-20 minutes)

```
1. Read: System Requirements
2. Follow: Detailed Setup (Steps 1-6)
3. Reference: Environment Configuration
4. Use: Development Commands
5. Bookmark: Troubleshooting
```

### For Docker Users (🐳 10 minutes)

```
1. Skip to: Docker Setup (Alternative)
2. Run: docker compose up -d
3. Execute: docker compose exec app pnpm db:seed
4. Browse: http://localhost:3000
```

### For Windows WSL2 Users (💻 15 minutes)

```
1. Read: System Requirements → Windows (WSL2)
2. Follow: Detailed Setup → Step 3 → Option C
3. Continue with normal steps 4-6
```

## Document Structure

```
SETUP.md
├── 📋 Table of Contents
│   └── 7 main categories with links
│
├── 🔧 System Requirements (60 lines)
│   ├── Minimum Requirements
│   └── Recommended Tools
│
├── ⚡ Quick Start (5 minutes) (25 lines)
│   └── One-command setup
│
├── 📖 Detailed Setup (150 lines)
│   ├── Step 1: Clone & Install
│   ├── Step 2: Environment Config
│   ├── Step 3: Database Setup (3 options)
│   ├── Step 4: Initialize Schema
│   ├── Step 5: Seed Data
│   └── Step 6: Start Dev Server
│
├── 🌍 Environment Configuration (100 lines)
│   ├── Copy & Customize .env.local
│   ├── Required Variables (5)
│   ├── Optional Variables (25+)
│   ├── AUTH_SECRET Generation
│   └── Validation Details
│
├── 🗄️ Database (80 lines)
│   ├── Schema Overview
│   ├── Common Commands (8 cmds)
│   ├── Drizzle Studio
│   └── psql CLI Access
│
├── 🚀 Running the Application (60 lines)
│   ├── Development Mode
│   ├── Production Build
│   ├── Linting & Type Checking
│   └── Code Quality Validation
│
├── 📚 Development Commands (80 lines)
│   ├── Dev Server (3 variants)
│   ├── Testing (10+ commands)
│   ├── Database (4+ commands)
│   ├── Building & Analysis (4 commands)
│   └── Utilities (6+ commands)
│
├── 🐳 Docker Setup (60 lines)
│   ├── Full Stack Setup
│   ├── Services Overview
│   ├── Running Commands in Docker
│   └── Building Custom Images
│
├── 🛠️ Troubleshooting (100 lines)
│   ├── 7 Common Issues with Solutions
│   ├── Getting Help
│   └── Health Check Verification
│
├── 📝 First Time Setup Checklist (15 items)
│   └── Verification list
│
├── 🎯 Next Steps (30 lines)
│   ├── Explore Codebase
│   ├── Run Tests
│   ├── Read Documentation
│   └── Make First Contribution
│
└── 📞 Support (10 lines)
    └── Help Resources
```

## Command Reference (By Category)

### Setup Commands

```bash
pnpm install                  # Install dependencies
cp .env.example .env.local    # Create env file
pnpm db:push                  # Apply migrations
pnpm db:seed                  # Seed sample data
```

### Development Commands

```bash
pnpm dev                      # Start dev server
pnpm dev:debug               # With debugger
pnpm type-check              # Type validation
pnpm lint                    # ESLint check
pnpm format                  # Code formatting
```

### Database Commands

```bash
pnpm db:studio               # Open explorer
pnpm db:generate             # Generate migrations
pnpm db:backup               # Create backup
pnpm db:reset                # Full reset
pnpm db:seed:dry-run        # Preview seed
```

### Testing Commands

```bash
pnpm test:unit:run          # Unit tests
pnpm test                   # E2E tests
pnpm test:headed            # E2E with browser
```

### Docker Commands

```bash
docker compose up -d         # Start services
docker compose down          # Stop services
docker compose exec app pnpm # Run command in container
```

## Environment Variables Summary

### Required (Must Set)

```env
NODE_ENV=development
DATABASE_URL=postgresql://...
AUTH_SECRET=(32+ chars)
AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Optional (May Leave Empty)

```env
AUTH_GOOGLE_CLIENT_ID=
AUTH_GOOGLE_CLIENT_SECRET=
AUTH_GITHUB_CLIENT_ID=
AUTH_GITHUB_CLIENT_SECRET=
UPLOAD_PROVIDER=local
REDIS_URL=
EMAIL_SERVER_HOST=
EMAIL_SERVER_PORT=
```

## Troubleshooting Quick Links

| Issue                 | Location | Solution                           |
| --------------------- | -------- | ---------------------------------- |
| Missing DATABASE_URL  | Line 544 | Update .env.local                  |
| Can't connect to DB   | Line 551 | Start PostgreSQL                   |
| pnpm not found        | Line 559 | Install pnpm globally              |
| TypeScript errors     | Line 566 | Clear cache & reinstall            |
| Port 3000 in use      | Line 577 | Kill process or use different port |
| AUTH_SECRET too short | Line 588 | Generate new secret                |
| DB seed timeout       | Line 598 | Wait for DB & retry                |

## Development Workflow

### Daily Development

```bash
pnpm dev              # Start dev server
# Make changes
pnpm type-check       # Check types
pnpm lint:fix         # Fix linting issues
pnpm test:unit:run    # Run unit tests
# Commit code
```

### Before Committing

```bash
pnpm validate         # Type-check + lint + format
pnpm test:unit:run    # Unit tests
git commit -m "feat:..." # Commit message
```

### Deploying

```bash
pnpm build            # Production build
pnpm start            # Start production server
# Or use Docker:
docker compose up -d  # Start full stack
```

## Common Tasks

### Add New Feature

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes to `src/`
3. Run validation: `pnpm validate`
4. Test: `pnpm test:unit:run`
5. Commit: `git commit -m "feat: description"`

### Update Database Schema

1. Edit `src/database/schema.ts`
2. Generate migration: `pnpm db:generate`
3. Apply migration: `pnpm db:push`
4. Test in studio: `pnpm db:studio`

### Seed Database with Sample Data

```bash
# Preview changes
pnpm db:seed:dry-run

# Apply with logging
pnpm db:seed:verbose

# Or just seed
pnpm db:seed
```

### Debug TypeScript Issues

```bash
pnpm type-check                # Show all errors
pnpm type-check:watch         # Watch mode
# Or open IDE for inline checking
```

### Run E2E Tests

```bash
pnpm test                     # Run all tests
pnpm test:headed             # See browser
pnpm test:debug              # Debug mode
pnpm test --project=chromium # Specific browser
```

## Key Files Referenced

| File                     | Purpose                                |
| ------------------------ | -------------------------------------- |
| `.env.example`           | Environment template                   |
| `.env.local`             | Your local configuration (create this) |
| `package.json`           | Scripts and dependencies               |
| `tsconfig.json`          | TypeScript configuration               |
| `docker-compose.yml`     | Production Docker stack                |
| `docker-compose.dev.yml` | Development Docker stack               |
| `src/app-config/env.ts`  | Environment validation                 |
| `src/database/schema.ts` | Database schema                        |
| `drizzle.config.ts`      | Drizzle configuration                  |

## Performance Tips

### Development Speed

- Use `pnpm dev` with Turbopack for fast refresh
- Use `pnpm dev:debug` with breakpoints
- Use `pnpm type-check:watch` in another terminal

### Build Speed

- Run `pnpm build:analyze` to check bundle size
- Use `pnpm clean` before full rebuild
- Check `.next` directory is not in git

### Database Speed

- Use indexes on frequently queried columns
- Use `pnpm db:studio` to verify queries
- Keep sample data reasonable size

## Security Notes

### AUTH_SECRET

- ⚠️ MUST be 32+ characters
- Generate with: `openssl rand -base64 32`
- Never commit to git (use .env.local)
- Different per environment

### Environment Variables

- ✅ Store in `.env.local` (not in git)
- ✅ Use `.env.example` as template
- ✅ Validate with Zod schemas
- ✅ Check required vars at startup

### Database

- ✅ Use strong passwords in development
- ✅ Rotate credentials in production
- ✅ Use connection pooling
- ✅ Keep backups (`pnpm db:backup`)

## Getting Help

### First Steps

1. Check this SETUP.md document
2. Search for your error in Troubleshooting
3. Check `pnpm dev` output for detailed errors

### If Still Stuck

1. Check logs: `docker compose logs`
2. Check database: `pnpm db:studio`
3. Run validation: `pnpm validate`
4. Ask on Discord/Slack

---

**Last Updated**: December 15, 2025 **Status**: ✅ Complete and verified **Ready
for**: Immediate use

See full SETUP.md for complete documentation.
