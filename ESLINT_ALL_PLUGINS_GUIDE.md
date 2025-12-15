# Complete ESLint Plugins Configuration Guide

## 🎯 Overview

This document provides a comprehensive guide to all 15 ESLint plugins configured
in `eslint.config.ts`.

---

## 📦 All 15 ESLint Plugins

### Tier 1: Core Linting (4 Plugins)

#### 1. **@eslint/js** ⭐ Foundation

```typescript
// Imported as: js
import js from "@eslint/js";

// Usage in config:
extends: ["js/recommended"],
rules: {
  ...js.configs.recommended.rules,
}
```

**What it does**: Provides core JavaScript linting rules  
**Rules Count**: 20+  
**Examples**:

- `no-unused-vars`, `no-console`, `no-debugger`
- `no-duplicate-case`, `no-fallthrough`
- `no-self-assign`, `no-self-compare`

---

#### 2. **@typescript-eslint/eslint-plugin** ⭐ TypeScript

```typescript
// Imported as: typescript, typescriptParser
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

// Usage:
plugins: {
  "@typescript-eslint": typescript as any,
},
languageOptions: {
  parser: typescriptParser,
  parserOptions: {
    project: ["./tsconfig.json"],
  },
}
rules: {
  "@typescript-eslint/no-explicit-any": "warn",
  "@typescript-eslint/no-unused-vars": "warn",
  // 40+ more rules
}
```

**What it does**: Type-safe linting for TypeScript  
**Rules Count**: 45+  
**Key Features**:

- Type-aware rules
- Strict null checks
- Import/export validation
- Naming conventions

---

#### 3. **@next/eslint-plugin-next** ⭐ Next.js

```typescript
// Imported as: eslintNextPlugin
import eslintNextPlugin from "@next/eslint-plugin-next";

// Usage:
plugins: {
  next: eslintNextPlugin,
},
rules: {
  ...eslintNextPlugin.configs.recommended.rules,
  "@next/next/no-img-element": "warn",
  "@next/next/no-sync-scripts": "error",
}
```

**What it does**: Enforce Next.js best practices  
**Rules Count**: 8+  
**Examples**:

- `no-html-link-for-pages` - Use Next.js Link
- `no-img-element` - Use Image component
- `no-css-tags` - Use CSS imports
- `no-sync-scripts` - Async scripts only

---

#### 4. **eslint-plugin-import** ⭐ Import/Export

```typescript
// Imported as: importPlugin
import importPlugin from "eslint-plugin-import";

// Usage:
plugins: {
  import: importPlugin,
},
settings: {
  "import/resolver": {
    typescript: {
      alwaysTryTypes: true,
      project: ["./tsconfig.json"],
    },
  },
},
rules: {
  "import/no-unresolved": "error",
  "import/no-duplicates": "error",
  "import/named": "error",
  "import/default": "error",
}
```

**What it does**: Validate and organize imports  
**Rules Count**: 22+  
**Key Features**:

- Import resolution
- No circular dependencies
- Extension consistency
- Alphabetical ordering

---

### Tier 2: Framework & UI (5 Plugins)

#### 5. **eslint-plugin-react** ⭐ React

```typescript
// Imported as: pluginReact
import pluginReact from "eslint-plugin-react";

// Usage:
plugins: {
  react: pluginReact,
},
extends: [pluginReact.configs.flat.recommended],
settings: {
  react: { version: "detect" },
},
rules: {
  "react/prop-types": "warn",
  "react/jsx-key": "error",
  "react/no-unescaped-entities": "warn",
  "react/jsx-no-duplicate-props": "error",
}
```

**What it does**: React component best practices  
**Rules Count**: 20+  
**Examples**:

- Component lifecycle warnings
- Key management
- Fragment optimization
- Display name validation

---

#### 6. **eslint-plugin-react-hooks** ⭐ React Hooks

```typescript
// Imported as: pluginReactHooks
import pluginReactHooks from "eslint-plugin-react-hooks";

// Usage:
plugins: {
  "react-hooks": pluginReactHooks,
},
rules: {
  "react-hooks/rules-of-hooks": "error",
  "react-hooks/exhaustive-deps": "warn",
  "react-hooks/set-state-in-effect": "warn",
}
```

**What it does**: Enforce React Hooks rules  
**Rules Count**: 7  
**Critical Rules**:

- `rules-of-hooks` - Hooks called at top level
- `exhaustive-deps` - Effect dependencies complete

---

#### 7. **eslint-plugin-jsx-a11y** ⭐ Accessibility

```typescript
// Imported as: jsxA11y
import jsxA11y from "eslint-plugin-jsx-a11y";

// Usage:
plugins: {
  "jsx-a11y": jsxA11y,
},
rules: {
  "jsx-a11y/anchor-is-valid": "warn",
  "jsx-a11y/click-events-have-key-events": "warn",
  "jsx-a11y/role-has-required-aria-props": "warn",
}
```

**What it does**: Enforce accessibility standards  
**Rules Count**: 7+  
**Examples**:

- ARIA attributes
- Keyboard events
- Valid semantics
- Image alt text

---

#### 8. **eslint-plugin-better-tailwindcss** ⭐ Tailwind CSS

```typescript
// Imported as: pluginBetterTailwindcss
import pluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";

// Usage:
plugins: {
  "better-tailwindcss": pluginBetterTailwindcss,
},
extends: [
  "better-tailwindcss/recommended-warn",
  "better-tailwindcss/correctness-warn",
  "better-tailwindcss/stylistic-warn",
],
settings: {
  "better-tailwindcss": {
    callees: ["clsx", "cn", "cva", "twMerge"],
    attributes: ["class", "className"],
  },
},
rules: {
  "better-tailwindcss/no-conflicting-classes": "warn",
  "better-tailwindcss/no-duplicate-classes": "warn",
}
```

**What it does**: Tailwind CSS best practices  
**Rules Count**: 5+  
**Examples**:

- Conflicting classes
- Duplicate classes
- Class ordering
- Whitespace optimization

---

#### 9. **eslint-plugin-drizzle** ⭐ Drizzle ORM

```typescript
// Imported as: drizzle
import * as drizzle from "eslint-plugin-drizzle";

// Usage:
plugins: {
  drizzle,
},
rules: {
  "drizzle/enforce-delete-with-where": [
    "error",
    { drizzleObjectName: ["database", "db"] }
  ],
  "drizzle/enforce-update-with-where": [
    "error",
    { drizzleObjectName: ["database", "db"] }
  ],
}
```

**What it does**: Drizzle ORM safety checks  
**Rules Count**: 2  
**Features**:

- Prevent accidental full deletes
- Require WHERE clauses

---

### Tier 3: Code Quality & Formatting (4 Plugins)

#### 10. **eslint-plugin-simple-import-sort** ⭐ Import Sorting

```typescript
// Imported as: pluginSimpleImportSort
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";

// Usage:
plugins: {
  "simple-import-sort": pluginSimpleImportSort,
},
rules: {
  "simple-import-sort/imports": "warn",
  "simple-import-sort/exports": "warn",
}
```

**What it does**: Automatically sort imports  
**Rules Count**: 2  
**Features**:

- Alphabetical sorting
- Grouped imports
- Export ordering

---

#### 11. **eslint-plugin-unused-imports** ⭐ Unused Code

```typescript
// Imported as: unusedImports
import unusedImports from "eslint-plugin-unused-imports";

// Usage:
plugins: {
  "unused-imports": unusedImports,
},
rules: {
  "unused-imports/no-unused-imports": "error",
  "unused-imports/no-unused-vars": [
    "warn",
    { argsIgnorePattern: "^_" }
  ],
}
```

**What it does**: Remove unused imports/variables  
**Rules Count**: 2  
**Features**:

- Auto-fix unused imports
- Underscore pattern support

---

#### 12. **eslint-plugin-prettier** ⭐ Code Formatting

```typescript
// Imported as: pluginPrettier
import pluginPrettier from "eslint-plugin-prettier";

// Usage:
plugins: {
  prettier: pluginPrettier,
},
rules: {
  "prettier/prettier": [
    "error",
    {
      semi: true,
      singleQuote: false,
      printWidth: 100,
      tabWidth: 2,
      trailingComma: "es5",
      plugins: [
        "prettier-plugin-tailwindcss",
        "prettier-plugin-organize-imports",
      ],
    },
  ],
}
```

**What it does**: Enforce Prettier formatting  
**Rules Count**: 1 (with comprehensive options)  
**Prettier Plugins**:

- `prettier-plugin-tailwindcss` - Sort Tailwind classes
- `prettier-plugin-organize-imports` - Organize imports

---

#### 13. **eslint-plugin-zod** ⭐ Zod Validation

```typescript
// Imported as: zod
import * as zod from "eslint-plugin-zod";

// Usage:
plugins: {
  zod: zod as any,
},
rules: {
  "zod/prefer-enum": "error",
  "zod/require-strict": "warn",
}
```

**What it does**: Zod schema validation best practices  
**Rules Count**: 2  
**Features**:

- Enum preference
- Strict mode enforcement

---

### Tier 4: Security & Analysis (2 Plugins)

#### 14. **eslint-plugin-security** ⭐ Security

```typescript
// Imported as: security
import security from "eslint-plugin-security";

// Usage:
plugins: {
  security,
},
rules: {
  "security/detect-object-injection": "off",
  "security/detect-non-literal-regexp": "warn",
  "security/detect-child-process": "warn",
  "security/detect-unsafe-regex": "warn",
}
```

**What it does**: Detect security vulnerabilities  
**Rules Count**: 9  
**Examples**:

- Object injection
- Unsafe regex
- Child processes
- Non-literal filenames
- CSRF vulnerabilities

---

#### 15. **eslint-plugin-sonarjs** ⭐ Code Quality

```typescript
// Imported as: sonarjs
import sonarjs from "eslint-plugin-sonarjs";

// Usage:
plugins: {
  sonarjs,
},
extends: ["sonarjs/recommended"],
rules: {
  "sonarjs/cognitive-complexity": ["warn", 30],
  "sonarjs/no-identical-conditions": "error",
  "sonarjs/no-duplicated-branches": "warn",
}
```

**What it does**: Advanced code quality analysis  
**Rules Count**: 16+  
**Examples**:

- Cognitive complexity
- Duplicated branches
- Identical expressions
- Switch case limits
- Dead code patterns

---

## 🔌 How Plugins are Integrated

### Step 1: Import

```typescript
import pluginName from "eslint-plugin-name";
```

### Step 2: Add to plugins object

```typescript
plugins: {
  "plugin-key": pluginName,
}
```

### Step 3: Extend recommended configs (if available)

```typescript
extends: [
  "plugin-key/recommended",
],
```

### Step 4: Configure specific rules

```typescript
rules: {
  "plugin-key/rule-name": "warn",
}
```

### Step 5: Add settings (if needed)

```typescript
settings: {
  "plugin-key": {
    option1: "value1",
  },
}
```

---

## 📊 Plugin Statistics

| Plugin                           | Type           | Rules    | Extends       |
| -------------------------------- | -------------- | -------- | ------------- |
| @eslint/js                       | Core           | 20+      | Yes           |
| @typescript-eslint               | Type Safety    | 45+      | Yes           |
| @next/eslint-plugin-next         | Framework      | 8+       | Yes           |
| eslint-plugin-react              | UI Library     | 20+      | Yes           |
| eslint-plugin-react-hooks        | Hooks          | 7        | Yes           |
| eslint-plugin-jsx-a11y           | Accessibility  | 7+       | No            |
| eslint-plugin-import             | Imports        | 22+      | No            |
| eslint-plugin-simple-import-sort | Formatting     | 2        | No            |
| eslint-plugin-unused-imports     | Code Quality   | 2        | No            |
| eslint-plugin-better-tailwindcss | CSS            | 5+       | Yes           |
| eslint-plugin-drizzle            | Database       | 2        | No            |
| eslint-plugin-zod                | Validation     | 2        | No            |
| eslint-plugin-prettier           | Formatting     | 1        | No            |
| eslint-plugin-security           | Security       | 9        | No            |
| eslint-plugin-sonarjs            | Quality        | 16+      | Yes           |
| **Total**                        | **15 plugins** | **155+** | **8 extends** |

---

## ⚡ Quick Command Reference

```bash
# Check configuration
pnpm lint

# Fix issues automatically
pnpm lint:fix

# Strict mode (fail on warnings)
pnpm lint:strict

# Check types
pnpm type-check

# Full validation
pnpm validate
```

---

## 🎨 File Coverage

- ✅ JavaScript (.js, .jsx, .mjs, .cjs)
- ✅ TypeScript (.ts, .tsx, .mts, .cts)
- ✅ React JSX/TSX files
- ✅ JSON & JSONC files
- ✅ Markdown files
- ✅ CSS files
- ✅ Config files
- ✅ Type definition files (.d.ts)
- ✅ Test files

---

## 🔍 Checking Plugin Rules

To see all available rules for a plugin:

```bash
# Example: View all React rules
npx eslint --format json 2>/dev/null | grep '"ruleId"'

# Or check documentation
# https://github.com/plugin-name/eslint-plugin-name#rules
```

---

## 📝 Configuration File Location

**File**: `C:\Users\Alexa\Desktop\SandBox\comicwise\eslint.config.ts`

**Format**: ESLint Flat Config (ESLint 9+)

**Language**: TypeScript

---

## ✨ Advanced Features

### 1. Type-Aware Rules

Enabled for `.ts` and `.tsx` files with:

```typescript
parserOptions: {
  project: ["./tsconfig.json"],
}
```

### 2. File-Specific Overrides

Different rules for:

- Test files (relaxed type checking)
- Config files (allow requires)
- Type stubs (no strict any checking)
- Hooks directory (project: null)

### 3. Global Ignores

Excludes these patterns:

- `**/.next/**` - Next.js build
- `**/node_modules/**` - Dependencies
- `**/dist/**` - Build output
- `**/docs/**` - Documentation

### 4. Prettier Integration

Fully configured with:

- Tailwind class sorting
- Import organization
- 100 character line width
- ES5 trailing commas

---

## 🚀 Implementation Complete

All 15 ESLint plugins are now fully configured with:

- ✅ Proper imports
- ✅ Plugin registration
- ✅ Config extends
- ✅ Comprehensive rules
- ✅ Plugin-specific settings
- ✅ File-specific overrides

**Last Updated**: 2025-12-13
