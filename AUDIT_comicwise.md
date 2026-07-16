# AUDIT_comicwise.md

> Read-only repo-management audit — Phases 0, 2, 3. Destructive phases (1: branch delete/push, 4: create CI) HELD for user approval. Generated: 2026-07-16

## Overview

- **Type**: Next.js (React/TypeScript) web application with Drizzle ORM backend (comic publishing / CMS).
- **Docs present**: `README.md`, `AGENTS.md`, `ARCHITECTURE.md`, `API_REFERENCE.md`, plus guides (DEPLOYMENT, DEVELOPMENT, TESTING, SECURITY, etc.).
- **Tooling**: Bun (bun.lock present), Next.js, Playwright, Sentry, ImageKit, ESLint, Prettier, Husky, Drizzle.
- **Manifest**: `package.json` present; `pnpm-workspace.yaml` also present (mixed PM hints, but lockfile is Bun).

## Disk Usage

- `60M` (excludes `.git`, `node_modules`, `venv`, `__pycache__`, `dist`, `build`, `target`).
- Largest non-source artifacts: `seed-urls-report.txt` (~11 MB), `node_modules/`, `bun.lock` (491 KB), `lint-report.json` (~364 KB).

## Entrypoint

- Detected: `"start": "next start"` in `package.json`.
- No Python `main.py`/`def main` entry found.
- Primary app entry: Next.js `src/` directory.

## Gitignore Audit (missing entries)

`.gitignore` EXISTS (1254 bytes). Coverage check against the standard baseline:

| Entry           | Status      |
| --------------- | ----------- |
| `node_modules/` | PRESENT     |
| `.env`          | PRESENT     |
| `*.pyc`         | **MISSING** |
| `__pycache__/`  | **MISSING** |
| `dist/`         | **MISSING** |
| `build/`        | **MISSING** |
| `.next/`        | PRESENT     |
| `venv/`         | **MISSING** |
| `.DS_Store`     | PRESENT     |

**Missing entries:** `*.pyc`, `__pycache__/`, `dist/`, `build/`, `venv/`

- Impact: medium. Despite being a JS project, it ships `.env.local`, `.env.test` and Python-style tooling in places. `dist/`/`build/` missing is acceptable for a pure-Next app (Next uses `.next/`), but `*.pyc`/`__pycache__/`/`venv/` gaps matter if any Python scripts are run locally. Verified `.env` is NOT currently tracked.

## Dependency Audit (manifest type, top deps, audit-tool availability)

- **Manifest type**: `package.json` + `bun.lock` (Bun package manager, v1.3.14).
- **Total installed deps**: 1896 (from `bun pm ls`).
- **Top deps (sample)**: `@auth/core@0.34.3`, `@auth/drizzle-adapter@1.11.1`, `@base-ui/react@1.3.0`, `@dnd-kit/core@6.3.1`, `@imagekit/next@2.1.5`, `@playwright/test@1.58.2`, `@sentry/nextjs@10.43.0`, `@tanstack/react-query@5.90.21`.
- **Audit tool availability**: `bun audit` exists in Bun 1.3.x. NOT RUN here (read-only; held to avoid proactive network calls). Recommend running `bun audit` under user approval.
- **Outdated/known-bad flags**: none flagged from lockfile names only at this pass.

## Branch State

```
* development
  production
```

- Two branches: `development` (current) and `production`.
- No stray `master` or orphan branches. Branch naming follows the `development`/`production` convention.

## Destructive Phases HELD (pending approval)

- **Phase 1** (branch deletion / push): HELD. No branches slated for deletion; nothing pushed.
- **Phase 4** (create CI): HELD. No CI workflow file created.

> Next step (approval required): run `bun audit`, then optionally proceed to Phase 1/4.
