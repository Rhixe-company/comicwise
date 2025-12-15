/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-check
import css from "@eslint/css";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import eslintNextPlugin from "@next/eslint-plugin-next";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier/flat";
import pluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import * as drizzle from "eslint-plugin-drizzle";
import importPlugin from "eslint-plugin-import";
import pluginPrettier from "eslint-plugin-prettier";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import security from "eslint-plugin-security";
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import * as zod from "eslint-plugin-zod";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import { dirname } from "path";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "url";

const rootDir = dirname(fileURLToPath(import.meta.url));

export const compat = new FlatCompat({
  baseDirectory: rootDir,
  resolvePluginsRelativeTo: rootDir,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  js.configs.recommended,
  tseslint.configs.recommended,
  ...compat.plugins("react-hooks"),
  {
    ...pluginReact.configs.flat.recommended,
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: {
      next: eslintNextPlugin,

      "@typescript-eslint": typescript as any,
      js,
      react: pluginReact,
      "simple-import-sort": pluginSimpleImportSort,
      "better-tailwindcss": pluginBetterTailwindcss,
      prettier: pluginPrettier,
      import: importPlugin,
      "unused-imports": unusedImports,
      drizzle,

      zod: zod as any,
      security,
    },
    extends: ["js/recommended"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        // Disable type-aware linting at the global level to avoid parserErrors
        // for files that aren't included in the TS project. Enable project
        // only for TS/TSX files in a separate config block below.
        project: null,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
        React: "readonly",
      },
    },

    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: true,
    },
    settings: {
      react: { version: "detect" },
      "better-tailwindcss": {
        entryPoint: "src/styles/globals.css",
        tailwindConfig: "",
        attributes: ["class", "className"],
        callees: [
          "cc",
          "clb",
          "clsx",
          "cn",
          "cnb",
          "ctl",
          "cva",
          "cx",
          "dcnb",
          "objstr",
          "tv",
          "twJoin",
          "twMerge",
        ],
        variables: ["className", "classNames", "classes", "style", "styles"],
        tags: ["myTag"],
      },
      "import/resolver": {
        next: {},
        typescript: {
          alwaysTryTypes: true,
          project: ["./tsconfig.json"],
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".mts", ".cts"],
        },
      },
    },

    rules: {
      // ═══════════════════════════════════════════════════════════════════════
      // EXTENDED ESLINT PLUGIN CONFIGURATION
      // All 15 plugins with comprehensive rules
      // ═══════════════════════════════════════════════════════════════════════

      // 1. BASE JS RULES
      ...js.configs.recommended.rules,
      "no-unused-vars": "warn",
      "no-console": ["warn", { allow: ["warn", "error", "log"] }],
      "no-debugger": "error",
      "no-undef": "warn",
      "no-redeclare": "warn",
      "no-empty": ["warn", { allowEmptyCatch: true }],
      "no-shadow": "off", // Handled by TypeScript
      "no-constant-condition": ["warn", { checkLoops: false }],
      "no-cond-assign": "error",
      "no-duplicate-case": "error",
      "no-fallthrough": "error",
      "no-func-assign": "error",
      "no-import-assign": "error",
      "no-self-assign": "error",
      "no-self-compare": "error",
      "no-unreachable": "error",
      "valid-typeof": "error",
      "no-dupe-keys": "error",
      "no-setter-return": "error",
      "no-async-promise-executor": "error",
      "no-compare-neg-zero": "error",

      // 2. NEXT.JS PLUGIN (eslint-plugin-next / @next/eslint-plugin-next)
      ...eslintNextPlugin.configs.recommended.rules,
      "@next/next/no-html-link-for-pages": "warn",
      "@next/next/no-img-element": "warn",
      "@next/next/no-page-custom-font": "error",
      "@next/next/no-sync-scripts": "error",
      "@next/next/no-css-tags": "error",
      "@next/next/google-font-display": "warn",
      "@next/next/google-font-preconnect": "warn",
      // "@next/next/font-declaration-in-document": "error",
      "@next/next/no-styled-jsx-in-document": "error",

      // 3. TYPESCRIPT ESLINT PLUGIN (@typescript-eslint/eslint-plugin)
      // ...pluginReact.configs.flat.recommended!.rules,
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      // "@typescript-eslint/explicit-function-return-types": [
      //   "warn",
      //   {
      //     allowExpressions: true,
      //     allowTypedFunctionExpressions: true,
      //     allowHigherOrderFunctions: true,
      //     allowConciseArrowFunctionExpressionsStartingWithVoid: true,
      //   },
      // ],
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-misused-promises": [
        "warn",
        {
          checksVoidReturn: false,
          checksConditionals: false,
        },
      ],
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/consistent-type-definitions": ["warn", "interface"],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
      "@typescript-eslint/no-empty-interface": "warn",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "import",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "enumMember",
          format: ["PascalCase", "UPPER_CASE"],
        },
      ],
      "@typescript-eslint/no-require-imports": "warn",
      "@typescript-eslint/prefer-function-type": "warn",
      "@typescript-eslint/unified-signatures": "warn",
      "@typescript-eslint/no-redundant-type-constituents": "warn",
      "@typescript-eslint/no-confusing-non-null-assertion": "warn",
      // "@typescript-eslint/sort-type-union-intersection-members": "warn",
      "@typescript-eslint/method-signature-style": ["warn", "method"],
      "@typescript-eslint/no-duplicate-enum-values": "error",
      "@typescript-eslint/no-dynamic-delete": "warn",
      "@typescript-eslint/no-invalid-void-type": "error",

      // 4. REACT PLUGIN (eslint-plugin-react)
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginReactHooks.configs.flat["recommended-latest"].rules,
      "react/react-in-jsx-scope": "warn",
      "react/prop-types": "warn",
      "react/jsx-uses-react": "warn",
      "react/no-unescaped-entities": "warn",
      "react/no-unknown-property": "warn",
      "react/display-name": "warn",
      "react/no-render-return-value": "error",
      "react/no-string-refs": "error",
      "react/no-array-index-key": "warn",
      "react/no-direct-mutation-state": "error",
      "react/require-render-return": "error",
      "react/self-closing-comp": "warn",
      "react/sort-comp": "warn",
      "react/sort-prop-types": "warn",
      "react/jsx-key": ["error", { checkFragmentShorthand: true }],
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-literals": "off",
      "react/jsx-no-target-blank": "warn",
      "react/jsx-no-useless-fragment": "warn",
      // "react/jsx-curly-brace-presence": ["warn", { props: "avoid", children: "avoid" }],
      "react/function-component-definition": [
        "warn",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
      "react/hook-use-state": "warn",
      "react/prefer-stateless-function": "warn",
      "react/no-unstable-nested-components": "warn",

      // 5. REACT HOOKS PLUGIN (eslint-plugin-react-hooks)
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/incompatible-library": "warn",
      "react-hooks/use-memo": "warn",

      // 6. IMPORT PLUGIN (eslint-plugin-import)
      "import/no-unresolved": "error",
      "import/no-duplicates": "error",
      "import/order": "off", // Using simple-import-sort instead
      "import/no-default-export": "off",
      "import/prefer-default-export": "off",
      "import/no-named-default": "error",
      "import/no-anonymous-default-export": "warn",
      "import/no-cycle": "warn",
      "import/no-self-import": "error",
      "import/no-unused-modules": "off",
      "import/named": "error",
      "import/namespace": "error",
      "import/default": "error",
      "import/export": "error",
      "import/no-absolute-path": "error",
      "import/no-dynamic-require": "warn",
      "import/no-commonjs": "off",
      "import/no-restricted-paths": "off",
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          ts: "never",
          tsx: "never",
          js: "never",
          jsx: "never",
        },
      ],
      "import/newline-after-import": "warn",
      "import/no-amd": "error",
      "import/no-webpack-loader-syntax": "error",
      "import/no-relative-packages": "warn",
      "import/consistent-type-specifier-style": ["warn", "prefer-top-level"],
      "import/first": "error",
      "import/no-mutable-exports": "error",

      // 7. SIMPLE IMPORT SORT PLUGIN (eslint-plugin-simple-import-sort)
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",

      // 8. UNUSED IMPORTS PLUGIN (eslint-plugin-unused-imports)
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],

      // 9. PRETTIER PLUGIN (eslint-plugin-prettier)
      "prettier/prettier": [
        "error",
        {
          // ═══════════════════════════════════════════════════
          // Core Formatting Options
          // ═══════════════════════════════════════════════════
          semi: false,
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
        },
        { usePrettierrc: false },
      ],

      // 10. BETTER TAILWINDCSS PLUGIN (eslint-plugin-better-tailwindcss)
      // ...pluginBetterTailwindcss.configs["recommended-warn"]!.rules,
      // ...pluginBetterTailwindcss.configs["correctness-warn"]!.rules,
      // ...pluginBetterTailwindcss.configs["stylistic-warn"]!.rules,
      "better-tailwindcss/no-conflicting-classes": "warn",
      "better-tailwindcss/no-unregistered-classes": "warn",
      "better-tailwindcss/enforce-consistent-class-order": "warn",
      "better-tailwindcss/no-duplicate-classes": "warn",
      "better-tailwindcss/no-unnecessary-whitespace": "warn",
      "better-tailwindcss/enforce-consistent-line-wrapping": [
        "off",
        {
          group: "newLine",
          preferSingleLine: true,
          printWidth: 100,
        },
      ],

      // 11. DRIZZLE ORM PLUGIN (eslint-plugin-drizzle)
      "drizzle/enforce-delete-with-where": ["error", { drizzleObjectName: ["database", "db"] }],
      "drizzle/enforce-update-with-where": ["error", { drizzleObjectName: ["database", "db"] }],

      // 12. ZOD PLUGIN (eslint-plugin-zod)
      "zod/prefer-enum": "error",
      "zod/require-strict": "warn",

      // 13. SECURITY PLUGIN (eslint-plugin-security)
      "security/detect-object-injection": "off",
      "security/detect-non-literal-regexp": "warn",
      "security/detect-non-literal-fs-filename": "warn",
      "security/detect-non-literal-require": "warn",
      "security/detect-child-process": "warn",
      "security/detect-disable-mustache-escape": "warn",
      "security/detect-no-csrf-before-method-override": "warn",
      "security/detect-unsafe-regex": "warn",
      "security/detect-buffer-noassert": "warn",

      // 14. SONARJS PLUGIN (eslint-plugin-sonarjs) - bonus plugin
      // No additional rules needed - uses recommended config

      // 15. CSS PLUGIN (@eslint/css) - bonus plugin
      // Configured separately in css section below

      // ADDITIONAL CODE QUALITY RULES
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      "consistent-return": "warn",
      "prefer-const": [
        "warn",
        {
          destructuring: "all",
        },
      ],
      "prefer-arrow-callback": [
        "warn",
        {
          allowNamedFunctions: false,
          allowUnboundThis: true,
        },
      ],
      "no-unused-expressions": "warn",
      "no-loop-func": "warn",
      "no-implicit-coercion": "warn",
      "no-multi-spaces": "error",
      "no-multiple-empty-lines": ["warn", { max: 2 }],
      "no-trailing-spaces": "error",
      "no-whitespace-before-property": "error",
      "prefer-spread": "warn",
      "prefer-template": "warn",
      radix: ["error", "as-needed"],
      "space-before-blocks": "error",
      "space-before-function-paren": [
        "error",
        {
          anonymous: "always",
          named: "never",
          asyncArrow: "always",
        },
      ],
      "space-in-parens": ["error", "never"],
      "space-infix-ops": "error",
      "space-unary-ops": "error",
      "spaced-comment": [
        "warn",
        "always",
        {
          line: { exceptions: ["-", "+"] },
          block: { exceptions: ["*"] },
        },
      ],
      "switch-colon-spacing": "error",
      "template-curly-spacing": ["error", "never"],
      "comma-dangle": ["warn", "es5"],
      "comma-spacing": "error",
      "comma-style": ["error", "last"],
      "computed-property-spacing": ["error", "never"],
      "func-call-spacing": ["error", "never"],
      "key-spacing": "error",
      "keyword-spacing": "error",
      "no-mixed-operators": "warn",
      "no-mixed-spaces-and-tabs": "error",
      "no-tabs": "error",
      quotes: ["error", "double", { avoidEscape: true, allowTemplateLiterals: true }],
      semi: ["error", "never"],
      "arrow-parens": ["error", "always"],
      "arrow-spacing": "error",
      "rest-spread-spacing": "error",
      "template-tag-spacing": "error",
      "yield-star-spacing": ["error", "after"],
    },
  },
  // JavaScript files configuration

  {
    files: ["**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/await-thenable": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/prefer-optional-chain": "off",
      "@typescript-eslint/prefer-as-const": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/naming-convention": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/prefer-function-type": "off",
      "@typescript-eslint/unified-signatures": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "@typescript-eslint/no-confusing-non-null-assertion": "off",
      "@typescript-eslint/method-signature-style": "off",
      "@typescript-eslint/no-duplicate-enum-values": "off",
      "@typescript-eslint/no-dynamic-delete": "off",
      "@typescript-eslint/no-invalid-void-type": "off",
    },
  },

  // Test files
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // Playwright test files - disable React hooks rules
  {
    files: ["**/tests/**/*.ts", "**/e2e/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
    rules: {
      "react-hooks/rules-of-hooks": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // Type definition files - allow any for third-party package definitions
  {
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/triple-slash-reference": "warn",
    },
  },

  // Enable type-aware rules only for TypeScript source files
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        project: ["./tsconfig.json"],
      },
    },
    // Enable recommended TypeScript plugin rules for TS files
    plugins: {
      "@typescript-eslint": typescript as any,
    },
    rules: {
      // ...typescript.configs.recommended!.rules,
      // The codebase includes many intentional `any` usages (legacy or 3rd-party
      // stubs). Keep this quiet at the rule level and enable gradual fixes.
      "@typescript-eslint/no-explicit-any": "warn",
      // Prefer warning for unused vars in TypeScript to avoid failing the whole
      // lint run while migrating. Still ignore variables that start with '_'.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  // // Config files
  // // @ts-expect-error - Plugin type compatibility with ESLint 9 flat config
  {
    files: ["*.config.{js,ts,mjs,cjs}"],
    rules: {
      "@typescript-eslint/no-var-requires": "warn",
      "import/no-default-export": "off",
      "import/order": "off",
    },
  },
  // Relax checks inside generated/3rd-party type stubs and the project's `src/types`.
  {
    files: ["src/types/**", "**/*.d.ts"],
    languageOptions: {
      parserOptions: {
        // Avoid type-aware parsing for ambient/type stub files which often use
        // `any` and other patterns not included in the project's tsconfig.
        project: null,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
  // Avoid type-aware parsing issues for hook utilities that may not be
  // included in the project's tsconfig (e.g. runtime-only hooks).
  {
    files: ["src/hooks/**"],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
  },
  {
    files: ["**/*.jsonc"],

    // Ensure recommended config is merged first so explicit properties below win
    plugins: { json },
    language: "json/jsonc",
    extends: ["json/recommended"],
  },

  {
    files: ["**/*.json5"],

    // Ensure recommended config is merged first so explicit properties below win
    plugins: { json },
    language: "json/json5",
    extends: ["json/recommended"],
  },

  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/commonmark",
    extends: ["markdown/recommended"],
    rules: {
      "no-irregular-whitespace": "off",
      "markdown/fenced-code-language": "off", // Disable for documentation flexibility
      "markdown/no-missing-label-refs": "off", // Disable for documentation flexibility
      // Some docs reference fragment links that are valid across files — relax
      "markdown/no-missing-link-fragments": "off",
    },
  },
  {
    files: ["**/*.css"],
    // Ensure the language is explicitly set so @eslint/css handles CSS files
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
    rules: {
      // Disable rules that conflict with Tailwind CSS v4 syntax
      "css/no-invalid-syntax": "warn",
      "css/no-unknown-at-rules": "warn",
    },
  },
  prettierConfig,
  globalIgnores([
    "**/.next/**",
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/.vercel/**",
    "**/public/**",
    "**/drizzle/**",
    "src/styles/globals.css",
    "**/docs/**",
  ]),
]);

export default eslintConfig;
