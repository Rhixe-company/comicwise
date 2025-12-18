#!/usr/bin/env node
/*
 * scripts/update-imports-to-aliases.ts
 * Rewrites relative imports that point into `src/` to use path aliases.
 * Uses ts-morph to safely rewrite import & export module specifiers via AST.
 * Usage: pnpm tsx scripts/update-imports-to-aliases.ts
 */
import { globby } from "globby";
import path from "path";
import { Project } from "ts-morph";

const repoRoot = path.resolve(process.cwd());
const sourceRoot = path.join(repoRoot, "src");

function normalizeSlashes(string_: string): string {
  return string_.replaceAll("\\", "/");
}

function processModuleSpec(filePath: string, moduleSpec: string | undefined): string | null {
  if (!moduleSpec?.startsWith(".")) return null;

  const resolved = path.resolve(path.dirname(filePath), moduleSpec);
  if (!resolved.startsWith(sourceRoot)) return null;

  const relativeToSource = normalizeSlashes(path.relative(sourceRoot, resolved));
  return `src/${relativeToSource}`;
}

async function main() {
  const project = new Project({ tsConfigFilePath: path.join(repoRoot, "tsconfig.json") });
  const files = await globby(["src/**/*.{ts,tsx,js,jsx,mts,cts}"], {
    gitignore: true,
    cwd: repoRoot,
    absolute: true,
  });

  let updatedCount = 0;

  for (const filePath of files) {
    const sourceFile = project.addSourceFileAtPathIfExists(filePath);
    if (!sourceFile) continue;

    let changed = false;

    sourceFile.getImportDeclarations().forEach((imp) => {
      const newSpec = processModuleSpec(filePath, imp.getModuleSpecifierValue());
      if (newSpec) {
        imp.setModuleSpecifier(newSpec);
        changed = true;
      }
    });

    sourceFile.getExportDeclarations().forEach((exp) => {
      const newSpec = processModuleSpec(filePath, exp.getModuleSpecifierValue());
      if (newSpec) {
        exp.setModuleSpecifier(newSpec);
        changed = true;
      }
    });

    if (changed) {
      await sourceFile.save();
      updatedCount++;
      console.log(`✓ ${path.relative(repoRoot, filePath)}`);
    }
  }

  console.log(`\nDone! Updated ${updatedCount} file(s).`);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
