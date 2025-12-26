#!/usr/bin/env pwsh
# Task 1: VSCode Configuration Optimization

param([switch]$DryRun)

$timestamp = Get-Date -Format "yyyy-MM-dd-HHmmss"
$vscodeDir = ".vscode"

Write-Host "Task 1: VSCode Configuration Optimization" -ForegroundColor Cyan

if (-not $DryRun) {
    $configs = @("mcp.json", "extensions.json", "launch.json")
    
    foreach ($config in $configs) {
        $source = Join-Path $vscodeDir $config
        if (Test-Path $source) {
            $backup = "$source.backup"
            Copy-Item -Path $source -Destination $backup -Force
            Write-Host "  ✓ Backed up: $config" -ForegroundColor Green
        }
    }
    
    # Apply enhanced versions
    $enhanced = @{
        "mcp.enhanced.json" = "mcp.json"
        "extensions.enhanced.json" = "extensions.json"
        "launch.enhanced.json" = "launch.json"
    }
    
    foreach ($pair in $enhanced.GetEnumerator()) {
        $source = Join-Path $vscodeDir $pair.Key
        $target = Join-Path $vscodeDir $pair.Value
        
        if (Test-Path $source) {
            Copy-Item -Path $source -Destination $target -Force
            Write-Host "  ✓ Applied: $($pair.Value)" -ForegroundColor Green
        }
    }
} else {
    Write-Host "  DRY RUN: Would update VSCode configs" -ForegroundColor Gray
}
