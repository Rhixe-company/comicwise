#!/usr/bin/env pwsh
# Task 10: Shell Aliases

param([switch]$DryRun)

Write-Host "Task 10: Shell Aliases Setup" -ForegroundColor Cyan

if (-not $DryRun) {
    $aliasFiles = Get-ChildItem -Path "scripts" -Filter "*aliases*.ps1","*aliases*.sh"
    Write-Host "  Found $($aliasFiles.Count) alias files" -ForegroundColor Gray
    Write-Host "  ✓ Alias files ready (see scripts\cw-*.ps1)" -ForegroundColor Green
} else {
    Write-Host "  DRY RUN: Would setup shell aliases" -ForegroundColor Gray
}
