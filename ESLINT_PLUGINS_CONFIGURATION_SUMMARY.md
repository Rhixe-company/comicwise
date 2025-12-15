# ESLint Plugins Configuration Summary

## Updated: 2025-12-13T23:55:34Z

Complete configuration of all 15 ESLint plugins with rules, settings, and
extends in `eslint.config.ts`.

---

## 📦 Installed ESLint Plugins (15 Total)

### 1. **@eslint/js** (Core)

- **Status**: ✅ Configured
- **Extends**: `js/recommended`
- **Purpose**: Core JavaScript linting rules
- **Key Rules**:
  - `no-unused-vars`, `no-console`, `no-debugger`, `no-undef`, `no-redeclare`
  - `no-empty`, `no-cond-assign`, `no-duplicate-case`, `no-fallthrough`
  - `no-func-assign`, `no-import-assign`, `no-self-assign`, `no-self-compare`

---

### 2. **@typescript-eslint**

- **Status**: ✅ Configured
- **Extends**: `typescript-eslint/configs.recommended`
- **Purpose**: TypeScript-specific linting
- **Key Rules** (45+ rules):
  - `@typescript-eslint/no-unused-vars` - Ignore args starting with `_`
  - `@typescript-eslint/no-explicit-any` - Warn on `any` type
  - `@typescript-eslint/explicit-module-boundary-types` - Warn on function
    returns
  - `@typescript-eslint/no-floating-promises` - Error on unhandled promises
  - `@typescript-eslint/no-misused-promises` - Prevent promise misuse
  - `@typescript-eslint/consistent-type-definitions` - Enforce `interface` over
    `type`
  - `@typescript-eslint/consistent-type-imports` - Use `import type` for types
  - `@typescript-eslint/naming-convention` - Enforce naming conventions
  - `@typescript-eslint/no-unsafe-*` - Comprehensive type safety checks
  - `@typescript-eslint/prefer-nullish-coalescing` - Encourage `??` operator
  - `@typescript-eslint/prefer-optional-chain` - Encourage optional chaining

---

### 3. **@next/eslint-plugin-next**

- **Status**: ✅ Configured
- **Extends**: `next/recommended` rules
- **Purpose**: Next.js best practices
- **Key Rules**:
  - `@next/next/no-html-link-for-pages` - Warn
  - `@next/next/no-img-element` - Warn (use Image component)
  - `@next/next/no-page-custom-font` - Error
  - `@next/next/no-sync-scripts` - Error
  - `@next/next/no-css-tags` - Error
  - `@next/next/google-font-display` - Warn
  - `@next/next/google-font-preconnect` - Warn
  - `@next/next/no-styled-jsx-in-document` - Error

---

### 4. **eslint-plugin-react**

- **Status**: ✅ Configured
- **Extends**: `react/recommended` flat config
- **Purpose**: React-specific linting
- **Key Rules** (20+ rules):
  - `react/react-in-jsx-scope` - Warn
  - `react/prop-types` - Warn
  - `react/jsx-uses-react` - Warn
  - `react/no-unescaped-entities` - Warn
  - `react/no-unknown-property` - Warn
  - `react/display-name` - Warn
  - `react/no-render-return-value` - Error
  - `react/no-string-refs` - Error
  - `react/no-array-index-key` - Warn
  - `react/no-direct-mutation-state` - Error
  - `react/require-render-return` - Error
  - `react/self-closing-comp` - Warn
  - `react/jsx-key` - Error (with fragmentShorthand check)
  - `react/jsx-no-duplicate-props` - Error
  - `react/jsx-no-target-blank` - Warn
  - `react/jsx-no-useless-fragment` - Warn
  - `react/function-component-definition` - Enforce arrow functions
  - `react/hook-use-state` - Warn
  - `react/prefer-stateless-function` - Warn
  - `react/no-unstable-nested-components` - Warn

---

### 5. **eslint-plugin-react-hooks**

- **Status**: ✅ Configured
- **Extends**: `react-hooks/recommended`, `react-hooks/recommended-latest`
- **Purpose**: React Hooks best practices
- **Key Rules**:
  - `react-hooks/rules-of-hooks` - Error (critical)
  - `react-hooks/exhaustive-deps` - Warn
  - `react-hooks/set-state-in-effect` - Warn
  - `react-hooks/immutability` - Warn
  - `react-hooks/purity` - Warn
  - `react-hooks/incompatible-library` - Warn
  - `react-hooks/use-memo` - Warn

---

### 6. **eslint-plugin-jsx-a11y** ⭐ **(NEW - Added)**

- **Status**: ✅ Newly Configured
- **Purpose**: Accessibility best practices
- **Key Rules**:
  - `jsx-a11y/anchor-is-valid` - Warn
  - `jsx-a11y/click-events-have-key-events` - Warn
  - `jsx-a11y/no-static-element-interactions` - Warn
  - `jsx-a11y/role-supports-aria-props` - Warn
  - `jsx-a11y/role-has-required-aria-props` - Warn
  - `jsx-a11y/img-redundant-alt` - Warn
  - `jsx-a11y/label-has-associated-control` - Warn

---

### 7. **eslint-plugin-import**

- **Status**: ✅ Configured
- **Purpose**: Import/export best practices
- **Key Rules** (20+ rules):
  - `import/no-unresolved` - Error
  - `import/no-duplicates` - Error
  - `import/order` - Off (handled by simple-import-sort)
  - `import/no-default-export` - Off
  - `import/no-named-default` - Error
  - `import/no-anonymous-default-export` - Warn
  - `import/no-cycle` - Warn
  - `import/no-self-import` - Error
  - `import/named` - Error
  - `import/namespace` - Error
  - `import/default` - Error
  - `import/export` - Error
  - `import/no-absolute-path` - Error
  - `import/no-dynamic-require` - Warn
  - `import/extensions` - Error (enforce no extensions for ts/tsx/js/jsx)
  - `import/newline-after-import` - Warn
  - `import/no-amd` - Error
  - `import/no-webpack-loader-syntax` - Error
  - `import/no-relative-packages` - Warn
  - `import/consistent-type-specifier-style` - Warn (prefer-top-level)
  - `import/first` - Error
  - `import/no-mutable-exports` - Error

---

### 8. **eslint-plugin-simple-import-sort**

- **Status**: ✅ Configured
- **Purpose**: Organize imports alphabetically
- **Key Rules**:
  - `simple-import-sort/imports` - Warn
  - `simple-import-sort/exports` - Warn

---

### 9. **eslint-plugin-unused-imports**

- **Status**: ✅ Configured
- **Purpose**: Detect and remove unused imports
- **Key Rules**:
  - `unused-imports/no-unused-imports` - Error
  - `unused-imports/no-unused-vars` - Warn (with `_` ignore patterns)

---

### 10. **eslint-plugin-prettier**

- **Status**: ✅ Configured
- **Purpose**: Format code with Prettier
- **Key Rules**:
  - `prettier/prettier` - Error with full Prettier config:
    - `semi: true`
    - `trailingComma: "es5"`
    - `singleQuote: false`
    - `printWidth: 100`
    - `tabWidth: 2`
    - `useTabs: false`
    - `arrowParens: "always"`
    - `endOfLine: "lf"`
    - `bracketSpacing: true`
    - `bracketSameLine: false`
    - **Plugins**: `prettier-plugin-tailwindcss`,
      `prettier-plugin-organize-imports`

---

### 11. **eslint-plugin-better-tailwindcss**

- **Status**: ✅ Configured
- **Extends**:
  - `better-tailwindcss/recommended-warn`
  - `better-tailwindcss/correctness-warn`
  - `better-tailwindcss/stylistic-warn`
- **Purpose**: Tailwind CSS best practices
- **Settings**:
  ```json
  {
    "entryPoint": "src/styles/globals.css",
    "tailwindConfig": "",
    "attributes": ["class", "className"],
    "callees": [
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
      "twMerge"
    ],
    "variables": ["className", "classNames", "classes", "style", "styles"],
    "tags": ["myTag"]
  }
  ```
- **Key Rules**:
  - `better-tailwindcss/no-conflicting-classes` - Warn
  - `better-tailwindcss/no-unregistered-classes` - Warn
  - `better-tailwindcss/enforce-consistent-class-order` - Warn
  - `better-tailwindcss/no-duplicate-classes` - Warn
  - `better-tailwindcss/no-unnecessary-whitespace` - Warn
  - `better-tailwindcss/enforce-consistent-line-wrapping` - Off

---

### 12. **eslint-plugin-drizzle**

- **Status**: ✅ Configured
- **Purpose**: Drizzle ORM best practices
- **Key Rules**:
  - `drizzle/enforce-delete-with-where` - Error (drizzleObjectName: ["database",
    "db"])
  - `drizzle/enforce-update-with-where` - Error (drizzleObjectName: ["database",
    "db"])

---

### 13. **eslint-plugin-zod**

- **Status**: ✅ Configured
- **Purpose**: Zod validation schema best practices
- **Key Rules**:
  - `zod/prefer-enum` - Error
  - `zod/require-strict` - Warn

---

### 14. **eslint-plugin-security**

- **Status**: ✅ Configured
- **Purpose**: Security vulnerability detection
- **Key Rules** (9 rules):
  - `security/detect-object-injection` - Off
  - `security/detect-non-literal-regexp` - Warn
  - `security/detect-non-literal-fs-filename` - Warn
  - `security/detect-non-literal-require` - Warn
  - `security/detect-child-process` - Warn
  - `security/detect-disable-mustache-escape` - Warn
  - `security/detect-no-csrf-before-method-override` - Warn
  - `security/detect-unsafe-regex` - Warn
  - `security/detect-buffer-noassert` - Warn

---

### 15. **eslint-plugin-sonarjs** ⭐ **(NEW - Added)**

- **Status**: ✅ Newly Configured
- **Extends**: `sonarjs/recommended`
- **Purpose**: Code quality and cognitive complexity detection
- **Key Rules** (16 rules):
  - `sonarjs/cognitive-complexity` - Warn (max 30)
  - `sonarjs/max-switch-cases` - Warn (max 10)
  - `sonarjs/no-all-duplicated-branches` - Error
  - `sonarjs/no-duplicated-branches` - Warn
  - `sonarjs/no-empty-collection` - Warn
  - `sonarjs/no-gratuitous-expressions` - Warn
  - `sonarjs/no-identical-conditions` - Error
  - `sonarjs/no-identical-expressions` - Warn
  - `sonarjs/no-identical-functions` - Warn
  - `sonarjs/no-inverted-boolean-check` - Warn
  - `sonarjs/no-one-iteration-loop` - Warn
  - `sonarjs/no-redundant-boolean` - Warn
  - `sonarjs/no-redundant-jump` - Warn
  - `sonarjs/no-same-line-conditional` - Warn
  - `sonarjs/prefer-object-literal` - Warn
  - `sonarjs/prefer-single-boolean-return` - Warn
  - `sonarjs/prefer-switch` - Warn

---

## 🎯 Core ESLint Configs (4 Total)

### 1. **@eslint/js** (Core)

- Base JavaScript rules

### 2. **@eslint/json**

- JSON file linting for `*.json`, `*.jsonc`, `*.json5`

### 3. **@eslint/markdown**

- Markdown file linting for `*.md`

### 4. **@eslint/css**

- CSS file linting for `*.css`

---

## ⚙️ Configuration Files

| File Type | Configuration                                                      |
| --------- | ------------------------------------------------------------------ |
| `.json`   | `json/recommended` extends                                         |
| `.jsonc`  | `json/jsonc` language with `json/recommended` extends              |
| `.json5`  | `json/json5` language with `json/recommended` extends              |
| `.md`     | `markdown/commonmark` language with `markdown/recommended` extends |
| `.css`    | `css/css` language with `css/recommended` extends                  |

---

## 📋 Global Ignore Patterns

Files excluded from linting:

```
**/.next/**
**/node_modules/**
**/dist/**
**/build/**
**/.vercel/**
**/public/**
**/drizzle/**
src/styles/globals.css
**/docs/**
```

---

## 🔧 Parser Configuration

- **Primary Parser**: `@typescript-eslint/parser`
- **ECMAVersion**: `latest`
- **Source Type**: `module`
- **JSX Support**: Enabled
- **TypeScript Project**: `./tsconfig.json` (for type-aware rules)

---

## 🌍 Global Variables

- **Browser APIs**: `globals.browser`
- **Node APIs**: `globals.node`
- **ES2022 Globals**: `globals.es2022`
- **React**: `React: "readonly"`

---

## 📝 File-Specific Rule Overrides

### 1. **JavaScript Files** (`**/*.js`, `**/*.jsx`, `**/*.mjs`, `**/*.cjs`)

- TypeScript rules disabled
- JavaScript-specific `no-unused-vars` enabled

### 2. **Test Files** (`**/*.test.ts`, `**/*.spec.ts`, `**/*.tsx`, `**/*.spec.tsx`)

- `@typescript-eslint/no-explicit-any` - Warn
- Type checking disabled (`project: null`)

### 3. **E2E/Playwright Tests** (`**/tests/**/*.ts`, `**/e2e/**/*.ts`)

- React hooks rules - Warn
- `@typescript-eslint/no-explicit-any` - Warn
- Type checking disabled

### 4. **Type Definition Files** (`**/*.d.ts`)

- `@typescript-eslint/no-explicit-any` - Warn
- `@typescript-eslint/triple-slash-reference` - Warn

### 5. **TypeScript Source Files** (`**/*.{ts,tsx,mts,cts}`)

- Full type-aware rules enabled
- `@typescript-eslint/` rules applied

### 6. **Config Files** (`*.config.{js,ts,mjs,cjs}`)

- `import/no-default-export` - Off
- `import/order` - Off
- `@typescript-eslint/no-var-requires` - Warn

### 7. **Type Stubs** (`src/types/**`, `**/*.d.ts`)

- All `@typescript-eslint/no-explicit-any` rules - Off
- Type checking disabled

### 8. **Hook Utilities** (`src/hooks/**`)

- Type checking disabled (`project: null`)

---

## 📊 Rules Summary

| Category         | Count | Details                          |
| ---------------- | ----- | -------------------------------- |
| Core JS Rules    | 20+   | Covered by @eslint/js            |
| TypeScript Rules | 45+   | Comprehensive type safety        |
| React Rules      | 20+   | Component best practices         |
| React Hooks      | 7     | Hook compliance rules            |
| Import Rules     | 22+   | Module resolution & organization |
| Accessibility    | 7     | JSX A11y standards               |
| Drizzle ORM      | 2     | Database safety rules            |
| Zod Validation   | 2     | Schema validation rules          |
| Security         | 9     | Vulnerability detection          |
| Code Quality     | 16+   | SonarJS complexity rules         |
| Formatting       | 1     | Prettier integration             |
| Tailwind CSS     | 5+    | Utility class best practices     |

**Total Configured Rules**: 155+

---

## ✅ Configuration Status

- ✅ All 15 ESLint plugins installed and configured
- ✅ All recommended extends applied
- ✅ Comprehensive rule set (155+ rules)
- ✅ File-specific overrides for different contexts
- ✅ Global ignores configured
- ✅ Parser and language options optimized
- ✅ Settings configured for all plugins
- ✅ TypeScript support fully enabled
- ✅ React & Next.js best practices enforced
- ✅ Accessibility standards enabled
- ✅ Security checks enabled
- ✅ Code quality metrics enabled

---

## 🚀 Usage

```bash
# Run ESLint
pnpm lint

# Fix ESLint issues
pnpm lint:fix

# Strict mode (no warnings)
pnpm lint:strict

# Type checking
pnpm type-check

# Full validation
pnpm validate
```

---

**Last Updated**: 2025-12-13T23:55:34Z
