# ═══════════════════════════════════════════════════
# COMPREHENSIVE PROJECT OPTIMIZATION MASTER SCRIPT
# ═══════════════════════════════════════════════════

Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     COMPREHENSIVE PROJECT OPTIMIZATION - ComicWise          ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$ErrorActionPreference = "Continue"
$startTime = Get-Date

# Progress counter
$currentTask = 0
$totalTasks = 10

function Show-Progress {
    param([string]$TaskName)
    $script:currentTask++
    Write-Host "`n[$script:currentTask/$totalTasks] $TaskName..." -ForegroundColor Yellow
}

# Task 1: Format code first
Show-Progress "Formatting code"
pnpm format
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Code formatted" -ForegroundColor Green
}

# Task 2: Optimize imports
Show-Progress "Optimizing import paths"
pnpm imports:optimize
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Import paths optimized" -ForegroundColor Green
}

# Task 3: Fix linting issues
Show-Progress "Fixing linting issues"
pnpm lint:fix
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Linting issues fixed" -ForegroundColor Green
} else {
    Write-Host "⚠ Some linting issues remain - review manually" -ForegroundColor Yellow
}

# Task 4: Format again after lint fixes
Show-Progress "Re-formatting after lint fixes"
pnpm format
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Code re-formatted" -ForegroundColor Green
}

# Task 5: Type check
Show-Progress "Running type check"
pnpm type-check
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Type check passed" -ForegroundColor Green
} else {
    Write-Host "⚠ Type errors found - review manually" -ForegroundColor Yellow
}

# Task 6: Run unit tests
Show-Progress "Running unit tests"
pnpm test:unit:run
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Unit tests passed" -ForegroundColor Green
} else {
    Write-Host "⚠ Some tests failed - review manually" -ForegroundColor Yellow
}

# Task 7: Clean cache
Show-Progress "Cleaning cache"
pnpm clean:cache
Write-Host "✓ Cache cleaned" -ForegroundColor Green

# Task 8: Database check
Show-Progress "Checking database configuration"
pnpm db:check 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database configuration OK" -ForegroundColor Green
} else {
    Write-Host "⚠ Database check skipped or failed" -ForegroundColor Yellow
}

# Task 9: Build project
Show-Progress "Building project"
pnpm build 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Build successful" -ForegroundColor Green
} else {
    Write-Host "⚠ Build failed - review errors manually" -ForegroundColor Yellow
}

# Task 10: Final validation
Show-Progress "Running final validation"
pnpm validate:quick
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Validation passed" -ForegroundColor Green
} else {
    Write-Host "⚠ Validation issues - review manually" -ForegroundColor Yellow
}

# Calculate duration
$endTime = Get-Date
$duration = $endTime - $startTime

Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                  Optimization Complete                       ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "Duration: $($duration.Minutes) minutes $($duration.Seconds) seconds" -ForegroundColor Cyan
Write-Host "✅ Project optimization completed!`n" -ForegroundColor Green

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review any warnings above" -ForegroundColor Gray
Write-Host "  2. Run 'pnpm dev' to start development server" -ForegroundColor Gray
Write-Host "  3. Check http://localhost:3000" -ForegroundColor Gray
