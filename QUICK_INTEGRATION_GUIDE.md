# Quick Integration Guide

**Fast-track implementation of the 4 optimized features**

---

## 🚀 5-Minute Quick Start

### Step 1: Verify Files Created (30 seconds)

```bash
# Check all files exist
ls src/lib/actions/authOptimized.ts
ls src/lib/seedHelpers.ts
ls src/components/admin/AdminUsersOptimized.tsx
ls src/components/profile/ProfileManagement.tsx
```

✅ **Expected:** All 4 files should exist

---

### Step 2: Update Validation Schemas (1 minute)

Add missing types to `src/lib/validations/index.ts`:

```typescript
export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationEmailInput = z.infer<
  typeof resendVerificationEmailSchema
>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// Add insert schemas for seeding
export const userInsertSchema = createInsertSchema(user);
export const comicInsertSchema = createInsertSchema(comic);
export const chapterInsertSchema = createInsertSchema(chapter);
```

---

### Step 3: Update Auth Pages (2 minutes)

**Replace imports in all auth pages:**

```typescript
// OLD
import { signInAction } from "@/dto/authDto";

// NEW
import { signInActionOptimized as signInAction } from "#lib/actions/authOptimized";
```

**Files to update:**

- `src/app/(auth)/sign-in/page.tsx`
- `src/app/(auth)/sign-up/page.tsx`
- `src/app/(auth)/verify-email/page.tsx`
- `src/app/(auth)/forgot-password/page.tsx`
- `src/app/(auth)/reset-password/page.tsx`
- `src/app/(auth)/resend-verification/page.tsx`

---

### Step 4: Test Authentication (1 minute)

```bash
pnpm dev
```

Visit: `http://localhost:3000/sign-up`

1. Register new account
2. Check email for verification
3. Verify email
4. Sign in

---

### Step 5: Update Seeding (30 seconds)

**Option A - Quick Test:**

```bash
# Create a simple test script
node -e "require('./src/lib/seedHelpers.ts').seedAll({ verbose: true, dryRun: true })"
```

**Option B - Full Integration:**

Update `src/database/seed/index.ts`:

```typescript
import { seedAll } from "#lib/seedHelpers";

async function seed() {
  const result = await seedAll({
    verbose: true,
    batchSize: 100,
  });

  console.log(result);
}

seed();
```

---

## 📋 Integration Checklist

### Authentication ✅

- [ ] Export types from validations
- [ ] Update sign-in page
- [ ] Update sign-up page
- [ ] Update verify-email page
- [ ] Update forgot-password page
- [ ] Update reset-password page
- [ ] Update resend-verification page
- [ ] Test complete auth flow

### Seeding ✅

- [ ] Add insert schemas to validations
- [ ] Update seed index file
- [ ] Test with dry-run
- [ ] Run actual seeding
- [ ] Verify data in database

### Admin Components ✅

- [ ] Create admin users page
- [ ] Import AdminUsersOptimized
- [ ] Create user actions
- [ ] Test CRUD operations
- [ ] Add to admin navigation

### Profile Management ✅

- [ ] Update profile page
- [ ] Import ProfileManagement
- [ ] Pass user data
- [ ] Pass bookmark count
- [ ] Test profile updates

---

## 🎯 Common Issues & Solutions

### Issue: Type errors on validation schemas

**Solution:**

```typescript
// Add to src/lib/validations/index.ts
import { createInsertSchema } from "drizzle-zod";
import { user, comic, chapter } from "#schema";

export const userInsertSchema = createInsertSchema(user);
export const comicInsertSchema = createInsertSchema(comic);
export const chapterInsertSchema = createInsertSchema(chapter);
```

### Issue: Import errors

**Solution:**

```bash
# Restart TypeScript server in VS Code
Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Issue: Rate limiting not working

**Solution:** Check `app-config.ts`:

```typescript
export const appConfig = {
  rateLimit: {
    auth: { requests: 5, window: 900 },
    email: { requests: 3, window: 3600 },
  },
};
```

### Issue: Emails not sending

**Solution:** Check `.env.local`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🧪 Testing Commands

```bash
# Type check
pnpm type-check

# Lint
pnpm lint:fix

# Build
pnpm build

# Test seeding (dry run)
pnpm db:seed --dry-run

# Test seeding (actual)
pnpm db:seed

# Run dev server
pnpm dev
```

---

## 📝 Quick Reference

### Auth Actions Available

```typescript
signInActionOptimized(input: SignInInput)
registerUserActionOptimized(input: SignUpInput)
verifyEmailActionOptimized(input: VerifyEmailInput)
resendVerificationEmailActionOptimized(input: ResendVerificationEmailInput)
forgotPasswordActionOptimized(input: ForgotPasswordInput)
resetPasswordActionOptimized(input: ResetPasswordInput)
updateProfileActionOptimized(userId: string, input: UpdateProfileInput)
updatePasswordActionOptimized(userId: string, input: UpdatePasswordInput)
signOutActionOptimized()
```

### Seed Functions Available

```typescript
seedUsers(options?: SeedOptions): Promise<SeedResult>
seedComics(options?: SeedOptions): Promise<SeedResult>
seedChapters(options?: SeedOptions): Promise<SeedResult>
seedAll(options?: SeedOptions): Promise<AllSeedResults>
```

### Admin Component Props

```typescript
interface AdminUsersProps {
  users: User[];
  createUserAction: (data: CreateUserInput) => Promise<ActionResponse>;
  updateUserAction: (
    id: string,
    data: UpdateUserInput
  ) => Promise<ActionResponse>;
  deleteUserAction: (id: string) => Promise<ActionResponse>;
}
```

### Profile Component Props

```typescript
interface ProfileManagementProps {
  user: User;
  bookmarkCount?: number;
}
```

---

## ✨ Success Indicators

✅ **Authentication working when:**

- Sign-up creates user
- Verification email sent
- Email verification works
- Sign-in successful
- Password reset works

✅ **Seeding working when:**

- Dry-run shows correct counts
- Validation passes
- Data inserted successfully
- No duplicate errors

✅ **Admin working when:**

- Users table displays
- Create dialog opens
- User creation works
- Edit updates user
- Delete removes user

✅ **Profile working when:**

- User info displays
- Tabs switch correctly
- Edit profile opens
- Updates save successfully
- Toast notifications appear

---

**Integration Time:** ~5-10 minutes  
**Testing Time:** ~5-10 minutes  
**Total:** ~15-20 minutes to full integration

---

_For detailed information, see FEATURE_IMPLEMENTATION_COMPLETE.md_
