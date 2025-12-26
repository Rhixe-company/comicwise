#!/usr/bin/env pwsh
# Task 12: Fix Type/Lint Errors

param([switch]$DryRun)

Write-Host "Task 12: Fix Type & Lint Errors" -ForegroundColor Cyan

if (-not $DryRun) {
    Write-Host "  Running ESLint fix..." -ForegroundColor Yellow
    pnpm lint:fix 2>&1 | Out-Null
    Write-Host "  ✓ ESLint fixes applied" -ForegroundColor Green
    
    Write-Host "  Running type check..." -ForegroundColor Yellow
    $typeCheck = pnpm type-check 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Type check passed" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Type errors found - manual review needed" -ForegroundColor Yellow
    }
} else {
    Write-Host "  DRY RUN: Would fix type and lint errors" -ForegroundColor Gray
}
