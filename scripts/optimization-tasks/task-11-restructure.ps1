#!/usr/bin/env pwsh
# Task 11: Folder Restructure & Cleanup

param([switch]$DryRun)

Write-Host "Task 11: Folder Restructure & Cleanup" -ForegroundColor Cyan

if (-not $DryRun) {
    Write-Host "  Cleaning up backup files..." -ForegroundColor Yellow
    
    $backupFiles = Get-ChildItem -Recurse -Filter "*.backup" -File
    $backupCount = ($backupFiles | Measure-Object).Count
    
    if ($backupCount -gt 0) {
        Write-Host "  Found $backupCount .backup files" -ForegroundColor Gray
        # Keep recent backups, remove old ones
        $oldBackups = $backupFiles | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) }
        foreach ($file in $oldBackups) {
            Remove-Item $file.FullName -Force
        }
        Write-Host "  ✓ Cleaned old backup files" -ForegroundColor Green
    }
    
    Write-Host "  ✓ Cleanup complete" -ForegroundColor Green
} else {
    Write-Host "  DRY RUN: Would restructure and cleanup" -ForegroundColor Gray
}
