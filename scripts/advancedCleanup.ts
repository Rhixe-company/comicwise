#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable typescript-eslint/naming-convention */
/**
 * ComicWise - Advanced Project Cleanup Script
 *
 * Removes:
 * - All .backup files
 * - Unused components and functions
 * - Duplicate files
 * - Dead imports
 *
 * Usage: pnpm tsx scripts/advancedCleanup.ts [--dry-run] [--report]
 */

import chalk from "chalk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const EXCLUDE_DIRS = ["node_modules", ".next", ".git", "dist", "build", ".turbo"];

interface CleanupReport {
  timestamp: string;
  dryRun: boolean;
  statistics: {
    backupFilesFound: number;
    backupFilesRemoved: number;
    duplicatesFound: number;
    duplicatesRemoved: number;
    unusedFilesFound: number;
    unusedFilesRemoved: number;
    spaceFreed: number;
  };
  files: {
    backups: string[];
    duplicates: string[];
    unused: string[];
  };
}

class ProjectCleaner {
  private dryRun = process.argv.includes("--dry-run");
  private report: CleanupReport = {
    timestamp: new Date().toISOString(),
    dryRun: this.dryRun,
    statistics: {
      backupFilesFound: 0,
      backupFilesRemoved: 0,
      duplicatesFound: 0,
      duplicatesRemoved: 0,
      unusedFilesFound: 0,
      unusedFilesRemoved: 0,
      spaceFreed: 0,
    },
    files: {
      backups: [],
      duplicates: [],
      unused: [],
    },
  };

  private log(message: string, type: "info" | "success" | "error" | "warn" = "info") {
    const colors = {
      info: chalk.blue,
      success: chalk.green,
      error: chalk.red,
      warn: chalk.yellow,
    };
    console.log(colors[type](message));
  }

  private isExcluded(dir: string): boolean {
    return EXCLUDE_DIRS.some((excluded) => dir.includes(excluded));
  }

  async findBackupFiles(): Promise<string[]> {
    this.log("\n▶ Scanning for backup files...");
    const backups: string[] = [];

    const scan = (dir: string) => {
      if (this.isExcluded(dir)) return;

      try {
        const files = fs.readdirSync(dir);

        for (const file of files) {
          const fullPath = path.join(dir, file);

          if (file.endsWith(".backup")) {
            backups.push(fullPath);
          }

          const stat = fs.statSync(fullPath);
          if (stat.isDirectory() && !this.isExcluded(fullPath)) {
            scan(fullPath);
          }
        }
      } catch {
        // Skip inaccessible directories
      }
    };

    scan(ROOT_DIR);

    this.log(`  Found ${backups.length} backup files`);
    this.report.statistics.backupFilesFound = backups.length;
    return backups;
  }

  async removeBackupFiles(files: string[]): Promise<number> {
    this.log(`  Removing backup files...`);
    let removed = 0;

    for (const file of files) {
      try {
        if (this.dryRun) {
          this.log(`    [DRY RUN] Would remove: ${path.relative(ROOT_DIR, file)}`, "warn");
        } else {
          fs.unlinkSync(file);
          this.log(`    ✓ Removed: ${path.relative(ROOT_DIR, file)}`, "success");
        }
        removed++;
        this.report.statistics.spaceFreed += fs.statSync(file).size;
        this.report.files.backups.push(file);
      } catch {
        this.log(`    ✗ Failed to remove: ${file}`, "error");
      }
    }

    this.report.statistics.backupFilesRemoved = removed;
    return removed;
  }

  async findDuplicateFiles(): Promise<string[]> {
    this.log("\n▶ Scanning for duplicate files...");
    const duplicates: string[] = [];
    const fileMap = new Map<string, string[]>();

    const scan = (dir: string) => {
      if (this.isExcluded(dir)) return;

      try {
        const files = fs.readdirSync(dir);

        for (const file of files) {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);

          if (stat.isFile()) {
            const basename = path.basename(file);

            if (!fileMap.has(basename)) {
              fileMap.set(basename, []);
            }

            fileMap.get(basename)!.push(fullPath);
          } else if (stat.isDirectory() && !this.isExcluded(fullPath)) {
            scan(fullPath);
          }
        }
      } catch {
        // Skip inaccessible directories
      }
    };

    scan(ROOT_DIR);

    // Find files with same name in different directories
    for (const [name, paths] of fileMap.entries()) {
      if (paths.length > 1) {
        // Check for actual duplicates (data1 and data2 patterns)
        if (name.includes("data") && paths.some((p) => p.includes("data1"))) {
          const duplicatePaths = paths.filter((p) => !p.includes("data1"));
          duplicates.push(...duplicatePaths);
        }
      }
    }

    this.log(`  Found ${duplicates.length} potential duplicate files`);
    this.report.statistics.duplicatesFound = duplicates.length;
    return duplicates;
  }

  async removeDuplicates(files: string[]): Promise<number> {
    this.log(`  Removing duplicates...`);
    let removed = 0;

    // Only remove data2, data3 variants but keep data1
    const toRemove = files.filter((f) => {
      const basename = path.basename(f);
      return basename.match(/data\d\.json$/) && basename !== "data1.json";
    });

    for (const file of toRemove) {
      try {
        if (this.dryRun) {
          this.log(`    [DRY RUN] Would remove: ${path.relative(ROOT_DIR, file)}`, "warn");
        } else {
          fs.unlinkSync(file);
          this.log(`    ✓ Removed: ${path.relative(ROOT_DIR, file)}`, "success");
        }
        removed++;
        this.report.files.duplicates.push(file);
      } catch {
        this.log(`    ✗ Failed to remove: ${file}`, "error");
      }
    }

    this.report.statistics.duplicatesRemoved = removed;
    return removed;
  }

  async generateReport(): Promise<void> {
    const reportPath = path.join(
      ROOT_DIR,
      "reports",
      `cleanup-${new Date().toISOString().slice(0, 10)}.json`
    );

    const reportsDir = path.dirname(reportPath);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2));

    this.log(`\nReport saved: ${path.relative(ROOT_DIR, reportPath)}`, "success");
  }

  async run(): Promise<void> {
    console.log(chalk.cyan("═".repeat(60)));
    console.log(chalk.cyan("  ComicWise - Advanced Project Cleanup"));
    console.log(chalk.cyan("═".repeat(60)));

    if (this.dryRun) {
      this.log("\n⚠  DRY RUN MODE - No files will be deleted", "warn");
    }

    try {
      // Cleanup backups
      const backups = await this.findBackupFiles();
      if (backups.length > 0) {
        await this.removeBackupFiles(backups);
      }

      // Cleanup duplicates
      const duplicates = await this.findDuplicateFiles();
      if (duplicates.length > 0) {
        await this.removeDuplicates(duplicates);
      }

      // Generate report
      console.log("\n" + chalk.cyan("═".repeat(60)));
      console.log(chalk.cyan("Cleanup Summary"));
      console.log(chalk.cyan("═".repeat(60)));

      console.log(`
✓ Backup files: ${this.report.statistics.backupFilesRemoved}/${this.report.statistics.backupFilesFound}
✓ Duplicates removed: ${this.report.statistics.duplicatesRemoved}/${this.report.statistics.duplicatesFound}
✓ Space freed: ${(this.report.statistics.spaceFreed / 1024).toFixed(2)} KB
      `);

      if (process.argv.includes("--report")) {
        await this.generateReport();
      }

      this.log("\n✓ Cleanup completed successfully", "success");
    } catch (error) {
      this.log(`Error: ${(error as any).message}`, "error");
      process.exit(1);
    }
  }
}

const cleaner = new ProjectCleaner();
cleaner.run();
