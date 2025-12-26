#!/usr/bin/env tsx
/**
 * Fix All Type-Check and Lint Errors Script
 * - Runs type-check and captures errors
 * - Automatically fixes common issues
 * - Runs lint --fix
 * - Generates report
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const projectRoot = process.cwd();

console.log("🔧 Starting Automated Error Fixing...\n");

// Step 1: Fix ActionResponse type issues
console.log("📝 Step 1: Fixing ActionResponse type exports...");
fixActionResponseType();

// Step 2: Fix auth-form useState issue
console.log("📝 Step 2: Fixing auth-form useState import...");
fixAuthFormUseState();

// Step 3: Fix database adapter issue
console.log("📝 Step 4: Running ESLint fix...");
runEslintFix();

console.log("📝 Step 5: Running type-check...");
runTypeCheck();

console.log("\n✅ Error fixing process completed!");
console.log("💡 Review the output above for any remaining manual fixes needed.");

function fixActionResponseType() {
  const typesIndexPath = path.join(projectRoot, "src", "types", "index.ts");

  if (!fs.existsSync(typesIndexPath)) {
    console.log("  ⚠️  types/index.ts not found, skipping...");
    return;
  }

  let content = fs.readFileSync(typesIndexPath, "utf-8");

  // Add ActionResponse export if not present
  if (!content.includes("export interface ActionResponse")) {
    const actionResponseType = `
/**
 * Standard response type for server actions
 */
export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  errors?: Record<string, string[]>;
}
`;
    content = actionResponseType + "\n" + content;
    fs.writeFileSync(typesIndexPath, content, "utf-8");
    console.log("  ✓ Added ActionResponse type to types/index.ts");
  } else {
    console.log("  ✓ ActionResponse type already exists");
  }
}

function fixAuthFormUseState() {
  const authFormPath = path.join(projectRoot, "src", "components", "auth", "auth-form.tsx");

  if (!fs.existsSync(authFormPath)) {
    console.log("  ⚠️  auth-form.tsx not found, skipping...");
    return;
  }

  let content = fs.readFileSync(authFormPath, "utf-8");

  // Check if useState is imported
  if (
    !content.includes("import { useState }") &&
    !content.includes("import { useForm, useState }")
  ) {
    // Find the react import line and add useState
    if (content.includes("import { useForm }")) {
      content = content.replace(
        "import { useForm }",
        'import { useState } from "react";\nimport { useForm }'
      );
    } else if (content.includes("import React")) {
      content = content.replace("import React", "import React, { useState }");
    } else {
      // Add at the top after "use client"
      const useClientIndex = content.indexOf('"use client"');
      if (useClientIndex !== -1) {
        const insertPos = content.indexOf("\n", useClientIndex) + 1;
        content =
          content.slice(0, insertPos) +
          'import { useState } from "react";\n' +
          content.slice(insertPos);
      }
    }

    fs.writeFileSync(authFormPath, content, "utf-8");
    console.log("  ✓ Fixed useState import in auth-form.tsx");
  } else {
    console.log("  ✓ useState is already imported");
  }
}

function fixDatabaseAdapter() {
  const dbPath = path.join(projectRoot, "src", "database", "db.ts");

  if (!fs.existsSync(dbPath)) {
    console.log("  ⚠️  db.ts not found, skipping...");
    return;
  }

  let content = fs.readFileSync(dbPath, "utf-8");

  // Ensure database export doesn't include .db property
  if (content.includes("export { database }") && content.includes("database.db")) {
    content = content.replace(database.db / g, "database");
    fs.writeFileSync(dbPath, content, "utf-8");
    console.log("  ✓ Fixed database.db reference");
  } else {
    console.log("  ✓ Database exports look correct");
  }
}

function runEslintFix() {
  try {
    execSync("pnpm lint:fix", {
      cwd: projectRoot,
      stdio: "inherit",
    });
    console.log("  ✓ ESLint fix completed");
  } catch (error) {
    console.log("  ⚠️  ESLint fix completed with warnings");
  }
}

function runTypeCheck() {
  try {
    execSync("pnpm type-check", {
      cwd: projectRoot,
      stdio: "inherit",
    });
    console.log("  ✓ Type-check passed");
  } catch (error) {
    console.log("  ⚠️  Type-check found errors (see output above)");
  }
}
