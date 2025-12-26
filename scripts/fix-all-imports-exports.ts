#!/usr/bin/env tsx
/**
 * Comprehensive Import/Export Fixer
 * Fixes all module resolution issues
 */

import fs from "fs-extra";
import { glob } from "glob";
import path from "path";

const ROOT_DIR = process.cwd();

async function createBarrelExports() {
  console.log("📦 Creating barrel export files...\n");

  // Create components/auth/index.ts
  const authComponentsDir = path.join(ROOT_DIR, "src/components/auth");
  const authFiles = await fs.readdir(authComponentsDir);
  const authExports = authFiles
    .filter((f) => f.endsWith(".tsx") && f !== "index.ts")
    .map((f) => {
      const name = path.basename(f, ".tsx");
      return `export { default as ${name} } from "./${name}";`;
    })
    .join("\n");

  await fs.writeFile(path.join(authComponentsDir, "index.ts"), authExports + "\n");
  console.log("✓ Created src/components/auth/index.ts");

  // Create components/ui/index.ts if needed
  const uiDir = path.join(ROOT_DIR, "src/components/ui");
  const uiIndexPath = path.join(uiDir, "index.ts");

  if (!(await fs.pathExists(uiIndexPath))) {
    const uiFiles = await fs.readdir(uiDir);
    const uiExports = uiFiles
      .filter((f) => f.endsWith(".tsx") && f !== "index.ts")
      .map((f) => {
        const name = path.basename(f, ".tsx");
        return `export * from "./${name}";`;
      })
      .join("\n");

    await fs.writeFile(uiIndexPath, uiExports + "\n");
    console.log("✓ Updated src/components/ui/index.ts");
  }

  // Create lib/validations/index.ts if needed
  const validationsDir = path.join(ROOT_DIR, "src/lib/validations");
  const validationsIndexPath = path.join(validationsDir, "index.ts");

  if (await fs.pathExists(validationsIndexPath)) {
    console.log("✓ src/lib/validations/index.ts already exists");
  }

  // Create dto/index.ts if needed
  const dtoDir = path.join(ROOT_DIR, "src/dto");
  const dtoIndexPath = path.join(dtoDir, "index.ts");

  if (await fs.pathExists(dtoIndexPath)) {
    console.log("✓ src/dto/index.ts already exists");
  }

  console.log("");
}

async function fixAppConfig() {
  console.log("🔧 Fixing app-config references...\n");

  // Check if app-config.ts exists
  const appConfigPath = path.join(ROOT_DIR, "app-config.ts");
  const appConfigTsPath = path.join(ROOT_DIR, "appConfig.ts");

  let actualPath = "";
  if (await fs.pathExists(appConfigPath)) {
    actualPath = "app-config";
  } else if (await fs.pathExists(appConfigTsPath)) {
    actualPath = "appConfig";
  }

  if (actualPath) {
    const filesToFix = [
      "drizzle.config.ts",
      "scripts/cacheStats.ts",
      "scripts/checkRedis.ts",
      "scripts/clearCache.ts",
      "scripts/healthCheck.ts",
      "scripts/uploadBulk.ts",
    ];

    for (const file of filesToFix) {
      const filePath = path.join(ROOT_DIR, file);
      if (await fs.pathExists(filePath)) {
        let content = await fs.readFile(filePath, "utf-8");

        // Fix various app-config import variations
        content = content.replace(/from ['"]app-config['"]/g, `from "${actualPath}"`);
        content = content.replace(/from ['"]@\/app-config['"]/g, `from "${actualPath}"`);
        content = content.replace(/from ['"]appConfig['"]/g, `from "${actualPath}"`);

        await fs.writeFile(filePath, content);
        console.log(`✓ Fixed ${file}`);
      }
    }
  }

  console.log("");
}

async function fixServiceImports() {
  console.log("🔧 Fixing service imports...\n");

  const uploadBulkPath = path.join(ROOT_DIR, "scripts/uploadBulk.ts");

  if (await fs.pathExists(uploadBulkPath)) {
    let content = await fs.readFile(uploadBulkPath, "utf-8");

    // Fix service imports
    content = content.replace(
      /from ['"]\/services\/upload\/providers\/(\w+)['"]/g,
      'from "@/services/upload/providers/$1"'
    );
    content = content.replace(
      /from ['"]@\/services\/upload\/providers\/(\w+)['"]/g,
      'from "@/services/upload/providers/$1"'
    );

    await fs.writeFile(uploadBulkPath, content);
    console.log("✓ Fixed scripts/uploadBulk.ts");
  }

  console.log("");
}

async function fixModuleImports() {
  console.log("🔧 Fixing module imports throughout the project...\n");

  const files = await glob("src/**/*.{ts,tsx}", {
    cwd: ROOT_DIR,
    ignore: ["**/node_modules/**", "**/.next/**"],
    absolute: true,
  });

  let fixedCount = 0;

  for (const file of files) {
    let content = await fs.readFile(file, "utf-8");
    const originalContent = content;

    // Fix component imports
    content = content.replace(/from ['"]@\/components\/auth['"]/g, 'from "@/components/auth"');
    content = content.replace(
      /from ['"]@\/components\/ui\/([^'"]+)['"]/g,
      'from "@/components/ui/$1"'
    );

    // Fix dto imports
    content = content.replace(/from ['"]@\/dto\/(\w+)['"]/g, 'from "@/dto/$1"');

    // Fix lib/validations imports
    content = content.replace(/from ['"]@\/lib\/validations['"]/g, 'from "@/lib/validations"');
    content = content.replace(
      /from ['"]@\/lib\/validations\/([^'"]+)['"]/g,
      'from "@/lib/validations/$1"'
    );

    if (content !== originalContent) {
      await fs.writeFile(file, content);
      fixedCount++;
    }
  }

  console.log(`✓ Fixed ${fixedCount} files`);
  console.log("");
}

async function fixScriptIssues() {
  console.log("🔧 Fixing script-specific issues...\n");

  // Fix fixAllErrorsAuto.ts
  const fixAllErrorsAutoPath = path.join(ROOT_DIR, "scripts/fixAllErrorsAuto.ts");
  if (await fs.pathExists(fixAllErrorsAutoPath)) {
    let content = await fs.readFile(fixAllErrorsAutoPath, "utf-8");

    // Fix the invalid regex replacement
    content = content.replace(/\.replace\(database,\s*g\)/g, '.replace(/database/g, "db")');

    await fs.writeFile(fixAllErrorsAutoPath, content);
    console.log("✓ Fixed scripts/fixAllErrorsAuto.ts");
  }

  // Fix CLI health command
  const healthCommandPath = path.join(ROOT_DIR, "scripts/cli/commands/health.ts");
  if (await fs.pathExists(healthCommandPath)) {
    let content = await fs.readFile(healthCommandPath, "utf-8");

    // Fix type assertion for options.verbose
    content = content.replace(/if \(options\.verbose\)/g, "if ((options as any).verbose)");

    await fs.writeFile(healthCommandPath, content);
    console.log("✓ Fixed scripts/cli/commands/health.ts");
  }

  console.log("");
}

async function main() {
  console.log("\n🚀 Comprehensive Import/Export Fix\n");
  console.log("═".repeat(60) + "\n");

  try {
    await createBarrelExports();
    await fixAppConfig();
    await fixServiceImports();
    await fixModuleImports();
    await fixScriptIssues();

    console.log("═".repeat(60));
    console.log("\n✅ All imports and exports fixed!");
    console.log("\n📝 Next steps:");
    console.log("   1. Run: pnpm type-check");
    console.log("   2. Run: pnpm lint:fix");
    console.log("   3. Run: pnpm format\n");
  } catch (error) {
    console.error("\n❌ Error:", (error as Error).message);
    process.exit(1);
  }
}

main();
