// update-imports-to-aliases.ts
// Script to update all relative imports/exports to use tsconfig path aliases
// Usage: pnpm tsx update-imports-to-aliases.ts
import fs from "fs";
import { glob } from "glob";
import { dirname, relative, resolve } from "path";
import { fileURLToPath } from "url";

const filename: string = fileURLToPath(import.meta.url);
const baseDirname: string = dirname(filename);
const repoRoot: string = resolve(baseDirname);
const patterns: { from: string; to: string }[] = [
  { from: "lib", to: "lib" },
  { from: "hooks", to: "hooks" },
  { from: "types", to: "types" },
  { from: "database", to: "database" },
  { from: "database", to: "database" },
  { from: "database", to: "database" },
  { from: "database/schema", to: "database/schema" },
  { from: "services", to: "services" },
  { from: "stores", to: "stores" },
  { from: "ui", to: "ui" },
  { from: "actions", to: "actions" },
  { from: "utils", to: "utils" },
  { from: "auth", to: "auth" },
  { from: "styles", to: "styles" },
  { from: "assets", to: "assets" },
  { from: "appConfig", to: "appConfig" },
];

// Order matters: longer matches first already arranged

const fileGlob = "**/*.{ts,tsx,js,jsx}";
const ignore: string[] = [
  "node_modules/**",
  ".next/**",
  "dist/**",
  "out/**",
  // "update-imports-to-aliases.ts",
];

async function main() {
  const files: string[] = await glob(fileGlob, { cwd: repoRoot, absolute: true, ignore });
  let _changed: number = 0;
  for (const file of files) {
    let src: string = fs.readFileSync(file, "utf8");
    const original: string = src;
    patterns.forEach(({ from, to }: { from: string; to: string }): void => {
      const re = new RegExp(from.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "g");
      src = src.replace(re, to);
    });
    if (src !== original) {
      fs.writeFileSync(file, src, "utf8");
      _changed++;
      console.log(`✅ Updated imports/exports in ${relative(repoRoot, file)} to use path aliases.`);
    }
  }
  console.log("✅ All imports/exports updated to use path aliases.");
}

main().catch((err: any): never => {
  console.error(err);
  process.exit(1);
});
