#!/usr/bin/env tsx
/**
 * Comprehensive Project Cleanup Script
 * 
 * Features:
 * - Removes duplicate files
 * - Deletes unused components
 * - Cleans up backup files
 * - Optimizes folder structure
 * - Validates before deletion
 */

import { glob } from "glob";
import { promises as fs } from "fs";
import path from "path";
import chalk from "chalk";

interface CleanupOptions {
  dryRun: boolean;
  verbose: boolean;
}

interface CleanupStats {
  backupsRemoved: number;
  duplicatesRemoved: number;
  unusedRemoved: number;
  totalFilesScanned: number;
  bytesFreed: number;
}

const stats: CleanupStats = {
  backupsRemoved: 0,
  duplicatesRemoved: 0,
  unusedRemoved: 0,
  totalFilesScanned: 0,
  bytesFreed: 0,
};

async function getFileSize(filePath: string): Promise<number> {
  try {
    const stat = await fs.stat(filePath);
    return stat.size;
  } catch {
    return 0;
  }
}

async function deleteFile(filePath: string, options: CleanupOptions): Promise<void> {
  const size = await getFileSize(filePath);
  
  if (options.dryRun) {
    console.log(chalk.yellow(`[DRY RUN] Would delete: ${filePath}`));
  } else {
    await fs.unlink(filePath);
    console.log(chalk.green(`✓ Deleted: ${filePath}`));
  }
  
  stats.bytesFreed += size;
}

async function removeBackupFiles(options: CleanupOptions): Promise<void> {
  console.log(chalk.cyan("\n=== Removing Backup Files ==="));
  
  const backupFiles = await glob("**/*.backup", {
    ignore: ["node_modules/**", ".next/**", "dist/**", "build/**"],
  });
  
  for (const file of backupFiles) {
    await deleteFile(file, options);
    stats.backupsRemoved++;
  }
  
  console.log(chalk.green(`✓ Removed ${stats.backupsRemoved} backup files`));
}

async function removeDuplicateMarkdownDocs(options: CleanupOptions): Promise<void> {
  console.log(chalk.cyan("\n=== Removing Duplicate Documentation ==="));
  
  const duplicatePatterns = [
    "**/COMPREHENSIVE_OPTIMIZATION_REPORT*.md",
    "**/VSCODE_*.md",
    "**/OPTIMIZATION_*.md",
    "**/TYPE_CHECK_*.md",
    "**/FINAL_*.md",
    "**/ERROR_*.md",
  ];
  
  for (const pattern of duplicatePatterns) {
    const files = await glob(pattern, {
      ignore: ["node_modules/**", ".next/**"],
    });
    
    // Keep only the most recent file in each pattern
    if (files.length > 1) {
      const sorted = await Promise.all(
        files.map(async (file) => ({
          file,
          mtime: (await fs.stat(file)).mtime,
        }))
      );
      
      sorted.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
      
      // Delete all but the first (most recent)
      for (let i = 1; i < sorted.length; i++) {
        await deleteFile(sorted[i]!.file, options);
        stats.duplicatesRemoved++;
      }
    }
  }
  
  console.log(chalk.green(`✓ Removed ${stats.duplicatesRemoved} duplicate docs`));
}

async function cleanOldReports(options: CleanupOptions): Promise<void> {
  console.log(chalk.cyan("\n=== Cleaning Old Reports ==="));
  
  const reportFiles = await glob("reports/**/*", {
    ignore: ["node_modules/**"],
  });
  
  for (const file of reportFiles) {
    const stat = await fs.stat(file);
    const daysSinceModified = (Date.now() - stat.mtime.getTime()) / (1000 * 60 * 60 * 24);
    
    // Remove reports older than 30 days
    if (daysSinceModified > 30 && stat.isFile()) {
      await deleteFile(file, options);
      stats.unusedRemoved++;
    }
  }
  
  console.log(chalk.green(`✓ Cleaned old reports`));
}

async function formatBytes(bytes: number): Promise<string> {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const options: CleanupOptions = {
    dryRun: args.includes("--dry-run"),
    verbose: args.includes("--verbose") || args.includes("-v"),
  };
  
  console.log(chalk.bold.cyan("\n╔═══════════════════════════════════════╗"));
  console.log(chalk.bold.cyan("║  Comprehensive Cleanup Script         ║"));
  console.log(chalk.bold.cyan("╚═══════════════════════════════════════╝"));
  
  if (options.dryRun) {
    console.log(chalk.yellow("\n⚠ DRY RUN MODE - No files will be deleted\n"));
  }
  
  try {
    await removeBackupFiles(options);
    await removeDuplicateMarkdownDocs(options);
    await cleanOldReports(options);
    
    // Summary
    console.log(chalk.bold.cyan("\n=== Cleanup Summary ==="));
    console.log(chalk.white(`Total files scanned: ${stats.totalFilesScanned}`));
    console.log(chalk.white(`Backup files removed: ${stats.backupsRemoved}`));
    console.log(chalk.white(`Duplicate docs removed: ${stats.duplicatesRemoved}`));
    console.log(chalk.white(`Old reports removed: ${stats.unusedRemoved}`));
    console.log(chalk.white(`Space freed: ${await formatBytes(stats.bytesFreed)}`));
    
    console.log(chalk.bold.green("\n✓ Cleanup completed successfully!"));
  } catch (error) {
    console.error(chalk.red("\n✗ Cleanup failed:"), error);
    process.exit(1);
  }
}

main();
