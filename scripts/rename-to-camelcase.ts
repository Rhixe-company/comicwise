#!/usr/bin/env tsx
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CAMELCASE FILE RENAMER
 * ═══════════════════════════════════════════════════════════════════════════
 */

import chalk from "chalk";
import { existsSync, renameSync } from "fs";
import { globSync } from "glob";
import { basename, dirname, join } from "path";

console.log(chalk.cyan("\n╔══════════════════════════════════════════════════════════════╗"));
console.log(chalk.cyan("║          CamelCase File Renamer - ComicWise                  ║"));
console.log(chalk.cyan("╚══════════════════════════════════════════════════════════════╝\n"));

function toCamelCase(str: string): string {
  return str
    .split(/[-_\s]/)
    .map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toLowerCase() + word.slice(1);
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join("");
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

const files = globSync("src/**/*.{ts,tsx}", {
  ignore: ["**/node_modules/**", "**/.next/**"],
});

console.log(chalk.blue(`📁 Found ${files.length} files to check\n`));

let renamedFiles = 0;

for (const file of files) {
  const dir = dirname(file);
  const filename = basename(file);
  const [name, ext] = filename.split(".");

  // Determine if it's a component (PascalCase) or utility (camelCase)
  const isComponent = ext === "tsx" || filename.includes("Component") || /^[A-Z]/.test(name);

  // Skip if already in correct format
  if (isComponent && name === toPascalCase(name)) {
    continue;
  }
  if (!isComponent && name === toCamelCase(name)) {
    continue;
  }

  const newName = isComponent ? toPascalCase(name) : toCamelCase(name);
  const newFile = join(dir, `${newName}.${ext}`);

  if (name !== newName && !existsSync(newFile)) {
    try {
      renameSync(file, newFile);
      renamedFiles++;
      console.log(chalk.green(`✓ Renamed: ${filename} -> ${newName}.${ext}`));
    } catch (error) {
      console.log(chalk.red(`✗ Error renaming ${filename}:`, error));
    }
  }
}

console.log(chalk.cyan("\n╔══════════════════════════════════════════════════════════════╗"));
console.log(chalk.cyan("║                        Summary                                ║"));
console.log(chalk.cyan("╚══════════════════════════════════════════════════════════════╝\n"));

console.log(chalk.yellow("Files processed:"), files.length);
console.log(chalk.yellow("Files renamed:"), renamedFiles);

console.log(chalk.green("\n✅ File renaming complete!\n"));

process.exit(0);
