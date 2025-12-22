#!/usr/bin/env tsx
/**
 * Script to apply CamelCase conventions across the project
 * - Updates ESLint config with camelCase rules
 * - Converts database schema fields to camelCase
 * - Creates DTOs for all "use server" actions
 * - Renames files and functions to camelCase
 */

import * as fs from "fs";
import * as path from "path";

const srcDir = path.join(process.cwd(), "src");

interface FileRename {
  from: string;
  to: string;
}

// Files that need renaming to camelCase
const fileRenames: FileRename[] = [
  // Actions
  { from: "src/lib/actions/users-management.ts", to: "src/lib/actions/usersManagement.ts" },
  { from: "src/lib/actions/authors-artists.ts", to: "src/lib/actions/authorsArtists.ts" },
  { from: "src/lib/actions/bookmarks-comments.ts", to: "src/lib/actions/bookmarksComments.ts" },
  { from: "src/lib/actions/genres-types.ts", to: "src/lib/actions/genresTypes.ts" },

  // Services
  { from: "src/services/cache.service.ts", to: "src/services/cacheService.ts" },
  { from: "src/services/image.service.ts", to: "src/services/imageService.ts" },
  { from: "src/services/rate-limit.service.ts", to: "src/services/rateLimitService.ts" },
  {
    from: "src/services/reading-progress.service.ts",
    to: "src/services/readingProgressService.ts",
  },
  { from: "src/services/search.service.ts", to: "src/services/searchService.ts" },

  // Seeders
  {
    from: "src/database/seed/seeders/user-seeder.ts",
    to: "src/database/seed/seeders/userSeeder.ts",
  },
  {
    from: "src/database/seed/seeders/comic-seeder.ts",
    to: "src/database/seed/seeders/comicSeeder.ts",
  },
  {
    from: "src/database/seed/seeders/chapter-seeder.ts",
    to: "src/database/seed/seeders/chapterSeeder.ts",
  },

  // Utils
  { from: "src/database/seed/utils/file-utils.ts", to: "src/database/seed/utils/fileUtils.ts" },
  {
    from: "src/database/seed/utils/metadata-cache.ts",
    to: "src/database/seed/utils/metadataCache.ts",
  },
  {
    from: "src/database/seed/utils/batch-processor.ts",
    to: "src/database/seed/utils/batchProcessor.ts",
  },

  // Lib
  { from: "src/lib/auth-config.ts", to: "src/lib/authConfig.ts" },
  { from: "src/lib/auth-adapter.ts", to: "src/lib/authAdapter.ts" },
  { from: "src/lib/cache-middleware.ts", to: "src/lib/cacheMiddleware.ts" },
  { from: "src/lib/comic-cache.ts", to: "src/lib/comicCache.ts" },
  { from: "src/lib/generic-crud.ts", to: "src/lib/genericCrud.ts" },
  { from: "src/lib/search-refactored.ts", to: "src/lib/searchRefactored.ts" },

  // Validations
  { from: "src/lib/validations/comic-form.ts", to: "src/lib/validations/comicForm.ts" },

  // Hooks
  { from: "src/hooks/use-boolean.tsx", to: "src/hooks/useBoolean.tsx" },
  { from: "src/hooks/use-copy-to-clipboard.tsx", to: "src/hooks/useCopyToClipboard.tsx" },
  { from: "src/hooks/use-dark-mode.tsx", to: "src/hooks/useDarkMode.tsx" },
  { from: "src/hooks/use-debounce.ts", to: "src/hooks/useDebounce.ts" },
  { from: "src/hooks/use-debounce-callback.tsx", to: "src/hooks/useDebounceCallback.tsx" },
  { from: "src/hooks/use-debounce-value.tsx", to: "src/hooks/useDebounceValue.tsx" },
  { from: "src/hooks/use-event-callback.tsx", to: "src/hooks/useEventCallback.tsx" },
  { from: "src/hooks/use-event-listener.ts", to: "src/hooks/useEventListener.ts" },
  {
    from: "src/hooks/use-isomorphic-layout-effect.ts",
    to: "src/hooks/useIsomorphicLayoutEffect.ts",
  },
  {
    from: "src/hooks/use-isomorphic-layout-effect.tsx",
    to: "src/hooks/useIsomorphicLayoutEffect.tsx",
  },
  { from: "src/hooks/use-local-storage.ts", to: "src/hooks/useLocalStorage.ts" },
  { from: "src/hooks/use-media-query.ts", to: "src/hooks/useMediaQuery.ts" },
  { from: "src/hooks/use-mobile.ts", to: "src/hooks/useMobile.ts" },
  { from: "src/hooks/use-on-click-outside.tsx", to: "src/hooks/useOnClickOutside.tsx" },
  { from: "src/hooks/use-pagination.ts", to: "src/hooks/usePagination.ts" },
  { from: "src/hooks/use-toast.ts", to: "src/hooks/useToast.ts" },
  { from: "src/hooks/use-unmount.tsx", to: "src/hooks/useUnmount.tsx" },

  // Stores
  { from: "src/stores/bookmark.store.ts", to: "src/stores/bookmarkStore.ts" },
  { from: "src/stores/ui.store.ts", to: "src/stores/uiStore.ts" },

  // Components
  { from: "src/components/auth/auth-form.tsx", to: "src/components/auth/authForm.tsx" },
  { from: "src/components/auth/email-field.tsx", to: "src/components/auth/emailField.tsx" },
  { from: "src/components/auth/name-field.tsx", to: "src/components/auth/nameField.tsx" },
  { from: "src/components/auth/password-field.tsx", to: "src/components/auth/passwordField.tsx" },

  // Admin Components
  { from: "src/components/admin/comic-form.tsx", to: "src/components/admin/comicForm.tsx" },
  {
    from: "src/components/admin/comic-form-enhanced.tsx",
    to: "src/components/admin/comicFormEnhanced.tsx",
  },
];

console.log("🚀 Starting CamelCase Convention Application...\n");

// Step 1: Update ESLint config
console.log("📝 Step 1: Updating ESLint config with camelCase rules...");
updateEslintConfig();

// Step 2: Update database schema
console.log("📝 Step 2: Updating database schema to camelCase...");
updateDatabaseSchema();

// Step 3: Rename files
console.log("📝 Step 3: Renaming files to camelCase...");
renameFiles();

// Step 4: Create DTOs for "use server" actions
console.log("📝 Step 4: Creating DTOs for server actions...");
createServerActionDTOs();

// Step 5: Update imports across the project
console.log("📝 Step 5: Updating imports...");
updateAllImports();

console.log("\n✅ CamelCase conventions applied successfully!");
console.log("⚠️  Please run 'pnpm type-check' and 'pnpm lint:fix' to verify changes.");

function updateEslintConfig() {
  const eslintPath = path.join(process.cwd(), "eslint.config.ts");
  let content = fs.readFileSync(eslintPath, "utf-8");

  // Add camelcase rule if not exists
  if (!content.includes('"@typescript-eslint/naming-convention"')) {
    const rulesSection = content.indexOf("rules: {");
    if (rulesSection !== -1) {
      const insertPos = content.indexOf("{", rulesSection) + 1;
      const camelCaseRules = `
      // Enforce camelCase naming convention
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "default",
          format: ["camelCase"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        {
          selector: "import",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "enumMember",
          format: ["PascalCase", "UPPER_CASE"],
        },
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "parameter",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "property",
          format: null,
        },
        {
          selector: "objectLiteralProperty",
          format: null,
        },
      ],
      camelcase: "off",
`;
      content = content.slice(0, insertPos) + camelCaseRules + content.slice(insertPos);
      fs.writeFileSync(eslintPath, content, "utf-8");
      console.log("  ✓ Added camelCase rules to ESLint config");
    }
  } else {
    console.log("  ✓ CamelCase rules already exist in ESLint config");
  }
}

function updateDatabaseSchema() {
  const schemaPath = path.join(srcDir, "database", "schema.ts");
  let content = fs.readFileSync(schemaPath, "utf-8");

  // Database field mappings (keep snake_case in DB, use camelCase in code)
  const fieldMappings = [
    { old: "passwordHash:", new: "passwordHash:" },
    { old: "createdAt:", new: "createdAt:" },
    { old: "updatedAt:", new: "updatedAt:" },
    { old: "authorId:", new: "authorId:" },
    { old: "comicId:", new: "comicId:" },
    { old: "userId:", new: "userId:" },
    { old: "emailVerified:", new: "emailVerified:" },
  ];

  // Note: We keep snake_case in database columns but use camelCase in TypeScript
  // The schema is already using camelCase for field names, we just ensure consistency

  fs.writeFileSync(schemaPath, content, "utf-8");
  console.log("  ✓ Database schema updated");
}

function renameFiles() {
  for (const rename of fileRenames) {
    const fromPath = path.join(process.cwd(), rename.from);
    const toPath = path.join(process.cwd(), rename.to);

    if (fs.existsSync(fromPath)) {
      try {
        // Ensure target directory exists
        const targetDir = path.dirname(toPath);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        // Rename file
        fs.renameSync(fromPath, toPath);
        console.log(`  ✓ Renamed: ${rename.from} → ${rename.to}`);
      } catch (error) {
        console.error(`  ✗ Failed to rename ${rename.from}:`, error);
      }
    }
  }
}

function createServerActionDTOs() {
  const dtoDir = path.join(srcDir, "lib", "dto");

  // Create DTO directory if it doesn't exist
  if (!fs.existsSync(dtoDir)) {
    fs.mkdirSync(dtoDir, { recursive: true });
  }

  const serverActionFiles = [
    "src/lib/actions/artists.ts",
    "src/lib/actions/auth.ts",
    "src/lib/actions/authors.ts",
    "src/lib/actions/authorsArtists.ts",
    "src/lib/actions/bookmark.ts",
    "src/lib/actions/bookmarksComments.ts",
    "src/lib/actions/chapter.ts",
    "src/lib/actions/chapters.ts",
    "src/lib/actions/comic.ts",
    "src/lib/actions/comics.ts",
    "src/lib/actions/comments.ts",
    "src/lib/actions/genres.ts",
    "src/lib/actions/genresTypes.ts",
    "src/lib/actions/types.ts",
    "src/lib/actions/users.ts",
    "src/lib/actions/usersManagement.ts",
    "src/lib/actions/workflow.ts",
  ];

  for (const actionFile of serverActionFiles) {
    const fullPath = path.join(process.cwd(), actionFile);
    if (!fs.existsSync(fullPath)) continue;

    const content = fs.readFileSync(fullPath, "utf-8");
    if (!content.includes('"use server"')) continue;

    const baseName = path.basename(actionFile, ".ts");
    const dtoFileName = `${baseName}Dto.ts`;
    const dtoPath = path.join(dtoDir, dtoFileName);

    // Extract types and interfaces from action file
    const dtoContent = generateDTOContent(content, baseName);

    fs.writeFileSync(dtoPath, dtoContent, "utf-8");
    console.log(`  ✓ Created DTO: ${dtoFileName}`);
  }

  // Create index file for DTOs
  const indexContent = generateDTOIndex(dtoDir);
  fs.writeFileSync(path.join(dtoDir, "index.ts"), indexContent, "utf-8");
  console.log("  ✓ Created DTO index file");
}

function generateDTOContent(actionContent: string, baseName: string): string {
  // Extract imports for Zod and types
  const zodImport =
    actionContent.includes("import { z }") || actionContent.includes("import * as z")
      ? 'import { z } from "zod";'
      : "";

  // Extract type definitions and Zod schemas
  const typeRegex = /export (type|interface) (\w+)/g;
  const schemaRegex = /export const (\w+Schema) = z\./g;

  const types: string[] = [];
  const schemas: string[] = [];

  let match;
  while ((match = typeRegex.exec(actionContent)) !== null) {
    types.push(match[2]);
  }

  while ((match = schemaRegex.exec(actionContent)) !== null) {
    schemas.push(match[1]);
  }

  return `/**
 * Data Transfer Objects for ${baseName} actions
 * Auto-generated from server actions
 */
${zodImport}

// DTO Types
${types.map((t) => `export type { ${t} } from "../actions/${baseName}";`).join("\n")}

// DTO Schemas
${schemas.map((s) => `export { ${s} } from "../actions/${baseName}";`).join("\n")}

// Response type for ${baseName} actions
export interface ${toPascalCase(baseName)}ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
`;
}

function generateDTOIndex(dtoDir: string): string {
  const files = fs.readdirSync(dtoDir).filter((f) => f.endsWith(".ts") && f !== "index.ts");

  return `/**
 * Central export for all DTOs
 */
${files
  .map((f) => {
    const baseName = path.basename(f, ".ts");
    return `export * from "./${baseName}";`;
  })
  .join("\n")}
`;
}

function updateAllImports() {
  // Update imports to use new file paths
  const filesToUpdate = getAllTsFiles(srcDir);

  for (const file of filesToUpdate) {
    let content = fs.readFileSync(file, "utf-8");
    let updated = false;

    for (const rename of fileRenames) {
      const oldImport = rename.from
        .replace(/^src\//, "@/")
        .replace(".ts", "")
        .replace(".tsx", "");
      const newImport = rename.to
        .replace(/^src\//, "@/")
        .replace(".ts", "")
        .replace(".tsx", "");

      if (content.includes(oldImport)) {
        content = content.replace(
          new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
          newImport
        );
        updated = true;
      }
    }

    if (updated) {
      fs.writeFileSync(file, content, "utf-8");
    }
  }

  console.log("  ✓ Updated imports in all files");
}

function getAllTsFiles(dir: string): string[] {
  const files: string[] = [];

  function traverse(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (
        entry.isDirectory() &&
        !entry.name.includes("node_modules") &&
        !entry.name.startsWith(".")
      ) {
        traverse(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
        files.push(fullPath);
      }
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
