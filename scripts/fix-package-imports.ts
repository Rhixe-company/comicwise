#!/usr/bin/env tsx
/**
 * Fix All Package Imports
 * Ensures all imports use correct package names with proper prefixes
 */

import fs from "fs-extra";
import { glob } from "glob";
import path from "path";

const ROOT_DIR = process.cwd();

const importMappings: [RegExp, string][] = [
  // Radix UI packages
  [/from ['"]radix-ui\/react-(\w+)['"]/g, 'from "@radix-ui/react-$1"'],

  // TanStack packages
  [/from ['"]tanstack\/react-table['"]/g, 'from "@tanstack/react-table"'],
  [/from ['"]tanstack\/react-query['"]/g, 'from "@tanstack/react-query"'],

  // Hookform
  [/from ['"]hookform\/resolvers\/zod['"]/g, 'from "@hookform/resolvers/zod"'],

  // App config - use relative import from root
  [/from ['"]app-config['"]/g, 'from "./app-config"'],

  // Local UI components (ensure @ prefix)
  [/from ['"]components\/ui\/([^'"]+)['"]/g, 'from "@/components/ui/$1"'],
  [/from ['"]lib\/utils['"]/g, 'from "@/lib/utils"'],
];

async function fixFile(filePath: string): Promise<boolean> {
  let content = await fs.readFile(filePath, "utf-8");
  const original = content;

  for (const [pattern, replacement] of importMappings) {
    content = content.replace(pattern, replacement);
  }

  if (content !== original) {
    await fs.writeFile(filePath, content);
    return true;
  }

  return false;
}

async function main() {
  console.log("🔧 Fixing all package imports...\n");

  // Fix all TypeScript files
  const tsFiles = await glob("**/*.{ts,tsx}", {
    cwd: ROOT_DIR,
    ignore: ["**/node_modules/**", "**/.next/**", "**/dist/**"],
    absolute: true,
  });

  let fixedCount = 0;

  for (const file of tsFiles) {
    if (await fixFile(file)) {
      fixedCount++;
      const relativePath = path.relative(ROOT_DIR, file);
      console.log(`✓ ${relativePath}`);
    }
  }

  console.log(`\n✅ Fixed ${fixedCount} files\n`);
}

main().catch(console.error);
