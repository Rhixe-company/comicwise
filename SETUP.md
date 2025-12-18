# ComicWise - Local Development Setup Guide

> Complete setup instructions for developers to get ComicWise running locally in
> under 15 minutes.

## 📋 Table of Contents

- [System Requirements](#system-requirements)
- [Quick Start (5 minutes)](#quick-start-5-minutes)
- [Detailed Setup](#detailed-setup)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Development Commands](#development-commands)
- [Docker Setup (Alternative)](#docker-setup-alternative)
- [Troubleshooting](#troubleshooting)

## 🔧 System Requirements

### Minimum Requirements

- **Node.js**: 20.x or higher
- **pnpm**: 9.x or higher
- **PostgreSQL**: 16+ (local or Docker)
- **Redis**: 7.x (optional, for caching/jobs)
- **OS**: macOS, Linux, or Windows (WSL2 recommended for Windows)

### Recommended Development Tools

- **Git**: Latest version
- **Docker & Docker Compose**: Latest (optional, for containerized setup)
- **VS Code**: Latest with recommended extensions

## ⚡ Quick Start (5 minutes)

For experienced developers, here's the fastest way to get running:

```bash
# 1. Install dependencies
pnpm install

# 2. Create environment file
cp .env.example .env.local

# 3. Start PostgreSQL (via Docker, if not running locally)
docker run -d \
  --name comicwise-postgres \
  -e POSTGRES_DB=comicwise_dev \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:17-alpine

# 4. Set up database
pnpm db:push        # Apply schema migrations
pnpm db:seed        # Populate with sample data

# 5. Start development server
pnpm dev

# 6. Open browser
# App: http://localhost:3000
# Database Studio: pnpm db:studio
```

## 📖 Detailed Setup

### Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-org/comicwise.git
cd comicwise

# Install dependencies with pnpm
pnpm install

# Verify installation
pnpm info
```

**Note**: This project uses **pnpm** for package management. Installing with npm
or yarn is not recommended.

### Step 2: Environment Configuration

#### Create `.env.local` File

```bash
# Copy the example file
cp .env.example .env.local

# Edit with your settings (see Configuration section)
code .env.local  # or your preferred editor
```

### Step 3: Database Setup

#### Option A: PostgreSQL via Docker (Recommended for Development)

```bash
# Start PostgreSQL container
docker run -d \
  --name comicwise-postgres \
  -e POSTGRES_DB=comicwise_dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:17-alpine

# Verify connection
docker exec comicwise-postgres pg_isready -U postgres
```

#### Option B: Local PostgreSQL Installation

**macOS (Homebrew)**:

```bash
brew install postgresql
brew services start postgresql

# Create database
createdb comicwise_dev
```

**Linux (Ubuntu/Debian)**:

```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start

# Create database
sudo -u postgres createdb comicwise_dev
```

**Windows (WSL2)**:

```bash
# Inside WSL2 terminal
sudo apt-get install postgresql
sudo service postgresql start

# Create database
sudo -u postgres createdb comicwise_dev
```

#### Verify Database Connection

```bash
# Test connection
psql -U postgres -d comicwise_dev -c "SELECT version();"
```

### Step 4: Initialize Database Schema

```bash
# Generate migrations from schema (if needed)
pnpm db:generate

# Apply migrations to database
pnpm db:push

# View database in Drizzle Studio (interactive browser UI)
pnpm db:studio
```

**Studio Access**: Opens at http://localhost:5555

### Step 5: Seed Sample Data

```bash
# Seed database with sample data
pnpm db:seed

# Options:
pnpm db:seed:dry-run          # Preview changes without applying
pnpm db:seed:verbose          # Detailed logging
pnpm db:seed:no-images        # Skip image downloads
pnpm db:seed:users-only       # Only seed users
pnpm db:seed:comics-only      # Only seed comics
pnpm db:seed:chapters-only    # Only seed chapters
```

**Default Sample Data**:

- 5 users (with test accounts)
- 50 comics with metadata
- 200 chapters across comics

### Step 6: Start Development Server

```bash
# Start with hot-reload enabled (Turbopack)
pnpm dev

# Alternative: With debugging
pnpm dev:debug

# Alternative: With HTTPS
pnpm dev:https
```

**Server running at**: http://localhost:3000

## 🌍 Environment Configuration

### Copy and Customize `.env.local`

Create your `.env.local` file from `.env.example`:

```bash
cp .env.example .env.local
```

### Required Environment Variables

These **must** be set for the application to run:

```env
# Node Environment
NODE_ENV=development
PORT=3000

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTH_URL=http://localhost:3000

# Database Connection
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/comicwise_dev

# Authentication Secret (Generate with: openssl rand -base64 32)
AUTH_SECRET=your-generated-secret-here-min-32-chars
```

### Optional Environment Variables

```env
# OAuth Providers (optional)
AUTH_GOOGLE_CLIENT_ID=
AUTH_GOOGLE_CLIENT_SECRET=
AUTH_GITHUB_CLIENT_ID=
AUTH_GITHUB_CLIENT_SECRET=

# File Upload Configuration
UPLOAD_PROVIDER=local  # Options: local, imagekit, cloudinary

# Redis Configuration (for caching)
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# Email Configuration (for email verification)
EMAIL_SERVER_HOST=localhost
EMAIL_SERVER_PORT=1025
EMAIL_SERVER_USER=
EMAIL_SERVER_PASSWORD=
EMAIL_FROM=noreply@comicwise.local

# Image Hosting Services
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Background Jobs (QStash)
QSTASH_TOKEN=
QSTASH_CURRENT_SIGNING_KEY=
QSTASH_NEXT_SIGNING_KEY=
```

### Generating AUTH_SECRET

```bash
# Generate a secure 32+ character secret
openssl rand -base64 32

# Copy the output to AUTH_SECRET in .env.local
```

### Environment Variable Validation

The application validates environment variables on startup using Zod schemas. If
a required variable is missing:

```
Error: Missing required environment variable: DATABASE_URL
Expected: string
Received: undefined
```

## 🗄️ Database

### Schema Overview

ComicWise uses the following main tables:

```
users          - User accounts & authentication
comics         - Comic metadata (title, description, genre)
chapters       - Individual comic chapters
bookmarks      - User reading progress
ratings        - User ratings & reviews
comments       - Discussion comments
```

### Common Database Commands

```bash
# Open interactive database explorer
pnpm db:studio

# Generate migrations from schema changes
pnpm db:generate

# Apply migrations to database
pnpm db:push

# Rollback schema changes (irreversible - use with caution)
pnpm db:drop

# Check schema for issues
pnpm db:check

# Back up database
pnpm db:backup  # Creates backup-YYYYMMDD-HHMMSS.sql

# Reset database completely
pnpm db:reset   # Drops all data and re-seeds
```

### Viewing Database Contents

**Option 1: Drizzle Studio (Recommended)**

```bash
pnpm db:studio
# Opens browser at http://localhost:5555
```

**Option 2: psql CLI**

```bash
psql -U postgres -d comicwise_dev

# Common commands:
# \dt              - List all tables
# \d users         - Describe 'users' table
# SELECT * FROM users LIMIT 5;  - View first 5 users
# \q              - Quit
```

## 🚀 Running the Application

### Development Mode

```bash
# Standard development server (hot-reload via Turbopack)
pnpm dev

# Open http://localhost:3000
```

**Features**:

- ✅ Fast refresh with Turbopack
- ✅ Server component streaming
- ✅ API route hot reload
- ✅ TypeScript checking

### Production Build

```bash
# Build optimized production bundle
pnpm build

# Start production server
pnpm start

# Or use production mode directly
pnpm start:prod
```

### Linting and Type Checking

```bash
# Run TypeScript type checker
pnpm type-check

# Run ESLint
pnpm lint

# Fix linting issues automatically
pnpm lint:fix

# Strict mode (fail on any warnings)
pnpm lint:strict

# Check code formatting
pnpm format:check

# Auto-format code
pnpm format
```

### Code Quality Validation

```bash
# Run all validation checks (type-check + lint + format)
pnpm validate

# Run type-check in watch mode (auto-recheck on changes)
pnpm type-check:watch
```

## 📚 Development Commands

### Development Server

```bash
pnpm dev              # Start with Turbopack
pnpm dev:debug        # Start with Node debugger
pnpm dev:https        # Start with HTTPS support
```

### Testing

```bash
# Unit tests (Vitest)
pnpm test:unit        # Watch mode
pnpm test:unit:run    # Single run
pnpm test:unit:ui     # Visual UI
pnpm test:unit:coverage  # With coverage report

# E2E tests (Playwright)
pnpm test             # All tests
pnpm test:headed      # With browser visible
pnpm test:debug       # With debugger
pnpm test:ui          # Interactive UI
pnpm test:auth        # Only auth tests
pnpm test:crud        # Only CRUD tests
pnpm test:report      # View last test report
```

### Database

```bash
pnpm db:seed          # Populate with sample data
pnpm db:seed:dry-run  # Preview without applying
pnpm db:seed:verbose  # With detailed logging
pnpm db:studio        # Open database explorer
```

### Building & Analysis

```bash
pnpm build            # Production build
pnpm build:analyze    # Build with bundle analysis
pnpm build:debug      # Build with debug symbols
bundle-size           # Check bundle size limits
```

### Utilities

```bash
pnpm type-check       # TypeScript validation
pnpm lint             # ESLint check
pnpm format           # Prettier formatting
pnpm clean            # Remove build artifacts
pnpm info             # Show Next.js info
pnpm lighthouse       # Run Lighthouse audit
```

## 🐳 Docker Setup (Alternative)

### Using Docker Compose (Full Stack)

```bash
# Start all services (PostgreSQL, Redis, Next.js)
docker compose up -d

# For development with hot-reload
docker compose -f docker-compose.dev.yml up -d

# View logs
docker compose logs -f app

# Stop services
docker compose down

# Remove volumes and start fresh
docker compose down -v
```

### Docker Compose Services

- **PostgreSQL** (port 5432): Database
- **Redis** (port 6379): Cache/sessions
- **Next.js App** (port 3000): Application

### Running Commands in Docker

```bash
# Seed database
docker compose exec app pnpm db:seed

# Open database studio
docker compose exec app pnpm db:studio

# Run tests
docker compose exec app pnpm test:unit:run

# Check logs
docker compose logs -f app --tail 100
```

### Building Custom Docker Image

```bash
# Production build
docker compose build

# Push to registry
docker tag comicwise-app:latest your-registry/comicwise:latest
docker push your-registry/comicwise:latest
```

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### 1. "DATABASE_URL is not defined"

**Problem**: Environment variable not found

**Solution**:

```bash
# Ensure .env.local exists and has DATABASE_URL
cp .env.example .env.local
# Edit .env.local with your database URL
```

#### 2. "Cannot connect to PostgreSQL"

**Problem**: Database service not running

**Solution**:

```bash
# Check PostgreSQL status
docker ps | grep postgres

# Start PostgreSQL if not running
docker run -d \
  --name comicwise-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:17-alpine

# Test connection
PGPASSWORD=postgres psql -h localhost -U postgres -d comicwise_dev -c "\dt"
```

#### 3. "pnpm: command not found"

**Problem**: pnpm not installed

**Solution**:

```bash
# Install pnpm globally
npm install -g pnpm

# Verify installation
pnpm --version  # Should be 9.x or higher
```

#### 4. "TypeScript errors after pnpm install"

**Problem**: Type definitions not generated

**Solution**:

```bash
# Clear cache and reinstall
pnpm clean
pnpm install
pnpm type-check

# If still failing, regenerate types
rm -rf .next
pnpm build
```

#### 5. Port 3000 already in use

**Problem**: Another process using port 3000

**Solution (Windows)**:

```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or use different port
PORT=3001 pnpm dev
```

**Solution (macOS/Linux)**:

```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 pnpm dev
```

#### 6. "Auth secret is too short"

**Problem**: AUTH_SECRET is less than 32 characters

**Solution**:

```bash
# Generate proper secret
openssl rand -base64 32

# Set in .env.local
AUTH_SECRET=<generated-secret>
```

#### 7. Seed script fails with "Connection timeout"

**Problem**: Database not accessible during seeding

**Solution**:

```bash
# Ensure database is running
docker ps | grep postgres

# Wait for database to be ready
sleep 5

# Try seeding again
pnpm db:seed

# Use dry-run to debug
pnpm db:seed:dry-run
```

### Getting Help

1. **Check logs**: `pnpm dev` shows detailed error messages
2. **Database logs**: `docker compose logs postgres`
3. **Type errors**: `pnpm type-check` shows TypeScript issues
4. **Linting**: `pnpm lint` identifies code issues

### Health Check

Verify everything is working:

```bash
# Run all validation checks
pnpm validate

# Should see:
# ✓ TypeScript type-check passed
# ✓ ESLint check passed
# ✓ Prettier format check passed

# Test database connection
pnpm db:studio  # Should open successfully

# Test build
pnpm build
```

## 📝 First Time Setup Checklist

- [ ] Node.js 20+ installed (`node --version`)
- [ ] pnpm 9+ installed (`pnpm --version`)
- [ ] PostgreSQL running (local or Docker)
- [ ] `.env.local` created and configured
- [ ] `pnpm install` completed without errors
- [ ] `pnpm db:push` applied schema
- [ ] `pnpm db:seed` populated sample data
- [ ] `pnpm dev` starts without errors
- [ ] http://localhost:3000 loads in browser
- [ ] Can log in with test account

## 🎯 Next Steps

After setup is complete:

1. **Explore the codebase**:
   - `src/app` - Next.js app router pages
   - `src/components` - React components
   - `src/database` - Drizzle schema & queries
   - `src/lib` - Utilities and helpers

2. **Run tests**:

   ```bash
   pnpm test:unit:run    # Unit tests
   pnpm test --headed    # E2E tests in browser
   ```

3. **Read documentation**:
   - `README.md` - Project overview
   - `DEVELOPER_QUICK_REFERENCE.md` - Development tips
   - `.github/` - GitHub workflows and CI/CD

4. **Make your first contribution**:
   - Create a feature branch: `git checkout -b feature/your-feature`
   - Make changes and test: `pnpm validate`
   - Commit with clear message: `git commit -m "feat: your description"`
   - Push and create pull request

## 📞 Support

For issues or questions:

1. Check this guide's **Troubleshooting** section
2. Review existing GitHub issues
3. Check project documentation in `/docs`
4. Ask on project Discord/Slack

---

**Happy coding! 🚀**

_Last updated: December 15, 2025_
