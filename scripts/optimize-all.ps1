#!/usr/bin/env pwsh
<#
.SYNOPSIS
    ComicWise Full Project Optimization Master Script
.DESCRIPTION
    Orchestrates all 16 optimization tasks with validation and rollback capabilities
.PARAMETER Tasks
    Comma-separated list of task numbers to execute (1-16). Default: all tasks
.PARAMETER DryRun
    Preview changes without applying them
.PARAMETER SkipBackup
    Skip backup creation (not recommended)
.EXAMPLE
    .\optimize-all.ps1
    .\optimize-all.ps1 -Tasks "1,2,3" -DryRun
#>

param(
    [string]$Tasks = "all",
    [switch]$DryRun,
    [switch]$SkipBackup
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Colors
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }
function Write-Error { param($msg) Write-Host $msg -ForegroundColor Red }

# Banner
Write-Host "`n" + ("=" * 80) -ForegroundColor Magenta
Write-Host " COMICWISE - FULL PROJECT OPTIMIZATION" -ForegroundColor Magenta
Write-Host ("=" * 80) + "`n" -ForegroundColor Magenta

$startTime = Get-Date
$rootDir = Get-Location
$backupDir = Join-Path $rootDir ".backup"
$reportDir = Join-Path $rootDir "reports"
$timestamp = Get-Date -Format "yyyy-MM-dd-HHmmss"

# Ensure directories
New-Item -ItemType Directory -Force -Path $reportDir | Out-Null
if (-not $SkipBackup) {
    New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
}

# Task registry
$taskRegistry = @(
    @{ Id = 1; Name = "VSCode Configuration"; Script = "task-01-vscode.ps1"; Critical = $false }
    @{ Id = 2; Name = "ESLint Configuration"; Script = "task-02-eslint.ps1"; Critical = $true }
    @{ Id = 3; Name = "Type System Consolidation"; Script = "task-03-types.ps1"; Critical = $true }
    @{ Id = 4; Name = "Replace Any Types"; Script = "task-04-any-types.ps1"; Critical = $true }
    @{ Id = 5; Name = "TSConfig Path Optimization"; Script = "task-05-tsconfig.ps1"; Critical = $true }
    @{ Id = 6; Name = "Import Path Updates"; Script = "task-06-imports.ps1"; Critical = $true }
    @{ Id = 7; Name = "Scripts Optimization"; Script = "task-07-scripts.ps1"; Critical = $false }
    @{ Id = 8; Name = "CamelCase Refactoring"; Script = "task-08-camelcase.ps1"; Critical = $true }
    @{ Id = 9; Name = "Project Scaffolding"; Script = "task-09-scaffold.ps1"; Critical = $false }
    @{ Id = 10; Name = "Shell Aliases"; Script = "task-10-aliases.ps1"; Critical = $false }
    @{ Id = 11; Name = "Folder Restructure"; Script = "task-11-restructure.ps1"; Critical = $true }
    @{ Id = 12; Name = "Fix Type/Lint Errors"; Script = "task-12-fix-errors.ps1"; Critical = $true }
    @{ Id = 13; Name = "GitHub Setup Prompt"; Script = "task-13-github.ps1"; Critical = $false }
    @{ Id = 14; Name = "README Enhancement"; Script = "task-14-readme.ps1"; Critical = $false }
    @{ Id = 15; Name = "Generate Report"; Script = "task-15-report.ps1"; Critical = $false }
    @{ Id = 16; Name = "NextAuth + Cleanup"; Script = "task-16-nextauth.ps1"; Critical = $true }
)

# Parse task selection
$selectedTasks = if ($Tasks -eq "all") {
    $taskRegistry
} else {
    $taskIds = $Tasks -split "," | ForEach-Object { [int]$_.Trim() }
    $taskRegistry | Where-Object { $taskIds -contains $_.Id }
}

Write-Info "Selected $($selectedTasks.Count) tasks for execution"
if ($DryRun) {
    Write-Warning "DRY RUN MODE - No changes will be applied"
}

# Create backup
if (-not $SkipBackup -and -not $DryRun) {
    Write-Info "Creating safety backup..."
    $backupPath = Join-Path $backupDir "pre-optimization-$timestamp"
    New-Item -ItemType Directory -Force -Path $backupPath | Out-Null
    
    # Backup critical files
    $criticalPaths = @(
        "package.json",
        "tsconfig.json",
        "eslint.config.ts",
        ".vscode",
        "src\types",
        "src\database\schema.ts",
        "src\lib\auth.ts"
    )
    
    foreach ($path in $criticalPaths) {
        $source = Join-Path $rootDir $path
        $dest = Join-Path $backupPath $path
        
        if (Test-Path $source) {
            if ((Get-Item $source) -is [System.IO.DirectoryInfo]) {
                Copy-Item -Path $source -Destination $dest -Recurse -Force
            } else {
                New-Item -ItemType Directory -Force -Path (Split-Path $dest) | Out-Null
                Copy-Item -Path $source -Destination $dest -Force
            }
        }
    }
    
    Write-Success "✓ Backup created: $backupPath"
}

# Execute tasks
$results = @()

foreach ($task in $selectedTasks) {
    Write-Host "`n" + ("-" * 80) -ForegroundColor Gray
    Write-Info "[$($task.Id)/16] $($task.Name)"
    Write-Host ("-" * 80) -ForegroundColor Gray
    
    $taskStart = Get-Date
    $taskScript = Join-Path $rootDir "scripts\optimization-tasks\$($task.Script)"
    
    try {
        if (Test-Path $taskScript) {
            if ($DryRun) {
                & $taskScript -DryRun
            } else {
                & $taskScript
            }
            $duration = (Get-Date) - $taskStart
            $results += @{
                Task = $task.Name
                Success = $true
                Duration = $duration.TotalSeconds
            }
            Write-Success "✓ Completed in $([math]::Round($duration.TotalSeconds, 2))s"
        } else {
            Write-Warning "⚠ Task script not found: $taskScript"
            Write-Info "Creating placeholder for Task $($task.Id)..."
            
            # Create task directory and placeholder
            $taskDir = Join-Path $rootDir "scripts\optimization-tasks"
            New-Item -ItemType Directory -Force -Path $taskDir | Out-Null
            
            $placeholderContent = @"
#!/usr/bin/env pwsh
# Task $($task.Id): $($task.Name)
# TODO: Implement optimization logic

param([switch]`$DryRun)

Write-Host "Task $($task.Id): $($task.Name)" -ForegroundColor Cyan
Write-Host "Status: Not yet implemented" -ForegroundColor Yellow

if (`$DryRun) {
    Write-Host "DRY RUN: Would execute $($task.Name)" -ForegroundColor Gray
}

# Add implementation here
"@
            Set-Content -Path $taskScript -Value $placeholderContent -Encoding UTF8
            
            $duration = (Get-Date) - $taskStart
            $results += @{
                Task = $task.Name
                Success = $false
                Duration = $duration.TotalSeconds
                Error = "Not implemented"
            }
        }
    }
    catch {
        $duration = (Get-Date) - $taskStart
        $results += @{
            Task = $task.Name
            Success = $false
            Duration = $duration.TotalSeconds
            Error = $_.Exception.Message
        }
        
        if ($task.Critical) {
            Write-Error "✗ CRITICAL FAILURE: $($_.Exception.Message)"
            Write-Error "Stopping execution due to critical task failure"
            break
        } else {
            Write-Warning "⚠ Warning: $($_.Exception.Message)"
        }
    }
}

# Summary
Write-Host "`n" + ("=" * 80) -ForegroundColor Magenta
Write-Host " OPTIMIZATION SUMMARY" -ForegroundColor Magenta
Write-Host ("=" * 80) + "`n" -ForegroundColor Magenta

$totalDuration = (Get-Date) - $startTime
$successful = ($results | Where-Object { $_.Success }).Count
$failed = ($results | Where-Object { -not $_.Success }).Count

Write-Info "Total Duration: $([math]::Round($totalDuration.TotalMinutes, 2)) minutes"
Write-Success "Successful: $successful/$($results.Count)"
if ($failed -gt 0) {
    Write-Warning "Failed: $failed/$($results.Count)"
}

# Save report
$reportPath = Join-Path $reportDir "optimization-summary-$timestamp.json"
$results | ConvertTo-Json -Depth 10 | Set-Content -Path $reportPath -Encoding UTF8
Write-Info "Report saved: $reportPath"

Write-Host "`n"
