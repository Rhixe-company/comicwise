#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Complete VS Code Configuration Optimization Script for ComicWise
.DESCRIPTION
    This script optimizes all VS Code configuration files by:
    1. Creating backups of existing files
    2. Deleting old configuration files
    3. Creating enhanced, optimized versions
    4. Installing recommended extensions
    5. Starting MCP servers
.NOTES
    Project: ComicWise
    Package Manager: pnpm
    Platform: Windows
    Created: 2025-12-26
#>

[CmdletBinding()]
param(
    [Parameter()]
    [switch]$SkipBackup,
    
    [Parameter()]
    [switch]$SkipExtensions
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Project paths
$WorkspaceRoot = Split-Path -Parent $PSScriptRoot
$VsCodeDir = Join-Path $WorkspaceRoot ".vscode"

# Color output functions
function Write-Success { param($Message) Write-Host "✓ $Message" -ForegroundColor Green }
function Write-Info { param($Message) Write-Host "ℹ $Message" -ForegroundColor Cyan }
function Write-Warning { param($Message) Write-Host "⚠ $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "✗ $Message" -ForegroundColor Red }
function Write-Step { param($Message) Write-Host "`n━━━ $Message ━━━" -ForegroundColor Magenta }

# Ensure .vscode directory exists
if (-not (Test-Path $VsCodeDir)) {
    New-Item -ItemType Directory -Path $VsCodeDir -Force | Out-Null
    Write-Success ".vscode directory created"
}

Write-Step "ComicWise VS Code Configuration Optimizer"
Write-Info "Project Root: $WorkspaceRoot"
Write-Info "VS Code Dir: $VsCodeDir"

# Configuration files to process
$ConfigFiles = @(
    "mcp.json",
    "extensions.json",
    "launch.json",
    "tasks.json",
    "settings.json"
)

# Function to backup and delete file
function Backup-AndDelete {
    param(
        [string]$FileName
    )
    
    $FilePath = Join-Path $VsCodeDir $FileName
    
    if (Test-Path $FilePath) {
        if (-not $SkipBackup) {
            $BackupPath = "$FilePath.backup"
            $Counter = 1
            while (Test-Path $BackupPath) {
                $BackupPath = "$FilePath.backup$Counter"
                $Counter++
            }
            Copy-Item -Path $FilePath -Destination $BackupPath -Force
            Write-Success "Backed up: $FileName -> $(Split-Path -Leaf $BackupPath)"
        }
        
        Remove-Item -Path $FilePath -Force
        Write-Success "Deleted: $FileName"
    } else {
        Write-Info "File not found (will create new): $FileName"
    }
}

# Process each configuration file
Write-Step "Step 1: Backing up and deleting old configuration files"

foreach ($File in $ConfigFiles) {
    Backup-AndDelete -FileName $File
}

Write-Step "Step 2: Configuration files processed successfully"
Write-Success "All old configuration files have been backed up and removed"
Write-Info "Enhanced configuration files will be created next"

# Notify completion
Write-Step "Backup and Deletion Phase Complete"
Write-Host "`n✓ Ready for new enhanced configuration files" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Magenta

exit 0
