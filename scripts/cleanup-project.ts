#!/usr/bin/env tsx
import chalk from "chalk";
import fs from "fs-extra";
import ora from "ora";
import path from "path";

interface CleanupConfig {
  rootDir: string;
  srcDir: string;
  unusedDocs: string[];
  unusedFiles: string[];
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
};

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

async function main() {
  console.log(chalk.bold.cyan("\n🧹 ComicWise Project Cleanup\n"));

  await cleanupUnusedFiles();
  await optimizeFolderStructure();

  console.log(chalk.bold.green("\n✨ Project cleanup complete!\n"));
}

main().catch(console.error);
