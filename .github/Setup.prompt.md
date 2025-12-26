# GitHub Copilot CLI Setup Prompt for ComicWise

> **Complete project setup, scaffolding, and optimization guide for ComicWise - A Next.js 16 + React 19 + PostgreSQL Comic Reading Platform**

---

## 🎯 Project Overview

**Name:** ComicWise  
**Description:** Modern, full-stack comic reading platform  
**CLI Tool:** `cw` - Comprehensive management CLI

**Tech Stack:**
- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript 5+
- PostgreSQL 17 (Drizzle ORM)
- NextAuth 5.0 (Authentication)
- Tailwind CSS 4
- Redis (Upstash) - Caching & Rate Limiting
- BullMQ - Queue Management
- Playwright + Vitest - Testing

**Package Manager:** pnpm  
**Node Version:** 22+

---

## 🛠️ ComicWise CLI (`cw`)

The `cw` CLI is a comprehensive command-line tool for managing all aspects of the ComicWise platform.

### Installation

```bash
# Make executable (Unix/macOS)
chmod +x scripts/cli/cw.ts

# Add to package.json scripts (already configured)
pnpm cw <command>
```

### Available Commands

#### 📊 Database Operations

```bash
cw db push              # Push schema to database
cw db pull              # Pull schema from database
cw db generate          # Generate migrations
cw db migrate           # Run migrations
cw db studio            # Open Drizzle Studio
cw db seed              # Seed database with sample data
cw db seed --users      # Seed only users
cw db seed --comics     # Seed only comics
cw db seed --chapters   # Seed only chapters
cw db seed --dry-run    # Validate without writing
cw db reset             # Reset database (drop, push, seed)
cw db reset --hard      # Hard reset (regenerate schema)
```

#### 💻 Development Operations

```bash
cw dev start            # Start development server
cw dev start --debug    # Start with Node debugger
cw dev start --https    # Start with HTTPS
cw dev build            # Build for production
cw dev build --analyze  # Build with bundle analyzer
cw dev clean            # Clean build artifacts
cw dev clean --all      # Clean all (including node_modules)
```

#### 🧪 Testing Operations

```bash
cw test all             # Run all tests
cw test unit            # Run unit tests
cw test unit --watch    # Unit tests in watch mode
cw test unit --coverage # Unit tests with coverage
cw test e2e             # Run E2E tests
cw test e2e --ui        # E2E with Playwright UI
cw test e2e --headed    # E2E in headed mode
cw test e2e --debug     # E2E in debug mode
```

#### ✨ Code Quality

```bash
cw quality lint         # Run linter
cw quality lint --fix   # Auto-fix lint issues
cw quality format       # Format code with Prettier
cw quality format --check  # Check formatting only
cw quality type-check   # Run TypeScript type checking
cw quality validate     # Run all checks (type, lint, format)
cw quality validate --quick  # Quick validation

# Aliases
cw q lint               # Short form
cw q validate           # Short form
```

#### 💾 Cache Operations

```bash
cw cache clear          # Clear application cache
cw cache stats          # Show cache statistics
```

#### 🏥 Health Checks

```bash
cw health check         # Run system health check
cw health db            # Check database connection
cw health redis         # Check Redis connection
cw health all           # Run all health checks
```

#### 🚀 Setup & Installation

```bash
cw setup init           # Initial project setup
cw setup clean          # Clean setup (fresh install)
cw setup full           # Full setup (clean + build)
```

#### ⚡ Optimization

```bash
cw optimize all         # Run comprehensive optimization
cw optimize types       # Optimize TypeScript types
cw optimize camelcase   # Preview CamelCase conversion
cw optimize camelcase --execute  # Execute conversion

# Aliases
cw opt all              # Short form
```

#### 🧹 Cleanup

```bash
cw cleanup              # Clean project (remove duplicates)
cw cleanup --dry-run    # Preview cleanup changes
```

#### 🚢 Deployment

```bash
cw deploy preview       # Deploy to preview environment
cw deploy production    # Deploy to production (Vercel)
```

#### 🐳 Docker Operations

```bash
cw docker up            # Start Docker containers
cw docker down          # Stop Docker containers
cw docker build         # Build Docker images
cw docker clean         # Clean containers and volumes
cw docker logs          # Show container logs
```

#### 🏗️ Scaffolding

```bash
cw scaffold component MyComponent   # Generate component
cw scaffold hook useMyHook          # Generate hook
cw scaffold action myAction         # Generate server action

# Aliases
cw new component MyComponent   # Short form
```

#### ℹ️ Information

```bash
cw info                 # Display project information
cw --version           # Show CLI version
cw --help              # Show help
```

### Usage Examples

```bash
# Complete setup from scratch
cw setup full

# Start development
cw dev start

# Run validation before commit
cw quality validate

# Create new component
cw new component UserProfile

# Deploy to production
cw deploy production
```

---

## 📦 Initial Setup

### 1. Clone and Install

```bash
# Clone repository
git clone <repository-url>
cd comicwise

# Enable Corepack
corepack enable

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env.local
```

### 2. Configure Environment Variables

Edit `.env.local` with the following:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/comicwise"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"

# Email (SMTP)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@comicwise.com"

# Upload Provider (choose one)
UPLOAD_PROVIDER="cloudinary"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# ImageKit
IMAGEKIT_PUBLIC_KEY="your-public-key"
IMAGEKIT_PRIVATE_KEY="your-private-key"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your-id"

# Redis (Upstash)
UPSTASH_REDIS_REST_URL="your-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"

# QStash (Background Jobs)
QSTASH_URL="https://qstash.upstash.io"
QSTASH_TOKEN="your-qstash-token"
```

### 3. Database Setup

```bash
# Push schema to database
pnpm db:push

# Seed database with sample data
pnpm db:seed

# Or use verbose mode
pnpm db:seed:verbose

# Open Drizzle Studio to view data
pnpm db:studio
```

### 4. Start Development Server

```bash
# Start dev server with Turbopack
pnpm dev

# Or with debug mode
pnpm dev:debug

# Or with HTTPS
pnpm dev:https
```

Visit: http://localhost:3000

---

## 🏗️ Project Structure

```
comicwise/
├── .github/                    # GitHub Actions workflows
├── .vscode/                    # VS Code configuration
│   ├── extensions.json        # Recommended extensions
│   ├── launch.json            # Debug configurations
│   ├── mcp.json               # MCP server configurations
│   ├── settings.json          # Editor settings
│   └── tasks.json             # Build tasks
├── compose/                    # Docker compose utilities
├── docs/                       # Documentation
├── public/                     # Static assets
├── scripts/                    # Build & utility scripts
├── src/
│   ├── app/                   # Next.js app directory
│   │   ├── (auth)/           # Auth routes (login, register)
│   │   ├── (root)/           # Main app routes
│   │   ├── admin/            # Admin dashboard
│   │   └── api/              # API routes
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── blocks/          # Compound components
│   │   ├── layout/          # Layout components
│   │   ├── emails/          # Email templates
│   │   └── admin/           # Admin components
│   ├── database/            # Database layer
│   │   ├── schema.ts        # Drizzle schemas
│   │   ├── db.ts            # Database client
│   │   ├── queries/         # Query functions
│   │   ├── mutations/       # Mutation functions
│   │   └── seed/            # Seed scripts
│   ├── lib/                 # Utilities & helpers
│   │   ├── actions/         # Server actions
│   │   ├── validations/     # Zod schemas
│   │   ├── auth.ts          # NextAuth helpers
│   │   ├── authConfig.ts    # NextAuth configuration
│   │   └── utils.ts         # Utility functions
│   ├── dal/                 # Data Access Layer
│   ├── dto/                 # Data Transfer Objects
│   ├── hooks/               # Custom React hooks
│   ├── services/            # Service layer
│   ├── stores/              # State management (Zustand/Jotai)
│   ├── styles/              # Global styles
│   ├── types/               # TypeScript types
│   └── tests/               # Test files
├── .env.local              # Local environment variables
├── .prettierrc.ts          # Prettier configuration
├── app-config.ts           # App-wide configuration
├── components.json         # shadcn/ui configuration
├── docker-compose.yml      # Production Docker setup
├── docker-compose.dev.yml  # Development Docker setup
├── drizzle.config.ts       # Drizzle configuration
├── eslint.config.ts        # ESLint 9 flat config
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies & scripts
├── playwright.config.ts    # Playwright configuration
├── postcss.config.mjs      # PostCSS configuration
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── vitest.config.ts        # Vitest configuration
```

---

## 🚀 Development Workflow

### Available Scripts

```bash
# Development
pnpm dev                    # Start dev server
pnpm dev:debug             # Start with Node inspector
pnpm dev:https             # Start with HTTPS

# Build & Production
pnpm build                 # Production build
pnpm start                 # Start production server
pnpm build:analyze         # Build with bundle analyzer

# Code Quality
pnpm validate              # Run type-check, lint, format check
pnpm type-check            # TypeScript validation
pnpm lint                  # Run ESLint
pnpm lint:fix              # Fix linting issues
pnpm format                # Format code with Prettier

# Testing
pnpm test                  # Run E2E tests (Playwright)
pnpm test:ui               # Open Playwright UI
pnpm test:unit             # Run unit tests (Vitest)
pnpm test:unit:watch       # Watch mode
pnpm test:all              # Run all tests

# Database
pnpm db:push               # Push schema to database
pnpm db:generate           # Generate migrations
pnpm db:migrate            # Run migrations
pnpm db:studio             # Open Drizzle Studio
pnpm db:seed               # Seed database
pnpm db:reset              # Drop, recreate, seed

# Docker
pnpm docker:up             # Start containers
pnpm docker:down           # Stop containers
pnpm docker:build          # Build images
pnpm docker:clean          # Remove containers & volumes

# Utilities
pnpm clean                 # Clean build artifacts
pnpm clean:all             # Clean everything
pnpm health:all            # Run health checks
pnpm cache:clear           # Clear cache
```

### CLI System

ComicWise includes a powerful CLI for common tasks:

```bash
# Access interactive CLI
pnpm cli

# Or use the bin shortcut
./bin/comicwise

# Windows
node bin/comicwise.mjs
```

---

## 🎨 Component Development

### Adding shadcn/ui Components

```bash
# Add a component
pnpm dlx shadcn@latest add button

# Add multiple components
pnpm dlx shadcn@latest add button card dialog
```

### Creating New Components

```bash
# Use scaffolding tool
pnpm scaffold component <ComponentName>

# Creates:
# - src/components/<ComponentName>.tsx
# - Component with TypeScript
# - Boilerplate code
```

---

## 🗄️ Database Operations

### Schema Changes

1. Edit `src/database/schema.ts`
2. Push changes:
   ```bash
   pnpm db:push
   ```
3. Or generate migration:
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

### Seeding Data

```bash
# Seed all data
pnpm db:seed

# Seed specific tables
pnpm db:seed:users
pnpm db:seed:comics
pnpm db:seed:chapters

# Dry run (preview without changes)
pnpm db:seed:dry-run

# Verbose output
pnpm db:seed:verbose
```

---

## 🖼️ Image Upload

### Configuring Upload Provider

Set in `.env.local`:

```env
UPLOAD_PROVIDER="cloudinary"  # or "imagekit" or "local"
```

### Bulk Upload

```bash
# Upload images from directory
pnpm upload:bulk

# Specify provider
pnpm upload:bulk:cloudinary
pnpm upload:bulk:imagekit

# Dry run
pnpm upload:bulk:dry-run
```

---

## 🔐 Authentication

### NextAuth Configuration

Located in `src/lib/authConfig.ts`:

- Email/Password authentication
- OAuth providers (Google, GitHub)
- Database sessions
- Role-based access control

### Auth Helpers

```typescript
import { auth, signIn, signOut } from "@/lib/auth";

// Get session
const session = await auth();

// Sign in
await signIn("credentials", { email, password });

// Sign out
await signOut();
```

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)

```bash
# Run tests
pnpm test:unit:run

# Watch mode
pnpm test:unit

# Coverage
pnpm test:unit:coverage

# UI mode
pnpm test:unit:ui
```

### E2E Tests (Playwright)

```bash
# Run all tests
pnpm test

# UI mode
pnpm test:ui

# Debug mode
pnpm test:debug

# Headed mode
pnpm test:headed
```

---

## 🐳 Docker Deployment

### Development Environment

```bash
# Start all services
docker-compose -f docker-compose.dev.yml up -d

# Services started:
# - PostgreSQL (port 5433)
# - Redis (port 6380)
# - PgAdmin (port 5051)
# - App (port 3000)

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
```

### Production Environment

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 📊 Monitoring & Health

### Health Checks

```bash
# Check all services
pnpm health:all

# Individual checks
pnpm health:db       # Database connectivity
pnpm health:redis    # Redis connectivity
pnpm health:check    # Application health
```

### Cache Management

```bash
# View cache stats
pnpm cache:stats

# Clear cache
pnpm cache:clear

# Redis operations
pnpm redis:cli       # Open Redis CLI
pnpm redis:flush     # Flush all data
```

---

## 🎯 Scaffolding & Code Generation

### Component Scaffolding

```bash
# Interactive mode
pnpm scaffold

# Direct creation
pnpm scaffold:component <name>
pnpm scaffold:hook <name>
pnpm scaffold:action <name>
```

### Templates Available

- React Component (TSX)
- Server Action
- Custom Hook
- Email Template
- API Route
- Database Query
- Test File

---

## 🔧 Configuration Files

### TypeScript Paths

Custom import aliases in `tsconfig.json`:

```json
{
  "paths": {
    "@/*": ["./src/*"],
    "ui": ["./src/components/ui/*"],
    "lib": ["./src/lib/*"],
    "actions": ["./src/lib/actions/*"],
    "database": ["./src/database/*"],
    "schema": ["./src/database/schema.ts"],
    "types": ["./src/types/*"],
    "hooks": ["./src/hooks/*"]
  }
}
```

### ESLint Configuration

Using ESLint 9 flat config in `eslint.config.ts`:

- TypeScript support
- Next.js rules
- React hooks rules
- Accessibility rules
- Security rules
- Import sorting

---

## 🚨 Troubleshooting

### Common Issues

**Database Connection Error:**
```bash
# Check PostgreSQL is running
pnpm health:db

# Verify DATABASE_URL in .env.local
# Restart database
docker-compose -f docker-compose.dev.yml restart postgres
```

**Build Errors:**
```bash
# Clear cache
pnpm clean:cache

# Reinstall dependencies
pnpm clean:all
pnpm install

# Check for type errors
pnpm type-check
```

**Redis Connection Error:**
```bash
# Check Redis is running
pnpm health:redis

# Restart Redis
docker-compose -f docker-compose.dev.yml restart redis
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Run `pnpm validate` before committing
5. Submit pull request

---

## 📝 License

MIT License - See LICENSE file for details

---

**Generated:** 2025-12-24  
**Version:** 1.0.0  
**Maintainer:** ComicWise Development Team
