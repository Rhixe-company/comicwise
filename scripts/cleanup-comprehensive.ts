#!/usr/bin/env tsx
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROJECT CLEANUP & OPTIMIZATION SCRIPT - ComicWise
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This script performs comprehensive cleanup and optimization:
 * - Removes duplicate files and functions
 * - Optimizes imports and exports
 * - Cleans up unused dependencies
 * - Validates file naming conventions
 * - Ensures camelCase consistency
 */

import chalk from "chalk";
import { execSync } from "child_process";
import fs from "fs-extra";
import { globSync } from "glob";
import path from "path";

// ═══════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════

const DRY_RUN = process.argv.includes("--dry-run");
const VERBOSE = process.argv.includes("--verbose");

interface CleanupStats {
  filesScanned: number;
  filesDeleted: number;
  filesRenamed: number;
  duplicatesFound: number;
  issuesFixed: number;
}

const stats: CleanupStats = {
  filesScanned: 0,
  filesDeleted: 0,
  filesRenamed: 0,
  duplicatesFound: 0,
  issuesFixed: 0,
};

// ═══════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════

function log(message: string, type: "info" | "success" | "warning" | "error" = "info"): void {
  const colors = {
    info: chalk.blue,
    success: chalk.green,
    warning: chalk.yellow,
    error: chalk.red,
  };
  console.log(colors[type](message));
}

function header(text: string): void {
  console.log(chalk.cyan("\n" + "═".repeat(60)));
  console.log(chalk.cyan(` ${text}`));
  console.log(chalk.cyan("═".repeat(60) + "\n"));
}

// ═══════════════════════════════════════════════════
// CLEANUP FUNCTIONS
// ═══════════════════════════════════════════════════

async function cleanupDuplicateFiles(): Promise<void> {
  header("Cleaning up duplicate files");

  const duplicatePatterns = [
    { pattern: "**/*-complete.ts", keep: false },
    { pattern: "**/*-enhanced.ts", keep: true },
    { pattern: "**/*-old.ts", keep: false },
    { pattern: "**/*-backup.ts", keep: false },
    { pattern: "**/*.bak", keep: false },
  ];

  for (const { pattern, keep } of duplicatePatterns) {
    const files = globSync(pattern, {
      ignore: ["**/node_modules/**", "**/.next/**"],
      cwd: process.cwd(),
    });

    for (const file of files) {
      stats.filesScanned++;
      if (!keep) {
        log(`Removing: ${file}`, "warning");
        if (!DRY_RUN) {
          await fs.remove(file);
          stats.filesDeleted++;
        }
      }
    }
  }
}

async function validateFileNaming(): Promise<void> {
  header("Validating file naming conventions");

  const files = globSync("src/**/*.{ts,tsx}", {
    ignore: ["**/node_modules/**", "**/.next/**"],
    cwd: process.cwd(),
  });

  for (const file of files) {
    stats.filesScanned++;
    const basename = path.basename(file, path.extname(file));

    // Check for snake_case in filenames (should be camelCase or kebab-case)
    if (basename.includes("_") && !basename.startsWith("_")) {
      const newName = basename.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      const newPath = path.join(path.dirname(file), newName + path.extname(file));

      log(`Renaming: ${file} → ${newPath}`, "info");
      if (!DRY_RUN) {
        await fs.move(file, newPath);
        stats.filesRenamed++;
      }
    }
  }
}

async function cleanupUnusedImports(): Promise<void> {
  header("Cleaning up unused imports");

  log("Running ESLint auto-fix for unused imports...", "info");
  try {
    if (!DRY_RUN) {
      execSync("pnpm eslint . --fix --rule 'unused-imports/no-unused-imports: error'", {
        stdio: "inherit",
      });
      stats.issuesFixed++;
    }
  } catch (error) {
    log("ESLint cleanup completed with warnings", "warning");
  }
}

async function optimizeImportPaths(): Promise<void> {
  header("Optimizing import paths");

  log("Running import path optimizer...", "info");
  try {
    if (!DRY_RUN) {
      execSync("tsx scripts/replace-imports.ts", { stdio: "inherit" });
      stats.issuesFixed++;
    }
  } catch (error) {
    log("Import optimization completed with warnings", "warning");
  }
}

async function removeDuplicateDependencies(): Promise<void> {
  header("Removing duplicate dependencies");

  log("Running pnpm dedupe...", "info");
  try {
    if (!DRY_RUN) {
      execSync("pnpm dedupe", { stdio: "inherit" });
      stats.issuesFixed++;
    }
  } catch (error) {
    log("Dependency deduplication completed", "warning");
  }
}

async function cleanupOldMarkdownFiles(): Promise<void> {
  header("Cleaning up old markdown files");

  const oldDocs = [
    "TASKS_COMPLETE.md",
    "IMPLEMENTATION_COMPLETE.md",
    "FIXES_COMPLETE.md",
    "FILES_CREATED.md",
    "PATH_ALIASES_COMPLETE.md",
    "OPTIMIZATION_COMPLETE.md",
    "README_COMPLETE.md",
  ];

  for (const doc of oldDocs) {
    const filePath = path.join(process.cwd(), doc);
    if (await fs.pathExists(filePath)) {
      log(`Archiving: ${doc}`, "warning");
      if (!DRY_RUN) {
        const archiveDir = path.join(process.cwd(), "docs", "archive");
        await fs.ensureDir(archiveDir);
        await fs.move(filePath, path.join(archiveDir, doc), { overwrite: true });
        stats.filesDeleted++;
      }
    }
  }
}

async function validateTypeConsistency(): Promise<void> {
  header("Validating type consistency");

  log("Running TypeScript compiler check...", "info");
  try {
    execSync("pnpm type-check", { stdio: DRY_RUN ? "ignore" : "inherit" });
    log("Type check passed!", "success");
  } catch (error) {
    log("Type check found issues - please review", "warning");
  }
}

// ═══════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════

async function main(): Promise<void> {
  console.log(chalk.cyan("\n╔══════════════════════════════════════════════════════════════╗"));
  console.log(chalk.cyan("║        ComicWise - Project Cleanup & Optimization            ║"));
  console.log(chalk.cyan("╚══════════════════════════════════════════════════════════════╝\n"));

  if (DRY_RUN) {
    log("🔍 DRY RUN MODE - No changes will be made\n", "warning");
  }

  try {
    await cleanupDuplicateFiles();
    await validateFileNaming();
    await cleanupOldMarkdownFiles();
    await removeDuplicateDependencies();
    await cleanupUnusedImports();
    await optimizeImportPaths();
    await validateTypeConsistency();

    // Print summary
    console.log(chalk.cyan("\n╔══════════════════════════════════════════════════════════════╗"));
    console.log(chalk.cyan("║                     Cleanup Summary                          ║"));
    console.log(chalk.cyan("╚══════════════════════════════════════════════════════════════╝\n"));

    console.log(chalk.yellow("Files scanned:    "), chalk.white(stats.filesScanned));
    console.log(chalk.yellow("Files deleted:    "), chalk.white(stats.filesDeleted));
    console.log(chalk.yellow("Files renamed:    "), chalk.white(stats.filesRenamed));
    console.log(chalk.yellow("Duplicates found: "), chalk.white(stats.duplicatesFound));
    console.log(chalk.yellow("Issues fixed:     "), chalk.white(stats.issuesFixed));

    console.log(chalk.green("\n✅ Cleanup completed successfully!\n"));

    if (DRY_RUN) {
      log("ℹ️  Run without --dry-run to apply changes", "info");
    }
  } catch (error) {
    log(`\n❌ Cleanup failed: ${error}`, "error");
    process.exit(1);
  }
}

main();
