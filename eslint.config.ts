// ESLint 9.x Flat Config for Next.js 16 + React 19 + TypeScript 5
import css from "@eslint/css";
import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import eslintNextPlugin from "@next/eslint-plugin-next";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier/flat";
import pluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import * as pluginDrizzle from "eslint-plugin-drizzle";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import security from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: {
      "@next/next": eslintNextPlugin,
      "@typescript-eslint": typescript as any,
      react: pluginReact,
      "react-hooks": pluginReactHooks as any,
      "jsx-a11y": jsxA11y,
      "better-tailwindcss": pluginBetterTailwindcss,
      import: importPlugin,
      "unused-imports": unusedImports,
      drizzle: pluginDrizzle,
      security,
      sonarjs,
    } as any,
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        project: ["./tsconfig.json"],
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
      "jsx-a11y": {
        components: {
          Button: "button",
          Input: "input",
        },
      },
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
      // Base JS
      ...js.configs.recommended.rules,
      "no-unused-vars": "off",
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "no-debugger": "error",
      "no-redeclare": "warn",
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      "prefer-const": ["warn", { destructuring: "all" }],
      "prefer-arrow-callback": ["warn", { allowNamedFunctions: false, allowUnboundThis: true }],
      "no-multi-spaces": "error",
      "no-trailing-spaces": "error",
      "no-whitespace-before-property": "error",
      "space-before-blocks": "error",
      "space-before-function-paren": [
        "error",
        { anonymous: "always", named: "never", asyncArrow: "always" },
      ],
      "space-in-parens": ["error", "never"],
      "space-infix-ops": "error",
      "space-unary-ops": "error",
      "template-curly-spacing": ["error", "never"],
      "comma-dangle": ["warn", "es5"],
      "comma-spacing": "error",
      "comma-style": ["error", "last"],
      "computed-property-spacing": ["error", "never"],
      "func-call-spacing": ["error", "never"],
      "key-spacing": "error",
      "keyword-spacing": "error",
      quotes: ["error", "double", { avoidEscape: true, allowTemplateLiterals: true }],
      semi: ["error", "never"],
      "arrow-parens": ["error", "always"],
      "arrow-spacing": "error",
      "rest-spread-spacing": "error",
      "template-tag-spacing": "error",

      // Next.js
      ...eslintNextPlugin.configs.recommended.rules,
      "@next/next/no-html-link-for-pages": "warn",
      "@next/next/no-img-element": "warn",
      "@next/next/no-page-custom-font": "error",
      "@next/next/no-sync-scripts": "error",
      "@next/next/no-css-tags": "error",

      // TypeScript
      ...(typescript.configs.recommended?.rules ?? {}),
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-misused-promises": [
        "warn",
        { checksVoidReturn: false, checksConditionals: false },
      ],
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/consistent-type-definitions": ["warn", "interface"],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "import", format: ["camelCase", "PascalCase"] },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        { selector: "function", format: ["camelCase", "PascalCase"], leadingUnderscore: "allow" },
        { selector: "typeLike", format: ["PascalCase"] },
        { selector: "enumMember", format: ["PascalCase", "UPPER_CASE"] },
      ],
      "@typescript-eslint/no-require-imports": "warn",
      "@typescript-eslint/prefer-function-type": "warn",
      "@typescript-eslint/unified-signatures": "warn",
      "@typescript-eslint/method-signature-style": ["warn", "method"],
      "@typescript-eslint/no-duplicate-enum-values": "error",
      "@typescript-eslint/no-invalid-void-type": "error",

      // React
      ...pluginReactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "warn",
      "react/prop-types": "warn",
      "react/no-unescaped-entities": "warn",
      "react/no-unknown-property": "warn",
      "react/display-name": "warn",
      "react/no-render-return-value": "error",
      "react/no-string-refs": "error",
      "react/no-array-index-key": "warn",
      "react/no-direct-mutation-state": "error",
      "react/require-render-return": "error",
      "react/self-closing-comp": "warn",
      "react/jsx-key": ["error", { checkFragmentShorthand: true }],
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-target-blank": "warn",

      // React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Accessibility
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-has-content": "warn",
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/aria-role": "warn",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/heading-has-content": "warn",
      "jsx-a11y/interactive-supports-focus": "warn",
      "jsx-a11y/label-has-associated-control": "warn",
      "jsx-a11y/no-autofocus": "warn",

      // Imports
      "import/no-unresolved": "error",
      "import/no-duplicates": "error",
      "import/order": "off",
      "import/no-default-export": "off",
      "import/prefer-default-export": "off",
      "import/no-named-default": "error",
      "import/no-anonymous-default-export": "warn",
      "import/no-cycle": "warn",
      "import/no-self-import": "error",
      "import/named": "error",
      "import/namespace": "error",
      "import/default": "error",
      "import/export": "error",
      "import/no-absolute-path": "error",
      "import/no-dynamic-require": "warn",
      "import/extensions": [
        "error",
        "ignorePackages",
        { ts: "never", tsx: "never", js: "never", jsx: "never" },
      ],
      "import/newline-after-import": "warn",
      "import/no-amd": "error",
      "import/no-webpack-loader-syntax": "error",
      "import/no-relative-packages": "warn",
      "import/consistent-type-specifier-style": ["warn", "prefer-top-level"],
      "import/first": "error",
      "import/no-mutable-exports": "error",

      // Unused imports
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // Tailwind CSS
      ...(pluginBetterTailwindcss.configs["recommended-warn"]?.rules ?? {}),
      "better-tailwindcss/no-conflicting-classes": "warn",
      "better-tailwindcss/no-unregistered-classes": "warn",

      // Drizzle ORM
      "drizzle/enforce-delete-with-where": ["error", { drizzleObjectName: ["database", "db"] }],
      "drizzle/enforce-update-with-where": ["error", { drizzleObjectName: ["database", "db"] }],

      // Security
      "security/detect-object-injection": "off",
      "security/detect-non-literal-regexp": "warn",
      "security/detect-non-literal-fs-filename": "warn",
      "security/detect-non-literal-require": "warn",
      "security/detect-child-process": "warn",

      // SonarJS
      "sonarjs/cognitive-complexity": ["warn", 15],
      "sonarjs/no-identical-expressions": "warn",
      "sonarjs/no-collapsible-if": "warn",
      "sonarjs/no-duplicate-string": "warn",
    },
  },

  // Type definitions
  {
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },

  // Config files
  {
    files: ["*.config.{js,ts,mjs,cjs}"],
    rules: {
      "@typescript-eslint/no-var-requires": "warn",
      "import/no-default-export": "off",
    },
  },

  // JSON files
  {
    files: ["**/*.jsonc"],
    plugins: { json },
    language: "json/jsonc",
  },

  {
    files: ["**/*.json5"],
    plugins: { json },
    language: "json/json5",
  },

  // Markdown files
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/commonmark",
    rules: {
      "no-irregular-whitespace": "off",
    },
  },

  // CSS files
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    rules: {
      "css/no-invalid-syntax": "warn",
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
