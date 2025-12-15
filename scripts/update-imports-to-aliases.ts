#!/usr/bin/env node
/*
 * scripts/update-imports-to-aliases.ts
 * Rewrites relative imports that point into `src/` to use the `src/...` path alias.
 * Uses ts-morph to safely rewrite import & export module specifiers.
 * Usage: pnpm tsx scripts/update-imports-to-aliases.ts
 */
import { globby } from "globby";
import path from "path";
import { Project } from "ts-morph";

const repoRoot = path.resolve(process.cwd());
const srcRoot = path.join(repoRoot, "src");

async function main() {
  const project = new Project({ tsConfigFilePath: path.join(repoRoot, "tsconfig.json") });
  const files = await globby(["src/**/*.{ts,tsx,js,jsx,mts,cts}"], {
    gitignore: true,
    cwd: repoRoot,
    absolute: true,
  });

  for (const filePath of files) {
    const sourceFile = project.addSourceFileAtPathIfExists(filePath);
    if (!sourceFile) continue;

    let changed = false;

    // Update import declarations
    sourceFile.getImportDeclarations().forEach((imp) => {
      const moduleSpec = imp.getModuleSpecifierValue();
      if (!moduleSpec?.startsWith(".")) return;
      const resolved = path.resolve(path.dirname(filePath), moduleSpec);
      if (resolved.startsWith(srcRoot)) {
        const relToSrc = path.relative(srcRoot, resolved).replaceAll("\\\\", "/");
        const newSpecifier = `src/${relToSrc}`;
        imp.setModuleSpecifier(newSpecifier);
        changed = true;
      }
    });

    // Update export declarations
    sourceFile.getExportDeclarations().forEach((exp) => {
      const moduleSpec = exp.getModuleSpecifierValue();
      if (!moduleSpec?.startsWith(".")) return;
      const resolved = path.resolve(path.dirname(filePath), moduleSpec);
      if (resolved.startsWith(srcRoot)) {
        const relToSrc = path.relative(srcRoot, resolved).replaceAll("\\\\", "/");
        const newSpecifier = `src/${relToSrc}`;
        exp.setModuleSpecifier(newSpecifier);
        changed = true;
      }
    });

    if (changed) {
      await sourceFile.save();
      console.log(`Updated imports in ${path.relative(repoRoot, filePath)}`);
    }
  }

  console.log("Done updating imports to use src/ aliases where applicable.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
