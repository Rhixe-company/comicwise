# Package.json Scripts - Quick Reference

## 🚀 Most Used Commands

```bash
# Development
pnpm dev                      # Start dev server
pnpm build                    # Build for production
pnpm start                    # Start production server

# Database
pnpm db:push                  # Push schema changes
pnpm db:seed                  # Seed database
pnpm db:reset                 # Reset + seed
pnpm db:studio                # Open Drizzle Studio

# Code Quality
pnpm lint:fix                 # Fix linting issues
pnpm format                   # Format code
pnpm type-check               # Check types
pnpm validate                 # Run all checks

# Testing
pnpm test                     # Run E2E tests
pnpm test:unit                # Run unit tests
pnpm test:ui                  # Interactive test UI
```

## 📦 Complete List (100+ Scripts)

### Development (4)
- `dev`, `dev:debug`, `dev:https`, `dev:turbo`

### Build & Production (8)
- `build`, `build:analyze`, `build:debug`, `build:profile`, `start`, `preview`

### Database (17)
- `db:generate`, `db:migrate`, `db:push`, `db:studio`, `db:reset`, `db:seed` + variants

### Redis & Cache (6)
- `redis:start`, `redis:cli`, `cache:clear`, `cache:stats`

### Queue & Jobs (6)
- `queue:worker`, `queue:dashboard`, `qstash:test`, `workflow:test`

### Testing (20+)
- `test`, `test:ui`, `test:unit`, + browser variants

### Code Quality (13)
- `lint`, `lint:fix`, `format`, `type-check`, `validate`

### CI/CD (6)
- `ci`, `ci:full`, `ci:build`, `ci:test`

### Docker (12)
- `docker:up`, `docker:down`, `docker:dev`, `docker:prod`

### Upload (7)
- `upload:bulk`, `upload:bulk:imagekit`, `upload:comics`

### Health & Monitoring (4)
- `health:check`, `health:db`, `health:redis`, `health:all`

## 🔥 Common Workflows

### First Time Setup
```bash
pnpm install && pnpm setup && pnpm dev
```

### Daily Development
```bash
pnpm dev                    # Terminal 1: Dev server
pnpm test:unit:watch        # Terminal 2: Tests
pnpm db:studio              # Terminal 3: Database GUI
```

### Before Commit
```bash
pnpm validate && pnpm test:unit:run
```

### Database Management
```bash
pnpm db:reset              # Quick reset
pnpm db:seed --skip-images # Fast seed
pnpm db:backup             # Backup data
```

### Docker Development
```bash
pnpm docker:dev            # Start all services
pnpm redis:cli             # Access Redis
pnpm docker:logs:app       # View app logs
```

### Production Deploy
```bash
pnpm validate && pnpm build && pnpm deploy:vercel
```

### Upload Images
```bash
pnpm upload:bulk:dry-run   # Preview
pnpm upload:bulk:imagekit  # Upload to ImageKit
```

### Clean & Reset
```bash
pnpm clean:all             # Remove everything
pnpm install               # Reinstall
pnpm db:reset:hard         # Full DB reset
```

## 🎯 Quick Actions

| Need to... | Run |
|------------|-----|
| Start development | `pnpm dev` |
| Run tests | `pnpm test:ui` |
| Fix code issues | `pnpm lint:fix && pnpm format` |
| Check everything | `pnpm validate` |
| Reset database | `pnpm db:reset` |
| View database | `pnpm db:studio` |
| Upload images | `pnpm upload:bulk` |
| Check health | `pnpm health:all` |
| Start worker | `pnpm queue:worker` |
| Clean cache | `pnpm cache:clear` |
| Docker dev | `pnpm docker:dev` |
| Build for prod | `pnpm build` |

## 📚 Documentation

- **Full Reference**: `docs/SCRIPTS_REFERENCE.md`
- **Upload Tool**: `docs/BULK_UPLOAD.md`
- **Database Seed**: `src/database/seed/README.md`

## 💡 Tips

**Use tab completion**: Type `pnpm ` and press Tab to see all available scripts.

**Chain commands**: `pnpm clean && pnpm install && pnpm build`

**Parallel execution**: Use `&` for background: `pnpm dev & pnpm queue:worker`

**Debug mode**: Add `--verbose` or `--debug` to most scripts.

**Environment**: Most scripts auto-load `.env.local`.

## 🆘 Troubleshooting

```bash
# Nothing works?
pnpm clean:all && pnpm install

# Database issues?
pnpm health:db && pnpm db:reset

# Redis issues?
pnpm health:redis && pnpm redis:start

# Type errors?
pnpm type-check

# Tests failing?
pnpm test:debug

# Build issues?
pnpm clean && pnpm build:debug
```

## ⚡ Pro Shortcuts

Create shell aliases for frequently used commands:

```bash
# Add to ~/.bashrc or ~/.zshrc
alias pd='pnpm dev'
alias pb='pnpm build'
alias pt='pnpm test:ui'
alias pl='pnpm lint:fix'
alias pv='pnpm validate'
alias pdr='pnpm db:reset'
alias pds='pnpm db:studio'
```

---

**Total Scripts: 100+** | **Categories: 12** | **Documentation: Complete**
