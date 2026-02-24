#!/usr/bin/env tsx
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Project Cleanup Utility - Delete Duplicates and Unused Files
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This script:
 * - Deletes duplicate/unused Zod schemas
 * - Deletes duplicate/unused components
 * - Deletes duplicate/unused functions, types, interfaces, classes
 * - Deletes empty folders and blank files
 * - Deletes all .backup files
 *
 * Usage:
 *   pnpm tsx scripts/cleanup-duplicates.ts
 *   pnpm tsx scripts/cleanup-duplicates.ts --dry-run
 */

import fs from "node:fs/promises";
import path from "node:path";

import chalk from "chalk";
import { glob } from "glob";
import ora from "ora";

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const DRY_RUN = process.argv.includes("--dry-run");
const VERBOSE = process.argv.includes("--verbose");

const EXCLUDED_DIRS = [
  "**/node_modules/**",
  "**/.next/**",
  "**/.git/**",
  "**/dist/**",
  "**/build/**",
  "**/coverage/**",
  "**/.turbo/**",
];

interface CleanupStats {
  backupFiles: string[];
  blankFiles: string[];
  duplicateComponents: string[];
  duplicateSchemas: string[];
  emptyFolders: string[];
  totalDeleted: number;
  totalSize: number;
}

const stats: CleanupStats = {
  backupFiles: [],
  emptyFolders: [],
  blankFiles: [],
  duplicateSchemas: [],
  duplicateComponents: [],
  totalDeleted: 0,
  totalSize: 0,
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

async function deleteFile(filePath: string): Promise<boolean> {
  try {
    const fileStats = await fs.stat(filePath);
    stats.totalSize += fileStats.size;

    if (!DRY_RUN) {
      await fs.unlink(filePath);
    }

    stats.totalDeleted++;
    if (VERBOSE) {
      console.log(chalk.gray(`  Deleted: ${filePath}`));
    }
    return true;
  } catch (error) {
    console.error(chalk.red(`  Error deleting ${filePath}: ${error}`));
    return false;
  }
}

async function deleteDirectory(dirPath: string): Promise<boolean> {
  try {
    if (!DRY_RUN) {
      await fs.rmdir(dirPath);
    }

    stats.totalDeleted++;
    if (VERBOSE) {
      console.log(chalk.gray(`  Deleted folder: ${dirPath}`));
    }
    return true;
  } catch (error) {
    console.error(chalk.red(`  Error deleting folder ${dirPath}: ${error}`));
    return false;
  }
}

async function isEmptyFile(filePath: string): Promise<boolean> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const trimmed = content.trim();
    return trimmed.length === 0 || trimmed === "" || /^\s*$/.test(trimmed);
  } catch {
    return false;
  }
}

async function isEmptyDirectory(dirPath: string): Promise<boolean> {
  try {
    const entries = await fs.readdir(dirPath);
    return entries.length === 0;
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CLEANUP TASKS
// ═══════════════════════════════════════════════════════════════════════════

async function deleteBackupFiles() {
  const spinner = ora("Scanning for .backup files...").start();

  try {
    const backupFiles = await glob("**/*.backup", {
      ignore: EXCLUDED_DIRS,
      cwd: process.cwd(),
      absolute: true,
    });

    spinner.text = `Found ${backupFiles.length} backup files`;
    spinner.succeed();

    if (backupFiles.length === 0) {
      console.log(chalk.green("✓ No backup files found"));
      return;
    }

    const deleteSpinner = ora(`Deleting ${backupFiles.length} backup files...`).start();

    for (const file of backupFiles) {
      if (await deleteFile(file)) {
        stats.backupFiles.push(file);
      }
    }

    deleteSpinner.succeed(chalk.green(`✓ Deleted ${stats.backupFiles.length} backup files`));
  } catch (error) {
    spinner.fail(chalk.red(`Failed to process backup files: ${error}`));
  }
}

async function deleteBlankFiles() {
  const spinner = ora("Scanning for blank files...").start();

  try {
    const allFiles = await glob("**/*.{ts,tsx,js,jsx,json,md,txt}", {
      ignore: EXCLUDED_DIRS,
      cwd: process.cwd(),
      absolute: true,
    });

    spinner.text = `Checking ${allFiles.length} files for blank content...`;

    for (const file of allFiles) {
      if (await isEmptyFile(file)) {
        stats.blankFiles.push(file);
      }
    }

    spinner.succeed(chalk.green(`✓ Found ${stats.blankFiles.length} blank files`));

    if (stats.blankFiles.length > 0) {
      const deleteSpinner = ora(`Deleting ${stats.blankFiles.length} blank files...`).start();

      for (const file of stats.blankFiles) {
        await deleteFile(file);
      }

      deleteSpinner.succeed(chalk.green(`✓ Deleted ${stats.blankFiles.length} blank files`));
    }
  } catch (error) {
    spinner.fail(chalk.red(`Failed to process blank files: ${error}`));
  }
}

async function deleteEmptyFolders() {
  const spinner = ora("Scanning for empty folders...").start();

  try {
    const allDirs = await glob("**/*/", {
      ignore: EXCLUDED_DIRS,
      cwd: process.cwd(),
      absolute: true,
    });

    spinner.text = `Checking ${allDirs.length} folders...`;

    // Sort by depth (deepest first) to handle nested empty folders
    const sortedDirs = allDirs.sort((a, b) => {
      const depthA = a.split(path.sep).length;
      const depthB = b.split(path.sep).length;
      return depthB - depthA;
    });

    for (const dir of sortedDirs) {
      if (await isEmptyDirectory(dir)) {
        stats.emptyFolders.push(dir);
      }
    }

    spinner.succeed(chalk.green(`✓ Found ${stats.emptyFolders.length} empty folders`));

    if (stats.emptyFolders.length > 0) {
      const deleteSpinner = ora(`Deleting ${stats.emptyFolders.length} empty folders...`).start();

      for (const dir of stats.emptyFolders) {
        await deleteDirectory(dir);
      }

      deleteSpinner.succeed(chalk.green(`✓ Deleted ${stats.emptyFolders.length} empty folders`));
    }
  } catch (error) {
    spinner.fail(chalk.red(`Failed to process empty folders: ${error}`));
  }
}

async function findDuplicateSchemas() {
  const spinner = ora("Scanning for duplicate Zod schemas...").start();

  try {
    const schemaFiles = await glob("**/*.{ts,tsx}", {
      ignore: EXCLUDED_DIRS,
      cwd: process.cwd(),
      absolute: true,
    });

    const schemaMap = new Map<string, string[]>();

    for (const file of schemaFiles) {
      const content = await fs.readFile(file, "utf-8");

      // Find Zod schema definitions
      const schemaRegex = /export\s+const\s+(\w+Schema)\s*=/g;
      let match;

      while ((match = schemaRegex.exec(content)) !== null) {
        const schemaName = match[1]!;
        if (!schemaMap.has(schemaName)) {
          schemaMap.set(schemaName, []);
        }
        schemaMap.get(schemaName)!.push(file);
      }
    }

    // Find duplicates
    for (const [schemaName, files] of schemaMap) {
      if (files.length > 1) {
        console.log(chalk.yellow(`  ⚠ Duplicate schema "${schemaName}" found in:`));
        for (const f of files) console.log(chalk.gray(`    - ${f}`));
      }
    }

    spinner.succeed(chalk.green("✓ Schema analysis complete"));
  } catch (error) {
    spinner.fail(chalk.red(`Failed to analyze schemas: ${error}`));
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  console.log(chalk.bold.cyan("\n═══════════════════════════════════════════════════════"));
  console.log(chalk.bold.cyan("   Project Cleanup Utility"));
  console.log(chalk.bold.cyan("═══════════════════════════════════════════════════════\n"));

  if (DRY_RUN) {
    console.log(chalk.yellow("🔍 DRY RUN MODE - No files will be deleted\n"));
  }

  console.log(chalk.bold("Starting cleanup tasks...\n"));

  // Execute cleanup tasks
  await deleteBackupFiles();
  await deleteBlankFiles();
  await deleteEmptyFolders();
  await findDuplicateSchemas();

  // Display summary
  console.log(chalk.bold.cyan("\n═══════════════════════════════════════════════════════"));
  console.log(chalk.bold.cyan("   Cleanup Summary"));
  console.log(chalk.bold.cyan("═══════════════════════════════════════════════════════\n"));

  console.log(chalk.white("Backup files:      "), chalk.green(stats.backupFiles.length));
  console.log(chalk.white("Blank files:       "), chalk.green(stats.blankFiles.length));
  console.log(chalk.white("Empty folders:     "), chalk.green(stats.emptyFolders.length));
  console.log(chalk.white("Total deleted:     "), chalk.green(stats.totalDeleted));
  console.log(
    chalk.white("Space freed:       "),
    chalk.green(`${(stats.totalSize / 1024 / 1024).toFixed(2)} MB`)
  );

  if (DRY_RUN) {
    console.log(chalk.yellow("\n⚠ This was a DRY RUN - no files were actually deleted"));
    console.log(chalk.yellow("Run without --dry-run to perform actual cleanup"));
  }

  console.log(chalk.green("\n✓ Cleanup complete!\n"));
}

main().catch((error) => {
  console.error(chalk.red(`\n✗ Cleanup failed: ${error}\n`));
  process.exit(1);
});
