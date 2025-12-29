#!/usr/bin/env tsx
/**
 * Fix All Import Paths - Comprehensive Solution
 * Converts all problematic imports to use correct path aliases
 */

import fs from "fs-extra";
import { glob } from "glob";

interface ImportMapping {
  pattern: RegExp;
  replacement: string;
}

const importMappings: ImportMapping[] = [
  // UI Components
  { pattern: /from\s+["']ui\/(.*?)["']/g, replacement: 'from "@/components/ui/$1"' },

  // Components
  { pattern: /from\s+["']components\/(.*?)["']/g, replacement: 'from "@/components/$1"' },

  // Database
  { pattern: /from\s+["']database\/(.*?)["']/g, replacement: 'from "@/database/$1"' },

  // Lib/Validations
  {
    pattern: /from\s+["']lib\/validations(?:\/(.*?))?["']/g,
    replacement: 'from "@/lib/validations$1"',
  },

  // DTO with leading slash (incorrect)
  { pattern: /from\s+["']\/dto\/(.*?)["']/g, replacement: 'from "@/dto/$1"' },

  // Types with incorrect path
  { pattern: /from\s+["']\/types\/(.*?)["']/g, replacement: 'from "@/types/$1"' },

  // Services with leading slash
  { pattern: /from\s+["']\/services\/(.*?)["']/g, replacement: 'from "@/services/$1"' },

  // Combined typesdatabase path
  { pattern: /from\s+["']\/typesdatabase["']/g, replacement: 'from "@/typesdatabase"' },
];

async function fixFile(filePath: string): Promise<{ fixed: boolean; changes: number }> {
  const content = await fs.readFile(filePath, "utf-8");
  let newContent = content;
  let changes = 0;

  for (const mapping of importMappings) {
    const matches = newContent.match(mapping.pattern);
    if (matches) {
      newContent = newContent.replace(mapping.pattern, mapping.replacement);
      changes += matches.length;
    }
  }

  if (changes > 0) {
    await fs.writeFile(filePath, newContent, "utf-8");
    return { fixed: true, changes };
  }

  return { fixed: false, changes: 0 };
}

async function main() {
  console.log("🔧 Starting comprehensive import fix...\n");

  const files = await glob("**/*.{ts,tsx}", {
    ignore: ["**/node_modules/**", "**/.next/**", "**/dist/**"],
  });

  console.log(`📁 Found ${files.length} files to process\n`);

  let totalFixed = 0;
  let totalChanges = 0;

  for (const file of files) {
    const result = await fixFile(file);
    if (result.fixed) {
      totalFixed++;
      totalChanges += result.changes;
      console.log(`✅ ${file} (${result.changes} imports fixed)`);
    }
  }

  console.log(`\n✨ Complete!`);
  console.log(`📊 Fixed ${totalChanges} imports across ${totalFixed} files`);
}

main().catch(console.error);
