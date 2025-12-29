#!/usr/bin/env tsx
/**
 * Comprehensive Import Path Fixer
 * Fixes all import paths to use proper @ aliases
 */

import fs from "fs-extra";
import { glob } from "glob";
import path from "path";

const ROOT_DIR = process.cwd();

// Import mapping rules
const importMappings = [
  // App config
  { from: /from ["']app-config["']/g, to: `from "@/appConfig"` },
  { from: /from ["']appConfig["']/g, to: `from "@/appConfig"` },

  // Components
  { from: /from ["']components\/auth["']/g, to: `from "@/components/auth"` },
  { from: /from ["']ui\//g, to: `from "@/components/ui/` },

  // DTO
  { from: /from "(\/)?dto\//g, to: `from "@/dto/` },

  // Lib
  { from: /from "lib\/validations["']/g, to: `from "@/lib/validations"` },
  { from: /from ["']lib\//g, to: `from "@/lib/` },

  // Schema
  { from: /from "schema["']/g, to: `from "@/database/schema"` },

  // Database
  { from: /from ["'](\/)?database\//g, to: `from "@/database/` },

  // Services
  { from: /from "(\/)?services\//g, to: `from "@/services/` },

  // Eslint imports
  { from: /from "eslint\/css["']/g, to: `from "@eslint/css"` },
  { from: /from ["']eslint\/js["']/g, to: `from "@eslint/js"` },
  { from: /from ["']eslint\/json["']/g, to: `from "@eslint/json"` },
  { from: /from ["']eslint\/markdown["']/g, to: `from "@eslint/markdown"` },
  { from: /from ["']next\/eslint-plugin-next["']/g, to: `from "@next/eslint-plugin-next"` },

  // Playwright
  { from: /from ["']playwright\/test["']/g, to: `from "@playwright/test"` },
];

async function fixImports(filePath: string): Promise<number> {
  let content = await fs.readFile(filePath, "utf-8");
  let changes = 0;

  for (const { from, to } of importMappings) {
    const matches = content.match(from);
    if (matches) {
      content = content.replace(from, to);
      changes += matches.length;
    }
  }

  if (changes > 0) {
    await fs.writeFile(filePath, content);
  }

  return changes;
}

async function main() {
  console.log("🔧 Fixing import paths...\n");

  const files = await glob("**/*.{ts,tsx}", {
    cwd: ROOT_DIR,
    ignore: ["node_modules/**", ".next/**", "dist/**", "build/**"],
    absolute: true,
  });

  let totalChanges = 0;
  let filesModified = 0;

  for (const file of files) {
    const changes = await fixImports(file);
    if (changes > 0) {
      filesModified++;
      totalChanges += changes;
      console.log(`✓ ${path.relative(ROOT_DIR, file)} (${changes} changes)`);
    }
  }

  console.log(`\n✅ Fixed ${totalChanges} imports in ${filesModified} files`);
}

main().catch(console.error);
