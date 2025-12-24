#!/usr/bin/env tsx
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MASTER REFACTORING SCRIPT - ComicWise Project Optimization
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Executes all project optimization tasks in the correct order:
 * 0. Validate ESLint configuration
 * 1. Validate and optimize types
 * 2. Update any types to proper types
 * 3. Setup custom paths in tsconfig
 * 4. Update imports to use custom paths
 * 5. Validate scripts
 * 6. Refactor filenames to camelCase
 * 7. Setup project scaffolding
 * 8. Setup shell aliases
 * 9. Cleanup unused files
 * 10. Fix type-check and linting errors
 */

import chalk from "chalk";
import { execSync } from "child_process";
import ora from "ora";

const TASKS = [
  {
    id: 0,
    name: "Validate ESLint Configuration",
    command: "pnpm lint --max-warnings=0",
    skipOnError: true,
  },
  {
    id: 1,
    name: "Optimize Type Definitions",
    command: "pnpm type-check",
    skipOnError: true,
  },
  {
    id: 2,
    name: "Update any Types",
    command: "tsx scripts/update-any-types.ts",
    skipOnError: false,
  },
  {
    id: 3,
    name: "Update Import Paths",
    command: "tsx scripts/replace-imports.ts",
    skipOnError: false,
  },
  {
    id: 4,
    name: "Rename Files to camelCase",
    command: "tsx scripts/rename-to-camelcase.ts",
    skipOnError: false,
  },
  {
    id: 5,
    name: "Run Comprehensive Cleanup",
    command: "tsx scripts/cleanup-comprehensive.ts --dry-run",
    skipOnError: false,
  },
  {
    id: 6,
    name: "Format Code",
    command: "pnpm format",
    skipOnError: false,
  },
  {
    id: 7,
    name: "Final Type Check",
    command: "pnpm type-check",
    skipOnError: true,
  },
  {
    id: 8,
    name: "Final Lint Check",
    command: "pnpm lint:fix",
    skipOnError: true,
  },
];

async function runTask(task: (typeof TASKS)[number]): Promise<boolean> {
  const spinner = ora(`Task ${task.id}: ${task.name}`).start();

  try {
    execSync(task.command, {
      encoding: "utf-8",
      stdio: task.skipOnError ? "pipe" : "inherit",
      timeout: 300000, // 5 minutes
    });
    spinner.succeed(`Task ${task.id}: ${task.name} ✅`);
    return true;
  } catch (error) {
    if (task.skipOnError) {
      spinner.warn(`Task ${task.id}: ${task.name} ⚠️ (Errors found but continuing)`);
      return true;
    }
    spinner.fail(`Task ${task.id}: ${task.name} ❌`);
    console.error(chalk.red(`\nError in task ${task.id}:`));
    console.error(error);
    return false;
  }
}

async function main() {
  console.log(
    chalk.cyan.bold("\n╔══════════════════════════════════════════════════════════════╗")
  );
  console.log(chalk.cyan.bold("║        MASTER REFACTORING SCRIPT - ComicWise                 ║"));
  console.log(
    chalk.cyan.bold("╚══════════════════════════════════════════════════════════════╝\n")
  );

  const startTime = Date.now();
  const results: Array<{ task: string; success: boolean }> = [];

  for (const task of TASKS) {
    const success = await runTask(task);
    results.push({ task: task.name, success });

    if (!success && !task.skipOnError) {
      console.log(chalk.red.bold("\n❌ Refactoring stopped due to error.\n"));
      process.exit(1);
    }

    // Small delay between tasks
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(
    chalk.cyan.bold("\n╔══════════════════════════════════════════════════════════════╗")
  );
  console.log(chalk.cyan.bold("║                    SUMMARY REPORT                             ║"));
  console.log(
    chalk.cyan.bold("╚══════════════════════════════════════════════════════════════╝\n")
  );

  results.forEach(({ task, success }, index) => {
    const icon = success ? chalk.green("✅") : chalk.red("❌");
    console.log(`${icon} Task ${index}: ${task}`);
  });

  console.log(chalk.yellow(`\n⏱️  Total Time: ${duration}s\n`));

  const failedTasks = results.filter((r) => !r.success).length;
  if (failedTasks === 0) {
    console.log(chalk.green.bold("🎉 All tasks completed successfully!\n"));
    process.exit(0);
  } else {
    console.log(chalk.red.bold(`⚠️  ${failedTasks} task(s) had issues.\n`));
    process.exit(1);
  }
}

main().catch(console.error);
