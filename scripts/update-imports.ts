#!/usr/bin/env node
/**
 * scripts/update-imports.ts
 * Delegates to update-imports-to-aliases for consistent import alias updates.
 * This is a convenience alias to the main update script.
 * Usage: pnpm tsx scripts/update-imports.ts
 */
import { execSync } from "child_process";
import path from "path";

const repoRoot = path.resolve(process.cwd());
const mainScript = path.join(repoRoot, "scripts", "update-imports-to-aliases.ts");

try {
  execSync(`tsx "${mainScript}"`, {
    cwd: process.cwd(),
    stdio: "inherit",
  });
} catch {
  process.exit(1);
}
