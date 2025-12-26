#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Installs recommended VSCode extensions for ComicWise project

.DESCRIPTION
    Reads extensions.json and installs all recommended extensions that aren't already installed

.EXAMPLE
    .\install-vscode-extensions.ps1
    
.EXAMPLE
    .\install-vscode-extensions.ps1 -DryRun
#>

param(
    [switch]$DryRun = $false,
    [switch]$Force = $false
)

$ErrorActionPreference = "Continue"

# Colors
function Write-Success { param($msg) Write-Host "✓ $msg" -ForegroundColor Green }
function Write-Info { param($msg) Write-Host "ℹ $msg" -ForegroundColor Cyan }
function Write-Warn { param($msg) Write-Host "⚠ $msg" -ForegroundColor Yellow }
function Write-Fail { param($msg) Write-Host "✗ $msg" -ForegroundColor Red }

Write-Host @"

╔════════════════════════════════════════════════════════════════════════════╗
║                VSCode Extension Installer for ComicWise                    ║
╚════════════════════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

# Check VSCode CLI
try {
    $null = code --version 2>&1
    Write-Success "VSCode CLI found"
} catch {
    Write-Fail "VSCode CLI not found. Please ensure 'code' is in your PATH"
    Write-Info "To add VSCode to PATH, in VSCode press Ctrl+Shift+P and select 'Shell Command: Install code command in PATH'"
    exit 1
}

# Read extensions.json
$extensionsFile = Join-Path $PSScriptRoot ".." ".vscode" "extensions.json"
if (-not (Test-Path $extensionsFile)) {
    Write-Fail "extensions.json not found at: $extensionsFile"
    exit 1
}

try {
    $config = Get-Content $extensionsFile -Raw | ConvertFrom-Json
    $recommended = $config.recommendations
    Write-Success "Loaded $($recommended.Count) recommended extensions"
} catch {
    Write-Fail "Failed to parse extensions.json: $($_.Exception.Message)"
    exit 1
}

# Get installed extensions
Write-Info "Checking installed extensions..."
$installed = @()
try {
    $installed = code --list-extensions 2>&1 | Where-Object { $_ -notmatch "^$" }
    Write-Success "Found $($installed.Count) installed extensions"
} catch {
    Write-Warn "Could not retrieve installed extensions"
}

# Filter extensions to install
$toInstall = $recommended | Where-Object { 
    $ext = $_
    $installed -notcontains $ext
}

if ($toInstall.Count -eq 0) {
    Write-Success "All recommended extensions are already installed!"
    exit 0
}

Write-Info "Found $($toInstall.Count) extensions to install"

if ($DryRun) {
    Write-Warn "DRY RUN MODE - No extensions will be installed"
    Write-Host "`nExtensions that would be installed:" -ForegroundColor Yellow
    $toInstall | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
    exit 0
}

# Install extensions
Write-Info "Installing extensions..."
$success = 0
$failed = 0
$skipped = 0

foreach ($ext in $toInstall) {
    Write-Host "  Installing: $ext" -ForegroundColor Gray -NoNewline
    
    try {
        $output = code --install-extension $ext --force 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host " ✓" -ForegroundColor Green
            $success++
        } else {
            Write-Host " ✗" -ForegroundColor Red
            Write-Warn "    Failed: $output"
            $failed++
        }
    } catch {
        Write-Host " ✗" -ForegroundColor Red
        Write-Warn "    Error: $($_.Exception.Message)"
        $failed++
    }
    
    Start-Sleep -Milliseconds 100
}

# Summary
Write-Host @"

╔════════════════════════════════════════════════════════════════════════════╗
║                         Installation Complete                              ║
╚════════════════════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

Write-Success "$success extensions installed"
if ($failed -gt 0) { Write-Warn "$failed extensions failed" }
Write-Info "Total recommended: $($recommended.Count)"

Write-Host @"

Next steps:
  1. Reload VSCode window: Ctrl+Shift+P → 'Reload Window'
  2. Review installed extensions in Extensions panel (Ctrl+Shift+X)
  3. Configure extension settings as needed

"@ -ForegroundColor Gray

if ($failed -gt 0) {
    Write-Warn "Some extensions failed to install. Try installing them manually from the Extensions panel."
    exit 1
}

exit 0
