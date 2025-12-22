#!/usr/bin/env pwsh
<#
.SYNOPSIS
    ComicWise CLI - PowerShell wrapper for all project commands
.DESCRIPTION
    Provides easy access to 100+ organized scripts with tab completion
.EXAMPLE
    .\cw.ps1 db:push
.EXAMPLE
    .\cw.ps1 upload:bulk --provider cloudinary
#>

param(
    [Parameter(Position = 0)]
    [string]$Command,
    
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Arguments
)

$ErrorActionPreference = "Stop"

# ═══════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════

function Write-Header {
    param([string]$Title)
    Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║ $($Title.PadRight(60)) ║" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Cyan
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Run-Command {
    param([string]$Cmd)
    Write-Info "Running: $Cmd"
    Invoke-Expression $Cmd
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Command failed with exit code $LASTEXITCODE"
        exit $LASTEXITCODE
    }
}

# ═══════════════════════════════════════════════════
# COMMAND CATEGORIES
# ═══════════════════════════════════════════════════

$commands = @{
    # Database Commands
    "db:push" = @{ Script = "pnpm db:push"; Description = "Push database schema" }
    "db:pull" = @{ Script = "pnpm db:pull"; Description = "Pull database schema" }
    "db:migrate" = @{ Script = "pnpm db:migrate"; Description = "Run migrations" }
    "db:generate" = @{ Script = "pnpm db:generate"; Description = "Generate migrations" }
    "db:seed" = @{ Script = "pnpm db:seed"; Description = "Seed database" }
    "db:reset" = @{ Script = "pnpm db:reset"; Description = "Reset database" }
    "db:studio" = @{ Script = "pnpm db:studio"; Description = "Open Drizzle Studio" }
    "db:backup" = @{ Script = "pnpm db:backup"; Description = "Backup database" }
    
    # Cache Commands
    "cache:clear" = @{ Script = "pnpm cache:clear"; Description = "Clear all caches" }
    "cache:stats" = @{ Script = "pnpm cache:stats"; Description = "Show cache stats" }
    "redis:cli" = @{ Script = "pnpm redis:cli"; Description = "Open Redis CLI" }
    "redis:flush" = @{ Script = "pnpm redis:flush"; Description = "Flush Redis" }
    
    # Queue Commands
    "queue:worker" = @{ Script = "pnpm queue:worker"; Description = "Start queue worker" }
    "queue:stats" = @{ Script = "pnpm queue:stats"; Description = "Show queue stats" }
    "queue:clean" = @{ Script = "pnpm queue:clean"; Description = "Clean queue" }
    "queue:dashboard" = @{ Script = "pnpm queue:dashboard"; Description = "Open queue dashboard" }
    
    # Upload Commands
    "upload:bulk" = @{ Script = "pnpm upload:bulk $($Arguments -join ' ')"; Description = "Bulk upload images" }
    "upload:test" = @{ Script = "pnpm upload:test"; Description = "Test upload" }
    
    # Health Commands
    "health:all" = @{ Script = "pnpm health:all"; Description = "Run all health checks" }
    "health:db" = @{ Script = "pnpm health:db"; Description = "Check database" }
    "health:redis" = @{ Script = "pnpm health:redis"; Description = "Check Redis" }
    
    # Development Commands
    "dev" = @{ Script = "pnpm dev"; Description = "Start dev server" }
    "build" = @{ Script = "pnpm build"; Description = "Build for production" }
    "start" = @{ Script = "pnpm start"; Description = "Start production server" }
    "lint" = @{ Script = "pnpm lint"; Description = "Lint code" }
    "lint:fix" = @{ Script = "pnpm lint:fix"; Description = "Fix linting issues" }
    "format" = @{ Script = "pnpm format"; Description = "Format code" }
    "type-check" = @{ Script = "pnpm type-check"; Description = "Type check" }
    
    # Testing Commands
    "test" = @{ Script = "pnpm test"; Description = "Run tests" }
    "test:unit" = @{ Script = "pnpm test:unit:run"; Description = "Run unit tests" }
    "test:e2e" = @{ Script = "pnpm test"; Description = "Run E2E tests" }
    "test:ui" = @{ Script = "pnpm test:ui"; Description = "Open test UI" }
    
    # Docker Commands
    "docker:up" = @{ Script = "pnpm docker:up"; Description = "Start Docker containers" }
    "docker:down" = @{ Script = "pnpm docker:down"; Description = "Stop Docker containers" }
    "docker:build" = @{ Script = "pnpm docker:build"; Description = "Build Docker images" }
    "docker:logs" = @{ Script = "pnpm docker:logs"; Description = "Show Docker logs" }
    
    # Utility Commands
    "clean" = @{ Script = "pnpm clean"; Description = "Clean build artifacts" }
    "clean:all" = @{ Script = "pnpm clean:all"; Description = "Clean everything" }
    "imports:optimize" = @{ Script = "pnpm imports:optimize"; Description = "Optimize imports" }
    "validate" = @{ Script = "pnpm validate"; Description = "Run all validations" }
    "fix" = @{ Script = "pnpm lint:fix; pnpm format"; Description = "Fix all issues" }
    
    # Priority System
    "priority:list" = @{ Script = "pnpm priority:list"; Description = "List priority tasks" }
    "priority:status" = @{ Script = "pnpm priority:status"; Description = "Show priority status" }
    "priority:run:p0" = @{ Script = "pnpm priority:run:p0"; Description = "Run P0 tasks" }
    "priority:run:p1" = @{ Script = "pnpm priority:run:p1"; Description = "Run P1 tasks" }
    
    # Setup Commands
    "setup" = @{ Script = "pnpm setup"; Description = "Initial project setup" }
    "setup:clean" = @{ Script = "pnpm setup:clean"; Description = "Clean setup" }
    "setup:docker" = @{ Script = "pnpm setup:docker"; Description = "Setup with Docker" }
}

# ═══════════════════════════════════════════════════
# COMMAND EXECUTION
# ═══════════════════════════════════════════════════

if (-not $Command) {
    Write-Header "ComicWise CLI - Available Commands"
    
    $categories = @{
        "Database" = $commands.Keys | Where-Object { $_ -like "db:*" }
        "Cache & Redis" = $commands.Keys | Where-Object { $_ -like "cache:*" -or $_ -like "redis:*" }
        "Queue" = $commands.Keys | Where-Object { $_ -like "queue:*" }
        "Upload" = $commands.Keys | Where-Object { $_ -like "upload:*" }
        "Health" = $commands.Keys | Where-Object { $_ -like "health:*" }
        "Development" = @("dev", "build", "start", "lint", "lint:fix", "format", "type-check")
        "Testing" = $commands.Keys | Where-Object { $_ -like "test*" }
        "Docker" = $commands.Keys | Where-Object { $_ -like "docker:*" }
        "Priority" = $commands.Keys | Where-Object { $_ -like "priority:*" }
        "Utilities" = @("clean", "clean:all", "imports:optimize", "validate", "fix")
        "Setup" = $commands.Keys | Where-Object { $_ -like "setup*" }
    }
    
    foreach ($category in $categories.Keys | Sort-Object) {
        Write-Host "`n$category Commands:" -ForegroundColor Yellow
        foreach ($cmd in $categories[$category] | Sort-Object) {
            $desc = $commands[$cmd].Description
            Write-Host "  $($cmd.PadRight(25)) - $desc" -ForegroundColor Gray
        }
    }
    
    Write-Host "`n"
    Write-Info "Usage: .\cw.ps1 <command> [arguments]"
    Write-Info "Example: .\cw.ps1 db:push"
    Write-Info "Example: .\cw.ps1 upload:bulk --provider cloudinary"
    exit 0
}

# Show help for specific command
if ($Command -eq "help") {
    if ($Arguments.Count -gt 0) {
        $helpCmd = $Arguments[0]
        if ($commands.ContainsKey($helpCmd)) {
            Write-Header "Help: $helpCmd"
            Write-Info $commands[$helpCmd].Description
            Write-Host "Command: $($commands[$helpCmd].Script)" -ForegroundColor Gray
        } else {
            Write-Error "Unknown command: $helpCmd"
            exit 1
        }
    } else {
        Write-Info "Use: .\cw.ps1 (without arguments) to see all commands"
    }
    exit 0
}

# Execute command
if ($commands.ContainsKey($Command)) {
    Write-Header $commands[$Command].Description
    Run-Command $commands[$Command].Script
    Write-Success "Command completed successfully"
} else {
    Write-Error "Unknown command: $Command"
    Write-Info "Run '.\cw.ps1' to see available commands"
    exit 1
}
