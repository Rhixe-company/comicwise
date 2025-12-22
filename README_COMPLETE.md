# ComicWise - Complete Project Documentation

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Setup database
pnpm db:push && pnpm db:seed

# Start development server
pnpm dev
```

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Type System](#type-system)
4. [Scripts & CLI](#scripts--cli)
5. [Development Workflow](#development-workflow)
6. [Deployment](#deployment)

## 🏗️ Project Overview

ComicWise is a modern comic reading platform built with:
- **Next.js 16** with App Router & React 19
- **TypeScript 5** with strict type safety
- **Drizzle ORM** with PostgreSQL
- **NextAuth v5** for authentication
- **Tailwind CSS 4** for styling
- **Upstash Redis** for caching
- **BullMQ** for background jobs

## 🏛️ Architecture

### Directory Structure

```
comicwise/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── (root)/         # Public routes
│   │   ├── (auth)/         # Auth routes
│   │   ├── admin/          # Admin dashboard
│   │   └── api/            # API routes
│   ├── components/         # React components
│   │   ├── ui/            # UI components
│   │   ├── layout/        # Layout components
│   │   ├── admin/         # Admin components
│   │   └── emails/        # Email templates
│   ├── lib/               # Core libraries
│   │   ├── actions/       # Server actions (migrated to dto)
│   │   ├── dto/           # Enhanced DTOs with server actions
│   │   ├── validations/   # Zod schemas
│   │   └── utils/         # Utilities
│   ├── database/          # Database layer
│   │   ├── schema.ts      # Drizzle schema
│   │   ├── queries/       # Database queries
│   │   ├── mutations/     # Database mutations
│   │   └── seed/          # Seed data
│   ├── services/          # Business logic services
│   ├── hooks/             # React hooks
│   ├── stores/            # Zustand/Jotai stores
│   └── types/             # TypeScript types
├── scripts/               # Automation scripts
├── cli/                   # CLI commands
└── public/                # Static assets
```

### Type System

The project uses a comprehensive type system organized in `src/types/`:

- **`schema.ts`** - Database schema types and models
- **`forms.ts`** - Form input and validation types
- **`actions.ts`** - Server action response types
- **`components.ts`** - React component prop types
- **`api.ts`** - API request/response types
- **`database.ts`** - Database utility types
- **`cache.ts`** - Cache types
- **`queue.ts`** - Background job types
- **`upload.ts`** - File upload types

#### Type Import Paths

All types are centralized and exported from `types`:

```typescript
import type {
  User,
  Comic,
  Chapter,
  ActionResult,
  PaginatedResponse
} from "types";
```

### Path Aliases

Custom paths configured in `tsconfig.json`:

```typescript
// Primary aliases (recommended)
import { Button } from "#ui/button"
import { getComics } from "#dto/comicsDto"
import { db } from "db"
import { auth } from "auth"
import type { User } from "types"

// Legacy @ alias (still works)
import { Button } from "@/components/ui/button"
```

## 🎯 Scripts & CLI

### CLI Tool

Use the enhanced CLI wrapper for all commands:

**PowerShell (Windows):**
```powershell
.\scripts\cw.ps1 db:push
.\scripts\cw.ps1 upload:bulk --provider cloudinary
.\scripts\cw.ps1 health:all
```

**Bash (Mac/Linux):**
```bash
./scripts/cw.sh db:push
./scripts/cw.sh cache:clear
./scripts/cw.sh test:unit
```

### Command Categories

#### Database Commands
```bash
db:push              # Push schema changes
db:pull              # Pull schema from database
db:migrate           # Run migrations
db:generate          # Generate migrations
db:seed              # Seed database
db:reset             # Drop + Push + Seed
db:studio            # Open Drizzle Studio
db:backup            # Backup database
db:restore <file>    # Restore from backup
```

#### Cache Commands
```bash
cache:clear          # Clear all caches
cache:stats          # Show cache statistics
redis:cli            # Open Redis CLI
redis:flush          # Flush all Redis data
```

#### Queue Commands
```bash
queue:worker         # Start background worker
queue:stats          # Show queue statistics
queue:clean          # Clean completed/failed jobs
queue:dashboard      # Open Bull Board UI
```

#### Upload Commands
```bash
upload:bulk                          # Bulk upload (default provider)
upload:bulk --provider cloudinary    # Upload to Cloudinary
upload:bulk --provider imagekit      # Upload to ImageKit
upload:bulk --provider aws           # Upload to AWS S3
upload:test                          # Test upload configuration
```

#### Health Check Commands
```bash
health:all           # Run all health checks
health:db            # Check database connection
health:redis         # Check Redis connection
```

#### Development Commands
```bash
dev                  # Start development server
build                # Build for production
start                # Start production server
lint                 # Lint code
lint:fix             # Auto-fix linting issues
format               # Format code with Prettier
type-check           # TypeScript type checking
```

#### Testing Commands
```bash
test                 # Run all E2E tests
test:unit            # Run unit tests
test:unit:coverage   # Unit tests with coverage
test:ui              # Open Playwright UI
test:debug           # Debug mode
test:chromium        # Test in Chromium only
test:firefox         # Test in Firefox only
```

#### Docker Commands
```bash
docker:up            # Start containers
docker:down          # Stop containers
docker:build         # Build images
docker:logs          # View logs
docker:shell         # Open shell in container
docker:clean         # Remove volumes
```

#### Utility Commands
```bash
clean                # Clean build artifacts
clean:all            # Clean everything including node_modules
imports:optimize     # Optimize import paths
validate             # Run type-check + lint + format
fix                  # Auto-fix all issues
```

#### Priority System
```bash
priority:list        # List all priority tasks
priority:status      # Show completion status
priority:run:p0      # Run P0 (critical) tasks
priority:run:p1      # Run P1 (high) tasks
priority:run:p2      # Run P2 (medium) tasks
```

## 🔄 Development Workflow

### 1. Setting Up

```bash
# Clone and install
git clone <repo>
cd comicwise
pnpm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Setup database
pnpm db:push
pnpm db:seed
```

### 2. Development

```bash
# Start dev server with turbopack
pnpm dev

# In another terminal, start queue worker (if needed)
pnpm queue:worker

# Watch for type errors
pnpm type-check:watch
```

### 3. Before Committing

```bash
# Run validation
pnpm validate

# Or use the all-in-one fix command
pnpm fix

# Optimize imports
pnpm imports:optimize
```

### 4. Testing

```bash
# Run unit tests
pnpm test:unit

# Run E2E tests
pnpm test

# Open test UI for debugging
pnpm test:ui
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Deploy to production
pnpm deploy:vercel

# Deploy preview
pnpm deploy:preview
```

### Docker

```bash
# Build and start production containers
pnpm docker:prod

# Or use docker-compose directly
docker-compose -f docker-compose.yml up -d --build
```

### Manual Build

```bash
# Build
pnpm build

# Start production server
pnpm start
```

## 🔐 Environment Variables

Required variables in `.env.local`:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/comicwise

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
AUTH_GOOGLE_CLIENT_ID=your-google-client-id
AUTH_GOOGLE_CLIENT_SECRET=your-google-client-secret

# Redis
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Storage (choose one or more)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

IMAGEKIT_PUBLIC_KEY=your-public-key
IMAGEKIT_PRIVATE_KEY=your-private-key
IMAGEKIT_URL_ENDPOINT=your-endpoint

AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

## 📚 Key Features

### 1. Enhanced Type Safety
- Comprehensive type system in `src/types/`
- Strict TypeScript configuration
- Type-safe database queries with Drizzle
- Validated server actions with Zod

### 2. Server Actions with DTOs
All server actions have been migrated to enhanced DTO files:
- `#dto/comicsDto` - Comic CRUD operations
- `#dto/chaptersDto` - Chapter management
- `#dto/authDto` - Authentication
- `#dto/bookmarksDto` - Bookmarks
- And more...

### 3. Optimized Import Paths
- Use `#` prefix for consistency
- Short aliases for common imports
- Automatic import optimization

### 4. Bulk Upload System
Upload images to multiple providers:
```bash
pnpm upload:bulk --provider cloudinary --path ./comics
pnpm upload:bulk --provider imagekit --dry-run
```

### 5. Background Jobs
- Email sending
- Image processing
- Database cleanup
- Notifications

### 6. Caching Strategy
- Redis caching for comics, chapters
- Static page caching
- API response caching

### 7. Comprehensive Testing
- Unit tests with Vitest
- E2E tests with Playwright
- Component testing
- API testing

## 🛠️ Troubleshooting

### Type Errors

```bash
# Check all type errors
pnpm type-check

# Auto-fix many type issues
pnpm fix:all
```

### Import Errors

```bash
# Optimize all imports
pnpm imports:optimize

# Check changes without applying
pnpm imports:check
```

### Database Issues

```bash
# Reset database
pnpm db:reset

# Check connection
pnpm health:db
```

### Cache Issues

```bash
# Clear all caches
pnpm cache:clear

# Clear Next.js cache only
pnpm clean:cache
```

## 📖 Additional Documentation

- [Bulk Upload Guide](./docs/BULK_UPLOAD.md)
- [Docker Deployment](./docs/DOCKER_DEPLOYMENT.md)
- [Redis Caching](./docs/REDIS_CACHING.md)
- [Testing Guide](./docs/TESTING.md)
- [Scripts Reference](./docs/SCRIPTS_REFERENCE.md)
- [DTO Usage Examples](./docs/DTO_USAGE_EXAMPLES.md)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `pnpm validate`
4. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details
