#!/usr/bin/env node

/**
 * TYPE SAFETY AUDIT & FIX SCRIPT
 * Identifies and helps fix type safety issues
 */

import { readFileSync, writeFileSync } from "fs";
import { glob } from "glob";

// ═══════════════════════════════════════════════════
// TYPE SAFETY PATTERNS
// ═══════════════════════════════════════════════════

interface TypeIssue {
  file: string;
  line: number;
  type: "any" | "ts-ignore" | "ts-expect-error" | "unknown-check";
  content: string;
  severity: "error" | "warning" | "info";
}

const PATTERNS = {
  any: /:\s*any\b/g,
  tsIgnore: /ts-ignore/g,
  tsExpectError: /ts-expect-error/g,
  asAny: /as\s+any\b/g,
};

// ═══════════════════════════════════════════════════
// SUGGESTED FIXES
// ═══════════════════════════════════════════════════

const SUGGESTIONS: Record<string, string[]> = {
  any: [
    "Use 'unknown' for truly unknown types",
    "Use generic types like <T>",
    "Use proper interface or type definition",
    "Infer types from Zod schemas: type X = z.infer<typeof schema>",
  ],
  "ts-ignore": [
    "Fix the underlying type issue instead",
    "Use proper type assertions",
    "Add proper type definitions",
  ],
  "ts-expect-error": ["Preferred over ts-ignore but still avoid", "Fix the type error properly"],
};

// ═══════════════════════════════════════════════════
// FILE SCANNING
// ═══════════════════════════════════════════════════

async function scanFile(filePath: string): Promise<TypeIssue[]> {
  const issues: TypeIssue[] = [];

  try {
    const content = readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      // Check for 'any' type
      if (PATTERNS.any.test(line)) {
        issues.push({
          file: filePath,
          line: index + 1,
          type: "any",
          content: line.trim(),
          severity: "error",
        });
      }

      // Check for ts-ignore
      if (PATTERNS.tsIgnore.test(line)) {
        issues.push({
          file: filePath,
          line: index + 1,
          type: "ts-ignore",
          content: line.trim(),
          severity: "error",
        });
      }

      // Check for ts-expect-error
      if (PATTERNS.tsExpectError.test(line)) {
        issues.push({
          file: filePath,
          line: index + 1,
          type: "ts-expect-error",
          content: line.trim(),
          severity: "warning",
        });
      }

      // Check for 'as any'
      if (PATTERNS.asAny.test(line)) {
        issues.push({
          file: filePath,
          line: index + 1,
          type: "any",
          content: line.trim(),
          severity: "error",
        });
      }
    });
  } catch (error) {
    console.error(`Error scanning ${filePath}:`, error);
  }

  return issues;
}

async function scanProject(): Promise<TypeIssue[]> {
  const files = await glob("**/*.{ts,tsx}", { ignore: ["node_modules/**", ".next/**"] });
  const allIssues: TypeIssue[] = [];

  for (const file of files) {
    const issues = await scanFile(file);
    allIssues.push(...issues);
  }

  return allIssues;
}

// ═══════════════════════════════════════════════════
// REPORTING
// ═══════════════════════════════════════════════════

function generateReport(issues: TypeIssue[]): void {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  TYPE SAFETY AUDIT REPORT");
  console.log("═══════════════════════════════════════════════════════");
  console.log("");

  if (issues.length === 0) {
    console.log("✅ No type safety issues found!");
    return;
  }

  // Group by file
  const byFile = issues.reduce(
    (acc, issue) => {
      if (!acc[issue.file]) acc[issue.file] = [];
      acc[issue.file].push(issue);
      return acc;
    },
    {} as Record<string, TypeIssue[]>
  );

  // Group by type
  const byType = issues.reduce(
    (acc, issue) => {
      if (!acc[issue.type]) acc[issue.type] = 0;
      acc[issue.type]++;
      return acc;
    },
    {} as Record<string, number>
  );

  console.log("📊 SUMMARY:");
  console.log("");
  console.log(`Total issues found: ${issues.length}`);
  console.log("");
  console.log("By type:");
  Object.entries(byType).forEach(([type, count]) => {
    console.log(`  • ${type}: ${count}`);
  });
  console.log("");

  console.log("📝 DETAILED ISSUES:");
  console.log("");

  Object.entries(byFile).forEach(([file, fileIssues]) => {
    console.log(`\n${file}:`);
    fileIssues.forEach((issue) => {
      const icon = issue.severity === "error" ? "❌" : "⚠️";
      console.log(`  ${icon} Line ${issue.line}: ${issue.content}`);
    });
  });

  console.log("");
  console.log("💡 SUGGESTIONS:");
  console.log("");

  const uniqueTypes = [...new Set(issues.map((i) => i.type))];
  uniqueTypes.forEach((type) => {
    const suggestions = SUGGESTIONS[type] || [];
    if (suggestions.length > 0) {
      console.log(`\nFor '${type}' issues:`);
      suggestions.forEach((suggestion) => {
        console.log(`  • ${suggestion}`);
      });
    }
  });

  console.log("");
  console.log("═══════════════════════════════════════════════════════");
}

// ═══════════════════════════════════════════════════
// AUTO-FIX (BASIC)
// ═══════════════════════════════════════════════════

function autoFixFile(filePath: string, dryRun = true): number {
  try {
    let content = readFileSync(filePath, "utf-8");
    let fixes = 0;

    // Replace ': any' with ': unknown' in simple cases
    const anyMatches = content.match(/:\s*any\b(?!\[])/g);
    if (anyMatches) {
      fixes += anyMatches.length;
      content = content.replaceAll(/:\s*any\b(?!\[])/g, ": unknown");
    }

    if (fixes > 0 && !dryRun) {
      writeFileSync(filePath, content, "utf-8");
      console.log(`  ✓ Fixed ${fixes} issue(s) in ${filePath}`);
    }

    return fixes;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error);
    return 0;
  }
}

async function autoFix(dryRun = true): Promise<number> {
  const files = await glob("**/*.{ts,tsx}", { ignore: ["node_modules/**", ".next/**"] });
  let totalFixes = 0;

  console.log("═══════════════════════════════════════════════════════");
  console.log("  AUTO-FIX");
  console.log("═══════════════════════════════════════════════════════");
  console.log("");
  console.log(`Mode: ${dryRun ? "DRY RUN" : "LIVE"}`);
  console.log("");

  for (const file of files) {
    const fixes = autoFixFile(file, dryRun);
    totalFixes += fixes;
  }

  console.log("");
  console.log(`Total fixes applied: ${totalFixes}`);
  console.log("");

  if (dryRun) {
    console.log("⚠️  This was a dry run. Run with --fix to apply changes.");
  }

  return totalFixes;
}

// ═══════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2);
  const shouldFix = args.includes("--fix");
  const dryRun = !shouldFix;

  if (shouldFix) {
    await autoFix(false);
  } else {
    const issues = await scanProject();
    generateReport(issues);

    console.log("");
    console.log("To automatically fix some issues, run:");
    console.log("  pnpm tsx scripts/type-safety-audit.ts --fix");
  }
}

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1].replaceAll('\\', "/")}`;
if (isMainModule) {
  main();
}

export { autoFix, generateReport, scanFile, scanProject };
