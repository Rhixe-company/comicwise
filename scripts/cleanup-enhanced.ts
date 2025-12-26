#!/usr/bin/env tsx
/**
 * Enhanced Project Cleanup Script
 * - Removes unused files
 * - Detects and reports duplicate action files
 * - Detects duplicate function exports
 * - Optimizes folder structure
 * - Cleans up temporary files
 */

import chalk from "chalk";
import fs from "fs-extra";
import ora from "ora";
import path from "path";

interface CleanupConfig {
  rootDir: string;
  srcDir: string;
  unusedDocs: string[];
  unusedFiles: string[];
  duplicateActionFiles: string[];
}

const config: CleanupConfig = {
  rootDir: process.cwd(),
  srcDir: path.join(process.cwd(), "src"),
  unusedDocs: [
    "BUILD_FIXES_APPLIED.md",
    "BUILD_FIXES_SUMMARY.md",
    "CLEANUP_AUDIT_REPORT.md",
    "CLEANUP_DOCUMENTATION_INDEX.md",
    "CLEANUP_EXECUTION_GUIDE.md",
    "CLEANUP_FINAL_REPORT.md",
    "CLEANUP_QUICK_REFERENCE.md",
    "COGNITIVE_COMPLEXITY_FINAL_FIX.md",
    "COGNITIVE_COMPLEXITY_FIXES.md",
    "COGNITIVE_COMPLEXITY_QUICK_GUIDE.md",
    "COGNITIVE_COMPLEXITY_REFACTORING.md",
    "COMPLETE_IMPLEMENTATION_REPORT.md",
    "COMPLETE_OPTIMIZATION_SUMMARY.md",
    "COMPLETE_PROJECT_INDEX.md",
    "COMPREHENSIVE_ERROR_ANALYSIS.md",
    "CONFIGURATION_IMPLEMENTATION_GUIDE.md",
    "CONFIG_FILE_INDEX.md",
    "CONFIG_OPTIMIZATION_CHECKLIST.md",
    "CONFIG_OPTIMIZATION_SUMMARY.md",
    "DATABASE_SEED_FIXES.md",
    "DEPLOYMENT_READY.md",
    "DEVELOPER_GUIDE.md",
    "DEVELOPER_QUICK_REFERENCE.md",
    "DOCKER_ENV_SETUP.md",
    "DOCKER_ENV_SETUP_COMPLETE.md",
    "DOCUMENTATION_SUMMARY.md",
    "ENVIRONMENT_DOCKER_SETUP_INDEX.md",
    "ERROR_FIXES_INDEX.md",
    "ERROR_FIXES_SUMMARY.md",
    "EXACT_CODE_CHANGES.md",
    "FIXES_COMPLETE_SUMMARY.md",
    "FIXES_VERIFICATION_CHECKLIST.md",
    "GITHUB_ACTIONS_ESLINT_COMPLETE.md",
    "IMAGE_SERVICE_COMPLETE.md",
    "IMAGE_SERVICE_FINAL_OPTIMIZATION.md",
    "IMAGE_SERVICE_OPTIMIZATION.md",
    "IMAGE_SERVICE_QUICK_REFERENCE.md",
    "IMAGE_UPLOAD_FIX_SUMMARY.md",
    "INSTALLATION_VERIFICATION.md",
    "NEXT_STEPS_GUIDE.md",
    "ONBOARDING.md",
    "PACKAGE_INSTALLATION_GUIDE.md",
    "PACKAGE_JSON_OPTIMIZATION.md",
    "PATH_ALIASES_GUIDE.md",
    "PATH_ALIASES_IMPLEMENTATION.md",
    "PROJECT_COMPLETION_FINAL.md",
    "PROJECT_IMPLEMENTATION_COMPLETE.md",
    "README_CLEANUP_COMPLETE.md",
    "README_FIXES.md",
    "RETURN_TYPES_ANALYSIS_REPORT.md",
    "SCRIPTS_QUICK_REFERENCE.md",
    "SEED_BEFORE_AFTER.md",
    "SEED_OPTIMIZATION_COMPLETE.md",
    "SEED_OPTIMIZATION_COMPLETION.md",
    "SEED_OPTIMIZATION_FINAL_REPORT.md",
    "SEED_OPTIMIZATION_FINAL_STATUS.md",
    "SEED_OPTIMIZATION_QUICK_REFERENCE.md",
    "SEED_OPTIMIZATION_REPORT.md",
    "SEED_OPTIMIZATION_SUMMARY.txt",
    "SEED_QUERIES_OPTIMIZATION.md",
    "SEED_REFACTORING_QUICK_REF.md",
    "SETUP.md",
    "SETUP_COMPLETE.md",
    "SETUP_COMPLETION_REPORT.md",
    "SETUP_QUICK_REFERENCE.md",
    "START_HERE.md",
    "TASKS_COMPLETION_REPORT.md",
    "THEMING_IMPLEMENTATION_PLAN.md",
    "VSCODE_SETUP_COMPLETE.md",
    "build_output.txt",
    "chapters.json",
    "chaptersdata1.json",
    "chaptersdata2.json",
    "comics.json",
    "comicsdata1.json",
    "comicsdata2.json",
    "users.json",
    "prompt.txt",
    "proxy.ts",
  ],
  unusedFiles: [
    "cleanup.ps1",
    "cleanup.sh",
    "fix-build-errors.ps1",
    "fix-final.ps1",
    "fix-type-errors.ps1",
  ],
  duplicateActionFiles: [
    // Singular versions that duplicate functionality from plural versions
    "src/lib/actions/comic.ts",
    "src/lib/actions/chapter.ts",
    "src/lib/actions/artist.ts",
    "src/lib/actions/author.ts",
  ],
};

interface FunctionExport {
  name: string;
  file: string;
}

async function cleanupUnusedFiles() {
  const spinner = ora("Cleaning up unused files...").start();
  let cleaned = 0;

  try {
    for (const file of [...config.unusedDocs, ...config.unusedFiles]) {
      const filePath = path.join(config.rootDir, file);
      if (await fs.pathExists(filePath)) {
        await fs.remove(filePath);
        cleaned++;
        spinner.text = `Removed: ${file}`;
      }
    }

    spinner.succeed(chalk.green(`✓ Cleanup complete! Removed ${cleaned} files.`));
  } catch (error) {
    spinner.fail(chalk.red("✗ Cleanup failed"));
    console.error(error);
    process.exit(1);
  }
}

async function detectDuplicateActionFiles() {
  const spinner = ora("Detecting duplicate action files...").start();
  const duplicates: string[] = [];

  try {
    for (const file of config.duplicateActionFiles) {
      const filePath = path.join(config.rootDir, file);
      if (await fs.pathExists(filePath)) {
        duplicates.push(file);
      }
    }

    if (duplicates.length > 0) {
      spinner.warn(chalk.yellow(`⚠ Found ${duplicates.length} duplicate action files:`));
      console.log(chalk.yellow("\nDuplicate files (recommend removal):"));
      duplicates.forEach((file) => {
        console.log(chalk.yellow(`  - ${file}`));
        const basename = path.basename(file, ".ts");
        const pluralVersion = file.replace(`${basename}.ts`, `${basename}s.ts`);
        console.log(chalk.cyan(`    → Consolidated into: ${pluralVersion}`));
      });
      console.log();
    } else {
      spinner.succeed(chalk.green("✓ No duplicate action files found"));
    }

    return duplicates;
  } catch (error) {
    spinner.fail(chalk.red("✗ Duplicate detection failed"));
    console.error(error);
    return [];
  }
}

async function extractExportedFunctions(filePath: string): Promise<FunctionExport[]> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const exports: FunctionExport[] = [];

    // Match export async function, export function, and export const ... = async
    const functionRegex = /export\s+(?:async\s+)?function\s+(\w+)/g;
    const constRegex = /export\s+(?:const|let|var)\s+(\w+)\s*=/g;

    let match;
    while ((match = functionRegex.exec(content)) !== null) {
      exports.push({ name: match[1]!, file: filePath });
    }

    while ((match = constRegex.exec(content)) !== null) {
      exports.push({ name: match[1]!, file: filePath });
    }

    return exports;
  } catch (error) {
    return [];
  }
}

async function detectDuplicateFunctions() {
  const spinner = ora("Detecting duplicate function exports...").start();

  try {
    const actionsDir = path.join(config.srcDir, "lib", "actions");
    const files = await fs.readdir(actionsDir);
    const tsFiles = files.filter((f) => f.endsWith(".ts"));

    const allExports: FunctionExport[] = [];

    for (const file of tsFiles) {
      const filePath = path.join(actionsDir, file);
      const exports = await extractExportedFunctions(filePath);
      allExports.push(...exports);
    }

    // Find duplicates
    const functionMap = new Map<string, string[]>();
    for (const exp of allExports) {
      const existing = functionMap.get(exp.name) || [];
      existing.push(path.relative(config.rootDir, exp.file));
      functionMap.set(exp.name, existing);
    }

    const duplicates = Array.from(functionMap.entries()).filter(([_, files]) => files.length > 1);

    if (duplicates.length > 0) {
      spinner.warn(chalk.yellow(`⚠ Found ${duplicates.length} duplicate function exports:`));
      console.log(chalk.yellow("\nDuplicate functions:"));
      duplicates.forEach(([name, files]) => {
        console.log(chalk.yellow(`  - ${name} (exported in ${files.length} files):`));
        files.forEach((file) => {
          console.log(chalk.gray(`    • ${file}`));
        });
      });
      console.log();
    } else {
      spinner.succeed(chalk.green("✓ No duplicate function exports found"));
    }

    return duplicates;
  } catch (error) {
    spinner.fail(chalk.red("✗ Function detection failed"));
    console.error(error);
    return [];
  }
}

async function removeDuplicateActionFiles(duplicates: string[]) {
  if (duplicates.length === 0) return;

  const spinner = ora("Removing duplicate action files...").start();
  let removed = 0;

  try {
    for (const file of duplicates) {
      const filePath = path.join(config.rootDir, file);
      if (await fs.pathExists(filePath)) {
        await fs.remove(filePath);
        removed++;
        spinner.text = `Removed: ${file}`;
      }
    }

    spinner.succeed(chalk.green(`✓ Removed ${removed} duplicate action files`));
  } catch (error) {
    spinner.fail(chalk.red("✗ Failed to remove duplicate files"));
    console.error(error);
  }
}

async function optimizeFolderStructure() {
  const spinner = ora("Optimizing folder structure...").start();

  try {
    const docsDir = path.join(config.rootDir, "docs");
    await fs.ensureDir(docsDir);

    const keepDocs = ["README.md", "LICENSE"];
    const allFiles = await fs.readdir(config.rootDir);
    const mdFiles = allFiles.filter((f) => f.endsWith(".md") && !keepDocs.includes(f));

    for (const mdFile of mdFiles) {
      const sourcePath = path.join(config.rootDir, mdFile);
      const targetPath = path.join(docsDir, mdFile);
      if (await fs.pathExists(sourcePath)) {
        await fs.move(sourcePath, targetPath, { overwrite: true });
      }
    }

    spinner.succeed(chalk.green(`✓ Moved ${mdFiles.length} docs to docs/ folder`));
  } catch (error) {
    spinner.fail(chalk.red("✗ Folder optimization failed"));
    console.error(error);
  }
}

async function cleanBuildArtifacts() {
  const spinner = ora("Cleaning build artifacts...").start();

  try {
    const artifacts = [".next", "node_modules/.cache", "tsconfig.tsbuildinfo"];
    let cleaned = 0;

    for (const artifact of artifacts) {
      const artifactPath = path.join(config.rootDir, artifact);
      if (await fs.pathExists(artifactPath)) {
        await fs.remove(artifactPath);
        cleaned++;
      }
    }

    spinner.succeed(chalk.green(`✓ Cleaned ${cleaned} build artifacts`));
  } catch (error) {
    spinner.fail(chalk.red("✗ Build artifact cleanup failed"));
    console.error(error);
  }
}

async function generateCleanupReport(
  duplicateFiles: string[],
  duplicateFunctions: Array<[string, string[]]>
) {
  const reportPath = path.join(config.rootDir, "docs", "CLEANUP_REPORT.md");

  let report = ` Project Cleanup Report\n\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;

  report += ` Summary\n\n`;
  report += `- Duplicate Action Files: ${duplicateFiles.length}\n`;
  report += `- Duplicate Function Exports: ${duplicateFunctions.length}\n\n`;

  if (duplicateFiles.length > 0) {
    report += ` Duplicate Action Files (Removed)\n\n`;
    duplicateFiles.forEach((file) => {
      const basename = path.basename(file, ".ts");
      const pluralVersion = file.replace(`${basename}.ts`, `${basename}s.ts`);
      report += `- ~~${file}~~ → Consolidated into \`${pluralVersion}\`\n`;
    });
    report += `\n`;
  }

  if (duplicateFunctions.length > 0) {
    report += ` Duplicate Function Exports\n\n`;
    report += `The following functions are exported from multiple files:\n\n`;
    duplicateFunctions.forEach(([name, files]) => {
      report += ` \`${name}\`\n\n`;
      files.forEach((file) => {
        report += `- ${file}\n`;
      });
      report += `\n`;
    });
  }

  report += ` Recommendations\n\n`;
  report += `1. Use DAL (Data Access Layer) for all database operations\n`;
  report += `2. Use DTOs (Data Transfer Objects) for type definitions\n`;
  report += `3. Keep action files focused on server actions only\n`;
  report += `4. Avoid duplicate function names across action files\n`;
  report += `5. Consider consolidating related actions into single files\n\n`;

  await fs.ensureDir(path.dirname(reportPath));
  await fs.writeFile(reportPath, report);

  console.log(chalk.cyan(`\n📄 Cleanup report generated: ${reportPath}\n`));
}

async function main() {
  console.log(chalk.bold.cyan("\n🧹 ComicWise Enhanced Project Cleanup\n"));

  // Step 1: Clean unused files
  await cleanupUnusedFiles();

  // Step 2: Detect and report duplicate action files
  const duplicateFiles = await detectDuplicateActionFiles();

  // Step 3: Detect duplicate function exports
  const duplicateFunctions = await detectDuplicateFunctions();

  // Step 4: Remove duplicate action files (with confirmation)
  if (duplicateFiles.length > 0) {
    console.log(chalk.yellow("\n⚠ Warning: About to remove duplicate action files"));
    console.log(chalk.gray("The plural versions (comics.ts, chapters.ts) will be kept\n"));
    await removeDuplicateActionFiles(duplicateFiles);
  }

  // Step 5: Optimize folder structure
  await optimizeFolderStructure();

  // Step 6: Clean build artifacts
  await cleanBuildArtifacts();

  // Step 7: Generate cleanup report
  await generateCleanupReport(duplicateFiles, duplicateFunctions);

  console.log(chalk.bold.green("\n✨ Project cleanup complete!\n"));
}

main().catch(console.error);
