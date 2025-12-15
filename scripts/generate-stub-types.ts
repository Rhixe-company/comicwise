import fs from "fs/promises";
import path from "path";

async function exists(p: string) {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

function safeFilename(pkgName: string) {
  return pkgName.replace(/^@/, "").replace(/\//g, "__");
}

async function hasBundledTypes(packageDir: string) {
  const pkgJsonPath = path.join(packageDir, "package.json");
  if (!(await exists(pkgJsonPath))) return false;
  try {
    const pj = JSON.parse(await fs.readFile(pkgJsonPath, "utf8"));
    if (pj.types || pj.typings) return true;
  } catch {
    void 0;
  }
  // quick scan for any .d.ts files at package root
  try {
    const files = await fs.readdir(packageDir);
    if (files.some((f) => f.endsWith(".d.ts"))) return true;
  } catch {
    void 0;
  }
  return false;
}

async function main() {
  const root = process.cwd();
  const pkgJsonPath = path.join(root, "package.json");
  if (!(await exists(pkgJsonPath))) {
    console.error("package.json not found in", root);
    process.exit(1);
  }

  const pj = JSON.parse(await fs.readFile(pkgJsonPath, "utf8"));
  const deps = Object.assign({}, pj.dependencies || {}, pj.devDependencies || {});
  const names = Object.keys(deps).sort();

  const outDir = path.join(root, "src", "types");
  await fs.mkdir(outDir, { recursive: true });

  const generated: string[] = [];
  const hasTypesInstalled: string[] = [];
  const skipped: string[] = [];

  for (const name of names) {
    // ignore types packages themselves
    if (name.startsWith("@types/")) {
      hasTypesInstalled.push(name);
      continue;
    }

    const packageDir = path.join(root, "node_modules", name);
    const typesName = safeFilename(name);
    const typesPackageDir = path.join(root, "node_modules", "@types", typesName);

    const bundled = await hasBundledTypes(packageDir);
    const hasTypesPkg = await exists(typesPackageDir);

    if (bundled || hasTypesPkg) {
      skipped.push(name);
      continue;
    }

    // create stub
    const fileName = safeFilename(name) + ".d.ts";
    const filePath = path.join(outDir, fileName);
    const content =
      `// AUTO-GENERATED STUB TYPES for ${name}\n// This file is intentionally minimal: it declares the module with ` +
      "any" +
      ` to satisfy TypeScript.\ndeclare module "${name}" {\n  const value: any;\n  export default value;\n  export const __any: any;\n  export function __call(...args: any[]): any;\n}\n`;
    await fs.writeFile(filePath, content, "utf8");
    generated.push(name);
  }

  // create index.d.ts referencing all stubs
  const indexPath = path.join(outDir, "index.d.ts");
  const refLines = generated.map((n) => `/// <reference path="./${safeFilename(n)}.d.ts" />`);
  const indexContent = `// AUTO-GENERATED index for local stub types\n${refLines.join("\n")}\nexport {};\n`;
  await fs.writeFile(indexPath, indexContent, "utf8");

  console.log("Types generation complete. Summary:");
  console.log("- generated stubs:", generated.length);
  if (generated.length) console.log("  ", generated.join(", "));
  console.log("- skipped (bundled or @types present):", skipped.length);
  if (skipped.length) console.log("  ", skipped.join(", "));
  if (hasTypesInstalled.length) {
    console.log("- @types packages (already present):", hasTypesInstalled.length);
    console.log("  ", hasTypesInstalled.join(", "));
  }

  console.log("\nNext steps:");
  console.log(
    "- Run `pnpm install` to ensure `node_modules` is present before rerunning this script."
  );
  console.log(
    "- If a package has a matching `@types/*`, consider installing it instead of using a stub."
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
