#!/bin/bash
# ComicWise Project Cleanup Script
# Removes unused files, duplicate documentation, and temporary artifacts
# Run this script from the project root directory

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           ComicWise Project Cleanup Tool v1.0                 ║"
echo "║       Removing unused code, duplicates, and temporary files    ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Track statistics
DELETED_FILES=0
DELETED_DIRS=0
SAVED_SPACE=0

# Function to safely delete files
delete_file() {
    local file="$1"
    local reason="$2"
    if [ -f "$file" ]; then
        local size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo 0)
        SAVED_SPACE=$((SAVED_SPACE + size))
        rm "$file"
        echo "  ✓ Deleted: $file ($reason)"
        ((DELETED_FILES++))
    fi
}

# Function to safely delete directories
delete_dir() {
    local dir="$1"
    local reason="$2"
    if [ -d "$dir" ]; then
        local size=$(du -sh "$dir" 2>/dev/null | cut -f1)
        rm -rf "$dir"
        echo "  ✓ Deleted: $dir ($reason) - $size"
        ((DELETED_DIRS++))
    fi
}

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "1. REMOVING DUPLICATE DOCUMENTATION FILES"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Remove old ESLint configuration documentation (keep latest only)
echo "  Cleaning ESLint documentation (keeping latest)..."
delete_file "ESLINT_15_PLUGINS_CONFIG_COMPLETE.md" "old version"
delete_file "ESLINT_ALL_PLUGINS_GUIDE.md" "old version"
delete_file "ESLINT_AUDIT_REPORT.md" "old version"
delete_file "ESLINT_CONFIGURATION_COMPLETE_REPORT.md" "old version"
delete_file "ESLINT_CONFIGURATION_EXECUTION_COMPLETE.md" "old version"
delete_file "ESLINT_CONFIGURATION_INDEX.md" "old version"
delete_file "ESLINT_CONFIGURATION_UPDATE_SUMMARY.md" "old version"
delete_file "ESLINT_CONFIG_ANALYSIS.md" "old version"
delete_file "ESLINT_CONFIG_COMPLETION.md" "old version"
delete_file "ESLINT_CONFIG_COMPLETION_REPORT.txt" "old version"
delete_file "ESLINT_CONFIG_VERIFICATION.md" "old version"
delete_file "ESLINT_GITHUB_ACTIONS_IMPLEMENTATION.md" "old version"
delete_file "ESLINT_IMPLEMENTATION_COMPLETE.md" "old version"
delete_file "ESLINT_PLUGINS_COMPREHENSIVE_GUIDE.md" "old version"
delete_file "ESLINT_PLUGINS_CONFIGURATION_COMPLETE.md" "old version"
delete_file "ESLINT_PLUGINS_CONFIGURATION_SUMMARY.md" "old version"
delete_file "ESLINT_PLUGINS_CONFIG_INDEX.md" "old version"
delete_file "ESLINT_PLUGINS_INSTALLATION_CHECKLIST.md" "old version"
delete_file "ESLINT_PRETTIER_CONFIGURATION_COMPLETE.txt" "old version"
delete_file "ESLINT_PRETTIER_SETUP_COMPLETE.md" "old version"
delete_file "ESLINT_QUICK_REFERENCE.txt" "old version"
delete_file "ESLINT_QUICK_START.md" "old version"
delete_file "ESLINT_UPDATE_DETAILS.md" "old version"
delete_file "ESLINT_VERIFICATION_CHECKLIST.txt" "old version"
delete_file "ESLINT_VERIFICATION_FINAL.md" "old version"
delete_file "ESLINT_VSCODE_SETUP_COMPLETE.md" "old version"

# Remove old database documentation
echo "  Cleaning database documentation..."
delete_file "DATABASE_AUDIT_COMPLETE.md" "old version"
delete_file "DATABASE_AUDIT_P1.1.md" "old version"
delete_file "DATABASE_QUERY_EXAMPLES.md" "old version"
delete_file "DATABASE_SCHEMA_AUDIT.md" "old version"

# Remove old admin documentation
echo "  Cleaning admin documentation..."
delete_file "ADMIN_COMICS_QUICK_REFERENCE.md" "old version"
delete_file "ADMIN_COMICS_TESTING_GUIDE.md" "old version"
delete_file "ADMIN_CRUD_IMPLEMENTATION.md" "old version"
delete_file "ADMIN_FEATURES_IMPLEMENTATION_GUIDE.md" "old version"
delete_file "ADMIN_FEATURES_QUICK_REFERENCE.md" "old version"

# Remove old environment documentation
echo "  Cleaning environment documentation..."
delete_file "COMPLETE_ENV_EXAMPLE.md" "old version"
delete_file "ENV_CONFIGURATION_GUIDE.md" "old version"
delete_file "ENV_SETUP_COMPLETE.md" "old version"
delete_file "ENV_USAGE_EXAMPLE.md" "old version"

# Remove old completion/report files
echo "  Cleaning old completion reports..."
delete_file "COMPLETION_REPORT.md" "old version"
delete_file "CONFIG_COMPLETION_SUMMARY.md" "old version"
delete_file "CONFIG_REVIEW_CHECKLIST.md" "old version"
delete_file "CONFIG_VERIFICATION_REPORT.md" "old version"
delete_file "EXECUTION_COMPLETE.md" "old version"
delete_file "FINAL_COMPLETION_REPORT.md" "old version"
delete_file "FINAL_CONFIG_STATUS_REPORT.md" "old version"
delete_file "FINAL_ESLINT_CONFIGURATION_SUMMARY.md" "old version"
delete_file "FINAL_IMPLEMENTATION_REPORT.md" "old version"
delete_file "FINAL_REPORT.txt" "old version"
delete_file "FINAL_SETUP_SUMMARY.md" "old version"
delete_file "IMPLEMENTATION_COMPLETE.txt" "old version"
delete_file "IMPLEMENTATION_COMPLETE_SUMMARY.md" "old version"
delete_file "IMPLEMENTATION_COMPLETE_SUMMARY.txt" "old version"
delete_file "PATCH_COMPLETION_REPORT.txt" "old version"
delete_file "PATCH_VERIFICATION.md" "old version"
delete_file "SETUP_COMPLETE.md" "old version"
delete_file "SETUP_COMPLETE.txt" "old version"
delete_file "SETUP_COMPLETE_WITH_FIXES.md" "old version"
delete_file "SETUP_COMPLETION_SUMMARY.md" "old version"
delete_file "SETUP_GENERATION_SUMMARY.md" "old version"

# Remove old image upload documentation
echo "  Cleaning image upload documentation..."
delete_file "IMAGE_UPLOAD_COMPLETION_REPORT.md" "old version"
delete_file "IMAGE_UPLOAD_DOCUMENTATION_INDEX.md" "old version"
delete_file "IMAGE_UPLOAD_FINAL_CHECKLIST.md" "old version"
delete_file "IMAGE_UPLOAD_INFRASTRUCTURE.md" "old version"
delete_file "IMAGE_UPLOAD_QUICK_REFERENCE.md" "old version"
delete_file "IMAGE_UPLOAD_SETUP_SUMMARY.md" "old version"

# Remove old setup documentation
echo "  Cleaning old setup documentation..."
delete_file "README_SETUP.md" "old version"
delete_file "SETUP_CHECKLIST.md" "old version"
delete_file "SETUP_OPTIMIZED.md" "old version"
delete_file "SETUP_OPTIMIZED_FINAL.md" "old version"
delete_file "SETUP_QUICK_REFERENCE.md" "old version"
delete_file "SetupProject.md" "old version"

# Remove old quick reference/guides
echo "  Cleaning old guides..."
delete_file "QUICK_COMMAND_REFERENCE.md" "old version"
delete_file "QUICK_REFERENCE.md" "old version"
delete_file "QUICK_START_NEW_FEATURES.md" "old version"
delete_file "README_GENERATED_DOCS.md" "old version"

# Remove old feature documentation
echo "  Cleaning old feature documentation..."
delete_file "NEXTAUTH_SCAFFOLDING_COMPLETE.md" "old version"
delete_file "NEXTAUTH_V5_SETUP_COMPLETE.md" "old version"
delete_file "SERVER_ACTIONS_COMPLETE_P3.2.md" "old version"
delete_file "SERVER_ACTIONS_IMPLEMENTATION.md" "old version"
delete_file "LINTING_ANALYSIS_REPORT.md" "old version"
delete_file "LINTING_FIX_GUIDE.md" "old version"
delete_file "LINTING_FORMATTING_GUIDE.md" "old version"
delete_file "PRIORITY_SYSTEM.md" "old version"
delete_file "PRIORITY_SYSTEM_CHECKLIST.md" "old version"
delete_file "PRIORITY_SYSTEM_COMPLETE.md" "old version"
delete_file "SCHEMA_SEED_OPTIMIZATION.md" "old version"
delete_file "SCRIPTS_DOCUMENTATION_INDEX.md" "old version"
delete_file "SCRIPTS_FINAL_SUMMARY.md" "old version"
delete_file "SCRIPTS_GUIDE.md" "old version"
delete_file "SCRIPTS_OPTIMIZATION_REPORT.md" "old version"

# Remove old completion reports
echo "  Cleaning other old reports..."
delete_file "PROJECT_COMPLETION_REPORT.md" "old version"
delete_file "PROJECT_COMPLETION_SUMMARY.md" "old version"
delete_file "IMPLEMENTATION_VERIFICATION.md" "old version"
delete_file "IMPORT_FIX_SUMMARY.md" "old version"
delete_file "TESTING_IMPLEMENTATION_CHECKLIST.md" "old version"
delete_file "CHANGED_FILES_LIST.txt" "old version"
delete_file "COMPLETE_ESLINT_CONFIGURATION_SUMMARY.md" "old version"
delete_file "DOCUMENTATION_INDEX.md" "old version"
delete_file "GENERATED_DOCUMENTATION.md" "old version"
delete_file "GITHUB_COPILOT_PROMPTS.md" "old version"
delete_file "IMPLEMENTATION_SUMMARY.md" "old version"
delete_file "OPTIONAL_ENHANCEMENTS.md" "old version"
delete_file "PACKAGES.md" "old version"
delete_file "PROJECT_CONFIGURATION_AUDIT.md" "old version"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "2. REMOVING TEMPORARY LOG/OUTPUT FILES"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Remove log and output files
delete_file "lint.txt" "temp log"
delete_file "lint_output.txt" "temp log"
delete_file "lint_strict.txt" "temp log"
delete_file "generate.txt" "temp output"
delete_file "type-check-errors.txt" "temp log"
delete_file "setup.txt" "old setup log"
delete_file "setup_v2.txt" "old setup log"
delete_file "promp.txt" "temp file"
delete_file "project-words.txt" "temp file"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "3. REMOVING OLD CONFIGURATION/SETUP FILES"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Remove old setup scripts
delete_file "PRIORITY_SYSTEM_START.sh" "old script"
delete_file "setup-dev-environment.ps1" "old script"
delete_file "test-docker.sh" "old script"

# Remove old task files
delete_file "TODO.md" "old todos"
delete_file "Todos.md" "old todos"
delete_file "tasks.txt" "old tasks"
delete_file "tasks.optimized.txt" "old tasks"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "4. REMOVING DUPLICATE DATA FILES"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Keep only one version of data files (use comicsdata1.json, chaptersdata1.json, etc. as reference)
# These are likely duplicate seed data
delete_file "comics.json" "duplicate seed data"
delete_file "comicsdata2.json" "duplicate seed data"
delete_file "chapters.json" "duplicate seed data"
delete_file "chaptersdata2.json" "duplicate seed data"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "5. REMOVING UNNECESSARY CONFIGURATION FILES"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Remove Makefile (using pnpm instead)
delete_file "Makefile" "unused (using pnpm)"

# Remove old configuration files
delete_file ".hintrc" "unused linter config"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "CLEANUP SUMMARY"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "  Files deleted: $DELETED_FILES"
echo "  Directories deleted: $DELETED_DIRS"
echo "  Space freed: ~$(numfmt --to=iec-i --suffix=B $SAVED_SPACE 2>/dev/null || echo $SAVED_SPACE bytes)"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "✅ Cleanup Complete!"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Kept essential files:"
echo "  ✓ COMPLETE_IMPLEMENTATION_REPORT.md (main reference)"
echo "  ✓ COMPLETE_PROJECT_INDEX.md (project navigation)"
echo "  ✓ DEVELOPER_QUICK_REFERENCE.md (code examples)"
echo "  ✓ CONFIGURATION_IMPLEMENTATION_GUIDE.md (setup guide)"
echo "  ✓ README.md (project overview)"
echo ""
echo "Next steps:"
echo "  1. Review src/ directory for unused code"
echo "  2. Run: npm run type-check"
echo "  3. Run: npm run lint"
echo "  4. Commit changes: git add -A && git commit -m 'cleanup: remove duplicate files'"
echo ""
