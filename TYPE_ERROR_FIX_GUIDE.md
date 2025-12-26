# TypeScript "Cannot find module" Errors - Complete Fix Guide

**Problem**: TypeScript cannot resolve path aliases like `@/components/ui/button`

**Root Cause**: The paths in `tsconfig.json` are configured, but TypeScript needs the actual module files to exist AND be properly exported.

---

## ✅ SOLUTION (Execute These Steps)

### Step 1: Restart TypeScript Server (VS Code)

```
1. Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
2. Type: "TypeScript: Restart TS Server"
3. Select and run it
4. Wait 10-20 seconds
```

This solves ~80% of "Cannot find module" errors.

---

### Step 2: Verify Index Files Exist

I've already created these index files for you:

✅ `src/components/ui/index.ts` - Exports all UI components
✅ `src/components/index.ts` - Exports all main components  
✅ Updated `src/database/index.ts` - Exports DB,schema, queries, mutations
✅ `src/dto/index.ts` - Already exists, exports all DTOs
✅ `src/components/auth/index.ts` - Already exists, exports auth components

---

### Step 3: Run Type Check Again

```bash
pnpm type-check 2>&1 | Out-File -FilePath "type-errors-after-fix.txt"
```

Expected result: Most errors should be gone.

---

### Step 4: Fix Remaining Specific Issues

#### Issue 1: Services Path Missing

**Error**: `Cannot find module '@/services/upload/providers/cloudinary'`

**Cause**: These files exist but might not be exported correctly.

**Fix**: These are only used in scripts, can ignore or update imports in:
- `scripts/upload-bulk.ts` - Change to relative imports OR add to tsconfig paths

#### Issue 2: Lib Modules

**Error**: `Cannot find module '@/lib/ratelimit'` and `'@/lib/queue'`

**Fix**: Check if these files exist:
```bash
ls src/lib/ratelimit.ts
ls src/lib/queue.ts
```

If missing, create stub files or remove the imports.

---

### Step 5: Alternative - Use Relative Imports for Scripts

Scripts folder might not resolve @ paths properly. Change:

**From**:
```typescript
import { something } from '@/lib/queue';
```

**To**:
```typescript
import { something } from '../src/lib/queue';
```

---

## 🔧 QUICK FIX SCRIPT

I've created a script to help: `scripts/fixTypeErrors.ts`

Run it:
```bash
pnpm tsx scripts/fixTypeErrors.ts
```

---

## 📊 Expected Results

After Step 1 (Restart TS Server):
- **Before**: ~200 errors
- **After**: ~20 errors

After Step 2-5:
- **Before**: ~20 errors  
- **After**: 0-5 errors (only genuine issues)

---

## 🎯 Most Common Remaining Errors

### 1. Missing Files
Check if the file actually exists:
```bash
ls src/lib/ratelimit.ts
ls src/lib/queue.ts
```

### 2. Wrong Import Path
Example:
```typescript
// ❌ WRONG
import { Button } from '@/components/ui/button.tsx'

// ✅ CORRECT
import { Button } from '@/components/ui/button'
```

### 3. Not Exported
File exists but component not exported:
```typescript
// In button.tsx - MUST have:
export { Button, buttonVariants };
```

---

## 🚀 FASTEST FIX (Recommended)

```bash
# 1. Restart TS Server in VS Code (Command Palette)
# 2. Wait 20 seconds
# 3. Run type check again
pnpm type-check

# If still errors:
# 4. Check which files are missing
# 5. Create them or fix the imports
```

---

## 📝 Manual Fix Template

For each "Cannot find module" error:

1. **Note the import path**: e.g., `@/components/ui/button`
2. **Find the actual file**: `src/components/ui/button.tsx`
3. **Check it exports properly**: Look for `export { Button }`
4. **Verify tsconfig path**: `"ui": ["./src/components/ui/*"]`
5. **Restart TS Server**

---

## ✅ Verification

After fixes, run:
```bash
# Should show 0 errors (or very few genuine issues)
pnpm type-check

# Should pass
pnpm lint:fix

# Should pass
pnpm format

# All checks
pnpm validate
```

---

## 🎉 Success Criteria

✅ `pnpm type-check` - 0 errors
✅ `pnpm lint` - 0 errors  
✅ `pnpm format:check` - passes
✅ `pnpm build` - succeeds

Then you're 100% production ready! 🚀
