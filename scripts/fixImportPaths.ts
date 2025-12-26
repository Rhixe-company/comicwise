#!/usr/bin/env tsx
/**
 * Fix Import Paths - Update all imports to use correct tsconfig paths
 * This script fixes common import path issues across the project
 */

import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";
import { glob } from "glob";

const ROOT_DIR = process.cwd();

// Map of incorrect imports to correct imports based on tsconfig.json paths
const importMappings: Record<string, string> = {
  // UI components
  "'ui/": "'ui/",
  '"ui/': '"ui/',
  "from 'ui/": "from 'ui/",
  'from "ui/': 'from "ui/',
  
  // Components
  "'components/": "'components/",
  '"components/': '"components/',
  "from 'components/": "from 'components/",
  'from "components/': 'from "components/',
  
  // Database
  "'database/db'": "'database/db'",
  '"database/db"': '"database/db"',
  "'database/queries'": "'database/queries'",
  '"database/queries"': '"database/queries"',
  "'database/mutations'": "'database/mutations'",
  '"database/mutations"': '"database/mutations"',
  "'database/schema'": "'database/schema'",
  '"database/schema"': '"database/schema"',
  
  // Queries and Mutations  "'queries/": "'database/queries/",
  '"queries/': '"database/queries/',
  "'mutations/": "'database/mutations/",
  '"mutations/': '"database/mutations/',
  
  // DTO
  "'dto/": "'/dto/",
  '"dto/': '"/dto/',
  "/dto/": "/dto/",
  
  // Lib
  "'lib/": "'lib/",
  '"lib/': '"lib/',
  "'lib/validations'": "'lib/validations'",
  '"lib/validations"': '"lib/validations"',
  
  // Types
  "'types/": "'/types/",
  '"types/': '"/types/',
  
  // Admin
  "'admin/": "'components/admin/",
  '"admin/': '"components/admin/',
};

async function fixImportsInFile(filePath: string): Promise<number> {
  let content = await fs.readFile(filePath, "utf-8");
  let changes = 0;
  
  for (const [incorrect, correct] of Object.entries(importMappings)) {
    if (content.includes(incorrect)) {
      const regex = new RegExp(incorrect.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      content = content.replace(regex, correct);
      changes++;
    }
  }
  
  if (changes > 0) {
    await fs.writeFile(filePath, content, "utf-8");
  }
  
  return changes;
}

async function main(): Promise<void> {
  console.log("🔍 Finding TypeScript and TSX files...\n");
  
  const files = await glob("**/*.{ts,tsx}", {
    cwd: ROOT_DIR,
    ignore: ["**/node_modules/**", "**/.next/**", "**/dist/**"],
  });
  
  console.log(`📝 Found ${files.length} files to process\n`);
  
  let totalChanges = 0;
  let filesChanged = 0;
  
  for (const file of files) {
    const filePath = path.join(ROOT_DIR, file);
    const changes = await fixImportsInFile(filePath);
    
    if (changes > 0) {
      filesChanged++;
      totalChanges += changes;
      console.log(`✓ ${file} (${changes} changes)`);
    }
  }
  
  console.log(`\n✅ Complete!`);
  console.log(`   Files changed: ${filesChanged}`);
  console.log(`   Total changes: ${totalChanges}`);
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
