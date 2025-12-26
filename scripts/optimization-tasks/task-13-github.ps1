#!/usr/bin/env pwsh
# Task 13: GitHub Setup Prompt

param([switch]$DryRun)

Write-Host "Task 13: GitHub Setup Prompt" -ForegroundColor Cyan

if (-not $DryRun) {
    $githubDir = ".github"
    New-Item -ItemType Directory -Force -Path $githubDir | Out-Null
    
    $setupPrompt = @"
# ComicWise - Complete Setup Guide for GitHub Copilot CLI

## Project Overview
Full-stack comic reading platform built with Next.js 16, React 19, TypeScript 5, and PostgreSQL 17.

## Quick Start Commands

\`\`\`bash
# Initial setup
pnpm install
pnpm db:push
pnpm db:seed

# Development
pnpm dev

# Production
pnpm build
pnpm start
\`\`\`

## Technology Stack

### Frontend
- Next.js 16.1.1 with App Router
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui components

### Backend  
- PostgreSQL 17
- Drizzle ORM 0.45.1
- NextAuth 5.0.0-beta.30
- Redis (Upstash)

### Testing
- Playwright (E2E)
- Vitest (Unit)

## Environment Variables

See \`.env.example\` for required variables:
- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- Image upload provider keys (Cloudinary/ImageKit)

## Database Schema

Main tables:
- \`user\` - Authentication and user profiles
- \`comic\` - Comic series metadata
- \`chapter\` - Individual chapters
- \`bookmark\` - User reading progress
- \`comment\` - Chapter comments

## Development Workflows

### Database Management
\`\`\`bash
pnpm db:studio     # Open Drizzle Studio
pnpm db:seed       # Seed test data
pnpm db:reset      # Reset and reseed
\`\`\`

### Code Quality
\`\`\`bash
pnpm validate      # Type check + lint + format
pnpm lint:fix      # Auto-fix lint issues
pnpm type-check    # TypeScript validation
\`\`\`

### Testing
\`\`\`bash
pnpm test          # E2E tests
pnpm test:unit     # Unit tests
pnpm test:all      # All tests
\`\`\`

## Project Structure

\`\`\`
src/
├── app/              # Next.js app router
├── components/       # React components
│   ├── ui/          # shadcn components
│   ├── blocks/      # Compound components
│   └── emails/      # Email templates
├── lib/             # Utilities
│   ├── actions/     # Server actions
│   └── validations/ # Zod schemas
├── database/        # Drizzle ORM
│   └── schema.ts    # Database schema
├── types/           # TypeScript types
└── hooks/           # React hooks
\`\`\`

## Custom Path Aliases

Configured in \`tsconfig.json\`:
- \`@/*\` → \`src/*\`
- \`ui\` → \`src/components/ui/*\`
- \`lib\` → \`src/lib/*\`
- \`actions\` → \`src/lib/actions/*\`
- \`database\` → \`src/database/*\`
- \`schema\` → \`src/database/schema.ts\`
- \`types\` → \`src/types/*\`

## Common Tasks

### Add New Component
\`\`\`bash
pnpm scaffold --type=component
\`\`\`

### Add New API Route
Create in \`src/app/api/[route]/route.ts\`

### Database Migration
\`\`\`bash
pnpm db:generate   # Generate migration
pnpm db:push       # Push to database
\`\`\`

## Deployment

### Vercel (Recommended)
\`\`\`bash
pnpm deploy:vercel
\`\`\`

### Docker
\`\`\`bash
docker-compose up -d
\`\`\`

## Troubleshooting

### Database Connection Issues
- Check DATABASE_URL in .env.local
- Ensure PostgreSQL is running
- Run \`pnpm health:db\`

### Type Errors
- Run \`pnpm type-check\`
- Check src/types/ for missing definitions

### Build Errors
- Clear cache: \`pnpm clean:cache\`
- Reinstall: \`pnpm clean:all && pnpm install\`

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team)
- [shadcn/ui](https://ui.shadcn.com)
- [NextAuth.js](https://next-auth.js.org)

---

**Generated**: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
"@

    $promptPath = Join-Path $githubDir "Setup.prompt.md"
    Set-Content -Path $promptPath -Value $setupPrompt -Encoding UTF8
    Write-Host "  ✓ Created .github\Setup.prompt.md" -ForegroundColor Green
} else {
    Write-Host "  DRY RUN: Would create GitHub setup prompt" -ForegroundColor Gray
}
