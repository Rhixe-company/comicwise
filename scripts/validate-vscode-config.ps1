# VSCode Configuration Validator - Simple Version
# Quick validation without complex features

param(
    [switch]$InstallExtensions
)

$ErrorActionPreference = "Continue"

# Colors
function Write-Success { param($msg) Write-Host $msg -ForegroundColor Green }
function Write-Error { param($msg) Write-Host $msg -ForegroundColor Red }
function Write-Info { param($msg) Write-Host $msg -ForegroundColor Cyan }
function Write-Warning { param($msg) Write-Host $msg -ForegroundColor Yellow }

Write-Info "`n═══════════════════════════════════════════════════════════════"
Write-Info "  ComicWise VSCode Configuration Validator"
Write-Info "═══════════════════════════════════════════════════════════════`n"

# Check prerequisites
Write-Info "Checking Prerequisites...`n"

$prereqs = @{
    "Node.js" = "node"
    "pnpm" = "pnpm"
    "Git" = "git"
}

$allGood = $true
foreach ($prereq in $prereqs.GetEnumerator()) {
    if (Get-Command $prereq.Value -ErrorAction SilentlyContinue) {
        $version = & $prereq.Value --version 2>$null
        Write-Success "✅ $($prereq.Key): $version"
    } else {
        Write-Error "❌ $($prereq.Key): Not found"
        $allGood = $false
    }
}

# Validate configuration files
Write-Info "`nValidating Configuration Files...`n"

$vscodeDir = ".vscode"
$files = @("mcp.json", "extensions.json", "launch.json", "tasks.json", "settings.json")

$allValid = $true
foreach ($file in $files) {
    $path = Join-Path $vscodeDir $file
    if (Test-Path $path) {
        try {
            $null = Get-Content $path -Raw | ConvertFrom-Json
            Write-Success "✅ $file - Valid JSON"
        } catch {
            Write-Error "❌ $file - Invalid: $($_.Exception.Message)"
            $allValid = $false
        }
    } else {
        Write-Warning "⚠️  $file - Not found"
        $allValid = $false
    }
}

# Check backups
Write-Info "`nChecking Backups...`n"

foreach ($file in $files) {
    $backup = Join-Path $vscodeDir "$file.backup"
    if (Test-Path $backup) {
        Write-Success "✅ $file.backup exists"
    } else {
        Write-Warning "⚠️  $file.backup not found"
    }
}

# Install extensions if requested
if ($InstallExtensions) {
    Write-Info "`nInstalling Extensions...`n"
    
    if (-not (Get-Command "code" -ErrorAction SilentlyContinue)) {
        Write-Error "❌ VSCode CLI 'code' command not found"
        Write-Warning "💡 Add VSCode to PATH or install extensions manually"
    } else {
        $extensionsPath = Join-Path $vscodeDir "extensions.json"
        if (Test-Path $extensionsPath) {
            try {
                $extensionsConfig = Get-Content $extensionsPath -Raw | ConvertFrom-Json
                $extensions = $extensionsConfig.recommendations
                
                Write-Info "📦 Found $($extensions.Count) recommended extensions`n"
                
                # Get installed extensions
                $installedExtensions = code --list-extensions 2>$null
                
                $toInstall = @()
                $alreadyInstalled = 0
                
                foreach ($ext in $extensions) {
                    if ($installedExtensions -contains $ext) {
                        $alreadyInstalled++
                    } else {
                        $toInstall += $ext
                    }
                }
                
                Write-Info "✅ Already installed: $alreadyInstalled"
                Write-Info "📥 To install: $($toInstall.Count)`n"
                
                if ($toInstall.Count -gt 0) {
                    $installed = 0
                    $failed = 0
                    
                    foreach ($ext in $toInstall) {
                        Write-Host "📦 Installing $ext..." -NoNewline
                        
                        try {
                            $result = code --install-extension $ext --force 2>&1
                            if ($LASTEXITCODE -eq 0) {
                                Write-Success " ✅"
                                $installed++
                            } else {
                                Write-Error " ❌"
                                $failed++
                            }
                        } catch {
                            Write-Error " ❌"
                            $failed++
                        }
                    }
                    
                    Write-Host ""
                    Write-Success "✅ Installed: $installed"
                    if ($failed -gt 0) {
                        Write-Error "❌ Failed: $failed"
                    }
                } else {
                    Write-Success "🎉 All extensions already installed!"
                }
            } catch {
                Write-Error "❌ Error reading extensions.json: $($_.Exception.Message)"
            }
        }
    }
}

# Summary
Write-Info "`n═══════════════════════════════════════════════════════════════"
Write-Info "  Summary"
Write-Info "═══════════════════════════════════════════════════════════════`n"

if ($allGood -and $allValid) {
    Write-Success "✅ All checks passed!"
} else {
    Write-Warning "⚠️  Some issues found - review output above"
}

Write-Info "`n💡 To install extensions, run:"
Write-Info "   .\scripts\validate-vscode-config.ps1 -InstallExtensions`n"

Write-Info "📚 For full details, see:"
Write-Info "   VSCODE_CONFIGURATION_REPORT.md`n"
