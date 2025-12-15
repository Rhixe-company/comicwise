// ═══════════════════════════════════════════════════
// CSPELL CONFIGURATION (Next.js 16 TypeScript Config)
// ═══════════════════════════════════════════════════

import type { CSpellSettings } from "cspell";

const config: CSpellSettings = {
  // ═══════════════════════════════════════════════════
  // Version & Language
  // ═══════════════════════════════════════════════════
  version: "0.2",
  language: "en",

  // ═══════════════════════════════════════════════════
  // File Patterns to Check
  // ═══════════════════════════════════════════════════
  files: ["**/*.{ts,tsx,js,jsx,mjs,cjs}", "**/*.{json,md,mdx}", "**/*.{css,scss,sass}"],

  // ═══════════════════════════════════════════════════
  // Ignore Patterns
  // ═══════════════════════════════════════════════════
  ignorePaths: [
    "node_modules/**",
    ".next/**",
    "dist/**",
    "build/**",
    "out/**",
    "coverage/**",
    ".git/**",
    "pnpm-lock.yaml",
    "package-lock.json",
    "yarn.lock",
    "**/*.min.*",
    "public/**",
    "drizzle/**",
  ],

  // ═══════════════════════════════════════════════════
  // Dictionaries
  // ═══════════════════════════════════════════════════
  dictionaries: ["typescript", "node", "npm", "css", "html", "bash", "project-words"],

  // ═══════════════════════════════════════════════════
  // Custom Words (Project-Specific)
  // ═══════════════════════════════════════════════════
  words: [
    // Framework & Libraries
    "nextjs",
    "nextauth",
    "tailwindcss",
    "drizzle",
    "zod",
    "shadcn",
    "radix",
    "lucia",
    "tanstack",
    "jotai",
    "zustand",

    // Database
    "postgres",
    "postgresql",
    "neon",
    "prisma",

    // Tools & Services
    "imagekit",
    "cloudinary",
    "nodemailer",
    "qstash",
    "upstash",
    "vercel",
    "turbopack",

    // Project-Specific
    "comicwise",
    "manhua",
    "manhwa",
    "webtoon",

    // Common Tech Terms
    "webp",
    "avif",
    "signup",
    "signin",
    "middleware",
    "optimizations",
    "unstable",
    "readonly",
    "typeof",
    "keyof",
    "satisfies",

    // React & Next.js
    "suspense",
    "prefetch",
    "preload",
    "hydration",
    "revalidate",
    "refetch",

    // UI Components
    "dropdown",
    "popover",
    "tooltip",
    "breadcrumb",
    "navbar",
    "sidebar",
    "dropdown",
    "checkbox",

    // Status Values
    "hiatus",

    // Actions
    "bookmarked",
    "unbookmark",
  ],

  // ═══════════════════════════════════════════════════
  // Ignore Patterns in Code
  // ═══════════════════════════════════════════════════
  ignoreRegExpList: [
    // UUIDs
    "/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi",

    // Hex colors
    "/#[0-9a-fA-F]{3,8}/g",

    // URLs
    "/https?:\\/\\/[^\\s]+/g",

    // Email addresses
    "/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/g",

    // File paths
    "/\\.\\/([\\/\\w\\-\\.]+)/g",

    // Import statements
    "/import\\s+.*?from\\s+['\"].*?['\"]/g",

    // Base64 data
    '/data:[^;]*;base64,[^"]+/g',

    // Long strings of numbers or mixed alphanumeric
    "/\\b[a-zA-Z0-9]{20,}\\b/g",
  ],

  // ═══════════════════════════════════════════════════
  // Settings
  // ═══════════════════════════════════════════════════
  caseSensitive: false,
  allowCompoundWords: true,

  // ═══════════════════════════════════════════════════
  // Language Settings
  // ═══════════════════════════════════════════════════
  dictionaryDefinitions: [
    {
      name: "project-words",
      path: "./project-words.txt",
      description: "Words used in this project",
      addWords: true,
    },
  ],
  languageSettings: [
    {
      languageId: "typescript,javascript,typescriptreact,javascriptreact",
      ignoreRegExpList: ["/import\\s+.*?from\\s+['\"].*?['\"]/g", "/require\\(['\"].*?['\"]\\)/g"],
    },
  ],
};

export default config;
