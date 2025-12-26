#!/usr/bin/env node

/**
 * IMPORT PATH MIGRATION SCRIPT
 * Automatically migrates old import patterns to new path aliases
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { extname, join } from "path";

// ═══════════════════════════════════════════════════
// MIGRATION PATTERNS
// ═══════════════════════════════════════════════════

const MIGRATION_RULES = [
  // Database
  { from: /from ['"]\.\.\/\.\.\database\/db['"]/g, to: 'from "db"' },
  { from: /from ['"]\.\.\/\.\.\/\.\.\database\/db['"]/g, to: 'from "db"' },
  { from: /from ['"]\database\/db['"]/g, to: 'from "db"' },

  { from: /from ['"]\.\.\/\.\.\database\/schema['"]/g, to: 'from "schema"' },
  { from: /from ['"]\.\.\/\.\.\/\.\.\database\/schema['"]/g, to: 'from "schema"' },
  { from: /from ['"]\database\/schema['"]/g, to: 'from "schema"' },

  // Utils
  { from: /from ['"]\.\.\/\.\.\lib\/utils['"]/g, to: 'from "utils"' },
  { from: /from ['"]\.\.\/\.\.\/\.\.\lib\/utils['"]/g, to: 'from "utils"' },
  { from: /from ['"]\lib\/utils['"]/g, to: 'from "utils"' },

  // Auth
  { from: /from ['"]\.\.\/\.\.\lib\/auth['"]/g, to: 'from "auth"' },
  { from: /from ['"]\.\.\/\.\.\/\.\.\lib\/auth['"]/g, to: 'from "auth"' },
  { from: /from ['"]\lib\/auth['"]/g, to: 'from "auth"' },

  // Components with  prefix
  { from: /from ['"]\components\//g, to: 'from "components/' },
  { from: /from ['"]\.\.\/\.\.\components\//g, to: 'from "components/' },

  // UI components
  { from: /from ['"]components\/ui\//g, to: 'from "@/components/ui/"' },
  { from: /from ['"]\.\.\/\.\.\/components\/ui\//g, to: 'from "@/components/ui/"' },

  // Lib with @ prefix
  { from: /from ['"]lib\//g, to: 'from "@/lib/"' },
  { from: /from ['"]\.\.\/\.\.\/lib\//g, to: 'from "@/lib/"' },

  // Actions
  { from: /from ['"]lib\/actions\//g, to: 'from "actions/"' },
  { from: /from ['"]\.\.\/\.\.\/lib\/actions\//g, to: 'from "actions/"' },

  // Validations
  { from: /from ['"]\lib\/validations\//g, to: 'from "validations/' },
  { from: /from ['"]\.\.\/\.\.\lib\/validations\//g, to: 'from "validations/' },

  // DAL
  { from: /from ['"]\/dal\//g, to: 'from "dal/' },
  { from: /from ['"]\.\.\/\.\.\/dal\//g, to: 'from "dal/' },

  // DTO
  { from: /from ['"]\/dto\//g, to: 'from "@/dto/"' },
  { from: /from ['"]\.\.\/\.\.\/dto\//g, to: 'from "@/dto/"' },

  // Types
  { from: /from ['"]\/types\//g, to: 'from "types/"' },
  { from: /from ['"]\.\.\/\.\.\/types\//g, to: 'from "types/"' },

  // Database paths
  { from: /from ['"]database\//g, to: 'from "@/database/"' },
  { from: /from ['"]\.\.\/\.\.\/database\//g, to: 'from "@/database/"' },

  // Queries
  { from: /from ['"]database\/queries\//g, to: 'from "queries/"' },
  { from: /from ['"]\.\.\/\.\.\/database\/queries\//g, to: 'from "queries/"' },

  // Mutations
  { from: /from ['"]database\/mutations\//g, to: 'from "mutations/"' },
  { from: /from ['"]\.\.\/\.\.\/database\/mutations\//g, to: 'from "mutations/"' },

  // Hooks
  { from: /from ['"]\/hooks\//g, to: 'from "hooks/"' },
  { from: /from ['"]\.\.\/\.\.\/hooks\//g, to: 'from "hooks/"' },

  // Services
  { from: /from ['"]\/services\//g, to: 'from "@/services/"' },
  { from: /from ['"]\.\.\/\.\.\/services\//g, to: 'from "@/services/"' },

  // Stores
  { from: /from ['"]\/stores\//g, to: 'from "stores/"' },
  { from: /from ['"]\.\.\/\.\.\/stores\//g, to: 'from "stores/"' },
];

// ═══════════════════════════════════════════════════
// FILE PROCESSING
// ═══════════════════════════════════════════════════

function isSourceFile(filename: string): boolean {
  const validExtensions = [".ts", ".tsx", ".js", ".jsx", ".mts", ".mjs"];
  return validExtensions.includes(extname(filename));
}

function migrateImports(content: string): { content: string; changes: number } {
  let migratedContent = content;
  let changes = 0;

  for (const rule of MIGRATION_RULES) {
    const matches = migratedContent.match(rule.from);
    if (matches) {
      changes += matches.length;
      migratedContent = migratedContent.replace(rule.from, rule.to);
    }
  }

  return { content: migratedContent, changes };
}

function processFile(filePath: string, dryRun = false): number {
  try {
    const content = readFileSync(filePath, "utf-8");
    const { content: migratedContent, changes } = migrateImports(content);

    if (changes > 0) {
      console.log(`  ✓ ${filePath}: ${changes} import(s) migrated`);

      if (!dryRun) {
        writeFileSync(filePath, migratedContent, "utf-8");
      }
    }

    return changes;
  } catch (error) {
    console.error(`  ✗ Error processing ${filePath}:`, error);
    return 0;
  }
}

function processDirectory(dirPath: string, dryRun = false): number {
  let totalChanges = 0;

  try {
    const items = readdirSync(dirPath);

    for (const item of items) {
      const fullPath = join(dirPath, item);
      const stat = statSync(fullPath);

      // Skip node_modules and .next
      if (item === "node_modules" || item === ".next" || item === "dist") {
        continue;
      }

      if (stat.isDirectory()) {
        totalChanges += processDirectory(fullPath, dryRun);
      } else if (isSourceFile(item)) {
        totalChanges += processFile(fullPath, dryRun);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error);
  }

  return totalChanges;
}

// ═══════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const targetDir = args.find((arg) => !arg.startsWith("--")) || "./src";

  console.log("═══════════════════════════════════════════════════════");
  console.log("  IMPORT PATH MIGRATION");
  console.log("═══════════════════════════════════════════════════════");
  console.log("");
  console.log(`Mode: ${dryRun ? "DRY RUN (no changes)" : "LIVE (will modify files)"}`);
  console.log(`Target: ${targetDir}`);
  console.log("");
  console.log("Processing files...");
  console.log("");

  const startTime = Date.now();
  const totalChanges = processDirectory(targetDir, dryRun);
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log("");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  MIGRATION COMPLETE`);
  console.log("═══════════════════════════════════════════════════════");
  console.log("");
  console.log(`Total imports migrated: ${totalChanges}`);
  console.log(`Duration: ${duration}s`);
  console.log("");

  if (dryRun) {
    console.log("⚠️  This was a dry run. Run without --dry-run to apply changes.");
  } else {
    console.log("✅ All imports have been migrated!");
    console.log("");
    console.log("Next steps:");
    console.log("  1. pnpm type-check      Verify types");
    console.log("  2. pnpm lint:fix        Fix linting");
    console.log("  3. pnpm build           Test build");
  }
}

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}`;
if (isMainModule) {
  main();
}

export { migrateImports, processDirectory, processFile };
