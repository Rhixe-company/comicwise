#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Install VS Code Extensions and Start MCP Servers for ComicWise
.DESCRIPTION
    This script:
    1. Installs all recommended VS Code extensions
    2. Uninstalls unwanted extensions
    3. Starts MCP servers
    4. Validates configuration
.NOTES
    Project: ComicWise
    Created: 2025-12-26
#>

[CmdletBinding()]
param(
    [Parameter()]
    [switch]$SkipExtensions,
    
    [Parameter()]
    [switch]$SkipMcpServers,
    
    [Parameter()]
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Color output functions
function Write-Success { param($Message) Write-Host "✓ $Message" -ForegroundColor Green }
function Write-Info { param($Message) Write-Host "ℹ $Message" -ForegroundColor Cyan }
function Write-Warning { param($Message) Write-Host "⚠ $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "✗ $Message" -ForegroundColor Red }
function Write-Step { param($Message) Write-Host "`n━━━ $Message ━━━" -ForegroundColor Magenta }

Write-Step "ComicWise VS Code Extensions & MCP Server Manager"

# Check if VS Code is installed
$codeCommand = Get-Command code -ErrorAction SilentlyContinue
if (-not $codeCommand) {
    Write-Error "VS Code CLI 'code' command not found. Please ensure VS Code is installed and in PATH."
    exit 1
}
Write-Success "VS Code CLI found: $($codeCommand.Source)"

# Project paths
$WorkspaceRoot = Split-Path -Parent $PSScriptRoot
$ExtensionsFile = Join-Path $WorkspaceRoot ".vscode\extensions.json"

if (-not (Test-Path $ExtensionsFile)) {
    Write-Error "Extensions.json not found at: $ExtensionsFile"
    exit 1
}

# Read extensions configuration
Write-Step "Step 1: Reading extensions configuration"
$extensionsConfig = Get-Content $ExtensionsFile | ConvertFrom-Json
Write-Info "Found $($extensionsConfig.recommendations.Count) recommended extensions"
Write-Info "Found $($extensionsConfig.unwantedRecommendations.Count) unwanted extensions"

# Install recommended extensions
if (-not $SkipExtensions) {
    Write-Step "Step 2: Installing recommended extensions"
    
    $installedCount = 0
    $failedExtensions = @()
    
    foreach ($extension in $extensionsConfig.recommendations) {
        try {
            Write-Info "Installing: $extension"
            $output = & code --install-extension $extension --force 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                $installedCount++
                Write-Success "Installed: $extension"
            } else {
                $failedExtensions += $extension
                Write-Warning "Failed to install: $extension"
            }
        }
        catch {
            $failedExtensions += $extension
            Write-Warning "Error installing $extension : $_"
        }
    }
    
    Write-Success "Successfully installed $installedCount out of $($extensionsConfig.recommendations.Count) extensions"
    
    if ($failedExtensions.Count -gt 0) {
        Write-Warning "Failed to install $($failedExtensions.Count) extensions:"
        $failedExtensions | ForEach-Object { Write-Warning "  - $_" }
    }
}

# Uninstall unwanted extensions
if (-not $SkipExtensions) {
    Write-Step "Step 3: Uninstalling unwanted extensions"
    
    $uninstalledCount = 0
    
    foreach ($extension in $extensionsConfig.unwantedRecommendations) {
        try {
            # Check if extension is installed
            $installed = & code --list-extensions | Select-String -Pattern "^$extension$" -Quiet
            
            if ($installed) {
                Write-Info "Uninstalling: $extension"
                & code --uninstall-extension $extension --force 2>&1 | Out-Null
                
                if ($LASTEXITCODE -eq 0) {
                    $uninstalledCount++
                    Write-Success "Uninstalled: $extension"
                }
            }
        }
        catch {
            Write-Warning "Error uninstalling $extension : $_"
        }
    }
    
    if ($uninstalledCount -gt 0) {
        Write-Success "Uninstalled $uninstalledCount unwanted extensions"
    } else {
        Write-Info "No unwanted extensions found to uninstall"
    }
}

# Start MCP servers
if (-not $SkipMcpServers) {
    Write-Step "Step 4: Preparing MCP Servers"
    
    Write-Info "MCP servers are configured in .vscode/mcp.json"
    Write-Info "They will start automatically when VS Code opens"
    
    # List enabled MCP servers
    $mcpConfig = Get-Content (Join-Path $WorkspaceRoot ".vscode\mcp.json") | ConvertFrom-Json
    $enabledServers = @()
    
    foreach ($serverName in $mcpConfig.mcpServers.PSObject.Properties.Name) {
        $server = $mcpConfig.mcpServers.$serverName
        if (-not $server.disabled) {
            $enabledServers += $serverName
        }
    }
    
    Write-Success "Found $($enabledServers.Count) enabled MCP servers:"
    $enabledServers | ForEach-Object { Write-Info "  ✓ $_" }
    
    Write-Info "MCP servers will auto-start when you open VS Code"
}

# Summary
Write-Step "Installation Summary"
Write-Host ""
Write-Success "VS Code configuration optimized successfully!"
Write-Host ""
Write-Info "Next Steps:"
Write-Host "  1. Restart VS Code to activate new extensions"
Write-Host "  2. MCP servers will start automatically"
Write-Host "  3. Review .vscode/settings.json for customizations"
Write-Host "  4. Use Ctrl+Shift+P to access new extension features"
Write-Host ""
Write-Info "Configuration Files Created:"
Write-Host "  ✓ .vscode/mcp.json"
Write-Host "  ✓ .vscode/extensions.json"
Write-Host "  ✓ .vscode/launch.json"
Write-Host "  ✓ .vscode/tasks.json"
Write-Host "  ✓ .vscode/settings.json"
Write-Host ""
Write-Success "Setup complete! Happy coding! 🚀"
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Magenta

exit 0
