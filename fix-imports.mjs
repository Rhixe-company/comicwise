#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const patterns = [
  [/from\s+['"]actions\//g, 'from "@/lib/actions/'],
  [/from\s+['"]components\//g, 'from "@/components/'],
  [/from\s+['"]database\//g, 'from "@/database/'],
  [/from\s+['"]hooks\//g, 'from "@/hooks/'],
  [/from\s+['"]lib\//g, 'from "@/lib/'],
  [/from\s+['"]services\//g, 'from "@/services/'],
  [/from\s+['"]stores\//g, 'from "@/stores/'],
  [/from\s+['"]types\//g, 'from "@/types/'],
  [/from\s+['"]appConfig['"];/g, 'from "@/app-config";'],
  [/from\s+['"]database['"];/g, 'from "@/database";'],
];

function walkDir(dir, ext) {
  let files = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    if (['.', '..', 'node_modules', '.next', 'dist', 'build'].includes(item)) continue;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(walkDir(fullPath, ext));
    } else if (ext.some(e => item.endsWith(e))) {
      files.push(fullPath);
    }
  }
  return files;
}

const srcDir = path.join(process.cwd(), 'src');
const files = walkDir(srcDir, ['.ts', '.tsx']);

let fixed = 0;
let errors = 0;

for (const file of files) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    
    for (const [regex, replacement] of patterns) {
      content = content.replace(regex, replacement);
    }
    
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      fixed++;
      console.log(`Fixed: ${path.relative(process.cwd(), file)}`);
    }
  } catch (err) {
    errors++;
    console.error(`Error processing ${file}:`, err.message);
  }
}

console.log(`\nSummary: Fixed ${fixed} files, ${errors} errors`);
process.exit(errors > 0 ? 1 : 0);
