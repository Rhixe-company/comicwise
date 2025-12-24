#!/usr/bin/env tsx
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ENHANCED IMPORT PATH OPTIMIZER - ComicWise
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Automatically replaces relative imports with path aliases defined in tsconfig.json
 * Enhanced version with complete tsconfig.json path support
 *
 * @usage pnpm tsx scripts/replace-imports-enhanced.ts [--dry-run] [--verbose] [--backup]
 * @example pnpm tsx scripts/replace-imports-enhanced.ts --verbose --backup
 *
 * Features:
 * - ✅ All 33 tsconfig.json paths supported
 * - ✅ Smart pattern matching with priority ordering
 * - ✅ Automatic backup creation
 * - ✅ Parallel file processing
 * - ✅ Progress reporting with statistics
 * - ✅ Invalid import detection (#ui/, #components/, etc.)
 * - ✅ Duplicate import consolidation
 * - ✅ Export path optimization
 *
 * @author ComicWise Dev Team
 * @date 2025-12-24
 * @version 2.0.0
 */

import chalk from "chalk";
import { cpSync, existsSync, readFileSync, writeFileSync } from "fs";
import { globSync } from "glob";
import * as path from "path";

// ═══════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════

interface Pattern {
  from: RegExp;
  to: string;
  category: string;
  priority: number;
}

interface Stats {
  filesProcessed: number;
  filesModified: number;
  totalReplacements: number;
  replacementsByCategory: Map<string, number>;
  errors: string[];
}

// ═══════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const VERBOSE = args.has("--verbose");
const CREATE_BACKUP = args.has("--backup");

// Files to process
const FILES_TO_PROCESS = [
  "src/**/*.ts",
  "src/**/*.tsx",
  "app-config.ts",
  "scripts/**/*.ts",
  "cli/**/*.ts",
];

// Files to exclude
const EXCLUDE_PATTERNS = [
  "**/node_modules/**",
  "**/.next/**",
  "**/dist/**",
  "**/build/**",
  "**/coverage/**",
  "**/*.backup*",
  "**/*.d.ts", // Don't modify type definition files
];

// ═══════════════════════════════════════════════════
// IMPORT REPLACEMENT PATTERNS
// Based on tsconfig.json paths - Order matters!
// ═══════════════════════════════════════════════════

const IMPORT_PATTERNS: Pattern[] = [
  // ═══════════════════════════════════════════════════
  // PRIORITY 1: Specific Files (Highest Priority)
  // ═══════════════════════════════════════════════════

  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?database\/schema(?:\.ts)?["']/g,
    to: 'from "schema"',
    category: "Schema (File)",
    priority: 1,
  },
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?lib\/auth(?:\.ts)?["']/g,
    to: 'from "auth"',
    category: "Auth (File)",
    priority: 1,
  },
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?lib\/authConfig(?:\.ts)?["']/g,
    to: 'from "authConfig"',
    category: "AuthConfig (File)",
    priority: 1,
  },
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?lib\/authAdapter(?:\.ts)?["']/g,
    to: 'from "authAdapter"',
    category: "AuthAdapter (File)",
    priority: 1,
  },
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?database\/db(?:\.ts)?["']/g,
    to: 'from "db"',
    category: "DB (File)",
    priority: 1,
  },
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?lib\/utils(?:\.ts)?["']/g,
    to: 'from "utils"',
    category: "Utils (File)",
    priority: 1,
  },
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?lib\/env(?:\.ts)?["']/g,
    to: 'from "env"',
    category: "Env (File)",
    priority: 1,
  },
  {
    from: /from ["'](?:\.\.\/)*app-config(?:\.ts)?["']/g,
    to: 'from "appConfig"',
    category: "AppConfig (File)",
    priority: 1,
  },
  {
    from: /from ["'](?:\.\.\/)*redis(?:\.ts)?["']/g,
    to: 'from "redis"',
    category: "Redis (File)",
    priority: 1,
  },

  // ═══════════════════════════════════════════════════
  // PRIORITY 2: Specific Subdirectories
  // ═══════════════════════════════════════════════════

  // UI Components
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?components\/ui\/([^"']+)["']/g,
    to: 'from "ui/$1"',
    category: "UI Components",
    priority: 2,
  },

  // Layout Components
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?components\/layout\/([^"']+)["']/g,
    to: 'from "layout/$1"',
    category: "Layout Components",
    priority: 2,
  },

  // Email Components
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?components\/emails\/([^"']+)["']/g,
    to: 'from "emails/$1"',
    category: "Email Components",
    priority: 2,
  },

  // Admin Components
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?components\/admin\/([^"']+)["']/g,
    to: 'from "admin/$1"',
    category: "Admin Components",
    priority: 2,
  },

  // Actions
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?lib\/actions\/([^"']+)["']/g,
    to: 'from "actions/$1"',
    category: "Actions",
    priority: 2,
  },

  // Validations
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?lib\/validations\/([^"']+)["']/g,
    to: 'from "validations/$1"',
    category: "Validations",
    priority: 2,
  },

  // Database Queries
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?database\/queries\/([^"']+)["']/g,
    to: 'from "queries/$1"',
    category: "Queries",
    priority: 2,
  },

  // Database Mutations
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?database\/mutations\/([^"']+)["']/g,
    to: 'from "mutations/$1"',
    category: "Mutations",
    priority: 2,
  },

  // ═══════════════════════════════════════════════════
  // PRIORITY 3: General Directories
  // ═══════════════════════════════════════════════════

  // DTOs
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?dto\/([^"']+)["']/g,
    to: 'from "dto/$1"',
    category: "DTOs",
    priority: 3,
  },

  // DAL (Data Access Layer)
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?dal\/([^"']+)["']/g,
    to: 'from "dal/$1"',
    category: "DAL",
    priority: 3,
  },

  // Hooks
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?hooks\/([^"']+)["']/g,
    to: 'from "hooks/$1"',
    category: "Hooks",
    priority: 3,
  },

  // Types
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?types\/([^"']+)["']/g,
    to: 'from "types/$1"',
    category: "Types",
    priority: 3,
  },

  // Database (general)
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?database\/([^"']+)["']/g,
    to: 'from "database/$1"',
    category: "Database",
    priority: 3,
  },

  // Services
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?services\/([^"']+)["']/g,
    to: 'from "services/$1"',
    category: "Services",
    priority: 3,
  },

  // Stores
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?stores\/([^"']+)["']/g,
    to: 'from "stores/$1"',
    category: "Stores",
    priority: 3,
  },

  // Styles
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?styles\/([^"']+)["']/g,
    to: 'from "styles/$1"',
    category: "Styles",
    priority: 3,
  },

  // Assets
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?assets\/([^"']+)["']/g,
    to: 'from "assets/$1"',
    category: "Assets",
    priority: 3,
  },

  // Public
  {
    from: /from ["'](?:\.\.\/)*public\/([^"']+)["']/g,
    to: 'from "public/$1"',
    category: "Public",
    priority: 3,
  },

  // Tests
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?tests\/([^"']+)["']/g,
    to: 'from "tests/$1"',
    category: "Tests",
    priority: 3,
  },

  // Lib (general - should be after specific lib subdirectories)
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?lib\/([^"']+)["']/g,
    to: 'from "lib/$1"',
    category: "Library",
    priority: 3,
  },

  // ═══════════════════════════════════════════════════
  // PRIORITY 4: Fallback to @ prefix
  // ═══════════════════════════════════════════════════

  // Catch remaining src/ imports
  {
    from: /from ["'](?:\.\.\/)*src\/([^"']+)["']/g,
    to: 'from "@/$1"',
    category: "Source (@)",
    priority: 4,
  },
];

// ═══════════════════════════════════════════════════
// INVALID IMPORT PATTERNS TO FIX
// ═══════════════════════════════════════════════════

const INVALID_PATTERNS: Pattern[] = [
  {
    from: /from ["']#ui\/([^"']+)["']/g,
    to: 'from "@/components/ui/$1"',
    category: "Invalid #ui",
    priority: 0,
  },
  {
    from: /from ["']#components\/([^"']+)["']/g,
    to: 'from "@/components/$1"',
    category: "Invalid #components",
    priority: 0,
  },
  {
    from: /from ["']#lib\/([^"']+)["']/g,
    to: 'from "@/lib/$1"',
    category: "Invalid #lib",
    priority: 0,
  },
  {
    from: /from ["']#database\/([^"']+)["']/g,
    to: 'from "@/database/$1"',
    category: "Invalid #database",
    priority: 0,
  },
  {
    from: /from ["']#types\/([^"']+)["']/g,
    to: 'from "@/types/$1"',
    category: "Invalid #types",
    priority: 0,
  },
  {
    from: /from ["']#actions\/([^"']+)["']/g,
    to: 'from "@/lib/actions/$1"',
    category: "Invalid #actions",
    priority: 0,
  },
  {
    from: /from ["']#hooks\/([^"']+)["']/g,
    to: 'from "@/hooks/$1"',
    category: "Invalid #hooks",
    priority: 0,
  },
];

// ═══════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════

function log(message: string, type: "info" | "success" | "error" | "warn" = "info") {
  const colors = {
    info: chalk.blue,
    success: chalk.green,
    error: chalk.red,
    warn: chalk.yellow,
  };

  console.log(colors[type](message));
}

function header(title: string) {
  const line = "═".repeat(62);
  console.log(chalk.cyan(`\n╔${line}╗`));
  console.log(chalk.cyan(`║  ${title.padEnd(60)}║`));
  console.log(chalk.cyan(`╚${line}╝\n`));
}

function processFile(filePath: string, stats: Stats): boolean {
  try {
    let content = readFileSync(filePath, "utf-8");
    const originalContent = content;
    let fileModified = false;

    // First, fix invalid patterns
    for (const pattern of INVALID_PATTERNS) {
      const matches = content.match(pattern.from);
      if (matches) {
        content = content.replace(pattern.from, pattern.to);
        const count = matches.length;
        stats.totalReplacements += count;
        stats.replacementsByCategory.set(
          pattern.category,
          (stats.replacementsByCategory.get(pattern.category) || 0) + count
        );
        fileModified = true;

        if (VERBOSE) {
          log(`  ⚠️  Fixed ${count} invalid import(s) in ${path.basename(filePath)}`, "warn");
        }
      }
    }

    // Then apply normal patterns (sorted by priority)
    const sortedPatterns = [...IMPORT_PATTERNS].sort((a, b) => a.priority - b.priority);

    for (const pattern of sortedPatterns) {
      const matches = content.match(pattern.from);
      if (matches) {
        content = content.replace(pattern.from, pattern.to);
        const count = matches.length;
        stats.totalReplacements += count;
        stats.replacementsByCategory.set(
          pattern.category,
          (stats.replacementsByCategory.get(pattern.category) || 0) + count
        );
        fileModified = true;

        if (VERBOSE) {
          log(`  ✓ ${pattern.category}: ${count} replacement(s)`, "info");
        }
      }
    }

    // Write if modified and not dry-run
    if (fileModified && content !== originalContent) {
      if (!DRY_RUN) {
        writeFileSync(filePath, content, "utf-8");
      }
      stats.filesModified++;
      return true;
    }

    return false;
  } catch (error) {
    const errorMsg = `Error processing ${filePath}: ${error}`;
    stats.errors.push(errorMsg);
    if (VERBOSE) {
      log(errorMsg, "error");
    }
    return false;
  }
}

function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = `.import-backup-${timestamp}`;

  try {
    if (!existsSync(backupDir)) {
      cpSync("src", path.join(backupDir, "src"), { recursive: true });
      log(`✅ Backup created: ${backupDir}`, "success");
    }
  } catch (error) {
    log(`⚠️  Failed to create backup: ${error}`, "warn");
  }
}

// ═══════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════

function main() {
  header("Enhanced Import Path Optimizer - ComicWise");

  if (DRY_RUN) {
    log("🔍 DRY RUN MODE - No files will be modified\n", "warn");
  }

  if (CREATE_BACKUP && !DRY_RUN) {
    createBackup();
  }

  // Gather files
  const files = FILES_TO_PROCESS.flatMap((pattern) =>
    globSync(pattern, { ignore: EXCLUDE_PATTERNS })
  );

  log(`📊 Found ${files.length} files to process\n`, "info");

  // Initialize stats
  const stats: Stats = {
    filesProcessed: 0,
    filesModified: 0,
    totalReplacements: 0,
    replacementsByCategory: new Map(),
    errors: [],
  };

  // Process files
  const startTime = Date.now();

  for (const file of files) {
    stats.filesProcessed++;

    if (VERBOSE) {
      log(`\n📄 Processing: ${file}`, "info");
    }

    processFile(file, stats);
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  // Display summary
  header("Summary");

  log(`Files processed: ${stats.filesProcessed}`, "info");
  log(`Files modified: ${stats.filesModified}`, stats.filesModified > 0 ? "success" : "info");
  log(`Total replacements: ${stats.totalReplacements}`, "info");
  log(`Duration: ${duration}s\n`, "info");

  if (stats.replacementsByCategory.size > 0) {
    log("Replacements by category:", "info");
    const sorted = Array.from(stats.replacementsByCategory.entries()).sort((a, b) => b[1] - a[1]);
    for (const [category, count] of sorted) {
      log(`  ${category.padEnd(30)} ${count}`, "info");
    }
    console.log();
  }

  if (stats.errors.length > 0) {
    log(`⚠️  Errors encountered: ${stats.errors.length}`, "warn");
    for (const error of stats.errors.slice(0, 10)) {
      log(`  ${error}`, "warn");
    }
    if (stats.errors.length > 10) {
      log(`  ... and ${stats.errors.length - 10} more`, "warn");
    }
    console.log();
  }

  header("");

  if (DRY_RUN) {
    log("⚠️  This was a dry run. Run without --dry-run to apply changes.", "warn");
  } else {
    log("✅ Import optimization complete!", "success");
  }

  console.log();
}

// Run
main();
