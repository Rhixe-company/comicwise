# ═══════════════════════════════════════════════════════════════════════════
# ComicWise Shell Aliases - PowerShell Profile
# ═══════════════════════════════════════════════════════════════════════════
# Installation:
#   1. Add this to your PowerShell profile:
#      . C:\path\to\comicwise\scripts\aliases-comicwise.ps1
#   2. Or run: echo ". $(Get-Location)\scripts\aliases-comicwise.ps1" >> $PROFILE
# ═══════════════════════════════════════════════════════════════════════════

Write-Host "Loading ComicWise aliases..." -ForegroundColor Cyan

# ═══════════════════════════════════════════════════
# CORE COMMANDS
# ═══════════════════════════════════════════════════

function cw { pnpm @args }
function cwd { pnpm dev @args }
function cwb { pnpm build @args }
function cws { pnpm start @args }
function cwt { pnpm test @args }

# ═══════════════════════════════════════════════════
# DEVELOPMENT
# ═══════════════════════════════════════════════════

function cw:dev { pnpm dev --turbopack }
function cw:dev:debug { pnpm dev:debug }
function cw:build { pnpm build }
function cw:build:analyze { pnpm build:analyze }
function cw:clean { pnpm clean }
function cw:clean:all { pnpm clean:all }

# ═══════════════════════════════════════════════════
# DATABASE
# ═══════════════════════════════════════════════════

function cw:db { pnpm db:studio }
function cw:db:push { pnpm db:push }
function cw:db:seed { pnpm db:seed }
function cw:db:reset { pnpm db:reset }
function cw:db:generate { pnpm db:generate }

# ═══════════════════════════════════════════════════
# TYPE CHECKING & LINTING
# ═══════════════════════════════════════════════════

function cw:check { pnpm type-check }
function cw:lint { pnpm lint }
function cw:lint:fix { pnpm lint:fix }
function cw:format { pnpm format }
function cw:validate { pnpm validate }

# ═══════════════════════════════════════════════════
# TESTING
# ═══════════════════════════════════════════════════

function cw:test { pnpm test }
function cw:test:unit { pnpm test:unit }
function cw:test:ui { pnpm test:ui }
function cw:test:e2e { pnpm test }

# ═══════════════════════════════════════════════════
# DOCKER
# ═══════════════════════════════════════════════════

function cw:docker:up { pnpm docker:up }
function cw:docker:down { pnpm docker:down }
function cw:docker:logs { pnpm docker:logs }
function cw:docker:build { pnpm docker:build }
function cw:docker:clean { pnpm docker:clean }

# ═══════════════════════════════════════════════════
# CACHE & REDIS
# ═══════════════════════════════════════════════════

function cw:cache:clear { pnpm cache:clear }
function cw:cache:stats { pnpm cache:stats }
function cw:redis:cli { pnpm redis:cli }
function cw:redis:flush { pnpm redis:flush }

# ═══════════════════════════════════════════════════
# UTILITIES
# ═══════════════════════════════════════════════════

function cw:scaffold { pnpm scaffold @args }
function cw:imports:optimize { pnpm imports:optimize }
function cw:health { pnpm health:all }
function cw:setup { pnpm setup }

# ═══════════════════════════════════════════════════
# QUICK WORKFLOWS
# ═══════════════════════════════════════════════════

function cw:fresh {
  Write-Host "🔄 Fresh setup..." -ForegroundColor Yellow
  pnpm clean
  pnpm install
  pnpm db:reset
  pnpm build
  Write-Host "✅ Fresh setup complete!" -ForegroundColor Green
}

function cw:quick:check {
  Write-Host "🔍 Running quick checks..." -ForegroundColor Yellow
  pnpm type-check
  pnpm lint
  Write-Host "✅ Checks complete!" -ForegroundColor Green
}

function cw:full:check {
  Write-Host "🔍 Running full validation..." -ForegroundColor Yellow
  pnpm validate
  pnpm test:unit:run
  Write-Host "✅ Full validation complete!" -ForegroundColor Green
}

# ═══════════════════════════════════════════════════
# HELP
# ═══════════════════════════════════════════════════

function cw:help {
  Write-Host ""
  Write-Host "═════════════════════════════════════════════════" -ForegroundColor Cyan
  Write-Host "  ComicWise CLI Aliases" -ForegroundColor Cyan
  Write-Host "═════════════════════════════════════════════════" -ForegroundColor Cyan
  Write-Host ""
  Write-Host "CORE:" -ForegroundColor Yellow
  Write-Host "  cw         - Run pnpm commands"
  Write-Host "  cwd        - Start dev server"
  Write-Host "  cwb        - Build project"
  Write-Host "  cws        - Start production server"
  Write-Host "  cwt        - Run tests"
  Write-Host ""
  Write-Host "DATABASE:" -ForegroundColor Yellow
  Write-Host "  cw:db           - Open Drizzle Studio"
  Write-Host "  cw:db:push      - Push schema to DB"
  Write-Host "  cw:db:seed      - Seed database"
  Write-Host "  cw:db:reset     - Reset database"
  Write-Host ""
  Write-Host "QUALITY:" -ForegroundColor Yellow
  Write-Host "  cw:check        - Type check"
  Write-Host "  cw:lint         - Run linter"
  Write-Host "  cw:lint:fix     - Fix lint issues"
  Write-Host "  cw:format       - Format code"
  Write-Host "  cw:validate     - Full validation"
  Write-Host ""
  Write-Host "WORKFLOWS:" -ForegroundColor Yellow
  Write-Host "  cw:fresh        - Fresh install & setup"
  Write-Host "  cw:quick:check  - Quick type & lint check"
  Write-Host "  cw:full:check   - Full validation & tests"
  Write-Host ""
  Write-Host "═════════════════════════════════════════════════" -ForegroundColor Cyan
  Write-Host ""
}

Write-Host "✅ ComicWise aliases loaded! Type 'cw:help' for commands." -ForegroundColor Green
