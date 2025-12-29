#!/usr/bin/env tsx
/**
 * ComicWise - Package Analyzer & Cleanup
 * 
 * Analyzes package.json and identifies unused dependencies
 * Usage: pnpm tsx scripts/analyzePackages.ts [--remove] [--report]
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

interface PackageAnalysis {
  timestamp: string;
  total: {
    dependencies: number;
    devDependencies: number;
  };
  analysis: {
    name: string;
    version: string;
    type: "dependency" | "devDependency";
    potentiallyUnused: boolean;
    reason?: string;
  }[];
}

class PackageAnalyzer {
  private packageJsonPath = path.join(ROOT_DIR, "package.json");
  private srcDir = path.join(ROOT_DIR, "src");
  private analysis: PackageAnalysis = {
    timestamp: new Date().toISOString(),
    total: {
      dependencies: 0,
      devDependencies: 0,
    },
    analysis: [],
  };

  private log(message: string, type: "info" | "success" | "error" | "warn" = "info") {
    const colors = {
      info: chalk.blue,
      success: chalk.green,
      error: chalk.red,
      warn: chalk.yellow,
    };
    console.log(colors[type](message));
  }

  async analyze(): Promise<void> {
    this.log("Analyzing packages...\n");

    const packageJson = JSON.parse(
      fs.readFileSync(this.packageJsonPath, "utf-8")
    );

    const deps = packageJson.dependencies || {};
    const devDeps = packageJson.devDependencies || {};

    this.analysis.total.dependencies = Object.keys(deps).length;
    this.analysis.total.devDependencies = Object.keys(devDeps).length;

    this.log(`Found ${this.analysis.total.dependencies} dependencies`);
    this.log(`Found ${this.analysis.total.devDependencies} dev dependencies\n`);

    // Read all source code
    const sourceCode = this.readSourceCode();

    // Analyze dependencies
    for (const [name, version] of Object.entries(deps)) {
      const isUsed = this.isPackageUsed(name, sourceCode);
      if (!isUsed) {
        this.analysis.analysis.push({
          name,
          version: version as string,
          type: "dependency",
          potentiallyUnused: true,
          reason: "Not found in source code",
        });
        this.log(`⚠  Potentially unused: ${name}`, "warn");
      }
    }

    // Analyze dev dependencies
    for (const [name, version] of Object.entries(devDeps)) {
      const isUsed = this.isPackageUsed(name, sourceCode);
      const isScript = packageJson.scripts
        ? JSON.stringify(packageJson.scripts).includes(name)
        : false;

      if (!isUsed && !isScript) {
        this.analysis.analysis.push({
          name,
          version: version as string,
          type: "devDependency",
          potentiallyUnused: true,
          reason: "Not found in source code or scripts",
        });
        this.log(`⚠  Potentially unused (dev): ${name}`, "warn");
      }
    }

    this.log(
      `\nAnalysis complete. Found ${this.analysis.analysis.length} potentially unused packages`,
      "info"
    );
  }

  private readSourceCode(): string {
    let code = "";

    const scan = (dir: string, depth = 0) => {
      if (depth > 10 || dir.includes("node_modules")) return;

      try {
        const entries = fs.readdirSync(dir);

        for (const entry of entries) {
          const fullPath = path.join(dir, entry);
          const stat = fs.statSync(fullPath);

          if (
            stat.isFile() &&
            (entry.endsWith(".ts") ||
              entry.endsWith(".tsx") ||
              entry.endsWith(".js") ||
              entry.endsWith(".json"))
          ) {
            try {
              code += fs.readFileSync(fullPath, "utf-8") + "\n";
            } catch {
              // Skip unreadable files
            }
          } else if (stat.isDirectory()) {
            scan(fullPath, depth + 1);
          }
        }
      } catch {
        // Skip inaccessible directories
      }
    };

    scan(ROOT_DIR);
    return code;
  }

  private isPackageUsed(packageName: string, sourceCode: string): boolean {
    const patterns = [
      new RegExp(`import\\s+[^}]*\\bfrom\\s+['"]${packageName}['"]`, "i"),
      new RegExp(`require\\(['"]${packageName}['"]`, "i"),
      new RegExp(`from\\s+['"]${packageName}/`, "i"),
      new RegExp(`['"]${packageName}['"]:`, "i"), // package.json reference
    ];

    return patterns.some((pattern) => pattern.test(sourceCode));
  }

  async generateReport(): Promise<void> {
    const reportPath = path.join(
      ROOT_DIR,
      "reports",
      `package-analysis-${new Date().toISOString().slice(0, 10)}.json`
    );

    const reportsDir = path.dirname(reportPath);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    fs.writeFileSync(reportPath, JSON.stringify(this.analysis, null, 2));

    this.log(`Report saved: ${path.relative(ROOT_DIR, reportPath)}`, "success");
  }

  async run(): Promise<void> {
    console.log(chalk.cyan("═".repeat(60)));
    console.log(chalk.cyan("  ComicWise - Package Analysis"));
    console.log(chalk.cyan("═".repeat(60)) + "\n");

    try {
      await this.analyze();

      if (process.argv.includes("--report")) {
        await this.generateReport();
      }

      const summary = this.analysis.analysis.length;
      if (summary === 0) {
        this.log("\n✓ All packages appear to be in use", "success");
      } else {
        this.log(`\n⚠ Found ${summary} potentially unused packages`, "warn");
        this.log(
          "Note: Manual review recommended - some packages may be used indirectly",
          "info"
        );
      }
    } catch (error) {
      this.log(`Error: ${(error as any).message}`, "error");
      process.exit(1);
    }
  }
}

const analyzer = new PackageAnalyzer();
analyzer.run();
