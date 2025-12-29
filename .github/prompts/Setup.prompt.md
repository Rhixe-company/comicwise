---
title: ComicWise Project Setup - Complete Guide
version: 2.0.0
updated: 2025-12-29
platforms: Windows, Linux, macOS
packageManager: pnpm
framework: Next.js 16
---

# 🚀 ComicWise - Complete Project Setup & Scaffolding Guide

> **Comprehensive setup guide for ComicWise - a modern web comic platform built with Next.js 16, PostgreSQL, Redis, and AI-powered features.**

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Seeding System](#seeding-system)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Docker Deployment](#docker-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## 🎯 Project Overview

**ComicWise** is a full-featured web comic reading and management platform designed for:

- 📚 **Readers**: Discover, bookmark, and read comics with seamless chapter navigation
- ✍️ **Creators**: Upload and manage comic content with powerful admin tools
- 👥 **Community**: Engage through comments, ratings, and discussions
- 🔧 **Developers**: Extensible architecture with modern best practices

### Key Features

- **Authentication**: NextAuth v5 with OAuth (Google, GitHub) and credentials
- **Database**: PostgreSQL with Drizzle ORM for type-safe queries
- **Caching**: Redis for performance optimization
- **Images**: Multi-provider support (ImageKit, Cloudinary, AWS S3, Local)
- **Search**: Full-text search across comics, authors, and artists
- **Admin Panel**: Comprehensive content and user management
- **API**: RESTful endpoints with rate limiting and validation
- **Real-time**: Queue system with BullMQ for background jobs
- **Email**: Automated notifications with React Email templates
- **SEO**: Optimized metadata and sitemaps

---

## 🛠️ Technology Stack

### Core Framework
```yaml
Framework: Next.js 16.1.1
- App Router with React Server Components
- Turbopack for faster builds
- Server Actions for mutations
- Partial Prerendering (PPR) ready

Runtime: React 19.2.3
- Server Components by default
- Optimistic UI updates
- Enhanced error boundaries
- Streaming and Suspense
```

### Database & ORM
```yaml
Database: PostgreSQL 15+
- Full-text search
- JSONB support
- Advanced indexing
- Cascade deletes

ORM: Drizzle ORM 0.45.1
- Type-safe queries
- Zero-cost abstractions
- Migration system
- Introspection tools
```

### TypeScript Configuration
```yaml
TypeScript: 5.x (Strict Mode)
- Path aliases configured
- Strict null checks
- No implicit any
- Exact optional properties
```

### Styling & UI
```yaml
CSS Framework: Tailwind CSS 4.1.18
- Custom color scheme
- Responsive utilities
- Dark mode support
- Custom animations

Component Library: shadcn/ui
- Radix UI primitives
- Accessible components
- Customizable themes
- Type-safe variants

Icons:
- Lucide React
- Tabler Icons
- Radix Icons
```

### Authentication
```yaml
Auth Provider: NextAuth.js v5 (Auth.js)
- JWT sessions
- OAuth providers (Google, GitHub)
- Credentials provider
- Email verification
- Role-based access (user, admin, moderator)
```

### State Management
```yaml
Client State: Zustand 5.0.9
Server State: TanStack Query (via Server Components)
Form State: React Hook Form 7.69.0
Validation: Zod 4.2.1
```

### Image Management
```yaml
Providers (Choose One):
- ImageKit.io (Recommended)
- Cloudinary
- AWS S3
- Local filesystem

Processing: Sharp 0.34.5
- Image optimization
- Format conversion
- Thumbnail generation
```

### Background Jobs
```yaml
Queue: BullMQ 5.66.2
- Job scheduling
- Retry logic
- Progress tracking
- Failed job handling

Cache: ioredis 5.8.2
- Connection pooling
- Cluster support
- Pipelining
```

### Email System
```yaml
SMTP: Nodemailer 7.0.12
Templates: React Email 5.1.0
- Responsive templates
- Preview mode
- Type-safe props
```

### Testing
```yaml
Unit Tests: Vitest 4.0.16
- Fast execution
- TypeScript support
- Coverage reports

E2E Tests: Playwright 1.57.0
- Cross-browser testing
- Visual comparisons
- Debugging tools
```

### DevOps & Tools
```yaml
Package Manager: pnpm 9+
Linting: ESLint 9 (Flat Config)
Formatting: Prettier 3.7.4
Git Hooks: Husky 9.1.7
Docker: Multi-stage builds
CI/CD: GitHub Actions
```

---

## ✅ Prerequisites

### Required Software

#### 1. Node.js (v20.0.0 or higher)
```bash
# Windows (using nvm-windows)
nvm install 20
nvm use 20

# macOS/Linux (using nvm)
nvm install 20
nvm use 20

# Verify installation
node --version  # Should be v20.x.x or higher
```

#### 2. pnpm (v9.0.0 or higher)
```bash
# Install globally
npm install -g pnpm@latest

# Verify installation
pnpm --version  # Should be 9.x.x or higher
```

#### 3. PostgreSQL (v15 or higher)
```bash
# Windows
# Download from: https://www.postgresql.org/download/windows/

# macOS (using Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql-15 postgresql-contrib

# Verify installation
psql --version  # Should be 15.x or higher
```

#### 4. Redis (Optional for development, required for production)
```bash
# Windows (using Docker)
docker run -d -p 6379:6379 redis:latest

# macOS (using Homebrew)
brew install redis
brew services start redis

# Linux (Ubuntu/Debian)
sudo apt install redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Verify installation
redis-cli ping  # Should return PONG
```

#### 5. Docker (Optional)
```bash
# Download Docker Desktop
# Windows/macOS: https://www.docker.com/products/docker-desktop/

# Linux
sudo apt install docker.io docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Optional but Recommended

- **Git**: Version control
- **VS Code**: IDE with extensions (see `.vscode/extensions.json`)
- **Windows Terminal**: Better terminal experience on Windows
- **Postman/Thunder Client**: API testing

---

## ⚡ Quick Start

```bash
# 1. Clone the repository
git clone <repository-url>
cd comicwise

# 2. Install dependencies
pnpm install

# 3. Setup environment variables
pnpm run setup:env
# or manually copy .env.example to .env.local and fill values

# 4. Setup database
pnpm db:push

# 5. Seed database (optional)
pnpm db:seed

# 6. Start development server
pnpm dev

# Visit http://localhost:3000
```

---

## 📦 Detailed Setup

### 1. Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd comicwise

# Install all dependencies
pnpm install

# Verify installation
pnpm type-check  # Should complete without errors
```

### 2. Environment Configuration

The project uses a comprehensive environment configuration system.

#### Option A: Automated Setup (Windows)
```powershell
# Run the setup script
.\scripts\setup-env.ps1 -Create

# Validate configuration
.\scripts\setup-env.ps1 -Validate

# Check system requirements
.\scripts\setup-env.ps1 -Check
```

#### Option B: Manual Setup
```bash
# Copy template
cp .env.example .env.local

# Edit .env.local with your values
# See "Environment Variables" section below
```

### 3. Database Setup

```bash
# Generate Drizzle types and migrations
pnpm db:generate

# Push schema to database
pnpm db:push

# Verify connection
pnpm health:db

# Optional: Open Drizzle Studio (Database GUI)
pnpm db:studio  # Opens at http://localhost:4983
```

### 4. Seeding Data

```bash
# Seed all entities (users, comics, chapters)
pnpm db:seed

# Seed specific entities
pnpm db:seed:users
pnpm db:seed:comics
pnpm db:seed:chapters

# Validate seed data (dry run)
pnpm seed:validate

# Verbose mode (detailed logs)
pnpm db:seed:verbose

# Clear and reseed
pnpm db:reset
```

### 5. Start Development

```bash
# Start Next.js dev server
pnpm dev

# Start with debug mode (Node.js inspector)
pnpm dev:debug

# Start with HTTPS (experimental)
pnpm dev:https
```

---

## 🔐 Environment Configuration

### Required Variables

```bash
# ━━━ Database ━━━
DATABASE_URL="postgresql://user:password@localhost:5432/comicwise"

# ━━━ Authentication ━━━
AUTH_SECRET="your-secret-key-min-32-characters-long-generate-securely"
AUTH_URL="http://localhost:3000"

# ━━━ Application ━━━
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Recommended Variables

```bash
# ━━━ Upload Provider ━━━
UPLOAD_PROVIDER="local"  # Options: local, imagekit, cloudinary, aws

# ━━━ Email (for password reset, notifications) ━━━
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@comicwise.com"

# ━━━ Redis (caching & queues) ━━━
REDIS_HOST="localhost"
REDIS_PORT="6379"
# REDIS_PASSWORD=""  # If required
```

### Optional OAuth Variables

```bash
# ━━━ Google OAuth ━━━
AUTH_GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
AUTH_GOOGLE_CLIENT_SECRET="your-client-secret"

# ━━━ GitHub OAuth ━━━
AUTH_GITHUB_CLIENT_ID="your-github-client-id"
AUTH_GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### Image Upload Service (Choose One)

#### ImageKit (Recommended)
```bash
IMAGEKIT_PUBLIC_KEY="public_xxx"
IMAGEKIT_PRIVATE_KEY="private_xxx"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your-id"
IMAGEKIT_ENABLED="true"
```

#### Cloudinary
```bash
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

#### AWS S3
```bash
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET_NAME="your-bucket"
```

---

## 🗄️ Database Setup

### Schema Overview

```
comicwise/
├── users          - User accounts
├── accounts       - OAuth provider links
├── sessions       - User sessions
├── comics         - Comic metadata
├── chapters       - Chapter content
├── authors        - Comic authors
├── artists        - Comic artists
├── genres         - Genre categories
├── types          - Comic types
├── bookmarks      - User bookmarks
└── comments       - User comments
```

### Migration Commands

```bash
# Generate migrations from schema changes
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Push schema directly (development)
pnpm db:push

# Drop all tables (⚠️ destructive)
pnpm db:drop

# Reset database completely
pnpm db:reset
```

### Drizzle Studio

```bash
# Open database GUI
pnpm db:studio

# Runs at http://localhost:4983
```

---

## 🌱 Seeding System

### Data Files

Place JSON data files in the project root:

```
comicwise/
├── users.json           - User accounts
├── comics.json          - Comic data
├── comicsdata1.json     - Additional comics
├── comicsdata2.json     - More comics
├── chapters.json        - Chapter data
├── chaptersdata1.json   - Additional chapters
└── chaptersdata2.json   - More chapters
```

### Seeding Commands

```bash
# Seed everything
pnpm db:seed --all

# Selective seeding
pnpm db:seed --users
pnpm db:seed --comics
pnpm db:seed --chapters

# Dry run (validate without inserting)
pnpm db:seed --dry-run

# Verbose output
pnpm db:seed --verbose

# Custom batch size
pnpm db:seed --batch-size=500
```

### Seed Data Features

- ✅ **Upsert Logic**: Updates existing records instead of duplicating
- ✅ **Image Processing**: Downloads and uploads images to configured provider
- ✅ **Hash-based Deduplication**: Prevents duplicate image uploads
- ✅ **Relationship Management**: Automatically handles authors, artists, genres
- ✅ **Progress Tracking**: Real-time progress bars and statistics
- ✅ **Error Recovery**: Continues on errors, reports at end
- ✅ **Transaction Support**: Atomic operations with rollback

### Custom Seeding

Create your own seeder:

```typescript
// scripts/custom-seeder.ts
import { db } from '@/database/db';
import { comic } from '@/database/schema';

async function seedCustomData() {
  await db.insert(comic).values({
    title: "My Custom Comic",
    slug: "my-custom-comic",
    description: "Description here",
    status: "Ongoing"
  });
}

seedCustomData();
```

Run it:
```bash
tsx scripts/custom-seeder.ts
```

---

## 🔄 Development Workflow

### Daily Development

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install any new dependencies
pnpm install

# 3. Apply database migrations
pnpm db:push

# 4. Start development server
pnpm dev

# 5. Make your changes

# 6. Run quality checks
pnpm validate  # type-check + lint + format check

# 7. Commit your changes
git add .
git commit -m "feat: your feature description"
```

### Code Quality Commands

```bash
# TypeScript type checking
pnpm type-check
pnpm type-check:watch  # Watch mode

# Linting
pnpm lint              # Check for errors
pnpm lint:fix          # Auto-fix errors
pnpm lint:strict       # Zero warnings allowed

# Formatting
pnpm format            # Format all files
pnpm format:check      # Check formatting

# All checks together
pnpm validate          # Run all quality checks
```

### Testing

```bash
# Unit tests (Vitest)
pnpm test:unit         # Watch mode
pnpm test:unit:run     # Run once
pnpm test:unit:coverage  # Coverage report

# E2E tests (Playwright)
pnpm test              # Headless mode
pnpm test:ui           # Interactive UI
pnpm test:headed       # Visible browser
pnpm test:debug        # Debug mode

# All tests
pnpm test:all          # Unit + E2E
```

### Building

```bash
# Production build
pnpm build

# Build with bundle analysis
pnpm build:analyze

# Build standalone (Docker)
pnpm build:standalone
```

---

## 🐳 Docker Deployment

### Development with Docker

```bash
# Build containers
pnpm docker:build

# Start all services
pnpm docker:up

# View logs
pnpm docker:logs

# Stop services
pnpm docker:down

# Clean everything
pnpm docker:clean
```

### Docker Compose Files

- `docker-compose.yml` - Production configuration
- `docker-compose.dev.yml` - Development with hot reload

### Production Deployment

```bash
# Build production image
docker build -t comicwise:latest .

# Run with environment variables
docker run -p 3000:3000 --env-file .env.local comicwise:latest
```

---

## 🚀 CI/CD Pipeline

### GitHub Actions Workflows

Located in `.github/workflows/`:

1. **ci.yml** - Main CI pipeline
   - Install dependencies
   - Type checking
   - Linting
   - Unit tests
   - Build verification

2. **ci-with-health.yml** - Extended CI
   - Database health checks
   - Redis connectivity
   - Integration tests

3. **playwright.yml** - E2E testing
   - Cross-browser testing
   - Visual regression
   - Performance metrics

4. **deploy.yml** - Deployment
   - Build Docker image
   - Push to registry
   - Deploy to production

5. **health-check.yml** - Monitoring
   - Periodic health checks
   - Uptime monitoring
   - Alert on failures

### GitHub Secrets Required

```
DATABASE_URL
AUTH_SECRET
IMAGEKIT_PRIVATE_KEY
CLOUDINARY_API_SECRET
AWS_SECRET_ACCESS_KEY
REDIS_PASSWORD
```

---

## 📚 Common Tasks

### Adding a New Feature

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Generate scaffold (optional)
pnpm scaffold --type=component --name=MyComponent

# 3. Implement feature
# - Add components in src/components/
# - Add routes in src/app/
# - Add actions in src/lib/actions/
# - Add queries in src/database/queries/

# 4. Add tests
# - Unit tests alongside files (*.test.ts)
# - E2E tests in tests/

# 5. Run checks
pnpm validate

# 6. Commit
git commit -m "feat: add my feature"
```

### Database Schema Changes

```bash
# 1. Edit schema
# Edit src/database/schema.ts

# 2. Generate migration
pnpm db:generate

# 3. Review migration
# Check drizzle/migrations/

# 4. Apply migration
pnpm db:push

# 5. Update seed data if needed
```

### Adding New API Route

```typescript
// src/app/api/my-route/route.ts
import { NextResponse } from 'next/server';
import { auth } from 'auth';
import { z } from 'zod';

const QuerySchema = z.object({
  id: z.string().uuid(),
});

export async function GET(request: Request) {
  // Authentication
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Validation
  const { searchParams } = new URL(request.url);
  const result = QuerySchema.safeParse({
    id: searchParams.get('id'),
  });

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: 400 }
    );
  }

  // Your logic here
  const data = {}; // Fetch data

  return NextResponse.json({ data });
}
```

### Adding Server Action

```typescript
// src/lib/actions/my-action.ts
'use server';

import { auth } from 'auth';
import { db } from '@/database/db';
import { comic } from '@/database/schema';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const CreateComicSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string(),
  // ... other fields
});

export async function createComic(
  formData: FormData
) {
  // Auth check
  const session = await auth();
  if (!session || session.user.role !== 'admin') {
    return { error: 'Unauthorized' };
  }

  // Validation
  const data = Object.fromEntries(formData);
  const result = CreateComicSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.flatten() };
  }

  // Database operation
  try {
    await db.insert(comic).values(result.data);
    revalidatePath('/admin/comics');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to create comic' };
  }
}
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Errors

**Symptom**: `Error: connect ECONNREFUSED`

**Solutions**:
```bash
# Check PostgreSQL is running
# Windows
services.msc  # Look for "postgresql"

# macOS
brew services list

# Linux
sudo systemctl status postgresql

# Verify DATABASE_URL format
# Should be: postgresql://user:password@host:port/database

# Test connection
pnpm health:db
```

#### 2. Type Errors After Schema Changes

**Symptom**: TypeScript errors about database types

**Solutions**:
```bash
# Regenerate types
pnpm db:generate

# Restart TypeScript server in VS Code
# Ctrl+Shift+P -> "TypeScript: Restart TS Server"

# Clear Next.js cache
rm -rf .next
pnpm dev
```

#### 3. Module Resolution Errors

**Symptom**: `Cannot find module '@/...'`

**Solutions**:
```bash
# Check tsconfig.json paths
# Restart VS Code
# Clear node_modules
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### 4. Build Failures

**Symptom**: Build errors in production

**Solutions**:
```bash
# Clear all caches
pnpm clean

# Rebuild
pnpm build

# Check for circular dependencies
pnpm dlx madge --circular src/
```

#### 5. Redis Connection Issues

**Symptom**: Redis connection timeout

**Solutions**:
```bash
# Check Redis is running
redis-cli ping  # Should return PONG

# Check environment variables
# REDIS_HOST, REDIS_PORT

# Try Upstash (serverless alternative)
# Use UPSTASH_REDIS_REST_URL instead
```

### Getting Help

1. **Check Documentation**: Read relevant sections above
2. **Search Issues**: Look for similar problems in GitHub issues
3. **Check Logs**: Review server logs and browser console
4. **VS Code Problems Panel**: Check for TypeScript/ESLint errors
5. **Ask for Help**: Create detailed issue with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version, etc.)

---

## ✨ Best Practices

### Code Organization

```
src/
├── app/                    # Next.js routes
│   ├── (root)/            # Public pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   └── dashboard/         # User dashboard
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── layout/           # Layout components
│   └── ui/               # shadcn/ui components
├── dal/                  # Data Access Layer
├── database/             # Database config
│   ├── mutations/        # Write operations
│   ├── queries/          # Read operations
│   └── schema.ts         # Drizzle schema
├── dto/                  # Data Transfer Objects
├── hooks/                # Custom hooks
├── lib/                  # Utilities
│   ├── actions/          # Server actions
│   └── validations/      # Zod schemas
├── services/             # External services
└── types/                # TypeScript types
```

### Coding Standards

- ✅ Use TypeScript strict mode
- ✅ Prefer server components over client components
- ✅ Use server actions for mutations
- ✅ Validate all inputs with Zod
- ✅ Use path aliases (`@/...`) for imports
- ✅ Write tests for critical paths
- ✅ Document complex logic with comments
- ✅ Follow DRY (Don't Repeat Yourself) principle

### Performance Tips

- ⚡ Enable caching for frequent queries
- ⚡ Use `next/image` for image optimization
- ⚡ Implement pagination for large datasets
- ⚡ Use dynamic imports for code splitting
- ⚡ Enable compression in production
- ⚡ Monitor bundle size with `pnpm build:analyze`

### Security Checklist

- 🔒 Never commit `.env.local` to git
- 🔒 Validate and sanitize all user inputs
- 🔒 Use parameterized queries (Drizzle handles this)
- 🔒 Implement rate limiting on API routes
- 🔒 Enable CORS only for trusted domains
- 🔒 Use HTTPS in production
- 🔒 Keep dependencies updated

---

## 📖 Additional Resources

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team)
- [NextAuth.js](https://authjs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Zod](https://zod.dev)

### Project Documentation
- [Database Schema](./docs/DATABASE_SCHEMA.md)
- [API Reference](./docs/API_REFERENCE.md)
- [Docker Deployment](./docs/DOCKER_DEPLOYMENT.md)
- [Seeding Guide](./SEEDING_SYSTEM_GUIDE.md)

### Tools & Extensions
- [VS Code Extensions](./.vscode/extensions.json)
- [MCP Servers](./.vscode/mcp.json)
- [GitHub Actions](./.github/workflows/)

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting, missing semicolons, etc
refactor: code restructuring
perf: performance improvements
test: adding tests
chore: updating build tasks, package manager configs, etc
```

---

## 📝 License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

## 📧 Support

For questions, issues, or contributions:

- **GitHub Issues**: [Create an issue](https://github.com/your-repo/issues)
- **Discussions**: [Join the discussion](https://github.com/your-repo/discussions)
- **Email**: support@comicwise.com

---

**Last Updated**: December 29, 2025
**Version**: 2.0.0
**Maintainers**: ComicWise Team

---

*Made with ❤️ using Next.js 16, TypeScript, and modern web technologies*
