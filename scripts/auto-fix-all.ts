#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AUTOMATED FIX SCRIPT - ComicWise
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Automatically fixes common type errors and import issues
 *
 * usage pnpm tsx scripts/auto-fix-all.ts
 */

import chalk from "chalk";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { globSync } from "glob";

console.log(chalk.cyan("\n╔══════════════════════════════════════════════════════════════╗"));
console.log(chalk.cyan("║          Auto-Fix All Issues - ComicWise                      ║"));
console.log(chalk.cyan("╚══════════════════════════════════════════════════════════════╝\n"));

let fixCount = 0;
const fixes: string[] = [];

// ═══════════════════════════════════════════════════
// FIX 1: Update actions imports to dto imports
// ═══════════════════════════════════════════════════

console.log(chalk.blue("📦 Fixing action imports to use DTOs..."));

const actionImportMap = {
  "actions/auth": "dto/authDto",
  "actions/artists": "dto/artistsDto",
  "actions/authors": "dto/authorsDto",
  "actions/chapters": "dto/chaptersDto",
  "actions/comics": "dto/comicsDto",
  "actions/comments": "dto/commentsDto",
  "actions/genres": "dto/genresDto",
  "actions/genresTypes": "dto/genresTypesDto",
  "actions/types": "dto/typesDto",
  "actions/users": "dto/usersDto",
  "actions/bookmark": "dto/bookmarkDto",
  "actions/bookmarksComments": "dto/bookmarksCommentsDto",
};

const files = globSync("**/*.{ts,tsx}", {
  ignore: ["node_modules/**", ".next/**", "lib/actions/**", "lib/dto/**"],
});

for (const file of files) {
  let content = readFileSync(file, "utf8");
  const original = content;
  let fileFixed = false;

  for (const [oldImport, newImport] of Object.entries(actionImportMap)) {
    const regex = new RegExp(`from ["']${oldImport.replace(/\//g, "\\/")}["']`, "g");
    if (regex.test(content)) {
      content = content.replace(regex, `from "${newImport}"`);
      fileFixed = true;
    }
  }

  if (content !== original) {
    writeFileSync(file, content, "utf8");
    fixes.push(`✓ ${file}: Updated action imports to DTOs`);
    fixCount++;
  }
}

console.log(chalk.green(`  Fixed ${fixCount} files\n`));

// ═══════════════════════════════════════════════════
// FIX 2: Fix useMobile hook import
// ═══════════════════════════════════════════════════

console.log(chalk.blue("🔧 Fixing useMobile hook imports..."));

const useMobileFiles = globSync("**/*.{ts,tsx}", {
  ignore: ["node_modules/**", ".next/**", "hooks/useMobile.ts", "hooks/use-mobile.ts"],
});

let mobileFixCount = 0;
for (const file of useMobileFiles) {
  let content = readFileSync(file, "utf8");
  const original = content;

  // Fix incorrect import
  content = content.replace(
    /import\s*\{\s*useMobile\s*\}\s*from\s*["']\.\/useMobile["']/g,
    'import { useIsMobile } from "./useMobile"'
  );

  content = content.replace(
    /import\s*\{\s*useMobile\s*\}\s*from\s*["']hooks\/useMobile["']/g,
    'import { useIsMobile } from "hooks/useMobile"'
  );

  // Also rename usage if needed
  if (content !== original) {
    writeFileSync(file, content, "utf8");
    fixes.push(`✓ ${file}: Fixed useMobile import`);
    mobileFixCount++;
  }
}

console.log(chalk.green(`  Fixed ${mobileFixCount} files\n`));

// ═══════════════════════════════════════════════════
// FIX 3: Fix circular import in actions/utils.ts
// ═══════════════════════════════════════════════════

console.log(chalk.blue("🔄 Fixing circular imports..."));

const utilsFile = "actions/utils.ts";
if (existsSync(utilsFile)) {
  let content = readFileSync(utilsFile, "utf8");
  const original = content;

  // Replace circular import
  content = content.replace(
    /import\s*\{\s*error,\s*success\s*\}\s*from\s*["'].*["']/,
    `export function success<T>(data: T, message?: string) {
  return { success: true as const, data, message };
}

export function error(message: string, errors?: Record<string, string[]>) {
  return { success: false as const, error: message, errors };
}`
  );

  if (content !== original) {
    writeFileSync(utilsFile, content, "utf8");
    fixes.push(`✓ ${utilsFile}: Fixed circular import`);
    fixCount++;
  }
}

console.log(chalk.green(`  Fixed circular imports\n`));

// ═══════════════════════════════════════════════════
// FIX 4: Add type annotations for rate limit
// ═══════════════════════════════════════════════════

console.log(chalk.blue("⚡ Fixing rate limit type errors..."));

const rateLimitFiles = ["lib/actions/users.ts", "lib/actions/workflow.ts"];

for (const file of rateLimitFiles) {
  if (!existsSync(file)) continue;

  let content = readFileSync(file, "utf8");
  const original = content;

  // Fix window type
  content = content.replace(/window:\s*30\s*\*\s*1000/g, 'window: "30s"');
  content = content.replace(/window:\s*60\s*\*\s*1000/g, 'window: "60s"');
  content = content.replace(/window:\s*10\s*\*\s*1000/g, 'window: "10s"');

  if (content !== original) {
    writeFileSync(file, content, "utf8");
    fixes.push(`✓ ${file}: Fixed rate limit window type`);
    fixCount++;
  }
}

console.log(chalk.green(`  Fixed rate limit types\n`));

// ═══════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════

console.log(chalk.cyan("\n╔══════════════════════════════════════════════════════════════╗"));
console.log(chalk.cyan("║                        Summary                                ║"));
console.log(chalk.cyan("╚══════════════════════════════════════════════════════════════╝\n"));

console.log(chalk.yellow("Fixes Applied:"));
if (fixes.length > 0) {
  fixes.forEach((fix) => console.log(chalk.gray(`  ${fix}`)));
} else {
  console.log(chalk.gray("  No fixes needed - all good!"));
}

console.log(chalk.green(`\n✓ Total fixes applied: ${fixCount}\n`));
console.log(chalk.cyan("Next steps:"));
console.log(chalk.gray("  1. Run 'pnpm type-check' to verify"));
console.log(chalk.gray("  2. Run 'pnpm lint:fix' to fix linting"));
console.log(chalk.gray("  3. Run 'pnpm format' to format code\n"));
