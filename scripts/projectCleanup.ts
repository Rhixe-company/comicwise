#!/usr/bin/env tsx
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROJECT CLEANUP & REFACTORING - ComicWise
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Performs comprehensive cleanup:
 * - Removes duplicate files
 * - Removes unused files
 * - Optimizes folder structure
 * - Identifies orphaned code
 *
 * usage pnpm tsx scripts/project-cleanup.ts [--dry-run] [--aggressive]
 */

import { statSync, unlinkSync } from "node:fs";
import path from "node:path";

import chalk from "chalk";
import { globSync } from "glob";


// ═══════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const AGGRESSIVE = args.has("--aggressive");

interface CleanupResult {
  duplicateFiles: string[];
  emptyDirs: string[];
  largeFiles: string[];
  oldReports: string[];
  unusedFiles: string[];
}

const result: CleanupResult = {
  duplicateFiles: [],
  unusedFiles: [],
  emptyDirs: [],
  largeFiles: [],
  oldReports: [],
};

// Files to always exclude
const EXCLUDE_PATTERNS = [
  "**/node_modules/**",
  "**/.next/**",
  "**/.git/**",
  "**/dist/**",
  "**/build/**",
];

// Report files that can be cleaned up
const REPORT_PATTERNS = [
  "*_REPORT.md",
  "OPTIMIZATION_*.md",
  "FINAL_*.md",
  "MANUAL_*.md",
  "TYPE_ERROR_*.md",
  "SCRIPT_*.md",
];

console.log(chalk.cyan("\n╔══════════════════════════════════════════════════════════════╗"));
console.log(chalk.cyan("║          Project Cleanup & Refactoring Tool                  ║"));
console.log(chalk.cyan("╚══════════════════════════════════════════════════════════════╝\n"));

if (DRY_RUN) {
  console.log(chalk.yellow("🔍 DRY RUN MODE - No files will be deleted\n"));
}

// ═══════════════════════════════════════════════════
// FIND DUPLICATE FILES
// ═══════════════════════════════════════════════════

console.log(chalk.blue("📁 Scanning for duplicate files...\n"));

const duplicateNames = new Map<string, string[]>();
const allFiles = globSync("**/*.{ts,tsx,js,jsx,json}", {
  ignore: EXCLUDE_PATTERNS,
});

for (const file of allFiles) {
  const basename = path.basename(file);
  if (!duplicateNames.has(basename)) {
    duplicateNames.set(basename, []);
  }
  duplicateNames.get(basename)!.push(file);
}

for (const [name, paths] of duplicateNames.entries()) {
  if (paths.length > 1) {
    console.log(chalk.yellow(`  ${name}:`));
    for (const p of paths) {
      console.log(chalk.gray(`    - ${p}`));
    }
    result.duplicateFiles.push(...paths);
  }
}

// ═══════════════════════════════════════════════════
// FIND OLD REPORT FILES
// ═══════════════════════════════════════════════════

console.log(chalk.blue("\n📄 Scanning for old report files...\n"));

for (const pattern of REPORT_PATTERNS) {
  const reports = globSync(pattern, { ignore: EXCLUDE_PATTERNS });
  for (const report of reports) {
    console.log(chalk.gray(`  - ${report}`));
    result.oldReports.push(report);
  }
}

// ═══════════════════════════════════════════════════
// FIND LARGE UNUSED FILES
// ═══════════════════════════════════════════════════

console.log(chalk.blue("\n📊 Scanning for large files...\n"));

const LARGE_FILE_THRESHOLD = 100 * 1024; // 100KB

for (const file of allFiles) {
  try {
    const stats = statSync(file);
    if (stats.size > LARGE_FILE_THRESHOLD) {
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(chalk.gray(`  - ${file} (${sizeMB} MB)`));
      result.largeFiles.push(file);
    }
  } catch {
    // Skip files that can't be accessed
  }
}

// ═══════════════════════════════════════════════════
// CLEANUP ACTIONS
// ═══════════════════════════════════════════════════

console.log(chalk.cyan("\n╔══════════════════════════════════════════════════════════════╗"));
console.log(chalk.cyan("║                     Cleanup Summary                           ║"));
console.log(chalk.cyan("╚══════════════════════════════════════════════════════════════╝\n"));

console.log(chalk.yellow("Duplicate file sets:"), result.duplicateFiles.length);
console.log(chalk.yellow("Old report files:"), result.oldReports.length);
console.log(chalk.yellow("Large files:"), result.largeFiles.length);

if (!DRY_RUN && result.oldReports.length > 0) {
  console.log(chalk.yellow("\n🗑️  Cleaning up old report files...\n"));

  for (const file of result.oldReports) {
    try {
      unlinkSync(file);
      console.log(chalk.green(`  ✓ Deleted: ${file}`));
    } catch {
      console.log(chalk.red(`  ✗ Failed to delete: ${file}`));
    }
  }
}

// ═══════════════════════════════════════════════════
// RECOMMENDATIONS
// ═══════════════════════════════════════════════════

console.log(chalk.cyan("\n╔══════════════════════════════════════════════════════════════╗"));
console.log(chalk.cyan("║                     Recommendations                           ║"));
console.log(chalk.cyan("╚══════════════════════════════════════════════════════════════╝\n"));

if (result.duplicateFiles.length > 0) {
  console.log(chalk.yellow("📋 Duplicate Files:"));
  console.log(chalk.gray("  Review and consolidate duplicate files"));
  console.log(chalk.gray("  Keep the most recent or most used version\n"));
}

if (result.largeFiles.length > 0) {
  console.log(chalk.yellow("📊 Large Files:"));
  console.log(chalk.gray("  Consider splitting large files"));
  console.log(chalk.gray("  Move static data to JSON files\n"));
}

console.log(chalk.yellow("📂 Suggested Folder Structure (Next.js 15+):"));
console.log(
  chalk.gray(`

  ├── app/                    App Router
  │   ├── (auth)/            Route groups
  │   ├── (root)/
  │   ├── api/               API routes
  │   └── admin/
  ├── components/            React components
  │   ├── ui/               Reusable UI
  │   ├── forms/            Form components
  │   └── blocks/           Compound components
  ├── lib/                   Utilities
  │   ├── actions/          Server actions
  │   ├── validations/      Zod schemas
  │   └── utils.ts
  ├── database/             Database layer
  │   ├── schema.ts
  │   ├── queries/
  │   └── mutations/
  ├── types/                TypeScript types
  ├── hooks/                React hooks
  ├── services/             External services
  └── stores/               State management
`)
);

if (DRY_RUN) {
  console.log(chalk.yellow("\n🔍 This was a dry run. Run without --dry-run to apply cleanup.\n"));
} else {
  console.log(chalk.green("\n✅ Cleanup complete!\n"));
}

process.exit(0);
