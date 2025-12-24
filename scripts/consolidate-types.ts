#!/usr/bin/env tsx
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TYPE CONSOLIDATION SCRIPT - ComicWise
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Consolidates and optimizes TypeScript type definitions
 * - Removes duplicate type declarations
 * - Identifies unused type files
 * - Validates type exports
 * - Creates optimized type index
 * 
 * @usage pnpm tsx scripts/consolidate-types.ts [--dry-run] [--verbose]
 */

import chalk from "chalk";
import { readFileSync, writeFileSync, existsSync, unlinkSync } from "fs";
import { globSync } from "glob";
import path from "path";

// ═══════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const VERBOSE = args.includes("--verbose");

const TYPES_DIR = "src/types";
const TYPE_FILES = globSync(`${TYPES_DIR}/**/*.{ts,d.ts}`, {
  ignore: ["**/node_modules/**", "**/index.ts"],
});

// ═══════════════════════════════════════════════════
// TYPE ANALYSIS
// ═══════════════════════════════════════════════════

interface TypeExport {
  name: string;
  kind: "interface" | "type" | "enum" | "class";
  file: string;
}

interface FileAnalysis {
  file: string;
  exports: TypeExport[];
  imports: string[];
  isEmpty: boolean;
  isDeclaration: boolean;
}

console.log(chalk.cyan("\n╔══════════════════════════════════════════════════════════════╗"));
console.log(chalk.cyan("║          Type Consolidation Tool - ComicWise                 ║"));
console.log(chalk.cyan("╚══════════════════════════════════════════════════════════════╝\n"));

if (DRY_RUN) {
  console.log(chalk.yellow("🔍 DRY RUN MODE - No files will be modified\n"));
}

// Analyze all type files
const analyses: FileAnalysis[] = [];
const allExports = new Map<string, TypeExport[]>();

console.log(chalk.blue(`📁 Analyzing ${TYPE_FILES.length} type files...\n`));

for (const file of TYPE_FILES) {
  const content = readFileSync(file, "utf8");
  const relativePath = path.relative(process.cwd(), file);

  // Extract exports
  const exportRegex = /export\s+(?:interface|type|enum|class)\s+(\w+)/g;
  const exports: TypeExport[] = [];
  let match;

  while ((match = exportRegex.exec(content)) !== null) {
    const name = match[1];
    const kind = content.includes(`interface ${name}`)
      ? "interface"
      : content.includes(`type ${name}`)
        ? "type"
        : content.includes(`enum ${name}`)
          ? "enum"
          : "class";

    exports.push({ name, kind, file: relativePath });

    // Track all exports globally
    if (!allExports.has(name)) {
      allExports.set(name, []);
    }
    allExports.get(name)!.push({ name, kind, file: relativePath });
  }

  // Extract imports
  const importRegex = /import\s+(?:type\s+)?{([^}]+)}/g;
  const imports: string[] = [];
  while ((match = importRegex.exec(content)) !== null) {
    const importNames = match[1].split(",").map((s) => s.trim());
    imports.push(...importNames);
  }

  analyses.push({
    file: relativePath,
    exports,
    imports,
    isEmpty: exports.length === 0 && !content.includes("export *"),
    isDeclaration: file.endsWith(".d.ts"),
  });

  if (VERBOSE) {
    console.log(chalk.gray(`✓ ${relativePath}`));
    if (exports.length > 0) {
      console.log(chalk.gray(`  Exports: ${exports.map((e) => e.name).join(", ")}`));
    }
  }
}

// ═══════════════════════════════════════════════════
// FIND DUPLICATES
// ═══════════════════════════════════════════════════

console.log(chalk.yellow("\n📊 Analysis Results:\n"));

const duplicates = Array.from(allExports.entries())
  .filter(([_, locations]) => locations.length > 1)
  .map(([name, locations]) => ({ name, locations }));

if (duplicates.length > 0) {
  console.log(chalk.red(`⚠️  Found ${duplicates.length} duplicate type definitions:\n`));
  for (const { name, locations } of duplicates) {
    console.log(chalk.yellow(`  ${name}:`));
    for (const loc of locations) {
      console.log(chalk.gray(`    - ${loc.file}`));
    }
  }
} else {
  console.log(chalk.green("✅ No duplicate type definitions found"));
}

// ═══════════════════════════════════════════════════
// FIND EMPTY FILES
// ═══════════════════════════════════════════════════

const emptyFiles = analyses.filter((a) => a.isEmpty && !a.file.includes("index.ts"));

if (emptyFiles.length > 0) {
  console.log(chalk.yellow(`\n📄 Found ${emptyFiles.length} potentially empty files:\n`));
  for (const { file } of emptyFiles) {
    console.log(chalk.gray(`  - ${file}`));
  }
}

// ═══════════════════════════════════════════════════
// FIND UNUSED EXPORTS
// ═══════════════════════════════════════════════════

const allImportedTypes = new Set<string>();
for (const analysis of analyses) {
  for (const imp of analysis.imports) {
    allImportedTypes.add(imp);
  }
}

// Check usage in source files
const sourceFiles = globSync("src/**/*.{ts,tsx}", {
  ignore: ["**/node_modules/**", "**/types/**"],
});

for (const file of sourceFiles) {
  const content = readFileSync(file, "utf8");
  const importRegex = /import\s+(?:type\s+)?{([^}]+)}/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importNames = match[1].split(",").map((s) => s.trim());
    for (const name of importNames) {
      allImportedTypes.add(name);
    }
  }
}

const unusedExports = Array.from(allExports.keys()).filter(
  (name) => !allImportedTypes.has(name) && !name.startsWith("Insert")
);

if (unusedExports.length > 0) {
  console.log(chalk.yellow(`\n🗑️  Found ${unusedExports.length} potentially unused exports:\n`));
  for (const name of unusedExports.slice(0, 20)) {
    const locations = allExports.get(name)!;
    console.log(chalk.gray(`  - ${name} (${locations[0].file})`));
  }
  if (unusedExports.length > 20) {
    console.log(chalk.gray(`  ... and ${unusedExports.length - 20} more`));
  }
}

// ═══════════════════════════════════════════════════
// GENERATE OPTIMIZED INDEX
// ═══════════════════════════════════════════════════

const coreFiles = [
  "Core.ts",
  "Utility.ts",
  "database.ts",
  "actions.ts",
  "Api.ts",
  "components.ts",
  "forms.ts",
  "cache.d.ts",
  "monitoring.d.ts",
  "queue.d.ts",
  "upload.d.ts",
];

const indexContent = `// ═══════════════════════════════════════════════════
// TYPES INDEX - Centralized Type Exports (Auto-generated)
// ═══════════════════════════════════════════════════
// Generated: ${new Date().toISOString()}

// ═══════════════════════════════════════════════════
// CORE TYPES
// ═══════════════════════════════════════════════════
export * from "./Core";
export * from "./Utility";

// ═══════════════════════════════════════════════════
// DATABASE MODELS
// ═══════════════════════════════════════════════════
export * from "./database";

// ═══════════════════════════════════════════════════
// API & ACTIONS
// ═══════════════════════════════════════════════════
export * from "./actions";
export * from "./Api";

// ═══════════════════════════════════════════════════
// COMPONENTS & FORMS
// ═══════════════════════════════════════════════════
export * from "./components";
export * from "./forms";

// ═══════════════════════════════════════════════════
// SYSTEM TYPES
// ═══════════════════════════════════════════════════
export * from "./cache";
export * from "./monitoring";
export * from "./queue";
export * from "./upload";
`;

if (!DRY_RUN) {
  writeFileSync(`${TYPES_DIR}/index.ts`, indexContent, "utf8");
  console.log(chalk.green("\n✅ Updated types/index.ts"));
}

// ═══════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════

console.log(chalk.cyan("\n╔══════════════════════════════════════════════════════════════╗"));
console.log(chalk.cyan("║                        Summary                                ║"));
console.log(chalk.cyan("╚══════════════════════════════════════════════════════════════╝\n"));

console.log(chalk.yellow("Total type files:"), TYPE_FILES.length);
console.log(chalk.yellow("Duplicate definitions:"), duplicates.length);
console.log(chalk.yellow("Empty files:"), emptyFiles.length);
console.log(chalk.yellow("Unused exports:"), unusedExports.length);
console.log(chalk.yellow("Total exports:"), allExports.size);

if (DRY_RUN) {
  console.log(chalk.yellow("\nℹ️  This was a dry run. Run without --dry-run to apply changes.\n"));
} else {
  console.log(chalk.green("\n✅ Type consolidation complete!\n"));
}

process.exit(0);
