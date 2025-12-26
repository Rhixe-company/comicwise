#!/usr/bin/env pwsh
# Task 3: Type System Consolidation

param([switch]$DryRun)

Write-Host "Task 3: Type System Consolidation" -ForegroundColor Cyan

$typesDir = "src\types"
$indexFile = Join-Path $typesDir "index.ts"

if (-not $DryRun) {
    $typeFiles = Get-ChildItem -Path $typesDir -Filter "*.ts" -Exclude "index.ts"
    
    $exports = @()
    $exports += "// ComicWise Type System - Barrel Exports"
    $exports += "// Auto-generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    $exports += ""
    
    $exports += "// Core Types"
    foreach ($file in $typeFiles) {
        $name = $file.BaseName
        $exports += "export * from './$name';"
    }
    
    $exports += ""
    $exports += "// Convenience Re-exports"
    $exports += "export type { User } from './database';"
    $exports += "export type { ApiResponse, ApiError } from './Api';"
    
    if (Test-Path $indexFile) {
        Copy-Item -Path $indexFile -Destination "$indexFile.backup" -Force
    }
    
    Set-Content -Path $indexFile -Value ($exports -join "`n") -Encoding UTF8
    Write-Host "  ✓ Consolidated $($typeFiles.Count) type files" -ForegroundColor Green
} else {
    Write-Host "  DRY RUN: Would consolidate type system" -ForegroundColor Gray
}
