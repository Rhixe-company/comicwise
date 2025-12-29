#!/usr/bin/env tsx
/**
 * Fix TypeScript Module Resolution Issues
 * This script fixes common "Cannot find module" errors
 */

import fs from "fs-extra";
import { glob } from "glob";
import path from "path";

const ROOT_DIR = process.cwd();

interface Fix {
  pattern: RegExp;
  replacement: string;
  description: string;
}

// Define fixes for common import issues
const fixes: Fix[] = [
  // Fix DTO imports - should use index file
  {
    pattern: /from ["']\/dto\/(\w+)Dto["']/g,
    replacement: 'from "/dto"',
    description: "DTO imports should use index",
  },
  // Fix lib/validations imports
  {
    pattern: /from ["']lib\/validations["']/g,
    replacement: 'from "@/lib/validations"',
    description: "Validations import",
  },
  // Fix database queries/mutations imports
  {
    pattern: /from ["']\database\/(queries|mutations)["']/g,
    replacement: 'from "@/database/$1"',
    description: "Database queries/mutations",
  },
];

async function fixFileImports(filePath: string): Promise<number> {
  let content = await fs.readFile(filePath, "utf-8");
  let changes = 0;

  for (const fix of fixes) {
    const matches = content.match(fix.pattern);
    if (matches) {
      content = content.replace(fix.pattern, fix.replacement);
      changes += matches.length;
    }
  }

  if (changes > 0) {
    await fs.writeFile(filePath, content, "utf-8");
  }

  return changes;
}

async function main(): Promise<void> {
  console.log("🔍 Finding files with potential import issues...\n");

  const files = await glob("**/*.{ts,tsx}", {
    cwd: ROOT_DIR,
    ignore: ["**/node_modules/**", "**/.next/**"],
  });

  console.log(`📝 Found ${files.length} files to check\n`);

  let totalChanges = 0;
  let filesChanged = 0;

  for (const file of files) {
    const filePath = path.join(ROOT_DIR, file);
    const changes = await fixFileImports(filePath);

    if (changes > 0) {
      filesChanged++;
      totalChanges += changes;
      console.log(`✓ ${file} (${changes} changes)`);
    }
  }

  console.log(`\n✅ Complete!`);
  console.log(`   Files changed: ${filesChanged}`);
  console.log(`   Total changes: ${totalChanges}`);

  if (totalChanges === 0) {
    console.log("\n   No changes needed - imports look good!");
  }
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
