<#
.SYNOPSIS
    VSCode Configuration Manager for ComicWise Project

.DESCRIPTION
    This script manages VSCode configuration files including:
    - MCP servers validation and startup
    - Extensions installation and validation
    - Launch configurations testing
    - Tasks validation
    - Settings optimization

.PARAMETER Action
    The action to perform: validate, start-mcp, install-extensions, test-launch, optimize, all

.PARAMETER Verbose
    Enable verbose output

.EXAMPLE
    .\manage-vscode-config.ps1 -Action all
    .\manage-vscode-config.ps1 -Action start-mcp -Verbose
    .\manage-vscode-config.ps1 -Action install-extensions

.NOTES
    Author: ComicWise Team
    Version: 1.0.0
    Created: 2025-12-26
    Requires: PowerShell 5.1+, Node.js 22+, pnpm 9+
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('validate', 'start-mcp', 'install-extensions', 'test-launch', 'optimize', 'all', 'help')]
    [string]$Action = 'all'
)

#Requires -Version 5.1

# Script Configuration
$ErrorActionPreference = "Continue"
$ProgressPreference = "SilentlyContinue"

# Project Paths
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$VsCodeDir = Join-Path $ProjectRoot ".vscode"
$LogFile = Join-Path $VsCodeDir "config-manager.log"

# Color Configuration
$Colors = @{
    Success = "Green"
    Error = "Red"
    Warning = "Yellow"
    Info = "Cyan"
    Header = "Magenta"
}

#region Helper Functions

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White",
        [switch]$NoNewline
    )
    
    $params = @{
        ForegroundColor = $Color
        NoNewline = $NoNewline
    }
    Write-Host $Message @params
}

function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "INFO"
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"
    Add-Content -Path $LogFile -Value $logMessage
}

function Write-SectionHeader {
    param([string]$Title)
    
    Write-Host ""
    Write-ColorOutput "═══════════════════════════════════════════════════════════" -Color $Colors.Header
    Write-ColorOutput "  $Title" -Color $Colors.Header
    Write-ColorOutput "═══════════════════════════════════════════════════════════" -Color $Colors.Header
    Write-Host ""
}

function Test-Command {
    param([string]$Command)
    
    try {
        if (Get-Command $Command -ErrorAction SilentlyContinue) {
            return $true
        }
        return $false
    }
    catch {
        return $false
    }
}

function Test-NodePackage {
    param([string]$Package)
    
    try {
        $result = npx --no-install $Package --version 2>$null
        return $true
    }
    catch {
        return $false
    }
}

#endregion

#region Validation Functions

function Test-VsCodeConfigFiles {
    Write-SectionHeader "Validating VSCode Configuration Files"
    
    $configFiles = @(
        "mcp.json",
        "extensions.json",
        "launch.json",
        "tasks.json",
        "settings.json"
    )
    
    $allValid = $true
    
    foreach ($file in $configFiles) {
        $filePath = Join-Path $VsCodeDir $file
        
        if (Test-Path $filePath) {
            try {
                $content = Get-Content $filePath -Raw | ConvertFrom-Json
                Write-ColorOutput "✅ $file - Valid JSON" -Color $Colors.Success
                Write-Log "$file is valid" -Level "SUCCESS"
            }
            catch {
                Write-ColorOutput "❌ $file - Invalid JSON: $($_.Exception.Message)" -Color $Colors.Error
                Write-Log "$file is invalid: $($_.Exception.Message)" -Level "ERROR"
                $allValid = $false
            }
        }
        else {
            Write-ColorOutput "⚠️  $file - File not found" -Color $Colors.Warning
            Write-Log "$file not found" -Level "WARNING"
            $allValid = $false
        }
    }
    
    if ($allValid) {
        Write-Host ""
        Write-ColorOutput "✨ All configuration files are valid!" -Color $Colors.Success
    }
    else {
        Write-Host ""
        Write-ColorOutput "⚠️  Some configuration files have issues" -Color $Colors.Warning
    }
    
    return $allValid
}

function Test-Prerequisites {
    Write-SectionHeader "Checking Prerequisites"
    
    $prerequisites = @{
        "Node.js" = "node"
        "pnpm" = "pnpm"
        "npx" = "npx"
        "Git" = "git"
    }
    
    $allPresent = $true
    
    foreach ($prereq in $prerequisites.GetEnumerator()) {
        if (Test-Command $prereq.Value) {
            $version = & $prereq.Value --version 2>$null
            Write-ColorOutput "✅ $($prereq.Key): $version" -Color $Colors.Success
        }
        else {
            Write-ColorOutput "❌ $($prereq.Key): Not found" -Color $Colors.Error
            $allPresent = $false
        }
    }
    
    return $allPresent
}

#endregion

#region MCP Server Functions

function Start-McpServers {
    Write-SectionHeader "Starting MCP Servers"
    
    $mcpConfigPath = Join-Path $VsCodeDir "mcp.json"
    
    if (-not (Test-Path $mcpConfigPath)) {
        Write-ColorOutput "❌ mcp.json not found" -Color $Colors.Error
        return $false
    }
    
    try {
        $mcpConfig = Get-Content $mcpConfigPath -Raw | ConvertFrom-Json
        $servers = $mcpConfig.mcpServers.PSObject.Properties
        
        Write-ColorOutput "📋 Found $($servers.Count) MCP server configurations" -Color $Colors.Info
        Write-Host ""
        
        $enabledServers = $servers | Where-Object { -not $_.Value.disabled }
        $disabledServers = $servers | Where-Object { $_.Value.disabled }
        
        Write-ColorOutput "🟢 Enabled servers: $($enabledServers.Count)" -Color $Colors.Success
        Write-ColorOutput "🔴 Disabled servers: $($disabledServers.Count)" -Color $Colors.Warning
        Write-Host ""
        
        foreach ($server in $enabledServers) {
            $serverName = $server.Name
            $serverConfig = $server.Value
            
            Write-ColorOutput "🚀 Checking $serverName..." -Color $Colors.Info -NoNewline
            
            # Check if the server package is available
            $packageName = $serverConfig.args[1] -replace "@latest", ""
            
            try {
                # Validate that npx can find the package
                $testResult = npx --yes --no $packageName --help 2>&1
                Write-ColorOutput " ✅" -Color $Colors.Success
                Write-Log "MCP server '$serverName' is available" -Level "SUCCESS"
            }
            catch {
                Write-ColorOutput " ⚠️  (Package may need to be installed on first use)" -Color $Colors.Warning
                Write-Log "MCP server '$serverName' package check: $($_.Exception.Message)" -Level "WARNING"
            }
        }
        
        Write-Host ""
        Write-ColorOutput "💡 MCP servers will be started automatically by VSCode Copilot" -Color $Colors.Info
        Write-ColorOutput "💡 To manually test a server, use: npx -y <package-name>" -Color $Colors.Info
        
        return $true
    }
    catch {
        Write-ColorOutput "❌ Error processing mcp.json: $($_.Exception.Message)" -Color $Colors.Error
        Write-Log "MCP server startup error: $($_.Exception.Message)" -Level "ERROR"
        return $false
    }
}

#endregion

#region Extension Functions

function Get-RecommendedExtensions {
    $extensionsPath = Join-Path $VsCodeDir "extensions.json"
    
    if (-not (Test-Path $extensionsPath)) {
        Write-ColorOutput "❌ extensions.json not found" -Color $Colors.Error
        return @()
    }
    
    try {
        $extensionsConfig = Get-Content $extensionsPath -Raw | ConvertFrom-Json
        return $extensionsConfig.recommendations
    }
    catch {
        Write-ColorOutput "❌ Error reading extensions.json: $($_.Exception.Message)" -Color $Colors.Error
        return @()
    }
}

function Install-RecommendedExtensions {
    Write-SectionHeader "Installing Recommended Extensions"
    
    # Check if code CLI is available
    if (-not (Test-Command "code")) {
        Write-ColorOutput "❌ VSCode CLI 'code' command not found" -Color $Colors.Error
        Write-ColorOutput "💡 Add VSCode to PATH or run VSCode and install from Extensions panel" -Color $Colors.Info
        return $false
    }
    
    $extensions = Get-RecommendedExtensions
    
    if ($extensions.Count -eq 0) {
        Write-ColorOutput "⚠️  No extensions found to install" -Color $Colors.Warning
        return $false
    }
    
    Write-ColorOutput "📦 Found $($extensions.Count) recommended extensions" -Color $Colors.Info
    Write-Host ""
    
    # Get currently installed extensions
    Write-ColorOutput "🔍 Checking installed extensions..." -Color $Colors.Info
    $installedExtensions = code --list-extensions
    
    $toInstall = @()
    $alreadyInstalled = @()
    
    foreach ($ext in $extensions) {
        if ($installedExtensions -contains $ext) {
            $alreadyInstalled += $ext
        }
        else {
            $toInstall += $ext
        }
    }
    
    Write-Host ""
    Write-ColorOutput "✅ Already installed: $($alreadyInstalled.Count)" -Color $Colors.Success
    Write-ColorOutput "📥 To install: $($toInstall.Count)" -Color $Colors.Info
    Write-Host ""
    
    if ($toInstall.Count -eq 0) {
        Write-ColorOutput "🎉 All recommended extensions are already installed!" -Color $Colors.Success
        return $true
    }
    
    Write-ColorOutput "Installing missing extensions..." -Color $Colors.Info
    Write-Host ""
    
    $installed = 0
    $failed = 0
    
    foreach ($ext in $toInstall) {
        Write-ColorOutput "📦 Installing $ext..." -Color $Colors.Info -NoNewline
        
        try {
            $result = code --install-extension $ext --force 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-ColorOutput " ✅" -Color $Colors.Success
                $installed++
                Write-Log "Installed extension: $ext" -Level "SUCCESS"
            }
            else {
                Write-ColorOutput " ❌" -Color $Colors.Error
                $failed++
                Write-Log "Failed to install extension: $ext" -Level "ERROR"
            }
        }
        catch {
            $errorMsg = $_.Exception.Message
            Write-ColorOutput " ❌ $errorMsg" -Color $Colors.Error
            $failed++
            Write-Log "Error installing extension ${ext}: $errorMsg" -Level "ERROR"
        }
    }
    
    Write-Host ""
    Write-ColorOutput "✅ Installed: $installed" -Color $Colors.Success
    Write-ColorOutput "❌ Failed: $failed" -Color $Colors.Error
    
    if ($failed -eq 0) {
        Write-Host ""
        Write-ColorOutput "🎉 All extensions installed successfully!" -Color $Colors.Success
        Write-ColorOutput "💡 Restart VSCode to activate new extensions" -Color $Colors.Info
    }
    
    return ($failed -eq 0)
}

#endregion

#region Launch Configuration Functions

function Test-LaunchConfigurations {
    Write-SectionHeader "Testing Launch Configurations"
    
    $launchPath = Join-Path $VsCodeDir "launch.json"
    
    if (-not (Test-Path $launchPath)) {
        Write-ColorOutput "❌ launch.json not found" -Color $Colors.Error
        return $false
    }
    
    try {
        $launchConfig = Get-Content $launchPath -Raw | ConvertFrom-Json
        
        Write-ColorOutput "📋 Found $($launchConfig.configurations.Count) launch configurations" -Color $Colors.Info
        Write-ColorOutput "📋 Found $($launchConfig.compounds.Count) compound configurations" -Color $Colors.Info
        Write-Host ""
        
        # Validate each configuration
        foreach ($config in $launchConfig.configurations) {
            $configName = $config.name
            $configType = $config.type
            
            Write-ColorOutput "🔍 $configName ($configType)" -Color $Colors.Info
            
            # Check for required pnpm scripts
            if ($config.runtimeExecutable -eq "pnpm") {
                $scriptName = $config.runtimeArgs[0]
                $packageJsonPath = Join-Path $ProjectRoot "package.json"
                $packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
                
                if ($packageJson.scripts.$scriptName) {
                    Write-ColorOutput "   ✅ Script '$scriptName' exists" -Color $Colors.Success
                }
                else {
                    Write-ColorOutput "   ⚠️  Script '$scriptName' not found in package.json" -Color $Colors.Warning
                }
            }
        }
        
        Write-Host ""
        Write-ColorOutput "✅ Launch configurations validated" -Color $Colors.Success
        return $true
    }
    catch {
        Write-ColorOutput "❌ Error validating launch.json: $($_.Exception.Message)" -Color $Colors.Error
        Write-Log "Launch config validation error: $($_.Exception.Message)" -Level "ERROR"
        return $false
    }
}

#endregion

#region Main Functions

function Invoke-AllTasks {
    Write-SectionHeader "ComicWise VSCode Configuration Manager"
    
    Write-ColorOutput "🚀 Running all configuration tasks..." -Color $Colors.Info
    Write-Host ""
    
    $results = @{
        Prerequisites = Test-Prerequisites
        ConfigValidation = Test-VsCodeConfigFiles
        McpServers = Start-McpServers
        LaunchConfigs = Test-LaunchConfigurations
    }
    
    # Extensions installation is optional and requires user interaction
    Write-Host ""
    Write-ColorOutput "📦 Extension Installation" -Color $Colors.Header
    Write-ColorOutput "Do you want to install recommended extensions? (Y/N): " -Color $Colors.Info -NoNewline
    $response = Read-Host
    
    if ($response -eq "Y" -or $response -eq "y") {
        $results.Extensions = Install-RecommendedExtensions
    }
    else {
        Write-ColorOutput "⏭️  Skipping extension installation" -Color $Colors.Warning
        $results.Extensions = $null
    }
    
    # Summary
    Write-SectionHeader "Summary"
    
    foreach ($task in $results.GetEnumerator()) {
        $status = if ($task.Value -eq $true) {
            Write-ColorOutput "✅ $($task.Key): " -Color $Colors.Success -NoNewline
            Write-ColorOutput "PASSED" -Color $Colors.Success
        }
        elseif ($task.Value -eq $false) {
            Write-ColorOutput "❌ $($task.Key): " -Color $Colors.Error -NoNewline
            Write-ColorOutput "FAILED" -Color $Colors.Error
        }
        else {
            Write-ColorOutput "⏭️  $($task.Key): " -Color $Colors.Warning -NoNewline
            Write-ColorOutput "SKIPPED" -Color $Colors.Warning
        }
    }
    
    Write-Host ""
    Write-ColorOutput "📝 Full log saved to: $LogFile" -Color $Colors.Info
    Write-Host ""
}

function Show-Help {
    Write-SectionHeader "ComicWise VSCode Configuration Manager - Help"
    
    Write-Host @"
USAGE:
    .\manage-vscode-config.ps1 [-Action <action>] [-Verbose]

ACTIONS:
    validate            - Validate all configuration files
    start-mcp          - Check and prepare MCP servers
    install-extensions - Install recommended VSCode extensions
    test-launch        - Test launch configurations
    optimize           - Run optimization checks
    all                - Run all tasks (default)
    help               - Show this help message

FLAGS:
    -Verbose           - Enable verbose output

EXAMPLES:
    .\manage-vscode-config.ps1
    .\manage-vscode-config.ps1 -Action validate
    .\manage-vscode-config.ps1 -Action start-mcp -Verbose
    .\manage-vscode-config.ps1 -Action install-extensions

NOTES:
    - Requires PowerShell 5.1 or higher
    - Requires Node.js 22+ and pnpm 9+
    - VSCode must be installed and 'code' command in PATH for extension installation
    - MCP servers will be started automatically by VSCode Copilot

"@
}

#endregion

#region Script Entry Point

# Initialize log file
if (-not (Test-Path $VsCodeDir)) {
    New-Item -ItemType Directory -Path $VsCodeDir -Force | Out-Null
}

"" | Out-File $LogFile
Write-Log "Script started with action: $Action" -Level "INFO"

# Execute requested action
switch ($Action) {
    "validate" {
        Test-Prerequisites
        Test-VsCodeConfigFiles
    }
    "start-mcp" {
        Test-Prerequisites
        Start-McpServers
    }
    "install-extensions" {
        Test-Prerequisites
        Install-RecommendedExtensions
    }
    "test-launch" {
        Test-Prerequisites
        Test-LaunchConfigurations
    }
    "optimize" {
        Test-Prerequisites
        Test-VsCodeConfigFiles
        Start-McpServers
        Test-LaunchConfigurations
    }
    "all" {
        Invoke-AllTasks
    }
    "help" {
        Show-Help
    }
    default {
        Show-Help
    }
}

Write-Log "Script completed" -Level "INFO"

#endregion
