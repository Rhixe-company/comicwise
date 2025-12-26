#!/usr/bin/env pwsh
# Task 4: Replace Any Types

param([switch]$DryRun)

Write-Host "Task 4: Replace Any Types (Auto-detection)" -ForegroundColor Cyan

if (-not $DryRun) {
    Write-Host "  Scanning for 'any' types..." -ForegroundColor Yellow
    
    $anyCount = (Select-String -Path "src\**\*.ts","src\**\*.tsx" -Pattern "\bany\b" | Measure-Object).Count
    
    Write-Host "  Found $anyCount instances of 'any' type" -ForegroundColor Gray
    Write-Host "  ℹ Manual review required for safe replacement" -ForegroundColor Cyan
    Write-Host "  ✓ Analysis complete" -ForegroundColor Green
} else {
    Write-Host "  DRY RUN: Would scan and analyze any types" -ForegroundColor Gray
}
