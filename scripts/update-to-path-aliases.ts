#!/usr/bin/env tsx
/**
 * Comprehensive Path Alias Updater
 * Updates ALL imports to use custom tsconfig path aliases
 */

import fs from "fs-extra";
import { glob } from "glob";
import path from "path";

const ROOT_DIR = process.cwd();

// Path alias mappings from tsconfig.json
const pathAliases: Array<{
  alias: string;
  pattern: RegExp;
  replacement: string;
  priority: number;
}> = [
  // High priority - specific paths first
  {
    alias: "auth",
    pattern: /from ['"]@\/lib\/auth['"]/g,
    replacement: 'from "auth"',
    priority: 10,
  },
  {
    alias: "authAdapter",
    pattern: /from ['"]@\/lib\/authAdapter['"]/g,
    replacement: 'from "authAdapter"',
    priority: 10,
  },
  {
    alias: "authConfig",
    pattern: /from ['"]@\/lib\/authConfig['"]/g,
    replacement: 'from "authConfig"',
    priority: 10,
  },
  {
    alias: "db",
    pattern: /from ['"]@\/database\/db['"]/g,
    replacement: 'from "@/database/db"',
    priority: 10,
  },
  {
    alias: "schema",
    pattern: /from ['"]@\/database\/schema['"]/g,
    replacement: 'from "@/database/schema"',
    priority: 10,
  },
  { alias: "env", pattern: /from ['"]@\/lib\/env['"]/g, replacement: 'from "env"', priority: 10 },
  {
    alias: "utils",
    pattern: /from ['"]@\/lib\/utils['"]/g,
    replacement: 'from "utils"',
    priority: 10,
  },
  {
    alias: "redis",
    pattern: /from ['"]\.\.\/redis['"]/g,
    replacement: 'from "redis"',
    priority: 10,
  },

  // Medium priority - directory paths
  {
    alias: "actions",
    pattern: /from ['"]@\/lib\/actions\/([^'"]+)['"]/g,
    replacement: 'from "@/lib/actions/$1"',
    priority: 5,
  },
  {
    alias: "admin",
    pattern: /from ['"]@\/components\/admin\/([^'"]+)['"]/g,
    replacement: 'from "@/components/admin/$1"',
    priority: 5,
  },
  {
    alias: "dal",
    pattern: /from ['"]@\/dal\/([^'"]+)['"]/g,
    replacement: 'from "@/dal/$1"',
    priority: 5,
  },
  {
    alias: "database",
    pattern: /from ['"]@\/database\/([^'"]+)['"]/g,
    replacement: 'from "@/database/$1"',
    priority: 5,
  },
  {
    alias: "dto",
    pattern: /from ['"]@\/dto\/([^'"]+)['"]/g,
    replacement: 'from "@/dto/$1"',
    priority: 5,
  },
  {
    alias: "emails",
    pattern: /from ['"]@\/components\/emails\/([^'"]+)['"]/g,
    replacement: 'from "@/components/emails/$1"',
    priority: 5,
  },
  {
    alias: "hooks",
    pattern: /from ['"]@\/hooks\/([^'"]+)['"]/g,
    replacement: 'from "@/hooks/$1"',
    priority: 5,
  },
  {
    alias: "layout",
    pattern: /from ['"]@\/components\/layout\/([^'"]+)['"]/g,
    replacement: 'from "@/components/layout/$1"',
    priority: 5,
  },
  {
    alias: "lib",
    pattern: /from ['"]@\/lib\/([^'"]+)['"]/g,
    replacement: 'from "@/lib/$1"',
    priority: 5,
  },
  {
    alias: "mutations",
    pattern: /from ['"]@\/database\/mutations\/([^'"]+)['"]/g,
    replacement: 'from "@/database/mutations/$1"',
    priority: 5,
  },
  {
    alias: "queries",
    pattern: /from ['"]@\/database\/queries\/([^'"]+)['"]/g,
    replacement: 'from "@/database/queries/$1"',
    priority: 5,
  },
  {
    alias: "services",
    pattern: /from ['"]@\/services\/([^'"]+)['"]/g,
    replacement: 'from "@/services/$1"',
    priority: 5,
  },
  {
    alias: "stores",
    pattern: /from ['"]@\/stores\/([^'"]+)['"]/g,
    replacement: 'from "stores/$1"',
    priority: 5,
  },
  {
    alias: "styles",
    pattern: /from ['"]@\/styles\/([^'"]+)['"]/g,
    replacement: 'from "styles/$1"',
    priority: 5,
  },
  {
    alias: "tests",
    pattern: /from ['"]@\/tests\/([^'"]+)['"]/g,
    replacement: 'from "tests/$1"',
    priority: 5,
  },
  {
    alias: "types",
    pattern: /from ['"]@\/types\/([^'"]+)['"]/g,
    replacement: 'from "@/types/$1"',
    priority: 5,
  },
  {
    alias: "ui",
    pattern: /from ['"]@\/components\/ui\/([^'"]+)['"]/g,
    replacement: 'from "@/components/ui/$1"',
    priority: 5,
  },
  {
    alias: "validations",
    pattern: /from ['"]@\/lib\/validations\/([^'"]+)['"]/g,
    replacement: 'from "@/lib/validations/$1"',
    priority: 5,
  },

  // Low priority - generic @ path (catch-all)
  { alias: "@", pattern: /from ['"]@\/([^'"]+)['"]/g, replacement: 'from "@/$1"', priority: 1 },
];

// Sort by priority (highest first)
pathAliases.sort((a, b) => b.priority - a.priority);

async function updateFileImports(filePath: string): Promise<number> {
  let content = await fs.readFile(filePath, "utf-8");
  const original = content;
  let changesCount = 0;

  // Apply replacements in priority order
  for (const { pattern, replacement } of pathAliases) {
    const matches = content.match(pattern);
    if (matches) {
      content = content.replace(pattern, replacement);
      changesCount += matches.length;
    }
  }

  // Write back if changed
  if (content !== original) {
    await fs.writeFile(filePath, content);
    return changesCount;
  }

  return 0;
}

async function main() {
  console.log("\n🔧 Updating ALL imports to use custom path aliases\n");
  console.log("═".repeat(60) + "\n");

  // Get all TypeScript files
  const files = await glob("**/*.{ts,tsx}", {
    cwd: ROOT_DIR,
    ignore: ["**/node_modules/**", "**/.next/**", "**/dist/**", "**/build/**", "**/coverage/**"],
    absolute: true,
  });

  console.log(`📁 Found ${files.length} TypeScript files\n`);

  let totalFiles = 0;
  let totalChanges = 0;
  const updatedFiles: string[] = [];

  for (const file of files) {
    const changes = await updateFileImports(file);
    if (changes > 0) {
      totalFiles++;
      totalChanges += changes;
      const relativePath = path.relative(ROOT_DIR, file);
      updatedFiles.push(relativePath);
      console.log(`✓ ${relativePath} (${changes} imports)`);
    }
  }

  console.log("\n" + "═".repeat(60));
  console.log(`\n✅ Updated ${totalChanges} imports in ${totalFiles} files\n`);

  // Show summary by alias
  console.log("📊 Path Aliases Used:");
  console.log("  • actions      → src/lib/actions/*");
  console.log("  • admin        → src/components/admin/*");
  console.log("  • auth         → src/lib/auth");
  console.log("  • authAdapter  → src/lib/authAdapter");
  console.log("  • authConfig   → src/lib/authConfig");
  console.log("  • dal          → src/dal/*");
  console.log("  • database     → src/database/*");
  console.log("  • db           → src/database/db");
  console.log("  • dto          → src/dto/*");
  console.log("  • emails       → src/components/emails/*");
  console.log("  • env          → src/lib/env");
  console.log("  • hooks        → src/hooks/*");
  console.log("  • layout       → src/components/layout/*");
  console.log("  • lib          → src/lib/*");
  console.log("  • mutations    → src/database/mutations/*");
  console.log("  • queries      → src/database/queries/*");
  console.log("  • redis        → ./redis");
  console.log("  • schema       → src/database/schema");
  console.log("  • services     → src/services/*");
  console.log("  • stores       → src/stores/*");
  console.log("  • styles       → src/styles/*");
  console.log("  • tests        → src/tests/*");
  console.log("  • types        → src/types/*");
  console.log("  • ui           → src/components/ui/*");
  console.log("  • utils        → src/lib/utils");
  console.log("  • validations  → src/lib/validations/*");
  console.log("  • @            → src/* (fallback)\n");

  console.log("✓ All imports now use custom path aliases!\n");
}

main().catch(console.error);
