import fs from "fs";
import { glob } from "glob";
import { dirname, relative, resolve } from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const baseDirname = dirname(filename);
const repoRoot = resolve(baseDirname, "..");
const patterns = [{ from: "", to: "" }];

// Order matters: longer matches first already arranged

const fileGlob = "**/*.{ts,tsx,js,jsx}";
const ignore = ["node_modules/**", ".next/**", "dist/**", "out/**"];

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
