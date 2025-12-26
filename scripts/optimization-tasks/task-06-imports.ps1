#!/usr/bin/env pwsh
# Task 6: Import Path Updates

param([switch]$DryRun)

Write-Host "Task 6: Import Path Updates" -ForegroundColor Cyan

if (-not $DryRun) {
    if (Test-Path "scripts\replace-imports.ts") {
        Write-Host "  Running import optimizer..." -ForegroundColor Yellow
        pnpm tsx scripts\replace-imports.ts 2>&1 | Out-Null
        Write-Host "  ✓ Import paths updated" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Import optimizer not found" -ForegroundColor Yellow
    }
} else {
    Write-Host "  DRY RUN: Would update import paths" -ForegroundColor Gray
}
