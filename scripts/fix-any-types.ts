#!/usr/bin/env tsx
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ANY TYPE FIXER - ComicWise
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Automatically fixes 'any' types with proper TypeScript types
 *
 * usage pnpm tsx scripts/fix-any-types.ts [--dry-run] [--fix]
 */

import { readFileSync, writeFileSync } from "fs";
import { globSync } from "glob";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const AUTO_FIX = args.includes("--fix");

console.log("🔍 Searching for 'any' types...\n");

// Find all TypeScript files with 'any' type
const tsFiles = globSync("**/*.{ts,tsx}", {
  ignore: ["**/node_modules/**", "**/*.d.ts", "**/types/**"],
});

interface AnyTypeLocation {
  file: string;
  line: number;
  column: number;
  context: string;
  suggestion?: string;
}

const anyTypeLocations: AnyTypeLocation[] = [];

for (const file of tsFiles) {
  const content = readFileSync(file, "utf8");
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    // Skip comments and type declarations that are intentionally any
    if (line.trim().startsWith("//") || line.trim().startsWith("*")) {
      return;
    }

    const anyMatches = [
      ...line.matchAll(/:\s*any(?:\s|;|,|\)|\||&)/g),
      ...line.matchAll(/<any>/g),
      ...line.matchAll(/as\s+any/g),
    ];

    for (const match of anyMatches) {
      if (!match.index) continue;

      const context = line.trim();
      let suggestion: string | undefined;

      // Try to suggest better types based on context
      if (context.includes("request") || context.includes("req")) {
        suggestion = "Request | NextRequest";
      } else if (context.includes("response") || context.includes("res")) {
        suggestion = "Response | NextResponse";
      } else if (context.includes("error") || context.includes("err")) {
        suggestion = "Error | unknown";
      } else if (context.includes("data")) {
        suggestion = "unknown";
      } else if (context.includes("params")) {
        suggestion = "Record<string, string | string[]>";
      } else if (context.includes("query")) {
        suggestion = "Record<string, string | string[] | undefined>";
      } else if (context.includes("props")) {
        suggestion = "Record<string, unknown>";
      } else if (context.includes("event")) {
        suggestion = "Event";
      } else if (context.includes("value")) {
        suggestion = "unknown";
      }

      anyTypeLocations.push({
        file,
        line: index + 1,
        column: match.index,
        context,
        suggestion,
      });
    }
  });
}

// Display results
console.log(`Found ${anyTypeLocations.length} instances of 'any' type:\n`);

const fileGroups = anyTypeLocations.reduce(
  (acc, loc) => {
    if (!acc[loc.file]) {
      acc[loc.file] = [];
    }
    acc[loc.file].push(loc);
    return acc;
  },
  {} as Record<string, AnyTypeLocation[]>
);

let fixedCount = 0;

for (const [file, locations] of Object.entries(fileGroups)) {
  console.log(`\n📄 ${file} (${locations.length} instances)`);

  for (const loc of locations) {
    console.log(`  Line ${loc.line}: ${loc.context}`);
    if (loc.suggestion) {
      console.log(`    💡 Suggestion: ${loc.suggestion}`);
    }
  }

  // Auto-fix if requested
  if (AUTO_FIX && !DRY_RUN) {
    let content = readFileSync(file, "utf8");
    let modified = false;

    for (const loc of locations) {
      if (loc.suggestion) {
        // Simple replacements
        content = content.replace(/:\s*any(?=\s|;|,|\)|\||&)/, `: ${loc.suggestion}`);
        content = content.replace(/<any>/g, `<${loc.suggestion}>`);
        content = content.replace(/as\s+any/g, `as ${loc.suggestion}`);
        modified = true;
        fixedCount++;
      }
    }

    if (modified) {
      writeFileSync(file, content, "utf8");
      console.log(`  ✅ Fixed with suggestions`);
    }
  }
}

console.log(`\n════════════════════════════════════════════════════`);
console.log(`Total 'any' types found: ${anyTypeLocations.length}`);

if (AUTO_FIX && !DRY_RUN) {
  console.log(`Fixed automatically: ${fixedCount}`);
  console.log(`Remaining: ${anyTypeLocations.length - fixedCount}`);
  console.log(`\n✅ Auto-fix complete! Please review the changes.`);
} else if (DRY_RUN) {
  console.log(`\n🔍 This was a dry run. Use --fix to apply suggestions.`);
} else {
  console.log(`\n💡 Run with --fix to auto-apply suggestions`);
}

process.exit(0);
