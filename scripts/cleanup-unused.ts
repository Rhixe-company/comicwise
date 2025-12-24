// ═══════════════════════════════════════════════════
// CLEANUP SCRIPT - Remove Unused and Duplicate Files
// ═══════════════════════════════════════════════════

import chalk from "chalk";
import { existsSync, unlinkSync } from "fs";
import { join } from "path";

console.log(chalk.cyan("\n╔══════════════════════════════════════════════════════════════╗"));
console.log(chalk.cyan("║          Cleanup Script - Remove Unused Files               ║"));
console.log(chalk.cyan("╚══════════════════════════════════════════════════════════════╝\n"));

const filesToRemove = [
  // Old type files that are now consolidated
  "src/types/core.ts",
  "src/types/api.d.ts",
  "src/types/database-auto.ts",
  "src/types/database-models.ts",

  // Duplicate or old implementation files
  "src/lib/search.ts", // Replaced by searchRefactored.ts

  // Old summary/documentation files (keep only latest)
  "COMPLETE_TASK_SUMMARY.md",
  "EXECUTION_SUMMARY.md",
  "FEATURES_COMPLETE.md",
  "FEATURE_IMPLEMENTATION_COMPLETE.md",
  "FILES_CREATED.md",
  "FIXES_COMPLETE.md",
  "IMPLEMENTATION_COMPLETE.md",
  "IMPLEMENTATION_PLAN.md",
  "IMPLEMENTATION_SUMMARY.md",
  "MIGRATION_REFACTORING_COMPLETE.md",
  "OPTIMIZATION_COMPLETE.md",
  "PATH_ALIASES_COMPLETE.md",
  "README_COMPLETE.md",
  "SCRIPT_EXECUTION_COMPLETE.md",
  "TASKS_COMPLETE.md",
  "TASK_COMPLETION_STATUS.md",
];

let deletedCount = 0;
let skippedCount = 0;

for (const file of filesToRemove) {
  const filePath = join(process.cwd(), file);

  if (existsSync(filePath)) {
    try {
      unlinkSync(filePath);
      deletedCount++;
      console.log(chalk.green(`✓ Deleted: ${file}`));
    } catch (error) {
      console.log(chalk.yellow(`⚠ Could not delete: ${file}`));
      skippedCount++;
    }
  } else {
    skippedCount++;
  }
}

console.log(chalk.cyan("\n╔══════════════════════════════════════════════════════════════╗"));
console.log(chalk.cyan("║                        Summary                                ║"));
console.log(chalk.cyan("╚══════════════════════════════════════════════════════════════╝\n"));

console.log(chalk.yellow("Files deleted:"), deletedCount);
console.log(chalk.yellow("Files skipped:"), skippedCount);

console.log(chalk.green("\n✅ Cleanup complete!\n"));

process.exit(0);
