# 🧹 ESLint & Prettier Configuration Guide

**Date**: December 13, 2025  
**Status**: ✅ Configured and Ready

---

## ✅ PLUGINS INSTALLED & CONFIGURED

### **ESLint Plugins**

- ✅ `eslint-plugin-import` - Import statement best practices
- ✅ `@typescript-eslint/eslint-plugin` - TypeScript support
- ✅ `eslint-plugin-react` - React best practices
- ✅ `eslint-plugin-react-hooks` - React hooks rules
- ✅ `eslint-plugin-next` - Next.js specific rules
- ✅ `eslint-plugin-better-tailwindcss` - Tailwind CSS class optimization
- ✅ `eslint-plugin-drizzle` - Drizzle ORM best practices
- ✅ `eslint-plugin-zod` - Zod validation rules
- ✅ `eslint-plugin-security` - Security best practices
- ✅ `eslint-plugin-simple-import-sort` - Import sorting
- ✅ `eslint-plugin-unused-imports` - Detect unused imports
- ✅ `eslint-plugin-prettier` - Prettier integration
- ✅ `eslint-config-next` - Next.js config
- ✅ `eslint-config-prettier` - Prettier compatibility

### **Prettier Plugins**

- ✅ `prettier-plugin-tailwindcss` - Tailwind class sorting
- ✅ `prettier-plugin-organize-imports` - Import organization

---

## 📋 CONFIGURATION FILES

### **eslint.config.ts**

**Status**: ✅ Fully configured  
**Features**:

- Import resolver with TypeScript support
- React and Next.js rules
- Tailwind CSS validation
- Drizzle ORM checks
- Security checks
- Unused imports detection

**Key Settings**:

```typescript
"import/resolver": {
  typescript: {
    alwaysTryTypes: true,
    project: ["./tsconfig.json"],
  },
  node: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".mts", ".cts"],
  },
}
```

### **prettier.config.ts**

**Status**: ✅ Fully configured  
**Features**:

- Tailwind class sorting
- Automatic import organization
- JSON and Markdown overrides
- Consistent line endings (LF)
- 100-character print width

**Plugins**:

```typescript
plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-organize-imports"];
```

---

## 🚀 AVAILABLE COMMANDS

```bash
# Format code (auto-fix)
pnpm format

# Check formatting without changes
pnpm format:check

# Run linter
pnpm lint

# Run linter with auto-fix
pnpm lint --fix

# Type checking
pnpm type-check

# Run all checks
pnpm validate

# Run all checks with fixes
pnpm lint --fix && pnpm format
```

---

## 🎯 LINTING RULES CONFIGURED

### **TypeScript Rules**

- Strict typing
- No `any` types (enforced)
- Proper null/undefined handling
- Arrow function return types

### **Import Rules**

- No unresolved imports
- No duplicate imports
- Proper import ordering
- Unused imports detection

### **React Rules**

- React hooks dependency arrays
- Component naming conventions
- JSX key requirements
- Proper component structure

### **Next.js Rules**

- Image optimization
- Link component usage
- Script tag optimization
- Font optimization

### **Code Quality**

- No console logs in production
- No debugger statements
- Consistent return statements
- Proper error handling

### **Security**

- XSS prevention
- SQL injection prevention
- Proper dependency usage

### **Tailwind CSS**

- Class order consistency
- No conflicting classes
- No unregistered classes
- Proper spacing and wrapping

---

## 🔧 HOW TO FIX ISSUES

### **Auto-Fix Compatible Issues**

```bash
# Auto-fix all formatting issues
pnpm format

# Auto-fix all lint issues (where possible)
pnpm lint --fix

# Do both
pnpm lint --fix && pnpm format
```

### **Manual Fix Issues**

Some issues require manual fixes:

1. `any` type usage - Replace with proper types
2. Unused imports - Remove unused imports
3. TypeScript errors - Fix type mismatches
4. Accessibility issues - Add proper ARIA labels
5. Security warnings - Review and fix vulnerabilities

---

## 📊 COMMON ISSUES & FIXES

### **Issue: Unused Variables**

**Fix**: Remove the variable or use it

```typescript
// ❌ Bad
const unused = 5;

// ✅ Good
const used = 5;
console.log(used);
```

### **Issue: Missing Return Type**

**Fix**: Add explicit return type

```typescript
// ❌ Bad
function getValue() {
  return 42;
}

// ✅ Good
function getValue(): number {
  return 42;
}
```

### **Issue: Import Order**

**Fix**: Use auto-fix

```bash
pnpm lint --fix
```

### **Issue: Tailwind Classes**

**Fix**: Use prettier auto-format

```bash
pnpm format
```

### **Issue: Console Warnings**

**Fix**: Remove or suppress console logs

```typescript
// ❌ Bad
console.log("Debug message");

// ✅ Good (if needed)
console.error("Error occurred");

// ✅ Good (silent)
// Remove the log entirely
```

---

## ✅ QUALITY CHECKLIST

- [ ] No TypeScript errors (`pnpm type-check`)
- [ ] All imports resolved (`pnpm lint`)
- [ ] No unused imports
- [ ] Proper code formatting (`pnpm format`)
- [ ] No console logs (except errors/warnings)
- [ ] No `any` types without `// @ts-expect-error`
- [ ] All functions have return types
- [ ] No security warnings
- [ ] Tailwind classes properly sorted
- [ ] No conflicting Tailwind classes

---

## 🚀 QUICK START FOR TEAM

**New team member setup**:

```bash
# 1. Install dependencies
pnpm install

# 2. Auto-fix all issues
pnpm lint --fix && pnpm format

# 3. Verify no errors
pnpm type-check && pnpm lint

# 4. You're ready to code!
```

**Before committing**:

```bash
# 1. Format all files
pnpm format

# 2. Run linter with fixes
pnpm lint --fix

# 3. Type check
pnpm type-check

# 4. Commit changes
git add .
git commit -m "chore: format and lint code"
```

---

## 📝 ESLINT RULES REFERENCE

### **Severity Levels**

- `error` (2) - Breaks build, must fix
- `warn` (1) - Show warning, doesn't break build
- `off` (0) - Disabled

### **Common Rules Modified**

```typescript
"no-console": ["warn", { allow: ["warn", "error", "log"] }],
"no-debugger": "error",
"@typescript-eslint/no-explicit-any": "warn",
"import/no-unresolved": "error",
"react/react-in-jsx-scope": "off",  // Next.js handles this
"react/prop-types": "off",  // Using TypeScript instead
```

---

## 🔍 RUNNING SPECIFIC CHECKS

```bash
# Check only TypeScript files
pnpm lint --ext .ts,.tsx

# Check only JavaScript files
pnpm lint --ext .js,.jsx

# Check specific directory
pnpm lint src/

# Check specific file
pnpm lint src/app/page.tsx

# Fix specific file
pnpm lint --fix src/app/page.tsx
```

---

## 📊 PROJECT STANDARDS

### **TypeScript**

- Strict mode: enabled
- No implicit any: enforced
- Proper null checking: required

### **Code Style**

- Print width: 100 characters
- Indentation: 2 spaces
- Quotes: Double quotes
- Semicolons: None
- Trailing comma: ES5 style

### **Import Order**

1. Node.js built-ins
2. External packages
3. Internal imports
4. Sibling imports
5. Type imports

### **Naming Conventions**

- Components: PascalCase
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Types/Interfaces: PascalCase

---

## 🎯 NEXT STEPS

1. ✅ All plugins installed
2. ✅ ESLint configured with import resolver
3. ✅ Prettier configured with plugins
4. 📋 Run `pnpm lint --fix` to fix auto-fixable issues
5. 📋 Manually fix remaining issues (TypeScript errors, security warnings)
6. ✅ Run `pnpm format` to format all code
7. ✅ Verify with `pnpm type-check`

---

## 📚 RESOURCES

- [ESLint Documentation](https://eslint.org)
- [Prettier Documentation](https://prettier.io)
- [TypeScript ESLint](https://typescript-eslint.io)
- [Tailwind CSS Linting](https://tailwindcss.com/docs/linting)
- [Next.js ESLint](https://nextjs.org/docs/basic-features/eslint)

---

**Status**: ✅ Ready for use  
**Date**: December 13, 2025  
**Maintained By**: ComicWise Team
