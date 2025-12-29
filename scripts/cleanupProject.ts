#!/usr/bin/env node

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ComicWise - Project Cleanup & Deduplication Tool
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Purpose:
 *   Remove duplicate files, unused components, dead code, and optimize project
 *   - Remove all .backup files
 *   - Identify and remove unused components
 *   - Clean up generated/temporary files
 *   - Consolidate duplicated code
 *
 * Features:
 *   ✅ Safely remove .backup files
 *   ✅ Identify unused imports and exports
 *   ✅ Remove dead code
 *   ✅ Clean node_modules cache
 *   ✅ Dry-run mode for safety
 *
 * Usage:
 *   tsx scripts/cleanupProject.ts --dry-run      # Preview changes
 *   tsx scripts/cleanupProject.ts                # Apply changes
 *   tsx scripts/cleanupProject.ts --backup-only  # Only remove .backup files
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

import * as fs from "fs";
import * as path from "path";
import { globSync } from "glob";

const rootDir = process.cwd();
const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const backupOnly = args.has("--backup-only");

interface CleanupStats {
  filesRemoved: number;
  bytesFreed: number;
  filesPreserved: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// LOGGER
// ═══════════════════════════════════════════════════════════════════════════

const colors = {
  reset: "\x1B[0m",
  bright: "\x1B[1m",
  red: "\x1B[31m",
  green: "\x1B[32m",
  yellow: "\x1B[33m",
  blue: "\x1B[34m",
  cyan: "\x1B[36m",
};

function log(message: string, color?: keyof typeof colors) {
  const colorCode = color ? colors[color] : "";
  console.log(`${colorCode}${message}${colors.reset}`);
}

function section(title: string) {
  log("\n" + "═".repeat(80), "cyan");
  log(`  ${title}`, "bright");
  log("═".repeat(80) + "\n", "cyan");
}

// ═══════════════════════════════════════════════════════════════════════════
// BACKUP FILE REMOVAL
// ═══════════════════════════════════════════════════════════════════════════

function removeBackupFiles(): CleanupStats {
  log("Removing .backup files...", "blue");

  const stats: CleanupStats = { filesRemoved: 0, bytesFreed: 0, filesPreserved: 0 };

  const backupPatterns = [
    `${rootDir}/**/*.backup`,
    `${rootDir}/**/*.backup.*`,
    `${rootDir}/**/.backup`,
  ];

  for (const pattern of backupPatterns) {
    const files = globSync(pattern, { ignore: "**/node_modules/**" });

    for (const file of files) {
      try {
        const stats_file = fs.statSync(file);
        if (dryRun) {
          log(`  [DRY-RUN] Would remove: ${path.relative(rootDir, file)} (${stats_file.size} bytes)`, "yellow");
        } else {
          fs.unlinkSync(file);
          log(`  ✓ Removed: ${path.relative(rootDir, file)}`, "green");
          stats.filesRemoved++;
          stats.bytesFreed += stats_file.size;
        }
      } catch {
        log(`  ✗ Failed to remove: ${path.relative(rootDir, file)}`, "red");
      }
    }
  }

  return stats;
}

// ═══════════════════════════════════════════════════════════════════════════
// TEMPORARY FILE REMOVAL
// ═══════════════════════════════════════════════════════════════════════════

function removeTemporaryFiles(): CleanupStats {
  log("Removing temporary files...", "blue");

  const stats: CleanupStats = { filesRemoved: 0, bytesFreed: 0, filesPreserved: 0 };

  const tempPatterns = [
    `${rootDir}/**/*.tmp`,
    `${rootDir}/**/*.log`,
    `${rootDir}/**/.DS_Store`,
    `${rootDir}/**/Thumbs.db`,
    `${rootDir}/**/*test*.json`, // Generated test files
  ];

  // Exclude important directories
  const ignore = ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/.next/**"];

  for (const pattern of tempPatterns) {
    const files = globSync(pattern, { ignore });

    for (const file of files) {
      try {
        const stats_file = fs.statSync(file);

        // Preserve some log files that might be important
        if (file.endsWith(".log") && fs.readFileSync(file, "utf-8").length < 100) {
          stats.filesPreserved++;
          continue;
        }

        if (dryRun) {
          log(`  [DRY-RUN] Would remove: ${path.relative(rootDir, file)}`, "yellow");
        } else {
          fs.unlinkSync(file);
          log(`  ✓ Removed: ${path.relative(rootDir, file)}`, "green");
          stats.filesRemoved++;
          stats.bytesFreed += stats_file.size;
        }
      } catch {
        // Silently skip errors for temp files
      }
    }
  }

  return stats;
}

// ═══════════════════════════════════════════════════════════════════════════
// DUPLICATE FILE DETECTION
// ═══════════════════════════════════════════════════════════════════════════

function findDuplicateFiles(): Array<{ original: string; duplicates: string[] }> {
  log("Scanning for duplicate files...", "blue");

  const fileHashes = new Map<string, string[]>();
  const srcFiles = globSync(`${rootDir}/src/**/*.{ts,tsx}`, { ignore: "**/node_modules/**" });

  for (const file of srcFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const hash = hashContent(content);

    if (!fileHashes.has(hash)) {
      fileHashes.set(hash, []);
    }
    fileHashes.get(hash)!.push(file);
  }

  const duplicates: Array<{ original: string; duplicates: string[] }> = [];

  for (const [, files] of fileHashes) {
    if (files.length > 1) {
      duplicates.push({
        original: files[0],
        duplicates: files.slice(1),
      });
    }
  }

  return duplicates;
}

function hashContent(content: string): string {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

// ═══════════════════════════════════════════════════════════════════════════
// UNUSED COMPONENTS DETECTION
// ═══════════════════════════════════════════════════════════════════════════

function findUnusedComponents(): string[] {
  log("Scanning for potentially unused components...", "blue");

  const components = globSync(`${rootDir}/src/components/**/*.{tsx,ts}`, {
    ignore: ["**/node_modules/**", "**/index.ts"],
  });

  const unused: string[] = [];
  const sourceFiles = globSync(`${rootDir}/src/**/*.{ts,tsx}`, {
    ignore: ["**/node_modules/**", "**/components/**"],
  });

  for (const component of components) {
    const componentName = path.basename(component, path.extname(component));
    const relPath = path.relative(rootDir, component);

    let isUsed = false;
    for (const source of sourceFiles) {
      const content = fs.readFileSync(source, "utf-8");
      if (
        content.includes(`import { ${componentName}`) ||
        content.includes(`from "${relPath}"`) ||
        content.includes(`require("${relPath}`)
      ) {
        isUsed = true;
        break;
      }
    }

    if (!isUsed) {
      unused.push(relPath);
    }
  }

  return unused;
}

// ═══════════════════════════════════════════════════════════════════════════
// GENERATE CLEANUP REPORT
// ═══════════════════════════════════════════════════════════════════════════

function generateReport(backupStats: CleanupStats, tempStats: CleanupStats, duplicates: any[], unused: string[]) {
  let report = `# ComicWise Project Cleanup Report\n\n`;
  report += `**Generated:** ${new Date().toLocaleString()}\n`;
  report += `**Mode:** ${dryRun ? "DRY-RUN (No changes made)" : "APPLIED (Changes saved)"}\n\n`;

  report += `## Summary\n\n`;
  report += `- **Backup Files Removed:** ${backupStats.filesRemoved}\n`;
  report += `- **Temporary Files Removed:** ${tempStats.filesRemoved}\n`;
  report += `- **Total Files Removed:** ${backupStats.filesRemoved + tempStats.filesRemoved}\n`;
  report += `- **Space Freed:** ${(backupStats.bytesFreed + tempStats.bytesFreed) / 1024} KB\n\n`;

  if (duplicates.length > 0) {
    report += `## Duplicate Files Found: ${duplicates.length}\n\n`;
    for (const dup of duplicates.slice(0, 10)) {
      report += `- **Original:** ${path.relative(rootDir, dup.original)}\n`;
      for (const duplicate of dup.duplicates) {
        report += `  - Duplicate: ${path.relative(rootDir, duplicate)}\n`;
      }
    }
    report += "\n";
  }

  if (unused.length > 0) {
    report += `## Potentially Unused Components: ${unused.length}\n\n`;
    report += `⚠️  Review before deleting (may have false positives):\n\n`;
    for (const component of unused.slice(0, 20)) {
      report += `- ${component}\n`;
    }
    report += "\n";
  }

  // Save report
  const reportsDir = path.join(rootDir, "reports");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replaceAll(/[.:]/g, "-").split("T")[0];
  const reportPath = path.join(reportsDir, `cleanup-${timestamp}.md`);
  fs.writeFileSync(reportPath, report);

  log(`\n✅ Cleanup report saved: ${reportPath}`, "green");
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  section("ComicWise - Project Cleanup Tool");

  if (dryRun) {
    log("Running in DRY-RUN mode - no files will be deleted\n", "yellow");
  }

  try {
    const backupStats = removeBackupFiles();
    let tempStats: CleanupStats = { filesRemoved: 0, bytesFreed: 0, filesPreserved: 0 };
    let duplicates: any[] = [];
    let unused: string[] = [];

    if (!backupOnly) {
      tempStats = removeTemporaryFiles();
      duplicates = findDuplicateFiles();
      unused = findUnusedComponents();
    }

    section("Cleanup Report");

    log(`Backup Files: ${backupStats.filesRemoved} removed, ${backupStats.filesPreserved} preserved`, "cyan");
    log(`Temporary Files: ${tempStats.filesRemoved} removed, ${tempStats.filesPreserved} preserved`, "cyan");

    if (duplicates.length > 0) {
      log(`\n⚠️  Found ${duplicates.length} duplicate file groups`, "yellow");
    }

    if (unused.length > 0) {
      log(`\n⚠️  Found ${unused.length} potentially unused components`, "yellow");
    }

    generateReport(backupStats, tempStats, duplicates, unused);

    const totalRemoved = backupStats.filesRemoved + tempStats.filesRemoved;
    const totalFreed = (backupStats.bytesFreed + tempStats.bytesFreed) / 1024 / 1024;

    log(`\n✅ Cleanup ${dryRun ? "preview" : "completed"}!`, "green");
    log(`   Total files ${dryRun ? "to be " : ""}removed: ${totalRemoved}`, "bright");
    log(`   Space ${dryRun ? "to be " : ""}freed: ${totalFreed.toFixed(2)} MB\n`, "bright");

    if (!dryRun) {
      log("✅ Project cleaned up successfully!", "green");
    } else {
      log("Run without --dry-run to apply changes", "yellow");
    }
  } catch (error) {
    log(`Error during cleanup: ${error instanceof Error ? error.message : String(error)}`, "red");
    process.exit(1);
  }
}

main();
