#!/usr/bin/env tsx
/**
 * ComicWise - Performance & Security Analysis Script
 * 
 * Analyzes the project for:
 * - Performance bottlenecks
 * - Security vulnerabilities
 * - Code quality issues
 * 
 * Usage: pnpm tsx scripts/analyzeProject.ts [--deep] [--export]
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

interface AnalysisReport {
  timestamp: string;
  summary: {
    performanceIssues: number;
    securityIssues: number;
    codeQualityIssues: number;
    totalIssues: number;
  };
  performance: Array<{
    category: string;
    severity: "critical" | "high" | "medium" | "low";
    issue: string;
    recommendation: string;
    files?: string[];
  }>;
  security: Array<{
    category: string;
    severity: "critical" | "high" | "medium" | "low";
    issue: string;
    recommendation: string;
    files?: string[];
  }>;
  codeQuality: Array<{
    category: string;
    severity: "critical" | "high" | "medium" | "low";
    issue: string;
    recommendation: string;
    files?: string[];
  }>;
}

class ProjectAnalyzer {
  private report: AnalysisReport = {
    timestamp: new Date().toISOString(),
    summary: {
      performanceIssues: 0,
      securityIssues: 0,
      codeQualityIssues: 0,
      totalIssues: 0,
    },
    performance: [],
    security: [],
    codeQuality: [],
  };

  private log(message: string, type: "info" | "success" | "warn" | "error" = "info") {
    const colors = {
      info: chalk.blue,
      success: chalk.green,
      warn: chalk.yellow,
      error: chalk.red,
    };
    console.log(colors[type](message));
  }

  async analyzePerformance(): Promise<void> {
    this.log("\n▶ Analyzing Performance...");

    // Check bundle size
    const nextDir = path.join(ROOT_DIR, ".next");
    if (fs.existsSync(nextDir)) {
      const bundleSize = this.getDirSize(nextDir);
      if (bundleSize > 500 * 1024 * 1024) {
        // > 500MB
        this.addPerformanceIssue(
          "Bundle Size",
          "critical",
          "Next.js build is larger than 500MB",
          "Run `pnpm build:analyze` to identify large dependencies",
          [".next"]
        );
      }
    }

    // Check for large files
    this.log("  Scanning for large files...");
    const largeFiles = this.findLargeFiles(ROOT_DIR, 5 * 1024 * 1024); // > 5MB
    if (largeFiles.length > 0) {
      this.addPerformanceIssue(
        "Large Files",
        "medium",
        `Found ${largeFiles.length} files larger than 5MB`,
        "Consider optimizing or splitting large files",
        largeFiles.slice(0, 5)
      );
    }

    // Check for unoptimized images
    const imageFiles = this.findFiles(ROOT_DIR, /\.(png|jpg|jpeg)$/i, ["public"]);
    if (imageFiles.length > 20) {
      this.addPerformanceIssue(
        "Unoptimized Images",
        "low",
        `Found ${imageFiles.length} unoptimized image files`,
        "Use WebP format and optimize images with sharp or ImageKit",
        imageFiles.slice(0, 5)
      );
    }

    this.log("  ✓ Performance analysis complete");
  }

  async analyzeSecurity(): Promise<void> {
    this.log("\n▶ Analyzing Security...");

    // Check for hardcoded secrets
    this.log("  Scanning for hardcoded secrets...");
    const secretPatterns = [
      /password\s*=\s*["'](.*?)["']/gi,
      /api[_-]?key\s*=\s*["'](.*?)["']/gi,
      /token\s*=\s*["'](.*?)["']/gi,
      /secret\s*=\s*["'](.*?)["']/gi,
    ];

    const tsFiles = this.findFiles(ROOT_DIR, /\.(ts|tsx)$/);
    const foundSecrets: string[] = [];

    for (const file of tsFiles.slice(0, 50)) {
      try {
        const content = fs.readFileSync(file, "utf-8");
        for (const pattern of secretPatterns) {
          if (pattern.test(content) && !file.includes("appConfig.ts")) {
            foundSecrets.push(file);
            break;
          }
        }
      } catch {
        // Skip unreadable files
      }
    }

    if (foundSecrets.length > 0) {
      this.addSecurityIssue(
        "Hardcoded Secrets",
        "critical",
        `Found potential hardcoded secrets in ${foundSecrets.length} files`,
        "Use environment variables instead of hardcoded values",
        foundSecrets.slice(0, 5)
      );
    }

    // Check .env.local is gitignored
    const gitignore = path.join(ROOT_DIR, ".gitignore");
    if (fs.existsSync(gitignore)) {
      const content = fs.readFileSync(gitignore, "utf-8");
      if (!content.includes(".env.local")) {
        this.addSecurityIssue(
          "Environment Files",
          "high",
          ".env.local is not in .gitignore",
          "Add .env.local to .gitignore to prevent accidental commits",
          [gitignore]
        );
      }
    }

    // Check for console.logs in production code
    this.log("  Scanning for console statements...");
    let consoleLogs = 0;
    for (const file of tsFiles.slice(0, 100)) {
      try {
        const content = fs.readFileSync(file, "utf-8");
        const matches = content.match(/console\.(log|error|warn|debug)/g);
        if (matches && !file.includes(".test.") && !file.includes("logger")) {
          consoleLogs += matches.length;
        }
      } catch {
        // Skip unreadable files
      }
    }

    if (consoleLogs > 10) {
      this.addSecurityIssue(
        "Console Statements",
        "low",
        `Found ${consoleLogs} console statements in production code`,
        "Remove debug console logs before deployment",
        []
      );
    }

    this.log("  ✓ Security analysis complete");
  }

  async analyzeCodeQuality(): Promise<void> {
    this.log("\n▶ Analyzing Code Quality...");

    // Check TypeScript strict mode
    const tsconfig = path.join(ROOT_DIR, "tsconfig.json");
    if (fs.existsSync(tsconfig)) {
      const config = JSON.parse(fs.readFileSync(tsconfig, "utf-8"));
      const compilerOptions = config.compilerOptions || {};

      if (!compilerOptions.strict) {
        this.addCodeQualityIssue(
          "TypeScript Configuration",
          "high",
          "TypeScript strict mode is not enabled",
          "Set `compilerOptions.strict: true` in tsconfig.json",
          [tsconfig]
        );
      }
    }

    // Check for any types
    this.log("  Scanning for 'any' types...");
    const tsFiles = this.findFiles(ROOT_DIR, /\.(ts|tsx)$/);
    let anyCount = 0;

    for (const file of tsFiles.slice(0, 50)) {
      try {
        const content = fs.readFileSync(file, "utf-8");
        const matches = content.match(/:\s*any\b/g);
        if (matches && !file.includes(".test.")) {
          anyCount += matches.length;
        }
      } catch {
        // Skip unreadable files
      }
    }

    if (anyCount > 10) {
      this.addCodeQualityIssue(
        "Type Safety",
        "medium",
        `Found ${anyCount} uses of 'any' type in TypeScript files`,
        "Replace 'any' with proper types for better type safety",
        []
      );
    }

    // Check for unused imports
    this.log("  Scanning for unused code patterns...");
    const unusedPatterns = [
      /^import.*from\s+["'][^"']*["'];\s*\/\s*unused/gm,
      /const\s+\w+\s*=\s*.*;\s*\/\s*unused/gm,
    ];

    let unusedCount = 0;
    for (const file of tsFiles.slice(0, 30)) {
      try {
        const content = fs.readFileSync(file, "utf-8");
        for (const pattern of unusedPatterns) {
          const matches = content.match(pattern);
          if (matches) {
            unusedCount += matches.length;
          }
        }
      } catch {
        // Skip unreadable files
      }
    }

    if (unusedCount > 0) {
      this.addCodeQualityIssue(
        "Unused Code",
        "low",
        `Found ${unusedCount} potentially unused code patterns`,
        "Remove unused imports and variables to reduce bundle size",
        []
      );
    }

    this.log("  ✓ Code quality analysis complete");
  }

  private findFiles(dir: string, pattern: RegExp, includeOnly?: string[]): string[] {
    const files: string[] = [];

    const scan = (currentDir: string, depth = 0) => {
      if (depth > 5 || currentDir.includes("node_modules")) return;

      try {
        const entries = fs.readdirSync(currentDir);

        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry);
          const stat = fs.statSync(fullPath);

          if (includeOnly && !includeOnly.some((inc) => fullPath.includes(inc))) {
            continue;
          }

          if (stat.isFile() && pattern.test(fullPath)) {
            files.push(fullPath);
          } else if (stat.isDirectory()) {
            scan(fullPath, depth + 1);
          }
        }
      } catch {
        // Skip inaccessible directories
      }
    };

    scan(dir);
    return files;
  }

  private findLargeFiles(dir: string, threshold: number): string[] {
    const files: string[] = [];

    const scan = (currentDir: string) => {
      if (currentDir.includes("node_modules")) return;

      try {
        const entries = fs.readdirSync(currentDir);

        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry);
          const stat = fs.statSync(fullPath);

          if (stat.isFile() && stat.size > threshold) {
            files.push(fullPath);
          } else if (stat.isDirectory()) {
            scan(fullPath);
          }
        }
      } catch {
        // Skip inaccessible directories
      }
    };

    scan(dir);
    return files;
  }

  private getDirSize(dir: string): number {
    let size = 0;

    try {
      const entries = fs.readdirSync(dir);

      for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);

        if (stat.isFile()) {
          size += stat.size;
        } else if (stat.isDirectory()) {
          size += this.getDirSize(fullPath);
        }
      }
    } catch {
      // Skip inaccessible directories
    }

    return size;
  }

  private addPerformanceIssue(
    category: string,
    severity: "critical" | "high" | "medium" | "low",
    issue: string,
    recommendation: string,
    files?: string[]
  ) {
    this.report.performance.push({
      category,
      severity,
      issue,
      recommendation,
      files,
    });
    this.report.summary.performanceIssues++;
  }

  private addSecurityIssue(
    category: string,
    severity: "critical" | "high" | "medium" | "low",
    issue: string,
    recommendation: string,
    files?: string[]
  ) {
    this.report.security.push({
      category,
      severity,
      issue,
      recommendation,
      files,
    });
    this.report.summary.securityIssues++;
  }

  private addCodeQualityIssue(
    category: string,
    severity: "critical" | "high" | "medium" | "low",
    issue: string,
    recommendation: string,
    files?: string[]
  ) {
    this.report.codeQuality.push({
      category,
      severity,
      issue,
      recommendation,
      files,
    });
    this.report.summary.codeQualityIssues++;
  }

  async generateReport(): Promise<void> {
    const reportPath = path.join(
      ROOT_DIR,
      "reports",
      `analysis-${new Date().toISOString().slice(0, 10)}.json`
    );

    this.report.summary.totalIssues =
      this.report.summary.performanceIssues +
      this.report.summary.securityIssues +
      this.report.summary.codeQualityIssues;

    const reportsDir = path.dirname(reportPath);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2));

    this.log(`\nReport saved: ${path.relative(ROOT_DIR, reportPath)}`, "success");
  }

  async run(): Promise<void> {
    console.log(chalk.cyan("═".repeat(60)));
    console.log(chalk.cyan("  ComicWise - Project Analysis"));
    console.log(chalk.cyan("═".repeat(60)));

    try {
      await this.analyzePerformance();
      await this.analyzeSecurity();
      await this.analyzeCodeQuality();

      // Print summary
      console.log("\n" + chalk.cyan("═".repeat(60)));
      console.log(chalk.cyan("Analysis Summary"));
      console.log(chalk.cyan("═".repeat(60)));

      console.log(`
Performance Issues: ${this.report.summary.performanceIssues}
Security Issues: ${this.report.summary.securityIssues}
Code Quality Issues: ${this.report.summary.codeQualityIssues}
Total Issues: ${this.report.summary.totalIssues}
      `);

      // Print top issues
      if (this.report.security.length > 0) {
        this.log("\n🔒 Top Security Issues:", "error");
        for (const issue of this.report.security.slice(0, 3)) {
          console.log(
            `  [${issue.severity}] ${issue.category}: ${issue.issue}`
          );
        }
      }

      if (process.argv.includes("--export")) {
        await this.generateReport();
      }
    } catch (error) {
      this.log(`Error: ${(error as any).message}`, "error");
      process.exit(1);
    }
  }
}

const analyzer = new ProjectAnalyzer();
analyzer.run();
