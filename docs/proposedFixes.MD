### Export: Proposed Fixes (current `docs/proposedFixes.MD`)

---

The content below is an exact export copy of `docs/proposedFixes.MD` for offline review.

# Proposed Fixes Report

Generated: 2026-02-24

Summary:

- Validation run (`pnpm validate`) completed and produced numerous warnings and a few errors across the seed tooling and DTO/hooks files.
- High-priority errors found (need immediate fixes):
  1. `src/database/seed/utils/helpers.ts` — preserve-caught-error (missing `cause` when rethrowing) (2 occurrences)
  2. `src/database/seed/utils/imageSeederHelper.ts` — ESLint rule `typescript-eslint/explicit-module-boundary-types` not found (likely ESLint config or plugin mismatch)

Common warning categories (many files):

- `no-console` warnings: many console.log calls in seed scripts (allowed only warn/error per repo rules)
- `unicorn/filename-case`: many filenames not in kebab-case (naming convention)
- `@typescript-eslint/no-explicit-any`: many `any` usages in seeders
- `sonarjs/cognitive-complexity`: several functions exceed cognitive complexity thresholds
- `security/detect-non-literal-fs-filename` and `security/detect-object-injection`: non-literals passed to fs methods and object injection sinks in seed helpers

Proposed immediate fixes (phase 2 -> phase 4):

1. Fix the two `preserve-caught-error` errors in `helpers.ts` by attaching the original error as `cause` when rethrowing, or rethrow the original error. Example:

   Before:

   ```ts
   try {
     /* ... */
   } catch (err) {
     throw new Error("failed");
   }
   ```

   After:

   ```ts
   try {
     /* ... */
   } catch (err) {
     throw new Error("failed", { cause: err });
   }
   ```

2. Investigate ESLint plugin/config mismatch for `typescript-eslint/explicit-module-boundary-types`:
   - Confirm `@typescript-eslint/eslint-plugin` is installed and matches ESLint config version.
   - If missing, add to devDependencies or adjust `eslint.config.ts` to remove/disable the rule for seed files.

3. Replace or suppress console.\* where appropriate in seed scripts:
   - Use `console.warn` or `console.error` for messages that must remain, or replace with logger abstraction per repo conventions.

4. Address filename kebab-case warnings gradually (not blocking):
   - Rename files to kebab-case where safe (seed files, utils, DTOs) and update imports.

5. Reduce `any` usage and cognitive complexity where feasible in seeders:
   - Add narrow types or generic type parameters.
   - Break complex functions into smaller helpers.

6. Security warnings for non-literal fs usage and object injection:
   - Audit call sites and ensure sanitized inputs or whitelisted paths.
   - If dynamic filenames are required, document and add explicit exceptions with justification.

Next actions (I'll proceed unless you direct otherwise):

1. Create focused changes for the two `preserve-caught-error` errors (small, safe edits).
2. Investigate the missing ESLint rule (check package.json, installed plugins) and either install/fix plugin versions or disable rule for seed utils.
3. Re-run `pnpm validate` after those fixes, then iterate on remaining high-impact warnings.

Files referenced by the validation output (partial list):

- src/database/seed/utils/helpers.ts
- src/database/seed/utils/imageSeederHelper.ts
- src/database/seed/logger.ts
- many `src/database/seed/seeders/*.ts`
- multiple `src/hooks/*` and `src/dto/*` files (filename-case warnings)

Report format and traceability:

- Each code change will include a small commit with a descriptive message and before/after snippets in this document.
- Significant fixes will be added to CHANGELOG and documented inline.

If you'd like, I can now apply the non-invasive fixes (attach `cause` on rethrows and fix the ESLint plugin issue) and re-run validation.

Actions taken so far:

- 2026-02-24: Attached original caught errors as `cause` (via attached property) in `src/database/seed/utils/helpers.ts` to preserve stack information and satisfy the `preserve-caught-error` rule while avoiding Node version syntax issues.
- 2026-02-24: Fixed eslint-disable directive in `src/database/seed/utils/imageSeederHelper.ts` to correctly reference `@typescript-eslint/explicit-module-boundary-types`.
- 2026-02-24: Replaced most `console.log` usages in `src/database/seed/logger.ts` with `seedLogger.info(...)` to comply with the project's `no-console` rule (only `console.warn` and `console.error` allowed).

Current status:

- Critical ESLint errors fixed. Validation now reports only warnings (naming, complexity, `any` usage, fs non-literal usage, and some remaining console usages in other files).

Recommended next steps (pick one):

1. Continue with automated, low-risk fixes: rename a small set of seed filenames to kebab-case and update imports, and convert remaining `console.log` usages in `logger-optimized.ts` and other seed helper files to use `seedLogger`.
2. Tackle security warnings: audit non-literal fs usage and add explicit sanitization/whitelisting or provide limited exceptions with comments.
3. Defer large refactors (reducing cognitive complexity, replacing many `any`s) to a follow-up sprint — these require deeper changes and tests.
