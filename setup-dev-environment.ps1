#Requires -Version 5.1
<#
.SYNOPSIS
    ComicWise Development Environment Setup Script
    
.DESCRIPTION
    Comprehensive setup for ComicWise project including:
    - Dependency installation with pnpm
    - Environment file configuration
    - Database initialization and seeding
    - Code quality validation
    
.PARAMETER SkipInstall
    Skip pnpm install step
    
.PARAMETER SkipDatabase
    Skip database setup (push, seed)
    
.PARAMETER SkipValidation
    Skip final validation checks
    
.PARAMETER DevMode
    Start dev server after setup
    
.PARAMETER DockerMode
    Use Docker for database instead of local PostgreSQL
    
.EXAMPLE
    .\setup-dev-environment.ps1
    
.EXAMPLE
    .\setup-dev-environment.ps1 -DevMode -DockerMode
    
.AUTHOR
    ComicWise Development Team
    
.VERSION
    2.0.0
#>

param(
    [switch]$SkipInstall,
    [switch]$SkipDatabase,
    [switch]$SkipValidation,
    [switch]$DevMode,
    [switch]$DockerMode
)

# Error handling
$ErrorActionPreference = "Stop"
$InformationPreference = "Continue"

# Colors
$colors = @{
    Success = @{ ForegroundColor = 'Green'; BackgroundColor = 'Black' }
    Error   = @{ ForegroundColor = 'Red'; BackgroundColor = 'Black' }
    Warning = @{ ForegroundColor = 'Yellow'; BackgroundColor = 'Black' }
    Info    = @{ ForegroundColor = 'Cyan'; BackgroundColor = 'Black' }
}

function Write-Header {
    param([string]$Message)
    Write-Host "`n╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║ $Message".PadRight(63) + "║" -ForegroundColor Cyan
    Write-Host "╚═══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" @($colors.Success)
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "✗ $Message" @($colors.Error)
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-Host "⚠ $Message" @($colors.Warning)
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" @($colors.Info)
}

function Test-CommandExists {
    param([string]$Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

function Invoke-Safely {
    param(
        [string]$Description,
        [scriptblock]$ScriptBlock
    )
    
    try {
        Write-Info $Description
        & $ScriptBlock
        Write-Success "$Description - Complete"
        return $true
    }
    catch {
        Write-Error-Custom "$Description - Failed: $_"
        return $false
    }
}

# Main setup
Write-Header "ComicWise Development Environment Setup"

# Check prerequisites
Write-Info "Checking prerequisites..."

if (-not (Test-CommandExists "pnpm")) {
    Write-Error-Custom "pnpm not found. Install from https://pnpm.io"
    exit 1
}
Write-Success "pnpm found"

if (-not (Test-CommandExists "node")) {
    Write-Error-Custom "Node.js not found. Install from https://nodejs.org"
    exit 1
}
Write-Success "Node.js found"

# Install dependencies
if (-not $SkipInstall) {
    Invoke-Safely "Installing dependencies with pnpm" {
        pnpm install
    } | Out-Null
}

# Setup environment
Invoke-Safely "Setting up environment files" {
    if (-not (Test-Path ".env")) {
        Copy-Item ".env.example" ".env" -ErrorAction SilentlyContinue
        Write-Warning-Custom ".env file created - please configure with your settings"
    }
} | Out-Null

# Database setup
if (-not $SkipDatabase) {
    if ($DockerMode) {
        Write-Info "Using Docker for database..."
        Invoke-Safely "Starting Docker containers" {
            docker compose -f docker-compose.dev.yml up -d
        } | Out-Null
    }
    
    Invoke-Safely "Pushing database schema" {
        pnpm db:push
    } | Out-Null
    
    Invoke-Safely "Seeding database" {
        pnpm db:seed
    } | Out-Null
}

# Validation
if (-not $SkipValidation) {
    Write-Info "Running validation checks..."
    Invoke-Safely "Type checking" {
        pnpm type-check
    } | Out-Null
    
    Invoke-Safely "Linting" {
        pnpm lint:strict
    } | Out-Null
    
    Invoke-Safely "Formatting check" {
        pnpm format:check
    } | Out-Null
}

# Start development server
if ($DevMode) {
    Write-Header "Starting Development Server"
    pnpm dev
}
else {
    Write-Success "`nSetup complete!"
    Write-Info "Run 'pnpm dev' to start the development server"
}
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$envFile = Join-Path $projectRoot ".env.local"
$envExample = Join-Path $projectRoot ".env.example"

# Colors for output
$colors = @{
    Reset   = "`e[0m"
    Bold    = "`e[1m"
    Green   = "`e[32m"
    Yellow  = "`e[33m"
    Red     = "`e[31m"
    Blue    = "`e[34m"
    Cyan    = "`e[36m"
}

function Write-Status {
    param([string]$Message, [ValidateSet("Info", "Success", "Warning", "Error")]$Type = "Info")
    $emoji = @{
        Info    = "ℹ️ "
        Success = "✅ "
        Warning = "⚠️ "
        Error   = "❌ "
    }
    $color = @{
        Info    = $colors.Blue
        Success = $colors.Green
        Warning = $colors.Yellow
        Error   = $colors.Red
    }
    Write-Host "$($emoji[$Type])$($color[$Type])$Message$($colors.Reset)"
}

function Write-Section {
    param([string]$Title)
    Write-Host ""
    Write-Host "$($colors.Bold)$($colors.Cyan)═══════════════════════════════════════════════════════════════════════════$($colors.Reset)"
    Write-Host "$($colors.Bold)$($colors.Cyan)$Title$($colors.Reset)"
    Write-Host "$($colors.Bold)$($colors.Cyan)═══════════════════════════════════════════════════════════════════════════$($colors.Reset)"
    Write-Host ""
}

function Test-CommandExists {
    param([string]$Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# ═══════════════════════════════════════════════════════════════════════════
# PREREQUISITE CHECKS
# ═══════════════════════════════════════════════════════════════════════════

Write-Section "🔍 Checking Prerequisites"

# Check Node.js
if (Test-CommandExists node) {
    $nodeVersion = node --version
    Write-Status "Node.js found: $nodeVersion" "Success"
} else {
    Write-Status "Node.js not found. Please install from https://nodejs.org/" "Error"
    exit 1
}

# Check pnpm
if (Test-CommandExists pnpm) {
    $pnpmVersion = pnpm --version
    Write-Status "pnpm found: $pnpmVersion" "Success"
} else {
    Write-Status "pnpm not found. Installing..." "Warning"
    npm install -g pnpm
    if (Test-CommandExists pnpm) {
        $pnpmVersion = pnpm --version
        Write-Status "pnpm installed: $pnpmVersion" "Success"
    } else {
        Write-Status "Failed to install pnpm" "Error"
        exit 1
    }
}

# Check PostgreSQL (if not using Docker)
if (-not $DockerMode) {
    if (Test-CommandExists psql) {
        Write-Status "PostgreSQL found" "Success"
    } else {
        Write-Status "PostgreSQL not found. Use -DockerMode or install PostgreSQL" "Warning"
        $proceed = Read-Host "Continue with Docker mode? (y/n)"
        if ($proceed -eq 'y') {
            $DockerMode = $true
        } else {
            Write-Status "Please install PostgreSQL or use -DockerMode" "Error"
            exit 1
        }
    }
}

# Check Docker (if using Docker mode)
if ($DockerMode) {
    if (Test-CommandExists docker) {
        $dockerVersion = docker --version
        Write-Status "Docker found: $dockerVersion" "Success"
    } else {
        Write-Status "Docker not found. Install Docker Desktop or use local PostgreSQL" "Error"
        exit 1
    }
}

# ═══════════════════════════════════════════════════════════════════════════
# ENVIRONMENT SETUP
# ═══════════════════════════════════════════════════════════════════════════

Write-Section "🔧 Setting Up Environment"

if (Test-Path $envFile) {
    Write-Status ".env.local already exists. Skipping..." "Info"
} else {
    if (Test-Path $envExample) {
        Write-Status "Creating .env.local from .env.example" "Info"
        Copy-Item $envExample $envFile
        Write-Status ".env.local created. Please edit with your configuration" "Warning"
        
        # Prompt to edit
        $editNow = Read-Host "Edit .env.local now? (y/n)"
        if ($editNow -eq 'y') {
            if (Test-CommandExists code) {
                code $envFile
            } else {
                notepad $envFile
            }
        }
    } else {
        Write-Status ".env.example not found" "Error"
        exit 1
    }
}

# Load environment variables from .env.local
if (Test-Path $envFile) {
    Write-Status "Loading environment variables from .env.local" "Info"
    Get-Content $envFile | Where-Object { $_ -and !$_.StartsWith("#") } | ForEach-Object {
        $name, $value = $_ -split "=", 2
        if ($name -and $value) {
            [Environment]::SetEnvironmentVariable($name.Trim(), $value.Trim())
        }
    }
}

# ═══════════════════════════════════════════════════════════════════════════
# DOCKER SETUP (Optional)
# ═══════════════════════════════════════════════════════════════════════════

if ($DockerMode) {
    Write-Section "🐳 Starting Docker Services"
    
    Write-Status "Starting PostgreSQL and Redis containers..." "Info"
    try {
        Push-Location $projectRoot
        docker-compose -f docker-compose.dev.yml up -d
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Docker services started successfully" "Success"
            Start-Sleep -Seconds 3
            Write-Status "Waiting for PostgreSQL to be ready..." "Info"
            # Simple health check
            $maxAttempts = 30
            $attempt = 0
            while ($attempt -lt $maxAttempts) {
                $healthCheck = docker exec $(docker ps -qf "name=comicwise_db") pg_isready -U postgres 2>/dev/null
                if ($healthCheck -like "*accepting*") {
                    Write-Status "PostgreSQL is ready" "Success"
                    break
                }
                $attempt++
                Start-Sleep -Seconds 1
            }
            if ($attempt -ge $maxAttempts) {
                Write-Status "PostgreSQL health check timeout (continue anyway)" "Warning"
            }
        } else {
            Write-Status "Failed to start Docker services" "Error"
            exit 1
        }
        Pop-Location
    } catch {
        Write-Status "Docker error: $_" "Error"
        exit 1
    }
}

# ═══════════════════════════════════════════════════════════════════════════
# DEPENDENCY INSTALLATION
# ═══════════════════════════════════════════════════════════════════════════

if (-not $SkipInstall) {
    Write-Section "📦 Installing Dependencies"
    
    try {
        Push-Location $projectRoot
        Write-Status "Running pnpm install..." "Info"
        pnpm install
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Dependencies installed successfully" "Success"
        } else {
            Write-Status "pnpm install failed" "Error"
            Pop-Location
            exit 1
        }
        Pop-Location
    } catch {
        Write-Status "Installation error: $_" "Error"
        exit 1
    }
}

# ═══════════════════════════════════════════════════════════════════════════
# DATABASE SETUP
# ═══════════════════════════════════════════════════════════════════════════

if (-not $SkipDatabase) {
    Write-Section "🗄️  Setting Up Database"
    
    try {
        Push-Location $projectRoot
        
        # Check if .env.local has DATABASE_URL
        if (-not [Environment]::GetEnvironmentVariable("DATABASE_URL")) {
            Write-Status "DATABASE_URL not set. Please configure .env.local" "Error"
            Pop-Location
            exit 1
        }
        
        Write-Status "Pushing database schema..." "Info"
        pnpm db:push
        if ($LASTEXITCODE -ne 0) {
            Write-Status "Database push failed. Check DATABASE_URL and connection" "Error"
            Pop-Location
            exit 1
        }
        Write-Status "Database schema pushed successfully" "Success"
        
        Write-Status "Seeding database..." "Info"
        $seedOption = Read-Host "Skip images during seed? (y/n) [n]"
        if ($seedOption -eq 'y') {
            pnpm db:seed:no-images
        } else {
            pnpm db:seed
        }
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Database seeded successfully" "Success"
        } else {
            Write-Status "Database seeding completed with warnings" "Warning"
        }
        
        Pop-Location
    } catch {
        Write-Status "Database setup error: $_" "Error"
        Pop-Location
        exit 1
    }
}

# ═══════════════════════════════════════════════════════════════════════════
# VALIDATION CHECKS
# ═══════════════════════════════════════════════════════════════════════════

if (-not $SkipValidation) {
    Write-Section "✅ Running Validation Checks"
    
    try {
        Push-Location $projectRoot
        
        # Type check
        Write-Status "Running TypeScript type check..." "Info"
        pnpm type-check 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Type check passed" "Success"
        } else {
            Write-Status "Type check found issues (review manually)" "Warning"
        }
        
        # Lint check (warn only)
        Write-Status "Running ESLint..." "Info"
        pnpm lint 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Linting passed" "Success"
        } else {
            Write-Status "Linting found issues (review with: pnpm lint)" "Warning"
        }
        
        # Format check
        Write-Status "Checking code formatting..." "Info"
        pnpm format:check 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Code formatting is correct" "Success"
        } else {
            Write-Status "Code formatting issues found. Run: pnpm format" "Warning"
        }
        
        Pop-Location
    } catch {
        Write-Status "Validation error: $_" "Warning"
    }
}

# ═══════════════════════════════════════════════════════════════════════════
# DISPLAY NEXT STEPS & GITHUB COPILOT PROMPTS
# ═══════════════════════════════════════════════════════════════════════════

Write-Section "🚀 Setup Complete!"

Write-Host @"
$($colors.Green)✅ Your development environment is ready!$($colors.Reset)

$($colors.Bold)Next Steps:$($colors.Reset)
1. Edit .env.local with your actual configuration
2. Start the dev server: pnpm dev
3. Open http://localhost:3000 in your browser
4. Read SETUP_OPTIMIZED_FINAL.md for detailed documentation

$($colors.Bold)Useful Commands:$($colors.Reset)
  pnpm dev              - Start development server
  pnpm lint             - Run ESLint
  pnpm type-check       - Run TypeScript type checking
  pnpm format           - Format code with Prettier
  pnpm test             - Run Playwright E2E tests
  pnpm db:studio        - Open database GUI
  pnpm docker:down      - Stop Docker containers

$($colors.Bold)GitHub Copilot Chat Prompts:$($colors.Reset)

1️⃣  Audit Repository Health (P0)
---
Scan the repository for TypeScript errors, missing imports, and non-aliased 
import paths. Produce a minimal patch that fixes import paths from relative 
to '@/' aliases and remove stray unused variables. Show files changed and 
run validation after.

2️⃣  Harden Drizzle Typing (P1)
---
Audit the Drizzle schema and queries in src/database. Add or tighten 
TypeScript types for results returned by key queries (comics, chapters, users). 
Create src/types/database.d.ts with interface shapes and update top queries.

3️⃣  Wire NextAuth v5 + Drizzle Adapter (P1)
---
Ensure NextAuth v5 is configured via src/lib/authConfig.ts with Drizzle 
adapter, email provider, and session strategy. Add server-side helpers in 
src/lib/auth.ts and scaffold sign-in/sign-up pages.

4️⃣  Convert Admin Forms to Server Actions (P1)
---
For admin create/edit forms (artists, authors, comics, chapters), convert 
client form handlers to use Zod-validated server actions. Create Zod schemas 
and server actions, keep client components minimal.

5️⃣  Centralize Image Upload (P1/P2)
---
Ensure useImageUpload hook exists at src/hooks/useImageUpload.ts and is used 
by admin upload UI. Abstract upload providers in src/services/upload with 
uploadImage(file) signature. Support Cloudinary, ImageKit, and S3.

6️⃣  Scaffold Admin CRUD Pages (P2)
---
Create CRUD pages for Comics, Chapters, and Users using shadcn/ui components, 
Zod validation schemas, and server actions. Implement pagination, filtering, 
and email notifications on create/update events.

7️⃣  Setup CI/CD Pipeline (P2)
---
Generate .github/workflows/ci.yml that installs pnpm, runs type-check, lint, 
unit tests, and Playwright tests. Upload artifacts and set failure conditions.

8️⃣  Optimize Docker for Production (P2)
---
Audit Dockerfile and docker-compose.yml for best practices. Provide multi-stage 
build, security hardening, caching improvements, and health checks.

$($colors.Cyan)Quick Copy-Paste Tips:
- Use @filename in Copilot Chat to reference file context
- Use /fix slash command for quick bug fixes
- Use /explain to understand code without changes
- Batch 3-5 related tasks in one prompt to save tokens
$($colors.Reset)

$($colors.Bold)Documentation:$($colors.Reset)
📖 Read SETUP_OPTIMIZED_FINAL.md for complete setup guide
📖 Check setup.txt for task priorities
📖 View tasks.optimized.txt for detailed task breakdown

"@

# ═══════════════════════════════════════════════════════════════════════════
# START DEV SERVER (Optional)
# ═══════════════════════════════════════════════════════════════════════════

if ($DevMode) {
    Write-Host ""
    Write-Status "Starting development server..." "Info"
    Push-Location $projectRoot
    
    # Try to open browser
    if (Test-CommandExists Start-Process) {
        Start-Sleep -Seconds 2
        Start-Process "http://localhost:3000"
    }
    
    Write-Status "Dev server starting at http://localhost:3000" "Success"
    pnpm dev
    Pop-Location
}

Write-Host ""
Write-Host "$($colors.Green)Happy coding! 🎉$($colors.Reset)"
