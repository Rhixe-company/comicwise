#!/usr/bin/env tsx
/**
 * Complete Project Cleanup Script
 * - Removes unused files
 * - Optimizes folder structure
 * - Cleans up temporary files
 * - Removes duplicate files
 */

import * as fs from "fs";
import * as path from "path";

const projectRoot = process.cwd();

// Files and directories to remove
const filesToRemove = [
  // Duplicate JSON files in root
  "chapters.json",
  "chaptersdata1.json",
  "chaptersdata2.json",
  "comics.json",
  "comicsdata1.json",
  "comicsdata2.json",
  "users.json",

  // Old backup files
  "src/types/global-backup.d.ts",

  // Temporary build artifacts
  "tsconfig.tsbuildinfo",

  // Old unused types
  "src/types/stub-types.d.ts",
  "src/types/stubs.d.ts",
];

const directoriesToClean = [
  ".next",
  "node_modules/.cache",
  "src/**/*.js",
  "src/**/*.jsx",
  "src/**/*.map",
];

console.log("🧹 Starting Complete Project Cleanup...\n");

// Step 1: Remove specified files
console.log("📝 Step 1: Removing unused files...");
for (const file of filesToRemove) {
  const filePath = path.join(projectRoot, file);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`  ✓ Removed: ${file}`);
    } catch (error) {
      console.error(`  ✗ Failed to remove ${file}:`, error);
    }
  }
}

// Step 2: Clean build artifacts
console.log("\n📝 Step 2: Cleaning build artifacts...");
cleanDirectory(path.join(projectRoot, ".next"));
cleanDirectory(path.join(projectRoot, "node_modules", ".cache"));

// Step 3: Organize public/uploads
console.log("\n📝 Step 3: Organizing uploads directory...");
organizeUploadsDirectory();

console.log("\n✅ Project cleanup completed successfully!");

function cleanDirectory(dirPath: string) {
  if (fs.existsSync(dirPath)) {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`  ✓ Cleaned: ${dirPath}`);
    } catch (error) {
      console.error(`  ✗ Failed to clean ${dirPath}:`, error);
    }
  }
}

function organizeUploadsDirectory() {
  const uploadsDir = path.join(projectRoot, "public", "uploads");

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Create subdirectories
  const subdirs = ["comics", "chapters", "avatars", "temp"];

  for (const subdir of subdirs) {
    const subdirPath = path.join(uploadsDir, subdir);
    if (!fs.existsSync(subdirPath)) {
      fs.mkdirSync(subdirPath, { recursive: true });
      console.log(`  ✓ Created: public/uploads/${subdir}`);
    }
  }

  // Add .gitkeep files
  for (const subdir of subdirs) {
    const gitkeepPath = path.join(uploadsDir, subdir, ".gitkeep");
    if (!fs.existsSync(gitkeepPath)) {
      fs.writeFileSync(gitkeepPath, "");
    }
  }
}
