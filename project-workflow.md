# Project Workflow — comicwise

## Development Workflow

```bash
1. Local Setup
   bun install                    # or pnpm install
   cp .env.example .env
   bunx prisma migrate dev
   bun run db:seed

2. Development
   bun run dev                    # Turbopack dev server
   bun run format                 # Prettier format
   bun run lint                   # ESLint

3. Database Changes
   # Edit schema in src/db/
   bunx prisma migrate dev --name description
   bun run db:seed                # Re-seed after schema changes

4. Quality Checks
   bunx tsc --noEmit               # TypeScript check
   bun run lint:strict            # Zero-warnings linting
   bun run test                       # Run all tests

5. Build & Deploy
   bun run build                  # Production build
   bun run start                      # Production server
```

## Adding a Feature

1. Create DB schema/migration → 2. Create Server Action → 3. Create component → 4. Add route page

## Git Workflow

- Feature branches from `main`
- PR requires lint + type-check + tests passing
- Husky pre-commit hooks run lint-staged
