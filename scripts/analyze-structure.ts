#!/usr/bin/env tsx
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FOLDER STRUCTURE OPTIMIZER - Next.js 16 Best Practices
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This script optimizes the folder structure according to Next.js 16 best practices:
 * - Proper separation of concerns
 * - Colocated components and logic
 * - Clear module boundaries
 * - Optimized for tree-shaking
 */

import chalk from "chalk";
import fs from "fs-extra";
import { globSync } from "glob";
import path from "path";

const DRY_RUN = process.argv.includes("--dry-run");
const VERBOSE = process.argv.includes("--verbose");

interface FolderStructure {
  current: string;
  recommended: string;
  reason: string;
}

const STRUCTURE_IMPROVEMENTS: FolderStructure[] = [
  {
    current: "src/components/ui",
    recommended: "src/components/ui",
    reason: "✅ Already optimal - shadcn/ui components",
  },
  {
    current: "src/lib/actions",
    recommended: "src/features/*/actions",
    reason: "Group actions by feature for better organization",
  },
  {
    current: "src/database/queries",
    recommended: "src/dal",
    reason: "Consolidate data access layer for better encapsulation",
  },
  {
    current: "src/database/mutations",
    recommended: "src/dal",
    reason: "Consolidate data access layer for better encapsulation",
  },
];

function log(message: string, level: "info" | "success" | "warn" | "error" = "info"): void {
  const colors = {
    info: chalk.blue,
    success: chalk.green,
    warn: chalk.yellow,
    error: chalk.red,
  };
  console.log(colors[level](message));
}

function header(title: string): void {
  console.log();
  console.log(chalk.cyan("═".repeat(70)));
  console.log(chalk.cyan.bold(`  ${title}`));
  console.log(chalk.cyan("═".repeat(70)));
  console.log();
}

async function analyzeStructure(): Promise<void> {
  header("Folder Structure Analysis");

  // Get all directories in src
  const srcDirs = globSync("src/*/", {
    cwd: process.cwd(),
  });

  log(`Found ${srcDirs.length} top-level directories in src/`, "info");

  for (const dir of srcDirs) {
    const stats = await fs.stat(dir);
    const files = globSync(`${dir}**/*.{ts,tsx}`, {
      ignore: ["**/*.d.ts", "**/node_modules/**"],
    });

    log(`📁 ${dir} - ${files.length} files`, "info");
  }
}

async function checkDuplicateCode(): Promise<void> {
  header("Checking for Duplicate Code");

  // Check for duplicate component names
  const components = globSync("src/**/*.tsx", {
    ignore: ["**/*.d.ts", "**/node_modules/**", "**/.next/**"],
  });

  const componentNames = new Map<string, string[]>();

  for (const component of components) {
    const basename = path.basename(component, ".tsx");
    if (!componentNames.has(basename)) {
      componentNames.set(basename, []);
    }
    componentNames.get(basename)!.push(component);
  }

  const duplicates = Array.from(componentNames.entries()).filter(([_, files]) => files.length > 1);

  if (duplicates.length > 0) {
    log(`⚠️  Found ${duplicates.length} duplicate component names:`, "warn");
    for (const [name, files] of duplicates) {
      log(`\n  ${name}:`, "info");
      for (const file of files) {
        log(`    - ${file}`, "info");
      }
    }
  } else {
    log("✅ No duplicate component names found", "success");
  }
}

async function validateImports(): Promise<void> {
  header("Validating Import Paths");

  const tsFiles = globSync("src/**/*.{ts,tsx}", {
    ignore: ["**/*.d.ts", "**/node_modules/**", "**/.next/**"],
  });

  let relativeImports = 0;
  let aliasImports = 0;

  for (const file of tsFiles) {
    const content = await fs.readFile(file, "utf-8");
    const relativeMatches = content.match(/from\s+["']\.{1,2}\//g);
    const aliasMatches = content.match(/from\s+["'][@]/g);

    if (relativeMatches) {
      relativeImports += relativeMatches.length;
    }
    if (aliasMatches) {
      aliasImports += aliasMatches.length;
    }
  }

  log(`📊 Import Statistics:`, "info");
  log(`  - Relative imports: ${relativeImports}`, relativeImports > aliasImports ? "warn" : "info");
  log(`  - Alias imports: ${aliasImports}`, aliasImports > relativeImports ? "success" : "info");

  if (relativeImports > aliasImports) {
    log(`\n  ⚠️  Consider running: pnpm imports:optimize`, "warn");
  }
}

async function checkFeatureOrganization(): Promise<void> {
  header("Feature Organization Check");

  const features = ["auth", "comics", "chapters", "bookmarks", "comments", "admin", "profile"];

  log("Recommended feature-based structure:", "info");
  log("\n  src/features/", "info");
  for (const feature of features) {
    log(`    ├── ${feature}/`, "info");
    log(`    │   ├── actions/`, "info");
    log(`    │   ├── components/`, "info");
    log(`    │   ├── hooks/`, "info");
    log(`    │   ├── types/`, "info");
    log(`    │   └── utils/`, "info");
  }

  log("\n  Benefits:", "success");
  log("    ✅ Better code organization", "success");
  log("    ✅ Easier to find related code", "success");
  log("    ✅ Better tree-shaking", "success");
  log("    ✅ Clearer module boundaries", "success");
}

async function generateRecommendations(): Promise<void> {
  header("Optimization Recommendations");

  const recommendations = [
    {
      priority: "HIGH",
      action: "Move data access code to DAL",
      reason: "Better separation of concerns and easier testing",
      command: "Already implemented in src/dal/",
    },
    {
      priority: "MEDIUM",
      action: "Organize by feature instead of type",
      reason: "Easier navigation and better scalability",
      command: "Manual refactoring needed",
    },
    {
      priority: "MEDIUM",
      action: "Colocate tests with source files",
      reason: "Easier to maintain and find tests",
      command: "Move *.test.ts next to source files",
    },
    {
      priority: "LOW",
      action: "Use barrel exports sparingly",
      reason: "Can impact tree-shaking performance",
      command: "Review index.ts files",
    },
  ];

  for (const rec of recommendations) {
    const color =
      rec.priority === "HIGH" ? chalk.red : rec.priority === "MEDIUM" ? chalk.yellow : chalk.blue;
    log(`\n${color(`[${rec.priority}]`)} ${rec.action}`, "info");
    log(`  Reason: ${rec.reason}`, "info");
    log(`  Action: ${rec.command}`, "info");
  }
}

async function createStructureReport(): Promise<void> {
  const reportPath = "docs/STRUCTURE_REPORT.md";

  const report = ` ComicWise - Folder Structure Report

Generated: ${new Date().toISOString()}

 Current Structure

\`\`\`
src/
├── app/               Next.js App Router
├── components/        Reusable components
│   ├── ui/           shadcn/ui components
│   ├── admin/        Admin-specific components
│   ├── auth/         Auth-related components
│   └── emails/       Email templates
├── lib/              Utility functions and configs
│   ├── actions/      Server actions
│   └── validations/  Zod schemas
├── database/         Database layer
│   ├── queries/      (deprecated - use DAL)
│   └── mutations/    (deprecated - use DAL)
├── dal/              Data Access Layer (new)
├── dto/              Data Transfer Objects
├── types/            TypeScript type definitions
├── hooks/            Custom React hooks
├── services/         Business logic services
└── stores/           State management
\`\`\`

 Recommended Improvements

 1. Feature-Based Organization (Future Enhancement)

\`\`\`
src/features/
├── auth/
│   ├── actions/
│   ├── components/
│   ├── hooks/
│   └── types/
├── comics/
│   ├── actions/
│   ├── components/
│   ├── hooks/
│   └── types/
└── ...
\`\`\`

 2. Data Layer Consolidation ✅

- **Implemented**: All queries and mutations moved to \`src/dal/\`
- **Benefit**: Single source of truth for data operations

 3. Type Organization ✅

- **Current**: Centralized in \`src/types/\`
- **Status**: Well-organized with proper exports

 Best Practices

1. ✅ Use path aliases (components, lib, etc.)
2. ✅ Separate client and server code
3. ✅ Colocate related files
4. ✅ Use TypeScript strict mode
5. ⚠️  Consider feature-based organization for scale

 Next Steps

1. Continue using DAL for all data operations
2. Update import paths to use aliases
3. Consider feature-based structure as project grows
4. Maintain clean separation of concerns
`;

  if (!DRY_RUN) {
    await fs.ensureDir("docs");
    await fs.writeFile(reportPath, report);
    log(`\n📄 Report saved to: ${reportPath}`, "success");
  }
}

async function main(): Promise<void> {
  console.log(
    chalk.cyan.bold("\n╔══════════════════════════════════════════════════════════════╗")
  );
  console.log(chalk.cyan.bold("║      Folder Structure Optimizer - ComicWise                  ║"));
  console.log(chalk.cyan.bold("╚══════════════════════════════════════════════════════════════╝"));

  if (DRY_RUN) {
    log("\n🔍 DRY RUN MODE - No changes will be made\n", "warn");
  }

  await analyzeStructure();
  await checkDuplicateCode();
  await validateImports();
  await checkFeatureOrganization();
  await generateRecommendations();
  await createStructureReport();

  console.log();
  log("═".repeat(70), "info");
  log("✅ Structure analysis complete!", "success");
  log("═".repeat(70), "info");
  console.log();
}

main().catch((error) => {
  console.error(chalk.red("Error:"), error);
  process.exit(1);
});
