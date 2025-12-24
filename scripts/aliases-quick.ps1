# ═══════════════════════════════════════════════════
# COMICWISE - ENHANCED POWERSHELL ALIASES
# ═══════════════════════════════════════════════════
# Quick shortcuts for common commands

# Development
Set-Alias -Name dev -Value { pnpm dev } -Scope Global
Set-Alias -Name build -Value { pnpm build } -Scope Global
Set-Alias -Name tc -Value { pnpm type-check } -Scope Global

# Database
function dbpush { pnpm db:push }
function dbseed { pnpm db:seed }
function dbreset { pnpm db:reset }
function dbstudio { pnpm db:studio }

# Scripts
function optimize { .\scripts\optimize-project.ps1 }
function scaffold { pnpm tsx scripts/scaffold-enhanced.ts }

Write-Host "✅ ComicWise aliases loaded!" -ForegroundColor Green
