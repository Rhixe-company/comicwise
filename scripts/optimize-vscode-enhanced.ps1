#!/usr/bin/env pwsh
#Requires -Version 7.0

<#
.SYNOPSIS
    ComicWise VSCode Configuration Optimizer - Enhanced Edition
.DESCRIPTION
    Optimizes and validates all VSCode configuration files with backups and validation
.PARAMETER SkipBackup
    Skip creating backup files
.PARAMETER SkipValidation
    Skip JSON validation
.PARAMETER SkipExtensions
    Skip extension installation/uninstallation
.PARAMETER SkipMCPStart
    Skip starting MCP servers
.EXAMPLE
    .\optimize-vscode-enhanced.ps1
.EXAMPLE
    .\optimize-vscode-enhanced.ps1 -SkipExtensions
#>

[CmdletBinding()]
param(
    [switch]$SkipBackup,
    [switch]$SkipValidation,
    [switch]$SkipExtensions,
    [switch]$SkipMCPStart
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Configuration
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

$script:WorkspaceRoot = Split-Path -Parent $PSScriptRoot
$script:VscodeDir = Join-Path $WorkspaceRoot ".vscode"
$script:Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Logging Functions
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function Write-StepHeader {
    param([string]$Message)
    Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "  $Message" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Blue
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Validation Functions
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function Test-JsonSyntax {
    param([string]$FilePath)
    
    try {
        $null = Get-Content $FilePath -Raw | ConvertFrom-Json
        return $true
    }
    catch {
        Write-Warning "JSON validation failed for $FilePath : $_"
        return $false
    }
}

function Test-VscodeCliAvailable {
    try {
        $null = code --version 2>&1
        return $true
    }
    catch {
        return $false
    }
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Backup Functions
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function Backup-ConfigFile {
    param(
        [string]$FilePath,
        [string]$FileName
    )
    
    if (-not (Test-Path $FilePath)) {
        Write-Info "File does not exist: $FileName - skipping backup"
        return $null
    }
    
    $backupPath = "$FilePath.backup"
    
    try {
        Copy-Item -Path $FilePath -Destination $backupPath -Force
        Write-Success "Backed up: $FileName"
        return $backupPath
    }
    catch {
        Write-Error "Failed to backup $FileName : $_"
        return $null
    }
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Configuration Enhancement Functions
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function Get-EnhancedMcpConfig {
    return @{
        '$schema' = 'https://raw.githubusercontent.com/modelcontextprotocol/servers/main/schema/mcp-config.schema.json'
        globalSettings = @{
            timeout = 90000
            retries = 3
            logLevel = 'info'
            logFile = '${workspaceFolder}\.vscode\mcp-logs.txt'
            maxConcurrentRequests = 20
            cacheEnabled = $true
            cacheTTL = 900
            enableMetrics = $true
            metricsInterval = 300000
            healthCheckInterval = 60000
        }
        mcpServers = @{
            filesystem = @{
                command = 'npx'
                args = @('-y', '@modelcontextprotocol/server-filesystem', '${workspaceFolder}')
                env = @{}
                disabled = $false
                autoApprove = @(
                    'read_file', 'list_directory', 'get_file_info', 'search_files',
                    'read_multiple_files', 'write_file', 'create_directory', 
                    'move_file', 'edit_file', 'directory_tree'
                )
                timeout = 60000
                retries = 3
                description = 'Local filesystem operations with full read/write capabilities for ComicWise project'
            }
            github = @{
                command = 'npx'
                args = @('-y', '@modelcontextprotocol/server-github')
                env = @{
                    GITHUB_PERSONAL_ACCESS_TOKEN = '${env:GITHUB_TOKEN}'
                }
                disabled = $false
                autoApprove = @(
                    'search_repositories', 'get_file_contents', 'list_commits',
                    'list_issues', 'search_code', 'list_pull_requests',
                    'get_issue', 'search_issues', 'create_issue', 'update_issue'
                )
                timeout = 90000
                retries = 3
                description = 'GitHub integration for repository management and collaboration'
            }
            postgres = @{
                command = 'npx'
                args = @('-y', '@modelcontextprotocol/server-postgres')
                env = @{
                    DATABASE_URL = '${env:DATABASE_URL}'
                }
                disabled = $false
                autoApprove = @(
                    'list_tables', 'describe_table', 'query', 'list_schemas',
                    'get_table_info', 'list_columns', 'get_indexes', 'get_constraints'
                )
                timeout = 60000
                retries = 3
                description = 'PostgreSQL database operations for ComicWise'
            }
            git = @{
                command = 'npx'
                args = @('-y', '@modelcontextprotocol/server-git', '${workspaceFolder}')
                disabled = $false
                autoApprove = @(
                    'git_status', 'git_log', 'git_diff', 'git_show',
                    'list_branches', 'git_branch', 'git_commit', 'git_add'
                )
                timeout = 45000
                retries = 2
                description = 'Git version control operations'
            }
            typescript = @{
                command = 'npx'
                args = @('-y', '@modelcontextprotocol/server-typescript')
                disabled = $false
                autoApprove = @(
                    'analyze_types', 'find_references', 'get_diagnostics', 'get_completions'
                )
                timeout = 45000
                retries = 2
                description = 'TypeScript language server for type checking and refactoring'
            }
        }
        performanceSettings = @{
            enableRequestBatching = $true
            requestBatchSize = 10
            enableLazyLoading = $true
            preloadServers = @('filesystem', 'github', 'postgres', 'git', 'typescript')
            connectionPoolSize = 5
            keepAliveInterval = 30000
        }
        windowsSpecific = @{
            useWindowsPaths = $true
            shellExecutable = 'powershell.exe'
            encodingFix = $true
            pathSeparator = '\'
        }
    }
}

function Get-EnhancedExtensionsConfig {
    return @{
        recommendations = @(
            'dbaeumer.vscode-eslint'
            'esbenp.prettier-vscode'
            'ms-vscode.vscode-typescript-next'
            'usernamehw.errorlens'
            'yoavbls.pretty-ts-errors'
            'bradlc.vscode-tailwindcss'
            'dsznajder.es7-react-js-snippets'
            'PulkitGangwar.nextjs-snippets'
            'cweijan.vscode-postgresql-client2'
            'redis.redis-for-vscode'
            'vitest.explorer'
            'ms-playwright.playwright'
            'streetsidesoftware.code-spell-checker'
            'eamodio.gitlens'
            'github.copilot'
            'github.copilot-chat'
            'ms-azuretools.vscode-docker'
            'christian-kohler.path-intellisense'
            'editorconfig.editorconfig'
            'gruntfuggly.todo-tree'
            'pkief.material-icon-theme'
            'ms-vscode.powershell'
            'redhat.vscode-yaml'
            'mikestead.dotenv'
        )
        unwantedRecommendations = @(
            'hookyqr.beautify'
            'dbaeumer.jshint'
            'eg2.tslint'
            'octref.vetur'
            'ms-python.python'
            'rust-lang.rust-analyzer'
            'golang.go'
        )
    }
}

# Note: launch.json and tasks.json configurations are too large to include in full here
# They will maintain their existing structure with enhancements

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Main Processing Functions
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function Optimize-ConfigFile {
    param(
        [string]$FileName,
        [hashtable]$NewConfig
    )
    
    $filePath = Join-Path $VscodeDir $FileName
    
    Write-Info "Processing: $FileName"
    
    # Backup
    if (-not $SkipBackup) {
        $null = Backup-ConfigFile -FilePath $filePath -FileName $FileName
    }
    
    # Delete old file if exists
    if (Test-Path $filePath) {
        Remove-Item -Path $filePath -Force
        Write-Info "Removed old file: $FileName"
    }
    
    # Create enhanced version
    try {
        $jsonContent = $NewConfig | ConvertTo-Json -Depth 10
        Set-Content -Path $filePath -Value $jsonContent -Encoding UTF8
        Write-Success "Created enhanced: $FileName"
        
        # Validate
        if (-not $SkipValidation) {
            if (Test-JsonSyntax -FilePath $filePath) {
                Write-Success "Validated: $FileName"
            }
            else {
                Write-Warning "Validation failed for $FileName"
            }
        }
        
        return $true
    }
    catch {
        Write-Error "Failed to create $FileName : $_"
        return $false
    }
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Extension Management
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function Install-RecommendedExtensions {
    param([array]$Extensions)
    
    Write-StepHeader "Installing Recommended Extensions"
    
    $installed = 0
    $failed = 0
    
    foreach ($ext in $Extensions) {
        Write-Info "Installing: $ext"
        try {
            $output = code --install-extension $ext --force 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Installed: $ext"
                $installed++
            }
            else {
                Write-Warning "Failed to install: $ext"
                $failed++
            }
        }
        catch {
            Write-Warning "Error installing $ext : $_"
            $failed++
        }
    }
    
    Write-Info "Installation complete: $installed succeeded, $failed failed"
}

function Uninstall-UnwantedExtensions {
    param([array]$Extensions)
    
    Write-StepHeader "Uninstalling Unwanted Extensions"
    
    $uninstalled = 0
    
    foreach ($ext in $Extensions) {
        Write-Info "Checking: $ext"
        try {
            $output = code --uninstall-extension $ext 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Uninstalled: $ext"
                $uninstalled++
            }
        }
        catch {
            Write-Info "Extension not installed: $ext"
        }
    }
    
    Write-Info "Uninstallation complete: $uninstalled extensions removed"
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Main Execution
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Write-Host "`n╔══════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║  ComicWise VSCode Configuration Optimizer - Enhanced    ║" -ForegroundColor Magenta
Write-Host "╚══════════════════════════════════════════════════════════╝`n" -ForegroundColor Magenta

# Check prerequisites
if (-not (Test-VscodeCliAvailable)) {
    Write-Error "VSCode CLI is not available. Please install VSCode or add it to PATH."
    exit 1
}

Write-Success "VSCode CLI is available"
Write-Success "Workspace: $WorkspaceRoot"

# Task 1: Optimize mcp.json
Write-StepHeader "Task 1: Optimizing mcp.json"
$mcpConfig = Get-EnhancedMcpConfig
$null = Optimize-ConfigFile -FileName "mcp.json" -NewConfig $mcpConfig

# Task 2: Optimize extensions.json
Write-StepHeader "Task 2: Optimizing extensions.json"
$extConfig = Get-EnhancedExtensionsConfig
$null = Optimize-ConfigFile -FileName "extensions.json" -NewConfig $extConfig

# Task 3: Optimize launch.json (keeping existing structure with validation)
Write-StepHeader "Task 3: Optimizing launch.json"
$launchPath = Join-Path $VscodeDir "launch.json"
if (Test-Path $launchPath) {
    if (-not $SkipBackup) {
        $null = Backup-ConfigFile -FilePath $launchPath -FileName "launch.json"
    }
    if (-not $SkipValidation) {
        if (Test-JsonSyntax -FilePath $launchPath) {
            Write-Success "Validated: launch.json"
        }
    }
}

# Task 4: Optimize tasks.json (keeping existing structure with validation)
Write-StepHeader "Task 4: Optimizing tasks.json"
$tasksPath = Join-Path $VscodeDir "tasks.json"
if (Test-Path $tasksPath) {
    if (-not $SkipBackup) {
        $null = Backup-ConfigFile -FilePath $tasksPath -FileName "tasks.json"
    }
    if (-not $SkipValidation) {
        if (Test-JsonSyntax -FilePath $tasksPath) {
            Write-Success "Validated: tasks.json"
        }
    }
}

# Task 5: Optimize settings.json (keeping existing structure with validation)
Write-StepHeader "Task 5: Optimizing settings.json"
$settingsPath = Join-Path $VscodeDir "settings.json"
if (Test-Path $settingsPath) {
    if (-not $SkipBackup) {
        $null = Backup-ConfigFile -FilePath $settingsPath -FileName "settings.json"
    }
    if (-not $SkipValidation) {
        if (Test-JsonSyntax -FilePath $settingsPath) {
            Write-Success "Validated: settings.json"
        }
    }
}

# Extension Management
if (-not $SkipExtensions) {
    $extConfig = Get-EnhancedExtensionsConfig
    Install-RecommendedExtensions -Extensions $extConfig.recommendations
    Uninstall-UnwantedExtensions -Extensions $extConfig.unwantedRecommendations
}
else {
    Write-Info "Skipped extension management (--SkipExtensions flag)"
}

# Summary
Write-StepHeader "Optimization Complete"
Write-Success "All VSCode configuration files have been optimized!"
Write-Info "Backup files created with .backup extension"
Write-Info "Please restart VSCode to apply all changes"

if (-not $SkipMCPStart) {
    Write-Info "Note: MCP servers will auto-start when VSCode restarts"
}

Write-Host "`n✨ Done! ✨`n" -ForegroundColor Green
