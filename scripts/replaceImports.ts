import { glob } from "glob";
import fs from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const filename = fileURLToPath(import.meta.url);
const baseDirname = dirname(filename);
const repoRoot = resolve(baseDirname, "..");
const patterns = [
  { from: "@", to: "" },
  { from: "src/", to: "" },
  { from: "/components/ui", to: "ui" },
  { from: "/components", to: "components" },
  { from: "/lib", to: "lib" },
  { from: "/database", to: "database" },
];

// Order matters: longer matches first already arranged

const fileGlob = "**/*.{ts,tsx,js,jsx}";
const ignore = ["node_modules/**", ".next/**", "dist/**", "out/**", "scripts/replace-imports.ts"];

const files = glob.sync(fileGlob, { cwd: repoRoot, absolute: true, ignore });
let changed = 0;
files.forEach((file) => {
  let src = fs.readFileSync(file, "utf8");
  const original = src;
  patterns.forEach(({ from, to }) => {
    const re = new RegExp(from.replaceAll(/[$()*+./?[\\\]^{|}-]/g, "\\$&"), "g");
    src = src.replace(re, to);
  });
  if (src !== original) {
    fs.writeFileSync(file, src, "utf8");
    changed++;
    console.log(`Updated: ${relative(repoRoot, file)}`);
  }
});
console.log(`Completed. Files changed: ${changed}`);
// pnpm tsx scripts/replace-imports.ts
