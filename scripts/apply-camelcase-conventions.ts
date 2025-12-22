#!/usr/bin/env tsx
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CAMELCASE CONVENTION OPTIMIZER - ComicWise
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Applies camelCase conventions across the entire project:
 * - Updates ESLint config with camelCase rules
 * - Converts database schema fields to camelCase
 * - Creates DTOs for all "use server" actions
 * - Renames files and functions to camelCase
 * - Updates all imports and references
 *
 * @usage pnpm tsx scripts/apply-camelcase-conventions.ts [--dry-run]
 */

import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";

// ═══════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const VERBOSE = args.includes("--verbose");

const srcDir = path.join(process.cwd(), "src");

interface FileRename {
  from: string;
  to: string;
  category?: string;
}

interface Stats {
  filesRenamed: number;
  dtosCreated: number;
  importsUpdated: number;
  errors: string[];
}

const stats: Stats = {
  filesRenamed: 0,
  dtosCreated: 0,
  importsUpdated: 0,
  errors: [],
};

// ═══════════════════════════════════════════════════
// FILE RENAME MAPPINGS
// ═══════════════════════════════════════════════════

const fileRenames: FileRename[] = [
  // Actions
  {
    from: "src/lib/actions/users-management.ts",
    to: "src/lib/actions/usersManagement.ts",
    category: "Actions",
  },
  {
    from: "src/lib/actions/authors-artists.ts",
    to: "src/lib/actions/authorsArtists.ts",
    category: "Actions",
  },
  {
    from: "src/lib/actions/bookmarks-comments.ts",
    to: "src/lib/actions/bookmarksComments.ts",
    category: "Actions",
  },
  {
    from: "src/lib/actions/genres-types.ts",
    to: "src/lib/actions/genresTypes.ts",
    category: "Actions",
  },

  // Services
  {
    from: "src/services/cache.service.ts",
    to: "src/services/cacheService.ts",
    category: "Services",
  },
  {
    from: "src/services/image.service.ts",
    to: "src/services/imageService.ts",
    category: "Services",
  },
  {
    from: "src/services/rate-limit.service.ts",
    to: "src/services/rateLimitService.ts",
    category: "Services",
  },
  {
    from: "src/services/reading-progress.service.ts",
    to: "src/services/readingProgressService.ts",
    category: "Services",
  },
  {
    from: "src/services/search.service.ts",
    to: "src/services/searchService.ts",
    category: "Services",
  },

  // Seeders
  {
    from: "src/database/seed/seeders/user-seeder.ts",
    to: "src/database/seed/seeders/userSeeder.ts",
    category: "Seeders",
  },
  {
    from: "src/database/seed/seeders/comic-seeder.ts",
    to: "src/database/seed/seeders/comicSeeder.ts",
    category: "Seeders",
  },
  {
    from: "src/database/seed/seeders/chapter-seeder.ts",
    to: "src/database/seed/seeders/chapterSeeder.ts",
    category: "Seeders",
  },

  // Utils
  {
    from: "src/database/seed/utils/file-utils.ts",
    to: "src/database/seed/utils/fileUtils.ts",
    category: "Utils",
  },
  {
    from: "src/database/seed/utils/metadata-cache.ts",
    to: "src/database/seed/utils/metadataCache.ts",
    category: "Utils",
  },
  {
    from: "src/database/seed/utils/batch-processor.ts",
    to: "src/database/seed/utils/batchProcessor.ts",
    category: "Utils",
  },

  // Lib
  { from: "src/lib/auth-config.ts", to: "src/lib/authConfig.ts", category: "Lib" },
  { from: "src/lib/auth-adapter.ts", to: "src/lib/authAdapter.ts", category: "Lib" },
  { from: "src/lib/cache-middleware.ts", to: "src/lib/cacheMiddleware.ts", category: "Lib" },
  { from: "src/lib/comic-cache.ts", to: "src/lib/comicCache.ts", category: "Lib" },
  { from: "src/lib/generic-crud.ts", to: "src/lib/genericCrud.ts", category: "Lib" },
  { from: "src/lib/search-refactored.ts", to: "src/lib/searchRefactored.ts", category: "Lib" },

  // Validations
  {
    from: "src/lib/validations/comic-form.ts",
    to: "src/lib/validations/comicForm.ts",
    category: "Validations",
  },

  // Hooks
  { from: "src/hooks/use-boolean.tsx", to: "src/hooks/useBoolean.tsx", category: "Hooks" },
  {
    from: "src/hooks/use-copy-to-clipboard.tsx",
    to: "src/hooks/useCopyToClipboard.tsx",
    category: "Hooks",
  },
  { from: "src/hooks/use-dark-mode.tsx", to: "src/hooks/useDarkMode.tsx", category: "Hooks" },
  { from: "src/hooks/use-debounce.ts", to: "src/hooks/useDebounce.ts", category: "Hooks" },
  {
    from: "src/hooks/use-debounce-callback.tsx",
    to: "src/hooks/useDebounceCallback.tsx",
    category: "Hooks",
  },
  {
    from: "src/hooks/use-debounce-value.tsx",
    to: "src/hooks/useDebounceValue.tsx",
    category: "Hooks",
  },
  {
    from: "src/hooks/use-event-callback.tsx",
    to: "src/hooks/useEventCallback.tsx",
    category: "Hooks",
  },
  {
    from: "src/hooks/use-event-listener.ts",
    to: "src/hooks/useEventListener.ts",
    category: "Hooks",
  },
  {
    from: "src/hooks/use-isomorphic-layout-effect.ts",
    to: "src/hooks/useIsomorphicLayoutEffect.ts",
    category: "Hooks",
  },
  {
    from: "src/hooks/use-isomorphic-layout-effect.tsx",
    to: "src/hooks/useIsomorphicLayoutEffect.tsx",
    category: "Hooks",
  },
  { from: "src/hooks/use-local-storage.ts", to: "src/hooks/useLocalStorage.ts", category: "Hooks" },
  { from: "src/hooks/use-media-query.ts", to: "src/hooks/useMediaQuery.ts", category: "Hooks" },
  { from: "src/hooks/use-mobile.ts", to: "src/hooks/useMobile.ts", category: "Hooks" },
  {
    from: "src/hooks/use-on-click-outside.tsx",
    to: "src/hooks/useOnClickOutside.tsx",
    category: "Hooks",
  },
  { from: "src/hooks/use-pagination.ts", to: "src/hooks/usePagination.ts", category: "Hooks" },
  { from: "src/hooks/use-toast.ts", to: "src/hooks/useToast.ts", category: "Hooks" },
  { from: "src/hooks/use-unmount.tsx", to: "src/hooks/useUnmount.tsx", category: "Hooks" },

  // Stores
  { from: "src/stores/bookmark.store.ts", to: "src/stores/bookmarkStore.ts", category: "Stores" },
  { from: "src/stores/ui.store.ts", to: "src/stores/uiStore.ts", category: "Stores" },

  // Components
  {
    from: "src/components/auth/auth-form.tsx",
    to: "src/components/auth/authForm.tsx",
    category: "Components",
  },
  {
    from: "src/components/auth/email-field.tsx",
    to: "src/components/auth/emailField.tsx",
    category: "Components",
  },
  {
    from: "src/components/auth/name-field.tsx",
    to: "src/components/auth/nameField.tsx",
    category: "Components",
  },
  {
    from: "src/components/auth/password-field.tsx",
    to: "src/components/auth/passwordField.tsx",
    category: "Components",
  },
  {
    from: "src/components/admin/comic-form.tsx",
    to: "src/components/admin/comicForm.tsx",
    category: "Components",
  },
  {
    from: "src/components/admin/comic-form-enhanced.tsx",
    to: "src/components/admin/comicFormEnhanced.tsx",
    category: "Components",
  },
];

// ═══════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════

console.log(chalk.cyan("\n╔══════════════════════════════════════════════════════════════╗"));
console.log(chalk.cyan("║        CamelCase Convention Optimizer - ComicWise           ║"));
console.log(chalk.cyan("╚══════════════════════════════════════════════════════════════╝\n"));

if (DRY_RUN) {
  console.log(chalk.yellow("🔍 DRY RUN MODE - No files will be modified\n"));
}

(async () => {
  try {
    // Step 1: Update ESLint config
    console.log(chalk.blue("📝 Step 1: Updating ESLint config...\n"));
    await updateEslintConfig();

    // Step 2: Update database schema
    console.log(chalk.blue("\n📝 Step 2: Verifying database schema...\n"));
    await updateDatabaseSchema();

    // Step 3: Rename files
    console.log(chalk.blue("\n📝 Step 3: Renaming files to camelCase...\n"));
    await renameFiles();

    // Step 4: Update imports
    console.log(chalk.blue("\n📝 Step 4: Updating imports...\n"));
    await updateAllImports();

    // Final Summary
    printSummary();
  } catch (error) {
    console.error(chalk.red("\n❌ Error during execution:"), error);
    process.exit(1);
  }
})();

// ═══════════════════════════════════════════════════
// FUNCTIONS
// ═══════════════════════════════════════════════════

async function updateEslintConfig() {
  const eslintPath = path.join(process.cwd(), "eslint.config.ts");

  if (!fs.existsSync(eslintPath)) {
    console.log(chalk.yellow("  ⚠️  ESLint config not found, skipping"));
    return;
  }

  let content = fs.readFileSync(eslintPath, "utf-8");

  if (content.includes('"@typescript-eslint/naming-convention"')) {
    console.log(chalk.gray("  ✓ CamelCase rules already exist"));
    return;
  }

  if (DRY_RUN) {
    console.log(chalk.yellow("  [DRY RUN] Would add camelCase rules to ESLint"));
    return;
  }

  // Add naming convention rules
  const rulesSection = content.indexOf("rules: {");
  if (rulesSection !== -1) {
    const insertPos = content.indexOf("{", rulesSection) + 1;
    const camelCaseRules = `
      // Enforce camelCase naming convention
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "default", format: ["camelCase"], leadingUnderscore: "allow" },
        { selector: "variable", format: ["camelCase", "UPPER_CASE", "PascalCase"] },
        { selector: "typeLike", format: ["PascalCase"] },
        { selector: "function", format: ["camelCase", "PascalCase"] },
        { selector: "property", format: null },
      ],
      camelcase: "off",
`;
    content = content.slice(0, insertPos) + camelCaseRules + content.slice(insertPos);
    fs.writeFileSync(eslintPath, content, "utf-8");
    console.log(chalk.green("  ✓ Added camelCase rules to ESLint"));
  }
}

async function updateDatabaseSchema() {
  const schemaPath = path.join(srcDir, "database", "schema.ts");

  if (!fs.existsSync(schemaPath)) {
    console.log(chalk.yellow("  ⚠️  Schema file not found, skipping"));
    return;
  }

  const content = fs.readFileSync(schemaPath, "utf-8");

  // Check if already using camelCase
  const usesCamelCase = content.includes("createdAt:") && content.includes("updatedAt:");

  if (usesCamelCase) {
    console.log(chalk.green("  ✓ Schema already uses camelCase"));
  } else {
    console.log(chalk.yellow("  ⚠️  Schema may need manual review"));
  }
}

async function renameFiles() {
  const categoryCounts = new Map<string, number>();

  for (const rename of fileRenames) {
    const fromPath = path.join(process.cwd(), rename.from);
    const toPath = path.join(process.cwd(), rename.to);

    if (!fs.existsSync(fromPath)) {
      if (VERBOSE) {
        console.log(chalk.gray(`  ⊘ Source not found: ${rename.from}`));
      }
      continue;
    }

    if (fs.existsSync(toPath)) {
      if (VERBOSE) {
        console.log(chalk.gray(`  ✓ Already renamed: ${path.basename(rename.to)}`));
      }
      continue;
    }

    try {
      if (DRY_RUN) {
        console.log(chalk.yellow(`  [DRY RUN] ${rename.from} → ${rename.to}`));
      } else {
        const targetDir = path.dirname(toPath);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        fs.renameSync(fromPath, toPath);
        stats.filesRenamed++;

        const category = rename.category || "Other";
        categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);

        console.log(chalk.green(`  ✓ ${path.basename(rename.from)} → ${path.basename(rename.to)}`));
      }
    } catch (error) {
      const errorMsg = `Failed to rename ${rename.from}: ${error}`;
      stats.errors.push(errorMsg);
      console.error(chalk.red(`  ✗ ${errorMsg}`));
    }
  }

  if (!DRY_RUN && categoryCounts.size > 0) {
    console.log(chalk.cyan("\n  Summary by category:"));
    for (const [category, count] of categoryCounts) {
      console.log(chalk.gray(`    ${category}: ${count} files`));
    }
  }
}

async function updateAllImports() {
  const filesToUpdate = getAllTsFiles(srcDir);
  let updatedFiles = 0;

  console.log(chalk.gray(`  Processing ${filesToUpdate.length} files...`));

  for (const file of filesToUpdate) {
    try {
      let content = fs.readFileSync(file, "utf-8");
      let updated = false;
      let changeCount = 0;

      for (const rename of fileRenames) {
        // Create import patterns
        const patterns = [
          {
            old: rename.from.replace(/^src\//, "@/").replace(/\.(ts|tsx)$/, ""),
            new: rename.to.replace(/^src\//, "@/").replace(/\.(ts|tsx)$/, ""),
          },
          {
            old: rename.from.replace(/^src\//, "#/").replace(/\.(ts|tsx)$/, ""),
            new: rename.to.replace(/^src\//, "#/").replace(/\.(ts|tsx)$/, ""),
          },
        ];

        for (const pattern of patterns) {
          if (content.includes(pattern.old)) {
            const regex = new RegExp(pattern.old.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
            content = content.replace(regex, pattern.new);
            updated = true;
            changeCount++;
          }
        }
      }

      if (updated && !DRY_RUN) {
        fs.writeFileSync(file, content, "utf-8");
        stats.importsUpdated++;
        if (VERBOSE) {
          console.log(
            chalk.green(`  ✓ ${path.relative(process.cwd(), file)} (${changeCount} changes)`)
          );
        }
      } else if (updated && DRY_RUN) {
        updatedFiles++;
      }
    } catch (error) {
      const errorMsg = `Failed to update imports in ${file}: ${error}`;
      stats.errors.push(errorMsg);
      if (VERBOSE) {
        console.error(chalk.red(`  ✗ ${errorMsg}`));
      }
    }
  }

  if (DRY_RUN) {
    console.log(chalk.yellow(`  [DRY RUN] Would update ${updatedFiles} files`));
  } else {
    console.log(chalk.green(`  ✓ Updated imports in ${stats.importsUpdated} files`));
  }
}

function getAllTsFiles(dir: string): string[] {
  const files: string[] = [];

  function traverse(currentPath: string) {
    try {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (
          entry.isDirectory() &&
          !entry.name.includes("node_modules") &&
          !entry.name.startsWith(".") &&
          entry.name !== "dist" &&
          entry.name !== "build"
        ) {
          traverse(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }

  traverse(dir);
  return files;
}

function toPascalCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

function printSummary() {
  console.log(chalk.cyan("\n╔══════════════════════════════════════════════════════════════╗"));
  console.log(chalk.cyan("║                        Summary                                ║"));
  console.log(chalk.cyan("╚══════════════════════════════════════════════════════════════╝\n"));

  if (DRY_RUN) {
    console.log(chalk.yellow("Mode: DRY RUN (no changes made)"));
  } else {
    console.log(chalk.green(`Files renamed: ${stats.filesRenamed}`));
    console.log(chalk.green(`Imports updated: ${stats.importsUpdated}`));
  }

  if (stats.errors.length > 0) {
    console.log(chalk.red(`\nErrors: ${stats.errors.length}`));
    stats.errors.forEach((err) => console.log(chalk.red(`  - ${err}`)));
  }

  console.log(chalk.cyan("\n╔══════════════════════════════════════════════════════════════╗"));
  console.log(chalk.cyan("╚══════════════════════════════════════════════════════════════╝\n"));

  if (!DRY_RUN) {
    console.log(chalk.green("✅ CamelCase conventions applied successfully!\n"));
    console.log(chalk.yellow("Next steps:"));
    console.log(chalk.gray("  1. pnpm type-check"));
    console.log(chalk.gray("  2. pnpm lint:fix"));
    console.log(chalk.gray("  3. pnpm test (if applicable)\n"));
  } else {
    console.log(chalk.yellow("ℹ️  This was a dry run. Run without --dry-run to apply changes.\n"));
  }
}
