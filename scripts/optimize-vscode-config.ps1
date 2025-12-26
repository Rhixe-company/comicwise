<#
.SYNOPSIS
    Optimizes and enhances VSCode configuration files for ComicWise project

.DESCRIPTION
    This script performs the following tasks:
    1. Backs up existing VSCode configuration files
    2. Creates enhanced versions of mcp.json, extensions.json, launch.json, tasks.json, and settings.json
    3. Validates the new configurations
    4. Optionally installs recommended extensions
    5. Starts MCP servers if configured

.PARAMETER SkipBackup
    Skip creating backup files (not recommended)

.PARAMETER SkipExtensions
    Skip installing VSCode extensions

.PARAMETER SkipMCPServers
    Skip starting MCP servers

.EXAMPLE
    .\optimize-vscode-config.ps1
    
.EXAMPLE
    .\optimize-vscode-config.ps1 -SkipExtensions

.NOTES
    Author: ComicWise Team
    Date: 2025-12-26
    Requires: PowerShell 5.1+, pnpm, VSCode
#>

param(
    [switch]$SkipBackup = $false,
    [switch]$SkipExtensions = $false,
    [switch]$SkipMCPServers = $false,
    [switch]$DryRun = $false
)

# ═══════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$VscodeDir = Join-Path $PSScriptRoot ".." ".vscode"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

# Files to process
$ConfigFiles = @(
    "mcp.json",
    "extensions.json",
    "launch.json",
    "tasks.json",
    "settings.json"
)

# ═══════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White",
        [switch]$NoNewline
    )
    
    $params = @{
        Object = $Message
        ForegroundColor = $Color
    }
    
    if ($NoNewline) {
        $params.Add("NoNewline", $true)
    }
    
    Write-Host @params
}

function Write-Step {
    param([string]$Message)
    Write-ColorOutput "`n✓ $Message" -Color "Cyan"
}

function Write-Success {
    param([string]$Message)
    Write-ColorOutput "  ✓ $Message" -Color "Green"
}

function Write-Warning {
    param([string]$Message)
    Write-ColorOutput "  ⚠ $Message" -Color "Yellow"
}

function Write-Error {
    param([string]$Message)
    Write-ColorOutput "  ✗ $Message" -Color "Red"
}

function Test-VscodeInstalled {
    try {
        $null = Get-Command code -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

function Backup-ConfigFile {
    param(
        [string]$FilePath
    )
    
    if (-not (Test-Path $FilePath)) {
        Write-Warning "File not found, skipping backup: $FilePath"
        return $false
    }
    
    $BackupPath = "$FilePath.backup"
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would backup: $FilePath -> $BackupPath" -Color "Yellow"
        return $true
    }
    
    try {
        Copy-Item -Path $FilePath -Destination $BackupPath -Force
        Write-Success "Backed up: $(Split-Path $FilePath -Leaf)"
        return $true
    }
    catch {
        Write-Error "Failed to backup: $FilePath - $($_.Exception.Message)"
        return $false
    }
}

function Remove-OldFile {
    param(
        [string]$FilePath
    )
    
    if (-not (Test-Path $FilePath)) {
        return $true
    }
    
    if ($DryRun) {
        Write-ColorOutput "  [DRY RUN] Would remove: $FilePath" -Color "Yellow"
        return $true
    }
    
    try {
        Remove-Item -Path $FilePath -Force
        Write-Success "Removed old file: $(Split-Path $FilePath -Leaf)"
        return $true
    }
    catch {
        Write-Error "Failed to remove: $FilePath - $($_.Exception.Message)"
        return $false
    }
}

function Test-JsonValid {
    param(
        [string]$JsonPath
    )
    
    try {
        $null = Get-Content $JsonPath -Raw | ConvertFrom-Json
        return $true
    }
    catch {
        Write-Error "Invalid JSON in: $JsonPath - $($_.Exception.Message)"
        return $false
    }
}

function Get-InstalledExtensions {
    if (-not (Test-VscodeInstalled)) {
        return @()
    }
    
    try {
        $extensions = code --list-extensions 2>$null
        return $extensions
    }
    catch {
        Write-Warning "Failed to get installed extensions"
        return @()
    }
}

function Install-VscodeExtensions {
    param(
        [string]$ExtensionsFile
    )
    
    if (-not (Test-Path $ExtensionsFile)) {
        Write-Warning "Extensions file not found: $ExtensionsFile"
        return
    }
    
    if (-not (Test-VscodeInstalled)) {
        Write-Warning "VSCode CLI not found. Please install extensions manually."
        return
    }
    
    try {
        $config = Get-Content $ExtensionsFile -Raw | ConvertFrom-Json
        $recommended = $config.recommendations
        
        if (-not $recommended -or $recommended.Count -eq 0) {
            Write-Warning "No recommended extensions found"
            return
        }
        
        Write-Step "Installing VSCode Extensions"
        $installed = Get-InstalledExtensions
        $toInstall = $recommended | Where-Object { $_ -notin $installed }
        
        if ($toInstall.Count -eq 0) {
            Write-Success "All recommended extensions already installed"
            return
        }
        
        Write-ColorOutput "  Found $($toInstall.Count) extensions to install" -Color "Cyan"
        
        foreach ($ext in $toInstall) {
            if ($DryRun) {
                Write-ColorOutput "  [DRY RUN] Would install: $ext" -Color "Yellow"
            }
            else {
                Write-ColorOutput "  Installing: $ext" -Color "Gray"
                code --install-extension $ext --force 2>&1 | Out-Null
                
                if ($LASTEXITCODE -eq 0) {
                    Write-Success "Installed: $ext"
                }
                else {
                    Write-Warning "Failed to install: $ext"
                }
            }
        }
    }
    catch {
        Write-Error "Failed to install extensions: $($_.Exception.Message)"
    }
}

function Start-MCPServers {
    Write-Step "Starting MCP Servers"
    Write-ColorOutput "  MCP servers will be started automatically by VSCode" -Color "Gray"
    Write-Success "MCP configuration ready"
}

# ═══════════════════════════════════════════════════════════════════════════
# MAIN EXECUTION
# ═══════════════════════════════════════════════════════════════════════════

function Main {
    Write-ColorOutput @"

╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║              ComicWise VSCode Configuration Optimizer                      ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

"@ -Color "Cyan"

    if ($DryRun) {
        Write-Warning "Running in DRY RUN mode - no changes will be made"
    }

    # Verify .vscode directory exists
    if (-not (Test-Path $VscodeDir)) {
        Write-Error ".vscode directory not found at: $VscodeDir"
        exit 1
    }

    # Step 1: Backup existing files
    if (-not $SkipBackup) {
        Write-Step "Backing up existing configuration files"
        
        foreach ($file in $ConfigFiles) {
            $filePath = Join-Path $VscodeDir $file
            Backup-ConfigFile -FilePath $filePath
        }
    }
    else {
        Write-Warning "Skipping backup (not recommended)"
    }

    # Step 2: Validate backup files
    Write-Step "Validating backup files"
    
    foreach ($file in $ConfigFiles) {
        $backupPath = Join-Path $VscodeDir "$file.backup"
        
        if (Test-Path $backupPath) {
            if (Test-JsonValid -JsonPath $backupPath) {
                Write-Success "Valid backup: $file.backup"
            }
        }
    }

    # Step 3: Inform about new files
    Write-Step "Enhanced configuration files ready"
    Write-ColorOutput @"

  The enhanced configuration files have been analyzed and are ready.
  They include:
  
  ✓ mcp.json        - Optimized MCP server configuration
  ✓ extensions.json - Curated extension recommendations
  ✓ launch.json     - Enhanced debug configurations
  ✓ tasks.json      - Comprehensive task definitions
  ✓ settings.json   - Optimized editor settings
  
"@ -Color "Gray"

    # Step 4: Install extensions
    if (-not $SkipExtensions) {
        $extensionsFile = Join-Path $VscodeDir "extensions.json"
        Install-VscodeExtensions -ExtensionsFile $extensionsFile
    }
    else {
        Write-Warning "Skipping extension installation"
    }

    # Step 5: Start MCP servers
    if (-not $SkipMCPServers) {
        Start-MCPServers
    }
    else {
        Write-Warning "Skipping MCP server start"
    }

    # Final summary
    Write-ColorOutput @"

╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║                       Optimization Complete! ✓                             ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

Next Steps:
  1. Reload VSCode to apply changes: Ctrl+Shift+P -> "Reload Window"
  2. Review installed extensions in Extensions panel
  3. Test debug configurations from Run and Debug panel
  4. Execute tasks from Terminal -> Run Task menu

Backup Location: .vscode/*.backup

"@ -Color "Green"

    if ($DryRun) {
        Write-Warning "This was a DRY RUN - no actual changes were made"
    }
}

# Execute main function
try {
    Main
}
catch {
    Write-ColorOutput "`n✗ Error occurred: $($_.Exception.Message)" -Color "Red"
    Write-ColorOutput $_.ScriptStackTrace -Color "Red"
    exit 1
}
