<#
.SYNOPSIS
    Clean up build artifacts and dependencies
    
.DESCRIPTION
    Removes build artifacts and optionally node_modules and lock files
    
.PARAMETER Full
    Remove node_modules and lock files (full clean)
    
.PARAMETER NodeModules
    Remove only node_modules (legacy parameter, use -Full)
    
.EXAMPLE
    .\cleanup.ps1
    
.EXAMPLE
    .\cleanup.ps1 -Full
#>

param(
    [switch]$Full,
    [switch]$NodeModules
)

$ErrorActionPreference = "Stop"

function Write-Info { Write-Host "ℹ $_" -ForegroundColor Cyan }
function Write-Success { Write-Host "✓ $_" -ForegroundColor Green }
function Write-Warning { Write-Host "⚠ $_" -ForegroundColor Yellow }

Write-Info "Removing build artifacts..."

$buildPaths = @('.next', 'dist', 'out', '.parcel-cache', '.turbo', 'build', 'coverage', '.react-email')
foreach ($path in $buildPaths) {
    if (Test-Path $path) {
        Remove-Item -Recurse -Force $path
        Write-Info "  Removed: $path"
    }
}

if ($Full -or $NodeModules) {
    Write-Warning "Removing node_modules and lock files..."
    
    if (Test-Path 'node_modules') {
        Remove-Item -Recurse -Force 'node_modules'
        Write-Info "  Removed: node_modules"
    }
    
    $lockFiles = @('pnpm-lock.yaml', 'package-lock.json', 'yarn.lock')
    foreach ($lockFile in $lockFiles) {
        if (Test-Path $lockFile) {
            Remove-Item -Force $lockFile
            Write-Info "  Removed: $lockFile"
        }
    }
}

Write-Success "Cleanup complete"
