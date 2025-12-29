#!/usr/bin/env tsx
/**
 * Comprehensive Import/Export Error Fixer
 * Fixes ALL remaining module resolution issues
 */

import fs from "fs-extra";
import { glob } from "glob";
import path from "path";

const ROOT_DIR = process.cwd();

// Define all import replacements needed
const importReplacements: Array<[RegExp, string]> = [
  // App config
  [/from ["']@\/app-config["']/g, 'from "@/appConfig"'],

  // Components - fix missing @ prefix
  [/from ["']components\/([^"']+)["']/g, 'from "@/components/$1"'],
  [/from ["']ui\/([^"']+)["']/g, 'from "@/components/ui/$1"'],
  [/from ["']admin\/([^"']+)["']/g, 'from "@/components/admin/$1"'],
  [/from ["']emails\/([^"']+)["']/g, 'from "@/components/emails/$1"'],
  [/from ["']layout\/([^"']+)["']/g, 'from "@/components/layout/$1"'],

  // Database - fix missing @ prefix
  [/from ["']database\/([^"']+)["']/g, 'from "@/database/$1"'],
  [/from ["']queries\/([^"']+)["']/g, 'from "@/database/queries/$1"'],
  [/from ["']mutations\/([^"']+)["']/g, 'from "@/database/mutations/$1"'],
  [/from ["']schema["']/g, 'from "@/database/schema"'],
  [/from ["']db["']/g, 'from "@/database/db"'],

  // DTO - fix missing @ prefix
  [/from ["']dto\/([^"']+)["']/g, 'from "@/dto/$1"'],

  // Lib - fix missing @ prefix
  [/from ["']lib\/([^"']+)["']/g, 'from "@/lib/$1"'],
  [/from ["']actions\/([^"']+)["']/g, 'from "@/lib/actions/$1"'],
  [/from ["']validations\/([^"']+)["']/g, 'from "@/lib/validations/$1"'],
  [/from ["']validations["']/g, 'from "@/lib/validations"'],

  // Services - fix missing @ prefix
  [/from ["']services\/([^"']+)["']/g, 'from "@/services/$1"'],

  // DAL - fix missing @ prefix
  [/from ["']dal\/([^"']+)["']/g, 'from "@/dal/$1"'],

  // Hooks - fix missing @ prefix
  [/from ["']hooks\/([^"']+)["']/g, 'from "@/hooks/$1"'],

  // Types - fix missing @ prefix
  [/from ["']types["']/g, 'from "@/types"'],
  [/from ["']types\/([^"']+)["']/g, 'from "@/types/$1"'],
  [/from ["']\/types([^"']*)["']/g, 'from "@/types$1"'],

  // Assets - fix missing @ prefix
  [/from ["']assets\/([^"']+)["']/g, 'from "@/assets/$1"'],
  [/from ["']\/assets\/([^"']+)["']/g, 'from "@/assets/$1"'],

  // App routes - fix leading slash
  [/from ["']\/app\/([^"']+)["']/g, 'from "@/app/$1"'],

  // Third-party packages - add missing @ prefix
  [/from ["']radix-ui\/([^"']+)["']/g, 'from "@radix-ui/$1"'],
  [/from ["']tanstack\/([^"']+)["']/g, 'from "@tanstack/$1"'],
  [/from ["']hookform\/([^"']+)["']/g, 'from "@hookform/$1"'],
  [/from ["']dnd-kit\/([^"']+)["']/g, 'from "@dnd-kit/$1"'],
  [/from ["']testing-library\/([^"']+)["']/g, 'from "@testing-library/$1"'],
  [/from ["']tabler\/([^"']+)["']/g, 'from "@tabler/$1"'],
  [/from ["']t3-oss\/([^"']+)["']/g, 'from "@t3-oss/$1"'],
  [/from ["']aws-sdk\/([^"']+)["']/g, 'from "@aws-sdk/$1"'],
  [/from ["']auth\/([^"']+)["']/g, 'from "@auth/$1"'],
  [/from ["']tiptap\/([^"']+)["']/g, 'from "@tiptap/$1"'],
  [/from ["']react-emailcomponents["']/g, 'from "@react-email/components"'],
];

async function fixFile(filePath: string): Promise<number> {
  let content = await fs.readFile(filePath, "utf-8");
  const original = content;
  let changes = 0;

  for (const [pattern, replacement] of importReplacements) {
    const matches = content.match(pattern);
    if (matches) {
      content = content.replace(pattern, replacement);
      changes += matches.length;
    }
  }

  if (content !== original) {
    await fs.writeFile(filePath, content);
  }

  return changes;
}

async function createMissingIndexFiles() {
  console.log("\n📦 Creating missing index files...\n");

  // Create components/admin/index.ts if missing
  const adminIndexPath = path.join(ROOT_DIR, "src/components/admin/index.ts");
  if (!(await fs.pathExists(adminIndexPath))) {
    await fs.writeFile(
      adminIndexPath,
      `// Admin components barrel export\nexport * from "./AdminUsersOptimized";\nexport * from "./BaseForm";\nexport * from "./ComicForm";\nexport * from "./DataTable";\n`
    );
    console.log("✓ Created src/components/admin/index.ts");
  }

  // Create components/index.ts if missing
  const componentsIndexPath = path.join(ROOT_DIR, "src/components/index.ts");
  if (!(await fs.pathExists(componentsIndexPath))) {
    await fs.writeFile(
      componentsIndexPath,
      `// Components barrel export\nexport * from "./AppNavbar";\nexport * from "./BookmarkButton";\nexport * from "./ChapterReader";\nexport * from "./ComicCard";\nexport * from "./DataTable";\nexport * from "./Filters";\nexport * from "./Pagination";\n`
    );
    console.log("✓ Created src/components/index.ts");
  }

  // Ensure ui/scroll-area.tsx exists (referenced in index)
  const scrollAreaPath = path.join(ROOT_DIR, "src/components/ui/scroll-area.tsx");
  if (!(await fs.pathExists(scrollAreaPath))) {
    await fs.writeFile(
      scrollAreaPath,
      `export { ScrollArea } from "./ScrollArea";\nexport type { ScrollAreaProps } from "./ScrollArea";\n`
    );
    console.log("✓ Created src/components/ui/scroll-area.tsx");
  }

  console.log("");
}

async function fixTsconfigPaths() {
  console.log("📝 Updating tsconfig.json paths...\n");

  const tsconfigPath = path.join(ROOT_DIR, "tsconfig.json");
  const tsconfig = await fs.readJSON(tsconfigPath);

  // Ensure all necessary paths are configured
  const paths = {
    ...tsconfig.compilerOptions.paths,
    "@/*": ["./src/*"],
    "@/app-config": ["./appConfig.ts"],
    "@/appConfig": ["./appConfig.ts"],
  };

  tsconfig.compilerOptions.paths = paths;

  await fs.writeJSON(tsconfigPath, tsconfig, { spaces: 2 });
  console.log("✓ Updated tsconfig.json\n");
}

async function main() {
  console.log("\n🚀 Comprehensive Import/Export Error Fix\n");
  console.log("═".repeat(60) + "\n");

  try {
    // Step 1: Create missing files
    await createMissingIndexFiles();

    // Step 2: Update tsconfig
    await fixTsconfigPaths();

    // Step 3: Fix all imports
    console.log("🔧 Fixing import statements...\n");

    const files = await glob("**/*.{ts,tsx}", {
      cwd: ROOT_DIR,
      ignore: ["**/node_modules/**", "**/.next/**", "**/dist/**"],
      absolute: true,
    });

    let totalChanges = 0;
    let filesFixed = 0;

    for (const file of files) {
      const changes = await fixFile(file);
      if (changes > 0) {
        filesFixed++;
        totalChanges += changes;
        const relativePath = path.relative(ROOT_DIR, file);
        console.log(`✓ ${relativePath} (${changes} imports)`);
      }
    }

    console.log("\n" + "═".repeat(60));
    console.log(`\n✅ Fixed ${totalChanges} imports in ${filesFixed} files\n`);
    console.log("📝 Next steps:");
    console.log("   1. Run: pnpm type-check");
    console.log("   2. Run: pnpm lint:fix");
    console.log("   3. Run: pnpm format\n");
  } catch (error) {
    console.error("\n❌ Error:", (error as Error).message);
    process.exit(1);
  }
}

main();
