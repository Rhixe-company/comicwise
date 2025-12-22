#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Fix all type-check and lint errors in the project
.DESCRIPTION
    Runs type-check and lint, attempts to auto-fix issues, and reports results
#>

param(
    [switch]$SkipTypeCheck,
    [switch]$SkipLint,
    [switch]$Verbose
)

$ErrorActionPreference = "Continue"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  ComicWise Error Fixer" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$projectRoot = Join-Path $PSScriptRoot ".."
Set-Location $projectRoot

# Function to count errors in output
function Count-Errors {
    param([string[]]$Output, [string]$Pattern)
    return ($Output | Select-String $Pattern).Count
}

# Step 1: Type Check
if (-not $SkipTypeCheck) {
    Write-Host "🔍 Running type-check...`n" -ForegroundColor Yellow
    
    $typeCheckOutput = pnpm type-check 2>&1
    $typeErrors = Count-Errors -Output $typeCheckOutput -Pattern "error TS"
    
    Write-Host "Type errors found: $typeErrors" -ForegroundColor $(if ($typeErrors -eq 0) { "Green" } else { "Red" })
    
    if ($typeErrors -gt 0 -and $Verbose) {
        Write-Host "`nSample errors:" -ForegroundColor Yellow
        $typeCheckOutput | Select-String "error TS" | Select-Object -First 10 | ForEach-Object {
            Write-Host "  $_" -ForegroundColor Red
        }
    }
    
    if ($typeErrors -gt 0) {
        Write-Host "`n⚠️  Type errors detected. Please review and fix manually." -ForegroundColor Yellow
        Write-Host "Common fixes:" -ForegroundColor Cyan
        Write-Host "  • Add missing type imports" -ForegroundColor Gray
        Write-Host "  • Fix module declarations in .d.ts files" -ForegroundColor Gray
        Write-Host "  • Update tsconfig.json paths" -ForegroundColor Gray
        Write-Host "  • Add missing properties to interfaces" -ForegroundColor Gray
    }
} else {
    Write-Host "⏭️  Skipping type-check`n" -ForegroundColor Gray
}

# Step 2: ESLint
if (-not $SkipLint) {
    Write-Host "`n🔍 Running ESLint...`n" -ForegroundColor Yellow
    
    # Try auto-fix first
    Write-Host "Attempting auto-fix..." -ForegroundColor Cyan
    $lintFixOutput = pnpm lint:fix 2>&1
    
    # Check remaining errors
    $lintCheckOutput = pnpm lint 2>&1
    $lintErrors = Count-Errors -Output $lintCheckOutput -Pattern "error"
    $lintWarnings = Count-Errors -Output $lintCheckOutput -Pattern "warning"
    
    Write-Host "`nLint errors:   $lintErrors" -ForegroundColor $(if ($lintErrors -eq 0) { "Green" } else { "Red" })
    Write-Host "Lint warnings: $lintWarnings" -ForegroundColor $(if ($lintWarnings -eq 0) { "Green" } else { "Yellow" })
    
    if (($lintErrors -gt 0 -or $lintWarnings -gt 0) -and $Verbose) {
        Write-Host "`nSample issues:" -ForegroundColor Yellow
        $lintCheckOutput | Select-String "error|warning" | Select-Object -First 10 | ForEach-Object {
            Write-Host "  $_" -ForegroundColor $(if ($_ -match "error") { "Red" } else { "Yellow" })
        }
    }
    
    if ($lintErrors -gt 0) {
        Write-Host "`n⚠️  Lint errors detected. Common fixes:" -ForegroundColor Yellow
        Write-Host "  • Add missing dependencies to useEffect" -ForegroundColor Gray
        Write-Host "  • Remove unused variables" -ForegroundColor Gray
        Write-Host "  • Fix import order" -ForegroundColor Gray
        Write-Host "  • Add proper type annotations" -ForegroundColor Gray
    }
} else {
    Write-Host "⏭️  Skipping lint`n" -ForegroundColor Gray
}

# Step 3: Format check
Write-Host "`n🔍 Checking code formatting...`n" -ForegroundColor Yellow

$formatCheckOutput = pnpm format:check 2>&1
$hasFormatIssues = $LASTEXITCODE -ne 0

if ($hasFormatIssues) {
    Write-Host "⚠️  Formatting issues detected. Running auto-format..." -ForegroundColor Yellow
    pnpm format 2>&1 | Out-Null
    Write-Host "✅ Code formatted" -ForegroundColor Green
} else {
    Write-Host "✅ Code is properly formatted" -ForegroundColor Green
}

# Step 4: Build check
Write-Host "`n🔍 Testing build...`n" -ForegroundColor Yellow

$buildOutput = pnpm build 2>&1
$buildSuccess = $LASTEXITCODE -eq 0

if ($buildSuccess) {
    Write-Host "✅ Build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed" -ForegroundColor Red
    if ($Verbose) {
        Write-Host "`nBuild errors:" -ForegroundColor Yellow
        $buildOutput | Select-String "error|Error|ERROR" | Select-Object -First 10 | ForEach-Object {
            Write-Host "  $_" -ForegroundColor Red
        }
    }
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Summary" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$allGood = $true

if (-not $SkipTypeCheck) {
    $typeCheckStatus = if ($typeErrors -eq 0) { "✅ PASS" } else { "❌ FAIL ($typeErrors errors)" }
    Write-Host "Type Check:  $typeCheckStatus" -ForegroundColor $(if ($typeErrors -eq 0) { "Green" } else { "Red" })
    if ($typeErrors -gt 0) { $allGood = $false }
}

if (-not $SkipLint) {
    $lintStatus = if ($lintErrors -eq 0) { "✅ PASS" } else { "❌ FAIL ($lintErrors errors, $lintWarnings warnings)" }
    Write-Host "Lint:        $lintStatus" -ForegroundColor $(if ($lintErrors -eq 0) { "Green" } else { "Red" })
    if ($lintErrors -gt 0) { $allGood = $false }
}

$formatStatus = if (-not $hasFormatIssues) { "✅ PASS" } else { "✅ FIXED" }
Write-Host "Format:      $formatStatus" -ForegroundColor Green

$buildStatus = if ($buildSuccess) { "✅ PASS" } else { "❌ FAIL" }
Write-Host "Build:       $buildStatus" -ForegroundColor $(if ($buildSuccess) { "Green" } else { "Red" })
if (-not $buildSuccess) { $allGood = $false }

Write-Host ""

if ($allGood) {
    Write-Host "🎉 All checks passed! Project is ready." -ForegroundColor Green
    exit 0
} else {
    Write-Host "⚠️  Some issues require manual fixes. Check the output above." -ForegroundColor Yellow
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "  1. Review error messages above" -ForegroundColor Gray
    Write-Host "  2. Fix issues manually" -ForegroundColor Gray
    Write-Host "  3. Run this script again to verify" -ForegroundColor Gray
    Write-Host "  4. Run 'pnpm type-check' and 'pnpm lint' for details" -ForegroundColor Gray
    exit 1
}

Write-Host ""
