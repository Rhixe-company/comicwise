# PowerShell Aliases for ComicWise Scripts
# Add to your PowerShell profile: $PROFILE
# To edit: notepad $PROFILE

# ═══════════════════════════════════════════════════════════════════════════
# Development
# ═══════════════════════════════════════════════════════════════════════════
function pd { pnpm dev }
function pb { pnpm build }
function ps { pnpm start }
function pv { pnpm preview }

# ═══════════════════════════════════════════════════════════════════════════
# Database
# ═══════════════════════════════════════════════════════════════════════════
function pdb { pnpm db:studio }
function pdp { pnpm db:push }
function pdr { pnpm db:reset }
function pds { pnpm db:seed }
function pdsn { pnpm db:seed --skip-images }
function pdrh { pnpm db:reset:hard }

# ═══════════════════════════════════════════════════════════════════════════
# Testing
# ═══════════════════════════════════════════════════════════════════════════
function pt { pnpm test }
function ptu { pnpm test:unit }
function ptw { pnpm test:unit:watch }
function pti { pnpm test:ui }
function ptd { pnpm test:debug }
function ptc { pnpm test:unit:coverage }

# ═══════════════════════════════════════════════════════════════════════════
# Code Quality
# ═══════════════════════════════════════════════════════════════════════════
function pl { pnpm lint }
function plf { pnpm lint:fix }
function pf { pnpm format }
function ptc { pnpm type-check }
function pval { pnpm validate }
function pvalq { pnpm validate:quick }

# ═══════════════════════════════════════════════════════════════════════════
# Docker
# ═══════════════════════════════════════════════════════════════════════════
function pdup { pnpm docker:up }
function pddown { pnpm docker:down }
function pddev { pnpm docker:dev }
function pdlogs { pnpm docker:logs }
function pdla { pnpm docker:logs:app }
function pdldb { pnpm docker:logs:db }
function pdsh { pnpm docker:shell }

# ═══════════════════════════════════════════════════════════════════════════
# Redis & Cache
# ═══════════════════════════════════════════════════════════════════════════
function prs { pnpm redis:start }
function prst { pnpm redis:stop }
function prc { pnpm redis:cli }
function pcc { pnpm cache:clear }
function pcs { pnpm cache:stats }

# ═══════════════════════════════════════════════════════════════════════════
# Health & Monitoring
# ═══════════════════════════════════════════════════════════════════════════
function phc { pnpm health:check }
function pha { pnpm health:all }
function phdb { pnpm health:db }
function phr { pnpm health:redis }

# ═══════════════════════════════════════════════════════════════════════════
# Queue & Workers
# ═══════════════════════════════════════════════════════════════════════════
function pqw { pnpm queue:worker }
function pqd { pnpm queue:dashboard }
function pqs { pnpm queue:stats }

# ═══════════════════════════════════════════════════════════════════════════
# Upload
# ═══════════════════════════════════════════════════════════════════════════
function pub { pnpm upload:bulk }
function pubd { pnpm upload:bulk:dry-run }
function pubi { pnpm upload:bulk:imagekit }
function pubc { pnpm upload:bulk:cloudinary }

# ═══════════════════════════════════════════════════════════════════════════
# Utilities
# ═══════════════════════════════════════════════════════════════════════════
function pcl { pnpm clean }
function pcla { pnpm clean:all }
function pclc { pnpm clean:cache }
function pup { pnpm update-deps }
function paud { pnpm audit }

# ═══════════════════════════════════════════════════════════════════════════
# Compound Commands (Workflows)
# ═══════════════════════════════════════════════════════════════════════════

function psetup { pnpm install; pnpm db:push; pnpm db:seed; pnpm dev }
function prefresh { pnpm clean:all; pnpm install; pnpm db:reset; pnpm build }
function pcheck { pnpm lint:fix; pnpm format; pnpm type-check; pnpm test:unit:run }
function pfull { pnpm validate; pnpm test:unit:run; pnpm build }

# ═══════════════════════════════════════════════════════════════════════════
# Installation Instructions
# ═══════════════════════════════════════════════════════════════════════════

# 1. Open PowerShell as Administrator
# 2. Run: notepad $PROFILE
# 3. Copy the contents of this file into your profile
# 4. Save and close
# 5. Run: . $PROFILE (or restart PowerShell)

# If you get execution policy errors:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# ═══════════════════════════════════════════════════════════════════════════
# Usage Examples
# ═══════════════════════════════════════════════════════════════════════════

# Start development:          pd
# Run tests:                  pti
# Fix code:                   plf; pf
# Check database:             phdb
# Reset database:             pdr
# Upload images:              pub
# Check everything:           pval

# ═══════════════════════════════════════════════════════════════════════════

Write-Host "✅ ComicWise aliases loaded! Use Tab completion to discover commands." -ForegroundColor Green
