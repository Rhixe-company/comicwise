#!/usr/bin/env tsx
/**
 * PROJECT CLEANUP SCRIPT - OPTIMIZED
 * Comprehensive cleanup: remove duplicates, .backup files, temp files, old reports
 */

import chalk from "chalk";
import fs from "fs-extra";
import { glob } from "glob";
import ora from "ora";
import path from "path";

interface CleanupResult {
  deletedFiles: string[];
  freedSpace: number;
  errors: string[];
}

class ProjectCleanup {
  private projectRoot: string;
  private result: CleanupResult = {
    deletedFiles: [],
    freedSpace: 0,
    errors: [],
  };

  private readonly IGNORE_PATTERNS = [
    "node_modules/**",
    ".git/**",
    ".next/**",
    "dist/**",
    "build/**",
    "coverage/**",
  ];

  private readonly ESSENTIAL_DOCS = [
    "README.md",
    "README-COMPREHENSIVE.md",
    "LICENSE",
    "COMPREHENSIVE_OPTIMIZATION_FINAL_2025-12-26.md",
  ];

  constructor() {
    this.projectRoot = process.cwd();
  }

  /**
   * Delete files by pattern
   */
  private async deleteByPattern(pattern: string, description: string): Promise<number> {
    const files = await glob(pattern, {
      cwd: this.projectRoot,
      ignore: this.IGNORE_PATTERNS,
      absolute: true,
    });

    let count = 0;
    for (const file of files) {
      try {
        const stats = await fs.stat(file);
        await fs.remove(file);
        this.result.deletedFiles.push(file);
        this.result.freedSpace += stats.size;
        count++;
      } catch (error) {
        this.result.errors.push(
          `Failed to delete ${file}: ${error instanceof Error ? error.message : "Unknown"}`
        );
      }
    }

    return count;
  }

  /**
   * Delete .backup files
   */
  private async deleteBackupFiles() {
    const spinner = ora("Deleting .backup files").start();
    try {
      const count = await this.deleteByPattern("**/*.backup", ".backup files");
      spinner.succeed(`Deleted ${count} .backup files`);
    } catch (error) {
      spinner.fail("Failed to delete .backup files");
      this.result.errors.push(error instanceof Error ? error.message : "Unknown error");
    }
  }

  /**
   * Delete temporary files
   */
  private async deleteTempFiles() {
    const spinner = ora("Deleting temporary files").start();

    try {
      const tempPatterns = [
        "**/*.tmp",
        "**/*.temp",
        "**/*.log",
        "**/type-check*.txt",
        "**/errors*.txt",
        "**/lint-output.txt",
        "**/*-output.txt",
        "**/se.txt",
        "**/se copy.txt",
      ];

      let totalCount = 0;
      for (const pattern of tempPatterns) {
        totalCount += await this.deleteByPattern(pattern, pattern);
      }

      spinner.succeed(`Deleted ${totalCount} temporary files`);
    } catch (error) {
      spinner.fail("Failed to delete temporary files");
      this.result.errors.push(error instanceof Error ? error.message : "Unknown error");
    }
  }

  /**
   * Clean up old report files
   */
  private async cleanupOldReports() {
    const spinner = ora("Cleaning up old report files").start();

    try {
      const reportFiles = await glob("*.{md,txt}", {
        cwd: this.projectRoot,
        ignore: this.IGNORE_PATTERNS,
        absolute: true,
      });

      let count = 0;
      for (const file of reportFiles) {
        const fileName = path.basename(file);

        // Skip essential docs
        if (this.ESSENTIAL_DOCS.includes(fileName)) {
          continue;
        }

        // Remove old optimization/status reports
        const shouldDelete =
          fileName.includes("OPTIMIZATION") ||
          fileName.includes("TYPE_CHECK") ||
          fileName.includes("FIX") ||
          fileName.includes("SEED") ||
          fileName.includes("VSCODE") ||
          fileName.includes("ERROR") ||
          fileName.includes("TASK") ||
          fileName.includes("CHECKLIST") ||
          fileName.includes("STATUS") ||
          fileName.includes("DELIVERABLE") ||
          fileName.includes("EXECUTIVE") ||
          fileName.includes("GUIDE") ||
          fileName.includes("REFERENCE") ||
          fileName.includes("VALIDATION") ||
          fileName.includes("MIGRATION") ||
          fileName.match(/^(after|current|final|remaining|type-errors)-/i);

        if (shouldDelete) {
          try {
            const stats = await fs.stat(file);
            await fs.remove(file);
            this.result.deletedFiles.push(file);
            this.result.freedSpace += stats.size;
            count++;
          } catch (error) {
            // Skip if file already deleted
          }
        }
      }

      spinner.succeed(`Cleaned up ${count} old report files`);
    } catch (error) {
      spinner.fail("Failed to cleanup report files");
      this.result.errors.push(error instanceof Error ? error.message : "Unknown error");
    }
  }

  /**
   * Clean up duplicate TypeScript files
   */
  private async cleanupDuplicateScripts() {
    const spinner = ora("Cleaning up duplicate scripts").start();

    try {
      const scriptsDir = path.join(this.projectRoot, "scripts");
      const duplicatePatterns = [
        "**/cleanupProject.ts",
        "**/cleanupUnused.ts",
        "**/comprehensiveCleanup.ts",
        "**/comprehensiveOptimization.ts",
        "**/comprehensiveProjectOptimization.ts",
        "**/masterFullOptimization.ts",
        "**/master-optimization.ts",
        "**/completeAllTasks.ts",
      ];

      let count = 0;
      for (const pattern of duplicatePatterns) {
        const files = await glob(pattern, {
          cwd: scriptsDir,
          absolute: true,
        });

        for (const file of files) {
          try {
            const stats = await fs.stat(file);
            await fs.remove(file);
            this.result.deletedFiles.push(file);
            this.result.freedSpace += stats.size;
            count++;
          } catch (error) {
            // Skip if already deleted
          }
        }
      }

      spinner.succeed(`Removed ${count} duplicate scripts`);
    } catch (error) {
      spinner.fail("Failed to cleanup duplicate scripts");
      this.result.errors.push(error instanceof Error ? error.message : "Unknown error");
    }
  }

  /**
   * Format file size
   */
  private formatSize(bytes: number): string {
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  /**
   * Generate summary report
   */
  private generateReport() {
    console.log("\n");
    console.log(chalk.cyan("═".repeat(80)));
    console.log(chalk.yellow.bold("  PROJECT CLEANUP - SUMMARY REPORT"));
    console.log(chalk.gray(`  Date: ${new Date().toISOString()}`));
    console.log(chalk.cyan("═".repeat(80)));
    console.log("\n");

    console.log(chalk.bold("📊 Cleanup Statistics:"));
    console.log(chalk.green(`  ✅ Files Deleted: ${this.result.deletedFiles.length}`));
    console.log(chalk.green(`  💾 Space Freed: ${this.formatSize(this.result.freedSpace)}`));
    console.log(chalk.red(`  ❌ Errors: ${this.result.errors.length}`));
    console.log("\n");

    if (this.result.errors.length > 0) {
      console.log(chalk.bold("⚠️  Errors:"));
      this.result.errors.slice(0, 10).forEach((error, index) => {
        console.log(chalk.red(`  ${index + 1}. ${error}`));
      });
      if (this.result.errors.length > 10) {
        console.log(chalk.gray(`  ... and ${this.result.errors.length - 10} more`));
      }
      console.log("\n");
    }

    console.log(chalk.cyan("═".repeat(80)));
  }

  /**
   * Main execution
   */
  async run() {
    console.log(chalk.cyan.bold("\n🧹 Starting Project Cleanup\n"));

    await this.deleteBackupFiles();
    await this.deleteTempFiles();
    await this.cleanupOldReports();
    await this.cleanupDuplicateScripts();

    this.generateReport();

    console.log(chalk.green.bold("\n✨ Project cleanup completed!\n"));
  }
}

// Execute
const cleanup = new ProjectCleanup();
cleanup.run().catch((error) => {
  console.error(chalk.red("Fatal error:"), error);
  process.exit(1);
});
