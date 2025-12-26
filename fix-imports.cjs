#!/usr/bin/env node
/**
 * Quick Import Path Fixer
 * Simple Node.js script to fix all import paths
 */

const fs = require("fs");
const path = require("path");

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!file.startsWith(".") && file !== "node_modules") {
        getAllFiles(filePath, fileList);
      }
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const original = content;

  // Fix all import patterns
  content = content.replace(/from\s+(['"])ui\//g, "from $1@/components/ui/");
  content = content.replace(/from\s+(['"])components\//g, "from $1@/components/");
  content = content.replace(/from\s+(['"])database\//g, "from $1@/database/");
  content = content.replace(/from\s+(['"])lib\/validations/g, "from $1@/lib/validations");
  content = content.replace(/from\s+(['"])\/dto\//g, "from $1@/dto/");
  content = content.replace(/from\s+(['"])\/types\//g, "from $1@/types/");
  content = content.replace(/from\s+(['"])\/services\//g, "from $1@/services/");
  content = content.replace(/from\s+(['"])\/typesdatabase(['"])/g, "from $1@/types/database$2");

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    return true;
  }

  return false;
}

console.log("🔧 Fixing import paths...\n");

const files = getAllFiles("src");
let fixed = 0;

files.forEach((file) => {
  if (fixFile(file)) {
    console.log("✅", file.replace(process.cwd() + path.sep, ""));
    fixed++;
  }
});

console.log(`\n✨ Complete! Fixed ${fixed} files out of ${files.length} total`);
