#!/usr/bin/env tsx
import { execSync } from "child_process";
import chalk from "chalk";
import ora from "ora";

interface FixResult {
  success: boolean;
  errors: number;
  warnings: number;
  output: string;
}

async function runCommand(
  command: string,
  description: string
): Promise<FixResult> {
  const spinner = ora(description).start();

  try {
    const output = execSync(command, {
      encoding: "utf8",
      stdio: "pipe",
    });

    spinner.succeed(chalk.green(`✓ ${description}`));
    return {
      success: true,
      errors: 0,
      warnings: 0,
      output,
    };
  } catch (error: any) {
    const output = error.stdout || error.stderr || "";
    const errorMatch = output.match(/(\d+) error/);
    const warningMatch = output.match(/(\d+) warning/);

    const errors = errorMatch ? parseInt(errorMatch[1]) : 0;
    const warnings = warningMatch ? parseInt(warningMatch[1]) : 0;

    if (errors > 0) {
      spinner.fail(chalk.red(`✗ ${description} - ${errors} errors`));
    } else if (warnings > 0) {
      spinner.warn(chalk.yellow(`⚠ ${description} - ${warnings} warnings`));
    } else {
      spinner.succeed(chalk.green(`✓ ${description}`));
    }

    return {
      success: errors === 0,
      errors,
      warnings,
      output,
    };
  }
}

async function fixTypeErrors(): Promise<FixResult> {
  return runCommand("pnpm type-check", "Type checking");
}

async function fixLintErrors(): Promise<FixResult> {
  const fixResult = await runCommand("pnpm lint:fix", "Fixing lint errors");

  await runCommand("pnpm lint", "Verifying lint fixes");

  return fixResult;
}

async function formatCode(): Promise<FixResult> {
  return runCommand("pnpm format", "Formatting code");
}

async function optimizeImports(): Promise<FixResult> {
  return runCommand("pnpm imports:optimize", "Optimizing imports");
}

async function main() {
  console.log(chalk.bold.cyan("\n🔧 ComicWise Error Fixer\n"));

  const results: { name: string; result: FixResult }[] = [];

  results.push({
    name: "Format Code",
    result: await formatCode(),
  });

  results.push({
    name: "Optimize Imports",
    result: await optimizeImports(),
  });

  results.push({
    name: "Fix Lint Errors",
    result: await fixLintErrors(),
  });

  results.push({
    name: "Type Check",
    result: await fixTypeErrors(),
  });

  console.log(chalk.bold.cyan("\n📊 Summary:\n"));

  let totalErrors = 0;
  let totalWarnings = 0;
  let allPassed = true;

  for (const { name, result } of results) {
    totalErrors += result.errors;
    totalWarnings += result.warnings;
    allPassed = allPassed && result.success;

    const status = result.success
      ? chalk.green("✓")
      : result.errors > 0
        ? chalk.red("✗")
        : chalk.yellow("⚠");

    console.log(
      `${status} ${name}: ${result.errors} errors, ${result.warnings} warnings`
    );
  }

  console.log(
    chalk.bold.cyan(
      `\nTotal: ${totalErrors} errors, ${totalWarnings} warnings\n`
    )
  );

  if (allPassed && totalWarnings === 0) {
    console.log(chalk.bold.green("✨ All checks passed!\n"));
    process.exit(0);
  } else if (totalErrors === 0) {
    console.log(
      chalk.bold.yellow("⚠ All errors fixed, but warnings remain\n")
    );
    process.exit(0);
  } else {
    console.log(chalk.bold.red("❌ Some errors could not be auto-fixed\n"));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(chalk.red("\n❌ Script failed:"), error);
  process.exit(1);
});
