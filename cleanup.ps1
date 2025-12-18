# ComicWise Project Cleanup Script (PowerShell)
# Removes unused files, duplicate documentation, and temporary artifacts
# Run this script from the project root directory

# Color output
function Write-Header {
    param([string]$message)
    Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║ $($message.PadRight(62)) ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
}

function Write-Section {
    param([string]$message)
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
    Write-Host "$message" -ForegroundColor Yellow
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
    Write-Host ""
}

function Delete-File {
    param(
        [string]$filePath,
        [string]$reason = "unused"
    )
    
    if (Test-Path $filePath) {
        $file = Get-Item $filePath
        $size = $file.Length
        Remove-Item $filePath -Force
        Write-Host "  ✓ Deleted: $filePath ($reason)" -ForegroundColor Green
        return $size
    }
    return 0
}

# Initialize counters
$deletedFiles = 0
$deletedDirs = 0
$savedSpace = 0

Write-Header "ComicWise Project Cleanup Tool v1.0"
Write-Host ""
Write-Host "Removing unused code, duplicates, and temporary files" -ForegroundColor White
Write-Host ""

Write-Section "1. REMOVING DUPLICATE DOCUMENTATION FILES"

$docFiles = @(
    # ESLint documentation
    "ESLINT_15_PLUGINS_CONFIG_COMPLETE.md",
    "ESLINT_ALL_PLUGINS_GUIDE.md",
    "ESLINT_AUDIT_REPORT.md",
    "ESLINT_CONFIGURATION_COMPLETE_REPORT.md",
    "ESLINT_CONFIGURATION_EXECUTION_COMPLETE.md",
    "ESLINT_CONFIGURATION_INDEX.md",
    "ESLINT_CONFIGURATION_UPDATE_SUMMARY.md",
    "ESLINT_CONFIG_ANALYSIS.md",
    "ESLINT_CONFIG_COMPLETION.md",
    "ESLINT_CONFIG_COMPLETION_REPORT.txt",
    "ESLINT_CONFIG_VERIFICATION.md",
    "ESLINT_GITHUB_ACTIONS_IMPLEMENTATION.md",
    "ESLINT_IMPLEMENTATION_COMPLETE.md",
    "ESLINT_PLUGINS_COMPREHENSIVE_GUIDE.md",
    "ESLINT_PLUGINS_CONFIGURATION_COMPLETE.md",
    "ESLINT_PLUGINS_CONFIGURATION_SUMMARY.md",
    "ESLINT_PLUGINS_CONFIG_INDEX.md",
    "ESLINT_PLUGINS_INSTALLATION_CHECKLIST.md",
    "ESLINT_PRETTIER_CONFIGURATION_COMPLETE.txt",
    "ESLINT_PRETTIER_SETUP_COMPLETE.md",
    "ESLINT_QUICK_REFERENCE.txt",
    "ESLINT_QUICK_START.md",
    "ESLINT_UPDATE_DETAILS.md",
    "ESLINT_VERIFICATION_CHECKLIST.txt",
    "ESLINT_VERIFICATION_FINAL.md",
    "ESLINT_VSCODE_SETUP_COMPLETE.md",
    
    # Database documentation
    "DATABASE_AUDIT_COMPLETE.md",
    "DATABASE_AUDIT_P1.1.md",
    "DATABASE_QUERY_EXAMPLES.md",
    "DATABASE_SCHEMA_AUDIT.md",
    
    # Admin documentation
    "ADMIN_COMICS_QUICK_REFERENCE.md",
    "ADMIN_COMICS_TESTING_GUIDE.md",
    "ADMIN_CRUD_IMPLEMENTATION.md",
    "ADMIN_FEATURES_IMPLEMENTATION_GUIDE.md",
    "ADMIN_FEATURES_QUICK_REFERENCE.md",
    
    # Environment documentation
    "COMPLETE_ENV_EXAMPLE.md",
    "ENV_CONFIGURATION_GUIDE.md",
    "ENV_SETUP_COMPLETE.md",
    "ENV_USAGE_EXAMPLE.md",
    
    # Old completion/report files
    "COMPLETION_REPORT.md",
    "CONFIG_COMPLETION_SUMMARY.md",
    "CONFIG_REVIEW_CHECKLIST.md",
    "CONFIG_VERIFICATION_REPORT.md",
    "EXECUTION_COMPLETE.md",
    "FINAL_COMPLETION_REPORT.md",
    "FINAL_CONFIG_STATUS_REPORT.md",
    "FINAL_ESLINT_CONFIGURATION_SUMMARY.md",
    "FINAL_IMPLEMENTATION_REPORT.md",
    "FINAL_REPORT.txt",
    "FINAL_SETUP_SUMMARY.md",
    "IMPLEMENTATION_COMPLETE.txt",
    "IMPLEMENTATION_COMPLETE_SUMMARY.md",
    "IMPLEMENTATION_COMPLETE_SUMMARY.txt",
    "PATCH_COMPLETION_REPORT.txt",
    "PATCH_VERIFICATION.md",
    "SETUP_COMPLETE.md",
    "SETUP_COMPLETE.txt",
    "SETUP_COMPLETE_WITH_FIXES.md",
    "SETUP_COMPLETION_SUMMARY.md",
    "SETUP_GENERATION_SUMMARY.md",
    
    # Image upload documentation
    "IMAGE_UPLOAD_COMPLETION_REPORT.md",
    "IMAGE_UPLOAD_DOCUMENTATION_INDEX.md",
    "IMAGE_UPLOAD_FINAL_CHECKLIST.md",
    "IMAGE_UPLOAD_INFRASTRUCTURE.md",
    "IMAGE_UPLOAD_QUICK_REFERENCE.md",
    "IMAGE_UPLOAD_SETUP_SUMMARY.md",
    
    # Old setup documentation
    "README_SETUP.md",
    "SETUP_CHECKLIST.md",
    "SETUP_OPTIMIZED.md",
    "SETUP_OPTIMIZED_FINAL.md",
    "SETUP_QUICK_REFERENCE.md",
    "SetupProject.md",
    
    # Old quick reference/guides
    "QUICK_COMMAND_REFERENCE.md",
    "QUICK_REFERENCE.md",
    "QUICK_START_NEW_FEATURES.md",
    "README_GENERATED_DOCS.md",
    
    # Old feature documentation
    "NEXTAUTH_SCAFFOLDING_COMPLETE.md",
    "NEXTAUTH_V5_SETUP_COMPLETE.md",
    "SERVER_ACTIONS_COMPLETE_P3.2.md",
    "SERVER_ACTIONS_IMPLEMENTATION.md",
    "LINTING_ANALYSIS_REPORT.md",
    "LINTING_FIX_GUIDE.md",
    "LINTING_FORMATTING_GUIDE.md",
    "PRIORITY_SYSTEM.md",
    "PRIORITY_SYSTEM_CHECKLIST.md",
    "PRIORITY_SYSTEM_COMPLETE.md",
    "SCHEMA_SEED_OPTIMIZATION.md",
    "SCRIPTS_DOCUMENTATION_INDEX.md",
    "SCRIPTS_FINAL_SUMMARY.md",
    "SCRIPTS_GUIDE.md",
    "SCRIPTS_OPTIMIZATION_REPORT.md",
    "PROJECT_COMPLETION_REPORT.md",
    "PROJECT_COMPLETION_SUMMARY.md",
    "IMPLEMENTATION_VERIFICATION.md",
    "IMPORT_FIX_SUMMARY.md",
    "TESTING_IMPLEMENTATION_CHECKLIST.md",
    "CHANGED_FILES_LIST.txt",
    "COMPLETE_ESLINT_CONFIGURATION_SUMMARY.md",
    "DOCUMENTATION_INDEX.md",
    "GENERATED_DOCUMENTATION.md",
    "GITHUB_COPILOT_PROMPTS.md",
    "IMPLEMENTATION_SUMMARY.md",
    "OPTIONAL_ENHANCEMENTS.md",
    "PACKAGES.md",
    "PROJECT_CONFIGURATION_AUDIT.md"
)

Write-Host "Removing ESLint documentation..." -ForegroundColor Gray
foreach ($file in $docFiles) {
    $size = Delete-File $file "old version"
    $savedSpace += $size
    $deletedFiles++
}

Write-Section "2. REMOVING TEMPORARY LOG/OUTPUT FILES"

$logFiles = @(
    "lint.txt",
    "lint_output.txt",
    "lint_strict.txt",
    "generate.txt",
    "type-check-errors.txt",
    "setup.txt",
    "setup_v2.txt",
    "promp.txt",
    "project-words.txt"
)

foreach ($file in $logFiles) {
    $size = Delete-File $file "temp log"
    $savedSpace += $size
    $deletedFiles++
}

Write-Section "3. REMOVING OLD CONFIGURATION/SETUP FILES"

$configFiles = @(
    "PRIORITY_SYSTEM_START.sh",
    "setup-dev-environment.ps1",
    "test-docker.sh",
    "TODO.md",
    "Todos.md",
    "tasks.txt",
    "tasks.optimized.txt"
)

foreach ($file in $configFiles) {
    $size = Delete-File $file "old/unused"
    $savedSpace += $size
    $deletedFiles++
}

Write-Section "4. REMOVING DUPLICATE DATA FILES"

Write-Host "Keeping only one version of seed data files..." -ForegroundColor Gray

$dataFiles = @(
    "comics.json",
    "comicsdata2.json",
    "chapters.json",
    "chaptersdata2.json"
)

foreach ($file in $dataFiles) {
    $size = Delete-File $file "duplicate"
    $savedSpace += $size
    $deletedFiles++
}

Write-Section "5. REMOVING UNNECESSARY CONFIGURATION FILES"

$unused = @(
    "Makefile",
    ".hintrc"
)

foreach ($file in $unused) {
    $size = Delete-File $file "unused"
    $savedSpace += $size
    $deletedFiles++
}

Write-Section "CLEANUP SUMMARY"

Write-Host "  Files deleted: $deletedFiles" -ForegroundColor Green
Write-Host "  Space freed: ~$([Math]::Round($savedSpace / 1MB, 2)) MB" -ForegroundColor Green
Write-Host ""

Write-Section "✅ Cleanup Complete!"

Write-Host "Kept essential files:" -ForegroundColor Cyan
Write-Host "  ✓ COMPLETE_IMPLEMENTATION_REPORT.md (main reference)" -ForegroundColor White
Write-Host "  ✓ COMPLETE_PROJECT_INDEX.md (project navigation)" -ForegroundColor White
Write-Host "  ✓ DEVELOPER_QUICK_REFERENCE.md (code examples)" -ForegroundColor White
Write-Host "  ✓ CONFIGURATION_IMPLEMENTATION_GUIDE.md (setup guide)" -ForegroundColor White
Write-Host "  ✓ README.md (project overview)" -ForegroundColor White
Write-Host ""

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Review src/ directory for unused code" -ForegroundColor White
Write-Host "  2. Run: pnpm type-check" -ForegroundColor White
Write-Host "  3. Run: pnpm lint" -ForegroundColor White
Write-Host "  4. Commit changes: git add -A && git commit -m 'cleanup: remove duplicate files'" -ForegroundColor White
Write-Host ""
