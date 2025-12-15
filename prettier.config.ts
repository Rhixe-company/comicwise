// ═══════════════════════════════════════════════════
// PRETTIER CONFIGURATION (Next.js 16 Best Practices)
// ═══════════════════════════════════════════════════

import type { Config } from "prettier";

const config: Config = {
  // ═══════════════════════════════════════════════════
  // Core Formatting Options
  // ═══════════════════════════════════════════════════
  semi: true,
  trailingComma: "es5",
  singleQuote: false,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  arrowParens: "always",
  endOfLine: "lf",
  bracketSpacing: true,
  bracketSameLine: false,

  // ═══════════════════════════════════════════════════
  // Plugin Configuration
  // ═══════════════════════════════════════════════════
  plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-organize-imports"],

  // ═══════════════════════════════════════════════════
  // File-Specific Overrides
  // ═══════════════════════════════════════════════════
  overrides: [
    {
      files: "*.json",
      options: {
        printWidth: 80,
      },
    },
    {
      files: "*.md",
      options: {
        proseWrap: "always",
        printWidth: 80,
      },
    },
  ],

  // ═══════════════════════════════════════════════════
  // Ignore Patterns
  // ═══════════════════════════════════════════════════
  // Note: Use .prettierignore file for complex patterns
};

export default config;
