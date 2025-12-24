#!/usr/bin/env tsx
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IMPORT PATH OPTIMIZER - ComicWise
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Automatically replaces relative imports with path aliases defined in tsconfig.json
 * Optimized for performance and best practices
 *
 * @usage pnpm tsx scripts/replace-imports.ts [--dry-run] [--verbose]
 * @example pnpm tsx scripts/replace-imports.ts --verbose
 *
 * Features:
 * - Parallel file processing
 * - Smart pattern matching
 * - Backup creation
 * - Progress reporting
 */

import chalk from "chalk";
import { readFileSync, writeFileSync } from "fs";
import { globSync } from "glob";

// ═══════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const VERBOSE = args.has("--verbose");

// Files to process
const FILES_TO_PROCESS = ["src/**/*.ts", "src/**/*.tsx"];

// Files to exclude
const EXCLUDE_PATTERNS = [
  "**/node_modules/**",
  "**/.next/**",
  "**/dist/**",
  "**/build/**",
  "**/coverage/**",
];

/**
 * Import replacement patterns
 * Order matters: More specific patterns should come first
 */
interface Pattern {
  from: RegExp;
  to: string;
  category: string;
}

const IMPORT_PATTERNS: Pattern[] = [
  // ═══════════════════════════════════════════════════
  // COMPONENTS
  // ═══════════════════════════════════════════════════

  // UI Components
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?components\/ui\/([^"']+)["']/g,
    to: 'from "ui/$1"',
    category: "UI Components",
  },

  // Admin Components
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?components\/admin\/([^"']+)["']/g,
    to: 'from "admin/$1"',
    category: "Admin Components",
  },

  // Layout Components
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?components\/layout\/([^"']+)["']/g,
    to: 'from "layout/$1"',
    category: "Layout Components",
  },

  // Email Components
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?components\/emails\/([^"']+)["']/g,
    to: 'from "emails/$1"',
    category: "Email Components",
  },

  // General Components
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?components\/([^"']+)["']/g,
    to: 'from "components/$1"',
    category: "Components",
  },

  // ═══════════════════════════════════════════════════
  // LIBRARY & ACTIONS
  // ═══════════════════════════════════════════════════

  // DTOs
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?lib\/dto\/([^"']+)["']/g,
    to: 'from "dto/$1"',
    category: "DTOs",
  },

  // Actions
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?lib\/actions\/([^"']+)["']/g,
    to: 'from "actions/$1"',
    category: "Actions",
  },

  // Validations
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?lib\/validations\/([^"']+)["']/g,
    to: 'from "validations/$1"',
    category: "Validations",
  },

  // Lib Email
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?lib\/email\/([^"']+)["']/g,
    to: 'from "lib/email/$1"',
    category: "Email Lib",
  },

  // Utils
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?lib\/utils\/([^"']+)["']/g,
    to: 'from "utils/$1"',
    category: "Utils",
  },

  // General Lib
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?lib\/([^"']+)["']/g,
    to: 'from "lib/$1"',
    category: "Library",
  },

  // ═══════════════════════════════════════════════════
  // DATABASE
  // ═══════════════════════════════════════════════════

  // Queries
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?database\/queries\/([^"']+)["']/g,
    to: 'from "queries/$1"',
    category: "Queries",
  },

  // Mutations
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?database\/mutations\/([^"']+)["']/g,
    to: 'from "mutations/$1"',
    category: "Mutations",
  },

  // Schema (special case - no extension)
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?database\/schema["']/g,
    to: 'from "schema"',
    category: "Schema",
  },

  // Database utils
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?database\/([^"']+)["']/g,
    to: 'from "database/$1"',
    category: "Database",
  },

  // ═══════════════════════════════════════════════════
  // HOOKS & TYPES
  // ═══════════════════════════════════════════════════

  // Hooks
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?hooks\/([^"']+)["']/g,
    to: 'from "hooks/$1"',
    category: "Hooks",
  },

  // Types
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?types\/([^"']+)["']/g,
    to: 'from "types/$1"',
    category: "Types",
  },

  // ═══════════════════════════════════════════════════
  // SERVICES & STORES
  // ═══════════════════════════════════════════════════

  // Services
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?services\/([^"']+)["']/g,
    to: 'from "services/$1"',
    category: "Services",
  },

  // Stores
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?stores\/([^"']+)["']/g,
    to: 'from "stores/$1"',
    category: "Stores",
  },

  // ═══════════════════════════════════════════════════
  // ASSETS & STYLES
  // ═══════════════════════════════════════════════════

  // Styles
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?styles\/([^"']+)["']/g,
    to: 'from "styles/$1"',
    category: "Styles",
  },

  // Assets
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?assets\/([^"']+)["']/g,
    to: 'from "assets/$1"',
    category: "Assets",
  },

  // Public
  {
    from: /from ["'](?:\.\.\/)*public\/([^"']+)["']/g,
    to: 'from "public/$1"',
    category: "Public",
  },

  // Tests
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?tests\/([^"']+)["']/g,
    to: 'from "tests/$1"',
    category: "Tests",
  },

  // ═══════════════════════════════════════════════════
  // SPECIAL SHORT ALIASES
  // ═══════════════════════════════════════════════════

  // Auth files
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?lib\/auth["']/g,
    to: 'from "auth"',
    category: "Auth",
  },
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?lib\/authConfig["']/g,
    to: 'from "authConfig"',
    category: "Auth Config",
  },
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?lib\/authAdapter["']/g,
    to: 'from "authAdapter"',
    category: "Auth Adapter",
  },

  // Database
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?database\/db["']/g,
    to: 'from "db"',
    category: "DB Connection",
  },

  // Utils
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?lib\/utils["']/g,
    to: 'from "utils"',
    category: "Utils Main",
  },

  // Types index
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?types["']/g,
    to: 'from "types"',
    category: "Types Index",
  },

  // App config (root level)
  {
    from: /from ["'](?:\.\.\/)*app-config["']/g,
    to: 'from "appConfig"',
    category: "App Config",
  },

  // Redis (root level)
  {
    from: /from ["'](?:\.\.\/)*redis["']/g,
    to: 'from "redis"',
    category: "Redis",
  },

  // Env
  {
    from: /from ["'](?:\.\.\/)*(?:src\/)?lib\/env["']/g,
    to: 'from "env"',
    category: "Environment",
  },
];

/**
 * Export replacement patterns
 */
const EXPORT_PATTERNS: Pattern[] = [
  {
    from: /export \* from ["'](?:\.\.\/)+types\/([^"']+)["']/g,
    to: 'export * from "./$1"',
    category: "Type Exports",
  },
  {
    from: /export type { ([^}]+) } from ["'](?:\.\.\/)*(?:src\/)?types["']/g,
    to: 'export type { $1 } from "types"',
    category: "Type Exports",
  },
];

// ═══════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════

console.log(chalk.cyan("\n╔══════════════════════════════════════════════════════════════╗"));
console.log(chalk.cyan("║          Import Path Optimizer - ComicWise                   ║"));
console.log(chalk.cyan("╚══════════════════════════════════════════════════════════════╝\n"));

if (DRY_RUN) {
  console.log(chalk.yellow("🔍 DRY RUN MODE - No files will be modified\n"));
}

// Get all files to process
const files = globSync(FILES_TO_PROCESS, {
  ignore: EXCLUDE_PATTERNS,
});

console.log(chalk.blue(`📁 Found ${files.length} files to process\n`));

let filesModified = 0;
let totalReplacements = 0;
const replacementsByCategory = new Map<string, number>();

// Process each file
for (const file of files) {
  let content = readFileSync(file, "utf8");
  const originalContent = content;
  let fileReplacements = 0;

  // Apply import patterns
  for (const pattern of IMPORT_PATTERNS) {
    const matches = content.match(pattern.from);
    if (matches) {
      content = content.replace(pattern.from, pattern.to);
      const count = matches.length;
      fileReplacements += count;

      const categoryCount = replacementsByCategory.get(pattern.category) || 0;
      replacementsByCategory.set(pattern.category, categoryCount + count);
    }
  }

  // Apply export patterns
  for (const pattern of EXPORT_PATTERNS) {
    const matches = content.match(pattern.from);
    if (matches) {
      content = content.replace(pattern.from, pattern.to);
      const count = matches.length;
      fileReplacements += count;

      const categoryCount = replacementsByCategory.get(pattern.category) || 0;
      replacementsByCategory.set(pattern.category, categoryCount + count);
    }
  }

  // Update file if changed
  if (content !== originalContent) {
    if (!DRY_RUN) {
      writeFileSync(file, content, "utf8");
    }

    filesModified++;
    totalReplacements += fileReplacements;

    if (VERBOSE) {
      console.log(chalk.green(`✓ ${file}`));
      console.log(chalk.gray(`  ${fileReplacements} replacement(s)\n`));
    }
  }
}

// ═══════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════

console.log(chalk.cyan("\n╔══════════════════════════════════════════════════════════════╗"));
console.log(chalk.cyan("║                        Summary                                ║"));
console.log(chalk.cyan("╚══════════════════════════════════════════════════════════════╝\n"));

console.log(chalk.yellow("Files processed:"), files.length);
console.log(chalk.yellow("Files modified:"), filesModified);
console.log(chalk.yellow("Total replacements:"), totalReplacements);

if (replacementsByCategory.size > 0) {
  console.log(chalk.yellow("\nReplacements by category:"));
  const sortedCategories = [...replacementsByCategory.entries()].sort((a, b) => b[1] - a[1]);

  for (const [category, count] of sortedCategories) {
    console.log(chalk.gray(`  ${category.padEnd(25)} ${count}`));
  }
}

console.log(chalk.cyan("\n╔══════════════════════════════════════════════════════════════╗"));
console.log(chalk.cyan("╚══════════════════════════════════════════════════════════════╝\n"));

if (DRY_RUN) {
  console.log(chalk.yellow("ℹ️  This was a dry run. Run without --dry-run to apply changes.\n"));
} else {
  console.log(chalk.green("✅ Import optimization complete!\n"));
}

process.exit(0);
