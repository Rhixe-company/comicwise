#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IMPORT PATH OPTIMIZER - ComicWise
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Automatically updates import statements to use optimized TypeScript paths
 * defined in tsconfig.json for cleaner and more maintainable imports.
 *
 * @usage pnpm tsx scripts/replace-imports.ts [--dry-run] [--verbose]
 */

import fs from "fs";
import { globSync } from "glob";
import { dirname, relative, resolve } from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const baseDirname = dirname(filename);
const repoRoot = resolve(baseDirname, "..");

// CLI flags
const isDryRun = process.argv.includes("--dry-run");
const isVerbose = process.argv.includes("--verbose");

console.log("━".repeat(80));
console.log("🔄 Import Path Optimizer");
console.log("━".repeat(80));
if (isDryRun) console.log("⚠️  DRY RUN MODE - No files will be modified\n");

/**
 * Import replacement patterns
 * Order matters: More specific patterns should come first
 */
const patterns = [
  // Fix relative imports to use path aliases
  { from: /from ["'](?:\.{2}\/){3}components\/ui\/(.*?)["']/g, to: "from '#ui/$1'" },
  { from: /from ["']\.\.\/\.\.\/components\/ui\/(.*?)["']/g, to: "from '#ui/$1'" },
  { from: /from ["']\.\.\/components\/ui\/(.*?)["']/g, to: "from '#ui/$1'" },

  { from: /from ["'](?:\.{2}\/){3}components\/(.*?)["']/g, to: "from '#components/$1'" },
  { from: /from ["']\.\.\/\.\.\/components\/(.*?)["']/g, to: "from '#components/$1'" },
  { from: /from ["']\.\.\/components\/(.*?)["']/g, to: "from '#components/$1'" },

  { from: /from ["'](?:\.{2}\/){3}lib\/actions\/(.*?)["']/g, to: "from '#actions/$1'" },
  { from: /from ["']\.\.\/\.\.\/lib\/actions\/(.*?)["']/g, to: "from '#actions/$1'" },
  { from: /from ["']\.\.\/lib\/actions\/(.*?)["']/g, to: "from '#actions/$1'" },

  { from: /from ["'](?:\.{2}\/){3}lib\/(.*?)["']/g, to: "from '#lib/$1'" },
  { from: /from ["']\.\.\/\.\.\/lib\/(.*?)["']/g, to: "from '#lib/$1'" },
  { from: /from ["']\.\.\/lib\/(.*?)["']/g, to: "from '#lib/$1'" },

  { from: /from ["'](?:\.{2}\/){3}database\/(.*?)["']/g, to: "from '#database/$1'" },
  { from: /from ["']\.\.\/\.\.\/database\/(.*?)["']/g, to: "from '#database/$1'" },
  { from: /from ["']\.\.\/database\/(.*?)["']/g, to: "from '#database/$1'" },

  { from: /from ["'](?:\.{2}\/){3}ho{2}ks\/(.*?)["']/g, to: "from '#hooks/$1'" },
  { from: /from ["']\.\.\/\.\.\/hooks\/(.*?)["']/g, to: "from '#hooks/$1'" },
  { from: /from ["']\.\.\/hooks\/(.*?)["']/g, to: "from '#hooks/$1'" },

  // Fix old style imports to new style
  { from: /from ["']@\/components\/ui\/(.*?)["']/g, to: "from '#ui/$1'" },
  { from: /from ["']@\/components\/emails\/(.*?)["']/g, to: "from '#emails/$1'" },
  { from: /from ["']@\/components\/layout\/(.*?)["']/g, to: "from '#layout/$1'" },
  { from: /from ["']@\/lib\/actions\/(.*?)["']/g, to: "from '#actions/$1'" },
  { from: /from ["']@\/lib\/validations\/(.*?)["']/g, to: "from '#validations/$1'" },
  { from: /from ["']@\/database\/queries\/(.*?)["']/g, to: "from '#queries/$1'" },
  { from: /from ["']@\/database\/mutations\/(.*?)["']/g, to: "from '#mutations/$1'" },
  { from: /from ["']@\/database\/schema["']/g, to: "from '#schema'" },

  // Normalize special imports
  { from: /from ["']@\/app-config["']/g, to: "from 'appConfig'" },
  { from: /from ["']src\/app-config["']/g, to: "from 'appConfig'" },
  { from: /from ["']\.\.\/app-config["']/g, to: "from 'appConfig'" },
  { from: /from ["']\.\.\/\.\.\/app-config["']/g, to: "from 'appConfig'" },

  { from: /from ["']src\/database\/db["']/g, to: "from 'db'" },
  { from: /from ["']database\/db["']/g, to: "from 'db'" },

  { from: /from ["']@\/lib\/utils["']/g, to: "from 'utils'" },
  { from: /from ["']src\/lib\/utils["']/g, to: "from 'utils'" },

  { from: /from ["']@\/lib\/auth["']/g, to: "from 'auth'" },
  { from: /from ["']src\/lib\/auth["']/g, to: "from 'auth'" },
];

/**
 * Files to process
 */
const fileGlob = "src/**/*.{ts,tsx,js,jsx,mts}";
const ignore = [
  "node_modules/**",
  ".next/**",
  "dist/**",
  "out/**",
  "build/**",
  "coverage/**",
  "**/*.d.ts",
];

console.log("📂 Scanning files...");
const files = globSync(fileGlob, { cwd: repoRoot, absolute: true, ignore });
console.log(`   Found ${files.length} files to process\n`);

let changed = 0;
let totalReplacements = 0;

for (const file of files) {
  let source = fs.readFileSync(file, "utf8");
  const original = source;
  let fileReplacements = 0;

  patterns.forEach(({ from, to }) => {
    const matches = source.match(from);
    if (matches) {
      fileReplacements += matches.length;
      source = source.replace(from, to);
    }
  });

  if (source !== original) {
    if (!isDryRun) {
      fs.writeFileSync(file, source, "utf8");
    }
    changed++;
    totalReplacements += fileReplacements;

    const relativePath = relative(repoRoot, file);
    console.log(`✓ ${relativePath}`);
    if (isVerbose) {
      console.log(`  ${fileReplacements} replacement(s)`);
    }
  }
}

console.log("\n" + "━".repeat(80));
console.log("📊 Summary");
console.log("━".repeat(80));
console.log(`Files processed: ${files.length}`);
console.log(`Files modified: ${changed}`);
console.log(`Total replacements: ${totalReplacements}`);
if (isDryRun) {
  console.log("\n⚠️  DRY RUN - No files were actually modified");
  console.log("   Run without --dry-run to apply changes");
}
console.log("━".repeat(80));
