# GitHub Copilot Chat Prompts — ComicWise Development

**Usage**: Copy a prompt section into GitHub Copilot Chat (Cmd/Ctrl+I) and paste
the prompt text below the dashed line.

---

## 🔷 P0 — IMMEDIATE (Must Do First)

### P0.1 — Fix TypeScript Errors & Missing Imports

**Duration**: 30-60 minutes  
**Token Cost**: ~400 tokens  
**Acceptance**: `pnpm type-check` passes with zero errors

```
---
Scan the repository for TypeScript errors, missing imports, and non-aliased
import paths. Produce a minimal patch that fixes import paths like
`from 'hooks/..'` to `from '@/hooks/..'` and removes stray unused variables.

Show the list of files changed and run `pnpm type-check` to verify.

Use @eslint.config.ts and @tsconfig.json as reference for correct aliases.
---
```

### P0.2 — Verify ESLint Configuration

**Duration**: 15-30 minutes  
**Token Cost**: ~250 tokens  
**Acceptance**: `pnpm lint` runs without timeout, all 15 plugins configured

```
---
Review the ESLint flat config in @eslint.config.ts and verify:

1. All 15 ESLint plugins are properly imported:
   - @typescript-eslint/eslint-plugin
   - eslint-plugin-react
   - eslint-plugin-react-hooks
   - @next/eslint-plugin-next
   - eslint-plugin-import
   - eslint-plugin-simple-import-sort
   - eslint-plugin-unused-imports
   - eslint-plugin-prettier
   - eslint-plugin-jsx-a11y
   - eslint-plugin-better-tailwindcss
   - eslint-plugin-drizzle
   - eslint-plugin-zod
   - eslint-plugin-security
   - eslint-plugin-sonarjs (bonus)
   - @eslint/css (bonus)

2. Each plugin has rules configured in the main config block
3. File-specific configs for TS, JS, tests, Markdown, CSS, JSON are present
4. Global ignores include .next, node_modules, dist, build

Report any missing plugins or configuration gaps with a minimal patch.
---
```

### P0.3 — Setup & Verify Environment Configuration

**Duration**: 20-30 minutes  
**Token Cost**: ~300 tokens  
**Acceptance**: `.env.local` created, no runtime env errors in `pnpm dev`

```
---
Ensure environment configuration is correct:

1. Check .env.example for all required variables
2. Create .env.local template with placeholders
3. Create src/app-config/index.ts that:
   - Loads environment using dotenv-safe
   - Validates shape using zod
   - Exports typed constants (DATABASE_URL, NEXTAUTH_URL, etc.)
   - Provides fallback values for development
   - Throws helpful errors for missing required vars in production

Update .env.example with all required and optional variables.
Export TypeScript types for IDE autocomplete.

Provide a code block showing proper usage in a component.
---
```

---

## 🔷 P1 — HIGH PRIORITY (Week 1)

### P1.1 — Harden Drizzle ORM Typing

**Duration**: 2-3 hours  
**Token Cost**: ~600 tokens  
**Acceptance**: Database queries have strict types, no `any`

```
---
Audit the Drizzle schema and queries in src/database.

1. Review src/database/schema.ts and ensure all tables have:
   - Proper primary keys and unique constraints
   - Indexes for frequently queried columns (slug, email, createdAt)
   - Proper foreign key relations

2. Create src/types/database.d.ts with TypeScript interfaces:
   - ComicWithChapters (comic + chapters relation)
   - ChapterWithComic (chapter + comic relation)
   - UserWithStats (user + reading stats)
   - ComicSearchResult (for search queries)

3. Update all database query files to use these types instead of any
4. Provide sample queries for each type

Run pnpm type-check and report remaining issues.
---
```

### P1.2 — Wire NextAuth v5 + Drizzle Adapter

**Duration**: 3-4 hours  
**Token Cost**: ~700 tokens  
**Acceptance**: Sign-in/sign-up flows work, auth endpoints respond

```
---
Scaffold complete NextAuth v5 configuration with Drizzle adapter:

1. Create src/lib/authConfig.ts with:
   - Session strategy: JWT-based sessions
   - Drizzle adapter initialization
   - Credential provider (email/password)
   - Google OAuth provider (optional)
   - Callbacks for signIn, jwt, session
   - CSRF and secure settings

2. Create src/lib/authAdapter.ts to initialize Drizzle adapter:
   - Account, Session, User table mappings
   - Proper typing for adapter

3. Create src/lib/auth.ts with server-side helpers:
   - getSession() - Get current user session
   - getCurrentUser() - Get logged-in user from database
   - signOut() - Server-side sign out

4. Create src/app/(auth)/sign-in/page.tsx:
   - Email/password form
   - Server action for authentication
   - Error handling and validation
   - Link to sign-up page

5. Create src/app/(auth)/sign-up/page.tsx:
   - Registration form with Zod validation
   - Server action for creating account
   - Password confirmation
   - Email verification setup (basic)

6. Create email templates in src/components/emails/:
   - VerificationEmail.tsx
   - WelcomeEmail.tsx

7. Setup Nodemailer config in src/lib/email.ts

Validate by running pnpm dev and testing sign-up/sign-in locally.
---
```

### P1.3 — Convert Admin Forms to Server Actions

**Duration**: 2-3 hours  
**Token Cost**: ~600 tokens  
**Acceptance**: All admin forms use server actions, validation works

```
---
Convert admin create/edit form handlers to use Zod-validated server actions.

Focus on these entities (do in order):
1. Authors (src/app/admin/authors)
2. Artists (src/app/admin/artists)
3. Genres (src/app/admin/genres)
4. Types (src/app/admin/types)
5. Comics (src/app/admin/comics)
6. Chapters (src/app/admin/chapters)

For each entity:

1. Create Zod schema in src/lib/validations/schemas.ts:
   - Required fields validation
   - String length constraints
   - Slug generation rules
   - Custom error messages

2. Create server action in src/app/admin/[entity]/actions.ts:
   - Validate input with Zod schema
   - Check authorization (admin only)
   - Create/update/delete database record
   - Return success/error response
   - Log action

3. Update form component:
   - Remove client-side form state
   - Call server action on submit
   - Display validation errors
   - Handle loading state
   - Show toast notifications

4. Keep file uploads client-side:
   - Use useImageUpload hook
   - Upload file first, get URL
   - Include URL in server action payload

Provide patches per entity with working examples.
Run pnpm type-check after each entity.
---
```

### P1.4 — Centralize Image Upload Hook & Logic

**Duration**: 2-3 hours  
**Token Cost**: ~500 tokens  
**Acceptance**: useImageUpload hook works, upload adapters abstracted

```
---
Create centralized image upload infrastructure:

1. Create src/hooks/useImageUpload.ts:
   - React hook for uploading files
   - Progress tracking (loading, progress %, error)
   - Support multiple file types (image, pdf)
   - Size validation (max 10MB images, 50MB pdfs)
   - Return uploaded URL or error
   - TypeScript types exported
   - Example usage comments

2. Create src/services/upload/:
   - cloudinary.ts - Cloudinary adapter with uploadImage(file) function
   - imagekit.ts - ImageKit adapter
   - s3.ts - AWS S3 adapter
   - local.ts - Local file upload (dev fallback)
   - types.ts - UploadProvider interface
   - factory.ts - Provider selection based on env

3. Create src/lib/image.ts utility functions:
   - getResponsiveSrcSet(url) - Generate responsive images
   - getImageUrl(path) - Get full CDN URL
   - transformImage(url, width, height, quality) - Image transformations
   - deleteImage(url) - Cleanup

4. Create src/components/admin/ClientImageUploader.tsx:
   - Dropzone component using react-dropzone
   - Preview image before upload
   - Upload progress indicator
   - Error handling
   - Uses useImageUpload hook internally

5. Update .env.example with provider configs:
   - UPLOAD_PROVIDER (cloudinary|imagekit|s3|local)
   - Provider-specific credentials

Wire into admin form components with server action to save final URL.
Test upload with dev provider (local or free tier).
---
```

---

## 🔷 P2 — MEDIUM PRIORITY (Week 2-3)

### P2.1 — Scaffold Admin CRUD Pages

**Duration**: 4-6 hours  
**Token Cost**: ~800 tokens per entity  
**Acceptance**: All admin pages render, CRUD operations work

```
---
Create CRUD admin pages for main entities. Start with Comics.

For each entity (Comics, Chapters, Users):

1. Create src/app/admin/[entity]/page.tsx:
   - Server component that fetches all records
   - Display as table with pagination (cursor-based)
   - Columns: id, name/title, slug, status, createdAt, actions
   - Filter/search by text
   - Sort by column headers
   - Bulk delete checkbox
   - Action buttons: View, Edit, Delete

2. Create src/app/admin/[entity]/new/page.tsx:
   - Form component using shadcn/ui
   - Zod validation schema
   - Server action for creation
   - Redirect to view page on success
   - Toast notification on error
   - Cancel button

3. Create src/app/admin/[entity]/[id]/page.tsx:
   - Pre-populate form with record data
   - Server action for update
   - Delete button with confirmation modal
   - Read-only fields (id, createdAt, updatedAt)

4. Create src/components/admin/[Entity]Form.tsx:
   - Client form component
   - Input fields matching schema
   - File upload for images (use useImageUpload)
   - Error messages below inputs
   - Submit button with loading state
   - Keyboard navigation support

5. Add routes to admin layout with sidebar nav

Pagination & Filtering:
- Use cursor-based pagination (not offset)
- Take 25 records per page
- Pass cursor in query string: ?cursor=abc123
- Show "Load More" or previous/next buttons

Provide working example for Comics entity first.
Test all CRUD operations manually.
---
```

### P2.2 — Setup GitHub Actions CI/CD

**Duration**: 1-2 hours  
**Token Cost**: ~400 tokens  
**Acceptance**: CI workflow runs on PR, all checks pass

```
---
Create .github/workflows/ci.yml that:

1. Triggers on:
   - Push to main and develop branches
   - Pull requests to main and develop

2. Jobs:
   a) Install & Type Check (node 20)
      - Setup Node with pnpm cache
      - pnpm install
      - pnpm type-check
      - Upload type errors artifact if fails

   b) Lint & Format
      - pnpm lint (allow warnings)
      - pnpm format:check
      - Report linting issues

   c) Unit Tests
      - pnpm test:unit:run
      - Generate coverage report
      - Upload coverage to Codecov (optional)
      - Fail if coverage < 60%

   d) Build
      - pnpm build
      - Upload build artifact
      - Check bundle size (warn if > 200KB)

   e) E2E Tests (optional, can run on schedule)
      - pnpm test --reporter=html
      - Upload Playwright report
      - Fail on any failures

3. Notifications:
   - Post status to PR comments
   - Slack webhook on failure (optional)

4. Requirements:
   - All jobs must pass before merging
   - Require status checks in branch protection rules

Provide complete workflow file and instructions for setup.
---
```

### P2.3 — Database Seeding with Realistic Data

**Duration**: 2-3 hours  
**Token Cost**: ~500 tokens  
**Acceptance**: `pnpm db:seed` populates test data reliably

```
---
Create robust database seeding script at src/database/seed/index.ts:

1. Load JSON fixtures:
   - Read comicsdata1.json, comicsdata2.json
   - Read users.json
   - Validate JSON structure

2. Use faker for missing/realistic data:
   - Generate descriptions if missing
   - Create realistic URLs
   - Generate timestamps
   - Create related records (chapters for comics)

3. Drizzle insert with:
   - Batch inserts (1000 records per batch)
   - Error handling per record
   - Transaction wrapping
   - Proper foreign key handling
   - Slug generation (title -> url-slug)

4. CLI flags support:
   - --dry-run: Show SQL without executing
   - --skip-images: Skip image downloads
   - --users-only: Seed only users
   - --comics-only: Seed only comics
   - --chapters-only: Seed only chapters
   - --verbose: Detailed logging
   - --count N: Seed N records per entity

5. Logging:
   - Print summary: X users, Y comics, Z chapters created
   - Warn on duplicate slug/email
   - Show execution time
   - Error handling with rollback info

6. Idempotency:
   - Check existing records before insert
   - Update instead of insert if exists
   - Preserve manually created records

7. Add pnpm scripts:
   - pnpm db:seed
   - pnpm db:seed:no-images
   - pnpm db:seed:dry-run
   - pnpm db:seed:verbose

Test with --dry-run first, then live seed.
Validate data in database studio: pnpm db:studio
---
```

### P2.4 — Optimize Docker Configuration

**Duration**: 1-2 hours  
**Token Cost**: ~350 tokens  
**Acceptance**: Docker compose up works, images are optimized

```
---
Review and optimize Docker configuration:

1. Dockerfile improvements:
   - Use node:20-alpine as base (multi-stage)
   - Build stage: Install deps, run build
   - Runtime stage: Copy built files only
   - Use non-root user for security
   - Add HEALTHCHECK instruction
   - Optimize layer caching
   - .dockerignore to exclude unnecessary files

2. docker-compose.yml:
   - PostgreSQL 17 service with:
     - Volume for persistence
     - HEALTHCHECK
     - Environment variables
     - Port 5432 exposed
   - Redis service (optional) with:
     - Volume for persistence
     - Port 6379 exposed
   - Next.js app service with:
     - HEALTHCHECK for /api/health
     - Depends on PostgreSQL
     - Environment variables
     - Port 3000 exposed
   - Nginx reverse proxy (optional):
     - Port 80/443
     - SSL support
     - Compression

3. docker-compose.dev.yml:
   - Hot reload volumes for src/
   - Expose source maps for debugging
   - Extended logging

4. Add scripts:
   - docker-compose/setup.sh - Initialize containers
   - docker-compose/seed.sh - Run seed in container
   - test-docker.sh - Integration tests

5. Security:
   - Use secrets for sensitive vars
   - Non-root user in container
   - Read-only filesystem where possible
   - Network security (expose only needed ports)

6. Performance:
   - Image layer caching
   - Multi-stage builds
   - Minimal final image size (< 200MB)
   - Resource limits (memory, CPU)

Provide updated Dockerfile and compose files with comments.
Test locally: docker-compose up --build
---
```

---

## 🔷 P3 — LOW PRIORITY (Nice-to-Have)

### P3.1 — Performance Optimization

**Duration**: 3-4 hours  
**Token Cost**: ~600 tokens  
**Acceptance**: Lighthouse score > 90, build time < 60s

```
---
Implement performance optimizations:

1. Image Optimization:
   - Use next/image for all images
   - Generate responsive srcset
   - Lazy load images below fold
   - Serve WebP format where supported
   - Optimize using sharp

2. Code Splitting:
   - Dynamic import() for heavy components
   - Route-based code splitting
   - Separate admin chunks
   - Tree-shaking unused code

3. Database Optimization:
   - Add indexes for frequently queried columns
   - Use prepared statements
   - Implement query result caching
   - Optimize N+1 queries

4. Build Optimization:
   - Analyze bundle size: pnpm build:analyze
   - Remove unused dependencies
   - Tree-shake unused exports
   - Minify and compress assets

5. Runtime Optimization:
   - Enable gzip/brotli compression
   - Cache headers for static assets
   - CDN for images and fonts
   - Service Worker for offline support

Report improvements using:
- Lighthouse audit
- Bundle analysis
- Web Vitals metrics
- Build time comparison
---
```

### P3.2 — Advanced Search & Indexing

**Duration**: 2-3 hours  
**Token Cost**: ~450 tokens  
**Acceptance**: Full-text search works, autocomplete responsive

```
---
Implement advanced search functionality:

1. Full-Text Search:
   - Add GIN indexes on PostgreSQL for title, description
   - Create search API route
   - Implement search query parser
   - Support filters (genre, author, rating)

2. Autocomplete:
   - Create separate search suggestions table
   - Cache frequently searched terms
   - Implement typeahead UI component
   - Show recent searches

3. Search Analytics:
   - Log search queries (anonymized)
   - Track popular searches
   - Recommend trending searches

Provide working example with UI component and API route.
---
```

---

## 📋 Quick Reference — Prompt Strategies

### Token Optimization

- **Use @references** to provide file context without retyping
- **Batch related tasks**: Group 3-5 related items in one prompt
- **Use slash commands**:
  - `/fix` for quick bug fixes (~50 tokens)
  - `/explain` to understand code (~100 tokens)
  - `/doc` to generate documentation (~150 tokens)

### When to Split Prompts

- Different domains (DB vs UI)
- Distinct file types (config vs components)
- Long prompts (> 1000 tokens)

### Acceptance Validation

- Always include `pnpm type-check` in acceptance criteria
- Verify with `pnpm lint` and `pnpm format:check`
- Test manually in `pnpm dev` before committing
- Run full validation: `pnpm validate`

---

## 🔗 Related Files

- **Setup Guide**: `SETUP_OPTIMIZED_FINAL.md`
- **Task Priorities**: `tasks.optimized.txt`
- **Environment**: `.env.example`
- **ESLint Config**: `eslint.config.ts`
- **TypeScript Config**: `tsconfig.json`
- **Prettier Config**: `prettier.config.ts`

---

**Last Updated**: 2025-12-13  
**Status**: Ready to use ✅
