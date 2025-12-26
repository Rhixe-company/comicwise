#!/usr/bin/env tsx
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FIX RENAMED FILES IMPORTS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This script fixes imports for files that were renamed to CamelCase
 */

import chalk from "chalk";
import { readFileSync, writeFileSync } from "fs";
import { globSync } from "glob";

console.log(chalk.cyan("\n╔══════════════════════════════════════════════════════════════╗"));
console.log(chalk.cyan("║          Fix Renamed Files Imports - ComicWise               ║"));
console.log(chalk.cyan("╚══════════════════════════════════════════════════════════════╝\n"));

const files = globSync("**/*.{ts,tsx}", {
  ignore: ["**/node_modules/**", "**/.next/**"],
});

console.log(chalk.blue(`📁 Found ${files.length} files to process\n`));

const renamedFiles: Array<[RegExp, string]> = [
  // Type definition files
  [/['"]\/types\/react-email-components['"]/g, '"/types/reactEmailComponents"'],
  [/['"]\/types\/react-dropzone['"]/g, '"/types/reactDropzone"'],
  [/['"]\/types\/prettier-plugin-organize-imports['"]/g, '"/types/prettierPluginOrganizeImports"'],
  [/['"]\/types\/input-otp['"]/g, '"/types/inputOtp"'],
  [/['"]\/types\database-relations['"]/g, '"/typesdatabaseRelations"'],
  [/['"]\/types\/app-config['"]/g, '"/types/appConfig"'],

  // Library files
  [/['"]\lib\/logger-enhanced['"]/g, '"lib/loggerEnhanced"'],
  [/['"]lib\/logger-enhanced['"]/g, '"lib/loggerEnhanced"'],

  // DAL files
  [/['"]\/dal\/sample-queries['"]/g, '"/dal/sampleQueries"'],
  [/['"]dal\/sample-queries['"]/g, '"dal/sampleQueries"'],
  [/['"]\/dal\/admin-comics['"]/g, '"/dal/adminComics"'],
  [/['"]dal\/admin-comics['"]/g, '"dal/adminComics"'],

  // Component files
  [/['"]\components\/layout\/site-header['"]/g, '"components/layout/SiteHeader"'],
  [/['"]layout\/site-header['"]/g, '"layout/SiteHeader"'],
  [/['"]\components\/home\/section-cards['"]/g, '"components/home/SectionCards"'],
  [/['"]\components\/sidebar\/nav-user['"]/g, '"components/sidebar/NavUser"'],
  [/['"]\components\/sidebar\/nav-secondary['"]/g, '"components/sidebar/NavSecondary"'],
  [/['"]\components\/sidebar\/nav-main['"]/g, '"components/sidebar/NavMain"'],
  [/['"]\components\/sidebar\/nav-documents['"]/g, '"components/sidebar/NavDocuments"'],
];

let filesModified = 0;
let totalReplacements = 0;

for (const file of files) {
  let content = readFileSync(file, "utf8");
  const originalContent = content;
  let fileReplacements = 0;

  for (const [pattern, replacement] of renamedFiles) {
    const matches = content.match(pattern);
    if (matches) {
      content = content.replace(pattern, replacement);
      fileReplacements += matches.length;
    }
  }

  if (content !== originalContent) {
    writeFileSync(file, content, "utf8");
    filesModified++;
    totalReplacements += fileReplacements;
    console.log(chalk.green(`✓ Fixed ${file} - ${fileReplacements} imports`));
  }
}

console.log(chalk.cyan("\n╔══════════════════════════════════════════════════════════════╗"));
console.log(chalk.cyan("║                        Summary                                ║"));
console.log(chalk.cyan("╚══════════════════════════════════════════════════════════════╝\n"));

console.log(chalk.yellow("Files processed:"), files.length);
console.log(chalk.yellow("Files modified:"), filesModified);
console.log(chalk.yellow("Total replacements:"), totalReplacements);

if (filesModified > 0) {
  console.log(chalk.green("\n✅ Import fixes complete!\n"));
} else {
  console.log(chalk.green("\n✅ No import fixes needed!\n"));
}

process.exit(0);
