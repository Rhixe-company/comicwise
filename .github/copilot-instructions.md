# GitHub Copilot Instructions for ComicWise

This file is the single source of truth for Copilot sessions working on the ComicWise repository. It focuses on concrete commands, high-level architecture, and repository-specific conventions that Copilot should follow when producing changes or recommendations.

---

## 1) Build, test, and lint commands (shortcuts and single-test usage)

Primary convenience scripts (run from repository root):
- Install: pnpm install
- Start dev server: pnpm dev
- Build production: pnpm build
- Start production: pnpm start

Validation / CI-local:
- Full validation used by CI: pnpm validate
  - Equivalent to: pnpm type-check && pnpm lint:strict && pnpm format:check
- Quick validation (less strict lint): pnpm validate:quick

Linting & formatting:
- Run ESLint (allow warnings): pnpm lint
- Auto-fix lintable problems: pnpm lint:fix
- Strict lint (CI): pnpm lint:strict
- Format (Prettier): pnpm format
- Check formatting: pnpm format:check

Type checking:
- TypeScript check: pnpm type-check
- Watch mode: pnpm type-check:watch

Testing:
- Run unit tests (Vitest): pnpm test:unit
  - Run a single unit test file: pnpm test:unit -- tests/path/to/file.test.ts
  - Run a single test by name: pnpm test:unit -- -t "test name"
  - Run unit tests with coverage: pnpm test:unit:coverage
- Run Playwright E2E (browser): pnpm test
  - Run a single Playwright spec file: pnpm test -- tests/path/to/file.spec.ts
  - Interactive / headed runs available via pnpm test:debug / pnpm test:headed

Database / Drizzle:
- Push schema: pnpm db:push
- Seed data: pnpm db:seed
- Drizzle studio: pnpm db:studio

Devops & helpers referenced by Copilot:
- Start Docker compose for local dev: pnpm docker:up
- Start MCP / VSCode helper scripts: pnpm vscode:mcp (or: pnpm vscode:mcp:dry-run)

Notes for Copilot: prefer running the smallest command that verifies the specific change (e.g., run a single Vitest file instead of full suite when fixing a unit test). Use pnpm validate for final verification before committing.

---

## 2) High-level architecture (big-picture)

- Framework and runtime:
  - Next.js 16 (App Router) + React 19, TypeScript 5. The app code lives under src/app and uses Next's App Router conventions (page.tsx, layout.tsx, route.ts, etc.).

- Layers and data flow (3-layer pattern used by this repo):
  - Schema/Validation layer: Zod schemas live in src/schemas/ (validate all external inputs).
  - Action/API layer: Server actions and route handlers live in src/actions/ and src/app/api/. Server actions must use "use server" where required.
  - Database/ORM layer: Drizzle ORM queries and mutations live under src/database/ and DAL helpers under src/dal/ or src/database/queries/.
  - UI layer: React components under src/components/ and page/route UI under src/app/.

- Auth & sessions: NextAuth v5 is used for authentication; session-aware server actions are expected where needed.

- Caching & state: Redis (ioredis / Upstash) for hot caching; local client state uses Zustand / Jotai where applicable.

- File & asset handling: Image upload helpers and providers (ImageKit, Cloudinary, S3) are used via a storage abstraction; see src/lib/storage or related helpers.

- Testing & CI: Vitest for unit tests, Playwright for E2E. CI matrix runs pnpm validate and tests via GitHub Actions (see .github/workflows/ci.yml).

---

## 3) Key repository conventions Copilot must follow

1. Naming & file conventions
   - Filenames: follow unicorn/filename-case rule (kebab-case) for most files. Exceptions exist for Next special files (page.tsx, layout.tsx, route.ts) and PascalCase React component files.
   - Component names: React components use PascalCase and live under src/components/ (e.g., src/components/ui/Button.tsx).

2. Import organization
   - Use the import-x ordering conventions configured in eslint.config.ts. Typical groups: builtin, external, internal (aliases @/), parent, sibling, index, object, type. Keep a blank line between groups and alphabetize.

3. 3-layer pattern strictly enforced
   - All external inputs must be validated with Zod schemas (src/schemas/) before being processed.
   - Database access should go through DAL or Drizzle helpers (src/database/ or src/dal/). Avoid ad-hoc SQL in UI or action layers.
   - Server actions (mutations) should live under src/actions/ or server-only route handlers and follow the pattern: validate with Zod, verify RBAC/auth, call DAL, return { success: boolean, data?, error? } shape.

4. ESLint & security rules to respect
   - No-debugger and prefer-const enforced; avoid console.* except console.warn / console.error (no-console rule is set to warn and allows warn/error only).
   - Security plugin rules (detect-non-literal-regexp, detect-object-injection) are set to "warn" globally; treat findings as real but check for false positives (scripts folder relaxes rules).
   - Avoid Error({ cause }) when targeting Node syntax unsupported by the repo ESLint config—rethrow original errors or create new Error(message) unless node target supports cause.

5. Accessibility & Next.js specifics
   - Use next/link for internal navigation (avoid raw <a href="/..."> for internal routes). The @next/next/no-html-link-for-pages rule is active.
   - Fix react/no-unescaped-entities by escaping apostrophes in literals (e.g., Artist&apos;s) in JSX strings.
   - Anchor elements must have valid href values; if a clickable element is not a navigation link, use a button.

6. Tests and test-writing patterns
   - Unit tests live under tests/unit; E2E under tests/e2e. Use Vitest for unit tests and Playwright for E2E. When writing tests, follow existing testing patterns and use the provided global helpers.

7. Documentation & frontmatter
   - Many repository docs (agents, prompts, skills) require YAML/Markdown front matter. When adding new agent/prompt/instruction/skill files, match the front matter conventions in .github/AGENTS.md and run pnpm run build to update generated README content.

8. Commit & pre-commit expectations
   - The repo uses husky and lint-staged. Pre-commit will run formatting via Prettier. Use pnpm format before committing and run pnpm validate for final checks.

---

## 4) Copilot behaviour guidance (concrete, repo-specific)

- When suggesting code changes, prefer the 3-layer pattern: small changes in UI should not directly modify DAL or schema without a clear reason.
- For fixes flagged by pnpm validate, propose the smallest surgical edit that resolves the issue (e.g., escape a JSX string or replace an internal <a> with next/link) rather than wide refactors.
- When addressing lint/security warnings, point out false positives (scripts/** and test files relax rules) and prefer per-file suppression only with an inline comment and justification.
- For API or DB changes, include tests or test updates with any behavioral change and run the relevant unit or E2E test locally.

---

## 5) References (copied from repo useful snippets)
- Validate locally: pnpm validate
- Run a single Vitest file: pnpm test:unit -- tests/path/to/file.test.ts
- Run Playwright for a single spec: pnpm test -- tests/path/to/file.spec.ts
- ESLint config live at eslint.config.ts — import-x ordering, unicorn filename case and security rules are important.
- Agent/prompt/skill conventions: .github/AGENTS.md (see repo for details)

---

## 6) MCP servers
This repo includes MCP server helpers for running test tooling (Vitest/Playwright) via VSCode helper scripts.
- Useful scripts: pnpm vscode:mcp and pnpm vscode:mcp:dry-run

Would you like Copilot to configure MCP servers for Vitest and Playwright (create or update .vscode/mcp.json entries and helper scripts)? If yes, specify which server(s) to configure.

---

Summary: created concise, repository-specific Copilot instructions that capture build/test/lint commands, the high-level architecture, and the critical conventions Copilot must follow when proposing or making changes.
